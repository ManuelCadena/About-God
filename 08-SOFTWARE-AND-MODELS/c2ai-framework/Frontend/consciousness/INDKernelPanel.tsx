/**
 * INDKernelPanel - Panel del Kernel IND (Inducción Floral) para el framework Hoffman-Levin
 * 
 * Visualiza el estado de inducción floral y protocolo BioFix usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  Brain,
  Activity,
  Calendar,
  Target,
  Sparkles as _SparklesIcon
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface INDState {
  section_id: string
  timestamp: string
  ind_factor: number
  band: string
  trend: string
  stress_days: number
  target_stress_days: number
  water_deficit: number
  urea_applied: boolean
  induction_success_prob: number
  biofix_date: string
}

interface INDKernelPanelProps {
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

export default function INDKernelPanel({ selectedSection = 'S1' }: INDKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indData, setIndData] = useState<INDState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: INDState): string => {
    return `## 🎓 Análisis PhD - Kernel IND (Framework Hoffman-Levin)

**Diagnóstico:** El factor de inducción floral se encuentra en estado **${st.band}** con IND=${(st.ind_factor * 100).toFixed(1)}%.
Días de estrés: ${st.stress_days}/${st.target_stress_days}, Déficit hídrico: ${((st.water_deficit || 0) * 100).toFixed(0)}%.

**Causa-Raíz:** ${st.stress_days < st.target_stress_days 
  ? `Protocolo BioFix en progreso. Faltan ${st.target_stress_days - st.stress_days} días de estrés controlado.`
  : `Estrés hídrico completado. ${st.urea_applied ? 'Urea foliar aplicada.' : 'Pendiente aplicación de urea foliar.'}`}

**Política MDP:** ${st.induction_success_prob >= 0.8 ? 'Alta probabilidad de éxito. Preparar riego de choque.' : 'Continuar monitoreo de estrés controlado.'}

**Impacto VEP:** El factor IND (peso 10% en PE) determina sincronización de floración. ${st.induction_success_prob >= 0.8 ? 'Condiciones favorables para floración uniforme.' : 'Riesgo de floración desincronizada.'}

**Recomendación:** ${st.stress_days >= st.target_stress_days && !st.urea_applied
  ? '⚠️ Aplicar urea foliar (2%) + riego de choque para romper dormancia floral.'
  : '✅ Mantener protocolo BioFix. Fecha estimada: ' + (st.biofix_date || 'por calcular')}`;
  };

  const requestPHDAnalysis = async () => {
    if (!indData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'financial_advisor', data: { ind: indData.ind_factor, band: indData.band, section: selectedSection } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(indData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(indData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(indData));
    } finally {
      setLoadingPHD(false);
    }
  };

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Usar Motor Unificado como fuente primaria (SSOT)
      const res = await fetch(`${API_BASE_URL}/pe/factors`)
      
      if (res.ok) {
        const data = await res.json()
        const indFactorData = data.factors?.ind
        
        if (indFactorData) {
          const detalle = indFactorData.detalle || {}
          
          // Determinar banda basada en valor
          let band = 'WARNING'
          if (indFactorData.value >= 0.95) band = 'ÓPTIMO'
          else if (indFactorData.value >= 0.85) band = 'WARNING'
          else if (indFactorData.value >= 0.70) band = 'ALERTA'
          else band = 'CRÍTICO'
          
          // Obtener datos fenológicos para inducción
          let diasEstres = 0
          let deficitHidrico = 0
          let probExito = 0
          
          try {
            const bioFixRes = await fetch(`${API_BASE_URL}/biofix/current`)
            if (bioFixRes.ok) {
              const bioFixData = await bioFixRes.json()
              diasEstres = bioFixData.dias_estres_hidrico || 0
              deficitHidrico = bioFixData.deficit_hidrico_pct || 0
              probExito = bioFixData.prob_induccion_exitosa || 0
            }
          } catch {
            // Usar valores por defecto basados en factor IND
            diasEstres = Math.round((1 - indFactorData.value) * 21)
            deficitHidrico = Math.round((1 - indFactorData.value) * 40)
            probExito = Math.round(indFactorData.value * 100)
          }
          
          setIndData({
            timestamp: new Date().toISOString(),
            section_id: selectedSection,
            ind_factor: indFactorData.value,
            band: band,
            trend: detalle.trend || 'stable',
            stress_days: diasEstres,
            target_stress_days: 21,
            water_deficit: deficitHidrico,
            urea_applied: false,
            induction_success_prob: probExito,
            biofix_date: new Date().toISOString().split('T')[0]
          })
        }
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching IND data:', err)
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
          <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel IND...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-lg p-6 border border-violet-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel IND - Inducción Floral</h2>
              <p className="text-gray-400">Protocolo BioFix | Sección {selectedSection}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            title="Actualizar datos"
            className="p-2 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-violet-400" />
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
        {/* IndustrialGauge para IND */}
        <IndustrialGauge
          title="IND Floral"
          value={indData?.ind_factor || 0}
          meta={0.85}
          min={0}
          max={1}
          status={indData?.band === 'ÓPTIMO' ? 'optimal' : indData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={indData?.trend === 'UP' ? 'up' : indData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="biofix.stress_protocol"
          size="md"
          colorScheme="blue"
        />

        {/* Días de Estrés */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="text-gray-400 text-sm">Días de Estrés</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {indData?.stress_days || 0} <span className="text-sm text-gray-400">/ {indData?.target_stress_days || 21}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              style={{ 
                width: `${Math.min(100, ((indData?.stress_days || 0) / (indData?.target_stress_days || 21)) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Déficit Hídrico */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Déficit Hídrico</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((indData?.water_deficit || 0) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            Óptimo: 40-60% para inducción
          </div>
        </div>

        {/* Probabilidad Éxito */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Prob. Éxito</span>
          </div>
          <div className={`text-2xl font-bold ${
            (indData?.induction_success_prob || 0) >= 0.8 ? 'text-green-400' :
            (indData?.induction_success_prob || 0) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {((indData?.induction_success_prob || 0) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            Urea: {indData?.urea_applied ? '✓ Aplicada' : '✗ Pendiente'}
          </div>
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acción Recomendada</div>
              <div className="text-lg font-semibold text-violet-400">
                {policy.optimal_action || 'Continuar estrés'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">IND Esperado</div>
              <div className="text-lg font-semibold text-green-400">
                {policy.expected_ind ? (policy.expected_ind * 100).toFixed(1) : '--'}%
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">BioFix Estimado</div>
              <div className="text-lg font-semibold text-purple-400">
                {indData?.biofix_date || policy.biofix_date || 'Por calcular'}
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
          ) : indData ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{generatePHDAnalysis(indData)}</div>
          ) : (<p className="text-gray-500 italic">Cargando análisis PhD...</p>)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-violet-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel IND</h4>
            <p className="text-sm text-gray-400">
              El factor IND modela el éxito del protocolo de inducción floral (BioFix).
              Optimiza decisiones de estrés hídrico controlado (21 días), aplicación de urea foliar
              y timing de riego de choque para maximizar floración sincronizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
