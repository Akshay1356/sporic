import { useState } from 'react';
import styles from './VisionMissionCard.module.css';

export function VisionCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.cardActive : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="region"
      aria-label="VIT-TEC Vision - Interactive Card"
    >
      {/* 1. Background Grid & Ambient Glow Layer */}
      <div className={styles.bgCanvas}>
        <div className={styles.ambientGlow} />
        <div className={styles.techGrid} />
      </div>

      {/* 2. Technical Directional Visualization Layer (SVG Animated Architecture) */}
      <div className={styles.svgLayer} aria-hidden="true">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" className={styles.visionSvg}>
          <defs>
            <linearGradient id="visGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>
            <filter id="visGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Strategic Trajectory Vector Path */}
          <path
            d="M 10 160 Q 120 180, 220 120 T 380 40"
            fill="none"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="1.5"
            className={styles.trajectoryBase}
          />
          <path
            d="M 10 160 Q 120 180, 220 120 T 380 40"
            fill="none"
            stroke="url(#visGrad)"
            strokeWidth="2.2"
            strokeDasharray="12 8"
            className={styles.trajectoryStream}
          />

          {/* Concentric Horizon Radar / Orbit Guides */}
          <circle cx="340" cy="50" r="45" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="3 3" className={styles.radarOrbitOuter} />
          <circle cx="340" cy="50" r="28" fill="none" stroke="rgba(56, 189, 248, 0.22)" className={styles.radarOrbitInner} />
          <circle cx="340" cy="50" r="14" fill="rgba(29, 78, 216, 0.25)" className={styles.radarCoreGlow} />
          <circle cx="340" cy="50" r="5" fill="#38BDF8" filter="url(#visGlow)" />

          {/* Strategic Nodes along path */}
          <circle cx="90" cy="168" r="3.5" fill="#38BDF8" className={styles.nodePulse1} />
          <circle cx="210" cy="125" r="4.5" fill="#60A5FA" className={styles.nodePulse2} />
          <circle cx="295" cy="72" r="4" fill="#38BDF8" className={styles.nodePulse3} />

          {/* Directional Signal Runner that shoots across on hover */}
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#visGlow)" className={styles.signalRunnerVision} />
        </svg>
      </div>

      {/* 3. Foreground Interactive Content Layer */}
      <div className={styles.contentLayer}>
        {/* Top Header Row with dynamic status */}
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.categoryBadge}>Strategic Core</span>
            <span className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              {isHovered ? 'DIRECTION ACTIVE' : 'SYSTEM IDLE'}
            </span>
          </div>
          <span className={styles.codeTag}>SEC-01 // VISION</span>
        </div>

        {/* Title */}
        <h3 className={styles.title}>VIT-TEC VISION</h3>

        {/* Content Body: Idle Preview vs Revealed Statement */}
        <div className={styles.bodyBlock}>
          <div className={styles.idleState}>
            <p className={styles.idleSubtitle}>
              Future Horizon &amp; Global Competence
            </p>
            <div className={styles.interactionHint}>
              <span className={styles.hintBeam} />
              <span className={styles.hintText}>Hover to activate strategic direction →</span>
            </div>
          </div>

          <div className={styles.revealedState}>
            <p className={styles.fullStatement}>
              Impart skills to enhance performance, productivity and global competence across industries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MissionCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.cardActive : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="region"
      aria-label="VIT-TEC Mission - Interactive Card"
    >
      {/* 1. Background Grid & Ambient Glow Layer */}
      <div className={styles.bgCanvas}>
        <div className={styles.ambientGlow} />
        <div className={styles.techGrid} />
      </div>

      {/* 2. Technical Execution Pathway Visualization Layer */}
      <div className={styles.svgLayer} aria-hidden="true">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" className={styles.missionSvg}>
          <defs>
            <linearGradient id="misGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
            </linearGradient>
            <filter id="misGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stepped Multi-Stage Execution Pathway */}
          <path
            d="M 15 150 L 110 150 L 160 90 L 260 90 L 310 40 L 385 40"
            fill="none"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="1.5"
            className={styles.trajectoryBase}
          />
          <path
            d="M 15 150 L 110 150 L 160 90 L 260 90 L 310 40 L 385 40"
            fill="none"
            stroke="url(#misGrad)"
            strokeWidth="2.2"
            strokeDasharray="14 10"
            className={styles.trajectoryStreamMission}
          />

          {/* Milestone Step Nodes */}
          <g className={styles.milestoneNodes}>
            <circle cx="110" cy="150" r="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="160" cy="90" r="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="260" cy="90" r="4.5" fill="#1D4ED8" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="310" cy="40" r="5" fill="#1D4ED8" stroke="#38BDF8" strokeWidth="2" />
            {/* Impact Target Core */}
            <circle cx="385" cy="40" r="12" fill="rgba(2, 132, 199, 0.25)" />
            <circle cx="385" cy="40" r="5" fill="#38BDF8" filter="url(#misGlow)" />
            <circle cx="385" cy="40" r="2" fill="#FFFFFF" />
          </g>

          {/* Traveling Pulse Particle */}
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#misGlow)" className={styles.signalRunnerMission} />
        </svg>
      </div>

      {/* 3. Foreground Interactive Content Layer */}
      <div className={styles.contentLayer}>
        {/* Top Header Row */}
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.categoryBadge}>Execution Track</span>
            <span className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              {isHovered ? 'PATHWAY ACTIVE' : 'SYSTEM IDLE'}
            </span>
          </div>
          <span className={styles.codeTag}>SEC-02 // MISSION</span>
        </div>

        {/* Title */}
        <h3 className={styles.title}>VIT-TEC MISSION</h3>

        {/* Content Body: Idle Preview vs Revealed Statement */}
        <div className={styles.bodyBlock}>
          <div className={styles.idleState}>
            <p className={styles.idleSubtitle}>
              Collaboration &amp; Regional Co-Creation
            </p>
            <div className={styles.interactionHint}>
              <span className={styles.hintBeam} />
              <span className={styles.hintText}>Hover to activate execution pathway →</span>
            </div>
          </div>

          <div className={styles.revealedState}>
            <ul className={styles.missionList}>
              <li>
                Thriving collaboration with national &amp; international industries and institutions.
              </li>
              <li>
                Rewarding Co-creations through upskilling &amp; reskilling SME / MSME sectors in the region.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
