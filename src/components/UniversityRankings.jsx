import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getNaacData, getAllRankings } from '../data/rankingsData';
import styles from './UniversityRankings.module.css';

export default function UniversityRankings() {
  const [naac, setNaac] = useState(() => getNaacData());
  const [rankings, setRankings] = useState(() => getAllRankings());
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  useEffect(() => {
    const handleUpdate = () => {
      setNaac(getNaacData());
      setRankings(getAllRankings());
    };
    window.addEventListener('sporic_rankings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sporic_rankings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section className={styles.rankingsSection} id="rankings" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Institutional Recognitions</span>
          <h2 className={styles.title}>University Rankings</h2>
          <p className={styles.subtitle}>
            Benchmarked against premier global and national institutions, upholding continuous academic excellence and high-impact research.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout: Featured NAAC Card (Left) + Grid of 8 Rankings (Right) */}
        <div className={styles.layoutGrid}>
          {/* Featured NAAC Accreditation Card */}
          <motion.div
            className={styles.naacCard}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Signature Institutional Yellow Accent Bar */}
            <div className={styles.yellowBar} />

            <div className={styles.naacTop}>
              <div className={styles.naacBadge}>
                <span className={styles.naacBadgeDot} />
                <span>Featured Accreditation</span>
              </div>

              <h3 className={styles.naacAgency}>{naac.agency}</h3>
              <p className={styles.naacAgencyFull}>{naac.fullName}</p>

              <div className={styles.naacGradeBlock}>
                <div className={styles.naacGradeLabel}>Accredited Grade</div>
                <div className={styles.naacGradeValue}>{naac.grade}</div>
                <div className={styles.naacScoreRow}>
                  <span className={styles.naacScoreLabel}>{naac.cgpaLabel}:</span>
                  <span>{naac.score}</span>
                </div>
              </div>
            </div>

            <div className={styles.naacBottom}>
              <div className={styles.naacCycleTag}>
                <span>{naac.cycle}</span>
              </div>
              <p className={styles.naacDesc}>{naac.description}</p>
            </div>
          </motion.div>

          {/* Clean Grid of 8 National and International Ranking Cards */}
          <div className={styles.rankingGrid}>
            {rankings.map((item, idx) => (
              <motion.div
                key={item.id}
                className={styles.rankingCard}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Subtle Yellow Accent Bar on Top */}
                <div className={styles.cardYellowAccent} />

                <div className={styles.cardHeader}>
                  <span className={styles.agencyName} title={item.agency}>
                    {item.agency}
                  </span>
                  <span className={styles.yearPill}>{item.year}</span>
                </div>

                <div className={styles.rankValue}>{item.rank}</div>

                <p className={styles.cardDescription}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
