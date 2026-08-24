# TODO LIST COMPLETO - C²AI FRAMEWORK IMPLEMENTATION
## Gaps Identificados y Próximos Pasos

**Fecha:** 15-Enero-2026
**Autor:** Dr. José Manuel Cadena
**Objetivo:** Completar implementación C²AI Framework al 100%

---

## RESUMEN EJECUTIVO

| Semana | Tareas | Impacto VEP | Esfuerzo |
|--------|--------|-------------|----------|
| **S1** | BioelectricPestDetector + Cron + Pesos | +$700K | Alto |
| **S2** | Análisis PhD + Integración Motor | +$400K | Medio |
| **S3** | Sensores DIY + Endpoint | Validación | Medio |
| **S4** | Calibración + Validación Campo | +$1M (potencial) | Alto |

**Impacto Total Estimado:** +$2.1M VEP adicional

---

## SEMANA 1 (S1) - CRÍTICO 🔴

### S1.1: Implementar BioelectricPestDetector en Levin Layer
- [ ] **Archivo:** `/opt/citrusmax/c2ai/layers/levin_layer.py`
- [ ] **Acción:** Agregar clase `BioelectricPestDetector` al final del archivo
- [ ] **Dependencias:** `numpy`, `scipy.fft` (ya instalados)
- [ ] **Código a agregar:**

```python
class BioelectricPestDetector:
    """
    Detección anticipada de plagas/enfermedades usando señales bioeléctricas.
    Anticipación: 24-72h antes de síntomas visibles.
    """
    
    DETECTION_THRESHOLDS = {
        'trips': {
            'delta_vmem_6h': 12,     # mV depolarización
            'frequency_hz': (15, 25),
            'confidence_threshold': 0.70,
            'lead_time_hours': 48,
            'action': 'Aplicar Spirotetramat (Movento) 150 ml/ha'
        },
        'diaforina': {
            'delta_vmem_6h': 18,
            'frequency_hz': (20, 30),
            'confidence_threshold': 0.80,
            'lead_time_hours': 72,
            'action': 'ALERTA HLB: Inspección inmediata + Imidacloprid'
        },
        'antracnosis': {
            'delta_vmem_6h': 8,
            'humidity_threshold': 85,
            'confidence_threshold': 0.75,
            'lead_time_hours': 24,
            'action': 'Aplicar fungicida cúprico preventivo'
        },
        'mancha_grasienta': {
            'delta_vmem_6h': 6,
            'humidity_threshold': 90,
            'temp_range': (20, 28),
            'confidence_threshold': 0.70,
            'lead_time_hours': 48,
            'action': 'Monitorear + reducir humedad foliar'
        }
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
    
    def detect_early_attack(
        self, 
        vmem_series: List[float],
        temp_series: List[float],
        humidity_series: List[float]
    ) -> List[Dict]:
        """
        Detecta ataque biótico 24-72h antes de síntomas visibles.
        
        Args:
            vmem_series: Serie temporal Vmem (muestras cada 15min, 96 = 24h)
            temp_series: Serie temporal temperatura °C
            humidity_series: Serie temporal humedad %
        
        Returns:
            Lista de detecciones ordenadas por confianza
        """
        if len(vmem_series) < 24:
            return []
        
        # 1. Delta Vmem últimas 6h (24 muestras si 15min cada una)
        vmem_6h_ago = vmem_series[-24] if len(vmem_series) >= 24 else vmem_series[0]
        vmem_current = vmem_series[-1]
        delta_vmem = vmem_current - vmem_6h_ago
        
        # 2. Análisis frecuencial simplificado
        try:
            from scipy.fft import fft
            vmem_fft = fft(vmem_series[-96:])
            power_spectrum = np.abs(vmem_fft) ** 2
            dominant_freq = np.argmax(power_spectrum[1:40]) + 1
        except:
            dominant_freq = 20  # Default
        
        # 3. Condiciones ambientales promedio 24h
        humidity_avg = np.mean(humidity_series[-96:]) if len(humidity_series) >= 96 else np.mean(humidity_series)
        temp_avg = np.mean(temp_series[-96:]) if len(temp_series) >= 96 else np.mean(temp_series)
        
        detections = []
        
        for pest, thresholds in self.DETECTION_THRESHOLDS.items():
            confidence = 0.0
            
            # Score por depolarización
            if delta_vmem >= thresholds.get('delta_vmem_6h', 10):
                confidence += 0.4 * min(1.0, delta_vmem / 20)
            
            # Score por frecuencia
            freq_range = thresholds.get('frequency_hz', (10, 30))
            if freq_range[0] <= dominant_freq <= freq_range[1]:
                confidence += 0.3
            
            # Score por humedad
            if 'humidity_threshold' in thresholds:
                if humidity_avg >= thresholds['humidity_threshold']:
                    confidence += 0.2
            else:
                confidence += 0.15  # Default si no aplica
            
            # Score por temperatura
            if 'temp_range' in thresholds:
                if thresholds['temp_range'][0] <= temp_avg <= thresholds['temp_range'][1]:
                    confidence += 0.1
            else:
                confidence += 0.05
            
            if confidence >= thresholds['confidence_threshold']:
                detections.append({
                    'pest': pest,
                    'confidence': round(confidence, 3),
                    'lead_time_hours': thresholds['lead_time_hours'],
                    'action': thresholds['action'],
                    'delta_vmem': round(delta_vmem, 2),
                    'humidity_avg': round(humidity_avg, 1),
                    'temp_avg': round(temp_avg, 1),
                    'timestamp': datetime.now().isoformat()
                })
        
        return sorted(detections, key=lambda x: x['confidence'], reverse=True)
    
    def log_detection(self, section: str, detection: Dict):
        """Log detección a PostgreSQL"""
        if not self.conn:
            self.conn = psycopg2.connect(**self.pg_config)
        
        query = """
            INSERT INTO c2ai.pest_detections (
                timestamp, section, pest_type, confidence, 
                lead_time_hours, recommended_action, delta_vmem
            ) VALUES (NOW(), %s, %s, %s, %s, %s, %s)
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                section,
                detection['pest'],
                detection['confidence'],
                detection['lead_time_hours'],
                detection['action'],
                detection['delta_vmem']
            ))
            self.conn.commit()
```

