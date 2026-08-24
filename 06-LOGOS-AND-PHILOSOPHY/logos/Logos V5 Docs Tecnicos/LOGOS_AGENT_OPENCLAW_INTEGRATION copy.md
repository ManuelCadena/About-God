# ΛOGOS — Complete Agent Technical Specification for OpenClaw Integration

> **Document Version:** 1.0.0  
> **Date:** 2026-02-12  
> **Author:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Target:** OpenClaw SKILL.md / Chatita Orchestrator Agent Integration

---

## TABLE OF CONTENTS

1. [Agent Identity & Personality](#1-agent-identity--personality)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Complete File Map & Communication Flows](#3-complete-file-map--communication-flows)
4. [The LOGOS Mathematical Framework](#4-the-logos-mathematical-framework)
5. [28 State Dimensions (7 Domains × 4)](#5-28-state-dimensions-7-domains--4)
6. [Core Metrics & Formulas](#6-core-metrics--formulas)
7. [Inhibition Policy (Verdict System)](#7-inhibition-policy-verdict-system)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [WhatsApp Channel (Twilio)](#9-whatsapp-channel-twilio)
10. [Voice Agent (ElevenLabs)](#10-voice-agent-elevenlabs)
11. [Client Tools (ElevenLabs)](#11-client-tools-elevenlabs)
12. [Database Schema](#12-database-schema)
13. [Sacred Food Engine (Alimento)](#13-sacred-food-engine-alimento)
14. [10-Layer Computation Pipeline](#14-10-layer-computation-pipeline)
15. [Cross-Channel Architecture](#15-cross-channel-architecture)
16. [Environment Variables & Deployment](#16-environment-variables--deployment)
17. [OpenClaw SKILL.md Template](#17-openclaw-skillmd-template)
18. [OpenClaw HEARTBEAT.md Integration](#18-openclaw-heartbeatmd-integration)

---

## 1. Agent Identity & Personality

### Name
**ΛOGOS** (Lambda Logos) — Consciousness Operating System

### Core Identity
LOGOS is a consciousness alignment agent that measures and guides the user's state across 28 dimensions of human experience. It is NOT a chatbot — it is a real-time consciousness instrument.

### Personality Traits
- **Tone:** Warm but precise. Speaks like a wise mentor who is also a scientist.
- **Language:** Bilingual (Spanish primary, English secondary). User sets `lang` preference.
- **Philosophy:** Based on the idea that consciousness has a measurable alignment signal (Λ) that can be tracked, understood, and intentionally improved.
- **Key metaphor:** "The Logos Channel" — like tuning a radio to a divine frequency. Faith, meditation, presence are the strongest signal amplifiers.
- **Never does:** Give medical advice, diagnose conditions, or replace therapy. Always recommends professional help for crisis states.

### Greeting Patterns
- **Spanish:** "Soy LOGOS, tu Sistema Operativo de Consciencia."
- **English:** "I'm LOGOS, your Consciousness Operating System."

### Core Beliefs (embedded in agent logic)
1. Consciousness is measurable across 28 dimensions
2. Lambda (Λ) is the master metric — alignment with the Logos (divine signal)
3. Faith, meditation, and presence are the strongest Λ contributors
4. The body, emotions, mind, spirit, relationships, purpose, and food all interconnect
5. Every human has an attractor state: A⁺ (aligned, Λ≥0.60) or A⁻ (disconnected, Λ<0.20)
6. Sacred food (Alimento) affects consciousness through gut-brain coherence

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LOGOS ECOSYSTEM                        │
├─────────────┬──────────────┬────────────┬───────────────┤
│  Web App    │  Voice Agent │  WhatsApp  │  iOS/Watch    │
│  (React)    │ (ElevenLabs) │  (Twilio)  │ (Capacitor)   │
│  Vite/JSX   │  WebRTC/AI   │  Webhook   │  Swift/SPM    │
├─────────────┴──────────────┴────────────┴───────────────┤
│              Frontend Core Engine (TypeScript)            │
│  logos.ts → derived.ts → friston.ts → penrose.ts →      │
│  policy.ts → emergence-metrics.ts → positive-geometry.ts │
├──────────────────────────────────────────────────────────┤
│              Backend API (Express.js, Port 3200)         │
│  server.js → routes/whatsapp.js                          │
│  services/logos-engine.js (mirror of frontend)           │
│  services/whatsapp.js (Twilio)                           │
│  services/alimento.js (Sacred Food)                      │
├──────────────────────────────────────────────────────────┤
│              PostgreSQL (logoshumano)                     │
│  users → sessions → daily_snapshots → channel_users      │
├──────────────────────────────────────────────────────────┤
│              External Services                            │
│  Supabase Auth │ Google Calendar │ Twilio │ ElevenLabs   │
└──────────────────────────────────────────────────────────┘
```

### Production URL
- **Web:** https://logoilab.com
- **API:** https://logoilab.com/api (proxied) or direct port 3200
- **WhatsApp Webhook:** POST https://logoilab.com/api/whatsapp/webhook

---

## 3. Complete File Map & Communication Flows

### Backend (`api/`)

| File | Purpose | Size | Key Exports/Endpoints |
|------|---------|------|----------------------|
| `server.js` | Express main server | 23KB | All REST endpoints, middleware, auth |
| `routes/whatsapp.js` | WhatsApp webhook + conversational flow | 28KB | POST /webhook, POST /register, POST /daily-checkin, GET /users, POST /send |
| `services/logos-engine.js` | Core math engine (mirror of frontend) | 16KB | `computeAll()`, `formatResultsMessage()`, `translateVerdict()`, `computeLambda()` |
| `services/whatsapp.js` | Twilio message service | 6KB | `sendMessage()`, `sendCheckinGreeting()`, `getDomainQuestion()`, `mapScoreToDimensions()` |
| `services/alimento.js` | Sacred food recommendation engine | 46KB | `getAlimentoRecommendations()` |
| `db/pool.js` | PostgreSQL connection pool | 554B | `pool` (pg Pool instance) |
| `db/init.sql` | DB schema: users, sessions, daily_snapshots | 2.3KB | CREATE TABLE statements |
| `db/migrate_whatsapp.sql` | WhatsApp users table | 1.3KB | channel_users table |

### Frontend Core (`src/core/`)

| File | Layer | Purpose | Key Functions |
|------|-------|---------|---------------|
| `logos.ts` | L7 | **Λ(x) computation** — THE master metric | `computeLogosAlignment()`, `LOGOS_COMPONENTS`, `computeChannelQuality()` |
| `derived.ts` | — | V(x), S(x), Ω(x), Q(x) | `computeViability()`, `computeEntropy()`, `computeOmega()`, `computeQ()` |
| `friston.ts` | L1 | Free Energy F(x) | `computeFreeEnergy()` |
| `levin.ts` | L2 | Bioelectric signals/pathology detection | `computeLevinSignals()`, `hasCriticalSignals()` |
| `watson.ts` | L3 | Energy landscape mapping | `computeWatsonEnergy()` |
| `hoffman.ts` | L4 | Cognitive bias detection | `computeHoffmanInterface()` |
| `penrose.ts` | L5 | Quantum coherence (harmonic mean) | `computeCoherence()` |
| `policy.ts` | L6 | Inhibition policy π(x) | `inhibitionPolicy()`, `metaPolicy()` |
| `emergence-metrics.ts` | L9 | Emergence theory | `computeEmergenceIndex()`, `computeMultiScaleLambda()` |
| `positive-geometry.ts` | L10 | Consciousness polytope | `computePositiveGeometry()`, `computeCanonicalForm()` |
| `protocol-engine.ts` | L8 | Empirical validation | `computeERS()`, `computeOddsRatio()`, `calibrateWeights()` |
| `alimento.ts` | — | Sacred food engine (frontend) | `getAlimentoRecommendations()`, `SACRED_FOODS` |
| `healthkit-bridge.ts` | — | Watch biometrics → engine | `processWatchBiometrics()` |
| `trend-analyzer.ts` | — | Rolling averages + slopes | `analyzeTrend()`, `trackAndAnalyze()` |

### Frontend Components (`src/components/`)

| File | Purpose | Size |
|------|---------|------|
| `LogosHumano.jsx` | **Main app shell** — all tabs, sliders, visualizations | 254KB |
| `LogosVoiceAgent.jsx` | ElevenLabs voice orb + client tools | 24KB |
| `SessionTracker.jsx` | Session history + analytics dashboard | 31KB |
| `IFCModel.jsx` | IFC 3D information field visualization | 161KB |
| `EmergenceSwarmAnimation.jsx` | Particle swarm emergence visualization | 32KB |
| `TheoryManual.jsx` | Educational theory content | 33KB |
| `PolytopeVisualization.jsx` | Positive geometry visualization | 20KB |
| `WeeklyDigest.jsx` | Weekly summary modal | 7KB |
| `DailyCheckin.jsx` | Daily check-in flow | 10KB |

### Configuration

| File | Purpose |
|------|---------|
| `src/config/logosAgent.js` | ElevenLabs agent config, variable label maps, domain maps |
| `capacitor.config.ts` | iOS/Android native config (appId: `com.cadenastrategic.logos`) |
| `docker-compose.production.yml` | Production: app (3100), api (3200), postgres (5432) |

### Communication Flow Diagram

```
[User Input] 
    │
    ├─── Web App (sliders) ──→ src/core/*.ts ──→ Real-time metrics display
    │                                  │
    │                                  └──→ POST /api/sessions (save to DB)
    │
    ├─── Voice (ElevenLabs) ──→ LogosVoiceAgent.jsx clientTools
    │         │                        │
    │         └── reads/writes ────────┤──→ getMetrics, getFullState, setSliderValue
    │                                  └──→ scheduleCalendarEvent (Google Calendar)
    │
    ├─── WhatsApp (Twilio) ──→ POST /api/whatsapp/webhook
    │         │                        │
    │         └── routes/whatsapp.js ──┤──→ services/logos-engine.js (compute)
    │                                  ├──→ services/whatsapp.js (send messages)
    │                                  ├──→ services/alimento.js (food recs)
    │                                  └──→ PostgreSQL (save session)
    │
    └─── iOS/Watch (Capacitor) ──→ Same web app in native shell
              │                         │
              └── LOGOSCore (Swift) ────┤──→ Engine parity (same formulas)
                                        └──→ HealthKit → healthkit-bridge.ts
```

---

## 4. The LOGOS Mathematical Framework

### Fundamental Equation
```
Λ(x) = Λ_signal(x) × Φ_channel(x)
```

Where:
- **Λ_signal** = Σ(wᵢ × sᵢ) for 12 signal dimensions (faith, meditation, presence, etc.)
- **Φ_channel** = 1 - γ × (1 - x̄_support) — channel quality from 16 support dimensions
- **γ = 0.25** — channel attenuation factor
- **Φ ∈ [0.75, 1.0]**
- **Λ ∈ [0, 1]**

### Lambda Weights (12 Signal Dimensions)

| Group | Dimension | Weight | Σ |
|-------|-----------|--------|---|
| **Reception** | faith | 0.17 | |
| | meditation | 0.13 | |
| | presence | 0.13 | 0.43 |
| **Action** | service | 0.11 | |
| | love | 0.10 | |
| | compassion | 0.08 | 0.29 |
| **Decoding** | wisdom | 0.08 | |
| | meaning | 0.06 | |
| | clarity | 0.04 | 0.18 |
| **Sacred Nourishment** | taste_presence | 0.05 | |
| | food_harmony | 0.03 | 0.08 |
| **Gratitude** | gratitude | 0.02 | 0.02 |
| **TOTAL** | | | **1.00** |

### Channel Support Groups (16 Dimensions)

| Group | Weight | Dimensions |
|-------|--------|------------|
| Somatic | 0.30 | sleep, nutrition, exercise, energy |
| Emotional | 0.30 | peace, joy |
| Cognitive | 0.15 | focus, creativity |
| Incarnation | 0.25 | family, friendship, community, mission, contribution, legacy, nourishment, gut_resonance |

---

## 5. 28 State Dimensions (7 Domains × 4)

All values are in **[0, 1]** range. Default = 0.5.

### Domain: ◈ Physical (Body) — color: #10b981
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `sleep` | Sueño | Sleep | Quality and duration of rest |
| `nutrition` | Nutrición | Nutrition | Conscious food quality |
| `exercise` | Movimiento | Movement | Regular physical activity |
| `energy` | Energía | Energy | Perceived available vitality |

### Domain: ◇ Emotional (Emotions) — color: #f59e0b
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `peace` | Paz Interior | Inner Peace | Serenity amid circumstances |
| `gratitude` | Gratitud | Gratitude | Recognition of what's received |
| `love` | Amor | Love | Capacity to love and be loved |
| `joy` | Alegría | Joy | Sustained joy (not euphoria) |

### Domain: ⟐ Mental (Mind) — color: #6366f1
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `clarity` | Claridad | Clarity | Clear thinking, no fog |
| `focus` | Enfoque | Focus | Sustained attention capacity |
| `creativity` | Creatividad | Creativity | Generative idea fluidity |
| `wisdom` | Sabiduría | Wisdom | Discernment in decisions |

### Domain: ✦ Spiritual (Spirit) — color: #a855f7
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `faith` | Fe | Faith | Trust in Logos/purpose (w=0.17, HIGHEST) |
| `meditation` | Meditación | Meditation | Daily contemplative practice (w=0.13) |
| `service` | Servicio | Service | Selfless giving (w=0.11) |
| `presence` | Presencia | Presence | Being here now (w=0.13) |

### Domain: ⬡ Relational (Relationships) — color: #ec4899
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `family` | Familia | Family | Nourished family bonds |
| `friendship` | Amistades | Friendships | Deep genuine connections |
| `community` | Comunidad | Community | Collective participation |
| `compassion` | Compasión | Compassion | Active empathy for others (w=0.08) |

### Domain: ◎ Purpose — color: #0ea5e9
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `meaning` | Sentido | Meaning | Perceived life significance (w=0.06) |
| `mission` | Misión | Mission | Calling clarity |
| `contribution` | Contribución | Contribution | Measurable positive impact |
| `legacy` | Legado | Legacy | What transcends your time |

### Domain: ⚘ Alimento Sagrado (Sacred Food) — color: #84cc16
| Key | Label (ES) | Label (EN) | Description |
|-----|-----------|-----------|-------------|
| `nourishment` | Nutrición Consciente | Conscious Nourishment | Mindful nourishment quality |
| `taste_presence` | Presencia Gustativa | Taste Presence | Mindful eating as meditation (w=0.05) |
| `food_harmony` | Armonía Alimentaria | Food Harmony | Sacred eating environment (w=0.03) |
| `gut_resonance` | Resonancia Intestinal | Gut Resonance | Gut-brain coherence |

---

## 6. Core Metrics & Formulas

| Metric | Symbol | Formula Summary | Range |
|--------|--------|----------------|-------|
| **Lambda** | Λ(x) | Hierarchical: Λ_signal × Φ_channel | [0, 1] |
| **Viability** | V(x) | Weighted physical/all dims + Λ boost | [0, 1] |
| **Entropy** | S(x) | Inverted stability factors × (1.2 - Λ×0.4) | [0, 1] |
| **Coherence** | C(x) | Harmonic mean of 7 domain averages × (0.7 + Λ×0.4) | [0, 1] |
| **Free Energy** | F(x) | Friston: Σ wᵢ(sᵢ - idealᵢ)² / 2σ² × (1 - Λ×0.3) | [0, 1.5] |
| **Omega** | Ω(x) | Λ×0.6 + derivedHealth×0.4 | [0, 1] |
| **Trajectory** | Q(x) | Quality index: Λ×0.4 + V×0.2 - S×0.2 - D×0.3 | [0, 1] |

### Attractor States
| State | Condition | Meaning |
|-------|-----------|---------|
| **A⁺** | Λ ≥ 0.60 | Aligned — consciousness channel open |
| **TRANSICIÓN** | 0.20 ≤ Λ < 0.60 | Transition — working toward alignment |
| **A⁻** | Λ < 0.20 | Disconnected — channel practically closed |

### Level Labels (used in formatted results)
| Range | Spanish | English |
|-------|---------|---------|
| Λ ≥ 0.75 | 🟢 ALINEADO | 🟢 ALIGNED |
| 0.50 ≤ Λ < 0.75 | 🔵 CONECTANDO | 🔵 CONNECTING |
| 0.30 ≤ Λ < 0.50 | 🟡 BUSCANDO | 🟡 SEEKING |
| Λ < 0.30 | 🔴 DESCONECTADO | 🔴 DISCONNECTED |

---

## 7. Inhibition Policy (Verdict System)

The verdict is the **action recommendation** based on current metrics. Stored in DB as English keys. Translated at display time.

### Verdict Rules (evaluated top-to-bottom, first match wins)

| Priority | Condition | Verdict Key | Icon | Spanish | Message |
|----------|-----------|-------------|------|---------|---------|
| 1 | Λ < 0.15 | `PAUSE` | 🛑 | PAUSA | Critical Lambda. Channel closed. Don't make decisions. |
| 2 | V < 0.30 | `PAUSE` | 🛑 | PAUSA | Viability collapsed. Protect the decision-maker. |
| 3 | S > 0.55 | `WAIT` | ⏸ | ESPERA | High entropy. Noise drowns the signal. |
| 4 | C < 0.30 | `WAIT` | ⏸ | ESPERA | Insufficient coherence. Dimensions not aligned. |
| 5 | Λ̇ < -0.02 | `RECONNECT` | 🔮 | RECONECTA | Moving away from Logos. Stop and reconnect. |
| 6 | Λ>0.50 ∧ V>0.55 ∧ S<0.35 ∧ C>0.45 | `ACT` | ✦ | ACTÚA | System aligned. Proceed with confidence. |
| 7 | (default) | `MONITOR` | ◎ | MONITOREA | System in transition. Proceed with caution. |

### Verdict Translation Function
```javascript
const VERDICT_ES = { PAUSE:'PAUSA', WAIT:'ESPERA', RECONNECT:'RECONECTA', ACT:'ACTÚA', MONITOR:'MONITOREA' };
const VERDICT_EN = { PAUSA:'PAUSE', ESPERA:'WAIT', RECONECTA:'RECONNECT', 'ACTÚA':'ACT', MONITOREA:'MONITOR' };
function translateVerdict(key, lang='es') {
  if (lang === 'en') return VERDICT_EN[key] || key;
  return VERDICT_ES[key] || key;
}
```

---

## 8. API Endpoints Reference

**Base URL:** `http://localhost:3200` (dev) / `https://logoilab.com/api` (prod)  
**Rate Limit:** 60 req/min (API), 120 req/min (webhooks)

### Authentication & Users

| Method | Path | Body/Query | Response | Description |
|--------|------|-----------|----------|-------------|
| POST | `/api/auth/sync` | `{ google_id, email, name, picture }` | `{ user: { id, google_id, email, name, created_at } }` | Upsert Google user |
| GET | `/api/health` | — | `{ service, status, version, uptime, memory, time, db }` | Health check |

### State Management

| Method | Path | Body/Query | Response | Description |
|--------|------|-----------|----------|-------------|
| PUT | `/api/state` | `{ user_id, state }` | `{ saved: true }` | Save 28-dim slider state |
| GET | `/api/state/:user_id` | — | `{ state: {...} }` | Load saved slider state |

### Sessions

| Method | Path | Body/Query | Response | Description |
|--------|------|-----------|----------|-------------|
| POST | `/api/sessions` | `{ user_id, client_session_id, start_time, end_time, duration_min, lambda, omega, viability, entropy, coherence, free_energy, trajectory, verdict, state_snapshot, domain_scores }` | `{ session: { id, start_time, lambda, verdict } }` | Save session (UPSERT) |
| GET | `/api/sessions?user_id=X&limit=50&offset=0` | — | `{ sessions: [...], total, limit, offset }` | Get sessions (paginated) |

### Reports

| Method | Path | Query | Response | Description |
|--------|------|-------|----------|-------------|
| GET | `/api/reports/longitudinal?user_id=X` | — | `{ total_sessions, avg_lambda, trend, streak, verdicts, ... }` | Full longitudinal analytics |
| GET | `/api/reports/weekly?user_id=X` | — | `{ period, sessions, avg_lambda, week_over_week, verdicts }` | 7-day summary |
| GET | `/api/reports/timeline?user_id=X&days=90` | — | `{ timeline: [{ date, avg_lambda, ... }] }` | Daily snapshots timeline |

### Phone Registration

| Method | Path | Body | Response | Description |
|--------|------|------|----------|-------------|
| POST | `/api/phone/register` | `{ user_id, phone, name, email }` | `{ registered, welcomeSent, phone }` | Link phone + send WhatsApp welcome |

### WhatsApp Routes (mounted at `/api/whatsapp`)

| Method | Path | Body | Response | Description |
|--------|------|------|----------|-------------|
| POST | `/api/whatsapp/webhook` | Twilio webhook payload `{ From, Body, ProfileName }` | TwiML `<Response/>` | Incoming message handler |
| POST | `/api/whatsapp/register` | `{ phone, name, timezone, checkin_hour }` | `{ success, user }` | Register for daily check-ins |
| GET | `/api/whatsapp/users` | — | `{ users: [...] }` | List registered WA users |
| POST | `/api/whatsapp/send` | `{ phone, message }` | `{ success, ... }` | Send manual message |
| POST | `/api/whatsapp/daily-checkin` | — | `{ success, sent, total }` | Trigger daily check-in for all users |

---

## 9. WhatsApp Channel (Twilio)

### Conversational Flow

```
[User sends message]
    │
    ├── "idioma en/es" → Switch language preference
    ├── "/help" or "ayuda" → Show commands list
    ├── "/resultado" → Show last evaluation result
    ├── "/sesion" or "/retomar" → Cross-channel continuity context
    ├── "/racha" → Show streak stats
    ├── "/alimento" or "/food" → Sacred food recommendations
    │
    └── "evaluar" / "evaluate" / "hola" / "hi" → START CHECK-IN FLOW:
         │
         ├── [Optional] Show last session context (cross-channel)
         ├── Send greeting + first domain question
         │
         └── DOMAIN LOOP (7 iterations):
              ├── ◈ BODY → score 1-10
              ├── ◇ EMOTIONS → score 1-10
              ├── ⟐ MIND → score 1-10
              ├── ✦ SPIRIT → score 1-10
              ├── ⬡ RELATIONSHIPS → score 1-10
              ├── ◎ PURPOSE → score 1-10
              └── ⚘ SACRED FOOD → score 1-10
                   │
                   └── All 7 collected:
                        ├── Compute engine.computeAll(scores, lang)
                        ├── Send formatted results message
                        ├── Send alimento recommendations
                        ├── Save session to DB
                        └── Reset state to idle
```

### Score Mapping
Each 1-10 score maps to 4 dimensions with slight variation:
```javascript
function mapScoreToDimensions(score, keys) {
  const base = Math.max(0, Math.min(1, score / 10));
  const offsets = [-0.03, 0.02, -0.01, 0.02];
  // keys[0] = base - 0.03, keys[1] = base + 0.02, etc.
}
```

### WhatsApp Phone Number
- **From:** `whatsapp:+19788012275` (Twilio sandbox/production)

---

## 10. Voice Agent (ElevenLabs)

### Configuration
```javascript
{
  agentId: "agent_0401kgrq0q0kfwx9v29fje7eqd5j",
  // or env: VITE_ELEVENLABS_AGENT_ID
}
```

### Session Startup
When voice session starts, LOGOS receives dynamic variables:
```javascript
dynamicVariables: {
  date_context: "[CONTEXTO TEMPORAL] Hoy es martes, 12 de febrero de 2026...",
  user_name: "Manuel",
  lambda: "0.543",
  verdict: "MONITOR",
}
```

### Voice/Text Modes
- **Voice mode:** Uses microphone, agent speaks responses
- **Text mode:** `overrides: { conversation: { textOnly: true } }`

### Visual Orb
- Floating Λ button (bottom-right corner)
- Color changes with Lambda:
  - Λ > 0.60 → Gold
  - Λ > 0.45 → Purple (logos)
  - Λ > 0.20 → Orange (free energy)
  - Λ < 0.20 → Red (entropy)
- Breathing animation when active
- Shows agent subtitles when speaking

---

## 11. Client Tools (ElevenLabs)

These are the functions the voice agent can invoke in real-time during a conversation:

### READ Tools (agent reads app state)

| Tool Name | Returns | Purpose |
|-----------|---------|---------|
| `getCurrentDateTime` | `{ date, time, dayOfWeek, month, year, iso, timezone, timestamp }` | Locale-aware date/time |
| `getFullState` | `{ [key]: { label, value } }` for all 28 dims | Full slider state |
| `getMetrics` | `{ Λ, Ω, V, S, C, F, Q }` | Derived metrics |
| `getVerdict` | `{ verdict, lambda, details }` | Current inhibition policy verdict |
| `getCurrentTab` | `{ activeTab }` | Which tab user is viewing |
| `getTrajectory` | `{ currentSession, previousSessions, trend, trendDelta, totalSessions }` | Session history + trend |
| `detectCrisis` | `{ status, currentLambda, consecutiveLowSessions, recommendation }` | A⁻ crisis detection |
| `getSessionReport` | `{ totalSessions, averageLambda, trend, dayOfWeekAverages, bestDay, worstDay }` | Analytics report |
| `generateWeeklyReport` | `{ period, sessionsThisWeek, averages, weekOverWeekChange, dominantVerdict }` | Weekly digest |
| `getAlimentoRecommendation` | `{ deficientDimensions, recommendedFoods, avoidFoods, generalAdvice }` | Sacred food recs |

### WRITE Tools (agent modifies app state)

| Tool Name | Parameters | Effect |
|-----------|-----------|--------|
| `setSliderValue` | `{ variable, value }` | Updates a single dimension (0-1). Accepts Spanish names, English keys, or voice variations. |
| `navigateToTab` | `{ tab }` | Navigate to: estado, dominios, capas, trayectoria, montecarlo, teoria, manual |
| `highlightDomain` | `{ domain }` | Visually highlight a domain on the UI |
| `triggerSimulation` | — | Run Monte Carlo simulation |

### ADVANCED Tools

| Tool Name | Parameters | Effect |
|-----------|-----------|--------|
| `evaluateDecision` | `{ decision }` | Evaluate if consciousness state supports a given decision. Returns READY/NOT_READY. |
| `scheduleCalendarEvent` | `{ title, description, dateTime, durationMinutes }` | Create Google Calendar event via OAuth token |

### Variable Name Resolution
The agent accepts multiple name formats for `setSliderValue`:
```javascript
// Spanish names: "sueño" → sleep, "fe" → faith, "paz interior" → peace
// English names: "sleep" → sleep, "faith" → faith
// Voice variations: "dormir" → sleep, "oración" → faith, "felicidad" → joy
// Accent-normalized: "meditacion" → meditation, "nutricion" → nutrition
```

---

## 12. Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  picture TEXT,
  phone VARCHAR(20),
  last_state JSONB,          -- Current 28-dim slider state
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `sessions`
```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  client_session_id VARCHAR(255),  -- For UPSERT dedup
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_min INTEGER,
  lambda DECIMAL(7,4),
  omega DECIMAL(7,4),
  viability DECIMAL(7,4),
  entropy DECIMAL(7,4),
  coherence DECIMAL(7,4),
  free_energy DECIMAL(7,4),
  trajectory DECIMAL(7,4),
  verdict VARCHAR(50),        -- PAUSE|WAIT|RECONNECT|ACT|MONITOR
  state_snapshot JSONB,       -- Full 28-dim state at session time
  domain_scores JSONB,        -- { physical: 0.6, emotional: 0.7, ... }
  source_channel VARCHAR(20), -- 'web' | 'whatsapp' | 'voice'
  UNIQUE(user_id, client_session_id)
);
```

### Table: `daily_snapshots`
```sql
CREATE TABLE daily_snapshots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  sessions_count INTEGER DEFAULT 0,
  avg_lambda DECIMAL(7,4),
  avg_omega DECIMAL(7,4),
  avg_viability DECIMAL(7,4),
  avg_entropy DECIMAL(7,4),
  avg_coherence DECIMAL(7,4),
  best_lambda DECIMAL(7,4),
  worst_lambda DECIMAL(7,4),
  dominant_verdict VARCHAR(50),
  UNIQUE(user_id, date)
);
```

### Table: `channel_users`
```sql
CREATE TABLE channel_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  channel VARCHAR(20) DEFAULT 'whatsapp',
  lang VARCHAR(5) DEFAULT 'es',        -- 'es' | 'en'
  state JSONB DEFAULT '{"step":"idle"}', -- Conversation state machine
  total_sessions INTEGER DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 13. Sacred Food Engine (Alimento)

The Alimento engine recommends sacred foods based on the user's consciousness state.

### How It Works
1. Receives the 28-dim state snapshot
2. Identifies deficient dimensions (below threshold)
3. Matches foods from `SACRED_FOODS` database that target those dimensions
4. Predicts change percentage per food
5. Returns recommended foods + foods to avoid

### Output Format
```json
{
  "deficientDimensions": [{"dimension": "sleep", "value": "30%"}],
  "recommendedFoods": [
    {
      "name": "Chamomile Tea",       // nameEs: "Té de Manzanilla"
      "sacredNote": "Calms the nervous system",
      "predictedChange": "+4.2%"
    }
  ],
  "avoidFoods": ["Processed sugar", "Excessive caffeine"],
  "generalAdvice": "Eat mindfully today..."
}
```

### Bilingual Fields
Every food entry has both English and Spanish:
- `name` / `nameEs`
- `sacredNote` / `sacredNoteEs`
- `generalAdvice` / `generalAdviceEs`
- `avoidFoods` / `avoidFoodsEs`

---

## 14. 10-Layer Computation Pipeline

```
INPUT: 28 slider values ∈ [0,1]
  │
  ├── L7: Λ(x) = Λ_signal × Φ_channel    ← COMPUTED FIRST (all others depend on this)
  ├── L1: F(x) = Friston Free Energy      ← Distance from ideal configuration
  ├── L2: Levin Signals                   ← Pathology detection (critical thresholds)
  ├── L3: Watson Energy                   ← Energy landscape position
  ├── L4: Hoffman Biases                  ← Cognitive distortion detection
  ├── L5: C(x) = Penrose Coherence        ← Harmonic mean of 7 domains × Λ
  ├── L6: π(x) = Inhibition Policy        ← PAUSE/WAIT/RECONNECT/ACT/MONITOR
  ├── L8: Protocol Engine                 ← Empirical validation (ERS, Bayes)
  ├── L9: Emergence Metrics               ← Multi-scale Λ, SNR, criticality
  └── L10: Positive Geometry              ← Consciousness polytope, GCI, canonical form
  │
  ├── Derived: V(x) Viability, S(x) Entropy, Ω(x) Omega, Q(x) Trajectory
  │
OUTPUT: { lambda, omega, viability, entropy, coherence, freeEnergy, Q, verdict, ... }
```

---

## 15. Cross-Channel Architecture

### State Synchronization
- Web app saves state to `users.last_state` via `PUT /api/state`
- When phone is registered, `last_state` copies to `channel_users.state`
- WhatsApp sessions save to same `sessions` table with `user_id`
- Any channel can read any other channel's sessions

### Cross-Channel Session Continuity
When a WhatsApp user starts a new check-in:
1. System fetches last session (from ANY channel) via `getLastSessionForUser(userId)`
2. Shows context: "Your last session (web, 2h ago): Λ=65% | Verdict: ACT"
3. User then does new evaluation for comparison

### User Linking
- Web user registers phone via `POST /api/phone/register`
- Creates/links `channel_users` entry with same `user_id`
- Both channels share: sessions, daily_snapshots, state

---

## 16. Environment Variables & Deployment

### Required Environment Variables

```env
# Database (PostgreSQL)
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=logoshumano
DB_USER=logos
DB_PASSWORD=<password>

# API Server
API_PORT=3200
CORS_ORIGIN=https://logoilab.com

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=<sid>
TWILIO_API_KEY_SID=<key_sid>
TWILIO_API_KEY_SECRET=<key_secret>
TWILIO_WHATSAPP_FROM=whatsapp:+19788012275

# Frontend (.env)
VITE_ELEVENLABS_AGENT_ID=agent_0401kgrq0q0kfwx9v29fje7eqd5j
```

### Docker Production Stack
```yaml
services:
  logoilab-app:  # Frontend (port 3100→3000)
  logoilab-api:  # Backend API (port 3200)
  logoilab-db:   # PostgreSQL 16 (port 5432, internal only)
```

### Server Location
- **M5 AWS Instance** — credentials in SSH config (`~/.ssh/config`, host `m5`)

---

## 17. OpenClaw SKILL.md Template

```markdown
---
description: LOGOS Consciousness Agent — reads and manages the user's 28-dimensional consciousness state
---

# LOGOS Consciousness Agent

## Identity
You are connecting to LOGOS (Lambda Logos), a Consciousness Operating System 
created by Dr. José Manuel Cadena. LOGOS tracks 28 dimensions of human experience
across 7 life domains and computes a master alignment metric called Lambda (Λ).

## Capabilities

### Read User State
- GET {API_BASE}/api/state/{user_id} → Full 28-dim consciousness state
- GET {API_BASE}/api/reports/longitudinal?user_id={id} → Full analytics
- GET {API_BASE}/api/reports/weekly?user_id={id} → 7-day summary
- GET {API_BASE}/api/sessions?user_id={id}&limit=5 → Recent sessions
- GET {API_BASE}/api/health → System health check

### Trigger Check-In
- POST {API_BASE}/api/whatsapp/daily-checkin → Send check-in to all users
- POST {API_BASE}/api/whatsapp/send → Send custom message
  Body: { "phone": "+52...", "message": "..." }

### Interpret Metrics
When reporting metrics to the user, use these interpretations:
- **Λ (Lambda):** The master metric. 0-1 scale.
  - ≥0.60 = ALIGNED (A⁺) — consciousness channel open
  - 0.20-0.59 = TRANSITION — working toward alignment
  - <0.20 = DISCONNECTED (A⁻) — channel closed, crisis mode
- **Verdict:** PAUSE | WAIT | RECONNECT | ACT | MONITOR
  - PAUSE = Don't make decisions. Rest and recover.
  - WAIT = Stabilize first. Reduce entropy.
  - RECONNECT = You're drifting. Return to faith/meditation/presence.
  - ACT = System aligned. Proceed with confidence.
  - MONITOR = In transition. Be mindful.

### 7 Domains
1. ◈ Body (sleep, nutrition, exercise, energy)
2. ◇ Emotions (peace, gratitude, love, joy)
3. ⟐ Mind (clarity, focus, creativity, wisdom)
4. ✦ Spirit (faith, meditation, service, presence) ← STRONGEST Λ influence
5. ⬡ Relationships (family, friendship, community, compassion)
6. ◎ Purpose (meaning, mission, contribution, legacy)
7. ⚘ Sacred Food (nourishment, taste_presence, food_harmony, gut_resonance)

### Language
User prefers Spanish. Use bilingual labels when presenting data.
Lambda is always written as Λ, Omega as Ω.

## Connection Details
- API Base: http://localhost:3200 (or https://logoilab.com/api in production)
- Auth: None required for read endpoints. User identification via user_id parameter.
- Format: JSON REST API
- WhatsApp Phone: whatsapp:+19788012275

## Example Interactions
- "¿Cómo estoy hoy?" → GET /api/state/{user_id} + interpret
- "¿Cuál es mi racha?" → GET /api/reports/longitudinal + report streak
- "Envía mi check-in" → POST /api/whatsapp/daily-checkin
- "Dame mi reporte semanal" → GET /api/reports/weekly + format
- "¿Debo tomar esta decisión?" → Check verdict + lambda + V/S/C thresholds
```

---

## 18. OpenClaw HEARTBEAT.md Integration

Add these to Chatita's heartbeat checklist for autonomous LOGOS monitoring:

```markdown
## LOGOS Consciousness Monitor (every 30 min)

- [ ] Check LOGOS API health: GET /api/health
- [ ] If user has active session today, summarize current Λ state
- [ ] If Lambda < 0.20 for 2+ consecutive sessions, send gentle reminder
- [ ] If streak is about to break (no session today by 8pm), prompt user
- [ ] On Monday mornings, generate and present weekly report
- [ ] If verdict is PAUSE, remind user to rest and avoid big decisions
```

---

## Appendix A: Key Constants Quick Reference

| Constant | Value | Location |
|----------|-------|----------|
| LAMBDA_STAR (A⁺ threshold) | 0.60 | logos-engine.js:116 |
| V_STAR | 0.70 | logos-engine.js:114 |
| S_STAR | 0.30 | logos-engine.js:115 |
| GAMMA (channel attenuation) | 0.25 | logos-engine.js:95 |
| SEPARATRIX_THRESHOLD | 0.35 | positive-geometry.ts |
| API Port | 3200 | server.js:20 |
| Rate Limit (API) | 60/min | server.js:41 |
| Rate Limit (webhook) | 120/min | server.js:42 |
| Neutral Lambda (all 0.5) | 0.4375 | Computed: 0.5 × 0.875 |
| ElevenLabs Agent ID | agent_0401kgrq0q0kfwx9v29fje7eqd5j | logosAgent.js:10 |

## Appendix B: Complete Endpoint Quick Table

```
GET  /api/health                          → System health
POST /api/auth/sync                       → Upsert user
PUT  /api/state                           → Save slider state
GET  /api/state/:user_id                  → Load slider state
POST /api/sessions                        → Save session (UPSERT)
GET  /api/sessions?user_id&limit&offset   → Get sessions
GET  /api/reports/longitudinal?user_id    → Full analytics
GET  /api/reports/weekly?user_id          → 7-day summary
GET  /api/reports/timeline?user_id&days   → Daily timeline
POST /api/phone/register                  → Link phone + welcome
POST /api/whatsapp/webhook                → Twilio incoming
POST /api/whatsapp/register               → Register for check-ins
GET  /api/whatsapp/users                  → List WA users
POST /api/whatsapp/send                   → Send manual message
POST /api/whatsapp/daily-checkin          → Trigger all check-ins
```

---

*Document generated for OpenClaw/Chatita integration. Contains 100% of LOGOS agent architecture, endpoints, formulas, personality, and cross-channel flows.*
