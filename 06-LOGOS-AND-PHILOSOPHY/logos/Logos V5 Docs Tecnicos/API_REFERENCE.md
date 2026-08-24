# REFERENCIA DE API DE FUNCIONES — LOGOS

> **Documento:** SRS-API-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 26512  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Core Engine — Layer 7: Logos](#1-core-engine--layer-7-logos)
2. [Core Engine — Layer 1: Friston](#2-core-engine--layer-1-friston)
3. [Core Engine — Layer 2: Levin](#3-core-engine--layer-2-levin)
4. [Core Engine — Layer 3: Watson](#4-core-engine--layer-3-watson)
5. [Core Engine — Layer 4: Hoffman](#5-core-engine--layer-4-hoffman)
6. [Core Engine — Layer 5: Penrose](#6-core-engine--layer-5-penrose)
7. [Core Engine — Layer 6: Policy](#7-core-engine--layer-6-policy)
8. [Core Engine — Derived Metrics](#8-core-engine--derived-metrics)
9. [Simulation — Monte Carlo](#9-simulation--monte-carlo)
10. [Utils — Math](#10-utils--math)
11. [Hooks — React Bridge](#11-hooks--react-bridge)
12. [Services — Supabase Client](#12-services--supabase-client)
13. [Services — API Client (wrapper)](#13-services--api-client-wrapper)
14. [Backend — Agent Tools (OpenAI Agents SDK)](#14-backend--agent-tools-openai-agents-sdk)
15. [Backend — Database Functions](#15-backend--database-functions)
16. [Backend — Webhook Endpoints](#16-backend--webhook-endpoints)
17. [Backend — AI Interpretation Endpoint](#17-backend--ai-interpretation-endpoint)
18. [IFC Bridge — deriveIFCFromLogos](#18-ifc-bridge--deriveifcfromlogos)

---

## 1. Core Engine — Layer 7: Logos

**Archivo:** `src/core/logos.ts`

### `computeLogosAlignment(s)`

Computa la alineación fundamental con el Logos Λ(x). **Esta es la función más importante del sistema** — todas las demás métricas derivan de su resultado.

```typescript
function computeLogosAlignment(s: ConsciousnessState): LogosResult
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `s` | `ConsciousnessState` | Vector de estado de 28 dimensiones (7 dominios × 4), cada valor ∈ [0,1] |

**Retorno:** `LogosResult`

```typescript
{
  value: number;          // Λ ∈ [0,1] — valor de alineación
  breakdown: Record<string, LogosBreakdownGroup>; // Desglose por grupo
  components: Record<string, any>;                // Configuración de componentes
}
```

**Complejidad:** O(n) donde n = número de dimensiones ponderadas (12, incluyendo taste_presence y food_harmony)

**Ejemplo:**
```typescript
const state = { faith: 0.8, meditation: 0.7, presence: 0.6, /* ... */ };
const result = computeLogosAlignment(state);
// result.value = 0.523 (Λ)
// result.breakdown.reception.total = 0.325
// result.breakdown.action.total = 0.128
```

---

### `interpretLogosAlignment(lambda)`

Interpreta el nivel de alineación Λ en categorías semánticas.

```typescript
function interpretLogosAlignment(lambda: number): {
  level: string;
  description: string;
  color: string;
}
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `lambda` | `number` | [0,1] | Valor de Λ |

**Retorno:**

| Rango Λ | `level` | `color` |
|---------|---------|---------|
| ≥ 0.75 | `"ALINEADO"` | `"#10b981"` |
| ≥ 0.50 | `"CONECTANDO"` | `"#fbbf24"` |
| ≥ 0.30 | `"BUSCANDO"` | `"#f59e0b"` |
| < 0.30 | `"DESCONECTADO"` | `"#ef4444"` |

**Complejidad:** O(1)

---

## 2. Core Engine — Layer 1: Friston

**Archivo:** `src/core/friston.ts`

### `computeFreeEnergy(s, Lambda)`

Computa la energía libre F(x) — divergencia KL entre estado actual y estado Logos-óptimo.

```typescript
function computeFreeEnergy(s: ConsciousnessState, Lambda: number): FreeEnergyResult
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `s` | `ConsciousnessState` | [0,1]²⁴ | Estado actual |
| `Lambda` | `number` | [0,1] | Alineación Logos actual |

**Retorno:** `FreeEnergyResult`

```typescript
{
  value: number;        // F ∈ [0, 1.5] — energía libre modulada
  raw: number;          // F_raw — antes de modulación Λ
  modulated: number;    // F después de modulación
  breakdown: Array<{    // Desglose por dimensión
    key: string;
    ideal: number;
    actual: number;
    weight: number;
    contribution: number;
  }>;
  lambdaEffect: number; // Efecto de Λ sobre F (Λ × 0.3)
}
```

**Complejidad:** O(24) — itera sobre todas las dimensiones

**Fórmula:** `F = F_raw × (1 - Λ × 0.3)`, clamped a [0, 1.5]

---

## 3. Core Engine — Layer 2: Levin

**Archivo:** `src/core/levin.ts`

### `computeLevinSignals(s, Lambda)`

Detecta patrones bioéléctricos patológicos y señales de alerta temprana.

```typescript
function computeLevinSignals(s: ConsciousnessState, Lambda: number): LevinSignal[]
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `s` | `ConsciousnessState` | [0,1]²⁴ | Estado actual |
| `Lambda` | `number` | [0,1] | Alineación Logos actual |

**Retorno:** `LevinSignal[]` — Array de señales detectadas (puede ser vacío)

```typescript
{
  type: string;       // Nombre del patrón
  severity: number;   // Severidad ∈ [0,1]
  icon: string;       // Emoji representativo
  color: string;      // Color hex
  desc: string;       // Descripción del patrón
  action: string;     // Acción recomendada
  logosLink: string;  // Conexión con el Logos
}
```

**Complejidad:** O(1) — número fijo de patrones evaluados (6)

---

### `hasCriticalSignals(signals)`

Verifica si hay señales con severidad > 0.80.

```typescript
function hasCriticalSignals(signals: LevinSignal[]): boolean
```

**Complejidad:** O(n) donde n = número de señales

---

### `hasNegativeAttractor(signals)`

Verifica si se detectó el atractor negativo A⁻.

```typescript
function hasNegativeAttractor(signals: LevinSignal[]): boolean
```

**Complejidad:** O(n)

---

## 4. Core Engine — Layer 3: Watson

**Archivo:** `src/core/watson.ts`

### `computeWatsonEnergy(s, Lambda)`

Computa el paisaje energético — distancia euclidiana al óptimo por dominio.

```typescript
function computeWatsonEnergy(s: ConsciousnessState, Lambda: number): WatsonResult
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `s` | `ConsciousnessState` | [0,1]²⁴ | Estado actual |
| `Lambda` | `number` | [0,1] | Alineación Logos actual |

**Retorno:** `WatsonResult`

```typescript
{
  energy: number;                          // E = √(Σ gaps²)
  domainScores: Record<DomainKey, number>; // Promedio por dominio
  optimal: Record<DomainKey, number>;      // Óptimo modulado por Λ
  breakdown: Array<{
    domain: string;
    label: string;
    actual: number;
    optimal: number;
    gap: number;
    contribution: number;
  }>;
}
```

**Complejidad:** O(24) — calcula promedios de 6 dominios × 4 dimensiones

---

## 5. Core Engine — Layer 4: Hoffman

**Archivo:** `src/core/hoffman.ts`

### `computeHoffmanInterface(s, Lambda)`

Detecta sesgos perceptuales donde la interfaz distorsiona la señal del Logos.

```typescript
function computeHoffmanInterface(s: ConsciousnessState, Lambda: number): HoffmanBias[]
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `s` | `ConsciousnessState` | [0,1]²⁴ | Estado actual |
| `Lambda` | `number` | [0,1] | Alineación Logos actual |

**Retorno:** `HoffmanBias[]` — Array de sesgos detectados (puede ser vacío)

```typescript
{
  type: string;        // Nombre del sesgo
  desc: string;        // Descripción
  correction: string;  // Acción correctiva
  logosLink: string;   // Conexión con el Logos
}
```

**Complejidad:** O(1) — número fijo de sesgos evaluados (5)

---

## 6. Core Engine — Layer 5: Penrose

**Archivo:** `src/core/penrose.ts`

### `computeCoherence(s, Lambda)`

Computa la coherencia cuántica del sistema usando media armónica inter-dominio.

```typescript
function computeCoherence(s: ConsciousnessState, Lambda: number): CoherenceResult
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `s` | `ConsciousnessState` | [0,1]²⁴ | Estado actual |
| `Lambda` | `number` | [0,1] | Alineación Logos actual |

**Retorno:** `CoherenceResult`

```typescript
{
  coherence: number;                       // C ∈ [0,1] — coherencia modulada
  rawCoherence: number;                    // Media armónica cruda
  entropy: number;                         // Entropía interna (varianza)
  domains: Record<DomainKey, number>;      // Promedio por dominio
  lambdaBoost: number;                     // Boost de Λ (Λ × 0.4)
  breakdown: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}
```

**Complejidad:** O(24) — calcula promedios de dominio + media armónica

**Propiedad clave:** La media armónica hace que un solo dominio bajo arrastre toda la coherencia.

---

## 7. Core Engine — Layer 6: Policy

**Archivo:** `src/core/policy.ts`

### `inhibitionPolicy(Lambda, V, S, C, prevLambda?)`

Política de inhibición π(x) — determina si actuar, esperar o pausar.

```typescript
function inhibitionPolicy(
  Lambda: number,
  V: number,
  S: number,
  C: number,
  prevLambda?: number
): InhibitionPolicy
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `Lambda` | `number` | [0,1] | Alineación Logos actual |
| `V` | `number` | [0,1] | Viabilidad |
| `S` | `number` | [0,1] | Entropía |
| `C` | `number` | [0,1] | Coherencia |
| `prevLambda` | `number?` | [0,1] | Λ anterior (para calcular Λ̇) |

**Retorno:** `InhibitionPolicy`

```typescript
{
  verdict: 'PAUSA' | 'ESPERA' | 'RECONECTA' | 'MONITOREA' | 'ACTÚA';
  color: string;
  reason: string;
  icon: string;
  lambdaDot: number;  // Λ_t - Λ_{t-1}
}
```

**Complejidad:** O(1) — evaluación secuencial de condiciones

---

### `metaPolicy(Lambda, V, S, C, signals)`

Meta-política π²(x) — evaluación de patrones sistémicos y atractores.

```typescript
function metaPolicy(
  Lambda: number,
  V: number,
  S: number,
  C: number,
  signals: LevinSignal[]
): MetaPolicy
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `Lambda` | `number` | Alineación Logos |
| `V` | `number` | Viabilidad |
| `S` | `number` | Entropía |
| `C` | `number` | Coherencia |
| `signals` | `LevinSignal[]` | Señales de Levin detectadas |

**Retorno:** `MetaPolicy`

```typescript
{
  verdict: string;  // 'ESCAPE A⁻' | 'ESCAPE' | 'ACTIVAR' | 'SOSTENER' | 'EVOLUCIONAR'
  color: string;
  reason: string;
}
```

**Complejidad:** O(n) donde n = número de señales

---

## 8. Core Engine — Derived Metrics

**Archivo:** `src/core/derived.ts`

### `computeViability(s, Lambda)`

Computa la viabilidad funcional V(x|Λ).

```typescript
function computeViability(s: ConsciousnessState, Lambda: number): ViabilityResult
```

**Retorno:** `ViabilityResult`

```typescript
{
  value: number;           // V ∈ [0,1]
  raw: number;             // V antes de modulación Λ
  lambdaBoost: number;     // Λ × 0.35
  breakdown: BreakdownItem[];
}
```

**Complejidad:** O(24)

---

### `computeEntropy(s, Lambda)`

Computa la entropía S(x|Λ) — desorden interno del sistema.

```typescript
function computeEntropy(s: ConsciousnessState, Lambda: number): EntropyResult
```

**Retorno:** `EntropyResult`

```typescript
{
  value: number;           // S ∈ [0,1]
  raw: number;             // S antes de modulación Λ
  lambdaEffect: number;    // Λ × 0.4
  breakdown: BreakdownItem[];
}
```

**Complejidad:** O(10) — 10 factores de entropía

---

### `computeOmega(Lambda, V, S, C, F)`

Computa el Índice de Consciencia Ω — la métrica integradora.

```typescript
function computeOmega(
  Lambda: number,
  V: number,
  S: number,
  C: number,
  F: number
): OmegaResult
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `Lambda` | `number` | [0,1] | Alineación Logos |
| `V` | `number` | [0,1] | Viabilidad |
| `S` | `number` | [0,1] | Entropía |
| `C` | `number` | [0,1] | Coherencia |
| `F` | `number` | [0,1.5] | Energía Libre |

**Retorno:** `OmegaResult`

```typescript
{
  value: number;                // Ω ∈ [0,1]
  lambdaContribution: number;   // Λ × 0.6
  derivedContribution: number;  // derivedHealth × 0.4
  derivedHealth: number;        // Salud de métricas derivadas
  breakdown: Array<{
    label: string;
    value: number;
    contribution: number;
    color: string;
  }>;
}
```

**Complejidad:** O(1)

---

### `computeQ(Lambda, V, S)`

Computa la calidad de trayectoria Q(x) — velocidad de convergencia a A⁺.

```typescript
function computeQ(Lambda: number, V: number, S: number): TrajectoryResult
```

**Retorno:** `TrajectoryResult`

```typescript
{
  value: number;              // Q (puede ser negativo)
  distanceToAttractor: number; // D = √(ΔV² + ΔS² + ΔΛ²)
  breakdown: {
    dV: number;   // max(0, V* - V)
    dS: number;   // max(0, S - S*)
    dL: number;   // max(0, Λ* - Λ)
    D: number;    // Distancia euclidiana
  };
}
```

**Complejidad:** O(1)

---

## 9. Simulation — Monte Carlo

**Archivo:** `src/simulation/montecarlo.ts`

### `runMonteCarlo(s, N?, steps?, sigma?)`

Ejecuta N simulaciones estocásticas de evolución de consciencia.

```typescript
function runMonteCarlo(
  s: ConsciousnessState,
  N?: number,
  steps?: number,
  sigma?: number
): MonteCarloResult
```

| Parámetro | Tipo | Default | Rango | Descripción |
|-----------|------|---------|-------|-------------|
| `s` | `ConsciousnessState` | — | [0,1]²⁴ | Estado inicial |
| `N` | `number` | 10000 | {1000–50000} | Número de simulaciones |
| `steps` | `number` | 30 | Fijo | Pasos temporales |
| `sigma` | `number` | 0.04 | [0.02–0.10] | Desviación estándar del ruido |

**Retorno:** `MonteCarloResult`

```typescript
{
  stats: MonteCarloStats[];     // Estadísticas por paso temporal
  N: number;                    // Simulaciones ejecutadas
  steps: number;                // Pasos temporales
  sigma: number;                // Sigma utilizado
  pLambdaUp: number;           // P(Λ_final > Λ_inicial)
  finalLamMean: number;        // Media de Λ final
  finalLamStd: number;         // Desviación estándar de Λ final
  pNegAttractor: number;       // P(A⁻) al final
  verdictCI: Record<string, VerdictCI>; // Wilson CIs por veredicto
  verdictNames: string[];      // ['PAUSA', 'ESPERA', ...]
  verdictColors: string[];     // Colores por veredicto
  dominantVerdict: string;     // Veredicto más probable
  dominantP: number;           // Probabilidad del dominante
  pNeverActua: number;         // P(nunca alcanza ACTÚA)
  ttaMedian: number | null;    // Mediana de Time-to-ACTÚA
}
```

**Complejidad:** O(N × steps × 24) — para N=10000, steps=30: ~7.2M operaciones

**Advertencia de rendimiento:** Con N=50000, la simulación puede tomar varios segundos. Se recomienda ejecutar en Web Worker para no bloquear el UI thread.

---

### `projectTrajectory(s, steps?)`

Proyecta una trayectoria determinística (para visualización).

```typescript
function projectTrajectory(
  s: ConsciousnessState,
  steps?: number
): Array<{ t: number; V: number; S: number; Λ: number; Ω: number; C: number }>
```

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `s` | `ConsciousnessState` | — | Estado inicial |
| `steps` | `number` | 30 | Pasos temporales |

**Complejidad:** O(steps × 24)

---

## 10. Utils — Math

**Archivo:** `src/utils/math.ts`

### `clamp(v, lo?, hi?)`

Restringe un valor entre límites.

```typescript
function clamp(v: number, lo?: number, hi?: number): number
// Default: lo=0, hi=1
```

**Complejidad:** O(1)

---

### `lerp(a, b, t)`

Interpolación lineal.

```typescript
function lerp(a: number, b: number, t: number): number
// Retorna: a + (b - a) × t
```

**Complejidad:** O(1)

---

### `percentile(arr, p)`

Calcula el percentil p de un array.

```typescript
function percentile(arr: number[], p: number): number
// p ∈ [0,1], ej: 0.50 = mediana
```

**Complejidad:** O(n log n) — requiere ordenamiento

---

### `mean(arr)`

Media aritmética.

```typescript
function mean(arr: number[]): number
```

**Complejidad:** O(n)

---

### `std(arr)`

Desviación estándar poblacional.

```typescript
function std(arr: number[]): number
```

**Complejidad:** O(n)

---

### `variance(arr)`

Varianza poblacional.

```typescript
function variance(arr: number[]): number
```

**Complejidad:** O(n)

---

### `gaussianRandom()`

Genera un número aleatorio con distribución normal N(0,1) usando Box-Muller.

```typescript
function gaussianRandom(): number
```

**Complejidad:** O(1)

---

### `wilsonCI(successes, n, z?)`

Intervalo de confianza Wilson para proporciones binomiales.

```typescript
function wilsonCI(successes: number, n: number, z?: number): {
  p: number;
  lower: number;
  upper: number;
}
// Default: z=1.96 (95% CI)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `successes` | `number` | Número de éxitos |
| `n` | `number` | Total de ensayos |
| `z` | `number` | Z-score (default 1.96 para 95%) |

**Complejidad:** O(1)

---

### `harmonicMean(values)`

Media armónica — un solo valor bajo arrastra el resultado.

```typescript
function harmonicMean(values: number[]): number
// Filtra valores < 0.01 para evitar división por cero
```

**Complejidad:** O(n)

---

## 11. Hooks — React Bridge

**Archivo:** `src/hooks/useLogosEngine.ts`

### `useLogosEngine(state)`

Hook principal que orquesta las 7 capas del motor de cómputo. Memoiza resultados con `useMemo`.

```typescript
function useLogosEngine(state: ConsciousnessState): EngineResult
```

**Retorno:** `EngineResult` — objeto completo con todas las métricas, señales, sesgos, políticas y recomendaciones.

**Dependencia de memoización:** Recalcula solo cuando `state` cambia (referencia).

---

### `useConsciousnessState(initialState)`

Hook para gestionar el estado de 24 dimensiones con helpers de actualización.

```typescript
function useConsciousnessState(initialState: ConsciousnessState): {
  state: ConsciousnessState;
  updateDimension: (key: StateKey, value: number) => void;
  updateMultiple: (updates: Partial<ConsciousnessState>) => void;
  reset: () => void;
  setState: React.Dispatch<React.SetStateAction<ConsciousnessState>>;
}
```

---

## 12. Services — API Client

**Archivo:** `src/services/api.js`

### `syncUser(userData)`

Sincroniza usuario con PostgreSQL backend.

```typescript
async function syncUser(userData: {
  id?: string;
  google_id?: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<{ id: number; /* ... */ } | null>
```

### `saveSession(sessionData)`

Guarda una sesión de evaluación.

```typescript
async function saveSession(sessionData: object): Promise<object | null>
```

### `getSessions(limit?, offset?)`

Obtiene sesiones del usuario.

```typescript
async function getSessions(limit?: number, offset?: number): Promise<object | null>
```

### `getLongitudinalReport()` / `getWeeklyReport()` / `getTimeline(days?)`

Obtienen reportes analíticos del usuario.

### `checkHealth()`

Verifica estado del backend API.

```typescript
async function checkHealth(): Promise<{ status: string } | null>
```

---

## 14. Backend — Agent Tools (OpenAI Agents SDK)

**Archivo:** `logos-backend/src/services/logos-agent.mjs`  
**Framework:** `@openai/agents` + `zod`  
**Modelo:** `gpt-4o`  
**Persistencia:** OpenAI Conversations API (DB-backed)

### 12 Custom Tools del Agente ΛOGOS

| # | Tool | Parámetros | Descripción |
|---|------|-----------|-------------|
| 1 | `get_user_state` | `phone_number: string` | Lee 24 dimensiones del usuario desde PostgreSQL |
| 2 | `compute_metrics` | `phone_number: string` | Computa Λ, Ω, V, S, C, F, Q, π(x) completo |
| 3 | `detect_levin_signals` | `phone_number: string` | Detecta 6 patrones patológicos (depresión, ansiedad, etc.) |
| 4 | `detect_hoffman_biases` | `phone_number: string` | Detecta 5 sesgos perceptuales |
| 5 | `update_user_state` | `phone_number, dimension, value` | Actualiza UNA dimensión (escribe a channel_users + profiles) |
| 6 | `link_account` | `phone_number, email` | Vincula WhatsApp phone con Google/Apple OAuth por email |
| 7 | `get_session_history` | `phone_number` | Historial unificado de sesiones (web + WhatsApp) |
| 8 | `evaluate_decision` | `phone_number` | Evalúa V≥0.60, S≤0.35, C≥0.50, Λ≥0.45 para tomar decisiones |
| 9 | `detect_crisis` | `phone_number` | Detección de A⁻ multi-sesión (Λ<0.20 por 2+ sesiones) |
| 10 | `run_simulation` | `phone_number` | Monte Carlo N=10,000 trayectoria probabilística |
| 11 | `schedule_calendar_event` | `title, date, time, duration` | Agenda evento Google Calendar (guarda en conversation_log) |
| 12 | `generate_weekly_report` | `phone_number` | Reporte semanal con comparación semana anterior |

### `sendTextMessage(userId, userMessage, options)`

Función principal que procesa mensajes entrantes y envía al agente.

```javascript
async function sendTextMessage(userId, userMessage, { navigationPrompt = null } = {})
// userId = phone number (ej: "+521234567890")
// Retorna: string (respuesta del agente)
```

**Flujo interno:**
1. Busca/crea conversationId en DB (`conversations` table)
2. Obtiene estado del usuario vía `getUserState()`
3. Inyecta contexto (estado, métricas, linking status)
4. Envía al agente OpenAI con tools habilitadas
5. Persiste conversationId en DB
6. Retorna respuesta

### `clearConversation(userId)`

Resetea la conversación de un usuario.

```javascript
async function clearConversation(userId)
// Elimina conversationId de DB, próximo mensaje creará nueva conversación
```

---

## 15. Backend — Database Functions

**Archivo:** `logos-backend/src/db/postgres.js`  
**Conexión:** Supabase PostgreSQL via `pg` Pool

### `findOrCreateUser(phone, name, channel)`

Busca usuario por teléfono o crea nuevo en `channel_users`.

```javascript
async function findOrCreateUser(phone, name = null, channel = 'whatsapp')
// Retorna: { id, phone, name, state, total_sessions, user_id, ... }
```

### `getUserState(userId)`

Obtiene estado unificado. **Si vinculado, lee de `profiles.last_state`.**

```javascript
async function getUserState(userId)
// userId = phone number
// Retorna: { state, lastSessionAt, name, totalSessions, isLinked, userId }
// state = profiles.last_state (si vinculado) || channel_users.state
```

### `updateUserState(userId, updates)`

Actualiza estado. **Si vinculado, escribe a AMBAS tablas.**

```javascript
async function updateUserState(userId, updates)
// updates = { sleep: 0.7 } (parcial)
// Escribe a: channel_users.state + profiles.last_state (si vinculado)
```

### `linkAccount(phone, email)`

Vincula phone de WhatsApp con perfil OAuth por email.

```javascript
async function linkAccount(phone, email)
// Busca profiles.email, si match: channel_users.user_id = profiles.id
// Retorna: { success, message, profile }
```

### `logConversation(phone, role, content, lambdaAt)`

Persiste mensaje en `conversation_log`.

### `getConversationHistory(phone, limit)`

Obtiene historial de mensajes para contexto.

### `getLinkedProfile(phone)`

Obtiene perfil unificado (channel_users + profiles JOIN).

---

## 16. Backend — Webhook Endpoints

**Archivo:** `logos-backend/src/routes/`

### POST `/webhook/whatsapp`

Recibe mensajes de Twilio WhatsApp. Procesa async después de 200 OK.

```
Request: Twilio webhook payload (From, Body, NumMedia, etc.)
Response: 200 OK (TwiML vacío)
Async: processWhatsAppMessage(from, body)
```

**Comandos especiales:**
- `!reset` — Resetea conversación
- Números 0-10 — Quick input para dimensiones
- `dominio:X` — Domain tracker zoom-in

### POST `/webhook/voice`

Recibe llamadas de voz Twilio. Inicia bridge con ElevenLabs.

### POST `/webhook/whatsapp/voice`

Recibe llamadas de voz desde WhatsApp.

### POST `/webhook/sms`

Recibe mensajes SMS Twilio.

### WS `/media-stream`

WebSocket para audio bridge Twilio ↔ ElevenLabs Conversational AI.

### GET `/api/user/:phone/state`

Obtiene estado del usuario por teléfono.

### POST `/api/user/:phone/state`

Actualiza estado del usuario.

### GET `/api/user/:phone/history`

Historial de sesiones.

### GET `/api/health`

Health check del backend.

---

## 17. Backend — AI Interpretation Endpoint

**Archivo:** `logos-backend/src/routes/protocol.js`

### POST `/api/protocol/interpret-panel`

Interpretación AI contextual por panel usando GPT-4o.

```typescript
// Request
{
  panel: string;   // Identificador del panel (22 opciones)
  data: object;    // Datos contextuales del panel
  lang?: string;   // 'es' | 'en' (default: 'es')
}

// Response
{
  result: {
    explanation: string;  // 3-4 oraciones explicando qué ve el usuario
    howToUse: string;     // Instrucciones de uso paso a paso
    insight: string;      // El patrón más importante ahora mismo
    action: string;       // Acción concreta recomendada
  },
  panel: string;          // Panel procesado
  tokens: number;         // Tokens consumidos
}
```

**Paneles disponibles (22):**

| Grupo | Paneles |
|-------|--------|
| **LOGOS** (13) | `coherence`, `landscape`, `estado`, `motor`, `decision`, `guia`, `trayectoria`, `montecarlo`, `alimento`, `seguimiento`, `biometrics`, `teoria`, `ifc` |
| **IFC** (9) | `ifc-dashboard`, `ifc-state`, `ifc-controls`, `ifc-simulator`, `ifc-montecarlo`, `ifc-attractor`, `ifc-policy`, `ifc-metapolicy`, `ifc-theory` |

**Configuración LLM:**
- Modelo: `gpt-4o`
- Temperature: `0.6`
- Max tokens: `500`
- Response format: `json_object`

---

## 18. IFC Bridge — deriveIFCFromLogos

**Archivo:** `src/components/IFCModel.jsx`

### `deriveIFCFromLogos(logos)`

Mapea el estado de 28 dimensiones LOGOS a las 12 variables internas del modelo IFC.

```typescript
function deriveIFCFromLogos(logos: Record<string, number>): IFCState | null
```

| Variable IFC | Fórmula de Derivación |
|-------------|----------------------|
| `cognitiveLoad` | `1 - (clarity·0.5 + focus·0.3 + wisdom·0.2)` |
| `fatigue` | `1 - (energy·0.5 + sleep·0.3 + exercise·0.2)` |
| `motivation` | `meaning·0.3 + mission·0.3 + joy·0.2 + contribution·0.2` |
| `anxiety` | `1 - (peace·0.5 + presence·0.3 + gratitude·0.2)` |
| `sleepQuality` | `sleep` |
| `hrv` | `exercise·0.4 + sleep·0.3 + energy·0.3` |
| `focusScore` | `focus·0.6 + clarity·0.4` |
| `hydration` | `nutrition·0.5 + nourishment·0.5` |
| `taskSwitchRate` | `1 - (focus·0.5 + creativity·0.3 + presence·0.2)` |
| `reactivity` | `1 - (presence·0.4 + peace·0.3 + compassion·0.3)` |
| `calendarLoad` | `1 - (community·0.3 + family·0.3 + contribution·0.2 + friendship·0.2)` |
| `resilience` | `faith·0.3 + presence·0.2 + love·0.2 + service·0.15 + meditation·0.15` |

**Mecanismo de Bridge:**
1. `LogosHumano.jsx` persiste estado 28-dim en `sessionStorage('logos-state-28')` en cada cambio
2. `IFCModel.jsx` lee `sessionStorage` al inicializar y aplica `deriveIFCFromLogos()`
3. Preset "Λ LOGOS" permite re-derivar en cualquier momento

---

## Referencias Cruzadas

- [Especificación Matemática](./MATHEMATICAL_SPEC.md)
- [Modelo de Datos](./DATA_MODEL.md)
- [Componentes React](./COMPONENTS.md)
- [Testing](./TESTING.md)
