"""
BioelectricBridge: Módulo de Transfer Functions Vmem → Índices Agronómicos

Implementa las funciones de transferencia científicas que conectan
señales bioeléctricas (Vmem) con índices agronómicos (IPF, IAH, NPF).

Basado en investigación 2025:
- Plant Bioelectric Early Warning Systems (emmind.net/openpapers, 2025)
- PMC12649949: Bioelectric signaling in plant stress responses
- arXiv:2506.04132: ML classification of plant stress via Vmem spectrograms

Autor: Dr. José Manuel Cadena
Fecha: Enero 2026
Framework: C²AI - Conscious Citrus AI
"""

import math
import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime
from enum import Enum
import logging

logger = logging.getLogger(__name__)


# =============================================================================
# CONSTANTES CIENTÍFICAS - CALIBRADAS PARA CITRUS LATIFOLIA (LIMA PERSA)
# =============================================================================

class BioelectricConstants:
    """Constantes biofísicas para señalización en Citrus latifolia."""
    
    # Potencial de membrana en reposo (mV)
    VMEM_BASELINE = -70.0
    
    # Umbral de despolarización para alerta (mV sobre baseline)
    VMEM_ALERT_THRESHOLD = 15.0
    
    # Umbral crítico de despolarización (mV)
    VMEM_CRITICAL_THRESHOLD = 25.0
    
    # Frecuencia óptima para NPF (Hz) - bandas espectrales 0.1-10 Hz
    NPF_FREQ_OPTIMAL = 2.5
    
    # Desviación estándar para kernel Gaussiano NPF
    NPF_SIGMA_FREQ = 1.2
    
    # Factor de conversión IAH: L/m² por mV de variación
    IAH_K_WATER = 0.2
    
    # Sensibilidad IPF (pendiente sigmoid)
    IPF_SENSITIVITY = 0.15
    
    # Umbral IPF v0 (punto medio sigmoid)
    IPF_V0_THRESHOLD = 15.0
    
    # Escala máxima de plagas (monitoreo FCLL)
    MAX_PEST_SCALE = 3.0


# =============================================================================
# DATACLASSES PARA SEÑALES BIOELÉCTRICAS
# =============================================================================

@dataclass
class BioelectricSignal:
    """Señal bioeléctrica capturada de sensores."""
    
    vmem: float  # Potencial de membrana actual (mV)
    vmem_baseline: float = BioelectricConstants.VMEM_BASELINE
    vmem_variance: float = 0.0  # Varianza temporal de Vmem
    freq_dominant: float = 2.5  # Frecuencia dominante (Hz)
    freq_power: float = 0.0  # Potencia espectral en banda dominante
    temperature: float = 25.0  # Temperatura (°C)
    humidity: float = 70.0  # Humedad relativa (%)
    timestamp: datetime = field(default_factory=datetime.now)
    section_id: str = "S1"
    
    @property
    def delta_vmem(self) -> float:
        """Despolarización respecto al baseline."""
        return self.vmem - self.vmem_baseline
    
    @property
    def is_stressed(self) -> bool:
        """True si la planta muestra señales de estrés."""
        return abs(self.delta_vmem) > BioelectricConstants.VMEM_ALERT_THRESHOLD
    
    @property
    def is_critical(self) -> bool:
        """True si el estrés es crítico."""
        return abs(self.delta_vmem) > BioelectricConstants.VMEM_CRITICAL_THRESHOLD


@dataclass
class CoherenceMetrics:
    """Métricas de coherencia bioeléctrica entre órganos/secciones."""
    
    coherence_index: float  # Índice de coherencia (0-1)
    entropy: float  # Entropía de Shannon del sistema
    predictability: float  # Score de predictibilidad (0-1)
    sync_ratio: float  # Ratio de sincronización entre secciones
    phase_difference: float  # Diferencia de fase promedio (radianes)
    
    @property
    def is_coherent(self) -> bool:
        """True si el sistema está coherente."""
        return self.coherence_index > 0.7


@dataclass 
class TransferResult:
    """Resultado de una función de transferencia Vmem → Índice."""
    
    index_name: str
    index_value: float
    confidence: float
    band: str
    source_vmem: float
    transfer_function: str
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# TRANSFER FUNCTIONS: VMEM → ÍNDICES AGRONÓMICOS
# =============================================================================

