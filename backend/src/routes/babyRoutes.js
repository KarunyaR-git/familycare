const express = require('express');
const route = express.Router();

const { createBaby } = require('../controllers/babyController');

route.post('/', createBaby);

module.exports = route;