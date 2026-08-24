# 🌿 MÓDULO 3: NUTRITION DETECTOR - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

## 3.1 RESUMEN EJECUTIVO

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Detectar deficiencias de 8 nutrientes y predecir necesidades |
| **Input** | Vmem, Impedancia, Frecuencia, pH suelo, EC, Fenología |
| **Output** | INE por nutriente, alertas proactivas, plan de fertiriego |
| **Precisión Target** | >80% correlación con análisis foliar |

---

## 3.2 SOPORTE TÉCNICO-ACADÉMICO

### 3.2.1 Referencias Científicas Clave

| Ref | Autor(es) | Título | Publicación | Hallazgo |
|-----|-----------|--------|-------------|----------|
| 1 | Shabala & Pottosin (2014) | "Regulation of potassium transport in plants" | Physiol. Plant. 151(1) | Vmem correlaciona con K+ |
| 2 | Gierth & Mäser (2007) | "Potassium transporters in plants" | FEBS Letters 581(12) | Canales K+ y bioelectricidad |
| 3 | White & Broadley (2003) | "Calcium in Plants" | Ann. Bot. 92(4) | Ca2+ y señalización eléctrica |
| 4 | Marschner (2012) | "Mineral Nutrition of Higher Plants" | Academic Press | **Referencia completa** |
| 5 | Cakmak (2005) | "Role of potassium in alleviating stress" | J. Plant Nutr. 28(5) | K+ y estrés osmótico |
| 6 | Lü et al. (2015) | "Membrane potential reflects nutrient status" | J. Plant Physiol. 185 | Vmem como proxy nutricional |

### 3.2.2 Fundamento Electrofisiológico

**Ecuación de Goldman-Hodgkin-Katz (base nutricional):**
```
Vm = (RT/F) × ln[(PK[K+]o + PNa[Na+]o + PCl[Cl-]i) / 
                  (PK[K+]i + PNa[Na+]i + PCl[Cl-]o)]

El Vmem está dominado por K+ (PK >> PNa, PCl)
Por tanto: ΔVmem ∝ Δ[K+] deficiencia
```

**Relación Vmem - Nutrientes:**
```
Nutriente    Mecanismo Bioeléctrico           Firma
───────────────────────────────────────────────────────────
K+          Canal directo de Vmem             Vmem ↑ (más positivo)
Ca2+        Mensajero secundario, estabiliza  Oscilaciones ↑
Mg2+        Cofactor ATP, clorofila           Amplitud ↓
N           Síntesis proteínas, metabolismo   Actividad ↓ general
P           ATP, fosfolípidos                 Frecuencia ↓
Fe          Cadena transportadora             Impedancia ↑
Zn          Enzimas, auxinas                  Respuesta ↓ estímulos
B           Pared celular, transporte         Impedancia ↑ local
```

---

## 3.3 FIRMAS BIOELÉCTRICAS POR DEFICIENCIA NUTRICIONAL

### 3.3.1 Macronutrientes

| Nutriente | Vmem Baseline | ΔVmem | Impedancia | Freq. | Síntoma Visual |
|-----------|---------------|-------|------------|-------|----------------|
| **K** | +5 a +15mV | Despolarización | -5 a -15% | Sin cambio | Clorosis marginal |
| **N** | -5 a -10mV | Hiperpolarizado | +5 a +10% | ↓ actividad | Amarillamiento general |
| **Ca** | Oscilaciones ↑ | Variable | +10 a +20% | ↑ irregulares | Necrosis apical |
| **Mg** | ↓ amplitud | -3 a -8mV | Variable | ↓ respuesta | Clorosis intervenal |
| **P** | -5 a -10mV | Hiperpolarizado | +5 a +15% | ↓ | Hojas púrpuras |
| **S** | Variable | -2 a -5mV | +3 a +8% | Sin cambio | Clorosis joven |

### 3.3.2 Micronutrientes

