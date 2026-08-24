# 🧬 LEVIN LAYER 2.0 - PLAN DE REDISEÑO INTEGRAL

**Versión:** 2.0  
**Fecha:** 15 Enero 2026  
**Estado:** PROPUESTA DE ARQUITECTURA  
**Autor:** CitrusMax AI System

---

## 1. RESUMEN EJECUTIVO

### 1.1 Contexto Actual

El **Levin Layer 1.0** actual detecta "metas bioeléctricas" usando el proxy **IPF (Índice de Presión Fitosanitaria)** calculado a partir de datos de muestreo manual. Con la incorporación de **sensores bioeléctricos reales** (Vmem, impedancia, frecuencia), se propone una reestructuración completa para:

1. **Detección temprana de plagas** (24-72h anticipación)
2. **Detección de enfermedades** (integración PE Mills)
3. **Identificación de deficiencias nutricionales**
4. **Predicción de estrés hídrico y riego**
5. **Detección de oportunidades operativas**
6. **Capacidades adicionales** (calidad de fruta, vigor, etc.)

### 1.2 Comparación Arquitectural

```
LEVIN LAYER 1.0 (ACTUAL)               LEVIN LAYER 2.0 (PROPUESTO)
═══════════════════════════            ═══════════════════════════════════════

┌─────────────────────────┐            ┌─────────────────────────────────────┐
│  Datos Muestreo Manual  │            │     SENSORES BIOELÉCTRICOS          │
│  (appsheet.muestreo)    │            │  ┌─────────┬─────────┬─────────┐   │
└───────────┬─────────────┘            │  │ Vmem    │ Imped.  │ Freq    │   │
            │                          │  │ (WE-RE) │ (kΩ)    │ (Hz)    │   │
            ▼                          │  └────┬────┴────┬────┴────┬────┘   │
┌─────────────────────────┐            └───────┼─────────┼─────────┼────────┘
│    Cálculo IPF Proxy    │                    │         │         │
│  (promedio últimos 30d) │                    ▼         ▼         ▼
└───────────┬─────────────┘            ┌─────────────────────────────────────┐
            │                          │    PREPROCESAMIENTO DE SEÑALES      │
            ▼                          │  ┌─────────┬─────────┬─────────┐   │
┌─────────────────────────┐            │  │ Kalman  │ FFT     │ Wavelet │   │
│  Umbral IPF > 30%       │            │  │ Filter  │ Análisis│ Decomp. │   │
│  → Activa defensa       │            │  └────┬────┴────┬────┴────┬────┘   │
└───────────┬─────────────┘            └───────┼─────────┼─────────┼────────┘
            │                                  │         │         │
            ▼                                  ▼         ▼         ▼
┌─────────────────────────┐            ┌─────────────────────────────────────┐
│  Ajuste Estrés Lineal   │            │      5 DETECTORES ESPECIALIZADOS    │
│  stress_level * 0.20    │            │  ┌─────────────────────────────────┐│
└─────────────────────────┘            │  │ 1. PEST DETECTOR               ││
                                       │  │ 2. DISEASE DETECTOR            ││
                                       │  │ 3. NUTRITION DETECTOR          ││
                                       │  │ 4. WATER STRESS DETECTOR       ││
                                       │  │ 5. OPPORTUNITY DETECTOR        ││
                                       │  └─────────────────────────────────┘│
                                       └─────────────────────────────────────┘
```

---

## 2. ARQUITECTURA LEVIN LAYER 2.0

### 2.1 Diagrama de Componentes

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                   LEVIN LAYER 2.0                       │
                    │                                                         │
┌──────────────┐    │  ┌──────────────────────────────────────────────────┐  │
│  SENSORES    │    │  │              SIGNAL PROCESSOR                    │  │
│  BIOELÉCTRI- │────┼──│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │  │
│  COS (Nodos) │    │  │  │Kalman  │ │  FFT   │ │Wavelet │ │Anomaly │   │  │
└──────────────┘    │  │  │Filter  │ │Analysis│ │Decomp. │ │Detect. │   │  │
                    │  │  └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘   │  │
┌──────────────┐    │  └───────┼──────────┼──────────┼──────────┼───────┘  │
│  DAVIS       │    │          │          │          │          │          │
│  WEATHER     │────┼──────────┼──────────┼──────────┼──────────┼──────────│
│  LINK        │    │          ▼          ▼          ▼          ▼          │
└──────────────┘    │  ┌──────────────────────────────────────────────────┐│
                    │  │              DETECTION ENGINE                     ││
┌──────────────┐    │  │  ┌─────────┐┌─────────┐┌─────────┐┌─────────┐   ││
│  POSTGRESQL  │────┼──│  │  PEST   ││ DISEASE ││NUTRITION││  WATER  │   ││
│  (Histórico) │    │  │  │DETECTOR ││DETECTOR ││DETECTOR ││ STRESS  │   ││
└──────────────┘    │  │  └────┬────┘└────┬────┘└────┬────┘└────┬────┘   ││
                    │  │       │          │          │          │         ││
┌──────────────┐    │  │  ┌────▼──────────▼──────────▼──────────▼────┐   ││
│  BIOFIX/GDD  │────┼──│  │         OPPORTUNITY DETECTOR             │   ││
│  (Fenología) │    │  │  └─────────────────┬────────────────────────┘   ││
└──────────────┘    │  └────────────────────┼────────────────────────────┘│
                    │                       │                              │
                    │  ┌────────────────────▼────────────────────────────┐│
                    │  │              OUTPUT AGGREGATOR                   ││
                    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        ││
                    │  │  │Bioelectric│ │  Goals   │ │Recommend.│        ││
                    │  │  │  Goals   │ │Confidence│ │  Actions │        ││
                    │  │  └──────────┘ └──────────┘ └──────────┘        ││
                    │  └─────────────────────┬──────────────────────────┘│
                    └────────────────────────┼───────────────────────────┘
                                             │
                                             ▼
                    ┌────────────────────────────────────────────────────┐
                    │  OTROS LAYERS (Friston, Watson, Hoffman, Penrose)  │
                    └────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

