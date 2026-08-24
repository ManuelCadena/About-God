# 🎨 LEVIN LAYER 2.0 - ESTRATEGIA DE FRONTEND

**Versión:** 1.0 | **Fecha:** 15 Enero 2026 | **Estado:** DISEÑO APROBADO

---

## 1. ANÁLISIS DEL C2AI FRAMEWORK EXISTENTE

### 1.1 Stack Tecnológico Actual

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | React | 18.x |
| Styling | TailwindCSS | 3.x |
| Charts | ApexCharts + Recharts | Latest |
| Icons | Lucide React | Latest |
| State | useState/useEffect (local) | React built-in |
| API Calls | fetch nativo | - |

### 1.2 Componentes Levin Existentes

```
frontend/src/components/
├── levin/
│   ├── LevinLayerDashboard.tsx    # Dashboard principal (548 líneas)
│   ├── LevinBioelectricMap.tsx    # Mapa espacial (41KB)
│   ├── LevinGoalAlignment.tsx     # Alineación objetivos (19KB)
│   ├── LevinMorphogenesis.tsx     # Morfogénesis (18KB)
│   └── index.ts
├── c2ai-explainability/
│   └── C2AILevinPanel.tsx         # Panel resumen (281 líneas)
└── BioelectricDetector/
    ├── BioelectricDashboard.jsx   # Dashboard detector
    ├── VmemChart.jsx              # Gráfica Vmem
    ├── AlertCard.jsx              # Cards de alerta
    ├── ThreatDetail.jsx           # Detalles amenaza
    └── MetricCard.jsx             # Cards métricas
```

### 1.3 Patrones de Diseño Identificados

1. **Colores por Layer:**
   - Levin: `green-400`, `green-500`, `emerald-*`
   - Friston: `cyan-400`
   - Watson: `purple-400`
   - Hoffman: `amber-400`
   - Penrose: `pink-400`

2. **Estructura de Componentes:**
   ```typescript
   interface Props {
     selectedSection?: string;  // 'S1' | 'S2' | 'S3' | 'TOTAL'
   }
   
   const Component: React.FC<Props> = ({ selectedSection = 'S1' }) => {
     const [data, setData] = useState<DataType | null>(null);
     const [loading, setLoading] = useState(true);
     
     // Fetch from API
     useEffect(() => { fetchData(); }, [selectedSection]);
     
     // Fallback data for dev
     if (!data) return <FallbackData />;
     
     return <UI />;
   };
   ```

3. **API Pattern:**
   ```typescript
   const API_C2AI = '/c2ai-api';
   const response = await fetch(`${API_C2AI}/api/v1/levin/{endpoint}/{section}`);
   ```

---

## 2. ESTRATEGIA DE INTEGRACIÓN: LEVIN LAYER 2.0

### 2.1 Arquitectura de Componentes Propuesta

