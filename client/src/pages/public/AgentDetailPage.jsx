import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Send,
  Sparkles,
  MapPin,
  CheckCircle2,
  Briefcase,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyGridSkeleton } from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Modal from '../../components/common/Modal';
import { getAgentById } from '../../services/agentService';

export default function AgentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAgentById(id);
        if (res?.data) {
          setAgent(res.data.agent);
          setProperties(res.data.properties || []);
          setContactForm((prev) => ({
            ...prev,
            message: `Hello ${res.data.agent?.name}, I am looking for properties in your listed regions. Please reach out to me.`,
          }));
        }
      } catch (err) {
        console.error('Failed to load agent profile:', err);
        setError(err.message || 'Agent not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      toast.error('Please fill in required fields.');
      return;
    }
    toast.success(`Message sent directly to ${agent?.name}!`);
    setContactModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <PropertyGridSkeleton count={3} />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This agent profile does not exist.'}</p>
        <Link to="/agents">
          <Button variant="primary" size="md" className="!rounded-2xl font-bold">
            Browse All Agents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 1. Header Banner */}
      <div className="bg-[#0b1528] pt-32 pb-24 border-b border-white/10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,90,60,0.2),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Agents</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Agent Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-10 mb-12 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-[#0b1528] text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-slate-900/15 flex-shrink-0 overflow-hidden">
                  {agent.avatar ? (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    agent.name?.charAt(0)?.toUpperCase() || 'A'
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-3 ring-white" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    RERA Accredited Partner
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Active since {formatDate(agent.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mb-1 leading-tight">
                  {agent.name}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#ff5a3c] flex items-center gap-1.5 mb-3">
                  <Building className="w-4 h-4" />
                  <span>{agent.agencyName || 'EstateCraft Premier Advisory Partner'}</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
                  {agent.bio ||
                    'Experienced real estate advisor specializing in luxury residential apartments, independent duplex villas, and high-yield commercial hubs.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={() => setContactModalOpen(true)}
                variant="primary"
                size="md"
                icon={Send}
                className="!rounded-2xl !py-3.5 !px-6 shadow-lg shadow-[#ff5a3c]/30 font-bold text-sm"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Active Property Listings */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
                Portfolio Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Active Listings by {agent.name} ({properties.length})
              </h2>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <p className="text-sm font-medium text-slate-500 mb-6">
                This advisor currently has no active public listings on the catalog.
              </p>
              <Link to="/properties">
                <Button variant="primary" size="md" className="!rounded-2xl font-bold">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Direct Contact Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={`Message ${agent.name}`}
        subtitle={`Agency: ${agent.agencyName || 'EstateCraft Premier Partner'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <FormInput
            label="Your Full Name"
            name="name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            placeholder="Jane Smith"
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            placeholder="jane@example.com"
            required
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={contactForm.phone}
            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Custom Message
            </label>
            <textarea
              rows={3}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full !rounded-2xl !py-3.5 font-bold shadow-lg shadow-[#ff5a3c]/30 text-sm"
            >
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


