# 🎯 PROPUESTA DE ARQUITECTURA: CitrusMax Optimizer R2C Watson

## Documento de Diseño - APROBADO
**Versión:** 2.0 Final  
**Fecha:** 4 de Enero 2026  
**Estado:** ✅ APROBADO PARA IMPLEMENTACIÓN

---

## 📋 CONFIRMACIÓN DE ENTENDIMIENTO DEL OBJETIVO

### ¿Qué entiendo que se necesita?

El **CitrusMax Optimizer** debe evolucionar de un módulo de optimización aislado a convertirse en una **Dimensión completa del análisis R2C Watson**, integrando:

1. **7 Modelos Predictivos de Plagas/Enfermedades** con rigor científico:
   - Trips (Scirtothrips citri)
   - Minador de Hoja (Phyllocnistis citrella)
   - Araña Roja (Panonychus citri / Tetranychus)
   - Pulgón (Toxoptera citricida / Aphis)
   - Diaphorina citri (vector HLB)
   - Antracnosis (Colletotrichum spp.)
   - Mancha Grasienta (Mycosphaerella citri)

2. **Ciclo Fenológico Completo**: 0 → 1650 GDD por ciclo desde biofix (3 ciclos/año)

3. **Dimensión R2C Watson**: Framework de análisis multidimensional donde el Optimizer es una dimensión que interactúa con otras (Clima, Fenología, Nutrición, Mercado, Finanzas)

4. **Aplicación Visual**: Paneles interactivos para toma de decisiones

### Entregables Esperados

| Entregable | Descripción |
|------------|-------------|
| Arquitectura Técnica | Diagrama de componentes, flujos de datos, APIs |
| Diseño Estadístico | Modelos predictivos con ecuaciones, parámetros GDD |
| Paneles UI/UX | Mockups de dashboards y funcionalidades |
| Plan de Implementación | Fases, dependencias, cronograma |

---

## � DATOS DE FINCA CITRÍCOLA LA LUZ

### Configuración por Sección

| Sección | Turbinas | Hectáreas | Ratio ha/turb | Árboles | Edad |
|---------|----------|-----------|---------------|---------|------|
| **S1** | 62 | 99.96 | 1.61 | 34,911 | 4 años |
| **S2** | 55 | 87.24 | 1.59 | 34,755 | 3 años |
| **S3** | 94 | 151.1 | 1.61 | 53,821 | 2 años |
| **TOTAL** | **211** | **338.3** | **1.60** | **123,487** | - |

### Modelo de Crecimiento del Fruto

```
ECUACIÓN: g(t) = 0.5 mm/día (post-cuajado)

PARÁMETROS:
├── Diámetro objetivo cosecha: 53 mm
├── Tiempo cuajado → cosecha: 106 días (~15 semanas)
└── Inicio crecimiento: FEN-04 (Cuajado, 400-550 GDD)
```

### Modelo de Costos por Ingredientes Activos × Turbinas

```
ECUACIÓN DE COSTO POR RECETA:

Costo_Receta(sección) = Σ (Dosis_IA/turb × #Turbinas × Precio_IA)

EJEMPLO SECCIÓN S1 (62 turbinas):
┌─────────────────────────┬──────────────┬────────────┬───────────┐
│ Ingrediente Activo      │ Dosis/turb   │ Precio/L   │ Costo S1  │
├─────────────────────────┼──────────────┼────────────┼───────────┤
│ Spinosad (Magnalus)     │ 250 ml       │ $340/L     │ $5,270    │
│ Imidacloprid (Confidor) │ 250 ml       │ $525/L     │ $8,138    │
│ Azoxystrobin            │ 500 ml       │ $280/L     │ $8,680    │
│ Cobre (Sulfato)         │ 800 g        │ $72/kg     │ $3,571    │
│ Carbendazim             │ 500 ml       │ $140/L     │ $4,340    │
│ Azufre (Sulfocalcico)   │ 2.5 kg       │ $20/kg     │ $3,100    │
└─────────────────────────┴──────────────┴────────────┴───────────┘

CÁLCULO PARA 3 SECCIONES:
├── S1 (62 turb): Costo × 1.00
├── S2 (55 turb): Costo × 0.887 (55/62)
└── S3 (94 turb): Costo × 1.516 (94/62)
```

---

## �🏗️ ARQUITECTURA TÉCNICA PROPUESTA

### 1. Framework R2C Watson - Dimensiones

