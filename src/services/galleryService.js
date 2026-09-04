// SPORIC / VIT-TEC Gallery Service using Prisma Database API
import { galleryPhotos as staticPhotos } from '../data/galleryData';
import api from './api';

class GalleryService {
  // Helper to retrieve all dynamic + static gallery photos
  async getGalleryPhotos() {
    try {
      const res = await api.request('/gallery').catch(() => null);
      if (res && res.photos && Array.isArray(res.photos)) {
        return res.photos;
      }
    } catch (err) {
      console.warn('API Gallery fetch warning:', err.message);
    }

    // Fallback to static baseline photos
    return staticPhotos;
  }

  // Upload a new gallery photo
  async uploadGalleryPhoto({ file, base64Url, category, description, title }) {
    const payload = {
      imageBase64: base64Url,
      src: base64Url,
      filename: file?.name || 'photo.jpg',
      mimeType: file?.type || 'image/jpeg',
      category,
      description: description.trim(),
      title: title || `${category} Event`,
    };

    const res = await api.request('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).catch(async () => {
      // Fallback try /gallery/admin route
      return await api.request('/gallery/admin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    });

    if (res?.photo) {
      return res.photo;
    }
    if (res?.data?.photo) {
      return res.data.photo;
    }

    return {
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      src: base64Url,
      title: title || `${category} Event`,
      category,
      description: description.trim(),
      createdAt: Date.now(),
      isCustom: true,
    };
  }

  // Delete a gallery photo
  async deleteGalleryPhoto(photoId) {
    try {
      await api.request(`/gallery/admin/${photoId}`, {
        method: 'DELETE',
      }).catch(async () => {
        return await api.request('/admin/gallery', {
          method: 'DELETE',
          body: JSON.stringify({ id: photoId }),
        });
      });
    } catch (err) {
      console.warn('Delete photo warning:', err.message);
    }
    return true;
  }

  // Update an existing gallery photo
  async updateGalleryPhoto(photoId, { category, description, base64Url, title, existingSrc }) {
    const payload = {
      id: photoId,
      category,
      description: description ? description.trim() : undefined,
      src: base64Url || existingSrc,
      title: title || (category ? `${category} Event` : undefined),
    };

    const res = await api.request(`/admin/gallery/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).catch(async () => {
      return await api.request(`/gallery/admin/${photoId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    });

    if (res?.photo) {
      return res.photo;
    }
    if (res?.data?.photo) {
      return res.data.photo;
    }

    return {
      id: photoId,
      src: base64Url || existingSrc,
      title: title || `${category} Event`,
      category,
      description: description ? description.trim() : '',
      isCustom: true,
    };
  }
}

export const galleryService = new GalleryService();
export default galleryService;