- [ ] **Test:** `python -c "from levin_layer import BioelectricPestDetector; print('OK')"`
- [ ] **Prioridad:** 🔴 CRÍTICA
- [ ] **Responsable:** DevOps
- [ ] **Estimado:** 2 horas

---

### S1.2: Agregar endpoint /api/v1/levin/pest-detection/{section}
- [ ] **Archivo:** `/opt/citrusmax/c2ai/c2ai_api.py`
- [ ] **Acción:** Agregar endpoint FastAPI

```python
@router.get("/levin/pest-detection/{section}")
async def get_pest_detection(section: str):
    """
    Detecta plagas/enfermedades anticipadamente usando señales bioeléctricas.
    
    Returns:
        Lista de detecciones con confianza, tiempo anticipación y acción recomendada
    """
    detector = BioelectricPestDetector(PG_CONFIG)
    
    # Obtener series temporales de sensores (o simuladas si no hay Vmem real)
    vmem_series = await get_vmem_series(section, hours=24)
    temp_series = await get_temp_series(section, hours=24)
    humidity_series = await get_humidity_series(section, hours=24)
    
    detections = detector.detect_early_attack(vmem_series, temp_series, humidity_series)
    
    # Log cada detección
    for d in detections:
        detector.log_detection(section, d)
    
    return {
        "section": section,
        "timestamp": datetime.now().isoformat(),
        "detections": detections,
        "sensor_status": "simulated" if not vmem_series else "real"
    }
```

- [ ] **Prioridad:** 🔴 CRÍTICA
- [ ] **Estimado:** 1 hora

---

### S1.3: Crear tabla PostgreSQL pest_detections
- [ ] **Servidor:** M5 (54.212.177.221)
- [ ] **Comando:**

