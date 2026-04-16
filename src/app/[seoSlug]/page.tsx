import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeadToHeadPage from "@/components/HeadToHeadPage";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import MatchContent from "@/components/intent/MatchContent";
import styles from "@/components/intent/intent.module.css";
import { getHeadToHeadPages } from "@/lib/data-helpers";
import {
  formatIndiaDateTime,
  getIplSchedule,
  getKeyPlayers,
  getMatchByPredictionSlug,
  getPredictionForMatch,
  getStadiumProfile,
} from "@/lib/ipl-data";
import { getHeadToHeadBySlug } from "@/lib/stats-engine";
import { SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

async function resolveSeoPage(slug: string) {
  if (slug.endsWith("-head-to-head")) {
    const data = getHeadToHeadBySlug(slug);
    if (!data) return null;
    return { type: "headToHead" as const, data };
  }

  if (slug.endsWith("-prediction")) {
    const match = await getMatchByPredictionSlug(slug);
    if (!match) return null;
    return { type: "prediction" as const, match };
  }

  if (slug.endsWith("-pitch-report")) {
    const profile = getStadiumProfile(slug);
    if (!profile) return null;
    const schedule = await getIplSchedule();
    return {
      type: "pitch" as const,
      profile,
      relatedMatches: schedule.matches.filter((match) => match.venueSlug === slug),
    };
  }

  return null;
}

export async function generateStaticParams() {
  return getHeadToHeadPages().map((page) => ({
    seoSlug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const resolved = await resolveSeoPage(seoSlug);

  if (!resolved) {
    return {};
  }

  if (resolved.type === "headToHead") {
    const title = `${resolved.data.team1.name} vs ${resolved.data.team2.name} Head to Head | IPL Rivalry Stats`;
    const description = `${resolved.data.team1.name} vs ${resolved.data.team2.name} head-to-head page with total wins, recent meetings and venue-wise record split.`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${seoSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${seoSlug}`,
        type: "website",
        siteName: "IPL Scorebook",
        locale: "en_IN",
        images: [`${SITE_URL}/opengraph-image`],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${SITE_URL}/opengraph-image`],
      },
    };
  }

  if (resolved.type === "prediction") {
    const { match } = resolved;
    const title = `${match.team1.name} vs ${match.team2.name} Prediction | IPL 2026 Match Preview`;
    const description = `${match.team1.name} vs ${match.team2.name} prediction page with venue angle, toss logic, key players and links to live and result pages.`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/${seoSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${seoSlug}`,
        type: "website",
        siteName: "IPL Scorebook",
        locale: "en_IN",
        images: [`${SITE_URL}/opengraph-image`],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${SITE_URL}/opengraph-image`],
      },
    };
  }

  const title = `${resolved.profile.name} Pitch Report | IPL 2026 Venue Guide`;
  const description = `${resolved.profile.name} pitch report with surface trend, toss angle, venue notes and links to matches scheduled at the ground.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${seoSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${seoSlug}`,
      type: "website",
      siteName: "IPL Scorebook",
      locale: "en_IN",
      images: [`${SITE_URL}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function SeoSlugPage({ params }: PageProps) {
  const { seoSlug } = await params;
  const resolved = await resolveSeoPage(seoSlug);

  if (!resolved) {
    notFound();
  }

  if (resolved.type === "headToHead") {
    return <HeadToHeadPage data={resolved.data} />;
  }

  if (resolved.type === "prediction") {
    const { match } = resolved;
    const prediction = getPredictionForMatch(match);
    const faqs: FaqItem[] = [
      {
        question: `Who has the edge in ${match.team1.name} vs ${match.team2.name}?`,
        answer: `${prediction.winner.name} have the ${prediction.confidence.toLowerCase()} in this preview, based on venue familiarity and recent team context rather than made-up lineups.`,
      },
      {
        question: "Will this page show the today match playing 11?",
        answer:
          "Yes, but only when the official playing XI becomes available. Before that point, the page keeps the lineup block as a tracker and leans on key-player context instead of guessing the team sheet.",
      },
      {
        question: "Where can I follow this fixture live?",
        answer:
          "Every prediction page links to the dedicated preview, live and result pages for the same match, so users can follow one fixture through the full content loop.",
      },
      {
        question: "Does the toss matter for this prediction?",
        answer:
          "Yes. The pitch and dew angle can shift the match significantly, which is why the toss block is kept separate from the prediction summary.",
      },
    ];

    const structuredData = [
      buildFaqSchema(faqs),
      {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `${match.team1.name} vs ${match.team2.name}`,
        startDate: match.dateTimeGMT,
        sport: "Cricket",
        location: {
          "@type": "Place",
          name: match.venue,
        },
        url: `${SITE_URL}/${seoSlug}`,
      },
    ];

    return (
      <div className={`container ${styles.page}`}>
        <JsonLd data={structuredData} />

        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>Prediction Page</div>
            <h1 className={styles.title}>
              {match.team1.name} vs {match.team2.name} Prediction
            </h1>
            <p className={styles.subtitle}>
              This page targets the exact head-to-head prediction query people search. It keeps the preview focused on the real fixture, the venue it will be played at, the toss and lineup checkpoints users care about, and the internal routes they need next.
            </p>
            <div className={styles.metaRow}>
              <span className={styles.metaBadge}>{match.matchNumber}</span>
              <span className={styles.metaBadge}>{formatIndiaDateTime(match.dateTimeGMT)} IST</span>
              <span className={styles.metaBadge}>{match.venue}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.splitGrid}>
            <article className={styles.card}>
              <h2 className={styles.sectionTitle}>Preview Angle</h2>
              <div className={styles.textBlock}>
                <p>
                  {match.team1.name} vs {match.team2.name} is one of the cleanest kinds of cricket search intent because users already know the fixture and want a fast editorial read on how the game might tilt. The most useful version of that page is not an inflated essay. It is a sharp preview built around venue, toss, key players and where the momentum may shift.
                </p>
                <p>
                  For this fixture, the current lean is toward {prediction.winner.name}. That is an inference, not a guarantee. It is built from known venue context and recent team positioning, then kept separate from the toss and lineup sections so the page can stay accurate even before the final team sheets are confirmed.
                </p>
              </div>
            </article>

            <article className={`${styles.card} ${styles.cardAlt}`}>
              <h2 className={styles.sectionTitle}>Prediction Call</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Projected Edge</div>
                  <div className={styles.statValue}>{prediction.winner.shortName}</div>
                  <div className={styles.statSubtext}>{prediction.confidence}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Venue</div>
                  <div className={styles.statValue}>{match.venue.split(",")[0]}</div>
                  <div className={styles.statSubtext}>Pitch and toss context matter heavily here.</div>
                </div>
              </div>
              <div className={styles.summaryList}>
                {prediction.reasons.map((reason) => (
                  <div key={reason} className={styles.summaryItem}>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <MatchContent
          match={match}
          quickSummary={[
            `${match.team1.name} vs ${match.team2.name} starts at ${formatIndiaDateTime(match.dateTimeGMT)} IST.`,
            `${prediction.winner.name} hold the ${prediction.confidence.toLowerCase()} according to the current preview model.`,
            "The toss and playing XI blocks stay separate so the page can update honestly as matchday approaches.",
          ]}
          tossText={
            match.tossWinner
              ? `${match.tossWinner} won the toss and chose to ${match.tossChoice || "make the first call"}.`
              : `The toss winner for ${match.team1.shortName} vs ${match.team2.shortName} is not decided yet, so the toss section stays in pre-match mode.`
          }
          playingXiText={`The page keeps a playing XI section because users search for it directly, but it does not publish a guessed XI. Until the official lineup arrives, the goal is to highlight the strongest current players to watch.`}
          predictionTitle="Editorial Match Prediction"
          predictionText={`${prediction.confidence}: ${prediction.winner.name}. ${prediction.reasons.join(" ")}`}
          team1Players={getKeyPlayers(match.team1.name)}
          team2Players={getKeyPlayers(match.team2.name)}
        />

        <InternalLinkGrid
          title="Follow This Match"
          links={[
            {
              href: `/matches/${match.detailSlug}`,
              label: "Preview Page",
              description: "Read the full match preview and quick guide for this fixture.",
            },
            {
              href: `/matches/${match.detailSlug}/live`,
              label: "Live Page",
              description: "Switch into the live page when the score starts moving.",
            },
            {
              href: `/matches/${match.detailSlug}/result`,
              label: "Result Page",
              description: "Open the result page after the game finishes.",
            },
            {
              href: `/${match.venueSlug}`,
              label: "Pitch Report",
              description: "Check the venue pitch report tied to this prediction.",
            },
          ]}
        />

        <FaqSection title="Prediction FAQ" faqs={faqs} />
      </div>
    );
  }

  const { profile, relatedMatches } = resolved;
  const upcomingMatches = relatedMatches
    .filter((match) => new Date(match.dateTimeGMT).getTime() >= Date.now())
    .slice(0, 6);
  const faqs: FaqItem[] = [
    {
      question: `Is ${profile.name} usually a batting or bowling pitch?`,
      answer: profile.pitchSummary,
    },
    {
      question: `What is the toss angle at ${profile.name}?`,
      answer: profile.tossAngle,
    },
    {
      question: `Which IPL teams use ${profile.name} as a home venue?`,
      answer: profile.homeTeams.length
        ? `${profile.homeTeams.join(", ")} use this ground in the current site venue profile.`
        : "The current venue profile does not map a home team yet.",
    },
    {
      question: "Can I open matches scheduled at this venue?",
      answer:
        upcomingMatches.length
          ? "Yes. This page links directly to the upcoming prediction pages and match loops scheduled at the ground."
          : "When the current schedule feed includes a match at this venue, the page links directly to that fixture.",
    },
  ];

  const structuredData = [
    buildFaqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: profile.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.city,
        addressCountry: "India",
      },
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Venue Intent</div>
          <h1 className={styles.title}>{profile.name} Pitch Report</h1>
          <p className={styles.subtitle}>
            This pitch report is written for matchday search intent: what the surface usually offers, how the toss can shape the game, and which current IPL fixtures are linked to this ground. It stays practical and avoids pretending there is a fresh curator report when only historical venue behavior is available.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{profile.city}</span>
            <span className={styles.metaBadge}>{profile.homeTeams.join(", ") || "IPL venue"}</span>
            <span className={styles.metaBadge}>{relatedMatches.length} linked fixtures in current schedule</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Pitch Summary</h2>
            <div className={styles.textBlock}>
              <p>{profile.shortSummary}</p>
              <p>{profile.pitchSummary}</p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Matchday Notes</h2>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span>{profile.tossAngle}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Best suited to: {profile.bestFor}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Key caution: {profile.caution}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>How to Read This Venue</h2>
          <div className={styles.textBlock}>
            <p>
              Good pitch report pages help before the toss and after it. Before the toss, the question is usually whether the ground rewards early aggression, spin through the middle or chasing under lights. After the toss, the question becomes how much the venue amplifies that decision. That is why this page separates the surface summary from the toss angle instead of collapsing everything into one vague paragraph.
            </p>
            <p>
              For {profile.name}, the cleanest way to read the venue is this: {profile.shortSummary.toLowerCase()} That makes it especially useful as an internal link destination from prediction pages, because match previews need one venue-specific page they can trust.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Matches Linked to This Venue</h2>
        <div className={styles.linkGrid}>
          {upcomingMatches.length ? (
            upcomingMatches.map((match) => (
              <Link key={match.id} href={`/${match.predictionSlug}`} className={styles.linkCard}>
                <span className={styles.linkLabel}>
                  {match.team1.name} vs {match.team2.name}
                </span>
                <span className={styles.linkDescription}>
                  {match.matchNumber} • {formatIndiaDateTime(match.dateTimeGMT)} IST
                </span>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              There is no upcoming fixture at this venue in the current schedule slice, but the pitch profile stays useful as a reusable venue reference page.
            </div>
          )}
        </div>
      </section>

      <InternalLinkGrid
        title="Related IPL Pages"
        links={[
          {
            href: "/schedule",
            label: "IPL Schedule",
            description: "Move from the venue into the latest confirmed match list.",
          },
          {
            href: "/predictions",
            label: "Prediction Hub",
            description: "Browse all current team-vs-team prediction pages.",
          },
          {
            href: "/points-table",
            label: "Points Table",
            description: "See how results at this venue can affect the season table.",
          },
          {
            href: "/ipl-live-score-today",
            label: "Live Score Today",
            description: "Jump into the matchday live-intent route when games are on.",
          },
        ]}
      />

      <FaqSection title="Pitch Report FAQ" faqs={faqs} />
    </div>
  );
}
