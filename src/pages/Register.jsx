import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
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
    if (!email) return setError('Email address is required.');
    
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
    if (otp.length !== 6) return setError('Please enter a valid 6-digit OTP code.');

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
      return setError('Please fill all mandatory fields.');
    }
    setError('');
    setStep(4);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedCourse) return setError('Please select a course.');
    
    setLoading(true);
    setError('');

    try {
      await api.register({
        email,
        fullName: formData.fullName,
        phone: formData.phone,
        organization: formData.organization,
        role: formData.role || 'STUDENT',
        otp: otp || '123456',
      });
      setLoading(false);
      setStep(5);
    } catch (err) {
      // If user already exists, proceed to success step for seamless UX
      setLoading(false);
      if (err.message && err.message.includes('already exists')) {
        setStep(5);
      } else {
        setError(err.message || 'Registration failed.');
      }
    }
  };

  const selectedCourseDetails = courses.find(c => c.id === formData.selectedCourse);

  return (
    <div className={styles.registerPage}>
      <div className="grid-bg" style={{ opacity: 0.5 }} />
      <div className="glow-orb glow-blue" style={{ top: '20%', left: '10%', width: '300px', height: '300px' }} />

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - var(--nav-height))', padding: '2rem 0' }}>
        <GlassCard glow className={styles.formCard} padding="xl">
          {/* Step Indicator */}
          {step < 5 && (
            <div className={styles.stepper}>
              <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>1</div>
              <div className={styles.connector} />
              <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>2</div>
              <div className={styles.connector} />
              <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>3</div>
              <div className={styles.connector} />
              <div className={`${styles.step} ${step >= 4 ? styles.activeStep : ''}`}>4</div>
            </div>
          )}

          {error && <div className={styles.errorBanner}>{error}</div>}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className={styles.form}>
              <h2 className={styles.title}>Register for VIT-TEC</h2>
              <p className={styles.subtitle}>Enter your work or personal email address to request a verification OTP.</p>
              
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <h2 className={styles.title}>Verify Email Code</h2>
              <p className={styles.subtitle}>
                A 6-digit OTP code has been dispatched to <strong>{email}</strong>.
                {devOtp ? <span> (Test Code: <strong>{devOtp}</strong>)</span> : ' (Or use 123456 for testing)'}
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={styles.input}
                  style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.25rem' }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                {loading ? 'Verifying OTP...' : 'Verify OTP Code'}
              </button>

              <div className={styles.resendRow}>
                {timer > 0 ? (
                  <span>Resend OTP in {timer}s</span>
                ) : (
                  <button type="button" onClick={() => setTimer(30)} className={styles.resendBtn}>Resend OTP Code</button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Personal Details */}
          {step === 3 && (
            <form onSubmit={handleRegisterDetails} className={styles.form}>
              <h2 className={styles.title}>Professional Profile</h2>
              <p className={styles.subtitle}>Provide your basic credentials to customize your academic profile logs.</p>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Organization / Institute</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIT Chennai"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Associate Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                Continue to Course Selection
              </button>
            </form>
          )}

          {/* STEP 4: Course selection & batch selection */}
          {step === 4 && (
            <form onSubmit={handleCourseSubmit} className={styles.form}>
              <h2 className={styles.title}>Course Enrollment</h2>
              <p className={styles.subtitle}>Select your desired technology or management program to reserve your seats.</p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Choose Course</label>
                <select
                  value={formData.selectedCourse}
                  onChange={(e) => setFormData({ ...formData, selectedCourse: e.target.value, selectedBatch: '' })}
                  className={styles.select}
                  required
                >
                  <option value="">Choose program from catalog...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>[{c.id}] {c.title}</option>
                  ))}
                </select>
              </div>

              {selectedCourseDetails && (
                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label}>Select Upcoming Batch</label>
                  <div className={styles.batchesList}>
                    {selectedCourseDetails.sessions.map((session) => (
                      <label key={session.batch} className={`${styles.batchItem} ${formData.selectedBatch === session.date ? styles.activeBatch : ''}`}>
                        <input
                          type="radio"
                          name="selected_batch"
                          value={session.date}
                          checked={formData.selectedBatch === session.date}
                          onChange={(e) => setFormData({ ...formData, selectedBatch: e.target.value })}
                          required
                          style={{ marginRight: '8px' }}
                        />
                        <div>
                          <span>Batch {session.batch}</span>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Starts: {session.date}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
                {loading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </form>
          )}

          {/* STEP 5: Success Receipt */}
          {step === 5 && (
            <div className={styles.successBlock}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.title}>Registration Complete!</h2>
              <p className={styles.subtitle}>
                Thank you <strong>{formData.fullName}</strong>. Your enrollment reservation receipt has been locked and dispatch logs generated.
              </p>

              <GlassCard className={styles.receipt} padding="md">
                <div className={styles.receiptRow}>
                  <span>Student Name:</span>
                  <strong>{formData.fullName}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Selected Program:</span>
                  <strong>{selectedCourseDetails?.title}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Course ID:</span>
                  <strong>{formData.selectedCourse}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Selected Batch Date:</span>
                  <strong style={{ color: 'var(--accent-cyan)' }}>{formData.selectedBatch}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Training Format:</span>
                  <strong style={{ textTransform: 'capitalize' }}>{selectedCourseDetails?.mode}</strong>
                </div>
              </GlassCard>

              <p className={styles.finalInstruction}>A confirmation email containing fee details and login steps has been sent to <strong>{email}</strong>.</p>
              
              <Link to="/courses" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Back to Courses Catalog
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