```sql
CREATE TABLE IF NOT EXISTS c2ai.pest_detections (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    section VARCHAR(10) NOT NULL,
    pest_type VARCHAR(50) NOT NULL,
    confidence DECIMAL(4,3) NOT NULL,
    lead_time_hours INTEGER NOT NULL,
    recommended_action TEXT,
    delta_vmem DECIMAL(6,2),
    action_taken BOOLEAN DEFAULT FALSE,
    action_timestamp TIMESTAMPTZ,
    result_validation VARCHAR(20)  -- 'confirmed', 'false_positive', 'pending'
);

CREATE INDEX idx_pest_detections_section ON c2ai.pest_detections(section);
CREATE INDEX idx_pest_detections_timestamp ON c2ai.pest_detections(timestamp);
```

- [ ] **Prioridad:** 🔴 CRÍTICA
- [ ] **Estimado:** 15 minutos

---

### S1.4: Crear cron job orchestrator diario
- [ ] **Archivo:** `/etc/cron.d/c2ai-orchestrator`
- [ ] **Contenido:**

```cron
# C2AI Orchestrator - Ejecutar diariamente a las 06:00 UTC (00:00 CST)
0 6 * * * citrusmax cd /opt/citrusmax/c2ai && python orchestrator.py >> /var/log/citrusmax/c2ai_orchestrator.log 2>&1

# Pest Detection - Ejecutar cada 6 horas
0 */6 * * * citrusmax cd /opt/citrusmax/c2ai && python -c "from layers.levin_layer import BioelectricPestDetector; d=BioelectricPestDetector({'host':'localhost','database':'citrusmax_biofix','user':'citrusmax','password':'xxx'}); print(d.detect_early_attack([],[], []))" >> /var/log/citrusmax/pest_detection.log 2>&1
```

- [ ] **Prioridad:** 🔴 CRÍTICA
- [ ] **Estimado:** 30 minutos

---

### S1.5: Corregir pesos Levin Layer
- [ ] **Archivo:** `/opt/citrusmax/c2ai/layers/levin_layer.py`
- [ ] **Buscar:** `alignment_scores.append(water_alignment * 0.20)`
- [ ] **Reemplazar con:** Pesos correctos según documentación

```python
# PESOS CORRECTOS (documentados en sección 73.2.2)
ALIGNMENT_WEIGHTS = {
    'water': 0.30,      # Era 0.20
    'nutrients': 0.25,
    'gdd': 0.25,
    'stress': 0.20
}

# En calculate_alignment():
alignment_scores.append(water_alignment * ALIGNMENT_WEIGHTS['water'])
alignment_scores.append(nutrient_alignment * ALIGNMENT_WEIGHTS['nutrients'])
alignment_scores.append(gdd_alignment * ALIGNMENT_WEIGHTS['gdd'])
alignment_scores.append(stress_alignment * ALIGNMENT_WEIGHTS['stress'])
```

- [ ] **Prioridad:** 🟡 MEDIA
- [ ] **Estimado:** 30 minutos

---

## SEMANA 2 (S2) - IMPORTANTE 🟡

### S2.1: Agregar generatePanelAnalysis a LevinLayerDashboard.tsx
- [ ] **Archivo:** `/opt/citrusmax/frontend/src/components/c2ai-explainability/LevinLayerDashboard.tsx`
- [ ] **Acción:** Agregar función análisis PhD similar a otros dashboards

```typescript
const generatePanelAnalysis = async (data: LevinData) => {
  const prompt = `
    Analiza los siguientes datos del Levin Layer para Finca La Luz (296 ha, 123,487 árboles lima persa):
    
    DATOS:
    - Goal Actual: ${data.currentGoal}
    - Alignment Score: ${(data.alignmentScore * 100).toFixed(1)}%
    - Goal Progress: ${(data.goalProgress * 100).toFixed(1)}%
    - Pruning Impact: ${data.pruningImpact > 0 ? '+' : ''}${data.pruningImpact.toFixed(2)}
    - Vmem Gradient: ${data.vmemGradient} mV
    - Morphogenesis State: ${data.morphogenesisState}
    
    GENERA:
    1. DIAGNÓSTICO: Estado actual del objetivo bioeléctrico
    2. TENDENCIA: Hacia dónde va el cultivo
    3. RIESGOS: Factores que bloquean el objetivo
    4. RECOMENDACIONES: Acciones para mejorar alineación
    
    Usa lenguaje técnico PhD en fisiología vegetal.
  `;
  
  const response = await fetch('/api/v1/llm/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, agent: 'levin_specialist' })
  });
  
  return response.json();
};
```

