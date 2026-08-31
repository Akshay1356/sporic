import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import styles from './Login.module.css';
import api from '../services/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') || 'student').toLowerCase();
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'student' | 'faculty' | 'admin'
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
    if (selectedRole === 'faculty') return 'Professor / Faculty';
    return 'Student & Professional';
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
      setError(err.message || 'Login failed. Please verify credentials and role.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');

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
      <div className="grid-bg" style={{ opacity: 0.5 }} />

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - var(--nav-height))', padding: '2rem 0' }}>
        <GlassCard glow className={styles.formCard} padding="xl">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', background: '#F5F5F5', border: '1px solid #E5E5E5', borderRadius: '4px', color: '#111111' }}>
              {getRoleLabel()} Portal
            </span>
            <h2 className={styles.title} style={{ marginTop: '0.75rem' }}>Sign In to VIT-TEC</h2>
            <p className={styles.subtitle}>Select your academic role portal to access your personalized dashboard.</p>
          </div>

          {/* 3 Dedicated Role Portal Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#FAFAFA', padding: '4px', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setOtpSent(false); setError(''); setInfoMessage(''); }}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: selectedRole === 'student' ? '#000000' : 'transparent', color: selectedRole === 'student' ? '#FFFFFF' : '#555555', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('faculty'); setOtpSent(false); setError(''); setInfoMessage(''); }}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: selectedRole === 'faculty' ? '#000000' : 'transparent', color: selectedRole === 'faculty' ? '#FFFFFF' : '#555555', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Professor / Faculty
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setOtpSent(false); setError(''); setInfoMessage(''); }}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: selectedRole === 'admin' ? '#000000' : 'transparent', color: selectedRole === 'admin' ? '#FFFFFF' : '#555555', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Admin
            </button>
          </div>

          {/* Auth Method Switcher */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E5E5E5', marginBottom: '1.25rem', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setError(''); setInfoMessage(''); }}
              style={{ paddingBottom: '4px', fontWeight: authMode === 'password' ? 700 : 500, color: authMode === 'password' ? '#000000' : '#888888', borderBottom: authMode === 'password' ? '2px solid #000000' : 'none', cursor: 'pointer' }}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setError(''); setInfoMessage(''); }}
              style={{ paddingBottom: '4px', fontWeight: authMode === 'otp' ? 700 : 500, color: authMode === 'otp' ? '#000000' : '#888888', borderBottom: authMode === 'otp' ? '2px solid #000000' : 'none', cursor: 'pointer' }}
            >
              Email OTP Login
            </button>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}
          {infoMessage && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{infoMessage}</div>}

          {authMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  {selectedRole === 'admin' ? 'Admin Email' : selectedRole === 'faculty' ? 'Faculty Institutional Email' : 'Student Email'}
                </label>
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'admin' ? 'admin@vit.ac.in' : selectedRole === 'faculty' ? 'faculty@vit.ac.in' : 'student1@vit.ac.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
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

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                {loading ? 'Signing In...' : `Sign In as ${selectedRole === 'admin' ? 'Administrator' : selectedRole === 'faculty' ? 'Faculty' : 'Student'}`}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  {selectedRole === 'admin' ? 'Admin Email' : selectedRole === 'faculty' ? 'Faculty Institutional Email' : 'Student Email'}
                </label>
                <input
                  type="email"
                  required
                  disabled={otpSent && timer > 0}
                  placeholder={selectedRole === 'admin' ? 'admin@vit.ac.in' : selectedRole === 'faculty' ? 'faculty@vit.ac.in' : 'student1@vit.ac.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>

              {otpSent && (
                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label}>Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={styles.input}
                    style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}
                  />
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                {loading ? 'Processing...' : otpSent ? 'Verify & Sign In' : 'Send Verification OTP'}
              </button>

              {otpSent && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.82rem' }}>
                  {timer > 0 ? (
                    <span style={{ color: '#888888' }}>Resend in {timer}s</span>
                  ) : (
                    <button type="button" onClick={handleSendOtp} style={{ color: '#000000', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                      Resend OTP Code
                    </button>
                  )}
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} style={{ color: '#666666', cursor: 'pointer' }}>
                    Change Email
                  </button>
                </div>
              )}
            </form>
          )}

          <p className={styles.signupPrompt} style={{ marginTop: '1.5rem', borderTop: '1px solid #EEEEEE', paddingTop: '1rem' }}>
            New to VIT-TEC? <Link to="/register">Create an account</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
