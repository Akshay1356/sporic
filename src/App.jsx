import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RankingsMarquee from './components/RankingsMarquee';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Technology from './pages/Technology';
import Management from './pages/Management';
import Personality from './pages/Personality';
import Gallery from './pages/Gallery';
import CorporateTraining from './pages/CorporateTraining';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminLogin from './pages/AdminLogin';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';

// Scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Admin Corporate Training Route Redirect
function AdminCorporateTrainingGuard() {
  const stored = localStorage.getItem('sporic_user');
  let user = null;
  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch {
      user = null;
    }
  }

  if (user && user.role === 'ADMIN') {
    return <Navigate to="/dashboard?tab=corporate-training" replace />;
  }

  return <Navigate to="/login?role=admin" replace />;
}

// Protected Admin Gallery Route Redirect
function AdminGalleryGuard() {
  const stored = localStorage.getItem('sporic_user');
  let user = null;
  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch {
      user = null;
    }
  }

  if (user && user.role === 'ADMIN') {
    return <Navigate to="/dashboard?tab=gallery" replace />;
  }

  return <Navigate to="/login?role=admin" replace />;
}

// Protected Admin Previous Programs Route Redirect
function AdminPreviousProgramsGuard() {
  const stored = localStorage.getItem('sporic_user');
  let user = null;
  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch {
      user = null;
    }
  }

  if (user && user.role === 'ADMIN') {
    return <Navigate to="/dashboard?tab=programs" replace />;
  }

  return <Navigate to="/login?role=admin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Dynamic Main App Container */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {/* Floating Header Navbar */}
        <Navbar />

        {/* Global Rankings & Recognitions Marquee Ticker */}
        <RankingsMarquee />

        {/* Dynamic Navigation Routes */}
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Dedicated Corporate Training Organized Page */}
            <Route path="/corporate-training" element={<CorporateTraining />} />

            {/* Comprehensive Courses Catalog Page */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />

            {/* Dedicated Domain Pages */}
            <Route path="/technology" element={<Technology />} />
            <Route path="/management" element={<Management />} />
            <Route path="/personality" element={<Personality />} />
            <Route path="/leadership" element={<Navigate to="/personality" replace />} />

            {/* Dynamic Gallery & Admin CMS */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/gallery" element={<AdminGalleryGuard />} />
            <Route path="/admin/programs" element={<AdminPreviousProgramsGuard />} />
            <Route path="/admin/previous-programs" element={<AdminPreviousProgramsGuard />} />
            <Route path="/admin/corporate-training" element={<AdminCorporateTrainingGuard />} />

            {/* Registration, Authentication & Profile */}
            <Route path="/register" element={<Register />} />
            <Route path="/apply" element={<Register />} />
            <Route path="/enroll" element={<Register />} />
            <Route path="/enrol" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/faculty" element={<FacultyLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/profile" element={<Profile />} />

            {/* Contact & Dynamic Dashboard */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Institutional Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
