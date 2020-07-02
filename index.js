// Package importing
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

// Routes
const authRoute = require('./routes/auth');
const writeRoute = require('./routes/writeQueries');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routing
app.use('/api/auth', authRoute);
app.use('/api/write', writeRoute);

app.get('/', (req, res)=>{
    res.status(200).send("It's working!");
})

// Connect to DB
mongoose.connect(process.env.DB_CONN, 
                 {useNewUrlParser: true, useUnifiedTopology: true},
                 () => console.log('Connected to DB!'));

// Start the server
app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));