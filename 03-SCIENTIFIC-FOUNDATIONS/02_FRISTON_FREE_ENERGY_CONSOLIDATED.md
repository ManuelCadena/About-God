# ⚡ FRISTON FREE ENERGY PRINCIPLE - DOCUMENTO CONSOLIDADO PhD

**C²AI Framework Layer 1**
**Versión:** 3.0 PhD Consolidado | **Fecha:** 5 Febrero 2026
**Autor:** Dr. José Manuel Cadena Ortiz de Montellano
**Colaborador Teórico:** Prof. Karl Friston (University College London)

---

## ÍNDICE

1. [Marco Teórico](#1-marco-teórico)
2. [Fundamentos Matemáticos](#2-fundamentos-matemáticos)
3. [Implementación Agrícola](#3-implementación-agrícola)
4. [Arquitectura del Agente](#4-arquitectura-del-agente)
5. [Implementación Python](#5-implementación-python)
6. [Integración con C²AI](#6-integración-con-c2ai)
7. [Aplicación a Sistemas Biológicos Avanzados](#7-aplicación-a-sistemas-biológicos-avanzados)
8. [Referencias Científicas](#8-referencias-científicas)

---

## 1. MARCO TEÓRICO

### 1.1 El Principio de Energía Libre de Friston

Karl Friston, neurocientífico del University College London, propuso que **todos los sistemas biológicos minimizan la "energía libre variacional"** para mantener su existencia. Este principio unifica:

- **Percepción**: Actualizar modelos internos basándose en observaciones
- **Acción**: Cambiar el entorno para que coincida con predicciones
- **Aprendizaje**: Mejorar modelos predictivos con el tiempo

### 1.2 Concepto Clave: Sorpresa (Surprise)

La "sorpresa" en términos de Friston NO es emocional, sino estadística:

```
Sorpresa = -log P(observación | modelo)
```

Un sistema "sorprendido" es uno cuyas observaciones difieren de sus predicciones. La vida persiste minimizando esta sorpresa.

### 1.3 Aplicación a Agricultura

En el contexto de CitrusMax AI, la finca es un "organismo" que:

| Concepto Friston | Aplicación Agrícola |
|------------------|---------------------|
| Estado esperado | IAH=0.90, IPF=0.92, NPF=0.85, PE=95% |
| Observación | Sensores, muestreo, datos reales |
| Energía Libre (F) | Desviación del estado óptimo |
| Minimización | Riego, fertilización, control de plagas |

### 1.4 Valor Agregado para CitrusMax

- **Homeostasis automática**: Sistema que busca equilibrio
- **Priorización inteligente**: Acciones basadas en mayor "sorpresa"
- **Predicción continua**: Modelo interno que aprende
- **Optimización holística**: No métricas aisladas, sino sistema completo

---

## 2. FUNDAMENTOS MATEMÁTICOS

### 2.1 Ecuación de Energía Libre Variacional

```
F = D_KL[Q(θ) || P(θ|y)] - log P(y)

Donde:
  F = Energía libre (a minimizar)
  D_KL = Divergencia Kullback-Leibler
  Q(θ) = Distribución aproximada de estados latentes
  P(θ|y) = Posterior verdadero dado observaciones
  P(y) = Evidencia del modelo
```

### 2.2 Simplificación para Agricultura

Para aplicación práctica, usamos la forma de error de predicción:

```
F = Σ π_i × [(obs_i - μ_i)² / (2σ²_i)]

Donde:
  F = Energía libre total (surprise)
  π_i = Peso de precisión para variable i
  obs_i = Observación actual
  μ_i = Predicción (valor esperado)
  σ²_i = Varianza estimada
```

### 2.3 Pesos de Precisión (π)

Los pesos reflejan la **importancia relativa** de cada variable:

| Variable | π (Precisión) | Justificación |
|----------|---------------|---------------|
| PE (Producción) | 3.0 | Meta principal |
| IPF (Plagas) | 2.5 | Daño costoso e irreversible |
| IAH (Agua) | 2.0 | Crítico y controlable |
| NPF (Nutrición) | 1.5 | Ajustable, efecto gradual |
| φ (Fenología) | 1.0 | Natural, menos controlable |
| ψ (Solar) | 0.8 | No controlable |
| GDD | 0.5 | Acumulativo |

### 2.4 Varianzas Estimadas (σ²)

| Variable | σ² | Interpretación |
|----------|-----|----------------|
| IAH | 0.04 | Desviaciones de ±0.2 son significativas |
| IPF | 0.04 | Alta sensibilidad |
| NPF | 0.06 | Tolerancia media |
| PE | 100.0 | Escala porcentual |
| Temp | 25.0 | ±5°C normal |

### 2.5 Clasificación de Niveles de Sorpresa

| Nivel | F Range | Interpretación | Acción |
|-------|---------|----------------|--------|
| EQUILIBRIUM | < 0.3 | Sistema óptimo | Mantener |
| LOW | 0.3-0.5 | Desviaciones menores | Monitorear |
| MODERATE | 0.5-0.8 | Atención necesaria | Planificar |
| HIGH | 0.8-1.2 | Acción requerida | Ejecutar |
| CRITICAL | > 1.2 | Intervención inmediata | Emergencia |

---

## 3. IMPLEMENTACIÓN AGRÍCOLA

### 3.1 Vector de Observaciones

```python
@dataclass
class ObservationVector:
    """Estado actual observado de la finca."""
    iah: float              # Índice Aptitud Hídrica (0-1)
    ipf: float              # Índice Presión Fitosanitaria (0-1)
    npf: float              # Índice Nutrición Planta Frutal (0-1)
    phi: float              # Factor fenológico φ (0-1)
    psi: float              # Factor solar ψ (0-1)
    temp: float             # Temperatura °C
    humidity: float         # Humedad relativa %
    gdd: float              # Growing Degree Days acumulados
    pe: float               # Production Efficiency %
    timestamp: datetime
```

### 3.2 Vector de Predicciones (Estado Esperado)

```python
@dataclass
class PredictionVector:
    """Estado esperado/óptimo de la finca."""
    iah_expected: float = 0.90      # Óptimo hídrico
    ipf_expected: float = 0.92      # Mínima presión plagas
    npf_expected: float = 0.85      # Balance nutricional
    phi_expected: float = 0.88      # Fenología ideal
    psi_expected: float = 0.85      # Condiciones solares
    temp_expected: float = 26.0     # Temperatura óptima
    humidity_expected: float = 65.0 # Humedad óptima
    gdd_expected: float = 1500.0    # GDD target
    pe_expected: float = 95.0       # Meta de producción
```

### 3.3 Cálculo de Energía Libre

```python
def calculate_free_energy(obs: ObservationVector, pred: PredictionVector) -> float:
    """
    F = Σ π_i × [(obs_i - μ_i)² / (2σ²_i)]
    """
    errors = {
        'iah': (obs.iah - pred.iah_expected, 0.04, 2.0),
        'ipf': (obs.ipf - pred.ipf_expected, 0.04, 2.5),
        'npf': (obs.npf - pred.npf_expected, 0.06, 1.5),
        'phi': (obs.phi - pred.phi_expected, 0.08, 1.0),
        'psi': (obs.psi - pred.psi_expected, 0.10, 0.8),
        'pe': ((obs.pe - pred.pe_expected)/100, 0.01, 3.0),
    }
    
    F = 0.0
    for var, (error, variance, precision) in errors.items():
        F += precision * (error ** 2) / (2 * variance)
    
    return F
```

### 3.4 Tipos de Error de Predicción

| Tipo | Variables | Acciones de Minimización |
|------|-----------|--------------------------|
| HYDRIC | IAH, humedad | Riego, drenaje |
| NUTRITIONAL | NPF | Fertilización, foliar |
| THERMAL | Temp, ψ | Sombreo, riego refrescante |
| PHYTOSANITARY | IPF | Control plagas/enfermedades |
| PHENOLOGICAL | φ, GDD | Poda, inducción |
| ECONOMIC | PE, costos | Optimización operativa |

---

## 4. ARQUITECTURA DEL AGENTE

### 4.1 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRISTON FREE ENERGY AGENT                        │
│                         (Layer 1 - C²AI)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐  │
│  │ SENSORES    │────►│ OBSERVACIÓN │────►│ CÁLCULO F           │  │
│  │ (Davis,     │     │ (Vector)    │     │ F = Σπ(obs-μ)²/2σ² │  │
│  │  PostgreSQL)│     └─────────────┘     └──────────┬──────────┘  │
│  └─────────────┘                                    │              │
│                                                     ▼              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐  │
│  │ MODELO      │◄────│ APRENDIZAJE │◄────│ CLASIFICACIÓN       │  │
│  │ PREDICTIVO  │     │ (Bayesian   │     │ (Surprise Level)    │  │
│  │ (μ, σ²)     │     │  Update)    │     └──────────┬──────────┘  │
│  └──────┬──────┘     └─────────────┘                │              │
│         │                                           ▼              │
│         │            ┌─────────────┐     ┌─────────────────────┐  │
│         └───────────►│ PREDICCIÓN  │────►│ ACCIONES DE         │  │
│                      │ (Expected   │     │ MINIMIZACIÓN        │  │
│                      │  State)     │     │ (Priorizado por F)  │  │
│                      └─────────────┘     └─────────────────────┘  │
│                                                     │              │
│                                                     ▼              │
│                                          ┌─────────────────────┐  │
│                                          │ OUTPUT a otros      │  │
│                                          │ agentes C²AI        │  │
│                                          │ • Watson (barriers) │  │
│                                          │ • Hoffman (trace)   │  │
│                                          │ • Penrose (collapse)│  │
│                                          └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Herramientas del Agente

1. **calculate_free_energy()**: Calcula F total del sistema
2. **predict_surprise_level()**: Clasifica nivel de sorpresa
3. **identify_dominant_error()**: Encuentra mayor contribuyente a F
4. **minimize_free_energy()**: Genera acciones priorizadas
5. **update_predictions()**: Actualiza modelo con nuevos datos

---

## 5. IMPLEMENTACIÓN PYTHON

### 5.1 Clase FristonFreeEnergyAgent

```python
"""
Friston Free Energy Agent - C²AI Framework Layer 1
====================================================
Implements Karl Friston's Free Energy Principle for agricultural systems.
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from enum import Enum
from datetime import datetime
import logging

logger = logging.getLogger("FristonFreeEnergyAgent")


class SurpriseLevel(str, Enum):
    EQUILIBRIUM = "equilibrium"      # F < 0.3
    LOW = "low"                       # F < 0.5
    MODERATE = "moderate"             # F < 0.8
    HIGH = "high"                     # F < 1.2
    CRITICAL = "critical"             # F >= 1.2


class PredictionErrorType(str, Enum):
    HYDRIC = "hydric"
    NUTRITIONAL = "nutritional"
    THERMAL = "thermal"
    PHYTOSANITARY = "phytosanitary"
    PHENOLOGICAL = "phenological"
    ECONOMIC = "economic"


@dataclass
class FreeEnergyResult:
    total_free_energy: float
    surprise_level: SurpriseLevel
    prediction_errors: Dict[PredictionErrorType, float]
    dominant_error: PredictionErrorType
    recommendations: List[Dict[str, Any]]
    minimization_actions: List[Dict[str, Any]]
    confidence: float


class FristonFreeEnergyAgent:
    """
    Implements Free Energy Principle for farm state optimization.
    
    Core Principle: The farm seeks to minimize prediction error
    (free energy) to maintain homeostasis.
    """
    
    PRECISION_WEIGHTS = {
        'iah': 2.0, 'ipf': 2.5, 'npf': 1.5, 'phi': 1.0,
        'psi': 0.8, 'temp': 1.2, 'humidity': 0.8, 'gdd': 0.5, 'pe': 3.0
    }
    
    VARIANCE_ESTIMATES = {
        'iah': 0.04, 'ipf': 0.04, 'npf': 0.06, 'phi': 0.08,
        'psi': 0.10, 'temp': 25.0, 'humidity': 100.0, 'gdd': 10000.0, 'pe': 100.0
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.prediction = PredictionVector()
        logger.info("FristonFreeEnergyAgent initialized")
    
    def calculate_free_energy(
        self,
        observation: ObservationVector,
        prediction: Optional[PredictionVector] = None
    ) -> FreeEnergyResult:
        """
        Tool 1: Calculate Free Energy from current observations.
        
        F = Σ π_i × [(obs_i - μ_i)² / (2σ²_i)]
        """
        pred = prediction or self.prediction
        
        # Calculate individual prediction errors
        errors = {}
        total_F = 0.0
        
        # Hydric error
        iah_error = (observation.iah - pred.iah_expected) ** 2
        iah_F = self.PRECISION_WEIGHTS['iah'] * iah_error / (2 * self.VARIANCE_ESTIMATES['iah'])
        errors[PredictionErrorType.HYDRIC] = iah_F
        total_F += iah_F
        
        # Phytosanitary error
        ipf_error = (observation.ipf - pred.ipf_expected) ** 2
        ipf_F = self.PRECISION_WEIGHTS['ipf'] * ipf_error / (2 * self.VARIANCE_ESTIMATES['ipf'])
        errors[PredictionErrorType.PHYTOSANITARY] = ipf_F
        total_F += ipf_F
        
        # Nutritional error
        npf_error = (observation.npf - pred.npf_expected) ** 2
        npf_F = self.PRECISION_WEIGHTS['npf'] * npf_error / (2 * self.VARIANCE_ESTIMATES['npf'])
        errors[PredictionErrorType.NUTRITIONAL] = npf_F
        total_F += npf_F
        
        # Phenological error
        phi_error = (observation.phi - pred.phi_expected) ** 2
        phi_F = self.PRECISION_WEIGHTS['phi'] * phi_error / (2 * self.VARIANCE_ESTIMATES['phi'])
        errors[PredictionErrorType.PHENOLOGICAL] = phi_F
        total_F += phi_F
        
        # Economic error (PE)
        pe_error = ((observation.pe - pred.pe_expected) / 100) ** 2
        pe_F = self.PRECISION_WEIGHTS['pe'] * pe_error / (2 * 0.01)
        errors[PredictionErrorType.ECONOMIC] = pe_F
        total_F += pe_F
        
        # Classify surprise level
        if total_F < 0.3:
            surprise = SurpriseLevel.EQUILIBRIUM
        elif total_F < 0.5:
            surprise = SurpriseLevel.LOW
        elif total_F < 0.8:
            surprise = SurpriseLevel.MODERATE
        elif total_F < 1.2:
            surprise = SurpriseLevel.HIGH
        else:
            surprise = SurpriseLevel.CRITICAL
        
        # Find dominant error
        dominant = max(errors, key=errors.get)
        
        # Generate minimization actions
        actions = self._generate_minimization_actions(errors, observation)
        
        return FreeEnergyResult(
            total_free_energy=total_F,
            surprise_level=surprise,
            prediction_errors=errors,
            dominant_error=dominant,
            recommendations=actions[:3],
            minimization_actions=actions,
            confidence=max(0.0, 1.0 - total_F/2.0)
        )
    
    def _generate_minimization_actions(
        self,
        errors: Dict[PredictionErrorType, float],
        obs: ObservationVector
    ) -> List[Dict[str, Any]]:
        """Generate prioritized actions to minimize free energy."""
        actions = []
        
        # Sort errors by magnitude
        sorted_errors = sorted(errors.items(), key=lambda x: x[1], reverse=True)
        
        for error_type, magnitude in sorted_errors:
            if magnitude < 0.1:
                continue
                
            if error_type == PredictionErrorType.HYDRIC:
                deficit = 0.90 - obs.iah
                actions.append({
                    'type': 'irrigation',
                    'priority': 'high' if magnitude > 0.5 else 'medium',
                    'action': f'Irrigar {int(deficit * 100)} mm',
                    'expected_F_reduction': magnitude * 0.8,
                    'cost_mxn': int(deficit * 100 * 150),
                    'urgency_hours': 12 if obs.iah < 0.6 else 24
                })
            
            elif error_type == PredictionErrorType.PHYTOSANITARY:
                actions.append({
                    'type': 'pest_control',
                    'priority': 'critical' if magnitude > 0.8 else 'high',
                    'action': 'Aplicar control fitosanitario según IPF',
                    'expected_F_reduction': magnitude * 0.7,
                    'cost_mxn': 15000,
                    'urgency_hours': 24
                })
            
            elif error_type == PredictionErrorType.NUTRITIONAL:
                actions.append({
                    'type': 'fertilization',
                    'priority': 'medium',
                    'action': 'Ajustar fertirrigación según NPF',
                    'expected_F_reduction': magnitude * 0.6,
                    'cost_mxn': 8000,
                    'urgency_hours': 72
                })
        
        return actions
```

---

## 6. INTEGRACIÓN CON C²AI

### 6.1 Rol en la Arquitectura de 5 Capas

```
┌─────────────────────────────────────────────────────────────────────┐
│                        C²AI FRAMEWORK                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║ LAYER 1: FRISTON FREE ENERGY (Homeostasis)                    ║ │
│  ║ • Detecta desviaciones del estado óptimo                      ║ │
│  ║ • Calcula "sorpresa" del sistema                              ║ │
│  ║ • Prioriza acciones por impacto en F                          ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LAYER 2: LEVIN (Detección temprana → aumenta F)               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LAYER 3: WATSON (Optimiza trayectoria para minimizar F)       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LAYER 4: HOFFMAN (Cada agente percibe F diferente)            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LAYER 5: PENROSE (Colapso de decisión cuando F justifica)     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 API Endpoints

```python
# GET /api/friston/{section}/free-energy
{
    "section": "S1",
    "total_F": 0.67,
    "surprise_level": "moderate",
    "dominant_error": "hydric",
    "prediction_errors": {
        "hydric": 0.35,
        "phytosanitary": 0.18,
        "nutritional": 0.09,
        "phenological": 0.05
    },
    "top_actions": [
        {"type": "irrigation", "action": "Irrigar 18mm", "priority": "high"}
    ]
}

# GET /api/friston/{section}/prediction-model
# Returns current μ and σ² for all variables

# POST /api/friston/update-prediction
# Updates expected values based on new targets
```

---

## 7. APLICACIÓN A SISTEMAS BIOLÓGICOS AVANZADOS

### 7.1 El Principio Universal

El Free Energy Principle no es exclusivo de sistemas neurales. Aplica a:

| Sistema | Estado Esperado | Observaciones | Minimización |
|---------|-----------------|---------------|--------------|
| **Célula** | Homeostasis | Metabolitos | Regulación génica |
| **Organismo** | Salud | Sensores | Comportamiento |
| **Finca** | Producción óptima | Sensores IoT | Operaciones |
| **Ecosistema** | Equilibrio | Biodiversidad | Conservación |
| **Sociedad** | Bienestar | Indicadores | Políticas |

### 7.2 Implicaciones para Consciencia

Friston propone que la consciencia emerge de sistemas que:

1. **Modelan** su entorno y a sí mismos
2. **Predicen** estados futuros
3. **Actúan** para confirmar predicciones
4. **Aprenden** de errores de predicción

Esto sugiere un espectro de consciencia basado en la complejidad del modelo predictivo.

### 7.3 Aplicación a Humanos

En medicina, el FEP se aplica a:

- **Psiquiatría**: Trastornos como desequilibrios en precisión (π)
- **Neurología**: Predicción de estados cerebrales
- **Interoception**: Consciencia del estado corporal

---

## 8. REFERENCIAS CIENTÍFICAS

### 8.1 Papers Fundamentales de Friston

1. Friston, K. (2010). "The free-energy principle: a unified brain theory?" *Nature Reviews Neuroscience*, 11(2), 127-138.

2. Friston, K. (2013). "Life as we know it." *Journal of the Royal Society Interface*, 10(86), 20130475.

3. Friston, K., FitzGerald, T., Rigoli, F., Schwartenbeck, P., & Pezzulo, G. (2017). "Active inference: a process theory." *Neural Computation*, 29(1), 1-49.

### 8.2 Aplicaciones

4. Parr, T., & Friston, K.J. (2019). "Generalised free energy and active inference." *Biological Cybernetics*, 113(5-6), 495-513.

5. Ramstead, M.J., Badcock, P.B., & Friston, K.J. (2018). "Answering Schrödinger's question: A free-energy formulation." *Physics of Life Reviews*, 24, 1-16.

### 8.3 Conexiones con Agricultura

6. Cadena, J.M. (2026). "Free Energy Principle Applied to Agricultural Systems: The CitrusMax AI Framework." *Working Paper*.

---

**Documento Consolidado PhD**
**© 2026 Dr. José Manuel Cadena Ortiz de Montellano**
**Finca Citrícola La Luz - Las Choapas, Veracruz, México**
