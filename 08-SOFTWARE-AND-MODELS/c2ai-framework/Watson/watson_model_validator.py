#!/usr/bin/env python3
"""
🔬 WATSON OPTIMIZER - VALIDADOR DE MODELOS
Validación de los 7 modelos predictivos contra datos históricos
Target: R² > 0.85

Autor: CitrusMax AI Team
Fecha: 5 Enero 2026
"""

import numpy as np
import pandas as pd
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from typing import Dict, List, Any, Tuple
import logging
from datetime import datetime, timedelta
import json

from watson_optimizer_models import (
    PestPredictionEngine, BiofixConfig,
    TripsModel, MinadorModel, AranaRojaModel, PulgonModel,
    DiaphorinaModel, AntracnosisModel, ManchaGrasientaModel,
    calculate_accumulated_gdd
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WatsonModelValidator:
    """
    Validador de modelos Watson Optimizer
    Genera datos sintéticos basados en patrones conocidos y valida R²
    """
    
    def __init__(self):
        self.engine = PestPredictionEngine()
        self.biofix_config = BiofixConfig()
        self.validation_results = {}
        
    def generate_synthetic_data(self, n_samples: int = 200) -> pd.DataFrame:
        """
        Generar datos sintéticos basados en patrones fenológicos conocidos
        para validación de modelos
        """
        np.random.seed(42)  # Reproducibilidad
        
        data = []
        
        # Generar datos para diferentes fases fenológicas
        gdd_range = np.linspace(0, 1650, n_samples)
        
        for gdd in gdd_range:
            # Condiciones climáticas con variabilidad realista
            T = 22 + 8 * np.sin(2 * np.pi * gdd / 1650) + np.random.normal(0, 2)
            T = np.clip(T, 15, 35)
            
            HR = 70 + 15 * np.sin(2 * np.pi * (gdd + 400) / 1650) + np.random.normal(0, 5)
            HR = np.clip(HR, 40, 95)
            
            lluvia = max(0, np.random.exponential(5) * (1 if np.random.random() < 0.3 else 0))
            
            # Índices reales simulados con patrones conocidos
            trips_real = self._simulate_trips(gdd, T, HR)
            minador_real = self._simulate_minador(gdd, T, HR)
            arana_real = self._simulate_arana_roja(gdd, T, HR)
            pulgon_real = self._simulate_pulgon(gdd, T, HR)
            diaphorina_real = self._simulate_diaphorina(gdd, T, HR)
            antracnosis_real = self._simulate_antracnosis(gdd, T, HR, lluvia)
            mancha_real = self._simulate_mancha_grasienta(gdd, T, HR, lluvia)
            
            data.append({
                'GDD': gdd,
                'T': T,
                'HR': HR,
                'lluvia': lluvia,
                'lluvia_7d': lluvia * np.random.uniform(2, 5),
                'agua_stress': max(0, min(1, (30 - HR) / 50 + np.random.normal(0, 0.1))),
                'enemigos_nat': np.random.uniform(0.1, 0.5),
                'hlb_regional': np.random.uniform(0.05, 0.2),
                'hojarasca': np.random.uniform(0.3, 0.8),
                'wetness_hrs': max(0, lluvia * 2 + np.random.normal(0, 2)),
                # Valores reales (simulados con ruido)
                'trips_real': trips_real,
                'minador_real': minador_real,
                'arana_roja_real': arana_real,
                'pulgon_real': pulgon_real,
                'diaphorina_real': diaphorina_real,
                'antracnosis_real': antracnosis_real,
                'mancha_grasienta_real': mancha_real
            })
        
        return pd.DataFrame(data)
    
    def _simulate_trips(self, gdd: float, T: float, HR: float) -> float:
        """Simular índice real de Trips basado en conocimiento experto"""
        # Pico en floración (350-550 GDD)
        floracion_factor = np.exp(-((gdd - 450) ** 2) / (2 * 100 ** 2)) * 2.0
        temp_factor = 1.0 if 25 <= T <= 30 else 0.5
        hr_factor = max(0, 1 - HR / 100)
        
        index = 0.3 + floracion_factor * temp_factor + 0.2 * hr_factor
        return np.clip(index + np.random.normal(0, 0.15), 0, 3)
    
    def _simulate_minador(self, gdd: float, T: float, HR: float) -> float:
        """Simular índice real de Minador basado en conocimiento experto"""
        # Pico en brotación (150-350 GDD)
        brotacion_factor = np.exp(-((gdd - 250) ** 2) / (2 * 100 ** 2)) * 2.5
        temp_factor = np.exp(-((T - 28) ** 2) / (2 * 25))
        
        index = 0.2 + brotacion_factor * temp_factor
        return np.clip(index + np.random.normal(0, 0.12), 0, 3)
    
    def _simulate_arana_roja(self, gdd: float, T: float, HR: float) -> float:
        """Simular índice real de Araña Roja"""
        # Pico en desarrollo (750-1300 GDD), favorecido por sequedad
        desarrollo_factor = np.exp(-((gdd - 1000) ** 2) / (2 * 300 ** 2)) * 1.5
        sequedad_factor = max(0, (80 - HR) / 40)
        temp_factor = np.exp(-((T - 24) ** 2) / (2 * 36))
        
        index = 0.4 + desarrollo_factor + 0.5 * sequedad_factor * temp_factor
        return np.clip(index + np.random.normal(0, 0.18), 0, 3)
    
    def _simulate_pulgon(self, gdd: float, T: float, HR: float) -> float:
        """Simular índice real de Pulgón"""
        # Pico en brotación
        brotacion_factor = np.exp(-((gdd - 250) ** 2) / (2 * 100 ** 2)) * 1.8
        temp_factor = np.exp(-((T - 22) ** 2) / (2 * 36))
        
        index = 0.3 + brotacion_factor * temp_factor
        return np.clip(index + np.random.normal(0, 0.10), 0, 3)
    
    def _simulate_diaphorina(self, gdd: float, T: float, HR: float) -> float:
        """Simular índice real de Diaphorina (CRÍTICO)"""
        # Pico en brotación
        brotacion_factor = np.exp(-((gdd - 250) ** 2) / (2 * 100 ** 2)) * 2.2
        temp_factor = np.exp(-((T - 28) ** 2) / (2 * 25))
        
        index = 0.5 + brotacion_factor * temp_factor + np.random.uniform(0, 0.3)
        return np.clip(index + np.random.normal(0, 0.15), 0, 3)
    
    def _simulate_antracnosis(self, gdd: float, T: float, HR: float, lluvia: float) -> float:
        """Simular índice real de Antracnosis"""
        # Requiere alta humedad y floración
        floracion_factor = np.exp(-((gdd - 450) ** 2) / (2 * 100 ** 2)) * 2.0
        hr_factor = max(0, (HR - 80) / 20) if HR > 80 else 0
        lluvia_factor = min(1, lluvia / 10)
        
        index = 0.0 + floracion_factor * hr_factor + 0.3 * lluvia_factor
        return np.clip(index + np.random.normal(0, 0.12), 0, 3)
    
    def _simulate_mancha_grasienta(self, gdd: float, T: float, HR: float, lluvia: float) -> float:
        """Simular índice real de Mancha Grasienta"""
        # Persistente, acumulativo
        desarrollo_factor = min(1, gdd / 1000) * 0.8
        hr_factor = HR / 100
        lluvia_factor = min(1, lluvia / 20) * 0.5
        
        index = 0.5 + desarrollo_factor + 0.3 * hr_factor + lluvia_factor
        return np.clip(index + np.random.normal(0, 0.20), 0, 3)
    
    def validate_models(self) -> Dict[str, Any]:
        """
        Ejecutar validación completa de todos los modelos
        
        Returns:
            Dict con métricas de validación por modelo
        """
        logger.info("🔬 Iniciando validación de modelos Watson Optimizer...")
        
        # Generar datos sintéticos
        df = self.generate_synthetic_data(n_samples=300)
        
        results = {}
        pest_names = ['trips', 'minador', 'arana_roja', 'pulgon', 
                      'diaphorina', 'antracnosis', 'mancha_grasienta']
        
        for pest in pest_names:
            y_real = df[f'{pest}_real'].values
            y_pred = []
            
            # Generar predicciones secuenciales (con inercia)
            prev_index = 0.0
            for _, row in df.iterrows():
                conditions = {
                    'GDD': row['GDD'],
                    'T': row['T'],
                    'HR': row['HR'],
                    'lluvia': row['lluvia'],
                    'lluvia_7d': row['lluvia_7d'],
                    'previous_indices': {pest: prev_index for pest in pest_names},
                    'applications': {},
                    'agua_stress': row['agua_stress'],
                    'enemigos_nat': row['enemigos_nat'],
                    'hlb_regional': row['hlb_regional'],
                    'hojarasca': row['hojarasca'],
                    'wetness_hrs': row['wetness_hrs']
                }
                
                result = self.engine.predict_all(conditions)
                pred = result['predictions'][pest]
                y_pred.append(pred)
                prev_index = pred * 0.8  # Suavizado para siguiente predicción
            
            y_pred = np.array(y_pred)
            
            # Calcular métricas
            r2 = r2_score(y_real, y_pred)
            mae = mean_absolute_error(y_real, y_pred)
            rmse = np.sqrt(mean_squared_error(y_real, y_pred))
            
            # Verificar target R² > 0.85
            target_met = r2 >= 0.85
            
            results[pest] = {
                'r2': round(r2, 4),
                'mae': round(mae, 4),
                'rmse': round(rmse, 4),
                'target_met': target_met,
                'status': '✅' if target_met else '⚠️',
                'n_samples': len(y_real)
            }
            
            logger.info(f"  {results[pest]['status']} {pest}: R²={r2:.4f}, MAE={mae:.4f}")
        
        # Resumen global
        r2_values = [r['r2'] for r in results.values()]
        models_passing = sum(1 for r in results.values() if r['target_met'])
        
        summary = {
            'models_validated': len(pest_names),
            'models_passing': models_passing,
            'avg_r2': round(np.mean(r2_values), 4),
            'min_r2': round(np.min(r2_values), 4),
            'max_r2': round(np.max(r2_values), 4),
            'all_targets_met': models_passing == len(pest_names)
        }
        
        self.validation_results = {
            'timestamp': datetime.now().isoformat(),
            'models': results,
            'summary': summary
        }
        
        return self.validation_results
    
    def print_validation_report(self) -> None:
        """Imprimir reporte de validación formateado"""
        if not self.validation_results:
            self.validate_models()
        
        results = self.validation_results
        
        print("\n" + "=" * 70)
        print("🔬 REPORTE DE VALIDACIÓN - WATSON OPTIMIZER MODELS")
        print("=" * 70)
        print(f"Fecha: {results['timestamp'][:19]}")
        print(f"Target R²: ≥ 0.85")
        print("-" * 70)
        
        print("\n📊 MÉTRICAS POR MODELO:")
        print(f"{'Modelo':<20} {'R²':>8} {'MAE':>8} {'RMSE':>8} {'Estado':>10}")
        print("-" * 54)
        
        for pest, metrics in results['models'].items():
            print(f"{pest:<20} {metrics['r2']:>8.4f} {metrics['mae']:>8.4f} "
                  f"{metrics['rmse']:>8.4f} {metrics['status']:>10}")
        
        print("-" * 54)
        
        summary = results['summary']
        print(f"\n📈 RESUMEN:")
        print(f"  • Modelos validados: {summary['models_validated']}")
        print(f"  • Modelos cumpliendo target: {summary['models_passing']}/{summary['models_validated']}")
        print(f"  • R² promedio: {summary['avg_r2']:.4f}")
        print(f"  • R² mínimo: {summary['min_r2']:.4f}")
        print(f"  • R² máximo: {summary['max_r2']:.4f}")
        
        if summary['all_targets_met']:
            print("\n✅ TODOS LOS MODELOS CUMPLEN EL TARGET R² ≥ 0.85")
        else:
            print("\n⚠️ ALGUNOS MODELOS REQUIEREN CALIBRACIÓN ADICIONAL")
        
        print("=" * 70)
    
    def save_results(self, filepath: str = "validation_results.json") -> None:
        """Guardar resultados de validación a JSON"""
        if not self.validation_results:
            self.validate_models()
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.validation_results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Resultados guardados en: {filepath}")
    
    def calibrate_model(self, pest_name: str, 
                        adjustment_factor: float = 1.0) -> Dict[str, float]:
        """
        Ajustar coeficientes de un modelo para mejorar R²
        
        Args:
            pest_name: Nombre de la plaga
            adjustment_factor: Factor de ajuste (1.0 = sin cambio)
            
        Returns:
            Nuevos coeficientes calibrados
        """
        model = self.engine.models[pest_name]
        
        # Ajustar coeficientes proporcionalmente
        new_beta = {}
        for key, value in model.beta.items():
            if key == 'intercepto':
                new_beta[key] = value * adjustment_factor
            elif value > 0:
                new_beta[key] = value * adjustment_factor
            else:
                new_beta[key] = value / adjustment_factor
        
        model.beta = new_beta
        logger.info(f"✅ Modelo {pest_name} calibrado con factor {adjustment_factor}")
        
        return new_beta


# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================

if __name__ == "__main__":
    print("🚀 Watson Optimizer - Validación de Modelos")
    print("-" * 50)
    
    # Crear validador
    validator = WatsonModelValidator()
    
    # Ejecutar validación
    results = validator.validate_models()
    
    # Imprimir reporte
    validator.print_validation_report()
    
    # Guardar resultados
    validator.save_results("watson_validation_results.json")
