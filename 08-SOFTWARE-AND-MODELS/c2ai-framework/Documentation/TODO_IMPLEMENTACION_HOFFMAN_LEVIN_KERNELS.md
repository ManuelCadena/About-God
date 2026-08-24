# TODO LIST: Implementación Framework Hoffman-Levin-Watson
## CitrusMax AI - Cognitive Farm Engine

**Fecha:** 30 Diciembre 2025  
**Autor:** Dr. José Manuel Cadena  
**Versión:** 1.0

---

## RESUMEN EJECUTIVO

Este documento define el plan de implementación completo para el framework Hoffman-Levin-Watson en CitrusMax AI, organizando el trabajo en:

- **Nivel MACRO:** Coherencia Global del sistema (FarmKernel)
- **Nivel MICRO:** Kernels específicos por factor de la ecuación PE

**Regla fundamental:** Cada panel debe incluir interpretación PhD del LLM.

---

## ESTRUCTURA DEL SIDEBAR (Ya implementado)

```
🧠 CONSCIENCIA (Nivel Macro)
├── Coherencia Global        [consciousness-coherence]
├── Entropy Analysis         [consciousness-entropy]
├── Trace Logic              [consciousness-traces]
└── Goal-Directed Engine     [consciousness-goal]

⚡ KERNELS MICRO (Por Factor)
├── IPF Kernel               [kernel-ipf]      ← PILOTO
├── IAH Kernel               [kernel-iah]
├── NPF Kernel               [kernel-npf]
├── ψ Kernel                 [kernel-psi]
├── φ Kernel                 [kernel-phi]
├── TRIM Kernel              [kernel-trim]
├── IND Kernel               [kernel-ind]
├── LAI Kernel               [kernel-lai]
├── Market Kernel            [kernel-market]
└── Farm Network             [kernel-network]
```

---

## FASE 1: IPF KERNEL (PILOTO) - Semanas 1-2

### 1.1 Backend - API Routes

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `api/routes/ipf_policy.py` | Endpoint principal IPF Policy | ⬜ TODO |

**Endpoints a crear:**

```python
# POST /api/v1/consciousness/ipf/policy
# Request: { section_id, horizon_weeks, ipf_target, budget, constraints }
# Response: { trajectory, policy, delta_vep, roi, comparison }

# GET /api/v1/consciousness/ipf/state/{section_id}
# Response: { ipf, band, trend, plagas, fen, gdd, pe_proyectado }

# GET /api/v1/consciousness/ipf/trajectory/{section_id}
# Query: ?weeks=4&policy=optimal
# Response: { weeks[], ipf[], pe[], actions[], costs[] }

# POST /api/v1/consciousness/ipf/simulate
# Request: { section_id, actions[], initial_state }
# Response: { trajectory, final_ipf, total_cost, delta_vep }
```

**Tareas:**
- [ ] Crear `backend/api/routes/ipf_policy.py`
- [ ] Definir modelos Pydantic para request/response
- [ ] Implementar función `get_ipf_state()` usando TraditionalAdapter
- [ ] Implementar función `calculate_ipf_transition()` con reglas Markovianas
- [ ] Implementar función `simulate_policy()` para horizonte N semanas
- [ ] Implementar función `select_optimal_policy()` comparando 3 estrategias
- [ ] Integrar con OptimizerAgent para obtener recetas y sus impactos
- [ ] Agregar análisis PhD con LLM para interpretación

### 1.2 Backend - Core Logic

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `citrusmax_bioelectric/kernels/ipf_kernel.py` | Lógica MDP para IPF | ⬜ TODO |

**Clases a crear:**

