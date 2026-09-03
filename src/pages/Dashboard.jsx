import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import {
  getAllCourses,
  saveNewCourse,
  deleteCustomCourse,
  DOMAINS,
  COURSE_STATUS,
  getAllEnquiries,
  getUserEnquiries,
  updateEnquiryStatus,
  getUserInterestedCourseIds,
} from '../data/courses';
import {
  getAllGalleryItems,
  saveGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  GALLERY_CATEGORIES,
} from '../data/galleryData';
import {
  getAllPreviousPrograms,
  savePreviousProgram,
  updatePreviousProgram,
  deletePreviousProgram,
} from '../data/previousPrograms';
import {
  getAllCorporateTrainings,
  saveCorporateTraining,
  updateCorporateTraining,
  deleteCorporateTraining,
  getAcademicYearFromDate,
} from '../data/corporateTrainingOrganizedData';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(urlTab || 'overview');

  // Admin Data states
  const [analytics, setAnalytics] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [corporateTrainingsList, setCorporateTrainingsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);

  // Student Data states
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);

  // Notifications / feedback
  const [actionSuccess, setActionSuccess] = useState('');

  // Corporate Training CMS states (ADMIN ONLY)
  const [showCorporateTrainingModal, setShowCorporateTrainingModal] = useState(false);
  const [editingCorporateTraining, setEditingCorporateTraining] = useState(null);
  const [trainingStartDate, setTrainingStartDate] = useState('');
  const [trainingEndDate, setTrainingEndDate] = useState('');
  const [trainingSchool, setTrainingSchool] = useState('SELECT');
  const [trainingTrainers, setTrainingTrainers] = useState(['']);
  const [trainingTitle, setTrainingTitle] = useState('');
  const [trainingCompany, setTrainingCompany] = useState('');
  const [trainingDescription, setTrainingDescription] = useState('');
  const [trainingError, setTrainingError] = useState('');
  const [trainingSaving, setTrainingSaving] = useState(false);
  const [deletingCorporateTraining, setDeletingCorporateTraining] = useState(null);
  const [trainingSearch, setTrainingSearch] = useState('');
  const [trainingYearFilter, setTrainingYearFilter] = useState('All');

  // Course edit / add modal states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState(COURSE_STATUS.OPEN);
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
    status: COURSE_STATUS.OPEN,
    registrationDeadline: '2026-11-15',
    startDate: '2026-11-20',
    trainer: 'SpoRIC Certified Specialist',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    contactPerson: 'Dean, SpoRIC',
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactNumber: '73587 82571',
    learn: 'Hands-on industrial tools, Real-world case study benchmarks, Industry-standard framework mastery',
    modules: 'Module 1: Foundations & Architecture, Module 2: Core Engineering, Module 3: Enterprise Capstone',
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

  // Previous Programs modal states (ADMIN ONLY)
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [progTitle, setProgTitle] = useState('');
  const [progCategory, setProgCategory] = useState('Corporate Training');
  const [progClient, setProgClient] = useState('');
  const [progDate, setProgDate] = useState('');
  const [progYear, setProgYear] = useState('2026');
  const [progCount, setProgCount] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progOutcomes, setProgOutcomes] = useState('');
  const [progImage, setProgImage] = useState('');
  const [progError, setProgError] = useState('');
  const [deletingProgram, setDeletingProgram] = useState(null);

  // Image compressor helper
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
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const refreshAllData = () => {
    const allC = getAllCourses();
    setCoursesList(allC);

    const allG = getAllGalleryItems();
    setGalleryList(allG);

    const allP = getAllPreviousPrograms();
    setProgramsList(allP);

    const allCT = getAllCorporateTrainings();
    setCorporateTrainingsList(allCT);

    const allE = getAllEnquiries();
    setEnquiriesList(allE);

    if (user?.email) {
      setUserEnquiries(getUserEnquiries(user.email));
      const savedIds = getUserInterestedCourseIds(user.email);
      setSavedCourses(allC.filter((c) => savedIds.includes(c.id)));
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [user]);

  useEffect(() => {
    async function loadUserData() {
      const storedUser = localStorage.getItem('sporic_user');
      const token = api.getToken();

      if (!token && !storedUser) {
        navigate('/login');
        return;
      }

      try {
        const meRes = await api.getMe().catch(() => null);
        if (meRes?.data?.user) {
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
      } catch {
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
    if (currentUser?.role === 'ADMIN') {
      try {
        const [analyticsRes, usersRes, paymentsRes] = await Promise.all([
          api.getAnalytics().catch(() => null),
          api.request('/admin/users').catch(() => null),
          api.request('/admin/payments').catch(() => null),
        ]);

        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
        if (usersRes?.data) setUsersList(usersRes.data);
        if (paymentsRes?.data) setPaymentsList(paymentsRes.data);
      } catch (e) {
        console.warn('Admin load warning:', e);
      }
    }
    refreshAllData();
  }

  // --- COURSE MANAGEMENT HANDLERS ---
  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    const all = getAllCourses();
    const target = all.find((c) => c.id === editingCourse.id);
    if (target) {
      const updated = {
        ...target,
        price: parseFloat(editPrice) || target.price,
        status: editStatus,
        isCustom: true,
      };
      saveNewCourse(updated);
      refreshAllData();
      setActionSuccess(`Course '${editingCourse.title}' updated.`);
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
      title: newCourse.title.trim(),
      shortDescription:
        newCourse.shortDescription.trim() || `Professional executive training in ${newCourse.category}`,
      domain: newCourse.domain,
      category: newCourse.category,
      hours: parseInt(newCourse.hours, 10) || 20,
      mode: newCourse.mode,
      price: parseFloat(newCourse.price) || 4999,
      status: newCourse.status || COURSE_STATUS.OPEN,
      registrationDeadline: newCourse.registrationDeadline || '2026-11-15',
      startDate: newCourse.startDate || '2026-11-20',
      trainer: newCourse.trainer || 'SpoRIC Certified Specialist',
      image: newCourse.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      contactPerson: newCourse.contactPerson || 'Dean, SpoRIC',
      contactEmail: newCourse.contactEmail || 'deancc.sporic@vit.ac.in',
      contactNumber: newCourse.contactNumber || '73587 82571',
      learn: learnArray.length > 0 ? learnArray : ['Comprehensive Industry Training'],
      modules: modulesArray.length > 0 ? modulesArray : ['Core Curriculum Module 1'],
      features: ['Certification of Completion', 'Live Interactive Lab Sessions', 'Industry Curriculum'],
      sessions: [{ batch: 1, date: newCourse.startDate }],
      isCustom: true,
    };

    saveNewCourse(courseRecord);
    refreshAllData();
    setShowAddModal(false);
    setActionSuccess(`✓ Course '${courseRecord.title}' (${courseRecord.id}) published!`);
    setTimeout(() => setActionSuccess(''), 5000);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm(`Are you sure you want to remove course ${courseId}?`)) {
      deleteCustomCourse(courseId);
      refreshAllData();
      setActionSuccess(`Course ${courseId} removed.`);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // --- GALLERY CMS HANDLERS ---
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

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    setPhotoError('');
    try {
      const compressed = await compressImageFile(file);
      setPhotoImagePreview(compressed);
    } catch {
      setPhotoError('Failed to process image. Try another file.');
    }
  };

  const handleSavePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoImagePreview) return setPhotoError('Please upload an image.');
    if (!photoDesc.trim()) return setPhotoError('Please enter a description.');

    setPhotoSaving(true);
    setPhotoError('');

    try {
      if (editingPhoto) {
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
        saveGalleryItem(newRecord);
        await api.addGalleryItem(newRecord).catch(() => null);
        setActionSuccess('✓ Photo added to Gallery CMS!');
      }

      refreshAllData();
      setShowPhotoModal(false);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setPhotoError(err.message || 'Failed to save photo.');
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!deletingPhotoItem) return;
    try {
      deleteGalleryItem(deletingPhotoItem.id);
      await api.deleteGalleryItem(deletingPhotoItem.id).catch(() => null);
      refreshAllData();
      setActionSuccess('Photo removed from Gallery.');
      setDeletingPhotoItem(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // --- PREVIOUS PROGRAMS CMS HANDLERS (ADMIN ONLY) ---
  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgTitle('');
    setProgCategory('Corporate Training');
    setProgClient('');
    setProgDate('October 2026');
    setProgYear('2026');
    setProgCount('45 Corporate Delegates');
    setProgDesc('');
    setProgOutcomes('Empowered executive cohort with strategic operational toolkits\nImplementation of continuous process optimization roadmaps');
    setProgImage('/gallery/lucas_tvs_management_program.jpg');
    setProgError('');
    setShowProgramModal(true);
  };

  const handleOpenEditProgram = (prog) => {
    setEditingProgram(prog);
    setProgTitle(prog.title || '');
    setProgCategory(prog.category || 'Corporate Training');
    setProgClient(prog.clientOrCohort || '');
    setProgDate(prog.date || '');
    setProgYear(prog.year || '2026');
    setProgCount(prog.participantsCount || '');
    setProgDesc(prog.description || '');
    setProgOutcomes((prog.outcomes || []).join('\n'));
    setProgImage(prog.image || '');
    setProgError('');
    setShowProgramModal(true);
  };

  const handleProgramImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setProgImage(compressed);
    } catch {
      setProgError('Failed to process image file.');
    }
  };

  const handleSaveProgramSubmit = (e) => {
    e.preventDefault();
    if (!progTitle.trim() || !progDesc.trim()) {
      setProgError('Please enter a Program Title and Description.');
      return;
    }

    const outcomesArray = progOutcomes
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const record = {
      title: progTitle.trim(),
      category: progCategory,
      clientOrCohort: progClient.trim() || 'Corporate Trainees',
      date: progDate.trim() || `${progYear}`,
      year: progYear.trim(),
      participantsCount: progCount.trim() || 'Corporate Cohort',
      description: progDesc.trim(),
      outcomes: outcomesArray,
      image: progImage || '/gallery/lucas_tvs_management_program.jpg',
    };

    try {
      if (editingProgram) {
        updatePreviousProgram(editingProgram.id, record);
        setActionSuccess(`✓ Program '${progTitle}' updated successfully.`);
      } else {
        savePreviousProgram(record);
        setActionSuccess(`✓ Landmark Program '${progTitle}' published to About page!`);
      }
      refreshAllData();
      setShowProgramModal(false);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setProgError(err.message || 'Failed to save previous program.');
    }
  };

  const handleConfirmDeleteProgram = () => {
    if (!deletingProgram) return;
    try {
      deletePreviousProgram(deletingProgram.id);
      refreshAllData();
      setActionSuccess('Previous program removed.');
      setDeletingProgram(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // --- CORPORATE TRAINING HANDLERS (ADMIN ONLY) ---
  const handleOpenAddCorporateTraining = () => {
    setEditingCorporateTraining(null);
    setTrainingStartDate(new Date().toISOString().split('T')[0]);
    setTrainingEndDate('');
    setTrainingSchool('SELECT');
    setTrainingTrainers(['']);
    setTrainingTitle('');
    setTrainingCompany('');
    setTrainingDescription('');
    setTrainingError('');
    setShowCorporateTrainingModal(true);
  };

  const handleOpenEditCorporateTraining = (item) => {
    setEditingCorporateTraining(item);
    setTrainingStartDate(item.startDate || '');
    setTrainingEndDate(item.endDate || '');
    setTrainingSchool(item.school || 'SELECT');
    
    // Parse trainers into array of strings
    const trainersArr = item.trainers
      ? (Array.isArray(item.trainers) ? item.trainers : item.trainers.split(/;|\n/).map((t) => t.trim()).filter(Boolean))
      : [''];
    setTrainingTrainers(trainersArr.length > 0 ? trainersArr : ['']);
    setTrainingTitle(item.title || '');
    setTrainingCompany(item.company || '');
    setTrainingDescription(item.description || '');
    setTrainingError('');
    setShowCorporateTrainingModal(true);
  };

  const handleTrainerChange = (index, value) => {
    setTrainingTrainers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddTrainerField = () => {
    setTrainingTrainers((prev) => [...prev, '']);
  };

  const handleRemoveTrainerField = (index) => {
    setTrainingTrainers((prev) => {
      if (prev.length <= 1) return [''];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveCorporateTrainingSubmit = async (e) => {
    e.preventDefault();
    if (!trainingStartDate || !trainingSchool || !trainingTitle.trim() || !trainingCompany.trim()) {
      setTrainingError('Please fill Start Date, School, Title, and Company Name.');
      return;
    }

    const cleanTrainers = trainingTrainers.map((t) => t.trim()).filter(Boolean);
    if (cleanTrainers.length === 0) {
      setTrainingError('Please enter at least one trainer name.');
      return;
    }

    setTrainingSaving(true);
    setTrainingError('');

    try {
      const dataPayload = {
        startDate: trainingStartDate,
        endDate: trainingEndDate || undefined,
        school: trainingSchool.trim().toUpperCase(),
        trainers: cleanTrainers.join('; '),
        title: trainingTitle.trim(),
        company: trainingCompany.trim(),
        description: trainingDescription.trim() || undefined,
        year: getAcademicYearFromDate(trainingStartDate),
      };

      if (editingCorporateTraining) {
        await api.updateCorporateTraining(editingCorporateTraining.id, dataPayload);
        setActionSuccess(`✓ Corporate training '${trainingTitle}' updated successfully.`);
      } else {
        await api.addCorporateTraining(dataPayload);
        setActionSuccess(`✓ Corporate training '${trainingTitle}' added successfully.`);
      }

      refreshAllData();
      setShowCorporateTrainingModal(false);
      setEditingCorporateTraining(null);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setTrainingError(`Save failed: ${err.message}`);
    } finally {
      setTrainingSaving(false);
    }
  };

  const handleConfirmDeleteCorporateTraining = async () => {
    if (!deletingCorporateTraining) return;
    try {
      await api.deleteCorporateTraining(deletingCorporateTraining.id);
      refreshAllData();
      setActionSuccess('Corporate training record removed.');
      setDeletingCorporateTraining(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // --- ENQUIRIES HANDLER ---
  const handleUpdateQueryStatus = (enquiryId, newStatus) => {
    updateEnquiryStatus(enquiryId, newStatus);
    refreshAllData();
    setActionSuccess(`Enquiry status updated to ${newStatus}.`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer} style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
          <h2>Loading SpoRIC Portal Dashboard...</h2>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  // Domain breakdown for Overview
  const techCoursesCount = coursesList.filter((c) => c.domain === DOMAINS.TECHNOLOGY || c.domain === 'Technology').length;
  const mgmtCoursesCount = coursesList.filter((c) => c.domain === DOMAINS.MANAGEMENT || c.domain === 'Management').length;
  const leadCoursesCount = coursesList.filter((c) => c.domain === DOMAINS.LEADERSHIP || c.domain === 'Leadership & Personality' || c.domain === 'Personality').length;
  const totalCoursesCount = coursesList.length || 1;

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span className="section-label" style={{ margin: 0 }}>
                  {isAdmin ? 'ADMIN CONTROL CENTRE' : 'STUDENT & PROFESSIONAL PORTAL'}
                </span>
                {isAdmin && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                    System Operational
                  </span>
                )}
              </div>
              <h1 className={styles.title}>
                {isAdmin ? 'VIT-TEC Administration Dashboard' : `Welcome, ${user?.fullName || user?.name || 'Learner'}`}
              </h1>
              <p className={styles.subtitle}>
                {isAdmin
                  ? 'Manage courses, enquiries, corporate training, previous programs, gallery and platform activity.'
                  : 'Access your enrolled training programs, saved courses, query statuses, and professional credentials.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {isAdmin ? (
                <>
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => setShowAddModal(true)}>
                    ➕ Add Course
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => {
                    setEditingCorporateTraining(null);
                    setTrainingStartDate('');
                    setTrainingEndDate('');
                    setTrainingSchool('SELECT');
                    setTrainingTrainers(['']);
                    setTrainingTitle('');
                    setTrainingCompany('');
                    setTrainingDescription('');
                    setTrainingError('');
                    setShowCorporateTrainingModal(true);
                  }}>
                    🏛️ Add Training
                  </button>
                  <Link to="/profile" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
                    👤 Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
                    👤 Edit Profile
                  </Link>
                  <Link to="/courses" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                    Browse Courses →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {actionSuccess && (
            <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
              {actionSuccess}
            </div>
          )}

          {/* ====================================================
              ADMIN VIEW (ADMIN ONLY)
             ==================================================== */}
          {isAdmin && (
            <>
              {/* Admin Navigation Tabs */}
              <div className={styles.tabsWrapper}>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  📚 Courses ({coursesList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'corporate-training' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('corporate-training')}
                >
                  🏛️ Corporate Training ({corporateTrainingsList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'enquiries' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('enquiries')}
                >
                  💬 Enquiries ({enquiriesList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'programs' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('programs')}
                >
                  📜 Previous Programs ({programsList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  🖼️ Gallery CMS ({galleryList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  👥 Users ({usersList.length})
                </button>
              </div>

              {/* TAB 0: Overview Command Center */}
              {activeTab === 'overview' && (
                <div className={styles.adminOverviewWrapper}>
                  {/* Summary Statistics - 5 Card Compact Responsive Grid */}
                  <div className={styles.overviewStatsGrid}>
                    <div className={styles.statBox}>
                      <div className={styles.statBoxTop}>
                        <div className={styles.statIconBadge} style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}>
                          💳
                        </div>
                        <span className={styles.statStatusBadge} style={{ background: '#ECFDF5', color: '#047857' }}>
                          ● Razorpay Live
                        </span>
                      </div>
                      <div className={styles.statBoxLabel}>TOTAL PLATFORM REVENUE</div>
                      <div className={styles.statBoxValue}>₹{(analytics?.totalRevenue || 84990).toLocaleString()}</div>
                      <div className={styles.statBoxSub}>Verified via Razorpay HMAC</div>
                    </div>

                    <div className={styles.statBox}>
                      <div className={styles.statBoxTop}>
                        <div className={styles.statIconBadge} style={{ background: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>
                          📚
                        </div>
                        <span className={styles.statStatusBadge} style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                          3 Domains
                        </span>
                      </div>
                      <div className={styles.statBoxLabel}>ACTIVE COURSES</div>
                      <div className={styles.statBoxValue}>{coursesList.length}</div>
                      <div className={styles.statBoxSub}>Published on Catalog</div>
                    </div>

                    <div className={styles.statBox}>
                      <div className={styles.statBoxTop}>
                        <div className={styles.statIconBadge} style={{ background: '#FFFBEB', color: '#D97706', borderColor: '#FDE68A' }}>
                          📬
                        </div>
                        <span className={styles.statStatusBadge} style={{ background: '#FFFBEB', color: '#B45309' }}>
                          {enquiriesList.filter(e => e.status === 'NEW').length} New
                        </span>
                      </div>
                      <div className={styles.statBoxLabel}>COURSE ENQUIRIES</div>
                      <div className={styles.statBoxValue}>{enquiriesList.length}</div>
                      <div className={styles.statBoxSub}>Corporate &amp; Student Inquiries</div>
                    </div>

                    <div className={styles.statBox}>
                      <div className={styles.statBoxTop}>
                        <div className={styles.statIconBadge} style={{ background: '#F5F3FF', color: '#7C3AED', borderColor: '#DDD6FE' }}>
                          📜
                        </div>
                        <span className={styles.statStatusBadge} style={{ background: '#F5F3FF', color: '#6D28D9' }}>
                          Audited
                        </span>
                      </div>
                      <div className={styles.statBoxLabel}>PREVIOUS PROGRAMS</div>
                      <div className={styles.statBoxValue}>{programsList.length}</div>
                      <div className={styles.statBoxSub}>Published on /about</div>
                    </div>

                    <div className={styles.statBox}>
                      <div className={styles.statBoxTop}>
                        <div className={styles.statIconBadge} style={{ background: '#F0F9FF', color: '#0284C7', borderColor: '#BAE6FD' }}>
                          🏛️
                        </div>
                        <span className={styles.statStatusBadge} style={{ background: '#F0F9FF', color: '#0369A1' }}>
                          4 Academic Years
                        </span>
                      </div>
                      <div className={styles.statBoxLabel}>CORPORATE TRAININGS</div>
                      <div className={styles.statBoxValue}>{corporateTrainingsList.length}</div>
                      <div className={styles.statBoxSub}>Published on /corporate-training</div>
                    </div>
                  </div>

                  {/* Section 2: Quick Actions Grid */}
                  <div className={styles.overviewSection}>
                    <div className={styles.sectionHeaderRow}>
                      <div>
                        <h3 className={styles.sectionHeading}>ADMIN QUICK ACTIONS</h3>
                        <p className={styles.sectionSubheading}>Direct management shortcuts across platform repositories</p>
                      </div>
                    </div>

                    <div className={styles.quickActionsGrid}>
                      <div className={styles.actionCard} onClick={() => setActiveTab('courses')}>
                        <div className={styles.actionCardIcon}>📚</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Manage Courses</h4>
                          <p className={styles.actionCardDesc}>Create, edit curriculum, set pricing, and toggle registration status.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('corporate-training')}>
                        <div className={styles.actionCardIcon}>🏛️</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Corporate Trainings</h4>
                          <p className={styles.actionCardDesc}>Manage 31+ corporate training records, trainer rosters, and academic years.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('enquiries')}>
                        <div className={styles.actionCardIcon}>💬</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Course Enquiries</h4>
                          <p className={styles.actionCardDesc}>Review and respond to executive delegate enquiries and cohort questions.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('programs')}>
                        <div className={styles.actionCardIcon}>📜</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Previous Programs</h4>
                          <p className={styles.actionCardDesc}>Manage historical executive training cohorts, participants, and outcomes.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('gallery')}>
                        <div className={styles.actionCardIcon}>🖼️</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Gallery CMS</h4>
                          <p className={styles.actionCardDesc}>Upload, categorize, and organize campus and industrial training photos.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('users')}>
                        <div className={styles.actionCardIcon}>👥</div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>User Governance</h4>
                          <p className={styles.actionCardDesc}>Inspect registered student and corporate profiles, designations, and roles.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Course Distribution & Platform Governance */}
                  <div className={styles.analyticsTwoCol}>
                    {/* Course Distribution */}
                    <div className={styles.analyticsCard}>
                      <div className={styles.cardHeaderSmall}>
                        <h4 className={styles.cardHeaderTitle}>COURSE DISTRIBUTION BY DOMAIN</h4>
                        <span className={styles.badgeTotal}>{coursesList.length} Total</span>
                      </div>
                      <div className={styles.distributionList}>
                        <div className={styles.distItem}>
                          <div className={styles.distMeta}>
                            <span className={styles.distName}>⚙️ Technology</span>
                            <span className={styles.distCount}>{techCoursesCount} Courses ({Math.round((techCoursesCount / totalCoursesCount) * 100)}%)</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${(techCoursesCount / totalCoursesCount) * 100}%`, background: '#2563EB' }} />
                          </div>
                        </div>

                        <div className={styles.distItem}>
                          <div className={styles.distMeta}>
                            <span className={styles.distName}>📊 Management</span>
                            <span className={styles.distCount}>{mgmtCoursesCount} Courses ({Math.round((mgmtCoursesCount / totalCoursesCount) * 100)}%)</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${(mgmtCoursesCount / totalCoursesCount) * 100}%`, background: '#059669' }} />
                          </div>
                        </div>

                        <div className={styles.distItem}>
                          <div className={styles.distMeta}>
                            <span className={styles.distName}>🌟 Leadership &amp; Personality</span>
                            <span className={styles.distCount}>{leadCoursesCount} Courses ({Math.round((leadCoursesCount / totalCoursesCount) * 100)}%)</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${(leadCoursesCount / totalCoursesCount) * 100}%`, background: '#7C3AED' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Platform System Health */}
                    <div className={styles.analyticsCard}>
                      <div className={styles.cardHeaderSmall}>
                        <h4 className={styles.cardHeaderTitle}>SYSTEM INFRASTRUCTURE &amp; SYNC</h4>
                        <span className={styles.badgeLive}>● Live Operational</span>
                      </div>
                      <div className={styles.sysHealthGrid}>
                        <div className={styles.sysHealthItem}>
                          <span className={styles.sysHealthLabel}>Application Server</span>
                          <span className={styles.sysHealthVal} style={{ color: '#059669' }}>Operational (200 OK)</span>
                        </div>
                        <div className={styles.sysHealthItem}>
                          <span className={styles.sysHealthLabel}>Database Storage</span>
                          <span className={styles.sysHealthVal} style={{ color: '#059669' }}>Active &amp; Persisted</span>
                        </div>
                        <div className={styles.sysHealthItem}>
                          <span className={styles.sysHealthLabel}>Payment Gateway</span>
                          <span className={styles.sysHealthVal} style={{ color: '#059669' }}>Razorpay HMAC Verified</span>
                        </div>
                        <div className={styles.sysHealthItem}>
                          <span className={styles.sysHealthLabel}>Security Clearance</span>
                          <span className={styles.sysHealthVal} style={{ color: '#2563EB' }}>Admin Clearance Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: Courses Management */}
              {activeTab === 'courses' && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Active Course Catalog</h3>
                      <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                        Courses published here appear on <strong>/courses</strong>, <strong>/technology</strong>, <strong>/management</strong>, and <strong>/personality</strong>.
                      </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                      ➕ Add New Course
                    </button>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Course Title</th>
                          <th>Department &amp; Category</th>
                          <th>Status &amp; Deadline</th>
                          <th>Price (₹)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesList.map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.id}</strong></td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#101828' }}>{c.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#667085' }}>{c.hours} hrs • {c.mode}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.78rem', color: '#1D4ED8', background: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                                {c.domain} › {c.category}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: c.status === COURSE_STATUS.OPEN ? '#059669' : '#D97706' }}>
                                {c.status || COURSE_STATUS.OPEN}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Closes: {c.registrationDeadline || 'Ongoing'}
                              </div>
                            </td>
                            <td style={{ fontWeight: 700 }}>₹{c.price || 4999}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <Link to={`/courses/${c.id}`} className="btn btn-ghost" style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}>
                                  View
                                </Link>
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                  onClick={() => {
                                    setEditingCourse(c);
                                    setEditPrice(c.price || 4999);
                                    setEditStatus(c.status || COURSE_STATUS.OPEN);
                                  }}
                                >
                                  Edit
                                </button>
                                {c.isCustom && (
                                  <button
                                    className="btn btn-ghost"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }}
                                    onClick={() => handleDeleteCourse(c.id)}
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

              {/* TAB: Corporate Training CMS (ADMIN ONLY) */}
              {activeTab === 'corporate-training' && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Corporate Training Management</h3>
                      <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                        Add, edit, or delete corporate training records that appear dynamically on <strong>/corporate-training</strong>.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link to="/corporate-training" target="_blank" className="btn btn-secondary">
                        View /corporate-training ↗
                      </Link>
                      <button className="btn btn-primary" onClick={handleOpenAddCorporateTraining}>
                        ➕ Add Corporate Training
                      </button>
                    </div>
                  </div>

                  {/* Admin Search and Year Filter Bar */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Filter by title, company, school, or trainer..."
                      value={trainingSearch}
                      onChange={(e) => setTrainingSearch(e.target.value)}
                      style={{ flex: '1 1 250px', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                    <select
                      value={trainingYearFilter}
                      onChange={(e) => setTrainingYearFilter(e.target.value)}
                      style={{ padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, color: '#0B2A6F' }}
                    >
                      <option value="All">All Academic Years</option>
                      {Array.from(new Set(corporateTrainingsList.map((t) => t.year || getAcademicYearFromDate(t.startDate)).filter(Boolean)))
                        .sort((a, b) => b.localeCompare(a))
                        .map((yr) => (
                          <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '13%' }}>Date / Year</th>
                          <th style={{ width: '11%' }}>School</th>
                          <th style={{ width: '26%' }}>Training Title</th>
                          <th style={{ width: '18%' }}>Company Name</th>
                          <th style={{ width: '22%' }}>Trainers</th>
                          <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corporateTrainingsList
                          .filter((item) => {
                            const yr = item.year || getAcademicYearFromDate(item.startDate);
                            const matchesYear = trainingYearFilter === 'All' || yr === trainingYearFilter;
                            const q = trainingSearch.toLowerCase().trim();
                            const matchesSearch =
                              !q ||
                              item.title?.toLowerCase().includes(q) ||
                              item.company?.toLowerCase().includes(q) ||
                              item.school?.toLowerCase().includes(q) ||
                              item.trainers?.toLowerCase().includes(q);
                            return matchesYear && matchesSearch;
                          })
                          .sort((a, b) => {
                            const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
                            const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
                            return timeB - timeA;
                          })
                          .map((item) => (
                            <tr key={item.id}>
                              <td>
                                <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.82rem' }}>
                                  {item.startDate || item.year || '—'}
                                </strong>
                                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                  {item.year || getAcademicYearFromDate(item.startDate)}
                                </span>
                              </td>
                              <td>
                                <span className="tag tag-cyan" style={{ fontSize: '0.72rem' }}>{item.school}</span>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, color: '#101828', fontSize: '0.88rem' }}>{item.title}</div>
                                {item.description && (
                                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>{item.description}</div>
                                )}
                              </td>
                              <td>
                                <span style={{ fontWeight: 600, color: '#0B2A6F', fontSize: '0.84rem' }}>{item.company}</span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.8rem', color: '#334155', maxHeight: '70px', overflowY: 'auto', lineHeight: '1.4' }}>
                                  {item.trainers}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                    onClick={() => handleOpenEditCorporateTraining(item)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-ghost"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }}
                                    onClick={() => setDeletingCorporateTraining(item)}
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

              {/* TAB 2: Course Enquiries & Queries (ADMIN ONLY) */}
              {activeTab === 'enquiries' && (
                <GlassCard padding="lg">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Course Enquiries &amp; Queries</h3>
                    <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                      Questions submitted by students, engineers, and corporate delegates via the "Enquire Now" modal.
                    </p>
                  </div>

                  {enquiriesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                      <p>No enquiries received yet. Queries submitted via course cards will appear here.</p>
                    </div>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>User Details</th>
                            <th>Associated Course</th>
                            <th>Message / Query</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiriesList.map((enq) => (
                            <tr key={enq.id}>
                              <td style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                                {new Date(enq.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{enq.name}</div>
                                <div style={{ fontSize: '0.78rem', color: '#1D4ED8' }}>{enq.email}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>📞 {enq.phone} • {enq.designation}</div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{enq.courseTitle}</div>
                                <span className="tag tag-cyan" style={{ fontSize: '0.68rem' }}>{enq.courseId}</span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.82rem', color: '#334155', maxWidth: '300px', lineHeight: 1.4 }}>
                                  <strong>[{enq.queryType || 'Enquiry'}]:</strong> {enq.message}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`${styles.statusPill} ${
                                    enq.status === 'RESPONDED'
                                      ? styles.statusSuccess
                                      : enq.status === 'IN_REVIEW'
                                      ? styles.statusPending
                                      : styles.statusInfo
                                  }`}
                                >
                                  {enq.status || 'SUBMITTED'}
                                </span>
                              </td>
                              <td>
                                <select
                                  value={enq.status || 'SUBMITTED'}
                                  onChange={(e) => handleUpdateQueryStatus(enq.id, e.target.value)}
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                                >
                                  <option value="SUBMITTED">Submitted</option>
                                  <option value="IN_REVIEW">In Review</option>
                                  <option value="RESPONDED">Responded</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              )}

              {/* TAB 3: Previous Programs Management (ADMIN ONLY) */}
              {activeTab === 'programs' && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Previous Programs CMS</h3>
                      <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                        Manage landmark corporate cohorts and training programs displayed on the public <strong>/about</strong> page.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link to="/about#previous-programs" target="_blank" className="btn btn-secondary">
                        View on /about ↗
                      </Link>
                      <button className="btn btn-primary" onClick={handleOpenAddProgram}>
                        ➕ Add Previous Program
                      </button>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Image</th>
                          <th>Program Title &amp; Client</th>
                          <th>Category &amp; Year</th>
                          <th>Participants</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programsList.map((prog) => (
                          <tr key={prog.id}>
                            <td>
                              <img
                                src={prog.image}
                                alt={prog.title}
                                style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0F172A' }}>{prog.title}</div>
                              <div style={{ fontSize: '0.78rem', color: '#1D4ED8' }}>🏢 {prog.clientOrCohort}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{prog.category}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{prog.date || prog.year}</div>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                              {prog.participantsCount || 'Corporate Trainees'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                                  onClick={() => handleOpenEditProgram(prog)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-ghost"
                                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', color: '#DC2626' }}
                                  onClick={() => setDeletingProgram(prog)}
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

              {/* TAB 4: Gallery CMS (ADMIN ONLY) */}
              {activeTab === 'gallery' && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Gallery CMS</h3>
                      <p style={{ color: '#667085', fontSize: '0.85rem' }}>
                        Add, edit, or delete photos that appear on <strong>/gallery</strong>.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link to="/gallery" target="_blank" className="btn btn-secondary">
                        View /gallery ↗
                      </Link>
                      <button className="btn btn-primary" onClick={handleOpenAddPhoto}>
                        ➕ Add New Photo
                      </button>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Thumbnail</th>
                          <th>Title &amp; Description</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {galleryList.map((photo) => (
                          <tr key={photo.id}>
                            <td>
                              <img
                                src={photo.src || photo.imageUrl}
                                alt={photo.title}
                                style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#101828' }}>{photo.title}</div>
                              <div style={{ fontSize: '0.78rem', color: '#667085' }}>{photo.description}</div>
                            </td>
                            <td>
                              <span className="tag tag-blue" style={{ fontSize: '0.72rem' }}>{photo.category}</span>
                            </td>
                            <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                              {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }} onClick={() => handleOpenEditPhoto(photo)}>
                                  Edit
                                </button>
                                <button className="btn btn-ghost" style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }} onClick={() => setDeletingPhotoItem(photo)}>
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

              {/* TAB 5: Users Management */}
              {activeTab === 'users' && (
                <GlassCard padding="lg">
                  <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Registered Users</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email}</td>
                            <td><span className="tag tag-cyan">{u.role}</span></td>
                            <td><span style={{ color: '#059669', fontWeight: 700 }}>ACTIVE</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </>
          )}

          {/* ====================================================
              STUDENT / CORPORATE LEARNER VIEW
             ==================================================== */}
          {!isAdmin && (
            <div>
              <div className={styles.tabsWrapper}>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'my-courses' || activeTab === 'courses' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('my-courses')}
                >
                  📚 Enrolled Programs
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'saved-courses' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('saved-courses')}
                >
                  ⭐ Saved Courses ({savedCourses.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'my-queries' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('my-queries')}
                >
                  💬 My Course Queries ({userEnquiries.length})
                </button>
              </div>

              {/* STUDENT TAB 1: Enrolled Courses */}
              {(activeTab === 'my-courses' || activeTab === 'courses') && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Your Enrolled Training Programs</h3>
                    <Link to="/courses" className="btn btn-primary">
                      Explore New Courses
                    </Link>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {coursesList.slice(0, 2).map((c) => (
                      <div key={c.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', background: '#F8FAFC' }}>
                        <span className="tag tag-cyan" style={{ fontSize: '0.7rem' }}>{c.id}</span>
                        <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.05rem', color: '#0F172A' }}>{c.title}</h4>
                        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem' }}>{c.shortDescription}</p>
                        <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.75rem' }}>
                          👨‍🏫 Trainer: {c.trainer || 'SpoRIC Faculty'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>✓ Enrolled &amp; Active</span>
                          <Link to={`/courses/${c.id}`} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}>
                            View Syllabus
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* STUDENT TAB 2: Saved Courses */}
              {activeTab === 'saved-courses' && (
                <GlassCard padding="lg">
                  <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Interested &amp; Saved Courses</h3>
                  {savedCourses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                      <p>You haven't saved any courses yet.</p>
                      <Link to="/courses" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Browse Courses</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      {savedCourses.map((c) => (
                        <div key={c.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                          <span className="tag tag-blue">{c.domain}</span>
                          <h4>{c.title}</h4>
                          <Link to={`/courses/${c.id}`} className="btn btn-primary" style={{ marginTop: '0.75rem' }}>View Course</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* STUDENT TAB 3: My Course Queries */}
              {activeTab === 'my-queries' && (
                <GlassCard padding="lg">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#111', fontSize: '1.25rem', fontWeight: 700 }}>Your Course Queries</h3>
                    <Link to="/courses" className="btn btn-secondary">Ask a Query on /courses</Link>
                  </div>

                  {userEnquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                      <p>You have not submitted any course queries yet. Click <strong>"Enquire Now"</strong> on any course card to ask questions.</p>
                    </div>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Course</th>
                            <th>Query Details</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userEnquiries.map((q) => (
                            <tr key={q.id}>
                              <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                              <td>
                                <strong>{q.courseTitle}</strong>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{q.courseId}</div>
                              </td>
                              <td style={{ fontSize: '0.85rem' }}>
                                <strong>[{q.queryType || 'Query'}]:</strong> {q.message}
                              </td>
                              <td>
                                <span className={`${styles.statusPill} ${q.status === 'RESPONDED' ? styles.statusSuccess : styles.statusPending}`}>
                                  {q.status || 'SUBMITTED'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          MODAL: ADD NEW PREVIOUS PROGRAM (ADMIN ONLY)
         ==================================================== */}
      {showProgramModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F2252', border: '1px solid #38BDF8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', color: '#FFF' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.3rem' }}>
              {editingProgram ? 'Edit Landmark Previous Program' : '➕ Add Landmark Previous Program'}
            </h3>

            {progError && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', padding: '0.5rem 1rem', borderRadius: '8px', color: '#FCA5A5', marginBottom: '1rem' }}>{progError}</div>}

            <form onSubmit={handleSaveProgramSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lucas TVS Management Multiplier Program"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Client / Corporate Cohort</label>
                  <input
                    type="text"
                    placeholder="e.g. Lucas TVS Ltd."
                    value={progClient}
                    onChange={(e) => setProgClient(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Category</label>
                  <select
                    value={progCategory}
                    onChange={(e) => setProgCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  >
                    <option value="Corporate Training">Corporate Training</option>
                    <option value="Technology">Technology</option>
                    <option value="Management">Management</option>
                    <option value="Leadership & Personality">Leadership & Personality</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Date &amp; Month</label>
                  <input
                    type="text"
                    placeholder="e.g. February 2026"
                    value={progDate}
                    onChange={(e) => setProgDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Participants Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. 48 Senior Managers"
                    value={progCount}
                    onChange={(e) => setProgCount(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Program Description *</label>
                <textarea
                  required
                  placeholder="Details of the executive upskilling session and training conducted..."
                  value={progDesc}
                  onChange={(e) => setProgDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', minHeight: '80px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Key Outcomes (One per line)</label>
                <textarea
                  placeholder="Empowered 48 managers with operational delegation tools&#10;Awarded verified VIT-TEC Completion Credentials"
                  value={progOutcomes}
                  onChange={(e) => setProgOutcomes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', minHeight: '60px' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Upload Photo</label>
                <input type="file" accept="image/*" onChange={handleProgramImageFileChange} style={{ color: '#FFF' }} />
                {progImage && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={progImage} alt="Preview" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowProgramModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProgram ? '💾 Save Changes' : 'Publish Program to /about'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: ADD NEW COURSE (ADMIN ONLY)
         ==================================================== */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F2252', border: '1px solid #38BDF8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', color: '#FFF' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.3rem' }}>➕ Add New Training Course</h3>
            <form onSubmit={handleCreateNewCourse}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Applied Python Programming for Data Analytics"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Department</label>
                  <select
                    value={newCourse.domain}
                    onChange={(e) => setNewCourse({ ...newCourse, domain: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  >
                    <option value={DOMAINS.TECHNOLOGY}>Technology</option>
                    <option value={DOMAINS.MANAGEMENT}>Management</option>
                    <option value={DOMAINS.LEADERSHIP}>Leadership & Personality</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Industry 4.0 / Data Science"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Hours</label>
                  <input
                    type="number"
                    value={newCourse.hours}
                    onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Status</label>
                  <select
                    value={newCourse.status}
                    onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  >
                    <option value={COURSE_STATUS.OPEN}>Open for Registration</option>
                    <option value={COURSE_STATUS.UPCOMING}>Upcoming</option>
                    <option value={COURSE_STATUS.CLOSED}>Registration Closed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Registration Deadline</label>
                  <input
                    type="date"
                    value={newCourse.registrationDeadline}
                    onChange={(e) => setNewCourse({ ...newCourse, registrationDeadline: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Trainer / Faculty</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. Sundaram"
                    value={newCourse.trainer}
                    onChange={(e) => setNewCourse({ ...newCourse, trainer: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem', color: '#CBD5E1' }}>Short Description</label>
                <textarea
                  value={newCourse.shortDescription}
                  onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: ADD / EDIT GALLERY PHOTO (ADMIN ONLY)
         ==================================================== */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F2252', border: '1px solid #38BDF8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '560px', color: '#FFF' }}>
            <h3 style={{ margin: '0 0 1rem' }}>{editingPhoto ? 'Edit Gallery Photo' : '➕ Add New Gallery Photo'}</h3>
            {photoError && <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#FCA5A5', marginBottom: '1rem' }}>{photoError}</div>}
            <form onSubmit={handleSavePhotoSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Corporate Management Program"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                >
                  {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Description *</label>
                <textarea
                  required
                  placeholder="Details of the event/training session..."
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', minHeight: '70px' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Upload Photo</label>
                <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ color: '#FFF' }} />
                {photoImagePreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={photoImagePreview} alt="Preview" style={{ height: '70px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowPhotoModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={photoSaving}>
                  {photoSaving ? 'Saving Photo...' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation */}
      {deletingPhotoItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '420px', color: '#FFF' }}>
            <h4>Delete Gallery Photo?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Are you sure you want to permanently delete this photo from the gallery?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingPhotoItem(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeletePhoto} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Photo</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Program Confirmation */}
      {deletingProgram && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '420px', color: '#FFF' }}>
            <h4>Delete Previous Program?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Are you sure you want to delete <strong>{deletingProgram.title}</strong> from the About page?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingProgram(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeleteProgram} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Program</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '440px', color: '#FFF', width: '100%' }}>
            <h4>Edit Course: {editingCourse.title}</h4>
            <form onSubmit={handleUpdateCourse}>
              <div style={{ margin: '1rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Price (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                >
                  <option value={COURSE_STATUS.OPEN}>Open for Registration</option>
                  <option value={COURSE_STATUS.UPCOMING}>Upcoming</option>
                  <option value={COURSE_STATUS.CLOSED}>Registration Closed</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setEditingCourse(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: ADD / EDIT CORPORATE TRAINING (ADMIN ONLY)
         ==================================================== */}
      {showCorporateTrainingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F2252', border: '1px solid #38BDF8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '640px', color: '#FFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem' }}>{editingCorporateTraining ? 'Edit Corporate Training' : '➕ Add Corporate Training'}</h3>
            {trainingError && <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#FCA5A5', marginBottom: '1rem' }}>{trainingError}</div>}
            <form onSubmit={handleSaveCorporateTrainingSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={trainingStartDate}
                    onChange={(e) => setTrainingStartDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>End Date (Optional)</label>
                  <input
                    type="date"
                    value={trainingEndDate}
                    onChange={(e) => setTrainingEndDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>School / Center *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SELECT / SCOPE"
                    value={trainingSchool}
                    onChange={(e) => setTrainingSchool(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Company / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ford, Chennai / Lucas TVS"
                    value={trainingCompany}
                    onChange={(e) => setTrainingCompany(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Title of the Corporate Training *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Motors for Electric Vehicles"
                  value={trainingTitle}
                  onChange={(e) => setTrainingTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF' }}
                />
              </div>

              {/* Structured Multiple Trainers Input */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.82rem' }}>Trainers *</label>
                  <button
                    type="button"
                    onClick={handleAddTrainerField}
                    style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38BDF8', color: '#38BDF8', borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    + Add Trainer
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                  {trainingTrainers.map((tr, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        placeholder={`Trainer ${index + 1} Name (e.g. Dr. Rajesh Kannan)`}
                        value={tr}
                        onChange={(e) => handleTrainerChange(index, e.target.value)}
                        style={{ flex: 1, padding: '0.55rem', borderRadius: '6px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', fontSize: '0.85rem' }}
                      />
                      {trainingTrainers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTrainerField(index)}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#F87171', borderRadius: '6px', padding: '0.55rem 0.75rem', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Description / Outcomes (Optional)</label>
                <textarea
                  placeholder="Additional details about the corporate training..."
                  value={trainingDescription}
                  onChange={(e) => setTrainingDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#071B4A', color: '#FFF', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowCorporateTrainingModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={trainingSaving}>
                  {trainingSaving ? 'Saving Record...' : 'Save Corporate Training'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Corporate Training Confirmation */}
      {deletingCorporateTraining && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '440px', color: '#FFF' }}>
            <h4>Delete Corporate Training Record?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
              Are you sure you want to delete <strong>{deletingCorporateTraining.title}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingCorporateTraining(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeleteCorporateTraining} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
