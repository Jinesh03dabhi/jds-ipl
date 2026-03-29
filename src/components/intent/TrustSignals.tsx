import styles from "./intent.module.css";

type TrustSignalsProps = {
  authorName: string;
  lastUpdatedLabel: string;
  sourcesNote: string;
  wordCount?: number;
};

export default function TrustSignals({
  authorName,
  lastUpdatedLabel,
  sourcesNote,
  wordCount,
}: TrustSignalsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.trustCard}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustLabel}>Author</div>
            <div className={styles.trustValue}>{authorName}</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustLabel}>Last Updated</div>
            <div className={styles.trustValue}>{lastUpdatedLabel}</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustLabel}>Content Depth</div>
            <div className={styles.trustValue}>
              {wordCount ? `${wordCount} words of original analysis` : "Editorial long-form page"}
            </div>
          </div>
        </div>
        <p className={styles.trustNote}>{sourcesNote}</p>
      </div>
    </section>
  );
}