- [ ] **Prioridad:** 🟡 MEDIA
- [ ] **Estimado:** 2 horas

---

### S2.2: Agregar generatePanelAnalysis a PenroseDashboard.tsx
- [ ] **Archivo:** `/opt/citrusmax/frontend/src/components/c2ai-explainability/PenroseDashboard.tsx`
- [ ] **Acción:** Similar a S2.1 pero para métricas de coherencia

```typescript
const generatePanelAnalysis = async (data: PenroseData) => {
  const prompt = `
    Analiza las métricas de coherencia C²AI para Finca La Luz:
    
    DATOS:
    - Inter-layer Coherence: ${(data.coherence.interLayer * 100).toFixed(1)}%
    - Temporal Coherence: ${(data.coherence.temporal * 100).toFixed(1)}%
    - Decision Entropy: ${data.coherence.entropy.toFixed(3)}
    - Collapse Readiness: ${(data.coherence.collapseReadiness * 100).toFixed(1)}%
    - Auto-Execute: ${data.autoExecute ? 'SÍ' : 'NO'}
    
    Layer Contributions:
    ${Object.entries(data.layerContributions).map(([k,v]) => `- ${k}: ${(v*100).toFixed(1)}%`).join('\n')}
    
    GENERA:
    1. DIAGNÓSTICO: Estado de coherencia del sistema
    2. CONFLICTOS: Identificar fuentes de desacuerdo entre layers
    3. CONFIANZA: Evaluar si auto-execute es apropiado
    4. RECOMENDACIONES: Cómo mejorar coherencia
    
    Usa lenguaje técnico PhD en sistemas complejos y teoría de decisión.
  `;
  
  return await callLLMAnalysis(prompt);
};
```

- [ ] **Prioridad:** 🟡 MEDIA
- [ ] **Estimado:** 2 horas

---

### S2.3: Integrar Levin Layer con Motor Unificado
- [ ] **Endpoint actual:** `/api/v1/vep/factors`
- [ ] **Acción:** Agregar campo `levin_alignment` al response

```python
# En unified_motor.py
async def get_vep_factors(section: str):
    # ... código existente ...
    
    # NUEVO: Obtener alineación Levin
    levin = LevinLayer(PG_CONFIG)
    levin_result = await levin.calculate_for_section(section)
    
    return {
        "section": section,
        "pe": pe_score,
        "iah": iah,
        "ipf": ipf,
        "npf": npf,
        "phi": phi,
        # NUEVO
        "levin_alignment": levin_result.alignment_score,
        "levin_goal": levin_result.current_goal,
        "bioelectric_status": levin_result.morphogenesis_state
    }
```

- [ ] **Prioridad:** 🟡 MEDIA
- [ ] **Estimado:** 1 hora

---

## SEMANA 3 (S3) - HARDWARE 🟢

### S3.1: Lista de Componentes Sensores DIY Ag-AgCl

| Componente | Cantidad | Precio Unit. | Total | Proveedor |
|------------|----------|--------------|-------|-----------|
| Electrodo Ag-AgCl 3mm | 20 | $8 USD | $160 | Amazon/eBay |
| Amplificador INA128 | 10 | $12 USD | $120 | DigiKey |
| ESP32 LoRa | 10 | $15 USD | $150 | AliExpress |
| PCB custom | 10 | $5 USD | $50 | JLCPCB |
| Carcasa IP67 | 10 | $8 USD | $80 | Amazon |
| Batería 18650 + holder | 10 | $10 USD | $100 | Amazon |
| Panel solar 5V 2W | 10 | $6 USD | $60 | AliExpress |
| Cables, conectores | 1 lote | $50 USD | $50 | Local |
| Gateway LoRaWAN | 1 | $150 USD | $150 | RAK Wireless |
| **TOTAL** | | | **$920 USD** | |

- [ ] **Prioridad:** 🟢 BAJA (requiere validación)
- [ ] **Estimado:** 1-2 semanas entrega

---

