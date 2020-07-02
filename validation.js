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
    otros: Joi.string()
});

// Propiedad validation schema
const propiedadValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    uId : Joi.string().min(3).required(),
    direccion: Joi.string().required(),
    telefonos: Joi.array().items(String),
    rolsii: Joi.string(),
    arrendada: Joi.boolean(),
    administrador: Joi.string(),
    caracteristicas:caracteristicasValidationSchema,
    mandante: Joi.string().required(),
    mandatoActual: Joi.string()
});

// Direccion validation schema
const direccionValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    calle: Joi.string().min(3).required(),
    comuna: Joi.string(),
    numero: Joi.string(),
    depto: Joi.string(),
    ciudad: Joi.string(),
    region: Joi.string()
});

// Persona validation schema
const personaValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    rut : Joi.string().required().min(7).max(13),
    dv: Joi.string().required().min(1).max(1),
    nombre: Joi.string().required().min(3),
    actividad: Joi.string(),
    empresa: Joi.string(),
    cargo: Joi.string(),
    dirParticular: Joi.string(),
    dirComercial: Joi.string(),
    telefonos: Joi.array().items(String),
    emails: Joi.array().items(String)
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
        formapago: Joi.string(),
        cuenta: Joi.string(),
        banco: Joi.string(),
        pagoa: Joi.string()
    }),
    comisiones: Joi.object().keys({
        tipoadm: Joi.string(),
        valoradm: Joi.string(),
        tipocontrato: Joi.string(),
        valorcontrato: Joi.string(),
        incluirhononadmin: Joi.bool()
    }),
    instrucciones: Joi.array().items(Joi.object().keys({
        nombre: Joi.string(),
        detalle: Joi.string()
    })),
    otrosdestinatarios: Joi.array().items(Joi.object().keys({
        rut: Joi.string(),
        dv: Joi.string(),
        nombre: Joi.string(),
        moneda: Joi.string(),
        tipocalculo: Joi.string(),
        monto: Joi.string(),
        formapago: Joi.string(),
        nrocuenta: Joi.string(),
        banco: Joi.string()
    }))
});

// Contrato validation schema
const contratoValidationSchema = Joi.object().keys({
    userid: Joi.string().required(),
    propiedad: Joi.string().required(),
    estado: Joi.string().required(),
    fechacontrato: Joi.date().required(),
    fechaTermino: Joi.date(),
    primerreajuste: Joi.date(),
    tipocontrato: Joi.string(),
    moneda: Joi.string(),
    canoninicial: Joi.string(),
    canonactual: Joi.string(),
    tiempoarriendo: Joi.string(),
    tiemporeajuste: Joi.string(),
    diavcto: Joi.string(),
    mesgarantia: Joi.string(),
    otras: Joi.string().allow('').optional(),
    tipogarantia: Joi.string(),
    banco: Joi.string(),
    nrodcto: Joi.string(),
    arrendatario: Joi.string().required(),
    aval: Joi.string()
});


module.exports = {direccionValidationSchema,
                  propiedadValidationSchema,
                  personaValidationSchema,
                  caracteristicasValidationSchema,
                  mandanteValidationSchema,
                  mandatoValidationSchema,
                  contratoValidationSchema,
                  validateRUT}