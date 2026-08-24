# 🐛 MÓDULO 1: PEST DETECTOR - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

## 1.1 RESUMEN EJECUTIVO

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Detectar 7 plagas principales con 24-72h de anticipación |
| **Input** | Vmem, Frecuencia, Impedancia, Temperatura, Humedad |
| **Output** | Alertas con confianza, lead time, acciones recomendadas |
| **Precisión Target** | >70% detección, <15% falsos positivos |

---

## 1.2 SOPORTE TÉCNICO-ACADÉMICO

### 1.2.1 Referencias Científicas Clave

| Ref | Autor(es) | Título | Publicación | Hallazgo Clave |
|-----|-----------|--------|-------------|----------------|
| 1 | Fromm & Lautner (2007) | "Electrical signals and their physiological significance in plants" | Plant, Cell & Env. 30(3) | APs de 20-150mV por daño mecánico |
| 2 | Volkov (2012) | "Plant Electrophysiology: Signaling and Responses" | Springer | Firmas eléctricas específicas por daño |
| 3 | Zimmermann et al. (2009) | "System potentials, a novel electrical signal" | Plant Physiol. 149(3) | SPs propagan a 0.5-3 cm/s |
| 4 | Yan et al. (2009) | "Research Progress on Electrical Signals" | Prog. Nat. Sci. 19(5) | FFT revela bandas por estrés |
| 5 | Stahlberg (2006) | "Slow wave potentials — a propagating electrical signal" | New Phytol. 161(2) | Señales hidráulicas en floema |
| 6 | Davies (2006) | "Electrical signals in plants: facts and hypotheses" | Plant Electrophys. | Mecanismos iónicos Ca2+/K+ |

### 1.2.2 Ecuaciones Fundamentales

**Ecuación de Nernst (Potencial de Equilibrio):**
```
E = (RT/zF) × ln([ion]ext/[ion]int)

Donde:
  R = 8.314 J/(mol·K)
  T = Temperatura (K)
  z = Valencia del ion
  F = 96,485 C/mol
```

**Ecuación de Goldman-Hodgkin-Katz:**
```
Vm = (RT/F) × ln[(PK[K+]o + PNa[Na+]o + PCl[Cl-]i) / 
                  (PK[K+]i + PNa[Na+]i + PCl[Cl-]o)]
```

**Modelo de Propagación de Señal:**
```
v = √(2D × k)

Donde:
  v = velocidad de propagación (cm/s)
  D = coeficiente de difusión iónica
  k = constante de reacción
```

---

## 1.3 TIPOS DE SEÑALES BIOELÉCTRICAS

| Señal | Siglas | Amplitud | Duración | Velocidad | Causa |
|-------|--------|----------|----------|-----------|-------|
| Potencial de Acción | AP | 20-150 mV | 1-30 s | 1-10 cm/s | Mordida |
| Potencial de Variación | VP | 5-50 mV | min-horas | 0.1-1 cm/s | Infección |
| Potencial de Herida | WP | 50-200 mV | segundos | Local | Ruptura |
| Potencial de Sistema | SP | 5-30 mV | horas-días | 0.5-3 cm/s | Estrés sistémico |

---

## 1.4 FIRMAS BIOELÉCTRICAS POR PLAGA

| Plaga | ΔVmem 6h | Patrón | Freq (Hz) | Impedancia | Lead |
|-------|----------|--------|-----------|------------|------|
| **Trips** | 10-20 mV | Burst | 15-25 | +5-10% | 48h |
| **Minador** | WP 50-150 | Spikes | 10-20 | +10-20% | 24h |
| **Araña Roja** | 5-12 mV | ↓Gradual | 3-8 | -5-15% | 48h |
| **Pulgón** | 8-15 mV | Osmótico | 5-15 | -3-8% | 36h |
| **Diaphorina** | 15-25 mV | Doble | 20-30 | -5-10% | **72h** |
| **Escama** | 4-10 mV | Continuo | 2-5 | -2-5% | 72h |
| **Ácaro** | 5-12 mV | Irregular | 4-10 | +3-8% | 36h |

---

## 1.5 WORKFLOW DEL MÓDULO

