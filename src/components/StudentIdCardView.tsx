import React, { useState } from 'react';
import { 
  Printer, Download, Eye, Sparkles, CheckCircle2, 
  ShieldCheck, Phone, MapPin, QrCode, CreditCard, RefreshCw 
} from 'lucide-react';
import { Student } from '../types';
import { printElement, downloadElementAsImage } from '../lib/printUtils';

interface StudentIdCardViewProps {
  student: Student;
  onClose?: () => void;
  isModal?: boolean;
}

export const StudentIdCardView: React.FC<StudentIdCardViewProps> = ({
  student,
  onClose,
  isModal = false
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');
  const [cardTheme, setCardTheme] = useState<'navy' | 'maroon' | 'royal'>('navy');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const containerId = `id-card-container-${student.id}`;
  const frontCardId = `id-card-front-${student.id}`;
  const backCardId = `id-card-back-${student.id}`;

  const handlePrint = () => {
    printElement(containerId, `Student-ID-${student.studentId}-${student.name}`);
  };

  const handleDownloadFront = async () => {
    setIsExporting(true);
    setExportMessage('Generating Front Card PNG...');
    await downloadElementAsImage(frontCardId, `ID-Front-${student.studentId}.png`);
    setIsExporting(false);
    setExportMessage('');
  };

  const handleDownloadBack = async () => {
    setIsExporting(true);
    setExportMessage('Generating Back Card PNG...');
    await downloadElementAsImage(backCardId, `ID-Back-${student.studentId}.png`);
    setIsExporting(false);
    setExportMessage('');
  };

  const handleDownloadBoth = async () => {
    setIsExporting(true);
    setExportMessage('Generating Full ID Card PNG...');
    await downloadElementAsImage(containerId, `ID-Card-Complete-${student.studentId}.png`);
    setIsExporting(false);
    setExportMessage('');
  };

  // Color theme styles
  const themeClasses = {
    navy: {
      bg: 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950',
      border: 'border-amber-400',
      headerBg: 'bg-blue-900/90',
      accentText: 'text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950'
    },
    maroon: {
      bg: 'bg-gradient-to-b from-red-950 via-slate-900 to-rose-950',
      border: 'border-amber-400',
      headerBg: 'bg-red-900/90',
      accentText: 'text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950'
    },
    royal: {
      bg: 'bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950',
      border: 'border-cyan-400',
      headerBg: 'bg-indigo-900/90',
      accentText: 'text-cyan-300',
      badgeBg: 'bg-cyan-400 text-slate-950'
    }
  }[cardTheme];

  return (
    <div className="space-y-6">
      
      {/* Action Toolbar (Hidden during print) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 px-2 font-medium">View:</span>
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'both' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dual Side (Front + Back)
            </button>
            <button
              onClick={() => setViewMode('front')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'front' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Front Only
            </button>
            <button
              onClick={() => setViewMode('back')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'back' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Back Only
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Theme:</span>
            <button
              onClick={() => setCardTheme('navy')}
              className={`w-6 h-6 rounded-full bg-blue-950 border-2 transition-all ${cardTheme === 'navy' ? 'border-amber-400 scale-110 shadow-sm' : 'border-white'}`}
              title="Navy Blue & Gold"
            />
            <button
              onClick={() => setCardTheme('maroon')}
              className={`w-6 h-6 rounded-full bg-red-950 border-2 transition-all ${cardTheme === 'maroon' ? 'border-amber-400 scale-110 shadow-sm' : 'border-white'}`}
              title="Maroon & Gold"
            />
            <button
              onClick={() => setCardTheme('royal')}
              className={`w-6 h-6 rounded-full bg-indigo-900 border-2 transition-all ${cardTheme === 'royal' ? 'border-cyan-400 scale-110 shadow-sm' : 'border-white'}`}
              title="Royal Indigo & Cyan"
            />
          </div>

        </div>

        {/* Print & Download Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          <button
            id="print-student-card-btn"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Student ID Card</span>
          </button>

          <button
            id="download-full-card-btn"
            onClick={handleDownloadBoth}
            disabled={isExporting}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download High-Res PNG</span>
          </button>

          <button
            onClick={handleDownloadFront}
            disabled={isExporting}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Front PNG</span>
          </button>

          <button
            onClick={handleDownloadBack}
            disabled={isExporting}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Back PNG</span>
          </button>

          {isExporting && (
            <span className="text-xs text-blue-700 font-semibold flex items-center gap-1 ml-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{exportMessage}</span>
            </span>
          )}
        </div>
      </div>

      {/* Printable ID Card Container */}
      <div 
        id={containerId} 
        className="flex flex-wrap items-center justify-center gap-8 p-4 printable-card-wrapper"
      >
        
        {/* ======================================================== */}
        {/* FRONT SIDE OF STUDENT IDENTITY CARD                      */}
        {/* ======================================================== */}
        {(viewMode === 'both' || viewMode === 'front') && (
          <div 
            id={frontCardId}
            style={{ width: '340px', minHeight: '520px' }}
            className={`w-[340px] ${themeClasses.bg} text-white rounded-2xl p-4 shadow-xl border-2 ${themeClasses.border} printable-card relative overflow-hidden flex flex-col justify-between select-none`}
          >
            {/* Top Center Logo & Header */}
            <div>
              <div className="text-center pb-2.5 border-b border-amber-400/30">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow-xs">
                    SRK
                  </div>
                  <span className="text-[8px] text-amber-300 font-extrabold tracking-wider uppercase font-mono">
                    ESTD. 2012 • ISO 9001:2015 CERTIFIED
                  </span>
                </div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-tight text-white leading-snug">
                  SHRI RAMKRISHNA NATIONAL YOUTH COMPUTER CENTRE
                </h3>
                <span className="text-[8px] text-slate-300 font-medium block">
                  Regd. Under Society & Youth Development Program
                </span>
              </div>

              {/* Student Photo & Identity Headline */}
              <div className="pt-3 pb-2 flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-22 h-22 rounded-xl object-cover border-2 border-amber-400 shadow-md bg-slate-800"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  {/* Hologram Badge effect */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 border border-white text-slate-950 flex items-center justify-center text-[7px] font-extrabold shadow-sm">
                    ★
                  </div>
                </div>

                <h4 className={`text-base font-extrabold uppercase mt-2 ${themeClasses.accentText} tracking-tight`}>
                  {student.name}
                </h4>

                <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-blue-900 border border-blue-600/80 rounded-md mt-1">
                  <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">STUDENT ID:</span>
                  <span className="text-xs font-mono font-extrabold text-white">{student.studentId}</span>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="bg-black/30 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-[10px] space-y-1.5 text-slate-200 mt-1">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 font-medium">Course:</span>
                  <strong className="text-white text-right max-w-[190px] leading-tight">{student.courseName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Batch Timing:</span>
                  <span className="text-amber-200 font-medium text-right text-[9.5px]">{student.batch}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Guardian:</span>
                  <span className="text-slate-200">{student.parentName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Date of Birth:</span>
                  <span className="text-slate-200">{student.dob} ({student.gender})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Emergency Ph:</span>
                  <span className="text-slate-200 font-mono">{student.mobile}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Admitted:</span>
                  <span className="text-slate-200 font-mono">{student.admissionDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Signatures & Barcode */}
            <div className="pt-2 border-t border-white/15 mt-2">
              {/* Simulated Barcode */}
              <div className="bg-white px-2 py-1 rounded flex flex-col items-center justify-center mb-2">
                <div className="flex items-center justify-center gap-[2px] h-5 w-full">
                  {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,1,3,2,1,4,2,3,1,2,4,1,3].map((w, i) => (
                    <div 
                      key={i} 
                      className="bg-black h-full" 
                      style={{ width: `${w * 1.5}px` }} 
                    />
                  ))}
                </div>
                <span className="text-[7px] text-black font-mono tracking-widest uppercase mt-0.5">
                  *{student.studentId}*
                </span>
              </div>

              <div className="flex items-center justify-between text-[8px] text-slate-300 px-1">
                <div className="text-center">
                  <div className="h-4 border-b border-slate-400/50 w-16 mb-0.5"></div>
                  <span>Student Sign</span>
                </div>
                <div className="text-center">
                  <div className="h-4 border-b border-amber-400/80 w-20 mb-0.5 flex items-end justify-center">
                    <span className="text-[7px] text-amber-300 font-serif italic font-bold">A.K. Sharma</span>
                  </div>
                  <span className="text-amber-300 font-semibold">Center In-Charge</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* BACK SIDE OF STUDENT IDENTITY CARD                       */}
        {/* ======================================================== */}
        {(viewMode === 'both' || viewMode === 'back') && (
          <div 
            id={backCardId}
            style={{ width: '340px', minHeight: '520px' }}
            className={`w-[340px] ${themeClasses.bg} text-white rounded-2xl p-4 shadow-xl border-2 ${themeClasses.border} printable-card relative overflow-hidden flex flex-col justify-between select-none`}
          >
            <div>
              {/* Center Back Header */}
              <div className="text-center pb-2 border-b border-amber-400/30">
                <h4 className="text-[11px] font-extrabold uppercase text-amber-300 tracking-tight">
                  RULES & INSTRUCTIONS
                </h4>
                <span className="text-[8px] text-slate-300">Shri Ramkrishna National Youth Computer Centre</span>
              </div>

              {/* Instructions List */}
              <div className="py-2.5 text-[9.5px] text-slate-200 space-y-2 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>This identity card is mandatory for entry into computer labs and theory classes.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>Minimum 75% lab attendance is mandatory to appear for government recognized examinations.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>This card is non-transferable. In case of loss, immediately report to the administration office.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">4.</span>
                  <span>Keep this card safely until certificate issuance upon successful course completion.</span>
                </div>
              </div>

              {/* Residential & Center Verification Box */}
              <div className="bg-black/30 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-[9.5px] space-y-1.5 text-slate-200 mt-1">
                <div>
                  <span className="text-slate-400 block font-medium">Permanent Address:</span>
                  <span className="text-white line-clamp-2">{student.address || 'Kolkata, West Bengal'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <span className="text-slate-400">Card Validity:</span>
                  <strong className="text-amber-300 font-mono">DECEMBER 2027</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Center Code:</span>
                  <strong className="text-white font-mono">WB-NYCC-7041</strong>
                </div>
              </div>
            </div>

            {/* QR Code & Center Address Footer */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                  {/* Digital QR Code Pattern */}
                  <div className="w-full h-full border border-slate-900 p-0.5 grid grid-cols-5 gap-0.5 bg-white">
                    {[1,1,1,0,1, 1,0,1,1,1, 1,1,0,0,1, 0,1,1,0,1, 1,1,1,1,1].map((filled, idx) => (
                      <div 
                        key={idx} 
                        className={filled ? 'bg-slate-950' : 'bg-transparent'} 
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[8.5px] text-slate-300 leading-tight">
                  <strong className="text-amber-300 block text-[9.5px]">Digital Verification</strong>
                  <span>Scan to verify student enrollment and certificate credentials.</span>
                  <span className="text-slate-400 block mt-0.5 font-mono">srknycc.org/verify</span>
                </div>
              </div>

              <div className="text-center text-[8px] text-slate-400 pt-1 leading-snug">
                <strong>Campus:</strong> Vivekananda Sarani, Central Road, Kolkata, WB - 700001<br />
                <strong>Helpline:</strong> +91 98765 43210 • <strong>Email:</strong> info@srknycc.org
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
