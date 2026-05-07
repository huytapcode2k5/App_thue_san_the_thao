import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, Image
} from 'react-native';
import { COLORS } from '../utils/constants';
import { createBooking, getCurrentUser, getBookedSlots } from '../services/jsonDataService';
import AppButton from '../components/AppButton';

const FIELD_IMAGES = {
    'bernabeu': require('../assets/bernabeu.jpg'),
    'old': require('../assets/old.jpg'),
    'anfield': require('../assets/anfield.jpg'),
    'etihad': require('../assets/etihad.jpg'),
};

const SPORT_EMOJI = {
    'Bóng đá': '⚽', 'Cầu lông': '🏸', 'Tennis': '🎾', 'Bóng rổ': '🏀'
};

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
    const field = route?.params?.field;
    const days = getNextDays();

    const [selectedDay, setSelectedDay] = useState(days[0].date);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedHours, setSelectedHours] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        if (field) loadBookedSlots();
    }, [selectedDay]);

    const loadBookedSlots = async () => {
        const slots = await getBookedSlots(field.id, selectedDay);
        setBookedSlots(slots);
        setSelectedTime(null);
    };

    if (!field) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyTitle}>Chưa chọn sân</Text>
                <Text style={styles.emptySub}>
                    Vui lòng chọn sân từ trang chủ hoặc danh sách sân để đặt lịch.
                </Text>
                <TouchableOpacity
                    style={styles.goHomeBtn}
                    onPress={() => navigation.navigate('TabNavigator')}
                >
                    <Text style={styles.goHomeBtnText}>🏠 Về Trang Chủ</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalPrice = field.price * selectedHours;
    const imageSource = FIELD_IMAGES[field.image];

    const handleBooking = async () => {
        if (!selectedTime) {
            Alert.alert('Thông báo', 'Vui lòng chọn giờ bắt đầu!');
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
                    [{ text: 'OK', onPress: () => { loadBookedSlots(); navigation.goBack(); } }]
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

            {/* ẢNH SÂN — tự động lấy từ field.image */}
            <View style={styles.fieldCard}>
                <View style={styles.fieldImageBox}>
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={styles.fieldImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.fieldImagePlaceholder}>
                            <Text style={{ fontSize: 52 }}>{SPORT_EMOJI[field.sport] || '🏟️'}</Text>
                        </View>
                    )}
                    {/* Badge tên sân đè lên ảnh */}
                    <View style={styles.fieldImageOverlay}>
                        <Text style={styles.fieldImageName} numberOfLines={1}>{field.name}</Text>
                        <Text style={styles.fieldImageLocation}>📍 {field.location}</Text>
                    </View>
                </View>

                <View style={styles.fieldInfo}>
                    <View style={styles.fieldTopRow}>
                        <View style={styles.ratingRow}>
                            <Text style={styles.rating}>⭐ {field.rating}</Text>
                            <Text style={styles.sport}>🏅 {field.sport}</Text>
                        </View>
                        <View style={styles.availableBadge}>
                            <Text style={styles.availableBadgeText}>✓ Còn slot</Text>
                        </View>
                    </View>
                    {field.amenities && field.amenities.length > 0 && (
                        <View style={styles.amenitiesRow}>
                            {field.amenities.map(a => (
                                <View key={a} style={styles.amenityChip}>
                                    <Text style={styles.amenityText}>{AMENITY_ICONS[a] || a}</Text>
                                </View>
                            ))}
                        </View>
                    )}
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
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                        <Text style={styles.legendText}>Còn trống</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#ddd' }]} />
                        <Text style={styles.legendText}>Đã đặt</Text>
                    </View>
                </View>
                <View style={styles.timeGrid}>
                    {TIME_SLOTS.map(time => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = selectedTime === time;
                        return (
                            <TouchableOpacity
                                key={time}
                                style={[
                                    styles.timeChip,
                                    isSelected && styles.timeChipActive,
                                    isBooked && styles.timeChipBooked,
                                ]}
                                onPress={() => !isBooked && setSelectedTime(time)}
                                disabled={isBooked}
                            >
                                <Text style={[
                                    styles.timeText,
                                    isSelected && styles.timeTextActive,
                                    isBooked && styles.timeTextBooked,
                                ]}>
                                    {time}
                                </Text>
                                {isBooked && <Text style={styles.bookedLabel}>Đã đặt</Text>}
                            </TouchableOpacity>
                        );
                    })}
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
                    disabled={loading || !selectedTime}
                    size="lg"
                />
            </View>

            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    emptyContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#f5f5f5', padding: 32,
    },
    emptyIcon: { fontSize: 72, marginBottom: 16 },
    emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 },
    emptySub: {
        fontSize: 14, color: '#888', textAlign: 'center',
        lineHeight: 22, marginBottom: 28,
    },
    goHomeBtn: {
        backgroundColor: COLORS.primary, paddingHorizontal: 28,
        paddingVertical: 14, borderRadius: 25,
    },
    goHomeBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

    // Field card
    fieldCard: { backgroundColor: '#fff', marginBottom: 8 },
    fieldImageBox: { position: 'relative' },
    fieldImage: { width: '100%', height: 200 },
    fieldImagePlaceholder: {
        height: 200, backgroundColor: '#e8f8f0',
        justifyContent: 'center', alignItems: 'center',
    },
    fieldImageOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    fieldImageName: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 2 },
    fieldImageLocation: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

    fieldInfo: { padding: 14 },
    fieldTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    ratingRow: { flexDirection: 'row', gap: 14 },
    rating: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
    sport: { fontSize: 14, color: '#888' },
    availableBadge: {
        backgroundColor: '#e8f8f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    availableBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
    amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    amenityChip: {
        backgroundColor: '#e8f8f0', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 10,
    },
    amenityText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },

    section: { backgroundColor: '#fff', marginBottom: 8, padding: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },

    legend: { flexDirection: 'row', gap: 16, marginBottom: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: '#888' },

    dayChip: {
        alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 12, backgroundColor: '#f0f0f0', marginRight: 8, minWidth: 60,
    },
    dayChipActive: { backgroundColor: COLORS.primary },
    dayLabel: { fontSize: 11, color: '#888', fontWeight: '500' },
    dayNumber: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 2 },
    dayTextActive: { color: '#fff' },

    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timeChip: {
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 10, backgroundColor: '#f0f0f0',
        borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center',
    },
    timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    timeChipBooked: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0', opacity: 0.6 },
    timeText: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
    timeTextActive: { color: '#fff' },
    timeTextBooked: { color: '#bbb' },
    bookedLabel: { fontSize: 9, color: '#bbb', marginTop: 2 },

    hoursRow: { flexDirection: 'row', gap: 10 },
    hoursChip: {
        flex: 1, paddingVertical: 14, borderRadius: 12,
        backgroundColor: '#f0f0f0', alignItems: 'center',
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    hoursChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    hoursText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
    hoursTextActive: { color: '#fff' },

    summaryCard: {
        backgroundColor: '#fff', margin: 16,
        borderRadius: 16, padding: 16, elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4,
    },
    summaryTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: '#888' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
    totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },

    bookingBtn: { paddingHorizontal: 16 },
});