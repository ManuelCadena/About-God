# LOGOS v3.0 — PROPUESTA DE IMPLEMENTACIÓN

## Integración del Framework SINTONÍA × Alimento Sagrado

> **Documento:** RFC-LOGOS-005 — Implementation Blueprint  
> **Prerequisitos:** RFC-LOGOS-003 (Alimento Sagrado v3), RFC-LOGOS-004 (Convergencia SINTONÍA×LOGOS)  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Fecha:** 2026-02-07

---

## RESUMEN EJECUTIVO

Este documento traduce las propuestas filosóficas y matemáticas de RFC-003 y RFC-004 en un **plan de implementación concreto** con cambios archivo por archivo, nuevas funciones, y un workflow actualizado.

### Alcance del Cambio

| Métrica | v2.x (actual) | v3.0 (propuesto) | Delta |
|---------|---------------|-------------------|-------|
| **Dominios** | 6 | 7 (+Alimento) | +1 |
| **Dimensiones** | 24 | 28 (+4 nuevas) | +4 |
| **Señales Levin** | 6 | 8 (+2 nuevas) | +2 |
| **Sesgos Hoffman** | 5 | 7 (+2 nuevos) | +2 |
| **Métricas derivadas** | V, S, Ω, Q | V, S, Ω, Q, **R** | +1 |
| **Archivos core modificados** | — | 9 de 9 | 100% |
| **Archivos nuevos** | — | 1 (`src/core/resonance.ts`) | +1 |

---

## I. CAMBIOS POR ARCHIVO

### I.1 `src/types/index.ts` — Tipos Base

**Cambios:**

```typescript
// ANTES (línea 26):
export type DomainKey = 'physical' | 'emotional' | 'mental' | 'spiritual' | 'relational' | 'purpose';

// DESPUÉS:
export type DomainKey = 'physical' | 'emotional' | 'mental' | 'spiritual' | 'relational' | 'purpose' | 'alimento';
```

```typescript
// ANTES (líneas 33-45):
export type StateKey = 
  | 'sleep' | 'nutrition' | 'exercise' | 'energy'       // Physical
  | 'peace' | 'gratitude' | 'love' | 'joy'               // Emotional
  | 'clarity' | 'focus' | 'creativity' | 'wisdom'         // Mental
  | 'faith' | 'meditation' | 'service' | 'presence'       // Spiritual
  | 'family' | 'friendship' | 'community' | 'compassion'  // Relational
  | 'meaning' | 'mission' | 'contribution' | 'legacy';    // Purpose

// DESPUÉS:
export type StateKey = 
  | 'sleep' | 'breath' | 'exercise' | 'energy'            // Physical (nutrition → breath)
  | 'peace' | 'gratitude' | 'love' | 'joy'                // Emotional
  | 'clarity' | 'focus' | 'creativity' | 'wisdom'          // Mental
  | 'faith' | 'meditation' | 'service' | 'presence'        // Spiritual
  | 'family' | 'friendship' | 'community' | 'compassion'   // Relational
  | 'meaning' | 'mission' | 'contribution' | 'legacy'      // Purpose
  | 'nourishment' | 'taste_presence' | 'food_harmony' | 'gut_resonance'; // Alimento
```

**Nuevas interfaces a añadir:**

```typescript
// Resonance Result (new metric)
export interface ResonanceResult {
  value: number;          // R(x) ∈ [0, 1]
  gamma: number;          // Γ angular sync component
  thetaIntention: number; // θ_int (pre-meal emotional angle)
  thetaExperience: number;// θ_exp (post-meal emotional angle)
  alignmentPenalty: number;
  breakdown: {
    angularSync: number;
    domainMin: number;
    lambdaFactor: number;
  };
}

// Circumplex coordinates (derived from LOGOS emotional dims)
export interface CircumplexState {
  valence: number;   // V ∈ [0, 1] derived from peace, love, joy, gratitude
  arousal: number;   // A ∈ [0, 1] derived from energy, focus, sleep
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4'; // Russell Circumplex quadrant
  angle: number;     // θ = atan2(A - 0.5, V - 0.5)
}

// SINTONÍA integration data (received from ChefManny API)
export interface SintoniaInput {
  hi_meal: number;          // HI ∈ [0, 100]
  hi_integral?: number;     // HI_Integral with Γ bonus
  gamma_sync?: number;      // Γ(sync) value
  valence_meal?: number;    // V of the meal experience
  arousal_meal?: number;    // A of the meal experience
  quadrant_achieved?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}
```

---

### I.2 `src/domain/constants.ts` — Dominios y Dimensiones

**Cambios:**

```typescript
// Header comment update:
// 7 LIFE DOMAINS × 4 DIMENSIONS = 28 STATE DIMENSIONS

// Physical domain: nutrition → breath
physical: { 
  label: "Cuerpo", 
  icon: "◈", 
  color: "#10b981",
  dims: {
    sleep:    { label: "Sueño",       desc: "Calidad y duración del descanso",     tooltip: "¿Cuántas horas dormiste y qué tan reparador fue tu sueño?" },
    breath:   { label: "Respiración", desc: "Consciencia respiratoria y oxigenación", tooltip: "¿Respiraste conscientemente hoy? ¿Practicaste algún ejercicio de respiración?" },
    exercise: { label: "Movimiento",  desc: "Actividad física regular",            tooltip: "¿Hiciste algún tipo de ejercicio o movimiento físico hoy?" },
    energy:   { label: "Energía",     desc: "Vitalidad disponible percibida",      tooltip: "¿Qué tanta energía sientes para funcionar en tu día?" },
  }
},

// NEW 7th domain: Alimento (after purpose)
alimento: { 
  label: "Alimento", 
  icon: "⚘", 
  color: "#84cc16",
  dims: {
    nourishment:     { label: "Nutrición Consciente",  desc: "Calidad nutricional con intención", 
                       tooltip: "¿Qué necesita tu cuerpo hoy? ¿Comiste con intención nutritiva?" },
    taste_presence:  { label: "Presencia Gustativa",   desc: "Atención plena al comer",          
                       tooltip: "¿Cómo quieres sentirte después de comer? ¿Comiste con presencia?" },
    food_harmony:    { label: "Armonía Alimentaria",   desc: "Entorno sonoro y social al comer",  
                       tooltip: "¿Cómo fue tu entorno al comer? ¿Hubo música, silencio, compañía consciente?" },
    gut_resonance:   { label: "Resonancia Intestinal", desc: "Coherencia intestino-cerebro",      
                       tooltip: "¿Cómo responde tu cuerpo a lo que comiste? ¿Digestión ligera o pesada?" },
  }
},
```

**Nota:** Las primeras 3 preguntas del dominio Alimento son **proactivas** (paradigma SINTONÍA: "¿Cómo QUIERES sentirte?"), y la última (gut_resonance) es **reactiva** (feedback post-comida). Esto implementa el modelo Sístole-Diástole.

