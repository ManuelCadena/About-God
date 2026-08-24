"""
C²AI Framework - FastAPI Endpoints
===================================
Complete REST API for all 7 C²AI agents and 29 tools.

Author: Dr. José Manuel Cadena Ortiz de Montellano
Date: 29-Jan-2026
Version: 2.0

Port: 8001 (as per NGINX reserved ports documentation)
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
import os

from agents import (
    FristonFreeEnergyAgent,
    LevinBioelectricAgent,
    LevinMorphogenesisAgent,
    WatsonEnergyOptimizer,
    HoffmanTraceLogicAgent,
    PenroseCoherenceAgent,
    C2AIOrchestrator
)
from agents.friston_agent import ObservationVector
from agents.levin_morphogenesis_agent import CurrentMorphology, DevelopmentalPhase
from agents.watson_optimizer import FarmState
from agents.penrose_coherence_agent import DecisionOption

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("C2AI_API")

# PostgreSQL configuration
PG_CONFIG = {
    'host': os.getenv('PG_HOST', '44.247.163.1'),
    'port': int(os.getenv('PG_PORT', 5432)),
    'database': os.getenv('PG_DATABASE', 'citrusmax_biofix'),
    'user': os.getenv('PG_USER', 'citrusmax_admin'),
    'password': os.getenv('PG_PASSWORD', 'C1trusM4x2024!')
}

# Initialize FastAPI
app = FastAPI(
    title="C²AI Framework API",
    description="Conscious Citrus AI - 7 Agents, 29 Tools",
    version="2.0.0",
    docs_url="/c2ai/docs",
    redoc_url="/c2ai/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
orchestrator = C2AIOrchestrator(PG_CONFIG)
friston = FristonFreeEnergyAgent(PG_CONFIG)
levin_bio = LevinBioelectricAgent(PG_CONFIG)
levin_morph = LevinMorphogenesisAgent(PG_CONFIG)
watson = WatsonEnergyOptimizer(PG_CONFIG)
hoffman = HoffmanTraceLogicAgent(PG_CONFIG)
penrose = PenroseCoherenceAgent(PG_CONFIG)


# ═══════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class C2AIResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class ObservationInput(BaseModel):
    iah: float = Field(0.85, ge=0, le=1, description="Índice Aptitud Hídrica")
    ipf: float = Field(0.90, ge=0, le=1, description="Índice Presión Fitosanitaria")
    npf: float = Field(0.78, ge=0, le=1, description="Nutrición Planta Frutal")
    phi: float = Field(0.85, ge=0, le=1, description="Factor fenológico")
    psi: float = Field(0.80, ge=0, le=1, description="Factor solar/stress")
    temp: float = Field(28.0, description="Temperature °C")
    humidity: float = Field(65.0, ge=0, le=100, description="Humidity %")
    gdd: float = Field(1500, ge=0, description="Growing Degree Days")
    pe: float = Field(75.0, ge=0, le=100, description="Production Efficiency %")


class BioelectricInput(BaseModel):
    vmem_delta_6h: float = Field(8.0, description="Vmem change over 6h (mV)")
    dominant_freq: float = Field(12.0, description="Dominant frequency (Hz)")
    humidity: float = Field(65.0, ge=0, le=100)
    temperature: float = Field(28.0)
    section: str = Field("S1")


class MorphologyInput(BaseModel):
    current_pe: float = Field(75.0, ge=0, le=100)
    fruit_count: int = Field(120, ge=0)
    fruit_size_mm: float = Field(48.0, ge=0)
    brix: float = Field(8.5, ge=0)
    current_phase: str = Field("FEN-05")
    current_gdd: float = Field(1500, ge=0)
    vigor_score: float = Field(0.75, ge=0, le=1)
    vmem_baseline: float = Field(-65.0)
    section: str = Field("S1")


class FarmStateInput(BaseModel):
    pe: float = Field(75.0, ge=0, le=100)
    iah: float = Field(0.85, ge=0, le=1)
    ipf: float = Field(0.90, ge=0, le=1)
    npf: float = Field(0.78, ge=0, le=1)
    gdd: float = Field(1500, ge=0)
    quality: float = Field(0.75, ge=0, le=1)
    cost: float = Field(500000, ge=0, description="Accumulated cost MXN")


class DecisionInput(BaseModel):
    decision_type: str = Field("strategic")
    section: str = Field("general")
    force: bool = Field(False)


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH & ROOT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    """API root - basic info."""
    return {
        "name": "C²AI Framework API",
        "version": "2.0.0",
        "agents": 7,
        "tools": 29,
        "status": "operational",
        "docs": "/c2ai/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "agents": {
            "orchestrator": "ready",
            "friston": "ready",
            "levin_bio": "ready",
            "levin_morph": "ready",
            "watson": "ready",
            "hoffman": "ready",
            "penrose": "ready"
        },
        "timestamp": datetime.now().isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ORCHESTRATOR ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/c2ai/orchestrator/cycle", response_model=C2AIResponse)
async def run_consciousness_cycle(
    section: str = Query("general", description="Section identifier")
):
    """Run full consciousness cycle through all 6 layers."""
    try:
        result = orchestrator.run_full_consciousness_cycle(section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Consciousness cycle error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/orchestrator/state", response_model=C2AIResponse)
async def get_unified_state(
    section: str = Query("general", description="Section identifier")
):
    """Get current unified system state."""
    try:
        result = orchestrator.get_unified_state(section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Unified state error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/orchestrator/decide", response_model=C2AIResponse)
async def generate_conscious_decision(input_data: DecisionInput):
    """Generate a fully conscious decision using all layers."""
    try:
        result = orchestrator.generate_conscious_decision(
            decision_type=input_data.decision_type,
            section=input_data.section,
            force=input_data.force
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Decision generation error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/orchestrator/explain/{decision_id}", response_model=C2AIResponse)
async def explain_decision(decision_id: str):
    """Get detailed explanation for a past decision."""
    try:
        result = orchestrator.explain_decision(decision_id)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Explanation error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# FRISTON FREE ENERGY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/c2ai/friston/free-energy", response_model=C2AIResponse)
async def calculate_free_energy(obs: ObservationInput):
    """Calculate free energy from observations."""
    try:
        obs_vector = ObservationVector(
            iah=obs.iah, ipf=obs.ipf, npf=obs.npf,
            phi=obs.phi, psi=obs.psi, temp=obs.temp,
            humidity=obs.humidity, gdd=obs.gdd, pe=obs.pe
        )
        result = friston.calculate_free_energy(obs_vector)
        return C2AIResponse(success=True, data={
            'total_free_energy': result.total_free_energy,
            'surprise_level': result.surprise_level.value,
            'prediction_errors': {k.value: v for k, v in result.prediction_errors.items()},
            'dominant_error': result.dominant_error.value,
            'recommendations': result.recommendations,
            'confidence': result.confidence
        })
    except Exception as e:
        logger.error(f"Free energy error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/friston/surprise/{section}", response_model=C2AIResponse)
async def predict_surprise_level(
    section: str,
    horizon_days: int = Query(7, ge=1, le=90)
):
    """Predict future surprise levels."""
    try:
        result = friston.predict_surprise_level(section, horizon_days)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Surprise prediction error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/friston/minimize", response_model=C2AIResponse)
async def minimize_free_energy(
    obs: ObservationInput,
    budget_mxn: float = Query(50000, ge=0)
):
    """Generate actions to minimize free energy."""
    try:
        obs_vector = ObservationVector(
            iah=obs.iah, ipf=obs.ipf, npf=obs.npf,
            phi=obs.phi, psi=obs.psi, temp=obs.temp,
            humidity=obs.humidity, gdd=obs.gdd, pe=obs.pe
        )
        result = friston.minimize_free_energy(obs_vector, budget_mxn)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Minimization error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# LEVIN BIOELECTRIC ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/c2ai/levin/pest-detection", response_model=C2AIResponse)
async def detect_pest_signature(input_data: BioelectricInput):
    """Detect pests via bioelectric signatures."""
    try:
        results = levin_bio.detect_pest_signature(
            vmem_delta_6h=input_data.vmem_delta_6h,
            dominant_freq=input_data.dominant_freq,
            humidity=input_data.humidity,
            temperature=input_data.temperature,
            section=input_data.section
        )
        return C2AIResponse(success=True, data={
            'threats_detected': len(results),
            'threats': [
                {
                    'type': r.threat_type,
                    'confidence': r.confidence,
                    'severity': r.severity.value,
                    'lead_time_hours': r.lead_time_hours,
                    'action': r.recommended_action,
                    'metrics': r.metrics
                }
                for r in results
            ]
        })
    except Exception as e:
        logger.error(f"Pest detection error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/levin/disease-detection", response_model=C2AIResponse)
async def detect_disease_signature(
    vmem_vp: float = Query(5.0),
    impedance_trend: float = Query(-5.0),
    pe_mills_hours: int = Query(50),
    temp_avg: float = Query(25.0),
    section: str = Query("S1")
):
    """Detect diseases via bioelectric signatures."""
    try:
        results = levin_bio.detect_disease_signature(
            vmem_vp=vmem_vp,
            impedance_trend=impedance_trend,
            pe_mills_hours=pe_mills_hours,
            temp_avg=temp_avg,
            section=section
        )
        return C2AIResponse(success=True, data={
            'diseases_detected': len(results),
            'diseases': [
                {
                    'type': r.threat_type,
                    'confidence': r.confidence,
                    'severity': r.severity.value,
                    'action': r.recommended_action
                }
                for r in results
            ]
        })
    except Exception as e:
        logger.error(f"Disease detection error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/levin/nutrition/{section}", response_model=C2AIResponse)
async def assess_nutrition_status(
    section: str,
    vmem_baseline: float = Query(-65.0),
    impedance_ratio: float = Query(1.1),
    leaf_color_index: float = Query(0.7, ge=0, le=1)
):
    """Assess nutritional status via bioelectric patterns."""
    try:
        result = levin_bio.assess_nutrition_status(
            vmem_baseline=vmem_baseline,
            impedance_ratio=impedance_ratio,
            leaf_color_index=leaf_color_index,
            section=section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Nutrition assessment error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/levin/water-stress/{section}", response_model=C2AIResponse)
async def calculate_water_stress(
    section: str,
    vmem_absolute: float = Query(-70.0),
    iah: float = Query(0.85, ge=0, le=1),
    et0: float = Query(5.0),
    soil_moisture: float = Query(35.0, ge=0, le=100)
):
    """Calculate water stress from bioelectric + hydric data."""
    try:
        result = levin_bio.calculate_water_stress(
            vmem_absolute=vmem_absolute,
            iah=iah, et0=et0,
            soil_moisture=soil_moisture,
            section=section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Water stress error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/levin/opportunity-window/{section}", response_model=C2AIResponse)
async def detect_opportunity_window(
    section: str,
    wind_speed: float = Query(8.0),
    rain_probability: float = Query(15.0, ge=0, le=100),
    temp: float = Query(25.0),
    humidity: float = Query(65.0, ge=0, le=100)
):
    """Detect optimal application windows."""
    try:
        result = levin_bio.detect_opportunity_window(
            vmem_range=(-75.0, -65.0),
            wind_speed=wind_speed,
            rain_probability=rain_probability,
            temp=temp, humidity=humidity,
            section=section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Opportunity window error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# LEVIN MORPHOGENESIS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/c2ai/morphogenesis/potential", response_model=C2AIResponse)
async def calculate_morphogenetic_potential(input_data: MorphologyInput):
    """Calculate morphogenetic potential (distance to goal)."""
    try:
        current = CurrentMorphology(
            current_pe=input_data.current_pe,
            fruit_count=input_data.fruit_count,
            fruit_size_mm=input_data.fruit_size_mm,
            brix=input_data.brix,
            current_phase=DevelopmentalPhase(input_data.current_phase),
            current_gdd=input_data.current_gdd,
            vigor_score=input_data.vigor_score,
            vmem_baseline=input_data.vmem_baseline
        )
        result = levin_morph.calculate_morphogenetic_potential(
            current, section=input_data.section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Morphogenetic potential error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/morphogenesis/trajectory/{section}", response_model=C2AIResponse)
async def assess_developmental_trajectory(
    section: str,
    lookback_days: int = Query(30, ge=7, le=90)
):
    """Assess developmental trajectory."""
    try:
        result = levin_morph.assess_developmental_trajectory(section, lookback_days)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Trajectory assessment error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/morphogenesis/conflicts", response_model=C2AIResponse)
async def detect_goal_conflicts(input_data: MorphologyInput):
    """Detect developmental goal conflicts."""
    try:
        current = CurrentMorphology(
            current_pe=input_data.current_pe,
            fruit_count=input_data.fruit_count,
            fruit_size_mm=input_data.fruit_size_mm,
            brix=input_data.brix,
            current_phase=DevelopmentalPhase(input_data.current_phase),
            current_gdd=input_data.current_gdd,
            vigor_score=input_data.vigor_score,
            vmem_baseline=input_data.vmem_baseline
        )
        result = levin_morph.detect_goal_state_conflicts(
            current, section=input_data.section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Conflict detection error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# WATSON ENERGY OPTIMIZER ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/c2ai/watson/landscape", response_model=C2AIResponse)
async def calculate_energy_landscape(input_data: FarmStateInput):
    """Calculate energy landscape around current state."""
    try:
        state = FarmState(
            pe=input_data.pe, iah=input_data.iah, ipf=input_data.ipf,
            npf=input_data.npf, gdd=input_data.gdd,
            quality=input_data.quality, cost=input_data.cost
        )
        result = watson.calculate_energy_landscape(state)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Energy landscape error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/watson/trajectory", response_model=C2AIResponse)
async def find_optimal_trajectory(
    current: FarmStateInput,
    target_pe: float = Query(95.0),
    target_quality: float = Query(0.90),
    max_days: int = Query(90, ge=7, le=365),
    budget_mxn: float = Query(500000)
):
    """Find optimal trajectory from current to target state."""
    try:
        current_state = FarmState(
            pe=current.pe, iah=current.iah, ipf=current.ipf,
            npf=current.npf, gdd=current.gdd,
            quality=current.quality, cost=current.cost
        )
        target_state = FarmState(
            pe=target_pe, iah=0.95, ipf=0.95,
            npf=0.90, gdd=1800,
            quality=target_quality, cost=current.cost + 200000
        )
        result = watson.find_optimal_trajectory(
            current_state, target_state, max_days, budget_mxn
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Trajectory error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/watson/barriers/{section}", response_model=C2AIResponse)
async def predict_energy_barriers(
    section: str,
    horizon_days: int = Query(30, ge=7, le=90)
):
    """Predict upcoming energy barriers."""
    try:
        current = FarmState(pe=75, iah=0.85, ipf=0.90, npf=0.78, gdd=1500, quality=0.75, cost=500000)
        result = watson.predict_energy_barriers(current, horizon_days, section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Barrier prediction error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# HOFFMAN TRACE LOGIC ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/c2ai/hoffman/kernel/{section}", response_model=C2AIResponse)
async def compute_farm_kernel(
    section: str,
    use_historical: bool = Query(True)
):
    """Compute the global FarmKernel transition matrix."""
    try:
        result = hoffman.compute_farm_kernel(section, use_historical)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Kernel computation error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/hoffman/stationary/{section}", response_model=C2AIResponse)
async def calculate_stationary_distribution(section: str):
    """Calculate stationary distribution."""
    try:
        result = hoffman.calculate_stationary_distribution(section=section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Stationary distribution error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/hoffman/hitting-time", response_model=C2AIResponse)
async def compute_hitting_time(
    from_state: str = Query("good"),
    to_state: str = Query("optimal"),
    section: str = Query("general")
):
    """Compute expected hitting time between states."""
    try:
        result = hoffman.compute_hitting_time(from_state, to_state, section=section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Hitting time error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/hoffman/trace/{agent_type}", response_model=C2AIResponse)
async def compute_trace(
    agent_type: str,
    section: str = Query("general")
):
    """Compute trace for a specific agent type."""
    try:
        result = hoffman.compute_trace(agent_type, section=section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Trace computation error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/hoffman/time-dilation/{agent_type}", response_model=C2AIResponse)
async def calculate_time_dilation(
    agent_type: str,
    section: str = Query("general")
):
    """Calculate time dilation factor for an agent."""
    try:
        result = hoffman.calculate_time_dilation(agent_type, section=section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Time dilation error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# PENROSE COHERENCE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/c2ai/penrose/coherence/{section}", response_model=C2AIResponse)
async def calculate_coherence_index(
    section: str,
    decision_type: str = Query("strategic")
):
    """Calculate coherence index for a decision."""
    try:
        # Generate sample recommendations
        agent_recs = [
            {'action': 'irrigation', 'confidence': 0.85, 'probability': 0.3, 'risk': 0.2},
            {'action': 'phytosanitary', 'confidence': 0.78, 'probability': 0.25, 'risk': 0.3},
            {'action': 'nutrition', 'confidence': 0.72, 'probability': 0.20, 'risk': 0.15}
        ]
        result = penrose.calculate_coherence_index(
            decision_type=decision_type,
            agent_recommendations=agent_recs,
            data_timestamps={'rv21': datetime.now(), 'davis': datetime.now()},
            section=section
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Coherence calculation error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.get("/c2ai/penrose/readiness/{section}", response_model=C2AIResponse)
async def detect_decision_readiness(section: str):
    """Detect which decisions are ready to collapse."""
    try:
        result = penrose.detect_decision_readiness(section)
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Readiness detection error: {e}")
        return C2AIResponse(success=False, error=str(e))


@app.post("/c2ai/penrose/collapse", response_model=C2AIResponse)
async def execute_penrose_collapse(
    decision_type: str = Query("irrigation"),
    section: str = Query("S1"),
    force_collapse: bool = Query(False)
):
    """Execute Penrose collapse to make a decision."""
    try:
        options = [
            DecisionOption(
                action="Riego de 25mm", probability=0.7,
                expected_vep=45000, cost_mxn=5000, risk=0.15, alignment=0.9
            ),
            DecisionOption(
                action="Riego de 15mm", probability=0.2,
                expected_vep=25000, cost_mxn=3000, risk=0.1, alignment=0.7
            ),
            DecisionOption(
                action="No regar", probability=0.1,
                expected_vep=0, cost_mxn=0, risk=0.4, alignment=0.3
            )
        ]
        result = penrose.execute_penrose_collapse(
            decision_type=decision_type,
            options=options,
            section=section,
            force_collapse=force_collapse
        )
        return C2AIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Collapse execution error: {e}")
        return C2AIResponse(success=False, error=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# STARTUP/SHUTDOWN
# ═══════════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    logger.info("C²AI Framework API starting on port 8001")
    logger.info(f"Agents initialized: 7 | Tools available: 29")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("C²AI Framework API shutting down")
    orchestrator.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
