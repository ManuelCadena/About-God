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

## Appendix C: 100% Complete Tools Inventory — File, Path, Functionality & Description

### C.1 — ElevenLabs Voice Agent Client Tools (16 tools)

> **File:** `LogosVoiceAgent.jsx`  
> **Path:** `src/components/LogosVoiceAgent.jsx`  
> **Lines:** 39–342  
> **Context:** Registered as `clientTools` in the `useConversation()` hook from `@elevenlabs/react`. The ElevenLabs AI voice agent can invoke any of these tools in real-time during a conversation with the user.

#### C.1.1 — READ Tools (10)

---

**Tool #1: `getCurrentDateTime`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 43  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns the current date, time, day of week, month, year, ISO timestamp, timezone, and Unix timestamp. Uses the user's locale from i18n (`es-MX` or `en-US`) for formatting.  
- **Return Schema:**
  ```json
  {
    "date": "12 de febrero de 2026",
    "time": "22:36",
    "dayOfWeek": "jueves",
    "month": "febrero",
    "year": 2026,
    "iso": "2026-02-13T05:36:00.000Z",
    "timezone": "America/Mexico_City",
    "timestamp": 1771044960000
  }
  ```
- **Dependencies:** `useTranslation()` → `t('app.locale')`

---

**Tool #2: `getFullState`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 58  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns all 28 slider dimension values with their Spanish labels. Iterates over the `sliderValues` prop and maps each key to its label via `LOGOS_AGENT_CONFIG.VARIABLE_LABELS`.  
- **Return Schema:**
  ```json
  {
    "faith": { "label": "Fe", "value": 0.70 },
    "sleep": { "label": "Sueño", "value": 0.65 },
    "meditation": { "label": "Meditación", "value": 0.55 },
    ...
  }
  ```
- **Dependencies:** `sliderValues` prop, `LOGOS_AGENT_CONFIG` from `src/config/logosAgent.js`

---

**Tool #3: `getMetrics`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 70  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns the 7 computed metrics (Λ, Ω, V, S, C, F, Q) with localized labels. Uses i18n `t()` for metric names (e.g., "Viabilidad" / "Viability").  
- **Return Schema:**
  ```json
  {
    "Λ Lambda": "0.543",
    "Ω Omega": "0.612",
    "V Viabilidad": "0.678",
    "S Entropía": "0.234",
    "C Coherencia": "0.589",
    "F Energía Libre": "0.345",
    "Q Trayectoria": "0.456"
  }
  ```
- **Dependencies:** `metrics` prop (computed by frontend core engine)

---

**Tool #4: `getVerdict`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 82  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns the current inhibition policy verdict (PAUSE/WAIT/RECONNECT/ACT/MONITOR), current Lambda value, and a detail string showing V, S, C, Λ values.  
- **Return Schema:**
  ```json
  {
    "verdict": "MONITOR",
    "lambda": "0.543",
    "details": "V=0.68, S=0.23, C=0.59, Λ=0.54"
  }
  ```
- **Dependencies:** `verdict` prop, `metrics` prop

---

**Tool #5: `getCurrentTab`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 90  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns the name of the currently active tab in the UI (e.g., "estado", "dominios", "capas", "trayectoria", "montecarlo", "teoria", "manual").  
- **Return Schema:**
  ```json
  { "activeTab": "estado" }
  ```
- **Dependencies:** `activeTab` prop

---

**Tool #6: `getTrajectory`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 94  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Returns the last 10 data points from the current session's history and the last 10 previous sessions. Computes a trend delta (difference between first and last Λ values). Classifies trend as "Mejorando" / "Declinando" / "Estable" via i18n.  
- **Return Schema:**
  ```json
  {
    "currentSession": [{ "Λ": 0.45, ... }, ...],
    "previousSessions": [{ "lambda": 0.5, ... }, ...],
    "trend": "Mejorando",
    "trendDelta": 0.053,
    "totalSessions": 10
  }
  ```
- **Dependencies:** `history` prop, `sessionHistory` prop

---

**Tool #7: `detectCrisis`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 109  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Analyzes the last 5 sessions to detect A⁻ crisis state. Counts consecutive sessions with Λ < 0.20. Returns `CRISIS_A_MINUS` if current Λ < 0.20 AND 2+ low sessions, `WARNING` if Λ < 0.30 AND 1+ low session, otherwise `STABLE`. Includes localized recommendation.  
- **Return Schema:**
  ```json
  {
    "status": "STABLE",
    "currentLambda": 0.543,
    "consecutiveLowSessions": 0,
    "recentLambdas": [0.45, 0.50, 0.48, 0.55, 0.54],
    "recommendation": "Tu estado es estable. Sigue cultivando tus prácticas."
  }
  ```
