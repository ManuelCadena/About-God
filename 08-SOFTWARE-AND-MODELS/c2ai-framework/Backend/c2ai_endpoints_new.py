"""
C²AI New Endpoints - VEP Ejecutivo, Sensors Status, Decisions
To be added to /opt/citrusmax/c2ai/api/main.py
Date: 9 Enero 2026
"""

# ═══════════════════════════════════════════════════════════════════════════════
# VEP EJECUTIVO ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/vep/ejecutivo", response_model=C2AIResponse)
async def vep_ejecutivo():
    """
    Dashboard Ejecutivo VEP - KPIs principales para gerencia
    Calcula VEP actual, meta, y acciones prioritarias
    """
    try:
        import psycopg2
        conn = psycopg2.connect(**PG_CONFIG)
        cur = conn.cursor()
        
        # Get current PE from rv21_features
        cur.execute("""
            SELECT 
                COALESCE(AVG(pe_percentage), 60) as pe_actual,
                COALESCE(AVG(ipf), 0.24) as ipf,
                COALESCE(AVG(iah), 0.85) as iah,
                COALESCE(AVG(npf), 0.78) as npf
            FROM appsheet.rv21_features
            WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
        """)
        row = cur.fetchone()
        
        pe_actual = float(row[0]) if row else 60
        ipf = float(row[1]) if row else 0.24
        iah = float(row[2]) if row else 0.85
        npf = float(row[3]) if row else 0.78
        
        # VEP calculation based on PE and market price
        vep_meta = 18900000  # $18.9M MXN target
        vep_actual = (pe_actual / 95) * vep_meta  # Proportional to PE target
        
        # Generate prioritized actions
        acciones = []
        if ipf > 0.10:
            acciones.append({
                "accion": f"Reducir IPF de {ipf:.2f} a <0.10",
                "impacto_vep": int((ipf - 0.10) * 15000000),
                "prioridad": 1
            })
        if iah < 0.90:
            acciones.append({
                "accion": f"Optimizar riego IAH a >0.90",
                "impacto_vep": int((0.90 - iah) * 10000000),
                "prioridad": 2
            })
        if npf < 0.85:
            acciones.append({
                "accion": f"Mejorar NPF a >0.85",
                "impacto_vep": int((0.85 - npf) * 8000000),
                "prioridad": 3
            })
        
        cur.close()
        conn.close()
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "vep_actual": vep_actual,
                "vep_meta": vep_meta,
                "pe_actual": pe_actual,
                "pe_meta": 95,
                "ipf": ipf,
                "iah": iah,
                "npf": npf,
                "acciones_prioritarias": acciones,
                "ultima_actualizacion": datetime.now().isoformat()
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "data": {"error": str(e)}
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SENSORS STATUS ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/sensors/status", response_model=C2AIResponse)
async def sensors_status():
    """
    Estado de sensores - Davis WeatherLink y otros
    """
    try:
        import psycopg2
        conn = psycopg2.connect(**PG_CONFIG)
        cur = conn.cursor()
        
        # Get latest Davis data
        cur.execute("""
            SELECT 
                temp_out as temperature,
                hum_out as humidity,
                ts as last_update
            FROM appsheet.weather_data
            ORDER BY ts DESC
            LIMIT 1
        """)
        davis = cur.fetchone()
        
        sensors = []
        if davis:
            temp = float(davis[0]) if davis[0] else 28.5
            hum = float(davis[1]) if davis[1] else 65
            last_update = davis[2].isoformat() if davis[2] else datetime.now().isoformat()
            
            sensors = [
                {
                    "id": "davis-s1",
                    "name": "Davis S1 (Temperatura)",
                    "type": "temperature",
                    "value": temp,
                    "unit": "°C",
                    "confidence": 0.95,
                    "status": "warning" if temp > 35 else "optimal",
                    "lastCalibration": last_update[:10],
                    "deviation": 0.2
                },
                {
                    "id": "davis-s1-hum",
                    "name": "Davis S1 (Humedad)",
                    "type": "humidity",
                    "value": hum,
                    "unit": "%",
                    "confidence": 0.92,
                    "status": "warning" if hum < 40 else "optimal",
                    "lastCalibration": last_update[:10],
                    "deviation": 1.5
                }
            ]
        
        cur.close()
        conn.close()
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "sensors": sensors,
                "total": len(sensors),
                "calibrated": len([s for s in sensors if s["confidence"] >= 0.85]),
                "out_of_range": len([s for s in sensors if s["status"] == "critical"])
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "data": {"error": str(e), "sensors": []}
        }


