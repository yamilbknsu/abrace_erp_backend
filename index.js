// Package importing
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

// Routes
const authRoute = require('./routes/auth');
const writeRoute = require('./routes/writeQueries');
const readRoute = require('./routes/readQueries');
const updateRoute = require('./routes/updateQueries');
const deleteRoute = require('./routes/deleteQueries');

const app = express();

// Middleware
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, auth-token');

    res.header('Access-Control-Expose-Headers', 'auth-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Routing
app.use('/api/auth', authRoute);
app.use('/api/write', writeRoute);
app.use('/api/read', readRoute);
app.use('/api/update', updateRoute);
app.use('/api/delete', deleteRoute);

app.get('/', (req, res)=>{
    res.status(200).send("It's working!");
})

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// Connect to DB
mongoose.connect(process.env.DB_CONN, 
                 {useNewUrlParser: true, useUnifiedTopology: true},
                 () => console.log('Connected to DB!'));

// Start the server
app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));
