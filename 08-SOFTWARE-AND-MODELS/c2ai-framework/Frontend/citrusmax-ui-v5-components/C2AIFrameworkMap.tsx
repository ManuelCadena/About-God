/**
 * C²AI Framework Map - Panel 2
 * 
 * Visualización del framework 5-Layer con estado de cada capa
 * y contribución al resultado final (waterfall).
 * 
 * Framework: C²AI - Conscious Citrus AI
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { 
  Zap, Target, Compass, Eye, Network, Brain, 
  CheckCircle, AlertTriangle, RefreshCw, Info, HelpCircle,
  ArrowRight, Activity
} from 'lucide-react';

interface LayerStatus {
  name: string;
  symbol: string;
  icon: React.ReactNode;
  status: 'active' | 'warning' | 'error';
  contribution: number;
  metrics: Record<string, number>;
  description: string;
  scientist: string;
}

interface FrameworkData {
  section: string;
  timestamp: string;
  layers: LayerStatus[];
  total_vep: number;
  overall_status: 'optimal' | 'warning' | 'critical';
}

const LAYER_CONFIG: Record<string, { color: string; scientist: string; description: string }> = {
  friston: { 
    color: '#06b6d4', 
    scientist: 'Karl Friston',
    description: 'Minimización de energía libre y reducción de incertidumbre mediante predicción activa.'
  },
  levin: { 
    color: '#22c55e', 
    scientist: 'Michael Levin',
    description: 'Objetivos bioléctricos y morfogenéticos de la planta como sistema cognitivo.'
  },
  watson: { 
    color: '#a855f7', 
    scientist: 'John Watson / IBM',
    description: 'Optimización de trayectorias hacia estado óptimo usando landscape analysis.'
  },
  hoffman: { 
    color: '#f59e0b', 
    scientist: 'Donald Hoffman',
    description: 'Interfaz de percepción consciente y construcción de realidad fitness.'
  },
  penrose: { 
    color: '#ec4899', 
    scientist: 'Roger Penrose',
    description: 'Coherencia cuántica y colapso de función de onda para decisión.'
  },
};

interface C2AIFrameworkMapProps {
  selectedSection?: string;
}

const C2AIFrameworkMap: React.FC<C2AIFrameworkMapProps> = ({ 
  selectedSection = 'S1' 
}) => {
  const [data, setData] = useState<FrameworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const API_C2AI = '/c2ai-api';
  const normalizedSection = selectedSection === 'TOTAL' ? 'S1' : selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_C2AI}/api/v1/orchestrator/analyze/${normalizedSection}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            const reportData = result.data;
            const layerMetrics = reportData.layer_metrics || {};
            const vepContributions = reportData.vep_contributions || {};

            const layers: LayerStatus[] = [
              {
                name: 'Friston',
                symbol: 'F',
                icon: <Zap className="w-6 h-6" />,
                status: (layerMetrics.friston?.free_energy || 0) <= 0.3 ? 'active' : 'warning',
                contribution: vepContributions.friston || reportData.economic?.vep_projection * 0.15 || 0,
                metrics: {
                  free_energy: layerMetrics.friston?.free_energy || 0,
                  kl_divergence: layerMetrics.friston?.kl_divergence || 0,
                  urgency: layerMetrics.friston?.urgency || 0,
                },
                description: LAYER_CONFIG.friston.description,
                scientist: LAYER_CONFIG.friston.scientist,
              },
              {
                name: 'Levin',
                symbol: 'L',
                icon: <Target className="w-6 h-6" />,
                status: (layerMetrics.levin?.alignment_score || 0) >= 0.7 ? 'active' : 'warning',
                contribution: vepContributions.levin || reportData.economic?.vep_projection * 0.25 || 0,
                metrics: {
                  alignment_score: layerMetrics.levin?.alignment_score || 0,
                  goal_progress: layerMetrics.levin?.goal_progress || 0,
                },
                description: LAYER_CONFIG.levin.description,
                scientist: LAYER_CONFIG.levin.scientist,
              },
              {
                name: 'Watson',
                symbol: 'W',
                icon: <Compass className="w-6 h-6" />,
                status: (layerMetrics.watson?.trajectory_efficiency || 0) >= 0.85 ? 'active' : 'warning',
                contribution: vepContributions.watson || reportData.economic?.vep_projection * 0.30 || 0,
                metrics: {
                  trajectory_efficiency: layerMetrics.watson?.trajectory_efficiency || 0,
                  energy_gap: layerMetrics.watson?.energy_gap || 0,
                  days_to_optimal: layerMetrics.watson?.days_to_optimal || 0,
                },
                description: LAYER_CONFIG.watson.description,
                scientist: LAYER_CONFIG.watson.scientist,
              },
              {
                name: 'Hoffman',
                symbol: 'H',
                icon: <Eye className="w-6 h-6" />,
                status: (layerMetrics.hoffman?.overall_confidence || 0) >= 0.75 ? 'active' : 'warning',
                contribution: vepContributions.hoffman || reportData.economic?.vep_projection * 0.20 || 0,
                metrics: {
                  overall_confidence: layerMetrics.hoffman?.overall_confidence || 0,
                  perceptions_count: layerMetrics.hoffman?.perceptions_count || 0,
                  conflicts_count: layerMetrics.hoffman?.conflicts_count || 0,
                },
                description: LAYER_CONFIG.hoffman.description,
                scientist: LAYER_CONFIG.hoffman.scientist,
              },
              {
                name: 'Penrose',
                symbol: 'P',
                icon: <Network className="w-6 h-6" />,
                status: (layerMetrics.penrose?.coherence || 0) >= 0.8 ? 'active' : 'warning',
                contribution: vepContributions.penrose || reportData.economic?.vep_projection * 0.10 || 0,
                metrics: {
                  coherence: layerMetrics.penrose?.coherence || 0,
                  decision_entropy: layerMetrics.penrose?.decision_entropy || 0,
                  collapse_readiness: layerMetrics.penrose?.collapse_readiness || 0,
                },
                description: LAYER_CONFIG.penrose.description,
                scientist: LAYER_CONFIG.penrose.scientist,
              },
            ];

            setData({
              section: selectedSection,
              timestamp: reportData.timestamp || new Date().toISOString(),
              layers,
              total_vep: reportData.economic?.vep_projection || 0,
              overall_status: reportData.validation?.status === 'validated' ? 'optimal' : 'warning',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching framework data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSection]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const waterfallOptions: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
        colors: {
          ranges: [
            { from: 0, to: 100000000, color: '#06b6d4' }
          ]
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `$${(val / 1000000).toFixed(1)}M`,
      style: { colors: ['#fff'], fontSize: '11px' }
    },
    xaxis: {
      categories: data?.layers.map(l => l.name) || [],
      labels: { style: { colors: '#9ca3af', fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${(val / 1000000).toFixed(0)}M`,
        style: { colors: '#9ca3af' }
      }
    },
    colors: Object.values(LAYER_CONFIG).map(c => c.color),
    grid: { borderColor: '#374151' },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => formatCurrency(val) }
    }
  };

  const waterfallSeries = [{
    name: 'Contribución VEP',
    data: data?.layers.map(l => l.contribution) || []
  }];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-industrial-light p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="ml-3 text-slate-400">Cargando Framework Map...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-red-500/50 p-8">
        <div className="flex items-center text-red-400">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <span>Sin datos del framework disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-10 h-10 text-purple-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                C²AI Framework Map
                <span className="text-sm font-normal text-slate-400">5-Layer Architecture</span>
              </h2>
              <p className="text-slate-400">Quantum-Thermodynamic Decision Framework - {selectedSection}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-medium ${
            data.overall_status === 'optimal' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {data.overall_status === 'optimal' ? 'SISTEMA ÓPTIMO' : 'REQUIERE ATENCIÓN'}
          </div>
        </div>
      </div>

      {/* 5-Layer Flow Diagram */}
      <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Arquitectura 5-Layer</h3>
        </div>

        <div className="flex items-center justify-between">
          {data.layers.map((layer, idx) => {
            const config = LAYER_CONFIG[layer.name.toLowerCase()];
            const isSelected = selectedLayer === layer.name.toLowerCase();
            
            return (
              <React.Fragment key={layer.name}>
                <div 
                  className={`flex-1 cursor-pointer transition-all ${isSelected ? 'scale-105' : 'hover:scale-102'}`}
                  onClick={() => setSelectedLayer(isSelected ? null : layer.name.toLowerCase())}
                >
                  <div 
                    className={`rounded-xl p-4 border-2 transition-all ${
                      layer.status === 'active' 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-yellow-500/50 bg-yellow-500/10'
                    } ${isSelected ? 'ring-2 ring-offset-2 ring-offset-industrial-dark' : ''}`}
                    style={{ borderColor: isSelected ? config.color : undefined }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}30`, color: config.color }}
                      >
                        {layer.icon}
                      </div>
                      {layer.status === 'active' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    
                    <div className="text-white font-bold text-lg">{layer.name}</div>
                    <div className="text-xs text-slate-500">{config.scientist}</div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="text-xs text-slate-400">Contribución VEP</div>
                      <div className="text-lg font-bold" style={{ color: config.color }}>
                        {formatCurrency(layer.contribution)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {idx < data.layers.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-600 mx-2 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Layer Details */}
        {selectedLayer && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            {data.layers.filter(l => l.name.toLowerCase() === selectedLayer).map(layer => {
              const config = LAYER_CONFIG[selectedLayer];
              return (
                <div key={layer.name}>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}30`, color: config.color }}
                    >
                      {layer.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold">{layer.name} Layer</div>
                      <div className="text-sm text-slate-400">{config.scientist}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{layer.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(layer.metrics).map(([key, value]) => (
                      <div key={key} className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1">
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {typeof value === 'number' && value <= 1 
                            ? `${(value * 100).toFixed(1)}%` 
                            : value.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contribution Waterfall */}
      <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Contribución por Capa al VEP</h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">VEP Total Proyectado</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(data.total_vep)}</div>
          </div>
        </div>
        
        <Chart 
          options={waterfallOptions} 
          series={waterfallSeries} 
          type="bar" 
          height={280} 
        />
      </div>

      {/* Legend */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <HelpCircle className="w-4 h-4" />
          <span className="font-medium">Científicos del Framework C²AI</span>
        </div>
        <div className="grid grid-cols-5 gap-4 text-xs">
          {Object.entries(LAYER_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-slate-300">{config.scientist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default C2AIFrameworkMap;
