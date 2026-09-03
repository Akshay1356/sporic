import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VisionCard, MissionCard } from './VisionMissionCard';
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
                src="/vit_chennai_campus.jpg"
                alt="VIT University Chennai Campus"
                className={styles.campusImg}
              />
            </div>
          </motion.div>
        </div>

        {/* Secondary Subgrid: Vision & Mission Interactive Layered Cards + Credentials */}
        <div className={styles.subGrid}>
          {/* Left Sub-Column: Interactive Layered Reveal Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VisionCard />
            <MissionCard />
          </motion.div>

          {/* Right Sub-Column: Credentials Card */}
          <motion.div
            className={styles.credentialsCard}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className={styles.credentialsTitle}>VIT-TEC Credentials &amp; Standards</h3>
            <div className={styles.credentialsGrid}>
              {credentials.map((cred, idx) => (
                <div key={idx} className={styles.credentialItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span className={styles.credentialText}>{cred}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
