import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator,
    StatusBar, Image, TextInput,
    Animated, Dimensions, Modal, Alert,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { getFields } from '../services/jsonDataService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SPORT_ICONS = {
    'Bóng đá': '⚽',
    'Cầu lông': '🏸',
    'Bóng rổ': '🏀',
    'Tennis': '🎾',
};

const SPORT_COLORS = {
    'Bóng đá': '#16a34a',
    'Cầu lông': '#7c3aed',
    'Bóng rổ': '#ea580c',
    'Tennis': '#0284c7',
};

const FIELD_IMAGES = {
    'bernabeu': require('../assets/bernabeu.jpg'),
    'old': require('../assets/old.jpg'),
    'anfield': require('../assets/anfield.jpg'),
    'etihad': require('../assets/etihad.jpg'),
};

const SPORTS = ['Tất cả', 'Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ'];

const PRICE_RANGES = [
    { label: 'Tất cả', min: 0, max: Infinity },
    { label: '< 150k', min: 0, max: 150000 },
    { label: '150k - 300k', min: 150000, max: 300000 },
    { label: '300k - 450k', min: 300000, max: 450000 },
    { label: '> 450k', min: 450000, max: Infinity },
];

const TIME_FILTERS = [
    { label: 'Tất cả', value: null },
    { label: 'Sáng (6-12h)', start: 6, end: 12 },
    { label: 'Chiều (12-18h)', start: 12, end: 18 },
    { label: 'Tối (18-22h)', start: 18, end: 22 },
];

const FAKE_PRODUCTS = [
    { id: 'p1', name: 'Vợt Asrex 660 Pro', price: 4250000, icon: '🏸', tag: 'Hot' },
    { id: 'p2', name: 'Nike Mercurial', price: 3900000, icon: '👟', tag: 'Mới' },
];

