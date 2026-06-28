const express = require('express');

const app = express();
const authRouter = require('./routes/authRoutes');
const remindersRouter = require('./routes/remindersRoutes')
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authHandler');
const mongoose = require('mongoose');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('FamilyCare Backend Running');
});

app.use('/reminders', auth, remindersRouter);

app.use('/auth', authRouter);

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/familycare')
.then(()=>{
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    })
})
.catch((error) => {
    console.error('MongoDB connection failed:', error);
});


