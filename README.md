# 🛍️ Hệ thống Quản Lý Bán Hàng (QLBH)

Ứng dụng web quản lý bán hàng được xây dựng bằng React + Vite với Material-UI.

## ✨ Tính năng

### 👨‍💼 Dành cho Admin

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
- **Quản lý đơn hàng**: Xem tất cả đơn hàng, cập nhật trạng thái (pending → delivered/cancelled)
- **Dashboard**: Thống kê tổng quan

### 👤 Dành cho User

- **Xem sản phẩm**: Duyệt danh sách sản phẩm có sẵn
- **Mua hàng**: Thêm vào giỏ hàng và đặt hàng
- **Quản lý đơn hàng cá nhân**: Xem lịch sử đơn hàng với các trạng thái:
    - 🟡 **Pending**: Chờ xử lý
    - 🟢 **Delivered**: Đã giao hàng
    - 🔴 **Cancelled**: Đã hủy

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài đặt concurrently (nếu chưa có)

```bash
npm install concurrently --save-dev
```

### 3. Chạy ứng dụng (Full Stack)

```bash
npm run dev
```

_Lệnh này sẽ chạy đồng thời JSON Server (port 8888) và Vite Dev Server (port 5173)_

**Hoặc chạy riêng biệt:**

```bash
# Chỉ chạy JSON Server
npm run dev:json

# Chỉ chạy Vite (cần JSON Server chạy trước)
npm run dev:vite
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:8888
- **Trang chủ**: Xem danh sách sản phẩm
- **Đăng nhập**: /login

## 👥 Tài khoản demo

### Admin

- **Username**: `admin`
- **Password**: `123`
- **Quyền**: Quản lý sản phẩm và đơn hàng

### User

- **Username**: `user1` hoặc `user2`
- **Password**: `123`
- **Quyền**: Mua hàng và xem đơn hàng cá nhân

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19.1.0 + Vite 7.0.4
- **UI Library**: Material-UI 7.3.1 + Custom Components
- **Routing**: React Router DOM 7.7.0
- **Styling**: SCSS Modules + SASS
- **HTTP Client**: Axios
- **Mock Data**: JSON Server
- **Language**: JavaScript + TypeScript support
- **Architecture**: Component-based với SCSS Modules

## 📁 Cấu trúc dự án

```
src/
├── apis/              # API calls
├── assets/            # Styles và resources
├── components/        # React components
├── pages/            # Trang chính
├── routers/          # Routing configuration
└── main.jsx          # Entry point
```

## 🔐 Hệ thống phân quyền

- **Protected Routes**: Chỉ user đã đăng nhập mới truy cập được
- **Role-based Access**: Admin và User có quyền truy cập khác nhau
- **Local Storage**: Lưu thông tin user và session

## 📊 Dữ liệu mẫu

File `data.json` chứa:

- **Users**: Admin và User accounts
- **Products**: Danh sách sản phẩm mẫu
- **Orders**: Đơn hàng mẫu với các trạng thái khác nhau

## 🎯 Hướng dẫn sử dụng

### Cho Admin:

1. Đăng nhập với tài khoản admin
2. Truy cập trang quản trị
3. Quản lý sản phẩm: Thêm/Sửa/Xóa
4. Quản lý đơn hàng: Cập nhật trạng thái

### Cho User:

1. Đăng nhập với tài khoản user
2. Xem danh sách sản phẩm
3. Thêm sản phẩm vào giỏ hàng
4. Đặt hàng và theo dõi trạng thái

---

**Phát triển bởi**: CodeGym Student
**Version**: 1.0.0