```
frontend/src/components/levin-v2/
├── core/
│   ├── LevinModuleShell.tsx       # Shell reutilizable para todos los módulos
│   ├── LevinAlertSystem.tsx       # Sistema unificado de alertas
│   ├── LevinSignatureChart.tsx    # Gráfica de firmas bioeléctricas
│   └── LevinSpatialHeatmap.tsx    # Mapa de calor espacial
│
├── modules/
│   ├── PestDetector/
│   │   ├── PestDetectorPanel.tsx
│   │   ├── PestSignatureTable.tsx
│   │   ├── PestAlertCard.tsx
│   │   └── index.ts
│   │
│   ├── DiseaseDetector/
│   │   ├── DiseaseDetectorPanel.tsx
│   │   ├── PEMillsFusion.tsx      # Fusión con PE Mills
│   │   └── index.ts
│   │
│   ├── NutritionDetector/
│   │   ├── NutritionDetectorPanel.tsx
│   │   ├── INEGauge.tsx           # Índice Nutricional Específico
│   │   ├── NutrientDemandMatrix.tsx
│   │   └── index.ts
│   │
│   ├── WaterStressDetector/
│   │   ├── WaterStressPanel.tsx
│   │   ├── IAHIndicator.tsx       # Índice Adecuación Hídrica
│   │   ├── IrrigationPlan.tsx
│   │   └── index.ts
│   │
│   ├── OpportunityDetector/
│   │   ├── OpportunityPanel.tsx
│   │   ├── WindowCard.tsx
│   │   ├── ConflictResolver.tsx
│   │   └── index.ts
│   │
│   ├── FruitQualityPredictor/
│   │   ├── QualityPanel.tsx
│   │   ├── BrixPredictor.tsx
│   │   └── index.ts
│   │
│   ├── VigorAssessor/
│   │   ├── VigorPanel.tsx
│   │   ├── PruningAdvisor.tsx
│   │   └── index.ts
│   │
│   ├── FrostDetector/
│   │   ├── FrostPanel.tsx
│   │   ├── EmergencyProtocol.tsx
│   │   └── index.ts
│   │
│   ├── RecoveryMonitor/
│   │   ├── RecoveryPanel.tsx
│   │   ├── ResilienceGauge.tsx
│   │   └── index.ts
│   │
│   └── CircadianCorrector/
│       ├── CircadianPanel.tsx
│       ├── HourlyFactorChart.tsx
│       └── index.ts
│
├── dashboard/
│   ├── LevinMasterDashboard.tsx   # Dashboard unificado 10 módulos
│   ├── ModuleSelector.tsx         # Selector de módulo activo
│   └── QuickStatusGrid.tsx        # Grid resumen de todos los módulos
│
└── index.ts                       # Exports centralizados
```

### 2.2 Componente Shell Reutilizable

```tsx
// LevinModuleShell.tsx - Template para todos los módulos
interface LevinModuleShellProps {
  moduleId: string;
  moduleName: string;
  moduleIcon: React.ReactNode;
  color: string;  // 'green' | 'red' | 'blue' | 'yellow' | 'purple'
  selectedSection: string;
  children: React.ReactNode;
  
  // Métricas header
  primaryMetric: {
    label: string;
    value: number;
    unit: string;
    status: 'optimal' | 'warning' | 'critical';
  };
  
  // Alertas
  alerts: Alert[];
  
  // PhD Analysis
  phdAnalysis?: string;
}

const LevinModuleShell: React.FC<LevinModuleShellProps> = ({
  moduleId,
  moduleName,
  moduleIcon,
  color,
  selectedSection,
  children,
  primaryMetric,
  alerts,
  phdAnalysis
}) => {
  return (
    <div className="space-y-6">
      {/* Header con gradiente del color del módulo */}
      <ModuleHeader 
        name={moduleName}
        icon={moduleIcon}
        color={color}
        section={selectedSection}
        metric={primaryMetric}
      />
      
      {/* Alertas activas */}
      {alerts.length > 0 && (
        <AlertStrip alerts={alerts} color={color} />
      )}
      
      {/* Contenido específico del módulo */}
      <div className="grid grid-cols-12 gap-4">
        {children}
      </div>
      
      {/* Análisis PhD */}
      {phdAnalysis && (
        <PhDAnalysisPanel analysis={phdAnalysis} moduleId={moduleId} />
      )}
      
      {/* Footer científico */}
      <ScientificFooter moduleId={moduleId} />
    </div>
  );
};
```

---

## 3. DISEÑO DE PANELES POR MÓDULO

