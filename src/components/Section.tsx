import type { ReactNode } from "react";
import styles from "./seo-ui.module.css";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Section({ title, description, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
