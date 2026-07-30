const mongoose = require('mongoose');

const Vaccination = require('../models/vaccination');
const Baby = require('../models/baby');

async function getVaccinationReport(req, res, next) {
    try{
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const vaccinationReport = await Vaccination.aggregate([
            {
                $match : {
                    userId
                }
            },
            {
                $lookup: {
                    from: 'babies',
                    localField: 'babyId',
                    foreignField: '_id',
                    as: 'baby'
                }
            },
            {
                $unwind: '$baby'
            },
            {
                $project: {
                    _id: 0,
                    babyName: '$baby.name',
                    vaccineName: '$name',
                    doseNumber: 1,
                    vaccineAt: 1
                }
            }

        ]);
        return res.status(200).json(vaccinationReport);
    }catch(error) {
        return next(error);
    }
}

async function getBabyDashboard(req, res, next) {
    try{
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const babyDashboard = await Baby.aggregate([
            {
                $match: {
                    userId
                }
            },
            {
                $lookup: {
                    from: 'vaccinations',
                    'localField': '_id',
                    'foreignField': 'babyId',
                    as: 'vaccinations'
                }
            },
            {
                $unwind: {
                    path: '$vaccinations',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'vaccinations.vaccineAt': 1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    babyName: {
                        $first: '$name'
                    },
                    totalVaccinations: {
                        $sum: {
                            $cond: [
                                {
                                    // Learning Note:
                                    // $ne did not work as expected because after
                                    // $lookup + $unwind (preserveNullAndEmptyArrays),
                                    // the missing lookup result wasn't handled as intended.
                                    // $ifNull safely handles null/missing values here.
                                    $ifNull: ["$vaccinations", false]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    lastVaccination: {
                        $last: '$vaccinations.vaccineAt'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    babyName: 1,
                    totalVaccinations: 1,
                    lastVaccination: 1
                }
            }
        ]);
        return res.status(200).json(babyDashboard);
    }catch(error) {
        return next(error);
    }
}

module.exports = {
    getVaccinationReport,
    getBabyDashboard
}