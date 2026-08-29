const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
    vaccineAt: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    doseNumber: {
        type: Number,
        min: 1,
        max: 20,
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

const Vaccination = mongoose.model('Vaccination', VaccinationSchema);
module.exports = Vaccination;