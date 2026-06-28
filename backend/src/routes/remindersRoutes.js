const express = require('express');
const router = express.Router();

const {createReminder, getAllReminders, getReminderById} = require('../controllers/remindersController')

router.post('/', createReminder);
router.get('/', getAllReminders);
router.get('/:id', getReminderById)

module.exports = router;