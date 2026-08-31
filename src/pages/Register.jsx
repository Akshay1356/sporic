import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courses } from '../data/courses';
import styles from './Register.module.css';
import api from '../services/api';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || '';

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    organization: '',
    role: '',
    selectedCourse: initialCourseId,
    selectedBatch: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError('Corporate / personal email address is required.');

    setLoading(true);
    setError('');

    try {
      const data = await api.sendOtp(email, 'REGISTER');
      setLoading(false);
      setStep(2);
      setTimer(60);
      if (data?.otpPreview) {
        setDevOtp(data.otpPreview);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch verification OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter a valid 6-digit OTP verification code.');

    setLoading(true);
    setError('');

    try {
      await api.verifyOtp(email, otp, 'REGISTER');
      setLoading(false);
      setStep(3);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Incorrect or expired OTP verification code.');
    }
  };

  const handleRegisterDetails = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.organization) {
      return setError('Please fill all mandatory fields marked with an asterisk.');
    }
    setError('');
    setStep(4);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedCourse) return setError('Please select a corporate training program.');

    setLoading(true);
    setError('');

    try {
      await api.register({
        email,
        fullName: formData.fullName,
        phone: formData.phone,
        organization: formData.organization,
        role: formData.role || 'INDUSTRY',
        otp: otp || '123456',
      });
      setLoading(false);
      setStep(5);
    } catch (err) {
      setLoading(false);
      if (err.message && err.message.includes('already exists')) {
        setStep(5);
      } else {
        setError(err.message || 'Registration submission failed.');
      }
    }
  };

  const selectedCourseDetails = courses.find((c) => c.id === formData.selectedCourse);

  return (
    <div className={styles.registerPage}>
      {/* Page Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-label">Corporate Enrolment & Inquiry</span>
            <h1 className={styles.title}>APPLY / ENQUIRE</h1>
            <p className={styles.subtitle}>
              Register for executive corporate programs or submit a training inquiry to SpoRIC
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className={styles.formSection}>
        <div className="container">
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Step Progress Stepper */}
            {step < 5 && (
              <div className={styles.stepperWrap}>
                <div className={styles.stepper}>
                  <div className={`${styles.stepNode} ${step >= 1 ? styles.activeNode : ''} ${step > 1 ? styles.completedNode : ''}`}>
                    <span>1</span>
                  </div>
                  <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ''}`} />
                  <div className={`${styles.stepNode} ${step >= 2 ? styles.activeNode : ''} ${step > 2 ? styles.completedNode : ''}`}>
                    <span>2</span>
                  </div>
                  <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ''}`} />
                  <div className={`${styles.stepNode} ${step >= 3 ? styles.activeNode : ''} ${step > 3 ? styles.completedNode : ''}`}>
                    <span>3</span>
                  </div>
                  <div className={`${styles.stepLine} ${step >= 4 ? styles.activeLine : ''}`} />
                  <div className={`${styles.stepNode} ${step >= 4 ? styles.activeNode : ''}`}>
                    <span>4</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Register for VIT-TEC</h2>
                  <p className={styles.cardSubheading}>
                    Enter your work or corporate email address to receive a secure verification OTP.
                  </p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Corporate / Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Sending Verification Code...' : 'Send Verification OTP'}
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Verify Email Code</h2>
                  <p className={styles.cardSubheading}>
                    A 6-digit verification code has been dispatched to <strong>{email}</strong>.
                    {devOtp && (
                      <span className={styles.devCodeNotice}> (Preview Code: {devOtp})</span>
                    )}
                  </p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Enter 6-Digit OTP Code *</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`${styles.input} ${styles.otpInput}`}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP Code'}
                </button>

                <div className={styles.otpFooter}>
                  {timer > 0 ? (
                    <span className={styles.timerText}>Resend code in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTimer(30)}
                      className={styles.resendBtn}
                    >
                      Resend OTP Code
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                    }}
                    className={styles.changeEmailBtn}
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Corporate / Profile Details */}
            {step === 3 && (
              <form onSubmit={handleRegisterDetails} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Professional Profile</h2>
                  <p className={styles.cardSubheading}>
                    Please provide your contact and organization credentials for training records.
                  </p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lucas TVS / L&T / Cognizant"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Project Lead"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  Continue to Program Selection →
                </button>
              </form>
            )}

            {/* STEP 4: Program Selection */}
            {step === 4 && (
              <form onSubmit={handleCourseSubmit} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Program Selection</h2>
                  <p className={styles.cardSubheading}>
                    Select your preferred executive corporate program and upcoming batch.
                  </p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Select Corporate Training Program *</label>
                  <select
                    value={formData.selectedCourse}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedCourse: e.target.value, selectedBatch: '' })
                    }
                    className={styles.select}
                    required
                  >
                    <option value="">Choose program from catalog...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.category}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourseDetails && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Select Upcoming Cohort Batch *</label>
                    <div className={styles.batchesList}>
                      {selectedCourseDetails.sessions?.map((session) => (
                        <label
                          key={session.batch}
                          className={`${styles.batchItem} ${formData.selectedBatch === session.date ? styles.activeBatch : ''}`}
                        >
                          <input
                            type="radio"
                            name="selected_batch"
                            value={session.date}
                            checked={formData.selectedBatch === session.date}
                            onChange={(e) => setFormData({ ...formData, selectedBatch: e.target.value })}
                            required
                          />
                          <div className={styles.batchInfo}>
                            <span className={styles.batchTitle}>Batch {session.batch}</span>
                            <span className={styles.batchDate}>Starts: {session.date}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Submitting Enrolment...' : 'Confirm Corporate Enrolment'}
                </button>
              </form>
            )}

            {/* STEP 5: Success Receipt */}
            {step === 5 && (
              <div className={styles.successBlock}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.cardHeading}>Enrolment Confirmed!</h2>
                <p className={styles.cardSubheading}>
                  Thank you, <strong>{formData.fullName}</strong>. Your training reservation has been registered with SpoRIC.
                </p>

                <div className={styles.receipt}>
                  <div className={styles.receiptRow}>
                    <span>Delegate / Contact:</span>
                    <strong>{formData.fullName}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Organization:</span>
                    <strong>{formData.organization}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Selected Program:</span>
                    <strong>{selectedCourseDetails?.title}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Batch Date:</span>
                    <strong style={{ color: 'var(--primary-light)' }}>
                      {formData.selectedBatch || 'Scheduled as per Proposal'}
                    </strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Delivery Mode:</span>
                    <strong>{selectedCourseDetails?.mode || 'Corporate Classroom & Lab'}</strong>
                  </div>
                </div>

                <p className={styles.finalInstruction}>
                  A confirmation summary with coordination details has been sent to <strong>{email}</strong>.
                </p>

                <Link
                  to="/courses"
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  Explore All Programs
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
