import React, { useState, useEffect } from 'react';
import { 
  Brain, Activity, Target, TrendingUp, Layers, AlertTriangle, 
  CheckCircle, Zap, Compass, Eye, Network, RefreshCw 
} from 'lucide-react';

interface LayerMetrics {
  friston: {
    free_energy: number;
    kl_divergence: number;
    urgency: number;
  };
  levin: {
    current_goal: string;
    alignment_score: number;
    goal_progress: number;
  };
  watson: {
    trajectory_efficiency: number;
    energy_gap: number;
    days_to_optimal: number;
  };
  hoffman: {
    overall_confidence: number;
    perceptions_count: number;
    conflicts_count: number;
  };
  penrose: {
    coherence: number;
    decision_entropy: number;
    collapse_readiness: number;
  };
}

interface C2AIData {
  section: string;
  timestamp: string;
  phenology: string;
  plant_alignment: number;
  vep_projection: number;
  confidence: number;
  coherence: number;
  status: string;
  top_decision: {
    type: string;
    details: {
      urgency: number;
      support_weight: number;
      supporting_layers: string[];
    };
    auto_execute: boolean;
  } | null;
  risk_count: number;
  alert_count: number;
}

interface C2AIFullData {
  timestamp: string;
  period: string;
  phenology: { state: string; gdd: number };
  layer_metrics: LayerMetrics;
  vep_contributions: Record<string, number>;
  decisions: Array<{
    type: string;
    source: string;
    urgency?: number;
    reason?: string;
  }>;
  plant_alignment: { score: number; details: any };
  economic: { vep_projection: number; impact: any };
  risks: Array<{ level: string; source: string; description: string }>;
  alerts: string[];
  validation: { confidence: number; coherence: number; status: string };
}

const LAYER_ICONS: Record<string, React.ReactNode> = {
  friston: <Zap className="w-4 h-4" />,
  levin: <Target className="w-4 h-4" />,
  watson: <Compass className="w-4 h-4" />,
  hoffman: <Eye className="w-4 h-4" />,
  penrose: <Network className="w-4 h-4" />,
};

const LAYER_NAMES: Record<string, string> = {
  friston: 'Free Energy',
  levin: 'Plant Goals',
  watson: 'Trajectory',
  hoffman: 'Perception',
  penrose: 'Coherence',
};

