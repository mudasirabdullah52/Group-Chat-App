const express = require('express');
const authnticateUser = require('../Middleware/auth');
const chatController = require('../Controllers/chatController');


const chatRoutes = express.Router();
chatRoutes.get('/mainDashboard', chatController.getchatMainHomePage);
chatRoutes.get('/chatRoom', chatController.getChatRoom);
chatRoutes.post('/sendMessage', authnticateUser.authenticate, chatController.sendChat);
chatRoutes.get('/readMessages/:groupId', chatController.getAllMessages);

module.exports = chatRoutes;