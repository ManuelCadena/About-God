/**
 * MarketKernelPanel - Panel del Kernel Market para el framework Hoffman-Levin
 * 
 * Visualiza precios de mercado y optimización de timing de venta usando MDP.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  AlertTriangle,
  Brain,
  Activity,
  DollarSign,
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react'
import { IndustrialGauge } from '../charts/IndustrialGauge'

interface MarketState {
  timestamp: string
  market_factor: number
  band: string
  trend: string
  current_price: number
  avg_price_30d: number
  price_volatility: number
  price_forecast_30d: number
  seasonal_index: number
  export_window: boolean
}

interface MarketKernelPanelProps {
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

export default function MarketKernelPanel({ selectedSection = 'S1' }: MarketKernelPanelProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marketData, setMarketData] = useState<MarketState | null>(null)
  const [policy, setPolicy] = useState<any>(null)
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const generatePHDAnalysis = (st: MarketState): string => {
    return `## 🎓 Análisis PhD - Kernel Market (Framework Hoffman-Levin)

**Diagnóstico:** El factor de mercado se encuentra en ventana **${st.band}** con precio actual $${st.current_price?.toFixed(2) || '--'}/kg.
Promedio 30d: $${st.avg_price_30d?.toFixed(2) || '--'}/kg, Índice estacional: ${st.seasonal_index?.toFixed(2) || '--'}.

**Causa-Raíz:** ${(st.seasonal_index || 1) > 1.1 
  ? `Temporada alta de precios. Demanda elevada en mercado de exportación.`
  : `Condiciones de mercado normales. Volatilidad: ${((st.price_volatility || 0) * 100).toFixed(1)}%.`}

**Política MDP:** ${st.export_window ? 'Ventana de exportación ABIERTA. Priorizar cosecha de calibres premium.' : 'Evaluar almacenamiento o mercado nacional.'}

**Impacto VEP:** El factor Market (peso 10% en PE) determina el valor monetario del VEP. ${st.current_price >= 20 ? 'Precio favorable para maximizar ingresos.' : 'Considerar timing de venta.'}

**Recomendación:** ${st.current_price >= 22 
  ? '✅ Precio PICO detectado. Maximizar volumen de cosecha y exportación.'
  : '⚠️ Monitorear evolución de precios. Pronóstico 30d: $' + (st.price_forecast_30d || '--')}`;
  };

  const requestPHDAnalysis = async () => {
    if (!marketData) return;
    setLoadingPHD(true);
    try {
      const response = await fetch(`/api/v1/llm/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'market_advisor', data: { price: marketData.current_price, band: marketData.band } })
      });
      if (response.ok) {
        const data = await response.json();
        setPhdAnalysis(data.interpretation || generatePHDAnalysis(marketData));
      } else {
        setPhdAnalysis(generatePHDAnalysis(marketData));
      }
    } catch {
      setPhdAnalysis(generatePHDAnalysis(marketData));
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
        // Obtener datos de precios del endpoint de mercado
        let currentPrice = 22.91 // Precio base del presupuesto 2026
        let avgPrice = 17.49
        let forecast = 25.0
        
        try {
          const marketRes = await fetch(`${API_BASE_URL}/market/current`)
          if (marketRes.ok) {
            const marketInfo = await marketRes.json()
            currentPrice = marketInfo.precio_actual || currentPrice
            avgPrice = marketInfo.precio_promedio || avgPrice
            forecast = marketInfo.forecast_30d || forecast
          }
        } catch {
          // Usar valores del presupuesto
        }
        
        // Determinar banda y ventana de exportación
        let band = 'WARNING'
        let exportWindow = false
        if (currentPrice >= 25) { band = 'ÓPTIMO'; exportWindow = true }
        else if (currentPrice >= 20) { band = 'WARNING'; exportWindow = true }
        else if (currentPrice >= 15) { band = 'ALERTA'; exportWindow = false }
        else { band = 'CRÍTICO'; exportWindow = false }
        
        // Índice estacional (mes actual)
        const month = new Date().getMonth() + 1
        const SEASONAL_INDEX: Record<number, number> = {
          1: 1.65, 2: 1.53, 3: 2.08, 4: 0.94, 5: 0.76, 6: 0.65,
          7: 1.12, 8: 1.06, 9: 1.79, 10: 0.94, 11: 0.30, 12: 1.41
        }
        const seasonalIndex = SEASONAL_INDEX[month] || 1.0
        
        setMarketData({
          timestamp: new Date().toISOString(),
          market_factor: currentPrice / 17.0, // Normalizado vs promedio histórico
          band: band,
          trend: currentPrice > avgPrice ? 'UP' : 'DOWN',
          current_price: currentPrice,
          avg_price_30d: avgPrice,
          price_volatility: 0.15,
          price_forecast_30d: forecast,
          seasonal_index: seasonalIndex,
          export_window: exportWindow
        })
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error('Error fetching Market data:', err)
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
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="ml-3 text-gray-400">Cargando Kernel Market...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg p-6 border border-emerald-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Kernel Market - Factor Precio</h2>
              <p className="text-gray-400">Optimización de Timing de Venta | General</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            title="Actualizar datos"
            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-emerald-400" />
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
        {/* IndustrialGauge para Market */}
        <IndustrialGauge
          title="Market $"
          value={marketData?.market_factor || 0}
          meta={0.85}
          min={0}
          max={1}
          status={marketData?.band === 'ÓPTIMO' ? 'optimal' : marketData?.band === 'CRÍTICO' ? 'critical' : 'warning'}
          trendDirection={marketData?.trend === 'UP' ? 'up' : marketData?.trend === 'DOWN' ? 'down' : 'stable'}
          source="market.precios_lima_persa"
          size="md"
          colorScheme="green"
        />

        {/* Precio Actual */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-sm">Precio Actual</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${marketData?.current_price?.toFixed(2) || '--'} <span className="text-sm text-gray-400">/kg</span>
          </div>
          <div className="text-xs text-gray-500">
            Promedio 30d: ${marketData?.avg_price_30d?.toFixed(2) || '--'}
          </div>
        </div>

        {/* Índice Estacional */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Índice Estacional</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {marketData?.seasonal_index?.toFixed(2) || '--'}
          </div>
          <div className="text-xs text-gray-500">
            {(marketData?.seasonal_index || 1) > 1 ? '↑ Temporada alta' : '↓ Temporada baja'}
          </div>
        </div>

        {/* Ventana Exportación */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-sm">Ventana Exportación</span>
          </div>
          <div className={`text-2xl font-bold ${marketData?.export_window ? 'text-green-400' : 'text-gray-500'}`}>
            {marketData?.export_window ? '✓ ABIERTA' : '✗ CERRADA'}
          </div>
          <div className="text-xs text-gray-500">
            Volatilidad: {((marketData?.price_volatility || 0) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Política Recomendada */}
      {policy && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Política MDP Óptima</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Decisión de Venta</div>
              <div className="text-lg font-semibold text-emerald-400">
                {policy.optimal_action || 'Esperar mejor precio'}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Precio Esperado</div>
              <div className="text-lg font-semibold text-green-400">
                ${policy.expected_price?.toFixed(2) || '--'}/kg
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Ganancia Potencial</div>
              <div className="text-lg font-semibold text-yellow-400">
                +{policy.potential_gain_percent?.toFixed(1) || '0'}%
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
          ) : marketData ? (<div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{generatePHDAnalysis(marketData)}</div>
          ) : (<p className="text-gray-500 italic">Cargando análisis PhD...</p>)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Sobre el Kernel Market</h4>
            <p className="text-sm text-gray-400">
              El factor Market modela las condiciones de precio y demanda del mercado.
              Optimiza decisiones de timing de venta para maximizar ingresos por VEP.
              Es un kernel GENERAL que aplica uniformemente a toda la finca.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