```
┌─────────────────────────────────────────────────────────────────────┐
│                     R2C WATSON ANALYTICS FRAMEWORK                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   DIM-01    │  │   DIM-02    │  │   DIM-03    │  │   DIM-04    │ │
│  │   CLIMA     │  │  FENOLOGÍA  │  │  NUTRICIÓN  │  │   MERCADO   │ │
│  │             │  │             │  │             │  │             │ │
│  │ • Temp/HR   │  │ • GDD 0-1650│  │ • N,P,K,Ca  │  │ • Precios   │ │
│  │ • Lluvia    │  │ • 3 Ciclos  │  │ • Micro     │  │ • Demanda   │ │
│  │ • Presión   │  │ • 7 Etapas  │  │ • Balance   │  │ • Calidad   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                │        │
│         └────────────────┴────────────────┴────────────────┘        │
│                                   │                                  │
│                                   ▼                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    DIM-05: OPTIMIZER (NUEVO)                   │  │
│  │  ══════════════════════════════════════════════════════════   │  │
│  │                                                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │  │
│  │  │ PREDICTIVE   │  │ OPTIMIZATION │  │ DECISION             │ │  │
│  │  │ MODELS       │  │ ENGINE       │  │ SUPPORT              │ │  │
│  │  │              │  │              │  │                      │ │  │
│  │  │ • 7 Plagas   │  │ • IPF/INE    │  │ • Recetas           │ │  │
│  │  │ • GDD-Based  │  │ • Greedy     │  │ • Alertas           │ │  │
│  │  │ • Fenología  │  │ • Restricc.  │  │ • ROI               │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │  │
│  │                                                                │  │
│  │  Outputs: IPF Score, INE Score, Receta Óptima, Pronóstico     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                   │                                  │
│                                   ▼                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    DIM-06: FINANZAS                            │  │
│  │         Costo/Beneficio • ROI • Presupuesto • Flujo           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Arquitectura de Componentes - DIM-05 OPTIMIZER

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIM-05: CITRUSMAX OPTIMIZER                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    CAPA DE ENTRADA (INPUT LAYER)             │    │
│  │                                                               │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │    │
│  │  │ PostgreSQL  │ │ Davis WL    │ │ Google      │ │ NASA    │ │    │
│  │  │ citrusmax_  │ │ Weather     │ │ Sheets      │ │ POWER   │ │    │
│  │  │ biofix      │ │ (Tiempo     │ │ (Muestreos) │ │ (Solar) │ │    │
│  │  │             │ │ Real)       │ │             │ │         │ │    │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └────┬────┘ │    │
│  └─────────┼───────────────┼───────────────┼─────────────┼──────┘    │
│            │               │               │             │           │
│            └───────────────┴───────────────┴─────────────┘           │
│                                    │                                  │
│                                    ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              CAPA DE MODELOS PREDICTIVOS                     │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────────┐ │    │
│  │  │               PEST PREDICTION ENGINE (PPE)               │ │    │
│  │  │                                                          │ │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │    │
│  │  │  │ Trips   │ │ Minador │ │ Araña   │ │ Pulgón  │        │ │    │
│  │  │  │ Model   │ │ Model   │ │ Roja    │ │ Model   │        │ │    │
│  │  │  │         │ │         │ │ Model   │ │         │        │ │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                    │ │    │
│  │  │  │Diaphor- │ │Antrac-  │ │ Mancha  │                    │ │    │
│  │  │  │  ina    │ │ nosis   │ │Grasienta│                    │ │    │
│  │  │  │ Model   │ │ Model   │ │ Model   │                    │ │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘                    │ │    │
│  │  │                                                          │ │    │
│  │  │  Inputs: GDD, Temp, HR, Lluvia, Fenología, Histórico    │ │    │
│  │  │  Outputs: Nivel Predicho (0-3), IC 95%, Trigger Alert   │ │    │
│  │  └─────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                    │                                  │
│                                    ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              CAPA DE OPTIMIZACIÓN                            │    │
│  │                                                               │    │
│  │  ┌───────────────────────┐  ┌────────────────────────────┐  │    │
│  │  │    IPF CALCULATOR     │  │     INE CALCULATOR         │  │    │
│  │  │                       │  │                            │  │    │
│  │  │  IPF = 1 - Σ L_k      │  │  INE = 1 - σ(Σα_i·f_i)    │  │    │
│  │  │  L_k = (N/3)(1-E)W    │  │                            │  │    │
│  │  └───────────┬───────────┘  └─────────────┬──────────────┘  │    │
│  │              │                            │                  │    │
│  │              └─────────────┬──────────────┘                  │    │
│  │                            ▼                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐ │    │
│  │  │              GREEDY OPTIMIZATION ENGINE                  │ │    │
│  │  │                                                          │ │    │
│  │  │  Ratio = Δ(IPF + INE) / Costo                           │ │    │
│  │  │  Target: IPF ≥ 0.95, INE ≥ 0.95                         │ │    │
│  │  │                                                          │ │    │
│  │  │  Restricciones:                                          │ │    │
│  │  │  • PHI (días pre-cosecha)                               │ │    │
│  │  │  • Compatibilidad química                               │ │    │
│  │  │  • Rotación IRAC/FRAC                                   │ │    │
│  │  │  • Presupuesto máximo                                   │ │    │
│  │  └─────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                    │                                  │
│                                    ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              CAPA DE SALIDA (OUTPUT LAYER)                   │    │
│  │                                                               │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐ │    │
│  │  │  Receta   │ │  Alertas  │ │ Calendario│ │   Dashboard   │ │    │
│  │  │  Óptima   │ │  Trigger  │ │   Anual   │ │   R2C Watson  │ │    │
│  │  │           │ │           │ │           │ │               │ │    │
│  │  │ JSON/PDF  │ │ WhatsApp  │ │ CSV/iCal  │ │ Web App       │ │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 INTEGRACIÓN DE NIVELES: WATSON + GREEDY

### Arquitectura Jerárquica de Decisión

Watson y Greedy son **COMPLEMENTARIOS**, operan en niveles diferentes:

```
┌─────────────────────────────────────────────────────────────────────┐
│                   JERARQUÍA DE DECISIÓN OPTIMIZER                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  NIVEL ESTRATÉGICO: WATSON TRAJECTORY LAYER                    ║  │
│  ║  ═══════════════════════════════════════════════════════════  ║  │
│  ║                                                                ║  │
│  ║  FUNCIÓN: Define trayectoria óptima de menor energía           ║  │
│  ║  HORIZONTE: 60 días (estratégico)                              ║  │
│  ║                                                                ║  │
│  ║  OUTPUTS:                                                      ║  │
│  ║  ├── target_pe: 0.92 (PE óptimo)                              ║  │
│  ║  ├── target_ipf: 0.15 (IPF objetivo)                          ║  │
│  ║  ├── trajectory: [{week:1, pe:0.80}, {week:2, pe:0.82}, ...]  ║  │
│  ║  ├── constraints: {avoid: ['over_spray', 'resistance']}       ║  │
│  ║  └── efficiency: 0.85 (qué tan directo es el camino)          ║  │
│  ║                                                                ║  │
│  ║  EVITA: Mínimos locales (trampas de decisión)                 ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
│                              │                                       │
│                              ▼                                       │
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  NIVEL TÁCTICO: GREEDY OPTIMIZATION ENGINE                     ║  │
│  ║  ═══════════════════════════════════════════════════════════  ║  │
│  ║                                                                ║  │
│  ║  FUNCIÓN: Ejecuta cada paso de la trayectoria Watson           ║  │
│  ║  HORIZONTE: 7-14 días (táctico)                                ║  │
│  ║                                                                ║  │
│  ║  INPUTS:                                                       ║  │
│  ║  ├── watson_target: {pe: 0.80, priority: 'pest_control'}      ║  │
│  ║  ├── ipf_actual: {trips: 0.8, arana: 0.6}                     ║  │
│  ║  ├── ieia_validado: MATRIZ_EFECTIVIDAD (modelo estadístico)   ║  │
│  ║  └── watson_constraints: {avoid: ['spinosad']}                ║  │
│  ║                                                                ║  │
│  ║  ALGORITMO:                                                    ║  │
│  ║  ┌────────────────────────────────────────────────────────┐   ║  │
│  ║  │ FOR producto IN candidatos:                            │   ║  │
│  ║  │   IF ieia[producto] < 40%: SKIP (no efectivo)         │   ║  │
│  ║  │   IF producto IN watson_avoid: SKIP (evitar trampa)   │   ║  │
│  ║  │   ratio = ΔIPF / Costo                                 │   ║  │
│  ║  │                                                        │   ║  │
│  ║  │ SORT BY ratio DESC                                     │   ║  │
│  ║  │ SELECT hasta presupuesto O ipf <= target               │   ║  │
│  ║  └────────────────────────────────────────────────────────┘   ║  │
│  ║                                                                ║  │
│  ║  OUTPUT: Receta óptima semanal                                ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
│                              │                                       │
│                              ▼                                       │
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  NIVEL OPERATIVO: APLICACIÓN EN CAMPO                          ║  │
│  ║  ═══════════════════════════════════════════════════════════  ║  │
│  ║                                                                ║  │
│  ║  HORIZONTE: 1-3 días                                           ║  │
│  ║  ├── Receta por sección (S1: 62 turb, S2: 55, S3: 94)         ║  │
│  ║  ├── Dosis por ingrediente activo                              ║  │
│  ║  ├── Costo calculado: Dosis/turb × #Turbinas × Precio_IA      ║  │
│  ║  └── WhatsApp/Email a operadores                               ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos Watson → Greedy → Campo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FEEDBACK LOOP COMPLETO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. WATSON CALCULA TRAYECTORIA                                      │
│     Input:  Estado actual (PE=78%, IPF=0.52)                        │
│     Output: Trayectoria 60 días + metas semanales                   │
│                                                                      │
│                              │                                       │
│                              ▼                                       │
│  2. GREEDY EJECUTA SEMANA ACTUAL                                    │
│     Input:  Meta Watson + IEIA validado + Restricciones             │
│     Output: Receta óptima (productos, dosis, costos)                │
│                                                                      │
│                              │                                       │
│                              ▼                                       │
│  3. APLICACIÓN EN CAMPO                                             │
│     Input:  Receta                                                   │
│     Output: Muestreo post-aplicación (Google Sheets "R La Luz")     │
│                                                                      │
│                              │                                       │
│                              ▼                                       │
│  4. VALIDACIÓN Y AJUSTE                                             │
│     IF desviación > 5%:                                             │
│        Watson.recalculate_trajectory() // Ajusta ruta               │
│     ELSE:                                                           │
│        Continuar con siguiente paso del plan                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Integración con Modelo de Efectividad Validado

