# 🧬 LEVIN LAYER 2.0 - IMPLEMENTACIÓN FINAL

**Versión:** 2.0 | **Fecha:** 15 Enero 2026 | **Estado:** DOCUMENTACIÓN COMPLETA

---

## RESUMEN EJECUTIVO: IMPLEMENTACIÓN FINAL

### ESTRUCTURA: 3 PANELES UNIFICADOS + 10 MÓDULOS BACKEND

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    LEVIN LAYER 2.0 - ARQUITECTURA FINAL                       ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   FUENTES DE DATOS (100% utilizados)                                         ║
║   ┌─────────────────────────────────────────────────────────────────────────┐║
║   │ Bioeléctricos: 13 vars │ Davis: 264 campos │ PostgreSQL: 50+ │ APIs: 4 │║
║   └─────────────────────────────────────────────────────────────────────────┘║
║                                       │                                       ║
║                                       ▼                                       ║
║   ┌─────────────────────────────────────────────────────────────────────────┐║
║   │                    10 MÓDULOS BACKEND (Detectores)                      │║
║   │  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐         │║
║   │  │ M1 ││ M2 ││ M3 ││ M4 ││ M5 ││ M6 ││ M7 ││ M8 ││ M9 ││M10 │         │║
║   │  │Pest││Dis ││Nutr││Watr││Oppt││Qual││Vigr││Frst││Recv││Circ│         │║
║   │  └────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘         │║
║   └─────────────────────────────────────────────────────────────────────────┘║
║                                       │                                       ║
║                                       ▼                                       ║
║   ┌─────────────────────────────────────────────────────────────────────────┐║
║   │                    3 PANELES FRONTEND (Unificados)                      │║
║   │                                                                         │║
║   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │║
║   │   │  📊 COMMAND     │  │  🔬 BIOELECTRIC │  │  ⚙️ MORPHOGENETIC│        │║
║   │   │    CENTER       │  │   INTELLIGENCE  │  │    OPTIMIZER    │        │║
║   │   │                 │  │                 │  │                 │        │║
║   │   │ Vista Ejecutiva │  │ Análisis PhD    │  │ Optimización    │        │║
║   │   │ KPIs + Alertas  │  │ 7 Tabs Módulos  │  │ Operaciones     │        │║
║   │   └─────────────────┘  └─────────────────┘  └─────────────────┘        │║
║   │                                                                         │║
║   └─────────────────────────────────────────────────────────────────────────┘║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## PANEL 1: COMMAND CENTER (Vista Ejecutiva)

### Propósito
**Vista de alto nivel para decisiones rápidas.** Muestra el estado general del cultivo, alertas críticas y KPIs financieros.

### Datos que Utiliza

| Fuente | Variables | Uso |
|--------|-----------|-----|
| Bioeléctricos | Vmem (mean), Impedance_1k | Goal Alignment Score |
| Davis | temp_out, hum_out | Contexto ambiental |
| PostgreSQL | phenology, GDD, ventas | Estado fenológico, financiero |
| APIs | Tomorrow.io forecast | Pronóstico |
| Módulos | M1-M10 status, detections | Semáforos y alertas |

