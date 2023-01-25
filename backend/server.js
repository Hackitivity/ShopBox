const express = require('express');
const { DatabaseConnect } = require('./database/Database');
const cors = require('cors');
const app = express();

require('dotenv').config({
    path: './config.env',
});

// Connect to database
DatabaseConnect();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/users', require('./routes/UserRoute'));



//Server
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));