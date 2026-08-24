# DIAGRAMAS — LOGOS

> **Documento:** SRS-DIAG-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 42010  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Diagrama de Flujo del Cálculo de Métricas](#1-diagrama-de-flujo-del-cálculo-de-métricas)
2. [Diagrama de Secuencia del Monte Carlo](#2-diagrama-de-secuencia-del-monte-carlo)
3. [Diagrama de Estados de π(x)](#3-diagrama-de-estados-de-πx)
4. [Diagrama de Clases/Componentes](#4-diagrama-de-clasescomponentes)
5. [Diagrama de Dependencias de Módulos](#5-diagrama-de-dependencias-de-módulos)
6. [Diagrama de Flujo de Autenticación](#6-diagrama-de-flujo-de-autenticación)
7. [Diagrama de Atractores Duales](#7-diagrama-de-atractores-duales)
8. [Diagrama IFC ↔ LOGOS Bridge (v3.3.0)](#8-diagrama-ifc--logos-bridge-v330)
9. [Diagrama de Interpretación AI (v3.3.0)](#9-diagrama-de-interpretación-ai-v330)

---

## 1. Diagrama de Flujo del Cálculo de Métricas

```mermaid
flowchart TD
    Start["🎛️ Usuario ajusta sliders<br/>x ∈ [0,1]²⁸"] --> State["ConsciousnessState<br/>28 dimensiones"]
    
    State --> L7["⚙️ L7: computeLogosAlignment(x)<br/>Λ(x) = Σ wᵢ·xᵢ"]
    
    L7 --> |"Λ"| L1["L1: computeFreeEnergy(x, Λ)<br/>F = F_raw × (1 - Λ×0.3)"]
    L7 --> |"Λ"| L2["L2: computeLevinSignals(x, Λ)<br/>Detección de patrones"]
    L7 --> |"Λ"| L3["L3: computeWatsonEnergy(x, Λ)<br/>E = √(Σ gaps²)"]
    L7 --> |"Λ"| L4["L4: computeHoffmanInterface(x, Λ)<br/>Sesgos perceptuales"]
    L7 --> |"Λ"| L5["L5: computeCoherence(x, Λ)<br/>C = H(D₁..D₇) × (0.7 + Λ×0.4)"]
    L7 --> |"Λ"| DV["computeViability(x, Λ)<br/>V = V_raw × (0.75 + Λ×0.35)"]
    L7 --> |"Λ"| DS["computeEntropy(x, Λ)<br/>S = S_raw × (1.2 - Λ×0.4)"]
    
    DV --> |"V"| Omega["computeOmega(Λ, V, S, C, F)<br/>Ω = Λ×0.6 + health×0.4"]
    DS --> |"S"| Omega
    L5 --> |"C"| Omega
    L1 --> |"F"| Omega
    L7 --> |"Λ"| Omega
    
    DV --> |"V"| Q["computeQ(Λ, V, S)<br/>Q = Λ×0.4 + V×0.2 - S×0.2 - D×0.3"]
    DS --> |"S"| Q
    L7 --> |"Λ"| Q
    
    DV --> |"V"| Pi["inhibitionPolicy(Λ, V, S, C)<br/>π(x) → Veredicto"]
    DS --> |"S"| Pi
    L5 --> |"C"| Pi
    L7 --> |"Λ"| Pi
    
    L2 --> |"signals"| Meta["metaPolicy(Λ, V, S, C, signals)<br/>π²(x) → Meta-veredicto"]
    DV --> |"V"| Meta
    DS --> |"S"| Meta
    L5 --> |"C"| Meta
    L7 --> |"Λ"| Meta
    
    Omega --> Render["📊 Dashboard<br/>Métricas + Charts + Recomendaciones"]
    Q --> Render
    Pi --> Render
    Meta --> Render
    L2 --> Render
    L4 --> Render
    L3 --> Render
    
    style L7 fill:#c084fc,color:#000,stroke:#8b5cf6
    style Omega fill:#fbbf24,color:#000,stroke:#d4a017
    style Pi fill:#6366f1,color:#fff,stroke:#4f46e5
    style Render fill:#10b981,color:#000,stroke:#059669
```

---

## 2. Diagrama de Secuencia del Monte Carlo

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as Dashboard UI
    participant MC as runMonteCarlo()
    participant PS as projectStateStochastic()
    participant CE as Core Engine
    participant ST as Statistics

    U->>UI: Click "Ejecutar Monte Carlo"<br/>N=10000, σ=0.04
    UI->>MC: runMonteCarlo(state, N, steps, σ)
    
    Note over MC: Inicializar arrays de tracking<br/>LamByT, VbyT, SbyT, OmegaByT, verdictByT
    
    loop i = 0 to N-1 (10,000 simulaciones)
        MC->>MC: cur = {...state} (copia estado)
        
        loop t = 0 to steps (30 pasos)
            MC->>CE: computeLogosAlignment(cur) → Λ
            MC->>CE: computeViability(cur, Λ) → V
            MC->>CE: computeEntropy(cur, Λ) → S
            MC->>CE: computeCoherence(cur, Λ) → C
            MC->>CE: computeFreeEnergy(cur, Λ) → F
            MC->>CE: computeOmega(Λ, V, S, C, F) → Ω
            MC->>CE: inhibitionPolicy(Λ, V, S, C, prevΛ) → π
            
            MC->>MC: Registrar Λ, V, S, Ω en arrays[t]
            MC->>MC: Registrar veredicto π en verdictByT[t]
            
            alt t < steps
                MC->>PS: projectStateStochastic(cur, σ)
                PS->>PS: Para cada dim: x += drift + σ·N(0,1)
                PS-->>MC: nuevo estado cur
            end
        end
        
        MC->>MC: Registrar Λ_final, timeToActúa
    end
    
    MC->>ST: Calcular percentiles por paso temporal
    MC->>ST: Calcular Wilson CIs para veredictos finales
    MC->>ST: Calcular P(Λ↑), P(A⁻), TTA mediana
    
    ST-->>MC: MonteCarloResult
    MC-->>UI: Resultado completo
    UI-->>U: Gráficas de fan chart, distribución π, estadísticas
```

---

## 3. Diagrama de Estados de π(x)

```mermaid
stateDiagram-v2
    [*] --> Evaluación: Estado x ingresado
    
    Evaluación --> PAUSA: Λ < 0.15
    Evaluación --> PAUSA: V < 0.30
    Evaluación --> ESPERA: S > 0.55
    Evaluación --> ESPERA: C < 0.30
    Evaluación --> RECONECTA: Λ̇ < -0.02
    Evaluación --> ACTÚA: Λ>0.50 ∧ V>0.55 ∧ S<0.35 ∧ C>0.45
    Evaluación --> MONITOREA: (default)
    
    state PAUSA {
        [*] --> CanalCerrado: Λ < 0.15
        [*] --> ViabilidadColapsada: V < 0.30
    }
    
    state ESPERA {
        [*] --> EntropíaAlta: S > 0.55
        [*] --> CoherenciaInsuficiente: C < 0.30
    }
    
    PAUSA --> Evaluación: Λ o V mejoran
    ESPERA --> Evaluación: S o C mejoran
    RECONECTA --> Evaluación: Λ̇ ≥ -0.02
    MONITOREA --> Evaluación: Condiciones cambian
    ACTÚA --> Evaluación: Condiciones cambian
    
    note right of PAUSA
        🛑 No tomes decisiones
        Primero reconecta
    end note
    
    note right of ACTÚA
        ✦ Procede con confianza
        La señal es clara
    end note
    
    note right of RECONECTA
        🔮 Te alejas del Logos
        Detente y reconecta
    end note
```

### Meta-Política π²(x)

```mermaid
stateDiagram-v2
    [*] --> Evaluación_Meta
    
    Evaluación_Meta --> ESCAPE_A⁻: Atractor negativo detectado
    Evaluación_Meta --> ESCAPE: Señales severidad > 0.75
    Evaluación_Meta --> ACTIVAR: Λ < Λ* ∧ V < V*
    Evaluación_Meta --> SOSTENER: Λ ≥ Λ* ∧ V ≥ V* ∧ S < S*
    Evaluación_Meta --> EVOLUCIONAR: (default)
    
    ESCAPE_A⁻ --> Evaluación_Meta: Intervención exitosa
    ESCAPE --> Evaluación_Meta: Patrones resueltos
    ACTIVAR --> SOSTENER: Alcanza A⁺
    SOSTENER --> EVOLUCIONAR: Estabilidad prolongada
```

---

## 4. Diagrama de Clases/Componentes

```mermaid
classDiagram
    class ConsciousnessState {
        +sleep: number
        +nutrition: number
        +exercise: number
        +energy: number
        +peace: number
        +gratitude: number
        +love: number
        +joy: number
        +clarity: number
        +focus: number
        +creativity: number
        +wisdom: number
        +faith: number
        +meditation: number
        +service: number
        +presence: number
        +family: number
        +friendship: number
        +community: number
        +compassion: number
        +meaning: number
        +mission: number
        +contribution: number
        +legacy: number
    }
    
    class LogosEngine {
        +computeLogosAlignment(s) LogosResult
        +interpretLogosAlignment(λ) Interpretation
    }
    
    class FristonEngine {
        +computeFreeEnergy(s, Λ) FreeEnergyResult
    }
    
    class LevinEngine {
        +computeLevinSignals(s, Λ) LevinSignal[]
        +hasCriticalSignals(signals) boolean
        +hasNegativeAttractor(signals) boolean
    }
    
    class WatsonEngine {
        +computeWatsonEnergy(s, Λ) WatsonResult
    }
    
    class HoffmanEngine {
        +computeHoffmanInterface(s, Λ) HoffmanBias[]
    }
    
    class PenroseEngine {
        +computeCoherence(s, Λ) CoherenceResult
    }
    
    class PolicyEngine {
        +inhibitionPolicy(Λ, V, S, C, prevΛ) InhibitionPolicy
        +metaPolicy(Λ, V, S, C, signals) MetaPolicy
    }
    
    class DerivedEngine {
        +computeViability(s, Λ) ViabilityResult
        +computeEntropy(s, Λ) EntropyResult
        +computeOmega(Λ, V, S, C, F) OmegaResult
        +computeQ(Λ, V, S) TrajectoryResult
    }
    
    class MonteCarloEngine {
        +runMonteCarlo(s, N, steps, σ) MonteCarloResult
        +projectTrajectory(s, steps) TrajectoryPoint[]
    }
    
    ConsciousnessState --> LogosEngine: input
    LogosEngine --> FristonEngine: Λ
    LogosEngine --> LevinEngine: Λ
    LogosEngine --> WatsonEngine: Λ
    LogosEngine --> HoffmanEngine: Λ
    LogosEngine --> PenroseEngine: Λ
    LogosEngine --> DerivedEngine: Λ
    DerivedEngine --> PolicyEngine: V, S
    PenroseEngine --> PolicyEngine: C
    LevinEngine --> PolicyEngine: signals
    ConsciousnessState --> MonteCarloEngine: input
    MonteCarloEngine --> LogosEngine: uses
    MonteCarloEngine --> DerivedEngine: uses
    MonteCarloEngine --> PenroseEngine: uses
    MonteCarloEngine --> FristonEngine: uses
    MonteCarloEngine --> PolicyEngine: uses
```

---

## 5. Diagrama de Dependencias de Módulos

```mermaid
graph TD
    subgraph Entry["Entry Point"]
        main["main.jsx"]
    end
    
    subgraph App["Application"]
        AppJSX["App.jsx"]
    end
    
    subgraph Components["Components"]
        LH["LogosHumano.jsx"]
        TM["TheoryManual.jsx"]
        ST["SessionTracker.jsx"]
        VA["LogosVoiceAgent.jsx"]
        IFC["IFCModel.jsx"]
    end
    
    subgraph Core["Core Engine"]
        CoreIdx["core/index.ts"]
        Logos["core/logos.ts"]
        Friston["core/friston.ts"]
        Levin["core/levin.ts"]
        Watson["core/watson.ts"]
        Hoffman["core/hoffman.ts"]
        Penrose["core/penrose.ts"]
        Policy["core/policy.ts"]
        Derived["core/derived.ts"]
    end
    
    subgraph Simulation["Simulation"]
        SimIdx["simulation/index.ts"]
        MC["simulation/montecarlo.ts"]
    end
    
    subgraph Domain["Domain"]
        DomIdx["domain/index.ts"]
        Const["domain/constants.ts"]
    end
    
    subgraph Types["Types"]
        TypeIdx["types/index.ts"]
    end
    
    subgraph Utils["Utils"]
        UtilIdx["utils/index.ts"]
        Math["utils/math.ts"]
    end
    
    subgraph Hooks["Hooks"]
        HookIdx["hooks/index.ts"]
        Engine["hooks/useLogosEngine.ts"]
    end
    
    subgraph Services["Services"]
        SB["services/supabase.js"]
        API["services/api.js"]
    end
    
    main --> AppJSX
    AppJSX --> LH & IFC & SB
    API --> SB
    LH --> CoreIdx & SimIdx & DomIdx & TM & VA & ST & API
    CoreIdx --> Logos & Friston & Levin & Watson & Hoffman & Penrose & Policy & Derived
    Logos --> TypeIdx & Math
    Friston --> TypeIdx & Math
    Levin --> TypeIdx
    Watson --> TypeIdx & Const
    Hoffman --> TypeIdx
    Penrose --> TypeIdx & Const & Math
    Policy --> TypeIdx & Const
    Derived --> TypeIdx & Math & Const
    MC --> Math & Logos & Derived & Penrose & Friston & Policy
    Engine --> CoreIdx & DomIdx & TypeIdx
    
    style Logos fill:#c084fc,color:#000
    style CoreIdx fill:#c084fc22,stroke:#c084fc
    style MC fill:#06b6d4,color:#000
```

---

## 6. Diagrama de Flujo de Autenticación (Supabase)

```mermaid
flowchart TD
    Start["Usuario visita<br/>https://logoilab.com"] --> Check{"Supabase session<br/>en localStorage?"}
    
    Check -->|"Sí (JWT válido)"| Profile{"profiles.phone<br/>existe?"}
    Profile -->|"Sí"| WACheck{"whatsapp_optin?"}
    WACheck -->|"Sí"| Dashboard["📊 Dashboard<br/>LogosHumano"]
    WACheck -->|"No"| WAOptIn["📱 WhatsApp Opt-In<br/>wa.me link"]
    Profile -->|"No"| Phone["📞 Completa tu perfil<br/>Input teléfono"]
    
    Check -->|"No"| Login["🔐 Login Page<br/>Google + Apple + Guest"]
    
    Login --> Google["Sign in with Google"]
    Login --> Apple["Sign in with Apple"]
    Login --> Guest["Entrar como Invitado"]
    
    Google --> SupaAuth["Supabase Auth<br/>OAuth redirect"]
    Apple --> SupaAuth
    SupaAuth --> Callback["Callback a Supabase<br/>/auth/v1/callback"]
    Callback --> JWT["JWT + refresh_token<br/>→ localStorage"]
    JWT --> Profile
    
    Guest --> GuestLocal["Usuario local<br/>(sin Supabase)"]
    GuestLocal --> Dashboard
    
    Phone --> SavePhone["handlePhoneSave()<br/>profiles.phone = +52..."]
    SavePhone --> LinkCU["Auto-vincular o crear<br/>channel_users"]
    LinkCU --> WAOptIn
    
    WAOptIn -->|"Conectar"| OpenWA["window.open<br/>wa.me/19788012275"]
    WAOptIn -->|"Ahora no"| Dashboard
    OpenWA --> Dashboard
    
    Dashboard --> Logout["Cerrar sesión"]
    Logout --> SignOut["supabase.auth.signOut()<br/>JWT eliminado"]
    SignOut --> Start
    
    style Login fill:#1e1e3d,color:#f0f0f8,stroke:#c084fc
    style Dashboard fill:#10b981,color:#000
    style Google fill:#4285F4,color:#fff
    style Apple fill:#000,color:#fff
    style Phone fill:#6366f1,color:#fff
    style WAOptIn fill:#25D366,color:#fff
```

---

## 6b. Diagrama de Identidad Cross-Channel

```mermaid
graph TD
    subgraph Web["🌐 Web (logoilab.com)"]
        OAuth["Supabase Auth<br/>Google / Apple"]
        ProfileW["profiles<br/>id: UUID<br/>email: user@gmail.com<br/>phone: +521234567890<br/>last_state: {24 dims}"]
    end
    
    subgraph WA["📱 WhatsApp"]
        WAUser["channel_users<br/>phone: +521234567890<br/>user_id: → profiles.id<br/>state: (fallback)"]
    end
    
    subgraph Voice["📞 Voz (Twilio)"]
        VoiceUser["channel_users<br/>phone: +521234567890<br/>channel: voice"]
    end
    
    subgraph SMS["💬 SMS"]
        SMSUser["channel_users<br/>phone: +521234567890<br/>channel: sms"]
    end
    
    ProfileW -->|"phone match"| WAUser
    ProfileW -->|"phone match"| VoiceUser
    ProfileW -->|"phone match"| SMSUser
    
    WAUser -->|"user_id FK"| ProfileW
    VoiceUser -->|"user_id FK"| ProfileW
    SMSUser -->|"user_id FK"| ProfileW
    
    subgraph State["🔄 Estado Unificado"]
        LS["profiles.last_state<br/>(source of truth)<br/>{sleep: 0.7, faith: 0.8, ...}"]
    end
    
    ProfileW --> LS
    WAUser -->|"getUserState() reads"| LS
    VoiceUser -->|"getUserState() reads"| LS
    SMSUser -->|"getUserState() reads"| LS
    
    style Web fill:#6366f122,stroke:#6366f1
    style WA fill:#25D36622,stroke:#25D366
    style Voice fill:#f59e0b22,stroke:#f59e0b
    style SMS fill:#06b6d422,stroke:#06b6d4
    style State fill:#c084fc22,stroke:#c084fc
```

---

## 7. Diagrama de Atractores Duales

```mermaid
graph TD
    subgraph APlus["🟢 Atractor Positivo A⁺"]
        AP1["Λ ≥ 0.60"]
        AP2["V ≥ 0.70"]
        AP3["S ≤ 0.30"]
        AP4["π = ACTÚA ✦"]
        AP5["π² = SOSTENER"]
    end
    
    subgraph Transition["🟡 Zona de Transición"]
        T1["0.20 < Λ < 0.60"]
        T2["0.30 < V < 0.70"]
        T3["0.30 < S < 0.50"]
        T4["π = MONITOREA ◎"]
        T5["π² = ACTIVAR / EVOLUCIONAR"]
    end
    
    subgraph AMinus["🔴 Atractor Negativo A⁻"]
        AM1["Λ < 0.20"]
        AM2["S > 0.50"]
        AM3["peace < 0.25"]
        AM4["meaning < 0.25"]
        AM5["π = PAUSA 🛑"]
        AM6["π² = ESCAPE A⁻"]
    end
    
    APlus -->|"Λ̇ < 0<br/>Desalineación"| Transition
    Transition -->|"Λ̇ > 0<br/>Reconexión"| APlus
    Transition -->|"Λ̇ < 0<br/>Espiral entrópica"| AMinus
    AMinus -->|"Intervención externa<br/>Protocolo de escape"| Transition
    
    AMinus -.->|"Auto-reforzante<br/>Cada paso dificulta retorno"| AMinus
    APlus -.->|"Auto-reforzante<br/>Mayor Λ → mayor V, menor S"| APlus
    
    style APlus fill:#10b98122,stroke:#10b981,color:#10b981
    style Transition fill:#f59e0b22,stroke:#f59e0b,color:#f59e0b
    style AMinus fill:#ef444422,stroke:#ef4444,color:#ef4444
```

---

## 8. Diagrama IFC ↔ LOGOS Bridge (v3.3.0)

```mermaid
flowchart LR
    subgraph LOGOS["LOGOS Humano"]
        State28["Estado x ∈ [0,1]²⁸<br/>28 dimensiones × 7 dominios"]
        Save["useEffect<br/>sessionStorage.setItem<br/>'logos-state-28'"]
        State28 --> Save
    end
    
    subgraph Bridge["sessionStorage"]
        SS["logos-state-28<br/>JSON {sleep: 0.7, ...}"]
    end
    
    subgraph IFC["IFC Model"]
        Read["useState(() =><br/>sessionStorage.getItem<br/>'logos-state-28')"]
        Derive["φ(x): deriveIFCFromLogos<br/>28 dims → 12 vars"]
        StateIFC["Estado y ∈ [0,1]¹²<br/>cognitiveLoad, fatigue,<br/>motivation, anxiety, ..."]
        Preset["Λ LOGOS button<br/>Re-derive on demand"]
        Read --> Derive --> StateIFC
        Preset --> Read
    end
    
    Save --> SS --> Read
    
    style LOGOS fill:#8b5cf622,stroke:#8b5cf6
    style Bridge fill:#f59e0b22,stroke:#f59e0b
    style IFC fill:#14b8a622,stroke:#14b8a6
```

---

## 9. Diagrama de Interpretación AI (v3.3.0)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant T as TabAIGuide
    participant C as sessionStorage Cache
    participant B as Backend /api/protocol/interpret-panel
    participant AI as OpenAI GPT-4o

    U->>T: Expande panel AI en pestaña
    T->>C: Busca cache ai-guide-{panel}
    alt Cache existe
        C-->>T: Retorna resultado cacheado
        T-->>U: Muestra interpretación
    else Cache vacío
        T->>B: POST {panel, data, lang}
        B->>B: Selecciona prompt específico (22 opciones)
        B->>AI: system + user messages
        AI-->>B: JSON {explanation, howToUse, insight, action}
        B-->>T: Response con tokens count
        T->>C: Guarda en cache
        T-->>U: Muestra interpretación
    end
```

**22 paneles disponibles:**
- **LOGOS (13):** coherence, landscape, estado, motor, decision, guia, trayectoria, montecarlo, alimento, seguimiento, biometrics, teoria, ifc
- **IFC (9):** ifc-dashboard, ifc-state, ifc-controls, ifc-simulator, ifc-montecarlo, ifc-attractor, ifc-policy, ifc-metapolicy, ifc-theory

---

## Referencias Cruzadas

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Especificación Matemática](./MATHEMATICAL_SPEC.md)
- [Componentes React](./COMPONENTS.md)
- [API Reference](./API_REFERENCE.md)
