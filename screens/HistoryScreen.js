// screens/HistoryScreen.js
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HistoryContext } from "../screens/HistoryContext";
import { PRODUCT_IMAGES } from "../services/productsData";
import { FIELD_IMAGES, getFieldImage } from "../services/fieldImages"; // ✅ dùng chung

const FIELD_IMAGE_KEYS = Object.keys(FIELD_IMAGES);

const STATUS_CONFIG = {
    "ĐÃ THANH TOÁN": { bg: "#1565c0", color: "#fff" },
    "ĐÃ HOÀN THÀNH": { bg: "#2e7d32", color: "#fff" },
    "ĐÃ HỦY": { bg: "#c62828", color: "#fff" },
};

const getType = (item) => {
    if (item.type === "field" || item.type === "product") return item.type;
    if (item.time) return "field";
    if (item.size !== undefined && item.size !== null) return "product";
    if (FIELD_IMAGE_KEYS.includes(item.image)) return "field";
    return "product";
};

// ✅ Ảnh đúng theo type
const getImage = (key, type) => {
    if (type === "field") return getFieldImage(key);
    return PRODUCT_IMAGES[key] || getFieldImage(key);
};

export default function HistoryScreen({ navigation }) {
    const { orders, clearHistory } = useContext(HistoryContext);
    const [activeTab, setActiveTab] = useState("field");

    const allItems = orders.flatMap((order) =>
        order.items.map((item, index) => ({
            id: `${order.id}-${index}`,
            name: item.name,
            time: item.time ?? "",
            date: order.date,
            price: item.price * item.quantity,
            quantity: item.quantity,
            method: order.method,
            total: order.total,
            status: order.status || "ĐÃ THANH TOÁN",
            image: item.image,
            type: getType(item),
            size: item.size,
        }))
    );

    const fieldItems = allItems.filter(i => i.type === "field");
    const productItems = allItems.filter(i => i.type === "product");
    const filtered = activeTab === "field" ? fieldItems : productItems;

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
                <TouchableOpacity onPress={clearHistory}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            </View>

            {allItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
                    <Text style={styles.emptySub}>Đơn hàng sau khi thanh toán sẽ xuất hiện tại đây</Text>
                </View>
            ) : (
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.statsBox}>
                        <View style={styles.statsLeft}>
                            <Text style={styles.statsNumber}>{allItems.length}</Text>
                            <Text style={styles.statsLabel}>Tổng giao dịch đã thanh toán</Text>
                        </View>
                        <View style={styles.statsRight}>
                            <Ionicons name="receipt-outline" size={36} color="#2e7d32" />
                        </View>
                    </View>

                    <View style={styles.tabRow}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === "field" && styles.activeTabBtn]}
                            onPress={() => setActiveTab("field")}
                        >
                            <Text style={[styles.tabText, activeTab === "field" && styles.activeTabText]}>
                                🏟️ Đặt sân ({fieldItems.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === "product" && styles.activeTabBtn]}
                            onPress={() => setActiveTab("product")}
                        >
                            <Text style={[styles.tabText, activeTab === "product" && styles.activeTabText]}>
                                🛍️ Sản phẩm ({productItems.length})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {filtered.length === 0 ? (
                        <View style={styles.emptyTab}>
                            <Text style={styles.emptyTabIcon}>{activeTab === "field" ? "🏟️" : "🛍️"}</Text>
                            <Text style={styles.emptyTabText}>
                                Chưa có {activeTab === "field" ? "đặt sân" : "mua sản phẩm"} nào
                            </Text>
                        </View>
                    ) : (
                        filtered.map((item) => {
                            const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG["ĐÃ THANH TOÁN"];
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.card}
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        navigation.navigate("HistoryDetail", {
                                            order: item,
                                        })
                                    }
                                >
                                    <Image
                                        source={getImage(item.image, item.type)} // ✅ ảnh đúng
                                        style={styles.cardImg}
                                        resizeMode="cover"
                                    />
                                    <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.status}</Text>
                                    </View>
                                    <View style={styles.priceTag}>
                                        <Text style={styles.priceText}>{item.price.toLocaleString()}đ</Text>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <Text style={styles.cardTitle}>{item.name}</Text>
                                        <View style={styles.infoRow}>
                                            <Ionicons name="calendar-outline" size={14} color="#777" />
                                            <Text style={styles.infoText}>{item.date}</Text>
                                        </View>
                                        {item.time ? (
                                            <View style={styles.infoRow}>
                                                <Ionicons name="time-outline" size={14} color="#777" />
                                                <Text style={styles.infoText}>{item.time}</Text>
                                            </View>
                                        ) : null}
                                        {item.size ? (
                                            <View style={styles.infoRow}>
                                                <Ionicons name="resize-outline" size={14} color="#777" />
                                                <Text style={styles.infoText}>Size: {item.size}</Text>
                                            </View>
                                        ) : null}
                                        <View style={styles.infoRow}>
                                            <Ionicons name="wallet-outline" size={14} color="#777" />
                                            <Text style={styles.paymentText}>{item.method}</Text>
                                        </View>
                                        <View style={styles.bottomRow}>
                                            <Text style={styles.quantity}>SL: {item.quantity}</Text>
                                            <Text style={styles.total}>Tổng: {item.total.toLocaleString()}đ</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                    <View style={{ height: 30 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#f3f5f4" },
    header: { paddingTop: 55, paddingHorizontal: 16, paddingBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff" },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
    emptyTitle: { marginTop: 15, fontSize: 22, fontWeight: "700", color: "#333" },
    emptySub: { marginTop: 8, fontSize: 14, color: "#777", textAlign: "center", lineHeight: 22 },
    scroll: { flex: 1, paddingHorizontal: 14 },
    statsBox: { backgroundColor: "#2e7d32", marginTop: 15, borderRadius: 18, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statsLeft: { flex: 1 },
    statsNumber: { fontSize: 42, color: "#fff", fontWeight: "800" },
    statsLabel: { color: "#d7f5d8", marginTop: 5, fontSize: 13 },
    statsRight: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
    tabRow: { flexDirection: "row", backgroundColor: "#e5e5e5", borderRadius: 30, padding: 4, marginTop: 18, marginBottom: 16 },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 30, alignItems: "center" },
    activeTabBtn: { backgroundColor: "#2e7d32" },
    tabText: { color: "#666", fontWeight: "600", fontSize: 13 },
    activeTabText: { color: "#fff" },
    emptyTab: { alignItems: "center", paddingVertical: 50 },
    emptyTabIcon: { fontSize: 48, marginBottom: 12 },
    emptyTabText: { fontSize: 15, color: "#aaa" },
    card: { backgroundColor: "#fff", borderRadius: 18, marginBottom: 18, overflow: "hidden", elevation: 3 },
    cardImg: { width: "100%", height: 160 },
    badge: { position: "absolute", top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: "700" },
    priceTag: { position: "absolute", top: 12, right: 12, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
    priceText: { color: "#fff", fontWeight: "700" },
    cardBody: { padding: 14 },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 10 },
    infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    infoText: { marginLeft: 6, color: "#666", fontSize: 13 },
    paymentText: { marginLeft: 6, color: "#2e7d32", fontWeight: "600", fontSize: 13 },
    bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: "#eee" },
    quantity: { color: "#777", fontWeight: "600" },
    total: { color: "#2e7d32", fontWeight: "700", fontSize: 15 },
});