# MODELO DE DATOS — LOGOS

> **Documento:** SRS-DATA-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 26512  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Estructura del Estado](#1-estructura-del-estado)
2. [Interfaces TypeScript](#2-interfaces-typescript)
3. [Esquema de 28 Dimensiones × 7 Dominios](#3-esquema-de-28-dimensiones--7-dominios)
4. [Constantes del Sistema](#4-constantes-del-sistema)
5. [Estructura de Breakdown por Métrica](#5-estructura-de-breakdown-por-métrica)
6. [Modelo de Base de Datos (PostgreSQL)](#6-modelo-de-base-de-datos-postgresql)
7. [Almacenamiento en Cliente](#7-almacenamiento-en-cliente)

---

## 1. Estructura del Estado

### 1.1 ConsciousnessState

El estado central del sistema es un `Record<StateKey, number>` con 28 claves, cada una ∈ [0, 1]:

```typescript
type StateKey = 
  // Physical (4)
  | 'sleep' | 'nutrition' | 'exercise' | 'energy'
  // Emotional (4)
  | 'peace' | 'gratitude' | 'love' | 'joy'
  // Mental (4)
  | 'clarity' | 'focus' | 'creativity' | 'wisdom'
  // Spiritual (4)
  | 'faith' | 'meditation' | 'service' | 'presence'
  // Relational (4)
  | 'family' | 'friendship' | 'community' | 'compassion'
  // Purpose (4)
  | 'meaning' | 'mission' | 'contribution' | 'legacy'
  // Alimento Sagrado (4)
  | 'nourishment' | 'taste_presence' | 'food_harmony' | 'gut_resonance';

type ConsciousnessState = Record<StateKey, number>;
```

### 1.2 Estado por Defecto

Todas las dimensiones inicializadas en 0.5 (punto neutro):

```typescript
const DEFAULT_STATE: ConsciousnessState = {
  sleep: 0.5, nutrition: 0.5, exercise: 0.5, energy: 0.5,
  peace: 0.5, gratitude: 0.5, love: 0.5, joy: 0.5,
  clarity: 0.5, focus: 0.5, creativity: 0.5, wisdom: 0.5,
  faith: 0.5, meditation: 0.5, service: 0.5, presence: 0.5,
  family: 0.5, friendship: 0.5, community: 0.5, compassion: 0.5,
  meaning: 0.5, mission: 0.5, contribution: 0.5, legacy: 0.5,
  nourishment: 0.5, taste_presence: 0.5, food_harmony: 0.5, gut_resonance: 0.5,
};
```

---

## 2. Interfaces TypeScript

### 2.1 Domain Types

```typescript
interface Dimension {
  label: string;    // Nombre en español
  desc: string;     // Descripción corta
  tooltip: string;  // Pregunta guía para el usuario
}

interface Domain {
  label: string;                    // Nombre del dominio
  icon: string;                     // Icono Unicode
  color: string;                    // Color hex
  dims: Record<string, Dimension>;  // 4 dimensiones
}

type DomainKey = 'physical' | 'emotional' | 'mental' | 'spiritual' | 'relational' | 'purpose' | 'alimento';
type DomainMap = Record<DomainKey, Domain>;
```

### 2.2 Computation Result Types

```typescript
interface BreakdownItem {
  key: string;
  label: string;
  value: number;
  weight: number;
  contribution: number;
  desc?: string;
}

interface LogosBreakdownGroup {
  label: string;
  tooltip: string;
  total: number;
  items: BreakdownItem[];
}

interface LogosResult {
  value: number;                                    // Λ ∈ [0,1]
  breakdown: Record<string, LogosBreakdownGroup>;   // 4 grupos
  components: Record<string, any>;                  // Configuración
}

interface FreeEnergyResult {
  value: number;              // F ∈ [0, 1.5]
  raw: number;                // F sin modular
  modulated: number;          // F modulado por Λ
  breakdown: BreakdownItem[]; // 28 factores
  lambdaEffect: number;       // Λ × 0.3
}

interface LevinSignal {
  type: string;       // Nombre del patrón
  severity: number;   // ∈ [0,1]
  icon: string;       // Emoji
  color: string;      // Hex
  desc: string;       // Descripción
  action: string;     // Acción recomendada
  logosLink: string;  // Conexión con Logos
}

interface WatsonResult {
  energy: number;                          // E = √(Σ gaps²)
  domainScores: Record<DomainKey, number>; // Promedios
  optimal: Record<DomainKey, number>;      // Óptimos Λ-modulados
  breakdown: Array<{
    domain: string; label: string;
    actual: number; optimal: number;
    gap: number; contribution: number;
  }>;
}

interface HoffmanBias {
  type: string;        // Nombre del sesgo
  desc: string;        // Descripción
  correction: string;  // Corrección sugerida
  logosLink: string;   // Conexión con Logos
}

interface CoherenceResult {
  coherence: number;                       // C ∈ [0,1]
  rawCoherence: number;                    // Media armónica cruda
  entropy: number;                         // Entropía interna
  domains: Record<DomainKey, number>;      // Promedios por dominio
  lambdaBoost: number;                     // Λ × 0.4
  breakdown: Array<{ label: string; value: number; color: string }>;
}

interface ViabilityResult {
  value: number;              // V ∈ [0,1]
  raw: number;                // V sin modular
  lambdaBoost: number;        // Λ × 0.35
  breakdown: BreakdownItem[];
}

interface EntropyResult {
  value: number;              // S ∈ [0,1]
  raw: number;                // S sin modular
  lambdaEffect: number;       // Λ × 0.4
  breakdown: BreakdownItem[];
}

interface OmegaResult {
  value: number;              // Ω ∈ [0,1]
  lambdaContribution: number; // Λ × 0.6
  derivedContribution: number;// derivedHealth × 0.4
  derivedHealth: number;
  breakdown: Array<{
    label: string; value: number;
    contribution: number; color: string;
  }>;
}

interface TrajectoryResult {
  value: number;              // Q
  distanceToAttractor: number;// D
  breakdown: { dV: number; dS: number; dL: number; D: number };
}

interface InhibitionPolicy {
  verdict: 'PAUSA' | 'ESPERA' | 'RECONECTA' | 'MONITOREA' | 'ACTÚA';
  color: string;
  reason: string;
  icon: string;
  lambdaDot: number;
}

interface MetaPolicy {
  verdict: string;  // 'ESCAPE A⁻' | 'ESCAPE' | 'ACTIVAR' | 'SOSTENER' | 'EVOLUCIONAR'
  color: string;
  reason: string;
}

interface Recommendation {
  priority: number;  // 1 (urgente) → 4 (crecimiento)
  domain: string;
  icon: string;
  text: string;
  type: string;      // 'URGENTE' | 'FORTALECER' | 'LOGOS' | 'EQUILIBRIO' | 'CRECER'
}
```

### 2.3 Monte Carlo Types

```typescript
interface MonteCarloStats {
  t: number;
  Λ_p5: number; Λ_p25: number; Λ_p50: number; Λ_p75: number; Λ_p95: number; Λ_mean: number;
  V_p5: number; V_p50: number; V_p95: number;
  S_p5: number; S_p50: number; S_p95: number;
  Ω_p50: number; Ω_mean: number;
  pPausa: number; pEspera: number; pReconecta: number; pMonitorea: number; pActua: number;
}

interface VerdictCI {
  count: number;
  p: number;
  lower: number;
  upper: number;
}

interface MonteCarloResult {
  stats: MonteCarloStats[];
  N: number; steps: number; sigma: number;
  pLambdaUp: number;
  finalLamMean: number; finalLamStd: number;
  pNegAttractor: number;
  verdictCI: Record<string, VerdictCI>;
  verdictNames: string[]; verdictColors: string[];
  dominantVerdict: string; dominantP: number;
  pNeverActua: number;
  ttaMedian: number | null;
}

interface TrajectoryPoint {
  t: number; V: number; S: number; Λ: number; Ω: number; C: number;
}
```

### 2.4 Engine Result (Hook Output)

```typescript
interface EngineResult {
  logos: LogosResult;
  lambda: number;
  freeEnergy: FreeEnergyResult;
  signals: LevinSignal[];
  watson: WatsonResult;
  biases: HoffmanBias[];
  coherence: CoherenceResult;
  viability: ViabilityResult;
  entropy: EntropyResult;
  omega: OmegaResult;
  trajectory: TrajectoryResult;
  policy: InhibitionPolicy;
  metaPolicy: MetaPolicy;
  recommendations: Recommendation[];
}
```

---

## 3. Esquema de 24 Dimensiones × 6 Dominios

| # | Dominio | Icono | Color | Dim 1 | Dim 2 | Dim 3 | Dim 4 |
|---|---------|-------|-------|-------|-------|-------|-------|
| 1 | **Cuerpo** | ◈ | `#10b981` | Sueño | Nutrición | Movimiento | Energía |
| 2 | **Emociones** | ◇ | `#f59e0b` | Paz Interior | Gratitud | Amor | Alegría |
| 3 | **Mente** | ⟐ | `#6366f1` | Claridad | Enfoque | Creatividad | Sabiduría |
| 4 | **Espíritu** | ✦ | `#a855f7` | Fe | Meditación | Servicio | Presencia |
| 5 | **Relaciones** | ⬡ | `#ec4899` | Familia | Amistades | Comunidad | Compasión |
| 6 | **Propósito** | ◎ | `#0ea5e9` | Sentido | Misión | Contribución | Legado |

### Detalle de Cada Dimensión

| Clave | Label | Tooltip (pregunta guía) |
|-------|-------|------------------------|
| `sleep` | Sueño | ¿Cuántas horas dormiste y qué tan reparador fue tu sueño? |
| `nutrition` | Nutrición | ¿Comiste de forma balanceada hoy? |
| `exercise` | Movimiento | ¿Hiciste algún tipo de ejercicio o movimiento físico hoy? |
| `energy` | Energía | ¿Qué tanta energía sientes para funcionar en tu día? |
| `peace` | Paz Interior | ¿Te sientes en calma o hay agitación interna? |
| `gratitude` | Gratitud | ¿Reconoces y agradeces las cosas buenas en tu vida? |
| `love` | Amor | ¿Sientes amor dando y recibiendo en tus relaciones? |
| `joy` | Alegría | ¿Hay un gozo de fondo en tu día, no solo placer momentáneo? |
| `clarity` | Claridad | ¿Puedes pensar con claridad o sientes niebla mental? |
| `focus` | Enfoque | ¿Puedes concentrarte en una tarea sin distraerte fácilmente? |
| `creativity` | Creatividad | ¿Fluyen ideas nuevas o te sientes estancado creativamente? |
| `wisdom` | Sabiduría | ¿Tomas decisiones con perspectiva amplia, no solo reacción? |
| `faith` | Fe | ¿Confías en que hay un propósito mayor guiando tu vida? |
| `meditation` | Meditación | ¿Dedicaste tiempo hoy al silencio, oración o meditación? |
| `service` | Servicio | ¿Hiciste algo por alguien más sin esperar nada a cambio? |
| `presence` | Presencia | ¿Estás presente en el momento o vives en el pasado/futuro? |
| `family` | Familia | ¿Estás conectado y presente con tu familia? |
| `friendship` | Amistades | ¿Tienes amistades profundas con quienes puedes ser tú mismo? |
| `community` | Comunidad | ¿Participas en algo más grande que tú? |
| `compassion` | Compasión | ¿Sientes y actúas ante el sufrimiento de otros? |
| `meaning` | Sentido | ¿Sientes que tu vida tiene sentido y dirección? |
| `mission` | Misión | ¿Sabes cuál es tu misión o llamado en esta vida? |
| `contribution` | Contribución | ¿Tu trabajo y acciones están creando impacto positivo real? |
| `legacy` | Legado | ¿Estás construyendo algo que permanecerá después de ti? |

---

## 4. Constantes del Sistema

### 4.1 Umbrales de Atractores

```typescript
const V_STAR = 0.70;       // Viabilidad objetivo (A⁺)
const S_STAR = 0.30;       // Entropía objetivo (A⁺)
const LAMBDA_STAR = 0.60;  // Logos objetivo (A⁺)
```

### 4.2 Paleta de Colores (COLORS)

| Clave | Hex | Uso |
|-------|-----|-----|
| `bg` | `#06060f` | Fondo principal |
| `surface` | `#0d0d1f` | Superficie de tarjetas |
| `surface2` | `#151530` | Superficie secundaria |
| `surface3` | `#1e1e3d` | Superficie terciaria |
| `border` | `#2a2a55` | Bordes |
| `borderLight` | `#3a3a70` | Bordes claros |
| `text` | `#f0f0f8` | Texto principal |
| `textDim` | `#b0b0d0` | Texto atenuado |
| `textMuted` | `#7070a0` | Texto silenciado |
| `viability` | `#10b981` | V — Verde esmeralda |
| `entropy` | `#ef4444` | S — Rojo |
| `logos` | `#c084fc` | Λ — Púrpura claro |
| `coherence` | `#6366f1` | C — Índigo |
| `omega` | `#fbbf24` | Ω — Dorado |
| `freeEnergy` | `#f97316` | F — Naranja |
| `accent` | `#818cf8` | Acento general |
| `allow` | `#10b981` | ACTÚA — Verde |
| `wait` | `#f59e0b` | ESPERA — Amarillo |
| `block` | `#ef4444` | PAUSA — Rojo |
| `connect` | `#a855f7` | RECONECTA — Púrpura |
| `gold` | `#fbbf24` | Dorado |
| `negAttractor` | `#dc2626` | A⁻ — Rojo oscuro |
| `mc` | `#06b6d4` | Monte Carlo — Cyan |

### 4.3 Tipografías (FONTS)

| Clave | Stack | Uso |
|-------|-------|-----|
| `display` | Palatino Linotype, Book Antiqua, Georgia, serif | Títulos, fórmulas |
| `sans` | Segoe UI, system-ui, -apple-system, sans-serif | Texto general |
| `mono` | JetBrains Mono, Fira Code, SF Mono, monospace | Valores numéricos, código |

---

## 5. Estructura de Breakdown por Métrica

### 5.1 Λ (Logos) — Breakdown por Grupo

```json
{
  "reception": {
    "label": "Recepción del Canal",
    "tooltip": "Qué tan abierto está tu canal...",
    "total": 0.325,
    "items": [
      { "key": "faith", "weight": 0.20, "label": "Fe", "value": 0.80, "contribution": 0.160 },
      { "key": "meditation", "weight": 0.15, "label": "Meditación", "value": 0.70, "contribution": 0.105 },
      { "key": "presence", "weight": 0.15, "label": "Presencia", "value": 0.40, "contribution": 0.060 }
    ]
  },
  "action": { /* ... */ },
  "decoding": { /* ... */ },
  "gratitude": { /* ... */ }
}
```

### 5.2 V, S, F — Breakdown Lineal

```json
[
  { "key": "sleep", "label": "sleep", "weight": 0.08, "value": 0.70, "contribution": 0.056 },
  { "key": "peace", "label": "peace", "weight": 0.07, "value": 0.60, "contribution": 0.042 }
]
```

### 5.3 Ω — Breakdown de Composición

```json
[
  { "label": "Λ Logos (60%)", "value": 0.52, "contribution": 0.312, "color": "#c084fc" },
  { "label": "V Viabilidad (+)", "value": 0.65, "contribution": 0.078, "color": "#10b981" },
  { "label": "C Coherencia (+)", "value": 0.55, "contribution": 0.055, "color": "#6366f1" },
  { "label": "S Entropía (−)", "value": 0.35, "contribution": -0.035, "color": "#ef4444" },
  { "label": "F Energía Libre (−)", "value": 0.40, "contribution": -0.032, "color": "#f97316" }
]
```

---

## 6. Modelo de Base de Datos (Supabase PostgreSQL)

> **Proveedor:** Supabase (cloud)  
> **Project Ref:** `qfqgplopnwxilnyeajbt`  
> **Region:** `us-west-2`  
> **Migration:** `supabase/migration.sql` en logos-backend

### 6.1 Tabla `profiles` (extiende `auth.users`)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `UUID` | PRIMARY KEY, FK → auth.users(id) ON DELETE CASCADE | Supabase Auth UUID |
| `email` | `VARCHAR(255)` | UNIQUE INDEX | Email del usuario |
| `name` | `VARCHAR(255)` | — | Nombre completo |
| `picture` | `TEXT` | — | URL de avatar |
| `google_id` | `VARCHAR(255)` | INDEX | ID de Google (legacy) |
| `phone` | `VARCHAR(20)` | INDEX | Teléfono con código de país (ej: +521234567890) |
| `last_state` | `JSONB` | DEFAULT '{}' | **Último estado de 24 dimensiones** (cross-channel) |
| `whatsapp_optin` | `BOOLEAN` | DEFAULT false | Si el usuario vio la pantalla de WhatsApp opt-in |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |
| `last_login` | `TIMESTAMPTZ` | DEFAULT NOW() | Último login |

**RLS Policies:**
- `Users can view own profile` — SELECT WHERE auth.uid() = id
- `Users can update own profile` — UPDATE WHERE auth.uid() = id

**Trigger:** `handle_new_user()` — Auto-crea profile al registrarse en auth.users

### 6.2 Tabla `channel_users` (WhatsApp/Voice/SMS)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | ID auto-incremental |
| `phone` | `VARCHAR(20)` | UNIQUE NOT NULL, INDEX | Teléfono (PK funcional) |
| `channel` | `VARCHAR(20)` | DEFAULT 'whatsapp' | Canal de origen |
| `name` | `VARCHAR(255)` | — | Nombre del usuario |
| `email` | `VARCHAR(255)` | — | Email (para linking) |
| `user_id` | `UUID` | FK → profiles(id) ON DELETE SET NULL, INDEX | **Vínculo con perfil web** |
| `state` | `JSONB` | DEFAULT '{}' | Estado local (fallback si no vinculado) |
| `total_sessions` | `INTEGER` | DEFAULT 0 | Total de sesiones |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Primera interacción |
| `last_session_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última sesión |

**Lógica de estado unificado:**
- Si `user_id` es NOT NULL → `getUserState()` lee de `profiles.last_state`
- Si `user_id` es NULL → lee de `channel_users.state` (local)
- `updateUserState()` escribe a ambas tablas cuando vinculado

### 6.3 Tabla `sessions` (snapshots con métricas)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | ID de sesión |
| `user_id` | `UUID` | FK → profiles(id) ON DELETE CASCADE | Perfil vinculado |
| `channel_user_id` | `INTEGER` | FK → channel_users(id) ON DELETE SET NULL | Canal de origen |
| `channel` | `VARCHAR(20)` | DEFAULT 'web' | web/whatsapp/voice/sms |
| `start_time` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Inicio |
| `end_time` | `TIMESTAMPTZ` | — | Fin |
| `duration_min` | `INTEGER` | — | Duración en minutos |
| `lambda` | `REAL` | — | Λ de la sesión |
| `omega` | `REAL` | — | Ω |
| `viability` | `REAL` | — | V |
| `entropy` | `REAL` | — | S |
| `coherence` | `REAL` | — | C |
| `free_energy` | `REAL` | — | F |
| `trajectory` | `REAL` | — | Q |
| `verdict` | `VARCHAR(50)` | — | Veredicto π(x) |
| `state_snapshot` | `JSONB` | — | ConsciousnessState completo |
| `domain_scores` | `JSONB` | — | Promedios por dominio |

### 6.4 Tabla `conversations` (persistencia OpenAI)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | ID |
| `channel_id` | `VARCHAR(50)` | UNIQUE NOT NULL | phone o user_id |
| `conversation_id` | `VARCHAR(255)` | NOT NULL | OpenAI Conversations API ID |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creación |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última actualización |

### 6.5 Tabla `conversation_log` (mensajes WhatsApp)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | ID |
| `phone` | `VARCHAR(20)` | NOT NULL, INDEX | Teléfono del usuario |
| `role` | `VARCHAR(10)` | NOT NULL | 'user' o 'agent' |
| `content` | `TEXT` | NOT NULL | Contenido del mensaje |
| `lambda_at` | `REAL` | — | Λ al momento del mensaje |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Timestamp |

### 6.6 Tabla `daily_snapshots`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | ID |
| `user_id` | `UUID` | FK → profiles(id) ON DELETE CASCADE | Perfil |
| `date` | `DATE` | NOT NULL | Fecha del snapshot |
| `lambda` | `REAL` | — | Λ del día |
| `omega` | `REAL` | — | Ω del día |
| `viability` | `REAL` | — | V del día |
| `entropy` | `REAL` | — | S del día |
| `verdict` | `VARCHAR(50)` | — | Veredicto del día |

---

## 7. Almacenamiento en Cliente

### 7.1 Supabase Auth (localStorage)

Supabase Auth SDK gestiona automáticamente el almacenamiento de sesión en `localStorage`:

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `sb-<ref>-auth-token` | JSON | JWT + refresh token (gestionado por Supabase SDK) |

### 7.2 localStorage (app-level)

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `logos-onboarding-done` | string | `'true'` si completó onboarding |
| `logos-session-history` | JSON | Historial de sesiones local (fallback) |

### 7.3 sessionStorage (v3.3.0)

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `logos-state-28` | JSON | Estado 28-dim LOGOS persistido para IFC bridge |
| `logos-db-user-id` | string | ID del usuario en la DB del backend M5 |
| `ai-guide-{panel}` | JSON | Cache de interpretación AI por panel (TabAIGuide) |

**Bridge IFC ↔ LOGOS:**
- `LogosHumano.jsx` escribe `logos-state-28` en cada cambio de estado (28 dimensiones)
- `IFCModel.jsx` lee `logos-state-28` al inicializar y aplica `deriveIFCFromLogos()` para mapear 28 dims → 12 vars IFC
- El preset "Λ LOGOS" en IFC re-lee `sessionStorage` y re-deriva el estado

**Cache AI Guide:**
- `TabAIGuide.jsx` cachea respuestas AI en `sessionStorage` con key `ai-guide-{panel}`
- Evita llamadas redundantes al endpoint `/api/protocol/interpret-panel`
- Cache se limpia al cerrar pestaña/navegador (sessionStorage lifecycle)

### 7.4 Ciclo de Vida de Autenticación

```
Login (Google/Apple) → Supabase Auth redirect → JWT en localStorage
                     → checkProfilePhone() → needsPhone?
                     → handlePhoneSave() → profiles.phone + channel_users link
                     → WhatsApp opt-in → profiles.whatsapp_optin = true
                     → App principal (estado restaurado de profiles.last_state)

Logout → supabase.auth.signOut() → JWT eliminado de localStorage
       → Estados React limpiados → Login page
```

---

## Referencias Cruzadas

- [Especificación Matemática](./MATHEMATICAL_SPEC.md)
- [API Reference](./API_REFERENCE.md)
- [Componentes React](./COMPONENTS.md)
- [Testing](./TESTING.md)