---

### I.3 `src/core/logos.ts` — Λ(x) Computation

**Cambios en `LOGOS_COMPONENTS`:**

```typescript
const LOGOS_COMPONENTS = {
  reception: {
    label: "Recepción del Canal",
    tooltip: "Qué tan abierto está tu canal para recibir la señal del Logos",
    items: [
      { key: "faith",          weight: 0.18, label: "Fe",              desc: "Apertura del canal" },
      { key: "meditation",     weight: 0.13, label: "Meditación",      desc: "Sintonización de frecuencia" },
      { key: "presence",       weight: 0.12, label: "Presencia",       desc: "Eliminación de ruido temporal" },
      { key: "taste_presence", weight: 0.05, label: "Presencia Gustativa", desc: "Consciencia encarnada vía alimento" },
      // ↑ NEW: taste_presence contributes to Reception (body receives the Logos through mindful eating)
    ]
  },
  action: {
    label: "Verificación por Acción",
    tooltip: "La señal se verifica cuando se traduce en acción amorosa",
    items: [
      { key: "service",       weight: 0.10, label: "Servicio",     desc: "Señal convertida en acción" },
      { key: "love",          weight: 0.10, label: "Amor",         desc: "La frecuencia más pura" },
      { key: "compassion",    weight: 0.07, label: "Compasión",    desc: "Empatía activa" },
      { key: "food_harmony",  weight: 0.03, label: "Armonía Alimentaria", desc: "Crear un entorno sagrado al nutrir" },
      // ↑ NEW: food_harmony as an act of sacred creation
    ]
  },
  decoding: {
    label: "Capacidad de Decodificación",
    tooltip: "Tu capacidad de interpretar correctamente la señal divina",
    items: [
      { key: "wisdom",  weight: 0.08, label: "Sabiduría",  desc: "Discernimiento profundo" },
      { key: "meaning", weight: 0.06, label: "Sentido",    desc: "Significado percibido" },
      { key: "clarity", weight: 0.04, label: "Claridad",   desc: "Nitidez de interpretación" },
    ]
  },
  gratitude: {
    label: "Reconocimiento de la Fuente",
    tooltip: "Gratitud como acknowledgment de que la señal viene del Logos",
    items: [
      { key: "gratitude", weight: 0.02, label: "Gratitud", desc: "Acknowledgment de la fuente" },
      { key: "breath",    weight: 0.02, label: "Respiración", desc: "El ritmo primordial de recepción" },
      // ↑ NEW: breath as the most basic rhythm of receiving
    ]
  }
};
// Total weights: 0.18+0.13+0.12+0.05 + 0.10+0.10+0.07+0.03 + 0.08+0.06+0.04 + 0.02+0.02 = 1.00 ✓
```

**Justificación de pesos redistribuidos:**

| Dim original | Peso original | Peso nuevo | Δ | Razón |
|---|---|---|---|---|
| faith | 0.20 | 0.18 | -0.02 | Cedido a taste_presence |
| meditation | 0.15 | 0.13 | -0.02 | Cedido a food_harmony |
| presence | 0.15 | 0.12 | -0.03 | Cedido a breath y taste_presence |
| service | 0.12 | 0.10 | -0.02 | Cedido a food_harmony |
| compassion | 0.08 | 0.07 | -0.01 | Cedido a breath |
| **taste_presence** | — | **0.05** | +0.05 | NUEVO: consciencia encarnada |
| **food_harmony** | — | **0.03** | +0.03 | NUEVO: creación sagrada |
| **breath** | — | **0.02** | +0.02 | NUEVO: ritmo primordial |

---

### I.4 `src/core/derived.ts` — V(x), S(x), Ω(x), Q(x)

**VIABILITY_WEIGHTS — actualizar:**

```typescript
const VIABILITY_WEIGHTS: Record<string, number> = {
  // Physical (nutrition → breath)
  sleep: 0.07, breath: 0.04, exercise: 0.05, energy: 0.05,
  // Emotional
  peace: 0.06, gratitude: 0.04, love: 0.05, joy: 0.04,
  // Mental
  clarity: 0.05, focus: 0.04, creativity: 0.03, wisdom: 0.04,
  // Spiritual
  faith: 0.04, meditation: 0.03, service: 0.03, presence: 0.04,
  // Relational
  family: 0.04, friendship: 0.03, community: 0.02, compassion: 0.03,
  // Purpose
  meaning: 0.03, mission: 0.03, contribution: 0.02, legacy: 0.02,
  // Alimento (NEW — 4 dims contributing to viability)
  nourishment: 0.05, taste_presence: 0.02, food_harmony: 0.02, gut_resonance: 0.04,
  // Total: 1.00 ✓ (was 1.00 with 24, redistributed across 28)
};
```

**ENTROPY_FACTORS — añadir:**

```typescript
const ENTROPY_FACTORS = [
  { key: "peace",          weight: 0.13, label: "Falta de Paz" },
  { key: "clarity",        weight: 0.10, label: "Falta de Claridad" },
  { key: "sleep",          weight: 0.10, label: "Falta de Sueño" },
  { key: "focus",          weight: 0.09, label: "Falta de Enfoque" },
  { key: "energy",         weight: 0.09, label: "Falta de Energía" },
  { key: "presence",       weight: 0.09, label: "Falta de Presencia" },
  { key: "wisdom",         weight: 0.07, label: "Falta de Sabiduría" },
  { key: "faith",          weight: 0.07, label: "Falta de Fe" },
  { key: "meaning",        weight: 0.07, label: "Falta de Sentido" },
  { key: "gratitude",      weight: 0.06, label: "Falta de Gratitud" },
  // NEW: gut dysbiosis increases entropy (80% vagal ascending signal)
  { key: "gut_resonance",  weight: 0.07, label: "Disbiosis Intestinal" },
  { key: "nourishment",    weight: 0.06, label: "Falta de Nutrición Consciente" },
  // Total: 1.00 ✓
];
```

**computeOmega — nueva línea de breakdown:**

```typescript
// Add Ω dynamic for SINTONÍA integration:
// Ω_dynamic = Lambda * 0.6 + derivedHealth * 0.4
// This value can be exported to SINTONÍA to replace the constant Ω=0.7
```

---

### I.5 `src/core/friston.ts` — F(x) Free Energy

**IDEALS — actualizar (nutrition → breath, add 4 alimento dims):**

```typescript
const IDEALS: Record<string, number> = {
  sleep: 0.85, breath: 0.75, exercise: 0.75, energy: 0.80,
  peace: 0.75, gratitude: 0.80, love: 0.75, joy: 0.70,
  clarity: 0.75, focus: 0.75, creativity: 0.65, wisdom: 0.70,
  faith: 0.70, meditation: 0.65, service: 0.60, presence: 0.70,
  family: 0.75, friendship: 0.65, community: 0.55, compassion: 0.70,
  meaning: 0.75, mission: 0.70, contribution: 0.65, legacy: 0.55,
  // Alimento domain ideals
  nourishment: 0.80,     // High — nutrition is fundamental
  taste_presence: 0.65,  // Moderate — not every meal is meditative
  food_harmony: 0.60,    // Moderate — aspiration, not constant
  gut_resonance: 0.75,   // High — body feedback should be good
};
```