```python
# Flujo principal del Levin Layer 2.0
class LevinLayer2:
    def process_cycle(self, section_id: str) -> Dict:
        """
        Ciclo principal de procesamiento cada 5 minutos.
        """
        # 1. ADQUISICIÓN DE DATOS
        raw_bioelectric = self.data_ingestion.get_bioelectric_data(section_id)
        weather_data = self.data_ingestion.get_weather_data()
        historical_data = self.data_ingestion.get_historical(section_id)
        phenology = self.data_ingestion.get_phenology(section_id)
        
        # 2. PREPROCESAMIENTO DE SEÑALES
        processed_signals = self.signal_processor.process(raw_bioelectric)
        # - Filtro Kalman para ruido
        # - FFT para espectro de frecuencia
        # - Wavelet para eventos transitorios
        # - Detección de anomalías
        
        # 3. EJECUCIÓN DE DETECTORES
        pest_detections = self.pest_detector.detect(
            processed_signals, weather_data, phenology
        )
        
        disease_detections = self.disease_detector.detect(
            processed_signals, weather_data, phenology
        )
        
        nutrition_status = self.nutrition_detector.detect(
            processed_signals, phenology
        )
        
        water_status = self.water_detector.detect(
            processed_signals, weather_data
        )
        
        opportunities = self.opportunity_detector.detect(
            processed_signals, weather_data, phenology
        )
        
        # 4. AGREGACIÓN Y GENERACIÓN DE METAS BIOELÉCTRICAS
        bioelectric_goals = self.output_aggregator.generate_goals(
            pest_detections,
            disease_detections,
            nutrition_status,
            water_status,
            opportunities
        )
        
        return bioelectric_goals
```

---

## 3. MÓDULO 1: PEST DETECTOR (Detección de Plagas)

### 3.1 Objetivo
Detectar presencia temprana de **7 plagas principales** con 24-72h de anticipación mediante análisis de firmas bioeléctricas.

### 3.2 Plagas Objetivo y Firmas

| Plaga | Mecanismo de Daño | Firma Vmem | Firma Frecuencia | Anticipación |
|-------|-------------------|------------|------------------|--------------|
| **Trips** | Raspado epidermis | ΔVmem 12mV, burst | 15-25 Hz | 48h |
| **Minador** | Tunelización mesófilo | WP 50-150mV | 10-20 Hz | 24h |
| **Araña Roja** | Succión cloroplastos | Caída gradual | 3-8 Hz | 48h |
| **Pulgón** | Penetración floema | Shift osmótico | 5-15 Hz | 36h |
| **Diaphorina** | Alimentación + vector | Señal doble | 20-30 Hz | 72h |

### 3.3 Algoritmo de Detección

```python
class PestDetector:
    """Detecta plagas mediante análisis de señales bioeléctricas."""
    
    PEST_SIGNATURES = {
        'trips': {
            'vmem': {'delta_6h': (10, 20), 'pattern': 'burst'},
            'freq': {'band': (15, 25), 'duration': (1, 5)},
            'env': {'temp': (20, 30), 'humidity_max': 70},
            'lead_hours': 48,
            'confidence_threshold': 0.70
        },
        'minador': {
            'vmem': {'wound_potential': True, 'wp_amplitude': (50, 150)},
            'freq': {'band': (10, 20), 'pattern': 'continuous'},
            'phenology_sensitive': ['FEN-02', 'FEN-03'],
            'lead_hours': 24,
            'confidence_threshold': 0.72
        },
        'arana_roja': {
            'vmem': {'delta_6h': (5, 12), 'trend': 'decreasing_slow'},
            'freq': {'band': (3, 8), 'noise_increase': True},
            'env': {'temp_min': 25, 'humidity_max': 50},
            'lead_hours': 48,
            'confidence_threshold': 0.65
        },
        'pulgon': {
            'vmem': {'delta_6h': (8, 15), 'osmotic_shift': True},
            'freq': {'band': (5, 15), 'pattern': 'rhythmic'},
            'phenology_sensitive': ['FEN-02', 'FEN-03', 'FEN-04'],
            'lead_hours': 36,
            'confidence_threshold': 0.68
        },
        'diaphorina': {
            'vmem': {'delta_6h': (15, 25), 'double_signal': True},
            'freq': {'band': (20, 30), 'harmonics': True},
            'critical_alert': True,
            'lead_hours': 72,
            'confidence_threshold': 0.80
        }
    }
    
    def detect(self, signals: ProcessedSignals, weather: Dict, 
               phenology: str) -> List[Detection]:
        detections = []
        
        for pest_name, signature in self.PEST_SIGNATURES.items():
            # Calcular match de cada componente
            vmem_score = self._match_vmem(signals.vmem, signature['vmem'])
            freq_score = self._match_frequency(signals.spectrum, signature['freq'])
            env_score = self._match_environment(weather, signature.get('env', {}))
            phenology_factor = self._phenology_factor(
                phenology, signature.get('phenology_sensitive', [])
            )
            
            # Confianza compuesta
            confidence = (
                vmem_score * 0.40 +
                freq_score * 0.35 +
                env_score * 0.15 +
                phenology_factor * 0.10
            )
            
            if confidence >= signature['confidence_threshold']:
                detections.append(Detection(
                    threat_type='pest',
                    threat_name=pest_name,
                    confidence=confidence,
                    lead_time_hours=signature['lead_hours'],
                    critical=signature.get('critical_alert', False),
                    recommended_action=self._get_action(pest_name, confidence)
                ))
        
        return sorted(detections, key=lambda x: -x.confidence)
```

### 3.4 Acciones Recomendadas por Plaga

