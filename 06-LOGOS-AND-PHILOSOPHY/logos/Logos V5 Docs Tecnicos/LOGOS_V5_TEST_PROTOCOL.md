# LOGOS v5.0 — Protocolo de Pruebas Exhaustivo

> **Documento:** QA-V5-001  
> **Filosofía:** "Gate de Calidad Modular"  
> **Regla fundamental:** NINGUNA fase avanza sin pasar el 100% de su protocolo.  
> **Pipeline:** IMPLEMENTAR → UNIT TESTS → INTEGRATION TESTS → E2E VALIDATION → GATE PASS/FAIL

---

## Invariantes Globales (validar en CADA gate)

| # | Invariante | Verificación |
|---|-----------|-------------|
| I1 | Λ-First | Lambda se computa SIEMPRE primero en el pipeline |
| I2 | Additive-Only | Ninguna función existente fue modificada |
| I3 | CSS Preservation | Estilos existentes intactos (zero visual regression) |
| I4 | Weight Normalization | Σw_i = 1.00 en todos los weight vectors |
| I5 | Build Clean | `npm run build` compila con 0 errors y 0 warnings |
| I6 | Existing Tests Pass | Los 707 tests existentes siguen pasando al 100% |

---

## GATE 1 — FASE 2: Protocol Engine (`src/core/protocol-engine.ts`)

### Unit Tests

| Test ID | Función | Caso | Expected |
|---------|---------|------|----------|
| PE-01 | `computeERS` | All 0.5 inputs | ERS = 0.425 (0.35×0.5 + 0.25×0.5 + 0.25×0.5 + 0.15×0.5) |
| PE-02 | `computeERS` | All 1.0 inputs (entropy=1→1-1=0) | ERS = 0.85 |
| PE-03 | `computeERS` | All 0.0 inputs (entropy=0→1-0=1) | ERS = 0.15 |
| PE-04 | `computeERS` | Output clamped ∈ [0,1] | Always true |
| PE-05 | `computeOddsRatio` | a=10,b=5,c=3,d=12 | OR > 1.0, CI computed |
| PE-06 | `computeOddsRatio` | Zero cells (Haldane correction) | No NaN/Infinity |
| PE-07 | `computeOddsRatio` | Equal cells a=b=c=d=10 | OR ≈ 1.0 |
| PE-08 | `wilsonCI` | 0 successes, 0 total | { proportion:0, lower:0, upper:0, n:0 } |
| PE-09 | `wilsonCI` | 50 successes, 100 total | proportion=0.5, CI symmetric |
| PE-10 | `wilsonCI` | 100 successes, 100 total | proportion=1.0, upper≤1.0 |
| PE-11 | `computeBF10` | Equal cells | BF10 ≈ 1 (no evidence) |
| PE-12 | `computeBF10` | Strong association | BF10 > 3 |
| PE-13 | `computeBF10` | All zeros | BF10 = 1 (fallback) |
| PE-14 | `projectToSimplex` | Already normalized | Sum = 1.0 |
| PE-15 | `projectToSimplex` | Negative values | All ≥ 0.001, Sum = 1.0 |
| PE-16 | `projectToSimplex` | All zeros | Uniform distribution |
| PE-17 | `dirichletLogPdf` | Uniform α | Returns finite number |
| PE-18 | `computeLogLikelihood` | Empty events | Returns 0 |
| PE-19 | `computeLogLikelihood` | Single event | Returns finite negative |
| PE-20 | `safetyCheck` | Identical weights | All 3 checks pass |
| PE-21 | `safetyCheck` | Wild deviation | Impedance fails |
| PE-22 | `calibrateWeights` | < 30 events | Returns valid result |
| PE-23 | `calibrateWeights` | THEORETICAL_WEIGHTS as input | Output ≈ input |
| PE-24 | `calibrateWeights` | Safety check passed | result.passed = true |
| PE-25 | `computeH1Stats` | Empty events | Contingency all zeros |
| PE-26 | `computeH1Stats` | All high ERS + emergence | a=N, b=c=d=0 |
| PE-27 | `normalCDF` | x=0 | ≈ 0.5 |
| PE-28 | `normalCDF` | x=1.96 | ≈ 0.975 |
| PE-29 | `normalCDF` | x=-3 | ≈ 0.0013 |
| PE-30 | `computeGAF` | lambda=0.5, ers=0.5 | = 1.0 |
| PE-31 | `computeGAF` | Clamped ∈ [0.5, 4.0] | Always true |
| PE-32 | `computeSNR` | lambda=0.8, entropy=0.2 | SNR > 0 |
| PE-33 | `computeSNR` | lambda=0.2, entropy=0.8 | SNR < 0 |
| PE-34 | `THEORETICAL_WEIGHTS` | Sum of all values | = 1.00 |
| PE-35 | `EMERGENCE_TAXONOMY` | Has 6 categories | E1-E6 all present |

**Gate Criterion:** 35/35 tests pass → GATE 1 PASS

---

## GATE 2 — FASES 3-5: Hook + EmergenceReporter + LogosHumano Integration

### Integration Tests

