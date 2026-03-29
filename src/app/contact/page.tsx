import type { Metadata } from "next";
import Link from "next/link";
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

const pageUrl = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title: "Contact IPL Scorebook | Editorial, Support and Partnerships",
  description:
    "Contact IPL Scorebook for editorial feedback, support questions, partnership requests and general platform inquiries.",
  alternates: {
    canonical: pageUrl,
  },
};

const contactLinks = [
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: CONTACT_EMAIL,
    description: "Editorial questions, support requests and policy clarifications.",
  },
  {
    href: "https://wa.me/919427142807",
    label: "+91 94271 42807",
    description: "WhatsApp contact for direct outreach and follow-up.",
  },
  {
    href: "https://instagram.com/mr__j__d_",
    label: "@mr__j__d_",
    description: "Instagram for creator updates and community touchpoints.",
  },
  {
    href: "https://facebook.com/mr__j__d_",
    label: "facebook.com/mr__j__d_",
    description: "Facebook profile for social outreach and messaging.",
  },
];

export default function ContactPage() {
  const paragraphs = [
    "A good contact page should do more than display an email address. It should explain what kinds of messages are helpful, where users can reach the team fastest, and how the site handles support or editorial feedback. IPL Scorebook uses this page as a trust signal as much as a utility page. If a reader spots a data issue, wants to ask about a player page, has a policy question, or wants to discuss a partnership, there should be a clear and visible route for that conversation.",
    `The fastest direct route is email at ${CONTACT_EMAIL}, especially for questions that involve page corrections, feedback about coverage quality, or business and advertising conversations. Social channels are also available for lighter-touch outreach, but email remains the best option when the message needs a proper reply trail or includes multiple details about a fixture, player profile or site issue. That distinction matters because trust pages are strongest when they set expectations clearly instead of listing every platform as if they serve the same purpose.`,
    "This page also exists to support the broader editorial standard of the site. When a platform claims to be useful, it should also be reachable. We want readers to feel comfortable flagging thin content, broken links or confusing route behavior, because that feedback directly improves the product. Contact information is therefore part of the quality system behind the site, not just a formal requirement for policy review.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What should I use the contact page for?",
      answer:
        "You can use it for editorial feedback, correction requests, support questions, partnership discussions or general questions about how the platform works.",
    },
    {
      question: "What is the best way to reach IPL Scorebook?",
      answer:
        `Email at ${CONTACT_EMAIL} is the best route for detailed questions or anything that needs a reliable reply thread.`,
    },
    {
      question: "Can I contact IPL Scorebook about advertising or collaboration?",
      answer:
        "Yes. Business, sponsorship and collaboration questions are appropriate here, especially through the listed email address.",
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "Contact IPL Scorebook",
            description:
              "How to reach IPL Scorebook for support, editorial feedback and partnerships.",
            path: "/contact",
            keywords: ["contact ipl scorebook", "ipl support", "ipl editorial contact"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Reach The Team</div>
          <h1 className={styles.title}>Contact IPL Scorebook</h1>
          <p className={styles.subtitle}>
            Use this page for editorial feedback, corrections, support questions and partnership
            discussions across the platform.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Primary email: {CONTACT_EMAIL}</span>
            <span className={styles.metaBadge}>Response channel: email first</span>
            <span className={styles.metaBadge}>Location: Navsari, Gujarat, India</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>How To Reach Us</h2>
          <div className={styles.textBlock}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Methods</h2>
        <div className={styles.linkGrid}>
          {contactLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.linkCard}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span className={styles.linkLabel}>{item.label}</span>
              <span className={styles.linkDescription}>{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <InternalLinkGrid
        title="Helpful Reference Pages"
        links={[
          {
            href: "/about",
            label: "About IPL Scorebook",
            description: "Read how the site approaches coverage, trust and editorial context.",
          },
          {
            href: "/privacy-policy",
            label: "Privacy Policy",
            description: "See how contact and analytics-related data is handled on the platform.",
          },
          {
            href: "/terms",
            label: "Terms",
            description: "Review platform usage terms, content expectations and limitations.",
          },
          {
            href: "/ipl-live-score-today",
            label: "Live Score Today",
            description: "Return to the matchday coverage route after getting support details.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Contact information is maintained directly by IPL Scorebook and is presented here to support editorial transparency and user support."
        wordCount={wordCount}
      />

      <FaqSection title="Contact FAQ" faqs={faqs} />
    </div>
  );
}
