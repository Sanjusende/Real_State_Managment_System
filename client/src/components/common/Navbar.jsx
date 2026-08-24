import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Menu,
  X,
  User as UserIcon,
  Heart,
  LogOut,
  KeyRound,
  Shield,
  Phone,
  Search,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import Button from './Button';
import clsx from 'clsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'AGENT') return '/agent/dashboard';
    if (role === 'SELLER') return '/seller/dashboard';
    return '/dashboard';
  };

  const getProfilePath = (role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'AGENT') return '/agent/profile';
    if (role === 'SELLER') return '/seller/profile';
    return '/dashboard/profile';
  };

  const dashboardUrl = getDashboardPath(user?.role);
  const profileUrl = getProfilePath(user?.role);

  // Track scroll for subtle navbar blur elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Agents', path: '/agents' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full transition-all duration-200 border-b',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-sm'
          : 'bg-white border-slate-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Estate<span className="text-emerald-600">Craft</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                Premium Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    'px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-150',
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions (Favorites, Auth / Profile) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Saved Properties Pill */}
            <Link
              to="/properties"
              title="Saved Properties"
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold text-slate-900">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] font-semibold text-emerald-600 uppercase">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 z-50 text-xs animate-fade-in"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={dashboardUrl}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>{user?.role === 'ADMIN' ? 'Admin Center' : 'Dashboard'}</span>
                    </Link>

                    <Link
                      to={profileUrl}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/change-password"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span>Security Settings</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Button
                  onClick={() => navigate('/register')}
                  variant="primary"
                  size="sm"
                >
                  Join / Post Property
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150',
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">{user?.name}</span>
                    <span className="block text-xs text-emerald-600 uppercase font-semibold">{user?.role}</span>
                  </div>
                </div>

                <Link
                  to={dashboardUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-bold text-emerald-700 rounded-xl hover:bg-emerald-50"
                >
                  {user?.role === 'ADMIN' ? 'Executive Dashboard' : 'My Dashboard'}
                </Link>
                <Link
                  to={profileUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <Link
                  to="/change-password"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Change Password
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
