# LOGOS HUMANO — App Store Business Model & Compliance

## App Information

- **App Name**: LOGOS HUMANO
- **Bundle ID**: com.cadenastrategic.logos
- **Version**: 1.0 (Build 1)
- **Developer**: Dr. José Manuel Cadena Ortiz de Montellano / Cadena Strategic Systems
- **Pricing**: Free (no paid tiers)

---

## Guideline 2.5.1 — HealthKit Disclosure

### Does the app use HealthKit?

**Yes.** LOGOS HUMANO reads biometric data from Apple Health (HealthKit) to enrich its consciousness alignment analysis engine.

### Does the app use CareKit?

**No.** The app does not use CareKit, OCKStore, OCKTask, OCKOutcome, or any CareKit APIs.

### What HealthKit data is accessed?

**Read-only access** to the following categories (the app never writes to HealthKit):

| Category | Data Types |
|----------|-----------|
| Vital Signs | Heart rate, HRV (SDNN), resting heart rate, blood oxygen (SpO₂), respiratory rate, body temperature, heart rate recovery |
| Fitness | VO₂ Max, exercise minutes, active energy burned, step count, stand hours |
| Sleep | Sleep duration, sleep stages (deep, core, REM, awake, in-bed) |
| Mental Health | Mindful session minutes |
| Cardiac | ECG results, atrial fibrillation classification |
| Mobility | Walking asymmetry percentage |
| Environment | Environmental noise exposure, headphone audio exposure |

### Where is HealthKit usage disclosed in the UI?

1. **Onboarding Flow (Step 5 of 6)**: A dedicated "Apple Health Integration" screen explains what data is read, why, and that data stays on-device. This screen appears before the user ever reaches the HealthKit authorization prompt.

2. **Biometrics Tab — Health Data & Privacy Panel**: When the user navigates to the "Apple Watch" tab and has not yet authorized HealthKit, they see a comprehensive disclosure panel with:
   - Full list of data categories read
   - Explicit statement that no data is written
   - Purpose of each data usage (auto-population, Levin signals, Hoffman biases, engine modulators, safety overrides)
   - Privacy guarantees (local processing, no server upload, no third-party sharing)
   - Instructions to manage permissions in iOS Settings

3. **Info.plist Usage Descriptions**: `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` contain detailed explanations shown in the system authorization dialog.

### Privacy guarantees

- All health data is processed **locally on-device**
- No health data is uploaded to any server
- No health data is shared with third parties
- HealthKit integration is entirely optional — the app works fully without it
- Users can revoke access at any time in iOS Settings → Health → Data Access & Devices

---

## Guideline 2.1 — Business Model

### App monetization model

**LOGOS HUMANO uses a freemium model with a monthly auto-renewable subscription purchased exclusively through Apple's In-App Purchase (StoreKit 2).**

- **Subscription Group**: Logoilab Subscriber (ID: 21924966)
- **Product ID**: `001`
- **Duration**: 1 month (auto-renewable)
- **Apple ID**: 6758929606
- **Payment**: Exclusively via Apple In-App Purchase (StoreKit 2)
- ❌ No external payment mechanisms (no Stripe, PayPal, web checkout)
- ❌ No ads
- ❌ No affiliate links

### Free Tier (all users)

All users — whether signed in with Google, Apple, or as a guest — have access to:
- 28 consciousness dimension sliders with emoji-guided scales
- Decision semaphore (Π verdict: ACTÚA / MONITOREA / ESPERA / PAUSA)
- 7-domain radar visualization
- Daily consciousness guide
- Daily check-in and basic tracking

### Premium Tier (subscribers)

Users who subscribe via In-App Purchase unlock:
- Full 7-Layer LOGOS Engine with all derived metrics (Λ, V, S, C, F, Q, Ω)
- Monte Carlo stochastic simulations (N configurable)
- Apple Watch & HealthKit biometric integration
- Historical trajectory analysis and trends
- LOGOS Voice Agent conversations
- Emergence detection and reporting (ERS)
- Adaptive intervention protocols
- Sacred Nourishment domain analysis
- Theory documentation
- Session tracking and analytics

