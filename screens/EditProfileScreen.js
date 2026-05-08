import React, { useState, useContext, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, StatusBar, Alert, KeyboardAvoidingView,
    Platform, Animated,
} from 'react-native';
import { AuthContext } from '../store/AuthContext';

const GREEN = '#2E7D32';
const GREEN_MID = '#4CAF50';

// ── Avatar ───────────────────────────────────────────────────────
function Avatar({ name }) {
    const initials = name
        ? name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
        : '?';
    return (
        <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Input field ──────────────────────────────────────────────────
function InputField({ label, value, onChangeText, placeholder, icon, keyboardType, editable = true }) {
    const [focused, setFocused] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    };

    const borderColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E8E8E8', GREEN_MID],
    });

    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Animated.View style={[styles.fieldBox, { borderColor }, !editable && styles.fieldBoxDisabled]}>
                <TextInput
                    style={styles.fieldInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#C0C0C0"
                    keyboardType={keyboardType || 'default'}
                    editable={editable}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {icon && <Text style={styles.fieldIcon}>{icon}</Text>}
            </Animated.View>
        </View>
    );
}

// ── Gender selector ──────────────────────────────────────────────
function GenderPicker({ value, onChange }) {
    const options = ['Nam', 'Nữ', 'Khác'];
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>GIỚI TÍNH</Text>
            <View style={styles.genderRow}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.genderBtn, value === opt && styles.genderBtnActive]}
                        onPress={() => onChange(opt)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.genderText, value === opt && styles.genderTextActive]}>
                            {opt === 'Nam' ? '♂ ' : opt === 'Nữ' ? '♀ ' : '⚧ '}{opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

// ── Main ─────────────────────────────────────────────────────────
export default function EditProfileScreen({ navigation }) {
    const { user, updateProfile } = useContext(AuthContext);

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [gender, setGender] = useState(user?.gender || 'Nam');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập họ và tên.');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập email.');
            return;
        }

        setSaving(true);
        const result = await updateProfile({ fullName, email, phone, dob, gender });
        setSaving(false);

        if (result.success) {
            Alert.alert('✅ Thành công', 'Thông tin đã được cập nhật!', [
                { text: 'OK', onPress: () => navigation?.goBack() }
            ]);
        } else {
            Alert.alert('Lỗi', result.error || 'Cập nhật thất bại, thử lại!');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.root}>
                <StatusBar barStyle="light-content" backgroundColor={GREEN} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Avatar section */}
                    <View style={styles.avatarSection}>
                        <Avatar name={fullName} />
                        <Text style={styles.avatarName}>{fullName}</Text>
                        <View style={styles.memberBadge}>
                            <Text style={styles.memberStar}>★</Text>
                            <Text style={styles.memberText}>THÀNH VIÊN HẠNG VÀNG</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.formCard}>
                        <InputField
                            label="HỌ VÀ TÊN"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Nhập họ và tên"
                            icon="👤"
                        />
                        <InputField
                            label="EMAIL"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Nhập email"
                            icon="✉️"
                            keyboardType="email-address"
                        />
                        <InputField
                            label="SỐ ĐIỆN THOẠI"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            icon="📞"
                            keyboardType="phone-pad"
                        />
                        <InputField
                            label="NGÀY SINH"
                            value={dob}
                            onChangeText={setDob}
                            placeholder="DD/MM/YYYY"
                            icon="📅"
                        />
                        <GenderPicker value={gender} onChange={setGender} />
                    </View>

                    {/* Save button */}
                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnLoading]}
                        onPress={handleSave}
                        activeOpacity={0.85}
                        disabled={saving}
                    >
                        <Text style={styles.saveBtnText}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.privacyNote}>
                        🔒 Thông tin của bạn được bảo mật theo chính sách quyền riêng tư
                    </Text>

                    <View style={{ height: 32 }} />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F4F6F4' },
    header: {
        backgroundColor: GREEN, paddingTop: 48, paddingBottom: 16,
        paddingHorizontal: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center', justifyContent: 'center',
    },
    backIcon: { fontSize: 28, color: '#fff', fontWeight: '300', marginTop: -2 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
    scrollContent: { paddingBottom: 24 },
    avatarSection: {
        backgroundColor: GREEN, paddingBottom: 32,
        alignItems: 'center', borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32, paddingTop: 8,
    },
    avatarWrapper: { position: 'relative', marginBottom: 12 },
    avatarRing: {
        width: 96, height: 96, borderRadius: 48,
        borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', padding: 3,
    },
    avatarCircle: {
        flex: 1, borderRadius: 45, backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 30, fontWeight: '900', color: GREEN },
    cameraBtn: {
        position: 'absolute', bottom: 0, right: -4,
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: GREEN_MID, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#fff', elevation: 4,
    },
    cameraIcon: { fontSize: 14 },
    avatarName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
    memberBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,215,0,0.22)',
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.45)',
    },
    memberStar: { fontSize: 12, color: '#FFD700' },
    memberText: { fontSize: 11, fontWeight: '800', color: '#FFD700', letterSpacing: 0.8 },
    formCard: {
        backgroundColor: '#fff', marginHorizontal: 16, marginTop: -16,
        borderRadius: 20, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
    },
    fieldWrapper: { marginBottom: 16 },
    fieldLabel: {
        fontSize: 10, fontWeight: '800', color: '#9E9E9E',
        letterSpacing: 1.2, marginBottom: 6, marginLeft: 2,
    },
    fieldBox: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#E8E8E8',
        borderRadius: 12, paddingHorizontal: 14, height: 50,
        backgroundColor: '#FAFAFA',
    },
    fieldBoxDisabled: { backgroundColor: '#F0F0F0' },
    fieldInput: { flex: 1, fontSize: 15, color: '#222', fontWeight: '500' },
    fieldIcon: { fontSize: 16, marginLeft: 8 },
    genderRow: { flexDirection: 'row', gap: 6 },
    genderBtn: {
        flex: 1, height: 50, borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E8E8E8',
        backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center',
    },
    genderBtnActive: { borderColor: GREEN_MID, backgroundColor: '#E8F5E9' },
    genderText: { fontSize: 12, color: '#999', fontWeight: '600' },
    genderTextActive: { color: GREEN, fontWeight: '800' },
    saveBtn: {
        marginHorizontal: 16, marginTop: 24, height: 54, borderRadius: 16,
        backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
        elevation: 6, shadowColor: GREEN, shadowOpacity: 0.45,
        shadowOffset: { width: 0, height: 6 }, shadowRadius: 12,
    },
    saveBtnLoading: { backgroundColor: GREEN_MID, elevation: 2 },
    saveBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
    privacyNote: {
        textAlign: 'center', fontSize: 11, color: '#AAA',
        marginTop: 14, marginHorizontal: 32, lineHeight: 17,
    },
});