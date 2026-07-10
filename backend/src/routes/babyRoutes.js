const express = require('express');
const route = express.Router();

const { createBaby, getAllBabies, getBabyById, updateBabyById, deleteBabyById } = require('../controllers/babyController');

route.post('/', createBaby);
route.get('/', getAllBabies);
route.get('/:id', getBabyById);
route.patch('/:id', updateBabyById);
route.delete('/:id', deleteBabyById);

module.exports = route;