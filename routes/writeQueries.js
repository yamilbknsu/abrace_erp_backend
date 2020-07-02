const express = require('express');
const router = express.Router();

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

// validationScehmas import
const {direccionValidationSchema,
       personaValidationSchema,
       mandanteValidationSchema,
       propiedadValidationSchema,
       mandatoValidationSchema,
       contratoValidationSchema,
       validateRUT} = require('../validation.js');

// Write a contrato
router.post('/contratos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = contratoValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if rut exists
    const contrato = await Contrato.findOne({propiedad: req.body.propiedad,
                                             arrendatario: req.body.arrendatario,
                                             fechaInicio: req.body.fechaInicio});
    if (contrato) return res.status(400).send("Contrato already registered");
    
    //TODO: Check if the last one is closed

    const new_contrato = Contrato(req.body);
    new_contrato.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Write a mandato
router.post('/mandatos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = mandatoValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if rut exists
    const mandato = await Mandato.findOne({propiedad: req.body.propiedad,
                                           fechaInicio: req.body.fechaInicio});
    if (mandato) return res.status(400).send("Mandato already registered");
    
    //TODO: Check if the last one is closed

    const new_mandato = Mandato(req.body);
    new_mandato.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Write a propiedad
router.post('/propiedades/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-propiedad']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = propiedadValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if rut exists
    const propiedad = await Propiedad.findOne({uId: req.body.uId});
    if (propiedad) return res.status(400).send("Propiedad already registered");

    const new_propiedad = Propiedad(req.body);
    new_propiedad.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Write a Mandante
router.post('/mandantes/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-mandante']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = mandanteValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if rut exists
    const mandante = await Mandante.findOne({personaID: req.body.personaID});
    if (mandante) return res.status(400).send("Persona already registered as a mandante");

    const new_mandate = Mandante(req.body);
    new_mandate.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});


// Write a Persona
router.post('/personas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-persona']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = personaValidationSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);
    if (!validateRUT(req.body.rut, req.body.dv)) return res.status(400).send('Rut invalido');

    // Check if rut exists
    const persona = await Persona.findOne({rut: req.body.rut});
    if (persona) return res.status(400).send("Rut already exists");

    const new_persona = Persona(req.body);
    new_persona.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Write a Dirección
router.post('/direcciones/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-direccion']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = direccionValidationSchema.validate(req.body);
    if (validation.error) return res.send(validation.error);

    const new_direccion = Direccion(req.body);
    new_direccion.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

module.exports = router;