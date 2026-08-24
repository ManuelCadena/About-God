# GUÍA DE INSTALACIÓN Y DEPLOYMENT — LOGOS

> **Documento:** SRS-DEPLOY-001  
> **Estándar:** IEEE 830 / ISO/IEC/IEEE 26512  
> **Versión:** 3.3.0  
> **Autor:** Dr. José Manuel Cadena Ortiz de Montellano  
> **Framework:** Cadena Strategic Systems  
> **Fecha:** 2026-02-09

---

## Índice

1. [Requisitos del Sistema](#1-requisitos-del-sistema)
2. [Instalación Local](#2-instalación-local)
3. [Desarrollo Local](#3-desarrollo-local)
4. [Build para Producción](#4-build-para-producción)
5. [Deployment a Servidor M5](#5-deployment-a-servidor-m5)
6. [Configuración NGINX](#6-configuración-nginx)
7. [Backend API (Express + PostgreSQL)](#7-backend-api-express--postgresql)
8. [SSL / Certificados](#8-ssl--certificados)
9. [Opciones Alternativas de Hosting](#9-opciones-alternativas-de-hosting)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Requisitos del Sistema

### 1.1 Desarrollo Local

| Requisito | Versión Mínima | Recomendada |
|-----------|---------------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Git | 2.x | Última |
| Navegador | Chrome 90+ | Chrome/Firefox última |

### 1.2 Servidor de Producción

| Requisito | Versión | Descripción |
|-----------|---------|-------------|
| NGINX | 1.24+ | Servidor web / reverse proxy |
| Node.js | 18+ | Para backend API |
| PostgreSQL | 14+ | Base de datos |
| Let's Encrypt | — | Certificados SSL |
| SSH | — | Acceso remoto |

---

## 2. Instalación Local

```bash
# Clonar o acceder al proyecto
cd /Users/manuelcadena/CascadeProjects/logos

# Instalar dependencias
npm install

# Verificar instalación
npm run build
```

### 2.1 Dependencias de Producción

```json
{
  "@elevenlabs/react": "^0.14.0",
  "@supabase/supabase-js": "^2.x",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.13.0",
  "recharts": "^2.12.7"
}
```

### 2.2 Dependencias de Desarrollo

```json
{
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "typescript": "^5.3.3",
  "vite": "^5.4.0"
}
```

---

## 3. Desarrollo Local

```bash
# Iniciar servidor de desarrollo con HMR
npm run dev
# → http://localhost:5173

# Preview del build de producción
npm run preview
# → http://localhost:4173
```

### 3.1 Variables de Entorno

El frontend usa variables hardcodeadas en `src/services/supabase.js`:

```javascript
const SUPABASE_URL = 'https://qfqgplopnwxilnyeajbt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_...';
```

> **Nota:** En producción estas podrían moverse a variables de entorno de Vite (`VITE_SUPABASE_URL`).

---

## 4. Build para Producción

```bash
npm run build
```

**Output:** `dist/` con la siguiente estructura:

```
dist/
├── index.html              # HTML con referencias a assets
├── logo.png                # Logo PNG (desde public/)
├── logo.svg                # Logo SVG (desde public/)
└── assets/
    ├── index-XXXXXXXX.js   # Bundle JS (hash para cache busting)
    ├── index-XXXXXXXX.js.map  # Source map
    └── index-XXXXXXXX.css  # Estilos compilados
```

**Tamaño típico del bundle:**
- JS: ~1.4 MB (389 KB gzip)
- CSS: ~6 KB (2 KB gzip)

---

## 5. Deployment a Servidor M5

### 5.1 Deploy Frontend (2 comandos)

```bash
# 1. Build local
cd /Users/manuelcadena/CascadeProjects/logos && npm run build

# 2. Upload a servidor
rsync -avz --delete dist/ m5:/opt/logoilab/frontend/dist/
```

**No se requiere reiniciar NGINX.** Los archivos se sirven inmediatamente.

### 5.2 Deploy Backend (2 comandos)

```bash
# 1. Upload código (excluir node_modules, .env, logs)
rsync -avz --exclude='node_modules' --exclude='.env' --exclude='logs' \
  /Users/manuelcadena/CascadeProjects/logos-backend/ m5:/opt/logoilab/logos-backend/

# 2. Reiniciar servicio
ssh m5 "sudo systemctl restart logos-backend"
```

### 5.3 Configuración SSH

El host `m5` debe estar configurado en `~/.ssh/config`:

```
Host m5
    HostName <IP_DEL_SERVIDOR>
    User ec2-user
    IdentityFile ~/.ssh/id_ed25519_m5
```

### 5.4 Estructura en el Servidor

```
/opt/logoilab/
├── frontend/        # Frontend React
│   └── dist/        # ← Archivos servidos por NGINX
│       ├── index.html
│       ├── logo.png
│       ├── logo.svg
│       └── assets/
│           ├── index-XXXXXXXX.js
│           └── index-XXXXXXXX.css
├── logos-backend/   # Backend Multi-Canal (systemd: logos-backend)
│   ├── server.js    # Entry point (port 3100)
│   ├── package.json
│   ├── .env         # Variables de entorno (no versionado)
│   └── src/
│       ├── config/env.js
│       ├── db/postgres.js
│       ├── db/migrate.sql
│       ├── services/logos-agent.mjs      # OpenAI Agents SDK (12 tools)
│       ├── services/elevenlabs.js        # Voice AI bridge
│       ├── services/twilio-service.js    # WhatsApp/SMS helpers
│       ├── services/metrics-engine.js    # 7-layer pipeline (port)
│       ├── routes/webhook-whatsapp.js    # POST /webhook/whatsapp
│       ├── routes/webhook-voice.js       # POST /webhook/voice
│       ├── routes/webhook-sms.js         # POST /webhook/sms
│       ├── routes/media-stream.js        # WebSocket /media-stream
│       ├── routes/api-user.js            # REST /api/user/*
│       └── utils/
├── api/             # Legacy Express API (port 3200)
├── app/             # Código fuente legacy
└── logs/            # Logs
```

---

## 6. Configuración NGINX

**Archivo:** `/etc/nginx/conf.d/logoilab.conf`

```nginx
server {
    server_name logoilab.com www.logoilab.com;
    
    root /opt/logoilab/frontend/dist;
    index index.html;
    
    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot-webroot;
    }

    # LOGOS Backend — WhatsApp/Voice/SMS webhooks (port 3100)
    location /webhook/ {
        proxy_pass http://127.0.0.1:3100/webhook/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # LOGOS Backend — WebSocket for voice bridge
    location /media-stream {
        proxy_pass http://127.0.0.1:3100/media-stream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # Legacy API proxy (port 3200)
    location /api/ {
        proxy_pass http://127.0.0.1:3200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend SPA — no-cache para siempre servir la última versión
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/logoilab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logoilab.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.logoilab.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = logoilab.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name logoilab.com www.logoilab.com;
    return 404;
}
```

### 6.1 Comandos NGINX

```bash
# Verificar sintaxis
sudo nginx -t

# Recargar configuración
sudo systemctl reload nginx

# Ver logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 7. Backend Multi-Canal (logos-backend)

### 7.1 Servicio systemd

**Archivo:** `/etc/systemd/system/logos-backend.service`

```ini
[Unit]
Description=LOGOS Backend — Multi-channel Bridge
After=network.target postgresql.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/logoilab/logos-backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StartLimitBurst=3
StartLimitIntervalSec=60
Environment=NODE_ENV=production
Environment=PORT=3100

[Install]
WantedBy=multi-user.target
```

### 7.2 Comandos del Servicio

```bash
# Estado
sudo systemctl status logos-backend

# Reiniciar
sudo systemctl restart logos-backend

# Ver logs
sudo journalctl -u logos-backend -f --no-pager -n 50
```

### 7.3 Variables de Entorno Backend (.env)

```env
PORT=3100
NODE_ENV=production

# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:***@db.qfqgplopnwxilnyeajbt.supabase.co:5432/postgres
SUPABASE_URL=https://qfqgplopnwxilnyeajbt.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_***

# OpenAI
OPENAI_API_KEY=<REDACTED>

# ElevenLabs
ELEVENLABS_API_KEY=sk_***
ELEVENLABS_AGENT_ID=agent_0401kgrq0q0kfwx9v29fje7eqd5j

# Twilio
TWILIO_ACCOUNT_SID=AC***
TWILIO_AUTH_TOKEN=***
TWILIO_PHONE_NUMBER=+19788012275
```

### 7.4 Endpoints del Backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/webhook/whatsapp` | Mensajes WhatsApp (Twilio) |
| POST | `/webhook/voice` | Llamadas de voz entrantes |
| POST | `/webhook/whatsapp/voice` | Llamadas WhatsApp voz |
| POST | `/webhook/sms` | Mensajes SMS |
| WS | `/media-stream` | WebSocket audio bridge (ElevenLabs ↔ Twilio) |
| GET | `/api/user/:phone/state` | Estado del usuario |
| GET | `/api/user/:phone/history` | Historial de sesiones |
| POST | `/api/user/:phone/state` | Actualizar estado |
| GET | `/api/health` | Health check |

### 7.5 Base de Datos (Supabase PostgreSQL)

```bash
# Conectar directo
psql "postgresql://postgres:***@db.qfqgplopnwxilnyeajbt.supabase.co:5432/postgres"

# Tablas
\dt
#  profiles
#  channel_users
#  sessions
#  conversations
#  conversation_log
#  daily_snapshots
```

---

## 8. SSL / Certificados

Certificados gestionados por **Let's Encrypt** vía **Certbot**.

```bash
# Renovar certificados
sudo certbot renew

# Verificar expiración
sudo certbot certificates
# Expira: 2026-05-07
```

**Renovación automática:** Configurada vía cron o systemd timer.

---

## 9. Opciones Alternativas de Hosting

### 9.1 Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Configuración:** Vercel detecta Vite automáticamente.

### 9.2 Netlify

```bash
# Build command: npm run build
# Publish directory: dist
# Redirect: /* → /index.html (para SPA)
```

Crear `public/_redirects`:
```
/*    /index.html   200
```

### 9.3 GitHub Pages

```bash
# Agregar base en vite.config.js
export default defineConfig({
  base: '/logos/',
  // ...
})
```

### 9.4 Docker (alternativa)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

> **Nota:** El setup actual NO usa Docker para el frontend. NGINX sirve archivos estáticos directamente.

---

## 10. Troubleshooting

### 10.1 Página no actualiza después de deploy

**Causa:** Cache del navegador.  
**Solución:** Los hashes en los nombres de archivo (`index-XXXXXXXX.js`) garantizan cache busting. Si persiste:
```bash
# Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
# O abrir en modo incógnito
```

### 10.2 Error 502 Bad Gateway

**Causa:** Backend API no está corriendo.  
**Solución:**
```bash
# Verificar estado de procesos PM2
ssh m5 "pm2 list"

# Reiniciar backend (port 3100) o API (port 3000)
ssh m5 "pm2 restart logos-backend"
ssh m5 "pm2 restart logos-api"

# Ver logs de errores
ssh m5 "pm2 logs logos-backend --lines 20 --nostream"
```

### 10.3 Archivos no se actualizan en servidor

**Verificar:**
```bash
# Qué archivos hay en el servidor
ssh m5 "ls -la /opt/logoilab/frontend/dist/assets/"

# Qué HTML se sirve
ssh m5 "grep 'index-' /opt/logoilab/frontend/dist/index.html"

# Verificar NGINX config
ssh m5 "cat /etc/nginx/conf.d/logoilab.conf | grep root"
```

### 10.4 Supabase Auth no funciona

**Verificar:**
1. Supabase project URL y anon key correctos en `src/services/supabase.js`
2. Site URL = `https://logoilab.com` en Supabase Auth settings
3. Redirect URI = `https://qfqgplopnwxilnyeajbt.supabase.co/auth/v1/callback`
4. Google OAuth client configurado en Supabase Dashboard > Authentication > Providers
5. Apple Sign-In configurado con JWT secret (no raw .p8 key)

### 10.5 Backend no responde a WhatsApp

**Verificar:**
```bash
# Servicio corriendo?
ssh m5 "pm2 list | grep logos-backend"

# Ver logs de error
ssh m5 "pm2 logs logos-backend --lines 30 --nostream"

# Reiniciar
ssh m5 "pm2 restart logos-backend"

# NGINX proxy correcto?
ssh m5 "grep -A5 'webhook' /etc/nginx/conf.d/logoilab.conf"
```

### 10.6 PM2 Process Management

```bash
# Ver todos los procesos gestionados por PM2
ssh m5 "pm2 list"

# Procesos LOGOS activos en M5:
#   logos-api      (id: 16) — port 3000 — API REST + PostgreSQL
#   logos-backend  (id: 15) — port 3100 — Multi-channel bridge + AI interpret

# Restart individual
ssh m5 "pm2 restart logos-backend"
ssh m5 "pm2 restart logos-api"

# Restart all
ssh m5 "pm2 restart all"

# Monitor en tiempo real
ssh m5 "pm2 monit"

# Guardar configuración PM2 (sobrevive reboot)
ssh m5 "pm2 save"
```

---

## Referencias Cruzadas

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Modelo de Datos](./DATA_MODEL.md)
