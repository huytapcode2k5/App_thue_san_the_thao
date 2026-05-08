import React, { createContext, useState, useEffect } from 'react';
import {
    getUsers,
    createUser,
    saveCurrentUser,
    getCurrentUser,
    clearCurrentUser,
    updateUser,
} from '../services/jsonDataService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const users = await getUsers();
            const foundUser = users.find(u => u.email === email && u.password === password);
            if (foundUser) {
                const { password: _pw, ...userWithoutPassword } = foundUser;
                setUser(userWithoutPassword);
                await saveCurrentUser(userWithoutPassword);
                return { success: true, user: userWithoutPassword };
            } else {
                return { success: false, error: 'Email hoặc mật khẩu không đúng' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password, fullName, phone) => {
        const result = await createUser({ email, password, fullName, phone: phone || '', role: 'user' });
        if (result.success) {
            const { password: _pw, ...userWithoutPassword } = result.user;
            return { success: true, user: userWithoutPassword };
        } else {
            return { success: false, error: result.error };
        }
    };

    // ── Cập nhật thông tin user ───────────────────────────────────
    const updateProfile = async (updatedData) => {
        if (!user?.id) return { success: false, error: 'Chưa đăng nhập' };
        const result = await updateUser(user.id, updatedData);
        if (result.success) {
            setUser(result.user); // cập nhật state ngay lập tức
        }
        return result;
    };

    const logout = async () => {
        await clearCurrentUser();
        setUser(null);
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};