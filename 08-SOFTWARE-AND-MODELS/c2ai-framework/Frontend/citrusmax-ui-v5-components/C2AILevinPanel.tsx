/**
 * C²AI Levin Panel - Panel 5
 * 
 * Visualización de alineación con objetivos fisiológicos de la planta.
 * Basado en el trabajo de Michael Levin sobre cognición bioléctrica.
 * 
 * Framework: C²AI - Conscious Citrus AI (Levin Layer)
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { 
  Target, Leaf, Droplets, Shield, Sun, Flower2,
  CheckCircle, AlertTriangle, RefreshCw, Brain, TrendingUp
} from 'lucide-react';

interface PlantGoal {
  id: string;
  name: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  status: 'achieved' | 'on_track' | 'at_risk';
  description: string;
}

interface LevinData {
  section: string;
  timestamp: string;
  alignment_score: number;
  current_goal: string;
  goals: PlantGoal[];
  bioelectric_state: string;
  morphogenetic_field: number;
}

interface C2AILevinPanelProps {
  selectedSection?: string;
}

const C2AILevinPanel: React.FC<C2AILevinPanelProps> = ({ 
  selectedSection = 'S1' 
}) => {
  const [data, setData] = useState<LevinData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_C2AI = '/c2ai-api';
  const normalizedSection = selectedSection === 'TOTAL' ? 'S1' : selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_C2AI}/api/v1/levin/alignment/${normalizedSection}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            const levinData = result.data;
            
            setData({
              section: selectedSection,
              timestamp: levinData.timestamp || new Date().toISOString(),
              alignment_score: levinData.alignment_score || 0.78,
              current_goal: levinData.current_goal || 'Producción óptima',
              goals: levinData.goals || [
                { id: 'growth', name: 'Crecimiento Vegetativo', icon: <Leaf className="w-5 h-5" />, progress: 0.85, target: 0.90, status: 'on_track', description: 'Desarrollo de brotes y follaje' },
                { id: 'production', name: 'Producción Fruto', icon: <Target className="w-5 h-5" />, progress: 0.78, target: 0.85, status: 'on_track', description: 'Cuajado y llenado de fruto' },
                { id: 'defense', name: 'Defensa Fitosanitaria', icon: <Shield className="w-5 h-5" />, progress: 0.82, target: 0.80, status: 'achieved', description: 'Resistencia a plagas/enfermedades' },
                { id: 'hydric', name: 'Balance Hídrico', icon: <Droplets className="w-5 h-5" />, progress: 0.72, target: 0.85, status: 'at_risk', description: 'Optimización uso de agua' },
                { id: 'photosynthesis', name: 'Eficiencia Fotosintética', icon: <Sun className="w-5 h-5" />, progress: 0.88, target: 0.85, status: 'achieved', description: 'Captura y uso de energía solar' },
                { id: 'phenology', name: 'Sincronía Fenológica', icon: <Flower2 className="w-5 h-5" />, progress: 0.75, target: 0.80, status: 'at_risk', description: 'Timing correcto de etapas' },
              ],
              bioelectric_state: levinData.bioelectric_state || 'Polarizado positivo',
              morphogenetic_field: levinData.morphogenetic_field || 0.82,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching Levin data:', err);
        setData({
          section: selectedSection,
          timestamp: new Date().toISOString(),
          alignment_score: 0.76,
          current_goal: 'Producción óptima',
          goals: [
            { id: 'growth', name: 'Crecimiento Vegetativo', icon: <Leaf className="w-5 h-5" />, progress: 0.85, target: 0.90, status: 'on_track', description: 'Desarrollo de brotes y follaje' },
            { id: 'production', name: 'Producción Fruto', icon: <Target className="w-5 h-5" />, progress: 0.78, target: 0.85, status: 'on_track', description: 'Cuajado y llenado de fruto' },
            { id: 'defense', name: 'Defensa Fitosanitaria', icon: <Shield className="w-5 h-5" />, progress: 0.82, target: 0.80, status: 'achieved', description: 'Resistencia a plagas/enfermedades' },
            { id: 'hydric', name: 'Balance Hídrico', icon: <Droplets className="w-5 h-5" />, progress: 0.72, target: 0.85, status: 'at_risk', description: 'Optimización uso de agua' },
            { id: 'photosynthesis', name: 'Eficiencia Fotosintética', icon: <Sun className="w-5 h-5" />, progress: 0.88, target: 0.85, status: 'achieved', description: 'Captura y uso de energía solar' },
            { id: 'phenology', name: 'Sincronía Fenológica', icon: <Flower2 className="w-5 h-5" />, progress: 0.75, target: 0.80, status: 'at_risk', description: 'Timing correcto de etapas' },
          ],
          bioelectric_state: 'Polarizado positivo',
          morphogenetic_field: 0.82,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSection]);

  const radarOptions: ApexOptions = {
    chart: { type: 'radar', background: 'transparent', toolbar: { show: false } },
    xaxis: { categories: data?.goals.map(g => g.name) || [] },
    yaxis: { show: false, max: 1 },
    stroke: { width: 2 },
    fill: { opacity: 0.3 },
    markers: { size: 4 },
    colors: ['#22c55e', '#f59e0b'],
    legend: { show: true, position: 'bottom', labels: { colors: '#9ca3af' } },
    plotOptions: { radar: { polygons: { strokeColors: '#374151', connectorColors: '#374151' } } }
  };

  const radarSeries = [
    { name: 'Progreso Actual', data: data?.goals.map(g => g.progress * 100) || [] },
    { name: 'Meta', data: data?.goals.map(g => g.target * 100) || [] }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-industrial-light p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
          <span className="ml-3 text-slate-400">Cargando Levin Analysis...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statusConfig = {
    achieved: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'LOGRADO' },
    on_track: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'EN CAMINO' },
    at_risk: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'EN RIESGO' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-10 h-10 text-green-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white">Levin Goals Alignment Layer</h2>
              <p className="text-slate-400">Plant Bioelectric Cognition & Morphogenetic Goals - {selectedSection}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold ${
            data.alignment_score >= 0.7 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
          }`}>
            Alignment: {(data.alignment_score * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Objetivos Fisiológicos</h3>
          </div>
          <Chart options={radarOptions} series={radarSeries} type="radar" height={320} />
        </div>

        {/* Goals List */}
        <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Progreso por Objetivo</h3>
          </div>
          <div className="space-y-3">
            {data.goals.map(goal => {
              const config = statusConfig[goal.status];
              return (
                <div key={goal.id} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">{goal.icon}</span>
                      <span className="text-white font-medium">{goal.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          goal.status === 'achieved' ? 'bg-green-500' :
                          goal.status === 'on_track' ? 'bg-cyan-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${goal.progress * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-300 w-16 text-right">
                      {(goal.progress * 100).toFixed(0)}% / {(goal.target * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{goal.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bioelectric State */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="text-sm text-slate-400 mb-2">Estado Bioeléctrico</div>
          <div className="text-2xl font-bold text-green-400">{data.bioelectric_state}</div>
          <p className="text-xs text-slate-500 mt-2">
            La planta como sistema cognitivo mantiene gradientes bioléctricos para coordinar respuestas.
          </p>
        </div>
        <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
          <div className="text-sm text-slate-400 mb-2">Campo Morfogenético</div>
          <div className="text-2xl font-bold text-purple-400">{(data.morphogenetic_field * 100).toFixed(0)}%</div>
          <p className="text-xs text-slate-500 mt-2">
            Coherencia del campo que guía el desarrollo y respuestas adaptativas.
          </p>
        </div>
      </div>

      {/* Rule 5 Reminder */}
      <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <div className="font-semibold text-green-400 mb-1">Regla 5: Respeto a Objetivos de la Planta (Levin)</div>
            <p className="text-sm text-slate-300">
              Alignment score mínimo: <strong>0.70</strong>. Las decisiones deben respetar los objetivos 
              fisiológicos de la planta como organismo cognitivo, no solo maximizar VEP.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <Brain className="w-4 h-4" />
          <span className="font-medium">Glosario Levin</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong className="text-green-400">Cognición Bioléctrica:</strong>
            <span className="text-slate-300 ml-1">Procesamiento de información mediante gradientes eléctricos celulares.</span>
          </div>
          <div>
            <strong className="text-green-400">Campo Morfogenético:</strong>
            <span className="text-slate-300 ml-1">Patrón de información que guía el desarrollo y forma del organismo.</span>
          </div>
          <div>
            <strong className="text-green-400">Alignment Score:</strong>
            <span className="text-slate-300 ml-1">Grado de coherencia entre acciones humanas y objetivos de la planta.</span>
          </div>
          <div>
            <strong className="text-green-400">Goal-Directed:</strong>
            <span className="text-slate-300 ml-1">Comportamiento orientado a metas, no solo reactivo.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2AILevinPanel;
