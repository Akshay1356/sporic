import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import styles from './IndustryTraining.module.css';

export default function IndustryTraining() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [activeStage, setActiveStage] = useState(null);

  return (
    <section className={styles.industrySection} ref={containerRef}>
      {/* Background Subtle Tech Dots */}
      <div className={styles.bgTechPattern} />

      <div className="container">
        <div className={styles.grid}>
          {/* ====================================================
              LEFT: "FROM SKILL GAP TO BUSINESS IMPACT" PIPELINE
             ==================================================== */}
          <motion.div
            className={styles.visualCol}
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.pipelineStage}>
              {/* Animated Connecting Conduit Background */}
              <svg className={styles.conduitSvg} aria-hidden="true">
                <defs>
                  <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                {/* Central Flowing Spine */}
                <line x1="50%" y1="10%" x2="50%" y2="90%" className={styles.conduitTrack} />
                <line x1="50%" y1="10%" x2="50%" y2="90%" className={styles.conduitFlowActive} />
              </svg>

              {/* STAGE 1: INPUT NODES (Industry Needs & Skill Gap Analysis) */}
              <div className={styles.nodeRowTwo}>
                <div
                  className={`${styles.pipelineNode} ${activeStage === 'needs' ? styles.pipelineNodeActive : ''}`}
                  onMouseEnter={() => setActiveStage('needs')}
                  onMouseLeave={() => setActiveStage(null)}
                  onClick={() => setActiveStage(activeStage === 'needs' ? null : 'needs')}
                >
                  <div className={styles.nodeIconBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className={styles.nodeContent}>
                    <span className={styles.nodeStepBadge}>Step 01</span>
                    <h4 className={styles.nodeLabel}>Industry Needs</h4>
                    <span className={styles.nodeDesc}>Understand evolving corporate project requirements.</span>
                  </div>
                </div>

                <div
                  className={`${styles.pipelineNode} ${activeStage === 'gaps' ? styles.pipelineNodeActive : ''}`}
                  onMouseEnter={() => setActiveStage('gaps')}
                  onMouseLeave={() => setActiveStage(null)}
                  onClick={() => setActiveStage(activeStage === 'gaps' ? null : 'gaps')}
                >
                  <div className={styles.nodeIconBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className={styles.nodeContent}>
                    <span className={styles.nodeStepBadge}>Step 02</span>
                    <h4 className={styles.nodeLabel}>Skill Gap Analysis</h4>
                    <span className={styles.nodeDesc}>Identify precise technical &amp; behavioral workforce gaps.</span>
                  </div>
                </div>
              </div>

              {/* STAGE 2: CENTRAL VIT-TEC TRAINING ENGINE */}
              <div
                className={`${styles.engineCard} ${activeStage === 'engine' ? styles.engineCardActive : ''}`}
                onMouseEnter={() => setActiveStage('engine')}
                onMouseLeave={() => setActiveStage(null)}
                onClick={() => setActiveStage(activeStage === 'engine' ? null : 'engine')}
              >
                <div className={styles.engineCoreLeft}>
                  <div className={styles.engineEmblemWrap}>
                    <img src="/vit_logo.png" alt="VIT Emblem" className={styles.engineLogoImg} />
                  </div>
                  <div className={styles.engineTitles}>
                    <span className={styles.engineTag}>Transformation Core</span>
                    <h3 className={styles.engineMainTitle}>VIT-TEC Training Engine</h3>
                    <span className={styles.engineSubtitle}>Curriculum Design &amp; SpoRIC Governance</span>
                  </div>
                </div>

                <div className={styles.engineGraphicRight}>
                  <svg viewBox="0 0 60 60" className={styles.engineRingSvg}>
                    <circle cx="30" cy="30" r="24" fill="none" className={styles.ringOuter} />
                    <circle cx="30" cy="30" r="16" fill="none" className={styles.ringInner} />
                    <circle cx="30" cy="30" r="6" fill="#1D4ED8" filter="drop-shadow(0 0 4px #38BDF8)" />
                    <circle cx="30" cy="30" r="2.5" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>

              {/* STAGE 3: EXECUTION NODES (Customized Training & Expert Faculty) */}
              <div className={styles.nodeRowTwo}>
                <div
                  className={`${styles.pipelineNode} ${activeStage === 'custom' ? styles.pipelineNodeActive : ''}`}
                  onMouseEnter={() => setActiveStage('custom')}
                  onMouseLeave={() => setActiveStage(null)}
                  onClick={() => setActiveStage(activeStage === 'custom' ? null : 'custom')}
                >
                  <div className={styles.nodeIconBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <div className={styles.nodeContent}>
                    <span className={styles.nodeStepBadge}>Step 03</span>
                    <h4 className={styles.nodeLabel}>Customized Training</h4>
                    <span className={styles.nodeDesc}>Build tailored curricula matching shift schedules.</span>
                  </div>
                </div>

                <div
                  className={`${styles.pipelineNode} ${activeStage === 'faculty' ? styles.pipelineNodeActive : ''}`}
                  onMouseEnter={() => setActiveStage('faculty')}
                  onMouseLeave={() => setActiveStage(null)}
                  onClick={() => setActiveStage(activeStage === 'faculty' ? null : 'faculty')}
                >
                  <div className={styles.nodeIconBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className={styles.nodeContent}>
                    <span className={styles.nodeStepBadge}>Step 04</span>
                    <h4 className={styles.nodeLabel}>Expert Faculty</h4>
                    <span className={styles.nodeDesc}>Hands-on coaching by certified industry researchers.</span>
                  </div>
                </div>
              </div>

              {/* STAGE 4: CULMINATION (Business Impact & ROI) */}
              <div
                className={`${styles.impactHighlightNode} ${activeStage === 'impact' ? styles.impactHighlightNodeActive : ''}`}
                onMouseEnter={() => setActiveStage('impact')}
                onMouseLeave={() => setActiveStage(null)}
                onClick={() => setActiveStage(activeStage === 'impact' ? null : 'impact')}
              >
                <div className={styles.impactLeft}>
                  <div className={styles.impactIconBox}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={styles.impactTitle}>Business Impact &amp; Measurable ROI</h4>
                    <p className={styles.impactDesc}>Translate workforce training into accelerated project velocity &amp; innovation.</p>
                  </div>
                </div>
                <span className={styles.impactBadge}>Outcome Guaranteed</span>
              </div>
            </div>
          </motion.div>

          {/* ====================================================
              RIGHT: ENTERPRISE INFO & FEATURE PANELS (EXACT CONTENT)
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

            {/* Feature Panels with Cross-Interaction with Left Pipeline */}
            <div className={styles.featureCards}>
              <div
                className={`${styles.featureCard} ${activeStage === 'custom' ? styles.featureCardHighlighted : ''}`}
                onMouseEnter={() => setActiveStage('custom')}
                onMouseLeave={() => setActiveStage(null)}
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
                className={`${styles.featureCard} ${activeStage === 'gaps' || activeStage === 'engine' ? styles.featureCardHighlighted : ''}`}
                onMouseEnter={() => setActiveStage('gaps')}
                onMouseLeave={() => setActiveStage(null)}
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
