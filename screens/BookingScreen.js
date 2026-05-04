import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { COLORS } from '../utils/constants';
import { createBooking, getCurrentUser } from '../services/jsonDataService';
import AppButton from '../components/AppButton';

const AMENITY_ICONS = {
    wifi: '📶 WiFi',
    parking: '🅿️ Đỗ xe',
    locker: '🔒 Tủ đồ',
    shower: '🚿 Tắm',
    cafe: '☕ Cafe',
    air_conditioner: '❄️ Điều hòa',
};

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00',
];

const HOURS_OPTIONS = [1, 2, 3];

// Tạo danh sách 7 ngày tới
const getNextDays = () => {
    const days = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push({
            label: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
            date: d.toISOString().split('T')[0],
            day: d.getDate(),
        });
    }
    return days;
};

export default function BookingScreen({ route, navigation }) {
    const { field } = route.params || {};

    if (!field) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Vui lòng chọn sân từ danh sách</Text>
            </View>
        );
    }
    const days = getNextDays();

    const [selectedDay, setSelectedDay] = useState(days[0].date);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedHours, setSelectedHours] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalPrice = field.price * selectedHours;

    const handleBooking = async () => {
        if (!selectedTime) {
            Alert.alert('Thông báo', 'Vui lòng chọn giờ bắt đầu!');
            return;
        }

        if (!field.available) {
            Alert.alert('Thông báo', 'Sân này hiện không có sẵn!');
            return;
        }

        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (!user) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt sân!');
                return;
            }

            const result = await createBooking({
                userId: user.id,
                fieldId: field.id,
                fieldName: field.name,
                sport: field.sport,
                date: selectedDay,
                time: selectedTime,
                hours: selectedHours,
                totalPrice,
            });

            if (result.success) {
                Alert.alert(
                    '🎉 Đặt sân thành công!',
                    `Sân: ${field.name}\nNgày: ${selectedDay}\nGiờ: ${selectedTime}\nSố giờ: ${selectedHours}h\nTổng tiền: ${totalPrice.toLocaleString('vi-VN')}đ`,
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Lỗi', result.error || 'Đặt sân thất bại, thử lại!');
            }
        } catch (e) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* THÔNG TIN SÂN */}
            <View style={styles.fieldCard}>
                <View style={styles.fieldImagePlaceholder}>
                    <Text style={{ fontSize: 52 }}>
                        {field.sport === 'Bóng đá' ? '⚽' :
                            field.sport === 'Cầu lông' ? '🏸' :
                                field.sport === 'Tennis' ? '🎾' :
                                    field.sport === 'Bóng rổ' ? '🏀' : '🏟️'}
                    </Text>
                </View>
                <View style={styles.fieldInfo}>
                    <View style={styles.fieldTopRow}>
                        <Text style={styles.fieldName}>{field.name}</Text>
                        <View style={[
                            styles.availableBadge,
                            { backgroundColor: field.available ? '#e8f8f0' : '#fde8e8' }
                        ]}>
                            <Text style={{
                                fontSize: 11, fontWeight: '700',
                                color: field.available ? COLORS.primary : COLORS.danger
                            }}>
                                {field.available ? '✓ Còn sân' : '✗ Hết sân'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.fieldLocation}>📍 {field.address}, {field.location}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.rating}>⭐ {field.rating}</Text>
                        <Text style={styles.sport}>🏅 {field.sport}</Text>
                    </View>
                    {/* Tiện ích */}
                    <View style={styles.amenitiesRow}>
                        {field.amenities?.map(a => (
                            <View key={a} style={styles.amenityChip}>
                                <Text style={styles.amenityText}>{AMENITY_ICONS[a] || a}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* CHỌN NGÀY */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Chọn ngày</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {days.map(d => (
                        <TouchableOpacity
                            key={d.date}
                            style={[styles.dayChip, selectedDay === d.date && styles.dayChipActive]}
                            onPress={() => setSelectedDay(d.date)}
                        >
                            <Text style={[styles.dayLabel, selectedDay === d.date && styles.dayTextActive]}>
                                {d.label}
                            </Text>
                            <Text style={[styles.dayNumber, selectedDay === d.date && styles.dayTextActive]}>
                                {d.day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* CHỌN GIỜ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🕐 Chọn giờ bắt đầu</Text>
                <View style={styles.timeGrid}>
                    {TIME_SLOTS.map(time => (
                        <TouchableOpacity
                            key={time}
                            style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
                            onPress={() => setSelectedTime(time)}
                        >
                            <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>
                                {time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* CHỌN SỐ GIỜ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏱️ Số giờ thuê</Text>
                <View style={styles.hoursRow}>
                    {HOURS_OPTIONS.map(h => (
                        <TouchableOpacity
                            key={h}
                            style={[styles.hoursChip, selectedHours === h && styles.hoursChipActive]}
                            onPress={() => setSelectedHours(h)}
                        >
                            <Text style={[styles.hoursText, selectedHours === h && styles.hoursTextActive]}>
                                {h} giờ
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* TỔNG TIỀN */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>💳 Chi tiết thanh toán</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Giá sân/giờ</Text>
                    <Text style={styles.summaryValue}>{field.price.toLocaleString('vi-VN')}đ</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Số giờ</Text>
                    <Text style={styles.summaryValue}>{selectedHours} giờ</Text>
                </View>
                {selectedTime && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Thời gian</Text>
                        <Text style={styles.summaryValue}>{selectedDay} | {selectedTime}</Text>
                    </View>
                )}
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Tổng cộng</Text>
                    <Text style={styles.totalValue}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                </View>
            </View>

            {/* NÚT ĐẶT SÂN */}
            <View style={styles.bookingBtn}>
                <AppButton
                    title={loading ? 'Đang xử lý...' : `Xác nhận đặt sân • ${totalPrice.toLocaleString('vi-VN')}đ`}
                    onPress={handleBooking}
                    loading={loading}
                    disabled={!field.available}
                    size="lg"
                />
                {!field.available && (
                    <Text style={styles.unavailableNote}>
                        ⚠️ Sân này hiện không có sẵn để đặt
                    </Text>
                )}
            </View>

            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    // Field card
    fieldCard: {
        backgroundColor: COLORS.white,
        marginBottom: 8,
    },
    fieldImagePlaceholder: {
        height: 180, backgroundColor: '#e8f8f0',
        justifyContent: 'center', alignItems: 'center',
    },
    fieldInfo: { padding: 16 },
    fieldTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    fieldName: { fontSize: 18, fontWeight: '800', color: COLORS.black, flex: 1, marginRight: 8 },
    availableBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    fieldLocation: { fontSize: 13, color: COLORS.gray, marginTop: 6 },
    ratingRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
    rating: { fontSize: 14, fontWeight: '600', color: COLORS.black },
    sport: { fontSize: 14, color: COLORS.gray },
    amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    amenityChip: {
        backgroundColor: '#e8f8f0', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 10,
    },
    amenityText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },

    // Section
    section: { backgroundColor: COLORS.white, marginBottom: 8, padding: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 12 },

    // Day picker
    dayChip: {
        alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 12, backgroundColor: '#f0f0f0', marginRight: 8,
        minWidth: 60,
    },
    dayChipActive: { backgroundColor: COLORS.primary },
    dayLabel: { fontSize: 11, color: COLORS.gray, fontWeight: '500' },
    dayNumber: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginTop: 2 },
    dayTextActive: { color: COLORS.white },

    // Time grid
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timeChip: {
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 10, backgroundColor: '#f0f0f0',
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    timeText: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    timeTextActive: { color: COLORS.white },

    // Hours
    hoursRow: { flexDirection: 'row', gap: 10 },
    hoursChip: {
        flex: 1, paddingVertical: 14, borderRadius: 12,
        backgroundColor: '#f0f0f0', alignItems: 'center',
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    hoursChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    hoursText: { fontSize: 15, fontWeight: '700', color: COLORS.black },
    hoursTextActive: { color: COLORS.white },

    // Summary
    summaryCard: {
        backgroundColor: COLORS.white, margin: 16,
        borderRadius: 16, padding: 16,
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    },
    summaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: COLORS.gray },
    summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.black },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.black },
    totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },

    // Button
    bookingBtn: { paddingHorizontal: 16 },
    unavailableNote: { textAlign: 'center', color: COLORS.danger, fontSize: 13, marginTop: 8 },
});