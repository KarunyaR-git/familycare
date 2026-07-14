const Reminder = require('../models/reminders');
const mongoose = require('mongoose');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

async function createReminder(req, res, next) {
    try {
        const reminder = new Reminder({
            ...req.body,
            userId: req.user.userId
        });
        await reminder.save();
        res.status(201).json(reminder);
    } catch(error){
        return next(error);
    }    
}

async function getAllReminders(req, res, next) {
    try{
        const filter = {
            userId: req.user.userId
        }
        const allowedSortField = ["title", "status", "reminderAt", "reminderBefore"];
        const sortOptions = getSort(req.query, allowedSortField, "reminderAt", "asc")

        if(req.query.status) {
            filter.status = req.query.status;
        }

        const pagination = getPagination(req.query);
        const skip = (pagination.page - 1)*pagination.limit;

        const reminders = await Reminder.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit);

        const total = await Reminder.countDocuments(filter);
        const response = getPaginationMeta(total, pagination)
        response.data = reminders;

        return res.status(200).json(response);
    } catch(error) {
        return next(error)
    }
}

async function getReminderById(req, res, next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)) {
        try{
            const reminder = await Reminder.findOne({
                _id: id,
                userId: req.user.userId
            });
            if(reminder) {
                //if(reminder.userId.toString() === req.user.userId) {
                    return res.status(200).json(reminder);
                // } else {
                //     console.log("reminder: ", reminder.userId);
                //     console.log("user: ", req.user.userId);
                //     const error = new Error('UnAuthorized Access');
                //     error.statusCode = 401;
                //     return next(error);
                // }
            } else {
                const error = new Error('Reminder not found');
                error.statusCode = 404;
                return next(error);
            }
        } catch(error) {
            return next(error);
        }
    } else {
        const error = new Error('Invalid id');
        error.statusCode = 400;
        return next(error);
    }
}

async function updateReminderById(req, res, next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)) {
        const filter = {
            _id: req.params.id,
            userId: req.user.userId
        }
        const options = {new: true, runValidators: true};
        try{
            const updatedReminder = await Reminder.findOneAndUpdate(filter, req.body, options);
            if(updatedReminder) {
                return res.status(200).json(updatedReminder);
            } else {
                const error = new Error("Reminder not found");
                error.statusCode = 404;
                return next(error);
            }
        } catch(error) {
            return next(error);
        }
    } else {
        const error = new Error("Invalid Id");
        error.statusCode = 400;
        return next(error);
    }
}

async function deleteReminderById(req, res, next) {
    const id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(id)) {
        try {
            const filter = {
                _id: id,
                userId: req.user.userId
            }
            const deletedUser = await Reminder.findOneAndDelete(filter);
            if(deletedUser) {
                res.status(204).end();
            } else {
                const error = new Error('Reminder not found');
                error.statusCode = 404;
                return next(error);
            }
        } catch(error) {
            return next(error);
        }
    } else {
        const error = new Error('Invalid id');
        error.statusCode = 400;
        return next(error);
    }
}

module.exports = {
    createReminder,
    getAllReminders,
    getReminderById,
    updateReminderById,
    deleteReminderById
}