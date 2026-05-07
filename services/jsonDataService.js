import AsyncStorage from '@react-native-async-storage/async-storage';
import initialData from './data.json';

const STORAGE_KEYS = {
    FIELDS: '@sport_fields',
    BOOKINGS: '@sport_bookings',
    USERS: '@sport_users',
    CURRENT_USER: '@sport_current_user'
};

const toStr = (v) => String(v);
const toBool = (v) => v === true || v === 'true';
const toNum = (v) => Number(v) || 0;

const normalizeField = (f) => ({
    ...f,
    id: toStr(f.id),
    price: toNum(f.price),
    rating: toNum(f.rating),
    available: toBool(f.available),
});

const normalizeUser = (u) => ({
    ...u,
    id: toStr(u.id),
});

const normalizeBooking = (b) => ({
    ...b,
    id: toStr(b.id),
    fieldId: toStr(b.fieldId),
    userId: toStr(b.userId),
    totalPrice: toNum(b.totalPrice),
    hours: toNum(b.hours),
});

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
        return parsed.map(normalizeField);
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

<<<<<<< HEAD
const updateFieldAvailability = async (fieldId, available) => {
    const fields = await getFields();
    const index = fields.findIndex(f => f.id === toStr(fieldId));
    if (index !== -1) {
        fields[index].available = toBool(available);
        await AsyncStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    }
};

=======
>>>>>>> main
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
    return bookings.filter(b => b.userId === toStr(userId));
<<<<<<< HEAD
=======
};

// Lấy các slot đã bị đặt của 1 sân trong 1 ngày cụ thể
export const getBookedSlots = async (fieldId, date) => {
    try {
        const bookings = await getBookings();
        return bookings
            .filter(b =>
                b.fieldId === toStr(fieldId) &&
                b.date === date &&
                b.status !== 'cancelled'
            )
            .map(b => b.time);
    } catch (error) {
        return [];
    }
>>>>>>> main
};

export const createBooking = async (bookingData) => {
    try {
        const bookings = await getBookings();

        // Kiểm tra slot (ngày + giờ) đã có người đặt chưa
        const conflict = bookings.find(b =>
            b.fieldId === toStr(bookingData.fieldId) &&
            b.date === bookingData.date &&
            b.time === bookingData.time &&
            b.status !== 'cancelled'
        );

        if (conflict) {
            return { success: false, error: 'Khung giờ này đã có người đặt, vui lòng chọn giờ khác!' };
        }

        const newBooking = normalizeBooking({
            id: Date.now().toString(),
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        });

        bookings.push(newBooking);
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        // KHÔNG đánh dấu hết sân nữa — chỉ khóa đúng slot đó
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

// ── CẬP NHẬT THÔNG TIN USER ──────────────────────────────────────
export const updateUser = async (userId, updatedData) => {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => u.id === toStr(userId));
        if (index === -1) return { success: false, error: 'Không tìm thấy user' };

        // Giữ nguyên password, chỉ update các field được phép
        const { password, id, role, ...safeData } = updatedData;
        users[index] = normalizeUser({ ...users[index], ...safeData });

        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // Cập nhật luôn current user (bỏ password)
        const { password: _pw, ...userWithoutPassword } = users[index];
        await saveCurrentUser(userWithoutPassword);

        return { success: true, user: userWithoutPassword };
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