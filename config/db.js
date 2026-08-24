const db = require('../models');

async function connectDatabase() {
  await db.sequelize.authenticate();
  console.log('Database connection successfully.');

  await db.sequelize.sync({ alter: true });
  console.log('Database synchronized.');
}

module.exports = connectDatabase;
