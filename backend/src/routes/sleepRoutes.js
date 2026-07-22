const express = require('express');
const route = express.Router();

const { createSleepRecord, getAllSleepRecords, getSleepRecordById, updateSleepRecordById, deleteSleepRecordById } = require('../controllers/sleepController');

route.post('/', createSleepRecord);
route.get('/', getAllSleepRecords);
route.get('/:id', getSleepRecordById);
route.patch('/:id', updateSleepRecordById);
route.delete('/:id', deleteSleepRecordById);

module.exports = route;