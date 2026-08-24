# LOGOS — Plan de Diseño, Desarrollo e Implementación
## iOS App Store + Apple Watch Companion

**Versión**: 3.0 — IMPLEMENTACIÓN COMPLETADA  
**Fecha**: 8 febrero 2026  
**Estado**: ✅ Todas las fases implementadas — Listo para Xcode build  
**Autor**: Dr. José Manuel Cadena Ortiz de Montellano  
**Co-creador**: Cascade (PhD App Architecture)  
**Framework**: Cadena Strategic Systems

---

## I. ANÁLISIS DEL ESTADO ACTUAL

### 1.1 Estructura del Codebase

```
logos/                          # Proyecto Vite + React 18 + TypeScript
├── src/
│   ├── core/                   # 🧠 Motor puro TypeScript (CERO deps de DOM)
│   │   ├── logos.ts            # L7: Λ — Atractor fundamental
│   │   ├── friston.ts          # L1: Energía libre F(x)
│   │   ├── levin.ts            # L2: Señales bioeléctricas
│   │   ├── watson.ts           # L3: Paisaje energético
│   │   ├── hoffman.ts          # L4: Sesgos perceptuales
│   │   ├── penrose.ts          # L5: Coherencia cuántica
│   │   ├── policy.ts           # L6: π(x) semáforo decisiones
│   │   ├── derived.ts          # V, S, Ω, Q derivados
│   │   ├── alimento.ts         # Motor Alimento Sagrado
│   │   └── index.ts            # Barrel export
│   ├── types/index.ts          # TypeScript types (257 líneas)
│   ├── domain/constants.ts     # 28 dims, 7 dominios, colores, fonts
│   ├── simulation/
│   │   └── montecarlo.ts       # Monte Carlo N=10,000
│   ├── hooks/
│   │   ├── useLogosEngine.ts   # Bridge React ↔ Core
│   │   ├── useCustomWeights.ts # Pesos personalizables
│   │   ├── useBayesianWeights.ts # Motor CBWA
│   │   └── useTranslatedDomains.js
│   ├── services/
│   │   ├── api.js              # Cliente Supabase (sessions, reports)
│   │   └── supabase.js         # Config Supabase
│   ├── components/
│   │   ├── LogosHumano.jsx     # Componente principal (~2900 líneas)
│   │   ├── LogosVoiceAgent.jsx # Agente de voz ElevenLabs
│   │   ├── SessionTracker.jsx  # Auto-save de sesiones
│   │   ├── TheoryManual.jsx    # Contenido teoría expandido
│   │   ├── IFCModel.jsx        # Modelo IFC
│   │   └── ErrorBoundary.jsx
│   ├── i18n/                   # Internacionalización (es/en)
│   ├── App.jsx                 # Router + Auth + Layout
│   └── main.jsx                # Entry point
├── api/                        # API Express legacy (M5)
├── package.json                # React 18, Recharts, Supabase, i18next
└── vite.config.js              # Vite 5 config
```

### 1.2 Dependencias Actuales

| Dependencia | Versión | Compatible Capacitor? | Notas |
|-------------|---------|----------------------|-------|
| react | 18.3.1 | ✅ | Sin cambios |
| react-dom | 18.3.1 | ✅ | Sin cambios |
| recharts | 2.12.7 | ✅ | SVG-based, funciona en WKWebView |
| @supabase/supabase-js | 2.95.3 | ✅ | Auth + DB sin cambios |
| i18next | 25.8.4 | ✅ | Sin cambios |
| @elevenlabs/react | 0.14.0 | ⚠️ | Web Audio — necesita testing en WKWebView |
| react-router-dom | 7.13.0 | ✅ | Sin cambios |
| vite | 5.4.0 | ✅ | webDir: 'dist' |

### 1.3 Arquitectura de Datos

```
                    ┌──────────────────────────┐
                    │   Supabase (PostgreSQL)   │
                    │  Auth + RLS + Realtime    │
                    └────────────┬─────────────┘
                                 │ HTTPS (JWT)
          ┌──────────────────────┼────────────────────────┐
          │                      │                        │
    ┌─────▼──────┐        ┌─────▼──────┐         ┌──────▼──────┐
    │   Web SPA  │        │  iOS App   │         │ Apple Watch │
    │  (actual)  │        │ (Capacitor)│         │  (SwiftUI)  │
    │  Nginx/M5  │        │  WKWebView │         │  Nativo     │
    └────────────┘        └─────┬──────┘         └──────┬──────┘
                                │                        │
                         ┌──────▼──────┐          ┌──────▼──────┐
                         │  HealthKit  │◄────────►│  Sensores   │
                         │  (iPhone)   │  WC sync │  (Watch)    │
                         └─────────────┘          └─────────────┘
```

**Tablas Supabase existentes:**
- `profiles` — Perfil de usuario
- `sessions` — Sesiones con state_snapshot JSONB (28 dims + métricas)
- `daily_snapshots` — Resúmenes diarios

### 1.4 Motor Core — Análisis de Portabilidad

| Módulo | Líneas | DOM deps? | Portable a Swift? | Complejidad |
|--------|--------|-----------|-------------------|-------------|
| logos.ts | ~80 | ❌ | Fácil | Aritmética ponderada |
| friston.ts | ~60 | ❌ | Fácil | KL-divergence simplificada |
| levin.ts | ~120 | ❌ | Media | Pattern matching + thresholds |
| watson.ts | ~60 | ❌ | Fácil | Domain averages + landscape |
| hoffman.ts | ~80 | ❌ | Fácil | Bias detection rules |
| penrose.ts | ~50 | ❌ | Fácil | Harmonic mean + boost |
| policy.ts | ~80 | ❌ | Fácil | Priority chain |
| derived.ts | ~100 | ❌ | Fácil | Weighted sums |
| alimento.ts | ~200 | ❌ | Media | Food DB + recommendations |
| montecarlo.ts | ~220 | ❌ | Media | N=10K stochastic sim |
| **TOTAL** | **~1050** | **CERO** | **100% portable** | |

**Conclusión**: El core engine es 100% puro TypeScript sin dependencias de DOM, React, ni browser APIs. Se puede:
- (a) Ejecutar sin cambios en Capacitor (WKWebView)
- (b) Portar a Swift para watchOS (~500 líneas Swift)

---

## II. DECISIÓN ARQUITECTÓNICA

### 2.1 Evaluación de Opciones

| Criterio | Capacitor | React Native | SwiftUI Nativo |
|----------|-----------|-------------|----------------|
| **Reutilización de código** | 95%+ | ~30% (solo TS core) | 0% (rewrite total) |
| **Tiempo a App Store** | 2-3 semanas | 2-3 meses | 4-6 meses |
| **Performance sliders/charts** | Buena (WKWebView) | Excelente | Excelente |
| **HealthKit** | Plugin community | Plugin community | Nativo directo |
| **Apple Watch** | Custom bridge Swift | Custom bridge | Nativo directo |
| **Mantenimiento** | 1 codebase web+iOS | 2 codebases | 3 codebases |
| **App Store approval** | ✅ (WKWebView OK) | ✅ | ✅ |

### 2.2 Decisión: Arquitectura Híbrida

```
┌─────────────────────────────────────────────────────────────┐
│                      ESTRATEGIA                             │
│                                                             │
│  iPhone App  = Capacitor (React existente en WKWebView)     │
│               La app web COMPLETA corre sin modificaciones  │
│               funcionales. Solo ajustes CSS menores         │
│               (safe areas, touch targets, viewport).        │
│               + Plugins nativos Swift para HealthKit        │
│               + WatchConnectivity bridge                    │
│               + Push Notifications, Apple Sign-In, Haptics  │
│                                                             │
│  Apple Watch = SwiftUI nativo (COMPLEMENTO limitado)        │
│               NO es una réplica del iPhone. Es:             │
│               - Glance rápido (Ω, Λ, verdict)              │
│               - Input de datos (7 sliders de dominio)       │
│               - Sensor data (HealthKit on-watch)            │
│               - Complication en watch face                  │
│               + Core engine portado a Swift (~500 líneas)   │
│               + WatchConnectivity ↔ iPhone                  │
│               + URLSession directo a Supabase (fallback)    │
│                                                             │
│  Web         = Sin cambios (Nginx/M5 como está)             │
└─────────────────────────────────────────────────────────────┘
```

