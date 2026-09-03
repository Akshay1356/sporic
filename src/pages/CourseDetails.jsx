import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, COURSE_STATUS } from '../data/courses';
import GlassCard from '../components/GlassCard';
import CoursePoster from '../components/CoursePoster';
import CourseEnquiryModal from '../components/CourseEnquiryModal';
import styles from './CourseDetails.module.css';

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  if (!course) {
    return (
      <div className={styles.containerNotFound}>
        <GlassCard padding="lg" className={styles.errorCard}>
          <h2>Course Not Found</h2>
          <p>The requested course code (<strong>{courseId}</strong>) is not registered in our catalog.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Browse All Courses
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Registration Deadline badge
  const isRegistrationOpen = course.status === COURSE_STATUS.OPEN;

  return (
    <div className={styles.courseDetailsPage}>
      {/* Hero Header with Live Event Poster */}
      <section className={styles.heroSection}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroInfo}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="tag tag-cyan">{course.id}</span>
                <span
                  style={{
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    background: isRegistrationOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    border: isRegistrationOpen ? '1px solid #10B981' : '1px solid #F59E0B',
                    color: isRegistrationOpen ? '#6EE7B7' : '#FCD34D',
                    textTransform: 'uppercase',
                  }}
                >
                  {course.status || COURSE_STATUS.OPEN}
                </span>
                {course.registrationDeadline && (
                  <span style={{ fontSize: '0.8rem', color: '#CBD5E1', background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    ⏰ Registration Deadline: <strong>{new Date(course.registrationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </span>
                )}
              </div>

              <h1 className={styles.title}>{course.title}</h1>
              <p className={styles.desc}>{course.shortDescription}</p>

              <div className={styles.metaRow}>
                <span className="tag tag-blue">{course.domain}</span>
                <span className="tag tag-violet">{course.category}</span>
                <span className="tag tag-cyan">{course.mode.toUpperCase()}</span>
                <span className="tag tag-blue">₹{course.price || 4999}</span>
              </div>

              {course.trainer && (
                <div style={{ marginTop: '1.25rem', padding: '0.65rem 1rem', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👨‍🏫 Lead Trainer / Specialist:</span>
                  <strong style={{ color: '#FFFFFF' }}>{course.trainer}</strong>
                </div>
              )}
            </div>

            {/* Official Training Poster & Lightbox */}
            <div className={styles.heroVisual}>
              <CoursePoster course={course} />
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
                <h3 className={styles.cardTitle}>What You'll Learn &amp; Master</h3>
                <ul className={styles.list}>
                  {course.learn.map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </GlassCard>

              {/* Modules Breakdown */}
              <GlassCard className={styles.detailCard} padding="lg">
                <h3 className={styles.cardTitle}>Structured Syllabus &amp; Modules</h3>
                <ol className={styles.orderedList}>
                  {course.modules.map((item, idx) => (
                    <li key={idx}>
                      <strong>Module {idx + 1}:</strong> {item}
                    </li>
                  ))}
                </ol>
              </GlassCard>

              {/* Salient Features */}
              <GlassCard className={styles.detailCard} padding="lg">
                <h3 className={styles.cardTitle}>Key Program Highlights</h3>
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
                <h3 className={styles.panelTitle}>Program Information</h3>

                <div className={styles.panelInfoList}>
                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Duration</span>
                    <span className={styles.infoVal}>{course.hours} Hours</span>
                  </div>

                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Delivery Mode</span>
                    <span className={styles.infoVal} style={{ textTransform: 'capitalize' }}>
                      {course.mode} Session
                    </span>
                  </div>

                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Certifying Body</span>
                    <span className={styles.infoVal}>SpoRIC, VIT Chennai</span>
                  </div>

                  <div className={styles.panelInfoItem}>
                    <span className={styles.infoLabel}>Program Fee</span>
                    <span className={styles.infoVal} style={{ color: '#38BDF8', fontWeight: 800 }}>
                      ₹{course.price || 4999}
                    </span>
                  </div>
                </div>

                <div className={styles.sessionDatesSection}>
                  <h4 className={styles.datesHeader}>Upcoming Batches</h4>
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
                  <p className={styles.coordVal}>
                    <strong>{course.contactPerson}</strong>
                  </p>
                  <p className={styles.coordSub}>{course.contactEmail}</p>
                  <p className={styles.coordSub}>Phone: {course.contactNumber}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Link
                    to={`/register?courseId=${course.id}`}
                    className={`btn btn-primary ${styles.ctaEnrollBtn}`}
                    style={{ textAlign: 'center', width: '100%' }}
                  >
                    Enroll / Register Now →
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowEnquiryModal(true)}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                  >
                    💬 Enquire About This Course
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <CourseEnquiryModal
        course={course}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </div>
  );
}
