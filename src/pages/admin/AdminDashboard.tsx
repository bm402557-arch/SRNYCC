import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileText, BookOpen, IndianRupee, 
  CheckSquare, Award, FileUp, Bell, MessageSquare, Plus, 
  Search, Edit, Trash2, CheckCircle2, XCircle, Printer, 
  Eye, RefreshCw, KeyRound, Download, ShieldCheck, Filter, 
  Calendar, Check, AlertCircle, X, ChevronRight, UserPlus, 
  CreditCard, GraduationCap, IdCard, Navigation, MapPin, 
  Settings2, Compass, Radio, Sliders, Clock
} from 'lucide-react';
import { 
  Student, AdmissionApplication, Course, FeePayment, 
  AttendanceRecord, Exam, ExamResult, StudyMaterial, Notice, 
  Certificate, ContactMessage, DashboardStats, CenterLocationConfig, 
  AttendanceStudentEntry 
} from '../../types';
import { api } from '../../lib/api';
import { StudentIdCardModal } from '../../components/StudentIdCardModal';
import { printElement } from '../../lib/printUtils';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'admissions' | 'courses' | 'fees' | 
    'attendance' | 'exams' | 'materials' | 'notices' | 'certificates' | 'messages'
  >('overview');

  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [centerLocation, setCenterLocation] = useState<CenterLocationConfig | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Modals & Active Selections
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeePayment | null>(null);
  const [selectedCertForPrint, setSelectedCertForPrint] = useState<Certificate | null>(null);
  
  // Forms Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [showApproveAppModal, setShowApproveAppModal] = useState<AdmissionApplication | null>(null);

  // Attendance states
  const [attSubTab, setAttSubTab] = useState<'batch' | 'live-logs' | 'geofence'>('batch');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attBatch, setAttBatch] = useState('Morning (08:00 AM - 10:00 AM)');
  const [attRecords, setAttRecords] = useState<{ [studentId: string]: 'present' | 'absent' | 'late' | 'excused' }>({});
  const [geoEditConfig, setGeoEditConfig] = useState<Partial<CenterLocationConfig>>({});
  const [savingCenterLoc, setSavingCenterLoc] = useState(false);

  // Search terms
  const [studentSearch, setStudentSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [feeSearch, setFeeSearch] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, studentsRes, appsRes, coursesRes, feesRes, 
        attRes, examsRes, resRes, matRes, notRes, certRes, msgRes, centerRes
      ] = await Promise.all([
        api.getStats(),
        api.getStudents(),
        api.getAdmissions(),
        api.getCourses(),
        api.getFees(),
        api.getAttendance(),
        api.getExams(),
        api.getResults(),
        api.getStudyMaterials(),
        api.getNotices(),
        api.getCertificates(),
        api.getContactMessages(),
        api.getCenterLocation()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (studentsRes.success) setStudents(studentsRes.students);
      if (appsRes.success) setApplications(appsRes.applications);
      if (coursesRes.success) setCourses(coursesRes.courses);
      if (feesRes.success) setFees(feesRes.fees);
      if (attRes.success) setAttendance(attRes.attendance);
      if (centerRes.success) {
        setCenterLocation(centerRes.centerLocation);
        setGeoEditConfig(centerRes.centerLocation);
      }
      if (examsRes.success) setExams(examsRes.exams);
      if (resRes.success) setResults(resRes.results);
      if (matRes.success) setStudyMaterials(matRes.materials);
      if (notRes.success) setNotices(notRes.notices);
      if (certRes.success) setCertificates(certRes.certificates);
      if (msgRes.success) setMessages(msgRes.messages);
    } catch (e) {
      console.error('Error loading admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Filtered lists
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.mobile.includes(studentSearch) ||
    s.courseName.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredApps = applications.filter(a => 
    a.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.applicationId.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.mobile.includes(appSearch)
  );

  const filteredFees = fees.filter(f => 
    f.studentName.toLowerCase().includes(feeSearch.toLowerCase()) ||
    f.studentId.toLowerCase().includes(feeSearch.toLowerCase()) ||
    f.receiptNumber.toLowerCase().includes(feeSearch.toLowerCase())
  );

  // Quick Action Handlers
  const handleApproveApplication = async (app: AdmissionApplication, batch: string, feePaid: number) => {
    const res = await api.updateAdmissionStatus(app.id, {
      status: 'approved',
      batch,
      feePaid,
      remarks: 'Application verified and student account created.'
    });

    if (res.success) {
      showNotification(`Application approved! Student ID ${res.student?.studentId || 'generated'} created.`);
      setShowApproveAppModal(null);
      loadAllAdminData();
    }
  };

  const handleRejectApplication = async (id: string) => {
    const remarks = prompt('Enter reason for rejection (optional):', 'Incomplete documents or criteria not met');
    if (remarks !== null) {
      const res = await api.updateAdmissionStatus(id, { status: 'rejected', remarks });
      if (res.success) {
        showNotification('Application marked as rejected.');
        loadAllAdminData();
      }
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove student "${name}"?`)) {
      const res = await api.deleteStudent(id);
      if (res.success) {
        showNotification(`Student "${name}" removed.`);
        loadAllAdminData();
      }
    }
  };

  const handleSaveAttendance = async () => {
    const activeBatchStudents = students.filter(s => s.status === 'active');
    const records = activeBatchStudents.map(s => ({
      studentId: s.studentId,
      studentName: s.name,
      status: attRecords[s.studentId] || 'present'
    }));

    const res = await api.saveAttendance({
      date: attDate,
      batch: attBatch,
      courseId: 'all',
      records
    });

    if (res.success) {
      showNotification(`Attendance saved for ${records.length} students on ${attDate}.`);
      loadAllAdminData();
    }
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'late' | 'excused') => {
    const newRecords: { [id: string]: 'present' | 'absent' | 'late' | 'excused' } = {};
    students.filter(s => s.status === 'active').forEach(s => {
      newRecords[s.studentId] = status;
    });
    setAttRecords(newRecords);
    showNotification(`All batch students marked as ${status.toUpperCase()}. Click "Save Batch Attendance" to commit.`);
  };

  const handleMarkSingleStudent = async (studentId: string, status: 'present' | 'absent' | 'late' | 'excused', remarks?: string) => {
    const res = await api.markStudentAttendance({
      studentId,
      date: attDate,
      batch: attBatch,
      status,
      remarks: remarks || `Marked by Admin (${status.toUpperCase()})`
    });

    if (res.success) {
      setAttRecords(prev => ({ ...prev, [studentId]: status }));
      showNotification(res.message || `Student attendance updated to ${status.toUpperCase()}.`);
      loadAllAdminData();
    }
  };

  const handleSaveCenterConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCenterLoc(true);
    try {
      const res = await api.updateCenterLocation(geoEditConfig);
      if (res.success) {
        setCenterLocation(res.centerLocation);
        showNotification('Center GPS coordinates & geofence perimeter updated successfully!');
      } else {
        alert(res.message || 'Failed to update center location.');
      }
    } catch (err) {
      console.error('Error saving center config', err);
      alert('Failed to update center location.');
    } finally {
      setSavingCenterLoc(false);
    }
  };

  const handleUseCurrentLocationForCenter = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoEditConfig(prev => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6))
        }));
        showNotification('Current GPS coordinates captured! Click Save to apply.');
      },
      (err) => {
        alert(`Could not fetch current coordinates: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleResetPassword = async (student: Student) => {
    const newPass = prompt(`Enter new password for ${student.name} (${student.studentId}):`, 'student123');
    if (newPass) {
      const res = await api.updateStudent(student.id, { password: newPass });
      if (res.success) {
        showNotification(`Password for ${student.name} updated to "${newPass}".`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Administration Console</span>
                <h1 className="text-lg font-bold uppercase">SHRI RAMKRISHNA NYCC MANAGEMENT</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadAllAdminData}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
              <div className="px-3 py-1.5 bg-blue-950 border border-blue-800 text-blue-300 rounded-lg text-xs font-medium">
                Admin: Director Desk
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pt-4 mt-2 border-t border-slate-800 text-xs scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'students', label: `Students (${students.length})`, icon: Users },
              { id: 'admissions', label: `Admissions (${applications.filter(a => a.status === 'pending').length} Pending)`, icon: FileText },
              { id: 'fees', label: 'Fees & Receipts', icon: IndianRupee },
              { id: 'attendance', label: 'Attendance', icon: CheckSquare },
              { id: 'exams', label: 'Exams & Results', icon: Award },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
              { id: 'materials', label: 'Study Materials', icon: FileUp },
              { id: 'notices', label: 'Notices', icon: Bell },
              { id: 'messages', label: `Inquiries (${messages.length})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {actionSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in no-print">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="p-1 hover:bg-emerald-700 rounded-lg">✕</button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. OVERVIEW DASHBOARD                                    */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Total Enrolled</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {students.length}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span>{students.filter(s => s.status === 'active').length} Active Students</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Pending Admissions</span>
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="text-[11px] text-blue-700 font-bold hover:underline"
                >
                  Review Applications &rarr;
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Fees Collected</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  ₹{(stats?.totalFeesCollected || fees.reduce((acc, f) => acc + f.amount, 0)).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {fees.length} Total Receipts
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Total Fees Due</span>
                  <IndianRupee className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                  ₹{(students.reduce((acc, s) => acc + s.dueFee, 0)).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  From {students.filter(s => s.dueFee > 0).length} pending accounts
                </div>
              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Administrative Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  id="admin-quick-add-student"
                  onClick={() => setShowAddStudentModal(true)}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-colors flex flex-col justify-between"
                >
                  <UserPlus className="w-5 h-5 text-blue-700 mb-2" />
                  <span className="text-xs font-bold text-blue-950">Add New Student</span>
                </button>

                <button
                  id="admin-quick-record-fee"
                  onClick={() => setShowAddFeeModal(true)}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors flex flex-col justify-between"
                >
                  <CreditCard className="w-5 h-5 text-emerald-700 mb-2" />
                  <span className="text-xs font-bold text-emerald-950">Collect Fee / Receipt</span>
                </button>

                <button
                  id="admin-quick-mark-attendance"
                  onClick={() => setActiveTab('attendance')}
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-colors flex flex-col justify-between"
                >
                  <CheckSquare className="w-5 h-5 text-purple-700 mb-2" />
                  <span className="text-xs font-bold text-purple-950">Mark Batch Attendance</span>
                </button>

                <button
                  id="admin-quick-issue-certificate"
                  onClick={() => setShowIssueCertModal(true)}
                  className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-colors flex flex-col justify-between"
                >
                  <Award className="w-5 h-5 text-amber-700 mb-2" />
                  <span className="text-xs font-bold text-amber-950">Issue Certificate</span>
                </button>
              </div>
            </div>

            {/* Two Column Layout: Recent Applications & Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Applications */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm uppercase">
                    Recent Admission Applications
                  </h3>
                  <button onClick={() => setActiveTab('admissions')} className="text-xs text-blue-700 font-bold hover:underline">
                    View All ({applications.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{app.studentName}</strong>
                        <span className="text-slate-500">{app.courseName} • {app.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                        {app.status === 'pending' && (
                          <button
                            onClick={() => setShowApproveAppModal(app)}
                            className="px-2.5 py-1 bg-blue-900 text-white rounded-lg text-[11px] font-bold hover:bg-blue-950"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Fee Payments */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm uppercase">
                    Recent Fee Transactions
                  </h3>
                  <button onClick={() => setActiveTab('fees')} className="text-xs text-blue-700 font-bold hover:underline">
                    View All ({fees.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {fees.slice(0, 4).map((fee) => (
                    <div key={fee.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{fee.studentName} ({fee.studentId})</div>
                        <span className="text-slate-500">{fee.receiptNumber} • {fee.paymentDate} • {fee.paymentMode}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-700 text-sm">₹{fee.amount}</div>
                        <button
                          onClick={() => setSelectedReceiptForPrint(fee)}
                          className="text-[11px] text-blue-700 hover:underline font-medium"
                        >
                          Print Slip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. STUDENT MANAGEMENT                                    */}
        {/* ======================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student by Name, Student ID, Mobile, Course..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                id="add-student-btn"
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student Manually</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Student ID & Photo</th>
                      <th className="p-3.5">Student Name & Contact</th>
                      <th className="p-3.5">Enrolled Course</th>
                      <th className="p-3.5">Batch</th>
                      <th className="p-3.5">Fee Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={s.photoUrl}
                              alt={s.name}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <strong className="text-blue-900 font-mono block">{s.studentId}</strong>
                              <span className="text-[10px] text-slate-500">Adm: {s.admissionDate}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-slate-500 text-[11px]">{s.mobile} • {s.gender}</div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-medium text-slate-800">{s.courseName}</span>
                        </td>

                        <td className="p-3.5 text-slate-600">
                          {s.batch}
                        </td>

                        <td className="p-3.5">
                          <div className="text-[11px]">
                            <span className="text-slate-600">Paid: ₹{s.paidFee}</span>
                            {s.dueFee > 0 ? (
                              <span className="block text-rose-600 font-bold">Due: ₹{s.dueFee}</span>
                            ) : (
                              <span className="block text-emerald-600 font-bold">Paid Full</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForIdCard(s)}
                              title="Print Plastic ID Card"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            >
                              <IdCard className="w-3.5 h-3.5 text-blue-700" />
                            </button>

                            <button
                              onClick={() => setSelectedStudentForProfile(s)}
                              title="View Full Profile"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleResetPassword(s)}
                              title="Reset Password"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              title="Delete Student"
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. ADMISSION MANAGEMENT                                  */}
        {/* ======================================================== */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search by Applicant Name, Application ID, Mobile..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="text-xs text-slate-500">
                Total: <strong>{applications.length}</strong> | Pending: <strong className="text-amber-600">{applications.filter(a => a.status === 'pending').length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.photoUrl}
                        alt={app.studentName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] text-amber-700 font-bold uppercase">{app.applicationId}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{app.studentName}</h4>
                        <span className="text-[11px] text-slate-500">{app.mobile}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-500 block">Course:</span>
                      <strong className="text-blue-900">{app.courseName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Batch:</span>
                      <span>{app.preferredBatch}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Qualification:</span>
                      <span>{app.qualification}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Parent Name:</span>
                      <span>{app.parentName}</span>
                    </div>
                  </div>

                  {app.assignedStudentId && (
                    <div className="text-xs text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg">
                      Generated Student ID: {app.assignedStudentId}
                    </div>
                  )}

                  {/* Actions */}
                  {app.status === 'pending' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setShowApproveAppModal(app)}
                        className="flex-1 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Approve & Generate ID</span>
                      </button>

                      <button
                        onClick={() => handleRejectApplication(app.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold border border-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">
                      Remarks: {app.remarks || 'No remarks recorded.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. FEES & PAYMENTS MANAGEMENT                            */}
        {/* ======================================================== */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={feeSearch}
                  onChange={(e) => setFeeSearch(e.target.value)}
                  placeholder="Search receipts by Receipt No, Student Name, Student ID..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                id="record-fee-btn"
                onClick={() => setShowAddFeeModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Record Fee Payment</span>
              </button>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Receipt No & Date</th>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Course</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">Mode</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-blue-900 block font-mono">{fee.receiptNumber}</strong>
                        <span className="text-[10px] text-slate-500">{fee.paymentDate}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{fee.studentName}</div>
                        <span className="text-slate-500 font-mono text-[11px]">{fee.studentId}</span>
                      </td>
                      <td className="p-3.5 text-slate-700">{fee.courseName}</td>
                      <td className="p-3.5 font-extrabold text-emerald-700 text-sm">₹{fee.amount}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {fee.paymentMode}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedReceiptForPrint(fee)}
                          className="px-3 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. ATTENDANCE MANAGEMENT & CAMPUS GEOFENCE               */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            
            {/* Top Attendance Navigation & Subtabs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">
                    Campus Attendance & Geofencing Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage daily batch attendance, review live student GPS check-ins, and configure laboratory geofence boundaries.
                  </p>
                </div>
              </div>

              {/* Subtabs switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
                <button
                  onClick={() => setAttSubTab('batch')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    attSubTab === 'batch'
                      ? 'bg-white text-blue-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Batch Marker</span>
                </button>

                <button
                  onClick={() => setAttSubTab('live-logs')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    attSubTab === 'live-logs'
                      ? 'bg-white text-blue-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Live GPS Logs</span>
                </button>

                <button
                  onClick={() => setAttSubTab('geofence')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    attSubTab === 'geofence'
                      ? 'bg-white text-blue-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Campus Geofence</span>
                </button>
              </div>
            </div>

            {/* 5A. SUBTAB: BATCH ATTENDANCE MARKER */}
            {attSubTab === 'batch' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm uppercase">
                        Batch Attendance Marker
                      </h4>
                      <p className="text-xs text-slate-500">
                        Mark and commit daily attendance for students in the selected batch.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkAll('present')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200"
                      >
                        ✓ Mark All Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkAll('absent')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200"
                      >
                        ✕ Mark All Absent
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAttendance}
                        className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-98"
                      >
                        <Check className="w-4 h-4 text-amber-400" />
                        <span>Save Batch Attendance</span>
                      </button>
                    </div>
                  </div>

                  {/* Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Attendance Date</label>
                      <input
                        type="date"
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Batch</label>
                      <select
                        value={attBatch}
                        onChange={(e) => setAttBatch(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
                      >
                        <option value="Morning (08:00 AM - 10:00 AM)">Morning (08:00 AM - 10:00 AM)</option>
                        <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                        <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                        <option value="Weekend Batch (Saturday - Sunday 10:00 AM)">Weekend Batch (Saturday - Sunday 10:00 AM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Attendance Marking Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Course</th>
                        <th className="p-3.5">Today's Check-in Feed</th>
                        <th className="p-3.5 text-center">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.filter(s => s.status === 'active').map((student) => {
                        const currentStatus = attRecords[student.studentId] || 'present';

                        // Check if student has attendance record for today in DB
                        const matchingRecord = attendance.find(a => a.date === attDate);
                        const studentEntry = matchingRecord?.records.find(r => r.studentId === student.studentId);

                        return (
                          <tr key={student.id} className="hover:bg-slate-50">
                            <td className="p-3.5">
                              <strong className="text-slate-900 block">{student.name}</strong>
                              <span className="text-slate-500 font-mono text-[10px]">{student.studentId}</span>
                            </td>
                            <td className="p-3.5 text-slate-700">{student.courseName}</td>
                            <td className="p-3.5">
                              {studentEntry ? (
                                <div className="space-y-0.5">
                                  {studentEntry.markedBy === 'self-geo' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[10px] border border-blue-200">
                                      <Navigation className="w-3 h-3 text-blue-600" />
                                      <span>GPS Self-Marked ({studentEntry.timestamp || 'Today'})</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">
                                      <ShieldCheck className="w-3 h-3 text-slate-500" />
                                      <span>Admin Recorded</span>
                                    </span>
                                  )}
                                  {studentEntry.location?.distanceMeters !== undefined && (
                                    <span className="text-[10px] text-slate-500 block">
                                      Distance: {studentEntry.location.distanceMeters}m from center
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Not marked yet</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex justify-center gap-1.5">
                                {(['present', 'absent', 'late', 'excused'] as const).map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleMarkSingleStudent(student.studentId, st)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                      (studentEntry?.status === st || currentStatus === st)
                                        ? st === 'present' ? 'bg-emerald-600 text-white shadow-xs' :
                                          st === 'absent' ? 'bg-rose-600 text-white shadow-xs' :
                                          st === 'late' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5B. SUBTAB: LIVE GPS ATTENDANCE LOGS */}
            {attSubTab === 'live-logs' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                      <Radio className="w-4 h-4 text-rose-500" />
                      <span>Live Real-Time GPS Check-In Stream</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Audit trail of student self-attendance check-ins with exact latitude, longitude, and lab proximity distance.
                    </p>
                  </div>
                  <button
                    onClick={loadAllAdminData}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Stream</span>
                  </button>
                </div>

                {attendance.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500">
                    No attendance session records found in the database.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                        <tr>
                          <th className="p-3.5">Date & Time</th>
                          <th className="p-3.5">Student ID & Name</th>
                          <th className="p-3.5">Batch</th>
                          <th className="p-3.5">GPS Proximity & Location</th>
                          <th className="p-3.5">Verification Mode</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendance.flatMap(att => 
                          att.records.map((r, idx) => ({ ...r, date: att.date, batch: att.batch, uid: `${att.id}-${idx}` }))
                        ).map((record) => (
                          <tr key={record.uid} className="hover:bg-slate-50/80">
                            <td className="p-3.5 font-mono text-slate-800">
                              <div><strong>{record.date}</strong></div>
                              <div className="text-[10px] text-slate-500">{record.timestamp || '—'}</div>
                            </td>
                            <td className="p-3.5">
                              <strong className="text-slate-900 block">{record.studentName}</strong>
                              <span className="text-slate-500 font-mono text-[10px]">{record.studentId}</span>
                            </td>
                            <td className="p-3.5 text-slate-600">{record.batch}</td>
                            <td className="p-3.5">
                              {record.location ? (
                                <div className="space-y-0.5 font-mono text-[11px]">
                                  <div className="flex items-center gap-1.5 text-blue-950 font-bold">
                                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                                    <span>{record.location.distanceMeters}m away</span>
                                    {record.location.isWithinGeofence ? (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-sans font-bold">
                                        Inside Campus
                                      </span>
                                    ) : (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-sans font-bold">
                                        Overridden
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {record.location.latitude.toFixed(5)}°N, {record.location.longitude.toFixed(5)}°E (±{Math.round(record.location.accuracy || 10)}m)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {record.markedBy === 'self-geo' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[10px] border border-blue-200">
                                  <Navigation className="w-3 h-3 text-blue-600" />
                                  <span>Self GPS</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">
                                  <ShieldCheck className="w-3 h-3 text-slate-500" />
                                  <span>Instructor</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                                record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                                record.status === 'absent' ? 'bg-rose-100 text-rose-800' :
                                record.status === 'late' ? 'bg-amber-100 text-amber-900' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 5C. SUBTAB: CAMPUS GEOFENCE SETTINGS */}
            {attSubTab === 'geofence' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-blue-900" />
                      <span>Institute Geofence Perimeter Configuration</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Configure the exact GPS latitude, longitude, and allowed proximity radius for student attendance verification.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCenterConfig} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Campus / Center Name
                      </label>
                      <input
                        type="text"
                        value={geoEditConfig.name || ''}
                        onChange={(e) => setGeoEditConfig(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
                        placeholder="e.g. Shri Ramkrishna National Youth Computer Centre Main Campus"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Campus Physical Address
                      </label>
                      <input
                        type="text"
                        value={geoEditConfig.address || ''}
                        onChange={(e) => setGeoEditConfig(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                        placeholder="e.g. Vivekananda Sarani, Central Road, Kolkata - 700001"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Center Latitude (°N)
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">Decimal Degrees</span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={geoEditConfig.latitude ?? 22.572646}
                        onChange={(e) => setGeoEditConfig(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Center Longitude (°E)
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">Decimal Degrees</span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={geoEditConfig.longitude ?? 88.363895}
                        onChange={(e) => setGeoEditConfig(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Allowed Attendance Radius: {geoEditConfig.allowedRadiusMeters || 500} Meters
                        </label>
                        <span className="text-[11px] font-bold text-blue-900">
                          {((geoEditConfig.allowedRadiusMeters || 500) / 1000).toFixed(2)} km radius
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="25"
                        value={geoEditConfig.allowedRadiusMeters || 500}
                        onChange={(e) => setGeoEditConfig(prev => ({ ...prev, allowedRadiusMeters: parseInt(e.target.value) }))}
                        className="w-full accent-blue-900"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>50m (Lab Room Only)</span>
                        <span>250m (Building)</span>
                        <span>500m (Campus Zone)</span>
                        <span>1000m (Wider Perimeter)</span>
                        <span>2000m (City Area)</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <strong className="block text-xs font-bold text-slate-900">
                          Enforce GPS Geofencing for Student Attendance
                        </strong>
                        <p className="text-[11px] text-slate-500">
                          When active, students outside the permitted radius cannot mark attendance unless overridden.
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={geoEditConfig.enableGeoAttendance ?? true}
                          onChange={(e) => setGeoEditConfig(prev => ({ ...prev, enableGeoAttendance: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocationForCenter}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Compass className="w-4 h-4 text-blue-700" />
                      <span>Capture My Current Coordinates Here</span>
                    </button>

                    <button
                      type="submit"
                      disabled={savingCenterLoc}
                      className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
                    >
                      {savingCenterLoc ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-amber-400" />
                          <span>Save Geofence Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* 6. EXAMS & RESULTS                                       */}
        {/* ======================================================== */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm uppercase">
                Examination & Result Management
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddExamModal(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Exam</span>
                </button>
                <button
                  onClick={() => setShowAddResultModal(true)}
                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Student Marks</span>
                </button>
              </div>
            </div>

            {/* Results table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3.5">Exam Title</th>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Marks Obtained</th>
                    <th className="p-3.5">Grade & Status</th>
                    <th className="p-3.5">Exam Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <strong className="text-slate-900 block">{res.examTitle}</strong>
                        <span className="text-[10px] text-slate-500">{res.courseName}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{res.studentName}</div>
                        <span className="text-slate-500 font-mono text-[10px]">{res.studentId}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-blue-900 text-sm">{res.marksObtained}</span> / {res.maxMarks} ({res.percentage}%)
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          res.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          Grade {res.grade} ({res.status})
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{res.examDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. CERTIFICATES                                          */}
        {/* ======================================================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase">Official Certificate Registry</h3>
                <p className="text-xs text-slate-500">ISO 9001:2015 verifiable credentials</p>
              </div>
              <button
                onClick={() => setShowIssueCertModal(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Issue New Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">{cert.certificateNumber}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{cert.studentName}</h4>
                      <span className="text-xs text-slate-500 font-mono">{cert.studentId}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cert.grade}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl space-y-1">
                    <div><strong>Course:</strong> {cert.courseName}</div>
                    <div><strong>Issue Date:</strong> {cert.issueDate}</div>
                    <div><strong>Verification Hash:</strong> <code>{cert.verificationCode}</code></div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedCertForPrint(cert)}
                      className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 8. STUDY MATERIALS                                       */}
        {/* ======================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Digital Study Materials & Notes</h3>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Material</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map((mat) => (
                <div key={mat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                      {mat.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{mat.uploadDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                  <p className="text-xs text-slate-600">{mat.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Course: <strong>{mat.courseName}</strong> ({mat.fileSize})</span>
                    <button
                      onClick={async () => {
                        await api.deleteStudyMaterial(mat.id);
                        loadAllAdminData();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 9. NOTICES                                               */}
        {/* ======================================================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Notice Board Management</h3>
              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-500">{notice.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                  <p className="text-xs text-slate-600">{notice.content}</p>
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        await api.deleteNotice(notice.id);
                        loadAllAdminData();
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete Notice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 10. COURSES MANAGEMENT                                   */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Course Catalog & Fees</h3>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase">{course.code}</span>
                      <h4 className="font-bold text-slate-900 text-base">{course.name}</h4>
                    </div>
                    <span className="text-base font-extrabold text-emerald-700">₹{course.fee}</span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Eligibility:</strong> {course.eligibility}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        const newFee = prompt(`Update fee for ${course.name}:`, course.fee.toString());
                        if (newFee) {
                          api.updateCourse(course.id, { fee: Number(newFee) }).then(() => loadAllAdminData());
                        }
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                    >
                      Edit Fee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 11. CONTACT MESSAGES & INQUIRIES                         */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase bg-white p-4 rounded-2xl border border-slate-200">
              Student & Public Inquiries
            </h3>

            {messages.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No inquiries received yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <strong className="text-slate-900 text-sm">{msg.name}</strong>
                      <span className="text-slate-500 ml-2">({msg.phone} • {msg.email})</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{msg.date}</span>
                  </div>
                  <div className="font-semibold text-blue-900">{msg.subject}</div>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODALS & FORMS                                           */}
      {/* ======================================================== */}

      {/* 1. Add Student Modal */}
      {showAddStudentModal && (
        <AddStudentModal
          courses={courses}
          onClose={() => setShowAddStudentModal(false)}
          onSuccess={() => {
            setShowAddStudentModal(false);
            showNotification('Student added successfully!');
            loadAllAdminData();
          }}
        />
      )}

      {/* 2. Add Fee Modal */}
      {showAddFeeModal && (
        <AddFeeModal
          students={students}
          onClose={() => setShowAddFeeModal(false)}
          onSuccess={(payment) => {
            setShowAddFeeModal(false);
            showNotification(`Payment of ₹${payment.amount} recorded.`);
            setSelectedReceiptForPrint(payment);
            loadAllAdminData();
          }}
        />
      )}

      {/* 3. Approve Admission Application Modal */}
      {showApproveAppModal && (
        <ApproveApplicationModal
          application={showApproveAppModal}
          courses={courses}
          onClose={() => setShowApproveAppModal(null)}
          onApprove={(batch, feePaid) => handleApproveApplication(showApproveAppModal, batch, feePaid)}
        />
      )}

      {/* 4. Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          onPrintIdCard={() => {
            setSelectedStudentForIdCard(selectedStudentForProfile);
            setSelectedStudentForProfile(null);
          }}
        />
      )}

      {/* 5. Printable Plastic Student ID Card Modal */}
      {selectedStudentForIdCard && (
        <StudentIdCardModal
          student={selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
        />
      )}

      {/* 6. Printable Fee Receipt Modal */}
      {selectedReceiptForPrint && (
        <PrintableReceiptModal
          payment={selectedReceiptForPrint}
          onClose={() => setSelectedReceiptForPrint(null)}
        />
      )}

      {/* 7. Printable Certificate Modal */}
      {selectedCertForPrint && (
        <PrintableCertificateModal
          certificate={selectedCertForPrint}
          onClose={() => setSelectedCertForPrint(null)}
        />
      )}

      {/* 8. Create Notice Modal */}
      {showAddNoticeModal && (
        <AddNoticeModal
          onClose={() => setShowAddNoticeModal(false)}
          onSuccess={() => {
            setShowAddNoticeModal(false);
            showNotification('Notice published!');
            loadAllAdminData();
          }}
        />
      )}

      {/* 9. Issue Certificate Modal */}
      {showIssueCertModal && (
        <IssueCertificateModal
          students={students}
          onClose={() => setShowIssueCertModal(false)}
          onSuccess={(cert) => {
            setShowIssueCertModal(false);
            showNotification(`Certificate issued for ${cert.studentName}!`);
            setSelectedCertForPrint(cert);
            loadAllAdminData();
          }}
        />
      )}

      {/* 10. Enter Exam Marks Modal */}
      {showAddResultModal && (
        <EnterResultModal
          students={students}
          exams={exams}
          onClose={() => setShowAddResultModal(false)}
          onSuccess={() => {
            setShowAddResultModal(false);
            showNotification('Student result recorded!');
            loadAllAdminData();
          }}
        />
      )}

      {/* 11. Create Exam Modal */}
      {showAddExamModal && (
        <AddExamModal
          courses={courses}
          onClose={() => setShowAddExamModal(false)}
          onSuccess={() => {
            setShowAddExamModal(false);
            showNotification('Exam schedule created!');
            loadAllAdminData();
          }}
        />
      )}

      {/* 12. Upload Study Material Modal */}
      {showAddMaterialModal && (
        <AddMaterialModal
          courses={courses}
          onClose={() => setShowAddMaterialModal(false)}
          onSuccess={() => {
            setShowAddMaterialModal(false);
            showNotification('Study material uploaded!');
            loadAllAdminData();
          }}
        />
      )}

    </div>
  );
};

// ========================================================
// SUB-MODAL COMPONENTS
// ========================================================

const AddStudentModal: React.FC<{
  courses: Course[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ courses, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [parentName, setParentName] = useState('');
  const [dob, setDob] = useState('2004-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [qualification, setQualification] = useState('Higher Secondary (10+2)');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [batch, setBatch] = useState('Morning (08:00 AM - 10:00 AM)');
  const [paidFee, setPaidFee] = useState<number>(2000);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find(c => c.id === courseId);
    const courseName = selCourse ? selCourse.name : 'Computer Course';
    const totalFee = selCourse ? selCourse.fee : 5000;

    await api.createStudent({
      name,
      parentName,
      dob,
      gender,
      mobile,
      email: email || `${mobile}@srknycc.org`,
      address,
      qualification,
      courseId,
      courseName,
      batch,
      photoUrl,
      totalFee,
      paidFee: Number(paidFee)
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase">Add New Student</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Student Full Name *</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
              <input required type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender *</label>
              <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Course *</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} (₹{c.fee})</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Batch *</label>
            <select value={batch} onChange={e => setBatch(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              <option value="Morning (08:00 AM - 10:00 AM)">Morning (08:00 AM - 10:00 AM)</option>
              <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
              <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
              <option value="Weekend Batch (Saturday - Sunday 10:00 AM)">Weekend Batch</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Initial Admission Down-payment (₹)</label>
            <input type="number" value={paidFee} onChange={e => setPaidFee(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-emerald-800" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Permanent Address</label>
            <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl uppercase tracking-wider">
            Register Student & Issue ID
          </button>
        </form>
      </div>
    </div>
  );
};

const AddFeeModal: React.FC<{
  students: Student[];
  onClose: () => void;
  onSuccess: (payment: FeePayment) => void;
}> = ({ students, onClose, onSuccess }) => {
  const [studentId, setStudentId] = useState(students[0]?.studentId || '');
  const [amount, setAmount] = useState<number>(1500);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('Course Fee Installment');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.recordFee({
      studentId,
      amount: Number(amount),
      paymentMode,
      transactionId,
      remarks,
      collectedBy: 'Academic Head'
    });

    if (res.success && res.payment) {
      onSuccess(res.payment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200">
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase">Record Fee Payment</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Student *</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {students.map(s => (
                <option key={s.id} value={s.studentId}>
                  {s.name} ({s.studentId}) — Due: ₹{s.dueFee}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Payment Amount (₹) *</label>
            <input required type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl text-base font-extrabold text-emerald-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Mode</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Transaction Ref (UPI)</label>
              <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="e.g. UPI8891283" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Remarks</label>
            <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl uppercase">
            Record Payment & Generate Slip
          </button>
        </form>
      </div>
    </div>
  );
};

const ApproveApplicationModal: React.FC<{
  application: AdmissionApplication;
  courses: Course[];
  onClose: () => void;
  onApprove: (batch: string, feePaid: number) => void;
}> = ({ application, courses, onClose, onApprove }) => {
  const [batch, setBatch] = useState(application.preferredBatch);
  const [feePaid, setFeePaid] = useState<number>(2000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200">
        <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase">Approve Admission: {application.studentName}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <div><strong>Applicant:</strong> {application.studentName}</div>
            <div><strong>Course:</strong> {application.courseName}</div>
            <div><strong>Mobile:</strong> {application.mobile}</div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Confirm Batch Allocation</label>
            <select value={batch} onChange={e => setBatch(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              <option value="Morning (08:00 AM - 10:00 AM)">Morning (08:00 AM - 10:00 AM)</option>
              <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
              <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
              <option value="Weekend Batch (Saturday - Sunday 10:00 AM)">Weekend Batch</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Admission Fee Collected (₹)</label>
            <input type="number" value={feePaid} onChange={e => setFeePaid(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-emerald-800" />
          </div>
          <button
            onClick={() => onApprove(batch, feePaid)}
            className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl uppercase flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Generate Student ID & Activate Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentProfileModal: React.FC<{
  student: Student;
  onClose: () => void;
  onPrintIdCard: () => void;
}> = ({ student, onClose, onPrintIdCard }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase">Student Profile Sheet</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center gap-4 border-b pb-4">
            <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-xl object-cover border" referrerPolicy="no-referrer" />
            <div>
              <span className="text-amber-700 font-mono font-bold text-xs">{student.studentId}</span>
              <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
              <span className="text-slate-600 block">{student.courseName}</span>
              <span className="text-slate-500 text-[11px]">Admitted: {student.admissionDate}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div><strong>Father/Mother:</strong> {student.parentName}</div>
            <div><strong>Mobile:</strong> {student.mobile}</div>
            <div><strong>DOB:</strong> {student.dob} ({student.gender})</div>
            <div><strong>Batch:</strong> {student.batch}</div>
            <div><strong>Total Fee:</strong> ₹{student.totalFee}</div>
            <div><strong>Paid Fee:</strong> ₹{student.paidFee} (Due: ₹{student.dueFee})</div>
            <div className="col-span-2"><strong>Address:</strong> {student.address}</div>
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <button onClick={onPrintIdCard} className="flex-1 py-2.5 bg-blue-900 text-white rounded-xl font-bold flex items-center justify-center gap-1.5">
              <IdCard className="w-4 h-4 text-amber-400" />
              <span>Print Student ID Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintableReceiptModal: React.FC<{
  payment: FeePayment;
  onClose: () => void;
}> = ({ payment, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between no-print border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase">Official Payment Receipt</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => printElement('admin-receipt-print-box', `Receipt-${payment.receiptNumber}`)} 
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
          </div>
        </div>

        {/* Printable Official Receipt */}
        <div id="admin-receipt-print-box" className="border-2 border-slate-300 p-6 rounded-2xl space-y-4 printable-card text-xs">
          <div className="text-center border-b pb-3">
            <h3 className="text-sm font-extrabold uppercase text-slate-950">
              SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
            </h3>
            <p className="text-[10px] text-slate-600">Vivekananda Sarani, Central Road, Kolkata, WB - 700001</p>
            <span className="text-[9px] font-bold text-amber-700 uppercase">Official Course Fee Receipt</span>
          </div>

          <div className="flex justify-between border-b pb-2 text-[11px]">
            <div><strong>Receipt No:</strong> {payment.receiptNumber}</div>
            <div><strong>Date:</strong> {payment.paymentDate}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div><strong>Student Name:</strong> {payment.studentName}</div>
            <div><strong>Student ID:</strong> {payment.studentId}</div>
            <div><strong>Course:</strong> {payment.courseName}</div>
            <div><strong>Payment Mode:</strong> {payment.paymentMode}</div>
          </div>

          <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-sm font-bold">
            <span>Amount Received:</span>
            <span className="text-emerald-800 text-base">₹{payment.amount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-[11px] text-slate-600">
            <span>Remaining Course Due: ₹{payment.balanceRemaining || 0}</span>
            <span>Collected By: {payment.collectedBy}</span>
          </div>

          <div className="pt-6 flex justify-between text-[10px] text-slate-500 border-t">
            <span>Student Copy</span>
            <span>Authorized Stamp & Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintableCertificateModal: React.FC<{
  certificate: Certificate;
  onClose: () => void;
}> = ({ certificate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 p-6 space-y-6 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between no-print border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase">Certificate of Proficiency</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => printElement('admin-certificate-print-box', `Certificate-${certificate.certificateNumber}`)} 
              className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Print Certificate
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
          </div>
        </div>

        {/* Certificate Card */}
        <div id="admin-certificate-print-box" className="border-8 border-slate-900 p-8 rounded-2xl text-center space-y-4 printable-card relative">
          <div className="text-xs font-bold text-amber-700 uppercase">ISO 9001:2015 CERTIFIED</div>
          <h2 className="text-lg font-extrabold uppercase text-slate-950 font-heading">
            SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
          </h2>
          <div className="py-2">
            <span className="text-xs font-extrabold uppercase border-b-2 border-amber-500 pb-0.5">
              CERTIFICATE OF COMPLETION
            </span>
          </div>
          <p className="text-xs text-slate-600">This is to certify that</p>
          <div className="text-lg font-bold text-slate-900 font-heading">{certificate.studentName}</div>
          <p className="text-xs text-slate-600">
            bearing ID <strong>{certificate.studentId}</strong> has successfully completed the course in:
          </p>
          <div className="p-2 bg-blue-50 text-blue-900 font-bold rounded-lg text-sm">
            {certificate.courseName}
          </div>
          <p className="text-xs text-slate-700">with Grade <strong>{certificate.grade}</strong> ({certificate.percentage}%).</p>
          
          <div className="pt-6 flex justify-between text-left text-[10px] text-slate-500 border-t">
            <div>
              <div><strong>Cert No:</strong> {certificate.certificateNumber}</div>
              <div><strong>Date:</strong> {certificate.issueDate}</div>
            </div>
            <div className="text-right">
              <div><strong>Academic Controller</strong></div>
              <div>Shri Ramkrishna NYCC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddNoticeModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Admission' | 'Exam' | 'Holiday' | 'General' | 'Workshop'>('Admission');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createNotice({ title, category, content, isPinned: true });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border p-6 space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase text-slate-900">Publish Institute Notice</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Notice Title *</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-xl">
              <option value="Admission">Admission</option>
              <option value="Exam">Exam</option>
              <option value="Workshop">Workshop</option>
              <option value="Holiday">Holiday</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Notice Content *</label>
            <textarea required rows={3} value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-600 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-blue-900 text-white font-bold rounded-xl">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IssueCertificateModal: React.FC<{
  students: Student[];
  onClose: () => void;
  onSuccess: (cert: Certificate) => void;
}> = ({ students, onClose, onSuccess }) => {
  const [studentId, setStudentId] = useState(students[0]?.studentId || '');
  const [grade, setGrade] = useState('A+ (Distinction)');
  const [percentage, setPercentage] = useState(88);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selStudent = students.find(s => s.studentId === studentId);
    const res = await api.issueCertificate({
      studentId,
      courseName: selStudent?.courseName || 'Computer Course',
      duration: '3-6 Months',
      grade,
      percentage: Number(percentage)
    });

    if (res.success && res.certificate) {
      onSuccess(res.certificate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border p-6 space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase text-slate-900">Issue Verified Certificate</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Eligible Student *</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {students.map(s => <option key={s.id} value={s.studentId}>{s.name} ({s.studentId}) — {s.courseName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Grade</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option value="A+ (Distinction)">A+ (Distinction)</option>
                <option value="A (First Class)">A (First Class)</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Percentage (%)</label>
              <input type="number" value={percentage} onChange={e => setPercentage(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-blue-900 text-white font-bold rounded-xl">Generate Certificate</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnterResultModal: React.FC<{
  students: Student[];
  exams: Exam[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ students, exams, onClose, onSuccess }) => {
  const [studentId, setStudentId] = useState(students[0]?.studentId || '');
  const [examId, setExamId] = useState(exams[0]?.id || '');
  const [marks, setMarks] = useState(85);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selStudent = students.find(s => s.studentId === studentId);
    const selExam = exams.find(ex => ex.id === examId);

    await api.recordResult({
      examId,
      examTitle: selExam?.title || 'Exam',
      studentId,
      studentName: selStudent?.name || 'Student',
      courseName: selStudent?.courseName || 'Course',
      marksObtained: Number(marks),
      maxMarks: selExam?.maxMarks || 100
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border p-6 space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase text-slate-900">Enter Student Exam Marks</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Exam *</label>
            <select value={examId} onChange={e => setExamId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title} (Max: {ex.maxMarks})</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Student *</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {students.map(s => <option key={s.id} value={s.studentId}>{s.name} ({s.studentId})</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Marks Obtained *</label>
            <input required type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-blue-900" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-blue-900 text-white font-bold rounded-xl">Publish Result</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddExamModal: React.FC<{
  courses: Course[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ courses, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxMarks, setMaxMarks] = useState(100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find(c => c.id === courseId);
    await api.createExam({
      title,
      courseId,
      courseName: selCourse?.name || 'Course',
      date,
      maxMarks: Number(maxMarks),
      passMarks: 40,
      type: 'Combined'
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border p-6 space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase text-slate-900">Schedule Examination</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Exam Title *</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mid-Term Practical Evaluation" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Course *</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Exam Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Marks</label>
              <input type="number" value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-blue-900 text-white font-bold rounded-xl">Save Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddMaterialModal: React.FC<{
  courses: Course[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ courses, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [category, setCategory] = useState<'PDF Notes' | 'Assignment' | 'Syllabus' | 'Question Bank'>('PDF Notes');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find(c => c.id === courseId);
    await api.uploadStudyMaterial({
      title,
      courseId,
      courseName: selCourse?.name || 'Course',
      category,
      description,
      fileSize: '4.5 MB'
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border p-6 space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase text-slate-900">Upload Study Material / PDF</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Material Title *</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. MS Excel VLOOKUP Cheatsheet" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Course *</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
              <option value="PDF Notes">PDF Notes</option>
              <option value="Assignment">Assignment</option>
              <option value="Question Bank">Question Bank</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-blue-900 text-white font-bold rounded-xl">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};
