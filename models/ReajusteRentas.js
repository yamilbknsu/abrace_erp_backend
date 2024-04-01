const mongoose = require('mongoose');

const ReajusteRentasSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    userid:{
        type: mongoose.ObjectId,
        required: true
    },
    reajustes:{
        type: [mongoose.ObjectId],
        required: true,
        default: []
    }
});

module.exports = mongoose.model('reajusterentas', ReajusteRentasSchema);