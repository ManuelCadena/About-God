#!/bin/bash
# =============================================================================
# DEPLOY WATSON OPTIMIZER - CitrusMax R2C Watson
# =============================================================================
# Despliega el Watson-Greedy Optimizer al servidor M5 (44.247.163.1)
# Fecha: 4 de Enero 2026
# =============================================================================

set -e

# Configuración
SERVER="44.247.163.1"
USER="ubuntu"
REMOTE_PATH="/opt/citrusmax"
BACKEND_PATH="/opt/citrusmax/citrusmax-ui-v5/backend"
LOCAL_BASE="/Users/manuelcadena/My Drive/Manuel Cadena/New Life/APPS/Finca/CitrusMax AI"

echo "=============================================="
echo "  WATSON OPTIMIZER DEPLOYMENT"
echo "  Server: $SERVER"
echo "  Date: $(date)"
echo "=============================================="

# 1. Sincronizar módulo optimizer principal
echo ""
echo "📦 [1/5] Sincronizando watson_greedy_optimizer.py..."
scp "$LOCAL_BASE/citrusmax_health/optimizer/watson_greedy_optimizer.py" \
    $USER@$SERVER:$REMOTE_PATH/citrusmax_health/optimizer/

# 2. Sincronizar API endpoint
echo ""
echo "📦 [2/5] Sincronizando api_watson_optimizer.py..."
scp "$LOCAL_BASE/citrusmax_health/optimizer/api_watson_optimizer.py" \
    $USER@$SERVER:$REMOTE_PATH/citrusmax_health/optimizer/

# 3. Sincronizar router del backend UI v5
echo ""
echo "📦 [3/5] Sincronizando watson_optimizer.py (router)..."
scp "$LOCAL_BASE/citrusmax-ui-v5/backend/api/routes/watson_optimizer.py" \
    $USER@$SERVER:$BACKEND_PATH/api/routes/

# 4. Actualizar main.py del backend
echo ""
echo "📦 [4/5] Sincronizando main.py actualizado..."
scp "$LOCAL_BASE/citrusmax-ui-v5/backend/main.py" \
    $USER@$SERVER:$BACKEND_PATH/

# 5. Reiniciar servicios
echo ""
echo "🔄 [5/5] Reiniciando servicios en servidor..."
ssh $USER@$SERVER << 'EOF'
    echo "Reiniciando backend citrusmax-ui-v5..."
    cd /opt/citrusmax/citrusmax-ui-v5/backend
    
    # Verificar que el módulo se importa correctamente
    python3 -c "from api.routes.watson_optimizer import router; print('✅ Watson router importado correctamente')"
    
    # Reiniciar servicio si existe
    if systemctl is-active --quiet citrusmax-ui-backend; then
        sudo systemctl restart citrusmax-ui-backend
        echo "✅ Servicio citrusmax-ui-backend reiniciado"
    else
        echo "⚠️ Servicio no encontrado, iniciando manualmente..."
        # Kill proceso existente si hay
        pkill -f "uvicorn main:app" || true
        # Iniciar en background
        nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8501 > /var/log/citrusmax/ui-backend.log 2>&1 &
        echo "✅ Backend iniciado en puerto 8501"
    fi
    
    sleep 3
    
    # Verificar que responde
    curl -s http://localhost:8501/health | python3 -m json.tool | head -10
    
    # Verificar endpoint Watson
    echo ""
    echo "Verificando endpoint Watson..."
    curl -s "http://localhost:8501/api/v1/watson/section/S1" | python3 -m json.tool | head -20
EOF

echo ""
echo "=============================================="
echo "  ✅ DEPLOYMENT COMPLETED"
echo "=============================================="
echo ""
echo "Endpoints disponibles:"
echo "  - GET  /api/v1/watson/section/{S1|S2|S3}"
echo "  - POST /api/v1/watson/optimize"
echo "  - GET  /api/v1/watson/ieia-matrix"
echo "  - GET  /api/v1/watson/finca-config"
echo "  - GET  /api/v1/watson/levers/{section}"
echo ""
echo "Frontend C2AI Watson Panel:"
echo "  - http://$SERVER:5173/c2ai (desarrollo)"
echo "  - http://$SERVER/dashboard (producción)"
echo ""
