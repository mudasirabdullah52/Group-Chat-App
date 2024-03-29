const express = require('express');
const sequelize = require('./dbConnection');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./Routes/routes');
const userRoute = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const User = require('./Models/userModel');
const forgetPassword = require('./Models/forgetPasswordModel');
const Group = require('./Models/groupsModel');
const UserGroup = require('./Models/userGroupsModel');
const chatMessage = require('./Models/groupChatModel');
const Middleware = require('./Middleware/cron');
const path = require('path');
const multer = require('multer');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: ["https://admin.socket.io",],
        credentials: true
    }
});


io.on("connection", (socket) => {
    console.log("connecte ")
    socket.on('new-group-message', (groupId) => {
        socket.broadcast.emit('group-message', groupId);
    })
});


const port = 5000;
const dotenv = require('dotenv');
// get config var5
dotenv.config();


// app.use(express.static('Views'));
app.use(express.static(path.join(__dirname, 'Views')));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


Middleware.job.start();
// Rotuers
app.use("/user", userRoute);
app.use("/chat", chatRoutes);
app.use(router);

User.hasMany(forgetPassword);
forgetPassword.belongsTo(User);

User.hasMany(chatMessage);
chatMessage.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

chatMessage.belongsTo(Group);
Group.hasMany(chatMessage);

Group.belongsTo(User, { foreignKey: 'AdminId', constraints: true, onDelete: 'CASCADE' })



sequelize
    .sync({ force: true })
    .then(() => {
        // Start the server after syncing models
        http.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error syncing models:', err));

// Socket 

