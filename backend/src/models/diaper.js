const mongoose = require('mongoose');

const DiaperSchema = new mongoose.Schema({
    changedAt: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        enum: ["wet", "dirty", "both"]        
    },
    notes: {
        type: String,
        trim: true
    },
    babyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
}
);

const Diaper = mongoose.model('Diaper', DiaperSchema);
module.exports = Diaper;