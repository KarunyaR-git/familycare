const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function register(req, res, next) {
    const {name, email, password, age} = req.body;
    if(!name || !email || !password) {
        const error = new Error('Name, email and password are required for registration');
        error.statusCode = 400;
        return next(error);
    } else {
        try {
            const user = await User.findOne({email});
            if(user){
                const error = new Error('User already exists');
                error.statusCode = 409;
                return next(error);
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    age
                });
                await newUser.save();
                return res.status(201).json({
                    message: "User registered successfully"
                });
            }
        } catch(error) {
            return next(error);
        }
    }
}

async function login(req, res, next) {
    const {email, password} = req.body;
    if(!email || !password) {
        const error = new Error('Email and password are required to login');
        error.statusCode = 400;
        return next(error);
    } else {
        try{
            const user = await User.findOne({email});
            if(user) {
                const verifiedUser = await user.comparePassword(password);
                if(verifiedUser) {
                    const payload = {
                        userId: user._id,
                        role: user.role
                    };
                    const options = {
                        expiresIn: '1d'
                    };
                    const token = jwt.sign(payload, process.env.JWT_SECRET, options); // jwt.sign() is synchronous so dont need await
                    return res.status(200).json({
                        ...payload,
                        token: token
                    })
                } else {
                    const error = new Error('Invalid email or password');
                    error.statusCode = 401;
                    return next(error);
                }
            } else {
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                return next(error);
            }
        } catch(error) {
            return next(error);
        }   
    }
}

module.exports = {register, login};