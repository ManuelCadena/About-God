import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ReferenceLine,
  ScatterChart, Scatter, Cell, BarChart, Bar
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════
   MATHEMATICAL ENGINE — Inhibition-First Control Model (ORIGINAL — INTACT)
   ℋ = (X, U, W, V, S, Φ, π, π², Q)
   ═══════════════════════════════════════════════════════════════════════ */

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;

// V(x) — Viability: estimated future decision capacity
function computeViability(s) {
  const pos = s.motivation * 0.22 + s.sleepQuality * 0.20 + s.hrv * 0.13 +
              s.focusScore * 0.13 + s.hydration * 0.07 + s.resilience * 0.10;
  const neg = s.cognitiveLoad * 0.22 + s.fatigue * 0.18 + s.anxiety * 0.22 +
              s.reactivity * 0.08;
  return clamp(pos - neg + 0.50);
}

// S(x) — Functional Entropy: cognitive disorder / volatility
function computeEntropy(s) {
  return clamp(
    s.cognitiveLoad * 0.18 + s.anxiety * 0.24 + s.taskSwitchRate * 0.18 +
    s.reactivity * 0.16 + s.fatigue * 0.10 + s.calendarLoad * 0.14
  );
}

// C(x,u) — Controllability estimate
function computeControllability(s, u) {
  const uMean = Object.values(u).reduce((a, b) => a + b, 0) / Object.values(u).length;
  const resist = s.anxiety * 0.28 + s.fatigue * 0.28 + s.cognitiveLoad * 0.22 + s.calendarLoad * 0.22;
  return clamp(uMean * 0.55 + (1 - resist) * 0.45);
}

// Project state after controls
function projectState(s, u) {
  return {
    ...s,
    sleepQuality:   clamp(s.sleepQuality   + u.sleep      * 0.16),
    fatigue:        clamp(s.fatigue        - u.rest        * 0.20),
    motivation:     clamp(s.motivation     + u.exercise    * 0.12),
    cognitiveLoad:  clamp(s.cognitiveLoad  - u.taskBreaks  * 0.16),
    anxiety:        clamp(s.anxiety        - u.journaling  * 0.13 - u.socialTime * 0.09),
    hydration:      clamp(s.hydration      + u.waterIntake * 0.12),
    focusScore:     clamp(s.focusScore     + u.deepWork    * 0.14),
    reactivity:     clamp(s.reactivity     - u.journaling  * 0.10 - u.rest * 0.08),
    resilience:     clamp(s.resilience     + u.sleep * 0.10 + u.exercise * 0.08),
    taskSwitchRate: clamp(s.taskSwitchRate - u.deepWork    * 0.12 - u.taskBreaks * 0.06),
    calendarLoad:   clamp(s.calendarLoad   - u.boundaries  * 0.14),
    hrv:            clamp(s.hrv            + u.sleep * 0.10 + u.exercise * 0.08 + u.rest * 0.06),
  };
}

function computeDeltaV(s, u) {
  return computeViability(projectState(s, u)) - computeViability(s);
}

function computeDeltaS(s, u) {
  return computeEntropy(projectState(s, u)) - computeEntropy(s);
}

// π(x, u) — Inhibition Policy
const EPSILON_S = 0.03;
const EPSILON_C = 0.30;

function inhibitionPolicy(s, u) {
  const dV = computeDeltaV(s, u);
  const dS = computeDeltaS(s, u);
  const C  = computeControllability(s, u);
  if (dV <= 0)          return { verdict: "BLOCK",  reason: "ΔV ≤ 0 — acción degrada viabilidad futura", color: "#ef4444" };
  if (dS > EPSILON_S)   return { verdict: "WAIT",   reason: `ΔS > ε (${dS.toFixed(3)} > ${EPSILON_S}) — entropía aumentaría`, color: "#f59e0b" };
  if (C  < EPSILON_C)   return { verdict: "WAIT",   reason: `C(x,u) < ε_c (${C.toFixed(2)} < ${EPSILON_C}) — baja controlabilidad`, color: "#f59e0b" };
  return { verdict: "ALLOW", reason: "V mejora, S estable, controlabilidad suficiente", color: "#10b981" };
}

// ─── Generate time-series trajectory ───
const TRAJECTORY_U_SCALE = {
  sleep: 0.08, rest: 0.08, exercise: 0.06,
  taskBreaks: 0.06, journaling: 0.05,
  socialTime: 0.04, waterIntake: 0.04,
  deepWork: 0.06, boundaries: 0.04,
};

function scaleControls(u, factors) {
  const r = {};
  for (const k of Object.keys(u)) r[k] = u[k] * (factors[k] || 0.05);
  return r;
}

function generateTrajectory(s, u, steps = 30) {
  const data = [];
  let cur = { ...s };
  for (let t = 0; t <= steps; t++) {
    const V = computeViability(cur);
    const S = computeEntropy(cur);
    data.push({ t, V: +V.toFixed(3), S: +S.toFixed(3), net: +(V - S).toFixed(3) });
    cur = projectState(cur, scaleControls(u, TRAJECTORY_U_SCALE));
  }
  return data;
}

// ─── Phase space for attractor map ───
const PHASE_U_SCALE = {
  sleep: 0.07, rest: 0.07, exercise: 0.05,
  taskBreaks: 0.05, journaling: 0.04,
  socialTime: 0.03, waterIntake: 0.03,
  deepWork: 0.05, boundaries: 0.03,
};

function generatePhaseSpace(s, u) {
  const pts = [];
  let cur = { ...s };
  for (let t = 0; t < 40; t++) {
    pts.push({ V: +computeViability(cur).toFixed(3), S: +computeEntropy(cur).toFixed(3), t });
    cur = projectState(cur, scaleControls(u, PHASE_U_SCALE));
  }
  return pts;
}

/* ═══════════════════════════════════════════════════════════════════════
   π² META-POLICY & Q(x) — Pathological Attractor Detection (ORIGINAL — INTACT)
   ═══════════════════════════════════════════════════════════════════════ */

const V_STAR = 0.65;
const S_STAR = 0.35;
const LAMBDA_Q = 0.6;
const GAMMA_Q = 0.4;

function computeQ(s) {
  const V = computeViability(s);
  const S = computeEntropy(s);
  const dV = Math.max(0, V_STAR - V);
  const dS = Math.max(0, S - S_STAR);
  const D = Math.sqrt(dV * dV + dS * dS);
  return V - LAMBDA_Q * S - GAMMA_Q * D;
}

function computeLyapunov(s) {
  const V = computeViability(s);
  const S = computeEntropy(s);
  const alpha = 1.0, beta = 0.8;
  const dV = Math.max(0, V_STAR - V);
  const dS = Math.max(0, S - S_STAR);
  return alpha * dV * dV + beta * dS * dS;
}

function computeMultiHorizonDeltaV(s, u) {
  let cur = { ...s };
  const horizons = [1, 7, 15, 30];
  const results = {};
  const uScaled = scaleControls(u, TRAJECTORY_U_SCALE);
  const V0 = computeViability(s);
  for (let t = 1; t <= 30; t++) {
    cur = projectState(cur, uScaled);
    if (horizons.includes(t)) {
      results[`t${t}`] = +(computeViability(cur) - V0).toFixed(4);
    }
  }
  return results;
}

function detectPathologicalAttractor(s, u) {
  const V = computeViability(s);
  const S = computeEntropy(s);
  const C = computeControllability(s, u);
  const Q = computeQ(s);
  const L = computeLyapunov(s);
  const horizons = computeMultiHorizonDeltaV(s, u);
  const dV30 = horizons.t30 || 0;
  const findings = [];

  if (V < 0.45 && S < 0.50 && Math.abs(dV30) < 0.02 && s.motivation < 0.30) {
    findings.push({
      type: "DEPRESIÓN-LIKE", icon: "🌑", color: "#6b21a8",
      desc: "V baja estable, S no-caótica, motivación colapsada. El sistema está en un equilibrio rígido disfuncional — certeza sin agencia.",
      signature: "V < 0.45, S < 0.50, ΔV₃₀ ≈ 0, motivación < 0.30",
      escape: "Desestabilización controlada: incrementar activación social, ejercicio, romper rutina. Aceptar ΔS temporal positivo."
    });
  }

  if (s.reactivity > 0.65 && s.resilience < 0.30 && s.anxiety > 0.55) {
    findings.push({
      type: "CICLO ADICTIVO", icon: "🔁", color: "#dc2626",
      desc: "Alta reactividad con baja resiliencia. El sistema busca alivio inmediato (ΔV local +) que refuerza el ciclo. Trampa de optimización miope.",
      signature: "reactivity > 0.65, resilience < 0.30, anxiety > 0.55",
      escape: "Romper el ciclo requiere tolerar ΔS positivo temporal sin buscar alivio. Controles: journaling, boundaries, rest sostenido."
    });
  }

  if (C < 0.25 && V < 0.45 && Math.abs(dV30) < 0.015) {
    findings.push({
      type: "INDEFENSIÓN APRENDIDA", icon: "🔒", color: "#92400e",
      desc: "Controlabilidad percibida colapsada. El sistema ha aprendido que U no influye en X — no porque sea verdad, sino porque el modelo interno lo cree.",
      signature: "C < 0.25, V < 0.45, ΔV₃₀ ≈ 0",
      escape: "Micro-victorias: aplicar UN solo control al máximo y verificar ΔV. Reconstruir evidencia de agencia."
    });
  }

  if (V > 0.50 && S > 0.55 && s.cognitiveLoad > 0.65 && s.calendarLoad > 0.60) {
    findings.push({
      type: "SOBRE-RENDIMIENTO CRÓNICO", icon: "⚡", color: "#ea580c",
      desc: "V aparentemente aceptable sostenida por alta S. Atractor frágil que colapsará ante perturbación. El rendimiento es real pero insostenible.",
      signature: "V > 0.50, S > 0.55, cogLoad > 0.65, calLoad > 0.60",
      escape: "Reducir carga de agenda y compromisos ANTES del colapso. El atractor necesita redefinirse con V estable a S baja."
    });
  }

  if (findings.length === 0 && V < V_STAR && Math.abs(dV30) < 0.01) {
    findings.push({
      type: "ESTANCAMIENTO", icon: "◌", color: "#71717a",
      desc: "Sin patología detectable, pero sin convergencia al atractor funcional. Los controles son insuficientes para romper la inercia.",
      signature: `V = ${V.toFixed(2)} < V* = ${V_STAR}, ΔV₃₀ ≈ 0`,
      escape: "Incrementar intensidad de múltiples controles simultáneamente. Buscar salto cualitativo, no ajuste incremental."
    });
  }

  return { findings, Q, L, V, S, C, horizons };
}

function metaPolicy(s, u) {
  const { findings, Q, L, V } = detectPathologicalAttractor(s, u);
  if (findings.length > 0 && findings.some(f => f.type !== "ESTANCAMIENTO")) {
    return { verdict: "ESCAPE", color: "#f97316",
      reason: `Atractor patológico detectado: ${findings.map(f => f.type).join(", ")}. Protocolo de desestabilización controlada recomendado.`,
      findings };
  }
  if (findings.length > 0) {
    return { verdict: "ACTIVATE", color: "#eab308",
      reason: "Sistema estancado sin patología. Incrementar controles para convergir al atractor funcional.",
      findings };
  }
  if (V >= V_STAR && Q > 0.3) {
    return { verdict: "SUSTAIN", color: "#10b981",
      reason: "Sistema en zona funcional. Mantener controles actuales. El atractor de viabilidad es estable.",
      findings: [] };
  }
  return { verdict: "MONITOR", color: "#6366f1",
    reason: "Sin patología ni estancamiento. Sistema en tránsito — monitorear convergencia.",
    findings: [] };
}

/* ═══════════════════════════════════════════════════════════════════════
   BATCH 1 — STOCHASTIC LAYER (NEW)
   projectStateStochastic, runMonteCarlo
   ═══════════════════════════════════════════════════════════════════════ */

// Box-Muller transform for approximate Gaussian noise
function gaussianRandom() {
  let u1 = Math.random(), u2 = Math.random();
  while (u1 === 0) u1 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

// Wraps projectState with stochastic perturbation W — projectState is NOT modified
function projectStateStochastic(s, u, sigma = 0.04) {
  const det = projectState(s, u);
  const stoch = {};
  for (const key of Object.keys(det)) {
    if (typeof det[key] === "number") {
      stoch[key] = clamp(det[key] + sigma * gaussianRandom());
    } else {
      stoch[key] = det[key];
    }
  }
  return stoch;
}

// Wraps projectStateNonLinear with stochastic perturbation
function projectStateStochasticNL(s, u, sigma = 0.04) {
  const det = projectStateNonLinear(s, u);
  const stoch = {};
  for (const key of Object.keys(det)) {
    if (typeof det[key] === "number") {
      stoch[key] = clamp(det[key] + sigma * gaussianRandom());
    } else {
      stoch[key] = det[key];
    }
  }
  return stoch;
}

// Wilson Score Confidence Interval — superior to Wald for proportions near 0 or 1
// Returns { lower, upper, p } for a binomial proportion at confidence level z
function wilsonCI(successes, n, z = 1.96) {
  if (n === 0) return { lower: 0, upper: 0, p: 0 };
  const p = successes / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / denom;
  return { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin), p };
}

