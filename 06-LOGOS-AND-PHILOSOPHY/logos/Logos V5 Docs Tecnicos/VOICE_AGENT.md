# AGENTE DE VOZ LOGOS — ElevenLabs Conversational AI

> **Documento:** SRS-VOICE-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 42010  
> **Versión:** 3.2.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura del Agente](#2-arquitectura-del-agente)
3. [Client Tools — Lectura](#3-client-tools--lectura)
4. [Client Tools — Escritura](#4-client-tools--escritura)
5. [Client Tools — Evaluación](#5-client-tools--evaluación)
6. [Client Tools — Avanzados](#6-client-tools--avanzados)
7. [Configuración del Agente](#7-configuración-del-agente)
8. [Mapeo de Variables (SPANISH_TO_KEY)](#8-mapeo-de-variables-spanish_to_key)
9. [Validación de Escritura](#9-validación-de-escritura)
10. [Interfaz de Usuario (Orbe)](#10-interfaz-de-usuario-orbe)
11. [Problemas Conocidos y Soluciones](#11-problemas-conocidos-y-soluciones)

---

## 1. Visión General

El agente de voz LOGOS es un orbe flotante que permite al usuario interactuar con el sistema mediante voz natural. Utiliza **ElevenLabs Conversational AI** con **15 client tools** que leen y modifican el estado de la app en tiempo real.

**Componente:** `src/components/LogosVoiceAgent.jsx`  
**Configuración:** `src/config/logosAgent.js`  
**Dependencia:** `@elevenlabs/react` v0.14.x  
**Agent ID:** Configurado vía `VITE_ELEVENLABS_AGENT_ID`

---

## 2. Arquitectura del Agente

```
┌──────────────────────────────────────────┐
│           ElevenLabs Cloud               │
│  Agent LLM: decides tool calls + speech  │
└──────────────────┬───────────────────────┘
                   │ WebSocket (audio + tool calls)
                   ▼
┌──────────────────────────────────────────┐
│     LogosVoiceAgent.jsx (React)          │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │    15 Client Tools (useCallback) │     │
│  │                                  │     │
│  │  READ:                           │     │
│  │  ├── getCurrentDateTime          │     │
│  │  ├── getFullState                │     │
│  │  ├── getMetrics                  │     │
│  │  ├── getVerdict                  │     │
│  │  ├── getCurrentTab               │     │
│  │  ├── getTrajectory               │     │
│  │  └── detectCrisis                │     │
│  │                                  │     │
│  │  WRITE:                          │     │
│  │  ├── setSliderValue              │     │
│  │  ├── navigateToTab               │     │
│  │  ├── highlightDomain             │     │
│  │  └── triggerSimulation           │     │
│  │                                  │     │
│  │  EVALUATE:                       │     │
│  │  └── evaluateDecision            │     │
│  │                                  │     │
│  │  ADVANCED:                       │     │
│  │  ├── scheduleCalendarEvent       │     │
│  │  ├── getSessionReport            │     │
│  │  └── generateWeeklyReport        │     │
│  └─────────────────────────────────┘     │
│                                          │
│  Props from LogosHumano.jsx:             │
│  ├── sliderValues (= state)             │
│  ├── metrics (Λ, Ω, V, S, C, F, Q)     │
│  ├── verdict, activeTab, history        │
│  ├── sessionHistory, user, accessToken  │
│  ├── onUpdateSlider → updateDim()       │
│  ├── onNavigateTab → setActiveTab()     │
│  ├── onHighlightDomain                  │
│  └── onRunSimulation → handleRunMC()    │
└──────────────────────────────────────────┘
```

---

## 3. Client Tools — Lectura

### 3.1 `getCurrentDateTime`

Devuelve fecha, hora, día de la semana, mes, año, ISO, timezone y timestamp en español.

**Retorno:** JSON string con campos `date`, `time`, `dayOfWeek`, `month`, `year`, `iso`, `timezone`, `timestamp`

### 3.2 `getFullState`

Lee las 28 dimensiones del estado actual con labels en español y keys internos.

**Retorno:** JSON object donde cada key es el nombre interno (e.g., `"sleep"`) y el valor es `{ label: "Sueño", value: 0.65 }`

**Ejemplo:**
```json
{
  "sleep": { "label": "Sueño", "value": 0.65 },
  "peace": { "label": "Paz Interior", "value": 0.42 },
  "nourishment": { "label": "Nutrición Consciente", "value": 0.55 }
}
```

### 3.3 `getMetrics`

Lee todas las métricas derivadas del motor.

**Retorno:** `{ "Λ Lambda": "0.523", "Ω Omega": "0.481", "V Viabilidad": "0.612", "S Entropía": "0.334", "C Coherencia": "0.589", "F Energía Libre": "0.276", "Q Trayectoria": "0.145" }`

### 3.4 `getVerdict`

Lee el veredicto actual de π(x).

**Retorno:** `{ verdict: "ACTÚA", lambda: "0.523", details: "V=0.61, S=0.33, C=0.59, Λ=0.52" }`

### 3.5 `getCurrentTab`

Pestaña activa del dashboard.

### 3.6 `getTrajectory`

Historial reciente (últimas 10 entradas) + sesiones anteriores + tendencia.

### 3.7 `detectCrisis`

Detecta si el usuario está en crisis (Λ < 0.20 por 2+ sesiones), warning, o estable.

---

## 4. Client Tools — Escritura

### 4.1 `setSliderValue({ variable, value })`

**Función más crítica.** Modifica una dimensión del estado.

**Pipeline de normalización:**
```
1. variable.toLowerCase().trim()
2. .normalize("NFD")                    ← descompone ñ, acentos
3. .replace(/[\u0300-\u036f]/g, "")     ← elimina diacríticos
4. SPANISH_TO_KEY[normalizedVar]        ← lookup del mapeo
5. Validación: key ∈ VARIABLE_LABELS    ← previene escritura a keys inválidos
6. onUpdateSlider(internalKey, numValue) ← actualiza estado React
```

**Validación de seguridad (v3.2.0):**
- Si el key resuelto **no existe** en `VARIABLE_LABELS`, retorna error con lista de variables válidas
- Previene la corrupción silenciosa del estado (bug pre-v3.2.0)

### 4.2 `navigateToTab({ tab })`

Navega a una pestaña del dashboard. Mapeo vía `TAB_MAP`.

### 4.3 `highlightDomain({ domain })`

Resalta visualmente un dominio. Mapeo vía `DOMAIN_MAP`.

### 4.4 `triggerSimulation()`

Ejecuta simulación Monte Carlo.

---

## 5. Client Tools — Evaluación

### 5.1 `evaluateDecision({ decision })`

Evalúa si el sistema está listo para una decisión importante basado en V > 0.55, S < 0.40, C > 0.45, Λ > 0.45.

---

## 6. Client Tools — Avanzados

### 6.1 `scheduleCalendarEvent({ title, description, dateTime, durationMinutes })`

Crea evento en Google Calendar vía OAuth token.

### 6.2 `getSessionReport()`

Genera reporte de sesiones: total, promedio Λ, tendencia, mejor/peor día.

### 6.3 `generateWeeklyReport()`

Reporte semanal: promedios Λ/Ω/V/S/C, cambio semana a semana, veredicto dominante.

### 6.4 `getAlimentoRecommendation()`

Recomendaciones de alimentos sagrados basadas en dimensiones deficientes.

---

## 7. Configuración del Agente

**Archivo:** `src/config/logosAgent.js`

### 7.1 VARIABLE_LABELS

Mapeo de keys internos (inglés) → etiquetas para el agente (español):

```javascript
{
  sleep: "Sueño", nutrition: "Nutrición", exercise: "Ejercicio", energy: "Energía",
  peace: "Paz Interior", gratitude: "Gratitud", love: "Amor", joy: "Alegría",
  clarity: "Claridad", focus: "Enfoque", creativity: "Creatividad", wisdom: "Sabiduría",
  faith: "Fe", meditation: "Meditación", service: "Servicio", presence: "Presencia",
  family: "Familia", friendship: "Amistades", community: "Comunidad", compassion: "Compasión",
  meaning: "Sentido", mission: "Misión", contribution: "Contribución", legacy: "Legado",
  nourishment: "Nutrición Consciente", taste_presence: "Presencia Gustativa",
  food_harmony: "Armonía Alimentaria", gut_resonance: "Resonancia Intestinal",
}
```

### 7.2 DOMAIN_MAP

```javascript
{
  "fisico": "physical", "emocional": "emotional", "mental": "mental",
  "espiritual": "spiritual", "relacional": "relational", "proposito": "purpose",
  "alimento": "alimento", "alimento sagrado": "alimento",
}
```

### 7.3 TAB_MAP

```javascript
{
  "estado": "estado", "dominios": "dominios", "capas": "capas",
  "trayectoria": "trayectoria", "montecarlo": "montecarlo",
  "teoria": "teoria", "manual": "manual",
}
```

---

## 8. Mapeo de Variables (SPANISH_TO_KEY)

Mapeo inverso completo: nombres en español (post-normalización NFD) → keys internos.

**Categorías de entradas:**

| Categoría | Ejemplos | Total |
|-----------|----------|-------|
| **Nombres principales** | sueno→sleep, paz→peace, energia→energy | 28 |
| **Nombres compuestos** | paz interior→peace, nutricion consciente→nourishment | 5 |
| **Plurales** | amistades→friendship | 1 |
| **Variantes de voz** | dormir→sleep, deporte→exercise, felicidad→joy | 15 |
| **Keys en inglés** | sleep→sleep, peace→peace | 28 |

**Total: ~77 entradas** que cubren todas las variaciones posibles.

### Variantes de Voz Incluidas

```javascript
"dormir": "sleep", "descanso": "sleep",
"comida": "nutrition", "alimentacion": "nutrition",
"deporte": "exercise", "actividad fisica": "exercise",
"tranquilidad": "peace", "serenidad": "peace",
"felicidad": "joy", "gozo": "joy",
"concentracion": "focus", "atencion": "focus",
"oracion": "faith", "proposito": "meaning",
"amigos": "friendship",
"alimento": "nourishment", "nutricion sagrada": "nourishment",
```

---

## 9. Validación de Escritura

### Bug pre-v3.2.0

Antes de v3.2.0, `setSliderValue` tenía 3 bugs críticos:

| Bug | Causa | Efecto |
|-----|-------|--------|
| **ñ normalization** | NFD strip convierte ñ→n, pero SPANISH_TO_KEY tenía "sueño" con ñ | Escrituras a "Sueño" creaban state["sueno"] (key inválido) |
| **Compound label** | "Paz Interior" normalizaba a "paz interior", solo existía "paz" | state["paz interior"] en vez de state["peace"] |
| **Plural mismatch** | Label "Amistades" ≠ SPANISH_TO_KEY "amistad" | state["amistades"] en vez de state["friendship"] |

**Consecuencia:** El agente reportaba "actualizado" pero el valor real no cambiaba.

### Fix v3.2.0

1. **SPANISH_TO_KEY expandido:** `"sueno"`, `"paz interior"`, `"amistades"` + 15 aliases de voz
2. **Validación explícita:** `if (!(internalKey in VARIABLE_LABELS))` → retorna error con lista de variables válidas
3. **getFullState mejorado:** Retorna `{ key: { label, value } }` para que el agente use keys internos

### Test de Validación

28/28 dimensiones pasan round-trip test:
```
Spanish label → normalize(NFD + strip) → SPANISH_TO_KEY lookup → validate → ✅
English key → normalize → SPANISH_TO_KEY lookup → validate → ✅
```

---

## 10. Interfaz de Usuario (Orbe)

El agente se presenta como un **orbe flotante** en la esquina inferior derecha del dashboard.

### Estados Visuales

| Estado | Visual | Descripción |
|--------|--------|-------------|
| **Inactivo** | Orbe púrpura con glow sutil | Esperando activación |
| **Activo** | Orbe púrpura pulsante | Escuchando al usuario |
| **Hablando** | Orbe dorado con ondas | El agente está respondiendo |
| **Texto** | Chat bubble minimizado | Modo texto (sin voz) |

### Props Recibidos de LogosHumano.jsx

| Prop | Tipo | Fuente |
|------|------|--------|
| `sliderValues` | `ConsciousnessState` | `state` (28 dimensiones) |
| `metrics` | `object` | `{ lambda, omega, V, S, C, F, Q }` |
| `verdict` | `string` | `pi.verdict` |
| `activeTab` | `string` | Tab activa del dashboard |
| `history` | `array` | Historial de la sesión actual |
| `sessionHistory` | `array` | Historial de sesiones anteriores |
| `user` | `object` | Datos del usuario autenticado |
| `accessToken` | `string` | Google OAuth token para Calendar |
| `onUpdateSlider` | `function` | `(variable, value) => updateDim(variable, value)` |
| `onNavigateTab` | `function` | `(tab) => setActiveTab(tab)` |
| `onHighlightDomain` | `function` | Resalta dominio 3 segundos |
| `onRunSimulation` | `function` | Ejecuta Monte Carlo |

---

## 11. Problemas Conocidos y Soluciones

| Problema | Estado | Solución |
|----------|--------|----------|
| ñ normalization bug | ✅ Fijado v3.2.0 | "sueno" añadido a SPANISH_TO_KEY |
| Compound label mismatch | ✅ Fijado v3.2.0 | "paz interior" añadido |
| Plural mismatch | ✅ Fijado v3.2.0 | "amistades" añadido |
| Silent state corruption | ✅ Fijado v3.2.0 | Validación contra VARIABLE_LABELS |
| Stale state in useCallback | ⚠️ Mitigado | Dependencies array incluye `sliderValues` |

---

## Referencias Cruzadas

- [COMPONENTS.md](./COMPONENTS.md) — Componente LogosVoiceAgent
- [API_REFERENCE.md](./API_REFERENCE.md) — Funciones del core engine
- [DATA_MODEL.md](./DATA_MODEL.md) — Estructura del estado
