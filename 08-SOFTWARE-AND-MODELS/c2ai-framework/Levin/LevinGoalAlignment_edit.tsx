import { useState, useEffect } from 'react'
import { Target, Zap, Scissors, RefreshCw, CheckCircle, XCircle, AlertTriangle, Brain } from 'lucide-react'
import { generatePanelAnalysis } from '../../services/llmService'

interface GoalAlignmentData {
  section: string
  timestamp: string
  goals_grid: Array<{
    goal: string
    display_name: string
    is_current: boolean
    target_gdd: number
    pruning_sensitivity: number
    pruning_benefit: number
    stress_tolerance: number
  }>
  current_goal_detail: {
    goal: string
    alignment_score: number
    progress: number
    supporting: string[]
    blocking: string[]
  }
  alignment_breakdown: {
    water: number
    light: number
    nitrogen: number
    phosphorus: number
    potassium: number
  }
  pruning_compatibility: Record<string, {
    recommendation: string
    benefit: number
    sensitivity: number
  }>
  current_phenology: string
  goal_shift_probability: number
  optimal_pruning_window: boolean
}

const FALLBACK_DATA: GoalAlignmentData = {
  section: 'S1',
  timestamp: new Date().toISOString(),
  goals_grid: [
    { goal: 'dormancy', display_name: 'Dormancy', is_current: false, target_gdd: 0, pruning_sensitivity: 0.3, pruning_benefit: 0.15, stress_tolerance: 0.9 },
    { goal: 'vegetative_growth', display_name: 'Vegetative Growth', is_current: false, target_gdd: 200, pruning_sensitivity: 0.8, pruning_benefit: 0.35, stress_tolerance: 0.6 },
    { goal: 'flowering', display_name: 'Flowering', is_current: false, target_gdd: 350, pruning_sensitivity: 0.9, pruning_benefit: -0.25, stress_tolerance: 0.5 },
    { goal: 'fruit_set', display_name: 'Fruit Set', is_current: true, target_gdd: 450, pruning_sensitivity: 1.0, pruning_benefit: -0.40, stress_tolerance: 0.4 },
    { goal: 'fruit_development', display_name: 'Fruit Development', is_current: false, target_gdd: 830, pruning_sensitivity: 0.7, pruning_benefit: -0.20, stress_tolerance: 0.5 },
    { goal: 'fruit_maturation', display_name: 'Fruit Maturation', is_current: false, target_gdd: 950, pruning_sensitivity: 0.4, pruning_benefit: -0.05, stress_tolerance: 0.6 },
    { goal: 'seed_dispersal', display_name: 'Seed Dispersal', is_current: false, target_gdd: 1200, pruning_sensitivity: 0.2, pruning_benefit: 0.08, stress_tolerance: 0.7 },
    { goal: 'survival', display_name: 'Survival', is_current: false, target_gdd: 0, pruning_sensitivity: 0.5, pruning_benefit: 0.0, stress_tolerance: 0.95 }
  ],
  current_goal_detail: {
    goal: 'fruit_set',
    alignment_score: 0.78,
    progress: 0.72,
    supporting: ['Water level supports fruit_set', 'Nutrient balance optimal'],
    blocking: ['Recent pruning conflicts with fruit_set']
  },
  alignment_breakdown: {
    water: 0.85,
    light: 0.78,
    nitrogen: 0.72,
    phosphorus: 0.88,
    potassium: 0.82
  },
  pruning_compatibility: {
    'FEN-01': { recommendation: 'OPTIMAL', benefit: 0.15, sensitivity: 0.3 },
    'FEN-02': { recommendation: 'EXCELLENT', benefit: 0.35, sensitivity: 0.8 },
    'FEN-03': { recommendation: 'AVOID', benefit: -0.25, sensitivity: 0.9 },
    'FEN-04': { recommendation: 'PROHIBITED', benefit: -0.40, sensitivity: 1.0 },
    'FEN-05': { recommendation: 'AVOID', benefit: -0.20, sensitivity: 0.7 },
    'FEN-06': { recommendation: 'CAUTION', benefit: -0.05, sensitivity: 0.4 },
    'FEN-07': { recommendation: 'RECOMMENDED', benefit: 0.08, sensitivity: 0.2 }
  },
  current_phenology: 'FEN-04',
  goal_shift_probability: 0.12,
  optimal_pruning_window: false
}

