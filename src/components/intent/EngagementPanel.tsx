"use client";

import { useState } from "react";
import styles from "./intent.module.css";

type EngagementPanelProps = {
  pageKey: string;
  title: string;
  path: string;
};

function bookmarkStorageKey(pageKey: string) {
  return `ipl-scorebook-bookmark:${pageKey}`;
}

export default function EngagementPanel({
  pageKey,
  title,
  path,
}: EngagementPanelProps) {
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(bookmarkStorageKey(pageKey)) === "true";
  });
  const [shareLabel, setShareLabel] = useState("Share this page");

  const toggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(bookmarkStorageKey(pageKey), String(nextState));
    }
  };

  const sharePage = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const url = `${window.location.origin}${path}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setShareLabel("Shared");
        return;
      } catch {
        setShareLabel("Share cancelled");
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
    } catch {
      setShareLabel("Copy failed");
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.actionPanel}>
        <div>
          <h2 className={styles.cardTitle}>Reader Tools</h2>
          <p className={styles.cardNote}>
            Save this match or page for later, then share the clean URL without waiting for the live
            state to change.
          </p>
        </div>
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={`${styles.actionButton} ${isBookmarked ? styles.actionButtonActive : ""}`}
            onClick={toggleBookmark}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark match"}
          </button>
          <button type="button" className={styles.actionButton} onClick={sharePage}>
            {shareLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
