// services/sportFieldService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

// Lấy danh sách sân
export const getFields = async () => {
    const querySnapshot = await getDocs(collection(db, 'fields'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Tạo booking
export const createBooking = async (bookingData) => {
    try {
        const docRef = await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            createdAt: new Date(),
            status: 'pending'
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Lấy lịch sử booking của user
export const getUserBookings = async (userId) => {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};