'use strict';
const bcrypt = require('bcrypt');

// ============================================================
// DATA CONTOH: 60 blockchain (minimal 50 sesuai ketentuan)
// Format: [nama, simbol, tahun_rilis, deskripsi, [kategori], pengembang]
// ============================================================
const DATA_A = [
  ['Bitcoin', 'BTC', 2009, 'Mata uang digital pertama berbasis decentralized ledger', ['Layer 1'], 'Andi Pratama'],
  ['Ethereum', 'ETH', 2015, 'Platform blockchain open-source untuk smart contract dan dApps', ['Layer 1', 'DeFi', 'NFT'], 'Budi Santoso'],
  ['Tether', 'USDT', 2014, 'Stablecoin yang dipatok 1:1 dengan Dolar AS', ['Stablecoin'], 'Citra Lestari'],
  ['BNB', 'BNB', 2017, 'Token ekosistem BNB Chain untuk biaya transaksi', ['Exchange Token', 'Layer 1'], 'Dewi Anggraini'],
  ['Solana', 'SOL', 2020, 'Blockchain berkecepatan tinggi dengan biaya transaksi sangat rendah', ['Layer 1', 'DeFi'], 'Eko Wijaya'],
  ['XRP', 'XRP', 2012, 'Jaringan pembayaran lintas negara untuk institusi keuangan', ['Layer 1'], 'Fitri Handayani'],
  ['USD Coin', 'USDC', 2018, 'Stablecoin yang dikelola Circle dengan audit reguler', ['Stablecoin'], 'Gilang Ramadhan'],
  ['Cardano', 'ADA', 2017, 'Blockchain proof-of-stake dengan pendekatan riset peer-reviewed', ['Layer 1'], 'Hana Safitri'],
  ['Dogecoin', 'DOGE', 2013, 'Mata uang meme pertama yang populer di komunitas', ['Meme Coin'], 'Andi Pratama'],
  ['Avalanche', 'AVAX', 2020, 'Platform multi-chain untuk aplikasi berskala enterprise', ['Layer 1', 'DeFi'], 'Budi Santoso'],
  ['TRON', 'TRX', 2017, 'Blockchain untuk konten digital dan transfer USDT murah', ['Layer 1', 'DeFi'], 'Citra Lestari'],
  ['Polkadot', 'DOT', 2020, 'Protokol yang menghubungkan berbagai blockchain melalui parachain', ['Layer 1', 'Interoperability'], 'Dewi Anggraini'],
  ['Chainlink', 'LINK', 2017, 'Oracle jaringan yang menghubungkan smart contract dengan data dunia nyata', ['Oracle', 'DeFi'], 'Eko Wijaya'],
  ['Polygon', 'MATIC', 2017, 'Solusi scaling Layer 2 untuk Ethereum dengan biaya rendah', ['Layer 2', 'DeFi'], 'Fitri Handayani'],
  ['Litecoin', 'LTC', 2011, 'Altcoin pertama berbasis PoW dengan konfirmasi cepat', ['Layer 1'], 'Gilang Ramadhan'],
  ['Shiba Inu', 'SHIB', 2020, 'Token meme dalam ekosistem Dogecoin', ['Meme Coin'], 'Hana Safitri'],
  ['Bitcoin Cash', 'BCH', 2017, 'Hard fork Bitcoin dengan ukuran blok lebih besar', ['Layer 1'], 'Andi Pratama'],
  ['Uniswap', 'UNI', 2018, 'DEX otomatis dengan model liquidity pool', ['DeFi'], 'Budi Santoso'],
  ['Stellar', 'XLM', 2014, 'Jaringan pembayaran open-source untuk masyarakat tanpa bank', ['Layer 1'], 'Citra Lestari'],
  ['Cosmos', 'ATOM', 2019, 'Internet of blockchains yang saling terhubung', ['Layer 1', 'Interoperability'], 'Dewi Anggraini'],
  ['Monero', 'XMR', 2014, 'Mata uang kripto fokus privasi dengan ring signature', ['Privacy'], 'Eko Wijaya'],
  ['Ethereum Classic', 'ETC', 2016, 'Chain asli Ethereum yang mempertahankan mekanisme PoW', ['Layer 1'], 'Fitri Handayani'],
  ['Aptos', 'APT', 2022, 'Layer 1 berbasis bahasa Move dengan throughput tinggi', ['Layer 1'], 'Gilang Ramadhan'],
  ['NEAR Protocol', 'NEAR', 2020, 'Cloud computing berbasis blockchain dengan teknologi sharding', ['Layer 1'], 'Hana Safitri'],
  ['Algorand', 'ALGO', 2019, 'Pure proof-of-stake dengan finalitas instan', ['Layer 1'], 'Andi Pratama'],
  ['Fantom', 'FTM', 2019, 'Platform smart contract berbasis DAG (Lachesis)', ['Layer 1', 'DeFi'], 'Budi Santoso'],
  ['Tezos', 'XTZ', 2018, 'Blockchain dengan on-chain governance dan upgrade mandiri', ['Layer 1'], 'Citra Lestari'],
  ['Filecoin', 'FIL', 2020, 'Jaringan penyimpanan data terdesentralisasi', ['Layer 1'], 'Dewi Anggraini'],
  ['Arbitrum', 'ARB', 2021, 'Rollup optimistic terbesar untuk ekosistem Ethereum', ['Layer 2', 'DeFi'], 'Eko Wijaya'],
  ['Optimism', 'OP', 2021, 'Rollup optimistic untuk aplikasi terdesentralisasi', ['Layer 2', 'DeFi'], 'Fitri Handayani']
];

