// VIT-TEC Animation Configuration
// Faithfully recreated from the original vit-tec.vit.ac.in homepage animation

export const animationConfig = {
  // SVG Text Animation — matches original CSS keyframes exactly
  svgText: {
    viewBox: '0 0 6000 2000',
    text: 'VIT-TEC',
    x: '50%',
    y: '50%',
    dy: '.35em',
    textAnchor: 'middle',
    fontSize: '1250px',
    letterSpacing: '10px',
    strokeWidth: 5,
    stroke: '#ffffff',
    duration: '5s',
    timing: 'infinite alternate',
    // Keyframe values
    keyframes: {
      start: {
        fill: 'rgba(72,138,20,0)',     // transparent
        stroke: '#ffffff',
        strokeDashoffset: '25%',
        strokeDasharray: '0 50%',
        strokeWidth: 5,
      },
      mid70: {
        fill: 'rgba(72,138,20,0)',
        stroke: '#ffffff',
      },
      mid80: {
        fill: 'rgba(72,138,20,0)',
        stroke: '#ffffff',
        strokeWidth: 5,
      },
      end: {
        fill: '#ffffff',
        stroke: '#ffffff',
        strokeDashoffset: '-25%',
        strokeDasharray: '50% 0',
        strokeWidth: 5,
      },
    },
  },

  // Hero subtitle
  subtitle: {
    text: 'VIT Technology Enhancement Centre',
    delayAfterSvgMs: 1500,
    durationMs: 800,
  },

  // Hero headline
  headline: {
    text: 'Empowering Innovation Through Technology',
    delayAfterSubtitleMs: 600,
    durationMs: 700,
  },

  // Background
  background: {
    baseDark: '#020617',
    gradientCyan: 'rgba(10, 206, 255, 0.10)',
    gradientDark: 'rgba(0, 0, 0, 0.6)',
    gridOpacity: 0.04,
    gridSize: '48px',
    radialGlowColor: 'rgba(14, 165, 233, 0.15)',
    radialGlowSize: '60%',
  },

  // Particles
  particles: {
    desktop: 28,
    mobile: 12,
    colors: ['#0ea5e9', '#06b6d4', '#7c3aed', '#ffffff'],
    sizeRange: [1, 3],
    speedRange: [20, 50],
    opacityRange: [0.1, 0.5],
  },

  // Floating glass cards
  floatingCards: {
    float: {
      duration: 4,
      yRange: [-12, 0],
      ease: 'easeInOut',
    },
  },

  // Cursor parallax strength
  cursor: {
    glowStrength: 0.04,
    cardParallax: 0.015,
    backgroundStrength: 0.02,
  },
};
