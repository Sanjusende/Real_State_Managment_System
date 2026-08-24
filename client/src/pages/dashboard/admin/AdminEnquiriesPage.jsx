import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import {
  getAdminEnquiries,
  updateAdminEnquiry,
  deleteAdminEnquiry,
} from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit/Notes Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusChoice, setStatusChoice] = useState('PENDING');
  const [notesText, setNotesText] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await getAdminEnquiries(params);
      if (res?.data?.enquiries) {
        setEnquiries(res.data.enquiries);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadEnquiries();
  };

  const openEdit = (enq) => {
    setSelectedEnquiry(enq);
    setStatusChoice(enq.status);
    setNotesText(enq.notes || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSaving(true);
    try {
      await updateAdminEnquiry(selectedEnquiry._id, {
        status: statusChoice,
        notes: notesText,
      });
      toast.success('Inquiry updated successfully');
      setEditModalOpen(false);
      loadEnquiries();
    } catch {
      toast.error('Failed to update inquiry');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      await deleteAdminEnquiry(enquiryToDelete._id);
      toast.success('Inquiry deleted');
      setDeleteModalOpen(false);
      loadEnquiries();
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  return (
    <DashboardLayout
      title={`System Buyer Inquiries & Leads (${totalCount})`}
      subtitle="Monitor all prospective buyer communication, consultant assignments, and lead resolution velocity."
    >
      {/* Top Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by buyer name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
          />
        </form>

        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === st ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Inquiries Found</h3>
          <p className="text-xs text-slate-500">No buyer inquiries matching your search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-purple-300 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
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
                  <span className="text-[11px] text-slate-400">{formatDate(enq.createdAt)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <a href={`tel:${enq.phone}`} className="font-bold text-purple-700 hover:underline">
                    Phone: {enq.phone}
                  </a>
                  <span>Email: {enq.email}</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Building className="w-3.5 h-3.5" />
                    <span>
                      Property: <strong>{enq.property?.title || 'Listing'}</strong> ({enq.property?.city || '—'})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Recipient: {enq.recipient?.name || 'Owner'} ({enq.recipient?.role})
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                  "{enq.message}"
                </p>

                {enq.notes && (
                  <p className="text-[11px] text-purple-900 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                    <strong>Admin/Agent Notes:</strong> {enq.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => openEdit(enq)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition cursor-pointer"
                >
                  Edit Status
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryToDelete(enq);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-white rounded-3xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Status & Notes Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Update Inquiry: ${selectedEnquiry?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Inquiry Status
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
              Internal Administrative Notes
            </label>
            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Inquiry"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6">
          Are you sure you want to permanently delete this buyer inquiry?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
