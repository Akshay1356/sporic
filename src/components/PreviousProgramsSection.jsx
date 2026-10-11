import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllPreviousPrograms } from '../data/previousPrograms';
import styles from './PreviousProgramsSection.module.css';

export default function PreviousProgramsSection() {
  const [programs, setPrograms] = useState(getAllPreviousPrograms());

  useEffect(() => {
    setPrograms(getAllPreviousPrograms());

    const handleStorage = () => setPrograms(getAllPreviousPrograms());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!programs || programs.length === 0) return null;

  return (
    <section className={styles.section} id="previous-programs" aria-label="Landmark Previous Programs">
      <div className="container">
        {/* Section Header */}
        <div className={styles.headerWrap}>
          <span className={styles.eyebrow}>SpoRIC Track Record</span>
          <h2 className={styles.title}>Landmark Executive &amp; Corporate Programs</h2>
          <p className={styles.subtitle}>
            A proven legacy of upskilling senior leadership, engineering cohorts, and corporate workforces across automotive, manufacturing, and technology enterprises.
          </p>
        </div>

        {/* Balanced Program Grid */}
        <div className={styles.programsGrid}>
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.id}
              className={styles.programCard}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Signature Yellow Institutional Accent */}
              <div className={styles.yellowAccent} />

              <div className={styles.imageWrapper}>
                <img
                  src={prog.image || '/gallery/lucas_tvs_management_program.jpg'}
                  alt={prog.title}
                  className={styles.programImg}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}>
                  <span className={styles.categoryPill}>
                    {prog.category}
                  </span>
                  <span className={styles.yearPill}>
                    {prog.year}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                {prog.clientOrCohort && (
                  <div className={styles.clientBadge}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>{prog.clientOrCohort}</span>
                  </div>
                )}

                <h3 className={styles.cardTitle}>{prog.title}</h3>
                <p className={styles.description}>{prog.description}</p>

                {prog.outcomes && Array.isArray(prog.outcomes) && prog.outcomes.length > 0 && (
                  <div className={styles.outcomesWrapper}>
                    <div className={styles.outcomesHeading}>
                      Key Outcomes
                    </div>
                    <ul className={styles.outcomesList}>
                      {prog.outcomes.map((out, i) => (
                        <li key={i}>{out}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{prog.date || prog.year}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{prog.participantsCount || 'Corporate Cohort'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/gallery" className={styles.galleryCtaCard} title="Explore VIT-TEC Training Gallery">
            <div className={styles.ctaContent}>
              <h4 className={styles.ctaTitle}>Explore More Training &amp; Events</h4>
              <p className={styles.ctaText}>View more moments, programs and activities from VIT-TEC.</p>
            </div>
            <span className={styles.ctaBtn}>
              View Gallery
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
