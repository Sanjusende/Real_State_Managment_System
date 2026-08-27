import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { getMyProperties, deleteProperty, updatePropertyStatus } from '../../../services/dashboardService';
import { formatPrice } from '../../../utils/formatters';

const STATUS_OPTIONS = ['ALL', 'AVAILABLE', 'SOLD', 'RENTED', 'INACTIVE'];

export default function SellerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      const res = await getMyProperties(params);
      if (res?.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Failed to load seller listings:', err);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [selectedStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      toast.success(`Property marked as ${status}`);
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      await deleteProperty(propertyToDelete._id);
      toast.success('Property removed from portfolio.');
      setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete._id));
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch {
      toast.error('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = properties.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Direct Owner Properties"
      subtitle="Manage your listed homes, update availability status, or edit property information."
    >
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, city, or address..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
        </div>

        {/* Status Filters & Create Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <Link to="/seller/properties/create">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Post New Listing
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Properties Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Post your property directly to connect with active prospective buyers with zero brokerage.
          </p>
          <Link to="/seller/properties/create">
            <Button variant="primary" size="md" icon={PlusCircle}>
              List Your Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img
                            src={p.thumbnail || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">{p.title}</span>
                          <span className="text-[11px] text-slate-400 block truncate">{p.city}, {p.state} • {p.propertyType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatPrice(p.price, p.priceUnit)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={p.status || 'AVAILABLE'}
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border cursor-pointer ${
                          p.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : p.status === 'SOLD'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : p.status === 'RENTED'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="SOLD">SOLD</option>
                        <option value="RENTED">RENTED</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.approvalStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.approvalStatus || 'PENDING'}
                      </span>
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
                            title="Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/seller/properties/${p._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setPropertyToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete"
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
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        title="Remove Property Listing"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-slate-900">"{propertyToDelete?.title}"</span>? This will permanently remove it from your portfolio.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDeleteModalOpen(false);
              setPropertyToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleting}
            onClick={confirmDelete}
          >
            Delete Listing
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
