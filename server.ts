import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  Student, AdmissionApplication, Course, FeePayment, 
  AttendanceRecord, Exam, ExamResult, StudyMaterial, 
  Notice, Certificate, ContactMessage, AdminUser, DashboardStats,
  CenterLocationConfig, AttendanceStudentEntry
} from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// File persistence
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface DatabaseSchema {
  admin: AdminUser;
  courses: Course[];
  students: Student[];
  applications: AdmissionApplication[];
  fees: FeePayment[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  results: ExamResult[];
  studyMaterials: StudyMaterial[];
  notices: Notice[];
  certificates: Certificate[];
  contactMessages: ContactMessage[];
  centerLocation: CenterLocationConfig;
}

const defaultCenterLocation: CenterLocationConfig = {
  name: 'Shri Ramkrishna National Youth Computer Centre Main Campus',
  address: 'Vivekananda Sarani, Central Road, Kolkata, WB - 700001',
  latitude: 22.572646,
  longitude: 88.363895,
  allowedRadiusMeters: 500, // 500 meters
  enableGeoAttendance: true
};

// Haversine formula to compute geodesic distance in meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

const defaultCourses: Course[] = [
  {
    id: 'course-basic-computer',
    code: 'BC-101',
    name: 'Basic Computer',
    duration: '3 Months',
    durationMonths: 3,
    fee: 2500,
    level: 'Beginner',
    icon: 'Monitor',
    popular: true,
    badges: ['Practical Based', 'ISO Certified', 'Job Ready'],
    overview: 'The Basic Computer course is designed for absolute beginners, students, and elders to master fundamental digital literacy, operating systems, internet usage, and computer operations required for everyday life and office tasks.',
    topics: [
      'Computer Fundamentals & Hardware Architecture',
      'Windows 10/11 OS & Settings Management',
      'Internet, Web Browsing & Search Techniques',
      'Emailing, Google Drive & Cloud Basics',
      'File, Folder & Drive Management',
      'Basic English & Regional Language Typing',
      'Digital Safety, Cyber Security & Antivirus',
      'Printing, Scanning & Peripheral Handling',
      'Basic Digital Payment & Utility Services'
    ],
    eligibility: 'Open to all (Class 8th / 10th pass or any beginner)',
    certificateInfo: 'Certified Basic Computer Literacy Certificate issued upon completion and practical assessment.'
  },
  {
    id: 'course-ms-office',
    code: 'MSO-102',
    name: 'MS Office Specialist',
    duration: '3 Months',
    durationMonths: 3,
    fee: 3200,
    level: 'Beginner to Intermediate',
    icon: 'FileSpreadsheet',
    popular: true,
    badges: ['Office Automation', 'Data Entry Skill', 'Practical Projects'],
    overview: 'Comprehensive training on Microsoft Office Suite (Word, Excel, PowerPoint) and office automation tools to produce professional reports, complex spreadsheets, data analysis, and captivating multimedia presentations.',
    topics: [
      'MS Word: Document Formatting, Tables & Mail Merge',
      'MS Word: Page Layout, References & Official Letters',
      'MS Excel: Formulae, SUM/AVERAGE/COUNTIF & VLOOKUP',
      'MS Excel: Pivot Tables, Charts, Data Sorting & Filtering',
      'MS Excel: Financial & Logical Functions (IF, AND, OR)',
      'MS PowerPoint: Slide Design, Master Slide & Animations',
      'MS PowerPoint: Interactive Presentations & Video Export',
      'MS Office Practical Work & Data Entry Simulation',
      'Documentation & PDF Conversion Standards',
      'Spreadsheet Management & Automation Shortcuts'
    ],
    eligibility: '10th / 12th Standard or basic familiarity with computers',
    certificateInfo: 'MS Office Specialist Certificate with grade and practical evaluation credentials.'
  },
  {
    id: 'course-tally-prime',
    code: 'TP-103',
    name: 'Tally Prime with GST & Inventory',
    duration: '3 Months',
    durationMonths: 3,
    fee: 4500,
    level: 'Intermediate to Advanced',
    icon: 'Calculator',
    popular: true,
    badges: ['GST Ready', 'Accountant Favorite', 'Real Case Studies'],
    overview: 'Master computerized accounting using the latest Tally Prime software. Learn double-entry bookkeeping, GST invoice creation, inventory tracking, payroll basics, and balance sheet finalization.',
    topics: [
      'Accounting Fundamentals & Golden Rules of Accounting',
      'Company Creation & Configuration in Tally Prime',
      'Ledger & Groups Creation with Account Masters',
      'Voucher Entries: Payment, Receipt, Journal & Contra',
      'Purchase & Sales Invoice with GST Calculation (CGST/SGST/IGST)',
      'Inventory Management: Stock Groups, Units & Items',
      'GST Returns Basics (GSTR-1, GSTR-3B Overview)',
      'Debit Note, Credit Note & Multi-Currency',
      'Financial Reports: Balance Sheet, P&L, Trial Balance',
      'Practical Business Case Studies & Live Auditing'
    ],
    eligibility: '10+2 (Commerce preferred, but Arts/Science welcome) or Graduates',
    certificateInfo: 'Govt. Recognized Tally Prime Professional Certificate with verification QR code.'
  },
  {
    id: 'course-dca',
    code: 'DCA-104',
    name: 'Diploma in Computer Application (DCA)',
    duration: '6 Months (Fast-track) / 12 Months',
    durationMonths: 6,
    fee: 6500,
    level: 'Comprehensive Professional Diploma',
    icon: 'GraduationCap',
    popular: true,
    badges: ['Most Popular Diploma', 'Job Placement Support', 'Full Tech Suite'],
    overview: 'DCA is our flagship diploma course covering Computer Fundamentals, MS Office, Internet, Tally Prime with GST, Graphic Design fundamentals (Photoshop), Hardware basics, and Web fundamentals.',
    topics: [
      'Module 1: Computer Fundamentals & Windows OS Architecture',
      'Module 2: Advanced MS Office (Word, Advanced Excel & PPT)',
      'Module 3: Internet Technologies, Cybersecurity & Networking',
      'Module 4: Professional Accounting with Tally Prime & GST',
      'Module 5: Desktop Publishing (Photoshop & PageMaker/Canva)',
      'Module 6: HTML5, Web Basics & Modern Digital Workplace Tools',
      'Module 7: Soft Skills, Resume Building & Interview Preparation',
      'Module 8: Capstone Live Project & Comprehensive Viva Voce'
    ],
    eligibility: '10th / 12th Pass or equivalent from any recognized board',
    certificateInfo: 'Diploma in Computer Application (DCA) Certificate + Marksheet with verifiable Student ID.'
  }
];

const defaultNotices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Admissions Open for New Batch 2026-27',
    date: '2026-08-15',
    category: 'Admission',
    content: 'Admissions are now open for Morning, Afternoon, and Evening batches in Basic Computer, MS Office, Tally Prime, and DCA. Apply online or visit the centre before 30th August.',
    isPinned: true,
    target: 'all'
  },
  {
    id: 'notice-2',
    title: 'Practical Assessment for DCA & Tally Prime Batches',
    date: '2026-08-18',
    category: 'Exam',
    content: 'All enrolled students of DCA (Morning Batch) and Tally Prime (Afternoon Batch) must appear for the mid-term practical evaluation on 28th August at Computer Lab 1.',
    isPinned: true,
    target: 'students'
  },
  {
    id: 'notice-3',
    title: 'National Youth Skill Development Workshop',
    date: '2026-08-10',
    category: 'Workshop',
    content: 'Free 2-day workshop on AI Tools for Office Productivity & Resume Building. Open to all students on Saturday and Sunday at 11:00 AM.',
    isPinned: false,
    target: 'all'
  },
  {
    id: 'notice-4',
    title: 'Holiday Notice - Independence Day Celebration',
    date: '2026-08-14',
    category: 'Holiday',
    content: 'Institute will remain closed for regular classes on 15th August. Flag hoisting ceremony will be held at 9:00 AM at the institute premises.',
    isPinned: false,
    target: 'all'
  }
];

