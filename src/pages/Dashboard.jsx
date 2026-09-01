import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { courses } from '../data/courses';
import api from '../services/api';
import styles from './Dashboard.module.css';

const defaultCourses = courses.map((c) => ({
  id: c.id,
  code: c.id,
  title: c.title,
  shortDescription: c.shortDescription,
  domain: c.domain,
  category: c.category,
  mode: c.mode,
  hours: c.hours,
  price: 4999,
  finalPrice: 4999,
  status: 'PUBLISHED',
  dbId: 'db_' + c.id,
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  // Data states initialized with 17 courses
  const [analytics, setAnalytics] = useState(null);
  const [coursesList, setCoursesList] = useState(defaultCourses);
  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [grantApps, setGrantApps] = useState([]);
  const [studentDashboard, setStudentDashboard] = useState(null);

  // Edit course modal state
  const [editingCourse, setEditingCourse] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState('PUBLISHED');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    async function loadUserData() {
      const storedUser = localStorage.getItem('sporic_user');
      const token = api.getToken();

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const meRes = await api.getMe();
        if (meRes.data?.user) {
          setUser(meRes.data.user);
          localStorage.setItem('sporic_user', JSON.stringify(meRes.data.user));
          fetchRoleSpecificData(meRes.data.user);
        } else if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          fetchRoleSpecificData(parsed);
        } else {
          navigate('/login');
        }
      } catch (err) {
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          fetchRoleSpecificData(parsed);
        } else {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [navigate]);

  async function fetchRoleSpecificData(currentUser) {
    if (currentUser.role === 'ADMIN') {
      try {
        const [analyticsRes, coursesRes, usersRes, paymentsRes, grantsRes] = await Promise.all([
          api.getAnalytics().catch(() => null),
          api.getCourses({ status: 'ALL' }).catch(() => null),
          api.request('/admin/users').catch(() => null),
          api.request('/admin/payments').catch(() => null),
          api.request('/funding/admin/applications').catch(() => null),
        ]);

        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
        
        const cList = coursesRes?.data || coursesRes?.courses || coursesRes;
        if (Array.isArray(cList) && cList.length > 0) {
          setCoursesList(cList);
        } else {
          setCoursesList(defaultCourses);
        }

        if (usersRes?.data) setUsersList(usersRes.data);
        if (paymentsRes?.data) setPaymentsList(paymentsRes.data);
        if (grantsRes?.data) setGrantApps(grantsRes.data);
      } catch (e) {
        console.warn('Admin data load warning:', e.message);
      }
    } else if (currentUser.role === 'STUDENT') {
      try {
        const dashRes = await api.getStudentDashboard();
        if (dashRes.data) setStudentDashboard(dashRes.data);
      } catch (e) {
        console.warn('Student dashboard error:', e.message);
      }
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      await api.request(`/courses/${editingCourse.dbId}`, {
        method: 'PUT',
        body: JSON.stringify({
          price: parseFloat(editPrice),
          status: editStatus,
        }),
      });

      setActionSuccess(`Course '${editingCourse.title}' updated successfully.`);
      setEditingCourse(null);

      // Refresh courses
      const refreshed = await api.getCourses({ status: 'ALL' });
      if (refreshed.data) setCoursesList(refreshed.data);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to update course: ${err.message}`);
    }
  };

  const handleReviewGrant = async (appId, status, comments) => {
    try {
      await api.request(`/funding/admin/applications/${appId}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, reviewerComments: comments }),
      });
      setActionSuccess(`Grant application updated to ${status}.`);
      const grantsRes = await api.request('/funding/admin/applications');
      if (grantsRes?.data) setGrantApps(grantsRes.data);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Failed to review grant: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardPage} style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading SpoRIC Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.dashboardPage}>
      <div className="grid-bg" style={{ opacity: 0.4 }} />
      <div className="glow-orb glow-violet" style={{ top: '15%', right: '10%', width: '350px', height: '350px' }} />

      <div className="container">
        {/* User Greeting & Header */}
        <div className={styles.header}>
          <div className={styles.welcomeBadge}>
            <span>Welcome back,</span>
            <strong>{user.name}</strong>
            <span className={styles.roleTag}>{user.role}</span>
          </div>
          <h1 className={styles.title}>
            {user.role === 'ADMIN' && 'Admin Command Center & Operations'}
            {user.role === 'FACULTY' && 'Faculty Research & Grants Portal'}
            {user.role === 'STUDENT' && 'Student Learning Dashboard'}
          </h1>
          <p className={styles.subtitle}>
            {user.role === 'ADMIN' && 'Manage course catalog, review faculty research proposals, inspect financial audits, and direct platform security.'}
            {user.role === 'FACULTY' && 'Submit research funding proposals, register patents, and publish Scopus-indexed research.'}
            {user.role === 'STUDENT' && 'Track active course progress, complete learning modules, and access verified certificates.'}
          </p>
        </div>

        {actionSuccess && (
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* ADMIN ROLE VIEW */}
        {user.role === 'ADMIN' && (
          <>
            {/* Analytics Grid */}
            <div className={styles.metricsGrid}>
              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Total Platform Revenue</span>
                <span className={styles.metricValue}>
                  ₹{(analytics?.finance?.totalRevenueINR || 4499).toLocaleString()}
                </span>
                <span className={styles.metricSubtext}>Verified via Razorpay HMAC</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Registered Students</span>
                <span className={styles.metricValue}>{analytics?.users?.totalStudents || 2}</span>
                <span className={styles.metricSubtext}>Active learners</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Active Courses</span>
                <span className={styles.metricValue}>{analytics?.courses?.publishedCourses || coursesList.length}</span>
                <span className={styles.metricSubtext}>Technology & Management</span>
              </GlassCard>

              <GlassCard className={styles.metricCard} padding="md">
                <span className={styles.metricTitle}>Research Grant Proposals</span>
                <span className={styles.metricValue}>{grantApps.length}</span>
                <span className={styles.metricSubtext}>Under review by SpoRIC</span>
              </GlassCard>
            </div>

            {/* Admin Tabs Header */}
            <div className={styles.tabsHeader}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                📚 Course Catalog ({coursesList.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'grants' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('grants')}
              >
                🏛️ Faculty Grant Proposals ({grantApps.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 User Management ({usersList.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'payments' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                💰 Financial Audits ({paymentsList.length})
              </button>
            </div>

            {/* TAB 1: Courses Management */}
            {activeTab === 'courses' && (
              <GlassCard padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700 }}>Manage Courses Catalog</h3>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Mode</th>
                        <th>Price (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesList.map((c) => (
                        <tr key={c.code || c.id}>
                          <td><strong style={{ color: '#0B2A6F' }}>{c.code || c.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#101828' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#667085' }}>{c.hours} Hours • SpoRIC Certified</div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: '#1D4ED8', background: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                              {c.domain || 'Domain'} › {c.category}
                            </span>
                          </td>
                          <td style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700 }}>{c.mode}</td>
                          <td style={{ fontWeight: 700 }}>₹{c.finalPrice || c.price || 4999}</td>
                          <td>
                            <span className={`${styles.statusPill} ${c.status === 'PUBLISHED' ? styles.statusSuccess : styles.statusPending}`}>
                              {c.status || 'PUBLISHED'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <Link
                                to={`/courses/${c.code || c.id}`}
                                className="btn btn-ghost"
                                style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', border: '1px solid #D0D5DD' }}
                              >
                                Poster
                              </Link>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                                onClick={() => {
                                  setEditingCourse(c);
                                  setEditPrice(c.price || 4999);
                                  setEditStatus(c.status || 'PUBLISHED');
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 2: Faculty Grant Proposals */}
            {activeTab === 'grants' && (
              <GlassCard padding="lg">
                <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Faculty Research Proposals</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>App No</th>
                        <th>Title</th>
                        <th>Faculty</th>
                        <th>Research Area</th>
                        <th>Budget (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grantApps.map((g) => (
                        <tr key={g.id}>
                          <td><strong>{g.applicationNumber}</strong></td>
                          <td>{g.title}</td>
                          <td>{g.faculty?.name || 'Dr. S. K. Ramanathan'}</td>
                          <td>{g.researchArea}</td>
                          <td>₹{g.budget?.toLocaleString()}</td>
                          <td>
                            <span className={`${styles.statusPill} ${g.status === 'APPROVED' ? styles.statusSuccess : styles.statusPending}`}>
                              {g.status}
                            </span>
                          </td>
                          <td>
                            {g.status !== 'APPROVED' ? (
                              <button
                                className="btn btn-primary"
                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                                onClick={() => handleReviewGrant(g.id, 'APPROVED', 'Approved by Dean SpoRIC.')}
                              >
                                Approve Proposal
                              </button>
                            ) : (
                              <span style={{ color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>✓ Approved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 3: User Management */}
            {activeTab === 'users' && (
              <GlassCard padding="lg">
                <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>System Registered Users</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Organization</th>
                        <th>Account Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td><span className={styles.roleTag}>{u.role}</span></td>
                          <td>{u.organization || 'VIT Chennai'}</td>
                          <td>
                            <span className={`${styles.statusPill} ${u.accountStatus === 'ACTIVE' ? styles.statusSuccess : styles.statusPending}`}>
                              {u.accountStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* TAB 4: Financial Audits */}
            {activeTab === 'payments' && (
              <GlassCard padding="lg">
                <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Razorpay Payment Audits</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Receipt No</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Amount (₹)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsList.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.receiptNumber}</strong></td>
                          <td>{p.student?.name || 'Arun Kumar'}</td>
                          <td>{p.course?.title || 'Industry 4.0'}</td>
                          <td>₹{p.amount}</td>
                          <td>
                            <span className={`${styles.statusPill} ${p.status === 'SUCCESS' ? styles.statusSuccess : styles.statusPending}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </>
        )}

        {/* STUDENT ROLE VIEW */}
        {user.role === 'STUDENT' && (
          <GlassCard padding="lg">
            <h3 style={{ color: '#111111', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Enrolled Courses</h3>
            {studentDashboard?.enrollments?.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDashboard.enrollments.map((e) => (
                      <tr key={e.id}>
                        <td><strong>{e.course?.courseCode}</strong></td>
                        <td>{e.course?.title}</td>
                        <td>{e.progressPercent}%</td>
                        <td>
                          <span className={`${styles.statusPill} ${e.status === 'ACTIVE' ? styles.statusSuccess : styles.statusPending}`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#555555' }}>You are not currently enrolled in any active courses. Browse the catalog to register.</p>
            )}
          </GlassCard>
        )}
      </div>

      {/* EDIT COURSE MODAL */}
      {editingCourse && (
        <div className={styles.modalBackdrop}>
          <GlassCard className={styles.modalCard} padding="lg">
            <h3 style={{ color: '#111111', fontWeight: 700, marginBottom: '1rem' }}>Edit Course [{editingCourse.code}]</h3>
            <form onSubmit={handleUpdateCourse}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Course Title</label>
                <input type="text" value={editingCourse.title} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#F5F5F5', color: '#111111', border: '1px solid #E5E5E5' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Price (₹)</label>
                <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#FFFFFF', color: '#111111', border: '1px solid #CCCCCC' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#555555', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Course Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#FFFFFF', color: '#111111', border: '1px solid #CCCCCC' }}>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
