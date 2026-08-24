import { useState, useEffect } from 'react'
import { Sprout, Zap, TrendingUp, Clock, RefreshCw, Scissors, Activity } from 'lucide-react'

interface MorphogenesisData {
  section: string
  timestamp: string
  morphogenesis_state: {
    perturbation_index: number
    regeneration_potential: number
    meristem_activation_prob: number
    lai_recovery_rate: number
    field_state: string
    vmem_gradient: number
    wound_signal_intensity: number
  }
  phenology_timeline: Array<{
    stage: string
    target_gdd: number
    status: string
    goal: string
  }>
  growth_direction: {
    vegetative: number
    reproductive: number
    maintenance: number
  }
  lai_trajectory: Array<{ week: number; lai: number }>
  current_gdd: number
  pruning_event: {
    date: string
    intensity: number
    type: string
    days_since: number
  }
  stress_growth_balance: {
    stress: number
    growth_potential: number
  }
}

const FALLBACK_DATA: MorphogenesisData = {
  section: 'S1',
  timestamp: new Date().toISOString(),
  morphogenesis_state: {
    perturbation_index: 0.35,
    regeneration_potential: 0.72,
    meristem_activation_prob: 0.58,
    lai_recovery_rate: 0.12,
    field_state: 'perturbed',
    vmem_gradient: 8.5,
    wound_signal_intensity: 0.42
  },
  phenology_timeline: [
    { stage: 'FEN-01', target_gdd: 0, status: 'completed', goal: 'dormancy' },
    { stage: 'FEN-02', target_gdd: 200, status: 'completed', goal: 'vegetative_growth' },
    { stage: 'FEN-03', target_gdd: 350, status: 'completed', goal: 'flowering' },
    { stage: 'FEN-04', target_gdd: 450, status: 'current', goal: 'fruit_set' },
    { stage: 'FEN-05', target_gdd: 830, status: 'pending', goal: 'fruit_development' },
    { stage: 'FEN-06', target_gdd: 950, status: 'pending', goal: 'fruit_maturation' },
    { stage: 'FEN-07', target_gdd: 1200, status: 'pending', goal: 'seed_dispersal' }
  ],
  growth_direction: { vegetative: 0.25, reproductive: 0.55, maintenance: 0.20 },
  lai_trajectory: [
    { week: 0, lai: 3.5 },
    { week: 1, lai: 3.62 },
    { week: 2, lai: 3.74 },
    { week: 3, lai: 3.86 },
    { week: 4, lai: 3.98 }
  ],
  current_gdd: 485,
  pruning_event: {
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    intensity: 12,
    type: 'maintenance',
    days_since: 45
  },
  stress_growth_balance: { stress: 0.15, growth_potential: 0.72 }
}

