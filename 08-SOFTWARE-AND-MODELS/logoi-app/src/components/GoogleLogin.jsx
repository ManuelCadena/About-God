export function GoogleSignIn({ onLoginSuccess }) {
  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={() => {
          alert('Botón de prueba - Google OAuth no está cargando');
        }}
        style={{
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.49a4.77 4.77 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
          <path fill="#EA4335" d="M8.98 4.95c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-2.47z"/>
        </svg>
        Sign in with Google (Test)
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Debug info:</p>
        <p>window.google: {typeof window.google !== 'undefined' ? 'LOADED' : 'NOT LOADED'}</p>
        <p>window.google?.accounts?.id: {typeof window.google?.accounts?.id !== 'undefined' ? 'AVAILABLE' : 'NOT AVAILABLE'}</p>
      </div>
    </div>
  );
}
