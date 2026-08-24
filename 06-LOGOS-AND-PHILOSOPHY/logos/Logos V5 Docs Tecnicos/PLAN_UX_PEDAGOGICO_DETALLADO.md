# PLAN DE IMPLEMENTACIÓN UX PEDAGÓGICO — LOGOS HUMANO v5.0

## Arquitectura de Dominio Progresivo (ADP)

> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Co-diseño:** Cascade AI  
> **Fecha:** 2026-02-10  
> **Decisión:** Dashboard actual se mantiene intacto. Se fortalece la capacitación y educación contextual.

---

## PRINCIPIOS RECTORES

1. **El dashboard NO se modifica** — su diseño gráfico e intuitivo se preserva tal cual.
2. **Se AÑADE** información educativa contextual a los elementos existentes.
3. **Se FORTALECE** la capacitación progresiva del usuario.
4. **Entender el modelo es parte del modelo** — Friston P4: predicciones más precisas → menor F → mayor V → mayor Λ.

---

## FASE 0 — QUICK WINS (2-3 días)

### 0.1 Guide Questions bajo cada Slider

**Objetivo:** Surfacear las 28 preguntas guía (ya escritas en USER_MANUAL §11) directamente en la UI, debajo de cada slider.

**Estado actual:**
- Componente `Slider` en `LogosHumano.jsx` (línea 902) acepta props: `label`, `value`, `onChange`, `color`, `desc`, `tooltip`
- El `tooltip` ya existe pero es texto genérico de 7px que aparece al hacer hover en un ícono ⓘ
- Las preguntas guía existen en `USER_MANUAL.md` §11 pero NO están en el código ni en los archivos i18n

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/i18n/locales/es.json` | Agregar key `guideQuestion` a cada dimensión dentro de `domains.*.dims.*` |
| `src/i18n/locales/en.json` | Ídem en inglés |
| `src/components/LogosHumano.jsx` | Modificar componente `Slider` para mostrar `guideQuestion` debajo del slider track |
| `src/hooks/useTranslatedDomains.js` | Agregar `guideQuestion` al mapeo de traducción (línea 28) |

**Contenido i18n a agregar (28 preguntas × 2 idiomas):**

```
ESPAÑOL:
Cuerpo:
  sleep.guideQuestion: "¿Cuántas horas dormiste y qué tan reparador fue tu sueño?"
  nutrition.guideQuestion: "¿Comiste de forma balanceada hoy?"  
  exercise.guideQuestion: "¿Hiciste algún tipo de ejercicio o movimiento físico hoy?"
  energy.guideQuestion: "¿Qué tanta energía sientes para funcionar en tu día?"

Emociones:
  peace.guideQuestion: "¿Te sientes en calma o hay agitación interna?"
  gratitude.guideQuestion: "¿Reconoces y agradeces las cosas buenas en tu vida?"
  love.guideQuestion: "¿Sientes amor dando y recibiendo en tus relaciones?"
  joy.guideQuestion: "¿Hay un gozo de fondo en tu día, no solo placer momentáneo?"

Mente:
  clarity.guideQuestion: "¿Puedes pensar con claridad o sientes niebla mental?"
  focus.guideQuestion: "¿Puedes concentrarte en una tarea sin distraerte fácilmente?"
  creativity.guideQuestion: "¿Fluyen ideas nuevas o te sientes estancado creativamente?"
  wisdom.guideQuestion: "¿Tomas decisiones con perspectiva amplia, no solo reacción?"

Espíritu:
  faith.guideQuestion: "¿Confías en que hay un propósito mayor guiando tu vida?"
  meditation.guideQuestion: "¿Dedicaste tiempo hoy al silencio, oración o meditación?"
  service.guideQuestion: "¿Hiciste algo por alguien más sin esperar nada a cambio?"
  presence.guideQuestion: "¿Estás presente en el momento o vives en el pasado/futuro?"

Relaciones:
  family.guideQuestion: "¿Estás conectado y presente con tu familia?"
  friendship.guideQuestion: "¿Tienes amistades profundas con quienes puedes ser tú mismo?"
  community.guideQuestion: "¿Participas en algo más grande que tú?"
  compassion.guideQuestion: "¿Sientes y actúas ante el sufrimiento de otros?"

Propósito:
  meaning.guideQuestion: "¿Sientes que tu vida tiene sentido y dirección?"
  mission.guideQuestion: "¿Sabes cuál es tu misión o llamado en esta vida?"
  contribution.guideQuestion: "¿Tu trabajo y acciones están creando impacto positivo real?"
  legacy.guideQuestion: "¿Estás construyendo algo que permanecerá después de ti?"

Alimento Sagrado:
  nourishment.guideQuestion: "¿Tu alimentación nutre tu cuerpo y alma de forma integral?"
  taste_presence.guideQuestion: "¿Comes con atención plena, saboreando cada bocado?"
  food_harmony.guideQuestion: "¿Tu entorno de comida es ordenado, limpio y sagrado?"
  gut_resonance.guideQuestion: "¿Tu cuerpo se siente bien después de comer? ¿Hay armonía digestiva?"