export default function HomeScreen({ navigation }) {
    const [fields, setFields] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedSport, setSelectedSport] = useState('Tất cả');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedTime, setSelectedTime] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;
    const filterAnim = useRef(new Animated.Value(0)).current;
    const stackNav = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        loadData();
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        applyFilters(fields, searchText, selectedSport, selectedPrice, selectedTime);
    }, [searchText, selectedSport, selectedPrice, selectedTime, fields]);

    const loadData = async () => {
        try {
            const data = await getFields();
            setFields(data);
            setFiltered(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data, search, sport, priceIdx, timeIdx) => {
        let result = [...data];
        if (search.trim()) {
            result = result.filter(f =>
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.location.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (sport !== 'Tất cả') {
            result = result.filter(f => f.sport === sport);
        }
        const price = PRICE_RANGES[priceIdx];
        result = result.filter(f => f.price >= price.min && f.price < price.max);
        setFiltered(result);
    };

    const goToDetail = (field) => {
        navigation.getParent('HomeStack')?.navigate('FieldDetail', { field })
            ?? navigation.navigate('FieldDetail', { field });
    };

    const openFilter = () => {
        setShowFilter(true);
        Animated.spring(filterAnim, { toValue: 1, useNativeDriver: true, tension: 80 }).start();
    };

    const closeFilter = () => {
        Animated.timing(filterAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowFilter(false));
    };

    const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0.97], extrapolate: 'clamp' });
    const headerElevation = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 8], extrapolate: 'clamp' });

    const activeFilterCount = (selectedSport !== 'Tất cả' ? 1 : 0) + (selectedPrice !== 0 ? 1 : 0) + (selectedTime !== 0 ? 1 : 0);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    const featuredFields = fields.slice(0, 3);
    const availableCount = fields.filter(f => f.available).length;

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <Animated.View style={[styles.header, { opacity: headerOpacity, elevation: headerElevation }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerGreet}>Xin chào 👋</Text>
                        <Text style={styles.headerTitle}>Đặt Sân Thể Thao</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notifBtn}
                        onPress={() => Alert.alert('Thông báo', 'Chưa có thông báo mới!')}
                    >
                        <Text style={styles.notifIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>

                {/* SEARCH BAR */}
                <View style={styles.searchRow}>
                    <View style={[styles.searchBox, searchFocused && styles.searchBoxFocused]}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm tên sân, khu vực..."
                            placeholderTextColor="#aaa"
                            value={searchText}
                            onChangeText={setSearchText}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')}>
                                <Text style={styles.clearIcon}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.filterBtn} onPress={openFilter}>
                        <Text style={styles.filterBtnIcon}>⚙️</Text>
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* SPORT CHIPS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportChipScroll}>
                    {SPORTS.map(sport => (
                        <TouchableOpacity
                            key={sport}
                            style={[styles.sportChip, selectedSport === sport && styles.sportChipActive]}
                            onPress={() => setSelectedSport(sport)}
                        >
                            {sport !== 'Tất cả' && <Text style={styles.sportChipIcon}>{SPORT_ICONS[sport]}</Text>}
                            <Text style={[styles.sportChipText, selectedSport === sport && styles.sportChipTextActive]}>
                                {sport}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
            >
                {/* KẾT QUẢ TÌM KIẾM */}
                {searchText.trim() !== '' && (
                    <View style={styles.searchResultBanner}>
                        <Text style={styles.searchResultText}>
                            Tìm thấy <Text style={styles.searchResultCount}>{filtered.length}</Text> sân cho "{searchText}"
                        </Text>
                    </View>
                )}

                {/* STATS ROW */}
                {searchText === '' && selectedSport === 'Tất cả' && selectedPrice === 0 && (
                    <View style={styles.statsRow}>
                        <StatCard icon="🏟️" value={fields.length} label="Tổng sân" color="#2ede5a" />
                        <StatCard icon="✅" value={availableCount} label="Còn trống" color="#0284c7" />
                        <StatCard icon="🏅" value="4" label="Môn thể thao" color="#7c3aed" />
                    </View>
                )}

                {/* BANNER HERO */}
                {searchText === '' && (
                    <View style={styles.heroBanner}>
                        <View style={styles.heroBannerInner}>
                            <View style={styles.heroBadge}>
                                <Text style={styles.heroBadgeText}>⚡ Flash Sale 11:00–15:00</Text>
                            </View>
                            <Text style={styles.heroTitle}>Giảm 50%{'\n'}Sân Cầu Lông</Text>
                            <Text style={styles.heroSub}>Chỉ hôm nay · Số lượng có hạn</Text>
                            <TouchableOpacity
                                style={styles.heroBtn}
                                onPress={() => { setSelectedSport('Cầu lông'); setSearchText(''); }}
                            >
                                <Text style={styles.heroBtnText}>Khám phá ngay →</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.heroBannerDeco}>
                            <Text style={styles.heroBannerEmoji}>🏸</Text>
                            <View style={styles.heroBannerCircle1} />
                            <View style={styles.heroBannerCircle2} />
                        </View>
                    </View>
                )}

                {/* SÂN NỔI BẬT */}
                {searchText === '' && selectedSport === 'Tất cả' && selectedPrice === 0 && (
                    <>
                        <SectionHeader
                            title="⭐ Sân Nổi Bật"
                            sub={`${featuredFields.length} sân được đề xuất`}
                            onPress={() => navigation.navigate('FieldList')}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                            {featuredFields.map(field => (
                                <FeaturedCard
                                    key={field.id}
                                    field={field}
                                    onPress={() => goToDetail(field)}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* DANH SÁCH SÂN (kết quả filter hoặc theo môn) */}
                {searchText !== '' || selectedSport !== 'Tất cả' || selectedPrice !== 0 ? (
                    <>
                        <SectionHeader
                            title={searchText ? '🔍 Kết quả tìm kiếm' : `${SPORT_ICONS[selectedSport] || '🏟️'} Sân ${selectedSport}`}
                            sub={`${filtered.length} sân`}
                        />
                        {filtered.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyIcon}>🏟️</Text>
                                <Text style={styles.emptyTitle}>Không tìm thấy sân</Text>
                                <Text style={styles.emptySub}>Thử thay đổi bộ lọc hoặc tìm kiếm khác</Text>
                                <TouchableOpacity style={styles.resetBtn} onPress={() => {
                                    setSearchText('');
                                    setSelectedSport('Tất cả');
                                    setSelectedPrice(0);
                                    setSelectedTime(0);
                                }}>
                                    <Text style={styles.resetBtnText}>Xóa bộ lọc</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            filtered.map(field => (
                                <FieldListCard
                                    key={field.id}
                                    field={field}
                                    onPress={() => goToDetail(field)}
                                />
                            ))
                        )}
                    </>
                ) : (
                    SPORTS.filter(s => s !== 'Tất cả').map(sport => {
                        const sportFields = fields.filter(f => f.sport === sport);
                        if (sportFields.length === 0) return null;
                        return (
                            <View key={sport}>
                                <SectionHeader
                                    title={`${SPORT_ICONS[sport]} Sân ${sport}`}
                                    sub={`${sportFields.length} sân`}
                                    onPress={() => setSelectedSport(sport)}
                                    color={SPORT_COLORS[sport]}
                                />
                                {sportFields.slice(0, 2).map(field => (
                                    <FieldListCard
                                        key={field.id}
                                        field={field}
                                        onPress={() => goToDetail(field)}
                                    />
                                ))}
                                {sportFields.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.showMoreBtn}
                                        onPress={() => setSelectedSport(sport)}
                                    >
                                        <Text style={styles.showMoreText}>Xem thêm {sportFields.length - 2} sân {sport} →</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}

                {/* SẢN PHẨM BÁN CHẠY */}
                {searchText === '' && (
                    <>
                        <SectionHeader title="🛍️ Sản Phẩm Nổi Bật" sub="Dụng cụ thể thao" />
                        <View style={styles.productRow}>
                            {FAKE_PRODUCTS.map(p => (
                                <TouchableOpacity key={p.id} style={styles.productCard}>
                                    <View style={styles.productTag}>
                                        <Text style={styles.productTagText}>{p.tag}</Text>
                                    </View>
                                    <View style={styles.productImgBox}>
                                        <Text style={{ fontSize: 44 }}>{p.icon}</Text>
                                    </View>
                                    <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                                    <Text style={styles.productPrice}>{p.price.toLocaleString('vi-VN')}đ</Text>
                                    <View style={styles.productAddBtn}>
                                        <Text style={styles.productAddText}>+ Thêm</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* BOTTOM BANNER */}
                {searchText === '' && (
                    <TouchableOpacity
                        style={styles.bottomBanner}
                        onPress={() => navigation.navigate('FieldList')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.bottomBannerLeft}>
                            <Text style={styles.bottomBannerTitle}>Sẵn sàng{'\n'}thi đấu? 🏆</Text>
                            <Text style={styles.bottomBannerSub}>Hơn {fields.length} sân đang chờ bạn</Text>
                            <View style={styles.bottomBannerBtn}>
                                <Text style={styles.bottomBannerBtnText}>Đặt sân ngay</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 72, opacity: 0.3 }}>🏟️</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 32 }} />
            </Animated.ScrollView>

            {/* FILTER MODAL */}
            <Modal visible={showFilter} transparent animationType="none" onRequestClose={closeFilter}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeFilter}>
                    <Animated.View
                        style={[styles.filterSheet, {
                            transform: [{
                                translateY: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] })
                            }]
                        }]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.filterHandle} />
                            <Text style={styles.filterSheetTitle}>Bộ lọc tìm kiếm</Text>

                            <Text style={styles.filterLabel}>💰 Lọc theo giá</Text>
                            <View style={styles.filterChipRow}>
                                {PRICE_RANGES.map((p, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.filterChip, selectedPrice === idx && styles.filterChipActive]}
                                        onPress={() => setSelectedPrice(idx)}
                                    >
                                        <Text style={[styles.filterChipText, selectedPrice === idx && styles.filterChipTextActive]}>
                                            {p.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterLabel}>🕐 Lọc theo khung giờ</Text>
                            <View style={styles.filterChipRow}>
                                {TIME_FILTERS.map((t, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.filterChip, selectedTime === idx && styles.filterChipActive]}
                                        onPress={() => setSelectedTime(idx)}
                                    >
                                        <Text style={[styles.filterChipText, selectedTime === idx && styles.filterChipTextActive]}>
                                            {t.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.filterActions}>
                                <TouchableOpacity
                                    style={styles.filterResetBtn}
                                    onPress={() => { setSelectedPrice(0); setSelectedTime(0); setSelectedSport('Tất cả'); }}
                                >
                                    <Text style={styles.filterResetText}>Xóa tất cả</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.filterApplyBtn} onPress={closeFilter}>
                                    <Text style={styles.filterApplyText}>
                                        Áp dụng {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

function StatCard({ icon, value, label, color }) {
    return (
        <View style={[styles.statCard, { borderTopColor: color }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function SectionHeader({ title, sub, onPress, color }) {
    return (
        <View style={styles.sectionHeader}>
            <View>
                <Text style={[styles.sectionTitle, color && { color }]}>{title}</Text>
                {sub && <Text style={styles.sectionSub}>{sub}</Text>}
            </View>
            {onPress && (
                <TouchableOpacity onPress={onPress} style={styles.seeAllBtn}>
                    <Text style={styles.seeAllText}>Tất cả →</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function FeaturedCard({ field, onPress }) {
    const imageSource = FIELD_IMAGES[field.image];
    const color = SPORT_COLORS[field.sport] || '#2ede5a';
    return (
        <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.93}>
            <View style={styles.featuredImgBox}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.featuredImg} resizeMode="cover" />
                ) : (
                    <View style={[styles.featuredImgPlaceholder, { backgroundColor: color + '22' }]}>
                        <Text style={{ fontSize: 48 }}>{SPORT_ICONS[field.sport] || '🏟️'}</Text>
                    </View>
                )}
                <View style={[styles.featuredSportBadge, { backgroundColor: color }]}>
                    <Text style={styles.featuredSportBadgeText}>{SPORT_ICONS[field.sport]} {field.sport}</Text>
                </View>
                {!field.available && (
                    <View style={styles.featuredUnavailOverlay}>
                        <Text style={styles.featuredUnavailText}>Hết sân</Text>
                    </View>
                )}
            </View>
            <View style={styles.featuredBody}>
                <Text style={styles.featuredName} numberOfLines={1}>{field.name}</Text>
                <Text style={styles.featuredLocation} numberOfLines={1}>📍 {field.location}</Text>
                <View style={styles.featuredBottom}>
                    <View>
                        <Text style={styles.featuredPriceLabel}>từ</Text>
                        <Text style={[styles.featuredPrice, { color }]}>{field.price.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <View style={styles.featuredRating}>
                        <Text style={styles.featuredRatingStar}>⭐</Text>
                        <Text style={styles.featuredRatingVal}>{field.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function FieldListCard({ field, onPress }) {
    const imageSource = FIELD_IMAGES[field.image];
    const color = SPORT_COLORS[field.sport] || '#2ede5a';
    return (
        <TouchableOpacity style={styles.listCard} onPress={onPress} activeOpacity={0.93}>
            <View style={styles.listImgBox}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.listImg} resizeMode="cover" />
                ) : (
                    <View style={[styles.listImgPlaceholder, { backgroundColor: color + '22' }]}>
                        <Text style={{ fontSize: 32 }}>{SPORT_ICONS[field.sport] || '🏟️'}</Text>
                    </View>
                )}
                {!field.available && (
                    <View style={styles.listUnavailOverlay}>
                        <Text style={styles.listUnavailText}>Hết</Text>
                    </View>
                )}
            </View>
            <View style={styles.listBody}>
                <View style={styles.listTopRow}>
                    <Text style={styles.listName} numberOfLines={1}>{field.name}</Text>
                    <View style={styles.listRating}>
                        <Text style={styles.listRatingStar}>⭐</Text>
                        <Text style={styles.listRatingVal}>{field.rating}</Text>
                    </View>
                </View>
                <Text style={styles.listLocation} numberOfLines={1}>📍 {field.location}</Text>
                <View style={styles.listBottom}>
                    <View style={[styles.listSportChip, { backgroundColor: color + '18' }]}>
                        <Text style={[styles.listSportText, { color }]}>{SPORT_ICONS[field.sport]} {field.sport}</Text>
                    </View>
                    <Text style={[styles.listPrice, { color }]}>
                        {field.price.toLocaleString('vi-VN')}đ
                        <Text style={styles.listPriceUnit}>/h</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#f7f8fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f8fa' },
    loadingText: { marginTop: 12, color: '#aaa', fontSize: 14 },

    header: {
        backgroundColor: '#fff', paddingTop: 52, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8,
    },
    headerTop: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 14,
    },
    headerGreet: { fontSize: 20, color: '#000000', fontWeight: '500', marginBottom: 2 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#111', letterSpacing: -0.5 },
    notifBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#f4f6f8', justifyContent: 'center', alignItems: 'center' },
    notifIcon: { fontSize: 20 },
    notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', position: 'absolute', top: 8, right: 8, borderWidth: 1.5, borderColor: '#fff' },

    searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f4f6f8', borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 10,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    searchBoxFocused: { borderColor: COLORS.primary, backgroundColor: '#fff' },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#111', fontWeight: '500' },
    clearIcon: { fontSize: 14, color: '#aaa', fontWeight: '700', padding: 2 },
    filterBtn: {
        width: 46, height: 46, borderRadius: 14,
        backgroundColor: '#111', justifyContent: 'center', alignItems: 'center',
    },
    filterBtnIcon: { fontSize: 18 },
    filterBadge: {
        position: 'absolute', top: 6, right: 6,
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    },
    filterBadgeText: { fontSize: 10, fontWeight: '800', color: '#111' },

    sportChipScroll: { paddingLeft: 16, marginBottom: 4 },
    sportChip: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, backgroundColor: '#f4f6f8',
        marginRight: 8, borderWidth: 1.5, borderColor: 'transparent',
    },
    sportChipActive: { backgroundColor: '#111', borderColor: '#111' },
    sportChipIcon: { fontSize: 13 },
    sportChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
    sportChipTextActive: { color: '#fff' },

    searchResultBanner: {
        marginHorizontal: 16, marginTop: 12, marginBottom: 4,
        backgroundColor: '#f0fdf4', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 8,
    },
    searchResultText: { fontSize: 13, color: '#555' },
    searchResultCount: { fontWeight: '800', color: COLORS.primary },

    statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 10, marginBottom: 4 },
    statCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 14,
        padding: 14, alignItems: 'center', borderTopWidth: 3, elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    statIcon: { fontSize: 22, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: '900' },
    statLabel: { fontSize: 11, color: '#aaa', marginTop: 2, fontWeight: '500' },

    heroBanner: {
        margin: 16, borderRadius: 22, backgroundColor: '#111',
        flexDirection: 'row', alignItems: 'center',
        overflow: 'hidden', minHeight: 160, elevation: 6,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12,
    },
    heroBannerInner: { flex: 1, padding: 22 },
    heroBadge: {
        backgroundColor: COLORS.primary + '22', alignSelf: 'flex-start',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 10,
        borderWidth: 1, borderColor: COLORS.primary + '44',
    },
    heroBadgeText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
    heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 32, marginBottom: 6, letterSpacing: -0.5 },
    heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 18 },
    heroBtn: {
        backgroundColor: COLORS.primary, alignSelf: 'flex-start',
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22,
    },
    heroBtnText: { color: '#111', fontWeight: '800', fontSize: 13 },
    heroBannerDeco: { width: 110, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    heroBannerEmoji: { fontSize: 72, zIndex: 2 },
    heroBannerCircle1: {
        position: 'absolute', width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.primary + '15', top: 20, right: 10,
    },
    heroBannerCircle2: {
        position: 'absolute', width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#fff1', bottom: 20, left: 10,
    },

    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-end', paddingHorizontal: 16,
        marginTop: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
    sectionSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
    seeAllBtn: { backgroundColor: '#f4f6f8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    seeAllText: { fontSize: 12, color: '#555', fontWeight: '700' },

    featuredScroll: { paddingLeft: 16, marginBottom: 4 },
    featuredCard: {
        width: width * 0.62, backgroundColor: '#fff', borderRadius: 18,
        marginRight: 12, overflow: 'hidden', elevation: 3,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
    },
    featuredImgBox: { position: 'relative' },
    featuredImg: { width: '100%', height: 130 },
    featuredImgPlaceholder: { height: 130, justifyContent: 'center', alignItems: 'center' },
    featuredSportBadge: {
        position: 'absolute', bottom: 10, left: 10,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
    featuredSportBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    featuredUnavailOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center',
    },
    featuredUnavailText: { color: '#fff', fontWeight: '800', fontSize: 15 },
    featuredBody: { padding: 12 },
    featuredName: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 3 },
    featuredLocation: { fontSize: 11, color: '#aaa', marginBottom: 10 },
    featuredBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    featuredPriceLabel: { fontSize: 10, color: '#aaa' },
    featuredPrice: { fontSize: 15, fontWeight: '900' },
    featuredRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
    featuredRatingStar: { fontSize: 11 },
    featuredRatingVal: { fontSize: 12, fontWeight: '800', color: '#f59e0b', marginLeft: 2 },

    listCard: {
        backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10,
        borderRadius: 16, flexDirection: 'row', overflow: 'hidden',
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6,
        height: 110,
    },
    listImgBox: { width: 110, height: 110, position: 'relative' },
    listImg: { width: 110, height: 110 },
    listImgPlaceholder: { width: 110, height: 110, justifyContent: 'center', alignItems: 'center' },
    listUnavailOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center', alignItems: 'center',
    },
    listUnavailText: { color: '#fff', fontWeight: '800', fontSize: 12 },
    listBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
    listTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    listName: { fontSize: 14, fontWeight: '800', color: '#111', flex: 1, marginRight: 6 },
    listRating: { flexDirection: 'row', alignItems: 'center' },
    listRatingStar: { fontSize: 10 },
    listRatingVal: { fontSize: 12, fontWeight: '700', color: '#f59e0b', marginLeft: 2 },
    listLocation: { fontSize: 11, color: '#aaa', marginBottom: 10 },
    listBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listSportChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    listSportText: { fontSize: 11, fontWeight: '700' },
    listPrice: { fontSize: 14, fontWeight: '900' },
    listPriceUnit: { fontSize: 11, fontWeight: '500', color: '#aaa' },

    showMoreBtn: {
        marginHorizontal: 16, marginBottom: 4, marginTop: -2,
        paddingVertical: 12, borderRadius: 12,
        backgroundColor: '#f4f6f8', alignItems: 'center',
    },
    showMoreText: { fontSize: 13, fontWeight: '700', color: '#555' },

    emptyBox: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
    emptyIcon: { fontSize: 56, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 6 },
    emptySub: { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    resetBtn: { backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 22 },
    resetBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

    productRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 8 },
    productCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    productTag: {
        position: 'absolute', top: 10, right: 10,
        backgroundColor: '#ef4444', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
    },
    productTagText: { color: '#fff', fontSize: 10, fontWeight: '800' },
    productImgBox: {
        height: 90, backgroundColor: '#f7f8fa',
        borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    },
    productName: { fontSize: 12, fontWeight: '600', color: '#222', marginBottom: 5, lineHeight: 17 },
    productPrice: { fontSize: 13, fontWeight: '900', color: COLORS.primary, marginBottom: 10 },
    productAddBtn: { backgroundColor: '#111', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
    productAddText: { color: '#fff', fontWeight: '700', fontSize: 12 },

    bottomBanner: {
        margin: 16, borderRadius: 22, backgroundColor: '#111',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 22, paddingRight: 16, paddingVertical: 24, elevation: 4,
    },
    bottomBannerLeft: { flex: 1 },
    bottomBannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 28, marginBottom: 6, letterSpacing: -0.3 },
    bottomBannerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 16 },
    bottomBannerBtn: {
        backgroundColor: COLORS.primary, alignSelf: 'flex-start',
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22,
    },
    bottomBannerBtnText: { color: '#111', fontWeight: '800', fontSize: 13 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    filterSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 24, paddingBottom: 40,
    },
    filterHandle: {
        width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0',
        alignSelf: 'center', marginBottom: 20,
    },
    filterSheetTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 20, letterSpacing: -0.3 },
    filterLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 4 },
    filterChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    filterChip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: '#f4f6f8', borderWidth: 1.5, borderColor: 'transparent',
    },
    filterChipActive: { backgroundColor: '#111', borderColor: '#111' },
    filterChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
    filterChipTextActive: { color: '#fff' },
    filterActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
    filterResetBtn: {
        flex: 1, paddingVertical: 14, borderRadius: 14,
        backgroundColor: '#f4f6f8', alignItems: 'center',
    },
    filterResetText: { fontWeight: '700', color: '#555', fontSize: 14 },
    filterApplyBtn: {
        flex: 2, paddingVertical: 14, borderRadius: 14,
        backgroundColor: '#111', alignItems: 'center',
    },
    filterApplyText: { fontWeight: '800', color: '#fff', fontSize: 14 },
});