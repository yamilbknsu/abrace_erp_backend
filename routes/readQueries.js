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
const Propiedad = require('../models/Propiedad.js');
const Mandato = require('../models/Mandato.js');
const Contrato = require('../models/Contrato.js');
const Parametro = require('../models/Parametro.js');
const Boleta = require('../models/Boleta.js');
const Liquidacion = require('../models/Liquidacion.js');
const Ingreso = require('../models/Ingreso.js');
const Egreso = require('../models/Egreso.js');
const CierreMes = require('../models/CierreMes.js');
const Reajuste = require('../models/Reajuste.js');
const ReajusteRentas = require('../models/ReajusteRentas.js');
const ReajusteExtraordinario = require('../models/ReajusteExtraordinario.js');

sortDate = (a, b) => (new Date(a.fecha) > new Date(b.fecha)) ? -1 : 1;
sortDateReverse = (a, b) => (new Date(a.fecha) > new Date(b.fecha)) ? 1 : -1;

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

    var {fecha, ...queryClean} = req.query;
    req.query = queryClean;

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
        var ultimo = cierresMes.sort(sortDate)[0]
        var cierresFecha;
        if(fecha){
            cierresFecha = cierresMes.filter(cierre => (new Date(cierre.fecha)).getMonth() == (new Date(fecha)).getMonth() && (new Date(cierre.fecha)).getFullYear() == (new Date(fecha)).getFullYear())
            cierresFecha = cierresFecha.length == 0 ? (ultimo ? [ultimo] : []) : cierresFecha
        }
        
        res.json(fecha ? cierresFecha : cierresMes);
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
        var contratos = await Propiedad.aggregate([
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

       
        contratos = contratos.map(cont => {
            var last_boleta = cont.boletas.filter(b => b.tipo == 'Automatico' || b.tipo == 'Inicial')
                                            .sort((a,b) => new Date(b.fecha) > new Date(a.fecha) ? 1 : -1)[0]
            cont.boletas = [last_boleta];
            return cont
        });

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

    var {periodo, propiedad, contrato, ...queryClean} = req.query;
    req.query = queryClean;
    
    try{
        var propiedades = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: '_id', foreignField: 'propiedad', as: 'contrato'}},
            {"$unwind": {path: "$contrato", preserveNullAndEmptyArrays: false}},
            {"$sort": {"contrato.fechacontrato": -1}},
            {"$lookup": {from: 'boletas', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.boletas'}},
            {"$lookup": {from: 'pagos', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.pagos'}},
            {"$lookup": {from: 'personas', localField: 'contrato.arrendatario', foreignField: '_id', as: 'contrato.arrendatario'}},
            {"$unwind": {path: "$contrato.arrendatario", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", uId: {"$first": "$uId"}, userid: {"$first": "$userid"}, direccionData: {"$first": "$direccionData"}, contratos: {"$addToSet": "$contrato"}}}
        ]);
        
        
        sortDatePago = (a, b) => (new Date(a.fechaemision) > new Date(b.fechaemision)) ? -1 : 1;
        propiedades = propiedades.map(prop => {
            prop.contratos = prop.contratos.map(contrato => {
                if(!periodo) {
                    contrato.boletas = []
                    contrato.pagos = []
                    return contrato
                }

                contrato.boletas = contrato.boletas.filter(boleta => boleta.fecha.getMonth() == (new Date(periodo)).getMonth() && boleta.fecha.getFullYear() == (new Date(periodo)).getFullYear())
                
                const ultimo = contrato.pagos.sort(sortDatePago)[0]
                contrato.pagos = contrato.pagos.filter(pago => pago.fechaemision.getMonth() == (new Date(periodo)).getMonth() && pago.fechaemision.getFullYear() == (new Date(periodo)).getFullYear())
                contrato.pagos = contrato.pagos.length == 0 ? (ultimo ? [ultimo] : []) : contrato.pagos
                //contrato.pagos = contrato.pagos.filter(pago => pago.fechapago.getMonth() == (new Date(periodo)).getMonth() && pago.fechapago.getFullYear() == (new Date(periodo)).getFullYear())
                //contrato.boletas = contrato.boletas.sort(sortDate);
                return contrato
            });
            return prop
        });

        if(propiedad){
            propiedades = propiedades.filter(prop => prop._id == propiedad)
            if(contrato)
                propiedades[0].contratos = propiedades[0].contratos.filter(cont => cont._id == contrato)

        }
        
        res.json(propiedades);
    }catch(err){
        res.json({message: err});
    }
});

// Read informes pago
router.get('/infpago/', validateToken, permissionCheck, async (req, res) =>{
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
            {"$lookup": {from: 'pagos', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.pagos'}},
            {"$lookup": {from: 'personas', localField: 'contrato.arrendatario', foreignField: '_id', as: 'contrato.arrendatario'}},
            {"$unwind": {path: "$contrato.arrendatario", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'personas', localField: 'mandante', foreignField: '_id', as: 'mandanteData'}},
            {"$unwind": {path: "$mandanteData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", uId: {"$first": "$uId"}, userid: {"$first": "$userid"}, direccionData: {"$first": "$direccionData"},
                        mandanteData: {"$first": "$mandanteData"}, contratos: {"$addToSet": "$contrato"}}}
        ]);

        res.json(propiedades);
    }catch(err){
        res.json({message: err});
    }
});

// Read informes liquidacion
router.get('/boletasliquidacion/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    var {fecha, propiedad, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var propiedades = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$match" : {...{_id: ObjectId(propiedad)}}},
            {"$lookup": { from: 'contratos', localField: '_id', foreignField: 'propiedad', as: 'contrato'}},
            {"$unwind": {path: "$contrato", preserveNullAndEmptyArrays: false}},
            {"$lookup": { from: 'boletas', localField: 'contrato._id', foreignField: 'contrato', as: 'boletas'}},
        ]);
        
        var boletas = [];
        propiedades.forEach(prop => {
            prop.boletas.forEach(boleta => {
                if(boleta.estado != 'Cancelado' && boleta.tipo != 'Inicial' &&
                                                    ((new Date(boleta.fecha)).getMonth() == (new Date(fecha)).getMonth() && 
                                                    (new Date(boleta.fecha)).getFullYear() == (new Date(fecha)).getFullYear())){
                    boletas.push(boleta);
                }
            })
        });
        
        res.json(boletas);
    }catch(err){
        res.json({message: err});
    }
});

