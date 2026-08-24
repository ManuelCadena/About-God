# WINDSURF DEPLOYMENT PROMPT: CitrusMax Conscious AI (C²AI) v1.0
## Ready-to-Deploy Implementation Guide for M5 Server

---

## CONTEXT FOR WINDSURF

You are implementing **Dr. CitrusMax AI v1.0** (C²AI) on Finca La Luz's M5 server (44.247.163.1).

**Current State:**
- PostgreSQL running with 21 schemas, 203 tables
- FastAPI v5.2.0 running on port 8501
- React dashboard on port 3000
- 3 years historical data available
- 27,488 trees, 91,989 records

**Goal:**
Integrate Conscious Citrus AI layers (Friston, Levin, Penrose, Watson, Hoffman) to increase VEP by 60% (+$7.1M/year)

---

## PART 1: DATABASE SCHEMA SETUP

### PROMPT FOR WINDSURF

"Create PostgreSQL schema for C²AI with these tables in database `citrusmax_biofix`:

1. **Table: c2ai.bioelectric_signals**
   - Fields: id (serial PK), tree_id (int FK to appsheet.arboles), timestamp, voltage_meristem (float), voltage_root (float), voltage_fruit (float), coherence_score (float), frequency_dominant_hz (float), synced_at (timestamp default now)
   - Index: (tree_id, timestamp)
   - Purpose: Store 40Hz bioelectric measurements from each tree

2. **Table: c2ai.free_energy_logs**
   - Fields: id (serial), tree_id (int), timestamp, free_energy_value (float), prediction_vector (jsonb), observation_vector (jsonb), kl_divergence (float), action_recommended (jsonb), synced_at (timestamp)
   - Index: (tree_id, timestamp)
   - Purpose: Track Friston layer calculations

3. **Table: c2ai.bioelectric_goals**
   - Fields: id (serial), tree_id (int), timestamp, goal_name (varchar 50), confidence (float), supporting_actions (jsonb), contradicting_actions (jsonb), synced_at (timestamp)
   - Purpose: Log detected bioelectric goals from Levin layer

4. **Table: c2ai.kernel_states**
   - Fields: id (serial), timestamp, complete_state_estimation (jsonb), reconstruction_confidence (float), unresolved_conflicts (int), policy_optimal (jsonb), synced_at (timestamp)
   - Purpose: Store kernel reconstruction results from Hoffman layer

5. **Table: c2ai.orchestrator_decisions**
   - Fields: id (serial), timestamp, decision_type (varchar 50), section (varchar 10), rationale (jsonb), expected_vep_impact (float), confidence (float), executed (boolean default false), actual_outcome (jsonb), synced_at (timestamp)
   - Purpose: Log all decisions made by Dr. CitrusMax

6. **Table: c2ai.energy_landscapes**
   - Fields: id (serial), timestamp, current_state_energy (float), optimal_trajectory (jsonb), trajectory_cost (float), friction_economic (float), friction_resource (float), friction_biological (float), friction_temporal (float), synced_at (timestamp)
   - Purpose: Track energy landscape calculations from Watson layer

Generate CREATE TABLE statements with proper indexes and constraints. Include comments explaining each table's purpose."

---

## PART 2: FRISTON LAYER IMPLEMENTATION

### PROMPT FOR WINDSURF

"Create Python module `friston_layer.py` implementing free energy minimization:

