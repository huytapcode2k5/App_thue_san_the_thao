import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function CartScreen({ navigation, route }) {
  const [items, setItems] = useState([]);

  // =========================
  // 👉 ADD ITEM từ Shop/Home
  // =========================
  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem;

      // 👉 MAP DATA từ Shop → Cart
      const mappedItem = {
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        image: "SanBongDa", // fallback ảnh
        address: "Sân thể thao trung tâm",
        time: "Tự chọn",
      };

      setItems((prev) => {
        const exist = prev.find((i) => i.id === mappedItem.id);

        if (exist) {
          return prev.map((i) =>
            i.id === mappedItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }

        return [...prev, { ...mappedItem, quantity: 1 }];
      });

      navigation.setParams({ newItem: null });
    }
  }, [route.params?.newItem]);

  // =========================
  // 👉 REBOOK từ History
  // =========================
  useEffect(() => {
    if (route.params?.rebookItems) {
      setItems(
        route.params.rebookItems.map((i) => ({
          ...i,
          quantity: 1,
        }))
      );

      navigation.setParams({ rebookItems: null });
    }
  }, [route.params?.rebookItems]);

  // =========================
  // 👉 CLEAR CART sau thanh toán
  // =========================
  useEffect(() => {
    if (route.params?.clearCart) {
      setItems([]);
      navigation.setParams({ clearCart: false });
    }
  }, [route.params?.clearCart]);

  // =========================
  // 👉 Update số lượng
  // =========================
  const updateQty = (id, type) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let q = type === "inc" ? item.quantity + 1 : item.quantity - 1;
          if (q < 1) q = 1;
          return { ...item, quantity: q };
        }
        return item;
      })
    );
  };

  // =========================
  // 👉 XÓA sản phẩm
  // =========================
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================
  // 👉 TÍNH TIỀN
  // =========================
  const discount = 50000;
  const fee = 15000;

  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const total = subtotal - discount + fee;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="menu" size={22} color="#fff" />
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Image
          source={require("../assets/Avatar.png")}
          style={styles.avatar}
        />
      </View>

      {/* EMPTY */}
      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Chưa có sản phẩm</Text>
          <Text style={styles.emptySub}>
            Hãy quay lại Shop để mua hàng nhé!
          </Text>
        </View>
      ) : (
        <>
          {/* TITLE */}
          <Text style={styles.title}>
            {items.length} sản phẩm trong giỏ
          </Text>

          {/* LIST */}
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={images[item.image] || images.SanBongDa}
                style={styles.image}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.gray}>{item.address}</Text>
                <Text style={styles.gray}>{item.time}</Text>

                <Text style={styles.price}>
                  {item.price.toLocaleString()}đ
                </Text>
              </View>

              <View style={styles.right}>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>

                <View style={styles.qtyBox}>
                  <TouchableOpacity onPress={() => updateQty(item.id, "dec")}>
                    <Text>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qty}>{item.quantity}</Text>

                  <TouchableOpacity onPress={() => updateQty(item.id, "inc")}>
                    <Text style={{ color: "#2e7d32" }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* SUMMARY */}
          <View style={styles.summary}>
            <Text style={styles.bold}>Tóm tắt đơn hàng</Text>

            <Row label="Tạm tính" value={subtotal} />
            <Row label="Giảm giá" value={-discount} discount />
            <Row label="Phí dịch vụ" value={fee} />

            <View style={styles.totalRow}>
              <Text style={styles.bold}>Tổng</Text>
              <Text style={styles.total}>
                {total.toLocaleString()}đ
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Payment", { items })}
          >
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

// ================= ROW =================
const Row = ({ label, value, discount }) => (
  <View style={styles.row}>
    <Text>{label}</Text>
    <Text style={{ color: discount ? "red" : "#000" }}>
      {value < 0 ? "- " : ""}
      {Math.abs(value).toLocaleString()}đ
    </Text>
  </View>
);

// ================= STYLE =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2e7d32",
    padding: 15,
    alignItems: "center",
  },

  headerTitle: { color: "#fff", fontWeight: "bold" },

  avatar: { width: 35, height: 35, borderRadius: 20 },

  emptyBox: { marginTop: 100, alignItems: "center" },

  emptyIcon: { fontSize: 60 },

  emptyTitle: { fontWeight: "bold", fontSize: 18, color: "#2e7d32" },

  emptySub: { color: "#777" },

  title: { margin: 15, fontWeight: "bold" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 15,
    padding: 10,
    borderRadius: 10,
  },

  image: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },

  name: { fontWeight: "bold" },

  gray: { color: "#777", fontSize: 12 },

  price: { color: "#2e7d32", fontWeight: "bold" },

  right: { justifyContent: "space-between", alignItems: "flex-end" },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qty: { marginHorizontal: 5 },

  summary: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  total: { color: "#2e7d32", fontWeight: "bold" },

  button: {
    backgroundColor: "#2e7d32",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },
});