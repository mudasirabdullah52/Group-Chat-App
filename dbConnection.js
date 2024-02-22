const Sequelize = require("sequelize");

// const sequelize = new Sequelize('chatdb', 'root', 'Mudasir@1231', {
//     host: 'localhost',
//     dialect: 'mysql',

// });
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'groupchatapp-myprojectt.a.aivencloud.com',
    port: 10617,
    username: 'avnadmin',
    password: 'AVNS_MzT6WhP1gRr5eFmTSjj',
    database: 'defaultdb',
    pool: {
        max: 5, // Adjust according to your needs
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});



module.exports = sequelize;
