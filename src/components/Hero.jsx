import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Hero.module.css';

const slides = [
  {
    id: 'slide-1',
    src: '/hero-slides/slide5-industry-training.png',
    alt: 'VIT-TEC Transform Your Career With World-Class Industry Training',
  },
  {
    id: 'slide-2',
    src: '/hero-slides/slide3-rankings-recognitions.png',
    alt: 'VIT-TEC Rankings and Recognitions — National & International Accreditations',
  },
  {
    id: 'slide-3',
    src: '/hero-slides/slide4-industry-partners.png',
    alt: 'VIT-TEC Our Industry Partners — Collaborating for a Skilled and Future-Ready Workforce',
  },
  {
    id: 'slide-4',
    src: '/hero-slides/slide2-our-courses.png',
    alt: 'VIT-TEC Our Courses — Industry-Relevant Learning. Real-World Impact.',
  },
  {
    id: 'slide-5',
    src: '/hero-slides/slide1-corporate-training.png',
    alt: 'VIT-TEC Corporate Training — Real Impact. Stronger Tomorrows.',
  },
];

const SLIDE_INTERVAL = 5000; // 5.0 seconds display time per slide

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const timerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const transitionToSlide = useCallback((nextIndex) => {
    setCurrentIndex((current) => {
      if (current === nextIndex) return current;
      setPrevIndex(current);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = setTimeout(() => {
        setPrevIndex(null);
      }, 950);

      return nextIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((current) => {
      const nextIndex = (current + 1) % slides.length;
      setPrevIndex(current);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = setTimeout(() => {
        setPrevIndex(null);
      }, 950);

      return nextIndex;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((current) => {
      const nextIndex = (current - 1 + slides.length) % slides.length;
      setPrevIndex(current);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = setTimeout(() => {
        setPrevIndex(null);
      }, 950);

      return nextIndex;
    });
  }, []);

  const handleDotClick = useCallback((index) => {
    transitionToSlide(index);
  }, [transitionToSlide]);

  // Clean up transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Continuous auto-advance timer: exactly 5000ms, NEVER paused by hover
  useEffect(() => {
    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, currentIndex]);

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slideshowWrapper}>
        <div className={styles.slidesContainer}>
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === prevIndex;
            let slideClassName = styles.slide;
            if (isActive) {
              slideClassName += ` ${styles.slideActive}`;
            } else if (isPrev) {
              slideClassName += ` ${styles.slideOutgoing}`;
            }
            return (
              <div
                key={slide.id}
                className={slideClassName}
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