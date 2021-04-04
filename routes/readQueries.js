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
const Parametro = require('../models/Parametro.js');
const Boleta = require('../models/Boleta.js');
const CierreMes = require('../models/CierreMes.js');
const Reajuste = require('../models/Reajuste.js');

// Read propiedades
router.get('/propiedades/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-propiedad']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const users = await Propiedad.aggregate([{"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
                                                 {"$lookup" : {
                                                        "localField": "direccion",
                                                        "from" : "direcciones",
                                                        "foreignField": "_id",
                                                        "as" : "direccionData"
                                                 }},
                                                 {"$lookup" : {
                                                    "localField": "mandante",
                                                    "from" : "personas",
                                                    "foreignField": "_id",
                                                    "as" : "mandanteData"
                                                 }},
                                                 {"$lookup" : {
                                                     "localField": "administrador",
                                                     "from" : "personas",
                                                     "foreignField": "_id",
                                                     "as" : "administradorData"
                                                 }},
                                                 {"$unwind": {"path": "$direccionData", 'preserveNullAndEmptyArrays': true}},
                                                 {"$unwind": {"path": "$mandanteData", 'preserveNullAndEmptyArrays': true}},
                                                 {"$unwind": {"path": "$administradorData", 'preserveNullAndEmptyArrays': true}},
                                                 {"$lookup":{
                                                    'from': 'contratos',
                                                    'as': 'lastcontrato',
                                                    "let": { "id": "$_id" },
                                                    "pipeline": [
                                                        {"$match":{
                                                          "$expr": { "$eq": [ "$$id", "$propiedad" ] }
                                                        }},
                                                        { "$sort": { "fechacontrato": -1 } },
                                                        { "$limit": 1 }
                                                      ]
                                                  }},
                                                {'$unwind': {"path": '$lastcontrato', 'preserveNullAndEmptyArrays': true}},
                                                {"$lookup": {
                                                    "localField": "lastcontrato.arrendatario",
                                                    "from": "personas",
                                                    "foreignField": "_id",
                                                    "as": "lastcontrato.arrendatarioData"
                                                }},
                                                {'$unwind': {"path": '$lastcontrato.arrendatarioData', 'preserveNullAndEmptyArrays': true}}]);
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});

// Read direccion
router.get('/direcciones/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-direccion']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const direcciones = await Direccion.find({...{userid: req.verified.userid}, ...req.query});
        res.json(direcciones);
    }catch(err){
        res.json({message: err});
    }
});

// Read Personas
router.get('/personas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-persona']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    try{
        const users = await Persona.aggregate([{"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
                                                 {"$lookup" : {
                                                        "localField": "dirParticular",
                                                        "from" : "direcciones",
                                                        "foreignField": "_id",
                                                        "as" : "dirParticularData"
                                                 }},
                                                 {"$lookup" : {
                                                    "localField": "dirComercial",
                                                    "from" : "personas",
                                                    "foreignField": "_id",
                                                    "as" : "dirComercialData"
                                                 }},
                                                 {"$unwind": {"path": "$dirParticularData", 'preserveNullAndEmptyArrays': true}},
                                                 {"$unwind": {"path": "$dirComercialData", 'preserveNullAndEmptyArrays': true}}]);
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});

// Read mandatos
router.get('/mandatos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const mandatos = await Mandato.find({...{userid: req.verified.userid}, ...req.query});
        res.json(mandatos);
    }catch(err){
        res.json({message: err});
    }
});

// Read parametros
router.get('/parametros/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-parametro']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        // const parametros = await Parametro.find({...{userid: req.verified.userid}, ...req.query});
        const parametros = await Parametro.find({...req.query});
        res.json(parametros);
    }catch(err){
        res.json({message: err});
    }
});

// Read contratos
router.get('/contratos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const contratos = await Contrato.find({...{userid: req.verified.userid}, ...req.query});
        res.json(contratos);
    }catch(err){
        res.json({message: err});
    }
});

// Read boletas
router.get('/boletas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const boletas = await Boleta.find({...{userid: req.verified.userid}, ...req.query});
        res.json(boletas);
    }catch(err){
        res.json({message: err});
    }
});

// Read userparam
router.get('/userparam/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-parametro']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const parametros = await Parametro.find({...{userid: req.verified.userid}, ...req.query});
        if(parametros.length == 0){
            const new_parametro = Parametro({userid: req.verified.userid, concept: req.query.concept, values: []});
            new_parametro.save()
                        .then(data => {
                            if(!res.headersSent) res.json([data]);
                        }).catch(err => {
                            if(!res.headersSent) res.json({message: err});
                        });
        }else{
            if(!res.headersSent) res.json(parametros);
        }
    }catch(err){
        if(!res.headersSent) res.json({message: err});
    }
});

