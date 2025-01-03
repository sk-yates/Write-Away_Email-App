const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connect', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const emailsRouter = require('./controllers/emails.js');

app.use(express.json());

app.use('/emails', emailsRouter);

// Routes



app.listen(3000, () => {
    console.log('The express app is ready!');
});