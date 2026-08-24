import React, { useState, useEffect, useCallback } from 'react'
import { Target, Zap, TrendingUp, AlertTriangle, CheckCircle, Scissors, Clock, ArrowRight, RefreshCw, Brain, Info, HelpCircle } from 'lucide-react'

interface DashboardData {
  section: string
  timestamp: string
  current_goal: {
    name: string
    display_name: string
    progress: number
  }
  alignment_score: number
  supporting_factors: string[]
  blocking_factors: string[]
  next_goal: {
    name: string | null
    transition_readiness: number
  }
  recommendations: Array<{
    action: string
    reason: string
    priority: string
    target?: string
    current?: string
  }>
  pruning: {
    last_event: {
      date: string
      intensity: number
      type: string
      days_since: number
    }
    impact_on_goal: number
    optimal_window: boolean
    recommendation: string
    goal_shift_probability: number
  }
  phenology: string
  gdd: number
}

const FALLBACK_DATA: DashboardData = {
  section: 'S1',
  timestamp: new Date().toISOString(),
  current_goal: {
    name: 'fruit_set',
    display_name: 'Fruit Set',
    progress: 0.72
  },
  alignment_score: 0.78,
  supporting_factors: [
    'Water level (45%) supports fruit_set',
    'Nutrient balance supports fruit_set'
  ],
  blocking_factors: [
    'Recent pruning (15%) conflicts with fruit_set'
  ],
  next_goal: {
    name: 'fruit_development',
    transition_readiness: 0.65
  },
  recommendations: [
    { action: 'avoid_pruning', reason: 'Pruning during FEN-04 would harm fruit_set', priority: 'high' },
    { action: 'ensure_pollination', reason: 'Fruit set requires optimal pollination conditions', priority: 'medium' },
    { action: 'adjust_irrigation', reason: 'Optimize water for fruit_set', priority: 'medium', target: '48%', current: '45%' }
  ],
  pruning: {
    last_event: {
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      intensity: 12,
      type: 'maintenance',
      days_since: 45
    },
    impact_on_goal: -0.15,
    optimal_window: false,
    recommendation: 'PROHIBITED',
    goal_shift_probability: 0.12
  },
  phenology: 'FEN-04',
  gdd: 485
}

