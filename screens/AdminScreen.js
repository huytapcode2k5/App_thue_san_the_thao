import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, RefreshControl, Alert, ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../store/AuthContext';
import { getUsers, getBookings } from '../services/jsonDataService';

const GREEN = '#2E7D32';
const GREEN_MID = '#4CAF50';

// ── Tab button ────────────────────────────────────────────────────
function TabBtn({ label, active, onPress, count }) {
    return (
        <TouchableOpacity
            style={[styles.tabBtn, active && styles.tabBtnActive]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                {label}
            </Text>
            {count !== undefined && (
                <View style={[styles.tabCount, active && styles.tabCountActive]}>
                    <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
                        {count}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

// ── User card ─────────────────────────────────────────────────────
function UserCard({ user, index }) {
    const initials = user.fullName
        ? user.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
        : '?';
    const isAdmin = user.role === 'admin';

    return (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={[styles.avatar, isAdmin && styles.avatarAdmin]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{user.fullName || 'Chưa đặt tên'}</Text>
                    <View style={[styles.roleBadge, isAdmin && styles.roleBadgeAdmin]}>
                        <Text style={[styles.roleBadgeText, isAdmin && styles.roleBadgeTextAdmin]}>
                            {isAdmin ? '👑 Admin' : '👤 User'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.cardSub}>✉️ {user.email}</Text>
                {user.phone ? <Text style={styles.cardSub}>📞 {user.phone}</Text> : null}
                <Text style={styles.cardMeta}>ID: {user.id}</Text>
            </View>
        </View>
    );
}

// ── Booking card ──────────────────────────────────────────────────
const STATUS_CONFIG = {
    confirmed: { label: 'Đã xác nhận', color: '#2E7D32', bg: '#E8F5E9' },
    pending: { label: 'Chờ duyệt', color: '#F57C00', bg: '#FFF3E0' },
    cancelled: { label: 'Đã huỷ', color: '#C62828', bg: '#FFEBEE' },
};

function BookingCard({ booking }) {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
    const date = new Date(booking.createdAt).toLocaleDateString('vi-VN');

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        🏟️ {booking.fieldName}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                        </Text>
                    </View>
                </View>
                <Text style={styles.cardSub}>👤 User: {booking.userId}</Text>
                <Text style={styles.cardSub}>📅 Ngày: {booking.date}  ⏱ {booking.hours}h</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardMeta}>Tạo lúc: {date}</Text>
                    <Text style={styles.cardPrice}>
                        {booking.totalPrice?.toLocaleString('vi-VN')}đ
                    </Text>
                </View>
            </View>
        </View>
    );
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function AdminScreen({ navigation }) {
    const { user: currentUser, logout } = useContext(AuthContext);
    const [tab, setTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Chỉ admin mới vào được
    useEffect(() => {
        if (currentUser?.role !== 'admin') {
            Alert.alert('Không có quyền', 'Bạn không có quyền truy cập trang này.');
            navigation.goBack();
        }
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        const [u, b] = await Promise.all([getUsers(), getBookings()]);
        setUsers(u);
        setBookings(b);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const [u, b] = await Promise.all([getUsers(), getBookings()]);
        setUsers(u);
        setBookings(b);
        setRefreshing(false);
    };

    useEffect(() => { loadData(); }, []);

    const normalUsers = users.filter(u => u.role !== 'admin');
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={GREEN} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>Bảng điều khiển</Text>
                    <Text style={styles.headerTitle}>Admin Panel</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

            {/* Stats tổng quan */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{normalUsers.length}</Text>
                    <Text style={styles.statLabel}>Người dùng</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{bookings.length}</Text>
                    <Text style={styles.statLabel}>Đặt sân</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>
                        {(totalRevenue / 1000000).toFixed(1)}M
                    </Text>
                    <Text style={styles.statLabel}>Doanh thu</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                <TabBtn
                    label="Người dùng"
                    active={tab === 'users'}
                    onPress={() => setTab('users')}
                    count={normalUsers.length}
                />
                <TabBtn
                    label="Đặt sân"
                    active={tab === 'bookings'}
                    onPress={() => setTab('bookings')}
                    count={bookings.length}
                />
            </View>

            {/* Content */}
            {loading ? (
                <ActivityIndicator size="large" color={GREEN_MID} style={{ marginTop: 40 }} />
            ) : (
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[GREEN_MID]} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {tab === 'users' ? (
                        normalUsers.length === 0 ? (
                            <Text style={styles.empty}>Chưa có người dùng nào</Text>
                        ) : (
                            normalUsers.map((u, i) => <UserCard key={u.id} user={u} index={i} />)
                        )
                    ) : (
                        bookings.length === 0 ? (
                            <Text style={styles.empty}>Chưa có đặt sân nào</Text>
                        ) : (
                            bookings.map(b => <BookingCard key={b.id} booking={b} />)
                        )
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f5f5' },

    // Header
    header: {
        backgroundColor: GREEN,
        paddingTop: 48, paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginTop: 2 },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 20,
    },
    logoutText: { fontSize: 13, color: '#fff', fontWeight: '600' },

    // Stats
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16, marginTop: -1,
        borderRadius: 16, padding: 16,
        elevation: 4, shadowColor: '#000',
        shadowOpacity: 0.08, shadowRadius: 8,
        gap: 0, marginBottom: 8,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 22, fontWeight: '900', color: GREEN },
    statLabel: { fontSize: 11, color: '#888', marginTop: 2 },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        marginHorizontal: 16, marginVertical: 8, gap: 8,
    },
    tabBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 10, borderRadius: 12,
        backgroundColor: '#fff', gap: 6,
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    tabBtnActive: { backgroundColor: GREEN, borderColor: GREEN },
    tabBtnText: { fontSize: 14, fontWeight: '600', color: '#666' },
    tabBtnTextActive: { color: '#fff' },
    tabCount: {
        backgroundColor: '#f0f0f0', borderRadius: 10,
        paddingHorizontal: 7, paddingVertical: 2,
    },
    tabCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
    tabCountText: { fontSize: 11, fontWeight: '700', color: '#666' },
    tabCountTextActive: { color: '#fff' },

    // List
    list: { flex: 1 },
    empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },

    // Card
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 14,
        marginBottom: 10, flexDirection: 'row', gap: 12,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    },
    cardLeft: { justifyContent: 'center' },
    cardContent: { flex: 1 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', flex: 1, marginRight: 8 },
    cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
    cardMeta: { fontSize: 11, color: '#aaa', marginTop: 4 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    cardPrice: { fontSize: 14, fontWeight: '800', color: GREEN },

    // Avatar
    avatar: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
    },
    avatarAdmin: { backgroundColor: '#FFF8E1' },
    avatarText: { fontSize: 16, fontWeight: '800', color: GREEN },

    // Badges
    roleBadge: {
        backgroundColor: '#E8F5E9', borderRadius: 10,
        paddingHorizontal: 8, paddingVertical: 3,
    },
    roleBadgeAdmin: { backgroundColor: '#FFF8E1' },
    roleBadgeText: { fontSize: 11, fontWeight: '700', color: GREEN },
    roleBadgeTextAdmin: { color: '#F57C00' },
    statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
    statusText: { fontSize: 11, fontWeight: '700' },
});