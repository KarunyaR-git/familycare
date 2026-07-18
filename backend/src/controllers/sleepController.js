const Baby = require('../models/baby');
const Sleep = require('../models/sleep');

const mongoose = require('mongoose');

async function createSleepRecord(req, res, next) {
    try{
        if(!req.body.babyId) {
            const error = new Error("BabyId is required to log sleep activity.");
            error.statusCode = 400;
            return next(error);
        }
        if(!mongoose.Types.ObjectId.isValid(req.body.babyId)) {
            const error = new Error("Invalid babyId");
            error.statusCode = 400;
            return next(error);
        }
        if(!req.body.sleptAt && !req.body.wokeUpAt) {
            const error = new Error("SleptAt or wokeUpAt field are required to log an sleep activity");
            error.statusCode = 400;
            return next(error);
        }
        const sleepRecord = new Sleep({
            ...req.body,
            durationMinutes: null,
            userId: req.user.userId
        });        
        const baby = await Baby.findOne({
            _id: sleepRecord.babyId,
            userId: req.user.userId
        })
        if(!baby) {
            const error = new Error("Baby not found");
            error.statusCode = 404;
            return next(error);
        }        

        const existingSleepRecord = await Sleep.findOne({
            babyId: sleepRecord.babyId,
            userId: req.user.userId,
            wokeUpAt: null
        })

        if(sleepRecord.sleptAt && !sleepRecord.wokeUpAt) {           
            if(existingSleepRecord) {
                const error = new Error("Sleep activity is already exists.");
                error.statusCode = 409;
                return next(error);
            }
            await sleepRecord.save();
            return res.status(201).json(sleepRecord);
        } else if(!sleepRecord.sleptAt && sleepRecord.wokeUpAt) {
            if(existingSleepRecord) {
                if(sleepRecord.wokeUpAt <= existingSleepRecord.sleptAt) {
                    const error = new Error("wokeUpAt should be later than sleptAt");
                    error.statusCode = 400;
                    return next(error);
                }                
                const allowedFields = ["wokeUpAt", "wokeUpNotes"];
                for (const field of allowedFields) {
                    if (sleepRecord[field] !== undefined) {
                        existingSleepRecord[field] = sleepRecord[field];
                    }
                }
                calculateDurationMinutes(existingSleepRecord);
                await existingSleepRecord.save();
                return res.status(200).json(existingSleepRecord);
            } else {
                await sleepRecord.save();
                return res.status(201).json(sleepRecord);
            }
           
        } else {
            if(existingSleepRecord) {
                const error = new Error("Sleep activity is already exists.");
                error.statusCode = 409;
                return next(error);
            }
            if(sleepRecord.wokeUpAt <= sleepRecord.sleptAt) {
                const error = new Error("wokeUpAt should be later than sleptAt");
                error.statusCode = 400;
                return next(error);
            }
            calculateDurationMinutes(sleepRecord);
            await sleepRecord.save();
            return res.status(201).json(sleepRecord);
        }
    } catch(error) {
        return next(error);
    }
}

function calculateDurationMinutes(sleepRecord) {
    sleepRecord.durationMinutes = (sleepRecord.wokeUpAt - sleepRecord.sleptAt) / 60000;
}

module.exports = {
    createSleepRecord
}