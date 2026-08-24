# KAIRA Integration - Manual Steps Required

## ✅ COMPLETED AUTOMATICALLY

1. ✅ **FASE 0**: Archivos base de Kaira copiados a LOGOS
2. ✅ **FASE 1**: ERS → LERS renombrado (backward compatible)
3. ✅ **FASE 2-4**: TypeScript integration files created
4. ✅ **FASE 5**: healthkit-bridge.ts extended with `processWatchForKaira()`
5. ✅ **FASE 6-9**: API routes Express created (chat + logos-checkin)
6. ✅ **FASE 11-12**: React hooks and KairaPanel component created
7. ✅ **FASE 14**: CSS integration styles created

---

## 🔴 MANUAL STEPS REQUIRED

### **STEP 1: Install Backend Dependencies**

```bash
cd /Users/manuelcadena/CascadeProjects/logos/api
npm install @supabase/supabase-js
```

### **✅ STEP 2: Configure Environment Variables** (COMPLETED)

API key configured in both `.env` files:
- `/Users/manuelcadena/CascadeProjects/logos/.env`
- `/Users/manuelcadena/CascadeProjects/logos/api/.env`

```bash
# Anthropic API (KAIRA)
ANTHROPIC_API_KEY=<REDACTED>

# Supabase
SUPABASE_URL=<REDACTED>
SUPABASE_SERVICE_ROLE_KEY=<REDACTED>
```

### **STEP 3: Execute Supabase Migration**

1. Go to: https://supabase.com/dashboard/project/qfqgplopnwxilnyeajbt/sql/new
2. Copy the SQL from the integration prompt **FASE 10** (lines 1019-1483 of the prompt file)
3. Execute the SQL to create the following tables:
   - `dimension_sources`
   - `formulations`
   - `patient_memories`
   - `safety_events`
   - `messages`
   - `emergence_events_clinical`
   - Extensions to `sessions` table
   - Views: `integrated_therapeutic_trajectory`, `kaira_research_metrics`

### **STEP 4: Integrate KairaPanel into LogosHumano.jsx**

**IMPORTANT**: All the code needed is in `KAIRA_LOGOSHUMANO_INTEGRATION_CODE.md` with exact line references.

This is the most complex manual step. You need to:

1. **Add imports** to `src/components/LogosHumano.jsx`:

```javascript
import KairaPanel from './kaira/KairaPanel';
import { computeLogosBridge } from '../lib/kaira/logos-integration/logos-bridge';
import { positiveGeometryProtocol } from '../lib/kaira/logos-integration/positive-geometry-protocol';
import { processWatchForKaira } from '../core/healthkit-bridge';
```

2. **Add state variables**:

```javascript
const [kairаVisible, setKairaVisible] = useState(false);
const [dimensionSources, setDimensionSources] = useState({});
const [logosContext, setLogosContext] = useState(null);
const [kairaSessionId, setKairaSessionId] = useState(null);
```

3. **Create `buildLogosContext()` function** (after all metrics are computed):

```javascript
function buildLogosContext() {
  const bridge = computeLogosBridge({
    logosState: state,
    lambda: logosResult.value,
    freeEnergy: freeEnergyResult.value,
    viability: viabilityResult.value,
    entropy: entropyResult.value,
    coherence: coherenceResult.coherence,
    levinSignals,
    hoffmanBiases,
    policyVerdict: policy.verdict,
  });

  // Get weakest 3 domains
  const domainScores = Object.entries(watsonResult.domainScores)
    .map(([key, value]) => ({ 
      key, 
      label: DOMAINS[key]?.label || key, 
      value: value 
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  return {
    lambda: logosResult.value,
    lambdaLevel: interpretLogosAlignment(logosResult.value).level,
    freeEnergy: freeEnergyResult.value,
    viability: viabilityResult.value,
    entropy: entropyResult.value,
    coherence: coherenceResult.coherence,
    omega: omegaResult.value,
    lers: lersValue,
    policyVerdict: policy.verdict,
    policyReason: policy.reason,
    levinSignals,
    hoffmanBiases,
    weakestDomains: domainScores,
    bridge,
    stateSnapshot: state,
  };
}
```

4. **Add callback for dimension extraction**:

```javascript
const handleDimensionsExtracted = useCallback((
  newState,
  sources
) => {
  // Update LOGOS state with conversationally extracted dimensions
  setState(prev => ({ ...prev, ...newState }));
  setDimensionSources(sources);
  
  // Build updated LOGOS context for therapy mode
  const updatedContext = buildLogosContext();
  setLogosContext(updatedContext);
}, [state, logosResult, levinSignals, hoffmanBiases]);
```

5. **Add floating button and panel to JSX** (at the end of the component, before closing div):