### Diseño Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 LEVIN COMMAND CENTER                          [S1▼] [⟳] [🔔 3 alerts]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────┐│
│  │   🎯 BIOELECTRIC GOAL        │  │   📈 KPIs FINANCIEROS               ││
│  │   ┌─────────────────────┐    │  │                                      ││
│  │   │      ████████░░     │    │  │   VEP Impact:    +$45,230 🟢        ││
│  │   │         82%         │    │  │   PE Forecast:   38.2 ton  🟢        ││
│  │   │    "Maximizar PE"   │    │  │   Cost Savings:  -$12,400 🟢        ││
│  │   └─────────────────────┘    │  │   Price Window:  8 days   🟡        ││
│  │   Vmem: -68mV (óptimo)       │  │                                      ││
│  │   Alignment: 82%             │  │   ROI Proyectado: 5.2x              ││
│  └──────────────────────────────┘  └──────────────────────────────────────┘│
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   📊 MODULE STATUS (10 Detectores)                                    │  │
│  │   ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐     │  │
│  │   │ 🟢 ││ 🟡 ││ 🟢 ││ 🟢 ││ 🟢 ││ 🟢 ││ 🟢 ││ 🟢 ││ 🟢 ││ 🟢 │     │  │
│  │   │Pest││Dis ││Nutr││Watr││Oppt││Qual││Vigr││Frst││Recv││Circ│     │  │
│  │   └────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘     │  │
│  │   🟢 Normal  🟡 Warning  🔴 Critical                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │   🚨 ALERTAS ACTIVAS (3)          │  │   ✅ TOP RECOMENDACIONES       │ │
│  │                                   │  │                                │ │
│  │   🟡 Antracnosis Risk 72%         │  │   1. Aplicar fungicida Cu      │ │
│  │      M2 Disease - 24h anticipación│  │      ROI: 3.2x │ Conf: 85%     │ │
│  │                                   │  │                                │ │
│  │   🟢 Spray Window Open            │  │   2. Fertiriego K+Mg           │ │
│  │      M5 Opportunity - 6h válido   │  │      ROI: 2.8x │ Conf: 78%     │ │
│  │                                   │  │                                │ │
│  │   🟢 Harvest Optimal in 8d        │  │   3. Programar cosecha Ene 23  │ │
│  │      M6 Quality - precio pico     │  │      ROI: 4.5x │ Conf: 92%     │ │
│  └───────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   📅 FENOLOGÍA: FEN-06 Maduración │ GDD: 1,245/1,680 │ Ciclo 1       │  │
│  │   ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  74%          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 2: BIOELECTRIC INTELLIGENCE (Análisis PhD)

### Propósito
**Análisis científico profundo de señales bioeléctricas.** Permite explorar cada módulo detector con visualizaciones detalladas para agrónomo PhD.

### Datos que Utiliza

| Tab | Datos Bioeléctricos | Datos Ambientales | Datos Históricos |
|-----|---------------------|-------------------|------------------|
| **PEST** | Vmem Δ6h, Freq, Harmonics | T, HR, Viento | muestreo.plagas, IPF |
| **DISEASE** | Vmem VP, Impedance trend | T, leaf_wet, rain | muestreo.enferm, PE Mills |
| **NUTRITION** | Vmem baseline, Imp 1k/10k, Freq | solar_rad, soil_moist | INE, aplicaciones |
| **WATER** | Vmem absolute, Impedance | T, HR, ET, rain | IAH, IEH, soil_moist |
| **FROST** | Vmem collapse, Imp drop | T history | Tomorrow forecast |
| **RECOVERY** | Vmem recovery rate, std | - | phenology, eventos |
| **CIRCADIAN** | Vmem 24h, Freq pattern | solar_rad, T | - |

