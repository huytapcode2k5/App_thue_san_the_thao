import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    // ── Đăng nhập bằng email/password ──────────────────────────────
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://192.168.1.x:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

            // Lưu user vào Context (token, thông tin user...)
            await login(data.user, data.token);

            // Navigation sẽ tự chuyển màn hình khi Context cập nhật

        } catch (err) {
            Alert.alert('Đăng nhập thất bại', err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Google / Facebook (placeholder – tích hợp OAuth sau) ───────
    const handleGoogle = () => Alert.alert('Google', 'Tính năng đang phát triển');
    const handleFacebook = () => Alert.alert('Facebook', 'Tính năng đang phát triển');

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
                {/* Header chữ nhỏ */}
                <Text style={styles.headerLabel}>Đăng nhập</Text>

                {/* Logo + Tên app */}
                <View style={styles.logoBox}>
                    <Text style={styles.logoIcon}>⚽</Text>
                </View>
                <Text style={styles.appTitle}>THUÊ SÂN{'\n'}THỂ THAO</Text>
                <Text style={styles.appSubtitle}>Đánh thức đam mê, bứt phá giới hạn</Text>

                {/* Form card */}
                <View style={styles.card}>

                    {/* Email */}
                    <Text style={styles.label}>ĐỊA CHỈ EMAIL</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>✉</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor="#aaa"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>MẬT KHẨU</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#aaa"
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nút đăng nhập */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.loginBtnText}>Đăng Nhập →</Text>
                        }
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social buttons */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle} activeOpacity={0.8}>
                            <Text style={styles.socialIcon}>G</Text>
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} onPress={handleFacebook} activeOpacity={0.8}>
                            <Text style={[styles.socialIcon, { color: '#1877F2' }]}>f</Text>
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Link đăng ký */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerLink}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ── Styles ────────────────────────────────────────────────────────
const GREEN = '#2E7D32';
const GREEN_LIGHT = '#4CAF50';
const BG = '#f0faf0';

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: BG },

    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
        backgroundColor: BG,
    },

    // Header nhỏ trái
    headerLabel: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },

    // Logo
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    logoIcon: { fontSize: 32 },

    // Tên app
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: GREEN,
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: 1,
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 28,
        textAlign: 'center',
    },

    // Card form
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 24,
    },

    // Label
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#888',
        letterSpacing: 0.8,
        marginBottom: 6,
        marginTop: 4,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 6,
    },
    forgotText: { fontSize: 12, color: GREEN_LIGHT, fontWeight: '600' },

    // Input
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputIcon: { fontSize: 16, marginRight: 8, color: '#aaa' },
    input: { flex: 1, fontSize: 14, color: '#333' },
    eyeIcon: { fontSize: 16, color: '#aaa', paddingLeft: 8 },

    // Nút đăng nhập
    loginBtn: {
        backgroundColor: GREEN_LIGHT,
        borderRadius: 30,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: GREEN,
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    loginBtnDisabled: { opacity: 0.7 },
    loginBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
    dividerText: { fontSize: 11, color: '#aaa', marginHorizontal: 10, letterSpacing: 0.5 },

    // Social
    socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        height: 46,
        gap: 8,
        backgroundColor: '#fafafa',
    },
    socialIcon: { fontSize: 18, fontWeight: '700', color: '#EA4335' },
    socialText: { fontSize: 14, color: '#333', fontWeight: '500' },

    // Register
    registerRow: { flexDirection: 'row', alignItems: 'center' },
    registerText: { fontSize: 13, color: '#666' },
    registerLink: { fontSize: 13, color: GREEN_LIGHT, fontWeight: '700' },
});