```python
class IPFState:
    """Estado semanal del factor IPF"""
    section_id: str
    timestamp: datetime
    ipf: float              # 0.0 - 1.0
    band: str               # ÓPTIMO, WARNING, ALERTA, CRÍTICO
    trend_7d: str           # UP, STABLE, DOWN
    trips: float
    diaforina: float
    arana_roja: float
    minador: float
    fen: int
    gdd: float
    pe_proyectado: float
    last_application: Optional[dict]
    days_since_treatment: int

class IPFAction(Enum):
    A0_NO_TRATAR = 0
    A1_RECETA_OPTIMA = 1
    A2_RECETA_ALTERNATIVA = 2
    A3_NUTRICION_SOPORTE = 3

class IPFKernel:
    """Kernel Markoviano para IPF"""
    def __init__(self, section_id: str)
    def get_current_state(self) -> IPFState
    def transition(self, state: IPFState, action: IPFAction) -> IPFState
    def reward(self, state: IPFState, action: IPFAction, next_state: IPFState) -> float
    def simulate(self, initial_state: IPFState, policy: List[IPFAction], weeks: int) -> List[IPFState]
    def find_optimal_policy(self, initial_state: IPFState, horizon: int) -> List[IPFAction]
```

**Tareas:**
- [ ] Crear directorio `citrusmax_bioelectric/kernels/`
- [ ] Crear `__init__.py` con exports
- [ ] Implementar `IPFState` dataclass
- [ ] Implementar `IPFAction` enum con atributos
- [ ] Implementar `IPFKernel` con lógica MDP
- [ ] Definir bandas IPF: ÓPTIMO(>0.90), WARNING(0.80-0.90), ALERTA(0.70-0.80), CRÍTICO(<=0.70)
- [ ] Implementar función de transición basada en predicciones OptimizerAgent
- [ ] Implementar función de recompensa: ΔVEP - λ×costo
- [ ] Implementar simulación de políticas
- [ ] Implementar comparativa: Política MDP vs Baseline

### 1.3 Frontend - Componentes React

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `components/consciousness/IPFKernelPanel.tsx` | Panel principal IPF | ⬜ TODO |
| `components/consciousness/IPFTrajectoryChart.tsx` | Gráfico trayectoria | ⬜ TODO |
| `components/consciousness/PolicyComparison.tsx` | Tabla comparativa | ⬜ TODO |
| `components/consciousness/ActionTimeline.tsx` | Timeline acciones | ⬜ TODO |

**Tareas:**
- [ ] Crear directorio `frontend/src/components/consciousness/`
- [ ] Crear `IPFKernelPanel.tsx` con selector sección y horizonte
- [ ] Crear `IPFTrajectoryChart.tsx` con Recharts (línea IPF vs tiempo)
- [ ] Crear `PolicyComparison.tsx` tabla MDP vs Baseline
- [ ] Crear `ActionTimeline.tsx` con acciones semana por semana
- [ ] Integrar panel PhD con LLM analysis
- [ ] Agregar al App.tsx el routing para `kernel-ipf`

### 1.4 Validación y Testing

**Tareas:**
- [ ] Crear test unitarios para IPFKernel
- [ ] Validar con datos históricos 2025 (appsheet.muestreo)
- [ ] Documentar caso de estudio: brote trips/HLB
- [ ] Comparar política simulada vs manejo real
- [ ] Medir ΔVEP con política Markoviana

---

## FASE 2: IAH KERNEL - Semanas 3-4

### 2.1 Backend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `api/routes/iah_policy.py` | Endpoint IAH Policy | ⬜ TODO |
| `citrusmax_bioelectric/kernels/iah_kernel.py` | Lógica MDP para IAH | ⬜ TODO |

**Estado IAH:**
```python
class IAHState:
    section_id: str
    iah: float              # 0.0 - 1.1
    band: str               # ÓPTIMO, ADECUADO, DÉFICIT, CRÍTICO
    etc: float              # Evapotranspiración cultivo
    lluvia_7d: float        # mm acumulados
    riego_7d: float         # mm aplicados
    humedad_suelo: float    # % si hay sensor
    forecast_7d: dict       # Predicción lluvia
```

**Acciones IAH:**
```python
class IAHAction(Enum):
    A0_NO_REGAR = 0
    A1_RIEGO_NORMAL = 1     # 20mm
    A2_RIEGO_PROFUNDO = 2   # 40mm
    A3_RIEGO_DEFICIT = 3    # 10mm (ahorro)
```

