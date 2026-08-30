import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DoctorsServicesSection } from './components/DoctorsServicesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { MedicineStoreSection } from './components/MedicineStoreSection';
import { AppointmentsAccountSection } from './components/AppointmentsAccountSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';
import { Medicine, Appointment, Doctor, ClinicService, NavSection } from './types';
import { subscribeToMedicines, subscribeToAppointments } from './services/firestoreService';
import { INITIAL_MEDICINES } from './data/mockData';

function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Subscribe to real-time medicines from Firestore
  useEffect(() => {
    const unsub = subscribeToMedicines((updatedMeds) => {
      setMedicines(updatedMeds);
    });
    return () => unsub();
  }, []);

  // Subscribe to real-time appointments for user
  useEffect(() => {
    const unsub = subscribeToAppointments(user?.uid, (updatedAppts) => {
      setAppointments(updatedAppts);
    });
    return () => unsub();
  }, [user?.uid]);

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setActiveSection('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookService = (service: ClinicService) => {
    setActiveSection('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingCTA = () => {
    setActiveSection('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Bar & Main Header Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenBooking={handleOpenBookingCTA}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area Based on Section */}
      <main className="flex-1">
        {activeSection === 'home' && (
          <>
            {/* Hero Section matching user design reference */}
            <HeroSection
              onExploreServices={() => setActiveSection('doctors')}
              onExploreMedicines={() => setActiveSection('medicines')}
              onAppointmentBooked={() => {}}
            />

            {/* Doctors & Services Overview */}
            <DoctorsServicesSection
              onBookDoctor={handleBookDoctor}
              onBookService={handleBookService}
            />

            {/* Why Choose Us & Modern Clinic Showcase */}
            <WhyChooseUsSection />

            {/* Medicine Store & Healthcare Supplies Section */}
            <MedicineStoreSection medicines={medicines} />

            {/* What Our Patients Say Testimonials */}
            <TestimonialsSection />
          </>
        )}

        {activeSection === 'doctors' && (
          <>
            <div className="bg-slate-900 text-white py-12 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Specialized Medical Care</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Medical Specialists & Clinical Services</h1>
                <p className="text-slate-400 text-sm max-w-2xl mt-2">
                  Meet our dedicated doctors, learn about advanced diagnostic equipment, and reserve priority consultation slots.
                </p>
              </div>
            </div>
            <DoctorsServicesSection
              onBookDoctor={handleBookDoctor}
              onBookService={handleBookService}
            />
            <WhyChooseUsSection />
          </>
        )}

        {activeSection === 'medicines' && (
          <>
            <div className="bg-slate-900 text-white py-12 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Clinic Pharmacy</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Medicine Store & Healthcare Supplies</h1>
                  <p className="text-slate-400 text-sm max-w-2xl mt-2">
                    Browse authentic medications, inquire via phone with our on-duty pharmacist, or add unlisted medicines.
                  </p>
                </div>
              </div>
            </div>
            <MedicineStoreSection medicines={medicines} />
          </>
        )}

        {activeSection === 'appointments' && (
          <>
            <div className="bg-slate-900 text-white py-12 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Bharti Medicare Patient Portal</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Appointments & Account Management</h1>
                <p className="text-slate-400 text-sm max-w-2xl mt-2">
                  Book online consultations with certified physicians, track reservation history, and manage your patient profile.
                </p>
              </div>
            </div>
            <AppointmentsAccountSection
              appointments={appointments}
              medicines={medicines}
              initialDoctor={selectedDoctorForBooking}
              onNavigateToMedicines={() => setActiveSection('medicines')}
            />
          </>
        )}
      </main>

      {/* Conversion-focused Footer */}
      <Footer
        onNavigate={setActiveSection}
        onOpenBooking={handleOpenBookingCTA}
      />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        medicines={medicines}
        onSelectDoctor={(doc) => {
          handleBookDoctor(doc);
        }}
        onSelectService={(serv) => {
          handleBookService(serv);
        }}
        onSelectMedicine={(med) => {
          setActiveSection('medicines');
        }}
        onNavigate={setActiveSection}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
