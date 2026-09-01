import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Login.module.css';
import api from '../services/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : (searchParams.get('role') === 'faculty' ? 'faculty' : 'industry');

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'industry' | 'faculty' | 'admin'
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regRole, setRegRole] = useState('STUDENT');

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
    if (selectedRole === 'faculty') return 'Faculty Researcher';
    return 'Industries & Students';
  };

  const getExpectedRole = () => {
    if (selectedRole === 'admin') return 'ADMIN';
    if (selectedRole === 'faculty') return 'FACULTY';
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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      return setError('Please fill in your Name, Email, and Password.');
    }
    if (regPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const assignedRole = selectedRole === 'admin' ? 'ADMIN' : (selectedRole === 'faculty' ? 'FACULTY' : regRole);

      const regData = await api.register({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        organization: regOrg || 'VIT / Corporate Partner',
        role: assignedRole,
      });

      setLoading(false);
      if (regData.user) {
        localStorage.setItem('sporic_user', JSON.stringify(regData.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Account registration failed. Please try again.');
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
        data?.otpPreview
          ? `${data?.message || 'Verification code sent'} (Preview Code: ${data.otpPreview})`
          : data?.message || `A verification OTP has been dispatched to ${email}`
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
            <span className="section-label">Authenticated Portal Access</span>
            <h1 className={styles.title}>{activeTab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</h1>
            <p className={styles.subtitle}>
              Access your corporate training dashboard, course records, and research management
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
            {/* Top Switcher: Sign In vs Create Account */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EAECF0', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                  setInfoMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  color: activeTab === 'login' ? '#0B2A6F' : '#667085',
                  borderBottom: activeTab === 'login' ? '3px solid #0B2A6F' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                🔑 Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                  setInfoMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  background: 'none',
                  color: activeTab === 'register' ? '#0B2A6F' : '#667085',
                  borderBottom: activeTab === 'register' ? '3px solid #0B2A6F' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                ✨ Create Account
              </button>
            </div>

            {/* Role Header Badge */}
            <div className={styles.roleHeader}>
              <span className={styles.roleBadge}>
                {getRoleLabel()} Portal
              </span>
              <h2 className={styles.cardTitle}>
                {activeTab === 'login' ? `Sign In to VIT-TEC` : `Register for VIT-TEC`}
              </h2>
              <p className={styles.cardSubtitle}>
                Select your portal role to access your personalized training dashboard.
              </p>
            </div>

            {/* 3 Dedicated Role Tabs: Industries, Faculty & Admin */}
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
                🏢 Student & Corporate
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedRole === 'faculty'}
                onClick={() => {
                  setSelectedRole('faculty');
                  setOtpSent(false);
                  setError('');
                  setInfoMessage('');
                }}
                className={`${styles.roleTabBtn} ${selectedRole === 'faculty' ? styles.activeRoleTab : ''}`}
              >
                🎓 Faculty Portal
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

            {/* Error / Success Feedback */}
            {error && <div className={styles.errorBanner}>{error}</div>}
            {infoMessage && <div className={styles.successBanner}>{infoMessage}</div>}

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'login' && (
              <>
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

                {authMode === 'password' ? (
                  <form onSubmit={handlePasswordLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        {selectedRole === 'admin'
                          ? 'Admin Institutional Email'
                          : selectedRole === 'faculty'
                          ? 'Faculty Email Address'
                          : 'Corporate / Student Email'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={
                          selectedRole === 'admin'
                            ? 'admin.sporic@vit.ac.in'
                            : selectedRole === 'faculty'
                            ? 'faculty.sporic@vit.ac.in'
                            : 'name@company.com'
                        }
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
                      {loading ? 'Signing In...' : `Sign In as ${getRoleLabel()}`}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        {selectedRole === 'admin'
                          ? 'Admin Institutional Email'
                          : selectedRole === 'faculty'
                          ? 'Faculty Email Address'
                          : 'Corporate / Student Email'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="user@vit.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        disabled={otpSent}
                      />
                    </div>

                    {otpSent && (
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>6-Digit OTP Code</label>
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
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn btn-primary ${styles.submitBtn}`}
                    >
                      {loading ? 'Processing...' : otpSent ? 'Verify OTP & Sign In' : 'Send Verification OTP'}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: CREATE NEW ACCOUNT FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleCreateAccount} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company / Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. Lucas TVS / L&T / VIT"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Creating Account...' : '✨ Create Account & Go to Dashboard'}
                </button>
              </form>
            )}

            {/* Portal Footer Notice */}
            <div className={styles.formFooter}>
              <p className={styles.hintText}>
                🔐 <strong>Institutional Credentials</strong>:
                <br />
                • Admin: <code>admin.sporic@vit.ac.in</code> | Pass: <code>Admin@VIT2026</code>
                <br />
                • Faculty: <code>faculty.sporic@vit.ac.in</code> | Pass: <code>Faculty@VIT2026</code>
                <br />
                • Or register any personal/work email above to create your own account.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
