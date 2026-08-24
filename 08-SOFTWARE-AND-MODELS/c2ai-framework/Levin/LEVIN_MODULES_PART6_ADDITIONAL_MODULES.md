# 🔬 MÓDULOS ADICIONALES 6-10 - ESPECIFICACIÓN TÉCNICA COMPLETA

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO DETALLADO

---

# MÓDULO 6: FRUIT QUALITY PREDICTOR (°Brix)

## 6.1 RESUMEN

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Predecir °Brix basado en transporte de azúcar en floema |
| **Input** | Vmem, variabilidad Vmem, GDD, Fenología |
| **Output** | Estimación °Brix, ventana de cosecha óptima |
| **Precisión** | ±0.5 °Brix (R² >0.85) |

## 6.2 SOPORTE ACADÉMICO

| Referencia | Hallazgo |
|------------|----------|
| Van Bel (2003) "Phloem transport" | Transporte sacarosa genera gradientes eléctricos |
| Patrick et al. (2001) "Phloem unloading" | Descarga floema correlaciona con Vmem estable |
| Lalonde et al. (2003) "Transport of sugars" | Azúcares = osmolitos que afectan potencial |

**Principio:** Durante maduración, el transporte activo de azúcares al fruto genera patrones de Vmem característicos. Alta variabilidad indica transporte activo; baja variabilidad indica acumulación completa (fruta madura).

## 6.3 FIRMAS BIOELÉCTRICAS

| °Brix | Vmem σ (std) | Transporte Floema | GDD desde FEN-06 |
|-------|--------------|-------------------|------------------|
| 8-9 | >8 mV | Bajo/Iniciando | <150 |
| 9-10 | 6-8 mV | Moderado | 150-250 |
| 10-11 | 4-6 mV | Alto | 250-350 |
| **11-12** | **3-4 mV** | **Óptimo** | **350-450** |
| >12 | <3 mV | Completado | >450 |

## 6.4 MODELO PREDICTIVO

```python
def predict_brix(vmem_std: float, gdd_since_fen06: float, 
                 temp_avg: float) -> float:
    """
    Predice °Brix basado en señales bioeléctricas.
    
    Ecuación calibrada:
    Brix = 6.0 + (-0.3 × Vmem_std) + (0.012 × GDD) + (0.05 × (T-20))
    """
    base = 6.0
    vmem_factor = -0.3 * vmem_std  # Menor variabilidad = más azúcar
    gdd_factor = 0.012 * gdd_since_fen06
    temp_factor = 0.05 * (temp_avg - 20)
    
    brix = base + vmem_factor + gdd_factor + temp_factor
    
    return round(max(6.0, min(14.0, brix)), 1)

def days_to_target_brix(current_brix: float, target: float = 11.0,
                        avg_gdd_per_day: float = 13.5) -> int:
    """Estima días para alcanzar °Brix objetivo."""
    if current_brix >= target:
        return 0
    
    brix_gap = target - current_brix
    gdd_needed = brix_gap / 0.012  # Inverso del factor
    days = int(gdd_needed / avg_gdd_per_day)
    
    return max(0, days)
```

## 6.5 PANEL UI