**Principio clave**: El iPhone ejecuta la aplicación COMPLETA tal cual.
El motor TypeScript, recharts, i18next, Supabase, Monte Carlo, CBWA —
**todo funciona sin cambios en WKWebView**. Un iPhone moderno tiene
poder de sobra para todo el pipeline. No se modifica funcionalidad,
solo se añaden capas nativas (HealthKit, Watch, notificaciones).

**Justificación**: Máxima velocidad de entrega (99% del código existente funciona sin cambios), mínimo riesgo, Apple Watch nativo por necesidad (no soporta WebView).

---

## III. INVENTARIO COMPLETO DE DATOS APPLE WATCH

### 3.0 Sensores de Hardware

| Sensor | Qué mide | Colección | Modelo |
|--------|----------|-----------|--------|
| **Optical Heart Sensor (3rd gen)** | FC, HRV, SpO₂ | Pasiva continua | S6+ |
| **Electrical Heart Sensor** | ECG (electrocardiograma) | Usuario inicia | S4+ |
| **Blood Oxygen Sensor** | Saturación O₂ sangre | Pasiva periódica | S6+ |
| **Temperature Sensor** | Temp. muñeca nocturna | Pasiva nocturna | S8+ |
| **High-g Accelerometer** | Movimiento, pasos, caídas | Pasiva continua | All |
| **High Dynamic Range Gyroscope** | Rotación, orientación | Pasiva continua | All |
| **Always-On Altimeter** | Altitud barométrica, pisos | Pasiva continua | S6+ |
| **GPS (L1 + L5 dual Ultra)** | Ubicación, distancia, ruta | Durante ejercicio | All |
| **Compass** | Dirección magnética | App abierta | S5+ |
| **Ambient Light Sensor** | Nivel de luz | Pasiva continua | All |
| **3-Microphone Array** | Audio ambiental, ruido dB | Pasiva monitored | All |
| **Depth Gauge (Ultra)** | Profundidad bajo agua | Automático | Ultra |
| **Water Temperature (Ultra)** | Temp. del agua | Automático | Ultra |

### 3.1 Datos HealthKit Pasivos (Sin Intervención del Usuario)

| HKType Identifier | Dato | Unidad | Frecuencia |
|-------------------|------|--------|------------|
| `heartRate` | Frecuencia cardíaca | bpm | ~5 min + ejercicio |
| `restingHeartRate` | FC en reposo | bpm | 1x/día |
| `walkingHeartRateAverage` | FC promedio caminando | bpm | 1x/día |
| `heartRateVariabilitySDNN` | Variabilidad cardíaca HRV | ms | ~1x/día (sueño) |
| `heartRateRecoveryOneMinute` | Recuperación post-ejercicio | bpm | Post-workout |
| `oxygenSaturation` | SpO₂ sangre | % | Periódico + nocturno |
| `bodyTemperature` | Temperatura muñeca | °C | Nocturno (S8+) |
| `respiratoryRate` | Frecuencia respiratoria | resp/min | Nocturno |
| `stepCount` | Pasos | count | Continuo |
| `distanceWalkingRunning` | Distancia caminando/corriendo | m | Continuo |
| `flightsClimbed` | Pisos subidos | count | Continuo |
| `activeEnergyBurned` | Calorías activas | kcal | Continuo |
| `basalEnergyBurned` | Calorías basales | kcal | Continuo |
| `appleExerciseTime` | Minutos de ejercicio | min | Continuo |
| `appleStandTime` | Tiempo de pie | min | Cada hora |
| `vo2Max` | VO₂ max estimado | mL/kg/min | Semanal |
| `walkingSpeed` | Velocidad al caminar | m/s | Continuo (S9+) |
| `walkingStepLength` | Longitud de zancada | m | Continuo (S9+) |
| `walkingAsymmetryPercentage` | Asimetría de marcha | % | Continuo (S9+) |
| `walkingDoubleSupportPercentage` | Doble apoyo al caminar | % | Continuo |
| `sleepAnalysis` | Etapas sueño (REM/Deep/Core) | category | Nocturno auto |
| `appleStandHour` | ¿Se paró esta hora? | bool | Cada hora |
| `environmentalAudioExposure` | Ruido ambiental | dB | Continuo |
| `headphoneAudioExposure` | Audio auriculares | dB | Durante uso |

### 3.2 Datos HealthKit Iniciados por Usuario

| HKType Identifier | Dato | Trigger |
|-------------------|------|---------|
| `electrocardiogram` | ECG (ritmo sinusal, AFib) | Toque corona 30seg |
| `mindfulSession` | Sesión mindfulness | App Breathe/Mindfulness |
| `mood` | Estado de ánimo (watchOS 11) | State of Mind logging |
| `emotion` | Emoción momentánea (watchOS 11) | State of Mind logging |
| `distanceSwimming` | Distancia natación | Workout app |
| `swimmingStrokeCount` | Brazadas | Workout app |
| `underwaterDepth` | Profundidad (Ultra) | Dive mode |
| `waterTemperature` | Temp. agua (Ultra) | Dive mode |
| `runningPower` | Potencia al correr | Workout running |
| `runningGroundContactTime` | Tiempo contacto suelo | Workout running |
| `runningVerticalOscillation` | Oscilación vertical | Workout running |
| `runningStrideLength` | Longitud zancada corriendo | Workout running |

### 3.3 Mapeo Completo → 28 Dimensiones LOGOS

| # | Dimensión | HKType(s) | Auto? | Fórmula 0→1 | Confianza |
|---|-----------|-----------|-------|-------------|-----------|
| | **◈ CUERPO (Physical)** | | | | |
| 1 | **sleep** | `sleepAnalysis` (stages + duration) | ✅ | `quality = 0.6 * min(1, hrs/8) + 0.2 * deepRatio + 0.2 * remRatio` | **Alta** |
| 2 | **nutrition** | `dietaryEnergyConsumed` + macros | ⚠️ | Solo si usuario logea en Apple Health | **Baja** |
| 3 | **exercise** | `appleExerciseTime` + `activeEnergyBurned` | ✅ | `min(1, exerciseMin / 30)` | **Alta** |
| 4 | **energy** | `restingHeartRate` (inv) + `vo2Max` + `activeEnergy` | ✅ | `0.5 * clamp((80-RHR)/30) + 0.3 * clamp(vo2/50) + 0.2 * activityFactor` | **Media-Alta** |
| | **◇ EMOCIONES (Emotional)** | | | | |
| 5 | **peace** | `heartRateVariabilitySDNN` + `respiratoryRate` | ✅ | `0.7 * min(1, HRV/100) + 0.3 * clamp((20-RR)/10)` | **Media** |
| 6 | **gratitude** | `mood` (State of Mind, watchOS 11) | ⚠️ | Si mood ≥ "pleasant" → proxy 0.6-0.9 | **Media** (si logea) |
| 7 | **love** | — | ❌ | Manual (irreducible) | — |
| 8 | **joy** | `emotion` (State of Mind, watchOS 11) | ⚠️ | Si emotion tagged "happy/excited" → proxy | **Media** (si logea) |
| | **⟐ MENTE (Mental)** | | | | |
| 9 | **clarity** | `HRV` + `respiratoryRate` + `sleepAnalysis` (deep%) | ⚠️ | `0.4*HRV_norm + 0.3*sleepQuality + 0.3*RR_calm` | **Baja-Media** |
| 10 | **focus** | `appleStandHour` + session durations | ⚠️ | Proxy indirecto | **Baja** |
| 11 | **creativity** | — | ❌ | Manual | — |
| 12 | **wisdom** | — | ❌ | Manual | — |
| | **✦ ESPÍRITU (Spiritual)** | | | | |
| 13 | **faith** | — | ❌ | Manual (teológicamente irreducible) | — |
| 14 | **meditation** | `mindfulSession` | ✅ | `min(1, mindfulMin / 20)` | **Alta** |
| 15 | **service** | — | ❌ | Manual | — |
| 16 | **presence** | `mindfulSession` + bajo phone pickup | ⚠️ | Proxy parcial | **Baja** |
| | **⬡ RELACIONES (Relational)** | | | | |
| 17-20 | **family, friendship, community, compassion** | — | ❌ | Manual (intersubjetivo) | — |
| | **◎ PROPÓSITO (Purpose)** | | | | |
| 21-24 | **meaning, mission, contribution, legacy** | — | ❌ | Manual (existencial) | — |
| | **⚘ ALIMENTO SAGRADO (Sacred Food)** | | | | |
| 25 | **nourishment** | `dietaryProtein` + `dietaryFatTotal` + `dietaryCarbs` | ⚠️ | Balance macros si logea | **Baja** |
| 26-28 | **taste_presence, food_harmony, gut_resonance** | — | ❌ | Manual (fenomenológico) | — |

