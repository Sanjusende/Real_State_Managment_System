import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Value Highlights */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">100% Verified Properties</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every residential and commercial listing is checked for authentic legal titles and clear physical attributes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">Zero Hidden Commission</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transparent dealings between verified buyers, reputable sellers, and top licensed real estate consultants.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">Fast & Direct Closures</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Schedule direct site visits, compare neighborhood amenities, and lock in the best deals seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  Estate<span className="text-emerald-400">Craft</span>
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                  Premium Real Estate
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              EstateCraft is India's next-generation property marketplace providing curated luxury apartments, duplex villas, commercial hubs, and verified residential plots across high-growth corridors.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Sector 62, Commercial Corridor, Bhopal, MP 462016</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 98765 43210 / +91 755 240011</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@estatecraft.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/properties" className="hover:text-emerald-400 transition">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=SALE" className="hover:text-emerald-400 transition">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=RENT" className="hover:text-emerald-400 transition">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=COMMERCIAL" className="hover:text-emerald-400 transition">
                  Commercial & Offices
                </Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-emerald-400 transition">
                  Verified Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Top Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/properties?city=Bhopal" className="hover:text-emerald-400 transition">
                  Properties in Bhopal
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Indore" className="hover:text-emerald-400 transition">
                  Properties in Indore
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-emerald-400 transition">
                  Properties in Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Pune" className="hover:text-emerald-400 transition">
                  Properties in Pune
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-emerald-400 transition">
                  Properties in Bengaluru
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">
                  About EstateCraft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/register?role=AGENT" className="hover:text-emerald-400 transition">
                  Become an Agent Partner
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} EstateCraft Technologies Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Crafted for premium real estate experiences across India.
          </p>
        </div>
      </div>
    </footer>
  );
}