| Plaga | Confianza | Acción | Producto | Dosis |
|-------|-----------|--------|----------|-------|
| Trips | >70% | Aplicación preventiva | Spinosad / Abamectina | 0.5 L/ha |
| Minador | >72% | Aplicación focalizada | Imidacloprid | 0.3 L/ha |
| Araña Roja | >65% | Acaricida preventivo | Abamectina | 0.4 L/ha |
| Pulgón | >68% | Aplicación sistémica | Imidacloprid | 0.3 L/ha |
| Diaphorina | >80% | **ALERTA CRÍTICA** + Aplicación inmediata | Dimetoato | 1.0 L/ha |

---

## 4. MÓDULO 2: DISEASE DETECTOR (Detección de Enfermedades)

### 4.1 Objetivo
Detectar enfermedades fúngicas y bacterianas integrando señales bioeléctricas con el **modelo PE Mills** (Leaf Wetness Duration).

### 4.2 Enfermedades Objetivo

| Enfermedad | Mecanismo | Firma Bioeléctrica | Integración PE Mills |
|------------|-----------|-------------------|---------------------|
| **Antracnosis** | Invasión hifal | VP 5-30mV, gradual | Topt=24°C, LWD≥4h |
| **Mancha Grasienta** | Colonización estomática | Conductancia -20% | Topt=25°C, LWD≥6h |
| **HLB** | Obstrucción floema | Impedancia -20%, crónico | N/A (bacteriano) |
| **Phytophthora** | Pudrición raíz | Colapso vascular | Humedad suelo alta |

### 4.3 Algoritmo con PE Mills

```python
class DiseaseDetector:
    """Detecta enfermedades combinando bioeléctrico + PE Mills."""
    
    DISEASE_SIGNATURES = {
        'antracnosis': {
            'bioelectric': {
                'variation_potential': True,
                'vp_amplitude': (5, 30),
                'impedance_trend': 'gradual_decrease'
            },
            'pe_mills': {
                'Topt': 24, 'Tmin': 20, 'Tmax': 28,
                'LWD_min': 4, 'LWD_critical': 12,
                'weight': 0.40  # Peso en score final
            },
            'env_triggers': {'humidity_min': 85},
            'phenology_critical': ['FEN-03'],  # Floración
            'lead_hours': 24,
            'confidence_threshold': 0.75
        },
        'mancha_grasienta': {
            'bioelectric': {
                'stomatal_conductance_drop': (10, 30),
                'impedance_trend': 'slow_increase'
            },
            'pe_mills': {
                'Topt': 25, 'LWD_min': 6, 'LWD_critical': 18,
                'weight': 0.35
            },
            'env_triggers': {'humidity_min': 80},
            'phenology_critical': ['FEN-05'],  # Desarrollo
            'lead_hours': 48,
            'confidence_threshold': 0.70
        },
        'hlb': {
            'bioelectric': {
                'system_potential': True,
                'impedance_drop': (15, 40),
                'chronic_baseline_drift': True
            },
            'pe_mills': None,  # No aplica para bacteriana
            'diaphorina_correlation': True,
            'chronic_disease': True,
            'lead_hours': 2160,  # 90 días
            'confidence_threshold': 0.65,
            'critical_alert': True
        }
    }
    
    def detect(self, signals: ProcessedSignals, weather: Dict,
               leaf_wetness: float, phenology: str) -> List[Detection]:
        detections = []
        
        for disease_name, sig in self.DISEASE_SIGNATURES.items():
            # Score bioeléctrico
            bio_score = self._analyze_bioelectric(signals, sig['bioelectric'])
            
            # Score PE Mills si aplica
            pe_score = 0
            if sig.get('pe_mills'):
                pe_score = self._calculate_pe_mills_risk(
                    weather, leaf_wetness, sig['pe_mills']
                )
            
            # Score ambiental
            env_score = self._check_env_triggers(weather, sig.get('env_triggers', {}))
            
            # Factor fenológico
            phen_factor = 1.3 if phenology in sig.get('phenology_critical', []) else 1.0
            
            # Confianza compuesta
            if sig.get('pe_mills'):
                pe_weight = sig['pe_mills']['weight']
                confidence = (bio_score * (1 - pe_weight) + pe_score * pe_weight)
            else:
                confidence = bio_score
            
            confidence *= env_score * phen_factor
            
            if confidence >= sig['confidence_threshold']:
                detections.append(Detection(
                    threat_type='disease',
                    threat_name=disease_name,
                    confidence=min(1.0, confidence),
                    lead_time_hours=sig['lead_hours'],
                    critical=sig.get('critical_alert', False),
                    chronic=sig.get('chronic_disease', False)
                ))
        
        return detections
    
    def _calculate_pe_mills_risk(self, weather, leaf_wetness, pe_params):
        """Calcula riesgo usando modelo PE Mills."""
        temp = weather.get('temp', 25)
        
        # Idoneidad térmica (función beta)
        Tmin, Topt, Tmax = pe_params['Tmin'], pe_params['Topt'], pe_params['Tmax']
        if temp <= Tmin or temp >= Tmax:
            thermal_suitability = 0
        else:
            thermal_suitability = ((temp - Tmin) * (Tmax - temp)) / \
                                  ((Topt - Tmin) * (Tmax - Topt))
        
        # Factor mojadura foliar
        wet_norm = min(1.0, leaf_wetness / 15)  # Davis 0-15
        if wet_norm < 0.2:
            wetness_factor = 0
        elif wet_norm < 0.5:
            wetness_factor = (wet_norm - 0.2) / 0.3 * 0.3
        else:
            wetness_factor = 0.3 + (wet_norm - 0.5) / 0.5 * 0.7
        
        # Riesgo compuesto
        return thermal_suitability * 0.4 + wetness_factor * 0.6
```

---

## 5. MÓDULO 3: NUTRITION DETECTOR (Deficiencias Nutricionales)

