import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Star,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { AgentCardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { getAgents } from '../../services/agentService';
import clsx from 'clsx';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAgents = async (searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAgents({ search: searchTerm });
      if (res?.data?.agents) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
      setError(err.message || 'Failed to load agent directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAgents(search);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 1. Top Luxury Dark Hero Header */}
      <div className="bg-[#0b1528] pt-32 pb-24 border-b border-white/10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,90,60,0.2),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5a3c]/15 text-[#ff5a3c] border border-[#ff5a3c]/30 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Real Estate Advisors</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Connect with Licensed <span className="text-[#ff5a3c]">Property Experts</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Partner with accredited regional consultants with verified transaction records, RERA accreditation, and deep corridor intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="bg-white rounded-3xl p-4 shadow-md shadow-slate-900/5 border border-slate-200/90 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#ff5a3c] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search advisor by name, agency, or specialization..."
                className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c] transition"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="!rounded-2xl !py-3 !px-6 font-bold shadow-lg shadow-[#ff5a3c]/30"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* 3. Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => loadAgents(search)} />
        ) : agents.length === 0 ? (
          <EmptyState
            title="No agents found"
            description="Try a different search term or clear the search query."
            actionLabel="View All Agents"
            onAction={() => {
              setSearch('');
              loadAgents('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-md shadow-slate-900/5 hover:shadow-xl hover:border-[#ff5a3c]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Avatar & Verified Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-[#0b1528] text-white flex items-center justify-center text-2xl font-black shadow-md flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
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
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </div>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      RERA VERIFIED
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-1.5">5.0 (Top Rated)</span>
                  </div>

                  {/* Name & Agency */}
                  <h3 className="text-lg font-extrabold text-slate-950 mb-1 leading-snug">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-bold text-[#ff5a3c] flex items-center gap-1.5 mb-3">
                    <Building className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{agent.agencyName || 'EstateCraft Premier Partner'}</span>
                  </p>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-5 font-normal">
                    {agent.bio ||
                      'Specializing in premium residential flats, luxury villas, and high-yield commercial hubs.'}
                  </p>

                  {/* Highlights Box */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-5 text-center">
                    <div>
                      <span className="text-base font-black text-slate-900 block">
                        {agent.propertiesCount || 0}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                        Active Listings
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-black text-[#ff5a3c] block">
                        100%
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                        Clear Title
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Action */}
                <div className="pt-2">
                  <Link
                    to={`/agents/${agent._id}`}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0b1528] hover:bg-[#ff5a3c] text-white font-bold text-xs transition-all shadow-sm hover:shadow-lg hover:shadow-[#ff5a3c]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Profile & Listings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Join as an Agent Banner */}
        <div className="mt-20 rounded-3xl bg-[#0b1528] text-white p-8 md:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,60,0.2),transparent)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
                Partner With EstateCraft
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
                Are You a Licensed Real Estate Agent?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Join our certified partner network to showcase your luxury listings to 50,000+ verified buyers, access algorithmic valuation tools, and close deals faster.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="!rounded-2xl !py-3.5 !px-8 font-bold shadow-xl shadow-[#ff5a3c]/30 text-sm"
                >
                  Apply for Agent Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


