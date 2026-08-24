"""
Levin Layer v2.0 - Bioelectric Goal Alignment with Pruning Integration
Based on Michael Levin's bioelectric cognition framework

This layer models how plants encode goals in bioelectric patterns and how
pruning (as mechanical stress) can reprogram these patterns.
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from enum import Enum
import json
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
import math

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LevinLayer")


class PlantGoal(str, Enum):
    """Natural goals of the citrus plant"""
    SURVIVAL = "survival"
    GROWTH = "vegetative_growth"
    FLOWERING = "flowering"
    FRUIT_SET = "fruit_set"
    FRUIT_DEVELOPMENT = "fruit_development"
    FRUIT_MATURATION = "fruit_maturation"
    SEED_DISPERSAL = "seed_dispersal"
    DORMANCY = "dormancy"


@dataclass
class BioelectricPattern:
    """Bioelectric pattern representing plant's internal goal state"""
    goal: PlantGoal
    target_gdd: float
    optimal_water: float  # Soil moisture %
    optimal_nutrients: Dict[str, float]  # N, P, K targets
    energy_allocation: Dict[str, float]  # roots, shoots, fruits, reserves
    hormone_balance: Dict[str, float]  # auxin, cytokinin, gibberellin, ethylene
    stress_tolerance: float  # 0-1
    # NEW: Pruning sensitivity for this goal
    pruning_sensitivity: float = 0.5  # How much pruning affects this goal (0-1)
    pruning_benefit: float = 0.0  # Positive if pruning helps this goal


@dataclass
class PruningEvent:
    """Represents a pruning event"""
    date: datetime
    intensity: float  # PI% (0-100)
    pruning_type: str  # formacion, mantenimiento, rehabilitacion
    section: str
    lai_before: float = 0.0
    lai_after: float = 0.0


@dataclass
class MorphogenesisState:
    """State of morphogenetic fields post-pruning"""
    perturbation_index: float  # 0-1, how perturbed the field is
    regeneration_potential: float  # 0-1, capacity to regenerate
    meristem_activation_prob: float  # 0-1, probability of bud activation
    lai_recovery_rate: float  # LAI units per week
    field_state: str  # stable, perturbed, reprogramming
    vmem_gradient: float  # mV, synthetic voltage gradient
    days_since_pruning: int
    wound_signal_intensity: float  # 0-1


@dataclass
class AlignmentResult:
    """Result of goal alignment calculation"""
    current_goal: PlantGoal
    alignment_score: float  # 0-1, how well current state matches goal
    goal_progress: float  # 0-1, progress toward goal completion
    supporting_factors: List[str]
    blocking_factors: List[str]
    recommended_support: List[Dict[str, Any]]
    next_goal: Optional[PlantGoal]
    transition_readiness: float
    # NEW: Pruning-related fields
    pruning_impact: float  # -1 to +1, negative=blocking, positive=supporting
    goal_shift_probability: float  # 0-1, probability of goal change
    optimal_pruning_window: bool  # True if now is good time to prune
    timestamp: datetime = field(default_factory=datetime.now)


