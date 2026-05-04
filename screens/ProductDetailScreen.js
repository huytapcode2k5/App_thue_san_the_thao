import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Animated, Dimensions, Alert
} from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY = '#2E7D32';
const PRIMARY_LIGHT = '#4CAF50';
const ACCENT = '#FF6F00';

const formatPrice = (p) => p.toLocaleString('vi-VN') + '₫';

// ── Mock related products ───────────────────────────────────────
const RELATED = [
    { id: 'r1', name: 'Giày Bóng Rổ Air Jump', price: 1950000, rating: 4.6, image: '🏀', badge: 'NEW' },
    { id: 'r2', name: 'Vớ Thể Thao Premium', price: 95000, rating: 4.5, image: '🧦', badge: null },
    { id: 'r3', name: 'Túi Gym Sport Pro', price: 450000, rating: 4.8, image: '👜', badge: 'HOT' },
    { id: 'r4', name: 'Áo Chạy Bộ Breathe', price: 320000, rating: 4.4, image: '🎽', badge: null },
];

const SIZES = ['38', '39', '40', '41', '42', '43', '44'];
const COLORS = ['#222222', '#1565C0', '#2E7D32', '#C62828', '#F9A825'];

const REVIEWS = [
    { id: '1', name: 'Nguyễn Văn A', avatar: '👤', rating: 5, text: 'Sản phẩm rất tốt, đúng như mô tả. Đế giày êm, chạy bộ rất thoải mái!', date: '12/04/2025' },
    { id: '2', name: 'Trần Thị B', avatar: '👤', rating: 4, text: 'Chất lượng ổn, giao hàng nhanh. Tuy nhiên size hơi to hơn so với thường.', date: '08/04/2025' },
    { id: '3', name: 'Lê Văn C', avatar: '👤', rating: 5, text: 'Mua lần 2 rồi, vẫn giữ nguyên chất lượng. Rất đáng tiền!', date: '01/04/2025' },
];

function StarRow({ rating, size = 14, color = '#F9A825' }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Text key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? color : '#ddd' }}>★</Text>
            ))}
        </View>
    );
}

function ReviewCard({ review }) {
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                    <Text style={{ fontSize: 20 }}>{review.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <StarRow rating={review.rating} size={11} />
                        <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
        </View>
    );
}

function RelatedCard({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.relCard} onPress={() => onPress(item)} activeOpacity={0.85}>
            {item.badge && (
                <View style={[styles.relBadge, item.badge === 'HOT' && { backgroundColor: '#C62828' }]}>
                    <Text style={styles.relBadgeText}>{item.badge}</Text>
                </View>
            )}
            <View style={styles.relImageBox}>
                <Text style={styles.relEmoji}>{item.image}</Text>
            </View>
            <Text style={styles.relName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.relPrice}>{formatPrice(item.price)}</Text>
        </TouchableOpacity>
    );
}