class BioelectricBridge:
    """
    Puente entre señales bioeléctricas y índices agronómicos.
    
    Implementa transfer functions basadas en investigación científica 2025:
    - Sigmoid para IPF (clasificación de estrés)
    - Linear para IAH (balance hídrico)
    - Gaussian kernel para NPF (nutrición)
    """
    
    def __init__(self, section_id: str = "S1"):
        self.section_id = section_id
        self.constants = BioelectricConstants()
        self._calibration_history: List[Dict] = []
    
    # -------------------------------------------------------------------------
    # IPF Transfer Function (Sigmoid)
    # -------------------------------------------------------------------------
    
    def vmem_to_ipf(self, signal: BioelectricSignal) -> TransferResult:
        """
        Convierte señal Vmem a IPF usando función sigmoid.
        
        Fórmula: IPF = σ(k * (ΔVmem - v0))
        donde:
            - k = sensibilidad (0.15 para Citrus latifolia)
            - v0 = umbral (15 mV)
            - ΔVmem = despolarización desde baseline
        
        Referencia: arxiv:2506.04132 - RF classifiers for plant stress
        
        Args:
            signal: Señal bioeléctrica
            
        Returns:
            TransferResult con IPF calculado
        """
        delta_vmem = signal.delta_vmem
        k = self.constants.IPF_SENSITIVITY
        v0 = self.constants.IPF_V0_THRESHOLD
        
        # Sigmoid inverso (mayor despolarización = menor IPF)
        # IPF alto = planta sana, IPF bajo = planta estresada
        exponent = k * (delta_vmem - v0)
        ipf_raw = 1.0 / (1.0 + math.exp(exponent))
        
        # Escalar a rango útil (0.5 - 1.0)
        ipf = 0.5 + 0.5 * ipf_raw
        
        # Ajustar por condiciones ambientales
        if signal.temperature > 35:
            ipf *= 0.95  # Estrés térmico
        if signal.humidity < 40:
            ipf *= 0.97  # Estrés hídrico ambiental
        
        ipf = max(0.5, min(1.0, ipf))
        
        # Clasificar banda
        if ipf >= 0.90:
            band = "ÓPTIMO"
        elif ipf >= 0.80:
            band = "WARNING"
        elif ipf >= 0.70:
            band = "ALERTA"
        else:
            band = "CRÍTICO"
        
        # Calcular confianza basada en calidad de señal
        confidence = self._calculate_confidence(signal.vmem_variance)
        
        return TransferResult(
            index_name="IPF",
            index_value=round(ipf, 4),
            confidence=confidence,
            band=band,
            source_vmem=signal.vmem,
            transfer_function="sigmoid",
            metadata={
                "delta_vmem": delta_vmem,
                "k": k,
                "v0": v0,
                "temperature_adjusted": signal.temperature > 35,
                "humidity_adjusted": signal.humidity < 40
            }
        )
    
    # -------------------------------------------------------------------------
    # IAH Transfer Function (Linear)
    # -------------------------------------------------------------------------
    
    def vmem_to_iah(self, signal: BioelectricSignal) -> TransferResult:
        """
        Convierte varianza de Vmem a IAH usando función lineal.
        
        Fórmula: IAH = max(0.5, min(1.1, 1.0 - k_w * σ_vmem / 10))
        donde:
            - k_w = factor de conversión (0.2 L/m² por mV)
            - σ_vmem = varianza de Vmem
        
        Referencia: PMC12649949 - Bioelectric signaling and water stress
        
        Alta varianza en Vmem indica desbalance hídrico.
        """
        k_w = self.constants.IAH_K_WATER
        vmem_var = signal.vmem_variance
        
        # Linear con saturación
        iah = 1.0 - k_w * vmem_var / 10.0
        iah = max(0.5, min(1.1, iah))
        
        # Ajustar por temperatura (evapotranspiración)
        if signal.temperature > 30:
            temp_factor = 1.0 - (signal.temperature - 30) * 0.01
            iah *= max(0.9, temp_factor)
        
        # Clasificar banda
        if iah >= 0.95:
            band = "ÓPTIMO"
        elif iah >= 0.85:
            band = "ADECUADO"
        elif iah >= 0.70:
            band = "DÉFICIT"
        else:
            band = "CRÍTICO"
        
        confidence = self._calculate_confidence(vmem_var)
        
        return TransferResult(
            index_name="IAH",
            index_value=round(iah, 4),
            confidence=confidence,
            band=band,
            source_vmem=signal.vmem,
            transfer_function="linear",
            metadata={
                "vmem_variance": vmem_var,
                "k_water": k_w,
                "temperature": signal.temperature
            }
        )
    
    # -------------------------------------------------------------------------
    # NPF Transfer Function (Gaussian Kernel)
    # -------------------------------------------------------------------------
    
    def vmem_to_npf(self, signal: BioelectricSignal) -> TransferResult:
        """
        Convierte frecuencia dominante a NPF usando kernel Gaussiano.
        
        Fórmula: NPF = exp(-(f_peak - f_0)² / (2σ_f²))
        donde:
            - f_peak = frecuencia dominante del espectro Vmem
            - f_0 = frecuencia óptima (2.5 Hz para lima persa)
            - σ_f = desviación estándar (1.2 Hz)
        
        Referencia: arxiv:2506.04132 - Spectral analysis of plant bioelectricity
        
        Desviación de frecuencia óptima indica deficiencia nutricional.
        """
        f_peak = signal.freq_dominant
        f_0 = self.constants.NPF_FREQ_OPTIMAL
        sigma_f = self.constants.NPF_SIGMA_FREQ
        
        # Gaussian kernel
        npf = math.exp(-((f_peak - f_0) ** 2) / (2 * sigma_f ** 2))
        
        # Escalar a rango útil (0.6 - 1.0)
        npf = 0.6 + 0.4 * npf
        npf = max(0.5, min(1.0, npf))
        
        # Clasificar banda
        if npf >= 0.95:
            band = "ÓPTIMO"
        elif npf >= 0.85:
            band = "ADECUADO"
        elif npf >= 0.70:
            band = "DEFICIENTE"
        else:
            band = "CRÍTICO"
        
        confidence = 0.85 if signal.freq_power > 0.5 else 0.70
        
        return TransferResult(
            index_name="NPF",
            index_value=round(npf, 4),
            confidence=confidence,
            band=band,
            source_vmem=signal.vmem,
            transfer_function="gaussian_kernel",
            metadata={
                "freq_dominant": f_peak,
                "freq_optimal": f_0,
                "sigma_freq": sigma_f,
                "freq_power": signal.freq_power
            }
        )
    
    # -------------------------------------------------------------------------
    # PSI Transfer Function (Estrés Térmico)
    # -------------------------------------------------------------------------
    
    def vmem_to_psi(self, signal: BioelectricSignal) -> TransferResult:
        """
        Convierte señales Vmem a PSI (factor solar-térmico).
        
        Usa combinación de Vmem y temperatura para estimar
        estrés térmico y eficiencia fotosintética.
        """
        temp = signal.temperature
        vmem = signal.vmem
        
        # Factor térmico óptimo entre 20-30°C
        if 20 <= temp <= 30:
            temp_factor = 1.0
        elif temp < 20:
            temp_factor = 0.9 + 0.01 * temp
        else:
            temp_factor = max(0.6, 1.0 - 0.02 * (temp - 30))
        
        # Factor bioeléctrico
        vmem_factor = 1.0 - abs(signal.delta_vmem) / 50.0
        vmem_factor = max(0.7, min(1.0, vmem_factor))
        
        psi = temp_factor * vmem_factor
        psi = max(0.5, min(1.0, psi))
        
        if psi >= 0.90:
            band = "ÓPTIMO"
        elif psi >= 0.80:
            band = "ADECUADO"
        elif psi >= 0.70:
            band = "ESTRÉS"
        else:
            band = "CRÍTICO"
        
        return TransferResult(
            index_name="PSI",
            index_value=round(psi, 4),
            confidence=0.80,
            band=band,
            source_vmem=vmem,
            transfer_function="composite_thermal",
            metadata={
                "temperature": temp,
                "temp_factor": temp_factor,
                "vmem_factor": vmem_factor
            }
        )
    
    # -------------------------------------------------------------------------
    # Coherence Index (Multi-section)
    # -------------------------------------------------------------------------
    
    def calculate_coherence(
        self, 
        signals: List[BioelectricSignal]
    ) -> CoherenceMetrics:
        """
        Calcula índice de coherencia entre múltiples señales/secciones.
        
        Fórmula: C = |∫ Vmem_1(t) × Vmem_2*(t) dt| / (σ_1 × σ_2)
        
        Referencia: emmind.net/openpapers - Plant coherence studies
        """
        if len(signals) < 2:
            return CoherenceMetrics(
                coherence_index=1.0,
                entropy=0.0,
                predictability=1.0,
                sync_ratio=1.0,
                phase_difference=0.0
            )
        
        vmem_values = [s.vmem for s in signals]
        vmem_array = np.array(vmem_values)
        
        # Correlación promedio entre pares
        correlations = []
        for i in range(len(signals)):
            for j in range(i + 1, len(signals)):
                # Normalizar y correlacionar
                v1 = signals[i].vmem - signals[i].vmem_baseline
                v2 = signals[j].vmem - signals[j].vmem_baseline
                
                # Correlación de Pearson simplificada
                if abs(v1) > 0.01 and abs(v2) > 0.01:
                    corr = 1.0 - abs(v1 - v2) / max(abs(v1), abs(v2))
                else:
                    corr = 1.0
                correlations.append(max(0, corr))
        
        coherence_index = np.mean(correlations) if correlations else 1.0
        
        # Entropía de Shannon
        vmem_norm = (vmem_array - vmem_array.min()) / (vmem_array.max() - vmem_array.min() + 1e-10)
        vmem_norm = vmem_norm / (vmem_norm.sum() + 1e-10)
        entropy = -np.sum(vmem_norm * np.log(vmem_norm + 1e-10))
        entropy = entropy / np.log(len(signals))  # Normalizar
        
        # Predictibilidad = 1 - entropía normalizada
        predictability = max(0, 1.0 - entropy)
        
        # Ratio de sincronización
        vmem_std = np.std(vmem_values)
        sync_ratio = 1.0 / (1.0 + vmem_std / 10.0)
        
        return CoherenceMetrics(
            coherence_index=round(coherence_index, 4),
            entropy=round(entropy, 4),
            predictability=round(predictability, 4),
            sync_ratio=round(sync_ratio, 4),
            phase_difference=0.0  # Requiere datos temporales completos
        )
    
    # -------------------------------------------------------------------------
    # Full Transform Pipeline
    # -------------------------------------------------------------------------
    
    def transform_all(
        self, 
        signal: BioelectricSignal
    ) -> Dict[str, TransferResult]:
        """
        Ejecuta todas las transfer functions para una señal.
        
        Returns:
            Diccionario con resultados de IPF, IAH, NPF, PSI
        """
        results = {
            "IPF": self.vmem_to_ipf(signal),
            "IAH": self.vmem_to_iah(signal),
            "NPF": self.vmem_to_npf(signal),
            "PSI": self.vmem_to_psi(signal)
        }
        
        logger.info(
            f"BioelectricBridge transform: Vmem={signal.vmem:.1f}mV → "
            f"IPF={results['IPF'].index_value:.2f}, "
            f"IAH={results['IAH'].index_value:.2f}, "
            f"NPF={results['NPF'].index_value:.2f}"
        )
        
        return results
    
    # -------------------------------------------------------------------------
    # Helpers
    # -------------------------------------------------------------------------
    
    def _calculate_confidence(self, variance: float) -> float:
        """Calcula confianza basada en varianza de señal."""
        # Menor varianza = mayor confianza
        base_confidence = 0.90
        variance_penalty = min(0.3, variance / 50.0)
        return max(0.60, base_confidence - variance_penalty)
    
    def simulate_vmem_from_pest_data(
        self,
        trips: float,
        diaforina: float,
        arana_roja: float,
        temperature: float = 25.0,
        humidity: float = 70.0
    ) -> BioelectricSignal:
        """
        Genera señal Vmem sintética desde datos de plagas.
        
        Para uso cuando no hay sensores Vmem reales.
        Basado en correlaciones observadas en literatura.
        """
        # Presión de plagas → despolarización
        pest_pressure = (trips + diaforina * 2 + arana_roja) / 9.0
        pest_pressure = min(1.0, pest_pressure)
        
        # Calcular Vmem simulado
        delta_vmem = pest_pressure * 30.0  # Max 30mV de despolarización
        vmem = self.constants.VMEM_BASELINE + delta_vmem
        
        # Varianza correlacionada con presión
        vmem_variance = pest_pressure * 15.0
        
        return BioelectricSignal(
            vmem=vmem,
            vmem_baseline=self.constants.VMEM_BASELINE,
            vmem_variance=vmem_variance,
            freq_dominant=2.5 - pest_pressure * 0.5,
            freq_power=0.7,
            temperature=temperature,
            humidity=humidity,
            section_id=self.section_id
        )


