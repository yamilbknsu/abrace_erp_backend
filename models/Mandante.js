const mongoose = require('mongoose');

const MandanteSchema = mongoose.Schema({
    /*
    _id objID
    userid objID
    PersonaID objID FK -< Persona._id
    Conyuge objID FK -< Persona._id
    */
    userid: {
        type: mongoose.ObjectId,
        required: true
    },
    personaID: {
        type: mongoose.ObjectId,
        required: true
    },
    conyuge: mongoose.ObjectId
});

module.exports = mongoose.model('Mandantes', MandanteSchema);