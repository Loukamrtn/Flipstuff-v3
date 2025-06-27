/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";
import { supabase } from '../../../supabaseClient';
import { Link } from "react-router-dom";
import googleLogo from '../../../assets/images/small-logos/logo-google.svg';
import discordLogo from '../../../assets/images/small-logos/logo-discord.svg';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #23141c 60%, #442536 100%)',
    }}>
      <div style={{
        background: 'rgba(44, 20, 34, 0.85)',
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 #ff4fa340',
        padding: '2.5rem 2rem',
        minWidth: 340,
        maxWidth: 380,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1.5px solid #ff4fa3',
      }}>
        <h1 style={{
          color: '#ff4fa3',
          fontWeight: 900,
          fontSize: '2.1rem',
          marginBottom: 8,
          letterSpacing: '0.04em',
        }}>Connexion</h1>
        <p style={{ color: '#ffd3ea', marginBottom: 28, fontSize: '1.08rem', textAlign: 'center' }}>
          Connecte-toi à Flipstuff pour accéder à ton dashboard sneakers !
        </p>
        <button
          type="button"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })}
          style={{
            width: '100%',
            background: '#fff',
            color: '#23141c',
            border: 'none',
            borderRadius: 16,
            padding: '13px 0',
            fontWeight: 700,
            fontSize: '1.09rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 4px 18px 0 #ff4fa330',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'background 0.18s, box-shadow 0.18s, color 0.18s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.boxShadow = '0 6px 24px 0 #ff4fa355'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 18px 0 #ff4fa330'; }}
        >
          <img src={googleLogo} alt="Google" style={{ width: 24, height: 24, marginRight: 8, display: 'block' }} />
          Continuer avec Google
        </button>
        <button
          type="button"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin + '/auth/callback' } })}
          style={{
            width: '100%',
            background: '#5865F2',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '13px 0',
            fontWeight: 700,
            fontSize: '1.09rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 4px 18px 0 #5865F230',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            transition: 'background 0.18s, box-shadow 0.18s, color 0.18s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#4752c4'; e.currentTarget.style.boxShadow = '0 6px 24px 0 #5865F255'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#5865F2'; e.currentTarget.style.boxShadow = '0 4px 18px 0 #5865F230'; }}
        >
          <img src={discordLogo} alt="Discord" style={{ width: 24, height: 24, marginRight: 8, display: 'block', background: 'transparent' }} />
          Continuer avec Discord
        </button>
        <div style={{
          width: '100%',
          borderBottom: '1px solid #ff4fa355',
          margin: '18px 0 18px 0',
          textAlign: 'center',
          position: 'relative',
        }}>
          <span style={{
            background: 'rgba(44, 20, 34, 0.85)',
            color: '#ffd3ea',
            padding: '0 12px',
            position: 'relative',
            top: 10,
            fontSize: '0.98rem',
          }}>
            ou avec ton email
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: '1.5px solid #ff4fa3',
              marginBottom: 18,
              background: 'rgba(255,255,255,0.10)',
              color: '#fff',
              fontSize: '1.07rem',
              outline: 'none',
              boxShadow: '0 2px 16px 0 #e7125d22',
              backdropFilter: 'blur(6px)',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
            onFocus={e => e.target.style.border = '2px solid #ff4fa3'}
            onBlur={e => e.target.style.border = '1.5px solid #ff4fa3'}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: '1.5px solid #ff4fa3',
              marginBottom: 8,
              background: 'rgba(255,255,255,0.10)',
              color: '#fff',
              fontSize: '1.07rem',
              outline: 'none',
              boxShadow: '0 2px 16px 0 #e7125d22',
              backdropFilter: 'blur(6px)',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
            onFocus={e => e.target.style.border = '2px solid #ff4fa3'}
            onBlur={e => e.target.style.border = '1.5px solid #ff4fa3'}
          />
          <div style={{ width: '100%', textAlign: 'right', marginBottom: 10 }}>
            <Link
              to="/authentication/reset-password"
              style={{
                color: '#ff4fa3',
                fontWeight: 600,
                fontSize: '0.98rem',
                textDecoration: 'none',
                transition: 'color 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ff8c68'}
              onMouseOut={e => e.currentTarget.style.color = '#ff4fa3'}
            >
              Mot de passe oublié&nbsp;?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '13px 0',
              fontWeight: 'bold',
              fontSize: '1.08rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #ff4fa340',
              marginBottom: 10,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        {error && <div style={{ color: '#e7125d', marginTop: 8, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
        <div style={{ marginTop: 24, color: '#fff', fontSize: '0.98rem' }}>
          Pas encore de compte ?{' '}
          <Link to="/authentication/sign-up" style={{ color: '#ff4fa3', fontWeight: 600, textDecoration: 'none' }}>Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
