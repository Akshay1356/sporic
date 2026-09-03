import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveCourseEnquiry } from '../data/courses';
import api from '../services/api';
import styles from './CourseEnquiryModal.module.css';

export default function CourseEnquiryModal({ course, isOpen, onClose, onSuccess }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [queryType, setQueryType] = useState('Course Information');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load active logged-in user profile on open
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setError('');
      return;
    }

    const stored = localStorage.getItem('sporic_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setName(u.fullName || u.name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
        setDesignation(u.designation || '');
        setOrganization(u.organization || u.company || '');
      } catch {
        setCurrentUser(null);
      }
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in your Name, Email, Phone Number, and your Enquiry message.');
      return;
    }

    // Validate phone (at least 8 digits)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8) {
      setError('Please enter a valid phone number (e.g. +91 98765 43210).');
      return;
    }

    setLoading(true);
    setError('');

    const enquiryPayload = {
      courseId: course.id,
      courseTitle: course.title,
      courseCategory: course.category,
      domain: course.domain,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      designation: designation.trim() || 'Professional / Student',
      organization: organization.trim() || 'Individual',
      queryType,
      message: message.trim(),
      userId: currentUser?.id || null,
    };

    try {
      // 1. Save locally to courses enquiry engine
      saveCourseEnquiry(enquiryPayload);

      // 2. Dispatch to backend API / Serverless enquiry handler if available
      await api
        .request('/enquiries', {
          method: 'POST',
          body: JSON.stringify(enquiryPayload),
        })
        .catch(() => null);

      setLoading(false);
      setSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMessage('');
      }, 2500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.badge}>{course.id} • {course.category}</span>
              <h2 className={styles.title}>Enquire About Course</h2>
              <p className={styles.courseSubtitle}>{course.title}</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close enquiry modal">
              ✕
            </button>
          </div>

          {success ? (
            <div className={styles.successBanner}>
              <h3 style={{ margin: '0 0 0.5rem', color: '#6EE7B7' }}>✓ Enquiry Submitted Successfully!</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                Thank you, <strong>{name}</strong>. The SpoRIC course coordinator will contact you at <strong>{phone}</strong> / <strong>{email}</strong> regarding your query.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {currentUser ? (
                <div className={styles.userNotice}>
                  <span>👤 Logged in as <strong>{currentUser.email}</strong>. Details auto-filled from your profile.</span>
                </div>
              ) : null}

              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    disabled={Boolean(currentUser?.email)}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Engineer / Student"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company / College Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Lucas TVS / L&T / VIT"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Query Topic</label>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Course Information">Course Information & Syllabus</option>
                    <option value="Schedule & Batches">Upcoming Batches & Timings</option>
                    <option value="Corporate Cohort Pricing">Corporate Cohort Customization</option>
                    <option value="Certification Process">Certification & Evaluation</option>
                    <option value="Other">Other Specific Question</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Your Message / Query Details *</label>
                <textarea
                  required
                  placeholder="Please describe your requirements, questions about the course modules, or preferred training dates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Submitting Enquiry...' : '📩 Submit Course Enquiry'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
