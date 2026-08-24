# PROTOCOLO EXPERIMENTAL: Validación de Hipótesis H1-H5
## Marco Hoffman-Levin-PE/VEP para Agricultura Consciente

**Proyecto:** CitrusMax AI - Tesis Doctoral  
**Autor:** Dr. José Manuel "Manny" Cadena Ortiz de Montellano  
**Institución:** Programa de Doctorado en Biología y Agronomía de Precisión  
**Fecha:** Diciembre 2025  
**Versión:** 1.0

---

## RESUMEN EJECUTIVO

Este protocolo define los procedimientos experimentales para validar las 5 hipótesis centrales del marco teórico Hoffman-Levin-PE/VEP aplicado a la agricultura de precisión en lima persa.

| Hipótesis | Descripción | Criterio de Éxito |
|-----------|-------------|-------------------|
| **H1** | Baja entropy rate ⟹ Alta PE | r < -0.5 (p<0.01) |
| **H2** | Traces distinguen realidades de agentes | D_KL > 0.3 |
| **H3** | Time dilation explica conflictos | r > 0.6 |
| **H4** | Goal-directed mejora ROI vs reactivo | +15% VEP |
| **H5** | Pattern discovery identifica patterns reales | 3/3 confirmados |

---

## 1. HIPÓTESIS H1: ENTROPY RATE Y PRODUCCIÓN EXPORTABLE

### 1.1 Formulación

> **H1:** Existe una correlación negativa significativa entre el entropy rate del FarmKernel y la Producción Exportable (PE).

**Fundamento teórico:** Árboles con transiciones de estado más predecibles (baja entropía) mantienen mejor homeostasis, lo que se traduce en mayor producción.

### 1.2 Variables

| Variable | Tipo | Unidad | Fuente |
|----------|------|--------|--------|
| **Entropy Rate H(X)** | Independiente | bits | FarmKernel (Markov) |
| **PE** | Dependiente | kg/ha/semana | appsheet.corte_limon |
| **Sección** | Control | S1, S2, S3 | - |
| **Semana ISO** | Control | 1-52 | - |

### 1.3 Diseño Experimental

**Tipo:** Estudio observacional retrospectivo + prospectivo

**Período:**
- Retrospectivo: 52 semanas (Enero 2025 - Diciembre 2025)
- Prospectivo: 26 semanas (Enero 2026 - Junio 2026)

**Unidad de análisis:** Sección-semana (n = 3 secciones × 52 semanas = 156 observaciones retrospectivas)

### 1.4 Procedimiento

```python
# 1. Construir FarmKernel semanal desde datos históricos
for semana in range(1, 53):
    for seccion in ['S1', 'S2', 'S3']:
        # Obtener estados de últimas 8 semanas
        estados = get_historical_states(seccion, semana, lookback=8)
        
        # Construir matriz de transición
        P = build_transition_matrix(estados)
        
        # Calcular entropy rate
        H = calculate_entropy_rate(P)
        
        # Obtener PE real de esa semana
        PE = get_actual_pe(seccion, semana)
        
        # Registrar observación
        registrar(semana, seccion, H, PE)

# 2. Calcular correlación
r, p_value = pearsonr(H_values, PE_values)

# 3. Validar criterio
if r < -0.5 and p_value < 0.01:
    print("H1 CONFIRMADA")
```

### 1.5 Análisis Estadístico

1. **Correlación de Pearson:** r(H, PE)
2. **Regresión lineal:** PE = β₀ + β₁×H + ε
3. **Test de significancia:** t-test para β₁ ≠ 0
4. **Análisis de residuos:** Verificar normalidad y homocedasticidad

### 1.6 Criterios de Éxito

| Nivel | Criterio | Interpretación |
|-------|----------|----------------|
| **Fuerte** | r < -0.5, p < 0.01 | H1 confirmada |
| **Moderado** | -0.5 ≤ r < -0.3, p < 0.05 | H1 parcialmente soportada |
| **Débil** | r > -0.3 o p ≥ 0.05 | H1 no soportada |

### 1.7 Datos Requeridos

