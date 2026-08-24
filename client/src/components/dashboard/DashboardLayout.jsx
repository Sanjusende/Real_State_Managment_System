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
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import clsx from 'clsx';

export default function DashboardLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role || 'USER';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 hidden sm:inline">
              Estate<span className="text-emerald-600">Craft</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
              {role} Workspace
            </span>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/notifications"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white"></span>
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'User'}
                </span>
                <span className="block text-[10px] text-slate-400 font-semibold">{user?.email}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                onMouseLeave={() => setUserDropdownOpen(false)}
                className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95"
              >
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <span className="block font-bold text-slate-900">{user?.name}</span>
                  <span className="block text-[10px] text-emerald-700 font-semibold uppercase">{user?.role}</span>
                </div>

                <Link
                  to={role === 'AGENT' ? '/agent/profile' : role === 'SELLER' ? '/seller/profile' : '/dashboard/profile'}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-semibold"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>View Profile</span>
                </Link>

                <Link
                  to="/properties"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-semibold"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Public Catalog</span>
                </Link>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {/* Header Title Section if provided */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
