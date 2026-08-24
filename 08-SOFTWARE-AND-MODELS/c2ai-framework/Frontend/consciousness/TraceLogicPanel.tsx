import { GitBranch, Clock, CheckCircle, ArrowRight, Brain } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TraceStep {
  step: number
  kernel: string
  action: string
  state_before: string
  state_after: string
  reward: number
  timestamp: string
  compatibility_notes: string[]
}

interface TraceData {
  trace_id: string
  section: string
  start_time: string
  end_time: string
  total_reward: number
  steps: TraceStep[]
  conflicts_resolved: number
  policy_type: string
}

export function TraceLogicPanel() {
  const [trace, setTrace] = useState<TraceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState('S1')

  useEffect(() => {
    setTimeout(() => {
      setTrace({
        trace_id: 'TRC-20251230-S1-001',
        section: selectedSection,
        start_time: '2025-12-30T08:00:00',
        end_time: '2025-12-30T08:15:23',
        total_reward: 45200,
        conflicts_resolved: 2,
        policy_type: 'MDP_OPTIMAL',
        steps: [
          {
            step: 1,
            kernel: 'IPF',
            action: 'A2_TRATAMIENTO_BIOLOGICO',
            state_before: 'IPF=0.82, Band=WARNING',
            state_after: 'IPF=0.89, Band=ADECUADO',
            reward: 18500,
            timestamp: '2025-12-30T08:01:12',
            compatibility_notes: ['Compatible con IAH (riego ok)', 'Esperar 48h para NPF foliar']
          },
          {
            step: 2,
            kernel: 'IAH',
            action: 'A1_RIEGO_DEFICIT_LIGERO',
            state_before: 'IAH=0.78, Déficit=15mm',
            state_after: 'IAH=0.91, Déficit=0mm',
            reward: 12300,
            timestamp: '2025-12-30T08:05:45',
            compatibility_notes: ['Sin conflicto con IPF', 'Mejora absorción NPF']
          },
          {
            step: 3,
            kernel: 'NPF',
            action: 'A0_MONITOREAR',
            state_before: 'NPF=0.88, N=2.8%',
            state_after: 'NPF=0.88, N=2.8%',
            reward: 0,
            timestamp: '2025-12-30T08:08:30',
            compatibility_notes: ['Niveles óptimos', 'No requiere acción']
          },
          {
            step: 4,
            kernel: 'Market',
            action: 'A0_ESPERAR',
            state_before: 'Precio=$18/kg',
            state_after: 'Precio=$18/kg',
            reward: 0,
            timestamp: '2025-12-30T08:12:00',
            compatibility_notes: ['Esperar ventana pico Enero-Marzo', 'Precio actual bajo']
          },
          {
            step: 5,
            kernel: 'Coherence',
            action: 'RESOLVE_CONFLICT',
            state_before: '2 conflictos activos',
            state_after: '0 conflictos',
            reward: 14400,
            timestamp: '2025-12-30T08:15:23',
            compatibility_notes: ['IPF-IAH sincronizado', 'NPF en espera óptimo']
          }
        ]
      })
      setLoading(false)
    }, 500)
  }, [selectedSection])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Trace Logic</h2>
              <p className="text-gray-400">Hoffman-Levin Framework - Rastreo de Decisiones MDP</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['S1', 'S2', 'S3'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSection === sec
                    ? 'bg-cyan-500 text-white'
                    : 'bg-industrial-dark text-gray-400 hover:bg-industrial-light'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Trace ID</p>
            <p className="text-lg font-mono text-cyan-400">{trace?.trace_id}</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Recompensa Total</p>
            <p className="text-2xl font-bold text-green-400">
              ${(trace?.total_reward || 0).toLocaleString()} MXN
            </p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Conflictos Resueltos</p>
            <p className="text-2xl font-bold text-purple-400">{trace?.conflicts_resolved}</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Tipo Política</p>
            <p className="text-lg font-semibold text-blue-400">{trace?.policy_type}</p>
          </div>
        </div>
      </div>

      {/* Timeline de Steps */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Trace Timeline - Secuencia de Decisiones
        </h3>

        <div className="space-y-4">
          {trace?.steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Línea conectora */}
              {idx < (trace?.steps.length || 0) - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-16 bg-cyan-500/30"></div>
              )}
              
              <div className="flex gap-4">
                {/* Step number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  step.reward > 0 ? 'bg-green-500/20 border-2 border-green-500' :
                  'bg-gray-500/20 border-2 border-gray-500'
                }`}>
                  <span className="text-lg font-bold text-white">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-industrial-dark rounded-lg p-4 border border-industrial-light">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-medium">
                        {step.kernel}
                      </span>
                      <span className="ml-2 text-white font-semibold">{step.action}</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${step.reward > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        {step.reward > 0 ? `+$${step.reward.toLocaleString()}` : 'Sin costo'}
                      </p>
                      <p className="text-xs text-gray-500">{step.timestamp.split('T')[1]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-gray-400">{step.state_before}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    <span className="text-green-400">{step.state_after}</span>
                  </div>

                  {step.compatibility_notes.length > 0 && (
                    <div className="bg-industrial-medium rounded p-2">
                      <p className="text-xs text-gray-500 mb-1">Notas de Compatibilidad:</p>
                      {step.compatibility_notes.map((note, nIdx) => (
                        <p key={nIdx} className="text-xs text-gray-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {note}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretación PhD */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Interpretación PhD - Trace Logic
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            <strong className="text-cyan-400">Análisis de Trazabilidad:</strong> El trace {trace?.trace_id} muestra
            una secuencia óptima de 5 decisiones MDP que generaron una recompensa total de{' '}
            <span className="text-green-400">${(trace?.total_reward || 0).toLocaleString()} MXN</span>.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-purple-400">Resolución de Conflictos:</strong> Se detectaron y resolvieron{' '}
            {trace?.conflicts_resolved} conflictos entre kernels. La coordinación IPF-IAH fue exitosa,
            permitiendo tratamiento biológico seguido de riego sin interferencia.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-green-400">Decisión Clave:</strong> El kernel NPF tomó la decisión óptima
            de "Monitorear" dado que los niveles de N (2.8%) están en rango óptimo. Esto evitó un gasto
            innecesario de ~$12,000 MXN en fertilización foliar.
          </p>
        </div>
      </div>
    </div>
  )
}
