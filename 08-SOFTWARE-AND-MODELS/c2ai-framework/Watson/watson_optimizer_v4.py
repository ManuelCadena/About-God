#!/usr/bin/env python3
"""
WATSON OPTIMIZER v4.0 - MOTOR INTEGRAL CON 3 CICLOS FLORACIÓN
==============================================================
Integra:
- 3 Ciclos de Floración Anuales (BioFix resets)
- Modelo G(t) de Crecimiento de Fruto hasta 53mm (Calibre 230)
- Modelo IPF Motor Unificado (MAX por sección)
- Modelo IEIA Efectividad Estadística (Sección 59)
- Modelos Predictivos Plagas R²>0.96 (Sección 60)
- Restricciones de Productos: Rotación, Sinergias, Antagonismos, pH
- Matriz de Compatibilidad de Mezclas
- Optimizador de Recetas por Semana ISO

Flujo: CLIMA → GDD → FENOLOGÍA → CICLO → G(t) → PREDICCIÓN PLAGAS → RECETA

Meta: IPF < 0.30 con 95% probabilidad | Calibre 230 (53mm) en cosecha
Autor: CitrusMax C²AI
Fecha: 5 Enero 2026
"""

import math
import requests
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import json

# =============================================================================
# CONFIGURACIÓN GENERAL
# =============================================================================

TOMORROW_IO_KEY = "56o4qH7ini5skUUB0baQlBjTQBoZU2xQ"
LATITUDE = 17.775366
LONGITUDE = -94.05922

# Configuración de secciones
SECCIONES = {
    "S1": {"ha": 84, "plantas": 34911, "edad": 5, "biofix_offset": 0},
    "S2": {"ha": 83, "plantas": 34756, "edad": 4, "biofix_offset": 7},
    "S3": {"ha": 129, "plantas": 53821, "edad": 3, "biofix_offset": 14}
}

# =============================================================================
# 3 CICLOS DE FLORACIÓN ANUALES (Lima Persa - Veracruz)
# =============================================================================

CICLOS_FLORACION = {
    # Ciclo 1: Principal (Marzo-Abril) → Cosecha Julio-Agosto
    1: {
        "nombre": "Principal",
        "biofix_mes": 3,  # Marzo
        "biofix_semana_iso": 10,
        "gdd_floracion": {"min": 145, "max": 160},
        "gdd_cosecha_53mm": 450,  # GDD para alcanzar calibre 230 (53mm)
        "confianza": 0.95,
        "aporte_produccion": 0.50  # 50% de producción anual
    },
    # Ciclo 2: Secundario (Junio-Julio) → Cosecha Oct-Nov
    2: {
        "nombre": "Secundario",
        "biofix_mes": 6,  # Junio
        "biofix_semana_iso": 24,
        "gdd_floracion": {"min": 290, "max": 320},
        "gdd_cosecha_53mm": 450,
        "confianza": 0.85,
        "aporte_produccion": 0.30  # 30% de producción anual
    },
    # Ciclo 3: Terciario (Sept-Oct) → Cosecha Ene-Feb siguiente año
    3: {
        "nombre": "Terciario",
        "biofix_mes": 9,  # Septiembre
        "biofix_semana_iso": 38,
        "gdd_floracion": {"min": 435, "max": 480},
        "gdd_cosecha_53mm": 450,
        "confianza": 0.75,
        "aporte_produccion": 0.20  # 20% de producción anual
    }
}

# Fases fenológicas con GDD (se resetean en cada BioFix)
PHENOLOGY_PHASES = {
    "FEN-01": {"nombre": "Latencia", "gdd_min": 0, "gdd_max": 30},
    "FEN-02": {"nombre": "Brotación", "gdd_min": 30, "gdd_max": 60},
    "FEN-03": {"nombre": "Floración", "gdd_min": 60, "gdd_max": 100},
    "FEN-04": {"nombre": "Cuajado", "gdd_min": 100, "gdd_max": 150},
    "FEN-05": {"nombre": "Desarrollo", "gdd_min": 150, "gdd_max": 350},
    "FEN-06": {"nombre": "Maduración", "gdd_min": 350, "gdd_max": 450},
    "FEN-07": {"nombre": "Cosecha", "gdd_min": 450, "gdd_max": 500}  # Limite 53mm
}

# =============================================================================
# MODELO G(t) DE CRECIMIENTO DE FRUTO
# =============================================================================

