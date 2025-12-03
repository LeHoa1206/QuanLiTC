-- =====================================================
-- PET MANAGEMENT SYSTEM - COMPLETE DATABASE
-- Schema + Full Sample Data
-- Import file này vào phpMyAdmin để có database hoàn chỉnh
-- =====================================================

-- Drop and create database
DROP DATABASE IF EXISTS pet_management;
CREATE DATABASE pet_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pet_management;

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- TABLES CREATION
-- =====================================================

-- 1. Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'sales', 'customer') NOT NULL DEFAULT 'customer',
    avatar VARCHAR(500),
    address TEXT,
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- 2. Customer profiles
CREATE TABLE customer_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    address TEXT,
    city VARCHAR(100),
    loyalty_points INT DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    vip_level ENUM('normal', 'silver', 'gold', 'platinum') DEFAULT 'normal',
    notes TEXT,
    allergies TEXT,
    preferences TEXT,
    last_purchase_date TIMESTAMP NULL,
    favorite_products TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Pets
CREATE TABLE pets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('dog', 'cat', 'bird', 'rabbit', 'other') NOT NULL,
    breed VARCHAR(100),
    age INT,
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 4. Product categories
CREATE TABLE product_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Products
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    sale_price DECIMAL(15,2),
    stock_quantity INT DEFAULT 0,
    main_image VARCHAR(500),
    rating_average DECIMAL(3,2) DEFAULT 0,
    sold_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    wishlist_count INT DEFAULT 0,
    low_stock_alert INT DEFAULT 10,
    supplier VARCHAR(255),
    weight DECIMAL(10,2),
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Service categories
CREATE TABLE service_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Services
CREATE TABLE services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500) NULL COMMENT 'URL hình ảnh dịch vụ',
    price DECIMAL(15,2) NOT NULL,
    duration INT NOT NULL COMMENT 'Minutes',
    max_bookings_per_day INT DEFAULT 10,
    requires_deposit BOOLEAN DEFAULT FALSE,
    deposit_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Appointments
CREATE TABLE appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL COMMENT 'User đặt lịch',
    customer_id BIGINT UNSIGNED NULL,
    pet_id BIGINT UNSIGNED NULL,
    pet_name VARCHAR(100) NULL COMMENT 'Tên thú cưng',
    pet_type VARCHAR(50) NULL COMMENT 'Loại thú cưng',
    pet_age INT NULL COMMENT 'Tuổi (tháng)',
    pet_weight DECIMAL(5,2) NULL COMMENT 'Cân nặng (kg)',
    service_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL COMMENT 'Giờ hẹn (HH:MM)',
    customer_name VARCHAR(100) NULL COMMENT 'Tên khách hàng',
    phone VARCHAR(20) NULL COMMENT 'Số điện thoại',
    email VARCHAR(100) NULL COMMENT 'Email',
    address TEXT NULL COMMENT 'Địa chỉ',
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    price DECIMAL(15,2) NULL,
    notes TEXT,
    confirmed_by BIGINT UNSIGNED NULL COMMENT 'Staff xác nhận',
    confirmed_at TIMESTAMP NULL,
    rejection_reason TEXT COMMENT 'Lý do từ chối',
    rejected_by BIGINT UNSIGNED NULL,
    rejected_at TIMESTAMP NULL,
    completed_by BIGINT UNSIGNED NULL COMMENT 'Staff hoàn thành',
    completed_at TIMESTAMP NULL,
    customer_rating INT NULL CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (confirmed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_date (appointment_date)
) ENGINE=InnoDB;

