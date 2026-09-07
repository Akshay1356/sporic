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
    setSearch(searchParams.get('search') || '');
    setDomain(searchParams.get('domain') || initialDomain || 'All');
  }, [searchParams, initialDomain]);

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

  // Count courses per domain for badges
  const domainCounts = useMemo(() => {
    const all = getAllCourses();
    return {
      All: all.length,
      [DOMAINS.TECHNOLOGY]: all.filter((c) => c.domain === DOMAINS.TECHNOLOGY).length,
      [DOMAINS.MANAGEMENT]: all.filter((c) => c.domain === DOMAINS.MANAGEMENT).length,
      [DOMAINS.LEADERSHIP]: all.filter((c) => c.domain === DOMAINS.LEADERSHIP).length,
    };
  }, []);

  return (
    <div className={styles.explorer} id="courses-explorer">
      {/* Urgent Deadline Notification Ribbon */}
      {upcomingDeadlines.length > 0 && (
        <div className={styles.announcementBanner} role="alert">
          <div className={styles.announcementLeft}>
            <span className={styles.announcementIcon} aria-hidden="true">⏰</span>
            <div className={styles.announcementText}>
              <span className={styles.announcementHeadline}>Upcoming Registration Deadlines:</span>
              {upcomingDeadlines.map((u, i) => (
                <span key={u.id} className={styles.announcementDeadline}>
                  {i > 0 && ' • '}
                  {u.title.split(':')[0]} (<span className={styles.announcementDeadlineTime}>{u.daysRemaining > 0 ? `closes in ${u.daysRemaining} days` : 'closing soon'}</span>)
                </span>
              ))}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setStatusFilter(COURSE_STATUS.OPEN)} 
            className={styles.announcementBtn}
          >
            View Open Courses
          </button>
        </div>
      )}

      {/* Program Category Selector Tabs */}
      <div className={styles.categorySelectorWrapper}>
        <div className={styles.categorySelector} role="tablist" aria-label="Course categories">
          {[
            { key: 'All', label: 'All Programs' },
            { key: DOMAINS.TECHNOLOGY, label: 'Technology' },
            { key: DOMAINS.MANAGEMENT, label: 'Management' },
            { key: DOMAINS.LEADERSHIP, label: 'Leadership & Personality' },
          ].map(({ key, label }) => {
            const isSelected = domain === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleDomainSelect(key)}
                className={`${styles.categoryBtn} ${isSelected ? styles.categoryBtnActive : ''}`}
              >
                <span>{label}</span>
                <span className={styles.categoryCountBadge}>
                  {domainCounts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
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
        <span className={styles.countText} style={{ fontSize: '0.92rem', color: '#1D4ED8', fontWeight: '700' }}>
          Showing <strong>{filtered.length}</strong> available training programs
        </span>
        {search && (
          <span style={{ fontSize: '0.85rem', color: '#475569' }}>
            Filtered by keyword: <strong style={{ color: '#0F172A' }}>"{search}"</strong>
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
        <div className={styles.noResults}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: '0 0 0.5rem', fontWeight: 700 }}>
            No courses found. Try a different search.
          </h3>
          <p style={{ color: '#64748B', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.88rem', lineHeight: 1.5 }}>
            We couldn't find any courses matching your current search or filter criteria. Try selecting another category or reset all filters.
          </p>
          <button onClick={clearFilters} className="btn btn-primary">
            Show All Courses
          </button>
        </div>
      )}
    </div>
  );
}
