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

const pageUrl = `${SITE_URL}/privacy-policy`;

export const metadata: Metadata = {
  title: "IPL Scorebook Privacy Policy",
  description:
    "Read how IPL Scorebook handles analytics, cookies, support messages and basic user privacy across the platform.",
  alternates: {
    canonical: pageUrl,
  },
};

export default function PrivacyPolicyPage() {
  const paragraphs = [
    "Privacy policies are strongest when they explain the real behavior of a site in plain language. IPL Scorebook is a cricket content platform, so most of the information flowing through the site relates to page views, navigation behavior, analytics signals and any direct messages a user sends through the published contact methods. We do not ask readers to create a public account just to browse score pages, player directories or team hubs, which means our privacy model is lighter than a full social platform. Even so, users deserve clarity about what may be collected and why.",
    "Like most modern websites, IPL Scorebook may rely on standard analytics and infrastructure signals to understand which pages are working well, where performance issues appear and how readers move through the site. That can include browser type, approximate device information, referrer data and general usage patterns. This data helps us improve page speed, fix thin or confusing routes, and understand which content journeys are most useful. It is not used to create public user profiles, and we try to keep collection aligned with practical product improvement rather than unnecessary expansion.",
    "Cookies and similar technologies may be used to support analytics, session continuity and, where enabled, advertising systems. That matters because sports sites often need to balance fast page loads with reliable analytics and monetization controls. Our policy approach is to keep monetization subordinate to user experience. In practice, that means we do not intentionally place ads on empty or low-value screens, and we use content thresholds and page structure rules to keep advertising aligned with meaningful editorial content.",
    `If a user contacts IPL Scorebook directly at ${CONTACT_EMAIL} or through the public support channels, we may retain that message long enough to respond, resolve the issue or maintain a basic support history. We do not sell direct-contact information as a standalone asset. We also do not claim perfect technical immunity from all third-party risk; any site that uses analytics, hosting or external scripts depends partly on those services' own privacy and security standards. That is why this page should be read alongside their applicable policies where relevant.`,
    "Users who prefer not to share optional data can usually do so by limiting direct outreach, adjusting browser cookie controls or using privacy-oriented browsing settings. Because the site does not require a reader login for normal use, most visitors can access the core cricket content with relatively limited data exchange. If policy changes are needed as the platform evolves, this page will be updated with a fresh timestamp so the change history remains visible.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What user data does IPL Scorebook collect?",
      answer:
        "The site may collect basic analytics and technical usage information plus any details a user shares directly through contact channels.",
    },
    {
      question: "Does IPL Scorebook use cookies?",
      answer:
        "Yes. Cookies or similar technologies may be used for analytics, site functionality and content-safe advertising systems where enabled.",
    },
    {
      question: "How can I ask a privacy-related question?",
      answer:
        `You can contact IPL Scorebook directly at ${CONTACT_EMAIL} for privacy or data-handling questions.`,
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL Scorebook Privacy Policy",
            description:
              "How IPL Scorebook handles analytics, cookies, support messages and user privacy.",
            path: "/privacy-policy",
            keywords: ["privacy policy", "cookie policy", "ipl scorebook privacy"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Privacy And Data Use</div>
          <h1 className={styles.title}>IPL Scorebook Privacy Policy</h1>
          <p className={styles.subtitle}>
            A plain-language explanation of how analytics, cookies, support messages and platform
            usage data are handled across IPL Scorebook.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Lightweight browsing model</span>
            <span className={styles.metaBadge}>No required user login for core pages</span>
            <span className={styles.metaBadge}>Privacy contact: {CONTACT_EMAIL}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Privacy Overview</h2>
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
            href: "/terms",
            label: "Terms",
            description: "Review platform-use expectations alongside this privacy policy.",
          },
          {
            href: "/contact",
            label: "Contact",
            description: "Reach out directly for privacy or support questions.",
          },
          {
            href: "/about",
            label: "About",
            description: "Read how the site approaches editorial transparency and data-backed pages.",
          },
          {
            href: "/disclaimer",
            label: "Disclaimer",
            description: "See the platform's broader disclosure language for independent coverage.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="This privacy policy describes IPL Scorebook's current handling of analytics, cookies and direct user contact. Third-party services may apply their own policies where relevant."
        wordCount={wordCount}
      />

      <FaqSection title="Privacy Policy FAQ" faqs={faqs} />
    </div>
  );
}
