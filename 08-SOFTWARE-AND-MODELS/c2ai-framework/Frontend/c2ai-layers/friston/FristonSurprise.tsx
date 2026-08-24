import React from "react";
import { Sparkles, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

export default function FristonSurprise() {
  const surpriseEvents = [
    { date: "2026-01-05", section: "S2", type: "Plagas", surprise: 0.42, description: "Incremento inesperado de Trips", severity: "high" },
    { date: "2026-01-04", section: "S1", type: "Clima", surprise: 0.28, description: "Temperatura 4°C sobre predicción", severity: "medium" },
    { date: "2026-01-03", section: "S3", type: "Riego", surprise: 0.15, description: "IAH menor al esperado", severity: "low" },
    { date: "2026-01-02", section: "S1", type: "Nutrición", surprise: 0.12, description: "NPF ligeramente bajo", severity: "low" },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "high": return "bg-red-500/20 border-red-500/50 text-red-400";
      case "medium": return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      default: return "bg-green-500/20 border-green-500/50 text-green-400";
    }
  };

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Surprise Index - Detección de Anomalías</h1>
          <p className="text-gray-400 text-sm">Eventos inesperados que requieren atención del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-400">1</p>
          <p className="text-sm text-gray-400">Alta Sorpresa</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">1</p>
          <p className="text-sm text-gray-400">Media Sorpresa</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-400">2</p>
          <p className="text-sm text-gray-400">Baja Sorpresa</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-industrial-dark">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Sección</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Índice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody>
            {surpriseEvents.map((event, idx) => (
              <tr key={idx} className="border-t border-industrial-border hover:bg-industrial-dark/50">
                <td className="px-4 py-3 text-sm text-gray-300">{event.date}</td>
                <td className="px-4 py-3 text-sm text-white font-medium">{event.section}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{event.type}</td>
                <td className="px-4 py-3 text-sm font-bold text-orange-400">{event.surprise.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{event.description}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(event.severity)}`}>
                    {event.severity === "high" ? "URGENTE" : event.severity === "medium" ? "REVISAR" : "NORMAL"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
