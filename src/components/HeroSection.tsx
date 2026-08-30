import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  ArrowRight, 
  ShieldCheck, 
  Ambulance, 
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { CLINIC_INFO, DEPARTMENTS, DOCTORS, FEATURE_RIBBONS } from '../data/mockData';
import { createAppointment } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onExploreServices: () => void;
  onExploreMedicines: () => void;
  onAppointmentBooked?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreServices,
  onExploreMedicines,
  onAppointmentBooked
}) => {
  const { user } = useAuth();
  
  // Hero booking form state
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [department, setDepartment] = useState('Cardiology');
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter doctors by selected department
  const filteredDoctors = DOCTORS.filter(d => d.department === department || department === '');
  const selectedDoctorObj = DOCTORS.find(d => d.id === doctorId) || filteredDoctors[0] || DOCTORS[0];

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const availableInDept = DOCTORS.filter(d => d.department === dept);
    if (availableInDept.length > 0) {
      setDoctorId(availableInDept[0].id);
    }
  };

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !selectedDate) {
      alert('Please fill in your name, phone number, and appointment date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAppointment({
        userId: user?.uid,
        patientName: fullName,
        patientPhone: phone,
        patientEmail: user?.email || `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        department: department,
        doctorId: selectedDoctorObj.id,
        doctorName: selectedDoctorObj.name,
        date: selectedDate,
        timeSlot: timeSlot,
        status: 'confirmed',
        notes: 'Booked via homepage quick scheduler.'
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setBookingSuccess(true);
      if (onAppointmentBooked) onAppointmentBooked();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-100/70 via-white to-white pt-8 pb-16">
      {/* Background soft decorative shapes */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 left-10 -z-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 pb-12">
          
          {/* Left Column: Heading, Intro, Feature Badges */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold tracking-wide uppercase shadow-xs">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <span>Trusted Care, Your Way</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Health, <br />
              <span className="text-teal-600">Our Priority</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              {CLINIC_INFO.subheading}
            </p>

            {/* 3 Key Feature Badges (Matches Reference Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Expert Doctors</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Highly qualified & experienced</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Advanced Facilities</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">State-of-the-art diagnostic tech</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Patient First</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Personalized compassionate care</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreServices}
                id="hero-explore-services-btn"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>View Healthcare Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onExploreMedicines}
                id="hero-medicine-store-btn"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-teal-700 font-bold text-sm border border-teal-200 shadow-xs transition-all flex items-center gap-2"
              >
                <span>Browse Medicine Store</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Doctor Photo & Embedded Quick Appointment Form */}
          <div className="lg:col-span-6 relative flex flex-col md:flex-row items-center justify-center gap-6">
            
            {/* Center Doctor Image with subtle backdrop */}
            <div className="relative w-full max-w-xs md:max-w-sm shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-teal-700/5 aspect-4/5">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=85"
                alt="Lead Doctor Medicare Clinic"
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent"></div>
              
              {/* Doctor credential tag on image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs rounded-xl p-3 shadow-lg border border-white/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{DOCTORS[0].name}</h4>
                    <p className="text-[11px] text-teal-600 font-semibold">{DOCTORS[0].title.split('&')[0]} • {DOCTORS[0].experienceYears}+ Yrs Exp</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="text-amber-500 font-bold text-xs">★ {DOCTORS[0].rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Book an Appointment Card (Matches Right Card in UI Reference) */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-5.5 z-10 transition-all">
              <div className="mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Book Doctor Appointment</h3>
                <p className="text-xs text-slate-500">Fast OPD booking with instant SMS & WhatsApp confirmation.</p>
              </div>

              {bookingSuccess ? (
                <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-900">Appointment Confirmed!</h4>
                  <p className="text-xs text-slate-600">
                    We reserved your visit for <span className="font-semibold text-teal-700">{selectedDate}</span> at <span className="font-semibold text-teal-700">{timeSlot}</span> with <span className="font-semibold">{selectedDoctorObj.name}</span>.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="mt-2 text-xs font-bold text-teal-600 hover:text-teal-700 underline"
                  >
                    Book another appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickBook} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Patient Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Number (+91)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Select Department */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Department</label>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all bg-slate-50/50 appearance-none font-medium"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Doctor */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Doctor</label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all bg-slate-50/50 appearance-none font-medium"
                      >
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization.split(',')[0]})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Choose Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden transition-all bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Choose Time</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden transition-all bg-slate-50/50 font-medium"
                      >
                        {selectedDoctorObj.timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="hero-quick-book-submit-btn"
                    className="w-full mt-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Reserving...</span>
                    ) : (
                      <>
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[10px] text-slate-400">or</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      Call Us: <a href={`tel:${CLINIC_INFO.phone}`} className="text-teal-600 hover:underline">{CLINIC_INFO.phone}</a>
                    </p>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* 4 Feature Ribbon Highlight Cards (Teal Bar in Reference Image) */}
        <div className="mt-4 bg-teal-600 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-teal-500/60">
            {FEATURE_RIBBONS.map((item, idx) => {
              const icons: Record<string, any> = {
                Ambulance: Ambulance,
                Calendar: CalendarCheck,
                ShieldCheck: ShieldCheck,
                UserCheck2: Users
              };
              const IconComp = icons[item.iconName] || ShieldCheck;

              return (
                <div 
                  key={item.title} 
                  className={`flex items-start gap-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
                >
                  <div className="p-3 rounded-xl bg-white/15 border border-white/20 shrink-0 text-white shadow-xs">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs text-teal-100/90 mt-1 leading-snug">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
