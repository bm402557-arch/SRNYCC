import React, { useState } from 'react';
import { 
  GraduationCap, Phone, Mail, Clock, Menu, X, User, 
  ShieldCheck, LogOut, LayoutDashboard, Sparkles, BookOpen, 
  Award, FileText, MapPin 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (role: 'admin' | 'student') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { role, adminUser, studentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'about', label: 'About Us', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'admission', label: 'Admission', icon: FileText },
    { id: 'verify', label: 'Verify Certificate', icon: Award },
    { id: 'contact', label: 'Contact Us', icon: MapPin },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Govt. Registered & ISO 9001:2015 Certified Youth Computer Centre
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Mon - Sat: 8:00 AM - 8:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+919876543210" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 98765 43210</span>
            </a>
            <a href="mailto:info@srknycc.org" className="hidden md:flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>info@srknycc.org</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Institute Brand Title */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 flex items-center justify-center text-amber-400 shadow-md border border-amber-400/30 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                ESTD. 2012 • ISO 9001:2015
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight uppercase group-hover:text-blue-900 transition-colors">
                SHRI RAMKRISHNA NATIONAL YOUTH
                <span className="block text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                  COMPUTER CENTRE
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth Buttons / Portals */}
          <div className="hidden md:flex items-center gap-2.5">
            {role === 'admin' && adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="header-admin-dashboard-btn"
                  onClick={() => setActiveTab('admin-dashboard')}
                  className="px-3.5 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-950 flex items-center gap-2 shadow-xs transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  Admin Dashboard
                </button>
                <button
                  id="header-logout-btn"
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : role === 'student' && studentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="header-student-dashboard-btn"
                  onClick={() => setActiveTab('student-dashboard')}
                  className="px-3.5 py-2 rounded-lg bg-indigo-900 text-white text-sm font-semibold hover:bg-indigo-950 flex items-center gap-2 shadow-xs transition-colors"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  Student Portal ({studentUser.name.split(' ')[0]})
                </button>
                <button
                  id="header-student-logout-btn"
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-student-login-btn"
                  onClick={() => openAuthModal('student')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  Student Login
                </button>
                <button
                  id="header-admin-login-btn"
                  onClick={() => openAuthModal('admin')}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  Admin Login
                </button>
                <button
                  id="header-apply-now-btn"
                  onClick={() => setActiveTab('admission')}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm hover:shadow transition-all uppercase tracking-wider"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex items-center lg:hidden gap-2">
            {role !== 'guest' ? (
              <button
                onClick={() => setActiveTab(role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                className="px-2.5 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-md"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('admission')}
                className="px-2.5 py-1.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-md"
              >
                Apply
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {role === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-blue-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 text-red-600 text-sm font-medium border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : role === 'student' ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  Student Portal ({studentUser?.name})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 text-red-600 text-sm font-medium border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal('student');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold text-center"
                >
                  Student Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold text-center"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
