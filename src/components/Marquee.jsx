import styles from './Marquee.module.css';

const marqueeItems = [
  'Technology',
  'Management',
  'Leadership & Personality',
  '90+ Certified Courses',
  'Industry Standards',
  'SpoRIC VIT Chennai',
];

export default function Marquee() {
  return (
    <section className={styles.marqueeSection} aria-hidden="true">
      <div className={styles.wrapper}>
        <div className={styles.marquee}>
          <div className={styles.group}>
            {marqueeItems.map((item, idx) => (
              <span key={idx} className={styles.item}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
          <div className={styles.group}>
            {marqueeItems.map((item, idx) => (
              <span key={`dup-${idx}`} className={styles.item}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.reverse}`}>
          <div className={styles.group}>
            {marqueeItems.map((item, idx) => (
              <span key={`rev-${idx}`} className={styles.item}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
          <div className={styles.group}>
            {marqueeItems.map((item, idx) => (
              <span key={`rev-dup-${idx}`} className={styles.item}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
