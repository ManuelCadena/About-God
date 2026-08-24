# CATÁLOGO DE COMPONENTES REACT — LOGOS

> **Documento:** SRS-COMP-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 26512  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [App](#1-app)
2. [LogosHumano](#2-logoshumano)
3. [Card](#3-card)
4. [MetricCard](#4-metriccard)
5. [MetricDetailPanel](#5-metricdetailpanel)
6. [Slider (inline)](#6-slider)
7. [InfoTooltip (inline)](#7-infotooltip)
8. [MonteCarloAnimation (inline)](#8-montecarloanimation)
9. [TheoryManual](#9-theorymanual)
10. [SessionTracker](#10-sessiontracker)
11. [LogosVoiceAgent](#11-logosvoiceagent)
12. [TabAIGuide](#12-tabaiguide)
13. [EmergenceVisualizations](#13-emergencevisualizations)
14. [IFCModel](#14-ifcmodel)

---

## 1. App

**Archivo:** `src/App.jsx`  
**Tipo:** Componente funcional (root)  
**Responsabilidad:** Autenticación (Supabase Auth: Google + Apple + Guest), recolección de teléfono obligatoria, WhatsApp opt-in, y routing.

### Props

Ninguna — componente raíz.

### State Interno

| Estado | Tipo | Inicialización | Descripción |
|--------|------|----------------|-------------|
| `user` | `object \| null` | `null` | Datos del usuario autenticado (Supabase UUID) |
| `session` | `object \| null` | `null` | Sesión Supabase (JWT, provider_token) |
| `loading` | `boolean` | `true` | Cargando sesión inicial |
| `needsPhone` | `boolean` | `false` | Si el usuario necesita registrar teléfono |
| `phoneInput` | `string` | `'+52 '` | Valor del input de teléfono |
| `phoneSaving` | `boolean` | `false` | Si se está guardando el teléfono |
| `phoneError` | `string` | `''` | Mensaje de error de teléfono |
| `showWhatsAppOptIn` | `boolean` | `false` | Si mostrar pantalla de WhatsApp opt-in |

### Hooks Utilizados

| Hook | Propósito |
|------|----------|
| `useState` | 8 estados del flujo de autenticación |
| `useEffect` | Suscripción a `supabase.auth.onAuthStateChange` |

### Funciones Internas

| Función | Descripción |
|---------|-------------|
| `checkProfilePhone(authUser)` | Verifica si el usuario tiene teléfono en `profiles.phone`. Si no, activa `needsPhone`. Si sí pero no `whatsapp_optin`, activa `showWhatsAppOptIn`. |
| `handlePhoneSave()` | Valida teléfono (`^\+\d{10,15}$`), guarda en `profiles.phone`, auto-vincula/crea `channel_users`. |
| `handleWhatsAppOptIn(accepted)` | Marca `whatsapp_optin=true` en profiles. Si acepta, abre `wa.me/19788012275`. |
| `handleLogout()` | `signOut()` de Supabase, limpia todos los estados. |
| `handleGuestLogin()` | Crea usuario invitado local (sin Supabase). |
| `mapSupabaseUser(authUser)` | Mapea `auth.users` a formato LOGOS: `{id, email, name, picture, isGuest}`. |

### Eventos Manejados

| Evento | Handler | Descripción |
|--------|---------|-------------|
| Click "Sign in with Google" | `signInWithGoogle()` | OAuth via Supabase provider |
| Click "Sign in with Apple" | `signInWithApple()` | OAuth via Supabase provider |
| Click "Entrar como Invitado" | `handleGuestLogin()` | Crea usuario invitado local |
| Click "Continuar" (phone) | `handlePhoneSave()` | Guarda teléfono y vincula canales |
| Click "Conectar WhatsApp" | `handleWhatsAppOptIn(true)` | Abre wa.me link |
| Click "Ahora no" | `handleWhatsAppOptIn(false)` | Skip opt-in, continuar a app |
| Click "Cerrar sesión" | `handleLogout()` | Sign out de Supabase |

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

## 2. LogosHumano

**Archivo:** `src/components/LogosHumano.jsx`  
**Tipo:** Componente funcional (dashboard principal)  
**Líneas:** ~2,242  
**Responsabilidad:** Dashboard completo del Sistema Operativo de Consciencia.

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `user` | `object` | Sí | Datos del usuario (`name`, `email`, `picture`) |
| `accessToken` | `string \| null` | No | Token OAuth para Google Calendar |

### State Interno

| Estado | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `state` | `ConsciousnessState` | `DEFAULT_STATE` | 24 dimensiones ∈ [0,1] |
| `activeTab` | `string` | `'estado'` | Pestaña activa del dashboard |
| `prevLambda` | `number \| undefined` | `undefined` | Λ anterior para calcular Λ̇ |
| `mcResult` | `MonteCarloResult \| null` | `null` | Resultado Monte Carlo |
| `mcRunning` | `boolean` | `false` | Si MC está ejecutándose |
| `mcN` | `number` | `10000` | N para Monte Carlo |
| `mcSigma` | `number` | `0.04` | σ para Monte Carlo |
| `detailMetric` | `object \| null` | `null` | Métrica seleccionada para detalle |
| `showOnboarding` | `boolean` | `true` | Mostrar guía de onboarding |
| `onboardingStep` | `number` | `0` | Paso actual del onboarding |
| `sessionActive` | `boolean` | `false` | Si hay sesión activa |
| `sessionData` | `object \| null` | `null` | Datos de sesión actual |

### Hooks Utilizados

| Hook | Propósito |
|------|-----------|
| `useState` | Múltiples estados del dashboard |
| `useEffect` | Inyección de CSS animations, cálculos reactivos |
| `useCallback` | Handlers memoizados |
| `useMemo` | Cálculos derivados memoizados (métricas, recomendaciones) |
| `useRef` | Referencias a prevLambda, timers |

### Pestañas del Dashboard

| ID | Label | Icono | Contenido |
|----|-------|-------|-----------|
| `estado` | Estado | ◈ | Sliders de 24 dimensiones + métricas principales |
| `motor` | Motor | ⚙ | Desglose del motor de 7 capas |
| `decisiones` | Decisiones | ⚖ | Política π(x) + recomendaciones |
| `guia` | Guía | ? | Onboarding interactivo de 12 pasos |
| `trayectoria` | Trayectoria | ⟐ | Gráficas de evolución temporal |
| `montecarlo` | Monte Carlo | ∿ | Simulación estocástica N=10,000 |
| `teoria` | Teoría | Λ | Manual teórico completo |

### Componentes Internos Definidos

- `Card` — Contenedor visual con animación
- `MetricCard` — Tarjeta de métrica expandible
- `MetricDetailPanel` — Panel de detalle completo (overlay)
- `Slider` — Input para cada dimensión
- `InfoTooltip` — Tooltip informativo
- `MonteCarloAnimation` — Animación de partículas

---

## 3. Card

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional presentacional

### Props

| Prop | Tipo | Required | Default | Descripción |
|------|------|----------|---------|-------------|
| `title` | `string` | No | — | Título de la tarjeta |
| `icon` | `string` | No | — | Icono emoji |
| `accent` | `string` | No | — | Color de acento (hex) |
| `children` | `ReactNode` | Sí | — | Contenido |
| `style` | `object` | No | `{}` | Estilos adicionales |
| `delay` | `number` | No | `0` | Delay de animación (segundos) |
| `onClick` | `function` | No | — | Handler de click |

### Características Visuales

- Background: `COLORS.surface`
- Border: `1px solid COLORS.border`
- Border radius: 14px
- Animación: `fadeInUp 0.5s ease`
- Línea de acento superior con gradiente
- Cursor pointer si `onClick` está definido

---

## 4. MetricCard

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional interactivo

### Props

| Prop | Tipo | Required | Default | Descripción |
|------|------|----------|---------|-------------|
| `label` | `string` | Sí | — | Nombre de la métrica |
| `value` | `number \| string` | Sí | — | Valor numérico |
| `color` | `string` | Sí | — | Color hex |
| `tooltip` | `string` | No | — | Texto de tooltip |
| `breakdown` | `array \| object` | No | — | Datos de desglose |
| `suffix` | `string` | No | `""` | Sufijo del valor |
| `onOpenDetail` | `function` | No | — | Abre panel de detalle |

### State Interno

| Estado | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `expanded` | `boolean` | `false` | Si el desglose está visible |
| `hovered` | `boolean` | `false` | Si el mouse está encima |

### Comportamiento

- **Click:** Si `onOpenDetail` → abre panel de detalle. Si `breakdown` → toggle expanded.
- **Hover:** Muestra tooltip, efecto glow, escala 1.03x.
- **Expanded:** Muestra popup flotante con desglose de factores.

---

## 5. MetricDetailPanel

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional (overlay full-page)

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `metric` | `object` | Sí | `{ id, label, color, value, data }` |
| `onClose` | `function` | Sí | Callback para cerrar el panel |

### State Interno

| Estado | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `renderError` | `Error \| null` | `null` | Error de renderizado |

### Hooks

| Hook | Propósito |
|------|-----------|
| `useState` | Error handling |
| `useEffect` | Listener de tecla Escape para cerrar |

### Métricas Soportadas

| `metric.id` | Contenido Renderizado |
|-------------|----------------------|
| `"lambda"` | Fórmula Λ, desglose por grupo, barra de progreso por factor |
| `"viability"` | Fórmula V, top 10 contribuyentes, modulación Λ |
| `"entropy"` | Fórmula S, factores de entropía, modulación Λ |
| `"coherence"` | Fórmula C, radar chart de dominios, media armónica |
| `"freeEnergy"` | Fórmula F, top 10 divergencias, modulación Λ |
| `"omega"` | Fórmula Ω, composición Λ vs derivadas |

### Sub-componentes Internos

- `Bar` — Barra de progreso horizontal
- `FactorRow` — Fila de factor con barra + contribución
- `SectionHead` — Encabezado de sección
- `ModulationBox` — Visualización del efecto de Λ (crudo → modulado → final)

---

## 6. Slider

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional (input range)

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `label` | `string` | Sí | Nombre de la dimensión |
| `value` | `number` | Sí | Valor actual ∈ [0,1] |
| `onChange` | `function` | Sí | `(newValue: number) => void` |
| `color` | `string` | Sí | Color de la dimensión |
| `tooltip` | `string` | No | Texto de ayuda |

### Características

- Input `type="range"` con `min=0`, `max=1`, `step=0.01`
- Muestra valor como porcentaje
- Color del track basado en el dominio
- Tooltip visible en hover

---

## 7. InfoTooltip

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional presentacional

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `text` | `string` | Sí | Texto del tooltip |
| `children` | `ReactNode` | Sí | Contenido que activa el tooltip |

### State Interno

| Estado | Tipo | Default |
|--------|------|---------|
| `show` | `boolean` | `false` |

### Comportamiento

- Hover sobre children → muestra tooltip flotante
- Posición: debajo del elemento, centrado

---

## 8. MonteCarloAnimation

**Definido en:** `src/components/LogosHumano.jsx` (inline)  
**Tipo:** Componente funcional (canvas animation)

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `running` | `boolean` | Sí | Si la animación está activa |
| `progress` | `number` | No | Progreso 0-1 |

### Hooks

| Hook | Propósito |
|------|-----------|
| `useRef` | Referencia al canvas |
| `useEffect` | Animation loop con requestAnimationFrame |

### Características

- Canvas HTML5 con partículas animadas
- Partículas representan trayectorias estocásticas
- Color basado en `COLORS.mc` (cyan)

---

## 9. TheoryManual

**Archivo:** `src/components/TheoryManual.jsx`  
**Tipo:** Constante exportada `THEORY_MANUAL`

### Estructura

```typescript
export const THEORY_MANUAL: Array<{
  id: string;
  title: string;
  icon: string;
  content: string;  // Markdown/HTML
}>
```

### Secciones

| ID | Título | Contenido |
|----|--------|-----------|
| `overview` | Visión General | Introducción al sistema |
| `lambda` | Λ — El Atractor | Explicación de Logos Alignment |
| `friston` | Friston — Energía Libre | Capa 1 |
| `levin` | Levin — Señales | Capa 2 |
| `watson` | Watson — Paisaje | Capa 3 |
| `hoffman` | Hoffman — Interfaz | Capa 4 |
| `penrose` | Penrose — Coherencia | Capa 5 |
| `policy` | π(x) — Política | Capa 6 |
| `montecarlo` | Monte Carlo | Simulación estocástica |
| `attractors` | Atractores A⁺/A⁻ | Dinámica de atractores |

---

## 10. SessionTracker

**Archivo:** `src/components/SessionTracker.jsx`  
**Tipo:** Componente funcional + funciones exportadas

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `state` | `ConsciousnessState` | Sí | Estado actual |
| `metrics` | `object` | Sí | Métricas calculadas |
| `user` | `object` | Sí | Datos del usuario |

### Funciones Exportadas

| Función | Descripción |
|---------|-------------|
| `startSession()` | Inicia una nueva sesión de evaluación |
| `endSession()` | Finaliza la sesión activa |
| `saveSessionSnapshot()` | Guarda snapshot del estado actual |

---

## 11. LogosVoiceAgent

**Archivo:** `src/components/LogosVoiceAgent.jsx`  
**Tipo:** Componente funcional (widget de voz)

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `agentId` | `string` | Sí | ID del agente ElevenLabs |

### Dependencias

- `@elevenlabs/react` — Widget conversacional embebido

### Configuración

- Agent ID: `agent_0401kgrq0q0kfwx9v29fje7eqd5j`
- Configurado en `src/config/logosAgent.js`

---

## 12. TabAIGuide

**Archivo:** `src/components/TabAIGuide.jsx`  
**Tipo:** Componente funcional (nuevo v3.3.0)  
**Responsabilidad:** Panel colapsable de interpretación AI con GPT-4o para cada pestaña del sistema.

### Props

| Prop | Tipo | Required | Descripción |
|------|------|----------|-------------|
| `panel` | `string` | Sí | Identificador del panel (ej: `"estado"`, `"motor"`, `"ifc-dashboard"`) |
| `accent` | `string` | Sí | Color de acento del panel (hex) |
| `data` | `object` | Sí | Datos contextuales enviados al LLM para interpretación |

### Comportamiento

1. Al expandirse, envía `POST /api/protocol/interpret-panel` con `{panel, data, lang}`
2. El backend procesa con GPT-4o usando prompts específicos por panel (22 totales)
3. Respuesta JSON: `{explanation, howToUse, insight, action}`
4. Cache en `sessionStorage` con key `ai-guide-{panel}` para evitar llamadas redundantes
5. Soporte bilingüe ES/EN automático vía `i18n.language`

### Paneles Soportados

**LOGOS (13):** `coherence`, `landscape`, `estado`, `motor`, `decision`, `guia`, `trayectoria`, `montecarlo`, `alimento`, `seguimiento`, `biometrics`, `teoria`, `ifc`

**IFC (9):** `ifc-dashboard`, `ifc-state`, `ifc-controls`, `ifc-simulator`, `ifc-montecarlo`, `ifc-attractor`, `ifc-policy`, `ifc-metapolicy`, `ifc-theory`

---

## 13. EmergenceVisualizations

**Archivo:** `src/components/EmergenceVisualizations.jsx`  
**Tipo:** Módulo con múltiples componentes exportados  
**Responsabilidad:** Visualizaciones de emergencia: Coherencia Inter-Dominio, Paisaje Energético, ERS.

### Componentes Exportados

| Componente | Descripción |
|------------|-------------|
| `CoherenceMatrixHeatmap` | Heatmap 7×7 de coherencia inter-dominio con labels por dominio |
| `EnergyLandscape` | Paisaje energético 2D (Λ vs S) con atractores A⁺/A⁻ |
| `EmergenceReadinessScore` | Score de preparación para emergencia |

### Fix v3.3.0

- **CSS:** Labels de fila/columna usan `cellSize + 2` para alinearse con celdas que tienen `margin: 1px`
- **Datos:** `DOMAIN_DEFINITIONS.dims` corregidas para coincidir con `constants.ts` DOMAINS

---

## 14. IFCModel

**Archivo:** `src/components/IFCModel.jsx` (~2590 líneas)  
**Tipo:** Componente funcional (página completa)  
**Ruta:** `/ifc`  
**Responsabilidad:** Modelo de Control Inhibitorio (Inhibition-First Control) — ℋ = (X, U, W, V, S, Φ, π, π², Q)

### Props

Ninguna — componente standalone accesible vía `/ifc`.

### State Interno

| Estado | Tipo | Inicialización | Descripción |
|--------|------|----------------|-------------|
| `state` | `object` (12 vars) | `deriveIFCFromLogos()` o `DEFAULT_STATE` | 12 variables de estado cognitivo-emocional |
| `controls` | `object` (9 vars) | `DEFAULT_CONTROLS` | 9 controles manipulables |
| `activeTab` | `string` | `"dashboard"` | Pestaña activa (9 pestañas) |
| `history` | `array` | `[]` | Historial de V, S, verdict |
| `mcResults` | `object​\|null` | `null` | Resultados Monte Carlo |

### LOGOS Bridge (v3.3.0)

- **`deriveIFCFromLogos(logos)`**: Función que mapea 28 dimensiones LOGOS → 12 variables IFC
- Lee de `sessionStorage('logos-state-28')` al inicializar
- `LogosHumano.jsx` persiste el estado 28-dim en cada cambio
- Preset **"Λ LOGOS"** permite re-derivar en cualquier momento

### Pestañas (9)

| Tab | Descripción | TabAIGuide |
|-----|-------------|------------|
| `dashboard` | V, S, C, Q, L, modo cognitivo, π, π², ansiedad emergente | `ifc-dashboard` |
| `state` | 12 sliders de variables de estado (6 negativas + 6 positivas) | `ifc-state` |
| `controls` | 9 sliders de controles + impacto proyectado | `ifc-controls` |
| `simulator` | Trayectoria determinista 30 pasos + Safe-to-Act Oracle | `ifc-simulator` |
| `montecarlo` | N simulaciones estocásticas, fan chart, decision confidence | `ifc-montecarlo` |
| `attractor` | Espacio de fases (V,S), Q(x), L(x), drift vectors | `ifc-attractor` |
| `policy` | π(x,u) formal, sensitivity analysis, decision history | `ifc-policy` |
| `metapolicy` | π²(x) meta-política, detección atractores patológicos | `ifc-metapolicy` |
| `theory` | Marco teórico completo del IFC | `ifc-theory` |

### EmergenceSwarmAnimation *(v3.3.0)*

| Prop | Tipo | Descripción |
|------|------|-------------|
| `state` | `Record<string, number>` | Estado actual de las 28 dimensiones |
| `prevState` | `Record<string, number> \| null` | Estado previo (para derivadas) |
| `lambda` | `number` | Λ — alineación Logos (parámetro de orden) |
| `entropy` | `number` | S — entropía (temperatura efectiva) |
| `width` | `number` | Ancho del canvas (default: 380) |
| `height` | `number` | Alto del canvas (default: 380) |

**Modelo Físico:** Dinámica de Langevin sobreamortiguada para 28 partículas en ℝ².

Cada partícula i representa la dimensión d_i:

```
dr_i/dt = -α·Λ²·(r_i - r₀)                    // Pozo armónico central
         - β·(|r_i-r₀| - R_eq(s_i))·r̂_i       // Radio ∝ valor de dimensión
         - κ·Σ_{j∈D_k}(r_i - r_j)/|r_ij|      // Cohesión intra-dominio
         + μ·Σ_{j≠i} r̂_{ij}/|r_{ij}|²          // Repulsión corto alcance
         - ψ·σ(Λ-0.6)·(r_i - r_i*)             // Atractor geométrico (mandala)
         + σ_n·√S·ξ(t)                          // Ruido térmico (Euler-Maruyama)
```

**Fases (analogía Ginzburg-Landau):**
- **Λ > 0.65** → Fase ordenada — cristalización en mandala (7 clusters × 4 dims)
- **0.35 < Λ < 0.65** → Fase fluida — clusters visibles pero móviles
- **Λ < 0.35** → Fase gas — dispersión caótica

**Archivo:** `src/components/EmergenceSwarmAnimation.jsx`
**Dependencias:** `emergence-metrics.ts` (DOMAIN_DEFINITIONS)

---

### Motor Matemático Interno

| Función | Descripción |
|---------|-------------|
| `computeViability(s)` | V(x) — capacidad futura de decisión |
| `computeEntropy(s)` | S(x) — desorden cognitivo |
| `computeControllability(s, u)` | C(x,u) — controlabilidad estimada |
| `inhibitionPolicy(s, u)` | π(x,u) → ALLOW/WAIT/BLOCK |
| `metaPolicy(s, u)` | π²(x) → SUSTAIN/MONITOR/ACTIVATE/ESCAPE |
| `computeQ(s)` | Q(x) — calidad del atractor |
| `computeLyapunov(s)` | L(x) — distancia al atractor funcional |
| `runMonteCarlo(s, u, N, T, σ, nl)` | Simulación estocástica N trayectorias |
| `detectPathologicalAttractor(s, u)` | Detecta patologías: depresión-like, ciclo adictivo, etc. |
| `classifyCognitiveMode(s, u)` | INTUICIÓN/DELIBERACIÓN/ANSIEDAD/TRANSICIÓN |
| `safeToActOracle(s, u)` | Escanea trayectoria hasta primer π=ALLOW |
| `deriveIFCFromLogos(logos)` | Mapea 28-dim LOGOS → 12-var IFC |

---

## Referencias Cruzadas

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Modelo de Datos](./DATA_MODEL.md)
- [Manual de Usuario](./USER_MANUAL.md)
- [API Reference](./API_REFERENCE.md)
