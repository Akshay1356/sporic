import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <div className={styles.headerWrap}>
          <span className={styles.eyebrow}>SpoRIC Track Record</span>
          <h2 className={styles.title}>Landmark Executive &amp; Corporate Programs</h2>
          <p className={styles.subtitle}>
            A proven legacy of upskilling senior leadership, engineering cohorts, and corporate workforces across automotive, manufacturing, and technology enterprises.
          </p>
        </div>

        <div className={styles.programsGrid}>
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.id}
              className={styles.programCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={prog.image || '/gallery/lucas_tvs_management_program.jpg'}
                  alt={prog.title}
                  className={styles.programImg}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}>
                  <span className="tag tag-cyan" style={{ fontSize: '0.68rem', fontWeight: '800' }}>
                    {prog.category}
                  </span>
                  <span className="tag tag-blue" style={{ fontSize: '0.68rem', fontWeight: '700' }}>
                    {prog.year}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                {prog.clientOrCohort && (
                  <div className={styles.clientBadge}>🏢 {prog.clientOrCohort}</div>
                )}
                <h3 className={styles.cardTitle}>{prog.title}</h3>
                <p className={styles.description}>{prog.description}</p>

                {prog.outcomes && Array.isArray(prog.outcomes) && prog.outcomes.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Key Outcomes:
                    </div>
                    <ul className={styles.outcomesList}>
                      {prog.outcomes.map((out, i) => (
                        <li key={i}>{out}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.metaRow}>
                  <span>📅 {prog.date || prog.year}</span>
                  <span>👥 {prog.participantsCount || 'Corporate Cohort'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
