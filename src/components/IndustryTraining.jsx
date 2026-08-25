import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import styles from './IndustryTraining.module.css';

export default function IndustryTraining() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.industrySection}`} ref={containerRef}>
      <div className="glow-orb glow-violet" style={{ top: '20%', left: '5%', width: '350px', height: '350px' }} />

      <div className="container">
        <div className={styles.grid}>
          {/* Left: Graphic Visual */}
          <motion.div
            className={styles.visualCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className={styles.cubeWrapper}>
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>VIT-TEC</div>
                <div className={`${styles.face} ${styles.back}`}>SpoRIC</div>
                <div className={`${styles.face} ${styles.left}`}>Tech</div>
                <div className={`${styles.face} ${styles.right}`}>Mgmt</div>
                <div className={`${styles.face} ${styles.top}`}>EV</div>
                <div className={`${styles.face} ${styles.bottom}`}>AI</div>
              </div>
              <div className={styles.rings}>
                <div className={styles.ring} />
                <div className={styles.ring} />
                <div className={styles.ring} />
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <span className="section-label">Enterprise Solutions</span>
            <h2 className="section-title">Training Solutions for a Changing World</h2>
            <p className={styles.description}>
              VIT-TEC collaborates closely with corporate houses, SMEs, and MSMEs to bridge skill gaps. We design customized programs mapped directly to project specifications and emerging technology paradigms.
            </p>

            <div className={styles.points}>
              <GlassCard className={styles.pointCard} padding="md" hover={false}>
                <h4>Tailored Curriculum</h4>
                <p>We work with your technical leaders to build training models solving immediate pipeline constraints.</p>
              </GlassCard>

              <GlassCard className={styles.pointCard} padding="md" hover={false}>
                <h4>Flexible Deliverables</h4>
                <p>Blended, offline intensive bootcamps, or structured online sessions matching employee shifts.</p>
              </GlassCard>
            </div>

            <div className={styles.actionRow}>
              <Link to="/contact" className="btn btn-primary">
                Partner with Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
