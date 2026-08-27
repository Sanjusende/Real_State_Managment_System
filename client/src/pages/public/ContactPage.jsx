import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Building2,
  ExternalLink,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { submitContact } from '../../services/contactService';
import { sendEmailViaEmailJS } from '../../services/emailJsService';
import clsx from 'clsx';

const ADMIN_PHONE = '+918815926552';
const ADMIN_WHATSAPP_NUMBER = '918815926552';
const ADMIN_SUPPORT_EMAIL = 'support@estatecraft.com';

const INQUIRY_TYPES = [
  'Property Purchase',
  'Rental & Lease',
  'List / Sell Property',
  'Agent Partnership',
  'Legal Due Diligence',
  'Other Inquiries',
];

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
  {
    q: 'How quickly will your advisory team respond to messages?',
    a: 'Our certified real estate advisors typically respond within 15 to 30 minutes during business hours (9:00 AM - 7:30 PM IST).',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Property Purchase',
    message: '',
    website: '', // Honeypot spam trap
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const validateClientForm = () => {
    const newErrors = {};
    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Please provide a valid name (at least 2 characters).';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email || !emailRegex.test(form.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
    if (!form.phone || !phoneRegex.test(form.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number with country code.';
    }
    if (!form.subject || form.subject.trim().length === 0) {
      newErrors.subject = 'Please provide a subject.';
    }
    if (!form.message || form.message.trim().length < 2) {
      newErrors.message = 'Please provide a message with at least 2 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormattedWhatsAppUrl = (data = form) => {
    const msg = `🚨 *New EstateCraft Enquiry*\n\n*Name:* ${data.name || 'Visitor'}\n*Email:* ${data.email || 'N/A'}\n*Phone:* ${data.phone || 'N/A'}\n*Subject:* ${data.subject || 'Property Enquiry'}\n\n*Message:*\n${data.message || 'Hello, I have an inquiry regarding EstateCraft properties.'}`;
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateClientForm()) {
      toast.error('Please fix the validation errors below.');
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      website: form.website, // Honeypot
    };

    try {
      await submitContact(payload);
      const emailResult = await sendEmailViaEmailJS(payload);
      if (emailResult.skipped) {
        console.warn('[EmailJS] Keys not configured in client/.env, skipping EmailJS email.');
      } else if (!emailResult.success) {
        console.warn('[EmailJS] Dispatch failed:', emailResult.error);
      }

      toast.success('Your message has been sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: 'Property Purchase', message: '', website: '' });
      setSubmitted(true);
    } catch (err) {
      const errorMsg = err?.message || 'Unable to submit your enquiry. Please try again later.';
      toast.error(errorMsg);
      if (err?.errors && Array.isArray(err.errors)) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          if (e.field) fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 1. Luxury Dark Hero Header */}
      <div className="bg-[#0b1528] pt-32 pb-24 border-b border-white/10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,90,60,0.2),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5a3c]/15 text-[#ff5a3c] border border-[#ff5a3c]/30 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
              <Headphones className="w-3.5 h-3.5" />
              <span>Dedicated Client Concierge</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Get in Touch with Our <span className="text-[#ff5a3c]">Real Estate Experts</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Whether you are looking to buy a luxury residence, lease a corporate space, or partner as an accredited agent, our team is ready to guide you.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Floating Contact Channels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Helpline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md shadow-slate-900/5 flex flex-col justify-between hover:border-[#ff5a3c]/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Direct Helpline</h3>
              <p className="text-xs text-slate-500 mb-3">Speak directly with an advisory consultant</p>
            </div>
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#ff5a3c] hover:text-[#e04b30] transition"
            >
              <span>+91 8815926552</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md shadow-slate-900/5 flex flex-col justify-between hover:border-[#84cc16]/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#84cc16]/15 text-[#65a30d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">WhatsApp Concierge</h3>
              <p className="text-xs text-slate-500 mb-3">Instant chat & property brochure dispatch</p>
            </div>
            <a
              href={getFormattedWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#65a30d] hover:underline transition"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md shadow-slate-900/5 flex flex-col justify-between hover:border-[#ff5a3c]/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0b1528] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-[#ff5a3c]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Email Advisory</h3>
              <p className="text-xs text-slate-500 mb-3">Detailed proposals & document verification</p>
            </div>
            <a
              href={`mailto:${ADMIN_SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#ff5a3c] hover:text-[#e04b30] transition"
            >
              <span>support@estatecraft.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Operating Hours */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md shadow-slate-900/5 flex flex-col justify-between hover:border-[#ff5a3c]/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Working Hours</h3>
              <p className="text-xs text-slate-500 mb-1">Monday – Saturday</p>
            </div>
            <span className="text-xs font-bold text-slate-800">
              9:00 AM – 7:30 PM (IST)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Contact Form + Headquarters Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left Side: Headquarters Details & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 md:p-8 border border-slate-200/90 shadow-md shadow-slate-900/5 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
                  Corporate Headquarters
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">EstateCraft Realty Center</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-5 h-5 text-[#ff5a3c] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Main Office Address</span>
                    <span className="leading-relaxed">Level 4, Premier Real Estate Center, Commercial Hub, Arera Colony, Bhopal, MP 462016</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-[#84cc16] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Government RERA Compliance</span>
                    <span className="leading-relaxed">Fully registered real estate enterprise operating under strict regional RERA compliance audits.</span>
                  </div>
                </div>
              </div>

              {/* Map Illustration / Visual Card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 relative bg-[#0b1528] h-48 flex items-center justify-center text-center p-6 text-white group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,60,0.15),transparent)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#ff5a3c] text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#ff5a3c]/30 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-extrabold block">Bhopal Hub & Experience Center</span>
                  <span className="text-[11px] text-slate-300 block mt-0.5">Physical Site Visits & Legal Consultations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-200/90 shadow-md shadow-slate-900/5">
            <div className="mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
                Direct Inquiry Form
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Send Us a Direct Message</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and an assigned specialist will connect with you.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-[#ff5a3c]/10 border border-[#ff5a3c]/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ff5a3c] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-900">
                  <span className="font-bold block">Thank you! Your message has been sent.</span>
                  Our advisory team has received your enquiry and will contact you shortly.
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="block mt-2 text-xs font-bold text-[#ff5a3c] underline hover:text-[#e04b30] cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              {/* Inquiry Type Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  What are you inquiring about?
                </label>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TYPES.map((type) => {
                    const isSelected = form.subject === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, subject: type });
                          if (errors.subject) setErrors({ ...errors, subject: '' });
                        }}
                        className={clsx(
                          'px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border',
                          isSelected
                            ? 'bg-[#0b1528] text-white border-[#0b1528] shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-950'
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Your Full Name"
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                  placeholder="Rahul Verma"
                  disabled={submitting}
                  required
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                  placeholder="rahul@example.com"
                  disabled={submitting}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  error={errors.phone}
                  placeholder="+91 99887 76655"
                  disabled={submitting}
                  required
                />

                <FormInput
                  label="Subject / Topic"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => {
                    setForm({ ...form, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: '' });
                  }}
                  error={errors.subject}
                  placeholder="Property Inquiry"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  How can we assist you? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  disabled={submitting}
                  placeholder="Tell us about the property category, preferred budget, location corridor, or specific questions..."
                  required
                  className={clsx(
                    "w-full rounded-2xl border p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500",
                    errors.message
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-[#ff5a3c] focus:ring-2 focus:ring-[#ff5a3c]/20"
                  )}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  loading={submitting}
                  disabled={submitting}
                  className="!rounded-2xl !py-3.5 font-bold shadow-lg shadow-[#ff5a3c]/30 text-sm"
                >
                  {submitting ? 'Sending Enquiry...' : 'Submit Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 4. FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-slate-200">
          <div className="text-center mb-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
              Have Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quick answers about our due diligence, site visits, and agent partnerships.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-[#ff5a3c] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-[#ff5a3c]'
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


