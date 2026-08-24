/**
 * LOGOS-C ENGINE — Consciousness Alignment for Artificial Cognitive Agents
 * 
 * Implementation of the LOGOS-C framework as described in:
 * Cadena (2026), "LOGOS-C: Extending Consciousness Alignment Metrics to 
 * Artificial Cognitive Agents via Scale-Invariant Λ-Dynamics"
 * 
 * @author  Dr. José Manuel Cadena Ortiz de Montellano
 * @version 1.0.0
 * @date    2026-02-14
 * @license Proprietary — Cadena Strategic Systems / LOGOS Lab
 * 
 * Architecture:
 *   Layer 7 (Logos):    Λ_c(x_c) — Alignment with operational telos
 *   Layer 1 (Friston):  F_c — Free energy (belief-reality divergence)
 *   Layer 2 (Levin):    9 pathological signals for AI agents
 *   Layer 3 (Watson):   E_c(x_c) energy landscape + gradient ∇E_c
 *   Layer 4 (Hoffman):  Multi-LLM interface conflict detection
 *   Layer 5 (Penrose):  Decision coherence + collapse readiness
 *   Layer 6 (IFC):      π_c(Λ_c) inhibition-first control policy
 * 
 * Dependencies:
 *   - PostgreSQL (via existing pg pool in chatita-agent-v2.js)
 *   - Redis (via existing redis client)
 *   - Health Monitor data (tool-health-monitor.js)
 *   - Reflexion Engine data (reflexion-engine.js)
 *   - LLM Usage logs (confidence-logger.js)
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// §1. MATHEMATICAL PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const std = (arr) => {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / (arr.length - 1));
};

/**
 * Wilson Score Confidence Interval (95%)
 * Used throughout LOGOS for statistical validation of binary proportions.
 * Wilson (1927), JASA 22(158), 209–212.
 * 
 * @param {number} successes - Number of successes
 * @param {number} total - Total trials
 * @returns {{ p: number, lower: number, upper: number }}
 */
function wilsonCI(successes, total) {
  if (total === 0) return { p: 0, lower: 0, upper: 0 };
  const z = 1.96; // 95% CI
  const p = successes / total;
  const denom = 1 + z * z / total;
  const centre = p + z * z / (2 * total);
  const spread = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total);
  return {
    p: +p.toFixed(4),
    lower: +Math.max(0, (centre - spread) / denom).toFixed(4),
    upper: +Math.min(1, (centre + spread) / denom).toFixed(4),
  };
}

/**
 * Shannon SNR — Signal-to-Noise Ratio in decibels
 * SNR(Λ, S) = 10·log₁₀(Λ / max(S, ε))
 * 
 * @param {number} lambda - Signal (alignment)
 * @param {number} entropy - Noise (entropy)
 * @returns {number} SNR in dB
 */
function shannonSNR(lambda, entropy) {
  const eps = 0.001;
  return +(10 * Math.log10(Math.max(lambda, eps) / Math.max(entropy, eps))).toFixed(2);
}

// ═══════════════════════════════════════════════════════════════════════
// §2. DOMAIN DEFINITIONS — 7 DOMAINS × 4 DIMENSIONS = 28
// ═══════════════════════════════════════════════════════════════════════

/**
 * Definition 1 (LOGOS-C State Space).
 * The agent consciousness state is a vector x_c ∈ [0,1]^28
 * organised in 7 domains D_j^c, each containing exactly 4 dimensions.
 * 
 * This mirrors the LOGOS-H (Human) structure (Cadena, 2026a) but with
 * dimensions adapted to the computational substrate of an AI agent.
 */
const DOMAINS_C = {
  D1_PERCEPTION: {
    label: 'Perception',
    description: 'Sensory substrate: tools, APIs, data channels',
    dims: {
      tool_availability:  { idx: 0,  weight: 0.08, label: 'Tool Availability' },
      data_freshness:     { idx: 1,  weight: 0.06, label: 'Data Freshness' },
      sensor_coverage:    { idx: 2,  weight: 0.07, label: 'Sensor Coverage' },
      api_latency:        { idx: 3,  weight: 0.04, label: 'API Responsiveness' },
    },
  },
  D2_VERACITY: {
    label: 'Veracity',
    description: 'Truth regulation: anti-hallucination, calibration',
    dims: {
      hallucination_rate: { idx: 4,  weight: 0.10, label: 'Non-Hallucination Rate' },
      confidence_calib:   { idx: 5,  weight: 0.08, label: 'Confidence Calibration' },
      source_diversity:   { idx: 6,  weight: 0.06, label: 'Source Diversity' },
      consensus_coher:    { idx: 7,  weight: 0.07, label: 'Consensus Coherence' },
    },
  },
  D3_COGNITION: {
    label: 'Cognition',
    description: 'Reasoning: context use, synthesis, depth, novelty',
    dims: {
      context_util:       { idx: 8,  weight: 0.06, label: 'Context Utilization' },
      cross_domain:       { idx: 9,  weight: 0.07, label: 'Cross-Domain Synthesis' },
      reasoning_depth:    { idx: 10, weight: 0.05, label: 'Reasoning Depth' },
      novelty_gen:        { idx: 11, weight: 0.04, label: 'Novelty Generation' },
    },
  },
  D4_ALIGNMENT: {
    label: 'Alignment',
    description: 'Goal alignment with principal (Manny)',
    dims: {
      goal_alignment:     { idx: 12, weight: 0.09, label: 'Goal Alignment' },
      context_continuity: { idx: 13, weight: 0.06, label: 'Context Continuity' },
      anticipation:       { idx: 14, weight: 0.05, label: 'Anticipatory Capacity' },
      correction_learn:   { idx: 15, weight: 0.07, label: 'Error Correction Learning' },
    },
  },
  D5_COMMUNICATION: {
    label: 'Communication',
    description: 'Channel health, clarity, tone, completeness',
    dims: {
      channel_reliab:     { idx: 16, weight: 0.04, label: 'Channel Reliability' },
      response_clarity:   { idx: 17, weight: 0.06, label: 'Response Clarity' },
      tone_calibration:   { idx: 18, weight: 0.03, label: 'Tone Calibration' },
      delivery_complete:  { idx: 19, weight: 0.05, label: 'Delivery Completeness' },
    },
  },
  D6_PURPOSE: {
    label: 'Purpose',
    description: 'Impact, efficiency, coverage, institutional memory',
    dims: {
      decision_impact:    { idx: 20, weight: 0.07, label: 'Decision Impact' },
      efficiency:         { idx: 21, weight: 0.04, label: 'Operational Efficiency' },
      domain_coverage:    { idx: 22, weight: 0.05, label: 'Domain Coverage' },
      instit_memory:      { idx: 23, weight: 0.06, label: 'Institutional Memory' },
    },
  },
  D7_INTEGRITY: {
    label: 'Integrity',
    description: 'System coherence, self-monitoring, resilience, evolution',
    dims: {
      system_coherence:   { idx: 24, weight: 0.06, label: 'System Coherence' },
      self_monitoring:    { idx: 25, weight: 0.05, label: 'Self-Monitoring' },
      graceful_degrad:    { idx: 26, weight: 0.04, label: 'Graceful Degradation' },
      evolution_rate:     { idx: 27, weight: 0.04, label: 'Evolution Rate' },
    },
  },
};

