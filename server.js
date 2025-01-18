const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const emailsRouter = require('./controllers/emails.js');
const repliesRouter = require('./controllers/replies.js')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is working!');
});


// Routes go here
app.use('/test-jwt', testJWTRouter);

app.use('/users', usersRouter);

app.use('/emails', emailsRouter);

app.use('/replies', repliesRouter);


app.listen(process.env.PORT, () => {
    console.log('The express app is ready!');
});