class LevinLayer:
    """
    Bioelectric Goal Alignment Layer v2.0 with Pruning Integration
    
    Core principle: Work WITH the plant's natural goals, not against them.
    The plant knows what it wants to do (encoded in bioelectric patterns).
    Our job is to recognize this and provide optimal support.
    
    NEW in v2.0: Pruning as bioelectric perturbation
    Based on Michael Levin's work on morphogenetic fields and regeneration.
    """
    
    # Phenology to Goal mapping
    PHENOLOGY_GOALS = {
        'FEN-01': PlantGoal.DORMANCY,
        'FEN-02': PlantGoal.GROWTH,
        'FEN-03': PlantGoal.FLOWERING,
        'FEN-04': PlantGoal.FRUIT_SET,
        'FEN-05': PlantGoal.FRUIT_DEVELOPMENT,
        'FEN-06': PlantGoal.FRUIT_MATURATION,
        'FEN-07': PlantGoal.SEED_DISPERSAL,
    }
    
    # Pruning sensitivity by phenology (from CitrusMax Trim v2.0)
    PRUNING_PHENOLOGY_SENSITIVITY = {
        'FEN-01': {'sensitivity': 0.3, 'benefit': 0.15, 'recommendation': 'OPTIMAL'},
        'FEN-02': {'sensitivity': 0.8, 'benefit': 0.35, 'recommendation': 'EXCELLENT'},
        'FEN-03': {'sensitivity': 0.9, 'benefit': -0.25, 'recommendation': 'AVOID'},
        'FEN-04': {'sensitivity': 1.0, 'benefit': -0.40, 'recommendation': 'PROHIBITED'},
        'FEN-05': {'sensitivity': 0.7, 'benefit': -0.20, 'recommendation': 'AVOID'},
        'FEN-06': {'sensitivity': 0.4, 'benefit': -0.05, 'recommendation': 'CAUTION'},
        'FEN-07': {'sensitivity': 0.2, 'benefit': 0.08, 'recommendation': 'RECOMMENDED'},
    }
    
    # Bioelectric patterns for each goal (updated with pruning parameters)
    GOAL_PATTERNS = {
        PlantGoal.DORMANCY: BioelectricPattern(
            goal=PlantGoal.DORMANCY,
            target_gdd=0,
            optimal_water=0.35,
            optimal_nutrients={'N': 80, 'P': 30, 'K': 120},
            energy_allocation={'roots': 0.3, 'shoots': 0.1, 'fruits': 0.0, 'reserves': 0.6},
            hormone_balance={'auxin': 0.3, 'cytokinin': 0.2, 'gibberellin': 0.1, 'ethylene': 0.1},
            stress_tolerance=0.9,
            pruning_sensitivity=0.3,
            pruning_benefit=0.15
        ),
        PlantGoal.GROWTH: BioelectricPattern(
            goal=PlantGoal.GROWTH,
            target_gdd=200,
            optimal_water=0.45,
            optimal_nutrients={'N': 180, 'P': 45, 'K': 150},
            energy_allocation={'roots': 0.25, 'shoots': 0.55, 'fruits': 0.0, 'reserves': 0.2},
            hormone_balance={'auxin': 0.7, 'cytokinin': 0.6, 'gibberellin': 0.5, 'ethylene': 0.1},
            stress_tolerance=0.6,
            pruning_sensitivity=0.8,
            pruning_benefit=0.35
        ),
        PlantGoal.FLOWERING: BioelectricPattern(
            goal=PlantGoal.FLOWERING,
            target_gdd=350,
            optimal_water=0.50,
            optimal_nutrients={'N': 140, 'P': 60, 'K': 180},
            energy_allocation={'roots': 0.15, 'shoots': 0.35, 'fruits': 0.3, 'reserves': 0.2},
            hormone_balance={'auxin': 0.4, 'cytokinin': 0.5, 'gibberellin': 0.8, 'ethylene': 0.2},
            stress_tolerance=0.5,
            pruning_sensitivity=0.9,
            pruning_benefit=-0.25
        ),
        PlantGoal.FRUIT_SET: BioelectricPattern(
            goal=PlantGoal.FRUIT_SET,
            target_gdd=450,
            optimal_water=0.48,
            optimal_nutrients={'N': 150, 'P': 55, 'K': 200},
            energy_allocation={'roots': 0.15, 'shoots': 0.2, 'fruits': 0.5, 'reserves': 0.15},
            hormone_balance={'auxin': 0.6, 'cytokinin': 0.4, 'gibberellin': 0.3, 'ethylene': 0.15},
            stress_tolerance=0.4,
            pruning_sensitivity=1.0,
            pruning_benefit=-0.40
        ),
        PlantGoal.FRUIT_DEVELOPMENT: BioelectricPattern(
            goal=PlantGoal.FRUIT_DEVELOPMENT,
            target_gdd=830,
            optimal_water=0.45,
            optimal_nutrients={'N': 130, 'P': 50, 'K': 220},
            energy_allocation={'roots': 0.1, 'shoots': 0.15, 'fruits': 0.65, 'reserves': 0.1},
            hormone_balance={'auxin': 0.5, 'cytokinin': 0.3, 'gibberellin': 0.2, 'ethylene': 0.1},
            stress_tolerance=0.5,
            pruning_sensitivity=0.7,
            pruning_benefit=-0.20
        ),
        PlantGoal.FRUIT_MATURATION: BioelectricPattern(
            goal=PlantGoal.FRUIT_MATURATION,
            target_gdd=950,
            optimal_water=0.42,
            optimal_nutrients={'N': 100, 'P': 40, 'K': 200},
            energy_allocation={'roots': 0.1, 'shoots': 0.1, 'fruits': 0.6, 'reserves': 0.2},
            hormone_balance={'auxin': 0.3, 'cytokinin': 0.2, 'gibberellin': 0.1, 'ethylene': 0.7},
            stress_tolerance=0.6,
            pruning_sensitivity=0.4,
            pruning_benefit=-0.05
        ),
        PlantGoal.SEED_DISPERSAL: BioelectricPattern(
            goal=PlantGoal.SEED_DISPERSAL,
            target_gdd=1200,
            optimal_water=0.40,
            optimal_nutrients={'N': 90, 'P': 35, 'K': 150},
            energy_allocation={'roots': 0.15, 'shoots': 0.1, 'fruits': 0.45, 'reserves': 0.3},
            hormone_balance={'auxin': 0.2, 'cytokinin': 0.1, 'gibberellin': 0.1, 'ethylene': 0.9},
            stress_tolerance=0.7,
            pruning_sensitivity=0.2,
            pruning_benefit=0.08
        ),
    }
    
    # Bioelectric voltage patterns (synthetic, based on Levin's research)
    BIOELECTRIC_PATTERNS = {
        'meristem': {'baseline_vmem': -45, 'range': (-60, -30), 'frequency': (8, 12)},
        'root_tip': {'baseline_vmem': -55, 'range': (-70, -40), 'frequency': (4, 8)},
        'fruit_zone': {'baseline_vmem': -35, 'range': (-50, -20), 'frequency': (6, 10)},
        'wound_site': {'baseline_vmem': -20, 'range': (-40, 0), 'frequency': (15, 25)},
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self._connect_db()
        logger.info("LevinLayer v2.0 initialized with pruning integration")
    
    def _connect_db(self):
        try:
            self.conn = psycopg2.connect(
                host=self.pg_config.get('host', 'localhost'),
                database=self.pg_config.get('database', 'citrusmax_biofix'),
                user=self.pg_config.get('user', 'postgres'),
                password=self.pg_config.get('password', ''),
                cursor_factory=RealDictCursor
            )
            logger.info(f"Connected to PostgreSQL")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def _ensure_connection(self):
        if self.conn is None or self.conn.closed:
            self._connect_db()
    
    # =========================================================================
    # PRUNING IMPACT CALCULATIONS (NEW in v2.0)
    # =========================================================================
    
    def calculate_pruning_perturbation_index(
        self,
        pruning_intensity: float,
        days_since_pruning: int,
        phenology_stage: str
    ) -> float:
        """
        Calculate Pruning Perturbation Index (PPI)
        Based on Levin's concept of bioelectric field perturbation
        
        PPI = PI × (1 - days/90) × phenology_sensitivity
        """
        if days_since_pruning > 90 or pruning_intensity <= 0:
            return 0.0
        
        time_decay = 1 - (days_since_pruning / 90)
        sensitivity = self.PRUNING_PHENOLOGY_SENSITIVITY.get(
            phenology_stage, {'sensitivity': 0.5}
        )['sensitivity']
        
        ppi = (pruning_intensity / 100) * time_decay * sensitivity
        return min(1.0, max(0.0, ppi))
    
    def calculate_regeneration_potential(
        self,
        ppi: float,
        lai_current: float,
        stress_level: float,
        nutrients: Dict[str, float]
    ) -> float:
        """
        Calculate Regeneration Potential Score (RPS)
        Based on Levin's morphogenetic field theory
        
        Higher PPI initially increases regeneration potential (wound response)
        """
        base_regeneration = 0.5
        
        # LAI factor: higher LAI = more reserves for regeneration
        lai_factor = min(1.0, lai_current / 4.0)
        
        # Stress modifier: high stress reduces regeneration
        stress_modifier = 1 - (stress_level * 0.5)
        
        # Nutrient factor: N is critical for regeneration
        n_level = nutrients.get('N', 100)
        nutrient_factor = min(1.0, n_level / 150)
        
        # PPI boost: pruning triggers regeneration response (up to a point)
        ppi_boost = 0.35 * ppi if ppi < 0.5 else 0.35 * (1 - ppi)
        
        rps = base_regeneration * (1 + ppi_boost) * lai_factor * stress_modifier * nutrient_factor
        return min(1.0, max(0.0, rps))
    
    def calculate_meristem_activation_probability(
        self,
        pruning_intensity: float,
        temp_min: float,
        lai_pre: float,
        days_since_pruning: int
    ) -> float:
        """
        Calculate probability of meristem (bud) activation post-pruning
        Based on logistic regression from CitrusMax Trim v2.0
        
        P(activation) = sigmoid(β0 + β1*PI + β2*temp + β3*LAI + β4*days)
        """
        if days_since_pruning > 35 or pruning_intensity <= 0:
            return 0.1  # Base activation rate
        
        # Coefficients from Trim v2.0 model
        beta_0 = -1.5
        beta_1 = 0.03  # PI effect
        beta_2 = 0.08  # Temperature effect (optimal 15-25°C)
        beta_3 = 0.4   # LAI effect
        beta_4 = -0.05  # Days decay
        
        # Temperature adjustment (optimal around 20°C)
        temp_factor = 1 - abs(temp_min - 20) / 20
        
        z = beta_0 + beta_1 * pruning_intensity + beta_2 * temp_factor * 10 + \
            beta_3 * lai_pre + beta_4 * days_since_pruning
        
        prob = 1 / (1 + math.exp(-z))
        return min(0.95, max(0.05, prob))
    
    def calculate_goal_shift_probability(
        self,
        pruning_intensity: float,
        stress_days: int,
        temp_min: float,
        lai_pre: float,
        current_goal: PlantGoal
    ) -> float:
        """
        Calculate probability of goal shift (vegetative → reproductive)
        Based on Levin's bioelectric reprogramming concept
        """
        # Only relevant for vegetative goals
        if current_goal not in [PlantGoal.GROWTH, PlantGoal.DORMANCY]:
            return 0.0
        
        # Coefficients for goal shift
        beta_0 = -2.0
        beta_1 = 0.04  # PI effect
        beta_2 = 0.02  # Stress days effect
        beta_3 = 0.1   # Cold temp effect (promotes flowering)
        beta_4 = 0.3   # LAI effect
        
        # Cold stress promotes flowering
        cold_factor = max(0, (20 - temp_min) / 10)
        
        z = beta_0 + beta_1 * pruning_intensity + beta_2 * stress_days + \
            beta_3 * cold_factor * 10 + beta_4 * lai_pre
        
        prob = 1 / (1 + math.exp(-z))
        return min(0.9, max(0.0, prob))
    
    def calculate_vmem_gradient(
        self,
        days_since_pruning: int,
        pruning_intensity: float,
        location: str = 'meristem'
    ) -> Tuple[float, float]:
        """
        Calculate synthetic Vmem (membrane potential) gradient
        Based on Levin's bioelectric signaling research
        
        Returns: (current_vmem, baseline_vmem)
        """
        pattern = self.BIOELECTRIC_PATTERNS.get(location, self.BIOELECTRIC_PATTERNS['meristem'])
        baseline = pattern['baseline_vmem']
        
        if days_since_pruning <= 0 or pruning_intensity <= 0:
            return baseline, baseline
        
        # Wound causes depolarization (Vmem becomes less negative)
        max_depolarization = 30  # mV
        depolarization = max_depolarization * (pruning_intensity / 100)
        
        # Recovery follows exponential decay
        tau = 14  # days for 63% recovery
        recovery = 1 - math.exp(-days_since_pruning / tau)
        
        current_vmem = baseline + depolarization * (1 - recovery)
        return current_vmem, baseline
    
    def get_morphogenesis_state(
        self,
        section: str,
        pruning_intensity: float,
        days_since_pruning: int,
        phenology_stage: str,
        lai_current: float,
        stress_level: float,
        nutrients: Dict[str, float],
        temp_min: float = 20.0
    ) -> MorphogenesisState:
        """
        Get complete morphogenesis state for a section
        """
        ppi = self.calculate_pruning_perturbation_index(
            pruning_intensity, days_since_pruning, phenology_stage
        )
        
        rps = self.calculate_regeneration_potential(
            ppi, lai_current, stress_level, nutrients
        )
        
        meristem_prob = self.calculate_meristem_activation_probability(
            pruning_intensity, temp_min, lai_current, days_since_pruning
        )
        
        # LAI recovery rate (units per week)
        lai_recovery = 0.15 * rps * (1 + ppi * 0.5)
        
        # Field state determination
        if ppi < 0.1:
            field_state = "stable"
        elif ppi < 0.4:
            field_state = "perturbed"
        else:
            field_state = "reprogramming"
        
        # Vmem gradient
        vmem_current, vmem_baseline = self.calculate_vmem_gradient(
            days_since_pruning, pruning_intensity
        )
        
        # Wound signal intensity
        wound_signal = ppi * (1 - days_since_pruning / 21) if days_since_pruning < 21 else 0
        
        return MorphogenesisState(
            perturbation_index=ppi,
            regeneration_potential=rps,
            meristem_activation_prob=meristem_prob,
            lai_recovery_rate=lai_recovery,
            field_state=field_state,
            vmem_gradient=vmem_current - vmem_baseline,
            days_since_pruning=days_since_pruning,
            wound_signal_intensity=max(0, wound_signal)
        )
    
    # =========================================================================
    # BIOELECTRIC MAP CALCULATIONS (NEW in v2.0)
    # =========================================================================
    
    def generate_bioelectric_map(
        self,
        section: str,
        phenology_stage: str,
        pruning_intensity: float = 0,
        days_since_pruning: int = 999
    ) -> Dict[str, Any]:
        """
        Generate synthetic bioelectric map data
        Based on Levin's bioelectric cognition framework
        """
        # Base patterns by location
        locations = ['meristem', 'root_tip', 'fruit_zone']
        
        map_data = {
            'section': section,
            'phenology': phenology_stage,
            'timestamp': datetime.now().isoformat(),
            'locations': {},
            'coherence_score': 0.0,
            'gamma_power_40hz': 0.0,
            'overall_vmem': 0.0
        }
        
        vmem_values = []
        
        for loc in locations:
            pattern = self.BIOELECTRIC_PATTERNS[loc]
            vmem_current, vmem_baseline = self.calculate_vmem_gradient(
                days_since_pruning, pruning_intensity, loc
            )
            
            # Add some noise for realism
            noise = np.random.normal(0, 2)
            vmem_current += noise
            
            # Frequency based on phenology
            freq_range = pattern['frequency']
            freq = np.random.uniform(freq_range[0], freq_range[1])
            
            map_data['locations'][loc] = {
                'vmem_current': round(vmem_current, 1),
                'vmem_baseline': vmem_baseline,
                'vmem_delta': round(vmem_current - vmem_baseline, 1),
                'frequency_hz': round(freq, 1),
                'status': 'active' if abs(vmem_current - vmem_baseline) < 15 else 'stressed'
            }
            
            vmem_values.append(vmem_current)
        
        # Add wound site if recent pruning
        if days_since_pruning < 30 and pruning_intensity > 0:
            wound_pattern = self.BIOELECTRIC_PATTERNS['wound_site']
            vmem_wound, _ = self.calculate_vmem_gradient(
                days_since_pruning, pruning_intensity, 'wound_site'
            )
            
            map_data['locations']['wound_site'] = {
                'vmem_current': round(vmem_wound, 1),
                'vmem_baseline': wound_pattern['baseline_vmem'],
                'vmem_delta': round(vmem_wound - wound_pattern['baseline_vmem'], 1),
                'frequency_hz': round(np.random.uniform(15, 25), 1),
                'status': 'healing' if days_since_pruning > 7 else 'active_wound',
                'signal_propagation': round(max(0, 1 - days_since_pruning / 21), 2)
            }
            vmem_values.append(vmem_wound)
        
        # Calculate coherence (how synchronized the bioelectric patterns are)
        if len(vmem_values) > 1:
            vmem_std = np.std(vmem_values)
            coherence = max(0, 1 - vmem_std / 20)
        else:
            coherence = 0.8
        
        map_data['coherence_score'] = round(coherence, 2)
        map_data['overall_vmem'] = round(np.mean(vmem_values), 1)
        
        # Gamma power (40Hz) - associated with consciousness in Levin's framework
        # Higher during active growth/regeneration
        gamma_base = 0.5
        if days_since_pruning < 21 and pruning_intensity > 10:
            gamma_boost = 0.3 * (pruning_intensity / 100)
        else:
            gamma_boost = 0
        
        map_data['gamma_power_40hz'] = round(min(1.0, gamma_base + gamma_boost), 2)
        
        return map_data
    
    # =========================================================================
    # MAIN ALIGNMENT CALCULATION (UPDATED with pruning)
    # =========================================================================
    
    def calculate_alignment(
        self,
        section: str,
        current_gdd: float,
        phenology_stage: str,
        soil_moisture: float,
        nutrients: Dict[str, float],
        stress_level: float = 0.0,
        pruning_intensity: float = 0.0,
        days_since_pruning: int = 999,
        lai_current: float = 3.5
    ) -> AlignmentResult:
        """
        Calculate alignment between current state and plant's bioelectric goal
        
        UPDATED in v2.0: Now includes pruning impact analysis
        """
        # Determine current goal
        current_goal = self.PHENOLOGY_GOALS.get(phenology_stage, PlantGoal.GROWTH)
        pattern = self.GOAL_PATTERNS[current_goal]
        
        # Calculate alignment components
        supporting = []
        blocking = []
        alignment_scores = []
        
        # 1. Water alignment
        water_diff = abs(soil_moisture - pattern.optimal_water * 100) / 100
        water_alignment = max(0, 1 - water_diff * 2)
        alignment_scores.append(water_alignment * 0.20)
        
        if water_alignment > 0.7:
            supporting.append(f"Water level ({soil_moisture:.1f}%) supports {current_goal.value}")
        elif water_alignment < 0.4:
            blocking.append(f"Water level ({soil_moisture:.1f}%) not optimal for {current_goal.value}")
        
        # 2. Nutrient alignment
        nutrient_alignments = []
        for nutrient, optimal in pattern.optimal_nutrients.items():
            current = nutrients.get(nutrient, optimal)
            diff = abs(current - optimal) / optimal
            n_align = max(0, 1 - diff)
            nutrient_alignments.append(n_align)
            
            if n_align < 0.5:
                blocking.append(f"{nutrient} level ({current:.0f}ppm) far from goal ({optimal:.0f}ppm)")
        
        nutrient_alignment = np.mean(nutrient_alignments) if nutrient_alignments else 0.5
        alignment_scores.append(nutrient_alignment * 0.20)
        
        if nutrient_alignment > 0.7:
            supporting.append(f"Nutrient balance supports {current_goal.value}")
        
        # 3. GDD progress alignment
        if pattern.target_gdd > 0:
            gdd_progress = min(1.0, current_gdd / pattern.target_gdd)
        else:
            gdd_progress = 1.0 if current_gdd < 50 else max(0, 1 - current_gdd / 200)
        alignment_scores.append(gdd_progress * 0.20)
        
        # 4. Stress compatibility
        stress_alignment = 1 - abs(stress_level - (1 - pattern.stress_tolerance))
        alignment_scores.append(max(0, stress_alignment) * 0.15)
        
        if stress_level > pattern.stress_tolerance:
            blocking.append(f"Stress level ({stress_level:.1%}) exceeds tolerance ({pattern.stress_tolerance:.1%})")
        
        # 5. NEW: Pruning impact alignment
        pruning_impact = 0.0
        if pruning_intensity > 0 and days_since_pruning < 90:
            ppi = self.calculate_pruning_perturbation_index(
                pruning_intensity, days_since_pruning, phenology_stage
            )
            
            # Pruning benefit depends on current goal
            pruning_benefit = pattern.pruning_benefit
            pruning_impact = pruning_benefit * ppi
            
            # Add to alignment
            pruning_alignment = 0.5 + pruning_impact
            alignment_scores.append(max(0, min(1, pruning_alignment)) * 0.25)
            
            if pruning_impact > 0.1:
                supporting.append(f"Recent pruning ({pruning_intensity:.0f}%) supports {current_goal.value}")
            elif pruning_impact < -0.1:
                blocking.append(f"Recent pruning ({pruning_intensity:.0f}%) conflicts with {current_goal.value}")
        else:
            alignment_scores.append(0.5 * 0.25)  # Neutral if no recent pruning
        
        # Calculate total alignment
        total_alignment = sum(alignment_scores)
        
        # Determine next goal
        goal_order = [PlantGoal.DORMANCY, PlantGoal.GROWTH, PlantGoal.FLOWERING,
                      PlantGoal.FRUIT_SET, PlantGoal.FRUIT_DEVELOPMENT,
                      PlantGoal.FRUIT_MATURATION, PlantGoal.SEED_DISPERSAL]
        
        try:
            current_idx = goal_order.index(current_goal)
            next_goal = goal_order[(current_idx + 1) % len(goal_order)]
        except ValueError:
            next_goal = PlantGoal.GROWTH
        
        # Calculate transition readiness
        transition_readiness = gdd_progress * total_alignment
        
        # Calculate goal shift probability
        goal_shift_prob = self.calculate_goal_shift_probability(
            pruning_intensity, int(stress_level * 30), 20, lai_current, current_goal
        )
        
        # Determine optimal pruning window
        pruning_rec = self.PRUNING_PHENOLOGY_SENSITIVITY.get(phenology_stage, {})
        optimal_window = pruning_rec.get('recommendation', 'CAUTION') in ['OPTIMAL', 'EXCELLENT', 'RECOMMENDED']
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            current_goal, pattern, soil_moisture, nutrients, stress_level,
            pruning_intensity, days_since_pruning, phenology_stage
        )
        
        return AlignmentResult(
            current_goal=current_goal,
            alignment_score=total_alignment,
            goal_progress=gdd_progress,
            supporting_factors=supporting,
            blocking_factors=blocking,
            recommended_support=recommendations,
            next_goal=next_goal,
            transition_readiness=transition_readiness,
            pruning_impact=pruning_impact,
            goal_shift_probability=goal_shift_prob,
            optimal_pruning_window=optimal_window
        )
    
    def _generate_recommendations(
        self,
        goal: PlantGoal,
        pattern: BioelectricPattern,
        soil_moisture: float,
        nutrients: Dict[str, float],
        stress_level: float,
        pruning_intensity: float,
        days_since_pruning: int,
        phenology_stage: str
    ) -> List[Dict[str, Any]]:
        """Generate recommendations based on alignment analysis"""
        recommendations = []
        
        # Water recommendations
        water_diff = soil_moisture - pattern.optimal_water * 100
        if abs(water_diff) > 10:
            recommendations.append({
                'action': 'adjust_irrigation',
                'target': f"{pattern.optimal_water * 100:.0f}%",
                'current': f"{soil_moisture:.0f}%",
                'reason': f"Optimize water for {goal.value}",
                'priority': 'high' if abs(water_diff) > 20 else 'medium'
            })
        
        # Nutrient recommendations
        for nutrient, optimal in pattern.optimal_nutrients.items():
            current = nutrients.get(nutrient, optimal)
            diff = (current - optimal) / optimal
            
            if diff < -0.2:
                recommendations.append({
                    'action': f'apply_{nutrient.lower()}',
                    'target': f"{optimal:.0f} ppm",
                    'current': f"{current:.0f} ppm",
                    'reason': f"{nutrient} deficiency limiting {goal.value}",
                    'priority': 'high' if diff < -0.3 else 'medium'
                })
        
        # Stress management
        if stress_level > pattern.stress_tolerance:
            recommendations.append({
                'action': 'stress_mitigation',
                'current_stress': f"{stress_level:.1%}",
                'tolerance': f"{pattern.stress_tolerance:.1%}",
                'reason': f"High stress incompatible with {goal.value}",
                'priority': 'high'
            })
        
        # NEW: Pruning recommendations
        pruning_rec = self.PRUNING_PHENOLOGY_SENSITIVITY.get(phenology_stage, {})
        rec_status = pruning_rec.get('recommendation', 'CAUTION')
        
        if rec_status in ['OPTIMAL', 'EXCELLENT'] and days_since_pruning > 60:
            recommendations.append({
                'action': 'consider_pruning',
                'intensity': '10-15%',
                'reason': f"Current phenology ({phenology_stage}) is optimal for pruning",
                'priority': 'medium',
                'expected_benefit': f"+{pruning_rec.get('benefit', 0) * 100:.0f}% goal alignment"
            })
        elif rec_status in ['AVOID', 'PROHIBITED']:
            recommendations.append({
                'action': 'avoid_pruning',
                'reason': f"Pruning during {phenology_stage} would harm {goal.value}",
                'priority': 'high',
                'expected_loss': f"{pruning_rec.get('benefit', 0) * 100:.0f}% goal alignment"
            })
        
        # Goal-specific recommendations
        if goal == PlantGoal.FLOWERING:
            recommendations.append({
                'action': 'minimize_disturbance',
                'reason': 'Critical flowering period - avoid pruning and major interventions',
                'priority': 'high'
            })
        elif goal == PlantGoal.FRUIT_SET:
            recommendations.append({
                'action': 'ensure_pollination',
                'reason': 'Fruit set requires optimal pollination conditions',
                'priority': 'medium'
            })
        elif goal == PlantGoal.FRUIT_MATURATION:
            recommendations.append({
                'action': 'reduce_nitrogen',
                'reason': 'High N during maturation reduces fruit quality',
                'priority': 'medium'
            })
        
        return recommendations
    
    # =========================================================================
    # DASHBOARD DATA METHODS (NEW in v2.0)
    # =========================================================================
    
    async def get_dashboard_data(self, section: str) -> Dict[str, Any]:
        """Get all data needed for Levin Layer Dashboard"""
        self._ensure_connection()
        
        # Get current data
        gdd_data = await self._get_current_gdd(section)
        phenology = await self._get_phenology(section)
        soil_data = await self._get_soil_data(section)
        pruning_data = await self._get_pruning_data(section)
        
        # Calculate alignment
        result = self.calculate_alignment(
            section=section,
            current_gdd=gdd_data.get('gdd', 0),
            phenology_stage=phenology,
            soil_moisture=soil_data.get('moisture', 45),
            nutrients={
                'N': soil_data.get('n_ppm', 150),
                'P': soil_data.get('p_ppm', 40),
                'K': soil_data.get('k_ppm', 180)
            },
            stress_level=soil_data.get('stress', 0.1),
            pruning_intensity=pruning_data.get('intensity', 0),
            days_since_pruning=pruning_data.get('days_since', 999),
            lai_current=soil_data.get('lai', 3.5)
        )
        
        # Get pruning recommendation
        pruning_rec = self.PRUNING_PHENOLOGY_SENSITIVITY.get(phenology, {})
        
        return {
            'section': section,
            'timestamp': datetime.now().isoformat(),
            'current_goal': {
                'name': result.current_goal.value,
                'display_name': result.current_goal.value.replace('_', ' ').title(),
                'progress': result.goal_progress
            },
            'alignment_score': result.alignment_score,
            'supporting_factors': result.supporting_factors,
            'blocking_factors': result.blocking_factors,
            'next_goal': {
                'name': result.next_goal.value if result.next_goal else None,
                'transition_readiness': result.transition_readiness
            },
            'recommendations': result.recommended_support[:5],
            'pruning': {
                'last_event': pruning_data,
                'impact_on_goal': result.pruning_impact,
                'optimal_window': result.optimal_pruning_window,
                'recommendation': pruning_rec.get('recommendation', 'CAUTION'),
                'goal_shift_probability': result.goal_shift_probability
            },
            'phenology': phenology,
            'gdd': gdd_data.get('gdd', 0)
        }
    
    async def get_goal_alignment_data(self, section: str) -> Dict[str, Any]:
        """Get data for Goal Alignment panel"""
        self._ensure_connection()
        
        gdd_data = await self._get_current_gdd(section)
        phenology = await self._get_phenology(section)
        soil_data = await self._get_soil_data(section)
        pruning_data = await self._get_pruning_data(section)
        
        result = self.calculate_alignment(
            section=section,
            current_gdd=gdd_data.get('gdd', 0),
            phenology_stage=phenology,
            soil_moisture=soil_data.get('moisture', 45),
            nutrients={
                'N': soil_data.get('n_ppm', 150),
                'P': soil_data.get('p_ppm', 40),
                'K': soil_data.get('k_ppm', 180)
            },
            stress_level=soil_data.get('stress', 0.1),
            pruning_intensity=pruning_data.get('intensity', 0),
            days_since_pruning=pruning_data.get('days_since', 999)
        )
        
        # Build goals grid
        goals_grid = []
        for goal in PlantGoal:
            pattern = self.GOAL_PATTERNS.get(goal)
            if pattern:
                is_current = goal == result.current_goal
                goals_grid.append({
                    'goal': goal.value,
                    'display_name': goal.value.replace('_', ' ').title(),
                    'is_current': is_current,
                    'target_gdd': pattern.target_gdd,
                    'pruning_sensitivity': pattern.pruning_sensitivity,
                    'pruning_benefit': pattern.pruning_benefit,
                    'stress_tolerance': pattern.stress_tolerance
                })
        
        # Alignment breakdown for radar chart
        alignment_breakdown = {
            'water': max(0, 1 - abs(soil_data.get('moisture', 45) - 
                        self.GOAL_PATTERNS[result.current_goal].optimal_water * 100) / 50),
            'light': 0.8,  # Synthetic - would need PAR sensor
            'nitrogen': min(1, soil_data.get('n_ppm', 150) / 
                          self.GOAL_PATTERNS[result.current_goal].optimal_nutrients['N']),
            'phosphorus': min(1, soil_data.get('p_ppm', 40) / 
                            self.GOAL_PATTERNS[result.current_goal].optimal_nutrients['P']),
            'potassium': min(1, soil_data.get('k_ppm', 180) / 
                           self.GOAL_PATTERNS[result.current_goal].optimal_nutrients['K'])
        }
        
        # Pruning-goal compatibility matrix
        pruning_compatibility = {}
        for fen, data in self.PRUNING_PHENOLOGY_SENSITIVITY.items():
            pruning_compatibility[fen] = {
                'recommendation': data['recommendation'],
                'benefit': data['benefit'],
                'sensitivity': data['sensitivity']
            }
        
        return {
            'section': section,
            'timestamp': datetime.now().isoformat(),
            'goals_grid': goals_grid,
            'current_goal_detail': {
                'goal': result.current_goal.value,
                'alignment_score': result.alignment_score,
                'progress': result.goal_progress,
                'supporting': result.supporting_factors,
                'blocking': result.blocking_factors
            },
            'alignment_breakdown': alignment_breakdown,
            'pruning_compatibility': pruning_compatibility,
            'current_phenology': phenology,
            'goal_shift_probability': result.goal_shift_probability,
            'optimal_pruning_window': result.optimal_pruning_window
        }
    
    async def get_bioelectric_map_data(self, section: str) -> Dict[str, Any]:
        """Get data for Bioelectric Map panel"""
        self._ensure_connection()
        
        phenology = await self._get_phenology(section)
        pruning_data = await self._get_pruning_data(section)
        
        map_data = self.generate_bioelectric_map(
            section=section,
            phenology_stage=phenology,
            pruning_intensity=pruning_data.get('intensity', 0),
            days_since_pruning=pruning_data.get('days_since', 999)
        )
        
        # Add sensor status (synthetic for now)
        map_data['sensor_status'] = {
            'meristem_probe': {'status': 'simulated', 'last_reading': datetime.now().isoformat()},
            'root_probe': {'status': 'simulated', 'last_reading': datetime.now().isoformat()},
            'fruit_probe': {'status': 'simulated', 'last_reading': datetime.now().isoformat()}
        }
        
        # Add voltage heatmap data (synthetic grid)
        heatmap_size = 10
        heatmap = []
        base_vmem = map_data['overall_vmem']
        
        for i in range(heatmap_size):
            row = []
            for j in range(heatmap_size):
                # Create gradient from center
                dist_from_center = math.sqrt((i - 5)**2 + (j - 5)**2) / 7
                vmem = base_vmem + np.random.normal(0, 3) + dist_from_center * 10
                row.append(round(vmem, 1))
            heatmap.append(row)
        
        map_data['voltage_heatmap'] = heatmap
        
        return map_data
    
    async def get_morphogenesis_data(self, section: str) -> Dict[str, Any]:
        """Get data for Morphogenesis panel"""
        self._ensure_connection()
        
        gdd_data = await self._get_current_gdd(section)
        phenology = await self._get_phenology(section)
        soil_data = await self._get_soil_data(section)
        pruning_data = await self._get_pruning_data(section)
        
        # Get morphogenesis state
        morph_state = self.get_morphogenesis_state(
            section=section,
            pruning_intensity=pruning_data.get('intensity', 0),
            days_since_pruning=pruning_data.get('days_since', 999),
            phenology_stage=phenology,
            lai_current=soil_data.get('lai', 3.5),
            stress_level=soil_data.get('stress', 0.1),
            nutrients={
                'N': soil_data.get('n_ppm', 150),
                'P': soil_data.get('p_ppm', 40),
                'K': soil_data.get('k_ppm', 180)
            }
        )
        
        # Phenology timeline
        phenology_timeline = []
        fen_gdd = {'FEN-01': 0, 'FEN-02': 200, 'FEN-03': 350, 'FEN-04': 450,
                   'FEN-05': 830, 'FEN-06': 950, 'FEN-07': 1200}
        
        current_gdd = gdd_data.get('gdd', 0)
        for fen, target_gdd in fen_gdd.items():
            status = 'completed' if current_gdd > target_gdd else \
                     'current' if fen == phenology else 'pending'
            phenology_timeline.append({
                'stage': fen,
                'target_gdd': target_gdd,
                'status': status,
                'goal': self.PHENOLOGY_GOALS.get(fen, PlantGoal.GROWTH).value
            })
        
        # Growth direction predictor (based on GDD + pruning)
        growth_direction = {
            'vegetative': 0.3,
            'reproductive': 0.5,
            'maintenance': 0.2
        }
        
        if morph_state.perturbation_index > 0.3:
            # Pruning shifts toward vegetative initially, then reproductive
            if morph_state.days_since_pruning < 14:
                growth_direction['vegetative'] = 0.6
                growth_direction['reproductive'] = 0.2
            else:
                growth_direction['vegetative'] = 0.2
                growth_direction['reproductive'] = 0.6
        
        # LAI recovery trajectory (next 4 weeks)
        lai_trajectory = []
        current_lai = soil_data.get('lai', 3.5)
        for week in range(5):
            projected_lai = current_lai + morph_state.lai_recovery_rate * week
            lai_trajectory.append({
                'week': week,
                'lai': round(min(5.0, projected_lai), 2)
            })
        
        return {
            'section': section,
            'timestamp': datetime.now().isoformat(),
            'morphogenesis_state': {
                'perturbation_index': morph_state.perturbation_index,
                'regeneration_potential': morph_state.regeneration_potential,
                'meristem_activation_prob': morph_state.meristem_activation_prob,
                'lai_recovery_rate': morph_state.lai_recovery_rate,
                'field_state': morph_state.field_state,
                'vmem_gradient': morph_state.vmem_gradient,
                'wound_signal_intensity': morph_state.wound_signal_intensity
            },
            'phenology_timeline': phenology_timeline,
            'growth_direction': growth_direction,
            'lai_trajectory': lai_trajectory,
            'current_gdd': current_gdd,
            'pruning_event': pruning_data,
            'stress_growth_balance': {
                'stress': soil_data.get('stress', 0.1),
                'growth_potential': morph_state.regeneration_potential
            }
        }
    
    # =========================================================================
    # DATA RETRIEVAL METHODS
    # =========================================================================
    
    async def _get_current_gdd(self, section: str) -> Dict:
        query = """
            SELECT gdd_acumulado as gdd
            FROM biofix.section_status
            WHERE seccion = %s
            ORDER BY fecha DESC LIMIT 1
        """
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                return dict(row) if row else {'gdd': 0}
        except:
            return {'gdd': 0}
    
    async def _get_phenology(self, section: str) -> str:
        query = """
            SELECT estado_fenologico
            FROM agronomy.fenologia_actual
            WHERE seccion = %s
            ORDER BY fecha_actualizacion DESC LIMIT 1
        """
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                return row['estado_fenologico'] if row else 'FEN-04'
        except:
            return 'FEN-04'
    
    async def _get_soil_data(self, section: str) -> Dict:
        """Get soil and environmental data"""
        # Try to get real data, fallback to synthetic
        try:
            query = """
                SELECT 
                    COALESCE(soil_moisture, 45) as moisture,
                    COALESCE(n_ppm, 150) as n_ppm,
                    COALESCE(p_ppm, 40) as p_ppm,
                    COALESCE(k_ppm, 180) as k_ppm,
                    COALESCE(stress_index, 0.1) as stress,
                    COALESCE(lai, 3.5) as lai
                FROM agronomy.soil_status
                WHERE seccion = %s
                ORDER BY fecha DESC LIMIT 1
            """
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                if row:
                    return dict(row)
        except Exception as e:
            logger.warning(f"Could not get soil data: {e}")
        
        # Fallback synthetic data
        return {
            'moisture': 45 + np.random.normal(0, 5),
            'n_ppm': 150 + np.random.normal(0, 20),
            'p_ppm': 40 + np.random.normal(0, 5),
            'k_ppm': 180 + np.random.normal(0, 15),
            'stress': 0.1 + np.random.uniform(0, 0.1),
            'lai': 3.5 + np.random.normal(0, 0.3)
        }
    
    async def _get_pruning_data(self, section: str) -> Dict:
        """Get last pruning event data"""
        # Try to get real data from operations log
        try:
            query = """
                SELECT 
                    fecha as date,
                    intensidad as intensity,
                    tipo as type,
                    EXTRACT(DAY FROM NOW() - fecha) as days_since
                FROM operations.pruning_log
                WHERE seccion = %s
                ORDER BY fecha DESC LIMIT 1
            """
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                if row:
                    return {
                        'date': row['date'].isoformat() if row['date'] else None,
                        'intensity': float(row['intensity']) if row['intensity'] else 0,
                        'type': row['type'] or 'maintenance',
                        'days_since': int(row['days_since']) if row['days_since'] else 999
                    }
        except Exception as e:
            logger.warning(f"Could not get pruning data: {e}")
        
        # Fallback: synthetic pruning event (assume last pruning was 45 days ago)
        return {
            'date': (datetime.now() - timedelta(days=45)).isoformat(),
            'intensity': 12.0,  # 12% intensity
            'type': 'maintenance',
            'days_since': 45
        }
    
    async def _log_to_db(self, section: str, result: AlignmentResult):
        query = """
            INSERT INTO c2ai.bioelectric_goals (
                section, goal_type, target_value, current_value, 
                alignment_score, pruning_impact, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (
                    section,
                    result.current_goal.value,
                    result.goal_progress,
                    result.alignment_score,
                    result.alignment_score,
                    result.pruning_impact
                ))
            self.conn.commit()
            logger.info(f"Logged Levin alignment for {section}: {result.alignment_score:.3f}")
        except Exception as e:
            logger.error(f"Error logging: {e}")
            self.conn.rollback()
    
    async def calculate_for_section(self, section: str) -> Dict:
        """Calculate alignment for a section using real data"""
        self._ensure_connection()
        
        # Get current data
        gdd_data = await self._get_current_gdd(section)
        phenology = await self._get_phenology(section)
        soil_data = await self._get_soil_data(section)
        pruning_data = await self._get_pruning_data(section)
        
        result = self.calculate_alignment(
            section=section,
            current_gdd=gdd_data.get('gdd', 0),
            phenology_stage=phenology,
            soil_moisture=soil_data.get('moisture', 45),
            nutrients={
                'N': soil_data.get('n_ppm', 150),
                'P': soil_data.get('p_ppm', 40),
                'K': soil_data.get('k_ppm', 180)
            },
            stress_level=soil_data.get('stress', 0.1),
            pruning_intensity=pruning_data.get('intensity', 0),
            days_since_pruning=pruning_data.get('days_since', 999)
        )
        
        # Log to database
        await self._log_to_db(section, result)
        
        return {
            'section': section,
            'timestamp': result.timestamp.isoformat(),
            'current_goal': result.current_goal.value,
            'alignment_score': result.alignment_score,
            'goal_progress': result.goal_progress,
            'supporting_factors': result.supporting_factors,
            'blocking_factors': result.blocking_factors,
            'recommendations': result.recommended_support,
            'next_goal': result.next_goal.value if result.next_goal else None,
            'transition_readiness': result.transition_readiness,
            'pruning_impact': result.pruning_impact,
            'goal_shift_probability': result.goal_shift_probability,
            'optimal_pruning_window': result.optimal_pruning_window
        }
    
    def close(self):
        if self.conn and not self.conn.closed:
            self.conn.close()


if __name__ == "__main__":
    pg_config = {
        'host': '44.247.163.1',
        'database': 'citrusmax_biofix',
        'user': 'postgres',
        'password': 'postgres'
    }
    
    levin = LevinLayer(pg_config)
    
    # Test with pruning parameters
    result = levin.calculate_alignment(
        section='S1',
        current_gdd=450,
        phenology_stage='FEN-04',
        soil_moisture=42,
        nutrients={'N': 130, 'P': 45, 'K': 170},
        stress_level=0.15,
        pruning_intensity=15,
        days_since_pruning=30
    )
    
    print("\n" + "="*60)
    print("LEVIN LAYER v2.0 TEST RESULTS (with Pruning Integration)")
    print("="*60)
    print(f"\nCurrent Goal: {result.current_goal.value}")
    print(f"Alignment Score: {result.alignment_score:.1%}")
    print(f"Goal Progress: {result.goal_progress:.1%}")
    print(f"Pruning Impact: {result.pruning_impact:+.2f}")
    print(f"Goal Shift Probability: {result.goal_shift_probability:.1%}")
    print(f"Optimal Pruning Window: {result.optimal_pruning_window}")
    print(f"Next Goal: {result.next_goal.value if result.next_goal else 'N/A'}")
    print(f"Transition Readiness: {result.transition_readiness:.1%}")
    
    print("\nSupporting Factors:")
    for f in result.supporting_factors:
        print(f"  ✓ {f}")
    
    print("\nBlocking Factors:")
    for f in result.blocking_factors:
        print(f"  ✗ {f}")
    
    print("\nRecommendations:")
    for r in result.recommended_support:
        print(f"  [{r.get('priority', 'medium').upper()}] {r.get('action')}: {r.get('reason')}")
    
    # Test morphogenesis state
    morph = levin.get_morphogenesis_state(
        section='S1',
        pruning_intensity=15,
        days_since_pruning=30,
        phenology_stage='FEN-04',
        lai_current=3.5,
        stress_level=0.15,
        nutrients={'N': 130, 'P': 45, 'K': 170}
    )
    
    print("\n" + "="*60)
    print("MORPHOGENESIS STATE")
    print("="*60)
    print(f"Perturbation Index: {morph.perturbation_index:.2f}")
    print(f"Regeneration Potential: {morph.regeneration_potential:.2f}")
    print(f"Meristem Activation Prob: {morph.meristem_activation_prob:.1%}")
    print(f"LAI Recovery Rate: {morph.lai_recovery_rate:.3f} units/week")
    print(f"Field State: {morph.field_state}")
    print(f"Vmem Gradient: {morph.vmem_gradient:+.1f} mV")
    print(f"Wound Signal Intensity: {morph.wound_signal_intensity:.2f}")
    
    # Test bioelectric map
    bio_map = levin.generate_bioelectric_map(
        section='S1',
        phenology_stage='FEN-04',
        pruning_intensity=15,
        days_since_pruning=30
    )
    
    print("\n" + "="*60)
    print("BIOELECTRIC MAP")
    print("="*60)
    print(f"Overall Vmem: {bio_map['overall_vmem']} mV")
    print(f"Coherence Score: {bio_map['coherence_score']}")
    print(f"Gamma Power (40Hz): {bio_map['gamma_power_40hz']}")
    print("\nLocations:")
    for loc, data in bio_map['locations'].items():
        print(f"  {loc}: Vmem={data['vmem_current']}mV, Δ={data['vmem_delta']}mV, Status={data['status']}")
    
    levin.close()