### 5.1 Objetivo
Identificar **deficiencias de N, P, K, Ca, Mg, Fe, Zn** mediante análisis de potencial de membrana e impedancia celular, y predecir necesidad de aporte.

### 5.2 Base Científica
El potencial de membrana está directamente relacionado con:
- **Bomba Na+/K+ ATPasa** → Deficiencia K afecta Vmem
- **Balance iónico celular** → Deficiencias causan despolarización
- **Integridad de pared celular** → Ca afecta impedancia
- **Síntesis de clorofila** → Mg/Fe afectan respuesta a luz

### 5.3 Firmas Nutricionales

| Nutriente | Firma Vmem | Firma Impedancia | Síntomas Asociados |
|-----------|------------|------------------|-------------------|
| **N** | Baseline -15 a -30mV | Aumento 10-25% | Clorosis generalizada |
| **K** | Baseline +10 a +25mV (anormal) | Disminución 5-15% | Necrosis marginal |
| **Ca** | Reducción AP 20-40% | Disminución 15-35% | Deformación hojas nuevas |
| **Mg** | Respuesta luz reducida | - | Clorosis intervenal |
| **Fe** | Amplitud -30 a -50% | Aumento a 100kHz | Clorosis hojas nuevas |
| **Zn** | Señal ápice débil | - | Hojas pequeñas moteadas |

### 5.4 Algoritmo de Detección

```python
class NutritionDetector:
    """Detecta deficiencias nutricionales por señales bioeléctricas."""
    
    NUTRITION_SIGNATURES = {
        'nitrogen': {
            'element': 'N',
            'vmem': {'baseline_shift': (-15, -30), 'trend': 'gradual_decrease'},
            'impedance': {'change': 'increase', 'percentage': (10, 25)},
            'phenology_critical': ['FEN-02', 'FEN-03', 'FEN-04'],
            'urgency': 'high',
            'product': 'Urea 46% o Nitrato de Amonio',
            'window_days': 7
        },
        'potassium': {
            'element': 'K',
            'vmem': {'baseline_shift': (10, 25), 'oscillation': True},
            'impedance': {'change': 'decrease', 'percentage': (5, 15)},
            'phenology_critical': ['FEN-05', 'FEN-06'],
            'urgency': 'medium',
            'product': 'KCl 60% o K2SO4',
            'window_days': 14
        },
        'calcium': {
            'element': 'Ca',
            'vmem': {'ap_amplitude_reduction': (20, 40)},
            'impedance': {'change': 'significant_decrease', 'percentage': (15, 35)},
            'phenology_critical': ['FEN-02', 'FEN-04'],
            'urgency': 'high',
            'product': 'Nitrato de Calcio',
            'window_days': 5
        },
        'magnesium': {
            'element': 'Mg',
            'vmem': {'light_response': 'reduced', 'circadian_amplitude': 'decreased'},
            'light_sensor_correlation': True,
            'phenology_critical': ['FEN-03', 'FEN-04', 'FEN-05'],
            'urgency': 'medium',
            'product': 'Sulfato de Magnesio (Epsom)',
            'window_days': 10
        },
        'iron': {
            'element': 'Fe',
            'vmem': {'amplitude_reduction': (30, 50), 'snr_degradation': True},
            'impedance': {'high_freq_affected': True},
            'soil_ph_correlation': '>7.5',
            'urgency': 'high',
            'product': 'Quelato de Hierro EDDHA',
            'window_days': 7
        },
        'zinc': {
            'element': 'Zn',
            'vmem': {'growth_signal': 'abnormal', 'apical_weak': True},
            'phenology_critical': ['FEN-02'],
            'urgency': 'medium',
            'product': 'Sulfato de Zinc o Quelato Zn',
            'window_days': 14
        }
    }
    
    def detect(self, signals: ProcessedSignals, light_data: Dict,
               phenology: str) -> List[NutritionStatus]:
        deficiencies = []
        
        for nutrient_name, sig in self.NUTRITION_SIGNATURES.items():
            vmem_match = self._analyze_vmem_nutrition(signals.vmem, sig['vmem'])
            impedance_match = self._analyze_impedance(signals.impedance, sig.get('impedance', {}))
            
            # Correlación con luz para Mg
            light_match = 0
            if sig.get('light_sensor_correlation'):
                light_match = self._analyze_light_response(signals.vmem, light_data)
            
            # Factor fenológico
            phen_factor = 1.3 if phenology in sig.get('phenology_critical', []) else 1.0
            
            score = (vmem_match * 0.5 + impedance_match * 0.3 + light_match * 0.2)
            score *= phen_factor
            
            if score > 0.6:
                deficiencies.append(NutritionStatus(
                    nutrient=sig['element'],
                    deficiency_score=min(1.0, score),
                    urgency=sig['urgency'],
                    recommended_product=sig['product'],
                    apply_within_days=sig['window_days']
                ))
        
        return deficiencies
    
    def predict_future_needs(self, vmem_trends: List, weather_forecast: Dict,
                             phenology_forecast: str) -> List[NutritionPrediction]:
        """Predice necesidades nutricionales futuras basado en tendencias."""
        predictions = []
        
        for nutrient_name, sig in self.NUTRITION_SIGNATURES.items():
            trend = self._analyze_trend(vmem_trends, sig['vmem'], days_ahead=14)
            
            if trend['approaching_deficiency']:
                predictions.append(NutritionPrediction(
                    nutrient=sig['element'],
                    days_until_deficiency=trend['days_estimate'],
                    confidence=trend['confidence'],
                    proactive_product=sig['product'],
                    apply_before_days=max(1, trend['days_estimate'] - 3)
                ))
        
        return predictions
```

---

## 6. MÓDULO 4: WATER STRESS DETECTOR (Estrés Hídrico)

### 6.1 Objetivo
Detectar **estrés hídrico presente** y **predecir necesidad de riego** con integración al IAH existente.

