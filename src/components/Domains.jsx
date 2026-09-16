import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import styles from './Domains.module.css';
import { searchCourses } from '../data/courses';

const domainsData = [
  {
    id: 'technology',
    title: 'Technology',
    path: '/technology',
    bgImage: '/gallery/technology-bg.jpg',
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
    bgImage: '/gallery/management-bg.jpg',
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
    bgImage: '/gallery/leadership-bg.jpg',
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
  const navigate = useNavigate();

  // —— Dynamic Course Search ——
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Live results from the real course catalog (case-insensitive, client-side)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchCourses({ query: q }).slice(0, 6);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeSearch = () => {
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    closeSearch();
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length === 0) return;
      setIsDropdownOpen(true);
      setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (searchResults.length === 0) return;
      const target = searchResults[activeIndex >= 0 ? activeIndex : 0];
      if (target) {
        navigate(`/courses/${target.id}`);
        closeSearch();
      }
    }
  };

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

        {/* Dynamic Course Search */}
        <div className={styles.searchSection} ref={searchRef}>
          <div className={styles.searchBar}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search courses by title, category, skill..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(-1);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search corporate training courses"
              aria-expanded={isDropdownOpen && searchQuery.trim() ? 'true' : 'false'}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {isDropdownOpen && searchQuery.trim() && (
            <div className={styles.searchResults}>
              {searchResults.length > 0 ? (
                <>
                  <div className={styles.resultsHeader}>Search results</div>
                  {searchResults.map((course, idx) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className={`${styles.resultItem} ${idx === activeIndex ? styles.resultItemActive : ''}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={closeSearch}
                    >
                      <span className={styles.resultTitle}>{course.title}</span>
                      <span className={styles.resultMeta}>
                        <span className={styles.resultDomain}>{course.domain}</span>
                        <span className={styles.resultCategory}>{course.category}</span>
                      </span>
                    </Link>
                  ))}
                </>
              ) : (
                <div className={styles.noResults}>No courses found for your search.</div>
              )}
            </div>
          )}
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
                style={{ '--bg-image': `url(${domain.bgImage})` }}
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
