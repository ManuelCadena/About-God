#!/usr/bin/env python3
"""
🎯 WATSON OPTIMIZER - 7 MODELOS PREDICTIVOS DE PLAGAS/ENFERMEDADES
CitrusMax AI - Finca Citrícola La Luz

Implementación de los 7 modelos predictivos GDD-based para el Watson Optimizer
según especificaciones del documento PROPUESTA_ARQUITECTURA_OPTIMIZER_R2C_WATSON.md

Modelos:
1. TripsModel - Scirtothrips citri
2. MinadorModel - Phyllocnistis citrella  
3. AranaRojaModel - Panonychus citri
4. PulgonModel - Toxoptera citricida / Aphis
5. DiaphorinaModel - Diaphorina citri (Vector HLB)
6. AntracnosisModel - Colletotrichum spp.
7. ManchaGrasientaModel - Mycosphaerella citri

Autor: CitrusMax AI Team
Fecha: 5 Enero 2026
Versión: 1.0.0
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =============================================================================
# CONFIGURACIÓN GLOBAL - BIOFIX Y GDD
# =============================================================================

@dataclass
class BiofixConfig:
    """Configuración de BioFix validada (05-Ene-2026)"""
    S1_BIOFIX: str = "2025-10-15"  # Árboles 4 años, maduros
    S2_BIOFIX: str = "2025-10-20"  # Árboles 3 años, maduros
    S3_BIOFIX: str = "2025-12-12"  # Árboles 2 años, jóvenes
    
    GDD_PROMEDIO: float = 15.78  # GDD/día promedio
    GDD_CICLO_COMPLETO: int = 1650  # GDD para ciclo completo
    
    # Fases fenológicas (GDD ranges)
    FEN_01_LATENCIA: Tuple[int, int] = (0, 100)
    FEN_02_BROTACION: Tuple[int, int] = (100, 250)
    FEN_03_FLORACION: Tuple[int, int] = (250, 400)
    FEN_04_CUAJADO: Tuple[int, int] = (400, 550)
    FEN_05_DESARROLLO: Tuple[int, int] = (550, 1100)
    FEN_06_MADURACION: Tuple[int, int] = (1100, 1400)
    FEN_07_COSECHA: Tuple[int, int] = (1400, 1650)


class PhenologicalPhase(Enum):
    """Fases fenológicas del ciclo"""
    FEN_01 = "Latencia"
    FEN_02 = "Brotación"
    FEN_03 = "Floración"
    FEN_04 = "Cuajado"
    FEN_05 = "Desarrollo"
    FEN_06 = "Maduración"
    FEN_07 = "Cosecha"


class AlertLevel(Enum):
    """Niveles de alerta basados en índice de plaga/enfermedad"""
    VERDE = "Sin acción"
    AMARILLO = "Monitoreo intensivo"
    NARANJA = "Tratamiento preventivo"
    ROJO = "Tratamiento urgente"


# =============================================================================
# CLASE BASE PARA MODELOS PREDICTIVOS
# =============================================================================

class BasePestModel:
    """
    Clase base para todos los modelos predictivos de plagas/enfermedades.
    Implementa la estructura común y métodos compartidos.
    """
    
    def __init__(self, name: str, scientific_name: str):
        self.name = name
        self.scientific_name = scientific_name
        self.biofix_config = BiofixConfig()
        
        # Parámetros térmicos (deben ser sobrescritos por subclases)
        self.T_base: float = 10.0
        self.T_opt: float = 25.0
        self.T_max: float = 35.0
        self.DD_generation: int = 200
        
        # Coeficientes del modelo (deben ser sobrescritos)
        self.beta: Dict[str, float] = {}
        
        # Umbrales de acción
        self.umbrales = {
            'verde': (0, 0.5),
            'amarillo': (0.5, 1.5),
            'naranja': (1.5, 2.5),
            'rojo': (2.5, 3.0)
        }
        
        # Ventana crítica fenológica
        self.ventana_critica: str = "FEN_03"
        self.GDD_critico: Tuple[int, int] = (250, 550)
        
        # Peso económico (para IPF)
        self.peso_economico: float = 0.15
        
        logger.info(f"✅ Modelo {self.name} ({self.scientific_name}) inicializado")
    
    def get_phenological_phase(self, gdd: float) -> PhenologicalPhase:
        """Determinar fase fenológica basada en GDD acumulados"""
        config = self.biofix_config
        
        if gdd < config.FEN_01_LATENCIA[1]:
            return PhenologicalPhase.FEN_01
        elif gdd < config.FEN_02_BROTACION[1]:
            return PhenologicalPhase.FEN_02
        elif gdd < config.FEN_03_FLORACION[1]:
            return PhenologicalPhase.FEN_03
        elif gdd < config.FEN_04_CUAJADO[1]:
            return PhenologicalPhase.FEN_04
        elif gdd < config.FEN_05_DESARROLLO[1]:
            return PhenologicalPhase.FEN_05
        elif gdd < config.FEN_06_MADURACION[1]:
            return PhenologicalPhase.FEN_06
        else:
            return PhenologicalPhase.FEN_07
    
    def get_alert_level(self, index: float) -> AlertLevel:
        """Determinar nivel de alerta basado en índice predicho"""
        if index < self.umbrales['verde'][1]:
            return AlertLevel.VERDE
        elif index < self.umbrales['amarillo'][1]:
            return AlertLevel.AMARILLO
        elif index < self.umbrales['naranja'][1]:
            return AlertLevel.NARANJA
        else:
            return AlertLevel.ROJO
    
    def is_in_critical_window(self, gdd: float) -> bool:
        """Verificar si estamos en ventana crítica para esta plaga"""
        return self.GDD_critico[0] <= gdd <= self.GDD_critico[1]
    
    def predict(self, **kwargs) -> float:
        """
        Método de predicción (debe ser implementado por subclases)
        Returns: Índice predicho (0-3)
        """
        raise NotImplementedError("Subclases deben implementar predict()")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Obtener información del modelo"""
        return {
            'name': self.name,
            'scientific_name': self.scientific_name,
            'T_base': self.T_base,
            'T_opt': self.T_opt,
            'DD_generation': self.DD_generation,
            'ventana_critica': self.ventana_critica,
            'GDD_critico': self.GDD_critico,
            'peso_economico': self.peso_economico,
            'beta_coefficients': self.beta
        }


