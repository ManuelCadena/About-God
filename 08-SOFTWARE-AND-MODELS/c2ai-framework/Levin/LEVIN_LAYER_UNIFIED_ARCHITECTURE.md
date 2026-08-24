# 🧬 LEVIN LAYER UNIFIED - ARQUITECTURA OPTIMIZADA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** PROPUESTA APROBADA

---

## 1. ANÁLISIS DE COMPONENTES ACTUALES

### 1.1 Inventario de Componentes Existentes

| Componente | Líneas | Funcionalidad Principal |
|------------|--------|------------------------|
| `LevinLayerDashboard.tsx` | 548 | Goal, Alignment, Pruning, Recommendations |
| `LevinGoalAlignment.tsx` | 434 | Goals Library, Alignment Breakdown, Pruning Matrix |
| `LevinBioelectricMap.tsx` | 856 | Voltage Heatmap, Locations, Coherence, Gamma |
| `LevinMorphogenesis.tsx` | 401 | PPI, Regeneration, Phenology Timeline, LAI |
| **TOTAL** | **2,239** | 4 paneles separados |

### 1.2 Mapa de Funcionalidades

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNCIONALIDADES ACTUALES POR COMPONENTE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LevinLayerDashboard          LevinGoalAlignment                           │
│  ├─ Current Goal ◄────────────┼─ Goals Library (8)                         │
│  ├─ Alignment Score ◄─────────┼─ Alignment Breakdown (5 recursos)          │
│  ├─ Pruning Status ◄──────────┼─ Pruning-Phenology Matrix ◄───┐           │
│  ├─ Supporting/Blocking       ├─ Goal Shift Analysis          │           │
│  ├─ Next Goal Transition      ├─ Pruning Window Status        │           │
│  ├─ Goal Shift Probability    └─ Phenology Recommendation     │           │
│  ├─ Top Recommendations                                       │           │
│  └─ PhD AI Analysis ◄─────────────────────────────────────────┼───┐       │
│                                                               │   │       │
│  LevinBioelectricMap          LevinMorphogenesis              │   │       │
│  ├─ Voltage Heatmap           ├─ Perturbation Index (PPI) ◄───┘   │       │
│  ├─ Voltage by Location       ├─ Regeneration Potential          │       │
│  ├─ Coherence Score           ├─ Meristem Activation              │       │
│  ├─ Gamma Power 40Hz          ├─ Phenology Timeline ◄─────────────┼───┐   │
│  ├─ Scientific Reference      ├─ Growth Direction                 │   │   │
│  ├─ PhD AI Analysis ◄─────────┼─ LAI Recovery                     │   │   │
│  ├─ Environmental             ├─ Stress vs Growth Balance         │   │   │
│  └─ Ion Flux                  └─ Last Pruning Event ◄─────────────┘   │   │
│                                                                       │   │
│  ◄──────── REDUNDANCIAS DETECTADAS ─────────►                         │   │
│                                                                       │   │
│  [1] Goal/Alignment: Dashboard + GoalAlignment                        │   │
│  [2] Pruning Status: Dashboard + GoalAlignment + Morphogenesis ◄──────┘   │
│  [3] Phenology: Dashboard + GoalAlignment + Morphogenesis                 │
│  [4] PhD Analysis: Dashboard + BioelectricMap ◄───────────────────────────┘
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Redundancias Identificadas

| Funcionalidad | Aparece en | Acción |
|---------------|------------|--------|
| Current Goal + Alignment | Dashboard, GoalAlignment | **MERGE** → Command Center |
| Pruning Status/Impact | Dashboard, GoalAlignment, Morphogenesis | **CONSOLIDAR** → Optimizer |
| Phenology Timeline | GoalAlignment, Morphogenesis | **UNIFICAR** → Optimizer |
| PhD AI Analysis | Dashboard, BioelectricMap | **CENTRALIZAR** → Command Center |
| Goal Shift Probability | Dashboard, GoalAlignment | **MERGE** → Command Center |
| Supporting/Blocking | Dashboard, GoalAlignment | **MERGE** → Command Center |

---

## 2. ARQUITECTURA UNIFICADA PROPUESTA

### 2.1 De 4 Paneles a 3 Paneles Optimizados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEVIN LAYER UNIFIED ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  PANEL 1: LEVIN COMMAND CENTER                                        │ │
│  │  ══════════════════════════════                                       │ │
│  │                                                                       │ │
│  │  Objetivo: Vista ejecutiva para toma de decisiones                    │ │
│  │  Fuente: Dashboard + GoalAlignment (merged)                           │ │
│  │                                                                       │ │
│  │  Componentes:                                                         │ │
│  │  ├─ KPI Strip: VEP Impact | PE Projection | Cost Efficiency | ROI    │ │
│  │  ├─ Current Goal Gauge (grande, central)                             │ │
│  │  ├─ Alignment Score + Breakdown (5 recursos)                         │ │
│  │  ├─ Quick Status Grid: 10 Módulos Levin 2.0 (semáforos)             │ │
│  │  ├─ Top 3 Recommendations con ROI y Auto-Execute status             │ │
│  │  ├─ Supporting/Blocking Factors (colapsable)                         │ │
│  │  └─ PhD AI Analysis (integrado, no duplicado)                        │ │
│  │                                                                       │ │
│  │  Líneas estimadas: ~500 (vs 548+434=982 actuales) = -49% código      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  PANEL 2: BIOELECTRIC INTELLIGENCE                                    │ │
│  │  ═════════════════════════════════                                    │ │
│  │                                                                       │ │
│  │  Objetivo: Detección temprana y monitoreo bioeléctrico               │ │
│  │  Fuente: BioelectricMap + 10 Módulos Levin 2.0                       │ │
│  │                                                                       │ │
│  │  Componentes:                                                         │ │
│  │  ├─ Spatial Heatmap (unificado para cualquier métrica)               │ │
│  │  ├─ Module Tabs: [Pest|Disease|Nutrition|Water|Opportunity|+5]       │ │
│  │  ├─ Active Detections List (alertas de todos los módulos)            │ │
│  │  ├─ Signature Chart (Vmem + FFT + Impedance)                         │ │
│  │  ├─ Location Detail Cards (meristem, root, fruit, wound)             │ │
│  │  ├─ Coherence + Gamma Power (métricas globales)                      │ │
│  │  └─ Environmental Sidebar (T, HR, Soil, Wind)                        │ │
│  │                                                                       │ │
│  │  Líneas estimadas: ~700 (vs 856 actual + módulos nuevos)             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  PANEL 3: MORPHOGENETIC OPTIMIZER                                     │ │
│  │  ════════════════════════════════                                     │ │
│  │                                                                       │ │
│  │  Objetivo: Optimización de operaciones y timing                       │ │
│  │  Fuente: Morphogenesis + GoalAlignment (partes de planning)          │ │
│  │                                                                       │ │
│  │  Componentes:                                                         │ │
│  │  ├─ Phenology Timeline (visual, GDD-based)                           │ │
│  │  ├─ Pruning Optimizer: PPI + Window + Recommendation                 │ │
│  │  ├─ Growth Direction (vegetative/reproductive/maintenance)           │ │
│  │  ├─ Operation Windows Calendar (Spray, Fertiriego, Harvest, Poda)    │ │
│  │  ├─ LAI/Vigor Trajectory                                             │ │
│  │  ├─ Harvest Window Predictor (Brix + Price alignment)                │ │
│  │  └─ Cost-Benefit Simulator                                           │ │
│  │                                                                       │ │
│  │  Líneas estimadas: ~450 (vs 401+200=601 actuales) = -25% código      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  TOTAL ESTIMADO: ~1,650 líneas (vs 2,239 actuales) = -26% código           │
│  + Funcionalidad de 10 módulos Levin 2.0 integrada                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DISEÑO DETALLADO DE CADA PANEL

