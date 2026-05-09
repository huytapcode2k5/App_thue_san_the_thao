// services/fieldImages.js
// Chỉ dùng file ảnh tên không dấu, không khoảng trắng

export const FIELD_IMAGES = {
    // ── Bóng đá ──────────────────────────────────────────────────
    'san_bd_anhduong': require('../assets/bernabeu.jpg'),
    'san_bd_thongnhat': require('../assets/anfield.jpg'),
    'san_bd_phutho': require('../assets/old.jpg'),
    'san_bd_taodан': require('../assets/bernabeu.jpg'),

    // ── Cầu lông ─────────────────────────────────────────────────
    'san_cl_nguyendu': require('../assets/Sân cầu lông CG.jpg'),
    'san_cl_diamond': require('../assets/Sân cầu lông HK.jpg'),
    'san_cl_tinhnhue': require('../assets/Sân cầu lông Lángha.jpg'),
    'san_cl_sky': require('../assets/SanCauLong.png'),

    // ── Tennis ────────────────────────────────────────────────────
    'san_tennis_phutho': require('../assets/Sân tennis Khánh Duy.png'),
    'san_tennis_pro': require('../assets/Sân tennis Đô thị Việt Hưng.jpg'),
    'san_tennis_kyhieu': require('../assets/Sân tennis Hoàng Mai.jpg'),
    'san_tennis_green': require('../assets/SanTennis.png'),

    // ── Bóng rổ ───────────────────────────────────────────────────
    'san_bongro_thd': require('../assets/thi-cong-san-bong-ro-2.jpg'),
    'san_bongro_nba': require('../assets/Thi-cong-san-bong-ro.jpg'),
    'san_bongro_leloi': require('../assets/1-san-bong-ro-sai-gon-1.png'),
    'san_bongro_slam': require('../assets/san-bong-ro-ha-noi-3.jpg'),

    // ── Backward compat ───────────────────────────────────────────
    'bernabeu': require('../assets/bernabeu.jpg'),
    'old': require('../assets/old.jpg'),
    'anfield': require('../assets/anfield.jpg'),
    'etihad': require('../assets/etihad.jpg'),
    'SanCauLong': require('../assets/SanCauLong.png'),
    'SanBongDa': require('../assets/SanBongDa5Ng.png'),
    'SanTennis': require('../assets/SanTennis.png'),
};

export const getFieldImage = (key) =>
    FIELD_IMAGES[key] || FIELD_IMAGES['bernabeu'];