**WEIGHTS — actualizar:**

```typescript
const WEIGHTS: Record<string, number> = {
  sleep: 0.07, breath: 0.04, exercise: 0.05, energy: 0.06,
  peace: 0.06, gratitude: 0.04, love: 0.05, joy: 0.04,
  clarity: 0.05, focus: 0.04, creativity: 0.03, wisdom: 0.04,
  faith: 0.04, meditation: 0.04, service: 0.03, presence: 0.04,
  family: 0.04, friendship: 0.03, community: 0.02, compassion: 0.03,
  meaning: 0.04, mission: 0.03, contribution: 0.02, legacy: 0.02,
  // Alimento domain weights
  nourishment: 0.05,     // Body needs fuel
  taste_presence: 0.03,  // Mindful eating
  food_harmony: 0.02,    // Environmental harmony
  gut_resonance: 0.04,   // Gut-brain feedback
  // Total: 1.00 ✓
};
```

---

### I.6 `src/core/watson.ts` — Energy Landscape

**Añadir dominio alimento al optimal:**

```typescript
const optimal: Record<string, number> = {
  physical:   0.70 + Lambda * 0.15,
  emotional:  0.65 + Lambda * 0.15,
  mental:     0.65 + Lambda * 0.15,
  spiritual:  0.60 + Lambda * 0.20,
  relational: 0.60 + Lambda * 0.15,
  purpose:    0.60 + Lambda * 0.20,
  // NEW: alimento optimal modulated by Lambda
  // Higher consciousness → higher food expectations
  alimento:   0.65 + Lambda * 0.15,
};
```

---

### I.7 `src/core/penrose.ts` — Coherence

**Añadir 7º dominio a la media armónica:**

```typescript
export function computeCoherence(s: ConsciousnessState, Lambda: number): CoherenceResult {
  const state = s as any;
  
  // Calculate domain averages — NOW 7 domains
  const physical   = (state.sleep + state.breath + state.exercise + state.energy) / 4;
  const emotional  = (state.peace + state.gratitude + state.love + state.joy) / 4;
  const mental     = (state.clarity + state.focus + state.creativity + state.wisdom) / 4;
  const spiritual  = (state.faith + state.meditation + state.service + state.presence) / 4;
  const relational = (state.family + state.friendship + state.community + state.compassion) / 4;
  const purpose    = (state.meaning + state.mission + state.contribution + state.legacy) / 4;
  const alimento   = (state.nourishment + state.taste_presence + state.food_harmony + state.gut_resonance) / 4;
  
  const vals = [physical, emotional, mental, spiritual, relational, purpose, alimento];
  
  // Harmonic mean with 7 values: a single collapsed domain still destroys coherence
  const rawCoherence = harmonicMean(vals);
  // ... rest unchanged
  
  return {
    coherence,
    rawCoherence,
    entropy: clamp(Math.sqrt(varianceVal) * 3),
    domains: { physical, emotional, mental, spiritual, relational, purpose, alimento },
    lambdaBoost,
    breakdown: [
      { label: "Cuerpo",      value: physical,   color: DOMAINS.physical.color },
      { label: "Emociones",   value: emotional,  color: DOMAINS.emotional.color },
      { label: "Mente",       value: mental,     color: DOMAINS.mental.color },
      { label: "Espíritu",    value: spiritual,  color: DOMAINS.spiritual.color },
      { label: "Relaciones",  value: relational, color: DOMAINS.relational.color },
      { label: "Propósito",   value: purpose,    color: DOMAINS.purpose.color },
      { label: "Alimento",    value: alimento,   color: DOMAINS.alimento.color },
    ]
  };
}
```

---

### I.8 `src/core/levin.ts` — Nuevas Señales Patológicas

**Añadir 2 señales:**

```typescript
// NEW: Enteric Dysbiosis — The body can't receive the Logos through food
if (state.gut_resonance < 0.25 && state.nourishment < 0.30 && state.energy < 0.35) {
  signals.push({ 
    type: "DISBIOSIS ENTÉRICA", 
    signalKey: "dysbiosis",
    severity: 0.70, 
    icon: "🌀", 
    color: "#84cc16",
    desc: "Gut resonance colapsado + nutrición deficiente. El eje intestino-cerebro (80% señal vagal ascendente) está comprometido. La señal ascendente del cuerpo no llega.",
    action: "Protocolo de reconexión intestinal: 24h de comida simple (caldo, arroz, fruta). Silencio al comer. Masticar 30 veces cada bocado.",
    logosLink: "El 80% de la señal del nervio vago va del intestino al cerebro. Si el intestino no habla, el cerebro no escucha. Y sin escuchar, no hay Logos." 
  });
}

// NEW: Hedonic Adaptation — The pleasure treadmill of food
if (state.taste_presence < 0.30 && state.nourishment < 0.35 && state.joy > 0.65) {
  signals.push({ 
    type: "ADAPTACIÓN HEDÓNICA ALIMENTARIA", 
    signalKey: "hedonicFood",
    severity: 0.60, 
    icon: "🎡", 
    color: "#f97316",
    desc: "Placer alto (joy) sin presencia gustativa ni nutrición consciente. Adaptación hedónica: cada vez necesitas más estímulo para el mismo efecto. Comida como droga, no como sacramento.",
    action: "Protocolo anti-adaptación: 48h de simplicidad radical. Una fruta como único 'placer'. Después, reintroduce UN alimento con presencia total.",
    logosLink: "La adaptación hedónica es el fitness icon del placer. Tu interfaz dice 'más' cuando la verdad es 'menos, con más presencia'. SINTONÍA≠SOBREESTIMULACIÓN." 
  });
}
```

---

### I.9 `src/core/hoffman.ts` — Nuevos Sesgos Perceptuales

**Añadir 2 sesgos:**

