const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        required: true
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    role: {
        type: String,
        default: 'user',
        trim: true,  
        lowercase: true,
        enum: ['user', 'admin']
    }
},
{
    timestamps: true
}
);

UserSchema.methods.comparePassword = async function(password) {

    return bcrypt.compare(
        password,
        this.password
    );

};

UserSchema.pre("save", async function() {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', UserSchema);
module.exports = User;