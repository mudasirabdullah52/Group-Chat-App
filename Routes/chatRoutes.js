const express = require('express');
const multer = require('multer');
const authnticateUser = require('../Middleware/auth');
const path = require('path');
const chatController = require('../Controllers/chatController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });


const chatRoutes = express.Router();
chatRoutes.get('/mainDashboard', chatController.getchatMainHomePage);
chatRoutes.get('/chatRoom', chatController.getChatRoom);
chatRoutes.post('/sendMessage', authnticateUser.authenticate, chatController.sendChat);
chatRoutes.post('/sendImage', upload.single('image'), authnticateUser.authenticate, chatController.sendImage);
chatRoutes.get('/readMessages/:groupId', chatController.getAllMessages);

module.exports = chatRoutes;