import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import GrainOverlay from './components/ui/GrainOverlay';
import LoadingScreen from './components/ui/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import AnimatedBackground from './components/ui/AnimatedBackground';
import PageTransition from './components/ui/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import { VerificationProvider } from './context/VerificationContext';
import AIAssistant from './components/ui/AIAssistant';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 2 * 60 * 1000 },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const BookingRedirectHandler: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user?.isMobileVerified) {
      const pendingMsg = sessionStorage.getItem('pendingBookingMsg');
      if (pendingMsg) {
        sessionStorage.removeItem('pendingBookingMsg');
        window.location.href = `https://wa.me/918921757960?text=${encodeURIComponent(pendingMsg)}`;
      }
    }
  }, [isAuthenticated, user]);

  return null;
};

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
        const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      } catch {
        console.warn('Lenis smooth scroll not initialized');
      }
    };
    initLenis();

    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BookingRedirectHandler />
      <CustomCursor />
      <AnimatedBackground />
      <GrainOverlay />
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition pageKey="home"><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition pageKey="login"><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition pageKey="register"><RegisterPage /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition pageKey="dashboard"><DashboardPage /></PageTransition></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageTransition pageKey="profile"><ProfilePage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/login" element={<PageTransition pageKey="admin-login"><AdminLoginPage /></PageTransition>} />
            <Route path="/admin/dashboard" element={<AdminRoute><PageTransition pageKey="admin-dashboard"><AdminDashboardPage /></PageTransition></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      )}
      {!location.pathname.startsWith('/admin') && <AIAssistant />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <VerificationProvider>
            <AuthProvider>
              <AdminAuthProvider>
                <AppContent />
              </AdminAuthProvider>
            </AuthProvider>
          </VerificationProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
