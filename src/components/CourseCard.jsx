import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import CourseEnquiryModal from './CourseEnquiryModal';
import { COURSE_STATUS, isUserEnrolledInCourse, enrollUserInCourse } from '../data/courses';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [justEnrolled, setJustEnrolled] = useState(false);

  // Sync user and enrollment state
  useEffect(() => {
    const checkState = () => {
      try {
        const stored = localStorage.getItem('sporic_user');
        if (stored) {
          const u = JSON.parse(stored);
          setUser(u);
          if (u?.email) {
            setIsEnrolled(isUserEnrolledInCourse(u.email, course.id));
          }
        } else {
          setUser(null);
          setIsEnrolled(false);
        }
      } catch {
        setUser(null);
        setIsEnrolled(false);
      }
    };

    checkState();
    window.addEventListener('storage', checkState);
    return () => window.removeEventListener('storage', checkState);
  }, [course.id]);

  const handleEnrollClick = (e) => {
    e.preventDefault();

    if (isEnrolled || justEnrolled) {
      navigate('/dashboard?tab=courses');
      return;
    }

    if (!user) {
      // Redirect to login with return redirect
      navigate(`/login?redirect=${encodeURIComponent('/courses/' + course.id)}`);
      return;
    }

    setEnrolling(true);
    setTimeout(() => {
      enrollUserInCourse(user.email, course.id);
      setIsEnrolled(true);
      setJustEnrolled(true);
      setEnrolling(false);
    }, 400);
  };

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

  const isOpenForReg = course.status === COURSE_STATUS.OPEN;
  const isUpcoming = course.status === COURSE_STATUS.UPCOMING;

  return (
    <>
      <GlassCard className={styles.courseCard} glow padding="md" hover>
        {/* Course Topic Visual with Status Badge */}
        <Link to={`/courses/${course.id}`} className={styles.visualPlaceholder} title={`View details for ${course.title}`}>
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
        </Link>

        <div className={styles.cardBody}>
          <div className={styles.categoryRow}>
            <div className={styles.category}>{course.category}</div>
            {getDeadlineBadge()}
          </div>

          <h3 className={styles.title} title={course.title}>
            <Link to={`/courses/${course.id}`} className={styles.titleLink}>
              {course.title}
            </Link>
          </h3>

          <p className={styles.desc}>{course.shortDescription}</p>

          {course.trainer && (
            <div className={styles.trainerInfo} title={course.trainer}>
              👨‍🏫 {course.trainer}
            </div>
          )}

          <div className={styles.footerRow}>
            {/* Meta Row: Hours & View Details */}
            <div className={styles.metaRow}>
              <div className={styles.hours}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.hours} Hours</span>
              </div>

              <Link to={`/courses/${course.id}`} className={styles.detailsLink}>
                Details →
              </Link>
            </div>

            {/* Action Buttons: BOTH [ Enroll Now ] and [ Enquire Now ] */}
            <div className={styles.actionsGrid}>
              {/* Left Action: Enroll Now / Enrolled / Upcoming / Closed */}
              {isOpenForReg ? (
                isEnrolled || justEnrolled ? (
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    className={styles.enrolledBtn}
                    title="You are enrolled in this course. Click to view dashboard."
                  >
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Enrolled ✓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    disabled={enrolling}
                    className={styles.enrollBtn}
                    title="Enroll in this course"
                  >
                    <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                  </button>
                )
              ) : isUpcoming ? (
                <button
                  type="button"
                  disabled
                  className={styles.upcomingBtn}
                  title="Enrollment opening soon"
                >
                  <span>Upcoming</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className={styles.closedBtn}
                  title="Registration closed for this batch"
                >
                  <span>Closed</span>
                </button>
              )}

              {/* Right Action: Enquire Now (Always Available & Independent) */}
              <button
                type="button"
                className={styles.enquireBtn}
                onClick={() => setShowEnquiryModal(true)}
                title="Send an inquiry about this course"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: '3px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Enquire Now</span>
              </button>
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
