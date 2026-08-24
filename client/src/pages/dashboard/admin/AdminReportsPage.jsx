import React, { useState, useEffect } from 'react';
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import {
  getAdminReports,
  updateAdminReportStatus,
  deleteAdminReport,
} from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusChoice, setStatusChoice] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await getAdminReports(params);
      if (res?.data?.reports) {
        setReports(res.data.reports);
      }
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const openEdit = (report) => {
    setSelectedReport(report);
    setStatusChoice(report.status === 'PENDING' ? 'RESOLVED' : report.status);
    setAdminNotes(report.adminNotes || '');
    setEditModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSaving(true);
    try {
      await updateAdminReportStatus(selectedReport._id, {
        status: statusChoice,
        adminNotes,
      });
      toast.success(`Report marked as ${statusChoice}`);
      setEditModalOpen(false);
      loadReports();
    } catch {
      toast.error('Failed to update report');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminReport(id);
      toast.success('Report removed');
      loadReports();
    } catch {
      toast.error('Failed to delete report');
    }
  };

  return (
    <DashboardLayout
      title={`Flagged Content & User Reports (${reports.length})`}
      subtitle="Moderation portal for reported properties, fraudulent listings, and user abuse tickets."
    >
      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
          {['ALL', 'PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED', 'DISMISSED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Flag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Reports Found</h3>
          <p className="text-xs text-slate-500">There are no flagged moderation tickets in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const reporterObj = r.reportedBy || r.reporter;
            return (
              <div
                key={r._id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">
                      {r.reason ? r.reason.replace(/_/g, ' ') : 'FLAGGED LISTING'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'REJECTED' || r.status === 'DISMISSED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-[11px] text-slate-400">Filed {formatDate(r.createdAt)}</span>
                  </div>

                  {r.property && (
                    <div className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">
                      Reported Property: <span className="text-emerald-700">{r.property.title}</span> ({r.property.city})
                    </div>
                  )}

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    "{r.description}"
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Reported by: <span className="text-slate-700 font-semibold">{reporterObj?.name || 'Verified User'}</span> ({reporterObj?.email || 'N/A'})
                  </div>

                  {r.adminNotes && (
                    <p className="text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                      <strong>Admin Resolution Notes:</strong> {r.adminNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition cursor-pointer"
                  >
                    Moderate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r._id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Moderation Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Moderate Flagged Report"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Resolution Status
            </label>
            <select
              value={statusChoice}
              onChange={(e) => setStatusChoice(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-200 p-2.5 text-slate-900 cursor-pointer"
            >
              <option value="PENDING">PENDING (Keep in Queue)</option>
              <option value="REVIEWING">REVIEWING (Under Investigation)</option>
              <option value="RESOLVED">RESOLVED (Action Taken)</option>
              <option value="REJECTED">REJECTED (Invalid / Discarded)</option>
              <option value="DISMISSED">DISMISSED (Dismiss Report)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Administrative Resolution Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Property owner updated misleading price..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Moderation
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