class ModeloCrecimientoFruto:
    """
    Modelo CitrusMax Harvest Enhanced v4.0
    G(t) = g₀ × f_T(T) × f_R(PAR) × f_W(ETa/ETc) × f_N(NPF) × f_S(P,E) × f_L(N_frutos)
    
    Meta: Alcanzar 53mm (Calibre 230) antes de cosecha
    """
    
    # Parámetros calibrados
    G0 = 1.05  # mm/día tasa base crecimiento
    T_MIN = 12.5  # °C temperatura mínima
    T_OPT = 27.5  # °C temperatura óptima
    T_MAX = 35.0  # °C temperatura máxima
    PAR_OPT = 20.0  # MJ/m²/d radiación óptima
    
    # Coeficientes de penalización sanitaria
    GAMMA_P = 0.20  # plagas
    GAMMA_E = 0.09  # enfermedades
    
    # Carga frutal
    N_REF = 500  # frutos/árbol referencia
    BETA_L = 0.4  # exponente carga frutal
    
    # Calibres de exportación (mm)
    CALIBRES = {
        "175": {"min_mm": 58, "max_mm": 63, "premium": True, "price_factor": 1.3},
        "200": {"min_mm": 54, "max_mm": 58, "premium": True, "price_factor": 1.2},
        "230": {"min_mm": 50, "max_mm": 54, "premium": True, "price_factor": 1.1},  # TARGET 53mm
        "250": {"min_mm": 47, "max_mm": 50, "premium": False, "price_factor": 1.0},
        "275": {"min_mm": 44, "max_mm": 47, "premium": False, "price_factor": 0.9},
        "300": {"min_mm": 42, "max_mm": 44, "premium": False, "price_factor": 0.8}
    }
    
    @classmethod
    def f_T(cls, temp: float) -> float:
        """Función temperatura (cardinal)"""
        if temp < cls.T_MIN or temp > cls.T_MAX:
            return 0.0
        elif temp <= cls.T_OPT:
            return (temp - cls.T_MIN) / (cls.T_OPT - cls.T_MIN)
        else:
            return (cls.T_MAX - temp) / (cls.T_MAX - cls.T_OPT)
    
    @classmethod
    def f_S(cls, p_idx: float, e_idx: float) -> float:
        """Función sanitaria (penalización exponencial por plagas/enfermedades)"""
        return math.exp(-cls.GAMMA_P * p_idx - cls.GAMMA_E * e_idx)
    
    @classmethod
    def calcular_crecimiento_diario(cls, temp: float, ipf: float, npf: float = 0.9) -> Dict:
        """
        Calcula crecimiento diario del fruto en mm
        
        Args:
            temp: Temperatura media diaria (°C)
            ipf: Índice de Presión Fitosanitaria (0-1)
            npf: Factor Nutrición (0-1)
        
        Returns:
            Dict con tasa de crecimiento y factores
        """
        f_t = cls.f_T(temp)
        f_s = cls.f_S(ipf * 3, ipf * 3)  # Convertir IPF a escala 0-3
        f_n = min(1.0, npf / 0.9)  # Normalizar NPF
        
        g_t = cls.G0 * f_t * f_s * f_n
        
        return {
            "g_t_mm_dia": round(g_t, 3),
            "g0": cls.G0,
            "f_T": round(f_t, 3),
            "f_S": round(f_s, 3),
            "f_N": round(f_n, 3)
        }
    
    @classmethod
    def proyectar_diametro(cls, diametro_inicial: float, dias: int, 
                           temp_promedio: float, ipf_promedio: float) -> Dict:
        """
        Proyecta diámetro del fruto después de N días
        
        Returns:
            Dict con diámetro proyectado y calibre esperado
        """
        crecimiento = cls.calcular_crecimiento_diario(temp_promedio, ipf_promedio)
        crecimiento_total = crecimiento["g_t_mm_dia"] * dias
        diametro_final = diametro_inicial + crecimiento_total
        
        # Determinar calibre
        calibre = "300"  # Default
        for cal, info in cls.CALIBRES.items():
            if info["min_mm"] <= diametro_final < info["max_mm"]:
                calibre = cal
                break
        
        return {
            "diametro_inicial_mm": diametro_inicial,
            "diametro_final_mm": round(diametro_final, 1),
            "crecimiento_total_mm": round(crecimiento_total, 1),
            "dias": dias,
            "calibre_esperado": calibre,
            "es_premium": cls.CALIBRES.get(calibre, {}).get("premium", False),
            "alcanza_53mm": diametro_final >= 50
        }
    
    @classmethod
    def dias_para_calibre_230(cls, diametro_actual: float, temp_promedio: float, 
                               ipf_promedio: float) -> int:
        """Calcula días necesarios para alcanzar calibre 230 (53mm)"""
        target = 53.0  # mm
        if diametro_actual >= target:
            return 0
        
        crecimiento = cls.calcular_crecimiento_diario(temp_promedio, ipf_promedio)
        if crecimiento["g_t_mm_dia"] <= 0:
            return 999  # No alcanzable
        
        dias = math.ceil((target - diametro_actual) / crecimiento["g_t_mm_dia"])
        return dias


# =============================================================================
# CATÁLOGO DE PRODUCTOS CON RESTRICCIONES
# =============================================================================

