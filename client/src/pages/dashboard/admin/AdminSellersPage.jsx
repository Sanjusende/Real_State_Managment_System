import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Building2,
  Mail,
  Phone,
  Lock,
  Unlock,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import { getAdminUsers, toggleUserBlock } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSellers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ role: 'SELLER', search });
      if (res?.data?.users) {
        setSellers(res.data.users);
      }
    } catch {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleToggleBlock = async (seller) => {
    try {
      await toggleUserBlock(seller._id);
      toast.success('Seller status updated');
      loadSellers();
    } catch (err) {
      toast.error(err.message || 'Failed to update seller');
    }
  };

  return (
    <DashboardLayout
      title={`Direct Property Sellers (${sellers.length})`}
      subtitle="Monitor direct property owners, their listings, inquiries received, and account status."
    >
      {/* Top Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadSellers()}
            placeholder="Search sellers by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
          />
        </div>
        <Button variant="primary" size="sm" onClick={loadSellers}>
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Sellers Found</h3>
          <p className="text-xs text-slate-500">No seller accounts registered matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-amber-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                    {seller.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{seller.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Direct Owner
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    seller.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {seller.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{seller.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{seller.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{seller.propertiesCount || 0} Direct Properties Listed</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Joined {formatDate(seller.createdAt)}</span>
                <button
                  type="button"
                  onClick={() => handleToggleBlock(seller)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    seller.isBlocked
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {seller.isBlocked ? 'Unblock' : 'Block Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