function runMonteCarlo(s, u, N = 10000, steps = 30, sigma = 0.04, useNL = false) {
  const uScaled = scaleControls(u, TRAJECTORY_U_SCALE);
  const allFinalV = [];
  const allFinalS = [];
  // Collect V and S at each timestep across all simulations
  const VbyT = Array.from({ length: steps + 1 }, () => []);
  const SbyT = Array.from({ length: steps + 1 }, () => []);

  // NEW: π(x,u) verdict tracking for confidence intervals on decisions
  const verdictByT = Array.from({ length: steps + 1 }, () => [0, 0, 0]); // [BLOCK, WAIT, ALLOW] counts
  const timeToFirstAllow = []; // step of first ALLOW for each trajectory (-1 = never)

  // Precompute u-mean for fast controllability evaluation inside loop
  const uVals = Object.values(u);
  const uMeanPre = uVals.reduce((a, b) => a + b, 0) / uVals.length;

  for (let i = 0; i < N; i++) {
    let cur = { ...s };
    let firstAllowStep = -1;
    for (let t = 0; t <= steps; t++) {
      const vt = computeViability(cur);
      const st = computeEntropy(cur);
      VbyT[t].push(vt);
      SbyT[t].push(st);

      // NEW: Evaluate π(x,u) verdict on this stochastic state — inline for performance
      const projV = projectState(cur, u);
      const dV_pi = computeViability(projV) - vt;
      let vCode;
      if (dV_pi <= 0) { vCode = 0; } // BLOCK
      else {
        const dS_pi = computeEntropy(projV) - st;
        if (dS_pi > EPSILON_S) { vCode = 1; } // WAIT (entropy)
        else {
          const resist = cur.anxiety * 0.28 + cur.fatigue * 0.28 + cur.cognitiveLoad * 0.22 + cur.calendarLoad * 0.22;
          const Cval = clamp(uMeanPre * 0.55 + (1 - resist) * 0.45);
          vCode = Cval < EPSILON_C ? 1 : 2; // WAIT (controllability) or ALLOW
        }
      }
      verdictByT[t][vCode]++;
      if (vCode === 2 && firstAllowStep === -1) firstAllowStep = t;

      if (t === steps) { allFinalV.push(vt); allFinalS.push(st); }
      else {
        cur = useNL
          ? projectStateStochasticNL(cur, uScaled, sigma)
          : projectStateStochastic(cur, uScaled, sigma);
      }
    }
    timeToFirstAllow.push(firstAllowStep);
  }

  // Compute percentiles per timestep
  const pct = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length * p)] || 0; };
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => { const m = mean(arr); return Math.sqrt(arr.reduce((a, v) => a + (v - m) ** 2, 0) / arr.length); };

  const stats = [];
  for (let t = 0; t <= steps; t++) {
    stats.push({
      t,
      V_p5: +pct(VbyT[t], 0.05).toFixed(3),
      V_p25: +pct(VbyT[t], 0.25).toFixed(3),
      V_p50: +pct(VbyT[t], 0.50).toFixed(3),
      V_p75: +pct(VbyT[t], 0.75).toFixed(3),
      V_p95: +pct(VbyT[t], 0.95).toFixed(3),
      V_mean: +mean(VbyT[t]).toFixed(3),
      S_p5: +pct(SbyT[t], 0.05).toFixed(3),
      S_p50: +pct(SbyT[t], 0.50).toFixed(3),
      S_p95: +pct(SbyT[t], 0.95).toFixed(3),
      S_mean: +mean(SbyT[t]).toFixed(3),
      // NEW: Verdict probabilities at each timestep
      pBlock: +(verdictByT[t][0] / N).toFixed(4),
      pWait:  +(verdictByT[t][1] / N).toFixed(4),
      pAllow: +(verdictByT[t][2] / N).toFixed(4),
    });
  }

  const V0 = computeViability(s);
  const pDeltaVPos = allFinalV.filter(v => v > V0).length / N;
  const finalVMean = mean(allFinalV);
  const finalVStd = std(allFinalV);
  const finalSMean = mean(allFinalS);

  // NEW: Wilson Score CIs on final-step verdict proportions
  const ciBlock = wilsonCI(verdictByT[steps][0], N);
  const ciWait  = wilsonCI(verdictByT[steps][1], N);
  const ciAllow = wilsonCI(verdictByT[steps][2], N);

  // NEW: Determine dominant verdict and robustness
  const verdictNames = ["BLOCK", "WAIT", "ALLOW"];
  const verdictColors = ["#ef4444", "#f59e0b", "#10b981"];
  const finalCounts = verdictByT[steps];
  const dominantIdx = finalCounts[0] >= finalCounts[1] && finalCounts[0] >= finalCounts[2] ? 0
                    : finalCounts[1] >= finalCounts[2] ? 1 : 2;
  const dominantP = finalCounts[dominantIdx] / N;
  const isRobust = dominantP >= 0.70;
  const isFragile = dominantP < 0.55;

  // NEW: Time-to-first-ALLOW distribution
  const allowReached = timeToFirstAllow.filter(t => t >= 0);
  const pNeverAllow = 1 - allowReached.length / N;
  const ttaStats = allowReached.length > 0 ? {
    median: +pct(allowReached, 0.50).toFixed(1),
    p5:  +pct(allowReached, 0.05).toFixed(1),
    p25: +pct(allowReached, 0.25).toFixed(1),
    p75: +pct(allowReached, 0.75).toFixed(1),
    p95: +pct(allowReached, 0.95).toFixed(1),
    mean: +mean(allowReached).toFixed(1),
  } : null;

  return {
    stats, pDeltaVPos, finalVMean, finalVStd, finalSMean, N, steps, sigma,
    // NEW: Decision confidence fields
    verdictCI: {
      BLOCK: { count: finalCounts[0], p: ciBlock.p, lower: ciBlock.lower, upper: ciBlock.upper },
      WAIT:  { count: finalCounts[1], p: ciWait.p,  lower: ciWait.lower, upper: ciWait.upper },
      ALLOW: { count: finalCounts[2], p: ciAllow.p, lower: ciAllow.lower, upper: ciAllow.upper },
    },
    dominantVerdict: verdictNames[dominantIdx],
    dominantP,
    dominantColor: verdictColors[dominantIdx],
    isRobust,
    isFragile,
    timeToAllow: { pNeverAllow, stats: ttaStats, raw: timeToFirstAllow },
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   BATCH 2 — EMERGENT COMPUTATIONS (NEW)
   ∇V(x), A_emergent(x), Cognitive Mode
   ═══════════════════════════════════════════════════════════════════════ */

// ∇V(x) — Viability Gradient: partial derivatives via numerical differentiation
function computeGradientV(s, epsilon = 0.01) {
  const V0 = computeViability(s);
  const gradient = {};
  for (const key of Object.keys(s)) {
    if (typeof s[key] !== "number") continue;
    const sp = { ...s, [key]: clamp(s[key] + epsilon) };
    gradient[key] = +((computeViability(sp) - V0) / epsilon).toFixed(4);
  }
  return gradient;
}

// A(x) — Emergent Anxiety: mismatch between intuition (∇V) and simulation (ΔV multi-horizon)
function computeEmergentAnxiety(s, u) {
  const gradV = computeGradientV(s);
  const gradValues = Object.values(gradV);
  const gradSum = gradValues.reduce((a, b) => a + b, 0);
  const gradMag = Math.sqrt(gradValues.reduce((a, g) => a + g * g, 0));

  const horizons = computeMultiHorizonDeltaV(s, u);
  const simSignal = horizons.t7 || 0;

  // Mismatch between gradient direction and simulation outcome
  const signMismatch = (gradSum > 0.01 && simSignal < -0.005) || (gradSum < -0.01 && simSignal > 0.005) ? 1 : 0;
  const magnitudeDiff = Math.abs(gradMag * 0.5 - Math.abs(simSignal) * 10);

  return clamp(signMismatch * 0.4 + magnitudeDiff * 0.3 + (1 - computeControllability(s, u)) * 0.3);
}

// Cognitive Mode Classification (Doc1 §6)
function classifyCognitiveMode(s, u) {
  const V = computeViability(s);
  const S = computeEntropy(s);
  const gradV = computeGradientV(s);
  const gradMag = Math.sqrt(Object.values(gradV).reduce((a, g) => a + g * g, 0));

  if (V > 0.62 && S < 0.32 && gradMag < 0.025) {
    return { mode: "INTUICIÓN", icon: "◈", color: "#10b981",
      desc: "∇V plano + V alta + S baja. El sistema tiene certeza funcional — la señal es clara sin simulación." };
  }
  if (gradMag > 0.04 && V > 0.48 && S < 0.50) {
    return { mode: "DELIBERACIÓN", icon: "⟁", color: "#6366f1",
      desc: "∇V empinado + V adecuada. Esfuerzo cognitivo productivo — el sistema procesa información relevante." };
  }
  if (V < 0.45 && S > 0.52) {
    return { mode: "ANSIEDAD", icon: "◬", color: "#ef4444",
      desc: "V baja + S alta. Conflicto entre señales. Múltiples interpretaciones compiten sin resolución." };
  }
  return { mode: "TRANSICIÓN", icon: "◎", color: "#f59e0b",
    desc: "Estado intermedio. El sistema no clasifica en un modo cognitivo dominante." };
}

/* ═══════════════════════════════════════════════════════════════════════
   BATCH 3 — EXTENDED FEATURES (NEW)
   projectStateNonLinear, safeToActOracle (enhanced)
   ═══════════════════════════════════════════════════════════════════════ */

// Non-linear interaction wrapper — projectState is NOT modified
function projectStateNonLinear(s, u) {
  const lin = projectState(s, u);
  const nl = { ...lin };
  // Fatigue amplifies anxiety
  nl.anxiety = clamp(lin.anxiety * (1 + lin.fatigue * 0.15));
  // Calendar load amplifies cognitive load
  nl.cognitiveLoad = clamp(lin.cognitiveLoad * (1 + lin.calendarLoad * 0.12));
  // Anxiety amplifies reactivity (stress cascade)
  nl.reactivity = clamp(lin.reactivity * (1 + lin.anxiety * 0.10));
  // Resilience buffers motivation
  nl.motivation = clamp(lin.motivation * (1 + lin.resilience * 0.08));
  // Sleep deprivation compounds fatigue non-linearly
  nl.fatigue = clamp(lin.fatigue * (1 + (1 - lin.sleepQuality) * 0.10));
  return nl;
}

// Safe-to-Act Oracle — scans trajectory for first π = ALLOW using FULL inhibition policy
function safeToActOracle(s, u, maxSteps = 60) {
  let cur = { ...s };
  const uScaled = scaleControls(u, TRAJECTORY_U_SCALE);
  for (let t = 1; t <= maxSteps; t++) {
    cur = projectState(cur, uScaled);
    const pol = inhibitionPolicy(cur, u);
    if (pol.verdict === "ALLOW") {
      return { safe: true, step: t, V: computeViability(cur), S: computeEntropy(cur),
        Q: computeQ(cur) };
    }
  }
  return { safe: false, step: null };
}

/* ═══════════════════════════════════════════════════════════════════════
   BATCH 4 — MATHEMATICAL ALTERNATIVES (NEW)
   Sigmoid V, Shannon S, Empowerment C — all as opt-in alternatives
   ═══════════════════════════════════════════════════════════════════════ */

function computeViabilitySigmoid(s) {
  const pos = s.motivation * 0.22 + s.sleepQuality * 0.20 + s.hrv * 0.13 +
              s.focusScore * 0.13 + s.hydration * 0.07 + s.resilience * 0.10;
  const neg = s.cognitiveLoad * 0.22 + s.fatigue * 0.18 + s.anxiety * 0.22 +
              s.reactivity * 0.08;
  const raw = pos - neg + 0.50;
  return 1 / (1 + Math.exp(-6 * (raw - 0.5)));
}

function computeEntropyShannon(s) {
  const components = [s.cognitiveLoad, s.anxiety, s.taskSwitchRate,
                       s.reactivity, s.fatigue, s.calendarLoad];
  const total = components.reduce((a, b) => a + b, 0);
  if (total < 0.001) return 0;
  const probs = components.map(c => Math.max(c / total, 0.0001));
  const H = -probs.reduce((a, p) => a + p * Math.log2(p), 0);
  return clamp(H / Math.log2(components.length));
}

function computeControllabilityMC(s, N = 40) {
  const reachable = [];
  for (let i = 0; i < N; i++) {
    const rU = {};
    for (const k of Object.keys(DEFAULT_CONTROLS)) rU[k] = Math.random();
    reachable.push(computeViability(projectState(s, rU)));
  }
  const m = reachable.reduce((a, b) => a + b, 0) / N;
  const variance = reachable.reduce((a, v) => a + (v - m) ** 2, 0) / N;
  return clamp(Math.sqrt(variance) * 4);
}

/* ═══════════════════════════════════════════════════════════════════════
   BATCH 5 — GAP CLOSERS (NEW — v4)
   D(x) Slow Dynamics / C(x) Fast Conditionals, Decision History Logger
   ═══════════════════════════════════════════════════════════════════════ */

// D(x) — Slow Dynamics Model: extracts long-horizon trend via EMA
// Doc1 §9.1: "D(x) captures slow directional trends; it is the intuition layer"
function computeSlowDynamics(s, u, horizon = 15) {
  const uScaled = scaleControls(u, TRAJECTORY_U_SCALE);
  let cur = { ...s };
  const alpha = 2 / (horizon + 1);
  let emaV = computeViability(s);
  let emaS = computeEntropy(s);
  const trend = [];
  for (let t = 1; t <= horizon; t++) {
    cur = projectState(cur, uScaled);
    const vt = computeViability(cur);
    const st = computeEntropy(cur);
    emaV = alpha * vt + (1 - alpha) * emaV;
    emaS = alpha * st + (1 - alpha) * emaS;
    trend.push({ t, V_ema: +emaV.toFixed(4), S_ema: +emaS.toFixed(4), V_raw: +vt.toFixed(4) });
  }
  const dV_slow = emaV - computeViability(s);
  const dS_slow = emaS - computeEntropy(s);
  const direction = dV_slow > 0.005 ? "IMPROVING" : dV_slow < -0.005 ? "DEGRADING" : "STABLE";
  return { trend, emaV: +emaV.toFixed(4), emaS: +emaS.toFixed(4), dV_slow: +dV_slow.toFixed(4), dS_slow: +dS_slow.toFixed(4), direction };
}

// C(x) — Fast Conditionals: immediate-step policy evaluation under multiple scenarios
// Doc1 §9.1: "C(x) responds to immediate conditional signals; it is the deliberation layer"
function computeFastConditionals(s, u) {
  const current = inhibitionPolicy(s, u);
  const currentDV = computeDeltaV(s, u);
  const maxU = {}; for (const k of Object.keys(u)) maxU[k] = 1.0;
  const bestCase = inhibitionPolicy(s, maxU);
  const bestDV = computeDeltaV(s, maxU);
  const zeroU = {}; for (const k of Object.keys(u)) zeroU[k] = 0.0;
  const worstCase = inhibitionPolicy(s, zeroU);
  const worstDV = computeDeltaV(s, zeroU);
  const headroom = bestDV - worstDV;
  const utilization = headroom > 0.001 ? (currentDV - worstDV) / headroom : 0;
  return {
    current: { verdict: current.verdict, dV: +currentDV.toFixed(4) },
    bestCase: { verdict: bestCase.verdict, dV: +bestDV.toFixed(4) },
    worstCase: { verdict: worstCase.verdict, dV: +worstDV.toFixed(4) },
    headroom: +headroom.toFixed(4),
    utilization: +clamp(utilization).toFixed(3),
    actionable: headroom > 0.01,
  };
}

// Decision Log Entry constructor
function createDecisionLogEntry(s, u) {
  const V = computeViability(s);
  const S = computeEntropy(s);
  const pi = inhibitionPolicy(s, u);
  const mp = metaPolicy(s, u);
  const Q = computeQ(s);
  return {
    timestamp: new Date().toLocaleTimeString(),
    V: +V.toFixed(3), S: +S.toFixed(3), Q: +Q.toFixed(3),
    piVerdict: pi.verdict, pi2Verdict: mp.verdict,
    stateSnapshot: { ...s }, controlSnapshot: { ...u },
  };
}


/* ═══════════════════════════════════════════════════════════════════════
   DEFAULT STATES (ORIGINAL — INTACT, new presets ADDED)
   ═══════════════════════════════════════════════════════════════════════ */
const DEFAULT_STATE = {
  cognitiveLoad: 0.55, fatigue: 0.45, motivation: 0.50, anxiety: 0.40,
  sleepQuality: 0.55, hrv: 0.50, focusScore: 0.50, hydration: 0.60,
  taskSwitchRate: 0.40, reactivity: 0.35, calendarLoad: 0.45, resilience: 0.50,
};

const DEFAULT_CONTROLS = {
  sleep: 0.5, rest: 0.4, exercise: 0.3, taskBreaks: 0.4,
  journaling: 0.2, socialTime: 0.3, waterIntake: 0.5, deepWork: 0.4, boundaries: 0.3,
};

const PRESETS = {
  burnout: {
    label: "🔥 Burnout",
    state: { cognitiveLoad: 0.9, fatigue: 0.85, motivation: 0.15, anxiety: 0.8, sleepQuality: 0.2, hrv: 0.2, focusScore: 0.15, hydration: 0.3, taskSwitchRate: 0.85, reactivity: 0.8, calendarLoad: 0.9, resilience: 0.1 },
  },
  optimal: {
    label: "✦ Óptimo",
    state: { cognitiveLoad: 0.15, fatigue: 0.1, motivation: 0.9, anxiety: 0.1, sleepQuality: 0.9, hrv: 0.85, focusScore: 0.9, hydration: 0.9, taskSwitchRate: 0.1, reactivity: 0.1, calendarLoad: 0.15, resilience: 0.9 },
  },
  stressed: {
    label: "⚡ Estrés Agudo",
    state: { cognitiveLoad: 0.75, fatigue: 0.6, motivation: 0.35, anxiety: 0.75, sleepQuality: 0.35, hrv: 0.30, focusScore: 0.3, hydration: 0.4, taskSwitchRate: 0.7, reactivity: 0.7, calendarLoad: 0.8, resilience: 0.25 },
  },
  recovery: {
    label: "🌱 Recuperación",
    state: { cognitiveLoad: 0.35, fatigue: 0.35, motivation: 0.55, anxiety: 0.3, sleepQuality: 0.65, hrv: 0.60, focusScore: 0.55, hydration: 0.7, taskSwitchRate: 0.3, reactivity: 0.25, calendarLoad: 0.3, resilience: 0.6 },
  },
  depression: {
    label: "🌑 Depresión-like",
    state: { cognitiveLoad: 0.35, fatigue: 0.55, motivation: 0.12, anxiety: 0.30, sleepQuality: 0.40, hrv: 0.35, focusScore: 0.25, hydration: 0.45, taskSwitchRate: 0.15, reactivity: 0.15, calendarLoad: 0.20, resilience: 0.15 },
  },
  addiction: {
    label: "🔁 Ciclo Adictivo",
    state: { cognitiveLoad: 0.55, fatigue: 0.50, motivation: 0.40, anxiety: 0.65, sleepQuality: 0.35, hrv: 0.30, focusScore: 0.30, hydration: 0.35, taskSwitchRate: 0.60, reactivity: 0.80, calendarLoad: 0.45, resilience: 0.15 },
  },
};

/* ═══════════════════════════════════════════════════════════════════════
   TOOLTIPS DATABASE (ORIGINAL — INTACT, new entries ADDED)
   ═══════════════════════════════════════════════════════════════════════ */
const TIPS = {
  V: "V(x) — Función de Viabilidad. Mide tu capacidad futura de tomar decisiones de calidad. No mide éxito ni felicidad, sino opcionalidad futura, resiliencia cognitiva y margen de maniobra. Rango [0,1]. Alta V = más libertad y claridad. Baja V = riesgo de burnout, impulsividad.",
  S: "S(x) — Entropía Funcional. Cuantifica el desorden interno: carga cognitiva, conflicto decisional, volatilidad emocional. Conecta con la entropía de Shannon: alta S = muchas interpretaciones compiten, no puedes discriminar señal de ruido. Baja S = pensamiento coherente, decisiones claras.",
  C: "C(x,u) — Controlabilidad. Estima qué tanto puedes influir en tu propio estado con los controles disponibles. Cerca del atractor, C es alta (tienes agencia multidimensional). En crisis, C colapsa — solo puedes controlar 1-2 variables.",
  Q: "Q(x) — Función de Valor Absoluto. Distingue atractores funcionales de patológicos. Q = V − λ·S − γ·D(x,A*). Un estado puede ser estable (ΔV ≈ 0) pero patológico si Q es bajo. Q alto = estás estable EN EL LUGAR CORRECTO.",
  L: "L(x) — Función de Lyapunov. Mide la distancia cuadrática al atractor funcional: L = α(V*−V)² + β(S−S*)². Si L decrece con el tiempo, el sistema converge al atractor.",
  pi: "π(x,u) — Política de Inhibición. Evalúa cada acción candidata: ¿mejora la viabilidad? ¿aumenta la entropía? ¿hay controlabilidad suficiente? Si alguna condición falla, la acción se inhibe.",
  pi2: "π²(x) — Meta-Política. Opera sobre la cuenca de atracción. Detecta si el sistema ha convergido a un atractor patológico y activa protocolos de escape.",
  attractor: "Atractor — Conjunto de estados hacia el cual el sistema converge. El atractor de viabilidad (A*) es la zona donde V ≥ 0.65 y S ≤ 0.35. PERO: existen atractores patológicos que también son estables.",
  basin: "Cuenca de Atracción B(A) — Conjunto de estados desde los cuales el sistema puede retornar al atractor. Fuera de la cuenca, el retorno es imposible con los controles disponibles.",
  cognitiveLoad: "Carga Cognitiva — Cantidad de procesamiento mental activo. Alta carga reduce V y aumenta S.",
  fatigue: "Fatiga — Agotamiento acumulado del sistema. Reduce V directamente y amplifica el efecto de otras variables negativas.",
  motivation: "Motivación — Energía direccional del sistema. Alta motivación aumenta V.",
  anxiety: "Ansiedad — Error funcional: divergencia entre intuición y simulación. Alta ansiedad = alta S + baja C.",
  sleepQuality: "Calidad de Sueño — Principal restaurador de V. Eigenvalor dominante del sistema.",
  hrv: "HRV — Proxy fisiológico de la capacidad regulatoria del sistema nervioso autónomo.",
  focusScore: "Score de Enfoque — Capacidad de mantener atención sostenida.",
  hydration: "Hidratación — Variable de soporte básico. Impacto menor pero acumulativo.",
  taskSwitchRate: "Tasa de Cambio de Tareas — Cada cambio de contexto tiene un costo cognitivo residual (attention residue).",
  reactivity: "Reactividad — Tendencia a responder impulsivamente a estímulos.",
  calendarLoad: "Carga de Agenda — Compromisos externos que reducen grados de libertad.",
  resilience: "Resiliencia — Capacidad del sistema de absorber perturbaciones sin salir de la cuenca del atractor.",
  sleep: "Control: Sueño — El control más potente. Restaura V, reduce fatigue, mejora HRV.",
  rest: "Control: Descanso — Reduce fatigue y reactivity activamente.",
  exercise: "Control: Ejercicio — Incrementa motivación, HRV y resiliencia.",
  taskBreaks: "Control: Pausas Cognitivas — Reduce carga cognitiva y tasa de cambio de tareas.",
  journaling: "Control: Journaling — Reduce ansiedad y reactividad mediante externalización.",
  socialTime: "Control: Tiempo Social — Reduce ansiedad.",
  waterIntake: "Control: Hidratación — Soporte básico. Efecto menor pero consistente.",
  deepWork: "Control: Deep Work — Incrementa focusScore y reduce taskSwitchRate.",
  boundaries: "Control: Límites/Fronteras — Reduce calendarLoad directamente.",
  // NEW tooltips
  gradV: "∇V(x) — Gradiente de Viabilidad. Derivada parcial de V respecto a cada variable. Muestra qué variables están 'tirando' V hacia arriba o abajo. Operacionaliza la 'intuición' como señal local de baja entropía.",
  emergentAnxiety: "A_modelo — Ansiedad Emergente. Computada como mismatch entre ∇V (intuición) y ΔV simulado. Si A_modelo >> A_sentida → posible negación. Si A_sentida >> A_modelo → posible catastrofismo.",
  cogMode: "Modo Cognitivo — Clasificación emergente del estado actual: INTUICIÓN (V alta, S baja, ∇V plano), DELIBERACIÓN (∇V empinado, V adecuada), ANSIEDAD (V baja, S alta), TRANSICIÓN (intermedio).",
  monteCarlo: "Monte Carlo — Simulación estocástica: N trayectorias con perturbaciones aleatorias W. Produce bandas de confianza [P₅, P₅₀, P₉₅] y P(ΔV>0). Transforma la predicción determinista en distribución probabilística.",
  nonLinear: "Interacciones No-Lineales — La fatiga amplifica la ansiedad, la carga de agenda amplifica la carga cognitiva, la ansiedad potencia la reactividad. Captura cascadas de estrés compuesto.",
  slowDynamics: "D(x) — Dinámicas Lentas. Modelo de tendencia a largo plazo usando media móvil exponencial (EMA). Captura la dirección del sistema cuando se filtran las fluctuaciones rápidas. Doc1 §9.1: la intuición como señal de baja entropía.",
  fastConditionals: "C(x) — Condicionales Rápidos. Evaluación inmediata de la política bajo múltiples escenarios de control. Mide el headroom (margen de maniobra) y la utilización actual de ese margen. Doc1 §9.1: la deliberación como evaluación condicional.",
  decisionLog: "Historial de Decisiones — Registro de cada evaluación π(x) y π²(x) con timestamp, V, S, Q. Permite trazabilidad causal: ¿POR QUÉ se inhibió una decisión? ¿Qué estado había?",
  safeOracle: "Safe-to-Act Oracle — Escanea la trayectoria hasta encontrar el primer momento donde π(x) = ALLOW. Indica cuándo será seguro tomar decisiones importantes.",
  decisionCI: "Confianza de la Decisión — Distribución de probabilidad de π(x,u) sobre N trayectorias estocásticas. Usa Wilson Score Intervals (CI₉₅) para cuantificar la incertidumbre del veredicto. Una decisión ROBUSTA tiene P(veredicto dominante) ≥ 70%. Una decisión FRÁGIL tiene P < 55% — cualquier perturbación puede invertir el veredicto.",
};

/* ═══════════════════════════════════════════════════════════════════════
   THEORY SECTIONS (ORIGINAL — INTACT, new sections ADDED)
   ═══════════════════════════════════════════════════════════════════════ */
const THEORY_SECTIONS = [
  {
    id: "overview", title: "¿Qué es el Modelo IFC?", icon: "◉",
    content: [
      { type: "lead", text: "El modelo Inhibition-First Control (IFC) propone que la inhibición de acciones potencialmente dañinas debe preceder a cualquier intento de optimización del desempeño." },
      { type: "p", text: "A diferencia de los modelos tradicionales de decisión — centrados en maximizar utilidad o rendimiento inmediato — este enfoque sitúa como objetivo primario la viabilidad del sistema humano: la capacidad de preservar opciones futuras, coherencia cognitiva y estabilidad funcional en el tiempo." },
      { type: "p", text: "El ser humano es modelado como un sistema dinámico parcialmente controlable, sujeto a retardos, ruido exógeno y limitaciones internas de procesamiento." },
      { type: "formula", text: "ℋ = (X, U, W, V, S, Φ, π, π², Q)" },
      { type: "quote", text: "No todo lo que puedes decidir debe ser decidido. Primero conserva al decisor — pero verifica que el decisor que conservas sea el correcto." },
    ],
  },
  {
    id: "system", title: "El Sistema ℋ", icon: "⬡",
    content: [
      { type: "lead", text: "El sistema modela al humano como planta cibernética con 9 componentes formales." },
      { type: "table", headers: ["Símbolo", "Nombre", "Descripción"], rows: [
        ["X ∈ ℝ¹²", "Estado Interno", "12 variables cognitivo-emocionales"],
        ["U ∈ ℝ⁹", "Controles", "9 inputs manipulables"],
        ["W", "Perturbaciones", "Factores exógenos no controlables (ahora simulados vía Monte Carlo)"],
        ["V(x)", "Viabilidad", "Capacidad futura de tomar decisiones de calidad"],
        ["S(x)", "Entropía", "Desorden cognitivo: volatilidad emocional, conflicto decisional"],
        ["Φ", "Dinámica", "x_{t+1} = Φ(x_t, u_t, w_t) — con opción lineal o no-lineal"],
        ["π", "Política", "ALLOW / WAIT / BLOCK"],
        ["π²", "Meta-Política", "SUSTAIN / MONITOR / ACTIVATE / ESCAPE"],
        ["Q(x)", "Valor Absoluto", "Distingue atractores funcionales de patológicos"],
      ]},
    ],
  },
  {
    id: "viability", title: "V(x) — Función de Viabilidad", icon: "🎯",
    content: [
      { type: "lead", text: "V(x) estima la capacidad futura del individuo para seguir tomando decisiones de calidad." },
      { type: "formula", text: "V(x) = Σ wᵢ·xᵢ⁺ − Σ wⱼ·xⱼ⁻ + 0.50" },
      { type: "p", text: "V no mide éxito, felicidad ni productividad. Mide opcionalidad futura." },
      { type: "p", text: "Alternativa Sigmoid: V = σ(6·(raw − 0.5)) para capturar no-linealidad (activable en configuración)." },
      { type: "zones", items: [
        { label: "V > 0.65", zone: "VIABLE", color: "#10b981", desc: "Zona segura para decisiones." },
        { label: "0.40 < V ≤ 0.65", zone: "MARGINAL", color: "#f59e0b", desc: "Solo decisiones reversibles." },
        { label: "V ≤ 0.40", zone: "CRÍTICA", color: "#ef4444", desc: "Inhibir toda decisión importante." },
      ]},
    ],
  },
  {
    id: "entropy", title: "S(x) — Entropía Funcional", icon: "🔥",
    content: [
      { type: "lead", text: "S(x) cuantifica el grado de desorden interno." },
      { type: "formula", text: "S(x) = Σ wₖ·xₖ  ó  S_Shannon = −Σ p(i|x) log₂ p(i|x)" },
      { type: "p", text: "Insight crucial: en depresión, S puede ser BAJA (certeza disfuncional). La estabilidad aparenta salud cuando es rigidez." },
      { type: "p", text: "Alternativa Shannon: normaliza las variables de desorden como distribución de probabilidad y aplica entropía informacional (activable en configuración)." },
    ],
  },
  {
    id: "inhibition", title: "π(x,u) — Política de Inhibición", icon: "🚦",
    content: [
      { type: "lead", text: "Núcleo operativo del modelo. π evalúa cada acción según tres criterios independientes." },
      { type: "formula", text: "π(x,u) = INHIBIT si ΔV ≤ 0 ∨ ΔS > ε ∨ C < εc" },
      { type: "p", text: "Criterio 1: ΔV ≤ 0 — la acción no mejora viabilidad futura." },
      { type: "p", text: "Criterio 2: ΔS > ε — la acción desestabilizaría (ε = 0.03)." },
      { type: "p", text: "Criterio 3: C < εc — controlabilidad insuficiente (εc = 0.30)." },
      { type: "p", text: "La inhibición no es inacción — es la forma más sofisticada de control." },
    ],
  },
  {
    id: "metapolicy", title: "π²(x) — Meta-Política", icon: "⚜",
    content: [
      { type: "lead", text: "π² opera sobre cuencas de atracción. Detecta atractores patológicos y activa escape." },
      { type: "table", headers: ["Veredicto", "Condición", "Acción"], rows: [
        ["SUSTAIN", "V ≥ V*, Q alto", "Mantener controles actuales."],
        ["MONITOR", "Sin patología, en tránsito", "Observar convergencia."],
        ["ACTIVATE", "Estancamiento sin patología", "Incrementar controles."],
        ["ESCAPE", "Atractor patológico detectado", "Desestabilización controlada."],
      ]},
      { type: "p", text: "Paradoja central: para escapar un atractor patológico, NECESITAS aumentar la entropía temporalmente." },
    ],
  },
  {
    id: "qfunction", title: "Q(x) — Valor Absoluto", icon: "◆",
    content: [
      { type: "lead", text: "Q(x) resuelve: la estabilidad no implica deseabilidad." },
      { type: "formula", text: "Q(x) = V(x) − λ·S(x) − γ·D(x, A*)" },
      { type: "zones", items: [
        { label: "Q > 0.30", zone: "FUNCIONAL", color: "#10b981", desc: "Estado estable y deseable." },
        { label: "0.10 < Q ≤ 0.30", zone: "AMBIGUO", color: "#f59e0b", desc: "Estabilidad cuestionable." },
        { label: "Q ≤ 0.10", zone: "PATOLÓGICO", color: "#ef4444", desc: "Atractor disfuncional." },
      ]},
    ],
  },
  {
    id: "stochastic", title: "W — Capa Estocástica", icon: "🎲",
    content: [
      { type: "lead", text: "Los sistemas vivos son estocásticos. W modela perturbaciones exógenas no controlables." },
      { type: "formula", text: "x_{t+1} = Φ(x_t, u_t) + σ·W_t,  W_t ~ N(0,1)" },
      { type: "p", text: "La simulación Monte Carlo ejecuta N trayectorias independientes con ruido gaussiano, produciendo distribuciones de probabilidad en lugar de predicciones puntuales." },
      { type: "p", text: "Métricas clave: P(ΔV>0) — probabilidad de mejora. Bandas [P₅, P₉₅] — rango del 90% de trayectorias. σ_V — volatilidad de la viabilidad futura." },
      { type: "p", text: "Cuanto mayor la varianza (σ_V), menos confiable la predicción determinista. Si P(ΔV>0) < 0.50, los controles actuales son insuficientes con alta probabilidad." },
    ],
  },
  {
    id: "cognitive", title: "Fenómenos Cognitivos Emergentes", icon: "🧠",
    content: [
      { type: "lead", text: "Del estado interno emergen tres modos cognitivos distinguibles." },
      { type: "table", headers: ["Modo", "Firma", "Significado"], rows: [
        ["INTUICIÓN ◈", "V alta, S baja, |∇V| pequeño", "El sistema tiene certeza funcional. La señal es clara sin simulación."],
        ["DELIBERACIÓN ⟁", "|∇V| grande, V adecuada", "Esfuerzo cognitivo productivo. El sistema procesa información relevante."],
        ["ANSIEDAD ◬", "V baja, S alta", "Conflicto entre señales. Múltiples interpretaciones compiten."],
        ["TRANSICIÓN ◎", "Intermedio", "El sistema no clasifica en modo dominante."],
      ]},
      { type: "p", text: "∇V(x) operacionaliza la 'intuición' como derivada parcial de V respecto a cada variable. Las barras del gradiente muestran QUÉ está tirando V arriba o abajo." },
      { type: "p", text: "La Ansiedad Emergente A(x) = ||∇V − E[V̂]|| mide la divergencia entre intuición (∇V) y simulación (ΔV). Cuando A_modelo diverge de A_sentida, eso es clínicamente informativo." },
    ],
  },
  {
    id: "attractors", title: "Atractores y Cuencas", icon: "⟐",
    content: [
      { type: "lead", text: "El espacio de estados humano tiene múltiples atractores coexistentes, separados por separatrices." },
      { type: "p", text: "La cuenca de atracción B(A) es ASIMÉTRICA. La velocidad de salida es mucho mayor que la de retorno. Bajo estrés crónico, la cuenca se CONTRAE." },
    ],
  },
  {
    id: "pathological", title: "Atractores Patológicos", icon: "🌑",
    content: [
      { type: "lead", text: "Un atractor puede ser estable, auto-reforzante y profundamente dañino." },
      { type: "table", headers: ["Patrón", "Firma", "Mecanismo"], rows: [
        ["Depresión-like", "V baja, S baja, motivación colapsada", "Certeza disfuncional — rigidez sin agencia."],
        ["Ciclo Adictivo", "Alta reactividad, baja resiliencia", "Optimización miope: alivio inmediato refuerza ciclo."],
        ["Indefensión", "C ≈ 0, V baja, ΔV₃₀ ≈ 0", "El modelo interno cree que los controles no funcionan."],
        ["Sobre-rendimiento", "V moderada, S alta", "Atractor frágil. Colapso catastrófico inminente."],
      ]},
    ],
  },
  {
    id: "lyapunov", title: "Estabilidad de Lyapunov", icon: "∿",
    content: [
      { type: "lead", text: "L(x) = α(V*−V)² + β(S−S*)² mide distancia al equilibrio." },
      { type: "formula", text: "L̇ = −2α(V*−V)·V̇ + 2β(S−S*)·Ṡ" },
      { type: "p", text: "L̇ < 0 → convergencia. L̇ ≥ 0 → trampa o divergencia. La 'trampa de Lyapunov': la condición se vuelve más difícil conforme te alejas." },
    ],
  },
  {
    id: "slowfast", title: "D(x)/C(x) — Lento/Rápido", icon: "⏱",
    content: [
      { type: "lead", text: "El sistema tiene dos capas de procesamiento: dinámicas lentas D(x) y condicionales rápidos C(x)." },
      { type: "formula", text: "D(x) = EMA(V, α) — tendencia suavizada a horizonte largo" },
      { type: "formula", text: "C(x|u) = π(x, u_max) vs π(x, u_0) — evaluación condicional inmediata" },
      { type: "p", text: "D(x) captura la DIRECCIÓN del sistema filtrando fluctuaciones. Es la operacionalización de la intuición: una señal de baja entropía que no requiere simulación explícita." },
      { type: "p", text: "C(x) evalúa el HEADROOM: ¿cuánto margen tienen los controles para cambiar el resultado? Utilización = (ΔV_actual − ΔV_peor) / (ΔV_mejor − ΔV_peor). Si headroom ≈ 0, los controles son ineficaces." },
      { type: "table", headers: ["Capa", "Horizonte", "Señal", "Análogo cognitivo"], rows: [
        ["D(x)", "15-30 pasos", "EMA de V", "Intuición — sé que voy mal"],
        ["C(x)", "1 paso", "π bajo escenarios", "Deliberación — ¿qué puedo hacer AHORA?"],
      ]},
      { type: "p", text: "Si D(x) dice DEGRADING pero C(x) muestra alto headroom, hay esperanza. Si D(x) dice DEGRADING y headroom ≈ 0, se necesita intervención externa (π² → ESCAPE)." },
    ],
  },
    {
    id: "philosophy", title: "Raíces Filosóficas", icon: "📜",
    content: [
      { type: "lead", text: "El modelo integra tradiciones formales de más de 2,400 años." },
      { type: "table", headers: ["Pensador", "Contribución", "Expresión en IFC"], rows: [
        ["Platón", "Formas estables", "El atractor A* como forma del decisor funcional"],
        ["Aristóteles", "Causa final", "El telos es la preservación de la agencia futura"],
        ["Ashby", "Variedad Requerida", "Variedad de U debe igualar variedad de W"],
        ["Shannon", "Entropía", "S(x) como ruido en el canal decisional"],
        ["Lyapunov", "Estabilidad", "L(x) como prueba formal de convergencia"],
      ]},
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   STYLES (ORIGINAL — INTACT, new tokens ADDED)
   ═══════════════════════════════════════════════════════════════════════ */
const COLORS = {
  bg:        "#0a0e17",
  surface:   "#111827",
  surface2:  "#1a2234",
  border:    "#1e293b",
  border2:   "#334155",
  text:      "#e2e8f0",
  textDim:   "#94a3b8",
  textMuted: "#64748b",
  viability: "#10b981",
  entropy:   "#f59e0b",
  block:     "#ef4444",
  allow:     "#10b981",
  wait:      "#f59e0b",
  accent:    "#6366f1",
  accent2:   "#8b5cf6",
  net:       "#06b6d4",
  escape:    "#f97316",
  pathological: "#7c3aed",
  // NEW
  mc:        "#14b8a6",
  gradient:  "#a78bfa",
  intuition: "#34d399",
  deliberation: "#818cf8",
  anxietyMode: "#f87171",
};

const fonts = {
  mono: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
  sans: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTS — Original (INTACT) + New
   ═══════════════════════════════════════════════════════════════════════ */

function InfoTip({ tipKey, children, inline }) {
  const [show, setShow] = useState(false);
  const text = TIPS[tipKey];
  if (!text) return children || null;
  return (
    <span style={{ position: "relative", display: inline ? "inline" : "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 14, height: 14, borderRadius: "50%", background: `${COLORS.accent}30`,
        color: COLORS.accent, fontSize: 9, fontWeight: 700, marginLeft: 4, fontFamily: fonts.mono, flexShrink: 0 }}>?</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          width: 320, maxWidth: "90vw", padding: "12px 14px", background: COLORS.surface2,
          border: `1px solid ${COLORS.accent}40`, borderRadius: 10, zIndex: 1000,
          fontSize: 11, fontFamily: fonts.mono, color: COLORS.textDim, lineHeight: 1.65,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`, pointerEvents: "none" }}>
          <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 10, height: 10, background: COLORS.surface2, borderRight: `1px solid ${COLORS.accent}40`,
            borderBottom: `1px solid ${COLORS.accent}40` }} />
          {text}
        </div>
      )}
    </span>
  );
}

function Slider({ label, value, onChange, color = COLORS.accent, icon, tipKey }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: fonts.mono, letterSpacing: 0.5, display: "flex", alignItems: "center" }}>
          {icon && <span style={{ marginRight: 5 }}>{icon}</span>}
          {tipKey ? <InfoTip tipKey={tipKey} inline>{label}</InfoTip> : label}
        </span>
        <span style={{ fontSize: 11, color, fontFamily: fonts.mono, fontWeight: 600 }}>{(value * 100).toFixed(0)}%</span>
      </div>
      <input type="range" min="0" max="100" value={Math.round(value * 100)}
        onChange={e => onChange(+e.target.value / 100)}
        style={{ width: "100%", height: 4, appearance: "none",
          background: `linear-gradient(to right, ${color} ${value * 100}%, ${COLORS.border} ${value * 100}%)`,
          borderRadius: 2, outline: "none", cursor: "pointer", accentColor: color }} />
    </div>
  );
}

function Card({ title, children, icon, accent, style: sx }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: 20, position: "relative", overflow: "hidden", ...sx }}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />}
      {title && (
        <div style={{ fontSize: 11, fontFamily: fonts.mono, color: COLORS.textMuted,
          textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 6 }}>
          {icon && <span style={{ fontSize: 14 }}>{icon}</span>}{title}
        </div>
      )}
      {children}
    </div>
  );
}

function Metric({ label, value, color, sub, tipKey }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fonts.mono, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {tipKey ? <InfoTip tipKey={tipKey} inline>{label}</InfoTip> : label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: fonts.mono, color, lineHeight: 1 }}>
        {typeof value === "number" ? value.toFixed(3) : value}
      </div>
      {sub && <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 4, fontFamily: fonts.mono }}>{sub}</div>}
    </div>
  );
}

function ViabilityGauge({ V, S }) {
  const zone = V > 0.65 ? "VIABLE" : V > 0.4 ? "MARGINAL" : "CRITICAL";
  const zoneColor = V > 0.65 ? COLORS.allow : V > 0.4 ? COLORS.wait : COLORS.block;
  const pct = V * 100;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
        <svg width={180} height={180} viewBox="0 0 180 180">
          <circle cx={90} cy={90} r={78} fill="none" stroke={COLORS.border} strokeWidth={6} />
          <circle cx={90} cy={90} r={78} fill="none" stroke={zoneColor} strokeWidth={6}
            strokeDasharray={`${pct * 4.9} ${490 - pct * 4.9}`}
            strokeDashoffset={122} strokeLinecap="round"
            style={{ transition: "all 0.6s ease", filter: `drop-shadow(0 0 8px ${zoneColor}55)` }} />
          <circle cx={90} cy={90} r={60} fill="none" stroke={COLORS.entropy} strokeWidth={4} opacity={0.3}
            strokeDasharray={`${S * 100 * 3.77} ${377 - S * 100 * 3.77}`}
            strokeDashoffset={94} strokeLinecap="round" style={{ transition: "all 0.6s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: fonts.mono, color: zoneColor }}>{V.toFixed(2)}</div>
          <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>V(x)</div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "4px 14px", borderRadius: 20,
        background: `${zoneColor}18`, border: `1px solid ${zoneColor}40`,
        fontSize: 11, fontFamily: fonts.mono, color: zoneColor, fontWeight: 600, letterSpacing: 1 }}>
        {zone}
      </div>
    </div>
  );
}

function InhibitionVerdict({ state, controls }) {
  const { verdict, reason, color } = inhibitionPolicy(state, controls);
  const dV = computeDeltaV(state, controls);
  const dS = computeDeltaS(state, controls);
  const C = computeControllability(state, controls);
  return (
    <div style={{ background: `${color}08`, border: `1px solid ${color}30`, borderRadius: 12, padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 800, fontFamily: fonts.mono, color, letterSpacing: 3, marginBottom: 8, textShadow: `0 0 20px ${color}40` }}>
        π(x) = {verdict}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: fonts.mono, marginBottom: 16, lineHeight: 1.5 }}>{reason}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { l: "ΔV", v: dV, c: dV > 0 ? COLORS.viability : COLORS.block },
          { l: "ΔS", v: dS, c: dS < 0 ? COLORS.viability : dS > EPSILON_S ? COLORS.block : COLORS.wait },
          { l: "C(x,u)", v: C, c: C >= EPSILON_C ? COLORS.viability : COLORS.wait },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: fonts.mono, color: c }}>{v >= 0 ? "+" : ""}{v.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? COLORS.accent : "transparent",
      color: active ? "#fff" : COLORS.textDim,
      border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
      borderRadius: 8, padding: "7px 14px", fontSize: 10,
      fontFamily: fonts.mono, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s",
    }}>{children}</button>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border2}`,
      borderRadius: 8, padding: "8px 12px", fontFamily: fonts.mono, fontSize: 10 }}>
      <div style={{ color: COLORS.textMuted, marginBottom: 4 }}>t = {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: {(+p.value).toFixed(3)}</div>
      ))}
    </div>
  );
}

// ─── NEW: Toggle Switch ───
function Toggle({ label, value, onChange, color = COLORS.accent, tipKey }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div onClick={() => onChange(!value)} style={{
        width: 36, height: 20, borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
        background: value ? color : COLORS.border, position: "relative",
      }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff",
          position: "absolute", top: 2, left: value ? 18 : 2, transition: "all 0.2s" }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textDim }}>
        {tipKey ? <InfoTip tipKey={tipKey} inline>{label}</InfoTip> : label}
      </span>
    </div>
  );
}