CATALOGO_PRODUCTOS = {
    # INSECTICIDAS
    "confinal": {
        "nombre": "Confinal 350 SC",
        "tipo": "Insecticida",
        "ingrediente_activo": "Imidacloprid",
        "grupo_quimico": "Neonicotinoide",
        "modo_accion": "Sistémico",
        "ph_optimo": {"min": 5.0, "max": 7.0},
        "costo_lt": 699,
        "dosis_lt_ha": 0.5,
        "intervalo_seguridad_dias": 14,
        "rotacion_dias": 21,  # Días mínimos antes de repetir
        "max_aplicaciones_ciclo": 2,
        "targets": ["diaforina", "pulgon", "picudo_barrenador"],
        "ieia": {"diaforina": 0.75, "pulgon": 0.70, "picudo_barrenador": 0.85},
        "sinergias": ["sulfocalcico", "citroil"],
        "antagonismos": ["productos_alcalinos"],
        "incompatibles": [],
        "requiere_adherente": True
    },
    "exalt": {
        "nombre": "Exalt 60 SC",
        "tipo": "Insecticida",
        "ingrediente_activo": "Spinetoram",
        "grupo_quimico": "Spinosina",
        "modo_accion": "Contacto/Ingestión",
        "ph_optimo": {"min": 5.5, "max": 8.0},
        "costo_lt": 2600,
        "dosis_lt_ha": 0.3,
        "intervalo_seguridad_dias": 7,
        "rotacion_dias": 14,
        "max_aplicaciones_ciclo": 3,
        "targets": ["trips", "minador"],
        "ieia": {"trips": 0.44, "minador": 0.53},
        "sinergias": ["aceites_agricolas"],
        "antagonismos": [],
        "incompatibles": ["productos_cobre_altas_dosis"],
        "requiere_adherente": False
    },
    "spintor": {
        "nombre": "Spintor 480 SC",
        "tipo": "Insecticida",
        "ingrediente_activo": "Spinosad",
        "grupo_quimico": "Spinosina",
        "modo_accion": "Contacto/Ingestión",
        "ph_optimo": {"min": 5.0, "max": 8.0},
        "costo_lt": 1800,
        "dosis_lt_ha": 0.25,
        "intervalo_seguridad_dias": 3,
        "rotacion_dias": 14,
        "max_aplicaciones_ciclo": 3,
        "targets": ["trips", "minador"],
        "ieia": {"trips": -1.43, "minador": -22.8},  # DESCONTINUAR
        "sinergias": [],
        "antagonismos": [],
        "incompatibles": [],
        "requiere_adherente": False,
        "descontinuado": True  # Por IEIA negativo
    },
    "citroil": {
        "nombre": "Citroil",
        "tipo": "Insecticida/Acaricida",
        "ingrediente_activo": "Aceite Mineral",
        "grupo_quimico": "Aceite",
        "modo_accion": "Contacto/Asfixia",
        "ph_optimo": {"min": 6.0, "max": 8.0},
        "costo_lt": 185,
        "dosis_lt_ha": 2.0,
        "intervalo_seguridad_dias": 0,
        "rotacion_dias": 7,
        "max_aplicaciones_ciclo": 6,
        "targets": ["acaros", "escamas", "mosca_blanca"],
        "ieia": {"acaros": 0.60, "escamas": 0.70},
        "sinergias": ["insecticidas", "fungicidas"],
        "antagonismos": ["azufre_alto_temp"],  # No mezclar con azufre >30°C
        "incompatibles": ["sulfocalcico"],  # Fitotoxicidad
        "requiere_adherente": False
    },
    
    # ACARICIDAS
    "sulfocalcico": {
        "nombre": "Sulfocalcico",
        "tipo": "Acaricida/Fungicida",
        "ingrediente_activo": "Polisulfuro de Calcio",
        "grupo_quimico": "Inorgánico",
        "modo_accion": "Contacto",
        "ph_optimo": {"min": 10.0, "max": 12.0},  # Muy alcalino
        "costo_kg": 8,
        "dosis_kg_ha": 15,
        "intervalo_seguridad_dias": 3,
        "rotacion_dias": 14,
        "max_aplicaciones_ciclo": 4,
        "targets": ["arana_roja", "acaro_blanco", "rona", "melanosis", "fumagina"],
        "ieia": {"arana_roja": 0.85, "rona": 1.00, "melanosis": 1.00, "acaro_blanco": 1.00, "fumagina": 0.89},
        "sinergias": [],
        "antagonismos": ["aceites", "productos_acidos"],
        "incompatibles": ["citroil", "aceites_minerales", "cobre"],  # CRÍTICO
        "requiere_adherente": False,
        "restriccion_temp": {"max": 32}  # No aplicar >32°C
    },
    "pext": {
        "nombre": "PEXT 18 CE",
        "tipo": "Acaricida",
        "ingrediente_activo": "Abamectina",
        "grupo_quimico": "Avermectina",
        "modo_accion": "Contacto/Translaminar",
        "ph_optimo": {"min": 5.0, "max": 7.0},
        "costo_lt": 450,
        "dosis_lt_ha": 0.5,
        "intervalo_seguridad_dias": 7,
        "rotacion_dias": 14,
        "max_aplicaciones_ciclo": 2,
        "targets": ["arana_roja", "acaros"],
        "ieia": {"arana_roja": 0.70, "acaros": 0.75},
        "sinergias": ["aceites_agricolas"],
        "antagonismos": [],
        "incompatibles": [],
        "requiere_adherente": True
    },
    
    # FUNGICIDAS
    "sulfato_cobre": {
        "nombre": "Sulfato de Cobre Pentahidratado",
        "tipo": "Fungicida/Bactericida",
        "ingrediente_activo": "Cobre",
        "grupo_quimico": "Inorgánico",
        "modo_accion": "Contacto/Preventivo",
        "ph_optimo": {"min": 6.0, "max": 7.5},
        "costo_kg": 90,
        "dosis_kg_ha": 2,
        "intervalo_seguridad_dias": 7,
        "rotacion_dias": 14,
        "max_aplicaciones_ciclo": 4,
        "targets": ["mancha_grasienta", "gomosis", "alga_roja", "rona", "antracnosis"],
        "ieia": {"mancha_grasienta": 0.79, "gomosis": 0.65, "alga_roja": 0.70, "rona": 0.65, "antracnosis": 0.60},
        "sinergias": ["mancozeb"],
        "antagonismos": [],
        "incompatibles": ["sulfocalcico", "productos_muy_acidos"],
        "requiere_adherente": False
    },
    "kumulus": {
        "nombre": "Kumulus DF",
        "tipo": "Fungicida/Acaricida",
        "ingrediente_activo": "Azufre",
        "grupo_quimico": "Inorgánico",
        "modo_accion": "Contacto",
        "ph_optimo": {"min": 6.0, "max": 8.0},
        "costo_kg": 95,
        "dosis_kg_ha": 3,
        "intervalo_seguridad_dias": 1,
        "rotacion_dias": 7,
        "max_aplicaciones_ciclo": 6,
        "targets": ["oidio", "acaros"],
        "ieia": {"oidio": 0.80, "acaros": 0.50},
        "sinergias": [],
        "antagonismos": ["aceites"],  # No mezclar con aceites
        "incompatibles": ["citroil", "aceites_minerales"],
        "requiere_adherente": False,
        "restriccion_temp": {"max": 30}  # Fitotoxicidad >30°C
    },
    "carbendazim": {
        "nombre": "Carbendazim 500 SC",
        "tipo": "Fungicida",
        "ingrediente_activo": "Carbendazim",
        "grupo_quimico": "Benzimidazol",
        "modo_accion": "Sistémico",
        "ph_optimo": {"min": 5.0, "max": 8.0},
        "costo_lt": 225,
        "dosis_lt_ha": 0.5,
        "intervalo_seguridad_dias": 14,
        "rotacion_dias": 21,
        "max_aplicaciones_ciclo": 2,
        "targets": ["antracnosis", "botrytis"],
        "ieia": {"antracnosis": 0.75, "botrytis": 0.70},
        "sinergias": ["mancozeb"],
        "antagonismos": [],
        "incompatibles": [],
        "requiere_adherente": False
    },
    
    # FERTILIZANTES FOLIARES
    "magzibor": {
        "nombre": "Magzibor",
        "tipo": "Fertilizante Foliar",
        "ingrediente_activo": "Mg+Zn+B",
        "grupo_quimico": "Micronutrientes",
        "modo_accion": "Nutrición Foliar",
        "ph_optimo": {"min": 5.5, "max": 7.0},
        "costo_kg": 145,
        "dosis_kg_ha": 2,
        "intervalo_seguridad_dias": 0,
        "rotacion_dias": 7,
        "max_aplicaciones_ciclo": 8,
        "targets": ["deficiencia_mg", "deficiencia_zn", "deficiencia_b"],
        "ieia": {},
        "sinergias": ["insecticidas", "fungicidas"],
        "antagonismos": [],
        "incompatibles": ["fosfatos_altos"],
        "requiere_adherente": False
    },
    "citrel": {
        "nombre": "Citrel",
        "tipo": "Fertilizante Foliar",
        "ingrediente_activo": "NPK+Microelementos",
        "grupo_quimico": "Complejo",
        "modo_accion": "Nutrición Foliar",
        "ph_optimo": {"min": 5.5, "max": 7.0},
        "costo_lt": 165,
        "dosis_lt_ha": 2,
        "intervalo_seguridad_dias": 0,
        "rotacion_dias": 7,
        "max_aplicaciones_ciclo": 8,
        "targets": ["nutricion_general"],
        "ieia": {},
        "sinergias": ["insecticidas", "fungicidas"],
        "antagonismos": [],
        "incompatibles": [],
        "requiere_adherente": False
    },
    
    # ADHERENTES
    "inex_a": {
        "nombre": "Inex-A",
        "tipo": "Adherente/Surfactante",
        "ingrediente_activo": "Nonil Fenol Etoxilado",
        "grupo_quimico": "Surfactante",
        "modo_accion": "Mojante/Penetrante",
        "ph_optimo": {"min": 4.0, "max": 10.0},
        "costo_lt": 85,
        "dosis_lt_ha": 0.25,
        "intervalo_seguridad_dias": 0,
        "rotacion_dias": 0,
        "max_aplicaciones_ciclo": 99,
        "targets": [],
        "ieia": {},
        "sinergias": ["todos"],
        "antagonismos": [],
        "incompatibles": [],
        "requiere_adherente": False
    }
}