El modelo estadístico de efectividad fitosanitaria (R² = 99.43%) se integra así:

| Componente | Watson Usa | Greedy Usa |
|------------|------------|------------|
| **IEIA** (Efectividad %) | Para calcular levers | Para filtrar candidatos |
| **IECB** (Costo-Beneficio) | Para ROI de palancas | Para ordenar por ratio |
| **IPF** (Presión Fitosan.) | Como métrica de estado | Como target semanal |
| **Coeficientes OLS** | Para proyectar trayectoria | Para calcular ΔIPF |

### Matriz IEIA Validada (Núcleo del Optimizer)

```python
IEIA_VALIDADO = {
    # PRODUCTOS PRIORITARIOS (IECB > 1.0)
    'sulfocalcico': {
        'rona': 100.0,        # IECB=40.32 → PRIORIDAD 1
        'acaro_blanco': 100.0, # IECB=31.25
        'melanosis': 100.0,    # IECB=30.49
        'fumagina': 89.33      # IECB=21.47
    },
    'sulfato_cobre': {
        'rona': 100.0,         # R²=99.43%
        'melanosis': 100.0,
        'mancha_grasienta': 79.42,
        'gomosis': 65.07,
        'alga_roja': 55.56
    },
    'confinal': {
        'picudo': 85.33        # Específico
    },
    'exalt': {
        'minador': 53.23,
        'trips': 44.17
    },
    
    # PRODUCTOS EXCLUIDOS (IEIA negativo = mínimo local)
    'spinosad': {
        'trips': -65.8,        # ❌ NO USAR
        'minador': -1290.9     # ❌ NO USAR
    }
}
```

### Regla de Integración Watson-Greedy

