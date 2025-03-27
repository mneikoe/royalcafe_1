import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log authentication status for debugging
    /*if (!loading) {
      console.log("Auth state:", {
        isAuthenticated: !!user,
        userRole: user?.role,
        requiredRole,
      });
    }*/
  }, [loading, user, requiredRole]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to their appropriate dashboard based on role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // User is authenticated and has required role (if any)
  return children;
};
