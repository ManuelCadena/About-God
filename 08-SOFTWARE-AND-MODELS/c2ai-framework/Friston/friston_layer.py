#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
FRISTON LAYER - Free Energy Minimization for Active Inference
═══════════════════════════════════════════════════════════════════════════════
Part of Conscious Citrus AI (C²AI) Framework
Author: Dr. José Manuel Cadena
Date: January 2026

This module implements Karl Friston's Free Energy Principle for plant cognition:
- Plants maintain internal generative models p(environment)
- They observe q(sensors) and compare against expectations
- Actions are taken to minimize surprise (KL divergence)

Reference: Friston, K. (2010). "The Free-Energy Principle: A Unified Brain Theory?"
═══════════════════════════════════════════════════════════════════════════════
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime, timedelta
import json
import logging
import asyncio
from enum import Enum

# Database
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FristonLayer")


class ActionType(str, Enum):
    """Types of actions that can be recommended"""
    IRRIGATE = "irrigate"
    REDUCE_IRRIGATION = "reduce_irrigation"
    FERTILIZE = "fertilize"
    REDUCE_FERTILIZATION = "reduce_fertilization"
    INCREASE_LIGHT = "increase_light"
    REDUCE_SHADE = "reduce_shade"
    INCREASE_ET = "increase_et"
    APPLY_IPM = "apply_ipm"
    HARVEST = "harvest"
    PRUNE = "prune"
    WAIT = "wait"


@dataclass
class PlantModel:
    """
    Internal generative model of the plant's environmental expectations.
    These are the plant's "beliefs" about what conditions should be.
    
    Based on optimal conditions for Citrus latifolia (Persian lime).
    """
    # Water expectations (soil moisture %)
    water_mean: float = 0.45  # 45% soil moisture
    water_std: float = 0.08
    
    # Light expectations (PAR μmol/m²/s)
    light_mean: float = 1300.0
    light_std: float = 200.0
    
    # Temperature expectations (°C)
    temp_mean: float = 28.0
    temp_std: float = 3.0
    temp_min: float = 15.0  # Below this: cold stress
    temp_max: float = 38.0  # Above this: heat stress
    
    # Nutrient expectations (ppm)
    n_mean: float = 150.0
    n_std: float = 30.0
    p_mean: float = 40.0
    p_std: float = 10.0
    k_mean: float = 180.0
    k_std: float = 35.0
    
    # Humidity expectations (%)
    humidity_mean: float = 65.0
    humidity_std: float = 10.0
    
    # VPD expectations (kPa)
    vpd_mean: float = 1.2
    vpd_std: float = 0.3
    
    # Phenology-specific adjustments
    phenology_adjustments: Dict[str, Dict[str, float]] = field(default_factory=lambda: {
        'FEN-01': {'water_mean': 0.40, 'n_mean': 120},  # Dormancy
        'FEN-02': {'water_mean': 0.42, 'n_mean': 140},  # Bud break
        'FEN-03': {'water_mean': 0.50, 'n_mean': 180, 'k_mean': 200},  # Flowering
        'FEN-04': {'water_mean': 0.48, 'n_mean': 160},  # Fruit set
        'FEN-05': {'water_mean': 0.45, 'k_mean': 220},  # Fruit development
        'FEN-06': {'water_mean': 0.42},  # Maturation
        'FEN-07': {'water_mean': 0.40},  # Harvest ready
    })
    
    def get_adjusted_model(self, phenology_stage: str) -> 'PlantModel':
        """Get model adjusted for current phenology stage"""
        if phenology_stage not in self.phenology_adjustments:
            return self
        
        adjusted = PlantModel(
            water_mean=self.water_mean,
            water_std=self.water_std,
            light_mean=self.light_mean,
            light_std=self.light_std,
            temp_mean=self.temp_mean,
            temp_std=self.temp_std,
            n_mean=self.n_mean,
            n_std=self.n_std,
            p_mean=self.p_mean,
            p_std=self.p_std,
            k_mean=self.k_mean,
            k_std=self.k_std,
            humidity_mean=self.humidity_mean,
            humidity_std=self.humidity_std,
            vpd_mean=self.vpd_mean,
            vpd_std=self.vpd_std,
        )
        
        adjustments = self.phenology_adjustments[phenology_stage]
        for key, value in adjustments.items():
            if hasattr(adjusted, key):
                setattr(adjusted, key, value)
        
        return adjusted


