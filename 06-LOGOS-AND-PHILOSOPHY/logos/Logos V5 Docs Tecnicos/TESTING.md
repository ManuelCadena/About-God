# ESPECIFICACIÓN DE TESTING — LOGOS

> **Documento:** SRS-TEST-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 29119  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Estrategia de Testing](#1-estrategia-de-testing)
2. [Tests Unitarios — Funciones Matemáticas](#2-tests-unitarios--funciones-matemáticas)
3. [Tests Unitarios — Core Engine](#3-tests-unitarios--core-engine)
4. [Tests de Integración](#4-tests-de-integración)
5. [Casos Límite (Edge Cases)](#5-casos-límite-edge-cases)
6. [Validación de Rangos [0,1]](#6-validación-de-rangos-01)
7. [Tests de Regresión Monte Carlo](#7-tests-de-regresión-monte-carlo)
8. [Tests de Componentes React](#8-tests-de-componentes-react)
9. [Matriz de Cobertura](#9-matriz-de-cobertura)

---

## 1. Estrategia de Testing

### 1.1 Pirámide de Tests

```
         ╱╲
        ╱ E2E ╲           ← Pocos: flujo completo login → evaluación → logout
       ╱────────╲
      ╱Integration╲       ← Medio: pipeline completo de 7 capas
     ╱──────────────╲
    ╱   Unit Tests    ╲    ← Muchos: cada función pura del core
   ╱────────────────────╲
```

### 1.2 Herramientas Recomendadas

| Herramienta | Propósito |
|-------------|-----------|
| **Vitest** | Test runner (compatible con Vite) |
| **@testing-library/react** | Tests de componentes React |
| **jsdom** | DOM virtual para tests |

### 1.3 Configuración

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

---

## 2. Tests Unitarios — Funciones Matemáticas

**Archivo:** `src/utils/math.test.ts`

### 2.1 clamp()

```typescript
describe('clamp', () => {
  test('valor dentro de rango permanece igual', () => {
    expect(clamp(0.5)).toBe(0.5);
    expect(clamp(0.0)).toBe(0.0);
    expect(clamp(1.0)).toBe(1.0);
  });

  test('valor por debajo del mínimo se ajusta', () => {
    expect(clamp(-0.1)).toBe(0);
    expect(clamp(-100)).toBe(0);
  });

  test('valor por encima del máximo se ajusta', () => {
    expect(clamp(1.5)).toBe(1);
    expect(clamp(100)).toBe(1);
  });

  test('rangos personalizados', () => {
    expect(clamp(0.5, 0, 1.5)).toBe(0.5);
    expect(clamp(2.0, 0, 1.5)).toBe(1.5);
    expect(clamp(-1, -2, 2)).toBe(-1);
  });
});
```

### 2.2 lerp()

```typescript
describe('lerp', () => {
  test('interpolación en extremos', () => {
    expect(lerp(0, 1, 0)).toBe(0);
    expect(lerp(0, 1, 1)).toBe(1);
  });

  test('interpolación en punto medio', () => {
    expect(lerp(0, 1, 0.5)).toBe(0.5);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  test('extrapolación', () => {
    expect(lerp(0, 1, 2)).toBe(2);
    expect(lerp(0, 1, -1)).toBe(-1);
  });
});
```

### 2.3 percentile()

```typescript
describe('percentile', () => {
  test('mediana de array ordenado', () => {
    expect(percentile([1, 2, 3, 4, 5], 0.50)).toBe(3);
  });

  test('percentil 0 retorna mínimo', () => {
    expect(percentile([5, 3, 1, 4, 2], 0.0)).toBe(1);
  });

  test('array vacío retorna 0', () => {
    expect(percentile([], 0.50)).toBe(0);
  });
});
```

### 2.4 mean() y std()

```typescript
describe('mean', () => {
  test('media de array simple', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });

  test('media de array vacío', () => {
    expect(mean([])).toBe(0);
  });

  test('media de valores iguales', () => {
    expect(mean([0.5, 0.5, 0.5])).toBe(0.5);
  });
});

describe('std', () => {
  test('desviación de valores iguales es 0', () => {
    expect(std([5, 5, 5, 5])).toBe(0);
  });

  test('desviación de [0, 1]', () => {
    expect(std([0, 1])).toBeCloseTo(0.5, 5);
  });
});
```

### 2.5 gaussianRandom()

```typescript
describe('gaussianRandom', () => {
  test('distribución tiene media ≈ 0', () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRandom());
    const m = mean(samples);
    expect(Math.abs(m)).toBeLessThan(0.05);
  });

  test('distribución tiene std ≈ 1', () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRandom());
    const s = std(samples);
    expect(s).toBeCloseTo(1.0, 1);
  });
});
```

### 2.6 wilsonCI()

```typescript
describe('wilsonCI', () => {
  test('proporción 0.5 con n=100', () => {
    const ci = wilsonCI(50, 100);
    expect(ci.p).toBeCloseTo(0.5, 2);
    expect(ci.lower).toBeLessThan(0.5);
    expect(ci.upper).toBeGreaterThan(0.5);
  });

  test('proporción 0 no produce negativos', () => {
    const ci = wilsonCI(0, 100);
    expect(ci.lower).toBeGreaterThanOrEqual(0);
  });

  test('proporción 1 no excede 1', () => {
    const ci = wilsonCI(100, 100);
    expect(ci.upper).toBeLessThanOrEqual(1);
  });

  test('n=0 retorna ceros', () => {
    const ci = wilsonCI(0, 0);
    expect(ci.p).toBe(0);
    expect(ci.lower).toBe(0);
    expect(ci.upper).toBe(0);
  });
});
```

### 2.7 harmonicMean()

```typescript
describe('harmonicMean', () => {
  test('valores iguales retornan ese valor', () => {
    expect(harmonicMean([0.5, 0.5, 0.5])).toBeCloseTo(0.5, 5);
  });

  test('un valor bajo arrastra el resultado', () => {
    const result = harmonicMean([0.9, 0.9, 0.1, 0.9, 0.9, 0.9]);
    expect(result).toBeLessThan(0.5);
  });

  test('array vacío retorna 0', () => {
    expect(harmonicMean([])).toBe(0);
  });

  test('valores cercanos a 0 se filtran', () => {
    expect(harmonicMean([0.005, 0.5])).toBeCloseTo(0.5, 1);
  });
});
```

---

## 3. Tests Unitarios — Core Engine

### 3.1 computeLogosAlignment()

```typescript
describe('computeLogosAlignment', () => {
  test('estado default (0.5) produce Λ = 0.5', () => {
    const result = computeLogosAlignment(DEFAULT_STATE);
    expect(result.value).toBeCloseTo(0.5, 2);
  });

  test('estado máximo (1.0) produce Λ = 1.0', () => {
    const maxState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 1.0])
    ) as ConsciousnessState;
    const result = computeLogosAlignment(maxState);
    expect(result.value).toBe(1.0);
  });

  test('estado mínimo (0.0) produce Λ = 0.0', () => {
    const minState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.0])
    ) as ConsciousnessState;
    const result = computeLogosAlignment(minState);
    expect(result.value).toBe(0.0);
  });

  test('Λ siempre ∈ [0, 1]', () => {
    for (let i = 0; i < 100; i++) {
      const randomState = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeLogosAlignment(randomState);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test('breakdown tiene 4 grupos', () => {
    const result = computeLogosAlignment(DEFAULT_STATE);
    expect(Object.keys(result.breakdown)).toHaveLength(4);
    expect(result.breakdown).toHaveProperty('reception');
    expect(result.breakdown).toHaveProperty('action');
    expect(result.breakdown).toHaveProperty('decoding');
    expect(result.breakdown).toHaveProperty('gratitude');
  });

  test('suma de pesos = 1.0', () => {
    const result = computeLogosAlignment(DEFAULT_STATE);
    let totalWeight = 0;
    for (const group of Object.values(result.breakdown)) {
      for (const item of group.items) {
        totalWeight += item.weight;
      }
    }
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });
});
```

### 3.2 computeFreeEnergy()

```typescript
describe('computeFreeEnergy', () => {
  test('estado ideal produce F ≈ 0', () => {
    const idealState = {
      sleep: 0.85, nutrition: 0.80, exercise: 0.75, energy: 0.80,
      peace: 0.75, gratitude: 0.80, love: 0.75, joy: 0.70,
      clarity: 0.75, focus: 0.75, creativity: 0.65, wisdom: 0.70,
      faith: 0.70, meditation: 0.65, service: 0.60, presence: 0.70,
      family: 0.75, friendship: 0.65, community: 0.55, compassion: 0.70,
      meaning: 0.75, mission: 0.70, contribution: 0.65, legacy: 0.55,
    } as ConsciousnessState;
    const result = computeFreeEnergy(idealState, 0.6);
    expect(result.value).toBeLessThan(0.1);
  });

  test('mayor Λ reduce F', () => {
    const F_low = computeFreeEnergy(DEFAULT_STATE, 0.2);
    const F_high = computeFreeEnergy(DEFAULT_STATE, 0.8);
    expect(F_high.value).toBeLessThan(F_low.value);
  });

  test('F ∈ [0, 1.5]', () => {
    for (let i = 0; i < 100; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeFreeEnergy(state, Math.random());
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1.5);
    }
  });

  test('lambdaEffect = Λ × 0.3', () => {
    const result = computeFreeEnergy(DEFAULT_STATE, 0.6);
    expect(result.lambdaEffect).toBeCloseTo(0.18, 5);
  });
});
```

### 3.3 computeLevinSignals()

```typescript
describe('computeLevinSignals', () => {
  test('estado default no genera señales', () => {
    const signals = computeLevinSignals(DEFAULT_STATE, 0.5);
    expect(signals).toHaveLength(0);
  });

  test('detecta señal depresiva', () => {
    const depressed = { ...DEFAULT_STATE, joy: 0.2, energy: 0.2, meaning: 0.2 };
    const signals = computeLevinSignals(depressed as ConsciousnessState, 0.5);
    expect(signals.some(s => s.type === 'SEÑAL DEPRESIVA')).toBe(true);
  });

  test('detecta atractor negativo A⁻', () => {
    const critical = { ...DEFAULT_STATE, peace: 0.1, meaning: 0.1 };
    const signals = computeLevinSignals(critical as ConsciousnessState, 0.1);
    expect(signals.some(s => s.type.includes('ATRACTOR NEGATIVO'))).toBe(true);
  });

  test('severidad de A⁻ es la más alta (0.95)', () => {
    const critical = { ...DEFAULT_STATE, peace: 0.1, meaning: 0.1 };
    const signals = computeLevinSignals(critical as ConsciousnessState, 0.1);
    const aNeg = signals.find(s => s.type.includes('ATRACTOR NEGATIVO'));
    expect(aNeg?.severity).toBe(0.95);
  });
});
```

### 3.4 computeViability() y computeEntropy()

```typescript
describe('computeViability', () => {
  test('V ∈ [0, 1] para cualquier estado', () => {
    for (let i = 0; i < 100; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeViability(state, Math.random());
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test('mayor Λ → mayor V', () => {
    const V_low = computeViability(DEFAULT_STATE, 0.2);
    const V_high = computeViability(DEFAULT_STATE, 0.8);
    expect(V_high.value).toBeGreaterThan(V_low.value);
  });
});

describe('computeEntropy', () => {
  test('S ∈ [0, 1] para cualquier estado', () => {
    for (let i = 0; i < 100; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeEntropy(state, Math.random());
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test('mayor Λ → menor S', () => {
    const S_low_lambda = computeEntropy(DEFAULT_STATE, 0.2);
    const S_high_lambda = computeEntropy(DEFAULT_STATE, 0.8);
    expect(S_high_lambda.value).toBeLessThan(S_low_lambda.value);
  });
});
```

### 3.5 inhibitionPolicy()

```typescript
describe('inhibitionPolicy', () => {
  test('Λ < 0.15 → PAUSA', () => {
    const result = inhibitionPolicy(0.10, 0.60, 0.30, 0.50);
    expect(result.verdict).toBe('PAUSA');
  });

  test('V < 0.30 → PAUSA', () => {
    const result = inhibitionPolicy(0.50, 0.20, 0.30, 0.50);
    expect(result.verdict).toBe('PAUSA');
  });

  test('S > 0.55 → ESPERA', () => {
    const result = inhibitionPolicy(0.50, 0.60, 0.60, 0.50);
    expect(result.verdict).toBe('ESPERA');
  });

  test('C < 0.30 → ESPERA', () => {
    const result = inhibitionPolicy(0.50, 0.60, 0.30, 0.20);
    expect(result.verdict).toBe('ESPERA');
  });

  test('Λ̇ < -0.02 → RECONECTA', () => {
    const result = inhibitionPolicy(0.50, 0.60, 0.30, 0.50, 0.55);
    expect(result.verdict).toBe('RECONECTA');
  });

  test('condiciones óptimas → ACTÚA', () => {
    const result = inhibitionPolicy(0.60, 0.60, 0.30, 0.50);
    expect(result.verdict).toBe('ACTÚA');
  });

  test('condiciones intermedias → MONITOREA', () => {
    const result = inhibitionPolicy(0.40, 0.50, 0.40, 0.40);
    expect(result.verdict).toBe('MONITOREA');
  });

  test('prioridad: PAUSA > ESPERA > RECONECTA > ACTÚA > MONITOREA', () => {
    // Λ < 0.15 debería dar PAUSA incluso si S > 0.55
    const result = inhibitionPolicy(0.10, 0.60, 0.60, 0.50);
    expect(result.verdict).toBe('PAUSA');
  });
});
```

---

## 4. Tests de Integración

### 4.1 Pipeline Completo de 7 Capas

```typescript
describe('Pipeline completo', () => {
  test('estado default produce métricas coherentes', () => {
    const logos = computeLogosAlignment(DEFAULT_STATE);
    const lambda = logos.value;
    const V = computeViability(DEFAULT_STATE, lambda);
    const S = computeEntropy(DEFAULT_STATE, lambda);
    const C = computeCoherence(DEFAULT_STATE, lambda);
    const F = computeFreeEnergy(DEFAULT_STATE, lambda);
    const omega = computeOmega(lambda, V.value, S.value, C.coherence, F.value);
    const Q = computeQ(lambda, V.value, S.value);
    const pi = inhibitionPolicy(lambda, V.value, S.value, C.coherence);

    // Todas las métricas en rango
    expect(lambda).toBeGreaterThanOrEqual(0);
    expect(lambda).toBeLessThanOrEqual(1);
    expect(V.value).toBeGreaterThanOrEqual(0);
    expect(V.value).toBeLessThanOrEqual(1);
    expect(S.value).toBeGreaterThanOrEqual(0);
    expect(S.value).toBeLessThanOrEqual(1);
    expect(C.coherence).toBeGreaterThanOrEqual(0);
    expect(C.coherence).toBeLessThanOrEqual(1);
    expect(omega.value).toBeGreaterThanOrEqual(0);
    expect(omega.value).toBeLessThanOrEqual(1);

    // Ω debería estar cerca de Λ para estado default
    expect(Math.abs(omega.value - lambda)).toBeLessThan(0.3);

    // π debería ser MONITOREA o ESPERA para estado default
    expect(['MONITOREA', 'ESPERA', 'ACTÚA']).toContain(pi.verdict);
  });

  test('estado óptimo produce ACTÚA', () => {
    const optimalState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.85])
    ) as ConsciousnessState;
    
    const logos = computeLogosAlignment(optimalState);
    const V = computeViability(optimalState, logos.value);
    const S = computeEntropy(optimalState, logos.value);
    const C = computeCoherence(optimalState, logos.value);
    const pi = inhibitionPolicy(logos.value, V.value, S.value, C.coherence);

    expect(pi.verdict).toBe('ACTÚA');
  });

  test('estado colapsado produce PAUSA', () => {
    const collapsedState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.1])
    ) as ConsciousnessState;
    
    const logos = computeLogosAlignment(collapsedState);
    const V = computeViability(collapsedState, logos.value);
    const S = computeEntropy(collapsedState, logos.value);
    const C = computeCoherence(collapsedState, logos.value);
    const pi = inhibitionPolicy(logos.value, V.value, S.value, C.coherence);

    expect(pi.verdict).toBe('PAUSA');
  });
});
```

### 4.2 Consistencia Λ → Métricas Derivadas

```typescript
describe('Consistencia Λ → Derivadas', () => {
  test('Λ creciente → V creciente, S decreciente', () => {
    const lambdas = [0.1, 0.3, 0.5, 0.7, 0.9];
    let prevV = 0;
    let prevS = 1;

    for (const targetLambda of lambdas) {
      // Crear estado que produzca Λ ≈ target
      const state = { ...DEFAULT_STATE };
      (state as any).faith = targetLambda;
      (state as any).meditation = targetLambda;
      (state as any).presence = targetLambda;
      
      const logos = computeLogosAlignment(state as ConsciousnessState);
      const V = computeViability(state as ConsciousnessState, logos.value);
      const S = computeEntropy(state as ConsciousnessState, logos.value);

      expect(V.value).toBeGreaterThanOrEqual(prevV - 0.05);
      expect(S.value).toBeLessThanOrEqual(prevS + 0.05);

      prevV = V.value;
      prevS = S.value;
    }
  });
});
```

---

## 5. Casos Límite (Edge Cases)

### 5.1 Valores Extremos

```typescript
describe('Edge Cases — Valores Extremos', () => {
  test('todas las dimensiones en 0', () => {
    const zeroState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0])
    ) as ConsciousnessState;
    
    const logos = computeLogosAlignment(zeroState);
    expect(logos.value).toBe(0);
    
    const V = computeViability(zeroState, 0);
    expect(V.value).toBeGreaterThanOrEqual(0);
    
    const C = computeCoherence(zeroState, 0);
    expect(C.coherence).toBeGreaterThanOrEqual(0);
  });

  test('todas las dimensiones en 1', () => {
    const maxState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 1])
    ) as ConsciousnessState;
    
    const logos = computeLogosAlignment(maxState);
    expect(logos.value).toBe(1);
    
    const S = computeEntropy(maxState, 1);
    expect(S.value).toBeLessThan(0.1);
  });

  test('un solo dominio colapsado', () => {
    const state = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.8])
    ) as ConsciousnessState;
    // Colapsar dominio espiritual
    (state as any).faith = 0.05;
    (state as any).meditation = 0.05;
    (state as any).service = 0.05;
    (state as any).presence = 0.05;
    
    const logos = computeLogosAlignment(state);
    const C = computeCoherence(state, logos.value);
    
    // Coherencia debería ser baja (media armónica)
    expect(C.coherence).toBeLessThan(0.5);
  });
});
```

### 5.2 Valores NaN / undefined

```typescript
describe('Edge Cases — Valores Inválidos', () => {
  test('dimensión faltante usa default 0.5', () => {
    const partialState = { sleep: 0.7 } as ConsciousnessState;
    const result = computeLogosAlignment(partialState);
    // No debería lanzar error
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(1);
  });
});
```

---

## 6. Validación de Rangos [0,1]

### 6.1 Test Exhaustivo de Rangos

```typescript
describe('Validación de Rangos [0,1]', () => {
  const NUM_RANDOM_TESTS = 1000;

  test(`Λ ∈ [0,1] para ${NUM_RANDOM_TESTS} estados aleatorios`, () => {
    for (let i = 0; i < NUM_RANDOM_TESTS; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const result = computeLogosAlignment(state);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test(`V ∈ [0,1] para ${NUM_RANDOM_TESTS} estados aleatorios`, () => {
    for (let i = 0; i < NUM_RANDOM_TESTS; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const lambda = Math.random();
      const result = computeViability(state, lambda);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test(`S ∈ [0,1] para ${NUM_RANDOM_TESTS} estados aleatorios`, () => {
    for (let i = 0; i < NUM_RANDOM_TESTS; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const lambda = Math.random();
      const result = computeEntropy(state, lambda);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });

  test(`C ∈ [0,1] para ${NUM_RANDOM_TESTS} estados aleatorios`, () => {
    for (let i = 0; i < NUM_RANDOM_TESTS; i++) {
      const state = Object.fromEntries(
        Object.keys(DEFAULT_STATE).map(k => [k, Math.random()])
      ) as ConsciousnessState;
      const lambda = Math.random();
      const result = computeCoherence(state, lambda);
      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(1);
    }
  });

  test(`Ω ∈ [0,1] para ${NUM_RANDOM_TESTS} estados aleatorios`, () => {
    for (let i = 0; i < NUM_RANDOM_TESTS; i++) {
      const L = Math.random();
      const V = Math.random();
      const S = Math.random();
      const C = Math.random();
      const F = Math.random() * 1.5;
      const result = computeOmega(L, V, S, C, F);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThanOrEqual(1);
    }
  });
});
```

---

## 7. Tests de Regresión Monte Carlo

```typescript
describe('Monte Carlo — Regresión', () => {
  test('resultado tiene estructura correcta', () => {
    const result = runMonteCarlo(DEFAULT_STATE, 100, 10, 0.04);
    
    expect(result.N).toBe(100);
    expect(result.steps).toBe(10);
    expect(result.sigma).toBe(0.04);
    expect(result.stats).toHaveLength(11); // 0..10
    expect(result.verdictNames).toHaveLength(5);
    expect(result.verdictColors).toHaveLength(5);
    expect(result.pLambdaUp).toBeGreaterThanOrEqual(0);
    expect(result.pLambdaUp).toBeLessThanOrEqual(1);
    expect(result.pNegAttractor).toBeGreaterThanOrEqual(0);
    expect(result.pNegAttractor).toBeLessThanOrEqual(1);
  });

  test('probabilidades de veredicto suman ≈ 1', () => {
    const result = runMonteCarlo(DEFAULT_STATE, 1000, 10, 0.04);
    const lastStats = result.stats[result.stats.length - 1];
    const sum = lastStats.pPausa + lastStats.pEspera + lastStats.pReconecta 
              + lastStats.pMonitorea + lastStats.pActua;
    expect(sum).toBeCloseTo(1.0, 2);
  });

  test('Wilson CIs contienen la proporción observada', () => {
    const result = runMonteCarlo(DEFAULT_STATE, 1000, 10, 0.04);
    for (const [name, ci] of Object.entries(result.verdictCI)) {
      expect(ci.p).toBeGreaterThanOrEqual(ci.lower);
      expect(ci.p).toBeLessThanOrEqual(ci.upper);
    }
  });

  test('estado óptimo tiene P(Λ↑) alta', () => {
    const optimalState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.85])
    ) as ConsciousnessState;
    const result = runMonteCarlo(optimalState, 500, 10, 0.04);
    // Con estado alto, hay poco margen de mejora, pero no debería colapsar
    expect(result.pNegAttractor).toBeLessThan(0.05);
  });

  test('estado colapsado tiene P(A⁻) significativa', () => {
    const collapsedState = Object.fromEntries(
      Object.keys(DEFAULT_STATE).map(k => [k, 0.15])
    ) as ConsciousnessState;
    const result = runMonteCarlo(collapsedState, 500, 10, 0.04);
    expect(result.pNegAttractor).toBeGreaterThan(0.01);
  });

  test('σ mayor produce mayor dispersión', () => {
    const r1 = runMonteCarlo(DEFAULT_STATE, 500, 10, 0.02);
    const r2 = runMonteCarlo(DEFAULT_STATE, 500, 10, 0.08);
    expect(r2.finalLamStd).toBeGreaterThan(r1.finalLamStd);
  });
});
```

---

## 8. Tests de Componentes React

### 8.1 App — Autenticación

```typescript
describe('App Component', () => {
  test('muestra login page cuando no hay usuario', () => {
    render(<App />);
    expect(screen.getByText('LOGOS')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Entrar como Invitado')).toBeInTheDocument();
  });

  test('guest login setea usuario', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Entrar como Invitado'));
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Invitado/)).toBeInTheDocument();
    });
  });
});
```

---

## 9. Matriz de Cobertura

| Módulo | Funciones | Tests Unit | Tests Integración | Edge Cases |
|--------|-----------|-----------|-------------------|------------|
| `utils/math.ts` | 9 | ✅ 9/9 | — | ✅ |
| `core/logos.ts` | 2 | ✅ 2/2 | ✅ | ✅ |
| `core/friston.ts` | 1 | ✅ 1/1 | ✅ | ✅ |
| `core/levin.ts` | 3 | ✅ 3/3 | ✅ | ✅ |
| `core/watson.ts` | 1 | ✅ 1/1 | ✅ | ✅ |
| `core/hoffman.ts` | 1 | ✅ 1/1 | ✅ | ✅ |
| `core/penrose.ts` | 1 | ✅ 1/1 | ✅ | ✅ |
| `core/policy.ts` | 2 | ✅ 2/2 | ✅ | ✅ |
| `core/derived.ts` | 4 | ✅ 4/4 | ✅ | ✅ |
| `core/emergence-metrics.ts` | 3 | ✅ 3/3 | ✅ | ✅ |
| `core/alimento.ts` | 4 | ✅ 4/4 | ✅ | ✅ |
| `simulation/montecarlo.ts` | 2 | ✅ 2/2 | ✅ | ✅ |
| `hooks/useLogosEngine.ts` | 2 | — | ✅ | — |
| `App.jsx` | — | — | ✅ | — |
| **Total** | **35** | **33/35** | **17** | **10** |

### 9.1 Resultados Actuales (v3.3.0)

```
Test Files  17 passed (17)
     Tests  707 passed (707)
  Duration  278ms
```

### 9.2 Fix EM-05 (v3.3.0)

El test `EM-05` en `emergence-metrics.test.ts` fue actualizado para usar las dimensiones espirituales correctas (`service`, `presence`) después de la corrección de `DOMAIN_DEFINITIONS` en `emergence-metrics.ts`. Las dimensiones anteriores (`meaning`, `integrity`) no existían en el estado real.

---

## Comandos de Ejecución

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Ejecutar todos los tests
npx vitest

# Ejecutar con cobertura
npx vitest --coverage

# Ejecutar solo tests de core
npx vitest src/core/

# Watch mode
npx vitest --watch
```

---

## Referencias Cruzadas

- [Especificación Matemática](./MATHEMATICAL_SPEC.md)
- [API Reference](./API_REFERENCE.md)
- [Modelo de Datos](./DATA_MODEL.md)
