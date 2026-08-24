# 💧 MÓDULO 4: WATER STRESS DETECTOR - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

## 4.1 RESUMEN EJECUTIVO

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Detectar estrés hídrico y predecir necesidades de riego 6-48h |
| **Input** | Vmem, Impedancia, Temperatura, Humedad, ET0, Lluvia |
| **Output** | IAH (Índice de Adecuación Hídrica), alertas, plan de riego |
| **Precisión Target** | >85% correlación con potencial hídrico medido |

---

## 4.2 SOPORTE TÉCNICO-ACADÉMICO

### 4.2.1 Referencias Científicas Clave

| Ref | Autor(es) | Título | Publicación | Hallazgo |
|-----|-----------|--------|-------------|----------|
| 1 | Zimmermann et al. (2013) | "Hydraulic signals in long-distance signaling" | J. Exp. Bot. 64(11) | Ondas hidráulicas |
| 2 | Christmann et al. (2013) | "Hydraulic signals in long-distance signaling" | Curr. Opin. Plant Biol. 16(3) | ABA y señales |
| 3 | Huber & Bauerle (2016) | "Long-distance plant signaling pathways in response to stresses" | Front. Plant Sci. 7 | Sistema integrado |
| 4 | **Steudle (2000)** | "Water uptake by roots: effects of water deficit" | J. Exp. Bot. 51(350) | **Potencial hídrico** |
| 5 | Fromm & Fei (1998) | "Electrical signaling and gas exchange" | Plant Physiol. 118 | Vmem y estomas |
| 6 | Grams et al. (2007) | "Electrical signals affect gas exchange" | J. Exp. Bot. 58 | Cierre estomático |

### 4.2.2 Fundamento Fisiológico

**Ecuación del Potencial Hídrico:**
```
Ψw = Ψs + Ψp + Ψm

Donde:
  Ψw = Potencial hídrico total (MPa)
  Ψs = Potencial osmótico (solutos)
  Ψp = Potencial de presión (turgor)
  Ψm = Potencial matricial (pared celular)
```

**Relación Vmem - Potencial Hídrico:**
```
El estrés hídrico causa:
1. Pérdida de turgor → despolarización inicial
2. Acumulación de solutos → hiperpolarización compensatoria
3. Cierre estomático → reducción conductancia

Vmem ≈ f(Ψw) con correlación R² > 0.80
```

**Modelo de Conductancia Estomática:**
```
gs = gs_max × f(VPD) × f(Ψleaf) × f(ABA)

Donde:
  gs = conductancia estomática (mmol/m²/s)
  VPD = déficit de presión de vapor
  Ψleaf = potencial hídrico foliar
  ABA = concentración de ácido abscísico
```

---

## 4.3 FIRMAS BIOELÉCTRICAS DE ESTRÉS HÍDRICO

### 4.3.1 Fases del Estrés Hídrico

| Fase | Ψw (MPa) | Vmem | Impedancia | Síntomas | Urgencia |
|------|----------|------|------------|----------|----------|
| **Normal** | > -0.3 | Baseline (-68mV) | Estable | Ninguno | ✅ |
| **Leve** | -0.3 a -0.8 | +5 a +10mV | +5-10% | Enrollamiento leve | 🟡 24h |
| **Moderado** | -0.8 a -1.2 | +10 a +20mV | +10-20% | Marchitez temporal | 🟠 12h |
| **Severo** | -1.2 a -1.8 | +20 a +35mV | +20-35% | Marchitez permanente | 🔴 6h |
| **Crítico** | < -1.8 | >+35mV o colapso | >35% o colapso | Necrosis | 🔴 URGENTE |

### 4.3.2 Patrones Temporales

```
PATRÓN DIURNO DE VMEM EN ESTRÉS HÍDRICO
═══════════════════════════════════════════════════════════════

PLANTA BIEN IRRIGADA:
      │    ___________
      │   /           \
 Vmem │  /             \
      │_/               \_
      └──────────────────────
        6am  12pm  6pm  12am

ESTRÉS HÍDRICO LEVE (despolarización diurna amplificada):
      │         ____
      │    ____/    \____
 Vmem │   /              \
      │__/                \__
      └──────────────────────
        6am  12pm  6pm  12am
        
ESTRÉS SEVERO (despolarización sostenida, sin recuperación nocturna):
      │____________________
      │                    (recuperación incompleta)
 Vmem │
      │
      └──────────────────────
        6am  12pm  6pm  12am
```

---

## 4.4 WORKFLOW DEL MÓDULO

