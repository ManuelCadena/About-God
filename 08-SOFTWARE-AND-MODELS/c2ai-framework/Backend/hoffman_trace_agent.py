"""
Hoffman Trace Logic Agent - C²AI Framework Layer 4
===================================================
Implements Donald Hoffman's Interface Theory of Perception with
Markovian Kernels for conscious agent modeling.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Mathematical Foundation:
- FarmKernel K(s'|s): Markov transition matrix for agronomic states
- Trace T(W): Renormalized kernel for agent perspective
- Time Dilation τ: Relative time perception between agents
- Stationary Distribution π: Long-term state probabilities

Tools:
1. compute_farm_kernel() - Build transition matrix
2. calculate_stationary_distribution() - Long-term equilibrium
3. compute_hitting_time() - Time to reach target states
4. compute_trace() - Agent-specific perception
5. calculate_time_dilation() - Relative time perception
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("HoffmanTraceLogicAgent")


class AgronomicState(str, Enum):
    """Discrete agronomic states for Markov modeling."""
    OPTIMAL = "optimal"           # PE > 90%, all indices good
    GOOD = "good"                 # PE 75-90%
    STRESSED = "stressed"         # One index below threshold
    CRITICAL = "critical"         # Multiple indices below threshold
    RECOVERY = "recovery"         # Improving from stressed/critical
    DORMANT = "dormant"           # Off-season


class AgentType(str, Enum):
    """Types of conscious agents in the system."""
    FARM_GLOBAL = "farm_global"           # Global farm perspective
    FIELD_WORKER = "field_worker"         # Field-level perspective
    MANAGER = "manager"                   # Management perspective
    PLANT = "plant"                       # Plant's perspective
    ECOSYSTEM = "ecosystem"               # Ecosystem perspective


@dataclass
class TraceResult:
    """Result of trace computation for an agent."""
    agent_type: AgentType
    world_states: List[str]
    kernel: List[List[float]]
    trace: List[List[float]]
    entropy_rate: float
    time_dilation: float
    perceptual_distance: float


class HoffmanTraceLogicAgent:
    """
    Implements Hoffman's conscious agent network for agriculture.
    
    Core Principle: Each agent (plant, worker, manager, AI) perceives
    the farm through its own "trace" - a renormalized view of the
    global state transitions. Different traces = different realities.
    
    Tools:
    1. compute_farm_kernel() - Build Markov transition matrix
    2. calculate_stationary_distribution() - Find π
    3. compute_hitting_time() - Time to reach states
    4. compute_trace() - Agent-specific perception
    5. calculate_time_dilation() - Relative time
    """
    
    # State indices for matrix operations
    STATE_INDICES = {
        AgronomicState.OPTIMAL: 0,
        AgronomicState.GOOD: 1,
        AgronomicState.STRESSED: 2,
        AgronomicState.CRITICAL: 3,
        AgronomicState.RECOVERY: 4,
        AgronomicState.DORMANT: 5
    }
    
    # Base transition probabilities (weekly transitions)
    BASE_TRANSITIONS = np.array([
        # To:  OPT    GOOD   STR    CRIT   REC    DORM
        [0.85, 0.10, 0.03, 0.01, 0.00, 0.01],  # From OPTIMAL
        [0.15, 0.70, 0.10, 0.02, 0.02, 0.01],  # From GOOD
        [0.05, 0.20, 0.50, 0.15, 0.08, 0.02],  # From STRESSED
        [0.01, 0.05, 0.20, 0.50, 0.22, 0.02],  # From CRITICAL
        [0.20, 0.40, 0.20, 0.05, 0.13, 0.02],  # From RECOVERY
        [0.02, 0.05, 0.03, 0.02, 0.03, 0.85],  # From DORMANT
    ])
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.n_states = 6
        self.states = list(AgronomicState)
        logger.info("HoffmanTraceLogicAgent initialized")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 1: COMPUTE FARM KERNEL
    # ═══════════════════════════════════════════════════════════════════════════
    
    def compute_farm_kernel(
        self,
        section: str = "general",
        use_historical: bool = True
    ) -> Dict[str, Any]:
        """
        Tool 1: Compute the global FarmKernel K(s'|s).
        
        The kernel is a Markov transition matrix where K[i,j] is the
        probability of transitioning from state i to state j.
        """
        if use_historical:
            kernel = self._compute_empirical_kernel(section)
        else:
            kernel = self.BASE_TRANSITIONS.copy()
        
        # Ensure rows sum to 1
        kernel = kernel / kernel.sum(axis=1, keepdims=True)
        
        # Calculate kernel properties
        eigenvalues = np.linalg.eigvals(kernel)
        spectral_gap = 1 - np.sort(np.abs(eigenvalues))[-2]
        
        # Calculate entropy rate
        stationary = self._calculate_stationary(kernel)
        entropy_rate = self._calculate_entropy_rate(kernel, stationary)
        
        return {
            'section': section,
            'kernel': kernel.round(4).tolist(),
            'states': [s.value for s in self.states],
            'properties': {
                'spectral_gap': round(float(spectral_gap), 4),
                'entropy_rate': round(entropy_rate, 4),
                'mixing_time_estimate': round(1 / max(spectral_gap, 0.01), 1),
                'is_irreducible': bool(np.all(kernel > 0)),
                'is_aperiodic': bool(np.all(np.diag(kernel) > 0))
            },
            'stationary_distribution': {
                s.value: round(p, 4) for s, p in zip(self.states, stationary)
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def _compute_empirical_kernel(self, section: str) -> np.ndarray:
        """Compute transition matrix from historical data."""
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get recent state data
                cur.execute("""
                    WITH state_data AS (
                        SELECT 
                            fecha,
                            CASE 
                                WHEN pe_consolidado >= 90 THEN 'optimal'
                                WHEN pe_consolidado >= 75 THEN 'good'
                                WHEN (COALESCE(plaga_total_trips, 0) + COALESCE(plaga_total_diaforina, 0)) > 10 THEN 'stressed'
                                WHEN pe_consolidado < 50 THEN 'critical'
                                ELSE 'good'
                            END as state
                        FROM public.rv21_features
                        WHERE fecha >= CURRENT_DATE - INTERVAL '180 days'
                        ORDER BY fecha
                    )
                    SELECT state, LEAD(state) OVER (ORDER BY fecha) as next_state
                    FROM state_data
                """)
                transitions = cur.fetchall()
                
        except Exception as e:
            logger.warning(f"Could not compute empirical kernel: {e}")
            return self.BASE_TRANSITIONS.copy()
        
        # Count transitions
        counts = np.zeros((self.n_states, self.n_states))
        state_map = {s.value: i for i, s in enumerate(self.states)}
        
        for t in transitions:
            if t['state'] and t['next_state']:
                i = state_map.get(t['state'], 1)
                j = state_map.get(t['next_state'], 1)
                counts[i, j] += 1
        
        # Convert to probabilities with smoothing
        kernel = (counts + 0.1) / (counts.sum(axis=1, keepdims=True) + 0.6)
        
        # Blend with base transitions
        kernel = 0.7 * kernel + 0.3 * self.BASE_TRANSITIONS
        
        return kernel
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 2: CALCULATE STATIONARY DISTRIBUTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_stationary_distribution(
        self,
        kernel: Optional[List[List[float]]] = None,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 2: Calculate the stationary distribution π.
        
        π is the long-term probability distribution over states,
        satisfying πK = π.
        """
        if kernel is None:
            K = self._compute_empirical_kernel(section)
        else:
            K = np.array(kernel)
        
        stationary = self._calculate_stationary(K)
        
        # Calculate expected time in each state
        expected_times = stationary * 52  # Weeks per year
        
        # Find most probable state
        most_probable_idx = np.argmax(stationary)
        most_probable = self.states[most_probable_idx].value
        
        # Calculate state stability (how long we stay in each state)
        stability = 1 / (1 - np.diag(K) + 0.01)
        
        return {
            'section': section,
            'stationary_distribution': {
                s.value: round(p, 4) for s, p in zip(self.states, stationary)
            },
            'expected_weeks_per_year': {
                s.value: round(t, 1) for s, t in zip(self.states, expected_times)
            },
            'most_probable_state': most_probable,
            'probability': round(stationary[most_probable_idx], 4),
            'state_stability': {
                s.value: round(st, 2) for s, st in zip(self.states, stability)
            },
            'interpretation': self._interpret_stationary(stationary),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_stationary(self, K: np.ndarray) -> np.ndarray:
        """Calculate stationary distribution using eigendecomposition."""
        # Find left eigenvector with eigenvalue 1
        eigenvalues, eigenvectors = np.linalg.eig(K.T)
        
        # Find eigenvector for eigenvalue closest to 1
        idx = np.argmin(np.abs(eigenvalues - 1))
        stationary = np.real(eigenvectors[:, idx])
        
        # Normalize
        stationary = np.abs(stationary) / np.abs(stationary).sum()
        
        return stationary
    
    def _interpret_stationary(self, stationary: np.ndarray) -> str:
        """Generate interpretation of stationary distribution."""
        optimal_prob = stationary[0]
        critical_prob = stationary[3]
        
        if optimal_prob > 0.5:
            return "Excelente: >50% probabilidad de estado óptimo a largo plazo"
        elif optimal_prob > 0.3 and critical_prob < 0.1:
            return "Bueno: Estado óptimo probable, riesgo bajo de crisis"
        elif critical_prob > 0.2:
            return "Riesgo: Alta probabilidad de estados críticos"
        else:
            return "Moderado: Balance de estados, monitoreo recomendado"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 3: COMPUTE HITTING TIME
    # ═══════════════════════════════════════════════════════════════════════════
    
    def compute_hitting_time(
        self,
        from_state: str,
        to_state: str,
        kernel: Optional[List[List[float]]] = None,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 3: Compute expected hitting time from one state to another.
        
        h(i,j) = E[min{n ≥ 1 : X_n = j | X_0 = i}]
        """
        if kernel is None:
            K = self._compute_empirical_kernel(section)
        else:
            K = np.array(kernel)
        
        # Get state indices
        from_idx = self._state_to_idx(from_state)
        to_idx = self._state_to_idx(to_state)
        
        if from_idx is None or to_idx is None:
            return {
                'error': 'Invalid state names',
                'valid_states': [s.value for s in self.states]
            }
        
        # Compute hitting times using fundamental matrix
        hitting_times = self._calculate_hitting_times(K)
        h = hitting_times[from_idx, to_idx]
        
        # Calculate commute time (round trip)
        commute_time = hitting_times[from_idx, to_idx] + hitting_times[to_idx, from_idx]
        
        # Calculate transition path probability
        direct_prob = K[from_idx, to_idx]
        
        return {
            'section': section,
            'from_state': from_state,
            'to_state': to_state,
            'hitting_time_weeks': round(h, 2),
            'hitting_time_days': round(h * 7, 1),
            'commute_time_weeks': round(commute_time, 2),
            'direct_transition_probability': round(direct_prob, 4),
            'interpretation': self._interpret_hitting_time(h, from_state, to_state),
            'fastest_path': self._find_fastest_path(K, from_idx, to_idx),
            'timestamp': datetime.now().isoformat()
        }
    
    def _state_to_idx(self, state_name: str) -> Optional[int]:
        """Convert state name to index."""
        for state, idx in self.STATE_INDICES.items():
            if state.value == state_name:
                return idx
        return None
    
    def _calculate_hitting_times(self, K: np.ndarray) -> np.ndarray:
        """Calculate all pairwise hitting times."""
        n = K.shape[0]
        H = np.zeros((n, n))
        
        for j in range(n):
            # Solve (I - K_j)h = 1 where K_j has row j zeroed
            K_j = K.copy()
            K_j[j, :] = 0
            K_j[j, j] = 1
            
            A = np.eye(n) - K_j
            b = np.ones(n)
            b[j] = 0
            
            try:
                h = np.linalg.solve(A, b)
                h[j] = 0
                H[:, j] = h
            except np.linalg.LinAlgError:
                H[:, j] = np.full(n, 100)  # Large value on error
        
        return H
    
    def _interpret_hitting_time(self, h: float, from_s: str, to_s: str) -> str:
        """Generate interpretation of hitting time."""
        if h < 2:
            return f"Rápido: Transición de {from_s} a {to_s} típicamente en <2 semanas"
        elif h < 4:
            return f"Moderado: ~{h:.0f} semanas para alcanzar {to_s}"
        elif h < 8:
            return f"Lento: ~{h:.0f} semanas - requiere intervención sostenida"
        else:
            return f"Difícil: >{h:.0f} semanas - considerar cambios estructurales"
    
    def _find_fastest_path(
        self,
        K: np.ndarray,
        from_idx: int,
        to_idx: int
    ) -> List[str]:
        """Find most probable path between states."""
        if from_idx == to_idx:
            return [self.states[from_idx].value]
        
        # Simple BFS for most probable path
        visited = {from_idx}
        queue = [(from_idx, [self.states[from_idx].value])]
        
        while queue:
            current, path = queue.pop(0)
            
            # Get neighbors sorted by transition probability
            neighbors = [(i, K[current, i]) for i in range(self.n_states)]
            neighbors.sort(key=lambda x: -x[1])
            
            for next_idx, prob in neighbors:
                if next_idx == to_idx:
                    return path + [self.states[to_idx].value]
                if next_idx not in visited and prob > 0.05:
                    visited.add(next_idx)
                    queue.append((next_idx, path + [self.states[next_idx].value]))
        
        return [self.states[from_idx].value, '...', self.states[to_idx].value]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 4: COMPUTE TRACE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def compute_trace(
        self,
        agent_type: str,
        kernel: Optional[List[List[float]]] = None,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 4: Compute the Trace for a specific agent type.
        
        The trace T(W) is a renormalized kernel representing how
        a specific agent perceives state transitions.
        """
        if kernel is None:
            K = self._compute_empirical_kernel(section)
        else:
            K = np.array(kernel)
        
        # Get perception filter for agent type
        perception_filter = self._get_perception_filter(agent_type)
        
        # Compute trace: T = diag(p) @ K @ diag(1/p)
        # where p is the perception filter
        p = np.array(perception_filter)
        p = p / p.sum()  # Normalize
        
        # Apply perception: weighted kernel
        P = np.diag(p)
        P_inv = np.diag(1.0 / (p + 0.01))
        
        trace = P @ K @ P_inv
        trace = trace / trace.sum(axis=1, keepdims=True)  # Normalize rows
        
        # Calculate trace properties
        trace_stationary = self._calculate_stationary(trace)
        global_stationary = self._calculate_stationary(K)
        
        # KL divergence between trace and global view
        kl_div = self._kl_divergence(trace_stationary, global_stationary)
        
        # Entropy rate of trace
        trace_entropy = self._calculate_entropy_rate(trace, trace_stationary)
        global_entropy = self._calculate_entropy_rate(K, global_stationary)
        
        return {
            'agent_type': agent_type,
            'section': section,
            'trace': trace.round(4).tolist(),
            'perception_filter': {
                s.value: round(w, 3) for s, w in zip(self.states, perception_filter)
            },
            'trace_stationary': {
                s.value: round(p, 4) for s, p in zip(self.states, trace_stationary)
            },
            'global_stationary': {
                s.value: round(p, 4) for s, p in zip(self.states, global_stationary)
            },
            'perceptual_distance': round(kl_div, 4),
            'trace_entropy_rate': round(trace_entropy, 4),
            'global_entropy_rate': round(global_entropy, 4),
            'interpretation': self._interpret_trace(agent_type, kl_div, trace_stationary),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_perception_filter(self, agent_type: str) -> List[float]:
        """Get perception weights for different agent types."""
        filters = {
            'farm_global': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],      # Sees all equally
            'field_worker': [0.8, 1.0, 1.5, 1.8, 1.2, 0.3],     # Notices stress more
            'manager': [1.5, 1.2, 0.8, 1.5, 0.7, 0.5],          # Focuses on optimal/critical
            'plant': [0.5, 0.8, 2.0, 2.5, 1.8, 1.0],            # Feels stress intensely
            'ecosystem': [1.0, 1.0, 0.8, 0.6, 1.2, 1.5]         # Values balance, dormancy
        }
        return filters.get(agent_type, [1.0] * 6)
    
    def _interpret_trace(
        self,
        agent_type: str,
        kl_div: float,
        trace_stat: np.ndarray
    ) -> str:
        """Interpret trace results for agent type."""
        dominant_state = self.states[np.argmax(trace_stat)].value
        
        if kl_div < 0.1:
            perception = "muy similar a la realidad global"
        elif kl_div < 0.3:
            perception = "moderadamente diferente de la realidad global"
        else:
            perception = "significativamente diferente de la realidad global"
        
        return f"El agente {agent_type} percibe el estado '{dominant_state}' " \
               f"como más probable. Su percepción es {perception} (KL={kl_div:.3f})."
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 5: CALCULATE TIME DILATION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_time_dilation(
        self,
        agent_type: str,
        kernel: Optional[List[List[float]]] = None,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 5: Calculate time dilation factor for an agent.
        
        τ = H(π_trace) / H(π_global)
        
        Agents with higher entropy experience time as slower.
        """
        if kernel is None:
            K = self._compute_empirical_kernel(section)
        else:
            K = np.array(kernel)
        
        # Get trace for agent
        perception_filter = self._get_perception_filter(agent_type)
        p = np.array(perception_filter)
        p = p / p.sum()
        
        P = np.diag(p)
        P_inv = np.diag(1.0 / (p + 0.01))
        trace = P @ K @ P_inv
        trace = trace / trace.sum(axis=1, keepdims=True)
        
        # Calculate entropy rates
        trace_stat = self._calculate_stationary(trace)
        global_stat = self._calculate_stationary(K)
        
        trace_entropy = self._calculate_entropy_rate(trace, trace_stat)
        global_entropy = self._calculate_entropy_rate(K, global_stat)
        
        # Time dilation factor
        if global_entropy > 0:
            tau = trace_entropy / global_entropy
        else:
            tau = 1.0
        
        # Subjective week duration
        subjective_week = 7 / tau if tau > 0 else 7
        
        return {
            'agent_type': agent_type,
            'section': section,
            'time_dilation_factor': round(tau, 4),
            'trace_entropy_rate': round(trace_entropy, 4),
            'global_entropy_rate': round(global_entropy, 4),
            'subjective_week_days': round(subjective_week, 2),
            'interpretation': self._interpret_time_dilation(tau, agent_type),
            'practical_implications': self._get_time_implications(tau, agent_type),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_entropy_rate(
        self,
        K: np.ndarray,
        stationary: np.ndarray
    ) -> float:
        """Calculate entropy rate of Markov chain."""
        H = 0.0
        for i in range(K.shape[0]):
            for j in range(K.shape[1]):
                if K[i, j] > 0:
                    H -= stationary[i] * K[i, j] * np.log2(K[i, j] + 1e-10)
        return H
    
    def _kl_divergence(self, p: np.ndarray, q: np.ndarray) -> float:
        """Calculate KL divergence D(p||q)."""
        p = p + 1e-10
        q = q + 1e-10
        return float(np.sum(p * np.log2(p / q)))
    
    def _interpret_time_dilation(self, tau: float, agent_type: str) -> str:
        """Interpret time dilation factor."""
        if tau > 1.2:
            return f"El {agent_type} experimenta tiempo más lento (τ={tau:.2f}): " \
                   "percibe más incertidumbre y cambios"
        elif tau < 0.8:
            return f"El {agent_type} experimenta tiempo más rápido (τ={tau:.2f}): " \
                   "percibe estabilidad y predictibilidad"
        else:
            return f"El {agent_type} tiene percepción temporal similar al global (τ={tau:.2f})"
    
    def _get_time_implications(self, tau: float, agent_type: str) -> List[str]:
        """Get practical implications of time dilation."""
        implications = []
        
        if tau > 1.2:
            implications.append("Requiere actualizaciones más frecuentes")
            implications.append("Beneficia de comunicación proactiva")
            implications.append("Puede necesitar más tiempo para tomar decisiones")
        elif tau < 0.8:
            implications.append("Puede no notar cambios sutiles")
            implications.append("Reportes semanales pueden ser suficientes")
            implications.append("Riesgo de complacencia en estados 'buenos'")
        else:
            implications.append("Cadencia de comunicación estándar apropiada")
            implications.append("Percepción balanceada de cambios")
        
        return implications
    
    def close(self):
        if self.conn:
            self.conn.close()
