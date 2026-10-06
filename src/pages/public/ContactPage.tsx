import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Send,
  Check,
  AlertCircle,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { profile, socialLinks, submitContactMessage, cookieConsent } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Brand Identity & Graphic Design',
    subject: '',
    timeline: 'Flexible',
    message: '',
    honeypot: '',
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    updateSEO({
      title: `Contact — ${profile.name || 'Anil Shrestha'}`,
      description:
        'Get in touch with Anil Shrestha, Graphic Designer in Nepal for branding inquiries, packaging projects, or freelance design roles.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/contact' : '',
    });
    trackEvent('page_view', { page_path: '/contact' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('contact_form_start', {}, cookieConsent.analytics);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Spam honeypot
    if (formData.honeypot) {
      setSuccess(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || `Inquiry from ${formData.name} [${formData.service}]`,
        message: `Service: ${formData.service}\nTimeline: ${formData.timeline}\n\n${formData.message}`,
      });

      trackEvent('contact_form_submit', { service: formData.service }, cookieConsent.analytics);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        service: 'Full Stack Web Development',
        subject: '',
        timeline: 'Flexible',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Let's Start a Conversation
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Have an upcoming project, freelance inquiry, or job opportunity? Send a message and I'll respond within 24–48 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <SpotlightCard className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Send a Direct Message</h2>

            {success ? (
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 space-y-2 text-center">
                <Check className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Thank you for reaching out. I'll review your details and get back to you promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Frontend Development">Frontend Development</option>
                      <option value="UI/UX & Prototyping">UI/UX & Prototyping</option>
                      <option value="Other Consultation">Other Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Immediate (1–2 weeks)">Immediate (1–2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your project, timeline, and requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0f172a] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </SpotlightCard>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Contact Details</h3>
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Email Address</span>
                  <a href={`mailto:${profile.email}`} className="text-slate-900 dark:text-white font-medium hover:underline">
                    {profile.email || 'anilshrestha01.dev@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Location</span>
                  <span className="text-slate-900 dark:text-white font-medium">{profile.location || 'Kathmandu, Nepal'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Response Time</span>
                  <span className="text-slate-900 dark:text-white font-medium">Within 24–48 hours</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profiles & Code</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.filter((s) => s.active).map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-all inline-flex items-center gap-1.5"
                >
                  <span>{soc.platform}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
