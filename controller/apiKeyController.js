const db = require("../models");
const crypto = require("crypto");

const ApiKey = db.ApiKey;

// Buat API key baru (khusus login JWT)
async function create(req, res) {
  try {
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({
        message: "Nama API key wajib diisi."
      });
    }

    const key = "blk_" + crypto.randomBytes(24).toString("hex");

    const apiKey = await ApiKey.create({
      pengembang_id: req.user.id,
      nama,
      key
    });

    return res.status(201).json({
      message: "API key berhasil dibuat.",
      data: {
        id: apiKey.id,
        nama: apiKey.nama,
        key: apiKey.key,
        aktif: apiKey.aktif,
        createdAt: apiKey.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

// Daftar API key milik pengembang yang login
async function getAll(req, res) {
  try {
    const keys = await ApiKey.findAll({
      where: { pengembang_id: req.user.id },
      attributes: ["id", "nama", "key", "aktif", "terakhir_dipakai", "createdAt"],
      order: [["id", "DESC"]]
    });

    return res.status(200).json(keys);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

// Nonaktifkan API key (khusus pemilik key)
async function remove(req, res) {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({
      where: {
        id,
        pengembang_id: req.user.id
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        message: "API key tidak ditemukan."
      });
    }

    await apiKey.update({ aktif: false });

    return res.status(200).json({
      message: "API key berhasil dinonaktifkan."
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  create,
  getAll,
  remove
};