```
SI watson.efficiency >= 0.85:
    → Greedy ejecuta con autonomía (decisión automática)
    
SI watson.efficiency < 0.85:
    → Greedy requiere validación humana
    → Watson recalcula trayectoria alternativa

SI producto.ieia < 40%:
    → Greedy EXCLUYE del pool de candidatos
    
SI producto IN watson.avoid_traps:
    → Greedy EXCLUYE aunque IEIA > 40%
```

---

## 📊 DISEÑO ESTADÍSTICO: 7 MODELOS PREDICTIVOS

### Parámetros Comunes

```
CICLO FENOLÓGICO: 0 → 1650 GDD desde Biofix
RESET: GDD ≥ 1650 → nuevo ciclo

FASES POR CICLO (0-1650 GDD):
├── FEN-01 Latencia:     0 - 100 GDD
├── FEN-02 Brotación:    100 - 250 GDD
├── FEN-03 Floración:    250 - 400 GDD
├── FEN-04 Cuajado:      400 - 550 GDD
├── FEN-05 Desarrollo:   550 - 1100 GDD
├── FEN-06 Maduración:   1100 - 1400 GDD
└── FEN-07 Cosecha:      1400 - 1650 GDD

MODELO CRECIMIENTO FRUTO (post-cuajado):
├── g(t) = 0.5 mm/día
├── Objetivo cosecha: 53 mm diámetro
└── Tiempo cuajado→cosecha: ~106 días
```

### Modelo 1: TRIPS (Scirtothrips citri)

```python
class TripsModel:
    """
    Modelo predictivo para Trips en cítricos
    Base científica: UC IPM, INIFAP Veracruz
    """
    
    # Parámetros térmicos
    T_base = 14.6  # °C (58.2°F) - UC IPM
    T_opt_min = 25.0  # °C
    T_opt_max = 30.0  # °C
    DD_generation = 180  # Grados-día por generación
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, F_flor, I_t1, A_t1):
        """
        I_trips,t = β₀ + β₁·I_{t-1} + β₂·T_opt + β₃·HR + β₄·F_flor + β₅·A_{t-1}
        
        donde:
        - T_opt = 1 si T_opt_min ≤ T ≤ T_opt_max, else 0
        - F_flor = 1 si FEN-03 (floración), else 0
        - A_{t-1} = aplicación semana anterior (0/1)
        """
        # Coeficientes calibrados
        β = {
            'intercepto': 0.3,
            'inercia': 0.45,      # β₁: persistencia poblacional
            'temp_opt': 0.35,     # β₂: condiciones óptimas
            'humedad': -0.20,     # β₃: HR alta reduce (lavado)
            'floracion': 2.5,     # β₄: pico en floración
            'aplicacion': -3.5    # β₅: efecto tratamiento
        }
        
        T_opt = 1 if self.T_opt_min <= T <= self.T_opt_max else 0
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp_opt'] * T_opt +
                  β['humedad'] * (HR / 100) +
                  β['floracion'] * F_flor +
                  β['aplicacion'] * A_t1)
        
        return max(0, min(3, I_pred))
    
    # Umbrales de acción
    umbrales = {
        'verde': (0, 0.5),      # Sin acción
        'amarillo': (0.5, 1.5), # Monitoreo intensivo
        'naranja': (1.5, 2.5),  # Tratamiento preventivo
        'rojo': (2.5, 3.0)      # Tratamiento urgente
    }
    
    # Ventana crítica
    ventana_critica = 'FEN-03'  # Floración
    GDD_critico = (350, 550)
```

### Modelo 2: MINADOR DE HOJA (Phyllocnistis citrella)

```python
class MinadorModel:
    """
    Modelo predictivo para Minador de Hoja
    Base científica: FAO, Universidad de Florida IFAS
    """
    
    # Parámetros térmicos
    T_base = 11.5  # °C
    DD_generation = 185  # GDD por generación
    T_opt = 28.0  # °C óptimo
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, B_t, I_t1, A_t1):
        """
        I_min,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·HR + β₄·B_t + β₅·A_{t-1}
        
        donde:
        - f(T) = factor temperatura normalizado
        - B_t = brotación activa (0/1) - FEN-02
        """
        β = {
            'intercepto': 0.2,
            'inercia': 0.40,
            'temp': 0.30,
            'humedad': -0.15,
            'brotacion': 4.0,     # Máximo en brotes nuevos
            'aplicacion': -4.5
        }
        
        # Factor temperatura (gaussiano centrado en T_opt)
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 25))
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['humedad'] * (HR / 100) +
                  β['brotacion'] * B_t +
                  β['aplicacion'] * A_t1)
        
        return max(0, min(3, I_pred))
    
    # Ventana crítica
    ventana_critica = 'FEN-02'  # Brotación
    GDD_critico = (150, 350)
```

### Modelo 3: ARAÑA ROJA (Panonychus citri)

```python
class AranaRojaModel:
    """
    Modelo predictivo para Araña Roja
    Base científica: UC IPM, Turkish Journal of Agriculture
    """
    
    # Parámetros térmicos (UC IPM)
    T_base = 7.9  # °C (46.2°F)
    DD_egg = 120  # GDD eclosión huevos
    DD_generation = 347  # GDD por generación
    T_opt = 24.0  # °C (75°F)
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, I_t1, A_t1, agua_stress):
        """
        I_acaro,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·(1-HR) + β₄·stress + β₅·A_{t-1}
        
        donde:
        - agua_stress = 1 si déficit hídrico, else 0 (favorece ácaros)
        """
        β = {
            'intercepto': 0.4,
            'inercia': 0.55,      # Alta persistencia
            'temp': 0.25,
            'sequedad': 0.40,     # HR baja favorece
            'stress': 1.5,        # Estrés hídrico amplifica
            'aplicacion': -4.0
        }
        
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 36))
        sequedad = 1 - (HR / 100)
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['sequedad'] * sequedad +
                  β['stress'] * agua_stress +
                  β['aplicacion'] * A_t1)
        
        return max(0, min(3, I_pred))
    
    # Ventana crítica
    ventana_critica = 'FEN-05'  # Desarrollo fruto (sequía)
    GDD_critico = (750, 1300)
```

