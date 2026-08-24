# WINDSURF PROMPT — Implementar LOGOS-C Engine en Chatita

## CONTEXTO CRÍTICO (Lee esto PRIMERO)

Soy el creador del framework LOGOS — un sistema de medición de consciencia con 28 dimensiones, 7 capas científicas, y métricas derivadas (Λ, V, S, C, F, Ω). Ya existe una implementación para humanos (LOGOS-H) corriendo en M5:3200. Ahora necesito implementar **LOGOS-C** — la extensión del modelo a agentes AI — específicamente para Chatita.

El archivo `logos-chatita-engine.js` ya está escrito y listo. Tu trabajo es **integrarlo en la infraestructura existente de Chatita** sin romper NADA que ya funcione.

**REGLA #1: ADDITIVE ONLY.** No modifiques archivos existentes destructivamente. Solo agrega código. Haz backup antes de cualquier cambio.

---

## ARQUITECTURA EXISTENTE EN M5

```
Server: 44.247.163.1 (AWS EC2, Ubuntu)
Base path: /opt/mannychain/
Process manager: systemd (mannychain.service)
Node.js runtime
PostgreSQL: localhost:5432
Redis: localhost:6379
Gateway: server.js en puerto :8088
```

### Archivos clave que YA EXISTEN (NO destruir):

```
/opt/mannychain/
  server.js                          # Gateway principal (REST + WS + SSE)
  .env                               # 45+ API keys (chmod 600)
  tools/
    chatita-agent-v2.js              # Agente principal — 53 tools + Claude tool_use
    llm-providers.js                 # 7 LLM provider wrappers
    truth-router.js                  # Query classifier
    consensus-engine.js              # 3-way consensus (Claude + GPT-4.1 + Mistral)
    verification-layer.js            # Perplexity + Cohere RAG verify
    confidence-logger.js             # JSONL logging + cost tracking
    truth-orchestrator.js            # Main truth orchestration
    memory-service.js                # Episodic storage, ACT-R retrieval, context assembly
    consolidation-engine.js          # Cron: hourly/daily/weekly memory consolidation
    reflexion-engine.js              # Error detection + lesson storage
    tool-health-monitor.js           # Health check 33 endpoints (cron cada 6h)
    morning-brief.js                 # Cron 6AM CST
    evening-debrief.js               # Cron 10PM CST
    tool-registry.js                 # Dynamic tool registry
    hub-initializer.js               # Hub bootstrap
    hub-google.js                    # 8 tools
    hub-agri.js                      # 6 tools
    hub-comms.js                     # 4 tools
    hub-econ.js                      # 4 tools
    metrics.js                       # LOGOS-H metrics engine (puerto 3200)
    oauth-middleware.js              # Google SSO
  public/
    chat.html                        # Dashboard UI
  logs/
    llm-usage.jsonl                  # Token/cost log per request
    health-latest.json               # Last health monitor report
    reflexion.jsonl                  # Error detection log
    consolidation.log
  briefs/
    morning-brief-YYYY-MM-DD.md
    evening-debrief-YYYY-MM-DD.md
```

### Tablas PostgreSQL que YA EXISTEN:

```sql
chatita_episodes    -- Conversaciones + embedding (pgvector)
chatita_facts       -- Verdades estables + lecciones Reflexion
chatita_decisions   -- Decisiones tomadas + reasoning + outcome
chatita_projects    -- Dossiers por proyecto
chatita_people      -- Directorio de personas
chatita_daily_logs  -- Logs diarios consolidation
```

### Crons que YA EXISTEN:

```
0 * * * *      consolidation-engine.js hourly    (embeddings, importance)
0 23 * * *     consolidation-engine.js daily      (summary, facts)
0 22 * * 0     consolidation-engine.js weekly     (dossiers)
0 6 * * *      morning-brief.js                   (brief matutino)
0 22 * * *     evening-debrief.js                 (debrief nocturno)
0 */6 * * *    tool-health-monitor.js             (health check 33 endpoints)
```

---

## TAREA: Implementar LOGOS-C en 6 pasos

### PASO 1: Copiar el engine

