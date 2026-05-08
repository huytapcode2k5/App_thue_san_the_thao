export const FIELD_IMAGES = {
    // ✅ Key từ data.json (FieldListScreen, FieldDetailScreen dùng)
    'bernabeu': require('../assets/bernabeu.jpg'),
    'old': require('../assets/old.jpg'),
    'anfield': require('../assets/anfield.jpg'),
    'etihad': require('../assets/etihad.jpg'),
    // ✅ Key cũ (backward compat nếu có order cũ lưu key này)
    'SanCauLong': require('../assets/SanCauLong.png'),
    'SanBongDa': require('../assets/SanBongDa5Ng.png'),
    'SanTennis': require('../assets/SanTennis.png'),
};

// Fallback nếu không tìm thấy key
export const getFieldImage = (key) =>
    FIELD_IMAGES[key] || FIELD_IMAGES['bernabeu'];