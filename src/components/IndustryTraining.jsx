import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import styles from './IndustryTraining.module.css';

const orbitNodes = [
  {
    id: 'needs',
    label: 'Industry Needs',
    tooltip: 'Real-world project & corporate specifications',
    posClass: styles.posTop,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '50%', y2: '8%' },
  },
  {
    id: 'gaps',
    label: 'Skill Gap Analysis',
    tooltip: 'Targeted workforce competency mapping',
    posClass: styles.posTopLeft,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '18%', y2: '28%' },
  },
  {
    id: 'custom',
    label: 'Customized Training',
    tooltip: 'Tailored curricula & shift-friendly delivery',
    posClass: styles.posBottomLeft,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '18%', y2: '72%' },
  },
  {
    id: 'tech',
    label: 'Technology & Labs',
    tooltip: 'Hands-on tools, simulations & industrial labs',
    posClass: styles.posTopRight,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '82%', y2: '28%' },
  },
  {
    id: 'faculty',
    label: 'Expert Faculty',
    tooltip: 'Senior researchers & industry practitioners',
    posClass: styles.posBottomRight,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '82%', y2: '72%' },
  },
  {
    id: 'impact',
    label: 'Business Impact & ROI',
    tooltip: 'Measurable workforce productivity & scaling',
    posClass: styles.posBottom,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '50%', x2: '50%', y2: '92%' },
  },
];

export default function IndustryTraining() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [activeNode, setActiveNode] = useState(null);

  return (
    <section className={styles.industrySection} ref={containerRef}>
      {/* Background Subtle Tech Dots */}
      <div className={styles.bgTechPattern} />

      <div className="container">
        <div className={styles.grid}>
          {/* ====================================================
              LEFT: INTERACTIVE VIT-TEC TRAINING ECOSYSTEM
             ==================================================== */}
          <motion.div
            className={styles.visualCol}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.ecosystemStage}>
              {/* SVG Connectors and Orbit Guide */}
              <svg className={styles.orbitSvg} aria-hidden="true">
                <circle cx="50%" cy="50%" r="38%" className={styles.orbitRing} />
                <circle cx="50%" cy="50%" r="22%" className={styles.orbitRing} />

                {orbitNodes.map((node) => {
                  const isActive = activeNode === node.id;
                  const { x1, y1, x2, y2 } = node.lineCoords;
                  return (
                    <g key={node.id}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className={`${styles.connectorLine} ${isActive ? styles.connectorLineActive : ''}`}
                      />
                      {isActive && (
                        <circle cx={x2} cy={y2} r="4" className={styles.pulseDot} />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* CENTRAL VIT-TEC HUB */}
              <motion.div
                className={`${styles.centralHub} ${activeNode ? styles.centralHubHighlighted : ''}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onMouseEnter={() => setActiveNode('hub')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <img
                  src="/vit_logo.png"
                  alt="VIT Emblem"
                  className={styles.hubLogoImg}
                />
                <h3 className={styles.hubTitle}>VIT-TEC</h3>
                <span className={styles.hubSubtitle}>Training Hub</span>
                <span className={styles.hubBadge}>SpoRIC Certified</span>
              </motion.div>

              {/* SURROUNDING CONNECTED NODES */}
              {orbitNodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className={`${styles.nodeItem} ${node.posClass} ${activeNode === node.id ? styles.nodeItemActive : ''}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div className={styles.nodePill}>
                    <span className={styles.nodeIcon}>{node.icon}</span>
                    <span className={styles.nodeText}>{node.label}</span>
                  </div>
                  {activeNode === node.id && (
                    <div className={styles.nodeTooltip}>{node.tooltip}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ====================================================
              RIGHT: ENTERPRISE INFO & FEATURE PANELS
             ==================================================== */}
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <span className={styles.eyebrow}>Enterprise Solutions</span>
            <h2 className={styles.title}>Training Solutions for a Changing World</h2>
            <p className={styles.description}>
              VIT-TEC collaborates closely with corporate houses, SMEs, and MSMEs to bridge skill gaps. We design customized programs mapped directly to project specifications and emerging technology paradigms.
            </p>

            {/* Feature Panels with Cross-Interaction with Left Ecosystem */}
            <div className={styles.featureCards}>
              <div
                className={`${styles.featureCard} ${activeNode === 'custom' ? styles.featureCardHighlighted : ''}`}
                onMouseEnter={() => setActiveNode('custom')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className={styles.cardIconBox}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardHeading}>Tailored Curriculum</h4>
                  <p className={styles.cardText}>
                    We work with your technical leaders to build training models solving immediate pipeline constraints.
                  </p>
                </div>
              </div>

              <div
                className={`${styles.featureCard} ${activeNode === 'tech' ? styles.featureCardHighlighted : ''}`}
                onMouseEnter={() => setActiveNode('tech')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className={styles.cardIconBox}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardHeading}>Flexible Deliverables</h4>
                  <p className={styles.cardText}>
                    Blended, offline intensive bootcamps, or structured online sessions matching employee shifts.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={styles.actionRow}>
              <Link to="/contact" className={styles.partnerBtn}>
                <span>Partner with Us</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4.167 10h11.666M10.833 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
