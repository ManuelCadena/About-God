# CHEFMANNY ENGINE — Technical Architecture & System Map
## Complete Structural and Functional Analysis for Backend/API Unification

**Author:** José Manuel "Manny" Cadena Ortiz de Montellano
**Date:** February 7, 2026 | **Version:** 1.0
**Purpose:** Exploratory — Full system mapping for potential unified engine extraction

---

## TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [Current Architecture Diagram](#2-current-architecture-diagram)
3. [File Inventory by Layer](#3-file-inventory-by-layer)
4. [External Services & Endpoints](#4-external-services--endpoints)
5. [Data Flow: Menu Generation Pipeline](#5-data-flow-menu-generation-pipeline)
6. [Data Flow: Voice Agent Pipeline](#6-data-flow-voice-agent-pipeline)
7. [Data Flow: Music API Pipeline](#7-data-flow-music-api-pipeline)
8. [Database Schema (Supabase)](#8-database-schema-supabase)
9. [Unified Backend API Design](#9-unified-backend-api-design)
10. [File Independence Analysis](#10-file-independence-analysis)
11. [Minimum Viable Engine (MVE)](#11-minimum-viable-engine-mve)

---

## 1. SYSTEM OVERVIEW

### 1.1 Current State

ChefManny is a **React SPA (Vite + TypeScript)** deployed as static files on M5 server (Nginx), with:
- **No dedicated backend** — LLM calls go through a lightweight Node.js proxy (`server-secure.js`)
- **Supabase** as BaaS (auth, profiles, subscriptions, saved recipes)
- **ElevenLabs** as independent voice agent with 39 client-side tools
- **Music API** as a separate Flask microservice on M5 (port 3002)
- **Stripe Payment Links** for subscriptions (no backend checkout)

### 1.2 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.2 + 5.3 |
| Build | Vite | 5.0 |
| Styling | TailwindCSS | 3.4 |
| Auth | Supabase Auth (Google OAuth, Apple) | 2.90 |
| Database | Supabase PostgreSQL | — |
| Payments | Stripe Payment Links + RevenueCat | — |
| LLM Primary | OpenAI GPT-4o | via proxy |
| LLM Fallback 1 | Google Gemini 3 Pro | via proxy |
| LLM Fallback 2 | Perplexity Sonar Pro | via proxy |
| Voice | ElevenLabs Conversational AI | 0.2 SDK |
| Music DB | PostgreSQL on M5 | port 3002 |
| Currency | Frankfurter API (free) | — |
| PDF | jsPDF | 4.0 |
| Deploy | M5 EC2 (Nginx + Node proxy) | — |

### 1.3 API Keys Required

| Service | Env Variable | Purpose |
|---------|-------------|---------|
| OpenAI | `VITE_OPENAI_API_KEY` | Primary LLM for recipe generation |
| Gemini | `VITE_GEMINI_API_KEY` | Fallback LLM |
| Perplexity | `VITE_PERPLEXITY_API_KEY` | Fallback LLM + data queries |
| Anthropic | `VITE_ANTHROPIC_API_KEY` | Claude (future M5 API) |
| DeepSeek | `VITE_DEEPSEEK_API_KEY` | Alternative LLM |
| Google OAuth | `VITE_GOOGLE_CLIENT_ID` | User authentication |
| Spoonacular | `VITE_SPOONACULAR_API_KEY` | Nutrition + ingredient pricing |
| Supabase | `VITE_SUPABASE_URL` + `ANON_KEY` | Auth + database |
| RevenueCat | `VITE_REVENUECAT_API_KEY` | Mobile subscriptions |
| Stripe | `VITE_STRIPE_PUBLISHABLE_KEY` | Web payments |
| ElevenLabs | Agent ID + API Key | Voice agent |

---

## 2. CURRENT ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser/PWA)                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
          ┌───────────▼───────────┐
          │   React SPA (Vite)    │
          │   ChefManny.tsx       │ ← 301KB monolith component
          │   (UI + State + Logic)│
          └──┬────┬────┬────┬─────┘
             │    │    │    │
    ┌────────▼┐ ┌─▼──┐ │  ┌▼──────────────┐
    │Supabase │ │Str-│ │  │ ElevenLabs    │
    │Auth+DB  │ │ipe │ │  │ Voice Agent   │
    │(BaaS)   │ │Pay │ │  │ (39 tools)    │
    └─────────┘ └────┘ │  └───────────────┘
                       │
          ┌────────────▼────────────┐
          │  server-secure.js       │ ← Node.js proxy (port 3001)
          │  (API Key Protection)   │
          └──┬────┬────┬────────────┘
             │    │    │
    ┌────────▼┐ ┌─▼──┐ ┌▼──────────┐
    │ OpenAI  │ │Gem-│ │Perplexity │
    │ GPT-4o  │ │ini │ │Sonar Pro  │
    └─────────┘ └────┘ └───────────┘

          ┌─────────────────────────┐
          │  music_api.py (Flask)   │ ← Python microservice (port 3002)
          │  PostgreSQL songs DB    │
          └─────────────────────────┘
```

---

## 3. FILE INVENTORY BY LAYER

### 3.1 LAYER 0: Entry Point & Configuration

| File | Size | Function |
|------|------|----------|
| `index.html` | 2.7KB | HTML shell, meta tags, PWA manifest link |
| `main.tsx` | 714B | React root mount + Service Worker registration |
| `App.tsx` | 335B | Provider wrapper: AuthProvider → SubscriptionProvider → ChefManny |
| `vite.config.ts` | 1.6KB | Build config: code splitting (v6/v7 chunks), Gzip+Brotli compression |
| `package.json` | 1.2KB | Dependencies: React 18, Supabase, ElevenLabs, jsPDF, RevenueCat |
| `.env` | 1.7KB | All API keys (11 services) |
| `tailwind.config.js` | 1.3KB | Theme customization |
| `tsconfig.json` | 565B | TypeScript strict config |

### 3.2 LAYER 1: Core Application (The Monolith)

| File | Size | Function |
|------|------|----------|
| **`ChefManny.tsx`** | **301KB** | **THE MONOLITH** — Contains ALL UI, state management, filter logic, recipe display, PDF export, sharing, gamification, budget display, emotion selection, tradition/chef selection, ingredient input, course selection, recipe level, cooking time, nutrition presets, custom macros, language toggle, and 2000+ lines of inline styles. This is the file that would need decomposition. |

**What ChefManny.tsx manages internally:**
- 25 filter categories (state variables)
- Menu generation orchestration
- Recipe carousel navigation
- PDF export (jsPDF)
- WhatsApp sharing
- Gamification (XP, streaks, achievements)
- Responsive layout (mobile/desktop)
- Animation states
- Error handling + retry logic
- Debug panel

### 3.3 LAYER 2: Services (Business Logic)

| File | Path | Size | Function | Backend-Ready? |
|------|------|------|----------|---------------|
| `MenuGenerator.ts` | `services/` | 27KB | Multi-phase menu generation with LLM fallback chain. Calls `/api/recipe/generate` and `/api/recipe/generate-stream` (SSE). Contains `callLLM()`, `callLLMWithFallback()`, `generateFullMenu()`. | ✅ YES — core engine |
| `supabase.ts` | `services/` | 4.5KB | Supabase client init, type definitions (UserProfile, Subscription, SavedRecipe, Achievement), tier limits (free/premium/pro), free chef list. | ✅ YES |
| `stripe.ts` | `services/` | 4.3KB | Stripe Payment Links config (4 price options), `redirectToCheckout()`. No backend needed. | ⚠️ Partial |
| `CurrencyService.ts` | `services/` | 8.2KB | Frankfurter API for exchange rates, 12 currencies, caching, fallback rates. | ✅ YES |

### 3.4 LAYER 3: Constants & Data (The Knowledge Base)

| File | Path | Size | Function |
|------|------|------|----------|
| `BrigadeSymphony.ts` | `constants/` | **128KB** | **CRITICAL** — LLM provider configs (OpenAI/Gemini/Perplexity), culinary ranks (commis/chefDePartie/sousChef), menu course definitions (9 movements), symphony analysis, system/user prompt generators. The "brain" of prompt engineering. |
| `ChefPersonalities.ts` | `constants/` | 39KB | 36 chef personality profiles with traits, techniques, ingredients, flavor profiles |
| `ChefInfluenceSystemConsolidated.ts` | `constants/` | 21KB | Consolidated chef influence: `generateChefInfluenceInstructions()` |
| `ChefInfluenceSystem_PART1-8.ts` | `constants/` | ~370KB total | 8 files with detailed chef profiles by tradition (French, Italian, Japanese, Spanish, British/American/Nordic, Mexican/Peruvian, China/Korea/Thai/India/German, Final) |
| `RecipeLevels.ts` | `constants/` | 3.8KB | 3 recipe detail levels (básico/intermedio/avanzado) with token limits |

### 3.5 LAYER 4: V7 Orchestrator Engine

| File | Path | Size | Function |
|------|------|------|----------|
| `BidirectionalModel.ts` | `v7/systems/` | 29KB | **5 core equations**: `musicToEmotion()`, `emotionToTaste()`, `calculateHappinessIndex()`, `calculateHIIntegral()`, `analyzeChord()`. Plus inverse functions. HI weights, thresholds, occasion profiles. |
| `OrchestratorEngineCentral.ts` | `v7/systems/` | 26KB | **Heart of the system**: `orchestrateGastronomicSymphony()`. Integrates ingredients, chef style, movements, dynamics, roles. Ingredient profiles as musical notes. |
| `CompositionStyleEngine.ts` | `v7/systems/` | 17KB | 7 composition styles (Baroque→Fusion) with development techniques, surprise levels |
| `MusicalMovementSystem.ts` | `v7/systems/` | 11KB | 9 symphonic movements, climax detection (Golden Ratio), dynamic arc calculation |
| `ChefToCompositionStyleMapper.ts` | `v7/mappers/` | — | Maps 36 chefs → composition styles |
| `IngredientMusicalDatabase.ts` | `v7/data/` | 29KB | 200+ ingredients → musical notes (register, note, category) |
| `IngredientNeurochemicalMap.ts` | `v7/data/` | 17KB | Ingredients → neurochemical profiles (dopamine, serotonin, etc.) |
| `EmotionalQuadrantProfiles.ts` | `v7/data/` | 23KB | 15 genre flavor profiles, 10 master composers, 4 quadrant strategies |
| `EmotionalQuadrants.ts` | `v7/data/` | 31KB | 40+ detailed emotional states with V-A ranges, menu suggestions, playlist moods |
| `globalCompositions*.ts` | `v7/data/` | ~140KB | 5 files with 900+ song database (artist, title, genre, V, A, HI, taste%, YouTube) |
| `generateOrchestratedPrompt.ts` | `v7/utils/` | — | Generates orchestrated prompts combining chef + style + movements |
| `generateOrchestrationFromRecipes.ts` | `v7/utils/` | — | Post-generation: extracts orchestration data from recipe text |
| `RecipeJsonSchema.ts` | `v7/schemas/` | — | JSON schema for structured recipe output (V7.4) |
| `v7/index.ts` | `v7/` | 15KB | Barrel export: 100+ exports from all V7 modules |

### 3.6 LAYER 5: V8 Nutrition Control Center

| File | Path | Size | Function |
|------|------|------|----------|
| `UserProfile.types.ts` | `v8/types/` | 4KB | `UserNutritionProfile` interface: demographics, goals, restrictions, advanced macros. All type unions (27 HealthGoalId, 10 DietTypeId, 12 AllergenId, 12 MedicalConditionId, 10 MicronutrientId, 4 MealTimingPreset, 7 CookingTechnique) |
| `Perplexity.types.ts` | `v8/types/` | 3.6KB | Types for Perplexity API integration (localized pricing) |
| `HealthGoals.constants.ts` | `v8/constants/` | 17KB | 27 health goals with calorie adjustments, macro ratios, key nutrients, evidence |
| `NutritionCalculator.ts` | `v8/utils/` | 5.7KB | `calculateBMR()` (Harris-Benedict), `calculateTDEE()`, `calculateBMI()`, `calculateMacroTargets()`, `calculateProfileValues()` |
| `useUserProfile.ts` | `v8/hooks/` | 6KB | React hook for persistent nutrition profile (localStorage → future Supabase) |
| `v8/index.ts` | `v8/` | 3.4KB | Barrel export + feature flags + compatibility rules |

### 3.7 LAYER 6: V6 Legacy (Translation + Ingredients)

| File | Path | Size | Function |
|------|------|------|----------|
| `v6/index.ts` | `v6/` | 9.4KB | Barrel export for V6 features |
| `v6/services/TranslationService.ts` | `v6/services/` | — | Ingredient translation (EN↔ES) using 1200+ ingredient database |
| `v6/data/` | `v6/data/` | — | Ingredient database with translations |
| `v6/hooks/` | `v6/hooks/` | 4 hooks | Recipe generation, ingredient management |

### 3.8 LAYER 7: UI Components

| File | Path | Size | Function |
|------|------|------|----------|
| `ChefMannyVoiceAgent.tsx` | `components/` | **53KB** | ElevenLabs voice agent with 39 client tools (read state, write state, navigate, generate, share, export). Uses `@11labs/react` SDK. |
| `RecipeCarousel.tsx` | `components/RecipeCarousel/` | 21KB | Swipeable recipe card carousel |
| `RecipeCardCompact.tsx` | `components/RecipeCarousel/` | 22KB | Individual recipe card display |
| `RecipeCarouselOptimized.tsx` | `components/RecipeCarousel/` | 27KB | Performance-optimized carousel |
| `MultiRecipeProgress.tsx` | `components/RecipeCarousel/` | 14KB | Progress indicators during parallel generation |
| `RecipeCarousel.types.ts` | `components/RecipeCarousel/` | 5.2KB | Shared types: SymphonyRecipe, SymphonyContext, ParallelGenerationConfig |
| `PartituraGastronomicaV4.tsx` | `components/` | 77KB | Visual musical score (partitura) display |
| `LiveMusicalPartitura.tsx` | `v7/components/` | 32KB | Live animated partitura with sticky header |
| `SinfoniaMusicalMood.tsx` | `v7/components/` | 48KB | Musical mood portal with YouTube integration |
| `MusicalStaffV73Enhanced.tsx` | `v7/components/` | 27KB | Enhanced musical staff visualization |
| `BudgetDisplay.tsx` | `components/` | 6.5KB | Budget per-person display with currency conversion |
| `RecipeLevelSelector.tsx` | `components/` | 5.4KB | Recipe detail level selector UI |
| `TaglineRotator.tsx` | `components/` | 3.5KB | Rotating tagline display |
| `PaywallScreen.tsx` | `components/` | 13KB | Subscription paywall UI |
| `UpgradeTeasers.tsx` | `components/` | 18KB | Premium feature teasers |

### 3.9 LAYER 8: Utilities

| File | Path | Size | Function |
|------|------|------|----------|
| `recipeParser.ts` | `utils/` | 53KB | Parses LLM text/JSON responses into structured SymphonyRecipe objects |
| `recipeTextParser.ts` | `utils/` | 22KB | Fallback text parser for non-JSON responses |
| `symphonyAnalyzer.ts` | `utils/` | 19KB | Analyzes symphony structure from recipe data |
| `debugLogger.ts` | `utils/` | 18KB | Comprehensive debug logging system |
| `chefDisplayMapper.ts` | `utils/` | 10KB | Maps chef IDs to display names/avatars |
| `currencyDetector.ts` | `utils/` | 9KB | Auto-detects user currency from locale/timezone |

### 3.10 LAYER 9: Hooks

| File | Path | Size | Function |
|------|------|------|----------|
| `useParallelRecipeGeneration.ts` | `hooks/` | **45KB** | **CRITICAL** — Orchestrates parallel recipe generation across multiple courses. Manages LLM calls, retries, progress tracking, chef enrichment, ingredient translation. |
| `useLegalAcceptance.ts` | `hooks/` | 2.6KB | EULA/Privacy acceptance tracking |

### 3.11 LAYER 10: Contexts (Global State)

| File | Path | Size | Function |
|------|------|------|----------|
| `AuthContext.tsx` | `contexts/` | 8.7KB | Google/Apple auth, profile fetch, subscription fetch, tier management, feature gating |
| `SubscriptionContext.tsx` | `contexts/` | 6.3KB | Usage limits, trial period (7 days), paywall triggers, recipe counting |

### 3.12 LAYER 11: Server-Side

| File | Path | Size | Function |
|------|------|------|----------|
| `server-secure.js` | root | 5.4KB | Node.js HTTP proxy (port 3001). Routes: `/openai/*`, `/gemini/*`, `/perplexity/*`, `/anthropic/*`. Injects API keys server-side. |
| `music_api.py` | `v7/api/` | 18KB | Flask API (port 3002). 8 endpoints for song queries, bidirectional model, EMU calculator. Connects to PostgreSQL `chefmanny.songs` table. |
| `sse_function.js` | root | 2.7KB | SSE streaming function for real-time recipe generation feedback |

### 3.13 LAYER 12: Internationalization

| File | Path | Size | Function |
|------|------|------|----------|
| `translations.ts` | `i18n/` | 14KB | Complete ES/EN translation dictionary |
| `useTranslation.ts` | `i18n/` | 3.3KB | Translation hook with language detection |

### 3.14 LAYER 13: Knowledge Base (Static)

| File | Path | Size | Function |
|------|------|------|----------|
| `KB_01_Core_Equations.md` | `knowledge-base/` | 2.2KB | HI equation, V-A mapping, taste equations |
| `KB_02_Genre_Flavor_Profiles.md` | `knowledge-base/` | 4.7KB | 15 genre → flavor mappings |
| `KB_03_Master_Composers.md` | `knowledge-base/` | 4.1KB | 10 master composers with optimal dishes |
| `KB_04_Emotional_Quadrants.md` | `knowledge-base/` | 3.6KB | 4 quadrant strategies |
| `KB_05_Ingredient_Pentagram.md` | `knowledge-base/` | 5.8KB | 112 ingredients as musical notes |
| `KB_06_Top_Compositions.md` | `knowledge-base/` | 2.9KB | Top compositions by HI |

### 3.15 LAYER 14: Prompts

| File | Path | Size | Function |
|------|------|------|----------|
| `SystemPromptV4_ElevenLabs.md` | `prompts/` | 19KB | Complete system prompt for ElevenLabs voice agent: identity, 4 pillars, 39 tools, conversation flow |

---

## 4. EXTERNAL SERVICES & ENDPOINTS

### 4.1 Outbound API Calls (from frontend via proxy)

| Endpoint | Provider | Method | Purpose |
|----------|----------|--------|---------|
| `/api/openai/v1/chat/completions` | OpenAI | POST | Recipe generation (GPT-4o) |
| `/api/gemini/v1beta/models/gemini-3-pro-preview:generateContent` | Google | POST | Fallback recipe generation |
| `/api/perplexity/chat/completions` | Perplexity | POST | Fallback + data queries |
| `/api/anthropic/v1/messages` | Anthropic | POST | Claude (future) |
| `/api/recipe/generate` | M5 Server | POST | Server-side recipe generation with tier management |
| `/api/recipe/generate-stream` | M5 Server | POST→SSE | Streaming recipe generation |

### 4.2 Music API Endpoints (Flask on port 3002)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/api/music/health` | GET | — | Service status + song count |
| `/api/music/songs/by-emotion` | POST | `{valence, arousal, tolerance, quadrant, genre, limit}` | Matching songs sorted by V-A similarity |
| `/api/music/songs/quadrant/<Q>` | GET | Quadrant ID | Songs in quadrant by HI desc |
| `/api/music/songs/genre/<genre>` | GET | Genre name | Songs by genre |
| `/api/music/songs/search` | GET | `?q=query` | Search by artist/title |
| `/api/music/bidirectional` | POST | `{valence, arousal, songLimit}` | Full mapping: emotion → songs → taste → gastro suggestions |
| `/api/music/emu/calculate` | POST | `{valence, arousal}` or `{sweet, sour}` | Forward/inverse EMU calculation |
| `/api/music/genres` | GET | — | Available genres with counts |
| `/api/music/stats` | GET | — | DB statistics (total, by quadrant, YouTube coverage) |

### 4.3 Supabase (BaaS)

| Table | Operations | Purpose |
|-------|-----------|---------|
| `auth.users` | Sign in/out (Google, Apple) | Authentication |
| `user_profiles` | CRUD | XP, level, rank, preferences, streaks |
| `subscriptions` | Read/Update | Tier (free/premium/pro), Stripe/RevenueCat sync |
| `usage_tracking` | Read/Increment | Daily recipe count for free tier limits |
| `saved_recipes` | CRUD | User's saved recipes with metadata |
| `achievements` | Read/Create | Unlocked achievements |
| `achievement_definitions` | Read | Available achievements catalog |

### 4.4 Third-Party Services

| Service | Purpose | Auth |
|---------|---------|------|
| ElevenLabs | Voice agent (WebSocket) | Agent ID + API Key |
| Stripe | Payment Links (redirect) | Publishable Key |
| RevenueCat | Mobile subscriptions | API Key |
| Frankfurter | Exchange rates | None (free) |
| Spoonacular | Ingredient nutrition/pricing | API Key |

---

## 5. DATA FLOW: MENU GENERATION PIPELINE

```
USER INPUT
│
├── ingredients: string          "pollo, limón, ajo"
├── guests: number               4
├── selectedTimes: string[]      ['appetizer', 'main', 'dessert']
├── expertise: CulinaryRankId    'chefDePartie'
├── activeChef: string           'chef_escoffier'
├── lang: string                 'es'
├── hiloConductor: string        'mar'
├── inspirationMode: string      'tradition'
├── tradition: string            'francesa'
├── nutritionPreset: string      'balanced'
├── customMacros: object         {maxCalories: 600}
├── maxCookTime: number          60
├── budget: string               'moderate'
│
▼
STEP 1: SYMPHONY ANALYSIS (BrigadeSymphony.ts)
│  analyzeSymphonyStructure(selectedTimes)
│  → Determines movement count, climax position (φ=61.8%), Fibonacci proportions
│  → Returns: SymphonyAnalysis {movements, climaxIndex, dynamicArc}
│
▼
STEP 2: CHEF ENRICHMENT (ChefInfluenceSystem + V7 Orchestrator)
│  enrichChefWithOrchestration(chef)
│  → Adds composition style, development techniques, surprise level
│  → Returns: ChefPersonalityExpandedV7
│
▼
STEP 3: ORCHESTRATION (OrchestratorEngineCentral.ts)
│  orchestrateGastronomicSymphony(ingredients, chef, movements)
│  → Assigns musical roles to ingredients (leitmotif, theme, counterpoint...)
│  → Calculates dynamics per movement (pp→ff)
│  → Maps ingredients to musical notes (register, note)
│  → Returns: GastronomicOrchestration
│
▼
STEP 4: PROMPT GENERATION (BrigadeSymphony.ts)
│  generateSymphonySystemPrompt(rank, chef, orchestration, lang)
│  generateSymphonyUserPrompt(ingredients, guests, times, analysis)
│  → Injects: chef personality, composition style, nutritional constraints,
│    budget limits, cooking time, recipe level detail, narrative thread
│  → Returns: {systemPrompt, userPrompt} (combined ~4000-12000 tokens)
│
▼
STEP 5: LLM CALL (MenuGenerator.ts → server-secure.js → LLM API)
│  callLLMWithFallback(systemPrompt, userPrompt, maxTokens)
│  → Try OpenAI GPT-4o → Gemini 3 Pro → Perplexity Sonar
│  → Returns: raw text/JSON response
│
▼
STEP 6: RESPONSE PARSING (recipeParser.ts)
│  parseClaudeRecipeResponse(rawText)
│  → Extracts: dish name, ingredients (with quantities), method steps,
│    chef voice, musical notation, nutritional info, plating, pairings
│  → Returns: SymphonyRecipe[]
│
▼
STEP 7: POST-PROCESSING
│  translateIngredients(recipe.ingredients, lang)  ← TranslationService
│  generateOrchestrationFromRecipes(recipes)       ← Musical visualization
│  → Returns: Complete SymphonyRecipe[] with all metadata
│
▼
STEP 8: DISPLAY
│  RecipeCarousel → RecipeCardCompact → PartituraGastronomica
│  + LiveMusicalPartitura (animated score)
│  + BudgetDisplay (with currency conversion)
│  + PDF Export / WhatsApp Share
```

---

## 6. DATA FLOW: VOICE AGENT PIPELINE

```
USER SPEAKS (microphone)
│
▼
ElevenLabs WebSocket (cloud)
│  → Speech-to-Text
│  → LLM reasoning (with SystemPromptV4)
│  → Tool calls (39 client tools)
│  → Text-to-Speech
│
▼
ChefMannyVoiceAgent.tsx (39 CLIENT TOOLS)
│
├── READ TOOLS (1-23): Read app state without modification
│   ├── get_current_recipes → recipes[]
│   ├── get_symphony_context → symphonyContext
│   ├── get_current_chef → activeChef
│   ├── get_ingredients → ingredients string
│   ├── get_user_stats → XP, streaks, achievements
│   ├── get_recipe_details → specific recipe data
│   ├── calculate_happiness_index → HI from V-A
│   ├── get_genre_profile → genre flavor mapping
│   ├── get_composer_profile → composer data
│   ├── get_quadrant_strategy → emotional quadrant info
│   ├── categorize_ingredient → musical note mapping
│   └── get_neurochemical_profile → ingredient neurochemistry
│
├── WRITE TOOLS (24-29): Modify app state
│   ├── set_ingredients → onSetIngredients(text)
│   ├── generate_menu → onGenerateMenu()
│   ├── select_emotion → onSelectEmotion(mode)
│   ├── select_tradition → onSelectTradition(tradition)
│   ├── select_chef → onSelectChef(chefId)
│   └── set_guests → onSetGuests(n)
│
├── CONTROL TOOLS (30-36): UI actions
│   ├── toggle_partitura → show/hide musical score
│   ├── share_whatsapp → share recipe
│   ├── export_pdf → generate PDF
│   ├── save_recipe → save to Supabase
│   ├── set_language → toggle ES/EN
│   ├── navigate_recipe → carousel navigation
│   └── set_recipe_level → change detail level
│
└── ORCHESTRATOR TOOLS (37-39): Mathematical model
    ├── music_to_emotion → musicToEmotion(features)
    ├── emotion_to_taste → emotionToTaste(V, A)
    └── analyze_chord → analyzeChord(notes)
```

---

## 7. DATA FLOW: MUSIC API PIPELINE

```
EMOTION INPUT {valence: 0.85, arousal: 0.70}
│
▼
/api/music/bidirectional (POST)
│
├── 1. Query PostgreSQL: chefmanny.songs
│      WHERE ABS(valence - 0.85) <= 0.15
│      AND ABS(arousal - 0.70) <= 0.15
│      ORDER BY similarity score DESC
│      → Returns: matching songs with YouTube IDs
│
├── 2. Calculate EMU (Ecuación Maestra Unificada)
│      sweet = 13.03 + 104.45 × V = 101.81%
│      sour = 2.5 + 12.0 × A = 10.9%
│      → Returns: taste_profile {sweet, sour, salty, bitter, umami}
│
├── 3. Calculate HI
│      HI = f(V, A, taste) → 89.5
│      → Returns: happiness_index, quadrant
│
└── 4. Map to Gastronomy
       Q1_EUPHORIC → celebratory ingredients, techniques, wine pairing
       → Returns: gastronomic recommendations

OUTPUT:
{
  emotion: {valence, arousal, quadrant, happiness_index},
  taste_profile: {sweet, sour, salty, bitter, umami},
  songs: [{artist, title, genre, youtube_video_id, ...}],
  gastronomic: {ingredients, techniques, menu_type, wine_pairing},
  playlist_duration_minutes: 35.0
}
```

---

## 8. DATABASE SCHEMA (Supabase PostgreSQL)

### 8.1 Tables

| Table | Rows (est.) | Purpose |
|-------|------------|---------|
| `user_profiles` | ~100 | User data, XP, rank, preferences |
| `subscriptions` | ~100 | Tier, status, Stripe/RevenueCat IDs |
| `usage_tracking` | ~1000 | Daily recipe counts per user |
| `saved_recipes` | ~500 | Recipe JSONB with metadata |
| `achievements` | ~200 | Unlocked achievements per user |
| `achievement_definitions` | ~30 | Achievement catalog |

### 8.2 M5 PostgreSQL (Music)

| Table | Rows | Purpose |
|-------|------|---------|
| `chefmanny.songs` | 900+ | Song database with V, A, HI, taste%, YouTube IDs |

---

## 9. UNIFIED BACKEND API DESIGN

If ChefManny were **100% backend/API**, here is the proposed architecture:

### 9.1 Proposed Unified API Endpoints

```
POST /api/v1/menu/generate
  Input: GenerateMenuRequest (all 25 filters)
  Output: {symphony: SymphonyRecipe[], playlist: Song[], orchestration: GastronomicOrchestration}

POST /api/v1/menu/generate-stream
  Input: Same as above
  Output: SSE stream with progress + final result

POST /api/v1/emotion/analyze
  Input: {valence, arousal} or {emotionalState: string}
  Output: {quadrant, HI, tasteProfile, suggestedGenres, suggestedIngredients}

POST /api/v1/music/match
  Input: {valence, arousal, genre?, limit?}
  Output: {songs[], playlistDuration}

POST /api/v1/music/bidirectional
  Input: {valence, arousal} or {sweet, sour}
  Output: Full bidirectional mapping

POST /api/v1/nutrition/calculate
  Input: UserNutritionProfile
  Output: {bmr, tdee, bmi, macroTargets, constraints}

GET  /api/v1/chefs
GET  /api/v1/chefs/:id
GET  /api/v1/traditions
GET  /api/v1/ingredients/search?q=
GET  /api/v1/emotions/states
GET  /api/v1/health-goals
GET  /api/v1/presets

POST /api/v1/user/profile          (CRUD)
POST /api/v1/user/recipes/save
GET  /api/v1/user/recipes
POST /api/v1/user/achievements/check
```

### 9.2 Required Backend Files (Minimum Viable Engine)

```
chefmanny-engine/
├── package.json
├── tsconfig.json
├── .env
├── src/
│   ├── server.ts                          ← Express/Fastify entry point
│   ├── routes/
│   │   ├── menu.routes.ts                 ← /api/v1/menu/*
│   │   ├── emotion.routes.ts              ← /api/v1/emotion/*
│   │   ├── music.routes.ts                ← /api/v1/music/*
│   │   ├── nutrition.routes.ts            ← /api/v1/nutrition/*
│   │   ├── chef.routes.ts                 ← /api/v1/chefs/*
│   │   └── user.routes.ts                 ← /api/v1/user/*
│   ├── engine/
│   │   ├── MenuGenerator.ts               ← FROM services/MenuGenerator.ts
│   │   ├── OrchestratorEngine.ts          ← FROM v7/systems/OrchestratorEngineCentral.ts
│   │   ├── BidirectionalModel.ts          ← FROM v7/systems/BidirectionalModel.ts
│   │   ├── CompositionStyleEngine.ts      ← FROM v7/systems/CompositionStyleEngine.ts
│   │   ├── MusicalMovementSystem.ts       ← FROM v7/systems/MusicalMovementSystem.ts
│   │   ├── NutritionCalculator.ts         ← FROM v8/utils/NutritionCalculator.ts
│   │   └── PromptBuilder.ts              ← FROM constants/BrigadeSymphony.ts (prompt functions)
│   ├── data/
│   │   ├── ChefPersonalities.ts           ← FROM constants/ChefPersonalities.ts
│   │   ├── ChefInfluenceSystem.ts         ← FROM constants/ChefInfluenceSystemConsolidated.ts
│   │   ├── HealthGoals.ts                 ← FROM v8/constants/HealthGoals.constants.ts
│   │   ├── EmotionalQuadrants.ts          ← FROM v7/data/EmotionalQuadrants.ts
│   │   ├── EmotionalQuadrantProfiles.ts   ← FROM v7/data/EmotionalQuadrantProfiles.ts
│   │   ├── IngredientMusicalDatabase.ts   ← FROM v7/data/IngredientMusicalDatabase.ts
│   │   ├── IngredientNeurochemicalMap.ts  ← FROM v7/data/IngredientNeurochemicalMap.ts
│   │   ├── RecipeLevels.ts                ← FROM constants/RecipeLevels.ts
│   │   └── translations.ts               ← FROM i18n/translations.ts
│   ├── parsers/
│   │   ├── recipeParser.ts                ← FROM utils/recipeParser.ts
│   │   └── recipeTextParser.ts            ← FROM utils/recipeTextParser.ts
│   ├── services/
│   │   ├── LLMService.ts                  ← NEW: unified LLM caller (replaces proxy)
│   │   ├── SupabaseService.ts             ← FROM services/supabase.ts
│   │   ├── MusicService.ts                ← FROM v7/api/music_api.py (rewritten in TS)
│   │   ├── CurrencyService.ts             ← FROM services/CurrencyService.ts
│   │   └── StripeService.ts               ← FROM services/stripe.ts
│   ├── types/
│   │   ├── Menu.types.ts                  ← FROM components/RecipeCarousel/RecipeCarousel.types.ts
│   │   ├── Orchestrator.types.ts          ← FROM v7/types/OrchestratorTypes.ts
│   │   ├── UserProfile.types.ts           ← FROM v8/types/UserProfile.types.ts
│   │   └── Nutrition.types.ts             ← FROM v8/types/
│   └── middleware/
│       ├── auth.middleware.ts             ← Supabase JWT verification
│       ├── rateLimit.middleware.ts         ← Tier-based rate limiting
│       └── cors.middleware.ts
```

---

## 10. FILE INDEPENDENCE ANALYSIS

### 10.1 Files That Are Already Backend-Ready (No React Dependencies)

| File | Dependencies | Status |
|------|-------------|--------|
| `BidirectionalModel.ts` | Pure math, no imports | ✅ 100% portable |
| `CompositionStyleEngine.ts` | Only OrchestratorTypes | ✅ 100% portable |
| `MusicalMovementSystem.ts` | Only OrchestratorTypes | ✅ 100% portable |
| `NutritionCalculator.ts` | Only V8 types + constants | ✅ 100% portable |
| `HealthGoals.constants.ts` | Only V8 types | ✅ 100% portable |
| `UserProfile.types.ts` | No dependencies | ✅ 100% portable |
| `EmotionalQuadrants.ts` | No dependencies | ✅ 100% portable |
| `EmotionalQuadrantProfiles.ts` | No dependencies | ✅ 100% portable |
| `IngredientMusicalDatabase.ts` | No dependencies | ✅ 100% portable |
| `IngredientNeurochemicalMap.ts` | No dependencies | ✅ 100% portable |
| `ChefPersonalities.ts` | No dependencies | ✅ 100% portable |
| `RecipeLevels.ts` | No dependencies | ✅ 100% portable |
| `CurrencyService.ts` | Only fetch() | ✅ 100% portable |
| `translations.ts` | No dependencies | ✅ 100% portable |
| `recipeParser.ts` | No React dependencies | ✅ 100% portable |
| `recipeTextParser.ts` | No React dependencies | ✅ 100% portable |
| `music_api.py` | Flask + psycopg2 | ✅ Already backend |

### 10.2 Files Requiring Adaptation

| File | Issue | Effort |
|------|-------|--------|
| `MenuGenerator.ts` | Uses `fetch()` with relative URLs, needs direct API calls | Low |
| `BrigadeSymphony.ts` | 128KB monolith mixing config + prompts + types. Needs splitting. | Medium |
| `OrchestratorEngineCentral.ts` | Pure logic but imports from 4 V7 modules | Low |
| `ChefInfluenceSystem_PART1-8.ts` | 370KB of data. Could be DB or JSON files. | Medium |
| `supabase.ts` | Uses `import.meta.env` (Vite-specific) | Low |

### 10.3 Files That Stay Frontend-Only

| File | Reason |
|------|--------|
| `ChefManny.tsx` | React UI monolith |
| `ChefMannyVoiceAgent.tsx` | ElevenLabs React SDK |
| All `*Partitura*.tsx` | Visual components |
| `RecipeCarousel*.tsx` | UI components |
| `PaywallScreen.tsx` | UI |
| `UpgradeTeasers.tsx` | UI |
| `AuthContext.tsx` | React context |
| `SubscriptionContext.tsx` | React context |
| `useParallelRecipeGeneration.ts` | React hook (but logic is extractable) |

---

## 11. MINIMUM VIABLE ENGINE (MVE)

### 11.1 If ChefManny Were a Pure API Service

**Total files needed: ~25 TypeScript files + 1 Python file**

**Core Engine (7 files):**
1. `BidirectionalModel.ts` — 5 equations
2. `OrchestratorEngineCentral.ts` — Symphony composition
3. `CompositionStyleEngine.ts` — 7 styles
4. `MusicalMovementSystem.ts` — 9 movements
5. `NutritionCalculator.ts` — BMR/TDEE/macros
6. `MenuGenerator.ts` — LLM orchestration (adapted)
7. `PromptBuilder.ts` — Prompt engineering (extracted from BrigadeSymphony)

**Data Files (8 files):**
8. `ChefPersonalities.ts` — 36 chefs
9. `ChefInfluenceSystem.ts` — Chef influence instructions
10. `HealthGoals.ts` — 27 goals
11. `EmotionalQuadrants.ts` — 40 states
12. `EmotionalQuadrantProfiles.ts` — Genres + composers
13. `IngredientMusicalDatabase.ts` — 200+ ingredients
14. `IngredientNeurochemicalMap.ts` — Neurochemistry
15. `RecipeLevels.ts` — 3 levels

**Parsers (2 files):**
16. `recipeParser.ts` — JSON parser
17. `recipeTextParser.ts` — Text fallback parser

**Services (4 files):**
18. `LLMService.ts` — Direct OpenAI/Gemini/Perplexity calls
19. `SupabaseService.ts` — Auth + DB
20. `MusicService.ts` — Song queries (or keep music_api.py)
21. `CurrencyService.ts` — Exchange rates

**Types (3 files):**
22. `OrchestratorTypes.ts`
23. `UserProfile.types.ts`
24. `RecipeCarousel.types.ts` (SymphonyRecipe)

**Server (1 file):**
25. `server.ts` — Express with routes

### 11.2 Workflow: Backend-Only Menu Generation

```
POST /api/v1/menu/generate
{
  "ingredients": "pollo, limón, ajo, romero",
  "emotion": {"valence": 0.85, "arousal": 0.70},
  "tradition": "francesa",
  "chefId": "chef_escoffier",
  "courses": ["appetizer", "main", "dessert"],
  "guests": 4,
  "recipeLevel": "intermedio",
  "maxCookTime": 60,
  "budget": "moderate",
  "nutritionPreset": "balanced",
  "healthGoals": ["heart-healthy"],
  "dietTypes": [],
  "allergens": ["shellfish"],
  "language": "es"
}

RESPONSE:
{
  "symphony": {
    "title": "Sinfonía del Mediterráneo",
    "movements": 3,
    "climaxAt": 0.618,
    "emotionalArc": "Allegro → Andante → Rondo"
  },
  "recipes": [
    {
      "movement": 1,
      "dishName": "Carpaccio de Pollo con Cítricos",
      "dynamic": "mp",
      "ingredients": [...],
      "method": [...],
      "chefVoice": "...",
      "nutrition": {calories: 280, protein: 22, ...},
      "musicalNotation": {register: "Alto", note: "D5", role: "theme"}
    },
    ...
  ],
  "playlist": [
    {artist: "Debussy", title: "Clair de Lune", youtubeId: "...", HI: 82.5},
    ...
  ],
  "orchestration": {
    "compositionStyle": "Classical",
    "ingredientRoles": {...},
    "dynamicArc": ["mp", "mf", "f", "mf", "p"]
  },
  "nutrition": {
    "totalCalories": 1450,
    "macros": {protein: 85, carbs: 120, fat: 55},
    "tdeePercentage": 72
  },
  "metadata": {
    "provider": "OpenAI GPT-4o",
    "generationTime": 12.5,
    "happinessIndex": 89.2,
    "quadrant": "Q1_EUPHORIC"
  }
}
```

### 11.3 Comparison: ElevenLabs Agent Independence

The ElevenLabs voice agent (`ChefMannyVoiceAgent.tsx`) currently operates as a **semi-independent** system:
- Has its own system prompt (`SystemPromptV4_ElevenLabs.md`)
- Runs on ElevenLabs cloud (WebSocket)
- Uses 39 client-side tools to read/write React state
- **If backed by the unified API**, it would only need:
  - `POST /api/v1/menu/generate` (instead of triggering React state)
  - `GET /api/v1/chefs/:id` (instead of reading React state)
  - `POST /api/v1/emotion/analyze` (instead of calling local functions)
  - The 39 tools would become **API calls** instead of React callbacks

---

## SUMMARY

| Metric | Value |
|--------|-------|
| **Total source files** | ~120 TypeScript + 1 Python |
| **Total source size** | ~2.5MB TypeScript + 18KB Python |
| **Largest file** | ChefManny.tsx (301KB) — the monolith |
| **Backend-ready files** | 17 files (100% portable, no changes needed) |
| **Files needing adaptation** | 5 files (low-medium effort) |
| **Frontend-only files** | ~30 files (React components, hooks, contexts) |
| **External APIs** | 11 services |
| **Database tables** | 7 (Supabase) + 1 (M5 PostgreSQL) |
| **Minimum files for backend engine** | **25 TypeScript + 1 Python** |
| **Estimated extraction effort** | 2-3 weeks for full backend API |

---

**© 2026 José Manuel "Manny" Cadena Ortiz de Montellano**
**Fooworks, LLC | Fight For Life Club Foundation**
**"No cocinamos recetas. Componemos experiencias."**
