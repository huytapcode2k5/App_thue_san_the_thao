import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PRODUCT_IMAGES } from "../services/productsData";
import {
  FIELD_IMAGES,
  getFieldImage,
} from "../services/fieldImages";

const FIELD_IMAGE_KEYS = Object.keys(FIELD_IMAGES);

// ✅ xác định loại
const getType = (item) => {
  if (item.type === "field" || item.type === "product")
    return item.type;

  if (item.time) return "field";

  if (
    item.size !== undefined &&
    item.size !== null
  )
    return "product";

  if (FIELD_IMAGE_KEYS.includes(item.image))
    return "field";

  return "product";
};

// ✅ lấy ảnh đúng
const getImage = (key, type) => {
  if (type === "field") {
    return getFieldImage(key);
  }

  return PRODUCT_IMAGES[key] || getFieldImage(key);
};

export default function HistoryDetailScreen({
  navigation,
  route,
}) {
  const { order } = route.params;

  const type = getType(order);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Chi tiết đơn hàng
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={getImage(order.image, type)}
        style={styles.image}
      />

      {/* INFO */}
      <View style={styles.box}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                type === "field"
                  ? "#e8f5e9"
                  : "#e3f2fd",
            },
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              {
                color:
                  type === "field"
                    ? "#2e7d32"
                    : "#1565c0",
              },
            ]}
          >
            {type === "field"
              ? "🏟️ Đặt sân"
              : "🛍️ Sản phẩm"}
          </Text>
        </View>

        <Text style={styles.name}>{order.name}</Text>

        <View style={styles.row}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#666"
          />
          <Text style={styles.text}>
            {order.date}
          </Text>
        </View>

        {order.time ? (
          <View style={styles.row}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#666"
            />
            <Text style={styles.text}>
              {order.time}
            </Text>
          </View>
        ) : null}

        {order.size ? (
          <View style={styles.row}>
            <Ionicons
              name="resize-outline"
              size={18}
              color="#666"
            />
            <Text style={styles.text}>
              Size: {order.size}
            </Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <Ionicons
            name="wallet-outline"
            size={18}
            color="#666"
          />
          <Text style={styles.text}>
            {order.method}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color="#2e7d32"
          />
          <Text
            style={[
              styles.text,
              {
                color: "#2e7d32",
                fontWeight: "700",
              },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {/* PRICE */}
      <View style={styles.box}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Tổng thanh toán
          </Text>

          <Text style={styles.totalPrice}>
            {order.price.toLocaleString()}đ
          </Text>
        </View>
      </View>
    </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  box: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 16,
    padding: 16,
  },

  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  text: {
    marginLeft: 10,
    color: "#444",
    fontSize: 14,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e7d32",
  },
});