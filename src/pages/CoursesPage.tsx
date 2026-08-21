import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Monitor, FileSpreadsheet, Calculator, Award, 
  CheckCircle2, ArrowRight, Search, Clock, Users, ShieldCheck, 
  FileText, Sparkles, Check, ChevronDown, ChevronUp, Download 
} from 'lucide-react';
import { Course } from '../types';
import { api } from '../lib/api';

interface CoursesPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedCourseForAdmission: (courseId: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ 
  setActiveTab, 
  setSelectedCourseForAdmission 
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.getCourses();
      if (res.success) setCourses(res.courses);
    } catch (e) {
      console.error('Error fetching courses', e);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'diploma') return matchesSearch && (course.id.includes('dca') || course.name.toLowerCase().includes('diploma'));
    if (selectedFilter === 'accounting') return matchesSearch && (course.id.includes('tally') || course.name.toLowerCase().includes('tally'));
    if (selectedFilter === 'office') return matchesSearch && (course.id.includes('office') || course.id.includes('basic'));
    return matchesSearch;
  });

  const handleApply = (courseId: string) => {
    setSelectedCourseForAdmission(courseId);
    setActiveTab('admission');
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-8 h-8 text-blue-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
      case 'Calculator': return <Calculator className="w-8 h-8 text-amber-600" />;
      default: return <GraduationCap className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <GraduationCap className="w-4 h-4" />
            Curriculum & Programs
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Professional Computer Training Courses
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Practical, certificate-based training designed for students, job seekers, and working professionals with 100% lab practice.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses, topics (e.g. Excel, GST, DCA, Typing)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('diploma')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === 'diploma' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Diplomas
              </button>
              <button
                onClick={() => setSelectedFilter('accounting')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === 'accounting' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tally / GST
              </button>
              <button
                onClick={() => setSelectedFilter('office')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === 'office' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                MS Office / Basic
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Courses List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-600 text-sm">No courses found matching &ldquo;{searchTerm}&rdquo;</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}
              className="text-xs text-blue-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id;

              return (
                <div
                  key={course.id}
                  id={`course-detail-${course.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Course Header & Badges */}
                      <div className="lg:col-span-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                            {getCourseIcon(course.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                                {course.code}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                                {course.level}
                              </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                              {course.name}
                            </h2>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {course.overview}
                        </p>

                        {/* Quick Highlights info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <span className="font-bold text-slate-800 block mb-0.5">Eligibility:</span>
                            <span className="text-slate-600">{course.eligibility}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <span className="font-bold text-slate-800 block mb-0.5">Certification:</span>
                            <span className="text-slate-600">{course.certificateInfo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action & Pricing Box */}
                      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between h-full space-y-5">
                        <div>
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
                            Duration & Total Fee
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-slate-900">
                              ₹{course.fee.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              / full course
                            </span>
                          </div>
                          <div className="mt-2 text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-700" />
                            <span>Duration: {course.duration}</span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            *Installment options available at admission desk
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleApply(course.id)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <span>Apply for this Course</span>
                            <ArrowRight className="w-4 h-4 text-amber-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                            className="w-full py-2 text-xs font-semibold text-slate-700 hover:text-blue-900 flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>{isExpanded ? 'Hide Syllabus Topics' : 'View Full Syllabus Topics'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Expandable Syllabus Section */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Detailed Topics & Modules Covered in {course.name}
                          </h4>
                          <span className="text-xs text-slate-500">{course.topics.length} Key Units</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {course.topics.map((topic, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800"
                            >
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="font-medium leading-relaxed">{topic}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between mt-3 flex-wrap gap-2">
                          <span className="font-medium">Includes weekly practical lab exams, final project, and verifiable ISO certificate.</span>
                          <button
                            onClick={() => handleApply(course.id)}
                            className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                          >
                            Enroll in {course.name} &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
};
