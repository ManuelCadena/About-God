/**
 * CitrusMax UI v5.0 - IAH Kernel Panel (Modelo CitrusMax H₂O)
 * ==============================================================
 * Kernel Markoviano para optimización de políticas de riego
 * 
 * Fórmulas FAO-56 Calibradas:
 * - ETc = ETo × Kc (coeficiente fenológico)
 * - Pe = 0.6P - 10 (P<75mm) | Pe = 0.8P - 25 (P≥75mm)
 * - IAH = (Pe + Riego) / ETc
 * - ICR = (ETc - A) / ETc (Índice Carencia Relativa)
 * - Déficit D = ETc - (Pe + Riego)
 */

import React, { useState, useEffect } from 'react';
import { Droplets, TrendingUp, TrendingDown, AlertTriangle, Zap, Activity, Sparkles, RefreshCw } from 'lucide-react';
import { IndustrialGauge } from '../charts/IndustrialGauge';

interface IAHState {
  section_id: string;
  timestamp: string;
  iah: number;
  band: string;
  trend: string;
  humedad_suelo: number;
  etc_diario: number;
  eto_diario: number;
  kc: number;
  precipitacion_7d: number;
  pe_efectiva: number;
  riego_7d: number;
  deficit_hidrico: number;
  icr: number;
  fenologia: string;
  forecast_lluvia_7d: number;
}

interface IAHPolicy {
  section_id: string;
  current_state: IAHState;
  recommended_action: string;
  action_cost: number;
  expected_improvement: number;
  confidence: number;
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'ADECUADO': '#3b82f6',
  'DÉFICIT': '#f97316',
  'CRÍTICO': '#ef4444',
  'EXCESO': '#8b5cf6',
};

// Coeficientes Kc fenológicos calibrados (FAO-56 para Lima Persa)
// Disponible para uso futuro en cálculos de ETc
// FEN-01: kc=0.55, FEN-02: kc=0.70, FEN-03: kc=0.85, FEN-04: kc=0.90
// FEN-05: kc=0.90, FEN-06: kc=0.80, FEN-07: kc=0.75

interface IAHKernelPanelProps {
  selectedSection?: string;
}

