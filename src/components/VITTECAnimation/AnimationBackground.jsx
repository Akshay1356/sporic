import { useEffect, useRef, useMemo } from 'react';
import { animationConfig } from './animationConfig';
import styles from './AnimationBackground.module.css';

// Seeded pseudo-random for deterministic server/client render
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededRand(i * 3) * 100,
    y: seededRand(i * 3 + 1) * 100,
    size: seededRand(i * 3 + 2) * 2 + 1,
    opacity: seededRand(i * 5) * 0.35 + 0.08,
    duration: seededRand(i * 7) * 30 + 20,
    delay: seededRand(i * 11) * -40,
    color: animationConfig.particles.colors[i % animationConfig.particles.colors.length],
  }));
}

export default function AnimationBackground({ mousePos }) {
  const glowRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile
    ? animationConfig.particles.mobile
    : animationConfig.particles.desktop;

  const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

  // Move glow with cursor
  useEffect(() => {
    if (!glowRef.current || !mousePos) return;
    const { x, y } = mousePos; // normalized 0-1
    const strength = animationConfig.cursor.backgroundStrength;
    const dx = (x - 0.5) * strength * 100;
    const dy = (y - 0.5) * strength * 100;
    glowRef.current.style.transform = `translate(calc(-50% + ${dx}%), calc(-50% + ${dy}%))`;
  }, [mousePos]);

  return (
    <div className={styles.background} aria-hidden="true">
      {/* Fine grid */}
      <div className={styles.grid} />

      {/* Cursor-reactive central glow */}
      <div ref={glowRef} className={styles.centralGlow} />

      {/* Secondary glow orbs */}
      <div className={styles.glowOrbTopRight} />
      <div className={styles.glowOrbBottomLeft} />

      {/* Geometric thin lines */}
      <svg className={styles.geometricLines} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="150" x2="300" y2="50" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        <line x1="700" y1="0" x2="1000" y2="200" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        <line x1="0" y1="400" x2="200" y2="600" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
        <line x1="800" y1="600" x2="1000" y2="400" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
        {/* Corner brackets */}
        <path d="M 40 40 L 40 80 M 40 40 L 80 40" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
        <path d="M 960 40 L 960 80 M 960 40 L 920 40" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
        <path d="M 40 560 L 40 520 M 40 560 L 80 560" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
        <path d="M 960 560 L 960 520 M 960 560 L 920 560" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
        {/* Center ring */}
        <circle cx="500" cy="300" r="280" stroke="rgba(0,0,0,0.03)" strokeWidth="1" fill="none" />
        <circle cx="500" cy="300" r="200" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" fill="none" />
      </svg>

      {/* Floating particles */}
      <div className={styles.particles}>
        {particles.map(p => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
