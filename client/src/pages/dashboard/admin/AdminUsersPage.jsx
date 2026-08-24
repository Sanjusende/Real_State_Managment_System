import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import {
  getAdminUsers,
  toggleUserBlock,
  updateAdminUser,
  deleteAdminUser,
} from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'All Roles' },
  { value: 'USER', label: 'Buyers (User)' },
  { value: 'AGENT', label: 'Agents' },
  { value: 'SELLER', label: 'Sellers' },
  { value: 'ADMIN', label: 'Administrators' },
];

const EDITABLE_ROLES = [
  { value: 'USER', label: 'USER (Buyer/Client)' },
  { value: 'AGENT', label: 'AGENT (Partner)' },
  { value: 'SELLER', label: 'SELLER (Owner Direct)' },
  { value: 'ADMIN', label: 'ADMIN (Full Access)' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    agencyName: '',
    role: 'USER',
    isVerified: false,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedRole !== 'ALL') params.role = selectedRole;
      if (selectedStatus !== 'ALL') params.isBlocked = selectedStatus === 'BLOCKED';

      const res = await getAdminUsers(params);
      if (res?.data?.users) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [selectedRole, selectedStatus, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleToggleBlock = async (user) => {
    try {
      const res = await toggleUserBlock(user._id);
      const isNowBlocked = res?.data?.isBlocked;
      toast.success(isNowBlocked ? `User ${user.email} blocked.` : `User ${user.email} unblocked.`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBlocked: isNowBlocked } : u))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      agencyName: user.agencyName || '',
      role: user.role || 'USER',
      isVerified: Boolean(user.isVerified),
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      await updateAdminUser(editingUser._id, editForm);
      toast.success('User updated successfully');
      setEditModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminUser(userToDelete._id);
      toast.success('User and associated listings deleted.');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title={`User Directory & Access Control (${totalCount})`}
      subtitle="Search, filter, edit roles, toggle account security locks, and manage platform members."
    >
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or agency..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {['ALL', 'USER', 'AGENT', 'SELLER', 'ADMIN'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setSelectedRole(r);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  selectedRole === r ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Users Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or role filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Phone / Agency</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Listings</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            u.name?.charAt(0)?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{u.name}</span>
                            {u.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Account" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'AGENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'SELLER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <span className="block font-semibold">{u.phone || '—'}</span>
                      {u.agencyName && <span className="text-[10px] text-slate-400 block">{u.agencyName}</span>}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-100 text-red-700">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {u.propertiesCount || 0}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(u)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            u.isBlocked
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={u.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserToDelete(u);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete User"
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

          {/* Pagination Controls */}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit User: ${editingUser?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />

          <FormSelect
            label="Account Role"
            name="role"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            options={EDITABLE_ROLES}
          />

          <FormInput
            label="Agency Name (For Agents)"
            name="agencyName"
            value={editForm.agencyName}
            onChange={(e) => setEditForm({ ...editForm, agencyName: e.target.value })}
          />

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isVerified}
              onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">Mark as Verified Member / Consultant</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={savingEdit}>
              Save User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User Account"
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <span className="font-bold text-slate-900">{userToDelete?.name} ({userToDelete?.email})</span>?
          All properties listed by this account will also be removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={confirmDelete}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