@dataclass
class Observation:
    """Current sensory observations from the environment"""
    soil_moisture_pct: Optional[float] = None
    par_umol: Optional[float] = None
    temp_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    n_ppm: Optional[float] = None
    p_ppm: Optional[float] = None
    k_ppm: Optional[float] = None
    vpd_kpa: Optional[float] = None
    rain_mm_24h: Optional[float] = None
    et0_mm: Optional[float] = None
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Observation':
        """Create observation from dictionary"""
        return cls(
            soil_moisture_pct=data.get('soil_moisture_pct') or data.get('humidity_pct'),
            par_umol=data.get('par_umol') or data.get('solar_rad_wm2', 0) * 2.0,
            temp_c=data.get('temp_c') or data.get('temp_out_c'),
            humidity_pct=data.get('humidity_pct') or data.get('hum_out_pct'),
            n_ppm=data.get('n_ppm'),
            p_ppm=data.get('p_ppm'),
            k_ppm=data.get('k_ppm'),
            vpd_kpa=data.get('vpd_kpa'),
            rain_mm_24h=data.get('rain_mm_24h') or data.get('rain_day_mm'),
            et0_mm=data.get('et0_mm') or data.get('et_day_mm'),
        )


@dataclass
class FreeEnergyResult:
    """Result of free energy calculation"""
    total_free_energy: float
    kl_divergence: float
    surprise_by_variable: Dict[str, float]
    prediction_vector: Dict[str, float]
    observation_vector: Dict[str, float]
    recommended_actions: List[Dict[str, Any]]
    urgency: float
    timestamp: datetime = field(default_factory=datetime.now)