// Read liquidaciones
router.get('/liquidaciones/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {fecha, propiedad, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var liquidaciones = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'liquidaciones', localField: '_id', foreignField: 'propiedad', as: 'liquidaciones'}},
            {"$lookup": { from: 'mandatos', localField: '_id', foreignField: 'propiedad', as: 'mandato'}},
            {"$unwind": {path: "$mandato", preserveNullAndEmptyArrays: false}},
            {"$match":  {"$or" : [{"mandato.fechaTermino": {$eq: null}}, {"mandato.fechaTermino": {$eq: ""}}, {"mandato.fechaTermino": {$gte: new Date()}}]}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}}
        ]);

        if(fecha)
            liquidaciones = liquidaciones.map(prop => {
                prop.liquidaciones = prop.liquidaciones.sort(sortDate)
                ultimo = prop.liquidaciones[0]
                prop.liquidaciones = prop.liquidaciones.filter(liq => (new Date(liq.fecha)).getMonth() == (new Date(fecha)).getMonth() && (new Date(liq.fecha)).getFullYear() == (new Date(fecha)).getFullYear())
                prop.liquidaciones = prop.liquidaciones.length == 0 ? (ultimo ? [ultimo] : []) : prop.liquidaciones
                
                return prop;
            });
        else{
            liquidaciones = liquidaciones.map(liq => {liq.liquidaciones = []; return liq;})
        }
        if(propiedad)
            liquidaciones = liquidaciones.filter(liq => liq._id == propiedad).map(liq => liq.liquidaciones)
        //liquidaciones = liquidaciones.filter(liq => liq.liquidaciones.length > 0)
        res.json(liquidaciones);
    }catch(err){
        res.json({message: err});
    }
});

