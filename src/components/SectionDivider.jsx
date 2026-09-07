import styles from './SectionDivider.module.css';

export default function SectionDivider() {
  return (
    <div className={styles.dividerWrapper} role="separator" aria-hidden="true">
      <div className={styles.dividerLine} />
    </div>
  );
}