class FristonLayer:
    """
    Free Energy Minimization Layer for Active Inference
    
    Implements Friston's Free Energy Principle:
    F = KL[q(s) || p(s|o)] = ∫ q(s) log[q(s)/p(s|o)] ds
    
    Simplified for agricultural application:
    F = Σ [(obs - pred)² / (2σ²)] + log(σ)
    """
    
    def __init__(self, pg_config: Dict[str, str]):
        """
        Initialize Friston Layer with database connection
        
        Args:
            pg_config: PostgreSQL connection parameters
                - host: Database host
                - database: Database name
                - user: Username
                - password: Password
        """
        self.pg_config = pg_config
        self.plant_model = PlantModel()
        self.conn = None
        self._connect_db()
        
        logger.info("FristonLayer initialized")
    
    def _connect_db(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(
                host=self.pg_config.get('host', 'localhost'),
                database=self.pg_config.get('database', 'citrusmax_biofix'),
                user=self.pg_config.get('user', 'postgres'),
                password=self.pg_config.get('password', ''),
                cursor_factory=RealDictCursor
            )
            logger.info(f"Connected to PostgreSQL: {self.pg_config.get('host')}")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def _ensure_connection(self):
        """Ensure database connection is alive"""
        if self.conn is None or self.conn.closed:
            self._connect_db()
    
    def calculate_free_energy(
        self, 
        observations: Observation,
        phenology_stage: str = 'FEN-04'
    ) -> FreeEnergyResult:
        """
        Calculate free energy F for given observations
        
        F = Σ [(obs - μ_pred)² / (2σ²)] + constant
        
        Lower F = plant's predictions match reality
        Higher F = surprise, need for action
        
        Args:
            observations: Current sensory observations
            phenology_stage: Current phenology stage (adjusts expectations)
            
        Returns:
            FreeEnergyResult with F value and recommended actions
        """
        # Get phenology-adjusted model
        model = self.plant_model.get_adjusted_model(phenology_stage)
        
        F = 0.0
        kl_total = 0.0
        surprise_by_var = {}
        prediction_vector = {}
        observation_vector = {}
        
        # Calculate surprise for each variable
        variable_configs = [
            ('water', observations.soil_moisture_pct, model.water_mean, model.water_std, 100),
            ('light', observations.par_umol, model.light_mean, model.light_std, 1),
            ('temp', observations.temp_c, model.temp_mean, model.temp_std, 1),
            ('humidity', observations.humidity_pct, model.humidity_mean, model.humidity_std, 1),
            ('nitrogen', observations.n_ppm, model.n_mean, model.n_std, 1),
            ('phosphorus', observations.p_ppm, model.p_mean, model.p_std, 1),
            ('potassium', observations.k_ppm, model.k_mean, model.k_std, 1),
        ]
        
        for var_name, obs_value, pred_mean, pred_std, scale in variable_configs:
            if obs_value is not None:
                # Scale observation if needed (e.g., % to decimal)
                scaled_obs = obs_value / scale if scale > 1 else obs_value
                scaled_pred = pred_mean / scale if scale > 1 else pred_mean
                scaled_std = pred_std / scale if scale > 1 else pred_std
                
                # KL term: (obs - pred)² / (2σ²)
                kl_term = ((scaled_obs - scaled_pred) ** 2) / (2 * scaled_std ** 2)
                
                # Entropy term: log(σ)
                entropy_term = np.log(scaled_std + 1e-6)
                
                # Total free energy contribution
                var_F = kl_term + entropy_term
                
                F += var_F
                kl_total += kl_term
                surprise_by_var[var_name] = float(kl_term)
                prediction_vector[var_name] = float(pred_mean)
                observation_vector[var_name] = float(obs_value)
        
        # Generate recommended actions based on surprise
        actions = self._recommend_actions(observations, model, surprise_by_var)
        
        # Calculate overall urgency (0-10 scale)
        urgency = min(10.0, F * 2.0)  # Scale F to urgency
        
        return FreeEnergyResult(
            total_free_energy=float(F),
            kl_divergence=float(kl_total),
            surprise_by_variable=surprise_by_var,
            prediction_vector=prediction_vector,
            observation_vector=observation_vector,
            recommended_actions=actions,
            urgency=float(urgency)
        )
    
    def _recommend_actions(
        self,
        observations: Observation,
        model: PlantModel,
        surprise: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """
        Generate action recommendations to minimize free energy
        
        Active inference: take actions to make predictions come true
        
        Args:
            observations: Current observations
            model: Plant's expectation model
            surprise: Surprise values by variable
            
        Returns:
            List of recommended actions with urgency
        """
        actions = []
        SURPRISE_THRESHOLD = 0.5  # z-score threshold for action
        
        # Water/Irrigation
        if observations.soil_moisture_pct is not None:
            obs = observations.soil_moisture_pct / 100
            pred = model.water_mean
            z_score = abs(obs - pred) / model.water_std
            
            if z_score > SURPRISE_THRESHOLD:
                if obs < pred:
                    # Less water than expected - irrigate
                    deficit_mm = (pred - obs) * 1000  # Convert to mm equivalent
                    actions.append({
                        'type': ActionType.IRRIGATE.value,
                        'amount_mm': round(max(10, min(50, deficit_mm)), 1),
                        'urgency': round(min(10, z_score * 3), 1),
                        'reason': f'Soil moisture {observations.soil_moisture_pct:.1f}% below expected {model.water_mean*100:.1f}%',
                        'expected_F_reduction': round(surprise.get('water', 0) * 0.8, 3)
                    })
                else:
                    # More water than expected - reduce irrigation
                    actions.append({
                        'type': ActionType.REDUCE_IRRIGATION.value,
                        'reduction_pct': round(min(50, (obs - pred) * 100), 1),
                        'urgency': round(min(10, z_score * 2), 1),
                        'reason': f'Soil moisture {observations.soil_moisture_pct:.1f}% above expected {model.water_mean*100:.1f}%',
                        'expected_F_reduction': round(surprise.get('water', 0) * 0.6, 3)
                    })
        
        # Light
        if observations.par_umol is not None:
            obs = observations.par_umol
            pred = model.light_mean
            z_score = abs(obs - pred) / model.light_std
            
            if z_score > SURPRISE_THRESHOLD and obs < pred:
                actions.append({
                    'type': ActionType.REDUCE_SHADE.value,
                    'target_par': round(pred, 0),
                    'urgency': round(min(10, z_score * 2), 1),
                    'reason': f'PAR {obs:.0f} μmol below expected {pred:.0f} μmol',
                    'expected_F_reduction': round(surprise.get('light', 0) * 0.5, 3)
                })
        
        # Temperature (limited control, but can adjust irrigation/shade)
        if observations.temp_c is not None:
            if observations.temp_c > model.temp_max:
                actions.append({
                    'type': ActionType.INCREASE_ET.value,
                    'method': 'cooling_irrigation',
                    'urgency': round(min(10, (observations.temp_c - model.temp_max) * 2), 1),
                    'reason': f'Temperature {observations.temp_c:.1f}°C exceeds stress threshold {model.temp_max}°C',
                    'expected_F_reduction': round(surprise.get('temp', 0) * 0.3, 3)
                })
        
        # Nitrogen
        if observations.n_ppm is not None:
            obs = observations.n_ppm
            pred = model.n_mean
            z_score = abs(obs - pred) / model.n_std
            
            if z_score > SURPRISE_THRESHOLD and obs < pred:
                deficit_kg = (pred - obs) * 0.1  # Rough conversion
                actions.append({
                    'type': ActionType.FERTILIZE.value,
                    'nutrient': 'N',
                    'amount_kg_ha': round(max(5, min(30, deficit_kg)), 1),
                    'urgency': round(min(10, z_score * 2.5), 1),
                    'reason': f'Nitrogen {obs:.0f} ppm below expected {pred:.0f} ppm',
                    'expected_F_reduction': round(surprise.get('nitrogen', 0) * 0.7, 3)
                })
        
        # Potassium
        if observations.k_ppm is not None:
            obs = observations.k_ppm
            pred = model.k_mean
            z_score = abs(obs - pred) / model.k_std
            
            if z_score > SURPRISE_THRESHOLD and obs < pred:
                actions.append({
                    'type': ActionType.FERTILIZE.value,
                    'nutrient': 'K',
                    'amount_kg_ha': round(max(5, min(40, (pred - obs) * 0.15)), 1),
                    'urgency': round(min(10, z_score * 2), 1),
                    'reason': f'Potassium {obs:.0f} ppm below expected {pred:.0f} ppm',
                    'expected_F_reduction': round(surprise.get('potassium', 0) * 0.7, 3)
                })
        
        # Sort by urgency (highest first)
        actions.sort(key=lambda x: x.get('urgency', 0), reverse=True)
        
        # If no actions needed, recommend waiting
        if not actions:
            actions.append({
                'type': ActionType.WAIT.value,
                'urgency': 0,
                'reason': 'All observations within expected ranges - system in homeostasis',
                'expected_F_reduction': 0
            })
        
        return actions
    
    async def calculate_for_section(self, section: str) -> Dict:
        """
        Calculate free energy for all trees in a section
        
        Args:
            section: Section ID (S1, S2, S3)
            
        Returns:
            Aggregated free energy result for section
        """
        self._ensure_connection()
        
        # Get latest weather data
        weather = await self._get_latest_weather(section)
        
        # Get latest soil/nutrient data
        soil_data = await self._get_latest_soil_data(section)
        
        # Get current phenology
        phenology = await self._get_current_phenology(section)
        
        # Combine into observations
        obs_data = {**weather, **soil_data}
        observations = Observation.from_dict(obs_data)
        
        # Calculate free energy
        result = self.calculate_free_energy(observations, phenology)
        
        # Log to database
        await self._log_to_db(section, result)
        
        return {
            'section': section,
            'timestamp': result.timestamp.isoformat(),
            'free_energy': result.total_free_energy,
            'kl_divergence': result.kl_divergence,
            'surprise_by_variable': result.surprise_by_variable,
            'recommended_actions': result.recommended_actions,
            'urgency': result.urgency,
            'phenology_stage': phenology
        }
    
    async def _get_latest_weather(self, section: str) -> Dict:
        """Get latest weather data from Davis WeatherLink"""
        self._ensure_connection()
        
        query = """
            SELECT 
                temp_out_c,
                hum_out_pct,
                solar_rad_wm2,
                rain_day_mm,
                et_day_mm,
                wind_speed_kmh
            FROM weather.davis_weatherlink_complete
            ORDER BY timestamp DESC
            LIMIT 1
        """
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(query)
                row = cur.fetchone()
                return dict(row) if row else {}
        except Exception as e:
            logger.error(f"Error fetching weather: {e}")
            return {}
    
    async def _get_latest_soil_data(self, section: str) -> Dict:
        """Get latest soil/nutrient data"""
        self._ensure_connection()
        
        # Try to get from agronomy schema
        query = """
            SELECT 
                n_pct * 10000 as n_ppm,
                p_pct * 10000 as p_ppm,
                k_pct * 10000 as k_ppm
            FROM agronomy.nutricion_hoja
            WHERE seccion = %s
            ORDER BY fecha_muestreo DESC
            LIMIT 1
        """
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                return dict(row) if row else {}
        except Exception as e:
            logger.warning(f"Error fetching soil data: {e}")
            return {}
    
    async def _get_current_phenology(self, section: str) -> str:
        """Get current phenology stage"""
        self._ensure_connection()
        
        query = """
            SELECT estado_fenologico
            FROM agronomy.fenologia_actual
            WHERE seccion = %s
            ORDER BY fecha_actualizacion DESC
            LIMIT 1
        """
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (section,))
                row = cur.fetchone()
                return row['estado_fenologico'] if row else 'FEN-04'
        except Exception as e:
            logger.warning(f"Error fetching phenology: {e}, using default FEN-04")
            return 'FEN-04'
    
    async def _log_to_db(self, section: str, result: FreeEnergyResult):
        """Log free energy calculation to database"""
        self._ensure_connection()
        
        query = """
            INSERT INTO c2ai.free_energy_logs (
                section,
                timestamp,
                free_energy_value,
                kl_divergence,
                prediction_vector,
                observation_vector,
                surprise_vector,
                action_recommended,
                action_urgency
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, (
                    section,
                    result.timestamp,
                    result.total_free_energy,
                    result.kl_divergence,
                    json.dumps(result.prediction_vector),
                    json.dumps(result.observation_vector),
                    json.dumps(result.surprise_by_variable),
                    json.dumps(result.recommended_actions),
                    result.urgency
                ))
            self.conn.commit()
            logger.info(f"Logged free energy for section {section}: F={result.total_free_energy:.3f}")
        except Exception as e:
            logger.error(f"Error logging to database: {e}")
            self.conn.rollback()
    
    async def get_history(
        self, 
        section: Optional[str] = None, 
        days: int = 7
    ) -> List[Dict]:
        """Get historical free energy calculations"""
        self._ensure_connection()
        
        query = """
            SELECT 
                section,
                timestamp,
                free_energy_value,
                kl_divergence,
                action_urgency,
                action_recommended
            FROM c2ai.free_energy_logs
            WHERE timestamp > NOW() - INTERVAL '%s days'
        """
        
        params = [days]
        
        if section:
            query += " AND section = %s"
            params.append(section)
        
        query += " ORDER BY timestamp DESC"
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, params)
                rows = cur.fetchall()
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Error fetching history: {e}")
            return []
    
    def close(self):
        """Close database connection"""
        if self.conn and not self.conn.closed:
            self.conn.close()
            logger.info("Database connection closed")


# ═══════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    # Configuration
    pg_config = {
        'host': os.getenv('PG_HOST', '44.247.163.1'),
        'database': os.getenv('PG_DATABASE', 'citrusmax_biofix'),
        'user': os.getenv('PG_USER', 'postgres'),
        'password': os.getenv('PG_PASSWORD', '')
    }
    
    # Initialize layer
    friston = FristonLayer(pg_config)
    
    # Test with sample observations
    test_obs = Observation(
        soil_moisture_pct=38.0,  # Below expected (45%)
        par_umol=1100.0,         # Below expected (1300)
        temp_c=32.0,             # Within range
        humidity_pct=55.0,       # Below expected (65%)
        n_ppm=120.0,             # Below expected (150)
        k_ppm=160.0              # Below expected (180)
    )
    
    result = friston.calculate_free_energy(test_obs, phenology_stage='FEN-04')
    
    print("\n" + "="*60)
    print("FRISTON LAYER TEST RESULTS")
    print("="*60)
    print(f"\nTotal Free Energy (F): {result.total_free_energy:.4f}")
    print(f"KL Divergence: {result.kl_divergence:.4f}")
    print(f"Overall Urgency: {result.urgency:.1f}/10")
    
    print("\nSurprise by Variable:")
    for var, surprise in sorted(result.surprise_by_variable.items(), key=lambda x: -x[1]):
        print(f"  {var}: {surprise:.4f}")
    
    print("\nRecommended Actions:")
    for i, action in enumerate(result.recommended_actions, 1):
        print(f"  {i}. [{action['type']}] Urgency: {action.get('urgency', 0)}/10")
        print(f"     Reason: {action.get('reason', 'N/A')}")
        print(f"     Expected F reduction: {action.get('expected_F_reduction', 0):.3f}")
    
    print("\n" + "="*60)
    
    friston.close()
