import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import { PRODUCT_IMAGES } from "../services/productsData";
import { FIELD_IMAGES, getFieldImage } from "../services/fieldImages"; // ✅ dùng chung

const FIELD_IMAGE_KEYS = Object.keys(FIELD_IMAGES);

// ✅ Xác định type giống các screen khác
const getType = (item) => {
  if (item.type === "field" || item.type === "product") return item.type;
  if (item.time) return "field";
  if (item.size !== undefined && item.size !== null) return "product";
  if (FIELD_IMAGE_KEYS.includes(item.image)) return "field";
  return "product";
};

// ✅ Lấy ảnh đúng theo type
const getImage = (key, type) => {
  if (type === "field") return getFieldImage(key);
  return PRODUCT_IMAGES[key] || getFieldImage(key);
};

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + fee;

  // ✅ Gắn type vào từng item trước khi navigate sang Payment
  const handleCheckout = () => {
    const itemsWithType = cartItems.map(item => ({
      ...item,
      type: getType(item),
    }));
    navigation.navigate("Payment", { items: itemsWithType });
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={90} color="#bbb" />
        <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
        <Text style={styles.emptySub}>Hãy thêm sản phẩm hoặc đặt sân để tiếp tục</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.shopBtnText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Text style={styles.itemCount}>{cartItems.length} sản phẩm</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 250 }}
        renderItem={({ item }) => {
          const type = getType(item);
          return (
            <View style={styles.card}>
              <Image
                source={getImage(item.image, type)} // ✅ ảnh đúng
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.info}>
                {/* ✅ Badge phân biệt sân / sản phẩm */}
                <View style={[styles.typeBadge, { backgroundColor: type === "field" ? "#e8f5e9" : "#e3f2fd" }]}>
                  <Text style={[styles.typeBadgeText, { color: type === "field" ? "#2e7d32" : "#1565c0" }]}>
                    {type === "field" ? "🏟️ Đặt sân" : "🛍️ Sản phẩm"}
                  </Text>
                </View>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                {item.size ? <Text style={styles.meta}>Size: {item.size}</Text> : null}
                {item.time ? <Text style={styles.meta}>⏰ {item.time}</Text> : null}
                <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
                {type === "product" ? (
  <View style={styles.quantityRow}>
    <TouchableOpacity
      style={styles.qtyBtn}
      onPress={() => updateQuantity(item.id, item.quantity - 1)}
    >
      <Ionicons name="remove" size={18} color="#000" />
    </TouchableOpacity>

    <Text style={styles.qtyText}>{item.quantity}</Text>

    <TouchableOpacity
      style={styles.qtyBtn}
      onPress={() => updateQuantity(item.id, item.quantity + 1)}
    >
      <Ionicons name="add" size={18} color="#000" />
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.fieldInfo}>
    <Text style={styles.fieldBookingText}>
      📌 Đã đặt 1 sân
    </Text>
  </View>
)}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.id)}>
                <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.gray}>Tạm tính</Text>
          <Text>{subtotal.toLocaleString()}đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.gray}>Phí dịch vụ</Text>
          <Text>{fee.toLocaleString()}đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>{total.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity style={styles.paymentBtn} onPress={handleCheckout}>
          <Text style={styles.paymentText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { paddingTop: 55, paddingHorizontal: 20, paddingBottom: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  itemCount: { color: "#777", fontSize: 13 },
  card: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 15, marginTop: 15, borderRadius: 15, padding: 12, elevation: 2 },
  image: { width: 90, height: 90, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  typeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 4 },
  typeBadgeText: { fontSize: 11, fontWeight: "700" },
  name: { fontSize: 14, fontWeight: "bold", color: "#111" },
  meta: { color: "#777", fontSize: 12, marginTop: 2 },
  price: { color: "#2e7d32", fontWeight: "bold", fontSize: 15, marginTop: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  qtyText: { marginHorizontal: 15, fontWeight: "bold", fontSize: 15 },
  deleteBtn: { justifyContent: "center", paddingLeft: 10 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  gray: { color: "#777" },
  totalLabel: { fontWeight: "bold", fontSize: 16 },
  totalPrice: { fontWeight: "bold", fontSize: 20, color: "#2e7d32" },
  paymentBtn: { marginTop: 15, backgroundColor: "#2e7d32", paddingVertical: 15, borderRadius: 30, alignItems: "center" },
  paymentText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20 },
  emptyTitle: { fontSize: 22, fontWeight: "bold", marginTop: 20 },
  emptySub: { color: "#777", marginTop: 8, marginBottom: 25, textAlign: "center" },
  shopBtn: { backgroundColor: "#2e7d32", paddingHorizontal: 25, paddingVertical: 14, borderRadius: 30 },
  shopBtnText: { color: "#fff", fontWeight: "bold" },
});