### S3.2: Protocolo Instalación Sensores Piloto

```markdown
## PROTOCOLO INSTALACIÓN SENSORES VMEM

### Ubicaciones (10 sensores)
| Sensor | Sección | Árbol | Coordenadas | Justificación |
|--------|---------|-------|-------------|---------------|
| VM-01 | S1 | #1234 | 20.xxx, -97.xxx | Árbol referencia sano |
| VM-02 | S1 | #1456 | 20.xxx, -97.xxx | Histórico trips |
| VM-03 | S1 | #1678 | 20.xxx, -97.xxx | Zona húmeda |
| VM-04 | S2 | #2345 | 20.xxx, -97.xxx | Árbol referencia sano |
| VM-05 | S2 | #2567 | 20.xxx, -97.xxx | Borde lindero |
| VM-06 | S2 | #2789 | 20.xxx, -97.xxx | Zona seca |
| VM-07 | S3 | #3456 | 20.xxx, -97.xxx | Árbol joven referencia |
| VM-08 | S3 | #3678 | 20.xxx, -97.xxx | Histórico antracnosis |
| VM-09 | S3 | #3890 | 20.xxx, -97.xxx | Zona alta |
| VM-10 | Control | #9999 | 20.xxx, -97.xxx | Árbol aislado control |

### Procedimiento Instalación
1. Seleccionar rama de 2-3 años, diámetro 8-15mm
2. Limpiar corteza con alcohol 70%
3. Insertar electrodo 2mm bajo corteza (ángulo 30°)
4. Aplicar gel conductor
5. Fijar con cinta microporosa
6. Conectar a módulo ESP32
7. Verificar lectura inicial (-60 a -80 mV = OK)
8. Registrar baseline 24h antes de confiar en datos

### Frecuencia Muestreo
- Vmem: cada 15 minutos (96 muestras/día)
- Temperatura: cada 15 minutos
- Humedad: cada 15 minutos
- Transmisión LoRa: cada 1 hora (batch 4 muestras)
```

- [ ] **Prioridad:** 🟢 BAJA
- [ ] **Estimado:** 1 día instalación

---

### S3.3: Crear endpoint ingesta datos Vmem
- [ ] **Archivo:** `/opt/citrusmax/c2ai/c2ai_api.py`
- [ ] **Endpoint:** `POST /api/v1/sensors/vmem`

```python
@router.post("/sensors/vmem")
async def ingest_vmem_data(data: VmemPayload):
    """
    Ingesta datos de sensores Vmem DIY.
    
    Payload:
    {
        "sensor_id": "VM-01",
        "section": "S1",
        "tree_id": "1234",
        "readings": [
            {"timestamp": "2026-01-15T12:00:00Z", "vmem_mv": -68.5, "temp_c": 28.3, "humidity_pct": 72},
            ...
        ]
    }
    """
    conn = get_db_connection()
    
    query = """
        INSERT INTO c2ai.vmem_readings (
            timestamp, sensor_id, section, tree_id, vmem_mv, temp_c, humidity_pct
        ) VALUES %s
    """
    
    values = [
        (r['timestamp'], data.sensor_id, data.section, data.tree_id, 
         r['vmem_mv'], r['temp_c'], r['humidity_pct'])
        for r in data.readings
    ]
    
    execute_values(conn.cursor(), query, values)
    conn.commit()
    
    return {"status": "ok", "readings_ingested": len(data.readings)}
```

- [ ] **Crear tabla:**

```sql
CREATE TABLE c2ai.vmem_readings (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    sensor_id VARCHAR(10) NOT NULL,
    section VARCHAR(10) NOT NULL,
    tree_id VARCHAR(20),
    vmem_mv DECIMAL(6,2) NOT NULL,
    temp_c DECIMAL(4,1),
    humidity_pct DECIMAL(4,1),
    quality_flag VARCHAR(10) DEFAULT 'good'
);

CREATE INDEX idx_vmem_sensor_time ON c2ai.vmem_readings(sensor_id, timestamp);
CREATE INDEX idx_vmem_section ON c2ai.vmem_readings(section);
```

- [ ] **Prioridad:** 🟢 BAJA
- [ ] **Estimado:** 2 horas