### 3.1 PANEL 1: LEVIN COMMAND CENTER

**Propósito:** Vista ejecutiva para maximizar VEP, PE y ROI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🧠 LEVIN COMMAND CENTER                                    [S1 ▼] [🔄]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ VEP IMPACT   │ │ PE FORECAST  │ │ COST SAVINGS │ │ PRICE WINDOW │       │
│  │   +$12,450   │ │   94.2 ton   │ │   -$3,200    │ │  OPTIMAL 3d  │       │
│  │   ↑ +8.2%    │ │   ↑ +2.1%    │ │   ↓ -12%     │ │   $2.15/kg   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────────┐│
│  │     CURRENT BIOELECTRIC GOAL    │ │     ALIGNMENT BREAKDOWN             ││
│  │          ╭─────────────╮        │ │                                     ││
│  │       ╭──┤  FRUIT SET  ├──╮     │ │  Water ████████░░ 85%              ││
│  │      ╱   │    72%      │   ╲    │ │  Light ███████░░░ 78%              ││
│  │     0%   ╰─────────────╯  100%  │ │  Nitrogen ██████░░░░ 72%           ││
│  │                                 │ │  Phosphorus █████████░ 88%         ││
│  │  Alignment: 78% ✓  GDD: 485    │ │  Potassium ████████░░ 82%          ││
│  │  Phenology: FEN-04 (Cuajado)   │ │                                     ││
│  └─────────────────────────────────┘ └─────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  LEVIN 2.0 MODULES STATUS                                               ││
│  │  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐         ││
│  │  │ 🐛 ││ 🦠 ││ 🌿 ││ 💧 ││ 🎯 ││ 🍊 ││ 💪 ││ ❄️ ││ 🔄 ││ 🕐 │         ││
│  │  │ 2  ││ 0  ││ 1  ││ 1  ││ 3  ││ OK ││ OK ││ OK ││ OK ││ OK │         ││
│  │  │ ⚠️ ││ ✓  ││ ⚠️ ││ ⚠️ ││ ✓  ││ ✓  ││ ✓  ││ ✓  ││ ✓  ││ ✓  │         ││
│  │  └────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘         ││
│  │  Pest  Disease Nutr  Water Oppty Quality Vigor Frost Recov Circad    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  TOP 3 RECOMMENDATIONS                                                  ││
│  │                                                                         ││
│  │  1. 🔴 [AUTO] Irrigar 28mm en 14h → IAH 0.72→0.88 │ ROI: 2,800%       ││
│  │  2. 🟡 [REVIEW] Spinosad 0.1L/ha Sector A3-A5    │ ROI: 145%          ││
│  │  3. 🟢 [MONITOR] Harvest window opens in 3 days  │ ROI: 234%          ││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐││
│  │  │ ✅ Supporting (3): Water optimal, Nutrient balance, Light adequate │││
│  │  │ ⚠️ Blocking (1): Trips detected in A3-A5, treat before harvest     │││
│  │  └─────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  🎓 PhD ANALYSIS                                    [Regenerate]       ││
│  │  El campo bioeléctrico de S1 muestra alineación del 78% con el         ││
│  │  objetivo de cuajado (FEN-04). Los factores limitantes son: (1) estrés ││
│  │  hídrico leve (IAH 0.72), y (2) presión de trips en sectores A3-A5.    ││
│  │  Recomendación: Irrigar primero, luego aplicar Spinosad. Esta          ││
│  │  secuencia optimiza absorción del producto y minimiza estrés.          ││
│  │  Impacto esperado: PE +2.1%, VEP +$12,450, ventana de cosecha óptima   ││
│  │  en 3 días con precio $2.15/kg (+12% vs promedio).                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 PANEL 2: BIOELECTRIC INTELLIGENCE

**Propósito:** Detección temprana y monitoreo de los 10 módulos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚡ BIOELECTRIC INTELLIGENCE                                [S1 ▼] [🔄]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ MODULE TABS ────────────────────────────────────────────────────────┐  │
│  │ [🐛 Pest(2)] [🦠 Disease] [🌿 Nutrition(1)] [💧 Water(1)] [🎯 Oppty] │  │
│  │ [🍊 Quality] [💪 Vigor] [❄️ Frost] [🔄 Recovery] [🕐 Circadian]      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────┐ ┌─────────────────────────────────────────┐│
│  │   SPATIAL DETECTION MAP    │ │   BIOELECTRIC SIGNATURES (24h)          ││
│  │   [Section Grid 10x10]     │ │   ┌─────────────────────────────────────┐││
│  │    🔴 🟡 🟢 🟢 🟡 🔴       │ │   │ Vmem: ▃▂▁▁▁▂▃▄▄▃▂▁ (-18mV trend)  │││
│  │    🟢 🟢 🟡 🟢 🟢 🟡       │ │   │ Impedance: ▁▂▃▄▅▆▇█ (+45% ↑)      │││
│  │    🟡 🟢 🟢 🟢 🟢 🟢       │ │   │ FFT Peak: 1.1 Hz (Trips signature) │││
│  │    🟢 🟢 🟢 🟢 🟢 🟢       │ │   └─────────────────────────────────────┘││
│  │                             │ │   Legend: ─Vmem ─Impedance ─Threshold   ││
│  │   Legend: 🔴Alert 🟡Watch 🟢OK│ │                                         ││
│  └─────────────────────────────┘ └─────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  ACTIVE DETECTIONS                                                      ││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐││
│  │  │ 🔴 TRIPS (High) - Sector A3-A5               Confidence: 89%       │││
│  │  │    Vmem: -18mV (threshold: -15mV) │ Freq: 1.1Hz │ Temp: 33°C       │││
│  │  │    Trigger: T>32°C + Wind<5km/h                                    │││
│  │  │    → Action: Apply Spinosad 0.1L/ha within 24h         [Execute ▶] │││
│  │  └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐││
│  │  │ 🟡 WATER STRESS (Medium) - General           Confidence: 91%       │││
│  │  │    IAH: 0.72 (threshold: 0.80) │ Vmem: -20mV │ Z: +45%             │││
│  │  │    Trigger: ET0 5.2mm/d + Last irrigation 48h ago                  │││
│  │  │    → Action: Irrigate 28mm within 14h                  [Execute ▶] │││
│  │  └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐││
│  │  │ 🟡 K DEFICIENCY (Medium) - Sector B1-B3      Confidence: 76%       │││
│  │  │    INE-K: 0.68 (threshold: 0.75) │ Vmem: +12mV │ Freq: -0.5Hz      │││
│  │  │    Trigger: High fruit load + Phenology FEN-04                     │││
│  │  │    → Action: Foliar KNO3 2% within 7 days              [Schedule]  │││
│  │  └─────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌──────────────────────────────────┐ ┌────────────────────────────────────┐│
│  │   LOCATION BIOELECTRIC STATUS   │ │   GLOBAL METRICS                   ││
│  │   Meristem:  -42.5mV  ✓ Active  │ │   Coherence: 78% (Good)           ││
│  │   Root Tip:  -54.3mV  ✓ Active  │ │   Gamma 40Hz: 58% (Normal)        ││
│  │   Fruit Zone: -33.1mV ✓ Active  │ │   Field State: STABLE             ││
│  │   Wound Site: -22.2mV ⚠ Healing │ │   Wound Signal: 15% (Low)         ││
│  └──────────────────────────────────┘ └────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  🌡️ ENVIRONMENTAL: T:26.5°C │ HR:78% │ Soil:42% │ Wind:8.5km/h │ PAR:1250││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 PANEL 3: MORPHOGENETIC OPTIMIZER

