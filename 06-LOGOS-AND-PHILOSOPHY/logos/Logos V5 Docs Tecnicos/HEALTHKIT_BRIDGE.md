# HEALTHKIT BRIDGE — Procesamiento Biométrico para LOGOS

> **Documento:** SRS-HKB-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 42010  
> **Versión:** 3.2.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura de 3 Capas](#2-arquitectura-de-3-capas)
3. [Capa 1: Plugin Nativo (Swift)](#3-capa-1-plugin-nativo-swift)
4. [Capa 2: React Hook (useHealthKit)](#4-capa-2-react-hook-usehealthkit)
5. [Capa 3: Bridge de Procesamiento](#5-capa-3-bridge-de-procesamiento)
6. [Interfaces TypeScript](#6-interfaces-typescript)
7. [Mapeo Biométricos → Dimensiones LOGOS](#7-mapeo-biométricos--dimensiones-logos)
8. [Sincronización y Cache](#8-sincronización-y-cache)

---

## 1. Visión General

El HealthKit Bridge es un pipeline de 3 capas que transforma datos biométricos crudos del Apple Watch en información procesable por el motor LOGOS:

```
HealthKit Store → LOGOSHealthKitPlugin (Swift) → useHealthKit (React) → healthkit-bridge (Core)
```

**Principio:** Datos objetivos del cuerpo → moduladores matemáticos → integración con autoevaluación subjetiva.

---

## 2. Arquitectura de 3 Capas

| Capa | Archivo | Lenguaje | Responsabilidad |
|------|---------|----------|-----------------|
| **1. Nativa** | `ios/App/App/LOGOSHealthKitPlugin.swift` | Swift | Acceso directo a HealthKit API |
| **2. Hook** | `src/hooks/useHealthKit.ts` | TypeScript | Orquestación, cache, estado React |
| **3. Bridge** | `src/core/healthkit-bridge.ts` | TypeScript | Procesamiento → moduladores LOGOS |

---

## 3. Capa 1: Plugin Nativo (Swift)

### LOGOSHealthKitPlugin.swift

**Tipo:** Plugin Capacitor (@objc)  
**Líneas:** ~538  
**HealthKit Types solicitados:** ~35

### Métodos Principales

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `isAvailable()` | Verifica disponibilidad HealthKit | `{ available: boolean }` |
| `requestAuthorization()` | Solicita permisos al usuario | `{ authorized: boolean }` |
| `readAllBiometrics()` | Lee todos los biométricos | `WatchBiometrics` JSON |
| `readHeartRate()` | Último heart rate | `{ value: number }` |
| `readHRV()` | Heart Rate Variability SDNN | `{ value: number }` |
| `readSleep()` | Análisis de sueño (6 categorías) | `SleepAnalysis` |
| `readECG()` | Último ECG | `ECGData` |
| `readStateOfMind()` | Estado mental (iOS 17+) | `StateOfMindData` |

### Tipos HealthKit Autorizados

**Quantity Types (lectura):**

| # | Tipo | Unidad | Uso en LOGOS |
|---|------|--------|-------------|
| 1 | heartRate | bpm | Free Energy mod, crisis detection |
| 2 | heartRateVariabilitySDNN | ms | Peace correlation, coherence mod |
| 3 | restingHeartRate | bpm | Energy estimation, Watson shift |
| 4 | walkingHeartRateAverage | bpm | Fitness assessment |
| 5 | oxygenSaturation | % | Policy override (< 90%), F mod |
| 6 | respiratoryRate | breaths/min | Stress indicator |
| 7 | stepCount | count | Physical domain shift |
| 8 | distanceWalkingRunning | m | Exercise estimation |
| 9 | activeEnergyBurned | kcal | Exercise estimation |
| 10 | appleExerciseTime | min | Exercise dimension mapping |
| 11 | vo2Max | mL/kg/min | Fitness level, Watson shift |
| 12 | bodyMass | kg | BMI calculation |
| 13 | bodyMassIndex | kg/m² | Health assessment |
| 14 | bodyFatPercentage | % | Body composition |
| 15 | leanBodyMass | kg | Body composition |
| 16 | bodyTemperature | °C | Anomaly detection, coherence mod |
| 17 | bloodPressureSystolic | mmHg | Cardiovascular health |
| 18 | bloodPressureDiastolic | mmHg | Cardiovascular health |
| 19 | bloodGlucose | mg/dL | Metabolic health |
| 20 | environmentalAudioExposure | dB | Noise → coherence mod |
| 21 | mindfulMinutes | min | Meditation dimension mapping |

**Category Types (lectura):**

| # | Tipo | Valores | Uso en LOGOS |
|---|------|---------|-------------|
| 22 | sleepAnalysis | InBed, Asleep, REM, Core, Deep, Awake | Sleep mapping, Hoffman bias |
| 23 | mindfulSession | duration | Meditation mapping |

**Electrocardiogram:**

| # | Tipo | Clasificación | Uso en LOGOS |
|---|------|---------------|-------------|
| 24 | electrocardiogramType | sinusRhythm, atrialFibrillation, inconclusive | Policy override (AFib → PAUSA) |

---

## 4. Capa 2: React Hook (useHealthKit)

### useHealthKit.ts

**Archivo:** `src/hooks/useHealthKit.ts`  
**Líneas:** ~227  
**Tipo:** Custom React Hook

### Estado Expuesto

```typescript
interface UseHealthKitReturn {
  available: boolean;         // HealthKit disponible en dispositivo
  authorized: boolean;        // Permisos otorgados
  biometrics: WatchBiometrics | null;  // Datos biométricos crudos
  ecg: ECGData | null;        // Último ECG
  lastSync: Date | null;      // Timestamp de última sincronización
  syncing: boolean;           // Sincronización en progreso
  autoPopulatedDimensions: Partial<ConsciousnessState>;  // Mapeo a dimensiones
  error: string | null;       // Error si existe
}
```

### Ciclo de Sincronización

```
1. Mount → checkAvailability()
2. Si disponible → requestAuthorization()
3. Si autorizado → syncBiometrics() (inmediato)
4. setInterval(syncBiometrics, 15 * 60 * 1000)  ← cada 15 minutos
5. Resultado → cache en localStorage('logos-healthkit-cache')
6. Expone biometrics, ecg, autoPopulatedDimensions
```

### mapBiometricsToDimensions()

Traduce biométricos crudos a dimensiones LOGOS (escala 0-1):

```typescript
function mapBiometricsToDimensions(bio: WatchBiometrics): Partial<ConsciousnessState> {
  return {
    sleep:      clamp(bio.sleepHours / 8, 0, 1),           // 8h = 1.0
    exercise:   clamp(bio.exerciseMinutes / 60, 0, 1),      // 60min = 1.0
    energy:     1 - clamp((bio.restingHeartRate - 50) / 40, 0, 1),  // RHR 50=1.0, 90=0.0
    peace:      clamp(bio.heartRateVariability / 100, 0, 1), // HRV 100ms = 1.0
    meditation: clamp(bio.mindfulMinutes / 30, 0, 1),        // 30min = 1.0
  };
}
```

---

## 5. Capa 3: Bridge de Procesamiento

### healthkit-bridge.ts

**Archivo:** `src/core/healthkit-bridge.ts`  
**Líneas:** ~415  
**Tipo:** Módulo core puro (sin dependencias React)

### Función Principal

```typescript
function processWatchBiometrics(
  biometrics: WatchBiometrics,
  ecg: ECGData | null,
  state: ConsciousnessState
): WatchEngineResult
```

### Sub-procesadores

| Función | Input | Output | Descripción |
|---------|-------|--------|-------------|
| `computeFreeEnergyMod()` | SpO₂, HRR, HRV, RHR | `{ totalMod, components[] }` | ΔF por estrés fisiológico |
| `computeCoherenceMod()` | Noise, sleep fragments, HRV, temp | `{ totalMod, components[] }` | ΔC por factores de dispersión |
| `computeWatsonShifts()` | VO₂, temp, RHR, steps, sleep | `[{ domain, shift, reason }]` | Δdomain por datos objetivos |
| `computePolicyOverride()` | ECG, SpO₂, HR | `{ active, reason, source }` | PAUSA forzada si crítico |
| `computeLevinSignals()` | All biometrics | `[{ label, severity, desc }]` | 8 señales biométricas |
| `computeHoffmanBiases()` | Biometrics + state | `[{ label, magnitude, ... }]` | 4 discrepancias subj/obj |

---

## 6. Interfaces TypeScript

### WatchBiometrics

```typescript
interface WatchBiometrics {
  heartRate?: number;
  heartRateVariability?: number;
  restingHeartRate?: number;
  walkingHeartRateAverage?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  stepCount?: number;
  distanceWalkingRunning?: number;
  activeEnergyBurned?: number;
  exerciseMinutes?: number;
  vo2Max?: number;
  sleepHours?: number;
  sleepREM?: number;
  sleepDeep?: number;
  sleepCore?: number;
  sleepAwakenings?: number;
  bodyMass?: number;
  bodyMassIndex?: number;
  bodyFatPercentage?: number;
  bodyTemperature?: number;
  environmentalAudioExposure?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodGlucose?: number;
  mindfulMinutes?: number;
}
```

### ECGData

```typescript
interface ECGData {
  classification: 'sinusRhythm' | 'atrialFibrillation' | 'inconclusive';
  averageHeartRate: number;
  samplingFrequency: number;
  startDate: string;
  voltages?: number[];
}
```

### StateOfMindData

```typescript
interface StateOfMindData {
  valence: number;        // -1 to 1 (negative to positive)
  labels: string[];       // e.g., ["happy", "grateful"]
  associations: string[]; // e.g., ["family", "work"]
}
```

---

## 7. Mapeo Biométricos → Dimensiones LOGOS

### Mapeo Directo (autoPopulatedDimensions)

| Biométrico | Dimensión | Fórmula | Justificación |
|-----------|-----------|---------|--------------|
| sleepHours | `sleep` | hours/8 | 8h es referencia CDC |
| exerciseMinutes | `exercise` | min/60 | OMS: 150min/semana ≈ 21min/día |
| restingHeartRate | `energy` | 1-(rhr-50)/40 | RHR bajo = alta eficiencia cardíaca |
| heartRateVariability | `peace` | hrv/100 | HRV alta = tono vagal alto = calma |
| mindfulMinutes | `meditation` | min/30 | 30min referencia contemplativa |

### Mapeo Indirecto (vía watchEngine modulators)

| Biométrico | Métrica LOGOS | Vía | Efecto |
|-----------|--------------|-----|--------|
| SpO₂ | F (Free Energy) | freeEnergyMod | SpO₂ baja → +F (más sorpresa) |
| VO₂ Max | Physical domain | watsonShifts | VO₂ alto → +physical |
| Deep Sleep | Physical domain | watsonShifts | Deep sleep alto → +physical |
| REM Sleep | Emotional domain | watsonShifts | REM bajo → -emotional |
| Noise | C (Coherence) | coherenceMod | >80dB → -C |
| ECG AFib | π(x) Verdict | policyOverride | AFib → PAUSA |

---

## 8. Sincronización y Cache

### Estrategia de Cache

```typescript
// Guardar
localStorage.setItem('logos-healthkit-cache', JSON.stringify({
  biometrics,
  ecg,
  timestamp: Date.now(),
}));

// Restaurar (si < 1 hora)
const cached = JSON.parse(localStorage.getItem('logos-healthkit-cache'));
if (cached && Date.now() - cached.timestamp < 3600000) {
  return cached;
}
```

### Frecuencia de Sincronización

| Contexto | Frecuencia | Justificación |
|----------|-----------|--------------|
| **Automático** | Cada 15 min | Balance entre actualidad y batería |
| **Manual** | On-demand | Botón "Sincronizar" en UI |
| **Startup** | Inmediato | Al montar useHealthKit |
| **Background** | Via BGTaskScheduler | `com.cadenastrategic.logos.healthsync` |

### Manejo de Errores

| Error | Manejo | Fallback |
|-------|--------|----------|
| HealthKit no disponible | `available = false` | Motor funciona sin biométricos |
| Permisos denegados | `authorized = false` | Motor funciona sin biométricos |
| Timeout de lectura | `error = "timeout"` | Usa última cache válida |
| Datos parciales | Campos `undefined` | Bridge ignora campos null |

---

## Referencias Cruzadas

- [BIOMETRIC_FEEDBACK_LOOP.md](./BIOMETRIC_FEEDBACK_LOOP.md) — Cómo los moduladores afectan al motor
- [APPLE_WATCH_ARCHITECTURE.md](./APPLE_WATCH_ARCHITECTURE.md) — Arquitectura del Watch companion
- [API_REFERENCE.md](./API_REFERENCE.md) — Funciones del core engine
