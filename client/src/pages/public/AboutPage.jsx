import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  Target,
  Sparkles,
  Award,
  Building,
  Users2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Key,
} from 'lucide-react';
import Button from '../../components/common/Button';

const LEADERSHIP_TEAM = [
  {
    name: 'Vikramaditya Singhania',
    role: 'Founder & Chief Executive Officer',
    bio: 'Former real estate investment director with 18+ years of expertise in luxury residential and commercial development corridors across India.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    experience: '18+ Years',
  },
  {
    name: 'Priyanka Nambiar',
    role: 'Head of Legal & Title Verification',
    bio: 'Senior corporate counsel specialized in Indian property laws, RERA compliances, encumbrance clearances, and clear-title audits.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    experience: '14+ Years',
  },
  {
    name: 'Arjun Venkatesh',
    role: 'Chief Technology & Data Officer',
    bio: 'Built enterprise-scale real estate search engines, algorithmic valuation models, and automated geo-spatial mapping platforms.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    experience: '12+ Years',
  },
];

const MILESTONES = [
  {
    year: '2018',
    title: 'Founding Vision',
    desc: 'Started in Bhopal with a mission to eliminate misleading property listings and fake broker claims.',
  },
  {
    year: '2021',
    title: 'RERA Integration',
    desc: 'Automated digital verification with state land records, achieving a 99.8% title clearance rate.',
  },
  {
    year: '2024',
    title: 'Multi-City Expansion',
    desc: 'Expanded verified portfolio across 12+ prime metropolitan corridors and over ₹850+ Cr in volume.',
  },
  {
    year: 'Today',
    title: 'AI Valuation & Booking',
    desc: 'Empowering over 50,000+ active buyers, institutional sellers, and verified real estate advisors.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Hero Banner */}
      <section className="bg-[#0b1528] text-white pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,90,60,0.2),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5a3c]/15 border border-[#ff5a3c]/30 text-[#ff5a3c] text-xs font-extrabold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Purpose</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Setting the Benchmark for <br className="hidden sm:inline" />
            <span className="text-[#ff5a3c]">Luxury & Legal Clarity</span> in Real Estate
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            EstateCraft was founded on a steadfast principle: every homebuyer, seller, and investor deserves 100% verified legal titles, authentic photography, honest pricing, and zero hidden brokerage.
          </p>
        </div>
      </section>

      {/* 2. Key Numbers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xl text-center">
          <div className="p-3">
            <span className="block text-3xl md:text-4xl font-black text-[#ff5a3c]">₹850+ Cr</span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Property Transactions</span>
          </div>
          <div className="p-3">
            <span className="block text-3xl md:text-4xl font-black text-slate-950">5,000+</span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Verified Listings</span>
          </div>
          <div className="p-3">
            <span className="block text-3xl md:text-4xl font-black text-slate-950">12+</span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Metropolitan Regions</span>
          </div>
          <div className="p-3">
            <span className="block text-3xl md:text-4xl font-black text-[#ff5a3c]">99.8%</span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Verified Clear Title</span>
          </div>
        </div>
      </section>

      {/* 3. Guiding Principles Bento Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              The Standards That Drive Everything We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md shadow-slate-900/5 hover:border-[#ff5a3c]/50 transition group">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Uncompromising Due Diligence</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Every property cataloged undergoes rigorous 40-point legal title searches, encumbrance verification, and layout approval checks before listing.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md shadow-slate-900/5 hover:border-[#ff5a3c]/50 transition group">
              <div className="w-14 h-14 rounded-2xl bg-[#0b1528] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-7 h-7 text-[#ff5a3c]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Client-Centric Integrity</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                We eliminate predatory pricing, hidden charges, and misleading carpet area specs. What you see on EstateCraft is exactly what is delivered.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md shadow-slate-900/5 hover:border-[#ff5a3c]/50 transition group">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">High-Tech Simplicity</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                From fast multi-criteria queries to automated physical inspection bookings, our technology platform saves dozens of hours for buyers and agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Journey Timeline Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Track Record of Continuous Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((m, idx) => (
              <div
                key={m.year}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#ff5a3c]/50 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#ff5a3c] block mb-2">{m.year}</span>
                  <h3 className="text-base font-bold text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
                <div className="w-8 h-1 bg-[#ff5a3c] rounded-full mt-6 opacity-60"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Executive Leadership */}
      <section className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
              Executive Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Guided by Industry Veterans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Combining decades of top-tier legal expertise, real estate investment acumen, and technological innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-slate-50 rounded-3xl border border-slate-200/90 p-8 text-center flex flex-col items-center hover:shadow-xl hover:border-[#ff5a3c]/40 transition group"
              >
                <div className="relative mb-5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-md ring-4 ring-white group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#0b1528] text-white text-[9px] font-extrabold uppercase tracking-wider border border-white/20">
                    {member.experience}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-950 mb-1">{member.name}</h3>
                <p className="text-xs font-bold text-[#ff5a3c] mb-3">{member.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High Impact CTA */}
      <section className="py-24 bg-[#0b1528] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,60,0.15),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
            Start Your Real Estate Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Ready to Find Your Next Verified Property?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 mb-8 max-w-xl mx-auto font-normal leading-relaxed">
            Browse through hundreds of approved residential and commercial properties with complete legal certification and instant site visit booking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/properties">
              <Button variant="primary" size="lg" className="!rounded-2xl shadow-xl shadow-[#ff5a3c]/30 font-bold text-sm">
                Explore Property Catalog
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="  !rounded-2xl !border-white/20 hover:!text-white  hover:!bg-white/10 font-bold text-sm">
                Speak with an Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


