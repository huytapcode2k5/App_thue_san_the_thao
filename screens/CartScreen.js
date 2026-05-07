import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useContext(CartContext);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fee = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + fee;

  // =========================
  // EMPTY CART
  // =========================
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={90} color="#bbb" />

        <Text style={styles.emptyTitle}>
          Giỏ hàng đang trống
        </Text>

        <Text style={styles.emptySub}>
          Hãy đặt sân để tiếp tục
        </Text>

        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.shopBtnText}>
            Quay về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =========================
  // MAIN
  // =========================
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>

        <Text style={styles.itemCount}>
          {cartItems.length} sản phẩm
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 250 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* IMAGE */}
            <Image
              source={
                images[item.image] ||
                require("../assets/SanBongDa5Ng.png")
              }
              style={styles.image}
            />

            {/* INFO */}
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.time}>
                {item.time || "18:00 - 20:00"}
              </Text>

              <Text style={styles.price}>
                {item.price.toLocaleString()}đ
              </Text>

              {/* QUANTITY */}
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(
                      item.id,
                      item.quantity - 1
                    )
                  }
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>

                <Text style={styles.qtyText}>
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(
                      item.id,
                      item.quantity + 1
                    )
                  }
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* DELETE */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeFromCart(item.id)}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="red"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* FOOTER */}
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
          <Text style={styles.totalLabel}>
            Tổng cộng
          </Text>

          <Text style={styles.totalPrice}>
            {total.toLocaleString()}đ
          </Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.paymentBtn}
          onPress={() =>
            navigation.navigate("Payment", {
              items: cartItems,
            })
          }
        >
          <Text style={styles.paymentText}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // HEADER
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  itemCount: {
    color: "#777",
    fontSize: 13,
  },

  // CARD
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 12,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
  },

  time: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },

  // QUANTITY
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    marginHorizontal: 15,
    fontWeight: "bold",
    fontSize: 15,
  },

  // DELETE
  deleteBtn: {
    justifyContent: "center",
    paddingLeft: 10,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  gray: {
    color: "#777",
  },

  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },

  totalPrice: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#2e7d32",
  },

  paymentBtn: {
    marginTop: 15,
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  paymentText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // EMPTY
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptySub: {
    color: "#777",
    marginTop: 8,
    marginBottom: 25,
  },

  shopBtn: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
  },

  shopBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});