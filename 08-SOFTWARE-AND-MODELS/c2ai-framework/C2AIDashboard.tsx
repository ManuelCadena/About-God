/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C²AI DASHBOARD - Conscious Citrus AI Main Dashboard
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Multi-layer visualization for the Conscious Citrus AI framework:
 * - Penrose: Quantum coherence metrics
 * - Friston: Free energy minimization
 * - Levin: Bioelectric goals detection
 * - Hoffman: Kernel reconstruction
 * - Watson: Energy landscape optimization
 * 
 * Author: Dr. José Manuel Cadena
 * Date: January 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  Brain, 
  Zap, 
  Thermometer, 
  Network, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  Sparkles
} from 'lucide-react'

// Types
interface LayerStatus {
  name: string
  status: 'ready' | 'processing' | 'error' | 'idle'
  lastRun: string
  latencyMs: number
  contribution: number
}

interface C2AIState {
  status: 'active' | 'processing' | 'idle' | 'error'
  timestamp: string
  layers: {
    penrose: LayerStatus
    friston: LayerStatus
    levin: LayerStatus
    hoffman: LayerStatus
    watson: LayerStatus
  }
  metrics: {
    freeEnergy: number
    coherenceScore: number
    goalsDetected: number
    kernelConfidence: number
    trajectoryEfficiency: number
  }
  vepCurrent: number
  vepProjected: number
  activeDecisions: number
}

interface Decision {
  id: number
  timestamp: string
  decisionType: string
  section: string
  confidence: number
  urgency: number
  executed: boolean
  rationale: string
}

interface BioelectricGoal {
  goalName: string
  category: string
  confidence: number
  supportingActions: string[]
  contradictingActions: string[]
}

// Layer color configuration
const LAYER_COLORS = {
  penrose: {
    primary: '#9333ea',
    secondary: '#c084fc',
    accent: '#f3e8ff',
    gradient: 'from-purple-600 to-purple-400'
  },
  friston: {
    primary: '#0891b2',
    secondary: '#22d3ee',
    accent: '#ecfeff',
    gradient: 'from-cyan-600 to-cyan-400'
  },
  levin: {
    primary: '#16a34a',
    secondary: '#4ade80',
    accent: '#f0fdf4',
    gradient: 'from-green-600 to-green-400'
  },
  hoffman: {
    primary: '#ea580c',
    secondary: '#fb923c',
    accent: '#fff7ed',
    gradient: 'from-orange-600 to-orange-400'
  },
  watson: {
    primary: '#dc2626',
    secondary: '#f87171',
    accent: '#fef2f2',
    gradient: 'from-red-600 to-red-400'
  }
}

const LAYER_ICONS = {
  penrose: '⚛️',
  friston: '🌡️',
  levin: '⚡',
  hoffman: '🔮',
  watson: '📉'
}

const LAYER_NAMES = {
  penrose: 'Coherencia Cuántica',
  friston: 'Energía Libre',
  levin: 'Objetivos Bio',
  hoffman: 'Kernel State',
  watson: 'Trayectoria Óptima'
}

// API service
const c2aiApi = {
  async getStatus(): Promise<C2AIState> {
    const response = await fetch('/api/v1/c2ai/status')
    return response.json()
  },
  
  async getDecisions(days: number = 7): Promise<Decision[]> {
    const response = await fetch(`/api/v1/c2ai/orchestrator/decisions?days=${days}`)
    return response.json()
  },
  
  async getGoals(section: string): Promise<BioelectricGoal[]> {
    const response = await fetch(`/api/v1/c2ai/levin/goals/${section}`)
    return response.json()
  },
  
  async getFreeEnergy(section: string): Promise<any> {
    const response = await fetch(`/api/v1/c2ai/friston/free-energy/${section}`)
    return response.json()
  },
  
  async runOptimization(): Promise<any> {
    const response = await fetch('/api/v1/c2ai/optimize/vep', { method: 'POST' })
    return response.json()
  }
}

// Components

interface StatusIndicatorProps {
  status: string | undefined
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    active: { color: 'bg-green-500', pulse: true, text: 'Activo' },
    processing: { color: 'bg-yellow-500', pulse: true, text: 'Procesando' },
    idle: { color: 'bg-gray-500', pulse: false, text: 'Inactivo' },
    error: { color: 'bg-red-500', pulse: true, text: 'Error' }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-sm text-gray-300">{config.text}</span>
    </div>
  )
}

