/**
 * Corporate Testimonials Data Store
 * Managed by ADMIN users via Admin Dashboard (/dashboard?tab=testimonials)
 * Displayed on public Corporate Testimonials page (/corporate-testimonials)
 */

export const initialTestimonials = [
  {
    id: 'testim_1',
    quote: 'The program helped our teams develop practical capabilities aligned with our technology roadmap.',
    name: 'Senior HR / L&D Leader',
    company: 'Company Name',
    designation: 'Head of Learning & Development',
    initial: 'S',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'testim_2',
    quote: 'VIT-TEC customized the executive management training precisely to our automotive manufacturing bottlenecks. Highly impactful.',
    name: 'Executive Vice President',
    company: 'Lucas TVS Limited',
    designation: 'Operations & Plant Head',
    initial: 'E',
    createdAt: '2026-02-18T10:00:00.000Z',
  },
  {
    id: 'testim_3',
    quote: 'The computational simulation cohort significantly accelerated our engineering team proficiency in ANSYS and FEA methodologies.',
    name: 'Chief Technology Officer',
    company: 'Automotive Engineering Consortium',
    designation: 'CTO & Engineering Director',
    initial: 'C',
    createdAt: '2026-03-02T10:00:00.000Z',
  },
];

const STORAGE_KEY = 'sporic_corporate_testimonials';
const DELETED_IDS_KEY = 'sporic_deleted_testimonial_ids';

export function getAllTestimonials() {
  if (typeof window === 'undefined') return initialTestimonials;
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const deletedIds = new Set(JSON.parse(localStorage.getItem(DELETED_IDS_KEY) || '[]'));

    const activeInitial = initialTestimonials.filter((t) => !deletedIds.has(t.id));
    const customIds = new Set(custom.map((c) => c.id));
    const combined = [...custom, ...activeInitial.filter((t) => !customIds.has(t.id))];

    return combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    return initialTestimonials;
  }
}

export function saveTestimonial(testimonialData) {
  if (typeof window === 'undefined') return testimonialData;
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const now = new Date().toISOString();
    const name = (testimonialData.name || '').trim();
    const initial = testimonialData.initial || (name ? name.charAt(0).toUpperCase() : 'V');

    const record = {
      ...testimonialData,
      id: testimonialData.id || 	estim__,
      initial,
      createdAt: testimonialData.createdAt || now,
      updatedAt: now,
      isCustom: true,
    };

    const updated = [record, ...custom.filter((c) => c.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sporic_testimonials_updated'));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving testimonial:', e);
    throw new Error('Could not save corporate testimonial.');
  }
}

export function updateTestimonial(id, updatedFields) {
  if (typeof window === 'undefined') return null;
  try {
    const all = getAllTestimonials();
    const target = all.find((t) => t.id === id);
    if (!target) return null;

    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const name = updatedFields.name !== undefined ? updatedFields.name.trim() : target.name;
    const initial = updatedFields.initial || (name ? name.charAt(0).toUpperCase() : target.initial || 'V');

    const updatedRecord = {
      ...target,
      ...updatedFields,
      id,
      name,
      initial,
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };

    const updatedList = [updatedRecord, ...custom.filter((c) => c.id !== id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('sporic_testimonials_updated'));
    window.dispatchEvent(new Event('storage'));
    return updatedRecord;
  } catch (e) {
    console.error('Error updating testimonial:', e);
    throw new Error('Could not update corporate testimonial.');
  }
}

export function deleteTestimonial(id) {
  if (typeof window === 'undefined') return false;
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = custom.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const deletedIds = JSON.parse(localStorage.getItem(DELETED_IDS_KEY) || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event('sporic_testimonials_updated'));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e) {
    console.error('Error deleting testimonial:', e);
    throw new Error('Could not delete corporate testimonial.');
  }
}
