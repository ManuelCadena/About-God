# 🔍 PROMPT MAESTRO AUDITORÍA C²AI + BUILD PHASE
## Copia y pega en Claude con archivo de contexto

---

## CONTEXTO CRÍTICO

**Repositorio:** `/opt/citrusmax/` en M5 AWS (44.247.163.1)  
**Base de Datos:** PostgreSQL citrusmax_biofix  
**Frontend:** React en `/var/www/html/` servido por nginx  
**Motor Unificado:** FastAPI en puerto 8501  
**Backend C²AI:** Python 3.9+ en `/opt/citrusmax/c2ai/`  

**Estado Línea Base:** 51.3% FIT (según análisis anterior)

---

## PROMPT COPIAR-PEGAR PARA AUDITORÍA + BUILD

```
Te pido que actúes como un INGENIERO SENIOR FULLSTACK + PhD en Agronomía de Precisión.

Tu misión es:
1. AUDITAR el estado actual del framework C²AI en /opt/citrusmax/
2. VALIDAR qué está implementado vs qué debería estar (según PhD Paper)
3. CONSTRUIR los componentes faltantes que no funcionan al 100%
4. DESPLEGAR TODO en el frontend citrusmax.ai/dashboard/

---

## FASE 1: AUDITORÍA TÉCNICA COMPLETA

### A. ESTRUCTURA DE DIRECTORIOS
Verifica la existencia y completitud de:

```
/opt/citrusmax/
├── c2ai/
│   ├── __init__.py ✓/✗
│   ├── orchestrator.py ✓/✗
│   ├── layers/
│   │   ├── friston_layer.py ✓/✗
│   │   ├── levin_layer.py ✓/✗
│   │   ├── watson_layer.py ✓/✗
│   │   ├── hoffman_layer.py ✓/✗
│   │   └── penrose_layer.py ✓/✗
│   ├── models/
│   │   ├── plant_model.py ✓/✗
│   │   ├── bioelectric_model.py ✓/✗
│   │   └── energy_landscape.py ✓/✗
│   └── utils/
│       ├── sensor_integration.py ✓/✗
│       ├── data_validation.py ✓/✗
│       └── error_handling.py ✓/✗
├── api/
│   ├── main.py ✓/✗
│   ├── routes/
│   │   ├── c2ai_endpoints.py ✓/✗
│   │   └── legacy_endpoints.py ✓/✗
│   └── schemas/
│       └── c2ai_schema.py ✓/✗
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── C2AIDashboard.tsx ✓/✗
    │   │   ├── FristonPanel.tsx ✓/✗
    │   │   ├── LevinPanel.tsx ✓/✗
    │   │   ├── WatsonPanel.tsx ✓/✗
    │   │   ├── HoffmanPanel.tsx ✓/✗
    │   │   └── PenrosePanel.tsx ✓/✗
    │   ├── hooks/
    │   │   └── useC2AIData.ts ✓/✗
    │   └── types/
    │       └── c2ai.types.ts ✓/✗
    └── public/
        └── c2ai-styles/
            └── dashboard.css ✓/✗
```

Para cada archivo:
- [ ] Verifica si EXISTE
- [ ] Verifica si está COMPLETO (no stubs/TODO)
- [ ] Verifica si tiene TESTS
- [ ] Verifica ÚLTIMA MODIFICACIÓN (< 30 días es OK)

### B. DATABASE AUDIT

Ejecuta en PostgreSQL:

```sql
-- Verificar schema c2ai completo
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'c2ai' 
ORDER BY table_name;

-- Para cada tabla, contar registros:
SELECT 
    schemaname,
    tablename,
    (SELECT count(*) FROM c2ai.orchestrator_decisions) as orch_decisions,
    (SELECT count(*) FROM c2ai.free_energy_log) as free_energy,
    (SELECT count(*) FROM c2ai.bioelectric_goals) as bioelectric,
    (SELECT count(*) FROM c2ai.energy_landscape_snapshots) as energy,
    (SELECT count(*) FROM c2ai.decision_explainability) as explain,
    (SELECT count(*) FROM c2ai.system_performance_metrics) as perf
FROM pg_tables 
WHERE schemaname = 'c2ai';

-- Verificar índices:
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'c2ai';
```

Documenta:
- Tablas que existen
- Tablas que faltan
- Registros en cada tabla
- Índices faltantes

### C. CRON / AUTOMATIZACIÓN AUDIT

Ejecuta:

```bash
# Verificar si hay cron para orchestrator
crontab -l | grep orchestrator

# Verificar si orchestrator.py está registrado en supervisor/systemd
systemctl status citrusmax-orchestrator 2>/dev/null || echo "NOT FOUND"

