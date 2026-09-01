// VIT-TEC Real Course Data
// Source: https://vit-tec.vit.ac.in/available-courses
// All data extracted from the original VIT-TEC website

export const DOMAINS = {
  TECHNOLOGY: 'Technology',
  MANAGEMENT: 'Management',
  LEADERSHIP: 'Leadership & Personality',
};

export const CATEGORIES = {
  INDUSTRY40: 'Industry 4.0',
  ELECTRIC_VEHICLES: 'Electric Vehicles',
  DESIGN: 'Design',
  OPTICS: 'Optics',
  MANUFACTURING: 'Manufacturing',
  RENEWABLE_ENERGY: 'Renewable Energy',
  CONSTRUCTION: 'Construction Technology',
  ADAS: 'ADAS',
  QUANTUM: 'Quantum Computing',
  SIMULATION: 'Simulation',
  OPERATIONS: 'Operations Management',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  DATA_SCIENCE: 'Data Science',
  LEADERSHIP_DEV: 'Leadership & Personality',
};

export const TRAINING_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BLENDED: 'blended',
};

export const courses = [
  // ─── TECHNOLOGY › INDUSTRY 4.0 ───────────────────────────────
  {
    id: 'TECH004',
    title: 'Digital Tools for Industry 4.0',
    shortDescription: 'Explore Digital Transformation in Manufacturing Sector',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Digitalization of Manufacturing Sector',
      'Intelligent Technologies for Industry 4.0',
      'Concepts of digital manufacturing and industrial automation',
      'Application of digital tools in Industries',
    ],
    modules: [
      'Factory Automation – Digital transformation',
      'Industry 4.0 and Connected Machines',
      'AR, VR and Digital Twins',
      'Data Analytics, AI and ML in Manufacturing',
      'Design Tools for Additive Manufacturing',
    ],
    features: [
      'Factory automation demonstrations using Siemens TIA Portal',
      'Data Analytics, AI and ML development using MATLAB and LabVIEW',
      'Design for 3D printing using Fusion 360, Netfabb, Meshmixer, Cura, Simplify3D',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '26-10-2023' },
      { batch: 2, date: '18-01-2024' },
    ],
  },
  {
    id: 'TECH054',
    title: 'Full Stack Development (Intermediate Level)',
    shortDescription: 'Master front-end and back-end skills to unlock limitless innovation',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Complete web development process end-to-end',
      'Build MongoDB, Express JS, Angular JS, Node JS stack applications',
      'Build user interfaces with Angular, APIs with Express',
      'TypeScript basics and Node.js server setup',
      'MongoDB for scalable, flexible, distributed NoSQL data storage',
      'Deploy scalable and dynamic applications',
    ],
    modules: [
      'JavaScript, JQuery, JSON',
      'Angular JS, Node JS',
      'React Framework',
      'Express JS',
    ],
    features: [
      'Resource Materials',
      'Hands-on Training',
      'Industry level Curriculum',
      'Real Life Case Study',
      'Build your Portfolio',
    ],
    sessions: [
      { batch: 1, date: '05-10-2023' },
      { batch: 2, date: '14-12-2023' },
    ],
  },
  {
    id: 'TECH067',
    title: 'GenAI Tools for Smart Work',
    shortDescription: 'Leverage Large Language Models to transform your work into smart work',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 15,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Using large language models (LLMs) to improve working culture',
      'Smart handling techniques for higher productivity',
      'Leveraging GenAI for code writing and project management',
    ],
    modules: [
      'Easy Presentation using slide shows',
      'Enhancing tasks and schedules',
      'Breaking requirements into easy chunks',
      'Elegant Code writing with AI',
      'Effective project management skills',
      'Vibrant video presentations',
    ],
    features: [
      'Hands-on sessions',
      'Live interactive Activities',
      'Case-Studies',
      'Two Live Quizzes',
      'Live Assignments',
      'Resource Materials',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '09-02-2024' },
    ],
  },
  {
    id: 'TECH068',
    title: 'Computational Fluid Dynamics (CFD)',
    shortDescription: 'Master CFD methods across a broad range of automotive applications',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 15,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Understand, practice, and apply CFD methods',
      'External aerodynamics for automotive applications',
      'Thermal Management using CFD',
      'Flow physics insight for real CFD applications',
    ],
    modules: [
      'CFD problem set-up and solving',
      'Post-processing CFD results',
      'Automotive aerodynamics applications',
      'Thermal management simulation',
    ],
    features: [
      'Industry need based contents',
      'Hands-on sessions',
      'Case studies',
      'Certification of Completion',
      'Tutorials',
    ],
    sessions: [
      { batch: 1, date: '18-04-2024' },
    ],
  },
  {
    id: 'TECH061',
    title: 'Reliability Engineering',
    shortDescription: 'Elevate the performance of your company with our Reliability Engineering program',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Various failure distribution methods and failure rate modelling',
      'How to determine the reliability of various systems',
      'Various models of reliability, maintainability and availability',
      'Empirical methods for data collection and Reliability estimation',
    ],
    modules: [
      'Study of failure distribution and failure rate models',
      'Reliability and maintainability concepts',
      'Determination of reliability of different systems',
      'Different models of reliability, maintainability and availability',
      'Empirical methods for data collection and Reliability estimation',
    ],
    features: [
      'Comprehensive Foundation',
      'System Assessment',
      'Versatile Model Proficiency',
      'Data-Driven Expertise',
    ],
    sessions: [
      { batch: 1, date: '26-10-2023' },
      { batch: 2, date: '18-01-2024' },
    ],
  },
  // ─── TECHNOLOGY › DESIGN ────────────────────────────────────
  {
    id: 'TECH032',
    title: 'Engineering Design (Beginners)',
    shortDescription: 'Taking Theory to Practice — foundational engineering design skills',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.DESIGN,
    hours: 45,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Benchmarking & Concept Design',
      'Selection of materials & Processes',
      'Design for X',
      'Analytics for Manufacturing',
    ],
    modules: [
      'Basic Design & Modelling',
      'Selection of materials',
      'Design Calculations',
      'Benchmarking methods',
      'Concept Design',
      'Selection of processes',
      'Basics of GD&T',
      'Codes & Standards',
    ],
    features: [
      'CAD modelling using advanced tools',
      'Hands-on sessions',
      'Exposure to FE Simulation',
      'Case-studies',
      'Resource Materials',
      'Live Tutorials',
      'Lab sessions using CATIA, ANSYS, MSC, ABAQUS',
      'Certification of Completion',
      'Professional Certification Coupons for CAD software Tools',
      'Co-Certification from MSC/ANSYS/DS',
    ],
    sessions: [
      { batch: 1, date: '26-10-2023' },
      { batch: 2, date: '18-01-2024' },
    ],
  },
  // ─── TECHNOLOGY › CONSTRUCTION TECHNOLOGY ───────────────────
  {
    id: 'TECH041',
    title: 'Energy Harvesting and Safety',
    shortDescription: 'Energy Harvesting for a Sustainable Future',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.CONSTRUCTION,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Energy harvesting techniques',
      'Repair and retrofitting for energy efficiency',
      'Zero energy buildings',
    ],
    modules: [
      'Construction Safety',
      'Evacuation patterns in High rise buildings',
      'Repair and Structural Strengthening',
      'Sustainable Energy',
    ],
    features: [
      'Introduction to remote monitoring',
      'Effective usage of IoT',
      'Ways of achieving sustainable goals',
      'In depth analysis on energy audit',
    ],
    sessions: [
      { batch: 1, date: '05-10-2023' },
      { batch: 2, date: '14-12-2023' },
    ],
  },
  // ─── TECHNOLOGY › ELECTRIC VEHICLES ─────────────────────────
  {
    id: 'TECH015',
    title: 'Electric Vehicle Technology',
    shortDescription: 'Comprehensive training on EV systems, battery technology and charging infrastructure',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.ELECTRIC_VEHICLES,
    hours: 30,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Electric vehicle architecture and components',
      'Battery management systems',
      'Motor drives and power electronics',
      'EV charging infrastructure',
    ],
    modules: [
      'Introduction to Electric Vehicles',
      'Battery Technology & BMS',
      'Motor & Drive Systems',
      'Power Electronics for EVs',
      'Charging Systems & Infrastructure',
    ],
    features: [
      'Hands-on lab sessions',
      'Industry expert sessions',
      'Case studies on real EV systems',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '01-11-2023' },
    ],
  },
  // ─── TECHNOLOGY › RENEWABLE ENERGY ──────────────────────────
  {
    id: 'TECH022',
    title: 'Renewable Energy Systems',
    shortDescription: 'Solar, wind, and hybrid energy solutions for the sustainable future',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.RENEWABLE_ENERGY,
    hours: 25,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Solar PV system design and installation',
      'Wind energy fundamentals',
      'Hybrid energy systems',
      'Grid integration of renewable energy',
    ],
    modules: [
      'Solar Energy Fundamentals',
      'Wind Energy Systems',
      'Energy Storage Technologies',
      'Grid Integration & Smart Grids',
      'Hybrid Renewable Systems',
    ],
    features: [
      'Simulation-based learning',
      'Industry-standard tools',
      'Case studies',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '15-11-2023' },
    ],
  },
  // ─── TECHNOLOGY › QUANTUM COMPUTING ─────────────────────────
  {
    id: 'TECH055',
    title: 'Quantum Computing Fundamentals',
    shortDescription: 'Introduction to quantum principles and their computing applications',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.QUANTUM,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Quantum mechanics fundamentals for computing',
      'Qubits, superposition and entanglement',
      'Quantum gates and circuits',
      'Quantum algorithms and their applications',
    ],
    modules: [
      'Introduction to Quantum Computing',
      'Quantum Bits and Quantum States',
      'Quantum Gates and Circuits',
      'Quantum Algorithms (Shor, Grover)',
      'Quantum Programming with Qiskit',
    ],
    features: [
      'Hands-on programming with Qiskit',
      'IBM Quantum Experience access',
      'Real quantum hardware experiments',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '20-01-2024' },
    ],
  },
  // ─── MANAGEMENT › OPERATIONS ─────────────────────────────────
  {
    id: 'MGMT001',
    title: 'Operations Management',
    shortDescription: 'Streamline business operations for maximum efficiency and productivity',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.OPERATIONS,
    hours: 30,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Operations strategy and design',
      'Supply chain management',
      'Quality management systems',
      'Process optimization and lean manufacturing',
    ],
    modules: [
      'Operations Strategy',
      'Process Design & Analysis',
      'Supply Chain Management',
      'Quality Management (TQM, Six Sigma)',
      'Inventory Management',
      'Project Management',
    ],
    features: [
      'Case studies from industry leaders',
      'Interactive workshops',
      'Tools: Excel, Minitab, Arena',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '02-11-2023' },
      { batch: 2, date: '25-01-2024' },
    ],
  },
  {
    id: 'MGMT002',
    title: 'Financial Management for Professionals',
    shortDescription: 'Master financial analysis, planning and decision-making skills',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.FINANCE,
    hours: 25,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Financial statement analysis',
      'Capital budgeting and investment decisions',
      'Working capital management',
      'Risk management and corporate finance',
    ],
    modules: [
      'Financial Statements & Analysis',
      'Capital Budgeting',
      'Working Capital Management',
      'Corporate Valuation',
      'Risk & Return',
    ],
    features: [
      'Real-world case studies',
      'Excel financial modelling',
      'Industry guest lectures',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '10-11-2023' },
    ],
  },
  {
    id: 'MGMT003',
    title: 'Marketing Management',
    shortDescription: 'Strategic marketing approaches for the modern business environment',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.MARKETING,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Market research and consumer behaviour',
      'Digital marketing strategies',
      'Brand management',
      'Sales management and CRM',
    ],
    modules: [
      'Marketing Strategy & Planning',
      'Consumer Behaviour',
      'Digital Marketing (SEO, SEM, Social)',
      'Brand Management',
      'Sales & Distribution Management',
    ],
    features: [
      'Live digital marketing campaigns',
      'Case studies of global brands',
      'Industry practitioner sessions',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '20-11-2023' },
    ],
  },
  {
    id: 'MGMT004',
    title: 'Data Science for Business',
    shortDescription: 'Harness data science techniques to drive strategic business decisions',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.DATA_SCIENCE,
    hours: 30,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Data analytics fundamentals',
      'Machine learning for business applications',
      'Data visualization and storytelling',
      'Predictive analytics and forecasting',
    ],
    modules: [
      'Introduction to Data Science',
      'Python for Data Analysis',
      'Machine Learning Fundamentals',
      'Data Visualization (Tableau, Power BI)',
      'Predictive Modelling',
      'Business Intelligence',
    ],
    features: [
      'Hands-on Python programming',
      'Real business datasets',
      'Tools: Python, R, Tableau, Power BI',
      'Capstone project',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '05-12-2023' },
      { batch: 2, date: '15-02-2024' },
    ],
  },
  // ─── LEADERSHIP & PERSONALITY ────────────────────────────────
  {
    id: 'LEAD001',
    title: 'Leadership Excellence Program',
    shortDescription: 'Develop transformational leadership skills for the modern workplace',
    domain: DOMAINS.LEADERSHIP,
    category: CATEGORIES.LEADERSHIP_DEV,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Transformational and situational leadership',
      'Emotional intelligence in leadership',
      'Conflict resolution and team building',
      'Strategic thinking and decision making',
    ],
    modules: [
      'Leadership Styles & Theories',
      'Emotional Intelligence (EQ)',
      'Team Building & Motivation',
      'Conflict Management',
      'Strategic Decision Making',
      'Leading Change',
    ],
    features: [
      'Self-assessment tools',
      'Role-playing exercises',
      'Executive coaching techniques',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '08-11-2023' },
      { batch: 2, date: '05-02-2024' },
    ],
  },
  {
    id: 'LEAD002',
    title: 'Communication & Personality Development',
    shortDescription: "Trainers lend their expertise to evaluate and enhance one's personality for better outcomes",
    domain: DOMAINS.LEADERSHIP,
    category: CATEGORIES.LEADERSHIP_DEV,
    hours: 15,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Effective verbal and non-verbal communication',
      'Public speaking and presentation skills',
      'Interpersonal skills and body language',
      'Professional etiquette and grooming',
    ],
    modules: [
      'Verbal Communication Skills',
      'Non-Verbal Communication',
      'Public Speaking & Presentations',
      'Interpersonal Skills',
      'Professional Etiquette',
      'Personality Assessment & Development',
    ],
    features: [
      'Mock presentations',
      'Group discussions',
      'Personal feedback sessions',
      'Video analysis of communication',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '15-11-2023' },
      { batch: 2, date: '20-02-2024' },
    ],
  },
  {
    id: 'LEAD003',
    title: 'Stress Management & Work-Life Balance',
    shortDescription: 'Build resilience and achieve sustainable high performance at work',
    domain: DOMAINS.LEADERSHIP,
    category: CATEGORIES.LEADERSHIP_DEV,
    hours: 10,
    mode: TRAINING_MODES.ONLINE,
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Identifying and managing workplace stress',
      'Mindfulness and resilience techniques',
      'Time management and prioritization',
      'Achieving sustainable work-life balance',
    ],
    modules: [
      'Understanding Stress & Burnout',
      'Mindfulness & Meditation Techniques',
      'Time Management Strategies',
      'Resilience Building',
      'Work-Life Integration',
    ],
    features: [
      'Interactive workshops',
      'Guided mindfulness sessions',
      'Personal action planning',
      'Certification of Completion',
    ],
    sessions: [
      { batch: 1, date: '22-11-2023' },
    ],
  },
];

