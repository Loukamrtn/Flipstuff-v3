import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if (!canResend && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [canResend, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!canResend) return;
    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    setLoading(true);
    setCanResend(false);
    setTimer(120);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message || "Erreur lors de l'envoi du mail de réinitialisation.");
      setLoading(false);
      setCanResend(true);
      setTimer(0);
      return;
    }
    setMessage("Un lien de réinitialisation a été envoyé à votre adresse email si elle existe dans notre base de données.");
    setLoading(false);
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
          textAlign: 'center',
          width: '100%',
        }}>Réinitialiser le mot de passe</h1>
        <p style={{ color: '#ffd3ea', marginBottom: 28, fontSize: '1.08rem', textAlign: 'center', width: '100%' }}>
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
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
          <button
            type="submit"
            disabled={loading || !canResend}
            style={{
              width: '100%',
              background: loading || !canResend ? '#bfa2c8' : 'linear-gradient(90deg, #ff4fa3 0%, #e7125d 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '13px 0',
              fontWeight: 'bold',
              fontSize: '1.08rem',
              letterSpacing: '0.04em',
              cursor: loading || !canResend ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 12px #ff4fa340',
              marginBottom: 10,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {loading
              ? 'Envoi en cours...'
              : canResend
                ? (message ? 'Renvoyer le lien de réinitialisation' : 'Recevoir le lien de réinitialisation')
                : `Renvoyer dans ${timer}s`}
          </button>
        </form>
        {message && <div style={{ color: '#4fffad', marginTop: 16, fontWeight: 500, textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: '#e7125d', marginTop: 16, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
        <div style={{ marginTop: 28, color: '#fff', fontSize: '0.98rem' }}>
          <Link to="/authentication/sign-in" style={{ color: '#ff4fa3', fontWeight: 600, textDecoration: 'none' }}>Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
} 