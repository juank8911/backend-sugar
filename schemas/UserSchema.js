const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    nam_usu: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    correo: {
        type: String,
        unique: true,
        required: true
    },
    movil: {
        type: Number,
        unique: true,
        required: true
    },
    val_session: Number,
    id_facebook: String,
    id_gmail: String,
    salt: Number,
    member: {
        type: Number,
        ref: 'Member'
    },
    created: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;