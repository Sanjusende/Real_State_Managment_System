import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  Sparkles,
  Calendar,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getDashboardAnalytics } from '../../../services/dashboardService';

const PIE_COLORS = ['#059669', '#2563eb', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AgentAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboardAnalytics();
        if (res?.data) setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const trendData = analytics?.trendData || [
    { month: 'Jan', views: 80, inquiries: 8, listings: 2 },
    { month: 'Feb', views: 140, inquiries: 15, listings: 3 },
    { month: 'Mar', views: 220, inquiries: 24, listings: 4 },
    { month: 'Apr', views: 310, inquiries: 30, listings: 5 },
    { month: 'May', views: 420, inquiries: 40, listings: 6 },
    { month: 'Jun', views: 580, inquiries: 55, listings: 8 },
  ];

  const typeDistribution = analytics?.propertyTypeDistribution || [
    { name: 'APARTMENT', count: 6 },
    { name: 'VILLA', count: 3 },
    { name: 'COMMERCIAL', count: 2 },
    { name: 'PLOT', count: 2 },
    { name: 'PENTHOUSE', count: 1 },
  ];

  const listingTypeDist = analytics?.listingTypeDistribution || [
    { name: 'SALE', count: 9 },
    { name: 'RENT', count: 4 },
    { name: 'LEASE', count: 1 },
  ];

  return (
    <DashboardLayout
      title="Performance Analytics & Lead Metrics"
      subtitle="Data-driven intelligence on listing visibility, conversion velocity, and buyer demand."
    >
      {/* 1. KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Lead Conversion Rate</span>
          <span className="text-2xl font-extrabold text-emerald-700">8.4%</span>
          <span className="text-[10px] text-slate-400 block mt-1">+1.2% above market average</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Avg. Days on Market</span>
          <span className="text-2xl font-extrabold text-slate-900">22 Days</span>
          <span className="text-[10px] text-slate-400 block mt-1">From listing to deal closure</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Avg. Views Per Listing</span>
          <span className="text-2xl font-extrabold text-blue-600">142 Views</span>
          <span className="text-[10px] text-slate-400 block mt-1">High public engagement</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Inquiry Response Rate</span>
          <span className="text-2xl font-extrabold text-purple-600">96.8%</span>
          <span className="text-[10px] text-slate-400 block mt-1">Under 2 hours response time</span>
        </div>
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Views and Inquiries Area Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Listing Impressions & Lead Velocity</h3>
            <p className="text-xs text-slate-500">6-Month historical traffic progression</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blueA" x1="0" y1="0" x2="0" y2="1">
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
                  name="Views"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#emeraldA)"
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  name="Leads"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#blueA)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiries by Category Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Inventory Distribution by Category</h3>
            <p className="text-xs text-slate-500">Unit count breakdown by property type</p>
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
                <Bar dataKey="count" name="Properties" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Listing Intent Distribution */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">Transaction Intent Split</h3>
          <p className="text-xs text-slate-500">Sale vs Rental vs Commercial Lease inventory breakdown</p>
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
