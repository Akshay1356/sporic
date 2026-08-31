import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryPhotos, galleryCategories } from '../data/galleryData';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filtered photos list
  const filteredPhotos = activeCategory === 'All'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === activeCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  }, [filteredPhotos.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  }, [filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, showPrev, showNext]);

  return (
    <div className={styles.galleryPage}>
      {/* Hero Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-label">Corporate Training & Executive Development</span>
            <h1 className={styles.title}>GALLERY</h1>
            <p className={styles.subtitle}>
              Moments, events and activities at SPORIC
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery Content */}
      <section className={styles.gallerySection}>
        <div className="container">
          {/* Category Filter Tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Gallery category filters">
            {galleryCategories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                className={`${styles.tabBtn} ${activeCategory === category ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <motion.div 
            className={styles.photosGrid}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={styles.galleryCard}
                  onClick={() => openLightbox(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View photo: ${photo.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(index);
                    }
                  }}
                >
                  {/* Fixed Frame for Image Zoom Effect */}
                  <div className={styles.imageFrame}>
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className={styles.galleryImg}
                      loading="lazy"
                    />
                    
                    {/* Subtle Hover Overlay */}
                    <div className={styles.cardOverlay}>
                      <div className={styles.zoomIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                      <div className={styles.overlayBottom}>
                        <span className={styles.overlayCategory}>{photo.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Caption Info */}
                  <div className={styles.cardDetails}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.categoryBadge}>
                        {photo.category}
                      </span>
                    </div>
                    <h3 className={styles.photoTitle}>{photo.title}</h3>
                    <p className={styles.photoDesc}>{photo.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Photo Lightbox"
          >
            {/* Top Toolbar */}
            <div className={styles.lightboxToolbar} onClick={(e) => e.stopPropagation()}>
              <div className={styles.counterBadge}>
                {lightboxIndex + 1} / {filteredPhotos.length}
              </div>
              <button
                className={styles.closeBtn}
                onClick={closeLightbox}
                aria-label="Close Lightbox"
              >
                ✕
              </button>
            </div>

            {/* Main Stage Image */}
            <div
              className={styles.lightboxStage}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              {filteredPhotos.length > 1 && (
                <button
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={showPrev}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
              )}

              {/* High-res Image Wrapper */}
              <motion.div
                key={filteredPhotos[lightboxIndex].id}
                className={styles.lightboxImgWrap}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <img
                  src={filteredPhotos[lightboxIndex].src}
                  alt={filteredPhotos[lightboxIndex].title}
                  className={styles.lightboxImg}
                />
                
                {/* Caption Bar */}
                <div className={styles.captionBar}>
                  <div className={styles.captionMeta}>
                    <span className={styles.captionTag}>
                      {filteredPhotos[lightboxIndex].category}
                    </span>
                  </div>
                  <h4 className={styles.captionTitle}>
                    {filteredPhotos[lightboxIndex].title}
                  </h4>
                  <p className={styles.captionDesc}>
                    {filteredPhotos[lightboxIndex].description}
                  </p>
                </div>
              </motion.div>

              {/* Next Button */}
              {filteredPhotos.length > 1 && (
                <button
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  ›
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
