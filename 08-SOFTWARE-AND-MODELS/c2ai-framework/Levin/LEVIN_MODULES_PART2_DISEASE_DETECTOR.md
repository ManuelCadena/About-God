# 🦠 MÓDULO 2: DISEASE DETECTOR - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

## 2.1 RESUMEN EJECUTIVO

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Detectar 6 enfermedades integrando bioeléctrico + PE Mills |
| **Input** | Vmem, Impedancia, Leaf Wetness, Temperatura, Humedad |
| **Output** | Alertas de riesgo con modelo PE Mills validado |
| **Precisión Target** | >75% detección, integración R² >0.90 con PE Mills |

---

## 2.2 SOPORTE TÉCNICO-ACADÉMICO

### 2.2.1 Referencias Científicas Clave

| Ref | Autor(es) | Título | Publicación | Hallazgo |
|-----|-----------|--------|-------------|----------|
| 1 | Chatterjee et al. (2020) | "Electrical signals in pathogen-plant interactions" | Front. Plant Sci. 11 | VPs inducidos por patógenos |
| 2 | Christman & Mitter (2020) | "Plant electrical signals as biomarkers of pathogenesis" | Physiol. Mol. Plant Path. | Impedancia celular en infección |
| 3 | **Mills (1944)** | "Wet Periods in Relation to Disease" | Cornell Extension | **Modelo LWD original** |
| 4 | Magarey et al. (2005) | "A simple generic infection model" | Phytopathology 95 | Modelo PE generalizado |
| 5 | Bove (2006) | "Huanglongbing: A Destructive Disease" | Plant Disease 90 | HLB y cambios vasculares |
| 6 | Gottwald (2010) | "Current epidemiological understanding of citrus HLB" | Ann. Rev. Phytopathol. | Detección temprana HLB |

### 2.2.2 Modelo PE Mills (Fundamento Matemático)

**Ecuación de Riesgo de Infección:**
```
R(t) = Σ [f(T) × g(LWD)] × S(phenology)

Donde:
  R(t) = Riesgo acumulado de infección
  f(T) = Función de idoneidad térmica (beta normalizada)
  g(LWD) = Función de duración de mojadura foliar
  S(phenology) = Factor de susceptibilidad fenológica
```

**Función de Idoneidad Térmica (Beta):**
```
f(T) = ((T - Tmin) × (Tmax - T)^b) / ((Topt - Tmin) × (Tmax - Topt)^b)

Para T ∈ [Tmin, Tmax], f(T) = 0 fuera del rango

Parámetros por enfermedad:
  Antracnosis: Tmin=20°C, Topt=24°C, Tmax=28°C
  M. Grasienta: Tmin=22°C, Topt=25°C, Tmax=30°C
```

**Función de Mojadura Foliar:**
```
g(LWD) = 0                  si LWD < LWD_min
g(LWD) = (LWD - LWD_min) / (LWD_crit - LWD_min)  si LWD_min ≤ LWD < LWD_crit
g(LWD) = 1                  si LWD ≥ LWD_crit
```

---

## 2.3 TIPOS DE SEÑALES BIOELÉCTRICAS POR PATÓGENO

### 2.3.1 Infecciones Fúngicas

| Señal | Mecanismo | Firma | Enfermedad |
|-------|-----------|-------|------------|
| **VP (Variation Potential)** | Invasión hifal → estrés oxidativo | 5-30mV sostenido, horas | Antracnosis, M.Grasienta |
| **Impedancia ↓** | Degradación pared celular | -10 a -30% gradual | Phytophthora |
| **Conductancia estomática ↓** | Colonización estomática | Cierre parcial estomas | Mancha Grasienta |

### 2.3.2 Infecciones Bacterianas (HLB)

| Señal | Mecanismo | Firma | Temporalidad |
|-------|-----------|-------|--------------|
| **System Potential (SP)** | Obstrucción floema por CLas | 5-15mV crónico | Semanas-meses |
| **Impedancia ↓↓** | Acumulación almidón, colapso floema | -15 a -40% progresivo | Meses |
| **Baseline Drift** | Desbalance iónico sistémico | Deriva +5 a +15mV | Crónico |

---

## 2.4 FIRMAS BIOELÉCTRICAS POR ENFERMEDAD

