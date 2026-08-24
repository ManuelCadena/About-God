/**
 * Watson Optimizer Dashboard - Panel Principal
 * 
 * Visualización del estado fitosanitario optimizado.
 * Meta: Cada plaga < 0.3 (semáforo verde)
 * 
 * Framework: C²AI Watson Optimizer v7.3
 * Estilo: Industrial Dashboard
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Activity,
  Thermometer, Calendar, Clock, DollarSign, Target,
  Bug, Leaf, Droplets, TrendingUp, RefreshCw, 
  Zap, Package, ArrowRight, BarChart3
} from 'lucide-react';

// API Watson endpoint
const WATSON_API = process.env.REACT_APP_WATSON_API || 'http://44.247.163.1:8502';

interface PlagaInfo {
  plaga: string;
  valor: number;
  umbral: number;
  gap: number;
  semaforo: string;
  status: string;
  en_ventana_critica: boolean;
}

interface AnalisisResumen {
  total_plagas: number;
  en_meta: number;
  fuera_meta: number;
  pct_en_meta: number;
}

interface Producto {
  producto: string;
  targets: string[];
  costo_ha: number;
  reduccion_esperada: number;
  eficiencia: number;
  grupo: string;
}

interface Recomendacion {
  seccion: string;
  fecha_analisis: string;
  fenologia: {
    fase: string;
    nombre: string;
    gdd: number;
    biofix: string;
  };
  cosecha: {
    fecha: string;
    dias: number;
  };
  plagas: Record<string, number>;
  analisis: {
    en_meta: PlagaInfo[];
    fuera_meta: PlagaInfo[];
    resumen: AnalisisResumen;
  };
  semaforo: string;
  accion: string;
  receta: {
    productos: Producto[];
    costo_total: number;
  };
}

interface WatsonPrograma {
  version: string;
  meta: string;
  fecha: string;
  resumen: {
    plagas_fuera_meta: number;
    secciones_requieren_tratamiento: string[];
    costo_total: number;
  };
  recomendaciones: Recomendacion[];
}

const WatsonOptimizerDashboard: React.FC = () => {
  const [data, setData] = useState<WatsonPrograma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  useEffect(() => {
    fetchWatsonData();
    const interval = setInterval(fetchWatsonData, 60000); // Refresh cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchWatsonData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${WATSON_API}/api/watson/programa`);
      if (!response.ok) throw new Error('Error fetching Watson data');
      const result = await response.json();
      if (result.status === 'success') {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getSemaforoColor = (semaforo: string): string => {
    if (semaforo.includes('🟢')) return 'bg-green-500';
    if (semaforo.includes('🟡')) return 'bg-yellow-500';
    if (semaforo.includes('🟠')) return 'bg-orange-500';
    if (semaforo.includes('🔴')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getSemaforoBorder = (semaforo: string): string => {
    if (semaforo.includes('🟢')) return 'border-green-500/50';
    if (semaforo.includes('🟡')) return 'border-yellow-500/50';
    if (semaforo.includes('🟠')) return 'border-orange-500/50';
    if (semaforo.includes('🔴')) return 'border-red-500/50';
    return 'border-gray-500/50';
  };

  const getAccionStyle = (accion: string) => {
    switch (accion) {
      case 'MONITOREO':
        return { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle };
      case 'TRATAMIENTO_REQUERIDO':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: AlertTriangle };
      case 'TRATAMIENTO_URGENTE':
        return { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Activity };
    }
  };

  // Chart para distribución de plagas
  const plagasChartOptions: ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
    xaxis: { 
      categories: ['Trips', 'Minador', 'Diaforina', 'Pulgón', 'Araña', 'Antracnosis', 'M.Gras'],
      labels: { style: { colors: '#9ca3af' } }
    },
    yaxis: { labels: { style: { colors: '#9ca3af' } } },
    grid: { borderColor: '#374151' },
    legend: { show: false },
    tooltip: { theme: 'dark' },
    annotations: {
      xaxis: [{
        x: 0.3,
        borderColor: '#22c55e',
        label: { text: 'META 0.3', style: { color: '#22c55e', background: 'transparent' } }
      }]
    }
  };

  const getPlagasSeriesForSection = (rec: Recomendacion) => {
    const plagas = rec.plagas;
    return [{
      name: rec.seccion,
      data: [
        plagas.trips || 0,
        plagas.minador || 0,
        plagas.diaforina || 0,
        plagas.pulgon || 0,
        plagas.arana_roja || 0,
        plagas.antracnosis || 0,
        plagas.mancha_grasienta || 0
      ]
    }];
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-slate-400">Cargando Watson Optimizer...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error de Conexión</h2>
          <p className="text-slate-400">{error}</p>
          <button 
            onClick={fetchWatsonData}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const filteredRecs = selectedSection === 'ALL' 
    ? data.recomendaciones 
    : data.recomendaciones.filter(r => r.seccion === selectedSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Industrial */}
      <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/50">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Watson Optimizer</h1>
                <p className="text-slate-400">{data.version} • {data.meta}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">Última actualización</div>
                <div className="text-white font-mono">{new Date(data.fecha).toLocaleString()}</div>
              </div>
              <button 
                onClick={fetchWatsonData}
                title="Actualizar datos"
                aria-label="Actualizar datos"
                className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
              >
                <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* KPIs Globales */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Bug className="w-4 h-4" />
              <span>Plagas Fuera de Meta</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{data.resumen.plagas_fuera_meta}</div>
            <div className="text-sm text-slate-500 mt-1">de 21 monitoreadas</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Target className="w-4 h-4" />
              <span>Secciones en Tratamiento</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">
              {data.resumen.secciones_requieren_tratamiento.length}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {data.resumen.secciones_requieren_tratamiento.join(', ') || 'Ninguna'}
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Costo Total Tratamiento</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              ${data.resumen.costo_total.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 mt-1">por hectárea</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>Meta Fitosanitaria</span>
            </div>
            <div className="text-3xl font-bold text-green-400">&lt; 0.30</div>
            <div className="text-sm text-slate-500 mt-1">cada plaga individual</div>
          </div>
        </div>

        {/* Selector de Sección */}
        <div className="flex gap-2">
          {['ALL', 'S1', 'S2', 'S3'].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedSection === sec
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {sec === 'ALL' ? 'Todas las Secciones' : `Sección ${sec}`}
            </button>
          ))}
        </div>

        {/* Cards por Sección */}
        <div className="space-y-6">
          {filteredRecs.map(rec => {
            const accionStyle = getAccionStyle(rec.accion);
            const AccionIcon = accionStyle.icon;
            
            return (
              <div 
                key={rec.seccion}
                className={`bg-slate-800/80 rounded-xl border-2 ${getSemaforoBorder(rec.semaforo)} overflow-hidden`}
              >
                {/* Header de Sección */}
                <div className="bg-slate-700/50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${getSemaforoColor(rec.semaforo)}`} />
                    <h2 className="text-xl font-bold text-white">Sección {rec.seccion}</h2>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${accionStyle.bg} ${accionStyle.text}`}>
                      <AccionIcon className="w-4 h-4 inline mr-1" />
                      {rec.accion.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-400" />
                      <span className="text-slate-400">Fase:</span>
                      <span className="text-white font-medium">{rec.fenologia.fase} ({rec.fenologia.nombre})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-slate-400">GDD:</span>
                      <span className="text-white font-medium">{rec.fenologia.gdd.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400">Cosecha:</span>
                      <span className="text-white font-medium">{rec.cosecha.fecha} ({rec.cosecha.dias}d)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                  {/* Panel de Plagas */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Bug className="w-5 h-5 text-purple-400" />
                      Estado de Plagas
                      <span className="text-sm font-normal text-slate-400 ml-2">
                        ({rec.analisis.resumen.en_meta}/{rec.analisis.resumen.total_plagas} en meta)
                      </span>
                    </h3>
                    
                    <div className="space-y-2">
                      {Object.entries(rec.plagas)
                        .filter(([key]) => key !== 'ultima_fecha')
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .map(([plaga, valor]) => {
                          const v = valor as number;
                          const enMeta = v < 0.3;
                          const semaforo = v < 0.3 ? '🟢' : v < 0.6 ? '🟡' : v < 1.0 ? '🟠' : '🔴';
                          
                          return (
                            <div key={plaga} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                              <div className={`w-3 h-3 rounded-full ${getSemaforoColor(semaforo)}`} />
                              <span className="text-white font-medium w-32 capitalize">
                                {plaga.replace('_', ' ')}
                              </span>
                              <div className="flex-1">
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      enMeta ? 'bg-green-500' : v < 0.6 ? 'bg-yellow-500' : v < 1.0 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(100, v / 1.5 * 100)}%` }}
                                  />
                                </div>
                              </div>
                              <span className={`font-mono font-bold w-12 text-right ${
                                enMeta ? 'text-green-400' : v < 0.6 ? 'text-yellow-400' : v < 1.0 ? 'text-orange-400' : 'text-red-400'
                              }`}>
                                {v.toFixed(2)}
                              </span>
                              {!enMeta && (
                                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                                  +{(v - 0.3).toFixed(2)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                    
                    <div className="mt-4 text-xs text-slate-500">
                      Última fecha muestreo: {rec.plagas.ultima_fecha}
                    </div>
                  </div>

                  {/* Panel de Receta */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-400" />
                      Receta Optimizada
                      {rec.receta.costo_total > 0 && (
                        <span className="text-sm font-normal text-amber-400 ml-2">
                          ${rec.receta.costo_total.toLocaleString()}/ha
                        </span>
                      )}
                    </h3>

                    {rec.receta.productos.length > 0 ? (
                      <div className="space-y-3">
                        {rec.receta.productos.map((prod, idx) => (
                          <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-bold uppercase">{prod.producto}</span>
                              <span className="text-amber-400 font-mono">${prod.costo_ha}/ha</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <ArrowRight className="w-4 h-4 text-green-400" />
                              <span className="text-slate-400">Targets:</span>
                              <div className="flex gap-1">
                                {prod.targets.map(t => (
                                  <span key={t} className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs capitalize">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span>Grupo: {prod.grupo}</span>
                              <span>Eficiencia: ${prod.eficiencia}/reducción</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-green-400 font-medium">Sin tratamiento requerido</p>
                        <p className="text-slate-500 text-sm mt-1">Todas las plagas están en meta</p>
                      </div>
                    )}

                    {/* Gráfico de barras */}
                    {rec.receta.productos.length > 0 && (
                      <div className="mt-4">
                        <Chart 
                          options={plagasChartOptions} 
                          series={getPlagasSeriesForSection(rec)} 
                          type="bar" 
                          height={200} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con regla */}
        <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <div className="font-semibold text-purple-400 mb-1">
                Regla Watson Optimizer: Meta Fitosanitaria
              </div>
              <p className="text-sm text-slate-300">
                Cada plaga/enfermedad individual debe mantenerse <strong>&lt; 0.30</strong> para 
                semáforo verde. El sistema usa el <strong>valor MÁXIMO</strong> del muestreo más 
                reciente por sección y optimiza las recetas por <strong>$/reducción</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatsonOptimizerDashboard;
