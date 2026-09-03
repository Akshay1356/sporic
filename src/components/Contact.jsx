import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Contact.module.css';

export default function Contact() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulated API Call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <section className={styles.contactSection} id="contact" ref={containerRef}>
      {/* Background Subtle Tech Grid */}
      <div className="grid-bg" style={{ opacity: 0.4 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Connect with Us</span>
          <h2 className="section-title">Contact SpoRIC</h2>
          <p className="section-subtitle">
            Get in touch with the Sponsored Research &amp; Industrial Consultancy division for registrations, customized corporate training programs, or enterprise queries.
          </p>
        </motion.div>

        {/* 2-Column Connected Communication Grid */}
        <div className={styles.grid}>
          {/* ====================================================
              LEFT COLUMN: "CONNECT WITH VIT-TEC" HUB
             ==================================================== */}
          <motion.div
            className={styles.hubCard}
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Subtle Technical Network Geometry */}
            <svg className={styles.networkBg} viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="160" cy="40" r="32" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
              <circle cx="160" cy="40" r="18" fill="none" stroke="rgba(29, 78, 216, 0.25)" strokeWidth="1" />
              <line x1="160" y1="40" x2="60" y2="120" className={styles.networkLine} strokeWidth="1.5" />
              <line x1="160" y1="40" x2="130" y2="170" className={styles.networkLine} strokeWidth="1.5" />
              <circle cx="160" cy="40" r="5" className={styles.networkPulseDot} />
              <circle cx="60" cy="120" r="3.5" fill="#38BDF8" />
              <circle cx="130" cy="170" r="3.5" fill="#38BDF8" />
            </svg>

            {/* Hub Header */}
            <div className={styles.hubHeader}>
              <span className={styles.hubEyebrow}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Institutional Hub
              </span>
              <h3 className={styles.hubTitle}>Connect with VIT-TEC</h3>
              <p className={styles.hubSubtitle}>
                Let's build meaningful connections across learning, industry and innovation.
              </p>
            </div>

            {/* Address Block */}
            <div className={styles.addressCard}>
              <div className={styles.addressHeader}>
                <div className={styles.addressIconWrap}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className={styles.addressHeading}>VIT-TEC Address</h4>
              </div>
              <p className={styles.recipient}>Dean, Sponsored Research &amp; Industrial Consultancy (SpoRIC)</p>
              <p className={styles.addressLine}>AB2-102 SMEC Research Scholar Room</p>
              <p className={styles.addressLine}>VIT, Chennai Campus</p>
              <p className={styles.addressLine}>Vandalur – Kelambakkam Road</p>
              <p className={styles.addressLine}>Chennai - 600 127, Tamil Nadu, INDIA</p>
            </div>

            {/* Refined Contact Information Modules */}
            <div className={styles.contactModulesGrid}>
              {/* Landline */}
              <a href="tel:04439931196" className={styles.contactModule}>
                <div className={styles.moduleIconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className={styles.moduleDetails}>
                  <span className={styles.moduleLabel}>Landline</span>
                  <span className={styles.moduleValue}>044 3993 1196</span>
                </div>
              </a>

              {/* FAX */}
              <div className={styles.contactModule}>
                <div className={styles.moduleIconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <div className={styles.moduleDetails}>
                  <span className={styles.moduleLabel}>FAX</span>
                  <span className={styles.moduleValue}>044 3993 2555</span>
                </div>
              </div>

              {/* Mobile Numbers */}
              <a href="tel:7358782571" className={`${styles.contactModule} ${styles.fullWidthModule}`}>
                <div className={styles.moduleIconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2.2" />
                    <line x1="11" y1="18" x2="13" y2="18" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className={styles.moduleDetails}>
                  <span className={styles.moduleLabel}>Mobile</span>
                  <span className={styles.moduleValue}>73587 82571, 94878 33044</span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:deancc.sporic@vit.ac.in" className={`${styles.contactModule} ${styles.fullWidthModule}`}>
                <div className={styles.moduleIconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={styles.moduleDetails}>
                  <span className={styles.moduleLabel}>Email</span>
                  <span className={styles.moduleValue}>deancc.sporic@vit.ac.in</span>
                </div>
              </a>
            </div>
          </motion.div>

          {/* ====================================================
              RIGHT COLUMN: SEND AN INQUIRY PANEL
             ==================================================== */}
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {/* Form Header */}
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>Send an Inquiry</h3>
              <p className={styles.formSubtitle}>
                Tell us how VIT-TEC can support your training or collaboration needs.
              </p>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGridTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Customized Training / Group Registration"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your corporate training or institutional requirements..."
                  className={styles.textarea}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={styles.submitBtn}
                >
                  <span>{status === 'sending' ? 'Sending Message...' : 'Send Message'}</span>
                  <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4.167 10h11.666M10.833 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {status === 'success' && (
                <div className={styles.successMsg}>
                  ✓ Inquiry submitted successfully. We will contact you shortly!
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