- **Dependencies:** `sessionHistory` prop, `metrics` prop

---

**Tool #8: `getSessionReport`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 234  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Generates a comprehensive longitudinal report from ALL stored sessions. Computes: total sessions, average Lambda, day-of-week averages (best/worst day), trend (first 5 vs last 5 sessions). Uses i18n for day names.  
- **Return Schema:**
  ```json
  {
    "totalSessions": 42,
    "averageLambda": 0.521,
    "trend": "Mejorando",
    "dayOfWeekAverages": { "Lun": 0.55, "Mar": 0.48, ... },
    "bestDay": { "day": "Dom", "avgLambda": 0.62 },
    "worstDay": { "day": "Mié", "avgLambda": 0.41 },
    "recentLambdas": [0.50, 0.52, 0.54, 0.56, 0.55],
    "userName": "Manuel"
  }
  ```
- **Dependencies:** `sessionHistory` prop, `user` prop

---

**Tool #9: `generateWeeklyReport`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 274  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Generates a 7-day weekly report. Filters sessions from last 7 days, computes averages for Λ, Ω, V, S, C. Computes week-over-week change vs previous 7 days. Identifies dominant verdict and builds verdict distribution. Computes intra-week Lambda trend.  
- **Return Schema:**
  ```json
  {
    "period": "2/5/2026 — 2/12/2026",
    "sessionsThisWeek": 5,
    "averages": { "lambda": 0.54, "omega": 0.61, "viability": 0.68, "entropy": 0.23, "coherence": 0.59 },
    "weekOverWeekChange": 0.035,
    "lambdaTrend": "Mejorando",
    "dominantVerdict": "MONITOR",
    "verdictDistribution": { "MONITOR": 3, "ACT": 2 },
    "userName": "Manuel",
    "userEmail": "manuel@example.com"
  }
  ```
- **Dependencies:** `sessionHistory` prop, `user` prop

---

**Tool #10: `getAlimentoRecommendation`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 320  
- **Type:** Read  
- **Parameters:** None  
- **Functionality:** Invokes the Sacred Food recommendation engine (`getAlimentoRecommendations` from `src/core/alimento.ts`). Identifies deficient dimensions, matches sacred foods, predicts change percentages, and returns bilingual food recommendations + foods to avoid.  
- **Return Schema:**
  ```json
  {
    "deficientDimensions": [{ "dimension": "sleep", "value": "30%" }],
    "recommendedFoods": [
      { "name": "Té de Manzanilla", "reason": "Calma el sistema nervioso", "predictedChange": "+4.2%" }
    ],
    "avoidFoods": ["Azúcar procesada", "Cafeína excesiva"],
    "generalAdvice": "Come con presencia hoy..."
  }
  ```
- **Dependencies:** `sliderValues` prop, dynamic import of `src/core` → `getAlimentoRecommendations()`

---

#### C.1.2 — WRITE Tools (4)

---

**Tool #11: `setSliderValue`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 132  
- **Type:** Write  
- **Parameters:** `{ variable: string, value: number }`  
- **Functionality:** Updates a single dimension slider value. Accepts variable names in Spanish, English, or common voice variations. Performs:
  1. Lowercase + trim + NFD accent normalization
  2. Resolves via `LOGOS_AGENT_CONFIG.SPANISH_TO_KEY` lookup (e.g., "sueño" → "sleep", "oración" → "faith", "felicidad" → "joy")
  3. Validates key exists in `VARIABLE_LABELS`
  4. Validates value is numeric and in [0, 1]
  5. Calls `onUpdateSlider(internalKey, numValue)` to update app state
- **Return:** Localized success message or error message  
- **Variable Resolution Examples:**
  - `"sueño"` → `sleep`, `"fe"` → `faith`, `"paz interior"` → `peace`
  - `"dormir"` → `sleep`, `"oración"` → `faith`, `"felicidad"` → `joy`
  - `"sleep"` → `sleep` (English passthrough)
- **Dependencies:** `onUpdateSlider` callback prop, `LOGOS_AGENT_CONFIG` from `src/config/logosAgent.js`

---

**Tool #12: `navigateToTab`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 155  
- **Type:** Write  
- **Parameters:** `{ tab: string }`  
- **Functionality:** Navigates the UI to a specific tab. Normalizes the tab name and maps via `LOGOS_AGENT_CONFIG.TAB_MAP`. Calls `onNavigateTab(mappedTab)`.  
- **Valid Tabs:** `estado`, `dominios`, `capas`, `trayectoria`, `montecarlo`, `teoria`, `manual`  
- **Dependencies:** `onNavigateTab` callback prop

