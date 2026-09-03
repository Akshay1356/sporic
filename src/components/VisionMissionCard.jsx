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
      aria-label="Vision Card - Press or hover to reveal the institutional vision statement"
    >
      {/* LAYER 1: UNDERLYING VISION STATEMENT (ALWAYS IN DOM) */}
      <div className={styles.textLayer}>
        <div className={styles.textHeader}>
          <span className={styles.textLabel}>VIT-TEC Vision</span>
          <span className={styles.textTag}>Strategic Direction</span>
        </div>
        <p className={styles.visionStatement}>
          Impart skills to enhance performance, productivity and global competence across industries.
        </p>
      </div>

      {/* LAYER 2: INTERACTIVE FRONT VISUAL LAYER (PHYSICALLY RETRACTS ON HOVER) */}
      <div className={styles.frontVisualLayer} aria-hidden="true">
        <div className={styles.revealHandle} />
        
        <div className={styles.frontIdentity}>
          <span className={styles.frontCategory}>Strategic Core</span>
          <h3 className={styles.frontTitle}>VISION</h3>
          <p className={styles.frontSubtitle}>Future Horizon &amp; Global Competence</p>
        </div>

        {/* Abstract Expanding Horizon Network Graphic */}
        <div className={styles.graphicContainer}>
          <svg viewBox="0 0 140 140" className={styles.visionSvg}>
            {/* Concentric Guide Orbits */}
            <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="70" cy="70" r="38" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <circle cx="70" cy="70" r="22" fill="none" stroke="rgba(29, 78, 216, 0.4)" strokeWidth="1.5" />

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
            <circle cx="70" cy="70" r="14" fill="rgba(29, 78, 216, 0.3)" className={styles.pulseCoreRing} />
            <circle cx="70" cy="70" r="8" fill="#38BDF8" filter="drop-shadow(0 0 8px #38BDF8)" />
            <circle cx="70" cy="70" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>
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
      aria-label="Mission Card - Press or hover to reveal the institutional mission statements"
    >
      {/* LAYER 1: UNDERLYING MISSION STATEMENTS (ALWAYS IN DOM) */}
      <div className={styles.textLayer}>
        <div className={styles.textHeader}>
          <span className={styles.textLabel}>VIT-TEC Mission</span>
          <span className={styles.textTag}>Execution Pathway</span>
        </div>
        <ul className={styles.missionList}>
          <li>Thriving collaboration with national &amp; international industries and institutions.</li>
          <li>Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.</li>
        </ul>
      </div>

      {/* LAYER 2: INTERACTIVE FRONT VISUAL LAYER (PHYSICALLY RETRACTS ON HOVER) */}
      <div className={styles.frontVisualLayer} aria-hidden="true">
        <div className={styles.revealHandle} />

        <div className={styles.frontIdentity}>
          <span className={styles.frontCategory}>Execution Track</span>
          <h3 className={styles.frontTitle}>MISSION</h3>
          <p className={styles.frontSubtitle}>Collaboration &amp; Regional Co-Creation</p>
        </div>

        {/* Abstract Directional Pathway & Trajectory Graphic */}
        <div className={styles.graphicContainer}>
          <svg viewBox="0 0 140 140" className={styles.missionSvg}>
            {/* Stepped Pathway Axis */}
            <path
              d="M 18 105 Q 45 95 65 65 T 115 25"
              fill="none"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2"
              className={styles.pathwayGuide}
            />

            {/* Stepped Phase Indicator Arcs */}
            <path d="M 35 118 L 45 95" stroke="rgba(29, 78, 216, 0.4)" strokeWidth="1.5" />
            <path d="M 75 80 L 65 65" stroke="rgba(29, 78, 216, 0.4)" strokeWidth="1.5" />
            <path d="M 105 45 L 115 25" stroke="rgba(29, 78, 216, 0.4)" strokeWidth="1.5" />

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
    </div>
  );
}
