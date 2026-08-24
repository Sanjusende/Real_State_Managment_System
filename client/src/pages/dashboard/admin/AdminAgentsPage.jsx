import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Mail,
  Phone,
  Edit,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/common/FormInput';
import {
  getAdminUsers,
  toggleUserBlock,
  updateAdminUser,
} from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [form, setForm] = useState({ agencyName: '', phone: '', isVerified: false });
  const [saving, setSaving] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ role: 'AGENT', search });
      if (res?.data?.users) {
        setAgents(res.data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleToggleVerify = async (agent) => {
    try {
      await updateAdminUser(agent._id, { isVerified: !agent.isVerified });
      toast.success(agent.isVerified ? 'Verification removed' : 'Agent verified successfully!');
      loadAgents();
    } catch (err) {
      toast.error('Failed to update verification');
    }
  };

  const handleToggleBlock = async (agent) => {
    try {
      await toggleUserBlock(agent._id);
      toast.success('Agent status updated');
      loadAgents();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openEdit = (agent) => {
    setSelectedAgent(agent);
    setForm({
      agencyName: agent.agencyName || '',
      phone: agent.phone || '',
      isVerified: Boolean(agent.isVerified),
    });
    setEditModalOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setSaving(true);
    try {
      await updateAdminUser(selectedAgent._id, form);
      toast.success('Agent details updated');
      setEditModalOpen(false);
      loadAgents();
    } catch {
      toast.error('Failed to update agent');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title={`Agent Partners & Brokerages (${agents.length})`}
      subtitle="Manage real estate consultants, verify broker licenses, monitor portfolio sizes, and manage agent access."
    >
      {/* Top Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadAgents()}
            placeholder="Search agents by name, agency, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
          />
        </div>
        <Button variant="primary" size="sm" onClick={loadAgents}>
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Agents Found</h3>
          <p className="text-xs text-slate-500">There are no registered agents matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-purple-300 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      agent.name?.charAt(0)?.toUpperCase() || 'A'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{agent.name}</h3>
                      {agent.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-purple-700 font-semibold block">
                      {agent.agencyName || 'Independent Consultant'}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    agent.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {agent.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{agent.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{agent.propertiesCount || 0} Managed Properties</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVerify(agent)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    agent.isVerified
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {agent.isVerified ? 'Unverify' : 'Verify Badge'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(agent)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title="Edit Agent"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(agent)}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      agent.isBlocked
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                    title={agent.isBlocked ? 'Unblock' : 'Block'}
                  >
                    {agent.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Agent Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Agent Partner: ${selectedAgent?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={saveEdit} className="space-y-4">
          <FormInput
            label="Agency / Brokerage Name"
            name="agencyName"
            value={form.agencyName}
            onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
            placeholder="e.g. Apex Realty Partners"
          />

          <FormInput
            label="Contact Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVerified}
              onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">Verified Consultant Badge</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
