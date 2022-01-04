const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    namUsu: {
        type: String,
        // unique: true,
        required: true,
    },
    password: String,
    email: {
        type: String,
        // unique: true,
        required: true,
    },
    phone: {
        type: Number,
        // unique: true,
        required: true,
    },
    valSession: Number,
    idFacebook: String,
    idGmail: String,
    salt: Number,

    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;