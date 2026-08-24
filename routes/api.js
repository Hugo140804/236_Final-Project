const express = require('express');
const router = express.Router();
const pengembangController = require('../controller/pengembangController');
const blockchainController = require('../controller/blockchainController');
const kategoriController = require('../controller/kategoriController');
const apiKeyController = require('../controller/apiKeyController');
const authMiddleware = require('../middleware/authMiddleware');
const authOrApiKey = require('../middleware/apiKeyMiddleware');

// ===== Autentikasi pengembang (JWT) =====
router.post("/register", pengembangController.register);
router.post("/login", pengembangController.login);

// ===== Manajemen API Key (khusus login JWT) =====
router.post("/apikey", authMiddleware, apiKeyController.create);
router.get("/apikey", authMiddleware, apiKeyController.getAll);
router.delete("/apikey/:id", authMiddleware, apiKeyController.remove);

// ===== Pembaca data untuk konsumen SaaS (API Key ATAU JWT) =====
router.get("/kategori", authOrApiKey, kategoriController.getAll);
router.get("/blockchain", authOrApiKey, blockchainController.getAll);

// ===== Pengelolaan data (khusus login JWT) =====
router.post("/kategori", authMiddleware, kategoriController.create);
router.put("/kategori/:id", authMiddleware, kategoriController.update);
router.delete("/kategori/:id", authMiddleware, kategoriController.remove);

router.post("/blockchain", authMiddleware, blockchainController.create);
router.put("/blockchain/:id", authMiddleware, blockchainController.update);
router.delete("/blockchain/:id", authMiddleware, blockchainController.remove);

module.exports = router;