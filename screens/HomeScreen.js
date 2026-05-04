import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator,
    Dimensions, StatusBar, Image
} from 'react-native';
import { COLORS } from '../utils/constants';
import { getFields, getCurrentUser } from '../services/jsonDataService';

const { width } = Dimensions.get('window');

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

const FAKE_PRODUCTS = [
    { id: 'p1', name: 'Vợt Asrex 660 Pro Gen 3', price: 4250000, icon: '🏸' },
    { id: 'p2', name: 'Nike Mercurial', price: 3900000, icon: '👟' },
];

const SPORTS = ['Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ'];

export default function HomeScreen({ navigation }) {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const fieldsData = await getFields();
            setFields(fieldsData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // Lấy 1 sân đại diện cho mỗi môn (sân nổi bật)
    const featuredFields = SPORTS.map(sport =>
        fields.find(f => f.sport === sport)
    ).filter(Boolean);

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Trang Chủ</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconText}>🔍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconText}>🛒</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* BANNER */}
                <View style={styles.banner}>
                    <View style={styles.bannerLeft}>
                        <View style={styles.bannerBadge}>
                            <Text style={styles.bannerBadgeText}>⚡ Ưu đãi 11:00 - 15:00</Text>
                        </View>
                        <Text style={styles.bannerTitle}>Giảm 50% Sân{'\n'}Cầu Lông</Text>
                        <Text style={styles.bannerSub}>Đặt ngay hôm nay{'\n'}Số lượng có hạn!</Text>
                        <TouchableOpacity
                            style={styles.bannerBtn}
                            onPress={() => navigation.navigate('FieldList')}
                        >
                            <Text style={styles.bannerBtnText}>Khám Phá Ngay</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bannerRight}>
                        <Text style={{ fontSize: 80 }}>🏸</Text>
                    </View>
                </View>

                {/* SÂN NỔI BẬT */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Sân Nổi Bật</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('FieldList')}>
                        <Text style={styles.seeAll}>Tất cả sân</Text>
                    </TouchableOpacity>
                </View>

                {featuredFields.map(field => (
                    <FieldCard
                        key={field.id}
                        field={field}
                        onPress={() => navigation.navigate('Booking', { field })}
                    />
                ))}

                {/* DANH SÁCH THEO TỪNG MÔN */}
                {SPORTS.map(sport => {
                    const sportFields = fields.filter(f => f.sport === sport);
                    if (sportFields.length === 0) return null;
                    return (
                        <View key={sport}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    {SPORT_ICONS[sport]} Sân {sport}
                                </Text>
                                <Text style={styles.sportCount}>{sportFields.length} sân</Text>
                            </View>
                            {sportFields.map(field => (
                                <FieldCard
                                    key={field.id}
                                    field={field}
                                    onPress={() => navigation.navigate('Booking', { field })}
                                />
                            ))}
                        </View>
                    );
                })}

                {/* SẢN PHẨM BÁN CHẠY */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Sản Phẩm Bán Chạy</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>Tất cả</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.productGrid}>
                    {FAKE_PRODUCTS.map(p => (
                        <TouchableOpacity key={p.id} style={styles.productCard}>
                            <View style={styles.productImageBox}>
                                <Text style={{ fontSize: 48 }}>{p.icon}</Text>
                            </View>
                            <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                            <Text style={styles.productPrice}>
                                {p.price.toLocaleString('vi-VN')}đ
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BANNER DƯỚI */}
                <View style={styles.bottomBanner}>
                    <Text style={styles.bottomBannerTitle}>Sẵn Sàng{'\n'}Cho Trận Đấu?</Text>
                    <Text style={styles.bottomBannerSub}>
                        Hơn 500 sân thể thao đang chờ bạn.{'\n'}Đặt ngay - Ưu đãi hôm nay!
                    </Text>
                    <TouchableOpacity
                        style={styles.bottomBannerBtn}
                        onPress={() => navigation.navigate('FieldList')}
                    >
                        <Text style={styles.bottomBannerBtnText}>🏟️ Đặt sân ngay</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>
        </View>
    );
}

