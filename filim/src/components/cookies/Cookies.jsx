"use client";

import { useState, useEffect } from "react";

const Cookies = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mySiteCookieConsent="));
    if (!consent) setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const setCookie = (value) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 150);
    document.cookie = `mySiteCookieConsent=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  const handleAccept = () => {
    setCookie("true");
    setVisible(false);
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    setCookie("false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4">
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="true"
        className="w-full max-w-md border-[0.5px] border-white/50 bg-black px-8 py-9 text-center rounded-sm animate-[fadeIn_0.25s_ease-out]"
      >
        <p className="mb-3 font-mono text-[14px] font-bold uppercase tracking-widest text-white">
          Cookie Notice
        </p>
        <p className="mb-7 text-sm leading-relaxed text-neutral-400">
          We use cookies to improve your experience, analyze site traffic, and
          personalize content.
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={handleDecline}
            className="cursor-pointer rounded-sm border bg-red-600 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-white transition-colors "
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="cursor-pointer rounded-sm border border-white bg-yellow-500 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-black transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
