// Corporate Training Organized - Complete Consolidated Dataset with Date/Year Ordering & Persistence
// Transcribed faithfully from official SpoRIC records with dynamic Admin CRUD capabilities

export function getAcademicYearFromDate(dateStr) {
  if (!dateStr) return '2025–2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    // If string already looks like a year e.g. "2024-2025" or "2025"
    if (dateStr.includes('–') || dateStr.includes('-')) return dateStr;
    const yr = parseInt(dateStr, 10);
    return isNaN(yr) ? '2025–2026' : `${yr}–${yr + 1}`;
  }
  const year = d.getFullYear();
  const month = d.getMonth(); // 0 = Jan, 3 = Apr, 5 = June
  // Standard Indian Academic Year cycle: June/July to May/June
  if (month >= 5) {
    return `${year}–${year + 1}`;
  }
  return `${year - 1}–${year}`;
}

export const initialCorporateTrainingData = [
  {
    id: 1,
    school: 'VITBS',
    trainers: 'Dr. Divya S',
    title: 'Corporate Workshop on Resilience Building',
    company: 'Manoshala LLP, UP',
    startDate: '2025-08-18',
    endDate: '2025-08-20',
    year: '2025–2026',
  },
  {
    id: 2,
    school: 'SELECT',
    trainers: 'Dr. Nilanjan Tewari; Dr. Pritam; Dr. Sri Revathi B; Dr. Lenin N C; Dr. Angeline Ezhilarasi; Dr. Chendur Kumaran; Dr. Mohamed Imran A; Dr. Edward Jero; Dr. Manavala Sreekanth; Dr. Venugopal; Dr. Gunabalan; Dr. Bharathisankar',
    title: 'Electric Motors for Electric Vehicles',
    company: 'Ford, Chennai',
    startDate: '2025-07-14',
    endDate: '2025-07-18',
    year: '2025–2026',
  },
  {
    id: 3,
    school: 'CSGT',
    trainers: 'Dr. Rajakumar; Dr. Kalaipriyan',
    title: '5-Day Corporate Training Program in CRM',
    company: 'Thalir Capital Pvt Ltd, Mannarkudi',
    startDate: '2025-06-23',
    endDate: '2025-06-27',
    year: '2025–2026',
  },
  {
    id: 4,
    school: 'SMEC',
    trainers: 'Dr. Sivakumar R; Dr. Mohan R; Dr. Davidson Jebaseelan; Dr. Lenin Babu MC; Dr. Jeyanthis; Dr. Krishanu Ganguly',
    title: 'CAD Package Training',
    company: 'HCL Tech, Chennai',
    startDate: '2025-05-12',
    endDate: '2025-05-16',
    year: '2024–2025',
  },
  {
    id: 5,
    school: 'SCOPE',
    trainers: 'Dr. Ganesan R; Dr. Jayasudha M; Dr. Rajarajeswari S; Dr. Neela Narayanan; Dr. Karmela; Dr. A Menaka Pushpa; Dr. P Subbulakshmi; Dr. V. Sakthivel; Dr. T Kalaipriyan; Dr. Rajakumar Arul; Dr. Sobitha Ahila',
    title: 'Corporate Training in DevSecOps',
    company: 'VIT Global Education Pvt. Ltd., Karnataka',
    startDate: '2025-04-07',
    endDate: '2025-04-11',
    year: '2024–2025',
  },
  {
    id: 6,
    school: 'SCOPE',
    trainers: 'Dr. Kanniga Devi R; Dr. Priyadharshini M; Dr. Jothir',
    title: 'AI Training for Master Trainers',
    company: 'Kotak Education Foundation, Mumbai',
    startDate: '2025-03-17',
    endDate: '2025-03-21',
    year: '2024–2025',
  },
  {
    id: 7,
    school: 'SENSE',
    trainers: 'Dr. Balakrishnan R; Dr. Abraham; Dr. Sudharson Ponraj; Dr. Saravana Kumar',
    title: 'Phase 1-IoT Training Program – Datayaan Solution',
    company: 'Datayaan Solutions Private Limited, Chennai',
    startDate: '2025-02-10',
    endDate: '2025-02-14',
    year: '2024–2025',
  },
  {
    id: 8,
    school: 'SCE',
    trainers: 'Dr. Karthiyini; Dr. Shanmugasundaram',
    title: 'Corporate Training in Concrete Technology & Contract Planning and Management',
    company: 'VIT Global Education Pvt. Ltd., Karnataka',
    startDate: '2025-01-20',
    endDate: '2025-01-24',
    year: '2024–2025',
  },
  {
    id: 9,
    school: 'SAS',
    trainers: 'Dr. Balamurugan B J',
    title: 'Tamilnadu Government Model Schools - Puthiyathor Ulgu SEI Event',
    company: 'Tamilnadu Government Model Schools DPI Campus, Chennai',
    startDate: '2024-12-16',
    endDate: '2024-12-18',
    year: '2024–2025',
  },
  {
    id: 10,
    school: 'SELECT SCOPE',
    trainers: 'Dr. Lenin N C; Dr. Angalaeswari S; Dr. Pritam; Dr. Rupa Mishra; Dr. Kabilan K; Dr. Mohamed Imran A',
    title: 'Beyond Six - ACSR Initiative',
    company: 'Prim Buds Garden Schools, Chennai',
    startDate: '2024-11-18',
    endDate: '2024-11-20',
    year: '2024–2025',
  },
  {
    id: 11,
    school: 'SMEC CEAT SCOPE',
    trainers: 'Dr. Jagadeeshwaran R; Dr. Sakthivel G; Dr. Raghukiran Nadimpalli; Dr. Rajakumar R; Dr. Abirami S; Dr. Nathezhth eta T; Dr. Eswaran M; Dr. Sivakumar R; Dr. Vimal Prasanth C S',
    title: 'Transforming Manufacturing with AI, Connectivity & Digital Intelligence (A Roadmap to Industry 4.0 – Level 1)',
    company: 'Lucas TVS Ltd, Chennai',
    startDate: '2024-10-21',
    endDate: '2024-10-25',
    year: '2024–2025',
  },
  {
    id: 12,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Boot Camp Programme on Entrepreneurship',
    company: 'Sri Sankara Global Academy',
    startDate: '2024-09-16',
    endDate: '2024-09-18',
    year: '2024–2025',
  },
  {
    id: 13,
    school: 'CEAT SCOPE SMEC',
    trainers: 'Dr. Jagadeeshwaran R; Dr. Sakthivel G; Dr. Raghukiran Nadimpalli; Dr. Rajakumar R; Dr. Abirami S; Dr. Nathezhth eta T; Dr. Eswaran M',
    title: 'Transforming Manufacturing with Artificial Intelligence - A Roadmap to Industry 4.0 – Level 1',
    company: 'Lucas TVS Limited, Pondy',
    startDate: '2024-08-19',
    endDate: '2024-08-23',
    year: '2024–2025',
  },
  {
    id: 14,
    school: 'SMEC',
    trainers: 'Dr. Sivakumar R; Dr. Davidson J; Dr. Mohan R; Dr. Lenin Babu MC; Dr. Annamalai K; Dr. Bonda Atchuta Ganesh Yuva Raju; Dr. Karunamurthy K',
    title: 'CAD Package Training',
    company: 'Valeo India Pvt. Ltd., Chennai',
    startDate: '2024-07-22',
    endDate: '2024-07-26',
    year: '2024–2025',
  },
  {
    id: 15,
    school: 'SCE',
    trainers: 'Dr. Vasugi V; Dr. Anjali Gopakumar',
    title: 'YES Programme for IWMA',
    company: 'Indian Waste Management Association (IWMA)',
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    year: '2024–2025',
  },
  {
    id: 16,
    school: 'CSGT SCOPE',
    trainers: 'Dr. Sudha; Dr. Suganeshwari',
    title: 'AI Foundations, OCR, ChatGPT, and Secure AI Systems',
    company: 'Sustally Technologies, Delhi',
    startDate: '2024-05-13',
    endDate: '2024-05-17',
    year: '2023–2024',
  },
  {
    id: 17,
    school: 'SCOPE',
    trainers: 'Dr. V. Sakthivel; Dr. Suganya G; Dr. Prakash P',
    title: 'Faculty Training Programme on Empowering Engineering Educators with GenAI, Digitization and Future-Ready Pedagogies',
    company: 'SSM Institute of Engineering and Technology, Dindigul',
    startDate: '2024-04-15',
    endDate: '2024-04-19',
    year: '2023–2024',
  },
  {
    id: 18,
    school: 'SCE',
    trainers: 'Dr. Vasugi V; Dr. Helen Santhi M; Dr. Arun Kumar A',
    title: 'Plastering, Repair and Rehabilitation of Constructed Facilities',
    company: 'Ramco Cements Limited, Chennai',
    startDate: '2024-03-18',
    endDate: '2024-03-22',
    year: '2023–2024',
  },
  {
    id: 19,
    school: 'SCOPE',
    trainers: 'Dr. Geetha S; Dr. Sathian D',
    title: '2-Day Hands-On Training on Mastering Drone Photography',
    company: 'Drone Practitioner',
    startDate: '2024-02-12',
    endDate: '2024-02-13',
    year: '2023–2024',
  },
  {
    id: 20,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Certification Course on Industrial Automation',
    company: 'Wittur Elevator Components India Pvt. Ltd., Kanchipuram',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    year: '2023–2024',
  },
  {
    id: 21,
    school: 'SSL',
    trainers: 'Dr. Govindarajan P; Dr. Ajith I',
    title: 'Support to Educate',
    company: 'Moiso Trust/Unique Public School, Ooty',
    startDate: '2023-12-11',
    endDate: '2023-12-15',
    year: '2023–2024',
  },
  {
    id: 22,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Certification Course on Industrial Automation',
    company: 'Premier Plasmoteo Private Limited, Krishnagiri',
    startDate: '2023-11-13',
    endDate: '2023-11-17',
    year: '2023–2024',
  },
  {
    id: 23,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Certification Course on Industrial Automation',
    company: 'Amber Enterprises Limited, Chennai',
    startDate: '2023-10-16',
    endDate: '2023-10-20',
    year: '2023–2024',
  },
  {
    id: 24,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Certification Course on Industrial Automation',
    company: 'Overseas Impex',
    startDate: '2023-09-18',
    endDate: '2023-09-22',
    year: '2023–2024',
  },
  {
    id: 25,
    school: 'SELECT',
    trainers: 'Dr. Angalaeswari S; Dr. Deepa T',
    title: 'Certification Course on Industrial Automation',
    company: 'Grupo Antolin India Private Ltd',
    startDate: '2023-08-21',
    endDate: '2023-08-25',
    year: '2023–2024',
  },
  {
    id: 26,
    school: 'SCOPE',
    trainers: 'Dr. Christopher Columbus C; Dr. Palani Thanaraj K; Dr. Elakia E',
    title: 'Introduction to IoT-Based Smart Infrastructure for Fire Detection, Home Security, and Access Control Systems',
    company: 'Smart Security Systems Networking, Kerala',
    startDate: '2023-07-17',
    endDate: '2023-07-21',
    year: '2023–2024',
  },
  {
    id: 27,
    school: 'SCE',
    trainers: 'Dr. Vasugi V',
    title: 'YES Programme for IWMA_Phase 2',
    company: 'Indian Waste Management Association (IWMA) Koyambedu, Chennai',
    startDate: '2023-06-19',
    endDate: '2023-06-23',
    year: '2023–2024',
  },
  {
    id: 28,
    school: 'SCOPE',
    trainers: 'Dr. Poonkodi; Dr. Kanniga Devi R; Dr. Suganya G; Dr. Jothi; Dr. Kalamohideen A',
    title: 'AI Capacity Building Training',
    company: 'Kotak Education Foundation (KEF), Mumbai',
    startDate: '2023-05-15',
    endDate: '2023-05-19',
    year: '2022–2023',
  },
  {
    id: 29,
    school: 'SMEC SELECT CEHMA CADS EVT-RC',
    trainers: 'Dr. Sivakumar R; Dr. Davidson J; Dr. Mohan R; Dr. Lenin Babu MC; Dr. Edward Jero; Dr. Chendur Kumaran R; Dr. Abirami S; Dr. Angeline Ezhilarasi G; Dr. Sujoy Sarkar; Dr. Angalaeswari S; Dr. Mohamed Imran A; Dr. Nilanjan Tewari',
    title: 'Training Program on Drives',
    company: 'Sona Comstar, Chennai',
    startDate: '2023-04-17',
    endDate: '2023-04-21',
    year: '2022–2023',
  },
  {
    id: 30,
    school: 'SCOPE',
    trainers: 'Dr. Reena Roy R; Dr. Suganya G; Dr. Kanniga Devi R; Dr. Aswaminathan',
    title: 'Artificial Intelligence (AI) Tools for Interdisciplinary Applications',
    company: 'Kotak Education Foundation (KEF), Mumbai',
    startDate: '2023-03-20',
    endDate: '2023-03-24',
    year: '2022–2023',
  },
  {
    id: 31,
    school: 'SMEC',
    trainers: 'Dr. Karunamurthy K; Dr. Narayanan R; Dr. Mrutunjay Panigrahi',
    title: 'Executive Development Program on Best Practices in Foundry',
    company: 'KHV Nova Viruvambakkam, Chennai',
    startDate: '2023-02-13',
    endDate: '2023-02-17',
    year: '2022–2023',
  },
];