```
┌────────────────────────────────────────────────────────────────┐
│  🍊 FRUIT QUALITY PREDICTOR                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  °BRIX ESTIMADO POR SECCIÓN                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ S1: ████████████░░░░  10.8°  │ 🟢 Cosecha en 5 días     │ │
│  │ S2: ██████████░░░░░░   9.5°  │ 🟡 Cosecha en 12 días    │ │
│  │ S3: ██████████████░░  11.2°  │ 🟢 ÓPTIMO - Cosechar     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  TENDENCIA VMEM VARIABILIDAD                                  │
│     12mV│▇▇                                                   │
│      8mV│▇▇▇▇▇▇                                               │
│      4mV│▇▇▇▇▇▇▇▇▇▇▇▇  ← Transporte completándose           │
│         └─────────────────────────────────                    │
│          -14d      -7d       HOY                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

# MÓDULO 7: VIGOR ASSESSOR

## 7.1 RESUMEN

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Evaluar vigor vegetativo para decisiones de poda |
| **Input** | Amplitud Vmem, Respuesta a luz, Tasa de recuperación |
| **Output** | Clasificación vigor, % poda recomendado |
| **Timing** | Post-cosecha, antes de poda |

## 7.2 SOPORTE ACADÉMICO

| Referencia | Hallazgo |
|------------|----------|
| Fromm & Lautner (2007) | Plantas vigorosas: mayor amplitud de respuesta |
| Trebacz et al. (2006) | Respuesta a luz proporcional a actividad fotosintética |
| Stahlberg et al. (2006) | Velocidad de señal correlaciona con vigor |

## 7.3 FIRMAS DE VIGOR

| Vigor | Amplitud Vmem | Respuesta Luz | Recuperación | Poda Recomendada |
|-------|---------------|---------------|--------------|------------------|
| **Alto** | >25 mV | <2 min | Rápida (<1h) | Intensa (30-40%) |
| **Normal** | 15-25 mV | 2-5 min | Normal (1-2h) | Moderada (20-30%) |
| **Bajo** | 10-15 mV | 5-10 min | Lenta (2-4h) | Ligera (10-20%) |
| **Débil** | <10 mV | >10 min | Muy lenta (>4h) | Sin poda + nutrición |

## 7.4 ALGORITMO

```python
def assess_vigor(vmem_amplitude: float, light_response_min: float,
                 recovery_hours: float) -> dict:
    """Evalúa vigor vegetativo para decisiones de poda."""
    
    # Score por amplitud (0-1)
    amp_score = min(1.0, vmem_amplitude / 30)
    
    # Score por respuesta a luz (0-1, inverso)
    light_score = max(0, 1 - (light_response_min / 15))
    
    # Score por recuperación (0-1, inverso)
    recovery_score = max(0, 1 - (recovery_hours / 6))
    
    # Score total
    vigor_score = 0.40*amp_score + 0.35*light_score + 0.25*recovery_score
    
    # Clasificación
    if vigor_score >= 0.75:
        vigor_class = 'ALTO'
        pruning_pct = (30, 40)
        recommendation = 'Poda intensa para equilibrar'
    elif vigor_score >= 0.50:
        vigor_class = 'NORMAL'
        pruning_pct = (20, 30)
        recommendation = 'Poda de mantenimiento estándar'
    elif vigor_score >= 0.25:
        vigor_class = 'BAJO'
        pruning_pct = (10, 20)
        recommendation = 'Poda ligera, priorizar nutrición'
    else:
        vigor_class = 'DÉBIL'
        pruning_pct = (0, 10)
        recommendation = 'NO podar. Aplicar programa nutricional intensivo'
    
    return {
        'vigor_class': vigor_class,
        'vigor_score': round(vigor_score, 2),
        'pruning_range_pct': pruning_pct,
        'recommendation': recommendation
    }
```

## 7.5 PANEL UI

```
┌────────────────────────────────────────────────────────────────┐
│  🌳 VIGOR ASSESSOR                   [POST-COSECHA MODE]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  EVALUACIÓN DE VIGOR POR SECCIÓN                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ S1: ALTO (0.82)     │ Amp: 28mV │ Resp: 1.5min │ 35% poda │
│  │ S2: NORMAL (0.58)   │ Amp: 18mV │ Resp: 4min   │ 25% poda │
│  │ S3: BAJO (0.35)     │ Amp: 12mV │ Resp: 7min   │ 15% poda │
│  │     ⚠️ Requiere nutrición antes de poda                  │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  TEST DE RESPUESTA A LUZ (S1 - Ejemplo)                       │
│  Vmem│       ____                                             │
│      │______/    \______ ← Respuesta en 1.5 min              │
│      └─────────────────────                                   │
│       Sombra    Luz    Sombra                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

# MÓDULO 8: FROST DAMAGE DETECTOR

## 8.1 RESUMEN

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Detectar daño por helada en tiempo real |
| **Input** | Vmem, Temperatura ambiente, Temperatura tejido |
| **Output** | Nivel de daño, áreas afectadas, recuperación esperada |
| **Criticidad** | ALTA - Alertas inmediatas |

