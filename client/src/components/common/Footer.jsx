import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#08101e] text-slate-300 border-t border-white/10">
      {/* Top Value Highlights */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20 flex items-center justify-center flex-shrink-0">
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
              <div className="w-12 h-12 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20 flex items-center justify-center flex-shrink-0">
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
              <div className="w-12 h-12 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20 flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5a3c] to-[#ff7b5a] flex items-center justify-center text-white shadow-md shadow-[#ff5a3c]/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
                  Estate<span className="text-[#ff5a3c]">Craft</span>
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                  Premium Real Estate
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              EstateCraft is your premium property marketplace providing curated luxury apartments, duplex villas, corporate workspaces, and verified plots across high-growth corridors.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff5a3c]" />
                <span>Sector 62, Commercial Corridor, Bhopal, MP 462016</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ff5a3c]" />
                <span>+91 98765 43210 / +91 755 240011</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ff5a3c]" />
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
                <Link to="/properties" className="hover:text-[#ff5a3c] transition">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=SALE" className="hover:text-[#ff5a3c] transition">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=RENT" className="hover:text-[#ff5a3c] transition">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=COMMERCIAL" className="hover:text-[#ff5a3c] transition">
                  Commercial & Offices
                </Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-[#ff5a3c] transition">
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
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/properties?city=Bhopal" className="hover:text-[#ff5a3c] transition">
                  Properties in Bhopal
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Indore" className="hover:text-[#ff5a3c] transition">
                  Properties in Indore
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Jabalpur" className="hover:text-[#ff5a3c] transition">
                  Properties in Jabalpur
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Balaghat" className="hover:text-[#ff5a3c] transition">
                  Properties in Balaghat
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Ujjain" className="hover:text-[#ff5a3c] transition">
                  Properties in Ujjain
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-[#ff5a3c] transition">
                  Properties in Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?city=California" className="hover:text-[#ff5a3c] transition">
                  Properties in California
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Florida" className="hover:text-[#ff5a3c] transition">
                  Properties in Florida
                </Link>
              </li>
              <li>
                <Link to="/properties?city=New York" className="hover:text-[#ff5a3c] transition">
                  Properties in New York
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
                <Link to="/about" className="hover:text-[#ff5a3c] transition">
                  About EstateCraft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#ff5a3c] transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/register?role=AGENT" className="hover:text-[#ff5a3c] transition">
                  Become an Agent Partner
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#ff5a3c] transition">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#060c16] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} EstateCraft Technologies Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            Crafted for premium real estate experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}

