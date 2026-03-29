import type { Metadata } from "next";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import { CONTACT_EMAIL, DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/terms`;

export const metadata: Metadata = {
  title: "IPL Scorebook Terms",
  description:
    "Read the IPL Scorebook terms covering content use, platform limitations, independence and user responsibilities.",
  alternates: {
    canonical: pageUrl,
  },
};

export default function TermsPage() {
  const paragraphs = [
    "These terms explain how IPL Scorebook should be used and what users should expect from the platform. The site is built to provide cricket information, original editorial context, player and team research, and connected matchday pages. While we work to keep those pages useful and accurate, the platform is still an independent publishing product rather than an official league service. That matters because readers should understand both what the site offers and where its limits sit.",
    "All content on IPL Scorebook is provided for informational purposes. Users may browse, read and use the site for personal research, fandom and general reference, but they should not assume that every page reflects official franchise or league communication. We do not claim affiliation with the IPL, BCCI or any participating team, and any trademarks or official branding remain the property of their respective owners. Readers should therefore treat the platform as an independent analytical and editorial destination rather than a governing source.",
    "Users should also avoid copying or redistributing large parts of the site's original written content, design or structured datasets as if they were their own work. That includes long-form editorial text, curated team and player datasets, and the internal linking structure used to organize the cricket content platform. Linking to the site is fine; reproducing it wholesale is not. These expectations are standard for independent publishing projects and help protect the value of the work that goes into making the platform useful in the first place.",
    "Because IPL Scorebook covers live matches, player profiles, predictions and standings, some pages are time-sensitive by nature. We try to keep those routes accurate and transparent, but we do not guarantee uninterrupted availability, perfect live-feed continuity or risk-free decision support for betting, fantasy picks or commercial use. Match predictions and analysis are editorial tools, not promises. Users remain responsible for how they interpret or act on the information they read here.",
    `If you have a question about these terms or believe a piece of content should be reviewed, please contact IPL Scorebook at ${CONTACT_EMAIL}. Continued use of the platform implies acceptance of these terms and of any clearly published updates made to improve the site's quality, safety or legal clarity.`,
  ];

  const faqs: FaqItem[] = [
    {
      question: "Is IPL Scorebook an official IPL platform?",
      answer:
        "No. IPL Scorebook is independent and is not affiliated with the IPL, BCCI or any franchise.",
    },
    {
      question: "Can I reuse IPL Scorebook content on my own site?",
      answer:
        "You may reference or link to the site, but you should not republish large parts of the original written content, design or curated datasets as your own work.",
    },
    {
      question: "Are predictions or analysis guaranteed outcomes?",
      answer:
        "No. Predictions and match analysis are editorial tools and should not be treated as guarantees or as decision support without your own judgment.",
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL Scorebook Terms",
            description:
              "Platform terms for IPL Scorebook covering use, content ownership and limitations.",
            path: "/terms",
            keywords: ["terms", "ipl scorebook terms", "content usage policy"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Platform Terms</div>
          <h1 className={styles.title}>IPL Scorebook Terms</h1>
          <p className={styles.subtitle}>
            Platform-use expectations covering independence, content ownership, user
            responsibilities and the limits of time-sensitive cricket coverage.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Independent platform terms</span>
            <span className={styles.metaBadge}>Editorial content is informational</span>
            <span className={styles.metaBadge}>Questions: {CONTACT_EMAIL}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Terms Of Use</h2>
          <div className={styles.textBlock}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <InternalLinkGrid
        title="Related Trust Pages"
        links={[
          {
            href: "/privacy-policy",
            label: "Privacy Policy",
            description: "See how user data and analytics-related information are handled.",
          },
          {
            href: "/contact",
            label: "Contact",
            description: "Reach the site directly with questions or policy concerns.",
          },
          {
            href: "/about",
            label: "About",
            description: "Read the editorial model and publishing standards behind the platform.",
          },
          {
            href: "/disclaimer",
            label: "Disclaimer",
            description: "Review broader independent-coverage and prediction disclosures.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="These terms describe the current usage expectations for IPL Scorebook and may be updated as the platform evolves."
        wordCount={wordCount}
      />

      <FaqSection title="Terms FAQ" faqs={faqs} />
    </div>
  );
}
