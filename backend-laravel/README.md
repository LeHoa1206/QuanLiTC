# 🐾 Pet Management System - Laravel Backend

Backend API cho hệ thống quản lý thú cưng sử dụng Laravel 10 + MySQL.

## 📋 Yêu Cầu Hệ Thống

- PHP >= 8.1
- Composer
- MySQL >= 5.7
- Node.js & npm (optional)

## 🚀 Cài Đặt

### 1. Cài đặt Laravel (nếu chưa có)

```bash
composer create-project laravel/laravel backend-laravel
```

### 2. Copy các file đã tạo vào project Laravel

Copy tất cả các file trong thư mục này vào project Laravel của bạn.

### 3. Cài đặt dependencies

```bash
cd backend-laravel
composer install
```

### 4. Tạo file .env

```bash
copy .env.example .env
```

### 5. Generate application key

```bash
php artisan key:generate
```

### 6. Cấu hình database trong .env

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pet_management
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 7. Tạo database

```sql
CREATE DATABASE pet_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc import file `database_schema.sql` ở thư mục gốc.

### 8. Cài đặt Laravel Sanctum

```bash
php artisan install:api
```

### 9. Chạy migrations (nếu dùng migrations)

```bash
php artisan migrate
```

### 10. Chạy server

```bash
php artisan serve
```

Server sẽ chạy tại: **http://localhost:8000**

## 📁 Cấu Trúc MVC

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CartController.php
│   │   │   ├── OrderController.php
│   │   │   ├── ServiceController.php
│   │   │   ├── AppointmentController.php
│   │   │   └── Admin/
│   │   │       ├── UserController.php
│   │   │       └── StatisticsController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Customer.php
│       ├── Product.php
│       ├── Category.php
│       ├── Cart.php
│       ├── Order.php
│       ├── OrderItem.php
│       ├── Service.php
│       ├── ServiceCategory.php
│       ├── Pet.php
│       ├── Appointment.php
│       ├── Message.php
│       ├── Review.php
│       └── CustomerNote.php
├── routes/
│   └── api.php
└── database/
    └── migrations/
```

## 🔑 API Endpoints

### Authentication
- `POST /api/register` - Đăng ký
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất (auth)
- `GET /api/me` - Thông tin user (auth)
- `PUT /api/profile` - Cập nhật profile (auth)

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/{id}` - Chi tiết sản phẩm
- `POST /api/admin/products` - Thêm sản phẩm (admin)
- `PUT /api/admin/products/{id}` - Cập nhật sản phẩm (admin)
- `DELETE /api/admin/products/{id}` - Xóa sản phẩm (admin)

### Cart
- `GET /api/cart` - Xem giỏ hàng (auth)
- `POST /api/cart` - Thêm vào giỏ (auth)
- `PUT /api/cart/{id}` - Cập nhật giỏ (auth)
- `DELETE /api/cart/{id}` - Xóa khỏi giỏ (auth)

### Orders
- `GET /api/orders` - Danh sách đơn hàng (auth)
- `GET /api/orders/{id}` - Chi tiết đơn hàng (auth)
- `POST /api/orders` - Tạo đơn hàng (auth)
- `POST /api/orders/{id}/cancel` - Hủy đơn (auth)

### Services
- `GET /api/services` - Danh sách dịch vụ
- `GET /api/services/{id}` - Chi tiết dịch vụ
- `GET /api/service-categories` - Danh mục dịch vụ

### Appointments
- `GET /api/appointments` - Danh sách lịch hẹn (auth)
- `POST /api/appointments` - Đặt lịch (auth)
- `PUT /api/appointments/{id}` - Cập nhật lịch (auth)
- `POST /api/appointments/{id}/cancel` - Hủy lịch (auth)

### Admin
- `GET /api/admin/users` - Quản lý user (admin)
- `POST /api/admin/users` - Tạo user (admin)
- `GET /api/admin/statistics/dashboard` - Thống kê (admin)
- `GET /api/admin/statistics/revenue` - Doanh thu (admin)

## 🔐 Authentication

API sử dụng Laravel Sanctum. Sau khi login, bạn sẽ nhận được token:

```json
{
  "token": "1|xxxxxxxxxxxxx"
}
```

Sử dụng token trong header:

```
Authorization: Bearer 1|xxxxxxxxxxxxx
```

## 👥 User Roles

- `customer` - Khách hàng
- `admin` - Quản trị viên
- `care_staff` - Nhân viên chăm sóc
- `sales_staff` - Nhân viên bán hàng

## 🧪 Test API

Sử dụng Postman hoặc Thunder Client để test API.

Default admin account:
- Email: `admin@petmanagement.com`
- Password: `password`

## 📝 Notes

- Tất cả API trả về JSON format
- Sử dụng HTTP status codes chuẩn
- Validation errors trả về status 422
- Authentication errors trả về status 401
- Authorization errors trả về status 403