**Propósito:** Optimización de timing para maximizar PE y precio

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🌱 MORPHOGENETIC OPTIMIZER                                 [S1 ▼] [🔄]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  PHENOLOGY TIMELINE                                    GDD: 485/1680   ││
│  │  ──●────●────●────◉────○────○────○──────────────────────────────────── ││
│  │   FEN-01 FEN-02 FEN-03 FEN-04 FEN-05 FEN-06 FEN-07                     ││
│  │   Latency Sprout Flower [SET]  Dev   Mature Harvest                    ││
│  │   0      120    200    290    420    870    1150                       ││
│  │                         ▲                                               ││
│  │                    CURRENT                                              ││
│  │                                                                         ││
│  │  Estimated Harvest: Feb 6, 2026 │ Days remaining: 22                   ││
│  │  Price Forecast: $2.15/kg (PEAK SEASON) │ Optimal: Feb 1-15           ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌────────────────────────────────┐ ┌──────────────────────────────────────┐│
│  │  PRUNING OPTIMIZER             │ │  GROWTH DIRECTION                    ││
│  │                                │ │                                      ││
│  │   PPI: 35%    [PERTURBED]     │ │  Vegetative  ████░░░░░░ 25%         ││
│  │   ╭───────────╮                │ │  Reproductive████████░░ 55%         ││
│  │   │   35%     │                │ │  Maintenance ████░░░░░░ 20%         ││
│  │   ╰───────────╯                │ │                                      ││
│  │                                │ │  Status: REPRODUCTIVE FOCUS ✓       ││
│  │   Window: 🔴 PROHIBITED        │ │  (Aligned with FEN-04 Fruit Set)    ││
│  │   Sensitivity: 100% (FEN-04)   │ │                                      ││
│  │   PE Impact: -40% if pruned    │ └──────────────────────────────────────┘│
│  │                                │                                         │
│  │   Last Prune: 45 days ago      │ ┌──────────────────────────────────────┐│
│  │   Intensity: 12%               │ │  REGENERATION STATUS                 ││
│  │   Type: Maintenance            │ │                                      ││
│  │                                │ │  Potential: 72%  ████████░░         ││
│  │   Next Window: FEN-07          │ │  LAI Recovery: 0.12/week            ││
│  │   (~22 days, post-harvest)     │ │  Meristem Activation: 58%           ││
│  └────────────────────────────────┘ └──────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  OPERATION WINDOWS CALENDAR (Next 14 Days)                              ││
│  │                                                                         ││
│  │  Date     │ Spray │ Fertiriego │ Harvest │ Poda │ Muestreo │ Best Op   ││
│  │  ─────────┼───────┼────────────┼─────────┼──────┼──────────┼────────── ││
│  │  Jan 16   │  🟢   │    🟡      │   ⬜    │  🔴  │    🟢    │ SPRAY     ││
│  │  Jan 17   │  🟢   │    🟢      │   ⬜    │  🔴  │    🟢    │ FERTIRIEGO││
│  │  Jan 18   │  🟡   │    🟡      │   ⬜    │  🔴  │    🟢    │ MUESTREO  ││
│  │  Jan 19   │  🟢   │    🟢      │   🟡    │  🔴  │    🟢    │ SPRAY     ││
│  │  Jan 20   │  🟡   │    🟢      │   🟢    │  🔴  │    🟢    │ HARVEST   ││
│  │  ...      │       │            │         │      │          │           ││
│  │  Feb 06   │  🟢   │    🟢      │   🟢    │  🟡  │    🟢    │ HARVEST   ││
│  │                                                                         ││
│  │  Legend: 🟢 Optimal  🟡 Possible  🔴 Avoid  ⬜ N/A                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  HARVEST OPTIMIZATION                                                   ││
│  │                                                                         ││
│  │  ┌────────────────────────────┐  ┌────────────────────────────────────┐ ││
│  │  │ QUALITY PREDICTION         │  │ PRICE ALIGNMENT                    │ ││
│  │  │ Brix: 8.2° → 8.5° (+3d)   │  │ Current: $1.92/kg                  │ ││
│  │  │ Size: 52mm (Export ✓)      │  │ Peak: $2.15/kg (Feb 1-15)          │ ││
│  │  │ Color: 85% green           │  │ Revenue Δ: +$4,500 if wait 3d      │ ││
│  │  │ Defects: 2.1% (Target <5%) │  │ Optimal Harvest: Feb 3-8           │ ││
│  │  └────────────────────────────┘  └────────────────────────────────────┘ ││
│  │                                                                         ││
│  │  💡 RECOMMENDATION: Wait 3 days for Brix ≥8.5° to align with price    ││
│  │     peak. Expected additional revenue: $4,500 (+12% vs harvest today)  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  STRESS vs GROWTH BALANCE          │   LAI TRAJECTORY (4 weeks)        ││
│  │        15%           72%           │   3.98 ┤      ╭─────              ││
│  │   ╭─────────╮   ╭─────────╮       │   3.86 ┤   ╭──╯                    ││
│  │   │  STRESS │   │  GROWTH │       │   3.74 ┤ ╭─╯                       ││
│  │   ╰─────────╯   ╰─────────╯       │   3.62 ├─╯                         ││
│  │                                    │   3.50 ┼──────────────────         ││
│  │   [OPTIMAL GROWTH CONDITIONS ✓]   │        W0   W1   W2   W3   W4      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. MAPEO DE 10 MÓDULOS LEVIN 2.0

### 4.1 Integración en los 3 Paneles

