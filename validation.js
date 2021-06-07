const Joi = require('@hapi/joi');

// RUT validation function
function validateRUT(rut, dv){
    rut = rut.replace('.', '').replace('-','');
    rut = rut.split('').reverse().join('');
    
    if (isNaN(rut)) return false;
    else{
        var suma = 0
        for(var i=0; i<rut.length; i++){
            suma += parseInt(rut[i]) * (i%6 + 2);
        }

        correct_digit = 11 - suma%11;

        if (correct_digit == 11) return dv == 0
        else if (correct_digit == 10) return dv.toString().toLowerCase() == 'k';
        else return dv == correct_digit;
    }
}

// Valdiation Schemas

// Propiedad caracteristicas schema
const caracteristicasValidationSchema = Joi.object().keys({
    anoedificacion: Joi.number(),
    mtsterreno: Joi.number(),
    mtsconstruidos: Joi.number(),
    pisos: Joi.number(),
    habitaciones: Joi.number(),
    banos: Joi.number(),
    salas: Joi.number(),
    comedores: Joi.number(),
    livcomedor: Joi.number(),
    piezasservicio: Joi.number(),
    banosservicio: Joi.number(),
    estacionamientos: Joi.number(),
    ascensor: Joi.boolean(),
    bodegas: Joi.number(),
    otros: Joi.array().allow(null).empty()
});

// Propiedad validation schema
const propiedadValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    uId : Joi.string().min(3).required(),
    direccion: Joi.string().required(),
    telefonos: Joi.array().items(String),
    rolsii: Joi.string().allow(''),
    arrendada: Joi.boolean(),
    administrador: Joi.string().allow('').allow(null),
    caracteristicas:caracteristicasValidationSchema,
    mandante: Joi.string().required(),
    mandatoActual: Joi.string().allow('')
});

// Direccion validation schema
const direccionValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    calle: Joi.string().min(3).required(),
    comuna: Joi.string().allow(''),
    numero: Joi.string().allow(''),
    depto: Joi.string().allow(''),
    ciudad: Joi.string().allow(''),
    region: Joi.string().allow('')
});

// Persona validation schema
const personaValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    rut : Joi.string().required().min(7).max(13),
    dv: Joi.string().required().min(1).max(1),
    nombre: Joi.string().required().min(3),
    actividad: Joi.string().allow('').allow(null),
    empresa: Joi.string().allow('').allow(null),
    cargo: Joi.string().allow('').allow(null),
    dirParticular: Joi.string().allow('').allow(null),
    dirComercial: Joi.string().allow('').allow(null),
    telefonos: Joi.array().items(String),
    emails: Joi.array().items(String),
    personalidad: Joi.string().allow('').allow(null),
    representante: Joi.object().allow(null)
});

// Mandante validation schema
const mandanteValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    personaID: Joi.string().required(),
    conyuge: Joi.string()
});

// Mandato validation schema
const mandatoValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    propiedad: Joi.string().required(),
    fechaInicio: Joi.date().required(),
    fechaTermino: Joi.date(),
    firmacontrato: Joi.string(),
    enviocorresp: Joi.string(),
    liquidacion: Joi.object().keys({
        formapago: Joi.string().allow(''),
        cuenta: Joi.string().allow(''),
        banco: Joi.string().allow(''),
        pagoa: Joi.string().allow('')
    }),
    comisiones: Joi.object().keys({
        tipoadm: Joi.string().allow(''),
        valoradm: Joi.string().allow(''),
        tipocontrato: Joi.string().allow(''),
        valorcontrato: Joi.string().allow(''),
        incluirhononadmin: Joi.bool().allow(''),
        impuestoadm: Joi.string().allow(''),
        admimpuestoincluido: Joi.bool().allow(''),
        impuestocontrato: Joi.string().allow(''),
        contratoimpuestoincluido: Joi.bool().allow(''),
    }),
    instrucciones: Joi.array().items(Joi.object().keys({
        nombre: Joi.string(),
        detalle: Joi.string().allow(''),
        _id: Joi.string()
    })),
    contribuciones: Joi.bool(),
    contribucionesdesc: Joi.string().allow(''),
    aseo: Joi.bool(),
    aseodesc: Joi.string().allow(''),
    otro: Joi.bool(),
    otrodesc: Joi.string().allow(''),
    otrosdestinatarios: Joi.array().items(Joi.object().keys({
        _id: Joi.string(),
        rut: Joi.string().allow(''),
        dv: Joi.string().allow(''),
        nombre: Joi.string().allow(''),
        moneda: Joi.string().allow(''),
        tipocalculo: Joi.string().allow(''),
        monto: Joi.number().allow(''),
        formapago: Joi.string().allow(''),
        nrocuenta: Joi.string().allow(''),
        banco: Joi.string().allow('')
    }))
});

// Contrato validation schema
const contratoValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    propiedad: Joi.string().required(),
    estado: Joi.string().required(),
    fechacontrato: Joi.date().required(),
    fechatermino: Joi.date(),
    proximoreajuste: Joi.date(),
    tipocontrato: Joi.string(),
    moneda: Joi.string(),
    canoninicial: Joi.string(),
    canonactual: Joi.string(),
    tiempoarriendo: Joi.string(),
    tiemporeajuste: Joi.string(),
    diavcto: Joi.string(),
    mesgarantia: Joi.string(),
    otras: Joi.string().allow('').optional(),
    tipogarantia: Joi.string().allow(''),
    banco: Joi.string().allow(''),
    nrodcto: Joi.string().allow(''),
    arrendatario: Joi.string().required(),
    aval: Joi.string(),
    instrucciones: Joi.array().items(Joi.object().keys({
        nombre: Joi.string(),
        detalle: Joi.string().allow(''),
        _id: Joi.string()
    }))
});


module.exports = {direccionValidationSchema,
                  propiedadValidationSchema,
                  personaValidationSchema,
                  caracteristicasValidationSchema,
                  mandanteValidationSchema,
                  mandatoValidationSchema,
                  contratoValidationSchema,
                  validateRUT}