```sql
-- Query para obtener datos de PE por sección y semana
SELECT 
    seccion,
    EXTRACT(WEEK FROM fecha) as semana_iso,
    EXTRACT(YEAR FROM fecha) as anio,
    AVG(produccion) as pe_promedio,
    SUM(produccion) as pe_total
FROM appsheet.corte_limon
WHERE fecha >= '2025-01-01'
GROUP BY seccion, semana_iso, anio
ORDER BY anio, semana_iso, seccion;

-- Query para obtener estados (IPF, plagas) por sección y semana
SELECT 
    seccion,
    EXTRACT(WEEK FROM fecha) as semana_iso,
    AVG(trips) as trips_avg,
    AVG(diaforina) as diaforina_avg,
    AVG(arana_roja) as arana_avg,
    MAX(trips) as trips_max
FROM appsheet.muestreo
WHERE fecha >= '2025-01-01'
GROUP BY seccion, semana_iso
ORDER BY semana_iso, seccion;
```

---

## 2. HIPÓTESIS H2: DIVERGENCIA DE TRACES ENTRE OBSERVADORES

### 2.1 Formulación

> **H2:** Los traces de diferentes agentes observadores (Health, Market, HO) presentan divergencias KL significativas (D_KL > 0.3).

**Fundamento teórico:** Cada agente "ve" una realidad diferente según las variables que percibe, lo que explica los conflictos en recomendaciones.

### 2.2 Variables

| Variable | Tipo | Unidad | Fuente |
|----------|------|--------|--------|
| **Trace_Health** | Independiente | Matriz P | TraceCalculator |
| **Trace_Market** | Independiente | Matriz P | TraceCalculator |
| **Trace_HO** | Independiente | Matriz P | TraceCalculator |
| **D_KL(i,j)** | Dependiente | bits | KL-divergence |

### 2.3 Diseño Experimental

**Tipo:** Análisis comparativo de matrices de transición

**Pares a comparar:**
1. Health vs Market
2. Health vs HO
3. Market vs HO
4. CFE vs Health
5. CFE vs Market
6. CFE vs HO

### 2.4 Procedimiento

```python
# 1. Obtener kernel global
kernel = get_farm_kernel()

# 2. Calcular traces para cada observador
trace_calc = TraceCalculator(kernel.P)

observers = ['CFE', 'Health', 'Market', 'HO', 'Financial']
traces = {}

for obs in observers:
    traces[obs] = trace_calc.compute_observer_trace(obs)

# 3. Calcular divergencias KL para todos los pares
divergences = {}
for i, obs1 in enumerate(observers):
    for obs2 in observers[i+1:]:
        d_kl = calculate_symmetric_kl(traces[obs1], traces[obs2])
        divergences[f"{obs1}_vs_{obs2}"] = d_kl

# 4. Validar criterio
significant_divergences = sum(1 for d in divergences.values() if d > 0.3)
print(f"Pares con D_KL > 0.3: {significant_divergences}/{len(divergences)}")
```

### 2.5 Criterios de Éxito

| Nivel | Criterio | Interpretación |
|-------|----------|----------------|
| **Fuerte** | ≥80% pares con D_KL > 0.3 | H2 confirmada |
| **Moderado** | 50-79% pares con D_KL > 0.3 | H2 parcialmente soportada |
| **Débil** | <50% pares con D_KL > 0.3 | H2 no soportada |

---

## 3. HIPÓTESIS H3: TIME DILATION Y CONFLICTOS

### 3.1 Formulación

> **H3:** La diferencia en factores de time dilation (γ) entre agentes correlaciona positivamente con la frecuencia de conflictos en recomendaciones.

**Fundamento teórico:** Agentes con γ muy diferentes experimentan "tiempos" distintos, lo que lleva a recomendaciones incompatibles.

### 3.2 Variables

| Variable | Tipo | Unidad | Fuente |
|----------|------|--------|--------|
| **Δγ(i,j)** | Independiente | ratio | TraceCalculator |
| **Frecuencia conflictos** | Dependiente | % semanas | Logs de recomendaciones |

### 3.3 Diseño Experimental

**Tipo:** Análisis correlacional retrospectivo

**Período:** 26 semanas de logs de recomendaciones

### 3.4 Procedimiento