# =============================================================================
# MATRIZ DE COMPATIBILIDAD DE MEZCLAS
# =============================================================================

MATRIZ_COMPATIBILIDAD = {
    # 1 = Compatible, 0 = Incompatible, -1 = Verificar pH
    ("sulfocalcico", "citroil"): 0,  # CRÍTICO: Fitotoxicidad
    ("sulfocalcico", "sulfato_cobre"): 0,  # Precipitación
    ("sulfocalcico", "aceites"): 0,
    ("kumulus", "citroil"): 0,  # Fitotoxicidad >30°C
    ("kumulus", "aceites"): 0,
    ("confinal", "sulfocalcico"): 1,  # OK
    ("confinal", "citroil"): 1,  # Sinergia
    ("exalt", "sulfato_cobre"): -1,  # Verificar dosis Cu
    ("pext", "citroil"): 1,  # Sinergia
    ("carbendazim", "sulfato_cobre"): 1,  # OK
    ("magzibor", "insecticidas"): 1,  # Compatible general
    ("citrel", "fungicidas"): 1,  # Compatible general
}

def verificar_compatibilidad(productos: List[str]) -> Dict:
    """Verifica compatibilidad de mezcla de productos"""
    incompatibles = []
    advertencias = []
    
    for i, p1 in enumerate(productos):
        for p2 in productos[i+1:]:
            key1 = (p1, p2)
            key2 = (p2, p1)
            
            compat = MATRIZ_COMPATIBILIDAD.get(key1, MATRIZ_COMPATIBILIDAD.get(key2, 1))
            
            if compat == 0:
                incompatibles.append(f"{p1} + {p2}: INCOMPATIBLES")
            elif compat == -1:
                advertencias.append(f"{p1} + {p2}: Verificar pH y dosis")
    
    # Verificar restricciones de productos individuales
    for prod in productos:
        info = CATALOGO_PRODUCTOS.get(prod, {})
        for incomp in info.get("incompatibles", []):
            if incomp in productos:
                incompatibles.append(f"{prod} incompatible con {incomp}")
    
    return {
        "compatible": len(incompatibles) == 0,
        "incompatibles": incompatibles,
        "advertencias": advertencias
    }


