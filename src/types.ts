export type UserRole = 'admin' | 'student' | 'guest';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
  title?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. SRKNYCC-2026-0001
  name: string;
  parentName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  address: string;
  qualification: string;
  courseId: string;
  courseName: string;
  batch: string; // e.g. Morning (08:00 AM - 10:00 AM)
  admissionDate: string;
  photoUrl: string;
  idProofUrl?: string;
  signatureUrl?: string;
  status: 'active' | 'completed' | 'dropped';
  password?: string;
  totalFee: number;
  paidFee: number;
  dueFee: number;
}

export interface AdmissionApplication {
  id: string;
  applicationId: string; // e.g. APP-2026-1042
  studentName: string;
  parentName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  address: string;
  qualification: string;
  courseId: string;
  courseName: string;
  preferredBatch: string;
  photoUrl: string;
  idProofUrl?: string;
  signatureUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  assignedStudentId?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  duration: string;
  durationMonths: number;
  fee: number;
  overview: string;
  topics: string[];
  eligibility: string;
  certificateInfo: string;
  level: string;
  icon: string;
  popular?: boolean;
  badges: string[];
}

export interface FeePayment {
  id: string;
  receiptNumber: string; // e.g. REC-2026-0891
  studentId: string;
  studentName: string;
  courseName: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Debit Card' | 'Net Banking' | 'Cheque';
  transactionId?: string;
  remarks?: string;
  collectedBy: string;
  balanceRemaining: number;
}

export interface AttendanceStudentEntry {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy?: 'admin' | 'self-geo' | 'manual';
  timestamp?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    distanceMeters?: number;
    isWithinGeofence?: boolean;
  };
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  batch: string;
  courseId: string;
  records: AttendanceStudentEntry[];
}

export interface CenterLocationConfig {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number; // e.g. 500 meters
  enableGeoAttendance: boolean;
}

export interface Exam {
  id: string;
  examCode: string;
  title: string;
  courseId: string;
  courseName: string;
  date: string;
  maxMarks: number;
  passMarks: number;
  type: 'Theory' | 'Practical' | 'Viva' | 'Combined';
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  courseName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Pass' | 'Fail';
  remarks?: string;
  examDate: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  category: 'PDF Notes' | 'Assignment' | 'Syllabus' | 'Practical File' | 'Question Bank';
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  description: string;
  downloadCount: number;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Admission' | 'Exam' | 'Holiday' | 'General' | 'Workshop';
  content: string;
  isPinned: boolean;
  target: 'all' | 'students' | 'public';
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. SRK-CERT-2026-0045
  studentId: string;
  studentName: string;
  courseName: string;
  duration: string;
  issueDate: string;
  grade: string;
  percentage: number;
  verificationCode: string;
  qrData?: string;
  remarks?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface DashboardStats {
  totalStudents: number;
  newAdmissions: number;
  activeStudents: number;
  completedCourses: number;
  pendingApplications: number;
  totalFeesCollected: number;
  totalFeesDue: number;
}
