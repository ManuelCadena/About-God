# 🚀 GUÍA RÁPIDA DE EJECUCIÓN - AUDITORÍA + BUILD C²AI
## 3 Pasos para Lograr 95%+ FIT en 4-5 Horas

---

## PASO 1️⃣: PREPARACIÓN (5 minutos)

### A. Descarga el Prompt Maestro
```bash
# Copia TODO el contenido de PROMPT_AUDITORIA_BUILD.md
# (archivo anterior)
```

### B. Asegúrate de tener acceso a:
```bash
# SSH a M5
ssh ubuntu@44.247.163.1

# Verificar directorios principales
ls -la /opt/citrusmax/
ls -la /var/www/html/
ls -la /var/log/citrusmax/

# Verificar PostgreSQL
psql -U postgres -d citrusmax_biofix -c "SELECT version();"
```

### C. Verificar dependencias instaladas
```bash
# Python
python3 --version  # >= 3.9

# Node.js (para frontend)
node --version  # >= 16
npm --version

# PostgreSQL CLI
psql --version

# Git
git --version
```

---

## PASO 2️⃣: EJECUTAR AUDITORÍA (1-2 horas)

### Opción A: Copiar el Prompt Completo a Claude/GPT

**En Claude.ai (o tu instancia local):**

```
[Copia TODO el contenido de PROMPT_AUDITORIA_BUILD.md aquí]

INSTRUCCIONES ADICIONALES:
- Tienes acceso a los archivos en /opt/citrusmax/
- Puedes ejecutar comandos bash en M5
- Ejecuta primero la FASE 1: AUDITORÍA TÉCNICA COMPLETA
- Proporciona reporte JSON estructurado
- Luego genera FASE 2-3 según qué esté faltando
```

### Opción B: Ejecutar Auditoría Manual (Step-by-Step)

**Conexión a M5:**
```bash
ssh ubuntu@44.247.163.1
cd /opt/citrusmax/
```

**1. Estructura de directorios:**
```bash
find . -type f -name "*.py" | grep -E "friston|levin|watson|hoffman|penrose" | head -20
find . -type f -name "*.tsx" | grep -i c2ai | head -20
```

**2. Base de Datos:**
```bash
psql citrusmax_biofix << EOF
SELECT table_name FROM information_schema.tables WHERE table_schema = 'c2ai';

SELECT 
  'orchestrator_decisions' as tabla, 
  COUNT(*) as records 
FROM c2ai.orchestrator_decisions
UNION ALL
SELECT 'free_energy_log', COUNT(*) FROM c2ai.free_energy_log
UNION ALL
SELECT 'bioelectric_goals', COUNT(*) FROM c2ai.bioelectric_goals;
EOF
```

**3. Cron / Automatización:**
```bash
crontab -l | grep -i orchestrator || echo "NO CRON FOUND"
systemctl status citrusmax-orchestrator 2>/dev/null || echo "SERVICE NOT FOUND"
tail -50 /var/log/citrusmax/orchestrator.log 2>/dev/null | tail -10
```

**4. API Endpoints:**
```bash
curl -s http://localhost:8000/openapi.json 2>/dev/null | \
  python3 -c "import sys, json; print('\n'.join(json.load(sys.stdin)['paths'].keys()))" | \
  grep c2ai | head -20
```

**5. Frontend Components:**
```bash
ls -lh /var/www/html/src/components/C2AI* 2>/dev/null || echo "C2AI COMPONENTS NOT FOUND"
find /var/www/html -name "*.tsx" | wc -l
grep -r "TODO\|FIXME\|stub\|mock" /var/www/html/src/components/ 2>/dev/null | wc -l
```

**6. Integración Motor Unificado:**
```bash
grep -n "fetch_motor\|/api/v1/vep/factors\|mock_data" /opt/citrusmax/c2ai/layers/friston_layer.py 2>/dev/null | head -10
```

---

## PASO 3️⃣: BUILD & DEPLOY (2-3 horas)

### Para cada componente FALTANTE:

