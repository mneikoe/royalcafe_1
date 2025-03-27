import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
