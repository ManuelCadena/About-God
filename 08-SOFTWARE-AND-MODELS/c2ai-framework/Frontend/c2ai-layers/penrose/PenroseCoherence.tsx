import React from "react";
import { Waves, Activity } from "lucide-react";

export default function PenroseCoherence() {
  const coherenceData = {
    overall: 0.78,
    byLayer: [
      { layer: "Friston", coherence: 0.85, contribution: 0.25 },
      { layer: "Levin", coherence: 0.82, contribution: 0.20 },
      { layer: "Watson", coherence: 0.75, contribution: 0.30 },
      { layer: "Hoffman", coherence: 0.70, contribution: 0.25 },
    ]
  };

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Waves className="w-8 h-8 text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Quantum Coherence - Integración de Capas</h1>
          <p className="text-gray-400 text-sm">Medición de coherencia entre las 4 capas previas</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-lg p-6 mb-6 text-center">
        <p className="text-gray-400 mb-2">Coherencia Global del Sistema</p>
        <p className="text-6xl font-bold text-amber-400">{(coherenceData.overall * 100).toFixed(0)}%</p>
        <p className="text-sm text-gray-500 mt-2">Φ = Información Integrada</p>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Coherencia por Capa</h2>
        <div className="space-y-4">
          {coherenceData.byLayer.map((layer, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{layer.layer} Layer</span>
                <span className="text-amber-400">{(layer.coherence * 100).toFixed(0)}% (peso: {layer.contribution})</span>
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
