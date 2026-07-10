const Baby = require('../models/baby');
const mongoose = require('mongoose');

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

async function getAllBabies(req, res, next) {
    try {
        const filter = {
            userId: req.user.userId
        }
        const babies = await Baby.find(filter)
        return res.status(200).json(babies);
    } catch(error) {
        return next(error);
    }
}

async function getBabyById(req, res, next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)) {
        try {
            const filter = {
                _id: id,
                userId: req.user.userId
            }
            const baby = await Baby.findOne(filter);
            if(baby) {
                return res.status(200).json(baby);
            } else {
                const error = new Error("Baby not found");
                error.statusCode = 404;
                return next(error); 
            }
        } catch(error) {
            return next(error);
        }        
    } else {
        const error = new Error("Invalid id");
        error.statusCode = 400;
        return next(error);
    }
}

async function updateBabyById(req, res, next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)) {
        const allowedFields = ["name", "gender", "dob", "bloodGroup"];
        const requestKeys = Object.keys(req.body || {});
        if(requestKeys.length === 0) {
            const error = new Error("At least one field is required for update");
            error.statusCode = 400;
            return next(error);
        }
        const isAllowed = requestKeys.every((field) => allowedFields.includes(field));
        if(isAllowed) {
            const filter = {
                _id: id,
                userId: req.user.userId
            }
            const options = {
                new: true,
                runValidators: true
            }
            try{
                const updatedBaby = await Baby.findOneAndUpdate(filter, req.body, options);
                if(updatedBaby) {
                    return res.status(200).json(updatedBaby);
                } else {
                    const error = new Error("Baby not found");
                    error.statusCode = 404;
                    return next(error);
                }
            } catch(error) {
                return next(error);
            }
        } else {
            const error = new Error("Invalid field for Baby update.")
            error.statusCode = 400;
            return next(error);
        }

    } else {
        const error = new Error('Invalid id');
        error.statusCode = 400;
        return next(error);
    }
}

async function deleteBabyById(req, res, next) {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid id");
        error.statusCode = 400;
        return next(error);
    }
    try {
        const filter = {
            _id: id,
            userId: req.user.userId
        }
        const deletedBaby = await Baby.findOneAndDelete(filter);
        if(!deletedBaby) {
            const error = new Error("Baby not found");
            error.statusCode = 404;
            return next(error);
        }
        res.status(204).end();
    } catch(error) {
        return next(error);
    }
}

module.exports = {
    createBaby,
    getAllBabies,
    getBabyById,
    updateBabyById,
    deleteBabyById
}