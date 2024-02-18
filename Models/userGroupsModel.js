const Sequelize = require("sequelize");
const sequelize = require("../dbConnection");

const UserGroup = sequelize.define("usergroup", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

}, {
    timestamps: false
});

module.exports = UserGroup;