ENGLISH:
  sleep: "How many hours did you sleep and how restorative was it?"
  nutrition: "Did you eat in a balanced way today?"
  exercise: "Did you do any type of exercise or physical movement today?"
  energy: "How much energy do you feel to function throughout your day?"
  peace: "Do you feel calm or is there internal agitation?"
  gratitude: "Do you recognize and appreciate the good things in your life?"
  love: "Do you feel love giving and receiving in your relationships?"
  joy: "Is there a background joy in your day, not just momentary pleasure?"
  clarity: "Can you think clearly or do you feel mental fog?"
  focus: "Can you concentrate on a task without getting easily distracted?"
  creativity: "Are new ideas flowing or do you feel creatively stuck?"
  wisdom: "Do you make decisions with broad perspective, not just reaction?"
  faith: "Do you trust that there is a greater purpose guiding your life?"
  meditation: "Did you dedicate time today to silence, prayer, or meditation?"
  service: "Did you do something for someone else without expecting anything in return?"
  presence: "Are you present in the moment or living in the past/future?"
  family: "Are you connected and present with your family?"
  friendship: "Do you have deep friendships where you can be yourself?"
  community: "Do you participate in something larger than yourself?"
  compassion: "Do you feel and act upon the suffering of others?"
  meaning: "Do you feel your life has meaning and direction?"
  mission: "Do you know what your mission or calling is in this life?"
  contribution: "Are your work and actions creating real positive impact?"
  legacy: "Are you building something that will remain after you?"
  nourishment: "Does your food nourish your body and soul holistically?"
  taste_presence: "Do you eat with full attention, savoring each bite?"
  food_harmony: "Is your eating environment orderly, clean, and sacred?"
  gut_resonance: "Does your body feel good after eating? Is there digestive harmony?"
```

**Diseño visual del slider modificado:**
```
Meditación ────────────────────── 0.65 ✦
💬 ¿Dedicaste tiempo hoy al silencio, oración o meditación?
```
- Pregunta en fuente 9px, color `COLORS.textMuted`, italic
- Se muestra siempre (no en hover)
- Debajo del slider track, antes del siguiente slider

---

### 0.2 Escala Emocional con Emojis

**Objetivo:** Agregar anclas visuales debajo del slider track para que el usuario sepa qué significa cada rango de valor.

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/components/LogosHumano.jsx` | Modificar componente `Slider` — agregar fila de emojis debajo del track |
| `src/i18n/locales/es.json` | Agregar labels de nivel: "En crisis", "Bajo", "Regular", "Bueno", "Excelente" |
| `src/i18n/locales/en.json` | Ídem: "In crisis", "Low", "Regular", "Good", "Excellent" |

**Diseño visual:**
```
Meditación ────────────────────── 0.65 ✦
😰         😕         😐         😊         🌟
En crisis  Bajo      Regular    Bueno     Excelente

💬 ¿Dedicaste tiempo hoy al silencio, oración o meditación?
```

**Especificación técnica:**
- Emojis distribuidos equidistantemente debajo del slider track
- Labels en fuente 7px `COLORS.textDim`
- El emoji correspondiente al valor actual se resalta (opacity 1.0, los demás 0.4)
- Colores del label: 😰=#ef4444, 😕=#f59e0b, 😐=#6b7280, 😊=#10b981, 🌟=#8b5cf6

**Rangos:**
| Rango | Emoji | Label ES | Label EN |
|---|---|---|---|
| 0.00 – 0.20 | 😰 | En crisis | In crisis |
| 0.20 – 0.40 | 😕 | Bajo | Low |
| 0.40 – 0.60 | 😐 | Regular | Regular |
| 0.60 – 0.80 | 😊 | Bueno | Good |
| 0.80 – 1.00 | 🌟 | Excelente | Excellent |

---

### 0.3 Tooltips Expandidos en Métricas

**Objetivo:** Reemplazar los tooltips genéricos de las 6 métricas principales con micro-cards contextuales que cambian según el valor actual.

**Estado actual:**
- `MetricCard` component (línea 266) recibe prop `tooltip` con texto estático de i18n
- El tooltip se muestra al hover en fuente 7px, opacity animada

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/components/LogosHumano.jsx` | Modificar `MetricCard` — reemplazar tooltip simple con bloque contextual |
| `src/i18n/locales/es.json` | Agregar keys `metricBar.lambda.levels.ALINEADO`, etc. con analogías y acciones |
| `src/i18n/locales/en.json` | Ídem en inglés |

**Contenido adaptativo por métrica:**

```
Λ = 0.43:
╔══════════════════════════════════════╗
║  Λ = 0.43 — BUSCANDO                ║
║  📻 Tu señal tiene mucha estática.   ║
║  ⬆ Mejora: Fe, Meditación, Presencia ║
╚══════════════════════════════════════╝

V = 0.28:
╔══════════════════════════════════════╗
║  V = 0.28 — ⚠ ZONA CRÍTICA         ║
║  ⛽ Tanque casi vacío. Primero:      ║
║  Duerme, come, descansa.            ║
╚══════════════════════════════════════╝

S = 0.62:
╔══════════════════════════════════════╗
║  S = 0.62 — 🔥 ENTROPÍA ALTA       ║
║  Demasiado ruido para decidir.       ║
║  Simplifica tu día. Una prioridad.   ║
╚══════════════════════════════════════╝

