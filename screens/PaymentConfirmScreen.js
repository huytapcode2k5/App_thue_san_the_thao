// screens/PaymentConfirmScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HistoryContext } from "../screens/HistoryContext";
import { CartContext } from "../screens/CartContext";
import { PRODUCT_IMAGES } from "../services/productsData";
import { FIELD_IMAGES, getFieldImage } from "../services/fieldImages"; // ✅ dùng chung

const FIELD_IMAGE_KEYS = Object.keys(FIELD_IMAGES);

// ✅ Xác định type chính xác
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

const orderCode = Math.floor(Math.random() * 99999);

export default function PaymentConfirmScreen({ route }) {
  const navigation = useNavigation();
  const { addOrder } = useContext(HistoryContext);
  const { clearCart } = useContext(CartContext);

  const rawItems = route.params?.items || [];
  const paymentMethod = route.params?.paymentMethod || "MoMo";
  const fee = 15000;
  const subtotal = rawItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + fee;

  // ✅ Gắn type đúng vào từng item trước khi lưu/hiển thị
  const items = rawItems.map(item => ({
    ...item,
    type: getType(item),
    image: item.image || "bernabeu",
    time: item.time || "",
  }));

  const handleBackHome = () => {
    addOrder({
      id: Date.now(),
      code: orderCode,
      date: new Date().toLocaleDateString(),
      items,
      total,
      method: paymentMethod,
      status: "ĐÃ THANH TOÁN",
    });
    clearCart();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <Text style={styles.code}>#{orderCode}</Text>
      </View>

      <View style={styles.successBox}>
        <View>
          <Text style={styles.successTitle}>ĐÃ XÁC NHẬN</Text>
          <Text style={styles.successSub}>Thanh toán thành công</Text>
        </View>
        <Ionicons name="checkmark-circle" size={34} color="#fff" />
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Tiến độ đơn hàng</Text>
        <TimelineItem active text="Đặt hàng thành công" time="Vừa xong" />
        <TimelineItem active text="Đã thanh toán" time={paymentMethod} />
        <TimelineItem text="Hoàn tất" time="Sau khi nhận hàng" />
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Chi tiết đơn hàng</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image
              source={getImage(item.image, item.type)} // ✅ ảnh đúng
              style={styles.img}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              {item.size ? <Text style={styles.gray}>Size: {item.size}</Text> : null}
              {item.time ? <Text style={styles.gray}>⏰ {item.time}</Text> : null}
              <Text style={styles.gray}>SL: {item.quantity}</Text>
            </View>
            <Text style={styles.price}>{(item.price * item.quantity).toLocaleString()}đ</Text>
          </View>
        ))}
        <View style={styles.row}><Text style={styles.gray}>Tạm tính</Text><Text>{subtotal.toLocaleString()}đ</Text></View>
        <View style={styles.row}><Text style={styles.gray}>Phí dịch vụ</Text><Text>{fee.toLocaleString()}đ</Text></View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>{total.toLocaleString()}đ</Text>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Phương thức thanh toán</Text>
        <View style={styles.method}>
          <View style={styles.methodLeft}>
            <Ionicons name="wallet-outline" size={20} color="#2e7d32" />
            <Text style={styles.methodText}>{paymentMethod}</Text>
          </View>
          <Text style={styles.success}>Đã thanh toán</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={handleBackHome}>
        <Text style={styles.homeText}>Về trang chủ</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const TimelineItem = ({ text, time, active }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View style={[styles.dot, { backgroundColor: active ? "#2e7d32" : "#ccc" }]} />
      <View style={styles.line} />
    </View>
    <View style={styles.timelineContent}>
      <Text style={{ fontWeight: active ? "700" : "400" }}>{text}</Text>
      <Text style={styles.gray}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginBottom: 10 },
  headerTitle: { fontWeight: "bold", fontSize: 18 },
  code: { color: "#777" },
  successBox: { backgroundColor: "#2e7d32", margin: 15, padding: 18, borderRadius: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  successTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  successSub: { color: "#dcedc8", marginTop: 4 },
  box: { backgroundColor: "#fff", marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 14 },
  title: { fontWeight: "bold", fontSize: 15, marginBottom: 12 },
  timelineItem: { flexDirection: "row", marginBottom: 15 },
  timelineLeft: { alignItems: "center", marginRight: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  line: { width: 2, height: 42, backgroundColor: "#ccc", marginTop: 2 },
  timelineContent: { flex: 1 },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  img: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  name: { fontWeight: "700", fontSize: 14 },
  gray: { color: "#777", fontSize: 12, marginTop: 2 },
  price: { color: "#2e7d32", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  totalLabel: { fontWeight: "bold", fontSize: 15 },
  totalPrice: { color: "#2e7d32", fontWeight: "bold", fontSize: 16 },
  method: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  methodLeft: { flexDirection: "row", alignItems: "center" },
  methodText: { marginLeft: 8, fontWeight: "600" },
  success: { color: "#2e7d32", fontWeight: "bold" },
  homeBtn: { backgroundColor: "#2e7d32", margin: 15, padding: 16, borderRadius: 30, alignItems: "center" },
  homeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});