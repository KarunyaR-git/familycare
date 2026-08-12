const express = require('express');
const route = express.Router();

const { getDashboardDetails, getBabyDetailsById } = require('../controllers/homeController');

route.get('/', getDashboardDetails);
route.get('/:id', getBabyDetailsById);

module.exports = route;