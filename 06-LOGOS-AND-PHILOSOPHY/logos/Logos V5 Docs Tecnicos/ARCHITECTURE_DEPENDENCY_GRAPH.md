# LOGOS — Diagrama de Dependencias Completo

> **Documento:** ARCH-DEP-001  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Fecha:** 2026-04-11  
> **Versión:** 5.2.0

---

## 📊 GRAFO DE DEPENDENCIAS COMPUTACIONALES

```mermaid
graph TB
    %% ===== CAPA DE ENTRADA =====
    STATE[StateKey<br/>28 dimensiones ∈ [0,1]]
    DOMAINS[domains.ts<br/>7 dominios × 4 dims]
    STATEKEYS[state-keys.ts<br/>Metadata 28 dims]
    TYPES[types/index.ts<br/>Interfaces TypeScript]
    
    %% ===== UTILIDADES =====
    MATH[utils/math.ts<br/>clamp, harmonicMean<br/>weightedAverage]
    
    %% ===== NÚCLEO COMPUTACIONAL (7 CAPAS) =====
    L7[core/logos.ts<br/>Layer 7: Λ(x)<br/>Hierarchical Lambda]
    L1[core/friston.ts<br/>Layer 1: F(x)<br/>Free Energy Principle]
    L2[core/levin.ts<br/>Layer 2: Señales<br/>Bioelectric Patterns]
    L3[core/watson.ts<br/>Layer 3: Atractores<br/>Energy Landscape]
    L4[core/hoffman.ts<br/>Layer 4: Biases<br/>Interface Theory]
    L5[core/penrose.ts<br/>Layer 5: C(x)<br/>Quantum Coherence]
    L6[core/policy.ts<br/>Layer 6: π(x)<br/>Inhibition Policy]
    
    %% ===== MÉTRICAS DERIVADAS =====
    DERIVED[core/derived.ts<br/>V(x), S(x), Ω(x), Q(x)]
    
    %% ===== PROTOCOLO DE INVESTIGACIÓN =====
    PROTOCOL[core/protocol-engine.ts<br/>Layer 8: ERS, H1, BF10<br/>Bayesian Calibration]
    EMERGENCE[core/emergence-metrics.ts<br/>E(x), SNR, Criticality<br/>Multi-Scale Λ]
    GEOMETRY[core/positive-geometry.ts<br/>Layer 10: GCI<br/>Canonical Form]
    
    %% ===== SIMULACIÓN =====
    MC[simulation/monte-carlo.ts<br/>Langevin Dynamics<br/>N=100K trajectories]
    
    %% ===== INTEGRACIÓN =====
    INDEX[core/index.ts<br/>Barrel Exports]
    
    %% ===== REACT HOOKS =====
    USELOGOS[hooks/useLogosEngine.ts<br/>React Integration]
    USEPROTOCOL[hooks/useProtocol.ts<br/>Protocol State]
    USECUSTOM[hooks/useCustomWeights.ts<br/>Weight Overrides]
    USEBAYESIAN[hooks/useBayesianWeights.ts<br/>CBWA Algorithm]
    
    %% ===== COMPONENTES UI =====
    APP[App.jsx<br/>OAuth + Routing]
    LOGOSHUMANO[LogosHumano.jsx<br/>Main Component<br/>3800 lines]
    REPORTER[EmergenceReporter.jsx<br/>EMA Modal]
    VISUALIZATIONS[EmergenceVisualizations.jsx<br/>5 sub-components]
    LANDSCAPE[EnergyLandscapeMap.jsx<br/>Canvas 2D]
    CASCADE[EmergenceCascade.jsx<br/>SVG Flow]
    
    %% ===== SERVICIOS =====
    API[services/api.js<br/>HTTP Client]
    SUPABASE[services/supabase.js<br/>Supabase Client]
    PROTOCOLAPI[services/protocol-api.js<br/>Protocol Endpoints]
    
    %% ===== BACKEND API (M5:3200) =====
    APISERVER[api/server.js<br/>Express + PostgreSQL]
    APIENGINE[api/services/logos-engine.js<br/>Simplified Engine]
    
    %% ===== BACKEND MULTI-CANAL (M5:3100) =====
    BACKENDSERVER[logos-backend/server.js<br/>Multi-channel Bridge]
    BACKENDENGINE[logos-backend/metrics-engine.js<br/>Full Port Engine]
    PROTOCOLROUTES[logos-backend/protocol.js<br/>8 endpoints]
    AGENT[logos-backend/logos-agent.mjs<br/>OpenAI Agents SDK<br/>12 tools]
    
    %% ===== BASE DE DATOS =====
    POSTGRES[(PostgreSQL<br/>users, sessions<br/>daily_snapshots)]
    SUPABASEDB[(Supabase<br/>study_participants<br/>emergence_events<br/>protocol_daily)]
    
    %% ===== DEPENDENCIAS =====
    STATE --> L7
    DOMAINS --> TYPES
    STATEKEYS --> TYPES
    TYPES --> L7
    TYPES --> DERIVED
    TYPES --> PROTOCOL
    
    MATH --> L7
    MATH --> L5
    MATH --> DERIVED
    MATH --> PROTOCOL
    
    L7 --> L1
    L7 --> DERIVED
    L7 --> PROTOCOL
    L7 --> EMERGENCE
    
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> DERIVED
    
    DERIVED --> L6
    DERIVED --> PROTOCOL
    DERIVED --> EMERGENCE
    
    L6 --> INDEX
    PROTOCOL --> INDEX
    EMERGENCE --> INDEX
    GEOMETRY --> INDEX
    
    L7 --> INDEX
    L1 --> INDEX
    L2 --> INDEX
    L3 --> INDEX
    L4 --> INDEX
    L5 --> INDEX
    DERIVED --> INDEX
    MC --> INDEX
    
    INDEX --> USELOGOS
    INDEX --> USEPROTOCOL
    
    USELOGOS --> LOGOSHUMANO
    USEPROTOCOL --> LOGOSHUMANO
    USECUSTOM --> LOGOSHUMANO
    USEBAYESIAN --> LOGOSHUMANO
    
    LOGOSHUMANO --> REPORTER
    LOGOSHUMANO --> VISUALIZATIONS
    LOGOSHUMANO --> LANDSCAPE
    LOGOSHUMANO --> CASCADE
    
    APP --> LOGOSHUMANO
    
    API --> APISERVER
    SUPABASE --> SUPABASEDB
    PROTOCOLAPI --> PROTOCOLROUTES
    
    LOGOSHUMANO --> API
    LOGOSHUMANO --> SUPABASE
    LOGOSHUMANO --> PROTOCOLAPI
    
    APISERVER --> POSTGRES
    APISERVER --> APIENGINE
    
    BACKENDSERVER --> BACKENDENGINE
    BACKENDSERVER --> PROTOCOLROUTES
    BACKENDSERVER --> AGENT
    BACKENDSERVER --> POSTGRES
    BACKENDSERVER --> SUPABASEDB
    
    AGENT --> BACKENDENGINE
    
    %% ===== ESTILOS =====
    classDef core fill:#9333ea,stroke:#7c3aed,color:#fff
    classDef derived fill:#0891b2,stroke:#0e7490,color:#fff
    classDef protocol fill:#059669,stroke:#047857,color:#fff
    classDef ui fill:#dc2626,stroke:#b91c1c,color:#fff
    classDef backend fill:#ea580c,stroke:#c2410c,color:#fff
    classDef db fill:#4f46e5,stroke:#4338ca,color:#fff
    classDef util fill:#64748b,stroke:#475569,color:#fff
    
    class L7,L1,L2,L3,L4,L5,L6 core
    class DERIVED,MC derived
    class PROTOCOL,EMERGENCE,GEOMETRY protocol
    class APP,LOGOSHUMANO,REPORTER,VISUALIZATIONS,LANDSCAPE,CASCADE ui
    class APISERVER,APIENGINE,BACKENDSERVER,BACKENDENGINE,PROTOCOLROUTES,AGENT backend
    class POSTGRES,SUPABASEDB db
    class MATH,TYPES,DOMAINS,STATEKEYS,INDEX util
```