**Structure:**
```python
from dataclasses import dataclass
from typing import Dict, List, Tuple
import numpy as np
import psycopg2
import json

@dataclass
class PlantModel:
    '''Plant's internal expectations about environment'''
    water_mean: float = 0.45
    water_std: float = 0.08
    light_mean: float = 1300
    light_std: float = 200
    temp_mean: float = 28
    temp_std: float = 3
    nutrients_mean: float = 150
    nutrients_std: float = 30

class FristonLayer:
    '''Free Energy Minimization for Active Inference'''
    
    def __init__(self, pg_config: Dict):
        '''Initialize with PostgreSQL connection'''
        # Connect to citrusmax_biofix
        # Load plant model
        # Setup logging
    
    def calculate_free_energy(self, observations: Dict) -> float:
        '''
        F = sum[(obs - pred)^2 / (2σ^2) + log(σ)]
        
        Input observations dict with keys:
        - humidity_pct: 0-100
        - par_μmol: μmol/m²/s
        - temp_c: temperature in Celsius
        - n_ppm: nitrogen in ppm
        
        Output: Free energy scalar (0 = perfect alignment, >1 = high surprise)
        '''
        # Implement KL divergence calculation
        # Return total F
    
    def recommend_actions(self, observations: Dict) -> List[Dict]:
        '''
        Active inference: recommend actions to minimize F
        
        Return list of dicts with keys:
        - type: 'irrigate' | 'reduce_shade' | 'fertilize' | 'increase_et'
        - amount: quantity in appropriate units
        - urgency: 0-10 scale (10 = highest priority)
        - reason: explanation string
        '''
        # For each variable where obs deviates from expectation
        # Generate action to close gap
        # Return sorted by urgency
    
    def log_to_db(self, tree_id: int, F: float, obs: Dict, actions: List[Dict]):
        '''Log calculation to c2ai.free_energy_logs'''
        # INSERT into database
        # COMMIT transaction
    
    async def process_batch(self, tree_ids: List[int], batch_size: int = 100):
        '''
        Process all trees
        
        For each tree:
        1. Load latest weather observation
        2. Calculate F
        3. Generate recommended actions
        4. Log to database
        '''
        # Batch processing logic
        # Async/await for efficiency

# Main execution
if __name__ == '__main__':
    friston = FristonLayer(pg_config={
        'host': '44.247.163.1',
        'database': 'citrusmax_biofix',
        'user': 'postgres',
        'password': input('Password: ')
    })
    
    # Test with example observations
    obs = {
        'humidity_pct': 42,
        'par_μmol': 1200,
        'temp_c': 25,
        'n_ppm': 120
    }
    
    F = friston.calculate_free_energy(obs)
    print(f'Free Energy: {F:.3f}')
    
    actions = friston.recommend_actions(obs)
    print(f'Actions: {actions}')
```

Implement all methods. Use connection pooling. Add error handling and logging. Test with real weather data from `weather.davis_weatherlink_complete`."

---

## PART 3: LEVIN LAYER IMPLEMENTATION

### PROMPT FOR WINDSURF

"Create Python module `levin_layer.py` implementing bioelectric goal detection:

**Key Components:**

1. **BioelectricGoalLibrary class** with PATTERNS dict:
   - 'growth_apical': voltage (-45, -30) mV, 8-12 Hz
   - 'water_seeking': voltage (-90, -70) mV, 4-6 Hz
   - 'flower_readiness': voltage (-35, -20) mV, 6-10 Hz
   - 'defense_activation': voltage (-20, -10) mV, 1-3 Hz
   - 'fruit_maturation': voltage (-50, -40) mV, 10-15 Hz
   
   Each pattern has:
   - location (meristem, root_cap, flower_meristem, etc)
   - voltage_range (tuple)
   - frequency (tuple)
   - meaning (description)
   - phenology_stage (when applies)
   - action_support (list of actions that help)
   - action_harm (list of actions that hurt)

2. **detect_goals_from_bioelectrics(voltage_pattern, phenology) -> List[str]**
   - Input: voltage measurements + current phenology stage
   - Output: List of detected goals with confidence scores
   - Logic: Match voltage patterns against library

3. **calculate_alignment_score(action, detected_goals) -> Tuple[float, str]**
   - Input: proposed action + detected goals
   - Output: alignment score [0,1] + explanation
   - If action in goal['action_support']: +alignment
   - If action in goal['action_harm']: -alignment
   - Return weighted average

4. **get_goal_supporting_actions(goals) -> List[str]**
   - Input: list of detected goals
   - Output: actions that support all goals
   - Logic: Set intersection of supporting actions

Implement with proper async/await. Load voltage data from sensors (simulate with random data initially). Calculate alignment for all 18 agents' recommended actions. Store in c2ai.bioelectric_goals table."

---

## PART 4: WATSON LAYER IMPLEMENTATION

### PROMPT FOR WINDSURF

"Create Python module `watson_layer.py` implementing energy landscape descent:

**Key Components:**

1. **EnergyLandscape class**
   - Method: calculate_total_energy(state, action_trajectory) -> float
     - economic_friction: lost revenue from suboptimal timing (40% weight)
     - resource_friction: inefficient input use (30% weight)
     - biological_friction: stress imposed on plant (20% weight)
     - temporal_friction: days delayed from optimum (10% weight)
   
   - Method: find_minimum_energy_trajectory(initial_state, horizon=90) -> List[Action]
     - Use gradient descent on energy landscape
     - For each day t:
       1. Evaluate energy for each feasible action
       2. Choose action that reduces energy most
       3. Apply action to update state
       4. Continue until no improvement
     - Return action sequence

2. **Friction Calculation Functions**
   - economic_friction(action, state, day): Compare harvest price today vs next 14 days
   - resource_friction(action, state): Penalty for inefficient inputs
   - biological_friction(action, state): Penalty for plant stress
   - temporal_friction(t): Day count away from optimal window

3. **Energy Landscape Visualization**
   - Generate 2D heatmap of energy vs (time, action)
   - Save to database for dashboard display