-- 9. Orders
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    sales_staff_id BIGINT UNSIGNED,
    subtotal DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'bank_transfer', 'vnpay', 'momo') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    created_by BIGINT UNSIGNED COMMENT 'Người tạo đơn',
    created_by_role ENUM('customer', 'sales', 'admin') DEFAULT 'customer',
    invoice_number VARCHAR(50) UNIQUE COMMENT 'Số hóa đơn',
    printed_at TIMESTAMP NULL COMMENT 'Thời gian in hóa đơn',
    printed_by BIGINT UNSIGNED COMMENT 'Người in hóa đơn',
    voucher_code VARCHAR(50),
    return_requested BOOLEAN DEFAULT FALSE,
    return_reason TEXT,
    return_status ENUM('none', 'requested', 'approved', 'rejected', 'completed') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sales_staff_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (printed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_status (order_status),
    INDEX idx_customer (customer_id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB;
-- 11. Shopping cart
CREATE TABLE shopping_cart (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart (customer_id, product_id)
) ENGINE=InnoDB;

-- 12. Reviews (sử dụng user_id trực tiếp)
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    reviewable_type ENUM('product', 'service') NOT NULL,
    reviewable_id BIGINT UNSIGNED NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    reply_text TEXT NULL,
    staff_response TEXT COMMENT 'Phản hồi từ staff',
    responded_at TIMESTAMP NULL,
    responded_by BIGINT UNSIGNED COMMENT 'Staff phản hồi',
    is_verified_purchase BOOLEAN DEFAULT FALSE COMMENT 'Đã mua hàng',
    helpful_count INT DEFAULT 0 COMMENT 'Số người thấy hữu ích',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_reviewable (reviewable_type, reviewable_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Conversations
CREATE TABLE conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED,
    platform ENUM('web', 'facebook', 'zalo', 'gmail') DEFAULT 'web',
    status ENUM('open', 'closed') DEFAULT 'open',
    last_message_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 14. Messages
CREATE TABLE messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    sender_type ENUM('customer', 'staff') NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. Personal Access Tokens (Laravel Sanctum)
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Wishlist - Danh sách yêu thích
CREATE TABLE wishlist (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id)
) ENGINE=InnoDB;

-- 17. Vouchers - Mã giảm giá
CREATE TABLE vouchers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    min_order_amount DECIMAL(15,2) DEFAULT 0,
    max_discount_amount DECIMAL(15,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 18. Voucher Usage - Lịch sử sử dụng voucher
CREATE TABLE voucher_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    voucher_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED,
    discount_amount DECIMAL(15,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 19. Customer Notes - Ghi chú chi tiết về khách hàng
CREATE TABLE customer_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    note_type ENUM('general', 'allergy', 'preference', 'complaint', 'compliment') DEFAULT 'general',
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. Order Status History - Lịch sử thay đổi trạng thái đơn hàng
CREATE TABLE order_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by BIGINT UNSIGNED,
    changed_by_role ENUM('admin', 'sales', 'staff', 'system'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 21. Notifications - Thông báo
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('order', 'appointment', 'message', 'review', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- 22. Activity Logs - Nhật ký hoạt động
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100),
    model_id BIGINT UNSIGNED,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_model (model_type, model_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;


-- =====================================================
-- SAMPLE DATA INSERTION
-- Password: password123 (bcrypt hash)
-- =====================================================

-- 1. INSERT USERS
INSERT INTO users (name, email, phone, password, role, status, email_verified_at) VALUES
('Admin System', 'admin@petshop.com', '0901000001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', NOW()),
('Trần Văn Bình', 'staff1@petshop.com', '0901000002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active', NOW()),
('Lê Thị Hoa', 'staff2@petshop.com', '0901000003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active', NOW()),
('Nguyễn Thị Mai', 'sales1@petshop.com', '0901000005', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sales', 'active', NOW()),
('Hoàng Văn Nam', 'sales2@petshop.com', '0901000006', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sales', 'active', NOW()),
('Nguyễn Văn An', 'customer1@gmail.com', '0912345001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', NOW()),
('Trần Thị Bình', 'customer2@gmail.com', '0912345002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', NOW()),
('Lê Văn Cường', 'customer3@gmail.com', '0912345003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', NOW()),
('Phạm Thị Dung', 'customer4@gmail.com', '0912345004', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', NOW()),
('Hoàng Văn Em', 'customer5@gmail.com', '0912345005', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', NOW());

-- 2. INSERT CUSTOMER PROFILES
INSERT INTO customer_profiles (user_id, address, city, loyalty_points, total_spent, total_orders, vip_level, notes, allergies) VALUES
(6, 'Số 123, Đường Lê Lợi, Hoàn Kiếm', 'Hà Nội', 1250, 12500000, 15, 'platinum', 'Khách VIP, mua hàng thường xuyên', 'Dị ứng hạt hướng dương'),
(7, 'Số 456, Đường Nguyễn Huệ, Quận 1', 'TP.HCM', 850, 8500000, 12, 'gold', 'Thích sản phẩm organic', ''),
(8, 'Số 789, Đường Trần Phú, Hải Châu', 'Đà Nẵng', 560, 5600000, 8, 'silver', 'Hay hỏi về sản phẩm', 'Dị ứng sữa'),
(9, 'Số 321, Đường Hai Bà Trưng', 'Hải Phòng', 320, 3200000, 5, 'normal', 'Khách mới', ''),
(10, 'Số 654, Đường Lý Thường Kiệt', 'Cần Thơ', 450, 4500000, 7, 'silver', 'Thường mua combo', '');

-- 3. INSERT PETS
INSERT INTO pets (customer_id, name, type, breed, age, allergies) VALUES
(6, 'Lucky', 'dog', 'Golden Retriever', 3, 'Không có'),
(6, 'Miu', 'cat', 'Mèo Anh Lông Ngắn', 2, 'Hạt hướng dương'),
(7, 'Max', 'dog', 'Husky', 4, 'Không có'),
(8, 'Kitty', 'cat', 'Mèo Ba Tư', 1, 'Sữa'),
(9, 'Coco', 'dog', 'Poodle', 2, 'Không có'),
(10, 'Momo', 'cat', 'Mèo Munchkin', 3, 'Không có');

-- 4. INSERT PRODUCT CATEGORIES
INSERT INTO product_categories (name, slug, description, status) VALUES
('Thức ăn cho chó', 'thuc-an-cho-cho', 'Thức ăn dinh dưỡng cho chó các loại', 'active'),
('Thức ăn cho mèo', 'thuc-an-cho-meo', 'Thức ăn dinh dưỡng cho mèo các loại', 'active'),
('Phụ kiện', 'phu-kien', 'Phụ kiện cho thú cưng', 'active'),
('Đồ chơi', 'do-choi', 'Đồ chơi vui nhộn cho thú cưng', 'active'),
('Vệ sinh', 've-sinh', 'Sản phẩm vệ sinh cho thú cưng', 'active');


-- 5. INSERT PRODUCTS (với ảnh từ Unsplash)
INSERT INTO products (category_id, name, slug, sku, description, price, sale_price, stock_quantity, main_image, rating_average, sold_count, status) VALUES
(1, 'Thức ăn Royal Canin cho chó 2kg', 'royal-canin-dog-2kg', 'RC-DOG-2KG', 'Thức ăn cao cấp Royal Canin dành cho chó trưởng thành', 350000, 320000, 50, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 4.8, 145, 'active'),
(1, 'Thức ăn Pedigree cho chó 3kg', 'pedigree-dog-3kg', 'PD-DOG-3KG', 'Thức ăn Pedigree giàu dinh dưỡng', 280000, NULL, 75, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 4.5, 98, 'active'),
(1, 'Thức ăn Ganador cho chó 1.5kg', 'ganador-dog-1-5kg', 'GN-DOG-1.5KG', 'Thức ăn Ganador cho chó nhỏ', 180000, 165000, 60, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500', 4.6, 67, 'active'),
(2, 'Thức ăn Royal Canin cho mèo 2kg', 'royal-canin-cat-2kg', 'RC-CAT-2KG', 'Thức ăn cao cấp Royal Canin dành cho mèo', 380000, 350000, 45, 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500', 4.9, 132, 'active'),
(2, 'Thức ăn Whiskas cho mèo 1.2kg', 'whiskas-cat-1-2kg', 'WK-CAT-1.2KG', 'Thức ăn Whiskas vị cá ngừ', 120000, NULL, 90, 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500', 4.4, 156, 'active'),
(2, 'Thức ăn Me-O cho mèo 1kg', 'me-o-cat-1kg', 'MEO-CAT-1KG', 'Thức ăn Me-O cho mèo trưởng thành', 95000, 85000, 100, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500', 4.3, 189, 'active'),
(3, 'Balo vận chuyển thú cưng cao cấp', 'balo-van-chuyen-cao-cap', 'BALO-CC-001', 'Balo vận chuyển an toàn, thoáng khí', 450000, 399000, 30, 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500', 4.7, 78, 'active'),
(3, 'Dây dắt chó tự động 5m', 'day-dat-cho-tu-dong-5m', 'DAY-TD-5M', 'Dây dắt tự động cuốn, chịu lực tốt', 180000, NULL, 55, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 4.5, 92, 'active'),
(3, 'Vòng cổ cho chó có đèn LED', 'vong-co-cho-co-den-led', 'VONG-LED-001', 'Vòng cổ phát sáng ban đêm', 85000, 75000, 80, 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=500', 4.2, 134, 'active'),
(4, 'Đồ chơi bóng cao su cho chó', 'do-choi-bong-cao-su', 'BONG-CS-001', 'Bóng cao su an toàn, bền chắc', 45000, NULL, 120, 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500', 4.6, 201, 'active'),
(4, 'Cần câu mèo có lông vũ', 'can-cau-meo-long-vu', 'CAN-MEO-001', 'Đồ chơi cần câu kích thích mèo', 35000, 30000, 150, 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=500', 4.4, 167, 'active'),
(4, 'Chuột nhồi bông cho mèo', 'chuot-nhoi-bong-meo', 'CHUOT-NB-001', 'Chuột nhồi bông có catnip', 25000, NULL, 200, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', 4.3, 245, 'active'),
(5, 'Cát vệ sinh cho mèo 5kg', 'cat-ve-sinh-meo-5kg', 'CAT-VS-5KG', 'Cát vệ sinh khử mùi hiệu quả', 120000, 110000, 100, 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=500', 4.7, 178, 'active'),
(5, 'Khay đựng cát cho mèo', 'khay-dung-cat-meo', 'KHAY-CAT-001', 'Khay đựng cát có nắp đậy', 180000, NULL, 45, 'https://images.unsplash.com/photo-1516750905822-d3b0c76f35c9?w=500', 4.5, 89, 'active'),
(5, 'Túi hốt phân cho chó', 'tui-hot-phan-cho', 'TUI-PHAN-100', 'Túi hốt phân phân hủy sinh học (100 túi)', 35000, 30000, 250, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500', 4.8, 312, 'active');

-- 6. INSERT SERVICE CATEGORIES
INSERT INTO service_categories (name, slug, description, status) VALUES
('Cắt tỉa lông', 'cat-tia-long', 'Dịch vụ cắt tỉa lông chuyên nghiệp', 'active'),
('Tắm & Spa', 'tam-spa', 'Dịch vụ tắm và spa thư giãn', 'active'),
('Khám sức khỏe', 'kham-suc-khoe', 'Dịch vụ khám và chăm sóc sức khỏe', 'active'),
('Trông giữ', 'trong-giu', 'Dịch vụ trông giữ thú cưng', 'active');

-- 7. INSERT SERVICES
INSERT INTO services (category_id, name, slug, description, price, duration, status) VALUES
(1, 'Cắt tỉa lông cơ bản', 'cat-tia-long-co-ban', 'Cắt tỉa lông cơ bản, tạo kiểu đơn giản', 200000, 60, 'active'),
(1, 'Cắt tỉa lông cao cấp', 'cat-tia-long-cao-cap', 'Cắt tỉa lông chuyên nghiệp, tạo kiểu theo yêu cầu', 350000, 90, 'active'),
(1, 'Cắt tỉa + Nhuộm màu', 'cat-tia-nhuom-mau', 'Cắt tỉa và nhuộm màu an toàn', 450000, 120, 'active'),
(2, 'Tắm cơ bản', 'tam-co-ban', 'Tắm sạch với sữa tắm chuyên dụng', 150000, 45, 'active'),
(2, 'Tắm + Spa thư giãn', 'tam-spa-thu-gian', 'Tắm, massage và chăm sóc da lông', 280000, 75, 'active'),
(2, 'Spa cao cấp toàn diện', 'spa-cao-cap-toan-dien', 'Spa 5 sao với liệu trình đặc biệt', 500000, 120, 'active'),
(3, 'Khám sức khỏe tổng quát', 'kham-suc-khoe-tong-quat', 'Khám tổng quát, tư vấn sức khỏe', 300000, 30, 'active'),
(3, 'Tiêm phòng vaccine', 'tiem-phong-vaccine', 'Tiêm phòng các loại vaccine cần thiết', 250000, 20, 'active'),
(3, 'Tẩy giun, ve rận', 'tay-giun-ve-ran', 'Tẩy giun và phòng trừ ve rận', 180000, 15, 'active'),
(4, 'Trông giữ theo ngày', 'trong-giu-theo-ngay', 'Trông giữ thú cưng 1 ngày (24h)', 100000, 1440, 'active'),
(4, 'Trông giữ theo tuần', 'trong-giu-theo-tuan', 'Trông giữ thú cưng 1 tuần (7 ngày)', 650000, 10080, 'active');


-- 8. INSERT APPOINTMENTS
INSERT INTO appointments (customer_id, pet_id, service_id, staff_id, appointment_date, appointment_time, status, price, notes) VALUES
(6, 1, 1, 2, '2024-01-20', '09:00:00', 'confirmed', 200000, 'Chó nhà mình hơi sợ người lạ'),
(6, 2, 4, 3, '2024-01-20', '10:30:00', 'confirmed', 150000, NULL),
(7, 3, 6, 2, '2024-01-20', '14:00:00', 'pending', 500000, 'Muốn spa cao cấp nhất'),
(8, 4, 2, 3, '2024-01-21', '09:00:00', 'confirmed', 350000, 'Mèo nhà mình rất ngoan'),
(9, 5, 5, 2, '2024-01-21', '11:00:00', 'pending', 280000, NULL),
(10, 6, 1, 3, '2024-01-21', '15:00:00', 'confirmed', 200000, NULL),
(6, 1, 7, 2, '2024-01-15', '10:00:00', 'completed', 300000, NULL),
(7, 3, 4, 3, '2024-01-14', '14:00:00', 'completed', 150000, NULL),
(8, 4, 1, 2, '2024-01-12', '09:30:00', 'completed', 200000, NULL),
(9, 5, 5, 3, '2024-01-10', '11:00:00', 'completed', 280000, NULL);

-- 9. INSERT ORDERS
INSERT INTO orders (order_number, customer_id, sales_staff_id, subtotal, total_amount, payment_method, payment_status, order_status, shipping_address, notes) VALUES
('ORD20240115001', 6, 4, 850000, 850000, 'bank_transfer', 'paid', 'delivered', 'Số 123, Đường Lê Lợi, Hoàn Kiếm, Hà Nội', NULL),
('ORD20240114001', 7, 4, 450000, 450000, 'cash', 'paid', 'delivered', 'Số 456, Đường Nguyễn Huệ, Quận 1, TP.HCM', NULL),
('ORD20240113001', 8, 5, 1200000, 1200000, 'card', 'paid', 'delivered', 'Số 789, Đường Trần Phú, Hải Châu, Đà Nẵng', NULL),
('ORD20240112001', 9, 4, 350000, 350000, 'cash', 'paid', 'cancelled', 'Số 321, Đường Hai Bà Trưng, Hải Phòng', 'Khách hủy do đổi ý'),
('ORD20240111001', 10, 5, 680000, 680000, 'bank_transfer', 'paid', 'delivered', 'Số 654, Đường Lý Thường Kiệt, Cần Thơ', NULL),
('ORD20240120001', 6, 4, 520000, 520000, 'cash', 'pending', 'pending', 'Số 123, Đường Lê Lợi, Hoàn Kiếm, Hà Nội', NULL),
('ORD20240120002', 7, 5, 380000, 380000, 'card', 'pending', 'confirmed', 'Số 456, Đường Nguyễn Huệ, Quận 1, TP.HCM', NULL);

-- 10. INSERT ORDER ITEMS
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 2, 320000, 640000),
(1, 7, 1, 399000, 399000),
(1, 10, 2, 45000, 90000),
(2, 13, 2, 110000, 220000),
(2, 14, 1, 180000, 180000),
(3, 2, 3, 280000, 840000),
(3, 8, 2, 180000, 360000),
(4, 7, 1, 399000, 399000),
(5, 4, 2, 350000, 700000),
(5, 11, 3, 30000, 90000),
(6, 1, 1, 320000, 320000),
(6, 15, 5, 30000, 150000),
(7, 4, 1, 350000, 350000),
(7, 12, 2, 25000, 50000);

-- 11. INSERT REVIEWS
INSERT INTO reviews (user_id, reviewable_type, reviewable_id, rating, comment, status, reply_text, created_at) VALUES
-- Reviews cho sản phẩm ID 1
(6, 'product', 1, 5, 'Sản phẩm tuyệt vời! Chó nhà mình rất thích ăn. Chất lượng đảm bảo, giao hàng nhanh.', 'approved', 'Cảm ơn bạn đã tin tưởng sử dụng sản phẩm của chúng tôi!', '2024-01-15 10:30:00'),
(7, 'product', 1, 5, 'Thức ăn chất lượng cao, chó ăn rất ngon. Đóng gói cẩn thận, giá cả hợp lý.', 'approved', NULL, '2024-01-16 14:20:00'),
(8, 'product', 1, 4, 'Sản phẩm tốt nhưng hơi đắt. Chó nhà mình thích lắm. Sẽ mua lại khi có khuyến mãi.', 'approved', 'Cảm ơn bạn! Chúng tôi thường xuyên có chương trình khuyến mãi, hãy theo dõi nhé!', '2024-01-18 09:15:00'),
(9, 'product', 1, 5, 'Rất hài lòng với sản phẩm này. Chó nhà mình ăn rất khỏe. Giao hàng nhanh chóng.', 'approved', NULL, '2024-01-20 16:45:00'),
(10, 'product', 1, 4, 'Chất lượng tốt, đóng gói đẹp. Chỉ có điều ship hơi lâu. Nhưng nhìn chung ok.', 'approved', 'Xin lỗi vì sự chậm trễ. Chúng tôi sẽ cải thiện dịch vụ giao hàng!', '2024-01-22 11:30:00'),

-- Reviews cho sản phẩm ID 2
(6, 'product', 2, 5, 'Thức ăn cho mèo rất tốt! Mèo nhà mình ăn ngon lành. Đóng gói cẩn thận.', 'approved', 'Cảm ơn bạn rất nhiều!', '2024-01-17 13:20:00'),
(7, 'product', 2, 4, 'Sản phẩm ổn, mèo thích ăn. Giá hơi cao nhưng chất lượng xứng đáng.', 'approved', NULL, '2024-01-19 10:00:00'),
(8, 'product', 2, 5, 'Mèo nhà mình rất thích! Lông mượt hơn sau khi ăn. Sẽ ủng hộ dài dài.', 'approved', NULL, '2024-01-21 15:30:00'),

-- Reviews cho sản phẩm ID 3
(9, 'product', 3, 5, 'Vitamin tuyệt vời! Chó nhà mình khỏe hơn hẳn sau khi dùng.', 'approved', 'Rất vui khi sản phẩm giúp ích cho bé cưng của bạn!', '2024-01-16 08:45:00'),
(10, 'product', 3, 4, 'Hiệu quả tốt, chó ăn dễ dàng. Giá hợp lý.', 'approved', NULL, '2024-01-18 14:20:00'),

-- Reviews cho sản phẩm ID 4
(6, 'product', 4, 5, 'Thức ăn chất lượng cao, mèo nhà mình rất thích!', 'approved', 'Cảm ơn bạn!', '2024-01-15 11:00:00'),
(7, 'product', 4, 4, 'Sản phẩm tốt nhưng hơi đắt. Chất lượng đảm bảo.', 'approved', NULL, '2024-01-17 16:30:00'),

-- Reviews cho sản phẩm ID 7 (Balo)
(8, 'product', 7, 5, 'Balo đẹp, tiện lợi. Chó nhà mình rất thích đi chơi!', 'approved', 'Rất vui khi bạn hài lòng!', '2024-01-15 14:30:00'),
(9, 'product', 7, 4, 'Balo chất lượng tốt nhưng hơi nhỏ với chó lớn.', 'approved', 'Cảm ơn góp ý! Chúng tôi có size lớn hơn, bạn có thể tham khảo.', '2024-01-17 10:45:00'),

-- Reviews cho sản phẩm ID 10
(10, 'product', 10, 5, 'Lồng rộng rãi, chắc chắn. Chó ở trong rất thoải mái!', 'approved', 'Rất vui khi bạn hài lòng!', '2024-01-16 11:45:00'),
(6, 'product', 10, 4, 'Lồng tốt nhưng hơi nặng. Chất lượng đảm bảo.', 'approved', NULL, '2024-01-18 16:30:00'),

-- Reviews cho sản phẩm ID 13 (Cát)
(7, 'product', 13, 5, 'Cát khử mùi rất tốt, không bụi. Sẽ mua lại!', 'approved', NULL, '2024-01-19 09:00:00'),

-- Reviews cho dịch vụ
(8, 'service', 1, 5, 'Cắt tỉa đẹp, mèo nhà mình rất xinh!', 'approved', 'Cảm ơn bạn đã sử dụng dịch vụ!', '2024-01-20 14:00:00'),
(9, 'service', 4, 4, 'Tắm sạch sẽ, nhân viên nhiệt tình.', 'approved', NULL, '2024-01-21 10:30:00'),
(10, 'service', 7, 5, 'Dịch vụ khám sức khỏe rất tốt, bác sĩ tận tâm!', 'approved', 'Cảm ơn bạn đã tin tưởng!', '2024-01-22 15:00:00');

-- Cập nhật rating_average cho products
UPDATE products SET rating_average = (
    SELECT ROUND(AVG(rating), 2) FROM reviews 
    WHERE reviewable_type = 'product' 
    AND reviewable_id = products.id 
    AND status = 'approved'
) WHERE id IN (1,2,3,4,7,10,13);

-- 12. INSERT CONVERSATIONS
INSERT INTO conversations (customer_id, staff_id, platform, status, last_message_at) VALUES
(6, 4, 'web', 'open', NOW()),
(7, 5, 'facebook', 'open', NOW()),
(8, 4, 'zalo', 'closed', NOW()),
(9, 5, 'web', 'open', NOW());

-- 13. INSERT MESSAGES
INSERT INTO messages (conversation_id, sender_id, sender_type, content, is_read) VALUES
(1, 6, 'customer', 'Xin chào, tôi muốn hỏi về sản phẩm thức ăn Royal Canin', TRUE),
(1, 4, 'staff', 'Chào bạn! Hiện shop có sẵn sản phẩm này. Bạn cần mấy gói ạ?', TRUE),
(1, 6, 'customer', 'Cho tôi 2 gói nhé', TRUE),
(1, 4, 'staff', 'Dạ được ạ! Tôi sẽ tạo đơn hàng cho bạn ngay.', FALSE),
(2, 7, 'customer', 'Lịch hẹn ngày mai có trống không?', TRUE),
(2, 5, 'staff', 'Dạ có ạ! Bạn muốn đặt lúc mấy giờ?', TRUE),
(3, 8, 'customer', 'Cảm ơn shop nhé!', TRUE),
(3, 4, 'staff', 'Dạ không có gì ạ! Hẹn gặp lại bạn!', TRUE);

-- =====================================================
-- INSERT SAMPLE DATA FOR NEW TABLES
-- =====================================================

-- Sample Vouchers
INSERT INTO vouchers (code, type, value, min_order_amount, max_discount_amount, usage_limit, valid_until) VALUES
('PETLOVE', 'fixed_amount', 50000, 200000, 50000, 100, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('WELCOME10', 'percentage', 10, 0, 100000, 1000, DATE_ADD(NOW(), INTERVAL 60 DAY)),
('FREESHIP', 'free_shipping', 0, 100000, NULL, 500, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('VIP20', 'percentage', 20, 500000, 200000, 50, DATE_ADD(NOW(), INTERVAL 90 DAY)),
('NEWYEAR2024', 'percentage', 15, 300000, 150000, 200, DATE_ADD(NOW(), INTERVAL 45 DAY));

-- Sample Customer Notes
INSERT INTO customer_notes (customer_id, created_by, note_type, content, is_important) VALUES
(6, 4, 'allergy', 'Thú cưng dị ứng với hạt hướng dương', TRUE),
(6, 4, 'preference', 'Khách hàng thích mua thức ăn hữu cơ', FALSE),
(6, 4, 'general', 'Khách hàng thân thiết, mua hàng thường xuyên', TRUE),
(7, 5, 'preference', 'Thích sản phẩm cao cấp, không quan tâm giá', FALSE),
(7, 5, 'compliment', 'Khách hàng rất hài lòng với dịch vụ', FALSE),
(8, 4, 'allergy', 'Mèo dị ứng với sữa', TRUE),
(8, 4, 'general', 'Hay hỏi về sản phẩm trước khi mua', FALSE),
(9, 5, 'general', 'Khách mới, cần tư vấn nhiều', FALSE),
(10, 4, 'preference', 'Thường mua combo tiết kiệm', FALSE);

-- Sample Notifications
INSERT INTO notifications (user_id, type, title, content, link) VALUES
(6, 'order', 'Đơn hàng đã được xác nhận', 'Đơn hàng #ORD20240120001 của bạn đã được xác nhận và đang được xử lý', '/orders/6'),
(6, 'appointment', 'Lịch hẹn sắp tới', 'Bạn có lịch hẹn cắt tỉa lông vào ngày mai lúc 09:00', '/appointments/1'),
(6, 'system', 'Chào mừng bạn đến với Pet Shop', 'Cảm ơn bạn đã đăng ký tài khoản. Nhận ngay voucher WELCOME10!', '/profile'),
(7, 'order', 'Đơn hàng đã được giao', 'Đơn hàng #ORD20240120002 đã được giao thành công', '/orders/7'),
(7, 'message', 'Bạn có tin nhắn mới', 'Staff đã trả lời câu hỏi của bạn', '/messages'),
(8, 'review', 'Cảm ơn đánh giá của bạn', 'Cảm ơn bạn đã đánh giá sản phẩm. Nhận 50 điểm thưởng!', '/reviews'),
(9, 'appointment', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận', '/appointments/5'),
(10, 'system', 'Khuyến mãi đặc biệt', 'Giảm 20% cho đơn hàng tiếp theo. Mã: VIP20', '/products');

-- Sample Wishlist
INSERT INTO wishlist (user_id, product_id) VALUES
(6, 1), (6, 4), (6, 7),
(7, 2), (7, 5), (7, 13),
(8, 3), (8, 6), (8, 14),
(9, 1), (9, 10),
(10, 4), (10, 11), (10, 12);

-- Sample Order Status History
INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, changed_by_role, notes) VALUES
(1, NULL, 'pending', 6, 'system', 'Đơn hàng được tạo'),
(1, 'pending', 'confirmed', 4, 'sales', 'Đã xác nhận đơn hàng'),
(1, 'confirmed', 'processing', 4, 'sales', 'Đang chuẩn bị hàng'),
(1, 'processing', 'delivered', 4, 'sales', 'Đã giao hàng thành công'),
(2, NULL, 'pending', 7, 'system', 'Đơn hàng được tạo'),
(2, 'pending', 'confirmed', 4, 'sales', 'Đã xác nhận'),
(2, 'confirmed', 'delivered', 4, 'sales', 'Đã giao hàng');

-- Sample Activity Logs
INSERT INTO activity_logs (user_id, action, model_type, model_id, description, ip_address) VALUES
(1, 'login', 'User', 1, 'Admin đăng nhập hệ thống', '192.168.1.1'),
(4, 'create', 'Order', 1, 'Tạo đơn hàng mới #ORD20240115001', '192.168.1.2'),
(4, 'update', 'Order', 1, 'Cập nhật trạng thái đơn hàng', '192.168.1.2'),
(6, 'create', 'Review', 1, 'Đánh giá sản phẩm', '192.168.1.3'),
(2, 'update', 'Appointment', 1, 'Xác nhận lịch hẹn', '192.168.1.4'),
(5, 'create', 'CustomerNote', 1, 'Thêm ghi chú khách hàng', '192.168.1.5');

-- Update invoice_number for orders
UPDATE orders SET invoice_number = CONCAT('INV-', order_number) WHERE invoice_number IS NULL;

-- Update wishlist_count for products
UPDATE products p SET wishlist_count = (
    SELECT COUNT(*) FROM wishlist w WHERE w.product_id = p.id
);

-- Update is_verified_purchase for reviews
UPDATE reviews r SET is_verified_purchase = TRUE 
WHERE EXISTS (
    SELECT 1 FROM orders o 
    JOIN order_items oi ON o.id = oi.order_id 
    WHERE o.customer_id = r.user_id 
    AND oi.product_id = r.reviewable_id 
    AND r.reviewable_type = 'product'
);

-- =====================================================
-- COMPLETE! Database ready to use - 22 TABLES
-- =====================================================



-- =====================================================
-- 12. CREATE CUSTOMER_PROFILES FOR ALL USERS
-- =====================================================
-- Tạo customer_profiles cho tất cả users (nếu chưa có)
INSERT INTO customer_profiles (user_id, address, city, loyalty_points, total_spent, total_orders, vip_level, created_at, updated_at)
SELECT 
    u.id, 
    NULL, 
    NULL, 
    0, 
    0, 
    0, 
    'normal', 
    NOW(), 
    NOW()
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM customer_profiles cp WHERE cp.user_id = u.id
);

-- Cập nhật một số customer_profiles với thông tin mẫu
UPDATE customer_profiles SET 
    address = '123 Nguyễn Huệ, Quận 1, TP.HCM',
    city = 'Hồ Chí Minh',
    loyalty_points = 100,
    vip_level = 'silver'
WHERE user_id = 6;

UPDATE customer_profiles SET 
    address = '456 Lê Lợi, Quận 3, TP.HCM',
    city = 'Hồ Chí Minh',
    loyalty_points = 50,
    vip_level = 'normal'
WHERE user_id = 7;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT '✓ Database setup completed successfully!' as status;
SELECT CONCAT('Total users: ', COUNT(*)) as info FROM users;
SELECT CONCAT('Total customer_profiles: ', COUNT(*)) as info FROM customer_profiles;
SELECT CONCAT('Total products: ', COUNT(*)) as info FROM products;
SELECT CONCAT('Total services: ', COUNT(*)) as info FROM services;
SELECT CONCAT('Total reviews: ', COUNT(*)) as info FROM reviews;
SELECT CONCAT('Total appointments: ', COUNT(*)) as info FROM appointments;
SELECT CONCAT('Total orders: ', COUNT(*)) as info FROM orders;

-- Hiển thị thông tin customer_profiles
SELECT 
    cp.id,
    cp.user_id,
    u.name,
    u.email,
    cp.vip_level,
    cp.loyalty_points,
    cp.total_orders
FROM customer_profiles cp
LEFT JOIN users u ON cp.user_id = u.id
ORDER BY cp.id;

-- =====================================================
-- DATABASE HOÀN CHỈNH - 22 TABLES
-- =====================================================

-- 16. Wishlist - Danh sách yêu thích
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id)
) ENGINE=InnoDB;

-- 17. Vouchers - Mã giảm giá
CREATE TABLE IF NOT EXISTS vouchers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    min_order_amount DECIMAL(15,2) DEFAULT 0,
    max_discount_amount DECIMAL(15,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 18. Voucher Usage - Lịch sử sử dụng voucher
CREATE TABLE IF NOT EXISTS voucher_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    voucher_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED,
    discount_amount DECIMAL(15,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 19. Customer Notes - Ghi chú chi tiết về khách hàng
CREATE TABLE IF NOT EXISTS customer_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    note_type ENUM('general', 'allergy', 'preference', 'complaint', 'compliment') DEFAULT 'general',
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. Order Status History - Lịch sử thay đổi trạng thái đơn hàng
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by BIGINT UNSIGNED,
    changed_by_role ENUM('admin', 'sales', 'staff', 'system'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 21. Notifications - Thông báo
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('order', 'appointment', 'message', 'review', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- 22. Activity Logs - Nhật ký hoạt động
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100),
    model_id BIGINT UNSIGNED,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_model (model_type, model_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;


SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- DATABASE COMPLETE - 22 TABLES
-- Ready to use!
-- =====================================================
-- =====================================================
-- BẢNG CUSTOMER_ADDRESSES - HỆ THỐNG ĐỊA CHỈ VIỆT NAM
-- =====================================================
DROP TABLE IF EXISTS customer_addresses;

CREATE TABLE customer_addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(50) DEFAULT 'Home' COMMENT 'Home, Work, Other',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL COMMENT 'Địa chỉ chi tiết (số nhà, tên đường)',
    ward VARCHAR(100) NOT NULL COMMENT 'Phường/Xã',
    ward_code VARCHAR(20) NULL COMMENT 'Mã phường/xã',
    district VARCHAR(100) NOT NULL COMMENT 'Quận/Huyện',
    district_code VARCHAR(20) NULL COMMENT 'Mã quận/huyện',
    city VARCHAR(100) NOT NULL COMMENT 'Tỉnh/Thành phố',
    city_code VARCHAR(20) NULL COMMENT 'Mã tỉnh/thành phố',
    postal_code VARCHAR(20) NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu địa chỉ
INSERT INTO customer_addresses (user_id, label, full_name, phone, address, ward, district, city, is_default) VALUES
(6, 'Home', 'Nguyễn Văn An', '0912345001', '123 Đường Lê Lợi', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', TRUE),
(6, 'Work', 'Nguyễn Văn An', '0912345001', '456 Đường Nguyễn Huệ', 'Phường Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', FALSE),
(7, 'Home', 'Trần Thị Bình', '0912345002', '789 Đường Trần Hưng Đạo', 'Phường 5', 'Quận 5', 'TP. Hồ Chí Minh', TRUE),
(8, 'Home', 'Lê Văn Cường', '0912345003', '321 Đường Hai Bà Trưng', 'Phường Đa Kao', 'Quận 1', 'TP. Hồ Chí Minh', TRUE),
(9, 'Home', 'Phạm Thị Dung', '0912345004', '654 Đường Lý Thường Kiệt', 'Phường 14', 'Quận 10', 'TP. Hồ Chí Minh', TRUE),
(10, 'Home', 'Hoàng Văn Em', '0912345005', '987 Đường Cách Mạng Tháng 8', 'Phường 7', 'Quận 3', 'TP. Hồ Chí Minh', TRUE);

-- Cập nhật bảng orders để lưu address_id
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id BIGINT UNSIGNED NULL AFTER customer_id;
ALTER TABLE orders ADD CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES customer_addresses(id) ON DELETE SET NULL;

-- =====================================================

-- Thêm cột image vào bảng services
-- Cập nhật hình ảnh mẫu cho các dịch vụ
UPDATE services SET image = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800' WHERE name LIKE '%Grooming%' OR name LIKE '%Cắt tỉa%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800' WHERE name LIKE '%Spa%' OR name LIKE '%Tắm%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1581888227599-779811939961?w=800' WHERE name LIKE '%Health%' OR name LIKE '%Khám%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800' WHERE name LIKE '%Training%' OR name LIKE '%Huấn%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800' WHERE name LIKE '%Care%' OR name LIKE '%Chăm sóc%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800' WHERE name LIKE '%Nail%' OR name LIKE '%Móng%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800' WHERE name LIKE '%Dental%' OR name LIKE '%Răng%';
UPDATE services SET image = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800' WHERE image IS NULL;