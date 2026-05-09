export const PRODUCT_IMAGES = {
    Ao_bongda_01: require('../assets/Áo_bongda_01.jpg'),
    Bong_da_01: require('../assets/Bóng_đá_01.jpg'),
    Bong_da_02: require('../assets/Bóng_đá_02.jpg'),
    Bong_da_03: require('../assets/Bóng_đá_03.jpg'),
    Bong_tennis_01: require('../assets/Bóng_tennis_01.jpeg'),
    Quan_ao_bd_02: require('../assets/Quần_áo_bd_02.png'),
    Quanao_bongda_03: require('../assets/Quanao_bongda_03.jpg'),
    Vot_caulong_01: require('../assets/Vợt_caulong_01.jpg'),
    Vot_caulong_02: require('../assets/Vợt_caulong_02.jpg'),
    Vot_caulong_03: require('../assets/Vợt_caulong_03.jpg'),
    Vot_pickball_01: require('../assets/Vợt_pickball_01.png'),
    Vot_pickball_02: require('../assets/Vợt_pickball_02.jpg'),
};

// productsData.js - sửa category của từng sản phẩm

export const PRODUCTS = [
    {
        id: '1',
        name: 'Áo Đấu Real Madrid Ronaldo #7 UCL',
        price: 320000, originalPrice: 450000,
        rating: 4.9, reviews: 214,
        image: 'Ao_bongda_01',
        category: 'ao',  // ← sửa từ '2' thành 'ao'
        badge: 'HOT',
        description: '...',
    },
    {
        id: '2',
        name: 'Bộ Quần Áo Bóng Đá Jogarbola Xanh',
        price: 280000, originalPrice: 350000,
        rating: 4.6, reviews: 98,
        image: 'Quan_ao_bd_02',
        category: 'ao',  // ← sửa từ '2' thành 'ao'
        badge: 'NEW',
        description: '...',
    },
    {
        id: '3',
        name: 'Bộ Quần Áo Đội Tuyển Việt Nam 2022',
        price: 250000, originalPrice: null,
        rating: 4.8, reviews: 432,
        image: 'Quanao_bongda_03',
        category: 'ao',  // ← sửa từ '2' thành 'ao'
        badge: 'HOT',
        description: '...',
    },
    {
        id: '4',
        name: 'Bóng Đá Tiêu Chuẩn Size 5',
        price: 150000, originalPrice: 200000,
        rating: 4.5, reviews: 310,
        image: 'Bong_da_01',
        category: 'bong',  // ← sửa từ '6' thành 'bong'
        badge: 'SALE',
        description: '...',
    },
    {
        id: '5',
        name: 'Bóng Đá Kamito Grand Pro',
        price: 220000, originalPrice: 280000,
        rating: 4.7, reviews: 187,
        image: 'Bong_da_02',
        category: 'bong',  // ← sửa từ '6' thành 'bong'
        badge: null,
        description: '...',
    },
    {
        id: '6',
        name: 'Bóng Đá Động Lực Hàng Việt Nam',
        price: 180000, originalPrice: null,
        rating: 4.6, reviews: 256,
        image: 'Bong_da_03',
        category: 'bong',  // ← sửa từ '6' thành 'bong'
        badge: null,
        description: '...',
    },
    {
        id: '7',
        name: 'Vợt Cầu Lông Carbon Pro Xanh',
        price: 850000, originalPrice: 1100000,
        rating: 4.7, reviews: 143,
        image: 'Vot_caulong_01',
        category: 'vot',  // ← sửa từ '7' thành 'vot'
        badge: 'SALE',
        description: '...',
    },
    {
        id: '8',
        name: 'Vợt Cầu Lông Kamito Neon Yellow',
        price: 750000, originalPrice: 950000,
        rating: 4.8, reviews: 201,
        image: 'Vot_caulong_02',
        category: 'vot',  // ← sửa từ '7' thành 'vot'
        badge: 'HOT',
        description: '...',
    },
    {
        id: '9',
        name: 'Bộ Đôi Vợt Cầu Lông Bokai 88',
        price: 420000, originalPrice: 580000,
        rating: 4.4, reviews: 89,
        image: 'Vot_caulong_03',
        category: 'vot',  // ← sửa từ '7' thành 'vot'
        badge: 'SALE',
        description: '...',
    },
    {
        id: '10',
        name: 'Vợt Pickleball Jogarbola Solus Carbon',
        price: 1850000, originalPrice: 2200000,
        rating: 4.9, reviews: 67,
        image: 'Vot_pickball_01',
        category: 'vot',  // ← sửa từ '8' thành 'vot'
        badge: 'HOT',
        description: '...',
    },
    {
        id: '11',
        name: 'Vợt Pickleball JOOLA Perseus Ben Johns',
        price: 2450000, originalPrice: 2800000,
        rating: 4.9, reviews: 124,
        image: 'Vot_pickball_02',
        category: 'vot',  // ← sửa từ '8' thành 'vot'
        badge: 'NEW',
        description: '...',
    },
    {
        id: '12',
        name: 'Bóng Tennis Penn Coach (Hộp 3 quả)',
        price: 95000, originalPrice: 120000,
        rating: 4.5, reviews: 389,
        image: 'Bong_tennis_01',
        category: 'bong',  // ← sửa từ '9' thành 'bong'
        badge: 'SALE',
        description: '...',
    },
];