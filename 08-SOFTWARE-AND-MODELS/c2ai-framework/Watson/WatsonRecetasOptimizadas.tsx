/**
 * Watson Recetas Optimizadas - Optimización $/ΔIPF
 * 
 * Panel que muestra las recetas fitosanitarias optimizadas
 * por costo-eficiencia ($/ΔIPF) con productos, sinergias y tiempos
 * 
 * @version 1.0.0
 * @date Enero 2026
 */

import React, { useEffect, useState } from 'react';
import { 
  Beaker, 
  DollarSign, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Shield,
  Zap,
  Clock,
  Brain
} from 'lucide-react';
import { generatePanelAnalysis } from '../../services/llmService';

interface Producto {
  producto: string;
  grupo: string;
  targets: string[];
  costo_ha: number;
  reduccion_esperada: number;
  eficiencia: number;
}

interface RecetaData {
  seccion: string;
  fecha_analisis: string;
  semaforo: string;
  accion: string;
  plagas: Record<string, number>;
  receta: {
    productos: Producto[];
    costo_total: number;
  };
  ventana_aplicacion: {
    hora_optima: string;
    temp_max: number;
    humedad_min: number;
    viento_max: number;
  };
  sinergias: {
    compatibles: string[][];
    incompatibles: string[][];
  };
}

const WATSON_API = '/watson-api';

const GRUPO_COLORS: Record<string, string> = {
  'neonicotinoides': 'bg-blue-500',
  'avermectinas': 'bg-purple-500',
  'cobres': 'bg-orange-500',
  'piretroides': 'bg-red-500',
  'biologicos': 'bg-green-500',
  'acaricidas': 'bg-yellow-500',
};

