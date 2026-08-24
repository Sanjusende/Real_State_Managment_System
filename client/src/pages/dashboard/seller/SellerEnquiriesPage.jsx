import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getReceivedEnquiries, updateEnquiryStatus } from '../../../services/enquiryService';
import { formatDate } from '../../../utils/formatters';

export default function SellerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getReceivedEnquiries();
      if (res?.data?.enquiries) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateEnquiryStatus(id, { status });
      toast.success(`Inquiry marked as ${status}`);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout
      title={`Direct Buyer Inquiries (${enquiries.length})`}
      subtitle="Inquiries submitted directly by interested buyers and tenants for your properties."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Inquiries Yet</h3>
          <p className="text-xs text-slate-500">Buyer requests for your listings will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">{enq.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDate(enq.createdAt)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <a href={`tel:${enq.phone}`} className="font-bold text-emerald-700 hover:underline">
                    Phone: {enq.phone}
                  </a>
                  <span>Email: {enq.email}</span>
                  <span className="text-slate-500">Property: {enq.property?.title || 'Listing'}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                  "{enq.message}"
                </p>
              </div>

              <div className="flex-shrink-0">
                <select
                  value={enq.status}
                  onChange={(e) => handleStatusUpdate(enq._id, e.target.value)}
                  className="text-xs font-bold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
