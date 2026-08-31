import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import styles from './Certification.module.css';

export default function Certification() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.certSection}`} id="certification" ref={containerRef}>
      <div className="glow-orb glow-blue" style={{ bottom: '10%', right: '20%', width: '400px', height: '400px' }} />
      
      <div className="container">
        <div className={styles.grid}>
          {/* Left: Info */}
          <motion.div 
            className={styles.infoCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
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

          {/* Right: Certificate Mockup */}
          <motion.div 
            className={styles.visualCol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className={styles.certPerspectiveWrap}>
              <GlassCard glow className={styles.certMockup} padding="xl">
                {/* Gold Border Shimmer */}
                <div className={styles.shimmer} />
                
                {/* Certificate Content */}
                <div className={styles.certHeader}>
                  <div className={styles.vitLogoMock}>
                    <span className={styles.vitText}>Vellore Institute of Technology</span>
                    <span className={styles.vitSub}>Chennai Campus</span>
                  </div>
                  <span className={styles.certId}>ID: VITTEC-CERT-2026</span>
                </div>

                <div className={styles.certBody}>
                  <h3 className={styles.certTitle}>Certificate of Completion</h3>
                  <p className={styles.certSubText}>This is to certify that the candidate has successfully completed</p>
                  <div className={styles.coursePlaceholder}>Advanced Technology Enhancement Program</div>
                  <p className={styles.durationPlaceholder}>conducted by VIT-TEC (Vellore Institute of Technology Training & Education Centre)</p>
                </div>

                <div className={styles.certFooter}>
                  <div className={styles.signBlock}>
                    <div className={styles.line} />
                    <span>Dean, SpoRIC</span>
                  </div>
                  <div className={styles.sealBlock}>
                    <div className={styles.seal}>
                      <span>VIT-TEC</span>
                      <span>SEAL</span>
                    </div>
                  </div>
                  <div className={styles.signBlock}>
                    <div className={styles.line} />
                    <span>Programme Coordinator</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
