import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  MessageSquare,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  Sparkles,
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
  Legend,
} from 'recharts';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getAdminAnalytics } from '../../../services/adminService';

const PIE_COLORS = ['#7e22ce', '#059669', '#2563eb', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminAnalytics();
        if (res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const listingTypeDist = data?.listingTypeDistribution || [
    { name: 'SALE', count: 20 },
    { name: 'RENT', count: 8 },
    { name: 'LEASE', count: 2 },
  ];

  return (
    <DashboardLayout
      title="Platform Macro Analytics & Intelligence"
      subtitle="Macro-level metrics across registered user demographics, inventory velocity, and buyer demand."
    >
      {/* 1. Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Platform Conversion Rate</span>
          <span className="text-2xl font-extrabold text-purple-700">11.2%</span>
          <span className="text-[10px] text-slate-400 block mt-1">Inquiry to inspection ratio</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Avg. Approval Time</span>
          <span className="text-2xl font-extrabold text-emerald-700">3.4 Hours</span>
          <span className="text-[10px] text-slate-400 block mt-1">From submit to verification</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Buyer-to-Agent Ratio</span>
          <span className="text-2xl font-extrabold text-blue-700">4.8 : 1</span>
          <span className="text-[10px] text-slate-400 block mt-1">Healthy demand marketplace</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Avg. Ticket Size</span>
          <span className="text-2xl font-extrabold text-amber-700">₹ 68.5 L</span>
          <span className="text-[10px] text-slate-400 block mt-1">Mid-to-luxury corridor focus</span>
        </div>
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Multi-Area Growth Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">User vs Inventory Growth Velocity</h3>
            <p className="text-xs text-slate-500">6-Month historical platform scaling progression</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#eGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#7e22ce"
                  strokeWidth={2.5}
                  fill="url(#pGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Inventory BarChart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Inventory Distribution by Category</h3>
            <p className="text-xs text-slate-500">Property count by classification</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                <Bar dataKey="count" name="Properties" fill="#7e22ce" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Transaction Intent Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">Market Transaction Intent Split</h3>
          <p className="text-xs text-slate-500">Breakdown of inventory allocated for outright sale versus leasehold</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {listingTypeDist.map((item, idx) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="text-xs font-bold text-slate-800">For {item.name}</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{item.count} units</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
