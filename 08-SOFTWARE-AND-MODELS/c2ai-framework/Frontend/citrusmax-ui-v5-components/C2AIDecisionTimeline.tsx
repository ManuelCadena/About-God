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
      // Simulated data - replace with actual API call
      const mockEvents: DecisionEvent[] = [
        {
          id: '1',
          timestamp: '2025-01-06T08:00:00Z',
          type: 'decision',
          category: 'health',
          title: 'Aplicación Control Trips',
          description: 'Detección de trips nivel 2.1 en S1 - Umbral superado',
          impact: 'high',
          status: 'completed',
          aiRecommendation: 'Aplicar Spinosad 0.2L/ha + Abamectina 0.3L/ha',
          confidence: 92,
          expectedOutcome: 'Reducción IPF < 0.85 en 7 días',
          actualOutcome: 'IPF reducido a 0.82 en 5 días'
        },
        {
          id: '2',
          timestamp: '2025-01-05T14:30:00Z',
          type: 'alert',
          category: 'weather',
          title: 'Alerta Estrés Hídrico',
          description: 'IAH proyectado < 0.85 para próximos 5 días',
          impact: 'medium',
          status: 'in-progress',
          aiRecommendation: 'Programar riego 15mm para mañana',
          confidence: 88,
          expectedOutcome: 'IAH mantenido > 0.90'
        },
        {
          id: '3',
          timestamp: '2025-01-04T10:15:00Z',
          type: 'decision',
          category: 'nutrition',
          title: 'Ajuste Fertilización',
          description: 'NPF S3 detectado en 0.88 - Deficiencia Potasio',
          impact: 'medium',
          status: 'pending',
          aiRecommendation: 'Aplicar KNO3 50kg/ha vía fertirriego',
          confidence: 85,
          expectedOutcome: 'NPF > 0.92 en 14 días'
        },
        {
          id: '4',
          timestamp: '2025-01-03T16:45:00Z',
          type: 'result',
          category: 'vep',
          title: 'VEP Actualizado',
          description: 'VEP sección S1: $1.65M (+5.2% vs semana anterior)',
          impact: 'high',
          status: 'completed',
          expectedOutcome: 'Crecimiento sostenido por buenas prácticas'
        },
        {
          id: '5',
          timestamp: '2025-01-02T09:00:00Z',
          type: 'action',
          category: 'harvest',
          title: 'Inicio Cosecha Temprana',
          description: 'Primer pase cosecha S1 - 120 toneladas',
          impact: 'high',
          status: 'completed',
          aiRecommendation: 'Iniciar cosecha 2 semanas antes por precio alto',
          confidence: 95,
          expectedOutcome: 'Capturar ventana de precios premium',
          actualOutcome: 'Precio obtenido: $22.50/kg (+15% vs promedio)'
        }
      ]
      
      setEvents(mockEvents)
      setError(null)
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
