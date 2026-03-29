"use client";

import { useEffect } from "react";
import styles from "./intent.module.css";
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_DEFAULT_SLOT,
  shouldRenderAds,
} from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type SafeAdSlotProps = {
  contentWordCount: number;
  minWords?: number;
  slot?: string;
  label?: string;
};

export default function SafeAdSlot({
  contentWordCount,
  minWords = 300,
  slot = ADSENSE_DEFAULT_SLOT,
  label = "Advertisement",
}: SafeAdSlotProps) {
  const eligible = shouldRenderAds(contentWordCount) && contentWordCount >= minWords && Boolean(slot);

  useEffect(() => {
    if (!eligible || typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense can safely no-op here while the page is still being reviewed.
    }
  }, [eligible]);

  if (!eligible) {
    return null;
  }

  return (
    <section className={styles.inlineAd}>
      <div className={styles.inlineAdLabel}>{label}</div>
      <div className={styles.inlineAdFrame}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </section>
  );
}
