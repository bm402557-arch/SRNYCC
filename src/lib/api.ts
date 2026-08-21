import { 
  AdminUser, Student, AdmissionApplication, Course, FeePayment, 
  AttendanceRecord, AttendanceStudentEntry, Exam, ExamResult, StudyMaterial, Notice, 
  Certificate, ContactMessage, DashboardStats, CenterLocationConfig 
} from '../types';

const BASE_URL = '/api';

export const api = {
  // Auth
  async login(role: 'admin' | 'student', usernameOrId: string, password?: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, usernameOrId, password })
    });
    return res.json();
  },

  // Stats
  async getStats(): Promise<{ success: boolean; stats: DashboardStats }> {
    const res = await fetch(`${BASE_URL}/stats`);
    return res.json();
  },

  // Center Location & Geofence
  async getCenterLocation(): Promise<{ success: boolean; centerLocation: CenterLocationConfig }> {
    const res = await fetch(`${BASE_URL}/center-location`);
    return res.json();
  },
  async updateCenterLocation(data: Partial<CenterLocationConfig>): Promise<{ success: boolean; centerLocation: CenterLocationConfig; message: string }> {
    const res = await fetch(`${BASE_URL}/center-location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Courses
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    const res = await fetch(`${BASE_URL}/courses`);
    return res.json();
  },
  async createCourse(data: Partial<Course>): Promise<{ success: boolean; course: Course; message: string }> {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateCourse(id: string, data: Partial<Course>) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteCourse(id: string) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Admissions
  async submitAdmission(data: Partial<AdmissionApplication>): Promise<{ success: boolean; application: AdmissionApplication; message: string }> {
    const res = await fetch(`${BASE_URL}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getAdmissions(): Promise<{ success: boolean; applications: AdmissionApplication[] }> {
    const res = await fetch(`${BASE_URL}/admissions`);
    return res.json();
  },
  async trackApplication(query: string): Promise<{ success: boolean; application?: AdmissionApplication; message?: string }> {
    const res = await fetch(`${BASE_URL}/admissions/track/${encodeURIComponent(query)}`);
    return res.json();
  },
  async updateAdmissionStatus(id: string, payload: { status: 'approved' | 'rejected' | 'pending'; remarks?: string; batch?: string; feePaid?: number; totalFee?: number }) {
    const res = await fetch(`${BASE_URL}/admissions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Students
  async getStudents(): Promise<{ success: boolean; students: Student[] }> {
    const res = await fetch(`${BASE_URL}/students`);
    return res.json();
  },
  async getStudent(id: string): Promise<{ success: boolean; student: Student }> {
    const res = await fetch(`${BASE_URL}/students/${id}`);
    return res.json();
  },
  async createStudent(data: Partial<Student>): Promise<{ success: boolean; student: Student; message: string }> {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateStudent(id: string, data: Partial<Student>): Promise<{ success: boolean; student: Student; message: string }> {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteStudent(id: string) {
    const res = await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Fees
  async getFees(): Promise<{ success: boolean; fees: FeePayment[] }> {
    const res = await fetch(`${BASE_URL}/fees`);
    return res.json();
  },
  async recordFee(payload: { studentId: string; amount: number; paymentMode: string; transactionId?: string; remarks?: string; collectedBy?: string }) {
    const res = await fetch(`${BASE_URL}/fees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async getStudentFees(studentId: string): Promise<{ success: boolean; payments: FeePayment[]; student?: Student }> {
    const res = await fetch(`${BASE_URL}/fees/student/${encodeURIComponent(studentId)}`);
    return res.json();
  },

  // Attendance
  async getAttendance(): Promise<{ success: boolean; attendance: AttendanceRecord[] }> {
    const res = await fetch(`${BASE_URL}/attendance`);
    return res.json();
  },
  async saveAttendance(payload: { date: string; batch: string; courseId: string; records: { studentId: string; studentName: string; status: 'present' | 'absent' | 'late' | 'excused' }[] }) {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async markStudentAttendance(payload: { studentId: string; date?: string; status: 'present' | 'absent' | 'late' | 'excused'; batch?: string; remarks?: string }) {
    const res = await fetch(`${BASE_URL}/attendance/mark-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async selfMarkAttendance(payload: { studentId: string; latitude: number; longitude: number; accuracy?: number; remarks?: string; forceOverride?: boolean }): Promise<{
    success: boolean;
    message: string;
    isOutOfRange?: boolean;
    distanceMeters?: number;
    allowedRadius?: number;
    entry?: AttendanceStudentEntry;
    date?: string;
  }> {
    const res = await fetch(`${BASE_URL}/attendance/self-mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async getStudentAttendance(studentId: string) {
    const res = await fetch(`${BASE_URL}/attendance/student/${encodeURIComponent(studentId)}`);
    return res.json();
  },

  // Exams & Results
  async getExams(): Promise<{ success: boolean; exams: Exam[] }> {
    const res = await fetch(`${BASE_URL}/exams`);
    return res.json();
  },
  async createExam(data: Partial<Exam>): Promise<{ success: boolean; exam: Exam; message: string }> {
    const res = await fetch(`${BASE_URL}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getResults(): Promise<{ success: boolean; results: ExamResult[] }> {
    const res = await fetch(`${BASE_URL}/results`);
    return res.json();
  },
  async recordResult(data: Partial<ExamResult>) {
    const res = await fetch(`${BASE_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getStudentResults(studentId: string): Promise<{ success: boolean; results: ExamResult[] }> {
    const res = await fetch(`${BASE_URL}/results/student/${encodeURIComponent(studentId)}`);
    return res.json();
  },

  // Study Materials
  async getStudyMaterials(): Promise<{ success: boolean; materials: StudyMaterial[] }> {
    const res = await fetch(`${BASE_URL}/study-materials`);
    return res.json();
  },
  async uploadStudyMaterial(data: Partial<StudyMaterial>) {
    const res = await fetch(`${BASE_URL}/study-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteStudyMaterial(id: string) {
    const res = await fetch(`${BASE_URL}/study-materials/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Notices
  async getNotices(): Promise<{ success: boolean; notices: Notice[] }> {
    const res = await fetch(`${BASE_URL}/notices`);
    return res.json();
  },
  async createNotice(data: Partial<Notice>) {
    const res = await fetch(`${BASE_URL}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateNotice(id: string, data: Partial<Notice>) {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteNotice(id: string) {
    const res = await fetch(`${BASE_URL}/notices/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Student Portal
  async getStudentPortalData(studentId: string): Promise<{
    success: boolean;
    student?: Student;
    fees?: FeePayment[];
    attendance?: any[];
    todayAttendance?: AttendanceStudentEntry | null;
    centerLocation?: CenterLocationConfig;
    results?: ExamResult[];
    materials?: StudyMaterial[];
    notices?: Notice[];
    certificates?: Certificate[];
    message?: string;
  }> {
    const res = await fetch(`${BASE_URL}/student/dashboard/${encodeURIComponent(studentId)}`);
    return res.json();
  },

  // Certificates
  async getCertificates(): Promise<{ success: boolean; certificates: Certificate[] }> {
    const res = await fetch(`${BASE_URL}/certificates`);
    return res.json();
  },
  async issueCertificate(data: Partial<Certificate>) {
    const res = await fetch(`${BASE_URL}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async verifyCertificate(query: string): Promise<{ success: boolean; certificate?: Certificate; message?: string }> {
    const res = await fetch(`${BASE_URL}/certificates/verify/${encodeURIComponent(query)}`);
    return res.json();
  },

  // Contact
  async sendContactMessage(data: Partial<ContactMessage>) {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getContactMessages(): Promise<{ success: boolean; messages: ContactMessage[] }> {
    const res = await fetch(`${BASE_URL}/contact`);
    return res.json();
  }
};
