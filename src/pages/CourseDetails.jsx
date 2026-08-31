import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import GlassCard from '../components/GlassCard';
import styles from './CourseDetails.module.css';

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className={styles.containerNotFound}>
        <GlassCard padding="lg" className={styles.errorCard}>
          <h2>Course Not Found</h2>
          <p>The requested course code (<strong>{courseId}</strong>) is not registered in our catalog.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Back to Courses
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Generate a distinct stylized dynamic dark visual hue for course graphic
  const hash = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  return (
    <div className={styles.courseDetailsPage}>
      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroInfo}>
              <span className="tag tag-cyan" style={{ marginBottom: '1rem' }}>{course.id}</span>
              <h1 className={styles.title}>{course.title}</h1>
              <p className={styles.desc}>{course.shortDescription}</p>

              <div className={styles.metaRow}>
                <span className="tag tag-blue">{course.domain}</span>
                <span className="tag tag-violet">{course.category}</span>
                <span className="tag tag-cyan">{course.mode.toUpperCase()}</span>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div 
                className={styles.visualCard} 
                style={{ background: `linear-gradient(135deg, hsl(${hue}, 70%, 15%) 0%, #020617 100%)` }}
              >
                <div className={styles.graphicBox} style={{ borderColor: `hsl(${hue}, 60%, 40%)` }}>
                  <span style={{ background: `hsl(${hue}, 80%, 50%)`, boxShadow: `0 0 30px hsl(${hue}, 80%, 50%)` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Body */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className={styles.bodyGrid}>
            {/* Left Main Details */}
            <div className={styles.leftCol}>
              {/* Overview / Learn */}
              <GlassCard className={styles.detailCard} padding="lg">
                <h3 className={styles.cardTitle}>What You'll Learn</h3>
                <ul className={styles.list}>
                  {course.learn.map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </GlassCard>

              {/* Modules */}
              <GlassCard className={styles.detailCard} padding="lg">
                <h3 className={styles.cardTitle}>Course Modules</h3>
                <ol className={styles.orderedList}>
                  {course.modules.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </GlassCard>

              {/* Salient Features */}
              <GlassCard className={styles.detailCard} padding="lg">
                <h3 className={styles.cardTitle}>Salient Features</h3>
                <ul className={styles.list}>
                  {course.features.map((item, idx) => (
                    <li key={idx}>⚡ {item}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Right Column: Enrollment Info Panel */}
            <div className={styles.rightCol}>
              <GlassCard glow className={styles.enrollPanel} padding="lg">
                <h3 className={styles.panelTitle}>Program Details</h3>
                
                <div className={styles.panelInfoList}>
                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Duration</span>
                    <span className={styles.infoVal}>{course.hours} Hours</span>
                  </div>

                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Format</span>
                    <span className={styles.infoVal} style={{ textTransform: 'capitalize' }}>{course.mode} Session</span>
                  </div>

                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Certifying Body</span>
                    <span className={styles.infoVal}>SpoRIC, VIT Chennai</span>
                  </div>
                </div>

                <div className={styles.sessionDatesSection}>
                  <h4 className={styles.datesHeader}>Upcoming Session Batches</h4>
                  <div className={styles.datesList}>
                    {course.sessions.map((session) => (
                      <div key={session.batch} className={styles.dateItem}>
                        <span className={styles.batchLabel}>Batch {session.batch}</span>
                        <span className={styles.dateVal}>{session.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.coordinatorSection}>
                  <h4 className={styles.datesHeader}>Coordinator Info</h4>
                  <p className={styles.coordVal}><strong>{course.contactPerson}</strong></p>
                  <p className={styles.coordSub}>{course.contactEmail}</p>
                  <p className={styles.coordSub}>Mobile: {course.contactNumber}</p>
                </div>

                <Link to={`/register?courseId=${course.id}`} className={`btn btn-primary ${styles.ctaEnrollBtn}`}>
                  Enroll Now
                </Link>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
