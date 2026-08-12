const Babies = require('../models/baby');
const Feeding = require('../models/feeding');
const Sleep = require('../models/sleep');
const Diaper = require('../models/diaper');
const Growth = require('../models/growth');
const Vaccination = require('../models/vaccination');
const Reminders = require('../models/reminders');

const mongoose = require('mongoose');

async function getDashboardDetails(req, res, next) {
    try{
        const userId = req.user.userId;
        const [ babies, remindersCount] = await Promise.all([
            Babies.find({userId}).sort({ createdAt: 1 }),
            Reminders.countDocuments({
                userId,
                status: 'pending'
            })
        ]);
        if(babies.length === 0){
            return res.status(200).json(
                {
                    babies,
                    remindersCount
                }
            )
        }
        const babyResponse = babies.map((baby)=>{
            return {
                id: baby._id,
                name: baby.name
            };
        })
        const dashboardResponse = {
            babies: babyResponse,
            remindersCount
        }
        const filter = {
            userId,
            babyId: dashboardResponse.babies[0].id
        };
        const babyDetails = await getBabyDetails(filter);
        return res.status(200).json({
            ...dashboardResponse,
            ...babyDetails
        });

    }catch(error) {
        return next(error);
    }
}

async function getBabyDetailsById(req, res, next) {
    try{
        const babyId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(babyId)) {
            const error = new Error('Invalid id');
            error.statusCode = 400;
            return next(error);
        }
        const existingBaby = await Babies.findOne({
            userId: req.user.userId,
            _id: babyId
        })
        if(!existingBaby) {
            const error = new Error('Baby not found');
            error.statusCode = 404;
            return next(error);
        }
        const filter = {
            userId: req.user.userId,
            babyId
        }
        const babyDetails = await getBabyDetails(filter);
        
        return res.status(200).json(babyDetails);
    }catch(error) {
        return next(error);
    }    
}

async function getBabyDetails(filter) {
    try{
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const nextDay = new Date(startOfDay);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const [feedingCount, diaperCount, latestGrowth, latestVaccination] = await Promise.all([
            Feeding.countDocuments({
                ...filter,
                feedingAt: {
                    $gte: startOfDay,
                    $lt: nextDay
                }
            }),
            Diaper.countDocuments({
                ...filter,
                changedAt: {
                    $gte: startOfDay,
                    $lt: nextDay
                }
            }),
            Growth.findOne(filter).sort({ measuredAt: -1 }).select(' -_id measuredAt weight height'),
            Vaccination.findOne(filter).sort({ vaccineAt: -1 }).select('-_id name doseNumber vaccineAt')
        ]);

        const userObjectId = new mongoose.Types.ObjectId(filter.userId);
        const babyObjectId = new mongoose.Types.ObjectId(filter.babyId);

        const sleepResponse = await Sleep.aggregate([
            {
                $match: {
                    babyId: babyObjectId,
                    userId: userObjectId,
                    sleptAt: {
                        $gte: startOfDay,
                        $lt: nextDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    sessions: { $sum: 1 },
                    totalDuration: {
                        $sum: {
                        $ifNull: ['$durationMinutes', 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    sessions: 1,
                    totalDuration: 1
                }
            }
        ]);
        const sleep = sleepResponse[0] || {
            sessions: 0,
            totalDuration: 0
        };
        const [feedings, diapers, sleeps, growths, vaccinations] = await Promise.all([
            Feeding.find(filter)
            .sort({ feedingAt: -1 })
            .select('feedingAt type')
            .limit(3),

            Diaper.find(filter)
            .sort({ changedAt: -1 })
            .select('changedAt type notes')
            .limit(3),

            Sleep.find(filter)
            .sort({ sleptAt: -1 })
            .select('sleptAt wokeUpAt durationMinutes')
            .limit(3),

            Growth.find(filter)
            .sort({ measuredAt: -1 })
            .select('measuredAt weight height')
            .limit(3),

            Vaccination.find(filter)
            .sort({ vaccineAt: -1 })
            .select('name doseNumber vaccineAt')
            .limit(3)

        ]);
        const activities = [...feedings, ...diapers, ...sleeps, ...growths, ...vaccinations];
        const normalizedActivities = normalizeActivities(activities);
        normalizedActivities.sort(
            (a, b) => new Date(b.activityAt) - new Date(a.activityAt)
        );
        const latestActivities = normalizedActivities.slice(0, 3);
        return {
        feedingCount,
        diaperCount,
        latestGrowth,
        latestVaccination,
        sleep,
        latestActivities
        };
    }catch(error) {
        throw(error);
    }    
}

function normalizeActivities(activities) {
    return activities.map((activity)=>{
        const obj = activity.toObject();
        let activityType;
        let activityAt;
        if(obj.feedingAt){
            activityType = 'feeding';
            activityAt = obj.feedingAt;
            delete obj.feedingAt;
        }else if(obj.changedAt){
            activityType = 'diaper';
            activityAt = obj.changedAt;
            delete obj.changedAt;
        }else if(obj.sleptAt){
            activityType = 'sleep';
            activityAt = obj.sleptAt;
            delete obj.sleptAt;
        }else if(obj.measuredAt){
            activityType = 'growth';
            activityAt = obj.measuredAt;
            delete obj.measuredAt;
        }else if(obj.vaccineAt){
            activityType = 'vaccination';
            activityAt = obj.vaccineAt;
            delete obj.vaccineAt;
        }
        return {
            ...obj,
            activityType,
            activityAt
        };
    })
}

module.exports = {
    getDashboardDetails,
    getBabyDetailsById
}