# Verificar últimas ejecuciones en logs
tail -100 /var/log/citrusmax/orchestrator.log 2>/dev/null | grep "execution\|error"
```

Documentar:
- ¿Cron existe? SÍ/NO
- ¿Última ejecución? Timestamp
- ¿Errores recientes? Listar

### D. API ENDPOINTS AUDIT

Ejecuta contra FastAPI:

```bash
# Listar todos los endpoints:
curl -s http://localhost:8000/openapi.json | jq '.paths | keys'

# Verificar cada endpoint C²AI esperado:
curl -s http://localhost:8000/api/v1/c2ai/status | jq .
curl -s http://localhost:8000/api/v1/c2ai/farm-state | jq .
curl -s http://localhost:8000/api/v1/c2ai/free-energy/1 | jq .
curl -s http://localhost:8000/api/v1/c2ai/bioelectric-goals/tree_123 | jq .
curl -s http://localhost:8000/api/v1/c2ai/energy-landscape | jq .
curl -s http://localhost:8000/api/v1/c2ai/decisions/history | jq .
```

Para cada endpoint:
- [ ] ¿Existe? (200 OK)
- [ ] ¿Tiene datos reales? (no null/mock)
- [ ] ¿Response time < 500ms?
- [ ] ¿Schema correcto según especificación?

### E. FRONTEND COMPONENTS AUDIT

En `/var/www/html/`:

```bash
# Listar componentes deployados:
find src/components -name "*.tsx" -type f | head -20

# Verificar tamaño y completitud:
wc -l src/components/C2AI*.tsx

# Verificar si hay imports sin resolver:
grep -r "TODO\|FIXME\|stub\|mock" src/components/c2ai* || echo "CLEAN"

# Verificar package.json tiene todas dependencias:
grep -E "recharts|plotly|d3" package.json
```

Documentar:
- Componentes que existen
- Componentes que faltan
- Tamaño (líneas de código)
- TODO/FIXME pendientes

### F. INTEGRACIÓN MOTOR UNIFICADO AUDIT

Verifica en friston_layer.py:

```python
# ¿Lee datos reales de /api/v1/vep/factors?
grep -n "fetch_motor_unificado\|/api/v1/vep/factors" friston_layer.py

# ¿Usa datos simulados/hardcodeados?
grep -n "mock_data\|hardcoded\|fake_" friston_layer.py

# ¿Hay manejo de errores para timeout del Motor?
grep -n "requests.timeout\|ConnectionError" friston_layer.py
```

Documentar:
- ¿Conectado? SÍ/NO
- ¿Usa datos reales? SÍ/NO
- ¿Tiene fallback? SÍ/NO

---

## FASE 2: REPORTE DE AUDITORÍA ESTRUCTURADO

Genera un reporte JSON con este esquema:

```json
{
  "audit_timestamp": "2026-01-04T20:50:00Z",
  "overall_fit_percent": 51.3,
  "components": {
    "backend_scientific_layers": {
      "fit_percent": 82,
      "status": "GREEN",
      "audit_details": {
        "friston_layer": {"exists": true, "complete": true, "last_modified": "2025-12-28", "lines_of_code": 1250, "issues": []},
        "levin_layer": {"exists": true, "complete": true, "last_modified": "2025-12-27", "lines_of_code": 980, "issues": []},
        "watson_layer": {"exists": true, "complete": false, "last_modified": "2025-12-15", "lines_of_code": 450, "issues": ["Prices hardcoded"]},
        "hoffman_layer": {"exists": true, "complete": true, "last_modified": "2025-12-20", "lines_of_code": 1100, "issues": []},
        "penrose_layer": {"exists": false, "complete": false, "last_modified": null, "lines_of_code": 0, "issues": ["NOT IMPLEMENTED"]}
      }
    },
    "database": {
      "fit_percent": 25,
      "status": "RED",
      "audit_details": {
        "tables_total": 7,
        "tables_populated": 2,
        "tables_empty": 5,
        "total_records": 150,
        "issues": ["orchestrator_decisions: 0 records", "free_energy_log: 0 records", "bioelectric_goals: 0 records"]
      }
    },
    "api_endpoints": {
      "fit_percent": 38,
      "status": "RED",
      "audit_details": {
        "implemented": 3,
        "expected": 9,
        "missing_endpoints": ["/api/v1/c2ai/status", "/api/v1/c2ai/farm-state", ...],
        "issues": ["Incomplete coverage"]
      }
    },
    "frontend": {
      "fit_percent": 8,
      "status": "CRITICAL",
      "audit_details": {
        "components_deployed": 6,
        "components_expected": 9,
        "missing_components": ["C2AIFristonPanel", "C2AILevinPanel", ...],
        "api_connections": 0,
        "issues": ["No PhD components deployed"]
      }
    },
    "integration_motor": {
      "fit_percent": 40,
      "status": "YELLOW",
      "audit_details": {
        "motor_connected": true,
        "realtime_data_used": false,
        "fallback_mechanism": false,
        "issues": ["Uses mock data instead of live Motor output"]
      }
    },
    "orchestration": {
      "fit_percent": 30,
      "status": "RED",
      "audit_details": {
        "cron_configured": false,
        "last_execution": null,
        "execution_frequency": "NEVER",
        "issues": ["Orchestrator never runs automatically"]
      }
    }
  },
  "critical_blockers": [
    {"blocker": "Frontend invisible", "fix_time": "2-3 days", "criticality": "BLOCKER"},
    {"blocker": "Database empty", "fix_time": "1-2 days", "criticality": "BLOCKER"},
    {"blocker": "Orchestrator dormant", "fix_time": "1 day", "criticality": "BLOCKER"},
    ...
  ],
  "build_phase_tasks": [
    {
      "task_id": "BUILD-001",
      "component": "C2AIDashboard.tsx",
      "status": "MISSING",
      "priority": "CRITICAL",
      "estimated_lines": 450,
      "estimated_hours": 3
    },
    ...
  ]
}
```

---

## FASE 3: BUILD & DEPLOY AUTOMÁTICO

Para cada componente FALTANTE o INCOMPLETO:

### BUILD TASK TEMPLATE:

```
TASK: [BUILD-XXX] - [Component Name]
PRIORITY: 🔴 CRITICAL / 🟡 HIGH / 🟢 NORMAL
STATUS: MISSING / INCOMPLETE

