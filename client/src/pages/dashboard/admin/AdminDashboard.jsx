import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Clock,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Sparkles,
  Briefcase,
  Store,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getAdminAnalytics, approveProperty, rejectProperty } from '../../../services/adminService';
import { formatPrice, formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#059669', '#2563eb', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAdminAnalytics();
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (id) => {
    try {
      await approveProperty(id);
      toast.success('Property approved!');
      loadData();
    } catch (err) {
      toast.error('Failed to approve property');
    }
  };

  const handleQuickReject = async (id) => {
    try {
      await rejectProperty(id, 'Listing does not satisfy quality standards');
      toast.success('Property rejected');
      loadData();
    } catch (err) {
      toast.error('Failed to reject property');
    }
  };

  const metrics = data?.metrics || {
    totalUsers: 0,
    totalAgents: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalEnquiries: 0,
    totalReviews: 0,
    totalReports: 0,
    pendingReports: 0,
  };

  const trendData = data?.trendData || [
    { month: 'Jan', users: 15, properties: 25, inquiries: 18 },
    { month: 'Feb', users: 28, properties: 42, inquiries: 30 },
    { month: 'Mar', users: 45, properties: 60, inquiries: 52 },
    { month: 'Apr', users: 70, properties: 85, inquiries: 68 },
    { month: 'May', users: 95, properties: 110, inquiries: 90 },
    { month: 'Jun', users: 130, properties: 145, inquiries: 120 },
  ];

  const typeDistribution = data?.propertyTypeDistribution || [
    { name: 'APARTMENT', count: 12 },
    { name: 'VILLA', count: 8 },
    { name: 'COMMERCIAL', count: 5 },
    { name: 'PLOT', count: 4 },
  ];

  return (
    <DashboardLayout
      title={`Executive Command Center ⚡`}
      subtitle={`Welcome, Administrator ${user?.name}. Oversee platform governance, property approvals, and system health.`}
    >
      {/* 1. Critical Pending Approvals Alert Banner */}
      {metrics.pendingProperties > 0 && (
        <div className="mb-8 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-extrabold shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {metrics.pendingProperties} Property {metrics.pendingProperties === 1 ? 'Listing' : 'Listings'} Awaiting Verification
              </h3>
              <p className="text-xs text-slate-600">
                Agent and seller submissions must be approved before appearing in the public marketplace.
              </p>
            </div>
          </div>
          <Link to="/admin/properties/pending">
            <Button variant="primary" size="sm">
              Review Queue ({metrics.pendingProperties})
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Key High-Level KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{metrics.totalUsers}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics.totalAgents} Agents • {metrics.totalSellers} Sellers
          </span>
        </Link>

        <Link
          to="/admin/properties"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">All Properties</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 block">{metrics.totalProperties}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics.approvedProperties} Approved • {metrics.pendingProperties} Pending
          </span>
        </Link>

        <Link
          to="/admin/enquiries"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-blue-700 block">{metrics.totalEnquiries}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">System-wide buyer leads</span>
        </Link>

        <Link
          to="/admin/reports"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Flagged Reports</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-red-600 block">{metrics.totalReports}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics.pendingReports} Unresolved issues
          </span>
        </Link>
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Monthly Platform Progression AreaChart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Expansion Velocity</h3>
              <p className="text-xs text-slate-500">Monthly user registrations, property inventory, and lead inquiries</p>
            </div>
            <Link to="/admin/analytics" className="text-xs font-bold text-purple-700 hover:underline">
              Deep Analytics &rarr;
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="properties"
                  name="Properties"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#7e22ce"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Inventory Pie */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Catalog by Property Type</h3>
            <p className="text-xs text-slate-500 mb-4">Volume distribution across asset classes</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs">
            {typeDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.count} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Pending Listings Queue & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Pending Approval Properties */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Pending Listings</h3>
              <p className="text-xs text-slate-500">Unmoderated property submissions</p>
            </div>
            <Link to="/admin/properties/pending" className="text-xs font-bold text-purple-700 hover:underline">
              View All Queue &rarr;
            </Link>
          </div>

          {data?.recentProperties?.filter((p) => p.approvalStatus === 'PENDING').length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Approval Queue Clean</p>
              <p className="text-[11px] text-slate-400">All submitted properties have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.recentProperties
                ?.filter((p) => p.approvalStatus === 'PENDING')
                .slice(0, 4)
                .map((prop) => (
                  <div
                    key={prop._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 block truncate">{prop.title}</span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        By {prop.owner?.name || prop.agent?.name || 'Partner'} • {prop.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(prop._id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickReject(prop._id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Activity Audit Logs */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Activity Trail</h3>
              <p className="text-xs text-slate-500">Audited administrative actions and changes</p>
            </div>
            <Link to="/admin/activity-logs" className="text-xs font-bold text-purple-700 hover:underline">
              Full Logs &rarr;
            </Link>
          </div>

          {data?.recentLogs?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent activity logs.</p>
          ) : (
            <div className="space-y-3">
              {data?.recentLogs?.slice(0, 5).map((log) => (
                <div
                  key={log._id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 truncate">{log.action}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{log.details || log.entityType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
