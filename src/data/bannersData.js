// Structured Hero Banner Data for SpoRIC / VIT-TEC Homepage & Dynamic CMS
// Mirrors the localStorage CMS pattern used by galleryData.js

const BANNERS_KEY = 'sporic_banners';
const DELETED_BANNERS_KEY = 'sporic_deleted_banner_ids';

// Seed banners from the existing hardcoded homepage hero slides (order 1-5)
export const initialBanners = [
  {
    id: 'slide-1',
    src: '/hero-slides/slide1-corporate-training.jpeg',
    alt: 'VIT-TEC Corporate Training — Transform Your Career With World-Class Industry Training',
    title: 'Corporate Training',
    description: 'Transform Your Career With World-Class Industry Training',
    isActive: true,
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'slide-2',
    src: '/hero-slides/slide2-rankings-recognitions.jfif',
    alt: 'VIT-TEC Rankings and Recognitions — National & International Accreditations',
    title: 'Rankings and Recognitions',
    description: 'National & International Accreditations',
    isActive: true,
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'slide-3',
    src: '/hero-slides/slide3-industry-partners.jfif',
    alt: 'VIT-TEC Industry Partners — Collaborating for a Skilled and Future-Ready Workforce',
    title: 'Industry Partners',
    description: 'Collaborating for a Skilled and Future-Ready Workforce',
    isActive: true,
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'slide-4',
    src: '/hero-slides/slide4-our-courses.jfif',
    alt: 'VIT-TEC Our Courses — Technology, Management, Personality, and Leadership',
    title: 'Our Courses',
    description: 'Technology, Management, Personality, and Leadership',
    isActive: true,
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'slide-5',
    src: '/hero-slides/slide5-industry-collaborations.jfif',
    alt: 'VIT-TEC Industry Collaborations — Building Talent for a Smarter Tomorrow',
    title: 'Industry Collaborations',
    description: 'Building Talent for a Smarter Tomorrow',
    isActive: true,
    order: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// --- DYNAMIC CMS HELPER FUNCTIONS ---

export function getAllBanners() {
  if (typeof window === 'undefined') return initialBanners;
  try {
    const customItems = JSON.parse(localStorage.getItem(BANNERS_KEY) || '[]');
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