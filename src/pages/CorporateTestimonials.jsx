import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getAllTestimonials } from '../data/testimonialsData';
import styles from './CorporateTestimonials.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

function QuoteIcon() {
  return (
    <svg
      className={styles.quoteIcon}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 22c0-4.418 3.582-8 8-8v4c-2.21 0-4 1.79-4 4v2h4v8h-8v-10zm16 0c0-4.418 3.582-8 8-8v4c-2.21 0-4 1.79-4 4v2h4v8h-8v-10z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CorporateTestimonials() {
  const [testimonials, setTestimonials] = useState(() => getAllTestimonials());
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-60px' });
  const cardsInView = useInView(cardsRef, { once: true, margin: '-60px' });

  useEffect(() => {
    const handleUpdate = () => setTestimonials(getAllTestimonials());
    window.addEventListener('sporic_testimonials_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sporic_testimonials_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <main className={styles.page}>
      {/* Hero / Header */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <motion.p
            className={styles.eyebrow}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            custom={0}
          >
            Trusted by Industry
          </motion.p>
          <motion.h1
            className={styles.heroTitle}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            custom={1}
          >
            What Industry Leaders Say
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            custom={2}
          >
            Hear from senior professionals across sectors who have partnered with
            VIT-TEC to upskill their workforce.
          </motion.p>
        </div>
        <div className={styles.orb1} aria-hidden="true" />
        <div className={styles.orb2} aria-hidden="true" />
      </section>

      {/* Testimonial Cards */}
      <section className={styles.cardsSection} ref={cardsRef}>
        <div className={styles.cardsGrid}>
          {testimonials.map((t, idx) => (
            <motion.article
              key={idx}
              className={styles.card}
              variants={fadeUp}
              initial="hidden"
              animate={cardsInView ? 'visible' : 'hidden'}
              custom={idx}
            >
              <QuoteIcon />
              <blockquote className={styles.quote}>"{t.quote}"</blockquote>
              <footer className={styles.cardFooter}>
                <div className={styles.avatar}>{t.initial}</div>
                <div className={styles.meta}>
                  <span className={styles.name}>— {t.name}</span>
                  <span className={styles.company}>{t.company}</span>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaInner}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
        >
          <h2 className={styles.ctaTitle}>Ready to empower your workforce?</h2>
          <p className={styles.ctaSub}>
            Partner with VIT-TEC to design programmes that align with your
            organisation&apos;s goals.
          </p>
          <a href="/contact" className={styles.ctaBtn}>
            Get in Touch →
          </a>
        </motion.div>
      </section>
    </main>
  );
}
