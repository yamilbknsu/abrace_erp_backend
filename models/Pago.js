const mongoose = require('mongoose');

const PagoSchema = mongoose.Schema({
    userid:{
        type: mongoose.ObjectId,
        required: true
    },
    fechaemision: {
        type: Date,
        default: Date.now
    },
    fechapago: {
        type: Date,
        default: Date.now
    },
    propiedad:{
        type: mongoose.ObjectId,
        required: true
    },
    contrato:{
        type: mongoose.ObjectId,
        required: true
    },
    cargos:{
        type: [{tipo: String, concepto: String, detalle: String, valor: Number}],
        required: true,
        default: []
    },
    descuentos:{
        type: [{detalle: String, valor: Number}],
        required: true,
        default: []
    },
    saldoanterior:{
        type: Number,
        required: false,
        default: 0
    },
    pagado:{
        type: Number,
        required: false,
        default: 0
    },
    formapago: String,
    documento: String,
    banco: String,
    depositadoen: String,
    bancoen: String,
    totalCargos: Number,
    totalDescuentos: Number,
    subtotal: Number,
    nropago: Number,
    observaciones: String
});

module.exports = mongoose.model('pagos', PagoSchema);