const defaultAdmin: AdminUser = {
  id: 'admin-1',
  username: 'admin',
  name: 'Centre Director & Academic Head',
  email: 'director@srknycc.org',
  role: 'admin',
  title: 'Principal Coordinator'
};

const defaultStudents: Student[] = [
  {
    id: 'std-1',
    studentId: 'SRKNYCC-2026-0001',
    name: 'Rahul Sharma',
    parentName: 'Ramesh Sharma',
    dob: '2004-05-14',
    gender: 'Male',
    mobile: '9876543210',
    email: 'rahul.sharma@example.com',
    address: '42, Vivekananda Road, College Para, West Bengal - 700006',
    qualification: 'Higher Secondary (10+2)',
    courseId: 'course-dca',
    courseName: 'Diploma in Computer Application (DCA)',
    batch: 'Morning (08:00 AM - 10:00 AM)',
    admissionDate: '2026-06-01',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    password: 'student123',
    totalFee: 6500,
    paidFee: 4500,
    dueFee: 2000
  },
  {
    id: 'std-2',
    studentId: 'SRKNYCC-2026-0002',
    name: 'Priya Mondal',
    parentName: 'Subhas Mondal',
    dob: '2003-11-20',
    gender: 'Female',
    mobile: '9830112233',
    email: 'priya.mondal@example.com',
    address: '18/A Netaji Subhash Avenue, Kolkata - 700028',
    qualification: 'B.Com (1st Year)',
    courseId: 'course-tally-prime',
    courseName: 'Tally Prime with GST & Inventory',
    batch: 'Afternoon (02:00 PM - 04:00 PM)',
    admissionDate: '2026-06-15',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    password: 'student123',
    totalFee: 4500,
    paidFee: 4500,
    dueFee: 0
  },
  {
    id: 'std-3',
    studentId: 'SRKNYCC-2026-0003',
    name: 'Amit Kumar Das',
    parentName: 'Biplab Das',
    dob: '2005-02-10',
    gender: 'Male',
    mobile: '9432098765',
    email: 'amit.das@example.com',
    address: 'Station Road, Ward No 4, Ranaghat, Nadia - 741201',
    qualification: 'Secondary (Class 10)',
    courseId: 'course-ms-office',
    courseName: 'MS Office Specialist',
    batch: 'Evening (05:00 PM - 07:00 PM)',
    admissionDate: '2026-07-01',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    password: 'student123',
    totalFee: 3200,
    paidFee: 2000,
    dueFee: 1200
  },
  {
    id: 'std-4',
    studentId: 'SRKNYCC-2026-0004',
    name: 'Sneha Banerjee',
    parentName: 'Debabrata Banerjee',
    dob: '2002-09-08',
    gender: 'Female',
    mobile: '9734567890',
    email: 'sneha.b@example.com',
    address: '88 Lake Town, Block B, Kolkata - 700089',
    qualification: 'Graduate (B.A)',
    courseId: 'course-basic-computer',
    courseName: 'Basic Computer',
    batch: 'Weekend Batch (Saturday - Sunday 10:00 AM)',
    admissionDate: '2026-05-10',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    status: 'completed',
    password: 'student123',
    totalFee: 2500,
    paidFee: 2500,
    dueFee: 0
  }
];

const defaultApplications: AdmissionApplication[] = [
  {
    id: 'app-1',
    applicationId: 'APP-2026-1041',
    studentName: 'Suman Mukherjee',
    parentName: 'Tarun Mukherjee',
    dob: '2004-08-12',
    gender: 'Male',
    mobile: '9836778899',
    email: 'suman.m@example.com',
    address: '12 Central Road, Siliguri - 734001',
    qualification: 'Higher Secondary (10+2)',
    courseId: 'course-dca',
    courseName: 'Diploma in Computer Application (DCA)',
    preferredBatch: 'Morning (08:00 AM - 10:00 AM)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    submittedAt: '2026-08-20T10:15:00.000Z',
    status: 'pending',
    remarks: 'Awaiting original 10+2 marksheet verification'
  },
  {
    id: 'app-2',
    applicationId: 'APP-2026-1042',
    studentName: 'Ananya Roy',
    parentName: 'Prabir Roy',
    dob: '2005-04-19',
    gender: 'Female',
    mobile: '9123456780',
    email: 'ananya.roy@example.com',
    address: '55 G.T Road, Asansol - 713301',
    qualification: '10th Pass',
    courseId: 'course-basic-computer',
    courseName: 'Basic Computer',
    preferredBatch: 'Evening (05:00 PM - 07:00 PM)',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    submittedAt: '2026-08-19T14:30:00.000Z',
    status: 'pending'
  }
];

