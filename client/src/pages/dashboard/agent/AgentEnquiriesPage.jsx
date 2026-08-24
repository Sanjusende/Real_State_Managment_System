import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { getReceivedEnquiries, updateEnquiryStatus } from '../../../services/enquiryService';
import { formatDate } from '../../../utils/formatters';

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'];

export default function AgentEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [statusChoice, setStatusChoice] = useState('PENDING');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedFilter !== 'ALL') params.status = selectedFilter;
      const res = await getReceivedEnquiries(params);
      if (res?.data?.enquiries) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load received enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [selectedFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, { status: newStatus });
      toast.success(`Inquiry status updated to ${newStatus}`);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      toast.error('Failed to update inquiry status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await updateEnquiryStatus(selectedEnquiry._id, {
        status: statusChoice,
        notes: notesText,
      });
      toast.success('Lead notes saved!');
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === selectedEnquiry._id
            ? { ...e, status: statusChoice, notes: notesText }
            : e
        )
      );
      setNotesModalOpen(false);
    } catch (err) {
      toast.error('Failed to update notes');
    }
  };

  return (
    <DashboardLayout
      title={`Buyer Inquiries & Leads (${enquiries.length})`}
      subtitle="Direct inquiries and inspection requests submitted by prospective buyers for your listings."
    >
      {/* Status Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === st
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Leads Found</h3>
          <p className="text-xs text-slate-500">Inquiries submitted by buyers will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-900">{enq.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : enq.status === 'CONTACTED'
                        ? 'bg-blue-100 text-blue-800'
                        : enq.status === 'CLOSED'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(enq.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <a
                    href={`tel:${enq.phone}`}
                    className="flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{enq.phone}</span>
                  </a>
                  <a
                    href={`mailto:${enq.email}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{enq.email}</span>
                  </a>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{enq.property?.title || 'Property'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic">
                  "{enq.message}"
                </p>

                {enq.notes && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                    <strong className="font-bold">Internal Note:</strong> {enq.notes}
                  </p>
                )}
              </div>

              {/* Right Status Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="flex items-center gap-2">
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setStatusChoice(enq.status);
                      setNotesText(enq.notes || '');
                      setNotesModalOpen(true);
                    }}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note & Status Update Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title="Lead Management Notes"
        subtitle={`Lead: ${selectedEnquiry?.name} (${selectedEnquiry?.phone})`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Update Lead Status
            </label>
            <select
              value={statusChoice}
              onChange={(e) => setStatusChoice(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-200 p-2.5 text-slate-900 cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Internal Follow-up Notes
            </label>
            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Scheduled physical site visit on Saturday 11 AM..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setNotesModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveNotes}>
              Save Lead Details
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