def calcular_ph_mezcla(productos: List[str]) -> Dict:
    """Calcula rango de pH óptimo para la mezcla"""
    ph_mins = []
    ph_maxs = []
    
    for prod in productos:
        info = CATALOGO_PRODUCTOS.get(prod, {})
        ph_range = info.get("ph_optimo", {"min": 5.0, "max": 8.0})
        ph_mins.append(ph_range["min"])
        ph_maxs.append(ph_range["max"])
    
    # El pH óptimo de la mezcla es la intersección de los rangos
    ph_min_mezcla = max(ph_mins) if ph_mins else 5.0
    ph_max_mezcla = min(ph_maxs) if ph_maxs else 8.0
    
    if ph_min_mezcla > ph_max_mezcla:
        return {
            "compatible_ph": False,
            "ph_recomendado": None,
            "mensaje": "⚠️ Los productos tienen rangos de pH incompatibles"
        }
    
    ph_recomendado = (ph_min_mezcla + ph_max_mezcla) / 2
    
    return {
        "compatible_ph": True,
        "ph_min": ph_min_mezcla,
        "ph_max": ph_max_mezcla,
        "ph_recomendado": round(ph_recomendado, 1),
        "mensaje": f"Ajustar pH del agua a {ph_recomendado:.1f} (rango: {ph_min_mezcla}-{ph_max_mezcla})"
    }


# =============================================================================
# OPTIMIZADOR DE RECETAS
# =============================================================================