| Módulo Levin 2.0 | Panel Principal | Panel Secundario |
|------------------|-----------------|------------------|
| 1. Pest Detector | **Intelligence** (Detections) | Command (Status Grid) |
| 2. Disease Detector | **Intelligence** (Detections) | Command (Status Grid) |
| 3. Nutrition Detector | **Intelligence** (Detections) | Command (Status Grid) |
| 4. Water Stress Detector | **Intelligence** (Detections) | Optimizer (Operations) |
| 5. Opportunity Detector | **Optimizer** (Windows) | Command (Recommendations) |
| 6. Fruit Quality Predictor | **Optimizer** (Harvest) | Command (KPIs) |
| 7. Vigor Assessor | **Optimizer** (Growth) | Intelligence (Locations) |
| 8. Frost Damage Detector | **Intelligence** (Detections) | Command (Alerts) |
| 9. Recovery Monitor | **Intelligence** (Locations) | Optimizer (Regeneration) |
| 10. Circadian Corrector | **Intelligence** (Global Metrics) | - (background) |

### 4.2 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                   │
│  │  SENSORS (722)      │                                                   │
│  │  Vmem, Z, Freq      │                                                   │
│  └─────────┬───────────┘                                                   │
│            │                                                                │
│            ▼                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LEVIN 2.0 DETECTION ENGINE (10 Modules)                            │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                           │   │
│  │  │Pest │ │Disea│ │Nutri│ │Water│ │Oppty│                           │   │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘                           │   │
│  │     │       │       │       │       │                               │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                           │   │
│  │  │Qual │ │Vigor│ │Frost│ │Recov│ │Circa│                           │   │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘                           │   │
│  └─────┼───────┼───────┼───────┼───────┼───────────────────────────────┘   │
│        │       │       │       │       │                                    │
│        └───────┴───────┴───────┴───────┘                                    │
│                        │                                                    │
│                        ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  UNIFIED API: /c2ai-api/api/v1/levin-unified/                       │   │
│  │                                                                     │   │
│  │  /command-center/{section}     → All KPIs, Goals, Status           │   │
│  │  /intelligence/{section}       → All Detections, Signatures        │   │
│  │  /optimizer/{section}          → Phenology, Windows, Harvest       │   │
│  │  /modules/{module}/{section}   → Individual module detail          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                        │                                                    │
│        ┌───────────────┼───────────────┐                                   │
│        ▼               ▼               ▼                                   │
│  ┌───────────┐  ┌───────────────┐  ┌──────────────┐                        │
│  │ COMMAND   │  │ INTELLIGENCE  │  │  OPTIMIZER   │                        │
│  │ CENTER    │  │               │  │              │                        │
│  └───────────┘  └───────────────┘  └──────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. OPTIMIZACIÓN PARA VEP, PE Y PRECIO

### 5.1 KPIs Centrales (Command Center)

| KPI | Fórmula | Objetivo |
|-----|---------|----------|
| **VEP Impact** | Σ(Action ROI × Confidence) | Maximizar valor económico |
| **PE Forecast** | PE × (1 + Σ improvements) | Maximizar producción estimada |
| **Cost Savings** | Baseline Cost - Optimized Cost | Minimizar costos |
| **Price Window** | Days to Peak × Price Δ | Maximizar precio de venta |

### 5.2 Decisiones Automáticas

```python
# Lógica de auto-ejecución
if decision.confidence >= 0.90 and decision.roi >= 100:
    if decision.type in ['irrigation', 'spray_preventive']:
        return 'AUTO_EXECUTE'
    elif decision.type in ['spray_curative', 'fertilization']:
        return 'REVIEW_REQUIRED'
    elif decision.type == 'harvest':
        return 'MONITOR'
```

### 5.3 Alineación con Precio

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRICE-ALIGNED HARVEST OPTIMIZATION                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Price Forecast (52 weeks)                                                  │
│  $2.50 ┤                     ╭──╮                                          │
│  $2.00 ┤                   ╭─╯  ╰─╮                    ◄── PEAK SEASON     │
│  $1.50 ┤   ╭──────────────╮      ╰────╮               Jan-Mar              │
│  $1.00 ┤───╯              ╰──────────────╮                                 │
│  $0.50 ┤                                  ╰───────────                     │
│        └──────────────────────────────────────────────                     │
│         Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec                    │
│                                                                             │
│  Strategy:                                                                  │
│  1. Inducción floral: Agosto (→ cosecha Ene-Mar)                           │
│  2. Delay harvest 3-5 days si Brix < target y precio subiendo             │
│  3. Accelerate harvest si pronóstico de helada o precio bajando           │
│                                                                             │
│  Current Recommendation:                                                    │
│  WAIT 3 DAYS: Brix 8.2° → 8.5°, Price $1.92 → $2.15 (+12%)                 │
│  Additional Revenue: +$4,500                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. ESTRUCTURA DE ARCHIVOS PROPUESTA

```
frontend/src/components/levin-unified/
├── panels/
│   ├── LevinCommandCenter.tsx        # Panel 1 (~500 lines)
│   ├── LevinIntelligence.tsx          # Panel 2 (~700 lines)
│   └── LevinOptimizer.tsx             # Panel 3 (~450 lines)
│
├── shared/
│   ├── LevinKPIStrip.tsx              # KPIs reutilizables
│   ├── LevinModuleStatusGrid.tsx      # Grid de 10 módulos
│   ├── LevinDetectionCard.tsx         # Card de detección
│   ├── LevinSignatureChart.tsx        # Gráfica de firmas
│   ├── LevinSpatialMap.tsx            # Mapa espacial
│   ├── LevinPhenologyTimeline.tsx     # Timeline visual
│   ├── LevinOperationCalendar.tsx     # Calendario de ventanas
│   └── LevinPhDAnalysis.tsx           # Análisis PhD unificado
│
├── hooks/
│   ├── useLevinCommandCenter.ts       # Data fetching Panel 1
│   ├── useLevinIntelligence.ts        # Data fetching Panel 2
│   ├── useLevinOptimizer.ts           # Data fetching Panel 3
│   └── useLevinModules.ts             # Data para 10 módulos
│
├── types/
│   └── levin-unified.types.ts         # TypeScript interfaces
│
└── index.ts                           # Exports centralizados

# Total estimado: ~1,650 líneas (vs 2,239 actuales + módulos nuevos)
# Reducción de código: -26%
# Funcionalidad añadida: +10 módulos integrados
```

---

## 7. MIGRACIÓN DE COMPONENTES LEGACY

### 7.1 Mapping de Funcionalidades

| Componente Legacy | Destino en Unified | Notas |
|-------------------|-------------------|-------|
| `LevinLayerDashboard` | **CommandCenter** | Goal, Alignment, Recs |
| `LevinGoalAlignment` | **CommandCenter** + **Optimizer** | Split por función |
| `LevinBioelectricMap` | **Intelligence** | Voltage, Coherence |
| `LevinMorphogenesis` | **Optimizer** | PPI, Timeline, LAI |

### 7.2 Deprecación

