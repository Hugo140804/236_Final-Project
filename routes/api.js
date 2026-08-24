const express = require('express');
const router = express.Router();
const pengembangController = require('../controller/pengembangController');
const blockchainController = require('../controller/blockchainController');
const kategoriController = require('../controller/kategoriController');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", pengembangController.register);
router.post("/login", pengembangController.login);

router.get("/kategori", authMiddleware, kategoriController.getAll);
router.post("/kategori", authMiddleware, kategoriController.create);
router.put("/kategori/:id", authMiddleware, kategoriController.update);
router.delete("/kategori/:id", authMiddleware, kategoriController.remove);

router.get("/blockchain", authMiddleware, blockchainController.getAll);
router.post("/blockchain", authMiddleware, blockchainController.create);
router.put("/blockchain/:id", authMiddleware, blockchainController.update);
router.delete("/blockchain/:id", authMiddleware, blockchainController.remove);
module.exports = router;