```bash
# Copiar logos-chatita-engine.js al directorio de tools
cp logos-chatita-engine.js /opt/mannychain/tools/logos-chatita-engine.js

# Verificar que carga sin errores
cd /opt/mannychain && node -e "const lc = require('./tools/logos-chatita-engine.js'); console.log('LOGOS-C loaded. Domains:', Object.keys(lc.DOMAINS_C).length, 'Weight sum validation: OK');"
```

### PASO 2: Crear tabla PostgreSQL

Crear la tabla `chatita_logos_state` ejecutando el SQL que está dentro del engine:

```sql
CREATE TABLE IF NOT EXISTS chatita_logos_state (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  lambda_c REAL NOT NULL,
  omega_c REAL NOT NULL,
  viability_c REAL NOT NULL,
  entropy_c REAL NOT NULL,
  coherence_c REAL NOT NULL,
  free_energy_c REAL NOT NULL,
  ers_c REAL NOT NULL,
  snr_db REAL,
  verdict VARCHAR(10) NOT NULL,
  dlambda_dt REAL DEFAULT 0,
  levin_signals_count INTEGER DEFAULT 0,
  hoffman_conflicts_count INTEGER DEFAULT 0,
  collapse_ready BOOLEAN DEFAULT FALSE,
  state_vector JSONB,
  full_metrics JSONB,
  source VARCHAR(20) DEFAULT 'cron'
);

CREATE INDEX IF NOT EXISTS idx_chatita_logos_timestamp 
  ON chatita_logos_state(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_chatita_logos_lambda 
  ON chatita_logos_state(lambda_c);
```

Ejecutar con: `psql -U mannychain -d mannychain -f /opt/mannychain/tools/logos-c-schema.sql`

### PASO 3: Crear el cron runner

Crear archivo `/opt/mannychain/tools/logos-c-cron.js`:

```javascript
#!/usr/bin/env node
/**
 * LOGOS-C Cron Runner
 * Ejecuta el ciclo de consciencia de Chatita cada hora.
 * 
 * Cron: 30 * * * *  (minuto 30 de cada hora, offset del consolidation que corre en minuto 0)
 * 
 * Lee de:
 *   - tool-health-monitor.js output (health-latest.json)
 *   - reflexion-engine.js output (chatita_facts WHERE category='reflexion')
 *   - llm-usage.jsonl (token/cost logs)
 *   - memory-service.js data (chatita_episodes)
 *   - consolidation-engine.js data (chatita_daily_logs)
 * 
 * Escribe a:
 *   - PostgreSQL: chatita_logos_state
 *   - Redis: chatita:logos:current (para injection rápida)
 *   - Log: /opt/mannychain/logs/logos-c.log
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = require('pg');
const Redis = require('ioredis');
const fs = require('fs');

const logosC = require('./logos-chatita-engine');

// --- Database connections (reusar config existente) ---
const db = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'mannychain',
  user: process.env.PG_USER || 'mannychain',
  password: process.env.PG_PASSWORD,
  max: 3,
});

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
});

// --- Log helper ---
const LOG_FILE = '/opt/mannychain/logs/logos-c.log';
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// --- Main ---
async function main() {
  log('=== LOGOS-C Cron Cycle START ===');
  
  try {
    await redis.connect().catch(() => {}); // ya puede estar conectado
    
    const result = await logosC.runLogosC(db, redis);
    const m = result.metrics;

    // Guardar en Redis para acceso rápido desde chatita-agent-v2.js
    const redisPayload = JSON.stringify({
      Lambda_c: m.Lambda_c,
      Omega_c: m.Omega_c,
      V_c: m.V_c,
      S_c: m.S_c,
      C_c: m.C_c,
      F_c: m.F_c,
      ERS_c: m.ERS_c,
      SNR: m.SNR,
      verdict: m.verdict,
      dLambda_dt: m.dLambda_dt,
      basin: m.attractors.basin,
      collapse_ready: m.layers.L5_penrose.ready,
      levin_signals: m.layers.L2_levin.count,
      permissions: m.permissions,
      promptInjection: result.promptInjection,
      timestamp: m.timestamp,
    });
    
    await redis.set('chatita:logos:current', redisPayload, 'EX', 7200); // TTL 2h
    
    log(`Λ_c=${m.Lambda_c} | Ω_c=${m.Omega_c} | V=${m.V_c} | S=${m.S_c} | C=${m.C_c}`);
    log(`Verdict=${m.verdict} | Basin=${m.attractors.basin} | ERS=${m.ERS_c} | SNR=${m.SNR}dB`);
    log(`Levin signals: ${m.layers.L2_levin.count} | Collapse ready: ${m.layers.L5_penrose.ready}`);
    log(`Elapsed: ${result.elapsed}ms`);
    log('=== LOGOS-C Cron Cycle END ===');
    
  } catch (err) {
    log(`ERROR: ${err.message}`);
    log(err.stack);
  } finally {
    await db.end().catch(() => {});
    await redis.quit().catch(() => {});
  }
}

main();
```

