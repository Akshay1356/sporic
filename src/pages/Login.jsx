import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Login.module.css';
import api from '../services/api';

// Standard designation options
const DESIGNATION_OPTIONS = [
  'Senior Manager / Director',
  'Corporate Executive',
  'Software Engineer / IT Specialist',
  'Industrial / Manufacturing Engineer',
  'R&D Scientist / Researcher',
  'Student / Scholar',
  'Faculty / Academician',
  'Independent Consultant',
  'Other',
];

// Industry sector options
const INDUSTRY_SECTOR_OPTIONS = [
  'Automotive & Manufacturing',
  'Information Technology & AI',
  'Electronics & Semiconductors',
  'Energy, EV & Power Systems',
  'Healthcare & Biomedical',
  'Aerospace & Defense',
  'Financial Services & Fintech',
  'Education & Research',
  'Other',
];

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Role query param: 'admin' or 'student_corporate' (default)
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'student_corporate';
  const initialTab = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectTo = searchParams.get('redirect') || '';

  // Account Type Selection: 'student_corporate' | 'admin'
  const [accountType, setAccountType] = useState(initialRole);

  // Student/Corporate Sub-mode: 'login' | 'register' | 'forgot_password'
  const [subMode, setSubMode] = useState(initialTab);

  // Registration Multi-Step: 1 (Email) -> 2 (Password) -> 3 (OTP) -> 4 (Profile)
  const [regStep, setRegStep] = useState(1);

  // Registration Form State
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regOtpPreview, setRegOtpPreview] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDesignation, setRegDesignation] = useState('Senior Manager / Director');
  const [regCustomDesignation, setRegCustomDesignation] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regIndustry, setRegIndustry] = useState('Automotive & Manufacturing');

  // Returning Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Login Form State
  const [adminAuthMode, setAdminAuthMode] = useState('password'); // 'password' | 'otp'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminOtpPreview, setAdminOtpPreview] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 (Email) -> 2 (OTP & New Password)

  // Timer & UI Feedback
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Reset errors when switching modes or account types
  const handleSelectAccountType = (type) => {
    setAccountType(type);
    setError('');
    setInfoMessage('');
    setRegStep(1);
    setSubMode('login');
  };

  // Password validation rules
  const passwordRules = {
    hasLength: regPassword.length >= 8,
    hasUpper: /[A-Z]/.test(regPassword),
    hasLower: /[a-z]/.test(regPassword),
    hasNumber: /[0-9]/.test(regPassword),
  };
  const isPasswordValid =
    passwordRules.hasLength &&
    passwordRules.hasUpper &&
    passwordRules.hasLower &&
    passwordRules.hasNumber;

  // ====================================================
  // 1. STUDENT & CORPORATE: RETURNING LOGIN
  // ====================================================
  const handleStudentCorporateLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      return setError('Please enter both your email address and password.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Authenticating your credentials...');

    try {
      const data = await api.login(loginEmail, loginPassword, 'STUDENT');
      const loggedUser = data.user;
      setInfoMessage('✓ Authentication successful! Loading your profile...');

      setTimeout(() => {
        setLoading(false);
        if (redirectTo) {
          navigate(redirectTo);
        } else if (!loggedUser?.phone || !loggedUser?.designation) {
          navigate('/profile');
        } else {
          navigate('/courses');
        }
      }, 600);
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Login failed. Please verify your email and password.');
    }
  };

  // ====================================================
  // 2. STUDENT & CORPORATE: REGISTRATION STEP 1 (EMAIL)
  // ====================================================
  const handleRegStep1Email = async (e) => {
    e.preventDefault();
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return setError('Please enter a valid email address.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Checking email availability...');

    try {
      const checkRes = await api.checkEmailExists(cleanEmail);
      setLoading(false);
      setInfoMessage('');

      if (checkRes.exists) {
        return setError(
          'An account already exists with this email address. Please sign in.'
        );
      }

      // Email is unique -> Proceed to Step 2 (Password creation)
      setRegStep(2);
    } catch {
      setLoading(false);
      setInfoMessage('');
      // Continue to password creation
      setRegStep(2);
    }
  };

  // ====================================================
  // 3. STUDENT & CORPORATE: REGISTRATION STEP 2 (PASSWORD)
  // ====================================================
  const handleRegStep2Password = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      return setError('Please meet all the required password security criteria.');
    }
    if (regPassword !== regConfirmPassword) {
      return setError('Passwords do not match. Please re-confirm your password.');
    }

    setLoading(true);
    setError('');
    setInfoMessage(`Sending verification OTP to ${regEmail}...`);

    try {
      const otpRes = await api.sendOtp(regEmail, 'REGISTER');
      setLoading(false);
      setInfoMessage(
        otpRes.otpPreview
          ? `✓ 6-digit verification code sent to ${regEmail} (Test Code: ${otpRes.otpPreview})`
          : `✓ 6-digit verification code sent to ${regEmail}`
      );
      if (otpRes.otpPreview) {
        setRegOtpPreview(otpRes.otpPreview);
      }
      setTimer(60);
      setRegStep(3); // Proceed to OTP verification step
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Failed to send verification code. Please try again.');
    }
  };

  // ====================================================
  // 4. STUDENT & CORPORATE: REGISTRATION STEP 3 (OTP)
  // ====================================================
  const handleRegStep3Otp = async (e) => {
    e.preventDefault();
    if (!regOtp.trim() || regOtp.trim().length < 6) {
      return setError('Please enter the complete 6-digit verification code.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Verifying code...');

    try {
      await api.verifyOtp(regEmail, regOtp.trim(), 'REGISTER');
      setLoading(false);
      setInfoMessage('✓ Email successfully verified! Please complete your profile.');
      setRegStep(4); // Proceed to Profile details
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Invalid or expired OTP code. Please check your email.');
    }
  };

  const handleResendRegOtp = async () => {
    if (timer > 0) return;
    setError('');
    setInfoMessage(`Resending verification code to ${regEmail}...`);

    try {
      const otpRes = await api.sendOtp(regEmail, 'REGISTER');
      setTimer(60);
      setInfoMessage(
        otpRes.otpPreview
          ? `✓ New verification code sent to ${regEmail} (Test Code: ${otpRes.otpPreview})`
          : `✓ New verification code sent to ${regEmail}`
      );
      if (otpRes.otpPreview) {
        setRegOtpPreview(otpRes.otpPreview);
      }
    } catch (err) {
      setError(err.message || 'Could not resend OTP. Please wait and try again.');
    }
  };

  // ====================================================
  // 5. STUDENT & CORPORATE: REGISTRATION STEP 4 (PROFILE)
  // ====================================================
  const handleRegStep4Profile = async (e) => {
    e.preventDefault();
    if (!regFullName.trim()) return setError('Please enter your full name.');
    if (!regPhone.trim()) return setError('Please enter your contact phone number.');

    const finalDesignation =
      regDesignation === 'Other'
        ? regCustomDesignation.trim() || 'Professional'
        : regDesignation;

    setLoading(true);
    setError('');
    setInfoMessage('Creating your verified account and storing profile...');

    try {
      const registrationPayload = {
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        fullName: regFullName.trim(),
        phone: regPhone.trim(),
        designation: finalDesignation,
        organization: regCompany.trim() || 'Individual / Organization',
        company: regCompany.trim() || 'Individual / Organization',
        industrySector: regIndustry,
        role: 'STUDENT',
        emailVerified: true,
      };

      const regRes = await api.register(registrationPayload);
      setInfoMessage('✓ Account created successfully! Redirecting...');

      setTimeout(() => {
        setLoading(false);
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/courses');
        }
      }, 700);
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // ====================================================
  // 6. FORGOT PASSWORD FLOW
  // ====================================================
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return setError('Please enter your registered email address.');

    setLoading(true);
    setError('');
    setInfoMessage('Dispatching password reset code...');

    try {
      const res = await api.sendOtp(forgotEmail, 'RESET_PASSWORD');
      setLoading(false);
      setTimer(60);
      setInfoMessage(
        res.otpPreview
          ? `✓ Reset OTP dispatched to ${forgotEmail} (Test Code: ${res.otpPreview})`
          : `✓ Reset OTP dispatched to ${forgotEmail}`
      );
      setForgotStep(2);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch reset code.');
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    if (!forgotOtp.trim() || forgotOtp.trim().length < 6) {
      return setError('Please enter the 6-digit OTP.');
    }
    if (!forgotNewPassword || forgotNewPassword.length < 8) {
      return setError('New password must be at least 8 characters long.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Updating password...');

    try {
      await api.resetPasswordWithOtp(forgotEmail, forgotOtp.trim(), forgotNewPassword);
      setLoading(false);
      setInfoMessage('✓ Password reset successfully! You can now log in.');
      setTimeout(() => {
        setSubMode('login');
        setLoginEmail(forgotEmail);
        setForgotStep(1);
        setForgotEmail('');
        setForgotOtp('');
        setForgotNewPassword('');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Password reset failed.');
    }
  };

  // ====================================================
  // 7. ADMIN AUTHENTICATION
  // ====================================================
  const handleAdminPasswordLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      return setError('Please enter administrator email and password.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Verifying administrative access clearance...');

    try {
      const data = await api.login(adminEmail, adminPassword, 'ADMIN');
      if (data.user?.role !== 'ADMIN') {
        throw new Error('Account does not possess Administrator clearance.');
      }
      setInfoMessage('✓ Administrative clearance verified. Opening Dashboard...');
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Admin authentication failed.');
    }
  };

  const handleAdminSendOtp = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim()) return setError('Please enter administrator email.');

    setLoading(true);
    setError('');
    setInfoMessage('Sending Administrator security code...');

    try {
      const data = await api.sendOtp(adminEmail, 'ADMIN_LOGIN');
      setLoading(false);
      setAdminOtpSent(true);
      setTimer(60);
      setInfoMessage(
        data.otpPreview
          ? `✓ Code sent to ${adminEmail} (Test Code: ${data.otpPreview})`
          : `✓ Code sent to ${adminEmail}`
      );
      if (data.otpPreview) {
        setAdminOtpPreview(data.otpPreview);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch security code.');
    }
  };

  const handleAdminOtpLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminOtp.trim()) {
      return setError('Please enter both administrator email and the 6-digit OTP.');
    }

    setLoading(true);
    setError('');
    setInfoMessage('Verifying Administrative OTP clearance...');

    try {
      const data = await api.loginWithOtp(adminEmail, adminOtp.trim(), 'ADMIN');
      if (data.user?.role !== 'ADMIN') {
        throw new Error('Account lacks Administrator clearance.');
      }
      setInfoMessage('✓ Administrative clearance verified. Opening Dashboard...');
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setLoading(false);
      setInfoMessage('');
      setError(err.message || 'Invalid OTP or account lacks Administrator clearance.');
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Hero Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.45 }} />
        <div className="container">
          <span className="section-label" style={{ marginBottom: '0.5rem' }}>
            VIT-TEC • SPORIC AUTHENTICATION PORTAL
          </span>
          <h1 className={styles.title}>
            {accountType === 'admin'
              ? 'Administrator Access Control'
              : 'Student & Corporate Portal'}
          </h1>
          <p className={styles.subtitle}>
            {accountType === 'admin'
              ? 'Restricted to authorized SpoRIC Directors and System Administrators.'
              : 'Unified portal for corporate executives, industry engineers, scholars, and university students.'}
          </p>
        </div>
      </section>

      {/* Main Authentication Section */}
      <section className={styles.formSection}>
        <div className="container" style={{ maxWidth: '580px' }}>
          {/* ====================================================
              1. ACCOUNT TYPE SELECTION BUTTONS (EXACTLY 2 OPTIONS)
             ==================================================== */}
          <div className={styles.accountSelectorWrapper}>
            <div className={styles.accountSelectorLabel}>CHOOSE ACCOUNT TYPE</div>
            <div className={styles.accountTypeGrid}>
              {/* Option 1: 🎓 Student & Corporate */}
              <button
                type="button"
                className={`${styles.accountTypeBtn} ${
                  accountType === 'student_corporate' ? styles.accountTypeBtnActive : ''
                }`}
                onClick={() => handleSelectAccountType('student_corporate')}
              >
                <span className={styles.accountTypeIcon}>🎓</span>
                <div className={styles.accountTypeContent}>
                  <div className={styles.accountTypeTitle}>Student &amp; Corporate</div>
                  <div className={styles.accountTypeDesc}>
                    Students, Engineers, &amp; Industry Delegates
                  </div>
                </div>
              </button>

              {/* Option 2: 🔐 Admin */}
              <button
                type="button"
                className={`${styles.accountTypeBtn} ${
                  accountType === 'admin' ? styles.accountTypeBtnActive : ''
                }`}
                onClick={() => handleSelectAccountType('admin')}
              >
                <span className={styles.accountTypeIcon}>🔐</span>
                <div className={styles.accountTypeContent}>
                  <div className={styles.accountTypeTitle}>Admin</div>
                  <div className={styles.accountTypeDesc}>
                    Authorized SpoRIC Administrators
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Container Card */}
          <div className={styles.formCard}>
            {/* Feedback Notifications */}
            {error && <div className={styles.errorBanner}>{error}</div>}
            {infoMessage && <div className={styles.infoBanner}>{infoMessage}</div>}

            {/* ====================================================
                VIEW A: STUDENT & CORPORATE AUTHENTICATION
               ==================================================== */}
            {accountType === 'student_corporate' && (
              <>
                {/* Mode Selector Tabs: Sign In / Create Account */}
                {subMode !== 'forgot_password' && (
                  <div className={styles.modeTabs}>
                    <button
                      type="button"
                      className={`${styles.modeTabBtn} ${
                        subMode === 'login' ? styles.modeTabBtnActive : ''
                      }`}
                      onClick={() => {
                        setSubMode('login');
                        setError('');
                        setInfoMessage('');
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeTabBtn} ${
                        subMode === 'register' ? styles.modeTabBtnActive : ''
                      }`}
                      onClick={() => {
                        setSubMode('register');
                        setError('');
                        setInfoMessage('');
                        setRegStep(1);
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                )}

                {/* ----------------------------------------------------
                    1. RETURNING USER: EMAIL + PASSWORD LOGIN (NO OTP)
                   ---------------------------------------------------- */}
                {subMode === 'login' && (
                  <form onSubmit={handleStudentCorporateLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. akshayprakash3009@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={styles.input}
                        autoComplete="email"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.label}>PASSWORD *</label>
                        <button
                          type="button"
                          className={styles.forgotBtn}
                          onClick={() => {
                            setSubMode('forgot_password');
                            setForgotEmail(loginEmail);
                            setError('');
                            setInfoMessage('');
                          }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Enter your account password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={styles.input}
                        autoComplete="current-password"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontWeight: 800, marginTop: '0.5rem' }}
                      disabled={loading}
                    >
                      {loading ? 'Authenticating...' : 'Sign In to Portal →'}
                    </button>

                    <div className={styles.switchPrompt}>
                      New to VIT-TEC SpoRIC?{' '}
                      <button
                        type="button"
                        className={styles.textLink}
                        onClick={() => {
                          setSubMode('register');
                          setRegStep(1);
                          setError('');
                        }}
                      >
                        Create an Account
                      </button>
                    </div>
                  </form>
                )}

                {/* ----------------------------------------------------
                    2. NEW USER: 4-STEP REGISTRATION FLOW
                   ---------------------------------------------------- */}
                {subMode === 'register' && (
                  <div>
                    {/* Step Progress Bar */}
                    <div className={styles.stepProgressContainer}>
                      <div className={`${styles.stepIndicator} ${regStep >= 1 ? styles.stepActive : ''}`}>
                        <div className={styles.stepCircle}>{regStep > 1 ? '✓' : '1'}</div>
                        <span className={styles.stepTitle}>Email</span>
                      </div>
                      <div className={`${styles.stepLine} ${regStep >= 2 ? styles.stepLineActive : ''}`} />
                      <div className={`${styles.stepIndicator} ${regStep >= 2 ? styles.stepActive : ''}`}>
                        <div className={styles.stepCircle}>{regStep > 2 ? '✓' : '2'}</div>
                        <span className={styles.stepTitle}>Password</span>
                      </div>
                      <div className={`${styles.stepLine} ${regStep >= 3 ? styles.stepLineActive : ''}`} />
                      <div className={`${styles.stepIndicator} ${regStep >= 3 ? styles.stepActive : ''}`}>
                        <div className={styles.stepCircle}>{regStep > 3 ? '✓' : '3'}</div>
                        <span className={styles.stepTitle}>Verify</span>
                      </div>
                      <div className={`${styles.stepLine} ${regStep >= 4 ? styles.stepLineActive : ''}`} />
                      <div className={`${styles.stepIndicator} ${regStep >= 4 ? styles.stepActive : ''}`}>
                        <div className={styles.stepCircle}>4</div>
                        <span className={styles.stepTitle}>Profile</span>
                      </div>
                    </div>

                    {/* STEP 1: EMAIL */}
                    {regStep === 1 && (
                      <form onSubmit={handleRegStep1Email} className={styles.form}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>EMAIL ADDRESS *</label>
                          <input
                            type="email"
                            required
                            placeholder="Enter your personal or corporate email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className={styles.input}
                            autoFocus
                          />
                          <span className={styles.hint}>
                            We will send a 6-digit verification code to this address.
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '0.85rem', fontWeight: 800 }}
                          disabled={loading}
                        >
                          {loading ? 'Validating Email...' : 'Continue to Password Creation →'}
                        </button>

                        <div className={styles.switchPrompt}>
                          Already have an account?{' '}
                          <button
                            type="button"
                            className={styles.textLink}
                            onClick={() => {
                              setSubMode('login');
                              setLoginEmail(regEmail);
                              setError('');
                            }}
                          >
                            Sign In
                          </button>
                        </div>
                      </form>
                    )}

                    {/* STEP 2: CREATE PASSWORD */}
                    {regStep === 2 && (
                      <form onSubmit={handleRegStep2Password} className={styles.form}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>CREATE PASSWORD *</label>
                          <input
                            type="password"
                            required
                            placeholder="Create a strong password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className={styles.input}
                            autoFocus
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>CONFIRM PASSWORD *</label>
                          <input
                            type="password"
                            required
                            placeholder="Re-type your password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className={styles.input}
                          />
                        </div>

                        {/* Password Checklist */}
                        <div className={styles.passwordRulesBox}>
                          <div className={styles.passwordRuleItem}>
                            <span className={passwordRules.hasLength ? styles.ruleCheckPassed : styles.ruleCheckFailed}>
                              {passwordRules.hasLength ? '✓' : '•'}
                            </span>
                            <span>Minimum 8 characters</span>
                          </div>
                          <div className={styles.passwordRuleItem}>
                            <span className={passwordRules.hasUpper ? styles.ruleCheckPassed : styles.ruleCheckFailed}>
                              {passwordRules.hasUpper ? '✓' : '•'}
                            </span>
                            <span>At least one uppercase letter (A-Z)</span>
                          </div>
                          <div className={styles.passwordRuleItem}>
                            <span className={passwordRules.hasLower ? styles.ruleCheckPassed : styles.ruleCheckFailed}>
                              {passwordRules.hasLower ? '✓' : '•'}
                            </span>
                            <span>At least one lowercase letter (a-z)</span>
                          </div>
                          <div className={styles.passwordRuleItem}>
                            <span className={passwordRules.hasNumber ? styles.ruleCheckPassed : styles.ruleCheckFailed}>
                              {passwordRules.hasNumber ? '✓' : '•'}
                            </span>
                            <span>At least one number (0-9)</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setRegStep(1)}
                            style={{ flex: 1 }}
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 2, fontWeight: 800 }}
                            disabled={loading || !isPasswordValid || regPassword !== regConfirmPassword}
                          >
                            {loading ? 'Sending OTP...' : 'Continue to Verification →'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* STEP 3: EMAIL OTP VERIFICATION */}
                    {regStep === 3 && (
                      <form onSubmit={handleRegStep3Otp} className={styles.form}>
                        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                            VERIFY YOUR EMAIL
                          </h3>
                          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                            A 6-digit verification code has been sent to:<br />
                            <strong style={{ color: '#0B2A6F' }}>{regEmail}</strong>
                          </p>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>ENTER 6-DIGIT CODE *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="• • • • • •"
                            value={regOtp}
                            onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                            className={styles.otpInput}
                            autoFocus
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '0.85rem', fontWeight: 800 }}
                          disabled={loading || regOtp.length < 6}
                        >
                          {loading ? 'Verifying...' : 'Verify Email →'}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                          <button
                            type="button"
                            className={styles.textLink}
                            onClick={() => setRegStep(2)}
                          >
                            ← Back
                          </button>

                          <button
                            type="button"
                            className={styles.resendBtn}
                            onClick={handleResendRegOtp}
                            disabled={timer > 0}
                          >
                            {timer > 0 ? `Resend Code in ${timer}s` : 'Resend OTP'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* STEP 4: PROFILE DETAILS */}
                    {regStep === 4 && (
                      <form onSubmit={handleRegStep4Profile} className={styles.form}>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                            Complete Your Profile
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                            This information will automatically be saved and used for your training certifications and course enrollments.
                          </p>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>FULL NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Akshay Prakash"
                            value={regFullName}
                            onChange={(e) => setRegFullName(e.target.value)}
                            className={styles.input}
                            autoFocus
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            EMAIL ADDRESS <span className={styles.readOnlyBadge}>VERIFIED / READ-ONLY</span>
                          </label>
                          <input
                            type="email"
                            readOnly
                            disabled
                            value={regEmail}
                            className={`${styles.input} ${styles.readOnlyInput}`}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>PHONE NUMBER *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 99403 51232"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>DESIGNATION / PROFESSIONAL ROLE *</label>
                          <select
                            value={regDesignation}
                            onChange={(e) => setRegDesignation(e.target.value)}
                            className={styles.select}
                          >
                            {DESIGNATION_OPTIONS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        {regDesignation === 'Other' && (
                          <div className={styles.formGroup}>
                            <label className={styles.label}>SPECIFY ROLE *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Chief Architect / Lead Consultant"
                              value={regCustomDesignation}
                              onChange={(e) => setRegCustomDesignation(e.target.value)}
                              className={styles.input}
                            />
                          </div>
                        )}

                        <div className={styles.formGroup}>
                          <label className={styles.label}>COMPANY / UNIVERSITY NAME</label>
                          <input
                            type="text"
                            placeholder="e.g. LUCAS / Ford / VIT Chennai"
                            value={regCompany}
                            onChange={(e) => setRegCompany(e.target.value)}
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>INDUSTRY / DOMAIN SECTOR</label>
                          <select
                            value={regIndustry}
                            onChange={(e) => setRegIndustry(e.target.value)}
                            className={styles.select}
                          >
                            {INDUSTRY_SECTOR_OPTIONS.map((sec) => (
                              <option key={sec} value={sec}>
                                {sec}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '0.9rem', fontWeight: 800, marginTop: '0.5rem' }}
                          disabled={loading}
                        >
                          {loading ? 'Creating Account...' : 'Complete Profile & Register →'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ----------------------------------------------------
                    3. FORGOT PASSWORD VIEW
                   ---------------------------------------------------- */}
                {subMode === 'forgot_password' && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                        Password Recovery
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                        {forgotStep === 1
                          ? 'Enter your registered email address to receive a secure recovery code.'
                          : `Enter the 6-digit code sent to ${forgotEmail} and choose a new password.`}
                      </p>
                    </div>

                    {forgotStep === 1 ? (
                      <form onSubmit={handleForgotStep1} className={styles.form}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>REGISTERED EMAIL *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. akshayprakash3009@gmail.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className={styles.input}
                            autoFocus
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setSubMode('login');
                              setError('');
                            }}
                            style={{ flex: 1 }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 2, fontWeight: 800 }}
                            disabled={loading}
                          >
                            {loading ? 'Sending Code...' : 'Send Recovery Code →'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleForgotStep2} className={styles.form}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>6-DIGIT OTP CODE *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="• • • • • •"
                            value={forgotOtp}
                            onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                            className={styles.otpInput}
                            autoFocus
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>NEW PASSWORD *</label>
                          <input
                            type="password"
                            required
                            placeholder="Minimum 8 characters"
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            className={styles.input}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setForgotStep(1)}
                            style={{ flex: 1 }}
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 2, fontWeight: 800 }}
                            disabled={loading || forgotOtp.length < 6 || forgotNewPassword.length < 8}
                          >
                            {loading ? 'Resetting...' : 'Reset Password →'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ====================================================
                VIEW B: ADMIN AUTHENTICATION (DEDICATED)
               ==================================================== */}
            {accountType === 'admin' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span className={styles.adminClearanceBadge}>RESTRICTED CLEARANCE</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.5rem 0 0.25rem' }}>
                    Administrator Login
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                    Enter your authorized administrative credentials to access the SpoRIC Management Dashboard.
                  </p>
                </div>

                {/* Admin Auth Mode Toggle: Password vs OTP */}
                <div className={styles.modeTabs} style={{ marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    className={`${styles.modeTabBtn} ${adminAuthMode === 'password' ? styles.modeTabBtnActive : ''}`}
                    onClick={() => {
                      setAdminAuthMode('password');
                      setError('');
                      setInfoMessage('');
                    }}
                  >
                    Admin Password
                  </button>
                  <button
                    type="button"
                    className={`${styles.modeTabBtn} ${adminAuthMode === 'otp' ? styles.modeTabBtnActive : ''}`}
                    onClick={() => {
                      setAdminAuthMode('otp');
                      setError('');
                      setInfoMessage('');
                    }}
                  >
                    Admin OTP
                  </button>
                </div>

                {adminAuthMode === 'password' ? (
                  <form onSubmit={handleAdminPasswordLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>ADMINISTRATOR EMAIL *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. deancc.sporic@vit.ac.in"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className={styles.input}
                        autoFocus
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>ADMINISTRATOR PASSWORD *</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontWeight: 800, background: '#0F172A' }}
                      disabled={loading}
                    >
                      {loading ? 'Verifying Clearance...' : 'Authenticate as Admin →'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={adminOtpSent ? handleAdminOtpLogin : handleAdminSendOtp} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>ADMINISTRATOR EMAIL *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. deancc.sporic@vit.ac.in"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className={styles.input}
                        autoFocus
                      />
                    </div>

                    {adminOtpSent && (
                      <div className={styles.formGroup}>
                        <label className={styles.label}>ADMINISTRATOR 6-DIGIT OTP *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="• • • • • •"
                          value={adminOtp}
                          onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, ''))}
                          className={styles.otpInput}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontWeight: 800, background: '#0F172A' }}
                      disabled={loading}
                    >
                      {loading
                        ? 'Processing...'
                        : adminOtpSent
                        ? 'Verify Admin OTP & Access Dashboard →'
                        : 'Send Administrator OTP Code →'}
                    </button>

                    {adminOtpSent && (
                      <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          className={styles.resendBtn}
                          onClick={handleAdminSendOtp}
                          disabled={timer > 0}
                        >
                          {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
