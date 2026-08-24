import React from "react";
import { Waves, Activity } from "lucide-react";

export default function LevinBioelectric() {
  const sections = [
    { id: "S1", signal: 0.85, frequency: "40Hz", coherence: 0.92 },
    { id: "S2", signal: 0.72, frequency: "38Hz", coherence: 0.78 },
    { id: "S3", signal: 0.80, frequency: "41Hz", coherence: 0.88 },
  ];

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Waves className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Bioelectric Map - Señales del Huerto</h1>
          <p className="text-gray-400 text-sm">Mapeo de coherencia bioeléctrica entre secciones (conceptual)</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-3">{section.id}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Signal Strength</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-industrial-dark rounded-full h-2">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${section.signal * 100}%` }} />
                  </div>
                  <span className="text-cyan-400 text-sm">{(section.signal * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frequency:</span>
                <span className="text-cyan-400">{section.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Coherence:</span>
                <span className="text-green-400">{(section.coherence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-industrial-medium border border-cyan-500/30 rounded-lg p-4">
        <h2 className="text-lg font-bold text-cyan-400 mb-2">Nota: Sensores Bioeléctricos</h2>
        <p className="text-sm text-gray-300">
          Este panel muestra datos conceptuales. La implementación física de sensores bioeléctricos está planificada 
          según PLAN_SENSORES_BIOELECTRICOS.md con un presupuesto de $600 USD para capturar señales 40Hz reales.
        </p>
      </div>
    </div>
  );
}
