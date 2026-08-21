import React from 'react';
import { 
  GraduationCap, Target, Eye, Award, CheckCircle2, 
  ShieldCheck, Users, Laptop, Sparkles, Building2, 
  Clock, BookOpen, ArrowRight 
} from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Top Page Header */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <GraduationCap className="w-4 h-4" />
            About Our Institution
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Bridging the digital divide and enabling job-oriented IT skills, computerized accounting, and office automation since 2012.
          </p>
        </div>
      </section>

      {/* Main Narrative & History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4 text-slate-700 text-sm leading-relaxed">
            <span className="text-blue-700 font-bold text-xs uppercase tracking-widest block">
              Pioneering Vocational IT Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase leading-tight">
              Practical Computer Education for Every Aspiring Youth
            </h2>
            <p>
              <strong>SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE (SRKNYCC)</strong> is a premier computer training and education centre established with the vision of making computer education accessible, practical, and career-transformative for students, school-leavers, job seekers, and working professionals.
            </p>
            <p>
              In today&apos;s technology-driven world, digital literacy and practical software proficiency are essential prerequisites for nearly every office, corporate, government, and business role. We emphasize real-world assignments over rote memorization, ensuring that every learner attains true confidence on the keyboard, in accounting spreadsheets, and across business software.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="font-bold text-blue-900 text-base">4,800+</div>
                <div className="text-slate-600">Students Successfully Certified</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="font-bold text-amber-900 text-base">100% Practical</div>
                <div className="text-slate-600">Individual Lab Workstation</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                alt="Modern Computer Lab Training at Shri Ramkrishna NYCC"
                className="w-full h-80 object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  State-of-the-Art Training Facility
                </span>
                <h3 className="text-white font-bold text-lg">
                  Advanced Computer Lab & Practical Workstations
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  Air-conditioned environment with dedicated hardware, gigabit internet, and licensed software.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To impart high-quality, practical, industry-relevant computer education and computerized accounting skills to youth and students from all backgrounds at nominal, affordable fees. We aim to equip every student with practical confidence, office productivity skills, and recognized credentials that unlock immediate employment opportunities.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% hands-on learning with one computer per student.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Curricula aligned with current office & business requirements.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Continuous assessment, mock tests, and practical viva.</span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To be recognized as a leading national youth computer training institution that bridges the skill gap in tier-1, tier-2, and rural areas by fostering digital empowerment, technological fluency, and career self-reliance across the nation.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Universal digital literacy across all age groups and backgrounds.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Empower youth to launch careers in IT, data entry, and accounting.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Uncompromising adherence to ISO 9001:2015 educational standards.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Training Environment & Infrastructure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-blue-700 font-bold text-xs uppercase tracking-widest">
            Infrastructure Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase mt-1">
            Our Training Environment
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Engineered specifically to maximize student learning, focus, and practical keyboard time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Individual Workstations</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with high-performance desktop systems, high-definition monitors, ergonomic chairs, and comfortable keyboard trays.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">High-Speed Optical Fiber</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uninterrupted high-speed internet connectivity allowing seamless web research, digital submissions, email training, and cloud computing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Flexible Batches & Extra Lab Time</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Morning, Afternoon, Evening, and exclusive Weekend batches. Students can practice free of charge outside regular lecture hours.
            </p>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-12 text-center p-8 bg-blue-900 rounded-3xl text-white space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold uppercase">
            Ready to Accelerate Your Career?
          </h3>
          <p className="text-blue-200 text-xs sm:text-sm max-w-xl mx-auto">
            Enroll today in our certified diploma and vocational computer courses.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('admission')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Apply for Admission Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
