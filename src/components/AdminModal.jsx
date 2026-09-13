import { useState } from 'react';
import { PlusIcon } from './DashboardIcons';
import styles from './AdminModal.module.css';

export default function AdminModal({
  open,
  title,
  editTitle = title,
  isEdit = false,
  onClose,
  onSubmit,
  error = '',
  submitting = false,
  submittingLabel = 'Saving...',
  submitLabel = 'Save',
  submitEditLabel = 'Save Changes',
  maxWidth = '640px',
  children,
}) {
  const [closing, setClosing] = useState(false);

  if (!open) return null;

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 170);
  };

  return (
    <div
      className={`${styles.overlay}${closing ? ` ${styles.overlayClosing}` : ''}`}
      style={{ position: 'fixed', inset: 0, background: 'rgba(7, 27, 74, 0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}
    >
      <div
        className={`${styles.card}${closing ? ` ${styles.cardClosing}` : ''}`}
        style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 20px 48px rgba(7, 27, 74, 0.25)', padding: '1.75rem', width: '100%', maxWidth: maxWidth, maxHeight: '90vh', overflowY: 'auto', color: '#0B2A6F' }}
      >
        <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: '#0B2A6F', fontWeight: 700, fontSize: '1.15rem' }}>
            {isEdit ? (
              editTitle
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <PlusIcon size={17} />
                {title}
              </span>
            )}
          </h3>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '0.6rem 1rem', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {children}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={requestClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? submittingLabel : isEdit ? submitEditLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}