import React from "react";
import { Target, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function FristonPrediction() {
  const predictions = [
    { model: "PE (Producción)", predicted: 64.3, actual: 61.8, error: 0.039, status: "good" },
    { model: "IPF (Plagas)", predicted: 0.15, actual: 0.18, error: 0.20, status: "warning" },
    { model: "IAH (Riego)", predicted: 0.88, actual: 0.85, error: 0.034, status: "good" },
    { model: "NPF (Nutrición)", predicted: 0.82, actual: 0.78, error: 0.049, status: "warning" },
    { model: "Fenología", predicted: "FEN-05", actual: "FEN-05", error: 0.0, status: "good" },
  ];

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-red-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Prediction Error - Calibración de Modelos</h1>
          <p className="text-gray-400 text-sm">Comparación predicciones vs observaciones reales</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Error de Predicción por Modelo</h2>
        <div className="space-y-4">
          {predictions.map((pred, idx) => (
            <div key={idx} className="bg-industrial-dark border border-industrial-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{pred.model}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  pred.status === "good" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {pred.status === "good" ? "CALIBRADO" : "AJUSTAR"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Predicho</p>
                  <p className="text-blue-400 font-medium">{pred.predicted}</p>
                </div>
                <div>
                  <p className="text-gray-500">Real</p>
                  <p className="text-white font-medium">{pred.actual}</p>
                </div>
                <div>
                  <p className="text-gray-500">Error %</p>
                  <p className={`font-medium ${pred.error < 0.05 ? "text-green-400" : "text-yellow-400"}`}>
                    {(pred.error * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="mt-2 bg-industrial-medium rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${pred.error < 0.05 ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ width: `${Math.min(100, (1 - pred.error) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-industrial-medium border border-red-500/30 rounded-lg p-4">
        <h2 className="text-lg font-bold text-red-400 mb-2">Acciones de Calibración</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• IPF: Ajustar coeficiente γ_P de 0.20 a 0.22 para Trips</li>
          <li>• NPF: Recalibrar demanda K en FEN-05 (floración)</li>
        </ul>
      </div>
    </div>
  );
}
