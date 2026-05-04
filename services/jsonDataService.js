// services/jsonDataService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialData from './data.json';

const STORAGE_KEYS = {
    FIELDS: '@sport_fields',
    BOOKINGS: '@sport_bookings',
    USERS: '@sport_users',
    CURRENT_USER: '@sport_current_user'
};

// ── Helper: ép kiểu an toàn ──────────────────────────────────────
// Tránh lỗi "String cannot be cast to Boolean/Integer"
const toStr = (v) => String(v);                          // id luôn là string
const toBool = (v) => v === true || v === 'true';         // available luôn boolean
const toNum = (v) => Number(v) || 0;                     // price, rating luôn number

// Chuẩn hoá 1 field object từ JSON
const normalizeField = (f) => ({
    ...f,
    id: toStr(f.id),
    price: toNum(f.price),
    rating: toNum(f.rating),
    available: toBool(f.available),   // ✅ fix "String cannot be cast to Boolean"
});

// Chuẩn hoá 1 user object
const normalizeUser = (u) => ({
    ...u,
    id: toStr(u.id),
});

// Chuẩn hoá 1 booking object
const normalizeBooking = (b) => ({
    ...b,
    id: toStr(b.id),
    fieldId: toStr(b.fieldId),     // ✅ đảm bảo luôn là string khi so sánh
    userId: toStr(b.userId),
    totalPrice: toNum(b.totalPrice),
    hours: toNum(b.hours),
});

// ── Khởi tạo data lần đầu ────────────────────────────────────────
export const initializeData = async () => {
    try {
        const fields = await AsyncStorage.getItem(STORAGE_KEYS.FIELDS);
        if (!fields) {
            await AsyncStorage.setItem(
                STORAGE_KEYS.FIELDS,
                JSON.stringify(initialData.fields.map(normalizeField))
            );
            await AsyncStorage.setItem(
                STORAGE_KEYS.BOOKINGS,
                JSON.stringify(initialData.bookings.map(normalizeBooking))
            );
            await AsyncStorage.setItem(
                STORAGE_KEYS.USERS,
                JSON.stringify(initialData.users.map(normalizeUser))
            );
        }
        return true;
    } catch (error) {
        console.error('Lỗi khởi tạo data:', error);
        return false;
    }
};

// ── FIELD SERVICES ───────────────────────────────────────────────
export const getFields = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.FIELDS);
        const parsed = data ? JSON.parse(data) : [];
        return parsed.map(normalizeField); // ✅ chuẩn hoá khi đọc ra
    } catch (error) {
        console.error('Lỗi lấy fields:', error);
        return [];
    }
};

export const getFieldById = async (id) => {
    const fields = await getFields();
    return fields.find(f => f.id === toStr(id)) || null;
};

export const getFieldsBySport = async (sport) => {
    const fields = await getFields();
    return fields.filter(f => f.sport === sport);
};

export const addField = async (newField) => {
    try {
        const fields = await getFields();
        const fieldToAdd = normalizeField({ ...newField, id: Date.now().toString() });
        fields.push(fieldToAdd);
        await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
        return { success: true, field: fieldToAdd };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Cập nhật available của sân
const updateFieldAvailability = async (fieldId, available) => {
    const fields = await getFields();
    const index = fields.findIndex(f => f.id === toStr(fieldId)); // ✅ so sánh string
    if (index !== -1) {
        fields[index].available = toBool(available); // ✅ luôn lưu boolean
        await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    }
};

// ── BOOKING SERVICES ─────────────────────────────────────────────
export const getBookings = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
        const parsed = data ? JSON.parse(data) : [];
        return parsed.map(normalizeBooking);
    } catch (error) {
        console.error('Lỗi lấy bookings:', error);
        return [];
    }
};

export const getUserBookings = async (userId) => {
    const bookings = await getBookings();
    return bookings.filter(b => b.userId === toStr(userId)); // ✅ so sánh string
};

export const createBooking = async (bookingData) => {
    try {
        const bookings = await getBookings();
        const newBooking = normalizeBooking({
            id: Date.now().toString(),
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        });
        bookings.push(newBooking);
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        await updateFieldAvailability(bookingData.fieldId, false);
        return { success: true, booking: newBooking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const bookings = await getBookings();
        const index = bookings.findIndex(b => b.id === toStr(bookingId));
        if (index !== -1) {
            bookings[index].status = status;
            await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
            return { success: true };
        }
        return { success: false, error: 'Không tìm thấy booking' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ── USER SERVICES ────────────────────────────────────────────────
export const getUsers = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        const parsed = data ? JSON.parse(data) : [];
        return parsed.map(normalizeUser);
    } catch (error) {
        console.error('Lỗi lấy users:', error);
        return [];
    }
};

export const findUserByEmail = async (email) => {
    const users = await getUsers();
    return users.find(u => u.email === email) || null;
};

export const createUser = async (userData) => {
    try {
        const existing = await findUserByEmail(userData.email);
        if (existing) return { success: false, error: 'Email đã tồn tại' };

        const users = await getUsers();
        const newUser = normalizeUser({
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
        });
        users.push(newUser);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const saveCurrentUser = async (user) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
    } catch (error) { return false; }
};

export const getCurrentUser = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? normalizeUser(JSON.parse(data)) : null;
    } catch (error) { return null; }
};

export const clearCurrentUser = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return true;
    } catch (error) { return false; }
};