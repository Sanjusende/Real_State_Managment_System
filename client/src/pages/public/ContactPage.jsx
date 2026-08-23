import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import clsx from 'clsx';

const FAQS = [
  {
    q: 'How does EstateCraft verify listings before they go live?',
    a: 'Every property listed by owners or agents undergoes an administrative verification protocol checking ownership records, encumbrance certificates, physical boundary validation, and accurate carpet area specs.',
  },
  {
    q: 'Are there any hidden brokerage charges for buyers?',
    a: 'No. EstateCraft maintains a strict zero-hidden-brokerage policy. All transaction terms and advisory fees are communicated transparently before any agreements.',
  },
  {
    q: 'How can I become an approved listing agent?',
    a: 'You can register an account with the role "AGENT", provide your valid agency credentials and regional specialization. Our verification team reviews agent applications within 24-48 hours.',
  },
  {
    q: 'Can I schedule physical site visits directly through the platform?',
    a: 'Yes. On every property page, you can use the "Send Inquiry / Book Visit" button to connect directly with the assigned licensed agent who will arrange physical inspections at your convenience.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you! Your message has been received. Our team will contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Client Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            We're Here to Help You Move Forward
          </h1>
          <p className="text-sm text-slate-500">
            Have questions about a property, verification process, or agent partnership? Get in touch with our expert team.
          </p>
        </div>

        {/* Contact Info Grid + Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20 items-start">
          {/* Info Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Headquarters</h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Main Office</span>
                    <span>Level 4, Premier Real Estate Center, Commercial Hub, Arera Colony, Bhopal, MP 462016</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Helpline</span>
                    <span>+91 98765 43210 (Toll Free)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Email Support</span>
                    <span>support@estatecraft.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Office Hours</span>
                    <span>Mon – Sat: 9:00 AM – 7:30 PM (IST)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-slate-200/90 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Verma"
                  required
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 99887 76655"
                />

                <FormInput
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Property Inquiry or Partnership"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  How can we help you? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about the property you are seeking, selling, or asking about..."
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  loading={submitting}
                >
                  Submit Message
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto pt-10 border-t border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Common questions from buyers, sellers, and agents using EstateCraft.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-emerald-600'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
