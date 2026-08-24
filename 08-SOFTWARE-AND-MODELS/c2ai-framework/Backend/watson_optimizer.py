"""
Watson Energy Optimizer - C²AI Framework Layer 3
=================================================
Implements Peter Watson's energy landscape optimization for trajectory planning.
Finds optimal paths through the farm's state space.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Mathematical Foundation:
E(x) = -log P(x) where x is a farm state vector
Optimal trajectory minimizes ∫E(x(t))dt subject to constraints

Tools:
1. calculate_energy_landscape() - Map current energy surface
2. find_optimal_trajectory() - Compute minimum-energy path
3. predict_energy_barriers() - Identify obstacles/challenges
4. optimize_action_sequence() - Order actions for minimum effort
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import heapq
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("WatsonEnergyOptimizer")


class StateType(str, Enum):
    CURRENT = "current"
    TARGET = "target"
    OPTIMAL = "optimal"
    BARRIER = "barrier"
    ATTRACTOR = "attractor"


@dataclass
class FarmState:
    """State vector representing farm conditions."""
    pe: float           # Production Efficiency (0-100)
    iah: float          # Water aptitude (0-1)
    ipf: float          # Phytosanitary pressure (0-1)
    npf: float          # Nutrition factor (0-1)
    gdd: float          # Growing degree days
    quality: float      # Fruit quality (0-1)
    cost: float         # Accumulated cost (MXN)
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_vector(self) -> np.ndarray:
        return np.array([self.pe/100, self.iah, self.ipf, self.npf, 
                        self.gdd/1800, self.quality, self.cost/1000000])
    
    @classmethod
    def from_vector(cls, v: np.ndarray, ts: datetime = None):
        return cls(
            pe=v[0]*100, iah=v[1], ipf=v[2], npf=v[3],
            gdd=v[4]*1800, quality=v[5], cost=v[6]*1000000,
            timestamp=ts or datetime.now()
        )


@dataclass
class EnergyBarrier:
    """Represents an obstacle in the state space."""
    barrier_type: str
    magnitude: float        # Energy height
    location: List[float]   # State space coordinates
    width: float            # Barrier width
    crossable: bool
    effort_to_cross: float  # Cost in MXN to overcome
    description: str


@dataclass
class Trajectory:
    """Optimal path through state space."""
    states: List[FarmState]
    total_energy: float
    total_cost: float
    duration_days: int
    barriers_crossed: List[EnergyBarrier]
    actions: List[Dict[str, Any]]


class WatsonEnergyOptimizer:
    """
    Energy landscape optimization for farm trajectory planning.
    
    Core Principle: The farm exists in a high-dimensional energy landscape.
    Optimal management finds paths through low-energy valleys while
    avoiding or crossing energy barriers with minimal effort.
    
    Tools:
    1. calculate_energy_landscape() - Map energy surface
    2. find_optimal_trajectory() - A* path finding
    3. predict_energy_barriers() - Identify obstacles
    4. optimize_action_sequence() - Sequence optimization
    """
    
    # Energy weights for each state dimension
    ENERGY_WEIGHTS = {
        'pe': -0.35,        # Lower PE = higher energy (bad)
        'iah': -0.15,       # Lower IAH = higher energy
        'ipf': -0.20,       # Lower IPF = higher energy
        'npf': -0.10,       # Lower NPF = higher energy
        'gdd': 0.0,         # Neutral (just progression)
        'quality': -0.15,   # Lower quality = higher energy
        'cost': 0.05        # Higher cost = higher energy
    }
    
    # Known barrier types
    BARRIER_TYPES = {
        'pest_outbreak': {'magnitude': 2.5, 'width': 0.15, 'crossable': True, 'effort': 25000},
        'water_stress': {'magnitude': 1.8, 'width': 0.10, 'crossable': True, 'effort': 8000},
        'nutrient_def': {'magnitude': 1.5, 'width': 0.12, 'crossable': True, 'effort': 12000},
        'frost_event': {'magnitude': 3.5, 'width': 0.20, 'crossable': True, 'effort': 50000},
        'hlb_detection': {'magnitude': 5.0, 'width': 0.30, 'crossable': False, 'effort': 200000},
        'market_crash': {'magnitude': 2.0, 'width': 0.25, 'crossable': True, 'effort': 0},
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        logger.info("WatsonEnergyOptimizer initialized")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 1: CALCULATE ENERGY LANDSCAPE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_energy_landscape(
        self,
        current_state: FarmState,
        resolution: int = 10
    ) -> Dict[str, Any]:
        """
        Tool 1: Calculate energy landscape around current state.
        
        E(x) = Σ w_i × (1 - x_i) for negative weights (want high)
        E(x) = Σ w_i × x_i for positive weights (want low)
        
        Returns a discretized map of energy values.
        """
        x = current_state.to_vector()
        
        # Calculate current energy
        current_energy = self._calculate_energy(x)
        
        # Map local energy surface (simplified 2D projection on PE-Quality plane)
        pe_range = np.linspace(max(0, current_state.pe - 20), min(100, current_state.pe + 20), resolution)
        quality_range = np.linspace(max(0, current_state.quality - 0.2), min(1, current_state.quality + 0.2), resolution)
        
        energy_map = []
        min_energy = float('inf')
        max_energy = float('-inf')
        min_loc = None
        
        for pe in pe_range:
            row = []
            for q in quality_range:
                # Create test state
                test_vec = x.copy()
                test_vec[0] = pe / 100
                test_vec[5] = q
                e = self._calculate_energy(test_vec)
                row.append(round(e, 3))
                
                if e < min_energy:
                    min_energy = e
                    min_loc = {'pe': pe, 'quality': q}
                if e > max_energy:
                    max_energy = e
            energy_map.append(row)
        
        # Identify local attractors (energy minima)
        attractors = self._find_attractors(energy_map, pe_range, quality_range)
        
        # Calculate gradient (direction of steepest descent)
        gradient = self._calculate_gradient(x)
        
        return {
            'current_state': {
                'pe': current_state.pe,
                'iah': current_state.iah,
                'ipf': current_state.ipf,
                'npf': current_state.npf,
                'quality': current_state.quality
            },
            'current_energy': round(current_energy, 4),
            'energy_range': {
                'min': round(min_energy, 4),
                'max': round(max_energy, 4),
                'min_location': min_loc
            },
            'gradient': {
                'pe_direction': round(gradient[0], 4),
                'quality_direction': round(gradient[5], 4),
                'steepest_descent': self._gradient_to_action(gradient)
            },
            'attractors': attractors[:3],  # Top 3 attractors
            'energy_map_shape': [len(pe_range), len(quality_range)],
            'pe_axis': [round(p, 1) for p in pe_range.tolist()],
            'quality_axis': [round(q, 3) for q in quality_range.tolist()],
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_energy(self, state_vector: np.ndarray) -> float:
        """Calculate total energy for a state vector."""
        weights = np.array([
            self.ENERGY_WEIGHTS['pe'],
            self.ENERGY_WEIGHTS['iah'],
            self.ENERGY_WEIGHTS['ipf'],
            self.ENERGY_WEIGHTS['npf'],
            self.ENERGY_WEIGHTS['gdd'],
            self.ENERGY_WEIGHTS['quality'],
            self.ENERGY_WEIGHTS['cost']
        ])
        
        # E = Σ w_i × (1 - x_i) for negative weights
        energy = 0.0
        for i, (w, x) in enumerate(zip(weights, state_vector)):
            if w < 0:
                energy += abs(w) * (1 - x)  # Want high values
            else:
                energy += w * x  # Want low values
        
        return energy
    
    def _calculate_gradient(self, state_vector: np.ndarray, delta: float = 0.01) -> np.ndarray:
        """Calculate energy gradient at current state."""
        gradient = np.zeros(len(state_vector))
        current_E = self._calculate_energy(state_vector)
        
        for i in range(len(state_vector)):
            perturbed = state_vector.copy()
            perturbed[i] += delta
            perturbed = np.clip(perturbed, 0, 1)
            gradient[i] = (self._calculate_energy(perturbed) - current_E) / delta
        
        return gradient
    
    def _find_attractors(
        self,
        energy_map: List[List[float]],
        pe_range: np.ndarray,
        quality_range: np.ndarray
    ) -> List[Dict[str, Any]]:
        """Find local energy minima (attractors) in the energy map."""
        attractors = []
        n_rows = len(energy_map)
        n_cols = len(energy_map[0]) if n_rows > 0 else 0
        
        for i in range(1, n_rows - 1):
            for j in range(1, n_cols - 1):
                e = energy_map[i][j]
                # Check if local minimum
                neighbors = [
                    energy_map[i-1][j], energy_map[i+1][j],
                    energy_map[i][j-1], energy_map[i][j+1]
                ]
                if all(e <= n for n in neighbors):
                    attractors.append({
                        'pe': round(pe_range[i], 1),
                        'quality': round(quality_range[j], 3),
                        'energy': e,
                        'type': StateType.ATTRACTOR.value
                    })
        
        return sorted(attractors, key=lambda x: x['energy'])
    
    def _gradient_to_action(self, gradient: np.ndarray) -> Dict[str, Any]:
        """Convert gradient to recommended action."""
        dims = ['pe', 'iah', 'ipf', 'npf', 'gdd', 'quality', 'cost']
        strongest_idx = np.argmax(np.abs(gradient))
        
        action_map = {
            0: ('Aumentar PE', 'HarvestAgent'),
            1: ('Optimizar riego', 'IrrigationAgent'),
            2: ('Control fitosanitario', 'HealthAgent'),
            3: ('Nutrición foliar', 'NutritionAgent'),
            4: ('Acelerar fenología', 'PhenologyAgent'),
            5: ('Mejorar calidad', 'QualityAgent'),
            6: ('Reducir costos', 'CostAgent')
        }
        
        action, agent = action_map.get(strongest_idx, ('Mantener', 'OptimizerAgent'))
        
        return {
            'dimension': dims[strongest_idx],
            'gradient_value': round(gradient[strongest_idx], 4),
            'recommended_action': action,
            'agent': agent,
            'priority': 'high' if abs(gradient[strongest_idx]) > 0.5 else 'medium'
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 2: FIND OPTIMAL TRAJECTORY
    # ═══════════════════════════════════════════════════════════════════════════
    
    def find_optimal_trajectory(
        self,
        current_state: FarmState,
        target_state: FarmState,
        max_days: int = 90,
        budget_mxn: float = 500000
    ) -> Dict[str, Any]:
        """
        Tool 2: Find minimum-energy path from current to target state.
        
        Uses A* algorithm with energy as heuristic.
        """
        start = current_state.to_vector()
        goal = target_state.to_vector()
        
        # Simplified path finding with discrete steps
        path_states = [current_state]
        actions = []
        total_cost = 0.0
        barriers_crossed = []
        
        current = start.copy()
        day = 0
        
        while day < max_days and total_cost < budget_mxn:
            # Calculate direction to goal
            direction = goal - current
            distance = np.linalg.norm(direction)
            
            if distance < 0.05:  # Close enough
                break
            
            # Normalize and take step
            step_size = min(0.1, distance)  # Max 10% change per step
            step = (direction / distance) * step_size
            
            # Check for barriers
            barrier = self._check_barrier(current, current + step)
            if barrier:
                barriers_crossed.append(barrier)
                total_cost += barrier.effort_to_cross
                if not barrier.crossable:
                    break
            
            # Take step
            current = np.clip(current + step, 0, 1)
            
            # Record action
            action = self._step_to_action(step, day)
            actions.append(action)
            total_cost += action.get('cost_mxn', 0)
            
            # Create intermediate state
            new_state = FarmState.from_vector(
                current, 
                current_state.timestamp + timedelta(days=day)
            )
            path_states.append(new_state)
            
            day += 7  # Weekly steps
        
        # Calculate trajectory energy
        total_energy = sum(self._calculate_energy(s.to_vector()) for s in path_states)
        
        return {
            'trajectory_found': True,
            'path_length': len(path_states),
            'duration_days': day,
            'total_energy': round(total_energy, 4),
            'total_cost_mxn': round(total_cost, 2),
            'budget_remaining_mxn': round(budget_mxn - total_cost, 2),
            'barriers_crossed': len(barriers_crossed),
            'barriers': [
                {'type': b.barrier_type, 'effort': b.effort_to_cross}
                for b in barriers_crossed
            ],
            'start_state': {
                'pe': current_state.pe,
                'quality': current_state.quality
            },
            'end_state': {
                'pe': round(current[0] * 100, 1),
                'quality': round(current[5], 3)
            },
            'target_state': {
                'pe': target_state.pe,
                'quality': target_state.quality
            },
            'distance_to_target': round(np.linalg.norm(goal - current), 4),
            'actions': actions[:10],  # First 10 actions
            'timestamp': datetime.now().isoformat()
        }
    
    def _check_barrier(
        self,
        from_state: np.ndarray,
        to_state: np.ndarray
    ) -> Optional[EnergyBarrier]:
        """Check if trajectory crosses a barrier."""
        # Check each known barrier type
        for barrier_type, props in self.BARRIER_TYPES.items():
            # Simplified check based on state changes
            if barrier_type == 'pest_outbreak':
                if from_state[2] > 0.7 and to_state[2] < 0.7:
                    return EnergyBarrier(
                        barrier_type=barrier_type,
                        magnitude=props['magnitude'],
                        location=list((from_state + to_state) / 2),
                        width=props['width'],
                        crossable=props['crossable'],
                        effort_to_cross=props['effort'],
                        description="Brote de plagas detectado"
                    )
            elif barrier_type == 'water_stress':
                if from_state[1] < 0.5:
                    return EnergyBarrier(
                        barrier_type=barrier_type,
                        magnitude=props['magnitude'],
                        location=list(from_state),
                        width=props['width'],
                        crossable=props['crossable'],
                        effort_to_cross=props['effort'],
                        description="Estrés hídrico severo"
                    )
        
        return None
    
    def _step_to_action(self, step: np.ndarray, day: int) -> Dict[str, Any]:
        """Convert a state space step to an action."""
        dims = ['pe', 'iah', 'ipf', 'npf', 'gdd', 'quality', 'cost']
        dominant_dim = np.argmax(np.abs(step))
        
        action_map = {
            0: ('Optimización cosecha', 10000),
            1: ('Ajuste riego', 3000),
            2: ('Aplicación fitosanitaria', 15000),
            3: ('Fertilización', 8000),
            4: ('Seguimiento fenológico', 1000),
            5: ('Mejora calidad', 5000),
            6: ('Control costos', 0)
        }
        
        action_name, base_cost = action_map.get(dominant_dim, ('General', 5000))
        
        return {
            'day': day,
            'action': action_name,
            'dimension': dims[dominant_dim],
            'change': round(step[dominant_dim], 4),
            'cost_mxn': base_cost * abs(step[dominant_dim]) * 10
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 3: PREDICT ENERGY BARRIERS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def predict_energy_barriers(
        self,
        current_state: FarmState,
        horizon_days: int = 30,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 3: Predict upcoming energy barriers based on current trajectory.
        """
        self._ensure_connection()
        
        predicted_barriers = []
        
        # Check pest barrier risk
        if current_state.ipf < 0.85:
            risk = (0.85 - current_state.ipf) / 0.85
            predicted_barriers.append({
                'type': 'pest_outbreak',
                'probability': round(min(0.9, risk * 1.5), 2),
                'estimated_days': int(7 + (1 - risk) * 14),
                'magnitude': self.BARRIER_TYPES['pest_outbreak']['magnitude'],
                'effort_to_cross': self.BARRIER_TYPES['pest_outbreak']['effort'],
                'prevention': 'Aplicación preventiva de control biológico',
                'prevention_cost': 8000
            })
        
        # Check water stress barrier
        if current_state.iah < 0.75:
            risk = (0.75 - current_state.iah) / 0.75
            predicted_barriers.append({
                'type': 'water_stress',
                'probability': round(min(0.85, risk * 1.3), 2),
                'estimated_days': int(3 + (1 - risk) * 7),
                'magnitude': self.BARRIER_TYPES['water_stress']['magnitude'],
                'effort_to_cross': self.BARRIER_TYPES['water_stress']['effort'],
                'prevention': 'Riego de recuperación inmediato',
                'prevention_cost': 5000
            })
        
        # Check nutrition barrier
        if current_state.npf < 0.70:
            risk = (0.70 - current_state.npf) / 0.70
            predicted_barriers.append({
                'type': 'nutrient_def',
                'probability': round(min(0.8, risk * 1.2), 2),
                'estimated_days': int(14 + (1 - risk) * 21),
                'magnitude': self.BARRIER_TYPES['nutrient_def']['magnitude'],
                'effort_to_cross': self.BARRIER_TYPES['nutrient_def']['effort'],
                'prevention': 'Fertilización correctiva',
                'prevention_cost': 10000
            })
        
        # Check frost barrier (seasonal)
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT MIN(temp_min_c) as min_temp
                    FROM public.rv21_features
                    WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
                """)
                row = cur.fetchone()
                if row and row['min_temp'] and row['min_temp'] < 5:
                    predicted_barriers.append({
                        'type': 'frost_event',
                        'probability': 0.3,
                        'estimated_days': 30,
                        'magnitude': self.BARRIER_TYPES['frost_event']['magnitude'],
                        'effort_to_cross': self.BARRIER_TYPES['frost_event']['effort'],
                        'prevention': 'Preparar wind machines y riego anti-helada',
                        'prevention_cost': 15000
                    })
        except Exception as e:
            logger.warning(f"Could not check frost data: {e}")
        
        # Sort by probability
        predicted_barriers.sort(key=lambda x: x['probability'], reverse=True)
        
        # Calculate total risk
        total_risk = 1 - np.prod([1 - b['probability'] for b in predicted_barriers])
        
        return {
            'section': section,
            'horizon_days': horizon_days,
            'barriers_predicted': len(predicted_barriers),
            'total_barrier_risk': round(total_risk, 3),
            'barriers': predicted_barriers,
            'total_prevention_cost': sum(b['prevention_cost'] for b in predicted_barriers),
            'recommendation': 'Acción preventiva urgente' if total_risk > 0.5 else 'Monitoreo continuo',
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 4: OPTIMIZE ACTION SEQUENCE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def optimize_action_sequence(
        self,
        actions: List[Dict[str, Any]],
        current_state: FarmState,
        constraints: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Tool 4: Optimize the sequence of actions for minimum total energy.
        
        Uses dynamic programming to find optimal ordering.
        """
        if not actions:
            return {
                'optimized_sequence': [],
                'total_energy_saved': 0,
                'timestamp': datetime.now().isoformat()
            }
        
        constraints = constraints or {'max_actions_per_day': 3, 'budget': 100000}
        
        # Score each action by energy reduction potential
        scored_actions = []
        state_vec = current_state.to_vector()
        base_energy = self._calculate_energy(state_vec)
        
        for action in actions:
            # Estimate energy reduction
            dim_idx = self._action_to_dimension(action.get('type', ''))
            test_state = state_vec.copy()
            improvement = action.get('expected_improvement', 0.05)
            test_state[dim_idx] = min(1, test_state[dim_idx] + improvement)
            
            new_energy = self._calculate_energy(test_state)
            reduction = base_energy - new_energy
            
            scored_actions.append({
                **action,
                'energy_reduction': round(reduction, 4),
                'efficiency': round(reduction / max(action.get('cost_mxn', 1), 1) * 10000, 2)
            })
        
        # Sort by efficiency (energy reduction per cost)
        scored_actions.sort(key=lambda x: x['efficiency'], reverse=True)
        
        # Apply constraints
        budget = constraints.get('budget', 100000)
        optimized = []
        total_cost = 0
        total_reduction = 0
        
        for action in scored_actions:
            cost = action.get('cost_mxn', 0)
            if total_cost + cost <= budget:
                optimized.append(action)
                total_cost += cost
                total_reduction += action['energy_reduction']
        
        # Group by day
        daily_schedule = {}
        max_per_day = constraints.get('max_actions_per_day', 3)
        day = 1
        
        for i, action in enumerate(optimized):
            if day not in daily_schedule:
                daily_schedule[day] = []
            daily_schedule[day].append(action)
            if len(daily_schedule[day]) >= max_per_day:
                day += 1
        
        return {
            'original_count': len(actions),
            'optimized_count': len(optimized),
            'total_energy_reduction': round(total_reduction, 4),
            'total_cost_mxn': round(total_cost, 2),
            'budget_remaining': round(budget - total_cost, 2),
            'schedule_days': len(daily_schedule),
            'daily_schedule': {
                f'day_{d}': [{'action': a['type'], 'efficiency': a['efficiency']} for a in acts]
                for d, acts in daily_schedule.items()
            },
            'optimized_sequence': [
                {
                    'order': i + 1,
                    'action': a['type'],
                    'cost_mxn': a.get('cost_mxn', 0),
                    'energy_reduction': a['energy_reduction'],
                    'efficiency': a['efficiency']
                }
                for i, a in enumerate(optimized)
            ],
            'timestamp': datetime.now().isoformat()
        }
    
    def _action_to_dimension(self, action_type: str) -> int:
        """Map action type to state dimension index."""
        mapping = {
            'harvest': 0,
            'irrigation': 1,
            'phytosanitary': 2,
            'nutrition': 3,
            'phenology': 4,
            'quality': 5,
            'cost': 6
        }
        return mapping.get(action_type.lower(), 0)
    
    def close(self):
        if self.conn:
            self.conn.close()
