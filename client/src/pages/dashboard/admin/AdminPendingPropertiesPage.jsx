import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
} from '../../../services/adminService';
import { formatPrice, formatArea, formatDate } from '../../../utils/formatters';

export default function AdminPendingPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectReason, setRejectReason] = useState('Listing does not satisfy image clarity or title verification guidelines');
  const [rejecting, setRejecting] = useState(false);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await getPendingProperties({ limit: 50 });
      if (res?.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch {
      toast.error('Failed to load pending queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id, title) => {
    try {
      await approveProperty(id);
      toast.success(`"${title}" approved & published!`);
      loadPending();
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
      loadPending();
    } catch {
      toast.error('Failed to reject property');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <DashboardLayout
      title={`Pending Approval Queue (${properties.length})`}
      subtitle="Moderation queue for newly submitted Agent & Seller properties. Verified listings appear on the public catalog immediately upon approval."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Queue is Clear!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            All submitted property listings have been verified and processed. New submissions will appear here automatically.
          </p>
          <Link to="/admin/properties">
            <Button variant="outline" size="sm">
              View All Property Inventory
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition"
            >
              {/* Left Details */}
              <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
                <div className="w-full sm:w-44 h-32 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={p.thumbnail || p.images?.[0]?.url || ''}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                      Pending Review
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {p.propertyType} • For {p.listingType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Submitted {formatDate(p.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>

                  <p className="text-sm font-extrabold text-emerald-700">
                    {formatPrice(p.price, p.priceUnit)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.address}, {p.city}, {p.state}
                    </span>
                    {p.area && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        {formatArea(p.area, p.areaUnit)}
                      </span>
                    )}
                    {p.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        {p.bedrooms} Beds
                      </span>
                    )}
                  </div>

                  <div className="pt-1 text-xs text-slate-500">
                    Submitter:{' '}
                    <strong className="text-slate-800 font-bold">
                      {p.owner?.name || p.agent?.name || 'Owner'}
                    </strong>{' '}
                    ({p.owner?.email || p.agent?.email}) • Role: {p.owner?.role || 'AGENT'}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex sm:flex-row lg:flex-col items-center gap-2 w-full lg:w-auto flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <Button
                  variant="primary"
                  size="md"
                  icon={CheckCircle2}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove(p._id, p.title)}
                >
                  Approve Listing
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  icon={XCircle}
                  className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setSelectedProperty(p);
                    setRejectModalOpen(true);
                  }}
                >
                  Reject with Reason
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Reject Property: "${selectedProperty?.title}"`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Explain why this listing was rejected. The submitter will receive an instant notification with instructions for modification.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason / Feedback
            </label>
            <textarea
              rows={4}
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
    </DashboardLayout>
  );
}
