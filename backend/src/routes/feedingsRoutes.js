const express = require('express');
const route = express.Router();

const { createFeeding, getAllFeedings, getfeedingById, updateFeedingById } =  require('../controllers/feedingsController');

route.post('/', createFeeding);
route.get('/', getAllFeedings);
route.get('/:id', getfeedingById);
route.patch('/:id', updateFeedingById);

module.exports = route;