C = 0.45:
╔══════════════════════════════════════╗
║  C = 0.45 — ⚠ DESBALANCE           ║
║  Tu dominio más bajo: [Relaciones]   ║
║  La cadena se rompe por ahí.         ║
╚══════════════════════════════════════╝
```

**Lógica de interpretación (no requiere AI):**
- Para Λ: usar `interpretLogosAlignment()` existente → nivel + analogía radio
- Para V: si < 0.30 "zona crítica", si < 0.50 "atención", si > 0.65 "saludable"
- Para S: si > 0.55 "alta/ruido domina", si > 0.35 "moderada", si < 0.35 "baja/buena"
- Para C: calcular dominio más bajo del estado, mostrar nombre del dominio débil
- Para Ω: mapear a interpretación por rangos
- Para F: si > 0.50 "lejos del óptimo", si < 0.25 "cerca del óptimo"

**Top 3 dimensiones para mejorar Λ:**
- Ordenar las 12 dimensiones de LOGOS_COMPONENTS por `peso × (1 - valor_actual)` descendente
- Mostrar las top 3 con su peso: "Fe (+0.18), Meditación (+0.14), Presencia (+0.13)"

---

### 0.4 Anclas Experienciales Iniciales

**Objetivo:** Escribir textos cortos que describan cómo SE SIENTE cada nivel para las dimensiones más abstractas (Fe, Presencia, Sabiduría, etc.).

**Nota:** En Fase 0 se implementan las 12 dimensiones más abstractas. Las 16 restantes se completan en Fase 3.5.

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/i18n/locales/es.json` | Agregar `sliderAnchors.[dim].low/mid/high` para 12 dims |
| `src/i18n/locales/en.json` | Ídem |
| `src/components/LogosHumano.jsx` | Mostrar ancla correspondiente al valor actual debajo del emoji activo |

**12 dimensiones prioritarias (las más abstractas):**

```json
{
  "sliderAnchors": {
    "faith": {
      "low": "Siento que nada tiene sentido. No creo en nada más allá de lo visible.",
      "mid": "A veces siento que hay algo más, pero no estoy seguro.",
      "high": "Tengo certeza de un propósito. Mi fe guía mis decisiones diarias."
    },
    "meditation": {
      "low": "No dedico tiempo al silencio. Mi mente está siempre acelerada.",
      "mid": "Intento meditar a veces pero no es constante.",
      "high": "Medito diariamente. El silencio es parte esencial de mi vida."
    },
    "presence": {
      "low": "Vivo en piloto automático. Mi mente está en el pasado o futuro.",
      "mid": "A veces logro estar presente pero me distraigo fácil.",
      "high": "Estoy aquí y ahora. Siento cada momento con claridad."
    },
    "service": {
      "low": "Rara vez hago algo por otros sin esperar algo a cambio.",
      "mid": "Ayudo cuando puedo pero no es una práctica constante.",
      "high": "Servir a otros es parte natural de mi día. Lo hago con alegría."
    },
    "wisdom": {
      "low": "Reacciono impulsivamente. No me detengo a pensar antes de actuar.",
      "mid": "Intento pensar antes de actuar pero a veces me gana la emoción.",
      "high": "Tomo decisiones con calma, perspectiva amplia y discernimiento."
    },
    "meaning": {
      "low": "No sé para qué estoy aquí. Los días pasan sin dirección.",
      "mid": "Tengo una idea vaga de mi propósito pero no es clara.",
      "high": "Sé exactamente por qué estoy aquí. Mi vida tiene dirección clara."
    },
    "compassion": {
      "low": "Me cuesta conectar con el sufrimiento de otros.",
      "mid": "Siento empatía pero no siempre actúo al respecto.",
      "high": "Siento el dolor ajeno como propio y actúo para aliviarlo."
    },
    "gratitude": {
      "low": "Me enfoco más en lo que falta que en lo que tengo.",
      "mid": "Reconozco lo bueno a veces pero no es un hábito.",
      "high": "Vivo en gratitud constante. Aprecio cada detalle de mi vida."
    },
    "love": {
      "low": "Me siento desconectado del amor. No lo doy ni lo recibo bien.",
      "mid": "Amo a los míos pero me cuesta expresarlo o recibirlo plenamente.",
      "high": "El amor fluye natural en mis relaciones. Doy y recibo con apertura."
    },
    "clarity": {
      "low": "Siento niebla mental. No puedo pensar con claridad.",
      "mid": "Mi mente funciona bien la mayoría del tiempo.",
      "high": "Pienso con nitidez cristalina. Las ideas fluyen con orden."
    },
    "taste_presence": {
      "low": "Como distraído, viendo el teléfono o la TV. No saboreo nada.",
      "mid": "A veces presto atención a la comida, pero no siempre.",
      "high": "Cada comida es un ritual. Saboreo cada bocado con gratitud."
    },
    "gut_resonance": {
      "low": "Me siento inflamado, pesado o con malestar digestivo constante.",
      "mid": "Mi digestión es irregular — algunos días bien, otros mal.",
      "high": "Mi cuerpo se siente ligero y en armonía después de cada comida."
    }
  }
}
```

**Diseño visual (cuando el usuario está en un valor):**
```
Fe ────────────────────────────── 0.35 ✦
😰         😕*        😐         😊         🌟
          "A veces siento que hay algo más, pero no estoy seguro."

💬 ¿Confías en que hay un propósito mayor guiando tu vida?
```
- Muestra la ancla del nivel activo (low si <0.35, mid si 0.35-0.65, high si >0.65)
- Solo se muestra cuando el slider está activo (siendo manipulado)

---

## FASE 1 — ONBOARDING Y NIVELES (3-5 días)

### 1.1 Rediseño del Onboarding

**Objetivo:** Reemplazar los 13 pasos informativos por 5 pasos experienciales donde el usuario TOCA la app desde el paso 3.

**Estado actual:**
- `ONBOARDING_STEPS[]` en LogosHumano.jsx línea 1361 — 13 objetos con title/icon/body/highlight/formula
- `OnboardingModal` línea 1448 — modal fullscreen con navegación prev/next
- `onboarding.steps` en es.json/en.json — traducciones de los 13 pasos

