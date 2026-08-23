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
      <div className="max-w-7xl mx-auto px-4 py-16">
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
          <Button variant="primary" size="md">
            Browse All Agents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Agents</span>
          </button>
        </div>

        {/* Agent Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-10 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-emerald-700 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-emerald-700/20 flex-shrink-0">
                {agent.avatar ? (
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full rounded-3xl object-cover"
                  />
                ) : (
                  agent.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Consultant
                  </span>
                  <span className="text-xs text-slate-400">
                    Member since {formatDate(agent.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                  {agent.name}
                </h1>
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-2">
                  <Building className="w-3.5 h-3.5" />
                  <span>{agent.agencyName || 'Independent Real Estate Specialist'}</span>
                </p>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  {agent.bio ||
                    'Experienced real estate advisor with dedicated expertise in luxury residential homes, apartments, and corporate commercial spaces.'}
                </p>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
              <Button
                onClick={() => setContactModalOpen(true)}
                variant="primary"
                size="md"
                icon={Send}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Active Property Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Active Listings by {agent.name} ({properties.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All properties currently represented and managed by this verified consultant.
              </p>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-sm text-slate-500 mb-4">
                This agent currently has no active public listings on the catalog.
              </p>
              <Link to="/properties">
                <Button variant="outline" size="sm">
                  Explore All Properties
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
        subtitle={`Agency: ${agent.agencyName || 'EstateCraft Real Estate'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <FormInput
            label="Your Name"
            name="name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            placeholder="Jane Smith"
            required
          />

          <FormInput
            label="Your Email"
            name="email"
            type="email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            placeholder="jane@example.com"
            required
          />

          <FormInput
            label="Your Phone"
            name="phone"
            type="tel"
            value={contactForm.phone}
            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              rows={3}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
