const Sequelize = require("sequelize");

const sequelize = new Sequelize('chat-app-db', 'root', 'Mudasir@1231', {
    host: 'localhost',
    dialect: 'mysql',

});

module.exports = sequelize;
