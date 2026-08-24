import { useState, useEffect } from 'react'
import { Target, Zap, TrendingUp, AlertTriangle, CheckCircle, Scissors, Clock, ArrowRight, RefreshCw, Brain, BookOpen, HelpCircle, Info } from 'lucide-react'

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
    'Water level (46%) supports fruit_set',
    'Nutrient balance supports fruit_set'
  ],
  blocking_factors: [],
  next_goal: {
    name: 'fruit_development',
    transition_readiness: 0.35
  },
  recommendations: [
    { action: 'apply_p', target: '55 ppm', current: '42 ppm', reason: 'P deficiency limiting fruit_set', priority: 'high' },
    { action: 'avoid_pruning', reason: 'Pruning during FEN-04 would harm fruit_set', priority: 'high' },
    { action: 'ensure_pollination', reason: 'Fruit set requires optimal pollination', priority: 'medium' }
  ],
  pruning: {
    last_event: { date: '2025-11-22', intensity: 12, type: 'maintenance', days_since: 45 },
    impact_on_goal: -0.024,
    optimal_window: false,
    recommendation: 'AVOID',
    goal_shift_probability: 0.15
  },
  phenology: 'FEN-04',
  gdd: 1294
}

const getAlignmentInterpretation = (score: number): { level: string; color: string; description: string } => {
  if (score >= 0.8) return { level: 'ÓPTIMO', color: 'text-green-400', description: 'Las prácticas agronómicas están perfectamente alineadas con el objetivo bioeléctrico de la planta. Máxima eficiencia esperada.' }
  if (score >= 0.6) return { level: 'BUENO', color: 'text-yellow-400', description: 'Alineación aceptable. Algunas prácticas podrían optimizarse para mejorar la sincronía con los objetivos de la planta.' }
  if (score >= 0.4) return { level: 'MODERADO', color: 'text-orange-400', description: 'Conflicto parcial entre manejo y objetivos de la planta. Se recomienda revisar las prácticas actuales.' }
  return { level: 'CRÍTICO', color: 'text-red-400', description: 'Alto conflicto. Las acciones actuales contradicen los objetivos bioeléctricos de la planta. Intervención urgente requerida.' }
}

const getPruningWindowInterpretation = (optimal: boolean, impact: number): string => {
  if (optimal) return 'Ventana óptima de poda abierta. La planta está en una fase donde la poda estimulará crecimiento reproductivo sin pérdida significativa de rendimiento.'
  if (impact < -0.2) return 'EVITAR PODA. La planta está en fase crítica donde la poda causaría pérdida severa de rendimiento (>20%).'
  if (impact < 0) return 'Poda no recomendada. Impacto negativo moderado en el objetivo actual.'
  return 'Poda neutral. No hay beneficio ni perjuicio significativo en este momento.'
}

const getGoalShiftInterpretation = (prob: number): string => {
  if (prob >= 0.5) return 'Alta probabilidad de reprogramación bioeléctrica. La poda en este momento podría cambiar el objetivo de la planta de vegetativo a reproductivo (según modelo de Levin).'
  if (prob >= 0.2) return 'Probabilidad moderada de cambio de objetivo. La planta podría responder a estímulos externos modificando su patrón bioeléctrico.'
  return 'Baja probabilidad de cambio. El patrón bioeléctrico actual es estable y la planta mantiene su objetivo definido.'
}

interface Props {
  section?: string
}