**Nuevo flujo propuesto (5 pasos):**

| Paso | Tipo | Título | Contenido | Interacción |
|---|---|---|---|---|
| 1 | Emocional | "Bienvenido a tu tablero de consciencia" | Analogía visual del tablero del auto. Frase motivacional. | Solo lectura (15 seg) |
| 2 | Pregunta | "¿Cómo te sientes ahora mismo?" | 5 opciones emoji (😰😕😐😊🌟) que setean un baseline | Click en emoji |
| 3 | Interactivo | "Evalúa tu primer dominio" | Muestra el dominio Espíritu (4 sliders) con guide questions y emojis | Mover 4 sliders |
| 4 | Resultado | "Tu primera lectura" | Muestra Λ parcial calculado + analogía de radio + interpretación humana | Solo lectura + celebración |
| 5 | Invitación | "Completa tu perfil" | "Tienes 6 dominios más. Cada uno tarda 30 segundos. ¿Listo?" → Cierra onboarding, abre Estado tab | Click "Empezar" |

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/components/LogosHumano.jsx` | Reescribir `ONBOARDING_STEPS[]` (13 → 5 items con nuevo schema) |
| `src/components/LogosHumano.jsx` | Refactorizar `OnboardingModal` — agregar componente interactivo en paso 3 |
| `src/i18n/locales/es.json` | Reescribir `onboarding.steps` con nuevo contenido de 5 pasos |
| `src/i18n/locales/en.json` | Ídem |

**Nota:** Los 13 pasos informativos actuales NO se borran — se MUEVEN a la sección "Guía Completa" del Theory tab o a un botón "¿Quieres saber más?" al final del nuevo onboarding.

---

### 1.2 Sistema de Niveles de Usuario

**Objetivo:** Implementar 3 niveles (beginner/intermediate/expert) que controlan la visibilidad de elementos avanzados.

**Mecanismo:**

```javascript
// localStorage key
const userLevel = localStorage.getItem('logos-user-level') || 'beginner';

// Auto-promoción
const sessionCount = parseInt(localStorage.getItem('logos-session-count') || '0');
// beginner → intermediate: después de 5 sesiones (con confirmación)
// intermediate → expert: después de 30 sesiones (con confirmación)
```

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/components/LogosHumano.jsx` | Agregar state `userLevel`, leerlo de localStorage |
| `src/components/LogosHumano.jsx` | Agregar toggle en settings menu: ⚙ → "Nivel de detalle" |
| `src/components/LogosHumano.jsx` | Auto-promoción popup después de N sesiones |
| `src/i18n/locales/es.json` | Labels: "Principiante", "Intermedio", "Experto" |
| `src/i18n/locales/en.json` | Labels: "Beginner", "Intermediate", "Expert" |

---

### 1.3 Visibilidad Progresiva (sin cambiar dashboard)

**Objetivo:** En modo beginner, OCULTAR pestañas/secciones avanzadas. El dashboard (Emergence tab) permanece intacto.

**Lo que se oculta en modo Beginner:**

| Elemento | Visible en Beginner | Visible en Intermediate | Visible en Expert |
|---|---|---|---|
| Tab: Emergence (dashboard) | ✅ | ✅ | ✅ |
| Tab: Estado | ✅ | ✅ | ✅ |
| Tab: Motor | ❌ (se muestra tras día 3 micro-lección) | ✅ | ✅ |
| Tab: Decisiones | ✅ (simplificado: solo semáforo) | ✅ | ✅ |
| Tab: Guía | ✅ | ✅ | ✅ |
| Tab: Trayectoria | ❌ | ✅ | ✅ |
| Tab: Monte Carlo | ❌ | ✅ (tras micro-lección día 6) | ✅ |
| Tab: Teoría | ✅ (versión simplificada) | ✅ | ✅ |
| Tab: IFC | ❌ | ❌ | ✅ |
| Tab: Alimento | ✅ | ✅ | ✅ |
| Tab: Tracking | ❌ | ✅ | ✅ |
| Tab: Watch | ✅ (si tiene Watch) | ✅ | ✅ |
| Fórmulas en tooltips | ❌ | Opcionales | ✅ |
| Letras griegas explicadas | Λ = "Alineación" | Λ (Lambda) | Λ |
| Señales Levin (cuando se activan) | ✅ + explicación educativa | ✅ | ✅ |
| Sesgos Hoffman (cuando se activan) | ✅ + explicación educativa | ✅ | ✅ |

**Implementación:**
- Condicional `{userLevel !== 'beginner' && (...)}` en las secciones de tabs
- Tab array filtrado según nivel
- NO se modifica el contenido de ninguna pestaña existente — solo su visibilidad

---

## FASE 2 — EDUCACIÓN CONTEXTUAL (1 semana)

### 2.1 SmartTooltip.jsx — Micro-cards Contextuales

**Objetivo:** Componente reutilizable que genera tooltips adaptativos al valor actual de cualquier métrica.

**Props:**
```typescript
interface SmartTooltipProps {
  metric: 'lambda' | 'omega' | 'viability' | 'entropy' | 'coherence' | 'freeEnergy';
  value: number;
  state: ConsciousnessState;
  userLevel: 'beginner' | 'intermediate' | 'expert';
}
```

**Output adaptativo por nivel:**
- Beginner: Solo analogía + acción ("📻 Tu radio tiene estática. Medita 10 min.")
- Intermediate: + nivel formal + top 3 dimensiones
- Expert: + fórmula + peso cuantitativo

