import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Building,
  Phone,
  Mail,
  Calendar,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { formatPrice, formatDate } from '../../../utils/formatters';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import { getMyEnquiries } from '../../../services/enquiryService';

export default function UserEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyEnquiries();
      if (res?.data?.enquiries) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      setError(err.message || 'Failed to retrieve your inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Resolved / Visited
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" /> Agent Contacted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      title={`My Inquiries & Site Visits (${enquiries.length})`}
      subtitle="Track the status of all direct property inquiries and communication with verified consultants."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadEnquiries} />
      ) : enquiries.length === 0 ? (
        <EmptyState
          title="No Inquiries Sent Yet"
          description="When you find a property you are interested in, use the inquiry button to reach out to the listing consultant."
          actionLabel="Explore Properties"
          onAction={() => window.location.assign('/properties')}
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const prop = enq.property;
            const agent = enq.recipient;
            return (
              <div
                key={enq._id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Property Preview & Message */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    <img
                      src={
                        prop?.thumbnail ||
                        prop?.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getStatusBadge(enq.status)}
                      <span className="text-[11px] text-slate-400">
                        Submitted on {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {prop?.title || 'Real Estate Property'}
                    </h3>

                    {prop?.price && (
                      <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                        {formatPrice(prop.price, prop.priceUnit)}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2 italic">
                      "{enq.message}"
                    </p>
                  </div>
                </div>

                {/* Right: Assigned Agent & Action */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  <div className="md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Assigned Agent
                    </span>
                    <span className="text-xs font-bold text-slate-900 block">
                      {agent?.name || 'EstateCraft Advisor'}
                    </span>
                    {agent?.phone && (
                      <span className="text-[11px] text-slate-500 block">{agent.phone}</span>
                    )}
                  </div>

                  {prop?.slug && (
                    <Link
                      to={`/properties/${prop.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition"
                    >
                      <span>View Listing</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
