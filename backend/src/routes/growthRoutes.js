const express = require('express');
const route = express.Router();

const { createGrowthRecord, getAllGrowthRecords, getGrowthRecordById, updateGrowthRecordById, deleteGrowthRecordById } = require('../controllers/growthController');

route.post('/', createGrowthRecord);
route.get('/', getAllGrowthRecords);
route.get('/:id', getGrowthRecordById);
route.patch('/:id', updateGrowthRecordById);
route.delete('/:id', deleteGrowthRecordById)

module.exports = route;