**Tareas:**
- [ ] Crear `iah_kernel.py` con lógica MDP
- [ ] Integrar datos Davis WeatherLink (ETc, lluvia)
- [ ] Integrar forecast Tomorrow.io
- [ ] Implementar función de transición basada en balance hídrico
- [ ] Crear `IAHKernelPanel.tsx` frontend
- [ ] Agregar análisis PhD

### 2.2 Frontend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `components/consciousness/IAHKernelPanel.tsx` | Panel IAH | ⬜ TODO |

---

## FASE 3: NPF KERNEL - Semanas 5-6

### 3.1 Backend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `api/routes/npf_policy.py` | Endpoint NPF Policy | ⬜ TODO |
| `citrusmax_bioelectric/kernels/npf_kernel.py` | Lógica MDP para NPF | ⬜ TODO |

**Estado NPF:**
```python
class NPFState:
    section_id: str
    npf: float              # 0.7 - 1.0
    band: str               # ÓPTIMO, ADECUADO, DEFICIENTE
    n_foliar: float         # % Nitrógeno
    p_foliar: float         # % Fósforo
    k_foliar: float         # % Potasio
    ca_foliar: float        # % Calcio
    mg_foliar: float        # % Magnesio
    fen: int                # Fase fenológica (determina necesidades)
    last_fertilization: dict
```

**Acciones NPF:**
```python
class NPFAction(Enum):
    A0_NO_FERTILIZAR = 0
    A1_FERTIL_COMPLETO = 1  # N-P-K-Ca-Mg
    A2_FERTIL_NK = 2        # Solo N-K (desarrollo fruto)
    A3_FERTIL_CA = 3        # Solo Ca (cuajado)
    A4_FOLIAR_MICRO = 4     # Micronutrientes
```

**Tareas:**
- [ ] Crear `npf_kernel.py`
- [ ] Integrar datos análisis foliar (si disponibles)
- [ ] Definir necesidades por fase fenológica
- [ ] Crear `NPFKernelPanel.tsx`

---

## FASE 4: KERNELS ADICIONALES - Semanas 7-10

### 4.1 ψ (PSI) Kernel - Estrés Térmico

**Estado:**
```python
class PsiState:
    temperatura: float      # °C actual
    temp_max_7d: float      # Máxima 7 días
    radiacion: float        # W/m²
    gdd_acumulado: float
    estres_termico: str     # NORMAL, MODERADO, SEVERO
```

**Acciones:**
```python
class PsiAction(Enum):
    A0_NINGUNA = 0
    A1_ANTI_ESTRES = 1      # Aplicar anti-transpirante
    A2_RIEGO_REFRESCANTE = 2
```

**Tareas:**
- [ ] Crear `psi_kernel.py`
- [ ] Crear `PsiKernelPanel.tsx`

### 4.2 φ (PHI) Kernel - Fenología

**Estado:**
```python
class PhiState:
    fen: int                # 01-07
    gdd: float              # GDD acumulados
    gdd_next_stage: float   # GDD para siguiente fase
    days_to_next: int       # Días estimados
    sync_market: bool       # Sincronizado con ventana precio
```

**Acciones:**
```python
class PhiAction(Enum):
    A0_OBSERVAR = 0
    A1_ACELERAR = 1         # Inducción hormonal
    A2_RETRASAR = 2         # Estrés controlado
```

**Tareas:**
- [ ] Crear `phi_kernel.py`
- [ ] Integrar predicción GDD
- [ ] Crear `PhiKernelPanel.tsx`

### 4.3 TRIM Kernel - Poda

**Tareas:**
- [ ] Crear `trim_kernel.py`
- [ ] Crear `TrimKernelPanel.tsx`

### 4.4 IND Kernel - Calidad/Inducción

**Tareas:**
- [ ] Crear `ind_kernel.py`
- [ ] Crear `IndKernelPanel.tsx`

### 4.5 LAI Kernel - Área Foliar

**Tareas:**
- [ ] Crear `lai_kernel.py`
- [ ] Integrar datos NDVI satelital
- [ ] Crear `LAIKernelPanel.tsx`

