const express = require('express');
const route = express.Router();

const { createGrowthRecord, getAllGrowthRecords, getGrowthRecordById, updateGrowthRecordById, deleteGrowthRecordById } = require('../controllers/growthController');

/**
 * @swagger
 * /growths:
 *   post:
 *     summary: Add a new growth record
 *     tags:
 *       - Growths
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *               - measuredAt
 *               - weight
 *               - height
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               measuredAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               weight:
 *                 type: integer
 *                 example: 8
 *               height:
 *                 type: integer
 *                 example: 20
 *               notes:
 *                 type: string
 *                 example: Measured early in the morning
 *     responses:
 *       201:
 *         description: Growth details added successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Baby details not found
 *       500:
 *         description: Internal server error
 */
route.post('/', createGrowthRecord);

/**
 * @swagger
 * /growths:
 *   get:
 *     summary: Get all growth records
 *     tags:
 *       - Growths
 *     parameters:
 *       - in: query
 *         name: babyId
 *         required: false
 *         schema:
 *           type: string
 *         description: baby id
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - measuredAt
 *             - weight
 *             - height
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
 *         description: Growth details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllGrowthRecords);

/**
 * @swagger
 * /growths/{id}:
 *   get:
 *     summary: Get growth record by id
 *     tags:
 *       - Growths
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Growth details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Growth details not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getGrowthRecordById);

/**
 * @swagger
 * /growths/{id}:
 *   patch:
 *     summary: Update growth record by id
 *     tags:
 *       - Growths
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
 *               measuredAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               weight:
 *                 type: integer
 *                 example: 8
 *               height:
 *                 type: integer
 *                 example: 20
 *               notes:
 *                 type: string
 *                 example: Measured early in the morning
 *     responses:
 *       200:
 *         description: Growth details updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Growth details not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateGrowthRecordById);

/**
 * @swagger
 * /growths/{id}:
 *   delete:
 *     summary: Delete growth record by id
 *     tags:
 *       - Growths
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Growth details deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Growth details not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteGrowthRecordById)

module.exports = route;