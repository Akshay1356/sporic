// Comprehensive Seed Script for SPORIC / VIT-TEC Platform
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for SPORIC / VIT-TEC platform...');

  // Clear existing data safely
  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.sessionBatch.deleteMany();
  await prisma.learningObjective.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.fundingApplication.deleteMany();
  await prisma.fundingOpportunity.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.researchProject.deleteMany();
  await prisma.patent.deleteMany();
  await prisma.contactInquiry.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users with BCrypt Hashed Passwords
  const adminPassword = await bcrypt.hash('Admin@VIT2026', 10);
  const facultyPassword = await bcrypt.hash('Faculty@VIT2026', 10);
  const studentPassword = await bcrypt.hash('Student@VIT2026', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@vit.ac.in',
      name: 'Dr. Dean SpoRIC',
      passwordHash: adminPassword,
      role: 'ADMIN',
      department: 'Sponsored Research & Industrial Consultancy',
      designation: 'Dean, SpoRIC',
      organization: 'VIT Chennai',
      phone: '044 3993 1196',
    },
  });

  const faculty = await prisma.user.create({
    data: {
      email: 'faculty@vit.ac.in',
      name: 'Dr. S. K. Ramanathan',
      passwordHash: facultyPassword,
      role: 'FACULTY',
      department: 'School of Mechanical Engineering (SMEC)',
      designation: 'Senior Professor & Principal Investigator',
      organization: 'VIT Chennai',
      phone: '94878 33044',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@vit.ac.in',
      name: 'Arun Kumar',
      passwordHash: studentPassword,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      organization: 'TCS Innovation Labs',
      phone: '73587 82571',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@vit.ac.in',
      name: 'Priya Sharma',
      passwordHash: studentPassword,
      role: 'STUDENT',
      department: 'Automotive Technology',
      organization: 'Hyundai Motor R&D',
      phone: '98401 23456',
    },
  });

  console.log('✅ Created Users: Admin, Faculty, 2 Students.');

  // 2. Create Categories
  const categoryDefs = [
    { name: 'Industry 4.0', slug: 'industry-40', domain: 'Technology', description: 'Smart manufacturing, IIoT, and connected industrial automation' },
    { name: 'Electric Vehicles', slug: 'electric-vehicles', domain: 'Technology', description: 'Battery management, powertrain design, and charging infrastructure' },
    { name: 'Design', slug: 'design', domain: 'Technology', description: 'CAD/CAM, engineering design, GD&T, and FE simulation' },
    { name: 'Optics', slug: 'optics', domain: 'Technology', description: 'Photonics, optical systems, and laser engineering' },
    { name: 'Manufacturing', slug: 'manufacturing', domain: 'Technology', description: 'Additive manufacturing, precision machining, and digital manufacturing' },
    { name: 'Renewable Energy', slug: 'renewable-energy', domain: 'Technology', description: 'Solar PV, wind energy, and microgrid management' },
    { name: 'Construction Technology', slug: 'construction-technology', domain: 'Technology', description: 'Smart structural design, retrofitting, and energy harvesting' },
    { name: 'ADAS', slug: 'adas', domain: 'Technology', description: 'Advanced driver assistance systems and autonomous vehicle sensing' },
    { name: 'Quantum Computing', slug: 'quantum-computing', domain: 'Technology', description: 'Quantum algorithms, Qiskit programming, and quantum gates' },
    { name: 'Simulation', slug: 'simulation', domain: 'Technology', description: 'CFD, multi-physics modelling, and dynamic FEA' },
    { name: 'Operations Management', slug: 'operations-management', domain: 'Management', description: 'Supply chain optimization, Lean Six Sigma, and process design' },
    { name: 'Finance', slug: 'finance', domain: 'Management', description: 'Corporate valuation, risk management, and capital budgeting' },
    { name: 'Marketing', slug: 'marketing', domain: 'Management', description: 'Digital marketing, market research, and brand strategy' },
    { name: 'Data Science', slug: 'data-science', domain: 'Management', description: 'Business intelligence, predictive modelling, and Python analytics' },
    { name: 'Leadership & Personality', slug: 'leadership-personality', domain: 'Leadership & Personality', description: 'Executive presence, transformational leadership, and emotional quotient' },
  ];

  const categoryMap = {};
  for (const cat of categoryDefs) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.name] = created.id;
  }
  console.log(`✅ Seeded ${categoryDefs.length} Categories across 3 Domains.`);

  // 3. Real VIT-TEC Courses & Modules
  const realCourses = [
    {
      courseCode: 'TECH004',
      title: 'Digital Tools for Industry 4.0',
      slug: 'digital-tools-for-industry-40',
      categoryName: 'Industry 4.0',
      shortDescription: 'Explore Digital Transformation in Manufacturing Sector',
      fullDescription: 'Comprehensive industrial training on digitalization of manufacturing systems, Siemens TIA Portal, MATLAB/LabVIEW automation, and Additive Manufacturing tools.',
      durationHours: 20,
      trainingMode: 'ONLINE',
      price: 4999.0,
      discountPercent: 10.0,
      finalPrice: 4499.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Digitalization of Manufacturing Sector',
        'Intelligent Technologies for Industry 4.0',
        'Concepts of digital manufacturing and industrial automation',
        'Application of digital tools in Industries',
      ],
      modules: [
        {
          title: 'Factory Automation – Digital Transformation',
          description: 'Overview of modern factory communication buses and PLC architectures.',
          lessons: [
            { title: 'Introduction to Cyber-Physical Production Systems', durationMinutes: 45, isFreePreview: true },
            { title: 'PLC & SCADA Architecture using Siemens TIA Portal', durationMinutes: 60, isFreePreview: false },
          ],
        },
        {
          title: 'Industry 4.0 and Connected Machines',
          description: 'Industrial IoT protocols, sensor integration, and edge compute.',
          lessons: [
            { title: 'OPC UA and MQTT for Smart Machine Connectivity', durationMinutes: 45, isFreePreview: false },
            { title: 'Predictive Maintenance Sensor Interfacing', durationMinutes: 50, isFreePreview: false },
          ],
        },
        {
          title: 'AR, VR and Digital Twins in Manufacturing',
          description: 'Simulating virtual plant floor layouts with 3D digital twins.',
          lessons: [
            { title: 'Creating High-Fidelity Factory Digital Twins', durationMinutes: 60, isFreePreview: false },
            { title: 'AR Guided Maintenance on Shop Floor', durationMinutes: 45, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Factory automation demonstrations using Siemens TIA Portal',
        'Data Analytics, AI and ML development using MATLAB and LabVIEW',
        'Design for 3D printing using Fusion 360, Netfabb, Meshmixer, Cura, Simplify3D',
        'SpoRIC Certification of Completion',
      ],
      sessions: [
        { batchNumber: 1, startDate: '26-10-2023', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '18-01-2024', status: 'COMPLETED' },
        { batchNumber: 3, startDate: '15-10-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'TECH054',
      title: 'Full Stack Development (Intermediate Level)',
      slug: 'full-stack-development-intermediate',
      categoryName: 'Industry 4.0',
      shortDescription: 'Master front-end and back-end skills to unlock limitless innovation',
      fullDescription: 'Learn full-stack architecture using Node.js, Express, MongoDB, and React with industrial security patterns and RESTful API deployment.',
      durationHours: 20,
      trainingMode: 'ONLINE',
      price: 5499.0,
      discountPercent: 15.0,
      finalPrice: 4674.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Complete web development process end-to-end',
        'Build scalable RESTful services with Node.js and Express',
        'Database design with MongoDB & NoSQL aggregation pipelines',
        'Deploy scalable dynamic web applications on cloud instances',
      ],
      modules: [
        {
          title: 'Advanced JavaScript & Backend Architecture',
          description: 'Async programming, event loops, and server middleware.',
          lessons: [
            { title: 'Node.js Internals & Express REST Routing', durationMinutes: 55, isFreePreview: true },
            { title: 'Authentication with JWT & RBAC Middleware', durationMinutes: 65, isFreePreview: false },
          ],
        },
        {
          title: 'Database Design & Production Deployment',
          description: 'Data modeling, schema validations, and containerized deployment.',
          lessons: [
            { title: 'NoSQL Schema Optimization with MongoDB', durationMinutes: 50, isFreePreview: false },
            { title: 'Production CI/CD Pipelines & Cloud Hosting', durationMinutes: 60, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Resource Materials & Production Boilerplates',
        'Hands-on Lab Training with real projects',
        'Industry level Curriculum curated by VIT faculty',
        'Capstone Portfolio Application',
      ],
      sessions: [
        { batchNumber: 1, startDate: '05-10-2023', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '14-12-2023', status: 'COMPLETED' },
        { batchNumber: 3, startDate: '20-11-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'TECH067',
      title: 'GenAI Tools for Smart Work',
      slug: 'genai-tools-for-smart-work',
      categoryName: 'Industry 4.0',
      shortDescription: 'Leverage Large Language Models to transform your work into smart work',
      fullDescription: 'Practical application of generative AI, prompt engineering, code synthesis, automated presentations, and AI-augmented workflows.',
      durationHours: 15,
      trainingMode: 'ONLINE',
      price: 3999.0,
      discountPercent: 0.0,
      finalPrice: 3999.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Using large language models (LLMs) to improve working culture',
        'Prompt engineering for professional workflow automation',
        'AI assisted code generation and automated testing',
        'Generating data visualisations and project reports via AI',
      ],
      modules: [
        {
          title: 'Foundations of Modern GenAI & LLMs',
          description: 'Understanding tokenization, contextual windows, and prompt architecture.',
          lessons: [
            { title: 'Prompt Engineering Blueprints & Chains', durationMinutes: 45, isFreePreview: true },
            { title: 'Smart Code Generation & Debugging', durationMinutes: 50, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Hands-on interactive lab sessions',
        'Live interactive prompt optimization case studies',
        'Two live quizzes & verified certificates',
      ],
      sessions: [
        { batchNumber: 1, startDate: '09-02-2024', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '05-12-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'TECH068',
      title: 'Computational Fluid Dynamics (CFD)',
      slug: 'computational-fluid-dynamics-cfd',
      categoryName: 'Simulation',
      shortDescription: 'Master CFD methods across a broad range of automotive applications',
      fullDescription: 'Solve complex Navier-Stokes equations for automotive aerodynamics, thermal management, and internal combustion airflow using ANSYS Fluent.',
      durationHours: 15,
      trainingMode: 'ONLINE',
      price: 5999.0,
      discountPercent: 10.0,
      finalPrice: 5399.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Understand, practice, and apply CFD methods',
        'External vehicle aerodynamics simulation',
        'Battery pack thermal management modelling',
      ],
      modules: [
        {
          title: 'Mesh Generation & Boundary Conditions',
          description: 'Structured vs unstructured mesh, boundary layer resolution.',
          lessons: [
            { title: 'Domain Discretization & Turbulence Models', durationMinutes: 55, isFreePreview: true },
          ],
        },
      ],
      features: [
        'Industry need-based contents with ANSYS Workbench',
        'Aerodynamic drag reduction case study',
        'Certification of Completion',
      ],
      sessions: [
        { batchNumber: 1, startDate: '18-04-2024', status: 'COMPLETED' },
      ],
    },
    {
      courseCode: 'TECH015',
      title: 'Electric Vehicle Technology & Battery Management',
      slug: 'electric-vehicle-technology',
      categoryName: 'Electric Vehicles',
      shortDescription: 'Comprehensive training on EV systems, battery technology and charging infrastructure',
      fullDescription: 'In-depth engineering curriculum covering Li-ion cell chemistries, thermal runaway prevention, motor drives, regenerative braking, and DC fast charging.',
      durationHours: 30,
      trainingMode: 'ONLINE',
      price: 6999.0,
      discountPercent: 10.0,
      finalPrice: 6299.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Electric vehicle powertrain architecture',
        'BMS state-of-charge (SoC) and state-of-health (SoH) algorithms',
        'Power electronics inverters and traction motor control',
        'EV charging standards (CCS2, CHAdeMO, Bharat DC001)',
      ],
      modules: [
        {
          title: 'EV Architectures & Cell Chemistries',
          description: 'NMC, LFP, and solid-state battery fundamentals.',
          lessons: [
            { title: 'Battery Cell Balancing & Thermal Modeling', durationMinutes: 60, isFreePreview: true },
            { title: 'Traction Inverters & PMSM Motor Drives', durationMinutes: 60, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Hardware-in-the-loop (HIL) BMS simulation demos',
        'MATLAB/Simulink drive cycle tests (WLTP, FTP75)',
        'SpoRIC Certification',
      ],
      sessions: [
        { batchNumber: 1, startDate: '15-11-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'MGMT001',
      title: 'Operations Management & Supply Chain Excellence',
      slug: 'operations-management-excellence',
      categoryName: 'Operations Management',
      shortDescription: 'Streamline business operations for maximum efficiency and productivity',
      fullDescription: 'Master modern operations strategy, bottleneck analysis, inventory control, Lean Six Sigma, and agile manufacturing management.',
      durationHours: 30,
      trainingMode: 'ONLINE',
      price: 4999.0,
      discountPercent: 0.0,
      finalPrice: 4999.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Process mapping, bottleneck analysis & throughput optimization',
        'Total Quality Management (TQM) and DMAIC Six Sigma methodology',
        'Supply chain resilience, risk forecasting, and procurement strategies',
      ],
      modules: [
        {
          title: 'Process Optimization & Lean Methodologies',
          description: 'Toyota Production System, Kaizen, and 5S principles.',
          lessons: [
            { title: 'Value Stream Mapping in Industrial Settings', durationMinutes: 50, isFreePreview: true },
            { title: 'Statistical Quality Control with Minitab', durationMinutes: 55, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Real corporate case studies from Fortune 500 manufacturing firms',
        'Hands-on Excel/Minitab templates provided',
        'SpoRIC Certificate of Management Proficiency',
      ],
      sessions: [
        { batchNumber: 1, startDate: '02-11-2023', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '25-01-2024', status: 'COMPLETED' },
        { batchNumber: 3, startDate: '10-10-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'MGMT004',
      title: 'Data Science for Business Decision Making',
      slug: 'data-science-for-business',
      categoryName: 'Data Science',
      shortDescription: 'Harness data science techniques to drive strategic business decisions',
      fullDescription: 'End-to-end applied data analytics with Python, Tableau, and Machine Learning predictive models for customer churn, sales forecasting, and risk analysis.',
      durationHours: 30,
      trainingMode: 'ONLINE',
      price: 5999.0,
      discountPercent: 15.0,
      finalPrice: 5099.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Exploratory Data Analysis using Python Pandas and Seaborn',
        'Supervised & Unsupervised Machine Learning algorithms for Business',
        'Creating interactive executive dashboards in Tableau & Power BI',
      ],
      modules: [
        {
          title: 'Business Analytics with Python',
          description: 'Data ingestion, wrangling, and statistical inference.',
          lessons: [
            { title: 'Data Cleaning & Feature Engineering', durationMinutes: 60, isFreePreview: true },
            { title: 'Customer Segmentation with K-Means Clustering', durationMinutes: 60, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Real industry datasets (E-commerce, Banking, Automotive)',
        'Capstone Business Intelligence project',
        'SpoRIC Professional Certificate',
      ],
      sessions: [
        { batchNumber: 1, startDate: '05-12-2023', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '15-02-2024', status: 'COMPLETED' },
        { batchNumber: 3, startDate: '01-11-2026', status: 'UPCOMING' },
      ],
    },
    {
      courseCode: 'LEAD001',
      title: 'Leadership Excellence & Strategic Communication',
      slug: 'leadership-excellence-program',
      categoryName: 'Leadership & Personality',
      shortDescription: 'Develop transformational leadership skills for the modern workplace',
      fullDescription: 'Executive development program focusing on emotional intelligence (EQ), high-stakes negotiation, conflict resolution, and inspiring cross-functional teams.',
      durationHours: 20,
      trainingMode: 'ONLINE',
      price: 4499.0,
      discountPercent: 0.0,
      finalPrice: 4499.0,
      contactPerson: 'Dean, SpoRIC',
      contactEmail: 'deancc.sporic@vit.ac.in',
      contactNumber: '73587 82571',
      facultyId: faculty.id,
      learn: [
        'Transformational vs Situational leadership frameworks',
        'Emotional intelligence in executive decision making',
        'Crucial conversations, conflict mediation, and negotiation',
        'Executive speech presentation and storytelling',
      ],
      modules: [
        {
          title: 'Self-Awareness & Situational Leadership',
          description: 'Evaluating leadership archetype and team motivation dynamics.',
          lessons: [
            { title: 'The Emotional Intelligence Quotient (EQ)', durationMinutes: 45, isFreePreview: true },
            { title: 'Leading Change in Fast-Paced Environments', durationMinutes: 50, isFreePreview: false },
          ],
        },
      ],
      features: [
        'Personal 360-degree leadership diagnostic report',
        'Interactive role-playing and mock negotiation debriefs',
        'SpoRIC Certificate of Leadership Mastery',
      ],
      sessions: [
        { batchNumber: 1, startDate: '08-11-2023', status: 'COMPLETED' },
        { batchNumber: 2, startDate: '05-02-2024', status: 'COMPLETED' },
        { batchNumber: 3, startDate: '12-10-2026', status: 'UPCOMING' },
      ],
    },
  ];

  for (const c of realCourses) {
    const categoryId = categoryMap[c.categoryName];
    if (!categoryId) continue;

    const course = await prisma.course.create({
      data: {
        courseCode: c.courseCode,
        title: c.title,
        slug: c.slug,
        categoryId,
        shortDescription: c.shortDescription,
        fullDescription: c.fullDescription,
        durationHours: c.durationHours,
        trainingMode: c.trainingMode,
        price: c.price,
        discountPercent: c.discountPercent,
        finalPrice: c.finalPrice,
        contactPerson: c.contactPerson,
        contactEmail: c.contactEmail,
        contactNumber: c.contactNumber,
        facultyId: c.facultyId,
        status: 'PUBLISHED',
      },
    });

    // Learning Objectives
    for (let i = 0; i < c.learn.length; i++) {
      await prisma.learningObjective.create({
        data: { courseId: course.id, content: c.learn[i], type: 'LEARN', order: i + 1 },
      });
    }

    // Salient Features
    for (let i = 0; i < c.features.length; i++) {
      await prisma.learningObjective.create({
        data: { courseId: course.id, content: c.features[i], type: 'FEATURE', order: i + 1 },
      });
    }

    // Session Batches
    for (const s of c.sessions) {
      await prisma.sessionBatch.create({
        data: {
          courseId: course.id,
          batchNumber: s.batchNumber,
          startDate: s.startDate,
          status: s.status,
        },
      });
    }

    // Modules & Lessons
    for (let mIdx = 0; mIdx < c.modules.length; mIdx++) {
      const mData = c.modules[mIdx];
      const moduleRecord = await prisma.module.create({
        data: {
          courseId: course.id,
          title: mData.title,
          description: mData.description,
          order: mIdx + 1,
        },
      });

      for (let lIdx = 0; lIdx < mData.lessons.length; lIdx++) {
        const lData = mData.lessons[lIdx];
        await prisma.lesson.create({
          data: {
            moduleId: moduleRecord.id,
            title: lData.title,
            order: lIdx + 1,
            durationMinutes: lData.durationMinutes,
            isFreePreview: lData.isFreePreview,
            contentType: 'TEXT',
            textContent: `Welcome to ${lData.title}. In this session, learners analyze industry case studies and execute applied technical exercises.`,
          },
        });
      }
    }
  }

  console.log(`✅ Seeded ${realCourses.length} Real VIT-TEC Courses with detailed Modules and Lessons.`);

  // 4. Create Sample Enrollments & Payments
  const firstCourse = await prisma.course.findFirst({ where: { courseCode: 'TECH004' } });
  if (firstCourse) {
    const payment = await prisma.payment.create({
      data: {
        studentId: student1.id,
        courseId: firstCourse.id,
        razorpayOrderId: 'order_SPORIC2026_001',
        razorpayPaymentId: 'pay_SPORIC2026_001',
        razorpaySignature: 'sig_mock_verified_signature_sample_001',
        amount: firstCourse.finalPrice,
        currency: 'INR',
        status: 'SUCCESS',
        receiptNumber: 'REC-2026-0001',
      },
    });

    await prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: firstCourse.id,
        paymentId: payment.id,
        status: 'ACTIVE',
        progressPercent: 40.0,
      },
    });

    // Sample Certificate
    await prisma.certificate.create({
      data: {
        certificateNumber: 'VITTEC-CERT-2026-1001',
        studentId: student1.id,
        courseId: firstCourse.id,
        studentName: student1.name,
        courseName: firstCourse.title,
        verificationHash: 'vittec_hash_9f83a218_tech004',
        certificateUrl: '/api/certificates/view/VITTEC-CERT-2026-1001',
        status: 'VALID',
      },
    });
  }

  // 5. Create Funding Opportunities & Sample Application
  const grant1 = await prisma.fundingOpportunity.create({
    data: {
      title: 'SpoRIC Industry Innovation Grant 2026',
      description: 'Funding for advanced translational engineering research solving industrial sustainability and smart automation challenges in MSME sectors.',
      eligibility: 'Faculty members of VIT Chennai with min. 2 years active research experience.',
      guidelines: 'Proposals must demonstrate industrial co-creation or clear prototype commercialization potential within 18 months.',
      deadline: new Date('2026-12-31T23:59:59Z'),
      fundingAmount: 1500000.0, // 15 Lakhs INR
      status: 'OPEN',
    },
  });

  await prisma.fundingOpportunity.create({
    data: {
      title: 'Green Mobility & EV Battery Research Consortium',
      description: 'Seed grants for research on solid-state battery thermal modeling, fast charging telemetry, and localized supply chain integration.',
      eligibility: 'Faculty and Interdisciplinary research scholars.',
      guidelines: 'Joint application with industry sponsor encouraged.',
      deadline: new Date('2026-11-30T23:59:59Z'),
      fundingAmount: 2500000.0, // 25 Lakhs INR
      status: 'OPEN',
    },
  });

  await prisma.fundingApplication.create({
    data: {
      applicationNumber: 'SPORIC-APP-2026-001',
      facultyId: faculty.id,
      fundingOpportunityId: grant1.id,
      title: 'AI-Driven Predictive Diagnostics for High-Precision CNC Spindles',
      researchArea: 'Industry 4.0 / Smart Manufacturing',
      problemStatement: 'Unscheduled spindle downtime in high-speed CNC milling causes severe manufacturing losses in Tier-2 automotive suppliers.',
      objectives: 'Design an edge-computing vibration analysis node utilizing lightweight Transformer models to forecast bearing degradation 72 hours prior to failure.',
      methodology: 'Deploy multi-axis piezoelectric accelerometers on test spindle rigs, record high-frequency acoustic emissions, train edge models, and test in real shopfloor pilot.',
      expectedOutcomes: '1 Prototype Diagnostic Hub, 2 Q1 Scopus Publications, 1 Patent Application.',
      durationMonths: 14,
      budget: 1250000.0,
      equipmentRequirements: 'Tri-axial Accelerometers, NI DAQ Chassis, High-Speed FPGA Edge Controller.',
      teamMembers: 'Dr. S. K. Ramanathan (PI), Dr. M. Jayakumar (Co-PI), 2 Research Scholars.',
      status: 'UNDER_REVIEW',
      reviewerComments: 'Solid methodology and strong industry relevance. Awaiting budget breakdown verification.',
      submittedAt: new Date('2026-08-01T10:00:00Z'),
    },
  });

  // 6. Research Projects, Patents & Publications
  const project1 = await prisma.researchProject.create({
    data: {
      title: 'Autonomous Solar Micro-Grids with Dynamic Demand Load Balancing',
      description: 'Design and deployment of IoT-coordinated rural microgrids utilizing battery storage and adaptive inverter control.',
      researchArea: 'Renewable Energy & Smart Grids',
      principalInvestigatorId: faculty.id,
      startDate: new Date('2025-06-01'),
      budget: 3500000.0,
      status: 'ONGOING',
    },
  });

  await prisma.patent.create({
    data: {
      title: 'Smart Inverter with Adaptive Harmonic Cancellation for Islanded Solar Microgrids',
      patentNumber: 'IN-PAT-2025-9831',
      applicationNumber: '202541098312',
      filingDate: new Date('2025-03-14'),
      grantDate: new Date('2026-01-20'),
      status: 'GRANTED',
      inventors: 'Dr. S. K. Ramanathan, Dr. Dean SpoRIC, VIT Chennai',
      assignee: 'Vellore Institute of Technology',
      abstract: 'A system and method for real-time total harmonic distortion (THD) attenuation in distributed renewable energy conversion systems.',
    },
  });

  await prisma.publication.create({
    data: {
      title: 'Deep Residual Networks for Vibration-Based Bearing Fault Classification in Variable Speed Drives',
      authors: 'S. K. Ramanathan, K. M. Sundaram, A. V. Narayanan',
      journalName: 'IEEE Transactions on Industrial Electronics',
      publicationDate: new Date('2025-09-15'),
      doi: '10.1109/TIE.2025.3289104',
      link: 'https://doi.org/10.1109/TIE.2025.3289104',
      projectId: project1.id,
    },
  });

  // 7. Sample Notifications & Contact Inquiries
  await prisma.notification.create({
    data: {
      userId: student1.id,
      title: 'Course Enrollment Confirmed',
      message: 'You have been successfully enrolled in Digital Tools for Industry 4.0 (TECH004).',
      type: 'ENROLLMENT',
    },
  });

  await prisma.notification.create({
    data: {
      userId: faculty.id,
      title: 'Funding Proposal Under Review',
      message: 'Your application SPORIC-APP-2026-001 has been assigned to external reviewers.',
      type: 'FUNDING',
    },
  });

  await prisma.contactInquiry.create({
    data: {
      name: 'Rajesh Nambiar',
      email: 'r.nambiar@auto-components.in',
      subject: 'Custom Corporate Batch for 40 Engineers in EV Powertrains',
      message: 'We want to schedule a 3-week blended training program for our design department in Electric Vehicle Battery Management.',
      status: 'NEW',
    },
  });

  console.log('🎉 Database seed completed successfully with complete demo data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
