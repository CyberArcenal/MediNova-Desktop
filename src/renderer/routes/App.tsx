// src/routes/App.tsx
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import HelpPage from "../pages/help";
import authAPI from "../api/core/auth";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";
import ClientList from "../pages/clients";
import ClientAnalyticsPage from "../pages/clients/analytics";
import AppointmentsListPage from "../pages/appointments/list";
import AppointmentsCalendarPage from "../pages/appointments/calendar";
import TreatmentsListPage from "../pages/treatments/list";
import CategoriesPage from "../pages/treatments/categories";

// ─── Generic Placeholder (for pages not yet built) ─────────────
const PlaceholderPage = ({
  title,
  message,
}: {
  title: string;
  message?: string;
}) => {
  const location = window.location.pathname;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-[#9146ff]/10 flex items-center justify-center">
        <span className="text-4xl">🚧</span>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#a970ff] bg-clip-text text-transparent mb-3">
        {title}
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md mb-6">
        {message ||
          "This page is under construction. It will be available soon."}
      </p>
      <div className="text-xs text-[#5e5e6b] bg-[var(--card-bg)] px-3 py-1 rounded-full">
        Route: {location}
      </div>
    </div>
  );
};

// ─── Auth Guard (redirect to login if not authenticated) ────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authAPI.isLoggedIn();
        setIsAuthenticated(result);
        if (!result) navigate("/login", { replace: true });
      } catch (err) {
        console.error("Auth check failed", err);
        navigate("/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-[#9146ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

// ─── Main App ────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    if (typeof window.backendAPI?.notifyAppReady === "function") {
      window.backendAPI.notifyAppReady();
      console.log("Notified main process: renderer is ready");
    }
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Protected routes (require login) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients/list" element={<ClientList />} />
        <Route path="/clients/add" element={<ClientList />} />
        <Route path="/clients/analytics" element={<ClientAnalyticsPage />} />
        <Route path="/appointments/list" element={<AppointmentsListPage />} />
        <Route path="/appointments/create" element={<AppointmentsListPage />} />
        <Route
          path="/appointments/calendar"
          element={<AppointmentsCalendarPage />}
        />
        <Route path="/treatments/list" element={<TreatmentsListPage />} />
        <Route path="/treatments/add" element={<TreatmentsListPage />} />
        <Route path="/treatments/categories" element={<CategoriesPage />} />
        <Route path="/treatments/categories/add" element={<CategoriesPage />} />
        {/* 404 – must be last */}
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="404 - Not Found"
              message="The page you're looking for doesn't exist."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
