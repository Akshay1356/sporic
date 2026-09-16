import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Hero.module.css';
import { getActiveBanners } from '../data/bannersData';

export default function Hero() {
  const [slides, setSlides] = useState(() => getActiveBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Load active banners dynamically and refresh on cross-tab storage changes
  useEffect(() => {
    const refreshBanners = () => {
      const active = getActiveBanners();
      setSlides(active);
      setCurrentIndex((prev) => {
        if (active.length === 0) return 0;
        if (prev >= active.length) return active.length - 1;
        return prev;
      });
    };
    refreshBanners();
    window.addEventListener('storage', refreshBanners);
    return () => window.removeEventListener('storage', refreshBanners);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (slides.length === 0 ? prev : (prev + 1) % slides.length));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (slides.length === 0 ? prev : (prev - 1 + slides.length) % slides.length));
  }, [slides.length]);

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  //Comment Manas
  // Touch gesture handling for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Graceful empty state: hide the carousel if no active banners exist
  if (slides.length === 0) return null;

  return (
    <section
      className={styles.heroSection}
      aria-label="VIT-TEC Featured Slideshow"
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slideshowWrapper}>
        <div className={styles.slidesContainer}>
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                aria-hidden={!isActive}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={styles.slideImage}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </div>
            );
          })}
        </div>

        <button type="button" className={`${styles.arrowButton} ${styles.arrowPrev}`} onClick={handlePrev} aria-label="Previous slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button type="button" className={`${styles.arrowButton} ${styles.arrowNext}`} onClick={handleNext} aria-label="Next slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Elegant Indicator Dots */}
        <div className={styles.indicators} role="tablist" aria-label="Slideshow Controls">
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                className={`${styles.indicatorDot} ${isActive ? styles.indicatorDotActive : ''}`}
                onClick={() => handleDotClick(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
