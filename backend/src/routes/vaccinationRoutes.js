const express = require('express');
const route = express.Router();

const { createVaccination, getAllVaccinations, getVaccinationById, updateVaccinationRecordById, deleteVaccinationRecordById } = require('../controllers/vaccinationController');

/**
 * @swagger
 * /vaccinations:
 *   post:
 *     summary: Add a new vaccination record
 *     tags:
 *       - Vaccinations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *               - vaccineAt
 *               - name
 *               - doseNumber
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               vaccineAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               name:
 *                 type: string
 *                 example: Polio
 *               doseNumber:
 *                 type: integer
 *                 example: 1
 *               notes:
 *                 type: string
 *                 example: Vaccination completed successfully
 *     responses:
 *       201:
 *         description: Vaccination details added successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Baby details not found
 *       500:
 *         description: Internal server error
 */
route.post('/', createVaccination);

/**
 * @swagger
 * /vaccinations:
 *   get:
 *     summary: Get all vaccination records
 *     tags:
 *       - Vaccinations
 *     parameters:
 *       - in: query
 *         name: babyId
 *         required: false
 *         schema:
 *           type: string
 *         description: baby id
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: feeding type
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - vaccineAt
 *             - name
 *             - doseNumber
 *         description: sortby the respective field
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: sort the records by respective order
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1  
 *         description: page number to display the list
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: restrict the data to display per page
 *     responses:
 *       200:
 *         description: Vaccination details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllVaccinations);

/**
 * @swagger
 * /vaccinations/{id}:
 *   get:
 *     summary: Get vaccination record by id
 *     tags:
 *       - Vaccinations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Vaccination details not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getVaccinationById);

/**
 * @swagger
 * /vaccinations/{id}:
 *   patch:
 *     summary: Update new vaccination record
 *     tags:
 *       - Vaccinations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *               - vaccineAt
 *               - name
 *               - doseNumber
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               vaccineAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               name:
 *                 type: string
 *                 example: Polio
 *               doseNumber:
 *                 type: integer
 *                 example: 1
 *               notes:
 *                 type: string
 *                 example: Vaccination completed successfully
 *     responses:
 *       200:
 *         description: Vaccination details updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Vaccination details not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateVaccinationRecordById)

/**
 * @swagger
 * /vaccinations/{id}:
 *   delete:
 *     summary: Delete vaccination record by id
 *     tags:
 *       - Vaccinations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vaccination details deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Vaccination details not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteVaccinationRecordById);

module.exports = route;