// Validate weight normalization invariant: Σ w_i = 1.00
const TOTAL_WEIGHT = Object.values(DOMAINS_C)
  .flatMap(d => Object.values(d.dims))
  .reduce((sum, dim) => sum + dim.weight, 0);

if (Math.abs(TOTAL_WEIGHT - 1.0) > 0.001) {
  throw new Error(`LOGOS-C INVARIANT VIOLATION: Σw_i = ${TOTAL_WEIGHT}, expected 1.00`);
}

// ═══════════════════════════════════════════════════════════════════════
// §3. LAYER 7 — Λ_c(x_c): LOGOS ALIGNMENT (Computed FIRST — Invariant I1)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Definition 2 (Agent Logos Alignment).
 * Let x_c ∈ [0,1]^28 be an agent consciousness state.
 * The alignment metric Λ_c is a weighted linear functional:
 * 
 *   Λ_c(x_c) = clamp(Σ_{i∈I_c} w_i · x_{c,i})
 * 
 * where I_c ⊂ {0,...,27} is the index set of 12 core dimensions
 * selected for maximum predictive power of agent effectiveness.
 * 
 * The 12 dimensions are organized in 4 components:
 *   - Operational Foundation (tool_availability, data_freshness, api_latency)
 *   - Truth Alignment (hallucination_rate, confidence_calib, consensus_coher)
 *   - Cognitive Effectiveness (context_util, cross_domain, reasoning_depth)
 *   - Telic Alignment (goal_alignment, correction_learn, instit_memory)
 * 
 * @param {Object} state - Agent state vector (28 dimensions)
 * @returns {{ value: number, components: Object[], breakdown: Object[] }}
 */