```python
# 1. Calcular factores de time dilation
gammas = trace_calc.get_all_time_dilations()

# 2. Calcular diferencias entre pares
delta_gammas = {}
for i, (obs1, g1) in enumerate(gammas.items()):
    for obs2, g2 in list(gammas.items())[i+1:]:
        delta_gammas[f"{obs1}_vs_{obs2}"] = abs(g1 - g2)

# 3. Obtener frecuencia de conflictos históricos
# (De logs de recomendaciones donde agentes dieron recomendaciones opuestas)
conflict_frequency = get_historical_conflicts()

# 4. Calcular correlación
r, p = pearsonr(list(delta_gammas.values()), list(conflict_frequency.values()))

# 5. Validar criterio
if r > 0.6:
    print("H3 CONFIRMADA")
```

### 3.5 Criterios de Éxito

| Nivel | Criterio | Interpretación |
|-------|----------|----------------|
| **Fuerte** | r > 0.6 | H3 confirmada |
| **Moderado** | 0.4 < r ≤ 0.6 | H3 parcialmente soportada |
| **Débil** | r ≤ 0.4 | H3 no soportada |

---

## 4. HIPÓTESIS H4: GOAL-DIRECTED VS REACTIVO

### 4.1 Formulación

> **H4:** El sistema de recomendaciones goal-directed produce un VEP 15% superior al sistema reactivo tradicional.

**Fundamento teórico:** Recomendaciones orientadas a un objetivo futuro (pattern) optimizan mejor que respuestas inmediatas a estados actuales.

### 4.2 Variables

| Variable | Tipo | Unidad | Fuente |
|----------|------|--------|--------|
| **Sistema** | Independiente | goal-directed / reactivo | Asignación |
| **VEP** | Dependiente | USD/ha/ciclo | Cálculo económico |

### 4.3 Diseño Experimental

**Tipo:** Ensayo controlado aleatorizado (A/B test)

**Duración:** 8 semanas (2 ciclos de cosecha)

**Asignación:**
- Sección 1: Goal-directed
- Sección 2: Reactivo (control)
- Sección 3: Alternado cada 4 semanas (crossover)

### 4.4 Procedimiento

```
SEMANAS 1-4:
├── S1: Goal-directed
│   └── Recomendaciones orientadas a VEP óptimo semana 8
├── S2: Reactivo (control)
│   └── Recomendaciones basadas en estado actual
└── S3: Goal-directed
    └── Mismas recomendaciones que S1

SEMANAS 5-8:
├── S1: Goal-directed (continúa)
├── S2: Reactivo (continúa)
└── S3: Reactivo (crossover)

MEDICIONES:
├── PE semanal por sección
├── Precio promedio obtenido
├── Costos de intervenciones
├── VEP = PE × Precio - Costos
└── % mejora vs baseline
```

### 4.5 Criterios de Éxito

| Nivel | Criterio | Interpretación |
|-------|----------|----------------|
| **Fuerte** | ΔVEP ≥ 15%, p < 0.05 | H4 confirmada |
| **Moderado** | 10% ≤ ΔVEP < 15%, p < 0.05 | H4 parcialmente soportada |
| **Débil** | ΔVEP < 10% o p ≥ 0.05 | H4 no soportada |

---

## 5. HIPÓTESIS H5: PATTERN DISCOVERY

### 5.1 Formulación

> **H5:** El sistema de pattern discovery identifica correctamente patterns históricos exitosos que pueden ser replicados.

**Fundamento teórico:** Patrones de sincronización (IPF-precio-fenología) son reconocibles y repetibles.

### 5.2 Variables

| Variable | Tipo | Unidad | Fuente |
|----------|------|--------|--------|
| **Pattern predicho** | Independiente | etiqueta | PatternDiscovery |
| **Pattern observado** | Dependiente | etiqueta | Análisis post-hoc |
| **VEP del pattern** | Dependiente | USD/ha | Medición real |

### 5.3 Diseño Experimental

**Tipo:** Validación retrospectiva + prospectiva

**Procedimiento:**
1. Identificar 5 patterns históricos (2024-2025) con alta VEP
2. Entrenar sistema para reconocer estos patterns
3. Validar reconocimiento en 3 eventos conocidos
4. Predicción prospectiva de próximos 3 patterns

### 5.4 Patterns a Validar

