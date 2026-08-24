import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  ShieldCheck,
  User,
  Building2,
  Tags,
  MapPin,
  Clock,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getAdminActivityLogs } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

const ENTITY_FILTERS = ['ALL', 'Property', 'User', 'Category', 'Location', 'Enquiry', 'Review', 'Report', 'Setting'];

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (entityFilter !== 'ALL') params.entityType = entityFilter;
      const res = await getAdminActivityLogs(params);
      if (res?.data?.logs) {
        setLogs(res.data.logs);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [entityFilter, page]);

  return (
    <DashboardLayout
      title={`System Audit & Activity Trail (${totalCount})`}
      subtitle="Immutable audit log recording administrative operations, approval events, security changes, and catalog updates."
    >
      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {ENTITY_FILTERS.map((ef) => (
            <button
              key={ef}
              type="button"
              onClick={() => {
                setEntityFilter(ef);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                entityFilter === ef ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ef}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Activity Logs Found</h3>
          <p className="text-xs text-slate-500">Activity will be logged automatically as users and administrators perform actions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div
                key={log._id}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 font-extrabold mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{log.action}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                        {log.entityType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{log.details || 'Administrative operation recorded.'}</p>

                    <div className="text-[11px] text-slate-400">
                      Operator: <span className="text-slate-700 font-semibold">{log.user?.name || 'System / Automated'}</span> ({log.user?.email || 'System'})
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
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
    </DashboardLayout>
  );
}
