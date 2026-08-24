import React, { useEffect, useState } from "react";
import { Brain, Activity, Sparkles, Target, Zap, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";

interface FristonData {
  section: string;
  free_energy: number;
  kl_divergence: number;
  surprise_by_variable: Record<string, number>;
  recommended_actions: Array<{type: string; urgency: number; reason: string}>;
  urgency: number;
  phenology_stage: string;
}

export default function FristonDashboard() {
  const [data, setData] = useState<FristonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/c2ai-api/api/v1/friston/section/S1");
        const json = await response.json();
        if (json.status === "success") {
          setData(json.data);
        } else {
          setError("Error cargando datos");
        }
      } catch (e) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="bg-industrial-dark min-h-screen p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>;
  if (error) return <div className="bg-industrial-dark min-h-screen p-6"><div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-400">{error}</div></div>;
  if (!data) return null;

  const getStatusColor = (value: number, threshold: number) => 
    value < threshold ? "text-green-400" : value < threshold * 1.5 ? "text-yellow-400" : "text-red-400";

  const surpriseIndex = Object.values(data.surprise_by_variable).reduce((a, b) => a + b, 0) / Object.keys(data.surprise_by_variable).length || 0;
  const predictionError = data.kl_divergence * 0.01;
  const modelConfidence = Math.max(0, 1 - data.free_energy / 100);

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Friston Layer - Active Inference</h1>
          <p className="text-gray-400 text-sm">Minimización de energía libre y predicción de sorpresas • Datos en vivo</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Free Energy</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(data.free_energy, 25)}`}>
            {data.free_energy.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &lt;20</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Surprise Index</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(surpriseIndex, 15)}`}>
            {surpriseIndex.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &lt;10</p>
        </div>

        <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">Prediction Error</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(predictionError, 0.15)}`}>
            {predictionError.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &lt;0.10</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Model Confidence</span>
          </div>
          <p className={`text-3xl font-bold ${modelConfidence > 0.8 ? "text-green-400" : "text-yellow-400"}`}>
            {(modelConfidence * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: &gt;85%</p>
        </div>
      </div>

      <div className="bg-industrial-medium border border-industrial-border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Sorpresas por Variable</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(data.surprise_by_variable).map(([variable, value]) => (
            <div key={variable} className="bg-industrial-dark rounded-lg p-3">
              <p className="text-gray-400 text-sm capitalize">{variable}</p>
              <p className={`text-xl font-bold ${value < 10 ? "text-green-400" : value < 20 ? "text-yellow-400" : "text-red-400"}`}>
                {value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {data.recommended_actions.length > 0 && (
        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-purple-400 mb-4">Acciones Recomendadas</h2>
          <div className="space-y-3">
            {data.recommended_actions.map((action, idx) => (
              <div key={idx} className="bg-industrial-dark rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium capitalize">{action.type.replace(/_/g, " ")}</p>
                  <p className="text-gray-400 text-sm">{action.reason}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${action.urgency > 7 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  Urgencia: {action.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
