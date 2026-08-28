const express = require('express');
const router = express.Router();

const {createReminder, getAllReminders, getReminderById, updateReminderById, deleteReminderById, updateNotifiedAtById, getScheduledReminders} = require('../controllers/remindersController')

/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Add a new reminder record
 *     tags:
 *       - Reminders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - reminderAt
 *             properties:
 *               title:
 *                 type: string
 *                 example: Vaccination at 8AM
 *               reminderAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               description:
 *                 type: string
 *                 example: Need to visit hospital for vaccination
 *               reminderBefore:
 *                 type: integer
 *                 default: 60
 *                 example: 20
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - completed
 *                 default: pending
 *                 example: pending
 *     responses:
 *       201:
 *         description: Reminder details added successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.post('/', createReminder);

/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Get all reminder records
 *     tags:
 *       - Reminders
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - title
 *             - status
 *             - reminderAt
 *             - reminderBefore
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
 *         description: Reminder details retrieved successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllReminders);

router.get('/scheduled', getScheduledReminders);

/**
 * @swagger
 * /reminders/{id}:
 *   get:
 *     summary: Get reminder record by id
 *     tags:
 *       - Reminders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reminder details retrieved successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Reminder details not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getReminderById);

/**
 * @swagger
 * /reminders/{id}:
 *   put:
 *     summary: Update reminder record by id
 *     tags:
 *       - Reminders
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
 *               title:
 *                 type: string
 *                 example: Vaccination at 8AM
 *               reminderAt:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               description:
 *                 type: string
 *                 example: Need to visit hospital for vaccination
 *               reminderBefore:
 *                 type: integer
 *                 default: 60
 *                 example: 20
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - completed
 *                 default: pending
 *                 example: pending
 *     responses:
 *       200:
 *         description: Reminder details updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Reminder details not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateReminderById);

router.patch('/:id/notified', updateNotifiedAtById)

/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     summary: Delete reminder record by id
 *     tags:
 *       - Reminders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reminder details deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Reminder details not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteReminderById);

module.exports = router; 