### Implementation

| Component | File | Role |
|-----------|------|------|
| Native StoreKit 2 Plugin | `ios/App/App/LOGOSSubscriptionPlugin.swift` | Product loading, purchase, restore, manage, transaction listener |
| TypeScript Interface | `src/plugins/logos-subscription.ts` | Capacitor plugin bridge definition |
| React Hook | `src/hooks/useSubscription.ts` | Subscription state management, caching |
| Paywall UI | `src/components/PaywallModal.jsx` | Full-screen paywall + inline lock banner |
| Tab Gating | `src/components/LogosHumano.jsx` | Premium tabs gated via `PREMIUM_TABS` set |
| Settings Menu | `src/components/LogosHumano.jsx` | Subscription status + manage/upgrade button |

### Answers to Apple's 3 Questions

#### Question 1: "Where can users purchase the content and subscriptions that can be accessed in the app?"

**Users purchase the LOGOS HUMANO Premium subscription directly within the app using Apple's In-App Purchase system (StoreKit 2).** When a free user taps on any premium tab (Emergence, Logos Engine, Monte Carlo, Apple Watch, Trajectory, etc.), they see a paywall screen with the subscription price, feature comparison, and a "Subscribe Now" button that triggers the native StoreKit purchase flow. Users can also access the subscription from the Settings menu (⚙ → ✦ LOGOS HUMANO Premium). The subscription is a monthly auto-renewable subscription in the "Logoilab Subscriber" group (Product ID: `001`). There are no external purchase mechanisms — all transactions go through Apple.

#### Question 2: "What specific types of previously purchased content and subscriptions can a user access in the app?"

**Users with an active LOGOS HUMANO Premium subscription (Product ID: `001`, monthly auto-renewable) unlock all premium features.** The app checks subscription status on launch via StoreKit 2's `Transaction.currentEntitlements` and caches the result locally for instant UI. A "Restore Purchases" button is available on the paywall screen, which calls `AppStore.sync()` to recover entitlements on new devices or after reinstallation. The subscription management page (Apple's native UI) is accessible from Settings → ✦ → Manage Subscription.

#### Question 3: "What paid content, subscriptions, or features are unlocked within your app that do not use in-app purchase?"

**None.** All paid features are unlocked exclusively through Apple's In-App Purchase system (StoreKit 2). There are no external payment mechanisms, no web-based checkout, no promo codes that bypass StoreKit, and no server-side entitlement grants. The only way to access premium features is through the monthly subscription purchased via the native StoreKit flow within the app.

---

## Technical Evidence

### StoreKit 2 Implementation

| Component | Details |
|-----------|---------|
| Framework | StoreKit 2 (async/await API, iOS 15+) |
| Product Loading | `Product.products(for:)` with Product ID `001` |
| Purchase Flow | `product.purchase()` → verify → `transaction.finish()` |
| Entitlement Check | `Transaction.currentEntitlements` loop |
| Transaction Listener | `Transaction.updates` for renewals/revocations |
| Restore | `AppStore.sync()` |
| Manage | `AppStore.showManageSubscriptions(in:)` |
| Verification | Apple's built-in `VerificationResult` (JWS) |

### Code audit results

| Search Term | Files Found | Nature |
|------------|------------|--------|
| `StoreKit` | 1 (`LOGOSSubscriptionPlugin.swift`) | StoreKit 2 subscription management |
| `Product.purchase` | 1 (`LOGOSSubscriptionPlugin.swift`) | Native IAP purchase flow |
| `Transaction.currentEntitlements` | 1 (`LOGOSSubscriptionPlugin.swift`) | Entitlement verification |
| `Stripe` / `PayPal` | 0 | Not used — Apple IAP only |
| `CareKit` / `OCKStore` | 0 | Not used |
| `HealthKit` / `HKHealthStore` | 8 files | Read-only biometric integration |

### Files that access HealthKit

