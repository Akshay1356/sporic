import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './VitTecAnimation.module.css';

export default function VitTecAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.animationContainer} aria-label="VIT-TEC Technology & Innovation Visual Identity">
      {/* Background Soft Glow Aura */}
      <div className={styles.ambientGlow} />

      <svg
        className={styles.svgCanvas}
        viewBox="0 0 880 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="coreBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>

          <linearGradient id="subBrandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#071B4A" stopOpacity="0" />
          </radialGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Radial Energy Field */}
        <circle cx="440" cy="170" r="160" fill="url(#centerGlow)" />

        {/* --- 1. CONVERGING CIRCUIT GRID & RADIAL TELEMETRY --- */}
        <g className={styles.circuitGrid}>
          {/* Horizontal Axis lines */}
          <line x1="60" y1="170" x2="200" y2="170" stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="680" y1="170" x2="820" y2="170" stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5 5" />

          {/* Diagonal Angular Connectors (Framing Central Safe Zone) */}
          <path d="M 100 65 L 190 65 L 250 105" stroke="#60A5FA" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
          <path d="M 780 65 L 690 65 L 630 105" stroke="#60A5FA" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
          <path d="M 100 275 L 190 275 L 250 245" stroke="#60A5FA" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
          <path d="M 780 275 L 690 275 L 630 245" stroke="#60A5FA" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />

          {/* Node Connection Points */}
          <circle cx="100" cy="65" r="3.5" fill="#38BDF8" className={styles.pulsingDot} />
          <circle cx="190" cy="65" r="2.5" fill="#93C5FD" />
          <circle cx="250" cy="105" r="3" fill="#38BDF8" />
          <circle cx="780" cy="65" r="3.5" fill="#38BDF8" className={styles.pulsingDot} />
          <circle cx="690" cy="65" r="2.5" fill="#93C5FD" />
          <circle cx="630" cy="105" r="3" fill="#38BDF8" />
          <circle cx="100" cy="275" r="3.5" fill="#38BDF8" className={styles.pulsingDot} />
          <circle cx="190" cy="275" r="2.5" fill="#93C5FD" />
          <circle cx="250" cy="245" r="3" fill="#38BDF8" />
          <circle cx="780" cy="275" r="3.5" fill="#38BDF8" className={styles.pulsingDot} />
          <circle cx="690" cy="275" r="2.5" fill="#93C5FD" />
          <circle cx="630" cy="245" r="3" fill="#38BDF8" />
        </g>

        {/* --- 2. ORBITAL ROTATING RINGS --- */}
        {/* Outer Ring 1: Clockwise */}
        <g className={styles.outerRingClockwise}>
          <circle
            cx="440"
            cy="170"
            r="145"
            stroke="url(#ringGrad1)"
            strokeWidth="1.6"
            strokeDasharray="22 14 8 14 42 20"
            fill="none"
          />
          {/* Orbiting Satellite Data Nodes */}
          <circle cx="440" cy="25" r="4" fill="#38BDF8" filter="url(#softGlow)" />
          <circle cx="440" cy="315" r="3" fill="#60A5FA" />
        </g>

        {/* Inner Ring 2: Counter-Clockwise */}
        <g className={styles.innerRingCounter}>
          <circle
            cx="440"
            cy="170"
            r="120"
            stroke="url(#ringGrad2)"
            strokeWidth="1.4"
            strokeDasharray="45 12 12 12 25 18"
            fill="none"
          />
          {/* Orbiting Nodes */}
          <circle cx="320" cy="170" r="3.5" fill="#93C5FD" filter="url(#softGlow)" />
          <circle cx="560" cy="170" r="3.5" fill="#38BDF8" filter="url(#softGlow)" />
        </g>

        {/* Subtle Tech Ticks Ring */}
        <g className={styles.techTicksRing}>
          <circle
            cx="440"
            cy="170"
            r="98"
            stroke="#93C5FD"
            strokeOpacity="0.25"
            strokeWidth="1.2"
            strokeDasharray="4 7"
            fill="none"
          />
        </g>

        {/* --- 3. CENTRAL IDENTITY: VIT-TEC TYPOGRAPHY & EMBLEM (NO BRACKETS) --- */}
        <g className={styles.coreIdentity}>
          {/* Top Institutional Crest Line */}
          <motion.path
            d="M 350 108 L 440 94 L 530 108"
            stroke="#38BDF8"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <circle cx="440" cy="94" r="3" fill="#FFFFFF" filter="url(#softGlow)" />

          {/* MAIN BRAND TITLE: VIT-TEC (LARGER & PROMINENT) */}
          <motion.text
            x="440"
            y="182"
            textAnchor="middle"
            className={styles.brandMainText}
            fill="url(#coreBrandGrad)"
            initial={{ opacity: 0, scale: 0.85, letterSpacing: '0.18em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '0.07em' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            VIT-TEC
          </motion.text>

          {/* SUBTITLE: TECHNOLOGY ENHANCEMENT CENTRE */}
          <motion.text
            x="440"
            y="218"
            textAnchor="middle"
            className={styles.brandSubText}
            fill="url(#subBrandGrad)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
          >
            TECHNOLOGY ENHANCEMENT CENTRE
          </motion.text>

          {/* Bottom Precision Accent Line with Center Diamond */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <line x1="330" y1="234" x2="425" y2="234" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
            <polygon points="440,230 445,234 440,238 435,234" fill="#38BDF8" />
            <line x1="455" y1="234" x2="550" y2="234" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          </motion.g>
        </g>

        {/* --- 4. FOUR CORNER TELEMETRY PILLARS --- */}
        <g className={styles.telemetryGroup}>
          {/* Top Left: INNOVATION */}
          <text x="100" y="55" className={styles.telemetryText} textAnchor="start">
            INNOVATION
          </text>
          <line x1="100" y1="59" x2="180" y2="59" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1.2" />

          {/* Top Right: EXCELLENCE */}
          <text x="780" y="55" className={styles.telemetryText} textAnchor="end">
            EXCELLENCE
          </text>
          <line x1="700" y1="59" x2="780" y2="59" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1.2" />

          {/* Bottom Left: RESEARCH */}
          <text x="100" y="296" className={styles.telemetryText} textAnchor="start">
            RESEARCH
          </text>
          <line x1="100" y1="286" x2="170" y2="286" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1.2" />

          {/* Bottom Right: INDUSTRY */}
          <text x="780" y="296" className={styles.telemetryText} textAnchor="end">
            INDUSTRY
          </text>
          <line x1="710" y1="286" x2="780" y2="286" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
