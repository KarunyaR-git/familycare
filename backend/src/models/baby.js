const mongoose = require('mongoose');
const BabySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        enum: ['boy', 'girl']
    },
    dob: {
        type: Date,
        required: true
    },
    bloodGroup: {
        type: String,
        trim: true,
        uppercase: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Baby = new mongoose.model('Baby', BabySchema);
module.exports = Baby;