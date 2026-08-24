"""
Bioelectric Pest & Disease Detector - CitrusMax AI C²AI Framework
==================================================================
Implements early detection of pests and diseases using bioelectric signals.
Detection Window: 24-72 hours before visible symptoms

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 15-Jan-2026
Version: 1.0
"""

import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("BioelectricPestDetector")


class ThreatType(str, Enum):
    TRIPS = "trips"
    PULGON = "pulgon"
    DIAPHORINA = "diaphorina"
    ARANA_ROJA = "arana_roja"
    MINADOR = "minador"
    ANTRACNOSIS = "antracnosis"
    MANCHA_GRASIENTA = "mancha_grasienta"
    HLB = "hlb"
    PHYTOPHTHORA = "phytophthora"


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class BioelectricSignature:
    """Bioelectric signature for a specific pest/disease."""
    threat_type: ThreatType
    signal_type: str
    delta_vmem_threshold: float
    amplitude_range: Tuple[float, float]
    frequency_range: Tuple[float, float]
    impedance_change_pct: float
    humidity_threshold: Optional[float]
    temp_range: Optional[Tuple[float, float]]
    confidence_threshold: float
    lead_time_hours: int
    recommended_action: str
    severity: Severity


# Validated Detection Thresholds
SIGNATURE_LIBRARY: Dict[ThreatType, BioelectricSignature] = {
    ThreatType.TRIPS: BioelectricSignature(
        threat_type=ThreatType.TRIPS,
        signal_type="VPs + micro-APs",
        delta_vmem_threshold=12.0,
        amplitude_range=(15.0, 25.0),
        frequency_range=(15.0, 25.0),
        impedance_change_pct=-7.5,
        humidity_threshold=None,
        temp_range=None,
        confidence_threshold=0.70,
        lead_time_hours=48,
        recommended_action="Aplicar Spirotetramat (Movento) 150 ml/ha o Spinosad",
        severity=Severity.MEDIUM
    ),
    ThreatType.PULGON: BioelectricSignature(
        threat_type=ThreatType.PULGON,
        signal_type="VPs sostenidos",
        delta_vmem_threshold=10.0,
        amplitude_range=(10.0, 30.0),
        frequency_range=(5.0, 15.0),
        impedance_change_pct=-5.0,
        humidity_threshold=None,
        temp_range=None,
        confidence_threshold=0.68,
        lead_time_hours=36,
        recommended_action="Inspección brotes + Imidacloprid drench si Toxoptera",
        severity=Severity.MEDIUM
    ),
    ThreatType.DIAPHORINA: BioelectricSignature(
        threat_type=ThreatType.DIAPHORINA,
        signal_type="VPs fuertes sostenidos",
        delta_vmem_threshold=18.0,
        amplitude_range=(15.0, 40.0),
        frequency_range=(20.0, 30.0),
        impedance_change_pct=-8.0,
        humidity_threshold=None,
        temp_range=(20.0, 32.0),
        confidence_threshold=0.80,
        lead_time_hours=72,
        recommended_action="🚨 ALERTA HLB: Inspección inmediata + control psílido urgente",
        severity=Severity.CRITICAL
    ),
    ThreatType.ARANA_ROJA: BioelectricSignature(
        threat_type=ThreatType.ARANA_ROJA,
        signal_type="VPs graduales + ROS",
        delta_vmem_threshold=8.0,
        amplitude_range=(8.0, 18.0),
        frequency_range=(3.0, 8.0),
        impedance_change_pct=-8.0,
        humidity_threshold=None,
        temp_range=(25.0, 38.0),
        confidence_threshold=0.65,
        lead_time_hours=48,
        recommended_action="Liberar Phytoseiulus persimilis o aplicar Abamectina",
        severity=Severity.MEDIUM
    ),
    ThreatType.ANTRACNOSIS: BioelectricSignature(
        threat_type=ThreatType.ANTRACNOSIS,
        signal_type="VPs + EIS baja",
        delta_vmem_threshold=8.0,
        amplitude_range=(10.0, 25.0),
        frequency_range=(2.0, 8.0),
        impedance_change_pct=-15.0,
        humidity_threshold=85.0,
        temp_range=(20.0, 28.0),
        confidence_threshold=0.75,
        lead_time_hours=24,
        recommended_action="Aplicar fungicida cúprico preventivo inmediatamente",
        severity=Severity.HIGH
    ),
    ThreatType.HLB: BioelectricSignature(
        threat_type=ThreatType.HLB,
        signal_type="Baseline shift + impedancia baja",
        delta_vmem_threshold=10.0,
        amplitude_range=(10.0, 25.0),
        frequency_range=(0.5, 2.0),
        impedance_change_pct=-20.0,
        humidity_threshold=None,
        temp_range=None,
        confidence_threshold=0.65,
        lead_time_hours=2160,
        recommended_action="⚠️ HLB SOSPECHADO: qPCR inmediato + trunk injection si positivo",
        severity=Severity.CRITICAL
    ),
}


