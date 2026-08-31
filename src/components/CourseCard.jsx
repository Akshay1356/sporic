import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  // Generate a distinct stylized dark geometric layout for course visual
  const hash = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  const secondaryHue = (hue + 45) % 360;

  return (
    <GlassCard className={styles.courseCard} glow padding="md" hover>
      {/* Dynamic graphic background */}
      <div 
        className={styles.visualPlaceholder}
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 70%, 15%) 0%, hsl(${secondaryHue}, 60%, 8%) 100%)`,
        }}
      >
        <div className={styles.badgeWrap}>
          <span className="tag tag-cyan" style={{ fontSize: '0.65rem' }}>{course.id}</span>
          <span className="tag tag-blue" style={{ fontSize: '0.65rem' }}>{course.mode}</span>
        </div>
        <div className={styles.visualGraphic} style={{ borderColor: `hsl(${hue}, 70%, 40%)` }}>
          <span style={{ background: `hsl(${secondaryHue}, 80%, 50%)` }} />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.category}>{course.category}</div>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.desc}>{course.shortDescription}</p>

        <div className={styles.footerRow}>
          <div className={styles.hours}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.hours} Hours</span>
          </div>

          <div className={styles.actions}>
            <Link to={`/courses/${course.id}`} className={styles.detailsBtn}>
              View Details
            </Link>
            <Link to={`/register?courseId=${course.id}`} className={`btn btn-primary ${styles.enrollBtn}`}>
              Enroll
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
