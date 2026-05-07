import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { HistoryContext } from "../screens/HistoryContext";

const STATUS_CONFIG = {
  "ĐÃ THANH TOÁN": {
    bg: "#1565c0",
    color: "#fff",
  },

  "ĐÃ HOÀN THÀNH": {
    bg: "#2e7d32",
    color: "#fff",
  },

  "ĐÃ HỦY": {
    bg: "#c62828",
    color: "#fff",
  },
};

const images = {
  SanCauLong: require("../assets/SanCauLong.png"),
  SanBongDa: require("../assets/SanBongDa5Ng.png"),
  SanTennis: require("../assets/SanTennis.png"),
};

export default function HistoryScreen({ navigation }) {
  const { orders, clearHistory } = useContext(HistoryContext);

  const [activeTab, setActiveTab] = useState("Sân bóng");

  // CHUYỂN DATA TỪ HISTORY
  const historyData = orders.flatMap((order) =>
    order.items.map((item, index) => ({
      id: `${order.id}-${index}`,

      name: item.name,

      time: item.time || "18:00 - 20:00",

      date: order.date,

      price: item.price * item.quantity,

      quantity: item.quantity,

      method: order.method,

      total: order.total,

      status: order.status || "ĐÃ THANH TOÁN",

      image:
        item.image === "SanCauLong"
          ? images.SanCauLong
          : item.image === "SanTennis"
          ? images.SanTennis
          : images.SanBongDa,
    }))
  );

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Lịch sử giao dịch
        </Text>

        <TouchableOpacity onPress={clearHistory}>
          <Ionicons
            name="trash-outline"
            size={22}
            color="red"
          />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      {historyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={80}
            color="#ccc"
          />

          <Text style={styles.emptyTitle}>
            Chưa có giao dịch nào
          </Text>

          <Text style={styles.emptySub}>
            Những đơn đặt sân sau khi thanh toán
            sẽ xuất hiện tại đây
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* STATS */}
          <View style={styles.statsBox}>
            <View style={styles.statsLeft}>
              <Text style={styles.statsNumber}>
                {historyData.length}
              </Text>

              <Text style={styles.statsLabel}>
                Giao dịch đã thanh toán
              </Text>
            </View>

            <View style={styles.statsRight}>
              <Ionicons
                name="football-outline"
                size={38}
                color="#2e7d32"
              />
            </View>
          </View>

          {/* TAB */}
          <View style={styles.tabRow}>
            {["Sân bóng", "Cửa hàng"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  activeTab === tab &&
                    styles.activeTabBtn,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab &&
                      styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TITLE */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              Hoạt động gần đây
            </Text>
          </View>

          {/* CARD */}
          {historyData.map((item) => {
            const statusStyle =
              STATUS_CONFIG[item.status] ||
              STATUS_CONFIG["ĐÃ THANH TOÁN"];

            return (
              <View
                key={item.id}
                style={styles.card}
              >
                {/* IMAGE */}
                <Image
                  source={item.image}
                  style={styles.cardImg}
                />

                {/* STATUS */}
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        statusStyle.bg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          statusStyle.color,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                {/* PRICE */}
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()}
                    đ
                  </Text>
                </View>

                {/* CONTENT */}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>
                    {item.name}
                  </Text>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#777"
                    />

                    <Text style={styles.infoText}>
                      {item.date}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#777"
                    />

                    <Text style={styles.infoText}>
                      {item.time}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="wallet-outline"
                      size={14}
                      color="#777"
                    />

                    <Text style={styles.paymentText}>
                      {item.method}
                    </Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <Text style={styles.quantity}>
                      SL: {item.quantity}
                    </Text>

                    <Text style={styles.total}>
                      Tổng:{" "}
                      {item.total.toLocaleString()}
                      đ
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f3f5f4",
  },

  /* HEADER */
  header: {
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 15,

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

  /* EMPTY */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

  emptySub: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

  /* SCROLL */
  scroll: {
    flex: 1,
    paddingHorizontal: 14,
  },

  /* STATS */
  statsBox: {
    backgroundColor: "#2e7d32",
    marginTop: 15,
    borderRadius: 18,
    padding: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsLeft: {
    flex: 1,
  },

  statsNumber: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "800",
  },

  statsLabel: {
    color: "#d7f5d8",
    marginTop: 5,
    fontSize: 13,
  },

  statsRight: {
    width: 70,
    height: 70,
    borderRadius: 35,

    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",
  },

  /* TAB */
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    borderRadius: 30,
    padding: 4,
    marginTop: 18,
    marginBottom: 16,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },

  activeTabBtn: {
    backgroundColor: "#2e7d32",
  },

  tabText: {
    color: "#666",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

  /* SECTION */
  sectionRow: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",

    elevation: 3,
  },

  cardImg: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },

  badge: {
    position: "absolute",
    top: 12,
    left: 12,

    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  priceTag: {
    position: "absolute",
    top: 12,
    right: 12,

    backgroundColor: "rgba(0,0,0,0.6)",

    paddingHorizontal: 12,
    paddingVertical: 5,

    borderRadius: 8,
  },

  priceText: {
    color: "#fff",
    fontWeight: "700",
  },

  cardBody: {
    padding: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoText: {
    marginLeft: 6,
    color: "#666",
    fontSize: 13,
  },

  paymentText: {
    marginLeft: 6,
    color: "#2e7d32",
    fontWeight: "600",
    fontSize: 13,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  quantity: {
    color: "#777",
    fontWeight: "600",
  },

  total: {
    color: "#2e7d32",
    fontWeight: "700",
    fontSize: 15,
  },
});