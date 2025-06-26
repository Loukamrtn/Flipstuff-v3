import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function AuthCallback() {
  const history = useHistory();

  useEffect(() => {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(() => {
        history.replace("/dashboard");
      });
    } else {
      // Erreur ou accès direct à la page
      history.replace("/authentication/sign-in");
    }
  }, [history]);

  return <div style={{ color: '#fff', textAlign: 'center', marginTop: 80, fontSize: '1.2rem' }}>Connexion en cours...</div>;
} 