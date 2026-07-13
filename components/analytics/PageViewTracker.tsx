"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  const key = "pf_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const pageViewIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const sessionId = getSessionId();
    startTimeRef.current = Date.now();
    pageViewIdRef.current = null;

    // 1. Record a new visit as soon as the page loads
    fetch(`${apiUrl}/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        path: pathname,
        referrer: document.referrer || null,
      }),
    })
      .then((res) => res.json())
      .then((data: { id: number }) => {
        pageViewIdRef.current = data.id;
      })
      .catch(() => {
        // fail silently — analytics should never disrupt UX if the API is down
      });

    // 2. Send the duration when the page is left
    function sendDuration() {
      if (!pageViewIdRef.current) return;

      const durationSeconds = Math.round(
        (Date.now() - startTimeRef.current) / 1000,
      );
      const url = `${apiUrl}/pageview/${pageViewIdRef.current}/duration`;

      if (navigator.sendBeacon) {
        // use URLSearchParams (not a JSON Blob) — the browser treats this as "safe"
        // so it skips the CORS preflight, unlike application/json which
        // silently fails to send via sendBeacon across origins
        const params = new URLSearchParams();
        params.append("duration_seconds", String(durationSeconds));
        navigator.sendBeacon(url, params);
      } else {
        // fallback for older browsers without sendBeacon
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration_seconds: durationSeconds }),
          keepalive: true,
        }).catch(() => {});
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendDuration();
      }
    }

    window.addEventListener("beforeunload", sendDuration);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // called on client-side navigation — send the duration for the previous page
      sendDuration();
      window.removeEventListener("beforeunload", sendDuration);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
