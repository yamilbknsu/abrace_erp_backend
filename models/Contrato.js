const mongoose = require('mongoose');

const ContratoSchema = mongoose.Schema({
    /*
    _id objID
    userid objID
    propiedad objID
    estado str
    fechacontrato date
    fechatermino date
    primerreajuste date
    tipocontrato string
    moneda string
    canoninicial string
    canonactual string
    tiempoarriendo string
    tiemporeajuste string
    diavcto string
    mesgarantia string
    otras str
    tipogarantia str
    banco str
    nrodcto str
    arrendatario Persona
    aval Persona
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    propiedad: {
        type: mongoose.ObjectId,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    fechacontrato: {
        type: Date,
        required: true
    },
    fechatermino: Date,
    primerreajustse: Date,
    tipocontrato: String,
    moneda: String,
    canoninicial: Number,
    canonactual: Number,
    tiempoarriendo: String, // Mensual, anual, etc
    tiemporeajuste: String,
    diavcto: String,
    mesgarantia: String,
    otras: String,
    tipogarantia: String,
    banco: String,
    nrodcto: String,
    arrendatario: {
        type: mongoose.ObjectId,
        required: true},
    aval: mongoose.ObjectId
});

module.exports = mongoose.model('Contratos', ContratoSchema);