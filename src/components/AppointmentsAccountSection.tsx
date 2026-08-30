import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  CalendarCheck, 
  CalendarX, 
  UserCheck, 
  Pill, 
  FileText, 
  LogOut, 
  LogIn, 
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight
} from 'lucide-react';
import { Appointment, Doctor, Medicine } from '../types';
import { DEPARTMENTS, DOCTORS, CLINIC_INFO } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { createAppointment, updateAppointment } from '../services/firestoreService';
import confetti from 'canvas-confetti';

interface AppointmentsAccountProps {
  appointments: Appointment[];
  medicines: Medicine[];
  initialDoctor?: Doctor | null;
  onNavigateToMedicines: () => void;
}

export const AppointmentsAccountSection: React.FC<AppointmentsAccountProps> = ({
  appointments,
  medicines,
  initialDoctor,
  onNavigateToMedicines,
}) => {
  const { user, signInGoogle, signInDemoPatient, logout, openAuthModal } = useAuth();

  // Tab state: 'book' | 'my-appointments' | 'profile'
  const [activeTab, setActiveTab] = useState<'book' | 'my-appointments' | 'profile'>('book');

  // Booking Form State
  const [patientName, setPatientName] = useState(user?.displayName || '');
  const [patientPhone, setPatientPhone] = useState(user?.phoneNumber || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(initialDoctor?.department || 'General Medicine');
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctor?.id || DOCTORS[0].id);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [symptoms, setSymptoms] = useState('');
  const [insurance, setInsurance] = useState('Cash / Self-Pay / UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmedAppt, setBookingConfirmedAppt] = useState<Appointment | null>(null);

  // Selected Doctor
  const filteredDoctors = DOCTORS.filter(d => d.department === department || department === '');
  const selectedDoctorObj = DOCTORS.find(d => d.id === selectedDoctorId) || filteredDoctors[0] || DOCTORS[0];

  // User's own appointments
  const userAppointments = appointments.filter(a => {
    if (!user) return true; // show demo/session appointments
    return a.userId === user.uid || !a.userId || a.patientEmail === user.email;
  });

  // User's added medicines
  const userMedicines = medicines.filter(m => {
    if (!user) return false;
    return m.addedByUserId === user.uid || m.addedByUserId === 'demo-patient-001';
  });

  const handleDeptChange = (dept: string) => {
    setDepartment(dept);
    const inDept = DOCTORS.filter(d => d.department === dept);
    if (inDept.length > 0) {
      setSelectedDoctorId(inDept[0].id);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !appointmentDate) {
      alert('Please fill out patient name, phone number, and date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newApptData = {
        userId: user?.uid,
        patientName,
        patientEmail: patientEmail || user?.email || `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.com`,
        patientPhone,
        department,
        doctorId: selectedDoctorObj.id,
        doctorName: selectedDoctorObj.name,
        date: appointmentDate,
        timeSlot,
        symptoms,
        insuranceProvider: insurance,
        status: 'confirmed' as const,
        notes: `Consultation fee: ₹${selectedDoctorObj.consultationFee}`
      };

      const result = await createAppointment(newApptData);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setBookingConfirmedAppt({
        id: result.id || `appt-${Date.now()}`,
        createdAt: Date.now(),
        ...newApptData
      });

      // Clear form
      setSymptoms('');
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      await updateAppointment(id, { status: 'cancelled' });
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <section id="appointments-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Online Patient Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Appointments & Patient Account
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
              Book real-time doctor visits, manage your health records, view past appointments, and update clinical medicine contributions.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'book'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveTab('my-appointments')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all relative ${
                activeTab === 'my-appointments'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Appointments ({userAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              User Account
            </button>
          </div>
        </div>

        {/* TAB 1: BOOK AN APPOINTMENT */}
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Booking Form Card */}
            <div className="lg:col-span-8 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              
              {bookingConfirmedAppt ? (
                <div className="bg-white rounded-2xl p-8 border border-teal-200 shadow-lg text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">OPD Slip Generated & Synchronized</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Appointment Successfully Reserved!</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                      A confirmation SMS and WhatsApp ticket have been sent. Your OPD booking token reference is <strong className="text-slate-900">#BMC-{bookingConfirmedAppt.id.slice(0, 7).toUpperCase()}</strong>.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Patient Name</span>
                      <span className="font-bold text-slate-800 text-sm">{bookingConfirmedAppt.patientName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Doctor & Specialty</span>
                      <span className="font-bold text-teal-700 text-sm">{bookingConfirmedAppt.doctorName}</span>
                      <span className="text-[11px] text-slate-500 block">{bookingConfirmedAppt.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date & Time</span>
                      <span className="font-bold text-slate-800">{bookingConfirmedAppt.date} at {bookingConfirmedAppt.timeSlot}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Location</span>
                      <span className="font-semibold text-slate-700">{CLINIC_INFO.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handlePrintSlip}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Slip</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('my-appointments')}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                    >
                      View All Appointments
                    </button>

                    <button
                      onClick={() => setBookingConfirmedAppt(null)}
                      className="px-4 py-2.5 rounded-xl text-teal-600 hover:bg-teal-50 font-bold text-xs"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="space-y-6">
                  
                  {/* Step 1: Patient Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                      <span>Patient Information</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+91) *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            placeholder="rahul.sharma@example.com"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Department & Doctor */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                      <span>Specialty & Physician Selection</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Department</label>
                        <select
                          value={department}
                          onChange={(e) => handleDeptChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden bg-white font-medium"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Doctor</label>
                        <select
                          value={selectedDoctorId}
                          onChange={(e) => setSelectedDoctorId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden bg-white font-medium"
                        >
                          {filteredDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} (₹{doc.consultationFee})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Date & Slot */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                      <span>Schedule Date & Time Slot</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Available Time Slot</label>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedDoctorObj.timeSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setTimeSlot(slot)}
                              className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                                timeSlot === slot
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Symptoms & Insurance */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                      <span>Symptoms & Insurance (Optional)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description of Symptoms</label>
                        <input
                          type="text"
                          placeholder="e.g. Fever & cough, knee pain, BP checkup"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Insurance / Payment Mode</label>
                        <input
                          type="text"
                          placeholder="e.g. Star Health, Care, HDFC ERGO, Ayushman Bharat, Self-Pay"
                          value={insurance}
                          onChange={(e) => setInsurance(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Confirming Reservation...</span>
                      ) : (
                        <>
                          <CalendarCheck className="w-5 h-5" />
                          <span>Confirm & Book Appointment</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Right Side: Selected Doctor Card & Clinic Help Box */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Doctor Summary Preview */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Physician</h4>
                
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedDoctorObj.image}
                    alt={selectedDoctorObj.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{selectedDoctorObj.name}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{selectedDoctorObj.department}</p>
                    <p className="text-[11px] text-slate-500">{selectedDoctorObj.experienceYears}+ Yrs Clinical Experience</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-bold text-slate-900">₹{selectedDoctorObj.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Languages:</span>
                    <span className="font-medium text-slate-800">{selectedDoctorObj.languages.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rating:</span>
                    <span className="font-bold text-amber-600">★ {selectedDoctorObj.rating} ({selectedDoctorObj.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Need Help Box */}
              <div className="bg-teal-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-300" />
                </div>
                <h4 className="text-base font-bold">Prefer to book via telephone?</h4>
                <p className="text-xs text-teal-200/90 leading-relaxed">
                  Our front-desk appointment coordinators are available from 8:00 AM to 8:00 PM to assist with specialty bookings and urgent cases.
                </p>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="inline-block pt-1 font-bold text-sm text-teal-300 hover:text-white underline"
                >
                  Call {CLINIC_INFO.phone}
                </a>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === 'my-appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Appointment History</h3>
                <p className="text-xs text-slate-500">Live synchronized with Bharti Medicare Clinic OPD queue</p>
              </div>

              <button
                onClick={() => setActiveTab('book')}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>+ Book New Appointment</span>
              </button>
            </div>

            {userAppointments.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">No appointments booked yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Schedule your consultation with one of our specialized physicians in just a few clicks.
                </p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  Schedule Your First Visit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAppointments.map((appt) => {
                  const isCancelled = appt.status === 'cancelled';
                  const isCompleted = appt.status === 'completed';

                  return (
                    <div
                      key={appt.id}
                      className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                        isCancelled
                          ? 'border-slate-200 opacity-60'
                          : 'border-teal-200 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Status Badge & ID */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            #BMC-{appt.id.slice(0, 6).toUpperCase()}
                          </span>
                          
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isCompleted
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}>
                            {appt.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Doctor & Dept */}
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{appt.doctorName}</h4>
                          <p className="text-xs text-teal-700 font-semibold">{appt.department}</p>
                        </div>

                        {/* Schedule details */}
                        <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            <span>{appt.timeSlot}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex justify-between">
                            <span>Patient: {appt.patientName}</span>
                            <span>{appt.patientPhone}</span>
                          </div>
                        </div>

                        {appt.symptoms && (
                          <p className="text-[11px] text-slate-600 italic">
                            Reason: {appt.symptoms}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={handlePrintSlip}
                          className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>

                        {!isCancelled && !isCompleted && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                          >
                            <CalendarX className="w-3.5 h-3.5" />
                            <span>Cancel Visit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER ACCOUNT MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Account Card */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                      alt={user.displayName || 'Patient'}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold uppercase mb-1">
                        Verified Patient
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">{user.displayName}</h3>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account ID:</span>
                      <span className="font-mono text-slate-700">{user.uid.slice(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered:</span>
                      <span className="font-medium text-slate-700">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Appointments:</span>
                      <span className="font-bold text-teal-700">{userAppointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Medicines Contributed:</span>
                      <span className="font-bold text-teal-700">{userMedicines.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Medicare Portal</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 py-6">
                  <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Patient Account Sign In</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Sign in with Google, email, or explore with a 1-click test patient profile to manage appointments and add medicines.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={signInGoogle}
                      className="w-full py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-xs flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Sign In with Google</span>
                    </button>

                    <button
                      onClick={() => openAuthModal('signin')}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Sign In / Sign Up with Email</span>
                    </button>

                    <button
                      onClick={signInDemoPatient}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Instant 1-Click Demo Patient</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Contributed Medicines & Activity */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Added Medicines</h3>
                  <p className="text-xs text-slate-500">Medicines and health supplies you contributed to the store</p>
                </div>

                <button
                  onClick={onNavigateToMedicines}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Go to Store</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {userMedicines.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-100 space-y-2">
                  <Pill className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">You haven’t added any medicines yet.</p>
                  <p className="text-[11px] text-slate-400">If a medicine is missing from the clinic dispensary, you can submit it to the live store.</p>
                  <button
                    onClick={onNavigateToMedicines}
                    className="mt-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs"
                  >
                    Add a Medicine
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userMedicines.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{m.name}</h4>
                          <p className="text-[11px] text-teal-700 font-semibold">{m.category} • ₹{m.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active in Store
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