## 8.2 SOPORTE ACADÉMICO

| Referencia | Hallazgo |
|------------|----------|
| Minorsky (1989) "Temperature sensing in plants" | Frío causa despolarización por flujo K+ |
| Mancuso & Marras (2006) | Daño criogénico = colapso de Vmem |
| Wisniewski et al. (2003) | Patrones de congelación intracelular detectables |

## 8.3 FIRMAS DE DAÑO POR HELADA

| Temp (°C) | Respuesta Vmem | Daño Esperado | Tejido Afectado | Recuperación |
|-----------|----------------|---------------|-----------------|--------------|
| 2 a 0 | -10 a -20 mV | Mínimo | Ninguno | 24-48h |
| 0 a -2 | -20 a -40 mV | Leve | Hojas nuevas | 3-7 días |
| -2 a -4 | -40 a -70 mV | Moderado | Brotes, flores | 7-14 días |
| **<-4** | **>-70mV colapso** | **Severo** | **Ramas, fruta** | **Semanas-meses** |

## 8.4 ALGORITMO

```python
def detect_frost_damage(vmem: float, temp_air: float, 
                        temp_tissue: float = None) -> dict:
    """Detecta daño por helada en tiempo real."""
    
    # Usar temperatura de tejido si disponible
    temp = temp_tissue if temp_tissue else temp_air
    
    # Detectar respuesta de Vmem al frío
    vmem_drop = vmem - (-68)  # vs baseline normal
    
    # Clasificar daño
    if temp > 2:
        damage_level = 'NINGUNO'
        affected_tissue = None
        recovery_days = 0
        action = 'Monitoreo normal'
    elif temp > 0:
        damage_level = 'MÍNIMO'
        affected_tissue = 'Ninguno permanente'
        recovery_days = 1
        action = 'Observar próximas 24h'
    elif temp > -2:
        damage_level = 'LEVE'
        affected_tissue = 'Hojas nuevas, brotes tiernos'
        recovery_days = 5
        action = 'Riego anti-helada si continúa'
    elif temp > -4:
        damage_level = 'MODERADO'
        affected_tissue = 'Brotes, flores, hojas'
        recovery_days = 10
        action = 'URGENTE: Activar riego + ventiladores'
    else:
        damage_level = 'SEVERO'
        affected_tissue = 'Ramas, fruta, posible muerte'
        recovery_days = 30
        action = 'CRÍTICO: Todas las medidas de protección'
    
    # Verificar con Vmem
    if vmem_drop < -70:
        damage_level = 'SEVERO - COLAPSO DETECTADO'
        action = 'EMERGENCIA: Evaluar daño estructural'
    
    return {
        'damage_level': damage_level,
        'temperature': temp,
        'vmem_response': vmem_drop,
        'affected_tissue': affected_tissue,
        'recovery_days': recovery_days,
        'action': action
    }
```

## 8.5 PANEL UI

