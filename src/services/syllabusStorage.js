// syllabusStorage.js — Dedicated IndexedDB File Storage for Course Syllabus PDFs
// Provides persistent, client-side Blob storage for syllabus PDFs without storing binary in localStorage.
// Fallback-friendly and fully compatible with backend URL uploads or base64.

const DB_NAME = 'vittec_syllabus_storage';
const DB_VERSION = 1;
const STORE_NAME = 'syllabi';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not available in this environment.'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a syllabus file in IndexedDB
 * @param {string} courseId - The unique course identifier (e.g. 'TECH004')
 * @param {File|Blob} file - The uploaded PDF file
 * @returns {Promise<{ id: string, name: string, size: number, type: string, updatedAt: string, isLocal: boolean }>}
 */
export async function saveSyllabusPdf(courseId, file) {
  if (!courseId || !file) {
    throw new Error('Course ID and file are required to save a syllabus.');
  }

  const db = await openDB();
  const record = {
    id: courseId,
    name: file.name || `${courseId}_syllabus.pdf`,
    type: file.type || 'application/pdf',
    size: file.size,
    blob: file,
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => {
      resolve({
        id: record.id,
        name: record.name,
        size: record.size,
        type: record.type,
        updatedAt: record.updatedAt,
        isLocal: true,
      });
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves a syllabus file from IndexedDB by courseId
 * @param {string} courseId
 * @returns {Promise<{ id: string, name: string, size: number, type: string, blob: Blob, url: string } | null>}
 */
export async function getSyllabusPdf(courseId) {
  if (!courseId) return null;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(courseId);

      req.onsuccess = () => {
        const result = req.result;
        if (!result || !result.blob) {
          resolve(null);
        } else {
          const blobUrl = URL.createObjectURL(result.blob);
          resolve({
            ...result,
            url: blobUrl,
          });
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve syllabus from IndexedDB:', err);
    return null;
  }
}

/**
 * Removes a syllabus file from IndexedDB
 * @param {string} courseId
 */
export async function deleteSyllabusPdf(courseId) {
  if (!courseId) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(courseId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete syllabus from IndexedDB:', err);
  }
}
