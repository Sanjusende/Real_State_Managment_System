import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Building2 } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#f8fafc]">
      <div className="w-20 h-20 rounded-3xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6 shadow-sm border border-[#ff5a3c]/20">
        <Building2 className="w-10 h-10" />
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        The property listing, agent profile, or page you were looking for might have been moved or is no longer available.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home} className="!rounded-2xl shadow-lg shadow-[#ff5a3c]/20 font-bold">
            Return to Homepage
          </Button>
        </Link>
        <Link to="/properties">
          <Button variant="outline" size="md" icon={Search} className="!rounded-2xl font-bold">
            Browse Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}

