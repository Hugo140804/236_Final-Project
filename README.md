# Blockchain API

REST API untuk mengelola data **Blockchain**, **Kategori**, dan **Pengembang**.
Dibangun dengan Node.js, Express, Sequelize, dan PostgreSQL. Di-deploy ke Vercel.

## Fitur
- **SaaS API**: data disediakan ke pihak lain menggunakan **API key** (seperti OpenRouter / Weather API)
- Autentikasi **JWT** (register & login pengembang)
- Manajemen **API key** (buat, lihat, nonaktifkan)
- CRUD data blockchain (nama, simbol, deskripsi, tahun_rilis, pengembang)
- CRUD kategori blockchain (Layer 1, DeFi, NFT, Stablecoin, dll.)
- Relasi many-to-many Blockchain ↔ Kategori
- **60 data blockchain** + 13 kategori + 8 pengembang (via seeder)

## Teknologi
Node.js • Express 5 • Sequelize 6 • PostgreSQL/Supabase • bcrypt • JWT • Vercel

## Setup Lokal

```bash
# 1. Install dependency
npm install

# 2. Buat file .env (contoh)
#    DB_USER=postgres
#    DB_PASS=password_kamu
#    DB_DATABASE=blockchain_db
#    DB_HOST=127.0.0.1
#    DB_PORT=5432
#    DB_DIALECT=postgres
#    JWT_SECRET=rahasia_super_aman
#    JWT_EXPIRES=1h

# 3. (Opsional) Buat tabel via migration + isi data contoh via seeder
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 4. Jalankan server
npm start
```

Akun seeder (password semua `password123`):
`andi@blockchain.dev`, `budi@blockchain.dev`, `citra@blockchain.dev`

> Catatan: tanpa migration, tabel akan otomatis dibuat saat server pertama kali berjalan (via `sequelize.sync({ alter: true })`).

## Endpoint

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/register` | Registrasi pengembang baru | - |
| POST | `/api/login` | Login & dapatkan token JWT | - |
| POST | `/api/apikey` | Buat API key baru | ✅ JWT |
| GET | `/api/apikey` | Lihat daftar API key sendiri | ✅ JWT |
| DELETE | `/api/apikey/:id` | Nonaktifkan API key | ✅ JWT |
| GET | `/api/blockchain` | Ambil semua data blockchain | ✅ API Key / JWT |
| POST | `/api/blockchain` | Tambah data blockchain | ✅ JWT |
| PUT | `/api/blockchain/:id` | Update data blockchain | ✅ JWT |
| DELETE | `/api/blockchain/:id` | Hapus data blockchain | ✅ JWT |
| GET | `/api/kategori` | Ambil semua kategori | ✅ API Key / JWT |
| POST | `/api/kategori` | Tambah kategori | ✅ JWT |
| PUT | `/api/kategori/:id` | Update kategori | ✅ JWT |
| DELETE | `/api/kategori/:id` | Hapus kategori | ✅ JWT |

### Contoh Request

**Register**
```json
POST /api/register
{ "nama": "Andi Pratama", "email": "andi@blockchain.dev", "password": "password123" }
```

**Login** → simpan `token` untuk dipakai di header `Authorization: Bearer <token>`
```json
POST /api/login
{ "email": "andi@blockchain.dev", "password": "password123" }
```

**Tambah Blockchain**
```json
POST /api/blockchain
Authorization: Bearer <token>
{
  "nama": "Ethereum",
  "deskripsi": "Platform blockchain open-source untuk smart contract dan dApps",
  "tahun_rilis": 2015,
  "pengembang_id": 1,
  "kategori_ids": [1, 2]
}
```

**Tambah Kategori**
```json
POST /api/kategori
Authorization: Bearer <token>
{ "nama": "DeFi", "deskripsi": "Keuangan terdesentralisasi tanpa perantara bank" }
```

### Menggunakan API Key (untuk Konsumen)

Alur SaaS: **Login (JWT) → Buat API Key → Konsumen akses data dengan API Key**.

**1. Login lalu buat API key**
```bash
# Login (simpan token dari respon)
curl -X POST https://236-api-deployment.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"andi@blockchain.dev","password":"password123"}'

# Buat API key (gunakan token JWT dari login)
curl -X POST https://236-api-deployment.vercel.app/api/apikey \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nama":"Production Key"}'
# → { "key": "blk_xxxxxxxx..." }
```

**2. Konsumen mengambil data dengan API key**
```bash
curl https://236-api-deployment.vercel.app/api/blockchain \
  -H "x-api-key: blk_xxxxxxxx..."
# → 200, array JSON berisi 60 data blockchain beserta pengembang & kategori
```

**API Key Demo hasil seeder:** `blk_demo_andi_236`

## Laporan Final Project
Laporan lengkap (pendahuluan, tinjauan pustaka, analisis & perancangan,
**ERD**, **use case diagram**, **activity diagram**, pengujian, dan deployment)
terdapat di folder [`laporan/LAPORAN.md`](laporan/LAPORAN.md). Diagram juga
tersedia sebagai file `.mmd` di `laporan/diagrams/` untuk diekspor ke PNG/SVG.

## Postman Collection
File `postman/Blockchain_API.postman_collection.json` berisi request siap pakai
(termasuk endpoint API key). Import ke Postman lalu jalankan **Login** terlebih
dahulu — token akan terisi otomatis.

## Deployment (Vercel)
Push ke GitHub lalu hubungkan repo di [vercel.com](https://vercel.com). Vercel akan
men-deploy otomatis. Environment variables yang dibutuhkan di Vercel:
`POSTGRES_URL`, `JWT_SECRET`, `JWT_EXPIRES`.

### Mengisi data (seed) ke database produksi
Setelah deploy, akun & data contoh **belum** ada di database produksi. Login
`andi@blockchain.dev` akan gagal (401) sampai seed dijalankan. Caranya:

```bash
# 1. Ambil connection string dari Vercel (Settings > Environment Variables)
#    atau dari Supabase (Project Settings > Database)
$env:POSTGRES_URL="postgres://user:password@host:5432/database"

# 2. Jalankan script seed (otomatis isi 8 pengembang, 13 kategori,
#    60 blockchain, 81 relasi, dan API key demo)
node scripts/seed-production.js
```

> Alternatif cepat: daftar akun baru via `POST /api/register` lalu buat API key
> via `POST /api/apikey` (tanpa seed 60 data).

---

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/df255325-30e2-4dba-9099-ee209225c669" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/f65977cd-49cd-4ebf-a7c0-e20f0afe7e7c" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/83128a76-dc11-44b0-863f-067dfb6e5f7c" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/c8f52db1-0bdb-4e76-af35-8e1671e31f2b" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/962a3875-8424-4645-a795-4624724d222b" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/a8aed5a1-f827-472f-9b4a-f200940bf791" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/f2b59db7-d243-4e74-9689-183476bc15f9" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/59b05d80-34a4-4a00-b149-ec35c6fe15b9" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/3c353d6f-a129-4f40-8b49-61fb3297a8e4" />

<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/14570639-8f83-4695-aa7a-d9fed6e4b866" />
