const mongoose = require('mongoose');
const Feeding = require('../models/feeding');
const Baby = require('../models/baby');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

async function createFeeding(req, res, next) {
    if(!req.body.babyId) {
        const error = new Error("BabyId is required");
        error.statusCode = 400;
        return next(error);
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.babyId)){
        const error = new Error("Invalid BabyId");
        error.statusCode = 400;
        return next(error);
    }
    const feeding = new Feeding({
        ...req.body,
        userId: req.user.userId
    })   
    try{
        validateFeeding(feeding);
        const existingBaby = await Baby.findOne({
            _id: feeding.babyId,
            userId: feeding.userId
        });
        if(!existingBaby) {
            const error = new Error("Baby not found");
            error.statusCode = 404;
            return next(error);
        }
        await feeding.save();
        res.status(201).json(feeding);        
    }catch(error) {
        return next(error);
    }
}

async function getAllFeedings(req, res, next) {
    try{
        const filter = {
        userId: req.user.userId
        }
        if(req.query.babyId) {
            filter.babyId = req.query.babyId
        }
        if(req.query.type) {
            filter.type = req.query.type
        }
        const allowedSortFields = ["feedingAt", "type", "quantity", "duration"];
        const sortOptions = getSort(req.query, allowedSortFields, "feedingAt", "desc");
        const pagination = getPagination(req.query);
        const skip = (pagination.page - 1)*pagination.limit;

        const total = await Feeding.countDocuments(filter);
        const feedings = await Feeding.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit)

        const response = getPaginationMeta(total, pagination);
        response.data = feedings;

        return res.status(200).json(response);
    }catch(error) {
        return next(error);
    }
    
}

async function getfeedingById(req, res, next) {
    const feedingId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(feedingId)) {
        const error = new Error("Invalid id");
        error.statusCode = 400;
        return next(error);
    }
    try{
        const feeding = await Feeding.findOne({
            _id: feedingId,
            userId: req.user.userId
        });
        if(!feeding) {
            const error = new Error("Feeding not found");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json(feeding);
    }catch(error) {
        return next(error);
    }    
}

async function updateFeedingById(req, res, next) {
      const feedingId = req.params.id;
      if(!mongoose.Types.ObjectId.isValid(feedingId)) {
        const error = new Error("Invalid id");
        error.statusCode = 400;
        return next(error);
      }
      try{
        const filter = {
            _id: feedingId,
            userId: req.user.userId
        }
        const existingFeeding = await Feeding.findOne(filter);
        if(!existingFeeding) {
            const error = new Error("Feeding not found");
            error.statusCode = 404;
            return next(error);
        }
        const allowedFields = [
            "feedingAt",
            "type",
            "foodName",
            "quantity",
            "unit",
            "duration",
            "breastfeedingSide",
            "notes"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                existingFeeding[field] = req.body[field];
            }
        }
        clearUnWantedFields(existingFeeding);
        validateFeeding(existingFeeding);
        
        const updatedFeeding = await existingFeeding.save();
        return res.status(200).json(updatedFeeding);
      }catch(error) {
        return next(error);
      }
}

function clearUnWantedFields(feeding) {
    if(["formula", "water", "solid", "other"].includes(feeding.type)) {
        feeding.breastfeedingSide = undefined;
        feeding.duration = undefined;
        if(feeding.type == "formula" || feeding.type === "water") {
            feeding.foodName = undefined;
        }
    } else {
        feeding.quantity = undefined;
        feeding.unit = undefined;
        feeding.foodName = undefined;
    }
}

function validateFeeding(feeding) {
    if(feeding.type === "breastfeeding" && (!feeding.duration || !feeding.breastfeedingSide)) {
        const error = new Error("duration and breastFedding Side are required for type breastFeeding");
        error.statusCode = 400;
        throw error;
    }
    if((feeding.type === "formula" || feeding.type === "water")&& (!feeding.quantity || !feeding.unit)) {
        const error = new Error("quantity and unit are required for type " + feeding.type);
        error.statusCode = 400;
        throw error;
    }
    if(feeding.type === "solid" && (!feeding.foodName || !feeding.quantity || !feeding.unit)) {
        const error = new Error("foodName, quantity and unit are required for type solid");
        error.statusCode = 400;
        throw error;
    }
}

module.exports = {
    createFeeding,
    getAllFeedings,
    getfeedingById,
    updateFeedingById
}