### 3.4 DATOS BONUS: Sensores No-Mapeados a Dims pero Integrados al Motor

Estos datos del Watch NO corresponden a ninguna de las 28 dimensiones pero alimentan directamente las **7 capas del motor de consciencia**:

| Dato Watch | HKType | Capa del Motor | Integración | Efecto |
|-----------|--------|----------------|-------------|--------|
| **ECG irregular rhythm** | `electrocardiogram` | L2: Levin Signals | Nueva señal "Arritmia Detectada" | Trigger urgente: "Consulta médico, reduce stress" |
| **ECG AFib detection** | `electrocardiogram` | L6: Policy π(x) | Override a PAUSA si AFib | Seguridad: forzar pausa ante riesgo cardíaco |
| **SpO₂ < 95%** | `oxygenSaturation` | L1: Free Energy F(x) | `F(x) *= 1 + (0.95 - SpO₂) * 5` | Amplifica energía libre (cuerpo fuera de homeostasis) |
| **SpO₂ < 90%** | `oxygenSaturation` | L2: Levin Signals | Nueva señal "Oxigenación Baja" | Alerta urgente de salud |
| **Temperatura nocturna anómala** | `bodyTemperature` | L3: Watson Energy | `watson.optimal.physical *= tempFactor` | Modula paisaje energético (enfermedad = meta-estable) |
| **Temp. desvío > 1°C** | `bodyTemperature` | L2: Levin Signals | Nueva señal "Posible Enfermedad" | "Tu cuerpo combate algo, prioriza descanso" |
| **VO₂ max trend** | `vo2Max` | L3: Watson Energy | `watson.optimal.physical` ceiling | Ajusta techo realista de ejercicio y energía |
| **VO₂ max declining** | `vo2Max` | L4: Hoffman Biases | Nuevo bias "Optimismo Físico" | "Tu fitness cardiovascular baja, pero te calificas alto" |
| **Ruido > 80dB prolongado** | `environmentalAudioExposure` | L5: Coherence C(x) | `coherence *= max(0.7, 1 - (dB-80)/40)` | Ruido excesivo reduce coherencia |
| **Ruido > 90dB** | `environmentalAudioExposure` | L2: Levin Signals | Nueva señal "Ambiente Tóxico" | "Sal de ese ambiente o usa protección auditiva" |
| **Walking asymmetry > 15%** | `walkingAsymmetryPercentage` | L2: Levin Signals | Nueva señal "Desequilibrio Físico" | "Asimetría de marcha detectada, revisa postura/lesión" |
| **Walking speed declining** | `walkingSpeed` | L4: Hoffman Biases | Bias "Fitness Overestimation" | Contrasta auto-reporte vs datos objetivos |
| **HR Recovery lenta** | `heartRateRecoveryOneMinute` | L1: Free Energy | `F(x) *= 1 + max(0, (recovery - 20) / 40)` | Pobre recuperación = más energía libre |
| **HR Recovery < 12bpm** | `heartRateRecoveryOneMinute` | L2: Levin Signals | Nueva señal "Recuperación Cardíaca Lenta" | "Tu corazón tarda en recuperarse, reduce intensidad" |
| **Resting HR trend up** | `restingHeartRate` | L3: Watson Energy | Shift optimal physical landscape | Si RHR sube tendencia → estrés crónico detectado |
| **Sleep Deep% < 15%** | `sleepAnalysis` (deep stage ratio) | L4: Hoffman Biases | Bias "Sleep Quality Illusion" | "Dormiste 8h pero solo 10% profundo" |
| **Sleep REM% < 20%** | `sleepAnalysis` (REM stage ratio) | L2: Levin Signals | Signal "Sueño No Restaurativo" | "Poco REM afecta tu procesamiento emocional" |
| **Flights climbed trend** | `flightsClimbed` | L3: Watson | Modula exercise ceiling | Actividad NEAT (non-exercise activity) |
| **State of Mind: mood** | `mood` (watchOS 11) | L4: Hoffman Biases | Comparar mood reportado vs HRV/HR | Detectar incongruencia emocional |
| **State of Mind: emotion** | `emotion` (watchOS 11) | Derived: Ω | Factor emocional en Omega ponderado | Enriquece Ω con dato subjetivo-asistido |
| **Steps declining trend** | `stepCount` (7-day avg) | L3: Watson Energy | Shift en paisaje energético físico | Sedentarismo progresivo detectado |

### 3.5 Resumen de Automatización Actualizado

```
DIMENSIONES (28 total):
  ✅ Auto (alta confianza):      5 dims  (18%)  — sleep, exercise, energy, peace, meditation
  ⚠️ Semi-auto (si logea/proxy): 6 dims  (21%)  — nutrition, gratitude, joy, clarity, presence, nourishment
  ❌ Manual (irreducible):       17 dims  (61%)  — espirituales, relacionales, propósito, alimento

DATOS BONUS PARA EL MOTOR (no-dims):
  🔬 Señales Levin nuevas:       8 señales  — ECG, SpO₂, temp, asimetría, HR recovery, sueño, ruido
  ⚡ Moduladores Free Energy:     3 inputs   — SpO₂, HR recovery, ruido
  🏔 Watson landscape shifts:     4 inputs   — VO₂ max, temp, RHR trend, steps trend
  🔍 Hoffman bias detectors:      4 biases   — fitness overestimation, sleep illusion, mood incongruence, VO₂ decline
  🌀 Coherence modulators:        1 input    — noise exposure

TOTAL DATOS APPLE WATCH INTEGRADOS AL MOTOR: 20+ data streams
TOTAL SEÑALES HEALTHKIT LEÍDAS:               ~35 HKTypes
```

### 3.6 Arquitectura del HealthKit Data Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLE WATCH SENSORS                          │
│  HR | HRV | SpO₂ | Temp | Accel | Gyro | Alt | Mic | GPS      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HealthKit writes
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HEALTHKIT STORE (iPhone)                     │
│  ~35 HKTypes sincronizados automáticamente                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ @capacitor-community/health
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              LOGOS HealthKit Bridge (nuevo módulo)              │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Dimension Mapper │  │ Bonus Signal Gen │  │ Trend Analyzer│ │
│  │ HK → 11 dims     │  │ HK → 8 Levin    │  │ 7-day rolling │ │
│  │ (5 auto + 6 semi)│  │ + 3 F(x) mods   │  │ avg + slopes  │ │
│  │                  │  │ + 4 Watson shifts│  │               │ │
│  │                  │  │ + 4 Hoffman bias │  │               │ │
│  │                  │  │ + 1 Coherence    │  │               │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
└───────────┼──────────────────────┼───────────────────┼─────────┘
            │                      │                   │
            ▼                      ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│              LOGOS 7-LAYER CONSCIOUSNESS ENGINE                 │
