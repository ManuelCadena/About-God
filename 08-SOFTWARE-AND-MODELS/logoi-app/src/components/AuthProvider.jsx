import { GoogleOAuthProvider } from '@react-oauth/google';

// Project ID: logos-486606
// Dominio: logoilab.com
// Para obtener el Client ID:
// 1. Ve a https://console.cloud.google.com/
// 2. Selecciona el proyecto "logos-486606"
// 3. Ve a APIs & Services > Credentials
// 4. Crea OAuth 2.0 Client ID si no existe
// 5. Configura Authorized redirect URIs:
//    - https://logoilab.com
//    - https://www.logoilab.com
// 6. Copia el Client ID aquí
const GOOGLE_CLIENT_ID = '<REDACTED_GOOGLE_CLIENT_ID>';

export function AuthProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
