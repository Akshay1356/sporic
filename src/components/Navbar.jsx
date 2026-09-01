import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../hooks/useScrollPosition';
import api from '../services/api';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Technology', path: '/technology' },
  { label: 'Management', path: '/management' },
  { label: 'Personality', path: '/personality' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolled = scrollY > 30;

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    api.logout();
    localStorage.removeItem('sporic_user');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <>
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.navInner}>
          {/* Logo & Brand */}
          <Link to="/" className={styles.logo} aria-label="VIT-TEC Home">
            <img src="/vit_logo.png" alt="Vellore Institute of Technology" className={styles.vitLogoImg} />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>VIT-TEC</span>
              <span className={styles.brandSubtitle}>Technology Enhancement Centre</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navLinks.map((link) => (
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
            ))}
          </nav>

          {/* Desktop CTAs & Auth State */}
          <div className={styles.navActions}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                  }}
                >
                  <span>Hi, {currentUser.name?.split(' ')[0]}</span>
                  <span
                    style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'var(--primary-light)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {currentUser.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', color: '#fff' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={`btn btn-ghost ${styles.loginBtn}`}>
                  Login
                </Link>
                <Link to="/register" className={`btn ${styles.applyBtn}`}>
                  Apply / Enquire
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamOpen1 : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamOpen2 : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.hamOpen3 : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className={styles.mobileMenuInner}>
              <div className={styles.mobileMenuHeader}>
                <img src="/vit_logo.png" alt="Vellore Institute of Technology" style={{ height: '40px' }} />
                <button
                  className={styles.closeBtn}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      className={({ isActive }) =>
                        `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className={styles.mobileCTAs}>
                {currentUser ? (
                  <>
                    <Link to="/dashboard" className={`btn btn-primary ${styles.mobileCTA}`}>
                      Dashboard ({currentUser.role})
                    </Link>
                    <button onClick={handleLogout} className={`btn btn-secondary ${styles.mobileCTA}`}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={`btn btn-secondary ${styles.mobileCTA}`}>
                      Login
                    </Link>
                    <Link to="/register" className={`btn btn-primary ${styles.mobileCTA}`}>
                      Apply / Enquire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
