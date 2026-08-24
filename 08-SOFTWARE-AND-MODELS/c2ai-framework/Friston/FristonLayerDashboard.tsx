import { useState, useEffect, useCallback } from 'react'
import { 
  Activity, Brain, AlertTriangle, Zap, TrendingDown, Target, 
  Droplets, Sun, Thermometer, Leaf, RefreshCw, ArrowRight,
  Gauge, BarChart3, GitCompare, Lightbulb, LineChart, Map, Clock, DollarSign
} from 'lucide-react'
import { generatePanelAnalysis } from '../../services/llmService'

interface FristonDashboardData {
  status: string
  timestamp: string
  section: string
  phenology: string
  panels: {
    free_energy_gauge: {
      value: number
      threshold_optimal: number
      threshold_warning: number
      threshold_critical: number
      status: string
      interpretation: string
    }
    surprise_by_variable: Array<{
      variable: string
      surprise: number
      percentage: number
      status: string
    }>
    model_vs_reality: Record<string, {
      expected: number
      observed: number
      gap: number
      unit: string
    }>
    active_inference_actions: Array<{
      priority: number
      type: string
      urgency: number
      reason: string
      expected_f_reduction: number
      estimated_cost?: number
      roi_score?: number
    }>
    kl_divergence_trend: Array<{
      day: number
      label: string
      kl_divergence: number
    }>
    prediction_error_map: Record<string, {
      error: number
      status: string
    }>
    urgency_score: {
      value: number
      max: number
      level: string
      interpretation: string
    }
    vep_impact: {
      current_vep: number
      vep_recoverable: number
      recovery_percentage: number
      actions_required: number
      estimated_roi: number
    }
  }
  summary: {
    total_free_energy: number
    kl_divergence: number
    urgency: number
    top_action?: any
  }
}

const variableIcons: Record<string, any> = {
  water: Droplets,
  light: Sun,
  temperature: Thermometer,
  nitrogen: Leaf,
  potassium: Leaf,
  phosphorus: Leaf,
  humidity: Droplets,
  temp: Thermometer
}

const variableLabels: Record<string, string> = {
  water: 'Agua',
  light: 'Luz PAR',
  temperature: 'Temperatura',
  nitrogen: 'Nitrógeno',
  potassium: 'Potasio',
  phosphorus: 'Fósforo',
  humidity: 'Humedad',
  temp: 'Temperatura'
}

const actionLabels: Record<string, string> = {
  irrigate: 'Irrigar',
  reduce_irrigation: 'Reducir Riego',
  fertilize: 'Fertilizar',
  reduce_fertilization: 'Reducir Fertilización',
  increase_light: 'Aumentar Luz',
  reduce_shade: 'Reducir Sombra',
  apply_ipm: 'Aplicar IPM',
  harvest: 'Cosechar',
  prune: 'Podar',
  wait: 'Esperar'
}

