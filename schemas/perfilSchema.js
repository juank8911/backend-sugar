const mongoose = require("mongoose");

const PerfilSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    job: {
        type: String,
    },
    business: {
        type: String,
    },
    school: {
        type: String,
    },
    height: {
        type: String,
    },
    eyes: {
        type: String,
    },
    contex: {
        type: String,
    },
    gender: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
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