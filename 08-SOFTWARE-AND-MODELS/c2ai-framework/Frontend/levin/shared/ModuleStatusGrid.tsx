import React from 'react'
import { 
  Bug, Virus, Leaf, Droplets, Sparkles, Apple, 
  Zap, Snowflake, Heart, Clock, AlertCircle, CheckCircle
} from 'lucide-react'
import { ModuleOutput, LEVIN_COLORS, MODULE_NAMES } from './types'

interface ModuleStatusGridProps {
  modules: ModuleOutput[]
  onModuleClick?: (moduleId: string) => void
  compact?: boolean
  className?: string
}

/**
 * ============================================================================
 * MODULE STATUS GRID
 * ============================================================================
 * Displays the status of all 10 Levin Layer 2.0 modules in a grid format
 */
export function ModuleStatusGrid({ 
  modules, 
  onModuleClick, 
  compact = false,
  className = '' 
}: ModuleStatusGridProps) {
  
  const getModuleIcon = (moduleId: string) => {
    const iconClass = compact ? 'w-4 h-4' : 'w-5 h-5'
    switch (moduleId) {
      case 'M1': return <Bug className={iconClass} />
      case 'M2': return <Virus className={iconClass} />
      case 'M3': return <Leaf className={iconClass} />
      case 'M4': return <Droplets className={iconClass} />
      case 'M5': return <Sparkles className={iconClass} />
      case 'M6': return <Apple className={iconClass} />
      case 'M7': return <Zap className={iconClass} />
      case 'M8': return <Snowflake className={iconClass} />
      case 'M9': return <Heart className={iconClass} />
      case 'M10': return <Clock className={iconClass} />
      default: return <AlertCircle className={iconClass} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'normal': return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'warning': return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400'
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-400'
      case 'normal': return 'bg-blue-400'
      case 'warning': return 'bg-amber-400 animate-pulse'
      case 'critical': return 'bg-red-400 animate-pulse'
      default: return 'bg-gray-400'
    }
  }

  const moduleColor = (moduleId: string) => {
    return LEVIN_COLORS.moduleStatus[moduleId as keyof typeof LEVIN_COLORS.moduleStatus] || '#64748b'
  }

  if (compact) {
    return (
      <div className={`grid grid-cols-5 gap-2 ${className}`}>
        {modules.map((module) => (
          <button
            key={module.module_id}
            onClick={() => onModuleClick?.(module.module_id)}
            className={`
              relative p-2 rounded-lg border transition-all duration-200
              hover:scale-105 hover:shadow-lg
              ${getStatusColor(module.status)}
            `}
            title={`${MODULE_NAMES[module.module_id]}: ${module.status}`}
          >
            <div className="flex flex-col items-center gap-1">
              <div style={{ color: moduleColor(module.module_id) }}>
                {getModuleIcon(module.module_id)}
              </div>
              <span className="text-xs font-mono">{module.module_id}</span>
            </div>
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot(module.status)}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-5 gap-3 ${className}`}>
      {modules.map((module) => (
        <button
          key={module.module_id}
          onClick={() => onModuleClick?.(module.module_id)}
          className={`
            relative p-4 rounded-xl border transition-all duration-300
            hover:scale-[1.03] hover:shadow-xl hover:shadow-slate-900/50
            bg-slate-800/60 backdrop-blur-sm
            ${module.status === 'critical' ? 'border-red-500/50 ring-2 ring-red-500/20' :
              module.status === 'warning' ? 'border-amber-500/50' :
              module.status === 'optimal' ? 'border-green-500/50' :
              'border-slate-600/50'}
          `}
        >
          {/* Status indicator */}
          <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getStatusDot(module.status)}`} />
          
          {/* Icon */}
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ 
              backgroundColor: `${moduleColor(module.module_id)}20`,
              color: moduleColor(module.module_id)
            }}
          >
            {getModuleIcon(module.module_id)}
          </div>
          
          {/* Module ID */}
          <div className="text-lg font-bold text-white mb-1">{module.module_id}</div>
          
          {/* Module Name */}
          <div className="text-xs text-gray-400 mb-2 line-clamp-1">
            {MODULE_NAMES[module.module_id]}
          </div>
          
          {/* Value & Confidence */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-medium">
              {module.value.toFixed(2)} {module.unit}
            </span>
            <span className={`
              px-1.5 py-0.5 rounded text-xs
              ${module.confidence >= 0.8 ? 'bg-green-500/20 text-green-400' :
                module.confidence >= 0.6 ? 'bg-blue-500/20 text-blue-400' :
                'bg-amber-500/20 text-amber-400'}
            `}>
              {Math.round(module.confidence * 100)}%
            </span>
          </div>
          
          {/* Trend */}
          <div className="mt-2 pt-2 border-t border-slate-700/50 text-xs text-gray-500">
            {module.trend === 'up' && <span className="text-green-400">↑ Mejorando</span>}
            {module.trend === 'down' && <span className="text-red-400">↓ Declinando</span>}
            {module.trend === 'stable' && <span className="text-gray-400">→ Estable</span>}
          </div>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// ALERT LIST COMPONENT
// ============================================================================

interface AlertListProps {
  alerts: Array<{
    id: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    type: string
    target: string
    confidence: number
    lead_time_hours: number
    section: string
    timestamp: string
    recommendation: string
  }>
  onAlertClick?: (alertId: string) => void
  maxItems?: number
  className?: string
}

export function AlertList({ alerts, onAlertClick, maxItems = 5, className = '' }: AlertListProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/10'
      case 'high': return 'border-l-orange-500 bg-orange-500/10'
      case 'medium': return 'border-l-amber-500 bg-amber-500/10'
      case 'low': return 'border-l-blue-500 bg-blue-500/10'
      default: return 'border-l-gray-500 bg-gray-500/10'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const displayAlerts = alerts.slice(0, maxItems)

  if (displayAlerts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-gray-500 ${className}`}>
        <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm">Sin alertas activas</p>
        <p className="text-xs mt-1">Todos los sistemas operando normalmente</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {displayAlerts.map((alert) => (
        <button
          key={alert.id}
          onClick={() => onAlertClick?.(alert.id)}
          className={`
            w-full text-left p-3 rounded-lg border-l-4 
            transition-all duration-200 hover:translate-x-1
            ${getSeverityStyles(alert.severity)}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span>{getSeverityIcon(alert.severity)}</span>
              <span className="font-medium text-white text-sm">{alert.target}</span>
            </div>
            <span className="text-xs text-gray-500">{alert.section}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
            <span>Confianza: {Math.round(alert.confidence * 100)}%</span>
            <span>•</span>
            <span>Lead time: {alert.lead_time_hours}h</span>
          </div>
          
          <p className="mt-2 text-xs text-gray-300 line-clamp-2">
            {alert.recommendation}
          </p>
        </button>
      ))}
      
      {alerts.length > maxItems && (
        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">
            +{alerts.length - maxItems} alertas más
          </span>
        </div>
      )}
    </div>
  )
}

export default ModuleStatusGrid
