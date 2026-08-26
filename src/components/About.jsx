import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const credentials = [
  'A globally-renowned institute (VIT)',
  'State-of-the-art infrastructure',
  'Alumnus in many countries',
  '90+ Courses & 3 Learning Domains',
  '200+ proven Industry solutions',
  '500+ trained Corporates',
  'Globally recognized technical courses',
  'Well researched learning resources',
  'Highly Qualified Professionals',
  'Expertise in Diversified Domains',
  'Industry Sponsored CoE',
  'Custom Designed Training',
  'Basics-to-Advanced Training',
  'Face-to-Face & Blended mode',
];

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section className={styles.aboutSection} id="about" ref={containerRef}>
      <div className="container">
        {/* Main Editorial Split */}
        <div className={styles.aboutGrid}>
          {/* Left Column: Heading & Story */}
          <motion.div
            className={styles.leftCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrow}>ABOUT VIT-TEC</span>
            <h2 className={styles.title}>
              Building Competence.<br />Creating Impact.
            </h2>
            <p className={styles.description}>
              VIT-TEC offers industry-focused programs and solutions designed to bridge
              the gap between academia and industry. We empower learners and professionals
              with future-ready skills and technologies.
            </p>
            <Link to="/about" className={styles.knowMoreBtn}>
              Know More About Us →
            </Link>
          </motion.div>

          {/* Right Column: Campus Image */}
          <motion.div
            className={styles.rightCol}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
                alt="VIT Campus Architecture"
                className={styles.campusImg}
              />
            </div>
          </motion.div>
        </div>

        {/* Secondary Subgrid: Vision & Mission 3D Flip Cards + Credentials */}
        <div className={styles.subGrid}>
          <div>
            <div className={styles.flipCardContainer}>
              <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                  <div className={styles.flipCardFront}>
                    <h3 className={styles.cardTitle}>Vision</h3>
                    <div className={styles.flipIndicator}>Hover to Reveal</div>
                  </div>
                  <div className={styles.flipCardBack}>
                    <p className={styles.cardDesc}>
                      Impart skills to enhance performance, productivity and global competence across industries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.flipCardContainer}>
              <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                  <div className={styles.flipCardFront}>
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
            </div>
          </div>

          {/* Credentials Card */}
          <div className={styles.credentialsCard}>
            <h3 className={styles.credentialsTitle}>VIT-TEC Credentials &amp; Standards</h3>
            <div className={styles.credentialsGrid}>
              {credentials.map((cred, idx) => (
                <div key={idx} className={styles.credentialItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span className={styles.credentialText}>{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
