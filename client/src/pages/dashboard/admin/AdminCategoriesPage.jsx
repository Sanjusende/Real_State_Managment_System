import React, { useState, useEffect } from 'react';
import {
  Tags,
  PlusCircle,
  Edit,
  Trash2,
  Building2,
  Home,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/common/FormInput';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../../services/adminService';

const ICON_OPTIONS = [
  'Building2',
  'Home',
  'Building',
  'Warehouse',
  'Castle',
  'Layers',
  'Compass',
  'Sparkles',
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name: '',
    icon: 'Building2',
    description: '',
    image: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getAdminCategories();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', icon: 'Building2', description: '', image: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      icon: cat.icon || 'Building2',
      description: cat.description || '',
      image: cat.image || '',
      isActive: Boolean(cat.isActive),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, form);
        toast.success('Category updated successfully');
      } else {
        await createAdminCategory(form);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteAdminCategory(categoryToDelete._id);
      toast.success('Category removed.');
      setDeleteModalOpen(false);
      loadCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <DashboardLayout
      title={`Category Taxonomy Manager (${categories.length})`}
      subtitle="Organize residential, commercial, industrial, and agricultural classification types across the catalog."
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs font-bold text-slate-500">
          {categories.length} active asset classifications
        </span>
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={openCreate}>
          Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Tags className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Categories Found</h3>
          <p className="text-xs text-slate-500 mb-4">Click below to establish your initial category master list.</p>
          <Button variant="primary" size="sm" onClick={openCreate}>
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{cat.description || 'No description provided.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">
                  {cat.propertyCount || 0} Listed Properties
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryToDelete(cat);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete"
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
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Category Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Luxury Apartments"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Icon Key
            </label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full text-xs font-bold rounded-xl border border-slate-200 p-2.5 text-slate-900 cursor-pointer"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description for SEO and catalog filters..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
            />
          </div>

          <FormInput
            label="Thumbnail Banner URL"
            name="image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
          />

          <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">Active on Catalog Filters</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Category"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-slate-900">"{categoryToDelete?.name}"</span>?
          Existing properties under this category will have their category unlinked.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Confirm Remove
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