### 3.1 Módulo 1: Pest Detector

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🐛 PEST DETECTOR - Levin Layer 2.0                              [S1] │
│ Detection Confidence: 87%  │  Active Alerts: 2  │  Last Scan: 5m ago │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────────────────────┐  │
│  │  SPATIAL HEATMAP    │  │  BIOELECTRIC SIGNATURES                 │  │
│  │  [Mapa de sección]  │  │  ┌─────────────────────────────────────┐│  │
│  │   🔴 🟡 🟢          │  │  │ Vmem 24h Chart with FFT bands      ││  │
│  │   Alert zones       │  │  │ [================== ]               ││  │
│  │                     │  │  │ Trips: -18mV δ, 0.8-1.2Hz detected ││  │
│  │                     │  │  └─────────────────────────────────────┘│  │
│  └─────────────────────┘  └─────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  ACTIVE DETECTIONS                                                  ││
│  │  ┌──────────────────────────────────────────────────────────────┐  ││
│  │  │ 🔴 TRIPS (Alta) - Sector A3-A5                               │  ││
│  │  │    Vmem: -18mV (umbral: -15mV) │ Freq: 1.1Hz │ Conf: 89%    │  ││
│  │  │    Disparador: T>32°C + Viento <5km/h                        │  ││
│  │  │    → Acción: Aplicar Spinosad 0.1L/ha en próximas 24h       │  ││
│  │  └──────────────────────────────────────────────────────────────┘  ││
│  │  ┌──────────────────────────────────────────────────────────────┐  ││
│  │  │ 🟡 ÁCAROS (Media) - Sector B2                                │  ││
│  │  │    Vmem: +8mV (umbral: +10mV) │ Freq: 3.2Hz │ Conf: 72%     │  ││
│  │  │    Disparador: HR<40% + T>30°C                               │  ││
│  │  │    → Acción: Monitorear, aplicar Abamectina si persiste     │  ││
│  │  └──────────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  PhD ANALYSIS                                                       ││
│  │  La firma bioeléctrica detectada (δVmem -18mV en 6h con pico       ││
│  │  FFT 1.1Hz) coincide 89% con el patrón de alimentación de Trips.   ││
│  │  La temperatura actual (33°C) y baja velocidad del viento crean    ││
│  │  condiciones óptimas para proliferación. Se recomienda aplicación  ││
│  │  preventiva de Spinosad antes de que la población alcance el       ││
│  │  umbral económico de daño (>5 trips/hoja).                         ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Módulo 4: Water Stress Detector

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 💧 WATER STRESS DETECTOR - Levin Layer 2.0                       [S2] │
│ IAH: 0.72 (Estrés Leve) │ Next Irrigation: 14h │ Confidence: 91%     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐│
│  │  IAH GAUGE                     │  │  IRRIGATION FORECAST 7 DAYS   ││
│  │        ╭───────────╮           │  │  ┌────────────────────────────┐││
│  │     ╭──┤   0.72    ├──╮        │  │  │ Día │ ET0 │ Kc  │ Riego   │││
│  │    ╱   ╰─────────╯    ╲       │  │  │ Hoy │ 5.2 │0.75 │ 28mm    │││
│  │   0.0      🟡        1.0      │  │  │ +1d │ 5.4 │0.75 │ 29mm    │││
│  │   CRÍTICO  LEVE   ÓPTIMO      │  │  │ +2d │ 4.8 │0.75 │ 26mm    │││
│  │                               │  │  │ +3d │ 5.1 │0.80 │ 29mm    │││
│  └────────────────────────────────┘  │  │ +7d │ 4.9 │0.80 │ 28mm    │││
│                                       │  └────────────────────────────┘││
│  ┌────────────────────────────────┐  │  Total semana: 195mm          ││
│  │  BIOELECTRIC WATER SIGNATURE   │  └────────────────────────────────┘│
│  │  ┌──────────────────────────┐ │                                     │
│  │  │ Vmem: ▃▂▁▁▁▂▃▄▄▃▂▁      │ │  ┌────────────────────────────────┐│
│  │  │       -20mV trend ↓     │ │  │  WATER BALANCE                  ││
│  │  │ Z:    ▁▂▃▄▅▆▇█▇▆▅▄      │ │  │  Input:  ET0×Kc = 3.9mm/día   ││
│  │  │       +45% impedance ↑  │ │  │  Output: Riego = 4.0mm/día     ││
│  │  └──────────────────────────┘ │  │  Balance: +0.1mm/día ✓        ││
│  │  Fase: Estrés leve (Fase 2)   │  │  Reserva: 72% capacidad campo ││
│  └────────────────────────────────┘  └────────────────────────────────┘│
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  💡 RECOMMENDATION                                                  ││
│  │  Irrigar 28mm en las próximas 14 horas para restaurar IAH >0.85.   ││
│  │  La firma bioeléctrica (Vmem -20mV, Z +45%) indica estrés leve     ││
│  │  pero reversible. Dividir en 2 pulsos de 14mm para mejor absorción.││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Módulo 5: Opportunity Detector

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🎯 OPPORTUNITY DETECTOR - Levin Layer 2.0                        [S1] │
│ Active Windows: 3 │ Best ROI: Spray (145%) │ Next Window: 6h         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVE OPPORTUNITY WINDOWS                                       │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ 🟢 SPRAY WINDOW              Starts: 6:00 AM   Duration: 4h │ │ │
│  │  │ Score: 92/100                                               │ │ │
│  │  │ ├─ Wind: 3 km/h ✓   HR: 78% ✓   Temp: 24°C ✓             │ │ │
│  │  │ ├─ Plant receptivity: HIGH (stomata open)                   │ │ │
│  │  │ ├─ ROI: 145% │ Cost: $180 │ Benefit: $440                  │ │ │
│  │  │ └─ ⚡ AUTO-SCHEDULED for tomorrow 6:00 AM                   │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ 🟡 FERTIGATION WINDOW        Starts: NOW      Duration: 2h │ │ │
│  │  │ Score: 78/100                                               │ │ │
│  │  │ ├─ Soil moisture: 68% ✓  pH: 6.2 ✓  EC: 1.8 ⚠️            │ │ │
│  │  │ ├─ Nutrient demand: N high, K medium                        │ │ │
│  │  │ ├─ ROI: 89% │ Cost: $250 │ Benefit: $472                   │ │ │
│  │  │ └─ ⏳ REQUIRES REVIEW - EC slightly high                    │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ 🔵 HARVEST WINDOW            Starts: +3 days  Duration: 5d │ │ │
│  │  │ Score: 85/100                                               │ │ │
│  │  │ ├─ Brix: 8.2° (target: 8.5°)  Color: 85%  Size: 52mm      │ │ │
│  │  │ ├─ Market price: $2.15/kg (+12% vs last week)              │ │ │
│  │  │ ├─ ROI: 234% │ Revenue: $45,000 estimated                  │ │ │
│  │  │ └─ 📊 MONITORING - Wait for Brix ≥8.5°                     │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  CONFLICT RESOLUTION                                              │ │
│  │  ⚠️ Spray + Fertigation overlap detected                         │ │
│  │  → Recommendation: Spray first (6-10AM), Fertigation after (11AM) │ │
│  │  → Adjusted schedule optimizes both operations (+8% efficiency)   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. ARQUITECTURA API NECESARIA

