import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Building2,
  Bell,
  User,
  Settings,
  PlusCircle,
  BarChart3,
  LogOut,
  ExternalLink,
  Briefcase,
  Store,
  Users,
  Clock,
  Flag,
  Star,
  Tags,
  MapPin,
  Activity,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getUnreadCount } from '../../services/notificationService';
import clsx from 'clsx';

export default function DashboardSidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUnreadCount()
        .then((res) => {
          if (res?.data?.unreadCount !== undefined) {
            setUnreadNotifs(res.data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const role = user?.role || 'USER';

  // Navigation Links based on active Role
  const navConfig = {
    USER: [
      { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
      { label: 'Saved Favorites', to: '/dashboard/favorites', icon: Heart, badge: favoritesCount || null },
      { label: 'My Inquiries', to: '/dashboard/enquiries', icon: MessageSquare },
      { label: 'Saved Feeds', to: '/dashboard/properties', icon: Building2 },
      { label: 'Notifications', to: '/dashboard/notifications', icon: Bell, badge: unreadNotifs || null },
      { label: 'Profile', to: '/dashboard/profile', icon: User },
      { label: 'Security & Settings', to: '/dashboard/settings', icon: Settings },
    ],
    AGENT: [
      { label: 'Agent Dashboard', to: '/agent/dashboard', icon: LayoutDashboard, end: true },
      { label: 'My Listings', to: '/agent/properties', icon: Building2, end: true },
      { label: 'Post New Listing', to: '/agent/properties/create', icon: PlusCircle },
      { label: 'Buyer Leads & Inquiries', to: '/agent/enquiries', icon: MessageSquare },
      { label: 'Visual Analytics', to: '/agent/analytics', icon: BarChart3 },
      { label: 'Agent Profile', to: '/agent/profile', icon: User },
    ],
    SELLER: [
      { label: 'Seller Console', to: '/seller/dashboard', icon: LayoutDashboard, end: true },
      { label: 'My Properties', to: '/seller/properties', icon: Building2, end: true },
      { label: 'List Property', to: '/seller/properties/create', icon: PlusCircle },
      { label: 'Buyer Enquiries', to: '/seller/enquiries', icon: MessageSquare },
      { label: 'Seller Profile', to: '/seller/profile', icon: User },
    ],
    ADMIN: [
      { label: 'Admin Suite', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
      { label: 'User Directory', to: '/admin/users', icon: Users },
      { label: 'Agent Partners', to: '/admin/agents', icon: Briefcase },
      { label: 'Property Sellers', to: '/admin/sellers', icon: Store },
      { label: 'Property Inventory', to: '/admin/properties', icon: Building2, end: true },
      { label: 'Pending Approvals', to: '/admin/properties/pending', icon: Clock },
      { label: 'Enquiries Master', to: '/admin/enquiries', icon: MessageSquare },
      { label: 'Client Reviews', to: '/admin/reviews', icon: Star },
      { label: 'Flagged Reports', to: '/admin/reports', icon: Flag },
      { label: 'Category Master', to: '/admin/categories', icon: Tags },
      { label: 'Locations Hub', to: '/admin/locations', icon: MapPin },
      { label: 'Platform Analytics', to: '/admin/analytics', icon: BarChart3 },
      { label: 'Audit Activity Logs', to: '/admin/activity-logs', icon: Activity },
      { label: 'System Settings', to: '/admin/settings', icon: Sliders },
    ],
  };

  const navItems = navConfig[role] || navConfig.USER;

  return (
    <aside className="w-64 xl:w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between h-full min-h-[calc(100vh-4.25rem)]">
      <div>
        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0b1528] text-white flex items-center justify-center text-sm font-extrabold shadow-xs flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-900 truncate block">
                {user?.name || 'Dashboard User'}
              </span>
              <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20 mt-0.5">
                {role} ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3.5 space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 px-3 block mb-2">
            WORKSPACE NAVIGATION
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition duration-150',
                    isActive
                      ? 'bg-[#0b1528] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ff5a3c] text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3.5 border-t border-slate-100 space-y-1 bg-slate-50/50">
        <Link
          to="/properties"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#ff5a3c] hover:bg-slate-100 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Public Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