// ── Main Screen ─────────────────────────────────────────────────
export default function ProductDetailScreen({ route, navigation }) {
    // Nhận product từ navigation hoặc dùng mock
    const product = route?.params?.product ?? {
        id: '1',
        name: 'Giày Chạy Bộ Performance Pulse 2i',
        price: 2450000,
        originalPrice: 3200000,
        rating: 4.8,
        reviews: 128,
        image: '👟',
        badge: 'HOT',
        description: 'Giày chạy bộ Performance Pulse 2i được thiết kế dành riêng cho các vận động viên chuyên nghiệp. Với công nghệ đế Pulse Foam tiên tiến, đôi giày mang lại cảm giác êm ái tuyệt vời trong mỗi bước chạy.\n\n✅ Chất liệu upper thoáng khí Mesh 3D\n✅ Đế ngoài cao su Rubber Grip chống trơn trượt\n✅ Lót trong có thể tháo rời, kháng khuẩn\n✅ Phù hợp chạy đường dài và tập gym',
    };

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [qty, setQty] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

    const headerBg = scrollY.interpolate({
        inputRange: [200, 280],
        outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
        extrapolate: 'clamp',
    });

    const handleAddToCart = () => {
        if (!selectedSize) {
            Alert.alert('Chọn size', 'Vui lòng chọn size trước khi thêm vào giỏ hàng.');
            return;
        }
        Alert.alert('✅ Thành công', `Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            Alert.alert('Chọn size', 'Vui lòng chọn size trước khi mua.');
            return;
        }
        navigation?.navigate('Cart');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Floating Header */}
            <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backBtn} onPress={() => setIsFav(!isFav)}>
                    <Text style={styles.backIcon}>{isFav ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
            >
                {/* Hero Image */}
                <View style={styles.hero}>
                    <View style={styles.heroImageBox}>
                        <Text style={styles.heroEmoji}>{product.image}</Text>
                        {discount && (
                            <View style={styles.heroBadge}>
                                <Text style={styles.heroBadgeText}>-{discount}%</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* Title row */}
                    <View style={styles.titleRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                    </View>

                    {/* Rating + sold */}
                    <View style={styles.metaRow}>
                        <StarRow rating={product.rating} />
                        <Text style={styles.metaRating}>{product.rating}</Text>
                        <Text style={styles.metaReviews}>({product.reviews} đánh giá)</Text>
                        <View style={styles.metaDivider} />
                        <Text style={styles.metaSold}>🔥 Đã bán 1.2k</Text>
                    </View>

                    {/* Price */}
                    <View style={styles.priceSection}>
                        <Text style={styles.mainPrice}>{formatPrice(product.price)}</Text>
                        {product.originalPrice && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                <Text style={styles.oldPrice}>{formatPrice(product.originalPrice)}</Text>
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>Tiết kiệm {formatPrice(product.originalPrice - product.price)}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Colors */}
                    <Text style={styles.sectionLabel}>Màu sắc</Text>
                    <View style={styles.colorRow}>
                        {COLORS.map(c => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotActive]}
                                onPress={() => setSelectedColor(c)}
                            >
                                {selectedColor === c && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Size */}
                    <View style={styles.sizeHeader}>
                        <Text style={styles.sectionLabel}>Size</Text>
                        <TouchableOpacity>
                            <Text style={styles.sizeGuide}>📏 Hướng dẫn chọn size</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sizeRow}>
                        {SIZES.map(s => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                                onPress={() => setSelectedSize(s)}
                            >
                                <Text style={[styles.sizeBtnText, selectedSize === s && styles.sizeBtnTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Quantity */}
                    <View style={styles.qtySection}>
                        <Text style={styles.sectionLabel}>Số lượng</Text>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => setQty(q => Math.max(1, q - 1))}
                            >
                                <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyNum}>{qty}</Text>
                            <TouchableOpacity
                                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                                onPress={() => setQty(q => q + 1)}
                            >
                                <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Perks */}
                    <View style={styles.perksRow}>
                        {[['🚚', 'Giao nhanh 2h'], ['↩️', 'Đổi trả 30 ngày'], ['🛡️', 'Bảo hành 12 tháng']].map(([icon, label]) => (
                            <View key={label} style={styles.perkItem}>
                                <Text style={styles.perkIcon}>{icon}</Text>
                                <Text style={styles.perkLabel}>{label}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.sectionLabel}>Mô tả sản phẩm</Text>
                    <Text style={styles.description}>{product.description ?? 'Sản phẩm chất lượng cao, phù hợp cho mọi hoạt động thể thao.'}</Text>

                    <View style={styles.divider} />

                    {/* Reviews */}
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionLabel}>Đánh giá từ khách hàng</Text>
                        <View style={styles.overallRating}>
                            <Text style={styles.bigRating}>{product.rating}</Text>
                            <View>
                                <StarRow rating={product.rating} size={13} />
                                <Text style={styles.totalReviews}>{product.reviews} đánh giá</Text>
                            </View>
                        </View>
                    </View>
                    {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
                    <TouchableOpacity style={styles.moreReviews}>
                        <Text style={styles.moreReviewsText}>Xem tất cả đánh giá →</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Related */}
                    <Text style={styles.sectionLabel}>Có thể bạn thích</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16, paddingBottom: 4 }}>
                        {RELATED.map(item => (
                            <RelatedCard key={item.id} item={item} onPress={() => { }} />
                        ))}
                    </ScrollView>

                    <View style={{ height: 120 }} />
                </View>
            </Animated.ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cartOutlineBtn} onPress={handleAddToCart}>
                    <Text style={styles.cartOutlineIcon}>🛒</Text>
                    <Text style={styles.cartOutlineText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
                    <Text style={styles.buyNowText}>Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Floating header
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 100, flexDirection: 'row', justifyContent: 'space-between',
        paddingTop: 44, paddingHorizontal: 16, paddingBottom: 10,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    },
    backIcon: { fontSize: 24, color: '#222', fontWeight: '600' },

    // Hero
    hero: { backgroundColor: '#f0f7f0' },
    heroImageBox: {
        height: 280, alignItems: 'center', justifyContent: 'center',
    },
    heroEmoji: { fontSize: 120 },
    heroBadge: {
        position: 'absolute', top: 70, right: 20,
        backgroundColor: ACCENT, borderRadius: 12,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    heroBadgeText: { color: '#fff', fontWeight: '900', fontSize: 13 },

    // Content
    content: { paddingHorizontal: 16, paddingTop: 20 },
    titleRow: { marginBottom: 10 },
    productName: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', lineHeight: 28 },

    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
    metaRating: { fontSize: 13, fontWeight: '700', color: '#333' },
    metaReviews: { fontSize: 12, color: '#888' },
    metaDivider: { width: 1, height: 14, backgroundColor: '#ddd' },
    metaSold: { fontSize: 12, color: '#888' },

    priceSection: { marginBottom: 16 },
    mainPrice: { fontSize: 28, fontWeight: '900', color: PRIMARY },
    oldPrice: { fontSize: 14, color: '#bbb', textDecorationLine: 'line-through' },
    saveBadge: { backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    saveText: { fontSize: 11, color: PRIMARY, fontWeight: '700' },

    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 16 },

    sectionLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },

    // Colors
    colorRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    colorDot: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'transparent',
    },
    colorDotActive: { borderColor: PRIMARY, transform: [{ scale: 1.15 }] },

    // Sizes
    sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    sizeGuide: { fontSize: 12, color: PRIMARY, fontWeight: '600' },
    sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    sizeBtn: {
        width: 48, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#e0e0e0', backgroundColor: '#fafafa',
    },
    sizeBtnActive: { borderColor: PRIMARY, backgroundColor: '#E8F5E9' },
    sizeBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
    sizeBtnTextActive: { color: PRIMARY, fontWeight: '800' },

    // Qty
    qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 0 },
    qtyBtn: {
        width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e0e0e0',
    },
    qtyBtnPlus: { backgroundColor: PRIMARY, borderColor: PRIMARY },
    qtyBtnText: { fontSize: 20, color: '#333', lineHeight: 22, fontWeight: '400' },
    qtyNum: { width: 44, textAlign: 'center', fontSize: 17, fontWeight: '800', color: '#1a1a1a' },

    // Perks
    perksRow: { flexDirection: 'row', justifyContent: 'space-around' },
    perkItem: { alignItems: 'center', gap: 4 },
    perkIcon: { fontSize: 22 },
    perkLabel: { fontSize: 11, color: '#555', fontWeight: '500', textAlign: 'center' },

    // Description
    description: { fontSize: 14, color: '#555', lineHeight: 22 },

    // Reviews
    reviewsHeader: { marginBottom: 12 },
    overallRating: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    bigRating: { fontSize: 42, fontWeight: '900', color: '#1a1a1a' },
    totalReviews: { fontSize: 11, color: '#888', marginTop: 2 },
    reviewCard: {
        backgroundColor: '#fafafa', borderRadius: 12, padding: 12, marginBottom: 10,
        borderWidth: 1, borderColor: '#f0f0f0',
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    reviewAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
    },
    reviewName: { fontSize: 13, fontWeight: '700', color: '#222', marginBottom: 2 },
    reviewDate: { fontSize: 10, color: '#bbb', marginLeft: 4 },
    reviewText: { fontSize: 13, color: '#555', lineHeight: 19 },
    moreReviews: { alignItems: 'center', paddingVertical: 10 },
    moreReviewsText: { fontSize: 13, color: PRIMARY, fontWeight: '700' },

    // Related
    relCard: {
        width: 130, backgroundColor: '#fff',
        borderRadius: 14, overflow: 'hidden',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    },
    relBadge: {
        position: 'absolute', top: 6, left: 6, zIndex: 10,
        backgroundColor: PRIMARY_LIGHT, borderRadius: 5,
        paddingHorizontal: 5, paddingVertical: 1,
    },
    relBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
    relImageBox: { height: 90, backgroundColor: '#f0f7f0', alignItems: 'center', justifyContent: 'center' },
    relEmoji: { fontSize: 44 },
    relName: { fontSize: 11, fontWeight: '600', color: '#333', paddingHorizontal: 8, paddingTop: 8, lineHeight: 15 },
    relPrice: { fontSize: 12, fontWeight: '800', color: PRIMARY, paddingHorizontal: 8, paddingTop: 4, paddingBottom: 10 },

    // Bottom bar
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', gap: 10,
        backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
        paddingBottom: 28,
        borderTopWidth: 1, borderTopColor: '#f0f0f0',
        elevation: 15, shadowColor: '#000', shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 }, shadowRadius: 8,
    },
    cartOutlineBtn: {
        flex: 1, height: 50, borderRadius: 14,
        borderWidth: 2, borderColor: PRIMARY,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    },
    cartOutlineIcon: { fontSize: 18 },
    cartOutlineText: { fontSize: 14, fontWeight: '700', color: PRIMARY },
    buyNowBtn: {
        flex: 1.4, height: 50, borderRadius: 14,
        backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
        elevation: 4, shadowColor: PRIMARY, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    },
    buyNowText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
});