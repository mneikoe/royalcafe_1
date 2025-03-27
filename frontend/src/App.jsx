import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/Admin";
import MenuPage from "./pages/menu";
import InstantBillOrder from "./pages/InstantBillOrder";

export default function App() {
  // Get stored user data for initial routing decisions
  const location = useLocation();
  const getUserRoleFromStorage = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData).role : null;
  };

  return (
    <AuthProvider>
      {location.pathname !== "/" && <Navbar />}
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute requiredRole="admin">
              <RegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute requiredRole="admin">
              <MenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instant"
          element={
            <ProtectedRoute requiredRole="admin">
              <InstantBillOrder />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate
                to={
                  getUserRoleFromStorage() === "admin"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                }
              />
            </ProtectedRoute>
          }
        />

        {/* User Search */}

        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
