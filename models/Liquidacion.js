const mongoose = require('mongoose');

const LiquidacionSchema = mongoose.Schema({
    userid:{
        type: mongoose.ObjectId,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    fechapago:{
        type: Date,
        default: Date.now
    },
    propiedad:{
        type: mongoose.ObjectId,
        required: true
    },
    cargos:{
        type: [{tipo: String, concepto: String, detalle: String, valor: Number}],
        required: true,
        default: []
    },
    abonos:{
        type: [{tipo: String, concepto: String, detalle: String, valor: Number}],
        required: true,
        default: []
    },
    honorarios: {type: {tipo: String, valor: Number, impuestos: Number, descripcion: String}},
    formapago: String,
    documento: String,
    banco: String,
    totalCargos: Number,
    totalAbonos: Number,
    subtotal: Number,
    nroliquidacion: Number,
    observaciones: String
});

module.exports = mongoose.model('liquidaciones', LiquidacionSchema);