# =============================================================================
# MODELO 1: TRIPS (Scirtothrips citri)
# =============================================================================

class TripsModel(BasePestModel):
    """
    Modelo predictivo para Trips en cítricos
    Base científica: UC IPM, INIFAP Veracruz
    
    Ventana crítica: FEN-03 Floración (GDD 350-550)
    Mayor riesgo durante floración por atracción a flores
    """
    
    def __init__(self):
        super().__init__("Trips", "Scirtothrips citri")
        
        # Parámetros térmicos (UC IPM)
        self.T_base = 14.6  # °C (58.2°F)
        self.T_opt_min = 25.0
        self.T_opt_max = 30.0
        self.DD_generation = 180  # GDD por generación
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.30,
            'inercia': 0.25,      # β₁: persistencia poblacional
            'temp_opt': 0.50,     # β₂: condiciones óptimas
            'humedad': -0.30,     # β₃: HR alta reduce (lavado)
            'floracion': 2.00,    # β₄: pico en floración (gaussiano centrado GDD 450)
            'aplicacion': -3.5    # β₅: efecto tratamiento
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_03"
        self.GDD_critico = (350, 550)
        
        # Peso económico moderado-alto
        self.peso_economico = 0.18
    
    def predict(self, GDD: float, T: float, HR: float, 
                I_t1: float = 0.0, A_t1: float = 0.0) -> float:
        """
        Predecir índice de Trips
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor floración gaussiano centrado en GDD 450 (pico floración)
        F_flor = np.exp(-((GDD - 450) ** 2) / (2 * 100 ** 2)) * 2.0
        
        # Factor de temperatura óptima (rango 25-30°C)
        T_opt = 1.0 if self.T_opt_min <= T <= self.T_opt_max else 0.5
        
        # Factor sequedad (HR baja favorece)
        hr_factor = max(0, 1 - HR / 100)
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  F_flor * T_opt +
                  0.2 * hr_factor +
                  self.beta['aplicacion'] * A_t1)
        
        # Ajustar al rango [0, 3]
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 2: MINADOR DE HOJA (Phyllocnistis citrella)
# =============================================================================

class MinadorModel(BasePestModel):
    """
    Modelo predictivo para Minador de Hoja
    Base científica: FAO, Universidad de Florida IFAS
    
    Ventana crítica: FEN-02 Brotación (GDD 150-350)
    Mayor riesgo cuando hay brotes tiernos disponibles
    """
    
    def __init__(self):
        super().__init__("Minador de Hoja", "Phyllocnistis citrella")
        
        # Parámetros térmicos
        self.T_base = 11.5  # °C
        self.T_opt = 28.0  # °C óptimo
        self.DD_generation = 185  # GDD por generación
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.20,
            'inercia': 0.20,
            'temp': 0.30,
            'humedad': -0.10,
            'brotacion': 2.50,    # Factor gaussiano centrado GDD 250
            'aplicacion': -4.5
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_02"
        self.GDD_critico = (150, 350)
        
        # Peso económico moderado
        self.peso_economico = 0.15
    
    def predict(self, GDD: float, T: float, HR: float,
                I_t1: float = 0.0, A_t1: float = 0.0) -> float:
        """
        Predecir índice de Minador
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor brotación gaussiano centrado en GDD 250
        B_t = np.exp(-((GDD - 250) ** 2) / (2 * 100 ** 2)) * self.beta['brotacion']
        
        # Factor temperatura (gaussiano centrado en T_opt=28°C)
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 25))
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  B_t * f_T +
                  self.beta['aplicacion'] * A_t1)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 3: ARAÑA ROJA (Panonychus citri)
