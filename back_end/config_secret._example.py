SECRET_KEY = "your_secret_key"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_schema',          # Tên database MySQL của bạn
        'USER': 'your_user',            # Tên người dùng MySQL
        'PASSWORD': 'your_password',    # Mật khẩu MySQL
        'HOST': 'your_host',            # Hoặc IP của server MySQL
        'PORT': 'your_port',            # Port MySQL (mặc định là 3306)
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}