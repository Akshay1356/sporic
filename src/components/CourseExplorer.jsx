import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllCourses,
  DOMAINS,
  COURSE_STATUS,
  searchCourses,
  getUpcomingDeadlines,
} from '../data/courses';
import CourseCard from './CourseCard';
import GlassCard from './GlassCard';
import styles from './CourseExplorer.module.css';

export default function CourseExplorer({ initialDomain = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramSearch = searchParams.get('search') || '';
  const paramDomain = searchParams.get('domain') || initialDomain || 'All';

  const [search, setSearch] = useState(paramSearch);
  const [domain, setDomain] = useState(paramDomain);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  // Sync state if URL search parameters change
  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearch(searchParams.get('search'));
    }
    if (searchParams.get('domain') !== null) {
      setDomain(searchParams.get('domain'));
    }
  }, [searchParams]);

  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines().slice(0, 3), []);

  const filtered = useMemo(() => {
    let result = searchCourses({
      query: search,
      domain: domain === 'All' ? '' : domain,
      status: statusFilter === 'All' ? '' : statusFilter,
    });

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration') {
      result.sort((a, b) => b.hours - a.hours);
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.registrationDeadline || '2099-01-01') - new Date(b.registrationDeadline || '2099-01-01'));
    } else if (sortBy === 'id') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }
    return result;
  }, [search, domain, statusFilter, sortBy]);

  const handleDomainSelect = (selectedDomain) => {
    setDomain(selectedDomain);
    const newParams = new URLSearchParams(searchParams);
    if (selectedDomain === 'All') {
      newParams.delete('domain');
    } else {
      newParams.set('domain', selectedDomain);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearFilters = () => {
    setSearch('');
    setDomain('All');
    setStatusFilter('All');
    setSortBy('title');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className={styles.explorer}>
      {/* Urgent Deadline Notification Ribbon */}
      {upcomingDeadlines.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⏰</span>
            <span style={{ fontSize: '0.88rem', color: '#FEF3C7', fontWeight: '600' }}>
              <strong>Upcoming Registration Deadlines:</strong> {upcomingDeadlines.map(u => `${u.title.split(':')[0]} (${u.daysRemaining > 0 ? `closes in ${u.daysRemaining} days` : 'closing soon'})`).join(' • ')}
            </span>
          </div>
          <button 
            onClick={() => setStatusFilter(COURSE_STATUS.OPEN)} 
            style={{ 
              background: '#F59E0B', 
              color: '#0F172A', 
              border: 'none', 
              padding: '0.3rem 0.75rem', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              cursor: 'pointer' 
            }}
          >
            View Open Courses
          </button>
        </div>
      )}

      {/* Domain Quick Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['All', DOMAINS.TECHNOLOGY, DOMAINS.MANAGEMENT, DOMAINS.LEADERSHIP].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleDomainSelect(d)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: domain === d ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
              background: domain === d ? 'linear-gradient(135deg, #1D4ED8 0%, #0284C7 100%)' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              boxShadow: domain === d ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none',
            }}
          >
            {d === 'All' ? '🌐 All Programs' : d}
          </button>
        ))}
      </div>

      {/* Controls Form Grid */}
      <GlassCard glow className={styles.controlsCard} padding="lg">
        <div className={styles.controlsGrid}>
          {/* Keyword Search */}
          <div className={styles.inputGroup} style={{ flex: '1 1 280px' }}>
            <label className={styles.label}>Search by Keyword, Topic, AI or Instructor</label>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="e.g. Python, AI, CFD, Management, CAD..."
                className={styles.input}
              />
              {search && (
                <button onClick={() => handleSearchChange('')} className={styles.clearSearch} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Registration Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value={COURSE_STATUS.OPEN}>🟢 Open for Registration</option>
              <option value={COURSE_STATUS.UPCOMING}>🟡 Upcoming Batches</option>
              <option value={COURSE_STATUS.CLOSED}>⚪ Registration Closed</option>
            </select>
          </div>

          {/* Sorting */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="title">Course Title (A-Z)</option>
              <option value="deadline">Registration Deadline</option>
              <option value="duration">Duration (High-Low)</option>
              <option value="id">Course ID</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className={styles.clearBtnGroup}>
            <button onClick={clearFilters} className={`btn btn-secondary ${styles.clearBtn}`}>
              Reset Filters
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Results Header */}
      <div className={styles.resultsHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0 1rem' }}>
        <span className={styles.countText} style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: '600' }}>
          Showing <strong>{filtered.length}</strong> available training programs
        </span>
        {search && (
          <span style={{ fontSize: '0.85rem', color: '#38BDF8' }}>
            Filtered by keyword: "<strong>{search}</strong>"
          </span>
        )}
      </div>

      {/* Courses Grid */}
      <motion.div layout className={styles.coursesGrid}>
        <AnimatePresence mode="popLayout">
          {filtered.map((course) => (
            <motion.div
              layout
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={styles.gridItem}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className={styles.noResults} style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0 0 0.5rem' }}>No courses found. Try a different search.</h3>
          <p style={{ color: '#94A3B8', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            We couldn't find any courses matching your current search or filter criteria. Try searching for "Python", "AI", "Management", or reset all filters.
          </p>
          <button onClick={clearFilters} className="btn btn-primary">
            Show All Courses
          </button>
        </div>
      )}
    </div>
  );
}