# =============================================================================

class AranaRojaModel(BasePestModel):
    """
    Modelo predictivo para Araña Roja
    Base científica: UC IPM, Turkish Journal of Agriculture
    
    Ventana crítica: FEN-05 Desarrollo (GDD 750-1300)
    Mayor riesgo en condiciones secas y calurosas
    """
    
    def __init__(self):
        super().__init__("Araña Roja", "Panonychus citri")
        
        # Parámetros térmicos (UC IPM)
        self.T_base = 7.9  # °C (46.2°F)
        self.T_opt = 24.0  # °C (75°F)
        self.DD_egg = 120  # GDD eclosión huevos
        self.DD_generation = 347  # GDD por generación
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.40,
            'inercia': 0.30,
            'temp': 0.25,
            'sequedad': 0.50,     # HR baja favorece
            'desarrollo': 1.50,   # Factor gaussiano GDD 1000
            'stress': 0.8,        # Estrés hídrico amplifica
            'aplicacion': -4.0
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_05"
        self.GDD_critico = (750, 1300)
        
        # Peso económico moderado
        self.peso_economico = 0.14
    
    def predict(self, GDD: float, T: float, HR: float,
                I_t1: float = 0.0, A_t1: float = 0.0,
                agua_stress: float = 0.0) -> float:
        """
        Predecir índice de Araña Roja
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            agua_stress: Indicador de estrés hídrico (0-1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor desarrollo gaussiano centrado en GDD 1000
        desarrollo = np.exp(-((GDD - 1000) ** 2) / (2 * 300 ** 2)) * self.beta['desarrollo']
        
        # Factor temperatura (gaussiano T_opt=24°C)
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 36))
        
        # Factor sequedad (HR baja favorece, umbral 80%)
        sequedad = max(0, (80 - HR) / 40)
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  desarrollo +
                  self.beta['sequedad'] * sequedad * f_T +
                  self.beta['stress'] * agua_stress +
                  self.beta['aplicacion'] * A_t1)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 4: PULGÓN (Toxoptera citricida / Aphis)
# =============================================================================

class PulgonModel(BasePestModel):
    """
    Modelo predictivo para Pulgón
    Base científica: USDA ARS, INIFAP
    
    Ventana crítica: FEN-02 Brotación (GDD 150-350)
    Ataca brotes tiernos, controlado por enemigos naturales
    """
    
    def __init__(self):
        super().__init__("Pulgón", "Toxoptera citricida")
        
        # Parámetros térmicos
        self.T_base = 6.0  # °C
        self.T_opt = 22.0  # °C
        self.T_max = 30.0  # °C (inhibición por calor)
        self.DD_generation = 100  # GDD por generación (rápido)
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.30,
            'inercia': 0.20,
            'temp': 0.30,
            'humedad': 0.10,
            'brotacion': 1.80,    # Factor gaussiano GDD 250
            'aplicacion': -3.5,
            'enemigos': -1.0      # Control biológico
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_02"
        self.GDD_critico = (150, 350)
        
        # Peso económico bajo-moderado
        self.peso_economico = 0.10
    
    def predict(self, GDD: float, T: float, HR: float,
                I_t1: float = 0.0, A_t1: float = 0.0,
                enemigos_nat: float = 0.0) -> float:
        """
        Predecir índice de Pulgón
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            enemigos_nat: Presencia de enemigos naturales (0-1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor brotación gaussiano centrado en GDD 250
        B_t = np.exp(-((GDD - 250) ** 2) / (2 * 100 ** 2)) * self.beta['brotacion']
        
        # Factor temperatura gaussiano (T_opt=22°C)
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 36))
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  B_t * f_T +
                  self.beta['aplicacion'] * A_t1 +
                  self.beta['enemigos'] * enemigos_nat)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 5: DIAPHORINA CITRI (Vector HLB)