class BioelectricPestDetector:
    """
    Early detection of pests and diseases using bioelectric signals.
    Detection Window: 24-72 hours before visible symptoms
    """
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.signatures = SIGNATURE_LIBRARY
        self.baseline_vmem = -70.0
        self.sampling_rate_hz = 4
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    def detect_threats(
        self,
        vmem_series: List[float],
        temp_series: List[float],
        humidity_series: List[float],
        section: str,
        phenology_stage: str = "FEN-04"
    ) -> List[Dict[str, Any]]:
        """Main detection - analyzes bioelectric signals for pest/disease patterns."""
        if len(vmem_series) < 24:
            logger.warning(f"Insufficient data: {len(vmem_series)} samples")
            return []
        
        detections = []
        metrics = self._calculate_metrics(vmem_series, temp_series, humidity_series)
        
        for threat_type, signature in self.signatures.items():
            confidence = self._calculate_confidence(metrics, signature)
            
            if confidence >= signature.confidence_threshold:
                detection = {
                    'threat_type': threat_type.value,
                    'confidence': round(confidence, 3),
                    'severity': signature.severity.value,
                    'lead_time_hours': signature.lead_time_hours,
                    'recommended_action': signature.recommended_action,
                    'metrics': {
                        'delta_vmem_6h': round(metrics['delta_vmem_6h'], 2),
                        'dominant_freq_hz': round(metrics['dominant_freq'], 2),
                        'humidity_avg': round(metrics['humidity_avg'], 1),
                        'temp_avg': round(metrics['temp_avg'], 1),
                        'vmem_current': round(metrics['vmem_current'], 2),
                    },
                    'section': section,
                    'phenology_stage': phenology_stage,
                    'timestamp': datetime.now().isoformat(),
                }
                detections.append(detection)
                logger.info(f"DETECTED: {threat_type.value} in {section} ({confidence:.1%})")
        
        detections.sort(key=lambda x: x['confidence'], reverse=True)
        return detections
    
    def _calculate_metrics(
        self,
        vmem_series: List[float],
        temp_series: List[float],
        humidity_series: List[float]
    ) -> Dict[str, float]:
        vmem = np.array(vmem_series)
        temp = np.array(temp_series) if temp_series else np.full(len(vmem), 25.0)
        humidity = np.array(humidity_series) if humidity_series else np.full(len(vmem), 70.0)
        
        vmem_current = vmem[-1]
        vmem_6h_ago = vmem[-24] if len(vmem) >= 24 else vmem[0]
        delta_vmem_6h = vmem_current - vmem_6h_ago
        
        vmem_24h = vmem[-96:] if len(vmem) >= 96 else vmem
        dominant_freq = self._extract_dominant_frequency(vmem_24h)
        
        return {
            'vmem_current': vmem_current,
            'vmem_mean': np.mean(vmem_24h),
            'vmem_std': np.std(vmem_24h),
            'delta_vmem_6h': delta_vmem_6h,
            'dominant_freq': dominant_freq,
            'humidity_avg': np.mean(humidity[-96:]) if len(humidity) >= 96 else np.mean(humidity),
            'temp_avg': np.mean(temp[-96:]) if len(temp) >= 96 else np.mean(temp),
        }
    
    def _extract_dominant_frequency(self, signal: np.ndarray) -> float:
        if len(signal) < 16:
            return 10.0
        try:
            n = len(signal)
            n_fft = 2 ** int(np.ceil(np.log2(n)))
            fft_result = np.fft.fft(signal, n=n_fft)
            power = np.abs(fft_result[:n_fft//2]) ** 2
            peak_idx = np.argmax(power[1:40]) + 1
            freq_bins = np.fft.fftfreq(n_fft, d=0.25)[:n_fft//2]
            return min(30.0, max(0.5, abs(freq_bins[peak_idx]) * 60))
        except:
            return 10.0
    
    def _calculate_confidence(self, metrics: Dict, signature: BioelectricSignature) -> float:
        confidence = 0.0
        
        # Delta Vmem (40%)
        if abs(metrics['delta_vmem_6h']) >= signature.delta_vmem_threshold:
            ratio = min(2.0, abs(metrics['delta_vmem_6h']) / signature.delta_vmem_threshold)
            confidence += 0.40 * (ratio / 2.0)
        
        # Frequency (25%)
        f_low, f_high = signature.frequency_range
        if f_low <= metrics['dominant_freq'] <= f_high:
            confidence += 0.25
        
        # Environment (20%)
        env_score = 0.5
        if signature.humidity_threshold:
            if metrics['humidity_avg'] >= signature.humidity_threshold:
                env_score += 0.5
        else:
            env_score += 0.5
        confidence += 0.20 * env_score
        
        # Variability (15%)
        if metrics['vmem_std'] > 5:
            confidence += 0.15 * min(1.0, metrics['vmem_std'] / 15)
        
        return min(1.0, confidence)
    
    def log_detection(self, section: str, detection: Dict) -> int:
        self._ensure_connection()
        query = """
            INSERT INTO c2ai.pest_detections (
                timestamp, section, pest_type, confidence, severity,
                lead_time_hours, recommended_action, delta_vmem,
                dominant_freq, humidity_avg, temp_avg, phenology_stage
            ) VALUES (NOW(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (
                    section, detection['threat_type'], detection['confidence'],
                    detection['severity'], detection['lead_time_hours'],
                    detection['recommended_action'], detection['metrics']['delta_vmem_6h'],
                    detection['metrics']['dominant_freq_hz'], detection['metrics']['humidity_avg'],
                    detection['metrics']['temp_avg'], detection.get('phenology_stage', 'FEN-04')
                ))
                detection_id = cur.fetchone()[0]
                self.conn.commit()
                return detection_id
        except Exception as e:
            logger.error(f"Failed to log detection: {e}")
            self.conn.rollback()
            return -1
    
    def get_simulated_vmem_series(self, section: str, hours: int = 24) -> tuple:
        """Generate simulated Vmem when real sensors not installed."""
        self._ensure_connection()
        
        try:
            with self.conn.cursor() as cur:
                cur.execute("SELECT temp_out_c, hum_out_pct FROM weather.current_conditions ORDER BY ts DESC LIMIT 1")
                row = cur.fetchone()
                temp_base, humidity_base = (row[0], row[1]) if row else (26.0, 70.0)
        except:
            temp_base, humidity_base = 26.0, 70.0
        
        n_samples = hours * 4
        t = np.linspace(0, hours, n_samples)
        
        vmem_series = -70.0 + 3.0 * np.sin(2 * np.pi * t / 24) + np.random.normal(0, 2, n_samples)
        temp_series = temp_base + 5.0 * np.sin(2 * np.pi * (t - 6) / 24) + np.random.normal(0, 0.5, n_samples)
        humidity_series = np.clip(humidity_base - 10.0 * np.sin(2 * np.pi * (t - 6) / 24) + np.random.normal(0, 2, n_samples), 30, 100)
        
        return vmem_series.tolist(), temp_series.tolist(), humidity_series.tolist()
    
    def close(self):
        if self.conn:
            self.conn.close()


# Transfer Functions
def vmem_to_ipf(vmem: float, vmem_6h_ago: float) -> float:
    """Convert Vmem to IPF adjustment factor."""
    delta = vmem - vmem_6h_ago
    if delta > 15 and vmem > -55:
        severity = min(10, (vmem + 55) / 3)
        return max(0.45, np.exp(-0.20 * severity))
    return 1.0


def vmem_to_iah(vmem: float) -> float:
    """Convert Vmem to IAH factor."""
    if vmem < -85:
        return max(0.5, 1.0 + 0.02 * (vmem + 70))
    if vmem > -55:
        return min(1.0, 1.0 + 0.01 * (vmem + 70))
    return 1.0


def vmem_to_stress_index(vmem: float, vmem_std: float) -> float:
    """Calculate stress index from Vmem."""
    deviation_score = min(100, (abs(vmem + 70) / 30) * 100) * 0.5
    variability_score = min(100, (vmem_std / 15) * 100) * 0.3
    absolute_score = 100 * 0.2 if vmem > -50 or vmem < -90 else 0
    return min(100, deviation_score + variability_score + absolute_score)