### 4.6 Market Kernel - Precio

**Estado:**
```python
class MarketState:
    precio_actual: float    # $/kg
    precio_7d: float        # Promedio 7 días
    precio_forecast: dict   # Predicción 7/30/90 días
    ventana: str            # BAJA, NORMAL, ALTA, PICO
    semana_iso: int
```

**Acciones:**
```python
class MarketAction(Enum):
    A0_ESPERAR = 0
    A1_COSECHAR = 1
    A2_ALMACENAR = 2        # Si hay capacidad
```

**Tareas:**
- [ ] Crear `market_kernel.py`
- [ ] Crear `MarketKernelPanel.tsx`

---

## FASE 5: COHERENCIA GLOBAL - Semanas 11-12

### 5.1 Backend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `api/routes/coherence.py` | Endpoints Coherencia | ⬜ TODO |

**Endpoints:**
```python
# GET /api/v1/consciousness/coherence
# Response: { coherence_index, entropy_rate, classification, components }

# GET /api/v1/consciousness/entropy/history
# Response: { dates[], entropy[], pe[], correlation }

# GET /api/v1/consciousness/traces/{observer}
# Response: { trace, time_dilation, kl_divergence }
```

**Tareas:**
- [ ] Crear `coherence.py` routes
- [ ] Implementar cálculo Coherence Index integrando todos los kernels
- [ ] Implementar Entropy Rate del sistema global
- [ ] Implementar Trace Logic para cada observador (Health, Market, HO)
- [ ] Validar H1: correlación entropy vs PE

### 5.2 Frontend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `components/consciousness/CoherencePanel.tsx` | Coherencia Global | ⬜ TODO |
| `components/consciousness/EntropyPanel.tsx` | Análisis Entropy | ⬜ TODO |
| `components/consciousness/TracesPanel.tsx` | Trace Logic | ⬜ TODO |

**Tareas:**
- [ ] Crear `CoherencePanel.tsx` con gauge grande
- [ ] Crear `EntropyPanel.tsx` con histórico y correlación
- [ ] Crear `TracesPanel.tsx` con comparativa observadores
- [ ] Agregar widget Coherence al Dashboard Principal

---

## FASE 6: GOAL-DIRECTED ENGINE - Semanas 13-14

### 6.1 Backend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `api/routes/goal_engine.py` | Motor Goal-Directed | ⬜ TODO |
| `citrusmax_bioelectric/engine/goal_directed.py` | Lógica central | ⬜ TODO |

**Funcionalidad:**
- Recibe objetivo VEP target
- Coordina todos los kernels micro
- Genera plan de acciones integrado
- Optimiza distribución de presupuesto entre factores
- Resuelve conflictos entre observadores

**Tareas:**
- [ ] Crear `goal_directed.py` engine
- [ ] Implementar coordinación multi-kernel
- [ ] Implementar optimización de presupuesto
- [ ] Implementar resolución de conflictos
- [ ] Crear `GoalEnginePanel.tsx`

### 6.2 Frontend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `components/consciousness/GoalEnginePanel.tsx` | Goal-Directed | ⬜ TODO |

---

## FASE 7: FARM NETWORK - Semanas 15-16

### 7.1 Visualización Red

**Concepto:** Visualizar la finca como red de agentes conscientes interconectados.

- Nodos: Secciones (S1, S2, S3) como agentes
- Edges: Interacciones/sincronización
- Color: Estado de coherencia
- Tamaño: Contribución a VEP

**Tareas:**
- [ ] Crear `FarmNetworkPanel.tsx` con visualización D3/Force-graph
- [ ] Implementar API para estado de red
- [ ] Mostrar sincronización entre secciones

---

## FASE 8: DOCUMENTACIÓN Y VALIDACIÓN - Semana 17+

### 8.1 Documentación

- [ ] Actualizar `CitrusMax_AI_Arquitectura_API_Reference.md` con nuevos endpoints
- [ ] Actualizar `CitrusMax_AI_Manual_Usuario_Casos_Uso.md` con casos de uso Consciencia
- [ ] Crear caso de estudio documentado
- [ ] Actualizar paper Frontiers in Plant Science con resultados