### 4.1 Endpoints Propuestos

```yaml
# Base: /c2ai-api/api/v1/levin-v2/

# Módulo 1: Pest Detector
GET /pest-detector/{section}/status        # Estado actual
GET /pest-detector/{section}/detections    # Detecciones activas
GET /pest-detector/{section}/history       # Histórico 30 días
GET /pest-detector/{section}/signatures    # Firmas bioeléctricas

# Módulo 2: Disease Detector
GET /disease-detector/{section}/status
GET /disease-detector/{section}/pe-mills   # Fusión con PE Mills
GET /disease-detector/{section}/risk       # Riesgo por enfermedad

# Módulo 3: Nutrition Detector
GET /nutrition-detector/{section}/ine      # INE por nutriente
GET /nutrition-detector/{section}/demand   # Demanda fenológica
GET /nutrition-detector/{section}/plan     # Plan de fertiriego

# Módulo 4: Water Stress Detector
GET /water-stress/{section}/iah            # Índice Adecuación Hídrica
GET /water-stress/{section}/forecast       # Pronóstico riego 7 días
GET /water-stress/{section}/balance        # Balance hídrico

# Módulo 5: Opportunity Detector
GET /opportunity/{section}/windows         # Ventanas activas
GET /opportunity/{section}/schedule        # Schedule optimizado
GET /opportunity/{section}/conflicts       # Conflictos detectados

# Módulos 6-10 (estructura similar)
GET /quality-predictor/{section}/brix
GET /vigor-assessor/{section}/status
GET /frost-detector/{section}/risk
GET /recovery-monitor/{section}/resilience
GET /circadian/{section}/factors

# Dashboard consolidado
GET /dashboard/{section}/summary           # Resumen todos los módulos
GET /dashboard/{section}/alerts            # Todas las alertas activas
```