SPECIFICATIONS (from PhD Paper):
- Input data: [source]
- Output visualization: [what to show]
- Expected latency: [ms]
- Error handling: [fallback strategy]

REACT COMPONENT CODE:
[Complete, production-ready component with:
 - TypeScript types
 - Error boundaries
 - Real API calls (not mock)
 - Responsive design
 - Accessibility (a11y)
 - Comments for future maintainers]

DATABASE SCHEMA (if needed):
[SQL DDL for any tables/indexes]

API ENDPOINT CODE (if needed):
[FastAPI route handler]

DEPLOYMENT STEPS:
1. npm install any new deps
2. Copy .tsx to src/components/
3. Import in App.tsx
4. npm run build
5. sudo cp -r build/* /var/www/html/
6. Verify at citrusmax.ai/dashboard/c2ai/[component-path]

TEST VALIDATION:
- [ ] Component loads without errors
- [ ] API data populates correctly
- [ ] Responsive on mobile (375px)
- [ ] Responsive on desktop (1920px)
- [ ] Console has 0 errors/warnings
- [ ] Performance: <1s render time
```

---

## FASE 4: VALIDACIÓN & SIGN-OFF

Una vez completada cada tarea BUILD:

```
VALIDATION CHECKLIST:

□ Auditoría confirma componente está en /var/www/html/
□ Componente carga en citrusmax.ai/dashboard/c2ai/[path]
□ API response > 500KB es cacheado (localStorage)
□ Componente responde a cambios en tiempo real (5s refresh)
□ Tests pasan: npm test -- C2AI*.test.tsx
□ Screenshot con datos reales capturada
□ Documentación actualizada
□ Performance Lighthouse > 80
□ 0 console errors/warnings
□ Accessibility WCAG 2.1 AA passed
```

---

## SALIDA ESPERADA

Al terminar, tendré:

1. **AUDIT REPORT (JSON)**: Estado exacto de cada componente
2. **BLOCKERS LIST**: Qué impide 100% FIT
3. **BUILD TASKS**: Código listo para copiar-pegar
4. **DEPLOYMENT SCRIPT**: Automatiza npm build + deploy
5. **VALIDATION RESULTS**: Screenshots + test results

---

## INSTRUCCIONES DE EJECUCIÓN

Este prompt está diseñado para:

1. Ejecutarse en 3-4 horas de trabajo
2. Generar salida que sea copia-pega lista en M5
3. No requerir ajustes manuales adicionales
4. Alcanzar 95%+ FIT cuando se complete

COMIENZA CON FASE 1: AUDITORÍA TÉCNICA COMPLETA
```

---

## NOTAS CRÍTICAS PARA EJECUTAR

**Requisitos:**
- Acceso SSH a M5: `ssh ubuntu@44.247.163.1`
- PostgreSQL access: `psql citrusmax_biofix`
- Git repo acceso: `/opt/citrusmax/.git`

**Archivos que necesitarás:**
- Copia de `orchestrator.py` (para verificar estado)
- Estructura de `src/components/` (para audit)
- `package.json` (para verificar deps)

**Tiempo estimado:**
- Auditoría: 1 hora
- Reporte: 30 minutos
- BUILD tasks: 2-3 horas
- Deploy + validation: 1 hora
- **TOTAL: 4-5 horas → 95%+ FIT**

---

*Este prompt está optimizado para reproducibilidad y deployment automático en producción.*
*Copia todo este contenido al copiloto que tendrá acceso a /opt/citrusmax/*
