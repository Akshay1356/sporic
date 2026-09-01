// Structured Gallery Data for SpoRIC / VIT-TEC Corporate Training Programs & Dynamic CMS

export const GALLERY_CATEGORIES = [
  'All',
  'Corporate Training',
  'Technology',
  'Management',
  'Leadership & Personality',
  'Events',
  'Workshops',
  'Other',
];

// Seed photos from official SpoRIC archives
export const initialGalleryPhotos = [
  {
    id: 'corporate-strategy-mindset-workshop',
    src: '/gallery/premier_group_training.jpg',
    title: 'Corporate Strategy & Leadership Mindset Workshop',
    category: 'Leadership & Personality',
    description: 'Executive leadership, strategic thinking, and team development workshop conducted for corporate management cohorts.',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'managers-multiplier-masterclass',
    src: '/gallery/lucas_tvs_management_program.jpg',
    title: 'Corporate Management Excellence & Multiplier Masterclass',
    category: 'Corporate Training',
    description: 'Interactive corporate management excellence training on managerial multiplication and leadership productivity.',
    createdAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'strategic-planning-operations-program',
    src: '/gallery/strategic_planning_industrial_training.png',
    title: 'Strategic Planning & Industrial Operations Program',
    category: 'Management',
    description: 'Specialized industrial training on strategic planning, financial forecasting, and decision modeling for industry professionals.',
    createdAt: '2026-02-18T10:00:00.000Z',
  },
  {
    id: 'executive-leadership-series',
    src: '/gallery/corporate_executive_leadership_program.jpg',
    title: 'Corporate Executive Leadership & Development Series',
    category: 'Leadership & Personality',
    description: 'High-impact keynote lecture and corporate capacity building session delivered to industry managers and engineering professionals.',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'lab-training-session',
    src: '/gallery/lab_training_session.png',
    title: 'Technical Skill & Computer Lab Training',
    category: 'Technology',
    description: 'Hands-on practical computational training and workforce development session conducted at VIT-TEC computing facilities.',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'certificate-award-ceremony',
    src: '/gallery/certificate_award_ceremony.jpg',
    title: 'Corporate Training Certificate Distribution Ceremony',
    category: 'Events',
    description: 'Participants awarded official VIT-TEC certificates of completion at Dr. A.P.J. Abdul Kalam Block.',
    createdAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'professional-development-workshop',
    src: '/gallery/professional_development_workshop.jpg',
    title: 'Professional Development & Cross-Functional Synergy',
    category: 'Workshops',
    description: 'Interactive corporate training program with industry trainees around the executive conference boardroom.',
    createdAt: '2026-04-05T10:00:00.000Z',
  },
  {
    id: 'executive-conference-meeting',
    src: '/gallery/executive_conference_meeting.jpg',
    title: 'Executive Development & Industry Keynote Session',
    category: 'Corporate Training',
    description: 'Senior university leadership and industry delegates in an executive development session at SpoRIC.',
    createdAt: '2026-04-18T10:00:00.000Z',
  },
  {
    id: 'campus-delegates-group',
    src: '/gallery/campus_delegates_group.jpg',
    title: 'Faculty Coordinators & Industry Delegate Cohort',
    category: 'Events',
    description: 'Commemorative cohort gathering of corporate trainees and faculty coordinators in the campus courtyard.',
    createdAt: '2026-05-02T10:00:00.000Z',
  },
];

export const galleryCategories = GALLERY_CATEGORIES;
export const galleryPhotos = initialGalleryPhotos;

// --- DYNAMIC CMS HELPER FUNCTIONS ---

export function getAllGalleryItems() {
  if (typeof window === 'undefined') return initialGalleryPhotos;
  try {
    const customItems = JSON.parse(localStorage.getItem('sporic_gallery_items') || '[]');
    const deletedIds = new Set(JSON.parse(localStorage.getItem('sporic_deleted_gallery_ids') || '[]'));

    // Filter out deleted initial seed items
    const activeInitial = initialGalleryPhotos.filter((p) => !deletedIds.has(p.id));

    // Custom items prepend (newest first)
    const customIds = new Set(customItems.map((c) => c.id));
    const combined = [
      ...customItems,
      ...activeInitial.filter((c) => !customIds.has(c.id)),
    ];

    // Sort by createdAt descending
    return combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    return initialGalleryPhotos;
  }
}

export function saveGalleryItem(photoData) {
  if (typeof window === 'undefined') return;
  try {
    const customItems = JSON.parse(localStorage.getItem('sporic_gallery_items') || '[]');
    const now = new Date().toISOString();

    const record = {
      ...photoData,
      id: photoData.id || `gal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: photoData.createdAt || now,
      updatedAt: now,
      isCustom: true,
    };

    const updated = [record, ...customItems.filter((c) => c.id !== record.id)];
    localStorage.setItem('sporic_gallery_items', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving gallery item:', e);
    throw new Error('Failed to save to browser storage. Try using a compressed image or image URL.');
  }
}

export function updateGalleryItem(id, updatedFields) {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllGalleryItems();
    const target = all.find((c) => c.id === id);
    if (!target) return;

    const customItems = JSON.parse(localStorage.getItem('sporic_gallery_items') || '[]');
    const now = new Date().toISOString();

    const updatedRecord = {
      ...target,
      ...updatedFields,
      id,
      updatedAt: now,
      isCustom: true,
    };

    const updatedList = [updatedRecord, ...customItems.filter((c) => c.id !== id)];
    localStorage.setItem('sporic_gallery_items', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
    return updatedRecord;
  } catch (e) {
    console.error('Error updating gallery item:', e);
    throw new Error('Failed to update gallery photo.');
  }
}

export function deleteGalleryItem(id) {
  if (typeof window === 'undefined') return;
  try {
    const customItems = JSON.parse(localStorage.getItem('sporic_gallery_items') || '[]');
    const updatedCustom = customItems.filter((c) => c.id !== id);
    localStorage.setItem('sporic_gallery_items', JSON.stringify(updatedCustom));

    // Also mark seed ID as deleted so it doesn't resurrect
    const deletedIds = JSON.parse(localStorage.getItem('sporic_deleted_gallery_ids') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('sporic_deleted_gallery_ids', JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event('storage'));
    return updatedCustom;
  } catch (e) {
    console.error('Error deleting gallery item:', e);
    throw new Error('Failed to delete gallery photo.');
  }
}
