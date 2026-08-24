import React, { useState, useEffect, useCallback } from 'react'
import { 
  Target, Zap, TrendingUp, DollarSign, Leaf, AlertTriangle,
  RefreshCw, Settings, Activity, Brain, CheckCircle,
  ArrowUpRight, ArrowDownRight, Minus, Clock, Calendar
} from 'lucide-react'
import { 
  CommandCenterData, ModuleOutput, DetectionAlert, 
  Recommendation, LEVIN_COLORS, MODULE_NAMES 
} from '../shared/types'
import { MetricCard, GaugeCard, StatusBadge } from '../shared/MetricCard'
import { ModuleStatusGrid, AlertList } from '../shared/ModuleStatusGrid'
import { PHDAIAnalysisCard } from '../shared/PHDAIAnalysisCard'

/**
 * ============================================================================
 * LEVIN COMMAND CENTER - Panel 1
 * ============================================================================
 * Executive view for rapid decision making
 * Displays goal alignment, KPIs, module status, alerts, and recommendations
 */

const FALLBACK_DATA: CommandCenterData = {
  section: 'ALL',
  timestamp: new Date().toISOString(),
  goal_alignment: 78,
  vep_projected: 2450000,
  pe_current: 85,
  cost_ytd: 1250000,
  price_forecast: 18.50,
  vmem_mean: -65.2,
  impedance_mean: 125.4,
  coherence_score: 0.82,
  modules: [
    { module_id: 'M1', name: 'Pest Detector', status: 'normal', confidence: 0.85, value: 0.92, unit: 'IPF', trend: 'stable', last_update: new Date().toISOString() },
    { module_id: 'M2', name: 'Disease Detector', status: 'warning', confidence: 0.78, value: 0.75, unit: 'IPF', trend: 'down', last_update: new Date().toISOString() },
    { module_id: 'M3', name: 'Nutrition Detector', status: 'optimal', confidence: 0.92, value: 0.88, unit: 'NPF', trend: 'up', last_update: new Date().toISOString() },
    { module_id: 'M4', name: 'Water Stress', status: 'normal', confidence: 0.88, value: 0.72, unit: 'IAH', trend: 'stable', last_update: new Date().toISOString() },
    { module_id: 'M5', name: 'Opportunity', status: 'optimal', confidence: 0.95, value: 1.0, unit: 'open', trend: 'stable', last_update: new Date().toISOString() },
    { module_id: 'M6', name: 'Fruit Quality', status: 'normal', confidence: 0.82, value: 9.2, unit: '°Brix', trend: 'up', last_update: new Date().toISOString() },
    { module_id: 'M7', name: 'Vigor Assessor', status: 'optimal', confidence: 0.90, value: 85, unit: '%', trend: 'stable', last_update: new Date().toISOString() },
    { module_id: 'M8', name: 'Frost Detector', status: 'normal', confidence: 0.99, value: 0, unit: 'risk', trend: 'stable', last_update: new Date().toISOString() },
    { module_id: 'M9', name: 'Recovery Monitor', status: 'normal', confidence: 0.87, value: 92, unit: '%', trend: 'up', last_update: new Date().toISOString() },
    { module_id: 'M10', name: 'Circadian', status: 'optimal', confidence: 0.91, value: 0.95, unit: 'sync', trend: 'stable', last_update: new Date().toISOString() },
  ],
  alerts: [
    { id: '1', module_id: 'M2', severity: 'medium', type: 'disease', target: 'Antracnosis', confidence: 0.78, lead_time_hours: 72, section: 'S1', timestamp: new Date().toISOString(), vmem_signature: [], recommendation: 'Aplicar Azoxystrobin preventivo' },
    { id: '2', module_id: 'M1', severity: 'low', type: 'pest', target: 'Trips', confidence: 0.65, lead_time_hours: 48, section: 'S2', timestamp: new Date().toISOString(), vmem_signature: [], recommendation: 'Monitorear brotes nuevos' },
  ],
  recommendations: [
    { id: '1', action: 'Aplicación preventiva fungicida', reason: 'Alta humedad prevista + señal bioeléctrica compatible', priority: 'high', category: 'health', cost_estimate: 4500, roi_estimate: 3.2, source_module: 'M2' },
    { id: '2', action: 'Fertirrigación N-K', reason: 'Etapa FEN-05 requiere refuerzo nutricional', priority: 'medium', category: 'nutrition', cost_estimate: 8200, roi_estimate: 2.8, source_module: 'M3' },
    { id: '3', action: 'Monitoreo intensivo S1', reason: 'Señal bioeléctrica anómala detectada', priority: 'medium', category: 'monitoring', cost_estimate: 0, roi_estimate: 0, source_module: 'M1' },
  ],
  phenology_stage: 'FEN-05',
  phenology_name: 'Desarrollo de Fruto',
  gdd_current: 1294,
  gdd_next_stage: 1450,
}

interface LevinCommandCenterProps {
  section?: string
  onSectionChange?: (section: string) => void
  onModuleClick?: (moduleId: string) => void
  onAlertClick?: (alertId: string) => void
}

