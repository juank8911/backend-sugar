const mongoose = require("mongoose");

const PerfilSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    height: {
        type: String,
        unique: true,
        required: true,
    },
    eyes: {
        type: String,
        required: true,
    },
    Contex: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    about: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

const perfil = mongoose.model("Perfil", PerfilSchema);

module.exports = perfil;