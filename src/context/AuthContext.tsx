import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, Student, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  role: UserRole;
  userRole: UserRole;
  adminUser: AdminUser | null;
  currentAdmin: AdminUser | null;
  studentUser: Student | null;
  currentStudent: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAdmin: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginStudent: (studentIdOrMobile: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshStudentProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [studentUser, setStudentUser] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore auth from localStorage on boot
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('srknycc_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.role === 'admin' && parsed.user) {
          setRole('admin');
          setAdminUser(parsed.user);
        } else if (parsed.role === 'student' && parsed.user) {
          setRole('student');
          setStudentUser(parsed.user);
        }
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = async (username: string, password?: string) => {
    try {
      const res = await api.login('admin', username, password);
      if (res.success && res.user) {
        setRole('admin');
        setAdminUser(res.user);
        setStudentUser(null);
        localStorage.setItem('srknycc_auth', JSON.stringify({ role: 'admin', user: res.user }));
        return { success: true };
      }
      return { success: false, message: res.message || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server connection error' };
    }
  };

  const loginStudent = async (studentIdOrMobile: string, password?: string) => {
    try {
      const res = await api.login('student', studentIdOrMobile, password);
      if (res.success && res.user) {
        setRole('student');
        setStudentUser(res.user);
        setAdminUser(null);
        localStorage.setItem('srknycc_auth', JSON.stringify({ role: 'student', user: res.user }));
        return { success: true };
      }
      return { success: false, message: res.message || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server connection error' };
    }
  };

  const refreshStudentProfile = async () => {
    if (studentUser?.studentId) {
      try {
        const res = await api.getStudent(studentUser.studentId);
        if (res.success && res.student) {
          setStudentUser(res.student);
          localStorage.setItem('srknycc_auth', JSON.stringify({ role: 'student', user: res.student }));
        }
      } catch (err) {
        console.error('Error refreshing student profile', err);
      }
    }
  };

  const logout = () => {
    setRole('guest');
    setAdminUser(null);
    setStudentUser(null);
    localStorage.removeItem('srknycc_auth');
  };

  return (
    <AuthContext.Provider value={{
      role,
      userRole: role,
      adminUser,
      currentAdmin: adminUser,
      studentUser,
      currentStudent: studentUser,
      isAuthenticated: role !== 'guest',
      isLoading,
      loginAdmin,
      loginStudent,
      logout,
      refreshStudentProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
