const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Pengembang = db.Pengembang;

async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi."
      });
    }

    const existingPengembang = await Pengembang.findOne({
      where: { email }
    });

    if (existingPengembang) {
      return res.status(400).json({
        message: "Email sudah terdaftar."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pengembang = await Pengembang.create({
      nama,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: {
        id: pengembang.id,
        nama: pengembang.nama,
        email: pengembang.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi."
      });
    }

    const pengembang = await Pengembang.findOne({
      where: { email }
    });

    if (!pengembang) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      pengembang.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const token = jwt.sign(
      {
        id: pengembang.id,
        nama: pengembang.nama,
        email: pengembang.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES
      }
    );

    return res.status(200).json({
      message: "Login berhasil.",
      token
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function me(req, res) {
  return res.status(200).json({
    id: req.user.id,
    nama: req.user.nama,
    email: req.user.email
  });
}

module.exports = {
  register,
  login,
  me
};
