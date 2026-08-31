import AboutSection from '../components/About';
import Benefits from '../components/Benefits';
import IndustryTraining from '../components/IndustryTraining';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <span className="section-label">A Legacy of Excellence</span>
          <h1 className={styles.title}>VIT Chennai Campus</h1>
          <p className={styles.subtitle}>
            Empowering professionals through research-backed industry education under Sponsored Research & Industrial Consultancy.
          </p>
        </div>
      </section>

      {/* Main Core Components */}
      <AboutSection />
      <IndustryTraining />
      <Benefits />
    </div>
  );
}
