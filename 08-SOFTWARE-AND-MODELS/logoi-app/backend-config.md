# Configuración Backend para Validación de Tokens Google OAuth

## Credenciales Guardadas:
- **Client ID**: <REDACTED>
- **Client Secret**: <REDACTED>
- **Project ID**: logos-486606

## Implementación Backend Sugerida:

### Endpoint para validar token:
```javascript
// Ejemplo en Node.js/Express
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  '<REDACTED_GOOGLE_CLIENT_ID>'
);

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '<REDACTED_GOOGLE_CLIENT_ID>'
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Token inválido');
  }
}
```

### Variables de Entorno:
```bash
GOOGLE_CLIENT_ID=<REDACTED_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<REDACTED_GOOGLE_CLIENT_SECRET>
```

## Seguridad:
- Nunca exponer el Client Secret en el frontend
- Usar siempre HTTPS en producción
- Validar tokens en el backend antes de procesar solicitudes sensibles
