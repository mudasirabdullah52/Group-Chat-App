const User = require('../Models/userModel');
const GroupModel = require('../Models/groupsModel');
const userGroupsModel = require('../Models/userGroupsModel');
const forgetPasswordModel = require('../Models/forgetPasswordModel');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { env } = require('process');
const nodemailer = require('nodemailer');

//Rendering Login page
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "login.html"));
};

//Rendering Registration page
exports.getRegistrationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "register.html"));
};

exports.postRegistrationData = async (req, res) => {

    const { nameInput, phoneInput, emailInput, passwordInput } = req.body

    console.log(nameInput, phoneInput, emailInput, passwordInput, '"controlelr"');
    try {
        const passWord = await bcrypt.hash(passwordInput, 10);
        const user = await User.create({
            name: nameInput,
            phoneNo: phoneInput,
            email: emailInput,
            password: passWord
        });
        const group = await GroupModel.findByPk(1);
        group.addUsers(user.id);
        res.status(201).json({ message: 'success' });
    } catch (err) {

        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: 'exist' });
        }
        else {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const generateAccessToken = (id, name,) => {
    return jwt.sign({ userId: id, name: name }, 'secretkey');
}

exports.checkLogin = async (req, res) => {
    const body = req.body;

    const { email, password } = body;

    console.log(email, password);
    try {
        let data = await User.findOne({
            where: {
                email: email
            },

        });

        console.log(data.password);
        if (data) {
            const checkLogin = await bcrypt.compare(password, data.password);
            if (checkLogin) {
                res.status(201).json({ message: 'success', token: generateAccessToken(data.id, data.name) });
                // res.status(201).json({ message: 'success' });
            } else {
                res.status(401).json({ message: 'Failed' });
            }
        } else {
            res.status(404).json({ message: 'NotExist' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.SendforgetPasswordLink = async (req, res) => {
    try {
        const email = req.body.emailId;
        console.log(email);
        const id = uuidv4();
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log(user.id)
            await forgetPasswordModel.create({
                id: id,
                UserId: user.id
            });
            // sending froget password link to user 

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mudasirabdullah773@gmail.com',
                    pass: process.env.EMAILPASSWORD
                },
            });

            // Email options
            const mailOptions = {
                from: 'mudasirabdullah773@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: 'Text content of your email',
                html: `<b>Dear ${user.name}</b> </br>
                <p>You have got the reset password request from 
                you if you want to rest the password please click on the given link </br>
                <a href="https://dark-gray-prawn-sari.cyclic.app/user/forgetPassword/${id}">click</a> 
                </p> `,
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    res.status(202).json({ message: 'success' });
                    console.log('Email sent:', info.response);
                }
            });
        } else {
            res.status(404).json({ message: 'User Not Found Check email address!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    // console.log(process.env.EMAILPASSWORD)
};
exports.getForgetPasswordPage = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await forgetPasswordModel.findOne({ where: { id: id, isactive: 1 } });
        if (response) {

            try {

                await response.update({ isactive: 0 });

                res.sendFile(path.join(__dirname, '..', "Views", "forgetPasswordPage.html"));
            } catch (error) {

                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            res.status(404).json({ message: 'Url Not Exist Check Url' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updatePasswordData = async (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    try {
        const response = await forgetPasswordModel.findOne({ where: { id: id } });
        const userId = response.UserId;
        const passWordHashed = await bcrypt.hash(password, 10);
        console.log("password", passWordHashed);
        await User.update({ password: passWordHashed }, { where: { id: userId } });
        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getUserProfile = async (req, res) => {

    try {

        let result = await User.findOne({ where: { id: req.user.id } })
        res.status(200).json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.getUserList = async (req, res) => {

    try {

        let result = await User.findAll()
        res.status(200).json(result)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
exports.createGroup = async (req, res) => {
    let AdminId = req.user.id;
    const { name, nomember, userList } = req.body
    try {
        let group = await GroupModel.create({
            name: name,
            nomember: nomember,
            AdminId: AdminId
        })
        // Associate the users with the group
        const users = await User.findAll({ where: { id: userList } });

        await group.addUsers(users);

        res.status(201).json({ message: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.getGroupList = async (req, res) => {

    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: GroupModel, through: userGroupsModel }],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const groups = user.groups; // Access the associated groups
        return res.status(200).json(groups);
        // console.log(user);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
}
exports.getUserOfGroup = async (req, res) => {

    const id = req.params.groupId;

    try {

        const group = await GroupModel.findOne({ where: { id: id } });
        const members = await group.getUsers();
        return res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateUserGroup = async (req, res) => {
    let UserId = req.user.id;
    let groupId = req.params.id;
    const { name, nomember, userList } = req.body
    const group = await GroupModel.findOne({ where: { id: groupId } });

    // console.log(name, nomember, userList, "groid:", groupId, "userId:", )
    try {
        const updatedGroup = await group.update({
            name: name,
            nomember: nomember,
            AdminId: UserId
        })
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(userList);

        return res.status(200).json({ message: "success" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}