```
┌─────────────────────────────────────────────────────────────────────────┐
│              WATER STRESS DETECTOR - WORKFLOW COMPLETO                  │
└─────────────────────────────────────────────────────────────────────────┘

ENTRADAS
   │
   ├── Sensores Bioeléctricos (722 nodos)
   │      • Vmem, Impedancia
   │
   ├── Davis WeatherLink
   │      • ET0, Temperatura, Humedad, Viento, Radiación
   │
   ├── Sensor de Suelo (si disponible)
   │      • Humedad volumétrica, Tensión
   │
   └── Pronóstico Meteorológico
          • Lluvia proyectada, ET0 futuro
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 1: ANÁLISIS DE SEÑALES BIOELÉCTRICAS (cada 5 min)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1.1 Calcular desviación de baseline:                                  │
│       vmem_deviation = vmem_current - vmem_baseline_7d                 │
│                                                                         │
│   1.2 Analizar patrón diurno:                                          │
│       diurnal_amplitude = max(vmem_day) - min(vmem_day)                │
│       recovery_nocturnal = vmem_night - vmem_baseline                  │
│                                                                         │
│   1.3 Detectar despolarización sostenida:                               │
│       IF vmem_deviation > 5mV for > 4 hours:                           │
│           stress_signal = True                                          │
│                                                                         │
│   1.4 Analizar impedancia:                                              │
│       impedance_change = (Z_now - Z_baseline) / Z_baseline × 100       │
│       IF impedance_change > 10%:                                       │
│           dehydration_signal = True                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 2: BALANCE HÍDRICO METEOROLÓGICO                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   2.1 Calcular ETc:                                                     │
│       Kc = kc_table[phenology]  # Coeficiente de cultivo               │
│       ETc = ET0 × Kc                                                   │
│                                                                         │
│   2.2 Balance hídrico:                                                  │
│       water_balance = (rainfall + irrigation) - ETc                    │
│       cumulative_deficit = sum(water_balance[last_7d])                 │
│                                                                         │
│   2.3 Factor VPD:                                                       │
│       VPD = es(T) × (1 - RH/100)                                       │
│       vpd_stress = 1 if VPD < 2 else (3.5 - VPD) / 1.5                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 3: FUSIÓN BIOELÉCTRICO + METEOROLÓGICO                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   3.1 Score bioeléctrico (peso 0.50):                                  │
│       bio_score = classify_stress(vmem_deviation, impedance_change,    │
│                                   diurnal_amplitude, recovery)         │
│                                                                         │
│   3.2 Score meteorológico (peso 0.35):                                 │
│       meteo_score = f(cumulative_deficit, VPD, ET0_recent)            │
│                                                                         │
│   3.3 Score fenológico (peso 0.15):                                    │
│       # Fases críticas: FEN-03 (floración), FEN-04 (cuajado)          │
│       phen_factor = 1.3 if phenology in ['FEN-03', 'FEN-04'] else 1.0 │
│                                                                         │
│   3.4 Índice de Estrés Hídrico:                                         │
│       stress_index = 0.50×bio + 0.35×meteo + 0.15×phen_factor         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 4: CÁLCULO DE IAH (Índice de Adecuación Hídrica)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   IAH = 1 - stress_index                                                │
│                                                                         │
│   Clasificación:                                                        │
│   - IAH ≥ 0.85: Óptimo ✅                                              │
│   - IAH 0.70-0.85: Leve estrés 🟡                                      │
│   - IAH 0.50-0.70: Moderado 🟠                                         │
│   - IAH 0.30-0.50: Severo 🔴                                           │
│   - IAH < 0.30: Crítico 🔴🔴                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 5: PREDICCIÓN Y RECOMENDACIÓN DE RIEGO                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   5.1 Proyectar estrés futuro:                                          │
│       forecast_ET0 = get_forecast_ET0(days=7)                          │
│       forecast_rain = get_forecast_rain(days=7)                        │
│       projected_deficit = current_deficit + (ETc_future - rain_future) │
│                                                                         │
│   5.2 Calcular necesidad de riego:                                      │
│       irrigation_needed = max(0, ETc_accumulated - available_water)    │
│       irrigation_mm = irrigation_needed / efficiency                   │
│                                                                         │
│   5.3 Determinar urgencia:                                              │
│       IF IAH < 0.50:                                                   │
│           urgency = 'INMEDIATO (6h)'                                   │
│       ELIF IAH < 0.70:                                                 │
│           urgency = 'HOY'                                              │
│       ELIF IAH < 0.85:                                                 │
│           urgency = '24-48h'                                           │
│       ELSE:                                                            │
│           urgency = 'MONITOREO'                                        │
│                                                                         │
│   5.4 Generar plan de riego:                                            │
│       irrigation_plan = {                                               │
│           'volume_mm': irrigation_mm,                                   │
│           'duration_hours': irrigation_mm / flow_rate,                 │
│           'timing': optimal_time(temperature, wind, VPD),              │
│           'sections': sections_with_stress,                            │
│           'priority': urgency                                          │
│       }                                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 6: INTEGRACIÓN                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   → IAH Agent: actualizar índice hídrico                               │
│   → Irrigation Controller: ejecutar plan de riego                      │
│   → PE Model: ajustar predicción por estrés hídrico                    │
│   → Opportunity Detector: ventana óptima de riego                      │
│   → Cost Agent: costo de agua y energía                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4.5 PANEL UI - WATER STRESS DETECTOR

```
┌─────────────────────────────────────────────────────────────────────────┐
│  💧 WATER STRESS DETECTOR    [S1][S2][S3][S4][S5][S6]  [⚙️][📊][🔔]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  IAH GLOBAL: 0.72                     Meta: ≥0.85    GAP: -0.13   │ │
│ │  ██████████████████░░░░░░░░  72%     🟡 ESTRÉS LEVE              │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ IAH POR SECCIÓN         │  │ SEÑALES BIOELÉCTRICAS               │ │
│ ├─────────────────────────┤  ├──────────────────────────────────────┤ │
│ │ S1: ████████░░ 78% 🟡   │  │ Vmem desviación: +8.5 mV            │ │
│ │ S2: ██████░░░░ 62% 🟠   │  │ Impedancia Δ: +12%                  │ │
│ │ S3: █████████░ 85% ✅   │  │ Amplitud diurna: 18mV (↑ vs normal) │ │
│ │ S4: ███████░░░ 72% 🟡   │  │ Recuperación nocturna: 65%          │ │
│ │ S5: ██████░░░░ 58% 🟠   │  │                                      │ │
│ │ S6: █████████░ 88% ✅   │  │ ⚠️ S2 y S5: Sin recuperación total  │ │
│ └─────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  BALANCE HÍDRICO (últimos 7 días)                                 │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │                                                                    │ │
│ │  ETc acumulada:    42.5 mm                                        │ │
│ │  Lluvia:           12.0 mm                                        │ │
│ │  Riego aplicado:   18.0 mm                                        │ │
│ │  ─────────────────────────                                        │ │
│ │  DÉFICIT:          -12.5 mm  🟠                                   │ │
│ │                                                                    │ │
│ │  ET0 hoy: 5.8 mm | VPD: 2.4 kPa | Temp: 28°C                     │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ PRONÓSTICO 7 DÍAS       │  │ PLAN DE RIEGO RECOMENDADO           │ │
│ ├─────────────────────────┤  ├──────────────────────────────────────┤ │
│ │ 🌧️ Lluvia: 0mm (0-3d)  │  │                                      │ │
│ │          15mm (día 5)   │  │ 🔴 RIEGO URGENTE - S2, S5           │ │
│ │                         │  │    Volumen: 15 mm                    │ │
│ │ ☀️ ET0 proyectado:      │  │    Duración: 4.5 horas              │ │
│ │    Día 1: 6.2 mm        │  │    Timing: HOY 6-10pm               │ │
│ │    Día 2: 5.8 mm        │  │    Costo: $1,850 MXN                │ │
│ │    Día 3: 6.5 mm        │  │                                      │ │
│ │                         │  │ 🟡 RIEGO PREVENTIVO - S1, S4        │ │
│ │ ⚠️ Sin lluvia 3 días    │  │    Volumen: 10 mm                   │ │
│ │ Déficit proyectado:     │  │    Timing: Mañana 6-9pm             │ │
│ │ -30mm si no se riega    │  │                                      │ │
│ └─────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  TENDENCIA VMEM - INDICADOR DE ESTRÉS HÍDRICO                     │ │
│ │     +20mV│            _____                                        │ │
│ │     +10mV│     ______/     ← Despolarización por estrés           │ │
│ │  Baseline│____/                                                    │ │
│ │     -10mV│                                                         │ │
│ │          └────────────────────────────────────────────────         │ │
│ │           -7d  -5d  -3d  -1d  HOY                                  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4.6 COEFICIENTES DE CULTIVO (Kc) POR FENOLOGÍA