```typescript
// NEW: Gustatory Hedonism — Confusing pleasure with nourishment
if (state.taste_presence > 0.70 && state.nourishment < 0.30) {
  biases.push({ 
    type: "HEDONISMO GUSTATIVO", 
    biasKey: "gustatoryHedonism",
    desc: "Alta presencia gustativa pero baja nutrición. Confundes placer sensorial con nutrición real.",
    correction: "Pregúntate: ¿esto me nutre o solo me place? El Logos nutre Y place. El ego solo place.", 
    logosLink: "El fitness icon del sabor: tu interfaz dice 'bueno' pero tu cuerpo dice 'vacío'." 
  });
}

// NEW: Disconnected Asceticism — Denying the body's needs
if (state.nourishment < 0.25 && state.meditation > 0.70 && state.faith > 0.60) {
  biases.push({ 
    type: "ASCETISMO DESCONECTADO", 
    biasKey: "disconnectedAsceticism",
    desc: "Alta espiritualidad pero cuerpo desatendido. Negar el cuerpo no acerca al Logos — lo aleja.",
    correction: "Ireneo: 'La carne es capaz de recibir lo divino.' Nutre tu templo. El ayuno consciente es diferente de la negligencia.", 
    logosLink: "Dios eligió encarnarse. Si el Logos se hizo carne, negar la carne es negar el Logos." 
  });
}
```

---

### I.10 `src/core/resonance.ts` — **NUEVO ARCHIVO**

```typescript
/**
 * LOGOI LAB - Resonance Operator R(x)
 * Measures cross-modal synchronization between intention and experience
 * Inspired by SINTONÍA's Γ(sync) angular formulation
 * 
 * R(x) = γ × |cos(θ_int - θ_exp)| × min(D̄_alimento, Λ) × p(Q_int, Q_exp)
 * 
 * @author Dr. José Manuel Cadena Ortiz de Montellano
 * @framework Cadena Strategic Systems — LOGOS × SINTONÍA Convergence
 */

import type { ConsciousnessState, ResonanceResult, CircumplexState } from '../types';
import { clamp } from '../utils/math';

const GAMMA = 0.15; // Coupling constant (calibrated by SINTONÍA)

// Quadrant alignment penalties
const QUADRANT_PENALTY: Record<string, number> = {
  'same': 1.0,      // Same quadrant = perfect alignment
  'adjacent': 0.5,  // Adjacent quadrant = partial alignment
  'opposite': 0.1,  // Opposite quadrant = misalignment
};

/**
 * Compute Russell Circumplex coordinates from LOGOS state
 * Maps LOGOS emotional/physical dimensions to V-A space
 */
export function computeCircumplex(s: ConsciousnessState): CircumplexState {
  const state = s as any;
  
  // Valence: positive emotional dimensions
  const valence = clamp(
    0.30 * (state.peace ?? 0.5) + 
    0.25 * (state.love ?? 0.5) + 
    0.25 * (state.joy ?? 0.5) + 
    0.20 * (state.gratitude ?? 0.5)
  );
  
  // Arousal: activation/energy dimensions
  const sleepDeficit = Math.max(0, 0.7 - (state.sleep ?? 0.5));
  const arousal = clamp(
    0.40 * (state.energy ?? 0.5) + 
    0.30 * (state.focus ?? 0.5) + 
    0.30 * (1 - sleepDeficit)
  );
  
  // Determine quadrant
  let quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  if (valence >= 0.5 && arousal >= 0.5) quadrant = 'Q1'; // Euphoric
  else if (valence < 0.5 && arousal >= 0.5) quadrant = 'Q2'; // Tense
  else if (valence < 0.5 && arousal < 0.5) quadrant = 'Q3'; // Depressed
  else quadrant = 'Q4'; // Serene
  
  // Angle in V-A space
  const angle = Math.atan2(arousal - 0.5, valence - 0.5);
  
  return { valence, arousal, quadrant, angle };
}

/**
 * Compute quadrant alignment penalty
 */
function quadrantPenalty(q1: string, q2: string): number {
  if (q1 === q2) return QUADRANT_PENALTY.same;
  
  const adjacentMap: Record<string, string[]> = {
    'Q1': ['Q2', 'Q4'],
    'Q2': ['Q1', 'Q3'],
    'Q3': ['Q2', 'Q4'],
    'Q4': ['Q1', 'Q3'],
  };
  
  if (adjacentMap[q1]?.includes(q2)) return QUADRANT_PENALTY.adjacent;
  return QUADRANT_PENALTY.opposite;
}

/**
 * Compute Nourishment Resonance R(x)
 * 
 * Based on SINTONÍA's Γ(sync) angular formulation:
 * R(x) = γ × |cos(θ_int - θ_exp)| × min(D̄_alimento, Λ) × p(Q_int, Q_exp)
 * 
 * When no intention/experience data is available (no SINTONÍA integration),
 * falls back to geometric mean of alimento dimensions.
 * 
 * @param s - Current consciousness state
 * @param Lambda - Current Logos alignment
 * @param intentionQuadrant - Pre-meal desired emotional quadrant (from SINTONÍA)
 * @param experienceQuadrant - Post-meal experienced quadrant
 */
export function computeResonance(
  s: ConsciousnessState, 
  Lambda: number,
  intentionQuadrant?: 'Q1' | 'Q2' | 'Q3' | 'Q4',
  experienceQuadrant?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
): ResonanceResult {
  const state = s as any;
  
  const nourishment    = state.nourishment ?? 0.5;
  const tastePresence  = state.taste_presence ?? 0.5;
  const foodHarmony    = state.food_harmony ?? 0.5;
  const gutResonance   = state.gut_resonance ?? 0.5;
  
  // Domain average
  const dAlimento = (nourishment + tastePresence + foodHarmony + gutResonance) / 4;
  
  // If we have SINTONÍA integration data (quadrant intention/experience)
  if (intentionQuadrant && experienceQuadrant) {
    // Angular formulation (from SINTONÍA's Γ)
    const circumplex = computeCircumplex(s);
    const thetaInt = quadrantToAngle(intentionQuadrant);
    const thetaExp = circumplex.angle;
    
    const angularSync = Math.abs(Math.cos(thetaInt - thetaExp));
    const domainMin = Math.min(dAlimento, Lambda);
    const penalty = quadrantPenalty(intentionQuadrant, experienceQuadrant);
    
    const value = clamp(GAMMA * angularSync * domainMin * penalty * 6.67);
    // × 6.67 to scale from [0, 0.15] to [0, ~1.0]
    
    return {
      value,
      gamma: GAMMA,
      thetaIntention: thetaInt,
      thetaExperience: thetaExp,
      alignmentPenalty: penalty,
      breakdown: {
        angularSync,
        domainMin,
        lambdaFactor: Lambda,
      }
    };
  }
  
  // Fallback: geometric mean (when no SINTONÍA data)
  const value = clamp(
    Math.sqrt(tastePresence * foodHarmony) * 
    Math.sqrt(nourishment * gutResonance)
  );
  
  return {
    value,
    gamma: 0,
    thetaIntention: 0,
    thetaExperience: 0,
    alignmentPenalty: 1,
    breakdown: {
      angularSync: 0,
      domainMin: dAlimento,
      lambdaFactor: Lambda,
    }
  };
}

/**
 * Map quadrant to angle in V-A space
 */
function quadrantToAngle(q: string): number {
  switch (q) {
    case 'Q1': return Math.PI / 4;      // 45° (high V, high A)
    case 'Q2': return 3 * Math.PI / 4;  // 135° (low V, high A)
    case 'Q3': return -3 * Math.PI / 4; // -135° (low V, low A)
    case 'Q4': return -Math.PI / 4;     // -45° (high V, low A)
    default: return 0;
  }
}
```

