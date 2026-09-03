// VIT-TEC Master Course Catalog & Data Engine
// Source: https://vit-tec.vit.ac.in/available-courses
// Standardized across Home, Courses Discovery, Domain Pages, Course Details, Search & Enquiries

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

export const COURSE_STATUS = {
  OPEN: 'Open for Registration',
  UPCOMING: 'Upcoming',
  CLOSED: 'Registration Closed',
  COMPLETED: 'Completed',
};

export const courses = [
  // ─── TECHNOLOGY › INDUSTRY 4.0 & AI ───────────────────────────────
  {
    id: 'TECH004',
    title: 'Digital Engineering & Industrial Automation 4.0',
    shortDescription: 'Master digital manufacturing transformation, IoT connected machines, and smart factory automation tools.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    price: 4999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    registrationDeadline: '2026-10-10',
    trainer: 'Dr. A. Sundaram & Siemens Certified Specialists',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    keywords: ['Industry 4.0', 'Automation', 'IoT', 'Digital Twin', 'Siemens TIA', 'Manufacturing', 'Technology'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Digitalization of modern industrial manufacturing workflows',
      'Intelligent sensor networking and Industrial IoT architecture',
      'Digital twins, AR/VR simulation and virtual commissioning',
      'Factory automation integration with Siemens TIA Portal',
    ],
    modules: [
      'Module 1: Industrial Automation & Factory Digitalization Fundamentals',
      'Module 2: Connected Machines, Sensor Protocols & IIoT Edge Nodes',
      'Module 3: Virtual Commissioning, AR/VR & Real-time Digital Twins',
      'Module 4: Predictive AI & Machine Learning in Modern Manufacturing',
      'Module 5: Additive Manufacturing Tools & Generative Design',
    ],
    features: [
      'Factory automation hands-on simulations with Siemens TIA Portal',
      'AI/ML predictive maintenance workflows in MATLAB and LabVIEW',
      'Design for 3D printing using Fusion 360 & Netfabb',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [
      { batch: 1, date: '15-10-2026' },
      { batch: 2, date: '12-11-2026' },
    ],
  },
  {
    id: 'TECH054',
    title: 'Full Stack Cloud & Web Application Engineering',
    shortDescription: 'End-to-end full stack web architecture with React, Node.js, Express, and distributed MongoDB databases.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 30,
    mode: TRAINING_MODES.ONLINE,
    price: 5999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-20',
    endDate: '2026-11-30',
    registrationDeadline: '2026-10-14',
    trainer: 'Prof. R. Venkatesh & Senior Cloud Architects',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    keywords: ['Full Stack', 'Web Development', 'React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'Cloud'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Complete end-to-end modern full stack web application engineering',
      'Build resilient RESTful and GraphQL APIs with Express and Node.js',
      'Modern state management and dynamic UI design with React 19',
      'Cloud deployment, containerization, and distributed database scaling',
    ],
    modules: [
      'Module 1: Modern JavaScript ES6+, TypeScript & DOM Optimization',
      'Module 2: Component Architecture, React Hooks & Global State',
      'Module 3: Server Engineering with Node.js, Express & JWT Auth',
      'Module 4: Scalable NoSQL Data Modeling with MongoDB & Redis',
      'Module 5: Capstone: Production Cloud Deployment with CI/CD',
    ],
    features: [
      'Hands-on live full-stack coding sessions',
      'Industry-standard production project architecture',
      'Real-world portfolio building with microservices',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [
      { batch: 1, date: '20-10-2026' },
    ],
  },
  {
    id: 'TECH067',
    title: 'Applied Generative AI & LLM Productivity Tools',
    shortDescription: 'Harness Large Language Models, prompt engineering, and GenAI agent workflows for enterprise intelligence.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 15,
    mode: TRAINING_MODES.ONLINE,
    price: 3999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-05',
    endDate: '2026-10-25',
    registrationDeadline: '2026-10-01',
    trainer: 'Dr. K. Senthil Kumar (AI Innovation Lead)',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    keywords: ['AI', 'Generative AI', 'GenAI', 'LLM', 'ChatGPT', 'Python', 'Machine Learning', 'Artificial Intelligence'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Leveraging state-of-the-art LLMs to streamline corporate workflows',
      'Advanced prompt engineering, embeddings, and context design',
      'Automated code generation, document summarization, and data parsing',
      'Building custom AI autonomous assistants for enterprise operations',
    ],
    modules: [
      'Module 1: Large Language Model Architectures & Prompt Design',
      'Module 2: AI Code Generation, Debugging & Test Automation',
      'Module 3: Enterprise Multimodal Tools: Text, Visuals & Presentation',
      'Module 4: Retrieval Augmented Generation (RAG) Fundamentals',
    ],
    features: [
      'Live interactive agent building laboratories',
      'Real-world corporate productivity case studies',
      'Take-home prompt templates and API workflows',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [
      { batch: 1, date: '05-10-2026' },
    ],
  },
  {
    id: 'TECH068',
    title: 'Computational Fluid Dynamics (CFD) for Automotive Systems',
    shortDescription: 'Advanced aerodynamic modeling, thermal management, and flow physics simulations for automotive engineering.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.SIMULATION,
    hours: 25,
    mode: TRAINING_MODES.ONLINE,
    price: 6499,
    status: COURSE_STATUS.UPCOMING,
    startDate: '2026-11-01',
    endDate: '2026-11-28',
    registrationDeadline: '2026-10-25',
    trainer: 'Dr. M. Prabhakaran (Automotive Thermal Specialist)',
    image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=800&auto=format&fit=crop',
    keywords: ['CFD', 'Automotive', 'Simulation', 'Aerodynamics', 'Thermal Management', 'Fluid Dynamics'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Theoretical foundations of Navier-Stokes and boundary layer physics',
      'External aerodynamic drag and downforce simulation in automobiles',
      'Underhood thermal management and battery cooling optimization',
      'Meshing techniques and post-processing in ANSYS Fluent',
    ],
    modules: [
      'Module 1: Mathematical Foundations & Fluid Flow Physics',
      'Module 2: High-Quality Grid Generation & Boundary Conditions',
      'Module 3: Aerodynamic Drag Optimization for Electric Vehicles',
      'Module 4: Heat Exchanger & Thermal Flow Numerical Modeling',
    ],
    features: [
      'Practical computational simulation using industry standard software',
      'Automotive OEM case studies and test datasets',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '01-11-2026' }],
  },
  {
    id: 'TECH061',
    title: 'Reliability Engineering & Industrial System Safety',
    shortDescription: 'Predictive failure rate modeling, MTBF optimization, and risk assessment for high-uptime manufacturing.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.INDUSTRY40,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    price: 4999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-18',
    endDate: '2026-11-10',
    registrationDeadline: '2026-10-12',
    trainer: 'Prof. S. Natarajan (Quality & Reliability Lead)',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    keywords: ['Reliability', 'Manufacturing', 'System Safety', 'Maintenance', 'Quality', 'Six Sigma'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Weibull analysis and failure distribution modeling',
      'System reliability block diagrams and fault tree analysis',
      'Maintainability, availability, and MTBF / MTTR calculations',
      'Design for Reliability (DfR) and Accelerated Life Testing',
    ],
    modules: [
      'Module 1: Failure Distribution Physics & Statistical Foundations',
      'Module 2: System Availability Modeling & Redundancy Design',
      'Module 3: FMEA, Fault Tree Analysis & Root Cause Determination',
      'Module 4: Empirical Data Collection & Industrial Life Testing',
    ],
    features: [
      'Real industrial failure dataset analytics',
      'Software-aided reliability calculation models',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '18-10-2026' }],
  },
  {
    id: 'TECH032',
    title: 'Precision CAD Engineering & Geometric Dimensioning (GD&T)',
    shortDescription: 'Industrial concept benchmarking, advanced 3D surface modeling, and GD&T standard compliance.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.DESIGN,
    hours: 45,
    mode: TRAINING_MODES.BLENDED,
    price: 7999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-25',
    endDate: '2026-12-05',
    registrationDeadline: '2026-10-19',
    trainer: 'Dr. V. Rajesh & CAD/CAM Industry Faculty',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    keywords: ['CAD', 'Design', 'GD&T', 'CATIA', 'SolidWorks', 'Manufacturing', 'Mechanical'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Parametric 3D solid and complex surface modeling',
      'Selection of engineering materials and manufacturing processes',
      'Application of ASME Y14.5 GD&T standards and tolerance stacks',
      'Design for Manufacturing and Assembly (DFMA) principles',
    ],
    modules: [
      'Module 1: Advanced Parametric 3D Solid Modeling',
      'Module 2: Material Selection & Structural Design Calculations',
      'Module 3: ASME GD&T Symbols, Datum References & Tolerance Stacks',
      'Module 4: Finite Element Stress Verification with ANSYS',
    ],
    features: [
      'CAD modeling lab with CATIA, SolidWorks & ANSYS',
      'Industrial engineering drawing standard evaluation',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '25-10-2026' }],
  },
  {
    id: 'TECH021',
    title: 'Electric Vehicle Powertrain Architecture & Battery Management',
    shortDescription: 'Comprehensive EV motor drives, lithium-ion BMS algorithms, power electronics, and regenerative braking.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.ELECTRIC_VEHICLES,
    hours: 35,
    mode: TRAINING_MODES.ONLINE,
    price: 6999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-22',
    endDate: '2026-11-25',
    registrationDeadline: '2026-10-16',
    trainer: 'Dr. K. Balamurugan & E-Mobility Industry Consultants',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop',
    keywords: ['EV', 'Electric Vehicles', 'Battery', 'BMS', 'Powertrain', 'Automotive', 'Renewable'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'EV powertrain configuration and torque-speed matching',
      'Lithium-ion cell chemistry, thermal modeling, and safety standards',
      'State-of-Charge (SOC) and State-of-Health (SOH) estimation algorithms',
      'Power inverter design and motor controller tuning (BLDC/PMSM)',
    ],
    modules: [
      'Module 1: Electric Vehicle Architecture & Sizing Methodologies',
      'Module 2: Battery Pack Design & Thermal Management Systems',
      'Module 3: BMS Firmware Algorithms, CAN Bus Communication & Safety',
      'Module 4: Electric Traction Motors & Inverter Control Simulation',
    ],
    features: [
      'MATLAB/Simulink electric vehicle model templates',
      'Hands-on BMS hardware emulation and diagnostics',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '22-10-2026' }],
  },
  {
    id: 'TECH088',
    title: 'Applied Quantum Computing & Quantum Algorithm Development',
    shortDescription: 'Explore quantum gates, Qiskit circuits, superposition mathematics, and quantum cryptographic protocols.',
    domain: DOMAINS.TECHNOLOGY,
    category: CATEGORIES.QUANTUM,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    price: 6499,
    status: COURSE_STATUS.UPCOMING,
    startDate: '2026-11-15',
    endDate: '2026-12-10',
    registrationDeadline: '2026-11-05',
    trainer: 'Dr. T. Ramanathan (Quantum Systems Lab)',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    keywords: ['Quantum', 'Quantum Computing', 'Qiskit', 'Algorithms', 'Cryptography', 'Physics', 'Technology'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Linear algebra and mathematical foundations of quantum states',
      'Quantum superposition, entanglement, and single/multi-qubit gates',
      'Implementing Deutsch-Jozsa, Grover, and Shor algorithms using Qiskit',
      'Quantum cryptography (QKD) and post-quantum security protocols',
    ],
    modules: [
      'Module 1: Qubits, Superposition & Dirac Vector Notation',
      'Module 2: Quantum Logic Gates & Circuit Design with IBM Qiskit',
      'Module 3: Quantum Search & Optimization Algorithms',
      'Module 4: Real-World Applications in Chemistry & Financial Modeling',
    ],
    features: [
      'Execution on real IBM Quantum cloud backend hardware',
      'Interactive Jupyter Notebook code repositories',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '15-11-2026' }],
  },

  // ─── MANAGEMENT › STRATEGY & FINANCE ───────────────────────────
  {
    id: 'MGMT001',
    title: 'Strategic Operations & Industrial Process Optimization',
    shortDescription: 'Lean manufacturing frameworks, value stream mapping, bottleneck mitigation, and supply chain resilience.',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.OPERATIONS,
    hours: 20,
    mode: TRAINING_MODES.ONLINE,
    price: 4999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-12',
    endDate: '2026-11-05',
    registrationDeadline: '2026-10-08',
    trainer: 'Dr. C. Meenakshi & Senior Operations Directors',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    keywords: ['Management', 'Operations', 'Lean', 'Six Sigma', 'Supply Chain', 'Process Optimization', 'Logistics'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Value stream mapping (VSM) and waste elimination strategies',
      'Capacity planning, bottleneck analysis, and TOC (Theory of Constraints)',
      'Supply chain risk mitigation and vendor network management',
      'Statistical Process Control (SPC) for high-yield manufacturing',
    ],
    modules: [
      'Module 1: Lean Operational Frameworks & Industrial Waste Elimination',
      'Module 2: Value Stream Mapping & Factory Flow Optimization',
      'Module 3: Modern Supply Chain Resilience & Inventory Analytics',
      'Module 4: Real-Time Operational KPI Dashboards',
    ],
    features: [
      'Real factory floor simulation exercises',
      'Industrial case studies from automotive and consumer goods sectors',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '12-10-2026' }],
  },
  {
    id: 'MGMT002',
    title: 'Executive Financial Modeling & Corporate Valuation',
    shortDescription: 'DCF valuation, dynamic scenario modeling, M&A investment assessment, and strategic capital budgeting.',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.FINANCE,
    hours: 25,
    mode: TRAINING_MODES.ONLINE,
    price: 5499,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-19',
    endDate: '2026-11-15',
    registrationDeadline: '2026-10-13',
    trainer: 'Prof. N. Raghavan (CFA, Investment Banking Advisor)',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    keywords: ['Finance', 'Financial Modeling', 'Valuation', 'DCF', 'Accounting', 'Management', 'Investment'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Building 3-statement dynamic financial forecasting models in Excel',
      'Discounted Cash Flow (DCF) and Comparable Company Valuation',
      'Capital budgeting, Weighted Average Cost of Capital (WACC), and IRR',
      'Mergers & acquisitions financial feasibility and risk structuring',
    ],
    modules: [
      'Module 1: Integrated 3-Statement Financial Modeling',
      'Module 2: Cost of Capital, Capital Structure & Debt Schedules',
      'Module 3: Corporate DCF & Multiples Valuation Methodologies',
      'Module 4: M&A Deal Structuring, LBO Fundamentals & Sensitivity Analysis',
    ],
    features: [
      'Comprehensive Excel corporate valuation model templates',
      'Live financial analyst case study teardowns',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '19-10-2026' }],
  },
  {
    id: 'MGMT003',
    title: 'Applied Data Science & Machine Learning for Business Analytics',
    shortDescription: 'Transform raw enterprise datasets into actionable insights with Python, Scikit-Learn, and Tableau.',
    domain: DOMAINS.MANAGEMENT,
    category: CATEGORIES.DATA_SCIENCE,
    hours: 30,
    mode: TRAINING_MODES.ONLINE,
    price: 5999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-10',
    endDate: '2026-11-20',
    registrationDeadline: '2026-10-05',
    trainer: 'Dr. G. Karthikeyan (Chief Data Strategist)',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    keywords: ['Data Science', 'Python', 'Machine Learning', 'Analytics', 'Business Intelligence', 'Tableau', 'Management'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Exploratory data analysis with Python Pandas, NumPy, and Seaborn',
      'Predictive regression, classification, and customer clustering algorithms',
      'Time-series demand forecasting and churn probability modeling',
      'Interactive executive BI dashboard design with Tableau and Streamlit',
    ],
    modules: [
      'Module 1: Enterprise Data Wrangling & Exploratory Analysis',
      'Module 2: Supervised Predictive Modeling & Model Validation',
      'Module 3: Customer Segmentation & Unsupervised Clustering',
      'Module 4: Executive Business Intelligence & Interactive Dashboards',
    ],
    features: [
      'Real corporate transaction and marketing datasets',
      'Step-by-step Jupyter Notebook exercises',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '10-10-2026' }],
  },

  // ─── LEADERSHIP & PERSONALITY ─────────────────────────────────
  {
    id: 'LEAD001',
    title: 'Executive Leadership Excellence & Strategic Decision-Making',
    shortDescription: 'High-impact emotional intelligence, cross-functional persuasion, change management, and executive presence.',
    domain: DOMAINS.LEADERSHIP,
    category: CATEGORIES.LEADERSHIP_DEV,
    hours: 18,
    mode: TRAINING_MODES.BLENDED,
    price: 4999,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-16',
    endDate: '2026-11-06',
    registrationDeadline: '2026-10-11',
    trainer: 'Dr. P. Ananthalakshmi & Senior Corporate Leadership Mentors',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    keywords: ['Leadership', 'Management', 'Personality', 'Communication', 'Executive Development', 'Strategy', 'Soft Skills'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Executive communication, storytelling, and impactful keynote delivery',
      'Emotional intelligence (EQ) in high-stakes negotiations and conflict resolution',
      'Leading high-performance cross-functional engineering teams',
      'Organizational change management and strategic decision frameworks',
    ],
    modules: [
      'Module 1: Executive Presence, Articulation & High-Stakes Storytelling',
      'Module 2: Emotional Intelligence & Conflict Resolution in Teams',
      'Module 3: Strategic Delegation, Mentorship & Team Empowerment',
      'Module 4: Navigating Organizational Change & Crisis Decision-Making',
    ],
    features: [
      'Live 360-degree leadership assessment and personalized coaching feedback',
      'Interactive executive boardroom simulation sessions',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '16-10-2026' }],
  },
  {
    id: 'LEAD002',
    title: 'Managerial Multiplier Masterclass: Amplifying Team Output',
    shortDescription: 'Proven managerial habits to eliminate productivity bottlenecks, foster accountability, and multiply workforce impact.',
    domain: DOMAINS.LEADERSHIP,
    category: CATEGORIES.LEADERSHIP_DEV,
    hours: 15,
    mode: TRAINING_MODES.ONLINE,
    price: 4499,
    status: COURSE_STATUS.OPEN,
    startDate: '2026-10-28',
    endDate: '2026-11-18',
    registrationDeadline: '2026-10-21',
    trainer: 'Dean, SpoRIC & Lucas TVS Leadership Faculty',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    keywords: ['Management', 'Leadership', 'Productivity', 'Multiplier', 'Team Building', 'Personality'],
    contactEmail: 'deancc.sporic@vit.ac.in',
    contactPerson: 'Dean, SpoRIC',
    contactNumber: '73587 82571',
    learn: [
      'Transitioning from individual high-performer to team multiplier',
      'Psychological safety, open feedback loops, and accountability cultures',
      'Time architecture and cognitive workload prioritization for managers',
      'Conducting impactful performance appraisals and growth roadmap reviews',
    ],
    modules: [
      'Module 1: The Multiplier Mindset vs Diminisher Pitfalls',
      'Module 2: Establishing High-Accountability Team Operating Rhythms',
      'Module 3: Active Coaching Protocols & Crucial Conversations',
      'Module 4: Scaling Individual Excellence into Departmental Results',
    ],
    features: [
      'Lucas TVS executive leadership training methodology',
      'Actionable managerial toolkits and daily habit templates',
      'Official SpoRIC & VIT-TEC Certificate of Completion',
    ],
    sessions: [{ batch: 1, date: '28-10-2026' }],
  },
];

