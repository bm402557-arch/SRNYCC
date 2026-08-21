import React from 'react';
import { 
  GraduationCap, Phone, Mail, MapPin, Clock, 
  ShieldCheck, Award, ExternalLink, ArrowRight, Heart 
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (role: 'admin' | 'student') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openAuthModal }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 no-print pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Institute About & Badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm leading-tight uppercase">
                  SHRI RAMKRISHNA NATIONAL YOUTH
                  <span className="block text-xs text-amber-400">COMPUTER CENTRE</span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students, youth, and working professionals with industry-recognized, practical computer applications, accounting software, and IT skill certifications since 2012.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>ISO 9001:2015 Certified Organization</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Regd. Vocational & Youth Training Centre</span>
              </div>
            </div>
          </div>

          {/* Col 2: Featured Courses */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Popular Courses
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Diploma in Computer Application (DCA)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Tally Prime with GST & Inventory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  MS Office Specialist (Word, Excel, PPT)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Basic Computer Fundamentals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('admission')}
                  className="mt-2 text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Online Admission Form 2026-27 &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Verification */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Portals & Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('verify')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Online Certificate Verification
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openAuthModal('student')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Student Portal & Marksheets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openAuthModal('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Staff / Admin Management Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('admission')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Track Admission Application
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('about')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  About Our Practical Lab & Faculty
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Head Centre & Helpdesk
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Shri Ramkrishna National Youth Computer Centre Main Campus, Vivekananda Sarani, Central Road, Kolkata, WB - 700001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">+91 98765 43210 / +91 98301 23456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-200">admissions@srknycc.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon - Sat: 8:00 AM – 8:00 PM (Sunday Open for Weekend Batches)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">ISO 9001:2015 Certified Educational Institution</span>
            <span>•</span>
            <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors">Help Desk</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
