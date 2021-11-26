const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,

    cedula: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    nombre: String,
    apellidos: String,
    f_nacimiento: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;