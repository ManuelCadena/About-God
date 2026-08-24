/**
 * Watson Programa Anual - Gantt Chart por Sección y Semana ISO
 * 
 * Visualiza el programa anual completo de aplicaciones fitosanitarias
 * optimizado para los 3 ciclos de floración con fases fenológicas
 * 
 * @version 1.0.0
 * @date Enero 2026
 */

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Leaf, 
  Bug, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface Aplicacion {
  producto: string;
  targets: string[];
  costo_ha: number;
  justificacion: string;
}

interface SemanaPrograma {
  semana: number;
  fecha: string;
  gdd: number;
  fase: string;
  fase_nombre: string;
  aplicacion: Aplicacion | null;
}

interface SeccionPrograma {
  biofix: string;
  gdd_inicial: number;
  resumen: {
    total_aplicaciones: number;
    costo_total_ha: number;
    costo_promedio_aplicacion: number;
  };
  semanas: SemanaPrograma[];
}

interface ProgramaAnual {
  generado: string;
  resumen_global: {
    secciones: string[];
    total_aplicaciones: number;
    costo_total_finca: number;
  };
  secciones: Record<string, SeccionPrograma>;
}

const WATSON_API = '/watson-api';

const FASE_COLORS: Record<string, string> = {
  'FEN-01': 'bg-gray-400',      // Latencia
  'FEN-02': 'bg-green-400',     // Brotación
  'FEN-03': 'bg-pink-400',      // Floración
  'FEN-04': 'bg-yellow-400',    // Cuajado
  'FEN-05': 'bg-orange-400',    // Desarrollo
  'FEN-06': 'bg-lime-500',      // Maduración
  'FEN-07': 'bg-amber-600',     // Cosecha
};

const FASE_NOMBRES: Record<string, string> = {
  'FEN-01': 'Latencia',
  'FEN-02': 'Brotación',
  'FEN-03': 'Floración',
  'FEN-04': 'Cuajado',
  'FEN-05': 'Desarrollo',
  'FEN-06': 'Maduración',
  'FEN-07': 'Cosecha',
};