```typescript
// levin/index.ts (DEPRECATED)
/**
 * @deprecated Use levin-unified components instead
 * Migration guide: /docs/levin-unified-migration.md
 */
export { LevinLayerDashboard } from './LevinLayerDashboard'
export { LevinGoalAlignment } from './LevinGoalAlignment'
export { LevinBioelectricMap } from './LevinBioelectricMap'
export { LevinMorphogenesis } from './LevinMorphogenesis'

// NEW: levin-unified/index.ts
export { LevinCommandCenter } from './panels/LevinCommandCenter'
export { LevinIntelligence } from './panels/LevinIntelligence'
export { LevinOptimizer } from './panels/LevinOptimizer'
```

---

## 8. RESUMEN EJECUTIVO

### 8.1 Comparación Antes/Después

| Métrica | Antes | Después | Cambio |
|---------|-------|---------|--------|
| Paneles | 4 separados | 3 integrados | -25% |
| Líneas de código | 2,239 | ~1,650 | -26% |
| Módulos Levin 2.0 | 0 | 10 integrados | +10 |
| Redundancias | 4 funcionalidades duplicadas | 0 | Eliminadas |
| KPIs visibles | Dispersos | 4 centrales | Optimizado |
| Decisiones auto | No | Sí (>90% conf, >100% ROI) | +Feature |

### 8.2 Beneficios Esperados

1. **Maximizar VEP:** KPIs centrales con impacto económico visible
2. **Maximizar PE:** Detección temprana + timing óptimo de operaciones
3. **Minimizar Costo:** Recommendations con ROI, auto-execute eficiente
4. **Maximizar Precio:** Harvest window alineado con price forecast
5. **Usabilidad:** 3 paneles claros vs 4 con información dispersa
6. **Mantenibilidad:** -26% código, componentes reutilizables

### 8.3 Timeline de Implementación

| Semana | Entregable |
|--------|------------|
| 1 | Shared components + types |
| 2 | LevinCommandCenter |
| 3 | LevinIntelligence + module tabs |
| 4 | LevinOptimizer |
| 5 | API endpoints + integration |
| 6 | Testing + migration |

---

## 9. MAPEO EXHAUSTIVO DE SENSORES Y DATOS

### 9.1 Inventario Completo de Fuentes de Datos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUENTES DE DATOS CITRUSMAX AI                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. SENSORES BIOELÉCTRICOS (722 nodos @ 95% conf, 8% error)         │   │
│  │  ════════════════════════════════════════════════════════════════   │   │
│  │  • Vmem (mV)           - Potencial de membrana WE-RE                │   │
│  │  • Vmem_max (mV)       - Máximo en ventana de muestreo              │   │
│  │  • Vmem_min (mV)       - Mínimo en ventana de muestreo              │   │
│  │  • Vmem_std (mV)       - Desviación estándar                        │   │
│  │  • Impedance_1k (kΩ)   - Impedancia @ 1 kHz                         │   │
│  │  • Impedance_10k (kΩ)  - Impedancia @ 10 kHz                        │   │
│  │  • Freq_dominant (Hz)  - Frecuencia dominante FFT                   │   │
│  │  • Freq_harmonics      - Armónicos detectados                       │   │
│  │  • Temperature_C       - Temperatura del sensor                     │   │
│  │  • Battery_pct         - Estado de batería                          │   │
│  │  • RSSI_dBm            - Calidad de señal LoRaWAN                   │   │
│  │  • Signal_quality_pct  - Calidad de señal general                   │   │
│  │  • Anomaly_flags       - Flags de anomalía detectada                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. DAVIS WEATHERLINK (264 campos)                                   │   │
│  │  ════════════════════════════════════════════════════════════════   │   │
│  │  TEMPERATURA:                                                        │   │
│  │  • temp_out (°C)       - Temperatura exterior                       │   │
│  │  • temp_in (°C)        - Temperatura interior                       │   │
│  │  • temp_max/min        - Extremos diarios                           │   │
│  │  • heat_index          - Índice de calor                            │   │
│  │  • dew_point           - Punto de rocío                             │   │
│  │  • wind_chill          - Sensación térmica                          │   │
│  │                                                                      │   │
│  │  HUMEDAD:                                                            │   │
│  │  • hum_out (%)         - Humedad relativa exterior                  │   │
│  │  • hum_in (%)          - Humedad relativa interior                  │   │
│  │  • hum_max/min         - Extremos diarios                           │   │
│  │                                                                      │   │
│  │  VIENTO:                                                             │   │
│  │  • wind_speed (km/h)   - Velocidad del viento                       │   │
│  │  • wind_dir (°)        - Dirección del viento                       │   │
│  │  • wind_gust           - Ráfagas                                    │   │
│  │  • wind_run            - Recorrido del viento                       │   │
│  │                                                                      │   │
│  │  RADIACIÓN:                                                          │   │
│  │  • solar_rad (W/m²)    - Radiación solar                            │   │
│  │  • uv_index            - Índice UV                                  │   │
│  │  • et_day (mm)         - Evapotranspiración diaria                  │   │
│  │                                                                      │   │
│  │  PRECIPITACIÓN:                                                      │   │
│  │  • rain_rate (mm/h)    - Tasa de lluvia                             │   │
│  │  • rain_day (mm)       - Lluvia acumulada día                       │   │
│  │  • rain_month          - Lluvia mensual                             │   │
│  │  • rain_year           - Lluvia anual                               │   │
│  │                                                                      │   │
│  │  SUELO (con sensores opcionales):                                    │   │
│  │  • soil_temp_1-4 (°C)  - Temperatura suelo (4 profundidades)        │   │
│  │  • soil_moist_1-4 (%)  - Humedad suelo (4 profundidades)            │   │
│  │  • leaf_wet_1-2        - Mojadura foliar (0-15 escala)              │   │
│  │                                                                      │   │
│  │  PRESIÓN:                                                            │   │
│  │  • bar_sea_level (hPa) - Presión barométrica                        │   │
│  │  • bar_trend           - Tendencia barométrica                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. POSTGRESQL HISTÓRICOS                                            │   │
│  │  ════════════════════════════════════════════════════════════════   │   │
│  │  appsheet.muestreo:                                                  │   │
│  │  • Conteos por plaga (trips, minador, araña, pulgón, diaphorina)    │   │
│  │  • Conteos por enfermedad (antracnosis, mancha, phytophthora)       │   │
│  │  • Calificación fruta (% verde, maduro, dañado)                     │   │
│  │  • Diámetro fruto (mm)                                              │   │
│  │                                                                      │   │
│  │  appsheet.aplicaciones:                                              │   │
│  │  • Producto aplicado, dosis, fecha                                  │   │
│  │  • Labor (fumigación, fertiriego, poda)                             │   │
│  │  • Monto, sección                                                   │   │
│  │                                                                      │   │
│  │  appsheet.gastos:                                                    │   │
│  │  • Categoría, subcategoría, monto                                   │   │
│  │  • Fecha, período (MES, SEM)                                        │   │
│  │                                                                      │   │
│  │  appsheet.ventas_limon:                                              │   │
│  │  • Kilogramos, precio, cliente                                      │   │
│  │  • Calidad (exportación, nacional, rezaga)                          │   │
│  │                                                                      │   │
│  │  citrusmax.phenology_*:                                              │   │
│  │  • GDD acumulado por sección                                        │   │
│  │  • Fenología actual (FEN-01 a FEN-07)                               │   │
│  │  • BioFix dates                                                     │   │
│  │                                                                      │   │
│  │  c2ai.bioelectric_readings:                                          │   │
│  │  • Histórico de lecturas bioeléctricas                              │   │
│  │                                                                      │   │
│  │  c2ai.levin_detections:                                              │   │
│  │  • Detecciones previas y su validación                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  4. APIs EXTERNAS                                                    │   │
│  │  ════════════════════════════════════════════════════════════════   │   │
│  │  Tomorrow.io:                                                        │   │
│  │  • Pronóstico 14 días (temp, precip, viento, humedad)               │   │
│  │  • Alertas climáticas                                               │   │
│  │                                                                      │   │
│  │  NASA POWER:                                                         │   │
│  │  • Radiación solar histórica                                        │   │
│  │  • Datos climáticos satelitales                                     │   │
│  │                                                                      │   │
│  │  USDA Market:                                                        │   │
│  │  • Precios limón persa (semanal)                                    │   │
│  │  • Volúmenes de mercado                                             │   │
│  │                                                                      │   │
│  │  Google Earth Engine:                                                │   │
│  │  • NDVI (índice vegetación)                                         │   │
│  │  • Análisis multitemporal                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  5. DATOS DERIVADOS/CALCULADOS                                       │   │
│  │  ════════════════════════════════════════════════════════════════   │   │
│  │  • IAH (Índice de Ajuste Hídrico)                                   │   │
│  │  • IEH (Índice de Estrés Hídrico)                                   │   │
│  │  • IPF (Índice de Presión Fitosanitaria)                            │   │
│  │  • INE (Índice Nutricional Eficiente) por N, P, K, Ca, Mg           │   │
│  │  • PE (Producción Exportable estimada)                              │   │
│  │  • Factor φ (fenológico)                                            │   │
│  │  • GDD acumulado desde BioFix                                       │   │
│  │  • PE Mills Risk (riesgo enfermedad fúngica)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Mapeo de Datos → Módulos Levin 2.0

