import React, { useState, useCallback } from 'react'
import { Brain, RefreshCw, Info, BookOpen, Sparkles, AlertCircle } from 'lucide-react'

interface PHDAIAnalysisCardProps {
  title: string
  data: Record<string, any>
  generateAnalysis: (data: Record<string, any>) => string
  apiEndpoint?: string
  className?: string
}

/**
 * ============================================================================
 * PHD AI ANALYSIS CARD
 * ============================================================================
 * Standardized component for PhD-level AI analysis across all Levin panels
 * Follows CitrusMax design system with industrial precision aesthetic
 */
export function PHDAIAnalysisCard({ 
  title, 
  data, 
  generateAnalysis,
  apiEndpoint,
  className = ''
}: PHDAIAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useAPI, setUseAPI] = useState(false)

  const handleGenerateAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (useAPI && apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (response.ok) {
          const result = await response.json()
          setAnalysis(result.analysis || result.content)
        } else {
          throw new Error('API error')
        }
      } else {
        // Use local generation
        const localAnalysis = generateAnalysis(data)
        setAnalysis(localAnalysis)
      }
    } catch (err) {
      console.error('Error generating analysis:', err)
      // Fallback to local generation
      const localAnalysis = generateAnalysis(data)
      setAnalysis(localAnalysis)
    } finally {
      setLoading(false)
    }
  }, [data, generateAnalysis, apiEndpoint, useAPI])

  return (
    <div className={`bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/30 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Análisis PhD con IA
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h3>
            <p className="text-xs text-indigo-300/70">{title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {apiEndpoint && (
            <button
              onClick={() => setUseAPI(!useAPI)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                useAPI 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title={useAPI ? 'Usando API (GPT-4)' : 'Usando análisis local'}
            >
              {useAPI ? '🌐 API' : '💻 Local'}
            </button>
          )}
          
          <button 
            onClick={handleGenerateAnalysis} 
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 
                       rounded-lg text-white text-sm font-medium flex items-center gap-2 
                       transition-all duration-200 shadow-lg shadow-indigo-500/20
                       hover:shadow-indigo-500/40 disabled:shadow-none"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>{analysis ? 'Regenerar' : 'Generar'} Análisis</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400" />
            </div>
            <span className="mt-4 text-indigo-300/70 text-sm">Generando análisis PhD...</span>
            <span className="text-xs text-gray-500 mt-1">Procesando datos bioeléctricos...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-red-400">
            <AlertCircle className="w-12 h-12 mb-3 opacity-70" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={handleGenerateAnalysis}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : analysis ? (
          <div className="bg-slate-900/50 rounded-lg p-5 max-h-[500px] overflow-y-auto 
                          scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed">
                {analysis}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-900/30 flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-indigo-400/50" />
            </div>
            <p className="text-gray-400 mb-2">No hay análisis generado</p>
            <p className="text-xs text-gray-500 max-w-md">
              Haz clic en "Generar Análisis" para obtener una interpretación PhD 
              detallada basada en el framework de cognición bioeléctrica de Michael Levin.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-indigo-500/20 bg-indigo-950/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>Framework: Michael Levin (Tufts University)</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bioelectric Cognition & Morphogenesis</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PHDAIAnalysisCard