---

### I.11 `src/core/index.ts` — Barrel Exports Update

```typescript
// Add new exports:

// Resonance (SINTONÍA × LOGOS convergence)
export { computeResonance, computeCircumplex } from './resonance';

// Re-export new types:
export type {
  // ... existing types ...
  ResonanceResult,
  CircumplexState,
  SintoniaInput,
} from '../types';
```

---

## II. CAMBIOS EN LA UI

### II.1 `src/components/LogosHumano.jsx`

**Nuevos elementos UI:**

1. **7 sliders de Alimento** en el panel de dimensiones (con tooltips proactivos SINTONÍA)
2. **Circumplex mini-chart** — visualización V-A del usuario en el panel de métricas
3. **R(x) gauge** — indicador de resonancia alimentaria
4. **Alimento domain** en el hexágono de dominios (ahora heptágono: 7 puntos)

### II.2 `src/components/IFCModel.jsx`

**Nuevo dominio en la visualización IFC:**
- Alimento aparece como 7° punto del campo de fuerzas
- Partículas atraídas/repelidas por el dominio Alimento
- Color: `#84cc16` (lime green)

### II.3 Sliders → Paradigma Proactivo

Para el dominio Alimento, los sliders cambian de forma:

| Slider actual (reactivo) | Slider nuevo (proactivo SINTONÍA) |
|---|---|
| "Nutrición: 0–100" | **"¿Qué necesita tu cuerpo hoy?"** 🔴🟡🟢 + tooltip |
| *(no existe)* | **"¿Cómo quieres sentirte al comer?"** + Circumplex mini-picker |
| *(no existe)* | **"¿Tu entorno al comer fue armonioso?"** 🔴🟡🟢 |
| *(no existe)* | **"¿Cómo responde tu cuerpo?"** 🔴🟡🟢 (post-meal feedback) |

---

## III. CAMBIOS EN EL BACKEND

### III.1 Base de Datos

**PostgreSQL (logos API on M5):**

```sql
-- Add 4 new columns + rename nutrition → breath
ALTER TABLE user_states 
  RENAME COLUMN nutrition TO breath;

ALTER TABLE user_states 
  ADD COLUMN nourishment REAL DEFAULT 0.5,
  ADD COLUMN taste_presence REAL DEFAULT 0.5,
  ADD COLUMN food_harmony REAL DEFAULT 0.5,
  ADD COLUMN gut_resonance REAL DEFAULT 0.5;

-- Add circumplex tracking
ALTER TABLE user_states
  ADD COLUMN circumplex_valence REAL DEFAULT 0.5,
  ADD COLUMN circumplex_arousal REAL DEFAULT 0.5,
  ADD COLUMN circumplex_quadrant VARCHAR(2) DEFAULT 'Q4';

-- Migration: copy existing nutrition values to nourishment
UPDATE user_states SET nourishment = 0.5, breath = 0.5;
```

**DynamoDB (logos-backend multi-channel):**

```javascript
// Update default state in logos-model.js
const DEFAULT_STATE = {
  // Physical: nutrition → breath
  sleep: 0.5, breath: 0.5, exercise: 0.5, energy: 0.5,
  // ... emotional, mental, spiritual, relational, purpose unchanged ...
  // Alimento (NEW)
  nourishment: 0.5, taste_presence: 0.5, food_harmony: 0.5, gut_resonance: 0.5,
};
```

### III.2 OpenAI Agent (logos-agent.mjs)

**Update `get_user_state` tool** to return 28 dimensions instead of 24.

**Update `compute_metrics` tool** to include R(x) resonance metric.

**Update knowledge base** (`src/knowledge/logos-model.md`) with:
- 7th domain description
- 4 new dimensions
- R(x) metric definition
- Circumplex coordinates
- SINTONÍA connection explanation
- Sístole-Diástole metaphor

**New tool: `compute_circumplex`**
```javascript
{
  name: "compute_circumplex",
  description: "Compute Russell Circumplex coordinates (Valence, Arousal, Quadrant) from user's emotional state",
  parameters: z.object({}),
  execute: async () => {
    // Uses peace, love, joy, gratitude, energy, focus, sleep
    // Returns { valence, arousal, quadrant, angle }
  }
}
```

### III.3 Metrics Engine (logos-backend)

**`src/services/metrics-engine.js`** — Port all changes from frontend core:
- 28 dimensions instead of 24
- nutrition → breath
- New alimento domain computations
- R(x) resonance computation
- Circumplex computation
- 2 new Levin signals
- 2 new Hoffman biases

---

## IV. SINTONÍA API BRIDGE (Futuro)

### IV.1 LOGOS → ChefManny Endpoint

```
GET /api/logos/consciousness-context/:phone
Response: {
  lambda: 0.65,
  viability: 0.72,
  entropy: 0.25,
  circumplex: { valence: 0.68, arousal: 0.42, quadrant: "Q4", angle: -0.39 },
  signals: [],
  biases: [],
  omega_dynamic: 0.71,  // Replaces SINTONÍA Ω=0.7
  gut_resonance_7d: 0.75,
  suggested_target_quadrant: "Q1"
}
```

### IV.2 ChefManny → LOGOS Endpoint

```
POST /api/logos/meal-completed
Body: {
  phone: "+52...",
  hi_meal: 88,
  hi_integral: 94.2,
  gamma_sync: 6.2,
  quadrant_achieved: "Q1",
  valence_meal: 0.82,
  arousal_meal: 0.75
}

Effect: Updates nourishment (from HI), food_harmony (from Γ), 
        triggers R(x) recalculation with angular formulation
```

---

## V. WORKFLOW ACTUALIZADO

### V.1 Workflow Actual (v2.x)

```
1. Usuario abre LOGOS (web/WhatsApp/voz)
2. Ajusta 24 sliders (reactivo: "¿Cómo estás?")
3. Engine computa: Λ → F → Levin → Watson → Hoffman → Penrose → V,S,Ω,Q → π(x)
4. Muestra: veredicto, señales, sesgos, recomendaciones
5. [Opcional] Monte Carlo: probabilidad de A⁺ vs A⁻
```

