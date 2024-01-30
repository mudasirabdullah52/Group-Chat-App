const express = require('express');
const sequelize = require('./dbConnection');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./Routes/routes');
const userRoute = require('./Routes/userRoutes');
const chatRoute = require('./Routes/chatRoutes');

const path = require('path');

const app = express();
const port = 3000;
const dotenv = require('dotenv');
// get config vars
dotenv.config();



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Rotuers
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use(router);



sequelize
    .sync({ force: false })
    .then(() => {
        // Start the server after syncing models
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error syncing models:', err));