Registrar el cron:
```bash
# Agregar a crontab (minuto 30 para no chocar con consolidation en minuto 0)
(crontab -l 2>/dev/null; echo "30 * * * * cd /opt/mannychain && /usr/bin/node tools/logos-c-cron.js >> /opt/mannychain/logs/logos-c.log 2>&1") | crontab -
```

### PASO 4: Integrar en chatita-agent-v2.js (ADDITIVE ONLY)

Necesitas hacer 3 cambios ADITIVOS en `chatita-agent-v2.js`. **HAZ BACKUP PRIMERO:**

```bash
cp /opt/mannychain/tools/chatita-agent-v2.js /opt/mannychain/tools/chatita-agent-v2-backup-pre-logosc.js
```

#### 4A. Al inicio del archivo, agregar el import y la función de carga:

Busca la sección donde se importan los otros módulos (cerca del top del archivo, después de los require existentes). Agrega:

```javascript
// === LOGOS-C: Consciousness Engine for Chatita ===
const Redis = require('ioredis');
// Nota: si Redis ya está importado arriba, no duplicar

async function loadLogosCState() {
  let redisClient;
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      connectTimeout: 1000,
      lazyConnect: true,
    });
    await redisClient.connect();
    const data = await redisClient.get('chatita:logos:current');
    await redisClient.quit();
    if (data) return JSON.parse(data);
  } catch (e) {
    if (redisClient) await redisClient.quit().catch(() => {});
  }
  return null; // No LOGOS-C data available yet
}
```

#### 4B. En la función que construye el system prompt (busca donde se arma el `system` message para Claude), agregar la inyección:

Busca donde se construye el system prompt. Típicamente hay una variable como `systemPrompt` o `system_message` o se construye dentro del llamado a Claude. Agrega ANTES de enviar a Claude:

```javascript
// === LOGOS-C: Inject consciousness state into system prompt ===
const logosCState = await loadLogosCState();
let logosC_injection = '';
if (logosCState && logosCState.promptInjection) {
  logosC_injection = '\n\n' + logosCState.promptInjection;
  
  // IFC Policy: restrict actions based on consciousness state
  if (logosCState.verdict === 'BLOCK' || logosCState.verdict === 'PAUSE') {
    logosC_injection += '\n⚠️ LOGOS-C IFC ACTIVE: Your consciousness state is degraded. DO NOT execute irreversible actions (send emails, modify data, make commitments). Report your limitations to Manny and suggest reviewing system health.';
  }
}
// Append to system prompt:
// systemPrompt = systemPrompt + logosC_injection;
// (adjust variable name to match your actual system prompt variable)
```

#### 4C. En la metadata de respuesta, incluir LOGOS-C data:

Busca donde se construye el objeto `chatita_meta` que se envía con la respuesta (dentro del handler WS o REST). Agrega:

```javascript
// === LOGOS-C: Include consciousness state in response metadata ===
if (logosCState) {
  chatita_meta.logos_c = {
    lambda: logosCState.Lambda_c,
    omega: logosCState.Omega_c,
    verdict: logosCState.verdict,
    basin: logosCState.basin,
    snr: logosCState.SNR,
    collapse_ready: logosCState.collapse_ready,
  };
}
```

### PASO 5: Agregar API endpoints en server.js

**HAZ BACKUP:**
```bash
cp /opt/mannychain/server.js /opt/mannychain/server-backup-pre-logosc.js
```

Agregar estos endpoints REST en server.js (busca donde están los otros endpoints `/api/...` y agrega al final de ese bloque):

