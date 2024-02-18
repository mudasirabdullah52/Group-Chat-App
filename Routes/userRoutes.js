const express = require('express');
const authnticateUser = require('../Middleware/auth');
const userController = require('../Controllers/usersController');

const userRoute = express.Router();

userRoute.get("/login", userController.getLoginPage);
userRoute.get('/register', userController.getRegistrationPage);
userRoute.post('/addUser', userController.postRegistrationData);
userRoute.post('/check-login', userController.checkLogin);
userRoute.post('/SendforgetPasswordLink', userController.SendforgetPasswordLink);
userRoute.get('/forgetPassword/:id', userController.getForgetPasswordPage);
userRoute.post('/updatePasswordData', userController.updatePasswordData);
userRoute.get('/profileDetails/', authnticateUser.authenticate, userController.getUserProfile);

userRoute.get('/getUsers', userController.getUserList);
userRoute.post('/createGroup', authnticateUser.authenticate, userController.createGroup);
userRoute.get('/usergroups', authnticateUser.authenticate, userController.getGroupList);
userRoute.get('/showUsersOfGroup/:groupId', authnticateUser.authenticate, userController.getUserOfGroup);
userRoute.put('/updateGroup/:id', authnticateUser.authenticate, userController.updateUserGroup);

module.exports = userRoute;