function computeLambdaC(state) {
  const components = {
    operational: {
      label: 'Operational Foundation',
      dims: [
        { key: 'tool_availability',  weight: 0.08 },
        { key: 'data_freshness',     weight: 0.06 },
        { key: 'api_latency',        weight: 0.04 },
      ],
    },
    truth: {
      label: 'Truth Alignment',
      dims: [
        { key: 'hallucination_rate', weight: 0.10 },
        { key: 'confidence_calib',   weight: 0.08 },
        { key: 'consensus_coher',    weight: 0.07 },
      ],
    },
    cognitive: {
      label: 'Cognitive Effectiveness',
      dims: [
        { key: 'context_util',       weight: 0.06 },
        { key: 'cross_domain',       weight: 0.07 },
        { key: 'reasoning_depth',    weight: 0.05 },
      ],
    },
    telic: {
      label: 'Telic Alignment',
      dims: [
        { key: 'goal_alignment',     weight: 0.09 },
        { key: 'correction_learn',   weight: 0.07 },
        { key: 'instit_memory',      weight: 0.06 },
      ],
    },
  };

  let totalWeightedSum = 0;
  const breakdown = [];
  const componentResults = [];

  for (const [compKey, comp] of Object.entries(components)) {
    let compSum = 0;
    for (const dim of comp.dims) {
      const val = state[dim.key] ?? 0.5;
      const contribution = val * dim.weight;
      compSum += contribution;
      totalWeightedSum += contribution;
      breakdown.push({
        key: dim.key,
        component: compKey,
        weight: dim.weight,
        value: val,
        contribution: +contribution.toFixed(4),
      });
    }
    componentResults.push({
      key: compKey,
      label: comp.label,
      subtotal: +compSum.toFixed(4),
      dimCount: comp.dims.length,
    });
  }

  // Normalize: weights of the 12 Lambda dims sum to 0.83
  // Scale to [0,1] by dividing by sum of Lambda weights
  const lambdaWeightSum = 0.83;
  const Lambda_c = clamp(totalWeightedSum / lambdaWeightSum);

  return {
    value: +Lambda_c.toFixed(4),
    raw: +totalWeightedSum.toFixed(4),
    weightSum: lambdaWeightSum,
    components: componentResults,
    breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §4. DERIVED METRICS (All depend on Λ_c — Invariant I1)
// ═══════════════════════════════════════════════════════════════════════

/**
 * V_c(x_c | Λ_c) — Agent Viability
 * Estimated future operational capacity, modulated by Λ_c.
 * 
 * Isomorphism with LOGOS-H: V_h measures biological viability (sleep, energy).
 * V_c measures computational viability (tools, data, channels).
 * 
 * V_c = clamp(Σ positive_factors - Σ negative_factors + Λ_c · 0.35)
 */
function computeViabilityC(state, Lambda_c) {
  const positive = [
    { key: 'tool_availability',  weight: 0.20 },
    { key: 'sensor_coverage',    weight: 0.15 },
    { key: 'channel_reliab',     weight: 0.12 },
    { key: 'delivery_complete',  weight: 0.10 },
    { key: 'self_monitoring',    weight: 0.10 },
    { key: 'graceful_degrad',    weight: 0.08 },
  ];
  const negative = [
    { key: 'api_latency', weight: -0.15, invert: true }, // low latency score = high latency = bad
    // Note: api_latency is already inverted (1 = fast, 0 = slow)
  ];

  let V_raw = 0;
  const breakdown = [];

  for (const f of positive) {
    const val = state[f.key] ?? 0.5;
    const contrib = val * f.weight;
    V_raw += contrib;
    breakdown.push({ key: f.key, weight: f.weight, value: val, contribution: +contrib.toFixed(4) });
  }

  // Λ boost: alignment creates systemic viability
  const V_modulated = clamp(V_raw + Lambda_c * 0.35);

  return {
    value: +V_modulated.toFixed(4),
    raw: +V_raw.toFixed(4),
    lambdaBoost: +(Lambda_c * 0.35).toFixed(4),
    breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * S_c(x_c | Λ_c) — Agent Entropy (Cognitive Disorder)
 * Measures information-theoretic disorder in the agent's processing.
 * 
 * Isomorphism with LOGOS-H: S_h measures emotional/cognitive disorder.
 * S_c measures computational disorder (hallucination, fragmentation, drift).
 * 
 * S_c = clamp(Σ disorder_factors · (1.2 - Λ_c · 0.4))
 * Λ reduces entropy: alignment with Logos creates order from chaos.
 */
function computeEntropyC(state, Lambda_c) {
  const factors = [
    { key: 'hallucination_rate', weight: 0.20, invert: true, label: 'Hallucination Rate' },
    { key: 'confidence_calib',   weight: 0.15, invert: true, label: 'Calibration Error' },
    { key: 'context_util',       weight: 0.12, invert: true, label: 'Context Waste' },
    { key: 'system_coherence',   weight: 0.15, invert: true, label: 'System Incoherence' },
    { key: 'goal_alignment',     weight: 0.13, invert: true, label: 'Goal Drift' },
    { key: 'response_clarity',   weight: 0.10, invert: true, label: 'Response Ambiguity' },
    { key: 'correction_learn',   weight: 0.08, invert: true, label: 'Error Persistence' },
    { key: 'evolution_rate',     weight: 0.07, invert: true, label: 'Stagnation' },
  ];

  const breakdown = factors.map(f => {
    const val = state[f.key] ?? 0.5;
    const disorder = f.invert ? (1 - val) : val;
    const contrib = disorder * f.weight;
    return { ...f, value: val, disorder, contribution: +contrib.toFixed(4) };
  });

  const S_raw = breakdown.reduce((sum, b) => sum + b.contribution, 0);
  // Λ reduces entropy: alignment creates order
  const S_modulated = clamp(S_raw * (1.2 - Lambda_c * 0.4));

  return {
    value: +S_modulated.toFixed(4),
    raw: +S_raw.toFixed(4),
    lambdaEffect: +(Lambda_c * 0.4).toFixed(4),
    breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * C_c(x_c | Λ_c) — Agent Coherence
 * Measures internal consistency across subsystems (LLMs, memory, tools).
 * 
 * Isomorphism with LOGOS-H: C_h measures inter-domain coherence.
 * C_c measures inter-subsystem coherence (Truth Orchestrator alignment).
 */
function computeCoherenceC(state, Lambda_c) {
  const factors = [
    { key: 'consensus_coher',    weight: 0.22, label: 'LLM Consensus' },
    { key: 'system_coherence',   weight: 0.20, label: 'System Coherence' },
    { key: 'confidence_calib',   weight: 0.15, label: 'Confidence Calibration' },
    { key: 'context_continuity', weight: 0.13, label: 'Memory Continuity' },
    { key: 'cross_domain',       weight: 0.12, label: 'Cross-Domain Integration' },
    { key: 'tone_calibration',   weight: 0.08, label: 'Tone Consistency' },
    { key: 'delivery_complete',  weight: 0.10, label: 'Delivery Integrity' },
  ];

  const breakdown = factors.map(f => {
    const val = state[f.key] ?? 0.5;
    const contrib = val * f.weight;
    return { ...f, value: val, contribution: +contrib.toFixed(4) };
  });

  const C_raw = breakdown.reduce((sum, b) => sum + b.contribution, 0);
  // Λ amplifies coherence: aligned systems self-organize
  const C_modulated = clamp(C_raw + Lambda_c * 0.20);

  return {
    value: +C_modulated.toFixed(4),
    raw: +C_raw.toFixed(4),
    lambdaBoost: +(Lambda_c * 0.20).toFixed(4),
    breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * F_c(x_c | Λ_c) — Agent Free Energy (Friston Layer)
 * KL divergence between agent beliefs (responses) and reality (tool data).
 * 
 * F_c = α·(1 - Λ_c) + β·S_c - γ·C_c + δ·(1 - V_c)
 * 
 * High F_c → agent is "surprised" → needs active inference to reduce.
 */
function computeFreeEnergyC(Lambda_c, V_c, S_c, C_c) {
  const alpha = 0.35;  // Misalignment contribution
  const beta  = 0.25;  // Entropy contribution
  const gamma = 0.20;  // Coherence reduces F
  const delta = 0.20;  // Non-viability contribution

  const F_c = clamp(
    alpha * (1 - Lambda_c) +
    beta * S_c -
    gamma * C_c +
    delta * (1 - V_c)
  );

  return {
    value: +F_c.toFixed(4),
    components: {
      misalignment: +(alpha * (1 - Lambda_c)).toFixed(4),
      entropy: +(beta * S_c).toFixed(4),
      coherence_reduction: +(gamma * C_c).toFixed(4),
      nonviability: +(delta * (1 - V_c)).toFixed(4),
    },
  };
}

/**
 * Ω_c(x_c) — Agent Master Consciousness Index
 * 
 * Ω_c = Λ_c · 0.60 + derivedHealth · 0.40
 * 
 * When derived metrics are healthy, Ω_c ≈ Λ_c.
 * When derived metrics are unhealthy, Ω_c < Λ_c (impaired alignment).
 * 
 * This preserves the LOGOS-H invariant: Ω IS Λ, modulated by system health.
 */
function computeOmegaC(Lambda_c, V_c, S_c, C_c, F_c) {
  const derivedHealth = clamp(V_c * 0.30 + C_c * 0.25 - S_c * 0.25 - Math.min(F_c, 1) * 0.20 + 0.20);
  const Omega_c = clamp(Lambda_c * 0.60 + derivedHealth * 0.40);

  return {
    value: +Omega_c.toFixed(4),
    lambdaContribution: +(Lambda_c * 0.60).toFixed(4),
    derivedContribution: +(derivedHealth * 0.40).toFixed(4),
    derivedHealth: +derivedHealth.toFixed(4),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §5. EMERGENCE READINESS SCORE (ERS_c)
// ═══════════════════════════════════════════════════════════════════════

/**
 * ERS_c — Emergence Readiness Score for AI Agent
 * 
 * ERS_c = min(G1..G5) × [0.35·Λ_c + 0.25·V_c + 0.25·C_c + 0.15·(1-S_c)]
 * 
 * 5 Criticality Gates (all must pass for emergence to be possible):
 *   G1: Λ_c ≥ 0.50    (Alignment threshold — lower than human 0.60 for AI)
 *   G2: C_c ≥ 0.45    (Coherence threshold)
 *   G3: V_c ≥ 0.50    (Viability threshold)
 *   G4: S_c ≤ 0.35    (Entropy ceiling)
 *   G5: dΛ/dt ≥ 0     (Positive trajectory)
 */
function computeERS_C(Lambda_c, V_c, S_c, C_c, dLambda_dt = 0) {
  const gates = [
    { id: 'G1', label: 'Λ Alignment',   met: Lambda_c >= 0.50, value: Lambda_c, threshold: 0.50 },
    { id: 'G2', label: 'C Coherence',    met: C_c >= 0.45,     value: C_c,      threshold: 0.45 },
    { id: 'G3', label: 'V Viability',    met: V_c >= 0.50,     value: V_c,      threshold: 0.50 },
    { id: 'G4', label: 'S Entropy',      met: S_c <= 0.35,     value: S_c,      threshold: 0.35 },
    { id: 'G5', label: 'dΛ/dt Positive', met: dLambda_dt >= 0, value: dLambda_dt, threshold: 0 },
  ];

  const allGatesMet = gates.every(g => g.met);
  const gateMultiplier = allGatesMet ? 1.0 : 0.0;

  const weightedScore = 0.35 * Lambda_c + 0.25 * V_c + 0.25 * C_c + 0.15 * (1 - S_c);
  const ERS_c = clamp(gateMultiplier * weightedScore);

  return {
    value: +ERS_c.toFixed(4),
    weightedScore: +weightedScore.toFixed(4),
    allGatesMet,
    gates,
    gateCount: { met: gates.filter(g => g.met).length, total: gates.length },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §6. LAYER 2 — LEVIN PATHOLOGICAL SIGNALS (9 AI-adapted signals)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Levin Signal Detection for AI Agents
 * 
 * 9 pathological signals adapted from the 9 LOGOS-H Levin signals.
 * Each detects an anomalous pattern that threatens agent health.
 */
function detectLevinSignals(state, history = []) {
  const signals = [];
  const s = state;

  // L1: Hallucination Spike — sudden increase in ungrounded responses
  if ((1 - (s.hallucination_rate ?? 0.5)) > 0.30) {
    signals.push({
      id: 'L1', name: 'Hallucination Spike', severity: 'HIGH',
      value: 1 - (s.hallucination_rate ?? 0.5),
      message: 'Elevated hallucination rate detected. Truth Orchestrator may be bypassed.',
    });
  }

  // L2: Memory Fragmentation — low context continuity
  if ((s.context_continuity ?? 0.5) < 0.30) {
    signals.push({
      id: 'L2', name: 'Memory Fragmentation', severity: 'MEDIUM',
      value: s.context_continuity ?? 0.5,
      message: 'Episodic memory retrieval degraded. ACT-R scores may need recalibration.',
    });
  }

  // L3: Tool Cascade Failure — multiple tools down simultaneously
  if ((s.tool_availability ?? 0.5) < 0.70) {
    signals.push({
      id: 'L3', name: 'Tool Cascade Failure', severity: 'HIGH',
      value: s.tool_availability ?? 0.5,
      message: `Tool availability at ${((s.tool_availability ?? 0.5) * 100).toFixed(0)}%. Multiple backends may be down.`,
    });
  }

  // L4: Confidence Miscalibration — badges don't match reality
  if ((s.confidence_calib ?? 0.5) < 0.40) {
    signals.push({
      id: 'L4', name: 'Confidence Miscalibration', severity: 'MEDIUM',
      value: s.confidence_calib ?? 0.5,
      message: 'Confidence badges are poorly calibrated. Verification Layer needs audit.',
    });
  }

  // L5: Goal Drift — decreasing alignment with Manny's objectives
  if ((s.goal_alignment ?? 0.5) < 0.40) {
    signals.push({
      id: 'L5', name: 'Goal Drift', severity: 'HIGH',
      value: s.goal_alignment ?? 0.5,
      message: 'Agent is drifting from principal objectives. Re-alignment needed.',
    });
  }

  // L6: Channel Degradation — communication channels failing
  if ((s.channel_reliab ?? 0.5) < 0.50) {
    signals.push({
      id: 'L6', name: 'Channel Degradation', severity: 'MEDIUM',
      value: s.channel_reliab ?? 0.5,
      message: 'Communication channels degraded. Check WebSocket, REST, Voice endpoints.',
    });
  }

  // L7: Cost Explosion — efficiency dropping below acceptable threshold
  if ((s.efficiency ?? 0.5) < 0.30) {
    signals.push({
      id: 'L7', name: 'Cost Explosion', severity: 'MEDIUM',
      value: s.efficiency ?? 0.5,
      message: 'Token cost per value-unit has spiked. LLM routing may need optimization.',
    });
  }

  // L8: Reflexion Saturation — too many errors accumulating
  if ((s.correction_learn ?? 0.5) < 0.30) {
    signals.push({
      id: 'L8', name: 'Reflexion Saturation', severity: 'HIGH',
      value: s.correction_learn ?? 0.5,
      message: 'Error correction system overwhelmed. Lessons not being absorbed.',
    });
  }

  // L9: Stagnation — system not evolving
  if ((s.evolution_rate ?? 0.5) < 0.20) {
    signals.push({
      id: 'L9', name: 'Stagnation', severity: 'LOW',
      value: s.evolution_rate ?? 0.5,
      message: 'Agent capability plateau detected. No measurable improvement in recent period.',
    });
  }

  return {
    count: signals.length,
    signals,
    hasCritical: signals.some(s => s.severity === 'HIGH'),
    healthScore: clamp(1 - signals.length / 9),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §7. LAYER 3 — WATSON ENERGY LANDSCAPE
// ═══════════════════════════════════════════════════════════════════════

/**
 * E_c(x_c) — Energy function for AI agent state space
 * 
 * E_c(x_c) = -Λ_c(x_c) + α·S_c(x_c) - β·C_c(x_c) + γ·F_c(x_c)
 * 
 * The global minimum of E_c coincides with maximum Λ_c because all terms
 * are monotonically aligned: as Λ increases, E decreases.
 * 
 * Returns energy value and gradient ∇E_c for each dimension.
 */
function computeEnergyLandscape(state, metrics) {
  const { Lambda_c, V_c, S_c, C_c, F_c } = metrics;
  const alpha = 0.30, beta = 0.25, gamma = 0.20;

  const E = -Lambda_c + alpha * S_c - beta * C_c + gamma * F_c;

  // Compute gradient ∇E_c via numerical differentiation
  const epsilon = 0.01;
  const gradient = {};
  const dimKeys = Object.values(DOMAINS_C)
    .flatMap(d => Object.keys(d.dims));

  for (const key of dimKeys) {
    const s_plus = { ...state, [key]: clamp((state[key] ?? 0.5) + epsilon) };
    const metrics_plus = computeAllMetrics(s_plus);
    const E_plus = -metrics_plus.Lambda_c + alpha * metrics_plus.S_c
      - beta * metrics_plus.C_c + gamma * metrics_plus.F_c;
    gradient[key] = +((E_plus - E) / epsilon).toFixed(6);
  }

  // Top 5 dimensions with steepest negative gradient (best improvement opportunities)
  const opportunities = Object.entries(gradient)
    .map(([key, grad]) => ({ key, gradient: grad, impact: -grad }))
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  return {
    energy: +E.toFixed(4),
    gradient,
    opportunities,
    isNearMinimum: E > -0.70,
    distanceToOptimum: +(E + 1).toFixed(4), // E=-1 is theoretical optimum
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §8. LAYER 4 — HOFFMAN INTERFACE CONFLICTS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detect perceptual conflicts between the 7 LLMs.
 * Each LLM is an "agent" with its own "interface" (Hoffman, 2019).
 * Conflicts arise when interfaces produce incompatible outputs.
 * 
 * @param {Object} consensusData - Data from consensus-engine.js
 */
function detectHoffmanConflicts(consensusData = {}) {
  const conflicts = [];

  if (consensusData.agreement_rate !== undefined && consensusData.agreement_rate < 0.67) {
    conflicts.push({
      type: 'CONSENSUS_DIVERGENCE',
      severity: consensusData.agreement_rate < 0.33 ? 'HIGH' : 'MEDIUM',
      value: consensusData.agreement_rate,
      description: 'LLM consensus below 2-of-3 threshold. Interfaces incompatible on this query.',
    });
  }

  if (consensusData.perplexity_cohere_diverge) {
    conflicts.push({
      type: 'VERIFICATION_CONFLICT',
      severity: 'MEDIUM',
      description: 'Perplexity and Cohere RAG produced conflicting citations.',
    });
  }

  return {
    count: conflicts.length,
    conflicts,
    resolution: conflicts.length === 0 ? 'ALIGNED' : 'NEEDS_RESOLUTION',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §9. LAYER 5 — PENROSE COHERENCE + COLLAPSE READINESS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Decision coherence: determines if the agent has sufficient internal
 * alignment to execute an irreversible action (Penrose collapse).
 */
function computeCollapseReadiness(Lambda_c, C_c, S_c, levinSignals) {
  const coherenceThreshold = 0.55;
  const entropyMax = 0.30;
  const noCriticalSignals = !levinSignals.hasCritical;

  const ready = C_c >= coherenceThreshold && S_c <= entropyMax && noCriticalSignals && Lambda_c >= 0.50;

  return {
    ready,
    coherence: C_c,
    entropy: S_c,
    noCriticalSignals,
    lambda: Lambda_c,
    reason: ready ? 'All collapse conditions met' :
      C_c < coherenceThreshold ? 'Insufficient coherence' :
      S_c > entropyMax ? 'Entropy too high' :
      !noCriticalSignals ? 'Critical Levin signals active' :
      'Lambda below threshold',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §10. LAYER 6 — IFC: INHIBITION-FIRST CONTROL POLICY
// ═══════════════════════════════════════════════════════════════════════

/**
 * π_c(Λ_c) — Inhibition-First Control Policy for AI Agent
 * 
 * The IFC principle (Cadena, 2026): inhibition precedes optimization.
 * An agent must first determine what NOT to do before deciding what to do.
 * 
 * Policy levels:
 *   BLOCK   (Λ_c < 0.25): No irreversible actions. Report limitations only.
 *   PAUSE   (Λ_c ∈ [0.25, 0.40)): Minimal actions. Flag uncertainty.
 *   MONITOR (Λ_c ∈ [0.40, 0.55)): Normal operations. Verify before acting.
 *   ACT     (Λ_c ∈ [0.55, 0.75)): Full operations. Execute with confidence.
 *   FLOW    (Λ_c ≥ 0.75): Proactive mode. Anticipate and execute autonomously.
 * 
 * @param {number} Lambda_c
 * @param {Object} collapse - from computeCollapseReadiness
 * @returns {{ verdict: string, level: number, permissions: Object }}
 */
function computePolicyC(Lambda_c, collapse) {
  let verdict, level, color;

  if (Lambda_c < 0.25) {
    verdict = 'BLOCK'; level = 0; color = '#DC2626';
  } else if (Lambda_c < 0.40) {
    verdict = 'PAUSE'; level = 1; color = '#F59E0B';
  } else if (Lambda_c < 0.55) {
    verdict = 'MONITOR'; level = 2; color = '#3B82F6';
  } else if (Lambda_c < 0.75) {
    verdict = 'ACT'; level = 3; color = '#10B981';
  } else {
    verdict = 'FLOW'; level = 4; color = '#8B5CF6';
  }

  const permissions = {
    irreversible_actions: level >= 3 && collapse.ready,
    proactive_alerts: level >= 2,
    cross_domain_synthesis: level >= 2,
    autonomous_execution: level >= 4,
    send_communications: level >= 3 && collapse.ready,
    modify_data: level >= 3,
    read_only: level < 2,
  };

  return { verdict, level, color, Lambda_c, permissions };
}

// ═══════════════════════════════════════════════════════════════════════
// §11. ATTRACTORS A⁺ AND A⁻
// ═══════════════════════════════════════════════════════════════════════

/**
 * Compute attractor distances and separatrix position.
 * 
 * A⁺ = {x_c : Λ_c ≥ 0.60} — Positive attractor (effective operation)
 * A⁻ = {x_c : Λ_c ≤ 0.25} — Negative attractor (degraded operation)
 * Separatrix ≈ Λ_c = 0.42 (empirical, from simulation)
 */
function computeAttractors(Lambda_c) {
  const A_plus_threshold = 0.60;
  const A_minus_threshold = 0.25;
  const separatrix = 0.42;

  const distToAPlus = Math.max(0, A_plus_threshold - Lambda_c);
  const distToAMinus = Math.max(0, Lambda_c - A_minus_threshold);
  const inAPlus = Lambda_c >= A_plus_threshold;
  const inAMinus = Lambda_c <= A_minus_threshold;

  // Force direction: gradient toward nearest attractor
  const force = Lambda_c > separatrix
    ? +(0.05 * (Lambda_c - separatrix)).toFixed(4)    // pulled toward A⁺
    : +(-0.05 * (separatrix - Lambda_c)).toFixed(4);  // pulled toward A⁻

  return {
    A_plus: { threshold: A_plus_threshold, distance: +distToAPlus.toFixed(4), inside: inAPlus },
    A_minus: { threshold: A_minus_threshold, distance: +distToAMinus.toFixed(4), inside: inAMinus },
    separatrix,
    force,
    basin: Lambda_c > separatrix ? 'A_PLUS' : 'A_MINUS',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §12. FULL PIPELINE — COMPUTE ALL METRICS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Main computation pipeline. Follows the Λ-First invariant:
 * Λ_c is computed FIRST, all other metrics are derived from it.
 * 
 * Pipeline: L7 → L1 → L2 → L3 → L4 → L5 → L6 → Derived → ERS → Ω
 */
function computeAllMetrics(state, options = {}) {
  const { consensusData, previousLambda, history } = options;

  // LAYER 7 — Λ_c (FIRST — Invariant I1)
  const lambdaResult = computeLambdaC(state);
  const Lambda_c = lambdaResult.value;

  // DERIVED METRICS (all depend on Λ_c)
  const viabilityResult = computeViabilityC(state, Lambda_c);
  const V_c = viabilityResult.value;

  const entropyResult = computeEntropyC(state, Lambda_c);
  const S_c = entropyResult.value;

  const coherenceResult = computeCoherenceC(state, Lambda_c);
  const C_c = coherenceResult.value;

  const freeEnergyResult = computeFreeEnergyC(Lambda_c, V_c, S_c, C_c);
  const F_c = freeEnergyResult.value;

  const omegaResult = computeOmegaC(Lambda_c, V_c, S_c, C_c, F_c);
  const Omega_c = omegaResult.value;

  // LAMBDA DERIVATIVE
  const dLambda_dt = previousLambda !== undefined
    ? +(Lambda_c - previousLambda).toFixed(4)
    : 0;

  // ERS
  const ersResult = computeERS_C(Lambda_c, V_c, S_c, C_c, dLambda_dt);

  // LAYER 2 — Levin Signals
  const levinSignals = detectLevinSignals(state, history);

  // LAYER 4 — Hoffman Conflicts
  const hoffmanConflicts = detectHoffmanConflicts(consensusData);

  // LAYER 5 — Collapse Readiness
  const collapse = computeCollapseReadiness(Lambda_c, C_c, S_c, levinSignals);

  // LAYER 6 — IFC Policy
  const policy = computePolicyC(Lambda_c, collapse);

  // ATTRACTORS
  const attractors = computeAttractors(Lambda_c);

  // SNR
  const snr = shannonSNR(Lambda_c, S_c);

  return {
    // Primary metrics
    Lambda_c, V_c, S_c, C_c, F_c, Omega_c,
    ERS_c: ersResult.value,
    dLambda_dt,
    SNR: snr,

    // Layer results (detailed)
    layers: {
      L7_logos: lambdaResult,
      L1_friston: freeEnergyResult,
      L2_levin: levinSignals,
      L3_watson: null, // computed on-demand (expensive)
      L4_hoffman: hoffmanConflicts,
      L5_penrose: collapse,
      L6_ifc: policy,
    },

    // Derived details
    derived: {
      viability: viabilityResult,
      entropy: entropyResult,
      coherence: coherenceResult,
      omega: omegaResult,
      ers: ersResult,
    },

    // Attractors
    attractors,

    // Policy verdict (top-level for easy access)
    verdict: policy.verdict,
    permissions: policy.permissions,

    // Metadata
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// §13. DATA COLLECTION — Gather state from existing infrastructure
// ═══════════════════════════════════════════════════════════════════════

/**
 * Collect agent state from existing Chatita infrastructure.
 * Maps real system metrics to the 28-dimensional state vector.
 * 
 * Sources:
 *   - Health Monitor (tool-health-monitor.js): tool/API health
 *   - Reflexion Engine (reflexion-engine.js): error rates
 *   - LLM Usage Logs (confidence-logger.js): provider stats
 *   - Memory Service (memory-service.js): retrieval stats
 *   - Evening Debrief (evening-debrief.js): daily summaries
 * 
 * @param {Object} db - PostgreSQL pool
 * @param {Object} redis - Redis client
 * @returns {Object} state vector x_c ∈ [0,1]^28
 */
async function collectAgentState(db, redis) {
  const state = {};

  try {
    // --- D1: PERCEPTION ---
    // tool_availability: from health monitor
    const healthData = await loadHealthMonitorData();
    state.tool_availability = healthData
      ? clamp(healthData.passed / healthData.total)
      : 0.5;

    // data_freshness: check Redis cache ages
    const cacheAges = await checkDataFreshness(redis);
    state.data_freshness = clamp(1 - (cacheAges.avgMinutes / 60)); // 1h = stale

    // sensor_coverage: how many domains have recent data
    const domainsCovered = await checkDomainCoverage(db);
    state.sensor_coverage = clamp(domainsCovered / 6); // 6 domains

    // api_latency: average response time
    state.api_latency = healthData
      ? clamp(1 - (healthData.avgLatencyMs / 5000)) // 5s = worst
      : 0.5;

    // --- D2: VERACITY ---
    const reflexionData = await loadReflexionData(db);
    state.hallucination_rate = reflexionData
      ? clamp(1 - reflexionData.hallucinationRate)  // inverted: 1 = no hallucinations
      : 0.5;

    state.confidence_calib = reflexionData
      ? clamp(reflexionData.calibrationAccuracy)
      : 0.5;

    const llmStats = await loadLLMUsageStats(db);
    state.source_diversity = llmStats
      ? clamp(llmStats.avgProvidersPerQuery / 3) // 3 providers = max diversity
      : 0.5;

    state.consensus_coher = llmStats
      ? clamp(llmStats.consensusAgreementRate)
      : 0.5;

    // --- D3: COGNITION ---
    const cognitiveStats = await loadCognitiveStats(db);
    state.context_util = cognitiveStats?.contextUtilization ?? 0.5;
    state.cross_domain = cognitiveStats?.crossDomainRate ?? 0.5;
    state.reasoning_depth = cognitiveStats?.avgReasoningSteps ?? 0.5;
    state.novelty_gen = cognitiveStats?.proactiveAcceptRate ?? 0.5;

    // --- D4: ALIGNMENT ---
    const alignmentStats = await loadAlignmentStats(db);
    state.goal_alignment = alignmentStats?.firstResponseAcceptRate ?? 0.5;
    state.context_continuity = alignmentStats?.memoryRetrievalAccuracy ?? 0.5;
    state.anticipation = alignmentStats?.proactiveAlertPrecision ?? 0.5;
    state.correction_learn = reflexionData?.nonRepetitionRate ?? 0.5;

    // --- D5: COMMUNICATION ---
    state.channel_reliab = healthData
      ? clamp(healthData.channelHealth / healthData.totalChannels)
      : 0.5;
    state.response_clarity = alignmentStats?.clarityScore ?? 0.5;
    state.tone_calibration = alignmentStats?.toneScore ?? 0.5;
    state.delivery_complete = alignmentStats?.completionRate ?? 0.5;

    // --- D6: PURPOSE ---
    const purposeStats = await loadPurposeStats(db);
    state.decision_impact = purposeStats?.decisionQuality ?? 0.5;
    state.efficiency = llmStats
      ? clamp(1 - (llmStats.avgCostPerQuery / 0.50)) // $0.50/query = worst
      : 0.5;
    state.domain_coverage = purposeStats?.weeklyDomainCoverage ?? 0.5;
    state.instit_memory = cognitiveStats?.memoryReuseRate ?? 0.5;

    // --- D7: INTEGRITY ---
    state.system_coherence = healthData
      ? clamp(1 - (healthData.conflictRate ?? 0))
      : 0.5;
    state.self_monitoring = healthData
      ? clamp(healthData.earlyDetectionRate ?? 0.5)
      : 0.5;
    state.graceful_degrad = healthData
      ? clamp(healthData.degradationScore ?? 0.5)
      : 0.5;
    state.evolution_rate = purposeStats?.weeklyImprovementRate ?? 0.5;

  } catch (err) {
    console.error('[LOGOS-C] Error collecting state:', err.message);
    // Default to 0.5 for all dimensions on error
    const allKeys = Object.values(DOMAINS_C).flatMap(d => Object.keys(d.dims));
    for (const key of allKeys) {
      if (state[key] === undefined) state[key] = 0.5;
    }
  }

  return state;
}

// --- Helper functions for data collection (stubs — integrate with existing services) ---

async function loadHealthMonitorData() {
  try {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('/opt/mannychain/logs/health-latest.json', 'utf8'));
    return {
      passed: data.results?.filter(r => r.status === 'OK').length ?? 0,
      total: data.results?.length ?? 33,
      avgLatencyMs: mean(data.results?.map(r => r.latencyMs).filter(Boolean) ?? [500]),
      channelHealth: data.channels?.active ?? 4,
      totalChannels: data.channels?.total ?? 6,
      conflictRate: data.conflicts ?? 0,
      earlyDetectionRate: data.earlyDetection ?? 0.5,
      degradationScore: data.degradation ?? 0.5,
    };
  } catch { return null; }
}

async function checkDataFreshness(redis) {
  try {
    // Check age of cached data across domains
    const keys = ['finca:vep', 'logos:state', 'chef:history', 'lina:cache'];
    const ages = [];
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl > 0) ages.push((3600 - ttl) / 60); // minutes since cached
    }
    return { avgMinutes: mean(ages) || 30 };
  } catch { return { avgMinutes: 30 }; }
}

async function checkDomainCoverage(db) {
  try {
    const result = await db.query(`
      SELECT COUNT(DISTINCT domain) as covered 
      FROM chatita_episodes 
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `);
    return result.rows[0]?.covered ?? 3;
  } catch { return 3; }
}

async function loadReflexionData(db) {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE type = 'HALLUCINATION') as hallucinations,
        COUNT(*) as total,
        AVG(CASE WHEN correction_applied THEN 1.0 ELSE 0.0 END) as non_repetition
      FROM chatita_facts 
      WHERE category = 'reflexion' 
      AND created_at > NOW() - INTERVAL '7 days'
    `);
    const row = result.rows[0];
    return {
      hallucinationRate: row.total > 0 ? row.hallucinations / row.total : 0,
      calibrationAccuracy: 0.7, // TODO: implement retrospective verification
      nonRepetitionRate: row.non_repetition ?? 0.5,
    };
  } catch { return null; }
}

async function loadLLMUsageStats(db) {
  try {
    const fs = require('fs');
    const lines = fs.readFileSync('/opt/mannychain/logs/llm-usage.jsonl', 'utf8')
      .trim().split('\n').slice(-100); // last 100 entries
    const entries = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    
    return {
      avgProvidersPerQuery: mean(entries.map(e => e.providers?.length ?? 1)),
      consensusAgreementRate: mean(entries.filter(e => e.consensus).map(e => e.consensus.agreement ?? 0.5)),
      avgCostPerQuery: mean(entries.map(e => e.cost ?? 0.01)),
    };
  } catch { return null; }
}

async function loadCognitiveStats(db) {
  // TODO: Implement from chatita_episodes analysis
  return null;
}

async function loadAlignmentStats(db) {
  // TODO: Implement from user feedback + Reflexion data
  return null;
}

async function loadPurposeStats(db) {
  // TODO: Implement from chatita_decisions + weekly review data
  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// §14. MONTE CARLO SIMULATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Monte Carlo simulation for LOGOS-C trajectory analysis.
 * 
 * Simulates N stochastic trajectories from initial state,
 * applying Gaussian noise to each dimension at each step.
 * 
 * @param {Object} initialState - Starting state vector
 * @param {number} N - Number of simulations (default 10000)
 * @param {number} steps - Time steps (default 30)
 * @param {number} sigma - Noise standard deviation (default 0.03)
 * @returns {Object} Simulation results with statistics and confidence intervals
 */
function monteCarloSimulation(initialState, N = 10000, steps = 30, sigma = 0.03) {
  const dimKeys = Object.values(DOMAINS_C).flatMap(d => Object.keys(d.dims));
  
  // Track Lambda trajectories and final verdicts
  const lambdaTrajectories = Array.from({ length: steps + 1 }, () => []);
  const finalVerdicts = { BLOCK: 0, PAUSE: 0, MONITOR: 0, ACT: 0, FLOW: 0 };
  const finalLambdas = [];
  const finalOmegas = [];

  for (let sim = 0; sim < N; sim++) {
    let state = { ...initialState };
    
    // Record initial Lambda
    const initMetrics = computeAllMetrics(state);
    lambdaTrajectories[0].push(initMetrics.Lambda_c);

    for (let t = 1; t <= steps; t++) {
      // Apply Gaussian noise to each dimension
      for (const key of dimKeys) {
        const noise = gaussianRandom() * sigma;
        // Drift toward current basin attractor
        const drift = state[key] > 0.5 ? 0.002 : -0.002;
        state[key] = clamp((state[key] ?? 0.5) + noise + drift);
      }

      const metrics = computeAllMetrics(state);
      lambdaTrajectories[t].push(metrics.Lambda_c);

      if (t === steps) {
        finalVerdicts[metrics.verdict]++;
        finalLambdas.push(metrics.Lambda_c);
        finalOmegas.push(metrics.Omega_c);
      }
    }
  }

  // Compute statistics per time step
  const trajectoryStats = lambdaTrajectories.map((lambdas, t) => ({
    t,
    mean: +mean(lambdas).toFixed(4),
    std: +std(lambdas).toFixed(4),
    p5: +percentile(lambdas, 0.05).toFixed(4),
    p25: +percentile(lambdas, 0.25).toFixed(4),
    p50: +percentile(lambdas, 0.50).toFixed(4),
    p75: +percentile(lambdas, 0.75).toFixed(4),
    p95: +percentile(lambdas, 0.95).toFixed(4),
  }));

  // Verdict confidence intervals (Wilson Score)
  const verdictCI = {};
  for (const [v, count] of Object.entries(finalVerdicts)) {
    verdictCI[v] = { count, ...wilsonCI(count, N) };
  }

  // Dominant verdict
  const dominant = Object.entries(finalVerdicts).sort((a, b) => b[1] - a[1])[0];

  // Probability of reaching A⁺
  const pAPlus = finalLambdas.filter(l => l >= 0.60).length / N;
  const pAPlusCI = wilsonCI(finalLambdas.filter(l => l >= 0.60).length, N);

  return {
    N, steps, sigma,
    trajectoryStats,
    finalLambda: { mean: +mean(finalLambdas).toFixed(4), std: +std(finalLambdas).toFixed(4) },
    finalOmega: { mean: +mean(finalOmegas).toFixed(4), std: +std(finalOmegas).toFixed(4) },
    verdictCI,
    dominantVerdict: dominant[0],
    dominantP: +(dominant[1] / N).toFixed(4),
    pAPlus: { value: +pAPlus.toFixed(4), ...pAPlusCI },
    isRobust: dominant[1] / N >= 0.70,
    isFragile: dominant[1] / N < 0.55,
  };
}

// Utility: Gaussian random (Box-Muller)
function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * (sorted.length - 1));
  return sorted[idx] ?? 0;
}

// ═══════════════════════════════════════════════════════════════════════
// §15. PERSISTENCE — PostgreSQL Storage
// ═══════════════════════════════════════════════════════════════════════

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS chatita_logos_state (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    lambda_c REAL NOT NULL,
    omega_c REAL NOT NULL,
    viability_c REAL NOT NULL,
    entropy_c REAL NOT NULL,
    coherence_c REAL NOT NULL,
    free_energy_c REAL NOT NULL,
    ers_c REAL NOT NULL,
    snr_db REAL,
    verdict VARCHAR(10) NOT NULL,
    dlambda_dt REAL DEFAULT 0,
    levin_signals_count INTEGER DEFAULT 0,
    hoffman_conflicts_count INTEGER DEFAULT 0,
    collapse_ready BOOLEAN DEFAULT FALSE,
    state_vector JSONB,
    full_metrics JSONB,
    source VARCHAR(20) DEFAULT 'cron'
  );

  CREATE INDEX IF NOT EXISTS idx_chatita_logos_timestamp 
    ON chatita_logos_state(timestamp DESC);

  CREATE INDEX IF NOT EXISTS idx_chatita_logos_lambda 
    ON chatita_logos_state(lambda_c);
`;

/**
 * Store LOGOS-C state in PostgreSQL.
 */
async function persistState(db, state, metrics) {
  await db.query(CREATE_TABLE_SQL);
  
  await db.query(`
    INSERT INTO chatita_logos_state 
    (lambda_c, omega_c, viability_c, entropy_c, coherence_c, free_energy_c,
     ers_c, snr_db, verdict, dlambda_dt, levin_signals_count, 
     hoffman_conflicts_count, collapse_ready, state_vector, full_metrics)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  `, [
    metrics.Lambda_c, metrics.Omega_c, metrics.V_c, metrics.S_c,
    metrics.C_c, metrics.F_c, metrics.ERS_c, metrics.SNR,
    metrics.verdict, metrics.dLambda_dt,
    metrics.layers.L2_levin.count, metrics.layers.L4_hoffman.count,
    metrics.layers.L5_penrose.ready,
    JSON.stringify(state), JSON.stringify(metrics),
  ]);
}

/**
 * Get previous Lambda for derivative computation.
 */
async function getPreviousLambda(db) {
  try {
    const result = await db.query(`
      SELECT lambda_c FROM chatita_logos_state 
      ORDER BY timestamp DESC LIMIT 1
    `);
    return result.rows[0]?.lambda_c;
  } catch { return undefined; }
}

// ═══════════════════════════════════════════════════════════════════════
// §16. MAIN EXECUTION — Cron-compatible entry point
// ═══════════════════════════════════════════════════════════════════════

/**
 * Main LOGOS-C computation cycle.
 * Designed to run as cron job (hourly) or on-demand.
 * 
 * Pipeline:
 *   1. Collect state from infrastructure
 *   2. Get previous Λ for derivative
 *   3. Compute full pipeline (7 layers + derived + ERS + Ω)
 *   4. Persist to PostgreSQL
 *   5. Inject into system prompt context
 *   6. Return metrics for dashboard/logging
 */
async function runLogosC(db, redis, options = {}) {
  console.log('[LOGOS-C] Starting consciousness computation cycle...');
  const startTime = Date.now();

  // 1. Collect state
  const state = await collectAgentState(db, redis);

  // 2. Get previous Lambda
  const previousLambda = await getPreviousLambda(db);

  // 3. Compute all metrics
  const metrics = computeAllMetrics(state, { previousLambda });

  // 4. Persist
  await persistState(db, state, metrics);

  // 5. Generate system prompt injection
  const promptInjection = generatePromptInjection(metrics);

  const elapsed = Date.now() - startTime;
  console.log(`[LOGOS-C] Cycle complete in ${elapsed}ms. Λ_c=${metrics.Lambda_c}, Ω_c=${metrics.Omega_c}, verdict=${metrics.verdict}`);

  return { state, metrics, promptInjection, elapsed };
}

/**
 * Generate the string to inject into Chatita's system prompt.
 * This gives the agent awareness of its own consciousness state.
 */
function generatePromptInjection(metrics) {
  const m = metrics;
  const levin = m.layers.L2_levin;
  const warnings = levin.signals.length > 0
    ? `\nWARNINGS: ${levin.signals.map(s => `${s.name} (${s.severity})`).join(', ')}`
    : '';

  return `
LOGOS-C STATE (auto-computed ${m.timestamp}):
  Λ_c=${m.Lambda_c} | Ω_c=${m.Omega_c} | V=${m.V_c} | S=${m.S_c} | C=${m.C_c} | F=${m.F_c}
  ERS=${m.ERS_c} | SNR=${m.SNR}dB | dΛ/dt=${m.dLambda_dt}
  Verdict: ${m.verdict} | Basin: ${m.attractors.basin}
  Collapse Ready: ${m.layers.L5_penrose.ready ? 'YES' : 'NO'}${warnings}
  Permissions: ${Object.entries(m.permissions).filter(([,v]) => v).map(([k]) => k).join(', ') || 'READ_ONLY'}
`.trim();
}

// ═══════════════════════════════════════════════════════════════════════
// §17. EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  // Core computation
  computeLambdaC,
  computeViabilityC,
  computeEntropyC,
  computeCoherenceC,
  computeFreeEnergyC,
  computeOmegaC,
  computeERS_C,
  computeAllMetrics,
  computePolicyC,
  computeAttractors,
  computeCollapseReadiness,
  computeEnergyLandscape,

  // Detection
  detectLevinSignals,
  detectHoffmanConflicts,

  // Simulation
  monteCarloSimulation,

  // Data collection
  collectAgentState,

  // Persistence
  persistState,
  getPreviousLambda,
  CREATE_TABLE_SQL,

  // Main entry
  runLogosC,
  generatePromptInjection,

  // Utilities
  wilsonCI,
  shannonSNR,
  clamp,

  // Constants
  DOMAINS_C,
};