| Nutriente | Vmem Baseline | ΔVmem | Impedancia | Síntoma |
|-----------|---------------|-------|------------|---------|
| **Fe** | Variable | -3 a -8mV | +15 a +30% | Clorosis intervenal |
| **Zn** | ↓ respuesta | -2 a -5mV | +10 a +20% | Hojas pequeñas |
| **B** | Local ↑ imped. | Variable | +20 a +40% | Deformación frutos |
| **Mn** | Variable | -2 a -4mV | +5 a +15% | Manchas necróticas |
| **Cu** | Ligera ↓ | -1 a -3mV | +5 a +10% | Marchitez apical |

---

## 3.4 DEMANDAS NUTRICIONALES POR FENOLOGÍA

| Fenología | N | P | K | Ca | Mg | Fe | Zn | B |
|-----------|---|---|---|----|----|----|----|---|
| **FEN-01** Latencia | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 |
| **FEN-02** Brotación | 🟢 | 🟢 | 🟢 | 🔵 | 🔵 | 🟢 | 🟢 | 🔵 |
| **FEN-03** Floración | 🟡 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | 🟢 |
| **FEN-04** Cuajado | 🟡 | 🔴 | 🔴 | 🔴 | 🟢 | 🟡 | 🟢 | 🔴 |
| **FEN-05** Desarrollo | 🔴 | 🟡 | 🔴 | 🔴 | 🟡 | 🟡 | 🟡 | 🟡 |
| **FEN-06** Maduración | 🟡 | 🔵 | 🔴 | 🟡 | 🟡 | 🔵 | 🔵 | 🔵 |
| **FEN-07** Cosecha | 🔵 | 🔵 | 🟡 | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 |

**Leyenda:** 🔴 Crítico | 🟡 Alto | 🟢 Moderado | 🔵 Bajo

---

## 3.5 WORKFLOW DEL MÓDULO

