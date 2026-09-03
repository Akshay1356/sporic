import { useState } from 'react';
import styles from './VisionMissionCard.module.css';

export function VisionCard() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      className={`${styles.cardContainer} ${isRevealed ? styles.cardRevealed : ''}`}
      onClick={() => setIsRevealed(!isRevealed)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsRevealed(!isRevealed);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Vision Card - Hover or tap to reveal the institutional vision statement"
    >
      {/* Glow background accent */}
      <div className={styles.cardGlow} />

      {/* Main Content Area (Guaranteed Readable Width & Text Priority) */}
      <div className={styles.contentArea}>
        {/* Header Badges */}
        <div className={styles.headerRow}>
          <span className={styles.categoryBadge}>Strategic Core</span>
          <span className={styles.tagBadge}>Vision Statement</span>
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>VIT-TEC VISION</h3>

        {/* Subtitle / Preview (Visible in default state, fades gracefully into statement) */}
        <p className={styles.cardSubtitle}>
          Future Horizon &amp; Global Competence
        </p>

        {/* Revealed Full Vision Statement */}
        <div className={styles.statementWrapper}>
          <p className={styles.visionStatement}>
            Impart skills to enhance performance, productivity and global competence across industries.
          </p>
        </div>

        {/* Interactive Cue */}
        <div className={styles.interactiveCue}>
          <span className={styles.cueIcon}>✨</span>
          <span className={styles.cueText}>
            {isRevealed ? 'Revealed' : 'Hover or tap to reveal'}
          </span>
        </div>
      </div>

      {/* Interactive Decorative Graphic (Positioned safely behind/right with lower z-index) */}
      <div className={styles.graphicContainer} aria-hidden="true">
        <svg viewBox="0 0 140 140" className={styles.visionSvg}>
          {/* Concentric Guide Orbits */}
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="70" cy="70" r="38" fill="none" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1" />
          <circle cx="70" cy="70" r="22" fill="none" stroke="rgba(29, 78, 216, 0.45)" strokeWidth="1.5" />

          {/* Radiant Network Rays */}
          <line x1="70" y1="70" x2="30" y2="30" className={styles.networkRay} strokeWidth="1.5" />
          <line x1="70" y1="70" x2="110" y2="30" className={styles.networkRay} strokeWidth="1.5" />
          <line x1="70" y1="70" x2="118" y2="85" className={styles.networkRay} strokeWidth="1.5" />
          <line x1="70" y1="70" x2="32" y2="95" className={styles.networkRay} strokeWidth="1.5" />

          {/* Connected Nodes */}
          <g className={styles.orbitNode}>
            <circle cx="30" cy="30" r="4" fill="#38BDF8" filter="drop-shadow(0 0 4px #38BDF8)" />
            <circle cx="110" cy="30" r="4" fill="#38BDF8" filter="drop-shadow(0 0 4px #38BDF8)" />
            <circle cx="118" cy="85" r="3.5" fill="#60A5FA" />
            <circle cx="32" cy="95" r="3.5" fill="#60A5FA" />
          </g>

          {/* Central Glowing Pulse Core */}
          <circle cx="70" cy="70" r="14" fill="rgba(29, 78, 216, 0.35)" className={styles.pulseCoreRing} />
          <circle cx="70" cy="70" r="8" fill="#38BDF8" filter="drop-shadow(0 0 8px #38BDF8)" />
          <circle cx="70" cy="70" r="3.5" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}

export function MissionCard() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      className={`${styles.cardContainer} ${isRevealed ? styles.cardRevealed : ''}`}
      onClick={() => setIsRevealed(!isRevealed)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsRevealed(!isRevealed);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Mission Card - Hover or tap to reveal the institutional mission statements"
    >
      {/* Glow background accent */}
      <div className={styles.cardGlow} />

      {/* Main Content Area (Guaranteed Readable Width & Text Priority) */}
      <div className={styles.contentArea}>
        {/* Header Badges */}
        <div className={styles.headerRow}>
          <span className={styles.categoryBadge}>Execution Track</span>
          <span className={styles.tagBadge}>Mission Pathway</span>
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>VIT-TEC MISSION</h3>

        {/* Subtitle / Preview */}
        <p className={styles.cardSubtitle}>
          Collaboration &amp; Regional Co-Creation
        </p>

        {/* Revealed Full Mission Statements */}
        <div className={styles.statementWrapper}>
          <ul className={styles.missionList}>
            <li>
              Thriving collaboration with national &amp; international industries and institutions.
            </li>
            <li>
              Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.
            </li>
          </ul>
        </div>

        {/* Interactive Cue */}
        <div className={styles.interactiveCue}>
          <span className={styles.cueIcon}>✨</span>
          <span className={styles.cueText}>
            {isRevealed ? 'Revealed' : 'Hover or tap to reveal'}
          </span>
        </div>
      </div>

      {/* Interactive Decorative Graphic (Positioned safely behind/right with lower z-index) */}
      <div className={styles.graphicContainer} aria-hidden="true">
        <svg viewBox="0 0 140 140" className={styles.missionSvg}>
          {/* Stepped Pathway Axis */}
          <path
            d="M 18 105 Q 45 95 65 65 T 115 25"
            fill="none"
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="2"
            className={styles.pathwayGuide}
          />

          {/* Stepped Phase Indicator Arcs */}
          <path d="M 35 118 L 45 95" stroke="rgba(29, 78, 216, 0.45)" strokeWidth="1.5" />
          <path d="M 75 80 L 65 65" stroke="rgba(29, 78, 216, 0.45)" strokeWidth="1.5" />
          <path d="M 105 45 L 115 25" stroke="rgba(29, 78, 216, 0.45)" strokeWidth="1.5" />

          {/* Sequential Phase Nodes */}
          <circle cx="18" cy="105" r="4.5" fill="#1D4ED8" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="65" cy="65" r="5.5" fill="#1D4ED8" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="115" cy="25" r="7" fill="rgba(56, 189, 248, 0.3)" />
          <circle cx="115" cy="25" r="4.5" fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
          <circle cx="115" cy="25" r="2" fill="#FFFFFF" />

          {/* Moving Pathway Pulse Particle */}
          <circle cx="20" cy="100" r="3.5" className={styles.pathwayPulseDot} />
        </svg>
      </div>
    </div>
  );
}
