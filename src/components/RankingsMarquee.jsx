import React from 'react';
import styles from './RankingsMarquee.module.css';

const rankingItems = [
  { prefix: 'VIT Chennai — NIRF 2025', value: '#14', category: 'University' },
  { prefix: 'NIRF 2025', value: '#14', category: 'Research' },
  { prefix: 'NIRF 2025', value: '#16', category: 'Engineering' },
  { prefix: 'NIRF 2025', value: '#21', category: 'Overall' },
  { prefix: 'IIRF 2025', value: '#11', category: 'School of Law' },
  { prefix: 'QS World University Rankings 2027', value: '#691' },
  { prefix: 'QS Sustainability Rankings 2026', value: '#352' },
  { prefix: 'QS Asia University Rankings 2026', value: '#156' },
  { prefix: 'Shanghai ARWU Ranking 2025', value: '#501–600' },
  { prefix: 'QS World Subject (Engineering & Tech)', value: '#199' },
  { prefix: 'QS World Subject (Data Science & AI)', value: '#101–150' },
  { prefix: 'QS World Subject (Computer Science)', value: '#201–250' },
  { prefix: 'QS World Subject (Electrical & Electronic)', value: '#251–300' },
  { prefix: 'QS World Subject (Mechanical Engineering)', value: '#251–300' },
  { prefix: 'QS World Subject (Civil & Structural)', value: '#201–250' },
  { prefix: 'QS World Subject (Mathematics)', value: '#301–350' },
  { prefix: 'NAAC Accreditation', value: 'A++ Grade (3.66/4)', isAccred: true },
  { prefix: 'NBA', value: 'Accredited', isAccred: true },
  { prefix: 'AACSB (VIT-BS)', value: 'Accredited', isAccred: true },
  { prefix: 'ACBSP', value: 'Accredited', isAccred: true },
  { prefix: 'ACCA', value: 'Approved Learning Partner', isAccred: true },
];

function TickerGroup({ ariaHidden = false }) {
  return (
    <div className={styles.tickerGroup} aria-hidden={ariaHidden}>
      {rankingItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.tickerItem}>
            <span className={styles.itemCategory}>{item.prefix}:</span>
            <span className={item.isAccred ? styles.itemAccred : styles.itemRank}>
              {item.value}
            </span>
            {item.category && (
              <span className={styles.itemSubject}>({item.category})</span>
            )}
          </span>
          <span className={styles.itemDivider}>•</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function RankingsMarquee() {
  return (
    <div className={styles.marqueeWrapper} role="region" aria-label="VIT Rankings and Recognitions Ticker">
      {/* Fixed Stationary Badge on Left */}
      <div className={styles.labelBadge}>
        <span className={styles.labelIcon} role="img" aria-label="Trophy">🏆</span>
        <span className={styles.labelText}>Rankings &amp; Recognitions</span>
      </div>

      {/* Fade Masks */}
      <div className={styles.marqueeFadeLeft} />
      <div className={styles.marqueeFadeRight} />

      {/* Seamless Scrolling Viewport */}
      <div className={styles.tickerViewport}>
        <div className={styles.tickerTrack}>
          {/* Primary Track */}
          <TickerGroup ariaHidden={false} />
          {/* Duplicated Track for 100% Seamless Infinite Looping */}
          <TickerGroup ariaHidden={true} />
        </div>
      </div>
    </div>
  );
}
