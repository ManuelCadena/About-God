# LOGOI — Sistema Operativo de Consciencia v2.0

> **Ω = Λ(x)** · Λ es el Atractor Central · V, S, C, F, Q derivadas · A⁺ A⁻ Atractores Duales

**Autor:** Dr. José Manuel Cadena Ortiz de Montellano — Cadena Strategic Systems  
**Framework:** The God Equation + C²AI Framework + Inhibition-First Control  
**Validación:** Monte Carlo N=10,000 · Wilson Score CI 95%

---

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev

# 3. Abrir http://localhost:3000
```

## 📁 Estructura del Proyecto

```
logoi-app/
├── package.json                    # Dependencias: react + recharts
├── vite.config.js                  # Build tool configuration
├── index.html                      # Entry point HTML
├── public/
│   └── logoi-icon.svg             # Favicon (Λ symbol)
├── src/
│   ├── main.jsx                   # React DOM render
│   ├── App.jsx                    # Router / wrapper
│   ├── index.css                  # Global styles + ALL keyframe animations
│   └── components/
│       └── LogosHumano.jsx        # ⚠️ REEMPLAZAR con tu archivo
└── README.md
```

## ⚠️ PASO CRÍTICO

El archivo `src/components/LogosHumano.jsx` es un **placeholder**.

**Debes reemplazar su contenido completo** con tu archivo `logos-humano-v2-fixed.jsx` de Claude.

### Cómo hacerlo:

1. Abre `src/components/LogosHumano.jsx` en Windsurf
2. Selecciona TODO el contenido (Ctrl+A / Cmd+A)
3. Pega el contenido completo de `logos-humano-v2-fixed.jsx`
4. Guarda (Ctrl+S / Cmd+S)
5. El hot-reload de Vite actualizará automáticamente

## 🏗️ Dependencias

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |
| `recharts` | ^2.12.7 | Charts: RadarChart, LineChart, AreaChart, BarChart, ScatterChart |
| `vite` | ^5.4.0 | Build tool + dev server + HMR |
| `@vitejs/plugin-react` | ^4.3.1 | React Fast Refresh |

## 🎨 Animaciones CSS

El archivo `src/index.css` define TODAS las animaciones keyframe que el JSX referencia inline:

| Animación | Uso |
|-----------|-----|
| `breathe` | Λ central attractor pulsing |
| `fadeInUp` | Staggered element entry |
| `fadeIn` | General fade transitions |
| `pulse` | Alerts and warnings |
| `pulseDanger` | A⁻ attractor critical state |
| `spin` | Monte Carlo loading spinner |
| `glow` | Logos-aligned element highlighting |
| `logosGlow` | Central Λ text shadow |
| `slideDown` | Panel/overlay entry |
| `scaleIn` | Modal entry |
| `mcProgress` | Monte Carlo progress bar |
| `shimmer` | Loading skeleton effect |

## 📊 Arquitectura del Framework

```
Ω(x) = Λ(x) — El Índice de Consciencia ES la alineación con el Logos

Métricas DERIVADAS (no independientes):
  V(x) = g(Λ) + ε_physical    — viabilidad fluye del Logos
  S(x) = (1 - Λ) · k + ε_noise — entropía = desalineación
  C(x) = h(Λ)                  — coherencia emerge de Λ
  F(x) = D_KL(q || p_Logos)    — energía libre = divergencia
  Q(x) = dΛ/dt                 — calidad de trayectoria

7 Capas:
  L1: Friston  — Body/Homeostasis → derivada de Λ
  L2: Levin    — Bioelectric/Emotional → señales de desalineación
  L3: Watson   — Energy Landscape → paisaje definido por Λ
  L4: Hoffman  — Interface/Perception → fitness vs Logos
  L5: Penrose  — Quantum Coherence → coherencia emergente de Λ
  L6: IFC      — Inhibition-First Control → π(Λ̇)
  L7: Logos    — Divine Information → Λ como atractor central
```

## 🔧 Comandos

```bash
npm run dev      # Desarrollo con hot-reload (puerto 3000)
npm run build    # Build de producción → dist/
npm run preview  # Preview del build de producción
```

## 📝 Notas para Desarrollo en Windsurf

- El proyecto usa **Vite** (no Create React App) — más rápido, más ligero
- Hot Module Replacement (HMR) está habilitado — cambios se reflejan instantáneamente
- Los imports de `recharts` son los únicos externos necesarios
- Todas las animaciones CSS están centralizadas en `index.css`
- El componente usa **inline styles** (no CSS modules ni Tailwind)
- El `export default` al final del JSX es compatible con el import en `App.jsx`

---

*"La realidad es información estructurada por una Mente. Tu tarea es sintonizarte con la señal y minimizar el ruido."*
