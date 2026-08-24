import React from "react";
import { GitBranch, Leaf, Sun, Calendar } from "lucide-react";

export default function LevinMorphogenesis() {
  const phenologyStages = [
    { stage: "FEN-01", name: "Dormancia", progress: 100, status: "complete" },
    { stage: "FEN-02", name: "Brotación", progress: 100, status: "complete" },
    { stage: "FEN-03", name: "Floración", progress: 100, status: "complete" },
    { stage: "FEN-04", name: "Cuajado", progress: 100, status: "complete" },
    { stage: "FEN-05", name: "Desarrollo", progress: 65, status: "active" },
    { stage: "FEN-06", name: "Maduración", progress: 0, status: "pending" },
    { stage: "FEN-07", name: "Cosecha", progress: 0, status: "pending" },
  ];

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Morphogenesis - Desarrollo Fenológico</h1>
          <p className="text-gray-400 text-sm">Progresión de estados fenológicos y patrones de desarrollo</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Timeline Fenológico 2026</h2>
        <div className="space-y-3">
          {phenologyStages.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-20 text-sm font-medium ${stage.status === "active" ? "text-green-400" : stage.status === "complete" ? "text-gray-400" : "text-gray-600"}`}>
                {stage.stage}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${stage.status === "active" ? "text-white" : "text-gray-400"}`}>{stage.name}</span>
                  <span className="text-xs text-gray-500">{stage.progress}%</span>
                </div>
                <div className="bg-industrial-dark rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${stage.status === "active" ? "bg-green-500" : stage.status === "complete" ? "bg-purple-500" : "bg-gray-700"}`}
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4 text-center">
          <Sun className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">FEN-05</p>
          <p className="text-sm text-gray-400">Estado Actual</p>
        </div>
        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">W02</p>
          <p className="text-sm text-gray-400">Semana ISO</p>
        </div>
        <div className="bg-industrial-medium border border-cyan-500/30 rounded-lg p-4 text-center">
          <Leaf className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-gray-400">Ciclos Florales/Año</p>
        </div>
      </div>
    </div>
  );
}
