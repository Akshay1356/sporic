import { DOMAINS } from '../data/courses';
import CourseExplorer from '../components/CourseExplorer';
import styles from './DomainPages.module.css';

export default function Leadership() {
  return (
    <div className={styles.domainPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className={styles.glowOrbViolet} />

        <div className="container">
          <span className="section-label">Human Capital Development</span>
          <h1 className={styles.title}>Leadership & Personality</h1>
          <p className={styles.subtitle}>
            Maximize team efficiency, resolve organizational stress, develop situational leadership acumen, and refine global corporate communications.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <CourseExplorer initialDomain={DOMAINS.LEADERSHIP} />
        </div>
      </section>
    </div>
  );
}
