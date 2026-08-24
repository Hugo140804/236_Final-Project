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
curl -X POST https://236-final-project.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"andi@blockchain.dev","password":"password123"}'

# Buat API key (gunakan token JWT dari login)
curl -X POST https://236-final-project.vercel.app/api/apikey \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nama":"Production Key"}'
# → { "key": "blk_xxxxxxxx..." }
```

**2. Konsumen mengambil data dengan API key**
```bash
curl https://236-final-project.vercel.app/api/blockchain \
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


<img width="960" height="564" alt="Screenshot 2026-08-24 225632" src="https://github.com/user-attachments/assets/37649be8-3eb0-4a40-b337-132fdfca2420" />
<img width="960" height="564" alt="Screenshot 2026-08-24 225721" src="https://github.com/user-attachments/assets/98643205-af89-466f-8efa-ca9fb510c927" />
<img width="960" height="564" alt="Screenshot 2026-08-24 225810" src="https://github.com/user-attachments/assets/cc7929cd-7917-4875-9a15-5d96c1d64d02" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231430" src="https://github.com/user-attachments/assets/6dd046c9-7cd3-42e4-8c4b-80ec174bc4d3" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231549" src="https://github.com/user-attachments/assets/b98217b0-d52b-4f2d-8aeb-5f4a637e8c2f" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231704" src="https://github.com/user-attachments/assets/0f6e9b85-3d89-42db-a2cf-ebd67cac2ce9" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231725" src="https://github.com/user-attachments/assets/1a32cd16-6d45-439f-bfcc-ab845536025c" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231731" src="https://github.com/user-attachments/assets/2a8aed7b-3e64-484e-88e1-572917911b34" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231752" src="https://github.com/user-attachments/assets/c41967c1-667e-4760-b4ee-7926becb6424" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231825" src="https://github.com/user-attachments/assets/467dacd5-94e3-43ef-9072-558c2930099f" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231842" src="https://github.com/user-attachments/assets/7ee1c94c-1319-42b4-882a-213e1515fbbf" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231910" src="https://github.com/user-attachments/assets/568abe7c-dbb7-465c-a27a-d6ecb155cc1f" />
<img width="960" height="564" alt="Screenshot 2026-08-24 231923" src="https://github.com/user-attachments/assets/4751de6b-8271-456b-8a7b-96dd288de8a6" />
<img width="960" height="564" alt="Screenshot 2026-08-24 232101" src="https://github.com/user-attachments/assets/705d92d7-de97-4282-b8d9-895e16363bc5" />

