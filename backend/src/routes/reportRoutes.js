const express = require('express');
const route = express.Router();

const { getVaccinationReport, getBabyDashboard, getFeedingSummary, getGrowthDashboard } = require('../controllers/reportController');

route.get('/vaccinations', getVaccinationReport);
route.get('/baby-dashboard', getBabyDashboard);
route.get('/feeding-summary', getFeedingSummary);
route.get('/growth-dashboard', getGrowthDashboard);

module.exports = route;