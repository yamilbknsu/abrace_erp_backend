const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');

// Validate token import
const validateToken = require('../validateToken.js');
const permissionCheck = require('../permissionChecking.js');        // We get req.permissions

// Valdiation Schemas
const userValidationSchema = Joi.object().keys({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email()
}).unknown(true);

// General get query
// We include the validateToken middleware
router.get('/', validateToken, async (req, res) => {
    try{
        console.log(req.verified);
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});

// Registering a new user
router.post('/register/', validateToken, permissionCheck, async (req, res) => {
    // Check if logged user has the permissions
    valid_permissions = ['admin']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = userValidationSchema.validate(req.body);
    if (validation.error) res.status(400).send(validation.error);

    // Check if username exists
    const userExists = await User.findOne({username: req.body.username});
    if (userExists) return res.status(400).send('Username already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    user_data = {
        username: req.body.username,
        pw_hash: hashedPassword,
        displayname: req.body.displayname,
        email: req.body.email
    }

    if (req.body.permissions !== undefined){
        user_data.permissions = req.body.permissions;
    }

    const new_user = User(user_data);

    new_user.save()
            .then(data => {
                res.json({userid: data._id});
            }).catch(err => {
                res.json({message: err});
            });
});

// Login to the API
router.post('/login/', async (req, res) =>{
    // Validation
    const validation = userValidationSchema.validate(req.body);
    if (validation.error) return res.status(400)
                        .send({"ok": false, "message": validation.error.message});

    // Check if username exists
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send({"message": "Nombre o contraseña invalidos."});

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.pw_hash);
    if (!validPassword) return res.status(400).send({"message": "Nombre o contraseña invalidos."});

    const token = jwt.sign({userid: user._id}, process.env.TOKEN_SECRET, {"expiresIn": "10min"});
    res.header('auth-token', token).send({message: 'Succesfully logged',
        userid: user._id, username: user.username, displayname: user.displayname,
        email: user.email, token, expiresIn: "600"});
});



// Create a test user
router.post('/createTestUser', (req, res) => {
    //const new_user = User({
    //    username: 'test_user',
    //    pw_hash: 'myTestPassword',
    //    displayname: 'Test User',
    //    email: 'asdasdas@test.com'
    //});
//
    //new_user.save()
    //        .then(data => {
    //            res.json(data);
    //        }).catch(err => {
    //            res.json({message: err});
    //        });
    res.send('Ok champ.')
});

module.exports = router;