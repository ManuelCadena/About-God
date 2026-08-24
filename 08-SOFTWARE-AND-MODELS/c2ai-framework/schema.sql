-- ═══════════════════════════════════════════════════════════════════════════
-- CONSCIOUS CITRUS AI (C²AI) - DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════
-- Version: 1.0.0
-- Date: 2026-01-02
-- Author: Dr. José Manuel Cadena
-- Database: citrusmax_biofix (PostgreSQL 15.x)
-- ═══════════════════════════════════════════════════════════════════════════

-- Create schema
CREATE SCHEMA IF NOT EXISTS c2ai;

COMMENT ON SCHEMA c2ai IS 'Conscious Citrus AI - Multi-layer quantum-thermodynamic framework';

-- ───────────────────────────────────────────────────────────────────────────
-- 1. BIOELECTRIC SIGNALS (Levin Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.bioelectric_signals (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER,
    section VARCHAR(10),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Voltage measurements (mV)
    voltage_meristem FLOAT,
    voltage_root FLOAT,
    voltage_fruit FLOAT,
    voltage_leaf FLOAT,
    
    -- Derived metrics
    coherence_score FLOAT CHECK (coherence_score >= 0 AND coherence_score <= 1),
    frequency_dominant_hz FLOAT,
    phase_sync_index FLOAT,
    
    -- Physiological proxies (until real sensors available)
    spad_proxy FLOAT,
    water_potential_proxy FLOAT,
    root_respiration_proxy FLOAT,
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bioelectric_tree_time ON c2ai.bioelectric_signals(tree_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_bioelectric_section ON c2ai.bioelectric_signals(section, timestamp);

COMMENT ON TABLE c2ai.bioelectric_signals IS 'Bioelectric signals per tree - Base for goal detection (Levin Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 2. FREE ENERGY LOGS (Friston Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.free_energy_logs (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER,
    section VARCHAR(10),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Free energy calculation
    free_energy_value FLOAT NOT NULL,
    kl_divergence FLOAT,
    
    -- Prediction vs observation vectors
    prediction_vector JSONB,
    observation_vector JSONB,
    surprise_vector JSONB,
    
    -- Recommended actions from active inference
    action_recommended JSONB,
    action_urgency FLOAT CHECK (action_urgency >= 0 AND action_urgency <= 10),
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_free_energy_section ON c2ai.free_energy_logs(section, timestamp);
CREATE INDEX IF NOT EXISTS idx_free_energy_tree ON c2ai.free_energy_logs(tree_id, timestamp);

COMMENT ON TABLE c2ai.free_energy_logs IS 'Free Energy F calculations - Active inference (Friston Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 3. BIOELECTRIC GOALS (Levin Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.bioelectric_goals (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER,
    section VARCHAR(10),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Detected goal
    goal_name VARCHAR(50) NOT NULL,
    goal_category VARCHAR(30),
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    
    -- Actions that support/contradict this goal
    supporting_actions JSONB,
    contradicting_actions JSONB,
    
    -- Phenological context
    phenology_stage VARCHAR(10),
    gdd_accumulated FLOAT,
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_goals_section ON c2ai.bioelectric_goals(section, timestamp);
CREATE INDEX IF NOT EXISTS idx_goals_name ON c2ai.bioelectric_goals(goal_name);

COMMENT ON TABLE c2ai.bioelectric_goals IS 'Detected bioelectric goals - What the plant "wants" (Levin Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 4. KERNEL STATES (Hoffman Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.kernel_states (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    section VARCHAR(10),
    
    -- Reconstructed complete state
    complete_state_estimation JSONB NOT NULL,
    reconstruction_confidence FLOAT CHECK (reconstruction_confidence >= 0 AND reconstruction_confidence <= 1),
    
    -- Agent conflicts
    unresolved_conflicts INTEGER DEFAULT 0,
    conflict_details JSONB,
    
    -- Optimal policy derived
    policy_optimal JSONB,
    expected_vep_from_policy FLOAT,
    
    -- Agent traces used
    agent_traces_used JSONB,
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kernel_section ON c2ai.kernel_states(section, timestamp);

COMMENT ON TABLE c2ai.kernel_states IS 'Kernel reconstruction - Complete state from partial perspectives (Hoffman Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 5. ENERGY LANDSCAPES (Watson Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.energy_landscapes (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    section VARCHAR(10),
    horizon_days INTEGER DEFAULT 90,
    
    -- Current energy state
    current_state_energy FLOAT NOT NULL,
    
    -- Friction components
    friction_economic FLOAT,
    friction_resource FLOAT,
    friction_biological FLOAT,
    friction_temporal FLOAT,
    
    -- Optimal trajectory
    optimal_trajectory JSONB NOT NULL,
    trajectory_cost FLOAT,
    convergence_days INTEGER,
    
    -- Efficiency
    trajectory_efficiency FLOAT CHECK (trajectory_efficiency >= 0 AND trajectory_efficiency <= 1),
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_landscape_section ON c2ai.energy_landscapes(section, timestamp);

COMMENT ON TABLE c2ai.energy_landscapes IS 'Energy landscapes and optimal trajectories (Watson Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 6. ORCHESTRATOR DECISIONS (Dr. CitrusMax)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.orchestrator_decisions (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Identification
    decision_type VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    tree_ids INTEGER[],
    
    -- Multi-layer reasoning
    rationale JSONB NOT NULL,
    friston_contribution FLOAT,
    levin_contribution FLOAT,
    watson_contribution FLOAT,
    hoffman_contribution FLOAT,
    penrose_contribution FLOAT,
    
    -- Expected impact
    expected_vep_impact FLOAT,
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    urgency INTEGER CHECK (urgency >= 1 AND urgency <= 10),
    
    -- Execution
    executed BOOLEAN DEFAULT FALSE,
    execution_timestamp TIMESTAMPTZ,
    
    -- Actual outcome (feedback loop)
    actual_outcome JSONB,
    outcome_vep_impact FLOAT,
    outcome_recorded_at TIMESTAMPTZ,
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_decisions_type ON c2ai.orchestrator_decisions(decision_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_decisions_section ON c2ai.orchestrator_decisions(section, timestamp);
CREATE INDEX IF NOT EXISTS idx_decisions_executed ON c2ai.orchestrator_decisions(executed);

COMMENT ON TABLE c2ai.orchestrator_decisions IS 'Dr. CitrusMax decisions with multi-layer reasoning';

-- ───────────────────────────────────────────────────────────────────────────
-- 7. QUANTUM COHERENCE (Penrose Layer)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.quantum_coherence (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    section VARCHAR(10),
    
    -- Coherence metrics
    coherence_index FLOAT CHECK (coherence_index >= 0 AND coherence_index <= 1),
    decoherence_time_ms FLOAT,
    decision_space_entropy FLOAT,
    
    -- 40Hz synchronization
    frequency_40hz_power FLOAT,
    phase_locking_value FLOAT,
    
    -- Quantum state proxy
    microtubule_activity_proxy FLOAT,
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quantum_section ON c2ai.quantum_coherence(section, timestamp);

COMMENT ON TABLE c2ai.quantum_coherence IS 'Quantum coherence metrics - Decision space (Penrose Layer)';

-- ───────────────────────────────────────────────────────────────────────────
-- 8. BIOELECTRIC PATTERNS LIBRARY
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.bioelectric_patterns (
    id SERIAL PRIMARY KEY,
    pattern_name VARCHAR(50) NOT NULL UNIQUE,
    pattern_category VARCHAR(30),
    
    -- Expected voltage ranges
    voltage_range_min FLOAT,
    voltage_range_max FLOAT,
    location VARCHAR(30),
    
    -- Characteristic frequency
    frequency_range_min FLOAT,
    frequency_range_max FLOAT,
    
    -- Applicable phenology
    phenology_applies TEXT[],
    
    -- Meaning
    meaning TEXT,
    
    -- Actions
    action_support TEXT[],
    action_harm TEXT[],
    
    -- Validation
    validated BOOLEAN DEFAULT FALSE,
    validation_r2 FLOAT,
    n_observations INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE c2ai.bioelectric_patterns IS 'Bioelectric patterns library for goal detection';

-- Insert base patterns from paper
INSERT INTO c2ai.bioelectric_patterns (pattern_name, pattern_category, voltage_range_min, voltage_range_max, location, frequency_range_min, frequency_range_max, phenology_applies, meaning, action_support, action_harm, validated, n_observations)
VALUES
('growth_apical', 'growth', -45, -30, 'meristem', 8, 12, 
 ARRAY['FEN-02', 'FEN-03', 'FEN-04'], 
 'Active apical growth - meristem expanding', 
 ARRAY['prune_light', 'increase_light', 'increase_n'], 
 ARRAY['defoliate', 'drought', 'reduce_n'],
 TRUE, 1247),

('water_seeking', 'stress', -90, -70, 'root_cap', 4, 6, 
 ARRAY['FEN-01', 'FEN-02', 'FEN-03', 'FEN-04', 'FEN-05'], 
 'Water seeking - moderate water stress', 
 ARRAY['irrigate', 'apply_mulch'], 
 ARRAY['withhold_water', 'increase_et'],
 TRUE, 2834),

('flower_readiness', 'reproduction', -35, -20, 'flower_meristem', 6, 10, 
 ARRAY['FEN-03'], 
 'Flower readiness - active floral induction', 
 ARRAY['maintain_irrigation', 'k_boost', 'protect_from_frost'], 
 ARRAY['frost', 'high_wind', 'excessive_water'],
 TRUE, 892),

('defense_activation', 'defense', -20, -10, 'leaf', 1, 3, 
 ARRAY['FEN-02', 'FEN-03', 'FEN-04', 'FEN-05'], 
 'Defense activation - biotic stress response', 
 ARRAY['apply_ipm', 'reduce_stress', 'calcium_spray'], 
 ARRAY['heavy_pruning', 'water_deficit'],
 TRUE, 1456),

('fruit_maturation', 'reproduction', -50, -40, 'fruit', 10, 15, 
 ARRAY['FEN-05', 'FEN-06', 'FEN-07'], 
 'Fruit maturation - sugar accumulation', 
 ARRAY['maintain_irrigation', 'harvest_timing', 'k_application'], 
 ARRAY['water_stress', 'cold_shock'],
 TRUE, 2103),

('dormancy_preparation', 'stress', -60, -50, 'whole_tree', 2, 4, 
 ARRAY['FEN-08', 'FEN-09', 'FEN-10'], 
 'Dormancy preparation - metabolic slowdown', 
 ARRAY['reduce_irrigation', 'reduce_n', 'protect_from_cold'], 
 ARRAY['force_growth', 'heavy_fertilization'],
 TRUE, 678),

('nutrient_seeking', 'growth', -40, -30, 'root_tip', 5, 8, 
 ARRAY['FEN-02', 'FEN-03', 'FEN-04'], 
 'Nutrient seeking - root exploration for nutrients', 
 ARRAY['fertilize', 'organic_amendment', 'mycorrhizal_inoculation'], 
 ARRAY['salt_stress', 'compaction'],
 TRUE, 1089),

('photosynthetic_peak', 'growth', -35, -25, 'leaf_mature', 12, 18, 
 ARRAY['FEN-03', 'FEN-04', 'FEN-05'], 
 'Peak photosynthetic activity - maximum carbon fixation', 
 ARRAY['maintain_irrigation', 'optimal_light', 'co2_enrichment'], 
 ARRAY['shade', 'defoliation', 'water_stress'],
 TRUE, 1567)

ON CONFLICT (pattern_name) DO UPDATE SET
    pattern_category = EXCLUDED.pattern_category,
    voltage_range_min = EXCLUDED.voltage_range_min,
    voltage_range_max = EXCLUDED.voltage_range_max,
    location = EXCLUDED.location,
    frequency_range_min = EXCLUDED.frequency_range_min,
    frequency_range_max = EXCLUDED.frequency_range_max,
    phenology_applies = EXCLUDED.phenology_applies,
    meaning = EXCLUDED.meaning,
    action_support = EXCLUDED.action_support,
    action_harm = EXCLUDED.action_harm,
    validated = EXCLUDED.validated,
    n_observations = EXCLUDED.n_observations,
    updated_at = CURRENT_TIMESTAMP;

-- ───────────────────────────────────────────────────────────────────────────
-- 9. PERFORMANCE METRICS
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.performance_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metric_type VARCHAR(50) NOT NULL,
    
    -- Metrics
    value FLOAT NOT NULL,
    unit VARCHAR(20),
    target_value FLOAT,
    
    -- Context
    section VARCHAR(10),
    layer VARCHAR(20),
    
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metrics_type ON c2ai.performance_metrics(metric_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_layer ON c2ai.performance_metrics(layer, timestamp);

COMMENT ON TABLE c2ai.performance_metrics IS 'C²AI system performance metrics';

-- ───────────────────────────────────────────────────────────────────────────
-- 10. LAYER WEIGHTS CONFIGURATION
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS c2ai.layer_weights (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(50) NOT NULL DEFAULT 'default',
    
    -- Layer weights (must sum to 1.0)
    w_penrose FLOAT DEFAULT 0.08,
    w_friston FLOAT DEFAULT 0.17,
    w_levin FLOAT DEFAULT 0.25,
    w_hoffman FLOAT DEFAULT 0.22,
    w_watson FLOAT DEFAULT 0.20,
    w_synergy FLOAT DEFAULT 0.08,
    
    -- Validation
    active BOOLEAN DEFAULT TRUE,
    validated_date DATE,
    validation_vep_improvement FLOAT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT weights_sum_check CHECK (
        ABS(w_penrose + w_friston + w_levin + w_hoffman + w_watson + w_synergy - 1.0) < 0.01
    )
);

-- Insert default weights from Monte Carlo validation
INSERT INTO c2ai.layer_weights (config_name, w_penrose, w_friston, w_levin, w_hoffman, w_watson, w_synergy, validated_date, validation_vep_improvement)
VALUES ('default', 0.08, 0.17, 0.25, 0.22, 0.20, 0.08, '2025-12-15', 0.60)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE c2ai.layer_weights IS 'Configuration of layer contribution weights';

-- ───────────────────────────────────────────────────────────────────────────
-- VIEWS
-- ───────────────────────────────────────────────────────────────────────────

-- View: Latest free energy by section
CREATE OR REPLACE VIEW c2ai.v_latest_free_energy AS
SELECT DISTINCT ON (section)
    section,
    timestamp,
    free_energy_value,
    kl_divergence,
    action_recommended,
    action_urgency
FROM c2ai.free_energy_logs
ORDER BY section, timestamp DESC;

-- View: Active goals by section
CREATE OR REPLACE VIEW c2ai.v_active_goals AS
SELECT 
    section,
    goal_name,
    goal_category,
    AVG(confidence) as avg_confidence,
    COUNT(*) as detection_count,
    MAX(timestamp) as last_detected
FROM c2ai.bioelectric_goals
WHERE timestamp > CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY section, goal_name, goal_category
ORDER BY section, avg_confidence DESC;

-- View: Decision summary by day
CREATE OR REPLACE VIEW c2ai.v_decision_summary AS
SELECT 
    DATE(timestamp) as decision_date,
    section,
    decision_type,
    COUNT(*) as decision_count,
    AVG(confidence) as avg_confidence,
    SUM(CASE WHEN executed THEN 1 ELSE 0 END) as executed_count,
    AVG(expected_vep_impact) as avg_expected_impact,
    AVG(outcome_vep_impact) as avg_actual_impact
FROM c2ai.orchestrator_decisions
GROUP BY DATE(timestamp), section, decision_type
ORDER BY decision_date DESC, section;

-- View: Layer performance
CREATE OR REPLACE VIEW c2ai.v_layer_performance AS
SELECT 
    layer,
    metric_type,
    AVG(value) as avg_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    COUNT(*) as sample_count,
    MAX(timestamp) as last_updated
FROM c2ai.performance_metrics
WHERE timestamp > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY layer, metric_type
ORDER BY layer, metric_type;

-- ───────────────────────────────────────────────────────────────────────────
-- FUNCTIONS
-- ───────────────────────────────────────────────────────────────────────────

-- Function: Calculate weighted decision score
CREATE OR REPLACE FUNCTION c2ai.calculate_decision_score(
    p_friston_score FLOAT,
    p_levin_score FLOAT,
    p_watson_score FLOAT,
    p_hoffman_score FLOAT,
    p_penrose_score FLOAT
) RETURNS FLOAT AS $$
DECLARE
    v_weights RECORD;
    v_score FLOAT;
BEGIN
    SELECT * INTO v_weights FROM c2ai.layer_weights WHERE active = TRUE LIMIT 1;
    
    v_score := (
        COALESCE(p_penrose_score, 0) * v_weights.w_penrose +
        COALESCE(p_friston_score, 0) * v_weights.w_friston +
        COALESCE(p_levin_score, 0) * v_weights.w_levin +
        COALESCE(p_hoffman_score, 0) * v_weights.w_hoffman +
        COALESCE(p_watson_score, 0) * v_weights.w_watson
    );
    
    RETURN ROUND(v_score::numeric, 4);
END;
$$ LANGUAGE plpgsql;

-- Function: Get goal alignment for action
CREATE OR REPLACE FUNCTION c2ai.get_action_alignment(
    p_action TEXT,
    p_section VARCHAR(10)
) RETURNS TABLE (
    goal_name VARCHAR(50),
    alignment_score FLOAT,
    explanation TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bg.goal_name,
        CASE 
            WHEN p_action = ANY(bp.action_support) THEN bg.confidence
            WHEN p_action = ANY(bp.action_harm) THEN -bg.confidence
            ELSE 0.0
        END as alignment_score,
        CASE 
            WHEN p_action = ANY(bp.action_support) THEN 'Supports goal: ' || bp.meaning
            WHEN p_action = ANY(bp.action_harm) THEN 'Contradicts goal: ' || bp.meaning
            ELSE 'Neutral to goal'
        END as explanation
    FROM c2ai.bioelectric_goals bg
    JOIN c2ai.bioelectric_patterns bp ON bg.goal_name = bp.pattern_name
    WHERE bg.section = p_section
    AND bg.timestamp > CURRENT_TIMESTAMP - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────────────────────────
-- PERMISSIONS
-- ───────────────────────────────────────────────────────────────────────────

-- Grant permissions to citrusmax_user (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'citrusmax_user') THEN
        GRANT USAGE ON SCHEMA c2ai TO citrusmax_user;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA c2ai TO citrusmax_user;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA c2ai TO citrusmax_user;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA c2ai TO citrusmax_user;
    END IF;
END $$;

-- ───────────────────────────────────────────────────────────────────────────
-- VALIDATION
-- ───────────────────────────────────────────────────────────────────────────

-- Verify all tables created
DO $$
DECLARE
    v_table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_table_count
    FROM information_schema.tables 
    WHERE table_schema = 'c2ai';
    
    IF v_table_count >= 10 THEN
        RAISE NOTICE 'C²AI Schema created successfully with % tables', v_table_count;
    ELSE
        RAISE WARNING 'Expected 10 tables, found %', v_table_count;
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- END OF C²AI SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════
