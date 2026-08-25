import { DOMAINS } from '../data/courses';
import CourseExplorer from '../components/CourseExplorer';
import styles from './DomainPages.module.css';

export default function Management() {
  return (
    <div className={styles.domainPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className={styles.glowOrbCyan} />

        <div className="container">
          <span className="section-label">Strategic Competence</span>
          <h1 className={styles.title}>Management Programs</h1>
          <p className={styles.subtitle}>
            Empowering professionals with strategic operational management, modern marketing blueprints, corporate finance, and business data analytics.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <CourseExplorer initialDomain={DOMAINS.MANAGEMENT} />
        </div>
      </section>
    </div>
  );
}
