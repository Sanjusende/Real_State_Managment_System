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
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { getMyProperties, deleteProperty, updatePropertyStatus } from '../../../services/dashboardService';
import { formatPrice, formatArea, formatDate } from '../../../utils/formatters';

const STATUS_OPTIONS = ['ALL', 'AVAILABLE', 'SOLD', 'RENTED', 'INACTIVE'];

export default function AgentPropertiesPage() {
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
      const params = {};
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      const res = await getMyProperties(params);
      if (res?.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Failed to load agent listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [selectedStatus]);

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await updatePropertyStatus(propertyId, newStatus);
      toast.success(`Property marked as ${newStatus}`);
      setProperties((prev) =>
        prev.map((p) => (p._id === propertyId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      await deleteProperty(propertyToDelete._id);
      toast.success('Property removed from catalog.');
      setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete._id));
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch (err) {
      toast.error('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = properties.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="My Property Portfolio"
      subtitle="Manage, edit, update inventory status, and track public engagement metrics for your listings."
    >
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or city..."
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

          <Link to="/agent/properties/create">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            You don't have any properties matching this filter. Click below to add a new listing.
          </p>
          <Link to="/agent/properties/create">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Post New Property
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
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((property) => (
                  <tr key={property._id} className="hover:bg-slate-50/80 transition">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img
                            src={
                              property.thumbnail ||
                              property.images?.[0]?.url ||
                              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {property.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {property.city}, {property.state}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {formatPrice(property.price, property.priceUnit)}
                    </td>

                    {/* Type & Intent */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 block">{property.propertyType}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        For {property.listingType}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={property.status || 'AVAILABLE'}
                        onChange={(e) => handleStatusChange(property._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border cursor-pointer ${
                          property.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : property.status === 'SOLD'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : property.status === 'RENTED'
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

                    {/* Approval Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          property.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {property.approvalStatus || 'APPROVED'}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.views || 0}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {property.slug && (
                          <Link
                            to={`/properties/${property.slug}`}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          to={`/agent/properties/${property._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setPropertyToDelete(property);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Listing"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        title="Delete Property Listing"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <span className="font-bold text-slate-900">"{propertyToDelete?.title}"</span>? This action cannot be undone.
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
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
