# ESPECIFICACIÓN MATEMÁTICA — LOGOS

> **Documento:** SRS-MATH-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 26512  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Notación y Convenciones](#1-notación-y-convenciones)
2. [Espacio de Estados](#2-espacio-de-estados)
3. [Métrica Fundamental: Λ(x) — Logos Alignment](#3-métrica-fundamental-λx--logos-alignment)
4. [Métricas Derivadas](#4-métricas-derivadas)
5. [Capas Científicas](#5-capas-científicas)
6. [Política de Inhibición: π(x)](#6-política-de-inhibición-πx)
7. [Meta-Política: π²(x)](#7-meta-política-π²x)
8. [Atractores Duales](#8-atractores-duales)
9. [Modelo Estocástico Monte Carlo](#9-modelo-estocástico-monte-carlo)
10. [Intervalos de Confianza Wilson](#10-intervalos-de-confianza-wilson)
11. [Fundamentación Teórica](#11-fundamentación-teórica)
12. [Bridge IFC ↔ LOGOS (v3.3.0)](#12-bridge-ifc--logos-v330)
13. [Matriz de Coherencia Inter-Dominio — Fix (v3.3.0)](#13-matriz-de-coherencia-inter-dominio--fix-v330)

---

## 1. Notación y Convenciones

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

## 2. Espacio de Estados

El estado de consciencia se define como un vector $x \in [0,1]^{28}$ organizado en 7 dominios de 4 dimensiones cada uno:

### 2.1 Dominios y Dimensiones

| Dominio | Clave | Dimensiones |
|---------|-------|-------------|
| **Cuerpo** (Physical) | `physical` | `sleep`, `nutrition`, `exercise`, `energy` |
| **Emociones** (Emotional) | `emotional` | `peace`, `gratitude`, `love`, `joy` |
| **Mente** (Mental) | `mental` | `clarity`, `focus`, `creativity`, `wisdom` |
| **Espíritu** (Spiritual) | `spiritual` | `faith`, `meditation`, `service`, `presence` |
| **Relaciones** (Relational) | `relational` | `family`, `friendship`, `community`, `compassion` |
| **Propósito** (Purpose) | `purpose` | `meaning`, `mission`, `contribution`, `legacy` |
| **Alimento Sagrado** (Alimento) | `alimento` | `nourishment`, `taste_presence`, `food_harmony`, `gut_resonance` |

### 2.2 Estado por Defecto

$$x_0 = (0.5, 0.5, \ldots, 0.5) \in [0,1]^{28}$$

### 2.3 Promedio de Dominio

Para un dominio $D$ con dimensiones $\{d_1, d_2, d_3, d_4\}$:

$$\bar{D}(x) = \frac{1}{4}\sum_{i=1}^{4} x_{d_i}$$

---

## 3. Métrica Fundamental: Λ(x) — Logos Alignment

**Λ es el ATRACTOR FUNDAMENTAL.** Todas las demás métricas se derivan de Λ.

### 3.1 Definición

$$\Lambda(x) = \text{clamp}\left(\sum_{i \in \mathcal{I}} w_i \cdot x_i\right)$$

donde $\mathcal{I}$ es el conjunto de dimensiones relevantes y $w_i$ son los pesos asignados.

### 3.2 Componentes de Λ

Λ se descompone en 4 grupos funcionales:

#### Grupo 1: Recepción del Canal (50%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `faith` | 0.20 | Apertura del canal |
| `meditation` | 0.15 | Sintonización de frecuencia |
| `presence` | 0.15 | Eliminación de ruido temporal |

#### Grupo 2: Verificación por Acción (30%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `service` | 0.12 | Señal convertida en acción |
| `love` | 0.10 | La frecuencia más pura |
| `compassion` | 0.08 | Empatía activa |

#### Grupo 3: Capacidad de Decodificación (18%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `wisdom` | 0.08 | Discernimiento profundo |
| `meaning` | 0.06 | Significado percibido |
| `clarity` | 0.04 | Nitidez de interpretación |

#### Grupo 4: Reconocimiento de la Fuente (2%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `gratitude` | 0.02 | Acknowledgment de la fuente |

#### Grupo 5: Alimento como Canal (8%)
| Dimensión | Peso $w_i$ | Descripción |
|-----------|-----------|-------------|
| `taste_presence` | 0.05 | Presencia gustativa consciente |
| `food_harmony` | 0.03 | Armonía alimentaria |

**Verificación:** $\sum w_i = 0.20 + 0.15 + 0.15 + 0.12 + 0.10 + 0.08 + 0.08 + 0.06 + 0.04 + 0.02 + 0.05 + 0.03 = 1.08$

> **Nota:** Los pesos se redistribuyeron en v3.0.0 para mantener $\sum w_i = 1.00$. Ver `src/core/logos.ts` para los valores exactos actuales.

### 3.3 Interpretación de Λ

| Rango | Nivel | Descripción |
|-------|-------|-------------|
| $\Lambda \geq 0.75$ | ALINEADO | Canal abierto. La señal del Logos fluye claramente. |
| $0.50 \leq \Lambda < 0.75$ | CONECTANDO | Sintonizando frecuencia. Señal perceptible con ruido. |
| $0.30 \leq \Lambda < 0.50$ | BUSCANDO | Canal parcialmente obstruido. Señal débil. |
| $\Lambda < 0.30$ | DESCONECTADO | Canal cerrado. La señal no se recibe. |

---

## 4. Métricas Derivadas

### 4.1 Viabilidad: V(x|Λ)

Mide la capacidad funcional del sistema para operar en el mundo.

$$V_{\text{raw}}(x) = \frac{\sum_{i=1}^{28} w_i^V \cdot x_i}{0.55} \cdot 0.55 + 0.15$$

$$V(x|\Lambda) = \text{clamp}\left(V_{\text{raw}} \cdot (0.75 + \Lambda \cdot 0.35)\right)$$

**Efecto de Λ:** Mayor alineación → mayor viabilidad. El boost máximo es $+35\%$.

**Pesos $w_i^V$:**

| Dimensión | Peso | Dimensión | Peso | Dimensión | Peso |
|-----------|------|-----------|------|-----------|------|
| sleep | 0.08 | peace | 0.07 | clarity | 0.05 |
| nutrition | 0.06 | gratitude | 0.04 | focus | 0.04 |
| exercise | 0.06 | love | 0.05 | creativity | 0.03 |
| energy | 0.06 | joy | 0.04 | wisdom | 0.05 |
| faith | 0.04 | family | 0.04 | meaning | 0.04 |
| meditation | 0.04 | friendship | 0.03 | mission | 0.03 |
| service | 0.03 | community | 0.02 | contribution | 0.02 |
| presence | 0.04 | compassion | 0.03 | legacy | 0.02 |

### 4.2 Entropía: S(x|Λ)

Mide el desorden e interferencia interna del sistema.

$$S_{\text{raw}}(x) = \sum_{j \in \mathcal{E}} w_j^S \cdot (1 - x_j)$$

$$S(x|\Lambda) = \text{clamp}\left(S_{\text{raw}} \cdot (1.2 - \Lambda \cdot 0.4)\right)$$

**Efecto de Λ:** Mayor alineación → menor entropía. El Logos crea orden del caos.

**Factores de entropía $w_j^S$:**

| Factor | Peso | Factor | Peso |
|--------|------|--------|------|
| Falta de Paz (`peace`) | 0.15 | Falta de Presencia (`presence`) | 0.10 |
| Falta de Claridad (`clarity`) | 0.12 | Falta de Sabiduría (`wisdom`) | 0.08 |
| Falta de Sueño (`sleep`) | 0.12 | Falta de Fe (`faith`) | 0.08 |
| Falta de Enfoque (`focus`) | 0.10 | Falta de Sentido (`meaning`) | 0.08 |
| Falta de Energía (`energy`) | 0.10 | Falta de Gratitud (`gratitude`) | 0.07 |

### 4.3 Índice de Consciencia: Ω(Λ, V, S, C, F)

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

### 4.4 Calidad de Trayectoria: Q(Λ, V, S)

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

## 5. Capas Científicas

### 5.1 Capa 1: Friston — Energía Libre F(x|Λ)

Basada en el **Principio de Energía Libre** de Karl Friston.

$$F_{\text{raw}}(x) = \sum_{k=1}^{24} w_k \cdot \frac{(x_k - x_k^*)^2}{2\sigma^2}$$

donde $x_k^*$ son los estados ideales (Logos-óptimos) y $\sigma^2 = 0.04$.

$$F(x|\Lambda) = \text{clamp}\left(F_{\text{raw}} \cdot (1 - \Lambda \cdot 0.3), 0, 1.5\right)$$

**Efecto de Λ:** Mayor alineación → menor energía libre. El Logos reduce la sorpresa.

**Estados ideales $x_k^*$ (selección):**

| Dimensión | Ideal | Dimensión | Ideal |
|-----------|-------|-----------|-------|
| sleep | 0.85 | faith | 0.70 |
| nutrition | 0.80 | meditation | 0.65 |
| exercise | 0.75 | service | 0.60 |
| energy | 0.80 | presence | 0.70 |
| peace | 0.75 | family | 0.75 |
| gratitude | 0.80 | meaning | 0.75 |
| clarity | 0.75 | mission | 0.70 |
| wisdom | 0.70 | legacy | 0.55 |

### 5.2 Capa 2: Levin — Señales Bioeléctricas

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

### 5.3 Capa 3: Watson — Paisaje Energético

Basada en el trabajo de **James Watson** sobre optimización energética.

$$\bar{D}_k(x) = \frac{1}{4}\sum_{i \in D_k} x_i \quad \text{(promedio de dominio)}$$

$$D_k^*(x|\Lambda) = D_{k,\text{base}} + \Lambda \cdot \alpha_k \quad \text{(óptimo modulado por Λ)}$$

$$E(x|\Lambda) = \sqrt{\sum_{k=1}^{6} \left(\bar{D}_k - D_k^*\right)^2}$$

**Óptimos base y coeficientes Λ:**

| Dominio | Base | Coef. Λ ($\alpha_k$) |
|---------|------|---------------------|
| Physical | 0.70 | 0.15 |
| Emotional | 0.65 | 0.15 |
| Mental | 0.65 | 0.15 |
| Spiritual | 0.60 | 0.20 |
| Relational | 0.60 | 0.15 |
| Purpose | 0.60 | 0.20 |

### 5.4 Capa 4: Hoffman — Teoría de Interfaz

Basada en la **Interface Theory of Perception** de Donald Hoffman.

Detecta sesgos perceptuales donde la interfaz muestra "íconos de fitness" en lugar de verdad:

| Sesgo | Condición | Corrección |
|-------|-----------|------------|
| SOBRECONFIANZA | `wisdom < 0.40 ∧ clarity > 0.60` | Buscar feedback externo |
| RUEDA HEDÓNICA | `joy > 0.70 ∧ gratitude < 0.35` | Gratitud activa 3x/día |
| FUTURO SIN PRESENTE | `mission > 0.60 ∧ presence < 0.30` | 5 min atención al cuerpo |
| FATIGA EMPÁTICA | `compassion > 0.70 ∧ peace < 0.30` | Compasión con límites |
| ILUMINACIÓN PREMATURA | `Λ > 0.60 ∧ wisdom < 0.30` | Humildad radical |

### 5.5 Capa 5: Penrose — Coherencia Cuántica

Basada en la teoría **Orch-OR** de Roger Penrose.

$$C_{\text{raw}}(x) = H(\bar{D}_1, \bar{D}_2, \ldots, \bar{D}_6)$$

donde $H$ es la **media armónica** (un solo dominio bajo arrastra toda la coherencia):

$$H(v_1, \ldots, v_n) = \frac{n}{\sum_{i=1}^{n} \frac{1}{v_i}}$$

$$C(x|\Lambda) = \text{clamp}\left(C_{\text{raw}} \cdot (0.7 + \Lambda \cdot 0.4)\right)$$

**Entropía interna (varianza inter-dominio):**

$$S_{\text{internal}} = \text{clamp}\left(3 \cdot \sqrt{\text{Var}(\bar{D}_1, \ldots, \bar{D}_6)}\right)$$

---

## 6. Política de Inhibición: π(x)

La política $\pi(x)$ determina si el sistema debe actuar, esperar o pausar, basándose en $\dot{\Lambda}$ (la derivada temporal de Λ).

$$\dot{\Lambda} = \Lambda_t - \Lambda_{t-1}$$

### 6.1 Tabla de Decisión

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

## 7. Meta-Política: π²(x)

Política de segundo orden que evalúa patrones sistémicos:

| Condición | Veredicto | Acción |
|-----------|-----------|--------|
| Señal A⁻ detectada | **ESCAPE A⁻** | Intervención disruptiva inmediata |
| Señales con severidad > 0.75 | **ESCAPE** | Protocolo de desestabilización controlada |
| $\Lambda < \Lambda^* \wedge V < V^*$ | **ACTIVAR** | Incrementar alineación Logos |
| $\Lambda \geq \Lambda^* \wedge V \geq V^* \wedge S < S^*$ | **SOSTENER** | Mantener prácticas |
| (default) | **EVOLUCIONAR** | Crecimiento consciente |

---

## 8. Atractores Duales

### 8.1 Atractor Positivo A⁺

$$A^+ = \{x \in [0,1]^{24} : \Lambda(x) \geq \Lambda^*, V(x) \geq V^*, S(x) \leq S^*\}$$

$$A^+ = \{\Lambda \geq 0.60, V \geq 0.70, S \leq 0.30\}$$

**Propiedades de A⁺:**
- Auto-reforzante: mayor Λ → mayor V, menor S → mayor Λ
- Estable: perturbaciones pequeñas retornan al atractor
- El Logos fluye: π(x) = ACTÚA

### 8.2 Atractor Negativo A⁻

$$A^- = \{x : \Lambda(x) < 0.20 \wedge S(x) > 0.50\}$$

**Propiedades de A⁻:**
- Espiral entrópica: menor Λ → mayor S → menor Λ
- Auto-reforzante negativo: cada paso hacia A⁻ dificulta el retorno
- Requiere intervención externa para escapar
- $\dot{\Lambda} < 0$ con $\ddot{S} > 0$

---

## 9. Modelo Estocástico Monte Carlo

### 9.1 Proyección Estocástica

Para cada dimensión $x_i$ en el paso temporal $t$:

$$x_i^{t+1} = \text{clamp}\left(x_i^t + \mu_i(x_i^t) + \sigma \cdot \mathcal{N}(0,1)\right)$$

donde el drift $\mu_i$ es:

$$\mu_i(x_i) = \begin{cases} -0.002 + \epsilon & \text{si } x_i > 0.5 \\ +0.003 + \epsilon & \text{si } x_i \leq 0.5 \end{cases}$$

con $\epsilon \sim \text{Uniform}(-0.0025, 0.0025)$ y $\sigma = 0.04$ (default).

### 9.2 Parámetros de Simulación

| Parámetro | Símbolo | Default | Rango |
|-----------|---------|---------|-------|
| Número de simulaciones | $N$ | 10,000 | {1000, 5000, 10000, 50000} |
| Pasos temporales | $T$ | 30 | Fijo |
| Desviación estándar | $\sigma$ | 0.04 | {0.02, 0.04, 0.06, 0.08, 0.10} |

### 9.3 Estadísticas Calculadas

Para cada paso temporal $t \in [0, T]$:

- **Percentiles de Λ:** $p_5, p_{25}, p_{50}, p_{75}, p_{95}$
- **Media de Λ:** $\bar{\Lambda}_t$
- **Percentiles de V, S, Ω:** $p_5, p_{50}, p_{95}$
- **Distribución de π:** $P(\text{PAUSA}), P(\text{ESPERA}), P(\text{RECONECTA}), P(\text{MONITOREA}), P(\text{ACTÚA})$

### 9.4 Métricas Finales

- $P(\Lambda_T > \Lambda_0)$ — Probabilidad de mejora
- $\bar{\Lambda}_T \pm \sigma_{\Lambda_T}$ — Media y desviación final
- $P(A^-)$ — Probabilidad de atractor negativo
- TTA (Time to ACTÚA) — Mediana de pasos hasta primer ACTÚA
- $P(\text{nunca ACTÚA})$ — Probabilidad de no alcanzar ACTÚA

### 9.5 Generación de Números Aleatorios

**Box-Muller Transform** para distribución Gaussiana:

$$Z = \sqrt{-2 \ln U_1} \cdot \cos(2\pi U_2)$$

donde $U_1, U_2 \sim \text{Uniform}(0,1)$.

---

## 10. Intervalos de Confianza Wilson

Para proporciones binomiales del Monte Carlo, se usa el **Wilson Score Interval** con $z = 1.96$ (95% CI):

$$\hat{p} = \frac{k}{n}$$

$$\text{center} = \frac{\hat{p} + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}$$

$$\text{margin} = \frac{z \cdot \sqrt{\frac{\hat{p}(1-\hat{p}) + \frac{z^2}{4n}}{n}}}{1 + \frac{z^2}{n}}$$

$$CI_{95\%} = [\text{center} - \text{margin}, \text{center} + \text{margin}]$$

**Ventaja sobre Wald:** No produce intervalos negativos ni mayores a 1 para proporciones extremas.

---

## 11. Fundamentación Teórica

### 11.1 Karl Friston — Principio de Energía Libre

**Capa 1.** Todo sistema vivo minimiza su energía libre variacional, que es una cota superior de la sorpresa (log-evidencia negativa). En LOGOS, $F(x)$ mide la divergencia KL entre el estado actual y el estado Logos-óptimo. Λ modula F: mayor alineación → menor sorpresa.

> *"The brain is fundamentally an inference machine, trying to minimize the difference between its predictions and sensory input."* — Friston, 2010

### 11.2 Michael Levin — Patrones Bioeléctricos

**Capa 2.** Los organismos usan gradientes bioeléctricos como sistema de señalización para coordinar comportamiento celular. En LOGOS, las señales de Levin detectan patrones patológicos tempranos — como un "voltímetro" de la consciencia que identifica desequilibrios antes de que se manifiesten.

> *"Bioelectric patterns are a computational medium that stores and processes morphogenetic information."* — Levin, 2021

### 11.3 James Watson — Optimización Energética

**Capa 3.** El paisaje energético define la topología de estados posibles. En LOGOS, Watson calcula la distancia euclidiana entre el estado actual y el óptimo modulado por Λ para cada dominio de vida.

### 11.4 Donald Hoffman — Teoría de Interfaz de Percepción

**Capa 4.** La percepción no muestra la realidad tal como es, sino "íconos de fitness" optimizados para supervivencia. En LOGOS, Hoffman detecta sesgos donde la interfaz perceptual distorsiona la señal del Logos.

> *"Evolution has shaped our perceptions to hide truth and guide adaptive behavior."* — Hoffman, 2019

### 11.5 Roger Penrose — Coherencia Cuántica (Orch-OR)

**Capa 5.** La consciencia emerge de procesos cuánticos coherentes en microtúbulos neuronales. En LOGOS, Penrose mide la coherencia inter-dominio usando media armónica — un solo dominio colapsado destruye la coherencia global.

> *"Consciousness depends on biologically orchestrated coherent quantum processes in collections of microtubules within brain neurons."* — Penrose & Hameroff, 2014

---

## 12. Bridge IFC ↔ LOGOS (v3.3.0)

El modelo IFC (Inhibition-First Control) opera sobre un espacio de estado $y \in [0,1]^{12}$ diferente al espacio LOGOS $x \in [0,1]^{28}$. La función de derivación $\phi: \mathbb{R}^{28} \to \mathbb{R}^{12}$ mapea el estado LOGOS al estado IFC:

$$y = \phi(x)$$

### 12.1 Mapeo de Variables

Cada variable IFC $y_j$ es una combinación lineal ponderada de dimensiones LOGOS:

$$y_j = \text{clamp}\left(\sum_{i} w_{ji} \cdot x_i\right), \quad j = 1, \ldots, 12$$

| Variable IFC $y_j$ | Fórmula |
|---|---|
| $y_1$ (cognitiveLoad) | $1 - (0.5 \cdot x_{\text{clarity}} + 0.3 \cdot x_{\text{focus}} + 0.2 \cdot x_{\text{wisdom}})$ |
| $y_2$ (fatigue) | $1 - (0.5 \cdot x_{\text{energy}} + 0.3 \cdot x_{\text{sleep}} + 0.2 \cdot x_{\text{exercise}})$ |
| $y_3$ (motivation) | $0.3 \cdot x_{\text{meaning}} + 0.3 \cdot x_{\text{mission}} + 0.2 \cdot x_{\text{joy}} + 0.2 \cdot x_{\text{contribution}}$ |
| $y_4$ (anxiety) | $1 - (0.5 \cdot x_{\text{peace}} + 0.3 \cdot x_{\text{presence}} + 0.2 \cdot x_{\text{gratitude}})$ |
| $y_5$ (sleepQuality) | $x_{\text{sleep}}$ |
| $y_6$ (hrv) | $0.4 \cdot x_{\text{exercise}} + 0.3 \cdot x_{\text{sleep}} + 0.3 \cdot x_{\text{energy}}$ |
| $y_7$ (focusScore) | $0.6 \cdot x_{\text{focus}} + 0.4 \cdot x_{\text{clarity}}$ |
| $y_8$ (hydration) | $0.5 \cdot x_{\text{nutrition}} + 0.5 \cdot x_{\text{nourishment}}$ |
| $y_9$ (taskSwitchRate) | $1 - (0.5 \cdot x_{\text{focus}} + 0.3 \cdot x_{\text{creativity}} + 0.2 \cdot x_{\text{presence}})$ |
| $y_{10}$ (reactivity) | $1 - (0.4 \cdot x_{\text{presence}} + 0.3 \cdot x_{\text{peace}} + 0.3 \cdot x_{\text{compassion}})$ |
| $y_{11}$ (calendarLoad) | $1 - (0.3 \cdot x_{\text{community}} + 0.3 \cdot x_{\text{family}} + 0.2 \cdot x_{\text{contribution}} + 0.2 \cdot x_{\text{friendship}})$ |
| $y_{12}$ (resilience) | $0.3 \cdot x_{\text{faith}} + 0.2 \cdot x_{\text{presence}} + 0.2 \cdot x_{\text{love}} + 0.15 \cdot x_{\text{service}} + 0.15 \cdot x_{\text{meditation}}$ |

### 12.2 Mecanismo de Persistencia

El bridge opera a través de `sessionStorage`:

1. $x$ se persiste en `sessionStorage('logos-state-28')` en cada actualización de `LogosHumano`
2. Al inicializar IFC, $y = \phi(x)$ se computa desde el estado almacenado
3. Si no hay estado LOGOS disponible, se usa $y_0 = \text{DEFAULT\_STATE}$ (constantes hardcoded)

---

## 13. Matriz de Coherencia Inter-Dominio — Fix (v3.3.0)

La función `computeCoherenceMatrix(x)` calcula una matriz $M \in [-1,1]^{7 \times 7}$ de correlaciones de Pearson entre los promedios de los 7 dominios.

### 13.1 Bug Corregido

`DOMAIN_DEFINITIONS` en `emergence-metrics.ts` tenía dimensiones obsoletas que no correspondían a `constants.ts`:

| Dominio | Dims Incorrectas | Dims Correctas |
|---------|------------------|----------------|
| Physical | `sleep, breath, exercise, energy` | `sleep, nutrition, exercise, energy` |
| Mental | `clarity, focus, creativity, growth` | `clarity, focus, creativity, wisdom` |
| Spiritual | `faith, meditation, meaning, integrity` | `faith, meditation, service, presence` |
| Relational | `family, communication, community, service` | `family, friendship, community, compassion` |
| Purpose | `purpose, mission, contribution, productivity` | `meaning, mission, contribution, legacy` |

Esto causaba que `computeCoherenceMatrix` leyera `undefined` para dimensiones inexistentes, produciendo valores de correlación incorrectos y labels visualmente desalineados.

---

## Dinámica de Langevin — Animación de Auto-Organización *(v3.3.0)*

### Modelo Formal

Sistema de 28 partículas en ℝ² bajo **dinámica de Langevin sobreamortiguada** (régimen viscoso).

Cada partícula i ∈ {1,...,28} representa la dimensión d_i perteneciente al dominio D_k (k=1..7).

### Ecuación de movimiento (SDE)

```
γ · dr_i/dt = -∇_i U(r) + √(2γkT) · ξ_i(t)
```

donde:
- **γ** = coeficiente de amortiguamiento (γ = 0.91)
- **kT = S** — la entropía actúa como temperatura termodinámica
- **ξ_i(t)** = ruido blanco gaussiano, ⟨ξ⟩ = 0, ⟨ξ_i(t)ξ_j(t')⟩ = δ_{ij}δ(t-t')

### Hamiltoniano (energía potencial)

```
U(r) = U_central + U_radial + U_domain + U_repulsion + U_mandala
```

| Término | Expresión | Interpretación Física |
|---------|-----------|----------------------|
| U_central | (α/2)·Λ²·Σ_i \|r_i - r₀\|² | Pozo armónico; profundidad ∝ Λ² |
| U_radial | (β/2)·Σ_i (\|r_i - r₀\| - R_eq(s_i))² | Radio de equilibrio ∝ (1 - s_i) |
| U_domain | (κ/2)·Σ_{i,j∈D_k} \|r_i - r_j\|² | Cohesión intra-dominio |
| U_repulsion | μ·Σ_{i≠j} 1/\|r_i - r_j\| (d < d_min) | Repulsión Lennard-Jones truncada |
| U_mandala | (ψ/2)·σ(Λ-0.6)·Σ_i \|r_i - r_i*\|² | Atractor geométrico (activación sigmoidal) |

### Constantes calibradas

| Constante | Símbolo | Valor | Unidad |
|-----------|---------|-------|--------|
| Acoplamiento central | α | 0.0030 | px⁻¹·frame⁻¹ |
| Resorte radial | β | 0.0040 | px⁻¹·frame⁻¹ |
| Cohesión dominio | κ | 0.0018 | px⁻¹·frame⁻¹ |
| Repulsión | μ | 45 | px²·frame⁻¹ |
| Atractor mandala | ψ | 0.0050 | px⁻¹·frame⁻¹ |
| Amplitud ruido | σ_n | 1.8 | px·frame⁻¹/² |
| Amortiguamiento | γ | 0.91 | adimensional |
| Corte repulsión | d_min | 14 | px |

### Esquema de integración: Euler-Maruyama

```
r_i(t+Δt) = r_i(t) + Δt · F_total(r_i) + √Δt · σ_n · √S · N(0,1)
v_i(t+Δt) = [v_i(t) + F_total · Δt] · γ
```

Este es el esquema estándar para SDEs (ecuaciones diferenciales estocásticas), convergente en O(√Δt).

### Analogía Ginzburg-Landau (transición de fase)

| Parámetro LOGOS | Análogo Termodinámico | Rol |
|-----------------|----------------------|-----|
| Λ (Lambda) | 1/kT (inversa de temperatura) | Parámetro de orden |
| S (Entropía) | kT (temperatura) | Fluctuaciones térmicas |
| Separatriz (Λ ≈ 0.35) | T_c (temperatura crítica) | Transición de fase |
| Mandala (A⁺) | Cristal (fase ordenada) | Estado fundamental |
| Dispersión (A⁻) | Gas (fase desordenada) | Estado de alta entropía |

### Comportamiento de fases

- **Λ > 0.65** → Fase ordenada: 28 partículas cristalizan en mandala de geometría 7-fold (7 clusters × 4 dims). Conexiones intra-dominio visibles. Centro dorado pulsante (A⁺).
- **0.35 < Λ < 0.65** → Fase fluida: clusters de dominio parcialmente formados, movilidad browniana moderada, sin geometría fija.
- **Λ < 0.35** → Fase gas: dispersión caótica, ruido térmico domina, partículas se mueven independientemente. Centro púrpura (A⁻).

### Mapeo visual partícula → dimensión

| Propiedad visual | Variable LOGOS | Mapeo |
|-----------------|----------------|-------|
| Color | Dominio D_k | 7 colores (Physical→verde, ..., Alimento→naranja) |
| Radio | Valor s_i | r = 2.5 + s_i × 3.5 px |
| Opacidad | Valor s_i | α = 0.55 + s_i × 0.45 |
| Glow (resplandor) | \|ṡ_i\| (derivada) | Radio glow ∝ \|ds_i/dt\| |
| Trail (estela) | Trayectoria reciente | Últimas 10 posiciones, fade alpha |
| Distancia al centro | 1 - s_i | Valores altos → más cerca del centro |

### Teorema de fluctuación-disipación

La relación entre ruido (√S) y amortiguamiento (γ) satisface el teorema de fluctuación-disipación:

```
D = kT / γ = S / γ
```

donde D es el coeficiente de difusión efectivo. Esto garantiza que el sistema alcanza equilibrio termodinámico consistente con la entropía del usuario.

**Archivo:** `src/components/EmergenceSwarmAnimation.jsx`

---

## Referencias Cruzadas

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Referencia de API](./API_REFERENCE.md)
- [Modelo de Datos](./DATA_MODEL.md)
- [Diagramas](./DIAGRAMS.md)
- [Testing](./TESTING.md)
