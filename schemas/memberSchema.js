const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,

    identification: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    name: String,
    lastName: String,
    bornDate: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;