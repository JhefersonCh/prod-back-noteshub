const { Sequelize } = require("sequelize");

const database = "notes";
const username = "postgres";
const password = "root";
const host = "localhost";

const sequelize = new Sequelize(database, username, password, {
	host: host,
	dialect: "postgres",
});

module.exports = {
	sequelize,
};