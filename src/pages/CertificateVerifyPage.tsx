import React, { useState } from 'react';
import { 
  Award, ShieldCheck, Search, CheckCircle2, AlertCircle, 
  Printer, User, Calendar, GraduationCap, QrCode, Check 
} from 'lucide-react';
import { Certificate } from '../types';
import { api } from '../lib/api';

export const CertificateVerifyPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setCert(null);

    try {
      const res = await api.verifyCertificate(query.trim());
      setLoading(false);
      if (res.success && res.certificate) {
        setCert(res.certificate);
      } else {
        setErrorMsg(res.message || 'No official certificate record found matching this Number or Student ID.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Failed to query certificate records.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 no-print">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <ShieldCheck className="w-4 h-4" />
            ISO 9001:2015 Verification Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Online Certificate Verification
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Verify the authenticity of diplomas and certificates issued by <strong>Shri Ramkrishna National Youth Computer Centre</strong>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto no-print space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Certificate Number or Student ID
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              id="cert-verify-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SRK-CERT-2026-0045 or SRKNYCC-2026-0004"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              id="cert-verify-submit-btn"
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span>Quick Demo:</span>
            <button
              type="button"
              onClick={() => setQuery('SRK-CERT-2026-0045')}
              className="text-blue-700 font-bold hover:underline"
            >
              SRK-CERT-2026-0045
            </button>
            <span>or</span>
            <button
              type="button"
              onClick={() => setQuery('SRKNYCC-2026-0004')}
              className="text-blue-700 font-bold hover:underline"
            >
              SRKNYCC-2026-0004
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Certificate Display Card */}
        {cert && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Authenticity Badge Banner */}
            <div className="max-w-2xl mx-auto p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center justify-between no-print shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Official Record Verified</h4>
                  <p className="text-xs text-emerald-800">
                    This certificate is genuine and officially recorded in the SRKNYCC central database.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>

            {/* Official Certificate Layout */}
            <div className="max-w-3xl mx-auto bg-white border-8 border-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden printable-card">
              
              {/* Gold decorative border insets */}
              <div className="absolute inset-2 border-2 border-amber-500/60 pointer-events-none rounded-2xl" />
              <div className="absolute inset-3 border border-amber-400/30 pointer-events-none rounded-xl" />

              {/* Watermark Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <GraduationCap className="w-96 h-96 text-slate-900" />
              </div>

              {/* Certificate Content */}
              <div className="relative z-10 text-center space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-blue-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-md mb-3">
                    <GraduationCap className="w-9 h-9" />
                  </div>
                  <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                    Govt. Regd. • ISO 9001:2015 Certified Educational Institution
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading tracking-wider uppercase">
                    SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
                  </h2>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Centre of Practical Computer Education & Vocational Skill Excellence
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="py-2">
                  <span className="inline-block border-b-2 border-amber-500 pb-1 text-base sm:text-lg font-extrabold text-blue-950 font-heading tracking-widest uppercase">
                    CERTIFICATE OF PROFICIENCY
                  </span>
                </div>

                {/* Student Award text */}
                <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed max-w-xl mx-auto">
                  <p>This is to proudly certify that</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-950 font-heading border-b border-slate-300 pb-1 inline-block px-4">
                    {cert.studentName}
                  </p>
                  <p>
                    bearing Student ID <strong>{cert.studentId}</strong> has successfully completed the prescribed course curriculum and practical examinations for:
                  </p>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl my-2">
                    <span className="text-base sm:text-lg font-extrabold text-blue-900 uppercase block">
                      {cert.courseName}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Duration: {cert.duration}
                    </span>
                  </div>
                  <p>
                    and has secured Grade <strong>{cert.grade}</strong> ({cert.percentage}%) with commendable practical problem-solving competency.
                  </p>
                </div>

                {/* Footer Details: Date, Cert No & Signatures */}
                <div className="pt-8 grid grid-cols-3 items-end text-left text-xs gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Issue Date</span>
                    <strong className="text-slate-900">{cert.issueDate}</strong>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mt-2">Certificate No.</span>
                    <strong className="text-blue-950 font-mono text-[11px]">{cert.certificateNumber}</strong>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-600/60 bg-amber-50 text-amber-900 mx-auto flex flex-col items-center justify-center text-[8px] font-bold uppercase p-1">
                      <span>SRKNYCC</span>
                      <ShieldCheck className="w-4 h-4 text-amber-700 my-0.5" />
                      <span>SEAL</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="w-32 border-b border-slate-400 ml-auto mb-1"></div>
                    <span className="text-[11px] font-bold text-slate-900 block">Exam Controller</span>
                    <span className="text-[9px] text-slate-500 block">Shri Ramkrishna NYCC</span>
                  </div>
                </div>

                {/* Bottom Verification Hash */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Verification Hash: {cert.verificationCode}</span>
                  <span>Verifiable at www.srknycc.org/verify</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </section>

    </div>
  );
};
