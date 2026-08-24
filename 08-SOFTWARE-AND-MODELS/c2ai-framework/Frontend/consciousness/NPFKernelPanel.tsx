import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, TrendingDown, AlertTriangle, Zap, Activity, Beaker, Sparkles, RefreshCw } from 'lucide-react';
import { IndustrialGauge } from '../charts/IndustrialGauge';

interface NPFState {
  section_id: string;
  timestamp: string;
  npf: number;
  band: string;
  trend: string;
  n_disponible: number;
  p_disponible: number;
  k_disponible: number;
  deficiencia: string;
}

interface NPFPolicy {
  section_id: string;
  current_state: NPFState;
  recommended_action: string;
  action_cost: number;
  expected_improvement: number;
  confidence: number;
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'ADECUADO': '#3b82f6',
  'DEFICIENTE': '#f97316',
  'CRÍTICO': '#ef4444',
};

const NPK_OPTIMAL = { N: 150, P: 45, K: 180 };

interface NPFKernelPanelProps {
  selectedSection?: string;
}

const NPFKernelPanel: React.FC<NPFKernelPanelProps> = ({ selectedSection = 'S1' }) => {
  const [state, setState] = useState<NPFState | null>(null);
  const [policy, setPolicy] = useState<NPFPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  // Usar prop en lugar de estado interno para evitar duplicación de selectores
  const activeSection = selectedSection;
  const [loadingPHD, setLoadingPHD] = useState(false);
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null);

  const generatePHDAnalysis = (st: NPFState, pol: NPFPolicy | null): string => {
    const status = st.band === 'ÓPTIMO' ? 'óptimo' : st.band === 'DEFICIENTE' ? 'deficiente' : 'adecuado';
    const nPct = (st.n_disponible / 150 * 100).toFixed(0);
    const pPct = (st.p_disponible / 45 * 100).toFixed(0);
    const kPct = (st.k_disponible / 180 * 100).toFixed(0);
    return `## 🎓 Análisis PhD - Kernel NPF (Framework Hoffman-Levin)

**Diagnóstico:** El nivel de provisión de fertilizantes se encuentra en estado **${status}** con NPF=${(st.npf * 100).toFixed(1)}%.
Balance NPK actual: N=${nPct}%, P=${pPct}%, K=${kPct}% respecto al óptimo.

**Causa-Raíz:** ${st.deficiencia !== 'NINGUNA'
  ? `Deficiencia detectada en ${st.deficiencia}. Requiere corrección para evitar impacto en calidad de frutos.`
  : `Balance nutricional favorable. Los tres macronutrientes están dentro de rangos aceptables.`}

**Política MDP:** ${pol ? `La acción recomendada es "${pol.recommended_action}" con costo de $${pol.action_cost}/ha y mejora esperada de +${pol.expected_improvement.toFixed(1)}%.` : 'Monitoreo nutricional continuo.'}

**Impacto VEP:** El factor NPF (peso 12% en PE) afecta directamente el calibre y calidad exportable. ${st.npf >= 0.85 ? 'Estado actual favorable para maximización VEP.' : 'Se requiere fertirrigación correctiva.'}

**Recomendación:** ${st.deficiencia !== 'NINGUNA'
  ? `⚠️ Aplicar fertilización correctiva para ${st.deficiencia} según análisis foliar.`
  : '✅ Mantener programa de fertirrigación balanceado según fenología actual.'}`;
  };

  const requestPHDAnalysis = async () => {
    if (!state) return;
    setLoadingPHD(true);
    try {
      const response = await fetch('/api/v1/llm/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'nutrition_agent',
          data: { npf: state.npf, band: state.band, deficiencia: state.deficiencia, section: activeSection }
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(state, policy));
      } else {
        setPhdAnalysis(generatePHDAnalysis(state, policy));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(state, policy));
    } finally {
      setLoadingPHD(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Usar Motor Unificado como fuente primaria (SSOT)
        const res = await fetch('/api/v1/pe/factors');
        if (res.ok) {
          const data = await res.json();
          const npfData = data.factors?.npf;
          if (npfData) {
            const detalle = npfData.detalle || {};
            // Determinar banda basada en valor
            let band = 'ADECUADO';
            if (npfData.value >= 0.95) band = 'ÓPTIMO';
            else if (npfData.value >= 0.85) band = 'ADECUADO';
            else if (npfData.value >= 0.70) band = 'DEFICIENTE';
            else band = 'CRÍTICO';
            
            // Determinar deficiencia principal
            let deficiencia = 'NINGUNA';
            const n_pct = (detalle.n_disponible || 125) / 150;
            const p_pct = (detalle.p_disponible || 38) / 45;
            const k_pct = (detalle.k_disponible || 155) / 180;
            if (n_pct < 0.7) deficiencia = 'NITRÓGENO';
            else if (p_pct < 0.7) deficiencia = 'FÓSFORO';
            else if (k_pct < 0.7) deficiencia = 'POTASIO';
            
            setState({
              section_id: activeSection,
              timestamp: new Date().toISOString(),
              npf: npfData.value,
              band: band,
              trend: detalle.trend || 'STABLE',
              n_disponible: detalle.n_disponible || 125,
              p_disponible: detalle.p_disponible || 38,
              k_disponible: detalle.k_disponible || 155,
              deficiencia: deficiencia
            });
          }
        }
        
        // Intentar obtener política MDP (opcional)
        try {
          const policyRes = await fetch(`/api/v1/consciousness/npf/policy/${activeSection}`);
          if (policyRes.ok) setPolicy(await policyRes.json());
        } catch {
          // Sin política disponible
        }
      } catch (error) {
        console.error('Error fetching NPF data:', error);
        setState({
          section_id: activeSection,
          timestamp: new Date().toISOString(),
          npf: 0.82,
          band: 'ADECUADO',
          trend: 'STABLE',
          n_disponible: 125,
          p_disponible: 38,
          k_disponible: 155,
          deficiencia: 'NINGUNA'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSection]);

  useEffect(() => {
    if (state && !phdAnalysis) {
      requestPHDAnalysis();
    }
  }, [state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const bandColor = state ? BAND_COLORS[state.band] || '#6b7280' : '#6b7280';

  const getNPKPercentage = (value: number, optimal: number) => Math.min(100, (value / optimal) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kernel NPF</h2>
            <p className="text-gray-500">Nivel de Provisión de Fertilizantes</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Sección activa - selector controlado desde App.tsx */}
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
            {activeSection}
          </div>
        </div>
      </div>

      {state && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IndustrialGauge para NPF */}
          <IndustrialGauge
            title="NPF"
            value={state.npf}
            meta={0.95}
            min={0}
            max={1}
            status={state.band === 'ÓPTIMO' ? 'optimal' : state.band === 'DEFICIENTE' || state.band === 'CRÍTICO' ? 'critical' : 'warning'}
            trendDirection={state.trend === 'UP' ? 'up' : state.trend === 'DOWN' ? 'down' : 'stable'}
            source="agronomy.nutricion_hoja"
            size="md"
            colorScheme="green"
          />

          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Balance NPK</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Nitrógeno (N)</span>
                  <span className="font-medium">{state.n_disponible} / {NPK_OPTIMAL.N} ppm</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all"
                    style={{ width: `${getNPKPercentage(state.n_disponible, NPK_OPTIMAL.N)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Fósforo (P)</span>
                  <span className="font-medium">{state.p_disponible} / {NPK_OPTIMAL.P} ppm</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-orange-500 h-4 rounded-full transition-all"
                    style={{ width: `${getNPKPercentage(state.p_disponible, NPK_OPTIMAL.P)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Potasio (K)</span>
                  <span className="font-medium">{state.k_disponible} / {NPK_OPTIMAL.K} ppm</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-purple-500 h-4 rounded-full transition-all"
                    style={{ width: `${getNPKPercentage(state.k_disponible, NPK_OPTIMAL.K)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {policy && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6" />
            <h3 className="text-xl font-bold">Política Óptima MDP</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">Acción Recomendada</div>
              <div className="text-lg font-bold">{policy.recommended_action}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">Costo/ha</div>
              <div className="text-lg font-bold">${policy.action_cost.toLocaleString()}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">Mejora Esperada</div>
              <div className="text-lg font-bold">+{policy.expected_improvement.toFixed(1)}%</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm opacity-80 mb-1">Confianza</div>
              <div className="text-lg font-bold">{(policy.confidence * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bandas NPF</h3>
        <div className="flex gap-2">
          {Object.entries(BAND_COLORS).map(([band, color]) => (
            <div key={band} className="flex-1 text-center">
              <div 
                className="h-3 rounded-full mb-2"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-gray-600">{band}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel PhD con LLM */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button
            onClick={requestPHDAnalysis}
            disabled={loadingPHD}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loadingPHD ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loadingPHD ? 'Analizando...' : 'Regenerar'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          {loadingPHD ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : phdAnalysis ? (
            <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {phdAnalysis}
            </div>
          ) : (
            <p className="text-gray-500 italic">Cargando análisis PhD...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NPFKernelPanel;
