import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Building,
  User,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import {
  getAdminReviews,
  updateAdminReviewStatus,
  deleteAdminReview,
} from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await getAdminReviews(params);
      if (res?.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAdminReviewStatus(id, status);
      toast.success(`Review ${status.toLowerCase()} successfully`);
      loadReviews();
    } catch {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminReview(id);
      toast.success('Review removed');
      loadReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <DashboardLayout
      title={`Property Reviews Moderation (${reviews.length})`}
      subtitle="Moderate home seeker ratings, comments, and public client testimonials."
    >
      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                statusFilter === st ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Reviews Found</h3>
          <p className="text-xs text-slate-500">There are no property reviews matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-purple-300 transition"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {rev.status}
                  </span>

                  <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{rev.comment}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>
                    Reviewer: <strong className="text-slate-800">{rev.user?.name || 'Client'}</strong> ({rev.user?.email})
                  </span>
                  <span>
                    Property: <strong className="text-slate-800">{rev.property?.title || 'Listing'}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {rev.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev._id, 'APPROVED')}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                    title="Approve Review"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}

                {rev.status !== 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev._id, 'REJECTED')}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                    title="Reject Review"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(rev._id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
