// screens/RegisterScreen.js
import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView,
    ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { AuthContext } from '../store/AuthContext';

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);

    // ── Validate ────────────────────────────────────────────────────
    const validate = () => {
        if (!fullName.trim()) return 'Vui lòng nhập họ và tên';
        if (!email.trim()) return 'Vui lòng nhập email';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email không hợp lệ';
        if (!phone.trim()) return 'Vui lòng nhập số điện thoại';
        if (!/^[0-9]{9,11}$/.test(phone)) return 'Số điện thoại không hợp lệ';
        if (!password) return 'Vui lòng nhập mật khẩu';
        if (password.length < 6) return 'Mật khẩu tối thiểu 6 ký tự';
        if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
        if (!agreed) return 'Vui lòng đồng ý với điều khoản dịch vụ';
        return null;
    };

    // ── Đăng ký ─────────────────────────────────────────────────────
    const handleRegister = async () => {
        const error = validate();
        if (error) { Alert.alert('Lỗi', error); return; }

        setLoading(true);
        // register(email, password, fullName, phone) từ AuthContext của bạn
        const result = await register(email.trim(), password, fullName.trim(), phone.trim());
        setLoading(false);

        if (result.success) {
            Alert.alert(
                '🎉 Đăng ký thành công!',
                'Tài khoản đã được tạo. Vui lòng đăng nhập.',
                [{ text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }]
            );
        } else {
            Alert.alert('Đăng ký thất bại', result.error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#f0faf0" />

            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                        <Text style={styles.backText}>Thuê Sân Thể Thao</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageLabel}>Đăng ký tài khoản</Text>
                </View>

                {/* Tiêu đề lớn */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroText}>
                        <Text style={styles.heroNormal}>Tạo </Text>
                        <Text style={styles.heroBold}>Nhịp{'\n'}Đập{'\n'}</Text>
                        <Text style={styles.heroBold}>Mới.</Text>
                    </Text>
                    <Text style={styles.heroSub}>
                        Bắt đầu hành trình chinh phục sân đấu ngay hôm nay.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>

                    {/* Full Name */}
                    <Text style={styles.label}>FULL NAME</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nguyễn Văn A"
                            placeholderTextColor="#bbb"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <Text style={styles.inputIcon}>👤</Text>
                    </View>

                    {/* Email */}
                    <Text style={styles.label}>EMAIL</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="example@sport.com"
                            placeholderTextColor="#bbb"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.inputIcon}>✉</Text>
                    </View>

                    {/* Phone */}
                    <Text style={styles.label}>PHONE NUMBER</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="090 123 4567"
                            placeholderTextColor="#bbb"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <Text style={styles.inputIcon}>📞</Text>
                    </View>

                    {/* Password */}
                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#bbb"
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Text style={styles.inputIcon}>{showPass ? '🙈' : '🔒'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#bbb"
                            secureTextEntry={!showConfirm}
                            value={confirmPassword}
                            onChangeText={setConfirmPass}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Text style={styles.inputIcon}>{showConfirm ? '🙈' : '🛡️'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Điều khoản */}
                    <TouchableOpacity
                        style={styles.agreeRow}
                        onPress={() => setAgreed(!agreed)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                            {agreed && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.agreeText}>
                            Tôi đồng ý với các{' '}
                            <Text style={styles.agreeLink}>Điều khoản &amp; Chính sách</Text>
                            {' '}của dịch vụ
                        </Text>
                    </TouchableOpacity>

                    {/* Nút đăng ký */}
                    <TouchableOpacity
                        style={[styles.registerBtn, loading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.registerBtnText}>Đăng ký ngay →</Text>
                        }
                    </TouchableOpacity>

                </View>

                {/* Link đăng nhập */}
                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const GREEN = '#2E7D32';
const GREEN_LIGHT = '#4CAF50';
const BG = '#f0faf0';

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: BG },

    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: BG,
    },

    // Top bar
    topBar: { paddingTop: 48, marginBottom: 24 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    backArrow: { fontSize: 16, color: GREEN_LIGHT, marginRight: 6 },
    backText: {
        fontSize: 14,
        color: GREEN_LIGHT,
        fontWeight: '600'
    },
    pageLabel: { fontSize: 20, color: GREEN_LIGHT, textAlign: 'center', fontWeight: '700' },

    // Hero
    heroSection: { marginBottom: 32 },
    heroText: { lineHeight: 48, marginBottom: 10 },
    heroNormal: { fontSize: 38, fontWeight: '900', color: '#222' },
    heroBold: { fontSize: 38, fontWeight: '900', color: '#111' },
    heroSub: { fontSize: 13, color: '#666', lineHeight: 20 },

    // Form
    form: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },

    label: {
        fontSize: 11, fontWeight: '700', color: '#888',
        letterSpacing: 0.8, marginBottom: 6, marginTop: 12,
    },

    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f5f5f5', borderRadius: 12,
        paddingHorizontal: 14, height: 50,
        borderWidth: 1, borderColor: '#eee',
    },
    input: { flex: 1, fontSize: 14, color: '#333' },
    inputIcon: { fontSize: 16, color: '#aaa' },

    // Checkbox điều khoản
    agreeRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        marginTop: 16, marginBottom: 4, gap: 10,
    },
    checkbox: {
        width: 20, height: 20, borderRadius: 5,
        borderWidth: 2, borderColor: '#ccc',
        justifyContent: 'center', alignItems: 'center',
        marginTop: 1,
    },
    checkboxChecked: { backgroundColor: GREEN_LIGHT, borderColor: GREEN_LIGHT },
    checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
    agreeText: { flex: 1, fontSize: 12, color: '#666', lineHeight: 18 },
    agreeLink: { color: GREEN_LIGHT, fontWeight: '600' },

    // Nút đăng ký
    registerBtn: {
        backgroundColor: GREEN_LIGHT,
        borderRadius: 30, height: 52,
        justifyContent: 'center', alignItems: 'center',
        marginTop: 20,
        shadowColor: GREEN, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },
    btnDisabled: { opacity: 0.7 },
    registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

    // Login link
    loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginText: { fontSize: 13, color: '#666' },
    loginLink: { fontSize: 13, color: GREEN_LIGHT, fontWeight: '700' },
});