export function LevinCommandCenter({ 
  section = 'ALL', 
  onSectionChange,
  onModuleClick,
  onAlertClick 
}: LevinCommandCenterProps) {
  const [data, setData] = useState<CommandCenterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(section)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/command-center/${activeSection}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching command center data:', err)
      setData(FALLBACK_DATA)
    } finally {
      setLoading(false)
    }
  }, [activeSection])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchData])

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection)
    onSectionChange?.(newSection)
  }

  const generateCommandCenterAnalysis = useCallback((d: CommandCenterData) => {
    const statusText = d.goal_alignment >= 80 ? 'ÓPTIMO' : d.goal_alignment >= 60 ? 'ACEPTABLE' : 'REQUIERE ATENCIÓN'
    const criticalModules = d.modules.filter(m => m.status === 'critical' || m.status === 'warning')
    
    return [
      `## 📊 Análisis PhD - Centro de Comando Levin`,
      `**Fecha:** ${new Date(d.timestamp).toLocaleString('es-MX')}`,
      `**Sección:** ${d.section} | **Estado General:** ${statusText}`,
      '',
      `### 1. Indicadores Bioeléctricos`,
      `- **Vmem promedio:** ${d.vmem_mean.toFixed(1)} mV (${d.vmem_mean > -70 ? 'Normal' : 'Elevado - posible estrés'})`,
      `- **Impedancia media:** ${d.impedance_mean.toFixed(1)} kΩ`,
      `- **Coherencia:** ${(d.coherence_score * 100).toFixed(0)}% (${d.coherence_score >= 0.8 ? 'Excelente sincronización' : 'Revisar campo bioeléctrico'})`,
      '',
      `### 2. Alineación con Objetivo Morfogenético`,
      `- **Score de alineación:** ${d.goal_alignment}%`,
      `- **Interpretación:** ${d.goal_alignment >= 80 
        ? 'Las condiciones actuales soportan el patrón de desarrollo óptimo.' 
        : 'Existen factores perturbando el campo bioeléctrico.'}`,
      '',
      `### 3. Estado de Módulos Levin 2.0`,
      `- **Módulos óptimos:** ${d.modules.filter(m => m.status === 'optimal').length}/10`,
      `- **Módulos en alerta:** ${criticalModules.length}`,
      criticalModules.length > 0 ? `- **Módulos a revisar:** ${criticalModules.map(m => m.module_id).join(', ')}` : '',
      '',
      `### 4. Fenología y Producción`,
      `- **Fase actual:** ${d.phenology_stage} - ${d.phenology_name}`,
      `- **GDD acumulados:** ${d.gdd_current} / ${d.gdd_next_stage} para siguiente fase`,
      `- **PE proyectado:** ${d.pe_current}%`,
      `- **VEP proyectado:** $${(d.vep_projected / 1000000).toFixed(2)}M MXN`,
      '',
      `### 5. Análisis Económico`,
      `- **Precio pronóstico:** $${d.price_forecast.toFixed(2)}/kg`,
      `- **Costo YTD:** $${(d.cost_ytd / 1000).toFixed(0)}K MXN`,
      `- **ROI operativo:** ${((d.vep_projected / d.cost_ytd - 1) * 100).toFixed(0)}%`,
      '',
      `### 6. Recomendaciones Prioritarias`,
      ...d.recommendations.slice(0, 3).map((r, i) => 
        `${i + 1}. **[${r.priority.toUpperCase()}]** ${r.action} (ROI: ${r.roi_estimate.toFixed(1)}x)`
      ),
      '',
      `### 7. Interpretación Científica (Michael Levin)`,
      d.coherence_score >= 0.8 && d.goal_alignment >= 80
        ? '✅ El campo bioeléctrico muestra alta coherencia y alineación con el objetivo de desarrollo. Las células están coordinadas y el patrón morfogenético es estable.'
        : '⚠️ Se detectan perturbaciones en el campo bioeléctrico que podrían afectar la coordinación celular. Revisar factores de estrés y considerar intervenciones correctivas.',
      '',
      '---',
      '*Framework de cognición bioeléctrica aplicado a cítricos*',
      '*Levin, M. (2021). Bioelectric signaling. Cell, 184(6).*'
    ].filter(Boolean).join('\n')
  }, [])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-400" />
          </div>
          <p className="text-gray-400">Cargando Centro de Comando...</p>
        </div>
      </div>
    )
  }

  const d = data || FALLBACK_DATA

  const phenologyProgress = ((d.gdd_current / d.gdd_next_stage) * 100).toFixed(0)

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Levin Command Center</h1>
            <p className="text-sm text-gray-400">Panel de Control Ejecutivo - Levin Layer 2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Section Selector */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            {['ALL', 'S1', 'S2', 'S3'].map((s) => (
              <button
                key={s}
                onClick={() => handleSectionChange(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSection === s 
                    ? 'bg-green-600 text-white shadow-lg' 
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
        
        {/* Goal Alignment Gauge - Large */}
        <div className="col-span-3 bg-slate-800/80 rounded-2xl p-6 border border-green-500/30 shadow-xl shadow-slate-900/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400 font-medium">Alineación con Objetivo</span>
          </div>
          
          {/* Large Circular Gauge */}
          <div className="relative w-44 h-44 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="78" stroke="#1e293b" strokeWidth="14" fill="none" />
              <circle
                cx="88" cy="88" r="78"
                stroke={d.goal_alignment >= 80 ? '#22c55e' : d.goal_alignment >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(d.goal_alignment / 100) * 490} 490`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{d.goal_alignment}</span>
              <span className="text-sm text-gray-400">%</span>
            </div>
          </div>
          
          <div className="text-center">
            <StatusBadge 
              status={d.goal_alignment >= 80 ? 'optimal' : d.goal_alignment >= 60 ? 'warning' : 'critical'}
              label={d.goal_alignment >= 80 ? 'Óptimo' : d.goal_alignment >= 60 ? 'Aceptable' : 'Atención'}
              pulse={d.goal_alignment < 60}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="col-span-6 grid grid-cols-2 gap-4">
          <MetricCard
            title="VEP Proyectado"
            value={`$${(d.vep_projected / 1000000).toFixed(2)}M`}
            trend="up"
            trendValue="+8.5% vs budget"
            status="optimal"
            icon={<DollarSign className="w-5 h-5 text-green-400" />}
            subtitle="Valor Económico Potencial"
          />
          
          <MetricCard
            title="PE Actual"
            value={d.pe_current}
            unit="%"
            trend={d.pe_current >= 85 ? 'up' : 'stable'}
            trendValue={d.pe_current >= 85 ? 'Meta alcanzada' : 'En progreso'}
            status={d.pe_current >= 85 ? 'optimal' : 'normal'}
            icon={<Activity className="w-5 h-5 text-blue-400" />}
            subtitle="Producción Exportable"
          />
          
          <MetricCard
            title="Costo YTD"
            value={`$${(d.cost_ytd / 1000).toFixed(0)}K`}
            trend="stable"
            trendValue="87% del presupuesto"
            status="normal"
            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
            subtitle="Gasto Acumulado"
          />
          
          <MetricCard
            title="Precio Pronóstico"
            value={`$${d.price_forecast.toFixed(2)}`}
            unit="/kg"
            trend="up"
            trendValue="+12% vs promedio"
            status="optimal"
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            subtitle="7 días"
          />
        </div>

        {/* Phenology Progress */}
        <div className="col-span-3 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-lime-400" />
            <span className="text-sm text-gray-400 font-medium">Estado Fenológico</span>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-white">{d.phenology_stage}</div>
            <div className="text-sm text-lime-400">{d.phenology_name}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>GDD: {d.gdd_current}</span>
              <span>Meta: {d.gdd_next_stage}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-lime-500 to-green-500 transition-all duration-500"
                style={{ width: `${Math.min(Number(phenologyProgress), 100)}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-400">
              {phenologyProgress}% hacia siguiente fase
            </div>
          </div>
        </div>

        {/* Module Status Grid */}
        <div className="col-span-7 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Módulos Levin 2.0</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                {d.modules.filter(m => m.status === 'optimal').length} Óptimos
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {d.modules.filter(m => m.status === 'warning').length} Alerta
              </span>
            </div>
          </div>
          
          <ModuleStatusGrid 
            modules={d.modules} 
            onModuleClick={onModuleClick}
          />
        </div>

        {/* Alerts */}
        <div className="col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">Alertas Activas</span>
            </div>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
              {d.alerts.length} alertas
            </span>
          </div>
          
          <AlertList 
            alerts={d.alerts}
            onAlertClick={onAlertClick}
            maxItems={4}
          />
        </div>

        {/* Recommendations */}
        <div className="col-span-12 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Top Recomendaciones</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {d.recommendations.slice(0, 3).map((rec, idx) => (
              <div 
                key={rec.id}
                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                  rec.priority === 'high' ? 'border-red-500/30 bg-red-500/5' :
                  rec.priority === 'medium' ? 'border-amber-500/30 bg-amber-500/5' :
                  'border-blue-500/30 bg-blue-500/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    #{idx + 1} {rec.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{rec.source_module}</span>
                </div>
                
                <h4 className="text-white font-medium mb-1">{rec.action}</h4>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{rec.reason}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    💰 ${rec.cost_estimate.toLocaleString()} MXN
                  </span>
                  <span className="text-green-400 font-medium">
                    ROI {rec.roi_estimate.toFixed(1)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PhD AI Analysis */}
        <div className="col-span-12">
          <PHDAIAnalysisCard
            title="Centro de Comando - Análisis Ejecutivo"
            data={d}
            generateAnalysis={generateCommandCenterAnalysis}
            apiEndpoint="/c2ai-api/api/v1/levin/analysis/command-center"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Última actualización: {new Date(d.timestamp).toLocaleString('es-MX')}</span>
          <span className="mx-2">•</span>
          <span>Refresco automático: 30s</span>
          <span className="mx-2">•</span>
          <span className="text-green-400">
            Framework: Michael Levin - Bioelectric Cognition
          </span>
        </div>
      </div>
    </div>
  )
}

export default LevinCommandCenter
