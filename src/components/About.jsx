import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import styles from './About.module.css';

const credentials = [
  'A globally-renowned institute (VIT)',
  'State-of-the-art infrastructure',
  'Alumnus in many countries',
  '90+ Courses & 3 Learning Domains',
  '200+ proven Industry solutions',
  '500+ trained Corporates',
  'Globally recognized advanced technical courses',
  'Well researched learning resources',
  'Highly Qualified & Dedicated Professionals',
  'Expertise in Diversified Domains',
  'Industry Sponsored Centre of Excellence',
  'Custom Designed Training Programs',
  'Basics-to-Advanced Levels of Training',
  'Face-to-Face & Blended mode Training',
];

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className={`section ${styles.aboutSection}`} id="about" ref={containerRef}>
      <div className="glow-orb glow-blue" style={{ top: '20%', left: '10%', width: '300px', height: '300px' }} />
      <div className="glow-orb glow-cyan" style={{ bottom: '20%', right: '10%', width: '300px', height: '300px' }} />
      
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="section-label">Institutional Credibility</span>
          <h2 className="section-title">About VIT-TEC</h2>
          <p className="section-subtitle">
            VIT Technology Enhancement Centre is dedicated to upskilling, reskilling, and providing professional development programs aligned with global industry needs.
          </p>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Left Column - Vision & Mission Cards */}
          <div className={styles.leftCol}>
            <motion.div variants={itemVariants} className={styles.flipCardContainer}>
              <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                  <div className={`${styles.flipCardFront} glass`}>
                    <h3 className={styles.cardTitle}>Vision</h3>
                    <div className={styles.flipIndicator}>Hover to Reveal</div>
                  </div>
                  <div className={styles.flipCardBack}>
                    <p className={styles.cardDesc}>
                      Impart skills to enhance performance, productivity and global competence.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.flipCardContainer}>
              <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                  <div className={`${styles.flipCardFront} glass`}>
                    <h3 className={styles.cardTitle}>Mission</h3>
                    <div className={styles.flipIndicator}>Hover to Reveal</div>
                  </div>
                  <div className={styles.flipCardBack}>
                    <ul className={styles.missionList}>
                      <li>Thriving collaboration with national &amp; international industries and institutions.</li>
                      <li>Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Credentials list */}
          <motion.div variants={itemVariants} className={styles.rightCol}>
            <GlassCard padding="lg" glow className={styles.credentialsCard}>
              <h3 className={styles.credentialsTitle}>VIT-TEC Credentials</h3>
              <div className={styles.credentialsGrid}>
                {credentials.map((cred, idx) => (
                  <div key={idx} className={styles.credentialItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.credentialText}>{cred}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
