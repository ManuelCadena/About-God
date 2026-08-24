import React, { useState, useEffect, useCallback } from 'react'
import { 
  Settings, Scissors, Calendar, Apple, Zap, Leaf,
  TrendingUp, Clock, RefreshCw, Brain, Target,
  Sun, Droplets, Wind, CheckCircle, AlertTriangle,
  ChevronRight, ArrowRight, DollarSign
} from 'lucide-react'
import { 
  MorphogeneticOptimizerData, PhenologyStage, OpportunityWindow,
  QualityPrediction, PruningRecommendation, CalendarEvent,
  MorphogeneticStatus, LEVIN_COLORS 
} from '../shared/types'
import { MetricCard, GaugeCard, StatusBadge } from '../shared/MetricCard'
import { PHDAIAnalysisCard } from '../shared/PHDAIAnalysisCard'

/**
 * ============================================================================
 * MORPHOGENETIC OPTIMIZER - Panel 3
 * ============================================================================
 * Optimization of agricultural operations based on bioelectric signals
 * Integrates phenology, quality, vigor, pruning, and operation calendar
 */

const PHENOLOGY_STAGES: PhenologyStage[] = [
  { code: 'FEN-01', name: 'Latencia', gdd_start: 0, gdd_end: 84, progress: 0, is_current: false },
  { code: 'FEN-02', name: 'Brotación', gdd_start: 85, gdd_end: 144, progress: 0, is_current: false },
  { code: 'FEN-03', name: 'Floración Primaria', gdd_start: 145, gdd_end: 204, progress: 0, is_current: false },
  { code: 'FEN-04', name: 'Cuajado Primario', gdd_start: 205, gdd_end: 314, progress: 0, is_current: false },
  { code: 'FEN-05', name: 'Desarrollo Temprano', gdd_start: 315, gdd_end: 534, progress: 0, is_current: true },
  { code: 'FEN-06', name: 'Maduración Primaria', gdd_start: 535, gdd_end: 684, progress: 0, is_current: false },
  { code: 'FEN-07', name: 'Cosecha Primaria', gdd_start: 685, gdd_end: 784, progress: 0, is_current: false },
]

const FALLBACK_DATA: MorphogeneticOptimizerData = {
  section: 'S1',
  timestamp: new Date().toISOString(),
  phenology_current: PHENOLOGY_STAGES[4],
  phenology_stages: PHENOLOGY_STAGES,
  gdd_accumulated: 1294,
  spray_window: {
    status: 'optimal',
    hours_remaining: 4,
    confidence: 0.92,
    vmem_indicator: -65,
    conditions: [
      { factor: 'Viento', value: 5.2, threshold: 15, ok: true },
      { factor: 'Temperatura', value: 26, threshold: 32, ok: true },
      { factor: 'Humedad', value: 68, threshold: 85, ok: true },
      { factor: 'Lluvia 6h', value: 0, threshold: 5, ok: true },
    ]
  },
  fertigation_window: {
    status: 'open',
    hours_remaining: 8,
    confidence: 0.88,
    vmem_indicator: -62,
    conditions: [
      { factor: 'Humedad Suelo', value: 42, threshold: 30, ok: true },
      { factor: 'ET0', value: 5.2, threshold: 8, ok: true },
    ]
  },
  pruning_window: {
    status: 'closed',
    hours_remaining: 0,
    confidence: 0.95,
    vmem_indicator: -45,
    conditions: [
      { factor: 'Fenología', value: 5, threshold: 3, ok: false },
      { factor: 'Vigor', value: 85, threshold: 70, ok: true },
    ]
  },
  quality_prediction: {
    brix_estimate: 9.2,
    size_estimate: 52,
    color_score: 78,
    harvest_date_optimal: '2026-02-06',
    roi_if_wait: 1.35,
    roi_if_now: 0.92
  },
  vigor_score: 85,
  vigor_factors: [
    { factor: 'Vmem Amplitude', value: 18.5, optimal: 20 },
    { factor: 'LAI', value: 4.2, optimal: 4.5 },
    { factor: 'Light Response', value: 0.88, optimal: 0.9 },
    { factor: 'Growth Rate', value: 2.5, optimal: 3.0 },
  ],
  pruning_recommendation: {
    intensity_pct: 0,
    ppi_score: 0.85,
    goal_conflict: true,
    optimal_date: '2026-03-15',
    recovery_days: 45,
    vep_impact: -125000
  },
  calendar_events: [
    { date: '2026-01-16', type: 'spray', title: 'Fungicida preventivo', priority: 'high', module_source: 'M2', details: 'Azoxystrobin 250 ml/ha' },
    { date: '2026-01-18', type: 'fertigation', title: 'Fertirrigación N-K', priority: 'medium', module_source: 'M3', details: 'KNO3 + Urea' },
    { date: '2026-01-20', type: 'monitoring', title: 'Monitoreo IPF', priority: 'low', module_source: 'M1', details: 'Muestreo S1' },
    { date: '2026-02-06', type: 'harvest', title: 'Inicio cosecha S1', priority: 'high', module_source: 'M6', details: 'Ventana óptima' },
  ],
  morphogenetic_status: {
    regeneration_potential: 92,
    meristem_activation: 78,
    lai_recovery: 95,
    stress_growth_balance: 0.65,
    current_goal: 'fruit_development',
    goal_alignment: 82
  }
}

