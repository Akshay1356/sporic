import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './CorporateTrainingGraph.module.css';

// Structured Corporate Training Performance Data
export const corporateTrainingData = [
  {
    year: 'FY22-23',
    programmes: 8,
    amountLakhs: 6.6,
    highlight: 'Initiation & Foundation',
  },
  {
    year: 'FY23-24',
    programmes: 20,
    amountLakhs: 40.5,
    highlight: '150% Expansion',
  },
  {
    year: 'FY24-25',
    programmes: 33,
    amountLakhs: 64.8,
    highlight: 'Record Revenue & Reach',
  },
  {
    year: 'FY25-26',
    programmes: 33,
    amountLakhs: 63.8,
    highlight: 'Sustained Industry Excellence',
  },
];

// Maximum values for normalization (dual axis)
const MAX_PROGRAMMES = 40;
const MAX_AMOUNT = 75;

export default function CorporateTrainingGraph() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedData, setAnimatedData] = useState(
    corporateTrainingData.map(() => ({ prog: 0, amt: 0, progHeight: 0, amtHeight: 0 }))
  );
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    const duration = 1800; // 1.8 seconds animation
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const next = corporateTrainingData.map((d, index) => {
        // Subtle stagger per financial year
        const itemDelay = index * 0.12;
        const itemProgress = Math.min(Math.max((easeProgress - itemDelay) / (1 - itemDelay), 0), 1);

        const currentProg = Math.round(d.programmes * itemProgress);
        const currentAmt = Number((d.amountLakhs * itemProgress).toFixed(1));
        const progHeight = (d.programmes / MAX_PROGRAMMES) * 100 * itemProgress;
        const amtHeight = (d.amountLakhs / MAX_AMOUNT) * 100 * itemProgress;

        return {
          prog: currentProg,
          amt: currentAmt,
          progHeight,
          amtHeight,
        };
      });

      setAnimatedData(next);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure exact final values
        setAnimatedData(
          corporateTrainingData.map((d) => ({
            prog: d.programmes,
            amt: d.amountLakhs,
            progHeight: (d.programmes / MAX_PROGRAMMES) * 100,
            amtHeight: (d.amountLakhs / MAX_AMOUNT) * 100,
          }))
        );
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, hasAnimated]);

  return (
    <section className={styles.section} id="corporate-training" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="section-label">Performance & Growth Impact</span>
          <h2 className={styles.title}>CORPORATE TRAINING</h2>
          <p className={styles.subtitle}>
            Industry-focused training and professional development
          </p>
        </motion.div>

        {/* Main Visualization Card */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          role="region"
          aria-label="Corporate Training Growth Chart from FY22-23 to FY25-26"
        >
          {/* Top Bar: Legend & Summary Badges */}
          <div className={styles.chartTopBar}>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.progDot}`} />
                <span className={styles.legendLabel}>Programmes Conducted</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.amtDot}`} />
                <span className={styles.legendLabel}>Amount Generated (₹ Lakhs)</span>
              </div>
            </div>

            <div className={styles.summaryBadges}>
              <div className={styles.badge}>
                <span className={styles.badgeVal}>94+</span>
                <span className={styles.badgeLabel}>Total Programmes</span>
              </div>
              <div className={styles.badge}>
                <span className={styles.badgeVal}>₹175.7L</span>
                <span className={styles.badgeLabel}>Total Revenue</span>
              </div>
            </div>
          </div>

          {/* Chart Viewport & Grid */}
          <div className={styles.chartViewport}>
            {/* Left Y-Axis: Programmes Scale */}
            <div className={styles.yAxisLeft} aria-hidden="true">
              <span className={styles.axisTitle}>Programmes</span>
              <div className={styles.axisTicks}>
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>
            </div>

            {/* Central Canvas with Background Gridlines */}
            <div className={styles.chartCanvas}>
              {/* Horizontal Gridlines */}
              <div className={styles.gridLines} aria-hidden="true">
                <div className={styles.gridLine} />
                <div className={styles.gridLine} />
                <div className={styles.gridLine} />
                <div className={styles.gridLine} />
                <div className={styles.gridLineBase} />
              </div>

              {/* Bars Group Container */}
              <div className={styles.barsContainer}>
                {corporateTrainingData.map((item, idx) => {
                  const state = animatedData[idx];
                  return (
                    <div
                      key={item.year}
                      className={styles.yearGroup}
                      onMouseEnter={() =>
                        setActiveTooltip({
                          year: item.year,
                          programmes: item.programmes,
                          amountLakhs: item.amountLakhs,
                          highlight: item.highlight,
                        })
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <div className={styles.barsWrapper}>
                        {/* Bar 1: Programmes Conducted */}
                        <div className={styles.barColumn}>
                          <span className={`${styles.barValue} ${styles.progValue}`}>
                            {state.prog}
                          </span>
                          <div
                            className={`${styles.bar} ${styles.progBar}`}
                            style={{ height: `${state.progHeight}%` }}
                            aria-label={`${item.year} Programmes: ${item.programmes}`}
                          />
                        </div>

                        {/* Bar 2: Amount Generated */}
                        <div className={styles.barColumn}>
                          <span className={`${styles.barValue} ${styles.amtValue}`}>
                            ₹{state.amt}L
                          </span>
                          <div
                            className={`${styles.bar} ${styles.amtBar}`}
                            style={{ height: `${state.amtHeight}%` }}
                            aria-label={`${item.year} Amount Generated: ₹${item.amountLakhs} Lakhs`}
                          />
                        </div>
                      </div>

                      {/* X-Axis Year Label */}
                      <div className={styles.yearLabel}>
                        <span className={styles.yearText}>{item.year}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hover Tooltip */}
              {activeTooltip && (
                <div className={styles.interactiveTooltip}>
                  <div className={styles.tooltipHeader}>
                    <span className={styles.tooltipYear}>{activeTooltip.year}</span>
                    <span className={styles.tooltipTag}>Corporate Training</span>
                  </div>
                  <div className={styles.tooltipRows}>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipDotProg} />
                      <span className={styles.tooltipLabel}>Programmes Conducted:</span>
                      <span className={styles.tooltipVal}>{activeTooltip.programmes}</span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipDotAmt} />
                      <span className={styles.tooltipLabel}>Amount Generated:</span>
                      <span className={styles.tooltipVal}>₹{activeTooltip.amountLakhs} Lakhs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Y-Axis: Amount (₹ Lakhs) Scale */}
            <div className={styles.yAxisRight} aria-hidden="true">
              <span className={styles.axisTitle}>₹ Lakhs</span>
              <div className={styles.axisTicks}>
                <span>₹75L</span>
                <span>₹56L</span>
                <span>₹38L</span>
                <span>₹19L</span>
                <span>₹0</span>
              </div>
            </div>
          </div>

          {/* Bottom Callout Info */}
          <div className={styles.chartFooter}>
            <div className={styles.footerNote}>
              <span className={styles.infoIcon}>ⓘ</span>
              <span>
                Data recorded by Sponsored Research & Industrial Consultancy (SpoRIC) division at VIT Chennai.
              </span>
            </div>
            <div className={styles.growthTag}>
              <span>Peak Growth: <strong>+880%</strong> Revenue Growth since FY22-23</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