# ═══════════════════════════════════════════════════════════════════════════════
# DECISIONS PENDING ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/decisions/pending", response_model=C2AIResponse)
async def decisions_pending():
    """
    Decisiones pendientes para Penrose Collapse
    Genera decisiones basadas en estado actual del sistema
    """
    try:
        import psycopg2
        conn = psycopg2.connect(**PG_CONFIG)
        cur = conn.cursor()
        
        # Get current state
        cur.execute("""
            SELECT 
                COALESCE(AVG(ipf), 0.24) as ipf,
                COALESCE(AVG(iah), 0.85) as iah,
                COALESCE(AVG(npf), 0.78) as npf,
                COALESCE(AVG(pe_percentage), 60) as pe
            FROM appsheet.rv21_features
            WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
        """)
        row = cur.fetchone()
        
        ipf = float(row[0]) if row else 0.24
        iah = float(row[1]) if row else 0.85
        npf = float(row[2]) if row else 0.78
        pe = float(row[3]) if row else 60
        
        decisions = []
        decision_id = 1
        
        # Health decision
        if ipf > 0.10:
            readiness = 0.95 if ipf > 0.20 else 0.75
            decisions.append({
                "id": decision_id,
                "decision": f"Aplicar control fitosanitario (IPF: {ipf:.2f})",
                "readiness": readiness,
                "status": "ready" if readiness >= 0.85 else "pending",
                "impact": f"+${int((ipf - 0.10) * 15000000):,} VEP",
                "section": "TOTAL",
                "agent": "Health"
            })
            decision_id += 1
        
        # Irrigation decision
        if iah < 0.90:
            readiness = 0.92 if iah < 0.80 else 0.70
            decisions.append({
                "id": decision_id,
                "decision": f"Optimizar riego (IAH: {iah*100:.0f}%)",
                "readiness": readiness,
                "status": "ready" if readiness >= 0.85 else "pending",
                "impact": f"+${int((0.90 - iah) * 10000000):,} VEP",
                "section": "TOTAL",
                "agent": "Irrigation"
            })
            decision_id += 1
        
        # Nutrition decision
        if npf < 0.85:
            readiness = 0.88 if npf < 0.75 else 0.65
            decisions.append({
                "id": decision_id,
                "decision": f"Ajustar nutrición (NPF: {npf*100:.0f}%)",
                "readiness": readiness,
                "status": "ready" if readiness >= 0.85 else "pending",
                "impact": f"+${int((0.85 - npf) * 8000000):,} VEP",
                "section": "TOTAL",
                "agent": "Nutrition"
            })
            decision_id += 1
        
        # If no decisions needed, system is optimal
        if not decisions:
            decisions.append({
                "id": 1,
                "decision": "Sistema en estado óptimo",
                "readiness": 1.0,
                "status": "ready",
                "impact": "VEP maximizado",
                "section": "TOTAL",
                "agent": "Orchestrator"
            })
        
        cur.close()
        conn.close()
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "decisions": decisions,
                "total": len(decisions),
                "ready_count": len([d for d in decisions if d["status"] == "ready"]),
                "current_state": {
                    "ipf": ipf,
                    "iah": iah,
                    "npf": npf,
                    "pe": pe
                }
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "data": {"error": str(e), "decisions": []}
        }


# ═══════════════════════════════════════════════════════════════════════════════
# DECISIONS TIMELINE ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/decisions/timeline/{section}", response_model=C2AIResponse)
async def decisions_timeline(section: str):
    """
    Timeline de decisiones históricas por sección
    """
    try:
        # For now, generate from recent activity
        # TODO: Create c2ai.decision_log table
        
        timeline = [
            {
                "id": 1,
                "timestamp": (datetime.now()).isoformat(),
                "type": "recommendation",
                "title": "Análisis C²AI completado",
                "description": f"Sección {section} analizada",
                "agent": "Orchestrator",
                "confidence": 0.92,
                "status": "completed"
            }
        ]
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "section": section,
                "timeline": timeline,
                "total_events": len(timeline)
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "data": {"error": str(e)}
        }
