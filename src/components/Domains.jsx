import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import styles from './Domains.module.css';

const featuredPrograms = [
  {
    id: 'data-science',
    title: 'Data Science',
    subtitle: 'Analytics & AI',
    path: '/courses?cat=Data%20Science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    subtitle: 'Protecting Digital Future',
    path: '/courses?cat=Cyber%20Security',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    subtitle: 'Scalable & Secure',
    path: '/courses?cat=Cloud%20Computing',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    subtitle: 'Intelligent Systems',
    path: '/courses?cat=Artificial%20Intelligence',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'industry-40',
    title: 'Industry 4.0',
    subtitle: 'Smart Manufacturing',
    path: '/courses?cat=Industry%204.0',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
  },
];

export default function Domains() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section className={styles.domainsSection} id="programs" ref={containerRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Our Programs</h2>
          <p className={styles.subtitle}>
            Industry aligned programs for professional growth
          </p>
        </div>

        <div className={styles.programsGrid}>
          {featuredPrograms.map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
            >
              <Link to={prog.path} className={styles.programCard}>
                <div className={styles.imageWrapper}>
                  <img src={prog.image} alt={prog.title} className={styles.cardImg} loading="lazy" />
                </div>
                <div className={styles.cardBody}>
                  <div>
                    <h3 className={styles.cardTitle}>{prog.title}</h3>
                    <p className={styles.cardSubtitle}>{prog.subtitle}</p>
                  </div>
                  <span className={styles.viewDetails}>
                    View Details →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <Link to="/courses" className={styles.viewAllBtn}>
            View All Programs →
          </Link>
        </div>
      </div>
    </section>
  );
}