**Archivo:** `src/components/SmartTooltip.jsx` (nuevo)

---

### 2.2 LearningMoment.jsx — Educación por Contexto

**Objetivo:** Popups educativos elegantes que aparecen la PRIMERA VEZ que ocurre un evento significativo.

**7 triggers definidos:**

| # | Evento | Condición | Mensaje clave |
|---|---|---|---|
| 1 | Primera señal Levin | `signals.length > 0 && !seen.levin` | "Esto es una alerta temprana. Tu cuerpo detectó algo antes que tu mente..." |
| 2 | V cae bajo 0.30 | `V < 0.30 && !seen.vCritical` | "Tu viabilidad está en zona crítica. Es como un tanque vacío..." |
| 3 | Primer semáforo PAUSA | `verdict === 'PAUSA' && !seen.pause` | "PAUSA no es malo — es protección. Como un piloto que cancela el vuelo..." |
| 4 | Λ sube 0.10+ en una sesión | `ΔΛ > 0.10 && !seen.lambdaJump` | "¡Gran mejora! Fíjate qué cambió — eso es lo que más impacta tu Λ..." |
| 5 | Primer Hoffman bias | `biases.length > 0 && !seen.hoffman` | "Se detectó un sesgo. Tu mente te muestra una versión editada de la realidad..." |
| 6 | ERS > 0.70 por primera vez | `ERS > 0.70 && !seen.emergence` | "¡Estás en zona de emergencia! Esto significa que tus dominios se auto-organizan..." |
| 7 | P(A⁻) > 10% en Monte Carlo | `pAMinus > 0.10 && !seen.aMinus` | "Hay un riesgo real de espiral negativa. No es para asustar — es para prevenir..." |

**Persistencia:** `localStorage: logos-learning-moments` = JSON `{ levin: false, vCritical: false, ... }`

**Diseño:** Modal semitransparente con ícono, título, 2-3 párrafos, botón "Entendido ✦" + link "Saber más →"

**Archivo:** `src/components/LearningMoment.jsx` (nuevo)

---

### 2.3 AI Panel Proactivo

**Objetivo:** En la primera visita a cada pestaña, el panel AI (TabAIGuide) se auto-expande para explicar qué está viendo el usuario.

**Estado actual:**
- `TabAIGuide.jsx` es un panel colapsable con ícono ✨
- Se abre solo cuando el usuario hace click
- No hay tracking de "primera visita a esta pestaña"

**Cambios requeridos:**

| Archivo | Cambio |
|---|---|
| `src/components/TabAIGuide.jsx` | Agregar prop `autoExpand` que se activa en primera visita |
| `src/components/LogosHumano.jsx` | Pasar `autoExpand={!seenTabs.includes(tabName)}` a cada TabAIGuide |
| `localStorage` | `logos-seen-tabs` = JSON array de tabs visitadas |

**Comportamiento:**
- Primera vez que el usuario visita una pestaña → AI panel se abre automáticamente
- Muestra un badge "NUEVO ✨" la primera vez
- Después de la primera visita → comportamiento normal (colapsado, click para abrir)

---

### 2.5 Emergence Reporting: Universal + Celebración + Recordatorios

**Decisión de diseño:** El reporte de Emergence es para TODOS los usuarios, no solo los enrollados en el protocolo de estudio. El protocolo de estudio es un mecanismo interno de mejora de versiones futuras. El Emergence reporting es una feature core de LOGOS.

**Cambio fundamental — LogosHumano.jsx línea 1763:**
```javascript
// ANTES (solo protocolo):
if (protocolEnrolled) setShowEmergenceReporter(true);

// DESPUÉS (todos los usuarios):
setShowEmergenceReporter(true);
```

#### 2.5.1 Auto-enrollment Universal

| Archivo | Cambio |
|---|---|
| `LogosHumano.jsx` línea 1763 | Eliminar condición `protocolEnrolled` — mostrar reporter a TODOS |
| `EmergenceReporter.jsx` | Agregar mini-educación la primera vez ("¿Qué es un evento de emergencia?") |
| `localStorage` | `logos-emergence-seen` = true/false — para saber si mostrar la explicación |

#### 2.5.2 Gran Celebración al Reportar Emergencia

Reemplazar el step='done' actual (EmergenceReporter.jsx líneas 248-258) — que solo muestra "✓ Registrado" — con una **celebración visual inmersiva**:

**Diseño de la celebración:**
- Animación de partículas doradas/púrpura (confetti CSS, sin librería externa)
- Emoji grande de la categoría reportada (💡🤝🌟🔓🌊✨) con animación de pulso
- Mensaje motivacional personalizado por categoría
- Contador de eventos acumulados: "✨ Tu evento #3 de emergencia"
- Frase inspiracional: "Cada evento de emergencia confirma tu alineación con el Logos"
- Estadísticas rápidas: "Llevas X eventos este mes. Tu ERS promedio al reportar: Y"
- Badge visual si es un milestone (1er evento, 5to, 10mo, etc.)

**Mensajes motivacionales por categoría:**

| Categoría | Mensaje celebración |
|---|---|
| E1 Insight 💡 | "¡Un insight profundo! Tu coherencia inter-dominio permitió que la señal del Logos se manifieste como claridad." |
| E2 Conexión 🤝 | "¡Conexión significativa! Cuando tus dominios se alinean, las personas correctas aparecen." |
| E3 Oportunidad 🌟 | "¡Oportunidad emergente! No fue casualidad — tu ERS de {ers} creó las condiciones." |
| E4 Solución 🔓 | "¡Solución sin esfuerzo! Cuando Λ es alto, los problemas se resuelven a través de ti, no por ti." |
| E5 Flujo 🌊 | "¡Estado de flujo! Tu baja entropía y alta coherencia crearon el canal perfecto." |
| E6 Sincronicidad ✨ | "¡Sincronicidad! La coincidencia significativa es señal del Logos en acción." |