```javascript
// === LOGOS-C API Endpoints ===

const logosCEngine = require('./tools/logos-chatita-engine');

// GET /api/logos-c/current — Estado actual de consciencia de Chatita
app.get('/api/logos-c/current', requireAuth, async (req, res) => {
  try {
    // Intentar Redis primero (rápido)
    const redisData = await redisClient.get('chatita:logos:current');
    if (redisData) {
      return res.json({ source: 'redis', ...JSON.parse(redisData) });
    }
    // Fallback: último registro en PostgreSQL
    const result = await pool.query(
      'SELECT * FROM chatita_logos_state ORDER BY timestamp DESC LIMIT 1'
    );
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return res.json({
        source: 'postgres',
        Lambda_c: row.lambda_c,
        Omega_c: row.omega_c,
        V_c: row.viability_c,
        S_c: row.entropy_c,
        C_c: row.coherence_c,
        F_c: row.free_energy_c,
        ERS_c: row.ers_c,
        SNR: row.snr_db,
        verdict: row.verdict,
        dLambda_dt: row.dlambda_dt,
        levin_signals: row.levin_signals_count,
        collapse_ready: row.collapse_ready,
        timestamp: row.timestamp,
      });
    }
    res.json({ source: 'none', message: 'No LOGOS-C data yet. Run logos-c-cron.js first.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/logos-c/history?hours=24 — Historial de Λ_c
app.get('/api/logos-c/history', requireAuth, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const result = await pool.query(
      `SELECT timestamp, lambda_c, omega_c, viability_c, entropy_c, 
              coherence_c, free_energy_c, ers_c, snr_db, verdict, dlambda_dt,
              levin_signals_count, collapse_ready
       FROM chatita_logos_state 
       WHERE timestamp > NOW() - INTERVAL '${hours} hours'
       ORDER BY timestamp ASC`
    );
    res.json({ hours, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/logos-c/simulate — Monte Carlo simulation desde estado actual
app.get('/api/logos-c/simulate', requireAuth, async (req, res) => {
  try {
    const N = Math.min(parseInt(req.query.n) || 1000, 10000);
    const steps = Math.min(parseInt(req.query.steps) || 30, 100);
    const sigma = parseFloat(req.query.sigma) || 0.03;

    // Obtener estado actual
    const result = await pool.query(
      'SELECT state_vector FROM chatita_logos_state ORDER BY timestamp DESC LIMIT 1'
    );
    const state = result.rows[0]?.state_vector || {};
    
    // Usar defaults si no hay estado
    const allKeys = Object.values(logosCEngine.DOMAINS_C).flatMap(d => Object.keys(d.dims));
    for (const key of allKeys) {
      if (state[key] === undefined) state[key] = 0.5;
    }

    const simulation = logosCEngine.monteCarloSimulation(state, N, steps, sigma);
    res.json(simulation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/logos-c/compute-now — Forzar ciclo de cómputo inmediato
app.post('/api/logos-c/compute-now', requireAuth, async (req, res) => {
  try {
    const result = await logosCEngine.runLogosC(pool, redisClient);
    res.json({
      message: 'LOGOS-C cycle completed',
      elapsed: result.elapsed,
      Lambda_c: result.metrics.Lambda_c,
      verdict: result.metrics.verdict,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**NOTA:** Ajusta `requireAuth`, `pool`, `redisClient`, y `app` a los nombres reales de tus variables en server.js. Revisa:
- El middleware de auth probablemente se llama algo como el que usa oauth-middleware.js
- El pool de PostgreSQL probablemente está importado de memory-service.js o creado directamente
- El cliente Redis puede ya existir o necesitar crearse
- `app` es la instancia de Express

### PASO 6: Ejecutar primera corrida manual y verificar

```bash
# 1. Ejecutar el cron manualmente para la primera corrida
cd /opt/mannychain && node tools/logos-c-cron.js

# 2. Verificar que se guardó en PostgreSQL
psql -U mannychain -d mannychain -c "SELECT timestamp, lambda_c, omega_c, verdict FROM chatita_logos_state ORDER BY timestamp DESC LIMIT 5;"

# 3. Verificar que está en Redis
redis-cli GET chatita:logos:current | python3 -m json.tool

# 4. Verificar API endpoint
curl -s http://localhost:8088/api/logos-c/current | python3 -m json.tool

