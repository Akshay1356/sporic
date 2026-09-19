import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../hooks/useScrollPosition';
import api from '../services/api';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Corporate Programs', path: '/courses' },
  { label: 'Corporate Training Organized', path: '/corporate-training' },
  { label: 'Corporate Testimonials', path: '/corporate-testimonials' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const corporateProgramLinks = [
  { label: 'All Courses', path: '/courses' },
  { label: 'Technology', path: '/technology' },
  { label: 'Management', path: '/management' },
  { label: 'Leadership & Personality', path: '/personality' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolled = scrollY > 20;

  // Check login state on location change
  useEffect(() => {
    const stored = localStorage.getItem('sporic_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setProgramsOpen(false);
    setMobileProgramsOpen(false);
  }, [location.pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProgramsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    api.logout();
    localStorage.removeItem('sporic_user');
    setCurrentUser(null);
    navigate('/');
  };

  const rawName = (
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.email?.split('@')[0] ||
    'User'
  ).split(' ')[0];
  const displayName = rawName.length > 10 ? rawName.slice(0, 9) + '…' : rawName;

  const avatarInitial = (
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.email ||
    'U'
  )[0].toUpperCase();

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <>
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.navInner}>
          {/* ====================================================
              LEFT SECTION: VIT LOGO & VIT-TEC BRANDING
             ==================================================== */}
          <Link to="/" className={styles.logo} aria-label="VIT-TEC Home">
            <img
              src="/vit_logo.png"
              alt="Vellore Institute of Technology"
              className={styles.vitLogoImg}
            />
            <div className={styles.brandDivider} />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>VIT-TEC</span>
              <span className={styles.brandSubtitle}>Technology Enhancement Centre</span>
            </div>
          </Link>

          {/* ====================================================
              CENTER SECTION: BALANCED NAVIGATION LINKS
             ==================================================== */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navLinks.map((link) => (
              link.label === 'Corporate Programs' ? (
                <div
                  className={styles.dropdown}
                  key={link.path}
                  ref={dropdownRef}
                  onMouseEnter={() => setProgramsOpen(true)}
                  onMouseLeave={() => setProgramsOpen(false)}
                >
                  <button
                    type="button"
                    className={`${styles.navLink} ${
                      location.pathname.startsWith('/courses') ||
                      corporateProgramLinks.some((item) => location.pathname === item.path)
                        ? styles.navLinkActive
                        : ''
                    }`}
                    onClick={() => setProgramsOpen((open) => !open)}
                    aria-expanded={programsOpen}
                    aria-haspopup="true"
                  >
                    Corporate Programs <span className={styles.dropdownArrow}>{programsOpen ? '▴' : '▾'}</span>
                  </button>
                  <AnimatePresence>
                    {programsOpen && (
                      <motion.div
                        className={styles.dropdownMenu}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        {corporateProgramLinks.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                              `${styles.dropdownItem} ${isActive ? styles.activeDropdownItem : ''}`
                            }
                            onClick={() => setProgramsOpen(false)}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* ====================================================
              RIGHT SECTION: USER / ADMIN / GUEST CONTROLS
             ==================================================== */}
          <div className={styles.navActions}>
            {currentUser ? (
              <div className={styles.accountGroup}>
                {/* Profile Badge Pill */}
                <Link
                  to="/profile"
                  className={styles.profilePill}
                  title="View Account Profile Settings"
                >
                  <div className={styles.avatarMini}>{avatarInitial}</div>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={isAdmin ? styles.badgeAdmin : styles.badgeRole}>
                    {isAdmin ? 'ADMIN' : currentUser.role || 'USER'}
                  </span>
                </Link>

                {/* Dashboard Action */}
                <Link to="/dashboard" className={styles.dashBtn}>
                  Dashboard
                </Link>

                {/* Secondary Logout */}
                <button
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                  aria-label="Log out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className={styles.guestGroup}>
                <Link to="/login" className={styles.loginBtn}>
                  Login
                </Link>
                <Link to="/register" className={styles.applyBtn}>
                  Apply / Register
                </Link>
              </div>
            )}
          </div>

          {/* ====================================================
              RESPONSIVE HAMBURGER TOGGLE
             ==================================================== */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`${styles.bar} ${mobileOpen ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </header>

      {/* ====================================================
          MOBILE & TABLET DRAWER NAVIGATION
         ==================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileDrawer}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <nav className={styles.mobileNav} aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  link.label === 'Corporate Programs' ? (
                    <div key={link.path} className={styles.mobileDropdown}>
                      <button
                        type="button"
                        className={`${styles.mobileNavLink} ${
                          location.pathname.startsWith('/courses') ||
                          corporateProgramLinks.some((item) => location.pathname === item.path)
                            ? styles.mobileNavLinkActive
                            : ''
                        }`}
                        onClick={() => setMobileProgramsOpen((open) => !open)}
                        aria-expanded={mobileProgramsOpen}
                      >
                        <span>Corporate Programs</span>
                        <span className={styles.mobileDropdownArrow}>{mobileProgramsOpen ? '▴' : '▾'}</span>
                      </button>
                      <AnimatePresence>
                        {mobileProgramsOpen && (
                          <motion.div
                            className={styles.mobileDropdownMenu}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            {corporateProgramLinks.map((item) => (
                              <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                  `${styles.mobileDropdownItem} ${isActive ? styles.mobileDropdownItemActive : ''}`
                                }
                                onClick={() => {
                                  setMobileOpen(false);
                                  setMobileProgramsOpen(false);
                                }}
                              >
                                {item.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === '/'}
                      className={({ isActive }) =>
                        `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                ))}

                <div className={styles.mobileActions}>
                  {currentUser ? (
                    <>
                      <div className={styles.mobileUserBadge}>
                        <span>👤 {currentUser.fullName || currentUser.name || 'User'}</span>
                        <span className={isAdmin ? styles.badgeAdmin : styles.badgeRole}>
                          {isAdmin ? 'ADMIN' : currentUser.role || 'USER'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        👤 Profile Settings
                      </Link>
                      <Link
                        to="/dashboard"
                        className={styles.applyBtn}
                        style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                      >
                        Go to Dashboard →
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                        style={{ width: '100%', padding: '0.65rem' }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={styles.loginBtn}
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className={styles.applyBtn}
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        Apply / Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