// ─── REVISED Onboarding Modal — Practical daily-use guide ───
function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Tu Sistema de Control Cognitivo",
      icon: "◉",
      body: "Este app modela tu capacidad de decisión como un sistema dinámico. Su objetivo: proteger tu viabilidad — tu capacidad futura de decidir bien. No optimiza rendimiento inmediato; preserva al decisor.",
      highlight: "Piénsalo como un panel de control para tu mente. No te dice QUÉ decidir — te dice CUÁNDO es seguro decidir.",
    },
    {
      title: "Paso 1: Registra tu Estado (cada mañana)",
      icon: "⬡",
      body: "En la pestaña 'X Estado', ajusta las 12 variables para reflejar cómo te sientes HOY. ¿Dormiste bien? ¿Estás cargado de trabajo? ¿Ansioso? Sé honesto — el modelo funciona con datos reales, no aspiracionales.",
      highlight: "Rutina diaria: abre el app → ajusta Estado → lee el Dashboard. 2 minutos.",
    },
    {
      title: "Paso 2: Revisa el Dashboard",
      icon: "📊",
      body: "El Dashboard te muestra: V(x) = tu viabilidad actual, S(x) = tu desorden interno, π(x) = si es seguro actuar, y el Modo Cognitivo = si estás en INTUICIÓN, DELIBERACIÓN o ANSIEDAD. Si π dice BLOCK o WAIT, posterga decisiones importantes.",
      highlight: "Verde = actúa. Amarillo = espera. Rojo = detente. El modo cognitivo te dice POR QUÉ tu mente se siente así.",
    },
    {
      title: "Paso 3: Ajusta tus Controles",
      icon: "⎈",
      body: "En 'U Controles', modela qué acciones tomarás hoy: ¿vas a dormir más? ¿hacer ejercicio? ¿establecer límites? Los controles son tus palancas de influencia. El simulador te muestra cómo impactarán tu trayectoria.",
      highlight: "El gradiente ∇V te dice CUÁL control tendrá más impacto en tu estado actual.",
    },
    {
      title: "Paso 4: Simulación Monte Carlo",
      icon: "🎲",
      body: "La vida no es determinista. El tab Monte Carlo ejecuta cientos de simulaciones con perturbaciones aleatorias para mostrarte: P(ΔV>0) = probabilidad real de mejora, y bandas de confianza al 90%. Si P(ΔV>0) < 50%, tus controles actuales probablemente no son suficientes.",
      highlight: "Transforma 'creo que mejoraré' en 'tengo 73% de probabilidad de mejorar'. Evidencia, no esperanza.",
    },
    {
      title: "Safe-to-Act: ¿Cuándo puedo decidir?",
      icon: "🔮",
      body: "El Oracle escanea tu trayectoria hacia adelante y estima cuándo π(x) dirá ALLOW. Si tienes una decisión importante (cambiar de trabajo, confrontar a alguien, invertir), el Oracle te dice: 'espera ~X días con estos controles'.",
      highlight: "No decidas bajo V baja. El Oracle convierte 'no sé cuándo estaré listo' en una estimación cuantificada.",
    },
    {
      title: "π² Meta-Política: ¿Estás Atrapado?",
      icon: "⚜",
      body: "π evalúa acciones. π² evalúa DÓNDE estás. ¿El atractor donde vives es funcional o patológico? Detecta: depresión-like (rigidez sin agencia), ciclo adictivo (alivio que refuerza el problema), indefensión aprendida, y sobre-rendimiento frágil.",
      highlight: "Si π² dice ESCAPE, necesitas romper tu patrón actual — aunque sea incómodo. La comodidad patológica es peor que la incomodidad de cambiar.",
    },
    {
      title: "Ansiedad Sentida vs. Modelo",
      icon: "⚡",
      body: "Tu ansiedad tiene dos caras: A_sentida (lo que reportas en el slider) y A_modelo (lo que el sistema computa desde ∇V y ΔV). Cuando divergen, hay información clínica: si sientes más ansiedad de la que el modelo predice, puede ser catastrofismo. Si el modelo predice más que tú, puede ser negación.",
      highlight: "No confíes solo en cómo te sientes. No confíes solo en el modelo. La verdad está en la comparación.",
    },
    {
      title: "Configuración Avanzada",
      icon: "⚙",
      body: "Bajo el header hay toggles: Interacciones No-Lineales (fatiga amplifica ansiedad), V Sigmoid (captura saturación), S Shannon (entropía informacional). Experimenta — cada toggle revela una faceta diferente de tu estado.",
      highlight: "Empieza con todo en default. Activa los toggles cuando entiendas qué hacen.",
    },
    {
      title: "Rutina Diaria Recomendada",
      icon: "☀",
      body: "1) Mañana: ajusta Estado → lee Dashboard + Modo Cognitivo → decide si es día de ACTUAR o día de RECUPERAR. 2) Antes de decisiones importantes: revisa π(x) y Safe-to-Act. 3) Fin de semana: corre Monte Carlo para planificar la semana. 4) Si π² dice ESCAPE: consulta el protocolo de escape.",
      highlight: "El app es una brújula, no un piloto automático. Tú decides — pero decides INFORMADO.",
    },
  ];
  const s = steps[step];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}40`,
        borderRadius: 16, padding: 32, maxWidth: 560, width: "100%", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${COLORS.viability}, ${COLORS.accent}, ${COLORS.accent2})`, borderRadius: "16px 16px 0 0" }} />
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{s.icon}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, fontFamily: fonts.sans }}>{s.title}</div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: fonts.mono, marginTop: 4 }}>{step + 1} / {steps.length}</div>
        </div>
        <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.7, marginBottom: 16, fontFamily: fonts.sans }}>{s.body}</div>
        <div style={{ padding: "10px 14px", background: `${COLORS.accent}12`, border: `1px solid ${COLORS.accent}25`,
          borderRadius: 8, fontSize: 12, color: COLORS.accent, fontFamily: fonts.mono, lineHeight: 1.5, marginBottom: 20 }}>
          💡 {s.highlight}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} style={{ cursor: "pointer",
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? COLORS.accent : i < step ? COLORS.viability : COLORS.border,
              transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button onClick={() => step > 0 ? setStep(step - 1) : onClose()} style={{
            flex: 1, padding: "10px 0", background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 8, color: COLORS.textDim, fontFamily: fonts.mono, fontSize: 12, cursor: "pointer" }}>
            {step === 0 ? "Saltar" : "← Anterior"}
          </button>
          <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()} style={{
            flex: 1, padding: "10px 0", background: COLORS.accent, border: "none",
            borderRadius: 8, color: "#fff", fontFamily: fonts.mono, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {step < steps.length - 1 ? "Siguiente →" : "✓ Empezar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TheoryRenderer({ section }) {
  return (
    <div>
      {section.content.map((block, i) => {
        if (block.type === "lead") return <div key={i} style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.7, marginBottom: 16, fontFamily: fonts.sans, fontWeight: 500 }}>{block.text}</div>;
        if (block.type === "p") return <div key={i} style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.75, marginBottom: 12, fontFamily: fonts.sans }}>{block.text}</div>;
        if (block.type === "formula") return <div key={i} style={{ padding: "12px 16px", background: COLORS.surface2, borderRadius: 8, fontFamily: fonts.mono, fontSize: 14, color: COLORS.accent, textAlign: "center", marginBottom: 14, border: `1px solid ${COLORS.accent}20`, letterSpacing: 1 }}>{block.text}</div>;
        if (block.type === "quote") return <div key={i} style={{ padding: "14px 18px", borderLeft: `3px solid ${COLORS.accent2}`, background: `${COLORS.accent2}08`, borderRadius: "0 8px 8px 0", fontFamily: fonts.sans, fontSize: 13, color: COLORS.textDim, fontStyle: "italic", lineHeight: 1.7, marginBottom: 14 }}>"{block.text}"</div>;
        if (block.type === "table") return (
          <div key={i} style={{ overflowX: "auto", marginBottom: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fonts.mono, fontSize: 10 }}>
              <thead><tr>{block.headers.map((h, j) => <th key={j} style={{ padding: "10px 8px", textAlign: "left", color: COLORS.accent, borderBottom: `2px solid ${COLORS.accent}30`, fontSize: 10, letterSpacing: 0.5 }}>{h}</th>)}</tr></thead>
              <tbody>{block.rows.map((row, j) => <tr key={j} style={{ borderBottom: `1px solid ${COLORS.border}` }}>{row.map((cell, k) => <td key={k} style={{ padding: "8px", color: k === 0 ? COLORS.text : COLORS.textDim, fontSize: 11, lineHeight: 1.5 }}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
        if (block.type === "zones") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {block.items.map((z, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                background: `${z.color}08`, border: `1px solid ${z.color}25`, borderRadius: 8 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: z.color, fontWeight: 700, minWidth: 100 }}>{z.label}</div>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: z.color, fontWeight: 600, minWidth: 80 }}>{z.zone}</div>
                <div style={{ fontFamily: fonts.sans, fontSize: 11, color: COLORS.textDim }}>{z.desc}</div>
              </div>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MONTE CARLO ANIMATION — Branching Paths of Life
   Symbolic visualization: from one present moment, N futures diverge
   ═══════════════════════════════════════════════════════════════════════════ */

function MonteCarloAnimation({ N, onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * 2;
    const H = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = W / 2, h = H / 2;

    const NUM_VISIBLE = Math.min(N, 60);
    const STEPS = 80;
    const paths = [];
    const seedRand = (i) => {
      let s = i * 9301 + 49297;
      return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    };

    for (let i = 0; i < NUM_VISIBLE; i++) {
      const rng = seedRand(i + Date.now() % 1000);
      const drift = (rng() - 0.45) * 0.012;
      const vol = 0.006 + rng() * 0.014;
      const points = [{ x: 0, y: 0.5 }];
      for (let t = 1; t <= STEPS; t++) {
        const prev = points[t - 1];
        const gauss = Math.sqrt(-2 * Math.log(Math.max(0.0001, rng()))) * Math.cos(2 * Math.PI * rng());
        const ny = Math.max(0.02, Math.min(0.98, prev.y + drift + vol * gauss));
        points.push({ x: t / STEPS, y: ny });
      }
      const finalY = points[STEPS].y;
      const hue = finalY > 0.55 ? 160 : finalY > 0.42 ? 45 : 0;
      const sat = 70 + rng() * 20;
      const light = 50 + rng() * 15;
      paths.push({ points, color: `hsla(${hue}, ${sat}%, ${light}%, `, delay: rng() * 0.3 });
    }

    const particles = [];
    for (let i = 0; i < 40; i++) {
      const rng = seedRand(i + 7777);
      particles.push({
        x: 0.85 + rng() * 0.12, y: 0.25 + rng() * 0.5,
        r: 1 + rng() * 2.5, speed: 0.002 + rng() * 0.004,
        phase: rng() * Math.PI * 2, hue: 160 + rng() * 40,
      });
    }

    const TOTAL_DURATION = 3200;
    const BRANCH_PHASE = 0.65;
    const SETTLE_PHASE = 0.90;
    let startTime = null;

    const messages = [
      { at: 0.00, text: "Un solo momento presente..." },
      { at: 0.15, text: "Los caminos comienzan a divergir..." },
      { at: 0.40, text: `${N.toLocaleString()} futuros posibles desplegándose...` },
      { at: 0.70, text: "Algunos ascienden. Otros descienden." },
      { at: 0.88, text: "La probabilidad habla..." },
    ];

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / TOTAL_DURATION);
      setProgress(t);

      if (t < BRANCH_PHASE) setPhase(0);
      else if (t < SETTLE_PHASE) setPhase(1);
      else setPhase(2);

      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = COLORS.border + "40";
      ctx.lineWidth = 0.3;
      for (let gx = 0; gx < w; gx += 30) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 30) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      ctx.strokeStyle = COLORS.viability + "20";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      const vStarY = h * (1 - 0.65);
      ctx.beginPath(); ctx.moveTo(0, vStarY); ctx.lineTo(w, vStarY); ctx.stroke();
      ctx.setLineDash([]);

      const originX = w * 0.06;
      const originY = h * 0.5;
      const glowR = 8 + Math.sin(elapsed * 0.005) * 3;
      const originGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, glowR * 3);
      originGrad.addColorStop(0, COLORS.mc + "90");
      originGrad.addColorStop(0.5, COLORS.mc + "30");
      originGrad.addColorStop(1, "transparent");
      ctx.fillStyle = originGrad;
      ctx.fillRect(originX - glowR * 3, originY - glowR * 3, glowR * 6, glowR * 6);
      ctx.beginPath();
      ctx.arc(originX, originY, glowR * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.mc;
      ctx.fill();

      const drawProgress = t < BRANCH_PHASE ? t / BRANCH_PHASE : 1;
      const fadeIn = t < 0.08 ? t / 0.08 : 1;

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const pathProgress = Math.max(0, Math.min(1, (drawProgress - path.delay) / (1 - path.delay)));
        if (pathProgress <= 0) continue;
        const stepsToShow = Math.floor(pathProgress * STEPS);
        if (stepsToShow < 2) continue;

        const finalDeviation = Math.abs(path.points[STEPS].y - 0.5);
        const baseOpacity = (0.15 + (1 - finalDeviation) * 0.45) * fadeIn;
        const settleAlpha = t > BRANCH_PHASE
          ? 0.5 + 0.5 * Math.sin((t - BRANCH_PHASE) * 15 + i * 0.3)
          : 1;

        ctx.beginPath();
        const startPt = path.points[0];
        ctx.moveTo(originX + startPt.x * (w * 0.88), h * (1 - startPt.y));

        for (let s = 1; s <= stepsToShow; s++) {
          const pt = path.points[s];
          const px = originX + pt.x * (w * 0.88);
          const py = h * (1 - pt.y);
          if (s === 1) { ctx.lineTo(px, py); }
          else {
            const prev = path.points[s - 1];
            const cpx = originX + ((prev.x + pt.x) / 2) * (w * 0.88);
            const cpy = h * (1 - (prev.y + pt.y) / 2);
            ctx.quadraticCurveTo(originX + prev.x * (w * 0.88), h * (1 - prev.y), cpx, cpy);
          }
        }

        ctx.strokeStyle = path.color + (baseOpacity * settleAlpha).toFixed(2) + ")";
        ctx.lineWidth = 1.2 + (1 - finalDeviation) * 0.8;
        ctx.stroke();

        if (t < SETTLE_PHASE && stepsToShow < STEPS) {
          const head = path.points[stepsToShow];
          const hx = originX + head.x * (w * 0.88);
          const hy = h * (1 - head.y);
          ctx.beginPath();
          ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = path.color + "0.7)";
          ctx.fill();
        }
      }

      if (t > BRANCH_PHASE) {
        const cloudAlpha = Math.min(1, (t - BRANCH_PHASE) / (SETTLE_PHASE - BRANCH_PHASE));
        for (const p of particles) {
          const px = originX + p.x * (w * 0.88);
          const py = h * (1 - p.y);
          const breathe = 1 + 0.3 * Math.sin(elapsed * p.speed + p.phase);
          ctx.beginPath();
          ctx.arc(px, py, p.r * breathe, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${cloudAlpha * 0.4})`;
          ctx.fill();
        }
      }

      const currentMsg = [...messages].reverse().find(m => t >= m.at);
      if (currentMsg) {
        const msgAlpha = t > 0.92 ? Math.max(0, 1 - (t - 0.92) / 0.08) : Math.min(1, (t - currentMsg.at) / 0.08);
        ctx.font = "11px Inter, SF Pro Display, sans-serif";
        ctx.fillStyle = `rgba(226, 232, 240, ${msgAlpha})`;
        ctx.textAlign = "center";
        ctx.fillText(currentMsg.text, w / 2, h - 14);
      }

      ctx.fillStyle = COLORS.mc + "30";
      ctx.fillRect(0, h - 3, w, 3);
      ctx.fillStyle = COLORS.mc;
      ctx.fillRect(0, h - 3, w * t, 3);

      if (t > 0.1) {
        const shown = Math.floor(t * N);
        ctx.font = "bold 10px SF Mono, Fira Code, monospace";
        ctx.fillStyle = COLORS.mc + "90";
        ctx.textAlign = "right";
        ctx.fillText(shown.toLocaleString() + " / " + N.toLocaleString(), w - 10, 16);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        setTimeout(() => onComplete(), 200);
      }
    }

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [N, onComplete]);

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: 8, overflow: "hidden", background: COLORS.bg, border: `1px solid ${COLORS.mc}30` }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 220, display: "block" }}
      />
      <div style={{
        position: "absolute", top: 10, left: 0, right: 0, textAlign: "center",
        fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5,
        color: COLORS.mc + "cc", textTransform: "uppercase",
      }}>
        {phase === 0 && "Bifurcando trayectorias..."}
        {phase === 1 && "Convergiendo al espacio de probabilidad..."}
        {phase === 2 && "Calculando distribución final..."}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP — Enhanced with all 4 batches
   ═══════════════════════════════════════════════════════════════════════ */
export default function InhibitionFirstControl() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [theorySection, setTheorySection] = useState("overview");

  // NEW state for Batch toggles
  const [mcEnabled, setMcEnabled] = useState(false);
  const [mcN, setMcN] = useState(10000);
  const [mcSigma, setMcSigma] = useState(0.04);
  const [nlEnabled, setNlEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // BATCH 5 state — MC manual trigger + Decision Log
  const [mcTrigger, setMcTrigger] = useState(0);
  const [mcRunning, setMcRunning] = useState(false);
  const [mcAnimating, setMcAnimating] = useState(false);
  const [decisionLog, setDecisionLog] = useState([]);

  // Record history (ORIGINAL — INTACT)
  useEffect(() => {
    const V = computeViability(state);
    const S = computeEntropy(state);
    const p = inhibitionPolicy(state, controls);
    setHistory(prev => {
      const next = [...prev, { t: prev.length, V: +V.toFixed(3), S: +S.toFixed(3), verdict: p.verdict }];
      return next.slice(-50);
    });
  }, [state]);

  // ORIGINAL computations (INTACT)
  const V = computeViability(state);
  const S = computeEntropy(state);
  const C = computeControllability(state, controls);
  const Q = computeQ(state);
  const L = computeLyapunov(state);
  const trajectory = useMemo(() => generateTrajectory(state, controls), [state, controls]);
  const phaseData = useMemo(() => generatePhaseSpace(state, controls), [state, controls]);
  const metaP = useMemo(() => metaPolicy(state, controls), [state, controls]);
  const pathDetection = useMemo(() => detectPathologicalAttractor(state, controls), [state, controls]);

  const radarData = useMemo(() => [
    { axis: "Energía", val: +(1 - state.fatigue).toFixed(2) },
    { axis: "Claridad", val: +(1 - state.cognitiveLoad).toFixed(2) },
    { axis: "Motivación", val: +state.motivation.toFixed(2) },
    { axis: "Calma", val: +(1 - state.anxiety).toFixed(2) },
    { axis: "Enfoque", val: +state.focusScore.toFixed(2) },
    { axis: "Resiliencia", val: +state.resilience.toFixed(2) },
  ], [state]);

  // NEW computations (Batch 2)
  const gradV = useMemo(() => computeGradientV(state), [state]);
  const cogMode = useMemo(() => classifyCognitiveMode(state, controls), [state, controls]);
  const emergentA = useMemo(() => computeEmergentAnxiety(state, controls), [state, controls]);
  const oracle = useMemo(() => safeToActOracle(state, controls), [state, controls]);

  // Monte Carlo (Batch 1) — compute ONLY on manual trigger (mcTrigger increment)
  const mcResults = useMemo(() => {
    if (mcTrigger === 0) return null;
    return runMonteCarlo(state, controls, mcN, 30, mcSigma, nlEnabled);
  }, [mcTrigger]);

  // Gradient data for bar chart
  const gradData = useMemo(() => {
    return Object.entries(gradV).map(([k, v]) => ({
      name: k.replace(/([A-Z])/g, " $1").trim().substring(0, 12),
      key: k,
      value: +v,
      fill: v > 0 ? COLORS.viability : COLORS.block,
    })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [gradV]);

  const updateState = (key, val) => setState(p => ({ ...p, [key]: val }));
  const updateControl = (key, val) => setControls(p => ({ ...p, [key]: val }));

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: fonts.sans, padding: "24px 20px" }}>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
          Inhibition-First Control Model · v3
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5,
          background: `linear-gradient(135deg, ${COLORS.viability}, ${COLORS.accent}, ${COLORS.accent2})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ℋ = (X, U, W, V, S, Φ, π, π², Q)
        </h1>
        <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fonts.mono, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          Viability-First Cognitive Operating System
          <button onClick={() => setShowOnboarding(true)} style={{ background: `${COLORS.accent}20`, border: `1px solid ${COLORS.accent}40`, borderRadius: 6, padding: "2px 8px", fontSize: 9, color: COLORS.accent, fontFamily: fonts.mono, cursor: "pointer" }}>? Guía</button>
          <button onClick={() => setShowSettings(!showSettings)} style={{ background: showSettings ? `${COLORS.mc}20` : "transparent", border: `1px solid ${showSettings ? COLORS.mc : COLORS.border}40`, borderRadius: 6, padding: "2px 8px", fontSize: 9, color: showSettings ? COLORS.mc : COLORS.textMuted, fontFamily: fonts.mono, cursor: "pointer" }}>⚙ Config</button>
        </div>
      </div>

      {/* Settings Panel (NEW) */}
      {showSettings && (
        <div style={{ maxWidth: 700, margin: "0 auto 16px", padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Toggle label="Monte Carlo (W estocástico)" value={mcEnabled} onChange={setMcEnabled} color={COLORS.mc} tipKey="monteCarlo" />
          <Toggle label="Interacciones No-Lineales" value={nlEnabled} onChange={setNlEnabled} color={COLORS.escape} tipKey="nonLinear" />
          {mcEnabled && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted }}>N=</span>
              {[500, 1000, 5000, 10000].map(n => (
                <button key={n} onClick={() => setMcN(n)} style={{ padding: "2px 8px", fontSize: 9, fontFamily: fonts.mono, borderRadius: 4, border: `1px solid ${mcN === n ? COLORS.mc : COLORS.border}`, background: mcN === n ? `${COLORS.mc}20` : "transparent", color: mcN === n ? COLORS.mc : COLORS.textMuted, cursor: "pointer" }}>{n}</button>
              ))}
              <span style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, marginLeft: 8 }}>σ=</span>
              {[0.02, 0.04, 0.08].map(sig => (
                <button key={sig} onClick={() => setMcSigma(sig)} style={{ padding: "2px 8px", fontSize: 9, fontFamily: fonts.mono, borderRadius: 4, border: `1px solid ${mcSigma === sig ? COLORS.mc : COLORS.border}`, background: mcSigma === sig ? `${COLORS.mc}20` : "transparent", color: mcSigma === sig ? COLORS.mc : COLORS.textMuted, cursor: "pointer" }}>{sig}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {[
          ["dashboard", "◉ Dashboard"],
          ["state", "X Estado"],
          ["controls", "U Controles"],
          ["simulator", "Δ Simulador"],
          ["montecarlo", "🎲 Monte Carlo"],
          ["attractor", "⟐ Atractor"],
          ["policy", "π Política"],
          ["metapolicy", "π² Meta"],
          ["theory", "📚 Teoría"],
        ].map(([id, label]) => (
          <TabBtn key={id} active={activeTab === id} onClick={() => setActiveTab(id)}>{label}</TabBtn>
        ))}
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(PRESETS).map(([k, { label, state: ps }]) => (
          <button key={k} onClick={() => setState({ ...DEFAULT_STATE, ...ps })} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono, cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
        ))}
        <button onClick={() => { setState(DEFAULT_STATE); setControls(DEFAULT_CONTROLS); }} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 10, color: COLORS.textMuted, fontFamily: fonts.mono, cursor: "pointer" }}>↺ Reset</button>
      </div>

      {/* ═══ DASHBOARD TAB (enhanced with cognitive mode, gradient, oracle) ═══ */}
      {activeTab === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Viability Monitor" icon="◉" accent={COLORS.viability}>
            <ViabilityGauge V={V} S={S} />
            {/* Cognitive Mode Badge (NEW) */}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: `${cogMode.color}12`, border: `1px solid ${cogMode.color}35` }}>
                <span style={{ fontSize: 16 }}>{cogMode.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: fonts.mono, color: cogMode.color }}>{cogMode.mode}</span>
                <InfoTip tipKey="cogMode" inline><span></span></InfoTip>
              </div>
              <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono, marginTop: 4, lineHeight: 1.4 }}>{cogMode.desc}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
              <Metric label="V(x)" value={V} color={COLORS.viability} sub="viabilidad" tipKey="V" />
              <Metric label="S(x)" value={S} color={COLORS.entropy} sub="entropía" tipKey="S" />
              <Metric label="C(x,u)" value={C} color={COLORS.accent} sub="controlabilidad" tipKey="C" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, flexWrap: "wrap", gap: 8 }}>
              <Metric label="Q(x)" value={Q} color={Q > 0.3 ? COLORS.viability : Q > 0.1 ? COLORS.wait : COLORS.block} sub="valor absoluto" tipKey="Q" />
              <Metric label="L(x)" value={L} color={L < 0.05 ? COLORS.viability : L < 0.2 ? COLORS.wait : COLORS.block} sub="lyapunov" tipKey="L" />
            </div>
          </Card>

          <Card title="Inhibition Engine π(x)" icon="⛊" accent={COLORS.accent}>
            <InhibitionVerdict state={state} controls={controls} />
            {/* π² summary */}
            <div style={{ marginTop: 14, padding: 12, background: `${metaP.color}08`, border: `1px solid ${metaP.color}30`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>
                <InfoTip tipKey="pi2" inline>META-POLÍTICA π²</InfoTip>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: fonts.mono, color: metaP.color, letterSpacing: 2 }}>{metaP.verdict}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono, marginTop: 4, lineHeight: 1.4 }}>{metaP.reason}</div>
            </div>
            {/* Emergent Anxiety comparison (NEW) */}
            <div style={{ marginTop: 10, padding: 10, background: COLORS.surface2, borderRadius: 8, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>A_SENTIDA</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.entropy }}>{(state.anxiety).toFixed(2)}</div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>vs</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}><InfoTip tipKey="emergentAnxiety" inline>A_MODELO</InfoTip></div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.accent2 }}>{emergentA.toFixed(2)}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>DELTA</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.mono, color: Math.abs(state.anxiety - emergentA) > 0.15 ? COLORS.escape : COLORS.viability }}>
                  {(state.anxiety - emergentA) >= 0 ? "+" : ""}{(state.anxiety - emergentA).toFixed(2)}
                </div>
              </div>
            </div>
            {/* Safe-to-Act quick (NEW) */}
            <div style={{ marginTop: 10, padding: 8, background: `${oracle.safe ? COLORS.viability : COLORS.block}08`, border: `1px solid ${oracle.safe ? COLORS.viability : COLORS.block}25`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}><InfoTip tipKey="safeOracle" inline>SAFE-TO-ACT ORACLE</InfoTip></div>
              <div style={{ fontSize: 12, fontWeight: 600, fontFamily: fonts.mono, color: oracle.safe ? COLORS.viability : COLORS.block, marginTop: 2 }}>
                {oracle.safe ? `🔮 Ventana segura: ~${oracle.step} días` : "⚠ No alcanzable en horizonte (60d)"}
              </div>
            </div>
          </Card>

          {/* Radar */}
          <Card title="Estado Interno X" icon="⬡" accent={COLORS.accent2}>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={COLORS.border} />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: COLORS.textDim, fontFamily: fonts.mono }} />
                <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
                <Radar dataKey="val" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            {/* Gradient ∇V mini (NEW) */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 6 }}>
                <InfoTip tipKey="gradV" inline>∇V(x) — QUÉ MUEVE TU VIABILIDAD</InfoTip>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {gradData.slice(0, 6).map(g => (
                  <div key={g.key} style={{ fontSize: 9, fontFamily: fonts.mono, padding: "2px 6px", borderRadius: 4, background: `${g.fill}15`, color: g.fill, border: `1px solid ${g.fill}30` }}>
                    {g.name}: {g.value >= 0 ? "+" : ""}{g.value.toFixed(3)}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Trajectory */}
          <Card title="Trayectoria V(x) / S(x)" icon="〰" accent={COLORS.net} style={{ gridColumn: "1 / -1" }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trajectory}>
                <defs>
                  <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.viability} stopOpacity={0.3} /><stop offset="100%" stopColor={COLORS.viability} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.entropy} stopOpacity={0.2} /><stop offset="100%" stopColor={COLORS.entropy} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0.4} stroke={COLORS.block} strokeDasharray="6 4" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="V" stroke={COLORS.viability} fill="url(#gV)" strokeWidth={2} name="V(x)" />
                <Area type="monotone" dataKey="S" stroke={COLORS.entropy} fill="url(#gS)" strokeWidth={2} name="S(x)" />
                <Line type="monotone" dataKey="net" stroke={COLORS.net} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="V−S" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* ═══ STATE TAB (ORIGINAL + gradient bars) ═══ */}
      {activeTab === "state" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Card title="Variables Negativas (↑ = peor)" icon="▼" accent={COLORS.block}>
            {[["cognitiveLoad","Carga Cognitiva","🧠"],["fatigue","Fatiga","😴"],["anxiety","Ansiedad","⚡"],["reactivity","Reactividad","💢"],["taskSwitchRate","Tasa Cambio Tareas","🔄"],["calendarLoad","Carga Agenda","📅"]].map(([k,l,i]) => (
              <Slider key={k} label={l} icon={i} value={state[k]} onChange={v => updateState(k, v)} color={COLORS.block} tipKey={k} />
            ))}
          </Card>
          <Card title="Variables Positivas (↑ = mejor)" icon="▲" accent={COLORS.viability}>
            {[["motivation","Motivación","🔥"],["sleepQuality","Calidad Sueño","🌙"],["hrv","HRV","💓"],["focusScore","Score Enfoque","🎯"],["hydration","Hidratación","💧"],["resilience","Resiliencia","🛡"]].map(([k,l,i]) => (
              <Slider key={k} label={l} icon={i} value={state[k]} onChange={v => updateState(k, v)} color={COLORS.viability} tipKey={k} />
            ))}
          </Card>
          <Card title="∇V(x) — Gradiente de Viabilidad" icon="∂" accent={COLORS.gradient} style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono, marginBottom: 8 }}>
              <InfoTip tipKey="gradV" inline>Derivada parcial de V respecto a cada variable</InfoTip> — barras verdes = empujan V arriba, rojas = tiran V abajo
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gradData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: COLORS.textDim, fontFamily: fonts.mono }} stroke={COLORS.border} width={75} />
                <Tooltip content={({ active, payload }) => active && payload?.[0] ? <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: 8, fontFamily: fonts.mono, fontSize: 10 }}><span style={{ color: payload[0].payload.fill }}>∂V/∂{payload[0].payload.key} = {payload[0].value.toFixed(4)}</span></div> : null} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {gradData.map((g, i) => <Cell key={i} fill={g.fill} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10, flexWrap: "wrap", gap: 16 }}>
              <Metric label="V(x)" value={V} color={COLORS.viability} sub="viabilidad" tipKey="V" />
              <Metric label="S(x)" value={S} color={COLORS.entropy} sub="entropía" tipKey="S" />
              <Metric label="Q(x)" value={Q} color={Q > 0.3 ? COLORS.viability : Q > 0.1 ? COLORS.wait : COLORS.block} sub="valor absoluto" tipKey="Q" />
              <Metric label="Modo" value={cogMode.mode} color={cogMode.color} tipKey="cogMode" />
            </div>
          </Card>
        </div>
      )}

      {/* ═══ CONTROLS TAB (ORIGINAL — INTACT) ═══ */}
      {activeTab === "controls" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <Card title="Inputs de Control U" icon="⎈" accent={COLORS.accent}>
            {[["sleep","Sueño","🛏"],["rest","Descanso","🧘"],["exercise","Ejercicio","🏃"],["taskBreaks","Pausas Cognitivas","⏸"],["journaling","Journaling","📝"],["socialTime","Tiempo Social","👥"],["waterIntake","Hidratación","🚰"],["deepWork","Deep Work","🔬"],["boundaries","Límites / Fronteras","🚧"]].map(([k,l,i]) => (
              <Slider key={k} label={l} icon={i} value={controls[k]} onChange={v => updateControl(k, v)} color={COLORS.accent} tipKey={k} />
            ))}
          </Card>
          <Card title="Impacto Proyectado" icon="⊕" accent={COLORS.viability}>
            <InhibitionVerdict state={state} controls={controls} />
            <div style={{ marginTop: 16, fontSize: 10, fontFamily: fonts.mono, color: COLORS.textMuted, marginBottom: 8, letterSpacing: 1 }}>ESTADO PROYECTADO POST-CONTROL</div>
            {(() => {
              const proj = projectState(state, controls);
              const pV = computeViability(proj); const pS = computeEntropy(proj);
              return <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
                <Metric label="V proj" value={pV} color={COLORS.viability} />
                <Metric label="S proj" value={pS} color={COLORS.entropy} />
                <Metric label="ΔV" value={computeDeltaV(state, controls)} color={computeDeltaV(state, controls) > 0 ? COLORS.viability : COLORS.block} />
                <Metric label="ΔS" value={computeDeltaS(state, controls)} color={computeDeltaS(state, controls) < 0 ? COLORS.viability : COLORS.block} />
              </div>;
            })()}
          </Card>
        </div>
      )}

      {/* ═══ SIMULATOR TAB (ORIGINAL + Safe-to-Act enhanced) ═══ */}
      {activeTab === "simulator" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Delta Simulator — What If?" icon="Δ" accent={COLORS.net}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 14, fontFamily: fonts.mono, lineHeight: 1.6 }}>
              Ajusta controles y observa la trayectoria a 30 pasos.
              {nlEnabled && <span style={{ color: COLORS.escape }}> ⚡ Interacciones no-lineales activas.</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(controls).map(([k, v]) => (
                <Slider key={k} label={k} value={v} onChange={val => updateControl(k, val)} color={COLORS.net} tipKey={k} />
              ))}
            </div>
          </Card>
          <Card title="Trayectoria Simulada" icon="〰" accent={COLORS.net}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trajectory}>
                <defs>
                  <linearGradient id="gVs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.viability} stopOpacity={0.25} /><stop offset="100%" stopColor={COLORS.viability} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gSs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.entropy} stopOpacity={0.15} /><stop offset="100%" stopColor={COLORS.entropy} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0.4} stroke={COLORS.block} strokeDasharray="6 4" strokeOpacity={0.4} />
                <ReferenceLine y={0.65} stroke={COLORS.viability} strokeDasharray="6 4" strokeOpacity={0.3} />
                {oracle.safe && <ReferenceLine x={oracle.step} stroke={COLORS.allow} strokeDasharray="4 4" strokeWidth={2} label={{ value: `Safe @t=${oracle.step}`, fontSize: 9, fill: COLORS.allow }} />}
                <Area type="monotone" dataKey="V" stroke={COLORS.viability} fill="url(#gVs)" strokeWidth={2.5} name="V(x)" />
                <Area type="monotone" dataKey="S" stroke={COLORS.entropy} fill="url(#gSs)" strokeWidth={2} name="S(x)" />
                <Line type="monotone" dataKey="net" stroke={COLORS.net} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="V−S" />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: fonts.mono }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 12, padding: 10, background: COLORS.surface2, borderRadius: 8, fontSize: 10, fontFamily: fonts.mono, color: COLORS.textDim, display: "flex", justifyContent: "space-around" }}>
              <span>V₀ = {trajectory[0]?.V}</span><span>V₃₀ = {trajectory[trajectory.length - 1]?.V}</span>
              <span>S₀ = {trajectory[0]?.S}</span><span>S₃₀ = {trajectory[trajectory.length - 1]?.S}</span>
            </div>
          </Card>
          {/* Safe-to-Act Oracle (enhanced) */}
          <Card title="Safe-to-Act Oracle" icon="🔮" accent={COLORS.allow} style={{ gridColumn: "1 / -1" }}>
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 14, fontFamily: fonts.mono, color: oracle.safe ? COLORS.allow : COLORS.block, marginBottom: 6 }}>
                {oracle.safe
                  ? `✓ Ventana segura estimada en t = ${oracle.step} (V = ${oracle.V.toFixed(2)}, S = ${oracle.S.toFixed(2)}, Q = ${oracle.Q.toFixed(2)})`
                  : "✗ No se alcanza zona segura en el horizonte (60 pasos) con controles actuales"
                }
              </div>
              <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textMuted }}>
                Criterio: π(x_t, u) = ALLOW (ΔV &gt; 0 ∧ ΔS ≤ ε ∧ C ≥ ε_c)
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══ MONTE CARLO TAB (NEW — Batch 1) ═══ */}
      {activeTab === "montecarlo" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Simulación Monte Carlo" icon="🎲" accent={COLORS.mc}>
            <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: fonts.mono, lineHeight: 1.6, marginBottom: 12 }}>
              <InfoTip tipKey="monteCarlo" inline>N = {mcN} trayectorias</InfoTip> con perturbación estocástica W ~ N(0, σ²), σ = {mcSigma}.
              {nlEnabled && <span style={{ color: COLORS.escape }}> ⚡ Interacciones no-lineales activas.</span>}
            </div>
            {mcAnimating ? (
              <MonteCarloAnimation
                N={mcN}
                onComplete={() => {
                  setMcAnimating(false);
                  setMcEnabled(true);
                  setMcTrigger(t => t + 1);
                }}
              />
            ) : mcResults ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                  <div style={{ textAlign: "center", padding: 12, background: COLORS.surface2, borderRadius: 8 }}>
                    <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>P(ΔV &gt; 0)</div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: fonts.mono, color: mcResults.pDeltaVPos > 0.5 ? COLORS.viability : COLORS.block }}>
                      {(mcResults.pDeltaVPos * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: COLORS.surface2, borderRadius: 8 }}>
                    <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>V̄₃₀ ± σ</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.mc }}>
                      {mcResults.finalVMean.toFixed(3)}
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono }}>±{mcResults.finalVStd.toFixed(3)}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: COLORS.surface2, borderRadius: 8 }}>
                    <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1 }}>S̄₃₀</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.entropy }}>{mcResults.finalSMean.toFixed(3)}</div>
                  </div>
                </div>
                {/* Risk quantiles */}
                <div style={{ padding: 10, background: COLORS.surface2, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 6 }}>DISTRIBUCIÓN V₃₀ — Cuantiles</div>
                  <div style={{ display: "flex", justifyContent: "space-around", fontSize: 11, fontFamily: fonts.mono }}>
                    {["V_p5", "V_p25", "V_p50", "V_p75", "V_p95"].map(k => {
                      const v = mcResults.stats[mcResults.stats.length - 1]?.[k] || 0;
                      return <div key={k} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: COLORS.textMuted }}>{k.replace("V_", "")}</div>
                        <div style={{ fontWeight: 700, color: v > 0.65 ? COLORS.viability : v > 0.4 ? COLORS.wait : COLORS.block }}>{v.toFixed(3)}</div>
                      </div>;
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button
                    onClick={() => setMcAnimating(true)}
                    style={{
                      background: `${COLORS.mc}20`,
                      color: COLORS.mc,
                      border: `1px solid ${COLORS.mc}40`,
                      borderRadius: 6,
                      padding: "6px 18px",
                      fontSize: 10,
                      fontFamily: fonts.mono,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: 0.5,
                    }}
                  >
                    ↻ Re-ejecutar simulación ({mcN} escenarios)
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 20 }}>
                <button
                  onClick={() => setMcAnimating(true)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.mc}, ${COLORS.accent})`,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 28px",
                    fontSize: 13,
                    fontFamily: fonts.mono,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: 1,
                    boxShadow: `0 0 20px ${COLORS.mc}40`,
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = `0 0 30px ${COLORS.mc}60`; }}
                  onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = `0 0 20px ${COLORS.mc}40`; }}
                >
                  ▶ EJECUTAR SIMULACIÓN ({mcN} escenarios, σ={mcSigma})
                </button>
                <div style={{ marginTop: 10, fontSize: 10, color: COLORS.textDim, fontFamily: fonts.mono }}>
                  Ejecuta N={mcN} trayectorias estocásticas con perturbación W ~ N(0, {mcSigma}²)
                </div>
              </div>
            )}
          </Card>

          {/* MC Fan Chart */}
          <Card title="Fan Chart — Bandas de Confianza V(x)" icon="〰" accent={COLORS.mc}>
            {mcResults ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mcResults.stats}>
                  <defs>
                    <linearGradient id="gMC90" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.mc} stopOpacity={0.15} /><stop offset="100%" stopColor={COLORS.mc} stopOpacity={0.05} /></linearGradient>
                    <linearGradient id="gMC50" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.mc} stopOpacity={0.25} /><stop offset="100%" stopColor={COLORS.mc} stopOpacity={0.1} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0.65} stroke={COLORS.viability} strokeDasharray="6 4" strokeOpacity={0.3} label={{ value: "V*", fontSize: 9, fill: COLORS.viability }} />
                  <ReferenceLine y={0.4} stroke={COLORS.block} strokeDasharray="6 4" strokeOpacity={0.3} />
                  <Area type="monotone" dataKey="V_p95" stroke="none" fill="url(#gMC90)" name="P₉₅" />
                  <Area type="monotone" dataKey="V_p5" stroke="none" fill={COLORS.bg} name="Pâ'… fill" />
                  <Area type="monotone" dataKey="V_p75" stroke="none" fill="url(#gMC50)" name="P₇₅" />
                  <Area type="monotone" dataKey="V_p25" stroke="none" fill={COLORS.bg} name="Pâ''â'… fill" />
                  <Line type="monotone" dataKey="V_p50" stroke={COLORS.mc} strokeWidth={2.5} dot={false} name="Mediana V" />
                  <Line type="monotone" dataKey="V_mean" stroke={COLORS.viability} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Media V" />
                  <Line type="monotone" dataKey="S_p50" stroke={COLORS.entropy} strokeWidth={1.5} strokeDasharray="6 2" dot={false} name="Mediana S" />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: fonts.mono }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted, fontSize: 11, fontFamily: fonts.mono }}>
                Ejecuta la simulación Monte Carlo para visualizar las bandas de confianza.
              </div>
            )}
          </Card>

          {/* MC Interpretation */}
          <Card title="Interpretación Estocástica" icon="📖" accent={COLORS.mc} style={{ gridColumn: "1 / -1" }}>
            {mcResults ? (() => {
              const p = mcResults.pDeltaVPos;
              const spread = mcResults.finalVStd;
              return (
                <div style={{ fontFamily: fonts.mono, fontSize: 12, color: COLORS.textDim, lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 700, color: p > 0.7 ? COLORS.viability : p > 0.45 ? COLORS.wait : COLORS.block }}>
                    {p > 0.7 ? "PRONÓSTICO FAVORABLE" : p > 0.45 ? "PRONÓSTICO INCIERTO" : "PRONÓSTICO DESFAVORABLE"}
                  </div>
                  <div>De {mcResults.N} trayectorias simuladas, <span style={{ color: COLORS.mc, fontWeight: 700 }}>{(p * 100).toFixed(1)}%</span> terminan con V mayor que la actual.</div>
                  <div>La volatilidad (σ = {spread.toFixed(3)}) indica {spread > 0.08 ? "alta incertidumbre — los outcomes son muy dispersos" : spread > 0.04 ? "incertidumbre moderada" : "baja volatilidad — la predicción es relativamente estable"}.</div>
                  <div style={{ marginTop: 8 }}>El intervalo al 90% para V₃₀ es [{mcResults.stats[mcResults.stats.length - 1]?.V_p5.toFixed(3)}, {mcResults.stats[mcResults.stats.length - 1]?.V_p95.toFixed(3)}].</div>
                  {p < 0.5 && <div style={{ marginTop: 8, color: COLORS.escape }}>⚠ Recomendación: incrementar controles. P(ΔV&gt;0) &lt; 50% indica que las acciones actuales tienen mayor probabilidad de no mejorar tu viabilidad.</div>}
                </div>
              );
            })() : null}
          </Card>

          {/* NEW: Decision Confidence Card — π(x,u) Verdict Distribution with Wilson CIs */}
          <Card title="Confianza de la Decisión π(x,u)" icon="⚖" accent={COLORS.mc} style={{ gridColumn: "1 / -1" }}>
            {mcResults && mcResults.verdictCI ? (() => {
              const vc = mcResults.verdictCI;
              const verdicts = [
                { key: "BLOCK", label: "BLOCK", color: "#ef4444", data: vc.BLOCK },
                { key: "WAIT",  label: "WAIT",  color: "#f59e0b", data: vc.WAIT },
                { key: "ALLOW", label: "ALLOW", color: "#10b981", data: vc.ALLOW },
              ];
              const tta = mcResults.timeToAllow;
              return (
                <div>
                  {/* Robustness Badge */}
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{
                      display: "inline-block", padding: "8px 24px", borderRadius: 8,
                      background: mcResults.isRobust ? "#10b98115" : mcResults.isFragile ? "#ef444415" : "#f59e0b15",
                      border: `1px solid ${mcResults.isRobust ? "#10b98140" : mcResults.isFragile ? "#ef444440" : "#f59e0b40"}`,
                    }}>
                      <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 4 }}>
                        <InfoTip tipKey="decisionCI" inline>VEREDICTO ESTOCÁSTICO t₃₀</InfoTip>
                      </div>
                      <div style={{
                        fontSize: 28, fontWeight: 800, fontFamily: fonts.mono, letterSpacing: 2,
                        color: mcResults.dominantColor,
                      }}>
                        {mcResults.dominantVerdict}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: fonts.mono, marginTop: 4,
                        color: mcResults.isRobust ? "#10b981" : mcResults.isFragile ? "#ef4444" : "#f59e0b" }}>
                        {mcResults.isRobust ? "DECISIÓN ROBUSTA" : mcResults.isFragile ? "DECISIÓN FRÁGIL" : "DECISIÓN INDETERMINADA"}
                        {" — "}{(mcResults.dominantP * 100).toFixed(1)}% de {mcResults.N.toLocaleString()} trayectorias
                      </div>
                    </div>
                  </div>

                  {/* Verdict Distribution Bars with Wilson CIs */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                    {verdicts.map(({ key, label, color, data }) => (
                      <div key={key} style={{ padding: 14, background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 6 }}>
                          P(Ï€ = {label})
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 700, fontFamily: fonts.mono, color }}>
                          {(data.p * 100).toFixed(1)}%
                        </div>
                        {/* CI Bar */}
                        <div style={{ margin: "8px auto", width: "85%", height: 6, background: COLORS.surface2, borderRadius: 3, position: "relative", overflow: "hidden" }}>
                          <div style={{
                            position: "absolute", left: `${data.lower * 100}%`, width: `${(data.upper - data.lower) * 100}%`,
                            height: "100%", background: `${color}50`, borderRadius: 3,
                          }} />
                          <div style={{
                            position: "absolute", left: `${data.p * 100}%`, width: 2, height: "100%",
                            background: color, transform: "translateX(-1px)",
                          }} />
                        </div>
                        <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted }}>
                          CI₉₅ [{(data.lower * 100).toFixed(1)}%, {(data.upper * 100).toFixed(1)}%]
                        </div>
                        <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, marginTop: 2 }}>
                          n = {data.count.toLocaleString()} / {mcResults.N.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time-to-ALLOW Distribution */}
                  <div style={{ padding: 14, background: COLORS.surface2, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 }}>
                      TIEMPO HASTA PRIMER π = ALLOW
                    </div>
                    {tta.stats ? (
                      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>Pâ'…</div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.viability }}>t={tta.stats.p5}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>Pâ''â'…</div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.allow }}>t={tta.stats.p25}</div>
                        </div>
                        <div style={{ textAlign: "center", padding: "4px 12px", background: `${COLORS.mc}15`, borderRadius: 6 }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>MEDIANA</div>
                          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: fonts.mono, color: COLORS.mc }}>t={tta.stats.median}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>P₇₅</div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.wait }}>t={tta.stats.p75}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>P₉₅</div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: COLORS.block }}>t={tta.stats.p95}</div>
                        </div>
                        <div style={{ textAlign: "center", marginLeft: 12, padding: "4px 10px", background: COLORS.surface, borderRadius: 6 }}>
                          <div style={{ fontSize: 8, color: COLORS.textMuted, fontFamily: fonts.mono }}>NUNCA ALLOW</div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: tta.pNeverAllow > 0.3 ? COLORS.block : COLORS.textDim }}>
                            {(tta.pNeverAllow * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", fontSize: 12, fontFamily: fonts.mono, color: COLORS.block }}>
                        ✗ Ninguna trayectoria alcanzó π = ALLOW en {mcResults.steps} pasos ({(tta.pNeverAllow * 100).toFixed(0)}% nunca)
                      </div>
                    )}
                  </div>

                  {/* Interpretation */}
                  <div style={{ fontSize: 11, fontFamily: fonts.mono, color: COLORS.textDim, lineHeight: 1.8 }}>
                    {mcResults.isFragile && (
                      <div style={{ padding: "8px 12px", background: "#ef444410", borderLeft: `3px solid #ef4444`, borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                        ⚠ <strong>Decisión frágil.</strong> Con P = {(mcResults.dominantP * 100).toFixed(1)}%, una perturbación moderada (σ = {mcResults.sigma}) puede invertir el veredicto.
                        La incertidumbre es epistemológicamente significativa — el modelo no tiene certeza sobre qué acción es correcta.
                      </div>
                    )}
                    {mcResults.isRobust && (
                      <div style={{ padding: "8px 12px", background: "#10b98110", borderLeft: `3px solid #10b981`, borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                        ✓ <strong>Decisión robusta.</strong> El {(mcResults.dominantP * 100).toFixed(1)}% de convergencia indica que el veredicto {mcResults.dominantVerdict} es estable
                        bajo perturbaciones estocásticas. CI₉₅ Wilson Score confirma significancia estadística.
                      </div>
                    )}
                    <div>Wilson Score CI₉₅: método recomendado para proporciones binomiales con N = {mcResults.N.toLocaleString()}.</div>
                    <div>Ancho máximo del CI: ±{(1.96 * Math.sqrt(0.25 / mcResults.N) * 100).toFixed(2)}% — resolución suficiente para decisiones operativas.</div>
                  </div>
                </div>
              );
            })() : (
              <div style={{ textAlign: "center", padding: 20, color: COLORS.textMuted, fontSize: 11, fontFamily: fonts.mono }}>
                Ejecuta la simulación Monte Carlo para ver la distribución de confianza del veredicto.
              </div>
            )}
          </Card>

          {/* NEW: Verdict Probability Timeline — Stacked Area Chart */}
          <Card title="Evolución Temporal P(π)" icon="◑" accent={COLORS.mc} style={{ gridColumn: "1 / -1" }}>
            {mcResults ? (
              <div>
                <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textDim, marginBottom: 8, lineHeight: 1.6 }}>
                  Probabilidad de cada veredicto π(x,u) a lo largo de {mcResults.steps} pasos, estimada sobre {mcResults.N.toLocaleString()} trayectorias estocásticas.
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={mcResults.stats}>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border}
                      tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip content={({ payload, label }) => {
                      if (!payload || !payload.length) return null;
                      return (
                        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 10, fontFamily: fonts.mono, fontSize: 10 }}>
                          <div style={{ color: COLORS.textMuted, marginBottom: 4 }}>t = {label}</div>
                          {payload.map(p => (
                            <div key={p.name} style={{ color: p.color }}>
                              {p.name}: {(p.value * 100).toFixed(1)}%
                            </div>
                          ))}
                        </div>
                      );
                    }} />
                    <Area type="monotone" dataKey="pAllow" stackId="verdict" stroke="#10b981" fill="#10b98130" name="P(ALLOW)" />
                    <Area type="monotone" dataKey="pWait" stackId="verdict" stroke="#f59e0b" fill="#f59e0b30" name="P(WAIT)" />
                    <Area type="monotone" dataKey="pBlock" stackId="verdict" stroke="#ef4444" fill="#ef444430" name="P(BLOCK)" />
                    <Legend wrapperStyle={{ fontSize: 9, fontFamily: fonts.mono }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 30, color: COLORS.textMuted, fontSize: 11, fontFamily: fonts.mono }}>
                Ejecuta la simulación para ver la evolución temporal del veredicto.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ═══ ATTRACTOR TAB (ORIGINAL — INTACT) ═══ */}
      {activeTab === "attractor" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Mapa de Atractor — Espacio de Fase V×S" icon="⟐" accent={COLORS.accent2}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 12, fontFamily: fonts.mono, lineHeight: 1.6 }}>
              <InfoTip tipKey="attractor" inline>Trayectoria del sistema</InfoTip> en (Viabilidad, Entropía).
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                <XAxis type="number" dataKey="S" domain={[0, 1]} name="S(x)" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border}
                  label={{ value: "S(x)", fontSize: 10, fill: COLORS.textMuted, position: "insideBottom", offset: -10 }} />
                <YAxis type="number" dataKey="V" domain={[0, 1]} name="V(x)" tick={{ fontSize: 9, fill: COLORS.textMuted }} stroke={COLORS.border}
                  label={{ value: "V(x)", fontSize: 10, fill: COLORS.textMuted, angle: -90, position: "insideLeft" }} />
                <Scatter data={[{ S: 0.05, V: 0.95 }, { S: 0.15, V: 0.95 }, { S: 0.05, V: 0.85 }, { S: 0.15, V: 0.85 }, { S: 0.1, V: 0.9 }]} fill={COLORS.viability} fillOpacity={0.1} shape="star" name="Atractor" />
                <Scatter data={phaseData} name="Trayectoria" shape="circle">
                  {phaseData.map((_, i) => <Cell key={i} fill={COLORS.accent2} fillOpacity={0.3 + (i / phaseData.length) * 0.7} r={3 + (i / phaseData.length) * 4} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Interpretación" icon="📖" accent={COLORS.accent2}>
            {(() => {
              const last = phaseData[phaseData.length - 1]; const first = phaseData[0];
              const driftV = last.V - first.V; const driftS = last.S - first.S;
              const converging = driftV > 0.05 && driftS < -0.02;
              const diverging = driftV < -0.05 || driftS > 0.05;
              return (
                <div style={{ fontFamily: fonts.mono, fontSize: 12, lineHeight: 2, color: COLORS.textDim }}>
                  <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 700, color: converging ? COLORS.viability : diverging ? COLORS.block : COLORS.wait }}>
                    {converging ? "ESTABILIZANDO ↗" : diverging ? "DERIVANDO ↘" : "OSCILANDO ↔"}
                  </div>
                  <div>Drift V: <span style={{ color: driftV > 0 ? COLORS.viability : COLORS.block }}>{driftV >= 0 ? "+" : ""}{driftV.toFixed(3)}</span></div>
                  <div>Drift S: <span style={{ color: driftS < 0 ? COLORS.viability : COLORS.block }}>{driftS >= 0 ? "+" : ""}{driftS.toFixed(3)}</span></div>
                  <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                    <div style={{ flex: 1, padding: 10, background: COLORS.surface2, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>L(x)</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: L < 0.05 ? COLORS.viability : L < 0.2 ? COLORS.wait : COLORS.block }}>{L.toFixed(3)}</div>
                    </div>
                    <div style={{ flex: 1, padding: 10, background: COLORS.surface2, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>Q(x)</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: Q > 0.3 ? COLORS.viability : Q > 0.1 ? COLORS.wait : COLORS.block }}>{Q.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* ═══ POLICY TAB (ORIGINAL — INTACT) ═══ */}
      {activeTab === "policy" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Definición Formal de π(x, u)" icon="π" accent={COLORS.accent}>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, lineHeight: 2.2, color: COLORS.textDim, padding: 16, background: COLORS.surface2, borderRadius: 8 }}>
              <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 8 }}><InfoTip tipKey="pi" inline>Inhibition Policy π(x, u)</InfoTip>:</div>
              <div><span style={{ color: COLORS.block }}>INHIBIT</span> si ΔV(x|u) ≤ 0</div>
              <div><span style={{ color: COLORS.wait }}>INHIBIT</span> si ΔS(x|u) &gt; ε = {EPSILON_S}</div>
              <div><span style={{ color: COLORS.wait }}>INHIBIT</span> si C(x,u) &lt; ε_c = {EPSILON_C}</div>
              <div><span style={{ color: COLORS.allow }}>ALLOW</span> en caso contrario</div>
            </div>
          </Card>
          <Card title="Sensitivity Analysis" icon="∂" accent={COLORS.accent2}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fonts.mono, fontSize: 10 }}>
                <thead><tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={{ padding: "8px 6px", textAlign: "left", color: COLORS.textMuted }}>Control</th>
                  <th style={{ padding: "8px 6px", textAlign: "right", color: COLORS.viability }}>ΔV</th>
                  <th style={{ padding: "8px 6px", textAlign: "right", color: COLORS.entropy }}>ΔS</th>
                  <th style={{ padding: "8px 6px", textAlign: "right", color: COLORS.accent }}>Neto</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", color: COLORS.textMuted }}>Ï€</th>
                </tr></thead>
                <tbody>
                  {Object.keys(controls).map(k => {
                    const iso = { ...Object.fromEntries(Object.keys(controls).map(c => [c, 0])), [k]: 0.8 };
                    const dv = computeDeltaV(state, iso); const ds = computeDeltaS(state, iso); const p = inhibitionPolicy(state, iso);
                    return <tr key={k} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: "6px", color: COLORS.text }}>{k}</td>
                      <td style={{ padding: "6px", textAlign: "right", color: dv > 0 ? COLORS.viability : COLORS.block }}>{dv >= 0 ? "+" : ""}{dv.toFixed(4)}</td>
                      <td style={{ padding: "6px", textAlign: "right", color: ds < 0 ? COLORS.viability : COLORS.block }}>{ds >= 0 ? "+" : ""}{ds.toFixed(4)}</td>
                      <td style={{ padding: "6px", textAlign: "right", color: (dv-ds) > 0 ? COLORS.net : COLORS.block }}>{(dv-ds).toFixed(4)}</td>
                      <td style={{ padding: "6px", textAlign: "center", color: p.color, fontWeight: 600 }}>{p.verdict}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Historial de Decisiones" icon="⟳" accent={COLORS.net} style={{ gridColumn: "1 / -1" }}>
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={history.slice(-30)}>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fontSize: 8, fill: COLORS.textMuted }} stroke={COLORS.border} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 8, fill: COLORS.textMuted }} stroke={COLORS.border} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="V" stroke={COLORS.viability} strokeWidth={2} dot={false} name="V(x)" />
                  <Line type="monotone" dataKey="S" stroke={COLORS.entropy} strokeWidth={2} dot={false} name="S(x)" />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: fonts.mono }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: 20, color: COLORS.textMuted, fontFamily: fonts.mono, fontSize: 11 }}>Ajusta el estado para generar historial...</div>
            )}
          </Card>
        </div>
      )}

      {/* ═══ METAPOLICY TAB (ORIGINAL — INTACT) ═══ */}
      {activeTab === "metapolicy" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <Card title="Meta-Política π²(x)" icon="⚜" accent={COLORS.escape}>
            <div style={{ background: `${metaP.color}08`, border: `1px solid ${metaP.color}30`, borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>
                <InfoTip tipKey="pi2" inline>VEREDICTO META-POLÍTICA</InfoTip>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, fontFamily: fonts.mono, color: metaP.color, letterSpacing: 3, textShadow: `0 0 24px ${metaP.color}40` }}>
                π²(x) = {metaP.verdict}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: fonts.mono, marginTop: 8, lineHeight: 1.5 }}>{metaP.reason}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[{ l: "Q(x)", v: Q, c: Q > 0.3 ? COLORS.viability : Q > 0.1 ? COLORS.wait : COLORS.block, tip: "Q" },
                { l: "L(x)", v: L, c: L < 0.05 ? COLORS.viability : L < 0.2 ? COLORS.wait : COLORS.block, tip: "L" },
                { l: "V(x)", v: V, c: V > V_STAR ? COLORS.viability : V > 0.4 ? COLORS.wait : COLORS.block, tip: "V" },
              ].map(({ l, v, c, tip }) => (
                <div key={l} style={{ textAlign: "center", padding: 10, background: COLORS.surface2, borderRadius: 8 }}>
                  <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}><InfoTip tipKey={tip} inline>{l}</InfoTip></div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: fonts.mono, color: c }}>{v.toFixed(3)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 12, background: COLORS.surface2, borderRadius: 8 }}>
              <div style={{ fontSize: 9, fontFamily: fonts.mono, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 8 }}>ΔV MULTI-HORIZONTE</div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {Object.entries(pathDetection.horizons).map(([k, v]) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: COLORS.textMuted, fontFamily: fonts.mono }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: v > 0.01 ? COLORS.viability : v < -0.01 ? COLORS.block : COLORS.wait }}>{v >= 0 ? "+" : ""}{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card title="Detección de Atractores Patológicos" icon="🌑" accent={COLORS.pathological}>
            {pathDetection.findings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pathDetection.findings.map((f, i) => (
                  <div key={i} style={{ padding: 16, background: `${f.color}08`, border: `1px solid ${f.color}30`, borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: fonts.mono, color: f.color }}>{f.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: fonts.sans, lineHeight: 1.6, marginBottom: 8 }}>{f.desc}</div>
                    <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.textMuted, marginBottom: 8, padding: "6px 10px", background: COLORS.surface2, borderRadius: 6 }}>Firma: {f.signature}</div>
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: COLORS.escape, lineHeight: 1.5, padding: "8px 10px", background: `${COLORS.escape}08`, borderRadius: 6, borderLeft: `3px solid ${COLORS.escape}40` }}>🚪 {f.escape}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 30 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.viability, fontFamily: fonts.mono, marginBottom: 6 }}>Sin atractores patológicos</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: fonts.mono }}>El estado no exhibe firmas de depresión-like, ciclo adictivo, indefensión ni sobre-rendimiento.</div>
              </div>
            )}
          </Card>
          <Card title="Marco Formal π²" icon="≡" accent={COLORS.accent} style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
              <div style={{ padding: 14, background: COLORS.surface2, borderRadius: 8, fontFamily: fonts.mono, fontSize: 11, lineHeight: 1.8, color: COLORS.textDim }}>
                <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 6 }}>Q(x)</div>
                Q = V − λ·S − γ·D(x, A*)<br />λ = {LAMBDA_Q} | γ = {GAMMA_Q}
              </div>
              <div style={{ padding: 14, background: COLORS.surface2, borderRadius: 8, fontFamily: fonts.mono, fontSize: 11, lineHeight: 1.8, color: COLORS.textDim }}>
                <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 6 }}>L(x)</div>
                L = α(V*−V)² + β(S−S*)²<br />α = 1.0 | β = 0.8
              </div>
              <div style={{ padding: 14, background: COLORS.surface2, borderRadius: 8, fontFamily: fonts.mono, fontSize: 11, lineHeight: 1.8, color: COLORS.textDim }}>
                <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 6 }}>Veredictos</div>
                <span style={{ color: COLORS.viability }}>SUSTAIN</span> · <span style={{ color: COLORS.accent }}>MONITOR</span> · <span style={{ color: COLORS.wait }}>ACTIVATE</span> · <span style={{ color: COLORS.escape }}>ESCAPE</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══ THEORY TAB (ORIGINAL — INTACT with new sections) ═══ */}
      {activeTab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          <Card style={{ position: "sticky", top: 20, alignSelf: "start" }}>
            <div style={{ fontSize: 10, fontFamily: fonts.mono, color: COLORS.accent, letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>📚 Marco Teórico</div>
            {THEORY_SECTIONS.map(sec => (
              <button key={sec.id} onClick={() => setTheorySection(sec.id)} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "7px 10px", marginBottom: 3, borderRadius: 6,
                background: theorySection === sec.id ? `${COLORS.accent}18` : "transparent",
                border: theorySection === sec.id ? `1px solid ${COLORS.accent}30` : "1px solid transparent",
                color: theorySection === sec.id ? COLORS.accent : COLORS.textDim,
                fontFamily: fonts.mono, fontSize: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                <span style={{ fontSize: 13, width: 18 }}>{sec.icon}</span>{sec.title}
              </button>
            ))}
          </Card>
          <Card accent={COLORS.accent}>
            {(() => {
              const sec = THEORY_SECTIONS.find(s => s.id === theorySection);
              if (!sec) return null;
              return <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>{sec.icon}</span>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: COLORS.text }}>{sec.title}</h2>
                </div>
                <TheoryRenderer section={sec} />
              </div>;
            })()}
          </Card>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 32, textAlign: "center", fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, lineHeight: 2 }}>
        INHIBITION-FIRST CONTROL MODEL v5 — ℋ = (X, U, W, V, S, Φ, π, π², Q)<br />
        Viability-First Cognitive Operating System · Cibernética Interior Aplicada<br />
        Stochastic Layer · ∇V · Cognitive Mode · Monte Carlo · Non-Linear Interactions · Wilson CI<br />
        <span style={{ color: COLORS.accent, opacity: 0.6 }}>Cadena Strategic Systems</span>
      </div>
    </div>
  );
}
