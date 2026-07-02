const Baby = require('../models/baby');

async function createBaby(req, res, next) {
    const baby = new Baby({
        ...req.body,
        userId: req.user.userId
    });
    try {
        await baby.save();
        return res.status(201).json(baby);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createBaby
}