| Enfermedad | Tipo | Firma Vmem | Firma Imped. | PE Mills | Lead |
|------------|------|------------|--------------|----------|------|
| **Antracnosis** | Fúngica | VP 5-30mV | ↓ gradual | Topt=24°C, LWD≥4h | 24h |
| **M. Grasienta** | Fúngica | Conductancia ↓20% | ↑ lento | Topt=25°C, LWD≥6h | 48h |
| **HLB** | Bacteriana | SP crónico, drift | ↓ 15-40% | N/A | **90 días** |
| **Phytophthora** | Oomycete | Colapso vascular | ↓ 20-50% | Suelo saturado | 12h |
| **Melanosis** | Fúngica | VP leve | Variable | Topt=26°C, LWD≥8h | 36h |
| **Sarna** | Fúngica | VP + imped. var. | Variable | Topt=23°C, LWD≥4h | 24h |

---

## 2.5 WORKFLOW DEL MÓDULO

```
┌─────────────────────────────────────────────────────────────────────────┐
│              DISEASE DETECTOR - WORKFLOW COMPLETO                       │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADAS
   │
   ├── Sensores Bioeléctricos (722 nodos)
   │      • Vmem, Impedancia
   │
   ├── Davis WeatherLink
   │      • Leaf Wetness (0-15), Temperatura, Humedad
   │
   └── PostgreSQL (histórico)
          • weather_data, LWD acumulado
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 1: CÁLCULO PE MILLS (cada hora)                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   FOR each disease IN [antracnosis, mancha_grasienta, melanosis, sarna]:│
│                                                                         │
│     1.1 Idoneidad térmica:                                              │
│         thermal = beta_function(temp, Tmin, Topt, Tmax)                │
│                                                                         │
│     1.2 Factor mojadura foliar:                                         │
│         lwd_hours = sum_consecutive_hours(leaf_wetness > 0.2)          │
│         wetness = sigmoid(lwd_hours, LWD_min, LWD_crit)                │
│                                                                         │
│     1.3 Riesgo PE Mills:                                                │
│         pe_risk = thermal × wetness                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 2: ANÁLISIS BIOELÉCTRICO (cada 5 min)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   2.1 Detección de Variation Potentials:                                │
│       vp_detected = detect_VP(vmem, threshold=5mV, duration>60min)     │
│                                                                         │
│   2.2 Análisis de impedancia:                                           │
│       impedance_trend = linear_fit(impedance[last_24h])                │
│       impedance_change_pct = (Z_now - Z_24h_ago) / Z_24h_ago × 100    │
│                                                                         │
│   2.3 Detección HLB (crónico):                                          │
│       hlb_indicators = {                                                │
│           'baseline_drift': vmem_baseline_7d - vmem_baseline_30d,      │
│           'impedance_chronic': impedance_change_30d,                   │
│           'diaphorina_correlation': check_pest_history('diaphorina')   │
│       }                                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 3: FUSIÓN PE MILLS + BIOELÉCTRICO                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   FOR each disease:                                                     │
│                                                                         │
│     IF disease.has_pe_mills:                                           │
│         # Enfermedades fúngicas: combinar modelos                      │
│         pe_weight = disease.pe_mills.weight  # 0.35-0.40               │
│                                                                         │
│         bio_score = analyze_bioelectric(signals, disease.signature)    │
│         pe_score = disease.pe_risk                                     │
│                                                                         │
│         confidence = bio_score × (1 - pe_weight) + pe_score × pe_weight│
│                                                                         │
│     ELSE:  # HLB, Phytophthora                                         │
│         # Solo bioeléctrico + triggers ambientales                     │
│         confidence = bio_score × env_factor                            │
│                                                                         │
│     # Factor fenológico                                                 │
│     IF phenology IN disease.critical_stages:                           │
│         confidence *= 1.30                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 4: GENERACIÓN DE ALERTAS                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   IF confidence >= disease.threshold:                                   │
│                                                                         │
│     alert = DiseaseAlert(                                               │
│         disease = disease.name,                                         │
│         confidence = confidence,                                        │
│         pe_mills_component = pe_score,                                  │
│         bioelectric_component = bio_score,                              │
│         lead_time = disease.lead_hours,                                 │
│         severity = classify(confidence, disease.critical),              │
│         action = disease.recommended_action                             │
│     )                                                                   │
│                                                                         │
│     # Alerta especial HLB                                               │
│     IF disease == 'HLB' AND confidence > 0.65:                         │
│         alert.notify = ['SENASICA', 'Agrónomo', 'Propietario']         │
│         alert.protocol = 'AISLAMIENTO_INMEDIATO'                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 5: INTEGRACIÓN                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   → Watson Optimizer: pe_mills_risk, treatment_timing                   │
│   → Health Agent: disease_pressure, IPF_adjustment                      │
│   → Opportunity Detector: prevention_window (24-48h antes de lluvia)   │
│   → Friston Layer: surprise_update                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.6 PANEL UI - DISEASE DETECTOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦠 DISEASE DETECTOR         [S1][S2][S3][S4][S5][S6]  [⚙️][📊][🔔]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  MODELO PE MILLS - RIESGO EN TIEMPO REAL                          │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │                                                                    │ │
│ │  ANTRACNOSIS          ████████████░░░░░░░░  68%  ⚠️ PREVENTIVO    │ │
│ │  T:24.5°C (óptimo)  LWD:6.2h (favorable)  Riesgo acumulado       │ │
│ │                                                                    │ │
│ │  MANCHA GRASIENTA     ██████░░░░░░░░░░░░░░  32%  ✅ BAJO          │ │
│ │  T:24.5°C (ok)      LWD:6.2h (bajo umbral)                       │ │
│ │                                                                    │ │
│ │  MELANOSIS            ████░░░░░░░░░░░░░░░░  18%  ✅ BAJO          │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  DETECCIÓN BIOELÉCTRICA                                           │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │                                                                    │ │
│ │  🟡 ANTRACNOSIS - S1                        Conf: 72% | Lead: 24h │ │
│ │     PE Mills: 68% | Bioeléctrico: 45% | Fusión: 72%              │ │
│ │     VP detectado: 12mV sostenido | Impedancia: -8%               │ │
│ │     [🎯 Detalle] [✅ Validar] [💊 Aplicar Cobre]                 │ │
│ │                                                                    │ │
│ │  🔴 HLB SOSPECHA - S2 (Árbol #247)          Conf: 67% | Lead: 90d │ │
│ │     Impedancia: -28% (30d) | Baseline drift: +9mV | Diaphorina: ✓│ │
│ │     ⚠️ REQUIERE VERIFICACIÓN PCR                                 │ │
│ │     [🔬 Solicitar PCR] [📍 Marcar Árbol] [🚧 Aislar Zona]        │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ CONDICIONES ACTUALES    │  │ PRONÓSTICO 48H                       │ │
│ │ 🌡️ Temp: 24.5°C        │  │ Lluvia esperada: Mañana 8am          │ │
│ │ 💧 LWD: 6.2h acum.     │  │ LWD proyectado: 12h+                 │ │
│ │ 💦 Humedad: 82%        │  │ ⚠️ VENTANA PREVENTIVA: HOY 4-7pm    │ │
│ │ 🍃 Leaf Wetness: 8/15  │  │ Aplicar fungicida antes de lluvia   │ │
│ └─────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.7 ACCIONES RECOMENDADAS POR ENFERMEDAD

| Enfermedad | Producto | Dosis | Timing | Trigger |
|------------|----------|-------|--------|---------|
| **Antracnosis** | Cobre oxicloruro 50% | 2 kg/ha | 24-48h antes lluvia | PE >60% |
| **M. Grasienta** | Mancozeb 80% | 2.5 kg/ha | Preventivo | PE >50% |
| **HLB** | **PROTOCOLO ESPECIAL** | - | **INMEDIATO** | Conf >65% |
| **Phytophthora** | Fosetil-Al 80% | 3 kg/ha | Urgente | Suelo saturado |
| **Melanosis** | Cobre + Mancozeb | 2+2 kg/ha | Post-floración | LWD >8h |
| **Sarna** | Benomilo 50% | 0.5 kg/ha | Brotes tiernos | PE >50% |

### Protocolo HLB (Obligatorio)

```
SI detección HLB con confianza >65%:

1. AISLAMIENTO INMEDIATO
   - Marcar árbol con GPS
   - Cinta amarilla visible
   - Notificar SENASICA en 24h

2. VERIFICACIÓN
   - Tomar muestra foliar
   - Enviar a laboratorio certificado
   - PCR para Candidatus Liberibacter

3. MIENTRAS ESPERA RESULTADOS
   - Control intensivo Diaphorina (radio 50m)
   - Monitoreo diario árboles adyacentes
   - NO podar, NO mover material vegetal

4. SI PCR POSITIVO
   - Erradicación obligatoria
   - Tratamiento área buffer 500m
   - Registro oficial SENASICA
```

---

## 2.8 ALGORITMO PYTHON - FUSIÓN PE MILLS + BIOELÉCTRICO

```python
class DiseaseDetector:
    """Detecta enfermedades fusionando PE Mills + bioeléctrico."""
    
    SIGNATURES = {
        'antracnosis': {
            'bioelectric': {'vp_threshold': 5, 'vp_duration_min': 60,
                           'impedance_change': (-20, -5)},
            'pe_mills': {'Tmin': 20, 'Topt': 24, 'Tmax': 28,
                        'LWD_min': 4, 'LWD_crit': 12, 'weight': 0.40},
            'env_triggers': {'humidity_min': 85},
            'phenology_critical': ['FEN-03'],
            'confidence_threshold': 0.75,
            'lead_hours': 24,
            'action': {'product': 'Cobre oxicloruro', 'dose': '2 kg/ha'}
        },
        'hlb': {
            'bioelectric': {'sp_chronic': True, 'impedance_drop': (15, 40),
                           'baseline_drift': (5, 15)},
            'pe_mills': None,  # No aplica
            'diaphorina_correlation': True,
            'chronic': True,
            'confidence_threshold': 0.65,
            'lead_hours': 2160,  # 90 días
            'critical': True,
            'action': {'protocol': 'HLB_AISLAMIENTO', 'notify': 'SENASICA'}
        }
    }
    
    def detect(self, signals, weather, leaf_wetness, phenology):
        detections = []
        
        for disease, sig in self.SIGNATURES.items():
            # Score bioeléctrico
            bio_score = self._analyze_bioelectric(signals, sig['bioelectric'])
            
            # Score PE Mills (si aplica)
            pe_score = 0
            if sig.get('pe_mills'):
                pe_score = self._calculate_pe_mills(
                    weather['temp'], leaf_wetness, sig['pe_mills']
                )
            
            # Fusión
            if sig.get('pe_mills'):
                w = sig['pe_mills']['weight']
                confidence = bio_score * (1 - w) + pe_score * w
            else:
                confidence = bio_score
            
            # Factor fenológico
            if phenology in sig.get('phenology_critical', []):
                confidence *= 1.30
            
            if confidence >= sig['confidence_threshold']:
                detections.append({
                    'disease': disease,
                    'confidence': min(1.0, confidence),
                    'pe_component': pe_score,
                    'bio_component': bio_score,
                    'lead_hours': sig['lead_hours'],
                    'action': sig['action']
                })
        
        return detections
    
    def _calculate_pe_mills(self, temp, lwd_hours, params):
        """Modelo PE Mills para riesgo fúngico."""
        # Idoneidad térmica
        Tmin, Topt, Tmax = params['Tmin'], params['Topt'], params['Tmax']
        if temp <= Tmin or temp >= Tmax:
            thermal = 0
        else:
            thermal = ((temp - Tmin) * (Tmax - temp)) / \
                      ((Topt - Tmin) * (Tmax - Topt))
        
        # Factor mojadura
        LWD_min, LWD_crit = params['LWD_min'], params['LWD_crit']
        if lwd_hours < LWD_min:
            wetness = 0
        elif lwd_hours >= LWD_crit:
            wetness = 1.0
        else:
            wetness = (lwd_hours - LWD_min) / (LWD_crit - LWD_min)
        
        return thermal * 0.4 + wetness * 0.6
```

---

## 2.9 MÉTRICAS DE VALIDACIÓN

| Métrica | Target | Validación |
|---------|--------|------------|
| Correlación PE Mills-campo | R² >0.90 | Backtesting histórico |
| Detección HLB temprana | >65% | PCR confirmación |
| Falsos positivos fúngicos | <20% | Inspección visual |
| Lead time promedio | >24h | Tiempo a síntomas visibles |

*Documento: Módulo 2 Disease Detector | Levin Layer 2.0 | 15 Enero 2026*