```
SENSORES (722 nodos)
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 1: ADQUISICIÓN (1 Hz)            │
│ • Vmem via ADS1115 (16-bit)           │
│ • Impedancia @ 1kHz                   │
│ • Temp (DS18B20), Hum (DHT22)         │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 2: PREPROCESAMIENTO (5s)         │
│ • Filtro Kalman (Q=0.001, R=0.1)      │
│ • Corrección circadiana               │
│ • Corrección térmica                  │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 3: EXTRACCIÓN FEATURES (5min)    │
│ • Delta Vmem 6h                       │
│ • FFT → espectro 0-50Hz               │
│ • Detección AP/WP/VP                  │
│ • Energía por banda                   │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 4: MATCHING FIRMAS               │
│ FOR each plaga:                       │
│   vmem_score (40%)                    │
│   freq_score (35%)                    │
│   env_score (15%)                     │
│   phen_score (10%)                    │
│   confidence = weighted_sum           │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 5: AGREGACIÓN ESPACIAL           │
│ • Consenso por sección                │
│ • >30% nodos → Alerta sección         │
│ • 10-30% → Alerta focalizada          │
│ • <10% → Monitoreo                    │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 6: GENERACIÓN ALERTAS            │
│ • CRÍTICO: Diaphorina (>80%)          │
│ • ALTO: conf >85% OR cobertura >50%   │
│ • MEDIO: conf 70-85%                  │
│ • BAJO: conf 60-70%                   │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ PASO 7: INTEGRACIÓN                   │
│ → Health Agent (IPF)                  │
│ → Friston Layer (surprise)            │
│ → Watson Optimizer (tratamiento)      │
│ → Opportunity Detector (ventana)      │
└───────────────────────────────────────┘
```

---

## 1.6 PANEL UI - PEST DETECTOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🐛 PEST DETECTOR          [S1][S2][S3][S4][S5][S6]  [⚙️][📊][🔔]      │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────┐  ┌────────────────────────────────────────┐│
│ │   MAPA CALOR SECCIÓN     │  │     RESUMEN ALERTAS                    ││
│ │   ░░░░░░░░░░░░░░░░░░    │  │  🔴 CRÍTICO: 1 (Diaphorina S2)        ││
│ │   ░░░░░░░░██░░░░░░░░    │  │  🟠 ALTO: 2 (Trips S1, Minador S3)    ││
│ │   ░░░░░░████░░░░░░░░    │  │  🟡 MEDIO: 3                          ││
│ │   ░░░░░░░░░░░░░░░░░░    │  │  🟢 BAJO: 5                           ││
│ │   ░Normal █Detección     │  │  Actualización: 14:32:15              ││
│ └──────────────────────────┘  └────────────────────────────────────────┘│
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────────┤
│ │ DETECCIONES ACTIVAS                                                  ││
│ ├───────────────────────────────────────────────────────────────────────┤
│ │ 🔴 DIAPHORINA - S2                          Conf: 87% | Lead: 72h   ││
│ │    ΔVmem: +19.3mV | Freq: 24.5Hz | Nodos: 42/127 (33%)             ││
│ │    [🎯 Detalle] [✅ Validar] [💊 Tratamiento]                       ││
│ ├───────────────────────────────────────────────────────────────────────┤
│ │ 🟠 TRIPS - S1                               Conf: 78% | Lead: 48h   ││
│ │    ΔVmem: +14.2mV | Freq: 18.5Hz | Nodos: 38/120 (32%)             ││
│ │    [🎯 Detalle] [✅ Validar] [💊 Tratamiento]                       ││
│ └───────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ ┌────────────────────────────┐  ┌──────────────────────────────────────┐│
│ │ ESPECTRO FFT EN TIEMPO REAL│  │ TENDENCIA VMEM 24H                   ││
│ │     ████                   │  │    _____                             ││
│ │    █████                   │  │   /     \___                         ││
│ │   ██████                   │  │__/          \____                    ││
│ │  ███████_______            │  │ 0h    6h    12h   18h   24h         ││
│ │ 0  10  20  30  40  Hz      │  │                                      ││
│ └────────────────────────────┘  └──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.7 ACCIONES RECOMENDADAS POR PLAGA

| Plaga | Producto | Dosis | Método | Timing | ROI |
|-------|----------|-------|--------|--------|-----|
| Trips | Spinosad | 0.5 L/ha | Aspersión | Mañana/Tarde | 4:1 |
| Minador | Imidacloprid 35% | 0.3 L/ha | Foliar | Brotes tiernos | 5:1 |
| Araña Roja | Abamectina 1.8% | 0.4 L/ha | Cobertura total | Alta infest. | 3:1 |
| Pulgón | Imidacloprid 35% | 0.3 L/ha | Foliar | Brotes nuevos | 4:1 |
| **Diaphorina** | Dimetoato 40% | **1.0 L/ha** | **INMEDIATO** | **SIN DEMORA** | **50:1** |
| Escama | Aceite mineral | 10 L/ha | Total | Fuera floración | 2:1 |
| Ácaro | Azufre 80% | 3 kg/ha | Espolvoreo | Mañana | 3:1 |

---

## 1.8 MÉTRICAS DE VALIDACIÓN

| Métrica | Target | Método |
|---------|--------|--------|
| Sensibilidad (TPR) | >70% | Validación campo |
| Especificidad (TNR) | >85% | Falsos positivos |
| Lead Time Real | >24h promedio | Tiempo a confirmación |
| ROI del Sistema | >5:1 | Ahorro vs inversión |

*Documento: Módulo 1 Pest Detector | Levin Layer 2.0 | 15 Enero 2026*
