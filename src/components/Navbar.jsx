import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { DOMAINS } from '../data/courses';
import api from '../services/api';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Corporate Training', path: '/corporate-training' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const courseCategories = [
  { label: 'All Courses', path: '/courses', domain: 'All' },
  { label: 'Technology', path: `/courses?domain=${encodeURIComponent(DOMAINS.TECHNOLOGY)}`, domain: DOMAINS.TECHNOLOGY },
  { label: 'Management', path: `/courses?domain=${encodeURIComponent(DOMAINS.MANAGEMENT)}`, domain: DOMAINS.MANAGEMENT },
  { label: 'Leadership & Personality', path: `/courses?domain=${encodeURIComponent(DOMAINS.LEADERSHIP)}`, domain: DOMAINS.LEADERSHIP },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const scrollY = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolled = scrollY > 20;

  // Determine currently selected category from URL search params if on /courses
  const searchParams = new URLSearchParams(location.search);
  const currentDomainParam = location.pathname.startsWith('/courses')
    ? (searchParams.get('domain') || 'All')
    : null;

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCoursesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setCoursesDropdownOpen(false);
  }, [location.pathname, location.search]);

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
            {navLinks.map((link) => {
              if (link.label === 'Courses') {
                const isCoursesActive = location.pathname.startsWith('/courses');
                return (
                  <div
                    key={link.path}
                    className={styles.dropdownWrapper}
                    ref={dropdownRef}
                  >
                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.coursesNavBtn} ${isCoursesActive ? styles.navLinkActive : ''}`}
                      onClick={() => setCoursesDropdownOpen((prev) => !prev)}
                      aria-expanded={coursesDropdownOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                    </button>

                    {/* Compact Desktop Dropdown */}
                    <AnimatePresence>
                      {coursesDropdownOpen && (
                        <motion.div
                          className={styles.dropdownMenu}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                          role="menu"
                          aria-label="Courses Categories"
                        >
                          {courseCategories.map((cat) => {
                            const isSelected = isCoursesActive && currentDomainParam === cat.domain;
                            return (
                              <Link
                                key={cat.label}
                                to={cat.path}
                                className={`${styles.dropdownItem} ${isSelected ? styles.dropdownItemActive : ''}`}
                                role="menuitem"
                                onClick={() => setCoursesDropdownOpen(false)}
                              >
                                <span className={styles.dropdownItemLabel}>{cat.label}</span>
                                {isSelected && (
                                  <span className={styles.dropdownItemCheck} aria-hidden="true">
                                    ✓
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
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
              );
            })}
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
                {navLinks.map((link) => {
                  if (link.label === 'Courses') {
                    const isCoursesActive = location.pathname.startsWith('/courses');
                    return (
                      <div key={link.path} className={styles.mobileDropdownWrapper}>
                        <div className={styles.mobileCoursesHeaderRow}>
                          <NavLink
                            to={link.path}
                            className={`${styles.mobileNavLink} ${isCoursesActive ? styles.mobileNavLinkActive : ''}`}
                            onClick={() => setMobileOpen(false)}
                            style={{ flexGrow: 1 }}
                          >
                            Courses
                          </NavLink>
                          <button
                            type="button"
                            className={styles.mobileSubmenuToggle}
                            onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                            aria-label="Toggle Courses Submenu"
                            aria-expanded={mobileCoursesOpen}
                          >
                            <svg
                              className={`${styles.caretIcon} ${mobileCoursesOpen ? styles.caretRotated : ''}`}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </div>

                        {/* Mobile Submenu Items */}
                        <AnimatePresence>
                          {mobileCoursesOpen && (
                            <motion.div
                              className={styles.mobileSubmenu}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              {courseCategories.map((cat) => {
                                const isSelected = isCoursesActive && currentDomainParam === cat.domain;
                                return (
                                  <Link
                                    key={cat.label}
                                    to={cat.path}
                                    className={`${styles.mobileSubmenuItem} ${isSelected ? styles.mobileSubmenuItemActive : ''}`}
                                    onClick={() => {
                                      setMobileOpen(false);
                                    }}
                                  >
                                    <span>{cat.label}</span>
                                    {isSelected && (
                                      <span className={styles.dropdownItemCheck} aria-hidden="true">
                                        ✓
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
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
                  );
                })}

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