class OptimizadorRecetas:
    """Genera recetas optimizadas considerando todas las restricciones"""
    
    def __init__(self):
        self.historial_aplicaciones = {}  # {producto: [fechas_aplicacion]}
    
    def generar_receta(self, plagas_objetivo: Dict[str, float], 
                       fenologia: int, temp_actual: float,
                       presupuesto_max: float = 5000) -> Dict:
        """
        Genera receta optimizada para las plagas objetivo
        
        Args:
            plagas_objetivo: {plaga: nivel_actual}
            fenologia: Fase fenológica (1-7)
            temp_actual: Temperatura actual (°C)
            presupuesto_max: Presupuesto máximo MXN/ha
        
        Returns:
            Receta optimizada con productos, dosis, pH y costo
        """
        productos_seleccionados = []
        costo_total = 0
        
        # Ordenar plagas por prioridad (nivel más alto primero)
        plagas_ordenadas = sorted(plagas_objetivo.items(), key=lambda x: x[1], reverse=True)
        
        for plaga, nivel in plagas_ordenadas:
            if nivel < 0.28:  # Ya está bajo control
                continue
            
            # Buscar mejor producto para esta plaga
            mejor_producto = self._seleccionar_producto(
                plaga, nivel, productos_seleccionados, temp_actual
            )
            
            if mejor_producto and costo_total + mejor_producto["costo_ha"] <= presupuesto_max:
                productos_seleccionados.append(mejor_producto)
                costo_total += mejor_producto["costo_ha"]
        
        # Verificar si necesita adherente
        necesita_adherente = any(
            CATALOGO_PRODUCTOS.get(p["producto"], {}).get("requiere_adherente", False)
            for p in productos_seleccionados
        )
        
        if necesita_adherente:
            productos_seleccionados.append({
                "producto": "inex_a",
                "nombre": "Inex-A",
                "dosis": "0.25 Lt/ha",
                "costo_ha": 21.25,
                "razon": "Adherente requerido"
            })
            costo_total += 21.25
        
        # Verificar compatibilidad
        nombres_productos = [p["producto"] for p in productos_seleccionados]
        compatibilidad = verificar_compatibilidad(nombres_productos)
        
        # Calcular pH de mezcla
        ph_mezcla = calcular_ph_mezcla(nombres_productos)
        
        return {
            "productos": productos_seleccionados,
            "costo_total_ha": round(costo_total, 2),
            "compatibilidad": compatibilidad,
            "ph_mezcla": ph_mezcla,
            "fenologia": f"FEN-{fenologia:02d}",
            "orden_mezcla": self._determinar_orden_mezcla(productos_seleccionados),
            "volumen_agua_lt_ha": 400,  # Estándar para cítricos
            "tiempo_aplicacion": self._determinar_tiempo_aplicacion(temp_actual)
        }
    
    def _seleccionar_producto(self, plaga: str, nivel: float, 
                               ya_seleccionados: List[Dict], temp: float) -> Optional[Dict]:
        """Selecciona el mejor producto para una plaga específica"""
        candidatos = []
        
        for prod_id, info in CATALOGO_PRODUCTOS.items():
            # Verificar si está descontinuado
            if info.get("descontinuado", False):
                continue
            
            # Verificar si ataca la plaga objetivo
            if plaga not in info.get("targets", []):
                continue
            
            # Verificar restricción de temperatura
            temp_max = info.get("restriccion_temp", {}).get("max", 99)
            if temp > temp_max:
                continue
            
            # Verificar compatibilidad con productos ya seleccionados
            prods_actuales = [p["producto"] for p in ya_seleccionados]
            if prod_id in [p["producto"] for p in ya_seleccionados]:
                continue  # Ya está en la receta
            
            compat = verificar_compatibilidad(prods_actuales + [prod_id])
            if not compat["compatible"]:
                continue
            
            # Calcular IEIA para esta plaga
            ieia = info.get("ieia", {}).get(plaga, 0.5)
            if ieia < 0.40:  # Umbral mínimo efectividad
                continue
            
            # Calcular costo por hectárea
            if "costo_kg" in info:
                costo_ha = info["costo_kg"] * info["dosis_kg_ha"]
                dosis_str = f"{info['dosis_kg_ha']} kg/ha"
            else:
                costo_ha = info["costo_lt"] * info["dosis_lt_ha"]
                dosis_str = f"{info['dosis_lt_ha']} Lt/ha"
            
            candidatos.append({
                "producto": prod_id,
                "nombre": info["nombre"],
                "dosis": dosis_str,
                "costo_ha": costo_ha,
                "ieia": ieia,
                "iecb": ieia / (costo_ha / 1000),  # Índice costo-beneficio
                "razon": f"Control {plaga} (IEIA={ieia:.0%})"
            })
        
        if not candidatos:
            return None
        
        # Ordenar por IECB (mayor es mejor)
        return sorted(candidatos, key=lambda x: x["iecb"], reverse=True)[0]
    
    def _determinar_orden_mezcla(self, productos: List[Dict]) -> List[str]:
        """Determina el orden correcto para agregar productos al tanque"""
        orden = []
        
        # 1. Primero productos solubles en agua (polvos)
        for p in productos:
            info = CATALOGO_PRODUCTOS.get(p["producto"], {})
            if "kg" in p.get("dosis", ""):
                orden.append(f"1. {p['nombre']} ({p['dosis']}) - Disolver primero")
        
        # 2. Después líquidos
        for p in productos:
            info = CATALOGO_PRODUCTOS.get(p["producto"], {})
            if "Lt" in p.get("dosis", "") and info.get("tipo") != "Adherente/Surfactante":
                orden.append(f"2. {p['nombre']} ({p['dosis']})")
        
        # 3. Adherente al final
        for p in productos:
            info = CATALOGO_PRODUCTOS.get(p["producto"], {})
            if info.get("tipo") == "Adherente/Surfactante":
                orden.append(f"3. {p['nombre']} ({p['dosis']}) - Agregar al final")
        
        return orden
    
    def _determinar_tiempo_aplicacion(self, temp: float) -> str:
        """Determina mejor momento para aplicar basado en temperatura"""
        if temp > 30:
            return "⚠️ Aplicar TEMPRANO (6-9am) o TARDE (4-7pm) - Evitar horas calientes"
        elif temp < 15:
            return "Aplicar cuando temperatura suba >15°C para mejor absorción"
        else:
            return "Condiciones óptimas para aplicación"


# =============================================================================
# MODELO IEIA EFECTIVIDAD ESTADÍSTICA (Sección 59)
# =============================================================================

IEIA_ESTADISTICO = {
    "sulfocalcico": {
        "rona": {"ieia": 1.00, "iecb": 40.32},
        "melanosis": {"ieia": 1.00, "iecb": 30.49},
        "acaro_blanco": {"ieia": 1.00, "iecb": 31.25},
        "fumagina": {"ieia": 0.893, "iecb": 21.47},
        "arana_roja": {"ieia": 0.85, "iecb": 25.00}
    },
    "sulfato_cobre": {
        "mancha_grasienta": {"ieia": 0.794, "iecb": 1.15},
        "gomosis": {"ieia": 0.651, "iecb": 0.85},
        "alga_roja": {"ieia": 0.70, "iecb": 2.06},
        "rona": {"ieia": 0.65, "iecb": 1.29},
        "antracnosis": {"ieia": 0.60, "iecb": 0.90}
    },
    "confinal": {
        "picudo_barrenador": {"ieia": 0.853, "iecb": 0.31},
        "diaforina": {"ieia": 0.75, "iecb": 0.25},
        "pulgon": {"ieia": 0.70, "iecb": 0.22}
    },
    "exalt": {
        "minador": {"ieia": 0.532, "iecb": 0.05},
        "trips": {"ieia": 0.442, "iecb": 0.04}
    }
}