// Alias for backwards-compatibility
export const corporateTrainingOrganizedData = initialCorporateTrainingData;

// Storage key for Admin dynamic modifications
const STORAGE_KEY = 'sporic_corporate_trainings_custom';

export function getAllCorporateTrainings() {
  if (typeof window === 'undefined') return initialCorporateTrainingData;
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return initialCorporateTrainingData;
    const parsed = JSON.parse(custom);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load corporate trainings from storage:', e);
  }
  return initialCorporateTrainingData;
}

export function saveCorporateTraining(record) {
  const current = getAllCorporateTrainings();
  const calculatedYear = record.year || getAcademicYearFromDate(record.startDate);
  
  // Format trainers string if passed as array
  const formattedTrainers = Array.isArray(record.trainers)
    ? record.trainers.filter(Boolean).join('; ')
    : record.trainers;

  const newRecord = {
    ...record,
    id: record.id || `ct_${Date.now().toString(36)}`,
    trainers: formattedTrainers,
    year: calculatedYear,
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sporic_corporate_training_updated'));
  } catch (e) {
    console.warn('Failed to save corporate training to storage:', e);
  }
  return newRecord;
}

export function updateCorporateTraining(id, updatedFields) {
  const current = getAllCorporateTrainings();
  const index = current.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;

  const target = current[index];
  const calculatedYear = updatedFields.year || (updatedFields.startDate ? getAcademicYearFromDate(updatedFields.startDate) : target.year);
  
  const formattedTrainers = Array.isArray(updatedFields.trainers)
    ? updatedFields.trainers.filter(Boolean).join('; ')
    : (updatedFields.trainers !== undefined ? updatedFields.trainers : target.trainers);

  const updatedRecord = {
    ...target,
    ...updatedFields,
    trainers: formattedTrainers,
    year: calculatedYear,
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...current];
  updatedList[index] = updatedRecord;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('sporic_corporate_training_updated'));
  } catch (e) {
    console.warn('Failed to update corporate training in storage:', e);
  }
  return updatedRecord;
}

export function deleteCorporateTraining(id) {
  const current = getAllCorporateTrainings();
  const updatedList = current.filter((item) => String(item.id) !== String(id));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('sporic_corporate_training_updated'));
  } catch (e) {
    console.warn('Failed to delete corporate training from storage:', e);
  }
  return true;
}