│                                                                 │
│  L7: Λ Logos Alignment ←── dimensions (auto-populated)         │
│  L1: F(x) Free Energy ←── SpO₂, HR Recovery modulators        │
│  L2: Levin Signals    ←── 8 nuevas señales biométricas         │
│  L3: Watson Landscape ←── VO₂, temp, RHR, steps shifts        │
│  L4: Hoffman Biases   ←── 4 incongruence detectors            │
│  L5: Coherence C(x)   ←── noise exposure modulator            │
│  L6: Policy π(x)      ←── ECG AFib override                   │
│                                                                 │
│  → Ω Omega (enriched with Watch data)                          │
│  → Q Trajectory (with objective baselines)                     │
│  → Monte Carlo (sigma calibrated by Watch variance)            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.7 Fórmulas de Integración Watch → Motor (Detalle Técnico)

```typescript
// HealthKitBridge.ts — Nuevo módulo para src/core/

interface WatchBiometrics {
  // Pasivos
  heartRate: number;           // bpm
  restingHeartRate: number;    // bpm
  hrv: number;                 // ms SDNN
  spo2: number;                // % (0-100)
  bodyTemp: number;            // °C
  bodyTempBaseline: number;    // °C (promedio 14 días)
  respiratoryRate: number;     // resp/min
  sleepHours: number;          // horas
  sleepDeepPct: number;        // 0-1
  sleepRemPct: number;         // 0-1
  exerciseMinutes: number;     // min hoy
  activeEnergyBurned: number;  // kcal hoy
  vo2Max: number;              // mL/kg/min
  vo2MaxTrend: number;         // slope 30 días
  walkingAsymmetry: number;    // % (0-100)
  walkingSpeed: number;        // m/s
  walkingSpeedTrend: number;   // slope 30 días
  stepsToday: number;          // count
  steps7dayAvg: number;        // count
  flightsClimbed: number;      // count
  noiseExposure: number;       // dB
  hrRecovery1min: number;      // bpm drop
  rhrTrend: number;            // slope 14 días
  // User-initiated
  ecgResult: 'normal' | 'afib' | 'inconclusive' | null;
  mindfulMinutes: number;      // min hoy
  moodScore: number | null;    // -2 to +2 (State of Mind)
  emotionTag: string | null;   // 'happy', 'sad', 'anxious', etc.
}

// === DIMENSION AUTO-POPULATION ===

function mapWatchToDimensions(bio: WatchBiometrics): Partial<ConsciousnessState> {
  return {
    sleep:      0.6 * clamp(bio.sleepHours / 8) 
              + 0.2 * bio.sleepDeepPct / 0.25      // 25% deep = optimal
              + 0.2 * bio.sleepRemPct / 0.25,       // 25% REM = optimal
    
    exercise:   clamp(bio.exerciseMinutes / 30),
    
    energy:     0.5 * clamp((80 - bio.restingHeartRate) / 30) 
              + 0.3 * clamp(bio.vo2Max / 50) 
              + 0.2 * clamp(bio.activeEnergyBurned / 500),
    
    peace:      0.7 * clamp(bio.hrv / 100) 
              + 0.3 * clamp((20 - bio.respiratoryRate) / 10),
    
    meditation: clamp(bio.mindfulMinutes / 20),
  };
}

// === LEVIN SIGNAL GENERATION (8 nuevas) ===

function watchLevinSignals(bio: WatchBiometrics): LevinSignal[] {
  const signals: LevinSignal[] = [];
  
  if (bio.ecgResult === 'afib')
    signals.push({ type: 'ECG_AFIB', severity: 1.0, 
      desc: 'Fibrilación auricular detectada por ECG',
      action: 'Consulta cardiólogo inmediatamente' });
  
  if (bio.spo2 < 90)
    signals.push({ type: 'SPO2_CRITICAL', severity: 0.9,
      desc: `SpO₂ = ${bio.spo2}% (crítico)`,
      action: 'Busca aire fresco, si persiste busca atención médica' });
  else if (bio.spo2 < 95)
    signals.push({ type: 'SPO2_LOW', severity: 0.5,
      desc: `SpO₂ = ${bio.spo2}% (bajo)`,
      action: 'Mejora ventilación, realiza respiración profunda' });
  
  if (Math.abs(bio.bodyTemp - bio.bodyTempBaseline) > 1.0)
    signals.push({ type: 'TEMP_ANOMALY', severity: 0.6,
      desc: `Temp. nocturna desvío ${(bio.bodyTemp - bio.bodyTempBaseline).toFixed(1)}°C`,
      action: 'Tu cuerpo puede estar combatiendo algo, prioriza descanso' });
  
  if (bio.walkingAsymmetry > 15)
    signals.push({ type: 'GAIT_ASYMMETRY', severity: 0.4,
      desc: `Asimetría de marcha ${bio.walkingAsymmetry}%`,
      action: 'Revisa postura, calzado, o posible lesión' });
  
  if (bio.hrRecovery1min < 12)
    signals.push({ type: 'HR_RECOVERY_SLOW', severity: 0.5,
      desc: `Recuperación cardíaca lenta (${bio.hrRecovery1min} bpm/min)`,
      action: 'Reduce intensidad de ejercicio, mejora sueño' });
  
  if (bio.noiseExposure > 90)
    signals.push({ type: 'NOISE_TOXIC', severity: 0.6,
      desc: `Exposición a ${bio.noiseExposure} dB (tóxico)`,
      action: 'Sal de ese ambiente o usa protección auditiva' });
  
  if (bio.sleepRemPct < 0.15)
    signals.push({ type: 'SLEEP_LOW_REM', severity: 0.4,
      desc: `Solo ${(bio.sleepRemPct*100).toFixed(0)}% REM (necesitas >20%)`,
      action: 'Reduce alcohol/cafeína, mantén horario de sueño regular' });
  
  if (bio.sleepDeepPct < 0.10)
    signals.push({ type: 'SLEEP_LOW_DEEP', severity: 0.5,
      desc: `Solo ${(bio.sleepDeepPct*100).toFixed(0)}% sueño profundo`,
      action: 'Reduce pantallas 1h antes de dormir, enfría habitación' });
  
  return signals;
}

// === FREE ENERGY MODULATORS ===

function modulateFreeEnergy(F: number, bio: WatchBiometrics): number {
  let modulated = F;
  
  // SpO₂ bajo = cuerpo fuera de homeostasis → más energía libre
  if (bio.spo2 < 95)
    modulated *= 1 + (0.95 - bio.spo2 / 100) * 5;
  
  // HR Recovery pobre = sistema estresado
  if (bio.hrRecovery1min < 20)
    modulated *= 1 + Math.max(0, (20 - bio.hrRecovery1min) / 40);
  
  return modulated;
}

// === COHERENCE MODULATOR ===

function modulateCoherence(C: number, bio: WatchBiometrics): number {
  // Ruido excesivo reduce coherencia
  if (bio.noiseExposure > 80)
    return C * Math.max(0.7, 1 - (bio.noiseExposure - 80) / 40);
  return C;
}

// === HOFFMAN BIAS DETECTORS ===

function watchHoffmanBiases(bio: WatchBiometrics, 
                            state: ConsciousnessState): HoffmanBias[] {
  const biases: HoffmanBias[] = [];
  
  // Sleep illusion: reporta sueño alto pero calidad baja
  if (state.sleep > 0.7 && bio.sleepDeepPct < 0.15)
    biases.push({ type: 'SLEEP_QUALITY_ILLUSION',
      desc: `Reportas sueño ${(state.sleep*100).toFixed(0)}% pero solo ${(bio.sleepDeepPct*100).toFixed(0)}% fue profundo`,
      correction: 'Tu percepción sobreestima la calidad de tu descanso' });
  
  // Fitness overestimation: VO₂ bajando pero reporta ejercicio alto
  if (state.exercise > 0.7 && bio.vo2MaxTrend < -0.5)
    biases.push({ type: 'FITNESS_OVERESTIMATION',
      desc: 'Tu VO₂ max baja pero reportas ejercicio alto',
      correction: 'Quizás la intensidad no es suficiente o falta variedad' });
  
  // Mood incongruence: HRV bajo pero reporta paz alta
  if (state.peace > 0.7 && bio.hrv < 30)
    biases.push({ type: 'EMOTIONAL_INCONGRUENCE',
      desc: `Reportas paz ${(state.peace*100).toFixed(0)}% pero tu HRV es ${bio.hrv.toFixed(0)}ms (muy bajo)`,
      correction: 'Tu cuerpo muestra estrés que tu mente no registra' });
  
  // Energy overestimation: RHR subiendo pero reporta energía alta
  if (state.energy > 0.7 && bio.rhrTrend > 0.5)
    biases.push({ type: 'ENERGY_OVERESTIMATION',
      desc: 'Tu FC en reposo sube (tendencia 14d) pero reportas energía alta',
      correction: 'Estrés crónico puede enmascarar fatiga real' });
  
  return biases;
}

// === POLICY OVERRIDE ===

function watchPolicyOverride(policy: InhibitionPolicy, 
                             bio: WatchBiometrics): InhibitionPolicy {
  // ECG AFib → forzar PAUSA (seguridad)
  if (bio.ecgResult === 'afib') {
    return {
      ...policy,
      verdict: 'PAUSA',
      reason: 'Fibrilación auricular detectada — prioriza tu salud cardíaca',
      color: '#ef4444',
      icon: '🫀'
    };
  }
  
  // SpO₂ < 90% → forzar PAUSA
  if (bio.spo2 < 90) {
    return {
      ...policy,
      verdict: 'PAUSA',
      reason: `SpO₂ crítico (${bio.spo2}%) — busca atención médica`,
      color: '#ef4444',
      icon: '🫁'
    };
  }
  
  return policy;
}
```

