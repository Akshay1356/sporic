import CourseExplorer from '../components/CourseExplorer';
import styles from './Courses.module.css';

export default function Courses() {
  return (
    <div className={styles.coursesPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <span className="section-label">Corporate Training & Executive Education</span>
          <h1 className={styles.title}>Corporate Training Programs</h1>
          <p className={styles.subtitle}>
            Industry-customized executive training and workforce development programs designed to upskill corporate teams with cutting-edge expertise.
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
