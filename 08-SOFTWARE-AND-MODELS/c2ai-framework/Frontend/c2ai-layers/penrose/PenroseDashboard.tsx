import React, { useEffect, useState } from "react";
import { Sparkles, Waves, Activity, Zap, Brain, Loader2 } from "lucide-react";

export default function PenroseDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("/c2ai-api/api/v1/friston/section/S1"),
          fetch("/c2ai-api/api/v1/levin/alignment/S1"),
          fetch("/c2ai-api/api/v1/watson/section/S1")
        ]);
        const [friston, levin, watson] = await Promise.all(responses.map(r => r.json()));
        
        // Compute Penrose quantum coherence metrics from all layers
        const fristonCoherence = Math.max(0, 1 - (friston.data?.free_energy || 25) / 100);
        const levinCoherence = levin.data?.alignment_score || 0.7;
        const watsonEfficiency = watson.data?.trajectory_efficiency || 0.5;
        
        const quantumCoherence = (fristonCoherence * 0.3 + levinCoherence * 0.4 + watsonEfficiency * 0.3);
        const decisionEntropy = (friston.data?.free_energy || 25) / 100;
        const collapseReadiness = quantumCoherence > 0.7 ? 0.92 : quantumCoherence > 0.5 ? 0.75 : 0.5;
        const consciousnessIndex = (quantumCoherence + collapseReadiness) / 2;
        
        setData({
          quantumCoherence,
          decisionEntropy,
          collapseReadiness,
          consciousnessIndex,
          layerContributions: [
            { layer: "Friston", coherence: fristonCoherence, weight: 0.30 },
            { layer: "Levin", coherence: levinCoherence, weight: 0.40 },
            { layer: "Watson", coherence: watsonEfficiency, weight: 0.30 }
          ]
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="bg-industrial-dark min-h-screen p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>;
  if (!data) return null;

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Penrose Layer - Quantum Decision Making</h1>
          <p className="text-gray-400 text-sm">Coherencia cuántica y preparación para decisiones óptimas • Datos en vivo</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Waves className="w-5 h-5" />
            <span className="text-sm">Quantum Coherence</span>
          </div>
          <p className={`text-3xl font-bold ${data.quantumCoherence > 0.8 ? "text-green-400" : "text-amber-400"}`}>
            {(data.quantumCoherence * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &gt;80%</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Decision Entropy</span>
          </div>
          <p className={`text-3xl font-bold ${data.decisionEntropy < 0.3 ? "text-green-400" : "text-blue-400"}`}>
            {data.decisionEntropy.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &lt;0.30</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Collapse Readiness</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{(data.collapseReadiness * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Meta: &gt;90%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm">Consciousness Index</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{(data.consciousnessIndex * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Φ Integrado</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Coherencia por Capa</h2>
        <div className="space-y-4">
          {data.layerContributions.map((layer: any, idx: number) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{layer.layer} Layer</span>
                <span className="text-amber-400">{(layer.coherence * 100).toFixed(0)}% (peso: {layer.weight})</span>
              </div>
              <div className="bg-industrial-dark rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400" style={{ width: `${layer.coherence * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
