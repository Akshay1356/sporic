import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CourseDetails from './pages/CourseDetails';
import Technology from './pages/Technology';
import Management from './pages/Management';
import Personality from './pages/Personality';
import Gallery from './pages/Gallery';
import Register from './pages/Register';
import Login from './pages/Login';
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* Dynamic Cursor Light Glow Wrapper */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Floating Header Navbar */}
        <Navbar />

        {/* Dynamic Navigation Routes */}
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Dedicated Domain Pages */}
            <Route path="/technology" element={<Technology />} />
            <Route path="/management" element={<Management />} />
            <Route path="/personality" element={<Personality />} />
            <Route path="/leadership" element={<Navigate to="/personality" replace />} />
            
            {/* Redirect legacy /courses to /technology */}
            <Route path="/courses" element={<Navigate to="/technology" replace />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/faculty" element={<FacultyLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Dark Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
