import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  Filter,
  PlusCircle,
  Edit,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
  toggleFeatureProperty,
  deleteAdminProperty,
} from '../../../services/adminService';
import { formatPrice, formatDate } from '../../../utils/formatters';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectReason, setRejectReason] = useState('Listing does not satisfy quality or title requirements');
  const [rejecting, setRejecting] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (approvalFilter !== 'ALL') params.approvalStatus = approvalFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await getAdminProperties(params);
      if (res?.data?.properties) {
        setProperties(res.data.properties);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load property inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [approvalFilter, statusFilter, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProperties();
  };

  const handleApprove = async (property) => {
    try {
      await approveProperty(property._id);
      toast.success(`"${property.title}" approved & published!`);
      loadProperties();
    } catch {
      toast.error('Failed to approve property');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;
    setRejecting(true);
    try {
      await rejectProperty(selectedProperty._id, rejectReason);
      toast.success(`"${selectedProperty.title}" rejected with feedback.`);
      setRejectModalOpen(false);
      loadProperties();
    } catch {
      toast.error('Failed to reject property');
    } finally {
      setRejecting(false);
    }
  };

  const handleToggleFeature = async (property) => {
    try {
      const res = await toggleFeatureProperty(property._id);
      const isNowFeatured = res?.data?.isFeatured;
      toast.success(isNowFeatured ? 'Property marked as Featured!' : 'Featured status removed.');
      setProperties((prev) =>
        prev.map((p) => (p._id === property._id ? { ...p, isFeatured: isNowFeatured } : p))
      );
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminProperty(propertyToDelete._id);
      toast.success('Property removed from catalog.');
      setDeleteModalOpen(false);
      loadProperties();
    } catch {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title={`Global Property Inventory (${totalCount})`}
      subtitle="Comprehensive control across all live, pending, sold, and rejected real estate assets."
    >
      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, city, locality..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setApprovalFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  approvalFilter === st ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="SOLD">SOLD</option>
            <option value="RENTED">RENTED</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <Link to="/agent/properties/create">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Property Inventory Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Properties Found</h3>
          <p className="text-xs text-slate-500">No property records matching your current filter set.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Owner / Agent</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img
                            src={p.thumbnail || p.images?.[0]?.url || ''}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">{p.title}</span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {p.city}, {p.state} • {p.propertyType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatPrice(p.price, p.priceUnit)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {p.owner?.name || p.agent?.name || 'Owner'}
                      </span>
                      <span className="text-[10px] text-purple-700 font-bold block uppercase">
                        {p.owner?.role || 'PARTNER'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.approvalStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {p.approvalStatus || 'PENDING'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-700">{p.status}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(p)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          p.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.views || 0}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.slug && (
                          <Link
                            to={`/properties/${p.slug}`}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Open Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          to={`/agent/properties/${p._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {p.approvalStatus !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(p)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Approve Property"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {p.approvalStatus !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProperty(p);
                              setRejectModalOpen(true);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Reject Listing"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setPropertyToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Reject Listing: "${selectedProperty?.title}"`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Provide feedback explaining why this listing was rejected. The submitter will receive an in-app notification.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rejection Reason / Required Edits
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit" loading={rejecting}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Property Permanently"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <span className="font-bold text-slate-900">"{propertyToDelete?.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
