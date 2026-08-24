import React from "react";
import { Zap, Activity, TrendingDown } from "lucide-react";

export default function FristonFreeEnergy() {
  const energyData = {
    current: 0.23,
    target: 0.15,
    trend: "decreasing",
    components: [
      { name: "Sensory (Datos Campo)", value: 0.08, weight: 0.3 },
      { name: "Model (Predicciones)", value: 0.10, weight: 0.4 },
      { name: "Action (Decisiones)", value: 0.05, weight: 0.3 },
    ]
  };

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Free Energy - Minimización Variacional</h1>
          <p className="text-gray-400 text-sm">Objetivo: Minimizar discrepancia modelo-realidad</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-6">
          <p className="text-gray-400 mb-2">Free Energy Actual</p>
          <p className="text-5xl font-bold text-purple-400">{energyData.current.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-2 text-green-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm">Tendencia descendente</span>
          </div>
        </div>
        <div className="bg-industrial-medium border border-industrial-border rounded-lg p-6">
          <p className="text-gray-400 mb-2">Meta Óptima</p>
          <p className="text-5xl font-bold text-green-400">{energyData.target.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Gap: {((energyData.current - energyData.target) * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Componentes de Energía Libre</h2>
        <div className="space-y-4">
          {energyData.components.map((comp, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{comp.name}</span>
                <span className="text-purple-400">{comp.value.toFixed(2)} (peso: {comp.weight})</span>
              </div>
              <div className="bg-industrial-dark rounded-full h-3 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${comp.value * 500}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
