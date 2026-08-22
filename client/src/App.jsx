import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Server,
  ArrowRight,
  User as UserIcon,
  LogOut,
  KeyRound,
  Sparkles,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProfilePage from './pages/shared/ProfilePage';
import ChangePasswordPage from './pages/shared/ChangePasswordPage';
import { getCategories, getPopularLocations } from './services/taxonomyService';

// Navbar Component
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="border-b border-slate-700/60 bg-slate-900/70 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              EstateCraft Pro
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Enterprise Real Estate Platform</p>
          </div>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Branch: feature/authentication
          </span>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-white leading-tight">{user?.name}</span>
                  <span className="block text-[10px] text-blue-400 font-medium uppercase">{user?.role}</span>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs"
                >
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-700/60 hover:text-white transition"
                  >
                    <UserIcon className="w-4 h-4 text-blue-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-700/60 hover:text-white transition"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Change Password</span>
                  </Link>
                  <div className="border-t border-slate-700/60 my-1"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-700/60 space-y-2 text-sm">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-slate-800/80 rounded-xl mb-2">
                <span className="font-semibold text-white block">{user?.name}</span>
                <span className="text-xs text-blue-400 uppercase">{user?.role}</span>
              </div>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300"
              >
                My Profile
              </Link>
              <Link
                to="/change-password"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300"
              >
                Change Password
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-center rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-center rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// Home Component
function Home() {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [serverStatus, setServerStatus] = useState({ loading: true, healthy: false, data: null });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/health`);
        const result = await res.json();
        if (result.success) {
          setServerStatus({ loading: false, healthy: true, data: result });
        }
      } catch {
        setServerStatus({ loading: false, healthy: false, data: null });
      }

      try {
        const catRes = await getCategories();
        if (catRes?.data) setCategories(catRes.data);
      } catch {}
    };

    loadHomeData();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center text-white">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 mb-6 text-sm text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>JWT Authentication & RBAC Active</span>
      </div>

      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
        Enterprise Real Estate Platform
      </h2>

      <p className="text-lg text-slate-300 max-w-2xl mb-8">
        Complete multi-role authentication with hashed credentials, secure token rotation, profile management, and password recovery.
      </p>

      {isAuthenticated ? (
        <div className="mb-10 p-6 bg-slate-800/70 border border-blue-500/40 rounded-3xl max-w-md w-full text-left shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Active User Session</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Authenticated
            </span>
          </div>
          <p className="text-lg font-bold text-white mb-1">{user?.name}</p>
          <p className="text-xs text-slate-400 mb-4">{user?.email}</p>
          <div className="flex gap-2">
            <Link
              to="/profile"
              className="flex-1 py-2 px-3 text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
            >
              View Profile
            </Link>
            <Link
              to="/change-password"
              className="py-2 px-3 bg-slate-900 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Security
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition"
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-10">
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-white">Dual JWT Architecture</h3>
          <p className="text-sm text-slate-400">Access Tokens with Refresh Token rotation, bcrypt 10-round hashing, and crypto reset tokens.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-white">4 Distinct Roles</h3>
          <p className="text-sm text-slate-400">Dedicated workflows for Buyers, Agents, Sellers, and Platform Administrators.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-white">API Gateway Status</h3>
          <p className="text-sm text-slate-400">
            {serverStatus.loading ? (
              'Checking gateway status...'
            ) : serverStatus.healthy ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Port 5000 Active
              </span>
            ) : (
              <span className="text-amber-400">Ready to connect</span>
            )}
          </p>
        </div>
      </div>

      {/* Taxonomies Preview */}
      {categories.length > 0 && (
        <div className="w-full mb-8">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 text-left font-bold">
            Available Real Estate Categories ({categories.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
          <Toaster position="top-right" />
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
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

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-white px-4">
                  <h1 className="text-6xl font-extrabold text-blue-500 mb-4">404</h1>
                  <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                  <p className="text-slate-400 mb-6 text-sm">The page you are looking for does not exist or has moved.</p>
                  <Link to="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold">
                    Return to Home
                  </Link>
                </div>
              }
            />
          </Routes>

          {/* Footer */}
          <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} EstateCraft Pro. All rights reserved. Authentication Architecture v1.0.0.
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
