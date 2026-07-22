const Diaper = require('../models/diaper');
const Baby = require('../models/baby');
const mongoose = require('mongoose');
const { isValidDate, isFutureDate } = require('../utils/dateHelper');

async function createDiaper(req, res, next) {
    try{
        const babyId = req.body.babyId;
        if(!babyId) {
            const error = new Error("BabyId is required");
            error.statusCode = 400;
            return next(error);
        }
        if(!mongoose.Types.ObjectId.isValid(babyId)) {
            const error = new Error("Invalid baby id");
            error.statusCode = 400;
            return next(error);
        }
        const existingBaby = await Baby.findOne({
            _id: babyId,
            userId: req.user.userId
        });
        if(!existingBaby) {
            const error = new Error("Baby not found");
            error.statusCode = 404;
            return next(error);
        }
        if(!("changedAt" in req.body)) {
            const error = new Error("changedAt field is required");
            error.statusCode = 400;
            return next(error);
        }
        if(!isValidDate(req.body.changedAt)) {
            const error = new Error("Invalid date");
            error.statusCode = 400;
            return next(error);
        }

        if(isFutureDate(req.body.changedAt)) {
            const error = new Error("Future date and time is not allowed.");
            error.statusCode = 400;
            return next(error);
        }

        if(req.body.notes?.trim() === '') {
            req.body.notes = null;  
        }
        const diaperRecord = new Diaper({
            ...req.body,
            babyId,
            userId: req.user.userId
        });

        await diaperRecord.save();

        return res.status(201).json(diaperRecord);
    }catch(error) {
        return next(error);
    }    
}

module.exports = {
    createDiaper
}