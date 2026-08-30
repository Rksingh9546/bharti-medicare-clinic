import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Medicine, Appointment } from '../types';
import { INITIAL_MEDICINES } from '../data/mockData';

const MEDICINES_COLLECTION = 'medicines';
const APPOINTMENTS_COLLECTION = 'appointments';
const LOCAL_MEDS_KEY = 'medicare_medicines_cache';
const LOCAL_APPTS_KEY = 'medicare_appointments_cache';

// Helper to get local cache
function getLocalMedicines(): Medicine[] {
  try {
    const cached = localStorage.getItem(LOCAL_MEDS_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn("Could not read local medicines cache", e);
  }
  return INITIAL_MEDICINES;
}

function saveLocalMedicines(meds: Medicine[]) {
  try {
    localStorage.setItem(LOCAL_MEDS_KEY, JSON.stringify(meds));
  } catch (e) {
    console.warn("Could not save local medicines cache", e);
  }
}

function getLocalAppointments(): Appointment[] {
  try {
    const cached = localStorage.getItem(LOCAL_APPTS_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn("Could not read local appointments", e);
  }
  return [];
}

function saveLocalAppointments(appts: Appointment[]) {
  try {
    localStorage.setItem(LOCAL_APPTS_KEY, JSON.stringify(appts));
  } catch (e) {
    console.warn("Could not save local appointments", e);
  }
}

/**
 * Real-time subscription to Medicines.
 * If Firestore collection is empty on first load, seed initial medicines.
 */
export function subscribeToMedicines(callback: (medicines: Medicine[]) => void): () => void {
  try {
    const q = query(collection(db, MEDICINES_COLLECTION), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial items if database is freshly created
        console.log("Firestore medicines empty, seeding initial items...");
        try {
          for (const item of INITIAL_MEDICINES) {
            await setDoc(doc(db, MEDICINES_COLLECTION, item.id), item);
          }
        } catch (err) {
          console.warn("Seeding firestore error, using fallback:", err);
          callback(getLocalMedicines());
        }
        return;
      }

      const list: Medicine[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Medicine);
      });

      saveLocalMedicines(list);
      callback(list);
    }, (error) => {
      console.warn("Firestore medicines listener error, using fallback:", error);
      callback(getLocalMedicines());
    });

    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToMedicines error:", err);
    callback(getLocalMedicines());
    return () => {};
  }
}

/**
 * Add a new Medicine
 */
export async function createMedicine(medicine: Omit<Medicine, 'id' | 'createdAt'> & { id?: string }): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const now = Date.now();
    const docData = {
      ...medicine,
      createdAt: now,
      updatedAt: now,
    };

    let newId = medicine.id;
    if (newId) {
      await setDoc(doc(db, MEDICINES_COLLECTION, newId), docData);
    } else {
      const docRef = await addDoc(collection(db, MEDICINES_COLLECTION), docData);
      newId = docRef.id;
    }

    // Also update local cache
    const current = getLocalMedicines();
    const created: Medicine = { id: newId, ...docData } as Medicine;
    saveLocalMedicines([created, ...current]);

    return { success: true, id: newId };
  } catch (error: any) {
    console.error("Failed to create medicine in Firestore:", error);
    // Fallback to local storage
    const newId = medicine.id || `med-local-${Date.now()}`;
    const created: Medicine = { id: newId, createdAt: Date.now(), ...medicine } as Medicine;
    const current = getLocalMedicines();
    saveLocalMedicines([created, ...current]);
    return { success: true, id: newId };
  }
}

/**
 * Update an existing Medicine
 */
export async function updateMedicine(id: string, updates: Partial<Medicine>): Promise<{ success: boolean; error?: string }> {
  try {
    const updatedFields = {
      ...updates,
      updatedAt: Date.now(),
    };
    
    const docRef = doc(db, MEDICINES_COLLECTION, id);
    await updateDoc(docRef, updatedFields);

    // Update local cache
    const current = getLocalMedicines().map(m => m.id === id ? { ...m, ...updatedFields } : m);
    saveLocalMedicines(current);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update medicine in Firestore:", error);
    // Fallback update local
    const current = getLocalMedicines().map(m => m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m);
    saveLocalMedicines(current);
    return { success: true };
  }
}

/**
 * Delete a Medicine
 */
export async function deleteMedicine(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, MEDICINES_COLLECTION, id);
    await deleteDoc(docRef);

    // Update local cache
    const current = getLocalMedicines().filter(m => m.id !== id);
    saveLocalMedicines(current);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete medicine from Firestore:", error);
    const current = getLocalMedicines().filter(m => m.id !== id);
    saveLocalMedicines(current);
    return { success: true };
  }
}

/**
 * Real-time subscription to Appointments.
 * If user is signed in, we can filter or listen to all patient appointments.
 */
export function subscribeToAppointments(userId: string | undefined, callback: (appointments: Appointment[]) => void): () => void {
  try {
    const apptsCol = collection(db, APPOINTMENTS_COLLECTION);
    const q = query(apptsCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Appointment;
        list.push({ id: docSnap.id, ...data });
      });

      // Filter for current user if specified, otherwise return user matching or all booked locally
      const filtered = userId 
        ? list.filter(a => a.userId === userId || !a.userId) 
        : list;

      saveLocalAppointments(filtered);
      callback(filtered);
    }, (err) => {
      console.warn("Firestore appointments listener error:", err);
      const local = getLocalAppointments();
      const filtered = userId ? local.filter(a => a.userId === userId || !a.userId) : local;
      callback(filtered);
    });

    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToAppointments error:", err);
    const local = getLocalAppointments();
    callback(local);
    return () => {};
  }
}

/**
 * Create a new Appointment
 */
export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'> & { status?: Appointment['status'] }): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docData: Omit<Appointment, 'id'> = {
      ...appointment,
      status: appointment.status || 'confirmed',
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), docData);
    const created: Appointment = { id: docRef.id, ...docData };

    // Update local cache
    const current = getLocalAppointments();
    saveLocalAppointments([created, ...current]);

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Failed to create appointment in Firestore:", error);
    const newId = `appt-${Date.now()}`;
    const created: Appointment = {
      id: newId,
      ...appointment,
      status: appointment.status || 'confirmed',
      createdAt: Date.now(),
    };
    const current = getLocalAppointments();
    saveLocalAppointments([created, ...current]);
    return { success: true, id: newId };
  }
}

/**
 * Update appointment status (e.g. cancel, reschedule)
 */
export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await updateDoc(docRef, updates);

    const current = getLocalAppointments().map(a => a.id === id ? { ...a, ...updates } : a);
    saveLocalAppointments(current);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update appointment:", error);
    const current = getLocalAppointments().map(a => a.id === id ? { ...a, ...updates } : a);
    saveLocalAppointments(current);
    return { success: true };
  }
}
