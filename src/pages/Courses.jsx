import CourseExplorer from '../components/CourseExplorer';
import styles from './Courses.module.css';

export default function Courses() {
  return (
    <div className={styles.coursesPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <span className="section-label">VIT-TEC Catalog</span>
          <h1 className={styles.title}>All Available Courses</h1>
          <p className={styles.subtitle}>
            Filter or search by keyword, domain, category, or mode of learning. All program contents are industry-sponsored or expert-led.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <CourseExplorer />
        </div>
      </section>
    </div>
  );
}
