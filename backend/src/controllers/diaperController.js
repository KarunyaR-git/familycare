const Diaper = require('../models/diaper');
const Baby = require('../models/baby');

const mongoose = require('mongoose');

const { isValidDate, isFutureDate } = require('../utils/dateHelper');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

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

async function getAllDiapers(req, res, next) {
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
        if(req.query.type) {
            filter.type = req.query.type;
        }
        const allowSortFields = ["changedAt", "type"];
        const sortOptions = getSort(req.query, allowSortFields, "changedAt", "desc");

        const pagination = getPagination(req.query);
        const skip = (pagination.page - 1) * pagination.limit;

        const total = await Diaper.countDocuments(filter);
        const diapers = await Diaper.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit);

        const response = getPaginationMeta(total, pagination);
        response.data = diapers;

        return res.status(200).json(response);
    }catch (error) {
        return next(error);
    }    
}

async function getDiaperById(req, res, next) {
    try{
        const diaperId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(diaperId)) {
            const error = new Error("Invalid diaper id");
            error.statusCode = 400;
            return next(error);
        }
        const diaperRecord = await Diaper.findOne({
            _id: diaperId,
            userId: req.user.userId
        });
        if(!diaperRecord) {
            const error = new Error("Diaper record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json(diaperRecord);
    }catch(error) {
        return next(error);
    }
}

async function updateDiaperById(req, res, next) {
    const diaperId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(diaperId)) {
        const error = new Error("Invalid diaper id");
        error.statusCode = 400;
        return next(error);
    }
    if("changedAt" in req.body) {
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
    }
    if(req.body.notes?.trim() === '') {
        req.body.notes = null;
    }
    const existingRecord = await Diaper.findOne({
        _id: diaperId,
        userId: req.user.userId
    });
    if(!existingRecord) {
        const error = new Error("Diaper record not found");
        error.statusCode = 404;
        return next(error);
    }
    const allowedFields = ["changedAt", "type", "notes"];
    const updates = Object.keys(req.body);

    if (updates.length === 0) {
        const error = new Error("Body should not be empty");
        error.statusCode = 400;
        return next(error);
    }

    for(let field of updates) {
        if(!allowedFields.includes(field)) {
            continue;
        }
        existingRecord[field] = req.body[field];
    }

    await existingRecord.save();
    return res.status(200).json(existingRecord);
}

async function deleteDiaperById(req, res, next) {
    const diaperId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(diaperId)) {
        const error = new Error("Invalid diaper id");
        error.statusCode = 400;
        return next(error);
    }
    const deletedRecord = await Diaper.findOneAndDelete({
        _id: diaperId,
        userId: req.user.userId
    });
    if(!deletedRecord) {
        const error = new Error("Diaper record not found");
        error.statusCode = 404;
        return next(error);
    }
    return res.status(204).end();
}

module.exports = {
    createDiaper,
    getAllDiapers,
    getDiaperById,
    updateDiaperById,
    deleteDiaperById
}