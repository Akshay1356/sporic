// Helpers to create new course content items with stable unique keys
export const createEmptyLearnItem = (value = '') => ({
  id: `learn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  value,
});

export const createEmptyModuleItem = (title = '', description = '') => ({
  id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title,
  description,
});

export const createEmptyFeatureItem = (value = '') => ({
  id: `feat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  value,
});

// Default initial sets of 3 items for brand new courses
export const getDefaultLearnItems = () => [
  createEmptyLearnItem(),
  createEmptyLearnItem(),
  createEmptyLearnItem(),
];

export const getDefaultModuleItems = () => [
  createEmptyModuleItem(),
  createEmptyModuleItem(),
  createEmptyModuleItem(),
];

export const getDefaultFeatureItems = () => [
  createEmptyFeatureItem(),
  createEmptyFeatureItem(),
  createEmptyFeatureItem(),
];

// Helper to sanitize module title (strip any leading "Module X:" if typed)
export const sanitizeModuleTitle = (title) => {
  if (!title) return '';
  return title.replace(/^Module\s*\d+\s*:\s*/i, '').trim();
};