### 4.2 Estructura de Respuesta Estándar

```typescript
interface LevinAPIResponse<T> {
  status: 'success' | 'error';
  data: T;
  timestamp: string;
  section: string;
  module: string;
  confidence: number;
  alerts: Alert[];
  metadata: {
    sensor_count: number;
    data_freshness: number;  // seconds since last update
    model_version: string;
  };
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  action: string;
  timestamp: string;
  expires: string;
}
```

---

## 5. COMPONENTES UI REUTILIZABLES

### 5.1 LevinMetricCard

```tsx
interface LevinMetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status: 'optimal' | 'warning' | 'critical';
  icon?: React.ReactNode;
  tooltip?: string;
}

// Uso:
<LevinMetricCard
  title="IAH"
  value={0.72}
  unit=""
  trend="down"
  trendValue="-0.05 vs ayer"
  status="warning"
  icon={<Droplets />}
  tooltip="Índice de Adecuación Hídrica"
/>
```

### 5.2 LevinSignatureChart

```tsx
interface LevinSignatureChartProps {
  data: {
    timestamp: string;
    vmem: number;
    impedance: number;
    frequency?: number;
  }[];
  timeRange: '6h' | '12h' | '24h' | '7d';
  thresholds?: {
    vmem: { low: number; high: number };
    impedance: { low: number; high: number };
  };
  highlightAnomalies?: boolean;
  showFFT?: boolean;
}
```

### 5.3 LevinAlertBanner

```tsx
interface LevinAlertBannerProps {
  alerts: Alert[];
  maxVisible?: number;
  onDismiss?: (id: string) => void;
  onAction?: (alert: Alert) => void;
}
```

### 5.4 LevinSpatialMap

```tsx
interface LevinSpatialMapProps {
  section: string;
  data: {
    node_id: string;
    lat: number;
    lng: number;
    value: number;
    status: 'normal' | 'warning' | 'alert';
  }[];
  metric: 'vmem' | 'impedance' | 'pest' | 'disease' | 'water';
  colorScale: string[];  // ['#22c55e', '#eab308', '#ef4444']
  showLabels?: boolean;
  onNodeClick?: (nodeId: string) => void;
}
```

---

## 6. INTEGRACIÓN CON LEVIN LAYER EXISTENTE

### 6.1 Estrategia de Migración

```
Fase 1: Coexistencia (Semana 1-2)
├── Mantener componentes existentes intactos
├── Crear nueva carpeta levin-v2/
├── Agregar toggle en UI: "Levin Classic" vs "Levin 2.0"
└── API endpoints nuevos bajo /levin-v2/

Fase 2: Integración (Semana 3-4)
├── Conectar LevinMasterDashboard a navegación principal
├── Añadir módulos al C2AIFrameworkMap
├── Integrar alertas al sistema global
└── Unificar análisis PhD

Fase 3: Consolidación (Semana 5-6)
├── Deprecar componentes legacy
├── Migrar usuarios a Levin 2.0
├── Actualizar documentación
└── Training para usuarios
```

### 6.2 Modificaciones al C2AIFrameworkMap

```tsx
// Agregar nodos para los 10 módulos Levin 2.0
const LEVIN_MODULES = [
  { id: 'pest', name: 'Pest Detector', icon: <Bug />, color: '#ef4444' },
  { id: 'disease', name: 'Disease Detector', icon: <Virus />, color: '#f97316' },
  { id: 'nutrition', name: 'Nutrition', icon: <Leaf />, color: '#22c55e' },
  { id: 'water', name: 'Water Stress', icon: <Droplets />, color: '#3b82f6' },
  { id: 'opportunity', name: 'Opportunity', icon: <Target />, color: '#a855f7' },
  { id: 'quality', name: 'Fruit Quality', icon: <Apple />, color: '#ec4899' },
  { id: 'vigor', name: 'Vigor', icon: <TrendingUp />, color: '#14b8a6' },
  { id: 'frost', name: 'Frost', icon: <Snowflake />, color: '#06b6d4' },
  { id: 'recovery', name: 'Recovery', icon: <RefreshCw />, color: '#84cc16' },
  { id: 'circadian', name: 'Circadian', icon: <Clock />, color: '#f59e0b' },
];
```

