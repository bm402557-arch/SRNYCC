import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Monitor, FileSpreadsheet, Calculator, Award, 
  CheckCircle2, ArrowRight, ShieldCheck, Users, Clock, Sparkles, 
  Bell, Search, HelpCircle, Phone, MapPin, ChevronRight, BookOpen, 
  ExternalLink, Calendar, Star, Laptop, FileCheck, Check
} from 'lucide-react';
import { Course, Notice } from '../types';
import { api } from '../lib/api';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  setSelectedCourseForAdmission: (courseId: string) => void;
  openAuthModal: (role: 'admin' | 'student') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  setActiveTab, 
  setSelectedCourseForAdmission,
  openAuthModal 
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, noticesRes] = await Promise.all([
        api.getCourses(),
        api.getNotices()
      ]);
      if (coursesRes.success) setCourses(coursesRes.courses);
      if (noticesRes.success) setNotices(noticesRes.notices);
    } catch (e) {
      console.error('Error fetching homepage data', e);
    }
  };

  const handleApplyCourse = (courseId: string) => {
    setSelectedCourseForAdmission(courseId);
    setActiveTab('admission');
  };

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackingLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await api.trackApplication(trackQuery.trim());
      setTrackingLoading(false);
      if (res.success && res.application) {
        setTrackResult(res.application);
      } else {
        setTrackError(res.message || 'No application record found for this ID or mobile.');
      }
    } catch (err: any) {
      setTrackingLoading(false);
      setTrackError('Failed to search database. Please check your query.');
    }
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-6 h-6 text-blue-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-amber-600" />;
      default: return <GraduationCap className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-blue-600/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Admissions Open for Session 2026-27 • Limited Batch Seats</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight">
              SHRI RAMKRISHNA NATIONAL YOUTH
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 mt-1">
                COMPUTER CENTRE
              </span>
            </h1>

            {/* Tagline */}
            <div className="py-2">
              <p className="text-lg sm:text-2xl font-semibold text-blue-200 italic tracking-wide">
                &ldquo;Learn Today, Build Your Future Tomorrow&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering students, beginners, job seekers, and working professionals with 100% practical, hands-on computer education and government-recognized certifications.
            </p>

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                id="hero-apply-btn"
                onClick={() => setActiveTab('admission')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-courses-btn"
                onClick={() => setActiveTab('courses')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>View All Courses</span>
              </button>

              <button
                id="hero-student-login-btn"
                onClick={() => openAuthModal('student')}
                className="px-5 py-3.5 rounded-xl bg-blue-900/60 hover:bg-blue-900 text-blue-200 font-semibold text-sm border border-blue-700/50 transition-all flex items-center gap-2"
              >
                <span>Student Login</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">12+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Years of Excellence</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">4,800+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Certified Students</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Practical Computer Lab</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">ISO</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">9001:2015 Registered</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COURSES OFFERED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-800 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-3">
            <GraduationCap className="w-4 h-4" />
            Career Oriented Programs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase">
            Courses Offered at the Centre
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Industry-aligned curricula with dedicated 1:1 computer workstations, verified certificates, and career guidance.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Card Top Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getCourseIcon(course.icon)}
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {course.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {course.overview}
                  </p>

                  {/* Highlights Pill Topics */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Key Topics Covered:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {course.topics.slice(0, 4).map((topic, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Bottom / Action Footer */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">Course Fee</span>
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{course.fee.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCourseModal(course)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
                    >
                      View Details
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyCourse(course.id)}
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab('courses')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700 bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-200 transition-colors"
          >
            <span>Explore Complete Course Curriculum & Syllabi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
              Quality Education & Modern Facilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white uppercase">
              Why Choose Shri Ramkrishna NYCC?
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              We focus on practical competency, real-world project work, and student career advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Practical Computer Training</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every student gets an individual PC for the entire duration of the class. No sharing, no theoretical boredom—you learn by doing live exercises.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-blue-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Experienced Faculty</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learn under seasoned instructors and certified accountants with 10+ years of training and corporate accounting experience.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Certificate Courses</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive ISO 9001:2015 quality-certified diplomas and certificates with verifiable Student ID and QR verification codes valid nationwide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Affordable & Flexible Fees</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Highly affordable course fees with convenient monthly and installment options so quality computer education is accessible to everyone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-rose-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Dedicated Student Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Free extra lab practice hours, doubt clearing sessions, typing speed tests, and resume-building workshops for job seekers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-cyan-400/40 transition-colors space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Modern AC Lab & Backup</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Air-conditioned workstation rooms, high-speed optical fiber internet, continuous power backup, and modern computer systems.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ADMISSION IN 4 SIMPLE STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
                Quick & Seamless Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase">
                How to Get Admitted
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Join thousands of successful students who have transformed their digital careers at Shri Ramkrishna NYCC.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('admission')}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Start Online Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-2">
                  01
                </div>
                <h4 className="font-bold text-sm text-white">Fill Online Form</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Enter student details, contact info, and select your preferred course & batch time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-2">
                  02
                </div>
                <h4 className="font-bold text-sm text-white">Get Application ID</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Instantly receive your tracking ID and downloadable confirmation slip.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-2">
                  03
                </div>
                <h4 className="font-bold text-sm text-white">Admin Approval</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Centre verifies documents and issues your permanent Student ID (e.g. SRKNYCC-2026-XXXX).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-2">
                  04
                </div>
                <h4 className="font-bold text-sm text-white">Start Classes</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Attend hands-on lab sessions, access digital notes, and prepare for certification!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST NOTICES & APPLICATION TRACKING WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Latest Notices */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">
                  Latest Notices & Circulars
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Notice Board</span>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notice.isPinned
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      notice.category === 'Admission' ? 'bg-blue-100 text-blue-800' :
                      notice.category === 'Exam' ? 'bg-purple-100 text-purple-800' :
                      notice.category === 'Workshop' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {notice.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{notice.date}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Application Tracker */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm uppercase">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Track Admission Application</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Application ID (e.g. APP-2026-1041) or Registered Mobile Number to check real-time admission status.
              </p>
            </div>

            <form onSubmit={handleTrackApplication} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. APP-2026-1041 or 9836778899"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {trackingLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Search Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {trackError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span>App ID: {trackResult.applicationId}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    trackResult.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    trackResult.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {trackResult.status}
                  </span>
                </div>
                <div className="text-slate-800">
                  <strong>Applicant:</strong> {trackResult.studentName}
                </div>
                <div className="text-slate-800">
                  <strong>Course:</strong> {trackResult.courseName}
                </div>
                {trackResult.assignedStudentId && (
                  <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg font-bold">
                    Student ID: {trackResult.assignedStudentId}
                  </div>
                )}
                {trackResult.remarks && (
                  <div className="text-slate-600 italic">
                    Note: {trackResult.remarks}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need immediate help?</span>
              <a href="tel:+919876543210" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Call Helpdesk
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            
            <div className="bg-blue-950 text-white p-6 sticky top-0 z-10 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{activeCourseModal.code}</span>
                <h3 className="text-xl font-bold">{activeCourseModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs sm:text-sm">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">Duration: {activeCourseModal.duration}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">Total Fee: ₹{activeCourseModal.fee.toLocaleString()}</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">{activeCourseModal.level}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Course Overview</h4>
                <p className="text-slate-600 leading-relaxed">{activeCourseModal.overview}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">Detailed Topics & Modules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCourseModal.topics.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg text-slate-700 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                <p><strong>Eligibility:</strong> {activeCourseModal.eligibility}</p>
                <p><strong>Certification:</strong> {activeCourseModal.certificateInfo}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveCourseModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApplyCourse(activeCourseModal.id);
                    setActiveCourseModal(null);
                  }}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Apply for this Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
