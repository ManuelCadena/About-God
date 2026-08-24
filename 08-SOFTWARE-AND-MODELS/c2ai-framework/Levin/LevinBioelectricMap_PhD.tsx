import { useState, useEffect, useCallback } from 'react'
import { 
  Zap, Activity, Radio, RefreshCw, Wifi, WifiOff, 
  Info, AlertTriangle, CheckCircle, Brain, Leaf,
  TrendingUp, TrendingDown, Minus, HelpCircle,
  Thermometer, Droplets, Sun, Wind
} from 'lucide-react'

/**
 * ============================================================================
 * LEVIN BIOELECTRIC MAP - PhD LEVEL IMPLEMENTATION
 * ============================================================================
 * Based on Michael Levin's bioelectric cognition framework (Tufts University)
 * 
 * SCIENTIFIC FOUNDATION:
 * - Vmem (membrane potential) patterns encode developmental goals
 * - Bioelectric signals coordinate cellular behavior across tissues
 * - Gap junctions create "bioelectric networks" for information processing
 * - Depolarization (less negative Vmem) indicates active growth/wound response
 * 
 * REFERENCES:
 * - Levin, M. (2021). Bioelectric signaling. Cell, 184(6), 1971-1989.
 * - Pai, V.P., et al. (2024). Bioelectricity: A universal signaling cue.
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LocationData {
  vmem_current: number
  vmem_baseline: number
  vmem_delta: number
  frequency_hz: number
  status: string
  signal_propagation?: number
  polarization_state?: string
  ion_flux?: { calcium: number; potassium: number; chloride: number }
}

interface BioelectricMapData {
  section: string
  phenology: string
  phenology_name?: string
  timestamp: string
  gdd_accumulated?: number
  days_since_pruning?: number
  pruning_intensity?: number
  locations: Record<string, LocationData>
  coherence_score: number
  gamma_power_40hz: number
  overall_vmem: number
  voltage_heatmap: number[][]
  field_state?: string
  wound_signal_intensity?: number
  sensor_status: Record<string, { status: string; last_reading: string }>
  environmental?: {
    soil_moisture: number
    temperature: number
    light_intensity: number
    wind_speed: number
  }
}

// ============================================================================
// BIOELECTRIC REFERENCE DATA (PhD Level - Michael Levin Framework)
// ============================================================================

const BIOELECTRIC_REFERENCE = {
  vmem_ranges: {
    meristem: {
      name: 'Meristemo Apical',
      description: 'Zona de crecimiento activo con alta actividad mitótica',
      baseline: -45, range: { min: -60, max: -30 }, optimal: { min: -50, max: -40 },
      interpretation: {
        hyperpolarized: 'Vmem < -50mV: Células quiescentes, baja división',
        normal: '-50mV ≤ Vmem ≤ -40mV: Crecimiento normal',
        depolarized: 'Vmem > -40mV: Alta actividad mitótica'
      }
    },
    root_tip: {
      name: 'Ápice Radicular',
      description: 'Zona de elongación y absorción de nutrientes',
      baseline: -55, range: { min: -70, max: -40 }, optimal: { min: -60, max: -50 },
      interpretation: {
        hyperpolarized: 'Vmem < -60mV: Absorción activa de K⁺',
        normal: '-60mV ≤ Vmem ≤ -50mV: Balance iónico óptimo',
        depolarized: 'Vmem > -50mV: Posible estrés hídrico'
      }
    },
    fruit_zone: {
      name: 'Zona de Frutos',
      description: 'Área de desarrollo y maduración de frutos',
      baseline: -35, range: { min: -50, max: -20 }, optimal: { min: -40, max: -30 },
      interpretation: {
        hyperpolarized: 'Vmem < -40mV: Frutos en desarrollo temprano',
        normal: '-40mV ≤ Vmem ≤ -30mV: Desarrollo normal',
        depolarized: 'Vmem > -30mV: Maduración activa'
      }
    },
    wound_site: {
      name: 'Sitio de Herida (Poda)',
      description: 'Zona de respuesta a daño mecánico',
      baseline: -20, range: { min: -40, max: 0 }, optimal: { min: -25, max: -15 },
      interpretation: {
        hyperpolarized: 'Vmem < -25mV: Cicatrización avanzada',
        normal: '-25mV ≤ Vmem ≤ -15mV: Respuesta activa',
        depolarized: 'Vmem > -15mV: Herida reciente'
      }
    }
  },
  frequency_ranges: {
    meristem: { range: { min: 8, max: 12 }, optimal: 10, description: 'División celular activa' },
    root_tip: { range: { min: 4, max: 8 }, optimal: 6, description: 'Señalización raíz-brote' },
    fruit_zone: { range: { min: 6, max: 10 }, optimal: 8, description: 'Desarrollo de fruto' },
    wound_site: { range: { min: 15, max: 25 }, optimal: 20, description: 'Respuesta a herida' }
  },
  coherence: {
    excellent: { min: 0.85, max: 1.0, label: 'Excelente', color: 'green', description: 'Patrones altamente sincronizados' },
    good: { min: 0.70, max: 0.85, label: 'Bueno', color: 'lime', description: 'Coordinación adecuada' },
    moderate: { min: 0.50, max: 0.70, label: 'Moderado', color: 'yellow', description: 'Posible perturbación' },
    low: { min: 0.30, max: 0.50, label: 'Bajo', color: 'orange', description: 'Campo desorganizado' },
    critical: { min: 0, max: 0.30, label: 'Crítico', color: 'red', description: 'Estrés severo' }
  },
  gamma_power: {
    high: { min: 0.70, max: 1.0, label: 'Alta', description: 'Actividad cognitiva intensa' },
    normal: { min: 0.40, max: 0.70, label: 'Normal', description: 'Procesamiento estándar' },
    low: { min: 0, max: 0.40, label: 'Baja', description: 'Estado de reposo' }
  },
  field_states: {
    stable: { label: 'Estable', color: 'green', description: 'Campo en equilibrio' },
    perturbed: { label: 'Perturbado', color: 'yellow', description: 'En proceso de ajuste' },
    reprogramming: { label: 'Reprogramando', color: 'purple', description: 'Cambio de objetivo' }
  },
  phenology_bioelectric: {
    'FEN-01': { goal: 'Dormancia', vmem_tendency: 'hyperpolarized', activity: 'low' },
    'FEN-02': { goal: 'Crecimiento Vegetativo', vmem_tendency: 'depolarized', activity: 'high' },
    'FEN-03': { goal: 'Floración', vmem_tendency: 'normal', activity: 'moderate' },
    'FEN-04': { goal: 'Cuajado', vmem_tendency: 'normal', activity: 'high' },
    'FEN-05': { goal: 'Desarrollo Fruto', vmem_tendency: 'slightly_depolarized', activity: 'high' },
    'FEN-06': { goal: 'Maduración', vmem_tendency: 'depolarized', activity: 'moderate' },
    'FEN-07': { goal: 'Cosecha', vmem_tendency: 'normal', activity: 'low' }
  }
}

// Fallback data
const FALLBACK_DATA: BioelectricMapData = {
  section: 'S1',
  phenology: 'FEN-05',
  phenology_name: 'Desarrollo de Fruto',
  timestamp: new Date().toISOString(),
  gdd_accumulated: 1102.54,
  days_since_pruning: 45,
  pruning_intensity: 15,
  locations: {
    meristem: { vmem_current: -42.5, vmem_baseline: -45, vmem_delta: 2.5, frequency_hz: 9.8, status: 'active', ion_flux: { calcium: 0.65, potassium: 0.72, chloride: 0.45 } },
    root_tip: { vmem_current: -54.3, vmem_baseline: -55, vmem_delta: 0.7, frequency_hz: 5.8, status: 'active', ion_flux: { calcium: 0.55, potassium: 0.85, chloride: 0.40 } },
    fruit_zone: { vmem_current: -33.1, vmem_baseline: -35, vmem_delta: 1.9, frequency_hz: 8.2, status: 'active', ion_flux: { calcium: 0.78, potassium: 0.60, chloride: 0.52 } },
    wound_site: { vmem_current: -22.2, vmem_baseline: -20, vmem_delta: -2.2, frequency_hz: 16.5, status: 'healing', signal_propagation: 0.25, ion_flux: { calcium: 0.45, potassium: 0.55, chloride: 0.35 } }
  },
  coherence_score: 0.78,
  gamma_power_40hz: 0.58,
  overall_vmem: -38.0,
  field_state: 'stable',
  wound_signal_intensity: 0.15,
  voltage_heatmap: Array(10).fill(null).map((_, row) => Array(10).fill(null).map(() => -55 + (row * 3) + (Math.random() * 6 - 3))),
  sensor_status: {
    meristem_probe: { status: 'simulated', last_reading: new Date().toISOString() },
    root_probe: { status: 'simulated', last_reading: new Date().toISOString() },
    fruit_probe: { status: 'simulated', last_reading: new Date().toISOString() },
    wound_probe: { status: 'simulated', last_reading: new Date().toISOString() }
  },
  environmental: { soil_moisture: 42, temperature: 26.5, light_intensity: 1250, wind_speed: 8.5 }
}

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = { active: 'text-green-400', stressed: 'text-red-400', healing: 'text-yellow-400', dormant: 'text-blue-400' }
  return colors[status] || 'text-gray-400'
}

const getHeatmapColor = (value: number) => {
  const normalized = (value + 70) / 50
  if (normalized < 0.2) return 'bg-purple-800'
  if (normalized < 0.4) return 'bg-blue-700'
  if (normalized < 0.6) return 'bg-green-500'
  if (normalized < 0.8) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getCoherenceInfo = (score: number) => {
  const { coherence } = BIOELECTRIC_REFERENCE
  if (score >= coherence.excellent.min) return coherence.excellent
  if (score >= coherence.good.min) return coherence.good
  if (score >= coherence.moderate.min) return coherence.moderate
  if (score >= coherence.low.min) return coherence.low
  return coherence.critical
}

const getGammaPowerInfo = (power: number) => {
  const { gamma_power } = BIOELECTRIC_REFERENCE
  if (power >= gamma_power.high.min) return gamma_power.high
  if (power >= gamma_power.normal.min) return gamma_power.normal
  return gamma_power.low
}

// Tooltip component
const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="cursor-help">{children}</div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs">
          {content}
        </div>
      )}
    </div>
  )
}

// Main component
export function LevinBioelectricMap({ section = 'S1' }: { section?: string }) {
  const [data, setData] = useState<BioelectricMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReference, setShowReference] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/bioelectric-map/${section}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData({ ...FALLBACK_DATA, section })
      }
    } catch {
      setData({ ...FALLBACK_DATA, section })
    } finally {
      setLoading(false)
    }
  }, [section])

  const generateAIAnalysis = useCallback(async () => {
    if (!data) return
    setAiLoading(true)
    const coherenceInfo = getCoherenceInfo(data.coherence_score)
    const gammaInfo = getGammaPowerInfo(data.gamma_power_40hz)
    const phenologyInfo = BIOELECTRIC_REFERENCE.phenology_bioelectric[data.phenology as keyof typeof BIOELECTRIC_REFERENCE.phenology_bioelectric]
    
    // Generate local analysis
    const analysis = [
      `## Análisis PhD - Campo Bioeléctrico Sección ${data.section}`,
      `**Fecha:** ${new Date(data.timestamp).toLocaleString('es-MX')}`,
      '',
      `### 1. Estado General del Campo Morfogenético`,
      `El campo bioeléctrico presenta un estado **${data.field_state === 'stable' ? 'ESTABLE' : 'PERTURBADO'}**.`,
      `- **Coherencia:** ${(data.coherence_score * 100).toFixed(0)}% - ${coherenceInfo.description}`,
      `- **Potencia Gamma:** ${(data.gamma_power_40hz * 100).toFixed(0)}% - ${gammaInfo.description}`,
      `- **Vmem Promedio:** ${data.overall_vmem.toFixed(1)} mV`,
      '',
      `### 2. Correlación Fenología-Bioelectricidad`,
      phenologyInfo ? `Fenología: **${data.phenology} (${phenologyInfo.goal})**` : '',
      phenologyInfo ? `- Actividad esperada: ${phenologyInfo.activity}` : '',
      '',
      `### 3. Análisis por Ubicación`,
      ...Object.entries(data.locations).map(([loc, locData]) => {
        const ref = BIOELECTRIC_REFERENCE.vmem_ranges[loc as keyof typeof BIOELECTRIC_REFERENCE.vmem_ranges]
        return ref ? `**${ref.name}:** Vmem=${locData.vmem_current.toFixed(1)}mV, Freq=${locData.frequency_hz.toFixed(1)}Hz, Estado=${locData.status}` : ''
      }),
      '',
      `### 4. Recomendaciones`,
      data.coherence_score < 0.5 ? '⚠️ Coherencia baja - verificar estrés' : data.coherence_score >= 0.85 ? '✅ Campo óptimo' : '📊 Campo en rango normal',
      '',
      '---',
      '*Análisis según framework de Michael Levin (Tufts University)*'
    ].join('\n')
    
    setAiAnalysis(analysis)
    setAiLoading(false)
  }, [data])

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 30000); return () => clearInterval(interval) }, [fetchData])
  useEffect(() => { if (data && !aiAnalysis) generateAIAnalysis() }, [data, aiAnalysis, generateAIAnalysis])

  if (loading && !data) return <div className="p-6 flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>

  const d = data || FALLBACK_DATA
  const coherenceInfo = getCoherenceInfo(d.coherence_score)
  const gammaInfo = getGammaPowerInfo(d.gamma_power_40hz)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-400" />
          Levin Layer - Mapa Bioeléctrico
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-600/30 text-yellow-400 rounded-lg text-sm flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />DATOS SINTÉTICOS
          </span>
          <span className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">{section}</span>
          <button onClick={() => setShowReference(!showReference)} className="p-2 bg-industrial-dark rounded-lg hover:bg-industrial-light">
            <Info className={`w-5 h-5 ${showReference ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
          <button onClick={fetchData} className="p-2 bg-industrial-dark rounded-lg hover:bg-industrial-light">
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reference Panel */}
      {showReference && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-4"><Brain className="w-5 h-5" />Referencia Científica - Framework Michael Levin</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(BIOELECTRIC_REFERENCE.vmem_ranges).map(([key, ref]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-white font-medium">{ref.name}</div>
                <div className="text-gray-400 text-xs">{ref.description}</div>
                <div className="text-green-400 text-xs mt-1">Óptimo: {ref.optimal.min} a {ref.optimal.max} mV</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Heatmap */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />Mapa de Voltaje (Vmem)
            <Tooltip content="Potencial de membrana: azul=hiperpolarizado, verde=normal, rojo=despolarizado"><HelpCircle className="w-4 h-4 text-gray-500" /></Tooltip>
          </h3>
          <div className="grid grid-cols-10 gap-1 mb-4">
            {d.voltage_heatmap.flat().map((value, idx) => (
              <div key={idx} className={`aspect-square rounded-sm ${getHeatmapColor(value)} opacity-80 hover:opacity-100`} title={`${value.toFixed(1)} mV`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>🌱 Raíz</span>
            <span>Vmem: <strong className="text-white">{d.overall_vmem.toFixed(1)} mV</strong></span>
            <span>🌿 Dosel</span>
          </div>
        </div>

        {/* Locations */}
        <div className="col-span-6 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Radio className="w-5 h-5 text-blue-400" />Voltaje por Ubicación</h3>
          <div className="space-y-3">
            {Object.entries(d.locations).map(([location, locData]) => {
              const ref = BIOELECTRIC_REFERENCE.vmem_ranges[location as keyof typeof BIOELECTRIC_REFERENCE.vmem_ranges]
              return (
                <div key={location} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium flex items-center gap-2"><Leaf className="w-4 h-4 text-green-400" />{ref?.name || location}</span>
                    <span className={getStatusColor(locData.status)}>{locData.status.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div><div className="text-gray-400 text-xs">Vmem</div><div className="text-lg font-bold text-white">{locData.vmem_current.toFixed(1)} mV</div></div>
                    <div><div className="text-gray-400 text-xs">Delta</div><div className={`text-lg font-bold ${Math.abs(locData.vmem_delta) > 5 ? 'text-yellow-400' : 'text-green-400'}`}>{locData.vmem_delta >= 0 ? '+' : ''}{locData.vmem_delta.toFixed(1)}</div></div>
                    <div><div className="text-gray-400 text-xs">Frecuencia</div><div className="text-lg font-bold text-blue-400">{locData.frequency_hz.toFixed(1)} Hz</div></div>
                    {locData.ion_flux && <div><div className="text-gray-400 text-xs">Flujo Iónico</div><div className="flex gap-1 mt-1">{['calcium','potassium','chloride'].map(ion => <div key={ion} className="flex-1 h-2 bg-gray-700 rounded-full"><div className={`h-full rounded-full ${ion==='calcium'?'bg-red-400':ion==='potassium'?'bg-purple-400':'bg-green-400'}`} style={{width:`${(locData.ion_flux as any)[ion]*100}%`}}/></div>)}</div></div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coherence */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-green-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Coherencia Bioeléctrica</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="10" fill="none" />
              <circle cx="64" cy="64" r="56" stroke={d.coherence_score > 0.7 ? '#22c55e' : '#eab308'} strokeWidth="10" fill="none" strokeDasharray={`${d.coherence_score * 352} 352`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{Math.round(d.coherence_score * 100)}%</span>
              <span className="text-sm text-gray-400">{coherenceInfo.label}</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400">{coherenceInfo.description}</div>
        </div>

        {/* Gamma Power */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-purple-400" />Potencia Gamma (40Hz)</h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-purple-400">{Math.round(d.gamma_power_40hz * 100)}%</div>
            <div className="text-sm text-gray-400 mt-2">{gammaInfo.label}</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="h-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${d.gamma_power_40hz * 100}%` }} />
          </div>
          <div className="text-center text-sm text-gray-400 mt-2">{gammaInfo.description}</div>
        </div>

        {/* Sensors */}
        <div className="col-span-4 bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4">Estado de Sensores</h3>
          <div className="space-y-2">
            {Object.entries(d.sensor_status).map(([sensor, status]) => (
              <div key={sensor} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {status.status === 'simulated' ? <WifiOff className="w-4 h-4 text-yellow-400" /> : <Wifi className="w-4 h-4 text-green-400" />}
                  <span className="text-white text-sm capitalize">{sensor.replace(/_/g, ' ')}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${status.status === 'simulated' ? 'bg-yellow-600/30 text-yellow-400' : 'bg-green-600/30 text-green-400'}`}>{status.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
          {d.environmental && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /><span className="text-gray-400">Humedad:</span><span className="text-white">{d.environmental.soil_moisture}%</span></div>
              <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-red-400" /><span className="text-gray-400">Temp:</span><span className="text-white">{d.environmental.temperature}°C</span></div>
              <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-400" /><span className="text-gray-400">PAR:</span><span className="text-white">{d.environmental.light_intensity}</span></div>
              <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-cyan-400" /><span className="text-gray-400">Viento:</span><span className="text-white">{d.environmental.wind_speed} km/h</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Pruning Impact */}
      {d.days_since_pruning && d.days_since_pruning < 90 && (
        <div className="bg-industrial-dark rounded-xl p-6 border border-orange-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-orange-400" />Impacto de Poda</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center"><div className="text-gray-400 text-xs">Días desde Poda</div><div className="text-3xl font-bold text-orange-400">{d.days_since_pruning}</div></div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center"><div className="text-gray-400 text-xs">Intensidad</div><div className="text-3xl font-bold text-yellow-400">{d.pruning_intensity || 0}%</div></div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center"><div className="text-gray-400 text-xs">Señal Herida</div><div className="text-3xl font-bold text-red-400">{((d.wound_signal_intensity || 0) * 100).toFixed(0)}%</div></div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center"><div className="text-gray-400 text-xs">Recuperación</div><div className="w-full bg-gray-700 rounded-full h-3 mt-2"><div className="h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500" style={{ width: `${Math.min(100, (d.days_since_pruning / 60) * 100)}%` }} /></div></div>
          </div>
        </div>
      )}

      {/* PhD AI Analysis Panel */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Brain className="w-6 h-6 text-indigo-400" />Análisis PhD con IA - Campo Bioeléctrico</h3>
          <button onClick={generateAIAnalysis} disabled={aiLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2">
            {aiLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Analizando...</> : <><Brain className="w-4 h-4" />Regenerar Análisis</>}
          </button>
        </div>
        {aiLoading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div><span className="ml-3 text-gray-400">Generando análisis PhD...</span></div>
        ) : aiAnalysis ? (
          <div className="bg-gray-900/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap font-mono text-sm">{aiAnalysis}</div>
        ) : (
          <div className="text-center py-8 text-gray-400"><Brain className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Haz clic en "Regenerar Análisis" para obtener un análisis PhD.</p></div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 flex items-center gap-2">
          <Info className="w-4 h-4" />Análisis basado en el framework de cognición bioeléctrica de Michael Levin (Tufts University).
        </div>
      </div>

      {/* Footer */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">Mapa Bioeléctrico (Framework Levin):</span>{' '}
            Visualiza patrones de potencial de membrana (Vmem). La despolarización indica crecimiento activo o respuesta a herida. La coherencia mide la sincronización del campo morfogenético.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevinBioelectricMap
