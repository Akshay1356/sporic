import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { corporateTrainingOrganizedData } from '../data/corporateTrainingOrganizedData';
import styles from './CorporateTrainingTable.module.css';

export default function CorporateTrainingTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('All');

  // Extract unique schools for dropdown filter
  const schoolOptions = useMemo(() => {
    const set = new Set();
    corporateTrainingOrganizedData.forEach((item) => {
      // Handle multi-school entries if any, or add whole string
      set.add(item.school);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return corporateTrainingOrganizedData.filter((item) => {
      const matchesSchool =
        selectedSchool === 'All' || item.school === selectedSchool;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.school.toLowerCase().includes(q) ||
        item.trainers.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q);

      return matchesSchool && matchesSearch;
    });
  }, [searchQuery, selectedSchool]);

  return (
    <section className={styles.section} id="corporate-training-organized">
      <div className="container">
        {/* Section Header */}
        <div className={styles.headerWrap}>
          <span className="section-label">Sponsored Research & Industrial Consultancy</span>
          <h2 className={styles.title}>Corporate Training Organized</h2>
          <p className={styles.subtitle}>
            Comprehensive portfolio of specialized corporate training programs, industry workshops, and executive development sessions organized across VIT Chennai schools.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by trainer, training title, company, or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search corporate training records"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchBtn}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.filtersGroup}>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className={styles.schoolSelect}
              aria-label="Filter by School"
            >
              <option value="All">All Schools / Centers ({corporateTrainingOrganizedData.length})</option>
              {schoolOptions
                .filter((s) => s !== 'All')
                .map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
            </select>

            <div className={styles.countBadge}>
              Showing <strong>{filteredData.length}</strong> of {corporateTrainingOrganizedData.length} Programs
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Table Wrapper */}
        <div className={styles.tableResponsiveWrap} tabIndex={0} aria-label="Corporate Training Table, scrollable horizontally on smaller screens">
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thSchool}>School</th>
                <th className={styles.thTrainers}>Names of the Trainers</th>
                <th className={styles.thTitle}>Title of the Corporate Training</th>
                <th className={styles.thCompany}>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className={styles.tr}>
                    {/* School Column */}
                    <td className={styles.tdSchool}>
                      <span className={styles.schoolBadge}>{row.school}</span>
                    </td>

                    {/* Trainers Column */}
                    <td className={styles.tdTrainers}>
                      <div className={styles.trainersList}>
                        {row.trainers.split('; ').map((trainer, tIdx) => (
                          <span key={tIdx} className={styles.trainerName}>
                            {trainer}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Title of the Corporate Training Column */}
                    <td className={styles.tdTitle}>
                      <div className={styles.trainingTitleText}>
                        {row.title}
                      </div>
                    </td>

                    {/* Company Name Column */}
                    <td className={styles.tdCompany}>
                      <div className={styles.companyWrapper}>
                        <span className={styles.companyNameText}>{row.company}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noResults}>
                    No training records found matching <strong>"{searchQuery}"</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Note */}
        <div className={styles.tableFooterNote}>
          <span>
            ⓘ Official records maintained by SpoRIC & VIT-TEC, VIT Chennai. All programs conducted with industry partners and certified through university evaluative frameworks.
          </span>
        </div>
      </div>
    </section>
  );
}
