import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Certification.module.css';

export default function Certification() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className={styles.certSection} id="certification" ref={containerRef}>
      <div className="glow-orb glow-blue" style={{ bottom: '10%', right: '20%', width: '400px', height: '400px' }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.grid}>
          {/* Left: Info */}
          <motion.div 
            className={styles.infoCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-label">Validation of Skills</span>
            <h2 className="section-title">Learn. Apply. Get Certified.</h2>
            <p className={styles.description}>
              Each training module includes rigorous evaluations and capstone projects. Upon successful completion, professionals receive an industry-recognized certificate from the Dean, Sponsored Research & Industrial Consultancy (SpoRIC), VIT.
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <span className={styles.icon}>🎓</span>
                <div>
                  <h4>VIT Brand Valuation</h4>
                  <p>Certified by one of India's leading research universities.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.icon}>🌐</span>
                <div>
                  <h4>Global Competency</h4>
                  <p>Accepted and respected by corporates across multiple countries.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Certificate Image */}
          <motion.div 
            className={styles.visualCol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className={styles.certPerspectiveWrap}>
              <div className={styles.certCard}>
                <img
                  src="/vit_certificate.png"
                  alt="VIT-TEC Certificate of Completion"
                  className={styles.certImg}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
