const express = require('express');
const connectDatabase = require('./config/db.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databaseReady = false;
let databasePromise = null;

// Tambahkan keyword `async` pada middleware
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
        console.error('Database connection error:', error);
        databasePromise = null;
        res.status(500).json({ error: 'Database connection error' });
    }
});

app.use('/api', require('./routes/api'));

// Jalankan app.listen HANYA di environment lokal, export app untuk Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;