# =============================================================================

class DiaphorinaModel(BasePestModel):
    """
    Modelo predictivo para Diaphorina citri
    Base científica: USDA, UF IFAS, PLOS Computational Biology
    
    CRÍTICO: Vector del HLB (Huanglongbing)
    Ventana crítica: FEN-02 Brotación (GDD 150-350)
    Peso económico máximo por riesgo HLB
    """
    
    def __init__(self):
        super().__init__("Diaphorina", "Diaphorina citri")
        
        # Parámetros térmicos
        self.T_base = 10.9  # °C
        self.T_opt = 28.0  # °C
        self.DD_generation = 250  # GDD por generación
        
        # Modelo SEI (Susceptible-Exposed-Infected)
        self.transmission_rate = 0.15  # β local
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.50,
            'inercia': 0.25,
            'temp': 0.35,
            'humedad': -0.10,
            'brotacion': 2.20,    # Factor gaussiano GDD 250
            'aplicacion': -5.0,
            'hlb': 0.30           # Amplificación regional
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_02"
        self.GDD_critico = (150, 350)
        
        # CRÍTICO: Peso económico máximo por HLB
        self.peso_economico = 0.25
    
    def predict(self, GDD: float, T: float, HR: float,
                I_t1: float = 0.0, A_t1: float = 0.0,
                hlb_regional: float = 0.0) -> float:
        """
        Predecir índice de Diaphorina
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            hlb_regional: Presión regional de HLB (0-1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor brotación gaussiano centrado en GDD 250
        B_t = np.exp(-((GDD - 250) ** 2) / (2 * 100 ** 2)) * self.beta['brotacion']
        
        # Factor temperatura gaussiano (T_opt=28°C)
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 25))
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  B_t * f_T +
                  self.beta['hlb'] * hlb_regional +
                  self.beta['aplicacion'] * A_t1)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 6: ANTRACNOSIS (Colletotrichum spp.)
# =============================================================================

class AntracnosisModel(BasePestModel):
    """
    Modelo predictivo para Antracnosis
    Base científica: APS, Plant Disease Journal
    
    Ventana crítica: FEN-03 Floración (GDD 350-550)
    Requiere alta humedad y mojadura foliar
    """
    
    def __init__(self):
        super().__init__("Antracnosis", "Colletotrichum spp.")
        
        # Parámetros ambientales
        self.T_min = 15.0  # °C
        self.T_opt = 25.0  # °C
        self.T_max = 32.0  # °C
        self.HR_min = 85.0  # % requerido para infección
        self.wetness_hours_req = 12  # Horas mojadura mínima
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.0,
            'inercia': 0.15,
            'temp': 0.30,
            'humedad': 1.50,      # Factor HR >80%
            'lluvia': 0.30,
            'floracion': 2.00,    # Factor gaussiano GDD 450
            'aplicacion': -3.0,
            'wetness': 0.05
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_03"
        self.GDD_critico = (350, 550)
        
        # Peso económico moderado (enfermedad)
        self.peso_economico = 0.12
    
    def predict(self, GDD: float, T: float, HR: float,
                lluvia: float = 0.0, I_t1: float = 0.0, 
                A_t1: float = 0.0, wetness_hrs: float = 0.0) -> float:
        """
        Predecir índice de Antracnosis
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            lluvia: Precipitación (mm)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            wetness_hrs: Horas de mojadura foliar
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor floración gaussiano centrado en GDD 450
        F_flor = np.exp(-((GDD - 450) ** 2) / (2 * 100 ** 2)) * self.beta['floracion']
        
        # Factor humedad (HR >80% requerida)
        f_HR = max(0, (HR - 80) / 20) if HR > 80 else 0.0
        
        # Factor lluvia
        lluvia_factor = min(1, lluvia / 10) * self.beta['lluvia']
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  F_flor * f_HR +
                  lluvia_factor +
                  self.beta['aplicacion'] * A_t1)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# MODELO 7: MANCHA GRASIENTA (Mycosphaerella citri)
