import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';

/**
 * AppButton - Nút bấm dùng chung toàn app
 *
 * Props:
 * @param {string}   title         - Chữ hiển thị trên nút
 * @param {function} onPress       - Hàm xử lý khi nhấn
 * @param {string}   variant       - 'primary' | 'outline' | 'danger' | 'ghost' (mặc định: 'primary')
 * @param {string}   size          - 'sm' | 'md' | 'lg' (mặc định: 'md')
 * @param {boolean}  loading       - Hiện loading spinner (mặc định: false)
 * @param {boolean}  disabled      - Vô hiệu hóa nút (mặc định: false)
 * @param {string}   icon          - Emoji hoặc text icon bên trái
 * @param {object}   style         - Custom style bên ngoài
 *
 * Ví dụ dùng:
 * <AppButton title="Đặt sân ngay" onPress={handleBook} />
 * <AppButton title="Hủy" variant="outline" onPress={handleCancel} />
 * <AppButton title="Xóa" variant="danger" onPress={handleDelete} />
 * <AppButton title="Đang xử lý..." loading />
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
    const sizeStyle = sizes[size];

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.85}
                style={[styles.base, isDisabled && styles.disabled, style]}
            >
                <LinearGradient
                    colors={isDisabled ? ['#ccc', '#ccc'] : [COLORS.primaryDark, COLORS.primary]}
                    style={[styles.gradient, sizeStyle]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <View style={styles.row}>
                            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
                            <Text style={[styles.primaryText, { fontSize: sizeStyle.fontSize }]}>{title}</Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const variantStyle = variantStyles[variant] || variantStyles.outline;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={[
                styles.base,
                variantStyle.container,
                sizeStyle,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variantStyle.textColor} size="small" />
            ) : (
                <View style={styles.row}>
                    {icon ? <Text style={styles.icon}>{icon}</Text> : null}
                    <Text style={[styles.text, { color: variantStyle.textColor, fontSize: sizeStyle.fontSize }]}>
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

const variantStyles = {
    outline: {
        container: {
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: 'transparent',
        },
        textColor: COLORS.primaryDark,
    },
    danger: {
        container: {
            backgroundColor: '#e74c3c',
        },
        textColor: '#fff',
    },
    ghost: {
        container: {
            backgroundColor: 'transparent',
        },
        textColor: COLORS.primaryDark,
    },
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: { fontSize: 16 },
    primaryText: {
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    disabled: { opacity: 0.5 },
});