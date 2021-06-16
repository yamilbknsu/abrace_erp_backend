const express = require('express');
const mongoose = require('mongoose');
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
const Reajuste = require('../models/Reajuste.js');
const Pago = require('../models/Pago.js');

// validationScehmas import
const {direccionValidationSchema,
       personaValidationSchema,
       mandanteValidationSchema,
       propiedadValidationSchema,
       mandatoValidationSchema,
       contratoValidationSchema,
       validateRUT,
       validationOptions} = require('../validation.js');
const CierreMes = require('../models/CierreMes.js');
const Liquidacion = require('../models/Liquidacion.js');
const Egreso = require('../models/Egreso.js');
const Ingreso = require('../models/Ingreso.js');
const ReajusteRentas = require('../models/ReajusteRentas.js');
const ReajusteExtraordinario = require('../models/ReajusteExtraordinario.js');

// Write a contrato
router.post('/contratos/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-contrato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    //console.log(req.body);

    // Validation
    const validation = contratoValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if contrato exists
    const contrato = await Contrato.findOne({userid: req.verified.userid,
                                             propiedad: req.body.propiedad,
                                             arrendatario: req.body.arrendatario,
                                             fechaInicio: req.body.fechacontrato});
                                             
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
    const validation = mandatoValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if mandato exists
    const mandato = await Mandato.findOne({userid: req.verified.userid,
                                           propiedad: req.body.propiedad,
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
router.post('/propiedades/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-propiedad']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = propiedadValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if uId exists
    const propiedad = await Propiedad.findOne({userid: req.verified.userid, uId: req.body.uId});
    if (propiedad) return res.status(400).send("Propiedad already registered");

    if(req.body.administrador == '') req.body.administrador = null;

    const new_propiedad = Propiedad(req.body);
    new_propiedad.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json(err);
                });
});

// Write a Mandante
router.post('/mandantes/', validateToken, permissionCheck, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-mandante']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = mandanteValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);

    // Check if rut exists
    const mandante = await Mandante.findOne({userid: req.verified.userid, personaID: req.body.personaID});
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
router.post('/personas/', validateToken, permissionCheck, updateCleaner, async (req, res) =>{
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-persona']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    // Validation
    const validation = personaValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);
    if (!validateRUT(req.body.rut, req.body.dv)) return res.status(400).send('Rut invalido');

    // Check if rut exists
    const persona = await Persona.findOne({userid: req.verified.userid, rut: req.body.rut});
    if (persona) return res.status(400).send("Rut already exists");

    console.log(req.body)
    if(req.body.dirParticular == '') req.body.dirParticular = null;
    if(req.body.dirComercial == '') req.body.dirComercial = null;

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
    const validation = direccionValidationSchema.validate(req.body, validationOptions);
    if (validation.error) return res.status(400).send(validation.error);
    
    const new_direccion = Direccion(req.body);
    new_direccion.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Write a boleta
router.post('/boletas/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    const new_boleta = Boleta(req.body);
    new_boleta.save()
                 .then(data => {
                    res.json({dataid: data._id});
                 }).catch(err => {
                    res.json({message: err});
                });
});

// Cerrar mes
router.post('/cierresmes/', validateToken, permissionCheck, async (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const boletas = req.body.recibos;
    const reajustes = req.body.reajustes;


    var promises = [];
    boletas.forEach(element => {
        var new_boleta = Boleta(element);
        promises.push(new_boleta.save());
    });

    reajustes.forEach(async element => {
        var new_reajuste = Reajuste(element);
        promises.push(new_reajuste.save());

        var contrato = await Contrato.findOne({_id: element.contrato});

        contrato.canonactual = element.valorfinal;
        
        var reajuste_interval = 1;
        if(contrato.tiemporeajuste == 'Mensual') reajuste_interval = 1;
        else if(contrato.tiemporeajuste == 'Trimestral') reajuste_interval = 3;
        else if(contrato.tiemporeajuste == 'Semestral') reajuste_interval = 6;
        else if(contrato.tiemporeajuste == 'Anual') reajuste_interval = 12;

        contrato.proximoreajuste = new Date(new Date(req.query.fecha).setMonth(new Date(req.query.fecha).getMonth() + reajuste_interval)).setDate(new Date(contrato.proximoreajuste).getDate());
        
        Contrato.findByIdAndUpdate(element.contrato, contrato, (err, model) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(model)
            }
        })
    });

    var mes_boletas = [];
    var mes_reajustes = [];

    Promise.all(promises).then(values => {
        values.forEach(element => {
            if(element.reajuste != undefined){
                mes_reajustes.push(element._id)
            }else{
                mes_boletas.push(element._id)
            }
        });

        const new_cierre_mes = CierreMes({
            fecha: req.query.fecha,
            userid: req.body.userid,
            boletas: mes_boletas,
            reajustes: mes_reajustes
        });
        new_cierre_mes.save()
                    .then(data => {
                        res.json(data);
                    }).catch(err => {
                        res.json({message: err});
                    });
    });
});

