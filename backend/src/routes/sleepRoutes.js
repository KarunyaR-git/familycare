const express = require('express');
const route = express.Router();

const { createSleepRecord } = require('../controllers/sleepController');

route.post('/', createSleepRecord);

module.exports = route;