---

## SEMANA 4 (S4) - CALIBRACIÓN 🔵

### S4.1: Implementar funciones vmemToIAH() y vmemToIPF()
- [ ] **Archivo:** `/opt/citrusmax/c2ai/layers/levin_layer.py`
- [ ] **Acción:** Agregar funciones de transferencia

```python
def vmem_to_iah(vmem: float, baseline: float = -70.0) -> float:
    """
    Convierte Vmem a factor IAH (Índice Adecuación Hídrica).
    
    - Vmem normal: -70 mV → IAH = 1.0
    - Vmem hiperpolarizado (estrés hídrico): -85 mV → IAH ≈ 0.70
    - Vmem despolarizado (exceso agua): -55 mV → IAH ≈ 0.90
    
    Args:
        vmem: Potencial de membrana actual (mV)
        baseline: Vmem de referencia (-70 mV para lima persa)
    
    Returns:
        IAH factor (0.5 - 1.1)
    """
    if vmem < -85:
        # Estrés hídrico severo
        return max(0.5, 1.0 + 0.02 * (vmem + 70))
    elif vmem < -75:
        # Estrés hídrico moderado
        return max(0.7, 1.0 + 0.015 * (vmem + 70))
    elif vmem > -55:
        # Exceso de agua (despolarización)
        return min(1.0, 1.0 + 0.01 * (vmem + 70))
    else:
        # Rango normal
        return 1.0


def vmem_to_ipf(vmem: float, vmem_6h_ago: float) -> float:
    """
    Detecta ataque biótico por despolarización súbita.
    
    - Delta > 15 mV en 6h + Vmem > -55 mV = señal de ataque
    
    Args:
        vmem: Vmem actual (mV)
        vmem_6h_ago: Vmem hace 6 horas (mV)
    
    Returns:
        Factor IPF (0.45 - 1.0), donde menor = más presión plagas
    """
    delta_vmem = vmem - vmem_6h_ago
    
    if delta_vmem > 15 and vmem > -55:
        # Señal de ataque biótico
        severidad = min(10, (vmem + 55) / 3)
        return max(0.45, np.exp(-0.20 * severidad))
    
    if delta_vmem > 10 and vmem > -60:
        # Señal de alerta (posible inicio ataque)
        return 0.85
    
    return 1.0  # Sin señal de ataque
```

- [ ] **Prioridad:** 🔵 POST-SENSORES
- [ ] **Estimado:** 1 hora

---

### S4.2: Calibrar umbrales detección con datos reales
- [ ] **Prerequisito:** Mínimo 2 semanas de datos Vmem reales
- [ ] **Procedimiento:**

```python
# Script calibración: calibrate_vmem_thresholds.py

import pandas as pd
import numpy as np
from scipy import stats

def calibrate_thresholds(vmem_df: pd.DataFrame, incidents_df: pd.DataFrame):
    """
    Calibra umbrales de detección usando datos históricos.
    
    Args:
        vmem_df: DataFrame con lecturas Vmem
        incidents_df: DataFrame con incidentes confirmados de plagas
    
    Returns:
        Dict con umbrales calibrados por tipo de plaga
    """
    calibrated = {}
    
    for pest in ['trips', 'diaforina', 'antracnosis', 'mancha_grasienta']:
        pest_incidents = incidents_df[incidents_df['pest_type'] == pest]
        
        if len(pest_incidents) < 5:
            continue  # Insuficientes datos
        
        # Calcular delta_vmem promedio antes de cada incidente
        deltas = []
        for _, incident in pest_incidents.iterrows():
            t_incident = incident['timestamp']
            t_24h_before = t_incident - pd.Timedelta(hours=24)
            
            vmem_window = vmem_df[
                (vmem_df['timestamp'] >= t_24h_before) & 
                (vmem_df['timestamp'] <= t_incident)
            ]
            
            if len(vmem_window) >= 24:
                delta = vmem_window['vmem_mv'].iloc[-1] - vmem_window['vmem_mv'].iloc[0]
                deltas.append(delta)
        
        if deltas:
            # Usar percentil 25 como umbral (detectar 75% de casos)
            calibrated[pest] = {
                'delta_vmem_6h': np.percentile(deltas, 25),
                'n_samples': len(deltas),
                'mean_delta': np.mean(deltas),
                'std_delta': np.std(deltas)
            }
    
    return calibrated

# Ejecutar calibración
vmem_df = pd.read_sql("SELECT * FROM c2ai.vmem_readings WHERE timestamp > NOW() - INTERVAL '14 days'", conn)
incidents_df = pd.read_sql("SELECT * FROM agronomic.pest_incidents WHERE result_validation = 'confirmed'", conn)

calibrated = calibrate_thresholds(vmem_df, incidents_df)
print(json.dumps(calibrated, indent=2))
```