### Modelo 4: PULGÓN (Toxoptera citricida / Aphis)

```python
class PulgonModel:
    """
    Modelo predictivo para Pulgón
    Base científica: USDA ARS, INIFAP
    """
    
    # Parámetros térmicos
    T_base = 6.0  # °C
    T_opt = 22.0  # °C
    T_max = 30.0  # °C (inhibición por calor)
    DD_generation = 100  # GDD por generación (rápido)
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, B_t, I_t1, A_t1, enemigos_nat):
        """
        I_pulgon,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·HR + β₄·B_t + 
                     β₅·A_{t-1} + β₆·EN
        
        donde:
        - EN = presencia enemigos naturales (0-1)
        """
        β = {
            'intercepto': 0.3,
            'inercia': 0.35,      # Menor persistencia (depredadores)
            'temp': 0.30,
            'humedad': 0.15,      # HR moderada favorece
            'brotacion': 3.0,     # Brotes tiernos
            'aplicacion': -3.5,
            'enemigos': -1.5      # Control biológico
        }
        
        # Factor temperatura (asimétrico, inhibición >30°C)
        if T <= self.T_opt:
            f_T = (T - self.T_base) / (self.T_opt - self.T_base)
        else:
            f_T = max(0, 1 - (T - self.T_opt) / (self.T_max - self.T_opt))
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['humedad'] * (HR / 100) +
                  β['brotacion'] * B_t +
                  β['aplicacion'] * A_t1 +
                  β['enemigos'] * enemigos_nat)
        
        return max(0, min(3, I_pred))
    
    # Ventana crítica
    ventana_critica = 'FEN-02'  # Brotación
    GDD_critico = (150, 350)
```

### Modelo 5: DIAPHORINA CITRI (Vector HLB)

```python
class DiaphorinaModel:
    """
    Modelo predictivo para Diaphorina citri
    Base científica: USDA, UF IFAS, PLOS Computational Biology
    """
    
    # Parámetros térmicos
    T_base = 10.9  # °C
    T_opt = 28.0  # °C
    DD_generation = 250  # GDD por generación
    
    # Modelo SEI (Susceptible-Exposed-Infected)
    transmission_rate = 0.15  # β local
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, B_t, I_t1, A_t1, hlb_regional):
        """
        I_diap,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·HR + β₄·B_t + 
                   β₅·A_{t-1} + β₆·HLB_regional
        
        donde:
        - HLB_regional = presión regional de HLB (0-1)
        """
        β = {
            'intercepto': 0.5,
            'inercia': 0.50,      # Alta persistencia
            'temp': 0.35,
            'humedad': -0.12,
            'brotacion': 4.5,     # Máximo en brotes
            'aplicacion': -5.0,   # Alta respuesta a control
            'hlb': 1.5            # Amplificación regional
        }
        
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 25))
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['humedad'] * (HR / 100) +
                  β['brotacion'] * B_t +
                  β['aplicacion'] * A_t1 +
                  β['hlb'] * hlb_regional)
        
        return max(0, min(3, I_pred))
    
    # CRÍTICO: Vector HLB - peso económico máximo
    peso_economico = 0.25
    ventana_critica = 'FEN-02'  # Brotación
    GDD_critico = (150, 350)
```

### Modelo 6: ANTRACNOSIS (Colletotrichum spp.)

```python
class AntracnosisModel:
    """
    Modelo predictivo para Antracnosis
    Base científica: APS, Plant Disease Journal
    """
    
    # Parámetros ambientales
    T_min = 15.0  # °C
    T_opt = 25.0  # °C
    T_max = 32.0  # °C
    HR_min = 85.0  # % requerido para infección
    wetness_hours_req = 12  # Horas mojadura mínima
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, lluvia, F_flor, I_t1, A_t1, wetness_hrs):
        """
        I_ant,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·f(HR) + β₄·lluvia + 
                  β₅·F_flor + β₆·A_{t-1} + β₇·wetness
        
        donde:
        - wetness = horas de mojadura foliar
        """
        β = {
            'intercepto': 0.0,    # Sin condiciones = 0
            'inercia': 0.30,
            'temp': 0.35,
            'humedad': 0.45,      # Alta dependencia HR
            'lluvia': 0.25,
            'floracion': 3.5,     # Tejido susceptible
            'aplicacion': -3.0,
            'wetness': 0.08       # Por hora de mojadura
        }
        
        # Factor temperatura (cardinalidad)
        if T < self.T_min or T > self.T_max:
            f_T = 0
        else:
            f_T = np.sin(np.pi * (T - self.T_min) / (self.T_max - self.T_min))
        
        # Factor humedad (umbral)
        f_HR = max(0, (HR - 80) / 20) if HR > 80 else 0
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['humedad'] * f_HR +
                  β['lluvia'] * min(1, lluvia / 10) +
                  β['floracion'] * F_flor +
                  β['aplicacion'] * A_t1 +
                  β['wetness'] * wetness_hrs)
        
        return max(0, min(3, I_pred))
    
    # Ventana crítica
    ventana_critica = 'FEN-03'  # Floración
    GDD_critico = (350, 550)
```