---

**Tool #13: `highlightDomain`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 162  
- **Type:** Write  
- **Parameters:** `{ domain: string }`  
- **Functionality:** Visually highlights a specific domain in the UI (pulses/glows the domain card). Normalizes the domain name (lowercase, NFD accent removal), resolves via `LOGOS_AGENT_CONFIG.DOMAIN_MAP` (e.g., "físico" → "physical", "espiritual" → "spiritual").  
- **Dependencies:** `onHighlightDomain` callback prop

---

**Tool #14: `triggerSimulation`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 170  
- **Type:** Write  
- **Parameters:** None  
- **Functionality:** Triggers a Monte Carlo simulation run in the EmergenceSwarmAnimation component. Calls `onRunSimulation()` which starts particle swarm visualization showing possible consciousness trajectories.  
- **Dependencies:** `onRunSimulation` callback prop

---

#### C.1.3 — EVALUATION Tools (1)

---

**Tool #15: `evaluateDecision`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 177  
- **Type:** Evaluation  
- **Parameters:** `{ decision: string }`  
- **Functionality:** Evaluates whether the user's current consciousness state supports a specific decision. Checks 4 thresholds simultaneously:
  - V > 0.55 (sufficient viability)
  - S < 0.40 (low enough entropy)
  - C > 0.45 (sufficient coherence)
  - Λ > 0.45 (sufficient alignment)
  If ALL pass → `READY`, otherwise → `NOT_READY`.  
- **Return Schema:**
  ```json
  {
    "decision": "Cambiar de trabajo",
    "verdict": "MONITOR",
    "readiness": "NOT_READY",
    "metrics": { "lambda": 0.543, "V": 0.678, "S": 0.234, "C": 0.589 },
    "analysis": "Tu sistema aún no está completamente alineado para esta decisión."
  }
  ```
- **Dependencies:** `metrics` prop, `verdict` prop

---

#### C.1.4 — ADVANCED Tools (1)

---

**Tool #16: `scheduleCalendarEvent`**  
- **File:** `src/components/LogosVoiceAgent.jsx` — line 196  
- **Type:** Advanced / External Integration  
- **Parameters:** `{ title: string, description: string, dateTime: string, durationMinutes: number }`  
- **Functionality:** Creates a Google Calendar event via the Google Calendar API v3. Requires a valid Google OAuth token (from `accessToken` prop or `sessionStorage`). Creates event with:
  - Summary = title
  - Description = description
  - Start/End times calculated from dateTime + durationMinutes (default 15 min)
  - Timezone auto-detected from browser
  - 10-minute popup reminder
- **External API:** `POST https://www.googleapis.com/calendar/v3/calendars/primary/events`
- **Auth:** Bearer token (Google OAuth)
- **Return Schema (success):**
  ```json
  {
    "success": true,
    "eventId": "abc123",
    "htmlLink": "https://calendar.google.com/...",
    "summary": "Meditación matutina",
    "start": "2026-02-13T07:00:00-06:00",
    "end": "2026-02-13T07:15:00-06:00"
  }
  ```
- **Dependencies:** `accessToken` prop, Google Calendar API

---

### C.2 — Voice Agent Configuration Tools

> **File:** `logosAgent.js`  
> **Path:** `src/config/logosAgent.js`  
> **Lines:** 1–68  
> **Context:** Static configuration object consumed by all 16 client tools for variable name resolution, domain mapping, and tab mapping.

| Config Object | Purpose | Key Count | Description |
|---|---|---|---|
| `LOGOS_AGENT_CONFIG.agentId` | ElevenLabs agent ID | 1 | `"agent_0401kgrq0q0kfwx9v29fje7eqd5j"` — uniquely identifies the LOGOS voice agent in ElevenLabs |
| `VARIABLE_LABELS` | Internal key → Spanish label map | 28 | Maps every dimension key (e.g., `sleep`) to its Spanish label (`Sueño`) for display to the voice agent |
| `SPANISH_TO_KEY` | Spanish name → internal key resolver | 60+ | Maps Spanish names, English names, and common voice variations to canonical dimension keys. Handles accent normalization. |
| `DOMAIN_MAP` | Domain name → canonical key | 12 | Maps Spanish/English domain names to keys (e.g., `"físico"` → `"physical"`, `"alimento sagrado"` → `"alimento"`) |
| `TAB_MAP` | Tab name → canonical tab ID | 7 | Maps tab names to tab IDs: estado, dominios, capas, trayectoria, montecarlo, teoria, manual |

