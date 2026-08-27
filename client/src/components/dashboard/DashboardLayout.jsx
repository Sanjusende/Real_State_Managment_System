import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Building2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role || 'USER';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#ff5a3c] flex items-center justify-center text-white shadow-md shadow-[#ff5a3c]/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tight text-slate-950">
                Estate<span className="text-[#ff5a3c]">Craft</span>
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 -mt-1 hidden sm:inline">
                Premium Real Estate
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center ml-3 pl-3 border-l border-slate-200">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
              {role} Workspace
            </span>
          </div>
        </div>

        {/* Right: Quick Marketplace, Notifications & Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#ff5a3c] hover:bg-slate-100 text-xs font-bold transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Public Catalog</span>
          </Link>

          <Link
            to="/dashboard/notifications"
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition relative border border-slate-200/80 bg-white"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#ff5a3c] absolute top-2 right-2 ring-2 ring-white"></span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1 pl-2 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0b1528] text-white flex items-center justify-center text-xs font-extrabold shadow-xs overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'User'}
                </span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase">{user?.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                onMouseLeave={() => setUserDropdownOpen(false)}
                className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in"
              >
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <span className="block font-bold text-slate-900 truncate">{user?.name}</span>
                  <span className="block text-[10px] text-[#ff5a3c] font-bold uppercase">{user?.role}</span>
                </div>

                <Link
                  to={role === 'AGENT' ? '/agent/profile' : role === 'SELLER' ? '/seller/profile' : '/dashboard/profile'}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                {(role === 'AGENT' || role === 'SELLER' || role === 'ADMIN') && (
                  <Link
                    to={role === 'SELLER' ? '/seller/properties/create' : '/agent/properties/create'}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-[#ff5a3c]/10 hover:text-[#ff5a3c] font-bold"
                  >
                    <PlusCircle className="w-4 h-4 text-[#ff5a3c]" />
                    <span>Post New Property</span>
                  </Link>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
              <DashboardSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Header Title Section if provided */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
          )}

          {/* Child Component Content */}
          {children}
        </main>
      </div>
    </div>
  );
}