| File | Role |
|------|------|
| `ios/App/App/LOGOSHealthKitPlugin.swift` | Native Capacitor plugin (sole HealthKit accessor) |
| `src/plugins/logos-healthkit.ts` | TypeScript interface definition |
| `src/hooks/useHealthKit.ts` | React hook for HealthKit state management |
| `src/core/healthkit-bridge.ts` | Maps biometrics to LOGOS engine layers |
| `src/components/LogosHumano.jsx` | UI: biometrics tab, disclosure panel |
| `ios/App/App/Info.plist` | Usage descriptions |
| `ios/App/App/App.entitlements` | HealthKit entitlement |

---

## Resubmission Checklist

### Guideline 2.5.1 (HealthKit)
- [x] Onboarding step 5/6 explains HealthKit usage before any data access
- [x] Biometrics tab shows full Health Data & Privacy disclosure before authorization
- [x] Disclosure lists all data categories read (vitals, fitness, sleep, mental, cardiac, mobility, environment)
- [x] Disclosure explicitly states no data is written to HealthKit
- [x] Purpose of each data usage is explained (auto-population, signals, biases, modulators, safety)
- [x] Privacy guarantees are clearly stated (local, no server, no third parties)
- [x] Instructions to revoke access via iOS Settings are provided
- [x] Info.plist has NSHealthShareUsageDescription with detailed explanation
- [x] Info.plist has NSHealthUpdateUsageDescription with detailed explanation
- [x] Info.plist has NSHealthClinicalHealthRecordsShareUsageDescription
- [x] App.entitlements has com.apple.developer.healthkit = true
- [x] App.entitlements has health-records access
- [x] HealthKit authorization is never called before showing disclosure UI
- [x] Error handling shows user-friendly message if access is denied
- [x] LOGOSHealthKitPlugin.swift has comprehensive inline documentation
- [x] No CareKit usage exists in the codebase

### Guideline 2.1 (Business Model / Subscription)
- [x] StoreKit 2 native plugin implemented (`LOGOSSubscriptionPlugin.swift`)
- [x] Product ID `001` (monthly auto-renewable) in group "Logoilab Subscriber"
- [x] Purchase flow: `Product.products(for:)` → `product.purchase()` → verify → finish
- [x] Entitlement check via `Transaction.currentEntitlements`
- [x] Transaction listener for renewals/revocations (`Transaction.updates`)
- [x] Restore purchases via `AppStore.sync()`
- [x] Manage subscription via `AppStore.showManageSubscriptions(in:)`
- [x] Capacitor bridge plugin (`src/plugins/logos-subscription.ts`)
- [x] React hook `useSubscription` with local caching
- [x] PaywallModal with feature comparison (free vs premium)
- [x] PremiumLockBanner shown on gated tabs
- [x] Premium tabs gated: emergence, motor, trayectoria, montecarlo, alimento, seguimiento, biometrics, teoria
- [x] Free tabs available to all: estado, decision, guia
- [x] Settings menu shows subscription status + manage/upgrade button
- [x] Terms of service note on paywall (auto-renewal, cancellation)
- [x] Restore Purchases button on paywall
- [x] No external payment mechanisms (Apple IAP only)
- [x] All three Apple questions answered with correct subscription details
- [x] i18n strings for subscription UI (English + Spanish)

### General (Resubmission)
- [x] Info.plist has all required usage descriptions (Microphone, HealthKit)
- [x] i18n strings added for HealthKit disclosure (English + Spanish)
- [x] Onboarding now has 6 steps (was 5) — step 5 is HealthKit
- [x] Build verified: 985 modules, exit code 0
- [x] Tests verified: 759/759 passing (18 test files)
- [ ] Add `LOGOSSubscriptionPlugin.swift` to Xcode project (File → Add Files)
- [ ] Add In-App Purchase capability in Xcode (Signing & Capabilities)
- [ ] Verify Product ID `001` status is "Ready to Submit" in App Store Connect
- [ ] Test subscription flow in Sandbox environment
- [ ] Archive and upload new build to App Store Connect
- [ ] In App Store Connect Resolution Center, paste answers to Apple's 3 questions
- [ ] Resubmit for review

---

*Document generated: 2026-02-12*
*Author: Dr. José Manuel Cadena Ortiz de Montellano*
