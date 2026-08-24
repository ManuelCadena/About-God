/**
 * TRIMKernelPanel - Panel del Kernel TRIM (Poda/Canopia) para el framework Hoffman-Levin
 * 
 * Visualiza el estado de poda y arquitectura del árbol usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  Scissors, 
  TreePine, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  Brain,
  Activity,
  Calendar,
  Percent,
  Sparkles
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface TRIMState {
  section_id: string
  timestamp: string
  factor_value: number
  band: string
  trend: string
  details: {
    trim: number
    lai: number
    densidad_canopia: number
    altura_arbol: number
    dias_desde_poda: number
    epoca_optima: boolean
    metadata: {
      data_source: string
      ultima_poda: string
      section_age: number
    }
  }
}

interface TRIMKernelPanelProps {
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

export default function TRIMKernelPanel({ selectedSection = 'S1' }: TRIMKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trimData, setTrimData] = useState<TRIMState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: TRIMState): string => {
    return `## 🎓 Análisis PhD - Kernel TRIM (Framework Hoffman-Levin)

**Diagnóstico:** El factor de poda se encuentra en estado **${st.band}** con TRIM=${(st.factor_value * 100).toFixed(1)}%.
Días desde última poda: ${st.details?.dias_desde_poda || '--'}, Densidad canopia: ${((st.details?.densidad_canopia || 0) * 100).toFixed(0)}%.

**Causa-Raíz:** ${(st.details?.densidad_canopia || 0) > 0.8 
  ? `Alta densidad de canopia (${((st.details?.densidad_canopia || 0) * 100).toFixed(0)}%). Posible reducción de penetración lumínica.`
  : `Arquitectura de canopia adecuada. Luz penetra correctamente al interior.`}

**Política MDP:** ${(st.details?.dias_desde_poda || 0) > 180 ? 'Programar poda de mantenimiento.' : 'Sin intervención de poda requerida.'}

**Impacto VEP:** El factor TRIM (peso 8% en PE) afecta calidad de frutos interiores y sanidad. ${st.factor_value >= 0.8 ? 'Estado favorable.' : 'Posible reducción en calibre y color.'}

**Recomendación:** ${(st.details?.densidad_canopia || 0) > 0.8 
  ? '⚠️ Ejecutar poda de aclareo para mejorar penetración lumínica.'
  : '✅ Mantener monitoreo. Siguiente poda estimada según fenología.'}`;
  };

  const requestPHDAnalysis = async () => {
    if (!trimData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'financial_advisor', data: { trim: trimData.factor_value, band: trimData.band, section: selectedSection } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(trimData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(trimData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(trimData));
    } finally {
      setLoadingPHD(false);
    }
  };

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [stateRes, policyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/consciousness/kernels/trim/state/${selectedSection}`),
        fetch(`${API_BASE_URL}/consciousness/kernels/trim/policy/${selectedSection}`)
      ])
      
      if (stateRes.ok) {
        const stateData = await stateRes.json()
        setTrimData(stateData)
      }
      if (policyRes.ok) {
        const policyData = await policyRes.json()
        setPolicy(policyData)
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching TRIM data:', err)
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
          <RefreshCw className="w-8 h-8 animate-spin text-lime-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel TRIM...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-900/30 to-green-900/30 rounded-lg p-6 border border-lime-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-lime-500/20 rounded-lg">
              <Scissors className="w-8 h-8 text-lime-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel TRIM - Factor Poda</h2>
              <p className="text-gray-400">Arquitectura de Canopia | Sección {selectedSection}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            title="Actualizar datos"
            className="p-2 bg-lime-500/20 hover:bg-lime-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-lime-400" />
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
        {/* IndustrialGauge para TRIM */}
        <IndustrialGauge
          title="TRIM Poda"
          value={trimData?.factor_value || 0}
          meta={0.90}
          min={0}
          max={1}
          status={trimData?.band === 'ÓPTIMO' ? 'optimal' : trimData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={trimData?.trend === 'UP' ? 'up' : trimData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="SECTION_CHARACTERISTICS"
          size="md"
          colorScheme="green"
        />

        {/* Días desde Poda */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-lime-400" />
            <span className="text-gray-400 text-sm">Días desde Poda</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {trimData?.details?.dias_desde_poda || '--'} <span className="text-sm text-gray-400">días</span>
          </div>
          <div className="text-xs text-gray-500">
            Última: {trimData?.details?.metadata?.ultima_poda || 'N/A'}
          </div>
        </div>

        {/* Densidad Canopia */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Densidad Canopia</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((trimData?.details?.densidad_canopia || 0) * 100).toFixed(0)}%
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-lime-500 rounded-full"
              style={{ width: `${(trimData?.details?.densidad_canopia || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Penetración Luz */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm">Penetración Luz</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((1 - (trimData?.details?.densidad_canopia || 0)) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            Óptimo: 60-80%
          </div>
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-lime-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acción Recomendada</div>
              <div className="text-lg font-semibold text-lime-400">
                {policy.optimal_action || 'Sin poda requerida'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Intensidad Sugerida</div>
              <div className="text-lg font-semibold text-green-400">
                {policy.prune_intensity ? `${(policy.prune_intensity * 100).toFixed(0)}%` : '--'}
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
            <Sparkles className="w-5 h-5" /><span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button onClick={requestPHDAnalysis} disabled={loadingPHD}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
            {loadingPHD ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingPHD ? 'Analizando...' : 'Regenerar'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          {loadingPHD ? (<div className="flex items-center justify-center py-8"><RefreshCw className="w-8 h-8 animate-spin text-purple-500" /></div>
          ) : phdAnalysis ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{phdAnalysis}</div>
          ) : trimData ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{generatePHDAnalysis(trimData)}</div>
          ) : (<p className="text-gray-500 italic">Cargando análisis PhD...</p>)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-lime-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel TRIM</h4>
            <p className="text-sm text-gray-400">
              El factor TRIM modela el impacto de la poda en la arquitectura del árbol y producción.
              Optimiza decisiones de timing, intensidad y tipo de poda (formación/producción/sanitaria).
              Meta: TRIM ≥ 80% con penetración de luz óptima (60-80%).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
