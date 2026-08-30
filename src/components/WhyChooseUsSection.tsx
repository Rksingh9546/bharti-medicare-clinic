import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Play, 
  Award, 
  Users, 
  HeartHandshake, 
  UserCheck, 
  Sparkles,
  X,
  ShieldCheck
} from 'lucide-react';
import { STATS } from '../data/mockData';

export const WhyChooseUsSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const statIcons: Record<string, any> = {
    Award: Award,
    UserCheck: UserCheck,
    Users: Users,
    HeartHandshake: HeartHandshake,
  };

  const keyPoints = [
    'Experienced & Caring Doctors',
    'Modern Equipment & Facilities',
    'Personalized Treatment Plans',
    'Comfortable & Friendly Environment'
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Clinic Facility Image with Video Play Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                alt="Medicare Clinic Modern Facility & Reception"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay with Medicare Clinic branding */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">NABH & NABL Certified</span>
                    <h4 className="text-base font-bold">Bharti Medicare Clinic</h4>
                  </div>
                  
                  {/* Play Video Button */}
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    id="watch-clinic-video-btn"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 text-slate-900 hover:bg-teal-500 hover:text-white text-xs font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span>Watch Facility Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border-2 border-white">
              <ShieldCheck className="w-7 h-7 text-teal-200" />
              <div>
                <p className="text-xs font-bold">100% NABH & ISO Standards</p>
                <p className="text-[10px] text-teal-100">Sterilized OPD & Sample Safety</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Why Choose Us Content & Checklist */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Choose Us</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Dedicated to Gaya Ji & Bihar’s Health & Well-being
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We combine senior medical specialists from premier institutes, modern diagnostic technology, and compassionate patient support under one roof.
            </p>

            <div className="space-y-2.5 pt-2">
              {keyPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Stats Cards Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {STATS.map((stat) => {
              const IconComp = statIcons[stat.icon] || Award;
              return (
                <div
                  key={stat.label}
                  className="bg-slate-50 hover:bg-teal-50/50 p-4 rounded-2xl border border-slate-100 hover:border-teal-200 transition-all text-center lg:text-left flex flex-col lg:flex-row items-center gap-3 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white text-teal-600 shadow-xs flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight block">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 block">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Video Tour Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Medicare Clinic Virtual Walkthrough</h3>
              <p className="text-xs text-slate-500">Take a 60-second interactive tour of our outpatient suites, laboratory, and pharmacy.</p>
            </div>

            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="Clinic Tour"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/40 p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg animate-pulse mb-3">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <h4 className="font-bold text-base">Facility Video Presentation</h4>
                <p className="text-xs text-slate-200 max-w-sm mt-1">State-of-the-art diagnostic imaging, pediatric waiting lounges, and sanitized clinical suites.</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