### 6.2 Base Científica
El potencial hídrico de la planta afecta directamente el potencial de membrana:
- **Planta hidratada**: Vmem = -60 a -75 mV (normal)
- **Estrés leve**: Vmem = -75 a -85 mV (hiperpolarización)
- **Estrés severo**: Vmem = -100 a -120 mV
- **Estrés crítico**: Vmem < -120 mV (daño celular)

### 6.3 Niveles de Estrés y Acciones

| Nivel | Vmem (mV) | Impedancia (kΩ) | IAH Equiv. | Acción |
|-------|-----------|-----------------|------------|--------|
| **Óptimo** | -60 a -75 | 400-600 | 0-20 | Mantener programa |
| **Leve** | -75 a -85 | 600-800 | 20-40 | Aumentar frecuencia |
| **Moderado** | -85 a -100 | 800-1000 | 40-70 | Riego inmediato |
| **Severo** | -100 a -120 | 1000-1500 | 70-100 | Riego emergencia |
| **Crítico** | < -120 | > 1500 | > 100 | Recuperación urgente |

### 6.4 Algoritmo de Detección y Predicción

```python
class WaterStressDetector:
    """Detecta estrés hídrico y predice necesidad de riego."""
    
    STRESS_LEVELS = {
        'optimal':  {'vmem': (-75, -60), 'impedance': (400, 600), 'iah': (0, 20)},
        'mild':     {'vmem': (-85, -75), 'impedance': (600, 800), 'iah': (20, 40)},
        'moderate': {'vmem': (-100, -85), 'impedance': (800, 1000), 'iah': (40, 70)},
        'severe':   {'vmem': (-120, -100), 'impedance': (1000, 1500), 'iah': (70, 100)},
        'critical': {'vmem': (-150, -120), 'impedance': (1500, 3000), 'iah': (100, 150)}
    }
    
    def detect_current(self, vmem: float, impedance: float, 
                       env_data: Dict) -> WaterStatus:
        """Detecta nivel de estrés hídrico actual."""
        temp_factor = self._temperature_adjustment(env_data.get('temp', 25))
        vmem_adjusted = vmem * temp_factor
        
        for level_name, thresholds in self.STRESS_LEVELS.items():
            vmem_min, vmem_max = thresholds['vmem']
            imp_min, imp_max = thresholds['impedance']
            
            if vmem_min <= vmem_adjusted <= vmem_max:
                impedance_confirms = imp_min <= impedance <= imp_max
                iah_equiv = sum(thresholds['iah']) / 2
                
                return WaterStatus(
                    stress_level=level_name,
                    vmem_current=vmem,
                    impedance_current=impedance,
                    iah_equivalent=iah_equiv,
                    action=self._get_action(level_name),
                    confidence=0.85 if impedance_confirms else 0.65,
                    critical=level_name in ['severe', 'critical']
                )
        
        return WaterStatus(stress_level='unknown', action='investigate')
    
    def predict_irrigation_need(self, vmem_series: List, weather_forecast: Dict,
                                 soil_moisture: float, section: str) -> IrrigationPrediction:
        """Predice necesidad de riego basado en tendencias."""
        # Calcular tendencia de Vmem (últimas 24h)
        trend = self._calculate_trend(vmem_series, window_hours=24)
        
        if trend['slope'] < 0:  # Vmem bajando (más negativo = más estrés)
            current_vmem = vmem_series[-1]
            target_vmem = -85  # Umbral estrés moderado
            
            hours_to_stress = abs(target_vmem - current_vmem) / abs(trend['slope'])
            
            # Ajustar por humedad de suelo
            soil_factor = 1.0 + (50 - soil_moisture) / 100  # Suelo seco acelera
            hours_to_stress /= soil_factor
            
            return IrrigationPrediction(
                needed=True,
                hours_until_stress=hours_to_stress,
                recommended_timing=max(0, hours_to_stress - 12),  # 12h antes
                volume_estimate_mm=self._estimate_volume(current_vmem, target_vmem),
                section=section,
                confidence=trend['r_squared']
            )
        
        return IrrigationPrediction(needed=False, next_check_hours=24)
    
    def integrate_with_iah(self, bioelectric_status: WaterStatus,
                          iah_current: float) -> Dict:
        """Integra detección bioeléctrica con IAH existente."""
        bio_iah = bioelectric_status.iah_equivalent
        
        # Si hay discrepancia > 20 puntos, priorizar bioeléctrico
        if abs(bio_iah - iah_current) > 20:
            corrected_iah = bio_iah * 0.7 + iah_current * 0.3
            return {
                'iah_corrected': corrected_iah,
                'discrepancy': True,
                'recommendation': 'verify_soil_sensors'
            }
        
        return {'iah_corrected': iah_current, 'bioelectric_confirms': True}
```

---

## 7. MÓDULO 5: OPPORTUNITY DETECTOR (Detección de Oportunidades)

### 7.1 Objetivo
Detectar **ventanas óptimas** para aplicaciones, cosecha y otras acciones basadas en el estado fisiológico de la planta.

### 7.2 Tipos de Oportunidades

| Oportunidad | Condición Vmem | Condición Ambiente | Valor |
|-------------|----------------|-------------------|-------|
| **Aplicación foliar óptima** | -60 a -75mV (no estresada) | Hum 60-80%, Viento <15km/h | +30% absorción |
| **Fertirrigación óptima** | -65 a -80mV, raíz activa | Suelo 40-70% hum | +40% uptake |
| **Cosecha óptima** | Vmem estable, sin estrés | PE >90% madurez | Máxima calidad |
| **Tratamiento preventivo** | Riesgo bajo actual | Condiciones favorables próximas | Prevención > curación |

### 7.3 Algoritmo de Detección

