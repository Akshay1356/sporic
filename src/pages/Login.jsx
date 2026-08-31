import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Login.module.css';
import api from '../services/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') === 'admin' ? 'admin' : 'industry');
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'industry' | 'admin'
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const getRoleLabel = () => {
    if (selectedRole === 'admin') return 'Administrator';
    return 'Industries & Corporates';
  };

  const getExpectedRole = () => {
    if (selectedRole === 'admin') return 'ADMIN';
    return 'STUDENT';
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please enter both email and password.');

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const data = await api.login(email, password, getExpectedRole());
      setLoading(false);
      if (data.user) {
        localStorage.setItem('sporic_user', JSON.stringify(data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials and portal role.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your registered email address.');

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const data = await api.sendOtp(email, 'LOGIN');
      setLoading(false);
      setOtpSent(true);
      setTimer(60);
      setInfoMessage(
        data.otpPreview
          ? `${data.message} (Test Code: ${data.otpPreview})`
          : data.message || `A verification OTP has been dispatched to ${email}`
      );
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch verification code.');
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!email || !otp) return setError('Please enter both email and the 6-digit OTP code.');

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const data = await api.loginWithOtp(email, otp, getExpectedRole());
      setLoading(false);
      if (data.user) {
        localStorage.setItem('sporic_user', JSON.stringify(data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid or expired OTP verification code.');
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-label">Authenticated Access</span>
            <h1 className={styles.title}>SIGN IN</h1>
            <p className={styles.subtitle}>
              Access your corporate training dashboard and institutional records
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Login Form Container */}
      <section className={styles.formSection}>
        <div className="container">
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Role Header Badge */}
            <div className={styles.roleHeader}>
              <span className={styles.roleBadge}>
                {getRoleLabel()} Portal
              </span>
              <h2 className={styles.cardTitle}>Sign In to VIT-TEC</h2>
              <p className={styles.cardSubtitle}>
                Select your portal role to access your executive and training management dashboard.
              </p>
            </div>

            {/* 2 Dedicated Role Tabs: Industries & Admin */}
            <div className={styles.roleTabs} role="tablist" aria-label="Sign-in role selection">
              <button
                type="button"
                role="tab"
                aria-selected={selectedRole === 'industry'}
                onClick={() => {
                  setSelectedRole('industry');
                  setOtpSent(false);
                  setError('');
                  setInfoMessage('');
                }}
                className={`${styles.roleTabBtn} ${selectedRole === 'industry' ? styles.activeRoleTab : ''}`}
              >
                🏢 Industries & Corporates
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedRole === 'admin'}
                onClick={() => {
                  setSelectedRole('admin');
                  setOtpSent(false);
                  setError('');
                  setInfoMessage('');
                }}
                className={`${styles.roleTabBtn} ${selectedRole === 'admin' ? styles.activeRoleTab : ''}`}
              >
                🛡️ Admin Portal
              </button>
            </div>

            {/* Auth Method Switcher */}
            <div className={styles.authModeTabs}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setError('');
                  setInfoMessage('');
                }}
                className={`${styles.authModeBtn} ${authMode === 'password' ? styles.activeAuthMode : ''}`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setError('');
                  setInfoMessage('');
                }}
                className={`${styles.authModeBtn} ${authMode === 'otp' ? styles.activeAuthMode : ''}`}
              >
                Email OTP Login
              </button>
            </div>

            {/* Error / Success Feedback */}
            {error && <div className={styles.errorBanner}>{error}</div>}
            {infoMessage && <div className={styles.successBanner}>{infoMessage}</div>}

            {/* Forms */}
            {authMode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    {selectedRole === 'admin' ? 'Admin Institutional Email' : 'Corporate / Industry Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={selectedRole === 'admin' ? 'admin@vit.ac.in' : 'corporate@industry.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Signing In...' : `Sign In as ${selectedRole === 'admin' ? 'Administrator' : 'Industry Partner'}`}
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    {selectedRole === 'admin' ? 'Admin Institutional Email' : 'Corporate / Industry Email'}
                  </label>
                  <input
                    type="email"
                    required
                    disabled={otpSent && timer > 0}
                    placeholder={selectedRole === 'admin' ? 'admin@vit.ac.in' : 'corporate@industry.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                {otpSent && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength="6"
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className={`${styles.input} ${styles.otpInput}`}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Processing...' : otpSent ? 'Verify & Sign In' : 'Send Verification OTP'}
                </button>

                {otpSent && (
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
                        setOtpSent(false);
                        setOtp('');
                      }}
                      className={styles.changeEmailBtn}
                    >
                      Change Email
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Signup / Inquiry Prompt */}
            <div className={styles.signupPrompt}>
              <span>Looking for custom corporate training programs?</span>{' '}
              <Link to="/contact">Request Proposal</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