// --- HELPER FUNCTIONS FOR UNIFIED ACCESS ---

export function getAllCourses() {
  if (typeof window === 'undefined') return courses;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    if (!Array.isArray(customCourses) || customCourses.length === 0) return courses;
    const customIds = new Set(customCourses.map((c) => c.id));
    return [...customCourses, ...courses.filter((c) => !customIds.has(c.id))];
  } catch {
    return courses;
  }
}

export function saveNewCourse(courseData) {
  if (typeof window === 'undefined') return;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    const now = new Date().toISOString().split('T')[0];
    const record = {
      ...courseData,
      status: courseData.status || COURSE_STATUS.OPEN,
      registrationDeadline: courseData.registrationDeadline || '2026-11-15',
      image: courseData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      keywords: courseData.keywords || [courseData.domain, courseData.category],
      createdAt: now,
      isCustom: true,
    };
    const updated = [record, ...customCourses.filter((c) => c.id !== record.id)];
    localStorage.setItem('sporic_custom_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.warn('Error saving custom course:', e);
  }
}

export function deleteCustomCourse(courseId) {
  if (typeof window === 'undefined') return;
  try {
    const customCourses = JSON.parse(localStorage.getItem('sporic_custom_courses') || '[]');
    const updated = customCourses.filter((c) => c.id !== courseId);
    localStorage.setItem('sporic_custom_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (e) {
    console.warn('Error deleting custom course:', e);
  }
}

export function getCourseById(id) {
  return getAllCourses().find((c) => c.id === id);
}

export function getCoursesByDomain(domain) {
  return getAllCourses().filter((c) => c.domain === domain);
}

export function getCoursesByCategory(category) {
  return getAllCourses().filter((c) => c.category === category);
}

export function searchCourses({ query = '', domain = '', category = '', status = '', mode = '' }) {
  const q = query.trim().toLowerCase();
  return getAllCourses().filter((course) => {
    // Keyword and text matching
    const matchesQuery =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.shortDescription.toLowerCase().includes(q) ||
      course.id.toLowerCase().includes(q) ||
      course.category.toLowerCase().includes(q) ||
      course.domain.toLowerCase().includes(q) ||
      (course.trainer && course.trainer.toLowerCase().includes(q)) ||
      (Array.isArray(course.keywords) && course.keywords.some((k) => k.toLowerCase().includes(q)));

    const matchesDomain = !domain || domain === 'All' || course.domain === domain;
    const matchesCategory = !category || category === 'All' || course.category === category;
    const matchesStatus = !status || status === 'All' || course.status === status;
    const matchesMode = !mode || mode === 'All' || course.mode === mode;

    return matchesQuery && matchesDomain && matchesCategory && matchesStatus && matchesMode;
  });
}

// --- COURSE DEADLINE NOTIFICATIONS HELPER ---
export function getUpcomingDeadlines() {
  const all = getAllCourses();
  const today = new Date();
  
  return all
    .filter((c) => c.registrationDeadline && c.status === COURSE_STATUS.OPEN)
    .map((c) => {
      const deadline = new Date(c.registrationDeadline);
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...c,
        daysRemaining: diffDays,
        isClosingSoon: diffDays > 0 && diffDays <= 14,
      };
    })
    .sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline));
}

