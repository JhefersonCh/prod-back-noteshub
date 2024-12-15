const { Sequelize } = require('sequelize');

const database = process.env.DB_DATABASE;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOSTPG;
const port = process.env.DB_PORT;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'postgresql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  sequelize,
};