Input:
- Current farm state (from PostgreSQL)
- Action space (feasible actions for this state)
- Market prices forecast (next 14 days)
- Production predictions

Output:
- Optimal action sequence for next 90 days
- Energy landscape heatmap
- Friction breakdown by component

Store results in c2ai.energy_landscapes table."

---

## PART 5: ORCHESTRATOR IMPLEMENTATION

### PROMPT FOR WINDSURF

"Create `orchestrator.py` (Dr. CitrusMax main controller):

**Class: DrCitrusMaxOrchestrator**

Methods:

1. **async orchestrate_daily_cycle()**
   - Called every morning at 06:00 UTC
   - Execution flow:
     1. get_current_farm_state() from all data sources
     2. run_all_agents() in parallel (phenology, weather, health, etc)
     3. run_friston_layer() - calculate free energy + actions
     4. run_levin_layer() - detect bioelectric goals
     5. run_watson_layer() - compute optimal trajectory
     6. run_hoffman_layer() (existing Meta-MDP)
     7. generate_consolidated_plan() - merge all recommendations
     8. execute_plan() - send to APIs/controllers
     9. log_decision() to c2ai.orchestrator_decisions table
   
   - Return: execution_result dict

2. **get_current_farm_state() -> FarmState dataclass**
   - Load from PostgreSQL:
     - Weather (latest 7 days)
     - Tree inventory (all 27,488)
     - Recent applications
     - Production history
     - Market prices (5 years historical)
   - Return typed object

3. **async run_all_agents(farm_state) -> Dict**
   - Call phenology, weather, health, irrigation, nutrition, harvest, market agents
   - Run in parallel with asyncio.gather()
   - Collect results

4. **generate_consolidated_plan(agent_outputs, friston, levin, watson) -> ActionPlan**
   - Merge all recommendations
   - Resolve conflicts via Meta-MDP (Hoffman)
   - Check alignment with bioelectric goals (Levin)
   - Verify energy landscape compatibility (Watson)
   - Return single unified plan with confidence scores

5. **execute_plan(action_plan) -> ExecutionResult**
   - For each action:
     - Send to appropriate controller (irrigation API, spray scheduler, etc)
     - Log execution
     - Monitor compliance
   - Return success/failure status

6. **log_decision(decision_dict)**
   - INSERT into c2ai.orchestrator_decisions
   - Include: timestamp, decision_type, section, rationale, expected_vep_impact, confidence

Configuration:
- decision_frequency: 'daily' (can be changed to 'hourly')
- optimization_horizon: 90 days
- confidence_threshold: 0.75 (only execute decisions >75% confidence)

Deployment:
- Run as systemd service: `/etc/systemd/system/citrusmax-orchestrator.service`
- Restart on failure
- Daily log rotation
- Health check every 5 minutes

Add comprehensive logging and error handling."

---

## PART 6: FASTAPI ROUTES

### PROMPT FOR WINDSURF

"Create `api_c2ai.py` (FastAPI routes for C²AI):

**Routes:**

```python
@router.get('/api/v1/c2ai/status')
async def c2ai_status():
    '''System health check'''
    return {
        'system': 'Dr. CitrusMax AI',
        'version': '1.0.0',
        'status': 'active',
        'timestamp': datetime.now(),
        'layers': {
            'friston': 'ready',
            'levin': 'ready',
            'penrose': 'ready',
            'watson': 'ready',
            'hoffman': 'ready'
        }
    }

@router.get('/api/v1/c2ai/farm-state')
async def get_farm_state(section: Optional[str] = None):
    '''Get current farm state'''
    state = await orchestrator.get_current_farm_state()
    if section:
        state = filter_by_section(state, section)
    return state

@router.get('/api/v1/c2ai/recommendations/{section}')
async def get_section_recommendations(section: str):
    '''Get C²AI recommendations for section'''
    recommendations = await orchestrator.get_recommendations(section)
    return recommendations

@router.post('/api/v1/c2ai/optimize/vep')
async def optimize_vep(horizon_days: int = 90):
    '''Run VEP optimization'''
    result = await orchestrator.optimize_vep(horizon_days)
    return result

@router.get('/api/v1/c2ai/free-energy/{section}')
async def get_free_energy(section: str):
    '''Get free energy calculations'''
    # Query c2ai.free_energy_logs
    # Return recent F values and trends

@router.get('/api/v1/c2ai/bioelectric-goals/{tree_id}')
async def get_tree_goals(tree_id: int):
    '''Get detected bioelectric goals for tree'''
    # Query c2ai.bioelectric_goals
    # Return goals with confidence

@router.get('/api/v1/c2ai/energy-landscape')
async def get_energy_landscape():
    '''Get energy landscape visualization'''
    # Query c2ai.energy_landscapes
    # Return latest landscape + trajectory

@router.get('/api/v1/c2ai/decisions/history')
async def get_decision_history(
    section: Optional[str] = None,
    days: int = 30
):
    '''Get historical decisions made by Dr. CitrusMax'''
    # Query c2ai.orchestrator_decisions
    # Filter by section and date
    # Return with outcomes

@router.post('/api/v1/c2ai/decisions/{decision_id}/feedback')
async def provide_decision_feedback(decision_id: int, outcome: Dict):
    '''Provide actual outcome to improve learning'''
    # UPDATE c2ai.orchestrator_decisions
    # Set actual_outcome
    # Trigger model refinement
```