**Nota epistemológica**: Las dimensiones espirituales (faith, service), relacionales (family, friendship, community, compassion), de propósito (meaning, mission, contribution, legacy), y de alimento sagrado (taste_presence, food_harmony, gut_resonance) son **teológicamente irreducibles a sensores**. El Apple Watch enriquece el motor con datos objetivos del cuerpo, pero la consciencia integral requiere la introspección deliberada del sujeto. El Watch complementa, no reemplaza.

---

## IV. DISEÑO DEL APPLE WATCH APP

### 4.1 Filosofía de Diseño

> **El Apple Watch es una interfaz de datos y glance, NO una réplica de la app.**

Principios:
1. **Burst interactions** — 10-15 segundos máximo por interacción
2. **Glanceable** — Ω, Λ, π(Λ̇) visibles en un vistazo
3. **Input rápido** — 7 sliders (uno por dominio, promedio de 4 dims)
4. **Sensor-first** — Auto-populate lo que se pueda
5. **Sync reliable** — WatchConnectivity + URLSession fallback

### 4.2 Pantallas del Watch

```
┌─────────────────────────────────────────────┐
│            COMPLICATION (Watch Face)         │
│                                             │
│  ┌───────────────────┐                      │
│  │   Ω 0.612         │  GraphicCircular     │
│  │   ● ACTÚA         │  Progress ring + text│
│  └───────────────────┘                      │
│                                             │
│  Tap → abre app                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│            HOME (al abrir app)              │
│                                             │
│  ╔═══════════════════════════════════╗       │
│  ║        Ω CONSCIOUSNESS           ║       │
│  ║           0.612                   ║       │
│  ║     ◉◉◉◉◉◉◉○○○  61%            ║       │
│  ╚═══════════════════════════════════╝       │
│                                             │
│  Λ LOGOS      0.540   ████████░░            │
│  V VIABILITY  0.601   █████████░            │
│  S ENTROPY    0.420   ██████░░░░            │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │  π(Λ̇) = ● ACTÚA               │        │
│  │  "Condiciones favorables"       │        │
│  └─────────────────────────────────┘        │
│                                             │
│  [📝 Quick Input]  [❤️ HealthKit Sync]      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          QUICK INPUT (7 dominios)           │
│                                             │
│  Swipe horizontal entre 7 páginas:          │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │  ◈ CUERPO          Page 1/7    │        │
│  │                                 │        │
│  │  Sleep    ░░░░░████░░  62% 🔒  │  🔒=HK │
│  │  Nutrition░░░░░░██░░░  45%     │        │
│  │  Exercise ░░░░░░████░  70% 🔒  │        │
│  │  Energy   ░░░░░███░░░  55% 🔒  │        │
│  │                                 │        │
│  │  ── Domain avg: 58% ──         │        │
│  │                                 │        │
│  │  [✓ Confirmar]                  │        │
│  └─────────────────────────────────┘        │
│                                             │
│  Digital Crown = ajustar slider seleccionado│
│  Tap slider = seleccionar                   │
│  🔒 = auto-populated desde HealthKit        │
│  Swipe left/right = siguiente dominio       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          QUICK MODE (alternativo)           │
│                                             │
│  Para input ultra-rápido (< 30 seg total):  │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │  ¿Cómo te sientes HOY?         │        │
│  │                                 │        │
│  │  ◈ Cuerpo      ████░░  65%     │        │
│  │  ◇ Emociones   ███░░░  50%     │        │
│  │  ⟐ Mente       █████░  75%     │        │
│  │  ✦ Espíritu    ████░░  60%     │        │
│  │  ⬡ Relaciones  ███░░░  55%     │        │
│  │  ◎ Propósito   ████░░  65%     │        │
│  │  ⚘ Alimento    ███░░░  50%     │        │
│  │                                 │        │
│  │  Digital Crown = ajustar        │        │
│  │  [✓ Enviar a LOGOS]             │        │
│  └─────────────────────────────────┘        │
│                                             │
│  Cada slider = promedio del dominio         │
│  Se distribuye equitativamente a 4 dims     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              NOTIFICATIONS                  │
│                                             │
│  Tipos:                                     │
│  1. Morning reminder (configurable 7-9am)   │
│     "☀ Buenos días. ¿Cómo amaneciste?"     │
│     → Tap abre Quick Input                  │
│                                             │
│  2. Lambda alert (Λ < 0.25 por 2+ días)     │
│     "⚠ Tu Λ ha bajado. ¿Momento de         │
│      reconectar con el Logos?"              │
│     → Tap abre meditación sugerida          │
│                                             │
│  3. Weekly digest (domingo 8pm)             │
│     "📊 Tu semana: Ω promedio 0.58          │
│      Mejor día: Martes (Λ=0.72)"           │
│     → Tap abre resumen en iPhone            │
└─────────────────────────────────────────────┘
```

### 4.3 Complication Design

| Tipo | Familia | Contenido | Actualización |
|------|---------|-----------|---------------|
| **GraphicCircular** | All sizes | Progress ring Ω + verdict color | Cada 15 min |
| **GraphicRectangular** | Large | Ω value + Λ bar + verdict text | Cada 15 min |
| **GraphicCorner** | All sizes | Ω number + verdict icon | Cada 15 min |

Colores del verdict en complication:
- 🟢 ACTÚA = `#10b981`
- 🟡 MONITOREA = `#f59e0b`  
- 🟠 ESPERA = `#f97316`
- 🟣 RECONECTA = `#a855f7`
- 🔴 PAUSA = `#ef4444`

---

## V. DISEÑO DEL iOS APP (CAPACITOR)

### 5.1 Estado Actual de Compatibilidad iPhone

La app ya funciona en pantallas de iPhone (375-430px). Fixes anteriores ya aplicados:
- ✅ Header subtitle overlap con settings → corregido (paddingRight)
- ✅ Theory sidebar responsive → corregido (stacks <640px)
- ✅ Settings button visible y con label → corregido

Ajustes menores pendientes para Capacitor (Fase 0, 2-3 días):

