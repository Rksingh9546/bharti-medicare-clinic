import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Phone, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  Info, 
  ShieldCheck, 
  FileText, 
  Package, 
  Layers, 
  Sparkles, 
  X, 
  PhoneCall, 
  UserCheck,
  Leaf,
  Flame,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Share2,
  HeartHandshake
} from 'lucide-react';
import { Medicine, GhareluRemedy } from '../types';
import { 
  ALLOPATHY_CATEGORIES, 
  AYURVEDIC_CATEGORIES, 
  GHARELU_CATEGORIES, 
  GHARELU_REMEDIES,
  CLINIC_INFO 
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { createMedicine, updateMedicine, deleteMedicine } from '../services/firestoreService';

interface MedicineStoreProps {
  medicines: Medicine[];
  isHomePagePreview?: boolean;
}

export type MainCategoryTab = 'ayurvedic' | 'allopathy' | 'gharelu';

export const MedicineStoreSection: React.FC<MedicineStoreProps> = ({ medicines, isHomePagePreview = false }) => {
  const { user, openAuthModal } = useAuth();

  // Primary Tab State: 'ayurvedic' | 'allopathy' | 'gharelu'
  const [activeTab, setActiveTab] = useState<MainCategoryTab>('ayurvedic');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'otc' | 'rx'>('all');

  // Modals state
  const [selectedMedicineDetails, setSelectedMedicineDetails] = useState<Medicine | null>(null);
  const [selectedGhareluDetails, setSelectedGhareluDetails] = useState<GhareluRemedy | null>(null);
  const [inquiryMedicine, setInquiryMedicine] = useState<Medicine | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedRemedyId, setCopiedRemedyId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    medicineType: 'allopathy' as 'allopathy' | 'ayurvedic',
    category: 'Pain Relief' as Medicine['category'],
    price: 150.00,
    dosage: '500mg (30 Tablets)',
    form: 'Tablet' as Medicine['form'],
    manufacturer: 'Bharti Medicare Approved Pharma',
    stockStatus: 'In Stock' as Medicine['stockStatus'],
    description: '',
    usageInstructions: '',
    sideEffects: '',
    keyIngredients: '',
    anupana: 'Lukewarm water',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    requiresPrescription: false,
    isAyurvedic: false
  });

  const [formError, setFormError] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Helper to distinguish Allopathy vs Ayurvedic medicines
  const isAyurvedicMed = (med: Medicine) => {
    return med.medicineType === 'ayurvedic' || 
      med.isAyurvedic === true || 
      med.category === 'Ayurvedic & Herbal' ||
      med.category === 'Immunity & Rasayana' ||
      med.category === 'Joint & Muscle Care' ||
      med.category === 'Memory & Brain Tonic' ||
      Boolean(med.anupana) ||
      Boolean(med.keyIngredients && med.keyIngredients.length > 0);
  };

  const ayurvedicMedicines = medicines.filter(med => isAyurvedicMed(med));
  const allopathyMedicines = medicines.filter(med => !isAyurvedicMed(med));

  // Filter according to active tab
  const filteredAllopathy = allopathyMedicines.filter((med) => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'All Allopathy' || med.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRx = prescriptionFilter === 'all' 
      ? true 
      : prescriptionFilter === 'rx' 
        ? med.requiresPrescription 
        : !med.requiresPrescription;

    return matchesCategory && matchesSearch && matchesRx;
  });

  const filteredAyurvedic = ayurvedicMedicines.filter((med) => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'All Ayurvedic' || med.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.keyIngredients && med.keyIngredients.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const filteredGharelu = GHARELU_REMEDIES.filter((rem) => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'All Remedies' || rem.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      rem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rem.hindiName.includes(searchQuery) ||
      rem.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rem.targetSymptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rem.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Switch tab helper
  const handleTabChange = (tab: MainCategoryTab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setPrescriptionFilter('all');
  };

  const handleOpenAdd = () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    const defaultType = activeTab === 'ayurvedic' ? 'ayurvedic' : 'allopathy';
    setEditingMedicine(null);
    setFormData({
      name: '',
      genericName: '',
      medicineType: defaultType,
      category: defaultType === 'ayurvedic' ? 'Immunity & Rasayana' : 'Pain Relief',
      price: 150.00,
      dosage: defaultType === 'ayurvedic' ? '60 Tablets / 100g' : '500mg (10 Tablets)',
      form: defaultType === 'ayurvedic' ? 'Vati' : 'Tablet',
      manufacturer: defaultType === 'ayurvedic' ? 'Dabur / Baidyanath / Patanjali' : 'Bharti Medicare Approved Pharma',
      stockStatus: 'In Stock',
      description: '',
      usageInstructions: '',
      sideEffects: '',
      keyIngredients: '',
      anupana: defaultType === 'ayurvedic' ? 'Warm cow milk or lukewarm water' : '',
      image: defaultType === 'ayurvedic' 
        ? 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      requiresPrescription: false,
      isAyurvedic: defaultType === 'ayurvedic'
    });
    setFormError('');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    const isAyu = isAyurvedicMed(med);
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      genericName: med.genericName || '',
      medicineType: isAyu ? 'ayurvedic' : 'allopathy',
      category: med.category,
      price: med.price,
      dosage: med.dosage,
      form: med.form,
      manufacturer: med.manufacturer,
      stockStatus: med.stockStatus,
      description: med.description,
      usageInstructions: med.usageInstructions || '',
      sideEffects: med.sideEffects || '',
      keyIngredients: med.keyIngredients ? med.keyIngredients.join(', ') : '',
      anupana: med.anupana || '',
      image: med.image,
      requiresPrescription: med.requiresPrescription,
      isAyurvedic: isAyu
    });
    setFormError('');
    setIsAddEditModalOpen(true);
  };

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dosage.trim() || !formData.description.trim()) {
      setFormError('Please enter medicine name, dosage, and description.');
      return;
    }

    setIsSubmittingForm(true);
    setFormError('');

    const isAyu = formData.medicineType === 'ayurvedic';
    const parsedIngredients = formData.keyIngredients
      ? formData.keyIngredients.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    try {
      const payload: Partial<Medicine> = {
        name: formData.name.trim(),
        genericName: formData.genericName.trim() || undefined,
        medicineType: formData.medicineType,
        category: formData.category,
        price: Number(formData.price) || 0,
        dosage: formData.dosage.trim(),
        form: formData.form,
        manufacturer: formData.manufacturer.trim() || 'Bharti Medicare Approved',
        stockStatus: formData.stockStatus,
        description: formData.description.trim(),
        usageInstructions: formData.usageInstructions.trim() || undefined,
        sideEffects: formData.sideEffects.trim() || undefined,
        keyIngredients: parsedIngredients,
        anupana: isAyu ? (formData.anupana.trim() || undefined) : undefined,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        requiresPrescription: isAyu ? false : formData.requiresPrescription,
        isAyurvedic: isAyu
      };

      if (editingMedicine) {
        await updateMedicine(editingMedicine.id, payload);
      } else {
        await createMedicine({
          ...payload,
          addedByUserId: user?.uid,
          addedByUserName: user?.displayName || user?.email?.split('@')[0] || 'Clinic Member',
        } as any);
      }

      setIsAddEditModalOpen(false);
      setEditingMedicine(null);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save medicine');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicine(id);
      setDeleteConfirmId(null);
      if (selectedMedicineDetails?.id === id) {
        setSelectedMedicineDetails(null);
      }
    } catch (err) {
      console.error("Delete medicine error:", err);
    }
  };

  const handleCopyRemedy = (remedy: GhareluRemedy) => {
    const text = `🌿 ${remedy.name} (${remedy.hindiName})\n` +
      `🎯 Purpose: ${remedy.purpose}\n\n` +
      `🥣 Ingredients:\n${remedy.ingredients.map(i => `• ${i}`).join('\n')}\n\n` +
      `📋 Preparation:\n${remedy.preparationGuide.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n` +
      `⏱️ Timing: ${remedy.bestTime} | Dosage: ${remedy.dosageSchedule}\n` +
      `⚠️ Safety: ${remedy.safetyInfo}\n\n` +
      `🏥 Bharti Medicare Clinic | Helpline: ${CLINIC_INFO.phone}`;

    navigator.clipboard.writeText(text);
    setCopiedRemedyId(remedy.id);
    setTimeout(() => setCopiedRemedyId(null), 3000);
  };

  // Quick image preset options for convenience
  const imagePresets = [
    { label: 'Ayurvedic Rasayana / Herbs', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80' },
    { label: 'Herbal Kadha / Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
    { label: 'Capsules', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { label: 'Tablets / Blister', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80' },
    { label: 'Bottle / Pills', url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80' },
    { label: 'Herbal Drops / Bottle', url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80' },
    { label: 'Syrup / Suspension', url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cream / Ointment', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <section id="medicine-store" className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Pill className="w-3.5 h-3.5 text-teal-700" />
              <span>Bharti Medicare Pharmacy & Wellness Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Medicine Store & Healthcare Supplies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-3xl leading-relaxed">
              Explore authentic <strong>Ayurvedic Medicines</strong>, CDSCO-approved <strong>Allopathy Medicines</strong> with transparent ₹ INR pricing, and our doctor-verified <strong>Gharelu Medicine Guide</strong> for trusted home wellness in Gaya Ji, Bihar.
            </p>
          </div>

          {/* Action Button: Add Medicine */}
          <div className="flex items-center gap-3 shrink-0">
            {activeTab !== 'gharelu' && (
              <button
                onClick={handleOpenAdd}
                id="add-medicine-btn"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Medicine</span>
              </button>
            )}
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-teal-400" />
              <span>Call Pharmacy</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THREE PRIMARY CATEGORY TABS                                  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-8">
          
          {/* TAB 1: Ayurvedic Medicines */}
          <button
            onClick={() => handleTabChange('ayurvedic')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              activeTab === 'ayurvedic'
                ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                activeTab === 'ayurvedic' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {ayurvedicMedicines.length} Medicines
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-slate-900">Ayurvedic Medicines</h3>
                <span className="text-xs text-emerald-700 font-semibold">(आयुर्वेदिक)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Certified AYUSH herbal churnas, rasayanas, tonics, and natural pain formulations with pure herb extracts.
              </p>
            </div>
            {activeTab === 'ayurvedic' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-bl-full pointer-events-none" />
            )}
          </button>

          {/* TAB 2: Allopathy Medicines */}
          <button
            onClick={() => handleTabChange('allopathy')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              activeTab === 'allopathy'
                ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                activeTab === 'allopathy' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {allopathyMedicines.length} Medicines
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-slate-900">Allopathy Medicines</h3>
                <span className="text-xs text-blue-700 font-semibold">(एलोपैथी)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                100% genuine CDSCO-approved pharmaceutical formulations, antibiotics, cardiac, diabetes & pain relief.
              </p>
            </div>
            {activeTab === 'allopathy' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full pointer-events-none" />
            )}
          </button>

          {/* TAB 3: Gharelu Medicine Guide */}
          <button
            onClick={() => handleTabChange('gharelu')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              activeTab === 'gharelu'
                ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                activeTab === 'gharelu' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {GHARELU_REMEDIES.length} Remedies
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-slate-900">Gharelu Medicine Guide</h3>
                <span className="text-xs text-amber-700 font-semibold">(घरेलू नुस्खे)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Doctor-approved traditional home remedies, step-by-step preparation, kitchen ingredients & vital safety info.
              </p>
            </div>
            {activeTab === 'gharelu' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
            )}
          </button>

        </div>

        {/* ============================================================ */}
        {/* SEARCH & DYNAMIC SUB-CATEGORY FILTER BAR                     */}
        {/* ============================================================ */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className={`relative ${activeTab === 'allopathy' ? 'md:col-span-7' : 'md:col-span-8'}`}>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={
                  activeTab === 'ayurvedic' 
                    ? "Search Ayurvedic medicines (e.g. Chyawanprash, Ashwagandha, Giloy, Triphala)..."
                    : activeTab === 'allopathy'
                      ? "Search Allopathy medicines (e.g. Paracetamol, Augmentin, Telma, Pan-D)..."
                      : "Search Home remedies (e.g. Haldi Doodh, Kadha, Cough, Acidity, Toothache)..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-hidden bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Prescription Filter (Visible for Allopathy) */}
            {activeTab === 'allopathy' && (
              <div className="md:col-span-5 flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPrescriptionFilter('all')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    prescriptionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPrescriptionFilter('otc')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    prescriptionFilter === 'otc' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  OTC (No Rx)
                </button>
                <button
                  onClick={() => setPrescriptionFilter('rx')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    prescriptionFilter === 'rx' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Rx Required
                </button>
              </div>
            )}

            {/* Quick Pharmacist Hotline (Visible for Ayurvedic and Gharelu tabs) */}
            {activeTab !== 'allopathy' && (
              <div className="md:col-span-4 flex items-center justify-end">
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-teal-200"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Call Desk: {CLINIC_INFO.phone}</span>
                </a>
              </div>
            )}

          </div>

          {/* Sub-Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100">
            {activeTab === 'ayurvedic' && (
              <>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === 'All' || selectedCategory === 'All Ayurvedic'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Ayurvedic ({ayurvedicMedicines.length})
                </button>
                {AYURVEDIC_CATEGORIES.filter(c => c !== 'All Ayurvedic').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}

            {activeTab === 'allopathy' && (
              <>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === 'All' || selectedCategory === 'All Allopathy'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Allopathy ({allopathyMedicines.length})
                </button>
                {ALLOPATHY_CATEGORIES.filter(c => c !== 'All Allopathy').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}

            {activeTab === 'gharelu' && (
              <>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === 'All' || selectedCategory === 'All Remedies'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Remedies ({GHARELU_REMEDIES.length})
                </button>
                {GHARELU_CATEGORIES.filter(c => c !== 'All Remedies').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: AYURVEDIC MEDICINES GRID                             */}
        {/* ============================================================ */}
        {activeTab === 'ayurvedic' && (
          <div>
            {filteredAyurvedic.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Ayurvedic medicines found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or reset category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAyurvedic.map((med) => {
                  return (
                    <div
                      key={med.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Medicine Image & Status Badges */}
                        <div className="relative h-44 overflow-hidden bg-emerald-50/40 border-b border-slate-100">
                          <img
                            src={med.image}
                            alt={med.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* AYUSH / Herbal Badge */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              <span>100% Ayurvedic</span>
                            </span>
                          </div>

                          {/* Stock badge */}
                          <div className="absolute top-2.5 right-2.5">
                            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {med.stockStatus}
                            </span>
                          </div>

                          {/* User Added Marker */}
                          {med.addedByUserName && (
                            <div className="absolute bottom-2 left-2 bg-emerald-900/80 backdrop-blur-xs text-emerald-200 text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>Added by {med.addedByUserName}</span>
                            </div>
                          )}
                        </div>

                        {/* Content Details */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {med.category}
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{med.price.toFixed(2)}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {med.name}
                          </h3>

                          {med.genericName && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                              {med.genericName}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            <span>{med.dosage}</span>
                            <span className="text-emerald-700 font-bold">{med.form}</span>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {med.description}
                          </p>

                          {/* Herbal tags */}
                          {med.keyIngredients && med.keyIngredients.length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-1">
                              {med.keyIngredients.slice(0, 3).map((ing) => (
                                <span key={ing} className="text-[9px] font-medium bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
                                  🌿 {ing}
                                </span>
                              ))}
                              {med.keyIngredients.length > 3 && (
                                <span className="text-[9px] font-medium text-slate-400">+{med.keyIngredients.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions Bar */}
                      <div className="p-4 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedMedicineDetails(med)}
                            className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold transition-colors"
                          >
                            Usage & Details
                          </button>

                          <button
                            onClick={() => setInquiryMedicine(med)}
                            className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Inquire</span>
                          </button>
                        </div>

                        {/* Edit & Delete for logged-in users */}
                        {user && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <button
                              onClick={() => handleOpenEdit(med)}
                              className="text-slate-500 hover:text-emerald-600 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(med.id)}
                              className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: ALLOPATHY MEDICINES GRID                             */}
        {/* ============================================================ */}
        {activeTab === 'allopathy' && (
          <div>
            {filteredAllopathy.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Allopathy medicines found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or reset prescription & category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPrescriptionFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAllopathy.map((med) => {
                  return (
                    <div
                      key={med.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Medicine Image & Status Badges */}
                        <div className="relative h-44 overflow-hidden bg-slate-50 border-b border-slate-100">
                          <img
                            src={med.image}
                            alt={med.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Prescription pill */}
                          <div className="absolute top-2.5 left-2.5">
                            {med.requiresPrescription ? (
                              <span className="bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                                Rx Required
                              </span>
                            ) : (
                              <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                                OTC (No Rx)
                              </span>
                            )}
                          </div>

                          {/* Stock badge */}
                          <div className="absolute top-2.5 right-2.5">
                            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {med.stockStatus}
                            </span>
                          </div>

                          {/* User Added Marker */}
                          {med.addedByUserName && (
                            <div className="absolute bottom-2 left-2 bg-blue-900/80 backdrop-blur-xs text-blue-200 text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>Added by {med.addedByUserName}</span>
                            </div>
                          )}
                        </div>

                        {/* Content Details */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {med.category}
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{med.price.toFixed(2)}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {med.name}
                          </h3>

                          {med.genericName && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                              {med.genericName}
                            </p>
                          )}

                          <p className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {med.dosage} • {med.form}
                          </p>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {med.description}
                          </p>
                        </div>
                      </div>

                      {/* Actions Bar */}
                      <div className="p-4 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedMedicineDetails(med)}
                            className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
                          >
                            Details
                          </button>

                          <button
                            onClick={() => setInquiryMedicine(med)}
                            className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Inquire</span>
                          </button>
                        </div>

                        {/* Edit & Delete for logged-in users */}
                        {user && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <button
                              onClick={() => handleOpenEdit(med)}
                              className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(med.id)}
                              className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: GHARELU MEDICINE GUIDE (HOME REMEDIES)               */}
        {/* ============================================================ */}
        {activeTab === 'gharelu' && (
          <div>
            {/* Guide Info Ribbon */}
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold">Doctor-Verified Indian Home Remedies & Kitchen Wellness Guide</span>
                  <p className="text-amber-800/80 text-[11px] mt-0.5">
                    Safe for mild everyday discomforts. If fever exceeds 101°F or cough persists beyond 5 days, consult our clinic physicians immediately.
                  </p>
                </div>
              </div>
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Doctor Advice Hotline</span>
              </a>
            </div>

            {filteredGharelu.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No remedies found matching your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Search by symptom (e.g. cough, fever, throat, gas, joint pain) or reset category filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGharelu.map((remedy) => {
                  return (
                    <div
                      key={remedy.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image banner */}
                        <div className="relative h-48 overflow-hidden bg-amber-50/50 border-b border-slate-100">
                          <img
                            src={remedy.image}
                            alt={remedy.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Category Badge */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-amber-700/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                              {remedy.category}
                            </span>
                          </div>

                          {/* Prep Time */}
                          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{remedy.approxPrepTime}</span>
                          </div>

                          {/* Hindi Subtitle Banner */}
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {remedy.hindiName}
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-4 space-y-3">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                            {remedy.name}
                          </h3>

                          {/* Purpose highlight */}
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80 text-xs text-amber-900">
                            <span className="font-bold block text-[11px] text-amber-800 uppercase tracking-wide mb-0.5">Purpose & Benefits:</span>
                            <p className="line-clamp-2 leading-relaxed">{remedy.purpose}</p>
                          </div>

                          {/* Target Symptoms */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Symptoms:</span>
                            <div className="flex flex-wrap gap-1">
                              {remedy.targetSymptoms.map((symp) => (
                                <span key={symp} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                  • {symp}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Ingredients checklist preview */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Ingredients:</span>
                            <ul className="text-[11px] text-slate-600 space-y-0.5 line-clamp-3">
                              {remedy.ingredients.slice(0, 3).map((ing, i) => (
                                <li key={i} className="truncate">• {ing}</li>
                              ))}
                              {remedy.ingredients.length > 3 && (
                                <li className="text-[10px] text-slate-400 italic">+{remedy.ingredients.length - 3} more ingredients</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedGhareluDetails(remedy)}
                            className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Full Recipe Guide</span>
                          </button>

                          <button
                            onClick={() => handleCopyRemedy(remedy)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              copiedRemedyId === remedy.id
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                            }`}
                          >
                            {copiedRemedyId === remedy.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Copy Guide</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Safety Tip Snippet */}
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-500">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{remedy.safetyInfo}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: MEDICINE FULL DETAILS (Allopathy / Ayurvedic)        */}
      {/* ============================================================ */}
      {selectedMedicineDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMedicineDetails.image}
                  alt={selectedMedicineDetails.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isAyurvedicMed(selectedMedicineDetails)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isAyurvedicMed(selectedMedicineDetails) ? '🌿 100% Ayurvedic' : '💊 Allopathy'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{selectedMedicineDetails.category}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedMedicineDetails.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedMedicineDetails(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              {/* Unit Price & Form Banner */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block">Unit Price (INR)</span>
                  <span className="text-xl font-extrabold text-slate-900">₹{selectedMedicineDetails.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Dosage Form</span>
                  <span className="font-bold text-slate-800">{selectedMedicineDetails.dosage}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Prescription</span>
                  <span className={`font-bold ${selectedMedicineDetails.requiresPrescription ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedMedicineDetails.requiresPrescription ? 'Required (Rx)' : 'OTC (No Rx)'}
                  </span>
                </div>
              </div>

              {/* Generic or Classical Composition */}
              {selectedMedicineDetails.genericName && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {isAyurvedicMed(selectedMedicineDetails) ? 'Classical Ayurvedic Composition' : 'Active Generic Formulation'}
                  </h4>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                    {selectedMedicineDetails.genericName}
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Medical Purpose & Indications</h4>
                <p className="text-slate-600 leading-relaxed">{selectedMedicineDetails.description}</p>
              </div>

              {/* Ayurvedic key ingredients */}
              {selectedMedicineDetails.keyIngredients && selectedMedicineDetails.keyIngredients.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Key Herbal Ingredients</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicineDetails.keyIngredients.map((herb) => (
                      <span key={herb} className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-100 font-medium">
                        🌿 {herb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Instructions / Dosage Schedule */}
              {selectedMedicineDetails.usageInstructions && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Dosage & Administration</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedMedicineDetails.usageInstructions}</p>
                </div>
              )}

              {/* Ayurvedic Anupana (Vehicle) */}
              {selectedMedicineDetails.anupana && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                  <span className="font-bold block mb-0.5 text-xs text-emerald-900">Anupana (Recommended Vehicle for Intake):</span>
                  <p className="text-xs text-emerald-800 leading-relaxed">{selectedMedicineDetails.anupana}</p>
                </div>
              )}

              {/* Side Effects / Precautions */}
              {selectedMedicineDetails.sideEffects && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Safety & Precautions</h4>
                  <p className="text-slate-500 leading-relaxed text-xs">{selectedMedicineDetails.sideEffects}</p>
                </div>
              )}

              <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
                <span>Manufacturer: {selectedMedicineDetails.manufacturer}</span>
                <span>Stock: {selectedMedicineDetails.stockStatus}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedMedicineDetails(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const m = selectedMedicineDetails;
                  setSelectedMedicineDetails(null);
                  setInquiryMedicine(m);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Inquire / Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: GHARELU REMEDY FULL RECIPE & SAFETY GUIDE           */}
      {/* ============================================================ */}
      {selectedGhareluDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedGhareluDetails.image}
                  alt={selectedGhareluDetails.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-1 ring-amber-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      🏡 Home Remedy
                    </span>
                    <span className="text-xs text-amber-700 font-semibold">{selectedGhareluDetails.category}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedGhareluDetails.name}</h3>
                  <p className="text-xs text-amber-800 font-bold">{selectedGhareluDetails.hindiName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGhareluDetails(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              
              {/* Quick Info Bar */}
              <div className="grid grid-cols-3 gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-center">
                <div>
                  <span className="text-slate-500 text-[10px] block">Prep Time</span>
                  <span className="font-bold text-amber-900">{selectedGhareluDetails.approxPrepTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Difficulty</span>
                  <span className="font-bold text-amber-900">{selectedGhareluDetails.difficulty}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Best Time</span>
                  <span className="font-bold text-amber-900">{selectedGhareluDetails.bestTime}</span>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Health Purpose & Key Benefits</h4>
                <p className="text-slate-600 leading-relaxed">{selectedGhareluDetails.purpose}</p>
              </div>

              {/* Ingredients Checklist */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Required Kitchen / Pantry Ingredients</h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                  {selectedGhareluDetails.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Preparation Guide */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Step-by-Step Preparation Guide</h4>
                <div className="space-y-2">
                  {selectedGhareluDetails.preparationGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/60">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage & Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block text-xs mb-0.5">How to Consume / Apply:</span>
                  <p className="text-xs text-slate-600">{selectedGhareluDetails.usageInstructions}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block text-xs mb-0.5">Dosage Schedule:</span>
                  <p className="text-xs text-slate-600">{selectedGhareluDetails.dosageSchedule}</p>
                </div>
              </div>

              {/* Safety & Precautions */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Vital Safety Information & Contraindications:</span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed">{selectedGhareluDetails.safetyInfo}</p>
                {selectedGhareluDetails.precautions.length > 0 && (
                  <ul className="text-[11px] text-rose-800 list-disc pl-4 space-y-0.5 pt-1">
                    {selectedGhareluDetails.precautions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Doctor Clinical Tip */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-900 block">Bharti Medicare Doctor's Clinical Note:</span>
                  <p className="text-teal-800 mt-0.5">{selectedGhareluDetails.doctorTip}</p>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedGhareluDetails(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => handleCopyRemedy(selectedGhareluDetails)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                  copiedRemedyId === selectedGhareluDetails.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {copiedRemedyId === selectedGhareluDetails.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: INQUIRY & CALL PHARMACY DIALOG                      */}
      {/* ============================================================ */}
      {inquiryMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <PhoneCall className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">Inquire About {inquiryMedicine.name}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Speak directly with our on-duty Bharti Medicare pharmacy desk for stock availability, genuine medicines, or doorstep delivery in Gaya Ji.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-left space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{inquiryMedicine.name}</span>
                <span className="text-teal-700">₹{inquiryMedicine.price.toFixed(2)}</span>
              </div>
              <p className="text-slate-500">{inquiryMedicine.dosage} • {inquiryMedicine.manufacturer}</p>
              <p className="text-[11px] text-teal-800 font-semibold pt-1">
                Ref Code: MED-{inquiryMedicine.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now: {CLINIC_INFO.phone}</span>
              </a>

              <button
                onClick={() => setInquiryMedicine(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: ADD / EDIT MEDICINE FORM (Supports Allopathy/Ayurveda)*/}
      {/* ============================================================ */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingMedicine ? 'Edit Medicine Details' : 'Add New Medicine to Catalogue'}
                  </h3>
                  <p className="text-xs text-slate-500">Live synchronization with Bharti Medicare pharmacy database</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMedicine} className="py-4 space-y-4 text-xs">
              
              {/* Medicine Type Selector: Ayurvedic vs Allopathy */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <label className="block font-bold text-slate-800 mb-2">Select Medicine Discipline *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        medicineType: 'ayurvedic',
                        isAyurvedic: true,
                        category: 'Immunity & Rasayana',
                        form: 'Vati'
                      });
                    }}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      formData.medicineType === 'ayurvedic'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Ayurvedic Medicine</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        medicineType: 'allopathy',
                        isAyurvedic: false,
                        category: 'Pain Relief',
                        form: 'Tablet'
                      });
                    }}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      formData.medicineType === 'allopathy'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>Allopathy Medicine</span>
                  </button>
                </div>
              </div>

              {/* Name & Generic Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medicine Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder={formData.medicineType === 'ayurvedic' ? "e.g. Dabur Chyawanprash" : "e.g. Dolo 650 Tablet"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {formData.medicineType === 'ayurvedic' ? 'Classical Formula / Herb Composition' : 'Generic Chemical Composition'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.medicineType === 'ayurvedic' ? "e.g. Amla + 41 Auspicious Herbs" : "e.g. Paracetamol (650mg)"}
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Category, Form & Price in ₹ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden font-medium"
                  >
                    {formData.medicineType === 'ayurvedic' ? (
                      AYURVEDIC_CATEGORIES.filter(c => c !== 'All Ayurvedic').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    ) : (
                      ALLOPATHY_CATEGORIES.filter(c => c !== 'All Allopathy').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden font-medium"
                  >
                    {formData.medicineType === 'ayurvedic' ? (
                      ['Churna', 'Vati', 'Avaleha', 'Kashayam', 'Taila / Oil', 'Syrup', 'Drops', 'Tablet', 'Capsule'].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))
                    ) : (
                      ['Tablet', 'Capsule', 'Syrup', 'Cream', 'Gel', 'Injection', 'Drops', 'Ointment'].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* Dosage specification & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage & Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 Tablets per Strip / 500g Jar"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Dabur, Baidyanath, GSK, Abbott"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Ayurvedic Specific: Key Herbs & Anupana */}
              {formData.medicineType === 'ayurvedic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Key Herbal Ingredients (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Amla, Ashwagandha, Giloy, Tulsi"
                      value={formData.keyIngredients}
                      onChange={(e) => setFormData({ ...formData, keyIngredients: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Anupana (Vehicle for Intake)</label>
                    <input
                      type="text"
                      placeholder="e.g. Warm milk or lukewarm water"
                      value={formData.anupana}
                      onChange={(e) => setFormData({ ...formData, anupana: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Prescription requirement & Stock status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {formData.medicineType === 'allopathy' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requiresPrescription"
                      checked={formData.requiresPrescription}
                      onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
                    />
                    <label htmlFor="requiresPrescription" className="font-semibold text-slate-800 cursor-pointer">
                      Requires Doctor Prescription (Rx)
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>AYUSH Certified Over-The-Counter Herbal</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Status</label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded-md border border-slate-200 bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="On Order">On Order</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden"
                />
                
                {/* Image presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 mr-1">Choose Photo Preset:</span>
                  {imagePresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border transition-colors ${
                        formData.image === preset.url
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Description & Indications *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Outline primary benefits, symptoms treated, and clinical indications."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden"
                />
              </div>

              {/* Usage Instructions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Usage Instructions / Dosage Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Take 1 tablespoon twice daily after food."
                  value={formData.usageInstructions}
                  onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  {isSubmittingForm ? 'Saving...' : editingMedicine ? 'Update Medicine' : 'Add to Catalogue'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: CONFIRM DELETE MODAL                                */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Delete this medicine?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This medication will be removed immediately from the Bharti Medicare catalogue.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
