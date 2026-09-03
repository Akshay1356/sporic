import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courses, enrollUserInCourse } from '../data/courses';
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
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || searchParams.get('course') || '';

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

  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' | 'razorpay'
  const [paymentData, setPaymentData] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync course from URL query parameters dynamically
  useEffect(() => {
    const cid = searchParams.get('courseId') || searchParams.get('course') || '';
    if (cid) {
      const matched = courses.find((c) => c.id.toLowerCase() === cid.toLowerCase() || c.code?.toLowerCase() === cid.toLowerCase());
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          selectedCourse: matched.id,
          selectedBatch: prev.selectedBatch || (matched.sessions?.[0]?.date || ''),
        }));
      }
    }
  }, [searchParams]);

  // Pre-fill logged-in user credentials if available
  useEffect(() => {
    const stored = localStorage.getItem('sporic_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u?.email) {
          setEmail((prev) => prev || u.email);
          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || u.fullName || u.name || '',
            phone: prev.phone || u.phone || '',
            organization: prev.organization || u.organization || u.company || '',
            role: prev.role || u.designation || '',
          }));
        }
      } catch {
        // ignore
      }
    }
  }, []);

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

  const selectedCourseDetails = courses.find((c) => c.id === formData.selectedCourse) || courses[0];
  const testAmountINR = selectedCourseDetails?.price || 1;

  // Generate UPI payment URI for QR code
  const upiUri = `upi://pay?pa=deancc.sporic@vit.ac.in&pn=VIT-TEC%20SpoRIC&am=${testAmountINR}&cu=INR&tn=Enrollment%20${formData.selectedCourse || 'Course'}`;
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
          name: formData.fullName,
          email: email,
          contact: formData.phone,
        },
        theme: {
          color: '#0B2A6F',
        },
        handler: async function (response) {
          const finalCourseId = formData.selectedCourse || selectedCourseDetails?.id;
          if (email && finalCourseId) {
            enrollUserInCourse(email, finalCourseId);
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
      const finalCourseId = formData.selectedCourse || selectedCourseDetails?.id;
      if (email && finalCourseId) {
        enrollUserInCourse(email, finalCourseId);
      }
      const generatedPayId = utrNumber.trim() ? `upi_utr_${utrNumber.trim()}` : `upi_${Date.now().toString(36).toUpperCase()}`;
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
            <span className="section-label">Corporate Enrolment & Payment</span>
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
                    Enter your work or personal email address to receive a secure verification OTP.
                  </p>
                </div>

                {/* Selected Course Summary Preview */}
                {selectedCourseDetails && formData.selectedCourse && (
                  <div style={{
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#1D4ED8',
                        display: 'block',
                        marginBottom: '0.2rem',
                      }}>
                        Selected Program • {selectedCourseDetails.id}
                      </span>
                      <h4 style={{ fontSize: '0.92rem', color: '#0F172A', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>
                        {selectedCourseDetails.title}
                      </h4>
                    </div>
                    <span className="tag tag-cyan" style={{ fontSize: '0.72rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {selectedCourseDetails.hours} Hours
                    </span>
                  </div>
                )}

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

            {/* STEP 4: Program Selection & LIVE UPI QR / RAZORPAY PAYMENT */}
            {step === 4 && (
              <div>
                <div className={styles.stepHeader}>
                  <h2 className={styles.cardHeading}>Program & Payment Checkout</h2>
                  <p className={styles.cardSubheading}>
                    Select your corporate training program and scan the QR code to complete payment.
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
                  <>
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

                    {/* Price & Plan Banner */}
                    <div style={{ background: '#EFF6FF', border: '1.5px solid #DBEAFE', borderRadius: '12px', padding: '1.2rem', margin: '1.25rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0B2A6F', fontSize: '1.05rem' }}>
                            {selectedCourseDetails.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#667085' }}>
                            {selectedCourseDetails.hours} Hours • SpoRIC Certification Included
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: '#98A2B3', textDecoration: 'line-through' }}>₹4,999</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1D4ED8' }}>₹{testAmountINR}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#166534', background: '#DCFCE7', padding: '0.35rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                        ⚡ Testing Sandbox Mode: Program cost reduced to ₹{testAmountINR} for live verification.
                      </div>
                    </div>

                    {/* Payment Mode Selector Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qr')}
                        style={{
                          flex: 1,
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          border: paymentMethod === 'qr' ? '2px solid #0B2A6F' : '1px solid #D0D5DD',
                          background: paymentMethod === 'qr' ? '#F0F4FF' : '#FFFFFF',
                          color: paymentMethod === 'qr' ? '#0B2A6F' : '#344054',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        📱 Instant UPI QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('razorpay')}
                        style={{
                          flex: 1,
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          border: paymentMethod === 'razorpay' ? '2px solid #0B2A6F' : '1px solid #D0D5DD',
                          background: paymentMethod === 'razorpay' ? '#F0F4FF' : '#FFFFFF',
                          color: paymentMethod === 'razorpay' ? '#0B2A6F' : '#344054',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        💳 Razorpay Gateway (Cards/NetBanking)
                      </button>
                    </div>

                    {/* METHOD 1: LIVE VISIBLE UPI QR CODE */}
                    {paymentMethod === 'qr' && (
                      <form onSubmit={handleConfirmQrPayment} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B2A6F', marginBottom: '0.25rem' }}>
                          Scan to Pay ₹{testAmountINR} with any UPI App
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
                          Google Pay • PhonePe • Paytm • BHIM UPI • CRED
                        </div>

                        {/* Visible QR Image */}
                        <div style={{ display: 'inline-block', padding: '10px', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
                          <img
                            src={qrCodeUrl}
                            alt="UPI Payment QR Code"
                            style={{ width: '220px', height: '220px', display: 'block', margin: '0 auto' }}
                          />
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1rem' }}>
                          UPI ID: <strong style={{ color: '#0B2A6F' }}>deancc.sporic@vit.ac.in</strong>
                        </div>

                        <div className={styles.inputGroup} style={{ maxWidth: '340px', margin: '0 auto 1.25rem auto', textAlign: 'left' }}>
                          <label className={styles.label} style={{ fontSize: '0.8rem' }}>UPI Reference / UTR Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. 423589021948"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            className={styles.input}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className={`btn btn-primary ${styles.submitBtn}`}
                          style={{ maxWidth: '340px', margin: '0 auto', background: '#16A34A', borderColor: '#16A34A' }}
                        >
                          {loading ? 'Verifying Transaction...' : '✓ I Have Paid ₹' + testAmountINR + ' — Confirm Enrolment'}
                        </button>
                      </form>
                    )}

                    {/* METHOD 2: RAZORPAY POPUP GATEWAY */}
                    {paymentMethod === 'razorpay' && (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B2A6F', marginBottom: '0.5rem' }}>
                          Razorpay Secure Checkout
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                          Pay seamlessly via Debit/Credit Cards, Net Banking, or Razorpay Wallets with 256-bit encryption.
                        </p>

                        <button
                          type="button"
                          onClick={handleRazorpayPopup}
                          disabled={loading}
                          className={`btn btn-primary ${styles.submitBtn}`}
                          style={{ maxWidth: '320px', margin: '0 auto', background: '#0B2A6F' }}
                        >
                          {loading ? 'Opening Razorpay Modal...' : '🚀 Open Razorpay Popup (₹' + testAmountINR + ')'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 5: Success Receipt with Payment ID */}
            {step === 5 && (
              <div className={styles.successBlock}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.cardHeading}>Enrolment & Payment Confirmed!</h2>
                <p className={styles.cardSubheading}>
                  Thank you, <strong>{formData.fullName}</strong>. Your payment was verified and your corporate training reservation is confirmed with SpoRIC.
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
                    <strong>{formData.fullName} ({email})</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Organization:</span>
                    <strong>{formData.organization}</strong>
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
                  An automated payment receipt and onboarding package have been emailed to <strong>{email}</strong>.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <Link
                    to="/dashboard"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Go to Student Dashboard
                  </Link>
                  <Link
                    to="/technology"
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
