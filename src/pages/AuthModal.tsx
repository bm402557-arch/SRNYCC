import React, { useState } from 'react';
import { 
  X, Lock, User, Shield, GraduationCap, AlertCircle, 
  CheckCircle2, ArrowRight, KeyRound, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'admin' | 'student';
  onLoginSuccess?: (role: 'admin' | 'student') => void;
  onSuccess?: (role: 'admin' | 'student') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialRole = 'student',
  onLoginSuccess,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Update active tab when initialRole changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialRole);
      setErrorMsg('');
      if (initialRole === 'admin') {
        setUsername('admin');
        setPassword('admin123');
      } else {
        setUsername('');
        setPassword('');
      }
    }
  }, [isOpen, initialRole]);

  const { loginAdmin, loginStudent } = useAuth();

  if (!isOpen) return null;

  const handleSuccessCallback = (role: 'admin' | 'student') => {
    if (onLoginSuccess) onLoginSuccess(role);
    if (onSuccess) onSuccess(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowForgotNotice(false);

    if (!username.trim()) {
      setErrorMsg(activeTab === 'admin' ? 'Please enter Admin username' : 'Please enter Student ID or Registered Mobile');
      return;
    }

    setLoading(true);

    if (activeTab === 'admin') {
      const res = await loginAdmin(username.trim(), password.trim());
      setLoading(false);
      if (res.success) {
        handleSuccessCallback('admin');
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } else {
      const res = await loginStudent(username.trim(), password.trim());
      setLoading(false);
      if (res.success) {
        handleSuccessCallback('student');
        onClose();
      } else {
        setErrorMsg(res.message || 'Student not found or incorrect password');
      }
    }
  };

  const fillQuickDemo = (role: 'admin' | 'student', id: string, pass: string) => {
    setActiveTab(role);
    setUsername(id);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">Official Portal</span>
              <h2 className="text-base font-bold text-white uppercase">SHRI RAMKRISHNA NYCC</h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Secure login for students, faculty & administrative personnel.
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              id="auth-tab-student"
              onClick={() => { setActiveTab('student'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'student'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student Login
            </button>
            <button
              type="button"
              id="auth-tab-admin"
              onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {activeTab === 'admin' ? 'Admin Username / Email' : 'Student ID or Mobile Number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  id="auth-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'e.g. admin' : 'e.g. SRKNYCC-2026-0001 or 9876543210'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  id="auth-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            {showForgotNotice && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Password Assistance:
                </p>
                <p>
                  • <strong>Students:</strong> Default password is <code className="bg-amber-200 px-1 py-0.5 rounded text-slate-900">student123</code>. You can also contact the centre reception with your Student ID to reset.
                </p>
                <p>
                  • <strong>Admin:</strong> Demo credentials are <code className="bg-amber-200 px-1 py-0.5 rounded text-slate-900">admin</code> / <code className="bg-amber-200 px-1 py-0.5 rounded text-slate-900">admin123</code>.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin' 
                  ? 'bg-blue-900 hover:bg-blue-950' 
                  : 'bg-indigo-900 hover:bg-indigo-950'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to {activeTab === 'admin' ? 'Admin Portal' : 'Student Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Test Credentials (Demo)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                id="demo-admin-btn"
                onClick={() => fillQuickDemo('admin', 'admin', 'admin123')}
                className="p-2 text-left bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-blue-900">Admin Login</div>
                <div className="text-[11px] text-slate-500">admin / admin123</div>
              </button>

              <button
                type="button"
                id="demo-student1-btn"
                onClick={() => fillQuickDemo('student', 'SRKNYCC-2026-0001', 'student123')}
                className="p-2 text-left bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-indigo-900">Rahul (DCA)</div>
                <div className="text-[11px] text-slate-500">SRKNYCC-2026-0001</div>
              </button>

              <button
                type="button"
                id="demo-student2-btn"
                onClick={() => fillQuickDemo('student', 'SRKNYCC-2026-0002', 'student123')}
                className="p-2 text-left bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-indigo-900">Priya (Tally)</div>
                <div className="text-[11px] text-slate-500">SRKNYCC-2026-0002</div>
              </button>

              <button
                type="button"
                id="demo-student3-btn"
                onClick={() => fillQuickDemo('student', 'SRKNYCC-2026-0004', 'student123')}
                className="p-2 text-left bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors"
              >
                <div className="font-bold text-indigo-900">Sneha (Basic)</div>
                <div className="text-[11px] text-slate-500">SRKNYCC-2026-0004</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
