# KAIRA Integration Code for LogosHumano.jsx

## 1. Add State Variables (after line 1737, before useEffect hooks)

```javascript
// ═══ KAIRA Integration State ═══
const [kairaVisible, setKairaVisible] = useState(false);
const [dimensionSources, setDimensionSources] = useState({});
const [logosContext, setLogosContext] = useState(null);
const [kairaSessionId, setKairaSessionId] = useState(null);
```

## 2. Add buildLogosContext Function (after all computations, around line 2500-2600)

```javascript
// ═══ Build LOGOS Context for KAIRA ═══
const buildLogosContext = useCallback(() => {
  if (!logosResult || !watsonResult) return null;

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
      label: tDomains[key]?.label || key, 
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
}, [state, logosResult, freeEnergyResult, viabilityResult, entropyResult, coherenceResult, omegaResult, lersValue, policy, levinSignals, hoffmanBiases, watsonResult, tDomains]);
```

## 3. Add Dimension Extraction Callback (after buildLogosContext)

```javascript
// ═══ Handle KAIRA Dimension Extraction ═══
const handleDimensionsExtracted = useCallback((newState, sources) => {
  // Update LOGOS state with conversationally extracted dimensions
  setState(prev => ({ ...prev, ...newState }));
  setDimensionSources(sources);
  
  // Build updated LOGOS context for therapy mode
  const updatedContext = buildLogosContext();
  setLogosContext(updatedContext);
}, [buildLogosContext]);
```

## 4. Add JSX at the END of the return statement (before the final closing </div>)

Find the end of the main return statement (around line 4500-4550) and add BEFORE the final `</div>`:

```jsx
{/* ═══════════════════════════════════════════════════════════════
    KAIRA INTEGRATION — Floating Button + Panel
    ═══════════════════════════════════════════════════════════ */}

{/* Floating Kaira button */}
<button
  onClick={() => {
    const ctx = buildLogosContext();
    setLogosContext(ctx);
    setKairaVisible(true);
  }}
  style={{
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.25rem',
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    color: 'white',
    border: 'none',
    borderRadius: '3rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: '0 4px 24px rgba(168, 85, 247, 0.35)',
    transition: 'all 0.2s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.45)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 24px rgba(168, 85, 247, 0.35)';
  }}
  aria-label={i18n.language === 'es' ? 'Abrir Kaira' : 'Open Kaira'}
>
  <span>💬</span>
  <span style={{ fontSize: '0.875rem' }}>
    {i18n.language === 'es' ? 'Habla con Kaira' : 'Talk to Kaira'}
  </span>
</button>

{/* Kaira Panel overlay/sidebar */}
{kairaVisible && (
  <div style={{
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: 'min(480px, 100vw)',
    zIndex: 200,
    background: '#0f0f1a',
    borderLeft: '1px solid rgba(168, 85, 247, 0.2)',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease',
  }}>
    <button
      onClick={() => setKairaVisible(false)}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 10,
        background: 'rgba(255,255,255,0.08)',
        border: 'none',
        color: 'white',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
    >
      ✕
    </button>
    <KairaPanel
      logosContext={logosContext}
      onDimensionsExtracted={handleDimensionsExtracted}
      initialMode="checkin"
      language={i18n.language}
      sessionId={kairaSessionId}
    />
  </div>
)}
```

## 5. Add interpretLogosAlignment helper function (if not exists)

Search for `interpretLogosAlignment` in the file. If it doesn't exist, add it near the top helper functions:

```javascript
function interpretLogosAlignment(lambda) {
  if (lambda >= 0.70) return { level: 'ÓPTIMO', color: COLORS.viability };
  if (lambda >= 0.55) return { level: 'BIEN', color: COLORS.logos };
  if (lambda >= 0.40) return { level: 'NEUTRO', color: COLORS.textDim };
  if (lambda >= 0.25) return { level: 'BAJO', color: COLORS.entropy };
  return { level: 'CRÍTICO', color: '#ef4444' };
}
```

## Notes:
- The floating button appears in the bottom-right corner
- Clicking it opens the KAIRA panel as a sidebar
- The panel slides in from the right with animation
- Close button (✕) in top-left of panel
- KAIRA automatically switches from check-in to therapy mode after dimension extraction
- All LOGOS context (Λ, V, S, C, F, Ω, LERS, Levin, Hoffman, weakest domains) is injected into KAIRA prompts
