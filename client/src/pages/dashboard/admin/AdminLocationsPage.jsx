import React, { useState, useEffect } from 'react';
import {
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  Star,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/common/FormInput';
import {
  getAdminLocations,
  createAdminLocation,
  updateAdminLocation,
  deleteAdminLocation,
} from '../../../services/adminService';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form, setForm] = useState({
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    image: '',
    isPopular: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await getAdminLocations();
      if (res?.data) {
        setLocations(res.data);
      }
    } catch {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const openCreate = () => {
    setEditingLocation(null);
    setForm({ city: '', state: 'Madhya Pradesh', country: 'India', pincode: '', image: '', isPopular: false });
    setModalOpen(true);
  };

  const openEdit = (loc) => {
    setEditingLocation(loc);
    setForm({
      city: loc.city || '',
      state: loc.state || '',
      country: loc.country || 'India',
      pincode: loc.pincode || '',
      image: loc.image || '',
      isPopular: Boolean(loc.isPopular),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingLocation) {
        await updateAdminLocation(editingLocation._id, form);
        toast.success('Location updated');
      } else {
        await createAdminLocation(form);
        toast.success('Location created');
      }
      setModalOpen(false);
      loadLocations();
    } catch (err) {
      toast.error(err.message || 'Failed to save location');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteAdminLocation(locationToDelete._id);
      toast.success('Location removed');
      setDeleteModalOpen(false);
      loadLocations();
    } catch {
      toast.error('Failed to delete location');
    }
  };

  return (
    <DashboardLayout
      title={`Geographic Locations Hub (${locations.length})`}
      subtitle="Manage target metropolitan markets, state boundaries, popular investment corridors, and location badges."
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs font-bold text-slate-500">
          {locations.length} supported cities and regions
        </span>
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreate}>
          Add New Location
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Locations Configured</h3>
          <p className="text-xs text-slate-500 mb-4">Add your primary launch cities to enable location filters on the public catalog.</p>
          <Button variant="primary" size="sm" onClick={openCreate}>
            Add First Location
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  {loc.isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Popular Corridor
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{loc.city}</h3>
                <p className="text-xs text-slate-500">{loc.state}, {loc.country}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">
                  {loc.propertyCount || 0} Properties Listed
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(loc)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                    title="Edit Location"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationToDelete(loc);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete Location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLocation ? `Edit Location: ${editingLocation.city}` : 'Add New Location'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="City Name"
              name="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Bhopal"
              required
            />
            <FormInput
              label="State"
              name="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="e.g. Madhya Pradesh"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Country"
              name="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </div>

          <FormInput
            label="City Photo / Skyline URL"
            name="image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
          />

          <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">Highlight as Featured / Popular Corridor</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Save Location
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Location"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-slate-900">"{locationToDelete?.city}, {locationToDelete?.state}"</span>?
          Existing properties will have their location relationship unlinked.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
