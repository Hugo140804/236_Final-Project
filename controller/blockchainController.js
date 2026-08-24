const db = require("../models");

const Blockchain = db.Blockchain;
const Pengembang = db.Pengembang;
const Kategori = db.Kategori;

async function getAll(req, res) {
  try {
    const blockchain = await Blockchain.findAll({
      include: [
        {
          model: Pengembang,
          as: "pengembang",
          attributes: ["id", "nama", "email"]
        },
        {
          model: Kategori,
          as: "kategori",
          through: {
            attributes: []
          }
        }
      ]
    });

    return res.status(200).json(blockchain);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function create(req, res) {
  try {
    const {
      nama,
      deskripsi,
      tahun_rilis,
      pengembang_id,
      kategori_ids
    } = req.body;

    const pengembang = await Pengembang.findByPk(pengembang_id);
    if (!pengembang) {
      return res.status(404).json({
        message: "Pengembang tidak ditemukan."
      });
    }

    const blockchain = await Blockchain.create({
      nama,
      deskripsi,
      tahun_rilis,
      pengembang_id
    });

    if (kategori_ids && kategori_ids.length > 0) {
      const kategoris = await Kategori.findAll({
        where: {
          id: kategori_ids
        }
      });

      await blockchain.setKategori(kategoris);
    }

    const result = await Blockchain.findByPk(blockchain.id, {
      include: [
        {
          model: Pengembang,
          as: "pengembang"
        },
        {
          model: Kategori,
          as: "kategori",
          through: {
            attributes: []
          }
        }
      ]
    });

    return res.status(201).json({
      message: "Blockchain berhasil ditambahkan.",
      data: result
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

    const {
      nama,
      deskripsi,
      tahun_rilis,
      pengembang_id,
      kategori_ids
    } = req.body;

    const blockchain = await Blockchain.findByPk(id);

    if (!blockchain) {
      return res.status(404).json({
        message: "Blockchain tidak ditemukan."
      });
    }

    await blockchain.update({
      nama,
      deskripsi,
      tahun_rilis,
      pengembang_id
    });

    if (kategori_ids) {
      const kategoris = await Kategori.findAll({
        where: {
          id: kategori_ids
        }
      });

      await blockchain.setKategori(kategoris);
    }

    const result = await Blockchain.findByPk(id, {
      include: [
        {
          model: Pengembang,
          as: "pengembang"
        },
        {
          model: Kategori,
          as: "kategori",
          through: {
            attributes: []
          }
        }
      ]
    });

    return res.status(200).json({
      message: "Blockchain berhasil diperbarui.",
      data: result
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

    const blockchain = await Blockchain.findByPk(id);

    if (!blockchain) {
      return res.status(404).json({
        message: "Blockchain tidak ditemukan."
      });
    }

    await blockchain.destroy();

    return res.status(200).json({
      message: "Blockchain berhasil dihapus."
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