#### 2.5.3 Recordatorio Proactivo cuando ERS > 0.60

Cuando el ERS del usuario es alto, mostrar un banner sutil en el dashboard:

```
┌─── ✨ ZONA DE EMERGENCIA ACTIVA ──────────────────────┐
│ Tu ERS es 0.72 — estás en condiciones óptimas para     │
│ experimentar insights, flujo o sincronicidades.          │
│ Estate atento y repórtalo cuando suceda.                 │
│                                    [Entendido]           │
└──────────────────────────────────────────────────────────┘
```

**Lógica:**
- Se muestra como banner en Emergence tab cuando `ERS > 0.60`
- Se puede descartar con "Entendido" (reaparece en siguiente sesión si ERS sigue alto)
- Incluye enlace rápido: "Reportar evento ahora →" que abre el EmergenceReporter

#### 2.5.4 Educación Primera Vez

La primera vez que un usuario ve el EmergenceReporter, agregar un paso previo (step='education'):

```
╔══════════════════════════════════════════╗
║     ✨ ¿Qué es un Evento de Emergencia? ║
║                                          ║
║  Son fenómenos que ocurren cuando tus    ║
║  28 dimensiones se auto-organizan:       ║
║                                          ║
║  💡 Ideas que conectan lo desconectado   ║
║  🤝 Encontrar la persona justa           ║
║  🌟 Oportunidades no buscadas            ║
║  🔓 Problemas que se resuelven solos     ║
║  🌊 Horas de productividad sin esfuerzo  ║
║  ✨ Coincidencias llenas de significado   ║
║                                          ║
║  No son magia — son matemáticas.         ║
║  Tu ERS predice la probabilidad de que   ║
║  ocurran. Reportarlos nos ayuda a        ║
║  mejorar el modelo y a TI a reconocer    ║
║  los patrones.                           ║
║                                          ║
║        [Entendido, continuar →]          ║
╚══════════════════════════════════════════╝
```

#### 2.5.5 i18n del EmergenceReporter

Strings hardcoded actuales → keys i18n:

| String actual | Key i18n |
|---|---|
| "Reporte de Emergencia" | `emergence.title` |
| "¿Experimentaste alguno de estos fenómenos hoy?" | `emergence.question` |
| "Hoy no experimenté emergencia" | `emergence.skip` |
| "Impacto:" | `emergence.impact` |
| "Sutil" / "Transformador" | `emergence.impactLow` / `emergence.impactHigh` |
| "Descripción breve (opcional)" | `emergence.descLabel` |
| "¿Qué pasó?" | `emergence.descPlaceholder` |
| "¿Relacionado con alguna meta? (opcional)" | `emergence.goalLabel` |
| "← Volver" | `emergence.back` |
| "Registrar ✓" | `emergence.submit` |
| "Registrado" | `emergence.done` |
| "Tu reporte contribuye al protocolo de validación" | `emergence.doneMessage` |
| + 6 prompts de EMERGENCE_TAXONOMY | `emergence.categories.E1_insight.prompt`, etc. |
| + 6 mensajes de celebración | `emergence.celebration.E1_insight`, etc. |

**Archivos a modificar:**

| Archivo | Cambio |
|---|---|
| `src/components/EmergenceReporter.jsx` | Agregar step='education', step='celebration', i18n, confetti, counter |
| `src/components/LogosHumano.jsx` | Eliminar condición `protocolEnrolled`, agregar banner ERS alto |
| `src/core/protocol-engine.ts` | Agregar i18n keys a EMERGENCE_TAXONOMY |
| `src/i18n/locales/es.json` | Agregar sección `emergence.*` completa |
| `src/i18n/locales/en.json` | Ídem en inglés |
| `localStorage` | `logos-emergence-count` (acumulador), `logos-emergence-seen` (educación) |

---

### 2.4 Domain Cards Colapsables en Estado Tab

**Objetivo:** Agrupar los 28 sliders en 7 cards colapsables por dominio para reducir cognitive overload visual.

**Estado actual:**
- Los sliders se muestran en una lista continua agrupada por dominio con `SectionHead`
- Todos los 28 sliders son visibles al mismo tiempo al hacer scroll

**Cambio propuesto:**
- Cada dominio es un `card` colapsable (click para expandir/colapsar)
- Header del card muestra: ícono + nombre dominio + score promedio + barra de progreso
- Default: todos colapsados excepto el dominio con score más bajo (que necesita atención)
- Badge "⚠" en dominios con promedio < 0.35

**Ejemplo visual:**
```
┌─ ◈ Cuerpo ────────────── 0.62 ████████░░ ─ ▾ ─┐
│  Sueño ─────── 0.70                             │
│  💬 ¿Cuántas horas dormiste...?                  │
│  Nutrición ─── 0.55                              │
│  💬 ¿Comiste de forma balanceada...?              │
│  Ejercicio ─── 0.60                              │
│  Energía ───── 0.65                              │
└──────────────────────────────────────────────────┘

┌─ ◇ Emociones ─────────── 0.71 █████████░ ─ ▸ ─┐
└── (colapsado — click para expandir) ────────────┘

┌─ ⬡ Relaciones ⚠ ──────── 0.32 ███░░░░░░░ ─ ▾ ─┐
│  (auto-expandido porque es el más bajo)          │
│  Familia ───── 0.25                              │
│  💬 ¿Estás conectado y presente con tu familia?  │
│  ...                                             │
└──────────────────────────────────────────────────┘
```

