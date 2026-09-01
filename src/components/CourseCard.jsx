import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import styles from './CourseCard.module.css';

const categoryBackgrounds = {
  'Industry 4.0': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
  'Electric Vehicles': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop',
  'Design': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop',
  'Optics': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop',
  'Manufacturing': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop',
  'Renewable Energy': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=600&auto=format&fit=crop',
  'Construction Technology': 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=600&auto=format&fit=crop',
  'ADAS': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop',
  'Quantum Computing': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
  'Simulation': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  'Operations Management': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
  'Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
  'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'Leadership & Personality': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
};

const defaultBg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';

export default function CourseCard({ course }) {
  const bgImage = categoryBackgrounds[course?.category] || defaultBg;

  return (
    <GlassCard className={styles.courseCard} glow padding="md" hover>
      {/* Event Poster Mini Visual */}
      <div 
        className={styles.visualPlaceholder}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7, 27, 74, 0.4) 0%, rgba(7, 27, 74, 0.95) 100%), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={styles.badgeWrap}>
          <span className="tag tag-cyan" style={{ fontSize: '0.68rem', fontWeight: '800' }}>{course.id}</span>
          <span className="tag tag-blue" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>{course.mode}</span>
        </div>
        
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: '#38BDF8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            VIT-TEC Training
          </span>
          <span style={{ fontSize: '0.65rem', color: '#FFFFFF', opacity: 0.85, fontWeight: '600' }}>
            {course.hours} Hours
          </span>
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
              Poster & Details
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