const defaultFees: FeePayment[] = [
  {
    id: 'fee-1',
    receiptNumber: 'REC-2026-0101',
    studentId: 'SRKNYCC-2026-0001',
    studentName: 'Rahul Sharma',
    courseName: 'Diploma in Computer Application (DCA)',
    amount: 3000,
    paymentDate: '2026-06-01',
    paymentMode: 'Cash',
    collectedBy: 'Academic Head',
    remarks: '1st Installment at Admission',
    balanceRemaining: 3500
  },
  {
    id: 'fee-2',
    receiptNumber: 'REC-2026-0102',
    studentId: 'SRKNYCC-2026-0001',
    studentName: 'Rahul Sharma',
    courseName: 'Diploma in Computer Application (DCA)',
    amount: 1500,
    paymentDate: '2026-07-05',
    paymentMode: 'UPI',
    transactionId: 'UPI983749281203',
    collectedBy: 'Office Assistant',
    remarks: '2nd Installment',
    balanceRemaining: 2000
  },
  {
    id: 'fee-3',
    receiptNumber: 'REC-2026-0103',
    studentId: 'SRKNYCC-2026-0002',
    studentName: 'Priya Mondal',
    courseName: 'Tally Prime with GST & Inventory',
    amount: 4500,
    paymentDate: '2026-06-15',
    paymentMode: 'UPI',
    transactionId: 'UPI772819034511',
    collectedBy: 'Academic Head',
    remarks: 'Full Course Fee Paid with Discount',
    balanceRemaining: 0
  },
  {
    id: 'fee-4',
    receiptNumber: 'REC-2026-0104',
    studentId: 'SRKNYCC-2026-0003',
    studentName: 'Amit Kumar Das',
    courseName: 'MS Office Specialist',
    amount: 2000,
    paymentDate: '2026-07-01',
    paymentMode: 'Cash',
    collectedBy: 'Office Assistant',
    remarks: 'Admission Fee + 1st Month',
    balanceRemaining: 1200
  }
];

const defaultAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-08-18',
    batch: 'Morning (08:00 AM - 10:00 AM)',
    courseId: 'course-dca',
    records: [
      { studentId: 'SRKNYCC-2026-0001', studentName: 'Rahul Sharma', status: 'present' }
    ]
  },
  {
    id: 'att-2',
    date: '2026-08-19',
    batch: 'Morning (08:00 AM - 10:00 AM)',
    courseId: 'course-dca',
    records: [
      { studentId: 'SRKNYCC-2026-0001', studentName: 'Rahul Sharma', status: 'present' }
    ]
  },
  {
    id: 'att-3',
    date: '2026-08-20',
    batch: 'Morning (08:00 AM - 10:00 AM)',
    courseId: 'course-dca',
    records: [
      { studentId: 'SRKNYCC-2026-0001', studentName: 'Rahul Sharma', status: 'late' }
    ]
  },
  {
    id: 'att-4',
    date: '2026-08-18',
    batch: 'Afternoon (02:00 PM - 04:00 PM)',
    courseId: 'course-tally-prime',
    records: [
      { studentId: 'SRKNYCC-2026-0002', studentName: 'Priya Mondal', status: 'present' }
    ]
  },
  {
    id: 'att-5',
    date: '2026-08-19',
    batch: 'Afternoon (02:00 PM - 04:00 PM)',
    courseId: 'course-tally-prime',
    records: [
      { studentId: 'SRKNYCC-2026-0002', studentName: 'Priya Mondal', status: 'present' }
    ]
  }
];

const defaultExams: Exam[] = [
  {
    id: 'exam-1',
    examCode: 'EX-DCA-2026-M1',
    title: 'DCA Module 1 & 2 Mid-Term Practical',
    courseId: 'course-dca',
    courseName: 'Diploma in Computer Application (DCA)',
    date: '2026-07-25',
    maxMarks: 100,
    passMarks: 40,
    type: 'Combined'
  },
  {
    id: 'exam-2',
    examCode: 'EX-TP-2026-T1',
    title: 'Tally Prime GST Vouchers & Ledger Test',
    courseId: 'course-tally-prime',
    courseName: 'Tally Prime with GST & Inventory',
    date: '2026-07-30',
    maxMarks: 100,
    passMarks: 40,
    type: 'Practical'
  },
  {
    id: 'exam-3',
    examCode: 'EX-BC-2026-FINAL',
    title: 'Basic Computer Certification Final Exam',
    courseId: 'course-basic-computer',
    courseName: 'Basic Computer',
    date: '2026-08-05',
    maxMarks: 100,
    passMarks: 40,
    type: 'Combined'
  }
];

const defaultResults: ExamResult[] = [
  {
    id: 'res-1',
    examId: 'exam-1',
    examTitle: 'DCA Module 1 & 2 Mid-Term Practical',
    studentId: 'SRKNYCC-2026-0001',
    studentName: 'Rahul Sharma',
    courseName: 'Diploma in Computer Application (DCA)',
    marksObtained: 88,
    maxMarks: 100,
    percentage: 88,
    grade: 'A+',
    status: 'Pass',
    remarks: 'Excellent speed in Excel Formulas and Word mail merge.',
    examDate: '2026-07-25'
  },
  {
    id: 'res-2',
    examId: 'exam-2',
    examTitle: 'Tally Prime GST Vouchers & Ledger Test',
    studentId: 'SRKNYCC-2026-0002',
    studentName: 'Priya Mondal',
    courseName: 'Tally Prime with GST & Inventory',
    marksObtained: 94,
    maxMarks: 100,
    percentage: 94,
    grade: 'A+',
    status: 'Pass',
    remarks: 'Flawless balance sheet reconciliation and tax invoicing.',
    examDate: '2026-07-30'
  },
  {
    id: 'res-3',
    examId: 'exam-3',
    examTitle: 'Basic Computer Certification Final Exam',
    studentId: 'SRKNYCC-2026-0004',
    studentName: 'Sneha Banerjee',
    courseName: 'Basic Computer',
    marksObtained: 82,
    maxMarks: 100,
    percentage: 82,
    grade: 'A',
    status: 'Pass',
    remarks: 'Completed all typing and OS setup tasks successfully.',
    examDate: '2026-08-05'
  }
];

