import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="VIT-TEC Hero Section">
      <div className={styles.heroOverlay} />
      
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Small Eyebrow Badge */}
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              <span>VIT Technology Enhancement Centre</span>
            </div>

            {/* Large Bold Headline */}
            <h1 className={styles.headline}>
              Enhancing Skills.
              <span className={styles.headlineGradient}>Empowering Minds.</span>
              Transforming Futures.
            </h1>

            {/* Supporting Description */}
            <p className={styles.heroDescription}>
              Industry-aligned training and research centre driving innovation,
              employability and excellence.
            </p>

            {/* CTAs */}
            <div className={styles.heroCTAs}>
              <Link to="/courses" className={styles.ctaPrimary}>
                Explore Programs
                <ArrowIcon />
              </Link>
              <Link to="/about" className={styles.ctaSecondary}>
                Learn More →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.167 10h11.666M10.833 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
