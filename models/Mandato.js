const mongoose = require('mongoose');

const MandatoSchema = mongoose.Schema({
    /*
    _id objID
    userid objID
    Propiedad objID FK -< Propiedad._id
    FechaInicio Date
    FechaTermino Date
    FirmaContrato char
    EnvioCorresp char
    liquidacion!
    Comisiones obj FK - Comisiones.id
    Instrucciones obj FK - InstruccionesPago.id
    OtrosDestinatarios obj FK - OtrosDestinatarios.id
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    propiedad: {
        type: mongoose.ObjectId,
        required:true},
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaTermino: Date,
    firmacontrato: String,
    enviocorresp: String,
    liquidacion: {
        type: {
            formapago: String,
            cuenta: String,
            banco: String,
            pagoa: String
        }
    },
    comisiones:{
        type: {
            tipoadm: String,
            valoradm: Number,
            tipocontrato: String,
            valorcontrato: Number,
            incluirhononadmin: Boolean,
            impuestoadm: Number,
            admimpuestoincluido: Boolean,
            impuestocontrato: Number,
            contratoimpuestoincluido: Boolean
        }
    },
    instrucciones:{
        type: [{nombre: String, detalle:String, _id: mongoose.ObjectId}]
    },
    contribuciones: Boolean,
    contribucionesdesc: String,
    aseo: Boolean,
    aseodesc: String,
    otro: Boolean,
    otrodesc: String,
    otrosdestinatarios:{
        type: [{rut: String,
                dv: String,
                nombre: String,
                moneda: String,
                tipocalculo: String,
                monto: Number,
                formapago: String,
                nrocuenta: String,
                banco: String}]
    }
    
});

module.exports = mongoose.model('Mandatos', MandatoSchema);