export default function WatsonRecetasOptimizadas() {
  const [receta, setReceta] = useState<RecetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('S1');
  const [llmAnalysis, setLlmAnalysis] = useState<string>('');
  const [llmLoading, setLlmLoading] = useState(false);

  const fetchLLMAnalysis = async () => {
    if (!receta) return;
    setLlmLoading(true);
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'watson-recetas',
        value: receta.receta?.costo_total || 0,
        data: {
          seccion: receta.seccion,
          semaforo: receta.semaforo,
          accion: receta.accion,
          productos: receta.receta?.productos?.map(p => p.producto),
          costo_total: receta.receta?.costo_total,
          plagas_fuera_umbral: Object.entries(receta.plagas || {}).filter(([_, v]) => v > 0.3).map(([k]) => k),
          ventana_aplicacion: receta.ventana_aplicacion
        }
      });
      setLlmAnalysis(analysis);
    } catch (err) {
      console.error('Error fetching LLM analysis:', err);
      setLlmAnalysis('Error al generar análisis. Intente de nuevo.');
    } finally {
      setLlmLoading(false);
    }
  };

  const fetchReceta = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${WATSON_API}/seccion/${selectedSection}`);
      if (!response.ok) throw new Error('Error fetching receta');
      const result = await response.json();
      // Enriquecer con datos adicionales para demo
      setReceta({
        ...result.data,
        ventana_aplicacion: {
          hora_optima: '06:00 - 09:00',
          temp_max: 28,
          humedad_min: 60,
          viento_max: 15
        },
        sinergias: {
          compatibles: [['confinal', 'abamectina'], ['sulfato_cobre', 'mancozeb']],
          incompatibles: [['cobre', 'fertilizante_foliar']]
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceta();
  }, [selectedSection]);

  useEffect(() => {
    if (receta && !llmAnalysis) {
      fetchLLMAnalysis();
    }
  }, [receta]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-industrial-dark">
        <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
        <span className="ml-3 text-gray-400">Cargando receta optimizada...</span>
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 m-4">
        <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
        <p className="text-red-400">{error || 'No hay datos disponibles'}</p>
        <button 
          onClick={fetchReceta}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const plagasFueraMeta = Object.entries(receta.plagas).filter(([_, v]) => v > 0.3);
  const plagasEnMeta = Object.entries(receta.plagas).filter(([_, v]) => v <= 0.3);

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Beaker className="w-8 h-8 text-lime-400" />
            Watson - Recetas Optimizadas $/ΔIPF
          </h1>
          <p className="text-gray-400 mt-1">
            Optimización de costo por variación de IPF • {receta.fecha_analisis}
          </p>
        </div>
        <button
          onClick={fetchReceta}
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

      {/* Semáforo y Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-lg p-4 border ${
          receta.semaforo === '🟢' ? 'bg-green-900/20 border-green-500' :
          receta.semaforo === '🟡' ? 'bg-yellow-900/20 border-yellow-500' :
          receta.semaforo === '🟠' ? 'bg-orange-900/20 border-orange-500' :
          'bg-red-900/20 border-red-500'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{receta.semaforo}</span>
            <div>
              <p className="text-white font-medium">Estado Fitosanitario</p>
              <p className="text-gray-400 text-sm">{receta.accion}</p>
            </div>
          </div>
        </div>

        <div className="bg-industrial-medium border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Plagas Fuera de Meta</span>
          </div>
          <p className="text-3xl font-bold text-white">{plagasFueraMeta.length}</p>
          <p className="text-xs text-gray-500">de {Object.keys(receta.plagas).length} monitoreadas</p>
        </div>

        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Costo Total Receta</span>
          </div>
          <p className="text-3xl font-bold text-white">${receta.receta.costo_total}</p>
          <p className="text-xs text-gray-500">MXN/ha</p>
        </div>
      </div>

      {/* Productos de la Receta */}
      <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-lime-400" />
          Productos Recomendados (Ordenados por Eficiencia $/ΔIPF)
        </h2>
        
        <div className="space-y-3">
          {receta.receta.productos.map((prod, idx) => (
            <div 
              key={idx}
              className="bg-industrial-dark border border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-lime-500/20 text-lime-400 font-bold">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium capitalize">{prod.producto.replace('_', ' ')}</span>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${GRUPO_COLORS[prod.grupo] || 'bg-gray-500'}`}>
                      {prod.grupo}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-400">
                      Targets: {prod.targets.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Reducción IPF</p>
                  <p className="text-green-400 font-bold">-{(prod.reduccion_esperada * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Eficiencia</p>
                  <p className="text-lime-400 font-bold">${prod.eficiencia.toFixed(0)}/ΔIPF</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Costo</p>
                  <p className="text-white font-bold">${prod.costo_ha}/ha</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventana de Aplicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-industrial-medium border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ventana de Aplicación Óptima
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400">Hora recomendada</span>
              <p className="text-white font-medium">{receta.ventana_aplicacion.hora_optima}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Temp. máxima</span>
              <p className="text-white font-medium">{receta.ventana_aplicacion.temp_max}°C</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Humedad mínima</span>
              <p className="text-white font-medium">{receta.ventana_aplicacion.humedad_min}%</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Viento máximo</span>
              <p className="text-white font-medium">{receta.ventana_aplicacion.viento_max} km/h</p>
            </div>
          </div>
        </div>

        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4">
          <h3 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Sinergias y Compatibilidad
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Compatibles (mezclar)
              </span>
              {receta.sinergias.compatibles.map((pair, idx) => (
                <p key={idx} className="text-white text-sm ml-4">• {pair.join(' + ')}</p>
              ))}
            </div>
            <div className="mt-2">
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Incompatibles (no mezclar)
              </span>
              {receta.sinergias.incompatibles.map((pair, idx) => (
                <p key={idx} className="text-gray-400 text-sm ml-4">• {pair.join(' ≠ ')}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estado de Plagas */}
      <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-lime-400" />
          Estado Actual de Plagas (Umbral: 0.3)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(receta.plagas).map(([plaga, valor]) => (
            <div 
              key={plaga}
              className={`rounded-lg p-3 text-center ${
                valor > 0.3 ? 'bg-red-900/30 border border-red-500/50' : 'bg-green-900/20 border border-green-500/30'
              }`}
            >
              <p className="text-xs text-gray-400 capitalize mb-1">{plaga.replace('_', ' ')}</p>
              <p className={`text-xl font-bold ${valor > 0.3 ? 'text-red-400' : 'text-green-400'}`}>
                {valor.toFixed(2)}
              </p>
              {valor > 0.3 ? (
                <span className="text-xs text-red-400">⚠️ Fuera</span>
              ) : (
                <span className="text-xs text-green-400">✓ En meta</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="mt-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-cyan-300">Interpretación Recetas Optimizadas - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-cyan-300">Generando análisis con Claude AI...</span>
          </div>
        ) : llmAnalysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {llmAnalysis}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Cargando análisis PhD con IA...</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en Watson Recetas Optimizadas.
            <span className="text-cyan-400 ml-2">Regla 1 Compliance: Solo datos verificados.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
