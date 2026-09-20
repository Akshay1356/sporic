import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllGalleryItems, GALLERY_CATEGORIES, matchesCategory, galleryPhotos, galleryCategories } from '../data/galleryData';
import api from '../services/api';
import galleryService from '../services/galleryService';
import GalleryCard from '../components/GalleryCard';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [photos, setPhotos] = useState(getAllGalleryItems() || galleryPhotos || []);

  const loadPhotos = useCallback(async () => {
    try {
      const localPhotos = getAllGalleryItems();
      if (localPhotos && localPhotos.length > 0) {
        setPhotos(localPhotos);
      }

      // Try api.getGallery first (supports categories & cloud sync)
      const res = await api.getGallery(activeCategory);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setPhotos(res.data);
        return;
      }

      // Fallback to galleryService
      const servicePhotos = await galleryService.getGalleryPhotos();
      if (Array.isArray(servicePhotos) && servicePhotos.length > 0) {
        setPhotos(servicePhotos);
      }
    } catch {
      setPhotos(getAllGalleryItems() || galleryPhotos);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadPhotos();

    // Listen for storage events across tabs or local saves
    const handleStorage = () => loadPhotos();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadPhotos]);

  // Filtered photos list with flexible category matching
  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => matchesCategory(p.category, activeCategory));

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
          <div>
            <span className={styles.eyebrow}>CORPORATE TRAINING & INDUSTRY ENGAGEMENT</span>
            <h1 className={styles.title}>Industry Connections in Action</h1>
            <p className={styles.subtitle}>
              Explore moments from our corporate training programmes, industry collaborations and professional learning initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Content */}
      <section className={styles.gallerySection}>
        <div className="container">
          {/* Category Filter Tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Gallery category filters">
            {GALLERY_CATEGORIES.map((category) => (
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
          <div className={styles.photosGrid}>
            {filteredPhotos.map((photo, index) => (
              <GalleryCard
                key={photo.id || index}
                item={photo}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
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
                key={filteredPhotos[lightboxIndex].id || lightboxIndex}
                className={styles.lightboxImgWrap}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <img
                  src={filteredPhotos[lightboxIndex].src || filteredPhotos[lightboxIndex].imageUrl}
                  alt={filteredPhotos[lightboxIndex].companyName || filteredPhotos[lightboxIndex].title || 'Gallery item'}
                  className={styles.lightboxImg}
                />
                
                {/* Caption Bar */}
                <div className={styles.captionBar}>
                  <h4 className={styles.captionTitle}>
                    {filteredPhotos[lightboxIndex].companyName || filteredPhotos[lightboxIndex].title || 'Industry Engagement'}
                  </h4>
                  {filteredPhotos[lightboxIndex].description && (
                    <p className={styles.captionDesc}>
                      {filteredPhotos[lightboxIndex].description}
                    </p>
                  )}
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
