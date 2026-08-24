# 🧠 C²AI Framework Complete - CitrusMax AI

## Descripción

Estructura consolidada de todos los componentes del **C²AI Framework** (Conscious Citrus AI) para el dashboard de CitrusMax.ai.

**Fecha de Consolidación:** 9 Enero 2026  
**Versión:** 1.0.0

---

## 📁 Estructura de Carpetas

```
C2AI-Framework-Complete/
├── README.md                          ← Este archivo
├── CHANGELOG.md                       ← Historial de cambios
├── frontend/
│   └── src/
│       └── components/
│           ├── c2ai-explainability/   ← Paneles principales C²AI
│           │   ├── C2AIFristonPanel.tsx (LEGACY)
│           │   ├── FristonLayerDashboard.tsx ← PRINCIPAL (95%)
│           │   ├── FristonFreeEnergy.tsx
│           │   ├── FristonPredictionError.tsx
│           │   ├── FristonSurpriseIndex.tsx
│           │   ├── C2AIHoffmanPanel.tsx (LEGACY)
│           │   ├── HoffmanDashboard.tsx ← PRINCIPAL (95%)
│           │   ├── HoffmanPerception.tsx
│           │   ├── HoffmanConflicts.tsx
│           │   ├── HoffmanKernel.tsx
│           │   ├── C2AIPenrosePanel.tsx
│           │   ├── C2AIWatsonPanel.tsx
│           │   ├── C2AILevinPanel.tsx
│           │   ├── C2AIDecisionTimeline.tsx
│           │   └── ... (otros paneles)
│           ├── watson/                ← Watson Optimizer
│           │   ├── WatsonOptimizerDashboard.tsx ← PRINCIPAL (95%)
│           │   ├── WatsonVEPExecutivo.tsx
│           │   ├── WatsonProgramaAnual.tsx
│           │   ├── WatsonNutricionAnual.tsx
│           │   ├── WatsonRecetasOptimizadas.tsx
│           │   └── WatsonModelosPredictivos.tsx
│           ├── levin/                 ← Levin Layer
│           │   ├── LevinLayerDashboard.tsx ← PRINCIPAL (90%)
│           │   ├── LevinBioelectricMap.tsx
│           │   ├── LevinGoalAlignment.tsx
│           │   └── LevinMorphogenesis.tsx
│           └── consciousness/         ← Kernel Panels
│               ├── C2AIPanel.tsx
│               ├── IPFKernelPanel.tsx
│               ├── NPFKernelPanel.tsx
│               ├── IAHKernelPanel.tsx
│               └── ... (15 archivos)
├── backend/
│   └── api/
│       └── routes/                    ← APIs del C²AI
│           ├── c2ai_framework.py
│           ├── friston_layer.py
│           ├── hoffman_layer.py
│           ├── penrose_layer.py
│           ├── watson_layer.py
│           ├── levin_layer.py
│           └── decision_timeline.py
└── backups/
    └── c2ai-framework-backup-YYYYMMDD_HHMMSS.tar.gz
```

---

## 🎯 Layers del C²AI Framework

### 1. FRISTON LAYER (Free Energy Minimization)
- **Archivo Principal:** `FristonLayerDashboard.tsx`
- **Completitud:** 95%
- **Métricas:** Free Energy, KL Divergence, Surprise, Urgency, VEP Impact
- **API:** `/c2ai-api/api/v1/friston/dashboard/{section}`

### 2. HOFFMAN LAYER (Kernel Reconstruction)
- **Archivo Principal:** `HoffmanDashboard.tsx`
- **Completitud:** 95%
- **Métricas:** Global Confidence, Sensor Status, Agent Perceptions, Conflicts
- **API:** `/c2ai-api/api/v1/hoffman/dashboard/{section}`

### 3. PENROSE LAYER (Quantum Coherence)
- **Archivo Principal:** `C2AIPenrosePanel.tsx` (pendiente upgrade)
- **Completitud:** 40% → 100% (en desarrollo)
- **Métricas:** Coherence, Decision Entropy, Collapse Readiness
- **API:** `/c2ai-api/api/v1/penrose/dashboard/{section}`

### 4. WATSON LAYER (Energy Landscape Optimization)
- **Archivo Principal:** `WatsonOptimizerDashboard.tsx`
- **Completitud:** 95%
- **Métricas:** Trajectory Efficiency, Energy Gap, Optimization Levers
- **API:** `/c2ai-api/api/v1/watson/programa`

### 5. LEVIN LAYER (Bioelectric Cognition)
- **Archivo Principal:** `LevinLayerDashboard.tsx`
- **Completitud:** 90%
- **Métricas:** Bioelectric Map, Goal Alignment, Morphogenesis
- **API:** `/c2ai-api/api/v1/levin/dashboard/{section}`

### 6. DECISION TIMELINE
- **Archivo Principal:** `C2AIDecisionTimeline.tsx`
- **Completitud:** 55% → 100% (pendiente API)
- **Métricas:** Events, AI Recommendations, Expected vs Actual
- **API:** `/c2ai-api/api/v1/decisions/timeline/{section}`

---

## 📊 Estado de Implementación

| Layer | Estado Actual | Meta | Progreso |
|-------|---------------|------|----------|
| Friston | 95% | 100% | 🟢 |
| Hoffman | 95% | 100% | 🟢 |
| Penrose | 40% | 100% | 🟡 |
| Watson | 95% | 100% | 🟢 |
| Levin | 90% | 100% | 🟢 |
| Decision | 55% | 100% | 🟡 |
| **TOTAL** | **78%** | **100%** | 🟡 |

---

## 🔧 Uso

### Importar componentes principales:

```typescript
// Friston Layer
import { FristonLayerDashboard } from './components/c2ai-explainability/FristonLayerDashboard';

// Hoffman Layer
import { HoffmanDashboard } from './components/c2ai-explainability/HoffmanDashboard';

// Watson Layer
import { WatsonOptimizerDashboard } from './components/watson/WatsonOptimizerDashboard';

// Levin Layer
import { LevinLayerDashboard } from './components/levin/LevinLayerDashboard';
```

---

## 📚 Documentación

- **Documento Maestro:** `DR_CITRUSMAX_AI_DOCUMENTO_MAESTRO_UNIFICADO_v12.md`
- **Sección 64:** Plan Maestro Implementación C²AI Framework 100%
- **Papers Académicos:**
  - `C2AI_Academic_Paper.md`
  - `C2AI_PhD_Paper_v1.0.md`

---

## 🔄 Historial de Cambios

Ver `CHANGELOG.md` para el historial completo.

---

**Autor:** Dr. CitrusMax AI PhD System  
**Fecha:** 9 Enero 2026
