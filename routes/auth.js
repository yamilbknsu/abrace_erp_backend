const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Models
const User = require('../models/User');
const Direccion = require('../models/Direccion.js');
const Persona = require('../models/Persona.js');
const Mandante = require('../models/Mandante.js');
const Propiedad = require('../models/Propiedad.js');
const Mandato = require('../models/Mandato.js');
const Contrato = require('../models/Contrato.js');
const Boleta = require('../models/Boleta.js');
const Reajuste = require('../models/Reajuste.js');
const Pago = require('../models/Pago.js');
const Liquidacion = require('../models/Liquidacion');
const CierreMes = require('../models/CierreMes.js');
const Egreso = require('../models/Egreso.js');
const Ingreso = require('../models/Ingreso.js');
const Parametro = require('../models/Parametro.js');

// Validate token import
const validateToken = require('../validateToken.js');
const permissionCheck = require('../permissionChecking.js');        // We get req.permissions

// validationScehmas import
const {validationOptions} = require('../validation.js');

// Valdiation Schemas
const userValidationSchema = Joi.object().keys({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email()
}).unknown(true);

// Valdiation Schemas
const userNoPassValidationSchema = Joi.object().keys({
    username: Joi.string().min(6).required(),
    email: Joi.string().email()
}).unknown(true);

// General get query
// We include the validateToken middleware
router.get('/', validateToken, permissionCheck, async (req, res) => {
    // Check if logged user has the permissions
    valid_permissions = ['admin']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
        
    try{
        //console.log(req.verified);
        const users = await User.find();
        res.json(users.map(user => ({_id: user.id, displayname: user.displayname, username: user.username, email: user.email, permissions: user.permissions,
                                     creationDate: user.creationDate, inflinea1: user.inflinea1, inflinea2: user.inflinea2})));
    }catch(err){
        res.json({message: err});
    }
});

router.get('/self', validateToken, permissionCheck, async (req, res) => {
    try{
        user = await User.findOne({_id: req.verified.userid});
        user['pw_hash'] = undefined;
        res.json(user);
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
    const validation = userValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if username exists
    const userExists = await User.findOne({username: req.body.username});
    if (userExists) return res.status(400).send('Nombre de usuario ya existe');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    user_data = {
        username: req.body.username,
        pw_hash: hashedPassword,
        displayname: req.body.displayname,
        email: req.body.email,
        permissions: req.body.permissions !== undefined ? req.body.permissions : [],
        creationDate: new Date(),
        inflinea1: req.body.inflinea1 ? req.body.inflinea1 : '',
        inflinea2: req.body.inflinea2 ? req.body.inflinea2 : ''
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

    const token = jwt.sign({userid: user._id}, process.env.TOKEN_SECRET, {"expiresIn": "20min"});
    res.header('auth-token', token).send({message: 'Succesfully logged',
        userid: user._id, username: user.username, displayname: user.displayname, permissions: user.permissions,
        email: user.email, token, expiresIn: "1200", inflinea1: user.inflinea1, inflinea2: user.inflinea2});
});

// Update user
router.post('/user/', validateToken, permissionCheck, async (req, res) => {
    if(req.query.id && req.query.id == req.verified.userid){
        // Updating self
    }
    else{
        // Check if logged user has the permissions
        valid_permissions = ['admin']
        if(!req.permissions.some(p => valid_permissions.includes(p))) 
            return res.status(403).send('Forbidden access - lacking permission to perform action');
    }

    // Validation
    const validation = userNoPassValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if username exists
    const userExists = await User.findOne({username: req.body.username});
    if (!userExists) return res.status(400).send('Nombre de usuario no existe');

    var hashedPassword = undefined;
    if(req.body.password){
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
    }else{
        hashedPassword = userExists.pw_hash
    }

    
    user_data = {
        username: req.body.username,
        pw_hash: hashedPassword,
        displayname: req.body.displayname,
        email: req.body.email,
        permissions: req.body.permissions !== undefined ? req.body.permissions : [],
        creationDate: userExists.creationDate,
        inflinea1: req.body.inflinea1 ? req.body.inflinea1 : '',
        inflinea2: req.body.inflinea2 ? req.body.inflinea2 : ''
    }

    User.findByIdAndUpdate(req.query.id, user_data, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update user
router.delete('/user/', validateToken, permissionCheck, async (req, res) => {
    valid_permissions = ['admin']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const userExists = await User.findOne({_id: req.query.id});
    if (!userExists) return res.status(400).send('Nombre de usuario no existe');

    Direccion  .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Persona    .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Mandante   .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Propiedad  .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Mandato    .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Contrato   .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Boleta     .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Reajuste   .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Pago       .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Liquidacion.remove({userid: ObjectId(req.query.id)}, ()=>{})
    CierreMes  .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Egreso     .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Ingreso    .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Parametro  .remove({userid: ObjectId(req.query.id)}, ()=>{})
    Reajuste   .remove({userid: ObjectId(req.query.id)}, ()=>{})

    // Delete first document that matches 
    // the condition
    User.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
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
