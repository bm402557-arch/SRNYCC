import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AuthModal } from './pages/AuthModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { AdmissionPage } from './pages/AdmissionPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCourseForAdmission, setSelectedCourseForAdmission] = useState<string>('');
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    initialRole: 'student' | 'admin';
  }>({
    isOpen: false,
    initialRole: 'student'
  });

  const { isAuthenticated, userRole, currentStudent } = useAuth();

  const handleOpenAuth = (role: 'student' | 'admin') => {
    setAuthModalState({
      isOpen: true,
      initialRole: role
    });
  };

  const handleCloseAuth = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleAuthSuccess = (role?: 'admin' | 'student') => {
    if (role === 'admin' || userRole === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (role === 'student' || userRole === 'student') {
      setActiveTab('student-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* Institutional Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            setSelectedCourseForAdmission={setSelectedCourseForAdmission}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'courses' && (
          <CoursesPage
            setActiveTab={setActiveTab}
            setSelectedCourseForAdmission={setSelectedCourseForAdmission}
          />
        )}

        {activeTab === 'admission' && (
          <AdmissionPage
            selectedCourseId={selectedCourseForAdmission}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'verify' && (
          <CertificateVerifyPage />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {activeTab === 'admin-dashboard' && (
          isAuthenticated && userRole === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
              <h2 className="text-xl font-bold uppercase text-slate-900">Administrator Access Required</h2>
              <p className="text-xs text-slate-600">Please authenticate with administrator credentials to access the management portal.</p>
              <button
                onClick={() => handleOpenAuth('admin')}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Open Admin Login
              </button>
            </div>
          )
        )}

        {activeTab === 'student-dashboard' && (
          isAuthenticated && userRole === 'student' && currentStudent ? (
            <StudentDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
              <h2 className="text-xl font-bold uppercase text-slate-900">Student Portal Sign-In</h2>
              <p className="text-xs text-slate-600">Please sign in with your registered Student ID and password to access your dashboard, attendance, fees, and notes.</p>
              <button
                onClick={() => handleOpenAuth('student')}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Open Student Login
              </button>
            </div>
          )
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
      />

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingActions />

      {/* Login & Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialRole={authModalState.initialRole}
        onClose={handleCloseAuth}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
