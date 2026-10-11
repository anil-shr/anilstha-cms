import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { Link } from '../../lib/router';
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
  ShieldCheck,
  Lock,
  X,
  ExternalLink,
} from 'lucide-react';
import { SocialIcon } from '../../components/public/SocialIcon';
import { resolveWhatsAppUrl } from '../../lib/whatsapp';

export const ContactPage: React.FC = () => {
  const { profile, socialLinks, siteSettings, submitContactMessage, cookieConsent } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Brand Identity & Logo Design',
    subject: '',
    timeline: 'Flexible',
    message: '',
    honeypot: '',
  });

  const enableWhatsApp = siteSettings?.enable_whatsapp_inquiry !== false;
  const whatsappTarget = siteSettings?.whatsapp_target || siteSettings?.whatsapp_number || '+977 9841234567';

  const [lastSubmitted, setLastSubmitted] = useState<typeof formData | null>(null);
  const [lastSentToWhatsApp, setLastSentToWhatsApp] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState<'admin' | 'whatsapp' | null>(null);
  const [success, setSuccess] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 5500);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  useEffect(() => {
    updateSEO({
      title: `Contact & Inquiries — ${profile.name || 'Anil Shrestha'}`,
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

  // Helper to format inquiry message for WhatsApp
  const formatWhatsAppText = (data: typeof formData) => {
    return (
      `*New Design Project Inquiry*\n\n` +
      `*Client:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Service:* ${data.service}\n` +
      `*Timeline:* ${data.timeline}\n` +
      (data.subject.trim() ? `*Subject:* ${data.subject}\n` : '') +
      `\n*Project Scope & Brief:*\n${data.message}\n\n` +
      `_Sent via anilshrestha11.com.np_`
    );
  };

  // Unified submission handler
  const handleInquirySubmit = async (sendToWhatsAppToo: boolean) => {
    setErrorMsg(null);

    // Spam honeypot
    if (formData.honeypot) {
      setSuccess(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email, and project message.');
      return;
    }

    setSubmitting(true);
    setSubmitType(sendToWhatsAppToo ? 'whatsapp' : 'admin');
    const submittedData = { ...formData };

    try {
      // 1. Always record in Admin Panel database / Supabase
      await submitContactMessage({
        name: submittedData.name,
        email: submittedData.email,
        subject: submittedData.subject || `Inquiry from ${submittedData.name} [${submittedData.service}]`,
        message: `Service: ${submittedData.service}\nTimeline: ${submittedData.timeline}\n\n${submittedData.message}`,
      });

      trackEvent(
        'contact_form_submit',
        { service: submittedData.service, via_whatsapp: sendToWhatsAppToo },
        cookieConsent.analytics
      );

      setLastSubmitted(submittedData);
      setLastSentToWhatsApp(sendToWhatsAppToo);
      setSuccess(true);
      setToastVisible(true);

      // 2. If Button 2 was pressed ("Send to WhatsApp & Admin Panel too"), open WhatsApp
      if (sendToWhatsAppToo) {
        const text = formatWhatsAppText(submittedData);
        const waUrl = resolveWhatsAppUrl(whatsappTarget, text);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      // Reset form fields
      setFormData({
        name: '',
        email: '',
        service: 'Brand Identity & Logo Design',
        subject: '',
        timeline: 'Flexible',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please email directly.');
    } finally {
      setSubmitting(false);
      setSubmitType(null);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12 text-left">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact & Project Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Let&apos;s Start a Conversation
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Have an upcoming design project, brand inquiry, or job opportunity? Submit your brief directly to our studio dashboard or connect instantly via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <SpotlightCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Send Project Inquiry
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Private & Encrypted</span>
              </span>
            </div>

            {success ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 space-y-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Inquiry Submitted to Admin Panel!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your project details have been safely recorded in the studio admin dashboard. Anil Shrestha will review your inquiry promptly.
                  </p>
                </div>

                {/* If user opted to send to WhatsApp, provide direct link if pop-up was blocked */}
                {lastSentToWhatsApp && lastSubmitted && (
                  <div className="pt-2">
                    <a
                      href={resolveWhatsAppUrl(whatsappTarget, formatWhatsAppText(lastSubmitted))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                    >
                      <SocialIcon platform="whatsapp" className="w-4 h-4 text-white fill-white shrink-0" />
                      <span>Re-open in WhatsApp Chat</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold underline cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInquirySubmit(false);
                }}
                className="space-y-4"
              >
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
                    <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-service" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Service Interest
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      <option value="Brand Identity & Logo Design">Brand Identity & Logo Design</option>
                      <option value="Packaging & Dieline Production">Packaging & Dieline Production</option>
                      <option value="UI/UX & Mobile Interface Design">UI/UX & Mobile Interface Design</option>
                      <option value="Editorial, Poster & Print Collateral">Editorial, Poster & Print Collateral</option>
                      <option value="Other Design Consultation">Other Design Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-timeline" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Estimated Timeline
                    </label>
                    <select
                      id="contact-timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      <option value="Immediate (1–2 weeks)">Immediate (1–2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Within 2–3 months">Within 2–3 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject Line
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    placeholder="e.g. Brand Identity Overhaul for Kathmandu Cafe"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message Details *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your design needs, deliverables, budget range, and any existing references..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 placeholder:text-slate-400 resize-y"
                  />
                </div>

                {/* Privacy Notice */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Commitment:</strong> We only collect your name, email, and message to reply to your inquiry. We never share or sell personal data. Read our{' '}
                    <Link to="/privacy" className="text-blue-600 dark:text-sky-400 underline font-medium">
                      Privacy Policy
                    </Link>.
                  </span>
                </div>

                {/* Two Action Buttons:
                    1. Send Inquiry (sends to Admin Panel)
                    2. Send to WhatsApp & Admin (sends to WhatsApp & Admin Panel too, with WhatsApp logo and name) */}
                <div className={`grid grid-cols-1 ${enableWhatsApp ? 'sm:grid-cols-2' : ''} gap-3 pt-2`}>
                  {/* Button 1: Send Inquiry to Admin Panel */}
                  <button
                    type="button"
                    onClick={() => handleInquirySubmit(false)}
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-center"
                    title="Send inquiry directly to Admin Panel"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>{submitting && submitType === 'admin' ? 'Submitting...' : 'Send Inquiry'}</span>
                  </button>

                  {/* Button 2: Send to WhatsApp & Admin Panel too */}
                  {enableWhatsApp && (
                    <button
                      type="button"
                      onClick={() => handleInquirySubmit(true)}
                      disabled={submitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-center"
                      title="Send inquiry to WhatsApp & record in Admin Panel database too"
                    >
                      <SocialIcon platform="whatsapp" className="w-4 h-4 text-white fill-white shrink-0" />
                      <span>{submitting && submitType === 'whatsapp' ? 'Opening WhatsApp...' : 'Send to WhatsApp & Admin'}</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </SpotlightCard>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Studio Details</h2>
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-white/10">
                <Mail className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Direct Email</span>
                  <a href={`mailto:${profile.email || 'hello@anilshrestha.design'}`} className="text-slate-900 dark:text-white font-medium hover:underline">
                    {profile.email || 'hello@anilshrestha.design'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-white/10">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Studio Base</span>
                  <span className="text-slate-900 dark:text-white font-medium">{profile.location || 'Pokhara, Nepal'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-white/10">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">Typical Response Time</span>
                  <span className="text-slate-900 dark:text-white font-medium">Within 24–48 hours</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Profiles & Portfolios</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.filter((s) => s.active).map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-all inline-flex items-center gap-2 group"
                >
                  <SocialIcon
                    platform={soc.platform}
                    customIconUrl={soc.custom_icon_url}
                    className="w-4 h-4 text-blue-600 dark:text-sky-400"
                  />
                  <span>{soc.platform}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Floating Success Toast Notification */}
      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#18181b] border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0 space-y-1 text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Inquiry Sent to Admin Panel!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lastSentToWhatsApp
                ? 'Your message has been saved in the admin dashboard and opened in WhatsApp chat.'
                : 'Thank you for reaching out. Anil Shrestha has received your note in the admin dashboard.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastVisible(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
