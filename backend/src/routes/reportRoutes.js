const express = require('express');
const route = express.Router();

const { getVaccinationReport, getBabyDashboard } = require('../controllers/reportController');

route.get('/vaccinations', getVaccinationReport);
route.get('/baby-dashboard', getBabyDashboard);

module.exports = route;