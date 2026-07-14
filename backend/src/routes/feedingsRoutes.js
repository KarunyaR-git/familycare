const express = require('express');
const route = express.Router();

const { createFeeding, getAllFeedings } =  require('../controllers/feedingsController');

route.post('/', createFeeding);
route.get('/', getAllFeedings);

module.exports = route;