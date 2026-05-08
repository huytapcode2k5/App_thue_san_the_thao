// screens/ProductDetailScreen.js
import React, { useState, useRef, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, StatusBar, Animated, Dimensions, Alert
} from 'react-native';
import { CartContext } from '../screens/CartContext';
import { PRODUCT_IMAGES } from '../services/productsData';

const { width } = Dimensions.get('window');
const PRIMARY = '#2E7D32';
const PRIMARY_LIGHT = '#4CAF50';
const ACCENT = '#FF6F00';

const formatPrice = (p) => p?.toLocaleString('vi-VN') + '₫';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#222222', '#1565C0', '#2E7D32', '#C62828', '#F9A825'];

const REVIEWS = [
    { id: '1', name: 'Nguyễn Văn A', rating: 5, text: 'Sản phẩm rất tốt, đúng như mô tả. Chất lượng cao!', date: '12/04/2025' },
    { id: '2', name: 'Trần Thị B', rating: 4, text: 'Chất lượng ổn, giao hàng nhanh. Rất hài lòng.', date: '08/04/2025' },
    { id: '3', name: 'Lê Văn C', rating: 5, text: 'Mua lần 2 rồi, vẫn giữ nguyên chất lượng. Đáng tiền!', date: '01/04/2025' },
];

function StarRow({ rating, size = 14 }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Text key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#F9A825' : '#ddd' }}>★</Text>
            ))}
        </View>
    );
}

function ReviewCard({ review }) {
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                    <Text style={{ fontSize: 18 }}>👤</Text>
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

export default function ProductDetailScreen({ route, navigation }) {
    const { addToCart } = useContext(CartContext);
    const product = route?.params?.product;

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [qty, setQty] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    if (!product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    const imgSrc = PRODUCT_IMAGES[product.image];
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
        addToCart({
            id: product.id + '-' + selectedSize,
            name: product.name,
            price: product.price,
            quantity: qty,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
        });
        Alert.alert('✅ Thành công', 'Sản phẩm đã được thêm vào giỏ hàng!');
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            Alert.alert('Chọn size', 'Vui lòng chọn size trước khi mua.');
            return;
        }
        navigation.navigate('Cart', {
            screen: 'Payment',
            params: {
                items: [{ id: product.id, name: product.name, price: product.price, quantity: qty, image: product.image, size: selectedSize }],
            },
        });
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
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Image */}
                <View style={styles.hero}>
                    <View style={styles.heroImageBox}>
                        {imgSrc ? (
                            <Image source={imgSrc} style={styles.heroImage} resizeMode="contain" />
                        ) : (
                            <Text style={styles.heroEmoji}>🛍️</Text>
                        )}
                        {discount && (
                            <View style={styles.heroBadge}>
                                <Text style={styles.heroBadgeText}>-{discount}%</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Tên sản phẩm */}
                    <Text style={styles.productName}>{product.name}</Text>

                    {/* Rating */}
                    <View style={styles.metaRow}>
                        <StarRow rating={product.rating} />
                        <Text style={styles.metaRating}>{product.rating}</Text>
                        <Text style={styles.metaReviews}>({product.reviews} đánh giá)</Text>
                        <Text style={styles.metaSold}>🔥 Đã bán 1.2k</Text>
                    </View>

                    {/* Giá */}
                    <View style={styles.priceSection}>
                        <Text style={styles.mainPrice}>{formatPrice(product.price)}</Text>
                        {product.originalPrice && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <Text style={styles.oldPrice}>{formatPrice(product.originalPrice)}</Text>
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>
                                        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Màu sắc */}
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
                    <Text style={styles.sectionLabel}>Size</Text>
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

                    {/* Số lượng */}
                    <View style={styles.qtySection}>
                        <Text style={styles.sectionLabel}>Số lượng</Text>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                                <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyNum}>{qty}</Text>
                            <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnPlus]} onPress={() => setQty(q => q + 1)}>
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

                    {/* Mô tả */}
                    <Text style={styles.sectionLabel}>Mô tả sản phẩm</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.divider} />

                    {/* Đánh giá */}
                    <Text style={styles.sectionLabel}>Đánh giá từ khách hàng</Text>
                    <View style={styles.overallRating}>
                        <Text style={styles.bigRating}>{product.rating}</Text>
                        <View>
                            <StarRow rating={product.rating} size={13} />
                            <Text style={styles.totalReviews}>{product.reviews} đánh giá</Text>
                        </View>
                    </View>
                    {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}

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
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        flexDirection: 'row', justifyContent: 'space-between',
        paddingTop: 44, paddingHorizontal: 16, paddingBottom: 10,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
        elevation: 3,
    },
    backIcon: { fontSize: 24, color: '#222', fontWeight: '600' },
    hero: { backgroundColor: '#f0f7f0' },
    heroImageBox: { height: 300, alignItems: 'center', justifyContent: 'center' },
    heroImage: { width: '100%', height: '100%' },
    heroEmoji: { fontSize: 100 },
    heroBadge: {
        position: 'absolute', top: 70, right: 20,
        backgroundColor: ACCENT, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    },
    heroBadgeText: { color: '#fff', fontWeight: '900', fontSize: 13 },
    content: { paddingHorizontal: 16, paddingTop: 20 },
    productName: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', lineHeight: 28, marginBottom: 10 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
    metaRating: { fontSize: 13, fontWeight: '700', color: '#333' },
    metaReviews: { fontSize: 12, color: '#888' },
    metaSold: { fontSize: 12, color: '#888' },
    priceSection: { marginBottom: 16 },
    mainPrice: { fontSize: 28, fontWeight: '900', color: PRIMARY },
    oldPrice: { fontSize: 14, color: '#bbb', textDecorationLine: 'line-through' },
    saveBadge: { backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    saveText: { fontSize: 11, color: PRIMARY, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 16 },
    sectionLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
    colorRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    colorDot: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'transparent',
    },
    colorDotActive: { borderColor: PRIMARY, transform: [{ scale: 1.15 }] },
    sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    sizeBtn: {
        paddingHorizontal: 20, height: 40, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#e0e0e0', backgroundColor: '#fafafa',
    },
    sizeBtnActive: { borderColor: PRIMARY, backgroundColor: '#E8F5E9' },
    sizeBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
    sizeBtnTextActive: { color: PRIMARY, fontWeight: '800' },
    qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    qtyControl: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: {
        width: 36, height: 36, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e0e0e0',
    },
    qtyBtnPlus: { backgroundColor: PRIMARY, borderColor: PRIMARY },
    qtyBtnText: { fontSize: 20, color: '#333', fontWeight: '400' },
    qtyNum: { width: 44, textAlign: 'center', fontSize: 17, fontWeight: '800', color: '#1a1a1a' },
    perksRow: { flexDirection: 'row', justifyContent: 'space-around' },
    perkItem: { alignItems: 'center', gap: 4 },
    perkIcon: { fontSize: 22 },
    perkLabel: { fontSize: 11, color: '#555', fontWeight: '500', textAlign: 'center' },
    description: { fontSize: 14, color: '#555', lineHeight: 22 },
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
    reviewDate: { fontSize: 10, color: '#bbb' },
    reviewText: { fontSize: 13, color: '#555', lineHeight: 19 },
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', gap: 10,
        backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 28,
        borderTopWidth: 1, borderTopColor: '#f0f0f0', elevation: 15,
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
        elevation: 4,
    },
    buyNowText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});