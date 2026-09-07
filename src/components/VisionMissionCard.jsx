import { useState, useCallback } from 'react';
import styles from './VisionMissionCard.module.css';

export function VisionCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const isActive = isHovered || isToggled;

  const handleToggle = useCallback(() => {
    setIsToggled((prev) => !prev);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <>
      <div
        className={`${styles.glassCard} ${isActive ? styles.cardActive : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isActive}
        aria-label="VIT-TEC Vision: Future Horizon & Global Competence. Click or hover to explore."
      >
        {/* Ambient Liquid Glass Refraction & Sheen Layers */}
        <div className={styles.glassSheen} aria-hidden="true" />
        <div className={styles.ambientBacklight} aria-hidden="true" />

        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={`${styles.iconBox} ${styles.visionIconBox}`}>
            <div className={styles.iconAura} aria-hidden="true" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
              <circle cx="12" cy="12" r="3.5" fill="#F59E0B" fillOpacity="0.45" />
            </svg>
          </div>

          <div className={styles.headerInfo}>
            <span className={`${styles.categoryPill} ${styles.visionPill}`}>
              INSTITUTIONAL VISION
            </span>
            <h3 className={styles.title}>VIT-TEC VISION</h3>
          </div>

          {/* Explore Cue Pill */}
          <div className={`${styles.exploreCue} ${styles.visionExplore}`} aria-hidden="true">
            <span className={styles.cueText}>{isActive ? 'Vision Statement' : 'Explore Vision'}</span>
            <span className={styles.cueArrow}>{isActive ? '↓' : '→'}</span>
          </div>
        </div>

        {/* Supporting Phrase (Always visible preview) */}
        <div className={styles.subtitleRow}>
          <span className={`${styles.accentLine} ${styles.visionAccentLine}`} aria-hidden="true" />
          <h4 className={styles.subtitle}>Future Horizon &amp; Global Competence</h4>
        </div>

        {/* Progressive Multi-Stage Reveal Content */}
        <div className={styles.revealWrapper}>
          <div className={styles.revealInner}>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.contentBody}>
              <p className={styles.statementText}>
                Impart skills to enhance performance, productivity and global competence across industries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Strategic Connection Flow: Vision -> Mission */}
      <div className={styles.connectionWrapper} aria-hidden="true">
        <div className={styles.connectionLine}>
          <div className={styles.connectionBeam} />
        </div>
        <div className={styles.connectionBadge}>
          <span className={styles.connectionLabel}>STRATEGIC CONTINUITY</span>
          <span className={styles.connectionArrow}>↓</span>
        </div>
        <div className={styles.connectionLine}>
          <div className={styles.connectionBeam} />
        </div>
      </div>
    </>
  );
}

export function MissionCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const isActive = isHovered || isToggled;

  const handleToggle = useCallback(() => {
    setIsToggled((prev) => !prev);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`${styles.glassCard} ${isActive ? styles.cardActive : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      aria-label="VIT-TEC Mission: Collaboration & Regional Co-Creation. Click or hover to explore."
    >
      {/* Ambient Liquid Glass Refraction & Sheen Layers */}
      <div className={styles.glassSheen} aria-hidden="true" />
      <div className={`${styles.ambientBacklight} ${styles.missionBacklight}`} aria-hidden="true" />

      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={`${styles.iconBox} ${styles.missionIconBox}`}>
          <div className={styles.iconAura} aria-hidden="true" />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div className={styles.headerInfo}>
          <span className={`${styles.categoryPill} ${styles.missionPill}`}>
            STRATEGIC MISSION
          </span>
          <h3 className={styles.title}>VIT-TEC MISSION</h3>
        </div>

        {/* Explore Cue Pill */}
        <div className={`${styles.exploreCue} ${styles.missionExplore}`} aria-hidden="true">
          <span className={styles.cueText}>{isActive ? 'Mission Actions' : 'Explore Mission'}</span>
          <span className={styles.cueArrow}>{isActive ? '↓' : '→'}</span>
        </div>
      </div>

      {/* Supporting Phrase (Always visible preview) */}
      <div className={styles.subtitleRow}>
        <span className={`${styles.accentLine} ${styles.missionAccentLine}`} aria-hidden="true" />
        <h4 className={styles.subtitle}>Collaboration &amp; Regional Co-Creation</h4>
      </div>

      {/* Progressive Multi-Stage Reveal Content */}
      <div className={styles.revealWrapper}>
        <div className={styles.revealInner}>
          <div className={styles.divider} aria-hidden="true" />
          <ul className={styles.missionList}>
            <li className={styles.missionItem}>
              <span className={styles.checkPill} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className={styles.statementText}>
                Thriving collaboration with national &amp; international industries and institutions.
              </span>
            </li>
            <li className={styles.missionItem}>
              <span className={styles.checkPill} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className={styles.statementText}>
                Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