export const LevinLayerDashboard = ({ section = 'S1' }: Props) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/dashboard/${section}`)
      if (response.ok) {
        const result = await response.json()
        const apiData = result.data || result
        const transformed: DashboardData = {
          section: apiData.section || section,
          timestamp: apiData.timestamp || new Date().toISOString(),
          current_goal: {
            name: apiData.current_goal || 'unknown',
            display_name: (apiData.current_goal || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            progress: apiData.goal_progress || 0
          },
          alignment_score: apiData.alignment_score || 0,
          supporting_factors: apiData.supporting_factors || [],
          blocking_factors: apiData.blocking_factors || [],
          next_goal: {
            name: apiData.next_goal || null,
            transition_readiness: apiData.transition_readiness || 0
          },
          recommendations: apiData.recommendations || [],
          pruning: {
            last_event: {
              date: new Date().toISOString(),
              intensity: 12,
              type: 'maintenance',
              days_since: 45
            },
            impact_on_goal: apiData.pruning_impact || 0,
            optimal_window: apiData.optimal_pruning_window || false,
            recommendation: apiData.optimal_pruning_window ? 'OPTIMAL' : 'AVOID',
            goal_shift_probability: apiData.goal_shift_probability || 0
          },
          phenology: 'FEN-04',
          gdd: 0
        }
        setData(transformed)
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

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [section])

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
      default:
        return 'bg-red-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-yellow-600'
      default: return 'bg-blue-600'
    }
  }

  const alignmentInterp = getAlignmentInterpretation(d.alignment_score)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Levin Layer Dashboard</h2>
            <p className="text-gray-400 text-sm">Bioelectric Goal Alignment & Pruning Integration</p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-industrial-dark rounded-lg border border-industrial-light hover:border-green-500/50 transition-colors"
        >
          <RefreshCw className={loading ? 'w-4 h-4 text-green-400 animate-spin' : 'w-4 h-4 text-green-400'} />
          <span className="text-sm text-gray-300">Refresh</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Current Bioelectric Goal */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Current Bioelectric Goal</span>
            </div>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute right-0 top-6 w-64 p-3 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-gray-300">
                <strong className="text-green-400">Objetivo Bioeléctrico:</strong> Meta fisiológica que la planta persigue según su patrón de voltaje celular. Basado en la teoría de Michael Levin sobre cognición bioeléctrica.
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{d.current_goal.display_name}</div>
          <div className="text-sm text-gray-400 mb-4">Progress: {Math.round(d.current_goal.progress * 100)}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${d.current_goal.progress * 100}%` }}
            />
          </div>
        </div>

        {/* Goal Alignment Score */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Goal Alignment Score</span>
            </div>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute right-0 top-6 w-72 p-3 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-gray-300">
                <strong className="text-yellow-400">Puntuación de Alineación:</strong><br/>
                <span className="text-green-400">80-100%:</span> Óptimo - prácticas en sincronía<br/>
                <span className="text-yellow-400">60-79%:</span> Bueno - mejoras posibles<br/>
                <span className="text-orange-400">40-59%:</span> Moderado - revisar prácticas<br/>
                <span className="text-red-400">&lt;40%:</span> Crítico - conflicto alto
              </div>
            </div>
          </div>
          <div className={`text-5xl font-bold ${getAlignmentColor(d.alignment_score)}`}>
            {Math.round(d.alignment_score * 100)}%
          </div>
          <div className={`text-sm mt-2 ${alignmentInterp.color}`}>{alignmentInterp.level}</div>
        </div>

        {/* Pruning Status */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400 text-sm">Pruning Status</span>
            </div>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute right-0 top-6 w-64 p-3 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-gray-300">
                <strong className="text-orange-400">Estado de Poda:</strong> Indica si es momento óptimo para podar según la fase fenológica y el objetivo bioeléctrico actual de la planta.
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Last pruning:</span>
              <span className="text-white">{d.pruning.last_event.days_since} days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Intensity:</span>
              <span className="text-white">{d.pruning.last_event.intensity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Impact on Goal:</span>
              <span className={d.pruning.impact_on_goal >= 0 ? 'text-green-400' : 'text-red-400'}>
                {d.pruning.impact_on_goal >= 0 ? '+' : ''}{Math.round(d.pruning.impact_on_goal * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Pruning Window:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getPruningRecommendationColor(d.pruning.recommendation)}`}>
                {d.pruning.recommendation}
              </span>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Bioelectric Goal Shift</span>
            </div>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute right-0 top-6 w-64 p-3 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-gray-300">
                <strong className="text-purple-400">Cambio de Objetivo:</strong> Probabilidad de que la poda reprograme el patrón bioeléctrico de la planta, cambiando su objetivo de vegetativo a reproductivo.
              </div>
            </div>
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
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
            <p className="text-sm text-purple-300">Interpretación Científica del Estado Bioeléctrico</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interpretation of Current Goal */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-white font-medium text-sm">Objetivo Bioeléctrico Actual</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              La planta se encuentra en fase de <span className="text-green-400 font-medium">{d.current_goal.display_name}</span> con 
              un progreso del <span className="text-green-400">{Math.round(d.current_goal.progress * 100)}%</span>. 
              Según la teoría de Michael Levin, este objetivo está codificado en el patrón de potencial de membrana (Vmem) 
              de las células, que actúa como un "código morfogenético" guiando el desarrollo de la planta.
            </p>
          </div>

          {/* Interpretation of Alignment */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">Análisis de Alineación</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className={`font-medium ${alignmentInterp.color}`}>Nivel {alignmentInterp.level} ({Math.round(d.alignment_score * 100)}%)</span>: {alignmentInterp.description}
            </p>
          </div>

          {/* Interpretation of Pruning */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scissors className="w-4 h-4 text-orange-400" />
              <span className="text-white font-medium text-sm">Análisis de Poda</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {getPruningWindowInterpretation(d.pruning.optimal_window, d.pruning.impact_on_goal)}
              {' '}Última poda hace <span className="text-orange-400">{d.pruning.last_event.days_since} días</span> con 
              intensidad del <span className="text-orange-400">{d.pruning.last_event.intensity}%</span>.
            </p>
          </div>

          {/* Interpretation of Goal Shift */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium text-sm">Probabilidad de Reprogramación</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {getGoalShiftInterpretation(d.pruning.goal_shift_probability)}
            </p>
          </div>
        </div>

        {/* Scientific Summary */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <span className="text-white font-medium">Resumen Científico:</span>{' '}
              El Levin Layer analiza la planta como un sistema con "intencionalidad bioeléctrica" - donde los patrones de voltaje 
              celular codifican objetivos de desarrollo. La puntuación de alineación ({Math.round(d.alignment_score * 100)}%) 
              refleja cuánto las prácticas agronómicas actuales apoyan vs. contradicen estos objetivos intrínsecos. 
              {d.alignment_score >= 0.7 
                ? ' El estado actual indica sincronía entre manejo y fisiología vegetal.' 
                : ' Se recomienda ajustar las prácticas para mejorar la sincronía con los objetivos de la planta.'}
              <span className="text-green-400 ml-2 font-mono text-xs">
                L = 1 - Σ(action supports goal) × c / Σc
              </span>
            </div>
          </div>
        </div>

        {/* Reference Ranges Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2 px-3">Indicador</th>
                <th className="text-center py-2 px-3">Valor Actual</th>
                <th className="text-center py-2 px-3">Rango Óptimo</th>
                <th className="text-left py-2 px-3">Interpretación</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3">Goal Alignment</td>
                <td className={`text-center py-2 px-3 font-medium ${getAlignmentColor(d.alignment_score)}`}>{Math.round(d.alignment_score * 100)}%</td>
                <td className="text-center py-2 px-3 text-green-400">70-100%</td>
                <td className="py-2 px-3">{d.alignment_score >= 0.7 ? 'Óptimo' : d.alignment_score >= 0.5 ? 'Mejorable' : 'Crítico'}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3">Goal Progress</td>
                <td className="text-center py-2 px-3 font-medium text-green-400">{Math.round(d.current_goal.progress * 100)}%</td>
                <td className="text-center py-2 px-3 text-green-400">Progresivo</td>
                <td className="py-2 px-3">Avance hacia objetivo actual</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-3">Pruning Impact</td>
                <td className={`text-center py-2 px-3 font-medium ${d.pruning.impact_on_goal >= 0 ? 'text-green-400' : 'text-red-400'}`}>{Math.round(d.pruning.impact_on_goal * 100)}%</td>
                <td className="text-center py-2 px-3 text-green-400">&gt; 0%</td>
                <td className="py-2 px-3">{d.pruning.impact_on_goal >= 0 ? 'Beneficioso' : 'Perjudicial'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Goal Shift Prob.</td>
                <td className="text-center py-2 px-3 font-medium text-purple-400">{Math.round(d.pruning.goal_shift_probability * 100)}%</td>
                <td className="text-center py-2 px-3 text-gray-400">Variable</td>
                <td className="py-2 px-3">{d.pruning.goal_shift_probability >= 0.3 ? 'Alta plasticidad' : 'Estable'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">Levin Layer (Bioelectric Cognition):</span>{' '}
            Basado en la investigación de Michael Levin sobre señalización bioeléctrica en morfogénesis.
            Las plantas codifican objetivos de desarrollo en patrones bioeléctricos (potenciales de membrana).
            Esta capa detecta el "estado objetivo" actual de la planta y recomienda acciones que apoyen
            en lugar de contradecir los procesos naturales de desarrollo.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevinLayerDashboard
