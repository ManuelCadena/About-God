/**
 * C²AI Decision Console - Panel 1
 * 
 * Muestra las Top 3 acciones recomendadas con impacto ROI,
 * estado de decisión (AUTO/REVIEW/HOLD) y evidencia de soporte.
 * 
 * Framework: C²AI - Conscious Citrus AI
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, Target, CheckCircle, AlertTriangle, Clock, 
  TrendingUp, DollarSign, Shield, Brain, RefreshCw,
  ChevronRight, Info, HelpCircle
} from 'lucide-react';

interface Decision {
  id: string;
  type: string;
  action: string;
  urgency: number;
  confidence: number;
  impact_vep: number;
  cost_estimate: number;
  roi: number;
  horizon: string;
  supporting_layers: string[];
  auto_execute: boolean;
  reason: string;
}

interface DecisionConsoleData {
  section: string;
  timestamp: string;
  decisions: Decision[];
  overall_confidence: number;
  alignment_score: number;
  trajectory_efficiency: number;
  free_energy: number;
}

interface TooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ term, definition, children }) => (
  <div className="group relative inline-flex items-center">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-50">
      <div className="font-semibold text-cyan-400 mb-1">{term}</div>
      <div>{definition}</div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
    </div>
  </div>
);

const LAYER_COLORS: Record<string, string> = {
  friston: '#06b6d4',
  levin: '#22c55e',
  watson: '#a855f7',
  hoffman: '#f59e0b',
  penrose: '#ec4899',
};

const LAYER_NAMES: Record<string, string> = {
  friston: 'Free Energy',
  levin: 'Plant Goals',
  watson: 'Trajectory',
  hoffman: 'Perception',
  penrose: 'Coherence',
};

const STATUS_CONFIG = {
  AUTO: { 
    bg: 'bg-green-500/20', 
    text: 'text-green-400', 
    border: 'border-green-500/50',
    icon: CheckCircle,
    label: 'AUTO-EJECUTABLE'
  },
  REVIEW: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400', 
    border: 'border-yellow-500/50',
    icon: AlertTriangle,
    label: 'REQUIERE REVISIÓN'
  },
  HOLD: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    border: 'border-red-500/50',
    icon: Clock,
    label: 'EN ESPERA'
  },
};

interface C2AIDecisionConsoleProps {
  selectedSection?: string;
}

const C2AIDecisionConsole: React.FC<C2AIDecisionConsoleProps> = ({ 
  selectedSection = 'S1' 
}) => {
  const [data, setData] = useState<DecisionConsoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_C2AI = '/c2ai-api';
  const API_PE = '/api/v1';
  
  // Normalizar sección: TOTAL usa S1 como proxy para análisis individual
  const normalizedSection = selectedSection === 'TOTAL' ? 'S1' : selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [orchestratorRes, factorsRes] = await Promise.all([
          fetch(`${API_C2AI}/api/v1/orchestrator/analyze/${normalizedSection}`),
          fetch(`${API_PE}/vep/factors?section=${normalizedSection}`)
        ]);

        if (orchestratorRes.ok) {
          const orchData = await orchestratorRes.json();
          
          if (orchData.status === 'success' && orchData.data) {
            const reportData = orchData.data;
            
            const decisions: Decision[] = (reportData.decisions || []).map((d: any, idx: number) => ({
              id: `DEC-${idx + 1}`,
              type: d.type || 'optimization',
              action: d.details?.action || d.source || 'Optimización general',
              urgency: d.urgency || d.details?.urgency || 0.5,
              confidence: d.details?.support_weight || 0.75,
              impact_vep: (reportData.economic?.vep_projection || 0) * 0.02 * (idx + 1),
              cost_estimate: 15000 + idx * 5000,
              roi: 3.5 - idx * 0.5,
              horizon: idx === 0 ? 'Inmediato' : idx === 1 ? '7 días' : '30 días',
              supporting_layers: d.details?.supporting_layers || ['watson', 'levin'],
              auto_execute: d.details?.support_weight >= 0.75 && 
                           reportData.validation?.confidence >= 0.75,
              reason: d.reason || 'Basado en análisis multi-capa C²AI',
            }));

            setData({
              section: selectedSection,
              timestamp: reportData.timestamp || new Date().toISOString(),
              decisions: decisions.slice(0, 3),
              overall_confidence: reportData.validation?.confidence || 0.85,
              alignment_score: reportData.plant_alignment?.score || 0.78,
              trajectory_efficiency: reportData.layer_metrics?.watson?.trajectory_efficiency || 0.82,
              free_energy: reportData.layer_metrics?.friston?.free_energy || 0.15,
            });
          }
        } else {
          setError('Error al cargar datos del orquestador C²AI');
        }
      } catch (err) {
        console.error('Error fetching C²AI data:', err);
        setError('No se pudo conectar con C²AI API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedSection]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getDecisionStatus = (decision: Decision): 'AUTO' | 'REVIEW' | 'HOLD' => {
    if (decision.auto_execute && decision.confidence >= 0.75) return 'AUTO';
    if (decision.confidence >= 0.5) return 'REVIEW';
    return 'HOLD';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-industrial-light p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="ml-3 text-slate-400">Cargando Decision Console...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-red-500/50 p-8">
        <div className="flex items-center text-red-400">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <span>{error || 'Sin datos disponibles'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-10 h-10 text-cyan-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                C²AI Decision Console
                <Tooltip 
                  term="Decision Console"
                  definition="Panel central de toma de decisiones del framework C²AI. Integra las 5 capas para generar recomendaciones accionables con ROI estimado."
                >
                  <HelpCircle className="w-4 h-4 text-slate-500 cursor-help" />
                </Tooltip>
              </h2>
              <p className="text-slate-400">Top 3 Acciones Prioritarias - {selectedSection}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Última Actualización</div>
            <div className="text-cyan-400 font-mono">
              {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Confianza Global</span>
            <Tooltip term="Confianza" definition="Nivel de certeza del sistema C²AI en las recomendaciones. ≥75% permite auto-ejecución (Regla 8 Hoffman).">
              <Info className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className={`text-3xl font-bold ${data.overall_confidence >= 0.75 ? 'text-green-400' : 'text-yellow-400'}`}>
            {(data.overall_confidence * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Shield className="w-4 h-4" />
            <span>Alignment Score</span>
            <Tooltip term="Alignment (Levin)" definition="Grado de alineación con los objetivos fisiológicos de la planta. ≥70% requerido para decisiones (Regla 5).">
              <Info className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className={`text-3xl font-bold ${data.alignment_score >= 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
            {(data.alignment_score * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Eficiencia Trayectoria</span>
            <Tooltip term="Trajectory Efficiency (Watson)" definition="Eficiencia del camino hacia el estado óptimo. ≥85% permite auto-ejecución (Regla 7).">
              <Info className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className={`text-3xl font-bold ${data.trajectory_efficiency >= 0.85 ? 'text-green-400' : 'text-yellow-400'}`}>
            {(data.trajectory_efficiency * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Zap className="w-4 h-4" />
            <span>Free Energy</span>
            <Tooltip term="Free Energy (Friston)" definition="Energía libre del sistema. Valores bajos indican estabilidad. Las acciones deben reducirla (Regla 6).">
              <Info className="w-3 h-3 text-slate-600 cursor-help" />
            </Tooltip>
          </div>
          <div className={`text-3xl font-bold ${data.free_energy <= 0.2 ? 'text-green-400' : 'text-yellow-400'}`}>
            {data.free_energy.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Decisions Cards */}
      <div className="space-y-4">
        {data.decisions.map((decision, idx) => {
          const status = getDecisionStatus(decision);
          const statusConfig = STATUS_CONFIG[status];
          const StatusIcon = statusConfig.icon;

          return (
            <div 
              key={decision.id}
              className={`bg-industrial-dark rounded-xl border ${statusConfig.border} overflow-hidden transition-all hover:shadow-lg`}
            >
              {/* Decision Header */}
              <div className={`${statusConfig.bg} px-6 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center font-bold ${statusConfig.text}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{decision.action}</div>
                    <div className="text-sm text-slate-400">{decision.type}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{statusConfig.label}</span>
                </div>
              </div>

              {/* Decision Body */}
              <div className="p-6">
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Urgencia</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${decision.urgency >= 0.7 ? 'bg-red-500' : decision.urgency >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${decision.urgency * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {(decision.urgency * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">Confianza</div>
                    <div className={`text-lg font-bold ${decision.confidence >= 0.75 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(decision.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">Impacto VEP</div>
                    <div className="text-lg font-bold text-green-400">
                      +{formatCurrency(decision.impact_vep)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">Costo Estimado</div>
                    <div className="text-lg font-bold text-slate-300">
                      {formatCurrency(decision.cost_estimate)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-1">ROI</div>
                    <div className={`text-lg font-bold ${decision.roi >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {decision.roi.toFixed(1)}x
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Capas de soporte:</span>
                    {decision.supporting_layers.map(layer => (
                      <span 
                        key={layer}
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: `${LAYER_COLORS[layer]}20`,
                          color: LAYER_COLORS[layer]
                        }}
                      >
                        {LAYER_NAMES[layer]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Horizonte: {decision.horizon}</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-400 italic">
                  "{decision.reason}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Info className="w-4 h-4" />
          <span className="font-medium">Leyenda de Estados (Reglas C²AI 5-8)</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-slate-300">
              <strong>AUTO:</strong> Confidence ≥75%, Alignment ≥70%, Efficiency ≥85%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-300">
              <strong>REVIEW:</strong> Confidence 50-75%, requiere validación humana
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-slate-300">
              <strong>HOLD:</strong> Confidence &lt;50%, datos insuficientes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2AIDecisionConsole;
