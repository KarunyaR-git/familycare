const express = require('express');
const route = express.Router();

const { createVaccination, getAllVaccinations, getVaccinationById, updateVaccinationRecordById, deleteVaccinationRecordById } = require('../controllers/vaccinationController');

route.post('/', createVaccination);
route.get('/', getAllVaccinations);
route.get('/:id', getVaccinationById);
route.patch('/:id', updateVaccinationRecordById)
route.delete('/:id', deleteVaccinationRecordById);

module.exports = route;