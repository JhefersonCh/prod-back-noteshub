const { Sequelize } = require("sequelize");
const { config } = require("./environment");

const database = config.DB_DATABASE;
const username = config.DB_USER;
const password = config.DB_PASSWORD;
const host = config.DB_HOSTPG;
const port = config.DB_PORT

const sequelize = new Sequelize(database, username, password, {
	host: host,
  port: port,
	dialect: "postgresql"
});

module.exports = {
	sequelize,
};