const express = require('express');
const route = express.Router();

const { createFeeding, getAllFeedings, getfeedingById, updateFeedingById, deleteFeedingById } =  require('../controllers/feedingsController');

route.post('/', createFeeding);
route.get('/', getAllFeedings);
route.get('/:id', getfeedingById);
route.patch('/:id', updateFeedingById);
route.delete('/:id', deleteFeedingById);

module.exports = route;