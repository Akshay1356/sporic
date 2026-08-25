import { useRef, useCallback } from 'react';
import AnimationBackground from './AnimationBackground';
import AnimationElements from './AnimationElements';
import styles from './VITTECAnimation.module.css';

/**
 * VITTECAnimation — Main animation component
 *
 * Composes the background environment with the original VIT-TEC
 * SVG stroke animation as the visual centerpiece.
 *
 * Usage: <VITTECAnimation mousePos={mousePos} />
 */
export default function VITTECAnimation({ mousePos }) {
  return (
    <div className={styles.animationRoot} aria-label="VIT-TEC animated logo">
      {/* Background layer: grid, glow, particles, geometric lines */}
      <AnimationBackground mousePos={mousePos} />

      {/* Animation centerpiece: SVG stroke text + subtitle */}
      <div className={styles.animationCenter}>
        <AnimationElements />
      </div>
    </div>
  );
}
