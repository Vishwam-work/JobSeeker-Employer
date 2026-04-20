"use client";

import { useEffect, useState } from "react";

/**
 * cookie helpers (basic)
 */
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
function getCookie(name: string) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts.slice(1).join("=")) : r;
  }, "");
}
function eraseCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

/**
 * Default consent shape
 */
const DEFAULT_CONSENT = {
  essential: true, // always true (app needs basic cookies)
  analytics: false,
  marketing: false,
  timestamp: null as null | string,
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<typeof DEFAULT_CONSENT | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cookieConsent");
      if (raw) {
        const parsed = JSON.parse(raw);
        setConsent(parsed);
        setVisible(false);
      } else {
        // show banner if not set
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  // apply side-effects based on consent (e.g. enable analytics)
  useEffect(() => {
    if (!consent) return;

    // if analytics allowed — init analytics (placeholder)
    if (consent.analytics) {
      // initAnalytics(); // <-- call your analytics init here
      console.log("[CookieConsent] analytics enabled");
    } else {
      // disable analytics if any previously loaded
      console.log("[CookieConsent] analytics disabled");
    }

    // marketing cookies
    if (consent.marketing) {
      console.log("[CookieConsent] marketing enabled");
    } else {
      console.log("[CookieConsent] marketing disabled");
    }
  }, [consent]);

  const saveConsent = (newConsent: typeof DEFAULT_CONSENT) => {
    const obj = { ...newConsent, timestamp: new Date().toISOString() };
    localStorage.setItem("cookieConsent", JSON.stringify(obj));
    setConsent(obj);
    setVisible(false);

    // If user rejected analytics/marketing, remove cookies/localStorage related to them
    if (!obj.analytics) {
      // remove analytics cookies/localStorage keys (replace with your keys)
      eraseCookie("_ga");
      eraseCookie("_gid");
      localStorage.removeItem("analytics_opt_in");
    }
    if (!obj.marketing) {
      // remove marketing cookies
      eraseCookie("marketing_id");
      localStorage.removeItem("marketing_opt_in");
    }
  };

  const acceptAll = () => {
    saveConsent({ ...DEFAULT_CONSENT, analytics: true, marketing: true });
  };

  const rejectAllNonEssential = () => {
    saveConsent({ ...DEFAULT_CONSENT, analytics: false, marketing: false });
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const updateAndSave = (patch: Partial<typeof DEFAULT_CONSENT>) => {
    const current = consent ?? DEFAULT_CONSENT;
    saveConsent({ ...current, ...patch });
    setShowSettings(false);
  };

  // don't render anything on server; this is client-only component
  return (
    <>
      {/* Banner */}
      {visible && (
        <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-8 md:w-[520px] z-50">
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-5 border">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">We use cookies</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We use cookies to improve your experience. Manage your preferences or accept all.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={acceptAll}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={rejectAllNonEssential}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
                  >
                    Reject non-essential
                  </button>
                  <button
                    onClick={openSettings}
                    className="px-3 py-2 text-sm text-gray-700 underline"
                  >
                    Manage settings
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => setVisible(false)}
                  aria-label="Close cookie banner"
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeSettings}
          ></div>

          <div className="relative bg-white rounded-t-lg md:rounded-lg w-full md:w-[720px] max-h-[90vh] overflow-auto p-6 md:p-8 z-10">
            <h3 className="text-xl font-semibold text-gray-900">Cookie settings</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose what cookies you allow. Essential are required for the site to function.
            </p>

            <div className="mt-6 space-y-4">
              {/* Essential */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Essential</h4>
                      <p className="text-sm text-gray-600">Required for basic site functionality.</p>
                    </div>
                    <div className="text-sm text-gray-500">Always active</div>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Analytics</h4>
                      <p className="text-sm text-gray-600">Helps us understand how visitors use the site.</p>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(consent ?? DEFAULT_CONSENT).analytics}
                          onChange={(e) => updateAndSave({ analytics: e.target.checked })}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing</h4>
                      <p className="text-sm text-gray-600">Personalized ads & marketing tracking.</p>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(consent ?? DEFAULT_CONSENT).marketing}
                          onChange={(e) => updateAndSave({ marketing: e.target.checked })}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  // save current checkboxes state (if consent null, use defaults)
                  const cur = consent ?? DEFAULT_CONSENT;
                  saveConsentFallback(cur); // ensure saved if user closes here
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-gray-100 rounded-md text-sm"
              >
                Close
              </button>

              <button
                onClick={() => {
                  // explicit save (use already updated consent)
                  // nothing to do because updateAndSave already saves per toggle.
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // helper to save if user clicked close
  function saveConsentFallback(obj: typeof DEFAULT_CONSENT) {
    const existing = localStorage.getItem("cookieConsent");
    if (!existing) {
      const toSave = { ...obj, timestamp: new Date().toISOString() };
      localStorage.setItem("cookieConsent", JSON.stringify(toSave));
      setConsent(toSave);
    }
  }
}
