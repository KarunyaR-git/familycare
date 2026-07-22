const Baby = require('../models/baby');
const Sleep = require('../models/sleep');

const mongoose = require('mongoose');

const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper')

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
            const error = new Error("At least one of sleptAt or wokeUpAt is required.");
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

async function getAllSleepRecords(req, res, next) {
    try{
        const filter = {
        userId: req.user.userId
        };
        if(req.query.babyId) {
            if(!mongoose.Types.ObjectId.isValid(req.query.babyId)) {
                const error = new Error("Invalid babyId");
                error.statusCode = 400;
                return next(error);
            }
            filter.babyId = req.query.babyId
        }
        const allowedSortFields = ["sleptAt", "wokeUpAt", "durationMinutes"];
        const sortOptions = getSort(req.query, allowedSortFields, "sleptAt", "desc");
        const pagination = getPagination(req.query);
        const skip = (pagination.page - 1)*pagination.limit;

        const total = await Sleep.countDocuments(filter);
        const sleepRecords = await Sleep.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit);

        const response = getPaginationMeta(total, pagination);
        response.data = sleepRecords;

        return res.status(200).json(response);
    }catch(error) {
        return next(error);
    }    
}

async function getSleepRecordById(req, res, next) {
    try{
        const sleepId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(sleepId)) {
            const error = new Error("Invalid id");
            error.statusCode = 400;
            return next(error);
        }

        const sleepRecord = await Sleep.findOne({
            _id: sleepId,
            userId: req.user.userId
        });
        if(!sleepRecord) {
            const error = new Error("Sleep record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json(sleepRecord);
    }catch(error) {
        return next(error);
    }
}

async function updateSleepRecordById(req, res, next) {
    try{
        const sleepId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(sleepId)) {
            const error = new Error("Invalid sleep id");
            error.statusCode = 400;
            return next(error);
        }
        if("sleptAt" in req.body && !isValidDate(req.body.sleptAt)) {
            const error = new Error("Invalid sleep date");
            error.statusCode = 400;
            return next(error);
        }
        if("wokeUpAt" in req.body && !isValidDate(req.body.wokeUpAt)) {
            const error = new Error("Invalid wokeUp date");
            error.statusCode = 400;
            return next(error);
        }
        const sleepRecord = await Sleep.findOne({
            _id: sleepId,
            userId: req.user.userId
        });
        if(!sleepRecord) {
            const error = new Error("Sleep record not found");
            error.statusCode = 404;
            return next(error);
        }
        const allowedFields = ["sleptAt", "sleepNotes", "wokeUpAt", "wokeUpNotes"];
        const updates = Object.keys(req.body);
        if(updates.length === 0) {
            const error = new Error("Body should not be empty");
            error.statusCode = 400;
            return next(error);
        }
        for(let field of updates) {
            if(allowedFields.includes(field)) {
                sleepRecord[field] = req.body[field];
            }
        }
        if(!sleepRecord.sleptAt && !sleepRecord.wokeUpAt) {
            const error = new Error("At least one of sleptAt or wokeUpAt is required.");
            error.statusCode = 400;
            return next(error);
        }
        if(sleepRecord.wokeUpAt && sleepRecord.sleptAt) {
            if(sleepRecord.wokeUpAt < sleepRecord.sleptAt) {
                const error = new Error("WokeUpAt date should be later than sleptAt date");
                error.statusCode = 400;
                return next(error);
            }
            calculateDurationMinutes(sleepRecord);
            if(sleepRecord.durationMinutes < 1) {
                const error = new Error("duration should not be less than a minute");
                error.statusCode = 400;
                return next(error);
            }
        } else {
            sleepRecord.durationMinutes = null;
        }
        await sleepRecord.save();
        return res.status(200).json(sleepRecord);         
    }catch(error) {
        return next(error);
    }
}

async function deleteSleepRecordById(req, res, next) {
    try {
        const sleepId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(sleepId)) {
            const error = new Error("Invalid sleep id");
            error.statusCode = 400;
            return next(error);
        }
        const deletedSleepRecord = await Sleep.findOneAndDelete({
            _id: sleepId,
            userId: req.user.userId
        });
        if(!deletedSleepRecord) {
            const error = new Error("Sleep record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(204).end();
    }catch(error) {
        return next(error);
    }
}

const isValidDate = (value) => {
    if (value === null || value === undefined) return true;
    return !isNaN(new Date(value).getTime());
};

function calculateDurationMinutes(sleepRecord) {
    sleepRecord.durationMinutes = (sleepRecord.wokeUpAt - sleepRecord.sleptAt) / 60000;
}

module.exports = {
    createSleepRecord,
    getAllSleepRecords,
    getSleepRecordById,
    updateSleepRecordById,
    deleteSleepRecordById
}