**A. Crear archivo componente React:**
```bash
cd /var/www/html/src/components/

# Ejemplo: Crear C2AIDashboard.tsx
cat > C2AIDashboard.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { useC2AIData } from '../hooks/useC2AIData';

export const C2AIDashboard: React.FC = () => {
  const { data, loading, error } = useC2AIData();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="c2ai-dashboard">
      <h1>🧠 C²AI Framework Dashboard</h1>
      <div className="grid-panels">
        {/* Paneles se insertan aquí */}
      </div>
    </div>
  );
};
EOF
```

**B. Crear/actualizar API Endpoint:**
```bash
cd /opt/citrusmax/api/routes/

# Agregar a c2ai_endpoints.py:
cat >> c2ai_endpoints.py << 'EOF'
@router.get("/api/v1/c2ai/status")
async def get_c2ai_status():
    """Get current C²AI system status"""
    return {
        "status": "operational",
        "fit_percent": 51.3,
        "last_execution": datetime.utcnow(),
        "layers": {
            "friston": "ready",
            "levin": "ready",
            "watson": "ready",
            "hoffman": "ready",
            "penrose": "pending"
        }
    }
EOF
```

**C. Crear tabla SQL si falta:**
```bash
psql citrusmax_biofix << 'EOF'
CREATE TABLE IF NOT EXISTS c2ai.bioelectric_signals (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER NOT NULL REFERENCES agronomy.arboles(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    voltage_40hz FLOAT,
    coherence FLOAT,
    spad_chlorophyll FLOAT,
    leaf_water_potential FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bioelectric_tree_timestamp 
ON c2ai.bioelectric_signals(tree_id, timestamp DESC);
EOF
```

**D. Configurar Cron (si no existe):**
```bash
# Agregar a crontab:
crontab -e

# Insertar línea:
0 6 * * * /usr/bin/python3 /opt/citrusmax/c2ai/orchestrator.py >> /var/log/citrusmax/orchestrator.log 2>&1
```

**E. Build y Deploy:**
```bash
cd /var/www/html/

# Instalar dependencias nuevas
npm install recharts plotly.js d3

# Build
npm run build

# Deploy
sudo cp -r build/* /var/www/html/

# Verificar
sudo chown -R www-data:www-data /var/www/html/
sudo nginx -t && sudo systemctl reload nginx

# Acceder
curl -s http://localhost/dashboard/c2ai/ | head -50
```

---

## PASO 4️⃣: VALIDACIÓN & SIGN-OFF (1 hora)

### Checklist Final:

```bash
# 1. Auditoría confirma componentes en lugar
ls -la /var/www/html/src/components/C2AI*.tsx

# 2. API endpoints responden
for endpoint in status farm-state free-energy bioelectric-goals energy-landscape decisions/history
do
  echo "Testing /api/v1/c2ai/$endpoint:"
  curl -s -w "\nStatus: %{http_code}\n" http://localhost:8000/api/v1/c2ai/$endpoint | head -5
done

# 3. Base de datos tiene registros
psql citrusmax_biofix -c "
SELECT table_name, 
       (SELECT COUNT(*) FROM c2ai.orchestrator_decisions) as decisions,
       (SELECT COUNT(*) FROM c2ai.free_energy_log) as free_energy,
       (SELECT COUNT(*) FROM c2ai.bioelectric_goals) as bioelectric
FROM information_schema.tables 
WHERE table_schema = 'c2ai' LIMIT 5;
"

# 4. Cron está activo
crontab -l | grep orchestrator

# 5. Componentes cargan en navegador
curl -s http://citrusmax.ai/dashboard/ | grep -c "C2AI" || echo "Componentes no encontrados"

# 6. Tests pasan
cd /var/www/html && npm test -- C2AI*.test.tsx

# 7. Performance OK
curl -w "@curl-format.txt" http://citrusmax.ai/dashboard/c2ai/ | grep "time_total"

# 8. Console errors = 0
curl -s http://citrusmax.ai/dashboard/c2ai/ | grep "console.error" | wc -l
```

---

## 📊 TABLA DE TAREAS POR PRIORIDAD

