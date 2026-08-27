const express = require('express');
const route = express.Router();

const { getDashboardDetails, getBabyDetailsById, getTodayActivities, getReportById } = require('../controllers/homeController');

route.get('/', getDashboardDetails);
route.get('/:babyId', getBabyDetailsById);
route.get('/:babyId/today-activities', getTodayActivities);
route.get('/:babyId/report', getReportById);

module.exports = route;