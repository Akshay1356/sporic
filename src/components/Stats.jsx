import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Stats.module.css';

const statsData = [
  {
    value: 50,
    suffix: '+',
    label: 'Programs',
  },
  {
    value: 2000,
    suffix: '+',
    label: 'Trained Professionals',
  },
  {
    value: 100,
    suffix: '+',
    label: 'Industry Partners',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Years of Excellence',
  },
  {
    value: 25,
    suffix: '+',
    label: 'Technology Domains',
  },
];

function AnimatedNumber({ target, suffix, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    // Smooth ease-out count-up, slightly slowed for readability.
    const duration = 4000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth cubic ease-out: 1 - pow(1 - progress, 3)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * target);
      
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div className={styles.statsWrapper} ref={ref}>
      <div className={styles.statsContainer}>
        <motion.div
          className={styles.statsCard}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {statsData.map((item, idx) => (
            <motion.div
              key={idx}
              className={styles.statItem}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
            >
              <div className={styles.statContent}>
                <div className={styles.statNumber}>
                  <AnimatedNumber
                    target={item.value}
                    suffix={item.suffix}
                    isVisible={isInView}
                  />
                </div>
                <div className={styles.statLabel}>{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
