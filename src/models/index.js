const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

const User = sequelize.define(
	"users",
	{
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
		email: {
			type: DataTypes.STRING,
			allowNull: false,
      validate: {
        isEmail: true
      }
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
      validate: {
        min: 10
      }
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: "users" }
);

const Note = sequelize.define(
	"notes",
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Pending"
    },
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{ tableName: "notes" }
);

const RefreshToken = sequelize.define(
	"refreshToken",
	{
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		expiration: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{ tableName: "refreshToken" }
);

RefreshToken.verifyExpiration = (token) => {
  return token.expiration.getTime() < new Date().getTime();
}
 
User.hasMany(Note, { as: "notes", foreignKey: "userId" });
Note.belongsTo(User, {
	foreignKey: "userId",
});
RefreshToken.belongsTo(User, {
	foreignKey: "userId",
});

module.exports = {
	User,
	Note,
  RefreshToken
};
