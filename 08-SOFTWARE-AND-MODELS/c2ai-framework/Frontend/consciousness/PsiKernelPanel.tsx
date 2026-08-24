/**
 * PsiKernelPanel - Panel del Kernel ψ (Solar-Térmico) para el framework Hoffman-Levin
 * 
 * Visualiza el estado de radiación solar y estrés térmico usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  Sun, 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  // CheckCircle,
  // Target,
  Brain,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface PsiState {
  section_id: string
  timestamp: string
  factor_value: number
  band: string
  trend: string
  details: {
    psi: number
    temperatura: number
    temp_max_7d: number
    radiacion: number
    gdd: number
    estres_termico: string
    metadata: {
      data_source: string
      section_age: number
    }
  }
}

interface PsiKernelPanelProps {
  selectedSection?: string
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'WARNING': '#eab308',
  'ALERTA': '#f97316',
  'CRÍTICO': '#ef4444',
}

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8501/api/v1'
  : '/api/v1'

export default function PsiKernelPanel({ selectedSection = 'S1' }: PsiKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [psiData, setPsiData] = useState<PsiState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: PsiState): string => {
    const status = st.band === 'ÓPTIMO' ? 'óptimo' : st.band === 'CRÍTICO' ? 'crítico' : 'moderado';
    return `## 🎓 Análisis PhD - Kernel ψ (Framework Hoffman-Levin)

**Diagnóstico:** El factor solar-térmico se encuentra en estado **${status}** con ψ=${(st.factor_value * 100).toFixed(1)}%.
Radiación solar: ${st.details?.radiacion || '--'} W/m², Temperatura: ${st.details?.temperatura?.toFixed(1) || '--'}°C.

**Causa-Raíz:** ${st.details?.estres_termico === 'SEVERO' 
  ? `Estrés térmico ${st.details?.estres_termico} detectado. Reduce eficiencia fotosintética.`
  : `Condiciones térmicas dentro del rango óptimo para fotosíntesis activa.`}

**Política MDP:** Monitoreo continuo de PAR acumulado. ${st.details?.estres_termico === 'SEVERO' ? 'Considerar riego refrescante.' : 'Sin intervención requerida.'}

**Impacto VEP:** El factor ψ (peso 8% en PE) modula la eficiencia de conversión lumínica. ${st.factor_value >= 0.75 ? 'Estado favorable.' : 'Posible reducción en tasa de crecimiento de frutos.'}

**Recomendación:** ${st.details?.estres_termico === 'SEVERO' 
  ? '⚠️ Evaluar aplicación de anti-estrés foliar o riego por aspersión en horas pico.'
  : '✅ Condiciones favorables. Mantener monitoreo de estación Davis.'}`;
  };

  const requestPHDAnalysis = async () => {
    if (!psiData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'weather_advisor', data: { psi: psiData.factor_value, band: psiData.band, section: selectedSection } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(psiData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(psiData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(psiData));
    } finally {
      setLoadingPHD(false);
    }
  };

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [stateRes, policyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/consciousness/kernels/psi/state/${selectedSection}`),
        fetch(`${API_BASE_URL}/consciousness/kernels/psi/policy/${selectedSection}`)
      ])
      
      if (stateRes.ok) {
        const stateData = await stateRes.json()
        setPsiData(stateData)
      }
      if (policyRes.ok) {
        const policyData = await policyRes.json()
        setPolicy(policyData)
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching Psi data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedSection])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getBandColor = (band: string) => BAND_COLORS[band] || '#6b7280'

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel ψ...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Sun className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel ψ - Factor Solar-Térmico</h2>
              <p className="text-gray-400">Radiación PAR y Estrés Térmico | Sección {selectedSection}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-yellow-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Estado Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IndustrialGauge para PSI */}
        <IndustrialGauge
          title="ψ Solar"
          value={psiData?.factor_value || 0}
          meta={0.95}
          min={0}
          max={1}
          status={psiData?.band === 'ÓPTIMO' ? 'optimal' : psiData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={psiData?.trend === 'UP' ? 'up' : psiData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="weather.davis_weatherlink"
          size="md"
          colorScheme="amber"
        />

        {/* Radiación Solar */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm">Radiación PAR</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {psiData?.details?.radiacion?.toFixed(0) || '--'} <span className="text-sm text-gray-400">W/m²</span>
          </div>
        </div>

        {/* Temperatura */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-sm">Temperatura</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {psiData?.details?.temp_max_7d?.toFixed(1) || '--'}° / {psiData?.details?.temperatura?.toFixed(1) || '--'}°
          </div>
          <div className="text-xs text-gray-500">Máx / Mín</div>
        </div>

        {/* Horas Estrés */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-gray-400 text-sm">Horas Estrés Térmico</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {psiData?.details?.estres_termico === 'SEVERO' ? '4+' : '0'} <span className="text-sm text-gray-400">hrs</span>
          </div>
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acción Recomendada</div>
              <div className="text-lg font-semibold text-yellow-400">
                {policy.optimal_action || 'Monitorear'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">ψ Esperado</div>
              <div className="text-lg font-semibold text-green-400">
                {policy.expected_psi ? (policy.expected_psi * 100).toFixed(1) : '--'}%
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Impacto VEP</div>
              <div className="text-lg font-semibold text-emerald-400">
                +${policy.delta_vep?.toLocaleString() || '0'} MXN
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel PhD con LLM */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button
            onClick={requestPHDAnalysis}
            disabled={loadingPHD}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loadingPHD ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingPHD ? 'Analizando...' : 'Regenerar'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          {loadingPHD ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : phdAnalysis ? (
            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
              {phdAnalysis}
            </div>
          ) : psiData ? (
            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
              {generatePHDAnalysis(psiData)}
            </div>
          ) : (
            <p className="text-gray-500 italic">Cargando análisis PhD...</p>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel ψ</h4>
            <p className="text-sm text-gray-400">
              El factor ψ modela el impacto de la radiación solar (PAR) y el estrés térmico en la producción.
              Optimiza decisiones de riego por aspersión, mallas sombra y ventanas de aplicación.
              Meta: ψ ≥ 75% para fotosíntesis óptima sin estrés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