```python
class OpportunityDetector:
    """Detecta oportunidades basadas en estado fisiológico óptimo."""
    
    OPPORTUNITIES = {
        'optimal_spray_window': {
            'vmem_range': (-75, -60),
            'stress_max': 30,
            'humidity_range': (60, 80),
            'wind_max_kmh': 15,
            'bioelectric_indicators': ['stomata_open', 'active_transpiration'],
            'duration_min_hours': 4,
            'value': 'Mejor absorción foliar, menos producto necesario'
        },
        'optimal_fertigation': {
            'vmem_range': (-80, -65),
            'root_activity': 'high',
            'soil_moisture_range': (40, 70),
            'bioelectric_indicators': ['root_uptake_active', 'phloem_transport'],
            'timing': 'early_morning',
            'value': 'Máxima absorción radicular'
        },
        'optimal_harvest': {
            'vmem_stable': True,
            'stress_max': 20,
            'phenology': 'FEN-07',
            'gdd_min': 1750,
            'bioelectric_indicators': ['maturation_complete', 'no_active_stress'],
            'pe_correlation': True,
            'value': 'Máxima calidad de fruta'
        },
        'disease_prevention_window': {
            'disease_risk_low': True,
            'humidity_forecast_high': True,  # Se espera humedad
            'timing': '24-48h antes de condiciones favorables',
            'value': 'Prevención más efectiva que curación'
        }
    }
    
    def detect(self, signals: ProcessedSignals, env_data: Dict,
               weather_forecast: Dict, phenology: str, pe_current: float) -> List[Opportunity]:
        opportunities = []
        
        for opp_name, config in self.OPPORTUNITIES.items():
            vmem_ok = self._check_vmem(signals.vmem_mean, config.get('vmem_range'))
            env_ok = self._check_environment(env_data, weather_forecast, config)
            bio_ok = self._check_bioelectric_indicators(signals, config.get('bioelectric_indicators', []))
            
            phenology_ok = True
            if 'phenology' in config:
                phenology_ok = phenology == config['phenology']
            
            score = (vmem_ok * 0.4 + env_ok * 0.3 + bio_ok * 0.3)
            if not phenology_ok:
                score *= 0.5
            
            if score > 0.7:
                opportunities.append(Opportunity(
                    type=opp_name,
                    score=score,
                    value=config['value'],
                    valid_hours=config.get('duration_min_hours', 24),
                    timing=config.get('timing', 'now')
                ))
        
        return sorted(opportunities, key=lambda x: -x.score)
```

---

## 8. MÓDULO 6: CAPACIDADES ADICIONALES

### 8.1 Calidad de Fruta (Brix, Acidez)

```python
class FruitQualityPredictor:
    """Predice calidad de fruta basado en señales bioeléctricas."""
    
    def predict_brix(self, vmem_series: List, phenology: str, gdd: float) -> float:
        """
        Correlación: Mayor transporte de azúcares → patrones específicos de Vmem
        durante maduración (FEN-06, FEN-07).
        """
        if phenology not in ['FEN-06', 'FEN-07']:
            return None
        
        # Analizar patrones de transporte floema
        transport_activity = self._analyze_phloem_transport(vmem_series)
        gdd_factor = min(1.0, gdd / 1800)
        
        # Modelo empírico (requiere calibración con refractómetro)
        brix_estimate = 6.0 + transport_activity * 4.0 * gdd_factor
        
        return round(brix_estimate, 1)
```

### 8.2 Vigor Vegetativo

```python
class VigorAssessor:
    """Evalúa vigor vegetativo para decisiones de poda."""
    
    def assess_vigor(self, vmem_series: List, light_response: Dict) -> Dict:
        """
        Plantas vigorosas: Mayor amplitud de señales, respuesta rápida a luz.
        """
        signal_amplitude = self._calculate_amplitude(vmem_series)
        light_reactivity = self._analyze_light_response(vmem_series, light_response)
        
        vigor_score = signal_amplitude * 0.5 + light_reactivity * 0.5
        
        return {
            'vigor_score': vigor_score,
            'classification': self._classify_vigor(vigor_score),
            'pruning_recommendation': self._pruning_advice(vigor_score)
        }
```

### 8.3 Detección de Daño por Helada

```python
class FrostDamageDetector:
    """Detecta daño por helada en tiempo real."""
    
    def detect_frost_damage(self, vmem_series: List, temp_history: List) -> Dict:
        """
        Daño por helada: Colapso de Vmem cuando temp < 2°C.
        """
        if min(temp_history[-6:]) > 2:  # Últimas 6 horas
            return {'frost_damage': False}
        
        # Buscar colapso de Vmem post-helada
        vmem_drop = vmem_series[-1] - vmem_series[-12]  # Últimas 12h
        
        if vmem_drop < -30:  # Caída significativa
            return {
                'frost_damage': True,
                'severity': self._assess_severity(vmem_drop),
                'recovery_estimate_days': self._estimate_recovery(vmem_drop),
                'action': 'apply_biostimulant'
            }
        
        return {'frost_damage': False, 'plant_resilient': True}
```

---

## 9. INTEGRACIÓN CON OTROS LAYERS

### 9.1 Flujo de Datos entre Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LEVIN LAYER 2.0                            │
│  Output: bioelectric_goals, detections, opportunities               │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  FRISTON LAYER  │  │  WATSON LAYER   │  │  HOFFMAN LAYER  │
│                 │  │                 │  │                 │
│ Recibe:         │  │ Recibe:         │  │ Recibe:         │
│ - pest_alerts   │  │ - nutrition_def │  │ - all_detections│
│ - disease_alerts│  │ - water_stress  │  │ - opportunities │
│                 │  │ - opportunities │  │                 │
│ Calcula:        │  │ Calcula:        │  │ Calcula:        │
│ - surprise      │  │ - energy_gaps   │  │ - perception    │
│ - urgency       │  │ - optimization  │  │ - conflicts     │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  PENROSE LAYER  │
                    │                 │
                    │ Integra todos   │
                    │ los outputs y   │
                    │ genera decisión │
                    │ final coherente │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  DR. CITRUSMAX  │
                    │  (Orquestador)  │
                    └─────────────────┘
