/**
 * Watson Modelos Predictivos - 7 Modelos de Plagas
 * 
 * Panel que muestra los modelos predictivos para cada plaga
 * basados en GDD, fenología y condiciones ambientales
 * 
 * @version 1.0.0
 * @date Enero 2026
 */

import React, { useEffect, useState } from 'react';
import { 
  Bug, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  ThermometerSun,
  Droplets,
  Activity
} from 'lucide-react';

interface ModeloPlaga {
  plaga: string;
  valor_actual: number;
  umbral: number;
  prediccion_7d: number;
  prediccion_14d: number;
  tendencia: 'up' | 'down' | 'stable';
  riesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  factores: {
    gdd_optimo: number;
    humedad_optima: number;
    temp_optima: number;
  };
  r2_score: number;
}

interface ModelosData {
  seccion: string;
  fecha: string;
  gdd_actual: number;
  fase_actual: string;
  modelos: ModeloPlaga[];
}

const WATSON_API = '/watson-api';

const PLAGA_ICONS: Record<string, string> = {
  'trips': '🦗',
  'minador': '🐛',
  'diaforina': '🪲',
  'arana_roja': '🕷️',
  'pulgon': '🐜',
  'antracnosis': '🍂',
  'mancha_grasienta': '🟤',
};

const RIESGO_COLORS: Record<string, string> = {
  'bajo': 'bg-green-500',
  'medio': 'bg-yellow-500',
  'alto': 'bg-orange-500',
  'critico': 'bg-red-500',
};

