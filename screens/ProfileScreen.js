// screens/ProfileScreen.js
import React, { useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Dimensions, Alert,
} from 'react-native';
import { AuthContext } from '../store/AuthContext';

const { width } = Dimensions.get('window');
const GREEN = '#2E7D32';
const GREEN_MID = '#4CAF50';
const GREEN_LIGHT = '#66BB6A';

// ── Avatar placeholder (chữ cái đầu) ─────────────────────────────
function Avatar({ name }) {
    const initials = name
        ? name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
        : '?';
    return (
        <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
        </View>
    );
}

// ── Menu item ─────────────────────────────────────────────────────
function MenuItem({ icon, label, subtitle, onPress, danger }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
                <Text style={styles.menuIconText}>{icon}</Text>
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
                {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
            </View>
            {!danger && <Text style={styles.menuArrow}>›</Text>}
        </TouchableOpacity>
    );
}

// ── Section title ─────────────────────────────────────────────────
function SectionTitle({ title }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    const fullName = user?.fullName || 'Người dùng';
    const email = user?.email || '';
    const bookingCount = 26;
    const rating = 4.9;

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất không?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: logout },
            ]
        );
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={GREEN} />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                {/* ── HEADER ── */}
                <View style={styles.header}>
                    {/* Tiêu đề */}
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Thuê Sân Thể{'\n'}Thao</Text>
                        <TouchableOpacity style={styles.notifBtn}>
                            <Text style={styles.notifIcon}>🔔</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Profile card */}
                    <View style={styles.profileCard}>
                        <Avatar name={fullName} />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{fullName}</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeStar}>★</Text>
                                    <Text style={styles.badgeText}>THÀNH VIÊN VÀNG</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{bookingCount}</Text>
                            <Text style={styles.statLabel}>LỊCH ĐÃ CHI</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{rating}</Text>
                            <Text style={styles.statLabel}>LY TIN</Text>
                        </View>
                    </View>
                </View>

                {/* ── BODY ── */}
                <View style={styles.body}>

                    {/* Quản lý tài khoản */}
                    <SectionTitle title="Quản lý tài khoản" />
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="👤"
                            label="Thông tin cá nhân"
                            subtitle="Cập nhật hồ sơ của bạn"
                            onPress={() => Alert.alert('Thông tin cá nhân')}
                        />
                        <View style={styles.menuSep} />
                        <MenuItem
                            icon="📅"
                            label="Lịch sử đặt sân"
                            subtitle="Xem các lịch đặt đã qua"
                            onPress={() => navigation.navigate('History')}
                        />
                        <View style={styles.menuSep} />
                        <MenuItem
                            icon="📍"
                            label="Địa chỉ đã lưu"
                            subtitle="Quản lý các địa chỉ của bạn"
                            onPress={() => Alert.alert('Địa chỉ đã lưu')}
                        />
                        <View style={styles.menuSep} />
                        <MenuItem
                            icon="💳"
                            label="Phương thức thanh toán"
                            subtitle="Quản lý ví và số tài khoản"
                            onPress={() => Alert.alert('Thanh toán')}
                        />
                    </View>

                    {/* Hệ thống */}
                    <SectionTitle title="Hệ thống" />
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="⚙️"
                            label="Cài đặt"
                            onPress={() => Alert.alert('Cài đặt')}
                        />
                        <View style={styles.menuSep} />
                        <MenuItem
                            icon="🔑"
                            label="Đổi mật khẩu"
                            onPress={() => Alert.alert('Đổi mật khẩu')}
                        />
                    </View>

                    {/* Đăng xuất */}
                    <View style={[styles.menuCard, { marginTop: 8 }]}>
                        <MenuItem
                            icon="🚪"
                            label="Đăng xuất"
                            onPress={handleLogout}
                            danger
                        />
                    </View>

                    {/* Banner VIP */}
                    <View style={styles.banner}>
                        <View style={styles.bannerLeft}>
                            <Text style={styles.bannerTag}>GÓI ĐẶC BIỆT</Text>
                            <Text style={styles.bannerTitle}>Nâng cấp lên VIP ngay hôm nay</Text>
                            <TouchableOpacity style={styles.bannerBtn}>
                                <Text style={styles.bannerBtnText}>Tìm hiểu thêm</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.bannerEmoji}>🏆</Text>
                    </View>

                    <View style={{ height: 24 }} />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f5f5' },

    // Header
    header: {
        backgroundColor: GREEN,
        paddingTop: 48,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerTop: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 26,
    },
    notifBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    notifIcon: { fontSize: 18 },

    // Avatar
    avatarCircle: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: GREEN_LIGHT,
    },
    avatarText: { fontSize: 24, fontWeight: '800', color: GREEN },

    // Profile card
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
    badgeRow: { flexDirection: 'row' },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,215,0,0.25)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.5)',
    },
    badgeStar: { fontSize: 12, color: '#FFD700' },
    badgeText: { fontSize: 11, color: '#FFD700', fontWeight: '700', letterSpacing: 0.5 },

    // Stats
    statsRow: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24,
        justifyContent: 'space-around', alignItems: 'center',
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
    statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.8, marginTop: 2 },
    statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },

    // Body
    body: { paddingHorizontal: 16, paddingTop: 20 },
    sectionTitle: {
        fontSize: 13, fontWeight: '700', color: '#555',
        letterSpacing: 0.5, marginBottom: 8, marginLeft: 4,
    },

    // Menu card
    menuCard: {
        backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 16, gap: 12,
    },
    menuIcon: {
        width: 38, height: 38, borderRadius: 10,
        backgroundColor: '#f0faf0', justifyContent: 'center', alignItems: 'center',
    },
    menuIconDanger: { backgroundColor: '#fff0f0' },
    menuIconText: { fontSize: 18 },
    menuContent: { flex: 1 },
    menuLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
    menuLabelDanger: { color: '#e53935' },
    menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
    menuArrow: { fontSize: 22, color: '#ccc', fontWeight: '300' },
    menuSep: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 66 },

    // Banner VIP
    banner: {
        backgroundColor: GREEN,
        borderRadius: 20, padding: 20,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginTop: 8,
        overflow: 'hidden',
    },
    bannerLeft: { flex: 1 },
    bannerTag: {
        fontSize: 10, fontWeight: '800', color: '#FFD700',
        letterSpacing: 1.5, marginBottom: 6,
    },
    bannerTitle: {
        fontSize: 16, fontWeight: '800', color: '#fff',
        lineHeight: 22, marginBottom: 14,
    },
    bannerBtn: {
        backgroundColor: '#fff', borderRadius: 20,
        paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start',
    },
    bannerBtnText: { fontSize: 13, fontWeight: '700', color: GREEN },
    bannerEmoji: { fontSize: 56, marginLeft: 10 },
});