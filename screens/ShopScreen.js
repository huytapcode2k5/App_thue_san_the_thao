import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, FlatList, TextInput, StatusBar, Animated, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const PRIMARY = '#2E7D32';
const PRIMARY_LIGHT = '#4CAF50';
const ACCENT = '#FF6F00';

// ── Mock data ────────────────────────────────────────────────────
const CATEGORIES = [
    { id: '0', label: 'Tất cả', icon: '🏪' },
    { id: '1', label: 'Giày', icon: '👟' },
    { id: '2', label: 'Áo', icon: '👕' },
    { id: '3', label: 'Quần', icon: '🩳' },
    { id: '4', label: 'Phụ kiện', icon: '🧢' },
    { id: '5', label: 'Tất', icon: '🧦' },
];

const BANNERS = [
    { id: '1', bg: '#1B5E20', title: 'SALE 50%', sub: 'Giày thể thao mùa hè', emoji: '👟' },
    { id: '2', bg: '#0D47A1', title: 'MỚI VỀ', sub: 'Bộ sưu tập mùa thu 2025', emoji: '🏃' },
    { id: '3', bg: '#4A148C', title: 'COMBO', sub: 'Mua 2 giảm thêm 20%', emoji: '🎽' },
];

const PRODUCTS = [
    { id: '1', name: 'Giày Chạy Bộ Performance Pulse 2i', price: 2450000, originalPrice: 3200000, rating: 4.8, reviews: 128, tag: 'Bán chạy', image: '👟', category: '1', badge: 'HOT' },
    { id: '2', name: 'Áo Thể Thao Dry-Fit Pro', price: 350000, originalPrice: 450000, rating: 4.6, reviews: 89, tag: 'Mới', image: '👕', category: '2', badge: 'NEW' },
    { id: '3', name: 'Quần Short Running Flex', price: 280000, originalPrice: null, rating: 4.5, reviews: 54, tag: null, image: '🩳', category: '3', badge: null },
    { id: '4', name: 'Mũ Thể Thao UV Pro', price: 195000, originalPrice: 250000, rating: 4.7, reviews: 201, tag: 'Sale', image: '🧢', category: '4', badge: 'SALE' },
    { id: '5', name: 'Tất Chống Trượt Sports', price: 85000, originalPrice: null, rating: 4.4, reviews: 315, tag: null, image: '🧦', category: '5', badge: null },
    { id: '6', name: 'Áo Hoodie Training Elite', price: 650000, originalPrice: 850000, rating: 4.9, reviews: 67, tag: 'Cao cấp', image: '🥋', category: '2', badge: 'HOT' },
    { id: '7', name: 'Giày Bóng Đá Turbo Strike', price: 1850000, originalPrice: 2200000, rating: 4.7, reviews: 93, tag: null, image: '⚽', category: '1', badge: 'SALE' },
    { id: '8', name: 'Bình Nước Thể Thao 750ml', price: 120000, originalPrice: null, rating: 4.3, reviews: 442, tag: null, image: '🍶', category: '4', badge: null },
];

const formatPrice = (p) => p.toLocaleString('vi-VN') + '₫';

// ── Sub-components ───────────────────────────────────────────────
function BannerCarousel() {
    const [active, setActive] = useState(0);
    const scrollRef = useRef(null);

    return (
        <View style={styles.bannerContainer}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                    setActive(idx);
                }}
            >
                {BANNERS.map((b) => (
                    <TouchableOpacity
                        key={b.id}
                        activeOpacity={0.92}
                        style={[styles.banner, { backgroundColor: b.bg, width: width - 32 }]}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerEmoji}>{b.emoji}</Text>
                            <View>
                                <Text style={styles.bannerTitle}>{b.title}</Text>
                                <Text style={styles.bannerSub}>{b.sub}</Text>
                            </View>
                        </View>
                        <View style={styles.bannerDecor} />
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

function ProductCard({ product, onPress, onAdd }) {
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(product)} activeOpacity={0.88}>
            {/* Badge */}
            {product.badge && (
                <View style={[styles.badge, product.badge === 'NEW' && { backgroundColor: '#1565C0' },
                product.badge === 'SALE' && { backgroundColor: ACCENT },
                product.badge === 'HOT' && { backgroundColor: '#C62828' }]}>
                    <Text style={styles.badgeText}>{product.badge}</Text>
                </View>
            )}

            {/* Image */}
            <View style={styles.cardImageBox}>
                <Text style={styles.cardEmoji}>{product.image}</Text>
            </View>

            {/* Info */}
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

            {/* Add button */}
            <TouchableOpacity
  style={styles.addBtn}
  onPress={() => onAdd(product)}
>
  <Text style={styles.addBtnText}>+</Text>
</TouchableOpacity>
        </TouchableOpacity>
    );
}

// ── Main Screen ──────────────────────────────────────────────────
export default function ShopScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('0');

    const filtered = PRODUCTS.filter(p => {
        const matchCat = selectedCat === '0' || p.category === selectedCat;
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
                <TouchableOpacity style={styles.cartBtn}>
                    <Text style={styles.cartIcon}>🛒</Text>
                    <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>3</Text></View>
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

                {/* Sticky Categories */}
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
                {selectedCat === '0' && search === '' && (
                    <View style={styles.section}>
                        <BannerCarousel />
                    </View>
                )}

                {/* Section header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {selectedCat === '0' ? '🔥 Sản phẩm nổi bật' : `${CATEGORIES.find(c => c.id === selectedCat)?.icon} ${CATEGORIES.find(c => c.id === selectedCat)?.label}`}
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
  onAdd={(product) =>
    navigation.navigate("Cart", {
      screen: "CartScreen",
  params: {
    newItem: product
  }
    })
  }
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

    // Header
    header: {
        backgroundColor: PRIMARY,
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    // Search
    searchWrapper: { backgroundColor: PRIMARY, paddingBottom: 12, paddingHorizontal: 16 },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        elevation: 2,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#222' },

    // Categories
    catWrapper: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
    catScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row' },
    catChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20, backgroundColor: '#f0f0f0',
        borderWidth: 1.5, borderColor: 'transparent',
    },
    catChipActive: { backgroundColor: '#E8F5E9', borderColor: PRIMARY_LIGHT },
    catIcon: { fontSize: 15 },
    catLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
    catLabelActive: { color: PRIMARY, fontWeight: '700' },

    // Banner
    section: { paddingHorizontal: 16, marginTop: 16 },
    bannerContainer: { marginBottom: 4 },
    banner: {
        height: 110, borderRadius: 16, overflow: 'hidden',
        justifyContent: 'center', paddingHorizontal: 20, marginRight: 0,
    },
    bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 16, zIndex: 2 },
    bannerEmoji: { fontSize: 44 },
    bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
    bannerDecor: {
        position: 'absolute', right: -20, top: -20,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
    dotActive: { backgroundColor: PRIMARY, width: 18 },

    // Section header
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
    sectionCount: { fontSize: 12, color: '#888' },

    // Grid
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
    card: {
        width: CARD_WIDTH, backgroundColor: '#fff',
        borderRadius: 16, overflow: 'hidden',
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
    },
    badge: {
        position: 'absolute', top: 8, left: 8, zIndex: 10,
        backgroundColor: PRIMARY, borderRadius: 6,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    cardImageBox: {
        height: 120, backgroundColor: '#f0f7f0',
        alignItems: 'center', justifyContent: 'center',
    },
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
        borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        elevation: 2,
    },
    addBtnText: { color: '#fff', fontSize: 18, fontWeight: '300', marginTop: -1 },

    // Empty
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, color: '#aaa' },
});