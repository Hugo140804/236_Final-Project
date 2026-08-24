const db = require("../models");

const Kategori = db.Kategori;

async function getAll(req, res) {
  try {
    const kategoris = await Kategori.findAll();

    return res.status(200).json(kategoris);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function create(req, res) {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi."
      });
    }

    const existingKategori = await Kategori.findOne({
      where: { nama }
    });

    if (existingKategori) {
      return res.status(400).json({
        message: "Kategori sudah ada."
      });
    }

    const kategori = await Kategori.create({
      nama,
      deskripsi
    });

    return res.status(201).json({
      message: "Kategori berhasil ditambahkan.",
      data: kategori
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;

    const kategori = await Kategori.findByPk(id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan."
      });
    }

    await kategori.update({
      nama,
      deskripsi
    });

    return res.status(200).json({
      message: "Kategori berhasil diperbarui.",
      data: kategori
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const kategori = await Kategori.findByPk(id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan."
      });
    }

    const blockchain = await kategori.getBlockchain();

    if (blockchain.length > 0) {
      return res.status(400).json({
        message: "Kategori masih digunakan oleh blockchain dan tidak dapat dihapus."
      });
    }

    await kategori.destroy();

    return res.status(200).json({
      message: "Kategori berhasil dihapus."
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  getAll,
  create,
  update,
  remove
};
