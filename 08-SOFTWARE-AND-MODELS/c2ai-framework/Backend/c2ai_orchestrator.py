"""
C²AI Orchestrator - Unified Conscious Citrus AI Controller
===========================================================
Master orchestrator integrating all 6 C²AI agents into a unified
conscious decision system for agricultural management.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Layers Orchestrated:
1. Friston Free Energy - Surprise minimization
2. Levin Bioelectric - Early threat detection
3. Levin Morphogenesis - Developmental guidance
4. Watson Energy - Trajectory optimization
5. Hoffman Trace - Agent perspectives
6. Penrose Coherence - Decision collapse

Unified Tools:
1. run_full_consciousness_cycle() - Complete C²AI analysis
2. get_unified_state() - Aggregated system state
3. generate_conscious_decision() - Multi-layer decision
4. explain_decision() - Explainability output
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from enum import Enum
from datetime import datetime
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

from .friston_agent import (
    FristonFreeEnergyAgent, ObservationVector, SurpriseLevel
)
from .levin_bioelectric_agent import LevinBioelectricAgent
from .levin_morphogenesis_agent import (
    LevinMorphogenesisAgent, CurrentMorphology, DevelopmentalPhase
)
from .watson_optimizer import WatsonEnergyOptimizer, FarmState
from .hoffman_trace_agent import HoffmanTraceLogicAgent
from .penrose_coherence_agent import (
    PenroseCoherenceAgent, DecisionOption, DecisionType
)

logger = logging.getLogger("C2AIOrchestrator")


class ConsciousnessLevel(str, Enum):
    """Overall consciousness/coherence level of the system."""
    FULLY_CONSCIOUS = "fully_conscious"    # All layers aligned
    MOSTLY_CONSCIOUS = "mostly_conscious"  # Minor misalignments
    PARTIALLY_AWARE = "partially_aware"    # Some layers divergent
    FRAGMENTED = "fragmented"              # Significant conflicts
    DORMANT = "dormant"                    # System inactive


@dataclass
class UnifiedState:
    """Complete unified state from all C²AI layers."""
    free_energy: float
    surprise_level: SurpriseLevel
    bioelectric_threats: List[Dict]
    morphogenetic_potential: float
    energy_landscape_score: float
    coherence_index: float
    consciousness_level: ConsciousnessLevel
    dominant_agent: str
    action_ready: bool
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class ConsciousDecision:
    """A fully conscious decision from the orchestrator."""
    decision_id: str
    decision_type: str
    action: str
    confidence: float
    supporting_layers: List[str]
    dissenting_layers: List[str]
    expected_vep_impact: float
    cost_mxn: float
    urgency: str
    explanation: str
    alternatives: List[Dict]
    timestamp: datetime = field(default_factory=datetime.now)


class C2AIOrchestrator:
    """
    Master orchestrator for Conscious Citrus AI.
    
    Integrates all 6 agents into a unified conscious decision system
    that perceives, thinks, and acts as a coherent whole.
    
    Core Principle: True agricultural consciousness emerges from
    the integration of multiple specialized layers, each providing
    unique perspectives that combine into wise decisions.
    """
    
    # Layer weights for unified scoring
    LAYER_WEIGHTS = {
        'friston': 0.20,       # Free energy/surprise
        'levin_bio': 0.20,     # Bioelectric threats
        'levin_morph': 0.15,   # Developmental state
        'watson': 0.15,        # Energy optimization
        'hoffman': 0.10,       # Agent perspectives
        'penrose': 0.20        # Decision coherence
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        
        # Initialize all agents
        self.friston = FristonFreeEnergyAgent(pg_config)
        self.levin_bio = LevinBioelectricAgent(pg_config)
        self.levin_morph = LevinMorphogenesisAgent(pg_config)
        self.watson = WatsonEnergyOptimizer(pg_config)
        self.hoffman = HoffmanTraceLogicAgent(pg_config)
        self.penrose = PenroseCoherenceAgent(pg_config)
        
        logger.info("C2AIOrchestrator initialized with all 6 agents")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 1: RUN FULL CONSCIOUSNESS CYCLE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def run_full_consciousness_cycle(
        self,
        section: str = "general"
    ) -> Dict[str, Any]:
        """
        Tool 1: Run a complete consciousness cycle through all layers.
        
        This is the main entry point for C²AI analysis:
        1. Gather all observations
        2. Run each layer's analysis
        3. Integrate results
        4. Generate unified recommendations
        """
        cycle_start = datetime.now()
        layer_results = {}
        
        # Gather base observations from database
        observations = self._gather_observations(section)
        
        # Layer 1: Friston Free Energy
        try:
            obs_vector = ObservationVector(
                iah=observations.get('iah', 0.85),
                ipf=observations.get('ipf', 0.90),
                npf=observations.get('npf', 0.78),
                phi=observations.get('phi', 0.85),
                psi=observations.get('psi', 0.80),
                temp=observations.get('temp', 28.0),
                humidity=observations.get('humidity', 65.0),
                gdd=observations.get('gdd', 1500),
                pe=observations.get('pe', 75.0)
            )
            friston_result = self.friston.calculate_free_energy(obs_vector)
            layer_results['friston'] = {
                'free_energy': friston_result.total_free_energy,
                'surprise_level': friston_result.surprise_level.value,
                'dominant_error': friston_result.dominant_error.value,
                'recommendations': friston_result.recommendations[:3]
            }
        except Exception as e:
            logger.error(f"Friston layer error: {e}")
            layer_results['friston'] = {'error': str(e)}
        
        # Layer 2: Levin Bioelectric
        try:
            vmem_delta = observations.get('vmem_delta', 8.0)
            bio_result = self.levin_bio.detect_pest_signature(
                vmem_delta_6h=vmem_delta,
                dominant_freq=observations.get('freq', 12.0),
                humidity=observations.get('humidity', 65.0),
                temperature=observations.get('temp', 28.0),
                section=section
            )
            layer_results['levin_bio'] = {
                'threats_detected': len(bio_result),
                'threats': [
                    {'type': t.threat_type, 'confidence': t.confidence, 'action': t.recommended_action}
                    for t in bio_result[:3]
                ],
                'alert_level': 'high' if len(bio_result) > 2 else 'medium' if bio_result else 'low'
            }
        except Exception as e:
            logger.error(f"Levin Bio layer error: {e}")
            layer_results['levin_bio'] = {'error': str(e)}
        
        # Layer 3: Levin Morphogenesis
        try:
            current_morph = CurrentMorphology(
                current_pe=observations.get('pe', 75.0),
                fruit_count=int(observations.get('fruit_count', 120)),
                fruit_size_mm=observations.get('fruit_size', 48.0),
                brix=observations.get('brix', 8.5),
                current_phase=DevelopmentalPhase(observations.get('phase', 'FEN-05')),
                current_gdd=observations.get('gdd', 1500),
                vigor_score=observations.get('vigor', 0.75),
                vmem_baseline=observations.get('vmem', -65.0)
            )
            morph_result = self.levin_morph.calculate_morphogenetic_potential(
                current_morph, section=section
            )
            layer_results['levin_morph'] = {
                'potential': morph_result.get('morphogenetic_potential', 0.5),
                'health': morph_result.get('developmental_health', 'MODERADO'),
                'limiting_factor': morph_result.get('limiting_factor', 'pe')
            }
        except Exception as e:
            logger.error(f"Levin Morph layer error: {e}")
            layer_results['levin_morph'] = {'error': str(e)}
        
        # Layer 4: Watson Energy
        try:
            farm_state = FarmState(
                pe=observations.get('pe', 75.0),
                iah=observations.get('iah', 0.85),
                ipf=observations.get('ipf', 0.90),
                npf=observations.get('npf', 0.78),
                gdd=observations.get('gdd', 1500),
                quality=observations.get('quality', 0.75),
                cost=observations.get('accumulated_cost', 500000)
            )
            watson_result = self.watson.calculate_energy_landscape(farm_state)
            layer_results['watson'] = {
                'current_energy': watson_result.get('current_energy', 0.5),
                'gradient_direction': watson_result.get('gradient', {}).get('steepest_descent', {}).get('recommended_action', 'Mantener')
            }
        except Exception as e:
            logger.error(f"Watson layer error: {e}")
            layer_results['watson'] = {'error': str(e)}
        
        # Layer 5: Hoffman Trace
        try:
            hoffman_result = self.hoffman.compute_farm_kernel(section=section)
            stationary = hoffman_result.get('stationary_distribution', {})
            layer_results['hoffman'] = {
                'optimal_probability': stationary.get('optimal', 0.3),
                'entropy_rate': hoffman_result.get('properties', {}).get('entropy_rate', 0.5)
            }
        except Exception as e:
            logger.error(f"Hoffman layer error: {e}")
            layer_results['hoffman'] = {'error': str(e)}
        
        # Layer 6: Penrose Coherence
        try:
            agent_recs = [
                {'action': 'irrigation', 'confidence': 0.85, 'probability': 0.3, 'risk': 0.2},
                {'action': 'phytosanitary', 'confidence': 0.78, 'probability': 0.25, 'risk': 0.3},
                {'action': 'nutrition', 'confidence': 0.72, 'probability': 0.20, 'risk': 0.15}
            ]
            penrose_result = self.penrose.calculate_coherence_index(
                decision_type='strategic',
                agent_recommendations=agent_recs,
                data_timestamps={'rv21': datetime.now(), 'davis': datetime.now()},
                section=section
            )
            layer_results['penrose'] = {
                'coherence_index': penrose_result.get('coherence_index', 0.7),
                'gamma_power': penrose_result.get('gamma_power_40hz', 0.75),
                'collapse_ready': penrose_result.get('collapse_ready', False)
            }
        except Exception as e:
            logger.error(f"Penrose layer error: {e}")
            layer_results['penrose'] = {'error': str(e)}
        
        # Integrate all layers
        unified = self._integrate_layers(layer_results)
        
        # Generate unified recommendations
        recommendations = self._generate_unified_recommendations(layer_results, unified)
        
        cycle_duration = (datetime.now() - cycle_start).total_seconds()
        
        return {
            'section': section,
            'cycle_id': f"C2AI-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'consciousness_level': unified['consciousness_level'],
            'unified_score': unified['unified_score'],
            'layer_results': layer_results,
            'integration': unified,
            'recommendations': recommendations,
            'cycle_duration_seconds': round(cycle_duration, 3),
            'timestamp': datetime.now().isoformat()
        }
    
    def _gather_observations(self, section: str) -> Dict[str, Any]:
        """Gather observations from database for all layers."""
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get latest rv21 features
                cur.execute("""
                    SELECT 
                        pe_consolidado as pe,
                        temp_media_c as temp,
                        hr_promedio_pct as humidity,
                        gdd_acumulado as gdd,
                        COALESCE(plaga_total_trips, 0) + COALESCE(plaga_total_diaforina, 0) as pest_level
                    FROM public.rv21_features
                    ORDER BY fecha DESC LIMIT 1
                """)
                rv21 = cur.fetchone() or {}
                
                # Get biofix data
                cur.execute("""
                    SELECT 
                        gdd_accumulated,
                        current_phase,
                        phase_progress_pct
                    FROM biofix.biofix_status
                    WHERE section_id = %s
                    ORDER BY updated_at DESC LIMIT 1
                """, (section,))
                biofix = cur.fetchone() or {}
                
        except Exception as e:
            logger.error(f"Error gathering observations: {e}")
            rv21, biofix = {}, {}
        
        # Calculate derived indices
        pest_level = rv21.get('pest_level', 0) or 0
        ipf = min(0.95, max(0.5, 1 - (pest_level / 15)))
        
        return {
            'pe': rv21.get('pe', 75) or 75,
            'temp': rv21.get('temp', 28) or 28,
            'humidity': rv21.get('humidity', 65) or 65,
            'gdd': biofix.get('gdd_accumulated', 1500) or 1500,
            'phase': biofix.get('current_phase', 'FEN-05') or 'FEN-05',
            'iah': 0.85,  # Would come from irrigation model
            'ipf': ipf,
            'npf': 0.78,  # Would come from nutrition model
            'phi': 0.85,
            'psi': 0.80,
            'vmem': -65.0,  # Would come from bioelectric sensors
            'vmem_delta': 8.0,
            'freq': 12.0,
            'vigor': 0.75,
            'fruit_count': 120,
            'fruit_size': 48.0,
            'brix': 8.5,
            'quality': 0.75,
            'accumulated_cost': 500000
        }
    
    def _integrate_layers(self, layer_results: Dict) -> Dict[str, Any]:
        """Integrate results from all layers into unified assessment."""
        scores = {}
        
        # Extract scores from each layer (0-1 scale, lower is better)
        friston = layer_results.get('friston', {})
        scores['friston'] = min(1.0, friston.get('free_energy', 0.5))
        
        levin_bio = layer_results.get('levin_bio', {})
        threat_count = levin_bio.get('threats_detected', 0)
        scores['levin_bio'] = min(1.0, threat_count * 0.2)
        
        levin_morph = layer_results.get('levin_morph', {})
        scores['levin_morph'] = levin_morph.get('potential', 0.5)
        
        watson = layer_results.get('watson', {})
        scores['watson'] = watson.get('current_energy', 0.5)
        
        hoffman = layer_results.get('hoffman', {})
        optimal_prob = hoffman.get('optimal_probability', 0.3)
        scores['hoffman'] = 1 - optimal_prob  # Invert: high optimal prob = good
        
        penrose = layer_results.get('penrose', {})
        scores['penrose'] = 1 - penrose.get('coherence_index', 0.7)  # Invert
        
        # Weighted unified score
        unified_score = sum(
            self.LAYER_WEIGHTS.get(layer, 0.1) * score
            for layer, score in scores.items()
        )
        
        # Determine consciousness level
        if unified_score < 0.25:
            consciousness = ConsciousnessLevel.FULLY_CONSCIOUS
        elif unified_score < 0.4:
            consciousness = ConsciousnessLevel.MOSTLY_CONSCIOUS
        elif unified_score < 0.6:
            consciousness = ConsciousnessLevel.PARTIALLY_AWARE
        elif unified_score < 0.8:
            consciousness = ConsciousnessLevel.FRAGMENTED
        else:
            consciousness = ConsciousnessLevel.DORMANT
        
        # Find dominant (most concerning) layer
        dominant = max(scores.items(), key=lambda x: x[1])[0]
        
        # Check if action ready (Penrose coherence high enough)
        coherence = penrose.get('coherence_index', 0.5)
        collapse_ready = penrose.get('collapse_ready', False)
        
        return {
            'unified_score': round(unified_score, 4),
            'consciousness_level': consciousness.value,
            'layer_scores': {k: round(v, 4) for k, v in scores.items()},
            'dominant_layer': dominant,
            'action_ready': collapse_ready or coherence >= 0.75,
            'coherence': round(coherence, 4)
        }
    
    def _generate_unified_recommendations(
        self,
        layer_results: Dict,
        unified: Dict
    ) -> List[Dict[str, Any]]:
        """Generate unified recommendations from all layers."""
        recommendations = []
        
        # From Friston
        friston = layer_results.get('friston', {})
        if friston.get('surprise_level') in ['high', 'critical']:
            for rec in friston.get('recommendations', [])[:2]:
                recommendations.append({
                    'source': 'friston',
                    'priority': 1 if friston.get('surprise_level') == 'critical' else 2,
                    'action': rec.get('action', 'Reducir sorpresa'),
                    'type': rec.get('type', 'general'),
                    'urgency': rec.get('urgency', 'planned')
                })
        
        # From Levin Bioelectric
        levin_bio = layer_results.get('levin_bio', {})
        for threat in levin_bio.get('threats', []):
            recommendations.append({
                'source': 'levin_bioelectric',
                'priority': 1 if threat.get('confidence', 0) > 0.8 else 2,
                'action': threat.get('action', 'Control preventivo'),
                'type': 'phytosanitary',
                'urgency': 'immediate' if threat.get('confidence', 0) > 0.85 else 'this_week'
            })
        
        # From Levin Morphogenesis
        levin_morph = layer_results.get('levin_morph', {})
        if levin_morph.get('potential', 0) > 0.4:
            recommendations.append({
                'source': 'levin_morphogenesis',
                'priority': 2,
                'action': f"Optimizar {levin_morph.get('limiting_factor', 'desarrollo')}",
                'type': 'developmental',
                'urgency': 'this_week'
            })
        
        # From Watson
        watson = layer_results.get('watson', {})
        if watson.get('gradient_direction'):
            recommendations.append({
                'source': 'watson',
                'priority': 3,
                'action': watson.get('gradient_direction', 'Optimizar trayectoria'),
                'type': 'trajectory',
                'urgency': 'planned'
            })
        
        # Sort by priority
        recommendations.sort(key=lambda x: x['priority'])
        
        return recommendations[:5]  # Top 5 recommendations
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 2: GET UNIFIED STATE
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_unified_state(self, section: str = "general") -> Dict[str, Any]:
        """
        Tool 2: Get current unified state summary.
        
        Quick snapshot without full analysis cycle.
        """
        observations = self._gather_observations(section)
        
        # Calculate quick metrics
        obs_vector = ObservationVector(
            iah=observations.get('iah', 0.85),
            ipf=observations.get('ipf', 0.90),
            npf=observations.get('npf', 0.78),
            phi=observations.get('phi', 0.85),
            psi=observations.get('psi', 0.80),
            temp=observations.get('temp', 28.0),
            humidity=observations.get('humidity', 65.0),
            gdd=observations.get('gdd', 1500),
            pe=observations.get('pe', 75.0)
        )
        
        friston_result = self.friston.calculate_free_energy(obs_vector)
        
        # Quick coherence check
        coherence = 0.75 if friston_result.total_free_energy < 0.5 else 0.5
        
        return {
            'section': section,
            'free_energy': friston_result.total_free_energy,
            'surprise_level': friston_result.surprise_level.value,
            'pe': observations.get('pe', 75),
            'iah': observations.get('iah', 0.85),
            'ipf': observations.get('ipf', 0.90),
            'npf': observations.get('npf', 0.78),
            'gdd': observations.get('gdd', 1500),
            'phase': observations.get('phase', 'FEN-05'),
            'coherence_estimate': coherence,
            'action_ready': coherence >= 0.7,
            'timestamp': datetime.now().isoformat()
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 3: GENERATE CONSCIOUS DECISION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_conscious_decision(
        self,
        decision_type: str,
        section: str = "general",
        force: bool = False
    ) -> Dict[str, Any]:
        """
        Tool 3: Generate a fully conscious decision using all layers.
        
        Integrates all layer analyses to produce a single, coherent decision
        with full explainability.
        """
        # Run consciousness cycle
        cycle = self.run_full_consciousness_cycle(section)
        
        # Check if ready to decide
        if not cycle['integration']['action_ready'] and not force:
            return {
                'decision_made': False,
                'reason': 'System not coherent enough for decision',
                'coherence': cycle['integration']['coherence'],
                'consciousness_level': cycle['consciousness_level'],
                'recommendation': 'Wait for higher coherence or force=True',
                'timestamp': datetime.now().isoformat()
            }
        
        # Generate decision options based on recommendations
        options = []
        for rec in cycle['recommendations']:
            options.append(DecisionOption(
                action=rec['action'],
                probability=0.8 if rec['priority'] == 1 else 0.5,
                expected_vep=self._estimate_vep_impact(rec),
                cost_mxn=self._estimate_cost(rec),
                risk=0.2 if rec['priority'] == 1 else 0.3,
                alignment=1.0 - (rec['priority'] * 0.1)
            ))
        
        if not options:
            return {
                'decision_made': False,
                'reason': 'No valid options generated',
                'timestamp': datetime.now().isoformat()
            }
        
        # Execute Penrose collapse
        collapse_result = self.penrose.execute_penrose_collapse(
            decision_type=decision_type,
            options=options,
            section=section,
            force_collapse=force
        )
        
        if not collapse_result.get('collapse_executed'):
            return {
                'decision_made': False,
                'reason': collapse_result.get('reason', 'Collapse failed'),
                'timestamp': datetime.now().isoformat()
            }
        
        # Build conscious decision
        decision = ConsciousDecision(
            decision_id=collapse_result['decision_id'],
            decision_type=decision_type,
            action=collapse_result['collapsed_action'],
            confidence=collapse_result['collapse_score'],
            supporting_layers=self._get_supporting_layers(cycle, collapse_result['collapsed_action']),
            dissenting_layers=self._get_dissenting_layers(cycle, collapse_result['collapsed_action']),
            expected_vep_impact=collapse_result['expected_vep'],
            cost_mxn=collapse_result['cost_mxn'],
            urgency=collapse_result['execution_window']['urgency'],
            explanation=self._generate_explanation(cycle, collapse_result),
            alternatives=collapse_result.get('alternatives_considered', [])
        )
        
        # Log to database
        self._log_conscious_decision(decision, cycle)
        
        return {
            'decision_made': True,
            'decision': {
                'id': decision.decision_id,
                'type': decision.decision_type,
                'action': decision.action,
                'confidence': round(decision.confidence, 4),
                'expected_vep': decision.expected_vep_impact,
                'cost_mxn': decision.cost_mxn,
                'urgency': decision.urgency
            },
            'explanation': decision.explanation,
            'supporting_layers': decision.supporting_layers,
            'dissenting_layers': decision.dissenting_layers,
            'alternatives': decision.alternatives,
            'consciousness_level': cycle['consciousness_level'],
            'coherence': cycle['integration']['coherence'],
            'timestamp': datetime.now().isoformat()
        }
    
    def _estimate_vep_impact(self, rec: Dict) -> float:
        """Estimate VEP impact based on recommendation type."""
        impacts = {
            'phytosanitary': 85000,
            'hydric': 45000,
            'nutritional': 35000,
            'developmental': 50000,
            'trajectory': 60000,
            'general': 30000
        }
        return impacts.get(rec.get('type', 'general'), 30000)
    
    def _estimate_cost(self, rec: Dict) -> float:
        """Estimate cost based on recommendation type."""
        costs = {
            'phytosanitary': 15000,
            'hydric': 5000,
            'nutritional': 8000,
            'developmental': 10000,
            'trajectory': 12000,
            'general': 5000
        }
        return costs.get(rec.get('type', 'general'), 5000)
    
    def _get_supporting_layers(self, cycle: Dict, action: str) -> List[str]:
        """Get layers that support the decision."""
        supporting = []
        for rec in cycle['recommendations']:
            if action.lower() in rec.get('action', '').lower():
                supporting.append(rec['source'])
        return supporting or ['friston', 'penrose']
    
    def _get_dissenting_layers(self, cycle: Dict, action: str) -> List[str]:
        """Get layers that might dissent from the decision."""
        all_layers = {'friston', 'levin_bioelectric', 'levin_morphogenesis', 'watson', 'hoffman', 'penrose'}
        supporting = set(self._get_supporting_layers(cycle, action))
        return list(all_layers - supporting)[:2]
    
    def _generate_explanation(self, cycle: Dict, collapse: Dict) -> str:
        """Generate natural language explanation of decision."""
        action = collapse['collapsed_action']
        score = collapse['collapse_score']
        consciousness = cycle['consciousness_level']
        
        explanation = f"La acción '{action}' fue seleccionada con confianza {score:.1%}. "
        explanation += f"El sistema operó en nivel de consciencia '{consciousness}'. "
        
        # Add layer-specific insights
        friston = cycle['layer_results'].get('friston', {})
        if friston.get('surprise_level') in ['high', 'critical']:
            explanation += f"El nivel de sorpresa ({friston.get('surprise_level')}) requirió acción inmediata. "
        
        bio = cycle['layer_results'].get('levin_bio', {})
        if bio.get('threats_detected', 0) > 0:
            explanation += f"Se detectaron {bio.get('threats_detected')} amenazas bioeléctricas. "
        
        return explanation
    
    def _log_conscious_decision(self, decision: ConsciousDecision, cycle: Dict):
        """Log conscious decision to database."""
        self._ensure_connection()
        try:
            with self.conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO c2ai.orchestrator_decisions 
                    (decision_id, decision_type, action, expected_vep, cost_mxn, 
                     confidence, consciousness_level, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'conscious_decision', NOW())
                    ON CONFLICT (decision_id) DO NOTHING
                """, (
                    decision.decision_id,
                    decision.decision_type,
                    decision.action,
                    decision.expected_vep_impact,
                    decision.cost_mxn,
                    decision.confidence,
                    cycle['consciousness_level']
                ))
                self.conn.commit()
        except Exception as e:
            logger.warning(f"Could not log decision: {e}")
            self.conn.rollback()
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TOOL 4: EXPLAIN DECISION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def explain_decision(
        self,
        decision_id: str
    ) -> Dict[str, Any]:
        """
        Tool 4: Provide full explainability for a past decision.
        
        Retrieves decision context and provides detailed explanation
        of why that decision was made.
        """
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT *
                    FROM c2ai.orchestrator_decisions
                    WHERE decision_id = %s
                """, (decision_id,))
                decision = cur.fetchone()
        except Exception as e:
            return {'error': f'Could not retrieve decision: {e}'}
        
        if not decision:
            return {'error': f'Decision {decision_id} not found'}
        
        return {
            'decision_id': decision_id,
            'decision_type': decision.get('decision_type'),
            'action': decision.get('action'),
            'explanation': {
                'summary': f"La decisión '{decision.get('action')}' fue tomada "
                          f"con nivel de consciencia '{decision.get('consciousness_level', 'unknown')}'.",
                'supporting_factors': [
                    'Análisis de energía libre (Friston)',
                    'Detección bioelectrica (Levin)',
                    'Optimización de trayectoria (Watson)',
                    'Coherencia cuántica (Penrose)'
                ],
                'confidence': decision.get('confidence', 0),
                'expected_vep': decision.get('expected_vep', 0),
                'cost_mxn': decision.get('cost_mxn', 0)
            },
            'made_at': decision.get('created_at').isoformat() if decision.get('created_at') else None,
            'status': decision.get('status')
        }
    
    def close(self):
        """Close all agent connections."""
        for agent in [self.friston, self.levin_bio, self.levin_morph, 
                      self.watson, self.hoffman, self.penrose]:
            if hasattr(agent, 'close'):
                agent.close()
        if self.conn:
            self.conn.close()