interface MorphogeneticOptimizerProps {
  section?: string
  onSectionChange?: (section: string) => void
}

export function MorphogeneticOptimizer({ 
  section = 'S1', 
  onSectionChange 
}: MorphogeneticOptimizerProps) {
  const [data, setData] = useState<MorphogeneticOptimizerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(section)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/morphogenetic-optimizer/${activeSection}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching morphogenetic optimizer data:', err)
      setData(FALLBACK_DATA)
    } finally {
      setLoading(false)
    }
  }, [activeSection])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection)
    onSectionChange?.(newSection)
  }

  const generateOptimizerAnalysis = useCallback((d: MorphogeneticOptimizerData) => {
    return [
      `## ⚙️ Análisis PhD - Optimizador Morfogenético`,
      `**Sección:** ${d.section} | **Timestamp:** ${new Date(d.timestamp).toLocaleString('es-MX')}`,
      '',
      `### 1. Estado Fenológico`,
      `- **Fase actual:** ${d.phenology_current.code} - ${d.phenology_current.name}`,
      `- **GDD acumulados:** ${d.gdd_accumulated}`,
      `- **Rango fase:** ${d.phenology_current.gdd_start} - ${d.phenology_current.gdd_end} GDD`,
      '',
      `### 2. Ventanas de Oportunidad`,
      `**Aplicación Foliar:** ${d.spray_window.status === 'optimal' ? '🟢 ÓPTIMA' : d.spray_window.status === 'open' ? '🟡 ABIERTA' : '🔴 CERRADA'}`,
      `- Horas restantes: ${d.spray_window.hours_remaining}h`,
      `- Confianza: ${(d.spray_window.confidence * 100).toFixed(0)}%`,
      '',
      `**Fertirrigación:** ${d.fertigation_window.status === 'optimal' ? '🟢 ÓPTIMA' : d.fertigation_window.status === 'open' ? '🟡 ABIERTA' : '🔴 CERRADA'}`,
      `- Horas restantes: ${d.fertigation_window.hours_remaining}h`,
      '',
      `**Poda:** ${d.pruning_window.status === 'optimal' ? '🟢 ÓPTIMA' : d.pruning_window.status === 'open' ? '🟡 ABIERTA' : '🔴 CERRADA'}`,
      d.pruning_recommendation.goal_conflict 
        ? '⚠️ CONFLICTO: La poda actual afectaría negativamente el objetivo de desarrollo de fruto.'
        : '✅ Sin conflicto con objetivo actual.',
      '',
      `### 3. Predicción de Calidad (M6)`,
      `- **°Brix estimado:** ${d.quality_prediction.brix_estimate.toFixed(1)}`,
      `- **Calibre estimado:** ${d.quality_prediction.size_estimate} mm`,
      `- **Score de color:** ${d.quality_prediction.color_score}%`,
      `- **Fecha cosecha óptima:** ${d.quality_prediction.harvest_date_optimal}`,
      `- **ROI si espera:** ${d.quality_prediction.roi_if_wait.toFixed(2)}x vs ${d.quality_prediction.roi_if_now.toFixed(2)}x ahora`,
      '',
      `### 4. Evaluación de Vigor (M7)`,
      `- **Score de vigor:** ${d.vigor_score}%`,
      ...d.vigor_factors.map(f => `- ${f.factor}: ${f.value} / ${f.optimal} óptimo`),
      '',
      `### 5. Estado Morfogenético (Levin Framework)`,
      `- **Potencial de regeneración:** ${d.morphogenetic_status.regeneration_potential}%`,
      `- **Activación meristemática:** ${d.morphogenetic_status.meristem_activation}%`,
      `- **Recuperación LAI:** ${d.morphogenetic_status.lai_recovery}%`,
      `- **Balance Estrés/Crecimiento:** ${d.morphogenetic_status.stress_growth_balance.toFixed(2)}`,
      `- **Objetivo actual:** ${d.morphogenetic_status.current_goal.replace('_', ' ')}`,
      `- **Alineación con objetivo:** ${d.morphogenetic_status.goal_alignment}%`,
      '',
      `### 6. Interpretación Científica`,
      d.morphogenetic_status.goal_alignment >= 80
        ? '✅ El campo bioeléctrico está alineado con el objetivo morfogenético. Las operaciones deben mantener esta sincronía.'
        : '⚠️ Se detecta desalineación del campo bioeléctrico. Considerar acciones correctivas.',
      '',
      d.morphogenetic_status.stress_growth_balance > 0.5
        ? '🌱 El balance estrés/crecimiento favorece el desarrollo. Condiciones óptimas para maximizar PE.'
        : '⚠️ El balance favorece respuestas de estrés. Revisar factores limitantes.',
      '',
      `### 7. Próximos Eventos`,
      ...d.calendar_events.slice(0, 3).map(e => 
        `- **${e.date}** [${e.priority.toUpperCase()}]: ${e.title} (${e.module_source})`
      ),
      '',
      '---',
      '*Framework Levin: Bioelectric patterns guide morphogenetic decisions*',
      '*Levin, M. (2021). Cell, 184(6), 1971-1989.*'
    ].join('\n')
  }, [])

  const getWindowStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'open': return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'closing': return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
      case 'closed': return 'bg-red-500/20 border-red-500/50 text-red-400'
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    }
  }

  const getWindowStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return '🟢'
      case 'open': return '🟡'
      case 'closing': return '🟠'
      case 'closed': return '🔴'
      default: return '⚪'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'spray': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'fertigation': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'irrigation': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'pruning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'harvest': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'monitoring': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-slate-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <Settings className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-400" />
          </div>
          <p className="text-gray-400">Cargando Optimizador Morfogenético...</p>
        </div>
      </div>
    )
  }

  const d = data || FALLBACK_DATA

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Morphogenetic Optimizer</h1>
            <p className="text-sm text-gray-400">Optimización de Operaciones - Levin Layer 2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            {['S1', 'S2', 'S3'].map((s) => (
              <button
                key={s}
                onClick={() => handleSectionChange(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSection === s 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <button 
            onClick={fetchData}
            className="p-2.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Phenology Timeline */}
        <div className="col-span-8 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-lime-400" />
            <span className="text-white font-medium">Timeline Fenológico</span>
            <span className="ml-auto text-sm text-gray-400">GDD: {d.gdd_accumulated}</span>
          </div>
          
          <div className="relative">
            {/* Progress bar background */}
            <div className="h-3 bg-slate-700 rounded-full mb-4"></div>
            
            {/* Progress bar fill */}
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-lime-500 to-green-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((d.gdd_accumulated / 784) * 100, 100)}%` 
              }}
            ></div>
            
            {/* Stage markers */}
            <div className="flex justify-between mt-2">
              {d.phenology_stages.slice(0, 7).map((stage, idx) => (
                <div 
                  key={stage.code}
                  className={`flex flex-col items-center ${
                    stage.is_current ? 'text-lime-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mb-1 ${
                    stage.is_current 
                      ? 'bg-lime-400 ring-2 ring-lime-400/30' 
                      : d.gdd_accumulated >= stage.gdd_start 
                        ? 'bg-green-500' 
                        : 'bg-slate-600'
                  }`}></div>
                  <span className="text-xs whitespace-nowrap">{stage.code}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Current stage info */}
          <div className="mt-6 p-4 bg-lime-500/10 border border-lime-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">{d.phenology_current.code}</div>
                <div className="text-lime-400">{d.phenology_current.name}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{d.gdd_accumulated}</div>
                <div className="text-sm text-gray-400">
                  de {d.phenology_current.gdd_end} GDD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vigor Score */}
        <div className="col-span-4 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Vigor (M7)</span>
          </div>
          
          <GaugeCard
            title=""
            value={d.vigor_score}
            status={d.vigor_score >= 80 ? 'optimal' : d.vigor_score >= 60 ? 'normal' : 'warning'}
            size="lg"
          />
          
          <div className="mt-4 space-y-2">
            {d.vigor_factors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{factor.factor}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-700 rounded-full">
                    <div 
                      className="h-1.5 bg-yellow-500 rounded-full"
                      style={{ width: `${(factor.value / factor.optimal) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white w-12 text-right">{factor.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunity Windows */}
        <div className="col-span-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ventanas de Oportunidad
          </h3>
          
          {/* Spray Window */}
          <div className={`p-4 rounded-xl border ${getWindowStatusColor(d.spray_window.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-2">
                {getWindowStatusIcon(d.spray_window.status)} Aplicación Foliar
              </span>
              <StatusBadge 
                status={d.spray_window.status === 'optimal' ? 'optimal' : d.spray_window.status === 'open' ? 'normal' : 'critical'} 
                size="sm"
              />
            </div>
            <div className="text-sm text-gray-400">
              {d.spray_window.hours_remaining}h restantes • {(d.spray_window.confidence * 100).toFixed(0)}% conf.
            </div>
            <div className="mt-2 flex gap-1">
              {d.spray_window.conditions.map((c, i) => (
                <span 
                  key={i}
                  className={`text-xs px-1.5 py-0.5 rounded ${c.ok ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {c.factor}
                </span>
              ))}
            </div>
          </div>
          
          {/* Fertigation Window */}
          <div className={`p-4 rounded-xl border ${getWindowStatusColor(d.fertigation_window.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-2">
                {getWindowStatusIcon(d.fertigation_window.status)} Fertirrigación
              </span>
              <StatusBadge 
                status={d.fertigation_window.status === 'optimal' ? 'optimal' : d.fertigation_window.status === 'open' ? 'normal' : 'critical'} 
                size="sm"
              />
            </div>
            <div className="text-sm text-gray-400">
              {d.fertigation_window.hours_remaining}h restantes • {(d.fertigation_window.confidence * 100).toFixed(0)}% conf.
            </div>
          </div>
          
          {/* Pruning Window */}
          <div className={`p-4 rounded-xl border ${getWindowStatusColor(d.pruning_window.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-2">
                {getWindowStatusIcon(d.pruning_window.status)} Poda
              </span>
              <StatusBadge 
                status={d.pruning_window.status === 'optimal' ? 'optimal' : d.pruning_window.status === 'open' ? 'normal' : 'critical'} 
                size="sm"
              />
            </div>
            {d.pruning_recommendation.goal_conflict && (
              <div className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Conflicto con objetivo actual
              </div>
            )}
            <div className="text-sm text-gray-400 mt-1">
              Fecha óptima: {d.pruning_recommendation.optimal_date}
            </div>
          </div>
        </div>

        {/* Quality Prediction */}
        <div className="col-span-4 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">Predicción Calidad (M6)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{d.quality_prediction.brix_estimate.toFixed(1)}</div>
              <div className="text-xs text-gray-400">°Brix</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{d.quality_prediction.size_estimate}</div>
              <div className="text-xs text-gray-400">mm calibre</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{d.quality_prediction.color_score}%</div>
              <div className="text-xs text-gray-400">Color</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-amber-400">{d.quality_prediction.harvest_date_optimal}</div>
              <div className="text-xs text-gray-400">Cosecha óptima</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">ROI si espera:</span>
              <span className="text-green-400 font-bold">{d.quality_prediction.roi_if_wait.toFixed(2)}x</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-400">ROI si cosecha ahora:</span>
              <span className="text-gray-400">{d.quality_prediction.roi_if_now.toFixed(2)}x</span>
            </div>
          </div>
        </div>

        {/* Morphogenetic Status */}
        <div className="col-span-4 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Estado Morfogenético</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Regeneración</span>
                <span className="text-white">{d.morphogenetic_status.regeneration_potential}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${d.morphogenetic_status.regeneration_potential}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Meristemo</span>
                <span className="text-white">{d.morphogenetic_status.meristem_activation}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div 
                  className="h-2 bg-pink-500 rounded-full"
                  style={{ width: `${d.morphogenetic_status.meristem_activation}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">LAI Recovery</span>
                <span className="text-white">{d.morphogenetic_status.lai_recovery}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${d.morphogenetic_status.lai_recovery}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Objetivo actual:</span>
                <span className="text-purple-400 font-medium capitalize">
                  {d.morphogenetic_status.current_goal.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-400 text-sm">Alineación:</span>
                <span className={`font-bold ${
                  d.morphogenetic_status.goal_alignment >= 80 ? 'text-green-400' : 
                  d.morphogenetic_status.goal_alignment >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {d.morphogenetic_status.goal_alignment}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operation Calendar */}
        <div className="col-span-12 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Calendario de Operaciones</span>
            </div>
            <span className="text-sm text-gray-400">Próximos 30 días</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {d.calendar_events.map((event, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                    event.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    event.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {event.priority}
                  </span>
                  <span className="text-xs text-gray-500">{event.module_source}</span>
                </div>
                
                <div className="text-sm font-medium text-white mb-1">{event.title}</div>
                <div className="text-xs text-gray-400 mb-2">{event.details}</div>
                
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PhD AI Analysis */}
        <div className="col-span-12">
          <PHDAIAnalysisCard
            title="Optimizador Morfogenético - Análisis Integrado"
            data={d}
            generateAnalysis={generateOptimizerAnalysis}
            apiEndpoint="/c2ai-api/api/v1/levin/analysis/morphogenetic"
          />
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <div className="flex items-start gap-3 text-sm text-gray-500">
          <Settings className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-white font-medium">Morphogenetic Optimizer:</span>{' '}
            Integra los 10 módulos Levin 2.0 para optimizar operaciones agrícolas.
            Las decisiones se basan en el estado bioeléctrico de la planta, asegurando
            que las intervenciones apoyen (no conflictúen) con el objetivo morfogenético actual.
            <span className="text-amber-400 ml-2">
              Objetivo: Maximizar VEP respetando el campo bioeléctrico.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MorphogeneticOptimizer
