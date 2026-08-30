export type NavSection = 'home' | 'doctors' | 'medicines' | 'appointments';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string;
  role?: 'patient' | 'doctor' | 'admin';
  createdAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  image: string;
  bio: string;
  availableDays: string[];
  timeSlots: string[];
  consultationFee: number;
  education: string;
  languages: string[];
}

export interface ClinicService {
  id: string;
  title: string;
  department: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  treatmentList: string[];
  startingPrice: number;
  duration: string;
}

export type MedicineType = 'allopathy' | 'ayurvedic';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  medicineType?: MedicineType; // 'allopathy' | 'ayurvedic'
  category: 
    | 'Pain Relief' 
    | 'Cardiology' 
    | 'Antibiotics' 
    | 'Vitamins & Supplements' 
    | 'Pediatrics' 
    | 'Dermatology' 
    | 'First Aid' 
    | 'Cold & Flu' 
    | 'Cold & Allergy'
    | 'Digestive Health'
    | 'General Medicine'
    | 'Diabetes Care'
    | 'Ayurvedic & Herbal'
    | 'Immunity & Rasayana'
    | 'Liver & Kidney Care'
    | 'Joint & Muscle Care'
    | 'Respiratory Wellness'
    | 'Memory & Brain Tonic'
    | 'Other';
  price: number;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Cream' | 'Gel' | 'Injection' | 'Drops' | 'Powder' | 'Inhaler' | 'Ointment' | 'Churna' | 'Vati' | 'Avaleha' | 'Kashayam' | 'Taila / Oil' | 'Other';
  manufacturer: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'On Order';
  description: string;
  usageInstructions?: string;
  sideEffects?: string;
  keyIngredients?: string[];
  anupana?: string; // Ayurvedic vehicle (e.g. warm water, milk, honey)
  image: string;
  requiresPrescription: boolean;
  isAyurvedic?: boolean;
  addedByUserId?: string; // If added by user
  addedByUserName?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface GhareluRemedy {
  id: string;
  name: string;
  hindiName: string;
  category: 'Cold, Cough & Flu' | 'Digestion & Acidity' | 'Immunity & Vitality' | 'Joint & Body Pain' | 'Skin & Hair Care' | 'Throat & Oral Care';
  purpose: string;
  targetSymptoms: string[];
  ingredients: string[];
  preparationGuide: string[];
  usageInstructions: string;
  dosageSchedule: string;
  safetyInfo: string;
  precautions: string[];
  bestTime: string;
  approxPrepTime: string;
  difficulty: 'Very Easy' | 'Easy' | 'Moderate';
  image: string;
  doctorTip: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  symptoms?: string;
  insuranceProvider?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
  notes?: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
  doctorName?: string;
}