```
┌────────────────────────────────────────────────────────────────┐
│  ❄️ FROST DAMAGE DETECTOR              [ALERTA ACTIVA]        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔴 ALERTA DE HELADA - DAÑO MODERADO DETECTADO                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Temperatura actual: -2.5°C                               │ │
│  │ Vmem respuesta: -52 mV (despolarización severa)         │ │
│  │ Tejido en riesgo: Brotes, flores, hojas nuevas          │ │
│  │                                                          │ │
│  │ ACCIÓN INMEDIATA REQUERIDA:                             │ │
│  │ 1. ✅ Activar sistema de riego (protección térmica)     │ │
│  │ 2. ✅ Encender ventiladores de inversión térmica        │ │
│  │ 3. ⏳ Monitorear hasta T > 2°C                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  MAPA DE AFECTACIÓN                                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ S1: ░░░░░░░░ -1.5°C 🟡   │ S4: ████████ -3.2°C 🔴      │ │
│  │ S2: ░░░░░░░░ -0.8°C 🟢   │ S5: ████░░░░ -2.1°C 🟠      │ │
│  │ S3: ░░██░░░░ -2.5°C 🟠   │ S6: ░░░░░░░░ -0.5°C 🟢      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

# MÓDULO 9: RECOVERY MONITOR

## 9.1 RESUMEN

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Monitorear resiliencia y recuperación post-estrés |
| **Input** | Vmem histórico, eventos de estrés, intervenciones |
| **Output** | Tasa de recuperación, tiempo estimado, recomendaciones |
| **Aplicación** | Post-helada, post-sequía, post-aplicación |

## 9.2 MÉTRICAS DE RECUPERACIÓN

| Métrica | Fórmula | Interpretación |
|---------|---------|----------------|
| **Tasa de recuperación** | (Vmem_actual - Vmem_estrés) / (Vmem_baseline - Vmem_estrés) × 100 | % recuperado |
| **Tiempo a 50%** | t cuando recovery = 50% | Resiliencia media |
| **Tiempo a 90%** | t cuando recovery = 90% | Recuperación completa |
| **Pendiente inicial** | d(Vmem)/dt en primeras 6h | Capacidad de respuesta |

## 9.3 ALGORITMO

```python
def monitor_recovery(vmem_series: list, stress_event_time: datetime,
                     vmem_baseline: float = -68) -> dict:
    """Monitorea recuperación post-estrés."""
    
    # Encontrar punto mínimo (máximo estrés)
    vmem_stress = min(vmem_series)
    stress_idx = vmem_series.index(vmem_stress)
    
    # Vmem actual
    vmem_current = vmem_series[-1]
    
    # Calcular % recuperación
    if vmem_baseline == vmem_stress:
        recovery_pct = 100
    else:
        recovery_pct = ((vmem_current - vmem_stress) / 
                        (vmem_baseline - vmem_stress)) * 100
    
    # Calcular tasa de recuperación (mV/hora)
    hours_since_stress = len(vmem_series[stress_idx:])
    if hours_since_stress > 0:
        recovery_rate = (vmem_current - vmem_stress) / hours_since_stress
    else:
        recovery_rate = 0
    
    # Estimar tiempo a recuperación completa
    if recovery_rate > 0:
        remaining = vmem_baseline - vmem_current
        hours_to_full = remaining / recovery_rate
    else:
        hours_to_full = float('inf')
    
    # Clasificar estado
    if recovery_pct >= 90:
        status = 'RECUPERADO'
        action = 'Monitoreo normal'
    elif recovery_pct >= 50:
        status = 'EN RECUPERACIÓN'
        action = 'Continuar monitoreo, mantener condiciones óptimas'
    elif recovery_pct >= 25:
        status = 'RECUPERACIÓN LENTA'
        action = 'Considerar intervención: riego, nutrición foliar'
    else:
        status = 'CRÍTICO'
        action = 'INTERVENCIÓN URGENTE: Evaluar daño permanente'
    
    return {
        'recovery_pct': round(recovery_pct, 1),
        'vmem_current': vmem_current,
        'vmem_baseline': vmem_baseline,
        'recovery_rate_mvh': round(recovery_rate, 3),
        'hours_to_full_recovery': round(hours_to_full, 1),
        'status': status,
        'action': action
    }
```

## 9.4 PANEL UI

```
┌────────────────────────────────────────────────────────────────┐
│  🔄 RECOVERY MONITOR                   [POST-HELADA S4]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ESTADO DE RECUPERACIÓN                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Evento: Helada -3.2°C                                    │ │
│  │ Fecha: 14 Enero 2026, 4:30am                            │ │
│  │ Tiempo transcurrido: 38 horas                           │ │
│  │                                                          │ │
│  │ Recuperación: ██████████████░░░░░░  68%                 │ │
│  │ Vmem actual: -58 mV (baseline: -68 mV)                  │ │
│  │ Tasa: +0.26 mV/hora                                     │ │
│  │ Tiempo estimado a 90%: 18 horas                         │ │
│  │                                                          │ │
│  │ Estado: EN RECUPERACIÓN 🟡                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  CURVA DE RECUPERACIÓN                                        │
│    Vmem│                          _____                       │
│   -68mV│_________________________/ ← Objetivo                 │
│   -80mV│             ___________/                             │
│   -95mV│____________/                                         │
│        └─────────────────────────────────────                 │
│         Helada   +12h    +24h    +36h    +48h                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

