#!/usr/bin/env python3
"""
Watson Optimizer - Backtesting con Datos Reales
================================================
Valida y calibra los 7 modelos predictivos usando datos históricos de:
- PostgreSQL (citrusmax_biofix): datos de monitoreo, clima, fenología
- Google Sheets "R La Luz": registros de muestreo de campo

Autor: CitrusMax AI Team
Fecha: 2026-01-05
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
import pandas as pd

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')
logger = logging.getLogger(__name__)

# Importar dependencias opcionales
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False
    logger.warning("psycopg2 no disponible - conexión PostgreSQL deshabilitada")

try:
    import gspread
    from google.oauth2.service_account import Credentials
    HAS_GSPREAD = True
except ImportError:
    HAS_GSPREAD = False
    logger.warning("gspread no disponible - conexión Google Sheets deshabilitada")

# Sklearn para métricas
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Importar modelos Watson
from watson_optimizer_models import PestPredictionEngine


class WatsonBacktester:
    """
    Clase para backtesting de modelos Watson con datos reales
    """
    
    # Configuración de conexiones
    PG_CONFIG = {
        'host': '44.247.163.1',
        'port': 5432,
        'database': 'citrusmax_biofix',
        'user': 'citrusmax_admin',
        'password': os.environ.get('CITRUSMAX_DB_PASSWORD', '')
    }
    
    GSHEET_ID = '1MBfDCW7RP7qwO_l957iILF0W5bynI6N58OEAUQ_RzyQ'
    CREDENTIALS_PATH = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        'google_sheets_credentials.json'
    )
    
    # Mapeo de plagas entre fuentes de datos y modelos
    PEST_MAPPING = {
        # Google Sheets columns -> Model names
        'Trips': 'trips',
        'trips': 'trips',
        'Minador': 'minador',
        'minador': 'minador',
        'Araña Roja': 'arana_roja',
        'arana_roja': 'arana_roja',
        'Pulgón': 'pulgon',
        'pulgon': 'pulgon',
        'Diaphorina': 'diaphorina',
        'diaphorina': 'diaphorina',
        'Antracnosis': 'antracnosis',
        'antracnosis': 'antracnosis',
        'Mancha Grasienta': 'mancha_grasienta',
        'mancha_grasienta': 'mancha_grasienta'
    }
    
    def __init__(self):
        self.engine = PestPredictionEngine()
        self.pg_conn = None
        self.gsheet_client = None
        self.historical_data = None
        self.backtesting_results = {}
        
        logger.info("🔬 Watson Backtester inicializado")
    
    def connect_postgresql(self) -> bool:
        """Conectar a PostgreSQL"""
        if not HAS_PSYCOPG2:
            logger.error("psycopg2 no instalado")
            return False
        
        try:
            self.pg_conn = psycopg2.connect(**self.PG_CONFIG)
            logger.info("✅ Conectado a PostgreSQL")
            return True
        except Exception as e:
            logger.error(f"❌ Error conectando a PostgreSQL: {e}")
            return False
    
    def connect_google_sheets(self) -> bool:
        """Conectar a Google Sheets"""
        if not HAS_GSPREAD:
            logger.error("gspread no instalado")
            return False
        
        try:
            # Cargar credenciales
            with open(self.CREDENTIALS_PATH, 'r') as f:
                creds_data = json.load(f)
            
            # Manejar estructura anidada
            if 'google_sheets_credentials' in creds_data:
                creds_data = creds_data['google_sheets_credentials']
            
            scopes = [
                'https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/drive.readonly'
            ]
            
            credentials = Credentials.from_service_account_info(creds_data, scopes=scopes)
            self.gsheet_client = gspread.authorize(credentials)
            
            logger.info("✅ Conectado a Google Sheets")
            return True
        except Exception as e:
            logger.error(f"❌ Error conectando a Google Sheets: {e}")
            return False
    
    def fetch_data_from_postgresql(self) -> Optional[pd.DataFrame]:
        """
        Obtener datos históricos de PostgreSQL
        
        Returns:
            DataFrame con datos de monitoreo, clima y fenología
        """
        if not self.pg_conn:
            if not self.connect_postgresql():
                return None
        
        query = """
        SELECT 
            m.fecha_muestreo as fecha,
            m.seccion,
            m.trips_indice as trips,
            m.minador_indice as minador,
            m.arana_roja_indice as arana_roja,
            m.pulgon_indice as pulgon,
            m.diaphorina_indice as diaphorina,
            m.antracnosis_indice as antracnosis,
            m.mancha_grasienta_indice as mancha_grasienta,
            w.temperatura_media as T,
            w.humedad_relativa as HR,
            w.precipitacion as lluvia,
            b.gdd_acumulado as GDD
        FROM appsheet.muestreo m
        LEFT JOIN weather.daily_data w ON m.fecha_muestreo = w.fecha
        LEFT JOIN biofix.biofix_status b ON m.seccion = b.seccion
        WHERE m.fecha_muestreo >= '2024-01-01'
        ORDER BY m.fecha_muestreo
        """
        
        try:
            df = pd.read_sql(query, self.pg_conn)
            logger.info(f"✅ Obtenidos {len(df)} registros de PostgreSQL")
            return df
        except Exception as e:
            logger.error(f"❌ Error en query PostgreSQL: {e}")
            
            # Intentar query alternativa más simple
            alt_query = """
            SELECT * FROM appsheet.muestreo 
            WHERE fecha_muestreo >= '2024-01-01'
            ORDER BY fecha_muestreo
            LIMIT 500
            """
            try:
                df = pd.read_sql(alt_query, self.pg_conn)
                logger.info(f"✅ Obtenidos {len(df)} registros (query alternativa)")
                return df
            except Exception as e2:
                logger.error(f"❌ Error en query alternativa: {e2}")
                return None
    
    def fetch_data_from_gsheets(self) -> Optional[pd.DataFrame]:
        """
        Obtener datos históricos de Google Sheets "R La Luz"
        
        Returns:
            DataFrame con datos de muestreo de campo
        """
        if not self.gsheet_client:
            if not self.connect_google_sheets():
                return None
        
        try:
            spreadsheet = self.gsheet_client.open_by_key(self.GSHEET_ID)
            
            # Buscar hoja de muestreo/monitoreo
            worksheets = spreadsheet.worksheets()
            target_sheet = None
            
            for ws in worksheets:
                title_lower = ws.title.lower()
                if any(kw in title_lower for kw in ['muestreo', 'monitoreo', 'plagas', 'sampling']):
                    target_sheet = ws
                    break
            
            if not target_sheet:
                # Usar primera hoja como fallback
                target_sheet = worksheets[0]
                logger.warning(f"⚠️ Usando hoja por defecto: {target_sheet.title}")
            
            # Obtener todos los datos
            data = target_sheet.get_all_records()
            df = pd.DataFrame(data)
            
            logger.info(f"✅ Obtenidos {len(df)} registros de Google Sheets ({target_sheet.title})")
            logger.info(f"   Columnas: {list(df.columns)[:10]}...")
            
            return df
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo datos de Google Sheets: {e}")
            return None
    
    def prepare_backtesting_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Preparar y normalizar datos para backtesting
        
        Args:
            df: DataFrame crudo de cualquier fuente
            
        Returns:
            DataFrame normalizado con columnas estándar
        """
        df = df.copy()
        
        # Detectar y renombrar columnas de fecha
        date_cols = [c for c in df.columns if any(kw in c.lower() for kw in ['fecha', 'date', 'dia'])]
        if date_cols:
            df['fecha'] = pd.to_datetime(df[date_cols[0]], errors='coerce')
        
        # Detectar y renombrar columnas de temperatura
        temp_cols = [c for c in df.columns if any(kw in c.lower() for kw in ['temp', 't_', 'temperatura'])]
        if temp_cols and 'T' not in df.columns:
            df['T'] = pd.to_numeric(df[temp_cols[0]], errors='coerce')
        
        # Detectar y renombrar columnas de humedad
        hr_cols = [c for c in df.columns if any(kw in c.lower() for kw in ['humedad', 'hr', 'humidity'])]
        if hr_cols and 'HR' not in df.columns:
            df['HR'] = pd.to_numeric(df[hr_cols[0]], errors='coerce')
        
        # Detectar y renombrar columnas de lluvia
        rain_cols = [c for c in df.columns if any(kw in c.lower() for kw in ['lluvia', 'rain', 'precip'])]
        if rain_cols and 'lluvia' not in df.columns:
            df['lluvia'] = pd.to_numeric(df[rain_cols[0]], errors='coerce')
        
        # Detectar columnas de GDD
        gdd_cols = [c for c in df.columns if 'gdd' in c.lower()]
        if gdd_cols and 'GDD' not in df.columns:
            df['GDD'] = pd.to_numeric(df[gdd_cols[0]], errors='coerce')
        
        # Normalizar columnas de plagas
        for orig_name, model_name in self.PEST_MAPPING.items():
            if orig_name in df.columns and model_name not in df.columns:
                df[model_name] = pd.to_numeric(df[orig_name], errors='coerce')
        
        # Valores por defecto para columnas faltantes
        if 'T' not in df.columns:
            df['T'] = 26.0  # Temperatura promedio tropical
        if 'HR' not in df.columns:
            df['HR'] = 75.0  # Humedad promedio tropical
        if 'lluvia' not in df.columns:
            df['lluvia'] = 0.0
        if 'GDD' not in df.columns:
            # Estimar GDD basado en fecha si hay biofix
            df['GDD'] = np.linspace(0, 1650, len(df))
        
        # Eliminar filas con muchos NaN
        pest_cols = ['trips', 'minador', 'arana_roja', 'pulgon', 
                     'diaphorina', 'antracnosis', 'mancha_grasienta']
        existing_pest_cols = [c for c in pest_cols if c in df.columns]
        
        if existing_pest_cols:
            df = df.dropna(subset=existing_pest_cols, how='all')
        
        logger.info(f"✅ Datos preparados: {len(df)} registros, {len(df.columns)} columnas")
        
        return df
    
    def run_backtesting(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Ejecutar backtesting de todos los modelos
        
        Args:
            df: DataFrame con datos históricos preparados
            
        Returns:
            Dict con resultados de backtesting por modelo
        """
        logger.info("🔬 Iniciando backtesting con datos reales...")
        
        results = {}
        pest_names = ['trips', 'minador', 'arana_roja', 'pulgon', 
                      'diaphorina', 'antracnosis', 'mancha_grasienta']
        
        for pest in pest_names:
            if pest not in df.columns:
                logger.warning(f"⚠️ {pest}: sin datos históricos")
                results[pest] = {'status': 'NO_DATA', 'r2': None}
                continue
            
            # Filtrar registros válidos para esta plaga
            valid_mask = df[pest].notna()
            if valid_mask.sum() < 10:
                logger.warning(f"⚠️ {pest}: insuficientes datos ({valid_mask.sum()} registros)")
                results[pest] = {'status': 'INSUFFICIENT_DATA', 'r2': None, 'n_samples': valid_mask.sum()}
                continue
            
            df_pest = df[valid_mask].copy()
            y_real = df_pest[pest].values
            y_pred = []
            
            # Generar predicciones
            prev_index = 0.0
            for _, row in df_pest.iterrows():
                conditions = {
                    'GDD': float(row.get('GDD', 500)),
                    'T': float(row.get('T', 26)),
                    'HR': float(row.get('HR', 75)),
                    'lluvia': float(row.get('lluvia', 0)),
                    'lluvia_7d': float(row.get('lluvia_7d', row.get('lluvia', 0) * 3)),
                    'previous_indices': {p: prev_index for p in pest_names},
                    'applications': {},
                    'agua_stress': float(row.get('agua_stress', 0)),
                    'enemigos_nat': float(row.get('enemigos_nat', 0.3)),
                    'hlb_regional': float(row.get('hlb_regional', 0.1)),
                    'hojarasca': float(row.get('hojarasca', 0)),
                    'wetness_hrs': float(row.get('wetness_hrs', row.get('HR', 75) / 10))
                }
                
                result = self.engine.predict_all(conditions)
                pred = result['predictions'].get(pest, 0)
                y_pred.append(pred)
                prev_index = pred * 0.7  # Suavizado
            
            y_pred = np.array(y_pred)
            
            # Calcular métricas
            r2 = r2_score(y_real, y_pred)
            mae = mean_absolute_error(y_real, y_pred)
            rmse = np.sqrt(mean_squared_error(y_real, y_pred))
            
            # Correlación
            corr = np.corrcoef(y_real, y_pred)[0, 1] if len(y_real) > 1 else 0
            
            results[pest] = {
                'status': 'OK',
                'r2': round(r2, 4),
                'mae': round(mae, 4),
                'rmse': round(rmse, 4),
                'correlation': round(corr, 4),
                'n_samples': len(y_real),
                'y_real_mean': round(np.mean(y_real), 4),
                'y_pred_mean': round(np.mean(y_pred), 4),
                'target_met': r2 >= 0.85
            }
            
            status = '✅' if r2 >= 0.85 else '⚠️'
            logger.info(f"  {status} {pest}: R²={r2:.4f}, MAE={mae:.4f}, n={len(y_real)}")
        
        self.backtesting_results = {
            'timestamp': datetime.now().isoformat(),
            'data_source': 'real_historical',
            'models': results
        }
        
        return self.backtesting_results
    
    def calibrate_from_backtesting(self) -> Dict[str, Dict[str, float]]:
        """
        Calcular coeficientes óptimos basados en backtesting
        
        Returns:
            Dict con coeficientes calibrados por modelo
        """
        if not self.historical_data is not None or self.historical_data.empty:
            logger.error("❌ No hay datos históricos cargados")
            return {}
        
        logger.info("🔧 Calibrando coeficientes con datos reales...")
        
        calibrated_coefficients = {}
        
        # Para cada modelo, ajustar coeficientes mediante regresión
        pest_names = ['trips', 'minador', 'arana_roja', 'pulgon', 
                      'diaphorina', 'antracnosis', 'mancha_grasienta']
        
        for pest in pest_names:
            if pest not in self.historical_data.columns:
                continue
            
            df_pest = self.historical_data[self.historical_data[pest].notna()].copy()
            if len(df_pest) < 20:
                continue
            
            # Extraer features y target
            y = df_pest[pest].values
            
            # Construir matriz de features según el modelo
            X = self._build_feature_matrix(df_pest, pest)
            
            if X is None or len(X) == 0:
                continue
            
            # Regresión lineal simple para obtener coeficientes
            try:
                from sklearn.linear_model import Ridge
                model = Ridge(alpha=1.0)
                model.fit(X, y)
                
                calibrated_coefficients[pest] = {
                    'intercept': round(model.intercept_, 4),
                    'coefficients': [round(c, 4) for c in model.coef_],
                    'r2_train': round(model.score(X, y), 4)
                }
                
                logger.info(f"  ✅ {pest}: R² train = {calibrated_coefficients[pest]['r2_train']:.4f}")
                
            except Exception as e:
                logger.error(f"  ❌ {pest}: Error en calibración - {e}")
        
        return calibrated_coefficients
    
    def _build_feature_matrix(self, df: pd.DataFrame, pest: str) -> Optional[np.ndarray]:
        """Construir matriz de features para un modelo específico"""
        features = []
        
        try:
            # Features comunes
            if 'GDD' in df.columns:
                gdd = df['GDD'].values
                # Factor fenológico gaussiano
                if pest in ['trips', 'antracnosis']:
                    features.append(np.exp(-((gdd - 450) ** 2) / (2 * 100 ** 2)))
                elif pest in ['minador', 'pulgon', 'diaphorina']:
                    features.append(np.exp(-((gdd - 250) ** 2) / (2 * 100 ** 2)))
                elif pest == 'arana_roja':
                    features.append(np.exp(-((gdd - 1000) ** 2) / (2 * 300 ** 2)))
                else:
                    features.append(gdd / 1650)  # Normalizado
            
            if 'T' in df.columns:
                T = df['T'].values
                # Factor temperatura
                if pest in ['minador', 'diaphorina', 'trips']:
                    features.append(np.exp(-((T - 28) ** 2) / (2 * 25)))
                elif pest in ['pulgon']:
                    features.append(np.exp(-((T - 22) ** 2) / (2 * 36)))
                else:
                    features.append(np.exp(-((T - 24) ** 2) / (2 * 36)))
            
            if 'HR' in df.columns:
                HR = df['HR'].values
                if pest in ['arana_roja']:
                    features.append(np.maximum(0, (80 - HR) / 40))  # Sequedad
                elif pest in ['antracnosis', 'mancha_grasienta']:
                    features.append(np.maximum(0, (HR - 80) / 20))  # Alta humedad
                else:
                    features.append(HR / 100)
            
            if 'lluvia' in df.columns and pest in ['antracnosis', 'mancha_grasienta']:
                features.append(np.minimum(1, df['lluvia'].values / 10))
            
            if len(features) == 0:
                return None
            
            return np.column_stack(features)
            
        except Exception as e:
            logger.error(f"Error construyendo features para {pest}: {e}")
            return None
    
    def print_backtesting_report(self) -> None:
        """Imprimir reporte de backtesting"""
        if not self.backtesting_results:
            logger.error("❌ No hay resultados de backtesting")
            return
        
        print("\n" + "=" * 70)
        print("🔬 REPORTE DE BACKTESTING - WATSON OPTIMIZER (DATOS REALES)")
        print("=" * 70)
        print(f"Fecha: {self.backtesting_results['timestamp'][:19]}")
        print(f"Fuente: {self.backtesting_results['data_source']}")
        print("-" * 70)
        
        print("\n📊 MÉTRICAS POR MODELO:")
        print(f"{'Modelo':<20} {'R²':>8} {'MAE':>8} {'Corr':>8} {'N':>6} {'Estado':>10}")
        print("-" * 62)
        
        models_passing = 0
        for pest, metrics in self.backtesting_results['models'].items():
            if metrics['status'] != 'OK':
                print(f"{pest:<20} {'N/A':>8} {'N/A':>8} {'N/A':>8} {'N/A':>6} {metrics['status']:>10}")
            else:
                status = '✅' if metrics['target_met'] else '⚠️'
                if metrics['target_met']:
                    models_passing += 1
                print(f"{pest:<20} {metrics['r2']:>8.4f} {metrics['mae']:>8.4f} "
                      f"{metrics['correlation']:>8.4f} {metrics['n_samples']:>6} {status:>10}")
        
        print("-" * 62)
        
        valid_models = [m for m in self.backtesting_results['models'].values() if m['status'] == 'OK']
        if valid_models:
            r2_values = [m['r2'] for m in valid_models]
            print(f"\n📈 RESUMEN:")
            print(f"  • Modelos con datos: {len(valid_models)}/7")
            print(f"  • Modelos cumpliendo target: {models_passing}/{len(valid_models)}")
            print(f"  • R² promedio: {np.mean(r2_values):.4f}")
            print(f"  • R² mínimo: {np.min(r2_values):.4f}")
            print(f"  • R² máximo: {np.max(r2_values):.4f}")
        
        print("=" * 70)
    
    def save_results(self, filepath: str = "backtesting_results.json") -> None:
        """Guardar resultados a JSON"""
        if self.backtesting_results:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(self.backtesting_results, f, indent=2, ensure_ascii=False)
            logger.info(f"✅ Resultados guardados en: {filepath}")


def main():
    """Función principal de backtesting"""
    print("🚀 Watson Optimizer - Backtesting con Datos Reales")
    print("-" * 50)
    
    backtester = WatsonBacktester()
    
    # Intentar obtener datos de diferentes fuentes
    df = None
    
    # Opción 1: Google Sheets (más accesible)
    print("\n📊 Intentando conectar a Google Sheets...")
    df = backtester.fetch_data_from_gsheets()
    
    # Opción 2: PostgreSQL si GSheets falla
    if df is None or df.empty:
        print("\n📊 Intentando conectar a PostgreSQL...")
        df = backtester.fetch_data_from_postgresql()
    
    if df is None or df.empty:
        print("\n❌ No se pudieron obtener datos de ninguna fuente")
        print("   Verificar:")
        print("   - Credenciales de Google Sheets en google_sheets_credentials.json")
        print("   - Variable de entorno CITRUSMAX_DB_PASSWORD para PostgreSQL")
        return
    
    # Preparar datos
    df = backtester.prepare_backtesting_data(df)
    backtester.historical_data = df
    
    # Ejecutar backtesting
    backtester.run_backtesting(df)
    
    # Mostrar resultados
    backtester.print_backtesting_report()
    
    # Guardar resultados
    backtester.save_results("watson_backtesting_results.json")
    
    # Intentar calibración si hay suficientes datos
    print("\n🔧 Intentando calibración automática...")
    calibrated = backtester.calibrate_from_backtesting()
    
    if calibrated:
        print("\n📋 Coeficientes calibrados:")
        for pest, coefs in calibrated.items():
            print(f"  {pest}: intercept={coefs['intercept']}, R²={coefs['r2_train']}")


if __name__ == "__main__":
    main()
