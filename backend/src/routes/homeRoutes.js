const express = require('express');
const route = express.Router();

const { getDashboardDetails, getBabyDetailsById, getTodayActivities } = require('../controllers/homeController');

route.get('/', getDashboardDetails);
route.get('/:babyId', getBabyDetailsById);
route.get('/:babyId/today-activities', getTodayActivities);

module.exports = route;