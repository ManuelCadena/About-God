import React, { useEffect, useState } from "react";
import { Target, Leaf, Zap, Activity, Loader2 } from "lucide-react";

interface LevinData {
  current_goal: string;
  alignment_score: number;
  goal_progress: number;
  supporting_factors: string[];
  blocking_factors: string[];
  recommendations: string[];
  next_goal: string;
  transition_readiness: number;
}

export default function LevinDashboard() {
  const [data, setData] = useState<LevinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/c2ai-api/api/v1/levin/alignment/S1");
        const json = await response.json();
        if (json.status === "success") setData(json.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="bg-industrial-dark min-h-screen p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-400" /></div>;
  if (!data) return null;

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-8 h-8 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Levin Layer - Goal-Directed Behavior</h1>
          <p className="text-gray-400 text-sm">Alineación de objetivos y desarrollo morfogenético • Datos en vivo</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">Goal Alignment</span>
          </div>
          <p className={`text-3xl font-bold ${data.alignment_score > 0.8 ? "text-green-400" : "text-yellow-400"}`}>
            {(data.alignment_score * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &gt;85%</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Goal Progress</span>
          </div>
          <p className="text-3xl font-bold text-blue-400">{(data.goal_progress * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Hacia: {data.current_goal}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Transition Ready</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{(data.transition_readiness * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Próximo: {data.next_goal}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="text-sm">Current Goal</span>
          </div>
          <p className="text-xl font-bold text-emerald-400 capitalize">{data.current_goal.replace(/_/g, " ")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-green-400 mb-3">Factores de Soporte</h2>
          <ul className="space-y-2">
            {data.supporting_factors.map((f, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-green-400">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-industrial-medium border border-red-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-400 mb-3">Factores Bloqueantes</h2>
          {data.blocking_factors.length > 0 ? (
            <ul className="space-y-2">
              {data.blocking_factors.map((f, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="text-red-400">✗</span> {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Sin factores bloqueantes</p>
          )}
        </div>
      </div>
    </div>
  );
}
