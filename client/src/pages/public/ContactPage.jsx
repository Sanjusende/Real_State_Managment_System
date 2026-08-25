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
  CheckCircle2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { submitContact } from '../../services/contactService';
import clsx from 'clsx';

const ADMIN_PHONE = '+918815926552';
const ADMIN_WHATSAPP_NUMBER = '918815926552';
const ADMIN_SUPPORT_EMAIL = 'support@estatecraft.com';

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
    website: '', // Honeypot spam trap
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);
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
    if (!form.subject || form.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters.';
    }
    if (!form.message || form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormattedWhatsAppUrl = (data = form) => {
    const msg = `🚨 *New EstateCraft Enquiry*\n\n*Name:* ${data.name || 'Visitor'}\n*Email:* ${data.email || 'N/A'}\n*Phone:* ${data.phone || 'N/A'}\n*Subject:* ${data.subject || 'Property Enquiry'}\n\n*Message:*\n${data.message || 'Hello, I have an inquiry regarding EstateCraft properties.'}`;
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const getFormattedMailtoUrl = (data = form) => {
    const subject = encodeURIComponent(`Enquiry: ${data.subject || 'Property Query'}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`);
    return `mailto:${ADMIN_SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
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
      // 1. Save to Database
      await submitContact(payload);
      
      // 2. Open WhatsApp directly to admin with the message
      const whatsappUrl = getFormattedWhatsAppUrl(payload);
      window.open(whatsappUrl, '_blank');

      toast.success('Your message has been sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
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
                    <span>+91 8815926552(Toll Free)</span>
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

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-900">
                  <span className="font-bold block">Thank you! Your message has been sent.</span>
                  Our advisory team has received your enquiry and will contact you shortly.
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="block mt-2 text-xs font-bold text-emerald-700 underline hover:text-emerald-800 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field for spam prevention - hidden from humans */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Your Name"
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
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => {
                    setForm({ ...form, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: '' });
                  }}
                  error={errors.subject}
                  placeholder="Property Inquiry or Partnership"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  How can we help you? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  disabled={submitting}
                  placeholder="Tell us about the property you are seeking, selling, or asking about..."
                  required
                  className={clsx(
                    "w-full rounded-xl border p-3 text-sm text-slate-900 focus:outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500",
                    errors.message
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                >
                  {submitting ? 'Sending...' : 'Send Message'}
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