const C2AIPanel: React.FC = () => {
  const [quickData, setQuickData] = useState<Record<string, C2AIData>>({});
  const [fullData, setFullData] = useState<C2AIFullData | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('S1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const API_BASE = '/c2ai-api';
  const FETCH_TIMEOUT = 120000; // 2 minutes timeout for slow endpoints

  const fetchWithTimeout = async (url: string, timeout: number = FETCH_TIMEOUT): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const fetchQuickData = async () => {
    try {
      const results: Record<string, C2AIData> = {};
      // Use fast cached endpoint for immediate response
      const promises = ['S1', 'S2', 'S3'].map(async (section) => {
        try {
          // Try cached endpoint first (instant response)
          const response = await fetchWithTimeout(`${API_BASE}/api/v1/orchestrator/cached/${section}`, 5000);
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              results[section] = data.data;
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch cached ${section}:`, err);
        }
      });
      await Promise.all(promises);
      
      if (Object.keys(results).length > 0) {
        setQuickData(results);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError('C²AI API is loading data... Please wait.');
      }
    } catch (err) {
      setError('Error connecting to C²AI API');
      console.error('C²AI API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullData = async (section: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/v1/orchestrator/analyze/${section}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setFullData(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching full analysis:', err);
    }
  };

  useEffect(() => {
    fetchQuickData();
    const interval = setInterval(fetchQuickData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchFullData(selectedSection);
    }
  }, [selectedSection]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'text-green-500';
      case 'needs_review': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.75) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatCurrency = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    // Para valores mayores a 1M, mostrar en millones con max 2 decimales
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Formatear números con máximo 2 decimales
  const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toFixed(Math.min(decimals, 2));
  };
  
  const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    const pct = value > 1 ? value : value * 100;
    return `${pct.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="ml-3 text-slate-400">Loading C²AI Framework...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-red-500/50">
        <div className="flex items-center text-red-400">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <span>{error}</span>
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
              <h2 className="text-2xl font-bold text-white">C²AI - Conscious Citrus AI</h2>
              <p className="text-slate-400">5-Layer Quantum-Thermodynamic Framework</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Last Update</div>
            <div className="text-cyan-400">
              {lastUpdate?.toLocaleTimeString() || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Section Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        {['S1', 'S2', 'S3'].map((section) => {
          const data = quickData[section];
          if (!data) return null;
          
          return (
            <div
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`bg-slate-800 rounded-xl p-4 border cursor-pointer transition-all ${
                selectedSection === section 
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white">{section}</h3>
                <span className={`text-sm ${getStatusColor(data.status)}`}>
                  {data.status === 'validated' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Phenology</span>
                  <span className="text-white font-medium">{data.phenology}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Alignment</span>
                  <span className="text-cyan-400 font-medium">
                    {(data.plant_alignment * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">VEP</span>
                  <span className="text-green-400 font-medium">
                    {formatCurrency(data.vep_projection)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Coherence</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
                      <div 
                        className={`h-full ${getConfidenceColor(data.coherence)}`}
                        style={{ width: `${data.coherence * 100}%` }}
                      />
                    </div>
                    <span className="text-white">{(data.coherence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {data.top_decision && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Top Decision</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-400">{data.top_decision.type}</span>
                    {data.top_decision.auto_execute && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        AUTO
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      {fullData && (
        <div className="grid grid-cols-2 gap-6">
          {/* Layer Metrics */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-purple-400" />
              5-Layer Analysis
            </h3>
            
            <div className="space-y-3">
              {Object.entries(fullData.layer_metrics).map(([layer, metrics]) => (
                <div key={layer} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-slate-300">
                      {LAYER_ICONS[layer]}
                      <span className="ml-2 font-medium">{LAYER_NAMES[layer]}</span>
                    </div>
                    <span className="text-xs text-slate-500 uppercase">{layer}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {Object.entries(metrics).slice(0, 3).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-slate-500 text-xs">{key.replace(/_/g, ' ')}</div>
                        <div className="text-white">
                          {typeof value === 'number' 
                            ? value > 1 ? value.toFixed(0) : (value * 100).toFixed(1) + '%'
                            : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions & Risks */}
          <div className="space-y-4">
            {/* VEP Contributions */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                VEP by Layer
              </h3>
              <div className="space-y-2">
                {Object.entries(fullData.vep_contributions).map(([layer, value]) => (
                  <div key={layer} className="flex items-center justify-between">
                    <span className="text-slate-400 capitalize">{layer}</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(value)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Total VEP</span>
                    <span className="text-green-400 font-bold text-lg">
                      {formatCurrency(fullData.economic.vep_projection)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risks */}
            {fullData.risks.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-5 border border-red-500/30">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Active Risks ({fullData.risks.length})
                </h3>
                <div className="space-y-2">
                  {fullData.risks.map((risk, idx) => (
                    <div key={idx} className="bg-red-900/20 rounded p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 uppercase text-xs">{risk.level}</span>
                        <span className="text-slate-500 text-xs">{risk.source}</span>
                      </div>
                      <div className="text-slate-300 mt-1">{risk.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Status */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                Validation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Confidence</div>
                  <div className="text-2xl font-bold text-white">
                    {(fullData.validation.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Coherence</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {(fullData.validation.coherence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className={`mt-3 text-center py-2 rounded ${
                fullData.validation.status === 'validated' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {fullData.validation.status === 'validated' ? 'VALIDATED' : 'NEEDS REVIEW'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default C2AIPanel;