// Read liquidaciones
router.get('/infliquidacion/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {fecha, fechastart, fechaend, propiedad, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var liquidaciones = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'liquidaciones', localField: '_id', foreignField: 'propiedad', as: 'liquidaciones'}},
            {"$lookup": { from: 'mandatos', localField: '_id', foreignField: 'propiedad', as: 'mandato'}},
            {"$unwind": {path: "$mandato", preserveNullAndEmptyArrays: false}},
            {"$lookup": { from: 'personas', localField: 'mandante', foreignField: '_id', as: 'mandanteData'}},
            {"$unwind": {path: "$mandanteData", preserveNullAndEmptyArrays: false}},
            {"$match":  {"$or" : [{"mandato.fechaTermino": {$eq: null}}, {"mandato.fechaTermino": {$eq: ""}}, {"mandato.fechaTermino": {$gte: new Date()}}]}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}},
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
            {'$unwind': {"path": '$lastcontrato.arrendatarioData', 'preserveNullAndEmptyArrays': true}}
        ]);

        liquidaciones = liquidaciones.map(liq => {
            liq.lastcontrato = {arrendatarioData: liq.lastcontrato.arrendatarioData}
            return liq
        })
        liquidaciones = liquidaciones.filter(liq => liq.liquidaciones.length > 0)

        if(propiedad)
            liquidaciones = liquidaciones.filter(liq => liq._id == propiedad)

        if(fecha)
            liquidaciones = liquidaciones.map(prop => {
                prop.liquidaciones = prop.liquidaciones.sort(sortDate)
                ultimo = prop.liquidaciones[0]
                prop.liquidaciones = prop.liquidaciones.filter(liq => (new Date(liq.fecha)).getMonth() == (new Date(fecha)).getMonth() && (new Date(liq.fecha)).getFullYear() == (new Date(fecha)).getFullYear())
                prop.liquidaciones = prop.liquidaciones.length == 0 ? (ultimo ? [ultimo] : []) : prop.liquidaciones
                
                return prop;
            });
            
        if(fechastart && fechaend)
        liquidaciones = liquidaciones.map(prop => {
            prop.liquidaciones = prop.liquidaciones.sort(sortDateReverse)
            ultimo = prop.liquidaciones[0]
            prop.liquidaciones = prop.liquidaciones.filter(liq => new Date(fechastart) <= new Date(liq.fecha) && new Date(fechaend) >= new Date(liq.fecha))
            prop.liquidaciones = prop.liquidaciones.length == 0 ? (ultimo ? [ultimo] : []) : prop.liquidaciones
            
            return prop;
        });
        res.json(liquidaciones);
    }catch(err){
        res.json({message: err});
    }
});


// Read ingresos
router.get('/ingresos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const ingresos = await Ingreso.find({...{userid: req.verified.userid}, ...req.query});
        res.json(ingresos);
    }catch(err){
        res.json({message: err});
    }
});

// Read egresos
router.get('/egresos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    try{
        const egresos = await Egreso.find({...{userid: req.verified.userid}, ...req.query});
        res.json(egresos);
    }catch(err){
        res.json({message: err});
    }
});