---

### C.3 — Backend Engine Functions (8 exported)

> **File:** `logos-engine.js`  
> **Path:** `api/services/logos-engine.js`  
> **Lines:** 1–383  
> **Context:** Node.js backend mirror of the frontend core engine. Used by WhatsApp routes to compute LOGOS metrics server-side. All formulas are IDENTICAL to the frontend TypeScript versions.

---

**Function #17: `computeAll(state, lang)`**  
- **Line:** 241  
- **Parameters:** `state` (object with 28 dimension values 0–1), `lang` (`'es'`|`'en'`)  
- **Functionality:** Master computation pipeline. Computes ALL metrics from a 28-dim state snapshot:
  1. `computeLambda(state)` → Λ (hierarchical: signal × channel)
  2. `computeViability(state, Λ)` → V
  3. `computeEntropy(state, Λ)` → S
  4. `computeCoherence(state, Λ)` → C
  5. `computeFreeEnergy(state, Λ)` → F
  6. `computeOmega(Λ, V, S, C, F)` → Ω
  7. `computeTrajectoryQuality(Λ, V, S)` → Q
  8. `inhibitionPolicy(Λ, V, S, C)` → verdict
  9. `computeDomainScores(state)` → 7 domain averages
  10. `getAttractorState(Λ)` → A⁺/A⁻/TRANSICIÓN
  11. Find weakest & strongest domains
- **Returns:** `{ lambda, omega, viability, entropy, coherence, freeEnergy, Q, attractor, policy, domainScores, weakest, strongest }`

---

**Function #18: `computeLambda(state)`**  
- **Line:** 119  
- **Parameters:** `state` (28-dim object)  
- **Functionality:** Hierarchical Lambda computation: `Λ(x) = Λ_signal(x) × Φ_channel(x)`
  - Λ_signal: weighted sum of 12 signal dimensions (WEIGHTS constant)
  - Φ_channel: computed by `computeChannelPhi(state)` using 4 channel support groups (somatic, emotional, cognitive, incarnation)
  - Result clamped to [0, 1]

---

**Function #19: `computeDomainScores(state)`**  
- **Line:** 132  
- **Parameters:** `state` (28-dim object)  
- **Functionality:** Computes average score for each of the 7 domains by averaging the 4 dimensions within each domain.  
- **Returns:** `{ physical: 0.6, emotional: 0.7, mental: 0.5, spiritual: 0.6, relational: 0.5, purpose: 0.4, alimento: 0.55 }`

---

**Function #20: `formatResultsMessage(results, lang)`**  
- **Line:** 280  
- **Parameters:** `results` (output of `computeAll`), `lang` (`'es'`|`'en'`)  
- **Functionality:** Formats the computation results into a beautifully formatted WhatsApp message with:
  - Lambda + Omega with progress bars (█░)
  - Level label (ALINEADO / CONECTANDO / BUSCANDO / DESCONECTADO)
  - V, S, C metrics
  - Verdict with icon and message
  - Strongest & weakest domain
  - Personalized recommendation based on weakest domain
  - Link to logoilab.com

---

**Function #21: `translateVerdict(key, lang)`**  
- **Line:** 228  
- **Parameters:** `key` (verdict string from DB), `lang` (`'es'`|`'en'`)  
- **Functionality:** Translates a DB-stored verdict key to the display language. Handles both English keys (PAUSE→PAUSA) and legacy Spanish keys (PAUSA→PAUSE). Uses `VERDICT_ES` and `VERDICT_EN` lookup tables.

---

**Function #22: `inhibitionPolicy(lambda, V, S, C, prevLambda, lang)`**  
- **Line:** 201  
- **Parameters:** 5 metric values + language  
- **Functionality:** Evaluates the inhibition policy decision tree (see Section 7) and returns verdict with icon, message, and Λ̇.  
- **Returns:** `{ verdict: 'PAUSE'|'WAIT'|'RECONNECT'|'ACT'|'MONITOR', icon, message, lambdaDot }`

---

**Function #23: `computeChannelPhi(state)` (internal)**  
- **Line:** 104  
- **Functionality:** Computes channel quality Φ from 16 support dimensions grouped into somatic (w=0.30), emotional (w=0.30), cognitive (w=0.15), incarnation (w=0.25). `Φ = 1 - γ × (1 - weightedAvg)`, clamped to [0.5, 1.0].

---

**Function #24: `getRecommendation(results, lang)` (internal)**  
- **Line:** 338  
- **Functionality:** Generates bilingual personalized recommendations based on the weakest domain and current policy verdict. Returns specific action items per domain.

---

### C.4 — WhatsApp Service Functions (5 exported)

> **File:** `whatsapp.js`  
> **Path:** `api/services/whatsapp.js`  
> **Lines:** 1–149  
> **Context:** Twilio WhatsApp messaging service. Handles sending messages, check-in greetings, and domain question generation.

---

**Function #25: `sendMessage(to, body)`**  
- **Line:** 27  
- **Parameters:** `to` (E.164 phone, e.g., `+521234567890`), `body` (message text)  
- **Functionality:** Sends a WhatsApp message via Twilio API. Uses `TWILIO_WHATSAPP_FROM` as sender. Returns Twilio message SID and status.  
- **External API:** Twilio Messages API

---

**Function #26: `sendCheckinGreeting(to, name, lang)`**  
- **Line:** 47  
- **Parameters:** `to` (phone), `name` (user name), `lang` (`'es'`|`'en'`)  
- **Functionality:** Sends the initial daily check-in greeting message. Bilingual. Includes scale explanation (1-10) and first domain question (Body/Cuerpo).

---

**Function #27: `getDomainQuestion(step, lang)`**  
- **Line:** 115  
- **Parameters:** `step` (0–6 domain index), `lang`  
- **Functionality:** Returns the formatted domain question for the given step. Uses `DOMAIN_QUESTIONS` array with icons, bilingual names, and bilingual questions.  
- **Returns:** `"✦ *ESPÍRITU* — ¿Cómo está tu espíritu?...\n\nResponde del 1 al 10:"`

---

**Function #28: `mapScoreToDimensions(score, keys)`**  
- **Line:** 131  
- **Parameters:** `score` (1–10), `keys` (array of 4 dimension keys)  
- **Functionality:** Maps a single 1-10 domain score to 4 individual dimension values in [0, 1]. Uses slight offsets `[-0.03, +0.02, -0.01, +0.02]` to avoid identical values across dimensions.

---

**Constant #29: `DOMAIN_QUESTIONS`**  
- **Line:** 58  
- **Type:** Array of 7 objects  
- **Functionality:** Defines the 7 check-in domain questions with: domain key, icon, bilingual names, bilingual question text, and 4 dimension keys per domain.

---

### C.5 — WhatsApp Route Helper Functions (8)

> **File:** `whatsapp.js`  
> **Path:** `api/routes/whatsapp.js`  
> **Lines:** 1–588  
> **Context:** Express router handling the conversational check-in flow, command processing, and cross-channel continuity.

---

**Function #30: `handleMessage(phone, text, state, waUser)`**  
- **Line:** 55  
- **Functionality:** Main message router. Parses user text and routes to:
  - Language switch (`idioma en/es`)
  - Help command (`/help`, `ayuda`)
  - Result command (`/resultado`)
  - Session command (`/sesion`, `/retomar`)
  - Streak command (`/racha`)
  - Alimento command (`/alimento`, `/food`)
  - Evaluation start (`evaluar`, `evaluate`, `hola`, `hi`)
  - Domain score collection (when in `domain` state)

---

**Function #31: `getOrCreateUser(phone, profileName)`**  
- **Line:** 237  
- **Functionality:** Retrieves or creates a user in `channel_users` and `users` tables. If new, creates both records with phone-derived google_id (`wa_+52...`).

---

**Function #32: `updateConversationState(phone, newState)`**  
- **Line:** 267  
- **Functionality:** Updates the conversation state machine in `channel_users.state`. States: `{ step: 'idle' }`, `{ step: 'domain', domainIndex: 0-6, scores: {...} }`.

---

**Function #33: `saveWhatsAppSession(waUser, stateSnapshot, results)`**  
- **Line:** 274  
- **Functionality:** Saves a completed WhatsApp evaluation session to both `sessions` and `daily_snapshots` tables.

---

**Function #34: `sendLastResult(phone, waUser)`**  
- **Line:** 314  
- **Functionality:** Fetches and sends the user's most recent session result from DB. Shows Λ, Ω, V, S, C, translated verdict, and date.

---

**Function #35: `sendStreak(phone, waUser)`**  
- **Line:** 350  
- **Functionality:** Calculates and sends the user's consecutive-day streak. Counts backwards from today. Includes total evaluations and encouragement message based on streak length.

---

**Function #36: `sendCrossChannelContext(phone, waUser)`**  
- **Line:** 417  
- **Functionality:** Fetches last 3 sessions (from ANY channel — web or WhatsApp). Displays latest session metrics, domain scores breakdown, and trend vs previous session. Enables cross-channel continuity.

---

