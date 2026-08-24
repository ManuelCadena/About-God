# -*- coding: utf-8 -*-
"""
Watson Optimizer Router - CitrusMax UI v5.0
==========================================
Endpoints para C2AI Watson Panel - Optimizer como Dimensión R2C Watson.

Integración:
- Watson Trajectory Layer (estratégico, 60 días)
- Greedy Optimization Engine (táctico, 7-14 días)
- Modelo de Efectividad Validado (R² = 99.43%)

Autor: Dr. CitrusMax AI PhD
Fecha: 4 de Enero 2026
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import numpy as np
import sys
import os

# Agregar path al módulo optimizer
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '..', 'citrusmax_health', 'optimizer'))

router = APIRouter()

# =============================================================================
# CONFIGURACIÓN DE FINCA
# =============================================================================

SECCIONES_FINCA = {
    "S1": {"turbinas": 62, "hectareas": 99.96, "arboles": 34911, "edad_anos": 4},
    "S2": {"turbinas": 55, "hectareas": 87.24, "arboles": 34755, "edad_anos": 3},
    "S3": {"turbinas": 94, "hectareas": 151.1, "arboles": 53821, "edad_anos": 2},
}

# Matriz IEIA Validada (R² = 99.43%)
IEIA_VALIDADO = {
    'sulfocalcico': {'rona': 100.0, 'acaro_blanco': 100.0, 'melanosis': 100.0, 'fumagina': 89.33},
    'sulfato_cobre': {'rona': 100.0, 'melanosis': 100.0, 'mancha_grasienta': 79.42, 'gomosis': 65.07, 'alga_roja': 55.56},
    'confinal': {'picudo': 85.33, 'diaforina': 70.0},
    'exalt': {'minador': 53.23, 'trips': 44.17},
    'abamectina': {'arana_roja': 80.0, 'acaro_blanco': 75.0, 'minador': 60.0},
    'imidacloprid': {'diaforina': 85.0, 'pulgon': 80.0},
    'spinosad': {'trips': -65.8, 'minador': -1290.9},  # EXCLUIDO
}

IECB_VALIDADO = {
    'sulfocalcico': {'rona': 40.32, 'acaro_blanco': 31.25, 'melanosis': 30.49, 'fumagina': 21.47},
    'sulfato_cobre': {'rona': 1.29, 'melanosis': 1.28, 'mancha_grasienta': 1.15, 'gomosis': 0.86},
    'confinal': {'picudo': 0.31},
    'exalt': {'minador': 0.06, 'trips': 0.05},
}


# =============================================================================
# MODELOS PYDANTIC
# =============================================================================

class PresionesInput(BaseModel):
    trips: float = Field(default=0.5, ge=0, le=3)
    diaforina: float = Field(default=0.3, ge=0, le=3)
    arana_roja: float = Field(default=0.4, ge=0, le=3)
    antracnosis: float = Field(default=0.3, ge=0, le=3)
    mancha_grasienta: float = Field(default=0.2, ge=0, le=3)
    melanosis: float = Field(default=0.1, ge=0, le=3)


class OptimizationRequest(BaseModel):
    seccion: str = Field(default="S1", pattern="^(S1|S2|S3)$")
    presiones: PresionesInput
    gdd_actual: float = Field(default=500, ge=0, le=1650)
    fase_fenologica: str = Field(default="FEN-04")


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_ipf(presiones: Dict[str, float]) -> float:
    """Calcula IPF desde presiones."""
    pesos = {
        'trips': 0.18, 'diaforina': 0.25, 'minador': 0.08, 'arana_roja': 0.12,
        'acaro_blanco': 0.08, 'pulgon': 0.06, 'antracnosis': 0.15,
        'mancha_grasienta': 0.10, 'melanosis': 0.05, 'rona': 0.05,
    }
    ipf = sum((nivel / 3) * pesos.get(obj, 0.05) for obj, nivel in presiones.items())
    return min(1.0, ipf)


def get_semaforo(ipf: float) -> str:
    if ipf < 0.3: return "🟢 VERDE"
    elif ipf < 0.5: return "🟡 AMARILLO"
    elif ipf < 0.7: return "🟠 NARANJA"
    else: return "🔴 ROJO"


def generate_trajectory(current_pe: float, optimal_pe: float = 0.92) -> List[Dict]:
    """Genera puntos de trayectoria para gráfico."""
    points = []
    for i in range(0, 65, 5):
        progress = 1 - np.exp(-i / 30)
        current = current_pe + (optimal_pe - current_pe) * progress
        points.append({
            'day': i,
            'current_state': round(current, 3),
            'optimal_state': optimal_pe,
            'gap': round(optimal_pe - current, 3)
        })
    return points


def generate_levers(ipf: float) -> List[Dict]:
    """Genera palancas de optimización basadas en IECB validado."""
    return [
        {
            'id': 'sulfocalcico',
            'name': 'Sulfocalcico (Roña/Ácaros)',
            'impact': 0.95,
            'effort': 0.15,
            'roi': 40.32,
            'status': 'active',
            'description': 'IECB=40.32 - Máxima eficiencia costo-beneficio validada (R²=99.43%)'
        },
        {
            'id': 'sulfato_cobre',
            'name': 'Sulfato Cobre (Enfermedades)',
            'impact': 0.85,
            'effort': 0.25,
            'roi': 1.29,
            'status': 'active',
            'description': 'Control roña 100%, mancha grasienta 79%, melanosis 100%'
        },
        {
            'id': 'pest_control',
            'name': 'Control Fitosanitario Integral',
            'impact': 0.68,
            'effort': 0.40,
            'roi': 1.70,
            'status': 'pending' if ipf < 0.5 else 'active',
            'description': f'IPF actual: {ipf:.2f} - {get_semaforo(ipf)}'
        },
        {
            'id': 'spinosad',
            'name': 'Spinosad (BLOQUEADO)',
            'impact': 0.0,
            'effort': 0.90,
            'roi': -0.66,
            'status': 'blocked',
            'description': '⚠️ IEIA NEGATIVO validado (-66% vs trips) - Excluido del optimizer'
        },
    ]


def optimize_greedy(presiones: Dict[str, float], seccion: str, presupuesto: float = 15000) -> Dict:
    """Algoritmo Greedy simplificado para generar receta óptima."""
    turbinas = SECCIONES_FINCA[seccion]['turbinas']
    
    # Productos candidatos (excluir spinosad por IEIA negativo)
    productos = []
    
    # Priorizar por IECB
    if presiones.get('rona', 0) > 0.2 or presiones.get('acaro_blanco', 0) > 0.2:
        productos.append({
            'ingrediente': 'sulfocalcico',
            'dosis_turbina': 2.5,
            'precio_unitario': 8.0,
            'objetivos': ['rona', 'acaro_blanco', 'melanosis'],
            'ieia': 100.0
        })
    
    if presiones.get('antracnosis', 0) > 0.2 or presiones.get('mancha_grasienta', 0) > 0.2:
        productos.append({
            'ingrediente': 'sulfato_cobre',
            'dosis_turbina': 0.8,
            'precio_unitario': 90.0,
            'objetivos': ['antracnosis', 'mancha_grasienta', 'melanosis'],
            'ieia': 85.0
        })
    
    if presiones.get('arana_roja', 0) > 0.3:
        productos.append({
            'ingrediente': 'abamectina',
            'dosis_turbina': 0.25,
            'precio_unitario': 450.0,
            'objetivos': ['arana_roja', 'acaro_blanco'],
            'ieia': 80.0
        })
    
    if presiones.get('trips', 0) > 0.4 or presiones.get('minador', 0) > 0.3:
        productos.append({
            'ingrediente': 'exalt',
            'dosis_turbina': 0.25,
            'precio_unitario': 2600.0,
            'objetivos': ['trips', 'minador'],
            'ieia': 48.0
        })
    
    # Calcular costos
    costo_total = 0
    productos_receta = []
    
    for p in productos:
        costo_p = p['dosis_turbina'] * turbinas * p['precio_unitario']
        if costo_total + costo_p <= presupuesto:
            p['costo_seccion'] = round(costo_p, 2)
            productos_receta.append(p)
            costo_total += costo_p
    
    return {
        'productos': productos_receta,
        'costo_total': round(costo_total, 2),
        'turbinas': turbinas
    }


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.get("/section/{section}")
async def get_watson_section(
    section: str,
    trips: float = Query(default=0.5, ge=0, le=3),
    diaforina: float = Query(default=0.3, ge=0, le=3),
    arana_roja: float = Query(default=0.4, ge=0, le=3),
    antracnosis: float = Query(default=0.3, ge=0, le=3),
):
    """
    Obtiene análisis Watson completo para una sección.
    Compatible con C2AIWatsonPanel.tsx
    """
    if section not in ['S1', 'S2', 'S3']:
        raise HTTPException(status_code=400, detail="Sección inválida. Use S1, S2 o S3.")
    
    presiones = {
        'trips': trips,
        'diaforina': diaforina,
        'arana_roja': arana_roja,
        'antracnosis': antracnosis,
    }
    
    ipf = calculate_ipf(presiones)
    pe = round(1.0 - ipf * 0.8, 3)
    optimal_pe = 0.92
    
    # Calcular métricas Watson
    energy_gap = round(((optimal_pe - pe) ** 2 + ipf ** 2) ** 0.5, 4)
    decay_rate = 0.05
    days_to_optimal = min(90, int(-np.log(0.05) / decay_rate * 7)) if energy_gap > 0.01 else 0
    efficiency = min(1.0, round(1.0 - energy_gap * 0.5, 3))
    
    # Determinar posición en landscape
    if ipf < 0.3:
        landscape_position = 'Cerca del óptimo'
    elif ipf < 0.5:
        landscape_position = 'Valle local'
    elif ipf < 0.7:
        landscape_position = 'Pendiente moderada'
    else:
        landscape_position = 'Lejos del óptimo'
    
    return JSONResponse(content={
        'status': 'success',
        'data': {
            'section': section,
            'timestamp': datetime.now().isoformat(),
            'trajectory_efficiency': efficiency,
            'energy_gap': energy_gap,
            'days_to_optimal': days_to_optimal,
            'current_pe': pe,
            'optimal_pe': optimal_pe,
            'trajectory': generate_trajectory(pe, optimal_pe),
            'levers': generate_levers(ipf),
            'landscape_position': landscape_position
        }
    })


@router.post("/optimize")
async def optimize_recipe(request: OptimizationRequest):
    """
    Genera receta optimizada usando Watson-Greedy integrado.
    """
    presiones = request.presiones.dict()
    presiones = {k: v for k, v in presiones.items() if v > 0}
    
    seccion = request.seccion
    ipf = calculate_ipf(presiones)
    pe = round(1.0 - ipf * 0.8, 3)
    
    # Optimización Greedy
    receta = optimize_greedy(presiones, seccion)
    
    # Estimar mejora
    delta_ipf = sum(p['ieia'] / 100 * 0.05 for p in receta['productos'])
    
    return JSONResponse(content={
        'status': 'success',
        'seccion': seccion,
        'timestamp': datetime.now().isoformat(),
        'estado_actual': {
            'ipf': round(ipf, 3),
            'pe': pe,
            'semaforo': get_semaforo(ipf),
            'presiones': presiones
        },
        'watson': {
            'efficiency': min(1.0, round(1.0 - ipf * 0.5, 3)),
            'target_pe': 0.92,
            'target_ipf': 0.15,
            'avoid_traps': ['spinosad', 'over_spray', 'resistance_buildup']
        },
        'receta': {
            'productos': receta['productos'],
            'costo_total': receta['costo_total'],
            'delta_ipf': round(delta_ipf, 4),
            'watson_aligned': True
        },
        'costos_todas_secciones': {
            'S1': round(receta['costo_total'] * SECCIONES_FINCA['S1']['turbinas'] / receta['turbinas'], 2),
            'S2': round(receta['costo_total'] * SECCIONES_FINCA['S2']['turbinas'] / receta['turbinas'], 2),
            'S3': round(receta['costo_total'] * SECCIONES_FINCA['S3']['turbinas'] / receta['turbinas'], 2),
        }
    })


@router.get("/ieia-matrix")
async def get_ieia_matrix():
    """Retorna matriz IEIA validada completa."""
    return JSONResponse(content={
        'status': 'success',
        'description': 'Matriz IEIA validada con modelo estadístico R² = 99.43%',
        'ieia': IEIA_VALIDADO,
        'iecb': IECB_VALIDADO,
        'excluded_products': {
            'spinosad': {
                'reason': 'IEIA negativo validado',
                'trips': -65.8,
                'minador': -1290.9
            }
        }
    })


@router.get("/finca-config")
async def get_finca_config():
    """Retorna configuración de finca."""
    return JSONResponse(content={
        'status': 'success',
        'secciones': SECCIONES_FINCA,
        'total_turbinas': sum(s['turbinas'] for s in SECCIONES_FINCA.values()),
        'total_hectareas': sum(s['hectareas'] for s in SECCIONES_FINCA.values()),
        'total_arboles': sum(s['arboles'] for s in SECCIONES_FINCA.values()),
        'gdd_ciclo': 1650,
        'ciclos_anuales': 3
    })


@router.get("/levers/{section}")
async def get_levers(section: str):
    """Retorna palancas de optimización para una sección."""
    if section not in ['S1', 'S2', 'S3']:
        raise HTTPException(status_code=400, detail="Sección inválida.")
    
    return JSONResponse(content={
        'status': 'success',
        'section': section,
        'levers': generate_levers(0.4),
        'turbinas': SECCIONES_FINCA[section]['turbinas'],
        'hectareas': SECCIONES_FINCA[section]['hectareas']
    })
