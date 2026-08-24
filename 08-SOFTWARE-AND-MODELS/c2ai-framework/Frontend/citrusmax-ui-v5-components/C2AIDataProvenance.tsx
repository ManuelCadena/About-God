/**
 * C²AI Data Provenance - Panel 3
 * 
 * Trazabilidad completa de datos: fuentes, freshness, compliance Regla 1.
 * 
 * Framework: C²AI - Conscious Citrus AI
 * Autor: Dr. CitrusMax PhD System
 * Fecha: Enero 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, CheckCircle, AlertTriangle, Clock, RefreshCw,
  FileText, Wifi, Calendar, Info, Shield, ExternalLink
} from 'lucide-react';

interface DataSource {
  factor: string;
  symbol: string;
  value: number | null;
  source: string;
  table: string;
  timestamp: string;
  freshness: 'fresh' | 'stale' | 'error';
  records_used: number;
  compliance: boolean;
}

interface ProvenanceData {
  section: string;
  timestamp: string;
  sources: DataSource[];
  total_factors: number;
  compliant_factors: number;
  rule1_status: 'PASS' | 'FAIL';
}

const FRESHNESS_CONFIG = {
  fresh: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'ACTUAL', icon: CheckCircle },
  stale: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'ANTIGUO', icon: Clock },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'ERROR', icon: AlertTriangle },
};

interface C2AIDataProvenanceProps {
  selectedSection?: string;
}

const C2AIDataProvenance: React.FC<C2AIDataProvenanceProps> = ({ 
  selectedSection = 'S1' 
}) => {
  const [data, setData] = useState<ProvenanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_PE = '/api/v1';
  const normalizedSection = selectedSection === 'TOTAL' ? 'S1' : selectedSection;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_PE}/vep/factors?section=${normalizedSection}`);
        
        if (response.ok) {
          const result = await response.json();
          const factors = result.factors || {};
          
          const sources: DataSource[] = Object.entries(factors).map(([key, data]: [string, any]) => {
            const now = new Date();
            const sourceTime = new Date(data.timestamp || now);
            const hoursDiff = (now.getTime() - sourceTime.getTime()) / (1000 * 60 * 60);
            
            let freshness: 'fresh' | 'stale' | 'error' = 'fresh';
            if (data.source === 'ERROR_NO_DATA' || data.value === null) {
              freshness = 'error';
            } else if (hoursDiff > 24) {
              freshness = 'stale';
            }

            return {
              factor: data.name || key.toUpperCase(),
              symbol: key.toUpperCase(),
              value: data.value,
              source: data.source || 'unknown',
              table: data.source?.split('.')[0] || 'N/A',
              timestamp: data.timestamp || now.toISOString(),
              freshness,
              records_used: data.detalle?.registros || data.records || 1,
              compliance: data.source !== 'config' && data.source !== 'fallback' && data.value !== null,
            };
          });

          const compliantCount = sources.filter(s => s.compliance).length;

          setData({
            section: selectedSection,
            timestamp: new Date().toISOString(),
            sources,
            total_factors: sources.length,
            compliant_factors: compliantCount,
            rule1_status: compliantCount === sources.length ? 'PASS' : 'FAIL',
          });
        }
      } catch (err) {
        console.error('Error fetching provenance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSection]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-industrial-light p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="ml-3 text-slate-400">Cargando Data Provenance...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-industrial-darker to-industrial-dark rounded-xl border border-red-500/50 p-8">
        <div className="flex items-center text-red-400">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <span>Sin datos de trazabilidad disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-cyan-900/50 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="w-10 h-10 text-green-400 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white">Data Provenance & Compliance</h2>
              <p className="text-slate-400">Trazabilidad de Fuentes - Regla 1 Verificada - {selectedSection}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
            data.rule1_status === 'PASS' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {data.rule1_status === 'PASS' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            REGLA 1: {data.rule1_status}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <FileText className="w-4 h-4" />
            <span>Total Factores</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.total_factors}</div>
        </div>
        
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>Compliant</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{data.compliant_factors}</div>
        </div>
        
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Wifi className="w-4 h-4" />
            <span>Datos Frescos</span>
          </div>
          <div className="text-3xl font-bold text-cyan-400">
            {data.sources.filter(s => s.freshness === 'fresh').length}
          </div>
        </div>
        
        <div className="bg-industrial-dark rounded-xl p-4 border border-industrial-light">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Shield className="w-4 h-4" />
            <span>Compliance Rate</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {((data.compliant_factors / data.total_factors) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Data Sources Table */}
      <div className="bg-industrial-dark rounded-xl border border-industrial-light overflow-hidden">
        <div className="px-6 py-4 border-b border-industrial-light flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Fuentes de Datos por Factor</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Factor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fuente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Registros</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Freshness</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.sources.map((source) => {
                const freshnessConfig = FRESHNESS_CONFIG[source.freshness];
                const FreshnessIcon = freshnessConfig.icon;
                
                return (
                  <tr key={source.symbol} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{source.symbol}</span>
                        <span className="text-sm text-slate-400">{source.factor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono ${source.value !== null ? 'text-cyan-400' : 'text-red-400'}`}>
                        {source.value !== null ? source.value.toFixed(2) : 'NULL'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        <span className="text-sm text-slate-300 font-mono">{source.source}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{source.records_used.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${freshnessConfig.bg} ${freshnessConfig.color}`}>
                        <FreshnessIcon className="w-3 h-3" />
                        {freshnessConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {source.compliance ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rule 1 Explanation */}
      <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <div className="font-semibold text-green-400 mb-1">Regla 1: Jerarquía de Datos Inmutable</div>
            <p className="text-sm text-slate-300">
              PostgreSQL &gt; Davis WeatherLink &gt; Google Sheets &gt; APIs Externas &gt; Agentes &gt; Históricos.
              <br />
              <strong>Cero fallbacks con valores ficticios.</strong> Solo datos reales y dinámicos son aceptados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C2AIDataProvenance;