// Component card tái sử dụng
function FieldCard({ field, onPress }) {
    const imageKey = field.image;
    const imageSource = FIELD_IMAGES[imageKey];

    return (
        <TouchableOpacity style={styles.fieldCard} activeOpacity={0.92} onPress={onPress}>
            <View style={styles.fieldImageBox}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.fieldImage} resizeMode="cover" />
                ) : (
                    <View style={[styles.fieldImagePlaceholder,
                        { backgroundColor: (SPORT_COLORS[field.sport] || '#27ae60') + '22' }]}>
                        <Text style={{ fontSize: 56 }}>{SPORT_ICONS[field.sport] || '🏟️'}</Text>
                    </View>
                )}
                <View style={[styles.sportBadge,
                    { backgroundColor: SPORT_COLORS[field.sport] || COLORS.primary }]}>
                    <Text style={styles.sportBadgeText}>{field.sport}</Text>
                </View>
                <View style={[styles.availBadge,
                    { backgroundColor: field.available ? '#27ae60' : '#e74c3c' }]}>
                    <Text style={styles.availBadgeText}>
                        {field.available ? '● Còn sân' : '● Hết sân'}
                    </Text>
                </View>
            </View>

            <View style={styles.fieldBody}>
                <View style={styles.fieldTopRow}>
                    <Text style={styles.fieldName} numberOfLines={1}>{field.name}</Text>
                    <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>⭐ {field.rating}</Text>
                    </View>
                </View>
                <Text style={styles.fieldLocation}>📍 {field.location}</Text>
                <View style={styles.fieldBottomRow}>
                    <View>
                        <Text style={styles.fieldPriceLabel}>Giá từ</Text>
                        <Text style={styles.fieldPrice}>
                            {field.price.toLocaleString('vi-VN')}đ
                            <Text style={styles.fieldPriceUnit}>/giờ</Text>
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.bookBtn, !field.available && styles.bookBtnDisabled]}
                        onPress={onPress}
                        disabled={!field.available}
                    >
                        <Text style={styles.bookBtnText}>
                            {field.available ? '📅 Đặt ngay' : 'Hết sân'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
        elevation: 2,
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', letterSpacing: 0.3 },
    headerIcons: { flexDirection: 'row', gap: 8 },
    iconBtn: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: '#f4f6f8', justifyContent: 'center', alignItems: 'center',
    },
    iconText: { fontSize: 18 },

    banner: {
        margin: 16, borderRadius: 20,
        backgroundColor: COLORS.primaryDark,
        flexDirection: 'row', alignItems: 'center',
        paddingLeft: 20, paddingVertical: 24,
        overflow: 'hidden',
        elevation: 4,
    },
    bannerLeft: { flex: 1 },
    bannerBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 20, marginBottom: 10,
    },
    bannerBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    bannerTitle: {
        color: '#fff', fontSize: 24, fontWeight: '900',
        lineHeight: 30, marginBottom: 8,
    },
    bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 18, marginBottom: 16 },
    bannerBtn: {
        backgroundColor: '#fff', alignSelf: 'flex-start',
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25,
    },
    bannerBtnText: { color: COLORS.primaryDark, fontWeight: '800', fontSize: 13 },
    bannerRight: { width: 110, alignItems: 'center', justifyContent: 'center' },

    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 16,
        marginTop: 8, marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
    seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
    sportCount: { fontSize: 13, color: '#aaa', fontWeight: '500' },

    fieldCard: {
        backgroundColor: '#fff', marginHorizontal: 16,
        marginBottom: 14, borderRadius: 18, overflow: 'hidden',
        elevation: 3,
    },
    fieldImageBox: { position: 'relative' },
    fieldImage: { width: '100%', height: 160 },
    fieldImagePlaceholder: {
        height: 160, justifyContent: 'center', alignItems: 'center',
    },
    sportBadge: {
        position: 'absolute', top: 12, left: 12,
        paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    },
    sportBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    availBadge: {
        position: 'absolute', top: 12, right: 12,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    availBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    fieldBody: { padding: 14 },
    fieldTopRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    fieldName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', flex: 1, marginRight: 8 },
    ratingBox: {
        backgroundColor: '#fff8e1', paddingHorizontal: 8,
        paddingVertical: 3, borderRadius: 10,
    },
    ratingText: { fontSize: 12, fontWeight: '700', color: '#f39c12' },
    fieldLocation: { fontSize: 12, color: '#888', marginBottom: 12 },
    fieldBottomRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    },
    fieldPriceLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
    fieldPrice: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
    fieldPriceUnit: { fontSize: 12, fontWeight: '500', color: '#aaa' },
    bookBtn: {
        backgroundColor: COLORS.primary, paddingHorizontal: 16,
        paddingVertical: 10, borderRadius: 12,
    },
    bookBtnDisabled: { backgroundColor: '#ccc' },
    bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

    productGrid: {
        flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 8,
    },
    productCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 16,
        padding: 14, elevation: 2,
    },
    productImageBox: {
        height: 100, backgroundColor: '#f4f6f8',
        borderRadius: 12, justifyContent: 'center',
        alignItems: 'center', marginBottom: 10,
    },
    productName: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
    productPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary },

    bottomBanner: {
        margin: 16, borderRadius: 20,
        backgroundColor: COLORS.primary,
        padding: 24, alignItems: 'center',
    },
    bottomBannerTitle: {
        color: '#fff', fontSize: 24, fontWeight: '900',
        textAlign: 'center', lineHeight: 30, marginBottom: 8,
    },
    bottomBannerSub: {
        color: 'rgba(255,255,255,0.8)', fontSize: 13,
        textAlign: 'center', lineHeight: 20, marginBottom: 16,
    },
    bottomBannerBtn: {
        backgroundColor: '#fff', paddingHorizontal: 24,
        paddingVertical: 12, borderRadius: 25,
    },
    bottomBannerBtnText: { color: COLORS.primaryDark, fontWeight: '800', fontSize: 14 },
}); 