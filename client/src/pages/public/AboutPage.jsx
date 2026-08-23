import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  Target,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';

const LEADERSHIP_TEAM = [
  {
    name: 'Vikramaditya Singhania',
    role: 'Founder & Chief Executive Officer',
    bio: 'Former real estate investment director with 18+ years of expertise in luxury residential and commercial developments.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Priyanka Nambiar',
    role: 'Head of Legal & Title Verification',
    bio: 'Senior corporate counsel specialized in Indian property laws, RERA compliances, and clear-title audits.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Arjun Venkatesh',
    role: 'Chief Technology & Data Officer',
    bio: 'Built enterprise-scale real estate search engines, algorithmic valuation models, and automated mapping platforms.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <section className="bg-slate-950 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-10 left-1/3 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story & Mission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Redefining Transparency In Real Estate.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            EstateCraft was founded on a simple principle: every homebuyer and investor deserves 100% verified legal clarity, honest market pricing, and zero hidden brokerage.
          </p>
        </div>
      </section>

      {/* 2. Key Numbers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xl text-center">
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-emerald-700">₹ 850+ Cr</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Property Transactions</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-slate-900">5,000+</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Verified Listings</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-slate-900">12+</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Metropolitan Regions</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-emerald-700">99.8%</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Verified Title Rate</span>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Values That Drive Everything We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Uncompromising Due Diligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every property cataloged undergoes strict title searches, encumbrance verification, and layout approval checks before listing.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Client-Centric Integrity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We eliminate predatory pricing and misleading specs. What you see on EstateCraft is what you get during the physical site visit.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">High-Tech Simplicity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                From fast multi-criteria MongoDB queries to automated appointment booking, our tech engine saves dozens of hours for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership Team */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Experienced Minds
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Leadership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-slate-50 rounded-3xl border border-slate-200/80 p-8 text-center flex flex-col items-center"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl object-cover mb-5 shadow-md"
                />
                <h3 className="text-base font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-xs font-semibold text-emerald-700 mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-4">Ready to find your next luxury home?</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
            Browse through hundreds of approved properties with verified documentation and instant site visit booking.
          </p>
          <Link to="/properties">
            <Button variant="primary" size="lg">
              Explore Property Catalog
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
