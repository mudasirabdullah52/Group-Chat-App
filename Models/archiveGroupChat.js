const Sequelize = require("sequelize");
const sequelize = require("../dbConnection");


const ArchiveGroupChatModel = sequelize.define('ArchiveGroupChat', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ImageUrl: {
        type: Sequelize.TEXT,

    },
    isImage: {
        type: Sequelize.BOOLEAN
    },
    messageText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    currentTime: {
        type: Sequelize.STRING,
        allowNull: false
    },
    UserId: {
        type: Sequelize.INTEGER,
    },
    groupId: {
        type: Sequelize.INTEGER,
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }
});

module.exports = ArchiveGroupChatModel;