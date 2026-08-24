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
  ShieldCheck,
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
      { label: 'Saved Searches', to: '/dashboard/properties', icon: Building2 },
      { label: 'Notifications', to: '/dashboard/notifications', icon: Bell, badge: unreadNotifs || null },
      { label: 'Profile', to: '/dashboard/profile', icon: User },
      { label: 'Account Settings', to: '/dashboard/settings', icon: Settings },
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
      { label: 'Seller Dashboard', to: '/seller/dashboard', icon: LayoutDashboard, end: true },
      { label: 'My Properties', to: '/seller/properties', icon: Building2, end: true },
      { label: 'List Property', to: '/seller/properties/create', icon: PlusCircle },
      { label: 'Buyer Enquiries', to: '/seller/enquiries', icon: MessageSquare },
      { label: 'Seller Profile', to: '/seller/profile', icon: User },
    ],
    ADMIN: [
      { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
      { label: 'User Directory', to: '/admin/users', icon: Users },
      { label: 'Agent Partners', to: '/admin/agents', icon: Briefcase },
      { label: 'Property Sellers', to: '/admin/sellers', icon: Store },
      { label: 'Property Inventory', to: '/admin/properties', icon: Building2, end: true },
      { label: 'Pending Approvals', to: '/admin/properties/pending', icon: Clock },
      { label: 'System Enquiries', to: '/admin/enquiries', icon: MessageSquare },
      { label: 'Client Reviews', to: '/admin/reviews', icon: Star },
      { label: 'Flagged Reports', to: '/admin/reports', icon: Flag },
      { label: 'Category Master', to: '/admin/categories', icon: Tags },
      { label: 'Location Hub', to: '/admin/locations', icon: MapPin },
      { label: 'Platform Analytics', to: '/admin/analytics', icon: BarChart3 },
      { label: 'Audit Activity Logs', to: '/admin/activity-logs', icon: Activity },
      { label: 'System Settings', to: '/admin/settings', icon: Sliders },
    ],
  };

  const navItems = navConfig[role] || navConfig.USER;

  const roleLabels = {
    USER: { title: 'Buyer / Client Hub', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    AGENT: { title: 'Agent Pro Portal', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    SELLER: { title: 'Seller Console', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
    ADMIN: { title: 'Admin Workspace', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  };

  const currentRoleInfo = roleLabels[role] || roleLabels.USER;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-full min-h-[calc(100vh-4.5rem)]">
      <div>
        {/* Role & User Badge Card */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base font-extrabold shadow-sm flex-shrink-0">
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
              <span
                className={clsx(
                  'inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border mt-0.5',
                  currentRoleInfo.badgeColor
                )}
              >
                {role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Navigation Menu
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
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-150',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <Link
          to="/properties"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          <span>Public Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
