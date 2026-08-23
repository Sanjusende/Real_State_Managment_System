import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { AgentCardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { getAgents } from '../../services/agentService';

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
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Verified Real Estate Consultants</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Meet Our Top Licensed Agents
          </h1>
          <p className="text-sm text-slate-500">
            Work with verified regional experts who have proven transaction records and deep neighborhood insights.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agent by name or agency..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 shadow-xs"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Verified Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-700/20">
                      {agent.avatar ? (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        agent.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  {/* Name & Agency */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 mb-3">
                    <Building className="w-3.5 h-3.5" />
                    <span>{agent.agencyName || 'Independent Real Estate Advisor'}</span>
                  </p>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {agent.bio ||
                      'Specializing in premium residential flats, luxury villas, and high-yield commercial hubs.'}
                  </p>
                </div>

                {/* Contact & Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {agent.propertiesCount || 0}
                    </span>{' '}
                    active listings
                  </div>

                  <Link
                    to={`/agents/${agent._id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Agent & Listings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
