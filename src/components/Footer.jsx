import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.topGrid}>
          {/* Column 1: Info */}
          <div className={styles.infoCol}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>VIT-TEC</span>
              <span className={styles.logoDot} />
            </Link>
            <p className={styles.logoDesc}>
              VIT Technology Enhancement Centre (VIT-TEC) is part of the Sponsored Research & Industrial Consultancy (SpoRIC) division at VIT Chennai, specializing in corporate training and executive development.
            </p>
            <div className={styles.address}>
              <p className={styles.recipient}>Dean, SpoRIC</p>
              <p>AB2-102 SMEC Research Scholar Room</p>
              <p>VIT Chennai Campus, Vandalur-Kelambakkam Road</p>
              <p>Chennai - 600 127, Tamil Nadu, INDIA</p>
            </div>
          </div>

          {/* Column 2: Corporate Training Programs */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Corporate Programs</h4>
            <ul className={styles.linksList}>
              <li><Link to="/courses?cat=Data%20Science">Data Science & AI</Link></li>
              <li><Link to="/courses?cat=Cyber%20Security">Cyber Security</Link></li>
              <li><Link to="/courses?cat=Cloud%20Computing">Cloud Computing</Link></li>
              <li><Link to="/courses?cat=Artificial%20Intelligence">Machine Learning</Link></li>
              <li><Link to="/courses?cat=Industry%204.0">Industry 4.0 & IoT</Link></li>
              <li><Link to="/courses">All Corporate Courses</Link></li>
            </ul>
          </div>

          {/* Column 3: Corporate Solutions */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Corporate Solutions</h4>
            <ul className={styles.linksList}>
              <li><Link to="/about">About VIT-TEC</Link></li>
              <li><Link to="/courses">Custom Executive Training</Link></li>
              <li><Link to="/register">Corporate Enrolment</Link></li>
              <li><Link to="/courses">Faculty & Expert Led</Link></li>
              <li><Link to="/contact">Industrial Consultancy</Link></li>
              <li><Link to="/contact">Request Training Proposal</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Support</h4>
            <ul className={styles.linksList}>
              <li><span className={styles.contactLabel}>Phone:</span> <a href="tel:04439931196">044 3993 1196</a></li>
              <li><span className={styles.contactLabel}>FAX:</span> <span>044 3993 2555</span></li>
              <li><span className={styles.contactLabel}>Mobile:</span> <span>73587 82571</span></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Page</Link></li>
              <li><a href="mailto:deancc.sporic@vit.ac.in" className={styles.emailBtn}>Email Dean SpoRIC</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} VIT Chennai. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="https://chennai.vit.ac.in/" target="_blank" rel="noopener noreferrer">VIT Chennai Home</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
