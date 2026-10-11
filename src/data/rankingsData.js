/**
 * University Rankings & Accreditations Data Store
 * Source: Official VIT Chennai (https://chennai.vit.ac.in/ranking-and-accreditation/)
 * Managed by ADMIN users via Admin Dashboard (/dashboard?tab=rankings)
 * Displayed on public About page (/about)
 */

export const initialNaacData = {
  id: 'naac-accreditation',
  agency: 'NAAC Accreditation',
  fullName: 'National Assessment and Accreditation Council',
  grade: 'A++',
  score: '3.66 out of 4',
  cgpaLabel: 'CGPA',
  cycle: '4th Cycle in 2021',
  category: 'Institutional Accreditation',
  description: 'Accredited with the highest grade by the Ministry of Education, Government of India.',
};

export const naacData = initialNaacData;

export const initialRankingsList = [
  {
    id: 'shanghai-2025',
    agency: 'Shanghai Ranking',
    year: '2025',
    rank: '501–600',
    description: 'Ranked among the Top Universities in the World',
    category: 'World University Ranking',
    scope: 'International',
    order: 1,
  },
  {
    id: 'qs-world-2027',
    agency: 'QS World',
    year: '2027',
    rank: '597',
    description: '18th best in India',
    category: 'World University Ranking',
    scope: 'International',
    order: 2,
  },
  {
    id: 'qs-asia-2026',
    agency: 'QS Asia',
    year: '2026',
    rank: '156',
    description: '13th best in India',
    category: 'Asia University Ranking',
    scope: 'International',
    order: 3,
  },
  {
    id: 'qs-sustainability-2026',
    agency: 'QS Sustainability',
    year: '2026',
    rank: '352',
    description: '7th best in India',
    category: 'Sustainability Ranking',
    scope: 'International',
    order: 4,
  },
  {
    id: 'nirf-2025-university',
    agency: 'NIRF',
    year: '2025',
    rank: '14th',
    description: 'Best in University',
    category: 'National Institutional Ranking',
    scope: 'National',
    order: 5,
  },
  {
    id: 'nirf-2025-research',
    agency: 'NIRF',
    year: '2025',
    rank: '14th',
    description: 'Best in Research',
    category: 'National Institutional Ranking',
    scope: 'National',
    order: 6,
  },
  {
    id: 'nirf-2025-engineering',
    agency: 'NIRF',
    year: '2025',
    rank: '16th',
    description: 'Best in Engineering',
    category: 'National Institutional Ranking',
    scope: 'National',
    order: 7,
  },
  {
    id: 'nirf-2025-overall',
    agency: 'NIRF',
    year: '2025',
    rank: '21st',
    description: 'Best in Overall Category',
    category: 'National Institutional Ranking',
    scope: 'National',
    order: 8,
  },
];

export const rankingsList = initialRankingsList;

const NAAC_STORAGE_KEY = 'sporic_naac_accreditation';
const RANKINGS_STORAGE_KEY = 'sporic_university_rankings';
const DELETED_RANKINGS_KEY = 'sporic_deleted_ranking_ids';

// --- NAAC ACCREDITATION HELPERS ---

export function getNaacData() {
  if (typeof window === 'undefined') return initialNaacData;
  try {
    const custom = localStorage.getItem(NAAC_STORAGE_KEY);
    if (custom) {
      return { ...initialNaacData, ...JSON.parse(custom) };
    }
    return initialNaacData;
  } catch {
    return initialNaacData;
  }
}

export function updateNaacData(updatedFields) {
  if (typeof window === 'undefined') return initialNaacData;
  try {
    const current = getNaacData();
    const updated = {
      ...current,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };
    localStorage.setItem(NAAC_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sporic_rankings_updated'));
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (e) {
    console.error('Error updating NAAC accreditation:', e);
    throw new Error('Could not update NAAC accreditation data.');
  }
}

// --- UNIVERSITY RANKINGS LIST HELPERS ---

export function getAllRankings() {
  if (typeof window === 'undefined') return initialRankingsList;
  try {
    const custom = JSON.parse(localStorage.getItem(RANKINGS_STORAGE_KEY) || '[]');
    const deletedIds = new Set(JSON.parse(localStorage.getItem(DELETED_RANKINGS_KEY) || '[]'));

    const activeInitial = initialRankingsList.filter((r) => !deletedIds.has(r.id));
    const customIds = new Set(custom.map((c) => c.id));
    const combined = [...custom, ...activeInitial.filter((r) => !customIds.has(r.id))];

    return combined.sort((a, b) => (a.order || 99) - (b.order || 99));
  } catch {
    return initialRankingsList;
  }
}

export function saveRanking(rankingData) {
  if (typeof window === 'undefined') return rankingData;
  try {
    const custom = JSON.parse(localStorage.getItem(RANKINGS_STORAGE_KEY) || '[]');
    const now = new Date().toISOString();
    const all = getAllRankings();

    const record = {
      ...rankingData,
      id: rankingData.id || ank__,
      order: rankingData.order || all.length + 1,
      createdAt: rankingData.createdAt || now,
      updatedAt: now,
      isCustom: true,
    };

    const updated = [record, ...custom.filter((c) => c.id !== record.id)];
    localStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sporic_rankings_updated'));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving ranking:', e);
    throw new Error('Could not save university ranking record.');
  }
}

export function updateRanking(id, updatedFields) {
  if (typeof window === 'undefined') return null;
  try {
    const all = getAllRankings();
    const target = all.find((r) => r.id === id);
    if (!target) return null;

    const custom = JSON.parse(localStorage.getItem(RANKINGS_STORAGE_KEY) || '[]');
    const updatedRecord = {
      ...target,
      ...updatedFields,
      id,
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };

    const updatedList = [updatedRecord, ...custom.filter((c) => c.id !== id)];
    localStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('sporic_rankings_updated'));
    window.dispatchEvent(new Event('storage'));
    return updatedRecord;
  } catch (e) {
    console.error('Error updating ranking:', e);
    throw new Error('Could not update university ranking record.');
  }
}

export function deleteRanking(id) {
  if (typeof window === 'undefined') return false;
  try {
    const custom = JSON.parse(localStorage.getItem(RANKINGS_STORAGE_KEY) || '[]');
    const updated = custom.filter((c) => c.id !== id);
    localStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(updated));

    const deletedIds = JSON.parse(localStorage.getItem(DELETED_RANKINGS_KEY) || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(DELETED_RANKINGS_KEY, JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event('sporic_rankings_updated'));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e) {
    console.error('Error deleting ranking:', e);
    throw new Error('Could not delete university ranking record.');
  }
}
