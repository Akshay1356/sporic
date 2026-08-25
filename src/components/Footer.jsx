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
              VIT Technology Enhancement Centre (VIT-TEC) is part of the Sponsored Research & Industrial Consultancy (SpoRIC) division at VIT Chennai.
            </p>
            <div className={styles.address}>
              <p className={styles.recipient}>Dean, SpoRIC</p>
              <p>AB2-102 SMEC Research Scholar Room</p>
              <p>VIT Chennai Campus, Vandalur-Kelambakkam Road</p>
              <p>Chennai - 600 127, Tamil Nadu, INDIA</p>
            </div>
          </div>

          {/* Column 2: Domains & Categories */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Technology Categories</h4>
            <ul className={styles.linksList}>
              <li><Link to="/technology?cat=Industry%204.0">Industry 4.0</Link></li>
              <li><Link to="/technology?cat=Electric%20Vehicles">Electric Vehicles</Link></li>
              <li><Link to="/technology?cat=Design">Design Engineering</Link></li>
              <li><Link to="/technology?cat=Renewable%20Energy">Renewable Energy</Link></li>
              <li><Link to="/technology?cat=Construction%20Technology">Construction Tech</Link></li>
              <li><Link to="/technology?cat=Quantum%20Computing">Quantum Computing</Link></li>
            </ul>
          </div>

          {/* Column 3: Management */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Management & Leadership</h4>
            <ul className={styles.linksList}>
              <li><Link to="/management?cat=Operations%20Management">Operations Management</Link></li>
              <li><Link to="/management?cat=Finance">Financial Management</Link></li>
              <li><Link to="/management?cat=Marketing">Marketing Strategy</Link></li>
              <li><Link to="/management?cat=Data%20Science">Data Science for Business</Link></li>
              <li><Link to="/leadership">Leadership Development</Link></li>
              <li><Link to="/leadership">Interpersonal Development</Link></li>
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
