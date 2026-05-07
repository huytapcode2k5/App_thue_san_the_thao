// screens/PaymentScreen.js

import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function PaymentScreen({ navigation, route }) {
  const { cartItems } = useContext(CartContext);

  // 👇 Lấy items từ route nếu có
  const directItems = route.params?.items;

  // 👇 Nếu có params thì dùng params
  // không thì dùng cartItems
  const items =
    directItems && directItems.length > 0
      ? directItems
      : cartItems;

  const [paymentMethod, setPaymentMethod] = useState("MoMo");

  const fee = 15000;

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [items]);

  const total = subtotal + fee;

  const handlePayment = () => {
    

    navigation.navigate("PaymentConfirm", {
      items: items,
      paymentMethod,
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thanh toán</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ADDRESS */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Địa điểm đặt sân</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={22} color="#2e7d32" />

            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.locationName}>
                Trung tâm thể thao Kinetic Pulse
              </Text>

              <Text style={styles.locationAddress}>
                123 Lý Thường Kiệt, TP.HCM
              </Text>
            </View>
          </View>
        </View>

        {/* CART ITEMS */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Chi tiết dịch vụ</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image
                source={images[item.image]}
                style={styles.itemImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>

                <Text style={styles.itemTime}>
                  {item.time || "18:00 - 20:00"}
                </Text>

                <Text style={styles.itemQuantity}>
                  Số lượng: {item.quantity}
                </Text>
              </View>

              <Text style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
          ))}
        </View>

        {/* PAYMENT METHOD */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>
            Phương thức thanh toán
          </Text>

          {/* MOMO */}
          <TouchableOpacity
            style={[
              styles.paymentItem,
              paymentMethod === "MoMo" && styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod("MoMo")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="wallet-outline"
                size={22}
                color="#d81b60"
              />

              <Text style={styles.paymentText}>Ví MoMo</Text>
            </View>

            {paymentMethod === "MoMo" && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color="#2e7d32"
              />
            )}
          </TouchableOpacity>

          {/* CASH */}
          <TouchableOpacity
            style={[
              styles.paymentItem,
              paymentMethod === "Tiền mặt" &&
                styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod("Tiền mặt")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="cash-outline"
                size={22}
                color="#ff9800"
              />

              <Text style={styles.paymentText}>
                Thanh toán tiền mặt
              </Text>
            </View>

            {paymentMethod === "Tiền mặt" && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color="#2e7d32"
              />
            )}
          </TouchableOpacity>

          {/* CARD */}
          <TouchableOpacity
            style={[
              styles.paymentItem,
              paymentMethod === "Ngân hàng" &&
                styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod("Ngân hàng")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="card-outline"
                size={22}
                color="#1565c0"
              />

              <Text style={styles.paymentText}>
                Thẻ ngân hàng
              </Text>
            </View>

            {paymentMethod === "Ngân hàng" && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color="#2e7d32"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* SUMMARY */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Tổng thanh toán</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>

            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString()}đ
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí dịch vụ</Text>

            <Text style={styles.summaryValue}>
              {fee.toLocaleString()}đ
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>

            <Text style={styles.totalValue}>
              {total.toLocaleString()}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>
            Xác nhận thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  box: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  locationAddress: {
    marginTop: 4,
    color: "#777",
    fontSize: 13,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    marginRight: 12,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  itemTime: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  itemQuantity: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  itemPrice: {
    fontWeight: "700",
    color: "#2e7d32",
    fontSize: 14,
  },

  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  paymentActive: {
    borderColor: "#2e7d32",
    backgroundColor: "#f1fff1",
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryLabel: {
    color: "#666",
    fontSize: 14,
  },

  summaryValue: {
    color: "#111",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e7d32",
  },

  bottomContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },

  payButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});