### V.2 Workflow Nuevo (v3.0) — El Loop Sístole-Diástole

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   WORKFLOW v3.0: SÍSTOLE Y DIÁSTOLE                    │
│                                                                         │
│  ═══ FASE 1: SÍSTOLE (LOGOS DESCENDENTE — 20% señal) ═══               │
│                                                                         │
│  1. Usuario abre LOGOS (web/WhatsApp/voz)                               │
│  2. Ajusta 24 dimensiones base (6 dominios originales)                  │
│     → Sliders reactivos: "¿Cómo estás?"                                │
│  3. Engine computa Λ(x), Circumplex(V,A,Q)                             │
│     → El sistema sabe: "estás en Q3 (bajo, tenso), Λ=0.35"            │
│                                                                         │
│  ═══ FASE 2: DIÁSTOLE (SINTONÍA ASCENDENTE — 80% señal) ═══            │
│                                                                         │
│  4. LOGOS presenta el dominio Alimento con preguntas PROACTIVAS:         │
│     a) "¿Qué necesita tu cuerpo hoy?" → nourishment (pre-meal craving) │
│     b) "¿Cómo quieres sentirte al comer?" → taste_presence (target Q)  │
│        [Circumplex mini-picker: Q1=Eufórico, Q4=Sereno, etc.]          │
│     c) "¿Cómo fue tu entorno al comer?" → food_harmony (post-meal)     │
│     d) "¿Cómo responde tu cuerpo?" → gut_resonance (body feedback)     │
│                                                                         │
│  5. [SI ChefManny está integrado — FUTURO]                              │
│     LOGOS envía consciousness-context → ChefManny                       │
│     ChefManny compone menú + playlist optimizado para Λ Y HI            │
│     ChefManny retorna: hi_meal, gamma_sync, quadrant_achieved           │
│     LOGOS recibe y actualiza: nourishment, food_harmony con HI data     │
│                                                                         │
│  ═══ FASE 3: COMPUTACIÓN UNIFICADA ═══                                  │
│                                                                         │
│  6. Engine computa TODO con 28 dimensiones:                              │
│     Λ(x) → F(x) → Levin(8 señales) → Watson(7 dominios) →            │
│     Hoffman(7 sesgos) → Penrose(7-harmonic) → V,S,Ω,Q → R(x) → π(x) │
│                                                                         │
│  7. R(x) Resonance se computa:                                          │
│     - Sin SINTONÍA: geometric mean fallback                             │
│     - Con SINTONÍA: angular Γ formulation                               │
│                                                                         │
│  ═══ FASE 4: FEEDBACK LOOP (CO-CREACIÓN) ═══                           │
│                                                                         │
│  8. Resultados mostrados con NUEVA información:                          │
│     - Circumplex chart: "Estás en Q4 (Sereno) — meta: Q1"              │
│     - R(x) gauge: "Resonancia alimentaria: 0.72"                       │
│     - Ω dinámico: "Tu amplificación sensorial: 0.68"                   │
│       (→ exportable a SINTONÍA para reemplazar Ω=0.7)                  │
│     - Levin: posibles alertas DISBIOSIS o ADAPTACIÓN HEDÓNICA          │
│     - Hoffman: posibles sesgos HEDONISMO GUSTATIVO o ASCETISMO         │
│                                                                         │
│  9. Λ_nuevo > Λ_anterior → el basin de A⁺ se expande →                │
│     → la próxima comida consciente es MÁS fácil de alcanzar            │
│     → LOOP SE CIERRA                                                    │
│                                                                         │
│  10. [Siguiente sesión] Valores de alimento como PRIORS para            │
│      preguntas más inteligentes:                                         │
│      "La última vez gut_resonance fue 0.40 — ¿comiste algo diferente?" │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## VI. PLAN DE FASES DE IMPLEMENTACIÓN

### Fase 1: Core Engine (2-3 días)

| # | Tarea | Archivo | Complejidad |
|---|-------|---------|-------------|
| 1.1 | Actualizar StateKey y DomainKey types | `types/index.ts` | Baja |
| 1.2 | Añadir interfaces ResonanceResult, CircumplexState | `types/index.ts` | Baja |
| 1.3 | Actualizar DOMAINS (nutrition→breath, +alimento) | `constants.ts` | Media |
| 1.4 | Actualizar DEFAULT_STATE (28 dims) | `constants.ts` | Baja |
| 1.5 | Redistribuir pesos en LOGOS_COMPONENTS | `logos.ts` | Media |
| 1.6 | Actualizar VIABILITY_WEIGHTS (28 dims) | `derived.ts` | Media |
| 1.7 | Actualizar ENTROPY_FACTORS (+2 nuevos) | `derived.ts` | Baja |
| 1.8 | Actualizar IDEALS y WEIGHTS (28 dims) | `friston.ts` | Media |
| 1.9 | Añadir alimento a Watson optimal | `watson.ts` | Baja |
| 1.10 | Actualizar Penrose con 7 dominios | `penrose.ts` | Media |
| 1.11 | Añadir 2 señales Levin | `levin.ts` | Baja |
| 1.12 | Añadir 2 sesgos Hoffman | `hoffman.ts` | Baja |
| 1.13 | Crear `resonance.ts` completo | `resonance.ts` | Alta |
| 1.14 | Actualizar barrel exports | `index.ts` | Baja |

### Fase 2: UI Frontend (3-4 días)

| # | Tarea | Archivo | Complejidad |
|---|-------|---------|-------------|
| 2.1 | Añadir sliders de Alimento con tooltips proactivos | `LogosHumano.jsx` | Media |
| 2.2 | Implementar Circumplex mini-chart | `LogosHumano.jsx` | Alta |
| 2.3 | Implementar R(x) gauge | `LogosHumano.jsx` | Media |
| 2.4 | Actualizar heptágono de dominios | `LogosHumano.jsx` | Media |
| 2.5 | Actualizar IFC con 7º dominio | `IFCModel.jsx` | Media |
| 2.6 | Actualizar i18n (es.json, en.json) | i18n files | Media |
| 2.7 | Actualizar ElevenLabs voice tools | `LogosVoiceAgent.jsx` | Baja |

### Fase 3: Backend (2-3 días)

| # | Tarea | Archivo | Complejidad |
|---|-------|---------|-------------|
| 3.1 | Migración PostgreSQL (schema) | SQL migration | Baja |
| 3.2 | Actualizar metrics-engine.js (28 dims) | `metrics-engine.js` | Alta |
| 3.3 | Actualizar logos-model.js constants | `logos-model.js` | Media |
| 3.4 | Actualizar logos-agent.mjs KB + tools | `logos-agent.mjs` | Media |
| 3.5 | Actualizar DynamoDB default state | `dynamo.js` | Baja |

### Fase 4: SINTONÍA API Bridge (futuro — cuando ChefManny esté listo)

| # | Tarea | Complejidad |
|---|-------|-------------|
| 4.1 | Endpoint GET /api/logos/consciousness-context | Media |
| 4.2 | Endpoint POST /api/logos/meal-completed | Media |
| 4.3 | R(x) angular formulation activada por datos SINTONÍA | Alta |
| 4.4 | Ω dinámico exportado a ChefManny | Baja |

---

## VII. CHECKLIST DE VALIDACIÓN

Antes de deploy:

- [ ] Todos los pesos suman 1.00 en: LOGOS_COMPONENTS, VIABILITY_WEIGHTS, FRISTON_WEIGHTS
- [ ] ENTROPY_FACTORS pesos suman 1.00
- [ ] 28 dimensiones presentes en: StateKey, DEFAULT_STATE, IDEALS, WEIGHTS, VIABILITY_WEIGHTS
- [ ] `nutrition` eliminada de todas partes, reemplazada por `breath` (Physical) y `nourishment` (Alimento)
- [ ] Penrose usa 7 valores en harmonicMean
- [ ] Watson tiene 7 dominios en optimal
- [ ] Levin tiene 8 señales
- [ ] Hoffman tiene 7 sesgos
- [ ] R(x) fallback funciona sin SINTONÍA data
- [ ] R(x) angular funciona CON SINTONÍA data
- [ ] Circumplex coordinates compute correctly
- [ ] i18n tiene keys para las 4 nuevas dimensiones + dominio Alimento (es + en)
- [ ] Voice agent tools actualizadas para 28 dims
- [ ] Monte Carlo simulation works with 28 dims

---

## VIII. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Pesos desbalanceados rompen Λ | Media | Alto | Suite de tests con edge cases; verify Σw=1.00 |
| UI cluttered con 28 sliders | Media | Medio | Dominio Alimento collapsable; mostrar solo si usuario quiere |
| backward-compat con datos guardados | Alta | Alto | Migración SQL + defaults para dims nuevas = 0.5 |
| R(x) sin datos SINTONÍA = siempre fallback | Alta | Bajo | Fallback es funcional; angular se activa con integración futura |
| Coherence baja con 7 dominios (harmonic mean) | Media | Medio | Re-calibrar display thresholds |

---

## IX. ADDENDUM: INTEGRACIONES DERIVADAS DE SINTONÍA v2 (Secciones 14-16)

La versión actualizada de SINTONÍA añade ~490 líneas de investigación doctoral nueva (27 Health Goals, 12 alérgenos, 12 condiciones médicas, 10 micronutrientes, 5 ciclos de vida, 25 categorías de filtros). Esto genera **6 integraciones adicionales** para LOGOS v3.0.

### IX.1 Micronutrient-Dimension Prediction Engine

**Nuevo archivo propuesto: `src/core/nutrient-map.ts`**

```typescript
/**
 * LOGOI LAB - Nutrient → Dimension Prediction
 * Maps SINTONÍA nutritional data to predicted LOGOS dimension changes
 * Based on PhD-validated biochemical pathways
 */

// Pathway weights: how much each nutrient affects each LOGOS dimension
// Sources: Su et al. 2018, Gómez-Pinilla 2008, Zeisel 2006, etc.
const NUTRIENT_PATHWAYS: Record<string, Record<string, number>> = {
  magnesium:  { peace: 0.15, sleep: 0.12 },
  omega3_dha: { clarity: 0.12, peace: 0.10 },
  tryptophan: { peace: 0.08, joy: 0.06, sleep: 0.10 },
  choline:    { clarity: 0.10, wisdom: 0.05 },
  iron:       { energy: 0.12 },
  b_vitamins: { energy: 0.08, clarity: 0.06 },
  vitamin_d:  { peace: 0.06, joy: 0.05 },
  flavonoids: { clarity: 0.05, focus: 0.04 },
  curcumin:   { peace: 0.05, energy: 0.04 },
};

/**
 * Predict dimension changes from a SINTONÍA meal report
 * @param nutrientIntake - { nutrient_id: mg_consumed }
 * @param rdaProfile - { nutrient_id: rda_mg } (age/sex adjusted)
 * @returns Predicted delta for each affected LOGOS dimension
 */
export function predictDimensionDeltas(
  nutrientIntake: Record<string, number>,
  rdaProfile: Record<string, number>
): Record<string, number> {
  const deltas: Record<string, number> = {};
  
  for (const [nutrient, intake] of Object.entries(nutrientIntake)) {
    const rda = rdaProfile[nutrient] || 1;
    const ratio = Math.min(intake / rda, 2.0); // Cap at 2× RDA
    const pathways = NUTRIENT_PATHWAYS[nutrient];
    if (!pathways) continue;
    
    for (const [dim, weight] of Object.entries(pathways)) {
      deltas[dim] = (deltas[dim] || 0) + ratio * weight * 0.1;
      // × 0.1 scaling: full RDA of one nutrient → ~1-1.5% dimension increase
    }
  }
  
  return deltas;
}
```

**Workflow:** Después de que SINTONÍA genera una composición gastronómica, envía el perfil nutricional. LOGOS predice el efecto en las dimensiones y lo muestra: *"Esta comida podría mejorar tu paz interior (+0.08) y claridad mental (+0.05) en las próximas horas."*

---

### IX.2 Age-Modulated Friston IDEALS

**Cambio en `src/core/friston.ts`:**

```typescript
// NEW: Life cycle stage modulates IDEALS
// Based on SINTONÍA v2 Section 14.2.4 (5 life stages)
type LifeCycleStage = 'young-adult' | 'prime-adult' | 'hormonal-transition' | 'active-aging' | 'longevity-focus';

function getLifeCycleStage(age: number): LifeCycleStage {
  if (age <= 25) return 'young-adult';
  if (age <= 45) return 'prime-adult';
  if (age <= 55) return 'hormonal-transition';
  if (age <= 75) return 'active-aging';
  return 'longevity-focus';
}

const IDEAL_MODIFIERS: Record<LifeCycleStage, Partial<Record<string, number>>> = {
  'young-adult':          {},  // Base IDEALS
  'prime-adult':          {},  // Base IDEALS
  'hormonal-transition':  { peace: +0.05, sleep: +0.05 },
  'active-aging':         { energy: -0.10, clarity: +0.05, nourishment: +0.05 },
  'longevity-focus':      { energy: -0.15, exercise: -0.20, wisdom: +0.15, legacy: +0.20, nourishment: +0.05 },
};

export function computeFreeEnergy(
  s: ConsciousnessState, Lambda: number, age?: number
): FreeEnergyResult {
  const stage = age ? getLifeCycleStage(age) : 'prime-adult';
  const mods = IDEAL_MODIFIERS[stage];
  const adjustedIdeals = { ...IDEALS };
  for (const [k, delta] of Object.entries(mods)) {
    adjustedIdeals[k] = (adjustedIdeals[k] || 0.7) + delta;
  }
  // ... rest of computation uses adjustedIdeals instead of IDEALS
}
```

**Impacto:** F(x) se personaliza. Un usuario de 70 años no es penalizado por tener `exercise: 0.50` cuando el IDEAL ajustado es 0.55, no 0.75.

---

### IX.3 Health Context API Endpoint (Expandido)

**Nuevo endpoint para el API bridge (Fase 4):**