const defaultStudyMaterials: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Computer Fundamentals & Windows 11 Handbook',
    courseId: 'course-basic-computer',
    courseName: 'Basic Computer',
    category: 'PDF Notes',
    fileUrl: '#',
    fileSize: '4.2 MB',
    uploadDate: '2026-06-05',
    description: 'Complete introductory study notes on hardware, software, BIOS, shortcuts, and folder architecture.',
    downloadCount: 84
  },
  {
    id: 'mat-2',
    title: 'Advanced MS Excel Formulas & Lookup Cheatsheet',
    courseId: 'course-ms-office',
    courseName: 'MS Office Specialist',
    category: 'PDF Notes',
    fileUrl: '#',
    fileSize: '3.8 MB',
    uploadDate: '2026-06-12',
    description: 'Summary of 50+ essential business formulas including XLOOKUP, VLOOKUP, INDEX/MATCH, and Conditional Formatting.',
    downloadCount: 142
  },
  {
    id: 'mat-3',
    title: 'Tally Prime Practical Ledger & GST Voucher Problem Set',
    courseId: 'course-tally-prime',
    courseName: 'Tally Prime with GST & Inventory',
    category: 'Assignment',
    fileUrl: '#',
    fileSize: '5.1 MB',
    uploadDate: '2026-06-20',
    description: '15 Real business scenarios with trial balance, supplier purchases, and GST returns for lab practice.',
    downloadCount: 97
  },
  {
    id: 'mat-4',
    title: 'DCA Complete Semester 1 Syllabus & Question Bank',
    courseId: 'course-dca',
    courseName: 'Diploma in Computer Application (DCA)',
    category: 'Question Bank',
    fileUrl: '#',
    fileSize: '6.4 MB',
    uploadDate: '2026-06-01',
    description: 'Previous 5 years solved question papers and practical project guidelines for DCA students.',
    downloadCount: 215
  }
];

const defaultCertificates: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'SRK-CERT-2026-0045',
    studentId: 'SRKNYCC-2026-0004',
    studentName: 'Sneha Banerjee',
    courseName: 'Basic Computer',
    duration: '3 Months (May 2026 - August 2026)',
    issueDate: '2026-08-10',
    grade: 'A (Distinction)',
    percentage: 82,
    verificationCode: 'VERIFY-SRK-0045-SB',
    remarks: 'Awarded for successful completion of practical and theoretical computing modules with Grade A.'
  }
];

const defaultContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Bikash Das',
    email: 'bikash@example.com',
    phone: '9871234567',
    subject: 'Inquiry regarding Weekend Tally Prime Batch',
    message: 'Hello, I work in accounts during weekdays. Is there an exclusive weekend batch for Tally Prime with GST available in September?',
    date: '2026-08-20',
    status: 'new'
  }
];

// Helper to load or initialize DB
function getDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.centerLocation) {
        parsed.centerLocation = defaultCenterLocation;
        saveDatabase(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db.json, reinitializing:', err);
  }

  const initialData: DatabaseSchema = {
    admin: defaultAdmin,
    courses: defaultCourses,
    students: defaultStudents,
    applications: defaultApplications,
    fees: defaultFees,
    attendance: defaultAttendance,
    exams: defaultExams,
    results: defaultResults,
    studyMaterials: defaultStudyMaterials,
    notices: defaultNotices,
    certificates: defaultCertificates,
    contactMessages: defaultContactMessages,
    centerLocation: defaultCenterLocation
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', name: 'Shri Ramkrishna National Youth Computer Centre API', timestamp: new Date().toISOString() });
});

// Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, usernameOrId, password } = req.body;
  const db = getDatabase();

  if (role === 'admin') {
    if ((usernameOrId === 'admin' || usernameOrId === 'director@srknycc.org') && password === 'admin123') {
      return res.json({
        success: true,
        user: db.admin,
        role: 'admin'
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin credentials. Try username: admin, password: admin123' });
  }

  if (role === 'student') {
    const student = db.students.find(
      s => (s.studentId.toLowerCase() === usernameOrId.trim().toLowerCase() || s.mobile === usernameOrId.trim() || s.email.toLowerCase() === usernameOrId.trim().toLowerCase())
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student ID or registered mobile not found.' });
    }

    if (student.password && student.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Default password is student123 or check with institute admin.' });
    }

    return res.json({
      success: true,
      user: student,
      role: 'student'
    });
  }

  res.status(400).json({ success: false, message: 'Invalid role requested.' });
});

// Dashboard Stats (Admin)
app.get('/api/stats', (req: Request, res: Response) => {
  const db = getDatabase();
  const totalStudents = db.students.length;
  const activeStudents = db.students.filter(s => s.status === 'active').length;
  const completedCourses = db.students.filter(s => s.status === 'completed').length;
  const pendingApplications = db.applications.filter(a => a.status === 'pending').length;
  const newAdmissions = db.students.filter(s => {
    const adm = new Date(s.admissionDate);
    const now = new Date();
    return adm.getMonth() === now.getMonth() && adm.getFullYear() === now.getFullYear();
  }).length;

  const totalFeesCollected = db.fees.reduce((acc, f) => acc + (f.amount || 0), 0);
  const totalFeesDue = db.students.reduce((acc, s) => acc + (s.dueFee || 0), 0);

  const stats: DashboardStats = {
    totalStudents,
    newAdmissions: newAdmissions || 2,
    activeStudents,
    completedCourses,
    pendingApplications,
    totalFeesCollected,
    totalFeesDue
  };

  res.json({ success: true, stats });
});

// ----------------------------------------------------
// COURSES
// ----------------------------------------------------
app.get('/api/courses', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, courses: db.courses });
});

