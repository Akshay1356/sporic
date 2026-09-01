import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CoursePoster.module.css';

// Curated high-res background photography matched to course categories
const categoryBackgrounds = {
  'Industry 4.0': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
  'Electric Vehicles': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop',
  'Design': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
  'Optics': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop',
  'Manufacturing': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
  'Renewable Energy': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
  'Construction Technology': 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop',
  'ADAS': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
  'Quantum Computing': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
  'Simulation': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  'Operations Management': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
  'Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
  'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'Leadership & Personality': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
};

const defaultBg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';

export default function CoursePoster({ course, className = '' }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Background image based on category
  const bgImage = categoryBackgrounds[course?.category] || defaultBg;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  if (!course) return null;

  return (
    <>
      {/* Clickable Poster Card */}
      <div
        className={`${styles.posterContainer} ${className}`}
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View official training poster for ${course.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
      >
        {/* Poster Visual Frame */}
        <div className={styles.posterCard}>
          {/* Background Layer with Dark Gradient Overlay */}
          <div
            className={styles.posterBg}
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className={styles.posterOverlay} />

          {/* Institutional Header */}
          <div className={styles.posterHeader}>
            <div className={styles.vitBrandRow}>
              <img
                src="/vit_logo.png"
                alt="VIT University"
                className={styles.vitLogo}
              />
              <div className={styles.brandTextWrap}>
                <span className={styles.vitTitle}>VIT CHENNAI</span>
                <span className={styles.sporicSub}>SpoRIC • VIT-TEC</span>
              </div>
            </div>
            <span className={styles.posterCourseCode}>{course.id}</span>
          </div>

          {/* Poster Center Headline */}
          <div className={styles.posterBody}>
            <div className={styles.domainPill}>
              {course.domain} • {course.category}
            </div>
            <h2 className={styles.posterTitle}>{course.title}</h2>
            <p className={styles.posterTagline}>{course.shortDescription}</p>

            {/* Key Outcomes / Highlights */}
            {course.learn && course.learn.length > 0 && (
              <div className={styles.outcomesList}>
                {course.learn.slice(0, 3).map((item, idx) => (
                  <div key={idx} className={styles.outcomeItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.outcomeText}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Poster Footer Metadata */}
          <div className={styles.posterFooter}>
            <div className={styles.footerMetaCol}>
              <span className={styles.metaLabel}>Duration</span>
              <span className={styles.metaVal}>{course.hours} Hours</span>
            </div>
            <div className={styles.footerMetaCol}>
              <span className={styles.metaLabel}>Mode</span>
              <span className={styles.metaVal} style={{ textTransform: 'capitalize' }}>
                {course.mode}
              </span>
            </div>
            <div className={styles.footerMetaCol}>
              <span className={styles.metaLabel}>Certification</span>
              <span className={styles.metaVal}>VIT Certified</span>
            </div>
          </div>

          {/* Hover Zoom Hint */}
          <div className={styles.zoomHintOverlay}>
            <div className={styles.zoomIconCircle}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <span className={styles.zoomHintText}>Click to View Full Poster</span>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal (Just like the Gallery) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Full size poster for ${course.title}`}
          >
            {/* Top Toolbar */}
            <div className={styles.lightboxToolbar} onClick={(e) => e.stopPropagation()}>
              <div className={styles.posterBadge}>
                {course.id} • Official Training Poster
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                ✕
              </button>
            </div>

            {/* Main Stage Poster Display */}
            <div
              className={styles.lightboxStage}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className={styles.modalPosterWrap}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* High Resolution Modal Poster */}
                <div className={styles.modalPoster}>
                  <div
                    className={styles.posterBg}
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />
                  <div className={styles.posterOverlay} />

                  {/* Header */}
                  <div className={styles.modalPosterHeader}>
                    <div className={styles.vitBrandRow}>
                      <img
                        src="/vit_logo.png"
                        alt="VIT University"
                        className={styles.modalVitLogo}
                      />
                      <div>
                        <div className={styles.modalVitTitle}>VELLORE INSTITUTE OF TECHNOLOGY</div>
                        <div className={styles.modalSporicSub}>
                          Sponsored Research and Industrial Consultancy (SpoRIC) • VIT-TEC
                        </div>
                      </div>
                    </div>
                    <div className={styles.modalCourseCodeBox}>
                      <span className={styles.modalCourseCode}>{course.id}</span>
                      <span className={styles.modalModeTag}>{course.mode.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className={styles.modalPosterBody}>
                    <span className={styles.modalDomainBadge}>
                      {course.domain} › {course.category}
                    </span>
                    <h1 className={styles.modalPosterTitle}>{course.title}</h1>
                    <p className={styles.modalTagline}>{course.shortDescription}</p>

                    {/* Learn Highlights Grid */}
                    {course.learn && course.learn.length > 0 && (
                      <div className={styles.modalOutcomesSection}>
                        <h4 className={styles.modalSectionTitle}>KEY LEARNING OUTCOMES</h4>
                        <div className={styles.modalOutcomesGrid}>
                          {course.learn.map((item, idx) => (
                            <div key={idx} className={styles.modalOutcomeCard}>
                              <span className={styles.checkIcon}>✓</span>
                              <span className={styles.modalOutcomeText}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modules Pills */}
                    {course.modules && course.modules.length > 0 && (
                      <div className={styles.modalModulesSection}>
                        <h4 className={styles.modalSectionTitle}>CURRICULUM MODULES</h4>
                        <div className={styles.modalModulesWrap}>
                          {course.modules.map((mod, idx) => (
                            <span key={idx} className={styles.modalModulePill}>
                              Module {idx + 1}: {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Details */}
                  <div className={styles.modalPosterFooter}>
                    <div className={styles.modalFooterItem}>
                      <span className={styles.footerLabel}>TRAINING DURATION</span>
                      <span className={styles.footerHighlight}>{course.hours} Hours</span>
                    </div>
                    <div className={styles.modalFooterItem}>
                      <span className={styles.footerLabel}>COORDINATOR</span>
                      <span className={styles.footerHighlight}>{course.contactPerson}</span>
                      <span className={styles.footerSub}>{course.contactEmail}</span>
                    </div>
                    <div className={styles.modalFooterItem}>
                      <span className={styles.footerLabel}>CERTIFICATION</span>
                      <span className={styles.footerHighlight}>Certificate of Completion</span>
                      <span className={styles.footerSub}>SpoRIC, VIT Chennai</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
