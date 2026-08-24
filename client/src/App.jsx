import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

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

// Shared User Settings
import ProfilePage from './pages/shared/ProfilePage';
import ChangePasswordPage from './pages/shared/ChangePasswordPage';

// USER Dashboard Pages
import UserDashboard from './pages/dashboard/user/UserDashboard';
import UserProfilePage from './pages/dashboard/user/UserProfilePage';
import UserFavoritesPage from './pages/dashboard/user/UserFavoritesPage';
import UserEnquiriesPage from './pages/dashboard/user/UserEnquiriesPage';
import UserPropertiesPage from './pages/dashboard/user/UserPropertiesPage';
import UserNotificationsPage from './pages/dashboard/user/UserNotificationsPage';
import UserSettingsPage from './pages/dashboard/user/UserSettingsPage';

// AGENT Dashboard Pages
import AgentDashboard from './pages/dashboard/agent/AgentDashboard';
import AgentPropertiesPage from './pages/dashboard/agent/AgentPropertiesPage';
import AgentPropertyCreatePage from './pages/dashboard/agent/AgentPropertyCreatePage';
import AgentPropertyEditPage from './pages/dashboard/agent/AgentPropertyEditPage';
import AgentEnquiriesPage from './pages/dashboard/agent/AgentEnquiriesPage';
import AgentProfilePage from './pages/dashboard/agent/AgentProfilePage';
import AgentAnalyticsPage from './pages/dashboard/agent/AgentAnalyticsPage';

// SELLER Dashboard Pages
import SellerDashboard from './pages/dashboard/seller/SellerDashboard';
import SellerPropertiesPage from './pages/dashboard/seller/SellerPropertiesPage';
import SellerPropertyCreatePage from './pages/dashboard/seller/SellerPropertyCreatePage';
import SellerPropertyEditPage from './pages/dashboard/seller/SellerPropertyEditPage';
import SellerEnquiriesPage from './pages/dashboard/seller/SellerEnquiriesPage';
import SellerProfilePage from './pages/dashboard/seller/SellerProfilePage';

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

            {/* Application Routes */}
            <main className="flex-1">
              <Routes>
                {/* Public Catalog Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:slug" element={<PropertyDetailPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/agents/:id" element={<AgentDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Shared User Settings */}
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* USER Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserProfilePage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/favorites"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserFavoritesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/enquiries"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserEnquiriesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/properties"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserPropertiesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserNotificationsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <RoleProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT', 'SELLER']}>
                      <UserSettingsPage />
                    </RoleProtectedRoute>
                  }
                />

                {/* AGENT Dashboard Routes (AGENT, ADMIN) */}
                <Route
                  path="/agent/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/properties"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentPropertiesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/properties/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentPropertyCreatePage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/properties/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentPropertyEditPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/enquiries"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentEnquiriesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentProfilePage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/agent/analytics"
                  element={
                    <RoleProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentAnalyticsPage />
                    </RoleProtectedRoute>
                  }
                />

                {/* SELLER Dashboard Routes (SELLER, ADMIN) */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/seller/properties"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerPropertiesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/seller/properties/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerPropertyCreatePage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/seller/properties/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerPropertyEditPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/seller/enquiries"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerEnquiriesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/seller/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <SellerProfilePage />
                    </RoleProtectedRoute>
                  }
                />

                {/* 404 Route */}
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