### Diseño Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔬 BIOELECTRIC INTELLIGENCE                      [S1▼] [⟳] [📚 Refs]      │
├─────────────────────────────────────────────────────────────────────────────┤
│  [PEST] [DISEASE] [NUTRITION] [WATER] [FROST] [RECOVERY] [CIRCADIAN]       │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ▼ TAB: DISEASE (M2) ▼                               │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │   🗺️ SPATIAL HEATMAP (Vmem)     │  │   📊 VMEM VARIATION POTENTIAL    │ │
│  │   ┌─────────────────────────┐   │  │   ┌────────────────────────────┐ │ │
│  │   │ S1  S2  S3  S4  S5  S6  │   │  │   │         ╱╲                 │ │ │
│  │   │ 🟢  🟡  🟢  🟢  🟡  🟢  │   │  │   │    ╱╲  ╱  ╲   Healthy     │ │ │
│  │   │ 🟢  🟢  🟡  🟢  🟢  🟢  │   │  │   │   ╱  ╲╱    ╲──────────   │ │ │
│  │   │ 🟡  🟢  🟢  🟢  🟢  🟡  │   │  │   │  ╱   Infected              │ │ │
│  │   └─────────────────────────┘   │  │   │ ╱ ─────────────────────    │ │ │
│  │   Min: -85mV  Max: -52mV        │  │   └────────────────────────────┘ │ │
│  └─────────────────────────────────┘  │   VP: 12.3mV (umbral: 15mV)      │ │
│                                        └──────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │   📈 IMPEDANCE TREND (7 días)   │  │   🌡️ PE MILLS INDEX              │ │
│  │   ┌────────────────────────────┐│  │   ┌────────────────────────────┐ │ │
│  │   │kΩ                          ││  │   │   Horas Mojadura: 14       │ │ │
│  │   │25├─────────────────────────││  │   │   Temp Media: 23°C         │ │ │
│  │   │20├──────╱╲─────────────────││  │   │   ──────────────────────── │ │ │
│  │   │15├─────╱  ╲────────────────││  │   │   PE Mills Risk: 72% 🟡    │ │ │
│  │   │  └─────────────────────────││  │   │   Umbral infección: 75%    │ │ │
│  │   │    L  M  X  J  V  S  D     ││  │   │   Tiempo a infección: 24h  │ │ │
│  │   └────────────────────────────┘│  │   └────────────────────────────┘ │ │
│  │   Trend: +8% (alerta si >20%)   │  │   Acción: Aplicar Cu preventivo  │ │
│  └─────────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   📍 LOCATION CARDS (Vmem por zona)                                   │  │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │   │  MERISTEM  │ │  ROOT TIP  │ │ FRUIT ZONE │ │ WOUND SITE │        │  │
│  │   │   -65mV    │ │   -72mV    │ │   -68mV    │ │   -58mV    │        │  │
│  │   │    🟢      │ │    🟢      │ │    🟢      │ │    🟡      │        │  │
│  │   └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   🤖 PhD AI ANALYSIS                                     [Generate]  │  │
│  │   "El análisis de impedancia muestra un incremento de 8% en los      │  │
│  │    últimos 3 días, correlacionado con las 14 horas de mojadura       │  │
│  │    foliar registradas. El modelo PE Mills indica 72% de riesgo de    │  │
│  │    infección por Antracnosis. Recomendación: aplicar hidróxido de    │  │
│  │    cobre 2.5 kg/ha en las próximas 24 horas..."                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   🌡️ T: 24°C │ 💧 HR: 78% │ 🌱 Soil: 42% │ 💨 Wind: 8 km/h │ ☀️ 650 W/m²│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 3: MORPHOGENETIC OPTIMIZER (Operaciones)

### Propósito
**Optimización de operaciones agrícolas.** Integra todos los módulos para generar recomendaciones de timing óptimo, poda, cosecha y calendario de operaciones.

### Datos que Utiliza

| Sección | Datos | Módulos Backend |
|---------|-------|-----------------|
| **Phenology Timeline** | GDD, phenology, BioFix, T forecast | - |
| **Opportunity Windows** | Vmem range, HR, wind, rain, soil | M5 |
| **Quality Predictor** | Vmem_std, GDD, fruto data, prices | M6 |
| **Vigor Assessor** | Vmem amplitude/std, solar response, Imp | M7 |
| **Pruning Optimizer** | vigor_score, phenology, Factor φ | M7 |
| **Operation Calendar** | All M1-M10 outputs, Tomorrow forecast | Todos |
| **Harvest Optimization** | brix_estimate, prices, fruto, GDD | M5, M6 |
| **Morphogenetic Status** | recovery_rate, Vmem by location | M9 |

