const Sequelize = require("sequelize");

const sequelize = new Sequelize('chatdb', 'root', 'Mudasir@1231', {
    host: 'localhost',
    dialect: 'mysql',

});

module.exports = sequelize;