// reajustesmes
router.post('/reajustesmes/', validateToken, permissionCheck, async (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const reajustes = req.body.reajustes.reajustes;
    const reajustesextraordinarios = req.body.reajustes.reajustesExtraordinarios;
    
    var promises = [];

    reajustes.forEach(async element => {
        if(element.reajuste != 0){
            var new_reajuste = Reajuste(element);
            promises.push(new_reajuste.save());
        }

        var contrato = await Contrato.findOne({_id: element.contrato});
        contrato.canonactual = element.valorfinal;
        
        var reajuste_interval = 1;
        if(contrato.tiemporeajuste == 'Mensual') reajuste_interval = 1;
        else if(contrato.tiemporeajuste == 'Trimestral') reajuste_interval = 3;
        else if(contrato.tiemporeajuste == 'Semestral') reajuste_interval = 6;
        else if(contrato.tiemporeajuste == 'Anual') reajuste_interval = 12;

        contrato.proximoreajuste = new Date(new Date(req.query.fecha).setMonth(new Date(req.query.fecha).getMonth() + reajuste_interval)).setDate(new Date(contrato.proximoreajuste).getDate());
        
        Contrato.findByIdAndUpdate(element.contrato, contrato, (err, model) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(model)
            }
        })
    });

    reajustesextraordinarios.forEach(async element => {
        console.log(element)
        if(element.reajuste != 0){
            var new_reajuste = Reajuste(element);
            promises.push(new_reajuste.save());
        }

        var contrato = await Contrato.findOne({_id: element.contrato});
        contrato.canonactual = element.valorfinal;
        
        //var reajuste_interval = 1;
        //if(contrato.tiemporeajuste == 'Mensual') reajuste_interval = 1;
        //else if(contrato.tiemporeajuste == 'Trimestral') reajuste_interval = 3;
        //else if(contrato.tiemporeajuste == 'Semestral') reajuste_interval = 6;
        //else if(contrato.tiemporeajuste == 'Anual') reajuste_interval = 12;
        //contrato.proximoreajuste = new Date(new Date(req.query.fecha).setMonth(new Date(req.query.fecha).getMonth() + reajuste_interval)).setDate(new Date(contrato.proximoreajuste).getDate());
        
        Contrato.findByIdAndUpdate(element.contrato, contrato, (err, model) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(model)
            }
        })
    });

    var mes_reajustes = [];

    Promise.all(promises).then(values => {
        values.forEach(element => {
            if(element.reajuste != undefined){
                mes_reajustes.push(element._id)
            }
        });

        const new_reajuste_rentas = ReajusteRentas({
            fecha: req.query.fecha,
            userid: req.body.userid,
            reajustes: mes_reajustes
        });
        new_reajuste_rentas.save()
                    .then(data => {
                        res.json(data);
                    }).catch(err => {
                        res.json({message: err});
                    });
    });
    
});

// Write a pago
router.post('/pagos/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');
    
    //var boletasPromises = [];
    //req.body.cargos.forEach(cargo => {
    //    if(cargo.tipo == 'Arriendo'){
    //        boletasPromises.push(Boleta.updateOne({ "_id" : mongoose.Types.ObjectId(cargo.concepto)}, { $set: { "estado" : "Emitido" } }));
    //    }
    //});

    const new_pago = Pago(req.body);
        new_pago.save()
                .then(data => res.json(data))
                .catch(err => {
                    res.json({message: err});
                });

    //Promise.all(boletasPromises).then(values =>{
    //});
});


// Write a liquidacion
router.post('/liquidaciones/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const new_liquidacion = Liquidacion(req.body);
    new_liquidacion.save()
                    .then(data => {
                    res.json({dataid: data._id});
                    }).catch(err => {
                    res.json({message: err});
                });
});

// Write a egreso
router.post('/egresos/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const new_egreso = Egreso(req.body);
    new_egreso.save()
                    .then(data => {
                    res.json({dataid: data._id});
                    }).catch(err => {
                    res.json({message: err});
                });
});

// Write a ingreso
router.post('/ingresos/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-boleta']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const new_ingreso = Ingreso(req.body);
    new_ingreso.save()
                    .then(data => {
                    res.json({dataid: data._id});
                    }).catch(err => {
                    res.json({message: err});
                });
});

// Write a reajuste extraordinario
router.post('/reajustesextraordinarios/', validateToken, permissionCheck, (req, res) =>{
    
    // Check if logged user has the permissions
    valid_permissions = ['admin', 'write-all', 'write-mandato']
    if(!req.permissions.some(p => valid_permissions.includes(p))) 
        return res.status(403).send('Forbidden access - lacking permission to perform action');

    const reajustesextraordinario = ReajusteExtraordinario(req.body);
    reajustesextraordinario.save()
                    .then(data => {
                    res.json({dataid: data._id});
                    }).catch(err => {
                    res.json({message: err});
                });
});

module.exports = router;