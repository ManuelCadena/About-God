# 📋 PROMPT COPY-PASTE LISTO
## Copia TODO esto y pégalo en Claude/GPT con acceso a /opt/citrusmax/

---

```
🎯 MISIÓN CRÍTICA:

Eres un Ingeniero Senior FullStack + PhD en Agronomía de Precisión.

CONTEXTO:
- Servidor M5 AWS (44.247.163.1)
- Repo: /opt/citrusmax/
- Frontend React: /var/www/html/
- DB: PostgreSQL citrusmax_biofix
- Estado actual: 51.3% FIT
- Objetivo: 95%+ FIT en 4-5 horas

TAREAS:

══════════════════════════════════════════════════════════════════════════════════
FASE 1: AUDITORÍA TÉCNICA (1 hora)
══════════════════════════════════════════════════════════════════════════════════

Para cada ruta, verifica EXISTE y está COMPLETO:

BACKEND PYTHON:
□ /opt/citrusmax/c2ai/orchestrator.py (615 líneas esperadas)
  - [ ] Existe
  - [ ] Tiene función main()
  - [ ] Llama a 5 layers (Friston, Levin, Watson, Hoffman, Penrose)
  - [ ] Integra resultados
  - [ ] Guarda en DB

□ /opt/citrusmax/c2ai/layers/friston_layer.py (1250+ líneas)
  - [ ] Calcula KL divergence
  - [ ] Genera recomendaciones de acción
  - [ ] Consume datos reales (Motor Unificado)

□ /opt/citrusmax/c2ai/layers/levin_layer.py (980+ líneas)
  - [ ] Detecta goals bioelectricos
  - [ ] Calcula coherence C(t)
  - [ ] Alinea acciones con goals

□ /opt/citrusmax/c2ai/layers/watson_layer.py (800+ líneas)
  - [ ] Calcula energy landscape
  - [ ] Identifica trayectoria óptima
  - [ ] Usa precios REALES (no hardcodeados)

□ /opt/citrusmax/c2ai/layers/hoffman_layer.py (1100+ líneas)
  - [ ] Integra trazas de 18 agentes
  - [ ] Resuelve conflictos
  - [ ] Reconstruye kernel K

□ /opt/citrusmax/c2ai/layers/penrose_layer.py (?: VERIFICAR SI EXISTE)
  - [ ] ¿Existe? SÍ/NO
  - [ ] ¿Implementado? SÍ/NO

DATABASE:
□ Conecta a: psql citrusmax_biofix

Tablas C²AI esperadas:
□ c2ai.orchestrator_decisions (¿records? ___)
□ c2ai.free_energy_log (¿records? ___)
□ c2ai.bioelectric_goals (¿records? ___)
□ c2ai.energy_landscape_snapshots (¿records? ___)
□ c2ai.decision_explainability (¿records? ___)
□ c2ai.system_performance_metrics (¿records? ___)
□ c2ai.bioelectric_signals (¿EXISTE? ___)

CONSULTA SQL A EJECUTAR:
```sql
SELECT 
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM c2ai.orchestrator_decisions) as orch_cnt,
  (SELECT COUNT(*) FROM c2ai.free_energy_log) as energy_cnt,
  (SELECT COUNT(*) FROM c2ai.bioelectric_goals) as bioelectric_cnt
