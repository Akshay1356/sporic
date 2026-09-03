import { useState } from 'react';
import GlassCard from './GlassCard';
import styles from './Contact.module.css';

export default function Contact() {
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
    <section className={styles.contactSection} id="contact">
      <div className="glow-orb glow-blue" style={{ top: '20%', left: '10%', width: '300px', height: '300px' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.sectionHeader}>
          <span className="section-label">Connect with Us</span>
          <h2 className="section-title">Contact SpoRIC</h2>
          <p className="section-subtitle">
            Get in touch with the Sponsored Research & Industrial Consultancy division for registrations, customized corporate training programs, or queries.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Contact details */}
          <div className={styles.detailsCol}>
            <GlassCard glow className={styles.infoCard} padding="lg">
              <h3 className={styles.cardTitle}>VIT-TEC Address</h3>
              
              <div className={styles.addressBlock}>
                <p className={styles.recipient}>Dean, Sponsored Research & Industrial Consultancy (SpoRIC)</p>
                <p className={styles.addressLine}>AB2-102 SMEC Research Scholar Room</p>
                <p className={styles.addressLine}>VIT, Chennai Campus</p>
                <p className={styles.addressLine}>Vandalur - Kelambakkam Road</p>
                <p className={styles.addressLine}>Chennai - 600 127, Tamil Nadu, INDIA</p>
              </div>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📞</span>
                  <div>
                    <span className={styles.label}>Landline</span>
                    <a href="tel:04439931196" className={styles.val}>044 3993 1196</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.icon}>📠</span>
                  <div>
                    <span className={styles.label}>FAX</span>
                    <span className={styles.val}>044 3993 2555</span>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.icon}>📱</span>
                  <div>
                    <span className={styles.label}>Mobile</span>
                    <span className={styles.val}>73587 82571, 94878 33044</span>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.icon}>✉️</span>
                  <div>
                    <span className={styles.label}>Email</span>
                    <a href="mailto:deancc.sporic@vit.ac.in" className={styles.val}>deancc.sporic@vit.ac.in</a>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Query Form */}
          <div className={styles.formCol}>
            <GlassCard className={styles.formCard} padding="lg">
              <h3 className={styles.cardTitle}>Send an Inquiry</h3>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
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

                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
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

                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.formLabel}>Message</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your training requirements..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.btnRow}>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`btn btn-primary ${styles.submitBtn}`}
                  >
                    {status === 'sending' ? 'Submitting...' : 'Send Message'}
                  </button>
                </div>

                {status === 'success' && (
                  <div className={styles.successMsg}>
                    ✓ Inquiry submitted successfully. We will contact you shortly!
                  </div>
                )}
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