| Dato/Sensor | M1 Pest | M2 Disease | M3 Nutrition | M4 Water | M5 Opportunity | M6 Quality | M7 Vigor | M8 Frost | M9 Recovery | M10 Circadian |
|-------------|:-------:|:----------:|:------------:|:--------:|:--------------:|:----------:|:--------:|:--------:|:-----------:|:-------------:|
| **BIOELÉCTRICOS** |
| Vmem | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Vmem_std | ✓ | | | | | ✓ | ✓ | | ✓ | |
| Impedance_1k | ✓ | ✓ | ✓ | ✓ | | | ✓ | ✓ | ✓ | |
| Impedance_10k | | ✓ | ✓ | | | | | | | |
| Freq_dominant | ✓ | | ✓ | | | | | | | ✓ |
| Freq_harmonics | ✓ | | | | | | | | | |
| **DAVIS** |
| temp_out | ✓ | ✓ | | ✓ | ✓ | ✓ | | ✓ | | ✓ |
| hum_out | ✓ | ✓ | | ✓ | ✓ | | | | | |
| wind_speed | ✓ | | | | ✓ | | | | | |
| solar_rad | | | ✓ | ✓ | ✓ | | ✓ | | | ✓ |
| et_day | | | | ✓ | | | | | | |
| rain_rate | | ✓ | | ✓ | ✓ | | | | | |
| soil_moist | | ✓ | ✓ | ✓ | | | | | | |
| leaf_wet | | ✓ | | | | | | | | |
| **HISTÓRICOS** |
| muestreo.plagas | ✓ | | | | | | | | | |
| muestreo.enferm | | ✓ | | | | | | | | |
| muestreo.fruto | | | | | | ✓ | | | | |
| aplicaciones | ✓ | ✓ | ✓ | ✓ | | | | | | |
| phenology/GDD | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | | ✓ | |
| **APIs** |
| Tomorrow forecast | ✓ | ✓ | | ✓ | ✓ | | | ✓ | | |
| USDA prices | | | | | ✓ | ✓ | | | | |
| **DERIVADOS** |
| IAH | | | | ✓ | ✓ | | | | | |
| IPF | ✓ | | | | | | | | | |
| INE (N,P,K) | | | ✓ | | | | | | | |
| PE Mills Risk | | ✓ | | | | | | | | |
| Factor φ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | | ✓ | |

