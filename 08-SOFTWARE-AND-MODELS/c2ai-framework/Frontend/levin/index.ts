/**
 * ============================================================================
 * LEVIN LAYER 2.0 - UNIFIED BIOELECTRIC COGNITION FRAMEWORK
 * ============================================================================
 * 
 * Based on Michael Levin's bioelectric cognition research (Tufts University).
 * These components visualize bioelectric patterns, goal alignment, and 
 * morphogenetic fields in citrus trees using real sensor data.
 * 
 * Architecture:
 * - 3 Unified Panels: Command Center, Bioelectric Intelligence, Morphogenetic Optimizer
 * - 10 Backend Modules: M1-M10 (Pest, Disease, Nutrition, Water, Opportunity, 
 *   Fruit Quality, Vigor, Frost, Recovery, Circadian)
 * - PhD-level AI Analysis in each panel
 * 
 * @author CitrusMax AI PhD System
 * @version 2.0
 * @date January 2026
 */

// ============================================================================
// LEVIN LAYER 2.0 - NEW UNIFIED PANELS
// ============================================================================

// Panel 1: Executive Command Center
export { LevinCommandCenter } from './panels/LevinCommandCenter';

// Panel 2: Bioelectric Intelligence (7 Tabs)
export { BioelectricIntelligence } from './panels/BioelectricIntelligence';

// Panel 3: Morphogenetic Optimizer
export { MorphogeneticOptimizer } from './panels/MorphogeneticOptimizer';

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

// Reusable metric cards and gauges
export { MetricCard, GaugeCard, StatusBadge } from './shared/MetricCard';

// Module status grid and alert list
export { ModuleStatusGrid, AlertList } from './shared/ModuleStatusGrid';

// PhD AI Analysis card (required in all panels per master document)
export { PHDAIAnalysisCard } from './shared/PHDAIAnalysisCard';

// ============================================================================
// SHARED TYPES
// ============================================================================

export type {
  // Core data types
  BioelectricReading,
  ModuleOutput,
  DetectionAlert,
  Recommendation,
  SensorLocation,
  
  // Panel-specific data types
  CommandCenterData,
  BioelectricIntelligenceData,
  MorphogeneticOptimizerData,
  
  // Analysis types
  PestAnalysis,
  DiseaseAnalysis,
  NutritionAnalysis,
  WaterAnalysis,
  FrostAnalysis,
  RecoveryAnalysis,
  CircadianAnalysis,
  
  // Other types
  PhenologyStage,
  OpportunityWindow,
  QualityPrediction,
  PruningRecommendation,
  CalendarEvent,
  MorphogeneticStatus,
} from './shared/types';

// Export color palette and module names
export { LEVIN_COLORS, MODULE_NAMES } from './shared/types';

// ============================================================================
// LEGACY COMPONENTS (Maintained for backward compatibility)
// ============================================================================

export { LevinLayerDashboard } from './LevinLayerDashboard';
export { LevinBioelectricMap } from './LevinBioelectricMap';
export { LevinGoalAlignment } from './LevinGoalAlignment';
export { LevinMorphogenesis } from './LevinMorphogenesis';
