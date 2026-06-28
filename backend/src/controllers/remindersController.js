const Reminder = require('../models/reminders');
const mongoose = require('mongoose');

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
        const reminders = await Reminder.find({userId: req.user.userId});
        return res.status(200).json(reminders);
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

module.exports = {
    createReminder,
    getAllReminders,
    getReminderById,
    updateReminderById
}