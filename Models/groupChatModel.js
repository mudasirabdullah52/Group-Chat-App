const Sequelize = require("sequelize");
const sequelize = require("../dbConnection");


const GroupchatModel = sequelize.define('GroupchatModel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    messageText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    currentTime: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = GroupchatModel;