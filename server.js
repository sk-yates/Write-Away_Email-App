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

app.use(express.json());

app.use(cors({
    origin: [ 'http://localhost:5173', 'http://127.0.0.1:5173','https://678c31c53960ed28a726077a--write-away-email-practice.netlify.app' ], // Frontend URL
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

app.use('/replies', repliesRouter);


app.listen(process.env.PORT, () => {
    console.log('The express app is ready!');
});