# DOCUMENTO MAESTRO LOGOS

## Sistema Operativo de Consciencia — Documentación Técnica Completa

> **Documento:** SRS-MASTER-001  
> **Estándares:** IEEE 830 / ISO/IEC/IEEE 26512 / ISO/IEC/IEEE 42010 / ISO/IEC/IEEE 29119  
> **Versión:** 5.2.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-11  
> **URL:** https://logoilab.com

---

## TABLA DE CONTENIDOS GENERAL

### PARTE I — ARQUITECTURA
1. [Visión General](#i1-visión-general)
2. [Stack Tecnológico](#i2-stack-tecnológico)
3. [Patrón Arquitectónico](#i3-patrón-arquitectónico)
4. [Diagrama de Arquitectura](#i4-diagrama-de-arquitectura)
5. [Estructura de Directorios](#i5-estructura-de-directorios)
6. [Diagrama de Componentes React](#i6-diagrama-de-componentes-react)
7. [Pipeline de Computación (7 Capas)](#i7-pipeline-de-computación-7-capas)
8. [Flujo de Datos Unidireccional](#i8-flujo-de-datos-unidireccional)
9. [Dependencias Externas](#i9-dependencias-externas)
10. [Infraestructura de Despliegue](#i10-infraestructura-de-despliegue)

### PARTE II — ESPECIFICACIÓN MATEMÁTICA
11. [Notación y Convenciones](#ii11-notación-y-convenciones)
12. [Espacio de Estados](#ii12-espacio-de-estados)
13. [Métrica Fundamental: Λ(x)](#ii13-métrica-fundamental-λx--logos-alignment)
14. [Métricas Derivadas](#ii14-métricas-derivadas)
15. [Capas Científicas](#ii15-capas-científicas)
16. [Política de Inhibición: π(x)](#ii16-política-de-inhibición-πx)
17. [Meta-Política: π²(x)](#ii17-meta-política-π²x)
18. [Atractores Duales](#ii18-atractores-duales)
19. [Modelo Estocástico Monte Carlo](#ii19-modelo-estocástico-monte-carlo)
20. [Intervalos de Confianza Wilson](#ii20-intervalos-de-confianza-wilson)
21. [Fundamentación Teórica](#ii21-fundamentación-teórica)

### PARTE III — REFERENCIA DE API
22. [Core Engine — Layer 7: Logos](#iii22-core-engine--layer-7-logos)
23. [Core Engine — Layer 1: Friston](#iii23-core-engine--layer-1-friston)
24. [Core Engine — Layer 2: Levin](#iii24-core-engine--layer-2-levin)
25. [Core Engine — Layer 3: Watson](#iii25-core-engine--layer-3-watson)
26. [Core Engine — Layer 4: Hoffman](#iii26-core-engine--layer-4-hoffman)
27. [Core Engine — Layer 5: Penrose](#iii27-core-engine--layer-5-penrose)
28. [Core Engine — Layer 6: Policy](#iii28-core-engine--layer-6-policy)
29. [Core Engine — Derived Metrics](#iii29-core-engine--derived-metrics)
30. [Simulation — Monte Carlo](#iii30-simulation--monte-carlo)
31. [Utils — Math](#iii31-utils--math)
32. [Hooks — React Bridge](#iii32-hooks--react-bridge)
33. [Services — API Client](#iii33-services--api-client)

### PARTE IV — COMPONENTES REACT
34. [App](#iv34-app)
35. [LogosHumano](#iv35-logoshumano)
36. [Card](#iv36-card)
37. [MetricCard](#iv37-metriccard)
38. [MetricDetailPanel](#iv38-metricdetailpanel)
39. [Slider](#iv39-slider)
40. [InfoTooltip](#iv40-infotooltip)
41. [MonteCarloAnimation](#iv41-montecarloanimation)
42. [TheoryManual](#iv42-theorymanual)
43. [SessionTracker](#iv43-sessiontracker)
44. [LogosVoiceAgent](#iv44-logosvoiceagent)
45. [IFCModel](#iv45-ifcmodel)

### PARTE V — MODELO DE DATOS
46. [Estructura del Estado](#v46-estructura-del-estado)
47. [Interfaces TypeScript](#v47-interfaces-typescript)
48. [Esquema de 28 Dimensiones × 7 Dominios](#v48-esquema-de-28-dimensiones--7-dominios)
49. [Constantes del Sistema](#v49-constantes-del-sistema)
50. [Estructura de Breakdown por Métrica](#v50-estructura-de-breakdown-por-métrica)
51. [Modelo de Base de Datos (PostgreSQL)](#v51-modelo-de-base-de-datos-postgresql)
52. [Almacenamiento en Cliente](#v52-almacenamiento-en-cliente)

### PARTE VI — DIAGRAMAS
53. [Diagrama de Flujo del Cálculo de Métricas](#vi53-diagrama-de-flujo-del-cálculo-de-métricas)
54. [Diagrama de Secuencia del Monte Carlo](#vi54-diagrama-de-secuencia-del-monte-carlo)
55. [Diagrama de Estados de π(x)](#vi55-diagrama-de-estados-de-πx)
56. [Diagrama de Clases/Componentes](#vi56-diagrama-de-clasescomponentes)
57. [Diagrama de Dependencias de Módulos](#vi57-diagrama-de-dependencias-de-módulos)
58. [Diagrama de Flujo de Autenticación](#vi58-diagrama-de-flujo-de-autenticación)
59. [Diagrama de Atractores Duales](#vi59-diagrama-de-atractores-duales)

### PARTE VII — DEPLOYMENT
60. [Requisitos del Sistema](#vii60-requisitos-del-sistema)
61. [Instalación Local](#vii61-instalación-local)
62. [Desarrollo Local](#vii62-desarrollo-local)
63. [Build para Producción](#vii63-build-para-producción)
64. [Deployment a Servidor M5](#vii64-deployment-a-servidor-m5)
65. [Configuración NGINX](#vii65-configuración-nginx)
66. [Backend API (Express + PostgreSQL)](#vii66-backend-api-express--postgresql)
67. [SSL / Certificados](#vii67-ssl--certificados)
68. [Opciones Alternativas de Hosting](#vii68-opciones-alternativas-de-hosting)
69. [Troubleshooting](#vii69-troubleshooting)

### PARTE VIII — MANUAL DE USUARIO
70. [Introducción](#viii70-introducción)
71. [Acceso al Sistema](#viii71-acceso-al-sistema)
72. [Pestaña: Estado](#viii72-pestaña-estado)
73. [Pestaña: Motor](#viii73-pestaña-motor)
74. [Pestaña: Decisiones](#viii74-pestaña-decisiones)
75. [Pestaña: Guía](#viii75-pestaña-guía)
76. [Pestaña: Trayectoria](#viii76-pestaña-trayectoria)
77. [Pestaña: Monte Carlo](#viii77-pestaña-monte-carlo)
78. [Pestaña: Teoría](#viii78-pestaña-teoría)
79. [Interpretación de Métricas](#viii79-interpretación-de-métricas)
80. [Los 7 Dominios y 28 Dimensiones](#viii80-los-7-dominios-y-28-dimensiones)
81. [Interpretación del Veredicto π](#viii81-interpretación-del-veredicto-π)
82. [Uso del Simulador Monte Carlo](#viii82-uso-del-simulador-monte-carlo)
83. [Paneles de Interpretación AI (v3.3.0)](#viii83-paneles-de-interpretación-ai-v330)
84. [Modelo IFC — Control Inhibitorio (v3.3.0)](#viii84-modelo-ifc--control-inhibitorio-v330)

### PARTE IX — TESTING
83. [Estrategia de Testing](#ix83-estrategia-de-testing)
84. [Tests Unitarios — Funciones Matemáticas](#ix84-tests-unitarios--funciones-matemáticas)
85. [Tests Unitarios — Core Engine](#ix85-tests-unitarios--core-engine)
86. [Tests de Integración](#ix86-tests-de-integración)
87. [Casos Límite (Edge Cases)](#ix87-casos-límite-edge-cases)
88. [Validación de Rangos [0,1]](#ix88-validación-de-rangos-01)
89. [Tests de Regresión Monte Carlo](#ix89-tests-de-regresión-monte-carlo)
90. [Tests de Componentes React](#ix90-tests-de-componentes-react)
91. [Matriz de Cobertura](#ix91-matriz-de-cobertura)

### PARTE X — NUEVAS CARACTERÍSTICAS v3.3.0
92. [Bridge IFC ↔ LOGOS](#x92-bridge-ifc--logos)
93. [Interpretación AI (TabAIGuide)](#x93-interpretación-ai-tabaiguide)
94. [Corrección Matriz de Coherencia Inter-Dominio](#x94-corrección-matriz-de-coherencia-inter-dominio)

### PARTE XI — INTEGRACIÓN BIOMÉTRICA WEARABLE (FASE FUTURA)
95. [Motivación](#xi95-motivación)
96. [Mapeo de Sensores Apple Watch → Dimensiones LOGOS](#xi96-mapeo-de-sensores-apple-watch--dimensiones-logos)
97. [Arquitectura de Fusión: Kalman Filter Layer](#xi97-arquitectura-de-fusión-kalman-filter-layer)
98. [Implementación Técnica](#xi98-implementación-técnica)
99. [Plan de Implementación](#xi99-plan-de-implementación)
100. [Impacto en el Modelo Matemático](#xi100-impacto-en-el-modelo-matemático)

### PARTE X — CHANGELOG
92. [Convenciones de Versionamiento](#x92-convenciones-de-versionamiento)
93. [Versiones](#x93-versiones)
94. [Roadmap](#x94-roadmap)

### PARTE XII — ESTRATEGIA DE IMPLEMENTACIÓN INTEGRAL
101. [Resumen Ejecutivo de la Auditoría](#xii101-resumen-ejecutivo-de-la-auditoría)
102. [Inventario Completo del Ecosistema](#xii102-inventario-completo-del-ecosistema)
103. [Análisis de Brechas (Gap Analysis)](#xii103-análisis-de-brechas-gap-analysis)
104. [Estrategia de Implementación por Fases](#xii104-estrategia-de-implementación-por-fases)
105. [TODO List Detallado](#xii105-todo-list-detallado)
106. [Matriz de Riesgos y Mitigación](#xii106-matriz-de-riesgos-y-mitigación)
107. [Criterios de Aceptación por Fase](#xii107-criterios-de-aceptación-por-fase)

---

---

# PARTE I — ARQUITECTURA DEL SISTEMA

---

## I.1 Visión General

LOGOS es un **Sistema Operativo de Consciencia** que modela matemáticamente el estado integral de un ser humano a través de **28 dimensiones** agrupadas en **7 dominios de vida** (incluyendo el dominio *Alimento Sagrado*), procesadas por un motor de cómputo de **7 capas** fundamentado en 5 marcos científicos de clase mundial, con fundamentación adicional en Teología Informacional (el pipeline LOGOS como sistema de comunicación de Shannon) y la hipótesis de Entropía Alimentaria Inversa.

El sistema implementa un modelo de atractores duales:
- **A⁺** (Atractor Positivo): Convergencia hacia el Logos — alineación, coherencia, viabilidad.
- **A⁻** (Atractor Negativo): Espiral entrópica — desconexión, caos, colapso.

---

## I.2 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|----------|
| **Runtime** | Node.js | 18+ | Entorno de ejecución |
| **Build** | Vite | 5.4.x | Bundler y dev server |
| **UI Framework** | React | 18.3.x | Interfaz de usuario reactiva |
| **Lenguaje** | TypeScript / JSX | 5.3.x | Tipado estático (core) + JSX (UI) |
| **Routing** | React Router DOM | 7.13.x | Navegación SPA |
| **Visualización** | Recharts | 2.12.x | Gráficas y charts |
| **Auth** | Supabase Auth | 2.x | Google + Apple OAuth, JWT sessions |
| **BaaS** | Supabase | — | Auth, PostgreSQL, RLS, Realtime |
| **Voz (Web)** | ElevenLabs React | 0.14.x | Agente conversacional de voz |
| **AI Agent** | OpenAI Agents SDK | 0.x | Agente ΛOGOS con 12 tools (WhatsApp/Voice) |
| **Messaging** | Twilio | — | WhatsApp, SMS, Voice (PSTN) |
| **Servidor** | NGINX | 1.28.x | Servidor de archivos estáticos + SSL |
| **SSL** | Let's Encrypt | — | Certificados TLS |
| **Backend** | Express.js + WebSocket | — | Multi-channel bridge (port 3100) |
| **Base de Datos** | Supabase PostgreSQL | 15+ | Profiles, sessions, conversations |

---

## I.3 Patrón Arquitectónico

El sistema utiliza un patrón **Unidirectional Data Flow** con separación en capas:

```
┌─────────────────────────────────────────────────────┐
│                    PRESENTATION                      │
│   React Components (LogosHumano, Cards, Charts)      │
├─────────────────────────────────────────────────────┤
│                    ORCHESTRATION                     │
│   Custom Hooks (useLogosEngine, useConsciousnessState)│
├─────────────────────────────────────────────────────┤
│                    COMPUTATION                       │
│   Pure Functions (core/logos, core/friston, etc.)     │
├─────────────────────────────────────────────────────┤
│                    DOMAIN                            │
│   Constants, Types, State Definitions                │
├─────────────────────────────────────────────────────┤
│                    SIMULATION                        │
│   Monte Carlo Engine (10,000 trayectorias)           │
├─────────────────────────────────────────────────────┤
│                    SERVICES                          │
│   API Client (auth, sessions, reports)               │
└─────────────────────────────────────────────────────┘
```

**Características clave:**
- **Funciones puras** en el core — sin side effects, testables unitariamente.
- **Hooks como bridge** — conectan el core puro con el ciclo de vida de React.
- **Memoización agresiva** — `useMemo` recalcula solo cuando cambia el estado.
- **Barrel exports** — cada módulo expone una API limpia vía `index.ts`.

---

## I.4 Diagrama de Arquitectura

```mermaid
graph TB
    subgraph Cliente["🖥️ Cliente (Browser)"]
        direction TB
        App["App.jsx<br/>Supabase Auth + Phone + Routing"]
        LH["LogosHumano.jsx<br/>Dashboard Principal"]
        Hook["useLogosEngine<br/>Orquestador"]
        SB["supabase.js<br/>Supabase Client SDK"]
        
        subgraph Core["⚙️ Core Engine (7 Capas)"]
            L7["L7: Logos<br/>Λ(x) — Atractor Fundamental"]
            L1["L1: Friston<br/>F(x) — Energía Libre"]
            L2["L2: Levin<br/>Señales Bioeléctricas"]
            L3["L3: Watson<br/>Paisaje Energético"]
            L4["L4: Hoffman<br/>Sesgos de Interfaz"]
            L5["L5: Penrose<br/>Coherencia Cuántica"]
            L6["L6: Policy<br/>π(x) — Inhibición"]
            Der["Derived<br/>V, S, Ω, Q, R"]
        end
        
        MC["Monte Carlo<br/>N=10,000"]
        
        App --> LH
        App --> SB
        LH --> Hook
        LH -->|"save/load state"| SB
        Hook --> L7
        L7 --> L1 & L2 & L3 & L4 & L5 & Der
        Der --> L6
        LH --> MC
    end
    
    subgraph Supabase["☁️ Supabase (Cloud)"]
        Auth["Supabase Auth<br/>Google + Apple OAuth"]
        PG["PostgreSQL<br/>profiles, channel_users,<br/>sessions, conversations"]
        RLS["Row Level Security"]
    end
    
    subgraph M5["🖧 Servidor M5 (AWS EC2)"]
        NGINX["NGINX :443<br/>SSL + Static Files"]
        Static["/opt/logoilab/frontend/dist/"]
        Backend["logos-backend :3100<br/>Express + WebSocket"]
        
        subgraph Agent["🤖 ΛOGOS Agent"]
            OAI["OpenAI Agents SDK<br/>12 Tools"]
            EL["ElevenLabs<br/>Voice AI"]
            TW["Twilio<br/>WhatsApp/SMS/Voice"]
        end
    end
    
    SB -->|"Auth + DB"| Supabase
    Cliente -->|"HTTPS"| NGINX
    NGINX -->|"try_files"| Static
    NGINX -->|"/webhook/*"| Backend
    NGINX -->|"/media-stream"| Backend
    Backend --> PG
    Backend --> OAI & EL & TW
```

---

## I.5 Estructura de Directorios

```
src/
├── core/                    # Motor de cómputo puro (9 capas)
│   ├── index.ts             # Barrel export
│   ├── logos.ts             # L7: Λ(x) = Λ_señal × Φ_canal (Shannon)
│   ├── friston.ts           # L1: F(x) — Energía Libre
│   ├── levin.ts             # L2: Señales Bioeléctricas (9 señales)
│   ├── watson.ts            # L3: Paisaje Energético
│   ├── hoffman.ts           # L4: Sesgos de Interfaz (8 sesgos)
│   ├── penrose.ts           # L5: Coherencia Cuántica (7 dominios)
│   ├── policy.ts            # L6: π(x) — Política de Inhibición
│   ├── derived.ts           # Métricas derivadas: V, S, Ω, Q
│   ├── positive-geometry.ts # L10: Geometría Positiva — GCI, Ω, ρ, P⁺_Λ (v5.1)
│   └── resonance.ts         # R(x) — Resonancia Nutricional (SINTONÍA × LOGOS)
├── simulation/              # Motor estocástico
│   ├── index.ts             # Barrel export
│   └── montecarlo.ts        # Monte Carlo (N=100,000, Heun, Wilson CI)
├── domain/                  # Constantes y configuración
│   ├── index.ts             # Barrel export
│   └── constants.ts         # DOMAINS, COLORS, FONTS, thresholds
├── types/                   # Definiciones TypeScript
│   └── index.ts             # Todas las interfaces y tipos
├── hooks/                   # React hooks
│   ├── index.ts             # Barrel export
│   ├── useLogosEngine.ts    # Bridge core ↔ React
│   ├── useIsMobile.js       # Detección de breakpoint móvil (768px) (v5.2)
│   ├── useCustomWeights.ts  # Pesos manuales (localStorage)
│   └── useBayesianWeights.ts # CBWA — Pesos adaptativos bayesianos
├── utils/                   # Utilidades matemáticas
│   ├── index.ts             # Barrel export
│   └── math.ts              # clamp, percentile, wilsonCI, harmonicMean, etc.
├── components/              # Componentes React
│   ├── LogosHumano.jsx      # Dashboard principal (~4100 líneas)
│   ├── PositiveGeometryCard.jsx  # Panel de Geometría Positiva (v5.1)
│   ├── PolytopeVisualization.jsx # Politopo 3D SVG interactivo (v5.2)
│   ├── EmergenceGateDashboard.jsx # 5 Puertas de Criticalidad (canvas)
│   ├── EmergenceSwarmAnimation.jsx # Animación Langevin 28 partículas
│   ├── EmergenceInterpretation.jsx # Interpretación AI de emergencia
│   ├── EmergenceVisualizations.jsx # CoherenceMatrix, SNR, Multi-Scale Λ
│   ├── EnergyLandscapeMap.jsx # Paisaje Energético 2D (canvas)
│   ├── EmergenceReporter.jsx # Reportador de eventos emergentes
│   ├── TabAIGuide.jsx       # Guía AI por pestaña
│   ├── TheoryManual.jsx     # Manual teórico interactivo
│   ├── SessionTracker.jsx   # Tracking de sesiones
│   ├── LogosVoiceAgent.jsx  # Agente de voz ElevenLabs
│   └── IFCModel.jsx         # Modelo IFC
├── i18n/                    # Internacionalización
│   ├── index.js             # Config i18next (auto-detect, fallback ES)
│   └── locales/
│       ├── es.json          # Traducciones español (completo)
│       └── en.json          # Traducciones inglés (completo)
├── styles/                  # Estilos globales
│   └── responsive.css       # Media queries móvil (.logos-app wrapper) (v5.2)
├── services/                # Clientes API
│   ├── supabase.js          # Supabase client (auth, DB queries)
│   └── api.js               # API wrapper (uses Supabase)
├── config/                  # Configuración
│   └── logosAgent.js        # Config del agente de voz
├── App.jsx                  # Componente raíz (Supabase Auth + phone + routing)
├── App.css                  # Estilos de login y layout
├── index.css                # Estilos globales
└── main.jsx                 # Entry point (importa responsive.css)
```

---

## I.6 Diagrama de Componentes React

```mermaid
graph TD
    Main["main.jsx<br/>ReactDOM.createRoot"]
    App["App.jsx<br/>Auth Gate + Router"]
    
    subgraph Auth["Flujo de Autenticación"]
        Login["Login Page<br/>Google + Apple + Guest"]
        Phone["Phone Collection<br/>Obligatorio post-OAuth"]
        WA["WhatsApp Opt-In<br/>wa.me link"]
    end
    
    subgraph Dashboard["Dashboard Autenticado"]
        LH["LogosHumano<br/>Dashboard Principal"]
        IFC["IFCModel<br/>Modelo IFC"]
    end
    
    subgraph SubComponents["Sub-componentes"]
        Card["Card<br/>Contenedor visual"]
        MC["MetricCard<br/>Métrica expandible"]
        MDP["MetricDetailPanel<br/>Detalle completo"]
        Slider["Slider<br/>Input 28 dimensiones"]
        IT["InfoTooltip<br/>Tooltips informativos"]
        MCA["MonteCarloAnimation<br/>Animación partículas"]
        TM["TheoryManual<br/>Manual teórico"]
        VA["LogosVoiceAgent<br/>Agente de voz"]
        ST["SessionTracker<br/>Tracking sesiones"]
    end
    
    Main --> App
    App -->|"user === null"| Login
    Login -->|"OAuth success"| Phone
    Phone -->|"phone saved"| WA
    WA -->|"continue"| LH
    App -->|"user + phone"| LH
    App -->|"/ifc"| IFC
    LH --> Card & MC & MDP & Slider & IT & MCA & TM & VA & ST
```

---

## I.7 Pipeline de Computación (7 Capas)

El motor de cómputo procesa las 28 dimensiones en un pipeline secuencial donde **Λ se computa primero** y todas las demás métricas derivan de él:

```mermaid
flowchart LR
    State["Estado x<br/>28 dimensiones"] --> L7
    
    L7["L7: Logos<br/>Λ(x)"] --> L1["L1: Friston<br/>F(x|Λ)"]
    L7 --> L2["L2: Levin<br/>Señales(x,Λ)"]
    L7 --> L3["L3: Watson<br/>E(x|Λ)"]
    L7 --> L4["L4: Hoffman<br/>Sesgos(x,Λ)"]
    L7 --> L5["L5: Penrose<br/>C(x|Λ)"]
    L7 --> DV["V(x|Λ)"]
    L7 --> DS["S(x|Λ)"]
    
    DV & DS & L5 & L1 --> DO["Ω(Λ,V,S,C,F)"]
    DV & DS --> DQ["Q(Λ,V,S)"]
    DV & DS & L5 & L2 --> L6["L6: π(x)<br/>Política"]
    
    style L7 fill:#c084fc,color:#000
    style L6 fill:#6366f1,color:#fff
    style DO fill:#fbbf24,color:#000
```

**Orden de ejecución:**
1. **Λ(x)** — Logos Alignment (Layer 7, computado PRIMERO)
2. **F(x|Λ)** — Free Energy (Layer 1)
3. **Señales(x,Λ)** — Levin Signals (Layer 2)
4. **E(x|Λ)** — Watson Energy (Layer 3)
5. **Sesgos(x,Λ)** — Hoffman Biases (Layer 4)
6. **C(x|Λ)** — Penrose Coherence (Layer 5)
7. **V(x|Λ), S(x|Λ)** — Viability, Entropy (Derived)
8. **Ω(Λ,V,S,C,F)** — Omega (Derived)
9. **Q(Λ,V,S)** — Trajectory Quality (Derived)
10. **π(x)** — Inhibition Policy (Layer 6)
11. **π²(x)** — Meta-Policy (Layer 6)

---

## I.8 Flujo de Datos Unidireccional

```mermaid
sequenceDiagram
    participant U as Usuario
    participant S as Slider (UI)
    participant St as useState (State)
    participant H as useLogosEngine
    participant C as Core Engine
    participant R as React Render

    U->>S: Ajusta dimensión (ej: sleep = 0.7)
    S->>St: updateDimension('sleep', 0.7)
    St->>H: state cambia → useMemo recalcula
    H->>C: computeLogosAlignment(state)
    C-->>H: Λ = 0.523
    H->>C: computeViability(state, Λ)
    H->>C: computeEntropy(state, Λ)
    H->>C: computeCoherence(state, Λ)
    H->>C: computeOmega(Λ, V, S, C, F)
    H->>C: inhibitionPolicy(Λ, V, S, C)
    C-->>H: EngineResult completo
    H-->>R: Re-render con nuevos valores
    R-->>U: Dashboard actualizado
```

---

## I.9 Dependencias Externas

| Paquete | Versión | Uso | Justificación |
|---------|---------|-----|---------------|
| `react` | ^18.3.1 | Framework UI | Componentes reactivos, hooks, virtual DOM |
| `react-dom` | ^18.3.1 | Renderizado DOM | Montaje en `#root` |
| `react-router-dom` | ^7.13.0 | Routing SPA | Navegación `/`, `/logos`, `/ifc` |
| `recharts` | ^2.12.7 | Visualización | RadarChart, LineChart, AreaChart, BarChart, ScatterChart |
| `@elevenlabs/react` | ^0.14.0 | Agente de voz | Widget conversacional embebido |
| `vite` | ^5.4.0 | Build tool | HMR, tree-shaking, code splitting |
| `typescript` | ^5.3.3 | Tipado | Interfaces, tipos, seguridad en compilación |
| `@vitejs/plugin-react` | ^4.3.1 | Plugin Vite | JSX transform, Fast Refresh |

---

## I.10 Infraestructura de Despliegue

```mermaid
graph LR
    subgraph Local["💻 Desarrollo Local"]
        Vite["Vite Dev Server<br/>:5173"]
        Build["npm run build<br/>→ dist/"]
    end
    
    subgraph M5["🖧 Servidor M5 (AWS EC2)"]
        NGINX["NGINX :443<br/>SSL + Static + Proxy"]
        Static["/opt/logoilab/frontend/dist/"]
        Backend["logos-backend :3100<br/>Express + WebSocket"]
    end
    
    subgraph Cloud["☁️ Cloud Services"]
        SB["Supabase PostgreSQL<br/>profiles, sessions, etc."]
        OAI["OpenAI Agents SDK<br/>gpt-4o"]
        EL["ElevenLabs<br/>Voice AI"]
        TW["Twilio<br/>WhatsApp/SMS"]
    end
    
    Build -->|"rsync"| Static
    NGINX -->|"try_files"| Static
    NGINX -->|"proxy /webhook/"| Backend
    NGINX -->|"proxy /media-stream"| Backend
    Backend --> SB & OAI & EL & TW
    
    User["🌐 Usuario"] -->|"https://logoilab.com"| NGINX
    WA["📱 WhatsApp"] -->|"Twilio webhook"| NGINX
    Voice["📞 Llamada"] -->|"Twilio voice"| NGINX
```

**Flujo de deploy (Frontend):**
```bash
# 1. Build local
cd /Users/manuelcadena/CascadeProjects/logos && npm run build

# 2. Upload a M5
rsync -avz --delete dist/ m5:/opt/logoilab/frontend/dist/

# 3. NGINX sirve inmediatamente (no requiere restart)
```

**Flujo de deploy (Backend):**
```bash
# 1. Upload código
rsync -avz --exclude='node_modules' --exclude='.env' --exclude='logs' \
  /Users/manuelcadena/CascadeProjects/logos-backend/ m5:/opt/logoilab/logos-backend/

# 2. Reiniciar servicio
ssh m5 "sudo systemctl restart logos-backend"
```

---

---

# PARTE II — ESPECIFICACIÓN MATEMÁTICA

---

## II.11 Notación y Convenciones

| Símbolo | Significado | Rango |
|---------|-------------|-------|
| $x$ | Vector de estado de consciencia | $x \in [0,1]^{28}$ |
| $x_i$ | Dimensión $i$ del estado | $x_i \in [0,1]$ |
| $\Lambda(x)$ | Alineación con el Logos | $[0,1]$ |
| $V(x)$ | Viabilidad funcional | $[0,1]$ |
| $S(x)$ | Entropía (desorden) | $[0,1]$ |
| $C(x)$ | Coherencia (Penrose) | $[0,1]$ |
| $F(x)$ | Energía Libre (Friston) | $[0, 1.5]$ |
| $\Omega(x)$ | Índice de Consciencia | $[0,1]$ |
| $Q(x)$ | Calidad de Trayectoria | $\mathbb{R}$ |
| $\pi(x)$ | Política de inhibición | Categórica |
| $\pi^2(x)$ | Meta-política | Categórica |
| $\dot{\Lambda}$ | Derivada temporal de Λ | $\mathbb{R}$ |
| $A^+$ | Atractor positivo | Punto fijo |
| $A^-$ | Atractor negativo | Punto fijo |
| $w_i$ | Peso de dimensión $i$ | $w_i > 0, \sum w_i = 1$ |

**Función clamp:**

$$\text{clamp}(v, a, b) = \max(a, \min(b, v))$$

Todos los valores de métricas se restringen a $[0,1]$ salvo indicación contraria.

---

## II.12 Espacio de Estados

El estado de consciencia se define como un vector $x \in [0,1]^{28}$ organizado en 7 dominios de 4 dimensiones cada uno:

### Dominios y Dimensiones

| Dominio | Clave | Dimensiones |
|---------|-------|-------------|
| **Cuerpo** (Physical) | `physical` | `sleep`, `breath`, `exercise`, `energy` |
| **Emociones** (Emotional) | `emotional` | `peace`, `gratitude`, `love`, `joy` |
| **Mente** (Mental) | `mental` | `clarity`, `focus`, `creativity`, `wisdom` |
| **Espíritu** (Spiritual) | `spiritual` | `faith`, `meditation`, `service`, `presence` |
| **Relaciones** (Relational) | `relational` | `family`, `friendship`, `community`, `compassion` |
| **Propósito** (Purpose) | `purpose` | `meaning`, `mission`, `contribution`, `legacy` |
| **Alimento** (Sacred Nourishment) | `alimento` | `nourishment`, `taste_presence`, `food_harmony`, `gut_resonance` |

> **Cambio v2.x → v3.0:** `nutrition` del dominio Physical fue elevado al nuevo dominio Alimento como `nourishment`. Su lugar fue reemplazado por `breath` (respiración consciente). Se añade el 7º dominio completo *Alimento Sagrado* con 4 dimensiones. Ver RFC-LOGOS-003.

### Estado por Defecto

$$x_0 = (0.5, 0.5, \ldots, 0.5) \in [0,1]^{28}$$

### Promedio de Dominio

Para un dominio $D$ con dimensiones $\{d_1, d_2, d_3, d_4\}$:

$$\bar{D}(x) = \frac{1}{4}\sum_{i=1}^{4} x_{d_i}$$

---

## II.13 Métrica Fundamental: Λ(x) — Logos Alignment (Hierarchical Lambda)

**Λ es el ATRACTOR FUNDAMENTAL.** Todas las demás métricas se derivan de Λ. Las **28 dimensiones** contribuyen a Λ.

### Definición — Lambda Jerárquico (Shannon-consistente)

$$\Lambda(x) = \text{clamp}\left(\Lambda_{\text{señal}}(x) \times \Phi_{\text{canal}}(x)\right)$$

donde:
- $\Lambda_{\text{señal}}(x) = \text{clamp}\left(\sum_{i \in \mathcal{I}} w_i \cdot x_i\right)$ — contenido de la señal espiritual (12 dims, $\sum w_i = 1.00$)
- $\Phi_{\text{canal}}(x) = 1 - \gamma \cdot (1 - \bar{x}_{\text{soporte}})$ — calidad del canal de recepción (16 dims)
- $\gamma = 0.25$ — coeficiente de atenuación del canal, $\Phi \in [0.75, 1.0]$

**Base matemática:** Modelo de comunicación de Shannon (1948). La fidelidad de la señal depende TANTO del contenido (12 dims espirituales) COMO de la calidad del canal (16 dims de soporte). El producto $\Lambda_{\text{señal}} \cdot \Phi_{\text{canal}}$ restaura el Corolario 1.1: $\partial\Lambda/\partial x_i > 0$ para TODAS las 28 dimensiones.

### Componentes de Λ_señal (12 dimensiones)

Λ_señal se descompone en 5 grupos funcionales:

#### Grupo 1: Recepción del Canal (43%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `faith` | 0.17 | Apertura del canal |
| `meditation` | 0.13 | Sintonización de frecuencia |
| `presence` | 0.13 | Eliminación de ruido temporal |

#### Grupo 2: Verificación por Acción (29%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `service` | 0.11 | Señal convertida en acción |
| `love` | 0.10 | La frecuencia más pura |
| `compassion` | 0.08 | Empatía activa |

#### Grupo 3: Capacidad de Decodificación (18%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `wisdom` | 0.08 | Discernimiento profundo |
| `meaning` | 0.06 | Significado percibido |
| `clarity` | 0.04 | Nitidez de interpretación |

#### Grupo 4: Alimento Sagrado (8%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `taste_presence` | 0.05 | Consciencia plena al comer |
| `food_harmony` | 0.03 | Balance nutricional consciente |

#### Grupo 5: Reconocimiento de la Fuente (2%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `gratitude` | 0.02 | Acknowledgment de la fuente |

**Verificación:** $\sum w_i = 0.17 + 0.13 + 0.13 + 0.11 + 0.10 + 0.08 + 0.08 + 0.06 + 0.04 + 0.05 + 0.03 + 0.02 = 1.00$ ✓

### Componentes de Φ_canal (16 dimensiones)

4 grupos de soporte ($\sum \alpha = 1.00$):

| Grupo | Peso $\alpha$ | Dimensiones |
|-------|-------------|-------------|
| Somático | 0.30 | `sleep`, `nutrition`, `exercise`, `energy` |
| Emocional | 0.30 | `peace`, `joy` |
| Cognitivo | 0.15 | `focus`, `creativity` |
| Encarnación | 0.25 | `family`, `friendship`, `community`, `mission`, `contribution`, `legacy`, `nourishment`, `gut_resonance` |

**Valores de referencia (estado neutral, todos en 0.5):** $\Lambda_{\text{señal}} = 0.5$, $\Phi = 0.875$, $\Lambda = 0.4375$

**Primacía espiritual preservada:** Fe pesa 17× más que Sueño (ratio faith:sleep ≈ 17:1). El canal atenúa pero nunca destruye la señal ($\Phi \geq 0.75$).

**Backward compatible:** $\gamma = 0$ reproduce el $\Lambda$ original exactamente.

> **Peso efectivo del dominio Alimento en Λ:** Directo en señal = 8% (taste_presence 0.05 + food_harmony 0.03). En canal: nourishment y gut_resonance contribuyen vía grupo Encarnación (α=0.25). Efectivo en E(x) incluyendo vías indirectas (vagal, bioquímica, HI, R(x), Monte Carlo) ≈ **20–23%**. Ver Paper §8.6.

### Interpretación de Λ

| Rango | Nivel | Descripción |
|-------|-------|-------------|
| $\Lambda \geq 0.75$ | ALINEADO | Canal abierto. La señal del Logos fluye claramente. |
| $0.50 \leq \Lambda < 0.75$ | CONECTANDO | Sintonizando frecuencia. Señal perceptible con ruido. |
| $0.30 \leq \Lambda < 0.50$ | BUSCANDO | Canal parcialmente obstruido. Señal débil. |
| $\Lambda < 0.30$ | DESCONECTADO | Canal cerrado. La señal no se recibe. |

---

## II.14 Métricas Derivadas

### Viabilidad: V(x|Λ)

Mide la capacidad funcional del sistema para operar en el mundo.

$$V_{\text{raw}}(x) = \frac{\sum_{i=1}^{28} w_i^V \cdot x_i}{0.55} \cdot 0.55 + 0.15$$

$$V(x|\Lambda) = \text{clamp}\left(V_{\text{raw}} \cdot (0.75 + \Lambda \cdot 0.35)\right)$$

**Efecto de Λ:** Mayor alineación → mayor viabilidad. El boost máximo es $+35\%$.

**Pesos $w_i^V$ (28 dimensiones, v3.0):**

| Dimensión | Peso | Dimensión | Peso | Dimensión | Peso |
|-----------|------|-----------|------|-----------|------|
| sleep | 0.07 | peace | 0.06 | clarity | 0.05 |
| breath | 0.04 | gratitude | 0.04 | focus | 0.04 |
| exercise | 0.05 | love | 0.05 | creativity | 0.03 |
| energy | 0.05 | joy | 0.04 | wisdom | 0.04 |
| faith | 0.04 | family | 0.04 | meaning | 0.03 |
| meditation | 0.03 | friendship | 0.03 | mission | 0.03 |
| service | 0.03 | community | 0.02 | contribution | 0.02 |
| presence | 0.04 | compassion | 0.03 | legacy | 0.02 |
| nourishment | 0.05 | taste_presence | 0.02 | food_harmony | 0.02 |
| gut_resonance | 0.04 | | | **Σ** | **1.00** |

### Entropía: S(x|Λ)

Mide el desorden e interferencia interna del sistema.

$$S_{\text{raw}}(x) = \sum_{j \in \mathcal{E}} w_j^S \cdot (1 - x_j)$$

$$S(x|\Lambda) = \text{clamp}\left(S_{\text{raw}} \cdot (1.2 - \Lambda \cdot 0.4)\right)$$

**Efecto de Λ:** Mayor alineación → menor entropía. El Logos crea orden del caos.

**Factores de entropía $w_j^S$ (v3.0 — 12 factores):**

| Factor | Peso | Factor | Peso |
|--------|------|--------|------|
| Falta de Paz (`peace`) | 0.13 | Falta de Presencia (`presence`) | 0.09 |
| Falta de Claridad (`clarity`) | 0.10 | Falta de Sabiduría (`wisdom`) | 0.07 |
| Falta de Sueño (`sleep`) | 0.10 | Falta de Fe (`faith`) | 0.07 |
| Falta de Enfoque (`focus`) | 0.09 | Falta de Sentido (`meaning`) | 0.07 |
| Falta de Energía (`energy`) | 0.09 | Falta de Gratitud (`gratitude`) | 0.06 |
| **Disbiosis Intestinal** (`gut_resonance`) | **0.07** | **Falta de Nutrición Consciente** (`nourishment`) | **0.06** |

> **v3.0:** Se añaden `gut_resonance` y `nourishment` como factores entrópicos. La disbiosis intestinal es fuente MAYOR de entropía sistémica (inflamación crónica, disrupción serotoninergética, niebla mental). Ver Paper §8.7: Entropía Alimentaria Inversa.

### Índice de Consciencia: Ω(Λ, V, S, C, F)

$$\text{derivedHealth} = \text{clamp}\left(V \cdot 0.3 + C \cdot 0.25 - S \cdot 0.25 - \min(F, 1) \cdot 0.2 + 0.2\right)$$

$$\Omega = \text{clamp}\left(\Lambda \cdot 0.6 + \text{derivedHealth} \cdot 0.4\right)$$

**Interpretación:** Ω ≈ Λ cuando las métricas derivadas son saludables. Ω < Λ cuando hay patología.

| Componente | Peso en Ω | Dirección |
|-----------|-----------|-----------|
| Λ (Logos) | 60% | Positivo (+) |
| V (Viabilidad) | 12% (0.3 × 0.4) | Positivo (+) |
| C (Coherencia) | 10% (0.25 × 0.4) | Positivo (+) |
| S (Entropía) | 10% (0.25 × 0.4) | Negativo (−) |
| F (Energía Libre) | 8% (0.2 × 0.4) | Negativo (−) |

### Calidad de Trayectoria: Q(Λ, V, S)

Mide la velocidad de convergencia al atractor positivo $A^+$.

$$\Delta V = \max(0, V^* - V)$$
$$\Delta S = \max(0, S - S^*)$$
$$\Delta \Lambda = \max(0, \Lambda^* - \Lambda)$$
$$D = \sqrt{\Delta V^2 + \Delta S^2 + \Delta \Lambda^2}$$
$$Q = \Lambda \cdot 0.4 + V \cdot 0.2 - S \cdot 0.2 - D \cdot 0.3$$

**Umbrales del atractor $A^+$:**

| Parámetro | Símbolo | Valor |
|-----------|---------|-------|
| Viabilidad objetivo | $V^*$ | 0.70 |
| Entropía objetivo | $S^*$ | 0.30 |
| Logos objetivo | $\Lambda^*$ | 0.60 |

---

## II.15 Capas Científicas

### Capa 1: Friston — Energía Libre F(x|Λ)

Basada en el **Principio de Energía Libre** de Karl Friston.

$$F_{\text{raw}}(x) = \sum_{k=1}^{28} w_k \cdot \frac{(x_k - x_k^*)^2}{2\sigma^2}$$

donde $x_k^*$ son los estados ideales (Logos-óptimos) y $\sigma^2 = 0.04$.

$$F(x|\Lambda) = \text{clamp}\left(F_{\text{raw}} \cdot (1 - \Lambda \cdot 0.3), 0, 1.5\right)$$

**Efecto de Λ:** Mayor alineación → menor energía libre. El Logos reduce la sorpresa.

**Estados ideales $x_k^*$ (selección, v3.0):**

| Dimensión | Ideal | Dimensión | Ideal | Dimensión | Ideal |
|-----------|-------|-----------|-------|-----------|-------|
| sleep | 0.85 | faith | 0.70 | meaning | 0.75 |
| breath | 0.75 | meditation | 0.65 | mission | 0.70 |
| exercise | 0.75 | service | 0.60 | contribution | 0.65 |
| energy | 0.80 | presence | 0.70 | legacy | 0.55 |
| peace | 0.75 | family | 0.75 | **nourishment** | **0.80** |
| gratitude | 0.80 | friendship | 0.65 | **taste_presence** | **0.65** |
| clarity | 0.75 | community | 0.55 | **food_harmony** | **0.60** |
| wisdom | 0.70 | compassion | 0.70 | **gut_resonance** | **0.75** |

### Capa 2: Levin — Señales Bioeléctricas

Basada en la investigación de **Michael Levin** sobre patrones bioeléctricos.

Detecta patrones patológicos tempranos:

| Patrón | Condición | Severidad |
|--------|-----------|-----------|
| SEÑAL DEPRESIVA | `joy < 0.30 ∧ energy < 0.35 ∧ meaning < 0.30` | 0.85 |
| SEÑAL DE ANSIEDAD | `peace < 0.30 ∧ clarity < 0.35 ∧ focus < 0.35` | 0.80 |
| DESCONEXIÓN ESPIRITUAL | `faith < 0.25 ∧ presence < 0.30 ∧ meditation < 0.20` | 0.70 |
| AISLAMIENTO RELACIONAL | `family < 0.30 ∧ friendship < 0.30 ∧ community < 0.25` | 0.75 |
| SOBRE-RENDIMIENTO | `energy < 0.25 ∧ sleep < 0.30 ∧ exercise < 0.20 ∧ focus > 0.60` | 0.80 |
| ⚠ ATRACTOR NEGATIVO A⁻ | `Λ < 0.20 ∧ peace < 0.25 ∧ meaning < 0.25` | 0.95 |
| **DISBIOSIS ENTÉRICA** 🌿 | `gut_resonance < 0.25 ∧ nourishment < 0.30 ∧ energy < 0.35` | **0.70** |
| **ADAPTACIÓN HEDÓNICA ALIMENTARIA** 🎡 | `taste_presence < 0.30 ∧ nourishment < 0.35 ∧ joy > 0.65` | **0.60** |
| **INTOXICACIÓN ENTRÓPICA** ☠ | `gut_resonance < 0.20 ∧ energy < 0.30 ∧ peace < 0.25 ∧ sleep < 0.30` | **0.90** |

> **v3.0:** Se añaden 3 señales del dominio Alimento. La Intoxicación Entrópica (severidad 0.90) detecta colapso multisistémico por ingesta tóxica sostenida. Ver Paper §8.7.

### Capa 3: Watson — Paisaje Energético

Basada en el trabajo de **James Watson** sobre optimización energética.

$$\bar{D}_k(x) = \frac{1}{4}\sum_{i \in D_k} x_i \quad \text{(promedio de dominio)}$$

$$D_k^*(x|\Lambda) = D_{k,\text{base}} + \Lambda \cdot \alpha_k \quad \text{(óptimo modulado por Λ)}$$

$$E(x|\Lambda) = \sqrt{\sum_{k=1}^{7} \left(\bar{D}_k - D_k^*\right)^2}$$

**Óptimos base y coeficientes Λ (v3.0 — 7 dominios):**

| Dominio | Base | Coef. Λ ($\alpha_k$) |
|---------|------|---------------------|
| Physical | 0.70 | 0.15 |
| Emotional | 0.65 | 0.15 |
| Mental | 0.65 | 0.15 |
| Spiritual | 0.60 | 0.20 |
| Relational | 0.60 | 0.15 |
| Purpose | 0.60 | 0.20 |
| **Alimento** | **0.65** | **0.15** |

### Capa 4: Hoffman — Teoría de Interfaz

Basada en la **Interface Theory of Perception** de Donald Hoffman.

Detecta sesgos perceptuales donde la interfaz muestra "íconos de fitness" en lugar de verdad:

| Sesgo | Condición | Corrección |
|-------|-----------|------------|
| SOBRECONFIANZA | `wisdom < 0.40 ∧ clarity > 0.60` | Buscar feedback externo |
| RUEDA HEDÓNICA | `joy > 0.70 ∧ gratitude < 0.35` | Gratitud activa 3x/día |
| FUTURO SIN PRESENTE | `mission > 0.60 ∧ presence < 0.30` | 5 min atención al cuerpo |
| FATIGA EMPÁTICA | `compassion > 0.70 ∧ peace < 0.30` | Compasión con límites |
| ILUMINACIÓN PREMATURA | `Λ > 0.60 ∧ wisdom < 0.30` | Humildad radical |
| **HEDONISMO GUSTATIVO** 🍬 | `joy > 0.60 ∧ taste_presence < 0.25 ∧ nourishment < 0.35` | Una comida consciente con alimento fresco |
| **ASCETISMO DESCONECTADO** ⛓ | `faith > 0.70 ∧ nourishment < 0.20 ∧ energy < 0.25` | Nutrir el templo físico es acto sagrado |
| **NIHILISMO SOMÁTICO** 🖤 | `nourishment < 0.25 ∧ gut_resonance < 0.25 ∧ meaning > 0.50` | El Logos habita la materia — cuida el receptor |

> **v3.0:** Se añaden 3 sesgos del dominio Alimento. El Nihilismo Somático detecta búsqueda intelectual de sentido mientras se destruye el substrato físico. Ver Paper §8.7.

### Capa 5: Penrose — Coherencia Cuántica

Basada en la teoría **Orch-OR** de Roger Penrose.

$$C_{\text{raw}}(x) = H(\bar{D}_1, \bar{D}_2, \ldots, \bar{D}_7)$$

donde $H$ es la **media armónica** (un solo dominio bajo arrastra toda la coherencia):

$$H(v_1, \ldots, v_n) = \frac{n}{\sum_{i=1}^{n} \frac{1}{\max(v_i, \varepsilon)}}$$

con $\varepsilon = 0.001$ (floor para prevenir singularidades).

$$C(x|\Lambda) = \text{clamp}\left(C_{\text{raw}} \cdot (0.7 + \Lambda \cdot 0.4)\right)$$

**Entropía interna (varianza inter-dominio):**

$$S_{\text{internal}} = \text{clamp}\left(3 \cdot \sqrt{\text{Var}(\bar{D}_1, \ldots, \bar{D}_7)}\right)$$

> **v3.0:** Con 7 dominios en la media armónica, un solo dominio colapsado (ej: Alimento caótico) destruye la coherencia global aún más severamente que con 6 dominios. Se añade $\varepsilon$-floor para estabilidad numérica.

---

## II.16 Política de Inhibición: π(x)

La política $\pi(x)$ determina si el sistema debe actuar, esperar o pausar, basándose en $\dot{\Lambda}$ (la derivada temporal de Λ).

$$\dot{\Lambda} = \Lambda_t - \Lambda_{t-1}$$

### Tabla de Decisión

| Prioridad | Condición | Veredicto | Color |
|-----------|-----------|-----------|-------|
| 1 | $\Lambda < 0.15$ | **PAUSA** 🛑 | Rojo |
| 2 | $V < 0.30$ | **PAUSA** 🛑 | Rojo |
| 3 | $S > 0.55$ | **ESPERA** ⏸ | Amarillo |
| 4 | $C < 0.30$ | **ESPERA** ⏸ | Amarillo |
| 5 | $\dot{\Lambda} < -0.02$ | **RECONECTA** 🔮 | Púrpura |
| 6 | $\Lambda > 0.50 \wedge V > 0.55 \wedge S < 0.35 \wedge C > 0.45$ | **ACTÚA** ✦ | Verde |
| 7 | (default) | **MONITOREA** ◎ | Índigo |

---

## II.17 Meta-Política: π²(x)

Política de segundo orden que evalúa patrones sistémicos:

| Condición | Veredicto | Acción |
|-----------|-----------|--------|
| Señal A⁻ detectada | **ESCAPE A⁻** | Intervención disruptiva inmediata |
| Señales con severidad > 0.75 | **ESCAPE** | Protocolo de desestabilización controlada |
| $\Lambda < \Lambda^* \wedge V < V^*$ | **ACTIVAR** | Incrementar alineación Logos |
| $\Lambda \geq \Lambda^* \wedge V \geq V^* \wedge S < S^*$ | **SOSTENER** | Mantener prácticas |
| (default) | **EVOLUCIONAR** | Crecimiento consciente |

---

## II.18 Atractores Duales

### Atractor Positivo A⁺

$$A^+ = \{x \in [0,1]^{28} : \Lambda(x) \geq \Lambda^*, V(x) \geq V^*, S(x) \leq S^*\}$$

$$A^+ = \{\Lambda \geq 0.60, V \geq 0.70, S \leq 0.30\}$$

**Propiedades de A⁺:**
- Auto-reforzante: mayor Λ → mayor V, menor S → mayor Λ
- Estable: perturbaciones pequeñas retornan al atractor
- El Logos fluye: π(x) = ACTÚA

### Atractor Negativo A⁻

$$A^- = \{x : \Lambda(x) < 0.20 \wedge S(x) > 0.50\}$$

**Propiedades de A⁻:**
- Espiral entrópica: menor Λ → mayor S → menor Λ
- Auto-reforzante negativo: cada paso hacia A⁻ dificulta el retorno
- Requiere intervención externa para escapar
- $\dot{\Lambda} < 0$ con $\ddot{S} > 0$

---

## II.19 Modelo Estocástico Monte Carlo

### Proyección Estocástica

Para cada dimensión $x_i$ en el paso temporal $t$:

$$x_i^{t+1} = \text{clamp}\left(x_i^t + \mu_i(x_i^t) + \sigma \cdot \mathcal{N}(0,1)\right)$$

donde el drift $\mu_i$ es:

$$\mu_i(x_i) = \begin{cases} -0.002 + \epsilon & \text{si } x_i > 0.5 \\ +0.003 + \epsilon & \text{si } x_i \leq 0.5 \end{cases}$$

con $\epsilon \sim \text{Uniform}(-0.0025, 0.0025)$ y $\sigma = 0.04$ (default).

### Parámetros de Simulación

| Parámetro | Símbolo | Default | Rango |
|-----------|---------|---------|-------|
| Número de simulaciones | $N$ | 10,000 | {1000, 5000, 10000, 50000} |
| Pasos temporales | $T$ | 30 | Fijo |
| Desviación estándar | $\sigma$ | 0.04 | {0.02, 0.04, 0.06, 0.08, 0.10} |

### Estadísticas Calculadas

Para cada paso temporal $t \in [0, T]$:

- **Percentiles de Λ:** $p_5, p_{25}, p_{50}, p_{75}, p_{95}$
- **Media de Λ:** $\bar{\Lambda}_t$
- **Percentiles de V, S, Ω:** $p_5, p_{50}, p_{95}$
- **Distribución de π:** $P(\text{PAUSA}), P(\text{ESPERA}), P(\text{RECONECTA}), P(\text{MONITOREA}), P(\text{ACTÚA})$

### Métricas Finales

- $P(\Lambda_T > \Lambda_0)$ — Probabilidad de mejora
- $\bar{\Lambda}_T \pm \sigma_{\Lambda_T}$ — Media y desviación final
- $P(A^-)$ — Probabilidad de atractor negativo
- TTA (Time to ACTÚA) — Mediana de pasos hasta primer ACTÚA
- $P(\text{nunca ACTÚA})$ — Probabilidad de no alcanzar ACTÚA

### Generación de Números Aleatorios

**Box-Muller Transform** para distribución Gaussiana:

$$Z = \sqrt{-2 \ln U_1} \cdot \cos(2\pi U_2)$$

donde $U_1, U_2 \sim \text{Uniform}(0,1)$.

---

## II.20 Intervalos de Confianza Wilson

Para proporciones binomiales del Monte Carlo, se usa el **Wilson Score Interval** con $z = 1.96$ (95% CI):

$$\hat{p} = \frac{k}{n}$$

$$\text{center} = \frac{\hat{p} + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}$$

$$\text{margin} = \frac{z \cdot \sqrt{\frac{\hat{p}(1-\hat{p}) + \frac{z^2}{4n}}{n}}}{1 + \frac{z^2}{n}}$$

$$CI_{95\%} = [\text{center} - \text{margin}, \text{center} + \text{margin}]$$

**Ventaja sobre Wald:** No produce intervalos negativos ni mayores a 1 para proporciones extremas.

---

## II.21 Fundamentación Teórica

### Karl Friston — Principio de Energía Libre

**Capa 1.** Todo sistema vivo minimiza su energía libre variacional, que es una cota superior de la sorpresa (log-evidencia negativa). En LOGOS, $F(x)$ mide la divergencia KL entre el estado actual y el estado Logos-óptimo. Λ modula F: mayor alineación → menor sorpresa.

> *"The brain is fundamentally an inference machine, trying to minimize the difference between its predictions and sensory input."* — Friston, 2010

### Michael Levin — Patrones Bioeléctricos

**Capa 2.** Los organismos usan gradientes bioeléctricos como sistema de señalización para coordinar comportamiento celular. En LOGOS, las señales de Levin detectan patrones patológicos tempranos — como un "voltímetro" de la consciencia que identifica desequilibrios antes de que se manifiesten.

> *"Bioelectric patterns are a computational medium that stores and processes morphogenetic information."* — Levin, 2021

### James Watson — Optimización Energética

**Capa 3.** El paisaje energético define la topología de estados posibles. En LOGOS, Watson calcula la distancia euclidiana entre el estado actual y el óptimo modulado por Λ para cada dominio de vida.

### Donald Hoffman — Teoría de Interfaz de Percepción

**Capa 4.** La percepción no muestra la realidad tal como es, sino "íconos de fitness" optimizados para supervivencia. En LOGOS, Hoffman detecta sesgos donde la interfaz perceptual distorsiona la señal del Logos.

> *"Evolution has shaped our perceptions to hide truth and guide adaptive behavior."* — Hoffman, 2019

### Roger Penrose — Coherencia Cuántica (Orch-OR)

**Capa 5.** La consciencia emerge de procesos cuánticos coherentes en microtúbulos neuronales. En LOGOS, Penrose mide la coherencia inter-dominio usando media armónica — un solo dominio colapsado destruye la coherencia global.

> *"Consciousness depends on biologically orchestrated coherent quantum processes in collections of microtubules within brain neurons."* — Penrose & Hameroff, 2014

### Teología Informacional y el Concepto de Logos

**Fundamento v3.0.** El pipeline de 7 capas de LOGOS es estructuralmente isomorfo a un sistema de comunicación de Shannon (Shannon, 1948; Cover & Thomas, 2006):

| Capa LOGOS | Componente Shannon | Función |
|---|---|---|
| Logos (Λ) | Source / Signal Quality | Mide calidad de recepción de la señal |
| Friston (F) | Distortion | Divergencia entre estado actual y óptimo |
| Levin | Error Detection | Detecta patrones patológicos (errores en transmisión) |
| Watson | Channel Capacity | Distancia al óptimo por dominio |
| Hoffman | Noise Source | Sesgos perceptuales que distorsionan la señal |
| Penrose (C) | Channel Capacity | Coherencia inter-dominio |
| Policy (π) | Error Correction | Implementa códigos correctores (PAUSA, ESPERA, ACTÚA) |

Esta correspondencia conecta el framework computacional con la ontología informacional de Wheeler ("It from Bit", 1990), la filosofía de la información de Floridi (2011), y la tradición clásica del Logos desde Heráclito hasta el Prólogo Joánico, fundamentada en un modelo probabilístico-informacional complementario (Cadena Ortiz de Montellano, 2025).

> *"It from Bit — every particle, every field of force, derives its function from binary choices, bits."* — Wheeler, 1990

### Entropía Alimentaria Inversa

**Hipótesis v3.0:** El alimento ultra-procesado y tóxico constituye un **vector entrópico sistémico** que se propaga por las 7 capas del pipeline vía 5 vías empíricamente validadas: (1) disbiosis del microbioma, (2) neuroinflamación, (3) disregulación del eje HPA, (4) reducción del tono vagal, (5) estrés oxidativo. El factor de vulnerabilidad $(1 - \Lambda)$ demuestra que la alineación con el Logos confiere resiliencia contra la entropía dietética.

$$\Delta S_{\text{tóxico}} = \sum_{p=1}^{5} \gamma_p \cdot \text{pathway}_p(x) \cdot (1 - \Lambda)$$

Ver Paper §8.7 y RFC-LOGOS-003 §XI para evidencia completa (25+ referencias peer-reviewed).

### Geometrías Positivas y el Politopo de Consciencia

**Fundamento v5.1.** El espacio de estados de LOGOS [0,1]²⁸ es un **politopo convexo** — una *geometría positiva* en el sentido de Arkani-Hamed, Bai y Lam (2017). Su **forma canónica** es:

$$\Omega_{\text{LOGOS}} = \prod_{i=1}^{28} \frac{dx_i}{x_i(1 - x_i)}$$

Esta forma tiene polos simples en las 56 facetas frontera {xᵢ = 0} y {xᵢ = 1}, y ninguna otra singularidad.

**Correspondencia Frontera-Patología:** Las señales de Levin y los sesgos de Hoffman corresponden exactamente a los polos de Ω_LOGOS:

| Polo de Ω | Significado LOGOS | Capa de Detección |
|---|---|---|
| xᵢ → 0 | Colapso dimensional | **Levin** (señales patológicas) |
| xᵢ → 1 | Saturación dimensional | **Hoffman** (sesgos perceptuales) |

**Politopo Truncado de Consciencia:** Se define P⁺_Λ(c) = {x ∈ [0,1]²⁸ : Λ(x) ≥ c} con c = 0.35 (separatriz). Este politopo tiene hasta 57 facetas (56 originales + 1 separatriz). Su volumen codifica P(A⁺) — la probabilidad teórica de convergencia al atractor positivo.

**Factorización por Dominios:** La estructura de 7 dominios factoriza la forma canónica:

$$\Omega_{\text{LOGOS}} = \Omega_{\text{Físico}} \wedge \Omega_{\text{Emocional}} \wedge \Omega_{\text{Mental}} \wedge \Omega_{\text{Espiritual}} \wedge \Omega_{\text{Relacional}} \wedge \Omega_{\text{Propósito}} \wedge \Omega_{\text{Alimento}}$$

La coherencia de Penrose C(x) = H(D̄₁,...,D̄₇) mide el grado de factorizabilidad: alta coherencia = estado producto; baja coherencia = "entrelazamiento" entre dominios (análogo a decoherencia cuántica).

**Implementación:** `src/core/positive-geometry.ts` — Funciones #55-60, validadas por 40 tests unitarios.

| Función | Métrica | Descripción |
|---|---|---|
| `computeCanonicalForm` | Ω(x) normalizada | Salud geométrica: 1 = centro, 0 = frontera (polo) |
| `computeBoundaryProximity` | ρ(x) | Distancia al polo más cercano de Ω |
| `computeTruncatedPolytope` | Vol(P⁺)/Vol([0,1]²⁸) | P(A⁺) teórica vía CLT |
| `computeDomainFactorizability` | Índice de factorizabilidad | Grado de descomposición producto |
| `computePositiveGeometry` | GCI (Geometric Consciousness Index) | Compuesto de todas las métricas geométricas |

**GCI (Índice Geométrico de Consciencia):** GCI = 0.35·Ω_norm + 0.25·ρ + 0.20·F + 0.20·d_sep. Integra la forma canónica normalizada, la proximidad frontera, la factorizabilidad y la distancia a la separatriz en un solo índice compuesto ∈ [0,1].

**Hipótesis de Emergencia Geométrica (v5.1):** El modelo predice que eventos emergentes (insights, sincronicidades, estados de flujo) son más probables cuando se cumplen simultáneamente:

1. **Λ > 0.65** — fase ordenada del politopo (análogo a fase cristalina en Langevin)
2. **C₁–C₅ abiertas** — las 5 puertas de criticalidad del ERS
3. **ρ > 0.15** — ninguna dimensión cerca de un polo de Ω

Esta hipótesis se fundamenta en la analogía termodinámica: Λ actúa como inverso de temperatura (1/T). En la fase ordenada (T baja, Λ alta), las fluctuaciones se reducen y la auto-organización emerge espontáneamente — exactamente como la cristalización en materia condensada.

**Visualización (v5.1):** `src/components/PolytopeVisualization.jsx` — Canvas dual con tooltips interactivos:

| Panel | Contenido | Elementos |
|---|---|---|
| **Izquierda: Mandala Heptagonal** | Proyección 2D del politopo | 7 sectores (dominios), 28 radios (dimensiones), polígono de estado, separatriz heptagonal, zonas de peligro (polos), GCI central |
| **Derecha: Corte Λ** | Politopo truncado P⁺_Λ(0.35) | Eje Λ ∈ [0,1], regiones P⁺/P⁻, fases (Ordenado/Fluido/Gas), ✦ Zona de Emergencia (Λ>0.65), estado actual, Vol(P⁺) |

**Integración UI:** `src/components/PositiveGeometryCard.jsx` — Panel PanelWithAI (visualización izquierda, interpretación AI derecha vía `/api/protocol/interpret-panel`). Ubicación: pestaña Emergence, después de la Matriz de Coherencia.

**i18n:** Todas las etiquetas del canvas y panel usan claves de traducción (`positiveGeometry.*` en `es.json` y `en.json`). Tooltips disponibles en ambos idiomas.

> *"The amplituhedron and its relatives suggest that spacetime and quantum mechanics are not fundamental but emergent — derived from the geometry of a positive space."* — Arkani-Hamed, 2017

Ver Paper §2.9 y `docs/ANALISIS_GEOMETRIAS_POSITIVAS_LOGOS.md` para el análisis completo.

---

---

# PARTE III — REFERENCIA DE API

---

## III.22 Core Engine — Layer 7: Logos

**Archivo:** `src/core/logos.ts`

### `computeLogosAlignment(s)`

Computa la alineación fundamental con el Logos Λ(x). **Esta es la función más importante del sistema.**

```typescript
function computeLogosAlignment(s: ConsciousnessState): LogosResult
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `s` | `ConsciousnessState` | Vector de estado de 28 dimensiones ∈ [0,1] |

**Retorno:** `LogosResult` — `{ value: number, breakdown, components, signal?: number, channel?: ChannelQualityResult, hierarchical?: HierarchicalLambdaInfo }`

**Complejidad:** O(n) donde n = 28 dimensiones (12 señal + 16 canal). Implementa Lambda Jerárquico: Λ = Λ_señal × Φ_canal.

### `interpretLogosAlignment(lambda)`

| Rango Λ | `level` | `color` |
|---------|---------|---------|
| ≥ 0.75 | `"ALINEADO"` | `"#10b981"` |
| ≥ 0.50 | `"CONECTANDO"` | `"#fbbf24"` |
| ≥ 0.30 | `"BUSCANDO"` | `"#f59e0b"` |
| < 0.30 | `"DESCONECTADO"` | `"#ef4444"` |

---

## III.23 Core Engine — Layer 1: Friston

**Archivo:** `src/core/friston.ts`

### `computeFreeEnergy(s, Lambda)`

Computa la energía libre F(x) — divergencia KL entre estado actual y estado Logos-óptimo.

```typescript
function computeFreeEnergy(s: ConsciousnessState, Lambda: number): FreeEnergyResult
```

**Retorno:** `{ value: number, raw: number, modulated: number, breakdown: BreakdownItem[], lambdaEffect: number }`

**Fórmula:** `F = F_raw × (1 - Λ × 0.3)`, clamped a [0, 1.5]

---

## III.24 Core Engine — Layer 2: Levin

**Archivo:** `src/core/levin.ts`

### `computeLevinSignals(s, Lambda)` → `LevinSignal[]`

Detecta patrones bioéléctricos patológicos y señales de alerta temprana.

### `hasCriticalSignals(signals)` → `boolean` (severidad > 0.80)

### `hasNegativeAttractor(signals)` → `boolean` (detecta A⁻)

---

## III.25 Core Engine — Layer 3: Watson

**Archivo:** `src/core/watson.ts`

### `computeWatsonEnergy(s, Lambda)` → `WatsonResult`

Computa el paisaje energético — distancia euclidiana al óptimo por dominio.

**Retorno:** `{ energy: number, domainScores, optimal, breakdown }`

---

## III.26 Core Engine — Layer 4: Hoffman

**Archivo:** `src/core/hoffman.ts`

### `computeHoffmanInterface(s, Lambda)` → `HoffmanBias[]`

Detecta sesgos perceptuales donde la interfaz distorsiona la señal del Logos.

---

## III.27 Core Engine — Layer 5: Penrose

**Archivo:** `src/core/penrose.ts`

### `computeCoherence(s, Lambda)` → `CoherenceResult`

Computa la coherencia cuántica del sistema usando media armónica inter-dominio.

**Retorno:** `{ coherence: number, rawCoherence, entropy, domains, lambdaBoost, breakdown }`

---

## III.28 Core Engine — Layer 6: Policy

**Archivo:** `src/core/policy.ts`

### `inhibitionPolicy(Lambda, V, S, C, prevLambda?)` → `InhibitionPolicy`

Política de inhibición π(x) — determina si actuar, esperar o pausar.

**Retorno:** `{ verdict: 'PAUSA'|'ESPERA'|'RECONECTA'|'MONITOREA'|'ACTÚA', color, reason, icon, lambdaDot }`

### `metaPolicy(Lambda, V, S, C, signals)` → `MetaPolicy`

Meta-política π²(x) — evaluación de patrones sistémicos y atractores.

**Retorno:** `{ verdict: string, color, reason }`

---

## III.29 Core Engine — Derived Metrics

**Archivo:** `src/core/derived.ts`

| Función | Retorno | Descripción |
|---------|---------|-------------|
| `computeViability(s, Λ)` | `ViabilityResult` | V ∈ [0,1] — capacidad funcional |
| `computeEntropy(s, Λ)` | `EntropyResult` | S ∈ [0,1] — desorden interno |
| `computeOmega(Λ, V, S, C, F)` | `OmegaResult` | Ω ∈ [0,1] — índice de consciencia |
| `computeQ(Λ, V, S)` | `TrajectoryResult` | Q — calidad de trayectoria |

---

## III.29b Core Engine — Alimento Sagrado (Recomendación Autónoma)

**Archivo:** `src/core/alimento.ts`

> **Decisión arquitectónica:** Este módulo es 100% independiente de ChefManny/SINTONÍA. LOGOS recomienda QUÉ comer y POR QUÉ (basado en estado de consciencia). ChefManny maneja CÓMO cocinarlo. Los sistemas no se comunican — cero dependencia, cero riesgo de caída cruzada.

**Fuentes de conocimiento:**
- Paper §5.4: 10 pathways bioquímicos validados (nutriente → dimensión)
- Paper §8.7: Entropía Alimentaria Inversa (alimento tóxico → ΔS_toxic)
- ChefManny `IngredientNeurochemicalMap.ts`: concepto de registro/resonancia (adaptado)
- Perplexity research: 48 mapeos evidencia-basada alimento→neurotransmisor
- Tradiciones: Ayurveda, TCM, Mediterránea, Japonesa, Contemplativa

**Conceptos adoptados de ChefManny:**

| Concepto | Origen | Uso en LOGOS | Justificación |
|----------|--------|-------------|---------------|
| **Registro** (bass/tenor/alto/soprano) | `IngredientMusicalDatabase.ts` | `food_harmony` — balance armónico de comida | Evidencia emergente: variedad de sabores/texturas afecta tono vagal más allá de nutrición |
| **Resonancia** (1-10) | `IngredientNeurochemicalMap.ts` | `taste_presence` — vivacidad de sabor promueve mindfulness | Alimentos de alta resonancia facilitan alimentación consciente |
| **Perfiles neuroquímicos** | `IngredientNeurochemicalMap.ts` | Recomendaciones por dimensión (peace→GABA, energy→dopamina) | Bridge directo entre alimento y dimensiones de consciencia |

**Conceptos NO adoptados de ChefManny:**

| Concepto | Razón de exclusión |
|----------|-------------------|
| Notas musicales (E4, G4, C5) | Exclusivo de Partitura Gastronómica |
| Niveles dinámicos (ppp-fff) | Detalle de composición de recetas |
| Duración/tiempo de cocción | Territorio de generación de recetas |
| HI (Happiness Index) | Métrica exclusiva de SINTONÍA |
| Ecuaciones de sabor | Territorio de SINTONÍA |

**Base de datos:** ~40 alimentos sagrados con perfiles neuroquímicos, registro, resonancia, tradición, y nota sagrada.

| Función | Retorno | Descripción |
|---------|---------|-------------|
| `getAlimentoRecommendations(state)` | `AlimentoRecommendation` | Detecta dims bajas → recomienda alimentos + predice Δ |
| `assessMealHarmony(foodIds[])` | `MealHarmonyScore` | Evalúa balance armónico (4 registros) + resonancia promedio |
| `predictDimensionChanges(foodIds[])` | `Record<string, number>` | Predice cambios dimensionales por alimentos consumidos |
| `estimateEntropicDamage(toxic, Λ)` | `{deltaSEntropy, vulnerability, warning}` | Estima daño entrópico de comida tóxica (Paper §8.7) |

**Constantes exportadas:**
- `SACRED_FOODS`: ~40 alimentos con perfiles completos
- `NUTRIENT_PATHWAYS`: 10 vías bioquímicas del Paper §5.4
- `TOXIC_FOOD_WARNINGS`: 3 categorías de alimento tóxico

---

## III.30 Simulation — Monte Carlo

**Archivo:** `src/simulation/montecarlo.ts`

### `runMonteCarlo(s, N?, steps?, sigma?)` → `MonteCarloResult`

| Parámetro | Default | Descripción |
|-----------|---------|-------------|
| `N` | 10000 | Número de simulaciones |
| `steps` | 30 | Pasos temporales |
| `sigma` | 0.04 | Desviación estándar del ruido |

**Complejidad:** O(N × steps × 24)

### `projectTrajectory(s, steps?)` → `TrajectoryPoint[]`

Proyecta una trayectoria determinística para visualización.

---

## III.31 Utils — Math

**Archivo:** `src/utils/math.ts`

| Función | Descripción |
|---------|-------------|
| `clamp(v, lo?, hi?)` | Restringe valor entre límites [0,1] |
| `lerp(a, b, t)` | Interpolación lineal |
| `percentile(arr, p)` | Percentil p de un array |
| `mean(arr)` | Media aritmética |
| `std(arr)` | Desviación estándar |
| `variance(arr)` | Varianza |
| `gaussianRandom()` | N(0,1) via Box-Muller |
| `wilsonCI(k, n, z?)` | Wilson Score Interval |
| `harmonicMean(values)` | Media armónica |

---

## III.32 Hooks — React Bridge

**Archivo:** `src/hooks/useLogosEngine.ts`

### `useLogosEngine(state)` → `EngineResult`

Hook principal que orquesta las 7 capas del motor de cómputo. Memoiza con `useMemo`.

### `useConsciousnessState(initialState)`

Gestiona el estado de 28 dimensiones con helpers: `updateDimension`, `updateMultiple`, `reset`, `setState`.

---

## III.33 Services — API Client

**Archivo:** `src/services/api.js`

| Función | Descripción |
|---------|-------------|
| `syncUser(userData)` | Sincroniza usuario con PostgreSQL |
| `saveSession(sessionData)` | Guarda sesión de evaluación |
| `getSessions(limit?, offset?)` | Obtiene sesiones del usuario |
| `getLongitudinalReport()` | Reporte longitudinal |
| `getWeeklyReport()` | Reporte semanal |
| `checkHealth()` | Verifica estado del backend |

---

---

# PARTE IV — COMPONENTES REACT

---

## IV.34 App

**Archivo:** `src/App.jsx`  
**Tipo:** Componente funcional (root)  
**Responsabilidad:** Autenticación (Supabase Auth: Google + Apple + Guest), recolección de teléfono obligatoria, WhatsApp opt-in, y routing.

### State Interno

| Estado | Tipo | Inicialización | Descripción |
|--------|------|----------------|-------------|
| `user` | `object \| null` | `null` | Datos del usuario (Supabase UUID) |
| `session` | `object \| null` | `null` | Sesión Supabase (JWT) |
| `loading` | `boolean` | `true` | Cargando sesión inicial |
| `needsPhone` | `boolean` | `false` | Si necesita registrar teléfono |
| `phoneInput` | `string` | `'+52 '` | Input de teléfono |
| `showWhatsAppOptIn` | `boolean` | `false` | Si mostrar WhatsApp opt-in |

### Renderizado Condicional (4 pantallas)

```
loading === true                → Pantalla "Cargando..."
user && needsPhone              → Pantalla "Completa tu perfil" (input teléfono)
user && showWhatsAppOptIn       → Pantalla "LOGOS en WhatsApp" (opt-in)
user === null                   → Login Page (Google + Apple + Guest)
user !== null && phone set      → BrowserRouter con header + Routes
```

### Rutas

| Path | Componente | Props |
|------|-----------|-------|
| `/` | `LogosHumano` | `user`, `accessToken` |
| `/logos` | `LogosHumano` | `user`, `accessToken` |
| `/ifc` | `IFCModel` | — |
| `*` | `Navigate to /` | — |

---

## IV.35 LogosHumano

**Archivo:** `src/components/LogosHumano.jsx`  
**Tipo:** Componente funcional (dashboard principal)  
**Líneas:** ~2,242

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `user` | `object` | Sí | Datos del usuario |
| `accessToken` | `string \| null` | No | Token OAuth |

### State Interno

| Estado | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `state` | `ConsciousnessState` | `DEFAULT_STATE` | 28 dimensiones ∈ [0,1] |
| `activeTab` | `string` | `'estado'` | Pestaña activa |
| `prevLambda` | `number \| undefined` | `undefined` | Λ anterior para Λ̇ |
| `mcResult` | `MonteCarloResult \| null` | `null` | Resultado Monte Carlo |
| `mcRunning` | `boolean` | `false` | Si MC ejecutándose |
| `mcN` | `number` | `10000` | N para Monte Carlo |
| `mcSigma` | `number` | `0.04` | σ para Monte Carlo |
| `detailMetric` | `object \| null` | `null` | Métrica para detalle |
| `showOnboarding` | `boolean` | `true` | Mostrar onboarding |

### Pestañas del Dashboard

| ID | Label | Icono | Contenido |
|----|-------|-------|-----------|
| `estado` | Estado | ◈ | Sliders de 28 dimensiones (7 dominios) + métricas |
| `motor` | Motor | ⚙ | Desglose del motor de 7 capas |
| `decisiones` | Decisiones | ⚖ | Política π(x) + recomendaciones |
| `guia` | Guía | ? | Onboarding interactivo de 12 pasos |
| `trayectoria` | Trayectoria | ⟐ | Gráficas de evolución temporal |
| `montecarlo` | Monte Carlo | ∿ | Simulación estocástica N=10,000 |
| `teoria` | Teoría | Λ | Manual teórico completo |

---

## IV.36 Card

**Definido en:** `src/components/LogosHumano.jsx` (inline)

| Prop | Tipo | Required | Default | Descripción |
|------|------|----------|---------|-------------|
| `title` | `string` | No | — | Título |
| `icon` | `string` | No | — | Icono emoji |
| `accent` | `string` | No | — | Color de acento |
| `children` | `ReactNode` | Sí | — | Contenido |
| `style` | `object` | No | `{}` | Estilos adicionales |
| `delay` | `number` | No | `0` | Delay de animación |
| `onClick` | `function` | No | — | Handler de click |

---

## IV.37 MetricCard

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `label` | `string` | Sí | Nombre de la métrica |
| `value` | `number \| string` | Sí | Valor numérico |
| `color` | `string` | Sí | Color hex |
| `tooltip` | `string` | No | Texto de tooltip |
| `breakdown` | `array \| object` | No | Datos de desglose |
| `suffix` | `string` | No | Sufijo del valor |
| `onOpenDetail` | `function` | No | Abre panel de detalle |

---

## IV.38 MetricDetailPanel

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `metric` | `object` | Sí | `{ id, label, color, value, data }` |
| `onClose` | `function` | Sí | Callback para cerrar |

**Métricas Soportadas:** `"lambda"`, `"viability"`, `"entropy"`, `"coherence"`, `"freeEnergy"`, `"omega"`

**Sub-componentes:** `Bar`, `FactorRow`, `SectionHead`, `ModulationBox`

---

## IV.39 Slider

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `label` | `string` | Sí | Nombre de la dimensión |
| `value` | `number` | Sí | Valor actual ∈ [0,1] |
| `onChange` | `function` | Sí | Callback |
| `color` | `string` | Sí | Color de la dimensión |
| `tooltip` | `string` | No | Texto de ayuda |

---

## IV.40 InfoTooltip

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `text` | `string` | Sí | Texto del tooltip |
| `children` | `ReactNode` | Sí | Contenido que activa el tooltip |

---

## IV.41 MonteCarloAnimation

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `running` | `boolean` | Sí | Si la animación está activa |
| `progress` | `number` | No | Progreso 0-1 |

Canvas HTML5 con partículas animadas representando trayectorias estocásticas.

---

## IV.42 TheoryManual

**Archivo:** `src/components/TheoryManual.jsx`  
Constante exportada `THEORY_MANUAL` con secciones: `overview`, `lambda`, `friston`, `levin`, `watson`, `hoffman`, `penrose`, `policy`, `montecarlo`, `attractors`

---

## IV.43 SessionTracker

**Archivo:** `src/components/SessionTracker.jsx`

| Función Exportada | Descripción |
|-------------------|-------------|
| `startSession()` | Inicia sesión de evaluación |
| `endSession()` | Finaliza sesión activa |
| `saveSessionSnapshot()` | Guarda snapshot del estado |

---

## IV.44 LogosVoiceAgent

**Archivo:** `src/components/LogosVoiceAgent.jsx`  
**Dependencia:** `@elevenlabs/react`  
**Agent ID:** `agent_0401kgrq0q0kfwx9v29fje7eqd5j`  
**Configuración:** `src/config/logosAgent.js`

---

## IV.45 IFCModel

**Archivo:** `src/components/IFCModel.jsx`  
Componente experimental para visualización de modelos IFC. Ruta `/ifc`.

---

---

# PARTE V — MODELO DE DATOS

---

## V.46 Estructura del Estado

### ConsciousnessState

El estado central del sistema es un `Record<StateKey, number>` con 28 claves, cada una ∈ [0, 1]:

```typescript
type StateKey = 
  | 'sleep' | 'breath' | 'exercise' | 'energy'          // Physical (v3.0: nutrition → breath)
  | 'peace' | 'gratitude' | 'love' | 'joy'               // Emotional
  | 'clarity' | 'focus' | 'creativity' | 'wisdom'         // Mental
  | 'faith' | 'meditation' | 'service' | 'presence'       // Spiritual
  | 'family' | 'friendship' | 'community' | 'compassion'  // Relational
  | 'meaning' | 'mission' | 'contribution' | 'legacy'     // Purpose
  | 'nourishment' | 'taste_presence' | 'food_harmony' | 'gut_resonance'; // Alimento (NEW v3.0)

type ConsciousnessState = Record<StateKey, number>;
```

### Estado por Defecto

Todas las dimensiones inicializadas en 0.5 (punto neutro).

---

## V.47 Interfaces TypeScript

Todas las interfaces están definidas en `src/types/index.ts`:

- `LogosResult`, `FreeEnergyResult`, `LevinSignal`, `WatsonResult`, `HoffmanBias`
- `CoherenceResult`, `ViabilityResult`, `EntropyResult`, `OmegaResult`, `TrajectoryResult`
- `InhibitionPolicy`, `MetaPolicy`, `Recommendation`
- `MonteCarloStats`, `VerdictCI`, `MonteCarloResult`, `TrajectoryPoint`
- `EngineResult` — output completo del hook `useLogosEngine`

---

## V.48 Esquema de 28 Dimensiones × 7 Dominios

| # | Dominio | Icono | Color | Dim 1 | Dim 2 | Dim 3 | Dim 4 |
|---|---------|-------|-------|-------|-------|-------|-------|
| 1 | **Cuerpo** | ◈ | `#10b981` | Sueño | Respiración | Movimiento | Energía |
| 2 | **Emociones** | ◇ | `#f59e0b` | Paz Interior | Gratitud | Amor | Alegría |
| 3 | **Mente** | ⟐ | `#6366f1` | Claridad | Enfoque | Creatividad | Sabiduría |
| 4 | **Espíritu** | ✦ | `#a855f7` | Fe | Meditación | Servicio | Presencia |
| 5 | **Relaciones** | ⬡ | `#ec4899` | Familia | Amistades | Comunidad | Compasión |
| 6 | **Propósito** | ◎ | `#0ea5e9` | Sentido | Misión | Contribución | Legado |
| 7 | **Alimento** | ⚘ | `#84cc16` | Nutrición Vital | Presencia Gustativa | Armonía Alimentaria | Resonancia Entérica |

### Detalle de Cada Dimensión

| Clave | Label | Tooltip (pregunta guía) |
|-------|-------|------------------------|
| `sleep` | Sueño | ¿Cuántas horas dormiste y qué tan reparador fue tu sueño? |
| `breath` | Respiración | ¿Respiraste conscientemente hoy? ¿Practicaste algún ejercicio de respiración? |
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
| `nourishment` | Nutrición Vital | ¿Tu comida de hoy fue fresca, vital, preparada con ingredientes reales? |
| `taste_presence` | Presencia Gustativa | ¿Comiste con atención plena, saboreando cada bocado? |
| `food_harmony` | Armonía Alimentaria | ¿El entorno de tu comida fue armonioso? ¿Hubo intención, gratitud, buena compañía? |
| `gut_resonance` | Resonancia Entérica | ¿Tu cuerpo se siente bien después de comer? ¿Energía limpia o pesadez? |

---

## V.49 Constantes del Sistema

### Umbrales de Atractores

```typescript
const V_STAR = 0.70;       // Viabilidad objetivo (A⁺)
const S_STAR = 0.30;       // Entropía objetivo (A⁺)
const LAMBDA_STAR = 0.60;  // Logos objetivo (A⁺)
```

### Paleta de Colores (COLORS)

| Clave | Hex | Uso |
|-------|-----|-----|
| `bg` | `#06060f` | Fondo principal |
| `surface` | `#0d0d1f` | Superficie de tarjetas |
| `border` | `#2a2a55` | Bordes |
| `text` | `#f0f0f8` | Texto principal |
| `viability` | `#10b981` | V — Verde esmeralda |
| `entropy` | `#ef4444` | S — Rojo |
| `logos` | `#c084fc` | Λ — Púrpura claro |
| `coherence` | `#6366f1` | C — Índigo |
| `omega` | `#fbbf24` | Ω — Dorado |
| `freeEnergy` | `#f97316` | F — Naranja |
| `allow` | `#10b981` | ACTÚA — Verde |
| `wait` | `#f59e0b` | ESPERA — Amarillo |
| `block` | `#ef4444` | PAUSA — Rojo |
| `connect` | `#a855f7` | RECONECTA — Púrpura |
| `mc` | `#06b6d4` | Monte Carlo — Cyan |

---

## V.50 Estructura de Breakdown por Métrica

**Λ (Logos):** Breakdown por 4 grupos (reception, action, decoding, gratitude)  
**V, S, F:** Breakdown lineal por dimensión con peso y contribución  
**Ω:** Breakdown de composición (Λ 60%, V+, C+, S−, F−)

---

## V.51 Modelo de Base de Datos (Supabase PostgreSQL)

> **Proveedor:** Supabase (cloud) — Project Ref: `qfqgplopnwxilnyeajbt` — Region: `us-west-2`

### Tabla `profiles` (extiende `auth.users`)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `UUID` | PK, FK → auth.users(id) | Supabase Auth UUID |
| `email` | `VARCHAR(255)` | UNIQUE INDEX | Email del usuario |
| `name` | `VARCHAR(255)` | — | Nombre completo |
| `picture` | `TEXT` | — | URL de avatar |
| `phone` | `VARCHAR(20)` | INDEX | Teléfono con código de país |
| `last_state` | `JSONB` | DEFAULT '{}' | **Estado unificado de 28 dimensiones** |
| `whatsapp_optin` | `BOOLEAN` | DEFAULT false | Si vio pantalla WhatsApp opt-in |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

### Tabla `channel_users` (WhatsApp/Voice/SMS)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | `SERIAL` | PK | ID auto-incremental |
| `phone` | `VARCHAR(20)` | UNIQUE NOT NULL | Teléfono (PK funcional) |
| `channel` | `VARCHAR(20)` | DEFAULT 'whatsapp' | Canal de origen |
| `name` | `VARCHAR(255)` | — | Nombre del usuario |
| `email` | `VARCHAR(255)` | — | Email (para linking) |
| `user_id` | `UUID` | FK → profiles(id) | **Vínculo con perfil web** |
| `state` | `JSONB` | DEFAULT '{}' | Estado local (fallback) |
| `total_sessions` | `INTEGER` | DEFAULT 0 | Total de sesiones |

### Tabla `sessions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `SERIAL` | PK |
| `user_id` | `UUID` | FK → profiles(id) |
| `channel` | `VARCHAR(20)` | web/whatsapp/voice/sms |
| `lambda`, `omega`, `viability`, `entropy` | `REAL` | Métricas |
| `verdict` | `VARCHAR(50)` | Veredicto π(x) |
| `state_snapshot` | `JSONB` | ConsciousnessState completo |

### Tabla `conversations` (persistencia OpenAI)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `channel_id` | `VARCHAR(50)` | UNIQUE — phone o user_id |
| `conversation_id` | `VARCHAR(255)` | OpenAI Conversations API ID |

### Tabla `conversation_log` (mensajes WhatsApp)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `phone` | `VARCHAR(20)` | Teléfono del usuario |
| `role` | `VARCHAR(10)` | 'user' o 'agent' |
| `content` | `TEXT` | Contenido del mensaje |
| `lambda_at` | `REAL` | Λ al momento del mensaje |

### Tabla `daily_snapshots`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `user_id` | `UUID` | FK → profiles(id) |
| `date` | `DATE` | Fecha del snapshot |
| `lambda`, `omega`, `viability`, `entropy` | `REAL` | Métricas del día |
| `verdict` | `VARCHAR(50)` | Veredicto del día |

---

## V.52 Almacenamiento en Cliente

### Supabase Auth (localStorage)

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `sb-<ref>-auth-token` | JSON | JWT + refresh token (gestionado por Supabase SDK) |

### Ciclo de Vida de Autenticación

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

---

# PARTE VI — DIAGRAMAS

---

## VI.53 Diagrama de Flujo del Cálculo de Métricas

```mermaid
flowchart TD
    Start["Usuario ajusta sliders<br/>x ∈ [0,1]²⁸"] --> State["ConsciousnessState<br/>28 dimensiones"]
    State --> L7["L7: computeLogosAlignment(x)<br/>Λ(x) = Σ wᵢ·xᵢ"]
    L7 --> |"Λ"| L1["L1: computeFreeEnergy(x, Λ)"]
    L7 --> |"Λ"| L2["L2: computeLevinSignals(x, Λ)"]
    L7 --> |"Λ"| L3["L3: computeWatsonEnergy(x, Λ)"]
    L7 --> |"Λ"| L4["L4: computeHoffmanInterface(x, Λ)"]
    L7 --> |"Λ"| L5["L5: computeCoherence(x, Λ)"]
    L7 --> |"Λ"| DV["computeViability(x, Λ)"]
    L7 --> |"Λ"| DS["computeEntropy(x, Λ)"]
    DV --> |"V"| Omega["computeOmega(Λ, V, S, C, F)<br/>Ω = Λ×0.6 + health×0.4"]
    DS --> |"S"| Omega
    L5 --> |"C"| Omega
    L1 --> |"F"| Omega
    L7 --> |"Λ"| Omega
    DV --> |"V"| Pi["inhibitionPolicy(Λ, V, S, C)<br/>π(x) → Veredicto"]
    DS --> |"S"| Pi
    L5 --> |"C"| Pi
    L7 --> |"Λ"| Pi
    Omega --> Render["Dashboard<br/>Métricas + Charts + Recomendaciones"]
    Pi --> Render
    L2 --> Render
    L4 --> Render
    style L7 fill:#c084fc,color:#000,stroke:#8b5cf6
    style Omega fill:#fbbf24,color:#000,stroke:#d4a017
    style Pi fill:#6366f1,color:#fff,stroke:#4f46e5
    style Render fill:#10b981,color:#000,stroke:#059669
```

---

## VI.54 Diagrama de Secuencia del Monte Carlo

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as Dashboard UI
    participant MC as runMonteCarlo()
    participant CE as Core Engine
    participant ST as Statistics
    U->>UI: Click "Ejecutar Monte Carlo" N=10000, σ=0.04
    UI->>MC: runMonteCarlo(state, N, steps, σ)
    loop i = 0 to N-1 (10,000 simulaciones)
        MC->>MC: cur = {...state}
        loop t = 0 to steps (30 pasos)
            MC->>CE: computeLogosAlignment(cur) → Λ
            MC->>CE: computeViability, Entropy, Coherence, FreeEnergy, Omega
            MC->>CE: inhibitionPolicy → π
            MC->>MC: Registrar Λ, V, S, Ω, π en arrays[t]
            MC->>MC: projectStateStochastic(cur, σ) → nuevo estado
        end
    end
    MC->>ST: Calcular percentiles, Wilson CIs, P(Λ↑), P(A⁻), TTA
    ST-->>MC: MonteCarloResult
    MC-->>UI: Resultado completo
    UI-->>U: Fan chart, distribución π, estadísticas
```

---

## VI.55 Diagrama de Estados de π(x)

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
    PAUSA --> Evaluación: Λ o V mejoran
    ESPERA --> Evaluación: S o C mejoran
    RECONECTA --> Evaluación: Λ̇ ≥ -0.02
    MONITOREA --> Evaluación: Condiciones cambian
    ACTÚA --> Evaluación: Condiciones cambian
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
    ACTIVAR --> SOSTENER: Alcanza A⁺
    SOSTENER --> EVOLUCIONAR: Estabilidad prolongada
```

---

## VI.56 Diagrama de Clases/Componentes

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
    }
    class FristonEngine {
        +computeFreeEnergy(s, Λ) FreeEnergyResult
    }
    class LevinEngine {
        +computeLevinSignals(s, Λ) LevinSignal[]
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
```

---

## VI.57 Diagrama de Dependencias de Módulos

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
        MC["simulation/montecarlo.ts"]
    end
    subgraph Domain["Domain"]
        Const["domain/constants.ts"]
    end
    subgraph Utils["Utils"]
        Math["utils/math.ts"]
    end
    main --> AppJSX
    AppJSX --> LH & IFC
    LH --> CoreIdx & MC & Const & TM & VA & ST
    CoreIdx --> Logos & Friston & Levin & Watson & Hoffman & Penrose & Policy & Derived
    MC --> Math & Logos & Derived & Penrose & Friston & Policy
    style Logos fill:#c084fc,color:#000
    style MC fill:#06b6d4,color:#000
```

---

## VI.58 Diagrama de Flujo de Autenticación (Supabase)

```mermaid
flowchart TD
    Start["Usuario visita logoilab.com"] --> Check{"Supabase session en localStorage?"}
    Check -->|"Sí (JWT válido)"| Profile{"profiles.phone existe?"}
    Profile -->|"Sí"| WACheck{"whatsapp_optin?"}
    WACheck -->|"Sí"| Dashboard["Dashboard LogosHumano"]
    WACheck -->|"No"| WAOptIn["WhatsApp Opt-In"]
    Profile -->|"No"| Phone["Completa tu perfil (teléfono)"]
    Check -->|"No"| Login["Login Page (Google + Apple + Guest)"]
    Login --> Google["Sign in with Google"]
    Login --> Apple["Sign in with Apple"]
    Login --> Guest["Entrar como Invitado"]
    Google --> SupaAuth["Supabase Auth OAuth redirect"]
    Apple --> SupaAuth
    SupaAuth --> Callback["Callback /auth/v1/callback"]
    Callback --> JWT["JWT → localStorage"]
    JWT --> Profile
    Guest --> GuestLocal["Usuario local (sin Supabase)"]
    GuestLocal --> Dashboard
    Phone --> SavePhone["profiles.phone + channel_users link"]
    SavePhone --> WAOptIn
    WAOptIn -->|"Conectar"| OpenWA["wa.me/19788012275"]
    WAOptIn -->|"Ahora no"| Dashboard
    OpenWA --> Dashboard
    Dashboard --> Logout["Cerrar sesión"]
    Logout --> SignOut["supabase.auth.signOut()"]
    SignOut --> Start
    style Dashboard fill:#10b981,color:#000
    style Google fill:#4285F4,color:#fff
    style Apple fill:#000,color:#fff
    style Phone fill:#6366f1,color:#fff
    style WAOptIn fill:#25D366,color:#fff
```

---

## VI.59 Diagrama de Atractores Duales

```mermaid
graph TD
    subgraph APlus["Atractor Positivo A⁺"]
        AP1["Λ ≥ 0.60"]
        AP2["V ≥ 0.70"]
        AP3["S ≤ 0.30"]
        AP4["π = ACTÚA"]
    end
    subgraph Transition["Zona de Transición"]
        T1["0.20 < Λ < 0.60"]
        T2["π = MONITOREA"]
    end
    subgraph AMinus["Atractor Negativo A⁻"]
        AM1["Λ < 0.20"]
        AM2["S > 0.50"]
        AM3["π = PAUSA"]
        AM4["π² = ESCAPE A⁻"]
    end
    APlus -->|"Λ̇ < 0"| Transition
    Transition -->|"Λ̇ > 0"| APlus
    Transition -->|"Λ̇ < 0"| AMinus
    AMinus -->|"Intervención externa"| Transition
    AMinus -.->|"Auto-reforzante"| AMinus
    APlus -.->|"Auto-reforzante"| APlus
    style APlus fill:#10b98122,stroke:#10b981,color:#10b981
    style Transition fill:#f59e0b22,stroke:#f59e0b,color:#f59e0b
    style AMinus fill:#ef444422,stroke:#ef4444,color:#ef4444
```

---

---

# PARTE VII — DEPLOYMENT

---

## VII.60 Requisitos del Sistema

### Desarrollo Local

| Requisito | Versión Mínima | Recomendada |
|-----------|---------------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Git | 2.x | Última |
| Navegador | Chrome 90+ | Chrome/Firefox última |

### Servidor de Producción

| Requisito | Versión | Descripción |
|-----------|---------|-------------|
| NGINX | 1.24+ | Servidor web / reverse proxy |
| Node.js | 18+ | Para backend API |
| PostgreSQL | 14+ | Base de datos |
| Let's Encrypt | — | Certificados SSL |

---

## VII.61 Instalación Local

```bash
cd /Users/manuelcadena/CascadeProjects/logos
npm install
npm run build
```

### Dependencias de Producción

```json
{
  "@elevenlabs/react": "^0.14.0",
  "@supabase/supabase-js": "^2.x",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.13.0",
  "recharts": "^2.12.7"
}
```

### Dependencias de Desarrollo

```json
{
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "typescript": "^5.3.3",
  "vite": "^5.4.0"
}
```

---

## VII.62 Desarrollo Local

```bash
npm run dev       # → http://localhost:5173
npm run preview   # → http://localhost:4173
```

El frontend usa variables hardcodeadas en `src/services/supabase.js` (Supabase URL + anon key). En producción podrían moverse a variables Vite (`VITE_SUPABASE_URL`).

---

## VII.63 Build para Producción

```bash
npm run build
```

**Output:** `dist/` — JS: ~1.4 MB (389 KB gzip), CSS: ~6 KB (2 KB gzip)

---

## VII.64 Deployment a Servidor M5

**Frontend (2 comandos):**
```bash
cd /Users/manuelcadena/CascadeProjects/logos && npm run build
rsync -avz --delete dist/ m5:/opt/logoilab/frontend/dist/
```

**Backend (2 comandos):**
```bash
rsync -avz --exclude='node_modules' --exclude='.env' --exclude='logs' \
  /Users/manuelcadena/CascadeProjects/logos-backend/ m5:/opt/logoilab/logos-backend/
ssh m5 "sudo systemctl restart logos-backend"
```

### Estructura en el Servidor

```
/opt/logoilab/
├── frontend/dist/   # ← Archivos servidos por NGINX
│   ├── index.html
│   ├── logo.svg
│   └── assets/
├── logos-backend/   # Backend Multi-Canal (systemd: logos-backend, port 3100)
│   ├── server.js
│   ├── .env
│   └── src/
│       ├── services/logos-agent.mjs  # OpenAI Agents SDK (12 tools)
│       ├── services/elevenlabs.js    # Voice AI bridge
│       ├── routes/webhook-*.js       # WhatsApp/Voice/SMS
│       └── db/postgres.js            # Supabase PostgreSQL
├── api/             # Legacy Express API (port 3200)
└── app/             # Código fuente legacy
```

---

## VII.65 Configuración NGINX

**Archivo:** `/etc/nginx/conf.d/logoilab.conf`

```nginx
server {
    server_name logoilab.com www.logoilab.com;
    root /opt/logoilab/frontend/dist;
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot-webroot;
    }

    # LOGOS Backend — WhatsApp/Voice/SMS webhooks (port 3100)
    location /webhook/ {
        proxy_pass http://127.0.0.1:3100/webhook/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # LOGOS Backend — WebSocket for voice bridge
    location /media-stream {
        proxy_pass http://127.0.0.1:3100/media-stream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # Legacy API proxy (port 3200)
    location /api/ {
        proxy_pass http://127.0.0.1:3200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/logoilab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logoilab.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.logoilab.com) { return 301 https://$host$request_uri; }
    if ($host = logoilab.com) { return 301 https://$host$request_uri; }
    listen 80;
    server_name logoilab.com www.logoilab.com;
    return 404;
}
```

---

## VII.66 Backend Multi-Canal (logos-backend)

### Servicio systemd

**Archivo:** `/etc/systemd/system/logos-backend.service`

```ini
[Unit]
Description=LOGOS Backend — Multi-channel Bridge
After=network.target postgresql.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/logoilab/logos-backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3100

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl status logos-backend
sudo systemctl restart logos-backend
sudo journalctl -u logos-backend -f --no-pager -n 50
```

### Base de Datos (Supabase PostgreSQL)

```bash
psql "postgresql://postgres:***@db.qfqgplopnwxilnyeajbt.supabase.co:5432/postgres"
# Tablas: profiles, channel_users, sessions, conversations, conversation_log, daily_snapshots
```

---

## VII.67 SSL / Certificados

```bash
sudo certbot renew
sudo certbot certificates
# Expira: 2026-05-07
```

---

## VII.68 Opciones Alternativas de Hosting

- **Vercel:** `vercel --prod` (detecta Vite automáticamente)
- **Netlify:** Build: `npm run build`, Publish: `dist`, Redirect: `/* → /index.html 200`
- **GitHub Pages:** Agregar `base: '/logos/'` en `vite.config.js`
- **Docker:** Alternativa disponible pero **no usada actualmente**

> **Nota:** El setup actual NO usa Docker para el frontend. NGINX sirve archivos estáticos directamente.

---

## VII.69 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Página no actualiza | Cache del navegador | Cmd+Shift+R o modo incógnito |
| Error 502 Bad Gateway | Backend no corriendo | `ssh m5 "sudo systemctl restart logos-backend"` |
| Archivos no se actualizan | rsync incompleto | Verificar `ls -la /opt/logoilab/frontend/dist/assets/` |
| Supabase Auth no funciona | Config incorrecta | Verificar Supabase Dashboard > Auth > Providers |
| WhatsApp no responde | logos-backend caído | `ssh m5 "sudo journalctl -u logos-backend -n 20"` |

---

---

# PARTE VIII — MANUAL DE USUARIO

---

## VIII.70 Introducción

**LOGOS** es un Sistema Operativo de Consciencia que te permite evaluar, monitorear y optimizar tu estado integral de vida a través de un modelo matemático basado en 5 científicos de clase mundial.

El sistema mide tu alineación con el **Logos** (Λ) — el atractor fundamental que representa tu conexión con el propósito, la verdad y la coherencia. Todas las demás métricas del sistema se derivan de Λ.

**Concepto central:** Cuando Λ sube, todo el sistema mejora. Cuando Λ baja, todo colapsa. Λ es la causa; el resto son efectos.

---

## VIII.71 Acceso al Sistema

**URL:** https://logoilab.com

- **Sign in with Google** — Autenticación con tu cuenta de Google. Permite guardar progreso.
- **Entrar como Invitado** — Acceso inmediato sin cuenta. Datos solo en sesión actual.
- **Cerrar sesión** — Limpia datos de sesión y regresa a login.

---

## VIII.72 Pestaña: Estado

**Icono:** ◈ — Evaluar tu estado actual en las 28 dimensiones de consciencia (7 dominios).

Cada dominio presenta 4 sliders (0% a 100%). **Sé honesto** — el sistema funciona mejor con datos reales.

| Métrica | Color | Significado |
|---------|-------|-------------|
| **Λ** (Lambda) | Púrpura | Tu alineación con el Logos |
| **Ω** (Omega) | Dorado | Índice de Consciencia integral |
| **V** (Viabilidad) | Verde | Capacidad funcional del sistema |
| **S** (Entropía) | Rojo | Desorden interno (menor es mejor) |
| **C** (Coherencia) | Índigo | Armonía entre dominios |
| **F** (Energía Libre) | Naranja | Divergencia del estado óptimo (menor es mejor) |

**Click en cualquier métrica** para ver su desglose detallado.

---

## VIII.73 Pestaña: Motor

**Icono:** ⚙ — Visualizar el funcionamiento interno del motor de 7 capas.

1. **L7: Logos** — Λ(x) y su desglose por grupo
2. **L1: Friston** — Energía libre y divergencia del óptimo
3. **L2: Levin** — Señales bioeléctricas y alertas
4. **L3: Watson** — Paisaje energético por dominio
5. **L4: Hoffman** — Sesgos perceptuales detectados
6. **L5: Penrose** — Coherencia cuántica inter-dominio
7. **L6: Policy** — Veredicto π(x) y meta-política π²(x)

---

## VIII.74 Pestaña: Decisiones

**Icono:** ⚖ — Obtener el veredicto del sistema.

| Veredicto | Icono | Significado | Acción |
|-----------|-------|-------------|--------|
| **PAUSA** | 🛑 | Sistema en crisis | No tomes decisiones importantes |
| **ESPERA** | ⏸ | Demasiado ruido | Estabiliza antes de actuar |
| **RECONECTA** | 🔮 | Alejándote del Logos | Detente y reconecta |
| **MONITOREA** | ◎ | En transición | Avanza con cautela |
| **ACTÚA** | ✦ | Sistema alineado | Procede con confianza |

### Recomendaciones Diarias

1. **URGENTE** — Basadas en señales de Levin
2. **FORTALECER** — Tu dominio más débil
3. **LOGOS** — Si Λ < 0.40
4. **EQUILIBRIO** — Si entropía > 0.40
5. **CRECER** — Si estás en zona A⁺

---

## VIII.75 Pestaña: Guía

**Icono:** ? — Onboarding interactivo de 12 pasos.

---

## VIII.76 Pestaña: Trayectoria

**Icono:** ⟐ — Proyección determinística de métricas a 30 pasos temporales.

---

## VIII.77 Pestaña: Monte Carlo

**Icono:** ∿ — Simulación estocástica de 10,000 futuros posibles.

| Parámetro | Opciones | Default | Descripción |
|-----------|----------|---------|-------------|
| **N** | 1K, 5K, 10K, 50K | 10K | Más = más preciso |
| **σ** | 0.02–0.10 | 0.04 | Volatilidad del estado |

### Interpretación

- **P(Λ↑) > 0.60** — Tendencia positiva
- **P(A⁻) > 0.10** — Alerta: riesgo de espiral negativa
- **TTA = null** — Nunca alcanza ACTÚA en la simulación
- **Veredicto dominante = ACTÚA** — Pronóstico favorable

---

## VIII.78 Pestaña: Teoría

**Icono:** Λ — Manual teórico completo del modelo matemático.

---

## VIII.79 Interpretación de Métricas

### Λ — Alineación con el Logos

| Rango | Nivel | Qué hacer |
|-------|-------|-----------|
| 0.75 – 1.00 | **ALINEADO** | Mantén tus prácticas. El canal está abierto. |
| 0.50 – 0.74 | **CONECTANDO** | Profundiza en meditación, servicio y presencia. |
| 0.30 – 0.49 | **BUSCANDO** | Dedica 10 min diarios de silencio contemplativo. |
| 0.00 – 0.29 | **DESCONECTADO** | Prioridad máxima: reconecta con fe, presencia, servicio. |

### Ω — Índice de Consciencia

| Rango | Interpretación |
|-------|---------------|
| > 0.70 | Excelente — sistema en zona A⁺ |
| 0.50 – 0.70 | Bueno — margen de mejora |
| 0.30 – 0.50 | Atención — alguna métrica arrastrando |
| < 0.30 | Crítico — múltiples métricas colapsadas |

### V — Viabilidad

Mide capacidad funcional. Si V < 0.30, el sistema emite PAUSA automáticamente.

### S — Entropía

Mide desorden interno. **Menor es mejor.** Si S > 0.55, el sistema emite ESPERA.

### C — Coherencia

Mide armonía entre 6 dominios. Un solo dominio bajo arrastra toda la coherencia (media armónica).

### F — Energía Libre

Mide distancia al estado óptimo. **Menor es mejor.** Λ reduce F automáticamente.

---

## VIII.80 Los 7 Dominios y 28 Dimensiones

### ◈ Cuerpo

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Sueño** | ¿Cuántas horas dormiste y qué tan reparador fue tu sueño? |
| **Respiración** | ¿Respiraste conscientemente hoy? ¿Practicaste algún ejercicio de respiración? |
| **Movimiento** | ¿Hiciste algún tipo de ejercicio o movimiento físico hoy? |
| **Energía** | ¿Qué tanta energía sientes para funcionar en tu día? |

### ◇ Emociones

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Paz Interior** | ¿Te sientes en calma o hay agitación interna? |
| **Gratitud** | ¿Reconoces y agradeces las cosas buenas en tu vida? |
| **Amor** | ¿Sientes amor dando y recibiendo en tus relaciones? |
| **Alegría** | ¿Hay un gozo de fondo en tu día, no solo placer momentáneo? |

### ⟐ Mente

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Claridad** | ¿Puedes pensar con claridad o sientes niebla mental? |
| **Enfoque** | ¿Puedes concentrarte en una tarea sin distraerte fácilmente? |
| **Creatividad** | ¿Fluyen ideas nuevas o te sientes estancado creativamente? |
| **Sabiduría** | ¿Tomas decisiones con perspectiva amplia, no solo reacción? |

### ✦ Espíritu

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Fe** | ¿Confías en que hay un propósito mayor guiando tu vida? |
| **Meditación** | ¿Dedicaste tiempo hoy al silencio, oración o meditación? |
| **Servicio** | ¿Hiciste algo por alguien más sin esperar nada a cambio? |
| **Presencia** | ¿Estás presente en el momento o vives en el pasado/futuro? |

### ⬡ Relaciones

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Familia** | ¿Estás conectado y presente con tu familia? |
| **Amistades** | ¿Tienes amistades profundas con quienes puedes ser tú mismo? |
| **Comunidad** | ¿Participas en algo más grande que tú? |
| **Compasión** | ¿Sientes y actúas ante el sufrimiento de otros? |

### ◎ Propósito

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Sentido** | ¿Sientes que tu vida tiene sentido y dirección? |
| **Misión** | ¿Sabes cuál es tu misión o llamado en esta vida? |
| **Contribución** | ¿Tu trabajo y acciones están creando impacto positivo real? |
| **Legado** | ¿Estás construyendo algo que permanecerá después de ti? |

### ⚘ Alimento (NUEVO v3.0)

| Dimensión | Pregunta Guía |
|-----------|--------------|
| **Nutrición Vital** | ¿Tu comida de hoy fue fresca, vital, preparada con ingredientes reales? |
| **Presencia Gustativa** | ¿Comiste con atención plena, saboreando cada bocado? |
| **Armonía Alimentaria** | ¿El entorno de tu comida fue armonioso? ¿Hubo intención, gratitud, buena compañía? |
| **Resonancia Entérica** | ¿Tu cuerpo se siente bien después de comer? ¿Energía limpia o pesadez? |

---

## VIII.81 Interpretación del Veredicto π

### Protocolo PAUSA 🛑

**Cuándo:** Λ < 0.15 o V < 0.30. No tomes decisiones importantes. Enfócate en necesidades básicas.

### Protocolo ESPERA ⏸

**Cuándo:** S > 0.55 o C < 0.30. Simplifica tu día. Practica respiración 4-7-8.

### Protocolo RECONECTA 🔮

**Cuándo:** Λ̇ < -0.02. Detente. 10 minutos de silencio contemplativo. Un acto de servicio.

### Protocolo MONITOREA ◎

**Cuándo:** Sistema en transición. Avanza con cautela y atención plena.

### Protocolo ACTÚA ✦

**Cuándo:** Λ > 0.50, V > 0.55, S < 0.35, C > 0.45. Procede con confianza.

---

## VIII.82 Uso del Simulador Monte Carlo

### Cuándo Usarlo

- Antes de tomar una decisión importante
- Para evaluar tu pronóstico a 30 días
- Para identificar riesgo de caer en A⁻

### Ajustar Parámetros

- **σ bajo (0.02):** Escenario estable
- **σ medio (0.04):** Escenario normal
- **σ alto (0.08-0.10):** Escenario volátil — crisis, cambios de vida

---

---

# PARTE IX — TESTING

---

## IX.83 Estrategia de Testing

### Pirámide de Tests

```
         ╱╲
        ╱ E2E ╲           ← Pocos: flujo completo login → evaluación → logout
       ╱────────╲
      ╱Integration╲       ← Medio: pipeline completo de 7 capas
     ╱──────────────╲
    ╱   Unit Tests    ╲    ← Muchos: cada función pura del core
   ╱────────────────────╲
```

### Herramientas Recomendadas

| Herramienta | Propósito |
|-------------|-----------|
| **Vitest** | Test runner (compatible con Vite) |
| **@testing-library/react** | Tests de componentes React |
| **jsdom** | DOM virtual para tests |

### Configuración

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

---

## IX.84 Tests Unitarios — Funciones Matemáticas

**Archivo:** `src/utils/math.test.ts`

```typescript
describe('clamp', () => {
  test('valor dentro de rango permanece igual', () => {
    expect(clamp(0.5)).toBe(0.5);
  });
  test('valor por debajo del mínimo se ajusta', () => {
    expect(clamp(-0.1)).toBe(0);
  });
  test('valor por encima del máximo se ajusta', () => {
    expect(clamp(1.5)).toBe(1);
  });
});

describe('gaussianRandom', () => {
  test('distribución tiene media ≈ 0', () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRandom());
    expect(Math.abs(mean(samples))).toBeLessThan(0.05);
  });
});

describe('wilsonCI', () => {
  test('proporción 0.5 con n=100', () => {
    const ci = wilsonCI(50, 100);
    expect(ci.p).toBeCloseTo(0.5, 2);
    expect(ci.lower).toBeLessThan(0.5);
    expect(ci.upper).toBeGreaterThan(0.5);
  });
});

describe('harmonicMean', () => {
  test('un valor bajo arrastra el resultado', () => {
    const result = harmonicMean([0.9, 0.9, 0.1, 0.9, 0.9, 0.9]);
    expect(result).toBeLessThan(0.5);
  });
});
```

---

## IX.85 Tests Unitarios — Core Engine

```typescript
describe('computeLogosAlignment', () => {
  test('estado default (0.5) produce Λ = 0.5', () => {
    const result = computeLogosAlignment(DEFAULT_STATE);
    expect(result.value).toBeCloseTo(0.5, 2);
  });
  test('Λ siempre ∈ [0, 1]', () => {
    for (let i = 0; i < 100; i++) {
      const randomState = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeLogosAlignment(randomState);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });
  test('suma de pesos = 1.0', () => {
    const result = computeLogosAlignment(DEFAULT_STATE);
    let totalWeight = 0;
    for (const group of Object.values(result.breakdown)) {
      for (const item of group.items) { totalWeight += item.weight; }
    }
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });
});

describe('computeFreeEnergy', () => {
  test('mayor Λ reduce F', () => {
    const F_low = computeFreeEnergy(DEFAULT_STATE, 0.2);
    const F_high = computeFreeEnergy(DEFAULT_STATE, 0.8);
    expect(F_high.value).toBeLessThan(F_low.value);
  });
});

describe('inhibitionPolicy', () => {
  test('Λ < 0.15 → PAUSA', () => {
    expect(inhibitionPolicy(0.10, 0.60, 0.30, 0.50).verdict).toBe('PAUSA');
  });
  test('condiciones óptimas → ACTÚA', () => {
    expect(inhibitionPolicy(0.60, 0.60, 0.30, 0.50).verdict).toBe('ACTÚA');
  });
  test('prioridad: PAUSA > ESPERA', () => {
    expect(inhibitionPolicy(0.10, 0.60, 0.60, 0.50).verdict).toBe('PAUSA');
  });
});
```

---

## IX.86 Tests de Integración

```typescript
describe('Pipeline completo', () => {
  test('estado default produce métricas coherentes', () => {
    const logos = computeLogosAlignment(DEFAULT_STATE);
    const lambda = logos.value;
    const V = computeViability(DEFAULT_STATE, lambda);
    const S = computeEntropy(DEFAULT_STATE, lambda);
    const C = computeCoherence(DEFAULT_STATE, lambda);
    const F = computeFreeEnergy(DEFAULT_STATE, lambda);
    const omega = computeOmega(lambda, V.value, S.value, C.coherence, F.value);
    const pi = inhibitionPolicy(lambda, V.value, S.value, C.coherence);

    expect(lambda).toBeGreaterThanOrEqual(0);
    expect(omega.value).toBeGreaterThanOrEqual(0);
    expect(Math.abs(omega.value - lambda)).toBeLessThan(0.3);
    expect(['MONITOREA', 'ESPERA', 'ACTÚA']).toContain(pi.verdict);
  });

  test('estado óptimo produce ACTÚA', () => {
    const optimalState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.85])
    ) as ConsciousnessState;
    const logos = computeLogosAlignment(optimalState);
    const V = computeViability(optimalState, logos.value);
    const S = computeEntropy(optimalState, logos.value);
    const C = computeCoherence(optimalState, logos.value);
    const pi = inhibitionPolicy(logos.value, V.value, S.value, C.coherence);
    expect(pi.verdict).toBe('ACTÚA');
  });

  test('estado colapsado produce PAUSA', () => {
    const collapsedState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.1])
    ) as ConsciousnessState;
    const logos = computeLogosAlignment(collapsedState);
    const V = computeViability(collapsedState, logos.value);
    const S = computeEntropy(collapsedState, logos.value);
    const C = computeCoherence(collapsedState, logos.value);
    const pi = inhibitionPolicy(logos.value, V.value, S.value, C.coherence);
    expect(pi.verdict).toBe('PAUSA');
  });
});
```

---

## IX.87 Casos Límite (Edge Cases)

```typescript
describe('Edge Cases', () => {
  test('todas las dimensiones en 0', () => {
    const zeroState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0])
    ) as ConsciousnessState;
    expect(computeLogosAlignment(zeroState).value).toBe(0);
  });

  test('todas las dimensiones en 1', () => {
    const maxState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 1])
    ) as ConsciousnessState;
    expect(computeLogosAlignment(maxState).value).toBe(1);
    expect(computeEntropy(maxState, 1).value).toBeLessThan(0.1);
  });

  test('un solo dominio colapsado reduce coherencia', () => {
    const state = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.8])
    ) as ConsciousnessState;
    (state as any).faith = 0.05;
    (state as any).meditation = 0.05;
    (state as any).service = 0.05;
    (state as any).presence = 0.05;
    const C = computeCoherence(state, computeLogosAlignment(state).value);
    expect(C.coherence).toBeLessThan(0.5);
  });
});
```

---

## IX.88 Validación de Rangos [0,1]

```typescript
describe('Validación de Rangos', () => {
  const N = 1000;
  test(`Λ, V, S, C, Ω ∈ [0,1] para ${N} estados aleatorios`, () => {
    for (let i = 0; i < N; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const L = computeLogosAlignment(state).value;
      const V = computeViability(state, L).value;
      const S = computeEntropy(state, L).value;
      const C = computeCoherence(state, L).coherence;
      const F = computeFreeEnergy(state, L).value;
      const O = computeOmega(L, V, S, C, F).value;
      expect(L).toBeGreaterThanOrEqual(0); expect(L).toBeLessThanOrEqual(1);
      expect(V).toBeGreaterThanOrEqual(0); expect(V).toBeLessThanOrEqual(1);
      expect(S).toBeGreaterThanOrEqual(0); expect(S).toBeLessThanOrEqual(1);
      expect(O).toBeGreaterThanOrEqual(0); expect(O).toBeLessThanOrEqual(1);
    }
  });
});
```

---

## IX.89 Tests de Regresión Monte Carlo

```typescript
describe('Monte Carlo — Regresión', () => {
  test('resultado tiene estructura correcta', () => {
    const result = runMonteCarlo(DEFAULT_STATE, 100, 10, 0.04);
    expect(result.N).toBe(100);
    expect(result.stats).toHaveLength(11);
    expect(result.verdictNames).toHaveLength(5);
  });

  test('probabilidades de veredicto suman ≈ 1', () => {
    const result = runMonteCarlo(DEFAULT_STATE, 1000, 10, 0.04);
    const last = result.stats[result.stats.length - 1];
    const sum = last.pPausa + last.pEspera + last.pReconecta + last.pMonitorea + last.pActua;
    expect(sum).toBeCloseTo(1.0, 2);
  });

  test('σ mayor produce mayor dispersión', () => {
    const r1 = runMonteCarlo(DEFAULT_STATE, 500, 10, 0.02);
    const r2 = runMonteCarlo(DEFAULT_STATE, 500, 10, 0.08);
    expect(r2.finalLamStd).toBeGreaterThan(r1.finalLamStd);
  });
});
```

---

## IX.90 Tests de Componentes React

```typescript
describe('App Component', () => {
  test('muestra login page cuando no hay usuario', () => {
    render(<App />);
    expect(screen.getByText('LOGOS')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });
});
```

---

## IX.91 Matriz de Cobertura

| Módulo | Funciones | Tests Unit | Tests Integración | Edge Cases |
|--------|-----------|-----------|-------------------|------------|
| `utils/math.ts` | 9 | 9/9 | — | Si |
| `core/logos.ts` | 2 | 2/2 | Si | Si |
| `core/friston.ts` | 1 | 1/1 | Si | Si |
| `core/levin.ts` | 3 | 3/3 | Si | Si |
| `core/watson.ts` | 1 | 1/1 | Si | Si |
| `core/hoffman.ts` | 1 | 1/1 | Si | Si |
| `core/penrose.ts` | 1 | 1/1 | Si | Si |
| `core/policy.ts` | 2 | 2/2 | Si | Si |
| `core/derived.ts` | 4 | 4/4 | Si | Si |
| `simulation/montecarlo.ts` | 2 | 2/2 | Si | Si |
| `hooks/useLogosEngine.ts` | 2 | — | Si | — |
| `App.jsx` | — | — | Si | — |
| **Total** | **28** | **26/28** | **12** | **8** |

### Comandos de Ejecución

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npx vitest                # Ejecutar todos los tests
npx vitest --coverage     # Con cobertura
npx vitest src/core/      # Solo tests de core
npx vitest --watch        # Watch mode
```

---

---

# PARTE XI — INTEGRACIÓN BIOMÉTRICA WEARABLE (FASE FUTURA)

> **Estado:** 📋 PROPUESTA — Fase posterior al deploy de LOGOS v3.0  
> **Origen:** Peer review del Paper PhD + Paper §9.2 Direction 15  
> **Objetivo:** Transformar LOGOS de un modelo de auto-reporte puro a un sistema **somáticamente anclado** con datos biométricos objetivos.

---

## XI.95 Motivación

El reviewer principal del paper PhD identificó correctamente que el mayor riesgo de LOGOS es **"amplitud sin profundidad empírica"**: 28/28 dimensiones son actualmente auto-reportadas. Los sesgos Hoffman detectan inconsistencias internas, pero no proveen validación externa.

La integración de Apple Watch / HealthKit resuelve esto al proveer **datos fisiológicos objetivos** que:
1. **Anclan** las dimensiones subjetivas con mediciones reales
2. **Calibran** los parámetros del modelo (σ², ε, α, β) con señales fisiológicas
3. **Rompen** la circularidad epistemológica del auto-reporte
4. **Detectan** discrepancias entre percepción y realidad (nuevo tipo de sesgo Hoffman)

---

## XI.96 Mapeo de Sensores Apple Watch → Dimensiones LOGOS

| Sensor Apple Watch | API HealthKit | Dimensión LOGOS | Mecanismo de Anclaje |
|---|---|---|---|
| **Acelerómetro + Giroscopio** | `HKQuantityTypeIdentifierStepCount`, `HKQuantityTypeIdentifierActiveEnergyBurned` | `exercise` | Pasos + kcal activas → score objetivo de movimiento |
| **PPG (Fotopletismografía)** | `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` | `peace`, tono vagal | HRV (SDNN) → correlato directo de regulación emocional (Porges, 2018) |
| **PPG continuo** | `HKQuantityTypeIdentifierRestingHeartRate` | `energy` | FC reposo alta = estrés / baja fitness |
| **Acelerómetro nocturno** | `HKCategoryTypeIdentifierSleepAnalysis` | `sleep` | Deep/REM/Light/Awake → calidad objetiva de sueño |
| **SpO₂ (Oxímetro)** | `HKQuantityTypeIdentifierOxygenSaturation` | `energy` | SpO₂ < 95% → energía comprometida |
| **Respiración** | `HKQuantityTypeIdentifierRespiratoryRate` | `breath` | FR alta (>18/min) = activación simpática |
| **ECG (Serie 4+)** | `HKElectrocardiogramType` | Coherencia cardíaca | Arritmias → señal Levin potencial |
| **Mindful Minutes** | `HKCategoryTypeIdentifierMindfulSession` | `meditation`, `presence` | Verificación objetiva de práctica contemplativa |
| **Ruido ambiental** | `HKQuantityTypeIdentifierEnvironmentalAudioExposure` | `food_harmony` | Nivel de ruido durante comidas → armonía alimentaria |
| **Temperatura de muñeca** | `HKQuantityTypeIdentifierAppleWalkingSteadiness` | `gut_resonance` (indirecto) | Variabilidad circadiana → proxy de inflamación sistémica |

### Extensiones futuras (dispositivos adicionales)

| Dispositivo | Dimensión | Mecanismo |
|---|---|---|
| **CGM (Monitor Glucosa Continuo)** | `energy`, `nourishment` | Variabilidad glucémica → calidad alimentaria objetiva |
| **Oura Ring** | `sleep` (superior), HRV nocturno | Resolución de sueño más fina que Apple Watch |
| **Calprotectina fecal (test kit)** | `gut_resonance` | Marcador directo de inflamación intestinal |
| **CRP de alta sensibilidad** | Neuroinflamación | Calibración de ε₂ en modelo de entropía inversa |

---

## XI.97 Arquitectura de Fusión: Kalman Filter Layer

La capa de fusión combina datos subjetivos (sliders) con datos objetivos (biométricos) usando un **filtro de Kalman adaptativo**:

```
x_fused(t) = α_trust · x_biometric(t) + (1 - α_trust) · x_slider(t)

donde:
  α_trust ∈ [0, 1] = coeficiente de confianza biométrica
  α_trust(0) = 0.3  (inicio: más peso al usuario)
  α_trust(t) = α_trust(t-1) + η · |x_bio - x_slider|  
    (si discrepancia alta y consistente → confiar más en biométrico)
```

### Esquema de Actualización

```mermaid
flowchart TD
    AW["Apple Watch<br/>HealthKit Data"] --> Sync["Sincronización<br/>(background, cada 15min)"]
    User["Usuario<br/>Sliders manuales"] --> State["ConsciousnessState<br/>x_slider ∈ [0,1]²⁸"]
    Sync --> Bio["x_biometric<br/>(dimensiones anclables)"]
    State --> KF["Kalman Filter<br/>Fusion Layer"]
    Bio --> KF
    KF --> Fused["x_fused<br/>Estado fusionado"]
    Fused --> Engine["Motor 7 capas<br/>Λ, V, S, C, F, Ω, Q, π"]
    
    Bio -->|"discrepancia alta"| HB["Nuevo sesgo Hoffman:<br/>CEGUERA SOMÁTICA"]
```

### Nuevo Sesgo Hoffman: CEGUERA SOMÁTICA

```typescript
// FUTURE: Somatic Blindness — Self-report contradicts biometric data
if (Math.abs(state_slider.sleep - state_bio.sleep) > 0.30 && state_bio.sleep < 0.40) {
  biases.push({
    type: "CEGUERA SOMÁTICA",
    biasKey: "somaticBlindness",
    desc: "Tu percepción de sueño (slider) difiere significativamente de lo que tu cuerpo registró. " +
          "Tu Apple Watch muestra solo " + (state_bio.sleep * 8).toFixed(1) + "h de sueño efectivo.",
    correction: "La interfaz perceptual te dice 'dormí bien' pero tu cuerpo dice otra cosa. " +
                "Confía en los datos. Prioriza higiene del sueño esta noche.",
    logosLink: "Este es el fitness icon más peligroso: creer que descansaste cuando no lo hiciste. " +
               "El Logos habla a través de tu cuerpo — escúchalo."
  });
}
```

---

## XI.98 Implementación Técnica

### Stack Propuesto

| Componente | Tecnología | Descripción |
|---|---|---|
| **App nativa iOS** | Swift + SwiftUI | Requerida para acceso a HealthKit |
| **HealthKit Framework** | `import HealthKit` | API nativa de Apple para datos de salud |
| **Background Delivery** | `HKObserverQuery` | Sincronización en segundo plano |
| **API Bridge** | REST → Backend LOGOS | POST /api/biometrics con datos agregados |
| **Kalman Filter** | TypeScript (core/) | Nueva capa `src/core/biometric.ts` |
| **Almacenamiento** | PostgreSQL + tabla `biometric_snapshots` | Histórico de datos biométricos |

### Nuevo archivo: `src/core/biometric.ts`

```typescript
/**
 * LOGOI LAB - Biometric Fusion Layer
 * Kalman filter for subjective-objective data fusion
 * Phase: FUTURE (post LOGOS v3.0 deploy)
 */

interface BiometricData {
  sleep_deep_hours: number;      // → sleep
  sleep_rem_hours: number;       // → sleep  
  hrv_sdnn: number;              // → peace (normalized)
  resting_hr: number;            // → energy (inverse normalized)
  spo2: number;                  // → energy
  steps: number;                 // → exercise
  active_kcal: number;           // → exercise
  respiratory_rate: number;      // → breath (inverse normalized)
  mindful_minutes: number;       // → meditation, presence
  noise_db_meals: number;        // → food_harmony (inverse)
}

// Normalization functions: raw sensor → [0,1]
const NORMALIZERS = {
  sleep: (deep: number, rem: number) => clamp((deep + rem) / 3.5),  // 3.5h ideal
  peace_hrv: (sdnn: number) => clamp((sdnn - 15) / 85),  // 15ms=low, 100ms=excellent
  energy_hr: (hr: number) => clamp(1 - (hr - 45) / 55),  // 45bpm=athlete, 100bpm=stressed
  energy_spo2: (spo2: number) => clamp((spo2 - 88) / 12),  // 88%=critical, 100%=perfect
  exercise: (steps: number, kcal: number) => clamp((steps / 10000 + kcal / 500) / 2),
  breath: (rr: number) => clamp(1 - (rr - 10) / 15),  // 10/min=calm, 25/min=stressed
  meditation: (mins: number) => clamp(mins / 20),  // 20min = full score
  food_harmony_noise: (db: number) => clamp(1 - (db - 40) / 40),  // 40dB=quiet, 80dB=loud
};

export function fuseBiometricData(
  sliderState: ConsciousnessState,
  bioData: BiometricData,
  trustCoeff: number = 0.3
): { fusedState: ConsciousnessState, discrepancies: string[] } {
  // ... Kalman fusion logic
}
```

### Esquema de Base de Datos

```sql
CREATE TABLE biometric_snapshots (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  captured_at TIMESTAMPTZ NOT NULL,
  source VARCHAR(20) DEFAULT 'apple_watch',
  -- Raw sensor data
  sleep_deep_min INTEGER,
  sleep_rem_min INTEGER,
  sleep_light_min INTEGER,
  hrv_sdnn REAL,
  resting_hr REAL,
  spo2 REAL,
  steps INTEGER,
  active_kcal REAL,
  respiratory_rate REAL,
  mindful_minutes INTEGER,
  noise_db_avg REAL,
  -- Computed normalized values
  bio_sleep REAL,      -- normalized [0,1]
  bio_peace REAL,
  bio_energy REAL,
  bio_exercise REAL,
  bio_breath REAL,
  bio_meditation REAL,
  -- Fusion metadata
  trust_coefficient REAL DEFAULT 0.3,
  discrepancy_flags JSONB DEFAULT '[]'
);

CREATE INDEX idx_bio_user_date ON biometric_snapshots(user_id, captured_at DESC);
```

---

## XI.99 Plan de Implementación

| Fase | Duración | Entregable | Dependencia |
|------|----------|------------|-------------|
| **5.1** | 1 semana | App iOS mínima con HealthKit permisos + lectura de datos | Apple Developer Account |
| **5.2** | 1 semana | API endpoint POST /api/biometrics + tabla PostgreSQL | Backend v3.0 desplegado |
| **5.3** | 1 semana | Kalman filter en `biometric.ts` + integración con motor | Core v3.0 estable |
| **5.4** | 1 semana | UI: indicadores de fuente (📱 slider vs ⌚ biométrico) | Frontend v3.0 estable |
| **5.5** | 2 semanas | Piloto N=10, 30 días: calibrar α_trust, validar normalizers | Usuarios con Apple Watch |
| **5.6** | 1 semana | Sesgo CEGUERA SOMÁTICA + dashboards de discrepancia | Piloto completado |
| **Total** | **~7 semanas** | LOGOS v3.1 con anclaje biométrico | |

### Prioridad de Sensores (orden de implementación)

1. **Sueño** (sleep) — Mayor impacto, mejor medición objetiva, discrepancia auto-reporte más alta
2. **HRV** (peace) — Correlato directo del tono vagal y regulación emocional
3. **Actividad** (exercise) — Fácil de normalizar, alta adopción
4. **Mindful Minutes** (meditation) — Verificación binaria de práctica
5. **Respiración** (breath) — Complementa la nueva dimensión v3.0
6. **SpO₂** (energy) — Complementario a HRV
7. **Ruido ambiental** (food_harmony) — Innovador pero menos crítico

---

## XI.100 Impacto en el Modelo Matemático

La integración biométrica permite:

1. **Calibración empírica de σ²:** En vez de σ² = 0.04 fijo para todas las dimensiones, calibrar σ²_sleep, σ²_peace, etc. desde la varianza real observada en datos biométricos longitudinales.

2. **Calibración de ε₁–ε₅:** Con datos de HRV (vagal), sueño (HPA), y potencialmente CGM (dysbiosis proxy), es posible ejecutar el protocolo de calibración propuesto en el Paper §9.2 Direction 13.

3. **Validación del factor (1−Λ):** Con datos longitudinales objetivos, se puede testear empíricamente si (1−Λ), (1−C), S(x), o (1−Ω) produce la mejor predicción de vulnerabilidad a entropía dietética (Paper §9.2 Direction 14).

4. **Ruptura de circularidad epistemológica:** El auto-reporte crea un sistema cerrado donde el sesgo del usuario se reproduce. Los datos biométricos introducen una **señal externa** que rompe el ciclo, moviendo LOGOS de un modelo fenomenológico a un modelo **mixto fenomenológico-fisiológico**.

> *"El cuerpo no miente. Cuando el Apple Watch contradice al slider, el Logos está hablando a través de los datos."*

---

---

# PARTE X — CHANGELOG

---

## X.92 Convenciones de Versionamiento

Este proyecto sigue **Semantic Versioning 2.0.0**:

- **MAJOR** (X.0.0): Cambios incompatibles en la API o modelo matemático
- **MINOR** (0.X.0): Funcionalidad nueva compatible hacia atrás
- **PATCH** (0.0.X): Correcciones de bugs compatibles hacia atrás

---

## X.93 Versiones

### [3.1.0] — 2026-02-10

#### Agregado (Minor — Lambda Jerárquico / Hierarchical Lambda)
- **Λ(x) = Λ_señal × Φ_canal** — Modelo Shannon: contenido de señal (12 dims) × calidad del canal (16 dims)
- **Φ_canal** = 1 − γ·(1 − x̄_soporte), donde γ = 0.25, Φ ∈ [0.75, 1.0]
- **4 grupos de soporte canal:** Somático (α=0.30), Emocional (α=0.30), Cognitivo (α=0.15), Encarnación (α=0.25)
- **Corolario 1.1 restaurado:** ∂Λ/∂xᵢ > 0 para TODAS las 28 dimensiones
- **UI:** Panel de detalle Λ muestra Φ_canal con breakdown de grupos
- **E(x):** Regla del producto: Λ̇ = Λ̇_signal·Φ + Λ_signal·Φ̇ (los 7 dominios contribuyen)
- **EmergenceSwarmAnimation:** computeScenarioLambda incluye modulación de canal
- **iOS/Watch Engine.swift:** computeChannelPhi() + Hierarchical Lambda
- **10 nuevos tests de canal** (719/719 total passing)

#### Cambiado
- **Λ neutral (todos 0.5):** 0.50 → 0.4375 (= 0.5 × 0.875)
- **Pesos de señal corregidos:** faith 0.17 (era 0.18), meditation 0.13 (era 0.14), compassion 0.08 (era 0.07), wisdom 0.08 (era 0.07)
- **logos-backend:** metrics-engine.js y logos-model.md actualizados con Hierarchical Lambda
- **i18n (es/en):** Todas las descripciones de Λ actualizadas a fórmula jerárquica

---

### [3.0.0] — 2026-02-07

#### Agregado (Major — Alimento Sagrado + Teología Informacional + Entropía Inversa)
- **7º Dominio: Alimento Sagrado** — 4 nuevas dimensiones: `nourishment`, `taste_presence`, `food_harmony`, `gut_resonance` (RFC-003)
- **Nueva dimensión `breath`** en Physical (reemplaza `nutrition`, que migra a Alimento como `nourishment`)
- **28 dimensiones × 7 dominios** (antes 24 × 6)
- **3 nuevas señales Levin:** Disbiosis Entérica (0.70), Adaptación Hedónica Alimentaria (0.60), Intoxicación Entrópica (0.90)
- **3 nuevos sesgos Hoffman:** Hedonismo Gustativo, Ascetismo Desconectado, Nihilismo Somático
- **R(x) — Resonancia Nutricional:** Nueva métrica derivada con fallback geométrico y formulación angular (SINTONÍA)
- **`src/core/resonance.ts`:** Nuevo archivo — operador de resonancia con Circumplex V-A
- **Teología Informacional:** Pipeline LOGOS ≅ sistema de comunicación de Shannon (Proposición 5)
- **Entropía Alimentaria Inversa:** ΔS_tóxico = Σγ·pathway·(1-Λ), validada con 25+ refs peer-reviewed
- **Factores de entropía:** 10 → 12 (+gut_resonance, +nourishment)
- **Ecuación unificada:** E(x) = Λ(x) · (1 + α·HI/100) · (1 + β·R(x)) / E_max
- **Paper PhD validado:** 11 contribuciones novedosas, 45 referencias Harvard, ~12,500 palabras

#### Cambiado
- **Λ(x):** 10 → 12 dimensiones ponderadas (+ taste_presence 0.05, food_harmony 0.03; pesos rebalanceados)
- **V(x):** 24 → 28 pesos de viabilidad redistribuidos
- **S(x):** 10 → 12 factores entrópicos
- **F(x):** 24 → 28 ideales y pesos
- **Watson:** 6 → 7 dominios en paisaje energético
- **Penrose:** 6 → 7 dominios en media armónica (+ ε-floor)
- **Levin:** 6 → 9 señales patológicas
- **Hoffman:** 5 → 8 sesgos perceptuales

---

### [2.2.0] — 2026-02-06

#### Agregado (Major — Supabase + Multi-Canal + Identidad Unificada)
- **Supabase Auth:** Google + Apple OAuth via Supabase, JWT persistent sessions
- **Recolección de Teléfono:** Pantalla obligatoria post-OAuth con validación
- **WhatsApp Opt-In:** Pantalla informativa con link wa.me/19788012275
- **Persistencia de Estado Actual:** 28 params guardados en `profiles.last_state` (debounced 2s)
- **Identidad Cross-Channel:** Teléfono como ID universal (web ↔ WhatsApp ↔ SMS ↔ Voz)
- **Backend OpenAI Agents SDK:** Agente ΛOGOS con 12 tools custom
- **Supabase PostgreSQL:** 6 tablas (profiles, channel_users, sessions, conversations, conversation_log, daily_snapshots)
- **Frontend supabase.js:** Servicio centralizado (auth, DB queries)

#### Cambiado
- **Auth Flow:** 4 pantallas (Login → Phone → WhatsApp Opt-In → App)
- **App.jsx:** Reescrito para Supabase Auth
- **api.js:** Reescrito para usar Supabase client
- **Deploy Frontend:** `/opt/logoilab/static/` → `/opt/logoilab/frontend/dist/`
- **Deploy Backend:** Nuevo servicio systemd `logos-backend` port 3100
- **NGINX:** Nuevas rutas `/webhook/` y `/media-stream`

#### Corregido
- **Sesiones perdidas:** JWT persistente reemplaza sessionStorage volátil
- **Conversaciones perdidas:** conversationId persistido en DB
- **Estado perdido:** Parámetros persisten entre sesiones

---

### [2.1.0] — 2026-02-06

#### Cambiado
- **Renombrado:** "LOGOS HUMANO" → "LOGOS" en login page y header
- **Deployment:** Migración de Docker a NGINX estático directo
- **Autenticación:** `handleLogout` limpia `sessionStorage` y fuerza reload

#### Agregado
- **Google OAuth:** Integración completa con Google Sign-In
- **Guest Login:** Opción de acceso como invitado con persistencia en `sessionStorage`
- **syncUser:** Sincronización con backend PostgreSQL vía `/api/auth/sync`
- **API Client:** `src/services/api.js` con funciones para auth, sessions, reports
- **Session Persistence:** Estado de usuario y token en `sessionStorage`

#### Corregido
- **Logout:** Funciona correctamente (limpia session + reload)
- **Logo:** Cambiado de `logo.png` importado a `/logo.svg` estático
- **Cache:** Headers `no-cache` en NGINX
- **Docker conflicts:** Docker apagado

---

### [2.0.0] — 2026-01-15

#### Cambiado (Breaking)
- **Arquitectura fundamental:** Λ es ahora el ATRACTOR FUNDAMENTAL (Ω = f(Λ))
- **Refactorización completa:** Monolito → arquitectura modular (`src/core/`, `src/simulation/`, `src/domain/`, `src/types/`, `src/utils/`, `src/hooks/`)

#### Agregado
- **Layer 7: Logos** — Cómputo de Λ(x) con 4 grupos de componentes
- **Atractores duales:** A⁺ y A⁻ con detección automática
- **Meta-política π²(x):** Evaluación de patrones sistémicos
- **Modulación Λ:** V (+35%), S (-40%), C (+40%), F (-30%)
- **MetricDetailPanel:** Panel de detalle con fórmulas y desglose
- **TypeScript types:** Interfaces completas
- **useLogosEngine / useConsciousnessState hooks**
- **Onboarding:** Guía interactiva de 12 pasos
- **Agente de voz:** Integración ElevenLabs
- **Session Tracker:** Tracking de sesiones con snapshots

#### Deprecado
- Cómputo de Ω independiente de Λ
- Política de inhibición sin Λ̇
- Coherencia por media aritmética

---

### [1.0.0] — 2025-10-01

#### Agregado (Release Inicial)
- **6 dominios × 4 dimensiones = 24 dimensiones** de consciencia
- **Métricas:** V, S, C, F, Ω
- **5 capas científicas:** Friston, Levin, Watson, Hoffman, Penrose
- **Política de inhibición π(x):** PAUSA, ESPERA, MONITOREA, ACTÚA
- **Monte Carlo:** Simulación estocástica
- **Dashboard React** con 6 pestañas
- **Recharts** para visualización
- **Stack:** React 18 + Vite 5 + TypeScript 5.3

---

## X.94 Roadmap

### [2.3.0] — Planificado (i18n + Multilingual)
- [ ] Phase 1: react-i18next infrastructure + JSON translation files (ES + EN)
- [ ] Phase 2: Extract frontend strings (App.jsx, constants.ts, LogosHumano.jsx)
- [ ] Phase 3: Backend locale (agent prompts, WhatsApp language detection)
- [ ] Phase 4: ElevenLabs multilingual voice
- [ ] profiles.locale column for user language preference

### [2.4.0] — Planificado
- [ ] Google Calendar integration (currently stores in conversation_log)
- [ ] Daily snapshots automáticos
- [ ] Notificaciones push para check-in diario
- [ ] Export de datos en CSV/PDF
- [ ] Reportes longitudinales mejorados

### [3.0.0] — Planificado
- [ ] Web Workers para Monte Carlo
- [ ] PWA con offline support
- [ ] Modo colaborativo (terapeuta/coach)
- [ ] API pública para integraciones externas
- [ ] Machine Learning: predicción de Λ basada en historial
- [ ] Visualización "ΛOGOS Resonance" (arte generativo interactivo)

---

---

# PARTE XII — ESTRATEGIA DE IMPLEMENTACIÓN INTEGRAL

> **Auditoría completa del ecosistema LOGOS realizada el 2026-02-08.**  
> Revisión 100% de archivos, modelos, ecuaciones, agentes y comunicaciones omnicanal.  
> Principio rector: toda actualización es **aditiva, constructiva, acumulativa y no destructiva**.

---

## XII.101 Resumen Ejecutivo de la Auditoría

Se auditaron **3 proyectos**, **~60 archivos**, **7 capas de cómputo**, **2 agentes de IA**, **4 canales de comunicación** y **3 motores de métricas**.

| Componente | Estado | Archivos | Observación |
|-----------|--------|----------|-------------|
| **Frontend React** | ✅ Producción | 25+ | Desplegado en logoilab.com |
| **Core Engine (TypeScript)** | ✅ Completo | 9 módulos | 7 capas + alimento.ts |
| **API Backend (logos/api/)** | ✅ Producción | 6 archivos | Express+PostgreSQL en M5 |
| **Multi-Channel Backend (logos-backend/)** | ⚠️ Desarrollo | 16 archivos | Falta despliegue |
| **ElevenLabs Voice Agent** | ✅ Integrado | Frontend | clientTools funcionales |
| **OpenAI Agents SDK** | ✅ Implementado | logos-backend | 12 herramientas |
| **WhatsApp (Twilio)** | ✅ Funcional | 2 implementaciones | api/ + logos-backend/ |
| **SMS (Twilio)** | ✅ Implementado | logos-backend | Quick check-in numérico |
| **Voz (Twilio↔ElevenLabs)** | ✅ Implementado | logos-backend | Bridge WebSocket audio |
| **i18n Frontend** | ✅ ES+EN | 3 archivos | react-i18next configurado |
| **i18n Backend** | ❌ Pendiente | — | Agentes solo en español |
| **Testing** | ❌ Pendiente | 0 archivos | Sin tests unitarios ni integración |
| **Módulo Alimento** | ⚠️ Parcial | 1 archivo | Core listo, sin integración UI/backend |

---

## XII.102 Inventario Completo del Ecosistema

### XII.102.1 Frontend — `logos/src/`

| Directorio | Archivo | Función | Líneas |
|-----------|---------|---------|--------|
| `core/` | `logos.ts` | Λ(x) — Logos Alignment (Layer 7) | ~132 |
| `core/` | `friston.ts` | F(x) — Free Energy (Layer 1) | ~73 |
| `core/` | `levin.ts` | Señales bioeléctricas (Layer 2) | ~130 |
| `core/` | `watson.ts` | Energy Landscape (Layer 3) | ~66 |
| `core/` | `hoffman.ts` | Interface Theory (Layer 4) | ~83 |
| `core/` | `penrose.ts` | Quantum Coherence (Layer 5) | ~62 |
| `core/` | `policy.ts` | π(x) + π²(x) (Layer 6) | ~160 |
| `core/` | `derived.ts` | V, S, Ω, Q derivadas | ~151 |
| `core/` | `alimento.ts` | Alimento Sagrado engine | ~660 |
| `core/` | `index.ts` | Barrel exports | ~63 |
| `types/` | `index.ts` | Interfaces TypeScript completas | ~255 |
| `domain/` | `constants.ts` | 6 dominios, 24 dims, colores, fonts | ~142 |
| `simulation/` | `montecarlo.ts` | Monte Carlo N=10,000 | ~220 |
| `utils/` | `math.ts` | Utilidades estadísticas | ~97 |
| `hooks/` | `useLogosEngine.ts` | Orquestador 7 capas → React | ~251 |
| `services/` | `api.js` | Cliente API Supabase | ~149 |
| `services/` | `supabase.js` | Auth + datos + Calendar | ~178 |
| `config/` | `logosAgent.js` | Config ElevenLabs Voice Agent | ~54 |
| `i18n/` | `index.js` | Configuración i18next | ~49 |
| `i18n/locales/` | `es.json` | Traducciones español | ~1124 |
| `i18n/locales/` | `en.json` | Traducciones inglés | ~501 |
| `components/` | `LogosHumano.jsx` | Dashboard principal | ~2347 |
| `components/` | `LogosVoiceAgent.jsx` | Agente de voz ElevenLabs | ~495 |
| `components/` | `SessionTracker.jsx` | Tracking longitudinal | ~642 |
| `components/` | `TheoryManual.jsx` | Manual teórico interactivo | — |
| `components/` | `IFCModel.jsx` | Modelo IFC visual | — |
| `App.jsx` | — | Auth + routing + flujo principal | ~405 |

### XII.102.2 Backend API — `logos/api/`

| Archivo | Función | Notas |
|---------|---------|-------|
| `server.js` | Express + PostgreSQL principal | En producción en M5 |
| `db/pool.js` | Pool de conexiones PostgreSQL | — |
| `db/init.sql` | Schema: users, sessions, daily_snapshots | — |
| `db/migrate_whatsapp.sql` | Schema: whatsapp_users | — |
| `services/logos-engine.js` | Motor de métricas SIMPLIFICADO | ⚠️ No idéntico al frontend |
| `services/whatsapp.js` | Servicio Twilio WhatsApp | 6 preguntas por dominio |
| `routes/whatsapp.js` | Webhook + flujo conversacional | Check-in + cross-channel |

### XII.102.3 Backend Multi-Channel — `logos-backend/`

| Archivo | Función | Notas |
|---------|---------|-------|
| `server.js` | Entry point HTTP + WebSocket | 5 canales |
| `src/config/env.js` | Variables de entorno | — |
| `src/config/logos-model.js` | 24 vars, pesos, umbrales (= frontend) | ✅ Paridad exacta |
| `src/services/metrics-engine.js` | Pipeline completo 7 capas | ✅ Port exacto del frontend |
| `src/services/elevenlabs.js` | Text WS + Voice Bridge | 2 modos |
| `src/services/logos-agent.mjs` | OpenAI Agents SDK — 12 tools | gpt-4o |
| `src/services/logos-agent-wrapper.js` | Wrapper CommonJS→ESM | — |
| `src/services/domain-tracker.js` | Zoom-out protocol | Keywords ES+EN |
| `src/services/twilio-service.js` | Helpers WhatsApp/SMS | — |
| `src/services/openai-chat.js` | Chat fallback | — |
| `src/db/postgres.js` | CRUD PostgreSQL completo | Unified state bidirectional |
| `src/db/migrate.sql` | channel_users, conversation_log | — |
| `src/routes/webhook-whatsapp.js` | WhatsApp texto → OpenAI Agent | Dedup + zoom-out |
| `src/routes/webhook-voice.js` | Voz TwiML → Media Stream | PSTN + WhatsApp |
| `src/routes/webhook-sms.js` | SMS quick check-in | 1-10 numérico |
| `src/routes/media-stream.js` | WebSocket audio bridge | Twilio ↔ ElevenLabs |
| `src/routes/api-user.js` | REST API: state, metrics, history | 6 endpoints |
| `src/utils/logger.js` | Winston logger | — |
| `src/utils/session-manager.js` | Historial in-memory | — |
| `src/knowledge/logos-model.md` | Knowledge base del agente | — |

### XII.102.4 Agentes de IA

**ElevenLabs Conversational AI (Frontend):**
- `agentId` configurado en `logosAgent.js`
- 10+ `clientTools`: getFullState, getMetrics, getVerdict, setSliderValue, navigateToTab, highlightDomain, triggerSimulation, scheduleCalendarEvent, getSessionReport, etc.
- Integración visual: orbe flotante con estados de conversación

**OpenAI Agents SDK (logos-backend):**
- Modelo: `gpt-4o`
- 12 herramientas: compute_metrics, detect_levin_signals, detect_hoffman_biases, get_user_state, update_user_state, link_account, get_session_history, evaluate_decision, detect_crisis, run_simulation, schedule_calendar_event, generate_weekly_report
- Conversación persistente via OpenAI Conversations API
- Contexto inyectado automáticamente (estado + métricas + perfil)

### XII.102.5 Comunicaciones Omnicanal

| Canal | Implementación | Backend | Estado |
|-------|---------------|---------|--------|
| **Web (logoilab.com)** | React SPA + Supabase Auth | logos/api/ | ✅ Producción |
| **WhatsApp Texto** | Twilio → webhook → OpenAI Agent | logos-backend/ | ✅ Implementado |
| **WhatsApp Texto (legacy)** | Twilio → webhook → check-in guiado | logos/api/ | ✅ Producción |
| **WhatsApp Voz** | Twilio Media Stream → ElevenLabs | logos-backend/ | ✅ Implementado |
| **PSTN Voz** | Twilio → TwiML → Media Stream | logos-backend/ | ✅ Implementado |
| **SMS** | Twilio → quick numeric check-in | logos-backend/ | ✅ Implementado |
| **Voice Agent (Web)** | ElevenLabs ConvAI Widget | Frontend | ✅ Producción |

---

## XII.103 Análisis de Brechas (Gap Analysis)

### BRECHA 1: Triple Motor de Métricas — Riesgo de Divergencia

Existen **3 motores de cálculo** que deben mantener paridad:

| Motor | Ubicación | Fidelidad | Riesgo |
|-------|-----------|-----------|--------|
| **Frontend (TypeScript)** | `src/core/*.ts` | REFERENCIA | — |
| **API Simplificado** | `api/services/logos-engine.js` | ⚠️ SIMPLIFICADO | Fórmulas de V, S, C difieren |
| **Backend Full Port** | `logos-backend/src/services/metrics-engine.js` | ✅ EXACTO | Bajo |

**Impacto:** Un usuario que evalúe por WhatsApp (api/) vs Web obtiene métricas ligeramente diferentes.

**Acción requerida:** Unificar `api/services/logos-engine.js` con las fórmulas exactas del frontend, o migrar api/ a usar logos-backend/.

### BRECHA 2: Módulo Alimento — Implementado pero No Integrado

`alimento.ts` existe en `src/core/` con ~660 líneas funcionales, pero:
- ❌ NO conectado a `useLogosEngine.ts`
- ❌ NO expuesto en UI (`LogosHumano.jsx`)
- ❌ NO portado a ningún backend
- ❌ NO incluido en herramientas del agente OpenAI
- ❌ NO incluido en flujo WhatsApp
- ❌ NO incluido en ElevenLabs Voice Agent clientTools

### BRECHA 3: Dos Backends Activos — Arquitectura Dual

| Aspecto | logos/api/ | logos-backend/ |
|---------|-----------|----------------|
| Motor | Simplificado | Full port |
| Agente | Sin agente IA | OpenAI Agents SDK (12 tools) |
| WhatsApp | Check-in guiado (6 preguntas) | Conversacional libre |
| Voz | No | Sí (ElevenLabs bridge) |
| SMS | No | Sí |
| DB | PostgreSQL (M5) | PostgreSQL (M5) — misma DB |
| Estado | ✅ Producción | ⚠️ Sin desplegar |

**Decisión arquitectónica necesaria:** logos-backend/ es el sucesor natural de logos/api/ para canales omnicanal, pero logos/api/ maneja el backend web (auth sync, sessions, reports). **Recomendación: coexistencia con consolidación gradual.**

### BRECHA 4: i18n Backend Incompleto

| Componente | Español | Inglés | Otros |
|-----------|---------|--------|-------|
| Frontend UI | ✅ | ✅ | — |
| Frontend core (labels, recomendaciones) | ✅ | ✅ | — |
| api/ WhatsApp preguntas | ✅ | ❌ | ❌ |
| api/ logos-engine mensajes | ✅ | ❌ | ❌ |
| logos-backend/ system instructions | ✅ | ❌ | ❌ |
| logos-backend/ domain-tracker keywords | ✅ | ✅ | ❌ |
| logos-backend/ WhatsApp responses | ✅ | ❌ | ❌ |
| OpenAI Agent tools (descriptions) | ✅ | ❌ | ❌ |
| ElevenLabs Voice Agent | ✅ | ❌ | ❌ |

### BRECHA 5: Testing — Zero Cobertura

- 0 archivos de test en todo el ecosistema
- PARTE IX del Documento Maestro define estrategia pero sin implementación
- Funciones matemáticas críticas sin validación automatizada
- No hay CI/CD pipeline

### BRECHA 6: Esquema de Base de Datos — Inconsistencias

- `conversations` tabla referenciada en `postgres.js` pero no en `migrate.sql`
- `users.last_state` referenciado en `postgres.js` pero no en `init.sql`
- `channel_users.email` agregado en migrate.sql pero no en init.sql original
- Sin migraciones versionadas (solo scripts SQL manuales)

### BRECHA 7: Seguridad

- ❌ Sin rate limiting en endpoints API
- ❌ Sin autenticación en logos-backend REST API (`/api/user/*`)
- ❌ Sin validación de firma Twilio en webhooks
- ❌ Sin sanitización de input en mensajes WhatsApp
- ✅ CORS configurado correctamente
- ✅ Helmet en api/server.js
- ✅ API keys en variables de entorno

### BRECHA 8: Monitoreo y Observabilidad

- ✅ Winston logger en logos-backend
- ❌ Sin error tracking (Sentry, etc.)
- ❌ Sin health monitoring / alerting
- ❌ Sin métricas de performance (latencia, throughput)
- ❌ Sin dashboard de operaciones

### BRECHA 9: Funcionalidades Propuestas No Implementadas

| Funcionalidad | Documento | Estado |
|--------------|-----------|--------|
| 7° Dominio Alimento (28 dims) | PROPUESTA_ALIMENTO_SAGRADO_v3.md | Propuesta — sin implementar |
| Apple Watch / HealthKit | PARTE XI DOCUMENTO_MAESTRO | Documentado — fase futura |
| Google Calendar completo | Parcial en conversation_log | Placeholder — sin OAuth Calendar |
| Daily snapshots automáticos | Roadmap X.94 | No implementado |
| Push notifications | Roadmap X.94 | No implementado |
| Export CSV/PDF | Roadmap X.94 | No implementado |
| PWA offline | Roadmap X.94 | No implementado |
| Web Workers Monte Carlo | Roadmap X.94 | No implementado |

---

## XII.104 Estrategia de Implementación por Fases

> **Principios rectores:**
> 1. Aditivo y no destructivo — nunca romper lo que funciona
> 2. Multi-idioma compliant — todo nuevo código soporta ES+EN mínimo
> 3. Paridad de motor — un solo cálculo, múltiples consumidores
> 4. Test-first — cada fase incluye tests de validación
> 5. Incremental deployment — cada fase es independientemente desplegable

### FASE 0 — Estabilización y Testing (Semanas 1-2)

**Objetivo:** Crear la base de calidad que garantiza que cambios futuros no rompen funcionalidad existente.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 0.1 | Crear suite de tests unitarios para `src/core/*.ts` (7 capas) | CRÍTICA | 3 días |
| 0.2 | Crear tests de paridad: frontend vs logos-backend metrics-engine | CRÍTICA | 1 día |
| 0.3 | Validar rangos [0,1] para todas las funciones con edge cases | ALTA | 1 día |
| 0.4 | Tests para `alimento.ts` (recomendaciones, armonía, predicción) | ALTA | 1 día |
| 0.5 | Test de integración: flujo WhatsApp completo (mock Twilio) | MEDIA | 2 días |
| 0.6 | Configurar Vitest/Jest con coverage report | ALTA | 0.5 día |
| 0.7 | Documentar scripts de test en README | BAJA | 0.5 día |

### FASE 1 — Despliegue logos-backend (Semana 3)

**Objetivo:** Activar el backend multi-canal completo en producción.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 1.1 | Crear `.env` de producción en M5 | CRÍTICA | 0.5 día |
| 1.2 | Ejecutar migraciones SQL en M5 (channel_users, conversation_log, conversations) | CRÍTICA | 0.5 día |
| 1.3 | Agregar columna `last_state` a tabla `users` | CRÍTICA | 0.5 día |
| 1.4 | `npm install` + build en M5 | ALTA | 0.5 día |
| 1.5 | Configurar PM2 o systemd para logos-backend | ALTA | 0.5 día |
| 1.6 | Configurar NGINX reverse proxy para logos-backend | ALTA | 0.5 día |
| 1.7 | Configurar webhooks Twilio apuntando a logos-backend | ALTA | 1 día |
| 1.8 | Test end-to-end: WhatsApp texto → agente → respuesta | CRÍTICA | 1 día |
| 1.9 | Test end-to-end: Llamada de voz → ElevenLabs bridge | ALTA | 1 día |
| 1.10 | Test end-to-end: SMS → quick check-in | MEDIA | 0.5 día |

### FASE 2 — Consolidación de Motores (Semana 4)

**Objetivo:** Garantizar paridad matemática exacta entre todos los motores de cálculo.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 2.1 | Actualizar `api/services/logos-engine.js` con fórmulas exactas del frontend | CRÍTICA | 2 días |
| 2.2 | Crear archivo compartido de constantes (pesos, umbrales, ideales) | ALTA | 1 día |
| 2.3 | Tests de paridad cross-engine (frontend = api = logos-backend) | CRÍTICA | 1 día |
| 2.4 | Documentar decisión arquitectónica: coexistencia api/ + logos-backend/ | MEDIA | 0.5 día |
| 2.5 | Definir cuál backend maneja qué canal (evitar conflictos) | ALTA | 0.5 día |

### FASE 3 — Integración Alimento Sagrado (Semanas 5-6)

**Objetivo:** Conectar el módulo `alimento.ts` al ecosistema completo.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 3.1 | Conectar `alimento.ts` a `useLogosEngine.ts` — exponer recomendaciones | ALTA | 1 día |
| 3.2 | Agregar sección Alimento en `LogosHumano.jsx` (pestaña o panel) | ALTA | 2 días |
| 3.3 | Traducir labels y recomendaciones de alimento a EN (i18n) | ALTA | 1 día |
| 3.4 | Portar funciones de alimento a `logos-backend/metrics-engine.js` | ALTA | 1 día |
| 3.5 | Agregar tool `recommend_sacred_food` al OpenAI Agent | ALTA | 1 día |
| 3.6 | Agregar tool `assess_meal_harmony` al OpenAI Agent | MEDIA | 0.5 día |
| 3.7 | Agregar recomendaciones de alimento al flujo WhatsApp | MEDIA | 1 día |
| 3.8 | Agregar clientTool `getAlimentoRecommendation` a ElevenLabs Voice Agent | MEDIA | 0.5 día |
| 3.9 | Tests unitarios para integración alimento | ALTA | 1 día |

### FASE 4 — Multilenguaje Backend (Semanas 7-8)

**Objetivo:** Hacer que TODOS los canales soporten español e inglés.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 4.1 | Crear sistema de templates i18n para logos-backend | ALTA | 2 días |
| 4.2 | Traducir system instructions del OpenAI Agent a EN | ALTA | 1 día |
| 4.3 | Agregar detección de idioma por usuario (preferencia + auto-detect) | ALTA | 1 día |
| 4.4 | Traducir mensajes WhatsApp a EN | ALTA | 1 día |
| 4.5 | Traducir mensajes SMS a EN | MEDIA | 0.5 día |
| 4.6 | Agregar columna `locale` a tablas `users` y `channel_users` | ALTA | 0.5 día |
| 4.7 | Configurar ElevenLabs Voice Agent multilenguaje | MEDIA | 1 día |
| 4.8 | Traducir domain-tracker prompts a EN | MEDIA | 0.5 día |
| 4.9 | Traducir `api/services/whatsapp.js` domain questions a EN | MEDIA | 0.5 día |
| 4.10 | Tests de flujo WhatsApp en inglés | ALTA | 1 día |

### FASE 5 — Integridad de Datos y Esquema (Semana 9)

**Objetivo:** Resolver inconsistencias de base de datos y automatizar procesos.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 5.1 | Crear migración versionada para tabla `conversations` | CRÍTICA | 0.5 día |
| 5.2 | Agregar columna `source_channel` a tabla `sessions` | ALTA | 0.5 día |
| 5.3 | Implementar daily snapshots automáticos (cron job) | ALTA | 1 día |
| 5.4 | Implementar sistema de migraciones versionadas (node-pg-migrate) | ALTA | 1 día |
| 5.5 | Sincronización bidireccional web ↔ WhatsApp state | MEDIA | 1 día |
| 5.6 | Mejorar reportes longitudinales cross-channel | MEDIA | 1 día |

### FASE 6 — Seguridad y Monitoreo (Semana 10)

**Objetivo:** Hardening de seguridad y observabilidad operacional.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 6.1 | Implementar rate limiting en todos los endpoints | ALTA | 1 día |
| 6.2 | Agregar autenticación JWT/API-key en logos-backend REST API | ALTA | 1 día |
| 6.3 | Validar firma Twilio en webhooks (X-Twilio-Signature) | ALTA | 0.5 día |
| 6.4 | Sanitizar input de mensajes WhatsApp/SMS | ALTA | 0.5 día |
| 6.5 | Integrar Sentry para error tracking | MEDIA | 1 día |
| 6.6 | Health check endpoint con métricas de DB y servicios | MEDIA | 0.5 día |
| 6.7 | Alertas automáticas por caída de servicios | MEDIA | 1 día |

### FASE 7 — UX y Funcionalidades Avanzadas (Semanas 11-12)

**Objetivo:** Implementar funcionalidades del roadmap que mejoran la experiencia del usuario.

| # | Tarea | Prioridad | Estimación |
|---|-------|-----------|------------|
| 7.1 | Google Calendar OAuth completo (no solo conversation_log) | ALTA | 2 días |
| 7.2 | Push notifications para check-in diario (Service Worker) | MEDIA | 2 días |
| 7.3 | Export de datos en CSV | MEDIA | 1 día |
| 7.4 | Export de reportes en PDF | BAJA | 1 día |
| 7.5 | PWA manifest + offline support básico | MEDIA | 1 día |
| 7.6 | Web Workers para Monte Carlo (no bloquear UI) | BAJA | 1 día |

### FASE 8 — Apple Watch / Biometrics (Futuro — ya documentado en PARTE XI)

### FASE 9 — 7° Dominio Alimento / Migración 24→28 dims (Futuro — ya documentado en PROPUESTA v3)

---

## XII.105 TODO List Detallado

### ✅ COMPLETADO
- [x] Core Engine 9 capas (logos, friston, levin, watson, hoffman, penrose, policy, derived, emergence, protocol)
- [x] Simulación Monte Carlo (N=100,000, Heun, Wilson CI)
- [x] Frontend React con 11+ pestañas interactivas
- [x] Supabase Auth (Google, Apple, Guest)
- [x] Backend API Express+PostgreSQL en M5
- [x] WhatsApp check-in guiado (api/)
- [x] ElevenLabs Voice Agent con clientTools
- [x] OpenAI Agents SDK con 12 herramientas
- [x] Backend multi-canal (WhatsApp texto/voz, SMS, PSTN voz)
- [x] Cross-channel session continuity
- [x] Domain tracker zoom-out protocol
- [x] Módulo alimento.ts (core engine)
- [x] i18n frontend (ES+EN) con 100+ claves por idioma
- [x] Deployment frontend (NGINX, logoilab.com)
- [x] Esquema PostgreSQL (users, sessions, daily_snapshots, channel_users)
- [x] Λ jerárquica: Λ = Λ_señal × Φ_canal (Shannon, 1948) (v5.0)
- [x] Emergence Engine: SDE + Monte Carlo + Polytope + Gates (v5.0)
- [x] 5 Puertas de Criticalidad C₁–C₅ con gate multiplicativo (v5.0)
- [x] Shannon SNR en decibeles (v5.0)
- [x] Paisaje Energético 2D con atractores duales (v5.0)
- [x] Modo What-If (simulación de escenarios en tiempo real) (v5.0)
- [x] 20 Paneles de Interpretación AI (11 LOGOS + 9 IFC) (v5.0)
- [x] 759 tests unitarios (18 archivos) — todos PASS (v5.1)
- [x] Geometría Positiva — Layer 10: positive-geometry.ts (v5.1)
- [x] PositiveGeometryCard.jsx — GCI, Ω, ρ, F, Basin, Vol(P⁺) (v5.1)
- [x] PolytopeVisualization.jsx — Politopo 3D SVG interactivo con drag-rotate (v5.2)
- [x] EmergenceSwarmAnimation.jsx — Langevin 28 partículas con fases (v5.0)
- [x] EmergenceGateDashboard.jsx — 5 puertas canvas responsivo (v5.0)
- [x] EnergyLandscapeMap.jsx — canvas responsivo con ResizeObserver (v5.2)
- [x] EmergenceReporter.jsx — reporte de eventos emergentes (una vez al login) (v5.2)
- [x] Pesos adaptativos bayesianos (CBWA) con Dirichlet prior (v5.0)
- [x] iOS + Apple Watch app subida a App Store Connect (v1.0 Build 1)
- [x] UI Mobile-responsive completa: useIsMobile hook + responsive.css (v5.2)
- [x] Tooltips custom estilizados en MiniMetric (v5.2)
- [x] Dominios en Estado Actual desplegados por default (v5.2)
- [x] Claves i18n completas para PolytopeVisualization (12 claves añadidas) (v5.2)

### 🔲 PENDIENTE — Prioridad CRÍTICA
- [ ] Tests unitarios para core engine (7 capas)
- [ ] Despliegue de logos-backend en M5
- [ ] Paridad de motor: unificar api/logos-engine.js
- [ ] Migración SQL: tabla conversations + users.last_state
- [ ] Configurar webhooks Twilio → logos-backend

### 🔲 PENDIENTE — Prioridad ALTA
- [ ] Integrar alimento.ts en useLogosEngine + UI
- [ ] Portar alimento a backend + OpenAI tools
- [ ] i18n backend (agente, WhatsApp, SMS)
- [ ] Rate limiting + autenticación REST API
- [ ] Validación de firma Twilio
- [ ] Tests de paridad cross-engine
- [ ] Sistema de migraciones versionadas
- [ ] Daily snapshots automáticos (cron)
- [ ] PM2/systemd para logos-backend

### 🔲 PENDIENTE — Prioridad MEDIA
- [ ] Google Calendar OAuth completo
- [ ] Push notifications
- [ ] Health monitoring + Sentry
- [ ] Export CSV
- [ ] PWA manifest
- [ ] ElevenLabs multilenguaje
- [ ] Reportes longitudinales mejorados

### 🔲 PENDIENTE — Prioridad BAJA / FUTURO
- [ ] Export PDF
- [ ] Web Workers para Monte Carlo
- [ ] Modo colaborativo (terapeuta/coach)
- [ ] API pública
- [ ] ML: predicción de Λ
- [ ] Apple Watch / HealthKit (PARTE XI)
- [ ] Migración 24→28 dimensiones (PROPUESTA v3)

---

## XII.106 Matriz de Riesgos y Mitigación

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| R1 | Divergencia de métricas entre motores | ALTA | CRÍTICO | Tests de paridad automatizados (Fase 0+2) |
| R2 | Rotura de UI al integrar alimento | MEDIA | ALTO | Feature flag + branch separado + tests |
| R3 | Caída de logos-backend en producción | MEDIA | ALTO | PM2 restart + health checks + alertas |
| R4 | Conflicto entre api/ y logos-backend/ en WhatsApp | MEDIA | ALTO | Webhook routing claro: un solo backend por canal |
| R5 | Pérdida de datos al migrar esquema | BAJA | CRÍTICO | Backup antes de cada migración + rollback script |
| R6 | Rate limiting de OpenAI/ElevenLabs APIs | MEDIA | MEDIO | Fallback graceful + cache de respuestas |
| R7 | Incompatibilidad i18n en componentes existentes | BAJA | MEDIO | Tests de regresión visual + snapshot testing |
| R8 | Seguridad: webhooks sin validación de firma | ALTA | ALTO | Implementar en Fase 6 (prioridad 6.3) |

---

## XII.107 Criterios de Aceptación por Fase

### Fase 0 — Estabilización
- [ ] ≥80% coverage en `src/core/*.ts`
- [ ] 0 tests fallidos en suite completa
- [ ] Tests de paridad: frontend = logos-backend (delta < 0.001)

### Fase 1 — Despliegue logos-backend
- [ ] logos-backend corriendo en M5 con PM2
- [ ] WhatsApp texto: mensaje enviado → respuesta recibida en <15s
- [ ] Voz: llamada PSTN → respuesta de voz ElevenLabs audible
- [ ] SMS: número enviado → métricas recibidas

### Fase 2 — Consolidación
- [ ] `api/logos-engine.js` produce mismos resultados que frontend (±0.001)
- [ ] Documento de arquitectura actualizado

### Fase 3 — Alimento Sagrado
- [ ] UI muestra recomendaciones de alimento basadas en estado actual
- [ ] OpenAI Agent puede recomendar alimentos vía WhatsApp
- [ ] Tests de integración para flujo alimento

### Fase 4 — Multilenguaje
- [ ] Usuario en WhatsApp con device en inglés recibe mensajes en inglés
- [ ] OpenAI Agent responde en el idioma del usuario
- [ ] ElevenLabs Voice Agent disponible en inglés

### Fase 5 — Integridad de Datos
- [ ] Migraciones versionadas funcionando
- [ ] Daily snapshots generándose automáticamente a las 23:59 UTC
- [ ] `source_channel` poblado en todas las sesiones nuevas

### Fase 6 — Seguridad
- [ ] Rate limiter activo: ≤60 req/min por IP
- [ ] REST API requiere API key válida
- [ ] Twilio signature validation activa en todos los webhooks
- [ ] 0 errores no capturados en Sentry (post-deploy 48h)

### Fase 7 — UX Avanzadas
- [ ] Eventos de Google Calendar creados y visibles en calendar del usuario
- [ ] Push notification recibida en dispositivo móvil
- [ ] CSV descargable con historial completo

---

> **Fin del Documento Maestro LOGOS**  
> **Versión:** 5.2.0  
> **Fecha:** 2026-02-11  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Generado por:** Cascade AI Assistant
