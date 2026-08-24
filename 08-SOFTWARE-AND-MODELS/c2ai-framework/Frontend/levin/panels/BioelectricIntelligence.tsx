import React, { useState, useEffect, useCallback } from 'react'
import { 
  Activity, Bug, Virus, Leaf, Droplets, Snowflake, 
  Heart, Clock, RefreshCw, Brain, Zap, Radio,
  TrendingUp, TrendingDown, AlertTriangle, Info,
  Thermometer, Wind, Sun, ChevronRight
} from 'lucide-react'
import { 
  BioelectricIntelligenceData, SensorLocation, 
  PestAnalysis, DiseaseAnalysis, NutritionAnalysis,
  WaterAnalysis, FrostAnalysis, RecoveryAnalysis, CircadianAnalysis,
  LEVIN_COLORS 
} from '../shared/types'
import { MetricCard, GaugeCard, StatusBadge } from '../shared/MetricCard'
import { PHDAIAnalysisCard } from '../shared/PHDAIAnalysisCard'

/**
 * ============================================================================
 * BIOELECTRIC INTELLIGENCE - Panel 2
 * ============================================================================
 * PhD-level scientific analysis with 7 specialized tabs
 * Based on Michael Levin's bioelectric cognition framework
 */

type TabId = 'pest' | 'disease' | 'nutrition' | 'water' | 'frost' | 'recovery' | 'circadian'

interface Tab {
  id: TabId
  name: string
  icon: React.ReactNode
  color: string
  module: string
}

const TABS: Tab[] = [
  { id: 'pest', name: 'Plagas', icon: <Bug className="w-4 h-4" />, color: '#ef4444', module: 'M1' },
  { id: 'disease', name: 'Enfermedades', icon: <Virus className="w-4 h-4" />, color: '#f97316', module: 'M2' },
  { id: 'nutrition', name: 'Nutrición', icon: <Leaf className="w-4 h-4" />, color: '#84cc16', module: 'M3' },
  { id: 'water', name: 'Estrés Hídrico', icon: <Droplets className="w-4 h-4" />, color: '#06b6d4', module: 'M4' },
  { id: 'frost', name: 'Daño por Frío', icon: <Snowflake className="w-4 h-4" />, color: '#3b82f6', module: 'M8' },
  { id: 'recovery', name: 'Recuperación', icon: <Heart className="w-4 h-4" />, color: '#ec4899', module: 'M9' },
  { id: 'circadian', name: 'Circadiano', icon: <Clock className="w-4 h-4" />, color: '#14b8a6', module: 'M10' },
]

