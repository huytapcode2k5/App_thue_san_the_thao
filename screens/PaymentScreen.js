import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function PaymentScreen({ navigation, route }) {
  const { items = [] } = route.params || {};
  const [method, setMethod] = useState("momo");

  const fee = 15000;
  const discount = 150000;

  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const [editing, setEditing] = useState(false);

const [name, setName] = useState("Nguyễn Văn A");
const [phone, setPhone] = useState("0901234567");
const [address, setAddress] = useState("Landmark 81");
const [city, setCity] = useState("TP. Hồ Chí Minh");
  const total = subtotal + fee - discount;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={22}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* ADDRESS */}
      <View style={styles.box}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Địa chỉ nhận hàng</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
  <Text style={styles.change}>
    {editing ? "Lưu" : "Thay đổi"}
  </Text>
</TouchableOpacity>
        </View>

        {editing ? (
  <>
    <TextInput
      value={name}
      onChangeText={setName}
      placeholder="Tên"
      style={styles.input}
    />

    <TextInput
      value={phone}
      onChangeText={setPhone}
      placeholder="SĐT"
      keyboardType="phone-pad"
      style={styles.input}
    />

    <TextInput
      value={address}
      onChangeText={setAddress}
      placeholder="Địa chỉ"
      style={styles.input}
    />

    <TextInput
      value={city}
      onChangeText={setCity}
      placeholder="Thành phố"
      style={styles.input}
    />
  </>
) : (
  <>
    <Text style={styles.bold}>
      {name} - {phone}
    </Text>
    <Text style={styles.gray}>{address}</Text>
    <Text style={styles.gray}>{city}</Text>
  </>
)}
      </View>

      {/* PRODUCTS */}
      <View style={styles.box}>
        <Text style={styles.title}>Sản phẩm</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.product}>
            <Image source={images[item.image]} style={styles.img} />

            <View style={{ flex: 1 }}>
              <Text style={styles.bold}>{item.name}</Text>
              <Text style={styles.gray}>{item.time}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()}đ
              </Text>
            </View>

            <Text>x{item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* SHIPPING */}
      <View style={styles.box}>
        <Text style={styles.title}>Phương thức vận chuyển</Text>

        <View style={styles.ship}>
          <Ionicons name="bicycle-outline" size={20} />
          <View style={{ marginLeft: 10 }}>
            <Text>Giao nhanh (2-3 giờ)</Text>
            <Text style={styles.gray}>Nhận trong ngày</Text>
          </View>
          <Text>{fee.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* VOUCHER */}
      <View style={styles.voucher}>
        <TextInput placeholder="Nhập mã giảm giá" style={{ flex: 1 }} />
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={{ color: "#fff" }}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      {/* PAYMENT METHOD */}
      <View style={styles.box}>
        <Text style={styles.title}>Phương thức thanh toán</Text>

        {renderMethod("momo", "Ví MoMo", method, setMethod)}
        {renderMethod("zalo", "ZaloPay", method, setMethod)}
        {renderMethod("card", "Visa / Mastercard", method, setMethod)}
      </View>

      {/* SUMMARY */}
      <View style={styles.box}>
        <Text style={styles.title}>Chi tiết thanh toán</Text>

        <Row label="Tạm tính" value={subtotal} />
        <Row label="Phí vận chuyển" value={fee} />
        <Row label="Giảm giá" value={-discount} red />

        <View style={styles.totalRow}>
          <Text style={styles.bold}>Tổng cộng</Text>
          <Text style={styles.total}>
            {total.toLocaleString()}đ
          </Text>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
  style={styles.orderBtn}
  onPress={() =>
    navigation.navigate("PaymentConfirm", {
      items,
      total,
      method,
    })
  }
>
  <Text style={styles.orderText}>Đặt hàng</Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const renderMethod = (key, label, method, setMethod) => (
  <TouchableOpacity
    style={[
      styles.method,
      method === key && styles.methodActive,
    ]}
    onPress={() => setMethod(key)}
  >
    <Text>{label}</Text>
    {method === key && (
      <Ionicons name="checkmark-circle" color="#2e7d32" size={18} />
    )}
  </TouchableOpacity>
);

const Row = ({ label, value, red }) => (
  <View style={styles.rowBetween}>
    <Text>{label}</Text>
    <Text style={{ color: red ? "red" : "#000" }}>
      {value < 0 ? "- " : ""}
      {Math.abs(value).toLocaleString()}đ
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },

  headerTitle: { fontWeight: "bold", fontSize: 16 },

  box: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },

  title: { fontWeight: "bold", marginBottom: 10 },

  bold: { fontWeight: "bold" },

  gray: { color: "#777", fontSize: 12 },

  change: { color: "#2e7d32" },

  product: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  img: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },

  price: { color: "#2e7d32", fontWeight: "bold" },

  ship: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eef7ee",
    padding: 10,
    borderRadius: 10,
  },

  voucher: {
    flexDirection: "row",
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
  },

  applyBtn: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
  },

  method: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginTop: 8,
  },

  methodActive: {
    borderColor: "#2e7d32",
    borderWidth: 1.5,
    backgroundColor: "#e8f5e9",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  total: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 16,
  },

  orderBtn: {
    backgroundColor: "#0a7d2c",
    margin: 15,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  orderText: { color: "#fff", fontWeight: "bold" },
  input: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 8,
  marginBottom: 8,
},
});

