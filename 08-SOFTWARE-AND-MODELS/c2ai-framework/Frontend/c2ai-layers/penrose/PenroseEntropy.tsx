import React from "react";
import { Activity, TrendingDown } from "lucide-react";

export default function PenroseEntropy() {
  const entropyHistory = [
    { time: "00:00", entropy: 0.45 },
    { time: "06:00", entropy: 0.38 },
    { time: "12:00", entropy: 0.32 },
    { time: "18:00", entropy: 0.35 },
    { time: "Ahora", entropy: 0.35 },
  ];

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Decision Entropy - Incertidumbre del Sistema</h1>
          <p className="text-gray-400 text-sm">Menor entropía = mayor claridad en las decisiones</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
          <p className="text-gray-400 mb-2">Entropía Actual</p>
          <p className="text-5xl font-bold text-blue-400">0.35</p>
          <div className="flex items-center gap-2 mt-2 text-green-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm">-22% vs inicio del día</span>
          </div>
        </div>
        <div className="bg-industrial-medium border border-industrial-border rounded-lg p-6">
          <p className="text-gray-400 mb-2">Meta Óptima</p>
          <p className="text-5xl font-bold text-green-400">&lt;0.30</p>
          <p className="text-sm text-gray-500 mt-2">Decisiones claras y confiables</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Evolución de Entropía (Hoy)</h2>
        <div className="flex items-end justify-between h-32 px-4">
          {entropyHistory.map((point, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${point.entropy * 200}px` }}
              />
              <p className="text-xs text-gray-500 mt-2">{point.time}</p>
              <p className="text-xs text-blue-400">{point.entropy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
