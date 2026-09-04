import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Hero.module.css';

const slides = [
  {
    id: 'slide-1',
    src: '/hero-slides/slide1-corporate-training.png',
    alt: 'VIT-TEC Corporate Training — Transform Your Career With World-Class Industry Training',
  },
  {
    id: 'slide-2',
    src: '/hero-slides/slide2-rankings-recognitions.png',
    alt: 'VIT-TEC Rankings and Recognitions — National & International Accreditations',
  },
  {
    id: 'slide-3',
    src: '/hero-slides/slide3-industry-partners.png',
    alt: 'VIT-TEC Industry Partners — Collaborating for a Skilled and Future-Ready Workforce',
  },
  {
    id: 'slide-4',
    src: '/hero-slides/slide4-our-courses.png',
    alt: 'VIT-TEC Our Courses — Technology, Management, Personality, and Leadership',
  },
  {
    id: 'slide-5',
    src: '/hero-slides/slide5-industry-collaborations.png',
    alt: 'VIT-TEC Industry Collaborations — Building Talent for a Smarter Tomorrow',
  },
];

const SLIDE_INTERVAL = 5500; // 5.5 seconds display time per slide

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, SLIDE_INTERVAL);
    }
  }, [isPaused]);

  // Handle auto-advance
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    resetTimer();
  }, [resetTimer]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  }, [resetTimer]);

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
    resetTimer();
  }, [resetTimer]);

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

  return (
    <section
      className={styles.heroSection}
      aria-label="VIT-TEC Featured Slideshow"
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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

        {/* Previous Arrow Button */}
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowPrev}`}
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next Arrow Button */}
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowNext}`}
          onClick={handleNext}
          aria-label="Next slide"
        >
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