// Helper to get all combined courses (pre-seeded + admin-created)
export function getAllCourses() {
  if (typeof window === 'undefined') return courses;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    if (!Array.isArray(customCourses) || customCourses.length === 0) return courses;
    const customIds = new Set(customCourses.map(c => c.id));
    return [...customCourses, ...courses.filter(c => !customIds.has(c.id))];
  } catch {
    return courses;
  }
}

export function saveNewCourse(courseData) {
  if (typeof window === 'undefined') return;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    const updated = [courseData, ...customCourses.filter(c => c.id !== courseData.id)];
    localStorage.setItem('sporic_custom_courses', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Error saving custom course:', e);
  }
}

export function deleteCustomCourse(courseId) {
  if (typeof window === 'undefined') return;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    const updated = customCourses.filter(c => c.id !== courseId);
    localStorage.setItem('sporic_custom_courses', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Error deleting custom course:', e);
  }
}

// Helper functions
export function getCourseById(id) {
  return getAllCourses().find(c => c.id === id);
}

export function getCoursesByDomain(domain) {
  return getAllCourses().filter(c => c.domain === domain);
}

export function getCoursesByCategory(category) {
  return getAllCourses().filter(c => c.category === category);
}

export function filterCourses({ search = '', domain = '', category = '', mode = '' }) {
  return getAllCourses().filter(course => {
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      course.id.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase());

    const matchesDomain = !domain || course.domain === domain;
    const matchesCategory = !category || course.category === category;
    const matchesMode = !mode || course.mode === mode;

    return matchesSearch && matchesDomain && matchesCategory && matchesMode;
  });
}

