import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VisionCard, MissionCard } from './VisionMissionCard';
import { getAllCourses, COURSE_STATUS } from '../data/courses';
import styles from './About.module.css';

function getUpcomingCourses() {
  return getAllCourses()
    .filter((course) => course.status === COURSE_STATUS.UPCOMING)
    .sort(
      (a, b) =>
        new Date(a.startDate || '2099-01-01') - new Date(b.startDate || '2099-01-01')
    );
}

function formatStartDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [upcomingCourses, setUpcomingCourses] = useState(getUpcomingCourses);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reload = () => setUpcomingCourses(getUpcomingCourses());
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  // Duplicate the list for seamless continuous infinite vertical marquee
  const displayCourses = upcomingCourses.length > 0 ? [...upcomingCourses, ...upcomingCourses] : [];

  return (
    <section className={styles.aboutSection} id="about" ref={containerRef}>
      <div className="container">
        {/* Main Editorial Split */}
        <div className={styles.aboutGrid}>
          {/* Left Column: Heading & Story */}
          <motion.div
            className={styles.leftCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.eyebrow}>ABOUT VIT-TEC</span>
            <h2 className={styles.title}>
              Building Competence.<br />Creating Impact.
            </h2>
            <p className={styles.description}>
              VIT-TEC offers industry-focused programs and solutions designed to bridge
              the gap between academia and industry. We empower learners and professionals
              with future-ready skills and technologies.
            </p>
            <Link to="/about" className={styles.knowMoreBtn}>
              Know More About Us →
            </Link>
          </motion.div>

          {/* Right Column: Campus Image */}
          <motion.div
            className={styles.rightCol}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageWrapper}>
              <img
                src="/vit_chennai_campus.jpg"
                alt="VIT University Chennai Campus"
                className={styles.campusImg}
              />
            </div>
          </motion.div>
        </div>

        {/* Secondary Subgrid: Vision & Mission Interactive Cards + Upcoming Courses */}
        <div className={styles.subGrid}>
          {/* Left Sub-Column: Interactive Layered Reveal Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VisionCard />
            <MissionCard />
          </motion.div>

          {/* Right Sub-Column: Upcoming Courses */}
          <motion.div
            className={styles.upcomingCard}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.upcomingHeader}>
              <div>
                <span className={styles.upcomingEyebrow}>Coming Soon</span>
                <h3 className={styles.upcomingTitle}>Upcoming Courses</h3>
              </div>
              <span className={styles.upcomingCount}>{upcomingCourses.length}</span>
            </div>

            <div
              className={styles.upcomingScrollContainer}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {upcomingCourses.length > 0 ? (
                <div
                  className={`${styles.upcomingTrack} ${isPaused ? styles.trackPaused : ''}`}
                  style={{ animationDuration: `${Math.max(upcomingCourses.length * 4.5, 22)}s` }}
                >
                  {displayCourses.map((course, idx) => (
                    <Link
                      key={`${course.id}-${idx}`}
                      to={`/courses/${course.id}`}
                      className={styles.upcomingItem}
                      title={`View details for ${course.title}`}
                    >
                      <img
                        src={course.image}
                        alt=""
                        className={styles.upcomingImg}
                        loading="lazy"
                      />
                      <div className={styles.upcomingItemBody}>
                        <span className={styles.upcomingItemId}>{course.id}</span>
                        <span className={styles.upcomingItemTitle}>{course.title}</span>
                        <div className={styles.upcomingItemMeta}>
                          <span>{course.category}</span>
                          <span className={styles.upcomingMetaDot}>•</span>
                          <span>{course.hours} hrs</span>
                          {course.startDate && (
                            <>
                              <span className={styles.upcomingMetaDot}>•</span>
                              <span>Starts {formatStartDate(course.startDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={styles.upcomingPill}>Upcoming</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={styles.upcomingEmpty}>
                  No upcoming programs right now. New training batches are announced
                  regularly — check back soon.
                </p>
              )}
            </div>

            <Link to="/courses" className={styles.upcomingAllLink}>
              View All Programs
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
