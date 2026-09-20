import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import AdminModal from '../components/AdminModal';
import modalStyles from '../components/AdminModal.module.css';
import CmsSectionHeader from '../components/CmsSectionHeader';
import {
  OverviewIcon,
  BookIcon,
  BuildingIcon,
  MessageIcon,
  ScrollIcon,
  ImageIcon,
  BannerIcon,
  UsersIcon,
  CreditCardIcon,
  UserIcon,
  PlusIcon,
  GearIcon,
  ChartIcon,
  StarIcon,
  PhoneIcon,
  AwardIcon,
  CheckIcon,
  XIcon,
} from '../components/DashboardIcons';
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
  getAllBanners,
  saveBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
  moveBanner,
} from '../data/bannersData';
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
import {
  getAllTestimonials,
  saveTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../data/testimonialsData';
import {
  getNaacData,
  updateNaacData,
  getAllRankings,
  saveRanking,
  updateRanking,
  deleteRanking,
} from '../data/rankingsData';
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
  const [bannersList, setBannersList] = useState([]);
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
  const [courseImagePreview, setCourseImagePreview] = useState('');
  const [courseImageError, setCourseImageError] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImageError, setEditImageError] = useState('');
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
  const [photoCompany, setPhotoCompany] = useState('');
  const [photoImagePreview, setPhotoImagePreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoSaving, setPhotoSaving] = useState(false);
  const [deletingPhotoItem, setDeletingPhotoItem] = useState(null);

  // Banner CMS modal states (ADMIN ONLY)
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerAlt, setBannerAlt] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerOrder, setBannerOrder] = useState(0);
  const [bannerError, setBannerError] = useState('');
  const [bannerSaving, setBannerSaving] = useState(false);
  const [deletingBannerItem, setDeletingBannerItem] = useState(null);

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

  // Corporate Testimonials modal states (ADMIN ONLY)
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialDesignation, setTestimonialDesignation] = useState('');
  const [testimonialCompany, setTestimonialCompany] = useState('');
  const [testimonialError, setTestimonialError] = useState('');
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);
  const [testimonialSearch, setTestimonialSearch] = useState('');

  // University Rankings & Accreditations states (ADMIN ONLY)
  const [rankingsListState, setRankingsListState] = useState([]);
  const [naacDataState, setNaacDataState] = useState(null);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [editingRanking, setEditingRanking] = useState(null);
  const [rankingAgency, setRankingAgency] = useState('');
  const [rankingYear, setRankingYear] = useState(new Date().getFullYear().toString());
  const [rankingValue, setRankingValue] = useState('');
  const [rankingCategory, setRankingCategory] = useState('');
  const [rankingScope, setRankingScope] = useState('National');
  const [rankingDesc, setRankingDesc] = useState('');
  const [rankingError, setRankingError] = useState('');
  const [rankingSaving, setRankingSaving] = useState(false);
  const [deletingRanking, setDeletingRanking] = useState(null);
  const [rankingSearch, setRankingSearch] = useState('');

  // NAAC Accreditation edit modal states
  const [showNaacModal, setShowNaacModal] = useState(false);
  const [naacAgency, setNaacAgency] = useState('');
  const [naacFullName, setNaacFullName] = useState('');
  const [naacGrade, setNaacGrade] = useState('');
  const [naacScore, setNaacScore] = useState('');
  const [naacCycle, setNaacCycle] = useState('');
  const [naacDesc, setNaacDesc] = useState('');
  const [naacError, setNaacError] = useState('');
  const [naacSaving, setNaacSaving] = useState(false);

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

    const allB = getAllBanners();
    setBannersList(allB);

    const allP = getAllPreviousPrograms();
    setProgramsList(allP);

    const allCT = getAllCorporateTrainings();
    setCorporateTrainingsList(allCT);

    const allE = getAllEnquiries();
    setEnquiriesList(allE);

    const allT = getAllTestimonials();
    setTestimonialsList(allT);

    const allR = getAllRankings();
    setRankingsListState(allR);

    const naac = getNaacData();
    setNaacDataState(naac);

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
    const handleTestimonialsUpdate = () => {
      setTestimonialsList(getAllTestimonials());
    };
    const handleRankingsUpdate = () => {
      setRankingsListState(getAllRankings());
      setNaacDataState(getNaacData());
    };
    window.addEventListener('sporic_testimonials_updated', handleTestimonialsUpdate);
    window.addEventListener('sporic_rankings_updated', handleRankingsUpdate);
    window.addEventListener('storage', handleTestimonialsUpdate);
    window.addEventListener('storage', handleRankingsUpdate);
    return () => {
      window.removeEventListener('sporic_testimonials_updated', handleTestimonialsUpdate);
      window.removeEventListener('sporic_rankings_updated', handleRankingsUpdate);
      window.removeEventListener('storage', handleTestimonialsUpdate);
      window.removeEventListener('storage', handleRankingsUpdate);
    };
  }, []);

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
        image: editImagePreview || target.image,
        isCustom: true,
      };
      saveNewCourse(updated);
      refreshAllData();
      setActionSuccess(`Course '${editingCourse.title}' updated.`);
      setEditingCourse(null);
      setEditImagePreview('');
      setEditImageError('');
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
      image: courseImagePreview || newCourse.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
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
    setCourseImagePreview('');
    setCourseImageError('');
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
    setPhotoCompany('');
    setPhotoImagePreview('');
    setPhotoError('');
    setShowPhotoModal(true);
  };

  const handleOpenEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setPhotoTitle(photo.title || '');
    setPhotoDesc(photo.description || '');
    setPhotoCategory(photo.category || 'Corporate Training');
    setPhotoCompany(photo.companyName || photo.company || '');
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

  const handleCourseImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setCourseImageError('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    setCourseImageError('');
    try {
      const compressed = await compressImageFile(file);
      setCourseImagePreview(compressed);
    } catch {
      setCourseImageError('Failed to process image. Try another file.');
    }
  };

  const handleEditCourseImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setEditImageError('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    setEditImageError('');
    try {
      const compressed = await compressImageFile(file);
      setEditImagePreview(compressed);
    } catch {
      setEditImageError('Failed to process image. Try another file.');
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
          companyName: photoCompany.trim(),
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
          companyName: photoCompany.trim(),
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

  // --- BANNER CMS HANDLERS (ADMIN ONLY) ---
  const handleOpenAddBanner = () => {
    const all = getAllBanners();
    const nextOrder = all.length > 0 ? Math.max(...all.map((b) => b.order || 0)) + 1 : 1;
    setEditingBanner(null);
    setBannerTitle('');
    setBannerAlt('');
    setBannerDesc('');
    setBannerImagePreview('');
    setBannerActive(true);
    setBannerOrder(nextOrder);
    setBannerError('');
    setShowBannerModal(true);
  };

  const handleOpenEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerTitle(banner.title || '');
    setBannerAlt(banner.alt || '');
    setBannerDesc(banner.description || '');
    setBannerImagePreview(banner.src || banner.imageUrl || '');
    setBannerActive(banner.isActive !== false);
    setBannerOrder(banner.order ?? 1);
    setBannerError('');
    setShowBannerModal(true);
  };

  const handleBannerFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setBannerError('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    setBannerError('');
    try {
      const compressed = await compressImageFile(file);
      setBannerImagePreview(compressed);
    } catch {
      setBannerError('Failed to process image. Try another file.');
    }
  };

  const handleSaveBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerImagePreview) return setBannerError('Please upload a banner image.');
    if (!bannerTitle.trim()) return setBannerError('Please enter a banner title.');

    setBannerSaving(true);
    setBannerError('');

    try {
      const record = {
        title: bannerTitle.trim(),
        alt: bannerAlt.trim() || bannerTitle.trim(),
        description: bannerDesc.trim(),
        src: bannerImagePreview,
        imageUrl: bannerImagePreview,
        isActive: bannerActive,
        order: parseInt(bannerOrder, 10) || 1,
      };

      if (editingBanner) {
        updateBanner(editingBanner.id, record);
        setActionSuccess('Banner updated successfully.');
      } else {
        saveBanner({ ...record, createdAt: new Date().toISOString() });
        setActionSuccess('✓ Banner added to the homepage Hero!');
      }

      refreshAllData();
      setShowBannerModal(false);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setBannerError(err.message || 'Failed to save banner.');
    } finally {
      setBannerSaving(false);
    }
  };

  const handleConfirmDeleteBanner = () => {
    if (!deletingBannerItem) return;
    try {
      deleteBanner(deletingBannerItem.id);
      refreshAllData();
      setActionSuccess('Banner removed from homepage Hero.');
      setDeletingBannerItem(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to delete banner: ${err.message}`);
    }
  };

  const handleToggleBannerActive = (banner) => {
    try {
      toggleBannerActive(banner.id);
      refreshAllData();
      setActionSuccess(banner.isActive !== false ? 'Banner deactivated.' : 'Banner activated.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to update banner status: ${err.message}`);
    }
  };

  const handleMoveBanner = (banner, direction) => {
    try {
      moveBanner(banner.id, direction);
      refreshAllData();
    } catch (err) {
      alert(`Failed to reorder banner: ${err.message}`);
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

  // --- TESTIMONIALS HANDLERS (ADMIN ONLY) ---
  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialQuote('');
    setTestimonialName('');
    setTestimonialDesignation('');
    setTestimonialCompany('');
    setTestimonialError('');
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (item) => {
    setEditingTestimonial(item);
    setTestimonialQuote(item.quote || '');
    setTestimonialName(item.name || '');
    setTestimonialDesignation(item.designation || '');
    setTestimonialCompany(item.company || '');
    setTestimonialError('');
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialQuote.trim() || !testimonialName.trim() || !testimonialCompany.trim()) {
      setTestimonialError('Please enter quote, executive name, and company.');
      return;
    }

    setTestimonialSaving(true);
    setTestimonialError('');

    try {
      const payload = {
        quote: testimonialQuote.trim(),
        name: testimonialName.trim(),
        designation: testimonialDesignation.trim() || 'Corporate Executive',
        company: testimonialCompany.trim(),
      };

      if (editingTestimonial) {
        await api.updateTestimonial(editingTestimonial.id, payload);
        setActionSuccess(`✓ Testimonial from '${testimonialName}' updated successfully.`);
      } else {
        await api.addTestimonial(payload);
        setActionSuccess(`✓ Testimonial from '${testimonialName}' added successfully.`);
      }

      refreshAllData();
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setTestimonialError(`Save failed: ${err.message}`);
    } finally {
      setTestimonialSaving(false);
    }
  };

  const handleConfirmDeleteTestimonial = async () => {
    if (!deletingTestimonial) return;
    try {
      await api.deleteTestimonial(deletingTestimonial.id);
      refreshAllData();
      setActionSuccess('Corporate testimonial deleted successfully.');
      setDeletingTestimonial(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // --- RANKINGS & NAAC HANDLERS (ADMIN ONLY) ---
  const handleOpenAddRanking = () => {
    setEditingRanking(null);
    setRankingAgency('');
    setRankingYear(new Date().getFullYear().toString());
    setRankingValue('');
    setRankingCategory('');
    setRankingScope('National');
    setRankingDesc('');
    setRankingError('');
    setShowRankingModal(true);
  };

  const handleOpenEditRanking = (item) => {
    setEditingRanking(item);
    setRankingAgency(item.agency || '');
    setRankingYear(String(item.year || ''));
    setRankingValue(item.rank || '');
    setRankingCategory(item.category || '');
    setRankingScope(item.scope || 'National');
    setRankingDesc(item.description || '');
    setRankingError('');
    setShowRankingModal(true);
  };

  const handleSaveRankingSubmit = async (e) => {
    e.preventDefault();
    if (!rankingAgency.trim() || !rankingValue.trim() || !rankingCategory.trim()) {
      setRankingError('Please fill Agency, Rank / Position, and Category.');
      return;
    }

    setRankingSaving(true);
    setRankingError('');

    try {
      const payload = {
        agency: rankingAgency.trim(),
        year: rankingYear.trim() || undefined,
        rank: rankingValue.trim(),
        category: rankingCategory.trim(),
        scope: rankingScope || 'National',
        description: rankingDesc.trim() || undefined,
      };

      if (editingRanking) {
        await api.updateRanking(editingRanking.id, payload);
        setActionSuccess(`✓ Ranking record '${rankingAgency}' updated successfully.`);
      } else {
        await api.addRanking(payload);
        setActionSuccess(`✓ Ranking record '${rankingAgency}' added successfully.`);
      }

      refreshAllData();
      setShowRankingModal(false);
      setEditingRanking(null);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setRankingError(`Save failed: ${err.message}`);
    } finally {
      setRankingSaving(false);
    }
  };

  const handleConfirmDeleteRanking = async () => {
    if (!deletingRanking) return;
    try {
      await api.deleteRanking(deletingRanking.id);
      refreshAllData();
      setActionSuccess('Ranking record removed.');
      setDeletingRanking(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleOpenEditNaac = () => {
    const current = naacDataState || getNaacData();
    setNaacAgency(current.agency || 'NAAC');
    setNaacFullName(current.fullName || 'National Assessment and Accreditation Council');
    setNaacGrade(current.grade || 'A++');
    setNaacScore(current.score || '3.66 CGPA out of 4');
    setNaacCycle(current.cycle || '4th Cycle in 2021');
    setNaacDesc(current.description || '');
    setNaacError('');
    setShowNaacModal(true);
  };

  const handleSaveNaacSubmit = async (e) => {
    e.preventDefault();
    if (!naacGrade.trim() || !naacScore.trim()) {
      setNaacError('Please enter NAAC Grade and CGPA score.');
      return;
    }

    setNaacSaving(true);
    setNaacError('');

    try {
      const payload = {
        agency: naacAgency.trim() || 'NAAC',
        fullName: naacFullName.trim() || 'National Assessment and Accreditation Council',
        grade: naacGrade.trim(),
        score: naacScore.trim(),
        cycle: naacCycle.trim(),
        description: naacDesc.trim(),
      };

      await api.updateNaac(payload);
      refreshAllData();
      setShowNaacModal(false);
      setActionSuccess('✓ NAAC Accreditation record updated successfully.');
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setNaacError(`Save failed: ${err.message}`);
    } finally {
      setNaacSaving(false);
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
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            <GearIcon size={40} />
          </div>
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
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => {
                    setCourseImagePreview('');
                    setCourseImageError('');
                    setShowAddModal(true);
                  }}>
                    <PlusIcon size={15} />
                    Add Course
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
                    <BuildingIcon size={15} />
                    Add Training
                  </button>
                  <Link
                    to="/profile"
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#071B4A',
                      padding: '0.55rem 1.15rem',
                      gap: '0.55rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <UserIcon size={16} />
                    Profile
                  </Link>
                  
                </>
              ) : (
                <>
                  <Link to="/profile" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
                    <UserIcon size={15} />
                    Edit Profile
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
                  <OverviewIcon size={16} />
                  Overview
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  <BookIcon size={16} />
                  Courses ({coursesList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'corporate-training' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('corporate-training')}
                >
                  <BuildingIcon size={16} />
                  Corporate Training ({corporateTrainingsList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'enquiries' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('enquiries')}
                >
                  <MessageIcon size={16} />
                  Enquiries ({enquiriesList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'programs' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('programs')}
                >
                  <ScrollIcon size={16} />
                  Previous Programs ({programsList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <ImageIcon size={16} />
                  Gallery CMS ({galleryList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'banners' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('banners')}
                >
                  <BannerIcon size={16} />
                  Banners ({bannersList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <UsersIcon size={16} />
                  Users ({usersList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'testimonials' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('testimonials')}
                >
                  <StarIcon size={16} />
                  Corporate Testimonials ({testimonialsList.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'rankings' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('rankings')}
                >
                  <AwardIcon size={16} />
                  University Rankings ({rankingsListState.length})
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
                          <CreditCardIcon size={20} />
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
                          <BookIcon size={20} />
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
                          <MessageIcon size={20} />
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
                          <ScrollIcon size={20} />
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
                          <BuildingIcon size={20} />
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
                        <div className={styles.actionCardIcon}><BookIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Manage Courses</h4>
                          <p className={styles.actionCardDesc}>Create, edit curriculum, set pricing, and toggle registration status.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('corporate-training')}>
                        <div className={styles.actionCardIcon}><BuildingIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Corporate Trainings</h4>
                          <p className={styles.actionCardDesc}>Manage 31+ corporate training records, trainer rosters, and academic years.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('enquiries')}>
                        <div className={styles.actionCardIcon}><MessageIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Course Enquiries</h4>
                          <p className={styles.actionCardDesc}>Review and respond to executive delegate enquiries and cohort questions.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('programs')}>
                        <div className={styles.actionCardIcon}><ScrollIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Previous Programs</h4>
                          <p className={styles.actionCardDesc}>Manage historical executive training cohorts, participants, and outcomes.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('gallery')}>
                        <div className={styles.actionCardIcon}><ImageIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Gallery CMS</h4>
                          <p className={styles.actionCardDesc}>Upload, categorize, and organize campus and industrial training photos.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('users')}>
                        <div className={styles.actionCardIcon}><UsersIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>User Governance</h4>
                          <p className={styles.actionCardDesc}>Inspect registered student and corporate profiles, designations, and roles.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('testimonials')}>
                        <div className={styles.actionCardIcon}><StarIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>Corporate Testimonials</h4>
                          <p className={styles.actionCardDesc}>Manage executive testimonials and corporate feedback on /corporate-testimonials.</p>
                        </div>
                        <span className={styles.actionArrow}>→</span>
                      </div>

                      <div className={styles.actionCard} onClick={() => setActiveTab('rankings')}>
                        <div className={styles.actionCardIcon}><AwardIcon size={22} /></div>
                        <div className={styles.actionCardBody}>
                          <h4 className={styles.actionCardTitle}>University Rankings</h4>
                          <p className={styles.actionCardDesc}>Curate institutional rankings (NIRF, QS, THE) and NAAC accreditation on /about.</p>
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
                            <span className={styles.distName}><GearIcon size={16} /> Technology</span>
                            <span className={styles.distCount}>{techCoursesCount} Courses ({Math.round((techCoursesCount / totalCoursesCount) * 100)}%)</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${(techCoursesCount / totalCoursesCount) * 100}%`, background: '#2563EB' }} />
                          </div>
                        </div>

                        <div className={styles.distItem}>
                          <div className={styles.distMeta}>
                            <span className={styles.distName}><ChartIcon size={16} /> Management</span>
                            <span className={styles.distCount}>{mgmtCoursesCount} Courses ({Math.round((mgmtCoursesCount / totalCoursesCount) * 100)}%)</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: `${(mgmtCoursesCount / totalCoursesCount) * 100}%`, background: '#059669' }} />
                          </div>
                        </div>

                        <div className={styles.distItem}>
                          <div className={styles.distMeta}>
                            <span className={styles.distName}><StarIcon size={16} /> Leadership &amp; Personality</span>
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
                  <CmsSectionHeader
                    title="Active Course Catalog"
                    description={
                      <>
                        Courses published here appear on <strong>/courses</strong>, <strong>/technology</strong>, <strong>/management</strong>, and <strong>/personality</strong>.
                      </>
                    }
                    viewLink="/courses"
                    viewLabel="View Courses"
                    onAdd={() => {
                      setCourseImagePreview('');
                      setCourseImageError('');
                      setShowAddModal(true);
                    }}
                    addLabel="Add Course"
                  />

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
                                    setEditImagePreview(c.image || '');
                                    setEditImageError('');
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
                  <CmsSectionHeader
                    title="Corporate Training Management"
                    description={
                      <>
                        Add, edit, or delete corporate training records that appear dynamically on <strong>/corporate-training</strong>.
                      </>
                    }
                    viewLink="/corporate-training"
                    viewLabel="View Corporate Training"
                    onAdd={handleOpenAddCorporateTraining}
                    addLabel="Add Corporate Training"
                  />

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
                                <div style={{ fontSize: '0.78rem', color: '#64748B' }}><PhoneIcon size={13} /> {enq.phone} • {enq.designation}</div>
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
                  <CmsSectionHeader
                    title="Previous Programs CMS"
                    description={
                      <>
                        Manage landmark corporate cohorts and training programs displayed on the public <strong>/about</strong> page.
                      </>
                    }
                    viewLink="/about#previous-programs"
                    viewLabel="View About Page"
                    onAdd={handleOpenAddProgram}
                    addLabel="Add Program"
                  />

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
                              <div style={{ fontSize: '0.78rem', color: '#1D4ED8' }}><BuildingIcon size={14} /> {prog.clientOrCohort}</div>
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
                  <CmsSectionHeader
                    title="Gallery CMS"
                    description={
                      <>
                        Add, edit, or delete photos that appear on <strong>/gallery</strong>.
                      </>
                    }
                    viewLink="/gallery"
                    viewLabel="View Gallery"
                    onAdd={handleOpenAddPhoto}
                    addLabel="Add Photo"
                  />

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

              {/* BANNERS MANAGEMENT */}
              {activeTab === 'banners' && (
                <GlassCard padding="lg">
                  <CmsSectionHeader
                    title="Banners"
                    description={
                      <>
                        Manage the slides shown in the homepage Hero. Only <strong>active</strong> banners appear, ordered by their display order.
                      </>
                    }
                    viewLink="/"
                    viewLabel="View Banners"
                    onAdd={handleOpenAddBanner}
                    addLabel="Add Banner"
                  />

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Preview</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th style={{ width: '90px' }}>Order</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bannersList.map((banner) => (
                          <tr key={banner.id}>
                            <td>
                              <img
                                src={banner.src || banner.imageUrl}
                                alt={banner.alt || banner.title}
                                style={{ width: '96px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#101828' }}>{banner.title || 'Untitled Banner'}</div>
                              <div style={{ fontSize: '0.72rem', color: '#98A2B3' }}>{banner.isCustom ? 'Custom' : 'Default'}</div>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#667085' }}>{banner.description || '—'}</td>
                            <td>
                              <span className={`${styles.statusPill} ${banner.isActive !== false ? styles.statusSuccess : styles.statusPending}`}>
                                {banner.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B2A6F', minWidth: '16px' }}>{banner.order}</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <button
                                    type="button"
                                    aria-label="Move banner up"
                                    onClick={() => handleMoveBanner(banner, 'up')}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', padding: '0', lineHeight: 0.7 }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Move banner down"
                                    onClick={() => handleMoveBanner(banner, 'down')}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', padding: '0', lineHeight: 0.7 }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }} onClick={() => handleOpenEditBanner(banner)}>
                                  Edit
                                </button>
                                <button
                                  className="btn btn-ghost"
                                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: banner.isActive !== false ? '#B45309' : '#059669' }}
                                  onClick={() => handleToggleBannerActive(banner)}
                                >
                                  {banner.isActive !== false ? 'Deactivate' : 'Activate'}
                                </button>
                                <button className="btn btn-ghost" style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }} onClick={() => setDeletingBannerItem(banner)}>
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

              {/* TAB: Corporate Testimonials (ADMIN ONLY) */}
              {activeTab === 'testimonials' && (
                <GlassCard padding="lg">
                  <CmsSectionHeader
                    title="Corporate Testimonials Management"
                    description={
                      <>
                        Add, edit, or delete corporate client testimonials displayed dynamically on <strong>/corporate-testimonials</strong>.
                      </>
                    }
                    viewLink="/corporate-testimonials"
                    viewLabel="View Testimonials"
                    onAdd={handleOpenAddTestimonial}
                    addLabel="Add Testimonial"
                  />

                  {/* Search filter */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Filter by executive name, company, designation, or quote..."
                      value={testimonialSearch}
                      onChange={(e) => setTestimonialSearch(e.target.value)}
                      style={{ flex: '1 1 300px', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Executive & Designation</th>
                          <th style={{ width: '20%' }}>Company / Organization</th>
                          <th style={{ width: '46%' }}>Testimonial Quote</th>
                          <th style={{ width: '12%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonialsList
                          .filter((item) => {
                            const q = testimonialSearch.toLowerCase().trim();
                            if (!q) return true;
                            return (
                              item.name?.toLowerCase().includes(q) ||
                              item.designation?.toLowerCase().includes(q) ||
                              item.company?.toLowerCase().includes(q) ||
                              item.quote?.toLowerCase().includes(q)
                            );
                          })
                          .map((item) => (
                            <tr key={item.id}>
                              <td>
                                <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.88rem' }}>
                                  {item.name}
                                </strong>
                                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                  {item.designation}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontWeight: 600, color: '#0B2A6F', fontSize: '0.84rem' }}>
                                  {item.company}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.82rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.4' }}>
                                  &ldquo;{item.quote.length > 150 ? item.quote.substring(0, 150) + '...' : item.quote}&rdquo;
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                    onClick={() => handleOpenEditTestimonial(item)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-ghost"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }}
                                    onClick={() => setDeletingTestimonial(item)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {testimonialsList.length === 0 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                              No testimonials found. Click "Add Testimonial" to create your first entry.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}

              {/* TAB: University Rankings & Accreditations (ADMIN ONLY) */}
              {activeTab === 'rankings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {/* Top: Featured NAAC Accreditation Card */}
                  <GlassCard padding="lg">
                    <CmsSectionHeader
                      badge="Featured Accreditation"
                      badgeNote="Displayed in prime hero spotlight on /about"
                      title={`${(naacDataState || getNaacData()).agency} — ${(naacDataState || getNaacData()).fullName}`}
                      viewLink="/about#rankings"
                      viewLabel="View About Page"
                      onAdd={handleOpenEditNaac}
                      addLabel="Edit NAAC Accreditation"
                      addIcon={null}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Grade Awarded</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>
                          {(naacDataState || getNaacData()).grade}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Accreditation Score</span>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F2252' }}>
                          {(naacDataState || getNaacData()).score}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Assessment Cycle / Year</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#334155' }}>
                          {(naacDataState || getNaacData()).cycle}
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Institutional Citation</span>
                        <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: '1.5' }}>
                          {(naacDataState || getNaacData()).description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Lower: Institutional Rankings Records */}
                  <GlassCard padding="lg">
                    <CmsSectionHeader
                      title="National & International Ranking Records"
                      description={
                        <>
                          Manage official rankings (NIRF, QS, Times Higher Education, Shanghai ARWU) shown on <strong>/about#rankings</strong>.
                        </>
                      }
                      viewLink="/about#rankings"
                      viewLabel="View About Page"
                      onAdd={handleOpenAddRanking}
                      addLabel="Add Ranking"
                    />

                    {/* Search & Scope Filter */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Search by ranking agency, rank position, subject, or year..."
                        value={rankingSearch}
                        onChange={(e) => setRankingSearch(e.target.value)}
                        style={{ flex: '1 1 300px', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th style={{ width: '18%' }}>Agency & Year</th>
                            <th style={{ width: '14%' }}>Rank / Position</th>
                            <th style={{ width: '18%' }}>Category / Field</th>
                            <th style={{ width: '14%' }}>Scope</th>
                            <th style={{ width: '24%' }}>Official Description</th>
                            <th style={{ width: '12%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rankingsListState
                            .filter((item) => {
                              const q = rankingSearch.toLowerCase().trim();
                              if (!q) return true;
                              return (
                                item.agency?.toLowerCase().includes(q) ||
                                String(item.year || '').toLowerCase().includes(q) ||
                                item.rank?.toLowerCase().includes(q) ||
                                item.category?.toLowerCase().includes(q) ||
                                item.scope?.toLowerCase().includes(q) ||
                                item.description?.toLowerCase().includes(q)
                              );
                            })
                            .map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.88rem' }}>
                                    {item.agency}
                                  </strong>
                                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                    {item.year || 'Latest'}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ display: 'inline-block', fontWeight: 800, color: '#0B2A6F', fontSize: '0.92rem', padding: '0.2rem 0.55rem', background: '#EFF6FF', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                                    {item.rank}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.84rem' }}>
                                    {item.category}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="tag"
                                    style={{
                                      fontSize: '0.74rem',
                                      fontWeight: 600,
                                      background: item.scope === 'International' ? '#F3E8FF' : '#E0F2FE',
                                      color: item.scope === 'International' ? '#6B21A8' : '#0369A1',
                                      border: `1px solid ${item.scope === 'International' ? '#D8B4FE' : '#BAE6FD'}`,
                                    }}
                                  >
                                    {item.scope || 'National'}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.4' }}>
                                    {item.description || '—'}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button
                                      className="btn btn-secondary"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                      onClick={() => handleOpenEditRanking(item)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-ghost"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: '#DC2626' }}
                                      onClick={() => setDeletingRanking(item)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {rankingsListState.length === 0 && (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                                No ranking records found. Click "Add Ranking Record" to create your first entry.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                </div>
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
                  <BookIcon size={16} />
                  Enrolled Programs
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'saved-courses' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('saved-courses')}
                >
                  <StarIcon size={16} />
                  Saved Courses ({savedCourses.length})
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'my-queries' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('my-queries')}
                >
                  <MessageIcon size={16} />
                  My Course Queries ({userEnquiries.length})
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
                          <AwardIcon size={15} /> Trainer: {c.trainer || 'SpoRIC Faculty'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}><CheckIcon size={13} /> Enrolled &amp; Active</span>
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
        <AdminModal
          open={showProgramModal}
          onClose={() => setShowProgramModal(false)}
          title="Add Landmark Previous Program"
          isEdit={!!editingProgram}
          editTitle="Edit Landmark Previous Program"
          onSubmit={handleSaveProgramSubmit}
          error={progError}
          submitLabel="Publish Program to /about"
          submitEditLabel="Save Changes"
        >
          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Program Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lucas TVS Management Multiplier Program"
              value={progTitle}
              onChange={(e) => setProgTitle(e.target.value)}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Client / Corporate Cohort</label>
              <input
                type="text"
                placeholder="e.g. Lucas TVS Ltd."
                value={progClient}
                onChange={(e) => setProgClient(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Category</label>
              <select
                value={progCategory}
                onChange={(e) => setProgCategory(e.target.value)}
                className={modalStyles.select}
              >
                <option value="Corporate Training">Corporate Training</option>
                <option value="Technology">Technology</option>
                <option value="Management">Management</option>
                <option value="Leadership & Personality">Leadership & Personality</option>
                <option value="Events">Events</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Date &amp; Month</label>
              <input
                type="text"
                placeholder="e.g. February 2026"
                value={progDate}
                onChange={(e) => setProgDate(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Participants Summary</label>
              <input
                type="text"
                placeholder="e.g. 48 Senior Managers"
                value={progCount}
                onChange={(e) => setProgCount(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Program Description *</label>
            <textarea
              required
              placeholder="Details of the executive upskilling session and training conducted..."
              value={progDesc}
              onChange={(e) => setProgDesc(e.target.value)}
              className={modalStyles.textarea}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Key Outcomes (One per line)</label>
            <textarea
              placeholder="Empowered 48 managers with operational delegation tools&#10;Awarded verified VIT-TEC Completion Credentials"
              value={progOutcomes}
              onChange={(e) => setProgOutcomes(e.target.value)}
              className={modalStyles.textarea}
              style={{ minHeight: '60px' }}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Upload Photo</label>
            <input type="file" accept="image/*" onChange={handleProgramImageFileChange} className={modalStyles.file} />
            {progImage && (
              <div style={{ marginTop: '0.5rem' }}>
                <img src={progImage} alt="Preview" className={modalStyles.preview} />
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* ====================================================
          MODAL: ADD NEW COURSE (ADMIN ONLY)
         ==================================================== */}
      {showAddModal && (
        <AdminModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Training Course"
          onSubmit={handleCreateNewCourse}
          submitLabel="Publish Course"
        >
          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Applied Python Programming for Data Analytics"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Department</label>
              <select
                value={newCourse.domain}
                onChange={(e) => setNewCourse({ ...newCourse, domain: e.target.value })}
                className={modalStyles.select}
              >
                <option value={DOMAINS.TECHNOLOGY}>Technology</option>
                <option value={DOMAINS.MANAGEMENT}>Management</option>
                <option value={DOMAINS.LEADERSHIP}>Leadership & Personality</option>
              </select>
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Category</label>
              <input
                type="text"
                placeholder="e.g. Industry 4.0 / Data Science"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Course Image</label>
            {courseImageError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '0.5rem 0.8rem', borderRadius: '8px', color: '#B91C1C', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                {courseImageError}
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleCourseImageFileChange} className={modalStyles.file} />
            {courseImagePreview ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <img src={courseImagePreview} alt="Course image preview" className={modalStyles.preview} style={{ height: '72px' }} />
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Choose another image to replace this preview (JPG / PNG / WEBP).</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Optional. Upload a course image or use a default thumbnail.
              </span>
            )}
          </div>

          <div className={modalStyles.row3}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Hours</label>
              <input
                type="number"
                value={newCourse.hours}
                onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Price (₹)</label>
              <input
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Status</label>
              <select
                value={newCourse.status}
                onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
                className={modalStyles.select}
              >
                <option value={COURSE_STATUS.OPEN}>Open for Registration</option>
                <option value={COURSE_STATUS.UPCOMING}>Upcoming</option>
                <option value={COURSE_STATUS.CLOSED}>Registration Closed</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Registration Deadline</label>
              <input
                type="date"
                value={newCourse.registrationDeadline}
                onChange={(e) => setNewCourse({ ...newCourse, registrationDeadline: e.target.value })}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Trainer / Faculty</label>
              <input
                type="text"
                placeholder="e.g. Dr. A. Sundaram"
                value={newCourse.trainer}
                onChange={(e) => setNewCourse({ ...newCourse, trainer: e.target.value })}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Short Description</label>
            <textarea
              value={newCourse.shortDescription}
              onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
              className={modalStyles.textarea}
              style={{ minHeight: '60px' }}
            />
          </div>
        </AdminModal>
      )}

      {/* ====================================================
          MODAL: ADD / EDIT GALLERY PHOTO (ADMIN ONLY)
         ==================================================== */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 20px 48px rgba(7, 27, 74, 0.25)', padding: '1.75rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', color: '#0B2A6F' }}>
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#0B2A6F', fontWeight: 700, fontSize: '1.15rem' }}>{editingPhoto ? 'Edit Gallery Photo' : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <PlusIcon size={17} />
                  Add New Gallery Photo
                </span>
              )}</h3>
            </div>
            {photoError && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '0.6rem 1rem', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1rem' }}>{photoError}</div>}
            <form onSubmit={handleSavePhotoSubmit}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* LEFT: Photo Upload / Preview */}
                <div style={{ flex: '1 1 230px', minWidth: '230px' }}>
                  <label style={{ display: 'block' }}>
                    <div style={{ border: '2px dashed #CBD5E1', background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box', transition: 'border-color 0.2s ease' }}>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} aria-label="Upload Photo" style={{ display: 'none' }} />
                      {photoImagePreview ? (
                        <>
                          <img src={photoImagePreview} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover', marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.78rem', color: '#0B2A6F', fontWeight: 600, display: 'block' }}>Click to replace photo</span>
                        </>
                      ) : (
                        <>
                          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B2A6F', marginTop: '0.75rem', display: 'block' }}>Upload Photo</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>Click to select an image (JPG / PNG)</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* RIGHT: Title, Category, Description */}
                <div style={{ flex: '1 1 270px', minWidth: '260px' }}>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Management Program"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Company / Organization (Conducted for) - Optional</label>
                    <input
                      type="text"
                      placeholder="e.g. Ford India, TCS"
                      value={photoCompany}
                      onChange={(e) => setPhotoCompany(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Category</label>
                    <select
                      value={photoCategory}                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    >
                      {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Description *</label>
                    <textarea
                      required
                      placeholder="Details of the event/training session..."
                      value={photoDesc}
                      onChange={(e) => setPhotoDesc(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
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

      {/* ====================================================
          MODAL: ADD / EDIT BANNER (ADMIN ONLY)
         ==================================================== */}
      {showBannerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 20px 48px rgba(7, 27, 74, 0.25)', padding: '1.75rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', color: '#0B2A6F' }}>
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#0B2A6F', fontWeight: 700, fontSize: '1.15rem' }}>{editingBanner ? 'Edit Banner' : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <PlusIcon size={17} />
                  Add Banner
                </span>
              )}</h3>
            </div>
            {bannerError && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '0.6rem 1rem', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1rem' }}>{bannerError}</div>}
            <form onSubmit={handleSaveBannerSubmit}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* LEFT: Banner Image Upload / Preview */}
                <div style={{ flex: '1 1 230px', minWidth: '230px' }}>
                  <label style={{ display: 'block' }}>
                    <div style={{ border: '2px dashed #CBD5E1', background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box', transition: 'border-color 0.2s ease' }}>
                      <input type="file" accept="image/*" onChange={handleBannerFileChange} aria-label="Upload Banner Image" style={{ display: 'none' }} />
                      {bannerImagePreview ? (
                        <>
                          <img src={bannerImagePreview} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover', marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.78rem', color: '#0B2A6F', fontWeight: 600, display: 'block' }}>Click to replace image</span>
                        </>
                      ) : (
                        <>
                          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B2A6F', marginTop: '0.75rem', display: 'block' }}>Upload Banner Image</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>Click to select an image (JPG / PNG)</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* RIGHT: Title, Alt Text, Description, Active, Order */}
                <div style={{ flex: '1 1 270px', minWidth: '260px' }}>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Banner Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corporate Training"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Alt Text (accessibility)</label>
                    <input
                      type="text"
                      placeholder="Description of the banner image for screen readers"
                      value={bannerAlt}
                      onChange={(e) => setBannerAlt(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.35rem' }}>Description (optional)</label>
                    <textarea
                      placeholder="Brief description of this slide (not displayed on current hero design)"
                      value={bannerDesc}
                      onChange={(e) => setBannerDesc(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.9rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bannerActive}
                        onChange={(e) => setBannerActive(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                      />
                      Active
                    </label>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#0B2A6F', marginBottom: '0.2rem' }}>Order</label>
                      <input
                        type="number"
                        min="1"
                        value={bannerOrder}
                        onChange={(e) => setBannerOrder(parseInt(e.target.value, 10) || 1)}
                        style={{ width: '80px', padding: '0.5rem 0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', fontSize: '0.9rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowBannerModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={bannerSaving}>
                  {bannerSaving ? 'Saving Banner...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Banner Confirmation */}
      {deletingBannerItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '420px', color: '#FFF' }}>
            <h4>Delete Banner?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Are you sure you want to permanently delete <strong>{deletingBannerItem.title || 'this banner'}</strong> from the homepage Hero?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingBannerItem(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeleteBanner} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Banner</button>
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
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.3rem' }}>Course Image (optional)</label>
                {editImageError ? (
                  <div style={{ background: '#450A0A', border: '1px solid #7F1D1D', padding: '0.5rem 0.75rem', borderRadius: '8px', color: '#FCA5A5', fontSize: '0.78rem', marginBottom: '0.6rem' }}>{editImageError}</div>
                ) : (
                  editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="Course image preview"
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #334155', marginBottom: '0.6rem' }}
                    />
                  )
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditCourseImageFileChange}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px dashed #334155', background: '#0A1E4F', color: '#CBD5E1', cursor: 'pointer' }}
                />
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                  Select an image to replace the current one (JPG / PNG / WEBP).
                </span>
              </div>
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
        <AdminModal
          open={showCorporateTrainingModal}
          onClose={() => setShowCorporateTrainingModal(false)}
          title="Add Corporate Training"
          onSubmit={handleSaveCorporateTrainingSubmit}
          error={trainingError}
          submitting={trainingSaving}
          submittingLabel="Saving Record..."
          submitLabel="Save Corporate Training"
        >
          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Start Date *</label>
              <input
                type="date"
                required
                value={trainingStartDate}
                onChange={(e) => setTrainingStartDate(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>End Date (Optional)</label>
              <input
                type="date"
                value={trainingEndDate}
                onChange={(e) => setTrainingEndDate(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.row21}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>School / Center *</label>
              <input
                type="text"
                required
                placeholder="e.g. SELECT / SCOPE"
                value={trainingSchool}
                onChange={(e) => setTrainingSchool(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Company / Client Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ford, Chennai / Lucas TVS"
                value={trainingCompany}
                onChange={(e) => setTrainingCompany(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Title of the Corporate Training *</label>
            <input
              type="text"
              required
              placeholder="e.g. Electric Motors for Electric Vehicles"
              value={trainingTitle}
              onChange={(e) => setTrainingTitle(e.target.value)}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className={modalStyles.label} style={{ marginBottom: 0 }}>Trainers *</label>
              <button type="button" onClick={handleAddTrainerField} className={modalStyles.addBtn}>
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
                    className={modalStyles.input}
                  />
                  {trainingTrainers.length > 1 && (
                    <button type="button" onClick={() => handleRemoveTrainerField(index)} className={modalStyles.removeBtn}>
                      <XIcon size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Description / Outcomes (Optional)</label>
            <textarea
              placeholder="Additional details about the corporate training..."
              value={trainingDescription}
              onChange={(e) => setTrainingDescription(e.target.value)}
              className={modalStyles.textarea}
              style={{ minHeight: '60px' }}
            />
          </div>
        </AdminModal>
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

      {/* ====================================================
          MODAL: ADD / EDIT CORPORATE TESTIMONIAL (ADMIN ONLY)
         ==================================================== */}
      {showTestimonialModal && (
        <AdminModal
          open={showTestimonialModal}
          onClose={() => setShowTestimonialModal(false)}
          title="Add Corporate Testimonial"
          isEdit={!!editingTestimonial}
          editTitle="Edit Corporate Testimonial"
          onSubmit={handleSaveTestimonialSubmit}
          error={testimonialError}
          submitting={testimonialSaving}
          submittingLabel="Saving Testimonial..."
          submitLabel={editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
        >
          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Executive / Author Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kannan / Dr. Priya Sundar"
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Designation / Role</label>
              <input
                type="text"
                placeholder="e.g. Senior Vice President / Head of L&D"
                value={testimonialDesignation}
                onChange={(e) => setTestimonialDesignation(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Company / Corporate Partner *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Consultancy Services / Renault Nissan / L&T"
              value={testimonialCompany}
              onChange={(e) => setTestimonialCompany(e.target.value)}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Testimonial Quote / Feedback *</label>
            <textarea
              required
              placeholder="Enter the delegate or partner review quote..."
              value={testimonialQuote}
              onChange={(e) => setTestimonialQuote(e.target.value)}
              className={modalStyles.textarea}
              style={{ minHeight: '100px' }}
            />
          </div>
        </AdminModal>
      )}

      {/* Delete Testimonial Confirmation */}
      {deletingTestimonial && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '440px', color: '#FFF' }}>
            <h4>Delete Corporate Testimonial?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
              Are you sure you want to delete the testimonial from <strong>{deletingTestimonial.name}</strong> ({deletingTestimonial.company})? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingTestimonial(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeleteTestimonial} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Testimonial</button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: ADD / EDIT RANKING RECORD (ADMIN ONLY)
         ==================================================== */}
      {showRankingModal && (
        <AdminModal
          open={showRankingModal}
          onClose={() => setShowRankingModal(false)}
          title="Add Ranking Record"
          isEdit={!!editingRanking}
          editTitle="Edit Ranking Record"
          onSubmit={handleSaveRankingSubmit}
          error={rankingError}
          submitting={rankingSaving}
          submittingLabel="Saving Ranking..."
          submitLabel={editingRanking ? 'Update Ranking' : 'Save Ranking'}
        >
          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Ranking Agency *</label>
              <input
                type="text"
                required
                placeholder="e.g. NIRF, QS World, Times Higher Education, ARWU"
                value={rankingAgency}
                onChange={(e) => setRankingAgency(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Year</label>
              <input
                type="text"
                placeholder="e.g. 2024, 2023"
                value={rankingYear}
                onChange={(e) => setRankingYear(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Rank / Position / Score *</label>
              <input
                type="text"
                required
                placeholder="e.g. #8, #11, 101-125, Top 200"
                value={rankingValue}
                onChange={(e) => setRankingValue(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Scope *</label>
              <select
                value={rankingScope}
                onChange={(e) => setRankingScope(e.target.value)}
                className={modalStyles.select}
              >
                <option value="National">National (India)</option>
                <option value="International">International (Global / World)</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Category / Discipline *</label>
            <input
              type="text"
              required
              placeholder="e.g. University, Engineering, Research, Computer Science, Overall"
              value={rankingCategory}
              onChange={(e) => setRankingCategory(e.target.value)}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Official Description / Detail</label>
            <textarea
              placeholder="e.g. Ranked 8th in University category by National Institutional Ranking Framework (NIRF)..."
              value={rankingDesc}
              onChange={(e) => setRankingDesc(e.target.value)}
              className={modalStyles.textarea}
              style={{ minHeight: '70px' }}
            />
          </div>
        </AdminModal>
      )}

      {/* Delete Ranking Confirmation */}
      {deletingRanking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0F2252', padding: '1.75rem', borderRadius: '14px', maxWidth: '440px', color: '#FFF' }}>
            <h4>Delete Ranking Record?</h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
              Are you sure you want to delete <strong>{deletingRanking.agency} ({deletingRanking.rank})</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setDeletingRanking(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirmDeleteRanking} className="btn btn-primary" style={{ background: '#DC2626' }}>Delete Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: EDIT NAAC ACCREDITATION (ADMIN ONLY)
         ==================================================== */}
      {showNaacModal && (
        <AdminModal
          open={showNaacModal}
          onClose={() => setShowNaacModal(false)}
          title="Edit NAAC Accreditation"
          isEdit={true}
          editTitle="Edit Featured NAAC Accreditation"
          onSubmit={handleSaveNaacSubmit}
          error={naacError}
          submitting={naacSaving}
          submittingLabel="Saving NAAC Data..."
          submitLabel="Update NAAC Accreditation"
        >
          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Agency Code</label>
              <input
                type="text"
                required
                value={naacAgency}
                onChange={(e) => setNaacAgency(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Full Institutional Body</label>
              <input
                type="text"
                required
                value={naacFullName}
                onChange={(e) => setNaacFullName(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.row2}>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Grade Awarded *</label>
              <input
                type="text"
                required
                placeholder="e.g. A++"
                value={naacGrade}
                onChange={(e) => setNaacGrade(e.target.value)}
                className={modalStyles.input}
              />
            </div>
            <div className={modalStyles.field}>
              <label className={modalStyles.label}>Accreditation Score (CGPA) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 3.66 CGPA out of 4"
                value={naacScore}
                onChange={(e) => setNaacScore(e.target.value)}
                className={modalStyles.input}
              />
            </div>
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Assessment Cycle & Year *</label>
            <input
              type="text"
              required
              placeholder="e.g. 4th Cycle in 2021"
              value={naacCycle}
              onChange={(e) => setNaacCycle(e.target.value)}
              className={modalStyles.input}
            />
          </div>

          <div className={modalStyles.field}>
            <label className={modalStyles.label}>Institutional Accreditation Description</label>
            <textarea
              required
              placeholder="Description of the NAAC accreditation..."
              value={naacDesc}
              onChange={(e) => setNaacDesc(e.target.value)}
              className={modalStyles.textarea}
              style={{ minHeight: '80px' }}
            />
          </div>
        </AdminModal>
      )}
    </div>
  );
}