interface LayerCardProps {
  layer: keyof typeof LAYER_COLORS
  title: string
  value: number | undefined
  unit?: string
  icon: string
  status?: string
  onClick: () => void
  selected: boolean
}

function LayerCard({ layer, title, value, unit = '', icon, status, onClick, selected }: LayerCardProps) {
  const colors = LAYER_COLORS[layer]
  
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl transition-all duration-300
        ${selected 
          ? `bg-gradient-to-br ${colors.gradient} shadow-lg shadow-${layer}-500/30 scale-105` 
          : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {status === 'processing' && (
          <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
        )}
      </div>
      
      <div className="text-left">
        <p className={`text-xs ${selected ? 'text-white/80' : 'text-gray-400'}`}>
          {title}
        </p>
        <p className={`text-xl font-bold ${selected ? 'text-white' : 'text-gray-100'}`}>
          {value !== undefined ? `${(value * 100).toFixed(1)}${unit}` : '--'}
        </p>
      </div>
      
      {selected && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <ChevronRight className="w-5 h-5 text-white rotate-90" />
        </div>
      )}
    </button>
  )
}

interface VEPGaugeProps {
  current: number
  projected: number
}

function VEPGauge({ current, projected }: VEPGaugeProps) {
  const improvement = ((projected - current) / current * 100).toFixed(1)
  const isPositive = projected > current
  
  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-400">VEP Actual</p>
          <p className="text-lg font-bold text-white">${(current / 1000000).toFixed(2)}M</p>
        </div>
        
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingDown className={`w-5 h-5 ${isPositive ? 'rotate-180' : ''}`} />
          <span className="font-bold">{isPositive ? '+' : ''}{improvement}%</span>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-400">VEP Proyectado</p>
          <p className="text-lg font-bold text-emerald-400">${(projected / 1000000).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  )
}

interface DecisionTimelineProps {
  decisions: Decision[]
}