- [ ] **Prioridad:** 🔵 POST-SENSORES
- [ ] **Estimado:** 1 día análisis

---

### S4.3: Validar modelo BioelectricPestDetector en campo
- [ ] **Duración:** 4 semanas mínimo
- [ ] **Métricas a evaluar:**

| Métrica | Objetivo | Cálculo |
|---------|----------|---------|
| **Recall** | ≥ 70% | TP / (TP + FN) |
| **Precision** | ≥ 60% | TP / (TP + FP) |
| **Lead Time** | ≥ 24h | Promedio horas antes síntomas |
| **False Positive Rate** | ≤ 30% | FP / (FP + TN) |

- [ ] **Protocolo validación:**

```markdown
## PROTOCOLO VALIDACIÓN BIOELECTRICPESTDETECTOR

### Fase 1: Baseline (Semana 1-2)
1. Instalar 10 sensores según protocolo S3.2
2. Registrar baseline Vmem 24h
3. Marcar umbrales iniciales (documentados)
4. NO tomar acción en alertas (solo registrar)

### Fase 2: Validación Ciega (Semana 3-4)
1. Registrar TODAS las alertas del sistema
2. Equipo de campo inspecciona diariamente
3. Registrar incidentes reales (con/sin alerta previa)
4. NO informar al sistema sobre validación

### Fase 3: Análisis (Semana 5)
1. Calcular matriz confusión
2. Ajustar umbrales si necesario
3. Re-calibrar con calibrate_thresholds.py
4. Documentar resultados

### Fase 4: Producción (Semana 6+)
1. Activar alertas automáticas
2. Integrar con sistema de notificaciones
3. Monitorear métricas continuamente
```

- [ ] **Prioridad:** 🔵 POST-SENSORES
- [ ] **Estimado:** 4-6 semanas

---

## RESUMEN CHECKLIST

### SEMANA 1 (CRÍTICO)
- [ ] S1.1: Implementar BioelectricPestDetector
- [ ] S1.2: Agregar endpoint pest-detection
- [ ] S1.3: Crear tabla pest_detections
- [ ] S1.4: Crear cron orchestrator
- [ ] S1.5: Corregir pesos Levin

### SEMANA 2 (IMPORTANTE)
- [ ] S2.1: generatePanelAnalysis LevinDashboard
- [ ] S2.2: generatePanelAnalysis PenroseDashboard
- [ ] S2.3: Integrar Levin con Motor Unificado

### SEMANA 3 (HARDWARE)
- [ ] S3.1: Ordenar componentes sensores DIY
- [ ] S3.2: Instalar 10 sensores piloto
- [ ] S3.3: Crear endpoint ingesta Vmem

### SEMANA 4+ (CALIBRACIÓN)
- [ ] S4.1: Implementar vmemToIAH/vmemToIPF
- [ ] S4.2: Calibrar umbrales con datos reales
- [ ] S4.3: Validar modelo en campo

---

## CONTACTOS Y RECURSOS

| Recurso | URL/Contacto |
|---------|--------------|
| Servidor M5 | 54.212.177.221 / citrusmax.ai |
| C2AI API | http://citrusmax.ai:8504/docs |
| PostgreSQL | citrusmax_biofix @ M5 |
| Vivent Biosensors | https://www.vivent.ch |
| RAK Wireless (Gateway) | https://store.rakwireless.com |

---

**Última Actualización:** 15-ENE-2026 12:10 UTC
**Versión:** 1.0
**Autor:** Dr. José Manuel Cadena