| Área | Estado | Ajuste Necesario |
|------|--------|-----------------|
| **Layout general** | ✅ Funciona | Solo `env(safe-area-inset-*)` |
| **Tab navigation** | ✅ flexWrap funciona | Sin cambios |
| **Sliders** | ✅ HTML range inputs funcionan en WKWebView | Añadir haptic feedback via plugin |
| **Charts** | ✅ Recharts SVG funciona en WKWebView | Sin cambios |
| **Touch targets** | ⚠️ Verificar | Mínimo 44×44px (Apple HIG) |
| **Viewport** | ⚠️ Falta | `viewport-fit=cover`, `user-scalable=no` |
| **Safe areas** | ⚠️ Falta | `env(safe-area-inset-*)` para notch |

**La funcionalidad NO se modifica. Todo corre como está.**

### 5.2 Capacitor Configuration

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.cadenastrategic.logos',
  appName: 'LOGOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#06060f',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#06060f',
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'logos',
  },
};

export default config;
```

### 5.3 Plugins Capacitor Requeridos

| Plugin | Propósito | Oficial? |
|--------|----------|----------|
| `@capacitor/core` | Core runtime | ✅ |
| `@capacitor/ios` | iOS platform | ✅ |
| `@capacitor/push-notifications` | Push notifications | ✅ |
| `@capacitor/status-bar` | Status bar dark mode | ✅ |
| `@capacitor/splash-screen` | Splash screen | ✅ |
| `@capacitor/haptics` | Haptic feedback sliders | ✅ |
| `@capacitor/local-notifications` | Morning reminder | ✅ |
| `@capacitor/app` | App lifecycle | ✅ |
| `@capacitor-community/health` | HealthKit read/write | Community |
| Custom Swift plugin | WatchConnectivity | Custom build |

### 5.4 Flujo de Auth en Capacitor

```
1. App launch → Check Supabase session (JWT en SecureStorage)
2. Si no hay sesión:
   a. "Sign in with Apple" (ASAuthorizationController nativo) → Supabase
   b. "Sign in with Google" (Supabase OAuth web flow en SFSafariViewController)
   c. "Continue as Guest" (localStorage only, sin sync)
3. Post-auth → Sync profiles, sessions, snapshots
4. Deep link: logos://callback → handle OAuth redirect
```

**Apple Sign-In**: Requiere plugin nativo `@capacitor-community/apple-sign-in` para usar ASAuthorizationController en vez de web OAuth (requisito Apple para apps nativas).

---

## VI. SWIFT CORE ENGINE (WATCHOS)

### 6.1 Port Strategy

El motor TypeScript se porta a Swift como un módulo standalone:

```swift
// LOGOSEngine.swift — Port of src/core/ to Swift
// ~500 lines total

import Foundation

// MARK: - Types
struct ConsciousnessState {
    // 28 dimensions, all Double 0...1
    var sleep: Double = 0.5
    var nutrition: Double = 0.5
    var exercise: Double = 0.5
    var energy: Double = 0.5
    var peace: Double = 0.5
    var gratitude: Double = 0.5
    var love: Double = 0.5
    var joy: Double = 0.5
    var clarity: Double = 0.5
    var focus: Double = 0.5
    var creativity: Double = 0.5
    var wisdom: Double = 0.5
    var faith: Double = 0.5
    var meditation: Double = 0.5
    var service: Double = 0.5
    var presence: Double = 0.5
    var family: Double = 0.5
    var friendship: Double = 0.5
    var community: Double = 0.5
    var compassion: Double = 0.5
    var meaning: Double = 0.5
    var mission: Double = 0.5
    var contribution: Double = 0.5
    var legacy: Double = 0.5
    var nourishment: Double = 0.5
    var taste_presence: Double = 0.5
    var food_harmony: Double = 0.5
    var gut_resonance: Double = 0.5
}

enum Verdict: String {
    case actua = "ACTÚA"
    case monitorea = "MONITOREA"
    case espera = "ESPERA"
    case reconecta = "RECONECTA"
    case pausa = "PAUSA"
}

struct EngineResult {
    let lambda: Double
    let omega: Double
    let viability: Double
    let entropy: Double
    let coherence: Double
    let freeEnergy: Double
    let trajectory: Double
    let verdict: Verdict
}

// MARK: - Engine
struct LOGOSEngine {
    static func compute(_ state: ConsciousnessState) -> EngineResult {
        let lambda = computeLambda(state)
        let viability = computeViability(state, lambda: lambda)
        let entropy = computeEntropy(state, lambda: lambda)
        let coherence = computeCoherence(state, lambda: lambda)
        let freeEnergy = computeFreeEnergy(state, lambda: lambda)
        let omega = computeOmega(lambda, v: viability, s: entropy, 
                                  c: coherence, f: freeEnergy)
        let trajectory = computeQ(lambda, v: viability, s: entropy)
        let verdict = inhibitionPolicy(lambda, v: viability, 
                                        s: entropy, c: coherence)
        
        return EngineResult(
            lambda: lambda, omega: omega,
            viability: viability, entropy: entropy,
            coherence: coherence, freeEnergy: freeEnergy,
            trajectory: trajectory, verdict: verdict
        )
    }
    
    // ... (implementations mirror TypeScript exactly)
}
```

### 6.2 Shared Swift Package

```
LOGOSCore/                   # Swift Package (shared iPhone + Watch)
├── Package.swift
├── Sources/LOGOSCore/
│   ├── Models.swift          # ConsciousnessState, EngineResult, etc.
│   ├── LOGOSEngine.swift     # 7-layer pipeline
│   ├── HealthKitBridge.swift # HK → ConsciousnessState mapping
│   └── SupabaseClient.swift  # URLSession + JWT → Supabase REST
└── Tests/LOGOSCoreTests/
    └── EngineTests.swift     # Parity tests vs TypeScript
```

Este Swift Package se usa tanto por:
- La extensión nativa del Capacitor iOS app (para WatchConnectivity)
- La app watchOS standalone

### 6.3 Parity Testing

```swift
// EngineTests.swift — Verify Swift engine matches TypeScript exactly
func testParityWithTypeScript() {
    let state = ConsciousnessState() // all 0.5
    let result = LOGOSEngine.compute(state)
    
    // These values MUST match src/core/__tests__/pipeline.test.ts
    XCTAssertEqual(result.lambda, 0.500, accuracy: 0.001)
    XCTAssertEqual(result.omega, 0.400, accuracy: 0.001)
    // ... all 555 test cases ported
}
```

---

## VII. COMUNICACIÓN IPHONE ↔ APPLE WATCH

### 7.1 Arquitectura de Sync

```
┌──────────────────┐         ┌──────────────────┐
│   iPhone App     │         │   Apple Watch     │
│   (Capacitor)    │         │   (SwiftUI)       │
│                  │         │                   │
│  ┌────────────┐  │  WC     │  ┌─────────────┐ │
│  │ Native     │◄─┼────────►┼─►│ WCSession   │ │
│  │ Extension  │  │ sync    │  │ Delegate    │ │
│  │ (Swift)    │  │         │  └─────────────┘ │
│  └─────┬──────┘  │         │         │        │
│        │ Bridge   │         │         ▼        │
│  ┌─────▼──────┐  │         │  ┌─────────────┐ │
│  │ Capacitor  │  │         │  │ LOGOSEngine │ │
│  │ WebView    │  │         │  │ (Swift)     │ │
│  │ (React)    │  │         │  └─────────────┘ │
│  └─────┬──────┘  │         │         │        │
│        │         │         │         ▼        │
│  ┌─────▼──────┐  │         │  ┌─────────────┐ │
│  │ Supabase   │  │         │  │ URLSession  │ │
│  │ JS SDK     │  │         │  │ → Supabase  │ │
│  └────────────┘  │         │  └─────────────┘ │
└──────────────────┘         └──────────────────┘
```

### 7.2 Datos Sincronizados

| Dirección | Datos | Método | Frecuencia |
|-----------|-------|--------|------------|
| Watch → iPhone | 28 dim values (quick input) | `WCSession.transferUserInfo` | Por input |
| Watch → iPhone | HealthKit snapshot | `WCSession.updateApplicationContext` | Cada 15 min |
| iPhone → Watch | EngineResult (Ω, Λ, verdict) | `WCSession.updateApplicationContext` | Por cambio |
| iPhone → Watch | User preferences | `WCSession.updateApplicationContext` | Por cambio |
| Watch → Supabase | Session data (fallback) | `URLSession` background | Si iPhone no disponible |

### 7.3 Custom Capacitor Plugin (WatchConnectivity)

```swift
// ios/App/App/WatchBridgePlugin.swift
import Capacitor
import WatchConnectivity

