# Blockchain API

REST API untuk mengelola data **Blockchain**, **Kategori**, dan **Pengembang**.
Dibangun dengan Node.js, Express, Sequelize, dan PostgreSQL. Di-deploy ke Vercel.

## Fitur
- Autentikasi JWT (register & login pengembang)
- CRUD data blockchain (nama, deskripsi, tahun_rilis, pengembang)
- CRUD kategori blockchain (DeFi, NFT, Layer 1, Smart Contract, dll.)
- Relasi many-to-many Blockchain ↔ Kategori

## Teknologi
Node.js • Express 5 • Sequelize 6 • PostgreSQL • bcrypt • JWT

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
| GET | `/api/blockchain` | Ambil semua data blockchain | ✅ Bearer |
| POST | `/api/blockchain` | Tambah data blockchain | ✅ Bearer |
| PUT | `/api/blockchain/:id` | Update data blockchain | ✅ Bearer |
| DELETE | `/api/blockchain/:id` | Hapus data blockchain | ✅ Bearer |
| GET | `/api/kategori` | Ambil semua kategori | ✅ Bearer |
| POST | `/api/kategori` | Tambah kategori | ✅ Bearer |
| PUT | `/api/kategori/:id` | Update kategori | ✅ Bearer |
| DELETE | `/api/kategori/:id` | Hapus kategori | ✅ Bearer |

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

## Postman Collection
File `postman/Blockchain_API.postman_collection.json` berisi 10 request siap pakai.
Import ke Postman lalu jalankan **Login** terlebih dahulu — token akan terisi otomatis.

## Deployment (Vercel)
Push ke GitHub lalu hubungkan repo di [vercel.com](https://vercel.com). Vercel akan
men-deploy otomatis. Environment variables yang dibutuhkan di Vercel:
`POSTGRES_URL`, `JWT_SECRET`, `JWT_EXPIRES`.

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
