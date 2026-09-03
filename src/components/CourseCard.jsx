import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import CourseEnquiryModal from './CourseEnquiryModal';
import { COURSE_STATUS } from '../data/courses';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Compute deadline urgency
  const getDeadlineBadge = () => {
    if (!course?.registrationDeadline || course.status !== COURSE_STATUS.OPEN) return null;
    const deadline = new Date(course.registrationDeadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 14) {
      return (
        <span className={styles.deadlineNotice}>
          ⏰ Closes in {diffDays}d
        </span>
      );
    }
    return (
      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>
        Deadline: {new Date(course.registrationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </span>
    );
  };

  const getStatusPill = () => {
    if (course.status === COURSE_STATUS.UPCOMING) {
      return <span className={styles.statusPillUpcoming}>Upcoming</span>;
    }
    if (course.status === COURSE_STATUS.CLOSED || course.status === COURSE_STATUS.COMPLETED) {
      return <span className={styles.statusPillClosed}>Closed</span>;
    }
    return <span className={styles.statusPillOpen}>Open for Reg</span>;
  };

  const courseImage = course?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

  return (
    <>
      <GlassCard className={styles.courseCard} glow padding="md" hover>
        {/* Course Topic Visual with Status Badge */}
        <div className={styles.visualPlaceholder}>
          <img src={courseImage} alt={course.title} className={styles.courseImg} loading="lazy" />
          <div className={styles.visualOverlay}>
            <div className={styles.badgeWrap}>
              <span className="tag tag-cyan" style={{ fontSize: '0.68rem', fontWeight: '800' }}>
                {course.id}
              </span>
              {getStatusPill()}
            </div>

            <div className={styles.bottomVisualRow}>
              <span style={{ fontSize: '0.65rem', color: '#38BDF8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {course.domain}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#FFFFFF', fontWeight: '700', textTransform: 'uppercase' }}>
                {course.mode}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.categoryRow}>
            <div className={styles.category}>{course.category}</div>
            {getDeadlineBadge()}
          </div>

          <h3 className={styles.title} title={course.title}>
            {course.title}
          </h3>

          <p className={styles.desc}>{course.shortDescription}</p>

          {course.trainer && (
            <div className={styles.trainerInfo} title={course.trainer}>
              👨‍🏫 {course.trainer}
            </div>
          )}

          <div className={styles.footerRow}>
            <div className={styles.hours}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.hours} Hours</span>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.enquireBtn}
                onClick={() => setShowEnquiryModal(true)}
                title="Ask a query about this course"
              >
                💬 Enquire Now
              </button>

              <Link to={`/courses/${course.id}`} className={styles.detailsBtn}>
                Poster & Details
              </Link>

              <Link to={`/register?courseId=${course.id}`} className={`btn ${styles.enrollBtn}`}>
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Reusable Course Enquiry Modal */}
      <CourseEnquiryModal
        course={course}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </>
  );
}