---

## 🔄 FLUJO DE DATOS UNIDIRECCIONAL

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO (UI)                                │
│  28 sliders → StateKey (28 dims ∈ [0,1])                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REACT COMPONENT                                │
│  LogosHumano.jsx → useState(state)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT HOOK                                    │
│  useLogosEngine(state) → useMemo recompute                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              CORE ENGINE (7 LAYERS)                              │
│  L7 → L1 → L2 → L3 → L4 → L5 → Derived → L6                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROTOCOL ENGINE (Layer 8)                           │
│  ERS, E(x), Multi-Scale Λ, SNR, Criticality                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  METRICS BREAKDOWN                               │
│  { lambda, viability, entropy, coherence, freeEnergy,           │
│    omega, trajectory, policy, ers, emergence, ... }             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├─────────────────┬─────────────────┐
                         ▼                 ▼                 ▼
                    ┌─────────┐      ┌─────────┐      ┌──────────┐
                    │   UI    │      │  API    │      │ Supabase │
                    │ Render  │      │  Save   │      │  Save    │
                    └─────────┘      └─────────┘      └──────────┘
```

---

## 📦 MÓDULOS Y RESPONSABILIDADES

### **CORE (Computación Pura)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `logos.ts` | 180 | 2 | math.ts, types |
| `friston.ts` | 220 | 1 | types |
| `levin.ts` | 280 | 1 | types |
| `watson.ts` | 150 | 1 | types |
| `hoffman.ts` | 320 | 1 | types |
| `penrose.ts` | 140 | 1 | math.ts, types |
| `policy.ts` | 380 | 1 | types |
| `derived.ts` | 420 | 4 | math.ts, types |
| `protocol-engine.ts` | 668 | 11 | math.ts, types |
| `emergence-metrics.ts` | 540 | 6 | logos.ts, types |
| `positive-geometry.ts` | 480 | 6 | math.ts, types |
| **TOTAL** | **3,778** | **35** | — |

### **SIMULATION**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `monte-carlo.ts` | 320 | 1 | core/*, math.ts |

### **HOOKS (React Integration)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `useLogosEngine.ts` | 85 | 1 | core/index.ts |
| `useProtocol.ts` | 180 | 1 | protocol-api.js |
| `useCustomWeights.ts` | 120 | 1 | localStorage |
| `useBayesianWeights.ts` | 340 | 1 | protocol-engine.ts |

### **COMPONENTS (UI)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `App.jsx` | 450 | — | api.js, supabase.js |
| `LogosHumano.jsx` | 3,800 | — | hooks/*, components/* |
| `EmergenceReporter.jsx` | 320 | — | protocol-api.js |
| `EmergenceVisualizations.jsx` | 580 | — | emergence-metrics.ts |
| `EnergyLandscapeMap.jsx` | 280 | — | canvas API |
| `EmergenceCascade.jsx` | 420 | — | SVG |

### **SERVICES (API Clients)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `api.js` | 180 | 8 | fetch API |
| `supabase.js` | 220 | 12 | @supabase/supabase-js |
| `protocol-api.js` | 160 | 6 | supabase.js |

### **BACKEND (M5:3200)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `api/server.js` | 280 | — | express, pg |
| `api/services/logos-engine.js` | 520 | 7 | — |

### **BACKEND (M5:3100)**
| Archivo | LOC | Funciones | Dependencias |
|---------|-----|-----------|--------------|
| `logos-backend/server.js` | 180 | — | express, ws |
| `logos-backend/metrics-engine.js` | 840 | 7 | — |
| `logos-backend/protocol.js` | 420 | 8 | supabase, openai |
| `logos-backend/logos-agent.mjs` | 960 | 12 | @openai/agents |

---

## 🗂️ ESTRUCTURA DE ARCHIVOS POR CAPA

```
src/
├── core/                          # NÚCLEO COMPUTACIONAL (3,778 LOC)
│   ├── logos.ts                   # L7: Λ(x) hierarchical
│   ├── friston.ts                 # L1: F(x) free energy
│   ├── levin.ts                   # L2: Bioelectric signals
│   ├── watson.ts                  # L3: Energy landscape
│   ├── hoffman.ts                 # L4: Perceptual biases
│   ├── penrose.ts                 # L5: Quantum coherence
│   ├── policy.ts                  # L6: Inhibition policy
│   ├── derived.ts                 # V, S, Ω, Q
│   ├── protocol-engine.ts         # L8: ERS, H1, calibration
│   ├── emergence-metrics.ts       # E(x), SNR, criticality
│   ├── positive-geometry.ts       # L10: GCI, canonical form
│   ├── index.ts                   # Barrel exports
│   └── __tests__/                 # 759 tests
│       ├── logos.test.ts
│       ├── friston.test.ts
│       ├── levin.test.ts
│       ├── watson.test.ts
│       ├── hoffman.test.ts
│       ├── penrose.test.ts
│       ├── policy.test.ts
│       ├── derived.test.ts
│       ├── protocol-engine.test.ts
│       ├── emergence-metrics.test.ts
│       └── positive-geometry.test.ts
│
├── simulation/                    # MONTE CARLO (320 LOC)
│   └── monte-carlo.ts
│
├── types/                         # INTERFACES (280 LOC)
│   └── index.ts
│
├── domain/                        # CONSTANTES (180 LOC)
│   ├── state-keys.ts              # 28 dimensions metadata
│   └── domains.ts                 # 7 domains × 4 dims
│
├── utils/                         # UTILIDADES (120 LOC)
│   └── math.ts
│
├── hooks/                         # REACT INTEGRATION (725 LOC)
│   ├── useLogosEngine.ts
│   ├── useProtocol.ts
│   ├── useCustomWeights.ts
│   └── useBayesianWeights.ts
│
├── components/                    # UI COMPONENTS (5,850 LOC)
│   ├── LogosHumano.jsx            # Main (3,800)
│   ├── EmergenceReporter.jsx
│   ├── EmergenceVisualizations.jsx
│   ├── EnergyLandscapeMap.jsx
│   ├── EmergenceCascade.jsx
│   └── ...
│
├── services/                      # API CLIENTS (560 LOC)
│   ├── api.js
│   ├── supabase.js
│   └── protocol-api.js
│
└── i18n/                          # TRANSLATIONS
    ├── index.js
    └── locales/
        ├── es.json                # 1,651 lines
        └── en.json                # 1,651 lines

