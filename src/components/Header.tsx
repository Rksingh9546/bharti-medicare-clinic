import React, { useState } from 'react';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Search, 
  CalendarPlus, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Pill, 
  Stethoscope, 
  Home as HomeIcon,
  ChevronDown
} from 'lucide-react';
import { NavSection } from '../types';
import { CLINIC_INFO } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  onOpenBooking: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenBooking,
  onOpenSearch
}) => {
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: NavSection; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'doctors', label: 'Doctors & Services', icon: Stethoscope },
    { id: 'medicines', label: 'Medicine Store', icon: Pill },
    { id: 'appointments', label: 'Appointments & Account', icon: CalendarPlus },
  ];

  const handleNavClick = (section: NavSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-100 transition-all">
      {/* Top Notification & Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{CLINIC_INFO.address}</span>
            </div>
            <a href={`tel:${CLINIC_INFO.phone}`} className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            <a href={`mailto:${CLINIC_INFO.email}`} className="hidden md:flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{CLINIC_INFO.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{CLINIC_INFO.workingHours}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-700 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>24/7 Urgent Care Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:bg-teal-700 transition-all transform group-hover:scale-105">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">Bharti Medicare</span>
            </div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block -mt-1">MULTI-SPECIALTY CLINIC</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'text-teal-700 bg-teal-50 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            id="header-search-btn"
            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Search doctors, services & medicines"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                id="user-profile-menu-btn"
                className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt={user.displayName || 'Patient'}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-500/20"
                />
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden sm:inline">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('appointments');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <CalendarPlus className="w-4 h-4 text-teal-600" />
                    <span>My Appointments & Records</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('medicines');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Manage My Medicines</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              id="header-sign-in-btn"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-teal-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Book Appointment CTA Button (Matches Teal Button in Reference) */}
          <button
            onClick={onOpenBooking}
            id="header-book-appointment-cta"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm hover:shadow-md shadow-teal-600/20 transition-all transform active:scale-98"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-teal-600 text-white font-bold text-sm shadow-sm"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book an Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
