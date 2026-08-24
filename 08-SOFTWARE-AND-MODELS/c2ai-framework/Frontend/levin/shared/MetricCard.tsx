import React from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { LEVIN_COLORS } from './types'

interface MetricCardProps {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'optimal' | 'normal' | 'warning' | 'critical'
  icon?: React.ReactNode
  subtitle?: string
  tooltip?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

/**
 * ============================================================================
 * METRIC CARD - Industrial Precision Design
 * ============================================================================
 * Reusable metric display component for Levin Layer dashboards
 */
export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'normal',
  icon,
  subtitle,
  tooltip,
  size = 'md',
  className = '',
  onClick
}: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal': return 'border-green-500/50 bg-green-500/5'
      case 'normal': return 'border-blue-500/30 bg-blue-500/5'
      case 'warning': return 'border-amber-500/50 bg-amber-500/5'
      case 'critical': return 'border-red-500/50 bg-red-500/5'
      default: return 'border-slate-600/50'
    }
  }

  const getValueColor = () => {
    switch (status) {
      case 'optimal': return 'text-green-400'
      case 'normal': return 'text-blue-400'
      case 'warning': return 'text-amber-400'
      case 'critical': return 'text-red-400'
      default: return 'text-white'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'optimal': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return null
    }
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div 
      className={`
        bg-slate-800/80 rounded-xl border ${getStatusColor()} 
        transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${sizeClasses[size]} ${className}
      `}
      onClick={onClick}
      title={tooltip}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-sm text-gray-400 font-medium">{title}</span>
        </div>
        {getStatusIcon()}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={`font-bold ${valueSizeClasses[size]} ${getValueColor()}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500">{unit}</span>
        )}
      </div>

      {/* Trend & Subtitle */}
      <div className="flex items-center justify-between mt-2">
        {(trend || trendValue) && (
          <div className="flex items-center gap-1.5">
            {getTrendIcon()}
            {trendValue && (
              <span className={`text-xs ${
                trend === 'up' ? 'text-green-400' : 
                trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {trendValue}
              </span>
            )}
          </div>
        )}
        {subtitle && (
          <span className="text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// GAUGE CARD - Circular progress indicator
// ============================================================================

interface GaugeCardProps {
  title: string
  value: number
  max?: number
  unit?: string
  status?: 'optimal' | 'normal' | 'warning' | 'critical'
  icon?: React.ReactNode
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GaugeCard({
  title,
  value,
  max = 100,
  unit = '%',
  status = 'normal',
  icon,
  subtitle,
  size = 'md',
  className = ''
}: GaugeCardProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const getStrokeColor = () => {
    switch (status) {
      case 'optimal': return '#22c55e'
      case 'normal': return '#3b82f6'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#64748b'
    }
  }

  const gaugeSize = size === 'sm' ? 80 : size === 'lg' ? 160 : 120
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 10
  const radius = (gaugeSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className={`bg-slate-800/80 rounded-xl border border-slate-700/50 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm text-gray-400 font-medium">{title}</span>
      </div>
      
      <div className="flex justify-center">
        <div className="relative" style={{ width: gaugeSize, height: gaugeSize }}>
          <svg className="transform -rotate-90" width={gaugeSize} height={gaugeSize}>
            {/* Background circle */}
            <circle
              cx={gaugeSize / 2}
              cy={gaugeSize / 2}
              r={radius}
              stroke="#334155"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={gaugeSize / 2}
              cy={gaugeSize / 2}
              r={radius}
              stroke={getStrokeColor()}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (percentage / 100) * circumference}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-bold ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'
            } text-white`}>
              {Math.round(value)}
            </span>
            <span className="text-xs text-gray-500">{unit}</span>
          </div>
        </div>
      </div>
      
      {subtitle && (
        <p className="text-center text-xs text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  )
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: 'optimal' | 'normal' | 'warning' | 'critical' | 'offline'
  label?: string
  pulse?: boolean
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, label, pulse = false, size = 'md' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'offline': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDotColor = () => {
    switch (status) {
      case 'optimal': return 'bg-green-400'
      case 'normal': return 'bg-blue-400'
      case 'warning': return 'bg-amber-400'
      case 'critical': return 'bg-red-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <span className={`
      inline-flex items-center gap-1.5 
      ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      rounded-full border font-medium ${getStatusStyles()}
    `}>
      <span className={`
        ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}
        rounded-full ${getDotColor()}
        ${pulse && status !== 'offline' ? 'animate-pulse' : ''}
      `} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default MetricCard