api/                               # BACKEND M5:3200 (800 LOC)
├── server.js
├── services/
│   └── logos-engine.js
└── db/
    ├── init.sql
    └── migrate_session_upsert.sql

logos-backend/                     # BACKEND M5:3100 (2,400 LOC)
├── server.js
├── src/
│   ├── services/
│   │   ├── metrics-engine.js
│   │   └── logos-agent.mjs
│   └── routes/
│       └── protocol.js
└── knowledge/
    └── logos-model.md

scripts/                           # MIGRATIONS
└── v5_migration.sql               # Supabase schema

docs/                              # DOCUMENTATION
├── PAPER_LOGOS_SINTONIA_UNIFIED_FRAMEWORK.md  # 1,405 lines
├── DOCUMENTO_MAESTRO_LOGOS.md                 # 3,851 lines
├── LOGOS_V5_TEST_PROTOCOL.md                  # 154 lines
└── ARCHITECTURE_DEPENDENCY_GRAPH.md           # This file
```

---

## 🔗 DEPENDENCIAS EXTERNAS

### **Frontend**
```json
{
  "react": "^18.2.0",
  "react-i18next": "^13.5.0",
  "recharts": "^2.10.3",
  "@supabase/supabase-js": "^2.39.0",
  "@capacitor/core": "^5.5.1"
}
```

### **Backend (M5:3200)**
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "cors": "^2.8.5"
}
```

