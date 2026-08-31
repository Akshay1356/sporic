import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courses, DOMAINS, CATEGORIES, TRAINING_MODES, filterCourses } from '../data/courses';
import CourseCard from './CourseCard';
import GlassCard from './GlassCard';
import styles from './CourseExplorer.module.css';

export default function CourseExplorer({ initialDomain = '' }) {
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState(initialDomain);
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Available categories based on chosen domain
  const availableCategories = useMemo(() => {
    if (!domain) return Object.values(CATEGORIES);
    const domainObj = domain === DOMAINS.TECHNOLOGY 
      ? ['Industry 4.0', 'Electric Vehicles', 'Design', 'Optics', 'Manufacturing', 'Renewable Energy', 'Construction Technology', 'ADAS', 'Quantum Computing', 'Simulation']
      : domain === DOMAINS.MANAGEMENT 
        ? ['Operations Management', 'Finance', 'Marketing', 'Data Science']
        : ['Leadership & Personality'];
    return domainObj;
  }, [domain]);

  const filtered = useMemo(() => {
    let result = filterCourses({ search, domain, category, mode });

    // sorting logic
    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration') {
      result.sort((a, b) => b.hours - a.hours);
    } else if (sortBy === 'id') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }
    return result;
  }, [search, domain, category, mode, sortBy]);

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    setCategory(''); // reset category on domain change
  };

  const clearFilters = () => {
    setSearch('');
    setDomain('');
    setCategory('');
    setMode('');
    setSortBy('title');
  };

  return (
    <div className={styles.explorer}>
      {/* Controls Form Grid */}
      <GlassCard glow className={styles.controlsCard} padding="lg">
        <div className={styles.controlsGrid}>
          {/* Search */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Search Courses</label>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, name or description..."
                className={styles.input}
              />
              {search && (
                <button onClick={() => setSearch('')} className={styles.clearSearch}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Domain Filter */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Learning Domain</label>
            <select value={domain} onChange={handleDomainChange} className={styles.select}>
              <option value="">All Domains</option>
              {Object.values(DOMAINS).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
              <option value="">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Training Mode Filter */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Training Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className={styles.select}>
              <option value="">All Modes</option>
              {Object.values(TRAINING_MODES).map((m) => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
              <option value="title">Course Title (A-Z)</option>
              <option value="duration">Duration (High-Low)</option>
              <option value="id">Course ID</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className={styles.clearBtnGroup}>
            <button onClick={clearFilters} className={`btn btn-secondary ${styles.clearBtn}`}>
              Reset Filters
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Courses Grid */}
      <div className={styles.resultsHeader}>
        <span className={styles.countText}>Found {filtered.length} courses</span>
      </div>

      <motion.div layout className={styles.coursesGrid}>
        <AnimatePresence mode="popLayout">
          {filtered.map((course) => (
            <motion.div
              layout
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={styles.gridItem}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className={styles.noResults}>
          <h3>No Courses Found</h3>
          <p>Try modifying your search queries or clearing filters.</p>
          <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Show All Courses
          </button>
        </div>
      )}
    </div>
  );
}
