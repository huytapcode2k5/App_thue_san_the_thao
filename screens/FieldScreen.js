import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator, Image
} from 'react-native';
import { COLORS } from '../utils/constants';
import { getFields } from '../services/jsonDataService';

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

const SPORT_FILTERS = ['Tất cả', 'Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ'];

export default function FieldListScreen({ route, navigation }) {
    const [fields, setFields] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedSport, setSelectedSport] = useState(route?.params?.sport || 'Tất cả');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFields();
    }, []);

    const loadFields = async () => {
        try {
            const data = await getFields();
            setFields(data);
            filterFields(data, selectedSport);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filterFields = (data, sport) => {
        if (sport === 'Tất cả') {
            setFiltered(data);
        } else {
            setFiltered(data.filter(f => f.sport === sport));
        }
    };

    const handleFilter = (sport) => {
        setSelectedSport(sport);
        filterFields(fields, sport);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* FILTER */}
            <View style={styles.filterWrapper}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={SPORT_FILTERS}
                    keyExtractor={item => item}
                    contentContainerStyle={styles.filterRow}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedSport === item && styles.filterChipActive
                            ]}
                            onPress={() => handleFilter(item)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedSport === item && styles.filterTextActive
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* DANH SÁCH SÂN */}
            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={{ fontSize: 48 }}>🏟️</Text>
                        <Text style={styles.emptyText}>Không có sân nào</Text>
                    </View>
                }
                renderItem={({ item: field }) => (
                    <TouchableOpacity
                        style={styles.fieldCard}
                        activeOpacity={0.92}
                        onPress={() => navigation.navigate('Booking', { field })}
                    >
                        {/* ẢNH */}
                        <View style={styles.imageBox}>
                            {FIELD_IMAGES[field.image] ? (
                                <Image
                                    source={FIELD_IMAGES[field.image]}
                                    style={styles.fieldImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={[styles.imagePlaceholder, { backgroundColor: SPORT_COLORS[field.sport] + '22' }]}>
                                    <Text style={{ fontSize: 48 }}>🏟️</Text>
                                </View>
                            )}
                            {/* Badge môn */}
                            <View style={[styles.sportBadge, { backgroundColor: SPORT_COLORS[field.sport] || COLORS.primary }]}>
                                <Text style={styles.sportBadgeText}>{field.sport}</Text>
                            </View>
                            {/* Badge available */}
                            <View style={[styles.availBadge, { backgroundColor: field.available ? '#27ae60' : '#e74c3c' }]}>
                                <Text style={styles.availBadgeText}>
                                    {field.available ? '● Còn sân' : '● Hết sân'}
                                </Text>
                            </View>
                        </View>

                        {/* THÔNG TIN */}
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
                                    <Text style={styles.priceLabel}>Giá từ</Text>
                                    <Text style={styles.fieldPrice}>
                                        {field.price.toLocaleString('vi-VN')}đ
                                        <Text style={styles.priceUnit}>/giờ</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.bookBtn, !field.available && styles.bookBtnDisabled]}
                                    onPress={() => navigation.navigate('Booking', { field })}
                                    disabled={!field.available}
                                >
                                    <Text style={styles.bookBtnText}>
                                        {field.available ? '📅 Đặt ngay' : 'Hết sân'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Filter
    filterWrapper: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 2,
    },
    filterRow: { paddingHorizontal: 16, gap: 8 },
    filterChip: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, backgroundColor: '#f4f6f8',
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { fontSize: 13, color: '#888', fontWeight: '600' },
    filterTextActive: { color: '#fff' },

    // List
    listContainer: { padding: 16, gap: 14 },

    // Card
    fieldCard: {
        backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
        elevation: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
    },
    imageBox: { position: 'relative' },
    fieldImage: { width: '100%', height: 160 },
    imagePlaceholder: {
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

    // Body
    fieldBody: { padding: 14 },
    fieldTopRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    fieldName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', flex: 1, marginRight: 8 },
    ratingBox: { backgroundColor: '#fff8e1', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    ratingText: { fontSize: 12, fontWeight: '700', color: '#f39c12' },
    fieldLocation: { fontSize: 12, color: '#888', marginBottom: 12 },
    fieldBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    priceLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
    fieldPrice: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
    priceUnit: { fontSize: 12, fontWeight: '500', color: '#aaa' },
    bookBtn: {
        backgroundColor: COLORS.primary, paddingHorizontal: 16,
        paddingVertical: 10, borderRadius: 12,
    },
    bookBtnDisabled: { backgroundColor: '#ccc' },
    bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

    // Empty
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { color: '#aaa', fontSize: 15, marginTop: 12, fontWeight: '500' },
});