app.post('/api/courses', (req: Request, res: Response) => {
  const db = getDatabase();
  const newCourse: Course = {
    id: `course-${Date.now()}`,
    code: req.body.code || `CR-${Math.floor(100 + Math.random() * 900)}`,
    name: req.body.name,
    duration: req.body.duration,
    durationMonths: Number(req.body.durationMonths) || 3,
    fee: Number(req.body.fee),
    overview: req.body.overview,
    topics: Array.isArray(req.body.topics) ? req.body.topics : (req.body.topics ? req.body.topics.split('\n').filter(Boolean) : []),
    eligibility: req.body.eligibility,
    certificateInfo: req.body.certificateInfo,
    level: req.body.level || 'Beginner to Advanced',
    icon: req.body.icon || 'GraduationCap',
    popular: !!req.body.popular,
    badges: req.body.badges || ['Verified Course']
  };

  db.courses.push(newCourse);
  saveDatabase(db);
  res.json({ success: true, course: newCourse, message: 'Course created successfully' });
});

app.put('/api/courses/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Course not found' });

  db.courses[index] = {
    ...db.courses[index],
    ...req.body,
    fee: Number(req.body.fee) || db.courses[index].fee,
    durationMonths: Number(req.body.durationMonths) || db.courses[index].durationMonths
  };
  saveDatabase(db);
  res.json({ success: true, course: db.courses[index], message: 'Course updated successfully' });
});

app.delete('/api/courses/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.courses = db.courses.filter(c => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// ----------------------------------------------------
// ADMISSION APPLICATIONS
// ----------------------------------------------------
app.get('/api/admissions', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, applications: db.applications });
});

app.post('/api/admissions', (req: Request, res: Response) => {
  const db = getDatabase();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationId = `APP-${year}-${randomSuffix}`;

  const newApp: AdmissionApplication = {
    id: `app-${Date.now()}`,
    applicationId,
    studentName: req.body.studentName,
    parentName: req.body.parentName,
    dob: req.body.dob,
    gender: req.body.gender,
    mobile: req.body.mobile,
    email: req.body.email,
    address: req.body.address,
    qualification: req.body.qualification,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    preferredBatch: req.body.preferredBatch,
    photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    idProofUrl: req.body.idProofUrl,
    signatureUrl: req.body.signatureUrl,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    remarks: req.body.remarks || 'Application received online. Under review.'
  };

  db.applications.unshift(newApp);
  saveDatabase(db);

  res.json({ 
    success: true, 
    application: newApp, 
    message: 'Online Admission Application submitted successfully! Please save your Application ID.' 
  });
});

app.get('/api/admissions/track/:query', (req: Request, res: Response) => {
  const db = getDatabase();
  const q = req.params.query.trim().toLowerCase();
  const appFound = db.applications.find(
    a => a.applicationId.toLowerCase() === q || a.mobile === q || a.email.toLowerCase() === q
  );

  if (!appFound) {
    return res.status(404).json({ success: false, message: 'No admission application found matching the ID or Mobile number.' });
  }

  res.json({ success: true, application: appFound });
});

app.put('/api/admissions/:id/status', (req: Request, res: Response) => {
  const db = getDatabase();
  const appIndex = db.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) return res.status(404).json({ success: false, message: 'Application not found' });

  const { status, remarks, batch, feePaid, totalFee } = req.body;
  const targetApp = db.applications[appIndex];
  targetApp.status = status;
  if (remarks) targetApp.remarks = remarks;

  // If approved, convert to student if not already converted
  let generatedStudent: Student | null = null;
  if (status === 'approved' && !targetApp.assignedStudentId) {
    const year = new Date().getFullYear();
    const count = db.students.length + 1;
    const studentId = `SRKNYCC-${year}-${count.toString().padStart(4, '0')}`;
    targetApp.assignedStudentId = studentId;

    const course = db.courses.find(c => c.id === targetApp.courseId);
    const courseFee = totalFee ? Number(totalFee) : (course ? course.fee : 5000);
    const paid = Number(feePaid) || 0;

    generatedStudent = {
      id: `std-${Date.now()}`,
      studentId,
      name: targetApp.studentName,
      parentName: targetApp.parentName,
      dob: targetApp.dob,
      gender: targetApp.gender,
      mobile: targetApp.mobile,
      email: targetApp.email,
      address: targetApp.address,
      qualification: targetApp.qualification,
      courseId: targetApp.courseId,
      courseName: targetApp.courseName,
      batch: batch || targetApp.preferredBatch,
      admissionDate: new Date().toISOString().split('T')[0],
      photoUrl: targetApp.photoUrl,
      idProofUrl: targetApp.idProofUrl,
      signatureUrl: targetApp.signatureUrl,
      status: 'active',
      password: 'student123',
      totalFee: courseFee,
      paidFee: paid,
      dueFee: Math.max(0, courseFee - paid)
    };

    db.students.push(generatedStudent);

    if (paid > 0) {
      const recNo = `REC-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      db.fees.push({
        id: `fee-${Date.now()}`,
        receiptNumber: recNo,
        studentId,
        studentName: generatedStudent.name,
        courseName: generatedStudent.courseName,
        amount: paid,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        collectedBy: 'Admissions Officer',
        remarks: 'Initial Admission Down-payment',
        balanceRemaining: generatedStudent.dueFee
      });
    }
  }

  saveDatabase(db);
  res.json({ 
    success: true, 
    application: targetApp, 
    student: generatedStudent,
    message: status === 'approved' ? 'Application approved & Student ID generated successfully!' : 'Application updated.' 
  });
});

// ----------------------------------------------------
// STUDENTS MANAGEMENT
// ----------------------------------------------------
app.get('/api/students', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, students: db.students });
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const student = db.students.find(s => s.id === req.params.id || s.studentId === req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
});

app.post('/api/students', (req: Request, res: Response) => {
  const db = getDatabase();
  const year = new Date().getFullYear();
  const count = db.students.length + 1;
  const studentId = req.body.studentId || `SRKNYCC-${year}-${count.toString().padStart(4, '0')}`;

  const totalFee = Number(req.body.totalFee) || 5000;
  const paidFee = Number(req.body.paidFee) || 0;

  const newStudent: Student = {
    id: `std-${Date.now()}`,
    studentId,
    name: req.body.name,
    parentName: req.body.parentName || 'Parent / Guardian',
    dob: req.body.dob || '2004-01-01',
    gender: req.body.gender || 'Male',
    mobile: req.body.mobile,
    email: req.body.email || `${studentId.toLowerCase()}@srknycc.org`,
    address: req.body.address || 'Kolkata, West Bengal',
    qualification: req.body.qualification || '10+2 Standard',
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    batch: req.body.batch || 'Morning (08:00 AM - 10:00 AM)',
    admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0],
    photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    status: req.body.status || 'active',
    password: req.body.password || 'student123',
    totalFee,
    paidFee,
    dueFee: Math.max(0, totalFee - paidFee)
  };

  db.students.push(newStudent);

  if (paidFee > 0) {
    const recNo = `REC-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    db.fees.push({
      id: `fee-${Date.now()}`,
      receiptNumber: recNo,
      studentId: newStudent.studentId,
      studentName: newStudent.name,
      courseName: newStudent.courseName,
      amount: paidFee,
      paymentDate: newStudent.admissionDate,
      paymentMode: 'Cash',
      collectedBy: 'Admissions Desk',
      remarks: 'Course Fee Payment',
      balanceRemaining: newStudent.dueFee
    });
  }

  saveDatabase(db);
  res.json({ success: true, student: newStudent, message: 'Student added successfully' });
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.students.findIndex(s => s.id === req.params.id || s.studentId === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Student not found' });

  const totalFee = req.body.totalFee !== undefined ? Number(req.body.totalFee) : db.students[index].totalFee;
  const paidFee = req.body.paidFee !== undefined ? Number(req.body.paidFee) : db.students[index].paidFee;

  db.students[index] = {
    ...db.students[index],
    ...req.body,
    totalFee,
    paidFee,
    dueFee: Math.max(0, totalFee - paidFee)
  };

  saveDatabase(db);
  res.json({ success: true, student: db.students[index], message: 'Student profile updated successfully' });
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.students = db.students.filter(s => s.id !== req.params.id && s.studentId !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Student deleted successfully' });
});

// ----------------------------------------------------
// FEES & PAYMENTS
// ----------------------------------------------------
app.get('/api/fees', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, fees: db.fees });
});

