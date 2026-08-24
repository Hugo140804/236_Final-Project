'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('password123', 10);

    // 1. Seed pengembang (semua pakai password: password123)
    const pengembang = await queryInterface.bulkInsert(
      'pengembang',
      [
        { nama: 'Andi Pratama', email: 'andi@blockchain.dev', password: hash },
        { nama: 'Budi Santoso', email: 'budi@blockchain.dev', password: hash },
        { nama: 'Citra Lestari', email: 'citra@blockchain.dev', password: hash }
      ],
      { returning: true }
    );

    const [idAndi, idBudi, idCitra] = pengembang.map((p) => p.id);

    // 2. Seed kategori
    const kategori = await queryInterface.bulkInsert(
      'kategori',
      [
        { nama: 'DeFi', deskripsi: 'Keuangan terdesentralisasi tanpa perantara bank' },
        { nama: 'NFT', deskripsi: 'Token non-fungible untuk aset digital unik' },
        { nama: 'Layer 1', deskripsi: 'Blockchain dasar tempat aplikasi dibangun' },
        { nama: 'Smart Contract', deskripsi: 'Kontrak pintar yang berjalan otomatis di blockchain' },
        { nama: 'Metaverse', deskripsi: 'Dunia virtual berbasis blockchain' },
        { nama: 'Supply Chain', deskripsi: 'Pelacakan rantai pasok menggunakan blockchain' }
      ],
      { returning: true }
    );

    const kategoriId = {};
    for (const k of kategori) {
      kategoriId[k.nama] = k.id;
    }

    // 3. Seed blockchain
    const blockchain = await queryInterface.bulkInsert(
      'blockchain',
      [
        {
          nama: 'Ethereum',
          deskripsi: 'Platform blockchain open-source untuk smart contract dan dApps',
          tahun_rilis: 2015,
          pengembang_id: idAndi
        },
        {
          nama: 'Bitcoin',
          deskripsi: 'Mata uang digital pertama berbasis decentralized ledger',
          tahun_rilis: 2009,
          pengembang_id: idBudi
        },
        {
          nama: 'Solana',
          deskripsi: 'Blockchain berkecepatan tinggi dengan biaya transaksi rendah',
          tahun_rilis: 2020,
          pengembang_id: idCitra
        },
        {
          nama: 'Polkadot',
          deskripsi: 'Protokol yang menghubungkan berbagai blockchain (parachain)',
          tahun_rilis: 2020,
          pengembang_id: idAndi
        },
        {
          nama: 'Chainlink',
          deskripsi: 'Oracle jaringan untuk menghubungkan smart contract dengan data dunia nyata',
          tahun_rilis: 2017,
          pengembang_id: idBudi
        }
      ],
      { returning: true }
    );

    const blockchainId = {};
    for (const b of blockchain) {
      blockchainId[b.nama] = b.id;
    }

    // 4. Seed relasi many-to-many (BlockchainKategori)
    const relasi = [
      [blockchainId['Ethereum'], kategoriId['Layer 1']],
      [blockchainId['Ethereum'], kategoriId['Smart Contract']],
      [blockchainId['Bitcoin'], kategoriId['Layer 1']],
      [blockchainId['Solana'], kategoriId['Layer 1']],
      [blockchainId['Solana'], kategoriId['DeFi']],
      [blockchainId['Polkadot'], kategoriId['Layer 1']],
      [blockchainId['Chainlink'], kategoriId['Smart Contract']],
      [blockchainId['Chainlink'], kategoriId['DeFi']]
    ];

    const now = new Date();
    await queryInterface.bulkInsert(
      'BlockchainKategori',
      relasi.map(([blockchain_id, kategori_id]) => ({
        blockchain_id,
        kategori_id,
        createdAt: now,
        updatedAt: now
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BlockchainKategori', null, {});
    await queryInterface.bulkDelete('blockchain', null, {});
    await queryInterface.bulkDelete('kategori', null, {});
    await queryInterface.bulkDelete('pengembang', null, {});
  }
};
