# Bharti Medicare Clinic

A modern, responsive, and user-friendly medical clinic website built for **Bharti Medicare Clinic**. The platform provides patients with information about doctors, healthcare services, medicines, and online appointment booking through a clean and conversion-focused interface.

---

## 📋 About the Project

**Bharti Medicare Clinic** is a digital healthcare platform designed to make essential clinic information and services easily accessible to patients.

The website allows users to:

- Explore healthcare services
- View doctor profiles and specializations
- Browse available medicines
- View Ayurvedic and Allopathy medicines
- Explore a Gharelu Medicine Guide
- Create an account and sign in
- Book doctor appointments online
- Add medicines that are not available
- Edit and delete medicines added by them
- Contact the clinic for medicine-related inquiries

The application uses **Firebase** for authentication and data storage, allowing user and appointment-related information to be stored and managed properly.

---

## ✨ Features

### 👤 User Authentication

- User Sign Up
- User Sign In
- User authentication using Firebase
- Protected user-specific medicine operations
- User account management

### 👨‍⚕️ Doctors & Healthcare Services

- Doctor profiles
- Doctor specialization
- Doctor experience and qualifications
- Consultation fees in Indian Rupees (₹)
- Available appointment days and time slots
- Healthcare service information

### 💊 Medicine Store

The Medicine Store provides information about different types of medicines.

#### Ayurvedic Medicines

- Medicine image
- Medicine name
- Category
- Price in ₹
- Basic medicine details
- Usage information

#### Allopathy Medicines

- Medicine image
- Medicine name
- Category
- Price in ₹
- Basic medicine details
- Usage information

#### Gharelu Medicine Guide

- Common home remedies
- Purpose/use
- Basic usage guidance
- Safety information

> Medicine information is provided for general informational purposes. Users should consult a qualified healthcare professional before taking medicines or changing treatment.

### ➕ User-Added Medicines

Logged-in users can add medicines that are not available in the Medicine Store.

Users can:

- Add a medicine
- Upload/provide medicine image
- Add medicine name
- Select/add category
- Add price in ₹
- Add basic medicine details
- Edit their added medicine
- Delete their added medicine

Changes are reflected in the website after the data is updated.

### 📅 Online Appointment Booking

Users can book appointments with available doctors.

Appointment information includes:

- Patient details
- Selected doctor
- Appointment date
- Available time slot
- Consultation information

Appointment data is stored using Firebase.

### 📞 Clinic Contact

Users can contact the clinic for medicine-related questions and general inquiries.

---

## 🏥 Clinic Information

**Bharti Medicare Clinic**

**Address:**

Plot No. 14,  
Chitaukhar Bazar,  
Tekari–Kurth Main Road,  
Gaya Ji, Bihar – 824235, India

**Mobile:**  
7079039801

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend / Database

- Firebase Authentication
- Firebase Firestore

### Development Tools

- VS Code
- Git
- GitHub
- npm

---

## 📁 Project Structure

```text
bharti-medicare-clinic/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── DoctorsServicesSection.tsx
│   │   ├── WhyChooseUsSection.tsx
│   │   ├── MedicineStoreSection.tsx
│   │   ├── AppointmentsAccountSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── Footer.tsx
│   │   ├── AuthModal.tsx
│   │   └── SearchModal.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── lib/
│   │   └── firebase.ts
│   │
│   ├── services/
│   │   └── firestoreService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── firestore.rules
├── firebase-applet-config.json
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
