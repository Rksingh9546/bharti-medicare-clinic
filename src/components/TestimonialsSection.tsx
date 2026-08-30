import React from 'react';
import { Star, MessageSquareQuote, CheckCircle, ArrowRight } from 'lucide-react';
import { PATIENT_REVIEWS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Real Patient Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Patients Say
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer">
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Testimonials 3-Cards Grid (Matches Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PATIENT_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-teal-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  "{review.comment}"
                </p>
              </div>

              {/* Patient Info */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.patientName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {review.patientName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
