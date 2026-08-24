const express = require("express");
const connectDatabase = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databaseReady = false;
let databasePromise = null;

app.use(async (req, res, next) => {
    try {
        if (!databaseReady) {
            if (!databasePromise) {
                databasePromise = connectDatabase();
            }

            await databasePromise;
            databaseReady = true;
        }

        next();
    } catch (error) {
        console.error("Database initialization failed:", error.message);
        databasePromise = null;
        return res.status(500).json({
            message: "Database initialization failed."
        });
    }
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Blockchain API</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; color: #1c1e21; }
  h1 { color: #1F3864; }
  .badge { display:inline-block; background:#2E5395; color:#fff; padding:4px 12px; border-radius:12px; font-size:13px; }
  code { background:#f0f2f5; padding:2px 6px; border-radius:4px; }
  table { border-collapse: collapse; width: 100%; margin-top: 12px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
  th { background: #f0f2f5; }
</style>
</head>
<body>
  <h1>🔗 Blockchain API</h1>
  <p><span class="badge">SaaS API</span> <span class="badge">Express.js</span> <span class="badge">PostgreSQL</span> <span class="badge">Vercel</span></p>
  <p>REST API yang menyediakan data blockchain, kategori, dan pengembang kepada konsumen melalui <b>API key</b>.</p>
  <h2>Endpoint</h2>
  <table>
    <tr><th>Method</th><th>Path</th><th>Auth</th></tr>
    <tr><td>POST</td><td><code>/api/register</code></td><td>-</td></tr>
    <tr><td>POST</td><td><code>/api/login</code></td><td>-</td></tr>
    <tr><td>POST</td><td><code>/api/apikey</code></td><td>JWT</td></tr>
    <tr><td>GET</td><td><code>/api/blockchain</code></td><td>API Key / JWT</td></tr>
    <tr><td>POST</td><td><code>/api/blockchain</code></td><td>JWT</td></tr>
    <tr><td>PUT</td><td><code>/api/blockchain/:id</code></td><td>JWT</td></tr>
    <tr><td>DELETE</td><td><code>/api/blockchain/:id</code></td><td>JWT</td></tr>
    <tr><td>GET</td><td><code>/api/kategori</code></td><td>API Key / JWT</td></tr>
    <tr><td>POST</td><td><code>/api/kategori</code></td><td>JWT</td></tr>
    <tr><td>PUT</td><td><code>/api/kategori/:id</code></td><td>JWT</td></tr>
    <tr><td>DELETE</td><td><code>/api/kategori/:id</code></td><td>JWT</td></tr>
  </table>
  <h2>Contoh Akses Data (konsumen)</h2>
  <p><code>GET /api/blockchain</code> dengan header <code>x-api-key: blk_xxxx</code></p>
  <p><small>Final Project 236 — Kelas PWS</small></p>
</body>
</html>`);
});

app.use("/api", require("./routes/api"));

module.exports = app;

// Jalankan server lokal saat dieksekusi langsung (npm start / node index.js).
// Pada deployment Vercel, file ini di-import sebagai serverless function,
// sehingga blok listen dilewati (require.main !== module).
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`==============================================`);
        console.log(`  Blockchain API berjalan di http://localhost:${PORT}`);
        console.log(`  Endpoint: http://localhost:${PORT}/api/...`);
        console.log(`==============================================`);
    });
}