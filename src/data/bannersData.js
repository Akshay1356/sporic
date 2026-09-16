// Structured Hero Banner Data for SpoRIC / VIT-TEC Homepage & Dynamic CMS
// Mirrors the localStorage CMS pattern used by galleryData.js

const BANNERS_KEY = 'sporic_banners';
const DELETED_BANNERS_KEY = 'sporic_deleted_banner_ids';

// Seed banners: Video Intro + 4 Official VIT-TEC Homepage Posters
export const initialBanners = [
  {
    id: 'banner-intro-video',
    type: 'video',
    src: '/hero-video.mp4',
    alt: 'VIT-TEC Overview Video',
    title: 'VIT-TEC Overview Video',
    description: 'Welcome to VIT Technology Enhancement Centre (VIT-TEC)',
    isActive: true,
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'banner-corporate-training-v2',
    type: 'image',
    src: '/hero-slides/banner-corporate-training.png',
    alt: 'VIT-TEC Corporate Training — Skills for a Stronger Tomorrow',
    title: 'Corporate Training',
    description: 'Skills for a Stronger Tomorrow — Industry Ready People',
    isActive: true,
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'banner-programmes-offered',
    type: 'image',
    src: '/hero-slides/banner-programmes-offered.png',
    alt: 'Programmes Offered — VIT Corporate Capability Development Programme (VIT-CCDP)',
    title: 'Programmes Offered',
    description: 'Technology, Management, Personality, and Leadership Programmes',
    isActive: true,
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'banner-rankings-recognition-v2',
    type: 'image',
    src: '/hero-slides/banner-rankings-recognition.png',
    alt: 'VIT-TEC Rankings and Recognition — National & International Accreditations',
    title: 'Rankings and Recognition',
    description: 'National Rankings NIRF 2025, International Rankings & QS Accreditations',
    isActive: true,
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'banner-industry-partners',
    type: 'image',
    src: '/hero-slides/banner-industry-partners.png',
    alt: 'Our Industry Partners — Collaborating for a Skilled and Future-Ready Workforce',
    title: 'Our Industry Partners',
    description: 'Collaborating with premier industry leaders for future-ready corporate learning',
    isActive: true,
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// --- DYNAMIC CMS HELPER FUNCTIONS ---

const LEGACY_SLIDE_IDS = new Set([
  'slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5',
  'banner-corporate-training', 'banner-rankings-recognition', 'banner-our-courses'
]);

export function getAllBanners() {
  if (typeof window === 'undefined') return initialBanners;
  try {
    const rawCustom = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]');
    // Filter out legacy 5 slides from local storage if previously cached
    const customItems = rawCustom.filter((c) => !LEGACY_SLIDE_IDS.has(c.id));
    const deletedIds = new Set(JSON.parse(localStorage.getItem(DELETED_BANNERS_KEY) || '[]'));

    const activeInitial = initialBanners.filter((b) => !deletedIds.has(b.id));

    const customIds = new Set(customItems.map((c) => c.id));
    const combined = [
      ...customItems,
      ...activeInitial.filter((c) => !customIds.has(c.id)),
    ];

    return combined.sort(
      (a, b) =>
        (a.order === undefined ? Infinity : a.order) - (b.order === undefined ? Infinity : b.order) ||
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
  } catch {
    return initialBanners;
  }
}

export function getActiveBanners() {
  return getAllBanners().filter((b) => b.isActive !== false);
}

export function saveBanner(bannerData) {
  if (typeof window === 'undefined') return;
  try {
    const customItems = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]');
    const now = new Date().toISOString();
    const all = getAllBanners();
    const nextOrder =
      all.length > 0 ? Math.max(...all.map((b) => b.order || 0)) + 1 : 1;

    const record = {
      ...bannerData,
      id: bannerData.id || `banner_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      order: bannerData.order !== undefined && bannerData.order !== null ? bannerData.order : nextOrder,
      isActive: bannerData.isActive !== false,
      alt: bannerData.alt || bannerData.title || '',
      createdAt: bannerData.createdAt || now,
      updatedAt: now,
      isCustom: true,
    };

    const updated = [record, ...customItems.filter((c) => c.id !== record.id)];
    localStorage.setItem(BANNERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving banner:', e);
    throw new Error('Failed to save to browser storage. Try using a compressed image or image URL.');
  }
}

export function updateBanner(id, updatedFields) {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllBanners();
    const target = all.find((b) => b.id === id);
    if (!target) return;

    const customItems = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]');
    const now = new Date().toISOString();

    const updatedRecord = {
      ...target,
      ...updatedFields,
      id,
      updatedAt: now,
      isCustom: true,
    };

    const updatedList = [updatedRecord, ...customItems.filter((c) => c.id !== id)];
    localStorage.setItem(BANNERS_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
    return updatedRecord;
  } catch (e) {
    console.error('Error updating banner:', e);
    throw new Error('Failed to update banner.');
  }
}

export function toggleBannerActive(id) {
  const all = getAllBanners();
  const target = all.find((b) => b.id === id);
  if (!target) return;
  return updateBanner(id, { isActive: target.isActive !== false ? false : true });
}

export function deleteBanner(id) {
  if (typeof window === 'undefined') return;
  try {
    const customItems = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]');
    const updatedCustom = customItems.filter((c) => c.id !== id);
    localStorage.setItem(BANNERS_KEY, JSON.stringify(updatedCustom));

    const deletedIds = JSON.parse(localStorage.getItem(DELETED_BANNERS_KEY) || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(DELETED_BANNERS_KEY, JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event('storage'));
    return updatedCustom;
  } catch (e) {
    console.error('Error deleting banner:', e);
    throw new Error('Failed to delete banner.');
  }
}

export function moveBanner(id, direction) {
  const all = getAllBanners();
  const index = all.findIndex((b) => b.id === id);
  if (index === -1) return all;

  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return all;

  const current = all[index];
  const neighbor = all[swapIndex];

  updateBanner(current.id, { order: neighbor.order });
  updateBanner(neighbor.id, { order: current.order });

  return getAllBanners();
}