import React from 'react';
import styles from './RankingsMarquee.module.css';

const partnerCompanies = [
  'Valeo',
  'HCL',
  'Siemens Gamesa',
  'Thales India',
  'Hyundai Motor Company, Chennai',
  'Nuclear Power Corporation of India Ltd. (NPCIL), Kalpakkam',
  'Sona Comstar',
  'UNO MINDA',
  'Lucas TVS',
  'Lennox India Technology Centre Pvt. Ltd., Chennai',
  'Rane TRW',
  'Ramco Cements',
];

function TickerGroup({ ariaHidden = false }) {
  return (
    <div className={styles.tickerGroup} aria-hidden={ariaHidden}>
      {partnerCompanies.map((company, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.tickerItem}>
            <span className={styles.partnerName}>{company}</span>
          </span>
          <span className={styles.itemDivider} aria-hidden="true">•</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function RankingsMarquee() {
  return (
    <div className={styles.marqueeWrapper} role="region" aria-label="VIT Industry Partners and Collaborations Ticker">
      {/* Fixed Stationary Badge on Left */}
      <div className={styles.labelBadge}>
        <span className={styles.labelIcon} role="img" aria-label="Partnerships">🤝</span>
        <span className={styles.labelText}>Industry Partners &amp; Collaborations</span>
      </div>

      {/* Seamless Scrolling Viewport */}
      <div className={styles.tickerViewport}>
        {/* Fade Masks inside viewport for exact alignment */}
        <div className={styles.marqueeFadeLeft} />
        <div className={styles.marqueeFadeRight} />

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