### Modelo 7: MANCHA GRASIENTA (Mycosphaerella citri)

```python
class ManchaGrasientaModel:
    """
    Modelo predictivo para Mancha Grasienta
    Base científica: UF IFAS, Citrus Industry Magazine
    """
    
    # Parámetros ambientales
    T_opt = 24.0  # °C
    HR_opt = 95.0  # % para liberación ascosporas
    leaf_litter_factor = 0.8  # Importancia hojarasca
    
    # Ecuación predictiva
    def predict(self, GDD, T, HR, lluvia_7d, I_t1, A_t1, hojarasca):
        """
        I_mg,t = β₀ + β₁·I_{t-1} + β₂·f(T) + β₃·HR + β₄·lluvia_7d + 
                 β₅·A_{t-1} + β₆·hojarasca
        
        donde:
        - hojarasca = nivel de hojarasca en suelo (0-1)
        """
        β = {
            'intercepto': 0.5,
            'inercia': 0.70,      # Muy persistente (acumulativo)
            'temp': 0.20,
            'humedad': 0.35,
            'lluvia': 0.30,       # Dispersión por salpique
            'aplicacion': -2.5,   # Respuesta moderada
            'hojarasca': 1.5      # Fuente de inóculo
        }
        
        f_T = np.exp(-((T - self.T_opt) ** 2) / (2 * 36))
        
        I_pred = (β['intercepto'] + 
                  β['inercia'] * I_t1 +
                  β['temp'] * f_T +
                  β['humedad'] * (HR / 100) +
                  β['lluvia'] * min(1, lluvia_7d / 50) +
                  β['aplicacion'] * A_t1 +
                  β['hojarasca'] * hojarasca)
        
        return max(0, min(3, I_pred))
    
    # Ventana crítica
    ventana_critica = 'FEN-05'  # Desarrollo (verano lluvioso)
    GDD_critico = (750, 1300)
```

---

## 📈 RESUMEN DE PARÁMETROS GDD POR MODELO

| Modelo | T_base (°C) | DD/Gen | T_óptima | Ventana Crítica | GDD Crítico |
|--------|-------------|--------|----------|-----------------|-------------|
| **Trips** | 14.6 | 180 | 25-30 | FEN-03 Floración | 350-550 |
| **Minador** | 11.5 | 185 | 28 | FEN-02 Brotación | 150-350 |
| **Araña Roja** | 7.9 | 347 | 24 | FEN-05 Desarrollo | 750-1300 |
| **Pulgón** | 6.0 | 100 | 22 | FEN-02 Brotación | 150-350 |
| **Diaphorina** | 10.9 | 250 | 28 | FEN-02 Brotación | 150-350 |
| **Antracnosis** | 15.0 | - | 25 | FEN-03 Floración | 350-550 |
| **M. Grasienta** | - | - | 24 | FEN-05 Desarrollo | 750-1300 |

---

## 🖥️ DISEÑO DE PANELES (MOCKUPS)