```jsx
{/* Floating Kaira button */}
<button
  onClick={() => {
    setLogosContext(buildLogosContext());
    setKairaVisible(true);
  }}
  className="kaira-fab"
  aria-label="Abrir Kaira"
>
  <span>💬</span>
  <span className="kaira-fab-label">
    {language === 'es' ? 'Habla con Kaira' : 'Talk to Kaira'}
  </span>
</button>

{/* Kaira Panel overlay/sidebar */}
{kairаVisible && (
  <div className="kaira-panel-container">
    <button
      className="kaira-close"
      onClick={() => setKairaVisible(false)}
    >
      ✕
    </button>
    <KairaPanel
      logosContext={logosContext}
      onDimensionsExtracted={handleDimensionsExtracted}
      initialMode="checkin"
      language={language}
      sessionId={kairaSessionId}
    />
  </div>
)}
```

### **STEP 5: Test the Integration**

1. **Start the backend**:
```bash
cd /Users/manuelcadena/CascadeProjects/logos/api
node server.js
```

2. **Start the frontend**:
```bash
cd /Users/manuelcadena/CascadeProjects/logos
npm run dev
```

3. **Test flow**:
   - Open LOGOS dashboard
   - Click "Habla con Kaira" button
   - Complete conversational check-in (cover all 7 domains)
   - Verify dimensions update in LOGOS dashboard
   - Verify KAIRA switches to therapy mode with LOGOS context

### **STEP 6: Deploy to Production**

1. **Backend** (M5 server):
```bash
# SSH to M5
ssh m5

# Pull latest code
cd /opt/logoilab/api
git pull

# Install dependencies
npm install

# Restart service
pm2 restart logos-api
```

2. **Frontend**:
```bash
# Build
cd /Users/manuelcadena/CascadeProjects/logos
npm run build

# Deploy
rsync -avz --delete dist/ m5:/opt/logoilab/frontend/dist/
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] Backend dependencies installed (`@supabase/supabase-js`)
- [ ] Environment variables configured (ANTHROPIC_API_KEY)
- [ ] Supabase migration executed successfully
- [ ] KairaPanel integrated into LogosHumano.jsx
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] Backend starts without errors
- [ ] Frontend builds without errors
- [ ] Kaira button appears in dashboard
- [ ] Check-in conversation works
- [ ] Dimension extraction updates LOGOS state
- [ ] Therapy mode activates with LOGOS context
- [ ] Crisis signals trigger appropriate protocols

---

## 🚨 TROUBLESHOOTING

### **"Cannot find module" errors**
- Verify all imports use correct relative paths (not `@/` aliases)
- Check that files exist in expected locations

### **API calls fail**
- Verify ANTHROPIC_API_KEY is set correctly
- Check backend is running on port 3200
- Verify CORS settings allow frontend origin

### **Dimension extraction doesn't work**
- Check Anthropic API key has sufficient credits
- Verify conversation covers at least 18/28 dimensions
- Check browser console for errors

### **Database errors**
- Verify Supabase migration executed successfully
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Verify tables exist in Supabase dashboard

---

## 📚 ARCHITECTURE SUMMARY

### **Frontend (Vite + React)**
- `src/lib/kaira/` - Core KAIRA logic (copied from Kaira)
- `src/lib/kaira/logos-integration/` - LOGOS↔KAIRA bridge
- `src/hooks/kaira/` - React hooks for KAIRA
- `src/components/kaira/` - KairaPanel component
- `src/styles/kaira-integration.css` - KAIRA UI styles

### **Backend (Express.js)**
- `api/routes/kaira/chat.js` - Therapeutic chat endpoint
- `api/routes/kaira/logos-checkin.js` - Dimension extraction endpoint
- `api/lib/kaira/` - Prompt composers (JavaScript versions)

### **Database (Supabase PostgreSQL)**
- `dimension_sources` - Tracks how each dimension was obtained
- `formulations` - KAIRA AIFET formulation state
- `messages` - Chat history
- `safety_events` - Crisis detection log
- `emergence_events_clinical` - Emergence tracking

### **Integration Points**
1. **Check-in mode**: Conversational extraction → updates LOGOS state
2. **Therapy mode**: LOGOS context injected into KAIRA prompts
3. **Positive Geometry Protocol**: Layer 10 → KAIRA clinical interventions
4. **HealthKit Bridge**: Watch biometrics → KAIRA AIFET precision signals

---

## 🎯 NEXT STEPS AFTER INTEGRATION

1. **Test with real users** (N=5-10 beta testers)
2. **Monitor safety events** in Supabase dashboard
3. **Calibrate extraction quality** thresholds
4. **Tune Positive Geometry protocol** urgency levels
5. **Add voice mode** (Hume EVI integration - already scaffolded)
6. **Deploy iOS app** with KAIRA integrated

---

**Integration completed by:** Cascade AI  
**Date:** April 13, 2026  
**LOGOS Version:** v5.2  
**KAIRA Version:** v3.1 AIFET  
**Framework:** Cadena Strategic Systems