@objc(WatchBridgePlugin)
public class WatchBridgePlugin: CAPPlugin {
    private var session: WCSession?
    
    override public func load() {
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }
    
    @objc func sendState(_ call: CAPPluginCall) {
        guard let state = call.getObject("state") else {
            call.reject("Missing state")
            return
        }
        session?.transferUserInfo(state)
        call.resolve()
    }
    
    @objc func getWatchData(_ call: CAPPluginCall) {
        // Return latest watch input from applicationContext
        if let ctx = session?.receivedApplicationContext {
            call.resolve(ctx as! [String: Any])
        } else {
            call.resolve([:])
        }
    }
}
```

---

## VIII. PLAN DE IMPLEMENTACIÓN — FASES

### FASE 0: Ajustes CSS para Capacitor (2-3 días)

**Objetivo**: Ajustes CSS mínimos para que la app se vea nativa en iPhone. 
La funcionalidad NO se toca — todo el motor, charts, tabs, sliders ya funcionan.

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 0.1 | **Safe areas** — `env(safe-area-inset-*)` para notch/Dynamic Island | 1h |
| 0.2 | **Viewport meta** — `viewport-fit=cover`, `user-scalable=no` | 30min |
| 0.3 | **Touch targets** — Verificar botones ≥44×44px (la mayoría ya cumple) | 1h |
| 0.4 | **Status bar** — Confirmar que el dark theme no choca con iOS status bar | 30min |
| 0.5 | **Test en Safari iOS** — Device testing real en iPhone | 1h |

**Nota**: La app ya es responsive (header fix, theory sidebar fix hechos en sesión anterior). No se necesita refactoring de layout ni bottom tab bar — la UI actual funciona bien en pantallas de iPhone (375-430px). Los cambios son solo de compatibilidad con el shell nativo de Capacitor.

**Entregable**: App verificada corriendo bien en Safari iOS, lista para wrappear.

### FASE 1: Capacitor iOS Setup (1 semana)

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 1.1 | `npm install @capacitor/core @capacitor/cli @capacitor/ios` | 30min |
| 1.2 | `npx cap init` + `capacitor.config.ts` | 1h |
| 1.3 | `npx cap add ios` + configurar Xcode project | 2h |
| 1.4 | App icons (1024×1024 + all sizes) | 2h |
| 1.5 | Splash screen (launch storyboard) | 2h |
| 1.6 | Apple Sign-In nativo (`@capacitor-community/apple-sign-in`) | 4h |
| 1.7 | Google Sign-In OAuth redirect flow | 2h |
| 1.8 | Push notifications (`@capacitor/push-notifications`) | 3h |
| 1.9 | Haptic feedback en sliders (`@capacitor/haptics`) | 1h |
| 1.10 | Local notifications (morning reminder) | 2h |
| 1.11 | Status bar + navigation bar dark mode | 1h |
| 1.12 | Test en device físico (iPhone) | 3h |

**Entregable**: LOGOS corriendo como app iOS nativa desde Xcode.

### FASE 2: HealthKit Integration + Watch Engine Bridge (2 semanas)

**Sub-fase 2A: HealthKit Read + Dimension Mapping (semana 1)**

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 2.1 | Install `@capacitor-community/health` | 1h |
| 2.2 | HealthKit entitlements en Xcode (~35 HKTypes read permissions) | 2h |
| 2.3 | Permission request flow (onboarding step con explicación clara) | 3h |
| 2.4 | Read sleep data (stages + duration) → `sleep` con fórmula compuesta | 3h |
| 2.5 | Read exercise minutes + activeEnergy → `exercise` | 2h |
| 2.6 | Read RHR + VO₂ max + activeEnergy → `energy` (multi-factor) | 3h |
| 2.7 | Read HRV + respiratoryRate → `peace` (dual-factor) | 2h |
| 2.8 | Read mindful minutes → `meditation` | 2h |
| 2.9 | Read State of Mind mood/emotion → `gratitude`/`joy` proxies | 3h |
| 2.10 | UI indicators (🔒 icon) for auto-populated dims | 2h |
| 2.11 | User override toggle (manual vs HealthKit per dimension) | 2h |
| 2.12 | Background delivery registration for all ~35 HKTypes | 3h |

**Sub-fase 2B: Watch Bonus Data → Engine Integration (semana 2)**

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 2.13 | Create `src/core/healthkit-bridge.ts` (WatchBiometrics interface) | 3h |
| 2.14 | Implement `watchLevinSignals()` — 8 new biometric signals | 4h |
| 2.15 | Implement `modulateFreeEnergy()` — SpO₂ + HR Recovery mods | 2h |
| 2.16 | Implement `modulateCoherence()` — noise exposure mod | 1h |
| 2.17 | Implement `watchHoffmanBiases()` — 4 incongruence detectors | 3h |
| 2.18 | Implement `watchPolicyOverride()` — ECG AFib + SpO₂ critical → PAUSA | 2h |
| 2.19 | Watson landscape shifts (VO₂, temp, RHR trend, steps trend) | 3h |
| 2.20 | Trend analyzer (7-day/14-day/30-day rolling averages + slopes) | 4h |
| 2.21 | Integrate all Watch modules into `useLogosEngine.ts` pipeline | 3h |
| 2.22 | UI: Show Watch-generated Levin signals with biometric icons | 3h |
| 2.23 | UI: Show Hoffman Watch biases with objective vs subjective comparison | 3h |
| 2.24 | Test con Apple Watch paired (all ~35 HKTypes flowing) | 4h |

**Entregable**: 5-8 dimensiones auto-populated + 20 data streams feeding engine layers.

### FASE 3: Apple Watch App (2-3 semanas)

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 3.1 | Create watchOS target en Xcode | 2h |
| 3.2 | Swift Package: `LOGOSCore` (Models + Engine) | 8h |
| 3.3 | Parity tests (Swift vs TypeScript) | 4h |
| 3.4 | **Home screen** — Ω, Λ, V, S, verdict | 4h |
| 3.5 | **Quick Input** — 7 domain sliders (page-based swipe) | 8h |
| 3.6 | **Quick Mode** — 7 single sliders (compact) | 4h |
| 3.7 | **Complication** — GraphicCircular + GraphicRectangular | 6h |
| 3.8 | HealthKit on Watch (sleep, exercise, HR, HRV, mindful) | 6h |
| 3.9 | WatchConnectivity: Watch → iPhone sync | 6h |
| 3.10 | WatchConnectivity: iPhone → Watch sync | 4h |
| 3.11 | URLSession → Supabase (fallback when iPhone not reachable) | 4h |
| 3.12 | Notifications (morning, alert, weekly) | 4h |
| 3.13 | Digital Crown integration for sliders | 3h |
| 3.14 | Haptic feedback on verdict changes | 1h |
| 3.15 | Test en Apple Watch físico | 4h |

**Entregable**: Apple Watch app con input, glance, complication, y sync.

### FASE 4: App Store Submission (1 semana)

| Task | Descripción | Esfuerzo |
|------|-------------|----------|
| 4.1 | Apple Developer Program enrollment ($99/año) | 1h |
| 4.2 | App Store Connect: crear app listing | 2h |
| 4.3 | Screenshots (iPhone 6.7", 6.1", Watch 45mm, 41mm) | 4h |
| 4.4 | App description, keywords, categories | 2h |
| 4.5 | Privacy nutrition labels | 2h |
| 4.6 | `NSHealthShareUsageDescription` + privacy policy URL | 2h |
| 4.7 | Archive + upload via Xcode | 1h |
| 4.8 | TestFlight beta (internal) | 2h |
| 4.9 | TestFlight beta (external, 10 users) | 3h |
| 4.10 | Address review feedback | 4h |
| 4.11 | Submit for App Store review | 1h |

**Entregable**: LOGOS en el App Store.

---

## IX. TIMELINE TOTAL

```
Día 1-3:    FASE 0 — Ajustes CSS mínimos (safe areas, viewport, touch targets)
Semana 1:   FASE 1 — Capacitor iOS Setup (app completa corriendo en iPhone)
Semana 2:   FASE 2A — HealthKit Read + Dimension Mapping (5 auto-dims)
Semana 3:   FASE 2B — Watch Bonus Data → Engine Integration (20+ streams)
Semana 4-5: FASE 3 — Apple Watch App (SwiftUI + Engine Port + Complications)
Semana 6:   FASE 4 — App Store Submission + TestFlight
Semana 7:   Buffer — Fix review feedback + polish