export function LevinLayerDashboard({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/dashboard/${section}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching Levin dashboard:', err)
      setData(FALLBACK_DATA)
    } finally {
      setLoading(false)
    }
  }

  const generateAIAnalysis = useCallback(() => {
    if (!data) return
    setAiLoading(true)
    
    const d = data
    const alignmentStatus = d.alignment_score >= 0.8 ? 'ÓPTIMO' : d.alignment_score >= 0.6 ? 'ACEPTABLE' : 'CRÍTICO'
    const pruningRisk = d.pruning.recommendation === 'PROHIBITED' ? 'MUY ALTO' : 
                        d.pruning.recommendation === 'AVOID' ? 'ALTO' :
                        d.pruning.recommendation === 'CAUTION' ? 'MODERADO' : 'BAJO'
    
    const analysis = [
      `## Análisis PhD - Objetivo Bioeléctrico Sección ${d.section}`,
      `**Fecha:** ${new Date(d.timestamp).toLocaleString('es-MX')}`,
      `**Fenología:** ${d.phenology} | **GDD Acumulados:** ${d.gdd}`,
      '',
      `### 1. Estado del Objetivo Bioeléctrico`,
      `**Objetivo Actual:** ${d.current_goal.display_name}`,
      `- Progreso: ${Math.round(d.current_goal.progress * 100)}%`,
      `- Alineación: ${Math.round(d.alignment_score * 100)}% (${alignmentStatus})`,
      '',
      `### 2. Análisis de Factores`,
      `**Factores de Soporte (${d.supporting_factors.length}):**`,
      ...d.supporting_factors.map(f => `  ✅ ${f}`),
      '',
      `**Factores de Bloqueo (${d.blocking_factors.length}):**`,
      ...d.blocking_factors.map(f => `  ⚠️ ${f}`),
      '',
      `### 3. Impacto de Poda según Framework Levin`,
      `- Última poda: hace ${d.pruning.last_event.days_since} días`,
      `- Intensidad: ${d.pruning.last_event.intensity}%`,
      `- Tipo: ${d.pruning.last_event.type}`,
      `- Impacto en objetivo: ${d.pruning.impact_on_goal >= 0 ? '+' : ''}${Math.round(d.pruning.impact_on_goal * 100)}%`,
      `- **Riesgo de poda actual:** ${pruningRisk}`,
      `- **Recomendación:** ${d.pruning.recommendation}`,
      '',
      `### 4. Transición de Objetivo`,
      `- Próximo objetivo: ${d.next_goal.name?.replace('_', ' ').replace(/\\b\\w/g, (l: string) => l.toUpperCase()) || 'N/A'}`,
      `- Preparación para transición: ${Math.round(d.next_goal.transition_readiness * 100)}%`,
      `- Probabilidad de cambio de objetivo: ${Math.round(d.pruning.goal_shift_probability * 100)}%`,
      '',
      `### 5. Recomendaciones PhD`,
      ...d.recommendations.slice(0, 3).map(rec => 
        `- **[${rec.priority.toUpperCase()}]** ${rec.action.replace(/_/g, ' ')}: ${rec.reason}`
      ),
      '',
      `### 6. Interpretación Científica`,
      d.alignment_score >= 0.8 ? 
        '✅ El campo bioeléctrico está altamente alineado con el objetivo de desarrollo. Las condiciones actuales soportan el patrón morfogenético óptimo.' :
        d.alignment_score >= 0.6 ?
        '📊 El campo bioeléctrico muestra alineación moderada. Algunos factores están perturbando el patrón óptimo pero el sistema puede compensar.' :
        '⚠️ El campo bioeléctrico está desalineado. Se requiere intervención para restaurar el patrón morfogenético óptimo.',
      '',
      d.pruning.recommendation === 'PROHIBITED' ?
        '🚫 **PODA PROHIBIDA:** La fenología actual es altamente sensible. La poda causaría una perturbación bioeléctrica severa que conflictuaría con el objetivo de ' + d.current_goal.display_name + '.' :
        d.pruning.optimal_window ?
        '✂️ **VENTANA ÓPTIMA:** Las condiciones son favorables para operaciones de poda. El impacto bioeléctrico será mínimo o beneficioso.' :
        '⚠️ **PRECAUCIÓN:** La poda en este momento puede afectar negativamente el objetivo actual.',
      '',
      '---',
      '*Análisis basado en el framework de cognición bioeléctrica de Michael Levin (Tufts University)*',
      '*Los patrones bioeléctricos codifican objetivos de desarrollo que guían el comportamiento celular.*'
    ].join('\n')
    
    setAiAnalysis(analysis)
    setAiLoading(false)
  }, [data])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [section])
  
  useEffect(() => {
    if (data && !aiAnalysis) generateAIAnalysis()
  }, [data, aiAnalysis, generateAIAnalysis])

  if (loading && !data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const d = data || FALLBACK_DATA

  const getAlignmentColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPruningRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'OPTIMAL':
      case 'EXCELLENT':
        return 'bg-green-600'
      case 'RECOMMENDED':
        return 'bg-blue-600'
      case 'CAUTION':
        return 'bg-yellow-600'
      case 'AVOID':
        return 'bg-orange-600'
      case 'PROHIBITED':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600'
      case 'medium':
        return 'bg-yellow-600'
      default:
        return 'bg-blue-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-8 h-8 text-green-400" />
          Levin Layer - Bioelectric Goal Dashboard
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">{section}</span>
          <button 
            onClick={fetchData}
            className="p-2 bg-industrial-dark rounded-lg hover:bg-industrial-light transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Current Goal Gauge - Large */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-green-500/50">
          <div className="text-gray-400 text-sm mb-2">Current Bioelectric Goal</div>
          <div className="text-3xl font-bold text-green-400 mb-4">
            {d.current_goal.display_name}
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#374151"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#22c55e"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${d.current_goal.progress * 440} 440`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-white">{Math.round(d.current_goal.progress * 100)}%</span>
              <span className="text-sm text-gray-400">Progress</span>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            Phenology: <span className="text-white font-medium">{d.phenology}</span> | 
            GDD: <span className="text-white font-medium">{d.gdd}</span>
          </div>
        </div>

        {/* Alignment Score */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="text-gray-400 text-sm mb-2">Goal Alignment Score</div>
          <div className={`text-5xl font-bold ${getAlignmentColor(d.alignment_score)} mb-4`}>
            {Math.round(d.alignment_score * 100)}%
          </div>
          
          {/* Alignment Bar */}
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                d.alignment_score >= 0.8 ? 'bg-green-500' :
                d.alignment_score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${d.alignment_score * 100}%` }}
            />
          </div>

          {/* Supporting/Blocking Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">{d.supporting_factors.length} Supporting</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">{d.blocking_factors.length} Blocking</span>
            </div>
          </div>
        </div>

        {/* Pruning Status Card */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Pruning Status</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Pruning</span>
              <span className="text-white font-medium">{d.pruning.last_event.days_since} days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Intensity</span>
              <span className="text-white font-medium">{d.pruning.last_event.intensity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Type</span>
              <span className="text-white font-medium capitalize">{d.pruning.last_event.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Impact on Goal</span>
              <span className={`font-medium ${d.pruning.impact_on_goal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {d.pruning.impact_on_goal >= 0 ? '+' : ''}{Math.round(d.pruning.impact_on_goal * 100)}%
              </span>
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pruning Window</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPruningRecommendationColor(d.pruning.recommendation)}`}>
                  {d.pruning.recommendation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Factors */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Supporting Factors</span>
          </div>
          <div className="space-y-2">
            {d.supporting_factors.length > 0 ? (
              d.supporting_factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-300">{factor}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No supporting factors identified</div>
            )}
          </div>
        </div>

        {/* Blocking Factors */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white font-medium">Blocking Factors</span>
          </div>
          <div className="space-y-2">
            {d.blocking_factors.length > 0 ? (
              d.blocking_factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-300">{factor}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No blocking factors - optimal conditions!</div>
            )}
          </div>
        </div>

        {/* Next Goal Transition */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Next Goal Transition</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-medium text-white">{d.current_goal.display_name}</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-500" />
            <div className="text-center">
              <div className="text-lg font-medium text-blue-400">
                {d.next_goal.name?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Next</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mb-2">Transition Readiness</div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${d.next_goal.transition_readiness * 100}%` }}
            />
          </div>
          <div className="text-right text-sm text-blue-400 mt-1">
            {Math.round(d.next_goal.transition_readiness * 100)}%
          </div>
        </div>

        {/* Goal Shift Probability */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Bioelectric Goal Shift</span>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-purple-400">
              {Math.round(d.pruning.goal_shift_probability * 100)}%
            </div>
            <div className="text-sm text-gray-400">Probability of Goal Reprogramming</div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Based on Levin's bioelectric cognition model.<br/>
            Pruning can shift plant from vegetative to reproductive goals.
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Top Recommendations</span>
          </div>
          <div className="space-y-3">
            {d.recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getPriorityColor(rec.priority)}`}>
                  {rec.priority.toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium capitalize">
                    {rec.action.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-400">{rec.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PhD AI Analysis Panel */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            Análisis PhD con IA - Objetivo Bioeléctrico
          </h3>
          <button 
            onClick={generateAIAnalysis} 
            disabled={aiLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2 transition-colors"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Regenerar Análisis
              </>
            )}
          </button>
        </div>
        
        {aiLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            <span className="ml-3 text-gray-400">Generando análisis PhD...</span>
          </div>
        ) : aiAnalysis ? (
          <div className="bg-gray-900/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
            {aiAnalysis}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Haz clic en "Regenerar Análisis" para obtener un análisis PhD detallado.</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Análisis basado en el framework de cognición bioeléctrica de Michael Levin (Tufts University).
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">Levin Layer (Bioelectric Cognition):</span>{' '}
            Based on Michael Levin's research on bioelectric signaling in morphogenesis. 
            Plants encode developmental goals in bioelectric patterns (membrane potentials). 
            This layer detects the plant's current "goal state" and recommends actions that 
            support rather than conflict with natural developmental processes.
            <span className="text-green-400 ml-2">
              L<sub>L</sub> = 1 - Σ(action supports goal<sub>j</sub>) × c<sub>j</sub> / Σc<sub>j</sub>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevinLayerDashboard
