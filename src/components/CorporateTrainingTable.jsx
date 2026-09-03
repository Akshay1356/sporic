import { Link } from 'react-router-dom';
import styles from './CorporateTrainingTable.module.css';

export default function CorporateTrainingTable() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaCard}>
          <div className={styles.ctaLeft}>
            <span className="section-label" style={{ marginBottom: '0.4rem' }}>
              Sponsored Research &amp; Industrial Consultancy
            </span>
            <h2 className={styles.ctaHeading}>Corporate Training Organized</h2>
            <p className={styles.ctaText}>
              Discover our comprehensive portfolio of specialized corporate training programs, executive workshops, and industry collaborations organized chronologically across VIT Chennai schools.
            </p>
          </div>

          <div className={styles.ctaRight}>
            <Link to="/corporate-training" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontWeight: 800 }}>
              Explore Corporate Training →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