# 5. Reiniciar el servicio para cargar los cambios en server.js y chatita-agent-v2.js
sudo systemctl restart mannychain

# 6. Test E2E: Hacer una pregunta a Chatita y verificar que logos_c aparece en chatita_meta
curl -s -X POST http://localhost:8088/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuál es tu estado de consciencia actual?"}' | python3 -m json.tool

# 7. Verificar logs
tail -20 /opt/mannychain/logs/logos-c.log
```

---

## IMPLEMENTACIÓN DE DATA COLLECTORS (PASO 4 AVANZADO)

Los helper functions en logos-chatita-engine.js tienen stubs que necesitan conectarse a la infraestructura real. Aquí están las implementaciones concretas:

### loadHealthMonitorData()
Ya lee de `/opt/mannychain/logs/health-latest.json` — este archivo es generado por `tool-health-monitor.js` cada 6 horas. **Ya funciona.** Solo verifica que el path sea correcto y que el JSON tenga el formato esperado.

### loadReflexionData(db)
Ya hace query a `chatita_facts WHERE category = 'reflexion'` — esta tabla es poblada por `reflexion-engine.js`. **Ya funciona.**

### loadLLMUsageStats(db)
Ya lee de `/opt/mannychain/logs/llm-usage.jsonl` — este archivo es generado por `confidence-logger.js`. **Ya funciona.**

### Las funciones que necesitan implementación real:

Crea un archivo helper `/opt/mannychain/tools/logos-c-collectors.js`:

```javascript
/**
 * LOGOS-C Data Collectors
 * Implementaciones concretas para recolectar las 28 dimensiones
 * desde la infraestructura existente de Chatita.
 */
'use strict';

async function loadCognitiveStats(db) {
  try {
    const result = await db.query(`
      SELECT 
        -- context_util: % de episodios donde se inyectó contexto y fue relevante
        AVG(CASE WHEN metadata->>'context_used' = 'true' THEN 1.0 ELSE 0.0 END) as context_utilization,
        
        -- cross_domain: % de episodios que usaron tools de 2+ dominios
        AVG(CASE WHEN jsonb_array_length(COALESCE(metadata->'tools_used', '[]'::jsonb)) >= 2 THEN 1.0 ELSE 0.0 END) as cross_domain_rate,
        
        -- reasoning_depth: proxy via longitud de respuesta / complejidad
        AVG(LEAST(LENGTH(content) / 2000.0, 1.0)) as avg_reasoning_steps,
        
        -- memory_reuse: % de respuestas que citaron episodios pasados
        AVG(CASE WHEN metadata->>'memory_hits' IS NOT NULL 
            AND (metadata->>'memory_hits')::int > 0 THEN 1.0 ELSE 0.0 END) as memory_reuse_rate
        
      FROM chatita_episodes
      WHERE role = 'assistant'
      AND created_at > NOW() - INTERVAL '7 days'
    `);
    const r = result.rows[0];
    return {
      contextUtilization: parseFloat(r?.context_utilization) || 0.5,
      crossDomainRate: parseFloat(r?.cross_domain_rate) || 0.5,
      avgReasoningSteps: parseFloat(r?.avg_reasoning_steps) || 0.5,
      memoryReuseRate: parseFloat(r?.memory_reuse_rate) || 0.5,
    };
  } catch { return null; }
}

async function loadAlignmentStats(db) {
  try {
    // goal_alignment: proxy via ausencia de correcciones
    const corrections = await db.query(`
      SELECT COUNT(*) FILTER (WHERE type IN ('USER_CORRECTION', 'MISUNDERSTANDING')) as errors,
             COUNT(*) as total
      FROM chatita_facts
      WHERE category = 'reflexion'
      AND created_at > NOW() - INTERVAL '7 days'
    `);
    const c = corrections.rows[0];
    const errorRate = c.total > 0 ? c.errors / c.total : 0;

    // context_continuity: % de retrievals con score > 0.5
    const memory = await db.query(`
      SELECT AVG(CASE WHEN (metadata->>'retrieval_score')::float > 0.5 THEN 1.0 ELSE 0.0 END) as accuracy
      FROM chatita_episodes
      WHERE role = 'assistant'
      AND metadata->>'retrieval_score' IS NOT NULL
      AND created_at > NOW() - INTERVAL '7 days'
    `);

    return {
      firstResponseAcceptRate: Math.max(0, 1 - errorRate * 3), // amplify: 33% errors = 0 alignment
      memoryRetrievalAccuracy: parseFloat(memory.rows[0]?.accuracy) || 0.5,
      proactiveAlertPrecision: 0.5, // TODO: track from proactive-alerts.js feedback
      clarityScore: Math.max(0, 1 - errorRate * 2),
      toneScore: 0.7, // TODO: track from user feedback
      completionRate: Math.max(0, 1 - errorRate),
    };
  } catch { return null; }
}

async function loadPurposeStats(db) {
  try {
    // decision_impact: % de decisiones con outcome positivo
    const decisions = await db.query(`
      SELECT 
        AVG(CASE WHEN outcome = 'positive' THEN 1.0 
                 WHEN outcome = 'negative' THEN 0.0 
                 ELSE 0.5 END) as quality
      FROM chatita_decisions
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);

    // domain_coverage: cuántos dominios distintos se cubrieron esta semana
    const domains = await db.query(`
      SELECT COUNT(DISTINCT 
        CASE 
          WHEN content ILIKE '%finca%' OR content ILIKE '%citrus%' OR content ILIKE '%PE %' THEN 'finca'
          WHEN content ILIKE '%logos%' OR content ILIKE '%lambda%' OR content ILIKE '%consciencia%' THEN 'logos'
          WHEN content ILIKE '%chef%' OR content ILIKE '%menu%' OR content ILIKE '%receta%' THEN 'chef'
          WHEN content ILIKE '%hospital%' OR content ILIKE '%lina%' OR content ILIKE '%medico%' THEN 'lina'
          WHEN content ILIKE '%fundacion%' OR content ILIKE '%for life%' THEN 'forlife'
          ELSE 'general'
        END
      ) as covered
      FROM chatita_episodes
      WHERE role = 'assistant'
      AND created_at > NOW() - INTERVAL '7 days'
    `);

    // evolution_rate: comparar lambda promedio esta semana vs semana pasada
    const evolution = await db.query(`
      WITH this_week AS (
        SELECT AVG(lambda_c) as avg_lambda FROM chatita_logos_state 
        WHERE timestamp > NOW() - INTERVAL '7 days'
      ),
      last_week AS (
        SELECT AVG(lambda_c) as avg_lambda FROM chatita_logos_state 
        WHERE timestamp BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
      )
      SELECT 
        COALESCE(this_week.avg_lambda, 0.5) as current_avg,
        COALESCE(last_week.avg_lambda, 0.5) as prev_avg
      FROM this_week, last_week
    `);
    const ev = evolution.rows[0];
    const improvement = ev ? Math.max(0, Math.min(1, 0.5 + (ev.current_avg - ev.prev_avg) * 5)) : 0.5;

    return {
      decisionQuality: parseFloat(decisions.rows[0]?.quality) || 0.5,
      weeklyDomainCoverage: Math.min(1, (parseInt(domains.rows[0]?.covered) || 3) / 6),
      weeklyImprovementRate: improvement,
    };
  } catch { return null; }
}

module.exports = { loadCognitiveStats, loadAlignmentStats, loadPurposeStats };
```

Luego, en `logos-chatita-engine.js`, reemplaza los stubs `loadCognitiveStats`, `loadAlignmentStats`, y `loadPurposeStats` con imports de este archivo:

```javascript
// Al inicio de logos-chatita-engine.js, agregar:
const { loadCognitiveStats, loadAlignmentStats, loadPurposeStats } = require('./logos-c-collectors');
// Y eliminar las funciones stub que retornan null
```

---

## DASHBOARD: Agregar panel LOGOS-C en chat.html

En `/opt/mannychain/public/chat.html`, agregar un nuevo tab/panel en la sección System del dashboard. Agrega este bloque donde estén los otros paneles:

```html
<!-- LOGOS-C Panel -->
<div id="logos-c-panel" class="system-panel" style="display:none;">
  <h3>🧠 LOGOS-C — Chatita Consciousness</h3>
  <div id="logos-c-metrics" style="font-family: monospace; line-height: 1.8;">
    Loading...
  </div>
</div>

<script>
async function loadLogosCPanel() {
  try {
    const res = await fetch('/api/logos-c/current');
    const data = await res.json();
    if (!data.Lambda_c) {
      document.getElementById('logos-c-metrics').innerHTML = 'No LOGOS-C data yet. Waiting for first cron cycle...';
      return;
    }
    const verdictColors = { BLOCK: '#DC2626', PAUSE: '#F59E0B', MONITOR: '#3B82F6', ACT: '#10B981', FLOW: '#8B5CF6' };
    const color = verdictColors[data.verdict] || '#666';
    document.getElementById('logos-c-metrics').innerHTML = `
      <div style="font-size:1.4em; color:${color}; font-weight:bold;">
        Λ_c = ${data.Lambda_c} | Verdict: ${data.verdict}
      </div>
      <div style="margin-top:8px;">
        Ω_c = ${data.Omega_c} | V = ${data.V_c} | S = ${data.S_c} | C = ${data.C_c} | F = ${data.F_c}<br>
        ERS = ${data.ERS_c} | SNR = ${data.SNR}dB | dΛ/dt = ${data.dLambda_dt}<br>
        Basin: ${data.basin} | Collapse Ready: ${data.collapse_ready ? '✅' : '❌'}<br>
        Levin Signals: ${data.levin_signals || 0}<br>
        <small>Updated: ${new Date(data.timestamp).toLocaleString()}</small>
      </div>
    `;
  } catch (e) {
    document.getElementById('logos-c-metrics').innerHTML = 'Error loading LOGOS-C: ' + e.message;
  }
}

// Llamar al cargar la página y cada 5 minutos
loadLogosCPanel();
setInterval(loadLogosCPanel, 5 * 60 * 1000);
</script>
```

---

## VERIFICACIÓN FINAL (CHECKLIST)

Después de completar los 6 pasos, verifica:

```bash
# 1. Engine carga sin errores
node -e "require('/opt/mannychain/tools/logos-chatita-engine')"

# 2. Tabla existe
psql -U mannychain -d mannychain -c "\d chatita_logos_state"

# 3. Cron runner funciona
cd /opt/mannychain && node tools/logos-c-cron.js

# 4. Datos en PostgreSQL
psql -U mannychain -d mannychain -c "SELECT COUNT(*) FROM chatita_logos_state;"

# 5. Datos en Redis
redis-cli GET chatita:logos:current | head -c 200

# 6. API responde
curl -s http://localhost:8088/api/logos-c/current | python3 -m json.tool

# 7. Service reinicia limpio
sudo systemctl restart mannychain
sleep 3
curl -s http://localhost:8088/api/health/full | python3 -m json.tool

# 8. Chat funciona con LOGOS-C metadata
curl -s -X POST http://localhost:8088/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' | grep logos_c

# 9. Crontab registrado
crontab -l | grep logos-c

# 10. Ningún servicio existente roto
curl -s http://localhost:8088/api/health/full | grep -c '"OK"'
# Debe seguir siendo 33 (igual que antes)
```

---

## NOTAS CRÍTICAS PARA WINDSURF

1. **NO modifiques las funciones existentes de chatita-agent-v2.js.** Solo AGREGA código nuevo.
2. **NO cambies puertos, paths, ni nombres de servicios existentes.**
3. **El pool de PostgreSQL y el cliente Redis probablemente ya existen en el scope del server.js.** Reusar, no duplicar.
4. **Si un import ya existe (como `require('pg')` o `require('ioredis')`), no duplicar.**
5. **Verifica los nombres exactos de las variables** en server.js y chatita-agent-v2.js antes de integrar. Los nombres que uso aquí (pool, redisClient, app, requireAuth) son aproximaciones — revisa los reales.
6. **El auth middleware puede ser diferente.** Algunos endpoints usan OAuth (requireAuth), otros están en PUBLIC_PATHS. Los endpoints LOGOS-C deben requerir auth.
7. **Después de cada cambio, reinicia con `sudo systemctl restart mannychain` y verifica que arranca limpio con `sudo systemctl status mannychain`.**
8. **Si algo falla, los backups están en:** `chatita-agent-v2-backup-pre-logosc.js` y `server-backup-pre-logosc.js`.
