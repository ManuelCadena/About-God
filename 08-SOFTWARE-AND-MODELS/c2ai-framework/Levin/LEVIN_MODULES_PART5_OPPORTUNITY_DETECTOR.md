# 🎯 MÓDULO 5: OPPORTUNITY DETECTOR - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

## 5.1 RESUMEN EJECUTIVO

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Identificar ventanas óptimas para operaciones agrícolas |
| **Input** | Estado bioeléctrico, Pronóstico meteo, Fenología, Mercado |
| **Output** | Ventanas de oportunidad con timing, ROI y prioridad |
| **Ventanas** | Aspersión, Fertiriego, Cosecha, Poda, Muestreo |

---

## 5.2 SOPORTE TÉCNICO-ACADÉMICO

### 5.2.1 Fundamento Científico

**Principio de Ventanas de Oportunidad:**
La eficacia de las operaciones agrícolas depende de factores sincronizados:
- Estado fisiológico de la planta (bioeléctrico)
- Condiciones ambientales (meteorología)
- Fase fenológica (desarrollo)
- Condiciones de mercado (precio)

**Referencias Clave:**

| Ref | Concepto | Aplicación |
|-----|----------|------------|
| Optimización multiobjetivo | Pareto-óptimo para múltiples restricciones | Timing de operaciones |
| Teoría de decisión | Maximización de utilidad esperada | ROI de intervenciones |
| Cronobiología vegetal | Ritmos circadianos y estacionales | Mejor hora del día |

---

## 5.3 TIPOS DE VENTANAS DE OPORTUNIDAD

### 5.3.1 Matriz de Operaciones y Criterios

| Operación | Criterio Bioeléctrico | Criterio Meteo | Criterio Fenológico | Ventana Típica |
|-----------|----------------------|----------------|---------------------|----------------|
| **Aspersión Fitosanitaria** | Actividad normal | Sin lluvia 6h, viento <15km/h | Según plaga | 6-10am, 5-8pm |
| **Fertiriego** | Sin estrés severo | Sin lluvia 4h | Alta demanda | 6-9am |
| **Cosecha** | Turgor óptimo | Sin lluvia, T<30°C | FEN-07, Brix óptimo | 7-11am |
| **Poda** | Baja actividad | Seco, T>15°C | Post-cosecha | 8am-12pm |
| **Muestreo Foliar** | Estabilidad | Seco, sin rocío | Cualquiera | 9am-12pm |
| **Aplicación Preventiva** | Normal | 24-48h antes lluvia | Pre-infección | Variable |

---

## 5.4 WORKFLOW DEL MÓDULO