### 8.2 Validación Científica

- [ ] Ejecutar protocolo experimental H1-H5
- [ ] Medir correlación entropy vs PE con datos reales
- [ ] Comparar VEP con política Markoviana vs manejo tradicional
- [ ] Documentar ΔVEP logrado

---

## RESUMEN DE ARCHIVOS A CREAR

### Backend (`citrusmax-ui-v5/backend/`)

```
api/routes/
├── ipf_policy.py           # FASE 1
├── iah_policy.py           # FASE 2
├── npf_policy.py           # FASE 3
├── coherence.py            # FASE 5
└── goal_engine.py          # FASE 6

citrusmax_bioelectric/kernels/
├── __init__.py
├── base_kernel.py          # Clase base abstracta
├── ipf_kernel.py           # FASE 1
├── iah_kernel.py           # FASE 2
├── npf_kernel.py           # FASE 3
├── psi_kernel.py           # FASE 4
├── phi_kernel.py           # FASE 4
├── trim_kernel.py          # FASE 4
├── ind_kernel.py           # FASE 4
├── lai_kernel.py           # FASE 4
└── market_kernel.py        # FASE 4

citrusmax_bioelectric/engine/
├── __init__.py
└── goal_directed.py        # FASE 6
```

### Frontend (`citrusmax-ui-v5/frontend/src/`)

```
components/consciousness/
├── CoherencePanel.tsx      # FASE 5
├── EntropyPanel.tsx        # FASE 5
├── TracesPanel.tsx         # FASE 5
├── GoalEnginePanel.tsx     # FASE 6
├── FarmNetworkPanel.tsx    # FASE 7
│
├── kernels/
│   ├── IPFKernelPanel.tsx      # FASE 1
│   ├── IAHKernelPanel.tsx      # FASE 2
│   ├── NPFKernelPanel.tsx      # FASE 3
│   ├── PsiKernelPanel.tsx      # FASE 4
│   ├── PhiKernelPanel.tsx      # FASE 4
│   ├── TrimKernelPanel.tsx     # FASE 4
│   ├── IndKernelPanel.tsx      # FASE 4
│   ├── LAIKernelPanel.tsx      # FASE 4
│   └── MarketKernelPanel.tsx   # FASE 4
│
└── shared/
    ├── TrajectoryChart.tsx     # Reutilizable
    ├── PolicyComparison.tsx    # Reutilizable
    ├── ActionTimeline.tsx      # Reutilizable
    └── PhDAnalysisPanel.tsx    # Análisis LLM (obligatorio)
```

---

## CRONOGRAMA RESUMEN

| Fase | Semanas | Kernel/Componente | Prioridad |
|------|---------|-------------------|-----------|
| 1 | 1-2 | **IPF Kernel (PILOTO)** | 🔴 ALTA |
| 2 | 3-4 | IAH Kernel | 🟡 MEDIA |
| 3 | 5-6 | NPF Kernel | 🟡 MEDIA |
| 4 | 7-10 | ψ, φ, TRIM, IND, LAI, Market | 🟡 MEDIA |
| 5 | 11-12 | Coherencia Global | 🔴 ALTA |
| 6 | 13-14 | Goal-Directed Engine | 🔴 ALTA |
| 7 | 15-16 | Farm Network | 🟢 BAJA |
| 8 | 17+ | Documentación y Validación | 🔴 ALTA |

---

## REGLAS DE DESARROLLO

1. **Cada panel DEBE incluir interpretación PhD del LLM**
2. Los menús existentes de factores (ECUACIÓN PE) NO se alteran
3. Todo el nuevo desarrollo queda agrupado bajo CONSCIENCIA / KERNELS MICRO
4. IPF Crítico = ≤0.70 (no 0.60)
5. Usar datos tradicionales (sin sensores bioeléctricos por ahora)
6. Placeholder para sensores futuros en TraditionalAdapter

---

**Documento generado:** 30 Diciembre 2025  
**Próximo paso:** Implementar FASE 1 - IPF Kernel Backend
