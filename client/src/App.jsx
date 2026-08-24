import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import ChangePasswordPage from './pages/shared/ChangePasswordPage';

// USER Dashboard Pages
import UserDashboard from './pages/dashboard/user/UserDashboard';
import UserProfilePage from './pages/dashboard/user/UserProfilePage';
import UserFavoritesPage from './pages/dashboard/user/UserFavoritesPage';
import UserEnquiriesPage from './pages/dashboard/user/UserEnquiriesPage';
import UserPropertiesPage from './pages/dashboard/user/UserPropertiesPage';
import UserNotificationsPage from './pages/dashboard/user/UserNotificationsPage';
import UserSettingsPage from './pages/dashboard/user/UserSettingsPage';

// Smart Role Dispatchers
function DashboardDispatcher() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
  if (user?.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  return <UserDashboard />;
}

function ProfileDispatcher() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'AGENT') return <Navigate to="/agent/profile" replace />;
  if (user?.role === 'SELLER') return <Navigate to="/seller/profile" replace />;
  return <UserProfilePage />;
}

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

// ADMIN Dashboard Pages
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import AdminUsersPage from './pages/dashboard/admin/AdminUsersPage';
import AdminAgentsPage from './pages/dashboard/admin/AdminAgentsPage';
import AdminSellersPage from './pages/dashboard/admin/AdminSellersPage';
import AdminPropertiesPage from './pages/dashboard/admin/AdminPropertiesPage';
import AdminPendingPropertiesPage from './pages/dashboard/admin/AdminPendingPropertiesPage';
import AdminEnquiriesPage from './pages/dashboard/admin/AdminEnquiriesPage';
import AdminReportsPage from './pages/dashboard/admin/AdminReportsPage';
import AdminCategoriesPage from './pages/dashboard/admin/AdminCategoriesPage';
import AdminLocationsPage from './pages/dashboard/admin/AdminLocationsPage';
import AdminReviewsPage from './pages/dashboard/admin/AdminReviewsPage';
import AdminAnalyticsPage from './pages/dashboard/admin/AdminAnalyticsPage';
import AdminActivityLogsPage from './pages/dashboard/admin/AdminActivityLogsPage';
import AdminSettingsPage from './pages/dashboard/admin/AdminSettingsPage';

function AppContent() {
  const location = useLocation();

  // Hide the public marketing header & footer inside dedicated workspace dashboard suites
  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/agent/') ||
    location.pathname === '/agent' ||
    location.pathname.startsWith('/seller/') ||
    location.pathname === '/seller' ||
    location.pathname.startsWith('/admin/') ||
    location.pathname === '/admin' ||
    location.pathname.startsWith('/change-password');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-xs font-semibold rounded-2xl shadow-lg border border-slate-200',
          duration: 3500,
        }}
      />

      {/* Render Public Global Navigation only outside dashboard suites */}
      {!isDashboardRoute && <Navbar />}

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
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileDispatcher />
                    </ProtectedRoute>
                  }
                />

                {/* Dashboard Root Dispatcher */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardDispatcher />
                    </ProtectedRoute>
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

                {/* ADMIN Dashboard Routes (Strictly ADMIN only) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminUsersPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/agents"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminAgentsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sellers"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminSellersPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminPropertiesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties/pending"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminPendingPropertiesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/enquiries"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminEnquiriesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminReportsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminCategoriesPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/locations"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminLocationsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminReviewsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminAnalyticsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/activity-logs"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminActivityLogsPage />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminSettingsPage />
                    </RoleProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
      </main>

      {/* Render Public Global Footer only outside dashboard suites */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