---

## 7. RESPONSIVE DESIGN

### 7.1 Breakpoints

| Breakpoint | Ancho | Layout |
|------------|-------|--------|
| Mobile | < 768px | 1 columna, cards apiladas |
| Tablet | 768-1024px | 2 columnas, gráficas simplificadas |
| Desktop | 1024-1440px | 3 columnas, layout completo |
| Large | > 1440px | 4 columnas, múltiples gráficas |

### 7.2 Mobile-First Components

```tsx
// LevinMobileDashboard.tsx
// Vista simplificada para móvil con:
// - Quick status de los 10 módulos (semáforos)
// - Alertas críticas expandibles
// - Acción rápida (1-tap irrigation, dismiss alert)
```

---

## 8. PERFORMANCE OPTIMIZATIONS

### 8.1 Data Fetching Strategy

```typescript
// useLevinData.ts - Custom hook con:
// - Polling adaptativo (30s normal, 5s si hay alertas)
// - Cache con stale-while-revalidate
// - Prefetch de módulos adyacentes
// - WebSocket opcional para alertas críticas

const useLevinData = (moduleId: string, section: string) => {
  return useQuery({
    queryKey: ['levin', moduleId, section],
    queryFn: () => fetchLevinData(moduleId, section),
    staleTime: 30000,
    refetchInterval: (data) => 
      data?.alerts?.some(a => a.severity === 'critical') ? 5000 : 30000,
  });
};
```

### 8.2 Chart Optimization

- Usar `useMemo` para data transformations
- Limitar puntos en gráficas: 100 puntos máx para 24h
- Lazy load módulos no visibles
- Virtualización para listas largas de alertas

---

## 9. TESTING STRATEGY

```typescript
// __tests__/levin-v2/
├── PestDetectorPanel.test.tsx
├── WaterStressPanel.test.tsx
├── LevinModuleShell.test.tsx
├── integration/
│   └── LevinDashboard.integration.test.tsx
└── e2e/
    └── levin-workflow.spec.ts
```

---

## 10. TIMELINE DE IMPLEMENTACIÓN

| Semana | Entregable | Componentes |
|--------|------------|-------------|
| 1 | Core components | Shell, MetricCard, SignatureChart |
| 2 | Módulos 1-2 | PestDetector, DiseaseDetector |
| 3 | Módulos 3-4 | NutritionDetector, WaterStressDetector |
| 4 | Módulo 5 + Dashboard | OpportunityDetector, MasterDashboard |
| 5 | Módulos 6-10 | Quality, Vigor, Frost, Recovery, Circadian |
| 6 | Integración + QA | Testing, bug fixes, documentation |

**Esfuerzo estimado:** 6 semanas, 1 desarrollador frontend senior

---

## 11. RESUMEN EJECUTIVO

### Decisiones Clave:

1. **Arquitectura modular** con `LevinModuleShell` reutilizable
2. **Componentes atómicos** para máxima reutilización
3. **API RESTful** con estructura estándar
4. **Coexistencia** con componentes legacy durante migración
5. **Performance-first** con polling adaptativo y lazy loading

### Stack Recomendado:

| Tecnología | Propósito |
|------------|-----------|
| React 18 | Framework (consistencia con C2AI) |
| TailwindCSS | Styling |
| ApexCharts | Gráficas complejas (firmas, FFT) |
| React Query | Data fetching + cache |
| Zustand | State global (alertas, sección activa) |
| Lucide | Iconografía |

---

**Status:** ✅ Design Approved  
**Next:** Implementar LevinModuleShell y primeros 2 módulos  
**Author:** Dr. CitrusMax PhD System  
**Date:** 15 Enero 2026