```
┌─────────────────────────────────────────────────────────────────────────┐
│              OPPORTUNITY DETECTOR - WORKFLOW COMPLETO                   │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADAS
   │
   ├── Módulos Levin Layer
   │      • Pest Detector (alertas activas)
   │      • Disease Detector (riesgo PE Mills)
   │      • Nutrition Detector (deficiencias)
   │      • Water Stress (IAH)
   │
   ├── Weather Forecast (7 días)
   │      • Lluvia, Temperatura, Viento, Humedad
   │
   ├── Fenología actual
   │      • GDD, Fase, Días a transición
   │
   └── Market Intelligence
          • Precio actual, Tendencia, Demanda
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 1: EVALUAR NECESIDADES PENDIENTES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1.1 Recopilar alertas activas:                                        │
│       pest_alerts = PestDetector.get_active_alerts()                   │
│       disease_risks = DiseaseDetector.get_risks()                      │
│       nutrition_gaps = NutritionDetector.get_deficiencies()            │
│       water_status = WaterStressDetector.get_IAH()                     │
│                                                                         │
│   1.2 Priorizar por urgencia:                                          │
│       IF any(alert.severity == 'CRÍTICO'):                             │
│           priority_queue.add(alert, priority=1)                        │
│       IF water_status.IAH < 0.50:                                      │
│           priority_queue.add('irrigation', priority=2)                 │
│       ...                                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 2: ANALIZAR CONDICIONES METEOROLÓGICAS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   2.1 Ventanas sin lluvia:                                              │
│       dry_windows = find_dry_periods(forecast, min_hours=6)            │
│                                                                         │
│   2.2 Ventanas de viento bajo:                                          │
│       calm_windows = find_calm_periods(forecast, max_wind=15)          │
│                                                                         │
│   2.3 Ventanas térmicas óptimas:                                        │
│       temp_windows = find_temp_range(forecast, min=15, max=30)         │
│                                                                         │
│   2.4 Ventanas pre-lluvia (preventivas):                                │
│       IF rain_forecast_in(24, 48, hours):                              │
│           pre_rain_window = now to (rain_start - 6h)                   │
│           pre_rain_window.type = 'PREVENTIVE'                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 3: EVALUAR ESTADO BIOELÉCTRICO PARA OPERACIONES                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   3.1 Estado para aspersión:                                            │
│       # Plantas activas absorben mejor                                 │
│       spray_readiness = evaluate_plant_activity(signals)               │
│       IF vmem_in_range(-75, -60) AND impedance_normal:                 │
│           spray_readiness = 'ÓPTIMO'                                   │
│       ELIF stress_detected:                                            │
│           spray_readiness = 'SUBÓPTIMO - riesgo fitotoxicidad'        │
│                                                                         │
│   3.2 Estado para cosecha:                                              │
│       # Turgor alto = fruta turgente                                   │
│       harvest_readiness = evaluate_turgor(signals)                     │
│       IF morning_turgor_high AND brix_optimal:                         │
│           harvest_window = 'ÓPTIMO 7-11am'                             │
│                                                                         │
│   3.3 Estado para fertiriego:                                           │
│       # Sin estrés severo, raíces activas                              │
│       fertigation_readiness = evaluate_root_activity(signals)          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 4: CALCULAR SCORE DE OPORTUNIDAD                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   FOR each pending_operation:                                           │
│                                                                         │
│     4.1 Score meteorológico (0-1):                                     │
│         meteo_score = evaluate_weather(forecast, operation.criteria)   │
│                                                                         │
│     4.2 Score bioeléctrico (0-1):                                      │
│         bio_score = evaluate_plant_state(signals, operation.type)      │
│                                                                         │
│     4.3 Score de urgencia (0-1):                                       │
│         urgency_score = operation.urgency / max_urgency                │
│                                                                         │
│     4.4 Score fenológico (0-1):                                        │
│         phen_score = phenology_fit(phenology, operation.optimal_phases)│
│                                                                         │
│     4.5 Score de mercado (solo cosecha):                               │
│         IF operation == 'harvest':                                     │
│             market_score = price_trend + demand_level                  │
│                                                                         │
│     4.6 Score total de oportunidad:                                     │
│         opportunity_score = weighted_sum(scores, weights)              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 5: GENERAR VENTANAS DE OPORTUNIDAD                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   FOR each operation WHERE opportunity_score > threshold:              │
│                                                                         │
│     window = OpportunityWindow(                                         │
│         operation = operation.type,                                     │
│         start_time = optimal_start,                                     │
│         end_time = optimal_end,                                         │
│         score = opportunity_score,                                      │
│         conditions = {                                                  │
│             'weather': meteo_conditions,                                │
│             'plant_state': bio_status,                                  │
│             'phenology': current_phase                                  │
│         },                                                              │
│         recommendation = generate_action_plan(operation),               │
│         roi_estimate = calculate_roi(operation, conditions),           │
│         risks_if_missed = estimate_loss(operation, delay_days)         │
│     )                                                                   │
│                                                                         │
│   SORT windows BY priority, then BY score DESC                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 6: DETECCIÓN DE CONFLICTOS                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   6.1 Identificar solapamientos:                                        │
│       conflicts = find_overlapping_windows(windows)                    │
│                                                                         │
│   6.2 Resolver por prioridad:                                           │
│       FOR each conflict:                                               │
│           winner = max(conflict.windows, key=priority_then_score)      │
│           loser.reschedule(next_available_window)                      │
│                                                                         │
│   6.3 Considerar recursos:                                              │
│       IF labor_required > labor_available:                             │
│           defer_lowest_priority()                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5.5 PANEL UI - OPPORTUNITY DETECTOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎯 OPPORTUNITY DETECTOR     [HOY][MAÑANA][7 DÍAS]      [⚙️][📊][🔔]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  VENTANAS DE OPORTUNIDAD ACTIVAS                                  │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │                                                                    │ │
│ │  🔴 ASPERSIÓN PREVENTIVA - Antracnosis        Score: 92% | HOY   │ │
│ │     └─ Ventana: 4:00pm - 8:00pm                                   │ │
│ │     └─ Lluvia esperada mañana 8am (PE Mills 68%)                 │ │
│ │     └─ Condiciones: Viento 8km/h, T 26°C, Planta activa          │ │
│ │     └─ Producto: Cobre oxicloruro 2 kg/ha | Costo: $3,200 MXN    │ │
│ │     └─ ROI si aplica: 12:1 | Pérdida si omite: $38,000           │ │
│ │     [✅ PROGRAMAR] [📋 VER DETALLES] [⏰ POSPONER]                │ │
│ │                                                                    │ │
│ │  🟠 FERTIRIEGO K - Deficiencia detectada      Score: 85% | HOY   │ │
│ │     └─ Ventana: 6:00am - 9:00am (mañana)                         │ │
│ │     └─ IAH: 0.72 (adecuado), Raíces activas                      │ │
│ │     └─ Producto: KNO3 15 kg/ha | Costo: $4,250 MXN               │ │
│ │     └─ ROI: 8:1                                                   │ │
│ │     [✅ PROGRAMAR] [📋 VER DETALLES]                              │ │
│ │                                                                    │ │
│ │  🟡 COSECHA ÓPTIMA - S3 Brix 11.2°           Score: 78% | 2 DÍAS │ │
│ │     └─ Ventana: Miércoles 7:00am - 11:00am                       │ │
│ │     └─ Precio actual: $2.05/kg (+12% vs promedio)                │ │
│ │     └─ Turgor: Óptimo mañana temprano                            │ │
│ │     └─ ROI adicional por timing: +$4,500                         │ │
│ │     [✅ PROGRAMAR] [📋 VER DETALLES]                              │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ PRONÓSTICO METEOROLÓGICO│  │ CALENDARIO SEMANAL                   │ │
│ ├─────────────────────────┤  ├──────────────────────────────────────┤ │
│ │ HOY:    ☀️ 28°C         │  │ LUN: 🟢 Aspersión, Fertiriego       │ │
│ │         💨 8 km/h       │  │ MAR: 🟡 Solo mañana (lluvia PM)      │ │
│ │         💧 0%           │  │ MIE: 🔴 Lluvia todo el día          │ │
│ │                         │  │ JUE: 🟢 Post-lluvia, muestreo       │ │
│ │ MAÑANA: 🌧️ 22°C        │  │ VIE: 🟢 Todas las operaciones       │ │
│ │         💨 15 km/h      │  │ SAB: 🟢 Cosecha óptima              │ │
│ │         💧 80% (15mm)   │  │ DOM: 🟡 Viento alto PM              │ │
│ └─────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  LÍNEA DE TIEMPO - PRÓXIMAS 48 HORAS                              │ │
│ │                                                                    │ │
│ │  HOY                          MAÑANA                              │ │
│ │  ├──────────────────────────┼──────────────────────────┤         │ │
│ │  6am   12pm   6pm   12am   6am   12pm   6pm   12am               │ │
│ │         │      ████         │                                     │ │
│ │         │      │            ████████████████                      │ │
│ │         │      │            │ LLUVIA                              │ │
│ │         │      │                                                  │ │
│ │         │   ASPERSIÓN                                             │ │
│ │         │   4-8pm                                                 │ │
│ │  ███████                                                          │ │
│ │  FERTIRIEGO                                                       │ │
│ │  6-9am                                                            │ │
│ │                                                                    │ │
│ │  ████ = Ventana de oportunidad                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5.6 CRITERIOS DE OPORTUNIDAD POR OPERACIÓN

### 5.6.1 Aspersión Fitosanitaria

| Criterio | Óptimo | Aceptable | Evitar |
|----------|--------|-----------|--------|
| Lluvia | 0% próx 6h | <20% próx 4h | >50% próx 2h |
| Viento | <10 km/h | 10-15 km/h | >15 km/h |
| Temperatura | 18-28°C | 15-32°C | <15°C o >35°C |
| Humedad | 50-80% | 40-90% | <30% o >95% |
| Hora | 6-10am, 5-8pm | 10am-12pm | 12-4pm |
| Vmem | Baseline ±5mV | ±10mV | Estrés severo |

### 5.6.2 Cosecha

| Criterio | Óptimo | Aceptable | Evitar |
|----------|--------|-----------|--------|
| Hora | 7-11am | 6-12pm | Tarde calurosa |
| Temperatura | 18-25°C | 15-30°C | >32°C |
| Rocío | Sin rocío | Secando | Mojado |
| Turgor | Máximo (mañana) | Alto | Bajo (tarde) |
| Brix | ≥11° | 10-11° | <10° |
| Precio | >$2/kg | $1.5-2/kg | <$1.2/kg |

---

## 5.7 ALGORITMO PYTHON - OPPORTUNITY DETECTOR

```python
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Dict, Optional