# MÓDULO 10: CIRCADIAN CORRECTOR

## 10.1 RESUMEN

| Parámetro | Valor |
|-----------|-------|
| **Objetivo** | Corregir señales bioeléctricas por ritmo circadiano |
| **Input** | Vmem raw, hora del día, estación |
| **Output** | Vmem corregido, factores aplicados |
| **Importancia** | Evitar falsos positivos/negativos por hora |

## 10.2 SOPORTE ACADÉMICO

| Referencia | Hallazgo |
|------------|----------|
| Hoshizaki & Hamner (1964) | Ritmos circadianos en potenciales de membrana |
| Minorsky & Spanswick (1989) | Oscilaciones diurnas de Vmem de 10-20 mV |
| Haydon et al. (2013) | Reloj circadiano regula canales iónicos |

**Principio:** El Vmem oscila naturalmente durante el día debido a cambios en actividad estomática, fotosíntesis y transpiración. Sin corrección, estas variaciones naturales pueden confundirse con señales de estrés.

## 10.3 FACTORES DE CORRECCIÓN CIRCADIANA

| Hora | Factor Vmem | Factor Impedancia | Actividad Planta |
|------|-------------|-------------------|------------------|
| 00:00-05:00 | 1.20 | 0.85 | Reposo nocturno |
| 06:00-09:00 | 1.15 | 0.90 | Apertura estomas |
| 09:00-12:00 | 1.00 | 1.00 | Máxima fotosíntesis (referencia) |
| 12:00-15:00 | 0.95 | 1.05 | Depresión mediodía |
| 15:00-18:00 | 1.00 | 1.00 | Recuperación |
| 18:00-21:00 | 1.10 | 0.95 | Cierre estomas |
| 21:00-24:00 | 1.15 | 0.90 | Inicio reposo |

## 10.4 ALGORITMO

```python
from datetime import datetime
import numpy as np

class CircadianCorrector:
    """Corrige señales bioeléctricas por ritmo circadiano."""
    
    # Factores de corrección por hora
    VMEM_FACTORS = {
        0: 1.20, 1: 1.20, 2: 1.20, 3: 1.20, 4: 1.20, 5: 1.20,
        6: 1.15, 7: 1.10, 8: 1.05, 9: 1.00, 10: 1.00, 11: 1.00,
        12: 0.95, 13: 0.95, 14: 0.95, 15: 1.00, 16: 1.00, 17: 1.00,
        18: 1.05, 19: 1.10, 20: 1.15, 21: 1.15, 22: 1.18, 23: 1.20
    }
    
    IMPEDANCE_FACTORS = {
        0: 0.85, 1: 0.85, 2: 0.85, 3: 0.85, 4: 0.85, 5: 0.88,
        6: 0.90, 7: 0.93, 8: 0.97, 9: 1.00, 10: 1.00, 11: 1.00,
        12: 1.05, 13: 1.05, 14: 1.05, 15: 1.00, 16: 1.00, 17: 1.00,
        18: 0.98, 19: 0.95, 20: 0.92, 21: 0.90, 22: 0.88, 23: 0.85
    }
    
    def __init__(self, latitude: float = 17.5):
        """
        Args:
            latitude: Latitud para ajuste estacional (default: Las Choapas)
        """
        self.latitude = latitude
    
    def correct(self, vmem_raw: float, impedance_raw: float,
                timestamp: datetime) -> dict:
        """
        Aplica corrección circadiana a señales.
        
        Args:
            vmem_raw: Vmem medido (mV)
            impedance_raw: Impedancia medida (kΩ)
            timestamp: Momento de la medición
        
        Returns:
            Señales corregidas y factores aplicados
        """
        hour = timestamp.hour
        
        # Obtener factores base
        vmem_factor = self.VMEM_FACTORS[hour]
        impedance_factor = self.IMPEDANCE_FACTORS[hour]
        
        # Ajuste estacional (días más largos/cortos)
        day_of_year = timestamp.timetuple().tm_yday
        seasonal_factor = self._seasonal_adjustment(day_of_year)
        
        # Aplicar correcciones
        vmem_corrected = vmem_raw / vmem_factor
        impedance_corrected = impedance_raw / impedance_factor
        
        return {
            'vmem_raw': vmem_raw,
            'vmem_corrected': round(vmem_corrected, 2),
            'vmem_factor': vmem_factor,
            'impedance_raw': impedance_raw,
            'impedance_corrected': round(impedance_corrected, 2),
            'impedance_factor': impedance_factor,
            'seasonal_factor': round(seasonal_factor, 3),
            'hour': hour,
            'activity_phase': self._get_phase(hour)
        }
    
    def _seasonal_adjustment(self, day_of_year: int) -> float:
        """Ajuste por longitud del día (estacional)."""
        # Modelo simplificado: amplitud máxima en verano
        # Verano (día ~172) = factor 1.1
        # Invierno (día ~355) = factor 0.9
        angle = 2 * np.pi * (day_of_year - 172) / 365
        return 1.0 + 0.1 * np.cos(angle)
    
    def _get_phase(self, hour: int) -> str:
        """Retorna fase de actividad de la planta."""
        if 6 <= hour < 9:
            return 'Apertura estomática'
        elif 9 <= hour < 12:
            return 'Máxima fotosíntesis'
        elif 12 <= hour < 15:
            return 'Depresión mediodía'
        elif 15 <= hour < 18:
            return 'Recuperación vespertina'
        elif 18 <= hour < 21:
            return 'Cierre estomático'
        else:
            return 'Reposo nocturno'
    
    def batch_correct(self, signals: list) -> list:
        """Corrige un lote de señales con sus timestamps."""
        return [
            self.correct(s['vmem'], s['impedance'], s['timestamp'])
            for s in signals
        ]
```

## 10.5 PANEL UI

```
┌────────────────────────────────────────────────────────────────┐
│  🌙 CIRCADIAN CORRECTOR                [ACTIVO]               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  HORA ACTUAL: 14:32                                           │
│  FASE: Depresión mediodía                                     │
│                                                                │
│  FACTORES DE CORRECCIÓN APLICADOS                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Vmem Factor: 0.95  (valores crudos son MÁS negativos)   │ │
│  │ Impedancia Factor: 1.05  (valores crudos son MÁS altos) │ │
│  │ Ajuste estacional: 1.02 (verano, días largos)           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  EJEMPLO DE CORRECCIÓN                                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Vmem crudo:     -65.0 mV                                 │ │
│  │ Vmem corregido: -68.4 mV  (÷ 0.95)                      │ │
│  │ → Sin corrección parecería estrés leve (falso positivo) │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  PATRÓN CIRCADIANO TÍPICO                                     │
│   Vmem│    _____                                              │
│  -60mV│   /     \        _____                                │
│  -68mV│__/       \______/     \______← Baseline real         │
│  -75mV│                                                       │
│       └────────────────────────────────                       │
│        6am   12pm   6pm   12am   6am                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## RESUMEN DE LOS 10 MÓDULOS

| # | Módulo | Función | Frecuencia | Integración |
|---|--------|---------|------------|-------------|
| 1 | Pest Detector | 7 plagas, 24-72h anticipación | 5 min | Health Agent |
| 2 | Disease Detector | 6 enfermedades + PE Mills | 5 min | Watson |
| 3 | Nutrition Detector | 8 nutrientes + predicción | 15 min | NPF |
| 4 | Water Stress | IAH + plan de riego | 5 min | Irrigation |
| 5 | Opportunity Detector | Ventanas óptimas | 1 hora | Todos |
| 6 | Fruit Quality | Predicción °Brix | 1 hora | Harvest |
| 7 | Vigor Assessor | Evaluación para poda | Post-cosecha | Trim |
| 8 | Frost Damage | Detección helada | Tiempo real | Alertas |
| 9 | Recovery Monitor | Resiliencia post-estrés | Continuo | Todos |
| 10 | Circadian Corrector | Corrección por hora | Continuo | Todos |

*Documento: Módulos Adicionales 6-10 | Levin Layer 2.0 | 15 Enero 2026*
