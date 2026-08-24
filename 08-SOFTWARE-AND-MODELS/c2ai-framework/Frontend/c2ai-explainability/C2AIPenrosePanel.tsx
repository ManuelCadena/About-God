/**
 * C²AI Penrose Panel - Quantum Coherence Orchestrator
 * Proxy de coherencia cuántica para calidad de decisión
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Atom, Activity, Zap, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';

interface PenroseData {
  coherence: number;
  decision_entropy: number;
  collapse_readiness: number;
  oscillation_frequency: number;
  quantum_state: string;
  decision_quality: string;
}

export default function C2AIPenrosePanel({ selectedSection }: { selectedSection: string }) {
  const [data, setData] = useState<PenroseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulated data - in production would fetch from API
      setData({
        coherence: 0.68,
        decision_entropy: 0.667,
        collapse_readiness: 0.181,
        oscillation_frequency: 40,
        quantum_state: 'superposition',
        decision_quality: 'high'
      });
      setLoading(false);
    };
    fetchData();
  }, [selectedSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-industrial-dark">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-gray-400">Cargando Penrose Coherence...</span>
      </div>
    );
  }

  const getCoherenceColor = (value: number) => {
    if (value >= 0.7) return 'text-green-400';
    if (value >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Atom className="w-8 h-8 text-cyan-400" />
            C²AI Penrose - Quantum Coherence
          </h1>
          <p className="text-gray-400 mt-1">Proxy de coherencia @ 40Hz para calidad de decisión</p>
        </div>
      </div>

      {/* Coherence Gauge */}
      <div className="bg-industrial-medium border border-cyan-500/30 rounded-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-gray-400 mb-2">Coherencia Cuántica</p>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" fill="none" stroke="#374151" strokeWidth="12" />
              <circle 
                cx="96" cy="96" r="88" fill="none" 
                stroke={data?.coherence && data.coherence >= 0.7 ? '#22c55e' : data?.coherence && data.coherence >= 0.5 ? '#eab308' : '#ef4444'}
                strokeWidth="12"
                strokeDasharray={`${(data?.coherence || 0) * 553} 553`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-4xl font-bold ${getCoherenceColor(data?.coherence || 0)}`}>
                {((data?.coherence || 0) * 100).toFixed(0)}%
              </span>
              <span className="text-gray-500 text-sm">coherencia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Frecuencia</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.oscillation_frequency} Hz</p>
          <p className="text-xs text-gray-500">Gamma oscillation</p>
        </div>

        <div className="bg-industrial-medium border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Entropía</span>
          </div>
          <p className="text-3xl font-bold text-white">{data?.decision_entropy.toFixed(3)}</p>
          <p className="text-xs text-gray-500">Decision entropy</p>
        </div>

        <div className="bg-industrial-medium border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Collapse Ready</span>
          </div>
          <p className="text-3xl font-bold text-white">{((data?.collapse_readiness || 0) * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500">Readiness to decide</p>
        </div>

        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Atom className="w-5 h-5" />
            <span className="text-sm">Estado</span>
          </div>
          <p className="text-xl font-bold text-white capitalize">{data?.quantum_state}</p>
          <p className="text-xs text-gray-500">Quantum state</p>
        </div>
      </div>

      {/* Decision Quality */}
      <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Calidad de Decisión</h2>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            data?.decision_quality === 'high' ? 'bg-green-500/20' : 
            data?.decision_quality === 'medium' ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`}>
            {data?.decision_quality === 'high' ? (
              <Zap className="w-8 h-8 text-green-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            )}
          </div>
          <div>
            <p className="text-white font-medium capitalize">{data?.decision_quality} Quality</p>
            <p className="text-gray-400 text-sm">
              {data?.decision_quality === 'high' 
                ? 'Sistema en estado óptimo para tomar decisiones'
                : 'Considerar más datos antes de decidir'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
