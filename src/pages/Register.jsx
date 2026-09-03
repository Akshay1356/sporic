import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courses, COURSE_STATUS, isUserEnrolledInCourse, enrollUserInCourse } from '../data/courses';
import styles from './Register.module.css';
import api from '../services/api';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawCourseId = searchParams.get('courseId') || searchParams.get('course') || '';

  const [user, setUser] = useState(null);
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
    selectedCourse: rawCourseId,
    selectedBatch: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' | 'razorpay'
  const [paymentData, setPaymentData] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Authenticate / Initialize Step 4 directly for logged-in users or course enrollment
  useEffect(() => {
    const stored = localStorage.getItem('sporic_user');
    let currentUser = null;

    if (stored) {
      try {
        currentUser = JSON.parse(stored);
        setUser(currentUser);
      } catch {
        currentUser = null;
      }
    }

    if (currentUser) {
      // User is logged in: DIRECTLY OPEN STEP 4 (Program & Payment Checkout)
      setStep(4);
      setEmail(currentUser.email || '');
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.fullName || currentUser.name || prev.fullName || 'Delegate',
        phone: currentUser.phone || prev.phone || '',
        organization: currentUser.organization || currentUser.company || prev.organization || 'Individual / Organization',
        role: currentUser.designation || currentUser.role || prev.role || 'Professional',
      }));
    } else if (rawCourseId) {
      // Unauthenticated user attempting to enroll: redirect to login with return redirect
      const returnUrl = `/register?courseId=${encodeURIComponent(rawCourseId)}`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    } else {
      // Unauthenticated generic visitor: start from Step 1
      setStep(1);
    }
  }, [rawCourseId, navigate]);

  // 2. Resolve course from URL query parameter
  useEffect(() => {
    const cid = searchParams.get('courseId') || searchParams.get('course') || '';
    if (cid) {
      const matched = courses.find(
        (c) => c.id.toLowerCase() === cid.toLowerCase() || c.code?.toLowerCase() === cid.toLowerCase()
      );
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          selectedCourse: matched.id,
          selectedBatch: prev.selectedBatch || (matched.sessions?.[0]?.date || ''),
        }));
      }
    }
  }, [searchParams]);

  // 3. Resolve matched course object from state
  const selectedCourseDetails =
    courses.find(
      (c) =>
        formData.selectedCourse &&
        (c.id.toLowerCase() === formData.selectedCourse.toLowerCase() ||
          c.code?.toLowerCase() === formData.selectedCourse.toLowerCase())
    ) ||
    courses.find((c) => rawCourseId && c.id.toLowerCase() === rawCourseId.toLowerCase()) ||
    courses[0];

  // Check enrollment & availability statuses
  const isAlreadyEnrolled = user?.email && selectedCourseDetails
    ? isUserEnrolledInCourse(user.email, selectedCourseDetails.id)
    : false;

  const isClosed =
    selectedCourseDetails?.status === COURSE_STATUS.CLOSED ||
    selectedCourseDetails?.status === COURSE_STATUS.COMPLETED;

  const isUpcoming = selectedCourseDetails?.status === COURSE_STATUS.UPCOMING;

  const testAmountINR = selectedCourseDetails?.price || 4999;

  // Set default batch if unset
  useEffect(() => {
    if (selectedCourseDetails?.sessions?.[0]?.date && !formData.selectedBatch) {
      setFormData((prev) => ({
        ...prev,
        selectedBatch: selectedCourseDetails.sessions[0].date,
      }));
    }
  }, [selectedCourseDetails, formData.selectedBatch]);

  // OTP Countdown Timer (for standard unauthenticated registration)
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

  // Generate UPI payment URI for QR code
  const upiUri = `upi://pay?pa=deancc.sporic@vit.ac.in&pn=VIT-TEC%20SpoRIC&am=${testAmountINR}&cu=INR&tn=Enrollment%20${selectedCourseDetails?.id || 'Course'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;

  // Handle Razorpay Online Popup
  const handleRazorpayPopup = async () => {
    setLoading(true);
    setError('');

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        setLoading(false);
        setError('Could not connect to Razorpay SDK. Please use the UPI QR Code directly.');
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SPORIC2026';

      const options = {
        key: razorpayKey,
        amount: testAmountINR * 100, // in paise
        currency: 'INR',
        name: 'VIT Chennai • SpoRIC',
        description: `Enrollment: ${selectedCourseDetails.title}`,
        image: '/vit_logo.png',
        prefill: {
          name: formData.fullName || user?.name || '',
          email: email || user?.email || '',
          contact: formData.phone || user?.phone || '',
        },
        theme: {
          color: '#0B2A6F',
        },
        handler: async function (response) {
          const finalCourseId = selectedCourseDetails?.id || formData.selectedCourse;
          const userEmail = email || user?.email;
          if (userEmail && finalCourseId) {
            enrollUserInCourse(userEmail, finalCourseId);
          }
          setPaymentData({
            paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            orderId: response.razorpay_order_id || `order_${Date.now()}`,
            amount: testAmountINR,
            method: 'Razorpay Online Gateway',
            date: new Date().toLocaleDateString(),
          });
          setLoading(false);
          setStep(5);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setLoading(false);
        setError(`Payment was not completed: ${resp.error?.description || 'Transaction cancelled'}`);
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      setError(`Razorpay Gateway notice: ${err.message}. Please use the UPI QR code directly.`);
    }
  };

  // Confirm UPI QR payment
  const handleConfirmQrPayment = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const finalCourseId = selectedCourseDetails?.id || formData.selectedCourse;
      const userEmail = email || user?.email;
      if (userEmail && finalCourseId) {
        enrollUserInCourse(userEmail, finalCourseId);
      }
      const generatedPayId = utrNumber.trim()
        ? `upi_utr_${utrNumber.trim()}`
        : `upi_${Date.now().toString(36).toUpperCase()}`;
      setPaymentData({
        paymentId: generatedPayId,
        orderId: `ord_qr_${Date.now().toString(36)}`,
        amount: testAmountINR,
        method: 'UPI QR Scan (GPay / PhonePe / Paytm)',
        date: new Date().toLocaleDateString(),
      });
      setLoading(false);
      setStep(5);
    }, 800);
  };

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
            <span className="section-label">Corporate Enrolment &amp; Payment</span>
            <h1 className={styles.title}>APPLY / ENROL</h1>
            <p className={styles.subtitle}>
              Register for executive corporate training programs with live online payment checkout
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
                  <div className={`${styles.stepNode} ${step >= 1 ? styles.completedNode : ''}`}>
                    <span>✓</span>
                  </div>
                  <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ''}`} />
                  <div className={`${styles.stepNode} ${step >= 2 ? styles.completedNode : ''}`}>
                    <span>✓</span>
                  </div>
                  <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ''}`} />
                  <div className={`${styles.stepNode} ${step >= 3 ? styles.completedNode : ''}`}>
                    <span>✓</span>
                  </div>
                  <div className={`${styles.stepLine} ${styles.activeLine}`} />
                  <div className={`${styles.stepNode} ${styles.activeNode}`}>
                    <span>4</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* STEP 1: Enter Email (Only for unauthenticated generic registration) */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Register for VIT-TEC</h2>
                  <p className={styles.cardSubheading}>
                    Enter your work or personal email address to receive a secure verification OTP.
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
                  {loading ? 'Validating OTP...' : 'Verify Email Address'}
                </button>

                <div className={styles.otpFooter}>
                  {timer > 0 ? (
                    <span className={styles.timerText}>Resend code in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
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

            {/* STEP 3: Delegate & Company Info */}
            {step === 3 && (
              <form onSubmit={handleRegisterDetails} className={styles.form}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Delegate Information</h2>
                  <p className={styles.cardSubheading}>
                    Please provide your contact details for official certification and session scheduling.
                  </p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kannan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={styles.input}
                      autoFocus
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Phone Number *</label>
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

            {/* STEP 4: DIRECT ENROLLMENT & PAYMENT CHECKOUT */}
            {step === 4 && (
              <div>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Program &amp; Payment Checkout</h2>
                  <p className={styles.cardSubheading}>
                    Confirm your corporate training program details and complete online payment.
                  </p>
                </div>

                {/* Authenticated Profile Summary (Read-Only) */}
                {user && (
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    marginBottom: '1.25rem',
                    textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1D4ED8' }}>
                        Enrolling As
                      </span>
                      <Link to="/profile" style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: '700', textDecoration: 'none' }}>
                        Edit Profile ↗
                      </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.84rem' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Delegate Name</span>
                        <strong style={{ color: '#0F172A' }}>{formData.fullName || user.name || 'Delegate'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Email</span>
                        <span style={{ color: '#0F172A', fontWeight: '600' }}>{email || user.email}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Phone</span>
                        <span style={{ color: '#0F172A', fontWeight: '600' }}>{formData.phone || user.phone || '—'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Organization</span>
                        <span style={{ color: '#0F172A', fontWeight: '600' }}>{formData.organization || user.organization || user.company || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Handling: Already Enrolled / Closed / Upcoming */}
                {isAlreadyEnrolled ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px', margin: '1rem 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
                    <h3 style={{ color: '#166534', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                      You Are Already Enrolled!
                    </h3>
                    <p style={{ color: '#15803D', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      You have an active registration for <strong>{selectedCourseDetails.title}</strong> ({selectedCourseDetails.id}).
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Link to="/dashboard?tab=courses" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
                        Go to Student Dashboard →
                      </Link>
                      <Link to="/courses" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                        Browse More Courses
                      </Link>
                    </div>
                  </div>
                ) : isClosed ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '14px', margin: '1rem 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏰</div>
                    <h3 style={{ color: '#991B1B', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                      Registration Closed
                    </h3>
                    <p style={{ color: '#B91C1C', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      Registration is currently closed for <strong>{selectedCourseDetails.title}</strong> ({selectedCourseDetails.id}).
                    </p>
                    <Link to="/courses" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
                      Explore Available Courses →
                    </Link>
                  </div>
                ) : isUpcoming ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', margin: '1rem 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗓️</div>
                    <h3 style={{ color: '#92400E', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                      Upcoming Cohort
                    </h3>
                    <p style={{ color: '#B45309', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      Enrollment for <strong>{selectedCourseDetails.title}</strong> ({selectedCourseDetails.id}) will open soon.
                    </p>
                    <Link to="/courses" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
                      Browse Open Programs →
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Course Selection Dropdown */}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Select Corporate Training Program *</label>
                      <select
                        value={selectedCourseDetails.id}
                        onChange={(e) =>
                          setFormData({ ...formData, selectedCourse: e.target.value, selectedBatch: '' })
                        }
                        className={styles.select}
                        required
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            [{c.id}] {c.title} ({c.hours} Hours)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preselected Course Summary Banner */}
                    <div style={{
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      margin: '1rem 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                    }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: '#1D4ED8', display: 'block' }}>
                          {selectedCourseDetails.domain} • {selectedCourseDetails.category}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>
                          {selectedCourseDetails.title}
                        </strong>
                      </div>
                      <span className="tag tag-cyan" style={{ fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {selectedCourseDetails.hours} Hours
                      </span>
                    </div>

                    {/* Batch Selection */}
                    {selectedCourseDetails && (
                      <div className={styles.inputGroup} style={{ marginTop: '0.5rem' }}>
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

                    {/* Payment Mode Selection */}
                    <div style={{ marginTop: '1.25rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                      <label className={styles.label} style={{ marginBottom: '0.75rem', display: 'block' }}>
                        Choose Payment Method
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('qr')}
                          className={paymentMethod === 'qr' ? styles.activeBatch : styles.batchItem}
                          style={{ justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem' }}
                        >
                          📱 UPI QR Scan (Instant)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('razorpay')}
                          className={paymentMethod === 'razorpay' ? styles.activeBatch : styles.batchItem}
                          style={{ justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem' }}
                        >
                          💳 Online Card / NetBanking
                        </button>
                      </div>

                      {/* Payment Method 1: UPI QR Scanner */}
                      {paymentMethod === 'qr' && (
                        <form onSubmit={handleConfirmQrPayment} className={styles.form}>
                          <div style={{ textAlign: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                            <img
                              src={qrCodeUrl}
                              alt="Scan UPI QR Code to Pay"
                              style={{ width: '180px', height: '180px', margin: '0 auto', display: 'block', borderRadius: '8px' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem', marginBottom: 0 }}>
                              Scan with GPay, PhonePe, Paytm, or BHIM UPI
                            </p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B2A6F', marginTop: '0.25rem' }}>
                              Fee: ₹{testAmountINR}
                            </p>
                          </div>

                          <div className={styles.inputGroup} style={{ marginTop: '0.75rem' }}>
                            <label className={styles.label}>UPI Transaction UTR Number (Optional for Demo)</label>
                            <input
                              type="text"
                              placeholder="e.g. 423985729183"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              className={styles.input}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className={`btn btn-primary ${styles.submitBtn}`}
                          >
                            {loading ? 'Confirming Enrollment...' : '✓ Confirm Enrollment (₹' + testAmountINR + ')'}
                          </button>
                        </form>
                      )}

                      {/* Payment Method 2: Razorpay */}
                      {paymentMethod === 'razorpay' && (
                        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
                            Pay securely via Credit/Debit Cards, Net Banking, or Corporate Wallets.
                          </p>
                          <button
                            type="button"
                            onClick={handleRazorpayPopup}
                            disabled={loading}
                            className={`btn btn-primary ${styles.submitBtn}`}
                            style={{ maxWidth: '320px', margin: '0 auto' }}
                          >
                            {loading ? 'Opening Gateway...' : '🚀 Open Payment Gateway (₹' + testAmountINR + ')'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 5: Success Receipt with Payment Reference ID */}
            {step === 5 && (
              <div className={styles.successBlock}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.cardHeading}>Enrolment &amp; Payment Confirmed!</h2>
                <p className={styles.cardSubheading}>
                  Thank you, <strong>{formData.fullName || user?.name || 'Delegate'}</strong>. Your payment was verified and your corporate training reservation is confirmed with SpoRIC.
                </p>

                <div className={styles.receipt}>
                  <div className={styles.receiptRow}>
                    <span>Payment Reference ID:</span>
                    <strong style={{ color: '#1D4ED8', fontFamily: 'monospace' }}>{paymentData?.paymentId || 'pay_verified'}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Payment Mode:</span>
                    <strong style={{ color: '#0B2A6F' }}>{paymentData?.method || 'Online Payment'}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Amount Paid:</span>
                    <strong style={{ color: '#166534' }}>₹{paymentData?.amount || testAmountINR} (Verified)</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Delegate / Contact:</span>
                    <strong>{formData.fullName || user?.name} ({email || user?.email})</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Organization:</span>
                    <strong>{formData.organization || user?.organization || user?.company}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Selected Program:</span>
                    <strong>{selectedCourseDetails?.title || 'Corporate Training Program'}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Cohort Batch:</span>
                    <strong style={{ color: '#0B2A6F' }}>
                      {formData.selectedBatch || 'Scheduled as per Proposal'}
                    </strong>
                  </div>
                </div>

                <p className={styles.finalInstruction}>
                  An automated payment receipt and onboarding package have been dispatched to <strong>{email || user?.email}</strong>.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <Link
                    to="/dashboard?tab=courses"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Go to Student Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className="btn btn-secondary"
                    style={{ flex: 1, textAlign: 'center', padding: '0.85rem' }}
                  >
                    Explore More Courses
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
