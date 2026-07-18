const express = require('express');

const app = express();

const authRouter = require('./src/routes/authRoutes');
const remindersRouter = require('./src/routes/remindersRoutes')
const babyRouter = require('./src/routes/babyRoutes');
const feedingRouter = require('./src/routes/feedingsRoutes');
const sleepRouter = require('./src/routes/sleepRoutes');

const errorHandler = require('./src/middleware/errorHandler');
const auth = require('./src/middleware/authHandler');

const mongoose = require('mongoose');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('FamilyCare Backend Running');
});

app.use('/reminders', auth, remindersRouter);

app.use('/babies', auth, babyRouter);

app.use('/feedings', auth, feedingRouter);

app.use('/sleeps', auth, sleepRouter);

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