export function LevinMorphogenesis({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<MorphogenesisData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/morphogenesis/${section}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching morphogenesis:', err)
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

  const getFieldStateColor = (state: string) => {
    switch (state) {
      case 'stable': return 'bg-green-600'
      case 'perturbed': return 'bg-yellow-600'
      case 'reprogramming': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'current': return 'bg-blue-500 animate-pulse'
      case 'pending': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sprout className="w-8 h-8 text-green-400" />
          Levin Layer - Morphogenesis
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">{section}</span>
          <button onClick={fetchData} className="p-2 bg-industrial-dark rounded-lg hover:bg-industrial-light" title="Refresh">
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Pruning Perturbation Index */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-400" />
            Pruning Perturbation Index
          </h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="10" fill="none" />
              <circle cx="64" cy="64" r="56" stroke="#a855f7" strokeWidth="10" fill="none" strokeDasharray={`${d.morphogenesis_state.perturbation_index * 352} 352`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-purple-400">{Math.round(d.morphogenesis_state.perturbation_index * 100)}%</span>
            </div>
          </div>
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getFieldStateColor(d.morphogenesis_state.field_state)}`}>
              {d.morphogenesis_state.field_state.toUpperCase()}
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            PPI = PI × (1 - days/90) × phenology_sensitivity
          </div>
        </div>

        {/* Regeneration Potential */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-green-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-400" />
            Regeneration Potential
          </h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-green-400">{Math.round(d.morphogenesis_state.regeneration_potential * 100)}%</div>
            <div className="text-sm text-gray-400 mt-2">Capacity to regenerate post-pruning</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="h-4 rounded-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: `${d.morphogenesis_state.regeneration_potential * 100}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-800 rounded">
              <div className="text-gray-400">LAI Recovery</div>
              <div className="text-white font-bold">{d.morphogenesis_state.lai_recovery_rate.toFixed(2)}/week</div>
            </div>
            <div className="text-center p-2 bg-gray-800 rounded">
              <div className="text-gray-400">Vmem Gradient</div>
              <div className="text-yellow-400 font-bold">+{d.morphogenesis_state.vmem_gradient.toFixed(1)} mV</div>
            </div>
          </div>
        </div>

        {/* Meristem Activation */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Meristem Activation
          </h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-blue-400">{Math.round(d.morphogenesis_state.meristem_activation_prob * 100)}%</div>
            <div className="text-sm text-gray-400 mt-2">Probability of bud activation</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Wound Signal</span>
              <span className="text-orange-400">{Math.round(d.morphogenesis_state.wound_signal_intensity * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-orange-500" style={{ width: `${d.morphogenesis_state.wound_signal_intensity * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Based on logistic model: P(activation) = σ(β₀ + β₁×PI + β₂×temp + β₃×LAI)
          </div>
        </div>

        {/* Phenology Timeline */}
        <div className="col-span-8 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Phenology Timeline (GDD: {d.current_gdd})
          </h3>
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-700 rounded"></div>
            <div className="flex justify-between relative">
              {d.phenology_timeline.map((stage, idx) => (
                <div key={stage.stage} className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full ${getStatusColor(stage.status)} flex items-center justify-center text-white text-xs font-bold`}>
                    {idx + 1}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${stage.status === 'current' ? 'text-blue-400' : 'text-gray-400'}`}>
                      {stage.stage}
                    </div>
                    <div className="text-xs text-gray-500">{stage.target_gdd} GDD</div>
                    <div className="text-xs text-gray-600 capitalize">{stage.goal.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Direction */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Growth Direction
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Vegetative</span>
                <span className="text-green-400">{Math.round(d.growth_direction.vegetative * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-green-500" style={{ width: `${d.growth_direction.vegetative * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Reproductive</span>
                <span className="text-purple-400">{Math.round(d.growth_direction.reproductive * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-purple-500" style={{ width: `${d.growth_direction.reproductive * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Maintenance</span>
                <span className="text-blue-400">{Math.round(d.growth_direction.maintenance * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-blue-500" style={{ width: `${d.growth_direction.maintenance * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* LAI Recovery Trajectory */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4">LAI Recovery Trajectory</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {d.lai_trajectory.map((point, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-green-500/30 rounded-t relative" style={{ height: `${(point.lai / 5) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-medium">
                    {point.lai.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">W{point.week}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            Projected LAI recovery over next 4 weeks
          </div>
        </div>

        {/* Stress vs Growth Balance */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4">Stress vs Growth Balance</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#374151" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray={`${d.stress_growth_balance.stress * 251} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-red-400">{Math.round(d.stress_growth_balance.stress * 100)}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-2">Stress Level</div>
            </div>
            <div className="text-4xl text-gray-600">⚖️</div>
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#374151" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray={`${d.stress_growth_balance.growth_potential * 251} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-400">{Math.round(d.stress_growth_balance.growth_potential * 100)}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-2">Growth Potential</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
              d.stress_growth_balance.growth_potential > d.stress_growth_balance.stress * 2
                ? 'bg-green-600/30 text-green-400'
                : d.stress_growth_balance.growth_potential > d.stress_growth_balance.stress
                  ? 'bg-yellow-600/30 text-yellow-400'
                  : 'bg-red-600/30 text-red-400'
            }`}>
              {d.stress_growth_balance.growth_potential > d.stress_growth_balance.stress * 2
                ? 'OPTIMAL GROWTH CONDITIONS'
                : d.stress_growth_balance.growth_potential > d.stress_growth_balance.stress
                  ? 'MODERATE GROWTH CONDITIONS'
                  : 'STRESS LIMITING GROWTH'}
            </span>
          </div>
        </div>

        {/* Last Pruning Event */}
        <div className="col-span-12 bg-industrial-dark rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-400" />
            Last Pruning Event
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm">Date</div>
              <div className="text-white font-bold">{new Date(d.pruning_event.date).toLocaleDateString()}</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm">Days Since</div>
              <div className="text-white font-bold">{d.pruning_event.days_since} days</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm">Intensity</div>
              <div className="text-purple-400 font-bold">{d.pruning_event.intensity}%</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm">Type</div>
              <div className="text-white font-bold capitalize">{d.pruning_event.type}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-start gap-3">
          <Sprout className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">Morphogenesis (Levin Framework):</span>{' '}
            Based on Michael Levin's research on morphogenetic fields. Pruning perturbs the plant's 
            bioelectric field, triggering regeneration responses. The Perturbation Index (PPI) measures 
            field disruption, while Regeneration Potential indicates the plant's capacity to recover 
            and potentially reprogram its developmental trajectory.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevinMorphogenesis
