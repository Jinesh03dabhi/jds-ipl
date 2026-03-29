import styles from "./intent.module.css";
import SafeAdSlot from "./SafeAdSlot";
import type { MatchEditorial } from "@/lib/match-editorial";

type MatchEditorialSectionsProps = {
  editorial: MatchEditorial;
};

export default function MatchEditorialSections({
  editorial,
}: MatchEditorialSectionsProps) {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Match Summary</h2>
          <div className={styles.textBlock}>
            {editorial.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <SafeAdSlot contentWordCount={editorial.contentWordCount} />

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Key Highlights</h2>
          <div className={styles.summaryList}>
            {editorial.highlights.map((item) => (
              <div key={item} className={styles.summaryItem}>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Player Performance Analysis</h2>
            <div className={styles.textBlock}>
              {editorial.playerAnalysis.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Player Comparison Cards</h2>
            <div className={styles.focusGrid}>
              {editorial.teamFocus.map((item) => (
                <div key={item.teamName} className={styles.focusCard}>
                  <div className={styles.focusTeam}>{item.teamName}</div>
                  <div className={styles.focusPrimary}>{item.primaryPlayer}</div>
                  <div className={styles.focusSecondary}>Support watch: {item.secondaryPlayer}</div>
                  <p className={styles.focusNote}>{item.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <SafeAdSlot contentWordCount={editorial.contentWordCount} />

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Match Insights</h2>
            <div className={styles.textBlock}>
              {editorial.insights.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Key Moments Timeline</h2>
            <div className={styles.timelineList}>
              {editorial.timeline.map((item) => (
                <div key={item.title} className={styles.timelineItem}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDetail}>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Venue Insights</h2>
            <div className={styles.textBlock}>
              {editorial.venueAnalysis.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Quick Comparison</h2>
            <div className={styles.comparisonList}>
              {editorial.comparison.map((item) => (
                <div key={item.label} className={styles.comparisonItem}>
                  <div className={styles.comparisonLabel}>{item.label}</div>
                  <div className={styles.comparisonValues}>
                    <span>{item.team1}</span>
                    <span>{item.team2}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
