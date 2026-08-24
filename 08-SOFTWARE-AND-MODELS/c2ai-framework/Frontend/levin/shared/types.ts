/**
 * ============================================================================
 * LEVIN LAYER 2.0 - TYPE DEFINITIONS
 * ============================================================================
 * Shared types for all Levin Layer components
 * Based on Michael Levin's bioelectric cognition framework
 */

// ============================================================================
// BIOELECTRIC SENSOR DATA
// ============================================================================

export interface BioelectricReading {
  vmem: number                    // Membrane potential (mV)
  impedance_1k: number            // Impedance at 1kHz (kΩ)
  impedance_10k: number           // Impedance at 10kHz (kΩ)
  frequency_dominant: number      // Dominant frequency (Hz)
  temperature: number             // Sensor temperature (°C)
  battery_pct: number             // Battery percentage
  anomaly_flag: boolean           // Hardware anomaly detected
  timestamp: string               // ISO timestamp
}

export interface SensorLocation {
  id: string
  name: string
  zone: 'meristem' | 'root_tip' | 'fruit_zone' | 'wound_site' | 'canopy'
  section: string
  reading: BioelectricReading
  status: 'online' | 'offline' | 'warning' | 'error'
  last_update: string
}

// ============================================================================
// MODULE OUTPUTS (M1-M10)
// ============================================================================

export interface ModuleOutput {
  module_id: string               // M1, M2, ..., M10
  name: string
  status: 'normal' | 'warning' | 'critical' | 'optimal'
  confidence: number              // 0-1
  value: number                   // Primary output value
  unit: string
  trend: 'up' | 'down' | 'stable'
  last_update: string
  details?: Record<string, any>
}

export interface DetectionAlert {
  id: string
  module_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string                    // pest, disease, stress, opportunity, etc.
  target: string                  // trips, antracnosis, etc.
  confidence: number
  lead_time_hours: number
  section: string
  timestamp: string
  vmem_signature: number[]
  recommendation: string
  cost_estimate?: number
  roi_estimate?: number
}

// ============================================================================
// COMMAND CENTER DATA
// ============================================================================

export interface CommandCenterData {
  section: string
  timestamp: string
  
  // Main KPIs
  goal_alignment: number          // 0-100%
  vep_projected: number           // $ value
  pe_current: number              // 0-100%
  cost_ytd: number                // $ spent
  price_forecast: number          // $/kg
  
  // Bioelectric summary
  vmem_mean: number
  impedance_mean: number
  coherence_score: number
  
  // Module status grid
  modules: ModuleOutput[]
  
  // Active alerts
  alerts: DetectionAlert[]
  
  // Top recommendations
  recommendations: Recommendation[]
  
  // Phenology
  phenology_stage: string
  phenology_name: string
  gdd_current: number
  gdd_next_stage: number
}

export interface Recommendation {
  id: string
  action: string
  reason: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string                // irrigation, nutrition, pest, etc.
  cost_estimate: number
  roi_estimate: number
  deadline?: string
  source_module: string
}

// ============================================================================
// BIOELECTRIC INTELLIGENCE DATA
// ============================================================================

export interface BioelectricIntelligenceData {
  section: string
  timestamp: string
  
  // Tab-specific data
  pest_analysis: PestAnalysis
  disease_analysis: DiseaseAnalysis
  nutrition_analysis: NutritionAnalysis
  water_analysis: WaterAnalysis
  frost_analysis: FrostAnalysis
  recovery_analysis: RecoveryAnalysis
  circadian_analysis: CircadianAnalysis
  
  // Shared data
  locations: SensorLocation[]
  environmental: EnvironmentalData
  heatmap_data: number[][]
}

export interface PestAnalysis {
  detections: DetectionAlert[]
  vmem_delta_6h: number
  frequency_dominant: number
  harmonics: number[]
  fft_spectrum: { freq: number; power: number }[]
  signatures: { pest: string; match_score: number }[]
}

export interface DiseaseAnalysis {
  detections: DetectionAlert[]
  vmem_vp: number                 // Variation potential
  impedance_ratio: number         // Z_1k / Z_10k
  pe_mills_forecast: number[]     // 7-day forecast
  lwd_hours: number               // Leaf wetness duration
}

export interface NutritionAnalysis {
  npf_score: number               // 0-1
  deficiencies: { nutrient: string; severity: number; vmem_indicator: number }[]
  impedance_profile: { freq: number; value: number }[]
  recommendation: string
}

export interface WaterAnalysis {
  iah_score: number               // 0-1
  vmem_absolute: number
  soil_moisture: number
  et0_actual: number
  stress_level: number            // 0-100
  irrigation_recommendation: number // mm
}

export interface FrostAnalysis {
  risk_score: number              // 0-100
  vmem_collapse_detected: boolean
  temperature_history: { time: string; value: number }[]
  damage_estimate: number         // % affected
  recovery_probability: number
}

export interface RecoveryAnalysis {
  recovery_rate: number           // mV/day
  vmem_std: number
  days_since_event: number
  trajectory: { day: number; vmem: number; predicted: number }[]
  prognosis: string
}

