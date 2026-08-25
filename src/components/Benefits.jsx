import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import styles from './Benefits.module.css';

const corporateBenefits = [
  'Enhance Employee Agility',
  'Reduce Skills-gap and Business-gap',
  'Stay updated with Latest Technology',
  'Increase in Productivity & Output',
  'Innovative Idea Generation',
  'Reskilling and Upskilling Employees',
  'Increase in Motivation and Morale',
  'Retain valuable Talent',
  'Remain Competitive in global market',
  'Build Collaborative Work Culture',
  'Impactful custom Business Solutions',
  'Drive organizational mission Forward',
  'Build and manage corporate Brand',
  'Support strategic Business Decisions',
  'Identify leaders & plan Succession',
];

export default function Benefits() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section className={`section ${styles.benefitsSection}`} id="benefits" ref={containerRef}>
      <div className="glow-orb glow-cyan" style={{ top: '10%', right: '10%', width: '350px', height: '350px' }} />
      <div className="glow-orb glow-blue" style={{ bottom: '10%', left: '10%', width: '300px', height: '300px' }} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="section-label">Empowering Teams</span>
          <h2 className="section-title">Why VIT-TEC?</h2>
          <p className="section-subtitle">
            Strategic training solutions that impact performance, motivate professionals, and align human capital with organizational goals.
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {corporateBenefits.map((benefit, idx) => (
            <motion.div key={idx} variants={cardVariants} className={styles.cardWrapper}>
              <GlassCard className={styles.benefitCard} padding="md" hover glow={idx % 3 === 0}>
                <div className={styles.benefitContent}>
                  <div className={styles.iconCircle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className={styles.text}>{benefit}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
