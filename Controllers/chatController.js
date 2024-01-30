const path = require('path');
const User = require('../Models/userModel');
const sequelize = require('../dbConnection');

exports.getchatMainHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "mainDashboard.html"));
}