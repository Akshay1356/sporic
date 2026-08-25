import { DOMAINS } from '../data/courses';
import CourseExplorer from '../components/CourseExplorer';
import styles from './DomainPages.module.css';

export default function Technology() {
  return (
    <div className={styles.domainPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className={styles.glowOrb} />
        
        <div className="container">
          <span className="section-label">Upskilling & Reskilling</span>
          <h1 className={styles.title}>Technology Programs</h1>
          <p className={styles.subtitle}>
            State-of-the-art training modules spanning emerging tech sectors like Industry 4.0, Electric Vehicles, Advanced Optics, ADAS, and Simulation models.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <CourseExplorer initialDomain={DOMAINS.TECHNOLOGY} />
        </div>
      </section>
    </div>
  );
}