const DATA_B = [
  ['Hedera', 'HBAR', 2019, 'Konsensus hashgraph dengan efisiensi energi tinggi', ['Layer 1'], 'Gilang Ramadhan'],
  ['Flow', 'FLOW', 2020, 'Blockchain untuk game dan NFT berbasis multi-role', ['GameFi', 'NFT'], 'Hana Safitri'],
  ['Sui', 'SUI', 2023, 'Layer 1 berkinerja tinggi dengan model object-centric', ['Layer 1'], 'Andi Pratama'],
  ['Injective', 'INJ', 2020, 'Blockchain DeFi khusus untuk derivatives dan trading', ['DeFi'], 'Budi Santoso'],
  ['The Graph', 'GRT', 2020, 'Protokol indexing untuk query data blockchain', ['Oracle'], 'Citra Lestari'],
  ['Aave', 'AAVE', 2017, 'Protokol lending dan borrowing terdesentralisasi', ['DeFi'], 'Dewi Anggraini'],
  ['Lido DAO', 'LDO', 2020, 'Liquid staking untuk Ethereum dan jaringan lain', ['DeFi'], 'Eko Wijaya'],
  ['Maker', 'MKR', 2015, 'Protokol DAI stablecoin dengan collateralized debt position', ['DeFi', 'Stablecoin'], 'Fitri Handayani'],
  ['Compound', 'COMP', 2018, 'Protokol money market dengan bunga algoritmik', ['DeFi'], 'Gilang Ramadhan'],
  ['Curve DAO', 'CRV', 2020, 'DEX khusus stablecoin dengan slippage minimal', ['DeFi', 'Stablecoin'], 'Hana Safitri'],
  ['Yearn Finance', 'YFI', 2020, 'Aggregator yield farming otomatis', ['DeFi'], 'Andi Pratama'],
  ['SushiSwap', 'SUSHI', 2020, 'DEX fork Uniswap dengan incentivized token', ['DeFi'], 'Budi Santoso'],
  ['PancakeSwap', 'CAKE', 2020, 'DEX terbesar di BNB Chain', ['DeFi'], 'Citra Lestari'],
  ['Axie Infinity', 'AXS', 2018, 'Game play-to-earn berbasis NFT', ['GameFi', 'NFT'], 'Dewi Anggraini'],
  ['Decentraland', 'MANA', 2017, 'Metaverse virtual reality berbasis Ethereum', ['Metaverse'], 'Eko Wijaya'],
  ['The Sandbox', 'SAND', 2018, 'Metaverse voxel dengan user-generated content', ['Metaverse'], 'Fitri Handayani'],
  ['Enjin Coin', 'ENJ', 2017, 'Infrastruktur NFT untuk industri gaming', ['GameFi', 'NFT'], 'Gilang Ramadhan'],
  ['Basic Attention Token', 'BAT', 2017, 'Token untuk ekosistem iklan digital Brave', ['Exchange Token'], 'Hana Safitri'],
  ['VeChain', 'VET', 2018, 'Pelacakan rantai pasok menggunakan blockchain', ['Supply Chain'], 'Andi Pratama'],
  ['Internet Computer', 'ICP', 2021, 'Cloud terdesentralisasi untuk aplikasi web', ['Layer 1'], 'Budi Santoso'],
  ['Stacks', 'STX', 2019, 'Smart contract untuk Bitcoin (Bitcoin Layer 2)', ['Layer 2'], 'Citra Lestari'],
  ['Render', 'RNDR', 2017, 'Jaringan rendering GPU terdesentralisasi', ['DeFi'], 'Dewi Anggraini'],
  ['Immutable X', 'IMX', 2021, 'Layer 2 NFT dengan zero gas fee', ['Layer 2', 'NFT'], 'Eko Wijaya'],
  ['Gala', 'GALA', 2020, 'Ekosistem gaming blockchain play-to-earn', ['GameFi'], 'Fitri Handayani'],
  ['Mina Protocol', 'MINA', 2021, 'Layer 1 teringan dengan zero-knowledge proofs', ['Layer 1', 'Privacy'], 'Gilang Ramadhan'],
  ['Theta Network', 'THETA', 2019, 'Jaringan streaming video terdesentralisasi', ['Layer 1'], 'Hana Safitri'],
  ['Chiliz', 'CHZ', 2019, 'Token fan engagement untuk olahraga (Socios)', ['Exchange Token'], 'Andi Pratama'],
  ['1inch', '1INCH', 2019, 'DEX aggregator dengan optimasi harga', ['DeFi'], 'Budi Santoso'],
  ['dYdX', 'DYDX', 2017, 'Exchange derivatives terdesentralisasi', ['DeFi'], 'Citra Lestari'],
  ['Loopring', 'LRC', 2017, 'Protokol Layer 2 zkRollup untuk exchange', ['Layer 2', 'DeFi'], 'Dewi Anggraini']
];