| Pattern | Descripción | Frecuencia Histórica | VEP Adicional |
|---------|-------------|---------------------|---------------|
| **SYNC_OPT** | IPF alto + Precio pico + Fenología harvest | 3.2% semanas | +$2,100/ha |
| **PRICE_WINDOW** | Precio > $22/kg durante ≥2 semanas | 8% semanas | +$1,500/ha |
| **FEN_PEAK** | Fenología 06-07 con IPF > 0.90 | 12% semanas | +$900/ha |

### 5.5 Criterios de Éxito

| Nivel | Criterio | Interpretación |
|-------|----------|----------------|
| **Fuerte** | 3/3 patterns confirmados | H5 confirmada |
| **Moderado** | 2/3 patterns confirmados | H5 parcialmente soportada |
| **Débil** | ≤1/3 patterns confirmados | H5 no soportada |

---

## 6. TIMELINE DE VALIDACIÓN

```
FASE 1: PREPARACIÓN (Semanas 1-2)
├── Configurar módulo citrusmax_bioelectric en producción
├── Verificar sincronización de datos PostgreSQL
├── Establecer baseline de métricas
└── Entrenar equipo en protocolo

FASE 2: VALIDACIÓN H1-H3 (Semanas 3-8)
├── Construir FarmKernels semanales
├── Calcular entropy rates
├── Calcular traces y divergencias
├── Calcular factores γ
├── Análisis correlacional H1
├── Análisis divergencia H2
└── Análisis conflictos H3

FASE 3: VALIDACIÓN H4 (Semanas 9-16)
├── Implementar goal-directed engine
├── Ejecutar A/B test por sección
├── Medir VEP por sistema
└── Análisis comparativo

FASE 4: VALIDACIÓN H5 (Semanas 17-22)
├── Entrenar pattern discovery
├── Validar patterns históricos
├── Predicción prospectiva
└── Confirmación de predicciones

FASE 5: ANÁLISIS Y PUBLICACIÓN (Semanas 23-26)
├── Análisis integrado de resultados
├── Redacción de paper
├── Revisión y correcciones
└── Submission a Frontiers in Plant Science
```

---

## 7. RECURSOS REQUERIDOS

### 7.1 Infraestructura

| Recurso | Especificación | Estado |
|---------|---------------|--------|
| PostgreSQL | citrusmax_biofix en 44.247.163.1 | ✅ Operativo |
| Backend | FastAPI con módulo bioelectric | ✅ Implementado |
| Dashboard | Panel de coherencia | 🔄 Por agregar |
| Logs | Sistema de registro de recomendaciones | ✅ Operativo |

### 7.2 Datos

| Fuente | Período | Registros |
|--------|---------|-----------|
| appsheet.muestreo | 2024-2025 | ~5,100 |
| appsheet.corte_limon | 2024-2025 | ~785 |
| appsheet.aplicaciones | 2024-2025 | ~9,800 |
| Weather APIs | Continuo | ~53,000 |

### 7.3 Personal

| Rol | Responsabilidad | Tiempo |
|-----|-----------------|--------|
| Investigador principal | Diseño, análisis, redacción | 20h/sem |
| Técnico de campo | Recolección datos, muestreos | 10h/sem |
| Desarrollador | Mantenimiento sistema | 5h/sem |

---

## 8. CONSIDERACIONES ÉTICAS

- No se realizan experimentos en seres humanos
- Los árboles son sujetos de estudio observacional
- Todas las intervenciones son prácticas agrícolas estándar
- Los datos se anonimizan para publicación
- Aprobación del propietario de Finca La Luz obtenida

---

## 9. PLAN DE CONTINGENCIA

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Datos insuficientes | Baja | Alto | Extender período de observación |
| H1 no confirmada | Media | Medio | Revisar discretización de estados |
| Sistema caído | Baja | Alto | Backup en AWS, failover |
| Eventos climáticos extremos | Media | Medio | Excluir semanas anómalas del análisis |

---

## 10. OUTPUTS ESPERADOS

1. **Validación de H1-H5** con métricas cuantitativas
2. **Paper científico** para Frontiers in Plant Science
3. **Dataset publicable** (anonimizado) para reproducibilidad
4. **Modelo calibrado** de FarmKernel para Citrus latifolia
5. **Protocolo replicable** para otros cultivos

---

_Documento generado: 30 Diciembre 2025_  
_Estado: APROBADO PARA IMPLEMENTACIÓN_  
_Siguiente paso: Iniciar Fase 1 (Preparación)_