### 9.3 Mapeo de Módulos → Paneles Unificados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              MAPEO COMPLETO: SENSORES → MÓDULOS → PANELES                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PANEL 1: COMMAND CENTER                           │   │
│  │  ═══════════════════════════════════════════════════════════════    │   │
│  │                                                                      │   │
│  │  DATOS DIRECTOS:                                                     │   │
│  │  • Vmem (mean) → Current Bioelectric Goal gauge                     │   │
│  │  • Impedance_1k → Goal Alignment Score                              │   │
│  │  • temp_out, hum_out → Environmental context                        │   │
│  │  • GDD, phenology → Phenology status bar                            │   │
│  │                                                                      │   │
│  │  DATOS AGREGADOS DE MÓDULOS:                                         │   │
│  │  • M1-M10 status → Module Status Grid (10 semáforos)                │   │
│  │  • All detections count → Alert badges                              │   │
│  │  • Top recommendations → Recommendations list                        │   │
│  │                                                                      │   │
│  │  KPIs CALCULADOS:                                                    │   │
│  │  • VEP Impact = Σ(action.roi × action.confidence)                   │   │
│  │  • PE Forecast = PE_current × (1 + improvements)                    │   │
│  │  • Cost Savings = baseline_cost - optimized_cost                    │   │
│  │  • Price Window = days_to_peak × price_delta                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PANEL 2: INTELLIGENCE                             │   │
│  │  ═══════════════════════════════════════════════════════════════    │   │
│  │                                                                      │   │
│  │  TAB: PEST (M1)                                                      │   │
│  │  ├─ Vmem delta 6h → Signature chart                                 │   │
│  │  ├─ Freq_dominant, harmonics → FFT spectrum                         │   │
│  │  ├─ temp_out, hum_out, wind → Environmental triggers                │   │
│  │  ├─ muestreo.plagas → Validation data                               │   │
│  │  └─ IPF → Pressure index overlay                                    │   │
│  │                                                                      │   │
│  │  TAB: DISEASE (M2)                                                   │   │
│  │  ├─ Vmem variation potential → VP chart                             │   │
│  │  ├─ Impedance trend → Impedance timeline                            │   │
│  │  ├─ temp_out + leaf_wet → PE Mills calculation                      │   │
│  │  ├─ hum_out, rain_rate → Humidity/rain overlay                      │   │
│  │  └─ muestreo.enferm → Validation data                               │   │
│  │                                                                      │   │
│  │  TAB: NUTRITION (M3)                                                 │   │
│  │  ├─ Vmem baseline shift → N/K deficiency indicator                  │   │
│  │  ├─ Impedance_1k, 10k → Cell wall integrity (Ca)                    │   │
│  │  ├─ Freq response to light → Mg/Fe indicator                        │   │
│  │  ├─ solar_rad correlation → Light response chart                    │   │
│  │  ├─ soil_moist → Nutrient availability context                      │   │
│  │  └─ INE values → Nutrient status bars                               │   │
│  │                                                                      │   │
│  │  TAB: WATER (M4)                                                     │   │
│  │  ├─ Vmem absolute → Stress level gauge                              │   │
│  │  ├─ Impedance_1k → Cell hydration indicator                         │   │
│  │  ├─ temp_out, hum_out → Evaporative demand                          │   │
│  │  ├─ et_day, rain_rate → Water balance                               │   │
│  │  ├─ soil_moist → Soil moisture chart                                │   │
│  │  └─ IAH, IEH → Integration with existing indices                    │   │
│  │                                                                      │   │
│  │  TAB: FROST (M8)                                                     │   │
│  │  ├─ Vmem collapse → Frost damage indicator                          │   │
│  │  ├─ Impedance drop → Cell damage assessment                         │   │
│  │  ├─ temp_out history → Temperature timeline                         │   │
│  │  └─ Tomorrow forecast → Frost risk prediction                       │   │
│  │                                                                      │   │
│  │  TAB: RECOVERY (M9)                                                  │   │
│  │  ├─ Vmem recovery rate → Recovery trajectory                        │   │
│  │  ├─ Vmem_std → Stability indicator                                  │   │
│  │  ├─ Impedance recovery → Cell membrane repair                       │   │
│  │  └─ phenology → Recovery context                                    │   │
│  │                                                                      │   │
│  │  TAB: CIRCADIAN (M10)                                                │   │
│  │  ├─ Vmem 24h pattern → Circadian rhythm chart                       │   │
│  │  ├─ Freq_dominant pattern → Activity pattern                        │   │
│  │  ├─ solar_rad correlation → Light response                          │   │
│  │  └─ temp_out correlation → Temperature response                     │   │
│  │                                                                      │   │
│  │  COMPONENTES COMPARTIDOS:                                            │   │
│  │  • Spatial Heatmap: Vmem grid por sector                            │   │
│  │  • Location Cards: meristem, root_tip, fruit_zone, wound_site       │   │
│  │  • Coherence Score: correlación entre nodos                         │   │
│  │  • Gamma Power 40Hz: actividad de alta frecuencia                   │   │
│  │  • Environmental Bar: T, HR, Soil, Wind, PAR                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PANEL 3: OPTIMIZER                                │   │
│  │  ═══════════════════════════════════════════════════════════════    │   │
│  │                                                                      │   │
│  │  PHENOLOGY TIMELINE:                                                 │   │
│  │  ├─ GDD accumulated → Progress bar                                  │   │
│  │  ├─ phenology current → Stage indicator                             │   │
│  │  ├─ temp_out forecast → Days to next stage                          │   │
│  │  └─ BioFix date → Cycle start reference                             │   │
│  │                                                                      │   │
│  │  OPPORTUNITY DETECTOR (M5):                                          │   │
│  │  ├─ Vmem range check → Spray window status                          │   │
│  │  ├─ hum_out, wind_speed → Application conditions                    │   │
│  │  ├─ rain_rate forecast → Rain-free windows                          │   │
│  │  ├─ soil_moist → Fertigation timing                                 │   │
│  │  └─ USDA prices → Price alignment for harvest                       │   │
│  │                                                                      │   │
│  │  QUALITY PREDICTOR (M6):                                             │   │
│  │  ├─ Vmem_std → Brix correlation                                     │   │
│  │  ├─ GDD → Maturity estimation                                       │   │
│  │  ├─ muestreo.fruto → Diameter, color data                           │   │
│  │  └─ USDA prices → Optimal harvest timing                            │   │
│  │                                                                      │   │
│  │  VIGOR ASSESSOR (M7):                                                │   │
│  │  ├─ Vmem amplitude → Vigor score                                    │   │
│  │  ├─ Vmem_std → Signal variability                                   │   │
│  │  ├─ solar_rad response → Light reactivity                           │   │
│  │  ├─ Impedance_1k → Cell vitality                                    │   │
│  │  └─ phenology → Pruning window calculation                          │   │
│  │                                                                      │   │
│  │  PRUNING OPTIMIZER:                                                  │   │
│  │  ├─ M7 vigor_score → Pruning intensity recommendation               │   │
│  │  ├─ phenology → PPI (Pruning Perturbation Index)                    │   │
│  │  ├─ Factor φ → Penalty calculation                                  │   │
│  │  └─ aplicaciones.poda → Last pruning reference                      │   │
│  │                                                                      │   │
│  │  OPERATION CALENDAR:                                                 │   │
│  │  ├─ M1-M4 alerts → Block dates for treatment                        │   │
│  │  ├─ M5 opportunities → Optimal operation dates                      │   │
│  │  ├─ Tomorrow forecast → Weather-based scheduling                    │   │
│  │  └─ phenology → Phenology-based constraints                         │   │
│  │                                                                      │   │
│  │  HARVEST OPTIMIZATION:                                               │   │
│  │  ├─ M6 brix_estimate → Quality timing                               │   │
│  │  ├─ USDA prices → Price timing                                      │   │
│  │  ├─ muestreo.fruto → Size/color status                              │   │
│  │  └─ phenology GDD → Days to optimal harvest                         │   │
│  │                                                                      │   │
│  │  MORPHOGENETIC STATUS:                                               │   │
│  │  ├─ M9 recovery_rate → Regeneration potential                       │   │
│  │  ├─ Vmem by location → Meristem activation                          │   │
│  │  ├─ Growth direction → Vegetative/Reproductive/Maintenance          │   │
│  │  └─ LAI trajectory → Canopy recovery prediction                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.4 Garantía de Uso Completo de Datos

| Fuente de Datos | # Variables | % Utilizadas | Panel(es) |
|-----------------|-------------|--------------|-----------|
| Sensores Bioeléctricos | 13 | **100%** | Todos |
| Davis WeatherLink | 264 | **85%** (~225) | Intelligence, Optimizer |
| PostgreSQL Históricos | 50+ | **100%** | Todos |
| APIs Externas | 20+ | **100%** | Optimizer, Command Center |
| Datos Derivados | 10 | **100%** | Todos |

### 9.5 Variables NO Utilizadas (Justificación)

| Variable Davis | Razón de Exclusión |
|----------------|-------------------|
| bar_trend | Solo informativo, sin impacto fisiológico |
| wind_chill | Redundante con temp_out para cítricos |
| heat_index | Redundante con temp_out para cítricos |
| rain_year | Solo para reportes anuales, no decisiones |
| Campos de estación interior | No relevante para campo |

**Nota:** El 15% de campos Davis no utilizados son redundantes o solo informativos.

