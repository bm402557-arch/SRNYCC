import React, { useState, useEffect } from 'react';
import { 
  User, BookOpen, Calendar, IndianRupee, Award, 
  FileText, Download, Printer, CheckCircle2, AlertCircle, 
  Clock, ShieldCheck, FileDown, Bell, IdCard, ChevronRight, 
  Phone, MapPin, Sparkles, LogOut, Check 
} from 'lucide-react';
import { 
  Student, FeePayment, AttendanceRecord, AttendanceStudentEntry, ExamResult, 
  StudyMaterial, Notice, Certificate, CenterLocationConfig 
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { StudentIdCardView } from '../../components/StudentIdCardView';
import { StudentGeoAttendance } from '../../components/StudentGeoAttendance';
import { printElement } from '../../lib/printUtils';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'exams' | 'materials' | 'certificates' | 'idcard'>('overview');

  const [studentData, setStudentData] = useState<Student | null>(currentStudent);
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceStudentEntry | null>(null);
  const [centerLocation, setCenterLocation] = useState<CenterLocationConfig | undefined>(undefined);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStudent) {
      loadStudentData(currentStudent.studentId);
    }
  }, [currentStudent]);

  const loadStudentData = async (studentId: string) => {
    setLoading(false);
    try {
      const res = await api.getStudentPortalData(studentId);
      if (res.success) {
        if (res.student) setStudentData(res.student);
        if (res.fees) setFees(res.fees);
        if (res.attendance) setAttendance(res.attendance);
        if (res.todayAttendance !== undefined) setTodayAttendance(res.todayAttendance);
        if (res.centerLocation) setCenterLocation(res.centerLocation);
        if (res.results) setResults(res.results);
        if (res.materials) setMaterials(res.materials);
        if (res.notices) setNotices(res.notices);
        if (res.certificates) setCertificates(res.certificates);
      }
    } catch (e) {
      console.error('Error fetching student dashboard info', e);
    }
  };

  if (!studentData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border text-center space-y-3">
          <p className="text-slate-600 text-sm">Please log in to your student account.</p>
        </div>
      </div>
    );
  }

  // Attendance metrics calculation
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      
      {/* Top Student Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img
                src={studentData.photoUrl}
                alt={studentData.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 font-mono">
                    {studentData.studentId}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                    ● Enrolled Active
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold uppercase mt-0.5">
                  {studentData.name}
                </h1>
                <div className="text-xs text-slate-300">
                  {studentData.courseName} • {studentData.batch}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('idcard')}
                className="px-3.5 py-2 bg-blue-950 border border-blue-700 hover:bg-blue-900 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <IdCard className="w-4 h-4 text-amber-400" />
                <span>View My Student ID Card</span>
              </button>
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pt-4 mt-3 border-t border-slate-800 text-xs scrollbar-none">
            {[
              { id: 'overview', label: 'My Dashboard', icon: User },
              { id: 'attendance', label: `Attendance (${attendancePercentage}%)`, icon: Calendar },
              { id: 'fees', label: 'Fee Payments', icon: IndianRupee },
              { id: 'exams', label: `Results & Marks (${results.length})`, icon: Award },
              { id: 'materials', label: `Study Notes (${materials.length})`, icon: BookOpen },
              { id: 'certificates', label: `Certificates (${certificates.length})`, icon: ShieldCheck },
              { id: 'idcard', label: 'Identity Card', icon: IdCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`student-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
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
        
        {/* ======================================================== */}
        {/* 1. OVERVIEW & SUMMARY                                    */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase block">Course Program</span>
                <div className="text-base font-bold text-blue-950 line-clamp-1">{studentData.courseName}</div>
                <div className="text-[11px] text-slate-500">Batch: {studentData.batch}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase block">Attendance Rate</span>
                <div className="text-2xl font-extrabold text-emerald-700">{attendancePercentage}%</div>
                <div className="text-[11px] text-slate-500">{presentDays} of {totalDays} Sessions Attended</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase block">Course Fees Status</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  ₹{studentData.paidFee} <span className="text-xs text-slate-400 font-normal">/ ₹{studentData.totalFee}</span>
                </div>
                {studentData.dueFee > 0 ? (
                  <div className="text-[11px] text-rose-600 font-bold">Due Balance: ₹{studentData.dueFee}</div>
                ) : (
                  <div className="text-[11px] text-emerald-600 font-bold">✓ Full Course Fee Cleared</div>
                )}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase block">Exam Proficiency</span>
                <div className="text-2xl font-extrabold text-amber-600">
                  {results.length > 0 ? `Grade ${results[0].grade}` : 'Enrolled'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {results.length} Evaluations Recorded
                </div>
              </div>

            </div>

            {/* Profile & Announcements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Student Profile Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-700" />
                    <span>Enrolled Student Profile</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('idcard')}
                    className="text-xs text-blue-700 font-bold hover:underline"
                  >
                    Print ID Card &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400 block font-medium">Full Name:</span>
                    <strong className="text-slate-900">{studentData.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Student Registration ID:</span>
                    <strong className="text-blue-900 font-mono">{studentData.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Father / Mother Name:</span>
                    <span>{studentData.parentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Date of Birth & Gender:</span>
                    <span>{studentData.dob} ({studentData.gender})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Mobile Number:</span>
                    <span>{studentData.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Educational Qualification:</span>
                    <span>{studentData.qualification}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Registered Address:</span>
                    <span>{studentData.address}</span>
                  </div>
                </div>
              </div>

              {/* Institute Announcements */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Important Notices</span>
                </h3>

                <div className="space-y-3">
                  {notices.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {n.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Geo Attendance Action Banner on Overview */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-bold text-amber-300 uppercase">
                    Campus Geofence System
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base mt-1">
                    {todayAttendance ? "Today's Lab Attendance: Marked Present ✓" : "Give Today's Laboratory Attendance"}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {todayAttendance
                      ? `Verified at ${todayAttendance.timestamp || 'Today'}. You are marked present for your batch session.`
                      : 'Scan your current GPS location at the computer center to mark your attendance today.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-md active:scale-98 flex items-center gap-2 ${
                  todayAttendance
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold'
                }`}
              >
                <span>{todayAttendance ? 'View Attendance Log' : 'Mark Location Attendance →'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ATTENDANCE SHEET & GEOLOCATION CHECK-IN               */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <StudentGeoAttendance
            student={studentData}
            todayAttendance={todayAttendance}
            centerLocation={centerLocation}
            attendanceHistory={attendance}
            onAttendanceMarked={() => loadStudentData(studentData.studentId)}
          />
        )}

        {/* ======================================================== */}
        {/* 3. FEE PAYMENTS & SLIPS                                  */}
        {/* ======================================================== */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase">Course Fee Account & Receipts</h3>
                  <p className="text-xs text-slate-500">Official fee transaction statements and downloadable payment receipts.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Course Fee: ₹{studentData.totalFee}</span>
                  <span className="text-sm font-extrabold text-emerald-700">Paid: ₹{studentData.paidFee}</span>
                  {studentData.dueFee > 0 && (
                    <span className="text-xs font-bold text-rose-600 block">Remaining Due: ₹{studentData.dueFee}</span>
                  )}
                </div>
              </div>

              {fees.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No payment receipts recorded yet.</div>
              ) : (
                <div className="space-y-3">
                  {fees.map((fee) => (
                    <div key={fee.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-blue-950 font-mono text-sm">{fee.receiptNumber}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                            {fee.paymentMode}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-1">
                          Date: {fee.paymentDate} • Collected by: {fee.collectedBy}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-base font-extrabold text-emerald-800">₹{fee.amount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 block">Course Installment</span>
                        </div>
                        <button
                          onClick={() => setSelectedReceipt(fee)}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. EXAM RESULTS & MARKS                                  */}
        {/* ======================================================== */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Examination Results & Performance</h3>
              
              {results.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No exam results published yet.</div>
              ) : (
                <div className="space-y-4">
                  {results.map((res) => (
                    <div key={res.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-blue-700 font-bold uppercase">{res.courseName}</span>
                          <h4 className="font-bold text-slate-900 text-base">{res.examTitle}</h4>
                          <span className="text-xs text-slate-500">Date: {res.examDate}</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-900">
                          Grade {res.grade}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Marks Scored</span>
                          <strong className="text-blue-900 text-sm">{res.marksObtained}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Max Marks</span>
                          <strong className="text-slate-700 text-sm">{res.maxMarks}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Percentage</span>
                          <strong className="text-emerald-700 text-sm">{res.percentage}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. STUDY MATERIALS                                       */}
        {/* ======================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Course Notes & Downloadable PDF Materials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((mat) => (
                  <div key={mat.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {mat.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{mat.fileSize}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                      <p className="text-slate-600 mt-1">{mat.description}</p>
                    </div>

                    <a
                      href={`/downloads/${mat.id}.pdf`}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${mat.title} (${mat.fileSize})`);
                      }}
                      className="w-full py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Study PDF</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. OFFICIAL CERTIFICATES                                 */}
        {/* ======================================================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase">Issued Certificates & Diplomas</h3>
              
              {certificates.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No certificate issued yet. Certificates are generated after course completion and final examinations.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((c) => (
                    <div key={c.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-amber-700 font-bold font-mono">{c.certificateNumber}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{c.courseName}</h4>
                          <span className="text-xs text-slate-500">Issued: {c.issueDate}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {c.grade}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedCert(c)}
                        className="w-full py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>View / Print Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. STUDENT PLASTIC ID CARD VIEW                          */}
        {/* ======================================================== */}
        {activeTab === 'idcard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="max-w-xl mx-auto text-center space-y-2 no-print">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Official PVC Student Identity Card</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg uppercase">Digital Student Identity Card</h3>
                <p className="text-xs text-slate-500">
                  Present this card or download/print it on PVC plastic or photo card paper for admission entry to computer laboratory sessions and practical classes.
                </p>
              </div>

              <StudentIdCardView student={studentData} />
            </div>
          </div>
        )}

      </div>

      {/* Fee Slip Modal for Student */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2 no-print">
              <h4 className="font-bold uppercase text-slate-900">Payment Receipt</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => printElement('student-receipt-print-box', `Receipt-${selectedReceipt.receiptNumber}`)} 
                  className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setSelectedReceipt(null)} className="text-slate-500 hover:text-slate-900">✕</button>
              </div>
            </div>

            <div id="student-receipt-print-box" className="border p-4 rounded-xl space-y-3 printable-card">
              <div className="text-center border-b pb-2">
                <h5 className="font-extrabold uppercase text-slate-950">SHRI RAMKRISHNA NYCC</h5>
                <span className="text-[10px] text-slate-500 font-mono">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="space-y-1">
                <div><strong>Student:</strong> {selectedReceipt.studentName} ({selectedReceipt.studentId})</div>
                <div><strong>Course:</strong> {selectedReceipt.courseName}</div>
                <div><strong>Date:</strong> {selectedReceipt.paymentDate} ({selectedReceipt.paymentMode})</div>
              </div>
              <div className="p-2 bg-slate-50 border rounded-lg flex justify-between font-bold text-sm">
                <span>Paid:</span>
                <span className="text-emerald-700">₹{selectedReceipt.amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal for Student */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center no-print border-b pb-2">
              <h4 className="font-bold uppercase text-slate-900 text-sm">Official Certificate</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => printElement('student-cert-print-box', `Certificate-${selectedCert.certificateNumber}`)} 
                  className="px-3 py-1 bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Certificate</span>
                </button>
                <button onClick={() => setSelectedCert(null)} className="text-slate-500 hover:text-slate-900">✕</button>
              </div>
            </div>
            
            <div id="student-cert-print-box" className="border-4 border-slate-900 p-6 rounded-2xl text-center space-y-3 printable-card">
              <div className="text-[10px] font-bold text-amber-700 uppercase">ISO 9001:2015 CERTIFIED</div>
              <h3 className="text-base font-extrabold uppercase font-heading">SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE</h3>
              <p className="text-xs text-slate-600">Certificate of Completion presented to</p>
              <div className="text-lg font-bold text-slate-900 font-heading">{selectedCert.studentName}</div>
              <div className="text-xs text-slate-600">for completing <strong>{selectedCert.courseName}</strong> with Grade <strong>{selectedCert.grade}</strong> ({selectedCert.percentage}%).</div>
              <div className="pt-4 border-t text-[10px] text-slate-500 flex justify-between">
                <span>Cert: {selectedCert.certificateNumber}</span>
                <span>Date: {selectedCert.issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
