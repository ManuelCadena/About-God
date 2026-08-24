"""
C²AI Framework - Conscious Citrus AI Agents
============================================
Complete implementation of 7 SDK Agents with 29 core tools + 36 kernel tools.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.1

Kernel Tools Integration:
- 9 MDP Kernels exposed as 36 function_tools
- Each kernel provides: get_state, get_policy, simulate_action, get_bands
- Kernels delegate to Motor Unificado (SSOT) for PE factor calculations
"""

from .friston_agent import FristonFreeEnergyAgent
from .levin_bioelectric_agent import LevinBioelectricAgent
from .levin_morphogenesis_agent import LevinMorphogenesisAgent
from .watson_optimizer import WatsonEnergyOptimizer
from .hoffman_trace_agent import HoffmanTraceLogicAgent
from .penrose_coherence_agent import PenroseCoherenceAgent
from .c2ai_orchestrator import C2AIOrchestrator

from .kernel_tools import (
    KERNEL_TOOL_REGISTRY,
    get_tools_for_agent,
    get_all_kernel_tools,
    get_ipf_state, get_ipf_policy, simulate_ipf_action, get_ipf_bands,
    get_iah_state, get_iah_policy, simulate_iah_action, get_iah_bands,
    get_npf_state, get_npf_policy, simulate_npf_action, get_npf_bands,
    get_phi_state, get_phi_policy, simulate_phi_action, get_phi_bands,
    get_psi_state, get_psi_policy, simulate_psi_action, get_psi_bands,
    get_market_state, get_market_policy, simulate_market_action, get_market_bands,
    get_trim_state, get_trim_policy, simulate_trim_action, get_trim_bands,
    get_ind_state, get_ind_policy, simulate_ind_action, get_ind_bands,
    get_lai_state, get_lai_policy, simulate_lai_action, get_lai_bands,
)

__all__ = [
    # Agents
    'FristonFreeEnergyAgent',
    'LevinBioelectricAgent',
    'LevinMorphogenesisAgent',
    'WatsonEnergyOptimizer',
    'HoffmanTraceLogicAgent',
    'PenroseCoherenceAgent',
    'C2AIOrchestrator',
    # Kernel Tools Registry
    'KERNEL_TOOL_REGISTRY',
    'get_tools_for_agent',
    'get_all_kernel_tools',
    # IPF Tools (LevinBioelectricAgent)
    'get_ipf_state', 'get_ipf_policy', 'simulate_ipf_action', 'get_ipf_bands',
    # IAH Tools (WatsonEnergyOptimizer)
    'get_iah_state', 'get_iah_policy', 'simulate_iah_action', 'get_iah_bands',
    # NPF Tools (LevinMorphogenesisAgent)
    'get_npf_state', 'get_npf_policy', 'simulate_npf_action', 'get_npf_bands',
    # PHI Tools (LevinMorphogenesisAgent)
    'get_phi_state', 'get_phi_policy', 'simulate_phi_action', 'get_phi_bands',
    # PSI Tools (WatsonEnergyOptimizer)
    'get_psi_state', 'get_psi_policy', 'simulate_psi_action', 'get_psi_bands',
    # Market Tools (C2AIOrchestrator)
    'get_market_state', 'get_market_policy', 'simulate_market_action', 'get_market_bands',
    # TRIM Tools (PenroseCoherenceAgent)
    'get_trim_state', 'get_trim_policy', 'simulate_trim_action', 'get_trim_bands',
    # IND Tools (HoffmanTraceLogicAgent)
    'get_ind_state', 'get_ind_policy', 'simulate_ind_action', 'get_ind_bands',
    # LAI Tools (FristonFreeEnergyAgent)
    'get_lai_state', 'get_lai_policy', 'simulate_lai_action', 'get_lai_bands',
]

__version__ = '2.1.0'
