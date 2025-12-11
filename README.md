# Open-Music-API 🎵

## Deskripsi  
Open-Music-API adalah RESTful API backend yang dibuat untuk mendukung aplikasi “Open Music”. API ini memberikan layanan untuk mengelola data musik (misalnya lagu, album, playlist) melalui endpoint HTTP, sehingga frontend bisa mengambil, menambah, mengubah, atau menghapus data musik sesuai kebutuhan.

## Teknologi  
- Node.js  
- Hapi JS
- PostgreSQL
- RabbitMQ
- Redis

## Fitur Utama  
- Authentication
- CRUD (Create, Read, Update, Delete) untuk entitas musik (lagu / album / playlist / likes)
- Upload File Cover Music
- Rute API terstruktur di dalam `src/`  
- Migrasi database dikelola melalui folder `migrations/`
- Server Side Cache

## Instalasi & Setup  

```bash
# Clone repository
git clone https://github.com/alifnaufal-zaqi/Open-Music-API.git

# Masuk ke folder project
cd Open-Music-API

# Install dependensi
npm install
