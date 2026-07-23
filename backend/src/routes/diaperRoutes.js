const express = require('express');
const route = express.Router();

const { createDiaper, getAllDiapers, getDiaperById, updateDiaperById,deleteDiaperById } = require('../controllers/diaperController');

route.post('/', createDiaper);
route.get('/', getAllDiapers);
route.get('/:id', getDiaperById);
route.patch('/:id', updateDiaperById);
route.delete('/:id', deleteDiaperById);

module.exports = route;