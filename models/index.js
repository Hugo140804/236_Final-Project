'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

// 1. Prioritas utama: connection string (POSTGRES_URL atau DATABASE_URL)
if (config.use_env_variable) {
  const connectionUrl =
    process.env[config.use_env_variable] || process.env.DATABASE_URL;

  if (connectionUrl) {
    const url = new URL(connectionUrl);

    url.searchParams.delete("sslmode");

    sequelize = new Sequelize(url.toString(), {
      ...config,
      dialect: "postgres",
      dialectModule: pg,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  }
}

// 2. Fallback: variabel DB_* individual (DB_USER, DB_PASS, DB_DATABASE, ...)
if (!sequelize) {
  const dbName = config.database || process.env.DB_DATABASE;

  if (dbName) {
    sequelize = new Sequelize(
      dbName,
      config.username || process.env.DB_USER,
      config.password || process.env.DB_PASS,
      {
        host: config.host || process.env.DB_HOST,
        port: config.port || process.env.DB_PORT,
        dialect: config.dialect || process.env.DB_DIALECT || 'postgres'
      }
    );
  }
}

// 3. Jika tidak ada konfigurasi sama sekali, beri pesan error yang jelas
if (!sequelize) {
  console.error(
    '[ERROR] Konfigurasi database tidak ditemukan.\n' +
      'Set minimal salah satu di Vercel (Project > Settings > Environment Variables):\n' +
      '  - POSTGRES_URL (connection string PostgreSQL/Supabase), atau\n' +
      '  - DATABASE_URL, atau\n' +
      '  - DB_USER, DB_PASS, DB_DATABASE, DB_HOST, DB_PORT, DB_DIALECT\n' +
      'Setelah di-set, Redeploy aplikasi dari dashboard Vercel.'
  );
  throw new Error(
    'Environment variable POSTGRES_URL tidak ditemukan. ' +
      'Tambahkan connection string PostgreSQL/Supabase pada Environment Variables Vercel, lalu Redeploy.'
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;