import { Activity, AlertTriangle, Brain, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EntropyMetrics {
  global_entropy: number
  kernel_entropies: { kernel: string; entropy: number; trend: string }[]
  anomalies: { section: string; type: string; severity: string; description: string }[]
  predictability_score: number
}

export function EntropyPanel() {
  const [metrics, setMetrics] = useState<EntropyMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSection, _setSelectedSection] = useState('S1')

  useEffect(() => {
    // Simular carga de datos de entropía
    setTimeout(() => {
      setMetrics({
        global_entropy: 0.23,
        kernel_entropies: [
          { kernel: 'IPF', entropy: 0.18, trend: 'STABLE' },
          { kernel: 'IAH', entropy: 0.31, trend: 'UP' },
          { kernel: 'NPF', entropy: 0.15, trend: 'DOWN' },
          { kernel: 'Psi', entropy: 0.22, trend: 'STABLE' },
          { kernel: 'Phi', entropy: 0.12, trend: 'STABLE' },
          { kernel: 'TRIM', entropy: 0.28, trend: 'UP' },
          { kernel: 'IND', entropy: 0.19, trend: 'STABLE' },
          { kernel: 'LAI', entropy: 0.21, trend: 'STABLE' },
          { kernel: 'Market', entropy: 0.45, trend: 'UP' },
        ],
        anomalies: [
          { section: 'S3', type: 'HLB Spike', severity: 'HIGH', description: 'Incremento 168% en detección HLB' },
          { section: 'S1', type: 'IPF Drop', severity: 'MEDIUM', description: 'IPF cayó de 0.90 a 0.82 en 7 días' },
        ],
        predictability_score: 0.77
      })
      setLoading(false)
    }, 500)
  }, [selectedSection])

  const getEntropyColor = (entropy: number) => {
    if (entropy < 0.2) return 'text-green-400'
    if (entropy < 0.35) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getEntropyBg = (entropy: number) => {
    if (entropy < 0.2) return 'bg-green-500/20 border-green-500/30'
    if (entropy < 0.35) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Entropy Analysis</h2>
            <p className="text-gray-400">Hoffman-Levin Framework - Medición de Incertidumbre del Sistema</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className={`rounded-lg p-4 border ${getEntropyBg(metrics?.global_entropy || 0)}`}>
            <p className="text-sm text-gray-400">Entropía Global</p>
            <p className={`text-3xl font-bold ${getEntropyColor(metrics?.global_entropy || 0)}`}>
              {((metrics?.global_entropy || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Shannon Entropy Index</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Predictibilidad</p>
            <p className="text-3xl font-bold text-blue-400">
              {((metrics?.predictability_score || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Confianza en pronósticos</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Anomalías Detectadas</p>
            <p className="text-3xl font-bold text-orange-400">
              {metrics?.anomalies.length || 0}
            </p>
            <p className="text-xs text-gray-500">Últimas 24 horas</p>
          </div>
        </div>
      </div>

      {/* Entropy por Kernel */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Entropía por Kernel MDP
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {metrics?.kernel_entropies.map((k) => (
            <div key={k.kernel} className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">{k.kernel}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  k.trend === 'UP' ? 'bg-red-500/20 text-red-400' :
                  k.trend === 'DOWN' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {k.trend === 'UP' ? '↑' : k.trend === 'DOWN' ? '↓' : '→'} {k.trend}
                </span>
              </div>
              <div className="w-full bg-industrial-light rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    k.entropy < 0.2 ? 'bg-green-500' :
                    k.entropy < 0.35 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${k.entropy * 100}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${getEntropyColor(k.entropy)}`}>
                {(k.entropy * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalías */}
      <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Anomalías Detectadas
        </h3>
        
        {metrics?.anomalies.length === 0 ? (
          <p className="text-gray-400">No hay anomalías detectadas en las últimas 24 horas.</p>
        ) : (
          <div className="space-y-3">
            {metrics?.anomalies.map((a, idx) => (
              <div key={idx} className={`rounded-lg p-4 border ${
                a.severity === 'HIGH' ? 'bg-red-900/20 border-red-500/30' :
                a.severity === 'MEDIUM' ? 'bg-yellow-900/20 border-yellow-500/30' :
                'bg-blue-900/20 border-blue-500/30'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{a.type}</p>
                    <p className="text-sm text-gray-400">{a.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      a.severity === 'HIGH' ? 'bg-red-500/30 text-red-400' :
                      a.severity === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-400' :
                      'bg-blue-500/30 text-blue-400'
                    }`}>
                      {a.severity}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Sección {a.section}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interpretación PhD */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Interpretación PhD - Entropy Analysis
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            <strong className="text-blue-400">Análisis de Entropía Hoffman-Levin:</strong> El sistema muestra una entropía global de{' '}
            <span className={getEntropyColor(metrics?.global_entropy || 0)}>
              {((metrics?.global_entropy || 0) * 100).toFixed(1)}%
            </span>, indicando un nivel de incertidumbre {
              (metrics?.global_entropy || 0) < 0.2 ? 'bajo y controlado' :
              (metrics?.global_entropy || 0) < 0.35 ? 'moderado que requiere monitoreo' :
              'elevado que requiere intervención'
            }.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-purple-400">Kernels con Mayor Incertidumbre:</strong> Market Kernel (45%) presenta la mayor
            entropía debido a volatilidad de precios externa. IAH Kernel (31%) muestra incremento por variabilidad climática
            estacional.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-green-400">Recomendación:</strong> Mantener horizonte de planificación MDP en 4-6 semanas
            para kernels de alta entropía. Priorizar acciones en kernels estables (Phi, NPF, IPF) para maximizar ROI.
          </p>
        </div>
      </div>
    </div>
  )
}
