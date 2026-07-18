const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
    sleptAt: {
        type: Date
    },
    sleepNotes: {
        type: String,
        trim: true
    },
    wokeUpAt: {
        type: Date  
    },
    wokeUpNotes: {
        type: String,
        trim: true
    },
    durationMinutes: {
        type: Number,
        min: 0
    },
    babyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Sleep = mongoose.model('Sleep', SleepSchema);
module.exports = Sleep;