### Diseño Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚙️ MORPHOGENETIC OPTIMIZER                       [S1▼] [⟳] [📅 Export]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   📅 PHENOLOGY TIMELINE                                               │  │
│  │   FEN-01   FEN-02   FEN-03   FEN-04   FEN-05   FEN-06   FEN-07       │  │
│  │   ████████████████████████████████████████████░░░░░░░░░░░░░░░░░      │  │
│  │   Latencia Brotación Floración Cuajado Desarrollo [ACTUAL] Cosecha   │  │
│  │                                                    Maduración         │  │
│  │   GDD: 1,245 / 1,680  │  Días restantes: ~32  │  Cosecha óptima: Feb 16│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │   🎯 OPPORTUNITY WINDOWS (M5)   │  │   🍋 QUALITY PREDICTOR (M6)      │ │
│  │                                 │  │                                  │ │
│  │   ✅ Spray Window      OPEN     │  │   °Brix Estimado: 10.2           │ │
│  │      Válido: 6h más             │  │   ████████████░░░░░░░░  Target:12│ │
│  │      Vmem: -68mV ✓              │  │                                  │ │
│  │      Wind: 8 km/h ✓             │  │   Diámetro: 52mm (óptimo: 55mm)  │ │
│  │      Rain: 0% 24h ✓             │  │   Color: 65% verde               │ │
│  │                                 │  │                                  │ │
│  │   🟡 Fertigation      WAIT      │  │   Precio actual: $1.45/kg        │ │
│  │      Soil moist: 42% (>35%)     │  │   Precio pico: $2.17/kg (+50%)   │ │
│  │      Próxima ventana: 2 días    │  │   Días a pico: 38 días (Marzo)   │ │
│  │                                 │  │                                  │ │
│  │   ✅ Harvest          8 DAYS    │  │   📊 Harvest ROI: $0.72/kg extra │ │
│  │      Brix óptimo en 8 días      │  │      si espera 8 días más        │ │
│  └─────────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │   🌿 VIGOR ASSESSOR (M7)        │  │   ✂️ PRUNING OPTIMIZER            │ │
│  │                                 │  │                                  │ │
│  │   Vigor Score: 78/100           │  │   Intensidad Recomendada:        │ │
│  │   ████████████████░░░░  ALTO    │  │   ████████████████████░░ 25-30%  │ │
│  │                                 │  │                                  │ │
│  │   Vmem Amplitude: 22mV          │  │   PPI (Perturbation Index): 0.15 │ │
│  │   Light Response: 2.3 min       │  │   Factor φ: 0.20 (FEN-06)        │ │
│  │   Cell Vitality: 85%            │  │   Penalty if prune now: -20% PE  │ │
│  │                                 │  │                                  │ │
│  │   Clasificación: VIGOROSO       │  │   ⏰ Ventana óptima: FEN-01      │ │
│  │   Recom: Poda intensa OK        │  │      (Latencia, ~45 días)        │ │
│  └─────────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   📆 OPERATION CALENDAR (Enero 2026)                                  │  │
│  │   ┌────┬────┬────┬────┬────┬────┬────┐                               │  │
│  │   │ Lu │ Ma │ Mi │ Ju │ Vi │ Sa │ Do │                               │  │
│  │   ├────┼────┼────┼────┼────┼────┼────┤                               │  │
│  │   │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │                               │  │
│  │   │    │🟡Cu│    │    │🟢💧│    │    │                               │  │
│  │   ├────┼────┼────┼────┼────┼────┼────┤                               │  │
│  │   │ 20 │ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │                               │  │
│  │   │    │    │    │🍋  │    │    │    │                               │  │
│  │   └────┴────┴────┴────┴────┴────┴────┘                               │  │
│  │   🟡 Fungicida  🟢 Fertiriego  🍋 Inicio cosecha                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │   🔄 MORPHOGENETIC STATUS                                             │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │  │
│  │   │ Regeneration    │  │ Meristem        │  │ Growth          │      │  │
│  │   │ Potential: 85%  │  │ Activation: 72% │  │ Direction:      │      │  │
│  │   │ ████████████░░░ │  │ ██████████░░░░░ │  │ REPRODUCTIVE    │      │  │
│  │   └─────────────────┘  └─────────────────┘  └─────────────────┘      │  │
│  │   LAI Recovery: Normal │ Days to full recovery: 12 │ Stress: LOW     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## RESUMEN COMPARATIVO: 4 PANELES LEGACY vs 3 PANELES NUEVOS

| Legacy (4 paneles) | Nuevo (3 paneles) | Beneficio |
|-------------------|-------------------|-----------|
| LevinLayerDashboard | → Command Center | +KPIs financieros, +10 semáforos módulos |
| LevinGoalAlignment | → Command Center | Integrado en Goal gauge + recommendations |
| LevinBioelectricMap | → Bioelectric Intelligence | +7 tabs para cada módulo, +PhD AI |
| LevinMorphogenesis | → Morphogenetic Optimizer | +Calendar, +Opportunities, +Harvest timing |

### Reducción de Redundancia