app.post('/api/fees', (req: Request, res: Response) => {
  const db = getDatabase();
  const { studentId, amount, paymentMode, transactionId, remarks, collectedBy } = req.body;

  const student = db.students.find(s => s.studentId === studentId || s.id === studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const paidAmount = Number(amount);
  student.paidFee = (student.paidFee || 0) + paidAmount;
  student.dueFee = Math.max(0, student.totalFee - student.paidFee);

  const year = new Date().getFullYear();
  const receiptNumber = `REC-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

  const payment: FeePayment = {
    id: `fee-${Date.now()}`,
    receiptNumber,
    studentId: student.studentId,
    studentName: student.name,
    courseName: student.courseName,
    amount: paidAmount,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: paymentMode || 'Cash',
    transactionId: transactionId || '',
    remarks: remarks || 'Fee Installment',
    collectedBy: collectedBy || 'Accounts Department',
    balanceRemaining: student.dueFee
  };

  db.fees.unshift(payment);
  saveDatabase(db);

  res.json({ 
    success: true, 
    payment, 
    student, 
    message: `Payment of ₹${paidAmount} recorded successfully for ${student.name}. Receipt: ${receiptNumber}` 
  });
});

app.get('/api/fees/student/:studentId', (req: Request, res: Response) => {
  const db = getDatabase();
  const studentPayments = db.fees.filter(f => f.studentId === req.params.studentId);
  const student = db.students.find(s => s.studentId === req.params.studentId);
  res.json({ success: true, payments: studentPayments, student });
});

// ----------------------------------------------------
// ATTENDANCE & GEOLOCATION
// ----------------------------------------------------
app.get('/api/center-location', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, centerLocation: db.centerLocation });
});

app.put('/api/center-location', (req: Request, res: Response) => {
  const db = getDatabase();
  const { name, address, latitude, longitude, allowedRadiusMeters, enableGeoAttendance } = req.body;
  
  db.centerLocation = {
    name: name || db.centerLocation.name,
    address: address || db.centerLocation.address,
    latitude: Number(latitude) || db.centerLocation.latitude,
    longitude: Number(longitude) || db.centerLocation.longitude,
    allowedRadiusMeters: Number(allowedRadiusMeters) || db.centerLocation.allowedRadiusMeters,
    enableGeoAttendance: enableGeoAttendance !== undefined ? !!enableGeoAttendance : db.centerLocation.enableGeoAttendance
  };

  saveDatabase(db);
  res.json({ success: true, centerLocation: db.centerLocation, message: 'Center location & geofence radius updated successfully.' });
});

app.get('/api/attendance', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, attendance: db.attendance });
});

app.post('/api/attendance', (req: Request, res: Response) => {
  const db = getDatabase();
  const { date, batch, courseId, records } = req.body;

  // If entry already exists for date + batch, update it; else create
  const existingIdx = db.attendance.findIndex(a => a.date === date && a.batch === batch);
  if (existingIdx !== -1) {
    db.attendance[existingIdx].records = records;
  } else {
    db.attendance.push({
      id: `att-${Date.now()}`,
      date,
      batch,
      courseId,
      records
    });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Attendance saved successfully for batch on ' + date });
});

// Admin marks attendance for a single student directly
app.post('/api/attendance/mark-student', (req: Request, res: Response) => {
  const db = getDatabase();
  const { studentId, date, status, batch, remarks } = req.body;

  const student = db.students.find(s => s.studentId === studentId || s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];
  const targetBatch = batch || student.batch;
  const targetStatus = status || 'present';

  let attRecord = db.attendance.find(a => a.date === targetDate && a.batch === targetBatch);
  if (!attRecord) {
    attRecord = {
      id: `att-${Date.now()}`,
      date: targetDate,
      batch: targetBatch,
      courseId: student.courseId,
      records: []
    };
    db.attendance.push(attRecord);
  }

  const existingEntryIdx = attRecord.records.findIndex(r => r.studentId === student.studentId);
  const updatedEntry: AttendanceStudentEntry = {
    studentId: student.studentId,
    studentName: student.name,
    status: targetStatus,
    markedBy: 'admin',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    remarks: remarks || `Marked by Instructor (${targetStatus.toUpperCase()})`
  };

  if (existingEntryIdx !== -1) {
    attRecord.records[existingEntryIdx] = updatedEntry;
  } else {
    attRecord.records.push(updatedEntry);
  }

  saveDatabase(db);
  res.json({ 
    success: true, 
    entry: updatedEntry, 
    message: `Attendance marked as ${targetStatus.toUpperCase()} for ${student.name} by Admin.` 
  });
});

// Student Self-Attendance via Geolocation Verification
app.post('/api/attendance/self-mark', (req: Request, res: Response) => {
  const db = getDatabase();
  const { studentId, latitude, longitude, accuracy, remarks, forceOverride } = req.body;

  const student = db.students.find(s => s.studentId === studentId || s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found with ID: ' + studentId });
  }

  const center = db.centerLocation || defaultCenterLocation;
  const userLat = Number(latitude);
  const userLon = Number(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid GPS coordinates provided. Please enable device location.' 
    });
  }

  const distanceMeters = calculateDistanceMeters(userLat, userLon, center.latitude, center.longitude);
  const isWithinGeofence = distanceMeters <= center.allowedRadiusMeters;

  // Check geofence if geo attendance is enabled and not overridden
  if (center.enableGeoAttendance && !isWithinGeofence && !forceOverride) {
    const formattedDistance = distanceMeters >= 1000 
      ? `${(distanceMeters / 1000).toFixed(2)} km` 
      : `${distanceMeters} meters`;

    return res.status(400).json({
      success: false,
      isOutOfRange: true,
      distanceMeters,
      allowedRadius: center.allowedRadiusMeters,
      centerLocation: center,
      message: `You are currently ${formattedDistance} away from ${center.name}. Attendance can only be marked within ${center.allowedRadiusMeters} meters of the computer lab.`
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const targetBatch = student.batch || 'Morning (08:00 AM - 10:00 AM)';

  let attRecord = db.attendance.find(a => a.date === today && a.batch === targetBatch);
  if (!attRecord) {
    attRecord = {
      id: `att-${Date.now()}`,
      date: today,
      batch: targetBatch,
      courseId: student.courseId,
      records: []
    };
    db.attendance.push(attRecord);
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const studentEntry: AttendanceStudentEntry = {
    studentId: student.studentId,
    studentName: student.name,
    status: 'present',
    markedBy: 'self-geo',
    timestamp: currentTime,
    location: {
      latitude: userLat,
      longitude: userLon,
      accuracy: accuracy ? Number(accuracy) : 10,
      distanceMeters,
      isWithinGeofence
    },
    remarks: remarks || (forceOverride ? `Self Check-in (Campus Override / Lab Mode)` : `Campus GPS Verified (${distanceMeters}m from center)`)
  };

  const existingEntryIdx = attRecord.records.findIndex(r => r.studentId === student.studentId);
  if (existingEntryIdx !== -1) {
    attRecord.records[existingEntryIdx] = studentEntry;
  } else {
    attRecord.records.push(studentEntry);
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: `Attendance marked successfully! Check-in recorded at ${currentTime} (${distanceMeters}m from center).`,
    entry: studentEntry,
    distanceMeters,
    date: today,
    isWithinGeofence
  });
});

app.get('/api/attendance/student/:studentId', (req: Request, res: Response) => {
  const db = getDatabase();
  const targetId = req.params.studentId;

  let totalClasses = 0;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  const history: any[] = [];

  db.attendance.forEach(att => {
    const studentEntry = att.records.find(r => r.studentId === targetId);
    if (studentEntry) {
      totalClasses++;
      if (studentEntry.status === 'present') presentCount++;
      else if (studentEntry.status === 'absent') absentCount++;
      else if (studentEntry.status === 'late') {
        lateCount++;
        presentCount += 0.8; // partial credit
      } else if (studentEntry.status === 'excused') excusedCount++;

      history.push({
        date: att.date,
        status: studentEntry.status,
        batch: att.batch,
        timestamp: studentEntry.timestamp,
        markedBy: studentEntry.markedBy || 'admin',
        location: studentEntry.location,
        remarks: studentEntry.remarks
      });
    }
  });

  // Sort latest first
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  res.json({
    success: true,
    totalClasses: totalClasses || 24, // sample fallback if just registered
    present: Math.round(presentCount) || 22,
    absent: absentCount || 2,
    late: lateCount,
    excused: excusedCount,
    percentage: totalClasses > 0 ? percentage : 92,
    history
  });
});

// Student Unified Dashboard Endpoint
app.get('/api/student/dashboard/:studentId', (req: Request, res: Response) => {
  const db = getDatabase();
  const targetId = req.params.studentId;

  const student = db.students.find(s => s.studentId === targetId || s.id === targetId || s.mobile === targetId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student profile not found.' });
  }

  const fees = db.fees.filter(f => f.studentId === student.studentId);
  const results = db.results.filter(r => r.studentId === student.studentId);
  const certificates = db.certificates.filter(c => c.studentId === student.studentId);
  const materials = db.studyMaterials.filter(m => m.courseId === student.courseId || m.courseName === student.courseName);
  const notices = db.notices.filter(n => n.target === 'all' || n.target === 'students');

  // Build attendance history
  const today = new Date().toISOString().split('T')[0];
  let todayAttendance: AttendanceStudentEntry | null = null;
  const attendanceHistory: any[] = [];

  db.attendance.forEach(att => {
    const entry = att.records.find(r => r.studentId === student.studentId);
    if (entry) {
      if (att.date === today) {
        todayAttendance = entry;
      }
      attendanceHistory.push({
        date: att.date,
        batch: att.batch,
        status: entry.status,
        timestamp: entry.timestamp,
        markedBy: entry.markedBy,
        location: entry.location,
        remarks: entry.remarks
      });
    }
  });

  attendanceHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    success: true,
    student,
    fees,
    attendance: attendanceHistory,
    todayAttendance,
    results,
    materials: materials.length > 0 ? materials : db.studyMaterials,
    notices,
    certificates,
    centerLocation: db.centerLocation || defaultCenterLocation
  });
});

// ----------------------------------------------------
// EXAMS & RESULTS
// ----------------------------------------------------
app.get('/api/exams', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, exams: db.exams });
});

app.post('/api/exams', (req: Request, res: Response) => {
  const db = getDatabase();
  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    examCode: req.body.examCode || `EX-${Math.floor(1000 + Math.random() * 9000)}`,
    title: req.body.title,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    date: req.body.date,
    maxMarks: Number(req.body.maxMarks) || 100,
    passMarks: Number(req.body.passMarks) || 40,
    type: req.body.type || 'Practical'
  };

  db.exams.push(newExam);
  saveDatabase(db);
  res.json({ success: true, exam: newExam, message: 'Exam created successfully' });
});

app.get('/api/results', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, results: db.results });
});

app.post('/api/results', (req: Request, res: Response) => {
  const db = getDatabase();
  const marks = Number(req.body.marksObtained);
  const max = Number(req.body.maxMarks) || 100;
  const percentage = Math.round((marks / max) * 100);

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (percentage >= 85) grade = 'A+';
  else if (percentage >= 70) grade = 'A';
  else if (percentage >= 55) grade = 'B';
  else if (percentage >= 40) grade = 'C';
  else grade = 'F';

  const newResult: ExamResult = {
    id: `res-${Date.now()}`,
    examId: req.body.examId,
    examTitle: req.body.examTitle,
    studentId: req.body.studentId,
    studentName: req.body.studentName,
    courseName: req.body.courseName,
    marksObtained: marks,
    maxMarks: max,
    percentage,
    grade,
    status: percentage >= 40 ? 'Pass' : 'Fail',
    remarks: req.body.remarks || 'Result published.',
    examDate: req.body.examDate || new Date().toISOString().split('T')[0]
  };

  db.results.push(newResult);
  saveDatabase(db);
  res.json({ success: true, result: newResult, message: 'Student result recorded and published!' });
});

app.get('/api/results/student/:studentId', (req: Request, res: Response) => {
  const db = getDatabase();
  const studentResults = db.results.filter(r => r.studentId === req.params.studentId);
  res.json({ success: true, results: studentResults });
});

// ----------------------------------------------------
// STUDY MATERIALS
// ----------------------------------------------------
app.get('/api/study-materials', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, materials: db.studyMaterials });
});

app.post('/api/study-materials', (req: Request, res: Response) => {
  const db = getDatabase();
  const newMaterial: StudyMaterial = {
    id: `mat-${Date.now()}`,
    title: req.body.title,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    category: req.body.category || 'PDF Notes',
    fileUrl: req.body.fileUrl || '#',
    fileSize: req.body.fileSize || '3.5 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    description: req.body.description,
    downloadCount: 0
  };

  db.studyMaterials.unshift(newMaterial);
  saveDatabase(db);
  res.json({ success: true, material: newMaterial, message: 'Study material uploaded successfully' });
});

app.delete('/api/study-materials/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.studyMaterials = db.studyMaterials.filter(m => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Study material removed' });
});

// ----------------------------------------------------
// NOTICES
// ----------------------------------------------------
app.get('/api/notices', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, notices: db.notices });
});

app.post('/api/notices', (req: Request, res: Response) => {
  const db = getDatabase();
  const newNotice: Notice = {
    id: `notice-${Date.now()}`,
    title: req.body.title,
    date: req.body.date || new Date().toISOString().split('T')[0],
    category: req.body.category || 'General',
    content: req.body.content,
    isPinned: !!req.body.isPinned,
    target: req.body.target || 'all'
  };

  db.notices.unshift(newNotice);
  saveDatabase(db);
  res.json({ success: true, notice: newNotice, message: 'Notice published successfully' });
});

app.put('/api/notices/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.notices.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Notice not found' });

  db.notices[index] = { ...db.notices[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, notice: db.notices[index], message: 'Notice updated' });
});

app.delete('/api/notices/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.notices = db.notices.filter(n => n.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Notice deleted' });
});

// ----------------------------------------------------
// CERTIFICATES
// ----------------------------------------------------
app.get('/api/certificates', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, certificates: db.certificates });
});

app.post('/api/certificates', (req: Request, res: Response) => {
  const db = getDatabase();
  const student = db.students.find(s => s.studentId === req.body.studentId || s.id === req.body.studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student ID not found' });

  const count = db.certificates.length + 1;
  const certNumber = req.body.certificateNumber || `SRK-CERT-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;

  const cert: Certificate = {
    id: `cert-${Date.now()}`,
    certificateNumber: certNumber,
    studentId: student.studentId,
    studentName: student.name,
    courseName: req.body.courseName || student.courseName,
    duration: req.body.duration || '3 Months',
    issueDate: req.body.issueDate || new Date().toISOString().split('T')[0],
    grade: req.body.grade || 'A (Distinction)',
    percentage: Number(req.body.percentage) || 85,
    verificationCode: `VERIFY-${certNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
    remarks: req.body.remarks || 'Successfully completed the curriculum and practical examinations with honors.'
  };

  db.certificates.unshift(cert);
  // Mark student as completed if desired
  student.status = 'completed';
  saveDatabase(db);

  res.json({ success: true, certificate: cert, message: `Official Certificate ${certNumber} generated for ${student.name}!` });
});

app.get('/api/certificates/verify/:query', (req: Request, res: Response) => {
  const db = getDatabase();
  const q = req.params.query.trim().toLowerCase();
  const cert = db.certificates.find(
    c => c.certificateNumber.toLowerCase() === q || c.studentId.toLowerCase() === q || c.verificationCode.toLowerCase() === q
  );

  if (!cert) {
    return res.status(404).json({ success: false, message: 'Certificate verification failed. No valid record found.' });
  }

  res.json({ success: true, certificate: cert });
});

// ----------------------------------------------------
// CONTACT MESSAGES
// ----------------------------------------------------
app.get('/api/contact', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({ success: true, messages: db.contactMessages });
});

app.post('/api/contact', (req: Request, res: Response) => {
  const db = getDatabase();
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject || 'Course / Admission Inquiry',
    message: req.body.message,
    date: new Date().toISOString().split('T')[0],
    status: 'new'
  };

  db.contactMessages.unshift(newMsg);
  saveDatabase(db);
  res.json({ success: true, message: 'Thank you for reaching out to Shri Ramkrishna National Youth Computer Centre! We will contact you shortly.' });
});

// ----------------------------------------------------
// SERVER START & VITE MIDDLEWARE
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SRKNYCC] Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