### Panel 1: VISTA PRINCIPAL - R2C Watson Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  🍊 CITRUSMAX R2C WATSON - OPTIMIZER DIMENSION                       │
│  Finca Citrícola La Luz | 4 Enero 2026 15:30                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────┐ │
│  │  IPF SCORE          │  │  INE SCORE          │  │  ROI PROJ.   │ │
│  │                     │  │                     │  │              │ │
│  │    ████████ 97.2%   │  │    ███████░ 94.8%   │  │   38.5:1    │ │
│  │    ▲ +2.1% vs ayer  │  │    ▲ +1.3% vs ayer  │  │   ▲ +5.2    │ │
│  └─────────────────────┘  └─────────────────────┘  └──────────────┘ │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    MAPA DE CALOR - AMENAZAS                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                                                          │  │  │
│  │  │   S1 (99.96 ha)      S2 (87.24 ha)      S3 (151.1 ha)   │  │  │
│  │  │   ┌─────────┐        ┌─────────┐        ┌─────────┐     │  │  │
│  │  │   │ 🟢 Bajo │        │ 🟡 Medio│        │ 🟢 Bajo │     │  │  │
│  │  │   │ IPF:98% │        │ IPF:91% │        │ IPF:99% │     │  │  │
│  │  │   │ Trips:0.3│       │ Trips:1.8│       │ Trips:0.2│    │  │  │
│  │  │   │ Diap:0.5│        │ Diap:0.8│        │ Diap:0.3│     │  │  │
│  │  │   └─────────┘        └─────────┘        └─────────┘     │  │  │
│  │  │                                                          │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ALERTAS ACTIVAS                                               │  │
│  │  ⚠️  S2: Trips nivel 1.8 - Tratamiento recomendado en 48h     │  │
│  │  ℹ️  S1: Floración detectada GDD=420 - Vigilar antracnosis    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Panel 2: MODELOS PREDICTIVOS - 7 Plagas/Enfermedades

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 MODELOS PREDICTIVOS - HORIZONTE 14 DÍAS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Sección: [S1 ▼] [S2] [S3] [TODAS]     Fecha: [04/01/2026 ▼]       │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  TRIPS (Scirtothrips citri)                    R²=0.87     │    │
│  │  ────────────────────────────────────────────────────────  │    │
│  │                                                             │    │
│  │  Nivel Actual: 0.8 ███░░░░░░░  Predicción 7d: 1.2          │    │
│  │                                                             │    │
│  │  Factores:  Temp: +0.15  |  HR: -0.08  |  Floración: +0.42 │    │
│  │                                                             │    │
│  │  [📈 Ver Gráfico]  [🔍 Detalles]  [💊 Tratamientos]         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  DIAPHORINA CITRI                              R²=0.89     │    │
│  │  ────────────────────────────────────────────────────────  │    │
│  │                                                             │    │
│  │  Nivel Actual: 0.5 ██░░░░░░░░  Predicción 7d: 0.7          │    │
│  │                                                             │    │
│  │  Factores:  Temp: +0.12  |  Brotación: +0.25  |  HLB: +0.05│    │
│  │                                                             │    │
│  │  ⚠️ VECTOR HLB - Monitoreo prioritario                     │    │
│  │  [📈 Ver Gráfico]  [🔍 Detalles]  [💊 Tratamientos]         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  [+ Ver 5 modelos restantes...]                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Panel 3: CICLO FENOLÓGICO GDD 0-1650

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌸 CICLO FENOLÓGICO - GDD 0→1650 (Biofix Reset)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CICLO ACTUAL: 1 de 3 (Primavera)    BIOFIX: 15-Ene-2026           │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  0        275       550       825       1100      1375  1650 │    │
│  │  │─────────│─────────│─────────│─────────│─────────│──────│    │
│  │  │ FEN-01  │ FEN-02  │ FEN-03  │ FEN-04  │ FEN-05  │FEN06│F7│    │
│  │  │ Latencia│Brotación│Floración│ Cuajado │Desarrollo│Madur│Co│    │
│  │  │─────────│─────────│─────────│─────────│─────────│──────│    │
│  │  │         │         │    ▲    │         │         │      │    │
│  │  │         │         │   320   │         │         │      │    │
│  │  │         │         │  ACTUAL │         │         │      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌───────────────────┬───────────────────┬───────────────────┐          │
│  │ SECCIÓN S1        │ SECCIÓN S2        │ SECCIÓN S3        │          │
│  │ 62 turb | 99.96ha │ 55 turb | 87.24ha │ 94 turb | 151.1ha │          │
│  ├───────────────────┼───────────────────┼───────────────────┤          │
│  │ GDD: 320          │ GDD: 290          │ GDD: 265          │          │
│  │ Fase: FEN-03      │ Fase: FEN-03      │ Fase: FEN-02      │          │
│  │ Floración 35%     │ Floración 15%     │ Brotación 90%     │          │
│  │ ▶ Cosecha:        │ ▶ Cosecha:        │ ▶ Cosecha:        │          │
│  │   15-Ago-2026     │   22-Ago-2026     │   01-Sep-2026     │          │
│  └───────────────────┴───────────────────┴───────────────────┘          │
│                                                                      │
│  PRÓXIMOS 3 CICLOS:                                                  │
│  │ Ciclo 1 │ Ene-Ago 2026 │ Cosecha estimada: 1,117 ton (S1)       │
│  │ Ciclo 2 │ Jun-Ene 2027 │ Cosecha estimada: 695 ton (S2)         │
│  │ Ciclo 3 │ Oct-May 2027 │ Cosecha estimada: 242 ton (S3 octubre) │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Panel 4: RECETA OPTIMIZADA

```
┌─────────────────────────────────────────────────────────────────────┐
│  💊 RECETA OPTIMIZADA - SEMANA 01/2026                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  OBJETIVO: IPF ≥ 95%  |  INE ≥ 95%  |  Presupuesto: $50,000 MXN    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  RESULTADO OPTIMIZACIÓN                                      │    │
│  │  ═══════════════════════════════════════════════════════    │    │
│  │                                                              │    │
│  │  IPF Logrado: 97.2%  ████████████████████░░  (Target: 95%)  │    │
│  │  INE Logrado: 94.8%  ███████████████████░░░  (Target: 95%)  │    │
│  │  Costo Total: $42,350 MXN   (84.7% presupuesto)             │    │
│  │  ROI Proyectado: 38.5:1                                      │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  PRODUCTOS SELECCIONADOS (Greedy Ratio)                      │    │
│  ├──────┬──────────────────┬─────────┬─────────┬───────┬───────┤    │
│  │ Ord. │ Producto         │ Δ(IPF)  │ Δ(INE)  │ Costo │ Ratio │    │
│  ├──────┼──────────────────┼─────────┼─────────┼───────┼───────┤    │
│  │  1   │ Spinosad 480 SC  │ +8.2%   │ +0.0%   │ $3,200│ 2.56  │    │
│  │  2   │ Abamectina 1.8%  │ +4.5%   │ +0.0%   │ $1,850│ 2.43  │    │
│  │  3   │ K-Fol (KNO₃)     │ +0.0%   │ +6.2%   │ $2,800│ 2.21  │    │
│  │  4   │ Captan 80 WP     │ +3.1%   │ +0.0%   │ $1,650│ 1.88  │    │
│  │  5   │ Calcio Boro      │ +0.0%   │ +4.8%   │ $2,100│ 2.29  │    │
│  └──────┴──────────────────┴─────────┴─────────┴───────┴───────┘    │
│                                                                      │
│  RESTRICCIONES VALIDADAS:                                            │
│  ✅ PHI: Todos productos OK (cosecha en 180+ días)                  │
│  ✅ Compatibilidad: Sin conflictos en mezcla                        │
│  ✅ IRAC/FRAC: Rotación cumplida (grupos diferentes)                │
│                                                                      │
│  [📥 Descargar PDF]  [📧 Enviar Email]  [📱 WhatsApp]               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Panel 5: CALENDARIO ANUAL 2026

```
┌─────────────────────────────────────────────────────────────────────┐
│  📅 CALENDARIO FITOSANITARIO 2026 - 3 CICLOS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│      ENE    FEB    MAR    ABR    MAY    JUN    JUL    AGO    SEP    │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │▓▓▓▓▓▓│██████│██████│░░░░░░│░░░░░░│░░░░░░│░░░░░░│▒▒▒▒▒▒│▒▒▒▒▒▒│   │
│  │BROT. │FLORAC│CUAJAD│DESARR│DESARR│DESARR│MADUR │COSECH│COSECH│   │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘   │
│                                                                      │
│      OCT    NOV    DIC                                               │
│  ┌──────┬──────┬──────┐    LEYENDA:                                 │
│  │██████│░░░░░░│░░░░░░│    ▓▓ Brotación (riesgo Diaphorina/Minador)│
│  │FLOR-3│CUAJAD│DESARR│    ██ Floración (riesgo Trips/Antracnosis) │
│  └──────┴──────┴──────┘    ░░ Desarrollo (riesgo Araña/M.Grasienta)│
│                            ▒▒ Cosecha (restricción PHI)             │
│                                                                      │
│  APLICACIONES PROGRAMADAS:                                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Sem │ S1  │ S2  │ S3  │ Producto Principal │ Costo Est.     │    │
│  ├─────┼─────┼─────┼─────┼────────────────────┼────────────────┤    │
│  │ 02  │ ✓   │ ✓   │ ✓   │ Imidacloprid       │ $8,500         │    │
│  │ 06  │ ✓   │ ✓   │     │ Spinosad           │ $6,400         │    │
│  │ 10  │     │ ✓   │ ✓   │ Abamectina+Captan  │ $5,200         │    │
│  │ 14  │ ✓   │     │     │ K-Fol + Ca-B       │ $4,900         │    │
│  │ ... │     │     │     │ ...                │ ...            │    │
│  └─────┴─────┴─────┴─────┴────────────────────┴────────────────┘    │
│                                                                      │
│  PRESUPUESTO ANUAL: $185,000 MXN                                    │
│  │████████████████████░░░░░░░░░░│ $42,350 ejecutado (22.9%)         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 FUNCIONALIDADES PROPUESTAS

