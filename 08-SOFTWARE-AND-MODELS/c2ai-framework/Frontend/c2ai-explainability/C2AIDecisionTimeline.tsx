import React, { useState, useEffect } from 'react'
import { Clock, Calendar, Target, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Brain, Zap } from 'lucide-react'
import { api } from '../../services/api'

interface DecisionEvent {
  id: string
  timestamp: string
  type: 'decision' | 'action' | 'result' | 'alert'
  category: 'vep' | 'pe' | 'weather' | 'health' | 'nutrition' | 'harvest'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  aiRecommendation?: string
  confidence?: number
  expectedOutcome?: string
  actualOutcome?: string
}

interface DecisionTimelineProps {
  selectedSection: string
}

export function C2AIDecisionTimeline({ selectedSection }: DecisionTimelineProps) {
  const [events, setEvents] = useState<DecisionEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadDecisionTimeline()
  }, [selectedSection, timeRange, filter])

  const loadDecisionTimeline = async () => {
    try {
      setLoading(true)
      
      // Fetch from C²AI API - Motor Unificado
      const response = await fetch(`/c2ai-api/api/v1/decisions/timeline/${selectedSection}?days=${timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.status === 'success' && result.data?.timeline) {
          // Map API response to DecisionEvent format
          const apiEvents: DecisionEvent[] = result.data.timeline.map((item: any, index: number) => ({
            id: item.id?.toString() || `event-${index}`,
            timestamp: item.timestamp || new Date().toISOString(),
            type: item.type || 'decision',
            category: item.agent?.toLowerCase().includes('health') ? 'health' 
                    : item.agent?.toLowerCase().includes('irrigation') ? 'weather'
                    : item.agent?.toLowerCase().includes('nutrition') ? 'nutrition'
                    : item.agent?.toLowerCase().includes('harvest') ? 'harvest'
                    : 'vep',
            title: item.title || 'Evento C²AI',
            description: item.description || '',
            impact: item.confidence > 0.9 ? 'high' : item.confidence > 0.7 ? 'medium' : 'low',
            status: item.status || 'pending',
            aiRecommendation: item.recommendation,
            confidence: Math.round((item.confidence || 0.85) * 100),
            expectedOutcome: item.expected_outcome,
            actualOutcome: item.actual_outcome
          }))
          setEvents(apiEvents)
          setError(null)
          return
        }
      }
      
      // Fallback: Generate events from decisions/pending and vep/ejecutivo
      const [pendingRes, vepRes] = await Promise.all([
        fetch('/c2ai-api/api/v1/decisions/pending'),
        fetch('/c2ai-api/api/v1/vep/ejecutivo')
      ])
      
      const fallbackEvents: DecisionEvent[] = []
      
      if (pendingRes.ok) {
        const pending = await pendingRes.json()
        if (pending.data?.decisions) {
          pending.data.decisions.forEach((d: any, i: number) => {
            fallbackEvents.push({
              id: `pending-${i}`,
              timestamp: new Date(Date.now() - i * 3600000).toISOString(),
              type: d.status === 'ready' ? 'decision' : 'alert',
              category: d.agent?.toLowerCase() === 'health' ? 'health' 
                      : d.agent?.toLowerCase() === 'irrigation' ? 'weather'
                      : d.agent?.toLowerCase() === 'nutrition' ? 'nutrition' : 'vep',
              title: d.decision,
              description: `Sección: ${d.section} | Agente: ${d.agent}`,
              impact: d.readiness > 0.9 ? 'high' : 'medium',
              status: d.status === 'ready' ? 'pending' : 'in-progress',
              aiRecommendation: `Impacto estimado: ${d.impact}`,
              confidence: Math.round(d.readiness * 100)
            })
          })
        }
      }
      
      if (vepRes.ok) {
        const vep = await vepRes.json()
        if (vep.data) {
          fallbackEvents.push({
            id: 'vep-update',
            timestamp: vep.data.ultima_actualizacion || new Date().toISOString(),
            type: 'result',
            category: 'vep',
            title: `VEP: $${(vep.data.vep_actual / 1000000).toFixed(2)}M`,
            description: `PE: ${vep.data.pe_actual}% | IPF: ${vep.data.ipf} | IAH: ${vep.data.iah} | NPF: ${vep.data.npf}`,
            impact: 'high',
            status: 'completed',
            expectedOutcome: `Meta VEP: $${(vep.data.vep_meta / 1000000).toFixed(2)}M`
          })
          
          // Add action items from acciones_prioritarias
          vep.data.acciones_prioritarias?.forEach((a: any, i: number) => {
            fallbackEvents.push({
              id: `accion-${i}`,
              timestamp: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
              type: 'action',
              category: a.accion.includes('IPF') ? 'health' : a.accion.includes('IAH') ? 'weather' : 'nutrition',
              title: a.accion,
              description: `Prioridad: ${a.prioridad}`,
              impact: a.prioridad === 1 ? 'high' : 'medium',
              status: 'pending',
              expectedOutcome: `Impacto VEP: +$${(a.impacto_vep / 1000000).toFixed(2)}M`
            })
          })
        }
      }
      
      setEvents(fallbackEvents.length > 0 ? fallbackEvents : [])
      setError(fallbackEvents.length === 0 ? 'No hay eventos disponibles' : null)
    } catch (err) {
      setError('Error cargando timeline de decisiones')
      console.error('Error loading decision timeline:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'decision': return <Brain className="w-4 h-4" />
      case 'action': return <Zap className="w-4 h-4" />
      case 'result': return <TrendingUp className="w-4 h-4" />
      case 'alert': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'decision': return 'text-purple-400 bg-purple-900/20 border-purple-500/30'
      case 'action': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'result': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'alert': return 'text-red-400 bg-red-900/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'pending': return <Target className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-citrus-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Decision Timeline</h3>
              <p className="text-sm text-gray-400">Historial de decisiones y acciones del C²AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-industrial-dark text-gray-400 hover:text-white'
                }`}
              >
                {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-industrial-light">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'decision', label: 'Decisiones' },
          { id: 'action', label: 'Acciones' },
          { id: 'result', label: 'Resultados' },
          { id: 'alert', label: 'Alertas' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === tab.id
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {events
          .filter(event => filter === 'all' || event.type === filter)
          .map((event, index) => (
            <div key={event.id} className={`relative bg-industrial-medium rounded-lg border-l-4 ${getImpactColor(event.impact)}`}>
              {/* Timeline connector */}
              {index < events.length - 1 && (
                <div className="absolute top-8 left-6 w-0.5 h-full bg-industrial-light"></div>
              )}
              
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg border ${getTypeColor(event.type)}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <span className="text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                    
                    {event.aiRecommendation && (
                      <div className="bg-industrial-dark rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Recomendación IA</span>
                          {event.confidence && (
                            <span className="text-xs text-gray-400 ml-auto">
                              Confianza: {event.confidence}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{event.aiRecommendation}</p>
                      </div>
                    )}
                    
                    {(event.expectedOutcome || event.actualOutcome) && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {event.expectedOutcome && (
                          <div>
                            <span className="text-gray-400">Resultado esperado:</span>
                            <p className="text-blue-400">{event.expectedOutcome}</p>
                          </div>
                        )}
                        {event.actualOutcome && (
                          <div>
                            <span className="text-gray-400">Resultado real:</span>
                            <p className="text-green-400">{event.actualOutcome}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-industrial-medium rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-purple-400">{events.length}</span>
          <p className="text-xs text-gray-400">Total Eventos</p>
        </div>
        <div className="bg-industrial-medium rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-green-400">
            {events.filter(e => e.status === 'completed').length}
          </span>
          <p className="text-xs text-gray-400">Completados</p>
        </div>
        <div className="bg-industrial-medium rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-yellow-400">
            {events.filter(e => e.status === 'in-progress').length}
          </span>
          <p className="text-xs text-gray-400">En Progreso</p>
        </div>
        <div className="bg-industrial-medium rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-red-400">
            {events.filter(e => e.impact === 'high').length}
          </span>
          <p className="text-xs text-gray-400">Alto Impacto</p>
        </div>
      </div>
    </div>
  )
}
