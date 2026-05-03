// services/jsonDataService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialData from './data.json'; // File JSON mẫu bên dưới

// Keys để lưu trữ
const STORAGE_KEYS = {
    FIELDS: '@sport_fields',
    BOOKINGS: '@sport_bookings',
    USERS: '@sport_users',
    CURRENT_USER: '@sport_current_user'
};

// Khởi tạo dữ liệu mẫu lần đầu
export const initializeData = async () => {
    try {
        // Kiểm tra xem đã có data chưa
        const fields = await AsyncStorage.getItem(STORAGE_KEYS.FIELDS);
        if (!fields) {
            // Chưa có thì lưu data mẫu từ file JSON
            await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(initialData.fields));
            await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialData.bookings));
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
        }
        return true;
    } catch (error) {
        console.error('Lỗi khởi tạo data:', error);
        return false;
    }
};

// ========== FIELD SERVICES ==========
export const getFields = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.FIELDS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Lỗi lấy fields:', error);
        return [];
    }
};

export const getFieldById = async (id) => {
    const fields = await getFields();
    return fields.find(field => field.id === id);
};

export const getFieldsBySport = async (sport) => {
    const fields = await getFields();
    return fields.filter(field => field.sport === sport);
};

export const addField = async (newField) => {
    try {
        const fields = await getFields();
        const newId = Date.now().toString();
        const fieldToAdd = { ...newField, id: newId };
        fields.push(fieldToAdd);
        await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
        return { success: true, field: fieldToAdd };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ========== BOOKING SERVICES ==========
export const getBookings = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Lỗi lấy bookings:', error);
        return [];
    }
};

export const getUserBookings = async (userId) => {
    const bookings = await getBookings();
    return bookings.filter(booking => booking.userId === userId);
};

export const createBooking = async (bookingData) => {
    try {
        const bookings = await getBookings();
        const newBooking = {
            id: Date.now().toString(),
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        // Cập nhật trạng thái available của sân
        await updateFieldAvailability(bookingData.fieldId, false);

        return { success: true, booking: newBooking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const bookings = await getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
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

// Cập nhật trạng thái sân
const updateFieldAvailability = async (fieldId, available) => {
    const fields = await getFields();
    const index = fields.findIndex(f => f.id === fieldId);
    if (index !== -1) {
        fields[index].available = available;
        await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    }
};

// ========== USER SERVICES ==========
export const getUsers = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Lỗi lấy users:', error);
        return [];
    }
};

export const findUserByEmail = async (email) => {
    const users = await getUsers();
    return users.find(user => user.email === email);
};

export const createUser = async (userData) => {
    try {
        const users = await getUsers();
        const existingUser = await findUserByEmail(userData.email);
        if (existingUser) {
            return { success: false, error: 'Email đã tồn tại' };
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Lưu user hiện tại (đã đăng nhập)
export const saveCurrentUser = async (user) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
    } catch (error) {
        return false;
    }
};

export const getCurrentUser = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        return null;
    }
};

export const clearCurrentUser = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return true;
    } catch (error) {
        return false;
    }
};