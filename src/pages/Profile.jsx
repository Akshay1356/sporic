import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Corporate Executive');
  const [customDesignation, setCustomDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [industrySector, setIndustrySector] = useState('Automotive & Manufacturing');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('sporic_user');
    if (!stored) {
      navigate('/login?redirect=/profile');
      return;
    }

    try {
      const u = JSON.parse(stored);
      setUser(u);
      setFullName(u.fullName || u.name || '');
      setEmail(u.email || '');
      setPhone(u.phone || '');
      
      const standardDesignations = [
        'Corporate Executive',
        'Senior Manager / Director',
        'Software Engineer / IT Specialist',
        'Industrial / Manufacturing Engineer',
        'Student / Researcher',
        'Faculty / Academician',
        'Independent Consultant',
      ];

      if (u.designation && standardDesignations.includes(u.designation)) {
        setDesignation(u.designation);
      } else if (u.designation) {
        setDesignation('Other');
        setCustomDesignation(u.designation);
      }

      setOrganization(u.organization || u.company || '');
      setIndustrySector(u.industrySector || 'Automotive & Manufacturing');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!phone.trim()) return setError('Please enter a valid phone number.');

    // Validate phone number format (at least 8 digits)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8) {
      return setError('Please enter a valid phone number format (e.g. +91 98765 43210).');
    }

    const finalDesignation = designation === 'Other' ? (customDesignation.trim() || 'Professional') : designation;

    setLoading(true);
    setError('');
    setSuccess('');

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      name: fullName.trim(),
      phone: phone.trim(),
      designation: finalDesignation,
      organization: organization.trim() || 'Individual',
      industrySector,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save locally
      localStorage.setItem('sporic_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));

      // 2. Dispatch to backend API
      if (api && typeof api.updateProfile === 'function') {
        await api.updateProfile(updatedUser).catch(() => null);
      }

      setUser(updatedUser);
      setLoading(false);
      setSuccess('✓ Profile saved successfully! Your details are up-to-date.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to save profile changes.');
    }
  };

  if (!user) return null;

  return (
    <div className={styles.profilePage}>
      <div className="container">
        <motion.div
          className={styles.profileCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Header with Avatar & Identity */}
          <div className={styles.avatarHeader}>
            <div className={styles.avatarCircle} aria-hidden="true">
              {(fullName || email || 'U')[0].toUpperCase()}
            </div>
            <div className={styles.avatarInfo}>
              <div className={styles.avatarTitleRow}>
                <h1 className={styles.avatarName}>{fullName || 'Your Name'}</h1>
                <span
                  className={`${styles.roleBadge} ${
                    user.role === 'ADMIN' ? styles.roleBadgeAdmin : styles.roleBadgeStudent
                  }`}
                >
                  {user.role === 'ADMIN' ? 'Administrator' : (user.role || 'Student')}
                </span>
              </div>
              <p className={styles.avatarEmail}>{email}</p>
            </div>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}
          {success && <div className={styles.successBanner}>{success}</div>}

          <form onSubmit={handleSaveProfile} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Email Address <span className={styles.readOnlyBadge}>Read-Only</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className={`${styles.input} ${styles.readOnlyInput}`}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Designation / Professional Role *</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={styles.select}
                >
                  <option value="Corporate Executive">Corporate Executive</option>
                  <option value="Senior Manager / Director">Senior Manager / Director</option>
                  <option value="Software Engineer / IT Specialist">Software Engineer / IT Specialist</option>
                  <option value="Industrial / Manufacturing Engineer">Industrial / Manufacturing Engineer</option>
                  <option value="Student / Researcher">Student / Researcher</option>
                  <option value="Faculty / Academician">Faculty / Academician</option>
                  <option value="Independent Consultant">Independent Consultant</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              {designation === 'Other' && (
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Specify Your Designation *</label>
                  <input
                    type="text"
                    required
                    value={customDesignation}
                    onChange={(e) => setCustomDesignation(e.target.value)}
                    placeholder="e.g. Operations Specialist"
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Company / University Name</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Lucas TVS / L&T / VIT Chennai"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Industry / Domain Sector</label>
                <select
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  className={styles.select}
                >
                  <option value="Automotive & Manufacturing">Automotive & Manufacturing</option>
                  <option value="Information Technology & Software">Information Technology & Software</option>
                  <option value="Renewable Energy & Power">Renewable Energy & Power</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Higher Education & Research">Higher Education & Research</option>
                  <option value="Consulting & Corporate Strategy">Consulting & Corporate Strategy</option>
                </select>
              </div>
            </div>

            {/* Bottom Action Area: Secondary Navigation + Primary Save */}
            <div className={styles.bottomActionArea}>
              <div className={styles.secondaryNavGroup}>
                <Link to="/courses" className={styles.secondaryNavLink}>
                  ← Browse Courses
                </Link>
                <Link to="/dashboard" className={styles.secondaryNavLink}>
                  Go to Dashboard →
                </Link>
              </div>

              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
