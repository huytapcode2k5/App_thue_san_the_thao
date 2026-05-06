import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function PaymentConfirmScreen({ navigation, route }) {
  const items = route.params?.items || [];

  const fee = 15000;

  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const total = subtotal + fee;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={22} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <Text style={styles.code}>#{Math.floor(Math.random() * 99999)}</Text>
      </View>

      {/* SUCCESS BOX */}
      <View style={styles.successBox}>
        <View>
          <Text style={styles.successTitle}>ĐÃ XÁC NHẬN</Text>
          <Text style={styles.successSub}>Sân đã sẵn sàng cho bạn lúc 18:00</Text>
        </View>
        <Ionicons name="checkmark-circle" size={30} color="#fff" />
      </View>

      {/* TIMELINE */}
      <View style={styles.box}>
        <Text style={styles.title}>Tiến độ đơn hàng</Text>

        <TimelineItem active text="Đặt hàng thành công" time="06:46 AM" />
        <TimelineItem active text="Đã xác nhận" time="10:48 AM" />
        <TimelineItem text="Hoàn tất" time="Đơn hoàn tất sau khi kết thúc" />
      </View>

      {/* ITEMS */}
      <View style={styles.box}>
        <Text style={styles.title}>Chi tiết dịch vụ</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={images[item.image]} style={styles.img} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.gray}>{item.time}</Text>
            </View>

            <Text style={styles.price}>
              {(item.price * item.quantity).toLocaleString()}đ
            </Text>
          </View>
        ))}

        {/* TOTAL */}
        <View style={styles.row}>
          <Text style={styles.gray}>Tạm tính</Text>
          <Text>{subtotal.toLocaleString()}đ</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.gray}>Phí dịch vụ</Text>
          <Text>{fee.toLocaleString()}đ</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.bold}>Tổng cộng</Text>
          <Text style={styles.total}>{total.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* PAYMENT */}
      <View style={styles.box}>
        <Text style={styles.title}>Phương thức thanh toán</Text>

        <View style={styles.method}>
          <Ionicons name="wallet-outline" size={18} />
          <Text style={{ marginLeft: 10 }}>Ví điện tử MoMo</Text>
          <Text style={styles.success}>Đã thanh toán</Text>
        </View>
      </View>

      {/* LOCATION */}
      <View style={styles.box}>
        <Text style={styles.title}>Địa điểm</Text>
        <Text style={styles.bold}>Trung tâm thể thao Kinetic Pulse</Text>
        <Text style={styles.gray}>123 Lý Thường Kiệt, TP.HCM</Text>

        <TouchableOpacity style={styles.mapBtn}>
          <Ionicons name="navigate-outline" size={16} />
          <Text style={{ marginLeft: 5 }}>Chỉ đường</Text>
        </TouchableOpacity>
      </View>

      {/* ACTION */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons name="call-outline" size={16} />
          <Text> Gọi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons name="chatbubble-outline" size={16} />
          <Text> Nhắn tin</Text>
        </TouchableOpacity>
      </View>

      {/* BACK HOME */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeText}>Về trang chủ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* TIMELINE ITEM */
const TimelineItem = ({ text, time, active }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View
        style={[
          styles.dot,
          { backgroundColor: active ? "#2e7d32" : "#ccc" },
        ]}
      />
      <View style={styles.line} />
    </View>

    <View style={styles.timelineContent}>
      <Text style={{ fontWeight: active ? "bold" : "normal" }}>{text}</Text>
      <Text style={styles.gray}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 10,
  },

  headerTitle: { fontWeight: "bold", fontSize: 16 },

  code: { color: "#777" },

  successBox: {
    backgroundColor: "#4CAF50",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  successTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  successSub: { color: "#e8f5e9", fontSize: 12 },

  box: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },

  title: { fontWeight: "bold", marginBottom: 10 },

  /* TIMELINE */
  timelineItem: { flexDirection: "row", marginBottom: 15 },

  timelineLeft: { alignItems: "center", marginRight: 10 },

  dot: { width: 10, height: 10, borderRadius: 5 },

  line: { width: 2, height: 40, backgroundColor: "#ccc", marginTop: 2 },

  timelineContent: { flex: 1 },

  /* ITEM */
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  img: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },

  name: { fontWeight: "bold" },

  gray: { color: "#777", fontSize: 12 },

  price: { color: "#2e7d32", fontWeight: "bold" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  total: { color: "#2e7d32", fontWeight: "bold" },

  bold: { fontWeight: "bold" },

  method: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  success: { color: "#2e7d32", fontWeight: "bold" },

  mapBtn: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#e8f5e9",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: 10,
  },

  smallBtn: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  homeBtn: {
    backgroundColor: "#2e7d32",
    margin: 15,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  homeText: { color: "#fff", fontWeight: "bold" },
});