"""
Levin Morphogenesis Agent - C²AI Framework Layer 2B
====================================================
Implements Michael Levin's morphogenetic field concepts for
plant development and goal-directed growth.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Tools:
1. calculate_morphogenetic_potential() - Distance to goal
2. assess_developmental_trajectory() - Is plant on track?
3. detect_goal_state_conflicts() - Internal conflicts
4. prescribe_bioelectric_intervention() - Course correction
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from enum import Enum
from datetime import datetime, timedelta
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("LevinMorphogenesisAgent")


class DevelopmentalPhase(str, Enum):
    DORMANT = "FEN-01"
    BUD_BREAK = "FEN-02"
    FLOWERING = "FEN-03"
    FRUIT_SET = "FEN-04"
    FRUIT_GROWTH = "FEN-05"
    MATURATION = "FEN-06"
    HARVEST = "FEN-07"


class GoalConflictType(str, Enum):
    RESOURCE_COMPETITION = "resource_competition"
    STRESS_INDUCED = "stress_induced"
    HORMONAL_IMBALANCE = "hormonal_imbalance"
    ENVIRONMENTAL = "environmental"


@dataclass
class MorphogeneticGoal:
    target_pe: float
    target_fruit_count: int
    target_fruit_size_mm: float
    target_brix: float
    target_phase: DevelopmentalPhase
    target_gdd: float


@dataclass
class CurrentMorphology:
    current_pe: float
    fruit_count: int
    fruit_size_mm: float
    brix: float
    current_phase: DevelopmentalPhase
    current_gdd: float
    vigor_score: float
    vmem_baseline: float


class LevinMorphogenesisAgent:
    """Morphogenetic field guidance for optimal plant development."""
    
    REFERENCE_GOALS = {
        'optimal_pe': 95.0,
        'optimal_fruit_count': 150,
        'optimal_fruit_size_mm': 55.0,
        'optimal_brix': 9.5,
        'harvest_gdd': 1800,
        'optimal_vigor': 0.85
    }
    
    def __init__(self, pg_config: Dict[str, str]):
        self.pg_config = pg_config
        self.conn = None
        logger.info("LevinMorphogenesisAgent initialized")
    
    def _ensure_connection(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg2.connect(**self.pg_config)
    
    def calculate_morphogenetic_potential(
        self,
        current: CurrentMorphology,
        goal: Optional[MorphogeneticGoal] = None,
        section: str = "general"
    ) -> Dict[str, Any]:
        """Tool 1: Calculate morphogenetic potential (distance to goal)."""
        if goal is None:
            goal = MorphogeneticGoal(
                target_pe=self.REFERENCE_GOALS['optimal_pe'],
                target_fruit_count=self.REFERENCE_GOALS['optimal_fruit_count'],
                target_fruit_size_mm=self.REFERENCE_GOALS['optimal_fruit_size_mm'],
                target_brix=self.REFERENCE_GOALS['optimal_brix'],
                target_phase=DevelopmentalPhase.HARVEST,
                target_gdd=self.REFERENCE_GOALS['harvest_gdd']
            )
        
        gaps = {
            'pe': (goal.target_pe - current.current_pe) / goal.target_pe,
            'fruit_count': (goal.target_fruit_count - current.fruit_count) / goal.target_fruit_count,
            'fruit_size': (goal.target_fruit_size_mm - current.fruit_size_mm) / goal.target_fruit_size_mm,
            'brix': (goal.target_brix - current.brix) / goal.target_brix,
            'gdd': (goal.target_gdd - current.current_gdd) / goal.target_gdd
        }
        
        weights = {'pe': 0.30, 'fruit_count': 0.20, 'fruit_size': 0.20, 'brix': 0.15, 'gdd': 0.15}
        M = np.sqrt(sum(weights[k] * gaps[k]**2 for k in gaps))
        gradient = {k: round(-gaps[k] * weights[k] / max(M, 0.01), 4) for k in gaps}
        
        if M < 0.15: health, color = "EXCELENTE", "green"
        elif M < 0.30: health, color = "BUENO", "lime"
        elif M < 0.50: health, color = "MODERADO", "yellow"
        elif M < 0.70: health, color = "BAJO", "orange"
        else: health, color = "CRÍTICO", "red"
        
        abs_gaps = {k: abs(v) for k, v in gaps.items()}
        limiting_factor = max(abs_gaps.items(), key=lambda x: x[1])[0]
        
        return {
            'section': section,
            'morphogenetic_potential': round(M, 4),
            'developmental_health': health,
            'color': color,
            'gaps': {k: round(v, 4) for k, v in gaps.items()},
            'gradient': gradient,
            'limiting_factor': limiting_factor,
            'timestamp': datetime.now().isoformat()
        }
    
    def assess_developmental_trajectory(
        self,
        section: str,
        lookback_days: int = 30
    ) -> Dict[str, Any]:
        """Tool 2: Assess if plant is on track developmentally."""
        self._ensure_connection()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT fecha, pe_consolidado, gdd_acumulado
                    FROM public.rv21_features
                    WHERE fecha >= CURRENT_DATE - INTERVAL '%s days'
                    ORDER BY fecha
                """, (lookback_days,))
                history = cur.fetchall()
                
                cur.execute("""
                    SELECT gdd_accumulated, current_phase, phase_progress_pct, days_to_harvest
                    FROM biofix.biofix_status
                    WHERE section_id = %s
                    ORDER BY updated_at DESC LIMIT 1
                """, (section,))
                biofix = cur.fetchone()
        except Exception as e:
            logger.warning(f"Could not fetch trajectory data: {e}")
            history, biofix = [], None
        
        if len(history) >= 2:
            pe_values = [h.get('pe_consolidado', 75) or 75 for h in history]
            gdd_values = [h.get('gdd_acumulado', 1000) or 1000 for h in history]
            pe_slope = np.polyfit(range(len(pe_values)), pe_values, 1)[0]
            gdd_rate = (gdd_values[-1] - gdd_values[0]) / max(len(gdd_values), 1)
        else:
            pe_slope, gdd_rate = 0, 10
        
        expected_gdd_rate = 12
        gdd_acceleration = gdd_rate / expected_gdd_rate
        
        if pe_slope > 0.5 and gdd_acceleration >= 0.9:
            status, color = "ON_TRACK", "green"
        elif pe_slope >= 0 and gdd_acceleration >= 0.8:
            status, color = "SLIGHTLY_SLOW", "yellow"
        elif pe_slope < 0 or gdd_acceleration < 0.7:
            status, color = "DEVIATING", "orange"
        else:
            status, color = "CRITICAL", "red"
        
        current_gdd = biofix.get('gdd_accumulated', 1200) if biofix else 1200
        target_gdd = self.REFERENCE_GOALS['harvest_gdd']
        days_to_goal = (target_gdd - current_gdd) / gdd_rate if gdd_rate > 0 else 999
        
        return {
            'section': section,
            'trajectory_status': status,
            'color': color,
            'metrics': {
                'pe_slope': round(pe_slope, 4),
                'gdd_rate': round(gdd_rate, 2),
                'gdd_acceleration': round(gdd_acceleration, 3)
            },
            'projection': {
                'days_to_harvest': round(days_to_goal, 0),
                'expected_harvest_date': (datetime.now() + timedelta(days=days_to_goal)).strftime('%Y-%m-%d')
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def detect_goal_state_conflicts(
        self,
        current: CurrentMorphology,
        section: str = "general"
    ) -> Dict[str, Any]:
        """Tool 3: Detect conflicts in developmental goals."""
        conflicts = []
        
        if current.vigor_score > 0.9 and current.fruit_count < 100:
            conflicts.append({
                'type': GoalConflictType.RESOURCE_COMPETITION.value,
                'description': 'Alto vigor, bajo cuajado - recursos hacia vegetativo',
                'severity': 0.7,
                'resolution': 'Reducir N, aplicar paclobutrazol si severo'
            })
        
        if current.vigor_score < 0.5 and current.fruit_count > 200:
            conflicts.append({
                'type': GoalConflictType.RESOURCE_COMPETITION.value,
                'description': 'Sobrecarga de frutos agotando planta',
                'severity': 0.8,
                'resolution': 'Raleo de frutos, nutrición de soporte'
            })
        
        if current.vmem_baseline > -50:
            conflicts.append({
                'type': GoalConflictType.STRESS_INDUCED.value,
                'description': 'Vmem elevado indica estrés - planta en modo supervivencia',
                'severity': 0.75,
                'resolution': 'Identificar y mitigar estresor'
            })
        
        if current.brix > 10 and current.fruit_size_mm < 45:
            conflicts.append({
                'type': GoalConflictType.HORMONAL_IMBALANCE.value,
                'description': 'Maduración prematura - frutos pequeños con alto Brix',
                'severity': 0.65,
                'resolution': 'Revisar balance hormonal GA/CK, hidratación'
            })
        
        total_severity = sum(c['severity'] for c in conflicts)
        conflict_score = min(1.0, total_severity / 2)
        
        if conflict_score >= 0.7: status, color = "CONFLICTO SEVERO", "red"
        elif conflict_score >= 0.4: status, color = "CONFLICTO MODERADO", "orange"
        elif conflict_score > 0: status, color = "CONFLICTO MENOR", "yellow"
        else: status, color = "SIN CONFLICTOS", "green"
        
        return {
            'section': section,
            'conflict_status': status,
            'conflict_score': round(conflict_score, 3),
            'color': color,
            'conflicts': conflicts,
            'timestamp': datetime.now().isoformat()
        }
    
    def prescribe_bioelectric_intervention(
        self,
        morphogenetic_potential: float,
        conflicts: List[Dict[str, Any]],
        current_vmem: float,
        section: str = "general"
    ) -> Dict[str, Any]:
        """Tool 4: Prescribe intervention to correct developmental trajectory."""
        prescriptions = []
        
        if morphogenetic_potential > 0.5:
            prescriptions.append({
                'intervention': 'Aplicación de bioestimulantes',
                'products': ['Ácidos húmicos', 'Aminoácidos', 'Extracto de algas'],
                'dosage': '2-3 L/ha',
                'frequency': 'Quincenal',
                'expected_effect': 'Reducir potencial morfogenético en 20-30%',
                'priority': 'high'
            })
        
        if current_vmem > -60:
            prescriptions.append({
                'intervention': 'Mitigación de estrés',
                'products': ['Silicio foliar', 'Prolina', 'Glicina-betaína'],
                'dosage': '1.5 L/ha',
                'frequency': 'Semanal durante estrés',
                'expected_effect': 'Normalizar Vmem a -70mV',
                'priority': 'high'
            })
        
        for conflict in conflicts:
            if conflict.get('type') == GoalConflictType.RESOURCE_COMPETITION.value:
                if 'vegetativo' in conflict.get('description', ''):
                    prescriptions.append({
                        'intervention': 'Regulación hormonal',
                        'products': ['Paclobutrazol', 'Prohexadione-Ca'],
                        'dosage': '0.5-1.0 L/ha',
                        'frequency': 'Una aplicación',
                        'expected_effect': 'Redirigir recursos a frutos',
                        'priority': 'medium'
                    })
                else:
                    prescriptions.append({
                        'intervention': 'Raleo químico/manual',
                        'products': ['NAA', 'Carbaryl'],
                        'dosage': 'Variable según carga',
                        'frequency': 'Una aplicación',
                        'expected_effect': 'Reducir carga 20-30%',
                        'priority': 'medium'
                    })
        
        if morphogenetic_potential > 0.3:
            prescriptions.append({
                'intervention': 'Optimización nutricional',
                'products': ['NPK balanceado', 'Micronutrientes quelatados'],
                'dosage': 'Según análisis foliar',
                'frequency': 'Mensual',
                'expected_effect': 'Acelerar desarrollo hacia meta',
                'priority': 'medium'
            })
        
        total_cost = sum(
            12000 if p['priority'] == 'high' else 8000 
            for p in prescriptions
        )
        
        return {
            'section': section,
            'morphogenetic_potential': morphogenetic_potential,
            'current_vmem': current_vmem,
            'conflicts_addressed': len(conflicts),
            'prescriptions': prescriptions,
            'total_estimated_cost_mxn': total_cost,
            'expected_potential_reduction': round(min(0.5, morphogenetic_potential * 0.4), 3),
            'implementation_priority': 'immediate' if morphogenetic_potential > 0.6 else 'planned',
            'monitoring_frequency': 'weekly' if morphogenetic_potential > 0.4 else 'biweekly',
            'timestamp': datetime.now().isoformat()
        }
    
    def close(self):
        if self.conn:
            self.conn.close()
