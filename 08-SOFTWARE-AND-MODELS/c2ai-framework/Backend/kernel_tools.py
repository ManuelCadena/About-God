"""
Kernel Tools - 36 Function Tools para 9 MDP Kernels
=====================================================
Expone las funciones de los kernels Hoffman-Levin como tools para los agentes C²AI.

Arquitectura:
    Motor Unificado (SSOT) → real_data_provider → Kernels → kernel_tools → Agentes

Mapeo Kernel → Agente:
    - IPFKernel → LevinBioelectricAgent
    - IAHKernel, PSIKernel → WatsonEnergyOptimizer
    - NPFKernel, PHIKernel → LevinMorphogenesisAgent
    - LAIKernel → FristonFreeEnergyAgent
    - TRIMKernel → PenroseCoherenceAgent
    - INDKernel → HoffmanTraceLogicAgent
    - MarketKernel → C2AIOrchestrator

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 1.0
"""

import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parents[1]
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import logging
import json

logger = logging.getLogger("KernelTools")

try:
    from citrusmax_bioelectric.kernels import (
        IPFKernel, IAHKernel, NPFKernel,
        PsiKernel, PhiKernel, MarketKernel,
        TRIMKernel, INDKernel, LAIKernel
    )
    KERNELS_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Kernels not available: {e}")
    KERNELS_AVAILABLE = False


@dataclass
class KernelToolResult:
    """Resultado estándar de un kernel tool."""
    success: bool
    kernel_type: str
    section_id: str
    timestamp: str
    data: Dict[str, Any]
    error: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return asdict(self)
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict(), default=str)


_kernel_cache: Dict[str, Any] = {}

def _get_kernel(kernel_type: str, section_id: str = "S1"):
    """Obtiene o crea instancia de kernel con cache."""
    cache_key = f"{kernel_type}_{section_id}"
    if cache_key not in _kernel_cache:
        kernel_classes = {
            'ipf': IPFKernel,
            'iah': IAHKernel,
            'npf': NPFKernel,
            'psi': PsiKernel,
            'phi': PhiKernel,
            'market': MarketKernel,
            'trim': TRIMKernel,
            'ind': INDKernel,
            'lai': LAIKernel,
        }
        kernel_class = kernel_classes.get(kernel_type.lower())
        if kernel_class:
            _kernel_cache[cache_key] = kernel_class(section_id=section_id)
    return _kernel_cache.get(cache_key)


# =============================================================================
# IPF KERNEL TOOLS (LevinBioelectricAgent)
# =============================================================================