@dataclass
class OpportunityWindow:
    operation: str
    start_time: datetime
    end_time: datetime
    score: float
    conditions: Dict
    recommendation: str
    roi_estimate: float
    risk_if_missed: float
    priority: int

class OpportunityDetector:
    """Detecta ventanas óptimas para operaciones agrícolas."""
    
    OPERATION_CRITERIA = {
        'spray': {
            'rain_max_pct': 20,
            'wind_max_kmh': 15,
            'temp_range': (15, 32),
            'humidity_range': (40, 90),
            'optimal_hours': [(6, 10), (17, 20)],
            'vmem_tolerance': 10
        },
        'harvest': {
            'rain_max_pct': 10,
            'temp_max': 30,
            'optimal_hours': [(7, 11)],
            'brix_min': 10,
            'turgor': 'high'
        },
        'fertigation': {
            'rain_max_pct': 30,
            'optimal_hours': [(6, 9)],
            'iah_min': 0.50,
            'stress_max': 'moderate'
        }
    }
    
    def find_opportunities(self, 
                          alerts: List,
                          weather_forecast: List[Dict],
                          signals: Dict,
                          phenology: str,
                          market: Dict) -> List[OpportunityWindow]:
        
        opportunities = []
        
        # 1. Recopilar operaciones pendientes
        pending = self._gather_pending_operations(alerts)
        
        # 2. Para cada operación, buscar ventanas
        for operation in pending:
            windows = self._find_windows(
                operation, weather_forecast, signals
            )
            
            for window in windows:
                # Calcular score
                score = self._calculate_score(
                    operation, window, signals, phenology, market
                )
                
                if score >= 0.60:  # Umbral mínimo
                    opp = OpportunityWindow(
                        operation=operation['type'],
                        start_time=window['start'],
                        end_time=window['end'],
                        score=score,
                        conditions=window['conditions'],
                        recommendation=self._generate_recommendation(operation),
                        roi_estimate=self._estimate_roi(operation, score),
                        risk_if_missed=self._estimate_risk(operation),
                        priority=operation.get('priority', 5)
                    )
                    opportunities.append(opp)
        
        # 3. Ordenar por prioridad y score
        opportunities.sort(key=lambda x: (-x.priority, -x.score))
        
        # 4. Resolver conflictos
        opportunities = self._resolve_conflicts(opportunities)
        
        return opportunities
    
    def _find_windows(self, operation: Dict, 
                      forecast: List[Dict],
                      signals: Dict) -> List[Dict]:
        """Encuentra ventanas meteorológicas adecuadas."""
        criteria = self.OPERATION_CRITERIA.get(operation['type'], {})
        windows = []
        
        current_window = None
        
        for hour_data in forecast:
            meets_criteria = self._check_criteria(hour_data, criteria)
            
            if meets_criteria:
                if current_window is None:
                    current_window = {
                        'start': hour_data['time'],
                        'conditions': hour_data
                    }
                current_window['end'] = hour_data['time'] + timedelta(hours=1)
            else:
                if current_window and self._window_long_enough(current_window):
                    windows.append(current_window)
                current_window = None
        
        return windows
    
    def _calculate_score(self, operation, window, signals, phenology, market):
        """Calcula score compuesto de oportunidad."""
        weights = {'meteo': 0.30, 'bio': 0.25, 'urgency': 0.25, 'phen': 0.20}
        
        meteo_score = self._score_weather(window['conditions'], operation)
        bio_score = self._score_plant_state(signals, operation['type'])
        urgency_score = operation.get('urgency', 0.5)
        phen_score = self._score_phenology(phenology, operation['type'])
        
        total = (weights['meteo'] * meteo_score +
                weights['bio'] * bio_score +
                weights['urgency'] * urgency_score +
                weights['phen'] * phen_score)
        
        # Bonus por precio alto (cosecha)
        if operation['type'] == 'harvest' and market.get('price', 0) > 2.0:
            total *= 1.15
        
        return min(1.0, total)
    
    def _score_plant_state(self, signals: Dict, operation_type: str) -> float:
        """Evalúa si el estado de la planta es adecuado."""
        vmem_dev = abs(signals.get('vmem_deviation', 0))
        
        if operation_type == 'spray':
            # Plantas activas absorben mejor
            if vmem_dev < 5:
                return 1.0
            elif vmem_dev < 10:
                return 0.7
            else:
                return 0.3  # Estrés = riesgo fitotoxicidad
        
        elif operation_type == 'harvest':
            # Turgor alto = mejor
            return 1.0 if signals.get('turgor', 'normal') == 'high' else 0.7
        
        return 0.8  # Default
    
    def _generate_recommendation(self, operation: Dict) -> str:
        templates = {
            'spray': "Aplicar {product} a {dose}. Condiciones óptimas.",
            'harvest': "Cosechar sección {section}. Brix óptimo, precio favorable.",
            'fertigation': "Aplicar {product}. Raíces activas, sin estrés."
        }
        return templates.get(operation['type'], "Ejecutar operación programada.")
```

---

## 5.8 MÉTRICAS DE VALIDACIÓN

| Métrica | Target | Validación |
|---------|--------|------------|
| Ventanas correctas | >85% ejecutables | Feedback operadores |
| ROI de timing óptimo | >20% vs aleatorio | Comparación histórica |
| Conflictos resueltos | 100% | Sin solapamientos |
| Predicción meteo usada | >90% precisión | Davis vs forecast |

*Documento: Módulo 5 Opportunity Detector | Levin Layer 2.0 | 15 Enero 2026*
