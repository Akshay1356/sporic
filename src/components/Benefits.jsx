import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Benefits.module.css';

const benefitsData = [
  {
    id: 'curriculum',
    number: '01',
    title: 'Industry Relevant Curriculum',
    description: 'Programs aligned with evolving industry requirements.',
    posClass: styles.posTopLeft,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    // SVG line coordinate percentages for desktop connector
    lineCoords: { x1: '50%', y1: '40%', x2: '28%', y2: '18%' },
  },
  {
    id: 'faculty',
    number: '02',
    title: 'Expert Faculty',
    description: 'Learn from experienced faculty and industry professionals.',
    posClass: styles.posMidLeft,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    lineCoords: { x1: '37%', y1: '50%', x2: '28%', y2: '50%' },
  },
  {
    id: 'research',
    number: '03',
    title: 'Research & Innovation',
    description: 'Connect learning with research, innovation and emerging technologies.',
    posClass: styles.posTopRight,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '40%', x2: '72%', y2: '18%' },
  },
  {
    id: 'placement',
    number: '04',
    title: 'Placement Support',
    description: 'Develop career-ready skills for professional growth.',
    posClass: styles.posMidRight,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    lineCoords: { x1: '63%', y1: '50%', x2: '72%', y2: '50%' },
  },
  {
    id: 'hands-on',
    number: '05',
    title: 'Hands-on Learning',
    description: 'Build practical skills through real-world applications.',
    posClass: styles.posBottomCenter,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    lineCoords: { x1: '50%', y1: '65%', x2: '50%', y2: '82%' },
  },
];

export default function Benefits() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className={styles.benefitsSection} id="why-vittec" ref={containerRef}>
      {/* Background Subtle Tech Pattern */}
      <div className={styles.bgGridPattern} />

      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Institutional Advantages</span>
          <h2 className={styles.title}>Why VIT-TEC?</h2>
          <p className={styles.subtitle}>
            Strategic engineering and skill development empowering future-ready professionals
          </p>
        </motion.div>

        {/* VIT-TEC Ecosystem Interactive Layout */}
        <div className={styles.ecosystemWrapper}>
          {/* Desktop SVG Dynamic Connector Lines */}
          <svg className={styles.connectorSvg} aria-hidden="true">
            {benefitsData.map((item) => {
              const isActive = hoveredCard === item.id;
              const { x1, y1, x2, y2 } = item.lineCoords;
              return (
                <g key={item.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={`${styles.connectorLine} ${isActive ? styles.connectorLineActive : ''}`}
                  />
                  {isActive && (
                    <circle
                      cx={x2}
                      cy={y2}
                      r="4"
                      className={styles.pulseDot}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Grid of Central Core + 5 Benefit Cards */}
          <div className={styles.ecosystemGrid}>
            {/* CENTRAL VIT-TEC CORE HUB */}
            <motion.div
              className={`${styles.centralCore} ${hoveredCard ? styles.centralCoreHighlighted : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <div className={styles.corePulseRing} />
              
              <div className={styles.coreLogoWrap}>
                <img
                  src="/vit_logo.png"
                  alt="VIT Emblem"
                  className={styles.coreLogoImg}
                />
              </div>

              <span className={styles.coreBadge}>Innovation &amp; Skill Hub</span>
              <h3 className={styles.coreTitle}>VIT-TEC</h3>
              <p className={styles.coreSubtitle}>Technology Enhancement Centre</p>

              <div className={styles.coreMeta}>
                Sponsored Research &amp; Industrial Consultancy
              </div>
            </motion.div>

            {/* FIVE SURROUNDING BENEFIT CARDS */}
            {benefitsData.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`${styles.benefitCard} ${item.posClass} ${hoveredCard === item.id ? styles.benefitCardActive : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.25 + idx * 0.08, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={styles.cardIconWrap}>
                  {item.icon}
                </div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
