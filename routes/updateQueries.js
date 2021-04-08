const express = require('express');
const router = express.Router();

// Validate token import
const validateToken = require('../validateToken.js');               // We get req.verified
const permissionCheck = require('../permissionChecking.js');        // We get req.permissions
const updateCleaner = require('../updateRequestCleaner.js');        // Clean the request

// Models import
const Direccion = require('../models/Direccion.js');
const Persona = require('../models/Persona.js');
const Mandante = require('../models/Mandante.js');
const Propiedad = require('../models/Propiedad.js');
const Mandato = require('../models/Mandato.js');
const Contrato = require('../models/Contrato.js');
const Boleta = require('../models/Boleta.js');

// validationScehmas import
const {direccionValidationSchema,
       personaValidationSchema,
       mandanteValidationSchema,
       propiedadValidationSchema,
       mandatoValidationSchema,
       contratoValidationSchema,
       validateRUT} = require('../validation.js');
const Parametro = require('../models/Parametro.js');

// Update a propiedad
router.post('/propiedades/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-propiedad']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = propiedadValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if propiedad exists
    const propiedad = await Propiedad.findOne({_id: req.query.id});
    if (!propiedad) return res.status(400).send("Propiedad not registered");

    Propiedad.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a persona
router.post('/personas/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-persona']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = personaValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);
    if (!validateRUT(req.body.rut, req.body.dv)) return res.status(400).send('Rut invalido');

    // Check if propiedad exists
    const persona = await Persona.findOne({_id: req.query.id});
    if (!persona) return res.status(400).send("Persona not registered");

    Persona.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a direccion
router.post('/direcciones/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-direccion']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = direccionValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if direccion exists
    const direccion = await Direccion.findOne({_id: req.query.id});
    if (!direccion) return res.status(400).send("Direccion not registered");

    Direccion.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a parametro
router.post('/parametros/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{

    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-parametro']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if direccion exists
    const parametro = await Parametro.findOne({concept: req.query.concept});
    if (!parametro) return res.status(400).send("Parametro not registered");

    Parametro.updateOne({concept: req.query.concept}, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a mandato
router.post('/mandatos/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = mandatoValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if direccion exists
    const mandato = await Mandato.findOne({_id: req.query.id});
    if (!mandato) return res.status(400).send("Mandato not registered");
    
    
    Mandato.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a userparam
router.post('/userparam/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-parametro']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if direccion exists
    const parametro = await Parametro.findOne({_id: req.query.id});
    if (!parametro) return res.status(400).send("Parametro not registered");
    
    
    Parametro.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a contrato
router.post('/contratos/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    // Validation
    const validation = contratoValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if direccion exists
    const contrato = await Contrato.findOne({_id: req.query.id});
    if (!contrato) return res.status(400).send("Contrato not registered");
    
    
    Contrato.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a contrato
router.post('/closecontrato/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Check if direccion exists
    const contrato = await Contrato.findOne({_id: req.query.id});

    console.log(contrato)

    if (!contrato) return res.status(400).send("Contrato not registered");
    if(contrato.fechatermino) return res.send({message: 'OK'});

    if(!req.query.fechatermino) return res.status(400).send("Fecha de termino no ingresada");
    contrato.fechatermino = req.query.fechatermino
    contrato.estado = 'Cerrado';
    
    Contrato.findByIdAndUpdate(req.query.id, contrato, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

// Update a boleta
router.post('/boletas/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'update-all', 'update-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');


    // Check if direccion exists
    const boleta = await Boleta.findOne({_id: req.query.id});
    if (!boleta) return res.status(400).send("Boleta not registered");
    
    
    Boleta.findByIdAndUpdate(req.query.id, req.body, (err, model) => {
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(model)
        }
    });
});

module.exports = router;