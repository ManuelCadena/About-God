/**
 * LAIKernelPanel - Panel del Kernel LAI (Área Foliar) para el framework Hoffman-Levin
 * 
 * Visualiza el índice de área foliar y su impacto en fotosíntesis usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  Leaf, 
  Sun, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  Brain,
  Activity,
  Zap,
  TreePine,
  Sparkles
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface LAIState {
  section_id: string
  timestamp: string
  lai_factor: number
  band: string
  trend: string
  lai_value: number
  lai_optimal: number
  photosynthesis_rate: number
  defoliation_percent: number
  vigor_index: number
}

interface LAIKernelPanelProps {
  selectedSection?: string
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'WARNING': '#eab308',
  'ALERTA': '#f97316',
  'CRÍTICO': '#ef4444',
}

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8501/api/v1'
  : '/api/v1'

export default function LAIKernelPanel({ selectedSection = 'S1' }: LAIKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [laiData, setLaiData] = useState<LAIState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: LAIState): string => {
    return `## 🎓 Análisis PhD - Kernel LAI (Framework Hoffman-Levin)

**Diagnóstico:** El factor de área foliar se encuentra en estado **${st.band}** con LAI=${(st.lai_factor * 100).toFixed(1)}%.
LAI actual: ${st.lai_value?.toFixed(2) || '--'} m²/m², Óptimo: ${st.lai_optimal?.toFixed(1) || '4-6'} m²/m².

**Causa-Raíz:** ${st.defoliation_percent > 15 
  ? `Defoliación elevada (${st.defoliation_percent?.toFixed(0)}%). Posible ataque de plagas o estrés.`
  : `Cobertura foliar adecuada. Tasa fotosintética: ${((st.photosynthesis_rate || 0) * 100).toFixed(0)}%.`}

**Política MDP:** ${st.lai_value < 4 ? 'Estimular brotación con fertilización foliar.' : st.lai_value > 6 ? 'Considerar poda de aclareo.' : 'Mantener condiciones actuales.'}

**Impacto VEP:** El factor LAI (peso 10% en PE) determina capacidad fotosintética. ${st.lai_factor >= 0.8 ? 'Estado favorable para producción de carbohidratos.' : 'Reducción potencial en llenado de frutos.'}

**Recomendación:** ${st.defoliation_percent > 25 
  ? '⚠️ Investigar causa de defoliación. Revisar sanidad y nutrición.'
  : '✅ Mantener monitoreo de índice de vigor: ' + ((st.vigor_index || 0) * 100).toFixed(0) + '%'}`;
  };

  const requestPHDAnalysis = async () => {
    if (!laiData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'satellite_advisor', data: { lai: laiData.lai_factor, band: laiData.band, section: selectedSection } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(laiData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(laiData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(laiData));
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
        const laiFactorData = data.factors?.lai
        
        if (laiFactorData) {
          const detalle = laiFactorData.detalle || {}
          
          // Determinar banda basada en valor
          let band = 'ADECUADO'
          if (laiFactorData.value >= 0.95) band = 'ÓPTIMO'
          else if (laiFactorData.value >= 0.85) band = 'ADECUADO'
          else if (laiFactorData.value >= 0.70) band = 'DEFICIENTE'
          else band = 'CRÍTICO'
          
          setLaiData({
            timestamp: new Date().toISOString(),
            section_id: selectedSection,
            lai_factor: laiFactorData.value,
            band: band,
            trend: detalle.trend || 'stable',
            lai_value: detalle.lai_actual || 4.5,
            lai_optimal: detalle.lai_optimo || 5.0,
            photosynthesis_rate: detalle.tasa_fotosintesis || 85,
            defoliation_percent: detalle.defoliacion_pct || 5,
            vigor_index: detalle.vigor_index || 0.9
          })
        }
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching LAI data:', err)
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

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 animate-spin text-teal-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel LAI...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-lg p-6 border border-teal-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/20 rounded-lg">
              <Leaf className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel LAI - Índice Área Foliar</h2>
              <p className="text-gray-400">Capacidad Fotosintética | Sección {selectedSection}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            title="Actualizar datos"
            className="p-2 bg-teal-500/20 hover:bg-teal-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-teal-400" />
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
        {/* IndustrialGauge para LAI */}
        <IndustrialGauge
          title="LAI Foliar"
          value={laiData?.lai_factor || 0}
          meta={0.90}
          min={0}
          max={1}
          status={laiData?.band === 'ÓPTIMO' ? 'optimal' : laiData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={laiData?.trend === 'UP' ? 'up' : laiData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="SECTION_CHARACTERISTICS"
          size="md"
          colorScheme="green"
        />

        {/* Valor LAI */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="w-4 h-4 text-teal-400" />
            <span className="text-gray-400 text-sm">LAI Actual</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {laiData?.lai_value?.toFixed(2) || '--'} <span className="text-sm text-gray-400">m²/m²</span>
          </div>
          <div className="text-xs text-gray-500">
            Óptimo: {laiData?.lai_optimal?.toFixed(1) || '4-6'} m²/m²
          </div>
        </div>

        {/* Tasa Fotosíntesis */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm">Tasa Fotosíntesis</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((laiData?.photosynthesis_rate || 0) * 100).toFixed(0)}%
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
              style={{ width: `${(laiData?.photosynthesis_rate || 0) * 100}%` }}
            />
          </div>
        </div>

        {/* Defoliación */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-sm">Defoliación</span>
          </div>
          <div className={`text-2xl font-bold ${
            (laiData?.defoliation_percent || 0) <= 10 ? 'text-green-400' :
            (laiData?.defoliation_percent || 0) <= 25 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {(laiData?.defoliation_percent || 0).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            Vigor: {((laiData?.vigor_index || 0) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-teal-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acción Recomendada</div>
              <div className="text-lg font-semibold text-teal-400">
                {policy.optimal_action || 'Mantener LAI'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">LAI Esperado</div>
              <div className="text-lg font-semibold text-green-400">
                {policy.expected_lai?.toFixed(2) || '--'} m²/m²
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Impacto VEP</div>
              <div className="text-lg font-semibold text-emerald-400">
                +${policy.delta_vep?.toLocaleString() || '0'} MXN
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel PhD con LLM */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /><span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button onClick={requestPHDAnalysis} disabled={loadingPHD}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
            {loadingPHD ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingPHD ? 'Analizando...' : 'Regenerar'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          {loadingPHD ? (<div className="flex items-center justify-center py-8"><RefreshCw className="w-8 h-8 animate-spin text-purple-500" /></div>
          ) : phdAnalysis ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{phdAnalysis}</div>
          ) : laiData ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{generatePHDAnalysis(laiData)}</div>
          ) : (<p className="text-gray-500 italic">Cargando análisis PhD...</p>)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-teal-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel LAI</h4>
            <p className="text-sm text-gray-400">
              El factor LAI modela el índice de área foliar y su impacto en la capacidad fotosintética.
              Optimiza decisiones de control de defoliadores, fertilización foliar y poda de renovación.
              Meta: LAI 4-6 m²/m² para fotosíntesis óptima sin auto-sombreado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