### **Backend (M5:3100)**
```json
{
  "express": "^4.18.2",
  "ws": "^8.14.2",
  "@openai/agents": "^0.1.0",
  "@supabase/supabase-js": "^2.39.0",
  "twilio": "^4.19.0"
}
```

---

## 📊 MÉTRICAS DE CÓDIGO

| Categoría | Archivos | LOC | Tests |
|-----------|----------|-----|-------|
| **Core Engine** | 11 | 3,778 | 759 |
| **Simulation** | 1 | 320 | 18 |
| **Types/Domain** | 3 | 460 | — |
| **Utils** | 1 | 120 | 12 |
| **Hooks** | 4 | 725 | — |
| **Components** | 15+ | 5,850 | — |
| **Services** | 3 | 560 | — |
| **Backend M5:3200** | 2 | 800 | — |
| **Backend M5:3100** | 4 | 2,400 | — |
| **Documentation** | 4 | 6,865 | — |
| **TOTAL** | **48+** | **21,878** | **789** |

---

## 🎯 PUNTOS DE ENTRADA

### **Frontend**
```
src/App.jsx → src/components/LogosHumano.jsx → src/hooks/useLogosEngine.ts → src/core/index.ts
```

### **Backend API (M5:3200)**
```
api/server.js → api/services/logos-engine.js
```

