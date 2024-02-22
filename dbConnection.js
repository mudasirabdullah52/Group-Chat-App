const Sequelize = require("sequelize");

// const sequelize = new Sequelize('chatdb', 'root', 'Mudasir@1231', {
//     host: 'localhost',
//     dialect: 'mysql',

// });
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.HOST,
    port: 10617,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    pool: {
        max: 5, // Adjust according to your needs
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

module.exports = sequelize;
