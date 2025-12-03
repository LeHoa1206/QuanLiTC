# 🐾 Pet Management System

Hệ thống quản lý thú cưng toàn diện với Laravel Backend + React Frontend + MySQL Database.

---

## 🎯 Tính Năng Chính

### 👤 Khách Hàng
- Đăng ký, đăng nhập, đăng xuất
- Quản lý thông tin cá nhân
- Xem danh sách sản phẩm (đồ ăn, balo, phụ kiện)
- Lọc và tìm kiếm sản phẩm
- Thêm vào giỏ hàng, thanh toán
- Xem thông tin dịch vụ (cắt tỉa, trông giữ)
- Đặt lịch dịch vụ
- Xem lịch sử mua hàng và đặt lịch

### 👨‍💼 Quản Trị Viên
- Quản lý tài khoản người dùng
- Quản lý sản phẩm và danh mục
- Quản lý dịch vụ
- Thống kê doanh thu

### 👨‍⚕️ Nhân Viên Chăm Sóc
- Xem và quản lý lịch hẹn
- Xác nhận/từ chối đơn đăng ký dịch vụ
- Chat với khách hàng

### 👨‍💼 Nhân Viên Bán Hàng
- Quản lý thông tin khách hàng
- Quản lý đơn hàng
- Tạo hóa đơn
- Quản lý tin nhắn và phản hồi

---

## 🛠️ Tech Stack

### Backend
- **Laravel 10** - PHP Framework
- **MySQL** - Database
- **Laravel Sanctum** - API Authentication

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP Client

---

## 📁 Cấu Trúc Dự Án

```
pet-management/
├── backend-laravel/          # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/ # Controllers (MVC)
│   │   ├── Models/           # Models (MVC)
│   │   └── Middleware/
│   ├── routes/
│   │   └── api.php          # API Routes
│   └── database/
│       └── migrations/
├── frontend/                 # React Frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── contexts/
├── database_schema.sql       # MySQL Schema
└── README.md
```

---

## 🚀 Cách Cài Đặt

### 1. Backend (Laravel)

```bash
cd backend-laravel

# Cài đặt dependencies
composer install

# Copy .env
copy .env.example .env

# Generate key
php artisan key:generate

# Tạo database
# Chạy file database_schema.sql hoặc:
php artisan migrate

# Cài đặt Sanctum
php artisan install:api

# Chạy server
php artisan serve
```

Backend chạy tại: **http://localhost:8000**

### 2. Frontend (React)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend chạy tại: **http://localhost:5173**

---

## 📚 Tài Liệu

- [Backend README](backend-laravel/README.md) - Chi tiết API endpoints
- [Database Schema](database_schema.sql) - Cấu trúc database
- [Laravel Setup](LARAVEL_SETUP.md) - Hướng dẫn cài đặt Laravel
- [Project Plan](PET_MANAGEMENT_PLAN.md) - Kế hoạch dự án

---

## 🔑 Tài Khoản Mặc Định

**Admin:**
- Email: `admin@petmanagement.com`
- Password: `password`

---

## 📝 API Documentation

Xem chi tiết tại: [backend-laravel/README.md](backend-laravel/README.md)

Base URL: `http://localhost:8000/api`

---

## 🎨 Mô Hình MVC

Dự án tuân thủ mô hình MVC chuẩn của Laravel:

- **Models**: `app/Models/` - Quản lý dữ liệu và business logic
- **Views**: React Frontend - Giao diện người dùng
- **Controllers**: `app/Http/Controllers/` - Xử lý request/response

---

**Made with ❤️ for Pet Lovers**
