import React, { useState, useEffect } from 'react';
import { Brain, Activity, AlertTriangle, CheckCircle, Target, DollarSign, TrendingUp, Layers } from 'lucide-react';

interface KernelSnapshot {
  kernel_type: string;
  symbol: string;
  value: number;
  band: string;
  trend: string;
  recommended_action: string;
  action_cost: number;
  priority: string;
}

interface CoherenceData {
  timestamp: string;
  section_id: string;
  coherence_score: number;
  kernels: KernelSnapshot[];
  conflicts: Array<{
    kernels: string[];
    description: string;
    severity: string;
    recommendation: string;
  }>;
  prioritized_actions: Array<{
    kernel: string;
    symbol: string;
    action: string;
    cost: number;
    priority: number;
    priority_name: string;
  }>;
  aggregate_pe_impact: number;
  budget_required: number;
  confidence: number;
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'ADECUADO': '#3b82f6',
  'CRÍTICO': '#ef4444',
  'DÉFICIT': '#f97316',
  'DEFICIENTE': '#f97316',
  'BAJO': '#f97316',
  'PICO': '#22c55e',
  'ALTA': '#3b82f6',
  'NORMAL': '#6b7280',
};

const PRIORITY_COLORS: Record<string, string> = {
  'CRITICAL': '#ef4444',
  'HIGH': '#f97316',
  'MEDIUM': '#eab308',
  'LOW': '#22c55e',
};

interface CoherencePanelProps {
  selectedSection?: string;
}

const CoherencePanel: React.FC<CoherencePanelProps> = ({ selectedSection = 'S1' }) => {
  const [data, setData] = useState<CoherenceData | null>(null);
  const [loading, setLoading] = useState(true);
  // Usar prop en lugar de estado interno
  const activeSection = selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/consciousness/coherence/report/${activeSection}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error('Error fetching coherence data:', error);
        setData({
          timestamp: new Date().toISOString(),
          section_id: activeSection,
          coherence_score: 0.847,
          kernels: [
            { kernel_type: 'ipf', symbol: 'IPF', value: 0.85, band: 'ADECUADO', trend: 'UP', recommended_action: 'Monitoreo', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'iah', symbol: 'IAH', value: 0.78, band: 'ADECUADO', trend: 'STABLE', recommended_action: 'Riego suplementario', action_cost: 250, priority: 'MEDIUM' },
            { kernel_type: 'npf', symbol: 'NPF', value: 0.82, band: 'ADECUADO', trend: 'UP', recommended_action: 'Ninguna', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'psi', symbol: 'ψ', value: 0.92, band: 'ÓPTIMO', trend: 'STABLE', recommended_action: 'Ninguna', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'phi', symbol: 'φ', value: 0.88, band: 'ADECUADO', trend: 'UP', recommended_action: 'Observar', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'market', symbol: 'Mkt', value: 0.72, band: 'NORMAL', trend: 'UP', recommended_action: 'Esperar', action_cost: 0, priority: 'MEDIUM' },
            { kernel_type: 'trim', symbol: 'TRIM', value: 0.82, band: 'ADECUADO', trend: 'STABLE', recommended_action: 'Ninguna', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'ind', symbol: 'IND', value: 0.88, band: 'ÓPTIMO', trend: 'STABLE', recommended_action: 'Observar', action_cost: 0, priority: 'LOW' },
            { kernel_type: 'lai', symbol: 'LAI', value: 0.82, band: 'ADECUADO', trend: 'UP', recommended_action: 'Ninguna', action_cost: 0, priority: 'LOW' },
          ],
          conflicts: [],
          prioritized_actions: [
            { kernel: 'iah', symbol: 'IAH', action: 'Riego suplementario', cost: 250, priority: 2, priority_name: 'MEDIUM' },
          ],
          aggregate_pe_impact: 2.4,
          budget_required: 250,
          confidence: 0.85
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return '#22c55e';
    if (score >= 0.70) return '#3b82f6';
    if (score >= 0.55) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Motor de Coherencia Global</h2>
            <p className="text-gray-500">Integración de todos los Kernels Hoffman-Levin</p>
          </div>
        </div>
        {/* Sección activa - selector controlado desde App.tsx */}
        <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">
          {activeSection}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="text-gray-500 text-sm">Score Coherencia</span>
              </div>
              <div 
                className="text-4xl font-bold"
                style={{ color: getScoreColor(data.coherence_score) }}
              >
                {(data.coherence_score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-gray-500 text-sm">Impacto PE</span>
              </div>
              <div className="text-4xl font-bold text-green-600">
                +{data.aggregate_pe_impact.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-gray-500 text-sm">Presupuesto</span>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                ${data.budget_required.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="text-gray-500 text-sm">Confianza</span>
              </div>
              <div className="text-4xl font-bold text-orange-600">
                {(data.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Estado de Kernels (9 factores)</h3>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
              {data.kernels.map(kernel => (
                <div 
                  key={kernel.kernel_type}
                  className="text-center p-3 rounded-xl bg-gray-50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: BAND_COLORS[kernel.band] || '#6b7280' }}
                  >
                    {kernel.symbol}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {(kernel.value * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="text-xs px-2 py-0.5 rounded-full mt-1 text-white inline-block"
                    style={{ backgroundColor: BAND_COLORS[kernel.band] || '#6b7280' }}
                  >
                    {kernel.band}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.prioritized_actions.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-xl font-bold">Acciones Priorizadas</h3>
              </div>
              <div className="space-y-3">
                {data.prioritized_actions.slice(0, 5).map((action, idx) => (
                  <div key={idx} className="bg-white/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: PRIORITY_COLORS[action.priority_name] }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{action.symbol}: {action.action}</div>
                        <div className="text-sm opacity-80">{action.priority_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${action.cost.toLocaleString()}/ha</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.conflicts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Conflictos Detectados</h3>
              </div>
              <div className="space-y-3">
                {data.conflicts.map((conflict, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4">
                    <div className="font-medium text-gray-800">{conflict.description}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Kernels: {conflict.kernels.join(', ')} | {conflict.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoherencePanel;