// Read cierremes
router.get('/cierresmes/', validateToken, permissionCheck, async (req, res) => {
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    try{
        const cierresMes = await CierreMes.aggregate([{"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
                                                      {"$unwind": {path: "$boletas", preserveNullAndEmptyArrays: true}},
                                                      {"$unwind": {path: "$reajustes", preserveNullAndEmptyArrays: true}},
                                                      {"$lookup": {from: 'boletas', localField: 'boletas', foreignField: '_id', as: 'boletaData'}},
                                                      {"$lookup": {from: 'reajustes', localField: 'reajustes', foreignField: '_id', as: 'reajusteData'}},
                                                      {"$unwind": {path: "$reajusteData", preserveNullAndEmptyArrays: true}},
                                                      {"$unwind": {path: "$boletaData", preserveNullAndEmptyArrays: true}},
                                                      {"$lookup": {from: 'contratos', localField: 'boletaData.contrato', foreignField: '_id', as: 'boletaData.contratoData'}},
                                                      {"$lookup": {from: 'contratos', localField: 'reajusteData.contrato', foreignField: '_id', as: 'reajusteData.contratoData'}},
                                                      {"$unwind": {path: "$reajusteData.contratoData", preserveNullAndEmptyArrays: true}},
                                                      {"$unwind": {path: "$boletaData.contratoData", preserveNullAndEmptyArrays: true}},
                                                      {"$lookup": {from: 'propiedades', localField: 'reajusteData.contratoData.propiedad', foreignField: '_id', as: 'reajusteData.propiedadData'}},
                                                      {"$lookup": {from: 'propiedades', localField: 'boletaData.contratoData.propiedad', foreignField: '_id', as: 'boletaData.propiedadData'}},
                                                      {"$unwind": {path: "$reajusteData.propiedadData", preserveNullAndEmptyArrays: true}},
                                                      {"$unwind": {path: "$boletaData.propiedadData", preserveNullAndEmptyArrays: true}},
                                                      {"$lookup": {from: 'direcciones', localField: 'boletaData.propiedadData.direccion', foreignField: '_id', as: 'boletaData.propiedadData.direccionData'}},
                                                      {"$lookup": {from: 'direcciones', localField: 'reajusteData.propiedadData.direccion', foreignField: '_id', as: 'reajusteData.propiedadData.direccionData'}},
                                                      {"$unwind": {path: "$boletaData.propiedadData.direccionData", preserveNullAndEmptyArrays: true}},
                                                      {"$unwind": {path: "$reajusteData.propiedadData.direccionData", preserveNullAndEmptyArrays: true}},
                                                      {"$group": {_id: "$_id", userid: {"$first": "$userid"}, fecha: {"$first": "$fecha"}, boletas: {"$addToSet": "$boletaData"},
                                                        reajustes: {"$addToSet": "$reajusteData"}}}

        ]);
        res.json(cierresMes);
    }catch(err){
        res.json({message: err});
    }
});


// Read contratos
router.get('/contratoscierre/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {fecha, ...queryClean} = req.query;
    req.query = queryClean;
    
    try{
        const contratos = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: '_id', foreignField: 'propiedad', as: 'contratos'}},
            {"$unwind": {path: "$contratos", preserveNullAndEmptyArrays: true}},
            {"$sort": {"contratos.fechacontrato": -1}},
            {"$group": {"_id": "$_id", "contrato": {"$first": "$contratos"}}},
            {"$match" : {"$and":[{"contrato.estado": {$eq: "Vigente"}}, {"$or":[{"contrato.fechatermino": {$eq: null}}, {"contrato.fechatermino": {$gte: new Date(fecha) || new Date()}}]}]}},
            {"$lookup": {from: 'propiedades', localField: '_id', foreignField: '_id', as: 'propiedad'}},
            {"$unwind": {path: "$propiedad", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'propiedad.direccion', foreignField: '_id', as: 'propiedad.direccionData'}},
            {"$unwind": {path: "$propiedad.direccionData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'boletas', localField: 'contrato._id', foreignField: 'contrato', as: 'boletas'}},
        ])

        res.json(contratos);
    }catch(err){
        res.json({message: err});
    }
});

// Read informe reajuste
router.get('/infreajustes/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    try{
        const reajustes = await Reajuste.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: 'contrato', foreignField: '_id', as: 'contrato'}},
            {"$unwind": {path: "$contrato", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'propiedades', localField: 'contrato.propiedad', foreignField: '_id', as: 'propiedad'}},
            {"$unwind": {path: "$propiedad", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'propiedad.direccion', foreignField: '_id', as: 'propiedad.direccionData'}},
            {"$unwind": {path: "$propiedad.direccionData", preserveNullAndEmptyArrays: true}},

        ]);
        res.json(reajustes);
    }catch(err){
        res.json({message: err});
    }
});

// Read propiedades pago
router.get('/pagopropiedades/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    try{
        const propiedades = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: '_id', foreignField: 'propiedad', as: 'contrato'}},
            {"$unwind": {path: "$contrato", preserveNullAndEmptyArrays: false}},
            {"$sort": {"contrato.fechacontrato": -1}},
            {"$lookup": {from: 'boletas', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.boletas'}},
            {"$lookup": {from: 'personas', localField: 'contrato.arrendatario', foreignField: '_id', as: 'contrato.arrendatario'}},
            {"$unwind": {path: "$contrato.arrendatario", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", uId: {"$first": "$uId"}, userid: {"$first": "$userid"}, direccionData: {"$first": "$direccionData"}, contratos: {"$addToSet": "$contrato"}}}
        ]);

        propiedades.map(prop => {
            prop.contratos = prop.contratos.map(contrato => {
                contrato.boletas = contrato.boletas.filter(boleta => boleta.estado == 'Generado')
                return contrato
            });

            return prop
        });

        res.json(propiedades);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;