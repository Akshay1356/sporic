import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './VisionMission.module.css';

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

export default function VisionMission() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  // Manage active panel on desktop hover or mobile tap
  const [activePanel, setActivePanel] = useState(null); // 'vision' | 'mission' | null
  const [toggledPanel, setToggledPanel] = useState(null); // For mobile tap toggle

  const currentActive = activePanel || toggledPanel;

  const handlePanelClick = useCallback((panel) => {
    setToggledPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const handleKeyDown = (e, panel) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePanelClick(panel);
    }
  };

  return (
    <section className={styles.section} id="vision-mission" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>STRATEGIC FOUNDATION</span>
          <h2 className={styles.mainTitle}>Vision &amp; Mission</h2>
          <p className={styles.subtitle}>
            Guiding our commitment to technical competence, industry leadership, and transformative enterprise collaboration.
          </p>
        </motion.div>

        {/* Interactive Dual-Panel Grid */}
        <div className={styles.panelsContainer}>
          {/* Connecting Line Between Vision and Mission on Desktop */}
          <div className={styles.connectingTrack} aria-hidden="true">
            <div className={styles.connectingLine} />
            <div className={styles.connectingFlow} />
          </div>

          {/* VISION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={styles.cardWrapper}
          >
            <div
              className={`${styles.panelCard} ${styles.visionCard} ${
                currentActive === 'vision' ? styles.cardActive : ''
              } ${currentActive === 'mission' ? styles.cardReceded : ''}`}
              onMouseEnter={() => setActivePanel('vision')}
              onMouseLeave={() => setActivePanel(null)}
              onClick={() => handlePanelClick('vision')}
              onKeyDown={(e) => handleKeyDown(e, 'vision')}
              tabIndex={0}
              role="button"
              aria-expanded={currentActive === 'vision'}
              aria-label="Vision: Future Horizon & Global Competence. Click or hover to explore details."
            >
              {/* Top Border Accent Bar */}
              <div className={`${styles.accentTopBar} ${styles.visionAccentBar}`} />

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.visionIconBox}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                    <circle cx="12" cy="12" r="3" fill="#D97706" fillOpacity="0.3" />
                  </svg>
                </div>

                <div className={styles.titleArea}>
                  <h3 className={styles.cardHeading}>VISION</h3>
                  <p className={styles.cardSubtitle}>Future Horizon &amp; Global Competence</p>
                </div>

                {/* Explore Cue Badge */}
                <div className={`${styles.exploreCue} ${styles.visionCue}`} aria-hidden="true">
                  <span>{currentActive === 'vision' ? 'Close' : 'Explore'}</span>
                  <span className={styles.cueArrow}>{currentActive === 'vision' ? '↑' : '→'}</span>
                </div>
              </div>

              {/* Content Reveal Area via Grid Animation */}
              <div className={styles.revealGrid}>
                <div className={styles.revealInner}>
                  <div className={styles.divider} />
                  <p className={styles.statementText}>
                    Impart skills to enhance performance, productivity and global competence across industries.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MISSION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={styles.cardWrapper}
          >
            <div
              className={`${styles.panelCard} ${styles.missionCard} ${
                currentActive === 'mission' ? styles.cardActive : ''
              } ${currentActive === 'vision' ? styles.cardReceded : ''}`}
              onMouseEnter={() => setActivePanel('mission')}
              onMouseLeave={() => setActivePanel(null)}
              onClick={() => handlePanelClick('mission')}
              onKeyDown={(e) => handleKeyDown(e, 'mission')}
              tabIndex={0}
              role="button"
              aria-expanded={currentActive === 'mission'}
              aria-label="Mission: Collaboration & Regional Co-Creation. Click or hover to explore details."
            >
              {/* Top Border Accent Bar */}
              <div className={`${styles.accentTopBar} ${styles.missionAccentBar}`} />

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.missionIconBox}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <div className={styles.titleArea}>
                  <h3 className={styles.cardHeading}>MISSION</h3>
                  <p className={styles.cardSubtitle}>Collaboration &amp; Regional Co-Creation</p>
                </div>

                {/* Explore Cue Badge */}
                <div className={`${styles.exploreCue} ${styles.missionCue}`} aria-hidden="true">
                  <span>{currentActive === 'mission' ? 'Close' : 'Explore'}</span>
                  <span className={styles.cueArrow}>{currentActive === 'mission' ? '↑' : '→'}</span>
                </div>
              </div>

              {/* Content Reveal Area via Grid Animation */}
              <div className={styles.revealGrid}>
                <div className={styles.revealInner}>
                  <div className={styles.divider} />
                  <ul className={styles.bulletList}>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletCheck} aria-hidden="true">✓</span>
                      <span className={styles.statementText}>
                        Thriving collaboration with national &amp; international industries and institutions.
                      </span>
                    </li>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletCheck} aria-hidden="true">✓</span>
                      <span className={styles.statementText}>
                        Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* VIT-TEC Credentials & Standards Card (Directly below Vision & Mission) */}
        <motion.div
          className={styles.credentialsCard}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className={styles.credentialsHeader}>
            <span className={styles.credentialsEyebrow}>INSTITUTIONAL EXCELLENCE</span>
            <h3 className={styles.credentialsTitle}>VIT-TEC Credentials &amp; Standards</h3>
          </div>
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
    </section>
  );
}