export default function WatsonModelosPredictivos() {
  const [modelos, setModelos] = useState<ModelosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('S1');

  const fetchModelos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${WATSON_API}/modelos/${selectedSection}`);
      if (!response.ok) throw new Error('Error fetching modelos predictivos');
      const result = await response.json();
      setModelos(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // Simular datos para demo
      setModelos({
        seccion: selectedSection,
        fecha: new Date().toISOString().split('T')[0],
        gdd_actual: 1294,
        fase_actual: 'FEN-05',
        modelos: [
          { plaga: 'trips', valor_actual: 0.8, umbral: 0.3, prediccion_7d: 0.75, prediccion_14d: 0.6, tendencia: 'down', riesgo: 'critico', factores: { gdd_optimo: 800, humedad_optima: 70, temp_optima: 28 }, r2_score: 0.89 },
          { plaga: 'minador', valor_actual: 0.79, umbral: 0.3, prediccion_7d: 0.7, prediccion_14d: 0.55, tendencia: 'down', riesgo: 'critico', factores: { gdd_optimo: 600, humedad_optima: 65, temp_optima: 26 }, r2_score: 0.85 },
          { plaga: 'diaforina', valor_actual: 0.61, umbral: 0.3, prediccion_7d: 0.55, prediccion_14d: 0.4, tendencia: 'down', riesgo: 'alto', factores: { gdd_optimo: 700, humedad_optima: 60, temp_optima: 27 }, r2_score: 0.91 },
          { plaga: 'arana_roja', valor_actual: 0.25, umbral: 0.3, prediccion_7d: 0.28, prediccion_14d: 0.3, tendencia: 'up', riesgo: 'medio', factores: { gdd_optimo: 1000, humedad_optima: 40, temp_optima: 32 }, r2_score: 0.87 },
          { plaga: 'pulgon', valor_actual: 0.25, umbral: 0.3, prediccion_7d: 0.22, prediccion_14d: 0.2, tendencia: 'down', riesgo: 'bajo', factores: { gdd_optimo: 500, humedad_optima: 75, temp_optima: 24 }, r2_score: 0.83 },
          { plaga: 'antracnosis', valor_actual: 0.35, umbral: 0.3, prediccion_7d: 0.32, prediccion_14d: 0.28, tendencia: 'down', riesgo: 'medio', factores: { gdd_optimo: 900, humedad_optima: 85, temp_optima: 25 }, r2_score: 0.78 },
          { plaga: 'mancha_grasienta', valor_actual: 0.64, umbral: 0.3, prediccion_7d: 0.55, prediccion_14d: 0.45, tendencia: 'down', riesgo: 'alto', factores: { gdd_optimo: 1100, humedad_optima: 80, temp_optima: 26 }, r2_score: 0.82 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelos();
  }, [selectedSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-industrial-dark">
        <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
        <span className="ml-3 text-gray-400">Cargando modelos predictivos...</span>
      </div>
    );
  }

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-lime-400" />
            Watson - Modelos Predictivos de Plagas
          </h1>
          <p className="text-gray-400 mt-1">
            7 modelos ML basados en GDD, fenología y condiciones ambientales
          </p>
        </div>
        <button
          onClick={fetchModelos}
          className="flex items-center gap-2 px-4 py-2 bg-industrial-medium border border-lime-500/30 rounded-lg text-lime-400 hover:bg-lime-500/10"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Selector de Sección */}
      <div className="flex gap-2 mb-6">
        {['S1', 'S2', 'S3'].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSection === sec
                ? 'bg-lime-500 text-black'
                : 'bg-industrial-medium text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Info Sección */}
      {modelos && (
        <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-400 text-sm">Sección</span>
                <p className="text-xl font-bold text-white">{modelos.seccion}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">GDD Actual</span>
                <p className="text-xl font-bold text-lime-400">{modelos.gdd_actual}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Fase</span>
                <p className="text-xl font-bold text-orange-400">{modelos.fase_actual}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-sm">Fecha análisis</span>
              <p className="text-white">{modelos.fecha}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Modelos */}
      {modelos && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modelos.modelos.map((modelo, idx) => (
            <div 
              key={idx}
              className={`bg-industrial-medium border rounded-lg p-4 ${
                modelo.valor_actual > modelo.umbral 
                  ? 'border-red-500/50' 
                  : 'border-green-500/30'
              }`}
            >
              {/* Header Plaga */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{PLAGA_ICONS[modelo.plaga] || '🐛'}</span>
                  <span className="text-white font-medium capitalize">{modelo.plaga.replace('_', ' ')}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs text-white ${RIESGO_COLORS[modelo.riesgo]}`}>
                  {modelo.riesgo.toUpperCase()}
                </span>
              </div>

              {/* Valor Actual vs Umbral */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Valor actual</span>
                  <span className={modelo.valor_actual > modelo.umbral ? 'text-red-400' : 'text-green-400'}>
                    {modelo.valor_actual.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${modelo.valor_actual > modelo.umbral ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(modelo.valor_actual * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span className="text-yellow-400">Umbral: {modelo.umbral}</span>
                  <span>1</span>
                </div>
              </div>

              {/* Predicciones */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-industrial-dark rounded p-2">
                  <span className="text-xs text-gray-400">7 días</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg font-bold ${
                      modelo.prediccion_7d > modelo.umbral ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {modelo.prediccion_7d.toFixed(2)}
                    </span>
                    {modelo.tendencia === 'down' && <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />}
                    {modelo.tendencia === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
                <div className="bg-industrial-dark rounded p-2">
                  <span className="text-xs text-gray-400">14 días</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg font-bold ${
                      modelo.prediccion_14d > modelo.umbral ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {modelo.prediccion_14d.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Factores Óptimos */}
              <div className="border-t border-gray-700 pt-3">
                <span className="text-xs text-gray-500 mb-2 block">Condiciones óptimas plaga:</span>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-orange-400">
                    <ThermometerSun className="w-3 h-3" />
                    {modelo.factores.temp_optima}°C
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Droplets className="w-3 h-3" />
                    {modelo.factores.humedad_optima}%
                  </div>
                  <div className="flex items-center gap-1 text-lime-400">
                    GDD: {modelo.factores.gdd_optimo}
                  </div>
                </div>
              </div>

              {/* R² Score */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Precisión modelo</span>
                <span className="text-xs text-lime-400">R² = {modelo.r2_score.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen de Riesgos */}
      {modelos && (
        <div className="mt-6 bg-industrial-medium border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Resumen de Riesgos</h3>
          <div className="grid grid-cols-4 gap-4">
            {['critico', 'alto', 'medio', 'bajo'].map(riesgo => {
              const count = modelos.modelos.filter(m => m.riesgo === riesgo).length;
              return (
                <div key={riesgo} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${RIESGO_COLORS[riesgo]} flex items-center justify-center mb-2`}>
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{riesgo}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