| Prioridad | Tarea | Tiempo | Estado | Ejecutar |
|-----------|-------|--------|--------|----------|
| 🔴 CRÍTICO | Crear tabla bioelectric_signals | 10 min | ⬜ | `psql < schema.sql` |
| 🔴 CRÍTICO | Configurar cron orchestrator | 5 min | ⬜ | `crontab -e` |
| 🔴 CRÍTICO | Crear /api/v1/c2ai/status | 20 min | ⬜ | `vim api/routes/c2ai_endpoints.py` |
| 🔴 CRÍTICO | Desplegar C2AIDashboard.tsx | 30 min | ⬜ | `npm build && cp -r build/* /var/www/html/` |
| 🟡 IMPORTANTE | Integrar Friston con Motor | 1 hora | ⬜ | Actualizar friston_layer.py |
| 🟡 IMPORTANTE | Crear 5 endpoints restantes | 2 horas | ⬜ | Copiar templates de PROMPT |
| 🟡 IMPORTANTE | Crear FristonPanel.tsx | 1 hora | ⬜ | Copiar template React |
| 🟡 IMPORTANTE | Backtesting histórico | 2 horas | ⬜ | `python3 backtest.py --days=30` |
| 🟢 NORMAL | Documentación final | 1 hora | ⬜ | Generar README |

---

## 🎯 VERIFICACIÓN DE ÉXITO (POST-DEPLOYMENT)

```
✅ CRITERIOS DE ACEPTACIÓN:

1. AUDITORÍA COMPLETA
   [ ] Reporte JSON generado
   [ ] 0 archivos "TODO/stub"
   [ ] Todos los directorios esperados existen

2. DATABASE POBLADA
   [ ] c2ai.orchestrator_decisions tiene ≥100 registros
   [ ] c2ai.free_energy_log tiene ≥100 registros
   [ ] c2ai.bioelectric_goals tiene ≥50 registros
   [ ] Todos los índices creados

3. API FUNCIONAL
   [ ] 9 endpoints /api/v1/c2ai/* responden con 200
   [ ] Response time < 500ms para cada endpoint
   [ ] Schema matches especificación PhD Paper

4. FRONTEND VISIBLE
   [ ] citrusmax.ai/dashboard/c2ai/ carga sin errores
   [ ] 9 componentes Django renderean
   [ ] Conexiones a API funcionan (no null data)
   [ ] 0 console.error en DevTools

5. AUTOMATIZACIÓN ACTIVA
   [ ] Cron ejecuta a las 06:00 UTC
   [ ] Orchestrator.py genera decisiones diarias
   [ ] Logs en /var/log/citrusmax/orchestrator.log

6. INTEGRACIÓN MOTOR
   [ ] Friston lee /api/v1/vep/factors en tiempo real
   [ ] Watson usa precios históricos reales
   [ ] Hoffman recibe trazas de 18 agentes

7. PERFORMANCE
   [ ] Lighthouse score > 80
   [ ] WCAG 2.1 AA accessibility passed
   [ ] npm test coverage > 85%
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

| Problema | Síntoma | Fix |
|----------|---------|-----|
| 404 No API | curl retorna "not found" | Verificar `c2ai_endpoints.py` registrado en `main.py` |
| BD vacía | COUNT(*) = 0 | Ejecutar `orchestrator.py` manualmente: `python3 /opt/citrusmax/c2ai/orchestrator.py` |
| Frontend 404 | npm build error | `npm install` deps que faltan, verificar node_modules |
| Cron no ejecuta | Logs vacíos | `systemctl restart cron`, verificar `/etc/cron.d/` |
| Motor timeout | Friston error | Verificar puerto 8501: `lsof -i :8501` |
| Datos mock | API devuelve hardcoded | Cambiar `mock=True` a `mock=False` en `friston_layer.py` |

---

## 📞 CONTACTO PARA ESCALACIONES

Si encuentras bloqueos:
1. Verifica archivo log: `/var/log/citrusmax/orchestrator.log`
2. Ejecuta: `journalctl -u citrusmax-orchestrator -n 50`
3. Checkea PostgreSQL: `psql citrusmax_biofix -c "\dt c2ai.*"`
4. Acceso SSH a M5: `ssh ubuntu@44.247.163.1`

---

*Documento de implementación rápida*  
*Para Dr. José Manuel Cadena*  
*Auditoría C²AI Framework + BUILD Phase*  
*4 Enero 2026*
