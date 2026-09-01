import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import styles from './Domains.module.css';

const domainsData = [
  {
    id: 'technology',
    title: 'Technology',
    path: '/technology',
    description:
      'Cutting-edge technical competencies across Industry 4.0, Electric Vehicles, AI & Machine Learning, Cloud Architecture, Cyber Security, and Advanced Manufacturing.',
    highlights: ['Industry 4.0', 'EV Tech', 'AI & ML', 'Cyber Security', 'Cloud & IoT'],
    badge: '60+ Courses',
    ctaText: 'See more...',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
  {
    id: 'management',
    title: 'Management',
    path: '/management',
    description:
      'Executive management, agile operations, digital supply chain, corporate finance, and data-driven business strategy designed for enterprise leaders.',
    highlights: ['Operations', 'Finance', 'Marketing', 'Data Analytics', 'Agile Strategy'],
    badge: '20+ Courses',
    ctaText: 'See more...',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="12" cy="2" r="2" />
        <circle cx="6" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: 'leadership',
    title: 'Leadership & Personality',
    path: '/personality',
    description:
      'Strategic leadership, cross-functional communication, organizational resilience, change management, and executive presence for high-impact teams.',
    highlights: ['Executive Presence', 'Resilience', 'Communication', 'Team Dynamics'],
    badge: '15+ Courses',
    ctaText: 'See more...',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" opacity="0.3" />
      </svg>
    ),
  },
];

export default function Domains() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  return (
    <section className={styles.domainsSection} id="learning-domains" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="section-label">Learning Domains</span>
          <h2 className={styles.title}>Corporate Training Categories</h2>
          <p className={styles.subtitle}>
            Industry-curated programs structured across three foundational pillars of organizational and technical excellence.
          </p>
        </div>

        {/* 3 Equal Morphism Category Cards */}
        <div className={styles.cardsGrid}>
          {domainsData.map((domain, idx) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={styles.cardWrapper}
            >
              <Link
                to={domain.path}
                className={styles.domainCard}
                aria-label={`Explore ${domain.title} programs`}
              >
                {/* Top Glow Accent */}
                <div className={styles.cardGlow} />

                {/* Card Header: Icon & Badge */}
                <div className={styles.cardHeader}>
                  <div className={styles.iconBox}>{domain.icon}</div>
                  <span className={styles.badge}>{domain.badge}</span>
                </div>

                {/* Card Title & Description */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{domain.title}</h3>
                  <p className={styles.cardDescription}>{domain.description}</p>
                </div>

                {/* Highlights Tags */}
                <div className={styles.tagsWrap}>
                  {domain.highlights.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Footer: See more CTA linking to separate dedicated page */}
                <div className={styles.cardFooter}>
                  <span className={styles.seeMoreLink}>
                    {domain.ctaText}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.arrowIcon}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
