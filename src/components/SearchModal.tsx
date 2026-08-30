import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Stethoscope, 
  Pill, 
  Building2, 
  ArrowRight,
  Star,
  ChevronRight
} from 'lucide-react';
import { DOCTORS, INITIAL_SERVICES } from '../data/mockData';
import { Doctor, ClinicService, Medicine, NavSection } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectService: (service: ClinicService) => void;
  onSelectMedicine: (medicine: Medicine) => void;
  onNavigate: (section: NavSection) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  medicines,
  onSelectDoctor,
  onSelectService,
  onSelectMedicine,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredDoctors = query.trim() ? DOCTORS.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.department.toLowerCase().includes(query.toLowerCase()) ||
    d.specialization.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const filteredServices = query.trim() ? INITIAL_SERVICES.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.department.toLowerCase().includes(query.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const filteredMedicines = query.trim() ? medicines.filter(m => 
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    (m.genericName && m.genericName.toLowerCase().includes(query.toLowerCase())) ||
    m.category.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const totalResults = filteredDoctors.length + filteredServices.length + filteredMedicines.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 max-h-[80vh] flex flex-col">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search doctors, clinical services, or pharmacy medications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base outline-hidden text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {!query.trim() ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Dr. Rajesh Sharma', 'Cardiology & ECG', 'Dr. Ananya Iyer', 'Paracetamol 650mg', 'NABL Diagnostic Pathology', 'Ayurvedic & Immunity', 'Pediatrics', 'Diabetes Care'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="font-bold text-slate-700">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for specialty, symptom, doctor name, or medication.</p>
            </div>
          ) : (
            <>
              {/* Doctors Results */}
              {filteredDoctors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctors ({filteredDoctors.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onClose();
                          onSelectDoctor(doc);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{doc.name}</h4>
                            <p className="text-[11px] text-teal-700">{doc.department} • {doc.specialization}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700 text-xs">₹{doc.consultationFee}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Results */}
              {filteredServices.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                    <Building2 className="w-4 h-4" />
                    <span>Healthcare Services ({filteredServices.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          onClose();
                          onSelectService(service);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 cursor-pointer transition-all"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{service.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{service.shortDescription}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicines Results */}
              {filteredMedicines.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                    <Pill className="w-4 h-4" />
                    <span>Pharmacy Medicines ({filteredMedicines.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredMedicines.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => {
                          onClose();
                          onSelectMedicine(med);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={med.image} alt={med.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{med.name}</h4>
                            <p className="text-[11px] text-teal-700">{med.category} • {med.dosage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-teal-700 text-xs">₹{med.price.toFixed(2)}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
