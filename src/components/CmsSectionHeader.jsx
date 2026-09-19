import { Link } from 'react-router-dom';
import { PlusIcon } from './DashboardIcons';
import styles from './CmsSectionHeader.module.css';

/**
 * Shared CmsSectionHeader Component
 * Clean, compact, professional institutional CMS header actions.
 * No arrow symbols, no external-link CTAs, restrained modern admin style.
 */
export default function CmsSectionHeader({
  title,
  description,
  badge,
  badgeNote,
  viewLink,
  viewLabel,
  onAdd,
  addLabel,
  addIcon,
  children,
  style,
}) {
  return (
    <div className={styles.headerWrapper} style={style}>
      <div className={styles.textGroup}>
        {badge && (
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{badge}</span>
            {badgeNote && <span className={styles.badgeNote}>{badgeNote}</span>}
          </div>
        )}
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.actionsGroup}>
        {children}

        {viewLink && viewLabel && (
          <Link to={viewLink} target="_blank" className={styles.viewBtn}>
            {viewLabel}
          </Link>
        )}

        {onAdd && addLabel && (
          <button type="button" className={styles.addBtn} onClick={onAdd}>
            {addIcon !== null && (addIcon || <PlusIcon size={14} />)}
            <span>{addLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
