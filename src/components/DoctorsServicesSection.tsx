import React, { useState } from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  Baby, 
  Bone, 
  Sparkles, 
  FlaskConical, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2, 
  X,
  Phone,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { DOCTORS, INITIAL_SERVICES, DEPARTMENTS } from '../data/mockData';
import { ClinicService, Doctor } from '../types';

interface DoctorsServicesProps {
  onBookDoctor: (doctor: Doctor) => void;
  onBookService: (service: ClinicService) => void;
}

export const DoctorsServicesSection: React.FC<DoctorsServicesProps> = ({
  onBookDoctor,
  onBookService,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'services' | 'doctors'>('services');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ClinicService | null>(null);
  const [selectedDoctorModal, setSelectedDoctorModal] = useState<Doctor | null>(null);

  // Icon mapping
  const serviceIcons: Record<string, any> = {
    Stethoscope: Stethoscope,
    HeartPulse: HeartPulse,
    Baby: Baby,
    Bone: Bone,
    Sparkles: Sparkles,
    FlaskConical: FlaskConical,
  };

  const filteredDoctors = selectedDeptFilter === 'All'
    ? DOCTORS
    : DOCTORS.filter(d => d.department.toLowerCase().includes(selectedDeptFilter.toLowerCase()) || selectedDeptFilter.toLowerCase().includes(d.department.toLowerCase()));

  const filteredServices = selectedDeptFilter === 'All'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter(s => s.department.toLowerCase().includes(selectedDeptFilter.toLowerCase()) || selectedDeptFilter.toLowerCase().includes(s.department.toLowerCase()));

  return (
    <section id="doctors-and-services" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Comprehensive Healthcare</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Services & Expert Doctors
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
              From general consultations to specialized cardiovascular and pediatric care, our accredited physicians provide world-class medical support.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'services'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Healthcare Services ({INITIAL_SERVICES.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'doctors'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor Specialists ({DOCTORS.length})
            </button>
          </div>
        </div>

        {/* Department Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedDeptFilter('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedDeptFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Specialties
          </button>
          {DEPARTMENTS.slice(0, 6).map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedDeptFilter === dept
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* TAB 1: SERVICES VIEW */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = serviceIcons[service.iconName] || Stethoscope;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Icon & Starting Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        From ₹{service.startingPrice}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Treatment Pills Preview */}
                    <div className="mt-4 space-y-1.5">
                      {service.treatmentList.slice(0, 2).map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedServiceModal(service)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onBookService(service)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 text-xs font-bold transition-all"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DOCTORS VIEW */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Doctor Photo */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">({doc.reviewsCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {doc.department}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{doc.bio}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Experience</span>
                        <span className="font-bold text-slate-800">{doc.experienceYears}+ Years</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Consultation</span>
                        <span className="font-bold text-teal-700">₹{doc.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctorModal(doc)}
                      className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onBookDoctor(doc)}
                      className="flex-1 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Doctor</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedServiceModal.title}</h3>
                  <span className="text-xs text-teal-600 font-semibold">{selectedServiceModal.department}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service Overview</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedServiceModal.fullDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Treatments & Procedures</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedServiceModal.treatmentList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-teal-50/50 border border-teal-100/50 text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Typical Duration</span>
                  <span className="font-bold text-slate-800">{selectedServiceModal.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Starting Consultation</span>
                  <span className="font-bold text-teal-700 text-sm">₹{selectedServiceModal.startingPrice}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedServiceModal;
                  setSelectedServiceModal(null);
                  onBookService(s);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Schedule This Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Profile Modal */}
      {selectedDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctorModal.image}
                  alt={selectedDoctorModal.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedDoctorModal.name}</h3>
                  <p className="text-xs font-semibold text-teal-700">{selectedDoctorModal.title}</p>
                  <p className="text-xs text-slate-500">{selectedDoctorModal.specialization}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Physician Biography</h4>
                <p className="text-slate-600 leading-relaxed">{selectedDoctorModal.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block">Education & Residency</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedDoctorModal.education}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Languages Spoken</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedDoctorModal.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Available Clinic Days</span>
                  <span className="font-semibold text-teal-700 text-xs">{selectedDoctorModal.availableDays.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Standard Fee</span>
                  <span className="font-bold text-slate-900 text-sm">₹{selectedDoctorModal.consultationFee}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Available Consultation Hours</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctorModal.timeSlots.map((slot) => (
                    <span key={slot} className="px-3 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const d = selectedDoctorModal;
                  setSelectedDoctorModal(null);
                  onBookDoctor(d);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
