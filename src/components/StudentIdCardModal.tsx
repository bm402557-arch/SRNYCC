import React from 'react';
import { X, IdCard } from 'lucide-react';
import { Student } from '../types';
import { StudentIdCardView } from './StudentIdCardView';

interface StudentIdCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  onClose,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <IdCard className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide">
                Digital PVC Student Identity Card
              </h3>
              <p className="text-[11px] text-slate-400">
                {student.name} • <span className="font-mono text-amber-300">{student.studentId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <StudentIdCardView
            student={student}
            onClose={onClose}
            isModal={true}
          />
        </div>

      </div>
    </div>
  );
};
