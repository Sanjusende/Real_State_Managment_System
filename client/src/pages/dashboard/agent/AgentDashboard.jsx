import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  DollarSign,
  Key,
  Eye,
  MessageSquare,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getDashboardAnalytics, getMyProperties } from '../../../services/dashboardService';
import { getReceivedEnquiries } from '../../../services/enquiryService';
import { formatPrice, formatDate } from '../../../utils/formatters';

const PIE_COLORS = ['#059669', '#2563eb', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AgentDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, propsRes, enqRes] = await Promise.all([
          getDashboardAnalytics().catch(() => null),
          getMyProperties({ limit: 5 }).catch(() => null),
          getReceivedEnquiries({ limit: 5 }).catch(() => null),
        ]);

        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
        if (propsRes?.data?.properties) setProperties(propsRes.data.properties);
        if (enqRes?.data?.enquiries) setEnquiries(enqRes.data.enquiries);
      } catch (err) {
        console.error('Error loading agent dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const overview = analytics?.overview || {
    totalProperties: properties.length || 0,
    activeProperties: properties.filter((p) => p.status === 'AVAILABLE').length || 0,
    soldProperties: properties.filter((p) => p.status === 'SOLD').length || 0,
    rentedProperties: properties.filter((p) => p.status === 'RENTED').length || 0,
    totalViews: properties.reduce((acc, p) => acc + (p.views || 0), 0),
    totalEnquiries: enquiries.length || 0,
  };

  const trendData = analytics?.trendData || [
    { month: 'May', views: 120, inquiries: 14, listings: 2 },
    { month: 'Jun', views: 240, inquiries: 22, listings: 4 },
    { month: 'Jul', views: 380, inquiries: 35, listings: 6 },
    { month: 'Aug', views: 510, inquiries: 48, listings: 8 },
  ];

  const typeDistribution = analytics?.propertyTypeDistribution || [
    { name: 'APARTMENT', count: 4 },
    { name: 'VILLA', count: 2 },
    { name: 'COMMERCIAL', count: 1 },
    { name: 'PLOT', count: 1 },
  ];

  return (
    <DashboardLayout
      title={`Agent Performance Dashboard 🏢`}
      subtitle={`Welcome back, ${user?.name}. Manage listings, monitor lead generation, and track client inquiries.`}
    >
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white mb-8 shadow-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
            Agent Pro Portal
          </span>
          <h2 className="text-xl font-bold">Manage Your Real Estate Portfolio</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {user?.agencyName || 'Independent Real Estate Partner'} • Verified Consultant
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/agent/properties/create">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Post New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-2">Total Listings</span>
          <span className="text-2xl font-extrabold text-slate-900">{overview.totalProperties}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Managed units</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 block mb-2">Active On-Market</span>
          <span className="text-2xl font-extrabold text-emerald-600">{overview.activeProperties}</span>
          <span className="text-[10px] text-emerald-700 block mt-1">Available for sale/rent</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-blue-700 block mb-2">Sold Units</span>
          <span className="text-2xl font-extrabold text-blue-600">{overview.soldProperties}</span>
          <span className="text-[10px] text-blue-700 block mt-1">Closed deals</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-700 block mb-2">Rented Units</span>
          <span className="text-2xl font-extrabold text-purple-600">{overview.rentedProperties}</span>
          <span className="text-[10px] text-purple-700 block mt-1">Active leases</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-2">Total Views</span>
          <span className="text-2xl font-extrabold text-slate-900">{overview.totalViews}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Public impressions</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 block mb-2">Buyer Inquiries</span>
          <span className="text-2xl font-extrabold text-amber-600">{overview.totalEnquiries}</span>
          <span className="text-[10px] text-amber-700 block mt-1">Leads received</span>
        </div>
      </div>

      {/* 2. Visual Analytics Charts using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Left 2 Cols: Monthly Traffic & Inquiries Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Traffic & Lead Velocity Trend</h3>
              <p className="text-xs text-slate-500">Monthly property views and inquiry growth</p>
            </div>
            <Link to="/agent/analytics" className="text-xs font-bold text-emerald-700 hover:underline">
              Detailed Analytics &rarr;
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
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
                  dataKey="views"
                  name="Property Views"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  name="Buyer Leads"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Breakdown Pie */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Portfolio by Property Type</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution of managed listings</p>

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

      {/* 3. Recent Inquiries & Fast Listing Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Inquiries List */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Buyer Inquiries</h3>
              <p className="text-xs text-slate-500">Incoming prospective client requests</p>
            </div>
            <Link to="/agent/enquiries" className="text-xs font-bold text-emerald-700 hover:underline">
              View All Leads &rarr;
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div
                  key={enq._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {enq.name} ({enq.phone})
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      Property: {enq.property?.title || 'Listing'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0 ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : enq.status === 'CONTACTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Listings Status Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Portfolio Listings</h3>
              <p className="text-xs text-slate-500">Recently published properties</p>
            </div>
            <Link to="/agent/properties" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage All &rarr;
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 mb-3">You haven't posted any property listings yet.</p>
              <Link to="/agent/properties/create">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  Add First Property
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={p.thumbnail || p.images?.[0]?.url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 block truncate">{p.title}</span>
                      <span className="text-[11px] text-emerald-700 font-extrabold block">
                        {formatPrice(p.price, p.priceUnit)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'SOLD'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
