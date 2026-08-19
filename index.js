const express = require('express');
const connectDatabase = require('./config/db.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databasseReady = false;
let databasePromise = null;

app.use((req, res, next) => {
    

app.use('/api', require('./routes/api'));

async function startServer() {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

startServer();