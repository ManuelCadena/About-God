# LOGOS v5.2 + KAIRA v3.1 - Índice de Documentación Técnica

**Última actualización:** 13 de Abril, 2026  
**Versión LOGOS:** v5.2 (Hierarchical Lambda + KAIRA Integration)  
**Versión KAIRA:** v3.1 AIFET

> **Versión:** 3.3.0  
> **Fecha:** 2026-02-09  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems

---

## Documentación Core del Sistema

| # | Documento | Descripción | Versión |
|---|----------|-------------|---------|
| 1 | [DOCUMENTO_MAESTRO_LOGOS.md](./DOCUMENTO_MAESTRO_LOGOS.md) | Documento maestro comprensivo — IEEE 830 completo | 3.3.0 |
| 2 | [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura del sistema, stack, patrones, infraestructura | 3.3.0 |
| 3 | [MATHEMATICAL_SPEC.md](./MATHEMATICAL_SPEC.md) | Especificación matemática: Λ, V, S, C, F, Ω, Q, π, IFC bridge | 3.3.0 |
| 4 | [API_REFERENCE.md](./API_REFERENCE.md) | Referencia de funciones del core engine, servicios, interpret-panel | 3.3.0 |
| 5 | [DATA_MODEL.md](./DATA_MODEL.md) | Modelo de datos: 28 dims × 7 dominios, sessionStorage bridge | 3.3.0 |
| 6 | [COMPONENTS.md](./COMPONENTS.md) | Catálogo de componentes React: TabAIGuide, IFCModel, etc. | 3.3.0 |
| 7 | [DIAGRAMS.md](./DIAGRAMS.md) | Diagramas de flujo, secuencia, estados, dependencias | 3.3.0 |
| 8 | [CHANGELOG.md](./CHANGELOG.md) | Historial de cambios por versión (SemVer) | 3.3.0 |

## Guías de Usuario y Deployment

| # | Documento | Descripción | Versión |
|---|----------|-------------|---------|
| 9 | [USER_MANUAL.md](./USER_MANUAL.md) | Manual de usuario técnico (IEEE 26512) | 3.3.0 |
| 10 | [MANUAL_USUARIO.md](./MANUAL_USUARIO.md) | Manual de usuario narrativo (español) | 3.3.0 |
| 11 | [DEPLOYMENT.md](./DEPLOYMENT.md) | Guía de instalación, build y deployment (web + iOS) + PM2 | 3.3.0 |
| 12 | [TESTING.md](./TESTING.md) | Especificación de testing: 707 tests, 17 archivos | 3.3.0 |

## Módulos Especializados (NUEVOS)

| # | Documento | Descripción | Versión |
|---|----------|-------------|---------|
| 13 | [BIOMETRIC_FEEDBACK_LOOP.md](./BIOMETRIC_FEEDBACK_LOOP.md) | Loop biométrico cerrado: HealthKit → watchEngine → F/C/π | 3.2.0 |
| 14 | [VOICE_AGENT.md](./VOICE_AGENT.md) | Agente de voz ElevenLabs: client tools, config, mapeos | 3.2.0 |
| 15 | [HEALTHKIT_BRIDGE.md](./HEALTHKIT_BRIDGE.md) | Bridge HealthKit: procesamiento biométrico → LOGOS metrics | 3.2.0 |
| 16 | [APPLE_WATCH_ARCHITECTURE.md](./APPLE_WATCH_ARCHITECTURE.md) | Arquitectura Apple Watch: LOGOSCore, WatchConnectivity | 3.2.0 |
| 17 | [LOGOS_V5_AUDIT_REPORT.md](./LOGOS_V5_AUDIT_REPORT.md) | Auditoría de calidad LOGOS v5 | 3.3.0 |
| 18 | [LOGOS_V5_TEST_PROTOCOL.md](./LOGOS_V5_TEST_PROTOCOL.md) | Protocolo de testing LOGOS v5 | 3.3.0 |

## iOS y App Store

| # | Documento | Descripción | Versión |
|---|----------|-------------|---------|
| 17 | [APP_STORE_ASSETS.md](./APP_STORE_ASSETS.md) | Metadata y assets para App Store Connect | 3.0.0 |
| 18 | [INSTRUCTIVO_XCODE_iOS_WATCH.md](./INSTRUCTIVO_XCODE_iOS_WATCH.md) | Instructivo paso a paso: Xcode, signing, archive | 1.0 |
| 19 | [PLAN_LOGOS_iOS_APPLE_WATCH.md](./PLAN_LOGOS_iOS_APPLE_WATCH.md) | Plan de implementación iOS + Apple Watch (completado) | 3.0 |

## Marco Teórico y Fundamentos

| # | Documento | Descripción | Versión |
|---|----------|-------------|---------|
| 20 | [TEORIA_TECNICA.md](./TEORIA_TECNICA.md) | Marco teórico técnico: ecuaciones, atractores, capas, IFC bridge | 3.3.0 |
| 21 | [PAPER_LOGOS_SINTONIA_UNIFIED_FRAMEWORK.md](./PAPER_LOGOS_SINTONIA_UNIFIED_FRAMEWORK.md) | Paper PhD: Unified Framework LOGOS × SINTONÍA | — |

## Integración KAIRA (NUEVO - Abril 2026)

| # | Documento | Descripción | Estado |
|---|----------|-------------|--------|
| 22 | [KAIRA_INTEGRATION_COMPLETE.md](./KAIRA_INTEGRATION_COMPLETE.md) | Resumen ejecutivo integración KAIRA → LOGOS | ✅ Completada |
| 23 | [KAIRA_INTEGRATION_MANUAL_STEPS.md](./KAIRA_INTEGRATION_MANUAL_STEPS.md) | Guía paso a paso integración manual | ✅ Completada |
| 24 | [KAIRA_LOGOSHUMANO_INTEGRATION_CODE.md](./KAIRA_LOGOSHUMANO_INTEGRATION_CODE.md) | Código exacto para integración en LogosHumano.jsx | ✅ Completada |
| 25 | [DEPLOY_KAIRA_M5_COMPLETE.md](./DEPLOY_KAIRA_M5_COMPLETE.md) | Deploy completo a producción M5 | ✅ LIVE |

**Características KAIRA:**
- ✅ Check-in conversacional (28 dimensiones)
- ✅ Terapia contextual con métricas LOGOS (Λ, V, S, C, F, Ω, LERS)
- ✅ Positive Geometry Protocol (Layer 10)
- ✅ Crisis detection automática
- ✅ API Routes: `/api/kaira/chat`, `/api/kaira/logos-checkin`
- ✅ Supabase: 7 tablas nuevas + extensiones a `sessions`
- ✅ UI: Botón flotante + Panel sidebar con animaciones

## Propuestas e Investigación

| # | Documento | Descripción | Estado |
|---|----------|-------------|--------|
| 26 | [PROPUESTA_ALIMENTO_SAGRADO_v3.md](./PROPUESTA_ALIMENTO_SAGRADO_v3.md) | RFC-003: Propuesta 7° dominio Alimento Sagrado | ✅ Aprobada |
| 27 | [IMPLEMENTACION_LOGOS_v3.md](./IMPLEMENTACION_LOGOS_v3.md) | RFC-005: Blueprint de implementación v3.0 | ✅ Completada |
| 28 | [CONVERGENCIA_SINTONIA_LOGOS.md](./CONVERGENCIA_SINTONIA_LOGOS.md) | RFC-004: Análisis de convergencia SINTONÍA × LOGOS | ✅ Completada |
| 29 | [MODELO_MATEMATICO_LOGOS_v2_vs_v3.md](./MODELO_MATEMATICO_LOGOS_v2_vs_v3.md) | RFC-006: Especificación matemática v2 vs v3 | ✅ Completada |
| 30 | [VALIDACION_MATEMATICA_PEER_REVIEW.md](./VALIDACION_MATEMATICA_PEER_REVIEW.md) | RFC-007: Validación matemática peer review | ✅ Completada |
| 31 | [INVESTIGACION_PESOS_ADAPTATIVOS_LOGOS.md](./INVESTIGACION_PESOS_ADAPTATIVOS_LOGOS.md) | Investigación: pesos adaptativos Bayesianos | 📘 Completa |

---

## Mapa de Arquitectura Rápida

```
LOGOS v5.2 + KAIRA v3.1 — Sistema Operativo de Consciencia + Terapia AIFET
│
├── 28 dimensiones × 7 dominios (Physical, Emotional, Mental, Spiritual, Relational, Purpose, Alimento)
├── 7 capas de cómputo (Friston → Levin → Watson → Hoffman → Penrose → Policy → Logos)
├── Hierarchical Lambda (Λ_signal × Φ_channel) — Feb 2026
├── 20 paneles de Interpretación AI (TabAIGuide) — GPT-4o contextual en cada pestaña
├── IFC ↔ LOGOS Bridge (herencia de estado 28-dim → 12 variables IFC)
├── Motor biométrico cerrado (HealthKit → watchEngine → F/C/domains/π)
├── Agente de voz AI (ElevenLabs, 15 client tools)
├── Multi-canal (Web + WhatsApp + Voice + SMS + Apple Watch)
├── iOS App + Apple Watch companion (HealthKit, WatchConnectivity, Complications)
├── Backend gestionado por PM2 (logos-backend :3100, logos-api :3200)
├── 707 tests automatizados (17 archivos, 100% cobertura core)
│
└── ✨ KAIRA Integration (Abril 2026) — LIVE en https://logoilab.com
    ├── Check-in conversacional (28 dimensiones)
    ├── Terapia contextual con LOGOS (Λ, V, S, C, F, Ω, LERS)
    ├── Positive Geometry Protocol (Layer 10)
    ├── Crisis detection automática
    ├── API Routes: /api/kaira/chat, /api/kaira/logos-checkin
    ├── Supabase: 7 tablas nuevas (messages, formulations, safety_events, etc.)
    ├── UI: Botón flotante + Panel sidebar (480px, slideInRight)
    └── Anthropic Claude 3.5 Sonnet (AIFET prompts)
```
