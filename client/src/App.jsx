import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, ShieldCheck, Layers, Server, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [serverStatus, setServerStatus] = useState({ loading: true, healthy: false, data: null });

  useEffect(() => {
    const checkServer = async () => {
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
    };
    checkServer();
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Branch: feature/project-setup
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 mb-6 text-sm text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Production Architecture Initialized</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
          Next-Gen Real Estate & Property Platform
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mb-12">
          Scalable MERN Monorepo architecture with role-based dashboards, high-precision search, instant enquiries, and verified property management.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">Monorepo Setup</h3>
            <p className="text-sm text-slate-400">Decoupled client & server with unified npm scripts and clean separation of concerns.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">Role-Based System</h3>
            <p className="text-sm text-slate-400">Structured roles for Buyers, Agents, Sellers, and Platform Administrators.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">Backend Health</h3>
            <p className="text-sm text-slate-400">
              {serverStatus.loading ? (
                'Checking connection to API gateway...'
              ) : serverStatus.healthy ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> API Gateway Active (Port 5000)
                </span>
              ) : (
                <span className="text-amber-400">Ready to connect (run server)</span>
              )}
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('Branch 1 setup verified!')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
        >
          <span>Verify Client Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} EstateCraft Pro. All rights reserved. Monorepo scaffold v1.0.0.
      </footer>
    </div>
  );
}
