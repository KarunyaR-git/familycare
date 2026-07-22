const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    reminderAt: {
        type: Date,
        required: true
    },
    reminderBefore: {
        type: Number,        
        default: 60,
        min: 5,
    },
    status: {
        type: String,
        default: 'pending',
        trim: true,
        lowercase: true,
        enum: ['pending', 'completed']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
}
);

const Reminder = mongoose.model('Reminder', ReminderSchema);
module.exports = Reminder;