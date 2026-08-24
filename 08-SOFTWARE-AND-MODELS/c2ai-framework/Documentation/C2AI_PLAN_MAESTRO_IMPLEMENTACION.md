# 🧠 C²AI PLAN MAESTRO DE IMPLEMENTACIÓN

## CONSCIOUS CITRUS AI - Plan de Despliegue 100% Autorizado

**Versión:** 1.0  
**Fecha:** 3 Enero 2026  
**Autor:** Dr. José Manuel Cadena  
**Estado:** PENDIENTE AUTORIZACIÓN  
**Servidor Destino:** M5 (44.247.163.1)

---

## 📋 ÍNDICE

1. [Estrategia General y TODO List](#1-estrategia-general)
2. [Reglas Inviolables del Sistema](#2-reglas-inviolables)
3. [10 Componentes de Análisis y Reporte](#3-componentes-analisis)
4. [Protocolo de Pruebas Parciales](#4-protocolo-pruebas)
5. [Conexiones a Datos Reales](#5-conexiones-datos)
6. [Manejo de Errores](#6-manejo-errores)
7. [Backups Progresivos](#7-backups)
8. [Recuperación Automática](#8-recuperacion)
9. [Anti-Duplicidad de Paneles](#9-anti-duplicidad)
10. [Cronograma de Ejecución](#10-cronograma)

---

## 1. ESTRATEGIA GENERAL Y TODO LIST COMPLETA {#1-estrategia-general}

### 1.1 Filosofía de Implementación

```
PRINCIPIO FUNDAMENTAL:
═══════════════════════════════════════════════════════════════
"Implementar C²AI como CAPA ADICIONAL sobre la infraestructura
existente, SIN modificar, eliminar o duplicar funcionalidades
actuales del CitrusMax Dashboard v5.2"
═══════════════════════════════════════════════════════════════
```

### 1.2 TODO LIST COMPLETA (85 Tareas)

#### FASE 1: PREPARACIÓN (Días 1-3)
```
□ 1.1.1  Backup completo BD citrusmax_biofix
□ 1.1.2  Backup código fuente /opt/citrusmax/
□ 1.1.3  Documentar estado actual APIs (8501, 8502)
□ 1.1.4  Snapshot EC2 M5 completo
□ 1.1.5  Verificar espacio disco (mínimo 10GB libre)
□ 1.2.1  Crear directorio /opt/citrusmax/c2ai/
□ 1.2.2  Crear estructura de subcarpetas
□ 1.2.3  Configurar permisos (chown ec2-user)
□ 1.2.4  Crear archivo .env.c2ai
□ 1.2.5  Instalar dependencias Python (requirements_c2ai.txt)
□ 1.3.1  Crear schema c2ai en PostgreSQL
□ 1.3.2  Ejecutar schema.sql (10 tablas)
□ 1.3.3  Verificar tablas creadas
□ 1.3.4  Insertar patrones bioeléctricos base
□ 1.3.5  Crear índices de rendimiento
```

#### FASE 2: CAPAS CORE (Días 4-10)
```
□ 2.1.1  Implementar FristonLayer (free_energy)
□ 2.1.2  Test unitario FristonLayer
□ 2.1.3  Conectar a weather.davis_weatherlink_complete
□ 2.1.4  Conectar a agronomy.nutricion_hoja
□ 2.1.5  Validar cálculo F con datos reales
□ 2.2.1  Implementar LevinLayer (bioelectric_goals)
□ 2.2.2  Test unitario LevinLayer
□ 2.2.3  Mapear a patrones fenológicos existentes
□ 2.2.4  Conectar a agronomy.fenologia_actual
□ 2.2.5  Validar detección de objetivos
□ 2.3.1  Implementar WatsonLayer (energy_landscape)
□ 2.3.2  Test unitario WatsonLayer
□ 2.3.3  Conectar a market.precios_semanales_historicos
□ 2.3.4  Conectar a production.empacadora_produccion
□ 2.3.5  Validar trayectoria óptima
□ 2.4.1  Implementar HoffmanLayer (kernel_reconstruction)
□ 2.4.2  Test unitario HoffmanLayer
□ 2.4.3  Integrar con 18 agentes existentes
□ 2.4.4  Validar resolución de conflictos
□ 2.4.5  Test de integración multi-agente
□ 2.5.1  Implementar PenroseLayer (quantum_coherence)
□ 2.5.2  Test unitario PenroseLayer
□ 2.5.3  Calcular proxies de coherencia
□ 2.5.4  Conectar a bioelectric_signals
□ 2.5.5  Validar métricas de coherencia
```

#### FASE 3: ORQUESTADOR (Días 11-15)
```
□ 3.1.1  Implementar DrCitrusMaxOrchestrator
□ 3.1.2  Integrar 5 capas C²AI
□ 3.1.3  Integrar 7 agentes existentes
□ 3.1.4  Implementar orchestrate_daily_cycle()
□ 3.1.5  Test de ciclo completo
□ 3.2.1  Crear router FastAPI /api/v1/c2ai/
□ 3.2.2  Implementar 15 endpoints
□ 3.2.3  Agregar autenticación JWT
□ 3.2.4  Configurar rate limiting
□ 3.2.5  Test de todos los endpoints
□ 3.3.1  Crear servicio systemd citrusmax-c2ai
□ 3.3.2  Configurar cron diario 06:00 UTC
□ 3.3.3  Configurar logging a /var/log/citrusmax/
□ 3.3.4  Test de inicio/parada servicio
□ 3.3.5  Monitoreo de health checks
```

#### FASE 4: FRONTEND (Días 16-22)
```
□ 4.1.1  Crear C2AIDashboard.tsx
□ 4.1.2  Crear FristonPanel.tsx
□ 4.1.3  Crear LevinGoalsPanel.tsx
□ 4.1.4  Crear WatsonLandscapePanel.tsx
□ 4.1.5  Crear HoffmanKernelPanel.tsx
□ 4.1.6  Crear PenroseCoherencePanel.tsx
□ 4.1.7  Crear DecisionTimeline.tsx
□ 4.1.8  Crear LayerContributions.tsx
□ 4.2.1  Integrar API service c2aiApi.ts
□ 4.2.2  Configurar WebSocket para tiempo real
□ 4.2.3  Implementar estado global C²AI
□ 4.2.4  Test de componentes React
□ 4.2.5  Test de integración frontend-backend
□ 4.3.1  Agregar ruta /dashboard/c2ai en App.tsx
□ 4.3.2  Agregar enlace en Sidebar existente
□ 4.3.3  Aplicar tema visual consistente
□ 4.3.4  Build de producción
□ 4.3.5  Deploy a /var/www/html/dashboard/
```

#### FASE 5: VALIDACIÓN (Días 23-28)
```
□ 5.1.1  Backtesting con datos 2022-2025
□ 5.1.2  Monte Carlo 10,000 simulaciones
□ 5.1.3  Validar +60% VEP teórico
□ 5.1.4  Documentar resultados estadísticos
□ 5.1.5  Ajustar pesos de capas si necesario
□ 5.2.1  Piloto en Sección S1 (84 ha)
□ 5.2.2  Comparar vs S2 (control)
□ 5.2.3  Medir decisiones vs resultados
□ 5.2.4  Recopilar feedback operativo
□ 5.2.5  Ajustes finales
□ 5.3.1  Documentación técnica completa
□ 5.3.2  Manual de usuario C²AI
□ 5.3.3  Runbook de operaciones
□ 5.3.4  Entrenamiento equipo
□ 5.3.5  Go-live producción completa
```

### 1.3 Diagrama de Dependencias

```
FASE 1 ──────────────────────────────────────────────────────────►
  │
  ├─► 1.1 Backups ──► 1.2 Estructura ──► 1.3 Schema BD
  │                                           │
FASE 2 ◄──────────────────────────────────────┘
  │
  ├─► 2.1 Friston ──┬──► 2.4 Hoffman ──┐
  ├─► 2.2 Levin ────┤                  │
  ├─► 2.3 Watson ───┤                  │
  └─► 2.5 Penrose ──┴──────────────────┘
                                       │
FASE 3 ◄───────────────────────────────┘
  │
  ├─► 3.1 Orquestador ──► 3.2 APIs ──► 3.3 Servicio
  │                                         │
FASE 4 ◄────────────────────────────────────┘
  │
  ├─► 4.1 Componentes ──► 4.2 Integración ──► 4.3 Deploy
  │                                               │
FASE 5 ◄──────────────────────────────────────────┘
  │
  └─► 5.1 Validación ──► 5.2 Piloto ──► 5.3 Producción
```

---

## 2. REGLAS INVIOLABLES DEL SISTEMA {#2-reglas-inviolables}

### 2.1 Las 8 Reglas Inviolables C²AI

Basadas en el documento maestro y principios del ecosistema CitrusMax:

```
╔═══════════════════════════════════════════════════════════════════╗
║                    8 REGLAS INVIOLABLES C²AI                       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ 1️⃣ JERARQUÍA DE DATOS INMUTABLE                                   ║
║    PostgreSQL M5 > Davis WeatherLink > Google Sheets >             ║
║    APIs Externas > Agentes AI > Modelos Históricos                 ║
║    NUNCA usar datos de menor prioridad si existen de mayor.        ║
║                                                                    ║
║ 2️⃣ COHERENCIA AGRONÓMICA OBLIGATORIA                              ║
║    Antes de cualquier cálculo, verificar que tenga sentido         ║
║    agronómico. IPF/NPF/PE se ponderan por sección.                 ║
║    IAH/Clima son generales. NUNCA violar esta regla.               ║
║                                                                    ║
║ 3️⃣ PERÍODO TEMPORAL SIEMPRE EXPLÍCITO                             ║
║    Todo reporte de costos/producción DEBE especificar período:     ║
║    MESyyMM, SEMyyWW, o fecha exacta. Sin período = sin valor.      ║
║                                                                    ║
║ 4️⃣ NO MODIFICAR TABLAS EXISTENTES                                 ║
║    C²AI usa schema PROPIO (c2ai.*). NUNCA ALTER/DROP en            ║
║    appsheet, weather, agronomy, market, production.                ║
║                                                                    ║
║ 5️⃣ RESPETO A OBJETIVOS DE LA PLANTA (Levin)                       ║
║    Las decisiones deben alinearse con objetivos bioeléctricos      ║
║    detectados. Alignment score mínimo: 0.7 para ejecutar.          ║
║                                                                    ║
║ 6️⃣ MINIMIZACIÓN DE ENERGÍA LIBRE (Friston)                        ║
║    Acciones deben reducir F (sorpresa). Si acción aumenta F,       ║
║    debe haber justificación explícita en rationale.                ║
║                                                                    ║
║ 7️⃣ TRAYECTORIA ÓPTIMA (Watson)                                    ║
║    Decisiones siguen gradiente descendente de energía.             ║
║    Efficiency > 0.85 para decisiones automáticas.                  ║
║                                                                    ║
║ 8️⃣ KERNEL COMPLETO (Hoffman)                                      ║
║    Conflictos entre agentes se resuelven reconstruyendo estado     ║
║    completo. Confidence > 0.75 para decisión automática.           ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 2.2 Implementación de Reglas en Código

```python
# validators/rules_validator.py

class C2AIRulesValidator:
    """Validador de las 8 reglas inviolables"""
    
    RULES = {
        'data_hierarchy': {
            'priority': [
                'postgresql_m5',
                'davis_weatherlink', 
                'google_sheets',
                'external_apis',
                'agents_ai',
                'historical_models'
            ],
            'violation_action': 'REJECT'
        },
        'agronomic_coherence': {
            'weighted_by_section': ['IPF', 'NPF', 'PE', 'phi'],
            'general': ['IAH', 'IEH', 'clima'],
            'violation_action': 'WARN_AND_RECALCULATE'
        },
        'temporal_period': {
            'required_formats': ['MESyyMM', 'SEMyyWW', 'YYYY-MM-DD'],
            'violation_action': 'REJECT'
        },
        'no_modify_existing': {
            'protected_schemas': ['appsheet', 'weather', 'agronomy', 
                                  'market', 'production', 'public'],
            'violation_action': 'BLOCK'
        },
        'plant_goal_alignment': {
            'min_alignment_score': 0.7,
            'violation_action': 'REQUIRE_MANUAL_APPROVAL'
        },
        'free_energy_reduction': {
            'max_F_increase': 0.1,
            'violation_action': 'REQUIRE_JUSTIFICATION'
        },
        'optimal_trajectory': {
            'min_efficiency': 0.85,
            'violation_action': 'DEFER_TO_HUMAN'
        },
        'kernel_confidence': {
            'min_confidence': 0.75,
            'violation_action': 'DEFER_TO_HUMAN'
        }
    }
    
    def validate_decision(self, decision: dict) -> tuple[bool, list[str]]:
        """Validar decisión contra las 8 reglas"""
        violations = []
        
        # Regla 1: Jerarquía de datos
        if not self._check_data_hierarchy(decision):
            violations.append("REGLA_1: Violación jerarquía de datos")
        
        # Regla 2: Coherencia agronómica
        if not self._check_agronomic_coherence(decision):
            violations.append("REGLA_2: Cálculo sin coherencia agronómica")
        
        # ... validar todas las reglas
        
        return len(violations) == 0, violations
```

---

## 3. 10 COMPONENTES DE ANÁLISIS Y REPORTE {#3-componentes-analisis}

Cada análisis y reporte de C²AI DEBE incluir estos 10 componentes:

```
╔═══════════════════════════════════════════════════════════════════╗
║            10 COMPONENTES OBLIGATORIOS DE TODO REPORTE             ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ 1. TIMESTAMP Y PERÍODO                                             ║
║    • Fecha/hora de generación                                      ║
║    • Período de datos analizado (desde-hasta)                      ║
║    • Zona horaria explícita (America/Mexico_City)                  ║
║                                                                    ║
║ 2. FUENTES DE DATOS UTILIZADAS                                     ║
║    • Lista de tablas consultadas                                   ║
║    • Conteo de registros por fuente                                ║
║    • Timestamp de última actualización de cada fuente              ║
║                                                                    ║
║ 3. ESTADO FENOLÓGICO ACTUAL                                        ║
║    • FEN-XX por sección (S1, S2, S3)                               ║
║    • GDD acumulado desde BioFix                                    ║
║    • Días estimados a siguiente fase                               ║
║                                                                    ║
║ 4. MÉTRICAS C²AI POR CAPA                                          ║
║    • Penrose: coherence_index, decision_space_entropy              ║
║    • Friston: free_energy, kl_divergence, urgency                  ║
║    • Levin: goals_detected[], alignment_scores                     ║
║    • Hoffman: kernel_confidence, conflicts_resolved                ║
║    • Watson: trajectory_efficiency, friction_breakdown             ║
║                                                                    ║
║ 5. CONTRIBUCIÓN POR CAPA AL VEP                                    ║
║    • Peso efectivo de cada capa en decisión                        ║
║    • Synergy score (interacción entre capas)                       ║
║    • Comparación vs baseline (sin C²AI)                            ║
║                                                                    ║
║ 6. DECISIONES TOMADAS/RECOMENDADAS                                 ║
║    • Lista de acciones con urgency ranking                         ║
║    • Razonamiento multicapa (rationale JSONB)                      ║
║    • Impacto VEP esperado por decisión                             ║
║                                                                    ║
║ 7. ALINEACIÓN CON OBJETIVOS DE LA PLANTA                           ║
║    • Objetivos bioeléctricos detectados                            ║
║    • Score de alineación por acción                                ║
║    • Acciones contradictorias identificadas                        ║
║                                                                    ║
║ 8. PROYECCIÓN ECONÓMICA                                            ║
║    • VEP actual vs proyectado                                      ║
║    • Intervalo de confianza (95%)                                  ║
║    • Escenarios optimista/pesimista                                ║
║                                                                    ║
║ 9. RIESGOS Y ALERTAS                                               ║
║    • Factores de riesgo identificados                              ║
║    • Nivel de severidad (low/medium/high/critical)                 ║
║    • Acciones de mitigación recomendadas                           ║
║                                                                    ║
║ 10. VALIDACIÓN Y CONFIANZA                                         ║
║     • Confidence score general (0-1)                               ║
║     • Reglas inviolables verificadas                               ║
║     • Checksum de integridad de datos                              ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 3.1 Template de Reporte C²AI

```python
@dataclass
class C2AIReport:
    """Template obligatorio para todo reporte C²AI"""
    
    # 1. Timestamp y Período
    generated_at: datetime
    period_start: datetime
    period_end: datetime
    timezone: str = "America/Mexico_City"
    
    # 2. Fuentes de Datos
    data_sources: List[DataSourceInfo]
    
    # 3. Estado Fenológico
    phenology_by_section: Dict[str, PhenologyState]
    
    # 4. Métricas C²AI
    penrose_metrics: PenroseMetrics
    friston_metrics: FristonMetrics
    levin_metrics: LevinMetrics
    hoffman_metrics: HoffmanMetrics
    watson_metrics: WatsonMetrics
    
    # 5. Contribución por Capa
    layer_contributions: Dict[str, float]
    synergy_score: float
    
    # 6. Decisiones
    decisions: List[Decision]
    
    # 7. Alineación
    goal_alignment: GoalAlignmentSummary
    
    # 8. Proyección Económica
    vep_current: float
    vep_projected: float
    confidence_interval: Tuple[float, float]
    
    # 9. Riesgos
    risks: List[RiskFactor]
    
    # 10. Validación
    confidence_score: float
    rules_validated: List[str]
    data_checksum: str
```

---

## 4. PROTOCOLO DE PRUEBAS PARCIALES {#4-protocolo-pruebas}

### 4.1 Matriz de Pruebas por Fase

```
╔════════════════════════════════════════════════════════════════════╗
║                    PROTOCOLO DE PRUEBAS C²AI                        ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║ NIVEL 1: PRUEBAS UNITARIAS (Por cada módulo)                        ║
║ ─────────────────────────────────────────────                       ║
║ □ Test de inicialización                                            ║
║ □ Test de conexión a BD                                             ║
║ □ Test de cálculos con datos mock                                   ║
║ □ Test de cálculos con datos edge-case                              ║
║ □ Test de manejo de errores                                         ║
║ □ Test de logging                                                   ║
║ Coverage mínimo: 85%                                                ║
║                                                                     ║
║ NIVEL 2: PRUEBAS DE INTEGRACIÓN (Entre módulos)                     ║
║ ────────────────────────────────────────────────                    ║
║ □ Friston → Levin (F influye en goal detection)                     ║
║ □ Levin → Watson (goals influyen en trajectory)                     ║
║ □ Watson → Hoffman (trajectory informa kernel)                      ║
║ □ Hoffman → Orquestador (kernel genera decisiones)                  ║
║ □ Penrose → Todas (coherence afecta todas las capas)                ║
║                                                                     ║
║ NIVEL 3: PRUEBAS DE DATOS REALES                                    ║
║ ─────────────────────────────────────                               ║
║ □ Conexión a PostgreSQL M5 (44.247.163.1)                           ║
║ □ Query a weather.davis_weatherlink_complete                        ║
║ □ Query a appsheet.arboles                                          ║
║ □ Query a market.precios_semanales_historicos                       ║
║ □ Query a agronomy.fenologia_actual                                 ║
║ □ Validar datos no nulos                                            ║
║ □ Validar rangos esperados                                          ║
║                                                                     ║
║ NIVEL 4: PRUEBAS DE CARGA                                           ║
║ ────────────────────────────                                        ║
║ □ 27,488 árboles procesados en <30 segundos                         ║
║ □ 1,000 requests/minuto a APIs                                      ║
║ □ Ciclo completo orquestación <180 segundos                         ║
║                                                                     ║
║ NIVEL 5: PRUEBAS DE REGRESIÓN                                       ║
║ ──────────────────────────────                                      ║
║ □ Dashboard v5.2 sigue funcionando                                  ║
║ □ APIs existentes (8501) sin cambios                                ║
║ □ Sincronización AppSheet intacta                                   ║
║ □ Davis WeatherLink sync intacto                                    ║
║                                                                     ║
╚════════════════════════════════════════════════════════════════════╝
```

### 4.2 Script de Pruebas Automatizadas

```bash
#!/bin/bash
# test_c2ai_progressive.sh - Pruebas progresivas C²AI

set -e  # Fallar si cualquier comando falla

echo "═══════════════════════════════════════════════════"
echo "         C²AI PROTOCOLO DE PRUEBAS PROGRESIVAS     "
echo "═══════════════════════════════════════════════════"

# CHECKPOINT 1: Conectividad
echo "📡 CHECKPOINT 1: Verificando conectividad..."
pg_isready -h 44.247.163.1 -p 5432 -U postgres || exit 1
echo "✅ PostgreSQL accesible"

# CHECKPOINT 2: Schema c2ai existe
echo "📊 CHECKPOINT 2: Verificando schema c2ai..."
TABLES=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h 44.247.163.1 -U postgres \
  -d citrusmax_biofix -t -c \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='c2ai'")
if [ "$TABLES" -lt 10 ]; then
  echo "❌ Schema c2ai incompleto: $TABLES tablas"
  exit 1
fi
echo "✅ Schema c2ai: $TABLES tablas"

# CHECKPOINT 3: Datos de referencia
echo "🌡️ CHECKPOINT 3: Verificando datos Davis..."
WEATHER=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h 44.247.163.1 -U postgres \
  -d citrusmax_biofix -t -c \
  "SELECT COUNT(*) FROM weather.davis_weatherlink_complete 
   WHERE fecha > CURRENT_DATE - INTERVAL '7 days'")
if [ "$WEATHER" -lt 1 ]; then
  echo "❌ Sin datos Davis recientes"
  exit 1
fi
echo "✅ Datos Davis: $WEATHER registros última semana"

# CHECKPOINT 4: Tests unitarios
echo "🧪 CHECKPOINT 4: Ejecutando tests unitarios..."
cd /opt/citrusmax/c2ai
python -m pytest tests/ -v --tb=short || exit 1
echo "✅ Tests unitarios pasaron"

# CHECKPOINT 5: Test de capas
echo "🧠 CHECKPOINT 5: Probando capas C²AI..."
python -c "
from layers.friston_layer import FristonLayer
from layers.levin_layer import LevinLayer
print('Friston: OK')
print('Levin: OK')
" || exit 1
echo "✅ Capas C²AI operativas"

# CHECKPOINT 6: API health
echo "🔌 CHECKPOINT 6: Verificando API C²AI..."
curl -f http://localhost:8501/api/v1/c2ai/health || exit 1
echo "✅ API C²AI respondiendo"

# CHECKPOINT 7: Dashboard existente intacto
echo "🖥️ CHECKPOINT 7: Verificando dashboard v5.2..."
curl -f https://citrusmax.ai/dashboard/ -o /dev/null || exit 1
echo "✅ Dashboard v5.2 operativo"

echo ""
echo "═══════════════════════════════════════════════════"
echo "         ✅ TODAS LAS PRUEBAS PASARON              "
echo "═══════════════════════════════════════════════════"
```

---

## 5. CONEXIONES A DATOS REALES {#5-conexiones-datos}

### 5.1 Mapeo de Fuentes de Datos

```python
# config/data_sources.py

DATA_SOURCES = {
    # ═══════════════════════════════════════════════════════════════
    # PRIORIDAD 1: PostgreSQL M5 (Fuente de Verdad)
    # ═══════════════════════════════════════════════════════════════
    'postgresql': {
        'host': '44.247.163.1',
        'port': 5432,
        'database': 'citrusmax_biofix',
        'tables': {
            # Datos operativos
            'appsheet.arboles': {
                'records': 27488, 'columns': 201,
                'refresh': 'every_30_min', 'critical': True
            },
            'appsheet.aplicaciones': {
                'records': 9793, 'columns': 49,
                'refresh': 'every_30_min', 'critical': True
            },
            'appsheet.muestreo': {
                'records': 5108, 'columns': 109,
                'refresh': 'every_30_min', 'critical': True
            },
            # Clima
            'weather.davis_weatherlink_complete': {
                'records': 586, 'columns': 265,
                'refresh': 'every_15_min', 'critical': True
            },
            # Agronómico
            'agronomy.fenologia_actual': {
                'records': 9, 'columns': 9,
                'refresh': 'daily', 'critical': True
            },
            'agronomy.nutricion_hoja': {
                'records': 502, 'columns': 22,
                'refresh': 'weekly', 'critical': False
            },
            # Mercado
            'market.precios_semanales_historicos': {
                'records': 258, 'columns': 5,
                'refresh': 'weekly', 'critical': True
            },
            # Producción
            'production.empacadora_produccion_calidad': {
                'records': 248, 'columns': 13,
                'refresh': 'daily', 'critical': True
            }
        }
    },
    
    # ═══════════════════════════════════════════════════════════════
    # PRIORIDAD 2: Davis WeatherLink API
    # ═══════════════════════════════════════════════════════════════
    'davis_weatherlink': {
        'api_key': 'x4mnd1oinszvb44ne8kqeomrc55qwjen',
        'api_secret': 'yt6fosjhrhctfv3qrjijydxpz14dgknh',
        'station_id': '223180',
        'device_id': '001D0A80B827',
        'variables': 265,
        'refresh': 'every_15_min'
    },
    
    # ═══════════════════════════════════════════════════════════════
    # PRIORIDAD 3: Google Sheets
    # ═══════════════════════════════════════════════════════════════
    'google_sheets': {
        'spreadsheet': 'R La Luz',
        'creds_path': '/opt/citrusmax/config/citrusmax-google-creds.json',
        'refresh': 'every_30_min'
    },
    
    # ═══════════════════════════════════════════════════════════════
    # PRIORIDAD 4: APIs Externas
    # ═══════════════════════════════════════════════════════════════
    'external_apis': {
        'usda': {
            'key': '7hGDUDnBCeGWiktqTIaXdJhE3lf05hfboRmhdpxX',
            'purpose': 'precios_mercado'
        },
        'tomorrow_io': {
            'key': '56o4qH7ini5skUUB0baQlBjTQBoZU2xQ',
            'purpose': 'forecast_clima'
        },
        'nasa_power': {
            'url': 'https://power.larc.nasa.gov/api/',
            'purpose': 'radiacion_solar'
        }
    }
}
```

### 5.2 Verificación de Conexiones

```python
# utils/connection_validator.py

async def validate_all_connections() -> Dict[str, bool]:
    """Validar todas las conexiones a fuentes de datos"""
    results = {}
    
    # PostgreSQL
    try:
        conn = psycopg2.connect(
            host=DATA_SOURCES['postgresql']['host'],
            port=DATA_SOURCES['postgresql']['port'],
            database=DATA_SOURCES['postgresql']['database'],
            user='postgres',
            password=os.getenv('POSTGRES_PASSWORD')
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        results['postgresql'] = True
        conn.close()
    except Exception as e:
        results['postgresql'] = False
        logger.error(f"PostgreSQL: {e}")
    
    # Davis WeatherLink
    try:
        response = await fetch_davis_current()
        results['davis'] = response.get('data') is not None
    except:
        results['davis'] = False
    
    # Validar tablas críticas
    for table, config in DATA_SOURCES['postgresql']['tables'].items():
        if config.get('critical'):
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                results[table] = count > 0
            except:
                results[table] = False
    
    return results
```

---

## 6. MANEJO DE ERRORES {#6-manejo-errores}

### 6.1 Estrategia de Capas de Error

```python
# error_handling/strategy.py

class C2AIErrorHandler:
    """Estrategia multicapa de manejo de errores"""
    
    ERROR_LEVELS = {
        'CRITICAL': {
            'action': 'STOP_AND_ALERT',
            'notify': ['sms', 'email', 'slack'],
            'fallback': 'use_last_known_good'
        },
        'HIGH': {
            'action': 'RETRY_WITH_FALLBACK',
            'notify': ['email', 'slack'],
            'fallback': 'use_cached_data'
        },
        'MEDIUM': {
            'action': 'LOG_AND_CONTINUE',
            'notify': ['slack'],
            'fallback': 'skip_component'
        },
        'LOW': {
            'action': 'LOG_ONLY',
            'notify': [],
            'fallback': 'ignore'
        }
    }
    
    ERROR_CATALOG = {
        # Errores de conexión
        'DB_CONNECTION_FAILED': {
            'level': 'CRITICAL',
            'message': 'No se puede conectar a PostgreSQL M5',
            'recovery': 'Verificar red, credenciales, servicio postgres'
        },
        'DAVIS_API_TIMEOUT': {
            'level': 'HIGH',
            'message': 'Davis WeatherLink no responde',
            'recovery': 'Usar datos más recientes de BD'
        },
        
        # Errores de datos
        'EMPTY_QUERY_RESULT': {
            'level': 'MEDIUM',
            'message': 'Query retornó 0 registros',
            'recovery': 'Verificar período, usar defaults'
        },
        'INVALID_DATA_FORMAT': {
            'level': 'MEDIUM',
            'message': 'Formato de datos inválido',
            'recovery': 'Sanitizar y reintentar'
        },
        
        # Errores de cálculo
        'FREE_ENERGY_NAN': {
            'level': 'HIGH',
            'message': 'Cálculo de F resultó en NaN',
            'recovery': 'Verificar inputs, usar último F válido'
        },
        'GOAL_DETECTION_FAILED': {
            'level': 'MEDIUM',
            'message': 'No se detectaron objetivos bioeléctricos',
            'recovery': 'Usar objetivos por defecto para fenología'
        },
        
        # Errores de sistema
        'OUT_OF_MEMORY': {
            'level': 'CRITICAL',
            'message': 'Sistema sin memoria disponible',
            'recovery': 'Reiniciar servicio, liberar caché'
        },
        'DISK_FULL': {
            'level': 'CRITICAL',
            'message': 'Disco lleno',
            'recovery': 'Limpiar logs antiguos, alertar admin'
        }
    }
    
    def handle_error(self, error_code: str, context: dict = None):
        """Manejar error según catálogo"""
        error_info = self.ERROR_CATALOG.get(error_code, {
            'level': 'LOW',
            'message': 'Error desconocido',
            'recovery': 'Revisar logs'
        })
        
        level_config = self.ERROR_LEVELS[error_info['level']]
        
        # Logging
        logger.error(f"[{error_code}] {error_info['message']}", extra=context)
        
        # Notificaciones
        for channel in level_config['notify']:
            self._notify(channel, error_code, error_info, context)
        
        # Acción
        if level_config['action'] == 'STOP_AND_ALERT':
            raise CriticalC2AIError(error_code, error_info)
        elif level_config['action'] == 'RETRY_WITH_FALLBACK':
            return self._execute_fallback(level_config['fallback'], context)
        elif level_config['action'] == 'LOG_AND_CONTINUE':
            return self._execute_fallback(level_config['fallback'], context)
        
        return None
```

### 6.2 Circuit Breaker Pattern

```python
class CircuitBreaker:
    """Circuit breaker para proteger servicios externos"""
    
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
        self.last_failure_time = None
    
    async def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if self._should_try_reset():
                self.state = 'HALF_OPEN'
            else:
                raise CircuitOpenError()
        
        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
            logger.warning(f"Circuit breaker OPEN after {self.failure_count} failures")
    
    def _on_success(self):
        self.failure_count = 0
        self.state = 'CLOSED'
```

---

## 7. BACKUPS PROGRESIVOS {#7-backups}

### 7.1 Estrategia de Backups

```
╔═══════════════════════════════════════════════════════════════════╗
║                    ESTRATEGIA DE BACKUPS C²AI                      ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ NIVEL 1: PRE-DEPLOYMENT BACKUP (Antes de cualquier cambio)        ║
║ ──────────────────────────────────────────────────────────        ║
║ • Snapshot EC2 completo                                           ║
║ • pg_dump citrusmax_biofix completo                               ║
║ • tar /opt/citrusmax/ completo                                    ║
║ • Guardar en S3: s3://citrusmax-backups/pre-c2ai/                 ║
║                                                                    ║
║ NIVEL 2: CHECKPOINT BACKUPS (Cada fase completada)                 ║
║ ──────────────────────────────────────────────────                ║
║ • Fase 1 complete → backup_fase1_YYYYMMDD.tar.gz                  ║
║ • Fase 2 complete → backup_fase2_YYYYMMDD.tar.gz                  ║
║ • Fase 3 complete → backup_fase3_YYYYMMDD.tar.gz                  ║
║ • etc.                                                            ║
║                                                                    ║
║ NIVEL 3: DAILY BACKUPS (Automáticos)                               ║
║ ──────────────────────────                                        ║
║ • 06:00 UTC: pg_dump schema c2ai                                  ║
║ • Retención: 30 días                                              ║
║ • Ubicación: /opt/citrusmax/backups/daily/                        ║
║                                                                    ║
║ NIVEL 4: HOURLY SNAPSHOTS (Solo tablas críticas)                   ║
║ ────────────────────────────────────────────────                  ║
║ • c2ai.orchestrator_decisions → snapshot cada hora                ║
║ • c2ai.free_energy_logs → snapshot cada hora                      ║
║ • Retención: 48 horas                                             ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 7.2 Scripts de Backup

```bash
#!/bin/bash
# backup_c2ai.sh - Backup progresivo C²AI

BACKUP_DIR="/opt/citrusmax/backups"
S3_BUCKET="s3://citrusmax-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorios
mkdir -p $BACKUP_DIR/{pre-deploy,checkpoints,daily,hourly}

backup_pre_deploy() {
    echo "📦 Creando backup pre-deployment..."
    
    # PostgreSQL completo
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h 44.247.163.1 -U postgres \
        citrusmax_biofix | gzip > $BACKUP_DIR/pre-deploy/db_$DATE.sql.gz
    
    # Código fuente
    tar -czf $BACKUP_DIR/pre-deploy/code_$DATE.tar.gz /opt/citrusmax/
    
    # Subir a S3
    aws s3 cp $BACKUP_DIR/pre-deploy/ $S3_BUCKET/pre-c2ai/ --recursive
    
    echo "✅ Backup pre-deploy completado"
}

backup_checkpoint() {
    PHASE=$1
    echo "📦 Creando checkpoint backup fase $PHASE..."
    
    # Solo schema c2ai
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h 44.247.163.1 -U postgres \
        -n c2ai citrusmax_biofix | gzip > $BACKUP_DIR/checkpoints/c2ai_fase${PHASE}_$DATE.sql.gz
    
    # Código c2ai
    tar -czf $BACKUP_DIR/checkpoints/code_fase${PHASE}_$DATE.tar.gz /opt/citrusmax/c2ai/
    
    echo "✅ Checkpoint fase $PHASE completado"
}

backup_daily() {
    echo "📦 Backup diario..."
    
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h 44.247.163.1 -U postgres \
        -n c2ai citrusmax_biofix | gzip > $BACKUP_DIR/daily/c2ai_$DATE.sql.gz
    
    # Limpiar backups > 30 días
    find $BACKUP_DIR/daily -mtime +30 -delete
    
    echo "✅ Backup diario completado"
}

backup_hourly() {
    echo "📦 Snapshot horario de tablas críticas..."
    
    PGPASSWORD=$POSTGRES_PASSWORD psql -h 44.247.163.1 -U postgres \
        -d citrusmax_biofix -c \
        "COPY c2ai.orchestrator_decisions TO '/tmp/decisions_$DATE.csv' CSV HEADER"
    
    mv /tmp/decisions_$DATE.csv $BACKUP_DIR/hourly/
    
    # Limpiar snapshots > 48 horas
    find $BACKUP_DIR/hourly -mmin +2880 -delete
    
    echo "✅ Snapshot horario completado"
}

# Ejecutar según argumento
case "$1" in
    pre-deploy) backup_pre_deploy ;;
    checkpoint) backup_checkpoint $2 ;;
    daily) backup_daily ;;
    hourly) backup_hourly ;;
    *) echo "Uso: $0 {pre-deploy|checkpoint N|daily|hourly}" ;;
esac
```

---

## 8. RECUPERACIÓN AUTOMÁTICA {#8-recuperacion}

### 8.1 Procedimientos de Recuperación

```
╔═══════════════════════════════════════════════════════════════════╗
║              PROCEDIMIENTOS DE RECUPERACIÓN AUTOMÁTICA             ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ ESCENARIO 1: Fallo de Servicio C²AI                               ║
║ ─────────────────────────────────────                             ║
║ Trigger: systemd detecta servicio caído                           ║
║ Acción:  Restart=on-failure (max 3 intentos)                      ║
║ Fallback: Alertar admin, dashboard funciona sin C²AI              ║
║                                                                    ║
║ ESCENARIO 2: Corrupción de Datos C²AI                             ║
║ ─────────────────────────────────────                             ║
║ Trigger: Checksum mismatch en tablas c2ai.*                       ║
║ Acción:  Restaurar último backup diario válido                    ║
║ Script:  /opt/citrusmax/scripts/restore_c2ai.sh                   ║
║                                                                    ║
║ ESCENARIO 3: PostgreSQL No Disponible                             ║
║ ─────────────────────────────────────                             ║
║ Trigger: pg_isready falla 3 veces consecutivas                    ║
║ Acción:  Usar caché Redis (últimos 24h de datos)                  ║
║ Degradación: Modo read-only, sin nuevas decisiones                ║
║                                                                    ║
║ ESCENARIO 4: Davis WeatherLink Sin Datos                          ║
║ ─────────────────────────────────────────                         ║
║ Trigger: Sin datos >2 horas                                       ║
║ Acción:  Fallback a Tomorrow.io API                               ║
║ Script:  /opt/citrusmax/sync-protected/sync_failsafe.sh           ║
║                                                                    ║
║ ESCENARIO 5: Rollback Completo                                    ║
║ ──────────────────────────────                                    ║
║ Trigger: Decisión manual del administrador                        ║
║ Acción:  Restaurar snapshot pre-deploy completo                   ║
║ Tiempo:  <30 minutos                                              ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 8.2 Script de Recuperación Automática

```bash
#!/bin/bash
# recovery_c2ai.sh - Recuperación automática C²AI

BACKUP_DIR="/opt/citrusmax/backups"
LOG_FILE="/var/log/citrusmax/recovery.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

recover_service() {
    log "Iniciando recuperación de servicio C²AI..."
    
    # Verificar si el servicio está caído
    if ! systemctl is-active --quiet citrusmax-c2ai; then
        log "Servicio caído, intentando restart..."
        systemctl restart citrusmax-c2ai
        sleep 10
        
        if systemctl is-active --quiet citrusmax-c2ai; then
            log "✅ Servicio recuperado exitosamente"
            return 0
        else
            log "❌ Fallo en restart, alertando admin..."
            send_alert "C²AI service failed to recover"
            return 1
        fi
    fi
}

recover_database() {
    log "Iniciando recuperación de base de datos C²AI..."
    
    # Encontrar último backup válido
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/daily/c2ai_*.sql.gz | head -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        log "❌ No se encontró backup válido"
        return 1
    fi
    
    log "Restaurando desde: $LATEST_BACKUP"
    
    # Drop y recrear schema
    PGPASSWORD=$POSTGRES_PASSWORD psql -h 44.247.163.1 -U postgres \
        -d citrusmax_biofix -c "DROP SCHEMA IF EXISTS c2ai CASCADE;"
    
    # Restaurar
    gunzip -c $LATEST_BACKUP | PGPASSWORD=$POSTGRES_PASSWORD psql \
        -h 44.247.163.1 -U postgres -d citrusmax_biofix
    
    log "✅ Base de datos C²AI restaurada"
}

activate_degraded_mode() {
    log "Activando modo degradado..."
    
    # Crear flag de modo degradado
    touch /tmp/c2ai_degraded_mode
    
    # Notificar al frontend
    redis-cli SET c2ai:status "degraded"
    redis-cli SET c2ai:message "Sistema en modo de solo lectura"
    
    log "✅ Modo degradado activado"
}

full_rollback() {
    log "⚠️ Iniciando rollback completo a pre-deploy..."
    
    # Parar servicios C²AI
    systemctl stop citrusmax-c2ai || true
    
    # Restaurar base de datos completa
    LATEST_FULL=$(ls -t $BACKUP_DIR/pre-deploy/db_*.sql.gz | head -1)
    gunzip -c $LATEST_FULL | PGPASSWORD=$POSTGRES_PASSWORD psql \
        -h 44.247.163.1 -U postgres -d citrusmax_biofix
    
    # Restaurar código
    LATEST_CODE=$(ls -t $BACKUP_DIR/pre-deploy/code_*.tar.gz | head -1)
    tar -xzf $LATEST_CODE -C /
    
    log "✅ Rollback completo exitoso"
}

send_alert() {
    MESSAGE=$1
    # Email
    echo "$MESSAGE" | mail -s "C²AI Alert" manuel@citrusmax.ai
    # Slack/Telegram integration
    curl -X POST "https://hooks.slack.com/..." -d "{\"text\":\"$MESSAGE\"}"
}

# Ejecutar según argumento
case "$1" in
    service) recover_service ;;
    database) recover_database ;;
    degraded) activate_degraded_mode ;;
    rollback) full_rollback ;;
    *) echo "Uso: $0 {service|database|degraded|rollback}" ;;
esac
```

---

## 9. ANTI-DUPLICIDAD DE PANELES {#9-anti-duplicidad}

### 9.1 Auditoría de Paneles Existentes

```
╔═══════════════════════════════════════════════════════════════════╗
║           INVENTARIO DE PANELES CITRUSMAX DASHBOARD v5.2           ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ PANELES EXISTENTES (NO DUPLICAR)                                  ║
║ ─────────────────────────────────                                 ║
║ 1. DashboardHome      - Resumen general, KPIs principales         ║
║ 2. WeatherPanel       - Clima Davis, pronóstico                   ║
║ 3. PhenologyPanel     - Estado fenológico, GDD                    ║
║ 4. HealthPanel        - IPF, plagas, enfermedades                 ║
║ 5. IrrigationPanel    - IAH, balance hídrico                      ║
║ 6. NutritionPanel     - NPF, análisis foliar                      ║
║ 7. HarvestPanel       - Producción, cortes, calidad               ║
║ 8. MarketPanel        - Precios, tendencias USDA                  ║
║ 9. PEDashboard        - Potencial Económico                       ║
║ 10. VEPOptimizer      - Optimización VEP                          ║
║ 11. AlertsPanel       - Sistema de alertas                        ║
║ 12. ReportsPanel      - Reportes y exportación                    ║
║                                                                    ║
║ NUEVOS PANELES C²AI (ÚNICOS, SIN OVERLAP)                         ║
║ ─────────────────────────────────────────                         ║
║ 1. C2AIDashboard      - Vista unificada de las 5 capas            ║
║ 2. FristonPanel       - Energía libre, urgencia                   ║
║ 3. LevinGoalsPanel    - Objetivos bioeléctricos                   ║
║ 4. WatsonLandscape    - Trayectoria energética                    ║
║ 5. HoffmanKernel      - Resolución de conflictos                  ║
║ 6. PenroseCoherence   - Coherencia cuántica (proxy)               ║
║ 7. DecisionTimeline   - Historial de decisiones C²AI              ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 9.2 Estrategia de Integración Sin Duplicidad

```python
# frontend/integration_strategy.py

"""
REGLAS DE INTEGRACIÓN ANTI-DUPLICIDAD
=====================================

1. C²AI consume datos de paneles existentes, NO los replica
2. C²AI agrega CAPAS DE ANÁLISIS sobre datos existentes
3. Navegación: C²AI es una SECCIÓN NUEVA en sidebar
4. Componentes compartidos usan React Context global
"""

# Mapeo de datos: C²AI → Paneles Existentes
DATA_INTEGRATION_MAP = {
    # Capa Friston usa datos de:
    'friston': {
        'sources': ['WeatherPanel', 'HealthPanel', 'NutritionPanel'],
        'computes': ['free_energy', 'kl_divergence', 'urgency'],
        'does_not_replicate': ['temperatura', 'IPF', 'NPF']
    },
    
    # Capa Levin usa datos de:
    'levin': {
        'sources': ['PhenologyPanel', 'HarvestPanel'],
        'computes': ['bioelectric_goals', 'alignment_score'],
        'does_not_replicate': ['estado_fenologico', 'GDD']
    },
    
    # Capa Watson usa datos de:
    'watson': {
        'sources': ['PEDashboard', 'MarketPanel'],
        'computes': ['energy_landscape', 'optimal_trajectory'],
        'does_not_replicate': ['PE_actual', 'precios']
    },
    
    # Capa Hoffman usa datos de:
    'hoffman': {
        'sources': ['All existing agents'],
        'computes': ['kernel_state', 'conflict_resolution'],
        'does_not_replicate': ['agent_outputs']
    },
    
    # Capa Penrose usa datos de:
    'penrose': {
        'sources': ['All layers'],
        'computes': ['coherence_index', 'decision_entropy'],
        'does_not_replicate': ['layer_outputs']
    }
}

# Componentes React compartidos
SHARED_COMPONENTS = [
    'useWeatherData',      # Hook para datos climáticos
    'usePhenologyState',   # Hook para estado fenológico
    'useMarketPrices',     # Hook para precios
    'useAgentOutputs',     # Hook para salidas de agentes
    'DataFreshnessBadge',  # Indicador de frescura de datos
    'SectionSelector',     # Selector S1/S2/S3
    'DateRangePicker',     # Selector de período
]
```

### 9.3 Arquitectura de Navegación

```
┌─────────────────────────────────────────────────────────────┐
│                    CITRUSMAX DASHBOARD                       │
├─────────────────────────────────────────────────────────────┤
│  SIDEBAR                 │  MAIN CONTENT                    │
│  ────────                │  ────────────                    │
│  📊 Dashboard            │                                  │
│  🌡️ Clima               │  [Panel según selección]         │
│  🌸 Fenología           │                                  │
│  🐛 Sanidad             │                                  │
│  💧 Riego               │                                  │
│  🌿 Nutrición           │                                  │
│  🍋 Cosecha             │                                  │
│  📈 Mercado             │                                  │
│  💰 PE/VEP              │                                  │
│  ─────────────────      │                                  │
│  🧠 C²AI [NUEVO]        │  ← Nueva sección, no reemplaza   │
│    ├─ Overview          │     nada existente               │
│    ├─ Capas             │                                  │
│    ├─ Decisiones        │                                  │
│    └─ Configuración     │                                  │
│  ─────────────────      │                                  │
│  ⚙️ Configuración       │                                  │
│  📋 Reportes            │                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. CRONOGRAMA DE EJECUCIÓN {#10-cronograma}

### 10.1 Timeline de 28 Días

```
╔═══════════════════════════════════════════════════════════════════╗
║                    CRONOGRAMA C²AI - 28 DÍAS                       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ SEMANA 1 (Días 1-7): FUNDAMENTOS                                  ║
║ ────────────────────────────────                                  ║
║ D1  │ Backup pre-deploy, snapshot EC2                             ║
║ D2  │ Crear estructura directorios, instalar deps                 ║
║ D3  │ Ejecutar schema.sql, verificar tablas                       ║
║ D4  │ Implementar FristonLayer + tests                            ║
║ D5  │ Implementar LevinLayer + tests                              ║
║ D6  │ Implementar WatsonLayer + tests                             ║
║ D7  │ CHECKPOINT: Validar 3 capas con datos reales                ║
║     │ ✅ Backup checkpoint fase 1                                 ║
║                                                                    ║
║ SEMANA 2 (Días 8-14): CAPAS AVANZADAS                             ║
║ ──────────────────────────────────                                ║
║ D8  │ Implementar HoffmanLayer + tests                            ║
║ D9  │ Implementar PenroseLayer + tests                            ║
║ D10 │ Tests de integración 5 capas                                ║
║ D11 │ Implementar DrCitrusMaxOrchestrator                         ║
║ D12 │ Integrar con 7 agentes existentes                           ║
║ D13 │ Test ciclo completo orquestación                            ║
║ D14 │ CHECKPOINT: Orquestador funcional                           ║
║     │ ✅ Backup checkpoint fase 2                                 ║
║                                                                    ║
║ SEMANA 3 (Días 15-21): APIS Y FRONTEND                            ║
║ ──────────────────────────────────                                ║
║ D15 │ Crear router FastAPI /api/v1/c2ai/                          ║
║ D16 │ Implementar 15 endpoints                                    ║
║ D17 │ Configurar servicio systemd                                 ║
║ D18 │ Crear componentes React C²AI                                ║
║ D19 │ Integrar con dashboard existente                            ║
║ D20 │ Tests E2E frontend-backend                                  ║
║ D21 │ CHECKPOINT: Dashboard C²AI funcional                        ║
║     │ ✅ Backup checkpoint fase 3                                 ║
║                                                                    ║
║ SEMANA 4 (Días 22-28): VALIDACIÓN Y GO-LIVE                       ║
║ ───────────────────────────────────────                           ║
║ D22 │ Backtesting con datos históricos                            ║
║ D23 │ Monte Carlo 10,000 simulaciones                             ║
║ D24 │ Piloto Sección S1                                           ║
║ D25 │ Análisis de resultados piloto                               ║
║ D26 │ Ajustes finales, documentación                              ║
║ D27 │ Training equipo operativo                                   ║
║ D28 │ GO-LIVE PRODUCCIÓN                                          ║
║     │ 🚀 C²AI en citrusmax.ai/dashboard/c2ai/                     ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 10.2 Métricas de Éxito

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Uptime C²AI | >99.5% | Prometheus |
| Latencia decisión | <5 segundos | API metrics |
| Accuracy predicciones | >85% | Backtesting |
| VEP improvement | >+25% | vs baseline |
| Zero duplicidad | 0 paneles duplicados | Code review |
| Test coverage | >85% | pytest-cov |
| Zero regresiones | 0 fallos en v5.2 | E2E tests |

---

## 📝 AUTORIZACIÓN

```
═══════════════════════════════════════════════════════════════════
                     SOLICITUD DE AUTORIZACIÓN
═══════════════════════════════════════════════════════════════════

Yo, ___________________________, autorizo el inicio de la 
implementación del framework C²AI según el plan detallado en
este documento.

Entiendo que:
□ Se crearán backups antes de cualquier cambio
□ C²AI es una CAPA ADICIONAL, no reemplaza funcionalidad existente
□ Se seguirán las 8 reglas inviolables
□ Hay procedimientos de rollback en caso de problemas
□ El dashboard v5.2 seguirá funcionando durante la implementación

Fecha: _______________

Firma: _______________

═══════════════════════════════════════════════════════════════════
```

---

**Documento generado por**: Cascade AI  
**Para revisión de**: Dr. José Manuel Cadena  
**Proyecto**: CitrusMax AI - Conscious Citrus AI Framework
