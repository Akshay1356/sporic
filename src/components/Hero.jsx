import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import VitTecAnimation from './VitTecAnimation';
import styles from './Hero.module.css';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <section className={styles.hero} aria-label="VIT-TEC Hero Section">
      <div className={styles.heroOverlay} />

      <div className={styles.container}>
        <div className={styles.heroCenteredWrapper}>
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

            {/* Central VIT-TEC Innovation & Technology Animation */}
            <div className={styles.animationSlot}>
              <VitTecAnimation />
            </div>

            {/* Supporting Description */}
            <motion.p
              className={styles.heroDescription}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            >
              Industry-aligned training and research centre driving innovation, employability and excellence.
            </motion.p>

            {/* Prominent Course Search Bar */}
            <motion.div
              className={styles.searchContainer}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '8px', flexShrink: 0 }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses (e.g. AI, Python, Management, EV, CAD)..."
                  className={styles.searchInput}
                  aria-label="Search courses by keyword"
                />
                <button type="submit" className={styles.searchButton}>
                  <span>Search</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              {/* Quick Topic Badges */}
              <div className={styles.searchTags}>
                <span>Popular:</span>
                <Link to="/courses?search=AI" className={styles.searchTagBtn}>Generative AI</Link>
                <Link to="/courses?search=Full+Stack" className={styles.searchTagBtn}>Full Stack</Link>
                <Link to="/courses?search=EV" className={styles.searchTagBtn}>EV Powertrain</Link>
                <Link to="/courses?search=Management" className={styles.searchTagBtn}>Operations</Link>
                <Link to="/courses?search=Leadership" className={styles.searchTagBtn}>Leadership</Link>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className={styles.heroCTAs}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
            >
              <Link to="/courses" className={styles.ctaPrimary}>
                Browse All Courses
                <ArrowIcon />
              </Link>
              <Link to="/about" className={styles.ctaSecondary}>
                Learn More About Us →
              </Link>
            </motion.div>
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
