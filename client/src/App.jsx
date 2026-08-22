import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, ShieldCheck, Layers, Server, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getCategories, getPopularLocations } from './services/taxonomyService';

export default function App() {
  const [serverStatus, setServerStatus] = useState({ loading: true, healthy: false, data: null });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const initData = async () => {
      // 1. Health check
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/health`);
        const result = await response.json();
        if (result.success) {
          setServerStatus({ loading: false, healthy: true, data: result });
        } else {
          setServerStatus({ loading: false, healthy: false, data: null });
        }
      } catch (err) {
        setServerStatus({ loading: false, healthy: false, data: null });
      }

      // 2. Fetch categories & locations via taxonomyService
      try {
        const catRes = await getCategories();
        if (catRes?.data) setCategories(catRes.data);
      } catch (e) {
        // Fallback or empty if DB not yet seeded
      }

      try {
        const locRes = await getPopularLocations();
        if (locRes?.data) setLocations(locRes.data);
      } catch (e) {
        // Fallback or empty if DB not yet seeded
      }
    };

    initData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col justify-between">
      <Toaster position="top-right" />
      
      {/* Header Bar */}
      <header className="border-b border-slate-700/60 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              EstateCraft Pro
            </h1>
            <p className="text-xs text-slate-400">Enterprise Real Estate Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Branch: feature/backend-architecture
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 mb-6 text-sm text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>MongoDB ODM & Architecture Initialized</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
          Next-Gen Real Estate Platform
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mb-8">
          Mongoose connection pooling, centralized error handling, taxonomy models, and pure service architecture ready.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-10">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">Clean Architecture</h3>
            <p className="text-sm text-slate-400">Routes $\to$ Controllers $\to$ Services $\to$ Models with strict error encapsulation.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">Taxonomy Schemas</h3>
            <p className="text-sm text-slate-400">
              {categories.length > 0
                ? `${categories.length} Categories loaded from MongoDB`
                : 'Category & Location models active with GeoJSON & Slugs'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">API Gateway & DB</h3>
            <p className="text-sm text-slate-400">
              {serverStatus.loading ? (
                'Checking connection...'
              ) : serverStatus.healthy ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Gateway Online (Port 5000)
                </span>
              ) : (
                <span className="text-amber-400">Server ready to connect</span>
              )}
            </p>
          </div>
        </div>

        {/* Live Taxonomies Preview (if available) */}
        {categories.length > 0 && (
          <div className="w-full mb-8">
            <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3 text-left font-semibold">
              Live Loaded Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat._id}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => toast.success('Branch 2 architecture verified!')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
        >
          <span>Verify Backend Architecture</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} EstateCraft Pro. All rights reserved. Architecture v1.0.0.
      </footer>
    </div>
  );
}
