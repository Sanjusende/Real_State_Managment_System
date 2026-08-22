import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm text-slate-400">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="p-8 max-w-md w-full bg-slate-800/80 border border-red-500/30 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-300 mb-6">
            Your current role (<span className="font-semibold text-white">{user?.role}</span>) does not have permission to view this section.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
