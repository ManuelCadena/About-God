"""
Levin Bioelectric Agent - C²AI Framework Layer 2
=================================================
Implements Michael Levin's bioelectric cognition framework with 10 detection modules.
Early detection of pests, diseases, and stress 24-72 hours before visible symptoms.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

10 Detection Modules:
1. Pest Detection - 7 main pests
2. Disease Detection - 4 main diseases  
3. Nutrition Status - N/P/K/Micro deficiencies
4. Water Stress - Hydric balance
5. Opportunity Window - Application timing
6. Fruit Quality - Quality prediction
7. Vigor Assessment - Plant vitality
8. Frost Damage - Cold damage risk
9. Recovery Monitor - Post-stress recovery
10. Circadian Baseline - Daily rhythm correction
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("LevinBioelectricAgent")


class ThreatType(str, Enum):
    TRIPS = "trips"
    PULGON = "pulgon"
    DIAPHORINA = "diaphorina"
    ARANA_ROJA = "arana_roja"
    MINADOR = "minador"
    ESCAMA = "escama"
    ACARO = "acaro"


class DiseaseType(str, Enum):
    ANTRACNOSIS = "antracnosis"
    MANCHA_GRASIENTA = "mancha_grasienta"
    HLB = "hlb"
    PHYTOPHTHORA = "phytophthora"


class NutrientDeficiency(str, Enum):
    NITROGEN = "nitrogen"
    PHOSPHORUS = "phosphorus"
    POTASSIUM = "potassium"
    MAGNESIUM = "magnesium"
    ZINC = "zinc"
    IRON = "iron"
    MANGANESE = "manganese"


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class BioelectricReading:
    """Raw bioelectric sensor reading."""
    vmem_mv: float           # Membrane potential in mV
    impedance_kohm: float    # Tissue impedance in kΩ
    frequency_hz: float      # Dominant frequency in Hz
    temperature_c: float     # Tissue temperature
    humidity_pct: float      # Local humidity
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class PestSignature:
    """Bioelectric signature for pest detection."""
    pest_type: ThreatType
    delta_vmem_range: Tuple[float, float]
    frequency_range: Tuple[float, float]
    impedance_change_pct: float
    lead_time_hours: int
    confidence_threshold: float
    recommended_action: str
    products: List[str]
    dosage: str


@dataclass
class DetectionResult:
    """Result from any detection module."""
    module: str
    detected: bool
    threat_type: str
    confidence: float
    severity: Severity
    lead_time_hours: int
    recommended_action: str
    metrics: Dict[str, float]
    section: str
    timestamp: datetime = field(default_factory=datetime.now)


# Pest Bioelectric Signatures (from LEVIN_MODULES_PART1_PEST_DETECTOR.md)
PEST_SIGNATURES: Dict[ThreatType, PestSignature] = {
    ThreatType.TRIPS: PestSignature(
        pest_type=ThreatType.TRIPS,
        delta_vmem_range=(10.0, 20.0),
        frequency_range=(15.0, 25.0),
        impedance_change_pct=-7.5,
        lead_time_hours=48,
        confidence_threshold=0.70,
        recommended_action="Aplicar control inmediato",
        products=["Spinosad", "Spirotetramat (Movento)"],
        dosage="0.2 L/ha o 150 ml/ha"
    ),
    ThreatType.DIAPHORINA: PestSignature(
        pest_type=ThreatType.DIAPHORINA,
        delta_vmem_range=(15.0, 25.0),
        frequency_range=(20.0, 30.0),
        impedance_change_pct=-8.0,
        lead_time_hours=72,
        confidence_threshold=0.80,
        recommended_action="🚨 ALERTA HLB: Control urgente de psílido",
        products=["Imidacloprid", "Thiamethoxam", "Dimetoato"],
        dosage="0.35 L/ha"
    ),
    ThreatType.PULGON: PestSignature(
        pest_type=ThreatType.PULGON,
        delta_vmem_range=(10.0, 30.0),
        frequency_range=(5.0, 15.0),
        impedance_change_pct=-5.0,
        lead_time_hours=36,
        confidence_threshold=0.68,
        recommended_action="Inspección brotes + control si Toxoptera",
        products=["Imidacloprid", "Acetamiprid"],
        dosage="0.25 L/ha"
    ),
    ThreatType.ARANA_ROJA: PestSignature(
        pest_type=ThreatType.ARANA_ROJA,
        delta_vmem_range=(8.0, 18.0),
        frequency_range=(3.0, 8.0),
        impedance_change_pct=-8.0,
        lead_time_hours=48,
        confidence_threshold=0.65,
        recommended_action="Liberar Phytoseiulus o aplicar acaricida",
        products=["Abamectina", "Phytoseiulus persimilis"],
        dosage="0.5 L/ha o 2000 ind/ha"
    ),
    ThreatType.MINADOR: PestSignature(
        pest_type=ThreatType.MINADOR,
        delta_vmem_range=(5.0, 15.0),
        frequency_range=(8.0, 15.0),
        impedance_change_pct=-4.0,
        lead_time_hours=24,
        confidence_threshold=0.72,
        recommended_action="Aplicar en brotes nuevos",
        products=["Abamectina", "Cipermetrina"],
        dosage="0.3 L/ha"
    ),
    ThreatType.ESCAMA: PestSignature(
        pest_type=ThreatType.ESCAMA,
        delta_vmem_range=(3.0, 10.0),
        frequency_range=(1.0, 5.0),
        impedance_change_pct=-3.0,
        lead_time_hours=72,
        confidence_threshold=0.60,
        recommended_action="Aceite mineral + insecticida",
        products=["Aceite mineral", "Buprofezin"],
        dosage="1.5 L/ha"
    ),
    ThreatType.ACARO: PestSignature(
        pest_type=ThreatType.ACARO,
        delta_vmem_range=(6.0, 14.0),
        frequency_range=(4.0, 10.0),
        impedance_change_pct=-6.0,
        lead_time_hours=36,
        confidence_threshold=0.65,
        recommended_action="Control con azufre o acaricida",
        products=["Azufre", "Fenbutatin oxide"],
        dosage="2.0 kg/ha"
    ),
}


class LevinBioelectricAgent:
    """
    10-Module Bioelectric Detection System.
    
    Core Principle: Plants encode their internal state in bioelectric
    patterns (Vmem, frequency, impedance). Changes in these patterns
    precede visible symptoms by 24-72 hours.
    
    Tools (10 modules):
    1. detect_pest_signature() - 7 pests
    2. detect_disease_signature() - 4 diseases
    3. assess_nutrition_status() - N/P/K/Micro
    4. calculate_water_stress() - Hydric balance
    5. detect_opportunity_window() - Application timing
    6. assess_fruit_quality() - Quality prediction
    7. calculate_vigor_score() - Plant vitality
    8. predict_frost_damage() - Cold damage risk
    9. monitor_recovery() - Post-stress recovery
    10. get_circadian_baseline() - Daily rhythm
    """
    
    BASELINE_VMEM = -70.0  # mV, healthy baseline
    BASELINE_IMPEDANCE = 50.0  # kΩ
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.signatures = PEST_SIGNATURES
        logger.info("LevinBioelectricAgent initialized with 10 modules")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 1: PEST DETECTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def detect_pest_signature(
        self,
        vmem_delta_6h: float,
        dominant_freq: float,
        humidity: float,
        temperature: float,
        section: str
    ) -> List[DetectionResult]:
        """
        Module 1: Detect pests via bioelectric signatures.
        
        Input:
        - vmem_delta_6h: Change in Vmem over 6 hours (mV)
        - dominant_freq: Dominant frequency from FFT (Hz)
        - humidity: Relative humidity (%)
        - temperature: Temperature (°C)
        
        Output: List of detected pests with confidence and actions
        """
        detections = []
        
        for pest_type, sig in self.signatures.items():
            confidence = self._calculate_pest_confidence(
                vmem_delta_6h, dominant_freq, humidity, temperature, sig
            )
            
            if confidence >= sig.confidence_threshold:
                severity = self._classify_severity(confidence, sig.lead_time_hours)
                
                detections.append(DetectionResult(
                    module="pest_detection",
                    detected=True,
                    threat_type=pest_type.value,
                    confidence=round(confidence, 3),
                    severity=severity,
                    lead_time_hours=sig.lead_time_hours,
                    recommended_action=sig.recommended_action,
                    metrics={
                        'vmem_delta_6h': vmem_delta_6h,
                        'dominant_freq': dominant_freq,
                        'humidity': humidity,
                        'temperature': temperature,
                        'products': ', '.join(sig.products),
                        'dosage': sig.dosage
                    },
                    section=section
                ))
        
        return sorted(detections, key=lambda x: x.confidence, reverse=True)
    
    def _calculate_pest_confidence(
        self,
        vmem_delta: float,
        freq: float,
        humidity: float,
        temp: float,
        sig: PestSignature
    ) -> float:
        """Calculate confidence for a specific pest signature."""
        confidence = 0.0
        
        # Vmem delta match (40%)
        v_low, v_high = sig.delta_vmem_range
        if v_low <= abs(vmem_delta) <= v_high:
            ratio = 1.0 - abs(abs(vmem_delta) - (v_low + v_high) / 2) / ((v_high - v_low) / 2)
            confidence += 0.40 * max(0, ratio)
        elif abs(vmem_delta) > v_high * 0.8:
            confidence += 0.20  # Partial match
        
        # Frequency match (30%)
        f_low, f_high = sig.frequency_range
        if f_low <= freq <= f_high:
            ratio = 1.0 - abs(freq - (f_low + f_high) / 2) / ((f_high - f_low) / 2)
            confidence += 0.30 * max(0, ratio)
        
        # Environmental factors (20%)
        env_score = 0.5
        if humidity > 70:
            env_score += 0.25
        if 20 <= temp <= 32:
            env_score += 0.25
        confidence += 0.20 * env_score
        
        # Signal variability bonus (10%)
        if abs(vmem_delta) > 5:
            confidence += 0.10 * min(1.0, abs(vmem_delta) / 20)
        
        return min(1.0, confidence)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 2: DISEASE DETECTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def detect_disease_signature(
        self,
        vmem_vp: float,
        impedance_trend: float,
        pe_mills_hours: int,
        temp_avg: float,
        section: str
    ) -> List[DetectionResult]:
        """
        Module 2: Detect diseases via bioelectric + environmental signals.
        
        Input:
        - vmem_vp: Variation Potential (mV)
        - impedance_trend: % change in impedance over 7 days
        - pe_mills_hours: Hours of leaf wetness (PE Mills)
        - temp_avg: Average temperature (°C)
        
        Output: List of detected diseases with confidence and actions
        """
        detections = []
        
        # Antracnosis detection
        if pe_mills_hours >= 75 and 20 <= temp_avg <= 28:
            confidence = min(1.0, 0.5 + (pe_mills_hours / 200) + (abs(impedance_trend) / 30))
            if confidence >= 0.60:
                detections.append(DetectionResult(
                    module="disease_detection",
                    detected=True,
                    threat_type=DiseaseType.ANTRACNOSIS.value,
                    confidence=round(confidence, 3),
                    severity=Severity.HIGH if confidence > 0.80 else Severity.MEDIUM,
                    lead_time_hours=24,
                    recommended_action="Aplicar fungicida cúprico preventivo inmediatamente",
                    metrics={
                        'vmem_vp': vmem_vp,
                        'impedance_trend': impedance_trend,
                        'pe_mills_hours': pe_mills_hours,
                        'temp_avg': temp_avg,
                        'products': 'Oxicloruro de cobre, Mancozeb',
                        'dosage': '2.5 kg/ha'
                    },
                    section=section
                ))
        
        # Mancha grasienta detection
        if pe_mills_hours >= 48 and humidity_factor(temp_avg) > 0.7:
            confidence = min(1.0, 0.4 + (pe_mills_hours / 150))
            if confidence >= 0.55:
                detections.append(DetectionResult(
                    module="disease_detection",
                    detected=True,
                    threat_type=DiseaseType.MANCHA_GRASIENTA.value,
                    confidence=round(confidence, 3),
                    severity=Severity.MEDIUM,
                    lead_time_hours=48,
                    recommended_action="Aplicación preventiva de fungicida",
                    metrics={
                        'vmem_vp': vmem_vp,
                        'impedance_trend': impedance_trend,
                        'pe_mills_hours': pe_mills_hours,
                        'products': 'Stroby, Trifloxystrobin',
                        'dosage': '0.15 L/ha'
                    },
                    section=section
                ))
        
        # HLB detection (via sustained impedance drop)
        if impedance_trend < -15 and abs(vmem_vp) > 10:
            confidence = min(1.0, 0.3 + abs(impedance_trend) / 40 + abs(vmem_vp) / 40)
            if confidence >= 0.50:
                detections.append(DetectionResult(
                    module="disease_detection",
                    detected=True,
                    threat_type=DiseaseType.HLB.value,
                    confidence=round(confidence, 3),
                    severity=Severity.CRITICAL,
                    lead_time_hours=2160,  # 90 days
                    recommended_action="⚠️ HLB SOSPECHADO: qPCR inmediato + trunk injection si positivo",
                    metrics={
                        'vmem_vp': vmem_vp,
                        'impedance_trend': impedance_trend,
                        'products': 'Oxytetracycline trunk injection',
                        'dosage': '1.5g/árbol'
                    },
                    section=section
                ))
        
        # Phytophthora detection
        if impedance_trend < -20 and vmem_vp < -15:
            confidence = min(1.0, 0.4 + abs(impedance_trend) / 50)
            if confidence >= 0.55:
                detections.append(DetectionResult(
                    module="disease_detection",
                    detected=True,
                    threat_type=DiseaseType.PHYTOPHTHORA.value,
                    confidence=round(confidence, 3),
                    severity=Severity.HIGH,
                    lead_time_hours=72,
                    recommended_action="Aplicar Fosetyl-Al + mejorar drenaje",
                    metrics={
                        'vmem_vp': vmem_vp,
                        'impedance_trend': impedance_trend,
                        'products': 'Fosetyl-Al, Metalaxyl',
                        'dosage': '3.0 kg/ha'
                    },
                    section=section
                ))
        
        return sorted(detections, key=lambda x: x.confidence, reverse=True)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 3: NUTRITION STATUS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def assess_nutrition_status(
        self,
        vmem_baseline: float,
        impedance_ratio: float,
        leaf_color_index: float,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 3: Assess nutritional deficiencies via bioelectric patterns.
        
        Input:
        - vmem_baseline: Current baseline Vmem (mV)
        - impedance_ratio: Current/baseline impedance ratio
        - leaf_color_index: NDVI or visual color index (0-1)
        
        Output: Deficiency assessment with corrections
        """
        deficiencies = []
        overall_npf = 1.0
        
        # Nitrogen deficiency (yellow leaves, low Vmem)
        if vmem_baseline > -60 and leaf_color_index < 0.6:
            severity = 1.0 - leaf_color_index
            deficiencies.append({
                'nutrient': NutrientDeficiency.NITROGEN.value,
                'severity': round(severity, 2),
                'symptoms': 'Clorosis generalizada, Vmem elevado',
                'correction': 'Urea foliar 2% + Nitrato de amonio',
                'dosage': '5 kg/ha foliar',
                'timing': 'inmediato'
            })
            overall_npf -= 0.15 * severity
        
        # Potassium deficiency (impedance changes)
        if impedance_ratio > 1.3:
            severity = min(1.0, (impedance_ratio - 1.0) / 0.5)
            deficiencies.append({
                'nutrient': NutrientDeficiency.POTASSIUM.value,
                'severity': round(severity, 2),
                'symptoms': 'Impedancia elevada, necrosis marginal',
                'correction': 'Sulfato de potasio + K foliar',
                'dosage': '8 kg/ha',
                'timing': 'esta semana'
            })
            overall_npf -= 0.12 * severity
        
        # Magnesium deficiency
        if vmem_baseline > -55 and impedance_ratio > 1.2:
            severity = min(1.0, (vmem_baseline + 55) / 20)
            deficiencies.append({
                'nutrient': NutrientDeficiency.MAGNESIUM.value,
                'severity': round(severity, 2),
                'symptoms': 'Clorosis intervenal, Vmem alto',
                'correction': 'Sulfato de magnesio foliar',
                'dosage': '3 kg/ha',
                'timing': 'próxima aplicación'
            })
            overall_npf -= 0.08 * severity
        
        # Zinc deficiency (common in citrus)
        if leaf_color_index < 0.5 and vmem_baseline > -50:
            severity = min(1.0, (0.7 - leaf_color_index) / 0.4)
            deficiencies.append({
                'nutrient': NutrientDeficiency.ZINC.value,
                'severity': round(severity, 2),
                'symptoms': 'Hojas pequeñas, internodos cortos',
                'correction': 'Sulfato de zinc foliar',
                'dosage': '0.5 kg/ha',
                'timing': 'con próximo foliar'
            })
            overall_npf -= 0.06 * severity
        
        return {
            'section': section,
            'overall_npf': round(max(0.3, overall_npf), 3),
            'deficiencies_detected': len(deficiencies),
            'deficiencies': deficiencies,
            'metrics': {
                'vmem_baseline': vmem_baseline,
                'impedance_ratio': impedance_ratio,
                'leaf_color_index': leaf_color_index
            },
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 4: WATER STRESS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_water_stress(
        self,
        vmem_absolute: float,
        iah: float,
        et0: float,
        soil_moisture: float,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 4: Calculate water stress from bioelectric + hydric data.
        
        Input:
        - vmem_absolute: Current Vmem (mV)
        - iah: Índice Aptitud Hídrica (0-1)
        - et0: Evapotranspiration (mm/day)
        - soil_moisture: Soil moisture (%)
        
        Output: Water stress assessment with irrigation recommendations
        """
        # Bioelectric water stress indicator
        vmem_stress = 0.0
        if vmem_absolute < -85:
            vmem_stress = min(1.0, (-85 - vmem_absolute) / 20)
        
        # Combined stress index
        hydric_deficit = max(0, 1.0 - iah)
        et0_factor = min(1.0, et0 / 8.0)  # Normalize ET0
        soil_factor = max(0, (40 - soil_moisture) / 40) if soil_moisture < 40 else 0
        
        stress_index = (
            vmem_stress * 0.35 +
            hydric_deficit * 0.30 +
            et0_factor * 0.20 +
            soil_factor * 0.15
        )
        
        # Recommendations
        if stress_index > 0.7:
            urgency = "INMEDIATO"
            action = "Riego de emergencia + aumentar frecuencia"
            irrigation_mm = et0 * 1.5
        elif stress_index > 0.4:
            urgency = "HOY"
            action = "Aumentar riego según déficit"
            irrigation_mm = et0 * 1.2
        elif stress_index > 0.2:
            urgency = "esta_semana"
            action = "Ajustar programa de riego"
            irrigation_mm = et0
        else:
            urgency = "monitoreo"
            action = "Mantener régimen actual"
            irrigation_mm = et0 * 0.9
        
        return {
            'section': section,
            'stress_index': round(stress_index, 3),
            'stress_level': 'critical' if stress_index > 0.7 else 'high' if stress_index > 0.4 else 'moderate' if stress_index > 0.2 else 'low',
            'components': {
                'vmem_stress': round(vmem_stress, 3),
                'hydric_deficit': round(hydric_deficit, 3),
                'et0_factor': round(et0_factor, 3),
                'soil_factor': round(soil_factor, 3)
            },
            'recommendation': {
                'urgency': urgency,
                'action': action,
                'irrigation_mm': round(irrigation_mm, 1),
                'frequency': 'diario' if stress_index > 0.5 else 'cada 2 días'
            },
            'iah_adjusted': round(iah * (1 - stress_index * 0.2), 3),
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 5: OPPORTUNITY WINDOW
    # ═══════════════════════════════════════════════════════════════════════════
    
    def detect_opportunity_window(
        self,
        vmem_range: Tuple[float, float],
        wind_speed: float,
        rain_probability: float,
        temp: float,
        humidity: float,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 5: Detect optimal windows for pesticide/foliar applications.
        
        Input:
        - vmem_range: (min, max) Vmem over last 6h
        - wind_speed: Wind speed (km/h)
        - rain_probability: Rain probability next 6h (%)
        - temp: Temperature (°C)
        - humidity: Humidity (%)
        
        Output: Application window status and recommendations
        """
        vmem_min, vmem_max = vmem_range
        vmem_stability = 1.0 - (vmem_max - vmem_min) / 30  # More stable = better
        
        # Window quality factors
        wind_factor = 1.0 if wind_speed < 10 else 0.7 if wind_speed < 20 else 0.3
        rain_factor = 1.0 if rain_probability < 20 else 0.5 if rain_probability < 50 else 0.1
        temp_factor = 1.0 if 18 <= temp <= 28 else 0.7 if 15 <= temp <= 32 else 0.3
        humidity_factor = 1.0 if 50 <= humidity <= 80 else 0.7 if 40 <= humidity <= 90 else 0.4
        
        window_score = (
            vmem_stability * 0.25 +
            wind_factor * 0.25 +
            rain_factor * 0.25 +
            temp_factor * 0.15 +
            humidity_factor * 0.10
        )
        
        if window_score >= 0.8:
            status = "ÓPTIMO"
            recommendation = "Ventana excelente para aplicación"
            color = "green"
        elif window_score >= 0.6:
            status = "BUENO"
            recommendation = "Condiciones aceptables, proceder con precaución"
            color = "yellow"
        elif window_score >= 0.4:
            status = "MARGINAL"
            recommendation = "Condiciones subóptimas, considerar esperar"
            color = "orange"
        else:
            status = "CERRADO"
            recommendation = "No aplicar - condiciones adversas"
            color = "red"
        
        return {
            'section': section,
            'window_status': status,
            'window_score': round(window_score, 3),
            'color': color,
            'recommendation': recommendation,
            'factors': {
                'vmem_stability': round(vmem_stability, 2),
                'wind_factor': round(wind_factor, 2),
                'rain_factor': round(rain_factor, 2),
                'temp_factor': round(temp_factor, 2),
                'humidity_factor': round(humidity_factor, 2)
            },
            'conditions': {
                'wind_speed_kmh': wind_speed,
                'rain_probability_pct': rain_probability,
                'temperature_c': temp,
                'humidity_pct': humidity
            },
            'valid_until': (datetime.now() + timedelta(hours=2)).isoformat(),
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 6: FRUIT QUALITY
    # ═══════════════════════════════════════════════════════════════════════════
    
    def assess_fruit_quality(
        self,
        vmem_std: float,
        gdd: float,
        brix: float,
        diameter_mm: float,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 6: Predict fruit quality from bioelectric + phenology data.
        
        Input:
        - vmem_std: Standard deviation of Vmem (signal variability)
        - gdd: Current GDD accumulation
        - brix: Brix degrees (if available)
        - diameter_mm: Average fruit diameter
        
        Output: Quality prediction and optimization recommendations
        """
        # Quality factors
        vmem_quality = 1.0 - min(1.0, vmem_std / 15)  # Low variability = better
        gdd_progress = min(1.0, gdd / 1800)  # Progress to harvest
        brix_factor = min(1.0, brix / 12) if brix > 0 else 0.7  # Target 12 Brix
        size_factor = self._calculate_size_factor(diameter_mm)
        
        quality_score = (
            vmem_quality * 0.25 +
            gdd_progress * 0.20 +
            brix_factor * 0.30 +
            size_factor * 0.25
        )
        
        # Export grade prediction
        if quality_score >= 0.85 and diameter_mm >= 55:
            grade = "EXPORTACIÓN A"
            premium = 1.3
        elif quality_score >= 0.70 and diameter_mm >= 48:
            grade = "EXPORTACIÓN B"
            premium = 1.15
        elif quality_score >= 0.55:
            grade = "NACIONAL"
            premium = 1.0
        else:
            grade = "INDUSTRIA"
            premium = 0.7
        
        return {
            'section': section,
            'quality_score': round(quality_score, 3),
            'predicted_grade': grade,
            'price_premium': premium,
            'factors': {
                'vmem_quality': round(vmem_quality, 3),
                'gdd_progress': round(gdd_progress, 3),
                'brix_factor': round(brix_factor, 3),
                'size_factor': round(size_factor, 3)
            },
            'measurements': {
                'vmem_std': vmem_std,
                'gdd': gdd,
                'brix': brix,
                'diameter_mm': diameter_mm
            },
            'recommendations': self._generate_quality_recommendations(
                quality_score, vmem_quality, brix_factor, size_factor
            ),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_size_factor(self, diameter_mm: float) -> float:
        """Calculate size factor for quality assessment."""
        if diameter_mm >= 60:
            return 1.0
        elif diameter_mm >= 55:
            return 0.9
        elif diameter_mm >= 50:
            return 0.75
        elif diameter_mm >= 45:
            return 0.6
        else:
            return 0.4
    
    def _generate_quality_recommendations(
        self,
        quality_score: float,
        vmem_quality: float,
        brix_factor: float,
        size_factor: float
    ) -> List[str]:
        """Generate recommendations to improve quality."""
        recs = []
        
        if vmem_quality < 0.7:
            recs.append("Reducir estrés: bioelectric alta variabilidad detectada")
        if brix_factor < 0.7:
            recs.append("Aumentar K foliar para mejorar Brix")
        if size_factor < 0.7:
            recs.append("Optimizar riego para aumentar calibre")
        
        if not recs:
            recs.append("Mantener prácticas actuales - calidad óptima")
        
        return recs
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 7: VIGOR ASSESSMENT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_vigor_score(
        self,
        vmem_amplitude: float,
        light_response: float,
        lai: float,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 7: Assess plant vigor from bioelectric responsiveness.
        
        Input:
        - vmem_amplitude: Daily Vmem amplitude (mV)
        - light_response: Vmem change with light (mV/klux)
        - lai: Leaf Area Index
        
        Output: Vigor assessment and enhancement recommendations
        """
        # Vigor components
        amplitude_score = min(1.0, vmem_amplitude / 20)  # 20mV daily swing = healthy
        response_score = min(1.0, light_response / 2.0)  # 2mV/klux = responsive
        lai_score = min(1.0, lai / 4.5)  # LAI 4.5 = full canopy
        
        vigor_index = (
            amplitude_score * 0.35 +
            response_score * 0.35 +
            lai_score * 0.30
        )
        
        if vigor_index >= 0.85:
            status = "EXCELENTE"
            color = "green"
        elif vigor_index >= 0.70:
            status = "BUENO"
            color = "lime"
        elif vigor_index >= 0.50:
            status = "MODERADO"
            color = "yellow"
        elif vigor_index >= 0.30:
            status = "BAJO"
            color = "orange"
        else:
            status = "CRÍTICO"
            color = "red"
        
        return {
            'section': section,
            'vigor_index': round(vigor_index, 3),
            'status': status,
            'color': color,
            'components': {
                'amplitude_score': round(amplitude_score, 3),
                'response_score': round(response_score, 3),
                'lai_score': round(lai_score, 3)
            },
            'measurements': {
                'vmem_amplitude_mv': vmem_amplitude,
                'light_response_mv_klux': light_response,
                'lai': lai
            },
            'recommendations': [
                "Aplicar bioestimulante" if vigor_index < 0.5 else "Mantener programa actual",
                "Revisar nutrición" if amplitude_score < 0.5 else None,
                "Evaluar estrés lumínico" if response_score < 0.5 else None
            ],
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 8: FROST DAMAGE PREDICTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def predict_frost_damage(
        self,
        vmem_collapse: float,
        temp_forecast: List[float],
        duration_hours: int,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 8: Predict frost damage risk from bioelectric collapse.
        
        Input:
        - vmem_collapse: Vmem collapse magnitude (mV toward 0)
        - temp_forecast: Temperature forecast next 24h (°C)
        - duration_hours: Expected duration below 0°C
        
        Output: Frost risk assessment and protection recommendations
        """
        min_temp = min(temp_forecast) if temp_forecast else 5.0
        
        # Risk factors
        temp_risk = 0.0
        if min_temp < 0:
            temp_risk = min(1.0, abs(min_temp) / 5)
        elif min_temp < 3:
            temp_risk = 0.3
        
        duration_risk = min(1.0, duration_hours / 6)  # 6h exposure = max risk
        vmem_risk = min(1.0, vmem_collapse / 30)  # Collapse of 30mV = severe
        
        frost_risk = (
            temp_risk * 0.45 +
            duration_risk * 0.30 +
            vmem_risk * 0.25
        )
        
        if frost_risk >= 0.8:
            level = "CRÍTICO"
            actions = ["Activar wind machines", "Riego de protección", "Alertar personal"]
        elif frost_risk >= 0.5:
            level = "ALTO"
            actions = ["Preparar wind machines", "Monitoreo continuo", "Riego preventivo"]
        elif frost_risk >= 0.3:
            level = "MODERADO"
            actions = ["Monitorear temperaturas", "Revisar pronóstico"]
        else:
            level = "BAJO"
            actions = ["Sin acción requerida"]
        
        return {
            'section': section,
            'frost_risk': round(frost_risk, 3),
            'risk_level': level,
            'min_temp_forecast': min_temp,
            'duration_hours': duration_hours,
            'components': {
                'temp_risk': round(temp_risk, 3),
                'duration_risk': round(duration_risk, 3),
                'vmem_risk': round(vmem_risk, 3)
            },
            'protective_actions': actions,
            'estimated_damage_pct': round(frost_risk * 30, 1) if frost_risk > 0.3 else 0,
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 9: RECOVERY MONITOR
    # ═══════════════════════════════════════════════════════════════════════════
    
    def monitor_recovery(
        self,
        vmem_recovery_rate: float,
        days_since_stress: int,
        stress_type: str,
        section: str
    ) -> Dict[str, Any]:
        """
        Module 9: Monitor recovery after stress events.
        
        Input:
        - vmem_recovery_rate: Rate of Vmem return to baseline (mV/day)
        - days_since_stress: Days since stress event
        - stress_type: Type of stress (frost, drought, pest, pruning)
        
        Output: Recovery assessment and support recommendations
        """
        # Expected recovery rates by stress type
        expected_rates = {
            'frost': 3.0,      # 3 mV/day
            'drought': 5.0,   # 5 mV/day
            'pest': 2.5,      # 2.5 mV/day
            'pruning': 4.0,   # 4 mV/day
            'disease': 1.5    # 1.5 mV/day
        }
        
        expected_rate = expected_rates.get(stress_type, 3.0)
        recovery_ratio = vmem_recovery_rate / expected_rate
        
        # Recovery progress
        expected_days = {
            'frost': 14,
            'drought': 7,
            'pest': 21,
            'pruning': 30,
            'disease': 45
        }
        
        expected_duration = expected_days.get(stress_type, 14)
        time_progress = min(1.0, days_since_stress / expected_duration)
        
        recovery_score = (recovery_ratio * 0.6 + time_progress * 0.4)
        
        if recovery_score >= 0.9:
            status = "RECUPERADO"
            color = "green"
        elif recovery_score >= 0.7:
            status = "EN RECUPERACIÓN"
            color = "lime"
        elif recovery_score >= 0.5:
            status = "RECUPERACIÓN LENTA"
            color = "yellow"
        elif recovery_score >= 0.3:
            status = "ESTANCADO"
            color = "orange"
        else:
            status = "CRÍTICO"
            color = "red"
        
        return {
            'section': section,
            'recovery_score': round(recovery_score, 3),
            'status': status,
            'color': color,
            'stress_type': stress_type,
            'days_since_stress': days_since_stress,
            'recovery_rate_mv_day': vmem_recovery_rate,
            'expected_rate_mv_day': expected_rate,
            'recovery_ratio': round(recovery_ratio, 3),
            'estimated_full_recovery_days': max(0, expected_duration - days_since_stress),
            'support_recommendations': self._generate_recovery_support(
                recovery_ratio, stress_type
            ),
            'timestamp': datetime.now().isoformat()
        }
    
    def _generate_recovery_support(
        self,
        recovery_ratio: float,
        stress_type: str
    ) -> List[str]:
        """Generate recovery support recommendations."""
        recs = []
        
        if recovery_ratio < 0.7:
            recs.append("Aplicar bioestimulante (ácidos húmicos + aminoácidos)")
        
        if stress_type == 'frost':
            recs.append("Evitar podas por 2 semanas")
        elif stress_type == 'drought':
            recs.append("Riego de recuperación: 150% ET0")
        elif stress_type == 'pruning':
            recs.append("Aplicar cicatrizante en cortes grandes")
        
        if recovery_ratio < 0.5:
            recs.append("Reducir carga de frutos si aplica")
        
        if not recs:
            recs.append("Mantener programa normal - recuperación en curso")
        
        return recs
    
    # ═══════════════════════════════════════════════════════════════════════════
    # MODULE 10: CIRCADIAN BASELINE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_circadian_baseline(
        self,
        vmem_24h: List[float],
        timestamps: List[datetime],
        section: str
    ) -> Dict[str, Any]:
        """
        Module 10: Calculate circadian-corrected baseline.
        
        Input:
        - vmem_24h: 24-hour Vmem series (readings every 15 min = 96 points)
        - timestamps: Corresponding timestamps
        
        Output: Circadian-corrected baseline and anomalies
        """
        if len(vmem_24h) < 24:
            return {
                'section': section,
                'error': 'Insufficient data (need 24+ points)',
                'timestamp': datetime.now().isoformat()
            }
        
        vmem = np.array(vmem_24h)
        
        # Calculate basic statistics
        mean_vmem = np.mean(vmem)
        std_vmem = np.std(vmem)
        min_vmem = np.min(vmem)
        max_vmem = np.max(vmem)
        amplitude = max_vmem - min_vmem
        
        # Find circadian pattern (simple: day vs night)
        n = len(vmem)
        day_samples = vmem[n//4:3*n//4]  # Middle 50% = daytime
        night_samples = np.concatenate([vmem[:n//4], vmem[3*n//4:]])
        
        day_mean = np.mean(day_samples)
        night_mean = np.mean(night_samples)
        circadian_shift = day_mean - night_mean
        
        # Detect anomalies (values > 2 std from mean)
        anomalies = []
        for i, v in enumerate(vmem):
            if abs(v - mean_vmem) > 2 * std_vmem:
                anomalies.append({
                    'index': i,
                    'value': round(v, 2),
                    'deviation_std': round((v - mean_vmem) / std_vmem, 2),
                    'timestamp': timestamps[i].isoformat() if i < len(timestamps) else None
                })
        
        # Health assessment based on circadian pattern
        if 10 <= amplitude <= 25 and abs(circadian_shift) >= 3:
            rhythm_health = "NORMAL"
            color = "green"
        elif 5 <= amplitude <= 35:
            rhythm_health = "ALTERADO"
            color = "yellow"
        else:
            rhythm_health = "ANORMAL"
            color = "red"
        
        return {
            'section': section,
            'baseline_vmem': round(mean_vmem, 2),
            'std_vmem': round(std_vmem, 2),
            'amplitude': round(amplitude, 2),
            'circadian_shift': round(circadian_shift, 2),
            'day_mean': round(day_mean, 2),
            'night_mean': round(night_mean, 2),
            'rhythm_health': rhythm_health,
            'color': color,
            'anomalies_count': len(anomalies),
            'anomalies': anomalies[:5],  # Top 5 anomalies
            'corrected_baseline': round(mean_vmem - circadian_shift / 2, 2),
            'timestamp': datetime.now().isoformat()
        }
    
    def _classify_severity(self, confidence: float, lead_time: int) -> Severity:
        """Classify severity based on confidence and lead time."""
        if confidence >= 0.85 or lead_time >= 72:
            return Severity.CRITICAL if confidence >= 0.90 else Severity.HIGH
        elif confidence >= 0.70:
            return Severity.MEDIUM
        else:
            return Severity.LOW
    
    def close(self):
        if self.conn:
            self.conn.close()


def humidity_factor(temp: float) -> float:
    """Calculate humidity factor for disease risk."""
    if 20 <= temp <= 28:
        return 0.9
    elif 15 <= temp <= 32:
        return 0.6
    else:
        return 0.3