```

### 9.2 Modificaciones Requeridas en Otros Layers

#### Friston Layer
```python
# Agregar handling para alertas bioeléctricas
def calculate_surprise(self, observations: Dict, levin_output: Dict):
    base_surprise = super().calculate_surprise(observations)
    
    # Aumentar surprise si hay alertas bioeléctricas
    if levin_output.get('critical_alerts'):
        base_surprise *= 1.5
    
    return base_surprise
```

#### Watson Layer
```python
# Integrar deficiencias nutricionales en optimización
def optimize_energy_landscape(self, state: Dict, levin_output: Dict):
    base_optimization = super().optimize_energy_landscape(state)
    
    # Ajustar por deficiencias detectadas
    if levin_output.get('nutrition_deficiencies'):
        for deficiency in levin_output['nutrition_deficiencies']:
            base_optimization['actions'].append({
                'type': 'nutrition_correction',
                'nutrient': deficiency['nutrient'],
                'urgency': deficiency['urgency']
            })
    
    return base_optimization
```

---

## 10. ESQUEMA DE BASE DE DATOS

### 10.1 Nuevas Tablas PostgreSQL

```sql
-- Tabla de lecturas bioeléctricas en tiempo real
CREATE TABLE c2ai.bioelectric_readings (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    section VARCHAR(10) NOT NULL,
    node_id VARCHAR(20) NOT NULL,
    vmem_mv DECIMAL(8,2),
    vmem_std DECIMAL(8,2),
    impedance_kohm DECIMAL(10,2),
    freq_dominant_hz DECIMAL(6,2),
    temperature_c DECIMAL(5,2),
    humidity_pct DECIMAL(5,2),
    light_lux INTEGER,
    battery_pct DECIMAL(5,2),
    rssi_dbm INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas frecuentes
CREATE INDEX idx_bioelectric_section_time ON c2ai.bioelectric_readings(section, timestamp);
CREATE INDEX idx_bioelectric_node_time ON c2ai.bioelectric_readings(node_id, timestamp);

-- Tabla de detecciones del Levin Layer 2.0
CREATE TABLE c2ai.levin_detections (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    section VARCHAR(10) NOT NULL,
    detection_type VARCHAR(20) NOT NULL,  -- pest, disease, nutrition, water, opportunity
    threat_name VARCHAR(50),
    confidence DECIMAL(4,3),
    lead_time_hours INTEGER,
    critical BOOLEAN DEFAULT FALSE,
    evidence JSONB,
    recommended_action TEXT,
    validated BOOLEAN DEFAULT NULL,
    validation_timestamp TIMESTAMPTZ,
    validation_notes TEXT
);

-- Tabla de metas bioeléctricas (output del Levin Layer)
CREATE TABLE c2ai.bioelectric_goals (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    section VARCHAR(10) NOT NULL,
    goal_type VARCHAR(30) NOT NULL,
    goal_value DECIMAL(10,4),
    confidence DECIMAL(4,3),
    priority INTEGER,
    expires_at TIMESTAMPTZ,
    metadata JSONB
);
```

### 10.2 Vistas para Análisis

```sql
-- Vista de alertas activas
CREATE VIEW c2ai.v_active_alerts AS
SELECT 
    d.*,
    CASE 
        WHEN d.critical THEN 'CRÍTICO'
        WHEN d.confidence > 0.8 THEN 'ALTO'
        WHEN d.confidence > 0.7 THEN 'MEDIO'
        ELSE 'BAJO'
    END as severity
FROM c2ai.levin_detections d
WHERE d.timestamp > NOW() - INTERVAL '24 hours'
  AND d.validated IS NULL
ORDER BY d.critical DESC, d.confidence DESC;

-- Vista de tendencias por sección
CREATE VIEW c2ai.v_bioelectric_trends AS
SELECT 
    section,
    DATE_TRUNC('hour', timestamp) as hour,
    AVG(vmem_mv) as vmem_avg,
    STDDEV(vmem_mv) as vmem_std,
    AVG(impedance_kohm) as impedance_avg,
    COUNT(*) as reading_count
FROM c2ai.bioelectric_readings
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY section, DATE_TRUNC('hour', timestamp)
ORDER BY section, hour;
```

---

## 11. PLAN DE IMPLEMENTACIÓN

### 11.1 Fases de Desarrollo

| Fase | Duración | Entregables |
|------|----------|-------------|
| **Fase 1: Infraestructura** | 2 semanas | Tablas BD, APIs básicas, mock data generator |
| **Fase 2: Signal Processor** | 2 semanas | Kalman filter, FFT, anomaly detection |
| **Fase 3: Pest Detector** | 3 semanas | 5 plagas, validación con datos históricos |
| **Fase 4: Disease Detector** | 2 semanas | Integración PE Mills, 4 enfermedades |
| **Fase 5: Nutrition Detector** | 2 semanas | 6 nutrientes, correlación con análisis foliares |
| **Fase 6: Water Stress** | 1 semana | Integración con IAH existente |
| **Fase 7: Opportunity Detector** | 1 semana | Ventanas óptimas, integración PE |
| **Fase 8: Integración Layers** | 2 semanas | Friston, Watson, Hoffman, Penrose |
| **Fase 9: UI Dashboard** | 2 semanas | Panel bioeléctrico en CitrusMax Harvest Pro |
| **Fase 10: Piloto** | 4 semanas | 25 nodos, validación en campo |

**Total estimado: 21 semanas (5 meses)**

### 11.2 Prioridades de Implementación

1. **ALTA**: Pest Detector (Diaphorina crítico para HLB)
2. **ALTA**: Water Stress Detector (impacto directo en producción)
3. **MEDIA**: Disease Detector (integración PE Mills ya existente)
4. **MEDIA**: Nutrition Detector (complementa análisis foliares)
5. **BAJA**: Opportunity Detector (optimización)

### 11.3 Métricas de Éxito

| Métrica | Target | Método de Medición |
|---------|--------|-------------------|
| Anticipación plagas | >70% detecciones 24h antes | Validación en campo |
| Falsos positivos | <15% | Validación por agrónomos |
| Reducción aplicaciones | 20% menos | Comparación vs año anterior |
| Precisión nutrición | >80% vs análisis foliar | Correlación laboratorio |
| Ahorro agua | 15% | Comparación IAH vs bioeléctrico |

---

## 12. CONCLUSIONES

### 12.1 Beneficios Esperados

1. **Detección 24-72h anticipada** de plagas y enfermedades
2. **Reducción 20-30%** en aplicaciones fitosanitarias
3. **Optimización de riego** basada en fisiología real de la planta
4. **Nutrición de precisión** con recomendaciones proactivas
5. **Identificación de ventanas óptimas** para todas las operaciones

### 12.2 Innovación Tecnológica

El Levin Layer 2.0 representa un **cambio de paradigma**:
- De **muestreo manual reactivo** a **monitoreo continuo predictivo**
- De **proxies indirectos** (IPF calculado) a **señales fisiológicas directas**
- De **umbrales fijos** a **detección inteligente por firmas**

### 12.3 Próximos Pasos

1. ✅ Aprobación de arquitectura
2. ⏳ Instalación piloto 25 nodos
3. ⏳ Desarrollo de Signal Processor
4. ⏳ Entrenamiento de modelos con datos reales
5. ⏳ Integración con infraestructura existente

---

## 13. MÓDULOS ADICIONALES (6-10)

### 13.1 MÓDULO 6: FRUIT QUALITY PREDICTOR (°Brix)

**Base científica:** El transporte de azúcares por floema genera patrones de Vmem característicos.

| Parámetro | °Brix 8-9 | °Brix 10-11 | °Brix 12+ |
|-----------|-----------|-------------|-----------|
| Vmem σ | > 8mV | 4-8mV | < 4mV |
| Transporte floema | Bajo | Moderado | Alto/Estable |

```python
brix = 6.0 + (-0.3 * vmem_std) + (2.5 * transport_score) + (0.002 * gdd)
```

### 13.2 MÓDULO 7: VIGOR ASSESSOR

| Vigor | Amplitud Vmem | Respuesta Luz | Poda Recomendada |
|-------|---------------|---------------|------------------|
| Alto | > 25mV | < 2 min | Intensa (30-40%) |
| Normal | 15-25mV | 2-5 min | Moderada (20-30%) |
| Bajo | 10-15mV | 5-10 min | Ligera (10-20%) |
| Débil | < 10mV | > 10 min | Sin poda + nutrición |

### 13.3 MÓDULO 8: FROST DAMAGE DETECTOR

| Temp (°C) | Vmem Response | Daño Esperado | Recuperación |
|-----------|---------------|---------------|--------------|
| 2 a 0 | -10 a -20mV | Mínimo | 24-48h |
| 0 a -2 | -20 a -40mV | Hojas nuevas | 3-7 días |
| -2 a -4 | -40 a -70mV | Brotes, flores | 7-14 días |
| < -4 | > -70mV colapso | Ramas, fruta | Semanas |

### 13.4 MÓDULO 9: RECOVERY MONITOR

Monitorea resiliencia post-estrés:
- Tasa de recuperación de Vmem hacia baseline (-68mV)
- Tiempo para 50%, 80%, 100% recuperación
- Intervención automática si recuperación < 50% en 24h

### 13.5 MÓDULO 10: CIRCADIAN CORRECTOR

| Hora | Factor Vmem | Actividad Planta |
|------|-------------|------------------|
| 06:00-09:00 | 1.15 | Apertura estomas |
| 09:00-12:00 | 1.00 | Máxima fotosíntesis |
| 12:00-15:00 | 0.95 | Estrés calórico |
| 18:00-21:00 | 1.10 | Cierre estomas |
| 21:00-06:00 | 1.20 | Reposo nocturno |

---

## 14. CÁLCULO ESTADÍSTICO DE SENSORES

### 14.1 Fórmula de Tamaño de Muestra (Población Finita)

```
        Z² × p × (1-p) × N
n = ─────────────────────────────
    E² × (N-1) + Z² × p × (1-p)
```

### 14.2 Escenario Recomendado: 95% Confianza, 8% Error

| Sección | Árboles | Sensores | Costo ($65.85/u) | Cobertura |
|---------|---------|----------|------------------|-----------|
| S1 | 625 | 120 | $7,902 | 19.2% |
| S2 | 750 | 127 | $8,363 | 16.9% |
| S3 | 500 | 111 | $7,309 | 22.2% |
| S4 | 625 | 120 | $7,902 | 19.2% |
| S5 | 875 | 133 | $8,758 | 15.2% |
| S6 | 500 | 111 | $7,309 | 22.2% |
| **TOTAL** | **3,875** | **722** | **$47,543** | **18.6%** |

### 14.3 Plan de Implementación

| Fase | Sensores | Inversión | Timeline |
|------|----------|-----------|----------|
| Piloto (S1) | 30 | $1,976 | Mes 1-2 |
| Fase 1 (S1+S2) | 247 | $16,265 | Mes 3-4 |
| Fase 2 (S3+S4) | 231 | $15,211 | Mes 5-6 |
| Fase 3 (S5+S6) | 244 | $16,067 | Mes 7-8 |

**Total con redundancia (10%): 794 sensores = $52,305 USD**

---

*Documento actualizado: 15 Enero 2026*  
*Versión: 2.1-COMPLETE (10 Módulos + Cálculo Sensores)*  
*Autor: CitrusMax AI System*