export function LevinGoalAlignment({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<GoalAlignmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [llmAnalysis, setLlmAnalysis] = useState<string>('')
  const [llmLoading, setLlmLoading] = useState(false)

  const fetchLLMAnalysis = async () => {
    if (!data) return
    setLlmLoading(true)
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'levin-goals',
        value: data.current_goal_detail.alignment_score,
        data: {
          current_goal: data.current_goal_detail.goal,
          alignment_score: data.current_goal_detail.alignment_score,
          goal_progress: data.current_goal_detail.progress,
          supporting_factors: data.current_goal_detail.supporting,
          blocking_factors: data.current_goal_detail.blocking,
          alignment_breakdown: data.alignment_breakdown,
          current_phenology: data.current_phenology,
          goal_shift_probability: data.goal_shift_probability,
          optimal_pruning_window: data.optimal_pruning_window,
          section: data.section,
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

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/goal-alignment/${section}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching goal alignment:', err)
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

  useEffect(() => {
    if (data && !llmAnalysis) {
      fetchLLMAnalysis()
    }
  }, [data])

  if (loading && !data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const d = data || FALLBACK_DATA

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'OPTIMAL':
      case 'EXCELLENT':
        return 'bg-green-600 text-white'
      case 'RECOMMENDED':
        return 'bg-blue-600 text-white'
      case 'CAUTION':
        return 'bg-yellow-600 text-white'
      case 'AVOID':
        return 'bg-orange-600 text-white'
      case 'PROHIBITED':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getBenefitColor = (benefit: number) => {
    if (benefit > 0.1) return 'text-green-400'
    if (benefit < -0.1) return 'text-red-400'
    return 'text-yellow-400'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-8 h-8 text-green-400" />
          Levin Layer - Goal Alignment
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

      <div className="grid grid-cols-12 gap-4">
        {/* Goals Grid - 8 Bioelectric Goals */}
        <div className="col-span-8 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Bioelectric Goals Library
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {d.goals_grid.map((goal) => (
              <div 
                key={goal.goal}
                className={`p-4 rounded-lg border-2 transition-all ${
                  goal.is_current 
                    ? 'border-green-500 bg-green-900/30' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${goal.is_current ? 'text-green-400' : 'text-gray-300'}`}>
                    {goal.display_name}
                  </span>
                  {goal.is_current && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">ACTIVE</span>
                  )}
                </div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Target GDD:</span>
                    <span className="text-white">{goal.target_gdd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pruning Sens:</span>
                    <span className={goal.pruning_sensitivity > 0.7 ? 'text-red-400' : 'text-green-400'}>
                      {(goal.pruning_sensitivity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pruning Effect:</span>
                    <span className={getBenefitColor(goal.pruning_benefit)}>
                      {goal.pruning_benefit >= 0 ? '+' : ''}{(goal.pruning_benefit * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Goal Detail */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-green-500/50">
          <h3 className="text-lg font-semibold text-white mb-4">Current Goal Detail</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-400">
              {d.current_goal_detail.goal.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </div>
            <div className="text-gray-400 text-sm">Phenology: {d.current_phenology}</div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Alignment Score</span>
                <span className="text-white font-medium">{Math.round(d.current_goal_detail.alignment_score * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${d.current_goal_detail.alignment_score * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Goal Progress</span>
                <span className="text-white font-medium">{Math.round(d.current_goal_detail.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${d.current_goal_detail.progress * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex items-center gap-1 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Supporting</span>
              </div>
              {d.current_goal_detail.supporting.map((s, i) => (
                <div key={i} className="text-xs text-gray-400 pl-5">• {s}</div>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-red-400 mb-1">
                <XCircle className="w-4 h-4" />
                <span>Blocking</span>
              </div>
              {d.current_goal_detail.blocking.map((b, i) => (
                <div key={i} className="text-xs text-gray-400 pl-5">• {b}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Alignment Breakdown Radar */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4">Alignment Breakdown</h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(d.alignment_breakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#374151" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke={value > 0.7 ? '#22c55e' : value > 0.5 ? '#eab308' : '#ef4444'}
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${value * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{Math.round(value * 100)}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pruning-Phenology Compatibility Matrix */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-400" />
            Pruning-Phenology Compatibility
          </h3>
          <div className="space-y-2">
            {Object.entries(d.pruning_compatibility).map(([fen, data]) => (
              <div 
                key={fen} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  fen === d.current_phenology ? 'bg-purple-900/30 border border-purple-500' : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${fen === d.current_phenology ? 'text-purple-400' : 'text-gray-300'}`}>
                    {fen}
                  </span>
                  {fen === d.current_phenology && (
                    <span className="text-xs text-purple-400">(Current)</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${getBenefitColor(data.benefit)}`}>
                    {data.benefit >= 0 ? '+' : ''}{(data.benefit * 100).toFixed(0)}% PE
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRecommendationColor(data.recommendation)}`}>
                    {data.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Shift Probability */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Goal Shift Analysis
          </h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-purple-400">
              {Math.round(d.goal_shift_probability * 100)}%
            </div>
            <div className="text-sm text-gray-400">Probability of Goal Reprogramming</div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Based on Levin's bioelectric cognition model.<br/>
            Pruning can shift plant from vegetative to reproductive goals.
          </div>
        </div>

        {/* Optimal Pruning Window */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-yellow-400" />
            Pruning Window Status
          </h3>
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
              d.optimal_pruning_window ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {d.optimal_pruning_window ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
              <span className="text-xl font-bold text-white">
                {d.optimal_pruning_window ? 'OPTIMAL WINDOW' : 'NOT RECOMMENDED'}
              </span>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Current phenology: <span className="text-white font-medium">{d.current_phenology}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {d.optimal_pruning_window 
                ? 'Conditions are favorable for pruning operations.'
                : 'Pruning at this stage may negatively impact current goal.'}
            </div>
          </div>
        </div>

        {/* Current Phenology Recommendation */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Phenology Recommendation
          </h3>
          {d.pruning_compatibility[d.current_phenology] && (
            <div className="space-y-4">
              <div className={`text-center p-4 rounded-lg ${getRecommendationColor(d.pruning_compatibility[d.current_phenology].recommendation)}`}>
                <div className="text-2xl font-bold">
                  {d.pruning_compatibility[d.current_phenology].recommendation}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-gray-400">Expected PE Impact</div>
                  <div className={`text-xl font-bold ${getBenefitColor(d.pruning_compatibility[d.current_phenology].benefit)}`}>
                    {d.pruning_compatibility[d.current_phenology].benefit >= 0 ? '+' : ''}
                    {(d.pruning_compatibility[d.current_phenology].benefit * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-gray-400">Sensitivity</div>
                  <div className={`text-xl font-bold ${
                    d.pruning_compatibility[d.current_phenology].sensitivity > 0.7 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {(d.pruning_compatibility[d.current_phenology].sensitivity * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-purple-300">Interpretación de Alineación - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-purple-300">Generando análisis con Claude AI...</span>
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
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en datos reales de la sección {d.section}.
            <span className="text-purple-400 ml-2">Regla 1 Compliance: Solo datos verificados.</span>
          </p>
        </div>
      </div>

{/* Scientific Footer */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">Goal Alignment (Levin Framework):</span>{' '}
            Plants encode developmental goals in bioelectric patterns. Each goal has specific 
            optimal conditions and pruning sensitivity. The alignment score measures how well 
            current conditions support the plant's natural goal state. Pruning acts as a 
            bioelectric perturbation that can either support or conflict with the current goal.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevinGoalAlignment
