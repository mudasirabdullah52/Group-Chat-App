const path = require('path');
const User = require('../Models/userModel');
const GroupchatModel = require('../Models/groupChatModel')
const sequelize = require('../dbConnection');

exports.getchatMainHomePage = (req, res) => {

    res.sendFile(path.join(__dirname, '..', "Views", "mainDashboard.html"));
}
exports.getChatRoom = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "chatRoom.html"));
}

exports.sendChat = async (req, res) => {

    const { messageText, groupId } = req.body
    var currentTime = new Date
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var meridiem = (hours >= 12) ? 'PM' : 'AM';
    hours = (hours > 12) ? hours - 12 : hours;
    hours = (hours === 0) ? 12 : hours;
    var formattedTime = hours + ':' + minutes + ' ' + meridiem;
    console.log(formattedTime)

    try {
        await GroupchatModel.create({
            messageText: messageText,
            UserId: req.user.id,
            currentTime: formattedTime,
            groupId: groupId
        });
        res.status(201).json({ message: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.getAllMessages = async (req, res) => {
    let groupId = req.params.groupId;
    try {

        let result = await GroupchatModel.findAll({
            include: [
                {
                    model: User,
                    attibutes: ['UserId', 'name']
                }
            ],
            where: { groupId: groupId },
            order: [['createdAt', 'DESC']],
            limit: 10
        })
        result = result.reverse();

        res.status(200).json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.sendImage = async (req, res) => {

    var currentTime = new Date
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var meridiem = (hours >= 12) ? 'PM' : 'AM';
    hours = (hours > 12) ? hours - 12 : hours;
    hours = (hours === 0) ? 12 : hours;
    var formattedTime = hours + ':' + minutes + ' ' + meridiem;
    console.log(formattedTime)
    let { messageText, groupId } = req.body
    const image = req.file;
    console.log(image.path);
    if (messageText == null) {
        messageText = 'New Image'
    }

    try {
        await GroupchatModel.create({
            messageText: messageText,
            UserId: req.user.id,
            currentTime: formattedTime,
            ImageUrl: image.path,
            isImage: true,
            groupId: groupId
        });
        res.status(201).json({ message: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}