**Function #37: `timeSince(date, lang)`**  
- **Line:** 493  
- **Functionality:** Formats a time difference as human-readable text: "menos de 1 min", "5 min", "2h", "3 días". Bilingual.

---

### C.6 — Frontend Core Engine — Layer 7: Logos (3 exported)

> **File:** `logos.ts`  
> **Path:** `src/core/logos.ts`  
> **Lines:** 1–283  

**Function #38: `computeLogosAlignment(state)`**  
- **Functionality:** Computes Λ(x) = Λ_signal × Φ_channel. Returns `LogosResult` with lambda, interpretation, component breakdown, and channel quality info.

**Function #39: `computeChannelQuality(state)`**  
- **Functionality:** Computes Φ_channel using 4 support groups. Returns `ChannelQualityResult` with phi, group scores, weighted average.

**Constant #40: `LOGOS_COMPONENTS`**  
- **Functionality:** Source of truth for the 12 Lambda weights organized by group (reception, action, decoding, sacredNourishment, gratitude).

---

### C.7 — Frontend Core Engine — Layer 1: Friston (1 exported)

> **File:** `friston.ts`  
> **Path:** `src/core/friston.ts`  
> **Lines:** 1–75  

**Function #41: `computeFreeEnergy(state, Lambda)`**  
- **Functionality:** F(x) = Σ wᵢ(sᵢ - idealᵢ)² / 2σ², modulated by Λ. Returns `FreeEnergyResult` with value, raw, modulated, 28-dim breakdown, lambdaEffect.

---

### C.8 — Frontend Core Engine — Layer 2: Levin (3 exported)

> **File:** `levin.ts`  
> **Path:** `src/core/levin.ts`  
> **Lines:** 1–172  

**Function #42: `computeLevinSignals(state, Lambda)`**  
- **Functionality:** Detects pathological bioelectric patterns: Depressive, Anxiety, Spiritual Disconnection, Relational Isolation, Overperformance/Burnout, Enteric Dysbiosis, Negative Attractor A⁻. Returns array of `LevinSignal` with type, severity, icon, description, action, logosLink.

**Function #43: `hasCriticalSignals(signals)`**  
- **Functionality:** Returns `true` if any signal has severity ≥ 0.80.

**Function #44: `hasNegativeAttractor(signals)`**  
- **Functionality:** Returns `true` if "ATRACTOR NEGATIVO" signal is present.

---

### C.9 — Frontend Core Engine — Layer 3: Watson (1 exported)

> **File:** `watson.ts`  
> **Path:** `src/core/watson.ts`  
> **Lines:** 1–67  

**Function #45: `computeWatsonEnergy(state, Lambda)`**  
- **Functionality:** Computes energy landscape position. Calculates domain averages, Logos-modulated optimal attractors (e.g., physical optimal = 0.70 + Λ×0.15), and total energy distance. Returns `WatsonResult`.

---

### C.10 — Frontend Core Engine — Layer 4: Hoffman (1 exported)

> **File:** `hoffman.ts`  
> **Path:** `src/core/hoffman.ts`  
> **Lines:** 1–116  

**Function #46: `computeHoffmanInterface(state, Lambda)`**  
- **Functionality:** Detects cognitive biases/interface distortions: Overconfidence (clarity without wisdom), Hedonic Treadmill (joy without gratitude), Spiritual Bypass (faith without service), Toxic Positivity (joy without peace), Gustatory Hedonism (taste without nourishment), Disconnected Asceticism (nourishment without taste). Returns array of `HoffmanBias`.

---

### C.11 — Frontend Core Engine — Layer 5: Penrose (1 exported)

> **File:** `penrose.ts`  
> **Path:** `src/core/penrose.ts`  
> **Lines:** 1–64  

**Function #47: `computeCoherence(state, Lambda)`**  
- **Functionality:** Computes quantum coherence using harmonic mean of 7 domain averages. Λ-modulated: `C = harmonicMean(domains) × (0.7 + Λ × 0.4)`. Returns `CoherenceResult` with coherence, rawCoherence, entropy, domain breakdown.

---

### C.12 — Frontend Core Engine — Layer 6: Policy (2 exported)

> **File:** `policy.ts`  
> **Path:** `src/core/policy.ts`  
> **Lines:** 1–160  

**Function #48: `inhibitionPolicy(Lambda, V, S, C, prevLambda)`**  
- **Functionality:** Frontend version of verdict decision tree. Returns `InhibitionPolicy` with verdict, reasonKey, color, reason, icon, lambdaDot. Uses Spanish verdict labels (`PAUSA`, `ESPERA`, etc.).

