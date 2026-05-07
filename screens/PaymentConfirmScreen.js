import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { HistoryContext } from "../screens/HistoryContext";
import { CartContext } from "../screens/CartContext";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function PaymentConfirmScreen({ route }) {
  const navigation = useNavigation();

  const { addOrder } = useContext(HistoryContext);
  const { clearCart } = useContext(CartContext);

  const items = route.params?.items || [];

  const fee = 15000;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + fee;

  // HANDLE BACK HOME
  const handleBackHome = () => {
    const order = {
      id: Date.now(),
      code: Math.floor(Math.random() * 99999),
      date: new Date().toLocaleDateString(),

      items: items.map((item) => ({
        ...item,
        image: item.image || "SanBongDa",
        time: item.time || "18:00 - 20:00",
      })),

      total: total,
      method: "Ví MoMo",
      status: "ĐÃ THANH TOÁN",
    };

    // Lưu lịch sử
    addOrder(order);

    // Xóa giỏ hàng
    clearCart();

    // Reset về Home
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <Text style={styles.code}>#{Math.floor(Math.random() * 99999)}</Text>
      </View>

      {/* SUCCESS */}
      <View style={styles.successBox}>
        <View>
          <Text style={styles.successTitle}>ĐÃ XÁC NHẬN</Text>
          <Text style={styles.successSub}>
            Thanh toán thành công
          </Text>
        </View>

        <Ionicons
          name="checkmark-circle"
          size={34}
          color="#fff"
        />
      </View>

      {/* TIMELINE */}
      <View style={styles.box}>
        <Text style={styles.title}>Tiến độ đơn hàng</Text>

        <TimelineItem
          active
          text="Đặt sân thành công"
          time="06:46 AM"
        />

        <TimelineItem
          active
          text="Đã thanh toán"
          time="10:48 AM"
        />

        <TimelineItem
          text="Hoàn tất"
          time="Sau khi kết thúc trận"
        />
      </View>

      {/* ITEMS */}
      <View style={styles.box}>
        <Text style={styles.title}>Chi tiết dịch vụ</Text>

        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image
              source={images[item.image]}
              style={styles.img}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.gray}>
                {item.time || "18:00 - 20:00"}
              </Text>

              <Text style={styles.gray}>
                SL: {item.quantity}
              </Text>
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
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {total.toLocaleString()}đ
          </Text>
        </View>
      </View>

      {/* PAYMENT */}
      <View style={styles.box}>
        <Text style={styles.title}>
          Phương thức thanh toán
        </Text>

        <View style={styles.method}>
          <View style={styles.methodLeft}>
            <Ionicons
              name="wallet-outline"
              size={20}
              color="#2e7d32"
            />

            <Text style={styles.methodText}>
              Ví điện tử MoMo
            </Text>
          </View>

          <Text style={styles.success}>
            Đã thanh toán
          </Text>
        </View>
      </View>

      {/* LOCATION */}
      <View style={styles.box}>
        <Text style={styles.title}>Địa điểm</Text>

        <Text style={styles.bold}>
          Trung tâm thể thao Kinetic Pulse
        </Text>

        <Text style={styles.gray}>
          123 Lý Thường Kiệt, TP.HCM
        </Text>

        <TouchableOpacity style={styles.mapBtn}>
          <Ionicons
            name="navigate-outline"
            size={16}
            color="#2e7d32"
          />

          <Text style={styles.mapText}>
            Chỉ đường
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTION */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons
            name="call-outline"
            size={16}
            color="#333"
          />

          <Text style={styles.actionText}>
            Gọi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color="#333"
          />

          <Text style={styles.actionText}>
            Nhắn tin
          </Text>
        </TouchableOpacity>
      </View>

      {/* BACK HOME */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={handleBackHome}
      >
        <Text style={styles.homeText}>
          Về trang chủ
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* TIMELINE */
const TimelineItem = ({ text, time, active }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: active
              ? "#2e7d32"
              : "#ccc",
          },
        ]}
      />

      <View style={styles.line} />
    </View>

    <View style={styles.timelineContent}>
      <Text
        style={{
          fontWeight: active ? "700" : "400",
        }}
      >
        {text}
      </Text>

      <Text style={styles.gray}>
        {time}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 10,
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },

  code: {
    color: "#777",
  },

  successBox: {
    backgroundColor: "#2e7d32",
    margin: 15,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  successTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  successSub: {
    color: "#dcedc8",
    marginTop: 4,
  },

  box: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 14,
  },

  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 12,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 15,
  },

  timelineLeft: {
    alignItems: "center",
    marginRight: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  line: {
    width: 2,
    height: 42,
    backgroundColor: "#ccc",
    marginTop: 2,
  },

  timelineContent: {
    flex: 1,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontWeight: "700",
    fontSize: 14,
  },

  gray: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  price: {
    color: "#2e7d32",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  totalLabel: {
    fontWeight: "bold",
    fontSize: 15,
  },

  totalPrice: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 16,
  },

  bold: {
    fontWeight: "bold",
    fontSize: 14,
  },

  method: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  methodText: {
    marginLeft: 8,
    fontWeight: "600",
  },

  success: {
    color: "#2e7d32",
    fontWeight: "bold",
  },

  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#e8f5e9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  mapText: {
    marginLeft: 5,
    color: "#2e7d32",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: 10,
  },

  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  actionText: {
    marginLeft: 6,
    fontWeight: "600",
  },

  homeBtn: {
    backgroundColor: "#2e7d32",
    margin: 15,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  homeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});