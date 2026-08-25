import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimationBackground from './VITTECAnimation/AnimationBackground';
import AnimationElements from './VITTECAnimation/AnimationElements';
import { useCursorPosition } from '../hooks/useCursorPosition';
import styles from './Hero.module.css';

// Floating glass cards framing the hero
const floatingCards = [
  {
    id: 'tech',
    title: 'Technology Focus',
    items: ['Industry 4.0', 'AI & Machine Learning', 'Electric Vehicles', 'Quantum Computing'],
    color: 'blue',
    position: 'left',
  },
  {
    id: 'growth',
    title: 'Professional Growth',
    items: ['Leadership Mastery', 'Operations & Strategy', 'Corporate Communication', 'Personality Excellence'],
    color: 'cyan',
    position: 'right',
  },
];

export default function Hero() {
  const heroRef = useRef(null);
  const mousePos = useCursorPosition(heroRef);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Cursor parallax for floating cards
  const cardParallaxX = (mousePos.x - 0.5) * 15;
  const cardParallaxY = (mousePos.y - 0.5) * 10;

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-label="VIT-TEC Hero"
    >
      {/* Dynamic Background Environment */}
      <AnimationBackground mousePos={mousePos} />

      {/* Main Content Flow */}
      <motion.div
        className={styles.contentLayer}
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className={styles.heroContent}>
          {/* 1. Original VIT-TEC SVG Stroke Animation */}
          <div className={styles.animationContainer}>
            <AnimationElements />
          </div>

          {/* 2. Subtitle Tag */}
          <motion.div
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="tag tag-cyan">VIT Technology Enhancement Centre</span>
          </motion.div>

          {/* 3. Main Headline */}
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Empowering Innovation{' '}
            <span className={styles.headlineAccent}>Through Technology</span>
          </motion.h1>

          {/* 4. Supporting text */}
          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            Industry-driven training, professional development and advanced
            learning programs from VIT. Upskill, reskill, and advance your career
            with globally recognised certification.
          </motion.p>

          {/* 5. CTAs */}
          <motion.div
            className={styles.heroCTAs}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <MagneticButton>
              <Link to="/courses" className={`btn btn-primary ${styles.ctaPrimary}`}>
                Explore Courses
                <ArrowIcon />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/about" className={`btn btn-secondary ${styles.ctaSecondary}`}>
                Discover VIT-TEC
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating glass cards framing the sides */}
      <div className={styles.floatingCards} aria-hidden="true">
        {floatingCards.map((card, i) => (
          <motion.div
            key={card.id}
            className={`${styles.floatingCard} ${styles[`card-${card.position}`]} glass`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.0 + i * 0.2, ease: 'easeOut' }}
            style={{
              transform: `translate(${cardParallaxX * (card.position === 'left' ? -1 : 1)}px, ${cardParallaxY}px)`,
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
            >
              <div className={`${styles.cardTitle} ${styles[`color-${card.color}`]}`}>
                {card.title}
              </div>
              <ul className={styles.cardItems}>
                {card.items.map(item => (
                  <li key={item} className={styles.cardItem}>
                    <span className={styles.cardDot} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </motion.div>
    </section>
  );
}

// Magnetic button wrapper
function MagneticButton({ children }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
