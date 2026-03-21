import type { IplMatch, KeyPlayer } from "@/lib/ipl-data";
import styles from "./intent.module.css";

type MatchContentProps = {
  match: IplMatch;
  quickSummary: string[];
  tossText: string;
  playingXiText: string;
  predictionTitle: string;
  predictionText: string;
  team1Players: KeyPlayer[];
  team2Players: KeyPlayer[];
};

function PlayerList({ players }: { players: KeyPlayer[] }) {
  if (!players.length) {
    return (
      <div className={styles.smallText}>
        The current squad tracker does not have a featured-player list for this team yet.
      </div>
    );
  }

  return (
    <div className={styles.playerList}>
      {players.map((player) => (
        <div key={player.id} className={styles.playerChip}>
          <div className={styles.playerName}>{player.name}</div>
          <div className={styles.playerMeta}>
            {player.role} • {player.statLine}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchContent({
  match,
  quickSummary,
  tossText,
  playingXiText,
  predictionTitle,
  predictionText,
  team1Players,
  team2Players,
}: MatchContentProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Match Guide</h2>
      <div className={styles.microGrid}>
        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Summary</h3>
          <div className={styles.summaryList}>
            {quickSummary.map((item) => (
              <div key={item} className={styles.summaryItem}>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={`${styles.card} ${styles.cardAlt}`}>
          <h3 className={styles.cardTitle}>Toss Winner and Match Call</h3>
          <p className={styles.cardText}>{tossText}</p>
          <div className={styles.cardNote}>
            Search intent phrases like "ipl toss winner today" matter most close to start time, so this block updates only when the source has the toss outcome.
          </div>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Playing XI Tracker</h3>
          <p className={styles.cardText}>{playingXiText}</p>
          <div className={styles.cardNote}>
            Until the official today match playing 11 is published, this section highlights the most important squad names to watch from both camps.
          </div>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>{predictionTitle}</h3>
          <p className={styles.cardText}>{predictionText}</p>
        </article>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Players</h2>
        <div className={styles.microGrid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{match.team1.name}</h3>
            <PlayerList players={team1Players} />
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{match.team2.name}</h3>
            <PlayerList players={team2Players} />
          </article>
        </div>
      </div>
    </section>
  );
}
