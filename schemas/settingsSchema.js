const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    mod_dark: {
        type: Boolean,
        required: true,
    },
    privacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Privacy",
    },
    actvity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
    },
});

const settings = mongoose.model("Settings", SettingsSchema);

module.exports = settings;