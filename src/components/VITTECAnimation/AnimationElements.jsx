import { motion } from 'framer-motion';
import styles from './AnimationElements.module.css';

/**
 * AnimationElements — The original VIT-TEC SVG stroke animation
 *
 * Faithfully recreates the original animation from vit-tec.vit.ac.in:
 * - SVG <text> element with Audiowide/Orbitron font
 * - stroke-dasharray/stroke-dashoffset CSS animation drawing the text
 * - Starts transparent outline → progressively draws strokes → fills white
 * - Original: 5s infinite alternate
 */
export default function AnimationElements() {
  return (
    <div className={styles.animationWrap}>
      {/* Main SVG stroke animation — original VIT-TEC text animation */}
      <motion.div
        className={styles.svgWrap}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <svg
          viewBox="0 0 6000 1600"
          className={styles.svgCanvas}
          aria-label="VIT-TEC"
          role="img"
        >
          <defs>
            <filter id="textGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="textGlowStrong" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.055  0 0 0 0 0.647  0 0 0 0 0.914  0 0 0 0.5 0"
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow layer behind text */}
          <text
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            className={styles.svgTextGlow}
            filter="url(#textGlowStrong)"
            aria-hidden="true"
          >
            VIT-TEC
          </text>

          {/* Main animated text */}
          <text
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            className={styles.svgText}
            filter="url(#textGlow)"
          >
            VIT-TEC
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
