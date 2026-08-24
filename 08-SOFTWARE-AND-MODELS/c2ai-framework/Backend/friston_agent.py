"""
Friston Free Energy Agent - C²AI Framework Layer 1
====================================================
Implements Karl Friston's Free Energy Principle for agricultural systems.
Minimizes prediction error and surprise in the farm's state.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Mathematical Foundation:
F = Σ [(obs - μ_pred)² / (2σ²)] + const
where F is free energy (surprise), obs is observation, μ_pred is prediction
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("FristonFreeEnergyAgent")


class SurpriseLevel(str, Enum):
    """Levels of surprise/free energy in the system."""
    EQUILIBRIUM = "equilibrium"      # F < 0.3 - System in optimal state
    LOW = "low"                       # F < 0.5 - Minor deviations
    MODERATE = "moderate"             # F < 0.8 - Attention needed
    HIGH = "high"                     # F < 1.2 - Action required
    CRITICAL = "critical"             # F >= 1.2 - Immediate intervention


class PredictionErrorType(str, Enum):
    """Types of prediction errors detected."""
    HYDRIC = "hydric"
    NUTRITIONAL = "nutritional"
    THERMAL = "thermal"
    PHYTOSANITARY = "phytosanitary"
    PHENOLOGICAL = "phenological"
    ECONOMIC = "economic"


@dataclass
class ObservationVector:
    """Current observations from the farm."""
    iah: float              # Índice Aptitud Hídrica (0-1)
    ipf: float              # Índice Presión Fitosanitaria (0-1)
    npf: float              # Índice Nutrición Planta Frutal (0-1)
    phi: float              # Factor fenológico (0-1)
    psi: float              # Factor solar/stress (0-1)
    temp: float             # Temperature °C
    humidity: float         # Humidity %
    gdd: float              # Growing Degree Days
    pe: float               # Production Efficiency %
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class PredictionVector:
    """Expected/predicted state of the farm."""
    iah_expected: float = 0.90
    ipf_expected: float = 0.92
    npf_expected: float = 0.85
    phi_expected: float = 0.88
    psi_expected: float = 0.85
    temp_expected: float = 26.0
    humidity_expected: float = 65.0
    gdd_expected: float = 1500.0
    pe_expected: float = 95.0


@dataclass
class FreeEnergyResult:
    """Result of free energy calculation."""
    total_free_energy: float
    surprise_level: SurpriseLevel
    prediction_errors: Dict[PredictionErrorType, float]
    dominant_error: PredictionErrorType
    recommendations: List[Dict[str, Any]]
    minimization_actions: List[Dict[str, Any]]
    confidence: float
    timestamp: datetime = field(default_factory=datetime.now)


class FristonFreeEnergyAgent:
    """
    Implements Free Energy Principle for farm state optimization.
    
    Core Principle: The farm (as a living system) seeks to minimize
    prediction error (free energy) to maintain homeostasis.
    
    Tools:
    1. calculate_free_energy() - Compute F from observations
    2. predict_surprise_level() - Classify surprise intensity
    3. minimize_free_energy() - Generate actions to reduce F
    """
    
    # Precision weights (inverse variance) for each variable
    PRECISION_WEIGHTS = {
        'iah': 2.0,      # High precision - irrigation is critical
        'ipf': 2.5,      # Highest precision - pest damage is costly
        'npf': 1.5,      # Medium precision - nutrition adjustable
        'phi': 1.0,      # Lower precision - phenology is natural
        'psi': 0.8,      # Lower precision - solar is uncontrollable
        'temp': 1.2,     # Medium precision
        'humidity': 0.8, # Lower precision
        'gdd': 0.5,      # Low precision - accumulative
        'pe': 3.0,       # Highest - production efficiency is the goal
    }
    
    # Variance estimates for each variable
    VARIANCE_ESTIMATES = {
        'iah': 0.04,      # σ² for IAH
        'ipf': 0.04,      # σ² for IPF
        'npf': 0.06,      # σ² for NPF
        'phi': 0.08,      # σ² for PHI
        'psi': 0.10,      # σ² for PSI
        'temp': 25.0,     # σ² for temp (°C²)
        'humidity': 100.0,# σ² for humidity (%²)
        'gdd': 10000.0,   # σ² for GDD
        'pe': 100.0,      # σ² for PE
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.prediction = PredictionVector()
        logger.info("FristonFreeEnergyAgent initialized")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    def calculate_free_energy(
        self,
        observation: ObservationVector,
        prediction: Optional[PredictionVector] = None
    ) -> FreeEnergyResult:
        """
        Tool 1: Calculate Free Energy from current observations.
        
        F = Σ π_i × [(obs_i - μ_i)² / (2σ²_i)]
        
        where π_i is precision (inverse variance weight)
        """
        pred = prediction or self.prediction
        
        # Calculate prediction errors for each variable
        errors = {}
        weighted_errors = {}
        
        # Hydric error
        iah_error = (observation.iah - pred.iah_expected) ** 2
        errors[PredictionErrorType.HYDRIC] = iah_error / (2 * self.VARIANCE_ESTIMATES['iah'])
        weighted_errors['iah'] = self.PRECISION_WEIGHTS['iah'] * errors[PredictionErrorType.HYDRIC]
        
        # Phytosanitary error
        ipf_error = (observation.ipf - pred.ipf_expected) ** 2
        errors[PredictionErrorType.PHYTOSANITARY] = ipf_error / (2 * self.VARIANCE_ESTIMATES['ipf'])
        weighted_errors['ipf'] = self.PRECISION_WEIGHTS['ipf'] * errors[PredictionErrorType.PHYTOSANITARY]
        
        # Nutritional error
        npf_error = (observation.npf - pred.npf_expected) ** 2
        errors[PredictionErrorType.NUTRITIONAL] = npf_error / (2 * self.VARIANCE_ESTIMATES['npf'])
        weighted_errors['npf'] = self.PRECISION_WEIGHTS['npf'] * errors[PredictionErrorType.NUTRITIONAL]
        
        # Phenological error
        phi_error = (observation.phi - pred.phi_expected) ** 2
        errors[PredictionErrorType.PHENOLOGICAL] = phi_error / (2 * self.VARIANCE_ESTIMATES['phi'])
        weighted_errors['phi'] = self.PRECISION_WEIGHTS['phi'] * errors[PredictionErrorType.PHENOLOGICAL]
        
        # Thermal error (combined temp + humidity)
        temp_error = (observation.temp - pred.temp_expected) ** 2
        hum_error = (observation.humidity - pred.humidity_expected) ** 2
        errors[PredictionErrorType.THERMAL] = (
            temp_error / (2 * self.VARIANCE_ESTIMATES['temp']) +
            hum_error / (2 * self.VARIANCE_ESTIMATES['humidity'])
        ) / 2
        weighted_errors['thermal'] = (
            self.PRECISION_WEIGHTS['temp'] * temp_error / (2 * self.VARIANCE_ESTIMATES['temp']) +
            self.PRECISION_WEIGHTS['humidity'] * hum_error / (2 * self.VARIANCE_ESTIMATES['humidity'])
        ) / 2
        
        # Economic error (PE)
        pe_error = (observation.pe - pred.pe_expected) ** 2
        errors[PredictionErrorType.ECONOMIC] = pe_error / (2 * self.VARIANCE_ESTIMATES['pe'])
        weighted_errors['pe'] = self.PRECISION_WEIGHTS['pe'] * errors[PredictionErrorType.ECONOMIC]
        
        # Total Free Energy
        total_F = sum(weighted_errors.values())
        
        # Determine surprise level
        surprise = self._classify_surprise(total_F)
        
        # Find dominant error
        dominant = max(errors.items(), key=lambda x: x[1])[0]
        
        # Generate recommendations
        recommendations = self._generate_recommendations(errors, observation, pred)
        
        # Generate minimization actions
        actions = self._generate_minimization_actions(errors, observation, total_F)
        
        # Calculate confidence based on data freshness
        confidence = self._calculate_confidence(observation)
        
        return FreeEnergyResult(
            total_free_energy=round(total_F, 4),
            surprise_level=surprise,
            prediction_errors={k: round(v, 4) for k, v in errors.items()},
            dominant_error=dominant,
            recommendations=recommendations,
            minimization_actions=actions,
            confidence=confidence
        )
    
    def predict_surprise_level(
        self,
        section: str,
        horizon_days: int = 7
    ) -> Dict[str, Any]:
        """
        Tool 2: Predict future surprise levels for a section.
        
        Uses historical patterns to forecast where free energy
        will likely increase (requiring intervention).
        """
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get current state
                cur.execute("""
                    SELECT 
                        COALESCE(AVG(temp_media_c), 28) as temp,
                        COALESCE(AVG(hr_promedio_pct), 65) as humidity,
                        COALESCE(AVG(COALESCE(plaga_total_trips, 0) + COALESCE(plaga_total_diaforina, 0)), 0) as pest_level
                    FROM public.rv21_features
                    WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
                """)
                current = cur.fetchone()
                
                # Get biofix data for phenology
                cur.execute("""
                    SELECT gdd_accumulated, current_phase
                    FROM biofix.biofix_status
                    WHERE section_id = %s
                    ORDER BY updated_at DESC LIMIT 1
                """, (section,))
                biofix = cur.fetchone()
                
        except Exception as e:
            logger.error(f"Error fetching data: {e}")
            current = {'temp': 28, 'humidity': 65, 'pest_level': 0}
            biofix = {'gdd_accumulated': 1500, 'current_phase': 'FEN-05'}
        
        # Calculate current indices
        pest_level = float(current.get('pest_level', 0)) if current else 0
        ipf = min(0.95, max(0.05, 1 - (pest_level / 10)))
        iah = 0.85  # Would need irrigation data
        npf = 0.78  # Would need nutrition data
        
        # Create observation
        obs = ObservationVector(
            iah=iah,
            ipf=ipf,
            npf=npf,
            phi=0.85,
            psi=0.80,
            temp=float(current.get('temp', 28)) if current else 28,
            humidity=float(current.get('humidity', 65)) if current else 65,
            gdd=float(biofix.get('gdd_accumulated', 1500)) if biofix else 1500,
            pe=75.0
        )
        
        # Calculate current free energy
        result = self.calculate_free_energy(obs)
        
        # Predict future states
        predictions = []
        for day in [1, 3, 7, 14, 30]:
            if day > horizon_days:
                break
            
            # Simple decay model for prediction
            decay_factor = 1 + (0.05 * day)  # F increases over time without action
            predicted_F = result.total_free_energy * decay_factor
            
            predictions.append({
                'day': day,
                'predicted_F': round(predicted_F, 4),
                'surprise_level': self._classify_surprise(predicted_F).value,
                'action_urgency': 'high' if predicted_F > 1.0 else 'medium' if predicted_F > 0.5 else 'low'
            })
        
        return {
            'section': section,
            'current_F': result.total_free_energy,
            'current_surprise': result.surprise_level.value,
            'dominant_error': result.dominant_error.value,
            'predictions': predictions,
            'recommendation': result.recommendations[0] if result.recommendations else None,
            'timestamp': datetime.now().isoformat()
        }
    
    def minimize_free_energy(
        self,
        observation: ObservationVector,
        budget_mxn: float = 50000.0,
        priority_weight: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Tool 3: Generate optimal actions to minimize free energy.
        
        Active Inference: The system takes actions to bring
        observations closer to predictions (reduce surprise).
        """
        result = self.calculate_free_energy(observation)
        
        # Default priority weights (can be customized)
        weights = priority_weight or {
            'vep_impact': 0.4,
            'cost_efficiency': 0.3,
            'urgency': 0.2,
            'feasibility': 0.1
        }
        
        actions = []
        remaining_budget = budget_mxn
        
        # Sort errors by magnitude
        sorted_errors = sorted(
            result.prediction_errors.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        for error_type, error_value in sorted_errors:
            if error_value < 0.1:  # Skip small errors
                continue
            
            action = self._generate_action_for_error(
                error_type, error_value, observation, remaining_budget, weights
            )
            
            if action and action['cost_mxn'] <= remaining_budget:
                actions.append(action)
                remaining_budget -= action['cost_mxn']
        
        # Calculate expected F reduction
        total_reduction = sum(a.get('f_reduction', 0) for a in actions)
        new_F = max(0, result.total_free_energy - total_reduction)
        
        return {
            'current_free_energy': result.total_free_energy,
            'projected_free_energy': round(new_F, 4),
            'f_reduction': round(total_reduction, 4),
            'surprise_before': result.surprise_level.value,
            'surprise_after': self._classify_surprise(new_F).value,
            'actions': actions,
            'total_cost_mxn': round(budget_mxn - remaining_budget, 2),
            'remaining_budget_mxn': round(remaining_budget, 2),
            'expected_vep_gain': sum(a.get('vep_impact', 0) for a in actions),
            'confidence': result.confidence,
            'timestamp': datetime.now().isoformat()
        }
    
    def _classify_surprise(self, F: float) -> SurpriseLevel:
        """Classify free energy into surprise levels."""
        if F < 0.3:
            return SurpriseLevel.EQUILIBRIUM
        elif F < 0.5:
            return SurpriseLevel.LOW
        elif F < 0.8:
            return SurpriseLevel.MODERATE
        elif F < 1.2:
            return SurpriseLevel.HIGH
        else:
            return SurpriseLevel.CRITICAL
    
    def _generate_recommendations(
        self,
        errors: Dict[PredictionErrorType, float],
        obs: ObservationVector,
        pred: PredictionVector
    ) -> List[Dict[str, Any]]:
        """Generate recommendations based on prediction errors."""
        recs = []
        
        if errors.get(PredictionErrorType.PHYTOSANITARY, 0) > 0.1:
            gap = pred.ipf_expected - obs.ipf
            recs.append({
                'type': 'phytosanitary',
                'priority': 1 if gap > 0.15 else 2,
                'action': f'Reducir presión plagas (GAP: {gap:.2f})',
                'expected_improvement': round(gap * 0.7, 2),
                'urgency': 'immediate' if gap > 0.15 else 'planned'
            })
        
        if errors.get(PredictionErrorType.HYDRIC, 0) > 0.1:
            gap = pred.iah_expected - obs.iah
            recs.append({
                'type': 'hydric',
                'priority': 2,
                'action': f'Optimizar balance hídrico (GAP: {gap:.2f})',
                'expected_improvement': round(gap * 0.8, 2),
                'urgency': 'this_week'
            })
        
        if errors.get(PredictionErrorType.NUTRITIONAL, 0) > 0.1:
            gap = pred.npf_expected - obs.npf
            recs.append({
                'type': 'nutritional',
                'priority': 3,
                'action': f'Ajustar programa nutricional (GAP: {gap:.2f})',
                'expected_improvement': round(gap * 0.6, 2),
                'urgency': 'this_week'
            })
        
        if errors.get(PredictionErrorType.THERMAL, 0) > 0.15:
            recs.append({
                'type': 'thermal',
                'priority': 4,
                'action': 'Monitorear estrés térmico',
                'expected_improvement': 0.05,
                'urgency': 'monitoring'
            })
        
        return sorted(recs, key=lambda x: x['priority'])
    
    def _generate_minimization_actions(
        self,
        errors: Dict[PredictionErrorType, float],
        obs: ObservationVector,
        total_F: float
    ) -> List[Dict[str, Any]]:
        """Generate specific actions to minimize F."""
        actions = []
        
        if errors.get(PredictionErrorType.PHYTOSANITARY, 0) > 0.15:
            actions.append({
                'action': 'Aplicación fitosanitaria preventiva',
                'agent': 'HealthAgent',
                'f_reduction': 0.25,
                'cost_estimate_mxn': 15000,
                'timing': 'within_48h',
                'products': ['Spinosad', 'Spirotetramat']
            })
        
        if errors.get(PredictionErrorType.HYDRIC, 0) > 0.12:
            actions.append({
                'action': 'Ajuste régimen de riego',
                'agent': 'IrrigationAgent',
                'f_reduction': 0.20,
                'cost_estimate_mxn': 5000,
                'timing': 'today',
                'parameters': {'duration_increase': '15%'}
            })
        
        if errors.get(PredictionErrorType.NUTRITIONAL, 0) > 0.10:
            actions.append({
                'action': 'Aplicación foliar correctiva',
                'agent': 'NutritionAgent',
                'f_reduction': 0.15,
                'cost_estimate_mxn': 8000,
                'timing': 'this_week',
                'nutrients': ['K', 'Mg', 'Zn']
            })
        
        return actions
    
    def _generate_action_for_error(
        self,
        error_type: PredictionErrorType,
        error_value: float,
        obs: ObservationVector,
        budget: float,
        weights: Dict[str, float]
    ) -> Optional[Dict[str, Any]]:
        """Generate a specific action for a given error type."""
        
        action_templates = {
            PredictionErrorType.PHYTOSANITARY: {
                'name': 'Control fitosanitario',
                'base_cost': 12000,
                'f_reduction_factor': 0.7,
                'vep_impact_per_point': 150000,
                'timing': 'within_48h'
            },
            PredictionErrorType.HYDRIC: {
                'name': 'Optimización hídrica',
                'base_cost': 4000,
                'f_reduction_factor': 0.8,
                'vep_impact_per_point': 100000,
                'timing': 'today'
            },
            PredictionErrorType.NUTRITIONAL: {
                'name': 'Corrección nutricional',
                'base_cost': 8000,
                'f_reduction_factor': 0.6,
                'vep_impact_per_point': 80000,
                'timing': 'this_week'
            },
            PredictionErrorType.THERMAL: {
                'name': 'Mitigación térmica',
                'base_cost': 3000,
                'f_reduction_factor': 0.3,
                'vep_impact_per_point': 40000,
                'timing': 'if_needed'
            },
            PredictionErrorType.PHENOLOGICAL: {
                'name': 'Soporte fenológico',
                'base_cost': 6000,
                'f_reduction_factor': 0.4,
                'vep_impact_per_point': 60000,
                'timing': 'planned'
            },
            PredictionErrorType.ECONOMIC: {
                'name': 'Optimización económica',
                'base_cost': 2000,
                'f_reduction_factor': 0.5,
                'vep_impact_per_point': 200000,
                'timing': 'strategic'
            }
        }
        
        template = action_templates.get(error_type)
        if not template:
            return None
        
        cost = template['base_cost'] * (1 + error_value)
        if cost > budget:
            return None
        
        f_reduction = error_value * template['f_reduction_factor']
        vep_impact = error_value * template['vep_impact_per_point']
        
        return {
            'error_type': error_type.value,
            'action': template['name'],
            'cost_mxn': round(cost, 2),
            'f_reduction': round(f_reduction, 4),
            'vep_impact': round(vep_impact, 2),
            'timing': template['timing'],
            'priority_score': round(
                weights['vep_impact'] * (vep_impact / 100000) +
                weights['cost_efficiency'] * (vep_impact / max(cost, 1)) / 10 +
                weights['urgency'] * error_value +
                weights['feasibility'] * 0.8,
                3
            )
        }
    
    def _calculate_confidence(self, obs: ObservationVector) -> float:
        """Calculate confidence based on data freshness and completeness."""
        now = datetime.now()
        age_hours = (now - obs.timestamp).total_seconds() / 3600
        
        # Decay confidence with age
        freshness = max(0.5, 1.0 - (age_hours / 24))
        
        # Check data completeness
        completeness = 1.0
        if obs.iah <= 0:
            completeness -= 0.1
        if obs.ipf <= 0:
            completeness -= 0.1
        if obs.npf <= 0:
            completeness -= 0.1
        
        return round(freshness * completeness, 3)
    
    def close(self):
        if self.conn:
            self.conn.close()
