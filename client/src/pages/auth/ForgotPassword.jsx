import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import * as authService from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword({ email });
      setSubmittedData(res.data || res);
      toast.success('Password reset instructions generated!');
    } catch (err) {
      toast.error(err.message || 'Could not process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-20 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#ff5a3c] flex items-center justify-center text-white shadow-md shadow-[#ff5a3c]/30 group-hover:scale-105 transition">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tight text-slate-950">
              Estate<span className="text-[#ff5a3c]">Craft</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 -mt-1">
              Premium Real Estate
            </span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
          Reset Password
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-950/5 rounded-3xl sm:px-10 border border-slate-200/90">
          {submittedData ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[#ff5a3c]/10 text-[#ff5a3c] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Request Processed</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                If an account matches <span className="text-[#ff5a3c] font-semibold">{email}</span>, you can now reset your password using the generated link.
              </p>

              {submittedData.resetToken && (
                <div className="p-4 bg-slate-50 border border-[#ff5a3c]/30 rounded-2xl mb-6 text-left">
                  <span className="text-[10px] font-semibold text-[#ff5a3c] uppercase tracking-wider block mb-1">
                    Development Reset Token:
                  </span>
                  <code className="text-xs text-slate-800 break-all select-all font-mono">
                    {submittedData.resetToken}
                  </code>
                </div>
              )}

              <Link
                to={submittedData.resetToken ? `/reset-password?token=${submittedData.resetToken}` : '/login'}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#ff5a3c]/20 text-sm font-bold text-white bg-[#ff5a3c] hover:bg-[#e04b30] transition"
              >
                <span>Continue to Reset</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.smith@example.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c] text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#ff5a3c]/20 text-sm font-bold text-white bg-[#ff5a3c] hover:bg-[#e04b30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5a3c] disabled:opacity-50 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Instructions</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#ff5a3c] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

