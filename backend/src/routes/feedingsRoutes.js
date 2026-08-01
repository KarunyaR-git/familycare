const express = require('express');
const route = express.Router();

const { createFeeding, getAllFeedings, getfeedingById, updateFeedingById, deleteFeedingById } =  require('../controllers/feedingsController');

/**
 * @swagger
 * /feedings:
 *   post:
 *     summary: Add a new feeding record
 *     tags:
 *       - Feedings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *               - feedingAt
 *               - type
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               feedingAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               type:
 *                 type: string
 *                 enum:
 *                   - formula
 *                   - solid
 *                   - water
 *                   - other
 *                 example: formula
 *               foodName:
 *                 type: string
 *                 example: Ragi porridge
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               unit:
 *                 type: string
 *                 enum:
 *                   - ml
 *                   - oz
 *                   - gram
 *                   - spoon
 *                   - piece
 *                   - serving
 *                   - other
 *                 example: piece
 *               duration:
 *                 type: integer
 *                 example: 1
 *               breastfeedingSide:
 *                 type: string
 *                 enum:
 *                   - left
 *                   - right
 *                   - both
 *                 example: left
 *               notes:
 *                 type: string
 *                 example: drank well
 *     responses:
 *       201:
 *         description: Feeding details added successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Baby details not found
 *       500:
 *         description: Internal server error
 */
route.post('/', createFeeding);

/**
 * @swagger
 * /feedings:
 *   get:
 *     summary: Get all feeding records
 *     tags:
 *       - Feedings
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
 *         description: feeding type
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - feedingAt
 *             - type
 *             - quantity
 *             - duration
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
 *         description: Feeding details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllFeedings);

/**
 * @swagger
 * /feedings/{id}:
 *   get:
 *     summary: Get feeding record by id
 *     tags:
 *       - Feedings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feeding details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Feeding details not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getfeedingById);

/**
 * @swagger
 * /feedings/{id}:
 *   patch:
 *     summary: Update feeding record by id
 *     tags:
 *       - Feedings
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
 *               feedingAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               type:
 *                 type: string
 *                 enum:
 *                   - formula
 *                   - solid
 *                   - water
 *                   - other
 *                 example: formula
 *               foodName:
 *                 type: string
 *                 example: Ragi porridge
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               unit:
 *                 type: string
 *                 enum:
 *                   - ml
 *                   - oz
 *                   - gram
 *                   - spoon
 *                   - piece
 *                   - serving
 *                   - other
 *                 example: piece
 *               duration:
 *                 type: integer
 *                 example: 1
 *               breastfeedingSide:
 *                 type: string
 *                 enum:
 *                   - left
 *                   - right
 *                   - both
 *                 example: left
 *               notes:
 *                 type: string
 *                 example: drank well
 *     responses:
 *       200:
 *         description: Feeding details added successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Feeding details not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateFeedingById);

/**
 * @swagger
 * /feedings/{id}:
 *   delete:
 *     summary: Delete feeding record by id
 *     tags:
 *       - Feedings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Feeding details deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Feeding details not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteFeedingById);

module.exports = route;