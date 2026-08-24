import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Eye,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getMyProperties } from '../../../services/dashboardService';
import { getReceivedEnquiries } from '../../../services/enquiryService';
import { formatPrice, formatDate } from '../../../utils/formatters';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [propsRes, enqRes] = await Promise.all([
          getMyProperties({ limit: 4 }).catch(() => null),
          getReceivedEnquiries({ limit: 4 }).catch(() => null),
        ]);

        if (propsRes?.data?.properties) setProperties(propsRes.data.properties);
        if (enqRes?.data?.enquiries) setEnquiries(enqRes.data.enquiries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
  const activeCount = properties.filter((p) => p.status === 'AVAILABLE').length;

  return (
    <DashboardLayout
      title={`Seller Console 🏡`}
      subtitle={`Welcome, ${user?.name}. Monitor your direct owner listings, buyer inquiries, and view statistics.`}
    >
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white mb-8 shadow-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
            Owner Direct Hub
          </span>
          <h2 className="text-xl font-bold">Sell or Lease Directly with Zero Brokerage</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect directly with verified homebuyers and commercial investors.
          </p>
        </div>

        <Link to="/seller/properties/create">
          <Button variant="primary" size="md" icon={PlusCircle}>
            List Another Property
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Total Properties</span>
          <span className="text-2xl font-extrabold text-slate-900">{properties.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Listed under your account</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 block mb-1">Active Listings</span>
          <span className="text-2xl font-extrabold text-emerald-600">{activeCount}</span>
          <span className="text-[10px] text-emerald-700 block mt-1">Live on public catalog</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Total Views</span>
          <span className="text-2xl font-extrabold text-slate-900">{totalViews}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Buyer page visits</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 block mb-1">Buyer Inquiries</span>
          <span className="text-2xl font-extrabold text-amber-600">{enquiries.length}</span>
          <span className="text-[10px] text-amber-700 block mt-1">Leads & visit requests</span>
        </div>
      </div>

      {/* Grid: My Properties vs Buyer Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Properties */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Property Listings</h3>
              <p className="text-xs text-slate-500">Live listings on EstateCraft</p>
            </div>
            <Link to="/seller/properties" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage &rarr;
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400 mb-3">You have not published any properties yet.</p>
              <Link to="/seller/properties/create">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  List Your Property
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => (
                <div
                  key={p._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-11 h-11 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
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
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Incoming Buyer Inquiries</h3>
              <p className="text-xs text-slate-500">Interested buyers reaching out</p>
            </div>
            <Link to="/seller/enquiries" className="text-xs font-bold text-emerald-700 hover:underline">
              View All &rarr;
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No buyer inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">{enq.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">Phone: {enq.phone}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
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
      </div>
    </DashboardLayout>
  );
}
