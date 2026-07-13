const mongoose = require('mongoose');

const FeedingSchema = new mongoose.Schema({
    feedingAt: {
        type: Date,
        required: true
    },
    foodName: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        min: 1
    },
    unit: {
        type: String,        
        trim: true,
        lowercase: true,
        enum: ["ml", "oz", "gram", "spoon", "piece", "serving", "other"]
    },
    duration: {
        type: Number,
        min: 1
    },
    breastfeedingSide: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["left", "right", "both"]
    },
    notes: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["breastfeeding", "formula", "solid", "water", "other"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    babyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby',
        required: true
    }
});

const Feeding = mongoose.model('Feeding', FeedingSchema);
module.exports = Feeding; 