export const domainInfo = [
  {
    key: 'technology',
    title: 'Technology',
    domain: DOMAINS.TECHNOLOGY,
    description: 'Technology programs offer upskilling and reskilling in emerging technical areas — from Industry 4.0 and Electric Vehicles to Quantum Computing and AI.',
    icon: 'tech',
    color: 'blue',
    categories: [
      CATEGORIES.INDUSTRY40,
      CATEGORIES.ELECTRIC_VEHICLES,
      CATEGORIES.DESIGN,
      CATEGORIES.OPTICS,
      CATEGORIES.MANUFACTURING,
      CATEGORIES.RENEWABLE_ENERGY,
      CATEGORIES.CONSTRUCTION,
      CATEGORIES.ADAS,
      CATEGORIES.QUANTUM,
      CATEGORIES.SIMULATION,
    ],
    path: '/technology',
  },
  {
    key: 'management',
    title: 'Management',
    domain: DOMAINS.MANAGEMENT,
    description: 'Developing strong management skills is essential to take on leadership roles and advance careers in any industry.',
    icon: 'mgmt',
    color: 'cyan',
    categories: [
      CATEGORIES.OPERATIONS,
      CATEGORIES.FINANCE,
      CATEGORIES.MARKETING,
      CATEGORIES.DATA_SCIENCE,
    ],
    path: '/management',
  },
  {
    key: 'leadership',
    title: 'Leadership & Personality',
    domain: DOMAINS.LEADERSHIP,
    description: 'Trainers will lend their expertise to evaluate your personality, alter your perception for better outcomes and develop comprehensive professional skills.',
    icon: 'lead',
    color: 'violet',
    categories: [CATEGORIES.LEADERSHIP_DEV],
    path: '/leadership',
  },
];
