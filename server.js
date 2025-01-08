const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const emailsRouter = require('./controllers/emails.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

app.use(cors({
    origin: [ 'http://localhost:5173', 'http://127.0.0.1:5173' ], // Frontend URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

app.get('/', (req, res) => {
    res.send('Backend is working!');
});


// Routes go here
app.use('/test-jwt', testJWTRouter);

app.use('/users', usersRouter);

app.use('/emails', emailsRouter);


app.listen(5000, () => {
    console.log('The express app is ready!');
});