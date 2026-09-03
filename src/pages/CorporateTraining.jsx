import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { getAllCorporateTrainings, getAcademicYearFromDate } from '../data/corporateTrainingOrganizedData';
import styles from './CorporateTraining.module.css';

// Formatter for readable date display
function formatDateRange(startDate, endDate, fallbackYear) {
  if (!startDate) return fallbackYear || '—';
  
  const d1 = new Date(startDate);
  if (isNaN(d1.getTime())) return startDate;

  const d1Formatted = d1.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (!endDate) return d1Formatted;

  const d2 = new Date(endDate);
  if (isNaN(d2.getTime())) return d1Formatted;

  // If same month and year
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()} – ${d2.getDate()} ${d1.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
  }

  // If different month same year
  if (d1.getFullYear() === d2.getFullYear()) {
    return `${d1.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${d2.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  const d2Formatted = d2.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `${d1Formatted} – ${d2Formatted}`;
}

export default function CorporateTraining() {
  const [trainings, setTrainings] = useState(() => getAllCorporateTrainings());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');

  // Load trainings and listen for real-time updates
  const loadTrainings = async () => {
    try {
      const local = getAllCorporateTrainings();
      if (local && local.length > 0) {
        setTrainings(local);
      }
      const res = await api.getCorporateTrainings().catch(() => null);
      const list = res?.data || (Array.isArray(res) ? res : null);
      if (Array.isArray(list) && list.length > 0) {
        setTrainings(list);
      }
    } catch {
      setTrainings(getAllCorporateTrainings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();

    const handleUpdate = () => {
      loadTrainings();
    };

    window.addEventListener('sporic_corporate_training_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('sporic_corporate_training_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute available academic years dynamically
  const yearOptions = useMemo(() => {
    const yearSet = new Set();
    trainings.forEach((item) => {
      const yr = item.year || getAcademicYearFromDate(item.startDate);
      if (yr) yearSet.add(yr);
    });
    // Sort years descending (e.g. 2025–2026, 2024–2025, ...)
    const sorted = Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    return ['All', ...sorted];
  }, [trainings]);

  // Extract unique schools dynamically
  const schoolOptions = useMemo(() => {
    const set = new Set();
    trainings.forEach((item) => {
      if (item.school) set.add(item.school);
    });
    return ['All', ...Array.from(set).sort()];
  }, [trainings]);

  // Filtered & Chronologically Sorted dataset
  const filteredData = useMemo(() => {
    return trainings.filter((item) => {
      const itemYear = item.year || getAcademicYearFromDate(item.startDate);
      const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
      const matchesSchool = selectedSchool === 'All' || item.school === selectedSchool;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.school && item.school.toLowerCase().includes(q)) ||
        (item.trainers && item.trainers.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (itemYear && itemYear.toLowerCase().includes(q)) ||
        (item.startDate && item.startDate.includes(q));

      return matchesYear && matchesSchool && matchesSearch;
    });
  }, [trainings, searchQuery, selectedYear, selectedSchool]);

  // Group filtered records by Academic Year (chronologically descending)
  const groupedByYear = useMemo(() => {
    const groups = {};

    filteredData.forEach((item) => {
      const yr = item.year || getAcademicYearFromDate(item.startDate);
      if (!groups[yr]) {
        groups[yr] = [];
      }
      groups[yr].push(item);
    });

    // Sort items within each year by startDate descending (newest to oldest)
    Object.keys(groups).forEach((yr) => {
      groups[yr].sort((a, b) => {
        const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return timeB - timeA;
      });
    });

    // Return years sorted descending
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((yearKey) => ({
        year: yearKey,
        records: groups[yearKey],
      }));
  }, [filteredData]);

  // Helper to split trainer string into array of lines
  const parseTrainers = (trainersStr) => {
    if (!trainersStr) return [];
    if (Array.isArray(trainersStr)) return trainersStr;
    return trainersStr
      .split(/;|\n/)
      .map((t) => t.trim())
      .filter(Boolean);
  };

  return (
    <div className={styles.page}>
      {/* Hero Header Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.4 }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-label">Sponsored Research &amp; Industrial Consultancy</span>
            <h1 className={styles.title}>Corporate Training Organized</h1>
            <p className={styles.subtitle}>
              Comprehensive chronological portfolio of executive development programs, custom enterprise workshops, and faculty training organized across VIT Chennai schools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className={styles.contentSection}>
        <div className="container">
          {/* Controls Bar: Search, Year Filter, School Filter & Live Count */}
          <div className={styles.controlsBar}>
            {/* Search Box */}
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
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Year & School Dropdowns */}
            <div className={styles.filtersGroup}>
              {/* Year Filter */}
              <div className={styles.selectWrapper}>
                <label className={styles.filterLabel}>Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={styles.select}
                  aria-label="Filter by Academic Year"
                >
                  <option value="All">All Years</option>
                  {yearOptions
                    .filter((y) => y !== 'All')
                    .map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                </select>
              </div>

              {/* School Filter */}
              <div className={styles.selectWrapper}>
                <label className={styles.filterLabel}>School:</label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className={styles.select}
                  aria-label="Filter by School or Center"
                >
                  <option value="All">All Schools</option>
                  {schoolOptions
                    .filter((s) => s !== 'All')
                    .map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dynamic Live Counter */}
              <div className={styles.countBadge}>
                Showing <strong>{filteredData.length}</strong> of {trainings.length} Programs
              </div>
            </div>
          </div>

          {/* Year-by-Year Chronological Tables */}
          {loading ? (
            <div className={styles.loadingState}>
              <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
              <p>Loading corporate training records...</p>
            </div>
          ) : groupedByYear.length > 0 ? (
            <div className={styles.yearGroupsContainer}>
              {groupedByYear.map(({ year, records }) => (
                <div key={year} className={styles.yearBlock}>
                  {/* Year Group Header */}
                  <div className={styles.yearHeader}>
                    <div className={styles.yearTitleWrap}>
                      <span className={styles.yearBadge}>{year}</span>
                      <span className={styles.yearCount}>
                        ({records.length} {records.length === 1 ? 'Program' : 'Programs'})
                      </span>
                    </div>
                    <div className={styles.yearDivider} />
                  </div>

                  {/* Responsive Table for this Year */}
                  <div
                    className={styles.tableResponsiveWrap}
                    tabIndex={0}
                    aria-label={`Corporate Training Table for ${year}, scrollable horizontally`}
                  >
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={styles.thDate}>Date</th>
                          <th className={styles.thSchool}>School</th>
                          <th className={styles.thTrainers}>Names of the Trainers</th>
                          <th className={styles.thTitle}>Title of the Corporate Training</th>
                          <th className={styles.thCompany}>Company Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((row) => {
                          const trainerList = parseTrainers(row.trainers);
                          return (
                            <tr key={row.id} className={styles.tr}>
                              {/* Date Column */}
                              <td className={styles.tdDate}>
                                <span className={styles.dateText}>
                                  {formatDateRange(row.startDate, row.endDate, row.year || year)}
                                </span>
                              </td>

                              {/* School Column */}
                              <td className={styles.tdSchool}>
                                <span className={styles.schoolBadge}>{row.school}</span>
                              </td>

                              {/* Trainers Column (Multi-line within same cell) */}
                              <td className={styles.tdTrainers}>
                                <div className={styles.trainersList}>
                                  {trainerList.map((trainerName, idx) => (
                                    <div key={idx} className={styles.trainerItem}>
                                      {trainerName}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* Title Column */}
                              <td className={styles.tdTitle}>
                                <div className={styles.trainingTitleText}>
                                  {row.title}
                                </div>
                                {row.description && (
                                  <p className={styles.trainingDescText}>{row.description}</p>
                                )}
                              </td>

                              {/* Company Name Column */}
                              <td className={styles.tdCompany}>
                                <div className={styles.companyWrapper}>
                                  <span className={styles.companyNameText}>{row.company}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResultsCard}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>No Corporate Training Records Found</h3>
              <p className={styles.noResultsDesc}>
                No programs matched your current search <strong>"{searchQuery}"</strong>{' '}
                {selectedYear !== 'All' && `for year ${selectedYear}`}
                {selectedSchool !== 'All' && ` in school ${selectedSchool}`}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedYear('All');
                  setSelectedSchool('All');
                }}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', marginTop: '0.75rem' }}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Institutional Integrity Note */}
          <div className={styles.tableFooterNote}>
            <span>
              ⓘ Official university records maintained dynamically by SpoRIC &amp; VIT-TEC, VIT Chennai. All training engagements are conducted with certified industry partners.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
