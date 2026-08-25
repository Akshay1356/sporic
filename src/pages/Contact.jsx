import ContactSection from '../components/Contact';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.contactPage}>
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className={styles.title}>Contact VIT-TEC</h1>
          <p className={styles.subtitle}>
            Connect with our program coordinators or institutional representatives to explore professional enhancement courses.
          </p>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