# =============================================================================

class ManchaGrasientaModel(BasePestModel):
    """
    Modelo predictivo para Mancha Grasienta
    Base científica: UF IFAS, Citrus Industry Magazine
    
    Ventana crítica: FEN-05 Desarrollo (GDD 750-1300)
    Muy persistente, relacionada con hojarasca
    """
    
    def __init__(self):
        super().__init__("Mancha Grasienta", "Mycosphaerella citri")
        
        # Parámetros ambientales
        self.T_opt = 24.0  # °C
        self.HR_opt = 95.0  # % para liberación ascosporas
        self.leaf_litter_factor = 0.8  # Importancia hojarasca
        
        # Coeficientes calibrados (v2 - ajustados 05-Ene-2026)
        self.beta = {
            'intercepto': 0.50,
            'inercia': 0.40,
            'temp': 0.20,
            'humedad': 0.30,
            'lluvia': 0.50,       # Factor lluvia acumulada
            'desarrollo': 0.80,   # Factor lineal GDD
            'aplicacion': -2.5,
            'hojarasca': 0.80
        }
        
        # Ventana crítica
        self.ventana_critica = "FEN_05"
        self.GDD_critico = (750, 1300)
        
        # Peso económico bajo-moderado
        self.peso_economico = 0.08
    
    def predict(self, GDD: float, T: float, HR: float,
                lluvia_7d: float = 0.0, I_t1: float = 0.0, 
                A_t1: float = 0.0, hojarasca: float = 0.5) -> float:
        """
        Predecir índice de Mancha Grasienta
        
        Args:
            GDD: Grados-día acumulados desde biofix
            T: Temperatura actual (°C)
            HR: Humedad relativa (%)
            lluvia_7d: Precipitación acumulada 7 días (mm)
            I_t1: Índice de la semana anterior (0-3)
            A_t1: Aplicación semana anterior (0/1)
            hojarasca: Nivel de hojarasca en suelo (0-1)
            
        Returns:
            Índice predicho (0-3)
        """
        # Factor desarrollo lineal (enfermedad acumulativa)
        desarrollo = min(1, GDD / 1000) * self.beta['desarrollo']
        
        # Factor humedad
        hr_factor = (HR / 100) * self.beta['humedad']
        
        # Factor lluvia
        lluvia_factor = min(1, lluvia_7d / 20) * self.beta['lluvia']
        
        # Calcular índice predicho
        I_pred = (self.beta['intercepto'] + 
                  self.beta['inercia'] * I_t1 +
                  desarrollo +
                  hr_factor +
                  lluvia_factor +
                  self.beta['hojarasca'] * hojarasca +
                  self.beta['aplicacion'] * A_t1)
        
        return max(0.0, min(3.0, I_pred))


