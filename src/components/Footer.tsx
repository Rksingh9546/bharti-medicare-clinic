import React, { useState } from 'react';
import { 
  HeartPulse, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';
import { NavSection } from '../types';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      
      {/* 1. Newsletter CTA Banner (Cyan Ribbon in Reference Image) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-6">
        <div className="bg-teal-600 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Stay Updated with Our Health Tips
                </h3>
                <p className="text-xs sm:text-sm text-teal-100 mt-1">
                  Subscribe to our newsletter and get the latest updates & preventive advice.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-4 text-center font-bold text-sm text-white flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Thank you for subscribing! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight font-heading">Bharti Medicare</span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block -mt-1">MULTI-SPECIALTY CLINIC</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated to compassionate, affordable, and gold-standard healthcare in Gaya Ji, Bihar. Offering specialist OPDs, NABL pathology, and an in-house genuine medicine pharmacy.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#facebook" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-xs font-bold">f</a>
              <a href="#instagram" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-xs font-bold">ig</a>
              <a href="#twitter" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-xs font-bold">tw</a>
              <a href="#linkedin" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-xs font-bold">in</a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">Our Services</button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">Our Doctors</button>
              </li>
              <li>
                <button onClick={() => onNavigate('medicines')} className="hover:text-teal-400 transition-colors">Medicine Store</button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-teal-400 transition-colors">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Patient Info</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenBooking} className="hover:text-teal-400 transition-colors">Book Appointment</button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-teal-400 transition-colors">Insurance Information</button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-teal-400 transition-colors">Patient Portal</button>
              </li>
              <li>
                <button onClick={() => onNavigate('medicines')} className="hover:text-teal-400 transition-colors">Prescriptions & FAQs</button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-teal-400 transition-colors">Medical Records</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-teal-400">{CLINIC_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-teal-400">{CLINIC_INFO.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{CLINIC_INFO.workingHours}</span>
              </div>
            </div>

            {/* We Accept */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 mb-2">Accepted Payment Modes</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 bg-white text-emerald-700 text-[10px] font-extrabold rounded-md shadow-xs">UPI</span>
                <span className="px-2 py-1 bg-white text-blue-700 text-[10px] font-extrabold rounded-md shadow-xs">GPay</span>
                <span className="px-2 py-1 bg-white text-indigo-700 text-[10px] font-extrabold rounded-md shadow-xs">PhonePe</span>
                <span className="px-2 py-1 bg-white text-sky-700 text-[10px] font-extrabold rounded-md shadow-xs">Paytm</span>
                <span className="px-2 py-1 bg-white text-slate-900 text-[10px] font-extrabold rounded-md shadow-xs">RuPay</span>
                <span className="px-2 py-1 bg-white text-slate-900 text-[10px] font-extrabold rounded-md shadow-xs">Cash / Cards</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Bharti Medicare Clinic. All Rights Reserved. NABH Reg: BR-2024-MC892</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-400 transition-colors">Patient Rights & Charters</a>
          <a href="#accessibility" className="hover:text-slate-400 transition-colors">NABH Compliance</a>
        </div>
      </div>

    </footer>
  );
};