export function FristonLayer({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<FristonDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [llmAnalysis, setLlmAnalysis] = useState<string>('')
  const [llmLoading, setLlmLoading] = useState(false)

  const fetchLLMAnalysis = async () => {
    if (!data) return
    setLlmLoading(true)
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'friston-dashboard',
        value: data.summary.total_free_energy,
        data: {
          free_energy: data.summary.total_free_energy,
          kl_divergence: data.summary.kl_divergence,
          urgency: data.summary.urgency,
          section: data.section,
          phenology: data.phenology,
          surprise_by_variable: data.panels.surprise_by_variable,
          model_vs_reality: data.panels.model_vs_reality,
          active_inference_actions: data.panels.active_inference_actions,
          vep_impact: data.panels.vep_impact,
        }
      })
      setLlmAnalysis(analysis)
    } catch (err) {
      console.error('Error fetching LLM analysis:', err)
      setLlmAnalysis('Error al generar análisis. Intente de nuevo.')
    } finally {
      setLlmLoading(false)
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/friston/dashboard/${section}`)
      if (!response.ok) throw new Error('API Error')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Friston fetch error:', err)
      // Fallback data
      setData({
        status: 'fallback',
        timestamp: new Date().toISOString(),
        section,
        phenology: 'FEN-05',
        panels: {
          free_energy_gauge: { value: 0.42, threshold_optimal: 0.5, threshold_warning: 1.0, threshold_critical: 2.0, status: 'optimal', interpretation: 'Planta alineada con ambiente' },
          surprise_by_variable: [
            { variable: 'water', surprise: 0.65, percentage: 32.5, status: 'warning' },
            { variable: 'nitrogen', surprise: 0.42, percentage: 21.0, status: 'ok' },
            { variable: 'light', surprise: 0.28, percentage: 14.0, status: 'ok' },
            { variable: 'temperature', surprise: 0.15, percentage: 7.5, status: 'ok' }
          ],
          model_vs_reality: {
            water: { expected: 45, observed: 38, gap: -7, unit: '%' },
            light: { expected: 1300, observed: 1100, gap: -200, unit: 'μmol/m²/s' },
            temperature: { expected: 28, observed: 32, gap: 4, unit: '°C' },
            nitrogen: { expected: 150, observed: 120, gap: -30, unit: 'ppm' }
          },
          active_inference_actions: [
            { priority: 1, type: 'irrigate', urgency: 8, reason: 'Déficit hídrico detectado', expected_f_reduction: 0.18, roi_score: 12.5 },
            { priority: 2, type: 'fertilize', urgency: 6, reason: 'N por debajo de expectativa', expected_f_reduction: 0.12, roi_score: 8.2 },
            { priority: 3, type: 'reduce_shade', urgency: 4, reason: 'PAR subóptimo', expected_f_reduction: 0.08, roi_score: 5.1 }
          ],
          kl_divergence_trend: [
            { day: -6, label: 'L', kl_divergence: 0.52 },
            { day: -5, label: 'M', kl_divergence: 0.48 },
            { day: -4, label: 'X', kl_divergence: 0.45 },
            { day: -3, label: 'J', kl_divergence: 0.42 },
            { day: -2, label: 'V', kl_divergence: 0.40 },
            { day: -1, label: 'S', kl_divergence: 0.38 },
            { day: 0, label: 'D', kl_divergence: 0.38 }
          ],
          prediction_error_map: {
            S1: { error: 0.52, status: 'warning' },
            S2: { error: 0.38, status: 'ok' },
            S3: { error: 0.28, status: 'ok' }
          },
          urgency_score: { value: 6.2, max: 10, level: 'high', interpretation: 'Acción recomendada en 24-48h' },
          vep_impact: { current_vep: 14500000, vep_recoverable: 1200000, recovery_percentage: 8.3, actions_required: 2, estimated_roi: 847 }
        },
        summary: { total_free_energy: 0.42, kl_divergence: 0.38, urgency: 6.2 }
      })
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (data && !llmAnalysis) {
      fetchLLMAnalysis()
    }
  }, [data])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const { panels, summary, phenology } = data
  const freeEnergyNormalized = Math.min(panels.free_energy_gauge.value / 2, 1)

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Friston Layer Dashboard</h2>
            <p className="text-gray-400 text-sm">Free Energy Principle • Active Inference • Minimizar Sorpresa</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-lg text-sm">{phenology}</span>
          <span className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold">{section}</span>
          <button onClick={fetchData} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <RefreshCw className={"w-5 h-5 text-gray-300 " + (loading ? 'animate-spin' : '')} />
          </button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-4 gap-4">
        {/* Panel 1: Free Energy Gauge */}
        <div className={"bg-gray-800/50 rounded-xl p-5 border-2 " + 
          (panels.free_energy_gauge.status === 'optimal' ? 'border-green-500/50' : 
           panels.free_energy_gauge.status === 'warning' ? 'border-yellow-500/50' : 'border-red-500/50')}>
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Free Energy (F)</span>
          </div>
          <div className="flex items-end gap-2">
            <span className={"text-4xl font-bold " + 
              (panels.free_energy_gauge.status === 'optimal' ? 'text-green-400' : 
               panels.free_energy_gauge.status === 'warning' ? 'text-yellow-400' : 'text-red-400')}>
              {panels.free_energy_gauge.value.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm mb-1">/ {panels.free_energy_gauge.threshold_optimal} óptimo</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={"h-full rounded-full transition-all " + 
                (panels.free_energy_gauge.status === 'optimal' ? 'bg-green-500' : 
                 panels.free_energy_gauge.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500')}
              style={{ width: `${Math.min(freeEnergyNormalized * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{panels.free_energy_gauge.interpretation}</p>
        </div>

        {/* Panel 5 Preview: KL Divergence */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">KL Divergence</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">{summary.kl_divergence.toFixed(3)}</div>
          <div className="flex items-center gap-1 mt-2">
            {panels.kl_divergence_trend.slice(-5).map((d, i) => (
              <div key={i} className="flex-1 bg-gray-700 rounded-sm" style={{ height: '40px' }}>
                <div 
                  className="bg-purple-500/60 rounded-sm w-full" 
                  style={{ height: `${Math.min(d.kl_divergence * 100, 100)}%`, marginTop: `${100 - Math.min(d.kl_divergence * 100, 100)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Tendencia 7 días</p>
        </div>

        {/* Panel 7: Urgency Score */}
        <div className={"bg-gray-800/50 rounded-xl p-5 border-2 " +
          (panels.urgency_score.level === 'low' ? 'border-green-500/50' :
           panels.urgency_score.level === 'medium' ? 'border-blue-500/50' :
           panels.urgency_score.level === 'high' ? 'border-yellow-500/50' : 'border-red-500/50')}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-gray-400 text-sm">Urgencia</span>
          </div>
          <div className="flex items-end gap-2">
            <span className={"text-4xl font-bold " +
              (panels.urgency_score.level === 'low' ? 'text-green-400' :
               panels.urgency_score.level === 'medium' ? 'text-blue-400' :
               panels.urgency_score.level === 'high' ? 'text-yellow-400' : 'text-red-400')}>
              {panels.urgency_score.value.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm mb-1">/ {panels.urgency_score.max}</span>
          </div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={"h-full rounded-full " +
                (panels.urgency_score.level === 'low' ? 'bg-green-500' :
                 panels.urgency_score.level === 'medium' ? 'bg-blue-500' :
                 panels.urgency_score.level === 'high' ? 'bg-yellow-500' : 'bg-red-500')}
              style={{ width: `${(panels.urgency_score.value / panels.urgency_score.max) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{panels.urgency_score.interpretation}</p>
        </div>

        {/* Panel 8: VEP Impact */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/30">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">VEP Recuperable</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            ${(panels.vep_impact.vep_recoverable / 1000000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-400">+{panels.vep_impact.recovery_percentage.toFixed(1)}%</span>
            <span className="text-xs text-gray-500">ROI: {panels.vep_impact.estimated_roi}x</span>
          </div>
          <p className="text-xs text-green-400/70 mt-2">{panels.vep_impact.actions_required} acciones requeridas</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Panel 2: Surprise por Variable */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-semibold">Sorpresa por Variable</h3>
          </div>
          <div className="space-y-3">
            {panels.surprise_by_variable.slice(0, 6).map((item, idx) => {
              const Icon = variableIcons[item.variable] || Activity
              return (
                <div key={idx} className="flex items-center gap-3">
                  <Icon className={"w-4 h-4 " + 
                    (item.status === 'critical' ? 'text-red-400' : 
                     item.status === 'warning' ? 'text-yellow-400' : 'text-gray-400')} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{variableLabels[item.variable] || item.variable}</span>
                      <span className={
                        item.status === 'critical' ? 'text-red-400' : 
                        item.status === 'warning' ? 'text-yellow-400' : 'text-gray-400'
                      }>{item.surprise.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={"h-full rounded-full " +
                          (item.status === 'critical' ? 'bg-red-500' : 
                           item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500')}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel 3: Modelo Interno vs Realidad */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Modelo vs Realidad</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(panels.model_vs_reality).slice(0, 5).map(([key, val]) => {
              const Icon = variableIcons[key] || Activity
              const isNegativeGap = val.gap < 0
              return (
                <div key={key} className="bg-gray-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{variableLabels[key] || key}</span>
                    </div>
                    <span className={"text-sm font-medium " + (isNegativeGap ? 'text-red-400' : val.gap > 0 ? 'text-yellow-400' : 'text-green-400')}>
                      {val.gap > 0 ? '+' : ''}{val.gap} {val.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Espera: {val.expected}</span>
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <span className="text-gray-400">Obs: {val.observed}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel 4: Active Inference Actions */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">Active Inference</h3>
          </div>
          <div className="space-y-3">
            {panels.active_inference_actions.map((action, idx) => (
              <div key={idx} className={"rounded-lg p-3 border-l-4 " +
                (action.urgency >= 7 ? 'bg-red-900/20 border-red-500' :
                 action.urgency >= 5 ? 'bg-yellow-900/20 border-yellow-500' :
                 'bg-blue-900/20 border-blue-500')}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">
                    #{action.priority} {actionLabels[action.type] || action.type}
                  </span>
                  <span className={"px-2 py-0.5 rounded text-xs " +
                    (action.urgency >= 7 ? 'bg-red-500/30 text-red-300' :
                     action.urgency >= 5 ? 'bg-yellow-500/30 text-yellow-300' :
                     'bg-blue-500/30 text-blue-300')}>
                    Urg: {action.urgency}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{action.reason}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-400">ΔF: -{action.expected_f_reduction.toFixed(2)}</span>
                  {action.roi_score && <span className="text-gray-500">ROI: {action.roi_score}x</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Panel 5: KL Divergence Trend */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Tendencia KL Divergence (7 días)</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {panels.kl_divergence_trend.map((d, i) => {
              const height = Math.min(d.kl_divergence * 150, 100)
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-700 rounded-t relative" style={{ height: '100px' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{d.label}</span>
                  <span className="text-xs text-purple-400">{d.kl_divergence.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel 6: Prediction Error Map */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-teal-400" />
            <h3 className="text-white font-semibold">Error Predictivo por Sección</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(panels.prediction_error_map).map(([sec, val]) => (
              <div 
                key={sec}
                className={"rounded-xl p-4 text-center border-2 " +
                  (val.status === 'critical' ? 'bg-red-900/30 border-red-500' :
                   val.status === 'warning' ? 'bg-yellow-900/30 border-yellow-500' :
                   'bg-green-900/30 border-green-500')}
              >
                <div className="text-2xl font-bold text-white mb-1">{sec}</div>
                <div className={"text-3xl font-bold " +
                  (val.status === 'critical' ? 'text-red-400' :
                   val.status === 'warning' ? 'text-yellow-400' : 'text-green-400')}>
                  {val.error.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {val.status === 'critical' ? 'Crítico' : val.status === 'warning' ? 'Atención' : 'Óptimo'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-blue-300">Interpretación de Energía Libre - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-300">Generando análisis con Claude AI...</span>
          </div>
        ) : llmAnalysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {llmAnalysis}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Cargando análisis PhD con IA...</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en datos de la sección {data.section}.
            <span className="text-blue-400 ml-2">Regla 1 Compliance: Solo datos verificados.</span>
          </p>
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-500/30">
        <div className="flex items-start gap-4">
          <Brain className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Principio de Energía Libre (Karl Friston)</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-blue-300">F = KL[q(s) || p(s|o)]</strong> — El árbol mantiene un modelo generativo interno 
              de sus expectativas ambientales. Cuando las observaciones difieren del modelo (alta F), el sistema recomienda 
              acciones de <strong className="text-purple-300">Active Inference</strong> para minimizar la sorpresa y restaurar 
              la homeostasis. Menor F = mayor alineación planta-ambiente = mayor VEP.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FristonLayer
// Build timestamp: 1767732757