const IAHKernelPanel: React.FC<IAHKernelPanelProps> = ({ selectedSection = 'S1' }) => {
  const [state, setState] = useState<IAHState | null>(null);
  const [policy, setPolicy] = useState<IAHPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  // Usar prop en lugar de estado interno para evitar duplicación de selectores
  const activeSection = selectedSection;
  const [loadingPHD, setLoadingPHD] = useState(false);
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null);

  const generatePHDAnalysis = (st: IAHState, pol: IAHPolicy | null): string => {
    const status = st.band === 'ÓPTIMO' ? 'óptimo' : st.band === 'DÉFICIT' ? 'deficitario' : 'adecuado';
    return `## 🎓 Análisis PhD - Kernel IAH (Framework Hoffman-Levin)

**Diagnóstico:** El índice de adecuación hídrica se encuentra en estado **${status}** con IAH=${(st.iah * 100).toFixed(1)}%. 
La humedad del suelo está al ${st.humedad_suelo}% con ETc diario de ${st.etc_diario}mm.

**Causa-Raíz:** ${st.deficit_hidrico > 10 
  ? `Déficit hídrico acumulado de ${st.deficit_hidrico}mm indica desbalance entre demanda evapotranspirativa y aporte.`
  : `Balance hídrico favorable con precipitación de ${st.precipitacion_7d}mm en 7 días.`}

**Política MDP:** ${pol ? `La acción recomendada es "${pol.recommended_action}" con costo de $${pol.action_cost}/ha y mejora esperada de +${pol.expected_improvement.toFixed(1)}%.` : 'Monitoreo continuo recomendado.'}

**Impacto VEP:** El factor IAH (peso 15% en PE) afecta directamente la eficiencia fotosintética y desarrollo de frutos. ${st.iah >= 0.85 ? 'Estado actual favorable para maximización VEP.' : 'Se requiere intervención para evitar pérdidas en PE.'}

**Recomendación:** ${st.deficit_hidrico > 15 
  ? '⚠️ Activar riego de emergencia para recuperar balance hídrico antes de estrés irreversible.'
  : '✅ Mantener monitoreo y ajustar lámina de riego según pronóstico ETc.'}`;
  };

  const requestPHDAnalysis = async () => {
    if (!state) return;
    setLoadingPHD(true);
    try {
      const response = await fetch('/api/v1/llm/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'irrigation_agent',
          data: { iah: state.iah, band: state.band, deficit: state.deficit_hidrico, section: activeSection }
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
          const iahData = data.factors?.iah;
          if (iahData) {
            const detalle = iahData.detalle || {};
            // Determinar banda basada en valor
            let band = 'ADECUADO';
            if (iahData.value >= 0.95) band = 'ÓPTIMO';
            else if (iahData.value >= 0.85) band = 'ADECUADO';
            else if (iahData.value >= 0.70) band = 'DÉFICIT';
            else band = 'CRÍTICO';
            
            setState({
              section_id: activeSection,
              timestamp: new Date().toISOString(),
              iah: iahData.value,
              band: band,
              trend: detalle.trend || 'STABLE',
              humedad_suelo: detalle.humedad_suelo || 45,
              etc_diario: detalle.etc_diario || 4.2,
              eto_diario: detalle.eto_diario || 4.9,
              kc: detalle.kc || 0.85,
              precipitacion_7d: detalle.lluvia_7d || 18,
              pe_efectiva: detalle.pe_efectiva || 14.4,
              riego_7d: detalle.riego_7d || 12,
              deficit_hidrico: detalle.deficit_hidrico || 3.8,
              icr: detalle.icr || 0.13,
              fenologia: detalle.fenologia || 'FEN-05',
              forecast_lluvia_7d: detalle.forecast_lluvia_7d || 25
            });
          }
        }
        
        // Política MDP (opcional)
        try {
          const policyRes = await fetch(`/api/v1/consciousness/iah/state/${activeSection}`);
          if (policyRes.ok) {
            const policyData = await policyRes.json();
            // Actualizar estado con datos más detallados si disponibles
            if (policyData.iah) {
              setState(prev => prev ? { ...prev, ...policyData } : prev);
            }
          }
        } catch {
          // Sin política disponible - usar datos del Motor Unificado
        }
      } catch (error) {
        console.error('Error fetching IAH data:', error);
        setState({
          section_id: activeSection,
          timestamp: new Date().toISOString(),
          iah: 0.88,
          band: 'ADECUADO',
          trend: 'STABLE',
          humedad_suelo: 45,
          etc_diario: 4.2,
          eto_diario: 4.9,
          kc: 0.85,
          precipitacion_7d: 18,
          pe_efectiva: 14.4,
          riego_7d: 12,
          deficit_hidrico: 3.8,
          icr: 0.13,
          fenologia: 'FEN-05',
          forecast_lluvia_7d: 25
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const bandColor = state ? BAND_COLORS[state.band] || '#6b7280' : '#6b7280';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Droplets className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kernel IAH</h2>
            <p className="text-gray-500">Índice de Adecuación Hídrica</p>
          </div>
        </div>
        {/* Sección activa mostrada - selector controlado desde App.tsx */}
        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
          {activeSection}
        </div>
      </div>

      {state && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IndustrialGauge para IAH */}
          <IndustrialGauge
            title="IAH"
            value={state.iah}
            meta={0.95}
            min={0}
            max={1}
            status={state.band === 'ÓPTIMO' ? 'optimal' : state.band === 'DÉFICIT' || state.band === 'CRÍTICO' ? 'critical' : 'warning'}
            trendDirection={state.trend === 'UP' ? 'up' : state.trend === 'DOWN' ? 'down' : 'stable'}
            source="weather.davis_weatherlink_complete"
            size="md"
            colorScheme="blue"
          />

          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Variables Hídricas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-600 mb-1">Humedad Suelo</div>
                <div className="text-2xl font-bold text-blue-800">{state.humedad_suelo}%</div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${state.humedad_suelo}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-4">
                <div className="text-sm text-cyan-600 mb-1">ETc Diario</div>
                <div className="text-2xl font-bold text-cyan-800">{state.etc_diario} mm</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="text-sm text-indigo-600 mb-1">Precipitación 7d</div>
                <div className="text-2xl font-bold text-indigo-800">{state.precipitacion_7d} mm</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-sm text-orange-600 mb-1">Déficit Hídrico</div>
                <div className="text-2xl font-bold text-orange-800">{state.deficit_hidrico} mm</div>
                {state.deficit_hidrico > 15 && (
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {policy && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bandas IAH</h3>
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

export default IAHKernelPanel;