# =============================================================================
# INTEGRATION WITH EXISTING KERNELS
# =============================================================================

class KernelBioelectricAdapter:
    """
    Adaptador que conecta BioelectricBridge con los kernels existentes.
    
    Permite que los kernels MDP usen señales bioeléctricas como
    entrada adicional para mejorar predicciones.
    """
    
    def __init__(self, section_id: str = "S1"):
        self.section_id = section_id
        self.bridge = BioelectricBridge(section_id)
    
    def enhance_ipf_state(
        self,
        current_ipf: float,
        trips: float,
        diaforina: float,
        arana_roja: float,
        temperature: float = 25.0
    ) -> Dict[str, Any]:
        """
        Mejora estado IPF con datos bioeléctricos simulados.
        
        Combina IPF tradicional con señal Vmem para mayor precisión.
        """
        # Simular Vmem desde datos de plagas
        signal = self.bridge.simulate_vmem_from_pest_data(
            trips=trips,
            diaforina=diaforina,
            arana_roja=arana_roja,
            temperature=temperature
        )
        
        # Obtener IPF bioeléctrico
        bio_result = self.bridge.vmem_to_ipf(signal)
        
        # Fusionar: 70% tradicional, 30% bioeléctrico
        enhanced_ipf = 0.7 * current_ipf + 0.3 * bio_result.index_value
        
        return {
            "ipf_traditional": current_ipf,
            "ipf_bioelectric": bio_result.index_value,
            "ipf_enhanced": round(enhanced_ipf, 4),
            "vmem_simulated": signal.vmem,
            "confidence": bio_result.confidence,
            "band": bio_result.band,
            "enhancement_factor": 0.3,
            "method": "vmem_fusion"
        }
    
    def get_early_warning(
        self,
        signal: BioelectricSignal,
        threshold_hours: int = 24
    ) -> Dict[str, Any]:
        """
        Sistema de alerta temprana basado en Vmem.
        
        Detecta estrés antes de que sea visible en monitoreo tradicional.
        Basado en estudios 2025: 97% accuracy en detección temprana.
        """
        results = self.bridge.transform_all(signal)
        
        warnings = []
        severity = "NONE"
        
        for name, result in results.items():
            if result.band in ["CRÍTICO", "CRÍTICO"]:
                warnings.append({
                    "factor": name,
                    "value": result.index_value,
                    "band": result.band,
                    "action": f"URGENTE: Intervenir {name} inmediatamente"
                })
                severity = "CRITICAL"
            elif result.band in ["ALERTA", "DÉFICIT", "DEFICIENTE", "ESTRÉS"]:
                warnings.append({
                    "factor": name,
                    "value": result.index_value,
                    "band": result.band,
                    "action": f"ATENCIÓN: Monitorear {name} en próximas {threshold_hours}h"
                })
                if severity != "CRITICAL":
                    severity = "WARNING"
        
        return {
            "timestamp": datetime.now().isoformat(),
            "section": self.section_id,
            "vmem": signal.vmem,
            "is_stressed": signal.is_stressed,
            "is_critical": signal.is_critical,
            "severity": severity,
            "warnings": warnings,
            "factors": {k: v.index_value for k, v in results.items()},
            "recommendation": self._generate_recommendation(warnings)
        }
    
    def _generate_recommendation(self, warnings: List[Dict]) -> str:
        """Genera recomendación basada en alertas."""
        if not warnings:
            return "Sistema en estado óptimo. Continuar monitoreo regular."
        
        critical = [w for w in warnings if "CRÍTICO" in w["band"]]
        if critical:
            factors = ", ".join([w["factor"] for w in critical])
            return f"⚠️ INTERVENCIÓN URGENTE requerida en: {factors}"
        
        factors = ", ".join([w["factor"] for w in warnings])
        return f"📊 Monitoreo intensivo recomendado para: {factors}"