// Read reajusterentas
router.get('/reajusterentas/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {fecha, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var reajusterentas = await ReajusteRentas.aggregate([
            {"$match":  {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$unwind": {path: "$reajustes", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'reajustes', localField: 'reajustes', foreignField: '_id', as: 'reajusteData'}},
            {"$unwind": {path: "$reajusteData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'contratos', localField: 'reajusteData.contrato', foreignField: '_id', as: 'reajusteData.contratoData'}},
            {"$unwind": {path: "$reajusteData.contratoData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'propiedades', localField: 'reajusteData.contratoData.propiedad', foreignField: '_id', as: 'reajusteData.propiedadData'}},
            {"$unwind": {path: "$reajusteData.propiedadData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'reajusteData.propiedadData.direccion', foreignField: '_id', as: 'reajusteData.propiedadData.direccionData'}},
            {"$unwind": {path: "$reajusteData.propiedadData.direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", userid: {"$first": "$userid"}, fecha: {"$first": "$fecha"}, reajustes: {"$addToSet": "$reajusteData"}}}
        ]);

        var ultimo = reajusterentas.sort(sortDate)[0]
        if(fecha){
            reajusterentas = reajusterentas.filter(reajuste => (new Date(reajuste.fecha)).getMonth() == (new Date(fecha)).getMonth() && (new Date(reajuste.fecha)).getFullYear() == (new Date(fecha)).getFullYear())
            reajusterentas = reajusterentas.length == 0 ? (ultimo ? [ultimo] : []) : reajusterentas
        }

        res.json(reajusterentas);
    }catch(err){
        res.json({message: err});
    }
});

// Read reajuste extraordinarios
router.get('/reajustesextraordinarios/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {contrato, fecha, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var reajustesextraordinarios = await ReajusteExtraordinario.aggregate([
            {"$match": {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: 'contrato', foreignField: '_id', as: 'contratoData'}},
            {'$unwind': {path: "$contratoData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'propiedades', localField: 'contratoData.propiedad', foreignField: '_id', as: 'propiedadData'}},
            {'$unwind': {path: "$propiedadData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'propiedadData.direccion', foreignField: '_id', as: 'propiedadData.direccionData'}},
            {'$unwind': {path: "$propiedadData.direccionData", preserveNullAndEmptyArrays: true}}]);

        if(contrato){
            reajustesextraordinarios = reajustesextraordinarios.filter(reajuste => reajuste.contrato == contrato)
        }
        if(fecha){
            reajustesextraordinarios = reajustesextraordinarios.filter(reajuste => new Date(reajuste.fecha).getMonth() == new Date(fecha).getMonth() && 
                                                                                   new Date(reajuste.fecha).getFullYear() == new Date(fecha).getFullYear())
        }

        res.json(reajustesextraordinarios);
    }catch(err){
        res.json({message: err});
    }
});

// Read egresos
router.get('/ingresosegresospropiedad/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {propiedad, fecha, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var egresos = await Egreso.find({...{userid: req.verified.userid}, ...req.query});
        var ingresos = await Ingreso.find({...{userid: req.verified.userid}, ...req.query});
        if(propiedad){
            egresos = egresos.filter(egreso => egreso.propiedad == propiedad)
            ingresos = ingresos.filter(ingreso => ingreso.propiedad == propiedad)
        }
        if(fecha){
            egresos = egresos.filter(egreso => egreso.periodo.getMonth() == (new Date(fecha)).getMonth() && egreso.periodo.getFullYear() == (new Date(fecha)).getFullYear())
            ingresos = ingresos.filter(ingreso => ingreso.periodo.getMonth() == (new Date(fecha)).getMonth() && ingreso.periodo.getFullYear() == (new Date(fecha)).getFullYear())
        }

        res.json({egresos, ingresos});
    }catch(err){
        res.json({message: err});
    }
});

// Read ...
router.get('/fechasliqpagos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'read-all', 'read-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    var {propiedad, ...queryClean} = req.query;
    req.query = queryClean;

    try{
        var liquidaciones = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'liquidaciones', localField: '_id', foreignField: 'propiedad', as: 'liquidaciones'}},
            {"$lookup": { from: 'mandatos', localField: '_id', foreignField: 'propiedad', as: 'mandato'}},
            {"$unwind": {path: "$mandato", preserveNullAndEmptyArrays: false}},
            {"$match":  {"$or" : [{"mandato.fechaTermino": {$eq: null}}, {"mandato.fechaTermino": {$eq: ""}}, {"mandato.fechaTermino": {$gte: new Date()}}]}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}}
        ]);

        var pagos = await Propiedad.aggregate([
            {"$match" : {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$lookup": {from: 'contratos', localField: '_id', foreignField: 'propiedad', as: 'contrato'}},
            {"$unwind": {path: "$contrato", preserveNullAndEmptyArrays: false}},
            {"$sort": {"contrato.fechacontrato": -1}},
            {"$lookup": {from: 'boletas', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.boletas'}},
            {"$lookup": {from: 'pagos', localField: 'contrato._id', foreignField: 'contrato', as: 'contrato.pagos'}},
            {"$lookup": {from: 'personas', localField: 'contrato.arrendatario', foreignField: '_id', as: 'contrato.arrendatario'}},
            {"$unwind": {path: "$contrato.arrendatario", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'direccion', foreignField: '_id', as: 'direccionData'}},
            {"$unwind": {path: "$direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", uId: {"$first": "$uId"}, userid: {"$first": "$userid"}, direccionData: {"$first": "$direccionData"}, contratos: {"$addToSet": "$contrato"}}}
        ]);

        var reajusterentas = await ReajusteRentas.aggregate([
            {"$match":  {...{userid: ObjectId(req.verified.userid)}, ...req.query}},
            {"$unwind": {path: "$reajustes", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'reajustes', localField: 'reajustes', foreignField: '_id', as: 'reajusteData'}},
            {"$unwind": {path: "$reajusteData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'contratos', localField: 'reajusteData.contrato', foreignField: '_id', as: 'reajusteData.contratoData'}},
            {"$unwind": {path: "$reajusteData.contratoData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'propiedades', localField: 'reajusteData.contratoData.propiedad', foreignField: '_id', as: 'reajusteData.propiedadData'}},
            {"$unwind": {path: "$reajusteData.propiedadData", preserveNullAndEmptyArrays: true}},
            {"$lookup": {from: 'direcciones', localField: 'reajusteData.propiedadData.direccion', foreignField: '_id', as: 'reajusteData.propiedadData.direccionData'}},
            {"$unwind": {path: "$reajusteData.propiedadData.direccionData", preserveNullAndEmptyArrays: true}},
            {"$group": {_id: "$_id", userid: {"$first": "$userid"}, fecha: {"$first": "$fecha"}, reajustes: {"$addToSet": "$reajusteData"}}}
        ]);

        if(propiedad){
            liquidaciones = liquidaciones.filter(liq => liq._id == propiedad).map(liq => [...liq.liquidaciones.map(l => l.fecha)])
            liquidaciones = liquidaciones.length > 0 ? liquidaciones[0] : [];

            pagos = pagos.filter(liq => liq._id == propiedad).map(cont => cont.contratos[0].pagos.map(pago => pago.fechaemision))
            pagos = pagos.length > 0 ? pagos[0] : [];
        }
        reajusterentas = reajusterentas.map(reaj => reaj.fecha)
        res.json({liquidaciones, pagos, reajusterentas});
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;