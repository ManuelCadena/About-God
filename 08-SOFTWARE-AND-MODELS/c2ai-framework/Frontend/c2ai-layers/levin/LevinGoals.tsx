import React from "react";
import { Target, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function LevinGoals() {
  const agentGoals = [
    { agent: "Irrigation Agent", goal: "IAH > 0.90", current: 0.85, status: "progress", priority: 1 },
    { agent: "Health Agent", goal: "IPF < 0.10", current: 0.18, status: "warning", priority: 1 },
    { agent: "Nutrition Agent", goal: "NPF > 0.85", current: 0.78, status: "progress", priority: 2 },
    { agent: "Phenology Agent", goal: "Sync 100%", current: 0.95, status: "good", priority: 3 },
    { agent: "Harvest Agent", goal: "PE > 64.3", current: 61.8, status: "progress", priority: 1 },
    { agent: "Market Agent", goal: "VEP $18.9M", current: 11.8, status: "warning", priority: 1 },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "good": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Goal Alignment - Objetivos de Agentes</h1>
          <p className="text-gray-400 text-sm">Alineación de objetivos individuales con meta global VEP</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-industrial-dark">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Agente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Objetivo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Actual</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Progreso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Prioridad</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody>
            {agentGoals.map((item, idx) => (
              <tr key={idx} className="border-t border-industrial-border hover:bg-industrial-dark/50">
                <td className="px-4 py-3 text-sm text-white font-medium">{item.agent}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.goal}</td>
                <td className="px-4 py-3 text-sm text-cyan-400 font-medium">{item.current}</td>
                <td className="px-4 py-3">
                  <div className="w-24 bg-industrial-dark rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${item.status === "good" ? "bg-green-500" : item.status === "warning" ? "bg-red-500" : "bg-yellow-500"}`} 
                         style={{ width: `${Math.min(100, (item.current / parseFloat(item.goal.replace(/[^0-9.]/g, "")) || 1) * 100)}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${item.priority === 1 ? "bg-red-500/20 text-red-400" : item.priority === 2 ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>
                    P{item.priority}
                  </span>
                </td>
                <td className="px-4 py-3">{getStatusIcon(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