export interface CircadianAnalysis {
  rhythm_score: number            // 0-1
  vmem_24h_pattern: { hour: number; vmem: number }[]
  phase_shift: number             // hours
  amplitude: number
  optimal_spray_window: { start: number; end: number }
}

export interface EnvironmentalData {
  temperature: number
  humidity: number
  soil_moisture: number
  light_intensity: number
  wind_speed: number
  precipitation_24h: number
}

// ============================================================================
// MORPHOGENETIC OPTIMIZER DATA
// ============================================================================

export interface MorphogeneticOptimizerData {
  section: string
  timestamp: string
  
  // Phenology timeline
  phenology_current: PhenologyStage
  phenology_stages: PhenologyStage[]
  gdd_accumulated: number
  
  // Opportunity windows
  spray_window: OpportunityWindow
  fertigation_window: OpportunityWindow
  pruning_window: OpportunityWindow
  
  // Quality prediction
  quality_prediction: QualityPrediction
  
  // Vigor assessment
  vigor_score: number
  vigor_factors: { factor: string; value: number; optimal: number }[]
  
  // Pruning optimization
  pruning_recommendation: PruningRecommendation
  
  // Operation calendar
  calendar_events: CalendarEvent[]
  
  // Morphogenetic status
  morphogenetic_status: MorphogeneticStatus
}

export interface PhenologyStage {
  code: string                    // FEN-01 to FEN-13
  name: string
  gdd_start: number
  gdd_end: number
  progress: number                // 0-100%
  is_current: boolean
}

export interface OpportunityWindow {
  status: 'open' | 'closing' | 'closed' | 'optimal'
  hours_remaining: number
  confidence: number
  vmem_indicator: number
  conditions: { factor: string; value: number; threshold: number; ok: boolean }[]
}

export interface QualityPrediction {
  brix_estimate: number
  size_estimate: number           // mm
  color_score: number             // 0-100
  harvest_date_optimal: string
  roi_if_wait: number
  roi_if_now: number
}

export interface PruningRecommendation {
  intensity_pct: number           // 0-30%
  ppi_score: number               // Pruning Perturbation Index
  goal_conflict: boolean
  optimal_date: string
  recovery_days: number
  vep_impact: number              // $
}

export interface CalendarEvent {
  date: string
  type: 'spray' | 'fertigation' | 'irrigation' | 'pruning' | 'harvest' | 'monitoring'
  title: string
  priority: 'low' | 'medium' | 'high'
  module_source: string
  details: string
}

export interface MorphogeneticStatus {
  regeneration_potential: number  // 0-100
  meristem_activation: number     // 0-100
  lai_recovery: number            // 0-100
  stress_growth_balance: number   // -1 to 1
  current_goal: string
  goal_alignment: number
}

// ============================================================================
// PHD AI ANALYSIS
// ============================================================================

export interface PHDAIAnalysis {
  title: string
  timestamp: string
  content: string
  model: string
  confidence: number
  references: string[]
  loading: boolean
}

// ============================================================================
// THEME / DESIGN SYSTEM
// ============================================================================

export const LEVIN_COLORS = {
  primary: '#22c55e',             // Green-500
  secondary: '#8b5cf6',           // Purple-500
  accent: '#3b82f6',              // Blue-500
  warning: '#f59e0b',             // Amber-500
  danger: '#ef4444',              // Red-500
  success: '#10b981',             // Emerald-500
  
  // Status colors
  optimal: '#22c55e',
  normal: '#3b82f6',
  caution: '#f59e0b',
  critical: '#ef4444',
  
  // Background
  bgDark: '#0f172a',              // Slate-900
  bgCard: '#1e293b',              // Slate-800
  bgHover: '#334155',             // Slate-700
  
  // Text
  textPrimary: '#f8fafc',         // Slate-50
  textSecondary: '#94a3b8',       // Slate-400
  textMuted: '#64748b',           // Slate-500
  
  // Module status
  moduleStatus: {
    M1: '#ef4444',                // Pest - Red
    M2: '#f97316',                // Disease - Orange
    M3: '#84cc16',                // Nutrition - Lime
    M4: '#06b6d4',                // Water - Cyan
    M5: '#8b5cf6',                // Opportunity - Purple
    M6: '#f59e0b',                // Quality - Amber
    M7: '#22c55e',                // Vigor - Green
    M8: '#3b82f6',                // Frost - Blue
    M9: '#ec4899',                // Recovery - Pink
    M10: '#14b8a6',               // Circadian - Teal
  }
} as const

export const MODULE_NAMES: Record<string, string> = {
  M1: 'Pest Detector',
  M2: 'Disease Detector',
  M3: 'Nutrition Detector',
  M4: 'Water Stress Detector',
  M5: 'Opportunity Detector',
  M6: 'Fruit Quality Predictor',
  M7: 'Vigor Assessor',
  M8: 'Frost Damage Detector',
  M9: 'Recovery Monitor',
  M10: 'Circadian Corrector',
}
