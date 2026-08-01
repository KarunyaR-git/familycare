const express = require('express');
const route = express.Router();

const { createDiaper, getAllDiapers, getDiaperById, updateDiaperById,deleteDiaperById } = require('../controllers/diaperController');

/**
 * @swagger
 * /diapers:
 *   post:
 *     summary: Add a new diaper
 *     tags:
 *       - Diapers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *               - changedAt
 *               - type
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               changedAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               type:
 *                 type: string
 *                 enum:
 *                   - wet
 *                   - dirty
 *                   - both
 *                 example: wet
 *               notes:
 *                 type: string
 *                 example: "pooped well"
 *     responses:
 *       201:
 *         description: Diaper added successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.post('/', createDiaper);

/**
 * @swagger
 * /diapers:
 *   get:
 *     summary: Get all diaper records
 *     tags:
 *       - Diapers
 *     parameters:
 *       - in: query
 *         name: babyId
 *         required: false
 *         schema:
 *           type: string
 *         description: baby id
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: diaper type
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - changedAt
 *             - type
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
 *         description: Diapers details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllDiapers);

/**
 * @swagger
 * /diapers/{id}:
 *   get:
 *     summary: Get a diaper details by id
 *     tags:
 *       - Diapers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diaper details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Diaper details not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getDiaperById);

/**
 * @swagger
 * /diapers/{id}:
 *   patch:
 *     summary: Update a diaper detail
 *     tags:
 *       - Diapers
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
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               changedAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               type:
 *                 type: string
 *                 enum:
 *                   - wet
 *                   - dirty
 *                   - both
 *                 example: wet
 *               notes:
 *                 type: string
 *                 example: "pooped well"
 *     responses:
 *       200:
 *         description: Diaper updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Diaper details not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateDiaperById);

/**
 * @swagger
 * /diapers/{id}:
 *   delete:
 *     summary: Delete diaper record
 *     tags:
 *       - Diapers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Diaper deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Diaper details not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteDiaperById);

module.exports = route;