const FALLBACK_DATA: BioelectricIntelligenceData = {
  section: 'S1',
  timestamp: new Date().toISOString(),
  pest_analysis: {
    detections: [],
    vmem_delta_6h: 8.5,
    frequency_dominant: 15.2,
    harmonics: [15.2, 30.4, 45.6],
    fft_spectrum: Array.from({ length: 50 }, (_, i) => ({ freq: i, power: Math.random() * 100 })),
    signatures: [
      { pest: 'Trips', match_score: 0.78 },
      { pest: 'Araña Roja', match_score: 0.45 },
      { pest: 'Minador', match_score: 0.22 },
    ]
  },
  disease_analysis: {
    detections: [],
    vmem_vp: 12.3,
    impedance_ratio: 1.15,
    pe_mills_forecast: [45, 52, 68, 75, 82, 78, 65],
    lwd_hours: 6.5
  },
  nutrition_analysis: {
    npf_score: 0.88,
    deficiencies: [
      { nutrient: 'K', severity: 0.3, vmem_indicator: -72 },
      { nutrient: 'Zn', severity: 0.15, vmem_indicator: -68 },
    ],
    impedance_profile: Array.from({ length: 20 }, (_, i) => ({ freq: i * 1000, value: 100 + Math.random() * 50 })),
    recommendation: 'Fertirrigación con KNO3 + Quelato de Zinc'
  },
  water_analysis: {
    iah_score: 0.72,
    vmem_absolute: -68.5,
    soil_moisture: 42,
    et0_actual: 5.2,
    stress_level: 28,
    irrigation_recommendation: 15
  },
  frost_analysis: {
    risk_score: 5,
    vmem_collapse_detected: false,
    temperature_history: Array.from({ length: 24 }, (_, i) => ({ 
      time: `${i}:00`, 
      value: 18 + Math.sin(i / 24 * Math.PI * 2) * 8 
    })),
    damage_estimate: 0,
    recovery_probability: 100
  },
  recovery_analysis: {
    recovery_rate: 2.5,
    vmem_std: 3.2,
    days_since_event: 45,
    trajectory: Array.from({ length: 30 }, (_, i) => ({ 
      day: i, 
      vmem: -80 + i * 0.5, 
      predicted: -80 + i * 0.48 
    })),
    prognosis: 'Recuperación completa - tejido regenerado'
  },
  circadian_analysis: {
    rhythm_score: 0.92,
    vmem_24h_pattern: Array.from({ length: 24 }, (_, i) => ({ 
      hour: i, 
      vmem: -65 + Math.sin((i - 6) / 24 * Math.PI * 2) * 10 
    })),
    phase_shift: 0.5,
    amplitude: 18.5,
    optimal_spray_window: { start: 6, end: 10 }
  },
  locations: [
    { id: 'L1', name: 'Meristemo Apical', zone: 'meristem', section: 'S1', 
      reading: { vmem: -45, impedance_1k: 120, impedance_10k: 95, frequency_dominant: 10, temperature: 28, battery_pct: 92, anomaly_flag: false, timestamp: new Date().toISOString() },
      status: 'online', last_update: new Date().toISOString() },
    { id: 'L2', name: 'Ápice Radicular', zone: 'root_tip', section: 'S1',
      reading: { vmem: -55, impedance_1k: 135, impedance_10k: 110, frequency_dominant: 6, temperature: 26, battery_pct: 88, anomaly_flag: false, timestamp: new Date().toISOString() },
      status: 'online', last_update: new Date().toISOString() },
    { id: 'L3', name: 'Zona de Frutos', zone: 'fruit_zone', section: 'S1',
      reading: { vmem: -35, impedance_1k: 105, impedance_10k: 85, frequency_dominant: 8, temperature: 30, battery_pct: 95, anomaly_flag: false, timestamp: new Date().toISOString() },
      status: 'online', last_update: new Date().toISOString() },
    { id: 'L4', name: 'Sitio de Poda', zone: 'wound_site', section: 'S1',
      reading: { vmem: -20, impedance_1k: 90, impedance_10k: 70, frequency_dominant: 18, temperature: 29, battery_pct: 90, anomaly_flag: false, timestamp: new Date().toISOString() },
      status: 'online', last_update: new Date().toISOString() },
  ],
  environmental: {
    temperature: 28.5,
    humidity: 72,
    soil_moisture: 42,
    light_intensity: 850,
    wind_speed: 8.5,
    precipitation_24h: 0
  },
  heatmap_data: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => -60 + Math.random() * 40))
}

interface BioelectricIntelligenceProps {
  section?: string
  initialTab?: TabId
  onSectionChange?: (section: string) => void
}

