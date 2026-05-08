// components/AppButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS } from '../utils/constants';

/**
 * AppButton - Nút bấm dùng chung toàn app
 * Props:
 * @param {string}   title    - Chữ hiển thị trên nút
 * @param {function} onPress  - Hàm xử lý khi nhấn
 * @param {string}   variant  - 'primary' | 'outline' | 'danger' | 'ghost'
 * @param {string}   size     - 'sm' | 'md' | 'lg'
 * @param {boolean}  loading  - Hiện loading spinner
 * @param {boolean}  disabled - Vô hiệu hóa nút
 * @param {string}   icon     - Emoji icon bên trái
 * @param {object}   style    - Custom style
 */
export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
}) {
    const isDisabled = disabled || loading;
    const sizeStyle = sizes[size] || sizes.md;

    const getContainerStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineContainer;
            case 'danger': return styles.dangerContainer;
            case 'ghost': return styles.ghostContainer;
            default: return styles.primaryContainer; // ✅ dùng backgroundColor thay LinearGradient
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline': return COLORS.primary;
            case 'ghost': return COLORS.primary;
            default: return '#fff';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
            style={[
                styles.base,
                getContainerStyle(),
                { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingHorizontal, borderRadius: sizeStyle.borderRadius },
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : COLORS.primary} size="small" />
            ) : (
                <View style={styles.row}>
                    {icon ? <Text style={styles.icon}>{icon}</Text> : null}
                    <Text style={[styles.text, { color: getTextColor(), fontSize: sizeStyle.fontSize }]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const sizes = {
    sm: { height: 38, paddingHorizontal: 16, fontSize: 13, borderRadius: 8 },
    md: { height: 50, paddingHorizontal: 20, fontSize: 15, borderRadius: 12 },
    lg: { height: 58, paddingHorizontal: 28, fontSize: 17, borderRadius: 14 },
};

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    // ✅ Thay LinearGradient bằng backgroundColor đơn giản
    primaryContainer: {
        backgroundColor: COLORS.primary,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    dangerContainer: {
        backgroundColor: '#e74c3c',
    },
    ghostContainer: {
        backgroundColor: 'transparent',
    },
    disabled: { opacity: 0.5 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: { fontSize: 16 },
    text: {
        fontWeight: '700',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
});