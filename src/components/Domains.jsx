import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import { domainInfo } from '../data/courses';
import styles from './Domains.module.css';

export default function Domains() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const iconMap = {
    tech: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    mgmt: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    lead: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 019.918 2.347m-20.21 4.307L12 13.713l8.292-4.307m0 0a50.58 50.58 0 012.658.813M12 13.713v-1.896" />
      </svg>
    ),
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className={`section ${styles.domainsSection}`} id="domains" ref={containerRef}>
      <div className="glow-orb glow-violet" style={{ top: '30%', right: '5%', width: '400px', height: '400px' }} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="section-label">Tailored Specialisations</span>
          <h2 className="section-title">Explore Our Learning Domains</h2>
          <p className="section-subtitle">
            Industry-oriented upskilling across technology integration, strategic management, and high-impact interpersonal leadership development.
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {domainInfo.map((domain) => (
            <motion.div key={domain.key} variants={cardVariants} className={styles.cardWrapper}>
              <GlassCard glow className={styles.domainCard} padding="lg">
                <div className={`${styles.iconWrap} ${styles[domain.color]}`}>
                  {iconMap[domain.icon]}
                </div>
                
                <h3 className={styles.domainTitle}>{domain.title}</h3>
                <p className={styles.domainDesc}>{domain.description}</p>
                
                <div className={styles.categoriesWrap}>
                  <div className={styles.categoriesTitle}>Includes categories:</div>
                  <div className={styles.categories}>
                    {domain.categories.slice(0, 5).map((cat) => (
                      <span key={cat} className="tag tag-blue" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>
                        {cat}
                      </span>
                    ))}
                    {domain.categories.length > 5 && (
                      <span className={styles.moreCategories}>
                        +{domain.categories.length - 5} More
                      </span>
                    )}
                  </div>
                </div>

                <Link to={domain.path} className={`btn btn-secondary ${styles.exploreBtn}`}>
                  <span>Explore {domain.title}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrow}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