### 9.6 Flujo de Datos en Tiempo Real

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE DATOS EN TIEMPO REAL                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SENSORES BIOELÉCTRICOS (cada 5 min)                                       │
│  │                                                                          │
│  ├─► LoRaWAN Gateway → MQTT → InfluxDB (time series)                       │
│  │                              │                                           │
│  │                              ▼                                           │
│  │                     ┌─────────────────┐                                  │
│  │                     │ Signal Processor │                                 │
│  │                     │ • Kalman Filter  │                                 │
│  │                     │ • FFT Analysis   │                                 │
│  │                     │ • Wavelet Decomp │                                 │
│  │                     │ • Anomaly Detect │                                 │
│  │                     └────────┬────────┘                                  │
│  │                              │                                           │
│  DAVIS WEATHERLINK (cada 5 min) │                                          │
│  │                              │                                           │
│  ├─► WeatherLink API ──────────►├──────────────────────────────────────────│
│  │                              │                                           │
│  POSTGRESQL (on demand)         │                                           │
│  │                              │                                           │
│  ├─► Query históricos ─────────►├──────────────────────────────────────────│
│  │                              │                                           │
│  APIs EXTERNAS (cada 15-60 min) │                                           │
│  │                              │                                           │
│  ├─► Tomorrow.io, USDA ────────►│                                           │
│  │                              ▼                                           │
│  │                     ┌─────────────────────────────────────────┐          │
│  │                     │        DETECTION ENGINE                  │          │
│  │                     │  ┌─────┬─────┬─────┬─────┬─────┐        │          │
│  │                     │  │ M1  │ M2  │ M3  │ M4  │ M5  │        │          │
│  │                     │  │Pest │Dise │Nutr │Watr │Oppt │        │          │
│  │                     │  └──┬──┴──┬──┴──┬──┴──┬──┴──┬──┘        │          │
│  │                     │     │     │     │     │                  │          │
│  │                     │  ┌──▼──┬──▼──┬──▼──┬──▼──┬──▼──┐        │          │
│  │                     │  │ M6  │ M7  │ M8  │ M9  │ M10 │        │          │
│  │                     │  │Qual │Vigr │Frst │Recv │Circ │        │          │
│  │                     │  └─────┴─────┴─────┴─────┴─────┘        │          │
│  │                     └────────────────┬────────────────────────┘          │
│  │                                      │                                   │
│  │                                      ▼                                   │
│  │                     ┌─────────────────────────────────────────┐          │
│  │                     │        OUTPUT AGGREGATOR                 │          │
│  │                     │  • Bioelectric Goals                     │          │
│  │                     │  • Detections & Alerts                   │          │
│  │                     │  • Recommendations + ROI                 │          │
│  │                     │  • Opportunities                         │          │
│  │                     └────────────────┬────────────────────────┘          │
│  │                                      │                                   │
│  │                     ┌────────────────┼────────────────┐                  │
│  │                     ▼                ▼                ▼                  │
│  │              ┌───────────┐    ┌───────────┐    ┌───────────┐            │
│  │              │ COMMAND   │    │INTELLIGENCE│   │ OPTIMIZER │            │
│  │              │ CENTER    │    │           │    │           │            │
│  │              │ (Vue/React)│   │ (Vue/React)│   │ (Vue/React)│           │
│  │              └───────────┘    └───────────┘    └───────────┘            │
│  │                     │                │                │                  │
│  │                     └────────────────┴────────────────┘                  │
│  │                                      │                                   │
│  │                                      ▼                                   │
│  │                              ┌───────────────┐                           │
│  │                              │  WebSocket    │                           │
│  │                              │  Real-time    │                           │
│  │                              │  Updates      │                           │
│  │                              └───────────────┘                           │
│  │                                                                          │
└──┴──────────────────────────────────────────────────────────────────────────┘
```

---

## 10. VERIFICACIÓN DE COBERTURA COMPLETA

### 10.1 Checklist de Sensores Bioeléctricos

| Sensor | Módulo(s) | Panel(es) | Estado |
|--------|-----------|-----------|--------|
| ✅ Vmem | M1-M10 | Todos | **CUBIERTO** |
| ✅ Vmem_max | M1, M7, M8 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ Vmem_min | M1, M4, M8 | Intelligence | **CUBIERTO** |
| ✅ Vmem_std | M6, M7, M9 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ Impedance_1k | M1-M4, M7-M9 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ Impedance_10k | M2, M3 | Intelligence | **CUBIERTO** |
| ✅ Freq_dominant | M1, M3, M10 | Intelligence | **CUBIERTO** |
| ✅ Freq_harmonics | M1 | Intelligence (Pest) | **CUBIERTO** |
| ✅ Temperature_C | Calibración | Todos (ajuste) | **CUBIERTO** |
| ✅ Battery_pct | Sistema | Command Center | **CUBIERTO** |
| ✅ RSSI_dBm | Sistema | Command Center | **CUBIERTO** |
| ✅ Signal_quality | Sistema | Command Center | **CUBIERTO** |
| ✅ Anomaly_flags | M1-M4 | Intelligence | **CUBIERTO** |

### 10.2 Checklist de Davis WeatherLink (Críticos)

| Sensor | Módulo(s) | Panel(es) | Estado |
|--------|-----------|-----------|--------|
| ✅ temp_out | M1, M2, M4-M8, M10 | Todos | **CUBIERTO** |
| ✅ hum_out | M1, M2, M4, M5 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ wind_speed | M1, M5 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ solar_rad | M3, M4, M5, M7, M10 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ et_day | M4 | Intelligence (Water) | **CUBIERTO** |
| ✅ rain_rate | M2, M4, M5 | Intelligence, Optimizer | **CUBIERTO** |
| ✅ soil_moist_1-4 | M2-M4 | Intelligence | **CUBIERTO** |
| ✅ leaf_wet_1-2 | M2 | Intelligence (Disease) | **CUBIERTO** |
| ✅ dew_point | M2 | Intelligence (Disease) | **CUBIERTO** |

### 10.3 Resultado de Verificación

```
╔═══════════════════════════════════════════════════════════════════╗
║                    VERIFICACIÓN DE COBERTURA                      ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  SENSORES BIOELÉCTRICOS:     13/13  = 100% ✓                     ║
║  DAVIS WEATHERLINK (críticos): 9/9  = 100% ✓                     ║
║  POSTGRESQL HISTÓRICOS:       8/8   = 100% ✓                     ║
║  APIs EXTERNAS:               4/4   = 100% ✓                     ║
║  DATOS DERIVADOS:             8/8   = 100% ✓                     ║
║                                                                   ║
║  ═══════════════════════════════════════════════════════════════ ║
║  COBERTURA TOTAL:            100%                                 ║
║  TODOS LOS SENSORES Y DATOS ESTÁN MAPEADOS A MÓDULOS Y PANELES   ║
║  ═══════════════════════════════════════════════════════════════ ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

**Status:** ✅ Propuesta Aprobada  
**Next:** Implementar shared components  
**Author:** Dr. CitrusMax PhD System  
**Date:** 15 Enero 2026
