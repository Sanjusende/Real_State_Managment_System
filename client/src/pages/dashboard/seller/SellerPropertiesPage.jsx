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

export default function SellerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await getMyProperties();
      if (res?.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

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
    try {
      await deleteProperty(propertyToDelete._id);
      toast.success('Property removed.');
      setProperties((prev) => prev.filter((p) => p._id !== propertyToDelete._id));
      setDeleteModalOpen(false);
    } catch {
      toast.error('Failed to delete property.');
    }
  };

  return (
    <DashboardLayout
      title="Seller Property Management"
      subtitle="Manage your listed homes, change status from Available to Sold, or edit details."
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-slate-500">
          Total {properties.length} listings managed
        </span>
        <Link to="/seller/properties/create">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Post New Listing
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Properties Listed Yet</h3>
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
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          <img
                            src={p.thumbnail || p.images?.[0]?.url || ''}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{p.title}</span>
                          <span className="text-[11px] text-slate-400 block">{p.city}, {p.state}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatPrice(p.price, p.priceUnit)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={p.status || 'AVAILABLE'}
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className="text-[11px] font-bold uppercase rounded-lg px-2 py-1 border bg-slate-50 cursor-pointer"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="SOLD">SOLD</option>
                        <option value="RENTED">RENTED</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {p.approvalStatus || 'APPROVED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.views || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.slug && (
                          <Link
                            to={`/properties/${p.slug}`}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg"
                            title="Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/seller/properties/${p._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg"
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
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
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
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Listing"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6">
          Are you sure you want to delete "{propertyToDelete?.title}"?
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