export function BioelectricIntelligence({ 
  section = 'S1', 
  initialTab = 'pest',
  onSectionChange 
}: BioelectricIntelligenceProps) {
  const [data, setData] = useState<BioelectricIntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [activeSection, setActiveSection] = useState(section)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/c2ai-api/api/v1/levin/bioelectric-intelligence/${activeSection}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || result)
      } else {
        setData(FALLBACK_DATA)
      }
    } catch (err) {
      console.error('Error fetching bioelectric intelligence data:', err)
      setData(FALLBACK_DATA)
    } finally {
      setLoading(false)
    }
  }, [activeSection])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection)
    onSectionChange?.(newSection)
  }

  const generateTabAnalysis = useCallback((d: BioelectricIntelligenceData, tab: TabId) => {
    const analyses: Record<TabId, () => string> = {
      pest: () => {
        const pa = d.pest_analysis
        return [
          `## 🐛 Análisis PhD - Detección de Plagas (M1)`,
          `**Sección:** ${d.section} | **Timestamp:** ${new Date(d.timestamp).toLocaleString('es-MX')}`,
          '',
          `### 1. Señales Bioeléctricas de Alimentación`,
          `- **ΔVmem (6h):** ${pa.vmem_delta_6h.toFixed(1)} mV ${pa.vmem_delta_6h > 10 ? '⚠️ ELEVADO' : '✅ Normal'}`,
          `- **Frecuencia dominante:** ${pa.frequency_dominant.toFixed(1)} Hz`,
          `- **Armónicos detectados:** ${pa.harmonics.map(h => h.toFixed(1)).join(', ')} Hz`,
          '',
          `### 2. Firmas de Plagas Detectadas`,
          ...pa.signatures.map(s => `- **${s.pest}:** ${(s.match_score * 100).toFixed(0)}% coincidencia`),
          '',
          `### 3. Interpretación Científica`,
          pa.vmem_delta_6h > 10 
            ? '⚠️ La variación de Vmem indica actividad de alimentación de insectos. Los Variation Potentials (VPs) detectados son consistentes con daño mecánico de tejido por aparato bucal.'
            : '✅ El campo bioeléctrico está estable. No se detectan patrones de alimentación activa.',
          '',
          `### 4. Base Científica`,
          '- Los insectos fitófagos generan VPs al perforar tejido vegetal',
          '- Frecuencias 10-25 Hz indican respuesta sistémica a herbivoría',
          '- Salvador-Recatalà et al. (2014) Plant Signaling & Behavior',
          '',
          '---',
          '*Framework Levin: Bioelectric signals encode information about tissue damage*'
        ].join('\n')
      },
      disease: () => {
        const da = d.disease_analysis
        return [
          `## 🦠 Análisis PhD - Detección de Enfermedades (M2)`,
          `**Sección:** ${d.section} | **Timestamp:** ${new Date(d.timestamp).toLocaleString('es-MX')}`,
          '',
          `### 1. Indicadores Bioeléctricos de Patógenos`,
          `- **Vmem VP (Variation Potential):** ${da.vmem_vp.toFixed(1)} mV`,
          `- **Ratio Impedancia (Z1k/Z10k):** ${da.impedance_ratio.toFixed(2)}`,
          `- **LWD (Leaf Wetness Duration):** ${da.lwd_hours.toFixed(1)} horas`,
          '',
          `### 2. Modelo PE Mills - Pronóstico 7 días`,
          `Riesgo: ${da.pe_mills_forecast.map((r, i) => `D+${i}: ${r}%`).join(' | ')}`,
          '',
          `### 3. Interpretación Científica`,
          da.impedance_ratio > 1.2 
            ? '⚠️ La ratio de impedancia elevada indica cambios en la composición iónica extracelular, posible colonización fúngica en progreso.'
            : '✅ La integridad de membrana celular está normal. Sin signos de invasión patogénica.',
          '',
          da.lwd_hours > 6 
            ? '⚠️ Alta duración de humedad foliar favorece germinación de esporas (Colletotrichum, Phytophthora).'
            : '✅ Condiciones de humedad no favorables para patógenos.',
          '',
          `### 4. Base Científica`,
          '- La impedancia refleja integridad de membranas celulares',
          '- Patógenos alteran conductancia iónica del apoplasto',
          '- PE Mills: Riesgo = f(LWD, Temperatura, Inóculo)',
          '',
          '---',
          '*Framework Levin: Bioelectric patterns reveal cellular health status*'
        ].join('\n')
      },
      nutrition: () => {
        const na = d.nutrition_analysis
        return [
          `## 🌿 Análisis PhD - Estado Nutricional (M3)`,
          `**Sección:** ${d.section} | **NPF Score:** ${(na.npf_score * 100).toFixed(0)}%`,
          '',
          `### 1. Indicadores Bioeléctricos Nutricionales`,
          `- **NPF (Nutrient Performance Factor):** ${(na.npf_score * 100).toFixed(0)}%`,
          '',
          `### 2. Deficiencias Detectadas por Vmem`,
          ...na.deficiencies.map(def => 
            `- **${def.nutrient}:** Severidad ${(def.severity * 100).toFixed(0)}% | Vmem: ${def.vmem_indicator} mV`
          ),
          '',
          `### 3. Interpretación Científica`,
          '**Mecanismo:** El potencial de membrana (Vmem) es directamente afectado por:',
          '- **K⁺:** Principal ion determinante del Vmem (ecuación Nernst)',
          '- **Ca²⁺:** Estabilizador de membranas, señalización',
          '- **Zn²⁺:** Cofactor de H⁺-ATPasa, regulador de Vmem',
          '',
          na.deficiencies.length > 0 
            ? `⚠️ Las deficiencias detectadas alteran el campo bioeléctrico y comprometen la señalización celular.`
            : '✅ Balance iónico óptimo. Campo bioeléctrico estable.',
          '',
          `### 4. Recomendación`,
          `📋 ${na.recommendation}`,
          '',
          '---',
          '*Framework Levin: Ion gradients encode morphogenetic information*'
        ].join('\n')
      },
      water: () => {
        const wa = d.water_analysis
        return [
          `## 💧 Análisis PhD - Estrés Hídrico (M4)`,
          `**Sección:** ${d.section} | **IAH:** ${(wa.iah_score * 100).toFixed(0)}%`,
          '',
          `### 1. Indicadores Bioeléctricos Hídricos`,
          `- **Vmem absoluto:** ${wa.vmem_absolute.toFixed(1)} mV`,
          `- **IAH (Índice Agua-Humedad):** ${(wa.iah_score * 100).toFixed(0)}%`,
          `- **Humedad del suelo:** ${wa.soil_moisture}%`,
          `- **ET0 actual:** ${wa.et0_actual.toFixed(1)} mm/día`,
          '',
          `### 2. Nivel de Estrés`,
          `- **Score de estrés:** ${wa.stress_level}%`,
          wa.stress_level > 50 ? '⚠️ ESTRÉS HÍDRICO MODERADO-SEVERO' :
          wa.stress_level > 25 ? '🟡 Estrés hídrico leve' : '✅ Sin estrés hídrico',
          '',
          `### 3. Interpretación Científica`,
          '**Mecanismo:** El déficit hídrico afecta Vmem por:',
          '- Pérdida de turgencia → Hiperpolarización',
          '- Cierre estomático → Acumulación de K⁺ en guarda',
          '- Señal sistémica de ABA → Despolarización transitoria',
          '',
          `### 4. Recomendación`,
          `💧 Riego recomendado: **${wa.irrigation_recommendation} mm**`,
          '',
          '---',
          '*Framework Levin: Bioelectric signals integrate with hydraulic signaling*'
        ].join('\n')
      },
      frost: () => {
        const fa = d.frost_analysis
        return [
          `## ❄️ Análisis PhD - Daño por Frío (M8)`,
          `**Sección:** ${d.section} | **Riesgo:** ${fa.risk_score}%`,
          '',
          `### 1. Indicadores de Daño por Frío`,
          `- **Score de riesgo:** ${fa.risk_score}%`,
          `- **Colapso Vmem detectado:** ${fa.vmem_collapse_detected ? '⚠️ SÍ' : '✅ NO'}`,
          `- **Daño estimado:** ${fa.damage_estimate}%`,
          `- **Probabilidad recuperación:** ${fa.recovery_probability}%`,
          '',
          `### 2. Interpretación Científica`,
          fa.vmem_collapse_detected 
            ? '⚠️ **ALERTA:** Se detectó colapso del potencial de membrana. Esto indica daño por cristalización intracelular y ruptura de membranas.'
            : '✅ No se detecta daño por frío. Las membranas celulares mantienen su integridad.',
          '',
          '**Mecanismo de daño por frío:**',
          '- T < 0°C → Formación de cristales de hielo',
          '- Ruptura mecánica de membranas → Colapso Vmem',
          '- Liberación de electrolitos → Conductancia elevada',
          '',
          '---',
          '*Framework Levin: Membrane integrity is fundamental to bioelectric signaling*'
        ].join('\n')
      },
      recovery: () => {
        const ra = d.recovery_analysis
        return [
          `## 💗 Análisis PhD - Monitor de Recuperación (M9)`,
          `**Sección:** ${d.section} | **Días desde evento:** ${ra.days_since_event}`,
          '',
          `### 1. Indicadores de Recuperación`,
          `- **Tasa de recuperación:** ${ra.recovery_rate.toFixed(1)} mV/día`,
          `- **Vmem σ (estabilidad):** ${ra.vmem_std.toFixed(1)} mV`,
          `- **Días desde perturbación:** ${ra.days_since_event}`,
          '',
          `### 2. Pronóstico`,
          `📊 **${ra.prognosis}**`,
          '',
          `### 3. Interpretación Científica`,
          '**Mecanismo de regeneración (Michael Levin):**',
          '- La regeneración requiere reprogramación bioeléctrica',
          '- El Vmem guía la especificación celular',
          '- La coherencia del campo indica coordinación multicelular',
          '',
          ra.recovery_rate > 2 
            ? '✅ Excelente tasa de recuperación. El campo bioeléctrico se está restaurando activamente.'
            : ra.recovery_rate > 1 
            ? '🟡 Recuperación moderada. El sistema está respondiendo pero puede requerir soporte.'
            : '⚠️ Recuperación lenta. Considerar intervenciones para acelerar regeneración.',
          '',
          '---',
          '*Framework Levin: Bioelectric patterns guide regeneration and repair*'
        ].join('\n')
      },
      circadian: () => {
        const ca = d.circadian_analysis
        return [
          `## 🌙 Análisis PhD - Ritmo Circadiano (M10)`,
          `**Sección:** ${d.section} | **Score Rítmico:** ${(ca.rhythm_score * 100).toFixed(0)}%`,
          '',
          `### 1. Parámetros Circadianos`,
          `- **Score de ritmo:** ${(ca.rhythm_score * 100).toFixed(0)}%`,
          `- **Desplazamiento de fase:** ${ca.phase_shift.toFixed(1)} horas`,
          `- **Amplitud:** ${ca.amplitude.toFixed(1)} mV`,
          '',
          `### 2. Ventana Óptima de Aplicación`,
          `🎯 **${ca.optimal_spray_window.start}:00 - ${ca.optimal_spray_window.end}:00 hrs**`,
          '',
          `### 3. Interpretación Científica`,
          '**Mecanismo circadiano:**',
          '- El Vmem oscila con período ~24h',
          '- Máxima absorción foliar en fase de apertura estomática',
          '- Metabolismo secundario sigue ritmo circadiano',
          '',
          ca.rhythm_score > 0.8 
            ? '✅ Ritmo circadiano robusto. La planta está sincronizada con el fotoperiodo.'
            : ca.rhythm_score > 0.5 
            ? '🟡 Ritmo circadiano moderado. Posible desincronización por estrés.'
            : '⚠️ Ritmo circadiano débil. La planta puede estar bajo estrés severo.',
          '',
          '---',
          '*Framework Levin: Bioelectric rhythms coordinate systemic physiology*'
        ].join('\n')
      }
    }
    return analyses[tab]()
  }, [])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-slate-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400">Cargando Inteligencia Bioeléctrica...</p>
        </div>
      </div>
    )
  }

  const d = data || FALLBACK_DATA
  const currentTab = TABS.find(t => t.id === activeTab)!

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Bioelectric Intelligence</h1>
            <p className="text-sm text-gray-400">Análisis Científico PhD - Levin Layer 2.0</p>
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
                    ? 'bg-purple-600 text-white shadow-lg' 
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
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-800 shadow-lg border-2' 
                : 'bg-slate-800/50 hover:bg-slate-800 border-2 border-transparent'
            }`}
            style={{ 
              borderColor: activeTab === tab.id ? tab.color : 'transparent',
              color: activeTab === tab.id ? tab.color : '#94a3b8'
            }}
          >
            {tab.icon}
            <span className="font-medium">{tab.name}</span>
            <span className="text-xs opacity-60">{tab.module}</span>
          </button>
        ))}
      </div>

      {/* Environmental Bar */}
      <div className="bg-slate-800/60 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-white">{d.environmental.temperature.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-white">{d.environmental.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white">{d.environmental.light_intensity} lux</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-white">{d.environmental.wind_speed} km/h</span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Davis WeatherLink • Actualizado: {new Date(d.timestamp).toLocaleTimeString('es-MX')}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Location Cards */}
        <div className="col-span-3 space-y-3">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Sensores por Zona</h3>
          {d.locations.map((loc) => (
            <div 
              key={loc.id}
              className={`p-4 rounded-xl border transition-all ${
                loc.status === 'online' 
                  ? 'bg-slate-800/80 border-green-500/30 hover:border-green-500/50' 
                  : 'bg-slate-800/40 border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{loc.name}</span>
                <StatusBadge status={loc.status === 'online' ? 'optimal' : 'critical'} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Vmem</span>
                  <div className="text-white font-medium">{loc.reading.vmem} mV</div>
                </div>
                <div>
                  <span className="text-gray-500">Freq</span>
                  <div className="text-white font-medium">{loc.reading.frequency_dominant} Hz</div>
                </div>
                <div>
                  <span className="text-gray-500">Z 1kHz</span>
                  <div className="text-white font-medium">{loc.reading.impedance_1k} kΩ</div>
                </div>
                <div>
                  <span className="text-gray-500">Temp</span>
                  <div className="text-white font-medium">{loc.reading.temperature}°C</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="col-span-9 space-y-4">
          {/* Tab Header */}
          <div 
            className="p-6 rounded-2xl border"
            style={{ 
              backgroundColor: `${currentTab.color}10`,
              borderColor: `${currentTab.color}40`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${currentTab.color}30`, color: currentTab.color }}
              >
                {currentTab.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Análisis: {currentTab.name}</h2>
                <p className="text-sm text-gray-400">Módulo {currentTab.module} - Levin Layer 2.0</p>
              </div>
            </div>

            {/* Tab-specific metrics */}
            {activeTab === 'pest' && (
              <div className="grid grid-cols-4 gap-4">
                <MetricCard
                  title="ΔVmem 6h"
                  value={d.pest_analysis.vmem_delta_6h.toFixed(1)}
                  unit="mV"
                  status={d.pest_analysis.vmem_delta_6h > 10 ? 'warning' : 'normal'}
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                />
                <MetricCard
                  title="Freq. Dominante"
                  value={d.pest_analysis.frequency_dominant.toFixed(1)}
                  unit="Hz"
                  status="normal"
                  icon={<Radio className="w-5 h-5 text-purple-400" />}
                />
                <MetricCard
                  title="Firmas Detectadas"
                  value={d.pest_analysis.signatures.length}
                  status="normal"
                  icon={<Bug className="w-5 h-5 text-red-400" />}
                />
                <MetricCard
                  title="Match Principal"
                  value={`${(d.pest_analysis.signatures[0]?.match_score * 100 || 0).toFixed(0)}%`}
                  subtitle={d.pest_analysis.signatures[0]?.pest || 'N/A'}
                  status={d.pest_analysis.signatures[0]?.match_score > 0.7 ? 'warning' : 'normal'}
                  icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
                />
              </div>
            )}

            {activeTab === 'disease' && (
              <div className="grid grid-cols-4 gap-4">
                <MetricCard
                  title="Vmem VP"
                  value={d.disease_analysis.vmem_vp.toFixed(1)}
                  unit="mV"
                  status={d.disease_analysis.vmem_vp > 15 ? 'warning' : 'normal'}
                  icon={<Zap className="w-5 h-5 text-orange-400" />}
                />
                <MetricCard
                  title="Ratio Impedancia"
                  value={d.disease_analysis.impedance_ratio.toFixed(2)}
                  status={d.disease_analysis.impedance_ratio > 1.2 ? 'warning' : 'normal'}
                  icon={<Activity className="w-5 h-5 text-purple-400" />}
                />
                <MetricCard
                  title="LWD"
                  value={d.disease_analysis.lwd_hours.toFixed(1)}
                  unit="hrs"
                  status={d.disease_analysis.lwd_hours > 6 ? 'warning' : 'normal'}
                  icon={<Droplets className="w-5 h-5 text-blue-400" />}
                />
                <MetricCard
                  title="Riesgo PE Mills"
                  value={`${d.disease_analysis.pe_mills_forecast[0]}%`}
                  subtitle="Hoy"
                  status={d.disease_analysis.pe_mills_forecast[0] > 60 ? 'warning' : 'normal'}
                  icon={<Virus className="w-5 h-5 text-red-400" />}
                />
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="grid grid-cols-4 gap-4">
                <GaugeCard
                  title="NPF Score"
                  value={d.nutrition_analysis.npf_score * 100}
                  status={d.nutrition_analysis.npf_score >= 0.85 ? 'optimal' : d.nutrition_analysis.npf_score >= 0.7 ? 'normal' : 'warning'}
                  icon={<Leaf className="w-5 h-5 text-green-400" />}
                />
                <MetricCard
                  title="Deficiencias"
                  value={d.nutrition_analysis.deficiencies.length}
                  status={d.nutrition_analysis.deficiencies.length > 2 ? 'warning' : 'normal'}
                  icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
                />
                <div className="col-span-2 bg-slate-800/60 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Recomendación</div>
                  <div className="text-white">{d.nutrition_analysis.recommendation}</div>
                </div>
              </div>
            )}

            {activeTab === 'water' && (
              <div className="grid grid-cols-4 gap-4">
                <GaugeCard
                  title="IAH Score"
                  value={d.water_analysis.iah_score * 100}
                  status={d.water_analysis.iah_score >= 0.7 ? 'optimal' : d.water_analysis.iah_score >= 0.5 ? 'normal' : 'warning'}
                  icon={<Droplets className="w-5 h-5 text-cyan-400" />}
                />
                <MetricCard
                  title="Vmem Absoluto"
                  value={d.water_analysis.vmem_absolute.toFixed(1)}
                  unit="mV"
                  status="normal"
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                />
                <MetricCard
                  title="Estrés Hídrico"
                  value={`${d.water_analysis.stress_level}%`}
                  status={d.water_analysis.stress_level > 50 ? 'critical' : d.water_analysis.stress_level > 25 ? 'warning' : 'optimal'}
                  icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                />
                <MetricCard
                  title="Riego Recomendado"
                  value={d.water_analysis.irrigation_recommendation}
                  unit="mm"
                  status="normal"
                  icon={<Droplets className="w-5 h-5 text-blue-400" />}
                />
              </div>
            )}

            {activeTab === 'frost' && (
              <div className="grid grid-cols-4 gap-4">
                <GaugeCard
                  title="Riesgo de Helada"
                  value={d.frost_analysis.risk_score}
                  status={d.frost_analysis.risk_score > 50 ? 'critical' : d.frost_analysis.risk_score > 20 ? 'warning' : 'optimal'}
                  icon={<Snowflake className="w-5 h-5 text-blue-400" />}
                />
                <MetricCard
                  title="Colapso Vmem"
                  value={d.frost_analysis.vmem_collapse_detected ? 'DETECTADO' : 'No'}
                  status={d.frost_analysis.vmem_collapse_detected ? 'critical' : 'optimal'}
                  icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                />
                <MetricCard
                  title="Daño Estimado"
                  value={`${d.frost_analysis.damage_estimate}%`}
                  status={d.frost_analysis.damage_estimate > 20 ? 'critical' : 'optimal'}
                  icon={<Activity className="w-5 h-5 text-orange-400" />}
                />
                <MetricCard
                  title="Prob. Recuperación"
                  value={`${d.frost_analysis.recovery_probability}%`}
                  status={d.frost_analysis.recovery_probability >= 80 ? 'optimal' : 'warning'}
                  icon={<Heart className="w-5 h-5 text-pink-400" />}
                />
              </div>
            )}

            {activeTab === 'recovery' && (
              <div className="grid grid-cols-4 gap-4">
                <MetricCard
                  title="Tasa Recuperación"
                  value={d.recovery_analysis.recovery_rate.toFixed(1)}
                  unit="mV/día"
                  status={d.recovery_analysis.recovery_rate > 2 ? 'optimal' : 'normal'}
                  icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                />
                <MetricCard
                  title="Vmem σ"
                  value={d.recovery_analysis.vmem_std.toFixed(1)}
                  unit="mV"
                  status={d.recovery_analysis.vmem_std < 5 ? 'optimal' : 'warning'}
                  icon={<Activity className="w-5 h-5 text-purple-400" />}
                />
                <MetricCard
                  title="Días Desde Evento"
                  value={d.recovery_analysis.days_since_event}
                  unit="días"
                  status="normal"
                  icon={<Clock className="w-5 h-5 text-blue-400" />}
                />
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Pronóstico</div>
                  <div className="text-white text-sm">{d.recovery_analysis.prognosis}</div>
                </div>
              </div>
            )}

            {activeTab === 'circadian' && (
              <div className="grid grid-cols-4 gap-4">
                <GaugeCard
                  title="Score Rítmico"
                  value={d.circadian_analysis.rhythm_score * 100}
                  status={d.circadian_analysis.rhythm_score >= 0.8 ? 'optimal' : 'warning'}
                  icon={<Clock className="w-5 h-5 text-teal-400" />}
                />
                <MetricCard
                  title="Desfase"
                  value={d.circadian_analysis.phase_shift.toFixed(1)}
                  unit="hrs"
                  status={Math.abs(d.circadian_analysis.phase_shift) < 1 ? 'optimal' : 'warning'}
                  icon={<Clock className="w-5 h-5 text-orange-400" />}
                />
                <MetricCard
                  title="Amplitud"
                  value={d.circadian_analysis.amplitude.toFixed(1)}
                  unit="mV"
                  status="normal"
                  icon={<Activity className="w-5 h-5 text-purple-400" />}
                />
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-sm text-green-400 mb-2">Ventana Óptima Spray</div>
                  <div className="text-xl font-bold text-white">
                    {d.circadian_analysis.optimal_spray_window.start}:00 - {d.circadian_analysis.optimal_spray_window.end}:00
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PhD AI Analysis */}
          <PHDAIAnalysisCard
            title={`${currentTab.name} - Módulo ${currentTab.module}`}
            data={d}
            generateAnalysis={(data) => generateTabAnalysis(data as BioelectricIntelligenceData, activeTab)}
            apiEndpoint={`/c2ai-api/api/v1/levin/analysis/${activeTab}`}
          />
        </div>
      </div>

      {/* Scientific Footer */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <div className="flex items-start gap-3 text-sm text-gray-500">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-white font-medium">Bioelectric Intelligence:</span>{' '}
            Análisis basado en el framework de cognición bioeléctrica de Michael Levin (Tufts University).
            Los patrones de Vmem, impedancia y frecuencia codifican información sobre el estado fisiológico 
            de la planta y permiten detección temprana de estreses bióticos y abióticos.
          </div>
        </div>
      </div>
    </div>
  )
}

export default BioelectricIntelligence