FROM pg_tables 
WHERE schemaname = 'c2ai';
```

API ENDPOINTS:
□ GET /api/v1/c2ai/status → ¿200 OK?
□ GET /api/v1/c2ai/farm-state → ¿200 OK?
□ GET /api/v1/c2ai/free-energy/{section} → ¿200 OK?
□ GET /api/v1/c2ai/bioelectric-goals/{tree_id} → ¿200 OK?
□ GET /api/v1/c2ai/energy-landscape → ¿200 OK?
□ GET /api/v1/c2ai/decisions/history → ¿200 OK?

Endpoints LEGACY (que existen):
□ GET /c2ai-knows/friston-alignment → status?
□ GET /c2ai-knows/levin-alignment → status?
□ GET /c2ai-knows/watson-trajectory → status?

FRONTEND COMPONENTS:
□ /var/www/html/src/components/C2AIDashboard.tsx (¿existe?)
□ /var/www/html/src/components/C2AIFristonPanel.tsx (¿existe?)
□ /var/www/html/src/components/C2AILevinPanel.tsx (¿existe?)
□ /var/www/html/src/components/C2AIWatsonPanel.tsx (¿existe?)
□ /var/www/html/src/components/C2AIHoffmanPanel.tsx (¿existe?)
□ /var/www/html/src/components/C2AIPenrosePanel.tsx (¿existe?)
□ /var/www/html/src/hooks/useC2AIData.ts (¿existe?)

CRON / AUTOMATIZACIÓN:
□ ¿Existe cron para orchestrator.py?
  Comando a ejecutar: crontab -l | grep orchestrator
  Resultado esperado: 0 6 * * * /usr/bin/python3 /opt/citrusmax/c2ai/orchestrator.py
  
□ ¿Última ejecución?
  Comando: tail -100 /var/log/citrusmax/orchestrator.log | grep "execution\|error"
  
□ ¿Status del servicio?
  Comando: systemctl status citrusmax-orchestrator 2>/dev/null || echo "NOT FOUND"

══════════════════════════════════════════════════════════════════════════════════
FASE 2: REPORTE ESTRUCTURADO
══════════════════════════════════════════════════════════════════════════════════

Genera reporte JSON con esta estructura (copia exacta):

{
  "audit_date": "2026-01-04T20:50:00Z",
  "overall_fit_percent": XX,
  "components": {
    "backend_scientific_layers": {
      "fit_percent": XX,
      "status": "GREEN/YELLOW/RED",
      "audit": {
        "friston_layer": {
          "exists": true/false,
          "complete": true/false,
          "last_modified": "YYYY-MM-DD",
          "lines_of_code": XXX,
          "consumes_motor_unificado": true/false,
          "issues": ["issue1", "issue2"]
        },
        "levin_layer": {...},
        "watson_layer": {...},
        "hoffman_layer": {...},
        "penrose_layer": {...}
      }
    },
    "database": {
      "fit_percent": XX,
      "status": "GREEN/YELLOW/RED",
      "tables": {
        "orchestrator_decisions": {
          "exists": true/false,
          "records": XXX,
          "has_indexes": true/false
        },
        "free_energy_log": {...},
        "bioelectric_goals": {...}
      },
      "issues": ["issue1"]
    },
    "api_endpoints": {
      "fit_percent": XX,
      "status": "GREEN/YELLOW/RED",
      "implemented": ["GET /api/v1/c2ai/status", ...],
      "missing": ["GET /api/v1/c2ai/XXX", ...],
      "issues": ["issue1"]
    },
    "frontend_components": {
      "fit_percent": XX,
      "status": "GREEN/YELLOW/RED",
      "deployed": ["C2AIDashboard.tsx", ...],
      "missing": ["C2AIFristonPanel.tsx", ...],
      "connected_to_api": X_de_9,
      "issues": ["issue1"]
    },
    "orchestration": {
      "fit_percent": XX,
      "status": "GREEN/YELLOW/RED",
      "cron_configured": true/false,
      "last_execution": "YYYY-MM-DD HH:MM",
      "execution_frequency": "NEVER/DAILY/OTHER",
      "issues": ["issue1"]
    }
  },
  "critical_blockers": [
    {
      "blocker": "Frontend invisible",
      "components_missing": ["C2AIDashboard.tsx", ...],
      "fix_time_hours": 3,
      "criticality": "BLOCKER"
    }
  ],
  "build_tasks": [
    {
      "task_id": "BUILD-001",
      "component": "C2AIDashboard.tsx",
      "status": "MISSING/INCOMPLETE",
      "priority": "CRITICAL",
      "lines_needed": 450,
      "hours_needed": 3
    }
  ],
  "summary": {
    "total_blockers": X,
    "total_incomplete": X,
    "total_missing": X,
    "estimated_hours_to_100_fit": XX,
    "recommended_order": ["task1", "task2", ...]
  }
}

══════════════════════════════════════════════════════════════════════════════════
FASE 3: LISTAR TAREAS BUILD (basado en qué falta)
══════════════════════════════════════════════════════════════════════════════════

Para cada componente FALTANTE, crea una tarea BUILD:

FORMATO TAREA BUILD:

---
BUILD-XXX: [Nombre Componente]
PRIORITY: 🔴 CRITICAL / 🟡 HIGH / 🟢 NORMAL
ESTADO: MISSING / INCOMPLETE
RUTA DESTINO: /var/www/html/src/components/[filename].tsx

ESPECIFICACIÓN (del PhD Paper):
- Qué datos consume (API endpoint)
- Qué visualización produce
- Latencia esperada
- Error handling requerido

CÓDIGO PRODUCCIÓN (TypeScript completo):
[Código aquí - 100% listo para copiar-pegar]

API ENDPOINT REQUERIDO (si falta):
[FastAPI endpoint código]

DATABASE SCHEMA (si falta):
[SQL DDL]

TESTS:
[Jest tests]

INSTRUCCIONES DEPLOYMENT:
1. [paso 1]
2. [paso 2]
3. [paso 3]

VALIDACIÓN:
[ ] Componente carga sin errores
[ ] API conectada
[ ] Response < 500ms
[ ] Datos no son null
[ ] 0 console errors
---

══════════════════════════════════════════════════════════════════════════════════
FASE 4: GENERAR CÓDIGO BUILD
══════════════════════════════════════════════════════════════════════════════════

Para CADA BUILD TASK que generaste en Fase 3:

Genera el código EXACTO, LISTO PARA COPIAR-PEGAR en el archivo:

EJEMPLO:
```typescript
// /var/www/html/src/components/C2AIDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useC2AIData } from '../hooks/useC2AIData';

