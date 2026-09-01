import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAllCourses, DOMAINS } from '../data/courses';
import CourseCard from '../components/CourseCard';
import styles from './Courses.module.css';

export default function Management() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const mgmtCourses = useMemo(() => {
    return getAllCourses().filter((c) => c.domain === DOMAINS.MANAGEMENT);
  }, []);

  const subcategories = useMemo(() => {
    const cats = new Set(mgmtCourses.map((c) => c.category));
    return ['All', ...Array.from(cats)];
  }, [mgmtCourses]);

  const filteredCourses = useMemo(() => {
    return mgmtCourses.filter((c) => {
      const matchesSub = selectedSubcategory === 'All' || c.category === selectedSubcategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesSub && matchesSearch;
    });
  }, [mgmtCourses, selectedSubcategory, searchQuery]);

  return (
    <div className={styles.coursesPage}>
      {/* Institutional Top Banner */}
      <section className={styles.banner}>
        <div className="grid-bg" style={{ opacity: 0.5 }} />
        <div className="container">
          <span className="section-label">Learning Domain • Management</span>
          <h1 className={styles.title}>Management Programs</h1>
          <p className={styles.subtitle}>
            Empowering executives and technical leaders with strategic management, agile operations, corporate finance, digital supply chain, and data-driven business modeling.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div className="container">
          {/* Filter & Search Bar */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Search Box */}
              <div style={{ flex: 1, minWidth: '280px', maxWidth: '480px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search Management courses by title, ID, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '8px',
                    border: '1.5px solid #D0D5DD',
                    fontSize: '0.925rem',
                    outline: 'none',
                    background: '#FFFFFF',
                    color: '#101828',
                  }}
                />
              </div>

              {/* Count Indicator */}
              <div style={{ fontSize: '0.9rem', color: '#0B2A6F', fontWeight: '700', background: '#EFF6FF', padding: '0.6rem 1.1rem', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                Showing {filteredCourses.length} of {mgmtCourses.length} Management Courses
              </div>
            </div>

            {/* Subcategory Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem' }}>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.825rem',
                    fontWeight: '600',
                    border: selectedSubcategory === sub ? '1px solid #0B2A6F' : '1px solid #E4E7EC',
                    background: selectedSubcategory === sub ? '#0B2A6F' : '#FFFFFF',
                    color: selectedSubcategory === sub ? '#FFFFFF' : '#344054',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E7EC' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#101828', marginBottom: '0.5rem' }}>No Courses Found</h3>
              <p style={{ color: '#667085', fontSize: '0.95rem' }}>Try clearing your search query or choosing another subcategory.</p>
              <button
                onClick={() => { setSelectedSubcategory('All'); setSearchQuery(''); }}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
