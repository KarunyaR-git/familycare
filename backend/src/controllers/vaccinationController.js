const mongoose = require('mongoose');

const Baby = require('../models/baby');
const Vaccination = require('../models/vaccination');

const { isValidDate, isFutureDate } = require('../utils/dateHelper');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

async function createVaccination(req, res, next) {
    try{
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
        if(!req.body.vaccineAt) {
            const error = new Error("vaccineAt field is required");
            error.statusCode = 400;
            return next(error);
        }
        if(!isValidDate(req.body.vaccineAt)) {
            const error = new Error("Invalid date");
            error.statusCode = 400;
            return next(error);
        }
        if(isFutureDate(req.body.vaccineAt)) {
            const error = new Error("Future date and time is not allowed.");
            error.statusCode = 400;
            return next(error);
        }
        if(req.body.notes?.trim() === '') {
            req.body.notes = null;
        }

        const vaccinationRecord = new Vaccination({
            ...req.body,
            userId: req.user.userId
        });

        await vaccinationRecord.save();
        return res.status(201).json(vaccinationRecord);
    }catch(error) {
        return next(error);
    }        
}

async function getAllVaccinations(req, res, next) {
    try {        
        const filter = {
            userId: req.user.userId
        };
        if(req.query.babyId) {
            if(!mongoose.Types.ObjectId.isValid(req.query.babyId)) {
                const error = new Error("Invalid baby id");
                error.statusCode = 400;
            return next(error);
            }
            filter.babyId = req.query.babyId;
        }
        if(req.query.name) {
            filter.name = req.query.name.trim().toLowerCase();
        }
        const allowedSortFields = ["vaccineAt", "name", "doseNumber"];
        const sortOptions = getSort(req.query, allowedSortFields, "vaccineAt", "desc");

        const pagination = getPagination(req.query);
        const skip = ( pagination.page - 1 ) * pagination.limit;

        const total = await Vaccination.countDocuments(filter);
        const vaccinationRecords = await Vaccination.find(filter)
        .populate("babyId", "name gender dob")
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit);

        const response = getPaginationMeta(total, pagination);
        response.data = vaccinationRecords;

        return res.status(200).json(response);
    }catch(error) {
        return next(error);
    }
}

async function getVaccinationById(req, res, next) {
    try{
        const vaccinationId  = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(vaccinationId)) {
            const error = new Error("Invalid id");
            error.statusCode = 400;
            return next(error);
        }
        const vaccinationRecord = await Vaccination.findOne({
            _id: vaccinationId,
            userId: req.user.userId
        }).populate("babyId", "name gender dob");
        if(!vaccinationRecord) {
            const error = new Error("Vaccination record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json(vaccinationRecord);
    }catch(error) {
        return next(error);
    }    
}

async function updateVaccinationRecordById(req, res, next) {
    try {
        const vaccinationId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(vaccinationId)) {
            const error = new Error("Invalid id");
            error.statusCode = 400;
            return next(error);
        }
        
        if("vaccineAt" in req.body ) {
            if(!isValidDate(req.body.vaccineAt)) {
                const error = new Error("Invalid date");
                error.statusCode = 400;
                return next(error);
            }
            if(isFutureDate(req.body.vaccineAt)) {
                const error = new Error("Future date and time is not allowed.");
                error.statusCode = 400;
                return next(error);
            }
        }

        if(req.body.notes?.trim() === '') {
            req.body.notes = null;
        }
        
        const updates = Object.keys(req.body);
        if(updates.length === 0) {
            const error = new Error("Body should not be empty");
            error.statusCode = 400;
            return next(error);
        }
        const allowedFields = ["vaccineAt", "name", "doseNumber", "notes"];

        const existingRecord = await Vaccination.findOne({
            _id: vaccinationId,
            userId: req.user.userId
        })
        if(!existingRecord) {
            const error = new Error("Vaccination record not found");
            error.statusCode = 404;
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
    }catch(error) {
        return next(error);
    }    
}

async function deleteVaccinationRecordById(req, res, next) {
    try {
        const vaccinationId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(vaccinationId)) {
            const error = new Error("Invalid id");
            error.statusCode = 400;
            return next(error);
        }
        const deletedRecord = await Vaccination.findOneAndDelete({
            _id: vaccinationId,
            userId: req.user.userId
        });
        if(!deletedRecord) {
            const error = new Error("Vaccination record not found");
            error.statusCode = 404;
            return next(error);
        }
        return res.status(204).end();
    }catch(error) {
        return next(error);
    }
}

module.exports = {
    createVaccination,
    getAllVaccinations,
    getVaccinationById,
    updateVaccinationRecordById,
    deleteVaccinationRecordById
}