// --- USER COURSE ENQUIRIES / QUERIES HELPER ---
export function saveCourseEnquiry(enquiryData) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('sporic_course_enquiries') || '[]');
    const record = {
      id: `enq_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'SUBMITTED', // 'SUBMITTED' | 'IN_REVIEW' | 'RESPONDED'
      ...enquiryData,
    };
    const updated = [record, ...existing];
    localStorage.setItem('sporic_course_enquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return record;
  } catch (e) {
    console.error('Error saving course enquiry:', e);
    throw new Error('Could not record your query. Please try again.');
  }
}

export function getAllEnquiries() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('sporic_course_enquiries') || '[]');
  } catch {
    return [];
  }
}

export function getUserEnquiries(userEmail) {
  if (!userEmail) return [];
  const normalized = userEmail.toLowerCase().trim();
  return getAllEnquiries().filter((e) => (e.email || '').toLowerCase().trim() === normalized);
}

export function updateEnquiryStatus(enquiryId, newStatus, adminNote = '') {
  if (typeof window === 'undefined') return;
  try {
    const existing = getAllEnquiries();
    const updated = existing.map((e) =>
      e.id === enquiryId
        ? { ...e, status: newStatus, adminNote, updatedAt: new Date().toISOString() }
        : e
    );
    localStorage.setItem('sporic_course_enquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (e) {
    console.warn('Error updating enquiry status:', e);
  }
}

// --- USER COURSE INTEREST (WISHLIST) HELPER ---
export function toggleCourseInterest(courseId, userEmail) {
  if (typeof window === 'undefined' || !userEmail) return false;
  try {
    const key = `sporic_saved_courses_${userEmail.toLowerCase().trim()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    let updated;
    let isSaved = false;

    if (existing.includes(courseId)) {
      updated = existing.filter((id) => id !== courseId);
      isSaved = false;
    } else {
      updated = [...existing, courseId];
      isSaved = true;
    }

    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return isSaved;
  } catch {
    return false;
  }
}

export function getUserInterestedCourseIds(userEmail) {
  if (typeof window === 'undefined' || !userEmail) return [];
  try {
    const key = `sporic_saved_courses_${userEmail.toLowerCase().trim()}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function getUserEnrolledCourseIds(userEmail) {
  if (typeof window === 'undefined' || !userEmail) return [];
  try {
    const key = `sporic_enrolled_courses_${userEmail.toLowerCase().trim()}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function isUserEnrolledInCourse(userEmail, courseId) {
  if (typeof window === 'undefined' || !userEmail || !courseId) return false;
  try {
    const key = `sporic_enrolled_courses_${userEmail.toLowerCase().trim()}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return list.includes(courseId);
  } catch {
    return false;
  }
}

export function enrollUserInCourse(userEmail, courseId) {
  if (typeof window === 'undefined' || !userEmail || !courseId) return false;
  try {
    const key = `sporic_enrolled_courses_${userEmail.toLowerCase().trim()}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    if (!list.includes(courseId)) {
      list.push(courseId);
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  } catch {
    return false;
  }
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
    path: '/personality',
  },
];
