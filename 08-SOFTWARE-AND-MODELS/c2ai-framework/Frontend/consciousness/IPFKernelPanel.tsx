/**
 * IPFKernelPanel - Panel del Kernel IPF para el framework Hoffman-Levin
 * 
 * Visualiza el estado actual del IPF y políticas óptimas usando MDP.
 * Incluye comparativa de políticas y análisis PhD con LLM.
 * 
 * Framework: Hoffman-Levin-Watson
 * Autor: Dr. José Manuel Cadena
 * Fecha: Diciembre 2025
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  Shield, 
  Bug, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Brain,
  Activity,
  ChevronRight,
  Calendar,
  ArrowLeftRight,
  Zap
} from 'lucide-react'
import { 
  // LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  // Area,
  ComposedChart
} from 'recharts'
import { IndustrialGauge, MiniGauge } from '../charts/IndustrialGauge'

interface IPFState {
  section_id: string
  timestamp: string
  ipf: number
  band: string
  trend: string
  trips: number
  diaforina: number
  arana_roja: number
  minador: number
  fen: number
  gdd: number
  pe_proyectado: number
  pest_pressure: number
  days_since_treatment: number
  phi_active: boolean
}

interface PolicyAction {
  week: number
  action: string
  action_name: string
  description: string
  costo_ha: number
  ipf_esperado: number
  band_esperado: string
}

interface PolicyResult {
  policy_name: string
  actions: PolicyAction[]
  final_ipf: number
  final_band: string
  total_cost: number
  delta_vep: number
  roi: number
}

interface IPFPolicyData {
  section_id: string
  initial_state: IPFState
  optimal_policy: PolicyResult
  comparison: Record<string, PolicyResult>
  recommendation: string
  phd_context: Record<string, any>
}

interface IPFKernelPanelProps {
  selectedSection?: string
  onAnalysisPHD?: (context: Record<string, any>) => void
}

const BAND_COLORS: Record<string, string> = {
  'ÓPTIMO': '#22c55e',
  'WARNING': '#eab308',
  'ALERTA': '#f97316',
  'CRÍTICO': '#ef4444',
}

// BAND_BG se usa para estilos de fondo por banda (reservado para uso futuro)
const _BAND_BG: Record<string, string> = {
  'ÓPTIMO': 'bg-green-500/20 border-green-500/50',
  'WARNING': 'bg-yellow-500/20 border-yellow-500/50',
  'ALERTA': 'bg-orange-500/20 border-orange-500/50',
  'CRÍTICO': 'bg-red-500/20 border-red-500/50',
}

export function IPFKernelPanel({ selectedSection = 'S1', onAnalysisPHD: _onAnalysisPHD }: IPFKernelPanelProps) {
  const [section, setSection] = useState(selectedSection)
  const [horizon, setHorizon] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [policyData, setPolicyData] = useState<IPFPolicyData | null>(null)
  const [_selectedPolicy, _setSelectedPolicy] = useState<string>('mdp_optima')
  const [loadingPHD, setLoadingPHD] = useState(false)
  const [phdAnalysis, setPhdAnalysis] = useState<string | null>(null)

  const fetchPolicy = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/v1/consciousness/ipf/policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: section,
          horizon_weeks: horizon,
          ipf_target: 0.90,
          budget_per_ha: 5000,
          precio_limon: 18.0
        })
      })
      
      if (!response.ok) throw new Error('Error al obtener política IPF')
      
      const data = await response.json()
      setPolicyData(data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setPolicyData(generateMockData(section, horizon))
    } finally {
      setLoading(false)
    }
  }, [section, horizon])

  useEffect(() => {
    fetchPolicy()
  }, [fetchPolicy])

  const generateMockData = (sec: string, weeks: number): IPFPolicyData => {
    const sectionData: Record<string, { ipf: number, trips: number, diaforina: number }> = {
      'S1': { ipf: 0.82, trips: 32.5, diaforina: 2.1 },
      'S2': { ipf: 0.88, trips: 18.2, diaforina: 1.5 },
      'S3': { ipf: 0.75, trips: 45.0, diaforina: 4.2 },
    }
    const data = sectionData[sec] || sectionData['S1']
    
    const mockActions: PolicyAction[] = [
      { week: 1, action: 'A1_RECETA_OPTIMA', action_name: 'Receta Óptima', description: 'Aplicar tratamiento completo', costo_ha: 850, ipf_esperado: 0.91, band_esperado: 'ÓPTIMO' },
      { week: 2, action: 'A0_NO_TRATAR', action_name: 'No tratar', description: 'Observar sin intervenir', costo_ha: 0, ipf_esperado: 0.89, band_esperado: 'WARNING' },
      { week: 3, action: 'A0_NO_TRATAR', action_name: 'No tratar', description: 'PHI activo, monitorear', costo_ha: 0, ipf_esperado: 0.87, band_esperado: 'WARNING' },
      { week: 4, action: 'A2_RECETA_ALTERNATIVA', action_name: 'Alternativa', description: 'Tratamiento económico', costo_ha: 450, ipf_esperado: 0.90, band_esperado: 'ÓPTIMO' },
    ].slice(0, weeks)
    
    return {
      section_id: sec,
      initial_state: {
        section_id: sec,
        timestamp: new Date().toISOString(),
        ipf: data.ipf,
        band: data.ipf >= 0.90 ? 'ÓPTIMO' : data.ipf >= 0.80 ? 'WARNING' : data.ipf >= 0.70 ? 'ALERTA' : 'CRÍTICO',
        trend: 'STABLE',
        trips: data.trips,
        diaforina: data.diaforina,
        arana_roja: 8.3,
        minador: 3.2,
        fen: 5,
        gdd: 682,
        pe_proyectado: 50 * data.ipf,
        pest_pressure: 0.45,
        days_since_treatment: 14,
        phi_active: false
      },
      optimal_policy: {
        policy_name: 'MDP Óptima',
        actions: mockActions,
        final_ipf: 0.90,
        final_band: 'ÓPTIMO',
        total_cost: 1300,
        delta_vep: 52000,
        roi: 3.8
      },
      comparison: {
        'mdp_optima': {
          policy_name: 'MDP Óptima',
          actions: mockActions,
          final_ipf: 0.90,
          final_band: 'ÓPTIMO',
          total_cost: 1300,
          delta_vep: 52000,
          roi: 3.8
        },
        'baseline_siempre_tratar': {
          policy_name: 'Baseline (Siempre Tratar)',
          actions: mockActions.map(a => ({ ...a, action: 'A1_RECETA_OPTIMA', action_name: 'Receta Óptima', costo_ha: 850 })),
          final_ipf: 0.92,
          final_band: 'ÓPTIMO',
          total_cost: 3400,
          delta_vep: 48000,
          roi: 1.4
        },
        'conservadora_umbral': {
          policy_name: 'Conservadora (Umbral 0.85)',
          actions: mockActions,
          final_ipf: 0.88,
          final_band: 'WARNING',
          total_cost: 850,
          delta_vep: 38000,
          roi: 4.2
        }
      },
      recommendation: '✅ La política MDP ahorra $2,100/ha vs baseline con ΔVEP similar o mejor (+$4,000). Se recomienda seguir la política óptima.',
      phd_context: {
        factor: 'IPF',
        section: sec,
        current_ipf: data.ipf,
        framework: 'Hoffman-Levin-Watson'
      }
    }
  }

  const _getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'DOWN': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('NO_TRATAR')) return <Clock className="w-4 h-4 text-gray-400" />
    if (action.includes('OPTIMA')) return <CheckCircle className="w-4 h-4 text-green-400" />
    if (action.includes('ALTERNATIVA')) return <Target className="w-4 h-4 text-yellow-400" />
    return <Activity className="w-4 h-4 text-blue-400" />
  }

  const generateTrajectoryData = () => {
    if (!policyData) return []
    
    const policies = policyData.comparison
    const data: any[] = [{ 
      week: 0, 
      fecha: 'Actual',
      mdp: policyData.initial_state.ipf,
      baseline: policyData.initial_state.ipf,
      conservadora: policyData.initial_state.ipf
    }]
    
    const mdp = policies['mdp_optima']?.actions || []
    const baseline = policies['baseline_siempre_tratar']?.actions || []
    const cons = policies['conservadora_umbral']?.actions || []
    
    for (let i = 0; i < horizon; i++) {
      data.push({
        week: i + 1,
        fecha: `Sem ${i + 1}`,
        mdp: mdp[i]?.ipf_esperado || 0.85,
        baseline: baseline[i]?.ipf_esperado || 0.90,
        conservadora: cons[i]?.ipf_esperado || 0.82
      })
    }
    
    return data
  }

  const requestPHDAnalysis = async () => {
    if (!policyData) return
    setLoadingPHD(true)
    
    try {
      const response = await fetch('/api/v1/llm/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'health_agent',
          data: {
            ...policyData.phd_context,
            section,
            horizon_weeks: horizon,
            initial_state: policyData.initial_state,
            optimal_policy: policyData.optimal_policy,
            comparison: policyData.comparison,
            recommendation: policyData.recommendation
          }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPhdAnalysis(data.interpretation || generateMockPHDAnalysis())
      } else {
        setPhdAnalysis(generateMockPHDAnalysis())
      }
    } catch {
      setPhdAnalysis(generateMockPHDAnalysis())
    } finally {
      setLoadingPHD(false)
    }
  }

  const generateMockPHDAnalysis = (): string => {
    if (!policyData) return ''
    const state = policyData.initial_state
    
    return `🧠 **Análisis Hoffman-Levin para IPF - Sección ${section}**

**Estado del Agente Consciente:**
El árbol de lima persa en ${section} presenta un IPF de ${state.ipf.toFixed(2)} (banda ${state.band}), indicando una presión fitosanitaria ${state.band === 'ÓPTIMO' ? 'controlada' : 'que requiere atención'}.

**Interpretación Markoviana:**
Desde la perspectiva del framework Hoffman-Levin, el sistema se encuentra en un estado de transición. La presión de plagas (trips: ${state.trips.toFixed(1)}, diaforina: ${state.diaforina.toFixed(1)}) genera una entropía moderada en el kernel de transiciones.

**Política Óptima MDP:**
La política ${policyData.optimal_policy.policy_name} maximiza ΔVEP mientras minimiza costos innecesarios. Las acciones recomendadas:
${policyData.optimal_policy.actions.map((a, i) => `- Semana ${i+1}: ${a.action_name} (IPF→${a.ipf_esperado.toFixed(2)})`).join('\n')}

**Coherencia del Sistema:**
Esta política reduce la entropía del sistema al guiar las transiciones hacia estados de alta PE. El ROI de ${policyData.optimal_policy.roi.toFixed(1)}x indica una eficiencia superior al baseline.

**Recomendación:**
Implementar la política MDP óptima para mantener la coherencia del agente-árbol y maximizar VEP con mínima intervención.`
  }

  useEffect(() => {
    if (policyData && !phdAnalysis) {
      requestPHDAnalysis()
    }
  }, [policyData])

  if (loading && !policyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-citrus-400 animate-spin" />
        <span className="ml-3 text-gray-400">Calculando política óptima IPF...</span>
      </div>
    )
  }

  const state = policyData?.initial_state
  const optimal = policyData?.optimal_policy
  const comparison = policyData?.comparison || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">IPF Kernel - Política Markoviana</h2>
            <p className="text-sm text-gray-400">Framework Hoffman-Levin-Watson para optimización de sanidad vegetal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="bg-industrial-dark border border-industrial-light rounded-lg px-3 py-2 text-white text-sm"
            aria-label="Seleccionar sección"
          >
            <option value="S1">Sección S1</option>
            <option value="S2">Sección S2</option>
            <option value="S3">Sección S3</option>
          </select>
          
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="bg-industrial-dark border border-industrial-light rounded-lg px-3 py-2 text-white text-sm"
            aria-label="Seleccionar horizonte"
          >
            <option value={4}>4 semanas</option>
            <option value={6}>6 semanas</option>
            <option value={8}>8 semanas</option>
          </select>
          
          <button
            onClick={fetchPolicy}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-citrus-500/20 text-citrus-400 rounded-lg hover:bg-citrus-500/30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalcular</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Estado Actual + Métricas con IndustrialGauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* IPF Industrial Gauge */}
        <IndustrialGauge
          title="IPF"
          value={state?.ipf || 0}
          meta={0.92}
          min={0}
          max={1}
          status={state?.band === 'ÓPTIMO' ? 'optimal' : state?.band === 'WARNING' ? 'warning' : 'critical'}
          impactoVEP={optimal?.delta_vep}
          trendDirection={state?.trend === 'UP' ? 'up' : state?.trend === 'DOWN' ? 'down' : 'stable'}
          source="appsheet.muestreo"
          size="md"
          colorScheme="amber"
        />

        {/* Plagas con MiniGauges */}
        <div className="bg-industrial-medium rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center space-x-2 mb-3">
            <Bug className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Presión de Plagas</span>
          </div>
          <div className="space-y-2">
            <MiniGauge title="Trips" value={state?.trips || 0} meta={20} status={state?.trips && state.trips > 30 ? 'critical' : 'optimal'} />
            <MiniGauge title="Diaforina" value={state?.diaforina || 0} meta={1.5} status={state?.diaforina && state.diaforina > 2 ? 'critical' : 'optimal'} />
          </div>
        </div>

        {/* Política Óptima Resumen */}
        <div className="bg-industrial-medium rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Política MDP</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            ROI {optimal?.roi?.toFixed(1) || 0}x
          </div>
          <div className="text-sm text-gray-400 mt-1">
            IPF final: {((optimal?.final_ipf || 0) * 100).toFixed(1)}%
          </div>
        </div>

        {/* Ahorro vs Baseline */}
        <div className="bg-industrial-medium rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Ahorro vs Baseline</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${((comparison['baseline_siempre_tratar']?.total_cost || 0) - (optimal?.total_cost || 0)).toLocaleString()}/ha
          </div>
          <div className="text-sm text-gray-400 mt-1">
            ΔVEP: +${optimal?.delta_vep?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Gráfico de Trayectoria */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-citrus-400" />
          <span>Trayectoria IPF - Comparativa de Políticas</span>
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={generateTrajectoryData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={12} />
              <YAxis domain={[0.6, 1.0]} stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v*100).toFixed(0)}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                formatter={(value: number) => [`${(value*100).toFixed(1)}%`, '']}
              />
              <Legend />
              <ReferenceLine y={0.90} stroke="#22c55e" strokeDasharray="5 5" label="Óptimo" />
              <ReferenceLine y={0.70} stroke="#ef4444" strokeDasharray="5 5" label="Crítico" />
              <Line type="monotone" dataKey="mdp" name="MDP Óptima" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7' }} />
              <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="conservadora" name="Conservadora" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline de Acciones */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-orange-400" />
          <span>Política Recomendada - Acciones por Semana</span>
        </h3>
        
        <div className="space-y-3">
          {optimal?.actions.map((action, index) => (
            <div 
              key={index}
              className={`flex items-center p-4 rounded-lg border ${
                action.action.includes('NO_TRATAR') 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : action.action.includes('OPTIMA')
                    ? 'bg-green-900/30 border-green-700/50'
                    : 'bg-yellow-900/30 border-yellow-700/50'
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-industrial-dark mr-4">
                <span className="text-lg font-bold text-citrus-400">{action.week}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getActionIcon(action.action)}
                  <span className="font-medium text-white">{action.action_name}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{action.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400">Costo: ${action.costo_ha}/ha</div>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-sm text-gray-400">IPF:</span>
                  <span className="font-medium" style={{ color: BAND_COLORS[action.band_esperado] }}>
                    {(action.ipf_esperado * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {index < (optimal?.actions.length || 0) - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-600 ml-4" />
              )}
            </div>
          ))}
        </div>

        {/* Recomendación */}
        <div className="mt-4 p-4 bg-citrus-900/30 border border-citrus-500/30 rounded-lg">
          <p className="text-citrus-400">{policyData?.recommendation}</p>
        </div>
      </div>

      {/* Comparativa de Políticas */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4">Comparativa de Políticas</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-industrial-light">
                <th className="text-left py-3 px-4 text-gray-400">Política</th>
                <th className="text-right py-3 px-4 text-gray-400">IPF Final</th>
                <th className="text-right py-3 px-4 text-gray-400">Costo Total</th>
                <th className="text-right py-3 px-4 text-gray-400">ΔVEP</th>
                <th className="text-right py-3 px-4 text-gray-400">ROI</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparison).map(([key, policy]) => (
                <tr 
                  key={key}
                  className={`border-b border-industrial-light/50 ${key === 'mdp_optima' ? 'bg-purple-900/20' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {key === 'mdp_optima' && <Brain className="w-4 h-4 text-purple-400" />}
                      <span className={key === 'mdp_optima' ? 'text-purple-400 font-medium' : 'text-gray-300'}>
                        {policy.policy_name}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span style={{ color: BAND_COLORS[policy.final_band] }}>
                      {(policy.final_ipf * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">${policy.total_cost.toLocaleString()}/ha</td>
                  <td className="text-right py-3 px-4 text-green-400">+${policy.delta_vep.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">
                    <span className={policy.roi >= 3 ? 'text-green-400' : policy.roi >= 2 ? 'text-yellow-400' : 'text-gray-400'}>
                      {policy.roi.toFixed(1)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integración Bidireccional con Programa 2026 */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center space-x-2">
          <ArrowLeftRight className="w-5 h-5" />
          <span>Integración IPF Kernel ↔ Programa 2026</span>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full ml-2">
            BIDIRECCIONAL
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Próxima Aplicación Programada */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400 uppercase">Próxima Aplicación</span>
            </div>
            <div className="text-xl font-bold text-white mb-1">Semana 2</div>
            <div className="text-sm text-gray-400">Spinosad 4L</div>
            <div className="text-xs text-blue-400 mt-2">Costo: $11,408/ha</div>
          </div>

          {/* IPF Esperado Post-Aplicación */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 uppercase">IPF Post-Aplicación</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-green-400">93%</span>
              <span className="text-sm text-gray-500">esperado</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Actual: {state ? `${(state.ipf * 100).toFixed(0)}%` : '--'}
            </div>
            <div className="text-xs text-green-400 mt-1">
              Δ esperado: +{state ? `${((0.93 - state.ipf) * 100).toFixed(0)}%` : '--'}
            </div>
          </div>

          {/* Feedback Loop */}
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 uppercase">Feedback Loop</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Última aplicación:</span>
                <span className="text-gray-300">Semana -1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IPF esperado:</span>
                <span className="text-amber-400">91%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IPF real:</span>
                <span className="text-green-400">{state ? `${(state.ipf * 100).toFixed(0)}%` : '--'}</span>
              </div>
              <div className="flex justify-between border-t border-amber-800 pt-1">
                <span className="text-gray-500">Ajuste modelo:</span>
                <span className="text-amber-300">+2% efectividad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flujo de datos */}
        <div className="mt-4 p-3 bg-industrial-dark/50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400">IPF Kernel detecta presión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Valida vs Programa 2026</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Ejecuta aplicación</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-gray-400">Feedback → Ajusta modelo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel PhD con LLM */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-citrus-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-citrus-400 flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>🎓 Análisis PhD - Framework Hoffman-Levin</span>
          </h3>
          <button
            onClick={requestPHDAnalysis}
            disabled={loadingPHD}
            className="text-sm bg-citrus-500/20 text-citrus-400 hover:bg-citrus-500/30 px-3 py-1.5 rounded-full flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingPHD ? 'animate-spin' : ''}`} />
            <span>Regenerar</span>
          </button>
        </div>

        {loadingPHD ? (
          <div className="flex items-center space-x-4 p-6 bg-industrial-dark/50 rounded-xl">
            <RefreshCw className="w-6 h-6 text-citrus-400 animate-spin" />
            <div>
              <p className="text-citrus-400 font-medium">Generando análisis PhD...</p>
              <p className="text-sm text-gray-500">Consultando modelo de IA especializado en agronomía consciente</p>
            </div>
          </div>
        ) : phdAnalysis ? (
          <div className="bg-gradient-to-r from-citrus-900/30 to-industrial-dark rounded-xl p-6 border border-citrus-500/20">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {phdAnalysis}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-industrial-dark/50 rounded-xl text-center">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Haz clic en "Regenerar" para obtener análisis PhD</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default IPFKernelPanel