```
ANTES: 4 paneles × ~500 líneas = 2,000 líneas de código
DESPUÉS: 3 paneles × ~400 líneas + 300 shared = 1,500 líneas
AHORRO: 25% menos código, 100% más funcionalidad
```

---

## STACK TECNOLÓGICO FINAL

| Componente | Tecnología |
|------------|------------|
| **Framework** | React 18 + TypeScript |
| **Styling** | TailwindCSS |
| **Charts** | Recharts + ApexCharts |
| **Icons** | Lucide React |
| **State** | Zustand |
| **UI Components** | shadcn/ui |
| **Real-time** | WebSocket |
| **API** | FastAPI (existente) |

---

## ARQUITECTURA DE 10 MÓDULOS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LEVIN LAYER 2.0 - 10 DETECTORES                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   SENSORES BIOELÉCTRICOS (722 nodos)                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  Vmem (mV) │ Impedancia (kΩ) │ Frecuencia (Hz) │ Temp │ Humedad    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    PREPROCESAMIENTO                                 │  │
│   │   [10] Circadian Corrector │ Kalman Filter │ FFT │ Wavelet        │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  MÓDULOS PRINCIPALES (1-5)                                          │  │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│   │  │[1] PEST │ │[2] DIS- │ │[3] NUTR-│ │[4] WATER│ │[5] OPPOR│       │  │
│   │  │DETECTOR │ │EASE DET.│ │ITION DET│ │ STRESS  │ │TUNITY D.│       │  │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │  │
│   │                                                                     │  │
│   │  MÓDULOS ADICIONALES (6-10)                                         │  │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│   │  │[6] FRUIT│ │[7] VIGOR│ │[8] FROST│ │[9] RECOV│ │[10]CIRCA│       │  │
│   │  │ QUALITY │ │ ASSESS. │ │ DAMAGE  │ │ MONITOR │ │DIAN COR.│       │  │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    INTEGRACIÓN C2AI                                 │  │
│   │   Health Agent │ Irrigation Agent │ Watson │ Dr. CitrusMax         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DOCUMENTOS DE ESPECIFICACIÓN TÉCNICA

| # | Documento | Contenido | Líneas |
|---|-----------|-----------|--------|
| 1 | `LEVIN_MODULES_PART1_PEST_DETECTOR.md` | Módulo 1: Pest Detector | ~350 |
| 2 | `LEVIN_MODULES_PART2_DISEASE_DETECTOR.md` | Módulo 2: Disease Detector | ~400 |
| 3 | `LEVIN_MODULES_PART3_NUTRITION_DETECTOR.md` | Módulo 3: Nutrition Detector | ~400 |
| 4 | `LEVIN_MODULES_PART4_WATER_STRESS.md` | Módulo 4: Water Stress | ~400 |
| 5 | `LEVIN_MODULES_PART5_OPPORTUNITY_DETECTOR.md` | Módulo 5: Opportunity Detector | ~350 |
| 6 | `LEVIN_MODULES_PART6_ADDITIONAL_MODULES.md` | Módulos 6-10 | ~600 |
| 7 | `LEVIN_LAYER_2.0_REDESIGN_PLAN.md` | Plan general + Arquitectura | ~1100 |

**Total: ~3,600 líneas de documentación técnica**

---

## RESUMEN POR MÓDULO

### MÓDULOS PRINCIPALES (1-5)

| Módulo | Objetivo | Anticipación | Precisión | Integración |
|--------|----------|--------------|-----------|-------------|
| **1. Pest Detector** | 7 plagas (Trips, Minador, Araña, Pulgón, Diaphorina, Escama, Ácaro) | 24-72h | >70% | Health Agent |
| **2. Disease Detector** | 6 enfermedades + PE Mills (Antracnosis, M.Grasienta, HLB, Phytophthora) | 12h-90d | R²>0.90 | Watson |
| **3. Nutrition Detector** | 8 nutrientes (N,P,K,Ca,Mg,Fe,Zn,B) + predicción INE | Proactivo | R²>0.80 | NPF |
| **4. Water Stress** | IAH, predicción riego, déficit hídrico | 6-48h | R²>0.85 | Irrigation |
| **5. Opportunity Detector** | Ventanas óptimas (aspersión, fertiriego, cosecha, poda) | Tiempo real | >85% | Todos |