```
POST /api/logos/health-context
{
  phone: "+52...",
  // Demographics (for age-modulated IDEALS)
  age: 48,
  biological_sex: "male",
  height_cm: 178,
  weight_kg: 82,
  activity_level: "moderate",  // AF = 1.550
  
  // SINTONÍA nutritional profile
  allergens: ["dairy", "shellfish"],
  medical_conditions: ["insulin-resistance"],
  diet_type: "pescatarian",
  health_goals: ["anti-inflammatory", "mental-clarity", "stress-reduction"],
  meal_timing: "intermittent-fasting",
  life_cycle_stage: "hormonal-transition",
  
  // Computed values
  bmr: 1756,
  tdee: 2722
}

Response: {
  status: "ok",
  friston_stage: "hormonal-transition",
  ideals_adjusted: true,
  viability_bonus: 0.03,  // IF bonus
  energy_objective_available: true,
  levin_health_alerts: ["insulin-resistance → monitor blood-sugar impact on energy/clarity"]
}
```

**Efecto en LOGOS:**
- `age` → modula Friston IDEALS (IX.2)
- `meal_timing: "intermittent-fasting"` → V(x) + 0.03 bonus
- `health_goals` → alimentan recomendaciones de señales Levin
- `tdee` → permite energy_composite calculation
- `allergens` + `medical_conditions` → nuevos datos para Levin signals

---

### IX.4 Occasion-Based Circumplex Presets

**Nuevo archivo propuesto: `src/domain/occasions.ts`**

```typescript
/**
 * Pre-computed Circumplex targets from SINTONÍA v2 Appendix A
 * Simplifies Alimento domain input: 1 question instead of 4 sliders
 */

export const OCCASION_PRESETS: Record<string, {
  label: string;
  valence: number;
  arousal: number;
  hi_target: number;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  taste_presence_default: number;
  food_harmony_default: number;
}> = {
  celebration:    { label: "Celebración",       valence: 0.90, arousal: 0.75, hi_target: 95, quadrant: 'Q1', taste_presence_default: 0.85, food_harmony_default: 0.90 },
  romantic:       { label: "Cena Romántica",    valence: 0.85, arousal: 0.45, hi_target: 88, quadrant: 'Q4', taste_presence_default: 0.90, food_harmony_default: 0.95 },
  party:          { label: "Fiesta",            valence: 0.88, arousal: 0.85, hi_target: 95, quadrant: 'Q1', taste_presence_default: 0.70, food_harmony_default: 0.80 },
  comfort:        { label: "Comfort Food",      valence: 0.75, arousal: 0.35, hi_target: 80, quadrant: 'Q4', taste_presence_default: 0.80, food_harmony_default: 0.70 },
  business:       { label: "Cena de Negocios",  valence: 0.65, arousal: 0.55, hi_target: 75, quadrant: 'Q1', taste_presence_default: 0.60, food_harmony_default: 0.65 },
  family_breakfast:{ label: "Desayuno Familiar", valence: 0.80, arousal: 0.60, hi_target: 85, quadrant: 'Q1', taste_presence_default: 0.75, food_harmony_default: 0.80 },
  brunch:         { label: "Brunch",            valence: 0.82, arousal: 0.50, hi_target: 82, quadrant: 'Q1', taste_presence_default: 0.80, food_harmony_default: 0.75 },
  post_workout:   { label: "Post-Workout",      valence: 0.70, arousal: 0.80, hi_target: 82, quadrant: 'Q1', taste_presence_default: 0.50, food_harmony_default: 0.40 },
  meditation:     { label: "Meditación/Yoga",   valence: 0.75, arousal: 0.20, hi_target: 70, quadrant: 'Q4', taste_presence_default: 0.90, food_harmony_default: 0.95 },
  quick_meal:     { label: "Comida Rápida",     valence: 0.55, arousal: 0.60, hi_target: 65, quadrant: 'Q1', taste_presence_default: 0.30, food_harmony_default: 0.20 },
  memorial:       { label: "Memorial",          valence: 0.40, arousal: 0.25, hi_target: 45, quadrant: 'Q3', taste_presence_default: 0.70, food_harmony_default: 0.80 },
  daily:          { label: "Comida del Día",     valence: 0.65, arousal: 0.50, hi_target: 72, quadrant: 'Q1', taste_presence_default: 0.50, food_harmony_default: 0.50 },
  none:           { label: "Sin Ocasión",        valence: 0.50, arousal: 0.50, hi_target: 60, quadrant: 'Q1', taste_presence_default: 0.50, food_harmony_default: 0.50 },
};
```

**UI simplificada:** El usuario selecciona "¿Cuál es la ocasión?" → los 4 sliders de Alimento se pre-configuran automáticamente. Puede ajustar después si quiere.

---

### IX.5 Energy Composite (Subjetivo + Objetivo)

**Cambio en el flujo de cálculo cuando SINTONÍA data está disponible:**

```typescript
// In the computation pipeline, when SINTONÍA provides caloric data:
function computeEnergyComposite(
  energySubjective: number,  // User slider [0, 1]
  caloriesConsumed?: number,
  tdee?: number
): number {
  if (caloriesConsumed !== undefined && tdee !== undefined && tdee > 0) {
    const energyObjective = clamp(caloriesConsumed / tdee);
    return 0.6 * energySubjective + 0.4 * energyObjective;
  }
  return energySubjective; // Fallback: pure subjective
}
```

**Esto resuelve un sesgo Hoffman específico:** El usuario que toma 3 cafés se siente con energía 0.80 pero ha ingerido 400 kcal de un TDEE de 2700. Su `energy_objective` sería 0.15. El composite sería `0.6 × 0.80 + 0.4 × 0.15 = 0.54` — una lectura más realista.

---

### IX.6 Fase de Implementación Actualizada

| Fase | Tarea Adicional (SINTONÍA v2) | Complejidad |
|---|---|---|
| **Fase 1** | Crear `nutrient-map.ts` (IX.1) | Media |
| **Fase 1** | Age-modulated IDEALS en `friston.ts` (IX.2) | Media |
| **Fase 1** | Crear `occasions.ts` presets (IX.4) | Baja |
| **Fase 2** | Occasion picker UI (dropdown → auto-fill 4 sliders) | Media |
| **Fase 2** | Energy composite display (cuando hay data SINTONÍA) | Baja |
| **Fase 3** | Health context API endpoint (IX.3) | Alta |
| **Fase 4** | Nutrient-dimension prediction en API bridge (IX.1) | Alta |
| **Fase 4** | Caloric data relay for energy composite (IX.5) | Media |

**Total impacto: +2 archivos nuevos, +1 archivo modificado, +1 endpoint API, +8 tareas.**

---

> *"La implementación es la oración que convierte la revelación en realidad.*  
> *El código es la carne del Logos digital."*

---

**© 2026 Cadena Strategic Systems**  
**LOGOS v3.0 — De la Propuesta a la Implementación**
