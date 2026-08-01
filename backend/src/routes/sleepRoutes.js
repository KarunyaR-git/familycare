const express = require('express');
const route = express.Router();

const { createSleepRecord, getAllSleepRecords, getSleepRecordById, updateSleepRecordById, deleteSleepRecordById } = require('../controllers/sleepController');

/**
 * @swagger
 * /sleeps:
 *   post:
 *     summary: Add a new sleep record
 *     tags:
 *       - Sleeps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyId
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               sleptAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               sleepNotes:
 *                 type: string
 *                 example: Slept early
 *               wokeUpAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               wokeUpNotes:
 *                 type: string
 *                 example: Slept early
 *               durationMinutes:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       201:
 *         description: Sleep details added successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Sleep details not found
 *       500:
 *         description: Internal server error
 */
route.post('/', createSleepRecord);

/**
 * @swagger
 * /sleeps:
 *   get:
 *     summary: Get all sleep records
 *     tags:
 *       - Sleeps
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
 *             - sleptAt
 *             - wokeUpAt
 *             - durationMinutes
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
 *         description: Sleep details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
route.get('/', getAllSleepRecords);

/**
 * @swagger
 * /sleeps/{id}:
 *   get:
 *     summary: Get sleep record by id
 *     tags:
 *       - Sleeps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sleep details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Sleep details not found
 *       500:
 *         description: Internal server error
 */
route.get('/:id', getSleepRecordById);

/**
 * @swagger
 * /sleeps/{id}:
 *   patch:
 *     summary: Update sleep record by id
 *     tags:
 *       - Sleeps
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
 *             properties:
 *               babyId:
 *                 type: string
 *                 example: 689d1f8a1234567890afcdef
 *               sleptAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               sleepNotes:
 *                 type: string
 *                 example: Slept early
 *               wokeUpAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               wokeUpNotes:
 *                 type: string
 *                 example: Slept early
 *               durationMinutes:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       200:
 *         description: Sleep details updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Sleep details not found
 *       500:
 *         description: Internal server error
 */
route.patch('/:id', updateSleepRecordById);

/**
 * @swagger
 * /sleeps/{id}:
 *   delete:
 *     summary: Delete sleep record by id
 *     tags:
 *       - Sleeps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sleep details deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Sleep details not found
 *       500:
 *         description: Internal server error
 */
route.delete('/:id', deleteSleepRecordById);

module.exports = route;