function DecisionTimeline({ decisions }: DecisionTimelineProps) {
  return (
    <div className="glass-panel p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Decisiones Recientes
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {decisions.slice(0, 5).map((decision) => (
          <div 
            key={decision.id}
            className="flex items-start gap-3 p-2 rounded-lg bg-gray-800/50"
          >
            <div className={`mt-1 w-2 h-2 rounded-full ${
              decision.executed ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white truncate">
                  {decision.decisionType}
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(decision.timestamp).toLocaleTimeString('es-MX', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              <p className="text-xs text-gray-400 truncate">
                {decision.section} • Confianza: {(decision.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
        
        {decisions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay decisiones recientes
          </p>
        )}
      </div>
    </div>
  )
}

interface GoalAlignmentRadarProps {
  goals: BioelectricGoal[]
}

function GoalAlignmentRadar({ goals }: GoalAlignmentRadarProps) {
  const categoryColors: Record<string, string> = {
    growth: 'text-green-400',
    stress: 'text-yellow-400',
    reproduction: 'text-pink-400',
    defense: 'text-red-400'
  }
  
  return (
    <div className="glass-panel p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-green-400" />
        Objetivos Bioeléctricos Detectados
      </h3>
      
      <div className="space-y-2">
        {goals.slice(0, 4).map((goal, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${categoryColors[goal.category] || 'text-gray-300'}`}>
                  {goal.goalName.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-400">
                  {(goal.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    goal.confidence > 0.8 ? 'bg-green-500' :
                    goal.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${goal.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Analizando patrones bioeléctricos...
          </p>
        )}
      </div>
    </div>
  )
}

interface FristonPanelProps {
  section: string
}

function FristonPanel({ section }: FristonPanelProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await c2aiApi.getFreeEnergy(section)
        setData(result)
      } catch (error) {
        console.error('Error fetching free energy:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [section])
  
  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-xl animate-pulse">
        <div className="h-48 bg-gray-700/50 rounded-lg" />
      </div>
    )
  }
  
  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🌡️</span>
          Capa Friston - Energía Libre
        </h3>
        <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
          F = {data?.free_energy?.toFixed(3) || '--'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Divergencia KL</p>
          <p className="text-xl font-bold text-cyan-400">
            {data?.kl_divergence?.toFixed(4) || '--'}
          </p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Urgencia</p>
          <p className="text-xl font-bold text-white">
            {data?.urgency?.toFixed(1) || '--'}/10
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Sorpresa por Variable</h4>
        <div className="space-y-2">
          {data?.surprise_by_variable && Object.entries(data.surprise_by_variable)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([variable, surprise]) => (
              <div key={variable} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-24 capitalize">{variable}</span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                    style={{ width: `${Math.min(100, (surprise as number) * 50)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">
                  {(surprise as number).toFixed(2)}
                </span>
              </div>
            ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Acciones Recomendadas</h4>
        <div className="space-y-2">
          {data?.recommended_actions?.slice(0, 3).map((action: any, idx: number) => (
            <div 
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border-l-2 border-cyan-500"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-white capitalize">
                  {action.type?.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-400">{action.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-cyan-400">
                  {action.urgency}/10
                </p>
                <p className="text-xs text-gray-500">urgencia</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface LayerContributionsProps {
  layers: C2AIState['layers'] | undefined
}

function LayerContributions({ layers }: LayerContributionsProps) {
  if (!layers) return null
  
  const layerData = [
    { key: 'penrose', ...layers.penrose, color: LAYER_COLORS.penrose.primary },
    { key: 'friston', ...layers.friston, color: LAYER_COLORS.friston.primary },
    { key: 'levin', ...layers.levin, color: LAYER_COLORS.levin.primary },
    { key: 'hoffman', ...layers.hoffman, color: LAYER_COLORS.hoffman.primary },
    { key: 'watson', ...layers.watson, color: LAYER_COLORS.watson.primary },
  ]
  
  const totalContribution = layerData.reduce((sum, l) => sum + (l.contribution || 0), 0)
  
  return (
    <div className="glass-panel p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Network className="w-5 h-5" />
        Contribución por Capa al VEP
      </h3>
      
      <div className="flex h-4 rounded-full overflow-hidden mb-6 bg-gray-700">
        {layerData.map((layer) => (
          <div
            key={layer.key}
            className="h-full transition-all duration-500"
            style={{ 
              width: `${((layer.contribution || 0) / totalContribution) * 100}%`,
              backgroundColor: layer.color
            }}
            title={`${LAYER_NAMES[layer.key as keyof typeof LAYER_NAMES]}: ${((layer.contribution || 0) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {layerData.map((layer) => (
          <div key={layer.key} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: layer.color }}
            />
            <p className="text-xs text-gray-400">
              {LAYER_ICONS[layer.key as keyof typeof LAYER_ICONS]}
            </p>
            <p className="text-sm font-bold text-white">
              {((layer.contribution || 0) * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Dashboard Component
export function C2AIDashboard() {
  const [state, setState] = useState<C2AIState | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<keyof typeof LAYER_COLORS | 'all'>('all')
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [goals, setGoals] = useState<BioelectricGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState('S1')
  
  const fetchData = useCallback(async () => {
    try {
      const [statusData, decisionsData, goalsData] = await Promise.all([
        c2aiApi.getStatus(),
        c2aiApi.getDecisions(7),
        c2aiApi.getGoals(selectedSection)
      ])
      
      setState(statusData)
      setDecisions(decisionsData)
      setGoals(goalsData)
    } catch (error) {
      console.error('Error fetching C²AI data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSection])
  
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchData])
  
  const handleRunOptimization = async () => {
    try {
      await c2aiApi.runOptimization()
      fetchData() // Refresh after optimization
    } catch (error) {
      console.error('Error running optimization:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-800/50 rounded-xl" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-800/50 rounded-xl" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 p-6">
      {/* Header */}
      <header className="glass-panel p-4 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-green-500 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Dr. CitrusMax AI
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h1>
              <p className="text-sm text-gray-400">
                Conscious Citrus AI v1.0 • Framework Multi-Capa
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <StatusIndicator status={state?.status} />
            
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="S1">Sección S1</option>
              <option value="S2">Sección S2</option>
              <option value="S3">Sección S3</option>
            </select>
            
            <VEPGauge 
              current={state?.vepCurrent || 1850000} 
              projected={state?.vepProjected || 2960000} 
            />
            
            <button
              onClick={handleRunOptimization}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Optimizar VEP
            </button>
          </div>
        </div>
      </header>
      
      {/* Layer Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <LayerCard
          layer="penrose"
          title={LAYER_NAMES.penrose}
          value={state?.metrics?.coherenceScore}
          unit="%"
          icon={LAYER_ICONS.penrose}
          status={state?.layers?.penrose?.status}
          onClick={() => setSelectedLayer(selectedLayer === 'penrose' ? 'all' : 'penrose')}
          selected={selectedLayer === 'penrose'}
        />
        <LayerCard
          layer="friston"
          title={LAYER_NAMES.friston}
          value={state?.metrics?.freeEnergy ? 1 - state.metrics.freeEnergy : undefined}
          unit="%"
          icon={LAYER_ICONS.friston}
          status={state?.layers?.friston?.status}
          onClick={() => setSelectedLayer(selectedLayer === 'friston' ? 'all' : 'friston')}
          selected={selectedLayer === 'friston'}
        />
        <LayerCard
          layer="levin"
          title={LAYER_NAMES.levin}
          value={state?.metrics?.goalsDetected ? state.metrics.goalsDetected / 5 : undefined}
          icon={LAYER_ICONS.levin}
          status={state?.layers?.levin?.status}
          onClick={() => setSelectedLayer(selectedLayer === 'levin' ? 'all' : 'levin')}
          selected={selectedLayer === 'levin'}
        />
        <LayerCard
          layer="hoffman"
          title={LAYER_NAMES.hoffman}
          value={state?.metrics?.kernelConfidence}
          unit="%"
          icon={LAYER_ICONS.hoffman}
          status={state?.layers?.hoffman?.status}
          onClick={() => setSelectedLayer(selectedLayer === 'hoffman' ? 'all' : 'hoffman')}
          selected={selectedLayer === 'hoffman'}
        />
        <LayerCard
          layer="watson"
          title={LAYER_NAMES.watson}
          value={state?.metrics?.trajectoryEfficiency}
          unit="%"
          icon={LAYER_ICONS.watson}
          status={state?.layers?.watson?.status}
          onClick={() => setSelectedLayer(selectedLayer === 'watson' ? 'all' : 'watson')}
          selected={selectedLayer === 'watson'}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {selectedLayer === 'all' && <LayerContributions layers={state?.layers} />}
          {selectedLayer === 'friston' && <FristonPanel section={selectedSection} />}
          {selectedLayer === 'penrose' && (
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">⚛️</span>
                Capa Penrose - Coherencia Cuántica
              </h3>
              <p className="text-gray-400 mt-4">
                Panel de visualización de coherencia cuántica en desarrollo...
              </p>
            </div>
          )}
          {selectedLayer === 'levin' && (
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <span className="text-2xl">⚡</span>
                Capa Levin - Objetivos Bioeléctricos
              </h3>
              <GoalAlignmentRadar goals={goals} />
            </div>
          )}
          {selectedLayer === 'hoffman' && (
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                Capa Hoffman - Reconstrucción Kernel
              </h3>
              <p className="text-gray-400 mt-4">
                Panel de visualización del kernel en desarrollo...
              </p>
            </div>
          )}
          {selectedLayer === 'watson' && (
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">📉</span>
                Capa Watson - Paisaje Energético
              </h3>
              <p className="text-gray-400 mt-4">
                Panel de visualización del paisaje energético en desarrollo...
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <DecisionTimeline decisions={decisions} />
          <GoalAlignmentRadar goals={goals} />
        </div>
      </div>
      
      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Decisiones Hoy</p>
          <p className="text-2xl font-bold text-white">{state?.activeDecisions || 0}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Objetivos Detectados</p>
          <p className="text-2xl font-bold text-green-400">{state?.metrics?.goalsDetected || 0}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Confianza Kernel</p>
          <p className="text-2xl font-bold text-orange-400">
            {state?.metrics?.kernelConfidence ? `${(state.metrics.kernelConfidence * 100).toFixed(0)}%` : '--'}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Última Actualización</p>
          <p className="text-lg font-bold text-gray-300">
            {state?.timestamp ? new Date(state.timestamp).toLocaleTimeString('es-MX') : '--'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default C2AIDashboard
