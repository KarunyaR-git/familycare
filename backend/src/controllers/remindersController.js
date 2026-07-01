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
        const filter = {
            userId: req.user.userId
        }
        const sortBy = req.query.sortBy;
        const order = req.query.order;
        const allowedSortField = ["title", "status", "reminderAt", "reminderBefore"];
        const allowedOrderField = ["asc", "desc"];

        if((sortBy && !allowedSortField.includes(sortBy)) || (order && !allowedOrderField.includes(order))) {
            const error = new Error("Invalid sortBy or order value");
            error.statusCode = 400;
            return next(error);
        }

        const field = sortBy || "reminderAt"
        let sortOptions = {
           [field] : order || "asc"
        }

        if(req.query.status) {
            filter.status = req.query.status;
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);  

        if((req.query.page && (isNaN(page) || page < 1 ) ) || (req.query.limit && ( isNaN(limit)  || limit < 1) ) ) {
            const error = new Error("Invalid page or limit");
            error.statusCode = 400;
            return next(error);
        }

        const pagination = {
            page: page || 1,
            limit: limit || 10
        };
        const formula = (pagination.page - 1)*pagination.limit;

        const reminders = await Reminder.find(filter)
        .sort(sortOptions)
        .skip(formula)
        .limit(pagination.limit);

        const total = await Reminder.countDocuments(filter);

        const totalPages = Math.ceil(total / pagination.limit);
        const response = {
            total: total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: totalPages,
            data: reminders
        }
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