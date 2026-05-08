// screens/ShopScreen.js
import React, { useState, useRef, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, TextInput, StatusBar, Dimensions
} from 'react-native';
import { CartContext } from '../screens/CartContext';
import { PRODUCTS, PRODUCT_IMAGES } from '../services/productsData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const PRIMARY = '#2E7D32';
const PRIMARY_LIGHT = '#4CAF50';
const ACCENT = '#FF6F00';

const CATEGORIES = [
    { id: 'all', label: 'Tất cả', icon: '🏪' },
    { id: 'ao', label: 'Áo', icon: '👕' },
    { id: 'bong', label: 'Bóng', icon: '⚽' },
    { id: 'vot', label: 'Vợt', icon: '🏸' },
];

const BANNERS = [
    { id: '1', bg: '#1B5E20', title: 'SALE 30%', sub: 'Vợt cầu lông cao cấp', emoji: '🏸' },
    { id: '2', bg: '#0D47A1', title: 'MỚI VỀ', sub: 'Bộ sưu tập áo thể thao', emoji: '👕' },
    { id: '3', bg: '#BF360C', title: 'HOT', sub: 'Bóng đá chính hãng', emoji: '⚽' },
];

const formatPrice = (p) => p?.toLocaleString('vi-VN') + '₫';

// ── Banner ────────────────────────────────────────────────────────
function BannerCarousel() {
    const [active, setActive] = useState(0);
    return (
        <View style={styles.bannerContainer}>
            <ScrollView
                horizontal pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                    setActive(idx);
                }}
            >
                {BANNERS.map((b) => (
                    <TouchableOpacity
                        key={b.id} activeOpacity={0.92}
                        style={[styles.banner, { backgroundColor: b.bg, width: width - 32 }]}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerEmoji}>{b.emoji}</Text>
                            <View>
                                <Text style={styles.bannerTitle}>{b.title}</Text>
                                <Text style={styles.bannerSub}>{b.sub}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.dotsRow}>
                {BANNERS.map((_, i) => (
                    <View key={i} style={[styles.dot, active === i && styles.dotActive]} />
                ))}
            </View>
        </View>
    );
}

// ── Product Card ──────────────────────────────────────────────────
function ProductCard({ product, onPress, onAdd }) {
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;
    const imgSrc = PRODUCT_IMAGES[product.image];

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(product)} activeOpacity={0.88}>
            {product.badge && (
                <View style={[
                    styles.badge,
                    product.badge === 'NEW' && { backgroundColor: '#1565C0' },
                    product.badge === 'SALE' && { backgroundColor: ACCENT },
                    product.badge === 'HOT' && { backgroundColor: '#C62828' },
                ]}>
                    <Text style={styles.badgeText}>{product.badge}</Text>
                </View>
            )}

            {/* Ảnh thật */}
            <View style={styles.cardImageBox}>
                {imgSrc ? (
                    <Image source={imgSrc} style={styles.cardImage} resizeMode="cover" />
                ) : (
                    <Text style={styles.cardEmoji}>🛍️</Text>
                )}
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.reviewText}> ({product.reviews})</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
                    {discount && (
                        <View style={styles.discountTag}>
                            <Text style={styles.discountText}>-{discount}%</Text>
                        </View>
                    )}
                </View>
                {product.originalPrice && (
                    <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
                )}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(product)}>
                <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

// ── Main ──────────────────────────────────────────────────────────
export default function ShopScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('all');
    const { cartItems, addToCart } = useContext(CartContext);

    const filtered = PRODUCTS.filter(p => {
        const matchCat = selectedCat === 'all' || p.category === selectedCat;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>Chào mừng đến với</Text>
                    <Text style={styles.headerTitle}>🏪 Cửa Hàng</Text>
                </View>
                <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => navigation.navigate('Cart', { screen: 'CartScreen' })}
                >
                    <Text style={styles.cartIcon}>🛒</Text>
                    {cartItems.length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
                {/* Search */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm sản phẩm..."
                            placeholderTextColor="#aaa"
                            value={search}
                            onChangeText={setSearch}
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Text style={{ color: '#999', fontSize: 16 }}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Categories sticky */}
                <View style={styles.catWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                        {CATEGORIES.map(c => (
                            <TouchableOpacity
                                key={c.id}
                                style={[styles.catChip, selectedCat === c.id && styles.catChipActive]}
                                onPress={() => setSelectedCat(c.id)}
                            >
                                <Text style={styles.catIcon}>{c.icon}</Text>
                                <Text style={[styles.catLabel, selectedCat === c.id && styles.catLabelActive]}>
                                    {c.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Banner */}
                {selectedCat === 'all' && search === '' && (
                    <View style={styles.section}>
                        <BannerCarousel />
                    </View>
                )}

                {/* Section header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {selectedCat === 'all'
                            ? '🔥 Sản phẩm nổi bật'
                            : `${CATEGORIES.find(c => c.id === selectedCat)?.icon} ${CATEGORIES.find(c => c.id === selectedCat)?.label}`}
                    </Text>
                    <Text style={styles.sectionCount}>{filtered.length} sản phẩm</Text>
                </View>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {filtered.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onPress={(product) => navigation.navigate('ProductDetail', { product })}
                                onAdd={(product) => addToCart(product)}
                            />
                        ))}
                    </View>
                )}

                <View style={{ height: 24 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        backgroundColor: PRIMARY, paddingTop: 48, paddingBottom: 16,
        paddingHorizontal: 20, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
    },
    headerSub: { color: '#A5D6A7', fontSize: 12 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
    cartBtn: { position: 'relative', padding: 4 },
    cartIcon: { fontSize: 26 },
    cartBadge: {
        position: 'absolute', top: 0, right: 0,
        backgroundColor: ACCENT, borderRadius: 8,
        width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    },
    cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
    searchWrapper: { backgroundColor: PRIMARY, paddingBottom: 12, paddingHorizontal: 16 },
    searchBox: {
        backgroundColor: '#fff', borderRadius: 12,
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 12, height: 44, elevation: 2,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#222' },
    catWrapper: { backgroundColor: '#fff', elevation: 2 },
    catScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
    catChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        backgroundColor: '#f0f0f0', borderWidth: 1.5, borderColor: 'transparent',
    },
    catChipActive: { backgroundColor: '#E8F5E9', borderColor: PRIMARY_LIGHT },
    catIcon: { fontSize: 15 },
    catLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
    catLabelActive: { color: PRIMARY, fontWeight: '700' },
    section: { paddingHorizontal: 16, marginTop: 16 },
    bannerContainer: { marginBottom: 4 },
    banner: { height: 110, borderRadius: 16, overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 20 },
    bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    bannerEmoji: { fontSize: 44 },
    bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
    dotActive: { backgroundColor: PRIMARY, width: 18 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
    sectionCount: { fontSize: 12, color: '#888' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
    card: {
        width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
    },
    badge: {
        position: 'absolute', top: 8, left: 8, zIndex: 10,
        backgroundColor: PRIMARY, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    cardImageBox: { height: 140, backgroundColor: '#f0f7f0', alignItems: 'center', justifyContent: 'center' },
    cardImage: { width: '100%', height: '100%' },
    cardEmoji: { fontSize: 56 },
    cardInfo: { padding: 10, paddingBottom: 6 },
    cardName: { fontSize: 12, fontWeight: '600', color: '#222', lineHeight: 17, marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    star: { fontSize: 10 },
    ratingText: { fontSize: 11, fontWeight: '700', color: '#333', marginLeft: 2 },
    reviewText: { fontSize: 10, color: '#999' },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    price: { fontSize: 14, fontWeight: '800', color: PRIMARY },
    discountTag: { backgroundColor: '#FFF3E0', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
    discountText: { fontSize: 9, fontWeight: '700', color: ACCENT },
    originalPrice: { fontSize: 10, color: '#bbb', textDecorationLine: 'line-through', marginTop: 1 },
    addBtn: {
        position: 'absolute', bottom: 10, right: 10,
        backgroundColor: PRIMARY, width: 28, height: 28,
        borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 2,
    },
    addBtnText: { color: '#fff', fontSize: 18, fontWeight: '300', marginTop: -1 },
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, color: '#aaa' },
});