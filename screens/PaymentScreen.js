// screens/PaymentScreen.js
import React, { useContext, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Modal, KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import { PRODUCT_IMAGES } from "../services/productsData";
import { getFieldImage } from "../services/fieldImages";

const getImage = (key, type) => {
  if (type === "field") return getFieldImage(key);
  return PRODUCT_IMAGES[key] || getFieldImage(key);
};

export default function PaymentScreen({ navigation, route }) {
  const { cartItems } = useContext(CartContext);
  const directItems = route.params?.items;
  const items = directItems && directItems.length > 0 ? directItems : cartItems;

  const [paymentMethod, setPaymentMethod] = useState("MoMo");
  const fee = 15000;

  // ── Địa chỉ có thể chỉnh sửa ──────────────────────────────────
  const [address, setAddress] = useState({
    name: "Trung tâm thể thao Kinetic Pulse",
    street: "123 Lý Thường Kiệt",
    city: "TP.HCM",
    note: "",
  });
  const [showModal, setShowModal] = useState(false);
  // State tạm trong modal (chỉ apply khi bấm Lưu)
  const [draft, setDraft] = useState({ ...address });

  const openEdit = () => {
    setDraft({ ...address });
    setShowModal(true);
  };
  const saveEdit = () => {
    setAddress({ ...draft });
    setShowModal(false);
  };

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const total = subtotal + fee;

  const handlePayment = () => {
    navigation.navigate("PaymentConfirm", { items, paymentMethod, address });
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {/* ĐỊA ĐIỂM — có nút chỉnh sửa */}
        <View style={styles.box}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>📍 Địa điểm</Text>
            <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
              <Ionicons name="create-outline" size={16} color="#2e7d32" />
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={20} color="#2e7d32" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationName}>{address.name}</Text>
              <Text style={styles.locationAddress}>{address.street}, {address.city}</Text>
              {address.note ? (
                <Text style={styles.locationNote}>📝 {address.note}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* CHI TIẾT ĐƠN HÀNG */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image
                source={getImage(item.image, item.type)}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: item.type === "field" ? "#e8f5e9" : "#e3f2fd" }
                ]}>
                  <Text style={[styles.typeBadgeText, { color: item.type === "field" ? "#2e7d32" : "#1565c0" }]}>
                    {item.type === "field" ? "🏟️ Đặt sân" : "🛍️ Sản phẩm"}
                  </Text>
                </View>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                {item.size ? <Text style={styles.itemMeta}>Size: {item.size}</Text> : null}
                {item.time ? <Text style={styles.itemMeta}>⏰ {item.time}</Text> : null}
                <Text style={styles.itemMeta}>Số lượng: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
            </View>
          ))}
        </View>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {[
            { key: "MoMo", icon: "wallet-outline", color: "#d81b60", label: "Ví MoMo" },
            { key: "Tiền mặt", icon: "cash-outline", color: "#ff9800", label: "Tiền mặt" },
            { key: "Ngân hàng", icon: "card-outline", color: "#1565c0", label: "Thẻ ngân hàng" },
          ].map(m => (
            <TouchableOpacity
              key={m.key}
              style={[styles.paymentItem, paymentMethod === m.key && styles.paymentActive]}
              onPress={() => setPaymentMethod(m.key)}
            >
              <View style={styles.paymentLeft}>
                <Ionicons name={m.icon} size={22} color={m.color} />
                <Text style={styles.paymentText}>{m.label}</Text>
              </View>
              {paymentMethod === m.key && <Ionicons name="checkmark-circle" size={22} color="#2e7d32" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* TỔNG */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Tổng thanh toán</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tạm tính</Text><Text>{subtotal.toLocaleString()}đ</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Phí dịch vụ</Text><Text>{fee.toLocaleString()}đ</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>

      </ScrollView>

      {/* NÚT THANH TOÁN */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </View>

      {/* ── MODAL CHỈNH SỬA ĐỊA CHỈ ─────────────────────────────── */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalSheet}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa địa chỉ</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Tên địa điểm */}
              <Text style={styles.inputLabel}>Tên địa điểm</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={draft.name}
                  onChangeText={v => setDraft(d => ({ ...d, name: v }))}
                  placeholder="Tên địa điểm"
                  placeholderTextColor="#bbb"
                />
              </View>

              {/* Địa chỉ đường */}
              <Text style={styles.inputLabel}>Số nhà, tên đường</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="map-outline" size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={draft.street}
                  onChangeText={v => setDraft(d => ({ ...d, street: v }))}
                  placeholder="VD: 123 Lý Thường Kiệt"
                  placeholderTextColor="#bbb"
                />
              </View>

              {/* Thành phố */}
              <Text style={styles.inputLabel}>Thành phố / Quận</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={draft.city}
                  onChangeText={v => setDraft(d => ({ ...d, city: v }))}
                  placeholder="VD: TP.HCM"
                  placeholderTextColor="#bbb"
                />
              </View>

              {/* Ghi chú */}
              <Text style={styles.inputLabel}>Ghi chú (tuỳ chọn)</Text>
              <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingTop: 12 }]}>
                <Ionicons name="chatbox-outline" size={18} color="#aaa" style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: "top" }]}
                  value={draft.note}
                  onChangeText={v => setDraft(d => ({ ...d, note: v }))}
                  placeholder="Ghi chú thêm cho người giao hàng..."
                  placeholderTextColor="#bbb"
                  multiline
                />
              </View>

              {/* Nút Lưu */}
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>💾 Lưu địa chỉ</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { paddingTop: 55, paddingBottom: 15, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  box: { backgroundColor: "#fff", marginHorizontal: 15, marginTop: 15, padding: 15, borderRadius: 16 },

  // Section row với nút edit
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#e8f5e9", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  editBtnText: { fontSize: 13, color: "#2e7d32", fontWeight: "600" },

  // Location
  locationRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  locationIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#e8f5e9", justifyContent: "center", alignItems: "center" },
  locationName: { fontSize: 15, fontWeight: "700", color: "#111" },
  locationAddress: { marginTop: 3, color: "#777", fontSize: 13 },
  locationNote: { marginTop: 3, color: "#2e7d32", fontSize: 12 },

  // Items
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  itemImage: { width: 75, height: 75, borderRadius: 12, marginRight: 12 },
  typeBadge: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
  typeBadgeText: { fontSize: 10, fontWeight: "700" },
  itemName: { fontSize: 14, fontWeight: "700", color: "#111" },
  itemMeta: { marginTop: 3, fontSize: 12, color: "#666" },
  itemPrice: { fontWeight: "700", color: "#2e7d32", fontSize: 14 },

  // Payment methods
  paymentItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, marginBottom: 12 },
  paymentActive: { borderColor: "#2e7d32", backgroundColor: "#f1fff1" },
  paymentLeft: { flexDirection: "row", alignItems: "center" },
  paymentText: { marginLeft: 10, fontSize: 14, fontWeight: "600" },

  // Summary
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { color: "#666", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#111" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#2e7d32" },

  // Bottom
  bottomContainer: { padding: 15, backgroundColor: "#fff" },
  payButton: { backgroundColor: "#2e7d32", paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  payButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111" },

  // Inputs
  inputLabel: { fontSize: 12, fontWeight: "700", color: "#888", letterSpacing: 0.5, marginBottom: 6, marginTop: 14 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 12, borderWidth: 1, borderColor: "#eee", paddingHorizontal: 12, minHeight: 50 },
  inputIcon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 14, color: "#333" },

  // Save button
  saveBtn: { backgroundColor: "#2e7d32", borderRadius: 30, height: 52, justifyContent: "center", alignItems: "center", marginTop: 24 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});