Implement with proper authentication (JWT tokens). Add rate limiting. Include comprehensive error handling. Return proper HTTP status codes."

---

## PART 7: TESTING SUITE

### PROMPT FOR WINDSURF

"Create comprehensive test suite for C²AI:

**test_friston_layer.py:**
- test_free_energy_calculation()
- test_action_recommendation()
- test_db_logging()

**test_levin_layer.py:**
- test_goal_detection()
- test_alignment_scoring()
- test_pattern_matching()

**test_watson_layer.py:**
- test_energy_calculation()
- test_trajectory_optimization()
- test_friction_components()

**test_orchestrator.py:**
- test_daily_cycle()
- test_farm_state_loading()
- test_agent_coordination()
- test_decision_logging()

**test_integration.py:**
- End-to-end test with real database
- Simulate 30-day period
- Compare predictions vs actuals

Run pytest with coverage reports. Target >85% code coverage. Use fixtures for database mocking."

---

## PART 8: DEPLOYMENT SCRIPT

### PROMPT FOR WINDSURF

"Create `deploy_c2ai.sh` bash script for M5 server:

**Steps:**
1. SSH to 44.247.163.1
2. Create /opt/citrusmax/c2ai directory
3. Create Python virtual environment
4. Install requirements from requirements_c2ai.txt
5. Create systemd service for orchestrator
6. Create database schema (run schema.sql)
7. Run tests
8. Start orchestrator service
9. Verify health endpoints
10. Setup cron jobs for daily cycles

Include error handling. Log all steps. Provide rollback capability."

---

## PART 9: MONITORING & DASHBOARDS

### PROMPT FOR WINDSURF

"Create React dashboard components for C²AI monitoring:

**Components:**

1. **FreeEnergyChart**
   - Display free energy over time
   - Show trend line
   - Alert when F > threshold

2. **BioelectricGoalsPanel**
   - List detected goals by section
   - Show confidence scores
   - Display supporting/contradicting actions

3. **EnergyLandscapeHeatmap**
   - 2D visualization of energy landscape
   - Show optimal trajectory overlay
   - Interactive time slider

4. **DecisionHistory**
   - Table of recent Dr. CitrusMax decisions
   - Expected vs actual VEP impact
   - Execution status

5. **SystemHealth**
   - Latency metrics
   - Error rates
   - API response times

6. **VEPForecast**
   - 30-day VEP projection
   - Confidence intervals
   - Sensitivity analysis

Add real-time updates via WebSocket. Include data export to CSV."

---

## FINAL CHECKLIST FOR WINDSURF

Before deploying to production:

- [ ] All database tables created with proper indexes
- [ ] Friston layer calculating F correctly (test with known examples)
- [ ] Levin layer detecting goals with >85% accuracy
- [ ] Watson layer finding optimal trajectories (backtesting)
- [ ] Orchestrator coordinating all layers
- [ ] FastAPI routes responding correctly
- [ ] All tests passing (>85% coverage)
- [ ] Systemd service starting/stopping cleanly
- [ ] Dashboard displaying real-time data
- [ ] Logging to file working
- [ ] Error handling comprehensive
- [ ] Performance within SLA (decisions <15 seconds)
- [ ] Database backups configured
- [ ] Monitoring alerts configured

---

## QUICK START (After Deployment)

```bash
# SSH to server
ssh -i ~/.ssh/id_m5 ec2-user@44.247.163.1

# Activate venv
source /opt/citrusmax/c2ai/venv/bin/activate

# Check status
curl http://localhost:8501/api/v1/c2ai/status

# View logs
tail -f /var/log/citrusmax/orchestrator.log

# Run tests
cd /opt/citrusmax/c2ai && pytest tests/ -v

# Trigger optimization manually
curl -X POST http://localhost:8501/api/v1/c2ai/optimize/vep?horizon_days=90
```

---

**Total Implementation Time: 3-4 weeks (1 senior backend + 1 junior)**  
**Expected Go-Live: February 2026**  
**Production Support: 24/7 monitoring required**

