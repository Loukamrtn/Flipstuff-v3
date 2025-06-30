import { useAuth } from "context/AuthContext";
import { Redirect, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function PrivateRoute({ component: Component, adminOnly = false, ...rest }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(adminOnly);

  useEffect(() => {
    const fetchRank = async () => {
      if (!user || !adminOnly) { setChecking(false); return; }
      const { data } = await supabase
        .from('profile')
        .select('rang')
        .eq('id', user.id)
        .single();
      setIsAdmin(data?.rang === 'admin');
      setChecking(false);
    };
    fetchRank();
  }, [user, adminOnly]);

  if (loading || checking) return null;
  if (!user) return <Redirect to="/authentication/sign-in" />;
  if (adminOnly && !isAdmin) return <Redirect to="/dashboard" />;
  return <Route {...rest} render={props => <Component {...props} />} />;
}

export function PublicRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Route
      {...rest}
      render={props =>
        !user ? <Component {...props} /> : <Redirect to="/dashboard" />
      }
    />
  );
} 