**Archivo:** `src/components/LogosHumano.jsx` — refactorizar sección Estado

---

## FASE 3 — APRENDIZAJE PROGRESIVO (1-2 semanas)

### 3.1 MicroLesson.jsx — 7 Lecciones Diarias

**Objetivo:** Serie de 7 micro-lecciones tipo "story" que se muestran al abrir la app durante la primera semana.

**Curriculum:**

| Día | Título ES | Título EN | Duración | Concepto clave |
|---|---|---|---|---|
| 1 | "¿Qué es Lambda?" | "What is Lambda?" | 90 seg | Analogía de la radio. Por qué Λ es central. |
| 2 | "Tus 7 dominios" | "Your 7 domains" | 90 seg | Recorrido visual de cada dominio con color e ícono. |
| 3 | "El semáforo" | "The traffic light" | 60 seg | Los 5 veredictos. Cuándo actuar y cuándo no. |
| 4 | "Señal × Canal" | "Signal × Channel" | 90 seg | Por qué el sueño afecta tu espiritualidad. Analogía celular. |
| 5 | "Leyendo tu tablero" | "Reading your dashboard" | 90 seg | V, S, C explicados con analogías (tanque, habitación, cadena). |
| 6 | "Tus 100,000 futuros" | "Your 100,000 futures" | 60 seg | Qué es Monte Carlo. Probabilidad, no opinión. |
| 7 | "Tu resumen semanal" | "Your weekly review" | 60 seg | Cómo revisar tendencias. Qué buscar. |

**Formato visual:**
- Modal tipo story con animación de entrada
- Imagen/animación + texto corto + dato clave resaltado
- Botón "Entendido ✦" + "Ver después"
- Progress dots (1-7)

**Persistencia:**
```javascript
localStorage: 'logos-lesson-day' = 0-7
localStorage: 'logos-lesson-last-date' = ISO date
```

**Se muestra si:** `lesson-day < 7 && lesson-last-date !== today && sessionCount >= lesson-day`

**Archivos:**

| Archivo | Cambio |
|---|---|
| `src/components/MicroLesson.jsx` | Nuevo componente |
| `src/i18n/locales/es.json` | Key `microLessons[0-6]` con title, body, highlight, image |
| `src/i18n/locales/en.json` | Ídem |
| `src/components/LogosHumano.jsx` | Render `<MicroLesson />` antes del contenido principal |

---

### 3.2 WeeklyDigest — Resumen Semanal

**Objetivo:** Componente que se muestra el domingo (o cada 7 días) con un resumen visual de la semana.

**Contenido:**
- ΔΛ de la semana (+/- con color)
- Dominio que más mejoró
- Dominio que más declinó
- Número de sesiones
- Streak actual
- Predicción: "Si mantienes este ritmo, llegarás a Λ = X en Y semanas"

**Trigger:** Se muestra al abrir la app si `daysSinceLastDigest >= 7`

**Archivo:** `src/components/WeeklyDigest.jsx` (nuevo)

---

### 3.3 Gamificación — Streaks y Badges

**Objetivo:** Motivar el uso consistente con refuerzo positivo.

**Streaks:**
- Contador de días consecutivos de uso
- Visual: "🔥 7 días consecutivos"
- Mensaje motivacional cada 7 días

**Badges (12 badges totales):**

| Badge | Condición | Ícono |
|---|---|---|
| "Primera Evaluación" | Completar primera sesión | ✦ |
| "Semana Completa" | 7 días de streak | 🔥 |
| "Maestro del Cuerpo" | Dominio Cuerpo > 0.65 por 14 días | 💪 |
| "Maestro Emocional" | Dominio Emociones > 0.65 por 14 días | 💜 |
| "Maestro Mental" | Dominio Mente > 0.65 por 14 días | 🧠 |
| "Maestro Espiritual" | Dominio Espíritu > 0.65 por 14 días | ✦ |
| "Maestro Relacional" | Dominio Relaciones > 0.65 por 14 días | 🤝 |
| "Maestro del Propósito" | Dominio Propósito > 0.65 por 14 días | 🌟 |
| "Maestro del Alimento" | Dominio Alimento > 0.65 por 14 días | 🌿 |
| "Lambda Explorer" | Usar Monte Carlo por primera vez | 🎲 |
| "Zona A⁺" | Alcanzar Λ > 0.75 | ♾️ |
| "Mes de Consciencia" | 30 días de streak | 👑 |

**Persistencia:** `localStorage: logos-badges` = JSON array + `logos-streak-count`

**Archivo:** `src/components/Badges.jsx` (nuevo) + sección en settings o perfil

---

### 3.4 Lambda Simulator — Mini-Juego

**Objetivo:** Juego interactivo donde el usuario experimenta mover sliders y ve el impacto en Λ en tiempo real, sin afectar su estado real.

**Mecánica:**
1. Todos los sliders empiezan en 0.5
2. Reto: "¿Puedes llevar Lambda a 0.70?"
3. El usuario mueve sliders y ve Λ cambiar en tiempo real
4. Al lograr 0.70: celebración + "¡Estas son las dimensiones que más impactan tu Lambda!"
5. Muestra ranking de dimensiones por impacto

