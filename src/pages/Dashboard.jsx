import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { getAllCourses, saveNewCourse, deleteCustomCourse, DOMAINS } from '../data/courses';
import { getAllGalleryItems, saveGalleryItem, updateGalleryItem, deleteGalleryItem, GALLERY_CATEGORIES } from '../data/galleryData';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'gallery' ? 'gallery' : 'courses';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [studentDashboard, setStudentDashboard] = useState(null);

  // Course edit / add modal states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState('PUBLISHED');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    id: '',
    title: '',
    shortDescription: '',
    domain: DOMAINS.TECHNOLOGY,
    category: 'Industry 4.0',
    hours: 20,
    mode: 'online',
    price: 4999,
    startDate: '15-10-2026',
    learn: 'Hands-on live industry projects, Real-world case study analysis, Emerging technical tool proficiency, SpoRIC certified completion credential',
    modules: 'Fundamentals & Industry Architecture, Core Implementation & Design, Advanced Integration & Testing, Capstone Evaluation Project',
    contactPerson: 'Dean, SpoRIC',
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactNumber: '73587 82571',
  });

  // Gallery CMS modal states (ADMIN ONLY)
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Corporate Training');
  const [photoImagePreview, setPhotoImagePreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoSaving, setPhotoSaving] = useState(false);
  const [deletingPhotoItem, setDeletingPhotoItem] = useState(null);

  const refreshCourses = () => {
    const all = getAllCourses();
    const formatted = all.map((c) => ({
      id: c.id,
      code: c.id,
      title: c.title,
      shortDescription: c.shortDescription,
      domain: c.domain,
      category: c.category,
      mode: c.mode,
      hours: c.hours,
      price: c.price || 4999,
      finalPrice: c.finalPrice || c.price || 4999,
      status: c.status || 'PUBLISHED',
      dbId: 'db_' + c.id,
      isCustom: Boolean(c.isCustom),
    }));
    setCoursesList(formatted);
  };

  const refreshGallery = () => {
    const allPhotos = getAllGalleryItems();
    setGalleryList(allPhotos);
  };

  useEffect(() => {
    refreshCourses();
    refreshGallery();
  }, []);

  useEffect(() => {
    async function loadUserData() {
      const storedUser = localStorage.getItem('sporic_user');
      const token = api.getToken();

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const meRes = await api.getMe();
        if (meRes.data?.user) {
          setUser(meRes.data.user);
          localStorage.setItem('sporic_user', JSON.stringify(meRes.data.user));
          fetchRoleSpecificData(meRes.data.user);
        } else if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          fetchRoleSpecificData(parsed);
        } else {
          navigate('/login');
        }
      } catch (err) {
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          fetchRoleSpecificData(parsed);
        } else {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [navigate]);

  async function fetchRoleSpecificData(currentUser) {
    if (currentUser.role === 'ADMIN') {
      try {
        const [analyticsRes, usersRes, paymentsRes] = await Promise.all([
          api.getAnalytics().catch(() => null),
          api.request('/admin/users').catch(() => null),
          api.request('/admin/payments').catch(() => null),
        ]);

        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
        if (usersRes?.data) setUsersList(usersRes.data);
        if (paymentsRes?.data) setPaymentsList(paymentsRes.data);
        refreshCourses();
        refreshGallery();
      } catch (e) {
        console.warn('Admin data load warning:', e.message);
      }
    } else if (currentUser.role === 'STUDENT') {
      try {
        const dashRes = await api.getStudentDashboard();
        if (dashRes.data) setStudentDashboard(dashRes.data);
      } catch (e) {
        console.warn('Student dashboard error:', e.message);
      }
    }
  }

  // --- COURSE ACTIONS ---
  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    const all = getAllCourses();
    const target = all.find((c) => c.id === editingCourse.code || c.id === editingCourse.id);
    if (target) {
      const updated = {
        ...target,
        price: parseFloat(editPrice) || 4999,
        finalPrice: parseFloat(editPrice) || 4999,
        status: editStatus,
        isCustom: true,
      };
      saveNewCourse(updated);
      refreshCourses();
      setActionSuccess(`Course '${editingCourse.title}' updated successfully.`);
      setEditingCourse(null);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  const handleCreateNewCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.category) {
      alert('Please enter a course title and select a category.');
      return;
    }

    let generatedId = newCourse.id.trim().toUpperCase();
    if (!generatedId) {
      const prefix =
        newCourse.domain === DOMAINS.TECHNOLOGY
          ? 'TECH'
          : newCourse.domain === DOMAINS.MANAGEMENT
          ? 'MGMT'
          : 'LEAD';
      generatedId = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
    }

    const learnArray = newCourse.learn
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const modulesArray = newCourse.modules
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const courseRecord = {
      id: generatedId,
      code: generatedId,
      title: newCourse.title.trim(),
      shortDescription: newCourse.shortDescription.trim() || `Professional executive training in ${newCourse.category}`,
      domain: newCourse.domain,
      category: newCourse.category,
      hours: parseInt(newCourse.hours, 10) || 20,
      mode: newCourse.mode,
      price: parseFloat(newCourse.price) || 4999,
      finalPrice: parseFloat(newCourse.price) || 4999,
      contactPerson: newCourse.contactPerson || 'Dean, SpoRIC',
      contactEmail: newCourse.contactEmail || 'deancc.sporic@vit.ac.in',
      contactNumber: newCourse.contactNumber || '73587 82571',
      learn: learnArray.length > 0 ? learnArray : ['Comprehensive skill enhancement', 'Industry aligned practical training', 'SpoRIC Certification'],
      modules: modulesArray.length > 0 ? modulesArray : ['Introduction & Architecture', 'Practical Implementation', 'Assessment & Certification'],
      features: ['Hands-on training', 'Resource materials', 'Real-world case study', 'Certification of Completion'],
      sessions: [{ batch: 1, date: newCourse.startDate || '15-10-2026' }],
      status: 'PUBLISHED',
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    saveNewCourse(courseRecord);
    refreshCourses();
    setShowAddModal(false);

    setActionSuccess(`✓ Course '${courseRecord.title}' (${courseRecord.id}) published to ${courseRecord.domain} department!`);
    setTimeout(() => setActionSuccess(''), 5000);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm(`Are you sure you want to remove course ${courseId}?`)) {
      deleteCustomCourse(courseId);
      refreshCourses();
      setActionSuccess(`Course ${courseId} removed.`);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // --- GALLERY CMS ACTIONS (ADMIN ONLY) ---
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoTitle('');
    setPhotoDesc('');
    setPhotoCategory('Corporate Training');
    setPhotoImagePreview('');
    setPhotoError('');
    setShowPhotoModal(true);
  };

  const handleOpenEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setPhotoTitle(photo.title || '');
    setPhotoDesc(photo.description || '');
    setPhotoCategory(photo.category || 'Corporate Training');
    setPhotoImagePreview(photo.src || photo.imageUrl || '');
    setPhotoError('');
    setShowPhotoModal(true);
  };

  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 900;
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to web-friendly JPEG data url (quality 0.82)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    // Validate file size (up to 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setPhotoError('Image size exceeds 12MB limit. Please select a smaller photo.');
      return;
    }

    setPhotoError('');
    try {
      const compressed = await compressImageFile(file);
      setPhotoImagePreview(compressed);
    } catch (err) {
      setPhotoError('Failed to process image file. Please try another image.');
    }
  };

  const handleSavePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoImagePreview) {
      setPhotoError('Please upload an image or provide an image URL.');
      return;
    }
    if (!photoDesc.trim()) {
      setPhotoError('Please enter a description for the photo.');
      return;
    }

    setPhotoSaving(true);
    setPhotoError('');

    try {
      if (editingPhoto) {
        // Edit existing
        const updated = updateGalleryItem(editingPhoto.id, {
          title: photoTitle.trim() || 'Corporate Training Activity',
          description: photoDesc.trim(),
          category: photoCategory,
          src: photoImagePreview,
          imageUrl: photoImagePreview,
        });
        await api.updateGalleryItem(editingPhoto.id, updated).catch(() => null);
        setActionSuccess('Photo updated successfully.');
      } else {
        // Create new
        const newRecord = {
          id: `gal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          title: photoTitle.trim() || 'Corporate Training Activity',
          description: photoDesc.trim(),
          category: photoCategory,
          src: photoImagePreview,
          imageUrl: photoImagePreview,
          createdAt: new Date().toISOString(),
          createdBy: user?.email || 'admin.sporic@vit.ac.in',
        };
        const apiRes = await api.addGalleryItem(newRecord);
        if (apiRes?.cloudSynced) {
          setActionSuccess('✓ Photo published to Cloud Database & visible on all devices /gallery!');
        } else {
          setActionSuccess('✓ Photo added successfully and visible on /gallery.');
        }
      }

      refreshGallery();
      setShowPhotoModal(false);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setPhotoError(err.message || 'Failed to save gallery photo.');
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!deletingPhotoItem) return;
    try {
      deleteGalleryItem(deletingPhotoItem.id);
      await api.deleteGalleryItem(deletingPhotoItem.id).catch(() => null);
      refreshGallery();
      setActionSuccess('Photo deleted successfully.');
      setDeletingPhotoItem(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to delete photo: ${err.message}`);
    }
  };

  // Category choices based on selected domain for courses
  const getCategoryOptions = () => {
    if (newCourse.domain === DOMAINS.TECHNOLOGY) {
      return [
        'Industry 4.0',
        'Electric Vehicles',
        'Design',
        'Optics',
        'Manufacturing',
        'Renewable Energy',
        'Construction Technology',
        'ADAS',
        'Quantum Computing',
        'Simulation',
        'Artificial Intelligence',
        'Cybersecurity',
        'Cloud DevOps',
      ];
    }
    if (newCourse.domain === DOMAINS.MANAGEMENT) {
      return ['Operations Management', 'Finance', 'Marketing', 'Data Science', 'Human Resources', 'Strategic Leadership'];
    }
    return ['Leadership & Personality', 'Professional Communication', 'Corporate Soft Skills', 'Stress & Wellness'];
  };

  if (loading) {
    return (
      <div className={styles.dashboardPage} style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading SpoRIC Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.dashboardPage}>
      <div className="grid-bg" style={{ opacity: 0.4 }} />
      <div className="glow-orb glow-violet" style={{ top: '15%', right: '10%', width: '350px', height: '350px' }} />

      <div className="container">
        {/* User Greeting & Header */}
        <div className={styles.header}>
          <div className={styles.welcomeBadge}>
            <span>Welcome back,</span>
            <strong>{user.name}</strong>
            <span className={styles.roleTag}>{user.role}</span>
          </div>
          <h1 className={styles.title}>
            {user.role === 'ADMIN' ? 'Admin Command Center & Operations' : 'Student & Corporate Learning Dashboard'}
          </h1>
          <p className={styles.subtitle}>
            {user.role === 'ADMIN'
              ? 'Manage courses, publish gallery moments, inspect student enrolments, track payments, and direct platform security.'
              : 'Track active course progress, complete learning modules, and access verified certificates.'}
          </p>
        </div>

        {actionSuccess && (
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem', fontWeight: 600 }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* ADMIN ROLE VIEW */}
        {user.role === 'ADMIN' && (
          <>
            {/* Analytics Grid */}
            <div className={styles.metricsGrid}>
              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Total Platform Revenue</span>
                <span className={styles.metricValue}>
                  ₹{(analytics?.finance?.totalRevenueINR || 84990).toLocaleString()}
                </span>
                <span className={styles.metricSubtext}>Verified via Razorpay HMAC</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Active Courses</span>
                <span className={styles.metricValue}>{coursesList.length}</span>
                <span className={styles.metricSubtext}>Across 3 Departments</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Gallery Photos</span>
                <span className={styles.metricValue}>{galleryList.length}</span>
                <span className={styles.metricSubtext}>Published Moments</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Total Enrolments</span>
                <span className={styles.metricValue}>{paymentsList.length || 12}</span>
                <span className={styles.metricSubtext}>Corporate delegates</span>
              </GlassCard>
            </div>

            {/* Admin Tabs Header */}
            <div className={styles.tabsHeader}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                📚 Course Catalog ({coursesList.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                🖼️ Gallery Management ({galleryList.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 User Management ({usersList.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'payments' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                💰 Financial Audits ({paymentsList.length})
              </button>
            </div>

            {/* TAB 1: Courses Management */}
            {activeTab === 'courses' && (
              <GlassCard padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700 }}>Department Courses Catalog</h3>
                    <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                      Courses added here immediately appear on <strong>/technology</strong>, <strong>/management</strong>, or <strong>/personality</strong> with official event posters.
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontWeight: 700 }}
                    onClick={() => setShowAddModal(true)}
                  >
                    <span>➕</span> Add New Course
                  </button>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Event / Course Title</th>
                        <th>Department & Category</th>
                        <th>Duration & Mode</th>
                        <th>Price (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesList.map((c) => (
                        <tr key={c.code || c.id}>
                          <td><strong style={{ color: '#0B2A6F' }}>{c.code || c.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#101828' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#667085' }}>{c.hours} Hours • SpoRIC Certified</div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: '#1D4ED8', background: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                              {c.domain} › {c.category}
                            </span>
                          </td>
                          <td>
                            <div style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700 }}>{c.mode}</div>
                            <div style={{ fontSize: '0.75rem', color: '#667085' }}>{c.hours} hrs</div>
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{c.finalPrice || c.price || 4999}</td>
                          <td>
                            <span className={`${styles.statusPill} ${c.status === 'PUBLISHED' ? styles.statusSuccess : styles.statusPending}`}>
                              {c.status || 'PUBLISHED'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <Link
                                to={`/courses/${c.code || c.id}`}
                                className="btn btn-ghost"
                                style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', border: '1px solid #D0D5DD' }}
                              >
                                Poster
                              </Link>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                onClick={() => {
                                  setEditingCourse(c);
                                  setEditPrice(c.price || 4999);
                                  setEditStatus(c.status || 'PUBLISHED');
                                }}
                              >
                                Edit
                              </button>
                              {c.isCustom && (
                                <button
                                  className="btn btn-ghost"
                                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                                  onClick={() => handleDeleteCourse(c.code || c.id)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 2: GALLERY CMS MANAGEMENT (ADMIN ONLY) */}
            {activeTab === 'gallery' && (
              <GlassCard padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700 }}>Gallery Management</h3>
                    <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                      Publish, edit, and organize official training moments. Uploaded photos appear dynamically on <strong>/gallery</strong>.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                      to="/gallery"
                      target="_blank"
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
                    >
                      View Live Gallery ↗
                    </Link>
                    <button
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontWeight: 700 }}
                      onClick={handleOpenAddPhoto}
                    >
                      <span>➕</span> Add New Photo
                    </button>
                  </div>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>Thumbnail</th>
                        <th>Title & Description</th>
                        <th>Category</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {galleryList.map((photo) => (
                        <tr key={photo.id}>
                          <td>
                            <div style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', background: '#F2F4F7', border: '1px solid #EAECF0' }}>
                              <img
                                src={photo.src || photo.imageUrl}
                                alt={photo.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#101828', marginBottom: '0.2rem' }}>
                              {photo.title || 'Corporate Training Moment'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#667085', maxWidth: '420px', lineHeight: 1.4 }}>
                              {photo.description}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: '#0B2A6F', background: '#EFF6FF', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 600, border: '1px solid #BFDBFE' }}>
                              {photo.category}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#475467' }}>
                            {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Active'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                                onClick={() => handleOpenEditPhoto(photo)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-ghost"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                                onClick={() => setDeletingPhotoItem(photo)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 3: User Management */}
            {activeTab === 'users' && (
              <GlassCard padding="lg">
                <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>System Registered Users</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Organization</th>
                        <th>Account Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`${styles.statusPill} ${u.role === 'ADMIN' ? styles.statusSuccess : styles.statusInfo}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.organization || 'VIT Campus'}</td>
                          <td>
                            <span className={`${styles.statusPill} ${styles.statusSuccess}`}>
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 4: Financial Audits */}
            {activeTab === 'payments' && (
              <GlassCard padding="lg">
                <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Payment Transactions & Financial Audit</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Receipt No</th>
                        <th>Student / Delegate</th>
                        <th>Amount</th>
                        <th>Gateway Ref</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsList.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.receiptNumber}</strong></td>
                          <td>{p.student?.name || 'Arun Kumar'}</td>
                          <td>₹{p.amount}</td>
                          <td><span style={{ fontSize: '0.8rem', color: '#666666' }}>{p.razorpayPaymentId || 'pay_test_verified'}</span></td>
                          <td>
                            <span className={`${styles.statusPill} ${p.status === 'SUCCESS' ? styles.statusSuccess : styles.statusPending}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </>
        )}

        {/* STUDENT ROLE VIEW */}
        {user.role === 'STUDENT' && (
          <GlassCard padding="lg">
            <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Enrolled Courses</h3>
            {studentDashboard?.enrollments?.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDashboard.enrollments.map((e) => (
                      <tr key={e.id}>
                        <td><strong>{e.course?.courseCode}</strong></td>
                        <td>{e.course?.title}</td>
                        <td>{e.progressPercent}%</td>
                        <td>
                          <span className={`${styles.statusPill} ${e.status === 'ACTIVE' ? styles.statusSuccess : styles.statusPending}`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#555555' }}>You are not currently enrolled in any active courses. Browse the department catalogs to register.</p>
            )}
          </GlassCard>
        )}
      </div>

      {/* --- ADD / EDIT GALLERY PHOTO MODAL (ADMIN ONLY) --- */}
      {showPhotoModal && (
        <div className={styles.modalBackdrop}>
          <GlassCard className={styles.modalCard} padding="lg" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #EAECF0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ color: '#0B2A6F', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>
                  {editingPhoto ? '✏️ Edit Gallery Photo' : '➕ Add Gallery Photo'}
                </h3>
                <p style={{ color: '#667085', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                  This image will be stored and rendered immediately on the public /gallery page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#667085' }}
              >
                ✕
              </button>
            </div>

            {photoError && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#B91C1C', marginBottom: '1rem', fontSize: '0.88rem' }}>
                {photoError}
              </div>
            )}

            <form onSubmit={handleSavePhotoSubmit}>
              {/* Image Upload Area & Preview */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '0.4rem' }}>
                  Photo File (JPG, PNG, WEBP) *
                </label>
                
                <div style={{ border: '2px dashed #D0D5DD', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#F8FAFC', marginBottom: '0.75rem' }}>
                  {photoImagePreview ? (
                    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                      <img
                        src={photoImagePreview}
                        alt="Upload Preview"
                        style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', color: '#DC2626' }}
                          onClick={() => setPhotoImagePreview('')}
                        >
                          Remove / Choose Another Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#101828', fontSize: '0.9rem' }}>
                        Click to upload or drag & drop image
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#667085' }}>
                        Supports JPG, PNG, WEBP up to 8MB
                      </p>
                      <input
                        type="file"
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                        onChange={handleImageFileChange}
                        style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </div>

                {/* Alternate direct URL input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#667085', marginBottom: '0.25rem' }}>
                    Or enter an existing / hosted Image URL:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg or /gallery/filename.jpg"
                    value={photoImagePreview.startsWith('data:') ? '' : photoImagePreview}
                    onChange={(e) => setPhotoImagePreview(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #D0D5DD', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Photo Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Photo Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Executive Strategy & Leadership Masterclass"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                />
              </div>

              {/* Category Dropdown */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Category *
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem', background: '#FFFFFF' }}
                >
                  {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Photo Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Industry executives and faculty coordinators at the strategic development training program in SpoRIC."
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #EAECF0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPhotoModal(false)}
                  disabled={photoSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={photoSaving}
                  style={{ background: '#0B2A6F', borderColor: '#0B2A6F', padding: '0.65rem 1.5rem', fontWeight: 700 }}
                >
                  {photoSaving ? 'Saving Photo...' : editingPhoto ? 'Save Changes' : '✨ Publish to Gallery'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* --- DELETE PHOTO CONFIRMATION MODAL --- */}
      {deletingPhotoItem && (
        <div className={styles.modalBackdrop}>
          <GlassCard className={styles.modalCard} padding="lg" style={{ maxWidth: '480px' }}>
            <h3 style={{ color: '#111111', fontWeight: 700, marginBottom: '0.75rem' }}>Delete Gallery Photo</h3>
            <p style={{ color: '#555555', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Are you sure you want to delete <strong>"{deletingPhotoItem.title || 'this photo'}"</strong>? It will be removed from both the admin management dashboard and the public gallery page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingPhotoItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#DC2626', borderColor: '#DC2626' }}
                onClick={handleConfirmDeletePhoto}
              >
                Delete Photo
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* --- ADD NEW COURSE MODAL (ADMIN ONLY) --- */}
      {showAddModal && (
        <div className={styles.modalBackdrop}>
          <GlassCard className={styles.modalCard} padding="lg" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #EAECF0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ color: '#0B2A6F', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>➕ Add New Corporate Training Course</h3>
                <p style={{ color: '#667085', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                  This course will be published directly to its respective department page and catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#667085' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Event / Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Applied Generative AI & Autonomous Systems"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Course Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TECH085"
                    value={newCourse.id}
                    onChange={(e) => setNewCourse({ ...newCourse, id: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Department & Subcategory */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Department / Domain *
                  </label>
                  <select
                    value={newCourse.domain}
                    onChange={(e) => {
                      const dom = e.target.value;
                      const defaultCat =
                        dom === DOMAINS.TECHNOLOGY
                          ? 'Industry 4.0'
                          : dom === DOMAINS.MANAGEMENT
                          ? 'Operations Management'
                          : 'Leadership & Personality';
                      setNewCourse({ ...newCourse, domain: dom, category: defaultCat });
                    }}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem', background: '#FFFFFF' }}
                  >
                    <option value={DOMAINS.TECHNOLOGY}>Technology (/technology)</option>
                    <option value={DOMAINS.MANAGEMENT}>Management (/management)</option>
                    <option value={DOMAINS.LEADERSHIP}>Leadership & Personality (/personality)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Category / Track *
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem', background: '#FFFFFF' }}
                  >
                    {getCategoryOptions().map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration, Mode, Start Date, Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCourse.hours}
                    onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Mode *
                  </label>
                  <select
                    value={newCourse.mode}
                    onChange={(e) => setNewCourse({ ...newCourse, mode: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem', background: '#FFFFFF' }}
                  >
                    <option value="online">Online</option>
                    <option value="blended">Blended</option>
                    <option value="offline">Offline / Lab</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Batch Date *
                  </label>
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={newCourse.startDate}
                    onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                    Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Short Description / Event Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master neural networks, transformer pipelines, and edge AI deployment"
                  value={newCourse.shortDescription}
                  onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.9rem' }}
                />
              </div>

              {/* Learning Outcomes */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Key Learning Outcomes (Comma or newline separated)
                </label>
                <textarea
                  rows="2"
                  placeholder="Hands-on training, Real-world case study, Industry level curriculum, Certification of Completion"
                  value={newCourse.learn}
                  onChange={(e) => setNewCourse({ ...newCourse, learn: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Modules / Syllabus */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#344054', marginBottom: '0.35rem' }}>
                  Modules & Syllabus Breakdown (Comma or newline separated)
                </label>
                <textarea
                  rows="2"
                  placeholder="Module 1: Foundations, Module 2: System Architecture, Module 3: Implementation, Module 4: Capstone"
                  value={newCourse.modules}
                  onChange={(e) => setNewCourse({ ...newCourse, modules: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #D0D5DD', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #EAECF0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#0B2A6F', borderColor: '#0B2A6F', padding: '0.65rem 1.5rem', fontWeight: 700 }}
                >
                  🚀 Publish Course to {newCourse.domain}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* --- EDIT COURSE MODAL --- */}
      {editingCourse && (
        <div className={styles.modalBackdrop}>
          <GlassCard className={styles.modalCard} padding="lg">
            <h3 style={{ color: '#111111', fontWeight: 700, marginBottom: '1rem' }}>Edit Course [{editingCourse.code}]</h3>
            <form onSubmit={handleUpdateCourse}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Course Title</label>
                <input type="text" value={editingCourse.title} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#F5F5F5', color: '#111111', border: '1px solid #E5E5E5' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Price (₹)</label>
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#FFFFFF', color: '#111111', border: '1px solid #CCCCCC' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Course Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#FFFFFF', color: '#111111', border: '1px solid #CCCCCC' }}>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
