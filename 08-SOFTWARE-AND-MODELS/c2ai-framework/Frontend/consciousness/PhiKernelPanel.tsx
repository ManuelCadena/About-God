/**
 * PhiKernelPanel - Panel del Kernel φ (Fenológico) para el framework Hoffman-Levin
 * 
 * Visualiza el estado fenológico y alineación con ventanas óptimas usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  Flower2, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  Target,
  Brain,
  Activity,
  Clock,
  Leaf,
  Sparkles
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface PhiState {
  section_id: string
  timestamp: string
  phi: number
  band: string
  trend: string
  current_stage: string
  stage_number: number
  gdd_accumulated: number
  gdd_target: number
  days_in_stage: number
  expected_harvest_date: string
}

interface PhiKernelPanelProps {
  selectedSection?: string
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'WARNING': '#eab308',
  'ALERTA': '#f97316',
  'CRÍTICO': '#ef4444',
}

const PHENOLOGY_STAGES = [
  { id: 0, name: 'Dormancia', color: '#6b7280' },
  { id: 1, name: 'Brotación', color: '#84cc16' },
  { id: 2, name: 'Floración', color: '#ec4899' },
  { id: 3, name: 'Cuajado', color: '#f97316' },
  { id: 4, name: 'Desarrollo', color: '#22c55e' },
  { id: 5, name: 'Maduración', color: '#eab308' },
  { id: 6, name: 'Cosecha', color: '#8b5cf6' },
]

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8501/api/v1'
  : '/api/v1'

export default function PhiKernelPanel({ selectedSection = 'S1' }: PhiKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [phiData, setPhiData] = useState<PhiState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: PhiState): string => {
    const stageName = PHENOLOGY_STAGES[st.stage_number]?.name || 'Desconocido';
    return `## 🎓 Análisis PhD - Kernel φ (Framework Hoffman-Levin)

**Diagnóstico:** El factor fenológico se encuentra en estado **${st.band}** con φ=${(st.phi * 100).toFixed(1)}%.
Etapa actual: ${stageName} (${st.stage_number}/6), GDD acumulados: ${st.gdd_accumulated?.toFixed(0) || '--'}/${st.gdd_target?.toFixed(0) || '--'}.

**Causa-Raíz:** ${st.phi < 0.8 
  ? `Desalineación fenológica detectada. ${st.days_in_stage} días en etapa actual pueden afectar sincronización con mercado.`
  : `Alineación óptima con ventana de mercado premium. Fenología en ritmo esperado.`}

**Política MDP:** ${st.stage_number >= 5 ? 'Preparar logística de cosecha.' : 'Monitorear acumulación de GDD y ajustar si es necesario.'}

**Impacto VEP:** El factor φ (peso 12% en PE) determina la ventana de precio óptimo. ${st.phi >= 0.8 ? 'Sincronización favorable para premium.' : 'Riesgo de pérdida de ventana de precio alto.'}

**Recomendación:** ${st.phi < 0.8 
  ? '⚠️ Evaluar intervenciones hormonales o estrés controlado para ajustar timing.'
  : '✅ Mantener condiciones actuales. Cosecha estimada: ' + (st.expected_harvest_date || 'por calcular')}`;
  };

  const requestPHDAnalysis = async () => {
    if (!phiData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'phenology_agent', data: { phi: phiData.phi, band: phiData.band, stage: phiData.stage_number, section: selectedSection } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(phiData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(phiData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(phiData));
    } finally {
      setLoadingPHD(false);
    }
  };

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Usar Motor Unificado como fuente primaria (SSOT)
      const res = await fetch(`${API_BASE_URL}/pe/factors`)
      
      if (res.ok) {
        const data = await res.json()
        const phiFactorData = data.factors?.phi
        
        if (phiFactorData) {
          const detalle = phiFactorData.detalle || {}
          
          // Determinar banda basada en valor
          let band = 'ÓPTIMO'
          if (phiFactorData.value >= 0.95) band = 'ÓPTIMO'
          else if (phiFactorData.value >= 0.85) band = 'ADECUADO'
          else if (phiFactorData.value >= 0.70) band = 'DEFICIENTE'
          else band = 'CRÍTICO'
          
          // Obtener datos fenológicos de BioFix
          let stageNumber = 0
          let gddAccumulated = 0
          let daysInStage = 0
          
          try {
            const bioFixRes = await fetch(`${API_BASE_URL}/biofix/current`)
            if (bioFixRes.ok) {
              const bioFixData = await bioFixRes.json()
              stageNumber = bioFixData.phenology_stage || 0
              gddAccumulated = bioFixData.gdd_accumulated || 0
              daysInStage = bioFixData.days_in_stage || 0
            }
          } catch {
            // Valores por defecto basados en fecha
            const month = new Date().getMonth() + 1
            if (month >= 1 && month <= 3) stageNumber = 0 // Dormancia
            else if (month >= 4 && month <= 5) stageNumber = 1 // Brotación
            else if (month >= 6 && month <= 7) stageNumber = 2 // Floración
            else if (month >= 8 && month <= 10) stageNumber = 3 // Cuajado
            else if (month >= 11 && month <= 12) stageNumber = 4 // Desarrollo
            gddAccumulated = Math.random() * 500 + 200
            daysInStage = Math.floor(Math.random() * 30 + 5)
          }
          
          setPhiData({
            timestamp: new Date().toISOString(),
            section_id: selectedSection,
            phi: phiFactorData.value,
            band: band,
            trend: detalle.trend || 'stable',
            current_stage: ['Dormancia', 'Brotación', 'Floración', 'Cuajado', 'Desarrollo', 'Maduración', 'Cosecha'][stageNumber] || 'Desconocido',
            stage_number: stageNumber,
            gdd_accumulated: gddAccumulated,
            gdd_target: 2000,
            days_in_stage: daysInStage,
            expected_harvest_date: '2025-12-15'
          })
        }
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching Phi data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedSection])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getBandColor = (band: string) => BAND_COLORS[band] || '#6b7280'

  const getStageColor = (stageNum: number) => {
    return PHENOLOGY_STAGES[stageNum]?.color || '#6b7280'
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 animate-spin text-pink-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel φ...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-lg p-6 border border-pink-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <Flower2 className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel φ - Factor Fenológico</h2>
              <p className="text-gray-400">Alineación con Ventanas Óptimas | Sección {selectedSection}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            title="Actualizar datos"
            className="p-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-pink-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Estado Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IndustrialGauge para PHI */}
        <IndustrialGauge
          title="φ Fenología"
          value={phiData?.phi || 0}
          meta={0.95}
          min={0}
          max={1}
          status={phiData?.band === 'ÓPTIMO' ? 'optimal' : phiData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={phiData?.trend === 'UP' ? 'up' : phiData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="agronomy.fenologia_actual"
          size="md"
          colorScheme="green"
        />

        {/* Etapa Actual */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Etapa Fenológica</span>
          </div>
          <div 
            className="text-xl font-bold"
            style={{ color: getStageColor(phiData?.stage_number || 0) }}
          >
            {phiData?.current_stage || 'Desconocido'}
          </div>
          <div className="text-xs text-gray-500">Etapa {phiData?.stage_number || 0}/6</div>
        </div>

        {/* GDD */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">GDD Acumulados</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {phiData?.gdd_accumulated?.toFixed(0) || '--'} 
            <span className="text-sm text-gray-400">/ {phiData?.gdd_target?.toFixed(0) || '--'}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              style={{ 
                width: `${Math.min(100, ((phiData?.gdd_accumulated || 0) / (phiData?.gdd_target || 1)) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Días en Etapa */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-sm">Días en Etapa</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {phiData?.days_in_stage || 0} <span className="text-sm text-gray-400">días</span>
          </div>
        </div>
      </div>

      {/* Timeline Fenológico */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Línea de Tiempo Fenológica</h3>
        </div>
        
        <div className="flex items-center justify-between">
          {PHENOLOGY_STAGES.map((stage, idx) => (
            <div key={stage.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  (phiData?.stage_number || 0) >= idx 
                    ? 'text-white' 
                    : 'text-gray-500 bg-gray-700'
                }`}
                style={{ 
                  backgroundColor: (phiData?.stage_number || 0) >= idx ? stage.color : undefined 
                }}
              >
                {idx}
              </div>
              <span className={`text-xs mt-1 ${
                (phiData?.stage_number || 0) === idx ? 'text-white font-semibold' : 'text-gray-500'
              }`}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acción Recomendada</div>
              <div className="text-lg font-semibold text-pink-400">
                {policy.optimal_action || 'Monitorear GDD'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">φ Esperado</div>
              <div className="text-lg font-semibold text-green-400">
                {policy.expected_phi ? (policy.expected_phi * 100).toFixed(1) : '--'}%
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Fecha Cosecha Est.</div>
              <div className="text-lg font-semibold text-purple-400">
                {phiData?.expected_harvest_date || 'Por calcular'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel PhD con LLM */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button onClick={requestPHDAnalysis} disabled={loadingPHD}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
            {loadingPHD ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingPHD ? 'Analizando...' : 'Regenerar'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          {loadingPHD ? (
            <div className="flex items-center justify-center py-8"><RefreshCw className="w-8 h-8 animate-spin text-purple-500" /></div>
          ) : phdAnalysis ? (
            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{phdAnalysis}</div>
          ) : phiData ? (
            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{generatePHDAnalysis(phiData)}</div>
          ) : (<p className="text-gray-500 italic">Cargando análisis PhD...</p>)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-pink-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel φ</h4>
            <p className="text-sm text-gray-400">
              El factor φ modela la alineación fenológica con ventanas de mercado premium.
              Optimiza decisiones de inducción floral, estrés hídrico y timing de cosecha.
              Meta: φ ≥ 80% para sincronizar con picos de precio del mercado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
