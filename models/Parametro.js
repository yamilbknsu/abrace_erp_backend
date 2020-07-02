const mongoose = require('mongoose');

const ParametroSchema = mongoose.Schema({
    concept:{
        type: String,
        required: true
    },
    values: {
        type: [{code: String, attributes: [String]}],
        required: true,
        default: [{code: 0, attributes: ['example-attr-1', 'example-attr-2']}]
    }
});

module.exports = mongoose.model('Parametros', ParametroSchema);