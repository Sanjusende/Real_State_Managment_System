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
  Plus,
  LayoutDashboard,
  Search,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import clsx from 'clsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickKeyword, setQuickKeyword] = useState('');
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

  const getAddPropertyPath = (role) => {
    if (role === 'ADMIN' || role === 'AGENT') return '/agent/properties/create';
    if (role === 'SELLER') return '/seller/properties/create';
    return '/seller/properties/create';
  };

  const dashboardUrl = getDashboardPath(user?.role);
  const profileUrl = getProfilePath(user?.role);
  const addPropertyUrl = getAddPropertyPath(user?.role);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchModalOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Agents', path: '/agents' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickKeyword.trim()) {
      navigate(`/properties?keyword=${encodeURIComponent(quickKeyword.trim())}`);
      setSearchModalOpen(false);
    }
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-[#0b1528]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 py-3'
            : 'bg-[#0b1528]/80 backdrop-blur-md border-b border-white/5 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo - EstateCraft */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5a3c] to-[#ff7b5a] flex items-center justify-center text-white shadow-md shadow-[#ff5a3c]/30 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center">
                  Estate<span className="text-[#ff5a3c]">Craft</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 -mt-1">
                  Premium Real Estate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    clsx(
                      'text-xs font-semibold tracking-wide transition-all duration-200 relative py-1',
                      isActive
                        ? 'text-[#ff5a3c] font-bold'
                        : 'text-slate-300 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff5a3c] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions: Wishlist, Search Trigger, Add Property Button & Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Saved Properties / Wishlist Button */}
              <Link
                to={isAuthenticated ? '/dashboard/favorites' : '/properties'}
                title="Saved Properties"
                className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
              >
                <Heart className={clsx('w-4 h-4', favorites.length > 0 && 'text-[#ff5a3c] fill-[#ff5a3c]')} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff5a3c] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Quick Search Modal Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                title="Quick Search"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* "+ Add Properties" Button */}
              <Link
                to={isAuthenticated ? addPropertyUrl : '/register?role=SELLER'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ff5a3c]/60 text-white hover:bg-[#ff5a3c] hover:border-[#ff5a3c] text-xs font-bold transition-all duration-300 shadow-sm shadow-[#ff5a3c]/10"
              >
                <Plus className="w-3.5 h-3.5 text-[#ff5a3c] group-hover:text-white" />
                <span>Add Properties</span>
              </Link>

              {/* User Dropdown / Sign In */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white transition cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#ff5a3c] text-white flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="text-xs font-semibold max-w-[90px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f1c34] border border-white/15 shadow-2xl py-2 z-50 text-xs backdrop-blur-2xl"
                    >
                      <div className="px-4 py-2.5 border-b border-white/10 mb-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ff5a3c] text-white flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0)?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                      </div>

                      <Link
                        to={dashboardUrl}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-white/10 hover:text-white transition font-bold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#ff5a3c]" />
                        <span>{user?.role === 'ADMIN' ? 'Admin Suite' : 'My Dashboard'}</span>
                      </Link>

                      <Link
                        to={profileUrl}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/change-password"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
                      >
                        <KeyRound className="w-4 h-4 text-slate-400" />
                        <span>Change Password</span>
                      </Link>

                      <div className="border-t border-white/10 my-1"></div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 transition cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0b1528]/98 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2.5 rounded-xl text-xs font-bold transition-colors',
                      isActive
                        ? 'text-white bg-[#ff5a3c]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-2xl mb-3 flex items-center gap-3 border border-white/10">
                    <div className="w-9 h-9 rounded-full bg-[#ff5a3c] text-white flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{user?.name}</span>
                      <span className="block text-[10px] text-[#ff5a3c] uppercase font-extrabold">{user?.role}</span>
                    </div>
                  </div>

                  <Link
                    to={dashboardUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-xs font-bold text-white rounded-xl hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={addPropertyUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-xs font-bold text-[#ff5a3c] rounded-xl hover:bg-white/10"
                  >
                    + Add New Property
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-400 rounded-xl hover:bg-rose-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/15"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#ff5a3c] hover:bg-[#e04b30] rounded-xl shadow-md shadow-[#ff5a3c]/30"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0f1c34] border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Search Properties</h3>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleQuickSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={quickKeyword}
                  onChange={(e) => setQuickKeyword(e.target.value)}
                  placeholder="City, locality, project or keyword..."
                  autoFocus
                  className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a3c]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ff5a3c] hover:bg-[#e04b30] text-white text-xs font-bold rounded-xl transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

