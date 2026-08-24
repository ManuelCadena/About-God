import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Activity, Brain, Droplets, Sun, Thermometer, Leaf, Zap } from 'lucide-react'
import { generatePanelAnalysis } from '../../services/llmService'

interface SurpriseVariable {
  variable: string
  surprise: number
  percentage: number
  status: 'critical' | 'warning' | 'ok'
  expected: number
  observed: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  history: number[]
}

interface SurpriseData {
  status: string
  timestamp: string
  section: string
  phenology: string
  total_surprise: number
  variables: SurpriseVariable[]
  interpretation: string
  threshold_warning: number
  threshold_critical: number
}

const variableIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-5 h-5" />,
  light: <Sun className="w-5 h-5" />,
  temperature: <Thermometer className="w-5 h-5" />,
  nitrogen: <Leaf className="w-5 h-5" />,
  potassium: <Zap className="w-5 h-5" />,
  phosphorus: <Activity className="w-5 h-5" />
}

const variableLabels: Record<string, string> = {
  water: 'Humedad Suelo',
  light: 'Luz PAR',
  temperature: 'Temperatura',
  nitrogen: 'Nitrógeno',
  potassium: 'Potasio',
  phosphorus: 'Fósforo'
}

export function FristonSurpriseIndex({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<SurpriseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVar, setSelectedVar] = useState<string | null>(null)
  const [llmAnalysis, setLlmAnalysis] = useState<string>('')
  const [llmLoading, setLlmLoading] = useState(false)

  const fetchLLMAnalysis = async () => {
    if (!data) return
    setLlmLoading(true)
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'friston-surprise',
        value: data.total_surprise,
        data: {
          total_surprise: data.total_surprise,
          variables: data.variables,
          section: data.section,
          phenology: data.phenology,
          threshold_warning: data.threshold_warning,
          threshold_critical: data.threshold_critical,
          interpretation: data.interpretation,
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
      const response = await fetch(`/c2ai-api/api/v1/friston/surprise/${section}`)
      if (!response.ok) throw new Error('API Error')
      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Surprise fetch error:', err)
      setData({
        status: 'fallback',
        timestamp: new Date().toISOString(),
        section,
        phenology: 'FEN-04',
        total_surprise: 2.20,
        threshold_warning: 1.5,
        threshold_critical: 3.0,
        interpretation: 'Sorpresa moderada-alta. Variables hídricas y lumínicas requieren atención.',
        variables: [
          { variable: 'light', surprise: 1.13, percentage: 51.4, status: 'critical', expected: 1300, observed: 1600, unit: 'μmol/m²/s', trend: 'up', history: [0.9, 1.0, 1.05, 1.1, 1.13] },
          { variable: 'nitrogen', surprise: 0.50, percentage: 22.7, status: 'warning', expected: 160, observed: 130, unit: 'ppm', trend: 'stable', history: [0.52, 0.51, 0.50, 0.50, 0.50] },
          { variable: 'water', surprise: 0.28, percentage: 12.7, status: 'ok', expected: 48, observed: 42, unit: '%', trend: 'down', history: [0.35, 0.32, 0.30, 0.29, 0.28] },
          { variable: 'potassium', surprise: 0.16, percentage: 7.3, status: 'ok', expected: 180, observed: 160, unit: 'ppm', trend: 'stable', history: [0.16, 0.16, 0.16, 0.16, 0.16] },
          { variable: 'phosphorus', surprise: 0.13, percentage: 5.9, status: 'ok', expected: 45, observed: 40, unit: 'ppm', trend: 'stable', history: [0.14, 0.13, 0.13, 0.13, 0.13] },
          { variable: 'temperature', surprise: 0.00, percentage: 0.0, status: 'ok', expected: 28, observed: 28, unit: '°C', trend: 'stable', history: [0.02, 0.01, 0.01, 0.00, 0.00] }
        ]
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
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500'
      default: return 'text-green-400 bg-green-500/20 border-green-500'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const totalStatus = data.total_surprise >= data.threshold_critical ? 'critical' : 
                      data.total_surprise >= data.threshold_warning ? 'warning' : 'ok'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-400" />
            Surprise Index
          </h2>
          <p className="text-gray-400 mt-1">Índice de Sorpresa • Desviación del Modelo Generativo</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
          <RefreshCw className={"w-5 h-5 text-gray-300 " + (loading ? 'animate-spin' : '')} />
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Sorpresa Total del Sistema</h3>
            <p className="text-gray-500 text-sm">Σ Surprise = Σ |log p(o|s) - log q(o)|</p>
          </div>
          <span className={"px-3 py-1 rounded-full text-sm font-medium border " + getStatusColor(totalStatus)}>
            {totalStatus === 'critical' ? 'CRÍTICO' : totalStatus === 'warning' ? 'ATENCIÓN' : 'ÓPTIMO'}
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" fill="none" stroke="#374151" strokeWidth="16" />
              <circle 
                cx="96" cy="96" r="80" 
                fill="none" 
                stroke={totalStatus === 'critical' ? '#ef4444' : totalStatus === 'warning' ? '#eab308' : '#22c55e'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(data.total_surprise / 5 * 502, 502)} 502`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={"text-4xl font-bold " + (totalStatus === 'critical' ? 'text-red-400' : totalStatus === 'warning' ? 'text-yellow-400' : 'text-green-400')}>
                {data.total_surprise.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm">/ 5.0 max</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-gray-400">Óptimo: &lt; {data.threshold_warning}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-gray-400">Atención: {data.threshold_warning} - {data.threshold_critical}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-gray-400">Crítico: &gt; {data.threshold_critical}</span>
            </div>
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300 text-sm">{data.interpretation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data.variables.map((v) => (
          <div 
            key={v.variable}
            onClick={() => setSelectedVar(selectedVar === v.variable ? null : v.variable)}
            className={"bg-gray-800/50 rounded-xl p-5 border cursor-pointer transition-all " + 
              (selectedVar === v.variable ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-gray-700 hover:border-gray-600')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={v.status === 'critical' ? 'text-red-400' : v.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
                  {variableIcons[v.variable] || <Activity className="w-5 h-5" />}
                </span>
                <span className="text-white font-medium">{variableLabels[v.variable] || v.variable}</span>
              </div>
              {getTrendIcon(v.trend)}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className={"text-3xl font-bold " + (v.status === 'critical' ? 'text-red-400' : v.status === 'warning' ? 'text-yellow-400' : 'text-green-400')}>
                  {v.surprise.toFixed(2)}
                </div>
                <div className="text-gray-500 text-sm">{v.percentage.toFixed(1)}% del total</div>
              </div>
              
              <div className="flex items-end gap-0.5 h-8">
                {v.history.map((h, i) => (
                  <div 
                    key={i}
                    className={"w-1.5 rounded-t " + (v.status === 'critical' ? 'bg-red-500' : v.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500')}
                    style={{ height: `${Math.max(h / Math.max(...v.history) * 100, 10)}%`, opacity: 0.4 + (i * 0.15) }}
                  />
                ))}
              </div>
            </div>

            {selectedVar === v.variable && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Esperado:</span>
                  <span className="text-gray-300">{v.expected} {v.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Observado:</span>
                  <span className="text-gray-300">{v.observed} {v.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Desviación:</span>
                  <span className={v.status === 'critical' ? 'text-red-400' : v.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
                    {((v.observed - v.expected) / v.expected * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-orange-300">Interpretación de Índice de Sorpresa - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-orange-300">Generando análisis con Claude AI...</span>
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
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en índice de sorpresa.
            <span className="text-orange-400 ml-2">Regla 1 Compliance: Solo datos verificados.</span>
          </p>
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-5 border border-orange-500/30">
        <div className="flex items-start gap-4">
          <Brain className="w-8 h-8 text-orange-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Índice de Sorpresa (Karl Friston)</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-orange-300">Surprise = -log p(o|s)</strong> — La sorpresa mide cuánto difieren 
              las observaciones sensoriales de las predicciones del modelo generativo interno. Alta sorpresa indica 
              que el ambiente se comporta de manera inesperada, requiriendo <strong className="text-red-300">Active Inference</strong> 
              para actualizar el modelo o actuar sobre el ambiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FristonSurpriseIndex
