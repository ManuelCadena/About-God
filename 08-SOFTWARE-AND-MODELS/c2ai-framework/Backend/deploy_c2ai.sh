#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# C²AI Framework - Deployment Script for M5 Server
# ═══════════════════════════════════════════════════════════════════════════════
# Author: Dr. José Manuel Cadena Ortiz de Montellano
# Date: 29-Jan-2026
# Version: 2.0
# Server: 44.247.163.1 (M5)
# Port: 8001
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}          C²AI Framework - Deployment Script v2.0                  ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

# Configuration
INSTALL_DIR="/opt/citrusmax/c2ai-framework"
SERVICE_NAME="c2ai-api"
PORT=8001
USER="citrusmax"
PG_HOST="44.247.163.1"
PG_DATABASE="citrusmax_biofix"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 1: Create directories
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[1/7] Creating directories...${NC}"
sudo mkdir -p ${INSTALL_DIR}/backend/agents
sudo mkdir -p ${INSTALL_DIR}/backend/sql
sudo mkdir -p ${INSTALL_DIR}/logs
sudo chown -R ${USER}:${USER} ${INSTALL_DIR}
echo -e "${GREEN}✓ Directories created${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 2: Copy files
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[2/7] Copying files...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp -r ${SCRIPT_DIR}/agents/* ${INSTALL_DIR}/backend/agents/
cp ${SCRIPT_DIR}/c2ai_api.py ${INSTALL_DIR}/backend/
cp ${SCRIPT_DIR}/requirements.txt ${INSTALL_DIR}/backend/
cp ${SCRIPT_DIR}/sql/c2ai_schema.sql ${INSTALL_DIR}/backend/sql/
cp ${SCRIPT_DIR}/README.md ${INSTALL_DIR}/backend/
echo -e "${GREEN}✓ Files copied${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 3: Create virtual environment
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[3/7] Setting up Python environment...${NC}"
cd ${INSTALL_DIR}/backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${YELLOW}! Virtual environment exists, skipping${NC}"
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 4: Create environment file
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[4/7] Creating environment configuration...${NC}"
cat > ${INSTALL_DIR}/backend/.env << EOF
# C²AI Framework Environment
PG_HOST=${PG_HOST}
PG_PORT=5432
PG_DATABASE=${PG_DATABASE}
PG_USER=citrusmax_admin
PG_PASSWORD=C1trusM4x2024!
C2AI_PORT=${PORT}
C2AI_LOG_LEVEL=INFO
EOF
chmod 600 ${INSTALL_DIR}/backend/.env
echo -e "${GREEN}✓ Environment file created${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 5: Run database migrations
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[5/7] Running database schema...${NC}"
PGPASSWORD='C1trusM4x2024!' psql -h ${PG_HOST} -U citrusmax_admin -d ${PG_DATABASE} -f ${INSTALL_DIR}/backend/sql/c2ai_schema.sql
echo -e "${GREEN}✓ Database schema applied${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 6: Create systemd service
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[6/7] Creating systemd service...${NC}"
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
[Unit]
Description=C²AI Framework API Server
After=network.target postgresql.service

[Service]
Type=simple
User=${USER}
Group=${USER}
WorkingDirectory=${INSTALL_DIR}/backend
Environment="PATH=${INSTALL_DIR}/backend/venv/bin"
EnvironmentFile=${INSTALL_DIR}/backend/.env
ExecStart=${INSTALL_DIR}/backend/venv/bin/python -m uvicorn c2ai_api:app --host 0.0.0.0 --port ${PORT}
Restart=always
RestartSec=10
StandardOutput=append:${INSTALL_DIR}/logs/c2ai-api.log
StandardError=append:${INSTALL_DIR}/logs/c2ai-api-error.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}
echo -e "${GREEN}✓ Systemd service created${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# Step 7: Configure NGINX
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[7/7] Configuring NGINX...${NC}"

# Check if c2ai location already exists
if ! grep -q "location /c2ai" /etc/nginx/sites-available/citrusmax-harvest 2>/dev/null; then
    sudo tee /etc/nginx/sites-available/c2ai-api > /dev/null << 'EOF'
# C²AI Framework API - Port 8001
# Add this to your main NGINX config or include it

location /c2ai/ {
    proxy_pass http://127.0.0.1:8001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 120s;
    proxy_connect_timeout 120s;
}

location /c2ai-api/ {
    proxy_pass http://127.0.0.1:8001/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 120s;
}
EOF
    echo -e "${YELLOW}! NGINX config created at /etc/nginx/sites-available/c2ai-api${NC}"
    echo -e "${YELLOW}! Include this in your main NGINX config manually${NC}"
else
    echo -e "${GREEN}✓ NGINX already configured${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Start service
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${YELLOW}Starting C²AI service...${NC}"
sudo systemctl start ${SERVICE_NAME}
sleep 3

# Check status
if sudo systemctl is-active --quiet ${SERVICE_NAME}; then
    echo -e "${GREEN}✓ C²AI API is running on port ${PORT}${NC}"
else
    echo -e "${RED}✗ Failed to start C²AI API${NC}"
    sudo systemctl status ${SERVICE_NAME} --no-pager
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Final summary
# ═══════════════════════════════════════════════════════════════════════════════
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}          C²AI Framework Deployment Complete!                      ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "  ${GREEN}✓${NC} API Server:    http://44.247.163.1:${PORT}"
echo -e "  ${GREEN}✓${NC} API Docs:      http://44.247.163.1:${PORT}/c2ai/docs"
echo -e "  ${GREEN}✓${NC} Health Check:  http://44.247.163.1:${PORT}/health"
echo -e "  ${GREEN}✓${NC} Service:       sudo systemctl status ${SERVICE_NAME}"
echo -e "  ${GREEN}✓${NC} Logs:          ${INSTALL_DIR}/logs/"
echo -e ""
echo -e "  ${YELLOW}Agents: 7 | Tools: 29 | Port: ${PORT}${NC}"
echo -e ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

# Test endpoint
echo -e "\n${YELLOW}Testing API...${NC}"
curl -s http://127.0.0.1:${PORT}/health | python3 -m json.tool || echo "API test failed"

echo -e "\n${GREEN}Deployment complete!${NC}"
