import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from './GlassCard';
import styles from './Stats.module.css';

const stats = [
  { value: 90, suffix: '+', label: 'Courses', description: 'Across 3 domains' },
  { value: 200, suffix: '+', label: 'Industry Solutions', description: 'Proven & deployed' },
  { value: 500, suffix: '+', label: 'Trained Corporates', description: 'Across India' },
  { value: 3, suffix: '', label: 'Learning Domains', description: 'Tech, Mgmt, Leadership' },
];

function AnimatedCounter({ value, suffix, isVisible }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1800;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isVisible, value]);

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`section ${styles.statsSection}`} ref={ref}>
      <div className={`grid-bg`} style={{ position: 'absolute', inset: 0, opacity: 0.5 }} aria-hidden="true" />

      <div className="container">
        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              <GlassCard className={styles.statCard} glow>
                <div className={styles.statValue}>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isInView}
                  />
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statDesc}>{stat.description}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