export default function WatsonProgramaAnual() {
  const [programa, setPrograma] = useState<ProgramaAnual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('S1');
  const [viewMode, setViewMode] = useState<'gantt' | 'table'>('gantt');

  const fetchPrograma = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${WATSON_API}/programa-anual`);
      if (!response.ok) throw new Error('Error fetching programa anual');
      const result = await response.json();
      setPrograma(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograma();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-industrial-dark">
        <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
        <span className="ml-3 text-gray-400">Cargando programa anual...</span>
      </div>
    );
  }

  if (error || !programa) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 m-4">
        <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
        <p className="text-red-400">{error || 'No hay datos disponibles'}</p>
        <button 
          onClick={fetchPrograma}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const seccionData = programa.secciones[selectedSection];
  const semanasConAplicacion = seccionData?.semanas.filter(s => s.aplicacion) || [];

  return (
    <div className="bg-industrial-dark min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-lime-400" />
            Watson Optimizer - Programa Anual 2026
          </h1>
          <p className="text-gray-400 mt-1">
            Optimización: $/ΔIPF • Generado: {programa.generado}
          </p>
        </div>
        <button
          onClick={fetchPrograma}
          className="flex items-center gap-2 px-4 py-2 bg-industrial-medium border border-lime-500/30 rounded-lg text-lime-400 hover:bg-lime-500/10"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Resumen Global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-industrial-medium border border-lime-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-lime-400 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Total Aplicaciones</span>
          </div>
          <p className="text-3xl font-bold text-white">{programa.resumen_global.total_aplicaciones}</p>
          <p className="text-xs text-gray-500">Toda la finca</p>
        </div>
        
        <div className="bg-industrial-medium border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Costo Total Finca</span>
          </div>
          <p className="text-3xl font-bold text-white">${programa.resumen_global.costo_total_finca.toLocaleString()}</p>
          <p className="text-xs text-gray-500">MXN/ha total</p>
        </div>

        <div className="bg-industrial-medium border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="text-sm">Secciones</span>
          </div>
          <p className="text-3xl font-bold text-white">{programa.resumen_global.secciones.length}</p>
          <p className="text-xs text-gray-500">{programa.resumen_global.secciones.join(', ')}</p>
        </div>

        <div className="bg-industrial-medium border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">Eficiencia $/ΔIPF</span>
          </div>
          <p className="text-3xl font-bold text-white">
            ${Math.round(programa.resumen_global.costo_total_finca / programa.resumen_global.total_aplicaciones)}
          </p>
          <p className="text-xs text-gray-500">Por aplicación promedio</p>
        </div>
      </div>

      {/* Selector de Sección y Vista */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          {programa.resumen_global.secciones.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSection === sec
                  ? 'bg-lime-500 text-black'
                  : 'bg-industrial-medium text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setViewMode('gantt')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'gantt' ? 'bg-lime-500 text-black' : 'bg-industrial-medium text-gray-400'}`}
          >
            Gantt
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-lime-500 text-black' : 'bg-industrial-medium text-gray-400'}`}
          >
            Tabla
          </button>
        </div>
      </div>

      {/* Info Sección */}
      {seccionData && (
        <div className="bg-industrial-medium border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Sección {selectedSection}</h2>
              <p className="text-gray-400">BioFix: {seccionData.biofix} • GDD Inicial: {seccionData.gdd_inicial}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-lime-400">{seccionData.resumen.total_aplicaciones} aplicaciones</p>
              <p className="text-gray-400">${seccionData.resumen.costo_total_ha}/ha total</p>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda de Fases */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(FASE_NOMBRES).map(([fase, nombre]) => (
          <div key={fase} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${FASE_COLORS[fase]}`}></div>
            <span className="text-xs text-gray-400">{nombre}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <Bug className="w-4 h-4 text-red-400" />
          <span className="text-xs text-gray-400">= Aplicación programada</span>
        </div>
      </div>

      {/* Gantt Chart */}
      {viewMode === 'gantt' && seccionData && (
        <div className="bg-industrial-medium border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[2000px]">
              {/* Header Semanas */}
              <div className="flex border-b border-gray-700">
                <div className="w-24 flex-shrink-0 p-2 bg-industrial-dark text-gray-400 text-xs font-medium">
                  Ciclo
                </div>
                {seccionData.semanas.slice(0, 52).map((sem, idx) => (
                  <div 
                    key={idx}
                    className="w-12 flex-shrink-0 p-1 text-center border-l border-gray-800 bg-industrial-dark"
                  >
                    <span className="text-xs text-gray-500">S{sem.semana}</span>
                  </div>
                ))}
              </div>

              {/* Fila de Fases */}
              <div className="flex border-b border-gray-700">
                <div className="w-24 flex-shrink-0 p-2 bg-industrial-dark text-gray-400 text-xs">
                  Fase
                </div>
                {seccionData.semanas.slice(0, 52).map((sem, idx) => (
                  <div 
                    key={idx}
                    className={`w-12 flex-shrink-0 h-8 border-l border-gray-800 ${FASE_COLORS[sem.fase] || 'bg-gray-600'}`}
                    title={`${sem.fase_nombre} - GDD: ${sem.gdd}`}
                  >
                  </div>
                ))}
              </div>

              {/* Fila de Aplicaciones */}
              <div className="flex border-b border-gray-700">
                <div className="w-24 flex-shrink-0 p-2 bg-industrial-dark text-gray-400 text-xs">
                  Aplicación
                </div>
                {seccionData.semanas.slice(0, 52).map((sem, idx) => (
                  <div 
                    key={idx}
                    className={`w-12 flex-shrink-0 h-12 border-l border-gray-800 flex items-center justify-center ${
                      sem.aplicacion ? 'bg-red-900/50' : 'bg-industrial-dark'
                    }`}
                    title={sem.aplicacion ? `${sem.aplicacion.producto}: ${sem.aplicacion.targets.join(', ')} - $${sem.aplicacion.costo_ha}/ha` : 'Sin aplicación'}
                  >
                    {sem.aplicacion && (
                      <Bug className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Fila de Costos */}
              <div className="flex">
                <div className="w-24 flex-shrink-0 p-2 bg-industrial-dark text-gray-400 text-xs">
                  Costo
                </div>
                {seccionData.semanas.slice(0, 52).map((sem, idx) => (
                  <div 
                    key={idx}
                    className="w-12 flex-shrink-0 p-1 text-center border-l border-gray-800 bg-industrial-dark"
                  >
                    {sem.aplicacion && (
                      <span className="text-xs text-green-400">${sem.aplicacion.costo_ha}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla View */}
      {viewMode === 'table' && seccionData && (
        <div className="bg-industrial-medium border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-industrial-dark">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-400">Semana ISO</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400">Fecha</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400">Fase</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400">GDD</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400">Producto</th>
                <th className="px-4 py-3 text-left text-xs text-gray-400">Targets</th>
                <th className="px-4 py-3 text-right text-xs text-gray-400">Costo/ha</th>
              </tr>
            </thead>
            <tbody>
              {semanasConAplicacion.map((sem, idx) => (
                <tr key={idx} className="border-t border-gray-800 hover:bg-industrial-dark/50">
                  <td className="px-4 py-3 text-white font-medium">S{sem.semana}</td>
                  <td className="px-4 py-3 text-gray-400">{sem.fecha}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs text-black ${FASE_COLORS[sem.fase]}`}>
                      {sem.fase_nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{sem.gdd}</td>
                  <td className="px-4 py-3 text-lime-400 font-medium">{sem.aplicacion?.producto}</td>
                  <td className="px-4 py-3 text-gray-400">{sem.aplicacion?.targets.join(', ')}</td>
                  <td className="px-4 py-3 text-right text-green-400">${sem.aplicacion?.costo_ha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen de Aplicaciones por Ciclo */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-industrial-medium border border-pink-500/30 rounded-lg p-4">
          <h3 className="text-pink-400 font-medium mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Ciclo 1 - Floración Principal
          </h3>
          <p className="text-gray-400 text-sm">Feb-Mar (FEN-03)</p>
          <p className="text-white mt-2">
            {semanasConAplicacion.filter(s => s.semana >= 5 && s.semana <= 12).length} aplicaciones
          </p>
        </div>
        
        <div className="bg-industrial-medium border border-pink-500/30 rounded-lg p-4">
          <h3 className="text-pink-400 font-medium mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Ciclo 2 - Segunda Floración
          </h3>
          <p className="text-gray-400 text-sm">May-Jun (FEN-03)</p>
          <p className="text-white mt-2">
            {semanasConAplicacion.filter(s => s.semana >= 18 && s.semana <= 26).length} aplicaciones
          </p>
        </div>
        
        <div className="bg-industrial-medium border border-pink-500/30 rounded-lg p-4">
          <h3 className="text-pink-400 font-medium mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Ciclo 3 - Tercera Floración
          </h3>
          <p className="text-gray-400 text-sm">Sep-Oct (FEN-03)</p>
          <p className="text-white mt-2">
            {semanasConAplicacion.filter(s => s.semana >= 36 && s.semana <= 44).length} aplicaciones
          </p>
        </div>
      </div>
    </div>
  );
}
