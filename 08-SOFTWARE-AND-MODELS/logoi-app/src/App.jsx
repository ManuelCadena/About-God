import { useState } from 'react';
import React from 'react';
import { AuthProvider } from './components/AuthProvider';
import { GoogleSignIn } from './components/GoogleLogin';
import LogosHumano from './components/LogosHumano';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Debug: Verificar si Google está cargando
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.google) {
        setError('Google script no cargado');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AuthProvider>
      <div className="app">
        {user ? (
          <div>
            <header className="app-header">
              <div className="user-info">
                <img src={user.picture} alt={user.name} className="user-avatar" />
                <span>Bienvenido, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar sesión
                </button>
              </div>
            </header>
            <LogosHumano />
          </div>
        ) : (
          <div className="login-container">
            <h1>LOGOI - Sistema Operativo de Consciencia</h1>
            <p>Por favor inicia sesión con Google para continuar</p>
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            <div style={{border: '2px solid yellow', padding: '20px', margin: '20px'}}>
              <p>TEST: ¿Ves este recuadro amarillo?</p>
              <GoogleSignIn onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}
