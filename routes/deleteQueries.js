const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Validate token import
const validateToken = require('../validateToken.js');               // We get req.verified
const permissionCheck = require('../permissionChecking.js');        // We get req.permissions

// Models import
const Direccion = require('../models/Direccion.js');
const Persona = require('../models/Persona.js');
const Mandante = require('../models/Mandante.js');
const Propiedad = require('../models/Propiedad.js');
const Mandato = require('../models/Mandato.js');
const Contrato = require('../models/Contrato.js');
const Boleta = require('../models/Boleta.js');


// Delete propiedad
router.delete('/propiedades/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-propiedad']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    const propiedad = await Propiedad.findOne({_id: req.query.id});
    if (!propiedad) return res.status(400).send("Propiedad not registered");

    // Delete first document that matches 
    // the condition i.e age >= 10 
    Propiedad.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

// Delete direccion
router.delete('/direcciones/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-direccion']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    const direccion = await Direccion.findOne({_id: req.query.id});
    if (!direccion) return res.status(400).send("Dirección not registered");

    // Delete first document that matches 
    // the condition i.e age >= 10 
    Direccion.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

// Delete persona
router.delete('/personas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-persona']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    const persona = await Persona.findOne({_id: req.query.id});
    if (!persona) return res.status(400).send("Persona not registered");

    // Delete first document that matches 
    // the condition i.e age >= 10 
    Persona.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

// Delete mandato
router.delete('/mandatos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    const mandato = await Mandato.findOne({_id: req.query.id});
    if (!mandato) return res.status(400).send("Mandato not registered");

    // Delete first document that matches 
    // the condition
    Mandato.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

// Delete contrato
router.delete('/contratos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    const contrato = await Contrato.findOne({_id: req.query.id});
    if (!contrato) return res.status(400).send("Contrato not registered");

    // Delete first document that matches 
    // the condition
    Contrato.deleteOne({ _id: { $eq: req.query.id } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

// Delete boletas
router.delete('/boletas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'delete-all', 'delete-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if propiedad exists
    //const boletas = await Boletas.find({contrato: req.query.contratoid});
    //if (!boletas) return res.status(400).send("Contrato not registered");

    // Delete first document that matches 
    // the condition
    Boleta.remove({ contrato: { $eq: req.query.contratoid } }).then(function(){ 
        res.json("Data deleted");
    }).catch(function(error){ 
        res.json({message: error});
    });
});

module.exports = router;