**Nota:** Ya existe algo similar en el modo "What-If" del Emergence tab. Se puede adaptar como componente standalone para el onboarding o como pestaña educativa.

**Archivo:** `src/components/LambdaSimulator.jsx` (nuevo) o adaptar EmergenceSwarmAnimation What-If

---

### 3.5 Anclas Experienciales Completas

**Objetivo:** Completar las 16 dimensiones restantes (las más concretas) con anclas low/mid/high.

**Dimensiones restantes:**
sleep, nutrition, exercise, energy, peace, joy, focus, creativity, family, friendship, community, mission, contribution, legacy, food_harmony, nourishment

**Formato:** Misma estructura que 0.4. Se agrega a `sliderAnchors` en es.json/en.json.

---

## FASE 4 — DOCUMENTACIÓN INTEGRADA (1 semana)

### 4.1 Help/FAQ Searchable

**Objetivo:** Sistema de búsqueda dentro de la app para encontrar respuestas a preguntas comunes.

**Implementación:**
- 30-50 preguntas frecuentes pre-escritas
- Input de búsqueda en Theory tab
- Filtro por fuzzy match en título de FAQ
- Expandir/colapsar respuestas

**Archivo:** Agregar sección en `TheoryManual.jsx` o nuevo componente `HelpFAQ.jsx`

---

### 4.2 Theory Tab Restructurada

**Objetivo:** Organizar el Theory tab en 4 niveles de profundidad:

| Nivel | Nombre | Contenido |
|---|---|---|
| 1 | "Quick Start" | 5 conceptos en 5 minutos (Λ, dominios, semáforo, señal×canal, rutina) |
| 2 | "Guía del Usuario" | Los 13 pasos actuales del onboarding reorganizados como referencia |
| 3 | "Deep Dive" | El contenido actual del Theory tab (cada capa, fórmulas, atractores) |
| 4 | "Referencia" | Glosario + fórmulas + API + enlaces a papers |

**El contenido actual NO se elimina — se reorganiza.**

---

### 4.3 "Ask LOGOS" — Asistente Natural

**Objetivo:** Input de texto libre donde el usuario pregunta en lenguaje natural y recibe respuesta contextualizada.

**Ejemplos:**
- "¿Qué significa mi Lambda?"
- "¿Por qué mi entropía está alta?"
- "¿Qué debo hacer esta semana?"
- "¿Qué es Monte Carlo?"

**Backend:** Usar el endpoint existente `/api/protocol/interpret` con un prompt adaptado que incluya el estado actual del usuario + la pregunta.

**Archivo:** Componente `AskLogos.jsx` (nuevo) + endpoint backend si es necesario

---

## RESUMEN DE ARCHIVOS A CREAR/MODIFICAR

### Archivos existentes a modificar:

| Archivo | Fases |
|---|---|
| `src/components/LogosHumano.jsx` | 0.1, 0.2, 0.3, 1.1, 1.2, 1.3, 2.2, 2.3, 2.4, 3.1 |
| `src/i18n/locales/es.json` | 0.1, 0.2, 0.4, 1.1, 1.2, 3.1, 3.5 |
| `src/i18n/locales/en.json` | 0.1, 0.2, 0.4, 1.1, 1.2, 3.1, 3.5 |
| `src/hooks/useTranslatedDomains.js` | 0.1 |
| `src/components/TabAIGuide.jsx` | 2.3 |
| `src/components/TheoryManual.jsx` | 4.2 |

### Archivos nuevos a crear:

| Archivo | Fase | Descripción |
|---|---|---|
| `src/components/SmartTooltip.jsx` | 2.1 | Micro-card contextual para métricas |
| `src/components/LearningMoment.jsx` | 2.2 | Popups educativos por contexto |
| `src/components/MicroLesson.jsx` | 3.1 | 7 lecciones diarias tipo story |
| `src/components/WeeklyDigest.jsx` | 3.2 | Resumen semanal |
| `src/components/Badges.jsx` | 3.3 | Gamificación: streaks + badges |
| `src/components/LambdaSimulator.jsx` | 3.4 | Mini-juego interactivo |
| `src/components/HelpFAQ.jsx` | 4.1 | FAQ searchable |
| `src/components/AskLogos.jsx` | 4.3 | Asistente natural language |

---

## TIMELINE ESTIMADO

| Fase | Duración | Dependencias |
|---|---|---|
| **Fase 0** | 2-3 días | Ninguna |
| **Fase 1** | 3-5 días | Fase 0 completada |
| **Fase 2** | 5-7 días | Fase 0 + 1 completadas |
| **Fase 3** | 7-10 días | Fase 0 + 1 + 2 completadas |
| **Fase 4** | 5-7 días | Fase 0 + 1 completadas (puede ir en paralelo con 2-3) |

**Total estimado: 4-5 semanas**

---

## CRITERIO DE ÉXITO

| Métrica | Actual | Objetivo |
|---|---|---|
| Tiempo hasta primera evaluación completa | 5-10 min | < 3 min |
| Tasa de skip en onboarding | ~60% | < 20% |
| Sesiones en primera semana | ~2 | ≥ 5 |
| Usuarios que entienden Λ (auto-reportado) | Bajo | > 80% |
| Usuarios que usan Monte Carlo | ~5% | > 30% |
| Retención a 30 días | Desconocida | > 40% |

---

> **"No le enseñes al usuario toda la física antes de dejarlo conducir. Déjalo conducir. La física la va aprendiendo en el camino."**
>
> Dr. José Manuel Cadena × Cascade AI — Feb 2026