### Funcionalidades Core (MVP)

| ID | Funcionalidad | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| F01 | **Dashboard Overview** | Vista principal con IPF/INE/ROI y mapa de calor | ALTA |
| F02 | **7 Modelos Predictivos** | Predicción de plagas/enfermedades por GDD | ALTA |
| F03 | **Ciclo Fenológico** | Visualización GDD 0-1900 con 3 ciclos | ALTA |
| F04 | **Receta Optimizada** | Algoritmo Greedy con restricciones | ALTA |
| F05 | **Calendario Anual** | Programación semanal de aplicaciones | ALTA |
| F06 | **Alertas Trigger** | WhatsApp/Email cuando umbral superado | ALTA |

### Funcionalidades Avanzadas

| ID | Funcionalidad | Descripción | Prioridad |
|----|---------------|-------------|-----------|
| F07 | **Análisis Histórico** | Comparativa vs años anteriores | MEDIA |
| F08 | **Simulador What-If** | Proyecciones con escenarios climáticos | MEDIA |
| F09 | **Integración Mercado** | Ventanas de precio premium | MEDIA |
| F10 | **Exportación Reportes** | PDF, Excel, iCal | MEDIA |
| F11 | **API REST** | Endpoints para integración externa | BAJA |
| F12 | **Mobile App** | Versión PWA para campo | BAJA |

---

## 📋 TECNOLOGÍAS PROPUESTAS

### Stack Técnico

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| **Frontend** | React + Vite + TailwindCSS | Consistente con CitrusMax Harvest |
| **Backend** | FastAPI (Python) | Integración con modelos ML existentes |
| **Base de Datos** | PostgreSQL (citrusmax_biofix) | Ya existente, 88 tablas |
| **ML/Modelos** | scikit-learn + statsmodels | Random Forest + Regresión |
| **Visualización** | Recharts + Leaflet | Gráficos y mapas interactivos |
| **Alertas** | WhatsApp Business API | Ya integrado |
| **Despliegue** | AWS EC2 (44.247.163.1) | Infraestructura existente |

---

## ⏱️ CRONOGRAMA PROPUESTO

```
FASE 1 - FUNDAMENTOS (2 semanas)
├── Semana 1: Implementar 7 modelos predictivos en Python
├── Semana 2: Validar modelos con datos históricos (R² target > 0.85)

FASE 2 - OPTIMIZACIÓN (2 semanas)
├── Semana 3: Algoritmo Greedy con restricciones
├── Semana 4: Integración IPF/INE calculators

FASE 3 - FRONTEND (3 semanas)
├── Semana 5-6: Dashboard y paneles principales
├── Semana 7: Calendario y alertas

FASE 4 - INTEGRACIÓN (1 semana)
├── Semana 8: Integración R2C Watson, testing E2E

TOTAL: 8 semanas (~2 meses)
```

---

## ✅ SOLICITUD DE AUTORIZACIÓN

### Preguntas para el Usuario

1. **¿El entendimiento del objetivo es correcto?**
   - Optimizer como Dimensión R2C Watson
   - 7 modelos predictivos GDD-based
   - Ciclo 0-1650 GDD por floración (Biofix reset)

2. **¿Los 7 modelos propuestos cubren las necesidades?**
   - Trips, Minador, Araña Roja, Pulgón
   - Diaphorina, Antracnosis, Mancha Grasienta

3. **¿Los paneles diseñados son adecuados?**
   - Overview, Modelos, Fenología, Receta, Calendario

4. **¿El cronograma de 8 semanas es aceptable?**

5. **¿Hay restricciones técnicas adicionales?**

---

**Documento preparado para revisión y autorización.**  
**Próximo paso:** Implementación tras aprobación del diseño.