const DATA = [...DATA_A, ...DATA_B];


const PENGEMBANG = [
  ['Andi Pratama', 'andi@blockchain.dev'],
  ['Budi Santoso', 'budi@blockchain.dev'],
  ['Citra Lestari', 'citra@blockchain.dev'],
  ['Dewi Anggraini', 'dewi@blockchain.dev'],
  ['Eko Wijaya', 'eko@blockchain.dev'],
  ['Fitri Handayani', 'fitri@blockchain.dev'],
  ['Gilang Ramadhan', 'gilang@blockchain.dev'],
  ['Hana Safitri', 'hana@blockchain.dev']
];

const KATEGORI = [
  ['Layer 1', 'Blockchain dasar tempat aplikasi dibangun'],
  ['Layer 2', 'Solusi scaling yang berjalan di atas Layer 1'],
  ['DeFi', 'Keuangan terdesentralisasi tanpa perantara'],
  ['Stablecoin', 'Aset digital yang nilainya dipatok ke aset lain'],
  ['Meme Coin', 'Token berbasis meme dan komunitas'],
  ['NFT', 'Token non-fungible untuk aset digital unik'],
  ['GameFi', 'Game play-to-earn berbasis blockchain'],
  ['Metaverse', 'Dunia virtual berbasis blockchain'],
  ['Oracle', 'Menghubungkan data dunia nyata ke smart contract'],
  ['Privacy', 'Fokus pada privasi dan anonimitas transaksi'],
  ['Supply Chain', 'Pelacakan rantai pasok dengan blockchain'],
  ['Exchange Token', 'Token resmi platform exchange'],
  ['Interoperability', 'Menghubungkan antar blockchain']
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('password123', 10);
    const now = new Date();

    // 1. Seed pengembang (8 akun, password: password123)
    const pengembangRows = await queryInterface.bulkInsert(
      'pengembang',
      PENGEMBANG.map(([nama, email]) => ({ nama, email, password: hash })),
      { returning: true }
    );

    const pengembangId = {};
    for (const p of pengembangRows) {
      pengembangId[p.nama] = p.id;
    }

    // 2. Seed kategori (13 kategori)
    const kategoriRows = await queryInterface.bulkInsert(
      'kategori',
      KATEGORI.map(([nama, deskripsi]) => ({ nama, deskripsi })),
      { returning: true }
    );

    const kategoriId = {};
    for (const k of kategoriRows) {
      kategoriId[k.nama] = k.id;
    }

    // 3. Seed blockchain (60 data)
    const blockchainRows = await queryInterface.bulkInsert(
      'blockchain',
      DATA.map(([nama, simbol, tahunRilis, deskripsi, , pengembang]) => ({
        nama,
        simbol,
        deskripsi,
        tahun_rilis: tahunRilis,
        pengembang_id: pengembangId[pengembang]
      })),
      { returning: true }
    );

    const blockchainId = {};
    for (const b of blockchainRows) {
      blockchainId[b.nama] = b.id;
    }

    // 4. Seed relasi Blockchain-Kategori (many-to-many)
    const relasi = [];
    for (const [nama, , , , kategoriList] of DATA) {
      for (const namaKategori of kategoriList) {
        relasi.push({
          blockchain_id: blockchainId[nama],
          kategori_id: kategoriId[namaKategori],
          createdAt: now,
          updatedAt: now
        });
      }
    }
    await queryInterface.bulkInsert('BlockchainKategori', relasi);

    // 5. Seed API key demo
    await queryInterface.bulkInsert('api_keys', [
      {
        pengembang_id: pengembangId['Andi Pratama'],
        nama: 'Demo Key',
        key: 'blk_demo_andi_236',
        aktif: true,
        terakhir_dipakai: null,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BlockchainKategori', null, {});
    await queryInterface.bulkDelete('api_keys', null, {});
    await queryInterface.bulkDelete('blockchain', null, {});
    await queryInterface.bulkDelete('kategori', null, {});
    await queryInterface.bulkDelete('pengembang', null, {});
  }
};
