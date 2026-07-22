const express = require('express');
const route = express.Router();

const { createDiaper } = require('../controllers/diaperController');

route.post('/', createDiaper);

module.exports = route;