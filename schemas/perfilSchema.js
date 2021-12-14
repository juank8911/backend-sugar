const mongoose = require('mongoose');

const PerfilSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    identification: {
        type: Number,
        unique: true,
        required: true
    },
    altrura: Number,
    ojos: {
        type: String,
        required: true
    },
    Contextura: {
        type: Number,
        unique: true,
        required: true
    },
    User: {
        type: Number,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }

});

const perfil = mongoose.model('Perfil', PerfilSchema);

module.exports = perfil;