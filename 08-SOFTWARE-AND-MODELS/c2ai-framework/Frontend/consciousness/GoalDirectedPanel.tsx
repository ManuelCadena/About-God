import { Target, CheckCircle, Clock, BarChart3, Zap, TrendingUp, Calendar, Brain } from 'lucide-react'
import { useState, useEffect } from 'react'
import { TripleVEPBar } from '../economy/TripleVEPBar'

interface Goal {
  id: string
  name: string
  target_value: number
  current_value: number
  unit: string
  deadline: string
  progress: number
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED'
  actions_pending: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface GoalData {
  primary_goal: Goal
  secondary_goals: Goal[]
  weekly_milestones: { week: number; target: string; status: string }[]
  recommended_actions: { kernel: string; action: string; impact: number; deadline: string }[]
}

export function GoalDirectedPanel() {
  const [data, setData] = useState<GoalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setData({
        primary_goal: {
          id: 'VEP-2026',
          name: 'Meta VEP 2026',
          target_value: 4200000,
          current_value: 3150000,
          unit: 'USD',
          deadline: '2026-12-31',
          progress: 75,
          status: 'ON_TRACK',
          actions_pending: 12,
          priority: 'HIGH'
        },
        secondary_goals: [
          {
            id: 'IPF-OPT',
            name: 'IPF ≥ 0.90 todas secciones',
            target_value: 0.90,
            current_value: 0.86,
            unit: 'índice',
            deadline: '2025-03-31',
            progress: 95,
            status: 'AT_RISK',
            actions_pending: 3,
            priority: 'HIGH'
          },
            {
              id: 'IAH-OPT',
              name: 'IAH ≥ 0.90 todas secciones',
              target_value: 0.90,
              current_value: 0.92,
              unit: 'índice',
              deadline: '2025-12-31',
              progress: 102,
              status: 'ACHIEVED',
              actions_pending: 0,
              priority: 'MEDIUM'
            },
            {
              id: 'HLB-CTRL',
              name: 'HLB < 0.5% todas secciones',
              target_value: 0.5,
              current_value: 0.45,
              unit: '%',
              deadline: '2025-12-31',
              progress: 90,
              status: 'ON_TRACK',
              actions_pending: 2,
              priority: 'HIGH'
            }
          ],
          weekly_milestones: [
            { week: 1, target: 'Completar tratamiento IPF S3', status: 'DONE' },
            { week: 2, target: 'Ajustar riego S1/S2 a balance óptimo', status: 'IN_PROGRESS' },
            { week: 3, target: 'Implementar control jornales', status: 'PENDING' },
            { week: 4, target: 'Fertilización foliar NPF programada', status: 'PENDING' },
          ],
          recommended_actions: [
            { kernel: 'IPF', action: 'Tratamiento biológico S3', impact: 45000, deadline: '2025-01-05' },
            { kernel: 'IAH', action: 'Ajuste riego déficit', impact: 28000, deadline: '2025-01-03' },
            { kernel: 'Market', action: 'Preparar cosecha ventana pico', impact: 180000, deadline: '2025-02-15' },
            { kernel: 'Workforce', action: 'Optimizar rutas cosecha', impact: 95000, deadline: '2025-01-31' },
          ]
        })
      setLoading(false)
    }, 500)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
      case 'ACHIEVED':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'AT_RISK':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'BEHIND':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
      case 'ACHIEVED':
        return <CheckCircle className="w-4 h-4" />
      case 'AT_RISK':
        return <Clock className="w-4 h-4" />
      case 'BEHIND':
        return <Target className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - Primary Goal */}
      <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 rounded-xl p-6 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Goal-Directed Engine</h2>
            <p className="text-gray-400">Hoffman-Levin Framework - Optimización hacia Objetivos</p>
          </div>
        </div>

        {/* Meta Principal */}
        <div className="bg-industrial-dark rounded-xl p-6 border border-orange-500/50 mt-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{data?.primary_goal.name}</h3>
              <p className="text-gray-400">Meta principal del sistema MDP</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data?.primary_goal.status || '')}`}>
              {getStatusIcon(data?.primary_goal.status || '')}
              <span className="ml-1">{data?.primary_goal.status?.replace('_', ' ')}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">
                ${((data?.primary_goal.current_value || 0) / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-gray-400">Valor Actual</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                ${((data?.primary_goal.target_value || 0) / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-gray-400">Meta</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {data?.primary_goal.progress}%
              </p>
              <p className="text-sm text-gray-400">Progreso</p>
            </div>
          </div>

          <div className="w-full bg-industrial-light rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-gradient-to-r from-orange-500 to-green-500"
              style={{ width: `${data?.primary_goal.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">
            Deadline: {data?.primary_goal.deadline} | {data?.primary_goal.actions_pending} acciones pendientes
          </p>
        </div>
      </div>

      {/* Secondary Goals */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          Objetivos Secundarios
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {data?.secondary_goals.map((goal) => (
            <div key={goal.id} className={`rounded-lg p-4 border ${getStatusColor(goal.status)}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{goal.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  goal.priority === 'HIGH' ? 'bg-red-500/30 text-red-400' :
                  goal.priority === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-400' :
                  'bg-blue-500/30 text-blue-400'
                }`}>
                  {goal.priority}
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Actual: {goal.current_value} {goal.unit}</span>
                <span className="text-gray-400">Meta: {goal.target_value} {goal.unit}</span>
              </div>

              <div className="w-full bg-industrial-dark rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    goal.status === 'ON_TRACK' ? 'bg-green-500' :
                    goal.status === 'AT_RISK' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{goal.progress}% completado</span>
                <span>{goal.actions_pending} acciones</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Milestones & Recommended Actions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Milestones */}
        <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Hitos Semanales
          </h3>
          <div className="space-y-3">
            {data?.weekly_milestones.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  m.status === 'DONE' ? 'bg-green-500/20 text-green-400' :
                  m.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {m.status === 'DONE' ? <CheckCircle className="w-4 h-4" /> : m.week}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${m.status === 'DONE' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {m.target}
                  </p>
                  <p className="text-xs text-gray-500">Semana {m.week}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Acciones Recomendadas MDP
          </h3>
          <div className="space-y-3">
            {data?.recommended_actions.map((a, idx) => (
              <div key={idx} className="bg-industrial-dark rounded-lg p-3 border border-industrial-light">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
                      {a.kernel}
                    </span>
                    <p className="text-sm text-white mt-1">{a.action}</p>
                  </div>
                  <p className="text-green-400 font-semibold text-sm">
                    +${(a.impact / 1000).toFixed(0)}K
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Deadline: {a.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Triple VEP Bar */}
      <TripleVEPBar data={null} />

      {/* Desglose Meta VEP por Factor PE */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-citrus-500/30">
        <h3 className="text-lg font-semibold text-citrus-400 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Desglose Meta VEP por Factor PE
          <span className="text-xs bg-citrus-500/20 text-citrus-300 px-2 py-0.5 rounded-full ml-2">
            10 FACTORES
          </span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { factor: 'IPF', contribucion: 15, estado: 'AT_RISK', impacto: '+$180K' },
            { factor: 'NPF', contribucion: 12, estado: 'ON_TRACK', impacto: '+$144K' },
            { factor: 'φ (PHI)', contribucion: 8, estado: 'ON_TRACK', impacto: '+$96K' },
            { factor: 'IAH', contribucion: 10, estado: 'WARNING', impacto: '+$120K' },
            { factor: 'ψ (PSI)', contribucion: 5, estado: 'ON_TRACK', impacto: '+$60K' },
            { factor: 'TRIM', contribucion: 8, estado: 'ON_TRACK', impacto: '+$96K' },
            { factor: 'IND', contribucion: 6, estado: 'ON_TRACK', impacto: '+$72K' },
            { factor: 'LAI', contribucion: 7, estado: 'WARNING', impacto: '+$84K' },
            { factor: 'COBB', contribucion: 14, estado: 'ON_TRACK', impacto: '+$168K' },
            { factor: 'Ĥ', contribucion: 15, estado: 'BASELINE', impacto: 'Base' },
          ].map((f) => (
            <div 
              key={f.factor}
              className={`rounded-lg p-3 border ${
                f.estado === 'AT_RISK' ? 'bg-red-900/20 border-red-500/30' :
                f.estado === 'WARNING' ? 'bg-yellow-900/20 border-yellow-500/30' :
                f.estado === 'BASELINE' ? 'bg-gray-800/50 border-gray-600' :
                'bg-green-900/20 border-green-500/30'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-white">{f.factor}</span>
                <span className={`text-xs ${
                  f.estado === 'AT_RISK' ? 'text-red-400' :
                  f.estado === 'WARNING' ? 'text-yellow-400' :
                  f.estado === 'BASELINE' ? 'text-gray-400' :
                  'text-green-400'
                }`}>{f.contribucion}%</span>
              </div>
              <div className="w-full bg-industrial-dark rounded-full h-1.5 mb-1">
                <div 
                  className={`h-1.5 rounded-full ${
                    f.estado === 'AT_RISK' ? 'bg-red-500' :
                    f.estado === 'WARNING' ? 'bg-yellow-500' :
                    f.estado === 'BASELINE' ? 'bg-gray-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${f.contribucion * 6}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400">{f.impacto}</div>
            </div>
          ))}
        </div>

        <div className="bg-industrial-dark/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-400">Total Contribución Factores PE → Meta VEP</span>
              <p className="text-xs text-gray-500 mt-1">
                PE = Ĥ × COBB × IAH × IPF × NPF × ψ × φ × TRIM × IND × LAI
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-citrus-400">+$1.02M USD</div>
              <div className="text-xs text-gray-500">Potencial de mejora via factores</div>
            </div>
          </div>
        </div>
      </div>

      {/* PhD Interpretation */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Interpretación PhD - Goal-Directed Planning
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            <strong className="text-orange-400">Estado General:</strong> El sistema está{' '}
            <span className="text-green-400">ON TRACK</span> para alcanzar la meta VEP 2026 de $4.2M USD
            con un progreso actual del {data?.primary_goal.progress}%.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-yellow-400">Riesgo Identificado:</strong> El objetivo "IPF ≥ 0.90"
            está AT_RISK debido a incremento de presión fitosanitaria en S3 (HLB +168%). Se recomienda
            priorizar tratamiento biológico esta semana.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-red-400">Acción Urgente:</strong> El objetivo de reducción de costos
            MO está BEHIND (40% de progreso). Implementar control de jornales y optimización de rutas
            es crítico para recuperar $2.3M MXN anuales.
          </p>
        </div>
      </div>
    </div>
  )
}
