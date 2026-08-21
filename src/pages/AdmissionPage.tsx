import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, User, Phone, Mail, MapPin, 
  GraduationCap, Clock, Upload, Camera, Sparkles, Printer, 
  ArrowRight, ShieldCheck, Search, AlertCircle, RefreshCw, 
  Download, Calendar, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, AdmissionApplication } from '../types';
import { api } from '../lib/api';

interface AdmissionPageProps {
  selectedCourseId?: string;
  setActiveTab: (tab: string) => void;
}

export const AdmissionPage: React.FC<AdmissionPageProps> = ({ 
  selectedCourseId, 
  setActiveTab 
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTabState] = useState<'form' | 'track'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<AdmissionApplication | null>(null);
  const [trackError, setTrackError] = useState('');

  // Form fields
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [dob, setDob] = useState('2005-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [qualification, setQualification] = useState('Higher Secondary (10+2)');
  const [courseId, setCourseId] = useState('');
  const [preferredBatch, setPreferredBatch] = useState('Morning (08:00 AM - 10:00 AM)');
  
  // Images (Base64 or fallback avatar)
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300');
  const [idProofName, setIdProofName] = useState<string>('');
  const [signatureName, setSignatureName] = useState<string>('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.getCourses();
      if (res.success && res.courses.length > 0) {
        setCourses(res.courses);
        if (selectedCourseId) {
          const match = res.courses.find(c => c.id === selectedCourseId);
          if (match) setCourseId(match.id);
          else setCourseId(res.courses[0].id);
        } else {
          setCourseId(res.courses[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching courses', e);
    }
  };

  useEffect(() => {
    if (selectedCourseId && courses.length > 0) {
      setCourseId(selectedCourseId);
    }
  }, [selectedCourseId, courses]);

  // File upload handler to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'idProof' | 'signature') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'photo') {
        setPhotoUrl(result);
      } else if (type === 'idProof') {
        setIdProofName(file.name);
      } else if (type === 'signature') {
        setSignatureName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentName.trim() || !mobile.trim() || !address.trim() || !courseId) {
      setErrorMessage('Please fill in all required fields (Name, Mobile, Address, Course).');
      return;
    }

    const selectedCourseObj = courses.find(c => c.id === courseId);
    const courseName = selectedCourseObj ? selectedCourseObj.name : 'Computer Training Course';

    setSubmitting(true);

    try {
      const res = await api.submitAdmission({
        studentName: studentName.trim(),
        parentName: parentName.trim() || 'Parent / Guardian',
        dob,
        gender,
        mobile: mobile.trim(),
        email: email.trim() || `${mobile.trim()}@applicant.srknycc.org`,
        address: address.trim(),
        qualification,
        courseId,
        courseName,
        preferredBatch,
        photoUrl,
        idProofUrl: idProofName ? `Uploaded: ${idProofName}` : 'Aadhaar Card copy provided',
        signatureUrl: signatureName ? `Uploaded: ${signatureName}` : 'Digital signature captured'
      });

      setSubmitting(false);

      if (res.success && res.application) {
        setSubmittedApp(res.application);
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // ignore confetti error if any
        }
      } else {
        setErrorMessage(res.message || 'Submission failed. Please check inputs.');
      }
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Server error occurred while submitting admission application.');
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
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
        setTrackError(res.message || 'No application record found matching your query.');
      }
    } catch (err: any) {
      setTrackingLoading(false);
      setTrackError('Failed to search database.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 no-print">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Sparkles className="w-4 h-4" />
            Session 2026-27
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Online Student Admission Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Apply online for Basic Computer, MS Office, Tally Prime, and Diploma in Computer Application (DCA). Fast verification and instant Application ID generation.
          </p>

          {/* Toggle Form / Track Tabs */}
          <div className="pt-6 flex justify-center gap-2">
            <button
              onClick={() => setActiveTabState('form')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Fill New Admission Form</span>
            </button>
            <button
              onClick={() => setActiveTabState('track')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Existing Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================= */}
        {/* 1. SUCCESSFUL SUBMISSION SLIP SCREEN     */}
        {/* ========================================= */}
        {submittedApp ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Printable Confirmation Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden printable-card">
              
              {/* Slip Header */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 border-b border-amber-400/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                        Official Admission Slip
                      </div>
                      <h2 className="text-base sm:text-lg font-bold uppercase leading-tight">
                        SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
                      </h2>
                      <div className="text-[11px] text-slate-300">
                        Govt. Regd. • ISO 9001:2015 Certified Educational Institution
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                    <span className="text-[10px] text-amber-300 uppercase block font-bold">Application ID</span>
                    <span className="text-base font-extrabold text-white">{submittedApp.applicationId}</span>
                  </div>
                </div>
              </div>

              {/* Slip Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm no-print">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Application Submitted Successfully!</strong>
                    <span>Your application is under verification by the admissions team. Save or print this slip for office reference.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Photo Section */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <img
                      src={submittedApp.photoUrl}
                      alt={submittedApp.studentName}
                      className="w-28 h-28 rounded-lg object-cover border-2 border-slate-300 shadow-xs mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-bold text-slate-700">Applicant Photo</span>
                    <span className="text-[10px] text-slate-500 uppercase mt-0.5">Verified Online</span>
                  </div>

                  {/* Student Details Grid */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Applicant Name:</span>
                      <strong className="text-slate-900 text-sm">{submittedApp.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Father / Mother Name:</span>
                      <strong className="text-slate-900">{submittedApp.parentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Course Applied:</span>
                      <strong className="text-blue-900 font-bold">{submittedApp.courseName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Preferred Batch:</span>
                      <strong className="text-slate-900">{submittedApp.preferredBatch}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Mobile Number:</span>
                      <strong className="text-slate-900">{submittedApp.mobile}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Date of Birth / Gender:</span>
                      <strong className="text-slate-900">{submittedApp.dob} ({submittedApp.gender})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Qualification:</span>
                      <strong className="text-slate-900">{submittedApp.qualification}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Submission Date:</span>
                      <strong className="text-slate-900">{new Date(submittedApp.submittedAt).toLocaleDateString()}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 font-medium block">Permanent Address:</span>
                      <span className="text-slate-800 font-medium">{submittedApp.address}</span>
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Important Guidelines for Enrolled Applicant:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    <li>Bring 2 passport-size photographs and original ID card during your first visit to the lab.</li>
                    <li>Once approved by the Academic Controller, your permanent <strong>Student ID (e.g. SRKNYCC-2026-XXXX)</strong> will be generated.</li>
                    <li>You will receive your Student Login credentials to access study materials, exam schedules, and printable ID cards.</li>
                  </ul>
                </div>

                {/* Signatures & Stamps */}
                <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-1"></div>
                    <span className="text-[11px] text-slate-600 font-medium">Applicant Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-1"></div>
                    <span className="text-[11px] text-slate-600 font-medium">Authorized Centre Seal</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <button
                type="button"
                onClick={() => {
                  setSubmittedApp(null);
                  setStudentName('');
                  setMobile('');
                  setEmail('');
                  setAddress('');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Submit Another Application</span>
              </button>

              <button
                type="button"
                id="print-application-btn"
                onClick={handlePrint}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official Admission Slip</span>
              </button>
            </div>

          </div>
        ) : activeTab === 'track' ? (
          
          /* ========================================= */
          /* 2. TRACK APPLICATION VIEW                 */
          /* ========================================= */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="text-center max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-slate-900 uppercase">
                Track Your Admission Application
              </h2>
              <p className="text-xs text-slate-500">
                Enter your unique Application ID (e.g. <code>APP-2026-1041</code>) or your registered 10-digit mobile number.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto space-y-3">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. APP-2026-1041 or 9876543210"
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="absolute right-2 top-2 px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  {trackingLoading ? 'Searching...' : 'Check'}
                </button>
              </div>
            </form>

            {trackError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackResult && (
              <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Application Number</span>
                    <strong className="text-sm text-slate-900">{trackResult.applicationId}</strong>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    trackResult.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    trackResult.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {trackResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block">Applicant Name:</span>
                    <strong className="text-slate-900">{trackResult.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Course:</span>
                    <strong className="text-blue-900">{trackResult.courseName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Preferred Batch:</span>
                    <span>{trackResult.preferredBatch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Submitted On:</span>
                    <span>{new Date(trackResult.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {trackResult.assignedStudentId && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl font-bold flex items-center justify-between">
                    <span>Generated Student ID:</span>
                    <span className="text-sm font-extrabold">{trackResult.assignedStudentId}</span>
                  </div>
                )}

                {trackResult.remarks && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 italic">
                    Note: {trackResult.remarks}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (

          /* ========================================= */
          /* 3. NEW ADMISSION APPLICATION FORM         */
          /* ========================================= */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 border-b border-amber-400/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold uppercase">
                    Online Admission Application Form
                  </h2>
                  <p className="text-xs text-slate-300">
                    Please provide accurate personal and academic information as per government ID records.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Course & Batch Selection */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>1. Course & Preferred Batch</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Course *
                    </label>
                    <select
                      id="admission-course-select"
                      required
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — ({c.duration}, Fee: ₹{c.fee})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Batch Time *
                    </label>
                    <select
                      id="admission-batch-select"
                      required
                      value={preferredBatch}
                      onChange={(e) => setPreferredBatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Morning (08:00 AM - 10:00 AM)">Morning (08:00 AM - 10:00 AM)</option>
                      <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                      <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                      <option value="Weekend Batch (Saturday - Sunday 10:00 AM)">Weekend Batch (Saturday - Sunday 10:00 AM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Student Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>2. Student Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      id="admission-name-input"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Father&apos;s / Mother&apos;s Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGender(g)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            gender === g
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Address */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-700" />
                  <span>3. Contact & Academic Qualification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      id="admission-mobile-input"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Permanent Postal Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Street, Area, City/Town, District, State, PIN Code"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Highest Educational Qualification *
                    </label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Class 8th / 9th">Class 8th / 9th</option>
                      <option value="Secondary (Class 10th / Madhyamik / Matric)">Secondary (Class 10th / Madhyamik / Matric)</option>
                      <option value="Higher Secondary (10+2 / HS / Intermediate)">Higher Secondary (10+2 / HS / Intermediate)</option>
                      <option value="Graduate (B.A / B.Com / B.Sc / B.Tech / BCA)">Graduate (B.A / B.Com / B.Sc / B.Tech / BCA)</option>
                      <option value="Post Graduate (M.A / M.Com / M.Sc / MCA / MBA)">Post Graduate (M.A / M.Com / M.Sc / MCA / MBA)</option>
                      <option value="Working Professional / Other">Working Professional / Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Document & Photo Uploads */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-700" />
                  <span>4. Photo, ID Proof & Signature Upload</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Photo */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                    <label className="block text-xs font-bold text-slate-700">Passport Size Photo</label>
                    <div className="relative inline-block">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover mx-auto border border-slate-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <label className="block cursor-pointer">
                      <span className="text-[11px] font-bold text-blue-700 hover:underline bg-white px-3 py-1 rounded-md border border-slate-300 inline-block shadow-2xs">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* ID Proof */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">ID Proof (Aadhaar / Voter)</label>
                      <p className="text-[10px] text-slate-500 mt-1">Upload scan or phone photo of ID card</p>
                      {idProofName && (
                        <span className="text-[11px] font-semibold text-emerald-700 block mt-2 truncate">
                          ✓ {idProofName}
                        </span>
                      )}
                    </div>
                    <label className="block cursor-pointer mt-2">
                      <span className="text-[11px] font-bold text-blue-700 hover:underline bg-white px-3 py-1 rounded-md border border-slate-300 inline-block shadow-2xs">
                        {idProofName ? 'Change ID File' : 'Select ID File'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'idProof')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Signature */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">Student Signature</label>
                      <p className="text-[10px] text-slate-500 mt-1">Signature on white paper</p>
                      {signatureName && (
                        <span className="text-[11px] font-semibold text-emerald-700 block mt-2 truncate">
                          ✓ {signatureName}
                        </span>
                      )}
                    </div>
                    <label className="block cursor-pointer mt-2">
                      <span className="text-[11px] font-bold text-blue-700 hover:underline bg-white px-3 py-1 rounded-md border border-slate-300 inline-block shadow-2xs">
                        {signatureName ? 'Change Signature' : 'Upload Signature'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'signature')}
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  id="admission-terms-check"
                  defaultChecked
                  className="mt-0.5 rounded text-blue-900 focus:ring-blue-600"
                />
                <label htmlFor="admission-terms-check" className="text-[11px] leading-relaxed cursor-pointer">
                  I hereby declare that the details provided in this admission form are true and accurate. I agree to abide by the rules, lab ethics, and attendance standards of <strong>Shri Ramkrishna National Youth Computer Centre</strong>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                id="submit-admission-form-btn"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Submit Online Admission Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>
        )}

      </section>

    </div>
  );
};