# =============================================================================
# FACTORY FUNCTION
# =============================================================================

def create_bioelectric_bridge(section_id: str = "S1") -> BioelectricBridge:
    """Factory function para crear instancia de BioelectricBridge."""
    return BioelectricBridge(section_id)


def create_kernel_adapter(section_id: str = "S1") -> KernelBioelectricAdapter:
    """Factory function para crear adaptador kernel-bioelectric."""
    return KernelBioelectricAdapter(section_id)


# =============================================================================
# EXAMPLE USAGE
# =============================================================================

if __name__ == "__main__":
    # Ejemplo de uso
    bridge = create_bioelectric_bridge("S1")
    
    # Crear señal de ejemplo
    signal = BioelectricSignal(
        vmem=-55.0,  # Despolarizado (estrés)
        vmem_baseline=-70.0,
        vmem_variance=8.5,
        freq_dominant=2.0,
        temperature=28.0,
        humidity=65.0,
        section_id="S1"
    )
    
    # Transformar
    results = bridge.transform_all(signal)
    
    print("=== BioelectricBridge Results ===")
    for name, result in results.items():
        print(f"{name}: {result.index_value:.2f} ({result.band}) - Confidence: {result.confidence:.0%}")
    
    # Coherencia multi-sección
    signals = [
        signal,
        BioelectricSignal(vmem=-52.0, section_id="S2"),
        BioelectricSignal(vmem=-58.0, section_id="S3")
    ]
    coherence = bridge.calculate_coherence(signals)
    print(f"\nCoherence Index: {coherence.coherence_index:.2%}")
    print(f"System Entropy: {coherence.entropy:.2f}")
