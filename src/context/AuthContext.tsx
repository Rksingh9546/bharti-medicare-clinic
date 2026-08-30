import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  signInWithGoogle as firebaseSignInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser,
  onAuthStateChanged,
  type FirebaseUser
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInDemoPatient: () => void;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    // Check if demo user saved in session
    const demoUser = sessionStorage.getItem('medicare_demo_user');
    if (demoUser) {
      try {
        setUser(JSON.parse(demoUser));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Patient',
          photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          role: 'patient',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        sessionStorage.removeItem('medicare_demo_user');
      } else if (!demoUser) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInGoogle = async () => {
    const res = await firebaseSignInWithGoogle();
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to sign in' };
  };

  const signInEmail = async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to sign in' };
  };

  const signUpEmail = async (name: string, email: string, pass: string) => {
    const res = await registerWithEmail(name, email, pass);
    if (res.user) {
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to create account' };
  };

  const signInDemoPatient = () => {
    const demo: UserProfile = {
      uid: 'demo-patient-001',
      email: 'muskii@patient.com',
      displayName: 'Muskii',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phoneNumber: '+91 9508016528',
      role: 'patient',
      createdAt: new Date().toISOString()
    };
    setUser(demo);
    sessionStorage.setItem('medicare_demo_user', JSON.stringify(demo));
    closeAuthModal();
  };

  const logout = async () => {
    sessionStorage.removeItem('medicare_demo_user');
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      signInGoogle,
      signInEmail,
      signUpEmail,
      signInDemoPatient,
      logout,
      openAuthModal,
      closeAuthModal,
      isAuthModalOpen,
      authModalMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
