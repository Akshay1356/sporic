import styles from './GlassCard.module.css';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = 'md',
  as: Tag = 'div',
  ...props
}) {
  return (
    <Tag
      className={`
        ${styles.glass}
        ${hover ? styles.hoverable : ''}
        ${glow ? styles.glowing : ''}
        ${styles[`pad-${padding}`]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
}
