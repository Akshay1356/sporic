// VIT-TEC Landmark Previous Training Programs Data Store
// Managed exclusively by ADMIN users via Admin Dashboard (/admin/previous-programs)
// Displayed cleanly on the public About page (/about)

export const initialPreviousPrograms = [
  {
    id: 'prog_lucas_tvs_mgmt_2026',
    title: 'Lucas TVS Executive Management Excellence & Multiplier Program',
    category: 'Corporate Training',
    clientOrCohort: 'Lucas TVS Limited',
    date: 'February 2026',
    year: '2026',
    participantsCount: '48 Senior Managers & Section Heads',
    image: '/gallery/lucas_tvs_management_program.jpg',
    description: 'Intensive executive upskilling on managerial multiplier principles, operational bottleneck resolution, and high-performance leadership rhythms conducted at the VIT Chennai campus.',
    outcomes: [
      'Empowered 48 cross-functional managers with streamlined operational delegation tools',
      'Developed 12 department-level continuous improvement and waste-reduction roadmaps',
      'Awarded official SpoRIC & VIT-TEC Executive Completion Credentials',
    ],
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'prog_industrial_strategy_2026',
    title: 'Strategic Operations & Industrial Process Optimization Workshop',
    category: 'Management',
    clientOrCohort: 'Automotive & Manufacturing Consortium',
    date: 'January 2026',
    year: '2026',
    participantsCount: '52 Industrial Engineers',
    image: '/gallery/strategic_planning_industrial_training.png',
    description: 'Hands-on practical training on Value Stream Mapping, Theory of Constraints, and statistical process control delivered to manufacturing engineers from regional industries.',
    outcomes: [
      'Mastery in factory flow simulation and Lean waste elimination',
      'Implementation of live Statistical Process Control (SPC) charting',
    ],
    createdAt: '2026-01-20T10:00:00.000Z',
  },
  {
    id: 'prog_executive_leadership_2025',
    title: 'Corporate Executive Leadership & Strategic Thinking Keynote Series',
    category: 'Leadership & Personality',
    clientOrCohort: 'Enterprise Leadership Delegation',
    date: 'December 2025',
    year: '2025',
    participantsCount: '36 Corporate Executives & Directors',
    image: '/gallery/corporate_executive_leadership_program.jpg',
    description: 'High-impact keynote and interactive boardroom simulation focusing on emotional intelligence, high-stakes communication, and crisis decision-making for senior directors.',
    outcomes: [
      'Personalized 360-degree leadership assessment and executive presence coaching',
      'Frameworks for navigating corporate change and cross-functional negotiation',
    ],
    createdAt: '2025-12-10T10:00:00.000Z',
  },
  {
    id: 'prog_lab_tech_training_2025',
    title: 'Hands-on Computational Engineering & Simulation Lab Cohort',
    category: 'Technology',
    clientOrCohort: 'Engineering Workforce Development',
    date: 'November 2025',
    year: '2025',
    participantsCount: '65 Engineering Professionals',
    image: '/gallery/lab_training_session.png',
    description: 'Intensive computational laboratory sessions using ANSYS, MATLAB, and CAD modeling suites at the state-of-the-art VIT-TEC computing facilities.',
    outcomes: [
      'Hands-on computational fluid and structural finite element analysis',
      'Real-world simulation benchmarks and validation methodologies',
    ],
    createdAt: '2025-11-18T10:00:00.000Z',
  },
  {
    id: 'prog_certificate_ceremony_2025',
    title: 'Annual Corporate Training Certificate Distribution & Academic Convocation',
    category: 'Events',
    clientOrCohort: 'All Corporate Trainee Batches',
    date: 'October 2025',
    year: '2025',
    participantsCount: '150+ Certified Corporate Delegates',
    image: '/gallery/certificate_award_ceremony.jpg',
    description: 'Commemorative certificate awarding ceremony held at Dr. A.P.J. Abdul Kalam Block celebrating over 150 corporate professionals completing VIT-TEC customized training programs.',
    outcomes: [
      'Conferred verified VIT-TEC credentials to delegates across 8 industry sectors',
      'Industry-academia networking and research collaboration roundtable',
    ],
    createdAt: '2025-10-25T10:00:00.000Z',
  },
];

// --- STORAGE HELPER FUNCTIONS ---

export function getAllPreviousPrograms() {
  if (typeof window === 'undefined') return initialPreviousPrograms;
  try {
    const custom = JSON.parse(localStorage.getItem('sporic_previous_programs') || '[]');
    const deletedIds = new Set(JSON.parse(localStorage.getItem('sporic_deleted_program_ids') || '[]'));

    const activeInitial = initialPreviousPrograms.filter((p) => !deletedIds.has(p.id));
    const customIds = new Set(custom.map((c) => c.id));
    const combined = [...custom, ...activeInitial.filter((p) => !customIds.has(p.id))];

    return combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    return initialPreviousPrograms;
  }
}

export function savePreviousProgram(programData) {
  if (typeof window === 'undefined') return;
  try {
    const custom = JSON.parse(localStorage.getItem('sporic_previous_programs') || '[]');
    const now = new Date().toISOString();
    const record = {
      ...programData,
      id: programData.id || `prog_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: programData.createdAt || now,
      updatedAt: now,
      isCustom: true,
    };
    const updated = [record, ...custom.filter((c) => c.id !== record.id)];
    localStorage.setItem('sporic_previous_programs', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving previous program:', e);
    throw new Error('Could not save previous program record.');
  }
}

export function updatePreviousProgram(id, updatedFields) {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllPreviousPrograms();
    const target = all.find((p) => p.id === id);
    if (!target) return;

    const custom = JSON.parse(localStorage.getItem('sporic_previous_programs') || '[]');
    const updatedRecord = {
      ...target,
      ...updatedFields,
      id,
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };
    const updatedList = [updatedRecord, ...custom.filter((c) => c.id !== id)];
    localStorage.setItem('sporic_previous_programs', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
    return updatedRecord;
  } catch (e) {
    console.error('Error updating previous program:', e);
    throw new Error('Could not update previous program.');
  }
}

export function deletePreviousProgram(id) {
  if (typeof window === 'undefined') return;
  try {
    const custom = JSON.parse(localStorage.getItem('sporic_previous_programs') || '[]');
    const updated = custom.filter((c) => c.id !== id);
    localStorage.setItem('sporic_previous_programs', JSON.stringify(updated));

    const deletedIds = JSON.parse(localStorage.getItem('sporic_deleted_program_ids') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('sporic_deleted_program_ids', JSON.stringify(deletedIds));
    }
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (e) {
    console.error('Error deleting previous program:', e);
    throw new Error('Could not delete previous program.');
  }
}