```
┌─────────────────────────────────────────────────────────────────────────┐
│              NUTRITION DETECTOR - WORKFLOW COMPLETO                     │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADAS
   │
   ├── Sensores Bioeléctricos (722 nodos)
   │      • Vmem, Impedancia, Frecuencia
   │
   ├── Suelo (sensores EC/pH si disponibles)
   │      • EC, pH, Humedad
   │
   ├── PostgreSQL
   │      • rv21_features.phenology
   │      • Análisis foliares históricos
   │
   └── Tabla demandas_fenologia
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 1: ANÁLISIS DE SEÑALES BASE (cada 15 min)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1.1 Calcular baseline dinámico:                                       │
│       vmem_baseline = rolling_median(vmem[last_7d])                    │
│       impedance_baseline = rolling_median(impedance[last_7d])          │
│                                                                         │
│   1.2 Detectar desviaciones:                                            │
│       vmem_deviation = vmem_current - vmem_baseline                    │
│       impedance_change = (Z_current - Z_baseline) / Z_baseline × 100   │
│                                                                         │
│   1.3 Analizar patrones temporales:                                     │
│       diurnal_amplitude = max(vmem_day) - min(vmem_day)                │
│       response_to_light = delta_vmem_sunrise                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 2: MATCHING DE FIRMAS NUTRICIONALES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   FOR each nutrient IN [K, N, Ca, Mg, P, Fe, Zn, B]:                   │
│                                                                         │
│     2.1 Score Vmem (peso 0.40):                                        │
│         IF nutrient == 'K':                                            │
│             # K deficiency → despolarización                           │
│             vmem_score = sigmoid(vmem_deviation, 5, 15)                │
│         ELIF nutrient == 'N':                                          │
│             # N deficiency → hiperpolarización + baja actividad        │
│             vmem_score = sigmoid(-vmem_deviation, 5, 10) × activity_drop│
│         ...                                                            │
│                                                                         │
│     2.2 Score Impedancia (peso 0.30):                                  │
│         impedance_score = match_impedance(Z_change, nutrient.signature)│
│                                                                         │
│     2.3 Score Fenológico (peso 0.30):                                  │
│         demand = demand_matrix[phenology][nutrient]                    │
│         phen_score = demand × historical_deficiency_factor             │
│                                                                         │
│     2.4 Confianza por nutriente:                                       │
│         confidence[nutrient] = 0.40×vmem + 0.30×impedance + 0.30×phen │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 3: CÁLCULO DE INE (Índice Nutricional Específico)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   INE = 1 - Σ(αi × fi_deficiency)                                      │
│                                                                         │
│   Donde:                                                                │
│   - αi = peso del nutriente (K=0.25, Ca=0.20, N=0.18, etc.)           │
│   - fi_deficiency = nivel de deficiencia detectado (0-1)               │
│                                                                         │
│   Pesos (αi) del modelo Optimizer:                                     │
│   K: 0.25 | Ca: 0.20 | N: 0.18 | B: 0.12 | Zn: 0.12 | P: 0.08 | Mg: 0.05│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 4: PREDICCIÓN DE NECESIDADES (7-14 días)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   4.1 Extraer tendencia:                                                │
│       deficiency_trend = linear_fit(deficiency_scores[last_7d])        │
│                                                                         │
│   4.2 Proyectar necesidades:                                            │
│       IF deficiency_trend.slope > 0:                                   │
│           days_to_critical = (threshold - current) / trend.slope       │
│           predicted_date = today + days_to_critical                    │
│                                                                         │
│   4.3 Considerar fenología futura:                                      │
│       next_phenology = predict_phenology(gdd_current, gdd_projection)  │
│       upcoming_demand = demand_matrix[next_phenology][nutrient]        │
│                                                                         │
│       IF upcoming_demand == 'CRÍTICO':                                 │
│           recommendation = 'APLICACIÓN PREVENTIVA'                     │
│           timing = 'ANTES de transición fenológica'                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 5: GENERACIÓN DE ALERTAS Y RECOMENDACIONES                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   IF deficiency_score > threshold OR predicted_deficiency_soon:        │
│                                                                         │
│     alert = NutritionAlert(                                             │
│         nutrient = nutrient_name,                                       │
│         current_level = deficiency_score,                               │
│         predicted_level = predicted_deficiency,                         │
│         days_to_critical = days_to_critical,                           │
│         phenology_demand = demand_level,                                │
│         sections_affected = sections_with_deficiency,                   │
│         recommendation = generate_fertilizer_plan(nutrient, level),    │
│         roi_estimated = calculate_roi(nutrient, severity)              │
│     )                                                                   │
│                                                                         │
│   Fertilizante recomendado basado en:                                   │
│   - Deficiencia detectada                                               │
│   - Fenología actual                                                    │
│   - pH del suelo                                                        │
│   - Historial de aplicaciones                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 6: INTEGRACIÓN                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   → NPF (Nutrition Planning Framework): plan fertiriego                 │
│   → Optimizer: receta nutricional optimizada                           │
│   → Cost Agent: presupuesto fertilizantes                              │
│   → Opportunity Detector: ventana óptima de aplicación                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.6 PANEL UI - NUTRITION DETECTOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🌿 NUTRITION DETECTOR       [S1][S2][S3][S4][S5][S6]  [⚙️][📊][🔔]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  INE GLOBAL: 0.78                     Meta: ≥0.95    GAP: -0.17   │ │
│ │  ████████████████████░░░░░░░  78%     🟡 ATENCIÓN REQUERIDA       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  ESTADO NUTRICIONAL POR ELEMENTO                                  │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │                                                                    │ │
│ │  K  (0.25) ████████████░░░░░░░░  58%  🔴 DEFICIENCIA DETECTADA   │ │
│ │            Vmem: +12mV | Imped: -12% | Trend: ↓                  │ │
│ │                                                                    │ │
│ │  Ca (0.20) ██████████████████░░  85%  🟡 MODERADA                │ │
│ │            Oscilaciones ↑ | Imped: +8%                           │ │
│ │                                                                    │ │
│ │  N  (0.18) ████████████████████  95%  ✅ ÓPTIMO                  │ │
│ │                                                                    │ │
│ │  B  (0.12) ████████████████░░░░  78%  🟡 ATENCIÓN                │ │
│ │            Imped local: +25% | Cuajado próximo                   │ │
│ │                                                                    │ │
│ │  Zn (0.12) ██████████████████░░  88%  ✅ ADECUADO                │ │
│ │  P  (0.08) ████████████████████  92%  ✅ ÓPTIMO                  │ │
│ │  Mg (0.05) ██████████████████░░  90%  ✅ ÓPTIMO                  │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ PREDICCIÓN 14 DÍAS      │  │ PLAN DE ACCIÓN RECOMENDADO          │ │
│ ├─────────────────────────┤  ├──────────────────────────────────────┤ │
│ │                         │  │                                      │ │
│ │ K crítico en: 5 días    │  │ 1. FERTIRIEGO K (URGENTE)           │ │
│ │ Ca bajo en: 12 días     │  │    KNO3: 15 kg/ha                   │ │
│ │ B bajo en: 8 días       │  │    K2SO4: 10 kg/ha                  │ │
│ │                         │  │    Costo: $4,250 MXN                │ │
│ │ Fenología: FEN-04       │  │                                      │ │
│ │ (Cuajado) en 6 días     │  │ 2. FOLIAR Ca+B (7 días)             │ │
│ │                         │  │    CaCl2: 3 kg/ha                   │ │
│ │ ⚠️ K y Ca críticos      │  │    Solubor: 0.5 kg/ha              │ │
│ │ durante cuajado         │  │    Costo: $2,800 MXN                │ │
│ │                         │  │                                      │ │
│ └─────────────────────────┘  │ ROI Esperado: 8:1                   │ │
│                               └──────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  TENDENCIA SEMANAL - POTASIO (K)                                  │ │
│ │      100%│                                                        │ │
│ │       80%│ ▇▇                                                     │ │
│ │       60%│ ▇▇▇▇▇▇                    ← Actual: 58%              │ │
│ │       40%│ ▇▇▇▇▇▇▇▇▇▇▇▇____________ ← Crítico: 40%             │ │
│ │       20%│                                                        │ │
│ │         └─────────────────────────────────────────────────────    │ │
│ │          -7d  -6d  -5d  -4d  -3d  -2d  -1d  HOY  +7d  +14d       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.7 PRODUCTOS RECOMENDADOS POR DEFICIENCIA

| Deficiencia | Producto Suelo | Producto Foliar | Dosis | Timing |
|-------------|----------------|-----------------|-------|--------|
| **K** | K2SO4, KNO3 | KNO3 foliar | 15-25 kg/ha | Pre-cuajado |
| **Ca** | CaSO4 (yeso) | CaCl2 | 20-30 kg/ha | Floración-cuajado |
| **N** | Urea, NH4NO3 | Urea foliar | 10-20 kg/ha | Brotación |
| **Mg** | MgSO4 | Sulfato Mg foliar | 5-10 kg/ha | Desarrollo |
| **P** | MAP, DAP | MAP foliar | 5-10 kg/ha | Raíces activas |
| **Fe** | Fe-EDDHA | Fe quelado foliar | 2-4 kg/ha | pH alto |
| **Zn** | ZnSO4 | Zn quelado foliar | 1-2 kg/ha | Brotación |
| **B** | Bórax | Solubor foliar | 0.5-1 kg/ha | Pre-floración |

---

## 3.8 ALGORITMO PYTHON - NUTRITION DETECTOR

```python
class NutritionDetector:
    """Detecta deficiencias nutricionales via bioeléctrico."""
    
    NUTRIENT_WEIGHTS = {
        'K': 0.25, 'Ca': 0.20, 'N': 0.18, 'B': 0.12,
        'Zn': 0.12, 'P': 0.08, 'Mg': 0.05
    }
    
    SIGNATURES = {
        'K': {'vmem_shift': (5, 15), 'direction': 'positive',
              'impedance': (-15, -5), 'threshold': 0.60},
        'N': {'vmem_shift': (-10, -5), 'direction': 'negative',
              'activity_drop': True, 'threshold': 0.65},
        'Ca': {'oscillation_increase': True, 'impedance': (10, 20),
               'threshold': 0.70},
        'Fe': {'vmem_shift': (-8, -3), 'impedance': (15, 30),
               'threshold': 0.65},
        'B': {'local_impedance': (20, 40), 'threshold': 0.70}
    }
    
    DEMAND_MATRIX = {
        'FEN-04': {'K': 1.0, 'Ca': 1.0, 'B': 1.0, 'P': 0.8},
        'FEN-05': {'K': 1.0, 'N': 0.9, 'Ca': 0.8},
        'FEN-03': {'Ca': 0.9, 'B': 0.8, 'Mg': 0.7}
    }
    
    def detect(self, signals, phenology):
        deficiencies = {}
        
        for nutrient, weight in self.NUTRIENT_WEIGHTS.items():
            sig = self.SIGNATURES.get(nutrient, {})
            
            # Score Vmem
            vmem_score = self._vmem_analysis(signals, sig)
            
            # Score Impedancia
            impedance_score = self._impedance_analysis(signals, sig)
            
            # Score Fenológico
            demand = self.DEMAND_MATRIX.get(phenology, {}).get(nutrient, 0.5)
            
            # Confianza
            confidence = 0.40*vmem_score + 0.30*impedance_score + 0.30*demand
            
            if confidence >= sig.get('threshold', 0.65):
                deficiencies[nutrient] = {
                    'level': confidence,
                    'weight': weight,
                    'recommendation': self._recommend(nutrient, confidence)
                }
        
        # Calcular INE
        ine = 1 - sum(d['level'] * d['weight'] for d in deficiencies.values())
        
        return {'INE': ine, 'deficiencies': deficiencies}
    
    def _vmem_analysis(self, signals, signature):
        shift_range = signature.get('vmem_shift', (0, 0))
        deviation = signals.vmem_deviation
        
        if shift_range[0] <= deviation <= shift_range[1]:
            center = (shift_range[0] + shift_range[1]) / 2
            return 1 - abs(deviation - center) / (shift_range[1] - shift_range[0])
        return 0
    
    def _impedance_analysis(self, signals, signature):
        imp_range = signature.get('impedance', (0, 0))
        change = signals.impedance_change_pct
        
        if imp_range[0] <= change <= imp_range[1]:
            return 0.8
        return 0.2
    
    def _recommend(self, nutrient, level):
        products = {
            'K': {'soil': 'K2SO4 15kg/ha', 'foliar': 'KNO3 3%'},
            'Ca': {'soil': 'CaSO4 20kg/ha', 'foliar': 'CaCl2 2%'},
            'B': {'foliar': 'Solubor 0.5kg/ha'}
        }
        return products.get(nutrient, {})
```

---

## 3.9 MÉTRICAS DE VALIDACIÓN

| Métrica | Target | Validación |
|---------|--------|------------|
| Correlación K foliar | R² >0.80 | Análisis laboratorio |
| Predicción deficiencia | >70% 7 días antes | Síntomas visibles |
| INE vs rendimiento | R² >0.75 | Producción histórica |
| Falsos positivos | <25% | Verificación agronómica |

*Documento: Módulo 3 Nutrition Detector | Levin Layer 2.0 | 15 Enero 2026*