export const C2AIDashboard: React.FC = () => {
  const { data, loading, error } = useC2AIData();
  
  if (loading) return <div className="spinner">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  return (
    <div className="c2ai-dashboard">
      <h1>🧠 C²AI Framework Dashboard</h1>
      {/* Contenido aquí */}
    </div>
  );
};

export default C2AIDashboard;
```

PARA CADA ARCHIVO:
- [ ] TypeScript types completos
- [ ] Error boundaries
- [ ] Real API calls (NO mock)
- [ ] Responsive design
- [ ] Accessibility (a11y)
- [ ] Comments para futuros mantenedores
- [ ] Tests (Jest)

══════════════════════════════════════════════════════════════════════════════════
FASE 5: GENERAR SCRIPTS DEPLOYMENT
══════════════════════════════════════════════════════════════════════════════════

Crea scripts bash listos para ejecutar:

SCRIPT 1: setup-database.sh
- Crear tabla faltante bioelectric_signals
- Crear índices
- Verificar schema

SCRIPT 2: setup-cron.sh
- Agregar cron para orchestrator.py
- Verificar sintaxis
- Mostrar resultado

SCRIPT 3: build-frontend.sh
- npm install nuevas dependencias
- npm run build
- Copiar a /var/www/html/
- Reload nginx

SCRIPT 4: validate-deployment.sh
- Verificar todos los endpoints responden
- Contar registros en DB
- Verificar componentes en servidor
- Tests de performance

══════════════════════════════════════════════════════════════════════════════════
SALIDA ESPERADA
══════════════════════════════════════════════════════════════════════════════════

1. ✅ AUDIT REPORT (JSON) → Estado actual de cada componente
2. ✅ BUILD TASKS (Ordenadas por prioridad) → Código listo para copiar-pegar
3. ✅ DEPLOYMENT SCRIPTS (Bash) → Automatiza npm build + deploy
4. ✅ VALIDATION CHECKLIST → Qué verificar después

TOTAL TIEMPO: 4-5 HORAS
RESULTADO: 95%+ FIT

══════════════════════════════════════════════════════════════════════════════════

COMIENZA AHORA CON FASE 1: AUDITORÍA
```

---

## NOTAS CRÍTICAS ANTES DE EJECUTAR:

**Asegúrate de tener:**
- ✅ Acceso SSH a M5 (ssh ubuntu@44.247.163.1)
- ✅ Acceso PostgreSQL (psql citrusmax_biofix)
- ✅ Acceso git repo (/opt/citrusmax/.git)
- ✅ Node.js >= 16 instalado
- ✅ Python 3.9+ instalado

**Directorios críticos:**
- `/opt/citrusmax/` → Backend Python
- `/var/www/html/` → Frontend React (servido por nginx)
- `/var/log/citrusmax/` → Logs

**Archivos a tener a mano:**
- Copia de orchestrator.py (para verificar)
- Estructura actual de src/components/
- package.json (dependencias)

---

*PROMPT LISTO PARA COPIAR-PEGAR EN CLAUDE/GPT*  
*Auditoría C²AI + BUILD Automático*  
*4 Enero 2026 - Dr. José Manuel Cadena Ortiz de Montellano*