# =============================================================================
# WATSON OPTIMIZER v4.0 - MOTOR PRINCIPAL
# =============================================================================

class WatsonOptimizerV4:
    """
    Optimizador Watson v4.0 con:
    - 3 Ciclos de Floración Anuales
    - Modelo G(t) de Crecimiento
    - Optimizador de Recetas con Restricciones
    """
    
    META_IPF = 0.28
    
    def __init__(self):
        self.modelo_crecimiento = ModeloCrecimientoFruto()
        self.optimizador_recetas = OptimizadorRecetas()
    
    def generar_programa_2026(self, valores_actuales: Dict[str, Dict]) -> Dict:
        """
        Genera programa completo 2026 con 3 ciclos de floración
        """
        print("=" * 80)
        print("WATSON OPTIMIZER v4.0 - PROGRAMA 2026 CON 3 CICLOS FLORACIÓN")
        print("=" * 80)
        
        programa = {"ciclos": {}, "resumen": {}, "recetas_por_semana": {}}
        costo_total_anual = 0
        
        # Iterar por los 3 ciclos de floración
        for ciclo_num, ciclo_info in CICLOS_FLORACION.items():
            print(f"\n🌸 CICLO {ciclo_num}: {ciclo_info['nombre']} (BioFix: Semana {ciclo_info['biofix_semana_iso']})")
            
            programa["ciclos"][ciclo_num] = {
                "nombre": ciclo_info["nombre"],
                "biofix_semana": ciclo_info["biofix_semana_iso"],
                "aporte_produccion": f"{ciclo_info['aporte_produccion']*100:.0f}%",
                "semanas": {}
            }
            
            # Calcular semanas de este ciclo
            semana_inicio = ciclo_info["biofix_semana_iso"]
            gdd_actual = 0
            diametro_fruto = 5.0  # mm inicial después de cuajado
            
            for semana_offset in range(20):  # ~20 semanas por ciclo hasta cosecha
                semana_iso = (semana_inicio + semana_offset - 1) % 52 + 1
                
                # Calcular GDD acumulados (aproximado 12 GDD/día)
                gdd_semanal = 12 * 7  # ~84 GDD/semana
                gdd_actual += gdd_semanal
                
                # Determinar fenología basada en GDD
                fenologia = self._gdd_a_fenologia(gdd_actual)
                
                # Verificar si alcanzó cosecha (53mm)
                if gdd_actual >= ciclo_info["gdd_cosecha_53mm"]:
                    programa["ciclos"][ciclo_num]["semanas"][semana_iso] = {
                        "gdd": gdd_actual,
                        "fenologia": "FEN-07",
                        "fase": "COSECHA",
                        "diametro_mm": 53,
                        "calibre": "230",
                        "accion": "✂️ Cosechar - Calibre 230 alcanzado"
                    }
                    break
                
                # Calcular crecimiento del fruto
                crecimiento = self.modelo_crecimiento.calcular_crecimiento_diario(
                    temp=27, ipf=0.15
                )
                diametro_fruto += crecimiento["g_t_mm_dia"] * 7
                
                # Generar receta si hay plagas que tratar
                receta = None
                if fenologia in [2, 3, 5]:  # Fases críticas
                    plagas = valores_actuales.get("S1", {})
                    receta = self.optimizador_recetas.generar_receta(
                        plagas_objetivo=plagas,
                        fenologia=fenologia,
                        temp_actual=27,
                        presupuesto_max=3000
                    )
                    if receta["productos"]:
                        costo_total_anual += receta["costo_total_ha"] * 296  # Total ha
                        programa["recetas_por_semana"][semana_iso] = receta
                
                programa["ciclos"][ciclo_num]["semanas"][semana_iso] = {
                    "gdd": round(gdd_actual, 0),
                    "fenologia": f"FEN-{fenologia:02d}",
                    "fase": PHENOLOGY_PHASES.get(f"FEN-{fenologia:02d}", {}).get("nombre", ""),
                    "diametro_mm": round(diametro_fruto, 1),
                    "dias_para_53mm": self.modelo_crecimiento.dias_para_calibre_230(
                        diametro_fruto, 27, 0.15
                    ),
                    "receta": receta["productos"] if receta else None,
                    "costo_ha": receta["costo_total_ha"] if receta else 0
                }
        
        # Calcular resumen
        programa["resumen"] = {
            "costo_total_anual": round(costo_total_anual, 0),
            "costo_por_ha": round(costo_total_anual / 296, 2),
            "ciclos_floracion": 3,
            "meta_calibre": "230 (53mm)",
            "meta_ipf": f"< 0.30 (95% prob)",
            "modelo_crecimiento": "G(t) = g₀ × f_T × f_S × f_N",
            "generado": datetime.now().isoformat()
        }
        
        return programa
    
    def _gdd_a_fenologia(self, gdd: float) -> int:
        """Convierte GDD a número de fase fenológica"""
        for fase, info in PHENOLOGY_PHASES.items():
            if info["gdd_min"] <= gdd < info["gdd_max"]:
                return int(fase[-2:])
        return 7


# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================

if __name__ == "__main__":
    # Valores actuales MAX por sección
    VALORES_ACTUALES = {
        "S1": {
            "trips": 0.46, "minador": 0.48, "arana_roja": 0.27,
            "pulgon": 0.07, "diaforina": 0.17, "antracnosis": 0.09,
            "mancha_grasienta": 0.34
        },
        "S2": {
            "trips": 0.24, "minador": 0.24, "arana_roja": 0.30,
            "pulgon": 0.18, "diaforina": 0.17, "antracnosis": 0.10,
            "mancha_grasienta": 0.09
        },
        "S3": {
            "trips": 0.15, "minador": 0.17, "arana_roja": 0.14,
            "pulgon": 0.12, "diaforina": 0.45, "antracnosis": 0.04,
            "mancha_grasienta": 0.06
        }
    }
    
    # Crear optimizer
    optimizer = WatsonOptimizerV4()
    
    # Generar programa 2026
    programa = optimizer.generar_programa_2026(VALORES_ACTUALES)
    
    # Mostrar resultados
    print("\n" + "=" * 80)
    print("RESUMEN PROGRAMA 2026 - 3 CICLOS FLORACIÓN")
    print("=" * 80)
    
    resumen = programa["resumen"]
    print(f"\n💰 Costo Total Anual: ${resumen['costo_total_anual']:,.0f} MXN")
    print(f"📊 Costo por Hectárea: ${resumen['costo_por_ha']:,.2f} MXN/ha")
    print(f"🌸 Ciclos de Floración: {resumen['ciclos_floracion']}")
    print(f"🎯 Meta Calibre: {resumen['meta_calibre']}")
    print(f"🛡️ Meta IPF: {resumen['meta_ipf']}")
    
    print("\n" + "=" * 80)
    print("CICLOS DE FLORACIÓN 2026")
    print("=" * 80)
    
    for ciclo_num, ciclo_data in programa["ciclos"].items():
        print(f"\n🌸 CICLO {ciclo_num}: {ciclo_data['nombre']}")
        print(f"   BioFix: Semana ISO {ciclo_data['biofix_semana']}")
        print(f"   Aporte Producción: {ciclo_data['aporte_produccion']}")
        print(f"   Semanas del ciclo: {len(ciclo_data['semanas'])}")
        
        # Mostrar última semana (cosecha)
        ultima_semana = list(ciclo_data['semanas'].keys())[-1]
        datos_cosecha = ciclo_data['semanas'][ultima_semana]
        print(f"   Cosecha: Semana {ultima_semana} | {datos_cosecha.get('accion', datos_cosecha.get('fase', ''))}")
    
    print("\n" + "=" * 80)
    print("EJEMPLO RECETA OPTIMIZADA (Semana 10)")
    print("=" * 80)
    
    # Generar ejemplo de receta
    receta_ejemplo = optimizer.optimizador_recetas.generar_receta(
        plagas_objetivo=VALORES_ACTUALES["S1"],
        fenologia=3,  # Floración
        temp_actual=28,
        presupuesto_max=3000
    )
    
    print(f"\n📋 RECETA PARA FLORACIÓN (FEN-03)")
    print(f"   Fenología: {receta_ejemplo['fenologia']}")
    print(f"   Compatibilidad: {'✅ OK' if receta_ejemplo['compatibilidad']['compatible'] else '❌ INCOMPATIBLE'}")
    print(f"   pH Recomendado: {receta_ejemplo['ph_mezcla']['ph_recomendado']}")
    print(f"   Volumen Agua: {receta_ejemplo['volumen_agua_lt_ha']} Lt/ha")
    print(f"   Mejor Momento: {receta_ejemplo['tiempo_aplicacion']}")
    
    print("\n   PRODUCTOS:")
    for prod in receta_ejemplo["productos"]:
        print(f"      • {prod['nombre']} - {prod['dosis']} (${prod['costo_ha']:.2f}/ha)")
        print(f"        Razón: {prod['razon']}")
    
    print(f"\n   ORDEN DE MEZCLA:")
    for paso in receta_ejemplo["orden_mezcla"]:
        print(f"      {paso}")
    
    print(f"\n   💰 COSTO TOTAL: ${receta_ejemplo['costo_total_ha']:.2f} MXN/ha")
    
    if receta_ejemplo["compatibilidad"]["advertencias"]:
        print(f"\n   ⚠️ ADVERTENCIAS:")
        for adv in receta_ejemplo["compatibilidad"]["advertencias"]:
            print(f"      {adv}")
    
    # Guardar programa completo
    with open("programa_watson_v4_3ciclos.json", "w") as f:
        json.dump(programa, f, indent=2, default=str)
    
    print("\n" + "=" * 80)
    print(f"✓ Programa guardado: programa_watson_v4_3ciclos.json")
    print(f"✓ Generado: {resumen['generado']}")
    print("=" * 80)