### **Backend Multi-Canal (M5:3100)**
```
logos-backend/server.js → logos-backend/src/services/logos-agent.mjs → logos-backend/src/services/metrics-engine.js
```

### **Tests**
```
npm test → vitest → src/core/__tests__/*.test.ts
```

---

## 🔐 FLUJO DE AUTENTICACIÓN

```
Usuario → Google OAuth 2.0
    ↓
App.jsx (handleGoogleAuth)
    ↓
POST /api/auth/sync (M5:3200)
    ↓
PostgreSQL users table (upsert)
    ↓
Return { dbId, email, name }
    ↓
localStorage.setItem('logos-db-user-id', dbId)
    ↓
Supabase auth.signInWithIdToken()
    ↓
Supabase profiles table (upsert via trigger)
    ↓
RLS policies activated
```

---

## 💾 FLUJO DE PERSISTENCIA

### **Estado de Consciencia**
```
LogosHumano.jsx (state change)
    ↓
Dual-save (3 min interval + beforeunload):
    ├─→ POST /api/state/:userId (M5:3200 PostgreSQL)
    └─→ Supabase profiles.last_state (JSONB)
```

### **Sesiones**
```
LogosHumano.jsx (session end)
    ↓
POST /api/sessions (M5:3200)
    ↓
PostgreSQL sessions table (UPSERT by client_session_id)
    ↓
Trigger: Update daily_snapshots (aggregates)
```

### **Eventos de Emergencia**
```
EmergenceReporter.jsx (submit)
    ↓
POST /api/protocol/emergence (M5:3100)
    ↓
Supabase emergence_events table
    ↓
Trigger: Refresh mv_h1_stats (materialized view)
```

---

## 🧪 FLUJO DE TESTING

```
npm test
    ↓
vitest (test runner)
    ↓
src/core/__tests__/*.test.ts (759 tests)
    ↓
Import from src/core/index.ts
    ↓
Execute pure functions with mock inputs
    ↓
Assert outputs match expected values
    ↓
Coverage report (v8 provider)
```

---

*Cadena Strategic Systems © 2026*
