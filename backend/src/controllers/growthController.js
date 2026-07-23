const mongoose = require('mongoose');

const Baby = require('../models/baby');
const Growth = require('../models/growth');

const { isValidDate, isFutureDate } = require('../utils/dateHelper');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

async function createGrowthRecord(req, res, next) {
    try {
        const babyId = req.body.babyId;
        if(!babyId) {
            const error = new Error("Baby id is required");
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
        if(!req.body.measuredAt) {
            const error = new Error("Measured date is required");
            error.statusCode = 400;
            return next(error);
        }
        if(!isValidDate(req.body.measuredAt)) {
            const error = new Error("Invalid date");
            error.statusCode = 400;
            return next(error);
        }
        if(isFutureDate(req.body.measuredAt)) {
            const error = new Error("Future date and time is not allowed.");
            error.statusCode = 400;
            return next(error);
        }
        if(req.body.notes?.trim() === '') {
            req.body.notes = null;
        }

        const growthRecord = new Growth({
            ...req.body,
            userId: req.user.userId
        });
        await growthRecord.save();

        return res.status(201).json(growthRecord);
    }catch(error) {
        return next(error);
    }
}

async function getAllGrowthRecords(req, res, next) {
    try {
        const filter = {
            userId: req.user.userId
        };
        if(req.query.babyId) {
            if(!mongoose.Types.ObjectId.isValid(req.query.babyId)) {
                const error = new Error("Invalid babyId");
                error.statusCode = 400;
                return next(error);
            }
            filter.babyId = req.query.babyId;
        }

        const allowedSortFields = ["measuredAt", "weight", "height"];
        const sortOptions = getSort(req.query, allowedSortFields, "measuredAt", "desc");

        const pagination = getPagination(req.query);
        const skip = ( pagination.page - 1 ) * pagination.limit;

        const total = await Growth.countDocuments(filter);
        const growthRecords = await Growth.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit);

        const response = getPaginationMeta(total, pagination);
        response.data = growthRecords;

        return res.status(200).json(response);
        
    }catch(error) {
        return next(error);
    }    
}

async function getGrowthRecordById(req, res, next) {
    try {
        const growthId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(growthId)) {
            const error = new Error("Invalid growth record id");
            error.statusCode = 400;
            return next(error);
        }
        const growthRecord = await Growth.findOne({
            _id: growthId,
            userId: req.user.userId
        });
        if(!growthRecord) {
            const error = new Error("Growth record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json(growthRecord);
    }catch(error) {
        return next(error);
    }    
}

async function updateGrowthRecordById(req, res, next) {
    try {
        const growthId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(growthId)) {
            const error = new Error("Invalid growth record id");
            error.statusCode = 400;
            return next(error);
        }
        if("measuredAt" in req.body) {
            if(!isValidDate(req.body.measuredAt)) {
                const error = new Error("Invalid date");
                error.statusCode = 400;
                return next(error);
            }
            if(isFutureDate(req.body.measuredAt)) {
                const error = new Error("Future date and time is not allowed.");
                error.statusCode = 400;
                return next(error);
            }            
        }
        if(req.body.notes?.trim() === '') {
            req.body.notes = null;
        }
        const existingGrowthRecord = await Growth.findOne({
            _id: growthId,
            userId: req.user.userId
        });
        if(!existingGrowthRecord) {
            const error = new Error("Growth record not found");
            error.statusCode = 404;
            return next(error);
        }
        const allowedFields = ["measuredAt", "weight", "height", "notes"];
        const updates = Object.keys(req.body);

        if(updates.length === 0) {
            const error = new Error("Body should not be empty.");
            error.statusCode = 400;
            return next(error);
        }

        for(let field of updates) {
            if(!allowedFields.includes(field)) {
                continue;
            }
            existingGrowthRecord[field] = req.body[field];
        }

        await existingGrowthRecord.save();

        return res.status(200).json(existingGrowthRecord);
    }catch(error) {
        return next(error);
    }    
}

async function deleteGrowthRecordById(req, res, next) {
    try{
        const growthId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(growthId)) {
            const error = new Error("Invalid growth record id");
            error.statusCode = 400;
            return next(error);
        }
        const deletedRecord = await Growth.findOneAndDelete({
            _id: growthId,
            userId: req.user.userId
        });
        if(!deletedRecord) {
            const error = new Error("Growth record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(204).end();
    }catch(error) {
        return next(error);
    }     
}

module.exports = {
    createGrowthRecord,
    getAllGrowthRecords,
    getGrowthRecordById,
    updateGrowthRecordById,
    deleteGrowthRecordById
}