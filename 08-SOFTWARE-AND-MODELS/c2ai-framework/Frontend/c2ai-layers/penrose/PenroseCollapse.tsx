import React, { useEffect, useState } from "react";
import { Zap, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react";

interface Decision {
  id: number;
  decision: string;
  readiness: number;
  status: "ready" | "pending";
  impact: string;
  section?: string;
  agent?: string;
}

const C2AI_API = '/c2ai-api';

export default function PenroseCollapse() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const response = await fetch(`${C2AI_API}/api/v1/decisions/pending`);
        if (response.ok) {
          const result = await response.json();
          setDecisions(result.data?.decisions || []);
        } else {
          throw new Error('API not available');
        }
      } catch (e) {
        // Fallback: Calculate from other C2AI endpoints
        try {
          const [fristonRes, watsonRes] = await Promise.all([
            fetch(`${C2AI_API}/api/v1/friston/section/TOTAL`),
            fetch(`${C2AI_API}/api/v1/watson/section/TOTAL`)
          ]);
          
          const friston = fristonRes.ok ? await fristonRes.json() : null;
          const watson = watsonRes.ok ? await watsonRes.json() : null;
          
          const ipf = friston?.data?.ipf || 0.24;
          const iah = watson?.data?.iah || 0.85;
          const npf = watson?.data?.npf || 0.78;
          
          // Generate decisions based on current state
          const generatedDecisions: Decision[] = [];
          
          if (ipf > 0.10) {
            generatedDecisions.push({
              id: 1,
              decision: `Aplicar control fitosanitario (IPF: ${ipf.toFixed(2)})`,
              readiness: ipf > 0.20 ? 0.95 : 0.75,
              status: ipf > 0.20 ? "ready" : "pending",
              impact: `+$${((0.10 - ipf) * -10000000).toFixed(0)} VEP`,
              section: "TOTAL",
              agent: "Health"
            });
          }
          
          if (iah < 0.90) {
            generatedDecisions.push({
              id: 2,
              decision: `Optimizar riego (IAH: ${(iah * 100).toFixed(0)}%)`,
              readiness: iah < 0.80 ? 0.92 : 0.70,
              status: iah < 0.80 ? "ready" : "pending",
              impact: `+$${((0.90 - iah) * 5000000).toFixed(0)} VEP`,
              section: "TOTAL",
              agent: "Irrigation"
            });
          }
          
          if (npf < 0.85) {
            generatedDecisions.push({
              id: 3,
              decision: `Ajustar nutrición (NPF: ${(npf * 100).toFixed(0)}%)`,
              readiness: npf < 0.75 ? 0.88 : 0.65,
              status: npf < 0.75 ? "ready" : "pending",
              impact: `+$${((0.85 - npf) * 4000000).toFixed(0)} VEP`,
              section: "TOTAL",
              agent: "Nutrition"
            });
          }
          
          setDecisions(generatedDecisions.length > 0 ? generatedDecisions : [
            { id: 1, decision: "Sistema en estado óptimo", readiness: 1.0, status: "ready", impact: "VEP maximizado" }
          ]);
        } catch (fallbackErr) {
          setError('Error cargando decisiones');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDecisions();
    const interval = setInterval(fetchDecisions, 60000);
    return () => clearInterval(interval);
  }, []);

  const readyCount = decisions.filter(d => d.status === "ready").length;

  if (loading) {
    return (
      <div className="bg-industrial-dark min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-industrial-dark min-h-screen p-6">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-400 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Collapse Readiness - Decisiones Listas</h1>
          <p className="text-gray-400 text-sm">Decisiones que han alcanzado coherencia suficiente para ejecutar</p>
        </div>
      </div>

      <div className={`${readyCount > 0 ? 'bg-green-900/30 border-green-500/30' : 'bg-yellow-900/30 border-yellow-500/30'} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center gap-3">
          {readyCount > 0 ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : (
            <Clock className="w-8 h-8 text-yellow-400" />
          )}
          <div>
            <p className="text-white font-bold">
              {readyCount > 0 ? 'Sistema listo para colapso' : 'Decisiones en preparación'}
            </p>
            <p className="text-sm text-gray-400">
              {readyCount} decisiones con &gt;85% readiness disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {decisions.map((dec) => (
          <div key={dec.id} className={`bg-industrial-medium border rounded-lg p-4 ${dec.status === "ready" ? "border-green-500/50" : "border-yellow-500/50"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold">{dec.decision}</span>
              <span className={`px-3 py-1 rounded text-sm ${dec.status === "ready" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {dec.status === "ready" ? "LISTO" : "PENDIENTE"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Collapse Readiness</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-industrial-dark rounded-full h-2">
                    <div className={`h-full rounded-full ${dec.readiness >= 0.85 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${dec.readiness * 100}%` }} />
                  </div>
                  <span className="text-sm text-white">{(dec.readiness * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Impacto Estimado</p>
                <p className="text-green-400 font-bold">{dec.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
