import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { updateGAConsent } from '../../lib/analytics';
import { X, Check } from 'lucide-react';

export const CookieBanner: React.FC<{
  isOpenDirectly?: boolean;
  onCloseDirectly?: () => void;
}> = ({ isOpenDirectly = false, onCloseDirectly }) => {
  const { cookieConsent, saveCookieConsent } = useData();
  const [showModal, setShowModal] = useState(isOpenDirectly);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: cookieConsent.analytics,
    preferences: cookieConsent.preferences,
    marketing: cookieConsent.marketing,
  });

  const showBanner = !cookieConsent.hasConsented && !isOpenDirectly;

  const handleAcceptAll = () => {
    const allAllowed = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
      hasConsented: true,
    };
    saveCookieConsent(allAllowed);
    updateGAConsent(true);
    if (onCloseDirectly) onCloseDirectly();
  };

  const handleRejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
      hasConsented: true,
    };
    saveCookieConsent(onlyNecessary);
    updateGAConsent(false);
    if (onCloseDirectly) onCloseDirectly();
  };

  const handleSaveCustom = () => {
    saveCookieConsent({
      ...prefs,
      necessary: true,
      hasConsented: true,
    });
    updateGAConsent(prefs.analytics);
    setShowModal(false);
    if (onCloseDirectly) onCloseDirectly();
  };

  if (!showBanner && !showModal && !isOpenDirectly) return null;

  return (
    <>
      {/* Subtle bottom banner */}
      {showBanner && !showModal && (
        <div
          role="region"
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#090d16]/95 backdrop-blur-xl text-slate-200 border-t border-white/10 px-6 py-4 shadow-2xl transition-transform"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              <span className="font-semibold text-white block mb-0.5">Privacy & Cookie Preferences</span>
              We use strictly necessary cookies to ensure the website functions properly, and optional analytics to measure site traffic anonymously without collecting personal data. You have full control over your preferences.
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 rounded-lg border border-white/10 hover:border-white/20 hover:text-white transition-colors cursor-pointer"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Settings Modal */}
      {(showModal || isOpenDirectly) && (
        <div
          role="dialog"
          aria-labelledby="cookie-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#0b0f19] text-slate-200 max-w-lg w-full p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 id="cookie-modal-title" className="text-base font-bold text-white tracking-tight">
                Cookie Preferences
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  if (onCloseDirectly) onCloseDirectly();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Select which cookie categories you permit. You can revisit and alter these settings at any time via the link in the footer.
            </p>

            <div className="mt-6 space-y-4">
              {/* Category 1: Necessary */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Strictly Necessary</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                      Required
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Crucial for session preservation, routing, and basic security functions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 rounded accent-indigo-600 opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Category 2: Analytics */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Performance & Analytics</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Anonymous
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Allows us to count aggregate visits and traffic sources without identifying individuals.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Category 3: Preferences */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <span className="text-xs font-bold text-white">Functional Preferences</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Preserves user display settings and interactive state.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.preferences}
                  onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Reject All Optional
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