| Fenología | Kc | Demanda Hídrica | Sensibilidad |
|-----------|-----|-----------------|--------------|
| FEN-01 Latencia | 0.65 | Baja | Baja |
| FEN-02 Brotación | 0.75 | Moderada | Media |
| **FEN-03 Floración** | **0.85** | **Alta** | **MUY ALTA** |
| **FEN-04 Cuajado** | **0.90** | **Máxima** | **CRÍTICA** |
| FEN-05 Desarrollo | 0.85 | Alta | Alta |
| FEN-06 Maduración | 0.80 | Moderada-Alta | Media |
| FEN-07 Cosecha | 0.70 | Moderada | Baja |

---

## 4.7 ALGORITMO PYTHON - WATER STRESS DETECTOR

```python
class WaterStressDetector:
    """Detecta estrés hídrico mediante bioeléctrico + meteorológico."""
    
    KC_TABLE = {
        'FEN-01': 0.65, 'FEN-02': 0.75, 'FEN-03': 0.85,
        'FEN-04': 0.90, 'FEN-05': 0.85, 'FEN-06': 0.80, 'FEN-07': 0.70
    }
    
    STRESS_THRESHOLDS = {
        'vmem_mild': 5, 'vmem_moderate': 10, 'vmem_severe': 20,
        'impedance_mild': 10, 'impedance_severe': 20
    }
    
    def detect(self, signals, weather, phenology):
        # Score bioeléctrico
        bio_score = self._bioelectric_score(signals)
        
        # Score meteorológico
        meteo_score = self._meteorological_score(weather, phenology)
        
        # Factor fenológico
        phen_factor = 1.3 if phenology in ['FEN-03', 'FEN-04'] else 1.0
        
        # Índice de estrés
        stress_index = 0.50*bio_score + 0.35*meteo_score + 0.15*phen_factor
        
        # IAH
        iah = max(0, 1 - stress_index)
        
        return {
            'IAH': round(iah, 3),
            'stress_level': self._classify(iah),
            'irrigation_needed': self._calc_irrigation(weather, phenology, iah),
            'urgency': self._urgency(iah)
        }
    
    def _bioelectric_score(self, signals):
        vmem_dev = signals.vmem_deviation
        imp_change = signals.impedance_change_pct
        
        # Score Vmem
        if vmem_dev < 5:
            vmem_score = 0
        elif vmem_dev < 10:
            vmem_score = 0.3
        elif vmem_dev < 20:
            vmem_score = 0.6
        else:
            vmem_score = 1.0
        
        # Score impedancia
        imp_score = min(1.0, imp_change / 30) if imp_change > 0 else 0
        
        # Recuperación nocturna
        recovery = signals.nocturnal_recovery_pct
        recovery_score = 0 if recovery > 90 else (90 - recovery) / 90
        
        return 0.5*vmem_score + 0.3*imp_score + 0.2*recovery_score
    
    def _meteorological_score(self, weather, phenology):
        Kc = self.KC_TABLE.get(phenology, 0.80)
        ETc = weather['ET0'] * Kc
        
        # Balance
        balance = weather['rainfall'] + weather['irrigation'] - ETc
        deficit = max(0, -balance)
        
        # VPD stress
        vpd = weather['VPD']
        vpd_stress = min(1.0, max(0, (vpd - 2) / 2))
        
        return min(1.0, deficit / 30 + vpd_stress * 0.3)
    
    def _calc_irrigation(self, weather, phenology, iah):
        if iah >= 0.85:
            return 0
        
        Kc = self.KC_TABLE.get(phenology, 0.80)
        ETc = weather['ET0'] * Kc
        deficit = (0.85 - iah) * 30  # mm para recuperar
        
        return round(deficit + ETc, 1)
    
    def _classify(self, iah):
        if iah >= 0.85: return 'ÓPTIMO'
        if iah >= 0.70: return 'LEVE'
        if iah >= 0.50: return 'MODERADO'
        if iah >= 0.30: return 'SEVERO'
        return 'CRÍTICO'
    
    def _urgency(self, iah):
        if iah < 0.50: return 'INMEDIATO (6h)'
        if iah < 0.70: return 'HOY'
        if iah < 0.85: return '24-48h'
        return 'MONITOREO'
```

---

## 4.8 MÉTRICAS DE VALIDACIÓN

| Métrica | Target | Validación |
|---------|--------|------------|
| Correlación IAH vs Ψw medido | R² >0.85 | Cámara de presión |
| Detección estrés temprano | >80% 24h antes | Síntomas visibles |
| Ahorro de agua vs riego fijo | >15% | Comparación histórica |
| Falsos negativos (estrés real no detectado) | <5% | Crítico |

*Documento: Módulo 4 Water Stress Detector | Levin Layer 2.0 | 15 Enero 2026*
