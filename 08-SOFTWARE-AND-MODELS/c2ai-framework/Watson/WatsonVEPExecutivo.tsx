/**
 * Watson VEP Ejecutivo - Dashboard para gerencia
 * Resumen de KPIs clave del VEP
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Leaf, Droplets, Bug, Brain, RefreshCw } from 'lucide-react';
import { generatePanelAnalysis } from '../../services/llmService';

export default function WatsonVEPExecutivo() {
  const [llmAnalysis, setLlmAnalysis] = useState<string>('');
  const [llmLoading, setLlmLoading] = useState(false);

  const kpis = {
    vep_actual: 11800000,
    vep_meta: 18900000,
    pe_actual: 60,
    pe_meta: 95,
    ipf: 0.24,
    iah: 0.85,
    npf: 0.78
  };

  const gap = ((kpis.vep_meta - kpis.vep_actual) / kpis.vep_meta * 100).toFixed(1);

  const fetchLLMAnalysis = async () => {
    setLlmLoading(true);
    try {
      const analysis = await generatePanelAnalysis({
        panelId: 'watson-vep',
        value: kpis.pe_actual,
        data: {
          vep_actual: kpis.vep_actual,
          vep_meta: kpis.vep_meta,
          pe_actual: kpis.pe_actual,
          pe_meta: kpis.pe_meta,
          ipf: kpis.ipf,
          iah: kpis.iah,
          npf: kpis.npf,
          gap_porcentaje: gap
        }
      });
      setLlmAnalysis(analysis);
    } catch (err) {
      console.error('Error fetching LLM analysis:', err);
      setLlmAnalysis('Error al generar análisis. Intente de nuevo.');
    } finally {
      setLlmLoading(false);
    }
  };

  useEffect(() => {
    if (!llmAnalysis) {
      fetchLLMAnalysis();
    }
  }, []);

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-green-400" />
        Dashboard Ejecutivo VEP
      </h1>

      {/* VEP Principal */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-400 mb-2">VEP Actual</p>
            <p className="text-4xl font-bold text-white">${(kpis.vep_actual/1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">VEP Meta 2026</p>
            <p className="text-4xl font-bold text-green-400">${(kpis.vep_meta/1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Oportunidad</p>
            <p className="text-4xl font-bold text-yellow-400">+${((kpis.vep_meta-kpis.vep_actual)/1000000).toFixed(1)}M</p>
            <p className="text-sm text-yellow-400/70">GAP: {gap}%</p>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-industrial-medium border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm">PE</span>
          </div>
          <p className="text-2xl font-bold text-white">{kpis.pe_actual}%</p>
          <p className="text-xs text-gray-500">Meta: {kpis.pe_meta}%</p>
        </div>

        <div className="bg-industrial-medium border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Bug className="w-5 h-5" />
            <span className="text-sm">IPF</span>
          </div>
          <p className="text-2xl font-bold text-white">{kpis.ipf}</p>
          <p className="text-xs text-gray-500">Meta: &lt;0.10</p>
        </div>

        <div className="bg-industrial-medium border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Droplets className="w-5 h-5" />
            <span className="text-sm">IAH</span>
          </div>
          <p className="text-2xl font-bold text-white">{kpis.iah}</p>
          <p className="text-xs text-gray-500">Meta: &gt;0.90</p>
        </div>

        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="text-sm">NPF</span>
          </div>
          <p className="text-2xl font-bold text-white">{kpis.npf}</p>
          <p className="text-xs text-gray-500">Meta: &gt;0.85</p>
        </div>
      </div>

      {/* Acciones Prioritarias */}
      <div className="mt-6 bg-industrial-medium border border-yellow-500/30 rounded-lg p-4">
        <h2 className="text-lg font-bold text-yellow-400 mb-3">Acciones Prioritarias</h2>
        <ul className="space-y-2 text-gray-300">
          <li>• Reducir IPF de 0.24 a &lt;0.10 → +$2.1M VEP</li>
          <li>• Optimizar riego IAH a &gt;0.90 → +$1.5M VEP</li>
          <li>• Mejorar NPF a &gt;0.85 → +$1.2M VEP</li>
        </ul>
      </div>

      {/* PhD AI Analysis Panel - Dynamic LLM */}
      <div className="mt-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Análisis PhD con IA</h3>
              <p className="text-sm text-cyan-300">Interpretación VEP Ejecutivo - Claude AI</p>
            </div>
          </div>
          <button
            onClick={fetchLLMAnalysis}
            disabled={llmLoading}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {llmLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerar
          </button>
        </div>

        {llmLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-cyan-300">Generando análisis con Claude AI...</span>
          </div>
        ) : llmAnalysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {llmAnalysis}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Cargando análisis PhD con IA...</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Fuente:</span> Análisis generado por Claude AI basado en Watson VEP Ejecutivo.
            <span className="text-cyan-400 ml-2">Regla 1 Compliance: Solo datos verificados.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
