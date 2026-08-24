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