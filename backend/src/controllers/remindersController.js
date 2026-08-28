const Reminder = require('../models/reminders');
const mongoose = require('mongoose');
const { getPagination, getSort, getPaginationMeta } = require('../utils/queryHelper');

async function createReminder(req, res, next) {
    try {
        const reminder = new Reminder({
            ...req.body,
            notifiedAt: null,
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

        const [total, reminders] = await Promise.all([
            Reminder.countDocuments(filter),
            Reminder.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(pagination.limit)
        ]);
        const response = getPaginationMeta(total, pagination)
        response.data = reminders;

        return res.status(200).json(response);
    } catch(error) {
        return next(error)
    }
}

async function getScheduledReminders(req, res, next) {
    try {
        const reminders = await Reminder.find({
            userId: req.user.userId,
            status: 'pending',
            reminderAt: { $gt: new Date() },
            notifiedAt: null
        }).sort({ reminderAt: 1 });

        return res.status(200).json(reminders);

    } catch (error) {
        return next(error);
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
                return res.status(200).json(reminder);
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
            const reminder = await Reminder.findOne({
            _id: req.params.id,
            userId: req.user.userId
            });

            if (!reminder) {
                const error = new Error('Reminder not found');
                error.statusCode = 404;
                throw error;
            }
            delete req.body.notifiedAt;

            const reminderAtChanged =
            req.body.reminderAt !== undefined &&
            new Date(req.body.reminderAt).getTime() !==
            new Date(reminder.reminderAt).getTime();

            const reminderBeforeChanged =
            req.body.reminderBefore !== undefined &&
            Number(req.body.reminderBefore) !==
            Number(reminder.reminderBefore);

            if (reminderAtChanged || reminderBeforeChanged) {
                req.body.notifiedAt = null;
            }

            const updatedReminder = await Reminder.findOneAndUpdate(filter, req.body, options);
            return res.status(200).json(updatedReminder);
        } catch(error) {
            return next(error);
        }
    } else {
        const error = new Error("Invalid Id");
        error.statusCode = 400;
        return next(error);
    }
}

async function updateNotifiedAtById(req, res, next) {
    try {
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error("Invalid Id");
            error.statusCode = 400;
            return next(error);
        }
        const reminder = await Reminder.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.user.userId,
            status: 'pending'
        },
        {
            notifiedAt: new Date()
        },
        {
            new: true
        }
        );

        if (!reminder) {
        const error = new Error('Reminder not found');
        error.statusCode = 404;
        throw error;
        }

        res.status(200).json(reminder);
    } catch(error) {
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
    deleteReminderById,
    updateNotifiedAtById,
    getScheduledReminders
}