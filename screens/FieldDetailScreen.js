import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Image, StatusBar
} from 'react-native';
import { COLORS } from '../utils/constants';

const SPORT_ICONS = {
    'Bóng đá': '⚽',
    'Cầu lông': '🏸',
    'Bóng rổ': '🏀',
    'Tennis': '🎾',
};

const SPORT_COLORS = {
    'Bóng đá': '#27ae60',
    'Cầu lông': '#8e44ad',
    'Bóng rổ': '#e67e22',
    'Tennis': '#2980b9',
};

const FIELD_IMAGES = {
    'bernabeu': require('../assets/bernabeu.jpg'),
    'old': require('../assets/old.jpg'),
    'anfield': require('../assets/anfield.jpg'),
    'etihad': require('../assets/etihad.jpg'),
};

const AMENITY_ICONS = {
    wifi: { icon: '📶', label: 'WiFi miễn phí' },
    parking: { icon: '🅿️', label: 'Bãi đỗ xe' },
    locker: { icon: '🔒', label: 'Tủ đồ' },
    shower: { icon: '🚿', label: 'Phòng tắm' },
    cafe: { icon: '☕', label: 'Cafe' },
    air_conditioner: { icon: '❄️', label: 'Điều hòa' },
};

export default function FieldDetailScreen({ route, navigation }) {
    const { field } = route.params;

    const imageSource = FIELD_IMAGES[field.image];
    const sportColor = SPORT_COLORS[field.sport] || COLORS.primary;
    const sportIcon = SPORT_ICONS[field.sport] || '🏟️';

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {/* ẢNH HEADER */}
                <View style={styles.imageContainer}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.headerImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: sportColor + '33' }]}>
                            <Text style={{ fontSize: 80 }}>{sportIcon}</Text>
                        </View>
                    )}

                    {/* Overlay gradient mờ phía dưới ảnh */}
                    <View style={styles.imageOverlay} />

                    {/* Nút quay lại */}
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backBtnText}>←</Text>
                    </TouchableOpacity>

                    {/* Badge môn thể thao */}
                    <View style={[styles.sportBadge, { backgroundColor: sportColor }]}>
                        <Text style={styles.sportBadgeText}>{sportIcon} {field.sport}</Text>
                    </View>

                    {/* Badge còn/hết sân */}
                    <View style={[styles.availBadge, { backgroundColor: field.available ? '#27ae60' : '#e74c3c' }]}>
                        <Text style={styles.availBadgeText}>
                            {field.available ? '● Còn sân' : '● Hết sân'}
                        </Text>
                    </View>
                </View>

                {/* NỘI DUNG CHI TIẾT */}
                <View style={styles.content}>

                    {/* TÊN & RATING */}
                    <View style={styles.titleRow}>
                        <Text style={styles.fieldName}>{field.name}</Text>
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingStar}>⭐</Text>
                            <Text style={styles.ratingValue}>{field.rating}</Text>
                        </View>
                    </View>

                    {/* ĐỊA CHỈ */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <View>
                            <Text style={styles.infoMain}>{field.location}</Text>
                            {field.address ? (
                                <Text style={styles.infoSub}>{field.address}</Text>
                            ) : null}
                        </View>
                    </View>

                    {/* GIÁ */}
                    <View style={styles.priceCard}>
                        <View>
                            <Text style={styles.priceLabel}>Giá thuê sân</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceValue}>
                                    {field.price.toLocaleString('vi-VN')}đ
                                </Text>
                                <Text style={styles.priceUnit}> / giờ</Text>
                            </View>
                        </View>
                        <View style={styles.priceRight}>
                            <Text style={styles.priceNote}>Giá đã bao gồm{'\n'}đèn chiếu sáng</Text>
                        </View>
                    </View>

                    {/* TIỆN ÍCH */}
                    {field.amenities && field.amenities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tiện ích</Text>
                            <View style={styles.amenityGrid}>
                                {field.amenities.map(a => {
                                    const info = AMENITY_ICONS[a] || { icon: '✅', label: a };
                                    return (
                                        <View key={a} style={styles.amenityItem}>
                                            <View style={styles.amenityIconBox}>
                                                <Text style={styles.amenityIcon}>{info.icon}</Text>
                                            </View>
                                            <Text style={styles.amenityLabel}>{info.label}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* THÔNG TIN THÊM */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin sân</Text>
                        <View style={styles.infoCard}>
                            <InfoRow icon="🏅" label="Môn thể thao" value={field.sport} />
                            <InfoRow icon="⭐" label="Đánh giá" value={`${field.rating} / 5.0`} />
                            <InfoRow icon="🕐" label="Giờ mở cửa" value="06:00 - 22:00" />
                            <InfoRow
                                icon={field.available ? '✅' : '❌'}
                                label="Trạng thái"
                                value={field.available ? 'Còn sân' : 'Hết sân'}
                                valueColor={field.available ? '#27ae60' : '#e74c3c'}
                                last
                            />
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* NÚT ĐẶT SÂN CỐ ĐỊNH DƯỚI */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomPriceBox}>
                    <Text style={styles.bottomPriceLabel}>Chỉ từ</Text>
                    <Text style={styles.bottomPrice}>
                        {field.price.toLocaleString('vi-VN')}đ
                        <Text style={styles.bottomPriceUnit}>/giờ</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookBtn, !field.available && styles.bookBtnDisabled]}
                    onPress={() => {
    if (!field.available) return;
    const bookingRoute = route.name === 'FieldDetailTab' ? 'BookingTab' : 'Booking';
    navigation.navigate(bookingRoute, { field });
}}
                    disabled={!field.available}
                    activeOpacity={0.85}
                >
                    <Text style={styles.bookBtnText}>
                        {field.available ? '📅 Đặt sân ngay' : '❌ Hết sân'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function InfoRow({ icon, label, value, valueColor, last }) {
    return (
        <View style={[styles.infoRowItem, !last && styles.infoRowBorder]}>
            <Text style={styles.infoRowIcon}>{icon}</Text>
            <Text style={styles.infoRowLabel}>{label}</Text>
            <Text style={[styles.infoRowValue, valueColor && { color: valueColor }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#f4f6f8' },

    // Image header
    imageContainer: { position: 'relative', height: 280 },
    headerImage: { width: '100%', height: 280 },
    imagePlaceholder: { width: '100%', height: 280, justifyContent: 'center', alignItems: 'center' },
    imageOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        backgroundColor: 'rgba(0,0,0,0.18)',
    },
    backBtn: {
        position: 'absolute', top: 52, left: 16,
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center',
    },
    backBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 },
    sportBadge: {
        position: 'absolute', bottom: 14, left: 16,
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    },
    sportBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    availBadge: {
        position: 'absolute', top: 52, right: 16,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    availBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

    // Content
    content: {
        backgroundColor: '#f4f6f8',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        marginTop: -24, padding: 20,
    },
    titleRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 12,
    },
    fieldName: { fontSize: 22, fontWeight: '900', color: '#1a1a1a', flex: 1, marginRight: 12, lineHeight: 28 },
    ratingBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff8e1', paddingHorizontal: 10,
        paddingVertical: 6, borderRadius: 12,
    },
    ratingStar: { fontSize: 14 },
    ratingValue: { fontSize: 15, fontWeight: '800', color: '#f39c12', marginLeft: 4 },

    // Info row
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
    infoIcon: { fontSize: 18, marginTop: 2 },
    infoMain: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
    infoSub: { fontSize: 12, color: '#888', marginTop: 2 },

    // Price card
    priceCard: {
        backgroundColor: '#fff', borderRadius: 16,
        padding: 16, marginBottom: 16,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        elevation: 2,
    },
    priceLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline' },
    priceValue: { fontSize: 26, fontWeight: '900', color: COLORS.primary },
    priceUnit: { fontSize: 14, color: '#aaa', fontWeight: '500' },
    priceRight: { alignItems: 'flex-end' },
    priceNote: { fontSize: 11, color: '#aaa', textAlign: 'right', lineHeight: 16 },

    // Section
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },

    // Amenities
    amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    amenityItem: { alignItems: 'center', width: 72 },
    amenityIconBox: {
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: '#fff', justifyContent: 'center',
        alignItems: 'center', marginBottom: 6, elevation: 2,
    },
    amenityIcon: { fontSize: 24 },
    amenityLabel: { fontSize: 11, color: '#555', textAlign: 'center', fontWeight: '500' },

    // Info card
    infoCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2 },
    infoRowItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    infoRowIcon: { fontSize: 18, width: 32 },
    infoRowLabel: { flex: 1, fontSize: 14, color: '#888', fontWeight: '500' },
    infoRowValue: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },

    // Bottom bar
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 14,
        paddingBottom: 28,
        borderTopWidth: 1, borderTopColor: '#f0f0f0',
        elevation: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1, shadowRadius: 6,
    },
    bottomPriceBox: { flex: 1 },
    bottomPriceLabel: { fontSize: 11, color: '#aaa' },
    bottomPrice: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
    bottomPriceUnit: { fontSize: 13, fontWeight: '500', color: '#aaa' },
    bookBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24, paddingVertical: 14,
        borderRadius: 16,
    },
    bookBtnDisabled: { backgroundColor: '#ccc' },
    bookBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});