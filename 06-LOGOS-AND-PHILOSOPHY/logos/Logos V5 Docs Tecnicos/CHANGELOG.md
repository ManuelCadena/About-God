# CHANGELOG — LOGOS

> **Documento:** SRS-CHANGE-001  
> **Estándar:** [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) + [Semantic Versioning](https://semver.org/lang/es/)  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Convenciones de Versionamiento](#convenciones-de-versionamiento)
2. [Versiones](#versiones)

---

## Convenciones de Versionamiento

Este proyecto sigue **Semantic Versioning 2.0.0**:

- **MAJOR** (X.0.0): Cambios incompatibles en la API o modelo matemático
- **MINOR** (0.X.0): Funcionalidad nueva compatible hacia atrás
- **PATCH** (0.0.X): Correcciones de bugs compatibles hacia atrás

---

## Versiones

### [3.3.0] — 2026-02-09

#### Agregado
- **Paneles de Interpretación AI (TabAIGuide):**
  - Nuevo componente `TabAIGuide.jsx` — panel colapsable de interpretación AI con GPT-4o
  - Integrado en las **11 pestañas de LOGOS**: Estado Actual, Motor, Decisiones, Guía Diaria, Trayectoria, Monte Carlo, Alimento Sagrado, Seguimiento, Apple Watch, Teoría, Coherencia/Paisaje
  - Integrado en las **9 pestañas de IFC**: Dashboard, State, Controls, Simulator, Monte Carlo, Attractor, Policy, Meta-Policy, Theory
  - Cada panel envía datos contextuales al LLM y recibe: explicación, instrucciones de uso, insight clave, acción recomendada
  - Caché en `sessionStorage` para evitar llamadas redundantes
  - Soporte bilingüe ES/EN vía parámetro `lang`
- **Backend `POST /api/protocol/interpret-panel`:**
  - Endpoint de interpretación AI con prompts específicos por panel (22 prompts totales)
  - 13 prompts LOGOS: coherence, landscape, estado, motor, decision, guia, trayectoria, montecarlo, alimento, seguimiento, biometrics, teoria, ifc
  - 9 prompts IFC: ifc-dashboard, ifc-state, ifc-controls, ifc-simulator, ifc-montecarlo, ifc-attractor, ifc-policy, ifc-metapolicy, ifc-theory
  - Respuesta JSON estructurada: `{explanation, howToUse, insight, action}`
  - Modelo: GPT-4o, temperature 0.6, max_tokens 500
- **IFC ↔ LOGOS Bridge (herencia de estado):**
  - `LogosHumano.jsx`: persiste estado 28-dim en `sessionStorage('logos-state-28')` en cada cambio
  - `IFCModel.jsx`: función `deriveIFCFromLogos(logos)` — mapea 28 dimensiones LOGOS → 12 variables IFC al iniciar
  - Mapeo: `cognitiveLoad ← 1-(clarity·0.5+focus·0.3+wisdom·0.2)`, `fatigue ← 1-(energy·0.5+sleep·0.3+exercise·0.2)`, `motivation ← meaning·0.3+mission·0.3+joy·0.2+contribution·0.2`, etc.
  - Nuevo preset **"Λ LOGOS"** en barra de presets IFC para re-derivar estado desde LOGOS
  - Botón "← LOGOS HUMANO" mejorado: de `position:absolute` a flujo normal del documento, más grande y visible

#### Corregido
- **Matriz de Coherencia Inter-Dominio — Labels desalineados:**
  - **Root cause 1 (CSS):** Row labels tenían `height: cellSize` (38px) pero celdas eran `cellSize + 2px` (40px por margin:1px). Tras 7 filas → 14px de drift. Fix: `height: cellSize + 2`, `width: cellSize + 2` para labels.
  - **Root cause 2 (Datos):** `DOMAIN_DEFINITIONS` en `emergence-metrics.ts` tenía dims obsoletas que no correspondían a `constants.ts`. Fix: actualización de dims para physical (`nutrition` no `breath`), mental (`wisdom` no `growth`), spiritual (`service,presence` no `meaning,integrity`), relational (`friendship,compassion` no `communication,service`), purpose (`meaning,mission,contribution` no `purpose,productivity,wisdom`).
  - **Colores corregidos:** Mental `#3B82F6→#6366F1`, Spiritual→`#A855F7`, Relational→`#EC4899`, Purpose→`#0EA5E9`
- **Test EM-05:** Actualizado para usar dims espirituales correctas (`service, presence` en lugar de `meaning, integrity`)
- **707 tests pasan** (antes 706/707 por EM-05 roto)

#### Cambiado
- **Backend PM2:** logos-backend ahora gestionado por PM2 (id: 15), ya no usa systemd ni nohup manual
  - Restart: `pm2 restart logos-backend`
  - Logs: `pm2 logs logos-backend`

---

### [3.2.0] — 2026-02-09

#### Agregado
- **Loop Biométrico Cerrado:** Integración completa HealthKit → motor core LOGOS
  - `watchEngine.freeEnergyMod` → modula F (Free Energy) con datos de SpO₂, HRR, HRV, RHR
  - `watchEngine.coherenceMod` → modula C (Coherence) con ruido ambiental, sueño fragmentado, temp
  - `watchEngine.watsonShifts` → ajusta dominios Physical/Emotional con VO₂, pasos, sueño profundo
  - `watchEngine.policyOverride` → fuerza veredicto PAUSA si AFib, SpO₂ <90%, taquicardia >120bpm
  - 8 señales Levin biométricas del Watch (AFib, SpO₂, temp, gait, HR recovery, noise, REM, deep sleep)
  - 4 sesgos Hoffman biométricos (ilusión de sueño, sobreestimación fitness/energía, incongruencia de paz)
- **Documentación técnica completa:** 27 documentos organizados en `/docs/` con INDEX.md
  - 4 documentos nuevos: BIOMETRIC_FEEDBACK_LOOP.md, VOICE_AGENT.md, HEALTHKIT_BRIDGE.md, APPLE_WATCH_ARCHITECTURE.md
  - 13 documentos actualizados de v2.2.0 → v3.2.0

#### Corregido
- **Voice Agent — 3 bugs de escritura:**
  - `"sueño"` → NFD normalization strip ñ tilde → `"sueno"` no matcheaba SPANISH_TO_KEY
  - `"Paz Interior"` → compound label sin entrada en SPANISH_TO_KEY
  - `"Amistades"` → plural vs `"amistad"` singular en SPANISH_TO_KEY
- **Voice Agent — corrupción silenciosa de estado:**
  - Validación explícita contra VARIABLE_LABELS antes de escribir a state
  - Error descriptivo si key resuelto no es dimensión válida
- **Voice Agent — getFullState mejorado:**
  - Retorna `{ key: { label, value } }` para que agente use keys internos
- **Voice Agent — 15 aliases de voz agregados:**
  - dormir, descanso, deporte, felicidad, gozo, concentracion, oracion, amigos, etc.

---

### [3.1.0] — 2026-02-08

#### Agregado (iOS + Apple Watch + HealthKit)
- **iOS App (Capacitor):**
  - Bundle ID: `com.cadenastrategic.logos`
  - HealthKit integration vía `LOGOSHealthKitPlugin.swift` (~538 líneas, ~35 data types)
  - Background health sync: `BGTaskSchedulerPermittedIdentifiers`
  - App icons sin alpha channel (PNG→JPEG→PNG roundtrip)
- **Apple Watch Companion App:**
  - Bundle ID: `com.cadenastrategic.logos.watchkitapp`
  - SwiftUI views: HomeView (Ω ring + metrics), QuickInputView (7 domain sliders)
  - WatchViewModel: WCSession bidireccional, @MainActor, Swift 6 concurrency
  - ComplicationProvider: migrado de ClockKit → WidgetKit
  - LOGOSCore Swift Package: motor nativo compartido iPhone/Watch
- **useHealthKit React Hook:**
  - Authorization, periodic sync (15 min), localStorage cache
  - `mapBiometricsToDimensions()`: sleep, exercise, energy, peace, meditation
- **healthkit-bridge.ts:**
  - `processWatchBiometrics()`: convierte biométricos crudos → moduladores LOGOS
  - Levin signals, Hoffman biases, Free Energy/Coherence mods, Watson shifts, Policy override
- **App Store Submission:**
  - Submitted to Apple App Store Review (Feb 8, 2026)
  - Screenshots: 5 iPhone + 1 iPad + 1 Apple Watch
  - Privacy Policy: https://logoilab.com/privacy.html
  - Metadata completo (ES + EN)

#### Cambiado
- **Info.plist:** BGTaskSchedulerPermittedIdentifiers agregado
- **Swift 6:** Strict concurrency en todos los Watch files (@MainActor, nonisolated delegates)

---

### [3.0.0] — 2026-02-07

#### Agregado (Major — 7° Dominio Alimento Sagrado + PhD Paper)
- **7° Dominio: Alimento Sagrado** con 4 dimensiones nuevas:
  - `nourishment` (Nutrición Consciente)
  - `taste_presence` (Presencia Gustativa) — peso Λ: 0.05
  - `food_harmony` (Armonía Alimentaria) — peso Λ: 0.03
  - `gut_resonance` (Resonancia Intestinal) — peso entropía: 0.07
- **`src/core/alimento.ts`** (~680 líneas):
  - Base de datos de ~40 alimentos sagrados con perfiles neuroquímicos
  - 10 vías bioquímicas (magnesio→paz, omega3→claridad, etc.)
  - Advertencias de alimentos tóxicos (ultra-procesados, azúcar refinada, grasas trans)
  - `getAlimentoRecommendations(state)` — recomendaciones basadas en dimensiones deficientes
  - `assessMealHarmony(foodIds)` — scoring de armonía alimentaria
  - `predictDimensionChanges(foodIds)` — predicción de mejoras por consumo
  - `estimateEntropicDamage(toxicIntensity, lambda)` — ΔS_tóxico con factor vulnerabilidad
- **9 señales Levin** (+3 nuevas: Disbiosis, Adaptación Hedónica, Intoxicación Entrópica)
- **8 sesgos Hoffman** (+3 nuevos: Hedonismo Gustativo, Ascetismo Desconectado, Nihilismo Somático)
- **12 factores de entropía** (+2 nuevos: gut_resonance 0.07, nourishment 0.06)
- **Fundamentación teórica nueva:** Teología Informacional (isomorfismo Shannon) + Entropía Alimentaria Inversa
- **i18n completo:** react-i18next con ES + EN, todas las cadenas externalizadas
- **547 tests automatizados** (12 archivos, 99.65% statements, 100% functions)
  - `alimento.test.ts` (38 tests), `pipeline.test.ts` (342 tests), `parity.test.ts` (22 tests)
- **Pesos adaptativos Bayesianos (CBWA):**
  - `useBayesianWeights.ts` — Dirichlet prior, η=0.1, β_max=0.3, T_min=10 sessions
  - `useCustomWeights.ts` — Editor manual de pesos con UI de sliders
  - Restricción teológica: faith w ≥ 0.10
- **Paper PhD** publicado: "Consciousness Alignment as Variational Free Energy Minimisation"

#### Cambiado (Breaking)
- **Espacio de estado:** ℝ²⁴ → ℝ²⁸ (24 → 28 dimensiones)
- **Dominios:** 6 → 7 (+ Alimento Sagrado)
- **Λ(x):** 10 → 12 dimensiones ponderadas (+taste_presence, +food_harmony)
- **V(x):** 24 → 28 pesos redistribuidos
- **Penrose:** 6 → 7 dominios en media armónica con ε-floor
- **Watson:** 6 → 7 dominios (+Alimento base=0.65, α=0.15)
- **Friston:** 24 → 28 ideals incluyendo 4 nuevas dimensiones Alimento

---

### [2.2.0] — 2026-02-06

#### Agregado (Major — Supabase + Multi-Canal + Identidad Unificada)
- **Supabase Auth:** Migración completa de Google OAuth implicit → Supabase Auth SDK
  - Google Sign-In vía Supabase OAuth provider
  - Apple Sign-In vía Supabase OAuth provider (JWT secret key, Services ID, Key ID)
  - Guest login preservado
  - Sesiones persistentes con JWT en localStorage (sobrevive cierre de navegador)
- **Recolección de Teléfono Obligatoria:** Pantalla post-OAuth que pide número con código de país
  - Validación regex: `^\+\d{10,15}$`
  - Auto-vinculación con `channel_users` existentes (WhatsApp)
  - Creación automática de `channel_users` si no existe
- **WhatsApp Opt-In:** Pantalla que informa al usuario sobre LOGOS en WhatsApp
  - Link directo `wa.me/19788012275` con mensaje pre-llenado
  - Solo aparece una vez (`profiles.whatsapp_optin`)
  - Opción "Ahora no" para continuar a la app
- **Persistencia de Estado Actual:** Los 24 parámetros se guardan automáticamente en `profiles.last_state`
  - Carga desde Supabase al iniciar sesión
  - Guardado debounced (2 segundos) al cambiar cualquier slider
  - Estado se restaura al siguiente login
- **Identidad Cross-Channel Unificada:** Teléfono como identificador universal
  - `profiles.phone` vincula web ↔ WhatsApp ↔ SMS ↔ Voz
  - `getUserState()` lee de `profiles.last_state` cuando usuario está vinculado
  - `updateUserState()` escribe a ambos `channel_users.state` Y `profiles.last_state`
  - Estado sincronizado automáticamente entre todos los canales
- **Backend OpenAI Agents SDK:** Agente ΛOGOS con 12 tools custom
  - `get_user_state`, `compute_metrics`, `detect_levin_signals`, `detect_hoffman_biases`
  - `update_user_state`, `link_account`, `get_session_history`
  - `evaluate_decision`, `detect_crisis`, `run_simulation`
  - `schedule_calendar_event`, `generate_weekly_report`
  - Conversaciones persistentes vía OpenAI Conversations API
- **Supabase PostgreSQL:** Migración completa de DB local a Supabase
  - Tabla `profiles` (extiende `auth.users` con phone, last_state, whatsapp_optin)
  - Tabla `channel_users` (WhatsApp/Voice/SMS con user_id FK → profiles)
  - Tabla `sessions` (snapshots con métricas)
  - Tabla `conversations` (persistencia de conversationId por canal)
  - Tabla `conversation_log` (mensajes WhatsApp persistidos)
  - Tabla `daily_snapshots` (snapshots diarios)
  - Row Level Security (RLS) policies
  - Trigger auto-create profile on signup
- **Frontend `supabase.js`:** Servicio centralizado de Supabase
  - `signInWithGoogle()`, `signInWithApple()`, `signOut()`
  - `getCurrentUser()`, `getSession()`, `getProfile()`

#### Cambiado
- **Auth Flow:** 3 pantallas secuenciales (Login → Phone → WhatsApp Opt-In → App)
- **`App.jsx`:** Reescrito completo para Supabase Auth con estados `needsPhone` y `showWhatsAppOptIn`
- **`api.js`:** Reescrito para usar Supabase client en lugar de Express REST API
- **`SessionTracker.jsx`:** Actualizado para fetch directo desde Supabase
- **Deploy Frontend:** `/opt/logoilab/static/` → `/opt/logoilab/frontend/dist/`
- **Deploy Backend:** Nuevo servicio systemd `logos-backend` en port 3100
- **NGINX:** Nuevas rutas `/webhook/` y `/media-stream` para backend multi-canal
- **`postgres.js`:** `getUserState()` ahora hace JOIN con `profiles` para estado unificado
- **`postgres.js`:** `updateUserState()` ahora escribe a ambas tablas cuando vinculado

#### Corregido
- **Sesiones perdidas:** JWT persistente en localStorage reemplaza sessionStorage volátil
- **Conversaciones perdidas:** conversationId persistido en DB (no más in-memory Map)
- **OAuth redirect:** Corregido URI de callback de Supabase (proyecto correcto)
- **Estado perdido:** Parámetros de "Estado Actual" ahora persisten entre sesiones

---

### [2.1.0] — 2026-02-06

#### Cambiado
- **Renombrado:** "LOGOS HUMANO" → "LOGOS" en login page y header de la aplicación
- **Deployment:** Migración de Docker a NGINX estático directo (`/opt/logoilab/static/`)
- **Autenticación:** `handleLogout` ahora limpia `sessionStorage` y fuerza `window.location.href = '/'`

#### Agregado
- **Google OAuth:** Integración completa con Google Sign-In (Client ID, scopes, token extraction)
- **Guest Login:** Opción de acceso como invitado con persistencia en `sessionStorage`
- **syncUser:** Sincronización de usuarios con backend PostgreSQL vía `/api/auth/sync`
- **API Client:** `src/services/api.js` con funciones para auth, sessions, reports y health
- **Session Persistence:** Estado de usuario y token almacenados en `sessionStorage`
- **Google Calendar Scope:** Scope `calendar.events` agregado al flujo OAuth

#### Corregido
- **Logout:** Botón "Cerrar sesión" ahora funciona correctamente (limpia session + reload)
- **Logo:** Cambiado de `logo.png` importado a `/logo.svg` servido estáticamente
- **Animación:** Eliminada la elipse rotante (`logo-ring`), dejando solo efecto glow
- **Cache:** Headers `no-cache` en NGINX para evitar servir versiones antiguas
- **Docker conflicts:** Docker apagado para eliminar conflictos con NGINX

---

### [2.0.0] — 2026-01-15

#### Cambiado (Breaking)
- **Arquitectura fundamental:** Λ (Logos Alignment) es ahora el ATRACTOR FUNDAMENTAL
  - Antes: Ω era una métrica independiente
  - Ahora: Ω = f(Λ) — todas las métricas derivan de Λ
- **Refactorización completa:** Monolito de 2,484 líneas → arquitectura modular
  - `src/core/` — 7 capas de cómputo como funciones puras
  - `src/simulation/` — Motor Monte Carlo separado
  - `src/domain/` — Constantes y configuración de dominio
  - `src/types/` — Interfaces TypeScript completas
  - `src/utils/` — Utilidades matemáticas puras
  - `src/hooks/` — Bridge React ↔ Core

#### Agregado
- **Layer 7: Logos** (`core/logos.ts`) — Cómputo de Λ(x) con 4 grupos de componentes
- **Atractores duales:** A⁺ (positivo) y A⁻ (negativo) con detección automática
- **Meta-política π²(x):** Evaluación de patrones sistémicos y atractores
- **Modulación Λ:** Todas las métricas derivadas ahora son moduladas por Λ
  - V(x|Λ): Λ boost de hasta +35%
  - S(x|Λ): Λ reduce entropía hasta -40%
  - C(x|Λ): Λ boost de hasta +40%
  - F(x|Λ): Λ reduce energía libre hasta -30%
- **MetricDetailPanel:** Panel de detalle completo para cada métrica con fórmulas y desglose
- **Barrel exports:** `index.ts` en cada módulo para API limpia
- **TypeScript types:** Interfaces completas para todos los resultados de cómputo
- **useLogosEngine hook:** Orquestador que conecta core puro con React
- **useConsciousnessState hook:** Gestión de estado con helpers
- **Onboarding:** Guía interactiva de 12 pasos
- **Agente de voz:** Integración ElevenLabs para interacción conversacional
- **Session Tracker:** Tracking de sesiones con snapshots

#### Cambiado
- **computeOmega:** Ahora Ω = Λ×0.6 + derivedHealth×0.4 (antes era independiente)
- **computeCoherence:** Usa media armónica (antes: media aritmética)
- **inhibitionPolicy:** Basada en Λ̇ (derivada temporal de Λ)
- **Levin signals:** Incluye detección de A⁻ con severidad 0.95
- **Hoffman biases:** Incluye "Iluminación Prematura" (Λ alto sin wisdom)
- **Watson energy:** Óptimos ahora son Λ-modulados
- **Monte Carlo:** Tracking de veredictos π por paso temporal + Wilson CIs

#### Deprecado
- Cómputo de Ω independiente de Λ
- Política de inhibición sin Λ̇
- Coherencia por media aritmética

---

### [1.0.0] — 2025-10-01

#### Agregado (Release Inicial)
- **6 dominios × 4 dimensiones = 24 dimensiones** de consciencia
- **Métricas:** V (Viabilidad), S (Entropía), C (Coherencia), F (Energía Libre), Ω (Omega)
- **5 capas científicas:** Friston, Levin, Watson, Hoffman, Penrose
- **Política de inhibición π(x):** PAUSA, ESPERA, MONITOREA, ACTÚA
- **Monte Carlo:** Simulación estocástica con N configurable
- **Dashboard React:** Pestañas Estado, Motor, Decisiones, Trayectoria, Monte Carlo, Teoría
- **Visualización:** Recharts (RadarChart, LineChart, AreaChart, BarChart)
- **Recomendaciones diarias** basadas en estado actual
- **Manual teórico** integrado
- **Responsive design** con tema oscuro

#### Stack Tecnológico
- React 18 + Vite 5
- TypeScript 5.3
- Recharts 2.12
- Deployment: Docker + NGINX reverse proxy

---

## Roadmap

### Completado (anteriormente planificado)
- [x] ~~i18n: react-i18next + ES/EN~~ → Implementado en v3.0.0
- [x] ~~7° Dominio Alimento Sagrado (28 dims)~~ → Implementado en v3.0.0
- [x] ~~iOS + Apple Watch + HealthKit~~ → Implementado en v3.1.0
- [x] ~~Loop biométrico cerrado~~ → Implementado en v3.2.0
- [x] ~~Voice agent read/write fixes~~ → Corregido en v3.2.0
- [x] ~~547 tests automatizados~~ → Implementado en v3.0.0 → **707 tests** en v3.3.0
- [x] ~~AI Interpretation Panels (TabAIGuide)~~ → Implementado en v3.3.0
- [x] ~~IFC ↔ LOGOS Bridge~~ → Implementado en v3.3.0
- [x] ~~Coherence Matrix fix (data + CSS)~~ → Corregido en v3.3.0
- [x] ~~Backend PM2 process management~~ → Implementado en v3.3.0

### [3.4.0] — Planificado
- [ ] Google Calendar integration real (OAuth token → Calendar API)
- [ ] Daily snapshots automáticos (cron + PostgreSQL)
- [ ] Notificaciones push para check-in diario
- [ ] Export de datos en CSV/PDF
- [ ] Reportes longitudinales mejorados

### [3.4.0] — Planificado
- [ ] Backend locale (agent prompts, WhatsApp language detection)
- [ ] ElevenLabs multilingual voice
- [ ] `profiles.locale` column for user language preference

### [4.0.0] — Futuro
- [ ] Web Workers para Monte Carlo (no bloquear UI thread)
- [ ] PWA (Progressive Web App) con offline support
- [ ] Modo colaborativo (compartir estado con terapeuta/coach)
- [ ] API pública para integraciones externas
- [ ] Machine Learning: predicción de Λ basada en historial
- [ ] Visualización "ΛOGOS Resonance" (arte generativo interactivo)
- [ ] Resonance metric R(x) — angular synchronisation on Russell's Circumplex

---

## Referencias Cruzadas

- [Índice de Documentación](./INDEX.md)
- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Especificación Matemática](./MATHEMATICAL_SPEC.md)
- [Deployment](./DEPLOYMENT.md)
- [Loop Biométrico](./BIOMETRIC_FEEDBACK_LOOP.md)
- [Agente de Voz](./VOICE_AGENT.md)