# =============================================================================
# PEST PREDICTION ENGINE (PPE) - MOTOR PRINCIPAL
# =============================================================================

class PestPredictionEngine:
    """
    Motor de predicción de plagas que integra los 7 modelos.
    Calcula IPF (Índice de Presión Fitosanitaria) combinado.
    """
    
    def __init__(self):
        # Inicializar los 7 modelos
        self.models = {
            'trips': TripsModel(),
            'minador': MinadorModel(),
            'arana_roja': AranaRojaModel(),
            'pulgon': PulgonModel(),
            'diaphorina': DiaphorinaModel(),
            'antracnosis': AntracnosisModel(),
            'mancha_grasienta': ManchaGrasientaModel()
        }
        
        self.biofix_config = BiofixConfig()
        logger.info("✅ PestPredictionEngine inicializado con 7 modelos")
    
    def predict_all(self, conditions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ejecutar predicción para todos los modelos
        
        Args:
            conditions: Diccionario con condiciones actuales
                - GDD: float
                - T: float (temperatura °C)
                - HR: float (humedad relativa %)
                - lluvia: float (mm)
                - previous_indices: Dict[str, float] (índices anteriores)
                - applications: Dict[str, float] (aplicaciones anteriores)
                - agua_stress: float (0-1)
                - enemigos_nat: float (0-1)
                - hlb_regional: float (0-1)
                - hojarasca: float (0-1)
                - wetness_hrs: float
                
        Returns:
            Dict con predicciones, alertas, y IPF
        """
        GDD = conditions.get('GDD', 500)
        T = conditions.get('T', 25.0)
        HR = conditions.get('HR', 70.0)
        lluvia = conditions.get('lluvia', 0.0)
        lluvia_7d = conditions.get('lluvia_7d', lluvia * 3)
        
        prev = conditions.get('previous_indices', {})
        apps = conditions.get('applications', {})
        
        predictions = {}
        alerts = {}
        
        # Trips
        predictions['trips'] = self.models['trips'].predict(
            GDD=GDD, T=T, HR=HR,
            I_t1=prev.get('trips', 0.0),
            A_t1=apps.get('trips', 0.0)
        )
        
        # Minador
        predictions['minador'] = self.models['minador'].predict(
            GDD=GDD, T=T, HR=HR,
            I_t1=prev.get('minador', 0.0),
            A_t1=apps.get('minador', 0.0)
        )
        
        # Araña Roja
        predictions['arana_roja'] = self.models['arana_roja'].predict(
            GDD=GDD, T=T, HR=HR,
            I_t1=prev.get('arana_roja', 0.0),
            A_t1=apps.get('arana_roja', 0.0),
            agua_stress=conditions.get('agua_stress', 0.0)
        )
        
        # Pulgón
        predictions['pulgon'] = self.models['pulgon'].predict(
            GDD=GDD, T=T, HR=HR,
            I_t1=prev.get('pulgon', 0.0),
            A_t1=apps.get('pulgon', 0.0),
            enemigos_nat=conditions.get('enemigos_nat', 0.0)
        )
        
        # Diaphorina (CRÍTICO)
        predictions['diaphorina'] = self.models['diaphorina'].predict(
            GDD=GDD, T=T, HR=HR,
            I_t1=prev.get('diaphorina', 0.0),
            A_t1=apps.get('diaphorina', 0.0),
            hlb_regional=conditions.get('hlb_regional', 0.1)
        )
        
        # Antracnosis
        predictions['antracnosis'] = self.models['antracnosis'].predict(
            GDD=GDD, T=T, HR=HR,
            lluvia=lluvia,
            I_t1=prev.get('antracnosis', 0.0),
            A_t1=apps.get('antracnosis', 0.0),
            wetness_hrs=conditions.get('wetness_hrs', 0.0)
        )
        
        # Mancha Grasienta
        predictions['mancha_grasienta'] = self.models['mancha_grasienta'].predict(
            GDD=GDD, T=T, HR=HR,
            lluvia_7d=lluvia_7d,
            I_t1=prev.get('mancha_grasienta', 0.0),
            A_t1=apps.get('mancha_grasienta', 0.0),
            hojarasca=conditions.get('hojarasca', 0.5)
        )
        
        # Generar alertas
        for pest_name, index in predictions.items():
            model = self.models[pest_name]
            alerts[pest_name] = {
                'level': model.get_alert_level(index).value,
                'in_critical_window': model.is_in_critical_window(GDD),
                'index': round(index, 3)
            }
        
        # Calcular IPF combinado (weighted average)
        ipf = self.calculate_ipf(predictions)
        
        # Determinar fase fenológica actual
        phase = self.models['trips'].get_phenological_phase(GDD)
        
        return {
            'predictions': predictions,
            'alerts': alerts,
            'ipf': ipf,
            'ipf_score': 1 - ipf,  # IPF Score (1 = sin presión, 0 = máxima presión)
            'phase': phase.value,
            'gdd': GDD,
            'conditions': {
                'T': T,
                'HR': HR,
                'lluvia': lluvia
            }
        }
    
    def calculate_ipf(self, predictions: Dict[str, float]) -> float:
        """
        Calcular IPF (Índice de Presión Fitosanitaria) combinado
        
        IPF = Σ (peso_k × índice_k / 3) para k plagas
        
        Returns:
            IPF normalizado (0-1)
        """
        total_weight = 0
        weighted_sum = 0
        
        for pest_name, index in predictions.items():
            weight = self.models[pest_name].peso_economico
            weighted_sum += weight * (index / 3.0)  # Normalizar a 0-1
            total_weight += weight
        
        if total_weight > 0:
            return weighted_sum / total_weight
        return 0.0
    
    def get_recommendations(self, predictions: Dict[str, float], GDD: float) -> List[Dict[str, Any]]:
        """
        Generar recomendaciones basadas en predicciones
        
        Returns:
            Lista de recomendaciones ordenadas por prioridad
        """
        recommendations = []
        
        for pest_name, index in predictions.items():
            model = self.models[pest_name]
            alert = model.get_alert_level(index)
            in_critical = model.is_in_critical_window(GDD)
            
            if alert in [AlertLevel.NARANJA, AlertLevel.ROJO]:
                priority = "ALTA" if alert == AlertLevel.ROJO else "MEDIA"
                urgency = "URGENTE" if in_critical else "Programable"
                
                recommendations.append({
                    'pest': model.name,
                    'scientific_name': model.scientific_name,
                    'index': round(index, 2),
                    'alert_level': alert.value,
                    'priority': priority,
                    'urgency': urgency,
                    'in_critical_window': in_critical,
                    'ventana_critica': model.ventana_critica,
                    'peso_economico': model.peso_economico
                })
        
        # Ordenar por prioridad (ALTA primero) y peso económico
        recommendations.sort(
            key=lambda x: (0 if x['priority'] == 'ALTA' else 1, -x['peso_economico'])
        )
        
        return recommendations
    
    def get_model_summary(self) -> pd.DataFrame:
        """Obtener resumen de todos los modelos"""
        data = []
        for name, model in self.models.items():
            info = model.get_model_info()
            data.append({
                'Modelo': info['name'],
                'Nombre Científico': info['scientific_name'],
                'T_base (°C)': info['T_base'],
                'T_opt (°C)': info['T_opt'],
                'DD/Gen': info['DD_generation'],
                'Ventana Crítica': info['ventana_critica'],
                'GDD Crítico': f"{info['GDD_critico'][0]}-{info['GDD_critico'][1]}",
                'Peso Económico': info['peso_economico']
            })
        
        return pd.DataFrame(data)


# =============================================================================
# FUNCIONES DE UTILIDAD
# =============================================================================

def calculate_gdd(T_max: float, T_min: float, T_base: float = 11.5) -> float:
    """
    Calcular Grados-Día de Crecimiento (GDD)
    
    GDD = max(0, (T_max + T_min)/2 - T_base)
    """
    T_avg = (T_max + T_min) / 2
    return max(0, T_avg - T_base)


def calculate_accumulated_gdd(biofix_date: str, current_date: str, 
                               gdd_daily: float = 15.78) -> float:
    """
    Calcular GDD acumulados desde BioFix
    
    Args:
        biofix_date: Fecha de BioFix (YYYY-MM-DD)
        current_date: Fecha actual (YYYY-MM-DD)
        gdd_daily: GDD promedio diario
        
    Returns:
        GDD acumulados
    """
    biofix = datetime.strptime(biofix_date, "%Y-%m-%d")
    current = datetime.strptime(current_date, "%Y-%m-%d")
    days = (current - biofix).days
    return max(0, days * gdd_daily)


# =============================================================================
# EJEMPLO DE USO
# =============================================================================

if __name__ == "__main__":
    # Crear motor de predicción
    engine = PestPredictionEngine()
    
    # Mostrar resumen de modelos
    print("\n📊 RESUMEN DE MODELOS PREDICTIVOS")
    print("=" * 80)
    print(engine.get_model_summary().to_string(index=False))
    
    # Ejemplo de predicción
    print("\n🔮 EJEMPLO DE PREDICCIÓN")
    print("=" * 80)
    
    # Condiciones de ejemplo (S1 actual: GDD ~1294, FEN-05)
    conditions = {
        'GDD': 1294,  # S1 actual
        'T': 26.5,
        'HR': 75.0,
        'lluvia': 5.0,
        'lluvia_7d': 25.0,
        'previous_indices': {
            'trips': 0.8,
            'minador': 0.3,
            'arana_roja': 1.2,
            'pulgon': 0.4,
            'diaphorina': 0.6,
            'antracnosis': 0.5,
            'mancha_grasienta': 0.9
        },
        'applications': {},
        'agua_stress': 0.2,
        'enemigos_nat': 0.3,
        'hlb_regional': 0.15,
        'hojarasca': 0.6,
        'wetness_hrs': 4.0
    }
    
    # Ejecutar predicción
    result = engine.predict_all(conditions)
    
    print(f"\nFase Fenológica: {result['phase']}")
    print(f"GDD Acumulados: {result['gdd']}")
    print(f"\nIPF (Presión): {result['ipf']:.3f}")
    print(f"IPF Score: {result['ipf_score']:.1%}")
    
    print("\n📈 PREDICCIONES POR PLAGA:")
    for pest, data in result['alerts'].items():
        print(f"  {pest}: {data['index']:.2f} - {data['level']}")
    
    # Recomendaciones
    recs = engine.get_recommendations(result['predictions'], result['gdd'])
    if recs:
        print("\n⚠️ RECOMENDACIONES DE TRATAMIENTO:")
        for rec in recs:
            print(f"  [{rec['priority']}] {rec['pest']}: Índice {rec['index']} - {rec['urgency']}")
    else:
        print("\n✅ No se requieren tratamientos urgentes")
