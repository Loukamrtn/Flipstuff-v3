import { useAuth } from "context/AuthContext";
import { Redirect, Route } from "react-router-dom";

export function PrivateRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : <Redirect to="/authentication/sign-in" />
      }
    />
  );
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