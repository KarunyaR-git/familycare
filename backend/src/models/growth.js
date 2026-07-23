const mongoose = require('mongoose');

const GrowthSchema = new mongoose.Schema({
    measuredAt: {
        type: Date,
        required: true
    },
    weight: {
        type: Number,
        min: 1,
        required: true
    },
    height: {
        type: Number,
        min: 10,
        required: true
    },
    notes: {
        type: String,
        trim: true
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
},
{
    timestamps: true
}
);

const Growth = mongoose.model('Growth', GrowthSchema);
module.exports = Growth;