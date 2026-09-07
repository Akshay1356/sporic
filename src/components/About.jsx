import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

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
            {isAboutPage ? (
              <Link to="/courses" className={styles.knowMoreBtn}>
                Explore All Courses →
              </Link>
            ) : (
              <Link to="/about" className={styles.knowMoreBtn}>
                Know More About Us →
              </Link>
            )}
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
      </div>
    </section>
  );
}
