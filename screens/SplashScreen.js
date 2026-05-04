import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    // Animation values
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleY = useRef(new Animated.Value(30)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const cardsOpacity = useRef(new Animated.Value(0)).current;
    const cardsY = useRef(new Animated.Value(40)).current;
    const dotOpacity = useRef(new Animated.Value(0)).current;
    const dotScale = useRef(new Animated.Value(0.5)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Chuỗi animation
        Animated.sequence([
            // 1. Logo xuất hiện
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1, duration: 500, useNativeDriver: true,
                }),
            ]),
            // 2. Title hiện lên
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1, duration: 500, useNativeDriver: true,
                }),
                Animated.timing(titleY, {
                    toValue: 0, duration: 500, useNativeDriver: true,
                }),
            ]),
            // 3. Subtitle
            Animated.timing(subtitleOpacity, {
                toValue: 1, duration: 400, useNativeDriver: true,
            }),
            // 4. Cards stats
            Animated.parallel([
                Animated.timing(cardsOpacity, {
                    toValue: 1, duration: 400, useNativeDriver: true,
                }),
                Animated.timing(cardsY, {
                    toValue: 0, duration: 400, useNativeDriver: true,
                }),
            ]),
            // 5. Dot + tagline
            Animated.parallel([
                Animated.spring(dotScale, {
                    toValue: 1, tension: 80, friction: 6, useNativeDriver: true,
                }),
                Animated.timing(dotOpacity, {
                    toValue: 1, duration: 300, useNativeDriver: true,
                }),
                Animated.timing(taglineOpacity, {
                    toValue: 1, duration: 400, useNativeDriver: true,
                }),
            ]),
            // 6. Dừng 1.2s rồi chuyển màn hình
            Animated.delay(1200),
        ]).start(() => {
            navigation.replace('Login');
        });
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Gradient nền xanh lá */}
            <LinearGradient
                colors={['#3a6b35', '#5a8f52', '#7ab870', '#a8d5a2']}
                locations={[0, 0.35, 0.65, 1]}
                style={StyleSheet.absoluteFill}
            />

            {/* Overlay mờ tạo chiều sâu */}
            <View style={styles.overlay} />

            {/* Hình tròn trang trí nền */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />

            {/* === LOGO === */}
            <Animated.View style={[
                styles.logoWrapper,
                { opacity: logoOpacity, transform: [{ scale: logoScale }] }
            ]}>
                <View style={styles.logoBox}>
                    <Text style={styles.logoEmoji}>⚽</Text>
                </View>
            </Animated.View>

            {/* === TITLE === */}
            <Animated.View style={[
                styles.titleBlock,
                { opacity: titleOpacity, transform: [{ translateY: titleY }] }
            ]}>
                <Text style={styles.titleLine1}>Thuê Sân</Text>
                <Text style={styles.titleLine2}>Thể Thao</Text>
            </Animated.View>

            {/* === SUBTITLE === */}
            <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
                Sẵn sàng cho trận đấu?
            </Animated.Text>

            {/* === STAT CARDS === */}
            <Animated.View style={[
                styles.statsRow,
                { opacity: cardsOpacity, transform: [{ translateY: cardsY }] }
            ]}>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>📍</Text>
                    <View>
                        <Text style={styles.statLabel}>GẦN BẠN</Text>
                        <Text style={styles.statValue}>12 Sân trống</Text>
                    </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>⚡</Text>
                    <View>
                        <Text style={styles.statLabel}>TRỰC TIẾP</Text>
                        <Text style={styles.statValue}>Đặt ngay</Text>
                    </View>
                </View>
            </Animated.View>

            {/* === LOADING DOT === */}
            <Animated.View style={[
                styles.loadingDot,
                { opacity: dotOpacity, transform: [{ scale: dotScale }] }
            ]} />

            {/* === TAGLINE === */}
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
                ĐÁNH THỨC ĐAM MÊ THỂ THAO
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3a6b35',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },

    // Hình tròn trang trí
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    circle1: { width: 320, height: 320, top: -80, right: -100 },
    circle2: { width: 200, height: 200, bottom: 80, left: -60 },
    circle3: { width: 120, height: 120, bottom: 200, right: 20 },

    // Logo
    logoWrapper: { marginBottom: 24 },
    logoBox: {
        width: 88, height: 88, borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.92)',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.25,
        shadowRadius: 16, elevation: 10,
    },
    logoEmoji: { fontSize: 44 },

    // Title
    titleBlock: { alignItems: 'center', marginBottom: 12 },
    titleLine1: {
        fontSize: 42, fontWeight: '800', color: '#fff',
        letterSpacing: 0.5, lineHeight: 48,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    titleLine2: {
        fontSize: 42, fontWeight: '800', color: '#fff',
        letterSpacing: 0.5, lineHeight: 48,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },

    // Subtitle
    subtitle: {
        fontSize: 16, color: 'rgba(255,255,255,0.85)',
        marginBottom: 40, letterSpacing: 0.3,
        fontWeight: '500',
    },

    // Stats
    statsRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20, paddingVertical: 16, paddingHorizontal: 24,
        marginBottom: 60, gap: 0,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(10px)',
    },
    statCard: {
        flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1,
        justifyContent: 'center',
    },
    statDivider: {
        width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 8,
    },
    statIcon: { fontSize: 22 },
    statLabel: {
        fontSize: 10, color: 'rgba(255,255,255,0.7)',
        fontWeight: '700', letterSpacing: 0.8,
    },
    statValue: {
        fontSize: 14, color: '#fff',
        fontWeight: '700', marginTop: 2,
    },

    // Loading dot
    loadingDot: {
        width: 36, height: 36, borderRadius: 18,
        borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
        borderTopColor: '#fff',
        marginBottom: 16,
    },

    // Tagline
    tagline: {
        fontSize: 10, color: 'rgba(255,255,255,0.55)',
        letterSpacing: 3, fontWeight: '600',
        position: 'absolute', bottom: 48,
    },
});