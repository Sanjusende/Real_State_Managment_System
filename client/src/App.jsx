import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import AgentsPage from './pages/public/AgentsPage';
import AgentDetailPage from './pages/public/AgentDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Shared User Dashboard / Settings
import ProfilePage from './pages/shared/ProfilePage';
import ChangePasswordPage from './pages/shared/ChangePasswordPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans">
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'text-xs font-semibold rounded-2xl shadow-lg border border-slate-200',
                duration: 3500,
              }}
            />

            {/* Public Global Navigation */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                {/* 1. Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:slug" element={<PropertyDetailPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/agents/:id" element={<AgentDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* 2. Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* 3. Protected User / Client Pages */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* 4. 404 Not Found Page */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Public Global Footer */}
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
