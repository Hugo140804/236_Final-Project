const jwt = require('jsonwebtoken');
const db = require('../models');

// Middleware untuk endpoint pembaca data (GET):
// menerima token JWT ATAU API key dari header `x-api-key` / `Authorization: Bearer <key>`
module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const apiKeyValue = req.headers['x-api-key'] || bearerToken;

  if (!apiKeyValue) {
    return res.status(401).json({
      message: 'API key atau token JWT tidak ditemukan. Gunakan header x-api-key.'
    });
  }

  // 1. Coba verifikasi sebagai token JWT
  try {
    const verified = jwt.verify(apiKeyValue, process.env.JWT_SECRET);
    req.user = verified;
    req.authType = 'jwt';
    return next();
  } catch (error) {
    // bukan JWT, lanjut cek sebagai API key
  }

  // 2. Coba sebagai API key
  try {
    const apiKey = await db.ApiKey.findOne({
      where: { key: apiKeyValue, aktif: true }
    });

    if (!apiKey) {
      return res.status(401).json({
        message: 'API key tidak valid atau sudah dinonaktifkan.'
      });
    }

    apiKey.terakhir_dipakai = new Date();
    await apiKey.save();

    req.user = { id: apiKey.pengembang_id, nama: 'API Key', email: '' };
    req.authType = 'apikey';
    req.apiKey = apiKey;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
