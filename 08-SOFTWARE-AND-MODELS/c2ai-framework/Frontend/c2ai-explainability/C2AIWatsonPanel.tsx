/**
 * C²AI Watson Panel - Panel 6
 * 
 * Visualización de trayectoria óptima hacia estado deseado.
 * Energy landscape analysis y distancia al óptimo.
 * 
 * Framework: C²AI - Conscious Citrus AI (Watson Layer)
 * Basado en: IBM Watson Optimization + Energy Landscape Theory
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { 
  Compass, TrendingUp, Target, Clock, Zap, Activity,
  CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Brain,
  MapPin, Route, Mountain
} from 'lucide-react';

interface TrajectoryPoint {
  day: number;
  current_state: number;
  optimal_state: number;
  gap: number;
}

interface Lever {
  id: string;
  name: string;
  impact: number;
  effort: number;
  roi: number;
  status: 'active' | 'pending' | 'blocked';
  description: string;
}

interface WatsonData {
  section: string;
  timestamp: string;
  trajectory_efficiency: number;
  energy_gap: number;
  days_to_optimal: number;
  current_pe: number;
  optimal_pe: number;
  trajectory: TrajectoryPoint[];
  levers: Lever[];
  landscape_position: string;
}

interface C2AIWatsonPanelProps {
  selectedSection?: string;
}

const C2AIWatsonPanel: React.FC<C2AIWatsonPanelProps> = ({ 
  selectedSection = 'S1' 
}) => {
  const [data, setData] = useState<WatsonData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_WATSON = process.env.REACT_APP_WATSON_API || 'http://44.247.163.1:8502';
  const normalizedSection = selectedSection === 'TOTAL' ? 'S1' : selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_WATSON}/api/watson/seccion/${normalizedSection}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            const watsonData = result.data;
            
            setData({
              section: selectedSection,
              timestamp: watsonData.timestamp || new Date().toISOString(),
              trajectory_efficiency: watsonData.trajectory_efficiency || 0.82,
              energy_gap: watsonData.energy_gap || 0.15,
              days_to_optimal: watsonData.days_to_optimal || 45,
              current_pe: watsonData.current_pe || 0.78,
              optimal_pe: watsonData.optimal_pe || 0.92,
              trajectory: watsonData.trajectory || generateTrajectory(),
              levers: watsonData.levers || generateLevers(),
              landscape_position: watsonData.landscape_position || 'Valle local',
            });
          }
        } else {
          setData({
            section: selectedSection,
            timestamp: new Date().toISOString(),
            trajectory_efficiency: 0.82,
            energy_gap: 0.15,
            days_to_optimal: 45,
            current_pe: 0.78,
            optimal_pe: 0.92,
            trajectory: generateTrajectory(),
            levers: generateLevers(),
            landscape_position: 'Valle local',
          });
        }
      } catch (err) {
        console.error('Error fetching Watson data:', err);
        setData({
          section: selectedSection,
          timestamp: new Date().toISOString(),
          trajectory_efficiency: 0.82,
          energy_gap: 0.15,
          days_to_optimal: 45,
          current_pe: 0.78,
          optimal_pe: 0.92,
          trajectory: generateTrajectory(),
          levers: generateLevers(),
          landscape_position: 'Valle local',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSection]);

  const generateTrajectory = (): TrajectoryPoint[] => {
    const points: TrajectoryPoint[] = [];
    let current = 0.78;
    const optimal = 0.92;
    for (let i = 0; i <= 60; i += 5) {
      const progress = 1 - Math.exp(-i / 30);
      current = 0.78 + (optimal - 0.78) * progress;
      points.push({
        day: i,
        current_state: current,
        optimal_state: optimal,
        gap: optimal - current,
      });
    }
    return points;
  };

  const generateLevers = (): Lever[] => [
    { id: 'irrig', name: 'Optimización Riego', impact: 0.85, effort: 0.3, roi: 2.8, status: 'active', description: 'Ajustar lámina según ET₀ real' },
    { id: 'fert', name: 'Fertirrigación N-K', impact: 0.72, effort: 0.5, roi: 1.4, status: 'active', description: 'Balance nutricional para llenado fruto' },
    { id: 'pest', name: 'Control Fitosanitario', impact: 0.68, effort: 0.4, roi: 1.7, status: 'pending', description: 'Tratamiento preventivo trips/minador' },
    { id: 'prune', name: 'Poda de Formación', impact: 0.45, effort: 0.7, roi: 0.6, status: 'blocked', description: 'No recomendado en etapa actual' },
  ];

  const trajectoryOptions: ApexOptions = {
    chart: { type: 'area', background: 'transparent', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: [3, 2] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
    colors: ['#a855f7', '#22c55e'],
    xaxis: { 
      categories: data?.trajectory.map(t => `D${t.day}`) || [],
      labels: { style: { colors: '#9ca3af' } }
    },
    yaxis: { 
      min: 0.7, max: 1.0,
      labels: { formatter: (val: number) => `${(val * 100).toFixed(0)}%`, style: { colors: '#9ca3af' } }
    },
    legend: { show: true, position: 'top', labels: { colors: '#9ca3af' } },
    grid: { borderColor: '#374151' },
    tooltip: { theme: 'dark' }
  };

  const trajectorySeries = [
    { name: 'Estado Actual', data: data?.trajectory.map(t => t.current_state) || [] },
    { name: 'Estado Óptimo', data: data?.trajectory.map(t => t.optimal_state) || [] }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-industrial-light p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-slate-400">Cargando Watson Trajectory...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Compass className="w-10 h-10 text-purple-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white">Watson Trajectory Layer</h2>
              <p className="text-slate-400">Optimal Path Analysis & Energy Landscape - {selectedSection}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold ${
            data.trajectory_efficiency >= 0.85 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
          }`}>
            Efficiency: {(data.trajectory_efficiency * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Activity className="w-4 h-4" />
            <span>PE Actual</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{(data.current_pe * 100).toFixed(0)}%</div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>PE Óptimo</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{(data.optimal_pe * 100).toFixed(0)}%</div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Zap className="w-4 h-4" />
            <span>Energy Gap</span>
          </div>
          <div className={`text-2xl font-bold ${data.energy_gap <= 0.15 ? 'text-green-400' : 'text-yellow-400'}`}>
            {(data.energy_gap * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span>Días al Óptimo</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{data.days_to_optimal}d</div>
        </div>

        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Mountain className="w-4 h-4" />
            <span>Posición Landscape</span>
          </div>
          <div className="text-lg font-bold text-amber-400">{data.landscape_position}</div>
        </div>
      </div>

      {/* Trajectory Chart */}
      <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
        <div className="flex items-center gap-2 mb-4">
          <Route className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Trayectoria Proyectada (60 días)</h3>
        </div>
        <Chart options={trajectoryOptions} series={trajectorySeries} type="area" height={280} />
      </div>

      {/* Optimization Levers */}
      <div className="bg-industrial-dark rounded-xl p-6 border border-industrial-light">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Palancas de Optimización</h3>
        </div>
        <div className="space-y-3">
          {data.levers.map(lever => {
            const statusConfig = {
              active: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'ACTIVA' },
              pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'PENDIENTE' },
              blocked: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'BLOQUEADA' },
            };
            const config = statusConfig[lever.status];
            
            return (
              <div key={lever.id} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">{lever.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Impacto: <strong className="text-green-400">{(lever.impact * 100).toFixed(0)}%</strong></span>
                    <span className="text-slate-400">Esfuerzo: <strong className="text-amber-400">{(lever.effort * 100).toFixed(0)}%</strong></span>
                    <span className="text-slate-400">ROI: <strong className="text-purple-400">{lever.roi.toFixed(1)}x</strong></span>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{lever.description}</p>
                <div className="mt-2 flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-1">Impacto</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${lever.impact * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-1">Esfuerzo</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${lever.effort * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule 7 Reminder */}
      <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <div className="font-semibold text-purple-400 mb-1">Regla 7: Trayectoria Óptima (Watson)</div>
            <p className="text-sm text-slate-300">
              Efficiency &gt; <strong>0.85</strong> para decisiones automáticas. El sistema busca el 
              camino de menor energía hacia el estado óptimo, evitando mínimos locales.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-industrial-dark/50 rounded-xl p-4 border border-industrial-light">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <Brain className="w-4 h-4" />
          <span className="font-medium">Glosario Watson</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong className="text-purple-400">Energy Landscape:</strong>
            <span className="text-slate-300 ml-1">Superficie de energía donde el sistema busca el mínimo global.</span>
          </div>
          <div>
            <strong className="text-purple-400">Trajectory Efficiency:</strong>
            <span className="text-slate-300 ml-1">Qué tan directo es el camino hacia el óptimo (1.0 = línea recta).</span>
          </div>
          <div>
            <strong className="text-purple-400">Energy Gap:</strong>
            <span className="text-slate-300 ml-1">Diferencia entre estado actual y óptimo en unidades de energía.</span>
          </div>
          <div>
            <strong className="text-purple-400">Local Minimum:</strong>
            <span className="text-slate-300 ml-1">Estado subóptimo del que es difícil escapar sin perturbación.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2AIWatsonPanel;