async def get_ipf_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del IPF (Índice Protección Fitosanitaria).
    
    Tool para: LevinBioelectricAgent
    
    Args:
        section_id: Sección de la finca (S1, S2, S3)
        
    Returns:
        Estado IPF con valor, banda, plagas/enfermedades, tendencia
    """
    try:
        kernel = _get_kernel('ipf', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True,
            kernel_type='IPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'ipf_value': state.ipf,
                'band': state.band,
                'trend': state.trend,
                'pest_pressure': state.pest_pressure(),
                'plagas': {
                    'trips': state.trips,
                    'diaforina': state.diaforina,
                    'minador': state.minador,
                    'arana_roja': state.arana_roja,
                },
                'enfermedades': {
                    'antracnosis': state.antracnosis,
                    'mancha_grasienta': state.mancha_grasienta,
                },
                'days_since_treatment': state.days_since_treatment,
                'recommended_action': state.metadata.get('recommended_action') if state.metadata else None
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_ipf_state: {e}")
        return KernelToolResult(
            success=False, kernel_type='IPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_ipf_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """
    Calcula la política óptima MDP para IPF.
    
    Tool para: LevinBioelectricAgent
    
    Args:
        section_id: Sección de la finca
        horizon: Semanas de horizonte de planificación
        
    Returns:
        Política óptima con acciones por semana, VEP proyectado, costo
    """
    try:
        kernel = _get_kernel('ipf', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(
            success=True,
            kernel_type='IPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'policy_type': 'optimal',
                'horizon_weeks': horizon,
                'total_vep': policy.total_vep,
                'total_cost': policy.total_cost,
                'roi': policy.roi,
                'actions': [
                    {
                        'week': i+1,
                        'action': step.action.name if hasattr(step.action, 'name') else str(step.action),
                        'expected_ipf': step.state_after.ipf if step.state_after else None,
                        'cost': step.cost
                    }
                    for i, step in enumerate(policy.steps[:horizon])
                ]
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_ipf_policy: {e}")
        return KernelToolResult(
            success=False, kernel_type='IPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def simulate_ipf_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """
    Simula una acción específica en el kernel IPF.
    
    Tool para: LevinBioelectricAgent
    
    Args:
        section_id: Sección de la finca
        action: Acción a simular (A0_NO_TRATAR, A1_RECETA_OPTIMA, etc.)
        weeks: Semanas a simular
        
    Returns:
        Trayectoria simulada con estados y recompensas
    """
    try:
        kernel = _get_kernel('ipf', section_id)
        state = await kernel.get_current_state()
        
        action_enum = None
        for a in kernel.get_available_actions(state):
            if a.name == action or str(a.value) == action:
                action_enum = a
                break
        
        if action_enum is None:
            return KernelToolResult(
                success=False, kernel_type='IPF', section_id=section_id,
                timestamp=datetime.now().isoformat(), data={},
                error=f"Acción '{action}' no válida"
            ).to_dict()
        
        trajectory = []
        current_state = state
        total_reward = 0
        
        for week in range(weeks):
            next_state = kernel.transition(current_state, action_enum)
            reward = kernel.reward(current_state, action_enum, next_state)
            total_reward += reward
            
            trajectory.append({
                'week': week + 1,
                'action': action_enum.name,
                'ipf_before': current_state.ipf,
                'ipf_after': next_state.ipf,
                'band': next_state.band,
                'reward': reward
            })
            current_state = next_state
        
        return KernelToolResult(
            success=True,
            kernel_type='IPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'action_simulated': action_enum.name,
                'weeks_simulated': weeks,
                'total_reward': total_reward,
                'final_ipf': current_state.ipf,
                'final_band': current_state.band,
                'trajectory': trajectory
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error simulate_ipf_action: {e}")
        return KernelToolResult(
            success=False, kernel_type='IPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_ipf_bands(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene las bandas de clasificación IPF.
    
    Tool para: LevinBioelectricAgent
    
    Returns:
        Bandas IPF con rangos, colores y acciones recomendadas
    """
    try:
        kernel = _get_kernel('ipf', section_id)
        state = await kernel.get_current_state()
        
        return KernelToolResult(
            success=True,
            kernel_type='IPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'current_value': state.ipf,
                'current_band': state.band,
                'bands': kernel.bands,
                'pest_semaforo': {
                    'verde': {'max': 0.3, 'accion': 'Sin acción'},
                    'amarillo': {'max': 0.6, 'accion': 'Monitorear'},
                    'rojo': {'max': 3.0, 'accion': 'Acción urgente'}
                }
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_ipf_bands: {e}")
        return KernelToolResult(
            success=False, kernel_type='IPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


# =============================================================================
# IAH KERNEL TOOLS (WatsonEnergyOptimizer)
# =============================================================================

async def get_iah_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del IAH (Índice Adecuación Hídrica).
    
    Tool para: WatsonEnergyOptimizer
    
    Returns:
        Estado IAH con balance hídrico, ETc, lluvia, riego
    """
    try:
        kernel = _get_kernel('iah', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True,
            kernel_type='IAH',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'iah_value': state.iah,
                'band': state.band,
                'trend': state.trend,
                'etc_mm': state.etc,
                'lluvia_7d_mm': state.lluvia_7d,
                'riego_7d_mm': state.riego_7d,
                'humedad_suelo_pct': state.humedad_suelo,
                'water_balance': state.water_balance(),
                'deficit_mm': state.deficit_mm(),
                'temperatura_c': state.temperatura,
                'forecast_lluvia_7d': state.forecast_lluvia_7d
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_iah_state: {e}")
        return KernelToolResult(
            success=False, kernel_type='IAH', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_iah_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """
    Calcula la política óptima de riego MDP.
    
    Tool para: WatsonEnergyOptimizer
    """
    try:
        kernel = _get_kernel('iah', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(
            success=True,
            kernel_type='IAH',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'policy_type': 'optimal',
                'horizon_weeks': horizon,
                'total_vep': policy.total_vep,
                'total_cost': policy.total_cost,
                'roi': policy.roi,
                'actions': [
                    {
                        'week': i+1,
                        'action': step.action.name if hasattr(step.action, 'name') else str(step.action),
                        'expected_iah': step.state_after.iah if step.state_after else None,
                        'riego_mm': step.cost / 50 if step.cost else 0
                    }
                    for i, step in enumerate(policy.steps[:horizon])
                ]
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_iah_policy: {e}")
        return KernelToolResult(
            success=False, kernel_type='IAH', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def simulate_iah_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """
    Simula una acción de riego en el kernel IAH.
    
    Tool para: WatsonEnergyOptimizer
    """
    try:
        kernel = _get_kernel('iah', section_id)
        state = await kernel.get_current_state()
        
        action_enum = None
        for a in kernel.get_available_actions(state):
            if a.name == action or str(a.value) == action:
                action_enum = a
                break
        
        if action_enum is None:
            return KernelToolResult(
                success=False, kernel_type='IAH', section_id=section_id,
                timestamp=datetime.now().isoformat(), data={},
                error=f"Acción '{action}' no válida"
            ).to_dict()
        
        trajectory = []
        current_state = state
        total_reward = 0
        
        for week in range(weeks):
            next_state = kernel.transition(current_state, action_enum)
            reward = kernel.reward(current_state, action_enum, next_state)
            total_reward += reward
            
            trajectory.append({
                'week': week + 1,
                'action': action_enum.name,
                'iah_before': current_state.iah,
                'iah_after': next_state.iah,
                'band': next_state.band,
                'reward': reward
            })
            current_state = next_state
        
        return KernelToolResult(
            success=True,
            kernel_type='IAH',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'action_simulated': action_enum.name,
                'weeks_simulated': weeks,
                'total_reward': total_reward,
                'final_iah': current_state.iah,
                'final_band': current_state.band,
                'trajectory': trajectory
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error simulate_iah_action: {e}")
        return KernelToolResult(
            success=False, kernel_type='IAH', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_iah_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación IAH."""
    try:
        kernel = _get_kernel('iah', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True,
            kernel_type='IAH',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'current_value': state.iah,
                'current_band': state.band,
                'bands': kernel.bands
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='IAH', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


# =============================================================================
# NPF KERNEL TOOLS (LevinMorphogenesisAgent)
# =============================================================================

async def get_npf_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del NPF (Nivel Provisión Fertilizantes).
    
    Tool para: LevinMorphogenesisAgent
    """
    try:
        kernel = _get_kernel('npf', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True,
            kernel_type='NPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'npf_value': state.npf,
                'band': state.band,
                'trend': state.trend,
                'nutrientes_foliares': {
                    'N': state.n_foliar,
                    'P': state.p_foliar,
                    'K': state.k_foliar,
                    'Ca': state.ca_foliar,
                    'Mg': state.mg_foliar
                },
                'nutrient_balance': state.nutrient_balance(),
                'limiting_nutrient': state.limiting_nutrient(),
                'days_since_fertilization': state.days_since_fertilization,
                'fen': state.fen
            }
        ).to_dict()
    except Exception as e:
        logger.error(f"Error get_npf_state: {e}")
        return KernelToolResult(
            success=False, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_npf_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima de fertilización MDP."""
    try:
        kernel = _get_kernel('npf', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(
            success=True,
            kernel_type='NPF',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'policy_type': 'optimal',
                'horizon_weeks': horizon,
                'total_vep': policy.total_vep,
                'total_cost': policy.total_cost,
                'roi': policy.roi,
                'actions': [
                    {
                        'week': i+1,
                        'action': step.action.name if hasattr(step.action, 'name') else str(step.action),
                        'expected_npf': step.state_after.npf if step.state_after else None
                    }
                    for i, step in enumerate(policy.steps[:horizon])
                ]
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def simulate_npf_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción de fertilización en el kernel NPF."""
    try:
        kernel = _get_kernel('npf', section_id)
        state = await kernel.get_current_state()
        
        action_enum = None
        for a in kernel.get_available_actions(state):
            if a.name == action:
                action_enum = a
                break
        
        if action_enum is None:
            return KernelToolResult(
                success=False, kernel_type='NPF', section_id=section_id,
                timestamp=datetime.now().isoformat(), data={},
                error=f"Acción '{action}' no válida"
            ).to_dict()
        
        trajectory = []
        current_state = state
        total_reward = 0
        
        for week in range(weeks):
            next_state = kernel.transition(current_state, action_enum)
            reward = kernel.reward(current_state, action_enum, next_state)
            total_reward += reward
            trajectory.append({
                'week': week + 1,
                'action': action_enum.name,
                'npf_before': current_state.npf,
                'npf_after': next_state.npf,
                'reward': reward
            })
            current_state = next_state
        
        return KernelToolResult(
            success=True, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'action_simulated': action_enum.name,
                'total_reward': total_reward,
                'final_npf': current_state.npf,
                'trajectory': trajectory
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_npf_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación NPF."""
    try:
        kernel = _get_kernel('npf', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'current_value': state.npf, 'current_band': state.band, 'bands': kernel.bands}
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='NPF', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


# =============================================================================
# PHI KERNEL TOOLS (LevinMorphogenesisAgent)
# =============================================================================

async def get_phi_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del PHI (Factor Fenológico).
    
    Tool para: LevinMorphogenesisAgent
    """
    try:
        kernel = _get_kernel('phi', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True,
            kernel_type='PHI',
            section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'phi_value': state.phi,
                'band': state.band,
                'trend': state.trend,
                'fen': state.fen,
                'gdd': state.gdd,
                'gdd_next_stage': state.gdd_next_stage,
                'days_to_next_stage': state.days_to_next,
                'market_sync': state.sync_market
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def get_phi_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima fenológica MDP."""
    try:
        kernel = _get_kernel('phi', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(
            success=True, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'policy_type': 'optimal',
                'horizon_weeks': horizon,
                'total_vep': policy.total_vep,
                'actions': [{'week': i+1, 'action': step.action.name if hasattr(step.action, 'name') else str(step.action)}
                           for i, step in enumerate(policy.steps[:horizon])]
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(
            success=False, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)
        ).to_dict()


async def simulate_phi_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción fenológica."""
    try:
        kernel = _get_kernel('phi', section_id)
        state = await kernel.get_current_state()
        action_enum = None
        for a in kernel.get_available_actions(state):
            if a.name == action:
                action_enum = a
                break
        if not action_enum:
            return KernelToolResult(success=False, kernel_type='PHI', section_id=section_id,
                timestamp=datetime.now().isoformat(), data={}, error=f"Acción '{action}' no válida").to_dict()
        
        trajectory = []
        current = state
        for w in range(weeks):
            next_s = kernel.transition(current, action_enum)
            reward = kernel.reward(current, action_enum, next_s)
            trajectory.append({'week': w+1, 'phi_before': current.phi, 'phi_after': next_s.phi, 'reward': reward})
            current = next_s
        
        return KernelToolResult(success=True, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'trajectory': trajectory, 'final_phi': current.phi}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_phi_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación PHI."""
    try:
        kernel = _get_kernel('phi', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(success=True, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'current_value': state.phi, 'current_band': state.band, 'bands': kernel.bands}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PHI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# PSI KERNEL TOOLS (WatsonEnergyOptimizer)
# =============================================================================

async def get_psi_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del PSI (Factor Solar-Térmico).
    
    Tool para: WatsonEnergyOptimizer
    """
    try:
        kernel = _get_kernel('psi', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'psi_value': state.psi,
                'band': state.band,
                'temperatura_c': state.temperatura,
                'temp_max_7d': state.temp_max_7d,
                'radiacion_w_m2': state.radiacion,
                'estres_termico': state.estres_termico,
                'gdd': state.gdd
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_psi_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima anti-estrés térmico MDP."""
    try:
        kernel = _get_kernel('psi', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(success=True, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'policy_type': 'optimal', 'horizon_weeks': horizon, 'total_vep': policy.total_vep,
                  'actions': [{'week': i+1, 'action': step.action.name} for i, step in enumerate(policy.steps[:horizon])]}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def simulate_psi_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción anti-estrés térmico."""
    try:
        kernel = _get_kernel('psi', section_id)
        state = await kernel.get_current_state()
        action_enum = next((a for a in kernel.get_available_actions(state) if a.name == action), None)
        if not action_enum:
            return KernelToolResult(success=False, kernel_type='PSI', section_id=section_id,
                timestamp=datetime.now().isoformat(), data={}, error=f"Acción '{action}' no válida").to_dict()
        
        trajectory = []
        current = state
        for w in range(weeks):
            next_s = kernel.transition(current, action_enum)
            trajectory.append({'week': w+1, 'psi_before': current.psi, 'psi_after': next_s.psi})
            current = next_s
        return KernelToolResult(success=True, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={'trajectory': trajectory, 'final_psi': current.psi}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_psi_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación PSI."""
    try:
        kernel = _get_kernel('psi', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(success=True, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'current_value': state.psi, 'current_band': state.band, 'bands': kernel.bands}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='PSI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# MARKET KERNEL TOOLS (C2AIOrchestrator)
# =============================================================================

async def get_market_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del mercado.
    
    Tool para: C2AIOrchestrator
    """
    try:
        kernel = _get_kernel('market', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(
            success=True, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={
                'price_mxn_kg': state.price if hasattr(state, 'price') else 18.0,
                'band': state.band,
                'trend': state.trend,
                'forecast_7d': getattr(state, 'forecast_7d', None),
                'seasonality': getattr(state, 'seasonality', 'normal')
            }
        ).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_market_policy(section_id: str = "S1", horizon: int = 12) -> Dict[str, Any]:
    """Calcula la política óptima de cosecha por precio MDP."""
    try:
        kernel = _get_kernel('market', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(success=True, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'policy_type': 'optimal', 'horizon_weeks': horizon, 'total_vep': policy.total_vep}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def simulate_market_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción de mercado."""
    return KernelToolResult(success=True, kernel_type='MARKET', section_id=section_id,
        timestamp=datetime.now().isoformat(),
        data={'message': 'Market simulation placeholder'}).to_dict()


async def get_market_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de precio del mercado."""
    try:
        kernel = _get_kernel('market', section_id)
        return KernelToolResult(success=True, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'bands': kernel.bands if hasattr(kernel, 'bands') else {
                'ALTO': {'min': 20, 'max': 30}, 'MEDIO': {'min': 15, 'max': 20}, 'BAJO': {'min': 10, 'max': 15}
            }}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='MARKET', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# TRIM KERNEL TOOLS (PenroseCoherenceAgent)
# =============================================================================

async def get_trim_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del TRIM (Poda).
    
    Tool para: PenroseCoherenceAgent
    """
    try:
        kernel = _get_kernel('trim', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(success=True, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'trim_value': state.factor_value, 'band': state.band, 'trend': state.trend}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_trim_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima de poda MDP."""
    try:
        kernel = _get_kernel('trim', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(success=True, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'policy_type': 'optimal', 'horizon_weeks': horizon, 'total_vep': policy.total_vep}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def simulate_trim_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción de poda."""
    return KernelToolResult(success=True, kernel_type='TRIM', section_id=section_id,
        timestamp=datetime.now().isoformat(), data={'message': 'TRIM simulation placeholder'}).to_dict()


async def get_trim_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación TRIM."""
    try:
        kernel = _get_kernel('trim', section_id)
        return KernelToolResult(success=True, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={'bands': kernel.bands}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='TRIM', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# IND KERNEL TOOLS (HoffmanTraceLogicAgent)
# =============================================================================

async def get_ind_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del IND (Inducción Floral).
    
    Tool para: HoffmanTraceLogicAgent
    """
    try:
        kernel = _get_kernel('ind', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(success=True, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'ind_value': state.factor_value, 'band': state.band, 'trend': state.trend}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_ind_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima de inducción floral MDP."""
    try:
        kernel = _get_kernel('ind', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(success=True, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'policy_type': 'optimal', 'horizon_weeks': horizon, 'total_vep': policy.total_vep}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def simulate_ind_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción de inducción floral."""
    return KernelToolResult(success=True, kernel_type='IND', section_id=section_id,
        timestamp=datetime.now().isoformat(), data={'message': 'IND simulation placeholder'}).to_dict()


async def get_ind_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación IND."""
    try:
        kernel = _get_kernel('ind', section_id)
        return KernelToolResult(success=True, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={'bands': kernel.bands}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='IND', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# LAI KERNEL TOOLS (FristonFreeEnergyAgent)
# =============================================================================

async def get_lai_state(section_id: str = "S1") -> Dict[str, Any]:
    """
    Obtiene el estado actual del LAI (Índice Área Foliar).
    
    Tool para: FristonFreeEnergyAgent
    """
    try:
        kernel = _get_kernel('lai', section_id)
        state = await kernel.get_current_state()
        return KernelToolResult(success=True, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'lai_value': state.factor_value, 'band': state.band, 'trend': state.trend}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def get_lai_policy(section_id: str = "S1", horizon: int = 8) -> Dict[str, Any]:
    """Calcula la política óptima de área foliar MDP."""
    try:
        kernel = _get_kernel('lai', section_id)
        policy = await kernel.find_optimal_policy(horizon=horizon)
        return KernelToolResult(success=True, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(),
            data={'policy_type': 'optimal', 'horizon_weeks': horizon, 'total_vep': policy.total_vep}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


async def simulate_lai_action(section_id: str, action: str, weeks: int = 4) -> Dict[str, Any]:
    """Simula una acción sobre área foliar."""
    return KernelToolResult(success=True, kernel_type='LAI', section_id=section_id,
        timestamp=datetime.now().isoformat(), data={'message': 'LAI simulation placeholder'}).to_dict()


async def get_lai_bands(section_id: str = "S1") -> Dict[str, Any]:
    """Obtiene las bandas de clasificación LAI."""
    try:
        kernel = _get_kernel('lai', section_id)
        return KernelToolResult(success=True, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={'bands': kernel.bands}).to_dict()
    except Exception as e:
        return KernelToolResult(success=False, kernel_type='LAI', section_id=section_id,
            timestamp=datetime.now().isoformat(), data={}, error=str(e)).to_dict()


# =============================================================================
# TOOL REGISTRY - Mapeo Kernel → Agente
# =============================================================================

KERNEL_TOOL_REGISTRY = {
    'LevinBioelectricAgent': {
        'ipf': [get_ipf_state, get_ipf_policy, simulate_ipf_action, get_ipf_bands],
    },
    'WatsonEnergyOptimizer': {
        'iah': [get_iah_state, get_iah_policy, simulate_iah_action, get_iah_bands],
        'psi': [get_psi_state, get_psi_policy, simulate_psi_action, get_psi_bands],
    },
    'LevinMorphogenesisAgent': {
        'npf': [get_npf_state, get_npf_policy, simulate_npf_action, get_npf_bands],
        'phi': [get_phi_state, get_phi_policy, simulate_phi_action, get_phi_bands],
    },
    'FristonFreeEnergyAgent': {
        'lai': [get_lai_state, get_lai_policy, simulate_lai_action, get_lai_bands],
    },
    'PenroseCoherenceAgent': {
        'trim': [get_trim_state, get_trim_policy, simulate_trim_action, get_trim_bands],
    },
    'HoffmanTraceLogicAgent': {
        'ind': [get_ind_state, get_ind_policy, simulate_ind_action, get_ind_bands],
    },
    'C2AIOrchestrator': {
        'market': [get_market_state, get_market_policy, simulate_market_action, get_market_bands],
    },
}


def get_tools_for_agent(agent_name: str) -> List[callable]:
    """
    Obtiene todas las herramientas de kernel para un agente específico.
    
    Usage:
        tools = get_tools_for_agent('LevinBioelectricAgent')
        # Returns [get_ipf_state, get_ipf_policy, simulate_ipf_action, get_ipf_bands]
    """
    agent_tools = KERNEL_TOOL_REGISTRY.get(agent_name, {})
    all_tools = []
    for kernel_tools in agent_tools.values():
        all_tools.extend(kernel_tools)
    return all_tools


def get_all_kernel_tools() -> Dict[str, List[callable]]:
    """
    Obtiene todas las herramientas de todos los kernels.
    
    Returns:
        Dict con kernel_name -> [tools]
    """
    all_tools = {}
    for kernel_name in ['ipf', 'iah', 'npf', 'phi', 'psi', 'market', 'trim', 'ind', 'lai']:
        all_tools[kernel_name] = [
            globals()[f'get_{kernel_name}_state'],
            globals()[f'get_{kernel_name}_policy'],
            globals()[f'simulate_{kernel_name}_action'],
            globals()[f'get_{kernel_name}_bands'],
        ]
    return all_tools


# =============================================================================
# RESUMEN DE TOOLS
# =============================================================================

TOOL_SUMMARY = """
KERNEL TOOLS - 36 Function Tools para 9 MDP Kernels
=====================================================

| Kernel | Agente Propietario | Tools (4 cada uno) |
|--------|-------------------|-------------------|
| IPF | LevinBioelectricAgent | get_ipf_state, get_ipf_policy, simulate_ipf_action, get_ipf_bands |
| IAH | WatsonEnergyOptimizer | get_iah_state, get_iah_policy, simulate_iah_action, get_iah_bands |
| PSI | WatsonEnergyOptimizer | get_psi_state, get_psi_policy, simulate_psi_action, get_psi_bands |
| NPF | LevinMorphogenesisAgent | get_npf_state, get_npf_policy, simulate_npf_action, get_npf_bands |
| PHI | LevinMorphogenesisAgent | get_phi_state, get_phi_policy, simulate_phi_action, get_phi_bands |
| LAI | FristonFreeEnergyAgent | get_lai_state, get_lai_policy, simulate_lai_action, get_lai_bands |
| TRIM | PenroseCoherenceAgent | get_trim_state, get_trim_policy, simulate_trim_action, get_trim_bands |
| IND | HoffmanTraceLogicAgent | get_ind_state, get_ind_policy, simulate_ind_action, get_ind_bands |
| MARKET | C2AIOrchestrator | get_market_state, get_market_policy, simulate_market_action, get_market_bands |

TOTAL: 36 tools (9 kernels × 4 funciones)
"""

if __name__ == "__main__":
    print(TOOL_SUMMARY)