**Function #49: `metaPolicy(policy, levinSignals, hoffmanBiases)`**  
- **Functionality:** Meta-layer that combines inhibition policy with Levin signals and Hoffman biases to generate enhanced guidance. Can override or augment the base verdict.

---

### C.13 — Frontend Core Engine — Derived Metrics (4 exported)

> **File:** `derived.ts`  
> **Path:** `src/core/derived.ts`  
> **Lines:** 1–166  

**Function #50: `computeViability(state, Lambda)`** — V(x) viability computation  
**Function #51: `computeEntropy(state, Lambda)`** — S(x) entropy computation  
**Function #52: `computeOmega(Lambda, V, S, C, F)`** — Ω(x) = Λ×0.6 + derivedHealth×0.4  
**Function #53: `computeQ(Lambda, V, S)`** — Q(x) trajectory quality

---

### C.14 — Frontend Core Engine — Layer 8: Protocol Engine (11 exported)

> **File:** `protocol-engine.ts`  
> **Path:** `src/core/protocol-engine.ts`  
> **Lines:** 1–668  

**Function #54: `computeERS(state, Lambda, V, S, C)`** — Emergence Readiness Score  
**Function #55: `computeOddsRatio(events)`** — 2×2 contingency table odds ratio  
**Function #56: `wilsonCI(successes, total, z)`** — Wilson confidence interval  
**Function #57: `computeBF10(events)`** — Bayes Factor (H1 vs H0)  
**Function #58: `calibrateWeights(events, currentWeights)`** — Dirichlet-guided weight calibration  
**Function #59: `projectToSimplex(weights)`** — Projects weights to probability simplex (Σ=1)  
**Function #60: `dirichletLogPdf(weights, alphas)`** — Dirichlet log probability density  
**Function #61: `computeLogLikelihood(events, weights)`** — Log-likelihood for calibration  
**Function #62: `safetyCheck(oldWeights, newWeights)`** — Validates monotonicity, impedance, Lyapunov  
**Function #63: `computeH1Stats(events)`** — Full H1 hypothesis statistics  
**Function #64: `computeGAF(state)`** — Global Assessment of Functioning score  

---

### C.15 — Frontend Core Engine — Layer 9: Emergence Metrics (6 exported)

> **File:** `emergence-metrics.ts`  
> **Path:** `src/core/emergence-metrics.ts`  
> **Lines:** 1–640  

**Function #65: `computeEmergenceIndex(currentState, prevState)`** — E(x) emergence index with product rule Λ̇  
**Function #66: `computeMultiScaleLambda(state)`** — Per-domain Lambda decomposition  
**Function #67: `computeCriticalityAlert(state, prevState)`** — Early warning system for A⁻ collapse  
**Function #68: `computeEnergyLandscape(state)`** — Phase space position relative to attractors  
**Function #69: `computeCoherenceMatrix(state)`** — 7×7 inter-domain coherence correlation matrix  
**Function #70: `computeShannonSNR(state)`** — Signal-to-noise ratio of consciousness signal  

---

### C.16 — Frontend Core Engine — Layer 10: Positive Geometry (5 exported)

> **File:** `positive-geometry.ts`  
> **Path:** `src/core/positive-geometry.ts`  
> **Lines:** 1–392  

**Function #71: `computeCanonicalForm(state)`** — Ω(x) = ∏ 1/(xᵢ(1-xᵢ)), normalized [0,1]  
**Function #72: `computeBoundaryProximity(state)`** — Minimum distance to any pole (xᵢ→0 or xᵢ→1)  
**Function #73: `computeTruncatedPolytope(state, Lambda)`** — P⁺_Λ(c) volume ratio, basin assignment (A⁺/A⁻)  
**Function #74: `computeDomainFactorizability(state)`** — Product state decomposition index [0,1]  
**Function #75: `computePositiveGeometry(state, Lambda)`** — Master function → GCI (Geometric Consciousness Index)  

---

### C.17 — Alimento Sagrado Engine (3 exported from frontend)

> **File:** `alimento.ts`  
> **Path:** `src/core/alimento.ts` (48KB frontend) / `api/services/alimento.js` (46KB backend)  
> **Context:** Sacred food recommendation engine with comprehensive food database.

**Function #76: `getAlimentoRecommendations(state)`** — Main recommendation engine. Identifies deficient dimensions, matches sacred foods, returns bilingual recommendations.  
**Function #77: `assessMealHarmony(mealComponents, state)`** — Evaluates how well a specific meal aligns with current consciousness state.  
**Function #78: `predictDimensionChanges(food, state)`** — Predicts how a specific food will change dimension values.  
**Function #79: `estimateEntropicDamage(food, state)`** — Estimates entropy increase from consuming a specific food.  
**Constant #80: `SACRED_FOODS`** — Complete database of sacred foods with names, nutrients, sacred notes, target dimensions (bilingual).  
**Constant #81: `NUTRIENT_PATHWAYS`** — Maps nutrients to consciousness dimensions they affect.  

