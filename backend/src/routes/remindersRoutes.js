const express = require('express');
const router = express.Router();

const {createReminder, getAllReminders, getReminderById, updateReminderById} = require('../controllers/remindersController')

router.post('/', createReminder);
router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.put('/:id', updateReminderById);

module.exports = router;