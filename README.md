# WMS_L-P_KLF
🚀 Smart warehouse management system 4.0

## Hướng dẫn triển khai với Docker

Dự án này bao gồm 3 thành phần chính:
- Frontend: ReactJS
- Backend: Django
- Database: MySQL

### Yêu cầu
- Docker và Docker Compose đã được cài đặt
- Git (để clone repository)

### Các bước triển khai

1. Clone repository về máy local:
```
git clone <repository-url>
cd WMS_L-P_KLF
```

2. Xây dựng và khởi chạy các container:
```
docker-compose up -d --build
```

3. Kiểm tra các container đã chạy thành công:
```
docker-compose ps
```

4. Truy cập ứng dụng:
- Frontend: http://localhost hoặc http://<your-server-ip>
- Backend API: http://localhost:8000 hoặc http://<your-server-ip>:8000
- Database: MySQL trên cổng 3306

### Cấu trúc Docker

- **Frontend**: Container chạy ReactJS, được build và phục vụ bởi Nginx trên cổng 80
- **Backend**: Container chạy Django trên cổng 8000
- **Database**: Container chạy MySQL trên cổng 3306

### Quản lý dữ liệu

Dữ liệu được lưu trữ trong các Docker volumes:
- `mysql_data`: Lưu trữ dữ liệu MySQL
- `static_volume`: Lưu trữ các file static của Django
- `media_volume`: Lưu trữ các file media của Django

### Các lệnh hữu ích

- Khởi động các container:
```
docker-compose up -d
```

- Dừng các container:
```
docker-compose down
```

- Xem logs:
```
docker-compose logs -f
```

- Truy cập vào container backend:
```
docker-compose exec backend bash
```

- Tạo superuser Django:
```
docker-compose exec backend python manage.py createsuperuser
```

- Thực hiện migrations:
```
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Cấu hình mạng

Các container được kết nối với nhau thông qua mạng `wms-network`. Frontend giao tiếp với backend thông qua địa chỉ `http://backend:8000`.

### Cấu hình biến môi trường

Dự án sử dụng file `.env` để lưu trữ các thông tin nhạy cảm và cấu hình. File này không được đưa lên Git để đảm bảo an toàn.

1. Tạo file `.env` từ file mẫu:
```
cp back_end/.env.example back_end/.env
```

2. Chỉnh sửa file `.env` với các thông tin cấu hình thực tế:
```
# Django Settings
SECRET_KEY=your-secure-secret-key
DEBUG=False  # Đặt True trong môi trường phát triển
ALLOWED_HOSTS=your-domain.com,localhost,127.0.0.1

# Database Settings
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=db  # Sử dụng 'db' trong Docker, 'localhost' khi phát triển
DATABASE_PORT=3306
```

3. Các biến môi trường quan trọng:
   - `SECRET_KEY`: Khóa bí mật của Django, nên được tạo ngẫu nhiên và giữ bí mật
   - `DEBUG`: Đặt `False` trong môi trường production
   - `DATABASE_PASSWORD`: Mật khẩu database, nên được đặt mạnh và giữ bí mật

### Bảo mật

Trong môi trường production, bạn nên:
1. Thay đổi các mật khẩu mặc định
2. Cấu hình HTTPS
3. Giới hạn truy cập vào cổng database
4. Cập nhật biến môi trường `DEBUG=False` cho backend