| Test ID | Scope | Caso | Expected |
|---------|-------|------|----------|
| INT-01 | EmergenceReporter | Renders when visible=true | Modal appears |
| INT-02 | EmergenceReporter | Hidden when visible=false | Returns null |
| INT-03 | EmergenceReporter | 6 category buttons render | All E1-E6 present |
| INT-04 | EmergenceReporter | Click category → detail step | Step transitions |
| INT-05 | EmergenceReporter | Impact slider 1-10 | Value updates correctly |
| INT-06 | EmergenceReporter | Submit calls onSubmit | Callback fired with args |
| INT-07 | EmergenceReporter | Skip calls onSkip | Callback fired |
| INT-08 | EmergenceReporter | Close button works | onClose called |
| INT-09 | LogosHumano | ERS computed after existing metrics | Value ∈ [0,1] |
| INT-10 | LogosHumano | ERS card renders in metrics bar | Visible in DOM |
| INT-11 | LogosHumano | Existing metric cards unchanged | All Λ,V,S,C,F,Ω present |
| INT-12 | LogosHumano | CSS animations preserved | ANIM_STYLES intact |
| INT-13 | LogosHumano | Tab navigation works | All tabs render |
| INT-14 | Build | `npm run build` | 0 errors |

**Gate Criterion:** 14/14 tests pass → GATE 2 PASS

---

## GATE 3 — FASE 9: Emergence Metrics + Visualizations

### Unit Tests (emergence-metrics.ts)

| Test ID | Función | Caso | Expected |
|---------|---------|------|----------|
| EM-01 | `computeEmergenceIndex` | No previous state | value=0.5, interpretation='Stable' |
| EM-02 | `computeEmergenceIndex` | Identical states | variance≈0, value high |
| EM-03 | `computeEmergenceIndex` | Diverging states | value < 0.45 |
| EM-04 | `computeMultiScaleLambda` | Default state (all 0.5) | All byDomain ≈ 0.5 |
| EM-05 | `computeMultiScaleLambda` | One domain high | strongest = that domain |
| EM-06 | `computeMultiScaleLambda` | spread calculation | max-min correct |
| EM-07 | `computeCriticalityAlert` | No previous data | active=false |
| EM-08 | `computeCriticalityAlert` | Stable coherence | severity='none' |
| EM-09 | `computeCriticalityAlert` | Collapsing coherence | severity='critical' |
| EM-10 | `computeEnergyLandscape` | λ=0.85, S=0.10 | nearestAttractor='A_plus' |
| EM-11 | `computeEnergyLandscape` | λ=0.10, S=0.85 | nearestAttractor='A_minus' |
| EM-12 | `computeEnergyLandscape` | λ=0.35, S=0.50 | nearestAttractor='separatrix' |
| EM-13 | `computeCoherenceMatrix` | Default state | 7×7 matrix, diagonal=1.0 |
| EM-14 | `computeCoherenceMatrix` | Strongest/weakest identified | Non-null tuples |
| EM-15 | `computeShannonSNR` | High Λ, low S | quality='Señal Clara' |
| EM-16 | `computeShannonSNR` | Low Λ, high S | quality='Canal Ruidoso' |
| EM-17 | `DOMAIN_DEFINITIONS` | 7 domains present | physical→alimento |
| EM-18 | `DOMAIN_DEFINITIONS` | Each has 4 dims | 28 total |

### Component Tests

| Test ID | Component | Caso | Expected |
|---------|-----------|------|----------|
| VIS-01 | EnergyLandscapeMap | Renders canvas | Canvas element present |
| VIS-02 | SNRGauge | Shows quality text | Text visible |
| VIS-03 | MultiScaleLambdaCard | Shows 7 domain bars | 7 entries |
| VIS-04 | CriticalityAlertBanner | null alert | Returns null |
| VIS-05 | CriticalityAlertBanner | Critical alert | Red banner visible |
| VIS-06 | CoherenceMatrixHeatmap | Renders 7×7 grid | 49 cells |
| VIS-07 | EmergenceIndexCard | Shows interpretation | Text visible |
| VIS-08 | MonteCarloAnimation | Renders canvas | Canvas element present |

**Gate Criterion:** 26/26 tests pass → GATE 3 PASS

---

## FINAL GATE — E2E Validation

| Test ID | Scope | Verificación |
|---------|-------|-------------|
| E2E-01 | Build | `npm run build` = 0 errors |
| E2E-02 | Existing tests | All 547 existing tests pass |
| E2E-03 | New tests | All new tests pass (35 + 14 + 26 = 75) |
| E2E-04 | Visual regression | App loads, all tabs work, CSS intact |
| E2E-05 | ERS displays | ERS metric card visible in dashboard |
| E2E-06 | Motor tab | Energy Landscape, Multi-Scale Λ, SNR, E(x), Matrix visible |
| E2E-07 | Additive check | No existing functions modified |
| E2E-08 | Λ-First | Lambda still computed first in pipeline |

**Gate Criterion:** 8/8 pass → FINAL GATE PASS → Ready for deploy

---

*Cadena Strategic Systems © 2026*
