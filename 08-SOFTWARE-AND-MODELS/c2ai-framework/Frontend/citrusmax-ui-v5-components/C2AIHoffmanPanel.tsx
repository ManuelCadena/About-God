/**
 * C²AI Hoffman Panel - Kernel Reconstruction
 * Meta-MDP para resolución de conflictos entre agentes
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Network, AlertTriangle, CheckCircle, Loader2, RefreshCw, Brain, Zap } from 'lucide-react';

interface AgentPerception {
  agent: string;
  recommendation: string;
  confidence: number;
  priority: number;
}

interface HoffmanData {
  overall_confidence: number;
  perceptions: AgentPerception[];
  conflicts: { agents: string[]; resolution: string }[];
  kernel_state: string;
  reconstruction_score: number;
}

const C2AI_API = '/c2ai-api';

export default function C2AIHoffmanPanel({ selectedSection }: { selectedSection: string }) {
  const [data, setData] = useState<HoffmanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulated data - in production would fetch from API
      setData({
        overall_confidence: 0.85,
        perceptions: [
          { agent: 'Phenology', recommendation: 'Fase FEN-05 Desarrollo', confidence: 0.92, priority: 1 },
          { agent: 'Health', recommendation: 'Tratar Trips y Minador', confidence: 0.88, priority: 2 },
          { agent: 'Irrigation', recommendation: 'Riego 25mm/semana', confidence: 0.90, priority: 3 },
          { agent: 'Nutrition', recommendation: 'Aplicar K foliar', confidence: 0.85, priority: 4 },
          { agent: 'Harvest', recommendation: 'Cosecha en 24 días', confidence: 0.87, priority: 5 },
        ],
        conflicts: [
          { agents: ['Health', 'Nutrition'], resolution: 'Priorizar Health - plagas críticas' }
        ],
        kernel_state: 'stable',
        reconstruction_score: 0.91
      });
      setLoading(false);
    };
    fetchData();
  }, [selectedSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-industrial-dark">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3 text-gray-400">Cargando Hoffman Kernel...</span>
      </div>
    );
  }

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-purple-400" />
            C²AI Hoffman - Kernel Reconstruction
          </h1>
          <p className="text-gray-400 mt-1">Meta-MDP para resolución de conflictos entre 18 agentes</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm">Confianza Global</span>
          </div>
          <p className="text-3xl font-bold text-white">{((data?.overall_confidence || 0) * 100).toFixed(0)}%</p>
        </div>
        
        <div className="bg-industrial-medium border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Network className="w-5 h-5" />
            <span className="text-sm">Percepciones</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.perceptions.length || 0}</p>
        </div>

        <div className="bg-industrial-medium border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Conflictos</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.conflicts.length || 0}</p>
        </div>

        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Reconstruction</span>
          </div>
          <p className="text-3xl font-bold text-white">{((data?.reconstruction_score || 0) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Percepciones de Agentes */}
      <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Percepciones de Agentes</h2>
        <div className="space-y-3">
          {data?.perceptions.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-industrial-dark p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-bold">
                  {p.priority}
                </span>
                <div>
                  <p className="text-white font-medium">{p.agent}</p>
                  <p className="text-gray-400 text-sm">{p.recommendation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-purple-400 font-bold">{(p.confidence * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500">confianza</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflictos Resueltos */}
      {data?.conflicts && data.conflicts.length > 0 && (
        <div className="bg-industrial-medium border border-yellow-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Conflictos Resueltos
          </h2>
          {data.conflicts.map((c, idx) => (
            <div key={idx} className="bg-industrial-dark p-3 rounded-lg">
              <p className="text-white">Agentes: {c.agents.join(' vs ')}</p>
              <p className="text-green-400 text-sm mt-1">✓ {c.resolution}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
