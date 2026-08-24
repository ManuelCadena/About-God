import { Network, Zap, Link2, Activity, Brain } from 'lucide-react'
import { useState, useEffect } from 'react'

interface KernelNode {
  id: string
  name: string
  symbol: string
  value: number
  band: string
  connections: string[]
  influence_score: number
}

interface NetworkData {
  nodes: KernelNode[]
  global_coherence: number
  active_flows: { from: string; to: string; strength: number; type: string }[]
  bottlenecks: { kernel: string; issue: string; impact: number }[]
}

export function FarmNetworkPanel() {
  const [data, setData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setData({
        nodes: [
          { id: 'IPF', name: 'Sanidad Vegetal', symbol: '🛡️', value: 0.86, band: 'WARNING', connections: ['IAH', 'NPF', 'TRIM'], influence_score: 0.92 },
          { id: 'IAH', name: 'Balance Hídrico', symbol: '💧', value: 0.91, band: 'ÓPTIMO', connections: ['IPF', 'NPF', 'Psi'], influence_score: 0.88 },
          { id: 'NPF', name: 'Nutrición', symbol: '🌿', value: 0.88, band: 'ADECUADO', connections: ['IPF', 'IAH', 'LAI'], influence_score: 0.85 },
          { id: 'Psi', name: 'Solar-Térmico', symbol: '☀️', value: 0.92, band: 'ÓPTIMO', connections: ['IAH', 'Phi', 'IND'], influence_score: 0.78 },
          { id: 'Phi', name: 'Fenología', symbol: '🌸', value: 0.90, band: 'ÓPTIMO', connections: ['Psi', 'IND', 'Market'], influence_score: 0.82 },
          { id: 'TRIM', name: 'Poda', symbol: '✂️', value: 0.80, band: 'ADECUADO', connections: ['IPF', 'LAI'], influence_score: 0.70 },
          { id: 'IND', name: 'Inducción', symbol: '🌱', value: 0.75, band: 'ADECUADO', connections: ['Psi', 'Phi'], influence_score: 0.72 },
          { id: 'LAI', name: 'Área Foliar', symbol: '🍃', value: 0.85, band: 'ADECUADO', connections: ['NPF', 'TRIM', 'Psi'], influence_score: 0.75 },
          { id: 'Market', name: 'Mercado', symbol: '📈', value: 0.72, band: 'NORMAL', connections: ['Phi'], influence_score: 0.65 },
        ],
        global_coherence: 0.847,
        active_flows: [
          { from: 'IAH', to: 'IPF', strength: 0.85, type: 'SYNERGY' },
          { from: 'IAH', to: 'NPF', strength: 0.78, type: 'SYNERGY' },
          { from: 'NPF', to: 'LAI', strength: 0.82, type: 'CAUSAL' },
          { from: 'Psi', to: 'Phi', strength: 0.90, type: 'CAUSAL' },
          { from: 'Phi', to: 'Market', strength: 0.75, type: 'TEMPORAL' },
          { from: 'TRIM', to: 'IPF', strength: 0.65, type: 'INDIRECT' },
        ],
        bottlenecks: [
          { kernel: 'IPF', issue: 'Presión HLB S3 limitando PE', impact: -3.2 },
          { kernel: 'Market', issue: 'Precio bajo fuera de ventana pico', impact: -15.0 },
        ]
      })
      setLoading(false)
    }, 500)
  }, [])

  const getBandColor = (band: string) => {
    switch (band) {
      case 'ÓPTIMO': return 'border-green-500 bg-green-500/20'
      case 'ADECUADO': return 'border-blue-500 bg-blue-500/20'
      case 'WARNING': return 'border-yellow-500 bg-yellow-500/20'
      case 'NORMAL': return 'border-gray-500 bg-gray-500/20'
      default: return 'border-red-500 bg-red-500/20'
    }
  }

  const getFlowColor = (type: string) => {
    switch (type) {
      case 'SYNERGY': return 'text-green-400'
      case 'CAUSAL': return 'text-blue-400'
      case 'TEMPORAL': return 'text-purple-400'
      case 'INDIRECT': return 'text-gray-400'
      default: return 'text-white'
    }
  }

  // getKernelIcon disponible para uso futuro
  // IPF: Bug, IAH: Droplets, NPF: Leaf, LAI: TreeDeciduous

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  const selectedNodeData = selectedNode ? data?.nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl p-6 border border-teal-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-8 h-8 text-teal-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Farm Network</h2>
            <p className="text-gray-400">Hoffman-Levin Framework - Red de Interconexiones MDP</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-industrial-dark rounded-lg p-4 border border-teal-500/30">
            <p className="text-sm text-gray-400">Coherencia Global</p>
            <p className="text-3xl font-bold text-teal-400">
              {((data?.global_coherence || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Σ(wi × Ki)</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Nodos Activos</p>
            <p className="text-3xl font-bold text-blue-400">{data?.nodes.length}</p>
            <p className="text-xs text-gray-500">Kernels MDP</p>
          </div>
          <div className="bg-industrial-dark rounded-lg p-4 border border-industrial-light">
            <p className="text-sm text-gray-400">Flujos Activos</p>
            <p className="text-3xl font-bold text-purple-400">{data?.active_flows.length}</p>
            <p className="text-xs text-gray-500">Interconexiones</p>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="grid grid-cols-3 gap-6">
        {/* Nodes Grid */}
        <div className="col-span-2 bg-industrial-medium rounded-xl p-6 border border-industrial-light">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Nodos del Sistema (Click para detalles)
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {data?.nodes.map((node) => (
              <div 
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${getBandColor(node.band)} ${
                  selectedNode === node.id ? 'ring-2 ring-teal-400 scale-105' : 'hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{node.symbol}</span>
                  <div>
                    <p className="font-semibold text-white">{node.id}</p>
                    <p className="text-xs text-gray-400">{node.name}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-white">{(node.value * 100).toFixed(0)}%</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    node.band === 'ÓPTIMO' ? 'bg-green-500/30 text-green-400' :
                    node.band === 'ADECUADO' ? 'bg-blue-500/30 text-blue-400' :
                    node.band === 'WARNING' ? 'bg-yellow-500/30 text-yellow-400' :
                    'bg-gray-500/30 text-gray-400'
                  }`}>
                    {node.band}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Influencia: {(node.influence_score * 100).toFixed(0)}% | {node.connections.length} conexiones
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Node Details / Flows */}
        <div className="bg-industrial-medium rounded-xl p-6 border border-industrial-light">
          {selectedNodeData ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">
                Detalle: {selectedNodeData.symbol} {selectedNodeData.id}
              </h3>
              <div className="space-y-4">
                <div className="bg-industrial-dark rounded-lg p-3">
                  <p className="text-sm text-gray-400">Valor Actual</p>
                  <p className="text-2xl font-bold text-white">{(selectedNodeData.value * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-industrial-dark rounded-lg p-3">
                  <p className="text-sm text-gray-400">Influencia en Red</p>
                  <p className="text-xl font-bold text-teal-400">{(selectedNodeData.influence_score * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-industrial-dark rounded-lg p-3">
                  <p className="text-sm text-gray-400 mb-2">Conexiones</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeData.connections.map((c) => (
                      <span key={c} className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-sm">
                        → {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-purple-400" />
                Flujos Activos
              </h3>
              <div className="space-y-2">
                {data?.active_flows.map((flow, idx) => (
                  <div key={idx} className="bg-industrial-dark rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{flow.from}</span>
                      <span className={getFlowColor(flow.type)}>→</span>
                      <span className="text-white font-mono">{flow.to}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{(flow.strength * 100).toFixed(0)}%</p>
                      <p className={`text-xs ${getFlowColor(flow.type)}`}>{flow.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottlenecks */}
      {data?.bottlenecks && data.bottlenecks.length > 0 && (
        <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Cuellos de Botella Detectados
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.bottlenecks.map((b, idx) => (
              <div key={idx} className="bg-industrial-dark rounded-lg p-4 border border-red-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">{b.kernel}</span>
                    <p className="text-white mt-2">{b.issue}</p>
                  </div>
                  <p className="text-red-400 font-bold">{b.impact}% PE</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PhD Interpretation */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Interpretación PhD - Farm Network Analysis
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            <strong className="text-teal-400">Coherencia de Red:</strong> El sistema muestra una coherencia
            global del {((data?.global_coherence || 0) * 100).toFixed(1)}%, indicando buena sincronización
            entre kernels MDP.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-green-400">Flujos Sinérgicos:</strong> IAH→IPF (85%) e IAH→NPF (78%)
            muestran alta sinergia. El riego adecuado mejora tanto sanidad como absorción de nutrientes.
          </p>
          <p className="text-gray-300 mt-3">
            <strong className="text-purple-400">Cadena Causal Principal:</strong> Psi→Phi→Market representa
            la secuencia térmica→fenología→cosecha. Optimizar esta cadena maximiza captura de ventana de precios.
          </p>
        </div>
      </div>
    </div>
  )
}