TOTAL: 6-7 semanas

NOTA: La app COMPLETA corre en el iPhone sin cambios funcionales.
El Watch es un complemento para glance + input rápido + sensores.
```

---

## X. CONSIDERACIONES APP STORE

### 10.1 Categoría

**Health & Fitness** (primary) / **Lifestyle** (secondary)

### 10.2 App Store Guidelines — Health Apps

| Requisito | Cómo cumplimos |
|-----------|---------------|
| No claims médicos sin evidencia | LOGOS es "wellness tracker", no herramienta médica |
| Disclaimer claro | "This app does not provide medical advice" |
| HealthKit justificación | "Reads sleep, exercise, heart rate to auto-populate your wellness dimensions" |
| Privacy policy URL | Requerido — crear en logoilab.com/privacy |
| Data collection transparency | Nutrition labels: Analytics (NO), Health (YES, HealthKit), Contact Info (email) |
| Reproducibility disclaimers | Monte Carlo: "Statistical simulation for educational purposes" |

### 10.3 Nombres Protegidos

- **App Name**: "LOGOS — Consciousness OS" o "LOGOS Humano"
- **Bundle ID**: `com.cadenastrategic.logos`
- **Watch Bundle**: `com.cadenastrategic.logos.watchkitapp`

### 10.4 Monetización (futuro)

| Tier | Contenido | Precio |
|------|----------|--------|
| Free | 28 sliders, 7 métricas, semáforo, guía diaria | $0 |
| Premium | Monte Carlo, CBWA, trayectoria, HealthKit auto, Watch | $4.99/mes |
| Pro | Agente de voz (ElevenLabs), API WhatsApp, reportes semanales | $9.99/mes |

---

## XI. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| WKWebView performance con 28 sliders + recharts | Media | Alto | Debounce, lazy loading, reduce re-renders |
| Apple rechaza por "health claims" | Baja | Alto | Disclaimer claro, categorizar como wellness |
| WatchConnectivity unreliable | Media | Medio | URLSession fallback directo a Supabase |
| ElevenLabs Web Audio en WKWebView | Alta | Bajo | Disable voz en iOS v1, enable en v2 |
| HealthKit permisos denegados por usuario | Alta | Bajo | Graceful degradation → sliders manuales |
| Swift engine parity con TypeScript | Baja | Alto | 555 test cases portados |

---

## XII. ARCHIVOS A CREAR/MODIFICAR

### Nuevos archivos

```
logos/
├── capacitor.config.ts                    # Capacitor config
├── ios/                                   # Generated by `npx cap add ios`
│   └── App/App/
│       ├── WatchBridgePlugin.swift        # WatchConnectivity custom plugin
│       ├── WatchBridgePlugin.m            # Objective-C bridge
│       └── Info.plist                     # HealthKit entitlements
├── watch/                                 # watchOS app
│   ├── LOGOSWatch.xcodeproj
│   ├── LOGOSWatch/
│   │   ├── LOGOSWatchApp.swift           # Entry point
│   │   ├── ContentView.swift             # Home (Ω, Λ, verdict)
│   │   ├── QuickInputView.swift          # 7-domain page input
│   │   ├── QuickModeView.swift           # Compact 7-slider
│   │   ├── ComplicationController.swift  # Watch face complications
│   │   └── HealthKitManager.swift        # HK queries on Watch
│   └── LOGOSWatch Extension/
│       └── ExtensionDelegate.swift       # Background tasks
├── packages/logos-core-swift/             # Shared Swift Package
│   ├── Package.swift
│   ├── Sources/LOGOSCore/
│   │   ├── Models.swift
│   │   ├── Engine.swift
│   │   ├── HealthKitBridge.swift
│   │   └── SupabaseClient.swift
│   └── Tests/LOGOSCoreTests/
│       └── EngineParityTests.swift
└── docs/
    └── PLAN_LOGOS_iOS_APPLE_WATCH.md     # Este documento
```

### Archivos a modificar

```
src/components/LogosHumano.jsx   # Mobile-first refactoring (Phase 0) + Watch signal UI
src/App.jsx                      # Capacitor lifecycle hooks
src/App.css                      # Safe areas, responsive
src/services/api.js              # Capacitor storage fallback
src/hooks/useLogosEngine.ts      # Integrate Watch biometrics into 7-layer pipeline
src/core/levin.ts                # Merge watchLevinSignals with existing signals
src/core/friston.ts              # Add modulateFreeEnergy (SpO₂, HR Recovery)
src/core/penrose.ts              # Add modulateCoherence (noise exposure)
src/core/hoffman.ts              # Add watchHoffmanBiases (4 incongruence detectors)
src/core/policy.ts               # Add watchPolicyOverride (ECG AFib, SpO₂ critical)
src/core/watson.ts               # Watson landscape shifts (VO₂, temp, RHR, steps)
src/core/index.ts                # Export new healthkit-bridge module
src/types/index.ts               # Add WatchBiometrics + WatchEngineResult types
package.json                     # Capacitor dependencies
index.html                       # viewport-fit=cover
```

### Nuevos módulos TypeScript (Fase 2B)

```
src/core/healthkit-bridge.ts     # WatchBiometrics interface + all mapping functions
src/core/trend-analyzer.ts       # 7/14/30-day rolling averages + slope calculation
src/hooks/useHealthKit.ts        # React hook: Capacitor ↔ HealthKit ↔ WatchBiometrics
src/hooks/useWatchBridge.ts      # React hook: WatchConnectivity ↔ Capacitor plugin
```

---

## XIII. CRITERIOS DE ÉXITO

| Métrica | Target |
|---------|--------|
| Time to App Store | ≤ 7 semanas |
| iPhone app performance (Lighthouse) | ≥ 90 performance score |
| Watch complication update latency | < 15 minutos |
| Watch Quick Input time | < 30 segundos para 7 dominios |
| HealthKit dimension auto-population | 5-8/28 dimensiones sin input manual |
| HealthKit bonus data streams | 20+ streams feeding 7 engine layers |
| Watch Levin signals (biometric) | 8 nuevas señales operativas |
| Watch Hoffman biases (incongruence) | 4 detectores subjetivo vs objetivo |
| HKTypes read permissions | ~35 tipos configurados |
| Parity Swift ↔ TypeScript | 100% (555+ tests passing) |
| App Store approval | Primera submission |
| TestFlight crash rate | < 0.1% |

---

## XIV. PRÓXIMOS PASOS INMEDIATOS

1. ☐ Revisar y aprobar este plan
2. ☐ Apple Developer Program enrollment ($99/año)
3. ☐ Comenzar FASE 0: Mobile-First Refactoring
4. ☐ Crear repositorio para `logos-core-swift` package

---

*"La tarea de todo sistema vivo — desde una célula hasta un alma — es sintonizarse con la señal y minimizar el ruido."*

**Cadena Strategic Systems © 2026**
