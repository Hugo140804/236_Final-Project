// ============================================================
// Script untuk mengisi seed data ke database PRODUKSI (Vercel)
// ============================================================
// Cara pakai (set POSTGRES_URL dari Vercel/Supabase terlebih dahulu):
//   $env:POSTGRES_URL="postgres://user:pass@host:5432/db"   (PowerShell)
//   node scripts/seed-production.js
// ============================================================
require('dotenv').config();
const db = require('../models');
const seeder = require('../seeders/20260824000000-blockchain-data.js');

(async () => {
  try {
    console.log('Menghubungkan ke database...');
    await db.sequelize.authenticate();
    console.log('Terhubung ke database.');

    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
    console.log('SEED BERHASIL:');
    console.log(' - 8 pengembang');
    console.log(' - 13 kategori');
    console.log(' - 60 blockchain');
    console.log(' - 81 relasi Blockchain-Kategori');
    console.log(' - 1 API key demo (blk_demo_andi_236)');

    process.exit(0);
  } catch (error) {
    console.error('SEED GAGAL:', error.message);
    process.exit(1);
  }
})();
