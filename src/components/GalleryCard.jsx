import React, { useState } from 'react';
import styles from './GalleryCard.module.css';

/**
 * Default Reusable Institutional Gallery Item Component
 * Renders all gallery items with company/organization name as the primary title
 * followed only by the description, in a clean, static, institutional layout.
 */
export default function GalleryCard({ item, onClick }) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const imageSrc = !imageError && (item.src || item.imageUrl)
    ? item.src || item.imageUrl
    : '/gallery/premier_group_training.jpg';

  // Company / Organization name is the primary title
  const companyName =
    item.companyName?.trim() ||
    item.organization?.trim() ||
    item.company?.trim() ||
    item.conductedFor?.trim() ||
    item.title?.trim() ||
    'Industry Engagement';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View photo: ${companyName}`}
    >
      {/* Proportional Image Frame */}
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={companyName}
          className={styles.image}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Card Content: Company Name + Description Only */}
      <div className={styles.content}>
        <div className={styles.companyHeadingWrap}>
          <h3 className={styles.companyTitle}>{companyName}</h3>
        </div>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </div>
    </div>
  );
}