---

### C.18 — HealthKit Bridge (7 exported)

> **File:** `healthkit-bridge.ts`  
> **Path:** `src/core/healthkit-bridge.ts`  
> **Lines:** 1–415  
> **Context:** Maps Apple Watch sensor data into the 7-layer engine.

**Function #82: `watchLevinSignals(bio, ecg)`** — 8 biometric pathological patterns (AFib, tachycardia, hypoxia, etc.)  
**Function #83: `modulateFreeEnergy(bio)`** — SpO₂ and HR recovery → F(x) modulation  
**Function #84: `watsonLandscapeShifts(bio)`** — VO₂, temp, RHR trend, steps → Watson energy shifts  
**Function #85: `watchHoffmanBiases(bio, subjectiveState)`** — 4 incongruence detectors (subjective vs objective)  
**Function #86: `modulateCoherence(bio)`** — Noise exposure → coherence modulation  
**Function #87: `watchPolicyOverride(bio, ecg)`** — ECG AFib / SpO₂ critical → forced PAUSA verdict  
**Function #88: `processWatchBiometrics(bio, ecg, subjectiveState)`** — Master function → combined `WatchEngineResult`  

---

### C.19 — Trend Analyzer (4 exported)

> **File:** `trend-analyzer.ts`  
> **Path:** `src/core/trend-analyzer.ts`  
> **Lines:** 1–134  

**Function #89: `analyzeTrend(points)`** — Computes 7/14/30-day rolling averages + linear regression slopes  
**Function #90: `storeTrendPoint(key, value)`** — Stores a trend data point in localStorage (30-day retention)  
**Function #91: `getTrendPoints(key)`** — Retrieves trend points from localStorage  
**Function #92: `trackAndAnalyze(key, value)`** — Store + analyze in one call → `TrendResult`  

---

### C.20 — Database Pool (1 exported)

> **File:** `pool.js`  
> **Path:** `api/db/pool.js`  
> **Lines:** 1–22  

**Export #93: `pool`** — PostgreSQL connection pool (`node-postgres` Pool). Max 10 connections, 30s idle timeout, 5s connect timeout. Auto-reconnect on error.

---

### C.21 — Summary: Complete Tool Count

| Category | File | Tool Count |
|----------|------|-----------|
| ElevenLabs Client Tools (Read) | `LogosVoiceAgent.jsx` | 10 |
| ElevenLabs Client Tools (Write) | `LogosVoiceAgent.jsx` | 4 |
| ElevenLabs Client Tools (Eval) | `LogosVoiceAgent.jsx` | 1 |
| ElevenLabs Client Tools (Advanced) | `LogosVoiceAgent.jsx` | 1 |
| Voice Agent Config | `logosAgent.js` | 5 objects |
| Backend Engine | `logos-engine.js` | 8 functions |
| WhatsApp Service | `services/whatsapp.js` | 5 exports |
| WhatsApp Route Helpers | `routes/whatsapp.js` | 8 functions |
| Core L7 Logos | `logos.ts` | 3 exports |
| Core L1 Friston | `friston.ts` | 1 function |
| Core L2 Levin | `levin.ts` | 3 functions |
| Core L3 Watson | `watson.ts` | 1 function |
| Core L4 Hoffman | `hoffman.ts` | 1 function |
| Core L5 Penrose | `penrose.ts` | 1 function |
| Core L6 Policy | `policy.ts` | 2 functions |
| Core Derived | `derived.ts` | 4 functions |
| Core L8 Protocol | `protocol-engine.ts` | 11 functions |
| Core L9 Emergence | `emergence-metrics.ts` | 6 functions |
| Core L10 Positive Geometry | `positive-geometry.ts` | 5 functions |
| Alimento Engine | `alimento.ts` / `alimento.js` | 6 exports |
| HealthKit Bridge | `healthkit-bridge.ts` | 7 functions |
| Trend Analyzer | `trend-analyzer.ts` | 4 functions |
| DB Pool | `pool.js` | 1 export |
| **TOTAL** | **22 files** | **93 tools/functions** |

---

*Document generated for OpenClaw/Chatita integration. Contains 100% of LOGOS agent architecture, endpoints, formulas, personality, cross-channel flows, and complete tools inventory.*
