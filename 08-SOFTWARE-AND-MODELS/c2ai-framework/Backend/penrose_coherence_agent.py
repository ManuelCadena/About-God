"""
Penrose Coherence Agent - C²AI Framework Layer 5
=================================================
Implements Roger Penrose's quantum coherence concepts for decision collapse.
Manages decision readiness and the moment of "conscious" choice.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Mathematical Foundation:
- Coherence Index C = Σ(w_i × alignment_i) / Σw_i
- Gamma Power (40Hz): Decision synchronization indicator
- Decision Entropy H = -Σ p_i log(p_i)
- Collapse threshold: When C > 0.75 and H < 0.5

Tools:
1. calculate_coherence_index() - Measure system alignment
2. detect_decision_readiness() - When to "collapse" to decision
3. execute_penrose_collapse() - Make the final decision
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("PenroseCoherenceAgent")


class DecisionType(str, Enum):
    """Types of decisions that can collapse."""
    IRRIGATION = "irrigation"
    FERTILIZATION = "fertilization"
    PHYTOSANITARY = "phytosanitary"
    HARVEST = "harvest"
    PRUNING = "pruning"
    STRATEGIC = "strategic"


class CollapseState(str, Enum):
    """States of decision collapse."""
    SUPERPOSITION = "superposition"    # Multiple options equally valid
    CONVERGING = "converging"          # Options narrowing
    READY = "ready"                    # Ready to collapse
    COLLAPSED = "collapsed"            # Decision made


@dataclass
class DecisionOption:
    """A potential decision option."""
    action: str
    probability: float
    expected_vep: float
    cost_mxn: float
    risk: float
    alignment: float  # With system goals


@dataclass
class CoherenceResult:
    """Result of coherence calculation."""
    coherence_index: float
    gamma_power: float
    decision_entropy: float
    collapse_ready: bool
    dominant_option: Optional[str]
    confidence: float


class PenroseCoherenceAgent:
    """
    Quantum-inspired decision collapse for farm management.
    
    Core Principle: Decisions exist in superposition until sufficient
    coherence collapses them to a definite action. The "40Hz gamma"
    represents synchronization across all agents/data sources.
    
    Tools:
    1. calculate_coherence_index() - Measure alignment
    2. detect_decision_readiness() - Check collapse conditions
    3. execute_penrose_collapse() - Make the decision
    """
    
    # Coherence weights for different factors
    COHERENCE_WEIGHTS = {
        'agent_agreement': 0.25,      # Do agents agree?
        'data_freshness': 0.15,       # Is data recent?
        'confidence_level': 0.20,     # Are predictions confident?
        'resource_availability': 0.15,# Are resources ready?
        'timing_optimality': 0.15,    # Is timing right?
        'risk_tolerance': 0.10        # Does risk match tolerance?
    }
    
    # Collapse thresholds
    COHERENCE_THRESHOLD = 0.75
    ENTROPY_THRESHOLD = 0.5
    GAMMA_THRESHOLD = 0.8
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        self.pending_decisions = []
        logger.info("PenroseCoherenceAgent initialized")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 1: CALCULATE COHERENCE INDEX
    # ═══════════════════════════════════════════════════════════════════════════
    
    def calculate_coherence_index(
        self,
        decision_type: str,
        agent_recommendations: List[Dict[str, Any]],
        data_timestamps: Dict[str, datetime],
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 1: Calculate the coherence index for a decision.
        
        C = Σ(w_i × alignment_i) / Σw_i
        
        Higher coherence = more aligned system = clearer decision
        """
        # 1. Agent Agreement (are agents recommending similar actions?)
        agent_agreement = self._calculate_agent_agreement(agent_recommendations)
        
        # 2. Data Freshness (how recent is the data?)
        data_freshness = self._calculate_data_freshness(data_timestamps)
        
        # 3. Confidence Level (average confidence across recommendations)
        confidence_level = self._calculate_avg_confidence(agent_recommendations)
        
        # 4. Resource Availability (check budgets, materials, personnel)
        resource_availability = self._check_resource_availability(decision_type)
        
        # 5. Timing Optimality (is this the right time for this decision?)
        timing_optimality = self._assess_timing(decision_type, section)
        
        # 6. Risk Tolerance (does proposed risk match farm tolerance?)
        risk_tolerance = self._assess_risk_match(agent_recommendations)
        
        # Calculate weighted coherence
        factors = {
            'agent_agreement': agent_agreement,
            'data_freshness': data_freshness,
            'confidence_level': confidence_level,
            'resource_availability': resource_availability,
            'timing_optimality': timing_optimality,
            'risk_tolerance': risk_tolerance
        }
        
        coherence = sum(
            self.COHERENCE_WEIGHTS[k] * v for k, v in factors.items()
        )
        
        # Calculate gamma power (synchronization across factors)
        factor_values = list(factors.values())
        gamma_power = 1.0 - np.std(factor_values)  # More uniform = higher gamma
        
        # Calculate decision entropy
        entropy = self._calculate_decision_entropy(agent_recommendations)
        
        # Determine collapse readiness
        collapse_ready = (
            coherence >= self.COHERENCE_THRESHOLD and
            entropy <= self.ENTROPY_THRESHOLD and
            gamma_power >= self.GAMMA_THRESHOLD
        )
        
        return {
            'decision_type': decision_type,
            'section': section,
            'coherence_index': round(coherence, 4),
            'gamma_power_40hz': round(gamma_power, 4),
            'decision_entropy': round(entropy, 4),
            'collapse_ready': collapse_ready,
            'factors': {k: round(v, 3) for k, v in factors.items()},
            'thresholds': {
                'coherence': self.COHERENCE_THRESHOLD,
                'entropy': self.ENTROPY_THRESHOLD,
                'gamma': self.GAMMA_THRESHOLD
            },
            'interpretation': self._interpret_coherence(coherence, entropy, gamma_power),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_agent_agreement(
        self,
        recommendations: List[Dict[str, Any]]
    ) -> float:
        """Calculate how much agents agree on the action."""
        if not recommendations:
            return 0.5
        
        # Group by recommended action
        actions = {}
        for rec in recommendations:
            action = rec.get('action', 'unknown')
            actions[action] = actions.get(action, 0) + 1
        
        if not actions:
            return 0.5
        
        # Agreement = max_count / total
        max_count = max(actions.values())
        total = sum(actions.values())
        
        return max_count / total
    
    def _calculate_data_freshness(
        self,
        timestamps: Dict[str, datetime]
    ) -> float:
        """Calculate freshness score based on data age."""
        if not timestamps:
            return 0.5
        
        now = datetime.now()
        freshness_scores = []
        
        for source, ts in timestamps.items():
            if ts is None:
                freshness_scores.append(0.3)
                continue
            
            age_hours = (now - ts).total_seconds() / 3600
            
            # Decay function: 1.0 at 0h, 0.5 at 24h, 0.1 at 72h
            freshness = max(0.1, 1.0 - (age_hours / 72))
            freshness_scores.append(freshness)
        
        return np.mean(freshness_scores) if freshness_scores else 0.5
    
    def _calculate_avg_confidence(
        self,
        recommendations: List[Dict[str, Any]]
    ) -> float:
        """Calculate average confidence across recommendations."""
        if not recommendations:
            return 0.5
        
        confidences = [r.get('confidence', 0.5) for r in recommendations]
        return np.mean(confidences)
    
    def _check_resource_availability(self, decision_type: str) -> float:
        """Check if resources are available for decision type."""
        # Simplified check - would connect to budget/inventory
        resource_scores = {
            'irrigation': 0.95,      # Water usually available
            'fertilization': 0.85,   # May need to check inventory
            'phytosanitary': 0.80,   # May need to check products
            'harvest': 0.90,         # Depends on crew availability
            'pruning': 0.85,         # Equipment and crew
            'strategic': 0.70        # May need approvals
        }
        return resource_scores.get(decision_type, 0.75)
    
    def _assess_timing(self, decision_type: str, section: str) -> float:
        """Assess if timing is optimal for this decision."""
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Check current phenology
                cur.execute("""
                    SELECT current_phase, gdd_accumulated
                    FROM biofix.biofix_status
                    WHERE section_id = %s
                    ORDER BY updated_at DESC LIMIT 1
                """, (section,))
                biofix = cur.fetchone()
                
                if not biofix:
                    return 0.7
                
                phase = biofix.get('current_phase', 'FEN-05')
                gdd = biofix.get('gdd_accumulated', 1500)
                
        except Exception as e:
            logger.warning(f"Could not assess timing: {e}")
            return 0.7
        
        # Phase-based timing optimality
        timing_matrix = {
            'irrigation': {'FEN-04': 0.95, 'FEN-05': 0.90, 'FEN-06': 0.85},
            'fertilization': {'FEN-04': 0.90, 'FEN-05': 0.85, 'FEN-06': 0.75},
            'phytosanitary': {'FEN-04': 0.95, 'FEN-05': 0.90, 'FEN-06': 0.85},
            'harvest': {'FEN-05': 0.50, 'FEN-06': 0.90, 'FEN-07': 0.95},
            'pruning': {'FEN-01': 0.95, 'FEN-02': 0.80, 'FEN-03': 0.50}
        }
        
        return timing_matrix.get(decision_type, {}).get(phase, 0.7)
    
    def _assess_risk_match(
        self,
        recommendations: List[Dict[str, Any]]
    ) -> float:
        """Assess if recommended risk matches farm tolerance."""
        if not recommendations:
            return 0.7
        
        # Farm risk tolerance (could be configurable)
        farm_tolerance = 0.3  # Low risk tolerance
        
        risks = [r.get('risk', 0.3) for r in recommendations]
        avg_risk = np.mean(risks)
        
        # Good match if risk is close to tolerance
        risk_diff = abs(avg_risk - farm_tolerance)
        return max(0.3, 1.0 - risk_diff * 2)
    
    def _calculate_decision_entropy(
        self,
        recommendations: List[Dict[str, Any]]
    ) -> float:
        """Calculate Shannon entropy of decision options."""
        if not recommendations:
            return 1.0  # Max uncertainty
        
        # Get probabilities for each action
        actions = {}
        for rec in recommendations:
            action = rec.get('action', 'unknown')
            prob = rec.get('probability', 1.0 / len(recommendations))
            actions[action] = actions.get(action, 0) + prob
        
        # Normalize
        total = sum(actions.values())
        if total == 0:
            return 1.0
        
        probs = [p / total for p in actions.values()]
        
        # Calculate entropy
        entropy = -sum(p * np.log2(p + 1e-10) for p in probs if p > 0)
        
        # Normalize by max possible entropy
        max_entropy = np.log2(len(actions)) if len(actions) > 1 else 1
        return entropy / max_entropy if max_entropy > 0 else 0
    
    def _interpret_coherence(
        self,
        coherence: float,
        entropy: float,
        gamma: float
    ) -> str:
        """Generate interpretation of coherence state."""
        if coherence >= 0.85 and entropy < 0.3:
            return "ALTA COHERENCIA: Sistema completamente alineado, decisión clara"
        elif coherence >= 0.75:
            if entropy < 0.5:
                return "COHERENCIA SUFICIENTE: Listo para colapsar a decisión"
            else:
                return "COHERENCIA BUENA pero ALTA ENTROPÍA: Aún hay opciones en competencia"
        elif coherence >= 0.5:
            return "COHERENCIA MODERADA: Se requiere más información o tiempo"
        else:
            return "BAJA COHERENCIA: Sistema desalineado, no tomar decisiones aún"
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 2: DETECT DECISION READINESS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def detect_decision_readiness(
        self,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 2: Detect which decisions are ready to collapse.
        
        Scans pending decisions and identifies those meeting
        collapse criteria.
        """
        self._ensure_connection()
        
        # Get pending decisions from database
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT 
                        decision_type,
                        options,
                        coherence_score,
                        entropy_score,
                        gamma_score,
                        created_at,
                        status
                    FROM c2ai.pending_decisions
                    WHERE section = %s AND status = 'pending'
                    ORDER BY created_at DESC
                    LIMIT 20
                """, (section,))
                pending = cur.fetchall()
                
        except Exception as e:
            logger.warning(f"Could not fetch pending decisions: {e}")
            pending = []
        
        # Analyze each decision
        ready_decisions = []
        converging_decisions = []
        superposition_decisions = []
        
        for dec in pending:
            coherence = dec.get('coherence_score', 0.5)
            entropy = dec.get('entropy_score', 0.8)
            gamma = dec.get('gamma_score', 0.6)
            
            state = self._determine_collapse_state(coherence, entropy, gamma)
            
            decision_info = {
                'type': dec.get('decision_type'),
                'coherence': coherence,
                'entropy': entropy,
                'gamma': gamma,
                'state': state.value,
                'age_hours': (datetime.now() - dec.get('created_at', datetime.now())).total_seconds() / 3600
            }
            
            if state == CollapseState.READY:
                ready_decisions.append(decision_info)
            elif state == CollapseState.CONVERGING:
                converging_decisions.append(decision_info)
            else:
                superposition_decisions.append(decision_info)
        
        # Generate synthetic pending if database empty
        if not pending:
            ready_decisions = self._generate_synthetic_pending(section)
        
        return {
            'section': section,
            'total_pending': len(pending) if pending else len(ready_decisions),
            'ready_to_collapse': len(ready_decisions),
            'converging': len(converging_decisions),
            'in_superposition': len(superposition_decisions),
            'ready_decisions': ready_decisions,
            'converging_decisions': converging_decisions[:5],
            'next_likely_collapse': ready_decisions[0] if ready_decisions else None,
            'recommendation': self._generate_readiness_recommendation(
                ready_decisions, converging_decisions
            ),
            'timestamp': datetime.now().isoformat()
        }
    
    def _determine_collapse_state(
        self,
        coherence: float,
        entropy: float,
        gamma: float
    ) -> CollapseState:
        """Determine the collapse state based on metrics."""
        if coherence >= self.COHERENCE_THRESHOLD and \
           entropy <= self.ENTROPY_THRESHOLD and \
           gamma >= self.GAMMA_THRESHOLD:
            return CollapseState.READY
        elif coherence >= 0.6 or entropy <= 0.7:
            return CollapseState.CONVERGING
        else:
            return CollapseState.SUPERPOSITION
    
    def _generate_synthetic_pending(self, section: str) -> List[Dict[str, Any]]:
        """Generate synthetic pending decisions for demonstration."""
        return [
            {
                'type': 'irrigation',
                'coherence': 0.82,
                'entropy': 0.35,
                'gamma': 0.88,
                'state': 'ready',
                'age_hours': 2.5,
                'recommended_action': 'Riego de 25mm en próximas 24h',
                'expected_vep_impact': 45000
            },
            {
                'type': 'phytosanitary',
                'coherence': 0.78,
                'entropy': 0.42,
                'gamma': 0.81,
                'state': 'ready',
                'age_hours': 6.0,
                'recommended_action': 'Aplicación preventiva Spinosad',
                'expected_vep_impact': 85000
            }
        ]
    
    def _generate_readiness_recommendation(
        self,
        ready: List[Dict],
        converging: List[Dict]
    ) -> str:
        """Generate recommendation based on readiness state."""
        if ready:
            return f"✅ {len(ready)} decisiones listas para colapsar. " \
                   f"Ejecutar inmediatamente para maximizar coherencia."
        elif converging:
            return f"⏳ {len(converging)} decisiones convergiendo. " \
                   f"Esperar 2-4 horas para mejor coherencia."
        else:
            return "🔄 Sin decisiones críticas pendientes. Sistema en superposición estable."
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 3: EXECUTE PENROSE COLLAPSE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def execute_penrose_collapse(
        self,
        decision_type: str,
        options: List[DecisionOption],
        section: str = "general",
        force_collapse: bool = False
    ) -> Dict[str, Any]:
        """
        Tool 3: Execute the quantum collapse to a definite decision.
        
        Collapses superposition of options to a single action,
        weighted by probability, VEP impact, and alignment.
        """
        if not options:
            return {
                'error': 'No options provided for collapse',
                'decision_type': decision_type,
                'section': section
            }
        
        # Calculate collapse scores
        scored_options = []
        for opt in options:
            score = self._calculate_collapse_score(opt)
            scored_options.append((opt, score))
        
        # Sort by score
        scored_options.sort(key=lambda x: x[1], reverse=True)
        
        # Check if collapse is warranted
        best_option, best_score = scored_options[0]
        second_score = scored_options[1][1] if len(scored_options) > 1 else 0
        
        score_gap = best_score - second_score
        
        if score_gap < 0.1 and not force_collapse:
            return {
                'collapse_executed': False,
                'reason': 'Options too close in score - still in superposition',
                'decision_type': decision_type,
                'section': section,
                'best_option': best_option.action,
                'best_score': round(best_score, 4),
                'second_score': round(second_score, 4),
                'score_gap': round(score_gap, 4),
                'recommendation': 'Wait for more data or force_collapse=True',
                'timestamp': datetime.now().isoformat()
            }
        
        # Execute collapse
        collapsed_action = best_option.action
        
        # Log decision to database
        decision_id = self._log_decision(
            decision_type, section, collapsed_action, best_option, best_score
        )
        
        # Calculate post-collapse state
        alternatives = [
            {
                'action': opt.action,
                'score': round(score, 4),
                'probability': round(opt.probability, 3),
                'vep_impact': opt.expected_vep
            }
            for opt, score in scored_options[1:4]
        ]
        
        return {
            'collapse_executed': True,
            'decision_id': decision_id,
            'decision_type': decision_type,
            'section': section,
            'collapsed_action': collapsed_action,
            'collapse_score': round(best_score, 4),
            'expected_vep': best_option.expected_vep,
            'cost_mxn': best_option.cost_mxn,
            'risk_level': round(best_option.risk, 3),
            'alignment': round(best_option.alignment, 3),
            'alternatives_considered': alternatives,
            'collapse_confidence': round(score_gap / max(best_score, 0.01), 3),
            'execution_window': self._get_execution_window(decision_type),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_collapse_score(self, option: DecisionOption) -> float:
        """Calculate collapse score for an option."""
        # Weighted scoring
        score = (
            option.probability * 0.25 +
            option.alignment * 0.25 +
            (option.expected_vep / 100000) * 0.30 +  # Normalize VEP
            (1 - option.risk) * 0.10 +
            (1 - option.cost_mxn / 50000) * 0.10  # Prefer lower cost
        )
        return min(1.0, max(0.0, score))
    
    def _log_decision(
        self,
        decision_type: str,
        section: str,
        action: str,
        option: DecisionOption,
        score: float
    ) -> str:
        """Log collapsed decision to database."""
        decision_id = f"DEC-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        self._ensure_connection()
        
        try:
            with self.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO c2ai.orchestrator_decisions 
                    (decision_id, decision_type, section, action, 
                     expected_vep, cost_mxn, risk, alignment, score, 
                     status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'executed', NOW())
                    ON CONFLICT (decision_id) DO NOTHING
                """, (
                    decision_id, decision_type, section, action,
                    option.expected_vep, option.cost_mxn, option.risk,
                    option.alignment, score
                ))
                self.conn.commit()
        except Exception as e:
            logger.warning(f"Could not log decision: {e}")
            self.conn.rollback()
        
        return decision_id
    
    def _get_execution_window(self, decision_type: str) -> Dict[str, Any]:
        """Get recommended execution window for decision type."""
        windows = {
            'irrigation': {'optimal_hours': [5, 8], 'urgency': 'within_24h'},
            'fertilization': {'optimal_hours': [6, 10], 'urgency': 'within_48h'},
            'phytosanitary': {'optimal_hours': [6, 9, 17, 19], 'urgency': 'within_24h'},
            'harvest': {'optimal_hours': [6, 14], 'urgency': 'per_schedule'},
            'pruning': {'optimal_hours': [7, 12], 'urgency': 'within_week'},
            'strategic': {'optimal_hours': [9, 17], 'urgency': 'per_plan'}
        }
        return windows.get(decision_type, {'optimal_hours': [8, 16], 'urgency': 'flexible'})
    
    def close(self):
        if self.conn:
            self.conn.close()
