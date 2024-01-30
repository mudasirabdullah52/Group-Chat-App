const express = require('express');
// const authnticateUser = require('../Middleware/auth');
const chatController = require('../Controllers/chatController');


const chatRoutes = express.Router();
chatRoutes.get('/mainDashboard', chatController.getchatMainHomePage);



module.exports = chatRoutes;