### MÓDULOS ADICIONALES (6-10)

| Módulo | Objetivo | Aplicación | Frecuencia |
|--------|----------|------------|------------|
| **6. Fruit Quality** | Predicción °Brix por transporte floema | FEN-06/07 | Cada hora |
| **7. Vigor Assessor** | Evaluación vigor para % poda | Post-cosecha | Antes de poda |
| **8. Frost Damage** | Detección helada tiempo real | Alertas críticas | Tiempo real |
| **9. Recovery Monitor** | Resiliencia post-estrés | Post-eventos | Continuo |
| **10. Circadian Corrector** | Corrección señales por hora | Preproceso | Continuo |

---

## COMPONENTES DE CADA DOCUMENTO

Cada documento de módulo contiene:

1. **Resumen Ejecutivo** - Tabla con parámetros clave
2. **Soporte Técnico-Académico** - Referencias científicas y ecuaciones
3. **Firmas Bioeléctricas** - Tablas de umbrales por condición
4. **Workflow Completo** - Diagrama de flujo paso a paso
5. **Panel UI** - Diseño ASCII del dashboard
6. **Algoritmo Python** - Código de implementación
7. **Métricas de Validación** - KPIs y targets

---

## REFERENCIAS ACADÉMICAS TOTALES

| Área | # Referencias | Autores Clave |
|------|---------------|---------------|
| Electrofisiología vegetal | 8 | Fromm, Volkov, Zimmermann |
| Fitopatología | 6 | Mills, Magarey, Gottwald |
| Nutrición mineral | 6 | Marschner, Shabala, White |
| Estrés hídrico | 6 | Steudle, Christmann, Huber |
| Ritmos circadianos | 3 | Haydon, Minorsky |

**Total: 29+ referencias peer-reviewed**

---

## INVERSIÓN EN SENSORES (RECOMENDADO)

| Escenario | Sensores | Costo | Confianza | ROI |
|-----------|----------|-------|-----------|-----|
| **Recomendado** | **722** | **$47,543 USD** | **95%** | **5:1** |
| Con redundancia 10% | 794 | $52,305 USD | 95% | 5:1 |

### Plan de Implementación

| Fase | Timeline | Secciones | Inversión |
|------|----------|-----------|-----------|
| Piloto | Mes 1-2 | S1 (30 nodos) | $1,976 |
| Fase 1 | Mes 3-4 | S1+S2 completo | $16,265 |
| Fase 2 | Mes 5-6 | S3+S4 | $15,211 |
| Fase 3 | Mes 7-8 | S5+S6 | $16,067 |

---

## FLUJO DE DATOS

```
SENSORES → PREPROCESO → MÓDULOS → ALERTAS → ACCIONES
   │           │           │          │          │
   │           │           │          │          └→ Planes de acción
   │           │           │          └→ WhatsApp, Email, Dashboard
   │           │           └→ Detecciones con confianza
   │           └→ Corrección circadiana, Kalman, FFT
   └→ Vmem, Impedancia, Frecuencia @ 1Hz
```

---

## MÉTRICAS GLOBALES DE ÉXITO

| Métrica | Target | Impacto Económico |
|---------|--------|-------------------|
| Reducción aplicaciones fitosanitarias | 20-30% | $15,000-25,000/año |
| Ahorro de agua | 15% | $8,000-12,000/año |
| Detección temprana plagas | 70% 24h antes | $30,000-50,000/año |
| Detección temprana enfermedades | 75% | $20,000-40,000/año |
| Optimización cosecha (timing) | +15% precio | $25,000-40,000/año |

**ROI Total Esperado: $98,000-167,000/año sobre inversión de $52,305**

---

## PRÓXIMOS PASOS

1. ✅ Documentación técnica completa
2. ⏳ Aprobación de arquitectura
3. ⏳ Adquisición de sensores (piloto)
4. ⏳ Desarrollo de firmware ESP32
5. ⏳ Integración con infraestructura C2AI
6. ⏳ Entrenamiento de modelos con datos reales
7. ⏳ Validación en campo

---

*Índice Maestro Levin Layer 2.0 | CitrusMax AI PhD System | 15 Enero 2026*
