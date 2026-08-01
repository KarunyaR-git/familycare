const express = require('express');
const route = express.Router();

const { getVaccinationReport, getBabyDashboard, getFeedingSummary, getGrowthDashboard } = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports/vaccinations:
 *   get:
 *     summary: Get vaccination report
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Vaccination Reports retrieved successfully
 *       500:
 *         description: Internal server error
 */
route.get('/vaccinations', getVaccinationReport);

/**
 * @swagger
 * /api/reports/baby-dashboard:
 *   get:
 *     summary: Get baby dashboard
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Baby dashboard retrieved successfully
 *       500:
 *         description: Internal server error
 */
route.get('/baby-dashboard', getBabyDashboard);

/**
 * @swagger
 * /api/reports/feeding-summary:
 *   get:
 *     summary: Get feeding summary
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Feeding summary retrieved successfully
 *       500:
 *         description: Internal server error
 */
route.get('/feeding-summary', getFeedingSummary);

/**
 * @swagger
 * /api/reports/growth-dashboard:
 *   get:
 *     summary: Get growth dashboard
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Growth dashboard retrieved successfully
 *       500:
 *         description: Internal server error
 */
route.get('/growth-dashboard', getGrowthDashboard);

module.exports = route;