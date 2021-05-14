const mongoose = require('mongoose');

const IngresoSchema = mongoose.Schema({
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    propiedad :{
        type: mongoose.ObjectId,
        required: true
    },
    conceptos: {
        type: [{concepto: String, valor: Number}],
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    periodo: {
        type: Date,
        default: Date.now
    },
    nroingreso:{
        type: Number,
        required: true
    },
    afectaarriendo: {
        type: Boolean,
        required: true
    },
    afectaliquidacion: {
        type: Boolean,
        required: true
    },
    formapago: String,
    documento: String,
    banco: String,
    cuenta: String
});

module.exports = mongoose.model('Ingresos', IngresoSchema);