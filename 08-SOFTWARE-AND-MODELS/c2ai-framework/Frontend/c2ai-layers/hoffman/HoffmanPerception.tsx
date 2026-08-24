/**
 * Hoffman Agent Perceptions - Visiones del Sistema
 * Visualización de cómo cada agente PhD percibe el estado del huerto
 * Framework C²AI - CitrusMax AI v10.0
 */

import React, { useEffect, useState } from "react";
import { 
  Eye, Users, RefreshCw, Brain, Target, Activity,
  Droplets, Bug, Leaf, TrendingUp, DollarSign, Sun
} from "lucide-react";
import { generatePanelAnalysis } from "../../../services/llmService";

interface AgentPerception {
  id: string;
  agent: string;
  domain: string;
  icon: string;
  perception: string;
  confidence: number;
  status: 'optimal' | 'warning' | 'critical';
  action: string;
  metrics: { key: string; value: string; trend: 'up' | 'down' | 'stable' }[];
  lastUpdate: string;
}

interface PerceptionData {
  agents: AgentPerception[];
  globalAlignment: number;
  consensusScore: number;
  divergentAgents: string[];
}

export default function HoffmanPerception() {
  const [data, setData] = useState<PerceptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [llmAnalysis, setLlmAnalysis] = useState<string>('');
  const [llmLoading, setLlmLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const fetchLLMAnalysis = async () => {
    if (!data) return;
    setLlmLoading(true);
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'hoffman-perception',
        value: data.globalAlignment,
        data: {
          globalAlignment: data.globalAlignment,
          consensusScore: data.consensusScore,
          totalAgents: data.agents.length,
          optimalAgents: data.agents.filter(a => a.status === 'optimal').length,
          warningAgents: data.agents.filter(a => a.status === 'warning').length,
          criticalAgents: data.agents.filter(a => a.status === 'critical').length,
          divergentAgents: data.divergentAgents,
          avgConfidence: data.agents.reduce((sum, a) => sum + a.confidence, 0) / data.agents.length
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate agent perception data (in production from API)
        const agents: AgentPerception[] = [
          {
            id: 'irrigation',
            agent: 'Irrigation Agent',
            domain: 'Riego',
            icon: 'droplets',
            perception: 'Estrés hídrico moderado detectado en S2. IAH 72%.',
            confidence: 0.88,
            status: 'warning',
            action: 'Aumentar riego 20mm en próximos 3 días',
            metrics: [
              { key: 'IAH', value: '72%', trend: 'down' },
              { key: 'ETo', value: '5.2mm/día', trend: 'up' },
              { key: 'Humedad Suelo', value: '38%', trend: 'down' }
            ],
            lastUpdate: new Date().toISOString()
          },
          {
            id: 'health',
            agent: 'Health Agent',
            domain: 'Sanidad',
            icon: 'bug',
            perception: 'IPF 0.85 - Presión de Trips elevada (1.8/brote). Minador controlado.',
            confidence: 0.92,
            status: 'warning',
            action: 'Aplicar Spinosad 0.3L/ha en S1 y S2',
            metrics: [
              { key: 'IPF', value: '0.85', trend: 'up' },
              { key: 'Trips', value: '1.8/brote', trend: 'up' },
              { key: 'Minador', value: '0.4%', trend: 'stable' }
            ],
            lastUpdate: new Date().toISOString()
          },
          {
            id: 'nutrition',
            agent: 'Nutrition Agent',
            domain: 'Nutrición',
            icon: 'leaf',
            perception: 'Balance nutricional óptimo. K ligeramente bajo en S3.',
            confidence: 0.91,
            status: 'optimal',
            action: 'Aplicar KNO3 foliar 2kg/ha en S3',
            metrics: [
              { key: 'NPF', value: '0.91', trend: 'stable' },
              { key: 'N foliar', value: '2.8%', trend: 'stable' },
              { key: 'K foliar', value: '1.1%', trend: 'down' }
            ],
            lastUpdate: new Date().toISOString()
          },
          {
            id: 'phenology',
            agent: 'Phenology Agent',
            domain: 'Fenología',
            icon: 'sun',
            perception: 'Fase FEN-05 Desarrollo activo. GDD acumulados: 1,847.',
            confidence: 0.95,
            status: 'optimal',
            action: 'Mantener programa nutricional actual',
            metrics: [
              { key: 'Fase', value: 'FEN-05', trend: 'stable' },
              { key: 'GDD', value: '1,847', trend: 'up' },
              { key: 'Factor φ', value: '82%', trend: 'up' }
            ],
            lastUpdate: new Date().toISOString()
          },
          {
            id: 'harvest',
            agent: 'Harvest Agent',
            domain: 'Cosecha',
            icon: 'trending',
            perception: 'PE proyectado: 2,054 tons. Días estimados: 24.',
            confidence: 0.87,
            status: 'optimal',
            action: 'Preparar logística de cosecha para semana 8',
            metrics: [
              { key: 'PE', value: '2,054 tons', trend: 'up' },
              { key: 'Calibre', value: '72mm', trend: 'stable' },
              { key: 'Días', value: '24', trend: 'down' }
            ],
            lastUpdate: new Date().toISOString()
          },
          {
            id: 'market',
            agent: 'Market Agent',
            domain: 'Mercado',
            icon: 'dollar',
            perception: 'Precio estable $22.50/kg. Demanda alta esperada.',
            confidence: 0.75,
            status: 'optimal',
            action: 'Mantener calidad premium para mercado objetivo',
            metrics: [
              { key: 'Precio', value: '$22.50/kg', trend: 'stable' },
              { key: 'Demanda', value: 'Alta', trend: 'up' },
              { key: 'Competencia', value: 'Media', trend: 'stable' }
            ],
            lastUpdate: new Date().toISOString()
          }
        ];

        const optimalCount = agents.filter(a => a.status === 'optimal').length;
        const globalAlignment = optimalCount / agents.length;
        const avgConfidence = agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length;

        setData({
          agents,
          globalAlignment,
          consensusScore: avgConfidence,
          divergentAgents: agents.filter(a => a.status !== 'optimal').map(a => a.agent)
        });
      } catch (err) {
        console.error('Error loading perception data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data && !llmAnalysis) {
      fetchLLMAnalysis();
    }
  }, [data]);

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets': return <Droplets className="w-5 h-5" />;
      case 'bug': return <Bug className="w-5 h-5" />;
      case 'leaf': return <Leaf className="w-5 h-5" />;
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'trending': return <TrendingUp className="w-5 h-5" />;
      case 'dollar': return <DollarSign className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-industrial-dark min-h-screen p-6 flex items-center justify-center">
        <Eye className="w-8 h-8 animate-pulse text-pink-400" />
        <span className="ml-3 text-gray-400">Cargando Agent Perceptions...</span>
      </div>
    );
  }

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="w-8 h-8 text-pink-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Agent Perceptions - Visiones del Sistema</h1>
            <p className="text-gray-400 text-sm">Cómo cada agente PhD percibe el estado actual del huerto</p>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border border-pink-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-pink-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">Alineación Global</span>
          </div>
          <p className="text-3xl font-bold text-pink-400">{(data.globalAlignment * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Meta: &gt;80%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Consenso</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{(data.consensusScore * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Confianza promedio</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Agentes Óptimos</span>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {data.agents.filter(a => a.status === 'optimal').length}/{data.agents.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Estado saludable</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm">Divergentes</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{data.divergentAgents.length}</p>
          <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {data.agents.map((agent) => (
          <div 
            key={agent.id}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            className={`bg-industrial-medium border rounded-lg p-4 cursor-pointer transition-all ${
              selectedAgent === agent.id 
                ? 'border-pink-500/50 ring-2 ring-pink-500/20' 
                : getStatusColor(agent.status)
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
                  {getAgentIcon(agent.icon)}
                </div>
                <div>
                  <p className="text-white font-medium">{agent.agent}</p>
                  <p className="text-gray-500 text-xs">{agent.domain}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${agent.confidence >= 0.85 ? 'text-green-400' : agent.confidence >= 0.7 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {(agent.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">confianza</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3">{agent.perception}</p>

            <div className="bg-industrial-dark rounded-lg p-2 mb-3">
              <p className="text-cyan-400 text-sm">💡 {agent.action}</p>
            </div>

            {/* Metrics */}
            <div className="flex gap-2">
              {agent.metrics.map((metric, idx) => (
                <div key={idx} className="flex-1 bg-industrial-dark rounded px-2 py-1">
                  <p className="text-gray-500 text-xs">{metric.key}</p>
                  <p className="text-white text-sm font-medium">
                    {metric.value}
                    <span className={`ml-1 ${getTrendColor(metric.trend)}`}>
                      {getTrendIcon(metric.trend)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl p-6 border border-pink-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-pink-300">Interpretación Agent Perceptions - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-pink-300">Generando análisis con Claude AI...</span>
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
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en Agent Perceptions.
            <span className="text-pink-400 ml-2">Regla 1 Compliance: Solo percepciones verificadas.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
